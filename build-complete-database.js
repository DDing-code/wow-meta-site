/**
 * 통합 WoW 스킬 데이터베이스 구축 시스템
 *
 * 이 스크립트는 여러 소스에서 데이터를 수집하여
 * 하나의 완전한 데이터베이스를 구축합니다.
 */

const fs = require('fs');
const path = require('path');

// ============================================
// 1. 데이터 소스 정의
// ============================================

// 기본 스킬 데이터 (ID, 영문명, 클래스 등)
const baseSkillData = {
  // 전사 기본 스킬
  '100': { name: 'Charge', class: 'WARRIOR', category: 'baseline', type: 'ability', level: 1 },
  '355': { name: 'Taunt', class: 'WARRIOR', category: 'baseline', type: 'ability', level: 8 },
  '1464': { name: 'Slam', class: 'WARRIOR', category: 'baseline', type: 'ability', level: 10 },
  '1680': { name: 'Whirlwind', class: 'WARRIOR', category: 'fury', type: 'ability', level: 14 },
  '1715': { name: 'Hamstring', class: 'WARRIOR', category: 'arms', type: 'ability', level: 8 },
  '1719': { name: 'Recklessness', class: 'WARRIOR', category: 'fury', type: 'ability', level: 50 },
  '2565': { name: 'Shield Block', class: 'WARRIOR', category: 'protection', type: 'ability', level: 10 },
  '5246': { name: 'Intimidating Shout', class: 'WARRIOR', category: 'baseline', type: 'ability', level: 14 },
  '6343': { name: 'Thunder Clap', class: 'WARRIOR', category: 'baseline', type: 'ability', level: 11 },
  '6544': { name: 'Heroic Leap', class: 'WARRIOR', category: 'baseline', type: 'ability', level: 26 },
  '6552': { name: 'Pummel', class: 'WARRIOR', category: 'baseline', type: 'ability', level: 7 },
  '6572': { name: 'Revenge', class: 'WARRIOR', category: 'protection', type: 'ability', level: 14 },
  '6673': { name: 'Battle Shout', class: 'WARRIOR', category: 'baseline', type: 'ability', level: 42 },
  '12294': { name: 'Mortal Strike', class: 'WARRIOR', category: 'arms', type: 'ability', level: 10 },
  '18499': { name: 'Berserker Rage', class: 'WARRIOR', category: 'baseline', type: 'ability', level: 40 },
  '23881': { name: 'Bloodthirst', class: 'WARRIOR', category: 'fury', type: 'ability', level: 10 },
  '23920': { name: 'Spell Reflection', class: 'WARRIOR', category: 'baseline', type: 'ability', level: 33 },
  '23922': { name: 'Shield Slam', class: 'WARRIOR', category: 'protection', type: 'ability', level: 10 },
  '46924': { name: 'Bladestorm', class: 'WARRIOR', category: 'talent', type: 'ability', level: 45 },
  '85288': { name: 'Raging Blow', class: 'WARRIOR', category: 'fury', type: 'ability', level: 13 },
  '97462': { name: 'Rallying Cry', class: 'WARRIOR', category: 'baseline', type: 'ability', level: 43 },
  '107574': { name: 'Avatar', class: 'WARRIOR', category: 'talent', type: 'ability', level: 50 },
  '184367': { name: 'Rampage', class: 'WARRIOR', category: 'fury', type: 'ability', level: 12 },
  '190411': { name: 'Whirlwind', class: 'WARRIOR', category: 'fury', type: 'ability', level: 18 },
  '202168': { name: 'Impending Victory', class: 'WARRIOR', category: 'talent', type: 'ability', level: 25 },
  '260708': { name: 'Sweeping Strikes', class: 'WARRIOR', category: 'arms', type: 'ability', level: 18 },
  '384318': { name: 'Thunderous Roar', class: 'WARRIOR', category: 'talent', type: 'ability', level: 55 },

  // 성기사 기본 스킬
  '633': { name: 'Lay on Hands', class: 'PALADIN', category: 'baseline', type: 'ability', level: 13 },
  '642': { name: 'Divine Shield', class: 'PALADIN', category: 'baseline', type: 'ability', level: 18 },
  '853': { name: 'Hammer of Justice', class: 'PALADIN', category: 'baseline', type: 'ability', level: 5 },
  '1022': { name: 'Blessing of Protection', class: 'PALADIN', category: 'baseline', type: 'ability', level: 10 },
  '1044': { name: 'Blessing of Freedom', class: 'PALADIN', category: 'baseline', type: 'ability', level: 22 },
  '19750': { name: 'Flash of Light', class: 'PALADIN', category: 'holy', type: 'ability', level: 4 },
  '20473': { name: 'Holy Shock', class: 'PALADIN', category: 'holy', type: 'ability', level: 10 },
  '24275': { name: 'Hammer of Wrath', class: 'PALADIN', category: 'baseline', type: 'ability', level: 46 },
  '31884': { name: 'Avenging Wrath', class: 'PALADIN', category: 'baseline', type: 'ability', level: 37 },
  '31935': { name: 'Avenger\'s Shield', class: 'PALADIN', category: 'protection', type: 'ability', level: 10 },
  '85222': { name: 'Light of Dawn', class: 'PALADIN', category: 'holy', type: 'ability', level: 39 },
  '184662': { name: 'Shield of Vengeance', class: 'PALADIN', category: 'retribution', type: 'ability', level: 15 },

  // 추가 클래스들도 이런 식으로...
};

