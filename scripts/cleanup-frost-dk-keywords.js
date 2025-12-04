/**
 * 냉기 죽음의 기사 가이드 - 남은 템플릿 키워드 정리
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/FrostDeathKnightGuide.js');

console.log('냉기 죽음의 기사 가이드 키워드 정리 시작...\n');

let content = fs.readFileSync(filePath, 'utf-8');

// 교체 전 개수 확인
const beforeCounts = {
  todo: (content.match(/⚠️ TODO:/g) || []).length,
  resource: (content.match(/리소스/g) || []).length,
  arcaneMage: (content.match(/비전 마법사/g) || []).length,
  sunfury: (content.match(/Sunfury/g) || []).length,
  spellslinger: (content.match(/Spellslinger/g) || []).length
};

console.log('교체 전:');
console.log(`- TODO 주석: ${beforeCounts.todo}개`);
console.log(`- 리소스: ${beforeCounts.resource}개`);
console.log(`- 비전 마법사: ${beforeCounts.arcaneMage}개`);
console.log(`- Sunfury: ${beforeCounts.sunfury}개`);
console.log(`- Spellslinger: ${beforeCounts.spellslinger}개`);

// 1. TODO 주석 제거
content = content.replace(/\/\/ ⚠️ TODO: 실제 가이드 제작 시 이 함수를 수정하세요\n/g, '');
content = content.replace(/\{\/\* ⚠️ TODO: setSelectedTier 값을 실제 영웅특성명으로 변경 \*\/\}/g, '');
content = content.replace(/\{\/\* ⚠️ TODO: selectedTier 조건을 실제 영웅특성명으로 변경 \*\/\}/g, '');

// 2. "리소스" → "룬 & 룬 마력"
content = content.replace(/리소스 및 티어 세트/g, '룬 & 룬 마력 및 티어 세트');
content = content.replace(/리소스 시스템/g, '룬 & 룬 마력 시스템');

// 3. "비전 마법사" → "냉기 죽음의 기사" (단순 치환)
content = content.replace(/비전 마법사/g, '냉기 죽음의 기사');

// 4. 주석의 Sunfury/Spellslinger 제거 (단순 치환)
content = content.replace(/Sunfury/g, '죽음인도자');
content = content.replace(/Spellslinger/g, '종말의 기수');

// 교체 후 개수 확인
const afterCounts = {
  todo: (content.match(/⚠️ TODO:/g) || []).length,
  resource: (content.match(/리소스/g) || []).length,
  arcaneMage: (content.match(/비전 마법사/g) || []).length,
  sunfury: (content.match(/Sunfury/g) || []).length,
  spellslinger: (content.match(/Spellslinger/g) || []).length
};

console.log('\n교체 후:');
console.log(`- TODO 주석: ${afterCounts.todo}개`);
console.log(`- 리소스: ${afterCounts.resource}개`);
console.log(`- 비전 마법사: ${afterCounts.arcaneMage}개`);
console.log(`- Sunfury: ${afterCounts.sunfury}개`);
console.log(`- Spellslinger: ${afterCounts.spellslinger}개`);

// 파일 저장
fs.writeFileSync(filePath, content, 'utf-8');

console.log('\n✅ 템플릿 키워드 정리 완료!');
console.log(`파일: ${filePath}`);
