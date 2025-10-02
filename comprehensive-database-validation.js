// TWW Season 3 종합 데이터베이스 검수 스크립트
// 11.2 패치 기준 완전성 검증

const fs = require('fs');
const path = require('path');

// 데이터베이스 로드 - ES 모듈로 import
async function loadDatabase() {
  const module = await import('./src/data/koreanSpellDatabase.js');
  return module.koreanSpellDatabase;
}

console.log('🔍 TWW Season 3 종합 데이터베이스 검수 시작...\n');
console.log('========================================\n');

// 1. 기본 통계
function validateBasicStats(koreanSpellDatabase) {
  console.log('📊 1. 기본 통계 분석');
  console.log('-------------------');

  const totalSkills = Object.keys(koreanSpellDatabase).length;
  console.log(`총 스킬 수: ${totalSkills}개\n`);

  // 타입별 분류
  const byType = {};
  const byClass = {};
  const byCategory = {};
  const missingFields = {
    name: [],
    icon: [],
    type: [],
    class: [],
    koreanName: [],
    englishName: []
  };

  Object.entries(koreanSpellDatabase).forEach(([id, skill]) => {
    // 타입 분류
    const type = skill.type || 'unknown';
    byType[type] = (byType[type] || 0) + 1;

    // 클래스 분류
    const className = skill.class || 'UNKNOWN';
    byClass[className] = (byClass[className] || 0) + 1;

    // 카테고리 분류
    const category = skill.category || 'uncategorized';
    byCategory[category] = (byCategory[category] || 0) + 1;

    // 필수 필드 체크
    if (!skill.name && !skill.koreanName) missingFields.name.push(id);
    if (!skill.icon) missingFields.icon.push(id);
    if (!skill.type) missingFields.type.push(id);
    if (!skill.class) missingFields.class.push(id);
    if (!skill.koreanName) missingFields.koreanName.push(id);
    if (!skill.englishName) missingFields.englishName.push(id);
  });

  console.log('타입별 분포:');
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}개`);
  });

  console.log('\n클래스별 분포:');
  Object.entries(byClass).sort((a, b) => b[1] - a[1]).forEach(([className, count]) => {
    console.log(`  ${className}: ${count}개`);
  });

  console.log('\n카테고리별 분포:');
  Object.entries(byCategory).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}개`);
  });

  console.log('\n누락 필드 검사:');
  Object.entries(missingFields).forEach(([field, ids]) => {
    if (ids.length > 0) {
      console.log(`  ⚠️ ${field} 누락: ${ids.length}개`);
      if (ids.length <= 5) {
        console.log(`     IDs: ${ids.join(', ')}`);
      } else {
        console.log(`     IDs: ${ids.slice(0, 5).join(', ')} ... (외 ${ids.length - 5}개)`);
      }
    } else {
      console.log(`  ✅ ${field}: 모두 존재`);
    }
  });

  return { totalSkills, byType, byClass, byCategory, missingFields };
}

// 2. 중복 검사
function validateDuplicates(koreanSpellDatabase) {
  console.log('\n📋 2. 중복 데이터 검사');
  console.log('--------------------');

  const nameMap = {};
  const duplicates = [];

  Object.entries(koreanSpellDatabase).forEach(([id, skill]) => {
    const name = skill.koreanName || skill.name;
    if (name) {
      if (nameMap[name]) {
        duplicates.push({
          name,
          ids: [nameMap[name], id]
        });
      } else {
        nameMap[name] = id;
      }
    }
  });

  if (duplicates.length > 0) {
    console.log(`⚠️ ${duplicates.length}개의 중복 스킬명 발견:`);
    duplicates.slice(0, 10).forEach(dup => {
      console.log(`  - "${dup.name}": ${dup.ids.join(', ')}`);
    });
  } else {
    console.log('✅ 중복 스킬명 없음');
  }

  return duplicates;
}

