const assert = require('node:assert/strict');
const fs = require('node:fs');
const { skills } = require('../src/data/kb-skills.json');
for (const id of [772, 845, 12950]) {
  assert.equal(skills[id].patch, '12.1');
  assert(!skills[id].description.startsWith('#'));
}
assert.deepEqual(skills[772].specs, ['Arms']);
assert.equal(skills[772].resourceCost, '분노 10');
assert.equal(skills[772].cooldown, '없음');
assert.equal(skills[845].cooldown, '4.5초');
assert.equal(skills[12950].castTime, '지속 효과');
assert.match(skills[772].description, /단일 대상.*분노 10/);
assert.match(skills[845].description, /분쇄를 배웠을 경우/);
assert.match(skills[12950].description, /4번.*4명.*65%/);
assert.match(skills[12950].description, /분쇄 적용은 이 특성의 효과가 아니다/);
const guide = fs.readFileSync(require.resolve('../src/data/guideManuscripts.js'), 'utf8');
assert(!guide.includes('소용돌이 연마가 분쇄 확산까지 연결'));
assert(!guide.includes('풀 시작에서 분쇄가 여러 대상에 닿는지'));
assert.equal(skills[394062], undefined, 'Retired shared Rend must not return');
for (const [id, name, specs] of [
  [1299025, '피의 폭풍', ['Fury']],
  [384277, '피와 번개', ['Protection']],
  [436707, '몰아치는 천둥', ['Fury', 'Protection']],
]) {
  assert.equal(skills[id].patch, '12.1');
  assert.equal(skills[id].koreanName, name);
  assert.deepEqual(skills[id].specs, specs);
  assert.equal(skills[id].castTime, '지속 효과');
}
assert.equal(skills[1299025].icon, 'ability_ironmaidens_whirlofblood');
assert.equal(skills[384277].icon, 'warrior_talent_icon_bloodandthunder');
assert.match(skills[436707].description, /분노와 방어.*5%.*10%/);
assert.match(skills[436707].description, /분노에만.*8.*피의 폭풍/);
const { synergies } = require('../src/data/kb-synergies.json');
assert(!JSON.stringify(synergies).includes('394062'));
assert.deepEqual(synergies.warrior_fury_storm_of_blood.participants, ['190411', '1299025', '436707', '6343']);
assert.deepEqual(synergies.warrior_protection_blood_and_thunder.participants, ['6343', '384277']);
assert.deepEqual(synergies.warrior_fury_storm_of_blood.specs, ['Fury']);
assert.deepEqual(synergies.warrior_protection_blood_and_thunder.specs, ['Protection']);
for (const id of [383877, 280392, 1265357, 1300463]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Fury']);
  assert.equal(skills[id].castTime, '지속 효과');
}
assert.match(skills[383877].description, /75%.*20%/);
assert(!skills[383877].description.includes('100%'));
assert.equal(skills[1265357].koreanName, '빗발치는 광란');
assert.equal(skills[1300463].koreanName, '새기는 칼날');
assert.match(skills[1265357].description, /소용돌이 연마.*마지막 공격.*8미터.*5명/);
assert.match(skills[1300463].description, /1명.*50%.*고기칼.*하나만/);
assert.match(skills[280392].description, /3명.*50%/);
assert.deepEqual(synergies.warrior_fury_rampaging_ruin.participants, ['12950', '184367', '1265357']);
assert.deepEqual(synergies.warrior_fury_hack_and_slash.participants, ['184367', '383877', '85288']);
console.log('Warrior Rend/Cleave/Improved Whirlwind corrections verified; full warrior migration remains open.');
