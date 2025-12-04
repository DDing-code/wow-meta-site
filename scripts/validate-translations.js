/**
 * validate-translations.js
 *
 * Build-time Translation Validation System
 *
 * Purpose: Scan all guide files and validate skill translations
 * - Extract skill references from guide files
 * - Validate against TranslationValidator
 * - Generate error report
 * - Fail build if critical errors found
 *
 * Usage:
 *   node scripts/validate-translations.js
 *   node scripts/validate-translations.js --strict  (fail on warnings)
 *   node scripts/validate-translations.js --fix     (auto-fix issues)
 *
 * @version 1.0.0
 * @created 2025-01-10
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TranslationValidator from '../src/utils/TranslationValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI arguments
const args = process.argv.slice(2);
const STRICT_MODE = args.includes('--strict');
const AUTO_FIX = args.includes('--fix');
const VERBOSE = args.includes('--verbose');

// Paths
const GUIDES_DIR = path.resolve(__dirname, '../src/components');
const KB_DIR = path.resolve(__dirname, '../src/knowledge-base');

/**
 * Extract skill references from guide file
 * @param {string} filePath - Path to guide file
 * @returns {Array} Skill references
 */
function extractSkillReferences(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const references = [];

  // Pattern 1: skillData.xxxxx
  const skillDataPattern = /skillData\.(\w+)/g;
  let match;

  while ((match = skillDataPattern.exec(content)) !== null) {
    const skillKey = match[1];
    const line = content.substring(0, match.index).split('\n').length;

    references.push({
      skillKey,
      pattern: 'skillData',
      line,
      fileName
    });
  }

  // Pattern 2: import { xxx as skillData } from '../data/xxxSkillData'
  const importPattern = /import\s+\{[^}]*\}\s+from\s+['"]\.\.\/data\/(\w+)SkillData['"]/g;
  let importMatch;

  while ((importMatch = importPattern.exec(content)) !== null) {
    const dataFileName = importMatch[1];
    references.push({
      dataFileName,
      pattern: 'import',
      line: content.substring(0, importMatch.index).split('\n').length,
      fileName
    });
  }

  return references;
}

/**
 * Extract className and specName from guide file name
 * @param {string} fileName - Guide file name (e.g., "FrostDeathKnightGuide.js")
 * @returns {object} { className, specName }
 */
function extractClassAndSpec(fileName) {
  // Pattern: {Spec}{Class}Guide.js
  // Examples: FrostDeathKnightGuide.js, ArcaneMageGuide.js

  const match = fileName.match(/^([A-Z][a-z]+)([A-Z][a-z]+(?:[A-Z][a-z]+)?)Guide\.js$/);

  if (!match) {
    console.warn(`⚠️ Cannot parse file name: ${fileName}`);
    return { className: 'unknown', specName: 'unknown' };
  }

  const specName = match[1].toLowerCase(); // "frost", "arcane"
  let className = match[2].toLowerCase();  // "deathknight", "mage"

  // Handle multi-word class names
  className = className
    .replace(/deathknight/i, 'deathknight')
    .replace(/demonhunter/i, 'demonhunter');

  return { className, specName };
}

/**
 * Scan all guide files
 * @returns {Array} Guide files with metadata
 */
function scanGuideFiles() {
  const guideFiles = [];

  // Scan src/components/*Guide.js
  const componentFiles = fs.readdirSync(GUIDES_DIR);

  for (const file of componentFiles) {
    if (file.endsWith('Guide.js')) {
      const filePath = path.join(GUIDES_DIR, file);
      const { className, specName } = extractClassAndSpec(file);
      const references = extractSkillReferences(filePath);

      guideFiles.push({
        fileName: file,
        filePath,
        className,
        specName,
        references,
        totalRefs: references.filter(r => r.pattern === 'skillData').length
      });
    }
  }

  return guideFiles;
}

/**
 * Scan KB mechanism files
 * @returns {Array} KB files with metadata
 */
