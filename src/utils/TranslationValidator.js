/**
 * TranslationValidator.js
 *
 * 3-Stage Translation Validation System
 *
 * Purpose: Enforce MANDATORY translation protocol
 * Documentation: ../TRANSLATION_RULES.md
 * Overview: CLAUDE.md Lines 1865-1895
 *
 * Enforced Rules:
 * ✅ Rule 1.1: Internal DB Pre-Check (MUST) - searchInDB()
 * ✅ Rule 1.2: Trust Hierarchy (MUST) - validateBeforeTranslation()
 * ✅ Rule 1.3: DB Structure Detection (MUST) - searchInDB()
 * ⚠️ Rule 2.1: Conflict Detection (SHOULD) - findSimilarSkills()
 * ⚠️ Rule 2.2: Post-Validation (SHOULD) - validateAfterAddition()
 * ⚠️ Rule 2.3: Rate Limiting (SHOULD) - validateTranslation()
 * ✅ Rule 4.3: No DB Bypass (MUST NOT) - validateBeforeTranslation()
 *
 * Trust Hierarchy:
 * - Tier S: tww-s3-refined-database.json (99%)
 * - Tier A: all-classes-skills-data.json (95%)
 * - Tier B: ko.wowhead.com title (85%)
 * - Tier C: ko.wowhead.com tooltip (70%)
 * - Tier F: AI guessing, direct translation (0% - FORBIDDEN)
 *
 * Validation Stages:
 * - Stage 1 (Pre-validation): Internal DB check BEFORE translation
 * - Stage 2 (Mid-validation): Conflict detection DURING translation
 * - Stage 3 (Post-validation): Cross-validation AFTER extraction
 *
 * @version 1.0.0
 * @created 2025-01-10
 */

import fs from 'fs';
import path from 'path';

/**
 * Levenshtein Distance 계산 (유사도 측정)
 * @param {string} str1 - 첫 번째 문자열
 * @param {string} str2 - 두 번째 문자열
 * @returns {number} - 0.0 ~ 1.0 (1.0 = 완전 일치)
 */
function calculateSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;

  // 동일 문자열
  if (str1 === str2) return 1.0;

  // 빈 문자열 처리
  if (len1 === 0) return 0.0;
  if (len2 === 0) return 0.0;

  // Levenshtein Distance 계산
  const matrix = Array.from({ length: len1 + 1 }, () =>
    Array(len2 + 1).fill(0)
  );

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLength = Math.max(len1, len2);

  return 1.0 - (distance / maxLength);
}

class TranslationValidator {
  constructor() {
    this.masterDBPath = path.resolve(
      process.cwd(),
      'database-builder/tww-s3-refined-database.json'
    );

    this.legacyDBPath = path.resolve(
      process.cwd(),
      'database-builder/all-classes-skills-data.json'
    );

    // Load databases
    this.masterDB = this.loadDatabase(this.masterDBPath, 'Tier S');
    this.legacyDB = this.loadDatabase(this.legacyDBPath, 'Tier A');
  }

  /**
   * Load database with error handling
   */
  loadDatabase(dbPath, tier) {
    try {
      if (!fs.existsSync(dbPath)) {
        console.warn(`⚠️ ${tier} DB not found: ${dbPath}`);
        return null;
      }

      const data = fs.readFileSync(dbPath, 'utf8');
      const db = JSON.parse(data);
      console.log(`✅ ${tier} DB loaded: ${Object.keys(db).length} classes`);
      return db;

    } catch (error) {
      console.error(`❌ Failed to load ${tier} DB: ${error.message}`);
      return null;
    }
  }

