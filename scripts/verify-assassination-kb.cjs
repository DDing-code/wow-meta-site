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
for (const id of ['255544', '423054', '381673']) {
  assert.equal(skills[id]?.patch, '12.1', id);
  assert.equal(skills[id].type, 'talent', id);
  assert.equal(skills[id].cooldown, '없음', id);
}
assert.match(skills['255544'].description, /연계 점수 1점당 5%/);
assert.match(skills['255544'].description, /2초/);
assert.match(skills['423054'].description, /최대 기력이 50 증가/);
assert.match(skills['381673'].description, /절단이 8초에 걸쳐 25%의 추가 출혈/);
const cooldown = synergies.rogue_assassination_deathmark_kingsbane;
const addedTalents = {
  '1247993': ['의욕 충만한 학살자', /회복 속도가 20%/],
  '1250359': ['약삭빠른 공격', /치명타 확률이 2%/],
  '1249809': ['끝맺음', /죽음표식.*모든 피해가 10%/],
  '1292996': ['협상의 여지', /대상이 죽으면 남은 지속시간/],
  '1250036': ['경외의 일격', /이미 활성화.*모든 피해를 5%/],
  '1250318': ['독술사의 결심', /이미 활성화.*연계 점수 1점/],
  '1250358': ['박리', /파열의 피해가 25%/],
  '1249802': ['서슬 교살줄', /목조르기의 지속시간이 6초/],
  '1298812': ['불안정한 독소', /18%.*2초 감소/],
  '1250325': ['시해의 보상', /끝나면.*중첩 5개당.*2%.*2초마다/],
  '1250141': ['보조 독', /단일 대상 공격.*50%.*같은 무기 독/],
};
for (const [id, [name, effect]] of Object.entries(addedTalents)) {
  assert.equal(skills[id]?.name, name, id);
  assert.equal(skills[id].patch, '12.1', id);
  assert.equal(skills[id].type, 'talent', id);
  assert.ok(skills[id].specs.includes('Assassination'), id);
  assert.match(skills[id].description, effect, id);
}
const poison = synergies.rogue_assassination_envenom_poison_finisher;
assert.equal(poison.patch, '12.1');
assert.equal(poison.spec, 'Assassination');
assert.deepEqual(poison.participants, ['32645', '2823', '381664', '455072', '1250036', '1250318', '1298812', '1265385']);
assert.match(poison.description, /선택한 갱신 특성/);
assert.match(poison.description, /만료를 기다리는 보상이 아니다/);
for (const id of ['2823', '381664']) {
  assert.equal(skills[id]?.patch, '12.1', id);
  assert.equal(skills[id].type, 'atomic-skill', id);
  assert.equal(skills[id].castTime, '1.5초', id);
  assert.match(skills[id].description, /1시간/, id);
}
assert.match(skills['2823'].description, /30%.*12초/);
assert.match(skills['381664'].description, /20중첩.*10중첩.*35%/);
const poisonEffects = {
  '381801': /치명독과 비치명독.*각각 1개.*30% 감소/,
  '455072': /독살 효과가 활성화.*1등급.*20%.*2등급/,
  '381798': /35% 미만.*1등급.*15%.*2등급/,
  '381799': /파열.*1등급.*2%.*20%.*2등급/,
  '381640': /자신의 치명독 또는 지속 피해.*1등급.*1%.*2등급/,
  '423136': /35% 미만.*150%를 초과/,
  '381632': /은신 중.*6초.*50%/,
};
for (const [id, effect] of Object.entries(poisonEffects)) {
  assert.equal(skills[id]?.patch, '12.1', id);
  assert.match(skills[id].description, effect, id);
}
const retiredIds = ['394983', '400783', '381802', '255989', '381800', '385424', '381634'];
for (const id of retiredIds) {
  assert.equal(skills[id], undefined, 'Removed talent still in current DB: ' + id);
  for (const relation of Object.values(synergies)) {
    assert.ok(!relation.participants?.includes(id), relation.id + ': retired participant ' + id);
  }
}
const talentEffects = {
  '421975': /한 대상에게 10초.*자연 피해의 20%/,
  '14190': /치명타로 적중할 때마다 연계 점수 1점/,
  '328085': /10%.*35% 미만.*20%/,
  '381652': /매복과 절단의 피해가 30%/,
  '381631': /반경이 12미터.*20%.*5명.*10%/,
  '381624': /독의 적용 확률이 5%/,
  '381630': /그림자 밟기의 재사용 대기시간이 33%/,
  '385478': /피해가 30%.*은신 상태.*연계 점수 2점/,
  '381629': /치명타 확률이 5%.*치명타로 적중/,
  '392384': /무기에 바르는 독의 피해가 20%/,
  '381626': /목조르기와 파열의 피해가 15%/,
  '457512': /최대 연계 점수가 1점.*마무리 일격의 피해가 5%/,
};
for (const [id, effect] of Object.entries(talentEffects)) {
  assert.equal(skills[id]?.patch, '12.1', id);
  assert.equal(skills[id].type, 'talent', id);
  assert.ok(skills[id].specs.includes('Assassination'), id);
  assert.match(skills[id].description, effect, id);
}
assert.deepEqual(skills['8676'].specs, ['Assassination', 'Outlaw']);
assert.equal(skills['8676'].resourceCost, '기력 50');
assert.match(skills['8676'].description, /연계 점수 2점/);
const builder = synergies.rogue_assassination_builder_combo_points;
assert.equal(builder.patch, '12.1');
assert.equal(builder.name, '절단·매복: 발동에 맞춘 연계 점수 수급');
assert.equal(builder.spec, 'Assassination');
assert.deepEqual(builder.participants, ['1329', '8676', '328085', '14190', '381652', '703', '32645']);
assert.match(builder.description, /운명의 낙인으로 추가 연계 점수/);
const caustic = synergies.rogue_assassination_caustic_kingsbane;
assert.equal(caustic.patch, '12.1');
assert.equal(caustic.name, '부식성 분사: 한 대상의 자연 피해를 주변으로');
assert.equal(caustic.spec, 'Assassination');
assert.deepEqual(caustic.participants, ['421975', '385627', '32645', '360194']);
assert.match(caustic.description, /자연 피해의 20%가 주변의 다른 적/);
for (const relation of [builder, caustic]) {
  for (const id of relation.participants) {
    assert.ok(skills[id]?.specs.includes('Assassination'), id);
  }
}
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
console.log('Assassination reviewed subset: 51 atomic notes, 4 relationships, 7 retired talents passed');
