const axios = require('axios');

const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZmU3NjYyZC0yMTMxLTQ0ZDUtYmMxMC00NWI5MGY0MGM4MTAiLCJqdGkiOiJmNzRiNjFhMDRiYTFiZjJjMTZiZmIwODczNjE2NWE4M2U0Njc3MTJiNDI3NGM2ZGU5ZDU2MDVlMjlmYTRhZGQ5MTg2ZTU3ZDY2ZjAxNTM5MiIsImlhdCI6MTc1ODE2NTE3OC40MjgyMTksIm5iZiI6MTc1ODE2NTE3OC40MjgyMjQsImV4cCI6MTc4OTI2OTE3OC40MTc1MTMsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.HSwAWSksTXMRsTebUJp2sgX5bDAKCWMzf-jB8c1XjT8qTKTEPkTBV6NDVfgIe_G0DCwdlM0cXywZRnnvz0rsAZoasNYHcYNHxuBs06oN4UKdNTc01kpUdWVzHKWi2ZvSF5iYLUUF4U8TvfcF4kwlKrAqwRkYv7yzsoN8ntaPTw8Y-NRThoIA5YvwQiMcTVlPaMOOVA5bO4_Gqhxojzrv-M31mgjbhBsiELEFfbjauEediPu_GpoQtPd0W1EybYk1755ZOZj9EiAMwrJn0HehPnw9CbbK3-W3k9IS-3nzbOqqqL8hvNHkLRcIMMhb5dGBMjt_xMLxLsoEg8_p3n5OHEqhH7HjZWNZtFtWi5jrgkqNaI2LeKmi05NkmMgW93LnuqDRMdWa8SKHynLYxQW4DB5EgQ3jODwRe_TFdEXSYkuTnzFPUM8o7oE5VKQWIBR7dxZ4DWxG47-6bev8Z7-KXY8NB3w_UfAydrRjHaBNzxA050KKXqaR8geUgdZul-H80Gu5tt9g9uqIrPvqSejaSVGQZ1l2M2nLu50PftSxcbvAJODYk_t2nxTpM01R5U-u7TFeSJkKkBrwKH8bG8AtV4fij6Pf-QAGwA__SEpTRsSFjgyU_kIMS_TqpOpaCjYHbBmdMoxyNhSrINQmbI2nBRUc0lexTqceLQEH8OCCUu0";

