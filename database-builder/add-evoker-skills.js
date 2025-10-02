// 기원사 스킬 추가 스크립트
const fs = require('fs').promises;
const path = require('path');

// 기원사 기본 스킬 데이터 (ko.wowhead.com 검증 기반)
const EVOKER_SKILLS = {
  // 황폐 (Devastation) 핵심 스킬
  '356995': {
    id: '356995',
    englishName: 'Disintegrate',
    koreanName: '파열',
    icon: 'ability_evoker_disintegrate',
    type: '기본',
    spec: '황폐',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: '3 seconds',
    school: 'Frost, Arcane',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '3 정수',
    range: '25 야드',
    castTime: '집중',
    cooldown: '해당 없음',
    description: '작렬하는 푸른색 마법으로 적을 찢어 3초에 걸쳐 비전냉기 피해를 입히고 3초 동안 이동 속도를 50%만큼 감소시킵니다.',
    resourceGain: '없음'
  },
  '357208': {
    id: '357208',
    englishName: 'Fire Breath',
    koreanName: '불의 숨결',
    icon: 'ability_evoker_firebreath',
    type: '기본',
    spec: '황폐',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: '2.5 seconds',
    school: 'Fire',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '1 정수',
    range: '30 야드',
    castTime: '조준',
    cooldown: '30 초',
    description: '전방의 적에게 화염 피해를 입힙니다.',
    resourceGain: '없음'
  },
  '357211': {
    id: '357211',
    englishName: 'Pyre',
    koreanName: '기염',
    icon: 'ability_evoker_pyre',
    type: '기본',
    spec: '황폐',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: 'n/a',
    school: 'Fire',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '2 정수',
    range: '25 야드',
    castTime: '조준',
    cooldown: '해당 없음',
    description: '대상에게 강렬한 화염을 발사하여 화염 피해를 입힙니다.',
    resourceGain: '없음'
  },
  '359073': {
    id: '359073',
    englishName: 'Eternity Surge',
    koreanName: '영원의 쇄도',
    icon: 'ability_evoker_eternitysurge',
    type: '기본',
    spec: '황폐',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: 'n/a',
    school: 'Spellfrost',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '2 정수',
    range: '25 야드',
    castTime: '조준',
    cooldown: '해당 없음',
    description: '푸른 마법을 집중시켜 적에게 비전냉기 피해를 입힙니다.',
    resourceGain: '없음'
  },
  '362969': {
    id: '362969',
    englishName: 'Azure Strike',
    koreanName: '하늘빛 일격',
    icon: 'ability_evoker_azurestrike',
    type: '기본',
    spec: '황폐',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: 'n/a',
    school: 'Spellfrost',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '없음',
    range: '25 야드',
    castTime: '즉시',
    cooldown: '해당 없음',
    description: '빠른 푸른 투사체를 발사하여 적에게 비전냉기 피해를 입힙니다.',
    resourceGain: '1 정수'
  },
  '361500': {
    id: '361500',
    englishName: 'Living Flame',
    koreanName: '살아있는 불꽃',
    icon: 'ability_evoker_livingflame',
    type: '기본',
    spec: '공용',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: 'n/a',
    school: 'Fire',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '없음',
    range: '25 야드',
    castTime: '2 초',
    cooldown: '해당 없음',
    description: '대상에게 살아있는 불꽃을 보냅니다. 적에게는 화염 피해를 입히고 아군은 치유합니다.',
    resourceGain: '1 정수'
  },

  // 보존 (Preservation) 핵심 스킬
  '355913': {
    id: '355913',
    englishName: 'Emerald Blossom',
    koreanName: '에메랄드 꽃',
    icon: 'ability_evoker_emeraldblossom',
    type: '기본',
    spec: '보존',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: '1.5 seconds',
    school: 'Nature',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '3 정수',
    range: '25 야드',
    castTime: '즉시',
    cooldown: '30 초',
    description: '대상 아군의 위치에 에메랄드의 꿈의 구근을 자라나게 합니다. 1.5초 후에 10미터 내에 있는 최대 3명의 부상당한 아군을 치유합니다.',
    resourceGain: '없음'
  },
  '366155': {
    id: '366155',
    englishName: 'Reversion',
    koreanName: '역행',
    icon: 'ability_evoker_reversion',
    type: '기본',
    spec: '보존',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: '12 seconds',
    school: 'Bronze',
    mechanic: 'n/a',
    dispelType: 'Magic',
    gcd: 'Normal',
    resourceCost: '1 정수',
    range: '30 야드',
    castTime: '즉시',
    cooldown: '해당 없음',
    description: '대상 아군에게 시간 역행을 적용하여 12초에 걸쳐 치유합니다.',
    resourceGain: '없음'
  },
  '367226': {
    id: '367226',
    englishName: 'Spiritbloom',
    koreanName: '영혼꽃',
    icon: 'ability_evoker_spiritbloom',
    type: '기본',
    spec: '보존',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: 'n/a',
    school: 'Nature',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '3 정수',
    range: '25 야드',
    castTime: '조준',
    cooldown: '해당 없음',
    description: '부상당한 아군에게 활력을 불어넣어 치유하고 인근 부상당한 아군에게도 감소된 양의 치유를 제공합니다.',
    resourceGain: '없음'
  },

  // 증강 (Augmentation) 핵심 스킬
  '395160': {
    id: '395160',
    englishName: 'Ebon Might',
    koreanName: '칠흑의 힘',
    icon: 'ability_evoker_ebonmight',
    type: '기본',
    spec: '증강',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: '10 seconds',
    school: 'Black',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '1 정수',
    range: '25 야드',
    castTime: '1.5 초',
    cooldown: '30 초',
    description: '당신과 최대 4명의 아군에게 칠흑의 힘을 부여하여 주 능력치를 증가시킵니다.',
    resourceGain: '없음'
  },
  '404972': {
    id: '404972',
    englishName: 'Eruption',
    koreanName: '분출',
    icon: 'ability_evoker_eruption',
    type: '기본',
    spec: '증강',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: 'n/a',
    school: 'Fire, Nature',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '3 정수',
    range: '25 야드',
    castTime: '2.5 초',
    cooldown: '해당 없음',
    description: '적의 발밑에 격렬한 분출을 일으켜 대상과 주위의 적에게 화산 피해를 나누어 입힙니다.',
    resourceGain: '없음'
  },
  '409311': {
    id: '409311',
    englishName: 'Prescience',
    koreanName: '예지',
    icon: 'ability_evoker_prescience',
    type: '기본',
    spec: '증강',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: '18 seconds',
    school: 'Bronze',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '없음',
    range: '25 야드',
    castTime: '즉시',
    cooldown: '12 초',
    description: '아군에게 예지를 부여하여 치명타 확률을 증가시킵니다.',
    resourceGain: '없음'
  },
  '403631': {
    id: '403631',
    englishName: 'Breath of Eons',
    koreanName: '영겁의 숨결',
    icon: 'ability_evoker_breathofeons',
    type: '기본',
    spec: '증강',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: '6 seconds',
    school: 'Bronze',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '4 정수',
    range: '30 야드',
    castTime: '조준',
    cooldown: '2 분',
    description: '시간의 숨결을 내뿜어 전방의 적에게 피해를 입히고 아군에게는 이익을 줍니다.',
    resourceGain: '없음'
  },

  // 공통 스킬
  '358267': {
    id: '358267',
    englishName: 'Hover',
    koreanName: '부양',
    icon: 'ability_evoker_hover',
    type: '기본',
    spec: '공용',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: '6 seconds',
    school: 'Physical',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Normal',
    resourceCost: '없음',
    range: '0 야드',
    castTime: '즉시',
    cooldown: '35 초',
    description: '공중에 떠올라 이동하면서 시전할 수 있게 됩니다.',
    resourceGain: '없음'
  },
  '363916': {
    id: '363916',
    englishName: 'Obsidian Scales',
    koreanName: '흑요석 비늘',
    icon: 'ability_evoker_obsidianscales',
    type: '기본',
    spec: '공용',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: '12 seconds',
    school: 'Black',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Off GCD',
    resourceCost: '없음',
    range: '0 야드',
    castTime: '즉시',
    cooldown: '2.5 분',
    description: '흑요석 비늘로 몸을 강화하여 받는 피해를 30% 감소시킵니다.',
    resourceGain: '없음'
  },
  '374348': {
    id: '374348',
    englishName: 'Renewing Blaze',
    koreanName: '소생의 화염',
    icon: 'ability_evoker_renewingblaze',
    type: '기본',
    spec: '공용',
    heroTalent: null,
    level: 1,
    pvp: false,
    duration: '8 seconds',
    school: 'Fire',
    mechanic: 'n/a',
    dispelType: 'n/a',
    gcd: 'Off GCD',
    resourceCost: '없음',
    range: '0 야드',
    castTime: '즉시',
    cooldown: '1.5 분',
    description: '생명력이 50% 이하로 떨어지면 즉시 최대 생명력의 30%를 회복하고 8초에 걸쳐 추가로 치유합니다.',
    resourceGain: '없음'
  }
};

