// 특성 견본 감사 결과(talents/revalidated.json·proposals.json)를 정본 talentBuilds 에 넣는다.
// 같은 id 의 견본을 통째로 바꾸며, heroLabel 은 새 견본에 있으면 그 값을 쓴다.
// 사용: node artifacts/goal-12.1.5/merge-talents.cjs [<가이드 ID> ...] [--dry]  (ID 없으면 전부)
const fs = require('fs');
const path = require('path');
const { loadRegistry, kbGuidePath } = require('../book-rebuild/lib.cjs');

const dry = process.argv.includes('--dry');
const only = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
const rows = [
  ...require('./talents/revalidated.json'),
  ...require('./talents/proposals.json'),
];
const ids = only.length ? only : loadRegistry().map(spec => spec.id);
let changed = 0;
for (const id of ids) {
  const mine = rows.filter(row => row.guideId === id);
  if (!mine.length) continue;
  const { file } = kbGuidePath(id);
  const kb = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const row of mine) {
    const index = kb.talentBuilds.findIndex(build => build.id === row.buildId);
    if (index < 0) throw new Error(`${id}: 견본 ${row.buildId} 없음`);
    kb.talentBuilds[index] = row.replace;
    changed++;
  }
  console.log(`${id}: ${mine.map(row => row.buildId).join(', ')}`);
  if (!dry) fs.writeFileSync(file, JSON.stringify(kb, null, 2) + '\n');
}
console.log(`견본 ${changed}개 ${dry ? '(미리보기)' : '반영'}`);
