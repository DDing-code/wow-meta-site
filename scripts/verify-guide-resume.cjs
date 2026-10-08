const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const root = path.resolve(__dirname, '..');
function load(file, name) {
  const source = fs.readFileSync(path.join(root, 'src/data', file), 'utf8');
  return new Function(source.replace(/export default \w+;?/, '').replace(/export (const|function)/g, '$1') + `;return ${name}`)();
}
const guides = load('guideManuscripts.js', 'guideManuscripts');
const registry = load('guideRegistry.js', 'getAllGuideSpecs()');
const source = fs.readFileSync(path.join(root, 'src/data/guideManuscripts.js'), 'utf8');
const ast = parser.parse(source, {sourceType:'module'});
const definitions = new Map();
const count = id => definitions.set(id, (definitions.get(id) || 0) + 1);
for (const statement of ast.program.body) {
  const declaration = statement.declaration || statement;
  for (const item of declaration.declarations || []) {
    if (item.id.name === 'guideManuscripts') item.init.properties.forEach(p => count(p.key.value || p.key.name));
  }
  const assignment = statement.expression;
  if (assignment?.type === 'AssignmentExpression' && assignment.left.object?.name === 'guideManuscripts') count(assignment.left.property.value);
}
assert.equal(registry.length, 40);
const kbRoot = path.join(root, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base');
const dirs = fs.readdirSync(kbRoot);
const missingModes = [];
let canonicalCount = 0;
for (const spec of registry) {
  assert.equal(definitions.get(spec.id), 1, `${spec.id}: stale definitions must not hide the rendered manuscript`);
  const m = guides[spec.id];
  const cls = dirs.find(d => d.endsWith(spec.className.replace(/ /g, '')));
  assert(cls, spec.className);
  const file = path.join(kbRoot, cls, spec.spec, 'Meta', 'guide-12.1.json');
  if (fs.existsSync(file)) { assert.deepEqual(m, JSON.parse(fs.readFileSync(file, 'utf8')), spec.id); canonicalCount++; }
  if (!(m.heroBranches || []).every(b => b.opener?.steps?.length && b.singleTarget?.priority?.length && b.aoe?.priority?.length)) missingModes.push(spec.id);
}
const {skills} = require('../src/data/kb-skills.json');
for (const id of ['paladin-holy','monk-mistweaver']) {
  const m = guides[id];
  assert.equal(m.extraSkills.length, 0);
  assert.equal(m.heroBranches.length, 2);
  for (const b of m.heroBranches) {
    assert(b.opener.steps.length >= 6 && b.singleTarget.priority.length >= 6 && b.aoe.priority.length >= 6);
    assert.notDeepEqual(b.singleTarget.priority, b.aoe.priority);
    for (const row of [...b.opener.steps,...b.singleTarget.priority,...b.aoe.priority]) {
      assert(skills[row.skillId], `${id}: ${row.skillId}`);
      assert(row.note.length > 25);
      assert(!['53576','443589','450508','274586'].includes(row.skillId), 'Passive triggers are not manually cast buttons');
    }
  }
}
assert(!JSON.stringify(guides['monk-mistweaver'].heroBranches[1]).includes('"skillId":"443028"'));
assert(guides['deathknight-unholy'].opener.steps.some(s => /역병/.test(s.note) && /100%/.test(s.note)));
assert(guides['deathknight-unholy'].priority.some(s => /역병/.test(s.note) && /100%/.test(s.note)));
assert(guides['deathknight-unholy'].caveats.some(s => /툴팁.*200%/.test(s)));
assert(guides['monk-brewmaster'].evidence.some(s => /8%.*8초/.test(s)));
assert(guides['monk-mistweaver'].evidence.some(s => /활기의 안개.*포용의 안개.*15%/.test(s)));
assert(guides['hunter-survival'].evidence.some(s => /80%→50%.*20%/.test(s)));
assert(guides['hunter-marksmanship'].evidence.some(s => /60%.*75%/.test(s)));
assert(['375576','53600','26573','4987','465'].every(id => skills[id].specs.includes('Holy')));
assert.equal(skills['257621'].description.includes('75%'), true);
for (const [id, pattern] of [
  ['388505', /3초.*5%/], ['393516', /5초.*10%/],
  ['274586', /소생의 안개.*500%/], ['124682', /6초.*10%/],
  ['375576', /신성.*신성 충격.*심판.*50%/], ['53600', /신성.*4.5초.*보호/],
  ['26573', /12초.*최대 1회/], ['4987', /정화 연마.*마법/],
  ['465', /40미터.*3%/], ['257621', /3명.*75%/], ['259495', /6초.*50%/],
  ['1296656', /^빛 주입이 빛의 섬광의 치유량을 추가로 100%.*흡수량을 추가로 100%/],
  ['1296657', /^심판이 20%.*100%.*마나 소모량이 50%/],
]) assert.match(skills[id].description, pattern, `Reviewed official tooltip must survive sync: ${id}`);
console.log(JSON.stringify({guides:registry.length,definitions:'one per guide',canonicalCount,healerModes:12,missingHeroModes:missingModes}));
