/**
 * 잘못된 아이콘 매핑 제거 및 정리
 */

const fs = require('fs');
const path = require('path');

// wowhead-all-icons.json 읽기
const iconsPath = path.join(__dirname, 'wowhead-all-icons.json');
const icons = JSON.parse(fs.readFileSync(iconsPath, 'utf8'));

// "주문들" (ability_bossfelmagnaron_runeempowered) 항목 제거
const cleanedIcons = {};
let removedCount = 0;

for (const [skillId, iconName] of Object.entries(icons)) {
  // 잘못된 아이콘 필터링
  if (iconName === 'ability_bossfelmagnaron_runeempowered') {
    removedCount++;
    console.log(`❌ 제거: ${skillId} - "주문들"`);
  } else {
    cleanedIcons[skillId] = iconName;
  }
}

// 정리된 데이터 저장
fs.writeFileSync(iconsPath, JSON.stringify(cleanedIcons, null, 2), 'utf8');

console.log(`\n✅ 정리 완료`);
console.log(`📊 총 ${Object.keys(cleanedIcons).length}개 아이콘 유지`);
console.log(`🗑️ ${removedCount}개 "주문들" 항목 제거`);

// JavaScript 파일로 변환
const jsContent = `// Wowhead에서 가져온 실제 아이콘 매핑 (정리됨)
// 생성일: ${new Date().toLocaleDateString('ko-KR')}
// 총 ${Object.keys(cleanedIcons).length}개의 매핑

export const wowheadIconMapping = ${JSON.stringify(cleanedIcons, null, 2)};`;

// 파일 저장
const outputPath = path.join(__dirname, '..', 'src', 'data', 'wowheadIconMapping.js');
fs.writeFileSync(outputPath, jsContent, 'utf8');

console.log(`📝 저장 위치: ${outputPath}`);