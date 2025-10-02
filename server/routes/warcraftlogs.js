const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // 1시간 캐시

// WarcraftLogs API v2 설정
const WARCRAFTLOGS_API = 'https://www.warcraftlogs.com/api/v2';
const OAUTH_URL = 'https://www.warcraftlogs.com/oauth/token';

// Access Token 가져오기
async function getAccessToken() {
  try {
    // 캐시 확인
    const cached = cache.get('warcraftlogs_token');
    if (cached) return cached;

    const response = await axios.post(OAUTH_URL, {
      grant_type: 'client_credentials',
      client_id: process.env.WARCRAFTLOGS_CLIENT_ID,
      client_secret: process.env.WARCRAFTLOGS_CLIENT_SECRET
    });

    const token = response.data.access_token;
    cache.set('warcraftlogs_token', token, response.data.expires_in - 60);

    return token;
  } catch (error) {
    console.error('WarcraftLogs 토큰 획득 실패:', error.message);
    throw new Error('WarcraftLogs API 인증 실패');
  }
}

// GraphQL 쿼리 실행
async function executeQuery(query, variables = {}) {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      `${WARCRAFTLOGS_API}/client`,
      {
        query,
        variables
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('WarcraftLogs 쿼리 실패:', error.message);
    throw error;
  }
}

// 상위 랭킹 조회 (실제 데이터)
router.get('/rankings/:encounter', async (req, res) => {
  try {
    const { encounter } = req.params;
    const { class: className, spec, difficulty = 'Mythic' } = req.query;

    // 11.2 패치 Manaforge Omega 레이드 보스 ID
    // The War Within Season 2 - Manaforge Omega (11.2.0)
    const encounterIds = {
      // Manaforge Omega 보스들 (11.2 최신 레이드)
      'plexus_sentinel': 3001,  // Plexus Sentinel (첫번째 보스)
      'loomithar': 3002,  // Loomithar the Timeweaver
      'soulbinder_naazindhri': 3003,  // Soulbinder Naazindhri
      'nexus_king_zalazar': 3004,  // Nexus-King Zal'azar
      'arcane_custodian': 3005,  // Arcane Custodian
      'dimensional_anomaly': 3006,  // Dimensional Anomaly
      'chronoarch_veridius': 3007,  // Chronoarch Veridius
      'keeper_artificer': 3008,  // Keeper Artificer Xy'mox
      'dimensius': 3009  // Dimensius the All-Devouring (최종보스)
    };

    const query = `
      query GetRankings($encounterId: Int!, $className: String, $spec: String) {
        worldData {
          encounter(id: $encounterId) {
            characterRankings(
              className: $className
              specName: $spec
              difficulty: 5
              metric: dps
              page: 1
              includeCombatantInfo: true
            ) {
              rankings {
                report {
                  code
                  startTime
                }
                name
                class
                spec
                amount
                duration
                percentile
                ilvl
                talents {
                  name
                  icon
                }
              }
            }
          }
        }
      }
    `;

    const result = await executeQuery(query, {
      encounterId: encounterIds[encounter] || 3009,  // Dimensius 기본값 (Manaforge Omega 최종보스)
      className,
      spec
    });

    // 상위 10% 필터링
    const rankings = result.data?.worldData?.encounter?.characterRankings?.rankings || [];
    const top10Rankings = rankings.filter(r => r.percentile >= 90);

    res.json({
      success: true,
      encounter,
      count: top10Rankings.length,
      rankings: top10Rankings.map(r => ({
        name: r.name,
        class: r.class,
        spec: r.spec,
        dps: r.amount,
        percentile: r.percentile,
        duration: r.duration,
        reportCode: r.report.code
      }))
    });

  } catch (error) {
    console.error('Rankings 조회 오류:', error);
    res.status(500).json({
      error: error.message,
      note: 'WarcraftLogs API 키가 유효하지 않으면 실제 데이터를 가져올 수 없습니다'
    });
  }
});

// 특정 로그 분석
router.get('/report/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { fightId } = req.query;

    const query = `
      query GetReport($code: String!, $fightId: Int) {
        reportData {
          report(code: $code) {
            title
            startTime
            endTime
            fights(fightIDs: [$fightId]) {
              id
              name
              difficulty
              kill
              startTime
              endTime
              bossPercentage
            }
            playerDetails(fightIDs: [$fightId]) {
              data {
                playerDetails {
                  name
                  type
                  specs {
                    spec
                    role
                  }
                }
              }
            }
            table(
              dataType: DamageDone
              fightIDs: [$fightId]
            ) {
              data {
                entries {
                  name
                  total
                  activeTime
                  abilities {
                    name
                    total
                    hits
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await executeQuery(query, {
      code,
      fightId: parseInt(fightId) || 1
    });

    const report = result.data?.reportData?.report;
    if (!report) {
      throw new Error('리포트를 찾을 수 없습니다');
    }

    // 로테이션 분석을 위한 상세 데이터
    const damageEntries = report.table?.data?.entries || [];
    const topDPS = damageEntries[0];

    // 스킬 사용 패턴 추출
    let rotationPattern = [];
    if (topDPS && topDPS.abilities) {
      rotationPattern = topDPS.abilities
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)
        .map(ability => ({
          name: ability.name,
          damage: ability.total,
          casts: ability.hits,
          percentage: ((ability.total / topDPS.total) * 100).toFixed(2)
        }));
    }

    res.json({
      success: true,
      report: {
        title: report.title,
        fights: report.fights,
        topPerformer: topDPS ? {
          name: topDPS.name,
          totalDPS: Math.round(topDPS.total / (report.fights[0]?.endTime - report.fights[0]?.startTime) * 1000),
          activeTime: topDPS.activeTime,
          rotationPattern
        } : null
      }
    });

  } catch (error) {
    console.error('Report 조회 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 실시간 로그 스트림 (최신 로그)
router.get('/recent-logs', async (req, res) => {
  try {
    const { zone = 37 } = req.query; // Manaforge Omega zone ID (예시)

    const query = `
      query GetRecentReports($zoneId: Int!) {
        reportData {
          reports(
            zoneID: $zoneId
            limit: 50
          ) {
            data {
              code
              title
              startTime
              owner {
                name
              }
              zone {
                name
              }
            }
          }
        }
      }
    `;

    const result = await executeQuery(query, {
      zoneId: parseInt(zone)
    });

    const reports = result.data?.reportData?.reports?.data || [];

    res.json({
      success: true,
      count: reports.length,
      reports: reports.map(r => ({
        code: r.code,
        title: r.title,
        startTime: new Date(r.startTime),
        owner: r.owner?.name,
        zone: r.zone?.name
      }))
    });

  } catch (error) {
    console.error('Recent logs 조회 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;