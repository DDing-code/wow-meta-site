/**
 * WarcraftLogs API 커넥터
 * GraphQL을 통한 실제 로그 데이터 수집
 */

class WarcraftLogsConnector {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = 'https://www.warcraftlogs.com/api/v2';
    this.tokenUrl = 'https://www.warcraftlogs.com/oauth/token';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * OAuth2 액세스 토큰 획득
   */
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
        },
        body: 'grant_type=client_credentials'
      });

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1분 여유

      return this.accessToken;
    } catch (error) {
      console.error('❌ 액세스 토큰 획득 실패:', error);
      throw error;
    }
  }

  /**
   * 상위 플레이어 로그 수집
   */
  async fetchTopPlayerLogs(spec, encounter, options = {}) {
    const {
      percentile = 99,
      limit = 100,
      partition = 1, // 현재 시즌
      zone = 44 // Manaforge Omega
    } = options;

    console.log(`📊 ${spec} 상위 ${percentile}% 로그 수집 시작...`);

    const token = await this.getAccessToken();

    // WarcraftLogs API v2 쿼리
    const query = `
      query {
        worldData {
          encounter(id: ${encounter}) {
            name
            characterRankings(
              specName: "${spec}"
              partition: ${partition}
              page: 1
              includeCombatantInfo: true
            )
          }
        }
      }
    `;

    try {
      const response = await fetch(`${this.baseUrl}/client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL 오류:', result.errors);
        throw new Error('로그 데이터 수집 실패');
      }

      // API v2 응답 형식에 맞게 수정
      const encounterData = result.data?.worldData?.encounter;
      if (!encounterData || !encounterData.characterRankings) {
        console.log('⚠️ 랭킹 데이터 없음');
        return [];
      }

      // characterRankings는 직접 배열이 아니라 페이지네이션된 객체일 수 있음
      // 실제 API 응답 구조에 따라 조정 필요
      console.log(`✅ 로그 수집 시도 완료`);

      // 임시로 빈 배열 반환 (API 응답 구조 확인 필요)
      return [];
    } catch (error) {
      console.error('❌ 로그 수집 오류:', error);
      throw error;
    }
  }

  /**
   * 리포트 상세 데이터 수집
   */
  async fetchReportDetails(reportCode, playerName) {
    const token = await this.getAccessToken();

    const query = `
      query {
        reportData {
          report(code: "${reportCode}") {
            events(
              sourceID: null
              sourceName: "${playerName}"
              dataType: DamageDone
              limit: 10000
            ) {
              data
              nextPageTimestamp
            }
            playerDetails(name: "${playerName}") {
              data {
                combatantInfo {
                  stats {
                    Strength
                    Agility
                    Stamina
                    Intellect
                    Crit
                    Haste
                    Mastery
                    Versatility
                  }
                  gear {
                    id
                    slot
                    itemLevel
                    permanentEnchant
                    temporaryEnchant
                    gems {
                      id
                    }
                  }
                  talents {
                    name
                    guid
                    type
                    abilityIcon
                  }
                  artifact {
                    traits {
                      traitID
                      rank
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(`${this.baseUrl}/client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL 오류:', result.errors);
        return null;
      }

      return {
        events: result.data.reportData.report.events.data,
        playerInfo: result.data.reportData.report.playerDetails.data[0]?.combatantInfo
      };
    } catch (error) {
      console.error('❌ 리포트 상세 수집 오류:', error);
      return null;
    }
  }

  /**
   * 랭킹 데이터 처리
   */
  processRankingData(rankings) {
    return rankings.map(player => ({
      name: player.name,
      guild: player.guild?.name || 'Unknown',
      server: player.guild?.server?.name || 'Unknown',
      region: player.guild?.server?.region || 'Unknown',
      reportCode: player.report.code,
      duration: player.duration,
      dps: Math.round(player.amount),
      spec: player.spec,
      class: player.class.name,
      talents: player.talents || [],
      startTime: new Date(player.report.startTime),
      endTime: new Date(player.report.endTime)
    }));
  }

  /**
   * 스킬 시퀀스 추출
   */
  extractSkillSequence(events) {
    const sequence = [];
    const resourceChanges = [];

    events.forEach(event => {
      if (event.type === 'cast') {
        sequence.push({
          timestamp: event.timestamp,
          abilityId: event.abilityGameID,
          targetId: event.targetID,
          targetResources: event.targetResources
        });
      }

      if (event.type === 'resourcechange') {
        resourceChanges.push({
          timestamp: event.timestamp,
          resourceType: event.resourceChangeType,
          amount: event.resourceChange,
          current: event.otherResourceChange
        });
      }
    });

    return { sequence, resourceChanges };
  }

  /**
   * 버스트 윈도우 식별
   */
  identifyBurstWindows(events, windowSize = 10000) {
    const windows = [];
    let currentWindow = { start: 0, end: 0, damage: 0, abilities: [] };

    events.forEach(event => {
      if (event.type === 'damage') {
        if (event.timestamp - currentWindow.start > windowSize) {
          if (currentWindow.damage > 0) {
            windows.push(currentWindow);
          }
          currentWindow = {
            start: event.timestamp,
            end: event.timestamp,
            damage: 0,
            abilities: []
          };
        }

        currentWindow.end = event.timestamp;
        currentWindow.damage += event.amount;
        currentWindow.abilities.push(event.abilityGameID);
      }
    });

    // DPS 스파이크 구간 찾기
    const avgDPS = windows.reduce((sum, w) => sum + (w.damage / (w.end - w.start) * 1000), 0) / windows.length;
    return windows.filter(w => (w.damage / (w.end - w.start) * 1000) > avgDPS * 1.5);
  }
}

export default WarcraftLogsConnector;