// 3. 영웅 특성 검증
function validateHeroTalents(koreanSpellDatabase) {
  console.log('\n🦸 3. 영웅 특성 검증');
  console.log('------------------');

  const expectedHeroTrees = {
    WARRIOR: ['mountain-thane', 'colossus', 'slayer'],
    PALADIN: ['herald-of-the-sun', 'lightsmith', 'templar'],
    DEATHKNIGHT: ['deathbringer', 'san-layn', 'rider-of-the-apocalypse'],
    DEMONHUNTER: ['aldrachi-reaver', 'fel-scarred'],
    DRUID: ['keeper-of-the-grove', 'elunes-chosen', 'wildstalker'],
    EVOKER: ['flameshaper', 'scalecommander', 'chronowarden'],
    HUNTER: ['pack-leader', 'dark-ranger', 'sentinel'],
    MAGE: ['sunfury', 'frostfire', 'spellslinger'],
    MONK: ['master-of-harmony', 'shado-pan', 'conduit-of-the-celestials'],
    PRIEST: ['voidweaver', 'oracle', 'archon'],
    ROGUE: ['deathstalker', 'fatebound', 'trickster'],
    SHAMAN: ['totemic', 'stormbringer', 'farseer'],
    WARLOCK: ['diabolist', 'soul-harvester', 'hellcaller']
  };

  const foundHeroTrees = {};
  let heroTalentCount = 0;

  Object.entries(koreanSpellDatabase).forEach(([id, skill]) => {
    if (skill.type === 'heroTalent' || skill.heroTree) {
      heroTalentCount++;
      const className = skill.class;
      const heroTree = skill.heroTree;

      if (className && heroTree) {
        if (!foundHeroTrees[className]) {
          foundHeroTrees[className] = new Set();
        }
        foundHeroTrees[className].add(heroTree);
      }
    }
  });

  console.log(`총 영웅 특성: ${heroTalentCount}개\n`);

  console.log('클래스별 영웅 특성 트리:');
  Object.entries(expectedHeroTrees).forEach(([className, expectedTrees]) => {
    const foundTrees = foundHeroTrees[className] ? Array.from(foundHeroTrees[className]) : [];
    const missingTrees = expectedTrees.filter(tree => !foundTrees.includes(tree));

    if (missingTrees.length > 0) {
      console.log(`  ⚠️ ${className}: ${foundTrees.length}/${expectedTrees.length}개 트리`);
      console.log(`     누락: ${missingTrees.join(', ')}`);
    } else {
      console.log(`  ✅ ${className}: ${foundTrees.length}/${expectedTrees.length}개 트리 완료`);
    }
  });

  return { heroTalentCount, foundHeroTrees };
}

// 4. 번역 품질 검증
function validateTranslations(koreanSpellDatabase) {
  console.log('\n🌐 4. 번역 품질 검증');
  console.log('------------------');

  const translationIssues = {
    missingKorean: [],
    missingEnglish: [],
    suspiciousTranslations: []
  };

  // 의심스러운 번역 패턴
  const suspiciousPatterns = [
    { korean: '산의 왕', correct: '산왕', type: 'Mountain Thane' },
    { korean: '거인', correct: '거신', type: 'Colossus' },
    { korean: '빛벼림', correct: '빛의 대장장이', type: 'Lightsmith' }
  ];

  Object.entries(koreanSpellDatabase).forEach(([id, skill]) => {
    if (!skill.koreanName) {
      translationIssues.missingKorean.push(id);
    }

    if (!skill.englishName) {
      translationIssues.missingEnglish.push(id);
    }

    // 의심스러운 번역 체크
    suspiciousPatterns.forEach(pattern => {
      if (skill.koreanName === pattern.korean || skill.name === pattern.korean) {
        translationIssues.suspiciousTranslations.push({
          id,
          current: pattern.korean,
          suggested: pattern.correct,
          type: pattern.type
        });
      }
    });
  });

  console.log(`한국어 번역 누락: ${translationIssues.missingKorean.length}개`);
  console.log(`영어 번역 누락: ${translationIssues.missingEnglish.length}개`);

  if (translationIssues.suspiciousTranslations.length > 0) {
    console.log(`\n⚠️ 의심스러운 번역 ${translationIssues.suspiciousTranslations.length}개:`);
    translationIssues.suspiciousTranslations.forEach(issue => {
      console.log(`  ID ${issue.id}: "${issue.current}" → "${issue.suggested}" (${issue.type})`);
    });
  } else {
    console.log('\n✅ 번역 검증 통과');
  }

  return translationIssues;
}

// 5. 필수 스킬 체크
function validateEssentialSkills(koreanSpellDatabase) {
  console.log('\n⚔️ 5. 필수 기본 스킬 체크');
  console.log('----------------------');

  const essentialSkills = {
    WARRIOR: [
      { id: '1464', name: '휩쓸기 일격' },
      { id: '23922', name: '방패 밀쳐내기' },
      { id: '1680', name: '소용돌이' }
    ],
    PALADIN: [
      { id: '35395', name: '성전사의 일격' },
      { id: '20271', name: '심판' },
      { id: '642', name: '천상의 보호막' }
    ],
    DEATHKNIGHT: [
      { id: '49998', name: '죽음의 일격' },
      { id: '47541', name: '죽음의 고리' },
      { id: '48707', name: '대마법 보호막' }
    ],
    HUNTER: [
      { id: '53351', name: '처형 사격' },
      { id: '19434', name: '조준 사격' },
      { id: '2643', name: '광역 공격' }
    ],
    MAGE: [
      { id: '116', name: '서리 화살' },
      { id: '133', name: '화염구' },
      { id: '30451', name: '비전 작렬' }
    ]
  };

  let totalEssential = 0;
  let foundEssential = 0;

  console.log('클래스별 필수 스킬 체크:');
  Object.entries(essentialSkills).forEach(([className, skills]) => {
    let classFound = 0;

    skills.forEach(skill => {
      totalEssential++;
      if (koreanSpellDatabase[skill.id]) {
        foundEssential++;
        classFound++;
      }
    });

    const percentage = ((classFound / skills.length) * 100).toFixed(0);
    if (classFound === skills.length) {
      console.log(`  ✅ ${className}: ${classFound}/${skills.length} (${percentage}%)`);
    } else {
      console.log(`  ⚠️ ${className}: ${classFound}/${skills.length} (${percentage}%)`);
    }
  });

  const totalPercentage = ((foundEssential / totalEssential) * 100).toFixed(1);
  console.log(`\n전체 필수 스킬: ${foundEssential}/${totalEssential} (${totalPercentage}%)`);

  return { totalEssential, foundEssential };
}

