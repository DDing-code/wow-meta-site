const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { skills } = require('../src/data/kb-skills.json');

// Scope grows only when the underlying notes have been manually reviewed.
for (const id of ['1265385', '1265386', '1265387', '1247227']) {
  assert.equal(skills[id]?.patch, '12.1', id);
  assert.ok(skills[id].specs.includes('Assassination'), id);
}
for (const id of ['1265385', '1265386', '1265387']) {
  assert.equal(skills[id].type, 'talent', id);
  assert.equal(skills[id].name, '불구대천', id);
  assert.equal(skills[id].icon, 'inv12_apextalent_rogue_implacable', id);
}
assert.equal(skills['1247227'].type, 'atomic-skill');
assert.equal(skills['1247227'].resourceCost, '기력 60');
assert.equal(skills['1247227'].range, '자신 주위 10미터');
assert.match(skills['1265385'].description, /연계 점수 1점당 기력 2/);
assert.match(skills['1265386'].description, /자연 및 출혈 능력의 피해를 10%/);
assert.match(skills['1265387'].description, /자동으로 다섯 번/);
assert.match(skills['1247227'].description, /연계 점수 1점을 생성/);
const vault = path.resolve(__dirname, '../../WoW-Meta-Knowledge');
if (fs.existsSync(vault)) {
  const note = id => fs.readFileSync(path.resolve(__dirname, '../..', skills[id].source.kbPath.replaceAll('\\', '/')), 'utf8');
  assert.match(note('1265385'), /연계 점수 1점당 기력 2/);
  assert.match(note('1265386'), /자연 및 출혈 능력의 피해를 10%/);
  assert.match(note('1265387'), /각 공격은 무기의 치명독을 적용하고 연계 점수 1점/);
  assert.match(note('1247227'), /최대 두 명의 다른 적에게 복제/);
}
console.log('Assassination reviewed subset: three apex nodes and Crimson Tempest passed');
