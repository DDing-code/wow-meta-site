const axios = require('axios');
const fs = require('fs');

const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZmU3NjYyZC0yMTMxLTQ0ZDUtYmMxMC00NWI5MGY0MGM4MTAiLCJqdGkiOiJmNzRiNjFhMDRiYTFiZjJjMTZiZmIwODczNjE2NWE4M2U0Njc3MTJiNDI3NGM2ZGU5ZDU2MDVlMjlmYTRhZGQ5MTg2ZTU3ZDY2ZjAxNTM5MiIsImlhdCI6MTc1ODE2NTE3OC40MjgyMTksIm5iZiI6MTc1ODE2NTE3OC40MjgyMjQsImV4cCI6MTc4OTI2OTE3OC40MTc1MTMsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.HSwAWSksTXMRsTebUJp2sgX5bDAKCWMzf-jB8c1XjT8qTKTEPkTBV6NDVfgIe_G0DCwdlM0cXywZRnnvz0rsAZoasNYHcYNHxuBs06oN4UKdNTc01kpUdWVzHKWi2ZvSF5iYLUUF4U8TvfcF4kwlKrAqwRkYv7yzsoN8ntaPTw8Y-NRThoIA5YvwQiMcTVlPaMOOVA5bO4_Gqhxojzrv-M31mgjbhBsiELEFfbjauEediPu_GpoQtPd0W1EybYk1755ZOZj9EiAMwrJn0HehPnw9CbbK3-W3k9IS-3nzbOqqqL8hvNHkLRcIMMhb5dGBMjt_xMLxLsoEg8_p3n5OHEqhH7HjZWNZtFtWi5jrgkqNaI2LeKmi05NkmMgW93LnuqDRMdWa8SKHynLYxQW4DB5EgQ3jODwRe_TFdEXSYkuTnzFPUM8o7oE5VKQWIBR7dxZ4DWxG47-6bev8Z7-KXY8NB3w_UfAydrRjHaBNzxA050KKXqaR8geUgdZul-H80Gu5tt9g9uqIrPvqSejaSVGQZ1l2M2nLu50PftSxcbvAJODYk_t2nxTpM01R5U-u7TFeSJkKkBrwKH8bG8AtV4fij6Pf-QAGwA__SEpTRsSFjgyU_kIMS_TqpOpaCjYHbBmdMoxyNhSrINQmbI2nBRUc0lexTqceLQEH8OCCUu0";

async function fetchManaforgeQuick() {
  console.log('=== MANAFORGE OMEGA ZONE RANKINGS (Zone 44) ===\n');

  try {
    // Zone 전체 랭킹 쿼리 - 모든 보스 통합
    const query = `
      query {
        worldData {
          zone(id: 44) {
            id
            name
            encounters {
              id
              name
            }
            rankings(
              metric: dps
              difficulty: 5
              page: 1
              size: 50
            ) {
              rankings {
                encounter {
                  id
                  name
                }
                spec
                class
                amount
                rankPercent
                lockedIn
                report {
                  code
                }
                name
                serverRegion
              }
            }
          }
        }
      }
    `;

    console.log('Fetching Manaforge Omega zone-wide rankings...\n');

    const response = await axios.post(
      'https://www.warcraftlogs.com/api/v2/client',
      { query },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const zone = response.data?.data?.worldData?.zone;
    if (!zone) {
      console.log('No zone data found');
      return;
    }

    console.log(`Zone: ${zone.name} (ID: ${zone.id})`);
    console.log('Encounters:', zone.encounters?.map(e => e.name).join(', '));

    const rankings = zone.rankings?.rankings || [];
    console.log(`\nTotal rankings found: ${rankings.length}`);

    if (rankings.length === 0) {
      console.log('\n⚠️ No rankings data available for Manaforge Omega yet');
      console.log('The raid might be too new or not enough logs have been uploaded\n');

      // 대안: 특정 보스 직접 조회
      console.log('Trying alternative method with specific boss (Dimensius)...\n');

      const bossQuery = `
        query {
          worldData {
            encounter(id: 3135) {
              id
              name
              zone {
                id
                name
              }
              rankings(
                metric: dps
                difficulty: 5
                page: 1
              ) {
                rankings {
                  rank
                  amount
                  spec
                  class
                  name
                  serverRegion
                  report {
                    code
                  }
                }
              }
            }
          }
        }
      `;

      const bossResponse = await axios.post(
        'https://www.warcraftlogs.com/api/v2/client',
        { query: bossQuery },
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const bossData = bossResponse.data?.data?.worldData?.encounter;
      if (bossData) {
        console.log(`Boss: ${bossData.name}`);
        const bossRankings = bossData.rankings?.rankings || [];
        console.log(`Rankings found: ${bossRankings.length}`);

        if (bossRankings.length > 0) {
          console.log('\nTop performers:');
          bossRankings.slice(0, 10).forEach(r => {
            console.log(`  ${r.rank}. ${r.name} - ${r.class} ${r.spec}: ${Math.round(r.amount).toLocaleString()} DPS`);
          });
        }
      }
    } else {
      // 랭킹 데이터 처리
      const classSpecs = {};

      rankings.forEach(r => {
        const key = `${r.class}_${r.spec}`;
        if (!classSpecs[key] || r.amount > classSpecs[key].amount) {
          classSpecs[key] = {
            class: r.class,
            spec: r.spec,
            amount: r.amount,
            rankPercent: r.rankPercent,
            player: r.name,
            encounter: r.encounter?.name
          };
        }
      });

      console.log('\nTop performers by class/spec:');
      const sorted = Object.values(classSpecs).sort((a, b) => b.amount - a.amount);
      sorted.slice(0, 15).forEach((spec, index) => {
        console.log(`  ${index + 1}. ${spec.class} ${spec.spec}: ${Math.round(spec.amount).toLocaleString()} DPS (${spec.player})`);
      });

      // 데이터 저장
      const saveData = {
        zone: 'Manaforge Omega',
        zoneId: 44,
        patch: '11.2',
        fetchedAt: new Date().toISOString(),
        rankings: sorted,
        raw: rankings
      };

      fs.writeFileSync('manaforge-zone-data.json', JSON.stringify(saveData, null, 2));
      console.log('\n✅ Data saved to manaforge-zone-data.json');
    }

  } catch (error) {
    console.error('Error:', error.message);

    if (error.response?.data?.errors) {
      console.error('GraphQL errors:', error.response.data.errors);
    }
  }
}

// 실행
fetchManaforgeQuick();