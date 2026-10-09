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
  const heroTrees = new Map(m.heroBranches.map(b => [b.heroTreeId, b.label]));
  assert.equal(heroTrees.size, 2, `${spec.id}: 두 영웅 분기는 서로 다른 선택 노드여야 함`);
  assert([...heroTrees.keys()].every(id => Number.isInteger(id) && id > 0), spec.id);
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
  for (const [mode, pair] of [['raid', individual], ['mythicPlus', m.logReview.mythicPlus]]) {
    assert(pair?.matchedGearItemLevel && pair.matchedAugmentation && pair.combats.length === 2, spec.id);
    const [a,b] = pair.combats;
    assert(a.encounterId === b.encounterId && a.difficulty === b.difficulty, spec.id);
    assert(a.gearItemLevel > 0 && b.gearItemLevel > 0 && Math.abs(a.gearItemLevel-b.gearItemLevel) <= 1, spec.id);
    assert.equal(a.augmentationCount, b.augmentationCount, spec.id);
    const durationDifference = Math.abs(a.durationMs-b.durationMs)/Math.max(a.durationMs,b.durationMs);
    assert.equal(pair.durationDifference, durationDifference, spec.id);
    assert(durationDifference <= 0.05, spec.id);
    for (const c of pair.combats) {
      assert(c.region === 'US' && c.kill && Date.parse(c.startedAt) >= Date.parse('2026-10-07T00:00:00Z') && c.casts.length, spec.id);
      assert.equal(c.heroLabel, heroTrees.get(c.heroTree), `${spec.id}: API에 없는 hero 필드 대신 선택 노드로 영웅 분기를 확인`);
      assert(m.sources.find(s => s.url === c.url)?.note.includes(c.heroLabel), `${spec.id}: 영웅 선택의 개별 로그 출처`);
    }
    if (mode === 'mythicPlus') {
      assert(pair.matchedKeystoneAffixes && a.keystoneLevel > 0, spec.id);
      assert.equal(a.keystoneLevel, b.keystoneLevel, spec.id);
      assert.deepEqual(a.affixes, b.affixes, spec.id);
    }
  }
  assert.equal(m.logReview.KoreaAppliedAt, null, '공식 한국 적용 시각이 확인되기 전에는 적용 완료로 기록하지 않음');
  assert.equal(m.logReview.KoreaScheduledEndsAt, '2026-10-08T06:00:00+09:00', '공식 한국 주간 점검 예정 종료를 실측 적용 시각과 구분');
  assert.equal(m.logReview.heroConclusion.checkedAt, '2026-10-10', spec.id);
  assert.equal(m.logReview.heroConclusion.confirmedRanking, false, '공개 추천과 관측 사례를 인과 성능 순위로 승격하지 않음');
  const currentKorea = m.logReview.currentKorea;
  assert(currentKorea.raid.length > 0 && currentKorea.mythicPlus.length > 0, spec.id);
  for (const [mode, combats] of [['raid', currentKorea.raid], ['mythicPlus', currentKorea.mythicPlus]]) for (const c of combats) {
    assert(c.region === 'KR' && c.durationMs > 0 && c.castCount > 0 && c.buffCount >= 0 && c.selectionEntries.length, spec.id);
    assert(Date.parse(c.startedAt) >= Date.parse(currentKorea.observedSince), spec.id);
    assert.equal(c.heroLabel, heroTrees.get(c.heroTree), spec.id);
    assert(mode === 'raid' ? c.difficulty === 5 : c.keystoneLevel > 0, spec.id);
    assert(m.sources.some(s => s.url === c.url && s.note.includes(c.heroLabel)), spec.id);
  }
  for (const c of m.logReview.koreaCases) {
    assert(c.region === 'KR' && c.keystoneLevel > 0 && c.durationMs > 0 && c.casts.length, spec.id);
    assert.equal(c.heroLabel, heroTrees.get(c.heroTree), spec.id);
    assert(m.sources.some(s => s.url === c.url && s.note.includes('한국 공식 조정 적용 시각과 동일 조건 비교쌍은 미확정')), spec.id);
  }
  for (const id of ['321377','372309','388193','391154','391387','204883']) assert(!JSON.stringify(m.heroBranches).includes(`"skillId":"${id}"`), `${spec.id}: 과거 선택 노드를 현재 수동 순서에 넣지 않음`);
}
assert.equal(canonicalCount, 40);
assert.deepEqual(missingModes, []);
const {skills} = require('../src/data/kb-skills.json');
assert.equal(skills['343737'].category, 'passive');
assert.equal(skills['406139'].category, 'buff');
assert.equal(skills['1271748'].patch, '12.1');
assert.equal(skills['204883'].patch, '11.0.2', '제거된 치유의 마법진을 현행 핵심 스킬로 분류하지 않음');
for (const id of ['321377','372309','388193','391154','391387']) assert.equal(skills[id].patch, '12.0.5', '미확인 과거 주문을 현재 패치로 일괄 변경하지 않음');
const {synergies} = require('../src/data/kb-synergies.json');
for (const id of ['monk_mistweaver_celestial_conduit_revival','monk_mistweaver_enveloping_single_target_recovery','priest_holy_apotheosis_hymn','priest_holy_celestial_cooldown_windows','priest_holy_prayer_sanctify_circle','priest_holy_prayer_of_mending_aoe','priest_holy_prayer_of_mending_talent_web','SY-WARLOCK-COMMON-CURSES-FEAR-CC']) {
  const synergy = synergies[id];
  assert.equal(synergy.patch, '12.1');
  assert(synergy.participants.every(p => !['321377','372309','391154','391387','204883'].includes(p)), id);
  assert(synergy.linkedTalents.every(p => !/(기도의마법진|공명의권능|신성한회복|이루어진기원)$/.test(p)), id);
}
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
assert(guides['deathknight-unholy'].caveats.some(s => /한국어.*100%/.test(s)));
assert(guides['monk-brewmaster'].evidence.some(s => /8%.*8초/.test(s)));
assert(guides['monk-mistweaver'].evidence.some(s => /활기의 안개.*포용의 안개.*15%/.test(s)));
assert(guides['hunter-survival'].evidence.some(s => /80%→50%.*20%/.test(s)));
assert(guides['hunter-marksmanship'].evidence.some(s => /60%.*75%/.test(s)));
assert(['375576','53600','26573','4987','465'].every(id => skills[id].specs.includes('Holy')));
assert.equal(skills['257621'].description.includes('75%'), true);
for (const [id, pattern] of [
  ['1271967', /남은 피해를 100%만큼/], ['388505', /3초.*8%/], ['393516', /8초.*10%/],
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
console.log(JSON.stringify({guides:registry.length,definitions:'one per guide',canonicalCount,talentSamples:120,logAggregates:80,koreaCombats:registry.reduce((n,s)=>n+guides[s.id].logReview.currentKorea.raid.length+guides[s.id].logReview.currentKorea.mythicPlus.length,0),completedHeroModes:registry.reduce((n,s)=>n+guides[s.id].heroBranches.length*3,0)}));
