const axios = require('axios');
require('dotenv').config();

async function testSimpleQuery() {
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

  // 간단한 쿼리로 최근 보고서 가져오기
  const query = `
    query {
      reportData {
        reports(
          guildID: 495036
          limit: 5
        ) {
          data {
            code
            title
            startTime
            endTime
            zone {
              id
              name
            }
            owner {
              name
            }
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

  console.log('📊 API 응답:', JSON.stringify(result.data, null, 2));
}

testSimpleQuery().catch(err => {
  console.error('❌ 에러:', err.response?.data || err.message);
});