const axios = require('axios');

const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZmU3NjYyZC0yMTMxLTQ0ZDUtYmMxMC00NWI5MGY0MGM4MTAiLCJqdGkiOiJmNzRiNjFhMDRiYTFiZjJjMTZiZmIwODczNjE2NWE4M2U0Njc3MTJiNDI3NGM2ZGU5ZDU2MDVlMjlmYTRhZGQ5MTg2ZTU3ZDY2ZjAxNTM5MiIsImlhdCI6MTc1ODE2NTE3OC40MjgyMTksIm5iZiI6MTc1ODE2NTE3OC40MjgyMjQsImV4cCI6MTc4OTI2OTE3OC40MTc1MTMsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.HSwAWSksTXMRsTebUJp2sgX5bDAKCWMzf-jB8c1XjT8qTKTEPkTBV6NDVfgIe_G0DCwdlM0cXywZRnnvz0rsAZoasNYHcYNHxuBs06oN4UKdNTc01kpUdWVzHKWi2ZvSF5iYLUUF4U8TvfcF4kwlKrAqwRkYv7yzsoN8ntaPTw8Y-NRThoIA5YvwQiMcTVlPaMOOVA5bO4_Gqhxojzrv-M31mgjbhBsiELEFfbjauEediPu_GpoQtPd0W1EybYk1755ZOZj9EiAMwrJn0HehPnw9CbbK3-W3k9IS-3nzbOqqqL8hvNHkLRcIMMhb5dGBMjt_xMLxLsoEg8_p3n5OHEqhH7HjZWNZtFtWi5jrgkqNaI2LeKmi05NkmMgW93LnuqDRMdWa8SKHynLYxQW4DB5EgQ3jODwRe_TFdEXSYkuTnzFPUM8o7oE5VKQWIBR7dxZ4DWxG47-6bev8Z7-KXY8NB3w_UfAydrRjHaBNzxA050KKXqaR8geUgdZul-H80Gu5tt9g9uqIrPvqSejaSVGQZ1l2M2nLu50PftSxcbvAJODYk_t2nxTpM01R5U-u7TFeSJkKkBrwKH8bG8AtV4fij6Pf-QAGwA__SEpTRsSFjgyU_kIMS_TqpOpaCjYHbBmdMoxyNhSrINQmbI2nBRUc0lexTqceLQEH8OCCUu0";

