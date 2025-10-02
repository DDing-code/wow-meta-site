// TWW Season 3 데이터를 기존 사이트와 통합하는 스크립트
const fs = require('fs');
const path = require('path');

console.log('🔧 TWW Season 3 데이터 통합 시작...\n');

// 1. TWW Season 3 데이터 로드
const twwDataPath = path.join(__dirname, 'src/data/tww-season3-skills.json');
const twwData = JSON.parse(fs.readFileSync(twwDataPath, 'utf8'));

// 2. 현재 koreanSpellDatabase 로드
const koreanDbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
let koreanDbContent = fs.readFileSync(koreanDbPath, 'utf8');
const koreanDbMatch = koreanDbContent.match(/export const koreanSpellDatabase = ({[\s\S]*?});/);

let currentDatabase = {};
if (koreanDbMatch) {
  try {
    currentDatabase = eval('(' + koreanDbMatch[1] + ')');
    console.log(`✅ 현재 데이터베이스 로드: ${Object.keys(currentDatabase).length}개 스킬`);
  } catch (e) {
    console.error('현재 데이터베이스 파싱 실패:', e.message);
  }
}

// 3. TWW 데이터를 통합용 형식으로 변환
const integratedDatabase = {};
let addedCount = 0;
let updatedCount = 0;

// TWW 데이터 변환 및 통합
if (twwData.skills) {
  Object.values(twwData.skills).forEach(classSkills => {
    Object.entries(classSkills).forEach(([skillId, skillData]) => {
      const transformedSkill = {
        id: skillData.base.id,
        name: skillData.base.name,
        koreanName: skillData.base.koreanName,
        icon: skillData.base.icon,
        iconName: skillData.base.icon, // 아이콘 호환성
        class: skillData.base.class,
        patch: skillData.base.patch
      };

      // 재사용 대기시간
      if (skillData.mechanics?.cooldown?.base) {
        transformedSkill.cooldown = skillData.mechanics.cooldown.base;
      }

      // 자원 정보
      if (skillData.resources?.cost) {
        transformedSkill.resource = {
          type: skillData.resources.cost.type || skillData.resources.cost.holyPower ? '신성한힘' : '마나',
          amount: skillData.resources.cost.amount || skillData.resources.cost.holyPower?.amount,
          display: skillData.resources.cost.amount || skillData.resources.cost.holyPower?.amount
        };
      }

      if (skillData.resources?.generate) {
        transformedSkill.resourceGenerate = {
          type: skillData.resources.generate.type || skillData.resources.generate.holyPower ? '신성한힘' : null,
          amount: skillData.resources.generate.amount || skillData.resources.generate.holyPower?.amount,
          display: skillData.resources.generate.amount || skillData.resources.generate.holyPower?.amount
        };
      }

      // 메커니즘 정보
      if (skillData.mechanics?.cast?.castTime) {
        transformedSkill.castTime = skillData.mechanics.cast.castTime;
      }

      if (skillData.mechanics?.targeting?.range) {
        transformedSkill.range = skillData.mechanics.targeting.range;
      }

      if (skillData.mechanics?.duration?.base) {
        transformedSkill.duration = skillData.mechanics.duration.base;
      }

      // 설명
      if (skillData.description?.korean) {
        transformedSkill.description = skillData.description.korean;
      } else if (skillData.description?.english) {
        transformedSkill.description = skillData.description.english;
      }

      // 전문화별 차이 정보 추가
      if (skillData.specializationDetails) {
        transformedSkill.specializationDetails = skillData.specializationDetails;
      }

      // 카테고리 정보
      if (skillData.classification) {
        transformedSkill.category = skillData.classification.category;
        transformedSkill.type = skillData.classification.type;
        transformedSkill.school = skillData.classification.school;
      }

      // 특성 상호작용
      if (skillData.talentInteractions) {
        transformedSkill.talentInteractions = skillData.talentInteractions;
      }

      // 영웅 특성 (TWW)
      if (skillData.heroTalents) {
        transformedSkill.heroTalents = skillData.heroTalents;
      }

      // 기존 데이터와 병합
      if (currentDatabase[skillId]) {
        // 기존 데이터가 있으면 TWW 데이터로 업데이트
        integratedDatabase[skillId] = {
          ...currentDatabase[skillId],
          ...transformedSkill
        };
        updatedCount++;
      } else {
        // 새로운 스킬
        integratedDatabase[skillId] = transformedSkill;
        addedCount++;
      }
    });
  });
}

// 4. 기존 데이터베이스의 나머지 스킬들 보존
Object.entries(currentDatabase).forEach(([skillId, skillData]) => {
  if (!integratedDatabase[skillId]) {
    integratedDatabase[skillId] = skillData;
  }
});

console.log(`\n📊 통합 결과:`);
console.log(`  - 전체 스킬: ${Object.keys(integratedDatabase).length}개`);
console.log(`  - TWW 신규 추가: ${addedCount}개`);
console.log(`  - TWW 업데이트: ${updatedCount}개`);

// 5. 전문화별 차이가 있는 주요 스킬 확인
const skillsWithSpecDifferences = Object.entries(integratedDatabase)
  .filter(([id, skill]) => skill.specializationDetails)
  .map(([id, skill]) => ({
    id,
    name: skill.koreanName || skill.name,
    specs: Object.keys(skill.specializationDetails || {})
  }));

console.log(`\n🎯 전문화별 차이가 있는 스킬: ${skillsWithSpecDifferences.length}개`);
skillsWithSpecDifferences.slice(0, 5).forEach(skill => {
  console.log(`  - [${skill.id}] ${skill.name}: ${skill.specs.join(', ')}`);
});

// 6. 통합된 데이터베이스 저장
const jsContent = `// TWW Season 3 통합 한국어 스킬 데이터베이스
// 총 ${Object.keys(integratedDatabase).length}개 스킬
// 패치: 11.2.0 (TWW Season 3)
// 생성일: ${new Date().toISOString()}

export const koreanSpellDatabase = ${JSON.stringify(integratedDatabase, null, 2)};

export function getKoreanSpellData(spellId) {
  return koreanSpellDatabase[spellId] || null;
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

// 데이터 구조
// {
//   "스킬ID": {
//     name: "영문명",
//     koreanName: "한글명",
//     cooldown: "재사용대기시간",
//     resource: { type, amount, display },
//     resourceGenerate: { type, amount, display },
//     range: "사정거리",
//     castTime: "시전시간",
//     duration: "지속시간",
//     description: "스킬 설명",
//     iconName: "아이콘명",
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

fs.writeFileSync(koreanDbPath, jsContent, 'utf8');
console.log(`\n✅ 통합 데이터베이스 저장 완료: ${koreanDbPath}`);

// 7. 백업 생성
const backupPath = path.join(__dirname, 'src/data/koreanSpellDatabase.backup.json');
fs.writeFileSync(backupPath, JSON.stringify(integratedDatabase, null, 2), 'utf8');
console.log(`📄 백업 파일 생성: ${backupPath}`);

console.log('\n🎉 TWW Season 3 데이터 통합 완료!');
console.log('💡 이제 사이트를 다시 빌드하여 변경사항을 적용하세요.');