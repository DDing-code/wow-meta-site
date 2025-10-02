const axios = require('axios');
const fs = require('fs');

const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZmU3NjYyZC0yMTMxLTQ0ZDUtYmMxMC00NWI5MGY0MGM4MTAiLCJqdGkiOiJmNzRiNjFhMDRiYTFiZjJjMTZiZmIwODczNjE2NWE4M2U0Njc3MTJiNDI3NGM2ZGU5ZDU2MDVlMjlmYTRhZGQ5MTg2ZTU3ZDY2ZjAxNTM5MiIsImlhdCI6MTc1ODE2NTE3OC40MjgyMTksIm5iZiI6MTc1ODE2NTE3OC40MjgyMjQsImV4cCI6MTc4OTI2OTE3OC40MTc1MTMsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.HSwAWSksTXMRsTebUJp2sgX5bDAKCWMzf-jB8c1XjT8qTKTEPkTBV6NDVfgIe_G0DCwdlM0cXywZRnnvz0rsAZoasNYHcYNHxuBs06oN4UKdNTc01kpUdWVzHKWi2ZvSF5iYLUUF4U8TvfcF4kwlKrAqwRkYv7yzsoN8ntaPTw8Y-NRThoIA5YvwQiMcTVlPaMOOVA5bO4_Gqhxojzrv-M31mgjbhBsiELEFfbjauEediPu_GpoQtPd0W1EybYk1755ZOZj9EiAMwrJn0HehPnw9CbbK3-W3k9IS-3nzbOqqqL8hvNHkLRcIMMhb5dGBMjt_xMLxLsoEg8_p3n5OHEqhH7HjZWNZtFtWi5jrgkqNaI2LeKmi05NkmMgW93LnuqDRMdWa8SKHynLYxQW4DB5EgQ3jODwRe_TFdEXSYkuTnzFPUM8o7oE5VKQWIBR7dxZ4DWxG47-6bev8Z7-KXY8NB3w_UfAydrRjHaBNzxA050KKXqaR8geUgdZul-H80Gu5tt9g9uqIrPvqSejaSVGQZ1l2M2nLu50PftSxcbvAJODYk_t2nxTpM01R5U-u7TFeSJkKkBrwKH8bG8AtV4fij6Pf-QAGwA__SEpTRsSFjgyU_kIMS_TqpOpaCjYHbBmdMoxyNhSrINQmbI2nBRUc0lexTqceLQEH8OCCUu0";

// Manaforge Omega의 모든 보스들
const MANAFORGE_BOSSES = [
  { id: 3131, name: "Plexus Sentinel" },
  { id: 3132, name: "Loomithar" },
  { id: 3133, name: "Keeper Artificer Xy'mox" },
  { id: 3134, name: "Nexus-King Zalazar" },
  { id: 3135, name: "Dimensius, the All-Devouring" }
];

// 모든 클래스/스펙 조합
const CLASS_SPECS = [
  { className: 'Warrior', specs: ['Arms', 'Fury', 'Protection'] },
  { className: 'Paladin', specs: ['Holy', 'Protection', 'Retribution'] },
  { className: 'Hunter', specs: ['BeastMastery', 'Marksmanship', 'Survival'] },
  { className: 'Rogue', specs: ['Assassination', 'Outlaw', 'Subtlety'] },
  { className: 'Priest', specs: ['Discipline', 'Holy', 'Shadow'] },
  { className: 'Shaman', specs: ['Elemental', 'Enhancement', 'Restoration'] },
  { className: 'Mage', specs: ['Arcane', 'Fire', 'Frost'] },
  { className: 'Warlock', specs: ['Affliction', 'Demonology', 'Destruction'] },
  { className: 'Monk', specs: ['Brewmaster', 'Mistweaver', 'Windwalker'] },
  { className: 'Druid', specs: ['Balance', 'Feral', 'Guardian', 'Restoration'] },
  { className: 'DemonHunter', specs: ['Havoc', 'Vengeance'] },
  { className: 'DeathKnight', specs: ['Blood', 'Frost', 'Unholy'] },
  { className: 'Evoker', specs: ['Augmentation', 'Devastation', 'Preservation'] }
];

