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
const { guideUpdates, getGuidePublication } = load('guideUpdates.js', 'guideUpdates, getGuidePublication');
const { guideManuscripts } = load('guideManuscripts.js', 'guideManuscripts');
const { getAllGuideSpecs } = load('guideRegistry.js', 'getAllGuideSpecs');
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
  if (manuscript.patch === '12.1') assert.equal(publication.label, '12.1');
  else {
    assert.equal(publication.label, '12.1 전환 중');
    assert.ok(publication.detail.includes(manuscript.patch));
  }
  assert.doesNotMatch(publication.detail, /12\.1.*12\.1/, 'Duplicate patch in badge');
}
assert.equal(getGuidePublication('unknown', null).label, '확인 중');
assert.equal(getGuidePublication('unknown', null).date, null);
console.log(`Guide publication metadata verified for ${ids.size} specializations.`);
