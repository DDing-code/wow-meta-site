const assert = require('node:assert/strict');
const { skills } = require('../src/data/kb-skills.json');
const { synergies } = require('../src/data/kb-synergies.json');
const fs = require('node:fs');
const path = require('node:path');
assert.deepEqual(skills[51886].specs, ['Elemental', 'Enhancement']);
assert.deepEqual(skills[77130].specs, ['Restoration']);
assert.deepEqual(skills[383016].specs, ['Restoration']);
assert.match(skills[77130].description, /마법.*383016.*저주.*1.3%/);
assert.match(skills[51886].description, /저주.*40야드.*8초.*10%/);
assert.match(skills[108271].description, /2분.*12초.*40%/);
assert.match(skills[57994].description, /30야드.*4초.*12초/);
for (const id of [51886, 77130, 383016, 108271, 57994]) assert.equal(skills[id].patch, '12.1');
for (const relation of Object.values(synergies)) {
  if (relation.specs?.length === 1 && ['Elemental', 'Enhancement'].includes(relation.specs[0])) {
    assert.ok(!relation.participants.includes('77130'), relation.id + ': Restoration-only dispel');
  }
}
for (const id of [1296627, 1296628]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Enhancement']);
  assert.equal(skills[id].castTime, '지속 효과');
}
assert.match(skills[1296627].description, /6초.*2초.*200%.*모든 대상.*적용하지/);
assert.match(skills[1296628].description, /2초.*8%.*5중첩.*40%/);
assert.deepEqual(synergies.shaman_enhancement_season2_blaze_crash.participants, ['470057', '1260666', '1296627', '1296628', '187874']);

