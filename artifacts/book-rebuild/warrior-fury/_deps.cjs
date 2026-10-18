// 임시 점검: verify-warrior-rend-kb.cjs 의 문구 조건 중 분노 기존 장(blocks)에만 기대는 것을 찾는다. 작업 후 삭제.
const fs = require('fs');
const path = require('path');
const site = path.resolve(__dirname, '..', '..', '..');
const v = fs.readFileSync(path.join(site, 'scripts/verify-warrior-rend-kb.cjs'), 'utf8');
const lib = require('../lib.cjs');
// 원고는 전문화별 파일(src/data/manuscripts/<가이드 ID>.js)이다. 검사 스크립트가 보는 전체 글자 = 모든 원고 파일을 이어 붙인 것.
const guide = lib.allManuscriptText();
const swapFury = next => lib.allManuscriptText('warrior-fury', text => lib.replaceManuscript(text, 'warrior-fury', next));
const { file } = lib.kbGuidePath('warrior-fury');
const g = JSON.parse(fs.readFileSync(file, 'utf8'));
const mode = process.argv[2] || 'deps';
const checks = [];
for (const line of v.split('\n')) {
  let m;
  const neg = /assert\.ok\(!|assert\(!|doesNotMatch/.test(line);
  if ((m = line.match(/(?:guide|furyGuide)\.includes\('((?:[^'\\]|\\.)*)'\)/))) checks.push({ line, kind: 's', pat: m[1], neg });
  else if ((m = line.match(/assert\.(?:match|doesNotMatch)\((guide|furyGuide), \/(.*)\/\);/))) checks.push({ line, kind: 'r', pat: m[2], neg });
}
const test = (src, c) => (c.kind === 's' ? src.includes(c.pat) : new RegExp(c.pat).test(src));
if (mode === 'deps') {
  const stripped = swapFury({ ...g, blocks: [] });
  for (const c of checks) if (test(guide, c) !== test(stripped, c)) console.log((c.neg ? 'NEG ' : 'POS ') + c.line.trim());
} else {
  const next = lib.buildNext(g, lib.loadContent('warrior-fury'));
  const replaced = swapFury(next);
  let bad = 0;
  for (const c of checks) {
    const ok = c.neg ? !test(replaced, c) : test(replaced, c);
    const was = c.neg ? !test(guide, c) : test(guide, c);
    if (was && !ok) { bad++; console.log('깨짐: ' + c.line.trim()); }
  }
  console.log('깨진 조건', bad);
}
