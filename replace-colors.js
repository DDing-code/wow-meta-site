const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ArcaneMageGuide.js');

// UTF-8로 파일 읽기
let content = fs.readFileSync(filePath, 'utf8');

// 전사 색상을 마법사 색상으로 변경
// rgba(170, 211, 114, X) -> rgba(63, 198, 234, X)
content = content.replace(/rgba\(170,\s*211,\s*114,/g, 'rgba(63, 198, 234,');

// UTF-8로 파일 쓰기
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ 색상 변경 완료!');
console.log('전사 색상 rgba(170, 211, 114, ...) -> 마법사 색상 rgba(63, 198, 234, ...)');
