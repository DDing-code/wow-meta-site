const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
let content = fs.readFileSync(dbPath, 'utf8');

// 정규식으로 중복 속성 패턴 제거
// 패턴: },  이후 나타나는 속성들 (id가 아닌 경우)
content = content.replace(/},\s*"castTime"[^}]*"type":\s*"[^"]+"/g, '}');
content = content.replace(/},\s*"description"[^}]*"type":\s*"[^"]+"/g, '}');
content = content.replace(/},\s*"englishDescription"[^}]*"type":\s*"[^"]+"/g, '}');

// 중복 속성 패턴 제거
content = content.replace(/\s+"englishDescription":[^,}]+,\s+"category":[^,}]+,\s+"type":[^,}]+(?=\s*},)/g, '');

// 쉼표 문제 수정
content = content.replace(/,\s*,+/g, ',');
content = content.replace(/}\s*"/g, '},\n  "');
content = content.replace(/,\s*}/g, '\n  }');
content = content.replace(/},\s*,/g, '},');

// 파일 저장
fs.writeFileSync(dbPath, content, 'utf8');

console.log('✅ 최종 수정 완료');

// 검증
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('},') && line.includes('":') && !line.includes('"id"')) {
    console.log(`Line ${index + 1}: 여전히 문제 있음`);
  }
});

// 중괄호 균형
const openBraces = (content.match(/{/g) || []).length;
const closeBraces = (content.match(/}/g) || []).length;
console.log(`중괄호: { ${openBraces} vs } ${closeBraces}`);