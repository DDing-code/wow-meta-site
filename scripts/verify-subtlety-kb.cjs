const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { skills } = require('../src/data/kb-skills.json');
const { synergies } = require('../src/data/kb-synergies.json');

const reviewed = ['185313', '121471', '280719', '196912', '58423', '426594', '426591',
  '382505', '382524', '1268932', '1268936', '1268939', '185314', '1279444',
  '53', '185438', '196819', '319175', '76808', '197835', '1279401',
  '91023', '319949', '319951', '382511', '382512', '1265952', '1264764',
  '343160', '196976', '394320'];
for (const id of reviewed) {
  assert.equal(skills[id]?.patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Subtlety'], id);
  assert.ok(skills[id].description.length > 70, id);
  assert.ok(!skills[id].description.startsWith('#'), id);
}
assert.equal(skills['426591'].castTime, '즉시');
assert.equal(skills['426591'].resourceCost, '기력 25');
assert.equal(skills['426591'].cooldown, '기본 45초');
assert.match(skills['426591'].description, /추가 적 2명.*14초.*20%.*균등/);
assert.equal(skills['196912'].type, 'passive');
assert.match(skills['196912'].description, /28%.*기력 5.*저장.*10점/);
assert.match(skills['58423'].description, /1점당 기력 4.*점수당 5를 사용하지/);
assert.match(skills['426594'].description, /25%.*1점.*25%p.*아니다/);
assert.match(skills['382505'].description, /비전투.*6초.*4초/);
assert.match(skills['382524'].description, /표창 폭풍.*50%.*2.8%/);
assert.match(skills['1268932'].description, /중첩 하나당 15%.*50%/);
assert.match(skills['1268936'].description, /1등급.*5%.*50%.*2등급/);
assert.match(skills['1268939'].description, /공격을 사용한 뒤에도.*5개 이상.*다음 공격 마무리/);
assert.match(skills['185314'].description, /가속의 150%.*항상 0초.*아니다/);
assert.match(skills['185313'].description, /6초.*위협.*20초.*1회/);
assert.match(skills['121471'].description, /16초.*20%.*두 배.*90초/);
assert.equal(skills['280719'].resourceCost, '기력 30 + 연계 점수');
assert.match(skills['280719'].description, /세 부분.*물리.*25초.*가속/);
assert.match(skills['1279444'].description, /피해를 15%.*지속 효과/);
assert.equal(skills['53'].resourceCost, '기력 40');
assert.match(skills['53'].description, /1점.*뒤.*20%/);
assert.equal(skills['185438'].resourceCost, '기력 50');
assert.match(skills['185438'].description, /2점.*25미터.*25%.*실제 은신/);
for (const id of ['196819', '319175']) {
  assert.equal(skills[id].resourceCost, '기력 35 + 연계 점수');
  assert.match(skills[id].description, /30%.*암흑/);
}
assert.match(skills['319175'].description, /8명.*감소.*8명까지만.*아니다/);
assert.equal(skills['197835'].castTime, '즉시');
assert.equal(skills['197835'].resourceCost, '기력 50');
assert.equal(skills['197835'].icon, 'ability_rogue_shurikenstorm');
assert.equal(skills['1279401'].type, 'passive');
assert.equal(skills['1279401'].icon, 'ability_rogue_shuriken-storm');
assert.match(skills['1279401'].description, /은신.*100%.*지속 효과/);
assert.equal(skills['76808'].type, 'passive');
for (const id of ['91023', '319949', '319951', '382511', '382512',
  '1265952', '1264764', '343160', '196976', '394320']) {
  assert.equal(skills[id].type, 'talent', id);
  assert.equal(skills[id].castTime, '지속 효과', id);
}
assert.match(skills['76808'].description, /19.6%.*특화 수치에 따라/);
assert.match(skills['91023'].description, /10초.*30%.*파티원.*아니다/);
assert.match(skills['319949'].description, /15%.*뒤.*치명타.*10초/);
assert.match(skills['319951'].description, /15%.*치명타.*10초/);
assert.match(skills['382511'].description, /절개와 검은 화약.*30%.*은밀한 기술.*확대하지/);
assert.match(skills['382512'].description, /방어도를 추가로 20%.*곧바로 20%.*아니다/);
assert.match(skills['1265952'].description, /5점 이상.*특화의 20%.*고정 20%.*아니다/);
assert.match(skills['1264764'].description, /15% 확률.*50%.*지속 특성/);
assert.match(skills['343160'].description, /다음 연계 점수 생성 능력이 최대 연계 점수/);
assert.match(skills['196976'].description, /3초에 걸쳐.*30.*즉시.*아니/);
assert.match(skills['394320'].description, /1점.*5%.*5점을 초과/);
assert.equal(skills['5171'], undefined, 'Obsolete Slice and Dice must not return to the active DB');
assert.ok(skills['315496'].specs.includes('Subtlety'));
assert.ok(skills['51667'].specs.includes('Subtlety'));
const manuscript = fs.readFileSync(path.join(__dirname, '../src/data/guideManuscripts.js'), 'utf8');
assert.doesNotMatch(manuscript, /skillId:\s*['"]5171['"]/);
assert.doesNotMatch(manuscript, /skillId:\s*['"]1279401['"]/);
for (const id of ['rogue_subtlety_secret_technique_ancient_arts',
  'rogue_subtlety_shadowblades_dance', 'rogue_subtlety_goremaw_finishers',
  'rogue_subtlety_shuriken_blackpowder', 'rogue_subtlety_slice_shadowblades_resource',
  'rogue_subtlety_eviscerate_mastery_finisher']) {
  const relation = synergies[id];
  assert.equal(relation?.patch, '12.1', id);
  assert.equal(relation.spec, 'Subtlety', id);
  assert.ok(relation.description.length > 70, id);
  for (const spell of relation.participants) assert.ok(skills[spell]?.specs.includes('Subtlety'), spell);
}
assert.ok(synergies.rogue_subtlety_slice_shadowblades_resource.participants.includes('315496'));
assert.ok(synergies.rogue_subtlety_slice_shadowblades_resource.participants.includes('51667'));
for (const relation of Object.values(synergies)) {
  assert.ok(!relation.participants.includes('5171'), relation.id);
}
console.log('Subtlety core: 31 records and six relationships passed; obsolete Slice and Dice excluded. Remaining talents, hero/season data and full manuscript review are not covered.');
