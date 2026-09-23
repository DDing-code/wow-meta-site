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
assert.equal(skills[163201].patch, '12.1');
assert.equal(skills[163201].englishName, 'Execute');
assert.match(skills[163201].description, /20%.*35%.*급살.*무료.*분노 40/);
assert(skills[163201].synergies.relatedTalents.some(id => id.endsWith('/대학살')));
assert(skills[163201].synergies.relatedTalents.some(id => id.endsWith('/급살')));
assert.match(guide, /기본은 대상 생명력 20% 미만이고, 대학살을 선택했다면 35% 미만/);
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
assert.deepEqual(synergies.warrior_slayer_reap_trigger_paths.participants, ['444775', '444769', '845', '184367', '12950', '163201', '5308']);
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
for (const id of [262231, 382767]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Arms', 'Fury', 'Protection']);
}
assert.match(skills[262231].description, /무기 10%.*분노 20%.*방어 50%/);
assert.match(skills[262231].description, /불일치.*실측/);
assert.match(skills[382767].description, /최대 분노가 30.*100.*130/);
assert.ok(guide.includes('주요 공격을 미루며 130까지 기다리지'));
for (const id of [386208, 386164, 1280961, 382939, 382549, 1271926]) assert.equal(skills[id].patch, '12.1');
assert.deepEqual(skills[386164].specs, ['Arms', 'Protection']);
assert.match(skills[386208].description, /무기와 분노.*10% 감소.*방어 전문화.*감소가 없다/);
assert.equal(skills[386208].cooldown, '3초');
assert.match(skills[1280961].description, /20%.*15%.*항상.*아니다/);
assert.match(skills[382939].description, /1포인트.*5%.*2포인트/);
assert.match(skills[382549].description, /2%.*10초/);
assert.match(skills[1271926].description, /3%.*10%/);
assert.ok(guide.includes('한국어 툴팁의 공격력 증가 문구'));
for (const id of [390123, 390135, 390138, 390140]) {
  assert.equal(skills[id], undefined, 'Unlearnable Torment talents must not remain selectable');
  assert.ok(!JSON.stringify(synergies).includes(String(id)));
}
assert.equal(skills[107574].patch, '12.1');
assert.equal(skills[107574].cooldown, '1.5분');
assert.match(skills[107574].description, /20초.*20%.*무기.*5%.*방어.*3%.*분노.*5%/);
assert.equal(skills[382764].patch, '12.1');
assert.match(skills[382764].description, /필사의 일격.*피의 갈증.*방패 밀쳐내기.*5%/);
assert.match(skills[382764].description, /분쇄 출혈을 강화하는 특성이 아니다/);
for (const id of [382948, 384404, 383762, 391572, 386284, 384969, 275338, 382954, 382956, 383115]) {
  assert.equal(skills[id], undefined, 'Inactive shared talents must not be offered by the spell DB');
  assert.ok(!JSON.stringify(synergies).includes(String(id)), 'Inactive shared talents must not survive in graph references');
}
for (const id of [100, 6544, 3411, 6552, 107570, 46968, 202163, 103827, 391271]) assert.equal(skills[id].patch, '12.1');
assert.equal(skills[100].cooldown, '20초');
assert.match(skills[100].description, /8~25.*분노 20/);
assert.match(skills[6544].description, /방어 전문화.*도발.*초기화/);
assert.match(skills[3411].description, /25야드.*6초.*10야드/);
assert.match(skills[6552].description, /같은 계열.*5초/);
assert.match(skills[46968].description, /전방 10야드.*2초/);
assert.match(skills[103827].description, /2충전.*17초/);
assert.match(skills[202163].description, /3초.*70%.*30초/);
assert.match(skills[391271].description, /차단에 성공.*10초.*5%/);
assert.ok(guide.includes('25야드 이동과 10야드 보호 유지 조건'));
for (const id of [6673, 97462, 34428, 202168, 18499, 23920, 1243660, 424742]) assert.equal(skills[id].patch, '12.1');
assert.match(skills[97462].description, /40미터.*10초.*10%.*15%/);
assert.equal(skills[97462].cooldown, '3분');
assert.match(skills[34428].description, /처치.*20초.*10%/);
assert.equal(skills[202168].resourceCost, '분노 10');
assert.equal(skills[202168].cooldown, '25초');
assert.match(skills[202168].description, /30%.*처치.*초기화/s);
assert.match(skills[23920].description, /첫 번째.*5초.*20%/);
assert.match(skills[18499].description, /6초.*모든 기절.*아니다/s);
assert.match(skills[1243660].description, /지속시간이 20%/);
assert.match(skills[424742].description, /3%.*2%.*3초.*100%.*15초/);
for (const id of [382900, 383082, 382946, 382896, 384124, 392777, 382895, 382258]) assert.equal(skills[id].patch, '12.1');
for (const [id, spec] of [[382900, 'Fury'], [382896, 'Arms'], [382895, 'Protection']]) {
  assert.deepEqual(skills[id].specs, [spec]);
  assert.match(skills[id].description, /1포인트.*2포인트/);
}
assert.match(skills[384124].description, /무기·분노.*5%.*방어.*2%.*2포인트/);
assert.match(skills[382946].description, /자동 공격.*치명타.*10초.*10%.*효과량.*8초/);
assert.match(skills[383082].description, /몰아치는 천둥.*천둥벼락/);
assert.match(skills[392777].description, /1포인트.*1%.*마무리 일격.*5%.*2포인트/);
assert.equal(skills[382258].castTime, '지속 효과');
for (const id of [275339, 382260, 1271925, 29838, 203201, 1271948]) assert.equal(skills[id].patch, '12.1');
assert.match(skills[275339].description, /3명.*15초.*16미터/s);
assert.match(skills[1271925].description, /50%.*30초/s);
assert.match(skills[29838].description, /5초.*6%.*35%.*2%/);
assert.match(skills[203201].description, /반경이 50%.*20%/);
assert.equal(skills[1271948].icon, '8026700');
assert.match(skills[1271948].description, /플레이어가 아닌 대상.*3초/);
assert.equal(skills[6343].patch, '12.1');
assert.equal(skills[6343].icon, 'spell_nature_thunderclap');
assert.equal(skills[6343].cooldown, '6초');
assert.deepEqual(skills[6343].specs, ['Arms', 'Fury', 'Protection']);
assert.match(skills[6343].description, /분노가 몰아치는 천둥.*분노 8/);
assert.match(skills[6343].description, /방어의 피와 번개.*분노의 피의 폭풍/);
assert.match(skills[6343].description, /무기의 분쇄를 자동으로 퍼뜨리지 않습니다/);
assert.doesNotMatch(skills[6343].description, /85.*대상|0의 분노/);
assert.ok(guide.includes('천둥벼락은 분노를 소모하지 않고 8을 생성'));
assert.equal(skills[152278].patch, '12.1');
assert.equal(skills[152278].castTime, '지속 효과');
assert.match(skills[152278].description, /무기는.*투신과 거인의 강타.*분노는.*투신과 무모한 희생.*방어는.*투신과 방패의 벽/);
assert.deepEqual(synergies['warrior-fury-anger-management'].participants, ['184367', '152278', '1719', '107574']);
assert.equal(synergies['warrior-fury-anger-management'].patch, '12.1');
assert.ok(guide.includes('공격에 실제로 쓴 분노 20마다'));
assert.equal(skills[227847].patch, '12.1');
assert.equal(skills[227847].cooldown, '1.5분');
assert.deepEqual(skills[227847].specs, ['Arms', 'Fury']);
assert.match(skills[227847].description, /가속 적용 전.*무기 6초·분노 4초/);
assert.match(skills[227847].description, /분노 전문화.*분노 5.*무기는.*없습니다/);
assert.ok(guide.includes('분노의 칼날폭풍은 가속 적용 전 4초'));
assert.equal(skills[1680].patch, '12.1');
assert.equal(skills[1680].resourceCost, '분노 20');
assert.deepEqual(skills[1680].specs, ['Arms']);
assert.equal(skills[190411].patch, '12.1');
assert.deepEqual(skills[190411].specs, ['Fury']);
assert.match(skills[190411].description, /분노 3.*소용돌이 연마.*4회.*4명.*65%/);
assert.ok(guide.includes('무기의 소용돌이는 분노 20을 쓰는'));
assert.equal(skills[384318], undefined, 'Removed Thunderous Roar must not remain selectable');
assert.ok(!JSON.stringify(synergies).includes('384318'));
assert.ok(!JSON.stringify(synergies).includes('천둥의 포효'));
assert.ok(!JSON.stringify(synergies).includes('천둥의-포효'));
assert.equal(synergies['warrior-arms-rend-bleed-package'].name, '분쇄-유혈-치명상');
for (const id of [315720, 388933]) {
  assert.equal(skills[id], undefined);
  assert.ok(!JSON.stringify(synergies).includes(String(id)));
}
assert.equal(synergies['warrior-fury-raging-blow-onslaught-generation'].name, '분노의-강타-피의-갈증-분노-생성');
assert.ok(!guide.includes('피의 갈증/분노의 강타/맹공'));
assert.ok(!guide.includes('맹공: 비는 구간'));
for (const id of [383459, 383922, 388004, 388049, 389603, 391683, 392536, 394329]) {
  assert.equal(skills[id], undefined, 'Inactive Fury talents must not be selectable');
  assert.ok(!JSON.stringify(synergies).includes(String(id)), 'Inactive Fury talents must not survive graph links');
}
assert.equal(skills[184362].patch, '12.1');
assert.equal(skills[184362].castTime, '지속 효과');
assert.match(skills[184362].description, /4초.*특화.*광란.*30%/);
assert.equal(skills[23881].patch, '12.1');
assert.equal(skills[23881].cooldown, '4.5초');
assert.match(skills[23881].description, /3%.*분노 8.*30%/);
assert.ok(guide.includes('치명타 한 번이 격노를 무조건 보장'));
for (const id of [85288, 184367, 383854]) assert.equal(skills[id].patch, '12.1');
assert.equal(skills[85288].cooldown, '8초');
assert.match(skills[85288].description, /분노 12.*1충전.*연마.*2충전.*25%/);
assert.equal(skills[184367].resourceCost, '분노 80');
assert.match(skills[184367].description, /4회.*빗발치는 광란/);
assert.equal(skills[383854].castTime, '지속 효과');
assert.ok(guide.includes('후속 피해 횟수를 광란 시전 횟수로'));
for (const id of [184364, 208154, 383468, 383848, 440277]) assert.equal(skills[id].patch, '12.1');
assert.equal(skills[184364].cooldown, '2분');
assert.match(skills[184364].description, /8초.*30%.*20%.*11초.*10%/);
for (const id of [208154, 383468, 383848, 440277]) assert.equal(skills[id].castTime, '지속 효과');
assert.match(skills[208154].description, /격노 상태.*10%.*격노가 끝나면/);
assert.match(skills[383468].description, /3초.*11초.*10%.*즉시/);
for (const id of [383848, 440277]) assert.match(skills[id].description, /같은 선택 노드.*하나만/);
assert.ok(guide.includes('광포한 격노와 강대한 격노는 둘 중 하나만 선택'));
for (const id of [385059, 215568, 393950, 383959, 383885]) assert.equal(skills[id].patch, '12.1');
assert.equal(skills[385059].cooldown, '45초');
assert.match(skills[385059].description, /12미터.*4초.*격노.*분노 20.*8명/);
for (const id of [215568, 393950, 383959, 383885]) assert.equal(skills[id].castTime, '지속 효과');
assert.match(skills[215568].description, /처음.*적중.*15%.*대상별/);
assert.match(skills[393950].description, /5%.*5중첩.*25%.*소비/);
assert.match(skills[383959].description, /치명타.*분노 4.*6초.*0.5초/);
assert.match(skills[383885].description, /35% 미만.*25%.*대상의 현재 생명력/);
assert.ok(guide.includes('광역 치명타 적중 수에 무조건 4를 곱하면 안 됩니다'));
for (const id of [1269308, 1269309, 1269310]) {
  assert.equal(skills[id].patch, '12.1');
  assert.equal(skills[id].castTime, '지속 효과');
}
assert.match(skills[1269308].description, /10%.*8초.*3%.*개별적으로 만료/);
assert.match(skills[1269309].description, /2포인트.*무모한 희생 중에만.*15.*5%.*30.*10%.*65·50/);
assert.match(skills[1269310].description, /3중첩.*50%.*12초.*18초/);
assert.ok(guide.includes('중첩마다 따로 시간이 지나므로'));
assert.doesNotMatch(guide, /28,065|84,766|4,371|현재 고단 로그는 학살자가/);
assert.ok(guide.includes('Icy Veins 분노 전사 12.1 특성 선택'));
for (const id of [385703, 383486, 383852]) {
  assert.equal(skills[id].patch, '12.1');
  assert.equal(skills[id].castTime, '지속 효과');
}
assert.match(skills[385703].description, /8초.*출혈 피해.*20%.*새 출혈/);
assert.match(skills[383486].description, /격노 상태.*자동 공격.*모든 기술/);
assert.match(skills[383852].description, /1포인트.*2.5%.*2포인트.*5%.*치명타 확률/);
assert.ok(guide.includes('로그의 빗나감과 근접 이탈을 구분'));
const bloodthirstSurvival = synergies['warrior-fury-bloodthirst-bleed-survival'];
assert.equal(bloodthirstSurvival.patch, '12.1');
assert.deepEqual(bloodthirstSurvival.participants, ['23881', '383959', '385703', '184364', '383468']);
assert.match(bloodthirstSurvival.description, /치명타.*6초.*8초.*20%.*11초.*서로 다른 효과/);
assert.ok(guide.includes('공격할 수 없는 위험 구간: 피의 갈증을 기다리지 말고'));
for (const id of [335077, 383297, 392931]) {
  assert.equal(skills[id].patch, '12.1');
  assert.equal(skills[id].castTime, '지속 효과');
  assert.equal(skills[id].type, 'spec-talent');
}
assert.match(skills[335077].description, /12초.*2%.*따로 만료/);
assert.match(skills[383297].description, /2포인트.*10%포인트.*분쇄의 타격/);
assert.match(skills[392931].description, /격노 상태.*2포인트.*10%.*꺼진 동안/);
assert.ok(guide.includes('각 중첩은 따로 만료되므로'));
for (const id of [392936, 396749, 335096, 335097]) assert.equal(skills[id].patch, '12.1');
assert.match(skills[392936].description, /15%.*10%포인트.*25%.*35%/);
assert.match(skills[396749].description, /분노 50.*6초 연장/);
assert.equal(skills[335096].cooldown, '4.5초');
assert.match(skills[335096].description, /분노 8.*3%.*30%.*6초 연장/);
assert.equal(skills[335097].cooldown, '8초');
assert.match(skills[335097].description, /분노 12.*20%.*1회.*2회/);
assert.ok(guide.includes('시작 전에 분노 여유를 확인하세요'));
for (const id of [46917, 81099, 76856]) {
  assert.equal(skills[id].patch, '12.1');
  assert.equal(skills[id].type, 'passive');
  assert.equal(skills[id].castTime, '지속 효과');
}
assert.match(skills[81099].description, /형상변환.*선택 특성이 아닙니다/);
assert.match(skills[76856].description, /특화에 따라.*중복 계산/);
assert.ok(guide.includes('실제 장착 무기를 확인하세요'));
for (const id of [206315, 316402]) {
  assert.equal(skills[id].patch, '12.1');
  assert.equal(skills[id].castTime, '지속 효과');
}
assert.match(skills[206315].description, /대상 생명력 35% 미만.*1.5초.*전역/);
assert.match(skills[316402].description, /기본 분노 20.*환급.*소비한 분노가 아니/);
assert.ok(guide.includes('무기 전사의 환급 규칙을 가져오면 안 됩니다'));
assert.equal(skills[280721], undefined);
assert.deepEqual(skills[29725].specs, ['Arms', 'Fury', 'Protection']);
assert.match(skills[29725].description, /무기 전문화.*무료.*40.*분노·방어.*별도 효과/);
assert.ok(guide.includes('급살은 생명력 제한 밖에서도'));
for (const id of [1265355, 1265356, 1265359, 1265361, 1265570]) {
  assert.equal(skills[id].patch, '12.1');
  assert.equal(skills[id].type, 'spec-talent');
  assert.equal(skills[id].castTime, '지속 효과');
  assert.deepEqual(skills[id].specs, ['Fury']);
}
assert.match(skills[1265355].description, /10%.*2중첩.*20%/);
assert.match(skills[1265356].description, /치명타.*3%.*4초.*10%/);
assert.match(skills[1265359].description, /자동 공격 피해와 자동 공격 속도가 30%/);
assert.match(skills[1265361].description, /해당 적.*최소 20%.*실패하면 사망.*5분/);
assert.match(skills[1265570].description, /분노 5.*4초.*10%.*25/);
assert.deepEqual(synergies['warrior-fury-scent-ragedrinker'].participants, ['184367', '1265355', '23881', '1265356', '85288']);
assert.match(synergies['warrior-fury-scent-ragedrinker'].description, /치명타를 보장하지/);
assert.doesNotMatch(guide, /강한 면역기나 죽음 방지 장치를 가진 전문화가 아닙니다/);
for (const id of [6572, 23922, 1296647, 1296648]) {
  assert.equal(skills[id].patch, '12.1');
}
assert.equal(skills[6572].resourceCost, '분노 20');
assert.equal(skills[23922].cooldown, '9초');
assert.match(skills[23922].description, /분노 15.*무료 복수.*20%/);
assert.match(skills[6572].description, /자동 공격.*무료.*방패 올리기/);
assert.match(skills[1296647].description, /자원을 소모하지 않는 복수.*15%.*다음 방패 밀쳐내기.*20%/);
assert.match(skills[1296648].description, /쇠날발톱.*자원을 소모하지 않는 복수.*12초.*30초/);
assert.deepEqual(synergies.warrior_protection_season2_free_revenge.participants, ['6572', '1296647', '23922', '1296648', '228920']);
const protectionGuide = guide.slice(guide.indexOf("'warrior-protection': {"), guide.indexOf("'warrior-arms': {"));
const armsGuide = guide.slice(guide.indexOf("'warrior-arms': {"), guide.indexOf("'warrior-fury': {"));
for (const [label, required, excluded] of [
  ['학살자', '227847', '436358'],
  ['거신', '436358', '227847'],
]) {
  const branch = armsGuide.split(`label: '${label}',`)[1];
  const opener = branch?.split('        opener: {')[1]?.split('        singleTarget: {')[0];
  assert(opener?.includes(`skillId: '${required}'`), `${label} opener missing its cooldown`);
  assert(!opener.includes(`skillId: '${excluded}'`), `${label} opener includes the other hero tree`);
  assert(branch.includes('singleTarget: {') && branch.includes('aoe: {'), `${label} needs single and AoE priorities`);
}
assert.match(protectionGuide, /산왕: 광역과 번개 피해를 살릴 때/);
assert.match(protectionGuide, /거신: 단일 대상과 쇄파 집중 운용/);
assert.match(protectionGuide, /12\.0\.5 과거 로그/);
const protectionBlocks = protectionGuide.slice(protectionGuide.indexOf('    blocks: ['), protectionGuide.indexOf('    opener: {'));
assert.doesNotMatch(protectionBlocks, /산왕은 현재 기본값|현재 선택률만 보면 거신|98\.8%|97\.1%/);
for (const id of [434969, 436148]) {
  assert.equal(skills[id].patch, '12.1');
  assert.deepEqual(skills[id].specs, ['Fury', 'Protection']);
  assert.match(skills[id].description, /2026-09-22.*50%.*PvP/);
}
assert.equal(synergies.warrior_common_mountain_thane_lightning_thunder_blast.patch, '12.1');
assert.match(protectionGuide, /9월 22일.*벼락과 지면 전류 피해가 각각 50% 증가/);
const furyStart = guide.indexOf("'warrior-fury': {");
const furyGuide = guide.slice(furyStart, guide.indexOf("\n  '", furyStart + 1));
assert.equal(skills[5308].patch, '12.1');
assert.deepEqual(skills[5308].specs, ['Fury']);
assert.equal(skills[5308].koreanName, '마무리 일격');
assert.equal(skills[5308].icon, 'inv_sword_48');
assert.deepEqual(skills[163201].specs, ['Arms', 'Protection']);
assert.match(furyGuide, /skillId: '5308'/);
assert.doesNotMatch(furyGuide, /skillId: '163201'/);
assert.deepEqual(synergies['warrior-fury-slayer-execute'].participants, ['444767', '5308', '227847', '184367', '85288']);
assert(synergies.warrior_common_slayer_execute_blade_storm.participants.includes('5308'));
assert.match(furyGuide, /9월 22일.*벼락과 지면 전류.*각각 50%/);
assert.match(furyGuide, /피의 갈증은 벼락의 직접 발동 조건이 아닙니다/);
for (const [label, required, excluded] of [
  ['학살자', '227847', '435607'],
  ['산왕', '435607', '227847'],
]) {
  const branch = furyGuide.split(`label: '${label}',`)[1];
  const opener = branch?.split('        opener: {')[1]?.split('        singleTarget: {')[0];
  assert(opener?.includes(`skillId: '${required}'`), `${label} Fury opener missing its hero skill`);
  assert(!opener.includes(`skillId: '${excluded}'`), `${label} Fury opener includes the other hero skill`);
  if (label === '학살자') assert(!opener.includes("skillId: '107574'"), 'Slayer Bladestorm opener cannot also use Avatar');
  assert(branch.includes('singleTarget: {') && branch.includes('aoe: {'), `${label} Fury needs single and AoE priorities`);
}
const furyCommonOpener = furyGuide.split('    opener: {').at(-1).split('    tips: [')[0];
assert(!/skillId: '(227847|435607)'/.test(furyCommonOpener), 'Fury common opener mixes hero-only skills');
assert.match(furyGuide, /분노의 투신·칼날폭풍은 같은 선택 노드/);
assert.match(skills[107574].description, /분노 전문화에서는 칼날폭풍과 택일/);
assert.match(skills[227847].description, /분노 전문화에서는 투신과 택일/);
assert.equal(synergies['warrior-fury-recklessness-window'].patch, '12.1');
assert.deepEqual(synergies['warrior-fury-recklessness-window'].participants, ['1719', '184367', '385059', '85288']);
for (const id of [
  'warrior-fury-rampage-enrage',
  'warrior-fury-raging-blow-onslaught-generation',
  'warrior-fury-whirlwind-multi-target',
  'warrior-fury-mountain-thane-thunder',
  'warrior-fury-slayer-execute',
]) assert.equal(synergies[id].patch, '12.1', `${id} must be reviewed for 12.1`);
assert.deepEqual(synergies['warrior-fury-whirlwind-multi-target'].participants, ['190411', '280392', '12950', '85288', '184367']);
assert.match(furyGuide, /고기칼은 소용돌이 또는 천둥벼락이 3명 이상에게 맞았을 때 해당 기술의 직접 피해를 높이는 별도 특성/);
assert.doesNotMatch(furyGuide, /고기칼.*확산 조건/);
assert.match(skills[444767].description, /집행자는 대상에게 붙는 약화 효과가 아니라 자신에게 생기는 강화 효과/);
assert.equal(skills[871].patch, '12.1');
assert.equal(skills[397103].patch, '12.1');
assert.match(skills[871].description, /방패의 벽.*40%|8초.*40%/);
assert.match(skills[871].description, /수호자의 아이기스를 선택하면 1회 추가 충전/);
assert.match(skills[397103].description, /60초 줄이는 선택 특성/);
assert(skills[871].synergies.relatedTalents.some(id => id.endsWith('/수호자의-아이기스')));
console.log('Scoped warrior 12.1 corrections verified; full warrior migration remains open.');
