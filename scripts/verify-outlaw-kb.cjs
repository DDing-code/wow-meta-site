const assert = require('node:assert/strict');
const { skills } = require('../src/data/kb-skills.json');
const { synergies } = require('../src/data/kb-synergies.json');

const reviewed = ['315508', '315341', '51690', '13750', '2098', '79096',
  '1259480', '1277933', '1265861', '1265862', '1265863', '1256630',
  '193315', '185763', '13877', '271877', '279876', '381846', '196938', '381878', '272026', '1259469',
  '381989', '256170', '1259481', '14161', '235484', '381828', '381839', '381845',
  '381885', '381990', '383281', '394321', '395422', '428377', '1259457', '1259485',
  '1259492', '1259498', '1259499', '1259612', '35551', '61329', '76806', '195457',
  '196922', '256165', '256188', '381619', '381877', '1259465', '1296588', '1296589'];
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
assert.equal(skills['381989'].castTime, '즉시');
assert.equal(skills['381989'].cooldown, '기본 6분');
assert.match(skills['381989'].description, /남은 지속시간을 30초.*직접 사용/);
assert.match(skills['256170'].description, /다음 뼈주사위.*1단계/);
assert.match(skills['381828'].description, /4점.*1등급.*3%.*2등급/);
assert.match(skills['381990'].description, /1등급.*15%.*3.*2등급.*50%/);
assert.match(skills['383281'].description, /100%.*같다는 뜻.*확정 발동.*아니다/);
assert.match(skills['395422'].description, /얻을 때.*최대치/);
assert.match(skills['1259612'].description, /15점.*4초.*200%.*5초.*다시 연계 점수를 소비/);
assert.equal(skills['76806'].type, 'passive');
assert.equal(skills['195457'].range, '40미터');
assert.equal(skills['195457'].cooldown, '기본 45초');
assert.match(skills['256188'].description, /45초.*30초/);
assert.match(skills['1259465'].description, /15초.*19초/);
const manuscriptValidator = require('node:fs').readFileSync(require('node:path').join(__dirname, 'validate-guide-manuscripts.js'), 'utf8');
for (const id of ['381989', '1277933']) assert.ok(!manuscriptValidator.includes(`'rogue-outlaw:${id}'`), `Active talent ${id} must not be blacklisted as a passive chart node`);
assert.match(synergies.rogue_outlaw_generator_proc_loop.description, /권총 사격 자체가 아니라.*마무리 일격/);
for (const id of ['rogue_outlaw_adrenaline_finishers', 'rogue_outlaw_roll_preparation_reset',
  'rogue_outlaw_generator_proc_loop', 'rogue_outlaw_blade_flurry_cleave']) {
  assert.equal(synergies[id]?.patch, '12.1', id);
  assert.equal(synergies[id].spec, 'Outlaw', id);
  assert.ok(synergies[id].description.length > 60, id);
  for (const spell of synergies[id].participants) assert.ok(skills[spell]?.specs.includes('Outlaw'), spell);
}
const trickster = ['441146', '441247', '441250', '441263', '441273', '441274',
  '441321', '441346', '441359', '441367', '441398', '441403', '441415', '441423',
  '441429', '1276626', '1276630', '1276679'];
