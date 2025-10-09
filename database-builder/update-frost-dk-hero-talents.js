/**
 * update-frost-dk-hero-talents.js
 *
 * FrostDeathKnightGuide.js의 영웅 특성명 일괄 교체
 * sunfury → mountainthane (산왕)
 * spellslinger → rideroftheapocalypse (종말의 기수)
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'FrostDeathKnightGuide.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔄 영웅 특성명 교체 시작...\n');

// 1. sunfury → mountainthane
const sunfuryCount = (content.match(/sunfury/g) || []).length;
content = content.replace(/sunfury/g, 'mountainthane');
console.log(`✅ sunfury → mountainthane: ${sunfuryCount}개 교체`);

// 2. spellslinger → rideroftheapocalypse
const spellslingerCount = (content.match(/spellslinger/g) || []).length;
content = content.replace(/spellslinger/g, 'rideroftheapocalypse');
console.log(`✅ spellslinger → rideroftheapocalypse: ${spellslingerCount}개 교체`);

// 3. 한글명 교체
content = content.replace(/성난태양/g, '산왕');
console.log(`✅ 성난태양 → 산왕`);

content = content.replace(/주문술사/g, '종말의 기수');
console.log(`✅ 주문술사 → 종말의 기수`);

// 4. 영문명 주석 교체
content = content.replace(/Sunfury/g, 'Mountain Thane');
console.log(`✅ Sunfury → Mountain Thane`);

content = content.replace(/Spellslinger/g, 'Rider of the Apocalypse');
console.log(`✅ Spellslinger → Rider of the Apocalypse`);

// 파일 저장
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n📄 파일 업데이트 완료: ${filePath}`);
console.log('✅ 모든 영웅 특성명이 교체되었습니다.');
