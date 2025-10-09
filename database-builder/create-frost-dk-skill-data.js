/**
 * create-frost-dk-skill-data.js
 *
 * 중앙 DB에서 냉기 죽음의 기사 스킬 추출하여 스킬 데이터 파일 생성
 */

const fs = require('fs');
const path = require('path');

// 중앙 DB 읽기
const dbPath = path.join(__dirname, '..', 'src', 'data', 'twwS3FinalCleanedDatabase.js');
const dbContent = fs.readFileSync(dbPath, 'utf8');

// twwS3SkillDatabase 배열 추출
const match = dbContent.match(/export const twwS3SkillDatabase = (\[[\s\S]*\]);/);
if (!match) {
  console.error('❌ 중앙 DB에서 스킬 데이터를 찾을 수 없습니다.');
  process.exit(1);
}

const skillDB = eval(match[1]);

// Death Knight 냉기/공용 스킬 필터링
const frostDKSkills = skillDB.filter(skill =>
  skill.class === 'DEATHKNIGHT' &&
  (skill.spec === '냉기' || skill.spec === '공용')
);

console.log(`✅ Death Knight 스킬 필터링 완료: ${frostDKSkills.length}개`);
console.log(`- 냉기 전용: ${frostDKSkills.filter(s => s.spec === '냉기').length}개`);
console.log(`- 공용: ${frostDKSkills.filter(s => s.spec === '공용').length}개`);

// 영웅 특성 확인
const heroTalents = [...new Set(frostDKSkills.map(s => s.heroTalent).filter(Boolean))];
console.log(`영웅 특성: ${heroTalents.length > 0 ? heroTalents.join(', ') : '없음'}`);

// 스킬 객체 생성
const skillsObj = {};
frostDKSkills.forEach(skill => {
  const key = skill.englishName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^(.)/, (m) => m.toLowerCase());

  skillsObj[key] = {
    id: String(skill.id),
    koreanName: skill.koreanName,
    englishName: skill.englishName,
    icon: skill.icon,
    description: skill.description,
    cooldown: skill.cooldown || '없음',
    castTime: skill.castTime || '즉시',
    range: skill.range || '근접',
    resourceCost: skill.resourceCost || '없음',
    resourceGain: skill.resourceGain || '없음',
    type: skill.type,
    spec: skill.spec,
    heroTalent: skill.heroTalent || null,
    level: skill.level,
    pvp: skill.pvp
  };
});

// 스킬명 매핑 객체 생성
const skillNameMap = {};
frostDKSkills.forEach(skill => {
  const key = skill.englishName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^(.)/, (m) => m.toLowerCase());
  skillNameMap[skill.koreanName] = key;
});

// 파일 내용 생성
const outputContent = `/**
 * frostDeathKnightSkillData.js
 *
 * 냉기 죽음의 기사 스킬 데이터
 * 소스: twwS3FinalCleanedDatabase.js
 * 생성일: ${new Date().toISOString().split('T')[0]}
 *
 * 스킬 수: ${frostDKSkills.length}개
 * - 냉기 전용: ${frostDKSkills.filter(s => s.spec === '냉기').length}개
 * - 공용: ${frostDKSkills.filter(s => s.spec === '공용').length}개
 *
 * 영웅 특성:
 * - 산왕 (Mountain Thane)
 * - 종말의 기수 (Rider of the Apocalypse)
 */

export const frostDeathKnightSkills = ${JSON.stringify(skillsObj, null, 2)};

// 스킬명 매핑 (역참조용)
export const skillNameMap = ${JSON.stringify(skillNameMap, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'src', 'data', 'frostDeathKnightSkillData.js');
fs.writeFileSync(outputPath, outputContent, 'utf8');

console.log(`\n📄 파일 생성 완료: ${outputPath}`);
console.log(`스킬 수: ${frostDKSkills.length}개`);
console.log(`\n샘플 스킬:`);
console.log(Object.keys(skillsObj).slice(0, 5).join(', '));
