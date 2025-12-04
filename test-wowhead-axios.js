/**
 * Wowhead Axios 추출기 테스트 스크립트
 *
 * 사용법:
 * node wow-meta-site/test-wowhead-axios.js
 */

import {
  extractWowheadSkillAxios,
  extractWowheadSkillsBatch,
  benchmarkPerformance
} from './src/utils/wowheadAxiosExtractor.js';

async function testSingleSkill() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('테스트 1: 단일 스킬 추출');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 비전 작렬 (Arcane Blast) - 스킬 ID: 5143
  const skill = await extractWowheadSkillAxios(5143);

  if (skill) {
    console.log('\n📝 추출된 스킬 데이터:');
    console.log(JSON.stringify(skill, null, 2));
  } else {
    console.error('\n❌ 스킬 추출 실패');
  }
}

async function testBatchSkills() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('테스트 2: 배치 스킬 추출 (3개)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 마법사 스킬 3개
  const spellIds = [
    5143,  // 비전 작렬 (Arcane Blast)
    79684, // 비전 탄막 (Arcane Barrage)
    30451  // 비전 폭발 (Arcane Blast - 다른 버전?)
  ];

  const skills = await extractWowheadSkillsBatch(spellIds, 1500); // 1.5초 지연

  console.log('\n📊 배치 추출 결과 요약:');
  Object.entries(skills).forEach(([id, data]) => {
    console.log(`   ${id}: ${data.koreanName} (${data.englishName})`);
  });
}

async function testPerformanceBenchmark() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('테스트 3: 성능 벤치마크');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await benchmarkPerformance([5143, 79684, 30451]);
}

async function runAllTests() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Wowhead Axios 추출기 테스트 스위트                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    // 테스트 1: 단일 스킬
    await testSingleSkill();

    // 테스트 2: 배치 스킬
    await testBatchSkills();

    // 테스트 3: 성능 벤치마크
    await testPerformanceBenchmark();

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ 모든 테스트 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ 테스트 실패:', error);
    process.exit(1);
  }
}

// CLI에서 직접 실행 시
if (import.meta.url === `file:///${process.cwd().replace(/\\/g, '/')}/wow-meta-site/test-wowhead-axios.js`) {
  runAllTests();
}

export { testSingleSkill, testBatchSkills, testPerformanceBenchmark, runAllTests };
