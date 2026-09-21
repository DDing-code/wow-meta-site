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
assert.doesNotMatch(manuscript, /skillId: ['"](?:51533|469314)['"]/);
assert.doesNotMatch(manuscript, /skillId: ['"]1218047['"]/);
assert.doesNotMatch(manuscript, /skillId: ['"]454009['"]/);
assert.ok((manuscript.match(/(?:skillId|"skillId"): ['"]452201['"]/g) || []).length >= 8);
assert.match(manuscript, /skillIds: \['454009'/);
const heroFlows = enhancement.slice(enhancement.indexOf('heroBranches:'), enhancement.indexOf('    blocks:'));
for (const mode of ['opener', 'singleTarget', 'aoe']) assert.equal((heroFlows.match(new RegExp('"' + mode + '":', 'g')) || []).length, 2, mode);
assert.doesNotMatch(heroFlows, /76.1%|53.6%|92.6%/);
assert.match(heroFlows, /수동 승천.*토림의 기원/);
assert.match(heroFlows, /파멸의 바람.*휘몰아치는 정기.*토템의 기세/);
assert.match(manuscript, /skillId: ['"]1218090['"]/);
assert.match(synergies.shaman_enhancement_maelstrom_spender_loop.description, /기본 저장 상한.*5.*넘치는 소용돌이.*분노의 소용돌이.*치유용.*20.*10/);
assert.match(synergies.shaman_enhancement_doom_winds_ascendance_window.description, /직접 시전하지 않는 패시브.*승천.*대체/);
console.log('Enhancement: 33 reviewed records, active spell IDs, shared hero effects, retired Feral Spirit exclusion and resource conditions passed; remaining talents, manuscript and logs are not covered.');
