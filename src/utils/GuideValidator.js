/**
 * GuideValidator.js
 * 가이드 콘텐츠 검증 시스템
 *
 * 기능:
 * - 잘못된 클래스 키워드 검출
 * - 리소스 타입 불일치 검출
 * - 영웅 특성 검증
 * - 스킬 매핑 검증
 */

import { getSpecMetadata, isWrongKeyword, getResourceType } from '../data/classMetadata.js';

/**
 * 가이드 파일 전체 검증
 * @param {string} content - 가이드 파일 내용
 * @param {string} className - 클래스명 (예: 'deathknight')
 * @param {string} specName - 전문화명 (예: 'frost')
 * @returns {Object} { valid: boolean, issues: Array, warnings: Array }
 */
export const validateGuideContent = (content, className, specName) => {
  const issues = [];  // 치명적 오류
  const warnings = [];  // 경고

  const specData = getSpecMetadata(className, specName);
  if (!specData) {
    issues.push({
      type: 'METADATA_NOT_FOUND',
      message: `클래스/전문화 메타데이터를 찾을 수 없습니다: ${className}/${specName}`
    });
    return { valid: false, issues, warnings };
  }

  // 1. 잘못된 클래스 키워드 검출
  const wrongKeywordIssues = detectWrongKeywords(content, specData);
  issues.push(...wrongKeywordIssues);

  // 2. 리소스 타입 불일치 검출
  const resourceIssues = detectResourceMismatch(content, className);
  issues.push(...resourceIssues);

  // 3. 영웅 특성 검증
  const heroTalentIssues = validateHeroTalents(content, specData);
  issues.push(...heroTalentIssues);

  // 4. 스킬 매핑 검증 (경고만)
  const skillMappingWarnings = validateSkillMapping(content, specData);
  warnings.push(...skillMappingWarnings);

  // 5. 중복 스킬 설명 검출 (경고만)
  const duplicateWarnings = detectDuplicateSkillDescriptions(content);
  warnings.push(...duplicateWarnings);

  return {
    valid: issues.length === 0,
    issues,
    warnings
  };
};

/**
 * 1. 잘못된 클래스 키워드 검출
 */
const detectWrongKeywords = (content, specData) => {
  const issues = [];
  const lines = content.split('\n');

  specData.wrongKeywords.forEach(keyword => {
    lines.forEach((line, index) => {
      if (line.includes(keyword)) {
        issues.push({
          type: 'WRONG_KEYWORD',
          line: index + 1,
          keyword,
          message: `잘못된 키워드 발견: "${keyword}" (다른 클래스 용어)`,
          snippet: line.trim()
        });
      }
    });
  });

  return issues;
};

/**
 * 2. 리소스 타입 불일치 검출
 */
const detectResourceMismatch = (content, className) => {
  const issues = [];
  const resourceType = getResourceType(className);

  // 마나를 사용하지 않는 클래스인데 마나 관련 내용이 있을 경우
  if (resourceType !== 'mana' && resourceType !== 'mana_holy') {
    const manaKeywords = [
      '마나 30%',
      '마나 70%',
      '마나 회복',
      '마나 소모',
      '마나 고갈',
      '마나 관리',
      '마나 부족'
    ];

    const lines = content.split('\n');
    manaKeywords.forEach(keyword => {
      lines.forEach((line, index) => {
        if (line.includes(keyword)) {
          issues.push({
            type: 'RESOURCE_MISMATCH',
            line: index + 1,
            keyword,
            message: `리소스 불일치: "${keyword}" (${className}는 마나를 사용하지 않음)`,
            snippet: line.trim()
          });
        }
      });
    });
  }

  return issues;
};

/**
 * 3. 영웅 특성 검증
 */
