const axios = require('axios');
const fs = require('fs');

const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZmU3NjYyZC0yMTMxLTQ0ZDUtYmMxMC00NWI5MGY0MGM4MTAiLCJqdGkiOiJmNzRiNjFhMDRiYTFiZjJjMTZiZmIwODczNjE2NWE4M2U0Njc3MTJiNDI3NGM2ZGU5ZDU2MDVlMjlmYTRhZGQ5MTg2ZTU3ZDY2ZjAxNTM5MiIsImlhdCI6MTc1ODE2NTE3OC40MjgyMTksIm5iZiI6MTc1ODE2NTE3OC40MjgyMjQsImV4cCI6MTc4OTI2OTE3OC40MTc1MTMsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.HSwAWSksTXMRsTebUJp2sgX5bDAKCWMzf-jB8c1XjT8qTKTEPkTBV6NDVfgIe_G0DCwdlM0cXywZRnnvz0rsAZoasNYHcYNHxuBs06oN4UKdNTc01kpUdWVzHKWi2ZvSF5iYLUUF4U8TvfcF4kwlKrAqwRkYv7yzsoN8ntaPTw8Y-NRThoIA5YvwQiMcTVlPaMOOVA5bO4_Gqhxojzrv-M31mgjbhBsiELEFfbjauEediPu_GpoQtPd0W1EybYk1755ZOZj9EiAMwrJn0HehPnw9CbbK3-W3k9IS-3nzbOqqqL8hvNHkLRcIMMhb5dGBMjt_xMLxLsoEg8_p3n5OHEqhH7HjZWNZtFtWi5jrgkqNaI2LeKmi05NkmMgW93LnuqDRMdWa8SKHynLYxQW4DB5EgQ3jODwRe_TFdEXSYkuTnzFPUM8o7oE5VKQWIBR7dxZ4DWxG47-6bev8Z7-KXY8NB3w_UfAydrRjHaBNzxA050KKXqaR8geUgdZul-H80Gu5tt9g9uqIrPvqSejaSVGQZ1l2M2nLu50PftSxcbvAJODYk_t2nxTpM01R5U-u7TFeSJkKkBrwKH8bG8AtV4fij6Pf-QAGwA__SEpTRsSFjgyU_kIMS_TqpOpaCjYHbBmdMoxyNhSrINQmbI2nBRUc0lexTqceLQEH8OCCUu0";

async function fetchManaforgeReports() {
  console.log('=== SEARCHING FOR MANAFORGE OMEGA REPORTS ===\n');

  try {
    // 최근 리포트에서 Manaforge Omega (zone 44) 찾기
    const query = `
      query {
        reportData {
          reports(
            zoneID: 44
            limit: 10
            page: 1
          ) {
            data {
              code
              title
              zone {
                id
                name
              }
              owner {
                name
              }
              startTime
              endTime
            }
            hasMorePages
          }
        }
      }
    `;

    console.log('Searching for Manaforge Omega reports (Zone 44)...\n');

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

    const reports = response.data?.data?.reportData?.reports;

    if (reports?.data && reports.data.length > 0) {
      console.log(`Found ${reports.data.length} Manaforge Omega reports!\n`);

      for (const report of reports.data) {
        console.log(`Report: ${report.code}`);
        console.log(`  Title: ${report.title}`);
        console.log(`  Zone: ${report.zone?.name} (ID: ${report.zone?.id})`);
        console.log(`  URL: https://www.warcraftlogs.com/reports/${report.code}`);
        console.log(`  Owner: ${report.owner?.name}`);
        console.log(`  Date: ${new Date(report.startTime).toLocaleString()}\n`);
      }

      // 첫 번째 리포트 상세 분석
      if (reports.data[0]) {
        const firstReport = reports.data[0];
        console.log(`\n=== ANALYZING FIRST REPORT: ${firstReport.code} ===\n`);

        // 리포트의 전투 데이터 가져오기
        const detailQuery = `
          query {
            reportData {
              report(code: "${firstReport.code}") {
                fights {
                  id
                  name
                  encounterID
                  difficulty
                  kill
                  size
                  averageItemLevel
                }
                playerDetails(fightIDs: [1]) {
                  data {
                    playerDetails {
                      name
                      class
                      spec
                    }
                  }
                }
                rankings
              }
            }
          }
        `;

        const detailResponse = await axios.post(
          'https://www.warcraftlogs.com/api/v2/client',
          { query: detailQuery },
          {
            headers: {
              'Authorization': `Bearer ${ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const reportDetails = detailResponse.data?.data?.reportData?.report;

        if (reportDetails?.fights) {
          const bossFights = reportDetails.fights.filter(f => f.encounterID);
          console.log(`Boss Fights: ${bossFights.length}`);

          bossFights.forEach(fight => {
            console.log(`\n${fight.name} (ID: ${fight.encounterID})`);
            console.log(`  Difficulty: ${fight.difficulty}`);
            console.log(`  Kill: ${fight.kill ? 'Yes' : 'No'}`);
            console.log(`  Size: ${fight.size} players`);
            console.log(`  Avg iLvl: ${fight.averageItemLevel}`);
          });
        }

        // 데이터 저장
        const saveData = {
          zone: 'Manaforge Omega',
          zoneId: 44,
          reports: reports.data,
          firstReportDetails: reportDetails,
          fetchedAt: new Date().toISOString()
        };

        fs.writeFileSync('manaforge-reports-list.json', JSON.stringify(saveData, null, 2));
        console.log('\n✅ Manaforge Omega reports saved to manaforge-reports-list.json');
      }
    } else {
      console.log('No reports found for Manaforge Omega (Zone 44)');

      // 대안: 모든 존 리스트 확인
      console.log('\nChecking all available zones...\n');

      const zoneQuery = `
        query {
          worldData {
            zones {
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

      const zoneResponse = await axios.post(
        'https://www.warcraftlogs.com/api/v2/client',
        { query: zoneQuery },
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const zones = zoneResponse.data?.data?.worldData?.zones;

      if (zones) {
        const manaforgeZone = zones.find(z => z.id === 44 || z.name?.includes('Manaforge'));

        if (manaforgeZone) {
          console.log('Manaforge Zone found!');
          console.log(`  ID: ${manaforgeZone.id}`);
          console.log(`  Name: ${manaforgeZone.name}`);
          console.log(`  Encounters: ${manaforgeZone.encounters?.length || 0}`);

          if (manaforgeZone.encounters) {
            manaforgeZone.encounters.forEach(enc => {
              console.log(`    - ${enc.name} (ID: ${enc.id})`);
            });
          }
        } else {
          console.log('Manaforge Omega zone not found in zone list');

          // 최신 존 표시
          console.log('\nLatest zones:');
          zones.slice(-5).forEach(z => {
            console.log(`  ${z.id}: ${z.name}`);
          });
        }
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// 실행
fetchManaforgeReports();