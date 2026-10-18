// 개념서 리빌딩 회귀 점검(근사): 전문화 전용 검사 스크립트가 문자열·정규식으로 기대하는 문구 중
// 새 원고(content.cjs)를 넣으면 깨지는 것을 찾는다. 실제 파일은 바꾸지 않는다.
// 사용: node artifacts/book-rebuild/regress.cjs <가이드 ID>
// 출력의 "깨짐" 줄은 검사 스크립트가 지금 원고의 기존 장 문구에 기대고 있다는 뜻이다.
// 새 원고 본문에 같은 사실을 담은 문구를 넣어 살리거나, 어쩔 수 없으면 보고에 적는다(검사 스크립트는 조율 담당이 고친다).
const fs = require('fs');
const path = require('path');
const { SITE, allManuscriptText, kbGuidePath, buildNext, loadContent, replaceManuscript, loadRegistry } = require('./lib.cjs');

const id = process.argv[2];
if (!id) { console.error('가이드 ID를 주세요'); process.exit(2); }
const spec = loadRegistry().find(s => s.id === id);
const { file } = kbGuidePath(id);
const original = JSON.parse(fs.readFileSync(file, 'utf8'));
const next = buildNext(original, loadContent(id));
// 원고는 전문화별 파일이다. 검사 스크립트는 전체 글자에서 문구를 찾기도 하므로 모든 원고 파일을 이어 붙여 비교한다.
const before = allManuscriptText() + '\n' + JSON.stringify(original);
const after = allManuscriptText(id, text => replaceManuscript(text, id, next)) + '\n' + JSON.stringify(next);

const scriptsDir = path.join(SITE, 'scripts');
const shortName = id.split('-')[1];
const candidates = fs.readdirSync(scriptsDir)
  .filter(name => /^(verify|validate)-.*\.(c?js)$/.test(name))
  .filter(name => {
    const text = fs.readFileSync(path.join(scriptsDir, name), 'utf8');
    return text.includes(id) || text.includes(spec.spec) || name.includes(shortName);
  });

let broken = 0;
for (const name of candidates) {
  const text = fs.readFileSync(path.join(scriptsDir, name), 'utf8');
  const checks = [];
  for (const line of text.split('\n')) {
    const neg = /assert\.ok\(!|assert\(!|doesNotMatch|\.not\./.test(line);
    for (const m of line.matchAll(/\.includes\('((?:[^'\\]|\\.)+)'\)/g)) checks.push({ line, kind: 's', pat: m[1].replace(/\\'/g, "'"), neg });
    for (const m of line.matchAll(/assert\.(?:match|doesNotMatch)\(\s*[\w.[\]'"]+\s*,\s*\/((?:[^/\\]|\\.)+)\/([gimsuy]*)\)/g)) checks.push({ line, kind: 'r', pat: m[1], flags: m[2].replace('g', ''), neg });
  }
  const test = (src, c) => {
    try { return c.kind === 's' ? src.includes(c.pat) : new RegExp(c.pat, c.flags).test(src); } catch { return null; }
  };
  const hits = [];
  for (const c of checks) {
    const was = test(before, c);
    const now = test(after, c);
    if (was === null || now === null) continue;
    const okBefore = c.neg ? !was : was;
    const okAfter = c.neg ? !now : now;
    if (okBefore && !okAfter) hits.push(c.line.trim().slice(0, 220));
  }
  if (hits.length) {
    console.log(`\n${name}: 깨짐 ${hits.length}개`);
    hits.forEach(h => console.log('  - ' + h));
    broken += hits.length;
  }
}
console.log(`\n검사 스크립트 ${candidates.length}개 확인(${candidates.join(', ') || '없음'}), 깨짐 ${broken}개`);
process.exit(broken ? 1 : 0);
