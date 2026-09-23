const assert = require('node:assert/strict');
const {skills} = require('../src/data/kb-skills.json');
for (const id of [73920,73685,61295,77472]) {
  assert.equal(skills[id].patch,'12.1');
  assert.deepEqual(skills[id].specs,['Restoration']);
  assert(!skills[id].description.startsWith('#'));
  assert(skills[id].description.length>80);
}
assert.equal(skills[73920].cooldown,'12초');
assert.equal(skills[73920].castTime,'2초');
assert.match(skills[73920].description,/18초.*6명.*하나.*교체/);
assert.equal(skills[73685].cooldown,'20초');
assert.equal(skills[73685].castTime,'즉시');
assert.match(skills[73685].description,/25%.*30%.*10초/);
assert.equal(skills[61295].cooldown,'6초');
assert.match(skills[61295].description,/18초.*1회/);
assert.equal(skills[77472].castTime,'2초');
assert.match(skills[77472].description,/2.38%/);
assert.equal(skills[1252841], undefined, 'Removed Calm Waters must not return');
for (const id of [1253093,1312843]) assert.equal(skills[id].patch,'12.1');
assert.match(skills[1253093].description,/15%/);
assert.match(skills[1312843].description,/3초.*1267016/);
assert.equal(skills[1312843].icon,'ability_shaman_manatidetotem');
const synergies = require('../src/data/kb-synergies.json');
assert(!JSON.stringify(synergies).includes('1252841'), 'Removed talent must have no graph edges');
assert.equal(skills[1271104].patch,'12.1');
assert.equal(skills[1271104].castTime,'지속 효과');
assert.match(skills[1271104].description,/30%.*20%p.*45%/);
const accord = synergies.synergies.shaman_restoration_unleash_earthen_accord;
assert.equal(accord.patch,'12.1');
assert.deepEqual(accord.participants,['73685','1271104','61295','1064','77472']);
for (const id of ['shaman_restoration_sustain_shields','shaman_restoration_spiritlink_raid']) {
  assert(!synergies.synergies[id].participants.includes('1271104'), 'Unrelated defensive hub must not claim Earthen Accord');
}
console.log('Restoration core spells and talent migration verified; full guide audit remains open.');
assert.equal(skills[443450].patch,'12.1');
assert.deepEqual(skills[443450].specs,['Elemental','Restoration']);
assert.match(skills[443450].description,/복원.*생명 폭발.*12초.*정기.*폭풍수호자.*8초/);
for (const id of [1267016,1267093,1267120]) {
  assert.equal(skills[id].patch,'12.1');
  assert.equal(skills[id].castTime,'지속 효과');
  assert(!skills[id].description.startsWith('#'));
}
assert.match(skills[1267016].description,/6%.*10%.*1명.*2명/);
assert.match(skills[1267120].description,/신속함.*사용 횟수.*충전을 소모하지/);
assert.match(skills[1267093].description,/1포인트.*20%.*2포인트.*40%/);
assert.match(skills[1267093].description,/60%도 아니다/);
for (const id of [114052,108280,98008]) {
  assert.equal(skills[id].patch,'12.1');
  assert.equal(skills[id].cooldown,'3분');
  assert.equal(skills[id].castTime,'즉시');
}
assert.equal(skills[114052].icon,'8026698');
assert.match(skills[114052].description,/15초.*3명.*10%.*50%.*25%/);
assert.match(skills[108280].description,/10초.*2초.*40야드.*5명/);
assert.match(skills[98008].description,/40야드.*6초.*10야드.*10%/);
for (const id of [1296629,1296630]) {
  assert.equal(skills[id].patch,'12.1');
  assert.equal(skills[id].type,'set-bonus');
  assert.deepEqual(skills[id].specs,['Restoration']);
}
assert.match(skills[1296629].description,/8초.*3회.*고정 쿨다운이 아니다/);
assert.match(skills[1296630].description,/1초.*1명.*10초/);
assert.deepEqual(synergies.synergies.shaman_restoration_season2_rain_shields.participants,
  ['77472','1064','1296629','73920','1296630']);
