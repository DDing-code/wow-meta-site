/**
 * GuideSanitizer.js
 * 가이드 템플릿 자동 정제 시스템
 *
 * 기능:
 * - 다른 클래스 키워드 자동 제거
 * - 리소스 관련 내용 제거 (예: 마나 → 죽음의 기사)
 * - 잘못된 영웅 특성 제거
 * - 불필요한 메커니즘 섹션 제거
 */

import { getSpecMetadata, getResourceType } from '../data/classMetadata.js';
import { validateWithMaxroll } from './MaxrollValidator.js';

/**
 * 가이드 템플릿 전체 정제
 * @param {string} content - 원본 가이드 내용
 * @param {string} className - 대상 클래스명
 * @param {string} specName - 대상 전문화명
 * @param {object} options - 옵션 { useMaxroll: boolean }
 * @returns {object} { content: string, validation: object }
 */
export const sanitizeGuideTemplate = async (content, className, specName, options = {}) => {
  let cleaned = content;
  const specData = getSpecMetadata(className, specName);

  if (!specData) {
    console.error(`클래스/전문화 메타데이터를 찾을 수 없습니다: ${className}/${specName}`);
    return content;
  }

  console.log(`\n정제 시작: ${className}/${specName}`);
  console.log('=' .repeat(60));

  // 1. 잘못된 클래스 키워드 제거
  cleaned = removeWrongKeywords(cleaned, specData);

  // 2. 리소스 관련 내용 제거
  cleaned = removeResourceContent(cleaned, className);

  // 3. 잘못된 영웅 특성 제거 및 교체
  cleaned = replaceHeroTalents(cleaned, specData);

  // 4. 주석 정제
  cleaned = sanitizeComments(cleaned, specData);

  // 5. 메커니즘 섹션 정제
  cleaned = sanitizeMechanismSection(cleaned, specData);

  // 6. 문자열 내용 교체 (리소스명, 클래스명, 피해 타입)
  cleaned = replaceStringContent(cleaned, specData);

  // 7. Maxroll 기반 교차 검증 (옵션) - 스킬 자동 검색 지원
  let validation = null;
  if (options.useMaxroll) {
    console.log('\n' + '─'.repeat(60));
    console.log('🔍 Maxroll 기반 교차 검증 시작 (스킬 자동 검색 활성화)');
    console.log('─'.repeat(60));

    validation = await validateWithMaxroll(cleaned, className, specName);

    if (validation.success && validation.autoFixable > 0) {
      console.log(`\n✅ 자동 수정 가능한 오류 ${validation.autoFixable}개 발견`);
      cleaned = applyMaxrollFixes(cleaned, validation.errors);
    }
  }

  console.log('=' .repeat(60));
  console.log('정제 완료\n');

  return {
    content: cleaned,
    validation
  };
};

/**
 * 1. 잘못된 클래스 키워드 제거
 */
const removeWrongKeywords = (content, specData) => {
  let cleaned = content;
  let removeCount = 0;

  const lines = content.split('\n');
  const newLines = [];

  lines.forEach((line, index) => {
    let shouldRemove = false;

    // 잘못된 키워드가 포함된 줄 제거
    specData.wrongKeywords.forEach(keyword => {
      if (line.includes(keyword)) {
        shouldRemove = true;
        removeCount++;
      }
    });

    if (!shouldRemove) {
      newLines.push(line);
    }
  });

  cleaned = newLines.join('\n');

  if (removeCount > 0) {
    console.log(`✅ 잘못된 키워드 포함 줄 ${removeCount}개 제거`);
  }

  return cleaned;
};

/**
 * 2. 리소스 관련 내용 제거
 */
const removeResourceContent = (content, className) => {
  let cleaned = content;
  const resourceType = getResourceType(className);

  // 마나를 사용하지 않는 클래스일 경우
  if (resourceType !== 'mana' && resourceType !== 'mana_holy') {
    const manaPatterns = [
      /마나\s*\d+%[^.]*\./g,  // "마나 30% 이하..."
      /마나\s*(회복|소모|고갈|관리|부족)[^.]*\./g,  // "마나 회복...", "마나 소모..."
      /환기[^.]*마나[^.]*\./g,  // "환기로 마나 회복..."
      /\/\/.*마나.*\n/g,  // 마나 관련 주석
    ];

    let removeCount = 0;
    manaPatterns.forEach(pattern => {
      const matches = cleaned.match(pattern);
      if (matches) {
        removeCount += matches.length;
        cleaned = cleaned.replace(pattern, '');
      }
    });

    if (removeCount > 0) {
      console.log(`✅ 마나 관련 내용 ${removeCount}개 제거`);
    }
  }

  return cleaned;
};

