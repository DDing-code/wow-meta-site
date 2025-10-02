/**
 * 모든 클래스 파일에서 스킬 ID를 수집하고
 * 현재 데이터베이스와 비교해서 누락된 스킬 찾기
 */

const fs = require('fs');
const path = require('path');

// 현재 데이터베이스 읽기
const currentDataPath = path.join(__dirname, '..', 'src', 'data', 'wowhead-full-descriptions-complete.json');
const currentData = JSON.parse(fs.readFileSync(currentDataPath, 'utf8'));

// 모든 클래스 스킬 파일에서 ID 수집
function collectAllSkillIds() {
  const skillsDir = path.join(__dirname, '..', 'src', 'data', 'skills');
  const allSkillIds = new Set();
  const skillsByClass = {};

  const classFiles = [
    'wowdbWarriorSkillsComplete.js',
    'wowdbPaladinSkillsComplete.js',
    'wowdbHunterSkillsComplete.js',
    'wowdbRogueSkillsComplete.js',
    'wowdbPriestSkillsComplete.js',
    'wowdbMageSkillsComplete.js',
    'wowdbWarlockSkillsComplete.js',
    'wowdbShamanSkillsComplete.js',
    'wowdbMonkSkillsComplete.js',
    'wowdbDruidSkillsComplete.js',
    'wowdbDeathKnightSkillsComplete.js',
    'wowdbDemonHunterSkillsComplete.js',
    'wowdbEvokerSkillsComplete.js'
  ];

  classFiles.forEach(file => {
    const filePath = path.join(skillsDir, file);
    const className = file.replace('wowdb', '').replace('SkillsComplete.js', '');
    skillsByClass[className] = [];

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');

      // ID: { 형태의 모든 스킬 ID 추출 (따옴표 없이)
      const regex = /(\d+):\s*\{/g;
      let match;

      while ((match = regex.exec(content)) !== null) {
        const id = match[1];
        allSkillIds.add(id);
        skillsByClass[className].push(id);
      }
    }

    console.log(`${className}: ${skillsByClass[className].length}개 스킬`);
  });

  return { allSkillIds, skillsByClass };
}

// 스킬 수집
const { allSkillIds, skillsByClass } = collectAllSkillIds();

// 현재 데이터베이스에 있는 스킬 ID
const existingIds = new Set(Object.keys(currentData));

// 누락된 스킬 찾기
const missingIds = [];
const foundIds = [];

allSkillIds.forEach(id => {
  if (!existingIds.has(id)) {
    missingIds.push(id);
  } else {
    foundIds.push(id);
  }
});

// 통계 출력
console.log('\n===== 스킬 데이터 현황 =====');
console.log(`📊 전체 스킬 ID: ${allSkillIds.size}개`);
console.log(`✅ 데이터 있음: ${foundIds.length}개`);
console.log(`❌ 데이터 없음(누락): ${missingIds.length}개`);

// 클래스별 누락 통계
console.log('\n===== 클래스별 누락 현황 =====');
Object.entries(skillsByClass).forEach(([className, ids]) => {
  const missing = ids.filter(id => !existingIds.has(id)).length;
  const found = ids.filter(id => existingIds.has(id)).length;
  console.log(`${className}: 전체 ${ids.length}개 (있음: ${found}, 없음: ${missing})`);
});

// 누락된 스킬 ID 파일로 저장
const outputPath = path.join(__dirname, 'missing-skill-ids.json');
fs.writeFileSync(outputPath, JSON.stringify({
  total: allSkillIds.size,
  found: foundIds.length,
  missing: missingIds.length,
  missingIds: missingIds.sort((a, b) => Number(a) - Number(b)),
  foundIds: foundIds.sort((a, b) => Number(a) - Number(b)),
  byClass: skillsByClass
}, null, 2), 'utf8');

console.log(`\n📁 누락된 스킬 ID 목록 저장: ${outputPath}`);
console.log(`\n처음 10개 누락 ID: ${missingIds.slice(0, 10).join(', ')}`);