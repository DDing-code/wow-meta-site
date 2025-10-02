const fs = require('fs');
const path = require('path');

// 데이터 읽기
const dataPath = path.join(__dirname, '..', 'src', 'data', 'wowhead-full-descriptions-complete.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 통계
let krCount = 0;
let enCount = 0;
let bothCount = 0;
let realDescCount = 0;
let genericDescCount = 0;

for (let id in data) {
  const skill = data[id];

  // 이름 체크
  const hasKr = skill.krName && skill.krName !== '';
  const hasEn = skill.name && skill.name !== '';
  if (hasKr) krCount++;
  if (hasEn) enCount++;
  if (hasKr && hasEn) bothCount++;

  // 설명 체크
  if (skill.description) {
    // 일반적인 설명 패턴 체크
    if (skill.description.includes('클래스의 스킬입니다') ||
        skill.description.includes('특수한 효과를 제공합니다') ||
        skill.description.includes('스킬입니다.')) {
      genericDescCount++;
    } else {
      realDescCount++;
    }
  }
}

console.log('===== 데이터베이스 현황 =====');
console.log('총 스킬 수:', Object.keys(data).length);
console.log('');
console.log('===== 이름 현황 =====');
console.log('한글 이름 있음:', krCount);
console.log('영어 이름 있음:', enCount);
console.log('둘 다 있음:', bothCount);
console.log('');
console.log('===== 설명 현황 =====');
console.log('실제 설명:', realDescCount);
console.log('일반 설명:', genericDescCount);
console.log('');
console.log('===== 샘플 10개 =====');
let count = 0;
for (let id in data) {
  if (count >= 10) break;
  const skill = data[id];
  console.log(`${id}: [${skill.krName || '한글명 없음'}] ${skill.description ? skill.description.substring(0, 50) + '...' : '설명 없음'}`);
  count++;
}