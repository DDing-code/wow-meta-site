const assert = require('node:assert/strict');
const { skills } = require('../src/data/kb-skills.json');
const { synergies } = require('../src/data/kb-synergies.json');

const reviewed = ['185313', '121471', '280719', '196912', '58423', '426594', '426591',
  '382505', '382524', '1268932', '1268936', '1268939', '185314', '1279444'];
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
for (const id of ['rogue_subtlety_secret_technique_ancient_arts',
  'rogue_subtlety_shadowblades_dance', 'rogue_subtlety_goremaw_finishers']) {
  const relation = synergies[id];
  assert.equal(relation?.patch, '12.1', id);
  assert.equal(relation.spec, 'Subtlety', id);
  assert.ok(relation.description.length > 70, id);
  for (const spell of relation.participants) assert.ok(skills[spell]?.specs.includes('Subtlety'), spell);
}
console.log('Subtlety core: 14 records and three relationships passed. Remaining talents, hero/season data and full manuscript review are not covered.');
