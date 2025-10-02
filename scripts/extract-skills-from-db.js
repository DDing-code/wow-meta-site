/**
 * 사용자 제공 DB에서 스킬 정보 추출하여 업데이트
 * ES 모듈 형식의 JavaScript 파일을 직접 파싱
 */

const fs = require('fs');
const path = require('path');

// 데이터 파일 경로
const wowheadDataPath = path.join(__dirname, '..', 'src', 'data', 'wowhead-full-descriptions-complete.json');
const iconMappingPath = path.join(__dirname, '..', 'src', 'data', 'iconMapping.json');

// 현재 데이터 읽기
const wowheadData = JSON.parse(fs.readFileSync(wowheadDataPath, 'utf8'));
const iconMapping = JSON.parse(fs.readFileSync(iconMappingPath, 'utf8'));

// 클래스 이름 매핑
const classKoreanNames = {
  Warrior: '전사',
  Paladin: '성기사',
  Hunter: '사냥꾼',
  Rogue: '도적',
  Priest: '사제',
  Mage: '마법사',
  Warlock: '흑마법사',
  Shaman: '주술사',
  Monk: '수도사',
  Druid: '드루이드',
  DeathKnight: '죽음의 기사',
  DemonHunter: '악마사냥꾼',
  Evoker: '기원사'
};

// 아이콘 경로를 정리하는 함수
function extractIconName(iconPath) {
  if (!iconPath) return null;
  let cleaned = iconPath;
  if (cleaned.includes('/')) {
    cleaned = cleaned.split('/').pop();
  }
  if (cleaned.includes('.')) {
    cleaned = cleaned.split('.')[0];
  }
  return cleaned;
}

// 파일에서 스킬 ID와 한국어 이름, 아이콘 추출
function extractSkillsFromFile(filePath, className) {
  const skills = {};

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // 스킬 ID와 관련 정보를 찾는 패턴
    // 예: 6673: { name: 'Battle Shout', kr: '전투의 외침', ... icon: '/icons/ability_warrior_battleshout.png' }
    const regex = /(\d+):\s*{[^}]*(?:kr|krName):\s*['"]([^'"]+)['"][^}]*}/g;
    const iconRegex = /(\d+):\s*{[^}]*icon:\s*['"]([^'"]+)['"][^}]*}/g;

    let match;

    // 한국어 이름 추출
    while ((match = regex.exec(content)) !== null) {
      const skillId = match[1];
      const krName = match[2];

      if (!skills[skillId]) {
        skills[skillId] = {};
      }
      skills[skillId].krName = krName;
      skills[skillId].className = classKoreanNames[className] || className;
    }

    // 아이콘 추출
    content.replace(iconRegex, (fullMatch, skillId, iconPath) => {
      if (!skills[skillId]) {
        skills[skillId] = {};
      }
      skills[skillId].icon = extractIconName(iconPath);
      return fullMatch;
    });

  } catch (error) {
    console.log(`⚠️ ${filePath} 읽기 오류:`, error.message);
  }

  return skills;
}

// 각 클래스 파일에서 스킬 추출
const classFiles = [
  { file: 'wowdbWarriorSkillsComplete.js', className: 'Warrior' },
  { file: 'wowdbPaladinSkillsComplete.js', className: 'Paladin' },
  { file: 'wowdbHunterSkillsComplete.js', className: 'Hunter' },
  { file: 'wowdbRogueSkillsComplete.js', className: 'Rogue' },
  { file: 'wowdbPriestSkillsComplete.js', className: 'Priest' },
  { file: 'wowdbMageSkillsComplete.js', className: 'Mage' },
  { file: 'wowdbWarlockSkillsComplete.js', className: 'Warlock' },
  { file: 'wowdbShamanSkillsComplete.js', className: 'Shaman' },
  { file: 'wowdbMonkSkillsComplete.js', className: 'Monk' },
  { file: 'wowdbDruidSkillsComplete.js', className: 'Druid' },
  { file: 'wowdbDeathKnightSkillsComplete.js', className: 'DeathKnight' },
  { file: 'wowdbDemonHunterSkillsComplete.js', className: 'DemonHunter' },
  { file: 'wowdbEvokerSkillsComplete.js', className: 'Evoker' }
];

const allExtractedSkills = {};
let totalExtracted = 0;

classFiles.forEach(({ file, className }) => {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'skills', file);
  const skills = extractSkillsFromFile(filePath, className);

  Object.entries(skills).forEach(([skillId, skillData]) => {
    allExtractedSkills[skillId] = skillData;
    totalExtracted++;
  });

  console.log(`✅ ${classKoreanNames[className]}: ${Object.keys(skills).length}개 스킬 추출`);
});

console.log(`\n===== 스킬 추출 완료 =====`);
console.log(`📚 총 추출된 스킬: ${totalExtracted}개`);

// 업데이트 작업
let iconUpdateCount = 0;
let nameUpdateCount = 0;
let newSkillCount = 0;

Object.entries(allExtractedSkills).forEach(([skillId, extractedData]) => {
  // 한국어 이름 업데이트
  if (extractedData.krName) {
    if (!wowheadData[skillId]) {
      wowheadData[skillId] = {};
      newSkillCount++;
    }

    if (!wowheadData[skillId].krName || wowheadData[skillId].krName === `스킬 #${skillId}`) {
      wowheadData[skillId].krName = extractedData.krName;
      wowheadData[skillId].className = extractedData.className;
      nameUpdateCount++;
    }
  }

  // 아이콘 업데이트
  if (extractedData.icon) {
    const currentIcon = iconMapping[skillId];
    if (!currentIcon || currentIcon !== extractedData.icon) {
      iconMapping[skillId] = extractedData.icon;
      iconUpdateCount++;
    }
  }

  // 기본 설명 추가 (필요한 경우)
  if (wowheadData[skillId] && !wowheadData[skillId].description) {
    wowheadData[skillId].description = `${extractedData.className} 클래스의 스킬입니다.`;
  }
});

// 파일 저장
fs.writeFileSync(wowheadDataPath, JSON.stringify(wowheadData, null, 2), 'utf8');
fs.writeFileSync(iconMappingPath, JSON.stringify(iconMapping, null, 2), 'utf8');

console.log(`\n===== 업데이트 결과 =====`);
console.log(`✅ 아이콘 업데이트: ${iconUpdateCount}개`);
console.log(`✅ 한국어 이름 업데이트: ${nameUpdateCount}개`);
console.log(`✅ 새로 추가된 스킬: ${newSkillCount}개`);
console.log(`📊 최종 스킬 수: ${Object.keys(wowheadData).length}개`);
console.log(`🎨 최종 아이콘 매핑: ${Object.keys(iconMapping).length}개`);

// 샘플 출력
console.log(`\n===== 업데이트 샘플 =====`);
let sampleCount = 0;
for (const [skillId, data] of Object.entries(wowheadData)) {
  if (data.krName && iconMapping[skillId] && sampleCount < 10) {
    console.log(`${skillId}: ${data.krName} - ${iconMapping[skillId]}`);
    sampleCount++;
  }
}