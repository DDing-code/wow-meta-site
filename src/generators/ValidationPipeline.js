import { getSpecMetadata } from '../data/classMetadata.js';

/**
 * ValidationPipeline - 5단계 사전 검증 시스템
 *
 * 오류 발생 전 예방 (Proactive Quality Gates)
 * - 데이터 수집 직후 즉시 검증
 * - 단계별 검증으로 오류 조기 발견
 * - 치명적 오류 발견 시 즉시 중단
 */

export class ValidationPipeline {
  constructor(specData) {
    this.specData = specData;
    this.errors = [];
    this.warnings = [];
  }

  /**
   * 전체 검증 실행
   */
  async validate() {
    console.log('\n🔍 데이터 검증 시작...\n');

    // Phase 1: 구조 검증
    console.log('  Phase 1/5: 구조 검증...');
    this.validateStructure();
    if (this.hasCriticalErrors()) {
      return this.getResult('STRUCTURE_INVALID');
    }

    // Phase 2: 영웅 특성 검증
    console.log('  Phase 2/5: 영웅 특성 검증...');
    this.validateHeroTalents();

    // Phase 3: 스킬 검증
    console.log('  Phase 3/5: 스킬 검증...');
    await this.validateSkills();

    // Phase 4: 로테이션 일관성 검증
    console.log('  Phase 4/5: 로테이션 일관성 검증...');
    this.validateRotationConsistency();

    // Phase 5: 리소스 검증
    console.log('  Phase 5/5: 리소스 타입 검증...');
    this.validateResourceTypes();

    console.log('\n✅ 검증 완료\n');
    return this.getResult();
  }

  /**
   * Phase 1: 구조 검증
   */
  validateStructure() {
    const required = ['config', 'rotation', 'talents', 'stats', 'skills'];

    for (const field of required) {
      if (!this.specData[field]) {
        this.addError({
          type: 'MISSING_FIELD',
          field,
          severity: 'critical',
          message: `필수 필드 누락: ${field}`
        });
      }
    }

    // config 내부 필드 검증
    if (this.specData.config) {
      const configRequired = ['class', 'spec', 'koreanName', 'englishName', 'heroTalents'];
      for (const field of configRequired) {
        if (!this.specData.config[field]) {
          this.addError({
            type: 'MISSING_CONFIG_FIELD',
            field,
            severity: 'critical',
            message: `config.${field} 필드 누락`
          });
        }
      }
    }

    if (this.errors.length === 0) {
      console.log('    ✓ 구조 검증 통과');
    } else {
      console.log(`    ❌ 구조 검증 실패: ${this.errors.length}개 오류`);
    }
  }

