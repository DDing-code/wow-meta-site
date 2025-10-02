// AI 학습 시스템 테스트 - 실제 플레이어 로그 사용

async function testAITraining() {
  console.log('🚀 AI 학습 시스템 테스트 시작...\n');
  console.log('📌 실제 WarcraftLogs 랭킹 플레이어 데이터를 사용합니다.\n');

  try {
    // 학습 데이터 가져오기 테스트
    const response = await fetch('http://localhost:5003/api/learning/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        class: 'warrior',
        spec: 'fury',
        limit: 10
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ 학습 데이터 가져오기 실패:', error);
      return;
    }

    const data = await response.json();

    console.log('\n' + '='.repeat(80));
    console.log('📊 학습 데이터 수집 결과');
    console.log('='.repeat(80));

    console.log(`\n✅ 성공: ${data.success}`);
    console.log(`📑 데이터 소스: ${data.dataSource}`);
    console.log(`📊 수집된 로그 수: ${data.count}`);
    console.log(`⚔️ 클래스: ${data.className} ${data.specName}`);

    if (data.message) {
      console.log(`💬 메시지: ${data.message}`);
    }

    // 샘플 데이터 출력
    if (data.logs && data.logs.length > 0) {
      console.log('\n🔍 수집된 데이터 샘플 (상위 3개):');
      console.log('-'.repeat(80));

      data.logs.slice(0, 3).forEach((log, index) => {
        console.log(`\n[${index + 1}] 플레이어: ${log.playerName}`);
        console.log(`    길드: ${log.guildName}`);
        console.log(`    DPS: ${log.dps?.toLocaleString() || 'N/A'}`);
        console.log(`    퍼센타일: ${log.percentile}%`);

        if (log.bossName) {
          console.log(`    보스: ${log.bossName}`);
        }

        if (log.fightDuration) {
          console.log(`    전투 시간: ${log.fightDuration}`);
        }

        if (log.topSkills && log.topSkills.length > 0) {
          console.log(`    주요 스킬:`);
          log.topSkills.slice(0, 3).forEach(skill => {
            console.log(`      - ${skill.name}: ${skill.damage} (${skill.count}회)`);
          });
        }

        if (log.reportUrl) {
          console.log(`    로그 URL: ${log.reportUrl}`);
        }
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ AI 학습 데이터 수집 성공!');
    console.log('💡 이제 실제 상위 플레이어의 전투 로그를 기반으로 AI가 학습할 수 있습니다.');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
  }
}

// Fetch polyfill for Node.js
const fetch = require('node-fetch');

// 테스트 실행
testAITraining();