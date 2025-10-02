const axios = require('axios');
const fs = require('fs');

// WarcraftLogs OAuth 설정
const CLIENT_ID = '9fe7662d-2131-44d5-bc10-45b90f40c810';
const CLIENT_SECRET = 'OhRnvJEOb2wJnR3Bd1LfP4nCOC2Yy41Gw1sJWUNn';

async function getNewAccessToken() {
  console.log('=== GETTING NEW WARCRAFTLOGS ACCESS TOKEN ===\n');

  try {
    const response = await axios.post('https://www.warcraftlogs.com/oauth/token', {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const token = response.data.access_token;
    const expiresIn = response.data.expires_in;

    console.log('✅ Access Token obtained successfully!');
    console.log(`Token: ${token.substring(0, 50)}...`);
    console.log(`Expires in: ${expiresIn} seconds (${Math.floor(expiresIn / 3600)} hours)`);

    // .env 파일 업데이트
    const envPath = 'server/.env';
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
      // WARCRAFTLOGS_ACCESS_TOKEN 업데이트
      if (envContent.includes('WARCRAFTLOGS_ACCESS_TOKEN=')) {
        envContent = envContent.replace(/WARCRAFTLOGS_ACCESS_TOKEN=.*/g, `WARCRAFTLOGS_ACCESS_TOKEN=${token}`);
      } else {
        envContent += `\nWARCRAFTLOGS_ACCESS_TOKEN=${token}`;
      }
    } else {
      envContent = `WARCRAFTLOGS_CLIENT_ID=${CLIENT_ID}
WARCRAFTLOGS_CLIENT_SECRET=${CLIENT_SECRET}
WARCRAFTLOGS_ACCESS_TOKEN=${token}
PORT=5001
CLIENT_URL=http://localhost:3000`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Token saved to server/.env');

    // 토큰 정보 파일로도 저장
    const tokenInfo = {
      token: token,
      expiresIn: expiresIn,
      obtainedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (expiresIn * 1000)).toISOString()
    };

    fs.writeFileSync('warcraftlogs-token.json', JSON.stringify(tokenInfo, null, 2));
    console.log('✅ Token info saved to warcraftlogs-token.json');

    return token;

  } catch (error) {
    console.error('❌ Failed to get access token:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    throw error;
  }
}

// 실행
getNewAccessToken().catch(console.error);