/**
 * 3. 잘못된 영웅 특성 제거 및 교체
 */
const replaceHeroTalents = (content, specData) => {
  let cleaned = content;

  // getHeroContent 함수 내부의 영웅 특성 구조 추출
  const heroContentPattern = /const getHeroContent = \(SkillIcon\) => \(\{([\s\S]*?)\}\);/;
  const match = content.match(heroContentPattern);

  if (!match) {
    console.log('⚠️  getHeroContent 함수를 찾을 수 없습니다');
    return cleaned;
  }

  const heroContentBody = match[1];
  const validHeroKeys = specData.heroTalents.map(ht => ht.key);

  // 현재 영웅 특성 키 추출
  const heroKeyPattern = /(\w+):\s*\{[\s\S]*?name:\s*['"`]([^'"`]+)['"`]/g;
  const foundKeys = [];
  let heroMatch;

  while ((heroMatch = heroKeyPattern.exec(heroContentBody)) !== null) {
    foundKeys.push(heroMatch[1]);
  }

  // 잘못된 영웅 특성 제거
  let replaceCount = 0;
  foundKeys.forEach(key => {
    if (!validHeroKeys.includes(key)) {
      // 해당 영웅 특성 전체 블록 제거
      const blockPattern = new RegExp(`${key}:\\s*\\{[\\s\\S]*?\\},?`, 'g');
      cleaned = cleaned.replace(blockPattern, '');
      replaceCount++;
      console.log(`✅ 잘못된 영웅 특성 제거: "${key}"`);
    }
  });

  // 올바른 영웅 특성이 부족할 경우 TODO 삽입
  if (foundKeys.length < specData.heroTalents.length) {
    const missingTalents = specData.heroTalents.filter(ht => !foundKeys.includes(ht.key));
    console.log(`⚠️  누락된 영웅 특성: ${missingTalents.map(ht => ht.korean).join(', ')}`);

    // TODO 주석 삽입
    missingTalents.forEach(talent => {
      const todoComment = `  // ⚠️ TODO: ${talent.korean} (${talent.key}) 영웅 특성 추가 필요\n`;
      cleaned = cleaned.replace(
        'const getHeroContent = (SkillIcon) => ({',
        `const getHeroContent = (SkillIcon) => ({\n${todoComment}`
      );
    });
  }

  return cleaned;
};

/**
 * 4. 주석 정제
 */
const sanitizeComments = (content, specData) => {
  let cleaned = content;
  let sanitizeCount = 0;

  const lines = content.split('\n');
  const newLines = [];

  lines.forEach(line => {
    let sanitized = line;

    // 주석에서 잘못된 키워드 제거
    if (line.includes('//')) {
      specData.wrongKeywords.forEach(wrongKeyword => {
        if (line.includes(wrongKeyword)) {
          sanitized = line.replace(new RegExp(`//.*${wrongKeyword}.*`, 'g'), '// ⚠️ TODO: 주석 수정 필요');
          sanitizeCount++;
        }
      });
    }

    newLines.push(sanitized);
  });

  cleaned = newLines.join('\n');

  if (sanitizeCount > 0) {
    console.log(`✅ 주석 ${sanitizeCount}개 정제`);
  }

  return cleaned;
};

/**
 * 5. 메커니즘 섹션 정제
 */
const sanitizeMechanismSection = (content, specData) => {
  let cleaned = content;

  // mechanisms 배열 찾기
  const mechanismPattern = /const mechanisms = \[([\s\S]*?)\];/;
  const match = content.match(mechanismPattern);

  if (!match) {
    return cleaned;
  }

  const mechanismBody = match[1];
  let sanitizeCount = 0;

  // 잘못된 키워드가 포함된 메커니즘 항목 제거
  const mechanismItems = mechanismBody.split(/\},\s*\{/);
  const validItems = mechanismItems.filter(item => {
    const hasWrongKeyword = specData.wrongKeywords.some(keyword => item.includes(keyword));
    if (hasWrongKeyword) {
      sanitizeCount++;
    }
    return !hasWrongKeyword;
  });

  if (sanitizeCount > 0) {
    console.log(`✅ 메커니즘 섹션 ${sanitizeCount}개 항목 제거`);

    // 재구성
    const sanitizedMechanism = validItems.join('},\n    {');
    cleaned = content.replace(
      mechanismPattern,
      `const mechanisms = [${sanitizedMechanism}];`
    );
  }

  return cleaned;
};

