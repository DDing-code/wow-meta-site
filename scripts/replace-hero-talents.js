/**
 * 영웅 특성 키워드 일괄 교체 스크립트
 * sunfury → deathbringer
 * spellslinger → rideroftheapocalypse
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/FrostDeathKnightGuide.js');

console.log('영웅 특성 키워드 일괄 교체 시작...');

// 파일 읽기
let content = fs.readFileSync(filePath, 'utf-8');

// 교체 전 개수 확인
const sunfuryCount = (content.match(/sunfury/g) || []).length;
const spellslingerCount = (content.match(/spellslinger/g) || []).length;

console.log(`\n교체 전:`);
console.log(`- sunfury: ${sunfuryCount}개`);
console.log(`- spellslinger: ${spellslingerCount}개`);

// 일괄 교체
content = content.replace(/sunfury/g, 'deathbringer');
content = content.replace(/spellslinger/g, 'rideroftheapocalypse');

// 교체 후 개수 확인
const deathbringerCount = (content.match(/deathbringer/g) || []).length;
const rideroftheapocalypseCount = (content.match(/rideroftheapocalypse/g) || []).length;

console.log(`\n교체 후:`);
console.log(`- deathbringer: ${deathbringerCount}개`);
console.log(`- rideroftheapocalypse: ${rideroftheapocalypseCount}개`);

// 파일 저장
fs.writeFileSync(filePath, content, 'utf-8');

console.log(`\n✅ 교체 완료!`);
console.log(`파일: ${filePath}`);