function scanKBFiles() {
  const kbFiles = [];

  try {
    const classNames = fs.readdirSync(KB_DIR);

    for (const className of classNames) {
      const classPath = path.join(KB_DIR, className);
      if (!fs.statSync(classPath).isDirectory()) continue;

      const specNames = fs.readdirSync(classPath);

      for (const specName of specNames) {
        const specPath = path.join(classPath, specName);
        if (!fs.statSync(specPath).isDirectory()) continue;

        const mechanismPath = path.join(specPath, 'mechanisms');
        if (!fs.existsSync(mechanismPath)) continue;

        const mechanismFiles = fs.readdirSync(mechanismPath);

        for (const mechFile of mechanismFiles) {
          if (mechFile.endsWith('.js')) {
            const filePath = path.join(mechanismPath, mechFile);
            const references = extractSkillReferences(filePath);

            kbFiles.push({
              fileName: mechFile,
              filePath,
              className,
              specName,
              references,
              totalRefs: references.filter(r => r.pattern === 'skillData').length
            });
          }
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️ KB directory not found or empty: ${KB_DIR}`);
  }

  return kbFiles;
}

/**
 * Validate all guide files
 * @param {Array} guideFiles - Guide files to validate
 * @returns {object} Validation report
 */
async function validateGuides(guideFiles) {
  const validator = new TranslationValidator();
  const report = {
    totalFiles: guideFiles.length,
    totalReferences: 0,
    validated: 0,
    errors: [],
    warnings: [],
    passed: []
  };

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  번역 검증 시작 (${guideFiles.length}개 파일)`);
  console.log('='.repeat(60));

  for (const guide of guideFiles) {
    console.log(`\n📄 검증 중: ${guide.fileName}`);
    console.log(`   클래스: ${guide.className}/${guide.specName}`);
    console.log(`   참조 수: ${guide.totalRefs}개`);

    report.totalReferences += guide.totalRefs;

    // Extract unique skill keys
    const uniqueSkills = [...new Set(
      guide.references
        .filter(r => r.pattern === 'skillData')
        .map(r => r.skillKey)
    )];

    for (const skillKey of uniqueSkills) {
      // Convert camelCase to English name for validation
      // e.g., "obliterate" → "Obliterate"
      const englishName = skillKey.charAt(0).toUpperCase() + skillKey.slice(1);

      // Stage 1: Pre-validation
      const preValidation = validator.validateBeforeTranslation(
        englishName,
        guide.className
      );

      if (preValidation.status === 'MUST_USE_EXISTING') {
        report.validated++;
        report.passed.push({
          file: guide.fileName,
          skillKey,
          koreanName: preValidation.koreanName,
          tier: preValidation.tier,
          confidence: preValidation.confidence
        });

        if (VERBOSE) {
          console.log(`   ✅ ${skillKey}: ${preValidation.koreanName} (Tier ${preValidation.tier})`);
        }

      } else if (preValidation.status === 'PROCEED_TO_WOWHEAD') {
        // Skill not found in internal DB - this is a warning
        report.warnings.push({
          file: guide.fileName,
          line: guide.references.find(r => r.skillKey === skillKey)?.line,
          skillKey,
          issue: 'SKILL_NOT_IN_DB',
          message: `스킬 "${skillKey}"가 내부 DB에 없음 - Wowhead 검증 필요`,
          severity: 'WARNING'
        });

        console.warn(`   ⚠️ ${skillKey}: 내부 DB에 없음`);
      }
    }
  }

  return report;
}

/**
 * Generate validation report
 * @param {object} report - Validation report
 */
function generateReport(report) {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  번역 검증 결과');
  console.log('='.repeat(60));

  console.log(`\n📊 통계:`);
  console.log(`   총 파일: ${report.totalFiles}개`);
  console.log(`   총 스킬 참조: ${report.totalReferences}개`);
  console.log(`   검증 완료: ${report.validated}개`);
  console.log(`   오류: ${report.errors.length}개`);
  console.log(`   경고: ${report.warnings.length}개`);

  // Errors
  if (report.errors.length > 0) {
    console.log(`\n❌ 오류 (${report.errors.length}개):`);
    console.log('-'.repeat(60));

    for (const error of report.errors) {
      console.log(`\n파일: ${error.file}:${error.line}`);
      console.log(`스킬: ${error.skillKey}`);
      console.log(`문제: ${error.issue}`);
      console.log(`내용: ${error.message}`);
    }
  }

  // Warnings
  if (report.warnings.length > 0) {
    console.log(`\n⚠️  경고 (${report.warnings.length}개):`);
    console.log('-'.repeat(60));

    for (const warning of report.warnings) {
      console.log(`\n파일: ${warning.file}:${warning.line}`);
      console.log(`스킬: ${warning.skillKey}`);
      console.log(`문제: ${warning.issue}`);
      console.log(`내용: ${warning.message}`);
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);

  if (report.errors.length === 0 && report.warnings.length === 0) {
    console.log('✅ 모든 번역 검증 통과!');
    console.log('='.repeat(60));
    return true;

  } else if (report.errors.length === 0 && report.warnings.length > 0) {
    console.log(`⚠️  경고 있음 (${report.warnings.length}개)`);

    if (STRICT_MODE) {
      console.log('❌ Strict 모드: 경고가 있어 빌드 실패');
      console.log('='.repeat(60));
      return false;
    } else {
      console.log('✅ 오류 없음 - 빌드 계속 진행');
      console.log('='.repeat(60));
      return true;
    }

  } else {
    console.log(`❌ 오류 발견 (${report.errors.length}개) - 빌드 실패`);
    console.log('='.repeat(60));
    return false;
  }
}

/**
 * Save report to JSON file
 * @param {object} report - Validation report
 */
function saveReportToFile(report) {
  const reportPath = path.resolve(__dirname, '../translation-validation-report.json');

  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: report.totalFiles,
      totalReferences: report.totalReferences,
      validated: report.validated,
      errors: report.errors.length,
      warnings: report.warnings.length
    },
    errors: report.errors,
    warnings: report.warnings,
    passed: report.passed.slice(0, 10) // Top 10 examples
  };

  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2), 'utf-8');
  console.log(`\n📝 상세 리포트 저장: ${reportPath}`);
}

