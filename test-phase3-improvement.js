import { extractWowheadSkillsBatch } from './src/utils/wowheadAxiosExtractor.js';

console.log('============================================================');
console.log('  Phase 3 개선 효과 측정 - 내부 DB 우선 사용');
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
console.log('  추출 결과 상세 (Phase 3: 내부 DB 우선)');
console.log('============================================================\n');

let internalDBCount = 0;
let wowheadCount = 0;
let totalFields = 0;
let extractedFields = 0;

Object.entries(results).forEach(([id, skill]) => {
  const source = skill._raw?.source || 'Wowhead';
  const reliability = skill._raw?.reliability || 0.85;

  console.log(`[${id}] ${skill.koreanName} (${skill.englishName})`);
  console.log(`  📊 출처: ${source} (신뢰도: ${(reliability * 100).toFixed(0)}%)`);
  console.log(`  cooldown: ${skill.cooldown}`);
  console.log(`  castTime: ${skill.castTime}`);
  console.log(`  range: ${skill.range}`);
  console.log(`  resourceCost: ${skill.resourceCost}`);
  console.log(`  resourceGain: ${skill.resourceGain}`);
  console.log(`  school: ${skill.school}`);
  console.log(`  mechanic: ${skill.mechanic}`);
  console.log(`  dispelType: ${skill.dispelType}`);
  console.log(`  gcd: ${skill.gcd}`);

  // 출처 카운트
  if (source.includes('Internal DB')) {
    internalDBCount++;
  } else {
    wowheadCount++;
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
console.log('  Phase 3 개선 효과 통계');
console.log('============================================================\n');
console.log(`전체 스킬: ${testIds.length}개`);
console.log(`내부 DB 사용: ${internalDBCount}/${testIds.length} (${(internalDBCount/testIds.length*100).toFixed(1)}%)`);
console.log(`Wowhead 크롤링: ${wowheadCount}/${testIds.length} (${(wowheadCount/testIds.length*100).toFixed(1)}%)`);
console.log(`전체 필드 추출: ${extractedFields}/${totalFields}`);
console.log(`필드 추출률: ${(extractedFields/totalFields*100).toFixed(1)}%`);

console.log('\n--- Phase 2 대비 개선 ---');
const phase2Rate = 39.5;
const phase3Rate = (extractedFields/totalFields*100);

console.log(`Phase 2 추출률: ${phase2Rate}%`);
console.log(`Phase 3 추출률: ${phase3Rate.toFixed(1)}%`);
console.log(`개선율: ${(phase3Rate - phase2Rate).toFixed(1)}%p`);

console.log('\n--- 신뢰도 통계 ---');
console.log(`Tier S (내부 DB, 99%): ${internalDBCount}/${testIds.length} (${(internalDBCount/testIds.length*100).toFixed(1)}%)`);
console.log(`Tier B (Wowhead, 85%): ${wowheadCount}/${testIds.length} (${(wowheadCount/testIds.length*100).toFixed(1)}%)`);
console.log(`평균 신뢰도: ${((internalDBCount * 0.99 + wowheadCount * 0.85) / testIds.length * 100).toFixed(1)}%`);

if (phase3Rate >= 70) {
  console.log('\n✅ Phase 3 목표 달성! (70% 이상)');
} else {
  console.log(`\n⚠️  Phase 3 목표 미달 (목표: 70%, 현재: ${phase3Rate.toFixed(1)}%)`);
  console.log('   → Phase 4 (수동 override) 진행 필요');
}
