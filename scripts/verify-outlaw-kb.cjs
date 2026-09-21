const assert = require('node:assert/strict');
const { skills } = require('../src/data/kb-skills.json');
const { synergies } = require('../src/data/kb-synergies.json');

const reviewed = ['315508', '315341', '51690', '13750', '2098', '79096',
  '1259480', '1277933', '1265861', '1265862', '1265863', '1256630',
  '193315', '185763', '13877', '271877', '279876', '381846', '196938', '381878', '272026', '1259469'];
for (const id of reviewed) {
  assert.equal(skills[id]?.patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Outlaw'], id);
  assert.ok(skills[id].description.length > 70, id);
  assert.ok(!/^#|기술별 상이/.test(skills[id].description), id);
}
assert.equal(skills['315341'].range, '20미터');
assert.equal(skills['315341'].resourceCost, '기력 25 + 연계 점수');
assert.match(skills['315341'].description, /4%.*여러 번.*5점은 12초/);
assert.equal(skills['51690'].castTime, '정신 집중');
assert.equal(skills['51690'].resourceCost, '기력 45 + 연계 점수');
assert.match(skills['51690'].description, /0.5초.*연계 점수 1점/);
assert.equal(skills['79096'].type, 'passive');
assert.match(skills['79096'].description, /1점당.*1초.*마음가짐은 이 목록에 없다/);
assert.equal(skills['1277933'].name, '마음가짐');
assert.equal(skills['1277933'].castTime, '즉시');
assert.equal(skills['1277933'].cooldown, '4분');
assert.match(skills['1277933'].description, /뼈주사위와 도박의 연속은 초기화 목록에 없다/);
assert.match(skills['1259480'].description, /8초.*1%p/);
assert.equal(skills['1256630'].name, '위협적인 촉진');
assert.match(skills['1256630'].description, /아드레날린 촉진 중.*20%/);
assert.match(skills['1265861'].description, /45%.*2중첩/);
assert.match(skills['1265862'].description, /5점 이상.*불한당의 일격.*2등급/);
assert.match(skills['1265863'].description, /1점당 12%.*6발.*연계 점수 6점.*즉시 초기화/);
assert.match(skills['279876'].description, /50%.*100%/);
assert.equal(skills['271877'].cooldown, '기본 1분');
assert.match(skills['271877'].description, /5초에 걸쳐 기력 25.*주 대상이 아닌.*100%/);
assert.match(skills['13877'].description, /최대 5명.*10초.*4명.*28%/);
assert.match(skills['381846'].description, /1등급.*최대 2등급/);
assert.match(skills['381878'].description, /최초.*기본 비용 15가 45/);
assert.match(skills['272026'].description, /10초.*13초/);
assert.match(skills['1259469'].description, /28%.*36%/);
assert.match(synergies.rogue_outlaw_generator_proc_loop.description, /권총 사격 자체가 아니라.*마무리 일격/);
for (const id of ['rogue_outlaw_adrenaline_finishers', 'rogue_outlaw_roll_preparation_reset',
  'rogue_outlaw_generator_proc_loop', 'rogue_outlaw_blade_flurry_cleave']) {
  assert.equal(synergies[id]?.patch, '12.1', id);
  assert.equal(synergies[id].spec, 'Outlaw', id);
  assert.ok(synergies[id].description.length > 60, id);
  for (const spell of synergies[id].participants) assert.ok(skills[spell]?.specs.includes('Outlaw'), spell);
}
console.log('Outlaw reviewed subset: 22 records and 4 relationships passed; full guide audit remains pending');
