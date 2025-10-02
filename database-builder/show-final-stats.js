const fs = require('fs');

// 강화된 데이터베이스 사용
const data = JSON.parse(fs.readFileSync('./tww-s3-complete-database-enhanced.json', 'utf8'));

console.log('================================');
console.log('✨ TWW 시즌3 강화된 데이터베이스 통계');
console.log('================================\n');

let total = 0;
let enhancedTotal = 0;

for (const [className, skills] of Object.entries(data)) {
  const count = Object.keys(skills).length;
  total += count;

  // 추가 데이터가 있는 스킬 수 계산
  let enhancedCount = 0;
  for (const skill of Object.values(skills)) {
    if (skill.effect || skill.maxTargets || skill.radius || skill.proc || skill.stacks || skill.charges) {
      enhancedCount++;
      enhancedTotal++;
    }
  }

  console.log(`${className}: ${count}개 (강화: ${enhancedCount}개)`);
}

console.log('\n================================');
console.log(`📊 전체 스킬 수: ${total}개`);
console.log(`✨ 강화된 스킬: ${enhancedTotal}개`);
console.log('================================');