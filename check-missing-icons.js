const fs = require('fs');
const path = require('path');

// 데이터베이스 파일 읽기
const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
const content = fs.readFileSync(dbPath, 'utf8');

// 데이터베이스 추출
const dbMatch = content.match(/const koreanSpellDatabase = ({\s[\s\S]*?});/);
if (!dbMatch) {
  console.error('❌ 데이터베이스를 찾을 수 없습니다.');
  process.exit(1);
}

const func = new Function('return ' + dbMatch[1]);
const db = func();

// 이미지에서 보이는 물음표 스킬들의 이름
const missingIconSkills = [
  '천둥벼락',  // Thunder Blast
  '토템의 힘',  // Crashing Thunder
  '거인의 힘',  // Colossal Might
  '역전의 용사의 철퇴', // Demolish
  '폭풍의 주전역', // Slayer's Dominance
  '폭풍을 거두는 자', // Overwhelming Blades
  '휩쓸기 일격', // Sweeping Strikes
  '급살', // Sudden Death
  '죽음의 피뢰', // Blood and Thunder
  '백점블로', // Vengeance
  '분노 조절', // Anger Management
  '묵직한 반격', // Heavy Repercussions
  '대학살', // Massacre
  '피의 맛', // Taste for Blood
  '목화: 저명상', // Mastery: Deep Wounds
  '일격무쌍', // Frothing Berserker
  '고기칼', // Meat Cleaver
  '신봉대', // Revenge!
  '처구력 폰진', // Punish
];

// 실제 스킬 ID 매핑 (WoW의 전사 특성들)
const warriorSkillMapping = {
  // 클래스 특성
  '386071': { name: 'Thunder Blast', korean: '천둥벼락', icon: 'spell_nature_thunderblast' },
  '385840': { name: 'Crashing Thunder', korean: '토템의 힘', icon: 'spell_shaman_crashlightning' },
  '440987': { name: 'Colossal Might', korean: '거인의 힘', icon: 'ability_warrior_colossussmash' },
  '280001': { name: 'Demolish', korean: '역전의 용사의 철퇴', icon: 'ability_warrior_devastate' },
  '444770': { name: "Slayer's Dominance", korean: '폭풍의 주전역', icon: 'ability_warrior_slayer' },
  '390138': { name: 'Overwhelming Blades', korean: '폭풍을 거두는 자', icon: 'ability_warrior_bladestorm' },
  '260708': { name: 'Sweeping Strikes', korean: '휩쓸기 일격', icon: 'ability_rogue_slicedice' },
  '280772': { name: 'Sudden Death', korean: '급살', icon: 'ability_warrior_improveddisciplines' },
  '385880': { name: 'Blood and Thunder', korean: '죽음의 피뢰', icon: 'spell_nature_bloodlust' },
  '202612': { name: 'Vengeance', korean: '백점블로', icon: 'ability_paladin_vengeance' },
  '152278': { name: 'Anger Management', korean: '분노 조절', icon: 'warrior_talent_icon_angermanagement' },
  '390677': { name: 'Heavy Repercussions', korean: '묵직한 반격', icon: 'inv_shield_32' },
  '206315': { name: 'Massacre', korean: '대학살', icon: 'inv_sword_48' },
  '337302': { name: 'Taste for Blood', korean: '피의 맛', icon: 'ability_rogue_hungerforblood' },
  '262111': { name: 'Mastery: Deep Wounds', korean: '목화: 저명상', icon: 'ability_backstab' },
  '215571': { name: 'Frothing Berserker', korean: '일격무쌍', icon: 'warrior_talent_icon_furyintheblood' },
  '280392': { name: 'Meat Cleaver', korean: '고기칼', icon: 'ability_warrior_weaponmastery' },
  '5302': { name: 'Revenge', korean: '신봉대', icon: 'ability_warrior_revenge' },
  '275334': { name: 'Punish', korean: '처구력 폰진', icon: 'ability_deathknight_sanguinfortitude' },

  // Shield Slam과 관련 스킬들
  '23922': { name: 'Shield Slam', korean: '방패 밀쳐내기', icon: 'inv_shield_05' },
  '871': { name: 'Shield Wall', korean: '방패의 벽', icon: 'ability_warrior_shieldwall' },
  '107574': { name: 'Avatar', korean: '투신', icon: 'warrior_talent_icon_avatar' },
  '1160': { name: 'Demoralizing Shout', korean: '사기의 외침', icon: 'ability_warrior_warcry' },
  '6572': { name: 'Revenge', korean: '복수', icon: 'ability_warrior_revenge' },
  '228920': { name: 'Ravager', korean: '파괴자', icon: 'warrior_talent_icon_ravager' },

  // Rampage 및 분노 특성
  '184367': { name: 'Rampage', korean: '광란', icon: 'ability_warrior_rampage' },
  '85288': { name: 'Raging Blow', korean: '성난 일격', icon: 'warrior_wild_strike' },
  '190411': { name: 'Whirlwind', korean: '소용돌이', icon: 'ability_whirlwind' },
  '5308': { name: 'Execute', korean: '마무리 일격', icon: 'inv_sword_48' },
  '184364': { name: 'Enraged Regeneration', korean: '격노의 재생력', icon: 'ability_warrior_focusedrage' },

  // Bloodthirst 관련
  '23881': { name: 'Bloodthirst', korean: '피의 갈증', icon: 'spell_nature_bloodlust' },
  '329038': { name: 'Bloodborne', korean: '피의 각성', icon: 'ability_revendreth_warrior' },
  '383762': { name: 'Critical Thinking', korean: '비판적 사고', icon: 'spell_nature_focusedmind' },

  // Arms 특성
  '262161': { name: 'Warbreaker', korean: '전쟁파괴자', icon: 'inv_artifact_warswords' },
  '152277': { name: 'Ravager', korean: '파괴자', icon: 'ability_warrior_ravager' },
  '12294': { name: 'Mortal Strike', korean: '죽음의 일격', icon: 'ability_warrior_savageblow' },
  '772': { name: 'Rend', korean: '분쇄', icon: 'ability_gouge' },
  '167105': { name: 'Colossus Smash', korean: '거인의 강타', icon: 'ability_warrior_colossussmash' },
  '262231': { name: 'Deadly Calm', korean: '죽음의 고요', icon: 'achievement_boss_kingymiron' }
};

