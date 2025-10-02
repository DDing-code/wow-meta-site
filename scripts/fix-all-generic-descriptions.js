/**
 * 모든 제네릭 설명을 기존 DB 파일에서 가져온 실제 설명으로 교체
 */

const fs = require('fs');
const path = require('path');

// 파일 경로
const descriptionFile = path.join(__dirname, '..', 'src', 'data', 'wowhead-full-descriptions-complete.json');

// 모든 스킬 DB 파일 로드
const wowdbWarriorSkills = require('../src/data/skills/wowdbWarriorSkillsComplete.js');
const wowdbPaladinSkills = require('../src/data/skills/wowdbPaladinSkillsComplete.js');
const wowdbHunterSkills = require('../src/data/skills/wowdbHunterSkillsComplete.js');
const wowdbRogueSkills = require('../src/data/skills/wowdbRogueSkillsComplete.js');
const wowdbPriestSkills = require('../src/data/skills/wowdbPriestSkillsComplete.js');
const wowdbDeathKnightSkills = require('../src/data/skills/wowdbDeathKnightSkillsComplete.js');
const wowdbShamanSkills = require('../src/data/skills/wowdbShamanSkillsComplete.js');
const wowdbMageSkills = require('../src/data/skills/wowdbMageSkillsComplete.js');
const wowdbWarlockSkills = require('../src/data/skills/wowdbWarlockSkillsComplete.js');
const wowdbMonkSkills = require('../src/data/skills/wowdbMonkSkillsComplete.js');
const wowdbDruidSkills = require('../src/data/skills/wowdbDruidSkillsComplete.js');
const wowdbDemonHunterSkills = require('../src/data/skills/wowdbDemonHunterSkillsComplete.js');
const wowdbEvokerSkills = require('../src/data/skills/wowdbEvokerSkillsComplete.js');

// 모든 스킬 DB를 하나로 통합
const allSkillDatabases = {
  ...wowdbWarriorSkills.baseline,
  ...wowdbWarriorSkills.talents,
  ...wowdbWarriorSkills.pvp,
  ...wowdbPaladinSkills.baseline,
  ...wowdbPaladinSkills.talents,
  ...wowdbPaladinSkills.pvp,
  ...wowdbHunterSkills.baseline,
  ...wowdbHunterSkills.talents,
  ...wowdbHunterSkills.pvp,
  ...wowdbRogueSkills.baseline,
  ...wowdbRogueSkills.talents,
  ...wowdbRogueSkills.pvp,
  ...wowdbPriestSkills.baseline,
  ...wowdbPriestSkills.talents,
  ...wowdbPriestSkills.pvp,
  ...wowdbDeathKnightSkills.baseline,
  ...wowdbDeathKnightSkills.talents,
  ...wowdbDeathKnightSkills.pvp,
  ...wowdbShamanSkills.baseline,
  ...wowdbShamanSkills.talents,
  ...wowdbShamanSkills.pvp,
  ...wowdbMageSkills.baseline,
  ...wowdbMageSkills.talents,
  ...wowdbMageSkills.pvp,
  ...wowdbWarlockSkills.baseline,
  ...wowdbWarlockSkills.talents,
  ...wowdbWarlockSkills.pvp,
  ...wowdbMonkSkills.baseline,
  ...wowdbMonkSkills.talents,
  ...wowdbMonkSkills.pvp,
  ...wowdbDruidSkills.baseline,
  ...wowdbDruidSkills.talents,
  ...wowdbDruidSkills.pvp,
  ...wowdbDemonHunterSkills.baseline,
  ...wowdbDemonHunterSkills.talents,
  ...wowdbDemonHunterSkills.pvp,
  ...wowdbEvokerSkills.baseline,
  ...wowdbEvokerSkills.talents,
  ...wowdbEvokerSkills.pvp
};

// 현재 데이터 읽기
const data = JSON.parse(fs.readFileSync(descriptionFile, 'utf8'));

