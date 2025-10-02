const axios = require('axios');

const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZmU3NjYyZC0yMTMxLTQ0ZDUtYmMxMC00NWI5MGY0MGM4MTAiLCJqdGkiOiJmNzRiNjFhMDRiYTFiZjJjMTZiZmIwODczNjE2NWE4M2U0Njc3MTJiNDI3NGM2ZGU5ZDU2MDVlMjlmYTRhZGQ5MTg2ZTU3ZDY2ZjAxNTM5MiIsImlhdCI6MTc1ODE2NTE3OC40MjgyMTksIm5iZiI6MTc1ODE2NTE3OC40MjgyMjQsImV4cCI6MTc4OTI2OTE3OC40MTc1MTMsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.HSwAWSksTXMRsTebUJp2sgX5bDAKCWMzf-jB8c1XjT8qTKTEPkTBV6NDVfgIe_G0DCwdlM0cXywZRnnvz0rsAZoasNYHcYNHxuBs06oN4UKdNTc01kpUdWVzHKWi2ZvSF5iYLUUF4U8TvfcF4kwlKrAqwRkYv7yzsoN8ntaPTw8Y-NRThoIA5YvwQiMcTVlPaMOOVA5bO4_Gqhxojzrv-M31mgjbhBsiELEFfbjauEediPu_GpoQtPd0W1EybYk1755ZOZj9EiAMwrJn0HehPnw9CbbK3-W3k9IS-3nzbOqqqL8hvNHkLRcIMMhb5dGBMjt_xMLxLsoEg8_p3n5OHEqhH7HjZWNZtFtWi5jrgkqNaI2LeKmi05NkmMgW93LnuqDRMdWa8SKHynLYxQW4DB5EgQ3jODwRe_TFdEXSYkuTnzFPUM8o7oE5VKQWIBR7dxZ4DWxG47-6bev8Z7-KXY8NB3w_UfAydrRjHaBNzxA050KKXqaR8geUgdZul-H80Gu5tt9g9uqIrPvqSejaSVGQZ1l2M2nLu50PftSxcbvAJODYk_t2nxTpM01R5U-u7TFeSJkKkBrwKH8bG8AtV4fij6Pf-QAGwA__SEpTRsSFjgyU_kIMS_TqpOpaCjYHbBmdMoxyNhSrINQmbI2nBRUc0lexTqceLQEH8OCCUu0";

async function getLatestRaidData() {
  try {
    // GraphQL query to get latest raid rankings
    // Nerub-ar Palace (ID: 38)
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

    const response = await axios.post(
      'https://www.warcraftlogs.com/api/v2/client',
      {
        query: query
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Nerub-ar Palace 레이드 정보:');
    const raid = response.data.data.worldData.zone;

    console.log(`\n레이드: ${raid.name} (ID: ${raid.id})`);
    console.log('보스 목록:');
    raid.encounters.forEach(enc => {
      console.log(`  - ${enc.name} (ID: ${enc.id})`);
    });

    // 특정 보스의 상위 랭킹 가져오기 (characterRankings는 JSON 타입)
    const rankingsQuery = `
      query {
        worldData {
          encounter(id: ${raid.encounters[raid.encounters.length - 1].id}) {
            characterRankings(
              className: "Warrior"
              specName: "Arms"
              difficulty: 5
              metric: dps
              page: 1
            )
          }
        }
      }
    `;

    const rankingsResponse = await axios.post(
      'https://www.warcraftlogs.com/api/v2/client',
      {
        query: rankingsQuery
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const rankingsData = rankingsResponse.data.data?.worldData?.encounter?.characterRankings;

    console.log(`\nWarrior Arms DPS (${raid.encounters[raid.encounters.length - 1].name}):`);

    // JSON 타입이므로 직접 파싱
    const rankings = rankingsData?.rankings || [];
    console.log(`총 ${rankings.length}개 랭킹 데이터`);

    // 상위 3개 데이터 확인
    if (rankings.length > 0) {
      console.log('\n상위 3개 로그 샘플:');
      rankings.slice(0, 3).forEach((r, i) => {
        console.log(`${i+1}. DPS: ${r.amount}, Percentile: ${r.percentile}`);
      });
    }

    const top10 = rankings.filter(r => r.percentile >= 90);
    const dpsValues = top10.map(r => r.amount);

    if (dpsValues.length > 0) {
      const avg = dpsValues.reduce((a, b) => a + b, 0) / dpsValues.length;
      const max = Math.max(...dpsValues);
      const min = Math.min(...dpsValues);

      console.log(`  상위 10% 평균: ${Math.round(avg).toLocaleString()} DPS`);
      console.log(`  상위 10% 최대: ${Math.round(max).toLocaleString()} DPS`);
      console.log(`  상위 10% 최소: ${Math.round(min).toLocaleString()} DPS`);
      console.log(`  샘플 수: ${top10.length}개`);
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

getLatestRaidData();