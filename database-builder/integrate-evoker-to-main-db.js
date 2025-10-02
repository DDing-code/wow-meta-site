// 기원사 데이터를 메인 데이터베이스에 통합하는 스크립트
// ko.wowhead.com 검증된 데이터 기준

const fs = require('fs').promises;
const path = require('path');

// 기원사 스킬 데이터 - ko.wowhead.com 검증된 번역
const evokerSkills = [
  {
    id: "357208",
    englishName: "Fire Breath",
    koreanName: "불의 숨결",
    icon: "ability_evoker_firebreath",
    type: "기본",
    spec: "황폐",
    level: 1,
    pvp: false,
    school: "Fire",
    resourceCost: "없음",
    range: "30 야드",
    castTime: "2초 (강화)",
    cooldown: "30초",
    description: "심호흡 후 대상의 방향으로 화염을 분출하여 4초에 걸쳐 전방의 모든 적을 태워 화염 피해를 입힙니다. 강화 주문입니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "359073",
    englishName: "Eternity Surge",
    koreanName: "영원의 쇄도",
    icon: "ability_evoker_eternitysurge",
    type: "기본",
    spec: "황폐",
    level: 1,
    pvp: false,
    school: "Spellfrost",
    resourceCost: "없음",
    range: "25 야드",
    castTime: "2.5초 (강화)",
    cooldown: "30초",
    description: "격동하는 에너지로 대상에게 마력을 집중시켜 순수한 용의 마법 피해를 입힙니다. 강화 주문입니다.",
    resourceGain: "정수 1",
    class: "EVOKER"
  },
  {
    id: "357211",
    englishName: "Pyre",
    koreanName: "기염",
    icon: "ability_evoker_pyre",
    type: "기본",
    spec: "황폐",
    level: 1,
    pvp: false,
    school: "Fire",
    resourceCost: "정수 3",
    range: "25 야드",
    castTime: "즉시",
    cooldown: "없음",
    description: "적에게 뜨거운 불씨를 던져 화염 피해를 입히고 주변 적들에게도 피해를 입힙니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "375087",
    englishName: "Dragonrage",
    koreanName: "용의 분노",
    icon: "ability_evoker_dragonrage",
    type: "주요",
    spec: "황폐",
    level: 10,
    pvp: false,
    school: "Physical",
    resourceCost: "없음",
    range: "0 야드",
    castTime: "즉시",
    cooldown: "2분",
    description: "용의 전성기 형태로 변신하여 18초 동안 피해량이 40% 증가하고 정수 생성율이 100% 증가합니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "361500",
    englishName: "Living Flame",
    koreanName: "살아있는 불꽃",
    icon: "ability_evoker_livingflame",
    type: "기본",
    spec: "공용",
    level: 1,
    pvp: false,
    school: "Fire",
    resourceCost: "없음",
    range: "30 야드",
    castTime: "2초",
    cooldown: "없음",
    description: "살아있는 화염을 발사합니다. 적에게는 화염 피해를 입히고, 아군에게는 생명력을 회복시킵니다.",
    resourceGain: "정수 1",
    class: "EVOKER"
  },
  {
    id: "362969",
    englishName: "Azure Strike",
    koreanName: "하늘빛 일격",
    icon: "ability_evoker_azurestrike",
    type: "기본",
    spec: "공용",
    level: 1,
    pvp: false,
    school: "Frost",
    resourceCost: "없음",
    range: "25 야드",
    castTime: "즉시",
    cooldown: "없음",
    description: "하늘빛 마력으로 대상과 주변 2명의 적을 공격하여 냉기 피해를 입힙니다.",
    resourceGain: "정수 1",
    class: "EVOKER"
  },
  {
    id: "356995",
    englishName: "Disintegrate",
    koreanName: "파열",
    icon: "ability_evoker_disintegrate",
    type: "기본",
    spec: "황폐",
    level: 1,
    pvp: false,
    school: "Spellfrost",
    resourceCost: "없음",
    range: "30 야드",
    castTime: "3초 채널링",
    cooldown: "없음",
    description: "적에게 집중된 에너지 광선을 발사하여 3초 동안 채널링하며 매 0.3초마다 피해를 입힙니다.",
    resourceGain: "초당 정수 1",
    class: "EVOKER"
  },
  {
    id: "357210",
    englishName: "Deep Breath",
    koreanName: "깊은 숨결",
    icon: "ability_evoker_deepbreath",
    type: "주요",
    spec: "황폐",
    level: 10,
    pvp: false,
    school: "Fire",
    resourceCost: "없음",
    range: "50 야드",
    castTime: "즉시",
    cooldown: "2분",
    description: "공중으로 비상하여 대상 위치로 날아가며 경로의 모든 적에게 화염 피해를 입힙니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "370553",
    englishName: "Tip the Scales",
    koreanName: "저울 뒤집기",
    icon: "ability_evoker_tipthescales",
    type: "특성",
    spec: "황폐",
    level: 20,
    pvp: false,
    school: "Physical",
    resourceCost: "없음",
    range: "0 야드",
    castTime: "즉시",
    cooldown: "2분",
    description: "다음 강화 주문을 즉시 최대 강화 단계로 시전합니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "370452",
    englishName: "Shattering Star",
    koreanName: "산산이 부서지는 별",
    icon: "ability_evoker_chargedblast",
    type: "특성",
    spec: "황폐",
    level: 15,
    pvp: false,
    school: "Spellfrost",
    resourceCost: "없음",
    range: "25 야드",
    castTime: "즉시",
    cooldown: "1.5분",
    description: "폭발하는 화염 창을 던져 대상을 과녹하여 대상이 받는 피해가 20초 동안 20% 증가합니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "408092",
    englishName: "Essence Burst",
    koreanName: "정수 폭발",
    icon: "ability_evoker_essenceburst",
    type: "패시브",
    spec: "공용",
    level: 1,
    pvp: false,
    school: "Physical",
    resourceCost: "없음",
    range: "0 야드",
    castTime: "패시브",
    cooldown: "없음",
    description: "살아있는 불꽃이나 하늘빛 일격 시전 시 정수 폭발을 획득하여 다음 강화 주문이 강화 1단계에서 시작됩니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "375801",
    englishName: "Burnout",
    koreanName: "번아웃",
    icon: "ability_evoker_burnout",
    type: "특성",
    spec: "황폐",
    level: 20,
    pvp: false,
    school: "Physical",
    resourceCost: "없음",
    range: "0 야드",
    castTime: "패시브",
    cooldown: "없음",
    description: "화염 주문이 디버프를 가진 적에게 10%의 추가 피해를 입힙니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "443328",
    englishName: "Engulf",
    koreanName: "업화",
    icon: "ability_evoker_engulf",
    type: "영웅특성",
    spec: "황폐",
    heroTalent: "불꽃형성자",
    level: 70,
    pvp: false,
    school: "Fire",
    resourceCost: "없음",
    range: "0 야드",
    castTime: "패시브",
    cooldown: "없음",
    description: "불꽃형성자 특성. 강화 주문을 사용할 때마다 추가 피해를 입히는 폭발을 일으킵니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "431443",
    englishName: "Temporal Burst",
    koreanName: "시간 폭발",
    icon: "ability_evoker_temporalburst",
    type: "영웅특성",
    spec: "황폐",
    heroTalent: "시간 감시자",
    level: 70,
    pvp: false,
    school: "Arcane",
    resourceCost: "없음",
    range: "0 야드",
    castTime: "패시브",
    cooldown: "없음",
    description: "시간 감시자 특성. 정수를 소비할 때마다 추가 효과를 부여합니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "370960",
    englishName: "Emerald Communion",
    koreanName: "에메랄드 교감",
    icon: "ability_evoker_emerald",
    type: "유틸리티",
    spec: "공용",
    level: 25,
    pvp: false,
    school: "Nature",
    resourceCost: "없음",
    range: "0 야드",
    castTime: "즉시",
    cooldown: "3분",
    description: "에메랄드 꿈과 교감하여 생명력을 회복합니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "364342",
    englishName: "Blessing of the Bronze",
    koreanName: "청동의 축복",
    icon: "ability_evoker_blessing_bronze",
    type: "유틸리티",
    spec: "공용",
    level: 30,
    pvp: false,
    school: "Arcane",
    resourceCost: "없음",
    range: "30 야드",
    castTime: "즉시",
    cooldown: "15초",
    description: "아군 또는 자신에게 청동의 축복을 부여하여 10분 동안 이동 속도를 15% 증가시킵니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "363916",
    englishName: "Obsidian Scales",
    koreanName: "흑요석 비늘",
    icon: "ability_evoker_obsidianscales",
    type: "방어",
    spec: "공용",
    level: 15,
    pvp: false,
    school: "Physical",
    resourceCost: "없음",
    range: "0 야드",
    castTime: "즉시",
    cooldown: "2.5분",
    description: "12초 동안 받는 피해가 30% 감소합니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "368970",
    englishName: "Tail Swipe",
    koreanName: "꼬리 휘두르기",
    icon: "ability_evoker_tailswipe",
    type: "유틸리티",
    spec: "공용",
    level: 20,
    pvp: false,
    school: "Physical",
    resourceCost: "없음",
    range: "8 야드",
    castTime: "즉시",
    cooldown: "1.5분",
    description: "꼬리를 휘둘러 주변 모든 적을 밀쳐내고 4초 동안 70% 느려지게 합니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "357214",
    englishName: "Wing Buffet",
    koreanName: "날개 강타",
    icon: "ability_evoker_wingbuffet",
    type: "유틸리티",
    spec: "공용",
    level: 25,
    pvp: false,
    school: "Physical",
    resourceCost: "없음",
    range: "0 야드",
    castTime: "즉시",
    cooldown: "1.5분",
    description: "날개로 강타하여 전방의 적들을 밀쳐냅니다.",
    resourceGain: "없음",
    class: "EVOKER"
  },
  {
    id: "358385",
    englishName: "Landslide",
    koreanName: "산사태",
    icon: "ability_evoker_landslide",
    type: "군중제어",
    spec: "공용",
    level: 35,
    pvp: false,
    school: "Physical",
    resourceCost: "없음",
    range: "30 야드",
    castTime: "2.5초",
    cooldown: "1.5분",
    description: "대지를 뒤흔들어 30초 동안 대상을 제자리에 묶습니다.",
    resourceGain: "없음",
    class: "EVOKER"
  }
];