console.log('=== 물음표로 표시되는 스킬들 확인 ===\n');

// 데이터베이스에서 물음표 아이콘 또는 아이콘이 없는 스킬 찾기
let foundCount = 0;
let missingCount = 0;

Object.entries(db).forEach(([id, skill]) => {
  const isWarrior = skill.class === 'WARRIOR';
  const hasIcon = skill.icon && skill.icon !== 'inv_misc_questionmark';

  if (isWarrior && !hasIcon) {
    console.log(`❌ ${id}: ${skill.koreanName || skill.name} - 아이콘 없음`);
    missingCount++;

    // warriorSkillMapping에서 매칭되는 스킬 찾기
    const mapping = warriorSkillMapping[id];
    if (mapping) {
      console.log(`   → 추천 아이콘: ${mapping.icon}`);
      foundCount++;
    }
  }
});

console.log(`\n=== 통계 ===`);
console.log(`전사 스킬 중 아이콘 없음: ${missingCount}개`);
console.log(`매핑 가능한 스킬: ${foundCount}개`);

// 업데이트 스크립트 생성
console.log('\n=== 아이콘 업데이트 코드 생성 중... ===');

const updateCode = `
// 전사 스킬 아이콘 매핑
const warriorIconMapping = ${JSON.stringify(warriorSkillMapping, null, 2)};

// 데이터베이스 업데이트
Object.keys(warriorIconMapping).forEach(id => {
  if (db[id]) {
    db[id].icon = warriorIconMapping[id].icon;
    if (!db[id].koreanName) {
      db[id].koreanName = warriorIconMapping[id].korean;
    }
  }
});
`;

// 파일로 저장
fs.writeFileSync('warrior-icon-mapping.js', updateCode, 'utf8');
console.log('✅ warrior-icon-mapping.js 파일 생성됨');