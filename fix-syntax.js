const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
let content = fs.readFileSync(dbPath, 'utf8');

// icon: → "icon": 변환
content = content.replace(/(\s+)icon:\s*"/g, '$1"icon": "');

// 마지막 쉼표 누락 수정
content = content.replace(/("icon":\s*"[^"]+")(\s+)(")/g, '$1,$2$3');

fs.writeFileSync(dbPath, content, 'utf8');
console.log('✅ 구문 오류 수정 완료');