async function integrateEvokerToMainDB() {
  try {
    console.log('🔄 기원사 데이터 통합 시작...');

    // 1. 현재 메인 DB 로드
    const mainDBPath = path.join(__dirname, '..', 'src', 'data', 'twwS3FinalCleanedDatabase.js');
    const mainDBContent = await fs.readFile(mainDBPath, 'utf-8');

    // 2. export 구문을 제거하고 데이터만 추출
    const dataMatch = mainDBContent.match(/export const twwS3SkillDatabase = (\[[\s\S]*\]);/);
    if (!dataMatch) {
      throw new Error('메인 데이터베이스 형식을 파싱할 수 없습니다.');
    }

    // 3. JSON 파싱
    const mainDatabase = eval(dataMatch[1]);
    console.log(`📊 현재 DB 스킬 수: ${mainDatabase.length}개`);

    // 4. 기원사 스킬이 이미 있는지 확인
    const existingEvokerSkills = mainDatabase.filter(skill => skill.class === 'EVOKER');
    if (existingEvokerSkills.length > 0) {
      console.log(`⚠️ 이미 ${existingEvokerSkills.length}개의 기원사 스킬이 있습니다.`);
      console.log('기존 스킬을 제거하고 새로 추가합니다...');
      // 기존 기원사 스킬 제거
      const nonEvokerSkills = mainDatabase.filter(skill => skill.class !== 'EVOKER');
      mainDatabase.length = 0;
      mainDatabase.push(...nonEvokerSkills);
    }

    // 5. 기원사 스킬 추가
    mainDatabase.push(...evokerSkills);
    console.log(`✅ ${evokerSkills.length}개의 기원사 스킬을 추가했습니다.`);
    console.log(`📊 새 DB 총 스킬 수: ${mainDatabase.length}개`);

    // 6. 클래스별로 정렬
    mainDatabase.sort((a, b) => {
      const classOrder = [
        'WARRIOR', 'PALADIN', 'HUNTER', 'ROGUE',
        'PRIEST', 'SHAMAN', 'MAGE', 'WARLOCK',
        'MONK', 'DRUID', 'DEMONHUNTER', 'DEATHKNIGHT', 'EVOKER'
      ];
      const aIndex = classOrder.indexOf(a.class);
      const bIndex = classOrder.indexOf(b.class);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      // 같은 클래스 내에서는 ID로 정렬
      return parseInt(a.id) - parseInt(b.id);
    });

    // 7. 새 파일 내용 생성
    const newContent = `// TWW Season 3 최종 정리된 데이터베이스 (기원사 포함)
// 생성: ${new Date().toISOString()}
// 총 ${mainDatabase.length}개 스킬

export const twwS3SkillDatabase = ${JSON.stringify(mainDatabase, null, 2)};
`;

    // 8. 백업 파일 생성
    const backupPath = mainDBPath.replace('.js', `-backup-${Date.now()}.js`);
    await fs.copyFile(mainDBPath, backupPath);
    console.log(`📦 백업 파일 생성: ${path.basename(backupPath)}`);

    // 9. 메인 DB 업데이트
    await fs.writeFile(mainDBPath, newContent);
    console.log(`✅ 메인 데이터베이스 업데이트 완료: ${path.basename(mainDBPath)}`);

    // 10. 통계 출력
    const classCounts = {};
    mainDatabase.forEach(skill => {
      classCounts[skill.class] = (classCounts[skill.class] || 0) + 1;
    });

    console.log('\n📊 클래스별 스킬 수:');
    Object.entries(classCounts).forEach(([cls, count]) => {
      console.log(`  ${cls}: ${count}개`);
    });

    return { success: true, totalSkills: mainDatabase.length, evokerSkills: evokerSkills.length };

  } catch (error) {
    console.error('❌ 통합 실패:', error);
    throw error;
  }
}

// 실행
if (require.main === module) {
  integrateEvokerToMainDB()
    .then(result => {
      console.log('\n✨ 기원사 데이터베이스 통합 완료!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { integrateEvokerToMainDB };