async function getManaforgeOmegaData() {
  try {
    console.log('=== Fetching 11.2 Manaforge Omega Raid Data ===\n');

    // 먼저 모든 zone을 조회해서 Manaforge Omega 찾기
    const zonesQuery = `
      query {
        worldData {
          zones {
            id
            name
            expansion {
              name
            }
          }
        }
      }
    `;

    const zonesResponse = await axios.post(
      'https://www.warcraftlogs.com/api/v2/client',
      {
        query: zonesQuery
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const zones = zonesResponse.data.data?.worldData?.zones || [];

    // The War Within(11.2) 레이드 찾기
    // Manaforge Omega는 보통 ID 39-42 범위에 있을 가능성이 높음
    console.log('Searching for Manaforge Omega in The War Within raids...\n');

    const twwZones = zones.filter(z =>
      z.expansion?.name === 'The War Within' ||
      z.name?.includes('Manaforge') ||
      z.name?.includes('Omega') ||
      (z.id >= 39 && z.id <= 50) // 11.2 패치 레이드 예상 범위
    );

    console.log('Found The War Within zones:');
    twwZones.forEach(zone => {
      console.log(`- ${zone.name} (ID: ${zone.id})`);
    });

    // Manaforge Omega는 Zone 44로 확인됨
    for (const zone of [44]) { // Manaforge Omega zone ID
      try {
        console.log(`\n--- Checking Zone ID: ${zone} ---`);

        const encountersQuery = `
          query {
            worldData {
              zone(id: ${zone}) {
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

        const encountersResponse = await axios.post(
          'https://www.warcraftlogs.com/api/v2/client',
          {
            query: encountersQuery
          },
          {
            headers: {
              'Authorization': `Bearer ${ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const zoneData = encountersResponse.data.data?.worldData?.zone;

        if (zoneData) {
          console.log(`\nFound raid: ${zoneData.name} (ID: ${zoneData.id})`);
          console.log('Encounters:');

          if (zoneData.encounters && zoneData.encounters.length > 0) {
            zoneData.encounters.forEach(enc => {
              console.log(`  - ${enc.name} (ID: ${enc.id})`);
            });

            // 첫 번째와 마지막 보스의 상위 10% 로그 가져오기
            const firstBoss = zoneData.encounters[0];
            const lastBoss = zoneData.encounters[zoneData.encounters.length - 1];

            // 각 클래스별 상위 10% DPS 데이터 수집
            const classes = ['Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Shaman',
                           'Mage', 'Warlock', 'Monk', 'Druid', 'DemonHunter', 'DeathKnight', 'Evoker'];

            const dpsData = {};
            const hpsData = {};

            for (const className of classes) {
              console.log(`\n--- Fetching ${className} data ---`);

              // DPS 스펙 데이터
              const dpsQuery = `
                query {
                  worldData {
                    encounter(id: ${lastBoss.id}) {
                      characterRankings(
                        className: "${className}"
                        difficulty: 5
                        metric: dps
                        page: 1
                      )
                    }
                  }
                }
              `;

              const dpsResponse = await axios.post(
                'https://www.warcraftlogs.com/api/v2/client',
                {
                  query: dpsQuery
                },
                {
                  headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                  }
                }
              );

              const rankings = dpsResponse.data.data?.worldData?.encounter?.characterRankings?.rankings || [];

              if (rankings.length > 0) {
                // 상위 10% 필터링 (90 percentile 이상)
                const top10 = rankings.filter(r => r.percentile >= 90);

                if (top10.length > 0) {
                  const dpsValues = top10.map(r => r.amount);
                  const avg = dpsValues.reduce((a, b) => a + b, 0) / dpsValues.length;
                  const max = Math.max(...dpsValues);
                  const min = Math.min(...dpsValues);

                  dpsData[className.toLowerCase()] = {
                    average: Math.round(avg),
                    max: Math.round(max),
                    min: Math.round(min),
                    sampleSize: top10.length
                  };

                  console.log(`${className} DPS (Top 10%):`);
                  console.log(`  Average: ${Math.round(avg).toLocaleString()}`);
                  console.log(`  Max: ${Math.round(max).toLocaleString()}`);
                  console.log(`  Min: ${Math.round(min).toLocaleString()}`);
                  console.log(`  Sample size: ${top10.length}`);
                }
              }

              // HPS 데이터 (힐러 클래스만)
              const healerSpecs = {
                'Priest': ['Holy', 'Discipline'],
                'Paladin': ['Holy'],
                'Shaman': ['Restoration'],
                'Druid': ['Restoration'],
                'Monk': ['Mistweaver'],
                'Evoker': ['Preservation']
              };

              if (healerSpecs[className]) {
                for (const spec of healerSpecs[className]) {
                  const hpsQuery = `
                    query {
                      worldData {
                        encounter(id: ${lastBoss.id}) {
                          characterRankings(
                            className: "${className}"
                            specName: "${spec}"
                            difficulty: 5
                            metric: hps
                            page: 1
                          )
                        }
                      }
                    }
                  `;

                  const hpsResponse = await axios.post(
                    'https://www.warcraftlogs.com/api/v2/client',
                    {
                      query: hpsQuery
                    },
                    {
                      headers: {
                        'Authorization': `Bearer ${ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                      }
                    }
                  );

                  const healRankings = hpsResponse.data.data?.worldData?.encounter?.characterRankings?.rankings || [];

                  if (healRankings.length > 0) {
                    const top10Heals = healRankings.filter(r => r.percentile >= 90);

                    if (top10Heals.length > 0) {
                      const hpsValues = top10Heals.map(r => r.amount);
                      const avgHps = hpsValues.reduce((a, b) => a + b, 0) / hpsValues.length;
                      const maxHps = Math.max(...hpsValues);
                      const minHps = Math.min(...hpsValues);

                      hpsData[`${className.toLowerCase()}_${spec.toLowerCase()}`] = {
                        average: Math.round(avgHps),
                        max: Math.round(maxHps),
                        min: Math.round(minHps),
                        sampleSize: top10Heals.length
                      };

                      console.log(`${className} ${spec} HPS (Top 10%):`);
                      console.log(`  Average: ${Math.round(avgHps).toLocaleString()}`);
                      console.log(`  Max: ${Math.round(maxHps).toLocaleString()}`);
                      console.log(`  Min: ${Math.round(minHps).toLocaleString()}`);
                      console.log(`  Sample size: ${top10Heals.length}`);
                    }
                  }
                }
              }
            }

            // 결과 요약
            console.log('\n=== SUMMARY - Manaforge Omega Top 10% Data ===');
            console.log('\nDPS Averages:');
            Object.entries(dpsData).forEach(([cls, data]) => {
              console.log(`${cls}: ${data.average.toLocaleString()} DPS (${data.sampleSize} logs)`);
            });

            console.log('\nHPS Averages:');
            Object.entries(hpsData).forEach(([spec, data]) => {
              console.log(`${spec}: ${data.average.toLocaleString()} HPS (${data.sampleSize} logs)`);
            });

            // 찾았으면 종료
            return { dpsData, hpsData, zoneName: zoneData.name, zoneId: zoneData.id };
          }
        }
      } catch (error) {
        console.log(`Zone ${zone} not found or error: ${error.message}`);
      }
    }

    console.log('\n⚠️ Warning: Manaforge Omega raid not found. The raid might not be released yet or have a different ID.');
    console.log('Note: 11.2 patch content may not be available in the API yet.');

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

getManaforgeOmegaData();