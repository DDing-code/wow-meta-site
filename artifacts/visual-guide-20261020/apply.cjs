// '글은 적게, 그림은 많이' 시험 적용: <가이드 ID>.cjs 의 apply(m) 를 원래 원고에 적용해
// 사이트 원고(src/data/manuscripts/<ID>.js)와 KB 정본(Meta/guide-12.1.json)을 같은 객체로 바꾼다.
//   - 처음 돌릴 때 orig/<ID>.json 에 원래 원고를 저장하고, 이후에는 항상 그 원본에 적용한다(여러 번 돌려도 결과가 같다).
//   - 새로 쓴 글에는 사용자 고정 용어(네임드·쫄)를 적용한다(fixDeep).
//   - patch.changelog 가 있으면 KB Meta/patch-changelog.md 끝에 한 번만 붙인다.
// 사용: node apply.cjs <가이드 ID> [--dry]
const fs = require('node:fs');
const path = require('node:path');
const SITE = path.resolve(__dirname, '..', '..');
const { manuscriptFile, kbGuidePath, replaceManuscript } = require(path.join(SITE, 'artifacts', 'book-rebuild', 'lib.cjs'));
const { fixDeep } = require(path.join(SITE, 'artifacts', 'mm-concept-sample', 'terms.cjs'));
const { loadGuideManuscript } = require(path.join(SITE, 'scripts', 'lib', 'guideManuscripts.cjs'));

const id = process.argv[2];
const dry = process.argv.includes('--dry');
if (!id) throw new Error('가이드 ID를 주세요');
const ORIG = path.join(__dirname, 'orig');
fs.mkdirSync(ORIG, { recursive: true });
const origFile = path.join(ORIG, `${id}.json`);
if (!fs.existsSync(origFile)) fs.writeFileSync(origFile, JSON.stringify(loadGuideManuscript(id), null, 2) + '\n');
const original = JSON.parse(fs.readFileSync(origFile, 'utf8'));

const patch = require(path.join(__dirname, `${id}.cjs`));
const next = fixDeep(patch.apply(JSON.parse(JSON.stringify(original))));

const count = m => {
  let paragraphs = 0; let figures = 0;
  for (const block of m.blocks || []) {
    paragraphs += (block.paragraphs || []).join('').length;
    figures += [block.skillGroups?.length ? 1 : 0, [].concat(block.diagram || []).length, [].concat(block.timeline || []).length, [].concat(block.cards || []).length].reduce((a, b) => a + b, 0);
  }
  return { chapters: (m.blocks || []).length, paragraphChars: paragraphs, figures, jsonChars: JSON.stringify(m).length };
};
console.log(JSON.stringify({ id, before: count(original), after: count(next) }));
if (dry) process.exit(0);

const { file: kbFile } = kbGuidePath(id);
fs.writeFileSync(kbFile, JSON.stringify(next, null, 2) + '\n');
const target = manuscriptFile(id);
fs.writeFileSync(target, replaceManuscript(fs.readFileSync(target, 'utf8'), id, next));

if (patch.changelog) {
  const log = path.join(path.dirname(kbFile), 'patch-changelog.md');
  const head = patch.changelog.split('\n')[0].trim();
  const text = fs.existsSync(log) ? fs.readFileSync(log, 'utf8') : '';
  if (!text.includes(head)) fs.writeFileSync(log, `${text.replace(/\s*$/, '')}\n\n${patch.changelog.trim()}\n`);
}
console.log('written', kbFile, target);
