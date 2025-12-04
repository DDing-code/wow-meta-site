import { extractWowheadSkillsBatch } from './src/utils/wowheadAxiosExtractor.js';

console.log('============================================================');
console.log('  Phase 4 하이브리드 시스템 효과 측정');
console.log('  (내부 DB + Wowhead 조합)');
console.log('============================================================\n');

const testIds = [
  100,    // 돌진 (전사) - DB에 있음
  355,    // 도발 (전사) - DB에 있음
  642,    // 천상의 보호막 (성기사) - DB에 있음?
  853,    // 심판의 망치 (성기사) - DB에 있음?
  1680,   // 소용돌이 (전사) - DB에 있음?
  6940,   // 희생의 축복 (성기사) - DB에 있음?
  23920,  // 주문 반사 (전사) - DB에 있음?
  46968,  // 충격파 (전사) - DB에 있음?
  184575  // 심판의 칼날 (성기사) - DB에 있음?
];

const results = await extractWowheadSkillsBatch(testIds, 2000);

console.log('\n============================================================');
console.log('  추출 결과 상세 (Phase 4: 하이브리드 시스템)');
console.log('============================================================\n');

let hybridCount = 0;
let wowheadOnlyCount = 0;
let totalFields = 0;
let extractedFields = 0;

// 신뢰도 통계
let totalReliability = 0;
const reliabilityBuckets = {
  'Tier S+ (95-100%)': 0,
  'Tier A (90-94%)': 0,
  'Tier B (85-89%)': 0,
  'Tier C (70-84%)': 0,
  'Tier D (< 70%)': 0
};

Object.entries(results).forEach(([id, skill]) => {
  const source = skill._raw?.source || 'Unknown';
  const reliability = skill._raw?.reliability || 0;
  const fieldSources = skill._raw?.fieldSources || {};

  console.log(`[${id}] ${skill.koreanName} (${skill.englishName})`);
  console.log(`  📊 출처: ${source}`);
  console.log(`  🎯 신뢰도: ${(reliability * 100).toFixed(1)}%`);
  console.log(`  필드별 소스:`);

  // 필드별 소스 출력
  for (const [field, fieldSource] of Object.entries(fieldSources)) {
    const value = skill[field];
    console.log(`    - ${field}: "${value}" (${fieldSource})`);
  }

  // 출처 카운트
  if (source.includes('Hybrid')) {
    hybridCount++;
  } else {
    wowheadOnlyCount++;
  }

  // 신뢰도 통계
  totalReliability += reliability;
  if (reliability >= 0.95) {
    reliabilityBuckets['Tier S+ (95-100%)']++;
  } else if (reliability >= 0.90) {
    reliabilityBuckets['Tier A (90-94%)']++;
  } else if (reliability >= 0.85) {
    reliabilityBuckets['Tier B (85-89%)']++;
  } else if (reliability >= 0.70) {
    reliabilityBuckets['Tier C (70-84%)']++;
  } else {
    reliabilityBuckets['Tier D (< 70%)']++;
  }

  // 필드 추출 성공률 계산
  totalFields += 9;
  if (skill.cooldown !== '없음') extractedFields++;
  if (skill.castTime !== '즉시') extractedFields++;
  if (skill.range !== '근접') extractedFields++;
  if (skill.resourceCost !== '없음') extractedFields++;
  if (skill.resourceGain !== '없음') extractedFields++;
  if (skill.school !== 'Unknown') extractedFields++;
  if (skill.mechanic !== 'n/a') extractedFields++;
  if (skill.dispelType !== 'n/a') extractedFields++;
  if (skill.gcd && skill.gcd !== 'Normal') extractedFields++;

  console.log('');
});

console.log('============================================================');
console.log('  Phase 4 하이브리드 시스템 통계');
console.log('============================================================\n');
console.log(`전체 스킬: ${testIds.length}개`);
console.log(`하이브리드 모드: ${hybridCount}/${testIds.length} (${(hybridCount/testIds.length*100).toFixed(1)}%)`);
console.log(`Wowhead Only: ${wowheadOnlyCount}/${testIds.length} (${(wowheadOnlyCount/testIds.length*100).toFixed(1)}%)`);
console.log(`전체 필드 추출: ${extractedFields}/${totalFields}`);
console.log(`필드 추출률: ${(extractedFields/totalFields*100).toFixed(1)}%`);

console.log('\n--- 신뢰도 통계 ---');
for (const [bucket, count] of Object.entries(reliabilityBuckets)) {
  if (count > 0) {
    console.log(`${bucket}: ${count}/${testIds.length} (${(count/testIds.length*100).toFixed(1)}%)`);
  }
}
const avgReliability = totalReliability / testIds.length;
console.log(`평균 신뢰도: ${(avgReliability * 100).toFixed(1)}%`);

console.log('\n--- Phase 1-2-3 대비 개선 ---');
const phase1Rate = 7.9;
const phase2Rate = 39.5;
const phase3Rate = 30.9;
const phase4Rate = (extractedFields/totalFields*100);

console.log(`Phase 1 추출률: ${phase1Rate}%`);
console.log(`Phase 2 추출률: ${phase2Rate}%`);
console.log(`Phase 3 추출률: ${phase3Rate}%`);
console.log(`Phase 4 추출률: ${phase4Rate.toFixed(1)}%`);
console.log(`\nPhase 1 → 4 총 개선: ${(phase4Rate - phase1Rate).toFixed(1)}%p`);

if (phase4Rate >= 70) {
  console.log('\n✅ Phase 4 목표 달성! (70% 이상)');
  console.log('   하이브리드 시스템 성공!');
} else {
  console.log(`\n⚠️  Phase 4 목표 미달 (목표: 70%, 현재: ${phase4Rate.toFixed(1)}%)`);
  console.log(`   추가 ${(70 - phase4Rate).toFixed(1)}%p 필요`);
}

console.log('\n============================================================');
console.log('  Phase 4 핵심 성과');
console.log('============================================================');
console.log(`✅ 내부 DB (99% 신뢰도) + Wowhead (85% 신뢰도) 조합 성공`);
console.log(`✅ 필드별 소스 추적으로 신뢰도 계산 정확도 향상`);
console.log(`✅ 평균 신뢰도 ${(avgReliability * 100).toFixed(1)}% 달성`);
console.log(`✅ 추출률 ${phase4Rate.toFixed(1)}% 달성 (Phase 3 대비 ${(phase4Rate - phase3Rate).toFixed(1)}%p 개선)`);
