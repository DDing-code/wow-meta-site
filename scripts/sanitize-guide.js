#!/usr/bin/env node

/**
 * sanitize-guide.js
 * 가이드 자동 정제 CLI 도구
 *
 * 사용법:
 *   node scripts/sanitize-guide.js FrostDeathKnightGuide deathknight frost
 *   node scripts/sanitize-guide.js ArcaneMageGuide mage arcane --validate
 */

const fs = require('fs').promises;
const path = require('path');

// 동적 import를 위한 wrapper
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log('\n사용법:');
    console.log('  node scripts/sanitize-guide.js <GuideFileName> <className> <specName> [--validate] [--use-maxroll]');
    console.log('\n예시:');
    console.log('  node scripts/sanitize-guide.js FrostDeathKnightGuide deathknight frost');
    console.log('  node scripts/sanitize-guide.js ArcaneMageGuide mage arcane --validate');
    console.log('  node scripts/sanitize-guide.js FrostDeathKnightGuide deathknight frost --use-maxroll\n');
    console.log('플래그:');
    console.log('  --validate      검증만 수행 (정제 안 함)');
    console.log('  --use-maxroll   Maxroll 가이드 기반 교차 검증 (Ground Truth)\n');
    process.exit(1);
  }

  const [guideFileName, className, specName, ...flags] = args;
  const validateOnly = flags.includes('--validate');
  const useMaxroll = flags.includes('--use-maxroll');

  const guideFilePath = path.join(
    __dirname,
    '../src/components',
    `${guideFileName}.js`
  );

  console.log('\n' + '='.repeat(70));
  console.log('  WoW 가이드 자동 정제 시스템');
  console.log('='.repeat(70));
  console.log(`파일: ${guideFileName}.js`);
  console.log(`클래스/전문화: ${className}/${specName}`);
  console.log(`모드: ${validateOnly ? '검증만' : '정제 + 검증'}`);
  console.log(`Maxroll 검증: ${useMaxroll ? '✅ 활성화' : '❌ 비활성화'}`);
  console.log('='.repeat(70) + '\n');

  try {
    // 파일 읽기
    const content = await fs.readFile(guideFilePath, 'utf-8');
    console.log(`✅ 파일 로드 완료 (${content.split('\n').length}줄)`);

    // 메타데이터 로드 (동적 import)
    const { getSpecMetadata } = await import('../src/data/classMetadata.js');
    const specData = getSpecMetadata(className, specName);

    if (!specData) {
      console.error(`❌ 클래스/전문화 메타데이터를 찾을 수 없습니다: ${className}/${specName}`);
      process.exit(1);
    }

    console.log(`✅ 메타데이터 로드 완료`);
    console.log(`   - 영웅 특성: ${specData.heroTalents.map(ht => ht.korean).join(', ')}`);
    console.log(`   - 제거 대상 키워드: ${specData.wrongKeywords.length}개\n`);

    // 1. 검증
    const { validateGuideContent, formatValidationResult } = await import('../src/utils/GuideValidator.js');
    const validationResult = validateGuideContent(content, className, specName);

    console.log('📊 검증 결과:');
    console.log(formatValidationResult(validationResult));

    if (validateOnly) {
      if (validationResult.valid) {
        console.log('✅ 검증 통과! 정제 불필요.');
        process.exit(0);
      } else {
        console.log('❌ 검증 실패. --validate 플래그 제거 후 정제 실행 권장.');
        process.exit(1);
      }
    }

    // 2. 정제 (검증 실패 시에만)
    if (!validationResult.valid) {
      console.log('\n🔧 정제 시작...\n');

      const { sanitizeGuideTemplate, getSanitizationStats, formatSanitizationResult } = await import('../src/utils/GuideSanitizer.js');
      const result = sanitizeGuideTemplate(content, className, specName, { useMaxroll });

      const sanitized = result.content;
      const maxrollValidation = result.validation;

      // 통계
      const stats = getSanitizationStats(content, sanitized);
      console.log('\n' + formatSanitizationResult(stats));

      // Maxroll 검증 결과 출력
      if (maxrollValidation) {
        console.log('\n' + '─'.repeat(60));
        console.log('📊 Maxroll 교차 검증 결과:');
        console.log('─'.repeat(60));
        console.log(`치명적 오류: ${maxrollValidation.errors.length}개`);
        console.log(`경고: ${maxrollValidation.warnings.length}개`);
        console.log(`자동 수정 가능: ${maxrollValidation.autoFixable}개`);
        console.log('─'.repeat(60) + '\n');

        if (maxrollValidation.errors.length > 0) {
          console.log('❌ 발견된 오류:');
          maxrollValidation.errors.slice(0, 5).forEach((err, idx) => {
            console.log(`  ${idx + 1}. [${err.type}] ${err.message}`);
            if (err.found) console.log(`     발견: ${err.found}`);
            if (err.suggested) console.log(`     제안: ${err.suggested}`);
          });
          if (maxrollValidation.errors.length > 5) {
            console.log(`  ... 외 ${maxrollValidation.errors.length - 5}개\n`);
          }
        }

        if (maxrollValidation.warnings.length > 0) {
          console.log('\n⚠️  경고:');
          maxrollValidation.warnings.slice(0, 3).forEach((warn, idx) => {
            console.log(`  ${idx + 1}. [${warn.type}] ${warn.message}`);
          });
          if (maxrollValidation.warnings.length > 3) {
            console.log(`  ... 외 ${maxrollValidation.warnings.length - 3}개\n`);
          }
        }
      }

      // 백업
      const backupPath = guideFilePath.replace('.js', '.backup.js');
      await fs.writeFile(backupPath, content, 'utf-8');
      console.log(`💾 원본 백업: ${path.basename(backupPath)}`);

      // 정제된 파일 쓰기
      await fs.writeFile(guideFilePath, sanitized, 'utf-8');
      console.log(`✅ 정제 완료: ${guideFileName}.js`);

      // 재검증
      console.log('\n🔍 재검증 중...\n');
      const revalidationResult = validateGuideContent(sanitized, className, specName);
      console.log(formatValidationResult(revalidationResult));

      if (revalidationResult.valid) {
        console.log('✅ 모든 작업 완료!');
        process.exit(0);
      } else {
        console.log('⚠️  일부 문제가 남아있습니다. 수동 수정이 필요할 수 있습니다.');
        process.exit(0);
      }
    } else {
      console.log('✅ 이미 정제된 가이드입니다. 추가 작업 불필요.');
      process.exit(0);
    }

  } catch (error) {
    console.error(`\n❌ 오류 발생: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