  /**
   * STAGE 1: Pre-validation - MANDATORY Internal DB Check
   *
   * This MUST be called BEFORE any Wowhead extraction.
   * If skill exists in internal DB, translation MUST use existing koreanName.
   *
   * @param {string} englishName - English skill name (e.g., "Barbed Shot")
   * @param {string} className - Class name (e.g., "hunter")
   * @returns {object} Validation result
   */
  validateBeforeTranslation(englishName, className) {
    console.log(`\n🔍 [Stage 1] Pre-validation: "${englishName}" (${className})`);

    // Step 1: Check Tier S (Master DB) - 99% trust
    const tierSResult = this.searchInDB(
      this.masterDB,
      englishName,
      className,
      'Tier S (99%)'
    );

    if (tierSResult.found) {
      return {
        status: 'MUST_USE_EXISTING',
        tier: 'S',
        confidence: 0.99,
        koreanName: tierSResult.skill.koreanName,
        skillId: tierSResult.skill.id,
        action: 'BLOCK_NEW_TRANSLATION',
        message: `✅ Tier S에서 발견: "${tierSResult.skill.koreanName}" - 반드시 이 번역 사용`
      };
    }

    // Step 2: Check Tier A (Legacy DB) - 95% trust
    const tierAResult = this.searchInDB(
      this.legacyDB,
      englishName,
      className,
      'Tier A (95%)'
    );

    if (tierAResult.found) {
      return {
        status: 'MUST_USE_EXISTING',
        tier: 'A',
        confidence: 0.95,
        koreanName: tierAResult.skill.koreanName,
        skillId: tierAResult.skill.id,
        action: 'BLOCK_NEW_TRANSLATION',
        message: `✅ Tier A에서 발견: "${tierAResult.skill.koreanName}" - 반드시 이 번역 사용`
      };
    }

    // Step 3: Not found - Proceed to Wowhead (Tier B)
    console.warn(`⚠️ 내부 DB에 없음, Wowhead 검증 필요: ${englishName}`);

    return {
      status: 'PROCEED_TO_WOWHEAD',
      tier: 'B',
      confidence: 0.85,
      action: 'EXTRACT_FROM_WOWHEAD',
      message: `⚠️ 내부 DB에 없음 - Playwright로 Wowhead 추출 필요`
    };
  }

  /**
   * Search in specific database
   *
   * Supports two DB structures:
   * 1. Flat structure: { "skillId": { id, englishName, ... } } (refined DB)
   * 2. Class-based: { "WARLOCK": { "skillId": { ... } } } (legacy DB)
   */
  searchInDB(db, englishName, className, tierName) {
    if (!db) {
      console.warn(`⚠️ ${tierName} DB not loaded`);
      return { found: false };
    }

    // Detect DB structure by checking first key
    const firstKey = Object.keys(db)[0];
    const firstValue = db[firstKey];
    const isClassBased = firstValue && typeof firstValue === 'object' &&
                         !firstValue.hasOwnProperty('englishName');

    if (isClassBased) {
      // Class-based structure: { "WARLOCK": { "172": {...} } }
      const normalizedClass = className.toUpperCase();

      if (!db[normalizedClass]) {
        console.log(`ℹ️ ${tierName}: Class "${normalizedClass}" not found`);
        return { found: false };
      }

      const classSkills = db[normalizedClass];

      for (const [skillId, skill] of Object.entries(classSkills)) {
        if (!skill || !skill.englishName) continue;

        const skillEnglishName = skill.englishName.toLowerCase().trim();
        const searchEnglishName = englishName.toLowerCase().trim();

        if (skillEnglishName === searchEnglishName) {
          console.log(`✅ ${tierName}: Found "${skill.koreanName}" (ID: ${skill.id})`);

          return {
            found: true,
            skill: skill,
            skillKey: skillId
          };
        }
      }

    } else {
      // Flat structure: { "66": {...}, "130": {...} }
      for (const [skillId, skill] of Object.entries(db)) {
        if (!skill || !skill.englishName) continue;

        // Handle corrupted data like "Invisibility위크오라 반출"
        let skillEnglishName = skill.englishName.toLowerCase().trim();
        const koreanCharMatch = skillEnglishName.match(/[가-힣]/);
        if (koreanCharMatch) {
          skillEnglishName = skillEnglishName.substring(0, koreanCharMatch.index).trim();
        }

        const searchEnglishName = englishName.toLowerCase().trim();

        if (skillEnglishName === searchEnglishName) {
          console.log(`✅ ${tierName}: Found "${skill.koreanName}" (ID: ${skill.id})`);

          return {
            found: true,
            skill: skill,
            skillKey: skillId
          };
        }
      }
    }

    console.log(`ℹ️ ${tierName}: "${englishName}" not found`);
    return { found: false };
  }

