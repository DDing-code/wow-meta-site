const fs = require('fs');
const path = require('path');

// 데이터베이스 파일 읽기
const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
const content = fs.readFileSync(dbPath, 'utf8');

// 데이터베이스 추출
const dbMatch = content.match(/const koreanSpellDatabase = ({\s[\s\S]*?});/);
if (!dbMatch) {
  console.error('❌ 데이터베이스를 찾을 수 없습니다.');
  process.exit(1);
}

const func = new Function('return ' + dbMatch[1]);
const db = func();

// 샘플 데이터 확인
console.log('=== 샘플 스킬 데이터 (처음 10개) ===');
Object.keys(db).slice(0, 10).forEach(id => {
  const skill = db[id];
  console.log(`\nID ${id}: ${skill.koreanName || skill.name}`);
  console.log(`- 아이콘: ${skill.icon ? '✅' : '❌'} ${skill.icon || '없음'}`);
  console.log(`- 설명: ${skill.description ? '✅' : '❌'} ${skill.description ? skill.description.substring(0, 50) + '...' : '없음'}`);
  console.log(`- 재사용: ${skill.cooldown || '정보 없음'}`);
  console.log(`- 자원: ${skill.resource ? JSON.stringify(skill.resource) : '정보 없음'}`);
});

// 전체 통계
const stats = {
  total: Object.keys(db).length,
  withIcon: Object.values(db).filter(s => s.icon && s.icon !== 'inv_misc_questionmark').length,
  withDesc: Object.values(db).filter(s => s.description).length,
  withCooldown: Object.values(db).filter(s => s.cooldown).length,
  withResource: Object.values(db).filter(s => s.resource).length,
  withCategory: Object.values(db).filter(s => s.category).length,
  withClass: Object.values(db).filter(s => s.class).length
};

console.log('\n=== 전체 데이터베이스 통계 ===');
console.log(`총 스킬: ${stats.total}개`);
console.log(`아이콘 있음: ${stats.withIcon}개 (${(stats.withIcon/stats.total*100).toFixed(1)}%)`);
console.log(`설명 있음: ${stats.withDesc}개 (${(stats.withDesc/stats.total*100).toFixed(1)}%)`);
console.log(`재사용 대기시간: ${stats.withCooldown}개 (${(stats.withCooldown/stats.total*100).toFixed(1)}%)`);
console.log(`자원 정보: ${stats.withResource}개 (${(stats.withResource/stats.total*100).toFixed(1)}%)`);
console.log(`카테고리: ${stats.withCategory}개 (${(stats.withCategory/stats.total*100).toFixed(1)}%)`);
console.log(`클래스: ${stats.withClass}개 (${(stats.withClass/stats.total*100).toFixed(1)}%)`);

// 설명이 없는 스킬 중 주요 스킬 찾기
console.log('\n=== 설명이 없는 주요 스킬 (처음 20개) ===');
const noDescSkills = Object.entries(db)
  .filter(([id, skill]) => !skill.description && skill.icon && skill.icon !== 'inv_misc_questionmark')
  .slice(0, 20);

noDescSkills.forEach(([id, skill]) => {
  console.log(`- ${id}: ${skill.koreanName || skill.name} (${skill.class || '클래스 없음'})`);
});

// 특정 스킬 확인 (예: 광전사의 격노)
console.log('\n=== 특정 스킬 상세 확인 ===');
const checkSkills = ['18499', '100', '853', '1856', '45438'];
checkSkills.forEach(id => {
  const skill = db[id];
  if (skill) {
    console.log(`\n${id}: ${skill.koreanName || skill.name}`);
    console.log('- 전체 데이터:', JSON.stringify(skill, null, 2));
  } else {
    console.log(`${id}: 데이터베이스에 없음`);
  }
});