const validateHeroTalents = (content, specData) => {
  const issues = [];

  // getHeroContent 함수에서 영웅 특성 키 추출
  const heroTalentPattern = /(\w+):\s*{[\s\S]*?name:\s*['"`]([^'"`]+)['"`]/g;
  let match;

  const validHeroKeys = specData.heroTalents.map(ht => ht.key);
  const foundKeys = [];

  while ((match = heroTalentPattern.exec(content)) !== null) {
    const [, key, name] = match;
    foundKeys.push({ key, name });

    if (!validHeroKeys.includes(key)) {
      issues.push({
        type: 'INVALID_HERO_TALENT',
        key,
        name,
        message: `잘못된 영웅 특성: "${key}" (유효한 특성: ${validHeroKeys.join(', ')})`,
        validOptions: validHeroKeys
      });
    }
  }

  // 영웅 특성이 부족할 경우 경고
  if (foundKeys.length < specData.heroTalents.length) {
    issues.push({
      type: 'MISSING_HERO_TALENTS',
      message: `영웅 특성 ${specData.heroTalents.length}개 중 ${foundKeys.length}개만 발견`,
      expected: specData.heroTalents.map(ht => ht.key),
      found: foundKeys.map(f => f.key)
    });
  }

  return issues;
};

/**
 * 4. 스킬 매핑 검증 (경고만)
 */
const validateSkillMapping = (content, specData) => {
  const warnings = [];

  // 스킬 주석에서 다른 클래스 스킬명 검출
  const commentPattern = /\/\/\s*(.+):/g;
  const lines = content.split('\n');
  let match;

  lines.forEach((line, index) => {
    if ((match = commentPattern.exec(line)) !== null) {
      const comment = match[1].trim();

      // 잘못된 키워드 확인
      specData.wrongKeywords.forEach(wrongKeyword => {
        if (comment.includes(wrongKeyword)) {
          warnings.push({
            type: 'SKILL_MAPPING_WARNING',
            line: index + 1,
            comment,
            keyword: wrongKeyword,
            message: `스킬 주석에 다른 클래스 키워드: "${wrongKeyword}"`,
            snippet: line.trim()
          });
        }
      });
    }
  });

  return warnings;
};

/**
 * 5. 중복 스킬 설명 검출
 */
const detectDuplicateSkillDescriptions = (content) => {
  const warnings = [];
  const descPattern = /desc:\s*['"`]([^'"`]+)['"`]/g;
  const descriptions = {};
  let match;

  while ((match = descPattern.exec(content)) !== null) {
    const desc = match[1];

    if (descriptions[desc]) {
      descriptions[desc]++;
    } else {
      descriptions[desc] = 1;
    }
  }

  Object.entries(descriptions).forEach(([desc, count]) => {
    if (count > 3) {  // 3회 이상 중복 시 경고
      warnings.push({
        type: 'DUPLICATE_DESCRIPTION',
        description: desc,
        count,
        message: `중복된 스킬 설명 ${count}회 발견: "${desc}"`
      });
    }
  });

  return warnings;
};

/**
 * 검증 결과 포맷팅 (콘솔 출력용)
 */
export const formatValidationResult = (result) => {
  const { valid, issues, warnings } = result;

  let output = '\n';
  output += '='.repeat(60) + '\n';
  output += '  가이드 검증 결과\n';
  output += '='.repeat(60) + '\n\n';

  if (valid && warnings.length === 0) {
    output += '✅ 모든 검증 통과! 문제 없음.\n';
  } else {
    // 치명적 오류
    if (issues.length > 0) {
      output += `❌ 치명적 오류: ${issues.length}개\n`;
      output += '-'.repeat(60) + '\n';

      issues.forEach((issue, index) => {
        output += `\n${index + 1}. [${issue.type}]\n`;
        output += `   메시지: ${issue.message}\n`;
        if (issue.line) output += `   위치: Line ${issue.line}\n`;
        if (issue.snippet) output += `   코드: ${issue.snippet}\n`;
      });
    }

    // 경고
    if (warnings.length > 0) {
      output += `\n⚠️  경고: ${warnings.length}개\n`;
      output += '-'.repeat(60) + '\n';

      warnings.forEach((warning, index) => {
        output += `\n${index + 1}. [${warning.type}]\n`;
        output += `   메시지: ${warning.message}\n`;
        if (warning.line) output += `   위치: Line ${warning.line}\n`;
      });
    }
  }

  output += '\n' + '='.repeat(60) + '\n';
  return output;
};

/**
 * 파일 검증 (Node.js 환경용)
 */
export const validateGuideFile = async (filePath, className, specName) => {
  try {
    const fs = require('fs').promises;
    const content = await fs.readFile(filePath, 'utf-8');
    const result = validateGuideContent(content, className, specName);

    return result;
  } catch (error) {
    return {
      valid: false,
      issues: [{
        type: 'FILE_READ_ERROR',
        message: `파일 읽기 실패: ${error.message}`
      }],
      warnings: []
    };
  }
};
