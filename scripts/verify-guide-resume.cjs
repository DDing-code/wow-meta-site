const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
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
  const cls = dirs.find(d => d.replace(/^\d+-/, '') === spec.className.replace(/ /g, ''));
  assert(cls, spec.className);
  const file = path.join(kbRoot, cls, spec.spec, 'Meta', 'guide-12.1.json');
  if (fs.existsSync(file)) { assert.deepEqual(m, JSON.parse(fs.readFileSync(file, 'utf8')), spec.id); canonicalCount++; }
  if (!(m.heroBranches || []).every(b => b.opener?.steps?.length && b.singleTarget?.priority?.length && b.aoe?.priority?.length)) missingModes.push(spec.id);
  assert.equal(m.talentBuilds?.length, 3, spec.id);
  assert.deepEqual(m.talentBuilds.map(b => b.id), ['single-target','mythic-plus','raid']);
  for (const build of m.talentBuilds) {
    assert.match(build.code, /^[A-Za-z0-9+/]+$/);
    assert(build.heroLabel && build.url.endsWith(build.code) && build.sourceUrl);
    const proof = build.validation.browser;
    assert.equal(crypto.createHash('sha256').update(build.code).digest('hex'), proof.sha256, `${spec.id}: changed code must be reviewed again`);
    assert.deepEqual(proof.points, [34,34,13]);
    assert(proof.parentConnections && proof.available);
  }
  assert.equal(m.logReview.samples.length, 2);
  assert(m.logReview.samples.every(s => s.parseCount > 0 && s.representativeLog.startsWith('https://www.warcraftlogs.com/reports/')));
  const individual = m.logReview.individual;
  assert(individual.matchedBossDifficulty && individual.combats.length === 2, spec.id);
  for (const c of individual.combats) {
    assert(c.region === 'US' && c.kill && c.encounterId === 3379 && c.difficulty === 5);
    assert(Date.parse(c.startedAt) >= Date.parse('2026-10-07T00:00:00Z') && c.casts.length);
    assert(c.url.startsWith('https://www.warcraftlogs.com/reports/') && c.durationMs > 0);
  }
  if (individual.matchedItemLevelBracket) {
    assert.equal(individual.combats[0].itemLevelBracket, individual.combats[1].itemLevelBracket);
    assert(individual.durationDifference <= 0.05);
  }
}
assert.equal(canonicalCount, 40);
assert.deepEqual(missingModes, []);
const {skills} = require('../src/data/kb-skills.json');
assert(!skills['453600'], '현재 에테르 조율에 과거 주문 번호를 사용하지 않음');
assert.match(skills['1243307'].description, /^신비한 화살이 50%의 효율로 2명의 추가 대상을 공격합니다\.$/);
assert.equal(skills['6789'].name, '필멸의 고리');
assert.match(skills['385881'].description, /지옥수호병: 추격의 재사용 대기시간이 5초만큼 감소하고 최대 사정거리는 5미터만큼 증가합니다\.$/, '긴 공식 설명도 끝까지 보존');
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
for (const id of ['druid-guardian','mage-arcane','shaman-elemental','shaman-restoration']) {
  const m = guides[id];
  for (const b of m.heroBranches) {
    assert(b.opener.steps.length >= 6 && b.singleTarget.priority.length >= 6 && b.aoe.priority.length >= 6);
    assert.notDeepEqual(b.singleTarget.priority, b.aoe.priority);
    for (const row of [...b.opener.steps,...b.singleTarget.priority,...b.aoe.priority]) assert(skills[row.skillId], `${id}: ${row.skillId}`);
  }
}
const arcane = guides['mage-arcane'].heroBranches;
assert(arcane[0].singleTarget.priority.some(s => /12/.test(s.note)));
assert(arcane[1].singleTarget.priority.some(s => /20/.test(s.note)));
assert(!JSON.stringify(guides['shaman-restoration'].heroBranches[1].opener).includes('"skillId":"444995"'));
assert(!JSON.stringify(guides['shaman-elemental'].heroBranches[1].opener).includes('"skillId":"443454"'));
console.log(JSON.stringify({guides:registry.length,definitions:'one per guide',canonicalCount,talentSamples:120,logAggregates:80,completedHeroModes:registry.reduce((n,s)=>n+guides[s.id].heroBranches.length*3,0)}));