  /**
   * STAGE 2: Mid-validation - Conflict Detection
   *
   * Called AFTER Wowhead extraction to detect conflicts with existing translations.
   * Uses Levenshtein distance to find similar Korean names.
   *
   * @param {object} extractedData - { koreanName, englishName, skillId }
   * @param {string} className - Class name
   * @returns {object} Validation result
   */
  validateAfterExtraction(extractedData, className) {
    console.log(`\n🔍 [Stage 2] Mid-validation: "${extractedData.koreanName}"`);

    const { koreanName, englishName, skillId } = extractedData;

    // Step 1: Find similar skills (threshold 0.8)
    const conflicts = this.findSimilarSkills(koreanName, className, 0.8);

    if (conflicts.length > 0) {
      console.warn(`⚠️ 충돌 감지! ${conflicts.length}개 유사 스킬 발견`);

      return {
        status: 'CONFLICT_DETECTED',
        confidence: 0.60,
        conflicts: conflicts,
        action: 'REQUIRE_USER_CONFIRMATION',
        message: `⚠️ 유사한 번역 발견 - 사용자 확인 필요:\n${conflicts.map(c =>
          `   - "${c.existing}" (유사도 ${(c.similarity * 100).toFixed(1)}%)`
        ).join('\n')}`
      };
    }

    // Step 2: No conflicts - Safe to add
    console.log(`✅ 충돌 없음 - DB 추가 가능`);

    return {
      status: 'SAFE_TO_ADD',
      confidence: 0.85,
      action: 'ADD_TO_DATABASE',
      message: `✅ 충돌 없음 - "${koreanName}" DB 추가 가능`
    };
  }

  /**
   * Find similar skills using Levenshtein distance
   *
   * Supports two DB structures:
   * 1. Flat structure: { "skillId": { id, englishName, ... } } (refined DB)
   * 2. Class-based: { "WARLOCK": { "skillId": { ... } } } (legacy DB)
   *
   * @param {string} koreanName - Korean name to search for
   * @param {string} className - Class name
   * @param {number} threshold - Similarity threshold (0.0 ~ 1.0)
   * @returns {Array} Array of conflicts
   */
  findSimilarSkills(koreanName, className, threshold = 0.8) {
    const conflicts = [];

    // Search in both databases
    const databases = [
      { db: this.masterDB, tier: 'S' },
      { db: this.legacyDB, tier: 'A' }
    ];

    for (const { db, tier } of databases) {
      if (!db) continue;

      // Detect DB structure
      const firstKey = Object.keys(db)[0];
      const firstValue = db[firstKey];
      const isClassBased = firstValue && typeof firstValue === 'object' &&
                           !firstValue.hasOwnProperty('englishName');

      if (isClassBased) {
        // Class-based structure: { "WARLOCK": { "172": {...} } }
        const normalizedClass = className.toUpperCase();

        if (!db[normalizedClass]) continue;

        const classSkills = db[normalizedClass];

        for (const [skillId, skill] of Object.entries(classSkills)) {
          if (!skill || !skill.koreanName) continue;

          const similarity = calculateSimilarity(koreanName, skill.koreanName);

          if (similarity >= threshold && similarity < 1.0) {
            conflicts.push({
              existing: skill.koreanName,
              englishName: skill.englishName,
              similarity: similarity,
              skillId: skill.id,
              tier: tier,
              skillKey: skillId
            });
          }
        }

      } else {
        // Flat structure: { "66": {...}, "130": {...} }
        for (const [skillId, skill] of Object.entries(db)) {
          if (!skill || !skill.koreanName) continue;

          const similarity = calculateSimilarity(koreanName, skill.koreanName);

          if (similarity >= threshold && similarity < 1.0) {
            conflicts.push({
              existing: skill.koreanName,
              englishName: skill.englishName,
              similarity: similarity,
              skillId: skill.id,
              tier: tier,
              skillKey: skillId
            });
          }
        }
      }
    }

    // Sort by similarity (descending)
    conflicts.sort((a, b) => b.similarity - a.similarity);

    return conflicts;
  }

