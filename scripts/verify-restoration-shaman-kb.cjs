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
