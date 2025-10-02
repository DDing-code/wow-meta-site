/**
 * 모든 스킬 데이터를 사용자 제공 DB 및 Wowhead와 대조하여 업데이트
 * 실행: node scripts/compare-and-update-all-skills.js
 */

const fs = require('fs');
const path = require('path');

// 데이터 파일 경로
const wowheadDataPath = path.join(__dirname, '..', 'src', 'data', 'wowhead-full-descriptions-complete.json');
const iconMappingPath = path.join(__dirname, '..', 'src', 'data', 'iconMapping.json');

// 현재 데이터 읽기
const wowheadData = JSON.parse(fs.readFileSync(wowheadDataPath, 'utf8'));
const iconMapping = JSON.parse(fs.readFileSync(iconMappingPath, 'utf8'));

// 사용자가 제공한 각 클래스별 스킬 파일들 (skills 폴더 내)
const classFiles = [
  'wowdbWarriorSkillsComplete',
  'wowdbPaladinSkillsComplete',
  'wowdbHunterSkillsComplete',
  'wowdbRogueSkillsComplete',
  'wowdbPriestSkillsComplete',
  'wowdbMageSkillsComplete',
  'wowdbWarlockSkillsComplete',
  'wowdbShamanSkillsComplete',
  'wowdbMonkSkillsComplete',
  'wowdbDruidSkillsComplete',
  'wowdbDeathKnightSkillsComplete',
  'wowdbDemonHunterSkillsComplete',
  'wowdbEvokerSkillsComplete'
];

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

  // /icons/ability_warrior_charge.png -> ability_warrior_charge
  // ability_warrior_charge.png -> ability_warrior_charge
  // ability_warrior_charge -> ability_warrior_charge

  let cleaned = iconPath;
  if (cleaned.includes('/')) {
    cleaned = cleaned.split('/').pop(); // 마지막 부분만 추출
  }
  if (cleaned.includes('.')) {
    cleaned = cleaned.split('.')[0]; // 확장자 제거
  }
  return cleaned;
}

// 사용자 제공 DB에서 모든 스킬 수집
const userProvidedSkills = {};
let totalUserSkills = 0;

classFiles.forEach(fileName => {
  try {
    // ES 모듈 import를 require로 읽기 위해 파일 직접 파싱
    const filePath = path.join(__dirname, '..', 'src', 'data', 'skills', fileName + '.js');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // export const 찾기
    const match = fileContent.match(/export const \w+ = ({[\s\S]*});/);
    if (!match) {
      console.log(`⚠️ ${fileName} 파싱 실패`);
      return;
    }

    // JSON으로 파싱하기 위해 JavaScript 객체 형식 수정
    let jsonString = match[1]
      .replace(/\/\/.*$/gm, '') // 주석 제거
      .replace(/(\w+):/g, '"$1":') // 키에 따옴표 추가
      .replace(/'/g, '"') // 작은따옴표를 큰따옴표로
      .replace(/,\s*}/g, '}') // 마지막 콤마 제거
      .replace(/,\s*]/g, ']'); // 배열 마지막 콤마 제거

    const classData = JSON.parse(jsonString);
    const className = fileName.replace('wowdb', '').replace('SkillsComplete', '');

    // 모든 카테고리의 스킬 처리
    Object.keys(classData).forEach(category => {
      if (classData[category] && typeof classData[category] === 'object') {
        Object.entries(classData[category]).forEach(([skillId, skill]) => {
          if (!userProvidedSkills[skillId]) {
            userProvidedSkills[skillId] = {
              krName: skill.kr || skill.name,
              icon: extractIconName(skill.icon),
              className: classKoreanNames[className] || className,
              category: category
            };
            totalUserSkills++;
          }
        });
      }
    });

  } catch (error) {
    console.log(`⚠️ ${fileName} 처리 중 오류:`, error.message);
  }
});

console.log(`\n===== 스킬 데이터 분석 =====`);
console.log(`📚 사용자 제공 DB 스킬 수: ${totalUserSkills}개`);
console.log(`📊 현재 wowhead 데이터베이스: ${Object.keys(wowheadData).length}개`);
console.log(`🎨 현재 아이콘 매핑: ${Object.keys(iconMapping).length}개\n`);