for (const [id, pattern] of Object.entries({
  187880: /20%.*최대 5중첩.*번개 화살.*연쇄 번개.*20%.*20%/,
  384149: /최대 10중첩.*소비.*저장.*다른 특성/,
  384143: /저장 상한.*10중첩.*치유의 파도.*연쇄 치유.*10%.*10%.*최대 20중첩/,
  17364: /물리 피해.*7.5초.*1회.*0.4%/,
  60103: /보조 무기.*화염 피해.*18초.*0.16%.*불꽃혓바닥 무기.*100%/,
  469314: /세계의 분리.*불의.*파멸의 바람.*자연의.*8초.*5%.*직접 누르는.*아니다/,
  114051: /15초.*사용 특성.*60%.*30야드.*0.5%/,
  187874: /12초.*최대 5명.*나누어.*15초/,
  384352: /8초.*매초.*50%.*20%.*1분/,
  384444: /2초.*60초.*최대 10중첩.*100%.*최근/,
  1250364: /10%.*중첩 하나당.*0.3초.*10중첩.*3초/,
  197214: /전방.*30초.*1.2%.*기절.*효과가 없다/,
  201900: /5%.*1등급.*8초.*25%.*20%.*최대 등급은 2/,
  334033: /6초.*자신의 화염 충격.*최대 5명.*18초.*12초/,
  334046: /용암 채찍과 세계의 분리.*화염 충격.*20초.*100%/,
  1218047: /15초.*한 번.*특성.*1218047.*1218090/,
  1218090: /15초.*한 번.*0.8%.*100%.*150%.*추가 검증/,
  382888: /다음 3회.*15%.*Flurry.*382888.*Tempest.*454009/,
  1262635: /20%.*20%.*반환.*35%.*2중첩.*다른 효과/,
  1262713: /중첩 하나당 2%.*낙뢰.*무시.*겹칠/,
  1262761: /1등급.*8%.*10%.*최대 2등급/,
  1252373: /2초.*50%.*2회.*자동 공격 속도.*15%.*전체 가속.*아니다/,
  115356: /승천.*30미터.*물리 피해.*7.5초.*1회.*60%.*3초/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Enhancement'], id);
  assert.match(skills[id].description, pattern, id);
}
assert.equal(skills[187880].castTime, '지속 효과');
assert.equal(skills[17364].castTime, '즉시');
assert.equal(skills[60103].castTime, '즉시');
assert.equal(skills[114051].castTime, '즉시');
assert.equal(skills[114051].icon, '8026696');
assert.equal(skills[469314].castTime, '지속 효과');
assert.equal(skills[1218047].castTime, '지속 효과');
assert.equal(skills[1218090].castTime, '즉시');
for (const [id, pattern] of Object.entries({
  454009: /고양.*중첩 하나당 2.00%.*정기.*0.30%.*반드시 발동하는 방식이 아니다/,
  455110: /정기.*과부하 피해가 10%.*고양.*35%.*2중첩.*모든.*소비 기술.*아니다/,
  455129: /고양.*폭풍의 일격.*정기.*추가 0.30%.*약 1.1회.*보장되는 발동.*해석하지/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Elemental', 'Enhancement'], id);
  assert.equal(skills[id].castTime, '지속 효과', id);
  assert.match(skills[id].description, pattern, id);
}
assert.notEqual(skills[382888].icon, skills[454009].icon);
assert.equal(skills[455097], undefined, 'Arc Discharge internal effect is not a second selectable talent');
assert.equal(skills[454029], undefined, 'Nature protection internal effect is not a second selectable talent');
assert.equal(skills[456369], undefined, 'Amplification Core buff is not a second selectable talent');
assert.equal(skills[445035].patch, '12.1');
for (const [id, pattern] of Object.entries({
  147051: /승천.*자동 공격.*30미터.*100%.*방어도를 무시/,
  33757: /주무기.*1시간.*15%.*2회.*3회/,
  201845: /폭풍의 일격.*5%.*초기화.*지속 효과/,
  1260666: /전격의 불길.*2중첩.*30%.*8미터.*6명/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Enhancement'], id);
  assert.match(skills[id].description, pattern, id);
}
assert.equal(skills[147051].castTime, '자동 공격');
assert.equal(skills[33757].castTime, '즉시');
assert.equal(skills[201845].castTime, '지속 효과');
assert.equal(skills[1260666].castTime, '지속 효과');
assert.equal(skills[318038].patch, '12.1');
assert.equal(skills[318038].castTime, '즉시');
assert.deepEqual(skills[318038].specs, ['Elemental', 'Enhancement']);
assert.match(skills[318038].description, /1시간.*고양.*추가 화염 피해.*정기.*5%/);
for (const [id, pattern] of Object.entries({
  390370: /자신의 화염 충격.*용암 채찍.*2초/,
  382042: /세계의 분리.*12초.*15%.*5중첩/,
  319930: /추가 충전 1회.*폭풍쇄도.*25%.*2중첩/,
  1251026: /치명타 피해.*치명타 확률의 40%.*고정 40%.*아니다/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Enhancement'], id);
  assert.match(skills[id].description, pattern, id);
}
for (const [id, pattern] of Object.entries({
  210853: /폭풍의 일격.*20%.*폭풍의 일격과 용암 채찍.*1중첩.*100%/,
  384355: /활성화된 무기 강화 하나당.*화염·냉기·자연.*5%/,
  384363: /낙뢰.*다음 폭풍의 일격.*25%.*6중첩/,
  392352: /특화.*발동 확률 증가 효과.*150%.*최종 발동 확률.*아니다/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Enhancement'], id);
  assert.match(skills[id].description, pattern, id);
}
assert.equal(skills[204357], undefined, 'Use current PvE Ride the Lightning talent');
for (const relation of Object.values(synergies)) assert.ok(!relation.participants.includes('204357'), relation.id);
for (const [id, pattern] of Object.entries({
  1251069: /자연 능력.*치명타.*5초.*60%.*감속/,
  289874: /폭풍의 일격과 용암 채찍.*100%.*20%.*289874/,
  384450: /10중첩.*다음 폭풍의 일격 또는 용암 채찍.*25%.*1중첩/,
  384411: /파멸의 바람 또는 승천.*1초마다.*1중첩.*1등급.*최대 등급은 2/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Enhancement'], id);
  assert.match(skills[id].description, pattern, id);
}
for (const [id, pattern] of Object.entries({
  262647: /추가 발동 확률 10%.*피해 50%/,
  390288: /발동했을 때.*세 번째.*100%.*모든 근접 공격.*뜻은 아니다/,
  344357: /폭풍의 일격.*20%.*40%.*연쇄적으로/,
  334308: /연쇄 번개.*2명.*10%/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Enhancement'], id);
  assert.match(skills[id].description, pattern, id);
}
assert.deepEqual(skills[445035].specs, ['Enhancement', 'Restoration']);
assert.match(skills[445035].description, /뜨거운 손.*80%.*세계의 분리.*복원.*30%.*25%/);
assert.equal(skills[457481].patch, '12.1');
assert.deepEqual(skills[457481].specs, ['Restoration']);
assert.equal(skills[457481].castTime, '즉시');
assert.match(skills[457481].description, /445033.*방패.*1시간.*2%.*3초.*고양.*아니다/);
for (const id of ['453405', '453406', '453407', '453409']) {
  assert.equal(skills[id], undefined, 'Mote is not a selectable talent: ' + id);
  for (const relation of Object.values(synergies)) assert.ok(!relation.participants.includes(id), relation.id);
}
const hotHand = synergies.shaman_enhancement_hot_hand_lava_lash;
assert.equal(hotHand.patch, '12.1');
assert.match(hotHand.description, /용암 채찍.*8초.*활성화된.*0.20초.*0.3초/);
assert.ok(hotHand.participants.includes('445024'));
assert.equal(synergies.shaman_hero_totemic_surging_totem_common_hub.patch, '12.1');
assert.match(synergies.shaman_hero_totemic_surging_totem_common_hub.description, /티끌 효과 ID.*별도 선택 특성이 아니/);
for (const [id, pattern] of Object.entries({
  445028: /고양.*5%.*8%.*일정 확률.*300%.*복원.*3초/,
  1263288: /고양·복원.*특화.*2%.*단순히 2%.*설명하지/,
  445030: /승천.*치유의 해일 토템.*피해.*50%.*치유량 증가를 명시하지.*445029.*94874/,
  445031: /30초마다.*6%.*30초 지속.*피해 6% 감소.*다른/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Enhancement', 'Restoration'], id);
  assert.match(skills[id].description, pattern, id);
}
for (const [id, pattern] of Object.entries({
  445033: /고양.*25%.*100%.*복원.*1시간.*2%.*3초.*445032.*94866/,
  445036: /고양.*15%.*30%.*복원.*25%.*455590.*94881/,
  445026: /반경.*15%.*30%.*445027.*94859/,
  445027: /실제로 제거.*실제로 제어.*5초.*토템별로 20초.*445026.*94859/,
  445032: /고양.*18%.*복원.*10%.*445033.*94866/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Enhancement', 'Restoration'], id);
  assert.match(skills[id].description, pattern, id);
}
for (const [id, pattern] of Object.entries({
  445034: /고양.*용암 채찍.*8초.*전격의 불길.*5명.*복원.*정신의 고리 토템.*100%/,
  455590: /고양.*40미터.*세계의 분리.*125%.*복원.*대지생명.*15%/,
  1260874: /고양.*다음 용암 채찍.*150%.*한 번 더.*복원.*8%.*대지생명/,
  445029: /고양·복원.*쇄도하는 토템.*3%.*445029.*456369.*버프/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Enhancement', 'Restoration'], id);
  assert.match(skills[id].description, pattern, id);
}
for (const relation of Object.values(synergies)) {
  assert.ok(!relation.participants.includes('456369'), relation.id);
}
for (const [id, pattern] of Object.entries({
  454021: /고양.*5%.*10%.*정기.*각각 5%/,
  454022: /폭풍.*5초.*20%.*467778.*94863.*동시에/,
  454027: /번개 보호막.*3%.*454372.*94880.*동시에/,
  454372: /1064.*8004.*16%.*80%.*454027.*94880/,
  467778: /5초.*50%.*야외.*100%.*윤회.*천둥폭풍.*454022.*94863/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Elemental', 'Enhancement'], id);
  assert.match(skills[id].description, pattern, id);
}
for (const [id, pattern] of Object.entries({
  455088: /6초.*미해석 수식.*확정하지/,
  455123: /고양.*8초.*8%.*정기.*10%.*차이/,
  454919: /고양.*낙뢰.*연쇄 번개.*20%.*정기.*지진.*5%/,
  454391: /15초.*가속.*1%.*한 번.*10중첩.*10%로 계산하지/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Elemental', 'Enhancement'], id);
  assert.match(skills[id].description, pattern, id);
}
const sharedStorm = synergies.shaman_hero_stormbringer_tempest_conductive_hub;
assert.equal(sharedStorm.patch, '12.1');
assert.ok(!sharedStorm.participants.includes('455097'));
assert.ok(sharedStorm.participants.includes('452201'));
assert.match(sharedStorm.description, /하강하는 하늘.*승천.*전격 방전.*고양.*정기/);
for (const [id, pattern] of Object.entries({
  454026: /고양.*파멸의 바람.*12초.*5%.*정기.*폭풍수호자.*15초/,
  455096: /고양.*연쇄 번개.*40%.*한 번 더.*2회.*정기.*폭풍수호자/,
  1264762: /고양.*질풍의 무기.*10%.*단일 적.*정기.*2초.*소용돌이 10/,
  1264688: /승천.*다음 번개 화살.*폭풍.*별개/,
  1264691: /정기.*2%.*고양.*6%/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Elemental', 'Enhancement'], id);
  assert.equal(skills[id].castTime, '지속 효과', id);
  assert.match(skills[id].description, pattern, id);
  assert.doesNotMatch(skills[id].description, /소용돌이 또는 소용돌이치는 무기 소비로 폭풍을 만들고 자연 피해를 강화한다/, id);
}
assert.equal(skills[452201].patch, '12.1');
assert.deepEqual(skills[452201].specs, ['Elemental', 'Enhancement']);
assert.equal(skills[452201].icon, skills[454009].icon);
assert.match(skills[452201].castTime, /2초.*소용돌이치는 무기/);
assert.match(skills[452201].description, /실제 시전.*452201.*454009.*8미터.*65%.*5명/);
for (const [id, pattern] of Object.entries({
  444995: /고양.*25초.*6초.*5명.*복원.*10%.*즉시 시전.*1분.*25초.*적용하지/,
  1260644: /용암 채찍.*10%.*활성화된 뜨거운 손.*0.20초.*10중첩.*2초.*복원.*치유의 토템.*3초/,
  445025: /일정 확률.*10%.*중첩.*복원.*20미터.*30미터.*2명.*확정 발동 주기가 아니다/,
  445024: /고양.*3발.*100%.*뜨거운 손.*8초.*복원.*50%.*40%.*150%/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Enhancement', 'Restoration'], id);
  assert.match(skills[id].description, pattern, id);
  assert.equal(skills[id].castTime, id === '444995' ? '즉시' : '지속 효과', id);
}
assert.match(skills[444995].cooldown, /고양 1분.*25초/);
assert.equal(skills[470057].patch, '12.1');
assert.deepEqual(skills[470057].specs, ['Elemental', 'Enhancement']);
assert.equal(skills[470057].castTime, '즉시');
assert.match(skills[470057].description, /추가 적 5명.*항상 치명타.*고양.*1중첩.*정기.*6.*10초/);
assert.equal(skills[115356].castTime, '즉시');
for (const id of ['shaman_enhancement_stormbringer_tempest', 'shaman_enhancement_totemic_surging_window']) {
  const relation = synergies[id];
  assert.equal(relation.patch, '12.1', id);
  assert.deepEqual(relation.specs, ['Enhancement'], id);
  for (const spell of relation.participants) assert.ok(skills[spell]?.specs.includes('Enhancement'), id + ': ' + spell);
  assert.doesNotMatch(relation.description, /차트|Archon|76.1%|53.6%|정기의 박자/, id);
}
const stormbringer = synergies.shaman_enhancement_stormbringer_tempest;
assert.ok(stormbringer.participants.includes('455129'));
assert.ok(!stormbringer.participants.includes('382888'), 'Flurry is not a Tempest proc talent');
assert.match(stormbringer.description, /2.00%.*별도 경로.*35%.*2중첩.*확정 순서가 아니/);
assert.match(synergies.shaman_enhancement_totemic_surging_window.description, /용암 채찍.*8초.*활성화된.*0.20초.*정기의 속도.*0.3초/);
assert.deepEqual(skills[378270].specs, ['Enhancement', 'Restoration']);
assert.match(skills[378270].description, /0.6%.*6초.*2초.*복원.*7%/);
assert.equal(skills[378270].patch, '12.1');
assert.equal(skills[51533], undefined);
for (const relation of Object.values(synergies)) assert.ok(!relation.participants.includes('51533'), relation.id);
const manuscript = fs.readFileSync(path.join(__dirname, '../src/data/guideManuscripts.js'), 'utf8');
const enhancement = manuscript.slice(manuscript.indexOf("  'shaman-enhancement': {"), manuscript.indexOf("  'shaman-elemental': {"));
assert.match(enhancement, /야수 정령은 직접 쓰는 스킬이 아닙니다/);
assert.doesNotMatch(enhancement, /야수 정령은 즉시 딜 스킬보다|야수 정령.*앞서 배치|최대 5명에게 복제|전체 복제 딜 구조/);
assert.match(enhancement, /승천은 파멸의 바람 버튼을 대체/);
assert.match(enhancement, /토림의 기원이 없는데도 같은 소비가 생긴다고 가정하지/);
assert.match(enhancement, /최신 채택률이나 현재 최적 빌드의 근거로 사용하지/);
assert.doesNotMatch(enhancement, /76\.1%|53\.6%|92\.6%|172\.5k|159\.9k|199\.8k/, 'Retired June statistics must not become current recommendations');
assert.match(enhancement, /Weber.*Method 12\.1/);
assert.match(enhancement, /하강하는 하늘을 선택하면 승천이 다음 번개 화살을 폭풍으로 강화/);
assert.doesNotMatch(enhancement, /첫 폭풍 시점은 달라지므로|첫 폭풍이 나오는 시점은 전투마다 다릅니다/);
assert.match(enhancement, /비공개 핀 글을 열람했다는 뜻은 아닙니다/);
assert.doesNotMatch(manuscript, /skillId: ['"](?:51533|469314)['"]/);
assert.doesNotMatch(manuscript, /skillId: ['"]1218047['"]/);
assert.doesNotMatch(manuscript, /skillId: ['"]454009['"]/);
const enhancementData = require('node:vm').runInNewContext('(' + enhancement.slice(enhancement.indexOf('{')).trim().replace(/,$/, '') + ')');
assert.equal(enhancementData.opener, enhancementData.heroBranches[0].opener, 'Default opener must reuse the reviewed Stormbringer flow');
assert.equal(enhancementData.priority, enhancementData.heroBranches[0].singleTarget.priority, 'Default priority must not retain the obsolete mixed-hero list');
assert.ok(!enhancementData.opener.steps.some(row => row.skillId === '187880'), 'Passive resource is not an opener button');
assert.doesNotMatch(JSON.stringify(enhancementData.blocks), /인포그래픽|별도 표시해야|디스펠 매트릭스/);
assert.equal(synergies.shaman_enhancement_sundering_primordial_opener.patch, '12.1');
assert.deepEqual(synergies.shaman_enhancement_sundering_primordial_opener.participants, ['197214', '1218047', '1218090', '187880']);
assert.match(synergies.shaman_enhancement_sundering_primordial_opener.description, /15초.*1218090.*1218047.*필수 조건이 아니다/);
assert.equal(synergies.shaman_enhancement_maelstrom_spender_loop.patch, '12.1');
assert.match(synergies.shaman_enhancement_maelstrom_spender_loop.description, /토림의 기원.*자동 소비/);
for (const mode of ['singleTarget', 'aoe']) {
  assert.ok(enhancementData.heroBranches[0][mode].priority.some(row => row.skillId === '452201'), 'Tempest cast must be available in both Stormbringer modes');
}
assert.match(manuscript, /skillIds: \['454009'/);
const heroFlows = enhancement.slice(enhancement.indexOf('heroBranches:'), enhancement.indexOf('    blocks:'));
const branches = JSON.parse(heroFlows.slice(heroFlows.indexOf('[')).trim().replace(/,$/, ''));
for (const branch of branches) {
  for (const mode of ['singleTarget', 'aoe']) {
    const rows = branch[mode].priority;
    assert.match(branch[mode].summary, /시즌 2 세트/, branch.label + ' ' + mode);
    assert.ok(rows.some(row => row.skillId === '17364' && /파멸의 바람/.test(row.label)));
    assert.ok(rows.some(row => row.skillId === '470057' && /2세트/.test(row.label + row.note)));
    for (const row of rows) assert.ok(skills[row.skillId]?.specs.includes('Enhancement'), row.skillId);
  }
}
const totemic = branches.find(branch => branch.label === '토템술사');
const openingIds = totemic.opener.steps.map(row => row.skillId);
assert.equal(openingIds[openingIds.indexOf('384352') + 1], '187874', 'Doom Winds opener uses Thorim automatic spending');
assert.ok(!openingIds.includes('188196'), 'Do not require manual Lightning Bolt inside Doom Winds');
for (const mode of ['singleTarget', 'aoe']) {
  const rows = totemic[mode].priority;
  assert.ok(rows.findIndex(row => row.skillId === '470057' && /2세트/.test(row.label)) < rows.findIndex(row => row.skillId === '188196' || row.skillId === '188443'));
}
for (const mode of ['opener', 'singleTarget', 'aoe']) assert.equal((heroFlows.match(new RegExp('"' + mode + '":', 'g')) || []).length, 2, mode);
assert.doesNotMatch(heroFlows, /76.1%|53.6%|92.6%/);
assert.match(heroFlows, /수동 승천.*토림의 기원/);
assert.match(heroFlows, /파멸의 바람.*휘몰아치는 정기.*토템의 기세/);
assert.ok(enhancementData.heroBranches.every(branch => branch.singleTarget.priority.some(row => row.skillId === '1218090')), 'Both selected-build branches must reference the actual Primordial Storm cast');
assert.match(synergies.shaman_enhancement_maelstrom_spender_loop.description, /기본 저장 상한.*5.*넘치는 소용돌이.*분노의 소용돌이.*치유용.*20.*10/);
assert.match(synergies.shaman_enhancement_doom_winds_ascendance_window.description, /직접 시전하지 않는 패시브.*승천.*대체/);
for (const id of ['370', '378773', '8143', '383013', '192058']) {
  assert.equal(skills[id].patch, '12.1');
  assert.equal(skills[id].castTime, '즉시');
}
assert.match(skills['378773'].description, /2개.*사용 특성.*패시브가 아니며/);
assert.match(skills['370'].description, /1개.*상급 정화.*같은 선택/);
assert.match(skills['8143'].description, /10초.*30미터.*공포·현혹·수면.*독 정화 토템.*같은 선택/);
assert.match(skills['383013'].description, /6초.*1.5초.*30미터.*독 효과.*진동의 토템.*같은 선택/);
assert.match(skills['192058'].description, /2초.*8미터.*3초/);
for (const id of ['58875', '79206', '192063', '192077', '108287', '192088', '378077', '381647', '462817']) {
  assert.equal(skills[id].patch, '12.1');
  assert.ok(skills[id].description.length > 60);
}
for (const id of ['58875', '79206', '192063', '192077', '108287']) assert.equal(skills[id].castTime, '즉시');
assert.match(skills['58875'].description, /8초.*60%.*돌풍.*같은 선택/);
assert.match(skills['192077'].description, /15초.*10미터.*5초.*40%/);
assert.match(skills['192088'].description, /30초.*20%.*90초.*영혼나그네의 보호.*같은 선택/);
assert.match(skills['378077'].description, /5초.*침묵.*15초.*아니며.*자비로운 영혼.*같은 선택/);
assert.ok(!skills['462820'], 'Jet Stream internal effect must not appear as a duplicate selectable talent');
assert.ok(Object.values(synergies).every(row => !row.participants.includes('462820')));
console.log('Enhancement mechanics and shared utility regression checks passed; full manuscript, equipment and logs are not covered.');
