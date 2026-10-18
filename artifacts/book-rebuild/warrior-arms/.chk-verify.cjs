// 임시 점검: verify-*.cjs 의 guide 긍정 검사 중 무기 정의에만 있는 문구 찾기 (끝나면 지운다)
const fs = require('fs'), path = require('path');
const lib = require('../lib.cjs');
const id = 'warrior-arms';
// 원고는 전문화별 파일(src/data/manuscripts/<가이드 ID>.js)이다. 검사 스크립트가 보는 전체 글자 = 모든 원고 파일을 이어 붙인 것.
const src = lib.allManuscriptText();
const without = lib.allManuscriptText(id, text => lib.replaceManuscript(text, id, {}));
let newSrc = null;
if (process.argv[2] === 'new') {
  const { file } = lib.kbGuidePath(id);
  const orig = JSON.parse(fs.readFileSync(file, 'utf8'));
  const next = lib.buildNext(orig, lib.loadContent(id));
  newSrc = lib.allManuscriptText(id, text => lib.replaceManuscript(text, id, next));
}
const dir = path.join(lib.SITE, 'scripts');
for (const f of fs.readdirSync(dir).filter(f => /^verify-.*\.cjs$/.test(f))) {
  const t = fs.readFileSync(path.join(dir, f), 'utf8');
  if (!/guideManuscripts/.test(t)) continue;
  t.split('\n').forEach((ln, idx) => {
    const checks = [];
    let r = /(!?)\s*\b(guide|source|manuscript|manuscripts|src|text)\.includes\((['"`])((?:\\.|(?!\3).)*)\3\)/g, mm;
    while ((mm = r.exec(ln))) checks.push({ neg: !!mm[1], kind: 'inc', val: mm[4].replace(/\\'/g, "'") });
    let r2 = /assert\.(match|doesNotMatch)\((guide|source|manuscript|src|text),\s*\/((?:\\.|[^/])+)\/([a-z]*)/g;
    while ((mm = r2.exec(ln))) checks.push({ neg: mm[1] === 'doesNotMatch', kind: 're', val: mm[3], flags: mm[4] });
    for (const c of checks) {
      let test;
      try { test = s => c.kind === 'inc' ? s.includes(c.val) : new RegExp(c.val, c.flags).test(s); test(''); } catch { continue; }
      const inAll = test(src), inWithout = test(without);
      if (!c.neg && inAll && !inWithout) {
        const ok = newSrc ? test(newSrc) : null;
        console.log(`${f}:${idx + 1} [필요]${ok === null ? '' : ok ? ' OK' : ' 없음!'} ${c.val}`);
      }
      if (c.neg && newSrc && test(newSrc) && !test(src)) console.log(`${f}:${idx + 1} [금지 위반] ${c.val}`);
    }
  });
}
