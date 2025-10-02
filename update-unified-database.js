const fs = require('fs');
const path = require('path');

// 모든 클래스 파일에서 스킬 수집
function collectAllSkills() {
  const classFiles = [
    { file: 'wowdbWarriorSkillsComplete.js', class: 'Warrior' },
    { file: 'wowdbPaladinSkillsComplete.js', class: 'Paladin' },
    { file: 'wowdbHunterSkillsComplete.js', class: 'Hunter' },
    { file: 'wowdbRogueSkillsComplete.js', class: 'Rogue' },
    { file: 'wowdbPriestSkillsComplete.js', class: 'Priest' },
    { file: 'wowdbDeathKnightSkillsComplete.js', class: 'DeathKnight' },
    { file: 'wowdbShamanSkillsComplete.js', class: 'Shaman' },
    { file: 'wowdbMageSkillsComplete.js', class: 'Mage' },
    { file: 'wowdbWarlockSkillsComplete.js', class: 'Warlock' },
    { file: 'wowdbMonkSkillsComplete.js', class: 'Monk' },
    { file: 'wowdbDruidSkillsComplete.js', class: 'Druid' },
    { file: 'wowdbDemonHunterSkillsComplete.js', class: 'DemonHunter' },
    { file: 'wowdbEvokerSkillsComplete.js', class: 'Evoker' }
  ];

  const unifiedDatabase = {};
  let totalSkills = 0;

  classFiles.forEach(({ file, class: className }) => {
    const filePath = path.join(__dirname, 'src', 'data', 'skills', file);

    try {
      // 파일 내용을 읽어서 직접 파싱
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // export const 부분 찾기
      const match = fileContent.match(/export const \w+ = ({[\s\S]*?})\s*;/);

      if (match) {
        // eval을 사용하여 JavaScript 객체 파싱
        const classData = eval('(' + match[1] + ')');

        if (classData && typeof classData === 'object') {
          // 각 카테고리의 스킬들을 통합
          Object.entries(classData).forEach(([category, skills]) => {
            if (skills && typeof skills === 'object') {
              Object.entries(skills).forEach(([skillId, skillData]) => {
                unifiedDatabase[skillId] = {
                  ...skillData,
                  className: getKoreanClassName(className),
                  category: category,
                  id: skillId
                };
                totalSkills++;
              });
            }
          });

          const skillCount = Object.keys(classData).reduce((sum, cat) => {
            return sum + (classData[cat] ? Object.keys(classData[cat]).length : 0);
          }, 0);
          console.log(`✅ ${className}: ${skillCount}개 스킬`);
        }
      } else {
        console.log(`⚠️ ${className}: export const 패턴을 찾을 수 없음`);
      }
    } catch (error) {
      console.error(`❌ ${className} 파일 읽기 에러:`, error.message);
    }
  });

  return { unifiedDatabase, totalSkills };
}

// 클래스 한글명
function getKoreanClassName(className) {
  const classNames = {
    'Warrior': '전사',
    'Paladin': '성기사',
    'Hunter': '사냥꾼',
    'Rogue': '도적',
    'Priest': '사제',
    'DeathKnight': '죽음의 기사',
    'Shaman': '주술사',
    'Mage': '마법사',
    'Warlock': '흑마법사',
    'Monk': '수도사',
    'Druid': '드루이드',
    'DemonHunter': '악마사냥꾼',
    'Evoker': '기원사'
  };
  return classNames[className] || className;
}

// 통합 데이터베이스 저장
function saveUnifiedDatabase() {
  const { unifiedDatabase, totalSkills } = collectAllSkills();

  // wowhead-full-descriptions-complete.json 업데이트
  const outputPath = path.join(__dirname, 'src', 'data', 'wowhead-full-descriptions-complete.json');

  // 기존 데이터 읽기 (스킬 상세 정보 유지)
  let existingData = {};
  try {
    existingData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  } catch (error) {
    console.log('기존 데이터베이스 없음, 새로 생성');
  }

  // TWW Season 3 데이터로 덮어쓰기 (PvP 및 삭제된 스킬 제거)
  const updatedDatabase = {};

  // 새로운 스킬만 포함
  Object.entries(unifiedDatabase).forEach(([skillId, skillData]) => {
    updatedDatabase[skillId] = {
      ...skillData,
      // 기존 상세 정보가 있으면 유지
      ...(existingData[skillId] ? {
        description: existingData[skillId].description,
        cooldown: existingData[skillId].cooldown,
        resource: existingData[skillId].resource,
        range: existingData[skillId].range,
        castTime: existingData[skillId].castTime
      } : {})
    };
  });

  fs.writeFileSync(outputPath, JSON.stringify(updatedDatabase, null, 2), 'utf8');

  console.log(`
=========================================
✅ TWW Season 3 통합 데이터베이스 완료!
=========================================
📊 총 스킬 수: ${totalSkills}개
📁 저장 위치: ${outputPath}
🗑️ PvP 특성 및 삭제된 스킬 제거됨
✨ 현재 활성화된 스킬만 포함
=========================================
  `);

  // unifiedSkillDatabase.js도 업데이트
  const unifiedPath = path.join(__dirname, 'src', 'data', 'unifiedSkillDatabase.js');
  const unifiedContent = `// TWW Season 3 통합 스킬 데이터베이스
// The War Within 11.0.5 - 시즌 3
// PvP 특성 제외, 현재 활성화된 스킬만 포함

export const unifiedSkillDatabase = ${JSON.stringify(updatedDatabase, null, 2)};

// 스킬 검색 함수
export function getSkillById(skillId) {
  return unifiedSkillDatabase[skillId] || null;
}

// 클래스별 스킬 필터링
export function getSkillsByClass(className) {
  return Object.entries(unifiedSkillDatabase)
    .filter(([_, skill]) => skill.className === className)
    .map(([id, skill]) => ({ ...skill, id }));
}

// 전문화별 스킬 필터링
export function getSkillsBySpec(className, specName) {
  const specKey = specName.toLowerCase().replace(/\\s+/g, '');
  return Object.entries(unifiedSkillDatabase)
    .filter(([_, skill]) => skill.className === className && skill.category === specKey)
    .map(([id, skill]) => ({ ...skill, id }));
}

// 영웅 특성 필터링
export function getHeroTalents(className) {
  return Object.entries(unifiedSkillDatabase)
    .filter(([_, skill]) => skill.className === className && skill.category === 'heroTalents')
    .map(([id, skill]) => ({ ...skill, id }));
}

// 전체 스킬 개수
export function getTotalSkillCount() {
  return Object.keys(unifiedSkillDatabase).length;
}
`;

  fs.writeFileSync(unifiedPath, unifiedContent, 'utf8');
  console.log(`✅ unifiedSkillDatabase.js 업데이트 완료`);
}

// 실행
saveUnifiedDatabase();