/**
 * replace-hero-names.js
 *
 * 목적: ElementalShamanGuide.js에서 sunfury → farseer, spellslinger → stormbringer 교체
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'ElementalShamanGuide.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔄 영웅 특성명 교체 시작...\n');

// 1. sunfury → farseer 교체
const sunfuryCount = (content.match(/sunfury/g) || []).length;
content = content.replace(/sunfury/g, 'farseer');
console.log(`✅ 'sunfury' → 'farseer' (${sunfuryCount}개 교체)`);

// 2. spellslinger → stormbringer 교체
const spellslingerCount = (content.match(/spellslinger/g) || []).length;
content = content.replace(/spellslinger/g, 'stormbringer');
console.log(`✅ 'spellslinger' → 'stormbringer' (${spellslingerCount}개 교체)`);

// 3. 아이콘 및 텍스트 교체
content = content.replace(/🔥 성난태양/g, '🔮 선견자');
console.log(`✅ '🔥 성난태양' → '🔮 선견자'`);

content = content.replace(/✨ 주문술사/g, '⚡ 폭풍인도자');
console.log(`✅ '✨ 주문술사' → '⚡ 폭풍인도자'`);

// 4. 색상 코드 교체 (마법사 #3FC6EA, #8B6B47 → 주술사 #0070DE, #005ba0)
content = content.replace(/#3FC6EA/g, '#0070DE');
content = content.replace(/#8B6B47/g, '#0070DE');
content = content.replace(/#5a4a2a/g, '#005ba0');
content = content.replace(/#2a7a8a/g, '#0070DE');
content = content.replace(/#1a4a5a/g, '#005ba0');
content = content.replace(/#4ECDC4/g, '#0070DE');
console.log(`✅ 색상 코드 교체 완료 (주술사 #0070DE 테마)`);

// 파일 저장
fs.writeFileSync(filePath, content, 'utf8');

console.log('\n✅ 모든 영웅 특성명 교체 완료!');
console.log(`💾 파일 저장: ${filePath}\n`);
