// 악마사냥꾼 스킬 데이터 추출 스크립트
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database-builder/tww-s3-refined-database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const dhSkills = db.DEMONHUNTER || {};

// 파멸 또는 공용 스킬만 필터링
const havocSkills = {};
Object.keys(dhSkills).forEach(key => {
  const skill = dhSkills[key];
  if (skill.spec === '파멸' || skill.spec === '공용') {
    havocSkills[key] = skill;
  }
});

// 파일 생성
const outputPath = path.join(__dirname, '../src/data/havocDemonHunterSkillData.js');
const content = `// 파멸 악마사냥꾼 스킬 데이터
// 데이터 소스: tww-s3-refined-database.json (DEMONHUNTER)
// 생성일: ${new Date().toISOString().split('T')[0]}
// 전문화: 파멸 (Havoc)
// 총 스킬 수: ${Object.keys(havocSkills).length}개 (파멸 전용 + 공용)

// 주요 스킬 개별 export (가이드에서 사용) - ID 기반
export const glide = ${JSON.stringify(havocSkills['131347'] || {}, null, 2)} || {}; // 활공
export const demonsbite = ${JSON.stringify(havocSkills['162243'] || {}, null, 2)} || {}; // 악마의 이빨
export const metamorphosis = ${JSON.stringify(havocSkills['162264'] || {}, null, 2)} || {}; // 탈태
export const chaosstrike = ${JSON.stringify(havocSkills['162794'] || {}, null, 2)} || {}; // 혼돈의 일격
export const throwglaive = ${JSON.stringify(havocSkills['185123'] || {}, null, 2)} || {}; // 글레이브 투척
export const bladedance = ${JSON.stringify(havocSkills['188499'] || {}, null, 2)} || {}; // 칼춤
export const spectralsight = ${JSON.stringify(havocSkills['188501'] || {}, null, 2)} || {}; // 영혼 시야
export const felrush = ${JSON.stringify(havocSkills['195072'] || {}, null, 2)} || {}; // 지옥 돌진
export const netherwalk = ${JSON.stringify(havocSkills['196555'] || {}, null, 2)} || {}; // 황천걸음
export const darkness = ${JSON.stringify(havocSkills['196718'] || {}, null, 2)} || {}; // 어둠
export const eyebeam = ${JSON.stringify(havocSkills['198013'] || {}, null, 2)} || {}; // 안광
export const blur = ${JSON.stringify(havocSkills['198589'] || {}, null, 2)} || {}; // 흐릿해지기
export const vengefulretreat = ${JSON.stringify(havocSkills['198793'] || {}, null, 2)} || {}; // 복수의 퇴각
export const annihilation = ${JSON.stringify(havocSkills['201427'] || {}, null, 2)} || {}; // 파멸
export const deathsweep = ${JSON.stringify(havocSkills['210152'] || {}, null, 2)} || {}; // 죽음의 휩쓸기
export const immolationaura = ${JSON.stringify(havocSkills['258920'] || {}, null, 2)} || {}; // 희생의 오라
export const consumemagic = ${JSON.stringify(havocSkills['278326'] || {}, null, 2)} || {}; // 마법 섭취

// 전체 스킬 객체 export
export const havocDemonHunterSkills = ${JSON.stringify(havocSkills, null, 2)};

// 기본 export
export default havocDemonHunterSkills;
`;

fs.writeFileSync(outputPath, content, 'utf8');
console.log(`✅ 파일 생성 완료: ${outputPath}`);
console.log(`📊 추출된 스킬 수: ${Object.keys(havocSkills).length}개`);
