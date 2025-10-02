const axios = require('axios');
require('dotenv').config();

class WarcraftLogsAPIClient {
  constructor() {
    this.clientId = process.env.WARCRAFTLOGS_CLIENT_ID;
    this.clientSecret = process.env.WARCRAFTLOGS_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // OAuth2 토큰 가져오기
  async getAccessToken() {
    // 토큰이 유효하면 재사용
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('🔑 WarcraftLogs API 토큰 요청 중...');

      const response = await axios.post('https://www.warcraftlogs.com/oauth/token', {
        grant_type: 'client_credentials'
      }, {
        auth: {
          username: this.clientId,
          password: this.clientSecret
        }
      });

      this.accessToken = response.data.access_token;
      // 토큰 만료 시간 설정 (보통 1시간)
      this.tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000) - 60000);

      console.log('✅ API 토큰 획득 성공');
      return this.accessToken;
    } catch (error) {
      console.error('❌ WarcraftLogs API 토큰 획득 실패:', error.message);
      throw error;
    }
  }

  // GraphQL 쿼리 실행
  async query(graphqlQuery) {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        'https://www.warcraftlogs.com/api/v2/client',
        {
          query: graphqlQuery
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
      console.error('❌ GraphQL 쿼리 실패:', error.response?.data || error.message);
      throw error;
    }
  }

  // 존 랭킹 가져오기 (Zone 38 = Nerub-ar Palace)
  async getZoneRankings(zoneId = 38, difficulty = 5, metric = 'dps', limit = 10) {
    const query = `
      query {
        worldData {
          zone(id: ${zoneId}) {
            name
            encounters {
              id
              name
              characterRankings(
                difficulty: ${difficulty}
                metric: ${metric === 'dps' ? 'dps' : metric}
                page: 1
              )
            }
          }
        }
      }
    `;

    console.log(`📊 Zone ${zoneId} 랭킹 데이터 요청 중...`);
    const result = await this.query(query);

    if (result.errors) {
      console.error('GraphQL 에러:', result.errors);
    }

    return result.data;
  }

  // 특정 리포트의 전투 정보 가져오기
  async getReportFights(reportCode) {
    const query = `
      query {
        reportData {
          report(code: "${reportCode}") {
            title
            startTime
            endTime
            fights {
              id
              name
              difficulty
              kill
              startTime
              endTime
              fightPercentage
            }
            masterData {
              actors {
                id
                name
                type
                subType
              }
            }
          }
        }
      }
    `;

    const result = await this.query(query);
    return result.data;
  }

  // 특정 전투의 상세 데이터 가져오기
  async getFightDetails(reportCode, fightId) {
    const query = `
      query {
        reportData {
          report(code: "${reportCode}") {
            events(fightIDs: [${fightId}], dataType: DamageDone, limit: 100) {
              data
            }
            table(fightIDs: [${fightId}], dataType: DamageDone) {
              composition {
                name
                id
                type
                specs
                total
              }
            }
          }
        }
      }
    `;

    const result = await this.query(query);
    return result.data;
  }

  // 캐릭터 로그 가져오기
  async getCharacterLogs(characterName, serverName, serverRegion = 'kr') {
    const query = `
      query {
        characterData {
          character(name: "${characterName}", serverSlug: "${serverName}", serverRegion: "${serverRegion}") {
            name
            server {
              name
              region
            }
            zoneRankings
            recentReports(limit: 10) {
              data {
                code
                startTime
                endTime
                zone {
                  name
                }
                fights {
                  id
                  name
                  difficulty
                  kill
                }
              }
            }
          }
        }
      }
    `;

    const result = await this.query(query);
    return result.data;
  }

  // 상위 플레이어 데이터 수집 (학습용)
  async fetchTopPlayersForTraining(zoneId = 38, limit = 10) {
    try {
      console.log('🎯 WarcraftLogs API로 학습 데이터 수집 시작...');

      // 1. 존 랭킹 데이터 가져오기
      const rankingData = await this.getZoneRankings(zoneId, 5, 'dps', limit);

      if (!rankingData || !rankingData.worldData?.zone) {
        throw new Error('랭킹 데이터를 가져올 수 없습니다');
      }

      const zone = rankingData.worldData.zone;
      const players = [];

      // 2. 각 보스별 랭킹에서 플레이어 추출
      for (const encounter of zone.encounters) {
        if (!encounter.rankings?.rankings) continue;

        for (const ranking of encounter.rankings.rankings.slice(0, 5)) {
          // 플레이어 정보 수집
          const playerData = {
            name: ranking.name,
            class: ranking.class,
            spec: ranking.spec,
            dps: ranking.amount,
            duration: ranking.duration,
            guild: ranking.guild?.name || 'Unknown',
            server: `${ranking.server.name}-${ranking.server.region}`,
            reportCode: ranking.reportCode,
            fightID: ranking.fightID,
            boss: encounter.name,
            startTime: ranking.startTime
          };

          players.push(playerData);
        }
      }

      console.log(`✅ ${players.length}개의 실제 전투 로그 수집 완료`);

      // 3. 학습용 데이터 형식으로 변환
      const trainingData = players.map(player => ({
        playerName: player.name,
        className: player.class,
        specName: player.spec,
        guildName: player.guild,
        server: player.server,

        // 실제 전투 데이터
        dps: player.dps,
        duration: player.duration,
        bossName: player.boss,
        reportCode: player.reportCode,
        fightID: player.fightID,

        // AI 학습에 필요한 특징들
        combatTime: player.duration / 1000, // 초 단위
        dpsEfficiency: Math.min(player.dps / 1000000, 1), // 정규화

        // 추가 메타데이터
        timestamp: new Date(player.startTime),
        dataSource: 'warcraftlogs-api-v2'
      }));

      return trainingData;

    } catch (error) {
      console.error('❌ API 데이터 수집 실패:', error.message);
      throw error;
    }
  }
}

module.exports = new WarcraftLogsAPIClient();