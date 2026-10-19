// 기존 patches/<ID>.cjs 끝에서 후속 파일(patches/<ID>.followup.cjs)을 부르고, 변경 기록 배열에 한 줄을 더한다.
// 사용: node hook-patch.cjs <가이드 ID> "<변경 기록 한 줄>"
const fs = require('node:fs');
const path = require('node:path');
const [id, line] = process.argv.slice(2);
const f = path.join('C:/wowmeta/site/artifacts/cycle-order-20261020/patches', id + '.cjs');
const L = fs.readFileSync(f, 'utf8').split('\n');
const hook = `    { const p = require.resolve('./${id}.followup.cjs'); delete require.cache[p]; require(p)(m); }`;
if (!L.includes(hook)) {
  const last = L.map((l, i) => [l, i]).filter(([l]) => l.trimEnd() === '    return m;').pop();
  if (!last) throw new Error('return m; 없음');
  L.splice(last[1], 0, hook);
}
if (line) {
  const j = L.findIndex(l => l.startsWith('  ].join('));
  const entry = '    ' + JSON.stringify('- [후속·최신 메타] ' + line) + ',';
  if (j >= 0) { if (!L.some(l => l.includes('[후속·최신 메타]'))) L.splice(j, 0, entry); }
  else {
    // changelog 가 템플릿 문자열이면 apply 앞에 덧붙이는 줄을 둔다
    const k = L.findIndex(l => l.startsWith('  apply(m)'));
    if (!L.some(l => l.includes('[후속·최신 메타]'))) L.splice(k, 0, `  get changelogExtra() { return ${JSON.stringify('- [후속·최신 메타] ' + line)}; },`);
  }
}
fs.writeFileSync(f, L.join('\n'));
console.log(id, '후속 연결 완료');
