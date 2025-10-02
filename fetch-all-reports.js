const axios = require('axios');
const fs = require('fs');

// API 자격 증명
const CLIENT_ID = '9fe8551a-dae1-4d5e-9011-40d6d1a8555a';
const CLIENT_SECRET = 'J2GN0ws8Njjd0cc5MDk5GJJK7EpUPExeLUaK7oID';

async function getAccessToken() {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const response = await axios.post(
      'https://www.warcraftlogs.com/oauth/token',
      params,
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Token error:', error.response?.data || error.message);
    throw error;
  }
}

async function fetchRecentReports(token) {
  console.log('=== FETCHING RECENT MANAFORGE REPORTS ===\n');

  // 최근 리포트들을 가져오는 쿼리
  const query = `
    query {
      reportData {
        reports(
          zoneID: 44
          limit: 10
        ) {
          data {
            code
            title
            owner {
              name
            }
            startTime
            endTime
            zone {
              name
            }
            rankings {
              metric
              difficulty
              fightID
              encounter {
                name
              }
              roles {
                dps {
                  characters {
                    name
                    class {
                      name
                    }
                    spec {
                      name
                    }
                    amount
                    bracketPercent
                  }
                }
                healers {
                  characters {
                    name
                    class {
                      name
                    }
                    spec {
                      name
                    }
                    amount
                    bracketPercent
                  }
                }
                tanks {
                  characters {
                    name
                    class {
                      name
                    }
                    spec {
                      name
                    }
                    amount
                    bracketPercent
                  }
                }
              }
            }
          }
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Query error:', error.response?.data || error.message);
    if (error.response?.data?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.data.errors, null, 2));
    }
  }
  return null;
}

async function fetchRankingsData(token) {
  console.log('\n=== FETCHING RANKINGS DATA ===\n');

  // 다른 방법으로 랭킹 데이터 가져오기
  const query = `
    query {
      worldData {
        encounter(id: 3131) {
          characterRankings(
            metric: dps
            page: 1
          ) {
            rankings {
              name
              class
              spec
              amount
              guild {
                name
              }
              server {
                name
                region
              }
            }
          }
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data?.data?.worldData?.encounter?.characterRankings?.rankings) {
      const rankings = response.data.data.worldData.encounter.characterRankings.rankings;
      console.log(`Found ${rankings.length} rankings!`);

      if (rankings.length > 0) {
        console.log('\nTop 5 players:');
        rankings.slice(0, 5).forEach((r, i) => {
          console.log(`${i+1}. ${r.name} (${r.guild?.name}) - ${r.class} ${r.spec}: ${Math.round(r.amount).toLocaleString()} DPS`);
        });
      }

      return rankings;
    }
  } catch (error) {
    console.error('Rankings error:', error.response?.data || error.message);
  }
  return [];
}

async function fetchAllDifficulties(token) {
  console.log('\n=== TRYING ALL DIFFICULTY LEVELS ===\n');

  const difficulties = [
    { id: 3, name: 'Normal' },
    { id: 4, name: 'Heroic' },
    { id: 5, name: 'Mythic' }
  ];

  const allData = {
    zone: 'Manaforge Omega',
    zoneId: 44,
    patch: '11.2',
    timestamp: new Date().toISOString(),
    difficulties: {}
  };

  for (const diff of difficulties) {
    console.log(`\nTrying ${diff.name} difficulty (${diff.id})...`);

    const query = `
      query {
        worldData {
          encounter(id: 3131) {
            characterRankings(
              difficulty: ${diff.id}
              metric: dps
              page: 1
            ) {
              rankings {
                name
                class
                spec
                amount
                guild {
                  name
                }
                server {
                  name
                  region
                }
              }
            }
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const rankings = response.data?.data?.worldData?.encounter?.characterRankings?.rankings || [];
      console.log(`  Found ${rankings.length} rankings for ${diff.name}`);

      if (rankings.length > 0) {
        allData.difficulties[diff.name] = rankings;
        console.log(`  Top player: ${rankings[0].name} - ${Math.round(rankings[0].amount).toLocaleString()} DPS`);
      }
    } catch (error) {
      console.log(`  Error for ${diff.name}: ${error.message}`);
    }
  }

  return allData;
}

async function main() {
  try {
    console.log('Getting access token...');
    const token = await getAccessToken();
    console.log('✅ Token acquired!\n');

    // 최근 리포트 확인
    const reports = await fetchRecentReports(token);

    // 랭킹 데이터 직접 가져오기
    const rankings = await fetchRankingsData(token);

    // 모든 난이도 시도
    const allDifficultyData = await fetchAllDifficulties(token);

    // 데이터 저장
    const finalData = {
      reports: reports?.data?.reportData?.reports?.data || [],
      rankings: rankings,
      allDifficulties: allDifficultyData,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync('manaforge-all-data.json', JSON.stringify(finalData, null, 2));
    console.log('\n✅ All data saved to manaforge-all-data.json');

  } catch (error) {
    console.error('Fatal error:', error.message);
  }
}

main();