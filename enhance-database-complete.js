// 전체 데이터베이스 보완 스크립트 (한글/영어 버전 포함)
const fs = require('fs');
const path = require('path');

console.log('🔧 전체 데이터베이스 보완 작업 시작...\n');
console.log('📌 한글 및 영어 버전 데이터 포함\n');

// 1. 현재 데이터베이스 로드
const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');
const dbMatch = dbContent.match(/export const koreanSpellDatabase = ({[\s\S]*?});/);

let database = {};
try {
  database = eval('(' + dbMatch[1] + ')');
  console.log(`✅ 현재 데이터베이스 로드: ${Object.keys(database).length}개 스킬\n`);
} catch (e) {
  console.error('❌ 데이터베이스 로드 실패:', e.message);
  process.exit(1);
}

// 2. 스킬 ID별 클래스 매핑 (주요 스킬 기반)
const skillClassMap = {
  // 전사 (Warrior)
  '100': 'Warrior', // 돌진
  '355': 'Warrior', // 도발
  '772': 'Warrior', // 분쇄
  '1715': 'Warrior', // 사나운 강타
  '5308': 'Warrior', // 처형
  '6552': 'Warrior', // 자루 공격
  '12294': 'Warrior', // 죽음의 일격
  '23881': 'Warrior', // 피의 갈증

  // 성기사 (Paladin)
  '19750': 'Paladin', // 빛의 섬광
  '20473': 'Paladin', // 신성 충격
  '31935': 'Paladin', // 응징의 방패
  '35395': 'Paladin', // 성전사의 일격
  '53600': 'Paladin', // 정의의 방패
  '85256': 'Paladin', // 기사단의 선고

  // 사냥꾼 (Hunter)
  '883': 'Hunter', // 야수 부르기
  '982': 'Hunter', // 야수의 회복
  '2643': 'Hunter', // 조준 사격
  '19434': 'Hunter', // 일제 사격
  '34026': 'Hunter', // 살상 명령
  '53351': 'Hunter', // 폭발 사격

  // 도적 (Rogue)
  '408': 'Rogue', // 급소 가격
  '703': 'Rogue', // 목조르기
  '1329': 'Rogue', // 절단
  '1752': 'Rogue', // 사악한 일격
  '1856': 'Rogue', // 소멸
  '1943': 'Rogue', // 파열
  '2098': 'Rogue', // 절개

  // 사제 (Priest)
  '17': 'Priest', // 신의 권능: 보호막
  '585': 'Priest', // 성스러운 일격
  '586': 'Priest', // 소실
  '589': 'Priest', // 어둠의 권능: 고통
  '2061': 'Priest', // 순간 치유
  '8092': 'Priest', // 정신 폭발

  // 죽음의 기사 (Death Knight)
  '43265': 'Death Knight', // 죽음과 부패
  '45524': 'Death Knight', // 사자의 사슬
  '47528': 'Death Knight', // 정신 얼리기
  '48707': 'Death Knight', // 대마법 보호막
  '49576': 'Death Knight', // 죽음의 손아귀

  // 주술사 (Shaman)
  '51505': 'Shaman', // 용암 폭발
  '51514': 'Shaman', // 사술
  '60103': 'Shaman', // 용암 채찍
  '61295': 'Shaman', // 치유의 비
  '114074': 'Shaman', // 용암 광선

  // 마법사 (Mage)
  '116': 'Mage', // 얼음 화살
  '120': 'Mage', // 냉기 돌풍
  '122': 'Mage', // 얼음 회오리
  '133': 'Mage', // 화염구
  '2136': 'Mage', // 화염 폭풍
  '2948': 'Mage', // 불타는 갑옷

  // 흑마법사 (Warlock)
  '172': 'Warlock', // 부패
  '348': 'Warlock', // 제물
  '686': 'Warlock', // 어둠의 화살
  '702': 'Warlock', // 무력화 저주
  '980': 'Warlock', // 고통
  '1454': 'Warlock', // 생명력 흡수

  // 수도사 (Monk)
  '100784': 'Monk', // 흑우 차기
  '107428': 'Monk', // 폭풍과 대지의 일격
  '115069': 'Monk', // 범무늬 향
  '115078': 'Monk', // 마비

  // 드루이드 (Druid)
  '740': 'Druid', // 평온
  '774': 'Druid', // 회복
  '1126': 'Druid', // 야생의 징표
  '5176': 'Druid', // 천벌
  '5215': 'Druid', // 숨기

  // 악마사냥꾼 (Demon Hunter)
  '162243': 'Demon Hunter', // 악마의 이빨
  '188501': 'Demon Hunter', // 공중 질주
  '191427': 'Demon Hunter', // 변신

  // 기원사 (Evoker)
  '355913': 'Evoker', // 물의 숨결
  '357208': 'Evoker', // 불의 숨결
  '361195': 'Evoker', // 보존의 축복
};

