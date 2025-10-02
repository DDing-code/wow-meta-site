const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
const content = fs.readFileSync(dbPath, 'utf8');

// 통계 수집
let totalSkills = 0;
let missingIcon = 0;
let missingClass = 0;
let missingType = 0;

const skillRegex = /"(\d+)":\s*{([^}]+)}/g;
let match;

while ((match = skillRegex.exec(content)) !== null) {
  totalSkills++;
  const skillContent = match[2];

  if (!skillContent.includes('"icon"') && !skillContent.includes('"iconName"')) {
    missingIcon++;
  }
  if (!skillContent.includes('"class"')) {
    missingClass++;
  }
  if (!skillContent.includes('"type"')) {
    missingType++;
  }
}

console.log('📊 데이터베이스 검증 결과:');
console.log(`  총 스킬: ${totalSkills}개`);
console.log(`  아이콘 누락: ${missingIcon}개 (${((missingIcon/totalSkills)*100).toFixed(1)}%)`);
console.log(`  클래스 누락: ${missingClass}개 (${((missingClass/totalSkills)*100).toFixed(1)}%)`);
console.log(`  타입 누락: ${missingType}개 (${((missingType/totalSkills)*100).toFixed(1)}%)`);

const score = 100 - ((missingIcon + missingClass + missingType) / (totalSkills * 3) * 100);
console.log(`\n✨ 품질 점수: ${score.toFixed(1)}점/100점`);

if (score >= 90) {
  console.log('✅ 우수한 데이터베이스 품질!');
} else if (score >= 70) {
  console.log('⚠️ 양호한 품질이나 개선 필요');
} else {
  console.log('❌ 추가 보완 필요');
}