// 한국어 번역 데이터 (WoWhead 공식)
const koreanTranslations = {
  // 전사
  '100': '돌진',
  '355': '도발',
  '1464': '강타',
  '1680': '소용돌이',
  '1715': '무력화',
  '1719': '무모한 희생',
  '2565': '방패 막기',
  '5246': '위협의 외침',
  '6343': '천둥벼락',
  '6544': '영웅의 도약',
  '6552': '자루 공격',
  '6572': '복수',
  '6673': '전투의 외침',
  '12294': '죽음의 일격',
  '18499': '광전사의 격노',
  '23881': '피의 갈증',
  '23920': '주문 반사',
  '23922': '방패 밀쳐내기',
  '46924': '칼날폭풍',
  '85288': '성난 일격',
  '97462': '재집결의 함성',
  '107574': '투신',
  '184367': '광란',
  '190411': '소용돌이',
  '202168': '압도적인 승리',
  '260708': '휩쓸기 일격',
  '384318': '천둥의 포효',

  // 성기사
  '633': '신의 축복',
  '642': '신의 보호막',
  '853': '심판의 망치',
  '1022': '보호의 축복',
  '1044': '자유의 축복',
  '19750': '빛의 섬광',
  '20473': '신성 충격',
  '24275': '천벌의 망치',
  '31884': '응징의 격노',
  '31935': '복수자의 방패',
  '85222': '빛의 서광',
  '184662': '복수의 보호막',

  // 추가 번역...
};

// 아이콘 매핑 데이터
const iconMappings = {
  // 전사
  '100': 'ability_warrior_charge',
  '355': 'spell_nature_reincarnation',
  '1464': 'ability_warrior_decisivestrike',
  '1680': 'ability_whirlwind',
  '1715': 'ability_shockwave',
  '1719': 'warrior_talent_icon_innerrage',
  '2565': 'ability_defend',
  '5246': 'ability_golemthunderclap',
  '6343': 'spell_nature_thunderclap',
  '6544': 'ability_heroicleap',
  '6552': 'inv_gauntlets_04',
  '6572': 'ability_warrior_revenge',
  '6673': 'ability_warrior_battleshout',
  '12294': 'ability_warrior_savageblow',
  '18499': 'spell_nature_ancestralguardian',
  '23881': 'spell_nature_bloodlust',
  '23920': 'ability_warrior_shieldreflection',
  '23922': 'inv_shield_05',
  '46924': 'ability_warrior_bladestorm',
  '85288': 'warrior_wild_strike',
  '97462': 'ability_warrior_rallyingcry',
  '107574': 'warrior_talent_icon_avatar',
  '184367': 'ability_warrior_rampage',
  '190411': 'ability_whirlwind',
  '202168': 'spell_impending_victory',
  '260708': 'ability_rogue_slicedice',
  '384318': 'ability_warrior_dragonroar',

  // 성기사
  '633': 'spell_holy_layonhands',
  '642': 'spell_holy_divineshield',
  '853': 'spell_holy_sealofmight',
  '1022': 'spell_holy_sealofprotection',
  '1044': 'spell_holy_sealofvalor',
  '19750': 'spell_holy_flashheal',
  '20473': 'spell_holy_searinglight',
  '24275': 'spell_holy_blessingofstrength',
  '31884': 'spell_holy_avenginewrath',
  '31935': 'spell_holy_avengersshield',
  '85222': 'spell_paladin_lightofdawn',
  '184662': 'ability_paladin_shieldofthetemplar',

  // 추가 아이콘...
};

