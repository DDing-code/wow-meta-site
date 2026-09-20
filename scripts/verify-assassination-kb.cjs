const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { skills } = require('../src/data/kb-skills.json');
const { synergies } = require('../src/data/kb-synergies.json');

// Scope grows only when the underlying notes have been manually reviewed.
for (const id of ['1265385', '1265386', '1265387', '1247227', '32645', '703', '385627', '1329', '360194', '51723', '1943', '381627', '381797', '79134', '196861']) {
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
assert.equal(skills['703'].cooldown, '기본 6초');
assert.equal(skills['32645'].resourceCost, '기력 35 + 연계 점수');
assert.equal(skills['1943'].resourceCost, '기력 25 + 연계 점수');
assert.equal(skills['385627'].resourceCost, '기력 35');
assert.equal(skills['51723'].range, '자신 주위 8미터');
assert.match(skills['360194'].description, /같은 시간 동안 총 기력 80/);
assert.match(skills['360194'].description, /75%/);
assert.match(skills['385627'].description, /20%씩, 최대 1000%/);
assert.match(skills['381797'].description, /치명타 확률을 8%/);
assert.match(skills['79134'].description, /추가 출혈에서는 회복량이 감소/);
assert.match(skills['381627'].description, /급소 가격과 파열 사용/);
assert.match(skills['196861'].description, /목조르기 연마 지속 중/);
const cooldown = synergies.rogue_assassination_deathmark_kingsbane;
assert.equal(cooldown.patch, '12.1');
assert.equal(cooldown.spec, 'Assassination');
assert.match(cooldown.description, /치명독을 두 번 적용/);
assert.deepEqual(cooldown.participants, ['360194', '385627', '32645', '703', '1943', '1265385', '1265386', '1265387']);
for (const id of cooldown.participants) assert.ok(skills[id], id);
const vault = path.resolve(__dirname, '../../WoW-Meta-Knowledge');
if (fs.existsSync(vault)) {
  const note = id => fs.readFileSync(path.resolve(__dirname, '../..', skills[id].source.kbPath.replaceAll('\\', '/')), 'utf8');
  assert.match(note('1265385'), /연계 점수 1점당 기력 2/);
  assert.match(note('1265386'), /자연 및 출혈 능력의 피해를 10%/);
  assert.match(note('1265387'), /각 공격은 무기의 치명독을 적용하고 연계 점수 1점/);
  assert.match(note('1247227'), /최대 두 명의 다른 적에게 복제/);
}
console.log('Assassination reviewed subset: 15 atomic notes and the Deathmark relationship passed');
