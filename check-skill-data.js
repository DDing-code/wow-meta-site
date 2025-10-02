const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/wowhead-full-descriptions-complete.json', 'utf8'));

let countNoDetails = 0;
let countWithDetails = 0;
const missingDetails = [];

for(const [id, skill] of Object.entries(data)) {
  // 상세 정보가 있는지 확인
  const hasDetails = skill.effect || skill.damageEffect || skill.healingEffect ||
                     (skill.cooldown && skill.cooldown !== '없음') ||
                     (skill.resource && skill.resource.trim() !== '') ||
                     skill.buff || skill.debuff || skill.generates ||
                     skill.duration || skill.range || skill.castTime;

  if(hasDetails) {
    countWithDetails++;
  } else {
    countNoDetails++;
    if(missingDetails.length < 20) {
      missingDetails.push({
        id: id,
        name: skill.krName || skill.name,
        className: skill.className
      });
    }
  }
}

console.log('=== 스킬 데이터 분석 결과 ===');
console.log('상세 정보가 있는 스킬:', countWithDetails);
console.log('상세 정보가 없는 스킬:', countNoDetails);
console.log('총 스킬 수:', Object.keys(data).length);
console.log('\n상세 정보가 없는 스킬 예시:');
missingDetails.forEach(skill => {
  console.log(`  ${skill.id}: ${skill.name} (${skill.className || 'Unknown'})`);
});

// 천상의 공명 확인
const ultimateRetribution = data['355455'];
if(ultimateRetribution) {
  console.log('\n=== 천상의 공명 (355455) 정보 ===');
  console.log('현재 이름:', ultimateRetribution.krName);
  console.log('영문 이름:', ultimateRetribution.name);
  console.log('설명:', ultimateRetribution.description);
}