async function addEvokerSkills() {
  try {
    console.log('🐉 기원사 스킬 추가 시작...');

    // 1. 현재 데이터베이스 로드
    const dbPath = path.join(__dirname, 'tww-s3-refined-database.json');
    const dbContent = await fs.readFile(dbPath, 'utf-8');
    const database = JSON.parse(dbContent);

    // 2. 기원사 스킬 추가
    let addedCount = 0;
    let updatedCount = 0;

    for (const [skillId, skillData] of Object.entries(EVOKER_SKILLS)) {
      if (database[skillId]) {
        // 이미 있는 스킬은 업데이트
        const before = database[skillId].koreanName;
        database[skillId] = { ...database[skillId], ...skillData };

        if (before !== skillData.koreanName) {
          console.log(`✅ 업데이트: ${skillId} - ${before} → ${skillData.koreanName}`);
          updatedCount++;
        }
      } else {
        // 새로운 스킬 추가
        database[skillId] = skillData;
        console.log(`➕ 추가: ${skillId} - ${skillData.koreanName} (${skillData.englishName})`);
        addedCount++;
      }
    }

    // 3. 업데이트된 데이터베이스 저장
    const outputPath = path.join(__dirname, 'tww-s3-refined-database-with-evoker.json');
    await fs.writeFile(outputPath, JSON.stringify(database, null, 2));

    console.log(`\n📊 처리 통계:`);
    console.log(`- 추가된 스킬: ${addedCount}개`);
    console.log(`- 업데이트된 스킬: ${updatedCount}개`);
    console.log(`- 저장 위치: ${outputPath}`);

    // 4. 원본 파일 백업
    const backupPath = path.join(__dirname, `tww-s3-refined-database-backup-before-evoker-${Date.now()}.json`);
    await fs.copyFile(dbPath, backupPath);
    console.log(`\n📦 원본 파일 백업: ${backupPath}`);

    return { addedCount, updatedCount };

  } catch (error) {
    console.error('❌ 추가 실패:', error);
    throw error;
  }
}

// 실행
if (require.main === module) {
  addEvokerSkills()
    .then(result => {
      console.log('\n✨ 기원사 스킬 추가 완료!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { addEvokerSkills };