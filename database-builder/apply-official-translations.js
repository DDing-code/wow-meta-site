/**
 * apply-official-translations.js
 *
 * 목적: 검증된 공식 번역을 elementalShamanSkillData.js에 자동 적용
 */

const fs = require('fs');
const path = require('path');

// 검증 결과 로드
const resultsPath = path.join(__dirname, 'translation-verification-results.json');
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

// 수정 필요한 스킬만 필터링
const skillsToUpdate = results.filter(r => r.needsUpdate);

console.log(`📝 ${skillsToUpdate.length}개 스킬 번역 수정 시작...\n`);

// elementalShamanSkillData.js 읽기
const dataFilePath = path.join(__dirname, '..', 'src', 'data', 'elementalShamanSkillData.js');
let content = fs.readFileSync(dataFilePath, 'utf8');

// 각 스킬 번역 수정
skillsToUpdate.forEach((skill, index) => {
  console.log(`[${index + 1}/${skillsToUpdate.length}] 수정: ${skill.key}`);
  console.log(`  "${skill.currentName}" → "${skill.officialName}"`);

  // koreanName 필드 찾아서 교체
  const regex = new RegExp(
    `(${skill.key}:[\\s\\S]*?koreanName:\\s*")${skill.currentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(")`
  );

  if (regex.test(content)) {
    content = content.replace(regex, `$1${skill.officialName}$2`);
    console.log(`  ✅ 수정 완료`);
  } else {
    console.log(`  ⚠️  패턴 찾을 수 없음 - 수동 확인 필요`);
  }

  // skillNameMap도 수정
  const mapRegex = new RegExp(
    `('${skill.currentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}': ')`,
    'g'
  );

  if (mapRegex.test(content)) {
    content = content.replace(mapRegex, `'${skill.officialName}': `);
    console.log(`  ✅ skillNameMap 수정 완료`);
  }

  console.log('');
});

// 파일 저장
fs.writeFileSync(dataFilePath, content, 'utf8');

console.log('✅ elementalShamanSkillData.js 수정 완료!\n');
console.log('📋 수정 요약:');
skillsToUpdate.forEach(skill => {
  console.log(`  - ${skill.key}: "${skill.currentName}" → "${skill.officialName}"`);
});

console.log(`\n💾 ${skillsToUpdate.length}개 스킬 번역 업데이트 완료`);
