// ES Module import 수정 스크립트 v2
// 모든 상대 경로 import에 .js 확장자 추가 (개선된 버전)

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function fixImports(filePath) {
  if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) {
    return false;
  }

  // backup 파일은 건너뛰기
  if (filePath.includes('.backup') || filePath.includes('_OLD_') || filePath.includes('_BACKUP')) {
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let modified = content;

  // 1. from '../ 패턴 (세미콜론 있을 수도 없을 수도)
  modified = modified.replace(
    /from ['"](\.\.[\/\\][^'"]+?)['"];?/g,
    (match, importPath) => {
      // 이미 확장자가 있거나, 특수 파일은 건너뛰기
      if (importPath.endsWith('.js') ||
          importPath.endsWith('.jsx') ||
          importPath.endsWith('.css') ||
          importPath.endsWith('.json') ||
          importPath.endsWith('.svg') ||
          importPath.endsWith('.png') ||
          importPath.endsWith('.module.css')) {
        return match;
      }
      // 세미콜론 유지
      const hasSemicolon = match.endsWith(';');
      const quote = match.includes('"') ? '"' : "'";
      return `from ${quote}${importPath}.js${quote}${hasSemicolon ? ';' : ''}`;
    }
  );

  // 2. from './ 패턴
  modified = modified.replace(
    /from ['"](\.\/[^'"]+?)['"];?/g,
    (match, importPath) => {
      // 이미 확장자가 있거나, 특수 파일은 건너뛰기
      if (importPath.endsWith('.js') ||
          importPath.endsWith('.jsx') ||
          importPath.endsWith('.css') ||
          importPath.endsWith('.json') ||
          importPath.endsWith('.svg') ||
          importPath.endsWith('.png') ||
          importPath.endsWith('.module.css')) {
        return match;
      }
      // 세미콜론 유지
      const hasSemicolon = match.endsWith(';');
      const quote = match.includes('"') ? '"' : "'";
      return `from ${quote}${importPath}.js${quote}${hasSemicolon ? ';' : ''}`;
    }
  );

  if (modified !== content) {
    fs.writeFileSync(filePath, modified, 'utf8');
    console.log(`✅ 수정: ${path.relative(srcDir, filePath)}`);
    return true;
  }

  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      fixedCount += walkDir(filePath);
    } else {
      if (fixImports(filePath)) {
        fixedCount++;
      }
    }
  });

  return fixedCount;
}

console.log('🔧 ES Module import 경로 수정 시작 (v2)...\n');
const fixedCount = walkDir(srcDir);
console.log(`\n✅ 총 ${fixedCount}개 파일 수정 완료!`);