// 6. 최종 점수 계산
function calculateFinalScore(stats) {
  console.log('\n🏆 6. 최종 데이터베이스 품질 점수');
  console.log('-------------------------------');

  const weights = {
    completeness: 30,
    translations: 25,
    heroTalents: 20,
    essentialSkills: 15,
    noDuplicates: 10
  };

  // 완성도 점수 (필드 완성도)
  const totalFields = stats.basic.totalSkills * 6; // 6개 주요 필드
  const missingCount = Object.values(stats.basic.missingFields)
    .reduce((sum, arr) => sum + arr.length, 0);
  const completenessScore = ((totalFields - missingCount) / totalFields) * weights.completeness;

  // 번역 점수
  const translationMissing = stats.translations.missingKorean.length +
                           stats.translations.missingEnglish.length;
  const translationScore = Math.max(0,
    (1 - translationMissing / (stats.basic.totalSkills * 2)) * weights.translations);

  // 영웅 특성 점수
  const heroScore = (stats.heroTalents.heroTalentCount > 0) ? weights.heroTalents : 0;

  // 필수 스킬 점수
  const essentialScore = (stats.essential.foundEssential / stats.essential.totalEssential) *
                        weights.essentialSkills;

  // 중복 없음 점수
  const duplicateScore = (stats.duplicates.length === 0) ? weights.noDuplicates : 0;

  const totalScore = completenessScore + translationScore + heroScore +
                    essentialScore + duplicateScore;

  console.log('항목별 점수:');
  console.log(`  완성도: ${completenessScore.toFixed(1)}/${weights.completeness}`);
  console.log(`  번역: ${translationScore.toFixed(1)}/${weights.translations}`);
  console.log(`  영웅 특성: ${heroScore.toFixed(1)}/${weights.heroTalents}`);
  console.log(`  필수 스킬: ${essentialScore.toFixed(1)}/${weights.essentialSkills}`);
  console.log(`  중복 체크: ${duplicateScore.toFixed(1)}/${weights.noDuplicates}`);
  console.log(`\n총점: ${totalScore.toFixed(1)}/100점`);

  if (totalScore >= 90) {
    console.log('평가: 🌟 우수 - 프로덕션 준비 완료');
  } else if (totalScore >= 70) {
    console.log('평가: ✅ 양호 - 일부 개선 필요');
  } else if (totalScore >= 50) {
    console.log('평가: ⚠️ 보통 - 상당한 보완 필요');
  } else {
    console.log('평가: ❌ 미흡 - 전면적인 재작업 필요');
  }

  return totalScore;
}

// 메인 실행
async function runValidation() {
  console.log('🚀 검수 시작 시간:', new Date().toLocaleString('ko-KR'));
  console.log('========================================\n');

  const koreanSpellDatabase = await loadDatabase();

  const results = {
    basic: validateBasicStats(koreanSpellDatabase),
    duplicates: validateDuplicates(koreanSpellDatabase),
    heroTalents: validateHeroTalents(koreanSpellDatabase),
    translations: validateTranslations(koreanSpellDatabase),
    essential: validateEssentialSkills(koreanSpellDatabase)
  };

  const finalScore = calculateFinalScore(results);

  // 검증 보고서 저장
  const reportPath = path.join(__dirname, 'validation-report-tww-s3.json');
  const report = {
    timestamp: new Date().toISOString(),
    patch: '11.2.0',
    season: 'TWW Season 3',
    score: finalScore,
    results: results
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('\n========================================');
  console.log(`📄 검증 보고서 저장: ${reportPath}`);
  console.log('🏁 검수 완료 시간:', new Date().toLocaleString('ko-KR'));
  console.log('\n✅ TWW Season 3 데이터베이스 검수 완료!');

  // 개선이 필요한 항목 요약
  if (results.basic.missingFields.icon.length > 0 ||
      results.translations.missingKorean.length > 0 ||
      results.duplicates.length > 0) {
    console.log('\n📝 개선 필요 사항:');
    if (results.basic.missingFields.icon.length > 0) {
      console.log(`  - 아이콘 추가 필요: ${results.basic.missingFields.icon.length}개`);
    }
    if (results.translations.missingKorean.length > 0) {
      console.log(`  - 한국어 번역 추가 필요: ${results.translations.missingKorean.length}개`);
    }
    if (results.duplicates.length > 0) {
      console.log(`  - 중복 스킬 정리 필요: ${results.duplicates.length}개`);
    }
  }
}

// 실행
runValidation();