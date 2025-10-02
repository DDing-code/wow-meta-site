// 통합된 데이터베이스의 모든 스킬 검증
const fs = require('fs');
const path = require('path');

console.log('🔍 전체 스킬 데이터베이스 검증 시작...\n');
console.log('=' .repeat(80));

// 1. 통합된 koreanSpellDatabase 로드
const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');
const dbMatch = dbContent.match(/export const koreanSpellDatabase = ({[\s\S]*?});/);

if (!dbMatch) {
  console.error('❌ 데이터베이스 로드 실패');
  process.exit(1);
}

let database = {};
try {
  database = eval('(' + dbMatch[1] + ')');
  console.log(`✅ 데이터베이스 로드: ${Object.keys(database).length}개 스킬\n`);
} catch (e) {
  console.error('❌ 데이터베이스 파싱 실패:', e.message);
  process.exit(1);
}

// 2. 검증 통계
const stats = {
  total: 0,
  valid: 0,
  warnings: 0,
  errors: 0,
  byClass: {},
  byCategory: {},
  withSpecDifferences: 0,
  withHeroTalents: 0,
  withTalentInteractions: 0,
  missingKoreanName: [],
  missingDescription: [],
  missingIcon: [],
  duplicateNames: {},
  resourceTypes: {},
  schoolTypes: {},
  categoryTypes: {}
};

// 3. 검증 함수들
function validateSkillStructure(skillId, skill) {
  const issues = {
    errors: [],
    warnings: []
  };

  // 필수 필드 체크
  if (!skill.name && !skill.koreanName) {
    issues.errors.push('이름 누락');
  }

  if (!skill.koreanName) {
    issues.warnings.push('한글명 누락');
    stats.missingKoreanName.push({
      id: skillId,
      name: skill.name || 'Unknown'
    });
  }

  if (!skill.description) {
    issues.warnings.push('설명 누락');
    stats.missingDescription.push({
      id: skillId,
      name: skill.koreanName || skill.name || 'Unknown'
    });
  }

  if (!skill.icon && !skill.iconName) {
    issues.warnings.push('아이콘 누락');
    stats.missingIcon.push({
      id: skillId,
      name: skill.koreanName || skill.name || 'Unknown'
    });
  }

  // 설명 품질 체크
  if (skill.description) {
    if (skill.description.includes('()')) {
      issues.warnings.push('빈 괄호 포함');
    }
    if (/\s+(을|를|이|가)\s+/.test(skill.description)) {
      issues.warnings.push('불완전한 조사');
    }
    if (/\|\d+/.test(skill.description)) {
      issues.warnings.push('변수 치환 패턴 남음');
    }
  }

  // 자원 검증
  if (skill.resource) {
    const resourceType = skill.resource.type || 'Unknown';
    stats.resourceTypes[resourceType] = (stats.resourceTypes[resourceType] || 0) + 1;

    if (skill.resourceGenerate && skill.resource.type === skill.resourceGenerate.type) {
      if (!skill.resourceGenerate.conditions) {
        issues.warnings.push('같은 자원 소모/생성');
      }
    }
  }

  // 카테고리 검증
  if (skill.category) {
    stats.categoryTypes[skill.category] = (stats.categoryTypes[skill.category] || 0) + 1;
  }

  // 학교 검증
  if (skill.school) {
    stats.schoolTypes[skill.school] = (stats.schoolTypes[skill.school] || 0) + 1;
  }

  return issues;
}

// 4. 모든 스킬 검증
console.log('📋 개별 스킬 검증 중...\n');

const problemSkills = [];
const validSkills = [];

Object.entries(database).forEach(([skillId, skill]) => {
  stats.total++;

  // 클래스별 통계
  const className = skill.class || 'Unknown';
  stats.byClass[className] = (stats.byClass[className] || 0) + 1;

  // 카테고리별 통계
  const category = skill.category || 'unknown';
  stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

  // 전문화별 차이 체크
  if (skill.specializationDetails) {
    stats.withSpecDifferences++;
  }

  // 영웅 특성 체크
  if (skill.heroTalents) {
    stats.withHeroTalents++;
  }

  // 특성 상호작용 체크
  if (skill.talentInteractions) {
    stats.withTalentInteractions++;
  }

  // 구조 검증
  const validation = validateSkillStructure(skillId, skill);

  if (validation.errors.length > 0) {
    stats.errors++;
    problemSkills.push({
      id: skillId,
      name: skill.koreanName || skill.name || 'Unknown',
      errors: validation.errors,
      warnings: validation.warnings
    });
  } else if (validation.warnings.length > 0) {
    stats.warnings++;
    problemSkills.push({
      id: skillId,
      name: skill.koreanName || skill.name || 'Unknown',
      errors: [],
      warnings: validation.warnings
    });
  } else {
    stats.valid++;
    validSkills.push({
      id: skillId,
      name: skill.koreanName || skill.name || 'Unknown'
    });
  }

  // 중복 이름 체크
  const skillName = skill.koreanName || skill.name;
  if (skillName) {
    if (!stats.duplicateNames[skillName]) {
      stats.duplicateNames[skillName] = [];
    }
    stats.duplicateNames[skillName].push(skillId);
  }
});

// 5. 검증 보고서 출력
console.log('=' .repeat(80));
console.log('\n📊 검증 결과 요약\n');
console.log('=' .repeat(80));

