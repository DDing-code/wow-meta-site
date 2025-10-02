const fs = require('fs');
const path = require('path');

// 포괄적인 문법 오류 수정
const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
let content = fs.readFileSync(dbPath, 'utf8');

// 중복된 속성들 제거 (문법 오류 원인)
content = content.replace(/,\s*"castTime":[^,}]+,\s*"description":[^,}]+,\s*"iconName":[^,}]+,\s*"englishDescription":[^,}]+,\s*"category":[^,}]+,\s*"type":[^,}]+(?=\s*},)/g, '');

// 중복 쉼표 제거
content = content.replace(/,\s*,+/g, ',');

// 객체 사이 쉼표 확인
content = content.replace(/}\s*"/g, '},\n  "');

// 마지막 쉼표 제거
content = content.replace(/,\s*}/g, '\n  }');

// 중괄호 균형 확인
const openBraces = (content.match(/{/g) || []).length;
const closeBraces = (content.match(/}/g) || []).length;

console.log(`중괄호 확인: { ${openBraces} vs } ${closeBraces}`);

if (openBraces !== closeBraces) {
  console.log('⚠️ 중괄호 불균형 감지. 수정 필요.');
}

// 파일 저장
fs.writeFileSync(dbPath, content, 'utf8');

console.log('✅ 문법 오류 수정 완료');

// 검증
try {
  delete require.cache[require.resolve(dbPath)];
  const db = require(dbPath);
  console.log(`✅ 문법 검증 성공! 총 ${Object.keys(db.koreanSpellDatabase).length}개 스킬`);
} catch (e) {
  console.log('❌ 여전히 오류 있음:', e.message);
  console.log('위치:', e.stack.split('\n')[0]);
}