// 40개 가이드 정본(guide-12.1.json)의 기준 패치를 12.1.5로 올린다.
// patch 를 '12.1.5'로, status 앞의 "12.1 " 머리말을 지운다(배지에 패치가 따로 나온다).
// 이 스크립트는 정본만 고친다. 원고 파일은 apply.cjs(사격은 mm-concept-sample/apply.cjs)로 다시 만든다.
// 사용: node artifacts/goal-12.1.5/bump-patch.cjs [--dry]
const fs = require('fs');
const { loadRegistry, kbGuidePath } = require('../book-rebuild/lib.cjs');

const dry = process.argv.includes('--dry');
for (const spec of loadRegistry()) {
  const { file } = kbGuidePath(spec.id);
  const kb = JSON.parse(fs.readFileSync(file, 'utf8'));
  const before = `${kb.patch} | ${kb.status}`;
  kb.patch = '12.1.5';
  if (typeof kb.status === 'string') kb.status = kb.status.replace(/^12\.1(\.5)?\s+/, '');
  console.log(`${spec.id}: ${before} -> ${kb.patch} | ${kb.status}`);
  if (!dry) fs.writeFileSync(file, JSON.stringify(kb, null, 2) + '\n');
}
