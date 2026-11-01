// '구간을 연다' 계열 문장 다듬기(2026-11-01): <가이드 ID>.cjs 의 표(경로, 바꿀 부분, 새 부분)를 원고에 적용해
// 사이트 원고(src/data/manuscripts/<ID>.js)와 KB 정본(Meta/guide-12.1.json)을 같은 객체로 바꾼다.
//   - 글자만 바꾼다. 경로의 값이 문자열이 아니거나 바꿀 부분이 없으면 멈춘다(이미 새 부분이 있으면 건너뜀 → 여러 번 돌려도 같다).
//   - 흐름도·타임라인 제목은 특성 연결 자료(talent-links-20261101)와 영상 도식이 열쇠로 쓰므로 표에 넣지 않는다.
//   - talent-links-20261101/orig/<ID>.json 이 있으면 같은 표를 적용한다(그 도구를 다시 돌려도 다듬은 글이 되돌아가지 않게).
//   - patch.changelog 가 있으면 KB Meta/patch-changelog.md 끝에 한 번만 붙인다.
// 사용: node apply.cjs <가이드 ID> [--dry]
const fs = require('node:fs');
const path = require('node:path');
const SITE = path.resolve(__dirname, '..', '..');
const { manuscriptFile, kbGuidePath, replaceManuscript } = require(path.join(SITE, 'artifacts', 'book-rebuild', 'lib.cjs'));
const { loadGuideManuscript } = require(path.join(SITE, 'scripts', 'lib', 'guideManuscripts.cjs'));

const id = process.argv[2];
const dry = process.argv.includes('--dry');
if (!id) throw new Error('가이드 ID를 주세요');
const patch = require(path.join(__dirname, `${id}.cjs`));

const KEYS = /[^.[\]]+/g;
function edit(m, label) {
  let changed = 0;
  for (const [at, from, to] of patch.rows) {
    const keys = at.match(KEYS).map(k => (/^\d+$/.test(k) ? Number(k) : k));
    const last = keys.pop();
    const holder = keys.reduce((o, k) => (o == null ? o : o[k]), m);
    const value = holder && holder[last];
    if (typeof value !== 'string') throw new Error(`${label} ${at}: 문자열이 아님`);
    if (/(제목|title)$/.test(String(last)) && /diagram|timeline/.test(at)) throw new Error(`${at}: 흐름도·타임라인 제목은 바꾸지 않음`);
    if (value.includes(from)) { holder[last] = value.split(from).join(to); changed += 1; }
    else if (!value.includes(to)) throw new Error(`${label} ${at}: '${from}' 없음`);
  }
  return changed;
}

const next = loadGuideManuscript(id);
const changed = edit(next, 'manuscript');
console.log(JSON.stringify({ id, rows: patch.rows.length, changed }));

const linksOrig = path.join(SITE, 'artifacts', 'talent-links-20261101', 'orig', `${id}.json`);
let orig = null;
if (fs.existsSync(linksOrig)) {
  orig = JSON.parse(fs.readFileSync(linksOrig, 'utf8'));
  console.log(JSON.stringify({ talentLinksOrig: edit(orig, 'talent-links orig') }));
}
if (dry) process.exit(0);

const { file: kbFile } = kbGuidePath(id);
fs.writeFileSync(kbFile, JSON.stringify(next, null, 2) + '\n');
const target = manuscriptFile(id);
fs.writeFileSync(target, replaceManuscript(fs.readFileSync(target, 'utf8'), id, next));
if (orig) fs.writeFileSync(linksOrig, JSON.stringify(orig, null, 2) + '\n');

if (patch.changelog) {
  const log = path.join(path.dirname(kbFile), 'patch-changelog.md');
  const head = patch.changelog.split('\n')[0].trim();
  const text = fs.existsSync(log) ? fs.readFileSync(log, 'utf8') : '';
  if (!text.includes(head)) fs.writeFileSync(log, `${text.replace(/\s*$/, '')}\n\n${patch.changelog.trim()}\n`);
}
console.log('written', kbFile, target);
