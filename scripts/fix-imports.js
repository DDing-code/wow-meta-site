// ES Module import 수정 스크립트
// 모든 상대 경로 import에 .js 확장자 추가

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
  let modified = false;

  // 상대 경로 import를 찾아서 .js 확장자가 없으면 추가
  const lines = content.split('\n');
  const fixedLines = lines.map(line => {
    // import ... from './...' or '../...' 패턴 (따옴표 종류에 관계없이)
    const importMatch = line.match(/^(\s*import\s+.*\s+from\s+['"])(\.\.[\/\\].*|\.\/.*?)(['"];?.*)$/);

    if (importMatch) {
      const [, prefix, importPath, suffix] = importMatch;

      // 이미 확장자가 있거나, .css, .json, .svg, .png 파일은 건너뛰기
      if (importPath.endsWith('.js') ||
          importPath.endsWith('.jsx') ||
          importPath.endsWith('.css') ||
          importPath.endsWith('.json') ||
          importPath.endsWith('.svg') ||
          importPath.endsWith('.png') ||
          importPath.endsWith('.module.css')) {
        return line;
      }

      // .js 확장자 추가
      modified = true;
      return `${prefix}${importPath}.js${suffix}`;
    }

    return line;
  });

  if (modified) {
    fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf8');
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

console.log('🔧 ES Module import 경로 수정 시작...\n');
const fixedCount = walkDir(srcDir);
console.log(`\n✅ 총 ${fixedCount}개 파일 수정 완료!`);
