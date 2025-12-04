// Mechanism Validator - KB 데이터 품질 보증
// 메커니즘 데이터의 필수 필드, 도메인 일관성, 데이터 타입 검증

/**
 * Mechanism Validator
 * - 필수 필드 검증
 * - 도메인별 필드 검증
 * - 도메인 간 일관성 검증
 * - 빌드 시 자동 실행 가능
 */
class MechanismValidator {
  /**
   * 메커니즘 전체 검증
   * @param {Object} mechanism - 메커니즘 객체
   * @returns {Object} 검증 결과 { valid, errors, warnings }
   */
  static validate(mechanism) {
    const errors = [];
    const warnings = [];

    // 1. 필수 필드 검증
    this.validateRequiredFields(mechanism, errors);

    // 2. 도메인별 검증
    if (mechanism.guide) {
      this.validateGuide(mechanism.guide, errors, warnings);
    }

    if (mechanism.analysis) {
      this.validateAnalysis(mechanism.analysis, errors, warnings);
    }

    if (mechanism.learning) {
      this.validateLearning(mechanism.learning, errors, warnings);
    }

    if (mechanism.simulation) {
      this.validateSimulation(mechanism.simulation, errors, warnings);
    }

    // 3. 도메인 간 일관성 검증
    this.validateCrossDomain(mechanism, errors, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 필수 필드 검증
   */
  static validateRequiredFields(mechanism, errors) {
    if (!mechanism.id) {
      errors.push({
        type: 'MISSING_FIELD',
        field: 'id',
        message: 'id는 필수 필드입니다',
        severity: 'critical'
      });
    }

    if (!mechanism.name || !mechanism.name.ko || !mechanism.name.en) {
      errors.push({
        type: 'MISSING_FIELD',
        field: 'name',
        message: 'name.ko와 name.en은 필수 필드입니다',
        severity: 'critical'
      });
    }

    if (!mechanism.guide) {
      errors.push({
        type: 'MISSING_DOMAIN',
        field: 'guide',
        message: 'guide 도메인은 필수입니다',
        severity: 'critical'
      });
    }

    if (!mechanism.analysis) {
      errors.push({
        type: 'MISSING_DOMAIN',
        field: 'analysis',
        message: 'analysis 도메인은 필수입니다',
        severity: 'high'
      });
    }

    if (!mechanism.learning) {
      errors.push({
        type: 'MISSING_DOMAIN',
        field: 'learning',
        message: 'learning 도메인은 필수입니다',
        severity: 'high'
      });
    }

    if (!mechanism.simulation) {
      errors.push({
        type: 'MISSING_DOMAIN',
        field: 'simulation',
        message: 'simulation 도메인은 필수입니다',
        severity: 'medium'
      });
    }
  }

  /**
   * guide 도메인 검증
   */
  static validateGuide(guide, errors, warnings) {
    if (!guide.description || guide.description.trim() === '') {
      errors.push({
        type: 'EMPTY_FIELD',
        field: 'guide.description',
        message: 'guide.description은 필수이며 비어있을 수 없습니다',
        severity: 'high'
      });
    }

    if (!guide.details || !Array.isArray(guide.details)) {
      errors.push({
        type: 'INVALID_TYPE',
        field: 'guide.details',
        message: 'guide.details는 배열이어야 합니다',
        severity: 'high'
      });
    } else if (guide.details.length === 0) {
      warnings.push({
        type: 'EMPTY_ARRAY',
        field: 'guide.details',
        message: 'guide.details가 비어있습니다',
        recommendation: '세부사항을 추가하세요'
      });
    }

    if (!guide.relatedSkills || !Array.isArray(guide.relatedSkills)) {
      warnings.push({
        type: 'MISSING_FIELD',
        field: 'guide.relatedSkills',
        message: 'guide.relatedSkills가 없거나 배열이 아닙니다',
        recommendation: '관련 스킬 ID 배열을 추가하세요'
      });
    } else if (guide.relatedSkills.length === 0) {
      warnings.push({
        type: 'EMPTY_ARRAY',
        field: 'guide.relatedSkills',
        message: 'guide.relatedSkills가 비어있습니다',
        recommendation: '관련 스킬을 추가하세요'
      });
    }

    if (guide.importance &&
        !['critical', 'high', 'medium', 'low'].includes(guide.importance)) {
      errors.push({
        type: 'INVALID_VALUE',
        field: 'guide.importance',
        message: `guide.importance는 'critical', 'high', 'medium', 'low' 중 하나여야 합니다 (현재: ${guide.importance})`,
        severity: 'medium'
      });
    }
  }

  /**
   * analysis 도메인 검증
   */
  static validateAnalysis(analysis, errors, warnings) {
    // stackInfo 검증
    if (analysis.stackInfo) {
      if (typeof analysis.stackInfo.max !== 'number') {
        errors.push({
          type: 'INVALID_TYPE',
          field: 'analysis.stackInfo.max',
          message: 'stackInfo.max는 숫자여야 합니다',
          severity: 'high'
        });
      } else if (analysis.stackInfo.max > 20) {
        warnings.push({
          type: 'UNUSUAL_VALUE',
          field: 'analysis.stackInfo.max',
          message: `stackInfo.max가 20을 초과합니다 (현재: ${analysis.stackInfo.max})`,
          recommendation: '일반적이지 않은 값입니다. 확인하세요'
        });
      }

      if (typeof analysis.stackInfo.duration !== 'number') {
        errors.push({
          type: 'INVALID_TYPE',
          field: 'analysis.stackInfo.duration',
          message: 'stackInfo.duration은 숫자여야 합니다 (밀리초)',
          severity: 'high'
        });
      }
    }

    // triggers 검증
    if (analysis.triggers) {
      if (!Array.isArray(analysis.triggers.skills)) {
        warnings.push({
          type: 'INVALID_TYPE',
          field: 'analysis.triggers.skills',
          message: 'triggers.skills는 배열이어야 합니다',
          recommendation: '트리거 스킬 ID 배열을 추가하세요'
        });
      } else if (analysis.triggers.skills.length === 0) {
        warnings.push({
          type: 'EMPTY_ARRAY',
          field: 'analysis.triggers.skills',
          message: 'triggers.skills가 비어있습니다',
          recommendation: '트리거 스킬을 추가하세요'
        });
      }
    }

    // buffId/debuffId 검증
    if (!analysis.buffId && !analysis.debuffId) {
      warnings.push({
        type: 'MISSING_FIELD',
        field: 'analysis.buffId/debuffId',
        message: 'buffId 또는 debuffId 중 하나는 있어야 합니다',
        recommendation: 'Wowhead에서 버프/디버프 ID를 확인하세요'
      });
    }
  }

  /**
   * learning 도메인 검증
   */
  static validateLearning(learning, errors, warnings) {
    const validCategories = ['burst-window', 'resource-management', 'defensive', 'movement', 'aoe', 'single-target', 'general'];
    if (!learning.category || !validCategories.includes(learning.category)) {
      errors.push({
        type: 'INVALID_VALUE',
        field: 'learning.category',
        message: `learning.category는 다음 중 하나여야 합니다: ${validCategories.join(', ')}`,
        severity: 'high'
      });
    }

    const validDifficulties = ['easy', 'medium', 'hard', 'expert'];
    if (!learning.difficulty || !validDifficulties.includes(learning.difficulty)) {
      errors.push({
        type: 'INVALID_VALUE',
        field: 'learning.difficulty',
        message: `learning.difficulty는 다음 중 하나여야 합니다: ${validDifficulties.join(', ')}`,
        severity: 'high'
      });
    }

    if (!Array.isArray(learning.keyPoints)) {
      errors.push({
        type: 'INVALID_TYPE',
        field: 'learning.keyPoints',
        message: 'learning.keyPoints는 배열이어야 합니다',
        severity: 'high'
      });
    } else if (learning.keyPoints.length === 0) {
      warnings.push({
        type: 'EMPTY_ARRAY',
        field: 'learning.keyPoints',
        message: 'learning.keyPoints가 비어있습니다',
        recommendation: '핵심 포인트를 추가하세요 (AI 학습 효과 향상)'
      });
    }

    if (!Array.isArray(learning.commonMistakes)) {
      errors.push({
        type: 'INVALID_TYPE',
        field: 'learning.commonMistakes',
        message: 'learning.commonMistakes는 배열이어야 합니다',
        severity: 'medium'
      });
    } else if (learning.commonMistakes.length === 0) {
      warnings.push({
        type: 'EMPTY_ARRAY',
        field: 'learning.commonMistakes',
        message: 'learning.commonMistakes가 비어있습니다',
        recommendation: '일반적 실수를 추가하세요 (AI 학습 효과 향상)'
      });
    } else {
      // commonMistakes 항목별 검증
      learning.commonMistakes.forEach((mistake, idx) => {
        if (!mistake.mistake || !mistake.impact || !mistake.solution) {
          errors.push({
            type: 'INCOMPLETE_OBJECT',
            field: `learning.commonMistakes[${idx}]`,
            message: 'commonMistakes 항목은 mistake, impact, solution 필드가 필요합니다',
            severity: 'medium'
          });
        }
      });
    }
  }

  /**
   * simulation 도메인 검증
   */
  static validateSimulation(simulation, errors, warnings) {
    const validTypes = ['stacking-buff', 'proc', 'cooldown', 'resource-gen', 'window', 'generic'];
    if (!simulation.type || !validTypes.includes(simulation.type)) {
      errors.push({
        type: 'INVALID_VALUE',
        field: 'simulation.type',
        message: `simulation.type은 다음 중 하나여야 합니다: ${validTypes.join(', ')}`,
        severity: 'high'
      });
    }

    // stacking-buff 타입은 maxStacks 필수
    if (simulation.type === 'stacking-buff' && !simulation.maxStacks) {
      errors.push({
        type: 'MISSING_FIELD',
        field: 'simulation.maxStacks',
        message: 'stacking-buff 타입은 maxStacks가 필수입니다',
        severity: 'high'
      });
    }
  }

  /**
   * 도메인 간 일관성 검증
   */
  static validateCrossDomain(mechanism, errors, warnings) {
    // analysis.stackInfo와 simulation.maxStacks 일치 확인
    if (mechanism.analysis?.stackInfo && mechanism.simulation?.maxStacks) {
      if (mechanism.analysis.stackInfo.max !== mechanism.simulation.maxStacks) {
        errors.push({
          type: 'CROSS_DOMAIN_MISMATCH',
          field: 'analysis.stackInfo.max <-> simulation.maxStacks',
          message: `analysis.stackInfo.max (${mechanism.analysis.stackInfo.max})와 simulation.maxStacks (${mechanism.simulation.maxStacks}) 불일치`,
          severity: 'high'
        });
      }
    }

    // guide.relatedSkills와 analysis.triggers.skills 일관성
    if (mechanism.guide?.relatedSkills && mechanism.analysis?.triggers?.skills) {
      const guideSkills = new Set(mechanism.guide.relatedSkills.map(String));
      const analysisSkills = mechanism.analysis.triggers.skills;

      analysisSkills.forEach(skillId => {
        if (!guideSkills.has(String(skillId))) {
          warnings.push({
            type: 'CROSS_DOMAIN_INCONSISTENCY',
            field: 'guide.relatedSkills <-> analysis.triggers.skills',
            message: `analysis.triggers.skills[${skillId}]가 guide.relatedSkills에 없습니다`,
            recommendation: 'guide.relatedSkills에 추가하거나 analysis.triggers.skills에서 제거하세요'
          });
        }
      });
    }
  }

  /**
   * 검증 결과 출력 (콘솔)
   */
  static printValidationResult(mechanismId, result) {
    if (result.valid && result.warnings.length === 0) {
      console.log(`✅ ${mechanismId}: 모든 검증 통과`);
      return;
    }

    if (!result.valid) {
      console.error(`❌ ${mechanismId}: ${result.errors.length}개 오류`);
      result.errors.forEach((err, idx) => {
        console.error(`  ${idx + 1}. [${err.type}] ${err.message}`);
        if (err.field) console.error(`     필드: ${err.field}`);
      });
    }

    if (result.warnings.length > 0) {
      console.warn(`⚠️  ${mechanismId}: ${result.warnings.length}개 경고`);
      result.warnings.forEach((warn, idx) => {
        console.warn(`  ${idx + 1}. [${warn.type}] ${warn.message}`);
        if (warn.recommendation) console.warn(`     권장: ${warn.recommendation}`);
      });
    }
  }
}

export default MechanismValidator;
