const assert = require('node:assert/strict');
const fs = require('node:fs');
const { skills } = require('../src/data/kb-skills.json');
const { synergies } = require('../src/data/kb-synergies.json');

for (const id of [356995, 357211, 369089, 370455, 370781, 370819, 370821, 371034, 375721, 375757, 375797, 376872, 376888, 386283, 444088]) {
  assert.ok(['12.1', '12.1.5'].includes(skills[id]?.patch), `Stale Devastation spell ${id}`);
}
for (const id of [
  'SY-evoker-devastation-mass-disintegrate-disintegrate',
  'SY-evoker-devastation-fire-breath-eternity-surge',
  'SY-evoker-devastation-dragonrage-essence-burst',
  'SY-evoker-devastation-imminent-destruction-deep-breath',
  'SY-evoker-devastation-consume-flame-fire-breath',
]) assert.ok(['12.1', '12.1.5'].includes(synergies[id]?.patch), `Stale Devastation synergy ${id}`);
assert.deepEqual(synergies['SY-evoker-devastation-consume-flame-fire-breath'].participants, ['444088', '357208', '356995', '357211', '386283']);

const guide = require('./lib/guideManuscripts.cjs').readGuideManuscriptText('evoker-devastation');
const opener = guide.split('    opener: {')[1].split('    priority: [')[0];
assert.match(guide, /patch: '12\.1(\.5)?'/);
assert.match(guide, /분노 상승 3등급/);
assert.match(guide, /1등급.*이 단계가 없습니다/);
assert.match(guide, /비늘사령관은 4대상 이하/);
assert.doesNotMatch(guide, /81\.6%|55\.4%|2026-06-06/);
assert.doesNotMatch(opener, /skillId: '1265802'/, 'Shattering Star is not an active opener step');
console.log('Devastation 12.1 KB/DB, guide branches, and opener verified.');
