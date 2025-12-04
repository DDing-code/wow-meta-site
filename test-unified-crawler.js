/**
 * test-unified-crawler.js
 * 통합 가이드 크롤러 테스트 및 성능 측정
 *
 * 테스트 케이스: 3개 사이트 × 3개 직업 = 9개
 * 측정 지표:
 * - 추출 성공률 (섹션별)
 * - 평균 신뢰도
 * - 크롤링 시간
 * - 내부 DB 활용률
 */

import { crawlGuide, loadInternalDB } from './unified-guide-crawler.js';

// ═════════════════════════════════════════════════════════════════════
// 테스트 케이스 정의
// ═════════════════════════════════════════════════════════════════════

const testCases = [
  // Wowhead
  { className: 'mage', specName: 'arcane', source: 'wowhead', display: '비전 마법사 (Wowhead)' },
  { className: 'warrior', specName: 'fury', source: 'wowhead', display: '분노 전사 (Wowhead)' },
  { className: 'paladin', specName: 'holy', source: 'wowhead', display: '신성 성기사 (Wowhead)' },

  // Maxroll
  { className: 'mage', specName: 'frost', source: 'maxroll', display: '냉기 마법사 (Maxroll)' },
  { className: 'warrior', specName: 'arms', source: 'maxroll', display: '무기 전사 (Maxroll)' },
  { className: 'paladin', specName: 'retribution', source: 'maxroll', display: '징벌 성기사 (Maxroll)' },

  // Icy-veins
  { className: 'mage', specName: 'fire', source: 'icy-veins', display: '화염 마법사 (Icy-veins)' },
  { className: 'warrior', specName: 'protection', source: 'icy-veins', display: '방어 전사 (Icy-veins)' },
  { className: 'paladin', specName: 'protection', source: 'icy-veins', display: '보호 성기사 (Icy-veins)' }
];

// ═════════════════════════════════════════════════════════════════════
// 결과 분석
// ═════════════════════════════════════════════════════════════════════

function analyzeResult(result) {
  const sections = Object.keys(result).filter(key =>
    key !== 'source' && key !== 'className' && key !== 'specName' && key !== 'metadata'
  );

  const successCount = sections.filter(key => result[key]?.found === true).length;
  const totalSections = sections.length;
  const successRate = totalSections > 0 ? (successCount / totalSections * 100).toFixed(1) : 0;

  const totalBlocks = sections.reduce((sum, key) => {
    return sum + (result[key]?.contents?.length || 0);
  }, 0);

  return {
    sections: totalSections,
    successCount,
    successRate: parseFloat(successRate),
    totalBlocks,
    reliability: result.metadata?.reliability || 0,
    hasInternalDB: result.metadata?.hasInternalDB || false,
    internalDBSkills: result.metadata?.internalDBSkills || 0
  };
}

// ═════════════════════════════════════════════════════════════════════
// 메인 테스트 실행
// ═════════════════════════════════════════════════════════════════════

