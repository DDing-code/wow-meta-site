const assert = require('node:assert/strict');
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
console.log('Shadow KB identity and relationship checks passed');