for (const [id, pattern] of [
  [1064, /3명.*30%/], [200072, /20%.*10%/], [1252874, /10%.*0\.5초/],
  [51564, /2중첩.*20%|20%.*2중첩/], [200076, /15%/], [382039, /30%/],
  [1253099, /15%/], [470076, /30%.*2중첩/], [52127, /3초/],
  [16196, /0\.80%.*0\.48%.*0\.20%/], [207401, /10초.*5%/],
  [378443, /5명.*2초/], [381946, /6초.*15%/], [382020, /3%.*150%/],
  [382021, /1시간.*20%.*6초/], [382030, /5초/],
]) {
  assert.equal(skills[id].patch, '12.1', `Spell ${id} must be current`);
  assert.match(skills[id].description, pattern);
}
assert.equal(skills[212048].patch, '12.1');
assert.equal(skills[212048].castTime, '10초');
assert.match(skills[212048].description, /전투 중에는 사용할 수 없/);
assert.equal(skills[2008].patch, '12.1');
assert.match(skills[2008].description, /전투 중에는 사용할 수 없/);
for (const id of ['shaman_restoration_farseer_ancestor', 'shaman_restoration_sustain_shields']) {
  assert(!synergies.synergies[id].participants.includes('212048'), `${id} must not include a resurrection spell`);
}
for (const [id, pattern] of [
  [382045, /4번.*추가/], [382194, /0\.5%/], [382309, /30%.*15%.*60%/],
  [382315, /150%/], [382482, /100%.*감소/], [382732, /8%.*1회/],
  [383222, /2미터.*5명/], [462383, /5%.*1초/], [462424, /성난 해일.*즉시/],
  [462587, /200%.*215%/], [1252882, /두 번/], [1253014, /20%/],
  [1253090, /12%/], [1254210, /40%/], [1254251, /1초/],
]) {
  assert.equal(skills[id].patch, '12.1', `Spell ${id} must be current`);
  assert.match(skills[id].description, pattern);
}
assert.match(skills[462486].description, /특성.*207778/);
assert.match(skills[207778].description, /시전 주문.*12미터.*5명/);
assert(synergies.synergies.shaman_restoration_downpour_tide.participants.includes('207778'));
for (const [id, pattern] of [
  [51485, /8초.*2초.*50%/], [196840, /6초.*50%.*소용돌이 10/],
  [2645, /30%.*100%/], [974, /자신이.*20%.*3초.*9회/],
  [198103, /30초.*3분/], [192106, /1시간.*50%/],
  [188196, /40야드.*2\.5초/], [51514, /1분.*30초/],
  [2484, /20초.*10미터.*50%/], [188443, /3명.*2초.*소용돌이 2/],
  [32182, /40초.*30%.*10분/], [378081, /자연 주문.*즉시.*1분/],
  [51490, /10미터.*5초.*40%.*30초/], [5394, /15초.*2초.*40미터/],
  [2825, /40초.*30%.*10분/],
]) {
  assert.equal(skills[id].patch, '12.1', `Shared spell ${id} must be current`);
  assert.match(skills[id].description, pattern);
}
assert.deepEqual(skills[51490].specs, ['Elemental']);
assert.equal(skills[108281], undefined, 'Removed Ancestral Guidance must not return');
for (const [id, pattern] of [
  [30884, /35%.*40%.*45초/], [383010, /자신.*아군 한 명/],
  [260878, /1초.*5%.*최대 4중첩/], [378075, /3초.*25%.*20초/],
  [381930, /40야드.*정기.*150.*복원.*225.*고양.*225/],
  [1217622, /충전.*115%.*복원.*물의 보호막/],
  [462454, /273\.33%.*429.*1초/],
  [1270350, /정기.*지능 3%.*고양.*민첩성 3%.*복원.*지능 3%/],
  [381867, /5초.*쇄도하는 토템.*적용되지 않/],
  [382201, /15%.*10초.*3초/],
]) {
  assert.equal(skills[id].patch, '12.1', `Shared talent ${id} must be current`);
  assert.match(skills[id].description, pattern);
}
assert.equal(synergies.synergies.shaman_common_totem_control_mythic_utility.patch, '12.1');
for (const [id, pattern] of [
  [462791, /30초.*2초.*제트 기류/], [382215, /3%\/6%.*5%\/10%/],
  [382197, /영혼 정화.*날카로운 바람.*정화.*토템/],
  [377933, /20%.*차원 여행자/], [1279819, /15%.*도발/],
  [355630, /12초.*주문 피해.*15%/], [462368, /3초.*화염.*냉기.*자연.*6%/],
  [462764, /10미터.*30%.*냉기의 감옥/], [462762, /15초.*4초.*극지의 눈폭풍/],
  [204268, /70%.*6초.*15초/], [265046, /8초.*15초/],
  [382886, /화염.*냉기.*3%/], [462796, /고양.*15%.*복원.*20%.*정기.*30%/],
  [381689, /8%\/15%.*50%\/100%/], [378211, /복원.*25%.*고양.*25%.*정기는.*30%/],
  [1270375, /특화.*3%/], [381650, /마법 피해.*8%/],
  [381655, /2%\/4%/], [462854, /1시간.*2%.*20%/],
]) {
  assert.equal(skills[id].patch, '12.1', `Shared talent ${id} must be current`);
  assert.match(skills[id].description, pattern);
}
assert.equal(skills[462854].castTime, '즉시');
assert.deepEqual(synergies.synergies.shaman_common_lightning_shield_nature_damage.participants,
  ['188196', '188443', '192106', '381655', '378081']);
for (const id of ['1279819', '355630']) {
  assert(synergies.synergies.shaman_common_astral_shift_earth_elemental_defense.participants.includes(id));
}
console.log('Restoration 12.1 tooltip effects and resurrection graph verified.');
