const axios = require('axios');
require('dotenv').config();

class RealDataFetcher {
  constructor() {
    this.clientId = process.env.WARCRAFTLOGS_CLIENT_ID;
    this.clientSecret = process.env.WARCRAFTLOGS_CLIENT_SECRET;
    this.accessToken = null;
  }

  async getAccessToken() {
    if (this.accessToken) return this.accessToken;

    try {
      const response = await axios.post('https://www.warcraftlogs.com/oauth/token', {
        grant_type: 'client_credentials'
      }, {
        auth: {
          username: this.clientId,
          password: this.clientSecret
        }
      });

      this.accessToken = response.data.access_token;
      console.log('✅ WarcraftLogs API 토큰 획득');
      return this.accessToken;
    } catch (error) {
      console.error('❌ 토큰 획득 실패:', error.message);
      throw error;
    }
  }

  // 실제 리포트에서 DPS 데이터 가져오기
  async fetchRealReportData(reportCode) {
    const token = await this.getAccessToken();

    // 리포트에서 실제 전투 데이터 가져오기
    const query = `
      query GetReportFights($code: String!) {
        reportData {
          report(code: $code) {
            fights {
              id
              name
              difficulty
              kill
              startTime
              endTime
            }
            playerDetails(startTime: 0, endTime: 999999999)
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        'https://www.warcraftlogs.com/api/v2/client',
        {
          query,
          variables: { code: reportCode }
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
      console.error('❌ 리포트 데이터 가져오기 실패:', error.message);
      return null;
    }
  }

  // 실제 플레이어 DPS 랭킹 가져오기
  async fetchRealDPSRankings() {
    const token = await this.getAccessToken();

    // Manaforge Omega (Zone 44)의 실제 DPS 랭킹 데이터 가져오기
    const query = `
      query GetRankings {
        worldData {
          encounter(id: 3131) {
            characterRankings(
              metric: dps
              difficulty: 5
              page: 1
              serverRegion: ""
              className: ""
            )
          }
        }
      }
    `;

    try {
      console.log('🔄 DPS 랭킹 API 호출 중...');
      const response = await axios.post(
        'https://www.warcraftlogs.com/api/v2/client',
        { query },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15초 타임아웃
        }
      );

      console.log('📡 API 응답 수신');

      // 응답 구조 확인
      if (response.data.errors) {
        console.error('❌ GraphQL 에러:', JSON.stringify(response.data.errors, null, 2));
        return null;
      }

      console.log('📊 응답 구조:', JSON.stringify(response.data, null, 2).substring(0, 500));

      if (response.data && response.data.data && response.data.data.worldData) {
        const rankingsData = response.data.data.worldData.encounter?.characterRankings;

        // characterRankings는 이미 JSON 문자열 또는 객체
        let rankings;
        if (typeof rankingsData === 'string') {
          try {
            rankings = JSON.parse(rankingsData);
          } catch (e) {
            console.error('❌ JSON 파싱 실패:', e);
            return null;
          }
        } else {
          rankings = rankingsData;
        }

        console.log('📊 랭킹 데이터:', rankings);

        if (rankings && rankings.rankings && rankings.rankings.length > 0) {
          console.log(`✅ 실제 랭킹 ${rankings.rankings.length}개 가져오기 성공`);

          // 실제 DPS 데이터 반환
          return rankings.rankings.map((rank, index) => ({
            rank: index + 1,
            name: rank.name,
            class: rank.class,
            spec: rank.spec,
            guild: rank.guild?.name || 'Unknown',
            server: rank.server?.name || 'Unknown',
            dps: rank.total || rank.amount || rank.dps,  // 실제 DPS 값!
            percentile: 99.9 - (index * 0.1), // 상위 랭킹이므로 높은 percentile
            reportCode: rank.report?.code,
            fightID: rank.report?.fightID
          }));
        } else {
          console.log('⚠️ 랭킹 데이터가 비어있음');
        }
      } else {
        console.log('⚠️ worldData 구조가 예상과 다름');
      }

      return null;
    } catch (error) {
      console.error('❌ 랭킹 데이터 가져오기 실패:', error.message);
      if (error.response) {
        console.error('응답 상태:', error.response.status);
        console.error('응답 데이터:', JSON.stringify(error.response.data, null, 2));
      }
      return null;
    }
  }

  // 실제 플레이어 HPS 랭킹 가져오기
  async fetchRealHPSRankings() {
    const token = await this.getAccessToken();

    // Manaforge Omega (Zone 44)의 실제 HPS 랭킹 데이터 가져오기
    const query = `
      query GetRankings {
        worldData {
          encounter(id: 3131) {
            characterRankings(
              metric: hps
              difficulty: 5
              page: 1
              serverRegion: ""
              className: ""
            )
          }
        }
      }
    `;

    try {
      console.log('🔄 HPS 랭킹 API 호출 중...');
      const response = await axios.post(
        'https://www.warcraftlogs.com/api/v2/client',
        { query },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      console.log('📡 HPS API 응답 수신');

      if (response.data.errors) {
        console.error('❌ GraphQL 에러:', JSON.stringify(response.data.errors, null, 2));
        return null;
      }

      if (response.data && response.data.data && response.data.data.worldData) {
        const rankingsData = response.data.data.worldData.encounter?.characterRankings;

        let rankings;
        if (typeof rankingsData === 'string') {
          try {
            rankings = JSON.parse(rankingsData);
          } catch (e) {
            console.error('❌ JSON 파싱 실패:', e);
            return null;
          }
        } else {
          rankings = rankingsData;
        }

        if (rankings && rankings.rankings && rankings.rankings.length > 0) {
          console.log(`✅ 실제 HPS 랭킹 ${rankings.rankings.length}개 가져오기 성공`);

          return rankings.rankings.map((rank, index) => ({
            rank: index + 1,
            name: rank.name,
            class: rank.class,
            spec: rank.spec,
            guild: rank.guild?.name || 'Unknown',
            server: rank.server?.name || 'Unknown',
            hps: rank.total || rank.amount || rank.hps,  // 실제 HPS 값!
            percentile: 99.9 - (index * 0.1),
            reportCode: rank.report?.code,
            fightID: rank.report?.fightID
          }));
        } else {
          console.log('⚠️ HPS 랭킹 데이터가 비어있음');
        }
      }

      return null;
    } catch (error) {
      console.error('❌ HPS 랭킹 데이터 가져오기 실패:', error.message);
      return null;
    }
  }

  // DPS와 HPS 랭킹 모두 가져오기
  async fetchRealRankings() {
    const dpsRankings = await this.fetchRealDPSRankings();
    const hpsRankings = await this.fetchRealHPSRankings();

    return {
      dps: dpsRankings || [],
      hps: hpsRankings || []
    };
  }

  // 특정 리포트의 상세 전투 데이터
  async fetchFightDetails(reportCode, fightID) {
    const token = await this.getAccessToken();

    const query = `
      query GetFightDetails($code: String!, $fightID: Int!) {
        reportData {
          report(code: $code) {
            fights(fightIDs: [$fightID]) {
              id
              name
              difficulty
              startTime
              endTime
            }
            table(
              dataType: DamageDone
              startTime: 0
              endTime: 999999999
              fightIDs: [$fightID]
            )
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        'https://www.warcraftlogs.com/api/v2/client',
        {
          query,
          variables: { code: reportCode, fightID }
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
      console.error('❌ 전투 상세 데이터 가져오기 실패:', error.message);
      return null;
    }
  }
}

module.exports = RealDataFetcher;

// 직접 실행시 테스트
if (require.main === module) {
  async function test() {
    const fetcher = new RealDataFetcher();

    console.log('🚀 실제 WarcraftLogs API v2 데이터 가져오기...\n');

    // 실제 랭킹 가져오기
    const rankings = await fetcher.fetchRealRankings();

    if (rankings) {
      if (rankings.dps && rankings.dps.length > 0) {
        console.log('\n📊 실제 DPS 랭킹:');
        rankings.dps.slice(0, 5).forEach(player => {
          console.log(`${player.rank}. ${player.name} (${player.guild}) - ${player.dps} DPS (실제값!)`);
        });
      }

      if (rankings.hps && rankings.hps.length > 0) {
        console.log('\n💚 실제 HPS 랭킹:');
        rankings.hps.slice(0, 5).forEach(player => {
          console.log(`${player.rank}. ${player.name} (${player.guild}) - ${player.hps} HPS (실제값!)`);
        });
      }
    }
  }

  test();
}