// 3. 아이콘 이름 생성 함수
function generateIconName(skill) {
  const name = (skill.koreanName || skill.name || '').toLowerCase();

  // 특수 매핑
  const iconMap = {
    '신의 권능: 보호막': 'spell_holy_powerwordshield',
    '돌진': 'ability_warrior_charge',
    '얼음 화살': 'spell_frost_frostbolt02',
    '냉기 돌풍': 'spell_frost_arcticwinds',
    '얼음 회오리': 'spell_frost_icestorm',
    '화염구': 'spell_fire_flamebolt',
    '소생': 'spell_holy_resurrection',
    '부패': 'spell_shadow_abominationexplosion',
    '제물': 'spell_fire_immolation',
    '도발': 'spell_nature_reincarnation',
    '급소 가격': 'ability_rogue_kidneyshot',
    '정화': 'spell_holy_dispelmagic',
    '성스러운 일격': 'spell_holy_holysmite',
    '소실': 'spell_magic_lesserinvisibilty',
    '어둠의 화살': 'spell_shadow_shadowbolt',
    '무력화 저주': 'spell_shadow_curseofmannoroth',
    '목조르기': 'ability_rogue_garrote',
    '평온': 'spell_nature_tranquility',
    '분쇄': 'ability_ghoulfrenzy',
    '회복': 'spell_nature_rejuvenation'
  };

  if (iconMap[skill.koreanName]) {
    return iconMap[skill.koreanName];
  }

  // 일반적인 패턴
  if (name.includes('화염') || name.includes('fire')) return 'spell_fire_flamebolt';
  if (name.includes('냉기') || name.includes('frost')) return 'spell_frost_frostbolt02';
  if (name.includes('신성') || name.includes('holy')) return 'spell_holy_holybolt';
  if (name.includes('암흑') || name.includes('shadow')) return 'spell_shadow_shadowbolt';
  if (name.includes('자연') || name.includes('nature')) return 'spell_nature_lightning';
  if (name.includes('비전') || name.includes('arcane')) return 'spell_arcane_blast';

  return 'inv_misc_questionmark';
}

// 4. 영어 번역 추가
const englishTranslations = {
  // 전사
  '100': 'Charge',
  '355': 'Taunt',
  '772': 'Rend',
  '1715': 'Hamstring',
  '5308': 'Execute',
  '6552': 'Pummel',
  '12294': 'Mortal Strike',
  '23881': 'Bloodthirst',

  // 성기사
  '17': 'Power Word: Shield',
  '19750': 'Flash of Light',
  '20473': 'Holy Shock',
  '31935': 'Avenger\'s Shield',
  '35395': 'Crusader Strike',
  '53600': 'Shield of the Righteous',
  '85256': 'Templar\'s Verdict',

  // 사제
  '585': 'Smite',
  '586': 'Fade',
  '589': 'Shadow Word: Pain',
  '2061': 'Flash Heal',
  '8092': 'Mind Blast',

  // 마법사
  '116': 'Frostbolt',
  '120': 'Cone of Cold',
  '122': 'Frost Nova',
  '133': 'Fireball',
  '2136': 'Fire Blast',

  // 기타
  '139': 'Renew',
  '172': 'Corruption',
  '348': 'Immolate',
  '408': 'Kidney Shot',
  '527': 'Purify',
  '686': 'Shadow Bolt',
  '702': 'Curse of Weakness',
  '703': 'Garrote',
  '740': 'Tranquility',
  '774': 'Rejuvenation',

  // TWW 신규
  '114074': 'Lava Beam',
  '432467': 'Sun\'s Avatar',
  '440029': 'Reaper\'s Mark',
  '441598': 'Ravage',
  '442325': 'Mass Eruption',
  '445701': 'Pack Coordination',
  '453570': 'Perfected Form'
};

// 5. 한글명 누락 스킬 보완
const missingKoreanNames = {
  '114074': '용암 광선',
  '432467': '태양의 화신',
  '440029': '사신의 표식',
  '441598': '파멸',
  '442325': '대규모 분출',
  '445701': '무리 조율',
  '453570': '완벽한 형상'
};

// 6. 데이터베이스 보완
let enhancedCount = 0;
let iconAddedCount = 0;
let classAddedCount = 0;
let englishAddedCount = 0;
let koreanAddedCount = 0;

Object.entries(database).forEach(([skillId, skill]) => {
  let modified = false;

  // 아이콘 추가
  if (!skill.icon && !skill.iconName) {
    skill.iconName = generateIconName(skill);
    iconAddedCount++;
    modified = true;
  }

  // 클래스 정보 추가
  if (!skill.class || skill.class === 'Unknown') {
    if (skillClassMap[skillId]) {
      skill.class = skillClassMap[skillId];
      classAddedCount++;
      modified = true;
    }
  }

  // 영어명 추가
  if (!skill.englishName && englishTranslations[skillId]) {
    skill.englishName = englishTranslations[skillId];
    englishAddedCount++;
    modified = true;
  }

  // 한글명 추가
  if (!skill.koreanName && missingKoreanNames[skillId]) {
    skill.koreanName = missingKoreanNames[skillId];
    koreanAddedCount++;
    modified = true;
  }

  // 영어 설명 추가 (없는 경우)
  if (!skill.englishDescription && skill.description) {
    skill.englishDescription = skill.description; // 임시로 한글 설명 복사
  }

  // 카테고리 기본값
  if (!skill.category) {
    skill.category = 'baseline';
    modified = true;
  }

  // 타입 기본값
  if (!skill.type) {
    skill.type = 'active';
    modified = true;
  }

  if (modified) {
    enhancedCount++;
  }
});

