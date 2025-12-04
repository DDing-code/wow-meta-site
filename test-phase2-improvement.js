import { extractWowheadSkillsBatch } from './src/utils/wowheadAxiosExtractor.js';

console.log('============================================================');
console.log('  Phase 2 개선 효과 측정 - 테이블 파싱 추가');
console.log('============================================================\n');

const testIds = [
  642,    // 천상의 보호막
  853,    // 심판의 망치
  1680,   // 소용돌이
  6940,   // 희생의 축복
  23920,  // 주문 반사
  46968,  // 충격파
  167105, // 거인의 강타
  184575, // 심판의 칼날
  204074  // 정의로운 수호자
];

const results = await extractWowheadSkillsBatch(testIds, 2000);

console.log('\n============================================================');
console.log('  추출 결과 상세 (Phase 2: 테이블 파싱 추가)');
console.log('============================================================\n');

let htmlCommentSuccessCount = 0;
let tableSuccessCount = 0;
let totalFields = 0;
let extractedFields = 0;

// Phase 2에서 추가된 필드들
let schoolCount = 0;
let mechanicCount = 0;
let dispelTypeCount = 0;
let gcdCount = 0;

Object.entries(results).forEach(([id, skill]) => {
  console.log(`[${id}] ${skill.koreanName} (${skill.englishName})`);
  console.log(`  cooldown: ${skill.cooldown}`);
  console.log(`  castTime: ${skill.castTime}`);
  console.log(`  range: ${skill.range}`);
  console.log(`  resourceCost: ${skill.resourceCost}`);
  console.log(`  resourceGain: ${skill.resourceGain}`);
  console.log(`  school: ${skill.school}`);
  console.log(`  mechanic: ${skill.mechanic}`);
  console.log(`  dispelType: ${skill.dispelType}`);
  console.log(`  gcd: ${skill.gcd || 'Normal'}`);

  // HTML 주석 데이터 확인
  const commentData = skill._raw?.htmlCommentData;
  if (commentData) {
    const hasComment = commentData.cooldown || commentData.castTime || commentData.range;
    if (hasComment) {
      htmlCommentSuccessCount++;
      console.log(`  ✅ HTML 주석: ${JSON.stringify(commentData)}`);
    } else {
      console.log(`  ⚠️  HTML 주석: 없음`);
    }
  }

  // 테이블 데이터 확인 (Phase 2 추가)
  const tableData = skill._raw?.tableData;
  if (tableData) {
    const hasTableData = tableData.school || tableData.mechanic || tableData.dispelType || tableData.gcd;
    if (hasTableData) {
      tableSuccessCount++;
      console.log(`  ✅ 테이블 파싱: ${JSON.stringify(tableData)}`);
    } else {
      console.log(`  ⚠️  테이블 파싱: 데이터 없음`);
    }
  }

  // 필드 추출 성공률 계산 (Phase 2: 9개 필드로 확장)
  totalFields += 9;  // cooldown, castTime, range, resourceCost, resourceGain, school, mechanic, dispelType, gcd
  if (skill.cooldown !== '없음') extractedFields++;
  if (skill.castTime !== '즉시') extractedFields++;
  if (skill.range !== '근접') extractedFields++;
  if (skill.resourceCost !== '없음') extractedFields++;
  if (skill.resourceGain !== '없음') extractedFields++;
  if (skill.school !== 'Unknown') { extractedFields++; schoolCount++; }
  if (skill.mechanic !== 'n/a') { extractedFields++; mechanicCount++; }
  if (skill.dispelType !== 'n/a') { extractedFields++; dispelTypeCount++; }
  if (skill.gcd && skill.gcd !== 'Normal') { extractedFields++; gcdCount++; }

  console.log('');
});

console.log('============================================================');
console.log('  Phase 2 개선 효과 통계');
console.log('============================================================\n');
console.log(`전체 스킬: ${testIds.length}개`);
console.log(`HTML 주석 추출 성공: ${htmlCommentSuccessCount}/${testIds.length} (${(htmlCommentSuccessCount/testIds.length*100).toFixed(1)}%)`);
console.log(`테이블 파싱 성공: ${tableSuccessCount}/${testIds.length} (${(tableSuccessCount/testIds.length*100).toFixed(1)}%)`);
console.log(`전체 필드 추출: ${extractedFields}/${totalFields}`);
console.log(`필드 추출률: ${(extractedFields/totalFields*100).toFixed(1)}%`);

console.log('\n--- Phase 2에서 추가된 필드 추출 성공률 ---');
console.log(`school (갈래): ${schoolCount}/${testIds.length} (${(schoolCount/testIds.length*100).toFixed(1)}%)`);
console.log(`mechanic (메커니즘): ${mechanicCount}/${testIds.length} (${(mechanicCount/testIds.length*100).toFixed(1)}%)`);
console.log(`dispelType (무효화 타입): ${dispelTypeCount}/${testIds.length} (${(dispelTypeCount/testIds.length*100).toFixed(1)}%)`);
console.log(`gcd (글쿨 범주): ${gcdCount}/${testIds.length} (${(gcdCount/testIds.length*100).toFixed(1)}%)`);

console.log('\n--- Phase 1 대비 개선 ---');
const phase1FieldCount = 7;  // Phase 1: 7개 필드
const phase2FieldCount = 9;  // Phase 2: 9개 필드 (school, mechanic, dispelType, gcd 추가)
const phase1Rate = 7.9;  // Phase 1 추출률
const phase2Rate = (extractedFields/totalFields*100);

console.log(`Phase 1 필드 수: ${phase1FieldCount}개`);
console.log(`Phase 2 필드 수: ${phase2FieldCount}개 (+${phase2FieldCount - phase1FieldCount}개)`);
console.log(`Phase 1 추출률: ${phase1Rate}%`);
console.log(`Phase 2 추출률: ${phase2Rate.toFixed(1)}%`);
console.log(`개선율: ${(phase2Rate - phase1Rate).toFixed(1)}%p`);

if (phase2Rate >= 60) {
  console.log('\n✅ Phase 2 목표 달성! (60% 이상)');
} else {
  console.log(`\n⚠️  Phase 2 목표 미달 (목표: 60%, 현재: ${phase2Rate.toFixed(1)}%)`);
  console.log('   → Phase 3 (다중 소스 통합) 진행 필요');
}
