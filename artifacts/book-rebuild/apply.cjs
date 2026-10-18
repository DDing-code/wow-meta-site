// 개념서 리빌딩 반영: KB 정본(guide-12.1.json)과 그 전문화의 원고 파일(src/data/manuscripts/<가이드 ID>.js)을 같은 새 원고로 바꾼다.
// 사용: node artifacts/book-rebuild/apply.cjs <가이드 ID> [...] [--dry]
// 반영 뒤 사이트 폴더에서 npm run sync-kb 와 원고 검사를 돌린다.
const fs = require('fs');
const { manuscriptFile, kbGuidePath, buildNext, loadContent, replaceManuscript } = require('./lib.cjs');

const dry = process.argv.includes('--dry');
const ids = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
const writes = [];
for (const id of ids) {
  const { file } = kbGuidePath(id);
  const original = JSON.parse(fs.readFileSync(file, 'utf8'));
  const next = buildNext(original, loadContent(id));
  const target = manuscriptFile(id);
  writes.push([file, JSON.stringify(next, null, 2) + '\n']);
  writes.push([target, replaceManuscript(fs.readFileSync(target, 'utf8'), id, next)]);
  console.log(`${id}: 장 ${next.blocks.length}, 부 ${next.book.parts.length}`);
}
if (dry) { console.log('dry run'); process.exit(0); }
writes.forEach(([file, text]) => fs.writeFileSync(file, text));
console.log('applied');