// 스킬 설명 데이터
const skillDescriptions = {
  // 전사
  '100': '8-25미터 거리의 적에게 돌진하여 적을 3초 동안 이동 불가 상태로 만듭니다.',
  '355': '대상을 도발하여 3초 동안 자신을 공격하게 만듭니다.',
  '1464': '대상을 강타하여 무기 피해의 150%를 입히고 심각한 상처 효과를 발생시킵니다.',
  '6343': '주변의 모든 적에게 물리 피해를 입히고 공격 속도를 20% 감소시킵니다.',
  '6544': '최대 40미터 거리로 도약합니다.',
  '6552': '대상의 시전을 차단하고 4초 동안 같은 계열의 주문을 시전할 수 없게 합니다.',
  '6572': '적을 공격하여 물리 피해를 입히고 생성된 분노를 회복합니다.',
  '6673': '10초 동안 파티원의 공격력을 5% 증가시킵니다.',
  '18499': '광전사의 격노를 발동하여 10초 동안 공포, 꼬임, 무력화 효과에 면역이 됩니다.',
  '23881': '대상을 공격하여 물리 피해를 입히고 즉시 생명력을 회복합니다.',
  '23920': '5초 동안 모든 주문을 반사합니다.',
  '23922': '방패로 적을 강타하여 높은 위협 수준을 생성합니다.',
  '46924': '주변의 모든 적에게 8초 동안 물리 피해를 입힙니다.',
  '97462': '10초 동안 파티원의 최대 생명력을 15% 증가시킵니다.',
  '107574': '20초 동안 최대 생명력이 20% 증가하고 피해가 20% 증가합니다.',

  // 성기사
  '633': '대상의 생명력을 즉시 최대치로 회복시킵니다. 10분 재사용 대기시간.',
  '642': '8초 동안 모든 피해에 면역이 됩니다.',
  '853': '4초 동안 대상을 기절시킵니다.',
  '1022': '10초 동안 물리 피해에 면역이 되지만 공격과 주문 시전이 불가능합니다.',
  '1044': '10초 동안 이동 불가 및 속도 감소 효과에서 해방됩니다.',
  '19750': '빠르게 시전하는 치유 주문입니다.',
  '20473': '적에게 신성 피해를 입히거나 아군을 치유합니다.',
  '24275': '생명력이 20% 이하인 적에게 신성 피해를 입힙니다.',
  '31884': '20초 동안 피해와 치유가 20% 증가합니다.',
  '31935': '적에게 방패를 던져 신성 피해를 입히고 침묵시킵니다.',
  '85222': '전방 범위의 아군을 치유합니다.',
  '184662': '받는 피해를 흡수하는 보호막을 생성합니다.',

  // 추가 설명...
};