  /**
   * Phase 2: 영웅 특성 검증
   */
  validateHeroTalents() {
    const { config, rotation, talents, stats } = this.specData;

    // 영웅 특성 개수 확인
    if (!config.heroTalents || config.heroTalents.length !== 2) {
      this.addError({
        type: 'INVALID_HERO_TALENTS_COUNT',
        severity: 'critical',
        found: config.heroTalents?.length || 0,
        message: '영웅 특성은 정확히 2개여야 합니다'
      });
      return;
    }

    // classMetadata와 일치 여부 확인
    const metadata = getSpecMetadata(config.class, config.spec);
    if (metadata && metadata.heroTalents) {
      const metadataKeys = metadata.heroTalents.map(h => h.key);
      const configKeys = config.heroTalents.map(h => h.key);

      for (const key of configKeys) {
        if (!metadataKeys.includes(key)) {
          this.addError({
            type: 'INVALID_HERO_TALENT',
            heroTalent: key,
            severity: 'critical',
            message: `잘못된 영웅 특성: "${key}" (메타데이터에 없음)`
          });
        }
      }
    }

    // rotation에 각 영웅 특성 데이터가 있는지 확인
    for (const hero of config.heroTalents) {
      if (!rotation[hero.key]) {
        this.addError({
          type: 'MISSING_ROTATION_DATA',
          hero: hero.korean,
          severity: 'critical',
          message: `${hero.korean} 로테이션 데이터 누락`
        });
      } else {
        const data = rotation[hero.key];

        // 오프너 확인
        if (!data.opener || data.opener.length === 0) {
          this.addWarning({
            type: 'MISSING_OPENER',
            hero: hero.korean,
            message: `${hero.korean} 오프너 데이터 누락`
          });
        }

        // 단일 대상 로테이션 확인 (필수)
        if (!data.singleTarget || data.singleTarget.length === 0) {
          this.addError({
            type: 'MISSING_SINGLE_TARGET_ROTATION',
            hero: hero.korean,
            severity: 'critical',
            message: `${hero.korean} 단일 대상 로테이션 누락`
          });
        }

        // AoE 로테이션 확인 (경고)
        if (!data.aoe || data.aoe.length === 0) {
          this.addWarning({
            type: 'MISSING_AOE_ROTATION',
            hero: hero.korean,
            message: `${hero.korean} AoE 로테이션 누락`
          });
        }
      }

      // talents 확인
      if (!talents[hero.key]) {
        this.addWarning({
          type: 'MISSING_TALENT_BUILD',
          hero: hero.korean,
          message: `${hero.korean} 특성 빌드 누락`
        });
      }

      // stats 확인
      if (!stats[hero.key]) {
        this.addWarning({
          type: 'MISSING_STATS',
          hero: hero.korean,
          message: `${hero.korean} 스탯 우선순위 누락`
        });
      }
    }

    if (this.errors.filter(e => e.type.includes('HERO')).length === 0) {
      console.log('    ✓ 영웅 특성 검증 통과');
    } else {
      console.log(`    ❌ 영웅 특성 검증 실패`);
    }
  }

  /**
   * Phase 3: 스킬 검증
   */
  async validateSkills() {
    const { rotation, skills } = this.specData;
    const usedSkills = new Set();

    // 로테이션에서 사용된 모든 스킬 추출
    for (const heroData of Object.values(rotation)) {
      heroData.opener?.forEach(item => {
        if (item.skillId) usedSkills.add(item.skillId);
      });
      heroData.singleTarget?.forEach(item => {
        if (item.skillId) usedSkills.add(item.skillId);
      });
      heroData.aoe?.forEach(item => {
        if (item.skillId) usedSkills.add(item.skillId);
      });
    }

    console.log(`    - 로테이션에 사용된 스킬: ${usedSkills.size}개`);

    // 각 스킬이 skills 객체에 존재하는지 확인
    let missingCount = 0;
    let incompleteCount = 0;

    for (const skillId of usedSkills) {
      if (!skills[skillId]) {
        this.addError({
          type: 'MISSING_SKILL_DATA',
          skillId,
          severity: 'critical',
          message: `스킬 데이터 누락: ${skillId}`
        });
        missingCount++;
      } else {
        // 스킬 데이터 완전성 검증
        const skill = skills[skillId];
        const requiredFields = ['koreanName', 'englishName', 'icon', 'description'];

        for (const field of requiredFields) {
          if (!skill[field]) {
            this.addWarning({
              type: 'INCOMPLETE_SKILL_DATA',
              skillId,
              field,
              message: `${skillId}: ${field} 필드 누락`
            });
            incompleteCount++;
          }
        }
      }
    }

    if (missingCount === 0) {
      console.log('    ✓ 스킬 검증 통과');
      if (incompleteCount > 0) {
        console.log(`    ⚠️  불완전한 스킬 데이터: ${incompleteCount}개`);
      }
    } else {
      console.log(`    ❌ 스킬 검증 실패: ${missingCount}개 누락`);
    }
  }