for (const id of trickster) {
  assert.equal(skills[id]?.patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Outlaw', 'Subtlety'], id);
  assert.ok(skills[id].description.length > 70, id);
  assert.equal(skills[id].castTime, '지속 효과', id);
}
assert.match(skills['441321'].description, /무법.*4%.*잠행.*2%/);
assert.match(skills['441367'].description, /무법.*25%.*잠행.*7명.*50%/);
assert.match(skills['441429'].description, /무법은 추가 1중첩.*잠행은 추가 2중첩/);
assert.match(skills['441423'].description, /4번.*속결.*절개.*5점.*별도 사용 버튼이 아니라/);
assert.match(skills['1276679'].description, /권총 사격.*20%.*표창 폭풍.*10%/);
assert.match(skills['1296588'].description, /속결 피해가 15%/);
assert.match(skills['1296589'].description, /사악한 일격과 매복.*20%.*자원 소모 없이.*최대 연계 점수/);
for (const id of ['1296588', '1296589']) assert.equal(skills[id].type, 'passive');
const heroRelationships = ['rogue_outlaw_trickster_unseen_coup',
  'rogue_subtlety_trickster_unseen_coup', 'SY-ROGUE-HERO-TRICKSTER-UNSEEN-BLADE-COUP',
  'rogue_outlaw_season2_dispatch'];
for (const id of heroRelationships) {
  const relation = synergies[id];
  assert.equal(relation?.patch, '12.1', id);
  assert.ok(relation.description.length > 70, id);
  for (const spell of relation.participants) {
    assert.ok(skills[spell], spell);
    for (const spec of relation.specs) assert.ok(skills[spell].specs.includes(spec), `${id}:${spell}:${spec}`);
  }
  assert.ok(!relation.participants.includes('1276816'), 'Fatebound talent must not be attached to Trickster');
}
const fatebound = ['452536', '453428', '453457', '454286', '454419', '454432', '454433',
  '454435', '1248970', '1249190', '1249194', '1249201', '1249204', '1249215', '1276809', '1276816', '1277030'];
for (const id of fatebound) {
  assert.equal(skills[id]?.patch, '12.1', id);
  assert.deepEqual([...skills[id].specs].sort(), ['Assassination', 'Outlaw'], id);
  assert.ok(skills[id].description.length > 70, id);
}
assert.match(skills['1249190'].description, /무법.*4%.*암살.*15%/);
assert.match(skills['1249204'].description, /무법.*기력 2.*기력 10.*암살.*5와 15/);
assert.match(skills['453457'].description, /무법.*아드레날린 촉진.*암살.*죽음표식/);
assert.match(skills['1276816'].description, /4회.*끝나면.*방금 나온 면/);
assert.match(skills['1248970'].description, /7번.*12초.*포함되지 않는다/);
for (const id of ['rogue_outlaw_fatebound_dispatch', 'SY-ROGUE-HERO-FATEBOUND-HAND-COIN']) {
  const relation = synergies[id];
  assert.equal(relation?.patch, '12.1', id);
  assert.ok(relation.participants.includes('1276816'), id);
  for (const spell of relation.participants) for (const spec of relation.specs) {
    assert.ok(skills[spell]?.specs.includes(spec), `${id}:${spell}:${spec}`);
  }
}
const common = ['315496', '51667', '193531', '14983', '193539', '470347'];
for (const id of common) {
  assert.equal(skills[id]?.patch, '12.1', id);
  assert.deepEqual([...skills[id].specs].sort(), ['Assassination', 'Outlaw', 'Subtlety'], id);
  assert.ok(skills[id].description.length > 70, id);
}
assert.equal(skills['315496'].resourceCost, '기력 25 + 연계 점수');
assert.match(skills['315496'].description, /50%.*12초.*36초.*42초.*48초/);
assert.equal(skills['51667'].type, 'passive');
assert.match(skills['51667'].description, /암살의 독살.*무법의 속결.*잠행의 절개.*3초/);
for (const id of ['14983', '193539', '470347']) assert.match(skills[id].description, /1등급.*2등급/);
assert.match(skills['1296589'].description, /시뮬레이터.*차감 0.*효과상.*로그 검증을 대신하지 않는다/);
assert.equal(synergies['SY-ROGUE-COMMON-SLICE-DICE-CUT-CHASE-FINISHERS'].patch, '12.1');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/data/guideManuscripts.js'), 'utf8')
  .replace(/\bexport const\b/g, 'const').replace(/\bexport function\b/g, 'function')
  .replace(/export default [^;]+;/g, '');
const manuscript = new Function(source + '\nreturn guideManuscripts;')()['rogue-outlaw'];
const canonical = path.resolve(__dirname, '../../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/10-도적/무법/Meta/guide-12.1.json');
if (fs.existsSync(canonical)) assert.deepEqual(manuscript, JSON.parse(fs.readFileSync(canonical, 'utf8')));
assert.equal(manuscript.patch, '12.1');
assert.equal(manuscript.heroBranches.length, 2);
assert.equal(manuscript.blocks.length, 14);
for (const hero of manuscript.heroBranches) {
  for (const entries of [hero.opener.steps, hero.singleTarget.priority, hero.aoe.priority]) {
    assert.ok(entries.length >= 10, hero.label);
    for (const entry of entries) {
      assert.ok(skills[entry.skillId]?.specs.includes('Outlaw'), entry.skillId);
      assert.notEqual(skills[entry.skillId].castTime, '지속 효과', entry.skillId);
      assert.notEqual(skills[entry.skillId].type, 'passive', entry.skillId);
    }
  }
  assert.match(hero.singleTarget.priority.find(step => step.skillId === '315341').note, /6점/);
  assert.match(hero.singleTarget.priority.find(step => step.skillId === '2098').note, /세트/);
}
assert.match(JSON.stringify(manuscript.blocks), /기력.*점수/);
console.log(`Outlaw review: ${reviewed.length} local, ${trickster.length + fatebound.length} shared hero, ${common.length} common records; manuscript and six combat flows passed. Fresh log comparison remains pending.`);
