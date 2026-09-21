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
console.log('Restoration core spells and talent migration verified; full guide audit remains open.');
