const assert = require('node:assert/strict');
const fs = require('node:fs');
const { skills } = require('../src/data/kb-skills.json');
const { synergies } = require('../src/data/kb-synergies.json');

for (const id of ['200174', '1242779', '453844']) {
  assert.equal(skills[id], undefined, `Obsolete Priest spell ${id}`);
}
for (const [id, type] of Object.entries({
  263165: 'atomic-skill', 1242173: 'atomic-skill', 1227280: 'atomic-skill',
  391403: 'atomic-skill', 450983: 'atomic-skill', 232698: 'atomic-skill',
  194249: 'buff', 391401: 'buff', 1242171: 'buff',
  199484: 'talent', 73510: 'talent', 1264177: 'passive',
  1296579: 'passive', 1296580: 'passive',
})) {
  assert.equal(skills[id]?.type, type, `Incorrect spell identity ${id}`);
  assert.equal(skills[id].patch, '12.1');
  assert.ok(skills[id].specs.includes('Shadow'));
}
assert.equal(skills['263165'].cooldown, '30초');
assert.equal(skills['1230339'].type, 'talent');
assert.ok(skills['1240364'].specs.includes('Shadow'));
assert.deepEqual(skills['120644'].specs, ['Shadow']);
assert.deepEqual(skills['120517'].specs, ['Holy']);
const shadow = Object.values(synergies).filter(row =>
  row.source.kbPath.replaceAll('\\', '/').includes('/09-사제/암흑/Synergies/'));
assert.equal(shadow.length, 10);
for (const row of shadow) {
  assert.equal(row.spec, 'Shadow');
  assert.equal(row.patch, '12.1');
  assert.notEqual(row.synergyType, 'unknown');
  assert.ok(row.description?.length > 30);
  for (const id of row.participants) assert.ok(skills[id], `Missing participant ${id}`);
}
const archon = synergies.priest_common_archon_halo_power_cycle;
assert.ok(!archon.participants.includes('263165'), 'Void Torrent cannot be an Archon node');
assert.ok(archon.participants.includes('391403'));
for (const id of [8092, 450983, 32379, 335467, 15407, 391403]) {
  assert.match(skills[id].description, /2026-09-22.*15%/);
}
assert.match(skills[8092].description, /수양의 정신 분열 피해 상향으로 옮기지 않는다/);
assert.match(skills[81749].description, /공격대·전장 밖.*40%.*PvP/);
assert.match(skills[47540].description, /마나 비용이 20% 감소/);
assert.match(skills[199484].description, /20%\(기존 25%\)/);
assert.match(skills[73510].description, /피해가 5% 감소/);
assert.match(synergies.priest_shadow_psychic_link_multi.description, /2026-09-22.*20%/);
assert.doesNotMatch(synergies.priest_shadow_psychic_link_multi.description, /직접 피해의 25%/);
const guide = fs.readFileSync(require.resolve('../src/data/guideManuscripts.js'), 'utf8');
assert.match(guide, /공격대·전장 밖에서 속죄 치유가 40% 증가/);
assert.match(guide, /영혼의 연결은 9월 22일 이후 PvE에서 직접 피해의 20%/);
console.log('Priest 12.1 KB identity, relationships and September hotfix checks passed');
