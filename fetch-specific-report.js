const axios = require('axios');
const fs = require('fs');

const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZmU3NjYyZC0yMTMxLTQ0ZDUtYmMxMC00NWI5MGY0MGM4MTAiLCJqdGkiOiJmNzRiNjFhMDRiYTFiZjJjMTZiZmIwODczNjE2NWE4M2U0Njc3MTJiNDI3NGM2ZGU5ZDU2MDVlMjlmYTRhZGQ5MTg2ZTU3ZDY2ZjAxNTM5MiIsImlhdCI6MTc1ODE2NTE3OC40MjgyMTksIm5iZiI6MTc1ODE2NTE3OC40MjgyMjQsImV4cCI6MTc4OTI2OTE3OC40MTc1MTMsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.HSwAWSksTXMRsTebUJp2sgX5bDAKCWMzf-jB8c1XjT8qTKTEPkTBV6NDVfgIe_G0DCwdlM0cXywZRnnvz0rsAZoasNYHcYNHxuBs06oN4UKdNTc01kpUdWVzHKWi2ZvSF5iYLUUF4U8TvfcF4kwlKrAqwRkYv7yzsoN8ntaPTw8Y-NRThoIA5YvwQiMcTVlPaMOOVA5bO4_Gqhxojzrv-M31mgjbhBsiELEFfbjauEediPu_GpoQtPd0W1EybYk1755ZOZj9EiAMwrJn0HehPnw9CbbK3-W3k9IS-3nzbOqqqL8hvNHkLRcIMMhb5dGBMjt_xMLxLsoEg8_p3n5OHEqhH7HjZWNZtFtWi5jrgkqNaI2LeKmi05NkmMgW93LnuqDRMdWa8SKHynLYxQW4DB5EgQ3jODwRe_TFdEXSYkuTnzFPUM8o7oE5VKQWIBR7dxZ4DWxG47-6bev8Z7-KXY8NB3w_UfAydrRjHaBNzxA050KKXqaR8geUgdZul-H80Gu5tt9g9uqIrPvqSejaSVGQZ1l2M2nLu50PftSxcbvAJODYk_t2nxTpM01R5U-u7TFeSJkKkBrwKH8bG8AtV4fij6Pf-QAGwA__SEpTRsSFjgyU_kIMS_TqpOpaCjYHbBmdMoxyNhSrINQmbI2nBRUc0lexTqceLQEH8OCCUu0";

// 제공된 리포트 코드
const REPORT_CODE = "aLhXZqfNQA8CyHKY";

async function fetchSpecificReport() {
  console.log('=== FETCHING MANAFORGE OMEGA REPORT ===');
  console.log(`Report Code: ${REPORT_CODE}`);
  console.log(`URL: https://www.warcraftlogs.com/reports/${REPORT_CODE}\n`);

  try {
    // 리포트 상세 정보 가져오기
    const query = `
      query {
        reportData {
          report(code: "${REPORT_CODE}") {
            title
            zone {
              id
              name
            }
            startTime
            endTime
            fights {
              id
              name
              difficulty
              kill
              startTime
              endTime
              encounterID
              size
              averageItemLevel
            }
            masterData {
              actors {
                id
                name
                type
                subType
                server
                class
                spec
              }
            }
            rankings {
              data
              spec
              class
              encounter {
                id
                name
              }
              total
              rank
              rankPercent
            }
          }
        }
      }
    `;

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

    const report = response.data?.data?.reportData?.report;

    if (report) {
      console.log('=== REPORT DETAILS ===');
      console.log(`Title: ${report.title}`);
      console.log(`Zone: ${report.zone?.name} (ID: ${report.zone?.id})`);

      if (report.fights) {
        console.log(`\nTotal Fights: ${report.fights.length}`);

        // 보스전 필터링
        const bossFights = report.fights.filter(f => f.encounterID && f.name !== 'Unknown');
        console.log(`Boss Fights: ${bossFights.length}`);

        console.log('\n=== BOSS ENCOUNTERS ===');
        bossFights.forEach(fight => {
          console.log(`\nFight #${fight.id}: ${fight.name}`);
          console.log(`  - Encounter ID: ${fight.encounterID}`);
          console.log(`  - Difficulty: ${fight.difficulty}`);
          console.log(`  - Kill: ${fight.kill ? 'Yes' : 'No'}`);
          console.log(`  - Size: ${fight.size} players`);
          console.log(`  - Average iLvl: ${fight.averageItemLevel}`);
        });
      }

      if (report.masterData?.actors) {
        const players = report.masterData.actors.filter(a => a.type === 'Player');
        console.log('\n=== PLAYERS IN RAID ===');
        console.log(`Total Players: ${players.length}`);

        // 클래스별 분류
        const classBreakdown = {};
        players.forEach(player => {
          const key = `${player.class}_${player.spec}`;
          if (!classBreakdown[key]) {
            classBreakdown[key] = [];
          }
          classBreakdown[key].push(player.name);
        });

        console.log('\nClass/Spec Distribution:');
        Object.entries(classBreakdown).forEach(([spec, players]) => {
          console.log(`  ${spec}: ${players.length} players`);
        });
      }

      // Fight #16 상세 데이터 가져오기 (URL에 명시된 fight)
      console.log('\n=== FETCHING FIGHT #16 DATA ===');

      const fightQuery = `
        query {
          reportData {
            report(code: "${REPORT_CODE}") {
              rankings(fightIDs: [16]) {
                data {
                  name
                  class
                  spec
                  amount
                  activeTime
                }
              }
              table(fightIDs: [16], dataType: DamageDone)
              healingTable: table(fightIDs: [16], dataType: HealingDone)
            }
          }
        }
      `;

      const fightResponse = await axios.post(
        'https://www.warcraftlogs.com/api/v2/client',
        { query: fightQuery },
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const fightData = fightResponse.data?.data?.reportData?.report;

      if (fightData?.rankings) {
        console.log('\nRankings Data:');
        const rankings = fightData.rankings.data || [];
        rankings.forEach(player => {
          console.log(`  ${player.name} (${player.class} ${player.spec}): ${Math.round(player.amount).toLocaleString()}`);
        });
      }

      // 데이터 저장
      const saveData = {
        reportCode: REPORT_CODE,
        url: `https://www.warcraftlogs.com/reports/${REPORT_CODE}`,
        zone: report.zone,
        fights: report.fights,
        players: report.masterData?.actors,
        fetchedAt: new Date().toISOString()
      };

      fs.writeFileSync('manaforge-report-data.json', JSON.stringify(saveData, null, 2));
      console.log('\n✅ Report data saved to manaforge-report-data.json');

      // 중요: Zone ID 확인
      if (report.zone?.id === 44) {
        console.log('\n🎯 CONFIRMED: This is a Manaforge Omega (Zone 44) log!');
        console.log('The raid DOES exist with real data!');
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response?.data?.errors) {
      console.error('GraphQL errors:', JSON.stringify(error.response.data.errors, null, 2));
    }
  }
}

// 실행
fetchSpecificReport();