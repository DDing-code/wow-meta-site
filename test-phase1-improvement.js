import { extractWowheadSkillsBatch } from './src/utils/wowheadAxiosExtractor.js';

console.log('============================================================');
console.log('  Phase 1 개선 효과 측정 - 9개 스킬 전체 테스트');
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
console.log('  추출 결과 상세');
console.log('============================================================\n');

let htmlCommentSuccessCount = 0;
let totalFields = 0;
let extractedFields = 0;

Object.entries(results).forEach(([id, skill]) => {
  console.log(`[${id}] ${skill.koreanName} (${skill.englishName})`);
  console.log(`  cooldown: ${skill.cooldown}`);
  console.log(`  castTime: ${skill.castTime}`);
  console.log(`  range: ${skill.range}`);
  console.log(`  resourceCost: ${skill.resourceCost}`);
  console.log(`  resourceGain: ${skill.resourceGain}`);
  console.log(`  school: ${skill.school}`);
  console.log(`  mechanic: ${skill.mechanic}`);

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

  // 필드 추출 성공률 계산
  totalFields += 7;  // cooldown, castTime, range, resourceCost, resourceGain, school, mechanic
  if (skill.cooldown !== '없음') extractedFields++;
  if (skill.castTime !== '즉시') extractedFields++;
  if (skill.range !== '근접') extractedFields++;
  if (skill.resourceCost !== '없음') extractedFields++;
  if (skill.resourceGain !== '없음') extractedFields++;
  if (skill.school !== 'Unknown') extractedFields++;
  if (skill.mechanic !== 'n/a') extractedFields++;

  console.log('');
});

console.log('============================================================');
console.log('  개선 효과 통계');
console.log('============================================================\n');
console.log(`전체 스킬: ${testIds.length}개`);
console.log(`HTML 주석 추출 성공: ${htmlCommentSuccessCount}/${testIds.length} (${(htmlCommentSuccessCount/testIds.length*100).toFixed(1)}%)`);
console.log(`전체 필드 추출: ${extractedFields}/${totalFields}`);
console.log(`필드 추출률: ${(extractedFields/totalFields*100).toFixed(1)}%`);

console.log('\n개선 전 추정치 (summary 기준):');
console.log('  필드 추출률: 39% (9/23 필드)');
console.log('\n개선 효과:');
const improvement = (extractedFields/totalFields*100) - 39;
console.log(`  +${improvement.toFixed(1)}%p 개선`);
