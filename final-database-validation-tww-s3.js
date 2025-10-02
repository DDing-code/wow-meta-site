// TWW Season 3 최종 데이터베이스 검증
// 11.2 패치 기준, PvP 제외

const fs = require('fs');
const path = require('path');

function validateDatabase() {
  const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');

  // 동적 import를 위한 처리
  delete require.cache[require.resolve(dbPath)];
  const { koreanSpellDatabase } = require(dbPath);

  console.log('🔍 TWW Season 3 데이터베이스 최종 검증...\n');
  console.log('📌 11.2 패치 기준, PvP 특성 제외\n');

  // 통계 계산
  const stats = {
    total: Object.keys(koreanSpellDatabase).length,
    byType: {},
    byClass: {},
    byCategory: {},
    heroTalents: 0,
    hasKorean: 0,
    hasEnglish: 0,
    hasIcon: 0,
    missingData: []
  };

  // 각 스킬 검증
  Object.entries(koreanSpellDatabase).forEach(([id, skill]) => {
    // 타입별 분류
    const type = skill.type || 'unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;

    // 클래스별 분류
    const className = skill.class || 'UNKNOWN';
    stats.byClass[className] = (stats.byClass[className] || 0) + 1;

    // 카테고리별 분류
    const category = skill.category || 'uncategorized';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

    // 영웅 특성 카운트
    if (skill.type === 'heroTalent' || skill.heroTree) {
      stats.heroTalents++;
    }

    // 한국어/영어 번역 체크
    if (skill.koreanName) stats.hasKorean++;
    if (skill.englishName) stats.hasEnglish++;
    if (skill.icon) stats.hasIcon++;

    // 데이터 누락 체크
    const issues = [];
    if (!skill.koreanName && !skill.name) issues.push('이름 없음');
    if (!skill.icon) issues.push('아이콘 없음');
    if (!skill.type) issues.push('타입 없음');
    if (!skill.class) issues.push('클래스 없음');

    if (issues.length > 0) {
      stats.missingData.push({
        id,
        name: skill.koreanName || skill.name || '이름없음',
        issues: issues.join(', ')
      });
    }
  });

  // 결과 출력
  console.log('📊 전체 통계:');
  console.log(`  - 총 스킬 수: ${stats.total}개\n`);

  console.log('📁 타입별 분류:');
  Object.entries(stats.byType).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    const percent = ((count / stats.total) * 100).toFixed(1);
    console.log(`  - ${type}: ${count}개 (${percent}%)`);
  });

  console.log('\n🎯 클래스별 분류:');
  Object.entries(stats.byClass).sort((a, b) => b[1] - a[1]).forEach(([className, count]) => {
    console.log(`  - ${className}: ${count}개`);
  });

  console.log('\n📂 카테고리별 분류:');
  Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
    console.log(`  - ${category}: ${count}개`);
  });

  console.log('\n🌐 번역 및 데이터 완성도:');
  console.log(`  - 한국어 번역: ${stats.hasKorean}개 (${((stats.hasKorean / stats.total) * 100).toFixed(1)}%)`);
  console.log(`  - 영어 번역: ${stats.hasEnglish}개 (${((stats.hasEnglish / stats.total) * 100).toFixed(1)}%)`);
  console.log(`  - 아이콘 데이터: ${stats.hasIcon}개 (${((stats.hasIcon / stats.total) * 100).toFixed(1)}%)`);
  console.log(`  - 영웅 특성: ${stats.heroTalents}개`);

  // 데이터 누락 경고
  if (stats.missingData.length > 0) {
    console.log('\n⚠️ 데이터 누락 스킬 (상위 10개):');
    stats.missingData.slice(0, 10).forEach(skill => {
      console.log(`  - ${skill.id}: ${skill.name} (${skill.issues})`);
    });
    console.log(`  ... 총 ${stats.missingData.length}개 스킬에 누락된 데이터가 있음`);
  }

  // TWW S3 특성 검증
  console.log('\n✅ TWW Season 3 특성 검증:');
  const twwTalents = Object.entries(koreanSpellDatabase).filter(([id, skill]) =>
    skill.type === 'talent' || skill.type === 'heroTalent'
  );
  console.log(`  - 일반 특성: ${twwTalents.filter(([, s]) => s.type === 'talent').length}개`);
  console.log(`  - 영웅 특성: ${twwTalents.filter(([, s]) => s.type === 'heroTalent').length}개`);
  console.log(`  - 총 특성: ${twwTalents.length}개`);

  // 최종 점수 계산
  const completenessScore = (
    (stats.hasKorean / stats.total) * 40 +
    (stats.hasEnglish / stats.total) * 30 +
    (stats.hasIcon / stats.total) * 30
  ).toFixed(1);

  console.log('\n🏆 최종 데이터베이스 품질 점수:');
  console.log(`  ${completenessScore}/100점`);

  if (completenessScore >= 90) {
    console.log('  ✅ 우수한 데이터베이스 품질!');
  } else if (completenessScore >= 70) {
    console.log('  ⚠️ 양호한 품질이나 개선 필요');
  } else {
    console.log('  ❌ 데이터 보완이 필요합니다');
  }

  // 검증 결과 파일로 저장
  const reportPath = path.join(__dirname, 'database-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    patch: '11.2.0',
    season: 'TWW Season 3',
    stats: stats,
    completenessScore: parseFloat(completenessScore)
  }, null, 2), 'utf8');

  console.log(`\n📄 검증 보고서 저장: ${reportPath}`);
}

// 실행
validateDatabase();

console.log('\n✅ TWW Season 3 데이터베이스 검증 완료!');