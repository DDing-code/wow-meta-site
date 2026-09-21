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
for (const id of [1296645, 1296646]) {
  assert.equal(skills[id].patch, '12.1');
  assert.equal(skills[id].type, 'set-bonus');
  assert.deepEqual(skills[id].specs, ['Fury']);
  assert.equal(skills[id].icon, 'trade_engineering');
}
assert.match(skills[1296645].description, /15%.*2초.*6초/);
assert.match(skills[1296646].description, /10%.*3%.*6%/);
assert.equal(skills[1719].patch, '12.1');
assert.equal(skills[1719].cooldown, '1.5분');
assert.equal(skills[1719].castTime, '즉시');
assert.match(skills[1719].description, /12초.*50%.*20%/);
assert.deepEqual(synergies.warrior_fury_season2_recklessness.participants, ['1719', '85288', '1296645', '23881', '1296646']);
assert.equal(skills[228920].patch, '12.1');
assert.deepEqual(skills[228920].specs, ['Arms', 'Protection']);
assert.equal(skills[228920].cooldown, '1.5분');
assert.match(skills[228920].description, /자신의 출혈.*50%.*방어.*분노 10/);
assert(!skills[228920].description.includes('복수와 천둥벼락의 공격력이 50%만큼 증가'));
assert.deepEqual(synergies.warrior_arms_ravager_rend.specs, ['Arms']);
assert.deepEqual(synergies.warrior_protection_ravager_bleeds.specs, ['Protection']);
for (const synergy of Object.values(synergies)) {
  if (synergy.specs?.includes('Fury')) assert(!synergy.participants?.includes('228920'), 'Fury must not inherit selectable Ravager');
}
for (const id of [390713, 382953]) {
  assert.equal(skills[id], undefined, 'Retired talent must not return');
  assert(!JSON.stringify(synergies).includes(String(id)), 'Retired talent graph reference must not return');
}
assert.deepEqual(synergies['warrior-arms-sudden-death-massacre-dance'].participants, ['29725', '281001', '163201']);
assert.equal(synergies['warrior-arms-sudden-death-massacre-dance'].name, '급살-대학살-마무리-조건');
for (const id of [29725, 281001]) assert.equal(skills[id].patch, '12.1');
assert.match(skills[29725].description, /무료.*40/);
assert.match(skills[281001].description, /35% 미만/);
for (const id of [436358, 429634, 429636]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Arms', 'Protection']);
}
assert.equal(skills[436358].cooldown, '30초');
assert.equal(skills[436358].castTime, '집중 2초');
assert.match(skills[429636].description, /10초.*10%.*20%/);
assert.match(skills[429636].description, /재사용 대기시간이 감소하지 않는다/);
assert.match(skills[429634].description, /회전베기가 3명.*복수가 3명/);
assert.deepEqual(synergies['warrior-arms-colossus-demolish'].participants, ['12294', '845', '429634', '436358', '429636']);
assert.deepEqual(synergies['SY-WARRIOR-PROTECTION-COLOSSUS-DEMOLISH-REVENGE'].participants, ['23922', '6572', '429634', '436358', '429636']);
assert(!guide.includes('거신의 지배가 최대 중첩에서 쇄파 쿨다운을 더 크게 줄인다'));
assert(!guide.includes('회전베기와 필사의 일격이 쇄파 흐름을 제대로 줄였는지'));
for (const id of [444767, 444774, 429641, 429644]) {
  assert.equal(skills[id].patch, '12.1');
  assert.equal(skills[id].castTime, '지속 효과');
}
assert.match(skills[444767].description, /무기 25%, 분노 15%/);
assert.match(skills[444774].description, /무기.*20%.*분노.*10%/);
assert.match(skills[429641].description, /무기는 제압과 마무리 일격, 방어는 복수와 마무리 일격/);
assert.match(skills[429644].description, /피해량을 30% 증가/);
assert.deepEqual(synergies.warrior_arms_opportunist.participants, ['184783', '444774', '7384']);
assert.deepEqual(synergies.warrior_fury_opportunist.participants, ['444774', '85288']);
assert.deepEqual(synergies.warrior_arms_tide_of_battle.specs, ['Arms']);
assert.deepEqual(synergies.warrior_protection_tide_of_battle.specs, ['Protection']);
assert(guide.includes('무기의 학살자의 지배는 주 대상 공격 시 25%'));
assert(guide.includes('분노의 학살자의 지배는 주 대상 공격 시 15%'));
for (const id of [1261051, 1261049, 262150, 383154]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Arms']);
  assert.equal(skills[id].castTime, '지속 효과');
}
assert.equal(skills[1261051].koreanName, '전술적 우위');
assert.match(skills[1261051].description, /거인의 강타.*급살 1회/);
assert.match(skills[1261049].description, /휩쓸기 일격 6중첩/);
assert.match(skills[262150].description, /140%.*주 대상에게 피해를 주지 않는다/);
assert.match(skills[383154].description, /치명타 확률을 5%.*35% 미만.*33%/);
assert.deepEqual(synergies.warrior_arms_smash_grants.participants, ['167105', '1261051', '29725', '1261049', '260708']);
assert.deepEqual(synergies.warrior_arms_dreadnaught.participants, ['7384', '262150']);
assert.deepEqual(synergies.warrior_arms_bloodletting.participants, ['383154', '772', '12294']);
assert.equal(skills[262111], undefined, 'Old Mastery: Deep Wounds must not return');
assert(!JSON.stringify(synergies).includes('262111'));
assert.equal(skills[1258398].koreanName, '특화: 무기 전문가');
assert.equal(skills[1258398].icon, 'warrior_talent_icon_igniteweapon');
assert.deepEqual(skills[1261060].specs, ['Arms', 'Fury', 'Protection']);
assert.deepEqual(skills[1261062].specs, ['Arms']);
for (const id of [1258398, 1261060, 1261062]) assert.equal(skills[id].patch, '12.1');
assert.match(skills[1261060].description, /마무리 일격.*6초.*남은 피해량/);
assert.match(skills[1261062].description, /필사의 일격과 격돌이 치명타/);
assert.deepEqual(synergies.warrior_arms_deep_wounds_sources.participants, ['1261060', '163201', '1261062', '12294', '1464']);
assert(!guide.includes('특화: 치명상'));
console.log('Scoped warrior 12.1 corrections verified; full warrior migration remains open.');
