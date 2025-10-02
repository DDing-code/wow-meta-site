// WarcraftLogs API Integration Service
import axios from 'axios';

const API_BASE_URL = 'https://www.warcraftlogs.com/api/v2';
const CLIENT_ID = process.env.REACT_APP_WARCRAFT_LOGS_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_WARCRAFT_LOGS_CLIENT_SECRET;

class WarcraftLogsAPI {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // OAuth2 인증
  async authenticate() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      const response = await axios.post('https://www.warcraftlogs.com/oauth/token', {
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('WarcraftLogs 인증 실패:', error);
      throw error;
    }
  }

  // GraphQL 쿼리 실행
  async query(graphqlQuery, variables = {}) {
    const token = await this.authenticate();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/client`,
        {
          query: graphqlQuery,
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
      console.error('GraphQL 쿼리 실패:', error);
      throw error;
    }
  }

  // 특정 로그 가져오기
  async getReport(reportCode) {
    const query = `
      query GetReport($code: String!) {
        reportData {
          report(code: $code) {
            title
            startTime
            endTime
            zone {
              name
            }
            masterData {
              actors(type: "Player") {
                id
                name
                server
                subType
              }
            }
            fights {
              id
              name
              startTime
              endTime
              difficulty
              bossPercentage
              kill
            }
          }
        }
      }
    `;

    return await this.query(query, { code: reportCode });
  }

  // 전투 분석 데이터 가져오기
  async getFightAnalysis(reportCode, fightId) {
    const query = `
      query GetFightAnalysis($code: String!, $fightID: Int!) {
        reportData {
          report(code: $code) {
            events(fightIDs: [$fightID], dataType: DamageDone) {
              data
              nextPageTimestamp
            }
            table(fightIDs: [$fightID], dataType: DamageDone)
            graph(fightIDs: [$fightID], dataType: DamageDone)
          }
        }
      }
    `;

    return await this.query(query, { code: reportCode, fightID: fightId });
  }

  // 플레이어 순위 가져오기
  async getPlayerRankings(characterName, serverSlug, region = 'kr') {
    const query = `
      query GetPlayerRankings($name: String!, $server: String!, $region: String!) {
        characterData {
          character(name: $name, serverSlug: $server, serverRegion: $region) {
            name
            server {
              name
            }
            zoneRankings
            encounterRankings
          }
        }
      }
    `;

    return await this.query(query, {
      name: characterName,
      server: serverSlug,
      region: region
    });
  }

  // 길드 로그 목록 가져오기
  async getGuildReports(guildName, serverSlug, region = 'kr') {
    const query = `
      query GetGuildReports($name: String!, $server: String!, $region: String!) {
        guildData {
          guild(name: $name, serverSlug: $server, serverRegion: $region) {
            name
            server {
              name
            }
            reports(limit: 20) {
              data {
                code
                title
                startTime
                endTime
                zone {
                  name
                }
              }
            }
          }
        }
      }
    `;

    return await this.query(query, {
      name: guildName,
      server: serverSlug,
      region: region
    });
  }

  // 역학 분석 데이터
  async getMechanicsAnalysis(reportCode, fightId) {
    const query = `
      query GetMechanics($code: String!, $fightID: Int!) {
        reportData {
          report(code: $code) {
            events(
              fightIDs: [$fightID]
              dataType: DamageTaken
              hostilityType: Enemies
              filterExpression: "ability.id in (${this.getImportantMechanics()})"
            ) {
              data
            }
          }
        }
      }
    `;

    return await this.query(query, { code: reportCode, fightID: fightId });
  }

  // 중요 역학 ID 목록 (예시)
  getImportantMechanics() {
    return [
      385083, // 화산 폭발
      385051, // 용암 분출
      372082, // 파멸의 불길
      372056, // 분쇄
      // 더 많은 역학 ID 추가 가능
    ].join(',');
  }

  // 죽음 로그 분석
  async getDeathLogs(reportCode, fightId) {
    const query = `
      query GetDeaths($code: String!, $fightID: Int!) {
        reportData {
          report(code: $code) {
            events(
              fightIDs: [$fightID]
              dataType: Deaths
            ) {
              data
            }
          }
        }
      }
    `;

    return await this.query(query, { code: reportCode, fightID: fightId });
  }

  // 소모품 사용 분석
  async getConsumableUsage(reportCode, fightId) {
    const query = `
      query GetConsumables($code: String!, $fightID: Int!) {
        reportData {
          report(code: $code) {
            events(
              fightIDs: [$fightID]
              dataType: Casts
              filterExpression: "type = 'cast' and ability.id in (${this.getConsumableIds()})"
            ) {
              data
            }
          }
        }
      }
    `;

    return await this.query(query, { code: reportCode, fightID: fightId });
  }

  // 소모품 ID 목록
  getConsumableIds() {
    return [
      371024, // 정령의 치유 물약
      370652, // 정령의 강화 물약
      371172, // 천상의 증강 룬
      // 더 많은 소모품 ID
    ].join(',');
  }

  // 쿨다운 사용 효율성 분석
  async getCooldownUsage(reportCode, fightId, playerId) {
    const query = `
      query GetCooldowns($code: String!, $fightID: Int!, $playerID: Int!) {
        reportData {
          report(code: $code) {
            events(
              fightIDs: [$fightID]
              sourceID: $playerID
              dataType: Casts
              filterExpression: "type = 'cast' and ability.id in (${this.getMajorCooldownIds()})"
            ) {
              data
            }
          }
        }
      }
    `;

    return await this.query(query, {
      code: reportCode,
      fightID: fightId,
      playerID: playerId
    });
  }

  // 주요 쿨다운 ID 목록
  getMajorCooldownIds() {
    return [
      // 죽음기사
      51052, // 대마법 지대
      48707, // 대마법 보호막
      // 악마사냥꾼
      196718, // 악마 형상
      // 드루이드
      194223, // 화신
      // 기원사
      382266, // 용의 분노
      // 더 많은 쿨다운 ID
    ].join(',');
  }

  // 실시간 진행 중인 로그 스트림
  async getLiveLog(reportCode) {
    const query = `
      query GetLiveLog($code: String!) {
        reportData {
          report(code: $code) {
            fights(translate: true) {
              id
              name
              startTime
              endTime
              inProgress
            }
          }
        }
      }
    `;

    return await this.query(query, { code: reportCode });
  }

  // 파싱 데이터 형식 변환
  formatDamageData(rawData) {
    return rawData.map(entry => ({
      timestamp: entry.timestamp,
      source: entry.source?.name || 'Unknown',
      target: entry.target?.name || 'Unknown',
      ability: entry.ability?.name || 'Unknown',
      amount: entry.amount || 0,
      overkill: entry.overkill || 0,
      critical: entry.hitType === 2,
      blocked: entry.blocked || false
    }));
  }

  // 힐 데이터 형식 변환
  formatHealingData(rawData) {
    return rawData.map(entry => ({
      timestamp: entry.timestamp,
      source: entry.source?.name || 'Unknown',
      target: entry.target?.name || 'Unknown',
      ability: entry.ability?.name || 'Unknown',
      amount: entry.amount || 0,
      overheal: entry.overheal || 0,
      absorbed: entry.absorbed || 0,
      critical: entry.hitType === 2
    }));
  }

  // 점수 계산
  calculatePerformanceScore(metrics) {
    const weights = {
      dps: 0.3,
      mechanics: 0.25,
      deaths: 0.2,
      consumables: 0.15,
      cooldowns: 0.1
    };

    let score = 0;

    // DPS 점수 (파스 대비 %)
    score += (metrics.dpsPercentile / 100) * weights.dps * 100;

    // 역학 점수 (실패 횟수 기반)
    const mechanicsScore = Math.max(0, 100 - (metrics.mechanicsFailed * 10));
    score += mechanicsScore * weights.mechanics;

    // 죽음 점수
    const deathScore = metrics.deaths === 0 ? 100 : Math.max(0, 100 - (metrics.deaths * 25));
    score += deathScore * weights.deaths;

    // 소모품 점수
    const consumableScore = (metrics.consumablesUsed / metrics.expectedConsumables) * 100;
    score += Math.min(100, consumableScore) * weights.consumables;

    // 쿨다운 효율성
    score += metrics.cooldownEfficiency * weights.cooldowns;

    return Math.round(score);
  }
}

// 싱글톤 인스턴스
const warcraftLogsAPI = new WarcraftLogsAPI();
export default warcraftLogsAPI;