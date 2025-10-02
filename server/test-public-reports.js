const axios = require('axios');
require('dotenv').config();

async function testPublicReports() {
  // OAuth2 토큰 가져오기
  const tokenResponse = await axios.post('https://www.warcraftlogs.com/oauth/token', {
    grant_type: 'client_credentials'
  }, {
    auth: {
      username: process.env.WARCRAFTLOGS_CLIENT_ID,
      password: process.env.WARCRAFTLOGS_CLIENT_SECRET
    }
  });

  const token = tokenResponse.data.access_token;
  console.log('✅ 토큰 획득:', token.substring(0, 20) + '...');

  // 공개 리포트에서 DPS 데이터 가져오기
  // Nerub-ar Palace (38), Mythic (5)
  const query = `
    query {
      worldData {
        zone(id: 38) {
          id
          name
          encounters {
            id
            name
          }
        }
      }
    }
  `;

  const result = await axios.post(
    'https://www.warcraftlogs.com/api/v2/client',
    { query },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('📊 Zone 데이터:', JSON.stringify(result.data, null, 2));

  // 리포트 테이블 가져오기
  const reportQuery = `
    query {
      reportData {
        report(code: "a:LPNxVQRmfWq2XYFZ") {
          code
          title
          startTime
          endTime
          zone {
            name
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

  try {
    const reportResult = await axios.post(
      'https://www.warcraftlogs.com/api/v2/client',
      { query: reportQuery },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n📈 리포트 데이터:', JSON.stringify(reportResult.data, null, 2));
  } catch(err) {
    console.log('\n리포트 가져오기 실패 - 다른 방법 시도 중...');
  }

  // 최신 순위표 데이터 테스트
  const rankingQuery = `
    query {
      worldData {
        encounter(id: 2920) {
          id
          name
          zone {
            name
          }
        }
      }
    }
  `;

  const rankingResult = await axios.post(
    'https://www.warcraftlogs.com/api/v2/client',
    { query: rankingQuery },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('\n🏆 Encounter 데이터:', JSON.stringify(rankingResult.data, null, 2));
}

testPublicReports().catch(err => {
  console.error('❌ 에러:', err.response?.data || err.message);
});