console.log('📊 보완 결과:');
console.log(`  - 전체 보완된 스킬: ${enhancedCount}개`);
console.log(`  - 아이콘 추가: ${iconAddedCount}개`);
console.log(`  - 클래스 정보 추가: ${classAddedCount}개`);
console.log(`  - 영어명 추가: ${englishAddedCount}개`);
console.log(`  - 한글명 추가: ${koreanAddedCount}개`);

// 7. 다국어 지원 데이터베이스 구조 생성
const multilingualDatabase = {
  metadata: {
    version: '11.2.0',
    patch: 'TWW Season 3',
    languages: ['ko', 'en'],
    lastUpdated: new Date().toISOString(),
    totalSkills: Object.keys(database).length
  },
  skills: database
};

// 8. 저장
const jsContent = `// TWW Season 3 다국어 지원 스킬 데이터베이스
// 총 ${Object.keys(database).length}개 스킬 (한글/영어)
// 패치: 11.2.0 (TWW Season 3)
// 생성일: ${new Date().toISOString()}

export const koreanSpellDatabase = ${JSON.stringify(database, null, 2)};

// 다국어 지원 함수
export function getKoreanSpellData(spellId) {
  return koreanSpellDatabase[spellId] || null;
}

export function getEnglishSpellData(spellId) {
  const skill = koreanSpellDatabase[spellId];
  if (!skill) return null;

  return {
    ...skill,
    name: skill.englishName || skill.name,
    description: skill.englishDescription || skill.description
  };
}

// 언어별 스킬 데이터 가져오기
export function getSpellData(spellId, language = 'ko') {
  const skill = koreanSpellDatabase[spellId];
  if (!skill) return null;

  if (language === 'en') {
    return {
      ...skill,
      name: skill.englishName || skill.name,
      description: skill.englishDescription || skill.description
    };
  }

  return skill;
}

// 전문화별 차이가 있는 스킬 확인
export function getSpecializationDifferences(spellId) {
  const skill = koreanSpellDatabase[spellId];
  return skill?.specializationDetails || null;
}

// 영웅 특성 정보 확인 (TWW)
export function getHeroTalentInfo(spellId) {
  const skill = koreanSpellDatabase[spellId];
  return skill?.heroTalents || null;
}

// 클래스별 스킬 필터링
export function getSkillsByClass(className) {
  return Object.entries(koreanSpellDatabase)
    .filter(([id, skill]) => skill.class === className)
    .reduce((acc, [id, skill]) => {
      acc[id] = skill;
      return acc;
    }, {});
}

// 검색 함수
export function searchSkills(query, language = 'ko') {
  const searchTerm = query.toLowerCase();
  return Object.entries(koreanSpellDatabase)
    .filter(([id, skill]) => {
      const nameToSearch = language === 'en'
        ? (skill.englishName || skill.name || '').toLowerCase()
        : (skill.koreanName || skill.name || '').toLowerCase();
      return nameToSearch.includes(searchTerm);
    })
    .map(([id, skill]) => ({
      id,
      ...skill
    }));
}

// 데이터 구조
// {
//   "스킬ID": {
//     name: "영문명",
//     englishName: "영문명 (명시적)",
//     koreanName: "한글명",
//     description: "한글 설명",
//     englishDescription: "영어 설명",
//     cooldown: "재사용대기시간",
//     resource: { type, amount, display },
//     resourceGenerate: { type, amount, display },
//     range: "사정거리",
//     castTime: "시전시간",
//     duration: "지속시간",
//     iconName: "아이콘명",
//     class: "클래스",
//     category: "baseline|talent|pvp|heroTalent",
//     type: "active|passive|proc",
//     school: "physical|holy|fire|frost|nature|shadow|arcane",
//     specializationDetails: { // 전문화별 차이
//       holy: { available, modifications },
//       protection: { available, modifications },
//       retribution: { available, modifications }
//     },
//     talentInteractions: { // 특성 상호작용
//       modifiedBy: [],
//       modifies: [],
//       replaces: null,
//       replacedBy: null
//     },
//     heroTalents: { // TWW 영웅 특성
//       herald_of_the_sun: { available, modifications },
//       lightsmith: { available, modifications },
//       templar: { available, modifications }
//     }
//   }
// }
`;

fs.writeFileSync(dbPath, jsContent, 'utf8');
console.log(`\n✅ 다국어 지원 데이터베이스 저장: ${dbPath}`);

// 9. JSON 백업 생성
const jsonPath = path.join(__dirname, 'src/data/multilingual-spell-database.json');
fs.writeFileSync(jsonPath, JSON.stringify(multilingualDatabase, null, 2), 'utf8');
console.log(`📄 JSON 백업 생성: ${jsonPath}`);

console.log('\n🎉 전체 데이터베이스 보완 완료!');
console.log('📌 한글/영어 버전 모두 지원 가능');