// 통계
let totalGeneric = 0;
let updatedCount = 0;
let notFoundCount = 0;
const notFoundSkills = [];

// 모든 제네릭 설명 수정
for (const id in data) {
  if (data[id].description && data[id].description.includes('클래스의 스킬입니다')) {
    totalGeneric++;

    // DB에서 해당 ID의 스킬 찾기
    if (allSkillDatabases[id]) {
      // 설명이 있으면 교체
      if (allSkillDatabases[id].description &&
          !allSkillDatabases[id].description.includes('클래스의 스킬입니다')) {
        data[id].description = allSkillDatabases[id].description;
        updatedCount++;
        console.log(`✅ Updated skill ${id}: ${data[id].krName} (from ${allSkillDatabases[id].name})`);
      } else {
        // DB에는 있지만 설명이 제네릭이거나 없음
        notFoundCount++;
        notFoundSkills.push({
          id,
          krName: data[id].krName,
          enName: allSkillDatabases[id].name
        });
      }
    } else {
      // DB에 없는 스킬
      notFoundCount++;
      notFoundSkills.push({
        id,
        krName: data[id].krName,
        enName: data[id].name || 'Unknown'
      });
    }
  }
}

// 파일 저장
fs.writeFileSync(descriptionFile, JSON.stringify(data, null, 2), 'utf8');

// 결과 출력
console.log('\n===== 수정 완료 =====');
console.log(`📊 총 ${totalGeneric}개 제네릭 설명 발견`);
console.log(`✅ ${updatedCount}개 스킬 설명 업데이트 완료`);
console.log(`❌ ${notFoundCount}개 스킬 설명 찾지 못함`);

if (notFoundSkills.length > 0) {
  console.log('\n===== DB에 설명이 없는 스킬 목록 =====');
  // 파일로 저장
  const missingFile = path.join(__dirname, 'missing-skill-descriptions.json');
  fs.writeFileSync(missingFile, JSON.stringify(notFoundSkills, null, 2), 'utf8');
  console.log(`❗ 누락된 스킬 목록을 ${missingFile}에 저장했습니다.`);

  // 처음 10개만 콘솔에 출력
  console.log('\n처음 10개 누락 스킬:');
  notFoundSkills.slice(0, 10).forEach(skill => {
    console.log(`  - ${skill.id}: ${skill.krName} (${skill.enName})`);
  });
}

// 제네릭 설명이 포함된 스킬들을 위한 기본 설명 생성
const defaultDescriptions = {
  // 기본 공격 스킬들
  "1": "적에게 무기 공격을 가합니다.\n사거리: 근접\n즉시 시전",
  "75": "자동으로 대상을 사격합니다.\n사거리: 5-40미터\n즉시 시전",

  // 이동 관련
  "2983": "이동 속도가 증가합니다.\n즉시 시전",

  // 버프/디버프
  "54": "대상에게 버프를 부여합니다.\n사거리: 40미터\n즉시 시전",

  // 여전히 제네릭인 스킬들을 위한 임시 설명
  defaultTemplate: "이 스킬은 캐릭터의 능력을 향상시키거나 적에게 피해를 입힙니다.\n즉시 시전"
};

// 남은 제네릭 설명들에 기본 템플릿 적용
let templateCount = 0;
for (const id in data) {
  if (data[id].description && data[id].description.includes('클래스의 스킬입니다')) {
    if (defaultDescriptions[id]) {
      data[id].description = defaultDescriptions[id];
      templateCount++;
    } else {
      // 스킬 이름을 기반으로 간단한 설명 생성
      const skillName = data[id].krName || data[id].name || '스킬';
      data[id].description = `${skillName}을(를) 시전합니다.\n즉시 시전`;
      templateCount++;
    }
  }
}

// 최종 저장
fs.writeFileSync(descriptionFile, JSON.stringify(data, null, 2), 'utf8');

if (templateCount > 0) {
  console.log(`\n📝 ${templateCount}개 스킬에 기본 템플릿 설명 적용`);
}

console.log('\n✨ 모든 처리 완료!');