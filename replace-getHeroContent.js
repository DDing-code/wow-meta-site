const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ArcaneMageGuide.js');
const newContentPath = path.join(__dirname, 'temp-getHeroContent.js');

console.log('📝 getHeroContent 교체 시작...\n');

try {
  // 원본 파일 읽기
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // 새로운 getHeroContent 읽기
  const newContent = fs.readFileSync(newContentPath, 'utf8');

  // Line 292-826 찾기 (0-based index이므로 291-825)
  const startLine = 291;  // Line 292 (0-based)
  const endLine = 825;    // Line 826 (0-based)

  console.log(`  ✓ 원본 파일: ${lines.length}줄`);
  console.log(`  ✓ 교체 범위: ${startLine + 1}-${endLine + 1}줄 (${endLine - startLine + 1}줄)`);

  // 교체 실행
  const before = lines.slice(0, startLine);
  const after = lines.slice(endLine + 1);
  const newLines = [...before, newContent, ...after];

  // 파일 쓰기
  fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

  console.log(`  ✅ 교체 완료: ${newLines.length}줄\n`);
  console.log('✨ getHeroContent 교체 성공!');

} catch (error) {
  console.error(`  ❌ 오류 발생: ${error.message}`);
}