async function fetchBossRankings(bossId, bossName) {
  const allData = {
    dps: [],
    hps: []
  };

  console.log(`\n🎯 Fetching ${bossName} (ID: ${bossId})...`);

  for (const classData of CLASS_SPECS) {
    for (const spec of classData.specs) {
      try {
        // DPS/HPS 구분
        const isHealer = ['Holy', 'Discipline', 'Restoration', 'Mistweaver', 'Preservation'].includes(spec);
        const metric = isHealer ? 'hps' : 'dps';

        // 더 많은 데이터를 가져오기 위해 difficulty를 낮춤 (Heroic 포함)
        const query = `
          query {
            worldData {
              encounter(id: ${bossId}) {
                characterRankings(
                  className: "${classData.className}"
                  specName: "${spec}"
                  metric: ${metric}
                  difficulty: 5
                  page: 1
                  includeCombatantInfo: true
                ) {
                  rankings {
                    rank
                    rankPercent
                    lockedIn
                    rankOutOf
                    total
                    encounter {
                      name
                    }
                    report {
                      code
                    }
                    startTime
                    duration
                    amount
                    spec
                    bestSpec
                    class
                    name
                    serverRegion
                    serverSlug
                    bracketData
                    faction
                  }
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

        const rankings = response.data?.data?.worldData?.encounter?.characterRankings?.rankings || [];

        if (rankings.length > 0) {
          console.log(`  ✅ ${classData.className} ${spec}: Found ${rankings.length} logs`);

          // 상위 10% 필터링 (90 percentile 이상)
          const top10Percent = rankings.filter(r => r.rankPercent >= 90);

          if (top10Percent.length > 0) {
            const avgDPS = top10Percent.reduce((sum, r) => sum + r.amount, 0) / top10Percent.length;
            const topDPS = Math.max(...top10Percent.map(r => r.amount));

            const specData = {
              boss: bossName,
              bossId: bossId,
              className: classData.className.toLowerCase(),
              specName: spec.toLowerCase(),
              average: Math.round(avgDPS),
              topPercentile: Math.round(topDPS),
              sampleSize: top10Percent.length,
              confidence: Math.min(0.99, 0.5 + (top10Percent.length / 100)),
              percentile: 95,
              source: 'manaforge_omega'
            };

            if (isHealer) {
              allData.hps.push(specData);
            } else {
              allData.dps.push(specData);
            }
          }
        }

        // API 제한 방지
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        // 에러는 무시하고 계속 진행
      }
    }
  }

  return allData;
}

async function fetchAllManaforgeData() {
  console.log('=== FETCHING ALL MANAFORGE OMEGA DATA ===');
  console.log('Collecting data from ALL bosses for better coverage...\n');

  const completeData = {
    dps: [],
    hps: [],
    metadata: {
      zone: 'Manaforge Omega',
      zoneId: 44,
      patch: '11.2',
      fetchedAt: new Date().toISOString(),
      bosses: MANAFORGE_BOSSES
    }
  };

  // 모든 보스에서 데이터 수집
  for (const boss of MANAFORGE_BOSSES) {
    const bossData = await fetchBossRankings(boss.id, boss.name);
    completeData.dps.push(...bossData.dps);
    completeData.hps.push(...bossData.hps);
  }

  // 클래스/스펙별로 최고 데이터만 유지 (중복 제거)
  const consolidatedDPS = {};
  const consolidatedHPS = {};

  completeData.dps.forEach(spec => {
    const key = `${spec.className}_${spec.specName}`;
    if (!consolidatedDPS[key] || spec.topPercentile > consolidatedDPS[key].topPercentile) {
      consolidatedDPS[key] = spec;
    }
  });

  completeData.hps.forEach(spec => {
    const key = `${spec.className}_${spec.specName}`;
    if (!consolidatedHPS[key] || spec.topPercentile > consolidatedHPS[key].topPercentile) {
      consolidatedHPS[key] = spec;
    }
  });

  // 티어 계산
  const calculateTier = (rank) => {
    if (rank <= 2) return 'S+';
    if (rank <= 5) return 'S';
    if (rank <= 10) return 'A+';
    if (rank <= 15) return 'A';
    if (rank <= 20) return 'B+';
    if (rank <= 25) return 'B';
    if (rank <= 30) return 'C';
    return 'D';
  };

  // DPS 순위 정렬 및 티어 할당
  const sortedDPS = Object.values(consolidatedDPS)
    .sort((a, b) => b.topPercentile - a.topPercentile)
    .map((spec, index) => ({
      ...spec,
      rank: index + 1,
      tier: calculateTier(index + 1)
    }));

  // HPS 순위 정렬 및 티어 할당
  const sortedHPS = Object.values(consolidatedHPS)
    .sort((a, b) => b.topPercentile - a.topPercentile)
    .map((spec, index) => ({
      ...spec,
      rank: index + 1,
      tier: calculateTier(index + 1)
    }));

  // 최종 데이터
  const finalData = {
    metadata: completeData.metadata,
    rankings: {
      dps: sortedDPS,
      hps: sortedHPS,
      tanks: [], // 탱커는 별도 처리 필요
      overall: [...sortedDPS, ...sortedHPS]
    },
    summary: {
      totalDPSSpecs: sortedDPS.length,
      totalHPSSpecs: sortedHPS.length,
      topDPS: sortedDPS[0],
      topHPS: sortedHPS[0]
    }
  };

  // 파일 저장
  fs.writeFileSync('manaforge-complete-data.json', JSON.stringify(finalData, null, 2));

  // 결과 출력
  console.log('\n=== MANAFORGE OMEGA COMPLETE DATA ===\n');
  console.log(`Total DPS specs with data: ${sortedDPS.length}`);
  console.log(`Total HPS specs with data: ${sortedHPS.length}`);

  if (sortedDPS.length > 0) {
    console.log('\nTop 5 DPS:');
    sortedDPS.slice(0, 5).forEach(spec => {
      console.log(`  ${spec.rank}. ${spec.className} ${spec.specName}: ${spec.topPercentile.toLocaleString()} DPS (${spec.tier} Tier)`);
    });
  }

  if (sortedHPS.length > 0) {
    console.log('\nTop 5 HPS:');
    sortedHPS.slice(0, 5).forEach(spec => {
      console.log(`  ${spec.rank}. ${spec.className} ${spec.specName}: ${spec.topPercentile.toLocaleString()} HPS (${spec.tier} Tier)`);
    });
  }

  console.log('\n✅ Data saved to manaforge-complete-data.json');

  return finalData;
}

// 실행
fetchAllManaforgeData().catch(console.error);