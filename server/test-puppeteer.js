const puppeteerScraper = require('./warcraftlogs-puppeteer');

async function testPuppeteer() {
  console.log('🚀 WarcraftLogs Puppeteer 테스트 시작...\n');

  try {
    // 전체 랭킹 (모든 클래스)
    console.log('📊 전체 DPS 랭킹 스크래핑 중...');
    const allRankings = await puppeteerScraper.fetchRankings(44);

    if (allRankings.length > 0) {
      console.log(`\n✅ ${allRankings.length}개 랭킹 데이터 수집`);
      console.log('\n🏆 상위 10명:');
      allRankings.slice(0, 10).forEach(player => {
        console.log(`  ${player.rank}. ${player.name} (${player.guild}) - DPS: ${player.dps.toLocaleString()}`);
      });
    } else {
      console.log('⚠️ 랭킹 데이터를 가져오지 못했습니다');
    }

    await puppeteerScraper.close();
    console.log('\n✅ 테스트 완료');

  } catch (error) {
    console.error('❌ 테스트 실패:', error);
    await puppeteerScraper.close();
  }
}

testPuppeteer();