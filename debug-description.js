import { extractWowheadSkillAxios } from './src/utils/wowheadAxiosExtractor.js';

console.log('============================================================');
console.log('  Description 디버깅 - 왜 파싱이 안 되는가?');
console.log('============================================================\n');

const testIds = [853, 642, 184575];  // 심판의 망치, 천상의 보호막, 심판의 칼날

for (const id of testIds) {
  const skill = await extractWowheadSkillAxios(id);

  if (skill) {
    console.log(`\n[${id}] ${skill.koreanName}`);
    console.log('─'.repeat(60));
    console.log('한글 description:');
    console.log(skill.description);
    console.log('─'.repeat(60));
    console.log('원본 description_enus:');
    console.log(skill._raw.wowheadJson.description_enus);
    console.log('─'.repeat(60));

    // 추출된 값들
    console.log('추출 결과:');
    console.log(`  cooldown: ${skill.cooldown}`);
    console.log(`  castTime: ${skill.castTime}`);
    console.log(`  range: ${skill.range}`);
    console.log(`  resourceCost: ${skill.resourceCost}`);
    console.log(`  resourceGain: ${skill.resourceGain}`);
    console.log('');
  }

  await new Promise(resolve => setTimeout(resolve, 2000));
}
