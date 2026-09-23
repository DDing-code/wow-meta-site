const assert = require('node:assert/strict');
const { skills } = require('../src/data/kb-skills.json');

for (const [id, name, spec, pattern] of [
  [274902, '광합성', '회복', /8%.*다른 플레이어/],
  [116670, '생기 충전', '운무', /5%.*15%.*소생의 안개/],
  [399491, '셰이룬의 선물', '운무', /5%.*15%/],
]) {
  const skill = skills[id];
  assert.equal(skill.name, name);
  assert.equal(skill.spec, spec);
  assert.equal(skill.patch, '12.1');
  assert.match(skill.description, pattern);
}

assert.equal(skills[274902].icon, 'spell_lifegivingseed');
console.log('September healer hotfix KB/DB verified.');
