/**
 * 영웅 특성 한글명 일괄 교체 스크립트
 * 성난태양 → 죽음인도자
 * 주문술사 → 종말의 기수
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/FrostDeathKnightGuide.js');

console.log('영웅 특성 한글명 일괄 교체 시작...');

// 파일 읽기
let content = fs.readFileSync(filePath, 'utf-8');

// 교체 전 개수 확인
const sunfuryKoCount = (content.match(/성난태양/g) || []).length;
const spellslingerKoCount = (content.match(/주문술사/g) || []).length;

console.log(`\n교체 전:`);
console.log(`- 성난태양: ${sunfuryKoCount}개`);
console.log(`- 주문술사: ${spellslingerKoCount}개`);

// 일괄 교체
content = content.replace(/성난태양/g, '죽음인도자');
content = content.replace(/주문술사/g, '종말의 기수');

// 교체 후 개수 확인
const deathbringerKoCount = (content.match(/죽음인도자/g) || []).length;
const riderKoCount = (content.match(/종말의 기수/g) || []).length;

console.log(`\n교체 후:`);
console.log(`- 죽음인도자: ${deathbringerKoCount}개`);
console.log(`- 종말의 기수: ${riderKoCount}개`);

// 파일 저장
fs.writeFileSync(filePath, content, 'utf-8');

console.log(`\n✅ 교체 완료!`);
console.log(`파일: ${filePath}`);
