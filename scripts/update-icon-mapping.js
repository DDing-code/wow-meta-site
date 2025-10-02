/**
 * wowhead-all-icons.json 파일을 읽어서 wowheadIconMapping.js 업데이트
 */

const fs = require('fs');
const path = require('path');

// wowhead-all-icons.json 읽기
const iconsPath = path.join(__dirname, 'wowhead-all-icons.json');
const icons = JSON.parse(fs.readFileSync(iconsPath, 'utf8'));

// JavaScript 파일로 변환
const jsContent = `// Wowhead에서 가져온 실제 아이콘 매핑
// 생성일: ${new Date().toLocaleDateString('ko-KR')}
// 총 ${Object.keys(icons).length}개의 매핑

export const wowheadIconMapping = ${JSON.stringify(icons, null, 2)};`;

// 파일 저장
const outputPath = path.join(__dirname, '..', 'src', 'data', 'wowheadIconMapping.js');
fs.writeFileSync(outputPath, jsContent, 'utf8');

console.log(`✅ ${Object.keys(icons).length}개의 아이콘 매핑 업데이트 완료`);
console.log(`📝 저장 위치: ${outputPath}`);