// 업데이트가 필요한 스킬 찾기
const needsUpdate = [];
const needsIcon = [];
const needsKoreanName = [];

Object.keys(wowheadData).forEach(skillId => {
  const current = wowheadData[skillId];
  const userProvided = userProvidedSkills[skillId];
  const currentIcon = iconMapping[skillId];

  if (userProvided) {
    // 한국어 이름 확인
    if (!current.krName && userProvided.krName) {
      needsKoreanName.push({
        id: skillId,
        krName: userProvided.krName,
        className: userProvided.className
      });
    }

    // 아이콘 확인
    if (userProvided.icon && currentIcon !== userProvided.icon) {
      needsIcon.push({
        id: skillId,
        currentIcon: currentIcon,
        correctIcon: userProvided.icon,
        krName: current.krName || userProvided.krName
      });
    }
  }

  // 설명이 없거나 기본값인 스킬
  if (!current.description || current.description.includes('클래스의 스킬입니다')) {
    needsUpdate.push({
      id: skillId,
      krName: current.krName || (userProvided && userProvided.krName),
      className: current.className || (userProvided && userProvided.className)
    });
  }
});

console.log(`===== 업데이트 필요 항목 =====`);
console.log(`❌ 잘못된 아이콘: ${needsIcon.length}개`);
console.log(`📝 한국어 이름 없음: ${needsKoreanName.length}개`);
console.log(`💬 설명 업데이트 필요: ${needsUpdate.length}개\n`);

// 아이콘 업데이트
let iconUpdateCount = 0;
needsIcon.forEach(item => {
  iconMapping[item.id] = item.correctIcon;
  iconUpdateCount++;
  if (iconUpdateCount <= 10) {
    console.log(`🎨 아이콘 수정: ${item.krName} (${item.id}): ${item.currentIcon} → ${item.correctIcon}`);
  }
});

if (needsIcon.length > 10) {
  console.log(`... 외 ${needsIcon.length - 10}개 더`);
}

// 한국어 이름 업데이트
let nameUpdateCount = 0;
needsKoreanName.forEach(item => {
  if (!wowheadData[item.id]) {
    wowheadData[item.id] = {};
  }
  wowheadData[item.id].krName = item.krName;
  wowheadData[item.id].className = item.className;
  nameUpdateCount++;
  if (nameUpdateCount <= 10) {
    console.log(`📝 한국어 이름 추가: ${item.krName} (${item.id})`);
  }
});

if (needsKoreanName.length > 10) {
  console.log(`... 외 ${needsKoreanName.length - 10}개 더`);
}

// 사용자 DB에는 있지만 현재 DB에는 없는 스킬 추가
let addedCount = 0;
Object.entries(userProvidedSkills).forEach(([skillId, skill]) => {
  if (!wowheadData[skillId]) {
    wowheadData[skillId] = {
      krName: skill.krName,
      description: `${skill.className} 클래스의 ${skill.category} 스킬입니다.`,
      className: skill.className
    };

    if (skill.icon) {
      iconMapping[skillId] = skill.icon;
    }

    addedCount++;
    if (addedCount <= 5) {
      console.log(`➕ 새 스킬 추가: ${skill.krName} (${skillId})`);
    }
  }
});

if (addedCount > 5) {
  console.log(`... 외 ${addedCount - 5}개 더`);
}

// 파일 저장
fs.writeFileSync(wowheadDataPath, JSON.stringify(wowheadData, null, 2), 'utf8');
fs.writeFileSync(iconMappingPath, JSON.stringify(iconMapping, null, 2), 'utf8');

console.log(`\n===== 업데이트 완료 =====`);
console.log(`✅ 아이콘 수정: ${iconUpdateCount}개`);
console.log(`✅ 한국어 이름 추가: ${nameUpdateCount}개`);
console.log(`✅ 새 스킬 추가: ${addedCount}개`);
console.log(`📊 최종 스킬 수: ${Object.keys(wowheadData).length}개`);
console.log(`🎨 최종 아이콘 매핑: ${Object.keys(iconMapping).length}개`);

console.log(`\n다음 단계:`);
console.log(`1. Wowhead에서 설명이 없는 ${needsUpdate.length}개 스킬의 실제 설명 가져오기`);
console.log(`2. npm run build로 빌드`);
console.log(`3. /spells 페이지에서 확인`);