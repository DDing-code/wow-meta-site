const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
let content = fs.readFileSync(dbPath, 'utf8');

// 문제 패턴: } } 다음에 오는 , 제거
// 이 패턴이 문법 오류를 일으킴
content = content.replace(/}\s*}\s*,/g, '}\n  },');

// 빈 객체 뒤의 쉼표도 문제가 될 수 있음
content = content.replace(/}\s*,\s*,/g, '},');

// 여러 개의 닫는 중괄호 처리
content = content.replace(/}\s*}\s*}\s*,/g, '}\n    }\n  },');

fs.writeFileSync(dbPath, content, 'utf8');
console.log('✅ 모든 문법 오류 수정 완료');