async function fetchManaforgeData() {
  console.log('=== Fetching Manaforge Omega Raid Data (Zone 44) ===\n');

  try {
    // Dimensius (최종 보스) 데이터 직접 조회
    const bossId = 3135; // Dimensius, the All-Devouring
    console.log(`Fetching data for Dimensius (ID: ${bossId})...\n`);

    // 먼저 보스에 대한 로그가 있는지 확인
    const testQuery = `
      query {
        worldData {
          encounter(id: ${bossId}) {
            id
            name
            zone {
              id
              name
            }
          }
        }
      }
    `;

    const testResponse = await axios.post(
      'https://www.warcraftlogs.com/api/v2/client',
      { query: testQuery },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Boss info:', JSON.stringify(testResponse.data.data?.worldData?.encounter, null, 2));

    // 각 클래스별로 데이터 조회 (스펙 지정 없이)
    const classes = [
      { name: 'Warrior', specs: ['Arms', 'Fury', 'Protection'] },
      { name: 'Paladin', specs: ['Holy', 'Protection', 'Retribution'] },
      { name: 'Hunter', specs: ['BeastMastery', 'Marksmanship', 'Survival'] },
      { name: 'Rogue', specs: ['Assassination', 'Outlaw', 'Subtlety'] },
      { name: 'Priest', specs: ['Discipline', 'Holy', 'Shadow'] },
      { name: 'Shaman', specs: ['Elemental', 'Enhancement', 'Restoration'] },
      { name: 'Mage', specs: ['Arcane', 'Fire', 'Frost'] },
      { name: 'Warlock', specs: ['Affliction', 'Demonology', 'Destruction'] },
      { name: 'Monk', specs: ['Brewmaster', 'Mistweaver', 'Windwalker'] },
      { name: 'Druid', specs: ['Balance', 'Feral', 'Guardian', 'Restoration'] },
      { name: 'DemonHunter', specs: ['Havoc', 'Vengeance'] },
      { name: 'DeathKnight', specs: ['Blood', 'Frost', 'Unholy'] },
      { name: 'Evoker', specs: ['Augmentation', 'Devastation', 'Preservation'] }
    ];

    const allData = {
      dps: {},
      hps: {}
    };

    for (const classInfo of classes) {
      console.log(`\n--- Checking ${classInfo.name} ---`);

      // 각 스펙별로 시도
      for (const spec of classInfo.specs) {
        const query = `
          query {
            worldData {
              encounter(id: ${bossId}) {
                characterRankings(
                  className: "${classInfo.name}"
                  specName: "${spec}"
                  difficulty: 5
                  metric: dps
                  page: 1
                )
              }
            }
          }
        `;

        try {
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

          const rankingsData = response.data.data?.worldData?.encounter?.characterRankings;

          if (rankingsData) {
            const rankings = rankingsData.rankings || [];

            if (rankings.length > 0) {
              console.log(`  ${spec}: Found ${rankings.length} logs`);

              // 상위 10% 필터링
              const top10 = rankings.filter(r => r.percentile >= 90);

              if (top10.length > 0) {
                const dpsValues = top10.map(r => r.amount);
                const avg = Math.round(dpsValues.reduce((a, b) => a + b, 0) / dpsValues.length);
                const max = Math.round(Math.max(...dpsValues));
                const min = Math.round(Math.min(...dpsValues));

                allData.dps[`${classInfo.name.toLowerCase()}_${spec.toLowerCase()}`] = {
                  average: avg,
                  max: max,
                  min: min,
                  topPercentile: Math.round(top10[0].amount),
                  sampleSize: top10.length
                };

                console.log(`    Top 10% Average: ${avg.toLocaleString()} DPS`);
                console.log(`    Range: ${min.toLocaleString()} - ${max.toLocaleString()}`);
                console.log(`    Sample size: ${top10.length}`);
              }
            } else {
              console.log(`  ${spec}: No logs found`);
            }
          }
        } catch (error) {
          console.log(`  ${spec}: Error fetching data`);
        }

        // HPS 데이터 (힐러 스펙만)
        const healerSpecs = ['Holy', 'Discipline', 'Restoration', 'Mistweaver', 'Preservation'];
        if (healerSpecs.includes(spec)) {
          const hpsQuery = `
            query {
              worldData {
                encounter(id: ${bossId}) {
                  characterRankings(
                    className: "${classInfo.name}"
                    specName: "${spec}"
                    difficulty: 5
                    metric: hps
                    page: 1
                  )
                }
              }
            }
          `;

          try {
            const hpsResponse = await axios.post(
              'https://www.warcraftlogs.com/api/v2/client',
              { query: hpsQuery },
              {
                headers: {
                  'Authorization': `Bearer ${ACCESS_TOKEN}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            const hpsRankingsData = hpsResponse.data.data?.worldData?.encounter?.characterRankings;

            if (hpsRankingsData) {
              const hpsRankings = hpsRankingsData.rankings || [];

              if (hpsRankings.length > 0) {
                const top10Hps = hpsRankings.filter(r => r.percentile >= 90);

                if (top10Hps.length > 0) {
                  const hpsValues = top10Hps.map(r => r.amount);
                  const avgHps = Math.round(hpsValues.reduce((a, b) => a + b, 0) / hpsValues.length);
                  const maxHps = Math.round(Math.max(...hpsValues));
                  const minHps = Math.round(Math.min(...hpsValues));

                  allData.hps[`${classInfo.name.toLowerCase()}_${spec.toLowerCase()}`] = {
                    average: avgHps,
                    max: maxHps,
                    min: minHps,
                    topPercentile: Math.round(top10Hps[0].amount),
                    sampleSize: top10Hps.length
                  };

                  console.log(`    HPS - Top 10% Average: ${avgHps.toLocaleString()} HPS`);
                  console.log(`    HPS - Range: ${minHps.toLocaleString()} - ${maxHps.toLocaleString()}`);
                }
              }
            }
          } catch (error) {
            console.log(`  ${spec}: Error fetching HPS data`);
          }
        }
      }
    }

    // 결과 출력
    console.log('\n\n=== FINAL SUMMARY - Manaforge Omega Top 10% Data ===\n');

    console.log('DPS DATA:');
    console.log('----------');
    Object.entries(allData.dps).forEach(([spec, data]) => {
      console.log(`${spec}:`);
      console.log(`  Average: ${data.average.toLocaleString()}`);
      console.log(`  Min: ${data.min.toLocaleString()}`);
      console.log(`  Max: ${data.max.toLocaleString()}`);
      console.log(`  Top Percentile: ${data.topPercentile.toLocaleString()}`);
      console.log(`  Sample Size: ${data.sampleSize}\n`);
    });

    console.log('\nHPS DATA:');
    console.log('----------');
    Object.entries(allData.hps).forEach(([spec, data]) => {
      console.log(`${spec}:`);
      console.log(`  Average: ${data.average.toLocaleString()}`);
      console.log(`  Min: ${data.min.toLocaleString()}`);
      console.log(`  Max: ${data.max.toLocaleString()}`);
      console.log(`  Top Percentile: ${data.topPercentile.toLocaleString()}`);
      console.log(`  Sample Size: ${data.sampleSize}\n`);
    });

    // JSON 형식으로 저장
    const fs = require('fs');
    fs.writeFileSync('manaforge-omega-data.json', JSON.stringify(allData, null, 2));
    console.log('\nData saved to manaforge-omega-data.json');

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

fetchManaforgeData();