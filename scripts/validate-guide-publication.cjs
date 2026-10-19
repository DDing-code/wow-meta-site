const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
function load(file, names) {
  const source = fs.readFileSync(path.join(root, 'src/data', file), 'utf8')
    .replace(/export default guideManuscripts;?/, '')
    .replace(/\bexport (const|function)\b/g, '$1');
  return new Function(`${source}\nreturn {${names}};`)();
}
const { guideUpdates, getGuidePublication, GUIDE_PUBLICATION_PATCH } = load('guideUpdates.js', 'guideUpdates, getGuidePublication, GUIDE_PUBLICATION_PATCH');
const guideManuscripts = require('./lib/guideManuscripts.cjs').loadGuideManuscripts();
const { getAllGuideSpecs, CURRENT_PATCH_LABEL } = load('guideRegistry.js', 'getAllGuideSpecs, CURRENT_PATCH_LABEL');
assert.equal(GUIDE_PUBLICATION_PATCH, CURRENT_PATCH_LABEL, 'Publication patch must match the registry patch label');
const P = CURRENT_PATCH_LABEL;
const ids = new Set(getAllGuideSpecs().map(guide => guide.id));
let previous = '9999-12-31';
for (const entry of guideUpdates) {
  assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(entry.date <= previous, 'Updates must be newest first');
  previous = entry.date;
  assert.ok(entry.commits.length);
  entry.commits.forEach(commit => assert.match(commit, /^[a-f0-9]{8}$/));
  entry.guideIds.forEach(id => assert.ok(ids.has(id), `Unknown guide ${id}`));
}
for (const id of ids) {
  const manuscript = guideManuscripts[id];
  const publication = getGuidePublication(id, manuscript);
  assert.ok(publication.date && publication.commit, `Missing Git publication for ${id}`);
  const latest = guideUpdates.find(entry => entry.guideIds.includes(id));
  if (manuscript.patch !== P || latest.partial) {
    assert.equal(publication.partial, true);
    assert.equal(publication.label, `${P} 전환 중`);
    assert.ok(publication.detail.includes(manuscript.patch === P ? '전체 검수' : manuscript.patch));
  } else {
    assert.equal(publication.label, P);
    assert.equal(publication.partial, false);
  }
  assert.ok(publication.detail.split(P).length <= 2, 'Duplicate patch in badge');
}
assert.equal(getGuidePublication('unknown', null).label, '확인 중');
assert.equal(getGuidePublication('unknown', null).date, null);
assert.equal(getGuidePublication('rogue-assassination', guideManuscripts['rogue-assassination']).partial, false);
assert.equal(getGuidePublication('rogue-subtlety', guideManuscripts['rogue-subtlety']).partial, false);
assert.equal(getGuidePublication('rogue-outlaw', guideManuscripts['rogue-outlaw']).partial, false);
for (const id of ['mage-fire', 'mage-frost']) {
  assert.equal(getGuidePublication(id, guideManuscripts[id]).partial, false);
}
assert.equal(getGuidePublication('mage-arcane', guideManuscripts['mage-arcane']).partial, false);
// 2026-10-19 추천 목적별 검수: 의견 차이를 지우지 않고 본문·KB·출판 근거를 함께 보완한 13개.
const REVIEWED = ['monk-brewmaster', 'monk-windwalker', 'druid-balance', 'paladin-holy', 'rogue-assassination',
  'demonhunter-havoc', 'rogue-subtlety', 'warrior-fury', 'mage-frost', 'druid-feral', 'shaman-enhancement',
  'hunter-survival', 'mage-fire'];
assert.deepEqual([...ids].filter(id => getGuidePublication(id, guideManuscripts[id]).partial), []);
for (const id of REVIEWED) {
  const m = guideManuscripts[id];
  const review = m.logReview.publicationReview;
  assert.equal(review?.patch, P, `${id}: publication needs current recommendation evidence`);
  assert.equal(review.checkedAt, '2026-10-19');
  assert.ok(review.choice?.length > 50 && review.evidence?.length > 100, `${id}: publication cannot be a flag-only change`);
  assert.ok(m.blocks.some(b => b.part === 'field' && b.paragraphs?.includes(review.choice)), `${id}: readers must see the choice conditions`);
  assert.equal(m.logReview.heroConclusion.confirmedRanking, false, `${id}: publication is not a performance ranking`);
  assert.ok(m.sources.some(s => s.url === review.sourceUrl && s.updated.includes('2026-10-19')));
}
for (const id of ids) {
  if (!getGuidePublication(id, guideManuscripts[id]).partial) {
    assert.doesNotMatch(guideManuscripts[id].status || '', /검수 중/, `Released guide ${id} must not say 검수 중`);
  }
}
// 목록 화면 공사 중 안내는 패치 번호를 직접 쓰지 않고 레지스트리 값을 쓴다.
const listPage = fs.readFileSync(path.join(root, 'src/pages/GuidePage.js'), 'utf8');
assert.ok(listPage.includes('{CURRENT_PATCH_LABEL} 전환·검수 중'), 'Guide list notice must use CURRENT_PATCH_LABEL');
assert.doesNotMatch(listPage, /12\.\d+(\.\d+)? 전환/, 'Guide list must not hardcode a patch label');
assert.equal(getGuidePublication('x', { patch: P, status: `${P} 부분 검수` }).detail, `${P} · 부분 검수`);
console.log(`Guide publication metadata verified for ${ids.size} specializations.`);
