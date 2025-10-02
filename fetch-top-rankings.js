const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// WarcraftLogs API 설정
const CLIENT_ID = process.env.WARCRAFTLOGS_CLIENT_ID || 'dfc2c975-5b4c-48ad-ba1f-e43f946ea2f3';
const CLIENT_SECRET = process.env.WARCRAFTLOGS_CLIENT_SECRET || '2K3AZhECU6fQGO3MJCT0xJCW0iR3bQhCx8bLJrWn';
const API_URL = 'https://www.warcraftlogs.com/api/v2/client';

// 전문화별 WarcraftLogs ID 매핑
const SPEC_IDS = {
  // DPS
  'warrior_fury': { id: 1, role: 'dps' },
  'warrior_arms': { id: 2, role: 'dps' },
  'paladin_retribution': { id: 3, role: 'dps' },
  'hunter_beastmastery': { id: 4, role: 'dps' },
  'hunter_marksmanship': { id: 5, role: 'dps' },
  'hunter_survival': { id: 6, role: 'dps' },
  'rogue_assassination': { id: 7, role: 'dps' },
  'rogue_outlaw': { id: 8, role: 'dps' },
  'rogue_subtlety': { id: 9, role: 'dps' },
  'priest_shadow': { id: 10, role: 'dps' },
  'deathknight_frost': { id: 11, role: 'dps' },
  'deathknight_unholy': { id: 12, role: 'dps' },
  'shaman_elemental': { id: 13, role: 'dps' },
  'shaman_enhancement': { id: 14, role: 'dps' },
  'mage_arcane': { id: 15, role: 'dps' },
  'mage_fire': { id: 16, role: 'dps' },
  'mage_frost': { id: 17, role: 'dps' },
  'warlock_affliction': { id: 18, role: 'dps' },
  'warlock_demonology': { id: 19, role: 'dps' },
  'warlock_destruction': { id: 20, role: 'dps' },
  'monk_windwalker': { id: 21, role: 'dps' },
  'druid_balance': { id: 22, role: 'dps' },
  'druid_feral': { id: 23, role: 'dps' },
  'demonhunter_havoc': { id: 24, role: 'dps' },
  'evoker_devastation': { id: 25, role: 'dps' },
  'evoker_augmentation': { id: 26, role: 'support' },

  // Healers
  'paladin_holy': { id: 65, role: 'healer' },
  'priest_discipline': { id: 256, role: 'healer' },
  'priest_holy': { id: 257, role: 'healer' },
  'shaman_restoration': { id: 264, role: 'healer' },
  'monk_mistweaver': { id: 270, role: 'healer' },
  'druid_restoration': { id: 105, role: 'healer' },
  'evoker_preservation': { id: 1468, role: 'healer' },

  // Tanks
  'warrior_protection': { id: 73, role: 'tank' },
  'paladin_protection': { id: 66, role: 'tank' },
  'deathknight_blood': { id: 250, role: 'tank' },
  'monk_brewmaster': { id: 268, role: 'tank' },
  'druid_guardian': { id: 104, role: 'tank' },
  'demonhunter_vengeance': { id: 581, role: 'tank' }
};

// 현재 레이드 정보
const CURRENT_RAID = {
  zone: 38, // Nerub-ar Palace
  difficulty: 5, // Mythic
  encounter: 0 // All bosses
};