  /**
   * Phase 4: 로테이션 일관성 검증
   */
  validateRotationConsistency() {
    const { rotation } = this.specData;
    let inconsistencyCount = 0;

    for (const [heroKey, heroData] of Object.entries(rotation)) {
      // 우선순위 번호 연속성 확인
      if (heroData.singleTarget && heroData.singleTarget.length > 0) {
        const priorities = heroData.singleTarget.map(item => item.priority).sort((a, b) => a - b);

        for (let i = 0; i < priorities.length; i++) {
          if (priorities[i] !== i) {
            this.addWarning({
              type: 'PRIORITY_GAP',
              hero: heroKey,
              expected: i,
              found: priorities[i],
              message: `${heroKey}: 우선순위 번호 불연속 (예상: ${i}, 발견: ${priorities[i]})`
            });
            inconsistencyCount++;
          }
        }
      }

      // 중복 우선순위 확인
      if (heroData.singleTarget) {
        const prioritySet = new Set();
        for (const item of heroData.singleTarget) {
          if (prioritySet.has(item.priority)) {
            this.addWarning({
              type: 'DUPLICATE_PRIORITY',
              hero: heroKey,
              priority: item.priority,
              message: `${heroKey}: 중복된 우선순위 번호 ${item.priority}`
            });
            inconsistencyCount++;
          }
          prioritySet.add(item.priority);
        }
      }
    }

    if (inconsistencyCount === 0) {
      console.log('    ✓ 로테이션 일관성 검증 통과');
    } else {
      console.log(`    ⚠️  로테이션 일관성 경고: ${inconsistencyCount}개`);
    }
  }

  /**
   * Phase 5: 리소스 타입 검증
   */
  validateResourceTypes() {
    const { config } = this.specData;
    const className = config.class;

    // classMetadata에서 리소스 타입 확인
    const metadata = getSpecMetadata(className, config.spec);

    if (metadata) {
      const expectedResource = metadata.resourceType || metadata.resourceName;
      const actualResource = config.resource?.primary;

      if (expectedResource && actualResource && expectedResource !== actualResource) {
        this.addWarning({
          type: 'RESOURCE_MISMATCH',
          expected: expectedResource,
          found: actualResource,
          message: `리소스 타입 불일치 (예상: ${expectedResource}, 발견: ${actualResource})`
        });
      } else {
        console.log('    ✓ 리소스 타입 검증 통과');
      }
    } else {
      console.log('    ⚠️  리소스 타입 검증 건너뜀 (메타데이터 없음)');
    }
  }

  /**
   * 유틸리티 함수
   */

  addError(error) {
    this.errors.push(error);
  }

  addWarning(warning) {
    this.warnings.push(warning);
  }

  hasCriticalErrors() {
    return this.errors.some(e => e.severity === 'critical');
  }

  getResult(status = null) {
    const finalStatus = status || (this.errors.length === 0 ? 'SUCCESS' : 'FAILED');

    return {
      success: finalStatus === 'SUCCESS',
      status: finalStatus,
      errors: this.errors,
      warnings: this.warnings,
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        criticalErrors: this.errors.filter(e => e.severity === 'critical').length
      }
    };
  }

  /**
   * 검증 결과 출력 (사람이 읽기 쉽게)
   */
  printReport() {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  검증 리포트');
    console.log('═══════════════════════════════════════════════════════\n');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ 모든 검증 통과! 문제 없음.');
    } else {
      if (this.errors.length > 0) {
        console.log(`❌ 치명적 오류: ${this.errors.length}개\n`);
        this.errors.forEach((err, idx) => {
          console.log(`${idx + 1}. [${err.type}]`);
          console.log(`   메시지: ${err.message}`);
          if (err.field) console.log(`   필드: ${err.field}`);
          if (err.hero) console.log(`   영웅 특성: ${err.hero}`);
          console.log();
        });
      }

      if (this.warnings.length > 0) {
        console.log(`⚠️  경고: ${this.warnings.length}개\n`);
        this.warnings.forEach((warn, idx) => {
          console.log(`${idx + 1}. [${warn.type}]`);
          console.log(`   메시지: ${warn.message}`);
          console.log();
        });
      }
    }

    console.log('═══════════════════════════════════════════════════════\n');
  }
}

export default ValidationPipeline;
