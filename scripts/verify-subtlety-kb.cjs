const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { skills } = require('../src/data/kb-skills.json');
const { synergies } = require('../src/data/kb-synergies.json');

const reviewed = ['185313', '121471', '280719', '196912', '58423', '426594', '426591',
  '382505', '382524', '1268932', '1268936', '1268939', '185314', '1279444',
  '53', '185438', '196819', '319175', '76808', '197835', '1279401',
  '91023', '319949', '319951', '382511', '382512', '1265952', '1264764',
  '343160', '196976', '394320', '1296592', '1296593'];
const supportEffects = {
  '426555': /공격 속도를 25%.*모든 능력/,
  '385722': /다음 표창 폭풍.*100%.*다음 한 번/,
  '428387': /3명 이상.*3초.*30%/,
  '382517': /암흑 피해를 8%.*옛 강화 버프.*0.5초/,
  '193537': /15% 확률.*50%.*암흑/,
  '382514': /8초.*이동 속도가 20% 증가.*피해가 10% 감소/,
  '277953': /이동 속도를 8초.*50%.*기절.*아니다/,
  '382506': /피해를 15%.*발동 확률.*5%/,
  '382015': /다음 2회.*35%/,
  '382503': /그림자 밟기.*20%.*사거리를 20%/,
  '1281468': /그림자.*15%.*비열한 습격.*급소 가격.*50%/,
  '382507': /아군 이동 속도를 100%.*벗어나도/,
  '394930': /충전 횟수를 1회.*2회.*두 배.*아니다/,
  '257505': /다음 비열한 습격.*자원을 소모하지.*재사용 대기시간을 무시/,
  '382515': /소멸.*6초.*18%/,
  '108209': /피해를 10%.*옛 기력 비용 감소.*설명하지/,
  '200758': /기습을 대체.*기력 40.*암흑.*1점.*치명타.*10초/,
  '382504': /확률을 10%.*자연에서 암흑.*암흑 피해를 10%/,
  '382017': /마법 피해를 5%.*물리.*아니다/,
  '382525': /1등급.*치명타 피해.*15%.*최대 2등급/,
  '382528': /서로 다른 공격.*추가 암흑.*반복.*아니다.*0.5초/,
  '469642': /1등급.*약점 포착.*어둠의 춤.*어둠의 칼날.*5%.*최대 2등급/,
  '245687': /1등급.*5%.*추가 5%.*최대 2등급/,
  '426563': /받는 치유.*8%.*피해 감소.*다른/,
  '382508': /치명타 피해 증가량을 10%.*확률.*아니다/,
  '382518': /약점 포착.*표창 폭풍.*그림자 일격.*10%/,
  '428486': /피해의 5%.*가득.*최대 생명력의 10%/,
};
reviewed.push(...Object.keys(supportEffects));
for (const [id, effect] of Object.entries(supportEffects)) {
  assert.match(skills[id]?.description || '', effect, id);
  assert.equal(skills[id].castTime, id === '200758' ? '즉시' : '지속 효과', id);
  assert.equal(skills[id].type, 'talent', id);
}
assert.equal(skills['200758'].resourceCost, '기력 40');
assert.equal(skills['200758'].range, '근접');
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
assert.match(skills['1296592'].description, /기습.*10.*100%.*표창 폭풍.*5.*60%.*어둠칼날/);
assert.match(skills['1296593'].description, /머무는 그림자.*절개와 검은 화약.*60%.*상시 60%.*아니며/);
for (const id of ['1296592', '1296593']) {
  assert.equal(skills[id].type, 'passive', id);
  assert.equal(skills[id].castTime, '지속 효과', id);
  assert.equal(skills[id].icon, 'trade_engineering', id);
}
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
const subtletyManuscript = manuscript.split("'rogue-subtlety': {")[1].split("'shaman-enhancement': {")[0];
const guide = JSON.parse(('{' + subtletyManuscript).trim().replace(/,$/, ''));
assert.deepEqual(guide.heroBranches.map(branch => branch.label), ['죽음추적자', '기만자']);
for (const branch of guide.heroBranches) {
  assert.ok(branch.opener.steps.length >= 6, branch.label);
  for (const mode of ['singleTarget', 'aoe']) {
    assert.ok(branch[mode].priority.length >= 4, branch.label + mode);
    for (const step of branch[mode].priority) assert.ok(skills[step.skillId]?.specs.includes('Subtlety'), step.skillId);
  }
}
assert.equal(guide.heroBranches[0].singleTarget.priority[0].skillId, '196819');
assert.equal(guide.heroBranches[0].aoe.priority[0].skillId, '280719');
assert.equal(guide.heroBranches[1].singleTarget.priority[0].skillId, '280719');
assert.doesNotMatch(subtletyManuscript, /98\.3%|99\.7%|1100 가속|단일 전투 예외 선택지/);
assert.match(subtletyManuscript, /4세트는 머무는 그림자를 절개와 검은 화약에도 60% 효율/);
assert.match(subtletyManuscript, /https:\/\/www.wowhead.com\/spell=1296593/);
for (const id of ['rogue_subtlety_secret_technique_ancient_arts',
  'rogue_subtlety_shadowblades_dance', 'rogue_subtlety_goremaw_finishers',
  'rogue_subtlety_shuriken_blackpowder', 'rogue_subtlety_slice_shadowblades_resource',
  'rogue_subtlety_eviscerate_mastery_finisher', 'rogue_subtlety_shadowdance_shadowstrike',
  'rogue_subtlety_shadow_clones', 'rogue_subtlety_defensive_choices',
  'rogue_subtlety_season2_lingering_shadow', 'rogue_subtlety_hero_dance_entry']) {
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
const deathstalkerEffects = {
  '457057': /중첩.*소비.*그림자 밟기.*3초/,
  '1273035': /암살.*파열.*40%.*잠행.*검은 화약.*75%/,
  '457056': /죽음표식이 끝난 뒤.*자연.*30%.*어둠의 칼날이 끝난 뒤.*암흑.*30%/,
  '457034': /회피.*마법.*15%.*그림자 망토.*물리.*20%/,
  '457063': /은폐의 장막.*5초.*그림자 망토.*아닙니다/,
  '457054': /자동 공격.*역병.*전투력의 10%.*복사.*아닙니다/,
  '457062': /독살 2회.*18%.*절개 또는 검은 화약 1회.*15%/,
  '457022': /그림자 망토.*2초.*은폐의 장막.*아니며/,
  '1273017': /적용할 때 30%.*즉시 소비.*모든 마무리.*아닙니다/,
  '1272989': /치명타 피해 증가량.*20%.*치명타 확률.*아닙니다/,
  '1248785': /암살.*파열.*20%.*잠행.*징표.*25%/,
  '457068': /파열.*2명.*30%.*잠행.*약점 포착.*15%/,
};
for (const [id, effect] of Object.entries(deathstalkerEffects)) {
  assert.match(skills[id]?.description || '', effect, id);
  assert.equal(skills[id].cooldown, '없음', id);
}
for (const id of [...Object.keys(deathstalkerEffects), '457052', '457058',
  '457055', '1248793', '457067', '1248774']) {
  assert.equal(skills[id]?.patch, '12.1', id);
  assert.equal(skills[id].castTime, '지속 효과', id);
  assert.deepEqual(skills[id].specs, ['Assassination', 'Subtlety'], id);
  assert.ok(skills[id].description.length > 60, id);
}
for (const id of ['rogue_subtlety_deathstalker_mark_darkest_night',
  'SY-ROGUE-HERO-DEATHSTALKER-MARK']) {
  const relation = synergies[id];
  assert.equal(relation?.patch, '12.1', id);
  assert.ok(relation.description.length > 70, id);
  for (const spell of relation.participants) assert.ok(skills[spell]?.specs.includes('Subtlety'), spell);
}
assert.match(synergies.rogue_subtlety_season2_lingering_shadow.description, /60%/);
assert.match(skills['441146'].description, /잠행.*그림자 일격/);
assert.match(synergies.rogue_subtlety_shuriken_blackpowder.description, /2대상.*강력한 가루.*절개.*3대상.*검은 화약/);
const utilityEffects = {
  '31224': /5초.*해로운 주문.*모든 물리 피해.*무조건/,
  '5277': /10초.*회피율.*100%.*회피 판정/,
  '31230': /7%.*3초.*85%.*6분/,
  '1766': /같은 계열.*6초.*15초/,
  '57934': /30초 이내.*6초.*100야드.*도둑의 배짱 조건부/,
  '6770': /은신.*기력 35.*10야드.*비전투.*피해.*해제/,
  '2094': /15야드.*1분.*방향 감각 상실.*2분/,
  '185311': /기력 20.*20%.*4초에 걸쳐.*30초/,
};
for (const [id, effect] of Object.entries({
  '79008': /회피.*20%.*교란.*비광역.*20%/,
  '193546': /진홍색 약병.*치유 물약.*생명석.*25%.*모든 아군 치유.*아니다/,
  '393970': /소멸.*6초.*30%.*일반 은신.*어둠의 춤.*아니다/,
  '1267220': /20% 확률.*20%.*한국어.*마법 피해.*영어.*모든 피해.*추가 확인/,
  '378803': /급소 가격.*비열한 습격.*혼절시키기.*혼란.*기력.*20%.*소멸.*바꾸지도/,
  '382513': /소멸.*충전.*1회.*2회.*절반.*아니다/,
  '108208': /잠행 2초.*암살 3초.*무법.*표시되지/,
  '423662': /은폐의 장막.*50%.*그림자 망토.*소멸.*아니다/,
  '423647': /교란.*충전.*1회.*2회.*은신.*아니다/,
})) {
  assert.match(skills[id]?.description || '', effect, id);
  assert.equal(skills[id].patch, '12.1', id);
  assert.equal(skills[id].castTime, '지속 효과', id);
}
const commonDefense = synergies['SY-ROGUE-COMMON-FEINT-EVASION-CLOAK-DEFENSE'];
assert.match(skills['108208'].description, /최대 2등급.*최종 지속 시간.*단정하지/);
assert.ok(skills['108208'].specs.includes('Outlaw'));
assert.equal(commonDefense.patch, '12.1');
for (const id of ['79008', '193546', '393970', '1856']) assert.ok(commonDefense.participants.includes(id), id);
for (const id of ['14983', '193539']) assert.ok(!commonDefense.participants.includes(id), id);
for (const [id, effect] of Object.entries(utilityEffects)) {
  assert.match(skills[id]?.description || '', effect, id);
  assert.equal(skills[id].patch, '12.1', id);
  assert.equal(skills[id].castTime, id === '31230' ? '지속 효과' : '즉시', id);
  for (const spec of ['Assassination', 'Outlaw', 'Subtlety']) {
    assert.ok(skills[id].specs.includes(spec), id + spec);
  }
}
assert.doesNotMatch(JSON.stringify(guide.blocks), /차트 배치|차트는 마지막|본문 다음에.*차트/);
const page = fs.readFileSync(path.join(__dirname, '../src/pages/GuideDetailPage.js'), 'utf8');
assert.doesNotMatch(page, /'rogue-subtlety':\s*\{/);
assert.match(page, /'rogue-subtlety'\]\.includes\(guide.id\)\) return plan/);
assert.match(page, /if \(guide.id === 'rogue-subtlety'\) return \[\];/);
console.log('Subtlety: 60 local records, 18 shared Deathstalker records, eight common utilities, 13 relationships and six hero-specific rotation views passed. Remaining common talents and live log evidence are not covered.');