/**
 * 정제 통계 생성
 */
export const getSanitizationStats = (originalContent, sanitizedContent) => {
  const originalLines = originalContent.split('\n').length;
  const sanitizedLines = sanitizedContent.split('\n').length;
  const removedLines = originalLines - sanitizedLines;
  const reductionPercent = ((removedLines / originalLines) * 100).toFixed(1);

  return {
    originalLines,
    sanitizedLines,
    removedLines,
    reductionPercent
  };
};

/**
 * 정제 결과 포맷팅
 */
export const formatSanitizationResult = (stats) => {
  let output = '\n';
  output += '='.repeat(60) + '\n';
  output += '  가이드 정제 통계\n';
  output += '='.repeat(60) + '\n';
  output += `원본 줄 수:     ${stats.originalLines}\n`;
  output += `정제 후 줄 수:  ${stats.sanitizedLines}\n`;
  output += `제거된 줄 수:   ${stats.removedLines}\n`;
  output += `감소율:         ${stats.reductionPercent}%\n`;
  output += '='.repeat(60) + '\n';

  return output;
};

/**
 * 파일 정제 (Node.js 환경용)
 */
export const sanitizeGuideFile = async (inputPath, outputPath, className, specName) => {
  try {
    const fs = require('fs').promises;

    // 원본 파일 읽기
    const originalContent = await fs.readFile(inputPath, 'utf-8');

    // 정제
    const sanitizedContent = sanitizeGuideTemplate(originalContent, className, specName);

    // 정제된 파일 쓰기
    await fs.writeFile(outputPath, sanitizedContent, 'utf-8');

    // 통계
    const stats = getSanitizationStats(originalContent, sanitizedContent);
    console.log(formatSanitizationResult(stats));

    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error(`파일 정제 실패: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * 6. 문자열 내용 교체 (리소스명, 클래스명, 피해 타입)
 */
const replaceStringContent = (content, specData) => {
  let cleaned = content;
  let replaceCount = 0;

  // replacementMap이 없으면 스킵
  if (!specData.replacementMap) {
    return cleaned;
  }

  // 교체 맵 순회
  Object.entries(specData.replacementMap).forEach(([oldTerm, newTerm]) => {
    // 정규식으로 전체 교체 (대소문자 구분)
    const regex = new RegExp(escapeRegExp(oldTerm), 'g');
    const matches = cleaned.match(regex);

    if (matches && matches.length > 0) {
      cleaned = cleaned.replace(regex, newTerm);
      replaceCount += matches.length;
      console.log(`✅ "${oldTerm}" → "${newTerm}" (${matches.length}개 교체)`);
    }
  });

  if (replaceCount > 0) {
    console.log(`✅ 문자열 내용 총 ${replaceCount}개 교체`);
  }

  return cleaned;
};

/**
 * 정규식 특수 문자 이스케이프
 */
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * 7. Maxroll 검증 결과 자동 수정
 */
const applyMaxrollFixes = (content, errors) => {
  let fixed = content;
  let fixCount = 0;

  errors.forEach(error => {
    if (!error.autoFix || !error.fix) return;

    const { oldValue, newValue } = error.fix;

    // 정규식으로 전역 교체
    const regex = new RegExp(escapeRegExp(oldValue), 'g');
    const matches = fixed.match(regex);

    if (matches && matches.length > 0) {
      fixed = fixed.replace(regex, newValue);
      fixCount += matches.length;
      console.log(`✅ Maxroll 기반 수정: "${oldValue}" → "${newValue}" (${matches.length}개)`);
    }
  });

  if (fixCount > 0) {
    console.log(`✅ Maxroll 기반 자동 수정 총 ${fixCount}개 완료`);
  }

  return fixed;
};