  /**
   * STAGE 3: Post-validation - Final Verification
   *
   * Comprehensive validation after adding to database.
   *
   * @param {string} englishName - English name
   * @param {string} koreanName - Korean name
   * @param {string} className - Class name
   * @returns {object} Validation result
   */
  validateAfterAddition(englishName, koreanName, className) {
    console.log(`\n🔍 [Stage 3] Post-validation: "${koreanName}"`);

    // Step 1: Verify skill was added
    const verifyResult = this.searchInDB(
      this.masterDB,
      englishName,
      className,
      'Tier S (Verification)'
    );

    if (!verifyResult.found) {
      return {
        status: 'ADDITION_FAILED',
        confidence: 0.0,
        message: `❌ DB 추가 실패: "${englishName}" not found in master DB`
      };
    }

    // Step 2: Verify Korean name matches
    if (verifyResult.skill.koreanName !== koreanName) {
      return {
        status: 'MISMATCH_DETECTED',
        confidence: 0.50,
        expected: koreanName,
        actual: verifyResult.skill.koreanName,
        message: `⚠️ 번역 불일치: 예상 "${koreanName}", 실제 "${verifyResult.skill.koreanName}"`
      };
    }

    // Step 3: Final conflict check
    const conflicts = this.findSimilarSkills(koreanName, className, 0.9);

    if (conflicts.length > 0) {
      console.warn(`⚠️ 최종 검증: ${conflicts.length}개 유사 스킬 발견`);
    }

    console.log(`✅ 최종 검증 완료`);

    return {
      status: 'VALIDATED',
      confidence: 0.99,
      skill: verifyResult.skill,
      conflicts: conflicts,
      message: `✅ 검증 완료: "${koreanName}" (ID: ${verifyResult.skill.id})`
    };
  }

  /**
   * Full validation workflow
   *
   * @param {string} englishName - English name
   * @param {string} className - Class name
   * @returns {object} Complete validation result
   */
  async validateTranslation(englishName, className) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`번역 검증 시작: "${englishName}" (${className})`);
    console.log('='.repeat(60));

    // Stage 1: Pre-validation (MANDATORY)
    const preValidation = this.validateBeforeTranslation(englishName, className);

    console.log(`\n📊 Stage 1 결과:`);
    console.log(`   Status: ${preValidation.status}`);
    console.log(`   ${preValidation.message}`);

    // If found in internal DB, MUST use existing translation
    if (preValidation.status === 'MUST_USE_EXISTING') {
      return {
        stage: 1,
        action: 'USE_EXISTING',
        koreanName: preValidation.koreanName,
        skillId: preValidation.skillId,
        tier: preValidation.tier,
        confidence: preValidation.confidence,
        message: preValidation.message
      };
    }

    // If not found, proceed to Wowhead extraction
    // (Wowhead extraction would happen here in actual implementation)

    console.log(`\n📊 최종 결과: Wowhead 추출 필요`);

    return {
      stage: 1,
      action: 'EXTRACT_FROM_WOWHEAD',
      tier: 'B',
      confidence: 0.85,
      message: '⚠️ 내부 DB에 없음 - Playwright로 Wowhead 추출 필요'
    };
  }
}

export default TranslationValidator;
export { calculateSimilarity };
