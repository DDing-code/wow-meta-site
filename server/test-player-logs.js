const playerLogs = require('./warcraftlogs-player-logs');

async function testPlayerLogs() {
  console.log('🚀 WarcraftLogs 플레이어 로그 수집 테스트 시작...\n');
  console.log('📌 브라우저가 열립니다. 데이터 수집까지 시간이 걸릴 수 있습니다...\n');

  try {
    // 상위 3명의 플레이어 로그 수집 (11.2 패치 Manaforge Omega Zone ID: 44)
    const completeData = await playerLogs.fetchCompleteData(44, 3);

    if (completeData.length > 0) {
      console.log('\n' + '='.repeat(80));
      console.log('📊 수집된 데이터 요약');
      console.log('='.repeat(80));

      completeData.forEach(data => {
        console.log(`\n👤 플레이어: ${data.player.name}`);
        console.log(`   서버: ${data.player.server}`);
        console.log(`   길드: ${data.player.guild}`);
        console.log(`   랭킹: ${data.player.rank}위`);
        console.log(`   DPS: ${data.player.dps?.toLocaleString() || 'N/A'}`);

        if (data.logs && data.logs.length > 0) {
          console.log(`\n   📝 최근 로그 (${data.logs.length}개):`);
          data.logs.slice(0, 3).forEach(log => {
            console.log(`      - ${log.boss || 'Unknown Boss'}`);
            if (log.dps) console.log(`        DPS: ${log.dps.toLocaleString()}`);
            if (log.percentile) console.log(`        Percentile: ${log.percentile}`);
            if (log.date) console.log(`        Date: ${log.date}`);
          });
        }

        if (data.latestFightAnalysis) {
          console.log(`\n   ⚔️ 최근 전투 분석:`);
          console.log(`      Duration: ${data.latestFightAnalysis.duration || 'N/A'}`);
          console.log(`      Total Damage: ${data.latestFightAnalysis.totalDamage?.toLocaleString() || 'N/A'}`);

          if (data.latestFightAnalysis.skills && data.latestFightAnalysis.skills.length > 0) {
            console.log(`      Top Skills:`);
            data.latestFightAnalysis.skills.slice(0, 3).forEach(skill => {
              console.log(`        - ${skill.name}: ${skill.damage} (${skill.count}회)`);
            });
          }
        }
      });

      // 데이터를 파일로 저장
      const fs = require('fs');
      const outputPath = './player-logs-data.json';
      fs.writeFileSync(outputPath, JSON.stringify(completeData, null, 2));
      console.log(`\n💾 전체 데이터가 ${outputPath}에 저장되었습니다.`);

    } else {
      console.log('⚠️ 데이터를 수집하지 못했습니다');
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
      await playerLogs.close();
      console.log('✅ 테스트 완료');
      rl.close();
      process.exit(0);
    });
  }
}

testPlayerLogs();