// 재사용 대기시간 및 자원 정보
const cooldownAndResources = {
  // 전사
  '100': { cooldown: '20초', resource: { type: '분노', amount: 0 }, range: '8-25미터' },
  '355': { cooldown: '8초', resource: { type: '분노', amount: 0 }, range: '30미터' },
  '1464': { cooldown: '즉시', resource: { type: '분노', amount: 20 } },
  '6343': { cooldown: '6초', resource: { type: '분노', amount: 0 }, range: '8미터' },
  '6544': { cooldown: '45초', resource: { type: '분노', amount: 0 }, range: '40미터' },
  '6552': { cooldown: '15초', resource: { type: '분노', amount: 0 }, range: '근접' },
  '6572': { cooldown: '즉시', resource: { type: '분노', amount: 0 } },
  '6673': { cooldown: '즉시', resource: { type: '분노', amount: 10 } },
  '18499': { cooldown: '60초', resource: { type: '분노', amount: 0 } },
  '23881': { cooldown: '4.5초', resource: { type: '분노', amount: 10 } },
  '23920': { cooldown: '25초', resource: { type: '분노', amount: 0 } },
  '23922': { cooldown: '9초', resource: { type: '분노', amount: 15 } },
  '46924': { cooldown: '60초', resource: { type: '분노', amount: 0 } },
  '97462': { cooldown: '180초', resource: { type: '분노', amount: 0 } },
  '107574': { cooldown: '90초', resource: { type: '분노', amount: 0 } },

  // 성기사
  '633': { cooldown: '600초', resource: { type: '마나', amount: 0 }, range: '40미터' },
  '642': { cooldown: '300초', resource: { type: '마나', amount: 0 } },
  '853': { cooldown: '60초', resource: { type: '마나', amount: '3%' }, range: '10미터' },
  '1022': { cooldown: '300초', resource: { type: '마나', amount: '3%' }, range: '40미터' },
  '1044': { cooldown: '25초', resource: { type: '마나', amount: '3%' }, range: '40미터' },
  '19750': { cooldown: '즉시', resource: { type: '마나', amount: '4%' }, range: '40미터' },
  '20473': { cooldown: '9초', resource: { type: '마나', amount: '2%' }, range: '40미터' },
  '24275': { cooldown: '즉시', resource: { type: '마나', amount: '3%' }, range: '30미터' },
  '31884': { cooldown: '120초', resource: { type: '마나', amount: 0 } },
  '31935': { cooldown: '15초', resource: { type: '마나', amount: '3%' }, range: '30미터' },
  '85222': { cooldown: '즉시', resource: { type: '마나', amount: '15%' }, range: '15미터' },
  '184662': { cooldown: '120초', resource: { type: '마나', amount: 0 } },

  // 추가 정보...
};

// ============================================
// 2. 데이터베이스 구축 함수
// ============================================

function buildCompleteDatabase() {
  const completeDB = {};

  // 모든 기본 스킬 데이터를 순회
  Object.keys(baseSkillData).forEach(id => {
    const baseData = baseSkillData[id];

    // 통합 스킬 데이터 구성
    completeDB[id] = {
      // 기본 정보
      name: baseData.name,
      koreanName: koreanTranslations[id] || baseData.name,
      class: baseData.class,
      category: baseData.category,
      type: baseData.type,
      level: baseData.level,

      // 아이콘
      icon: iconMappings[id] || 'inv_misc_questionmark',

      // 설명
      description: skillDescriptions[id] || '',

      // 재사용 대기시간 및 자원
      cooldown: cooldownAndResources[id]?.cooldown || '',
      resource: cooldownAndResources[id]?.resource || null,
      range: cooldownAndResources[id]?.range || '',

      // 메타데이터
      patch: '11.2.0',
      lastUpdated: new Date().toISOString()
    };
  });

  return completeDB;
}

// ============================================
// 3. 데이터베이스 저장
// ============================================