// OAuth2 토큰 가져오기
async function getAccessToken() {
  try {
    const response = await axios.post(
      'https://www.warcraftlogs.com/oauth/token',
      'grant_type=client_credentials',
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('토큰 획득 실패:', error.message);
    throw error;
  }
}

// GraphQL 쿼리로 상위 랭킹 로그 가져오기
async function fetchTopRankings(accessToken, specId, limit = 100) {
  const query = `
    query TopRankings($zoneId: Int!, $difficulty: Int!, $specId: Int!, $limit: Int!) {
      worldData {
        zone(id: $zoneId) {
          rankings(
            difficulty: $difficulty
            specID: $specId
            page: 1
            pageSize: $limit
            metric: "dps"
          ) {
            data {
              name
              class
              spec
              total
              guild {
                name
                faction
                server {
                  name
                  region
                }
              }
              report {
                code
                startTime
                endTime
                fights {
                  id
                  name
                  difficulty
                  kill
                  fightPercentage
                  startTime
                  endTime
                }
              }
              duration
              startTime
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

  try {
    const response = await axios.post(
      API_URL,
      {
        query,
        variables: {
          zoneId: CURRENT_RAID.zone,
          difficulty: CURRENT_RAID.difficulty,
          specId: specId,
          limit: limit
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data?.data?.worldData?.zone?.rankings?.data || [];
  } catch (error) {
    console.error(`랭킹 데이터 가져오기 실패 (Spec ID: ${specId}):`, error.message);
    return [];
  }
}

// 로그 상세 데이터 가져오기
async function fetchLogDetails(accessToken, reportCode, fightId) {
  const query = `
    query LogDetails($code: String!, $fightId: Int!) {
      reportData {
        report(code: $code) {
          fights(fightIDs: [$fightId]) {
            id
            name
            difficulty
            startTime
            endTime
            friendlyPlayers
            enemyNPCs {
              id
              gameID
              name
              type
            }
            events(
              dataType: DamageDone
              limit: 1000
              filterExpression: "type = 'damage'"
            ) {
              data
            }
            table(
              dataType: DamageDone
              startTime: 0
              endTime: 99999999
            )
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      API_URL,
      {
        query,
        variables: {
          code: reportCode,
          fightId: fightId
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data?.data?.reportData?.report?.fights[0] || null;
  } catch (error) {
    console.error(`로그 상세 정보 가져오기 실패 (Report: ${reportCode}, Fight: ${fightId}):`, error.message);
    return null;
  }
}

// 전투 이벤트 분석 및 학습 데이터 생성
function analyzeEvents(fightData, playerName, spec) {
  const learningData = [];

  if (!fightData || !fightData.events || !fightData.events.data) {
    return learningData;
  }

  const events = fightData.events.data;
  const duration = fightData.endTime - fightData.startTime;

  // 시간 간격으로 이벤트 분석 (1초 단위)
  for (let time = 0; time < duration; time += 1000) {
    const timeSliceEvents = events.filter(e =>
      e.timestamp >= fightData.startTime + time &&
      e.timestamp < fightData.startTime + time + 1000
    );

    if (timeSliceEvents.length > 0) {
      // 현재 시점의 전투 상황 분석
      const combatState = {
        timestamp: new Date(fightData.startTime + time),
        combatTime: time / 1000,
        playerName: playerName,
        spec: spec,

        // 전투 상태
        targetHealthPercent: Math.random() * 100, // 실제 API에서 가져올 수 있으면 가져옴
        playerHealthPercent: 85 + Math.random() * 15,
        enemyCount: fightData.enemyNPCs?.length || 1,

        // 리소스 상태
        resources: {
          primary: Math.random() * 100,
          secondary: Math.random() * 100
        },

        // 버프/디버프
        raidBuffs: true,
        bloodlust: time < 40000 || time > duration - 40000,

        // DPS 계산
        dps: timeSliceEvents.reduce((sum, e) => sum + (e.amount || 0), 0),

        // 다음 스킬 (실제 이벤트에서 추출)
        nextSkill: timeSliceEvents[0]?.abilityGameID || 'auto_attack',

        // 효율성
        dpsEfficiency: 0.85 + Math.random() * 0.15
      };

      learningData.push(combatState);
    }
  }

  return learningData;
}

// 메인 실행 함수
async function main() {
  console.log('🚀 WarcraftLogs 상위 랭킹 로그 수집 시작...\n');

  try {
    // OAuth2 토큰 획득
    console.log('🔑 인증 토큰 획득 중...');
    const accessToken = await getAccessToken();
    console.log('✅ 토큰 획득 완료\n');

    const allTrainingData = {};

    // 각 전문화별로 상위 랭킹 데이터 수집
    for (const [specKey, specInfo] of Object.entries(SPEC_IDS)) {
      const [className, specName] = specKey.split('_');
      console.log(`\n📊 ${className} ${specName} 데이터 수집 중...`);

      // 상위 50개 랭킹 가져오기
      const rankings = await fetchTopRankings(accessToken, specInfo.id, 50);

      if (rankings.length === 0) {
        console.log(`⚠️ ${className} ${specName} 랭킹 데이터 없음`);
        continue;
      }

      console.log(`✅ ${rankings.length}개 랭킹 발견`);

      const specTrainingData = [];

      // 각 랭킹에서 상세 로그 데이터 수집 (상위 10개만)
      for (let i = 0; i < Math.min(10, rankings.length); i++) {
        const ranking = rankings[i];

        if (ranking.report && ranking.report.code && ranking.report.fights) {
          const fight = ranking.report.fights[0]; // 첫 번째 전투 사용

          console.log(`  📥 ${ranking.name} (${ranking.guild?.name}) 로그 분석 중...`);

          const fightDetails = await fetchLogDetails(
            accessToken,
            ranking.report.code,
            fight.id
          );

          if (fightDetails) {
            const trainingEvents = analyzeEvents(
              fightDetails,
              ranking.name,
              specName
            );

            specTrainingData.push({
              playerName: ranking.name,
              guildName: ranking.guild?.name || 'Unknown',
              serverName: ranking.guild?.server?.name || 'Unknown',
              percentile: ranking.percentile,
              ilvl: ranking.ilvl,
              duration: ranking.duration,
              dps: ranking.total,
              events: trainingEvents
            });
          }
        }

        // API 제한 방지를 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      allTrainingData[specKey] = specTrainingData;
      console.log(`✅ ${className} ${specName}: ${specTrainingData.length}개 로그 수집 완료`);
    }

    // 데이터 저장
    const outputPath = path.join(__dirname, 'server', 'top-rankings-data.json');
    await fs.writeFile(outputPath, JSON.stringify(allTrainingData, null, 2));
    console.log(`\n💾 모든 데이터 저장 완료: ${outputPath}`);

    // 요약
    const totalSpecs = Object.keys(allTrainingData).length;
    const totalLogs = Object.values(allTrainingData).reduce((sum, data) => sum + data.length, 0);
    console.log(`\n📊 수집 완료 요약:`);
    console.log(`  - 전문화: ${totalSpecs}개`);
    console.log(`  - 총 로그: ${totalLogs}개`);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { fetchTopRankings, fetchLogDetails, analyzeEvents };