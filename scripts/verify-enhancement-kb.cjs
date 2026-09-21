const assert = require('node:assert/strict');
const { skills } = require('../src/data/kb-skills.json');
const { synergies } = require('../src/data/kb-synergies.json');
const fs = require('node:fs');
const path = require('node:path');

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
assert.equal(skills[51533], undefined);
for (const relation of Object.values(synergies)) assert.ok(!relation.participants.includes('51533'), relation.id);
const manuscript = fs.readFileSync(path.join(__dirname, '../src/data/guideManuscripts.js'), 'utf8');
assert.doesNotMatch(manuscript, /skillId: ['"](?:51533|469314)['"]/);
assert.match(synergies.shaman_enhancement_maelstrom_spender_loop.description, /기본 저장 상한.*5.*넘치는 소용돌이.*분노의 소용돌이.*치유용.*20.*10/);
assert.match(synergies.shaman_enhancement_doom_winds_ascendance_window.description, /직접 시전하지 않는 패시브.*승천.*대체/);
console.log('Enhancement: 11 reviewed records, retired Feral Spirit exclusion and resource conditions passed; remaining talents, manuscript and logs are not covered.');