/**
 * Main function
 */
async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  WoW 가이드 번역 검증 시스템');
  console.log('='.repeat(60));
  console.log(`\n모드:`);
  console.log(`  - Strict 모드: ${STRICT_MODE ? '활성화 (경고 시 빌드 실패)' : '비활성화'}`);
  console.log(`  - Auto-fix: ${AUTO_FIX ? '활성화' : '비활성화'}`);
  console.log(`  - Verbose: ${VERBOSE ? '활성화' : '비활성화'}`);

  try {
    // Step 1: Scan guide files
    console.log(`\n🔍 가이드 파일 스캔 중...`);
    const guideFiles = scanGuideFiles();
    console.log(`✅ ${guideFiles.length}개 가이드 파일 발견`);

    // Step 2: Scan KB files
    console.log(`\n🔍 KB 파일 스캔 중...`);
    const kbFiles = scanKBFiles();
    console.log(`✅ ${kbFiles.length}개 KB 파일 발견`);

    // Step 3: Validate all files
    const allFiles = [...guideFiles, ...kbFiles];
    const report = await validateGuides(allFiles);

    // Step 4: Generate report
    const success = generateReport(report);

    // Step 5: Save report to file
    saveReportToFile(report);

    // Step 6: Exit with appropriate code
    if (success) {
      console.log(`\n✅ 검증 성공 - 빌드 계속 진행\n`);
      process.exit(0);
    } else {
      console.log(`\n❌ 검증 실패 - 빌드 중단\n`);
      process.exit(1);
    }

  } catch (error) {
    console.error(`\n❌ 검증 실패: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run
main();
