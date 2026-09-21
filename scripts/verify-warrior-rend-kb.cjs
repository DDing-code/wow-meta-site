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
console.log('Warrior Rend/Cleave/Improved Whirlwind corrections verified; full warrior migration remains open.');