async function main() {
  console.log('═'.repeat(80));
  console.log('  통합 가이드 크롤러 성능 테스트');
  console.log('  테스트 케이스: 9개 (3개 사이트 × 3개 직업)');
  console.log('═'.repeat(80));

  // 내부 DB 로드
  await loadInternalDB();

  const results = [];
  const errors = [];

  // 각 테스트 케이스 실행
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const progress = `[${i + 1}/${testCases.length}]`;

    console.log(`\n${progress} ${testCase.display}`);
    console.log('─'.repeat(80));

    try {
      const startTime = Date.now();

      const result = await crawlGuide(
        testCase.className,
        testCase.specName,
        testCase.source
      );

      const elapsedTime = Date.now() - startTime;
      const analysis = analyzeResult(result);

      results.push({
        testCase,
        analysis,
        elapsedTime,
        success: true
      });

      console.log(`\n✅ 테스트 성공 (${(elapsedTime / 1000).toFixed(1)}초)`);
      console.log(`   추출 성공률: ${analysis.successRate}% (${analysis.successCount}/${analysis.sections})`);
      console.log(`   콘텐츠 블록: ${analysis.totalBlocks}개`);
      console.log(`   신뢰도: ${(analysis.reliability * 100).toFixed(0)}%`);

    } catch (error) {
      console.error(`\n❌ 테스트 실패: ${error.message}`);
      errors.push({
        testCase,
        error: error.message
      });

      results.push({
        testCase,
        analysis: null,
        elapsedTime: 0,
        success: false
      });
    }

    // 다음 테스트 전 2초 대기 (Rate limiting)
    if (i < testCases.length - 1) {
      console.log('\n⏳ 2초 대기...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // ═════════════════════════════════════════════════════════════════════
  // 전체 통계 출력
  // ═════════════════════════════════════════════════════════════════════

  console.log('\n\n' + '═'.repeat(80));
  console.log('  📊 전체 테스트 결과');
  console.log('═'.repeat(80));

  const successfulResults = results.filter(r => r.success);
  const totalTests = results.length;
  const successfulTests = successfulResults.length;

  console.log(`\n전체 테스트: ${totalTests}개`);
  console.log(`성공: ${successfulTests}/${totalTests} (${(successfulTests/totalTests*100).toFixed(1)}%)`);
  console.log(`실패: ${errors.length}/${totalTests} (${(errors.length/totalTests*100).toFixed(1)}%)`);

  if (successfulResults.length > 0) {
    // 평균 통계
    const avgSuccessRate = successfulResults.reduce((sum, r) => sum + r.analysis.successRate, 0) / successfulResults.length;
    const avgReliability = successfulResults.reduce((sum, r) => sum + r.analysis.reliability, 0) / successfulResults.length;
    const avgBlocks = successfulResults.reduce((sum, r) => sum + r.analysis.totalBlocks, 0) / successfulResults.length;
    const avgTime = successfulResults.reduce((sum, r) => sum + r.elapsedTime, 0) / successfulResults.length;

    console.log(`\n평균 추출 성공률: ${avgSuccessRate.toFixed(1)}%`);
    console.log(`평균 신뢰도: ${(avgReliability * 100).toFixed(1)}%`);
    console.log(`평균 콘텐츠 블록: ${avgBlocks.toFixed(1)}개`);
    console.log(`평균 크롤링 시간: ${(avgTime / 1000).toFixed(1)}초`);

    // 사이트별 통계
    console.log('\n─'.repeat(80));
    console.log('📈 사이트별 성능:');
    console.log('─'.repeat(80));

    const siteStats = {};
    successfulResults.forEach(r => {
      const source = r.testCase.source;
      if (!siteStats[source]) {
        siteStats[source] = {
          count: 0,
          successRate: 0,
          reliability: 0,
          blocks: 0
        };
      }

      siteStats[source].count++;
      siteStats[source].successRate += r.analysis.successRate;
      siteStats[source].reliability += r.analysis.reliability;
      siteStats[source].blocks += r.analysis.totalBlocks;
    });

    Object.entries(siteStats).forEach(([source, stats]) => {
      console.log(`\n${source}:`);
      console.log(`  테스트: ${stats.count}개`);
      console.log(`  평균 추출 성공률: ${(stats.successRate / stats.count).toFixed(1)}%`);
      console.log(`  평균 신뢰도: ${(stats.reliability / stats.count * 100).toFixed(1)}%`);
      console.log(`  평균 콘텐츠 블록: ${(stats.blocks / stats.count).toFixed(1)}개`);
    });

    // 내부 DB 활용 통계
    const dbUsers = successfulResults.filter(r => r.analysis.hasInternalDB);
    console.log('\n─'.repeat(80));
    console.log('💾 내부 DB 활용:');
    console.log('─'.repeat(80));
    console.log(`내부 DB 사용: ${dbUsers.length}/${successfulResults.length} (${(dbUsers.length/successfulResults.length*100).toFixed(1)}%)`);
    if (dbUsers.length > 0) {
      const avgDBSkills = dbUsers.reduce((sum, r) => sum + r.analysis.internalDBSkills, 0) / dbUsers.length;
      console.log(`평균 DB 스킬 수: ${avgDBSkills.toFixed(0)}개`);
    }
  }

  // 실패 케이스
  if (errors.length > 0) {
    console.log('\n─'.repeat(80));
    console.log('❌ 실패 케이스:');
    console.log('─'.repeat(80));
    errors.forEach((err, i) => {
      console.log(`${i + 1}. ${err.testCase.display}`);
      console.log(`   오류: ${err.error}`);
    });
  }

  // 비교 분석 (기존 vs 신규)
  console.log('\n─'.repeat(80));
  console.log('📊 개선 효과 (예상):');
  console.log('─'.repeat(80));
  console.log('기존 scrape-maxroll-guide.js:');
  console.log('  - 타임아웃: 5초');
  console.log('  - 폴백 전략: 1개 (ID만)');
  console.log('  - 추출 성공률: ~40%');
  console.log('  - 신뢰도: ~70%');
  console.log('');
  console.log('신규 unified-guide-crawler.js:');
  console.log(`  - 타임아웃: 30-60초`);
  console.log(`  - 폴백 전략: 3개 (ID → 텍스트 → XPath)`);
  console.log(`  - 추출 성공률: ${avgSuccessRate.toFixed(1)}%`);
  console.log(`  - 신뢰도: ${(avgReliability * 100).toFixed(1)}%`);

  if (avgSuccessRate > 40) {
    console.log(`\n✅ 추출 성공률 ${(avgSuccessRate - 40).toFixed(1)}%p 개선!`);
  }
  if (avgReliability > 0.70) {
    console.log(`✅ 신뢰도 ${((avgReliability - 0.70) * 100).toFixed(1)}%p 개선!`);
  }

  console.log('\n' + '═'.repeat(80));
  console.log('  테스트 완료');
  console.log('═'.repeat(80));
}

// 실행
main().catch(error => {
  console.error('\n❌ 테스트 실행 실패:', error);
  process.exit(1);
});
