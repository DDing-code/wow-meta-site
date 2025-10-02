const fs = require('fs');
const path = require('path');

// 파일 읽기
const existingDBPath = path.join(__dirname, 'tww-s3-refined-database.json');
const newSkillsPath = path.join(__dirname, 'beastmastery-skills-to-add.json');

const existingDB = JSON.parse(fs.readFileSync(existingDBPath, 'utf8'));
const newSkills = JSON.parse(fs.readFileSync(newSkillsPath, 'utf8'));

// HUNTER 섹션이 없으면 생성
if (!existingDB.HUNTER) {
  existingDB.HUNTER = {};
}

// 새로운 스킬들 추가
let addedCount = 0;
let updatedCount = 0;

for (const [skillId, skillData] of Object.entries(newSkills)) {
  if (existingDB.HUNTER[skillId]) {
    console.log(`스킬 업데이트: ${skillData.koreanName} (${skillId})`);
    updatedCount++;
  } else {
    console.log(`새 스킬 추가: ${skillData.koreanName} (${skillId})`);
    addedCount++;
  }
  existingDB.HUNTER[skillId] = skillData;
}

// 업데이트된 DB 저장
const outputPath = path.join(__dirname, 'tww-s3-refined-database.json');
fs.writeFileSync(outputPath, JSON.stringify(existingDB, null, 2), 'utf8');

console.log('\n=== 통합 완료 ===');
console.log(`새로 추가된 스킬: ${addedCount}개`);
console.log(`업데이트된 스킬: ${updatedCount}개`);
console.log(`총 사냥꾼 스킬: ${Object.keys(existingDB.HUNTER).length}개`);
console.log(`파일 저장됨: ${outputPath}`);