console.log(`\n📈 전체 통계:`);
console.log(`  - 전체 스킬: ${stats.total}개`);
console.log(`  - ✅ 완벽: ${stats.valid}개 (${((stats.valid/stats.total)*100).toFixed(1)}%)`);
console.log(`  - ⚠️ 경고: ${stats.warnings}개 (${((stats.warnings/stats.total)*100).toFixed(1)}%)`);
console.log(`  - ❌ 오류: ${stats.errors}개 (${((stats.errors/stats.total)*100).toFixed(1)}%)`);

console.log(`\n🎯 특수 데이터:`);
console.log(`  - 전문화별 차이: ${stats.withSpecDifferences}개`);
console.log(`  - 영웅 특성 (TWW): ${stats.withHeroTalents}개`);
console.log(`  - 특성 상호작용: ${stats.withTalentInteractions}개`);

console.log(`\n🎮 클래스별 분포:`);
Object.entries(stats.byClass)
  .sort((a, b) => b[1] - a[1])
  .forEach(([className, count]) => {
    console.log(`  - ${className}: ${count}개`);
  });

console.log(`\n📚 카테고리별 분포:`);
Object.entries(stats.byCategory)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .forEach(([category, count]) => {
    console.log(`  - ${category}: ${count}개`);
  });

console.log(`\n⚡ 자원 타입 분포:`);
Object.entries(stats.resourceTypes)
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}개`);
  });

console.log(`\n🔮 주문 계열 분포:`);
Object.entries(stats.schoolTypes)
  .sort((a, b) => b[1] - a[1])
  .forEach(([school, count]) => {
    console.log(`  - ${school}: ${count}개`);
  });

// 6. 문제가 있는 스킬들
if (problemSkills.length > 0) {
  console.log('\n' + '=' .repeat(80));
  console.log('\n⚠️ 문제가 있는 스킬 (상위 20개)\n');
  console.log('=' .repeat(80));

  problemSkills.slice(0, 20).forEach(skill => {
    console.log(`\n[${skill.id}] ${skill.name}`);
    if (skill.errors.length > 0) {
      console.log('  ❌ 오류:');
      skill.errors.forEach(error => console.log(`    - ${error}`));
    }
    if (skill.warnings.length > 0) {
      console.log('  ⚠️ 경고:');
      skill.warnings.forEach(warning => console.log(`    - ${warning}`));
    }
  });

  if (problemSkills.length > 20) {
    console.log(`\n... 외 ${problemSkills.length - 20}개 더`);
  }
}

// 7. 누락된 데이터 요약
console.log('\n' + '=' .repeat(80));
console.log('\n📝 누락 데이터 요약\n');
console.log('=' .repeat(80));

if (stats.missingKoreanName.length > 0) {
  console.log(`\n❓ 한글명 누락 (${stats.missingKoreanName.length}개):`);
  stats.missingKoreanName.slice(0, 10).forEach(skill => {
    console.log(`  - [${skill.id}] ${skill.name}`);
  });
  if (stats.missingKoreanName.length > 10) {
    console.log(`  ... 외 ${stats.missingKoreanName.length - 10}개`);
  }
}

if (stats.missingDescription.length > 0) {
  console.log(`\n📄 설명 누락 (${stats.missingDescription.length}개):`);
  stats.missingDescription.slice(0, 10).forEach(skill => {
    console.log(`  - [${skill.id}] ${skill.name}`);
  });
  if (stats.missingDescription.length > 10) {
    console.log(`  ... 외 ${stats.missingDescription.length - 10}개`);
  }
}

if (stats.missingIcon.length > 0) {
  console.log(`\n🖼️ 아이콘 누락 (${stats.missingIcon.length}개):`);
  stats.missingIcon.slice(0, 10).forEach(skill => {
    console.log(`  - [${skill.id}] ${skill.name}`);
  });
  if (stats.missingIcon.length > 10) {
    console.log(`  ... 외 ${stats.missingIcon.length - 10}개`);
  }
}

// 8. 중복 이름 체크
const duplicates = Object.entries(stats.duplicateNames)
  .filter(([name, ids]) => ids.length > 1)
  .sort((a, b) => b[1].length - a[1].length);

if (duplicates.length > 0) {
  console.log('\n' + '=' .repeat(80));
  console.log('\n🔄 중복 이름 스킬\n');
  console.log('=' .repeat(80));

  duplicates.slice(0, 10).forEach(([name, ids]) => {
    console.log(`\n"${name}": ${ids.length}개`);
    console.log(`  IDs: ${ids.join(', ')}`);
  });
}

// 9. 검증 보고서 저장
const report = {
  summary: {
    total: stats.total,
    valid: stats.valid,
    warnings: stats.warnings,
    errors: stats.errors,
    validationDate: new Date().toISOString()
  },
  statistics: stats,
  problemSkills: problemSkills.slice(0, 100), // 상위 100개만 저장
  duplicates: duplicates.slice(0, 50) // 상위 50개만 저장
};

const reportPath = path.join(__dirname, 'src/data/full-validation-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

console.log('\n' + '=' .repeat(80));
console.log(`\n📄 상세 보고서 저장: ${reportPath}`);
console.log('\n' + '=' .repeat(80));

// 10. 최종 평가
console.log('\n🏆 최종 평가:\n');

const successRate = (stats.valid / stats.total) * 100;
if (successRate >= 90) {
  console.log('✅ 우수: 데이터베이스 품질이 매우 좋습니다!');
} else if (successRate >= 70) {
  console.log('⚠️ 양호: 일부 개선이 필요합니다.');
} else {
  console.log('❌ 미흡: 상당한 개선이 필요합니다.');
}

console.log(`\n전체 성공률: ${successRate.toFixed(1)}%`);
console.log('\n검증 완료! 🎉\n');