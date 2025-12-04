/**
 * integrate-arcane-mage-to-central-db.js
 *
 * 목적: arcaneMageSkillData.js 스킬을 twwS3FinalCleanedDatabase.js에 통합
 */

const fs = require('fs');
const path = require('path');

// 소스 데이터 파일 읽기
const mageDataPath = path.join(__dirname, '..', 'src', 'data', 'arcaneMageSkillData.js');
const mageDataRaw = fs.readFileSync(mageDataPath, 'utf8');

// export const arcaneMageSkills = { ... }; 형식에서 객체 추출
const mageDataMatch = mageDataRaw.match(/export const arcaneMageSkills = ({[\s\S]*?});[\s]*$/m);
if (!mageDataMatch) {
  console.error('❌ arcaneMageSkills 객체를 찾을 수 없습니다.');
  process.exit(1);
}

// 객체 문자열을 실제 객체로 변환
const mageSkillsObj = eval(`(${mageDataMatch[1]})`);

console.log(`✅ 마법사 스킬 데이터 로드 완료: ${Object.keys(mageSkillsObj).length}개`);

// 중앙 DB 읽기
const centralDBPath = path.join(__dirname, '..', 'src', 'data', 'twwS3FinalCleanedDatabase.js');
const centralDBRaw = fs.readFileSync(centralDBPath, 'utf8');

// export const twwS3SkillDatabase = [ ... ]; 형식에서 배열 추출
const centralDBMatch = centralDBRaw.match(/export const twwS3SkillDatabase = (\[[\s\S]*?\]);/);
if (!centralDBMatch) {
  console.error('❌ twwS3SkillDatabase 배열을 찾을 수 없습니다.');
  process.exit(1);
}

let centralDB = eval(centralDBMatch[1]);

console.log(`✅ 중앙 DB 로드 완료: ${centralDB.length}개 스킬`);

// 변환 및 통합
let addedCount = 0;
let skippedCount = 0;

Object.entries(mageSkillsObj).forEach(([key, skill]) => {
  // 중복 체크 (ID 기준)
  const exists = centralDB.some(dbSkill => dbSkill.id === skill.id);

  if (exists) {
    console.log(`⚠️  스킵 (중복): ${skill.koreanName} (ID: ${skill.id})`);
    skippedCount++;
    return;
  }

  // 중앙 DB 형식으로 변환
  const convertedSkill = {
    id: skill.id,
    englishName: skill.englishName,
    koreanName: skill.koreanName,
    icon: skill.icon,
    type: skill.type,
    spec: skill.spec === '비전' ? '비전' : skill.spec === '공용' ? '공용' : '비전',
    heroTalent: skill.heroTalent || null,
    level: skill.level || 1,
    pvp: skill.pvp || false,
    duration: skill.duration || 'n/a',
    school: skill.school || 'Arcane',
    mechanic: skill.mechanic || 'n/a',
    dispelType: skill.dispelType || 'n/a',
    gcd: skill.gcd || 'Normal',
    resourceCost: skill.resourceCost || '없음',
    range: skill.range || 'n/a',
    castTime: skill.castTime || '즉시',
    cooldown: skill.cooldown || '해당 없음',
    description: skill.description,
    coefficient: skill.coefficient || 'n/a',
    resourceGain: skill.resourceGain || '없음',
    class: 'MAGE'
  };

  centralDB.push(convertedSkill);
  console.log(`✅ 추가: ${skill.koreanName} (ID: ${skill.id})`);
  addedCount++;
});

console.log(`\n📊 통합 결과:`);
console.log(`  - 추가된 스킬: ${addedCount}개`);
console.log(`  - 중복 스킵: ${skippedCount}개`);
console.log(`  - 최종 DB 크기: ${centralDB.length}개`);

// 중앙 DB 파일 업데이트
const newContent = `// TWW Season 3 최종 정리된 데이터베이스 (완전 통합)
// 최종 업데이트: 2025-10-08
// 총 ${centralDB.length}개 스킬 (정기 주술사 14개 + 비전 마법사 ${addedCount}개 추가)

export const twwS3SkillDatabase = ${JSON.stringify(centralDB, null, 2)};
`;

fs.writeFileSync(centralDBPath, newContent, 'utf8');

console.log(`\n✅ 중앙 DB 업데이트 완료!`);
console.log(`💾 파일: ${centralDBPath}\n`);
