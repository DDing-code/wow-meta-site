const networkIntercept = require('./warcraftlogs-network-intercept');

async function testNetworkIntercept() {
  console.log('🚀 WarcraftLogs 네트워크 인터셉트 테스트 시작...\n');
  console.log('📌 브라우저가 열립니다. WarcraftLogs 페이지가 로드될 때까지 기다려주세요...\n');

  try {
    // Nerub-ar Palace (Zone 44) 전체 랭킹
    const rankings = await networkIntercept.fetchRankings(44);

    if (rankings && rankings.length > 0) {
      console.log(`\n✅ ${rankings.length}개 랭킹 데이터 수집 성공!\n`);

      console.log('🏆 상위 20명:');
      console.log('═'.repeat(80));

      rankings.slice(0, 20).forEach(player => {
        const dpsFormatted = player.dps ? player.dps.toLocaleString() : 'N/A';
        console.log(`  ${String(player.rank).padStart(3)}위 | ${player.name.padEnd(20)} | ${player.guild.padEnd(25)} | DPS: ${dpsFormatted}`);
      });

      console.log('═'.repeat(80));

      // 데이터를 파일로 저장
      const fs = require('fs');
      const outputPath = './captured-rankings.json';
      fs.writeFileSync(outputPath, JSON.stringify(rankings, null, 2));
      console.log(`\n💾 전체 데이터가 ${outputPath}에 저장되었습니다.`);
    } else {
      console.log('⚠️ 랭킹 데이터를 가져오지 못했습니다');
    }

  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  } finally {
    console.log('\n브라우저를 닫으려면 Enter를 누르세요...');

    // 사용자 입력 대기
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('', async () => {
      await networkIntercept.close();
      console.log('✅ 테스트 완료');
      rl.close();
      process.exit(0);
    });
  }
}

testNetworkIntercept();