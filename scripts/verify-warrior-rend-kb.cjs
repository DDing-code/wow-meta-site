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
assert.match(skills[772].description, /단일 대상/);
assert.match(skills[772].description, /분노 10/);
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
for (const id of [260708, 1261050, 334779]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Arms']);
}
assert.equal(skills[260708].cooldown, '30초');
assert.match(skills[260708].description, /30초.*12회.*8미터.*1명.*75%/);
assert.equal(skills[1261050].koreanName, '강력한 기세');
assert.equal(skills[1261050].icon, 'inv_1115_warrior_crushingblow');
assert.match(skills[1261050].description, /추가 대상.*20%/);
assert.match(skills[334779].description, /두 번째 대상.*다음 회전베기 또는 소용돌이.*25%.*3중첩/);
assert.equal(skills[383155], undefined, 'Removed Improved Sweeping Strikes must stay absent');
assert.deepEqual(synergies.warrior_arms_sweeping_followup.participants, ['260708', '1261050', '334779', '845', '1680']);
assert.deepEqual(skills[1277297].specs, ['Arms']);
assert.equal(skills[1277297].cooldown, '20초');
assert.equal(skills[1277297].resourceCost, '없음');
assert.deepEqual(skills[190456].specs, ['Protection']);
assert.equal(skills[190456].cooldown, '1초');
assert.equal(skills[190456].resourceCost, '분노 35');
assert.match(skills[190456].description, /최대 생명력의 30%/);
assert.equal(skills[2565].resourceCost, '분노 30');
assert.equal(skills[231847].type, 'passive');
assert.match(skills[231847].description, /최대 충전 수를 2회/);
for (const id of [1277297, 190456, 2565, 231847]) assert.equal(skills[id].patch, '12.1');
assert.deepEqual(synergies.warrior_arms_ignore_pain_colossus.participants, ['1277297', '429644']);
assert.deepEqual(synergies.warrior_protection_ignore_pain_colossus.participants, ['190456', '429644', '2565']);
assert.equal(skills[383292], undefined, 'Retired Juggernaut must not return to the live DB');
assert.ok(!JSON.stringify(synergies).includes('383292'), 'Retired Juggernaut must not remain in synergy edges');
assert.equal(skills[262161], undefined, 'Retired Warbreaker must not return');
assert.equal(skills[167105].patch, '12.1');
assert.equal(skills[167105].cooldown, '45초');
assert.match(skills[167105].description, /10미터.*10초.*30%/);
assert.ok(!JSON.stringify(synergies).includes('262161'));
assert.ok(!guide.includes('262161') && !guide.includes('전쟁파괴자'));
assert.deepEqual(synergies['warrior-arms-warbreaker-sweeping-strikes'].participants, ['167105', '845', '334779', '227847']);
for (const id of [260643, 385512, 388807, 385008]) {
  assert.equal(skills[id], undefined, 'Retired Arms talent ' + id);
  assert.ok(!JSON.stringify(synergies).includes(String(id)), 'Retired Arms graph edge ' + id);
}
assert.equal(synergies['warrior-arms-deep-wounds-skullsplitter'], undefined);
assert.ok(!/해골 쪼개기|도검의 폭풍|폭풍의 벽|힘의 시험/.test(guide));
assert.ok(!skills[1464].description.includes('분노를10만큼 생성'));
for (const id of [383317, 383219, 248621, 383442, 400314]) {
  assert.equal(skills[id], undefined, 'Retired Arms talent ' + id);
  assert.ok(!JSON.stringify(synergies).includes(String(id)), 'Retired Arms graph edge ' + id);
}
assert.equal(synergies['warrior-arms-passive-mastery-rage'], undefined);
for (const id of [184783, 1261057, 386630, 386634]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Arms']);
  assert.equal(skills[id].castTime, '지속 효과');
}
assert.match(skills[184783].description, /30%.*제압.*0/);
assert.match(skills[1261057].description, /30%.*35%/);
assert.match(skills[386630].description, /35%.*필사의 일격.*33%/);
assert.match(skills[386634].description, /다음 필사의 일격.*35%.*2중첩/);
assert.deepEqual(synergies.warrior_arms_charge_reset_chain.participants, ['184783', '1261057', '7384', '386630', '12294']);
for (const id of [1261056, 1261048]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Arms']);
}
assert.match(skills[1261056].description, /20초.*회전베기 2회.*재사용 대기시간/);
assert.match(skills[1261048].description, /거인의 강타.*분노 15/);
assert.deepEqual(synergies.warrior_arms_smash_cleave_resources.participants, ['167105', '1261048', '1261056', '845']);
assert.equal(skills[202316].patch, '12.1');
assert.match(skills[202316].description, /3명 이상.*주 대상.*격돌.*50%/);
assert.match(skills[202316].description, /수동 시전 횟수로 세지 않는다/);
assert.deepEqual(synergies.warrior_arms_fervor_triggered_slam.participants, ['202316', '845', '1680', '1464']);
assert.ok(!guide.includes('21,740') && !guide.includes('90,965') && !guide.includes('4,657'), 'Historical Arms counts must not drive current recommendations');
assert.ok(guide.includes('12.1에서 단일과 다중 대상 모두 먼저 비교할 기본 선택'));
assert.ok(guide.includes('최신 로그를 직접 재수집한 통계로 제시하지 않습니다'));
for (const id of [1269314, 1269383, 1269306, 1269307]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Arms']);
}
assert.equal(skills[1269383].icon, 'ability_rogue_ambush');
assert.equal(skills[1269383].resourceCost, '분노 20');
assert.equal(skills[1269383].cooldown, '없음');
assert.match(skills[1269314].description, /각 중첩의 지속시간은 독립적/);
assert.match(skills[1269306].description, /치명타 피해.*1포인트.*2.5%.*2포인트/s);
assert.match(skills[1269307].description, /다음 거인의 강타.*3%.*5중첩/s);
assert.deepEqual(synergies.warrior_arms_heroic_strike_stack_layers.participants, ['1269314', '1269383', '1269306', '1269307', '167105']);
assert.ok(guide.includes('방어도 관통 중첩과 다음 거인의 강타 준비 중첩을 구분'));
for (const id of [1296643, 1296644]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Arms']);
  assert.equal(skills[id].icon, 'trade_engineering');
  assert.equal(skills[id].castTime, '지속 효과');
}
assert.match(skills[1296643].description, /10%.*8미터.*100%.*5명/s);
assert.match(skills[1296644].description, /15%.*20%.*5중첩/s);
assert.deepEqual(synergies.warrior_arms_season2_slam_consumption.participants, ['1296643', '1296644', '12294', '7384', '1464', '1269383', '202316']);
assert.ok(guide.includes('시즌 2 세트는 격돌의 강화와 소비를 연결한다'));
assert.match(skills[772].description, /유혈.*35% 미만.*필사의 일격/s);
assert.ok(guide.includes('치명상은 별도로 눌러 갱신하는 기술이 아닙니다'));
assert.ok(!guide.includes('출혈 기준선이며 12.0.5부터 광역 적용 가치'));
assert.ok(!guide.includes('레이드는 학살자가 로그 사용률에서 앞서므로'));
assert.ok(!guide.includes('그래서 그래프 중심을 거인의 강타로 두면'));
for (const id of [7384, 12294, 1273062, 385571, 444775, 444769]) assert.equal(skills[id].patch, '12.1');
assert.equal(skills[12294].resourceCost, '분노 30');
assert.equal(skills[12294].cooldown, '6초');
assert.equal(skills[7384].resourceCost, '없음');
assert.equal(skills[7384].cooldown, '12초');
assert.match(skills[385571].description, /2회.*15%/);
assert.match(skills[1273062].description, /제압 및 격돌.*필사의 일격.*5%.*3중첩/);
assert.equal(skills[316440], undefined, 'Use the current learned Martial Prowess talent ID');
assert.ok(!JSON.stringify(synergies).includes('316440'));
assert.match(skills[444775].description, /회전베기.*3명.*20%/);
assert.match(skills[444775].description, /소용돌이 연마.*광란/);
assert.match(skills[444769].description, /학살자의 일격.*3회.*급살/);
assert.deepEqual(synergies.warrior_slayer_reap_trigger_paths.participants, ['444775', '444769', '845', '184367', '12950', '163201']);
assert.ok(!guide.includes('제압이 폭풍을 거두는 자와 학살자 흐름을 여는'));
for (const id of [316405, 389306, 383703, 400205]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Arms']);
}
assert.equal(skills[389306].koreanName, '치명적 감각');
assert.match(skills[389306].description, /1포인트.*5%.*10%.*2포인트/);
assert.match(skills[316405].description, /살아남으면.*10%/);
assert.match(skills[383703].description, /50%.*5중첩/);
assert.match(skills[400205].description, /35% 미만.*15%/);
assert.deepEqual(synergies.warrior_arms_execute_actual_rage_refund.participants, ['163201', '316405', '389306', '29725']);
assert.ok(guide.includes('실제로 40을 지불한 것은 아니므로'));
for (const id of [383338, 389308]) {
  assert.equal(skills[id], undefined, 'Retired Arms passive must not remain selectable');
  assert.ok(!JSON.stringify(synergies).includes(String(id)));
}
assert.deepEqual(skills[383295].specs, ['Fury']);
assert.equal(skills[383295].patch, '12.1');
assert.match(skills[383295].description, /1포인트.*5%.*0.5초.*두 배.*2포인트/);
assert.equal(skills[118038].patch, '12.1');
assert.equal(skills[118038].cooldown, '2분');
assert.match(skills[118038].description, /8초.*100%.*30%/);
assert.ok(guide.includes('모든 피해에 면역이 되는 것이 아니므로'));
for (const id of [383103, 384361, 383287, 383341, 383430, 400803]) assert.equal(skills[id].patch, '12.1');
for (const id of [383103, 384361]) assert.deepEqual(skills[id].specs, ['Arms', 'Protection']);
assert.match(skills[383103].description, /85%.*125%/);
assert.match(skills[384361].description, /일정 확률.*5/);
for (const id of [383287, 383341, 400803]) assert.match(skills[id].description, /1포인트.*5%.*2포인트/);
assert.match(skills[383430].description, /치명타 피해가 10%/);
assert.ok(guide.includes('다음 공격에 필요한 분노가 아직 없다면'));
assert.equal(skills[279423].patch, '12.1');
assert.match(skills[279423].description, /자동 공격.*치명타.*10%/);
assert.match(skills[279423].description, /광역 공격.*5%/);
assert.equal(skills[392792].patch, '12.1');
assert.deepEqual(skills[392792].specs, ['Arms', 'Fury', 'Protection']);
assert.match(skills[392792].description, /20%.*실제 소모.*무기.*10%.*분노.*10%.*방어.*50%/);
assert.match(skills[392792].description, /무료 사용.*지불한 분노가 없/);
assert.ok(guide.includes('예상 환급이 아니라 현재 분노를 확인'));
console.log('Scoped warrior 12.1 corrections verified; full warrior migration remains open.');
