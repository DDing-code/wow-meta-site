// 특성 ↔ 스킬 연결 도식(2026-11-01): <가이드 ID>.cjs 의 apply(m) 를 원래 원고에 적용해
// 사이트 원고(src/data/manuscripts/<ID>.js)와 KB 정본(Meta/guide-12.1.json)을 같은 객체로 바꾼다.
//   - 처음 돌릴 때 orig/<ID>.json 에 원래 원고를 저장하고, 이후에는 항상 그 원본에 적용한다(여러 번 돌려도 결과가 같다).
//   - 흐름도 특성 상자에 affects(붙는 스킬), 타임라인 자리에 talents(그 자리를 바꾸는 특성)만 더한다. 글은 바꾸지 않는다.
//   - 새 ID 가 kb-skills.json 에 있는지 검사한다(없으면 중단 — KB 노트부터 추가).
//   - patch.changelog 가 있으면 KB Meta/patch-changelog.md 끝에 한 번만 붙인다.
// 사용: node apply.cjs <가이드 ID> [--dry]
const fs = require('node:fs');
const path = require('node:path');
const SITE = path.resolve(__dirname, '..', '..');
const { manuscriptFile, kbGuidePath, replaceManuscript } = require(path.join(SITE, 'artifacts', 'book-rebuild', 'lib.cjs'));
const { loadGuideManuscript } = require(path.join(SITE, 'scripts', 'lib', 'guideManuscripts.cjs'));
const kb = require(path.join(SITE, 'src', 'data', 'kb-skills.json')).skills;

const id = process.argv[2];
const dry = process.argv.includes('--dry');
if (!id) throw new Error('가이드 ID를 주세요');
const ORIG = path.join(__dirname, 'orig');
fs.mkdirSync(ORIG, { recursive: true });
const origFile = path.join(ORIG, `${id}.json`);
if (!fs.existsSync(origFile)) fs.writeFileSync(origFile, JSON.stringify(loadGuideManuscript(id), null, 2) + '\n');
const original = JSON.parse(fs.readFileSync(origFile, 'utf8'));

const patch = require(path.join(__dirname, `${id}.cjs`));
const next = patch.apply(JSON.parse(JSON.stringify(original)));

// 글은 바뀌지 않았는지: affects/talents 를 뺀 나머지가 원본과 같아야 한다
const strip = value => {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, item] of Object.entries(value)) if (key !== 'affects' && key !== 'talents') out[key] = strip(item);
    return out;
  }
  return value;
};
if (JSON.stringify(strip(next)) !== JSON.stringify(strip(original))) throw new Error('affects/talents 말고 다른 내용이 바뀜');

const count = { affects: 0, affectNodes: 0, talents: 0, talentNodes: 0, missing: [] };
for (const block of next.blocks || []) {
  for (const diagram of [].concat(block.diagram || [])) for (const layer of diagram.layers || []) for (const node of layer.nodes || []) {
    if (!node.affects) continue;
    count.affectNodes += 1;
    count.affects += node.affects.length;
    node.affects.filter(t => /^\d+$/.test(String(t)) && !kb[String(t)]).forEach(t => count.missing.push(`${diagram.title}: ${t}`));
  }
  for (const timeline of [].concat(block.timeline || [])) for (const rail of timeline.rails || []) for (const node of rail.nodes || []) {
    if (!node.talents) continue;
    count.talentNodes += 1;
    count.talents += node.talents.length;
    node.talents.filter(t => !kb[String(t)]).forEach(t => count.missing.push(`${timeline.title}: ${t}`));
  }
}
console.log(JSON.stringify({ id, ...count }));
if (count.missing.length) throw new Error('KB 에 없는 ID: ' + count.missing.join(', '));
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
