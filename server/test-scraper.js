const scraper = require('./warcraftlogs-scraper');

async function testScraper() {
  console.log('🚀 WarcraftLogs 스크래퍼 테스트 시작...\n');

  try {
    // Zone 44 (Nerub-ar Palace) 전사 랭킹 스크래핑
    console.log('📊 전사(Warrior) 랭킹 스크래핑 중...');
    const warriorRankings = await scraper.scrapeRankings(44, null, 'dps', 'warrior', 'fury');

    console.log('\n✅ 스크래핑 결과:');
    console.log(`- 데이터 개수: ${warriorRankings.length}개`);

    if (warriorRankings.length > 0) {
      console.log('\n🏆 상위 5명:');
      warriorRankings.slice(0, 5).forEach(player => {
        console.log(`  ${player.rank}. ${player.name} (${player.guild}) - DPS: ${player.dps.toLocaleString()}`);
      });
    }

    // 다른 클래스도 테스트
    console.log('\n📊 마법사(Mage) 랭킹 스크래핑 중...');
    const mageRankings = await scraper.scrapeRankings(44, null, 'dps', 'mage', 'fire');

    if (mageRankings.length > 0) {
      console.log(`✅ 마법사 데이터 ${mageRankings.length}개 수집`);
      console.log(`  상위 플레이어: ${mageRankings[0].name} (${mageRankings[0].guild})`);
    }

  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  }
}

testScraper();