function saveDatabase(db) {
  const outputPath = path.join(__dirname, 'src/data/completeSkillDatabase.js');

  const fileContent = `/**
 * World of Warcraft 통합 스킬 데이터베이스
 *
 * 이 파일은 자동 생성됩니다.
 * 수동으로 편집하지 마세요. build-complete-database.js를 사용하세요.
 *
 * 패치: 11.2.0
 * 생성일: ${new Date().toISOString()}
 * 총 스킬 수: ${Object.keys(db).length}
 */

export const completeSkillDatabase = ${JSON.stringify(db, null, 2)};

// 헬퍼 함수들
export function getSkillById(id) {
  return completeSkillDatabase[id] || null;
}

export function getSkillsByClass(className) {
  return Object.values(completeSkillDatabase)
    .filter(skill => skill.class === className);
}

export function searchSkills(query) {
  const lowerQuery = query.toLowerCase();
  return Object.values(completeSkillDatabase)
    .filter(skill =>
      skill.name.toLowerCase().includes(lowerQuery) ||
      skill.koreanName.toLowerCase().includes(lowerQuery) ||
      (skill.description && skill.description.toLowerCase().includes(lowerQuery))
    );
}

// 통계
export const databaseStats = {
  total: ${Object.keys(db).length},
  byClass: {
    WARRIOR: ${Object.values(db).filter(s => s.class === 'WARRIOR').length},
    PALADIN: ${Object.values(db).filter(s => s.class === 'PALADIN').length},
    HUNTER: ${Object.values(db).filter(s => s.class === 'HUNTER').length},
    ROGUE: ${Object.values(db).filter(s => s.class === 'ROGUE').length},
    PRIEST: ${Object.values(db).filter(s => s.class === 'PRIEST').length},
    SHAMAN: ${Object.values(db).filter(s => s.class === 'SHAMAN').length},
    MAGE: ${Object.values(db).filter(s => s.class === 'MAGE').length},
    WARLOCK: ${Object.values(db).filter(s => s.class === 'WARLOCK').length},
    MONK: ${Object.values(db).filter(s => s.class === 'MONK').length},
    DRUID: ${Object.values(db).filter(s => s.class === 'DRUID').length},
    DEMONHUNTER: ${Object.values(db).filter(s => s.class === 'DEMONHUNTER').length},
    DEATHKNIGHT: ${Object.values(db).filter(s => s.class === 'DEATHKNIGHT').length},
    EVOKER: ${Object.values(db).filter(s => s.class === 'EVOKER').length}
  },
  withIcon: ${Object.values(db).filter(s => s.icon && s.icon !== 'inv_misc_questionmark').length},
  withDescription: ${Object.values(db).filter(s => s.description).length},
  withCooldown: ${Object.values(db).filter(s => s.cooldown).length}
};
`;

  fs.writeFileSync(outputPath, fileContent, 'utf8');
  console.log(`✅ 데이터베이스 저장 완료: ${outputPath}`);
}

// ============================================
// 4. 실행
// ============================================

console.log('🔨 통합 데이터베이스 구축 시작...\n');

const database = buildCompleteDatabase();
saveDatabase(database);

// 통계 출력
const stats = {
  total: Object.keys(database).length,
  withIcon: Object.values(database).filter(s => s.icon && s.icon !== 'inv_misc_questionmark').length,
  withKorean: Object.values(database).filter(s => s.koreanName !== s.name).length,
  withDescription: Object.values(database).filter(s => s.description).length,
  withCooldown: Object.values(database).filter(s => s.cooldown).length
};

console.log('\n📊 데이터베이스 구축 완료!');
console.log('='.repeat(40));
console.log(`총 스킬 수: ${stats.total}`);
console.log(`아이콘 보유: ${stats.withIcon} (${(stats.withIcon/stats.total*100).toFixed(1)}%)`);
console.log(`한국어 번역: ${stats.withKorean} (${(stats.withKorean/stats.total*100).toFixed(1)}%)`);
console.log(`설명 보유: ${stats.withDescription} (${(stats.withDescription/stats.total*100).toFixed(1)}%)`);
console.log(`재사용 대기시간: ${stats.withCooldown} (${(stats.withCooldown/stats.total*100).toFixed(1)}%)`);
console.log('='.repeat(40));

console.log('\n✨ 이제 사이트에서는 completeSkillDatabase를 import하여 사용하면 됩니다!');
console.log('예: import { completeSkillDatabase, getSkillById, searchSkills } from "./data/completeSkillDatabase";');