const axios = require('axios');

// v1 API 테스트
const API_KEY = 'f0ee4d23-f49d-4a8c-b8e2-09ca07035bc4'; // 이것이 v1 API key일 가능성

async function testV1API() {
  console.log('=== Testing WarcraftLogs v1 API ===\n');

  // v1 API는 직접 API key를 사용
  const v1Endpoint = 'https://www.warcraftlogs.com/v1/zones';

  try {
    console.log('Trying v1 API with direct API key...');
    const response = await axios.get(v1Endpoint, {
      params: {
        api_key: API_KEY
      }
    });

    console.log('✅ v1 API Success!');
    console.log('Available zones:');
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach(zone => {
        console.log(`  - ${zone.name} (ID: ${zone.id})`);
      });

      // Manaforge Omega 찾기
      const manaforge = response.data.find(z => z.name && z.name.includes('Manaforge'));
      if (manaforge) {
        console.log(`\n🎯 Found Manaforge: ${manaforge.name} (ID: ${manaforge.id})`);
      }
    }
    return true;
  } catch (error) {
    console.error('v1 API failed:', error.response?.data || error.message);
    return false;
  }
}

async function testV1Rankings() {
  console.log('\n=== Testing v1 Rankings API ===\n');

  // Nerub-ar Palace (zone 38) 또는 Manaforge (zone 44) 시도
  const zones = [44, 38]; // Manaforge Omega, Nerub-ar Palace

  for (const zoneId of zones) {
    console.log(`Testing zone ${zoneId}...`);

    try {
      const response = await axios.get(`https://www.warcraftlogs.com/v1/rankings/encounter/3131`, {
        params: {
          api_key: API_KEY,
          metric: 'dps',
          difficulty: 5,
          limit: 10
        }
      });

      if (response.data && response.data.rankings) {
        console.log(`✅ Got rankings for zone ${zoneId}!`);
        console.log('Top 3 players:');
        response.data.rankings.slice(0, 3).forEach(rank => {
          console.log(`  - ${rank.name} (${rank.guild}): ${rank.total} DPS`);
        });
        return true;
      }
    } catch (error) {
      console.log(`  Zone ${zoneId} failed:`, error.response?.status || error.message);
    }
  }
  return false;
}

async function main() {
  // v1 API 테스트
  const v1Works = await testV1API();

  if (v1Works) {
    console.log('\n✅ Your API key is for v1 API!');
    await testV1Rankings();
  } else {
    console.log('\n❌ API key does not work with v1 either.');
    console.log('\nYou need to create a new API client at:');
    console.log('https://www.warcraftlogs.com/api/clients');
  }
}

main();