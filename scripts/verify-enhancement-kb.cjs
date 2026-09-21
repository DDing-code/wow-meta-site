const assert = require('node:assert/strict');
const { skills } = require('../src/data/kb-skills.json');
const { synergies } = require('../src/data/kb-synergies.json');

for (const [id, pattern] of Object.entries({
  187880: /20%.*최대 5중첩.*번개 화살.*연쇄 번개.*20%.*20%/,
  384149: /최대 10중첩.*소비.*저장.*다른 특성/,
  384143: /저장 상한.*10중첩.*치유의 파도.*연쇄 치유.*10%.*10%.*최대 20중첩/,
  17364: /물리 피해.*7.5초.*1회.*0.4%/,
  60103: /보조 무기.*화염 피해.*18초.*0.16%.*불꽃혓바닥 무기.*100%/,
})) {
  assert.equal(skills[id].patch, '12.1', id);
  assert.deepEqual(skills[id].specs, ['Enhancement'], id);
  assert.match(skills[id].description, pattern, id);
}
assert.equal(skills[187880].castTime, '지속 효과');
assert.equal(skills[17364].castTime, '즉시');
assert.equal(skills[60103].castTime, '즉시');
assert.match(synergies.shaman_enhancement_maelstrom_spender_loop.description, /기본 저장 상한.*5.*넘치는 소용돌이.*분노의 소용돌이.*치유용.*20.*10/);
console.log('Enhancement: five reviewed core records and resource distinction passed; remaining talents, manuscript and logs are not covered.');
