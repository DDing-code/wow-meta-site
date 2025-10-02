// 가이드 검증 시스템
import { twwS3SkillDatabase } from '../../data/twwS3FinalCleanedDatabase';

class GuideValidator {
  constructor() {
    this.validationRules = {
      skillData: this.validateSkillData,
      heroTalents: this.validateHeroTalents,
      rotationData: this.validateRotationData,
      buildData: this.validateBuildData,
      statData: this.validateStatData,
      translations: this.validateTranslations,
      icons: this.validateIcons
    };

    this.validationResults = [];
    this.errorCount = 0;
    this.warningCount = 0;
  }

  // 전체 가이드 검증
  async validateGuide(guideData) {
    console.log('🔍 가이드 검증 시작...');

    this.validationResults = [];
    this.errorCount = 0;
    this.warningCount = 0;

    const { className, spec, skillData, heroTalents, rotationData, buildData, statData } = guideData;

    // 각 항목 검증
    await this.validateSkillData(skillData, className, spec);
    await this.validateHeroTalents(heroTalents, className, spec);
    await this.validateRotationData(rotationData, skillData);
    await this.validateBuildData(buildData);
    await this.validateStatData(statData);
    await this.validateTranslations(skillData);
    await this.validateIcons(skillData);

    // 결과 요약
    const summary = {
      passed: this.errorCount === 0,
      errors: this.errorCount,
      warnings: this.warningCount,
      details: this.validationResults
    };

    console.log(`✅ 검증 완료: ${summary.passed ? '통과' : '실패'}`);
    console.log(`   오류: ${summary.errors}개, 경고: ${summary.warnings}개`);

    return summary;
  }

  // 스킬 데이터 검증
  async validateSkillData(skillData, className, spec) {
    console.log('📋 스킬 데이터 검증 중...');

    if (!skillData || Object.keys(skillData).length === 0) {
      this.addError('스킬 데이터가 비어있습니다');
      return;
    }

    // 필수 스킬 체크
    const requiredSkills = this.getRequiredSkills(className, spec);
    for (const skillKey of requiredSkills) {
      if (!skillData[skillKey]) {
        this.addWarning(`필수 스킬 누락: ${skillKey}`);
      }
    }

    // 각 스킬 필드 검증
    for (const [key, skill] of Object.entries(skillData)) {
      // 필수 필드 체크
      const requiredFields = ['id', 'name', 'englishName', 'icon', 'description'];
      for (const field of requiredFields) {
        if (!skill[field]) {
          this.addError(`스킬 ${key}의 필수 필드 누락: ${field}`);
        }
      }

      // 한국어 이름 검증
      if (skill.name && !this.isKorean(skill.name)) {
        this.addError(`스킬 ${key}의 이름이 한국어가 아닙니다: ${skill.name}`);
      }

      // 아이콘 파일 검증
      if (skill.icon && skill.icon.includes('questionmark')) {
        this.addWarning(`스킬 ${key}의 아이콘이 기본값입니다`);
      }
    }

    console.log(`   스킬 검증 완료: ${Object.keys(skillData).length}개 스킬`);
  }

  // 영웅 특성 검증
  async validateHeroTalents(heroTalents, className, spec) {
    console.log('🏆 영웅 특성 검증 중...');

    if (!heroTalents || Object.keys(heroTalents).length === 0) {
      this.addError('영웅 특성 데이터가 비어있습니다');
      return;
    }

    // 영웅 특성은 정확히 2개여야 함
    if (Object.keys(heroTalents).length !== 2) {
      this.addError(`영웅 특성은 2개여야 합니다. 현재: ${Object.keys(heroTalents).length}개`);
    }

    // 각 영웅 특성 검증
    for (const [key, hero] of Object.entries(heroTalents)) {
      if (!hero.name) {
        this.addError(`영웅 특성 ${key}의 이름이 없습니다`);
      }

      if (!hero.icon) {
        this.addWarning(`영웅 특성 ${key}의 아이콘이 없습니다`);
      }

      // 티어세트 효과 검증
      if (!hero.tierSet) {
        this.addError(`영웅 특성 ${key}의 티어세트 효과가 없습니다`);
      } else {
        if (!hero.tierSet['2set']) {
          this.addError(`영웅 특성 ${key}의 2세트 효과가 없습니다`);
        }
        if (!hero.tierSet['4set']) {
          this.addError(`영웅 특성 ${key}의 4세트 효과가 없습니다`);
        }
      }
    }

    console.log(`   영웅 특성 검증 완료`);
  }

  // 딜사이클 데이터 검증
  async validateRotationData(rotationData, skillData) {
    console.log('🔄 딜사이클 데이터 검증 중...');

    if (!rotationData || Object.keys(rotationData).length === 0) {
      this.addError('딜사이클 데이터가 비어있습니다');
      return;
    }

    for (const [heroKey, rotation] of Object.entries(rotationData)) {
      // 단일 대상 검증
      if (!rotation.singleTarget) {
        this.addError(`${heroKey}의 단일 대상 딜사이클이 없습니다`);
      } else {
        this.validateRotationSection(rotation.singleTarget, skillData, `${heroKey} 단일`);
      }

      // 광역 검증
      if (!rotation.aoe) {
        this.addWarning(`${heroKey}의 광역 딜사이클이 없습니다`);
      } else {
        this.validateRotationSection(rotation.aoe, skillData, `${heroKey} 광역`);
      }
    }

    console.log(`   딜사이클 검증 완료`);
  }

  // 딜사이클 섹션 검증
  validateRotationSection(section, skillData, sectionName) {
    // 오프닝 검증
    if (!section.opener || section.opener.length === 0) {
      this.addError(`${sectionName}의 오프닝 시퀀스가 비어있습니다`);
    } else {
      for (const skillKey of section.opener) {
        if (!skillData[skillKey]) {
          this.addError(`${sectionName} 오프닝의 스킬 ${skillKey}이 스킬 데이터에 없습니다`);
        }
      }
    }

    // 우선순위 검증
    if (!section.priority || section.priority.length === 0) {
      this.addError(`${sectionName}의 우선순위가 비어있습니다`);
    } else {
      for (const item of section.priority) {
        if (!item.skill) {
          this.addError(`${sectionName} 우선순위 항목에 스킬이 없습니다`);
        } else if (!skillData[item.skill]) {
          this.addError(`${sectionName} 우선순위의 스킬 ${item.skill}이 스킬 데이터에 없습니다`);
        }

        if (!item.desc) {
          this.addWarning(`${sectionName} 우선순위 항목에 설명이 없습니다`);
        }
      }
    }
  }

  // 빌드 데이터 검증
  async validateBuildData(buildData) {
    console.log('🏗️ 빌드 데이터 검증 중...');

    if (!buildData || Object.keys(buildData).length === 0) {
      this.addError('빌드 데이터가 비어있습니다');
      return;
    }

    const requiredBuildTypes = ['raid-single', 'raid-aoe', 'mythic-plus'];

    for (const [heroKey, builds] of Object.entries(buildData)) {
      for (const buildType of requiredBuildTypes) {
        if (!builds[buildType]) {
          this.addWarning(`${heroKey}의 ${buildType} 빌드가 없습니다`);
        } else {
          const build = builds[buildType];

          if (!build.code) {
            this.addError(`${heroKey}의 ${buildType} 빌드 코드가 없습니다`);
          } else if (!this.isValidBuildCode(build.code)) {
            this.addError(`${heroKey}의 ${buildType} 빌드 코드가 유효하지 않습니다`);
          }

          if (!build.name) {
            this.addWarning(`${heroKey}의 ${buildType} 빌드 이름이 없습니다`);
          }

          if (!build.description) {
            this.addWarning(`${heroKey}의 ${buildType} 빌드 설명이 없습니다`);
          }
        }
      }
    }

    console.log(`   빌드 검증 완료`);
  }

  // 스탯 데이터 검증
  async validateStatData(statData) {
    console.log('📊 스탯 데이터 검증 중...');

    if (!statData || Object.keys(statData).length === 0) {
      this.addError('스탯 데이터가 비어있습니다');
      return;
    }

    const validStats = ['weaponDamage', 'haste', 'crit', 'mastery', 'versatility', 'agility', 'strength', 'intellect'];

    for (const [heroKey, stats] of Object.entries(statData)) {
      // 단일 대상 스탯
      if (!stats.single || stats.single.length === 0) {
        this.addError(`${heroKey}의 단일 대상 스탯 우선순위가 없습니다`);
      } else {
        for (const stat of stats.single) {
          if (!validStats.includes(stat)) {
            this.addWarning(`${heroKey}의 단일 대상에 유효하지 않은 스탯: ${stat}`);
          }
        }
      }

      // 광역 스탯
      if (!stats.aoe || stats.aoe.length === 0) {
        this.addWarning(`${heroKey}의 광역 스탯 우선순위가 없습니다`);
      } else {
        for (const stat of stats.aoe) {
          if (!validStats.includes(stat)) {
            this.addWarning(`${heroKey}의 광역에 유효하지 않은 스탯: ${stat}`);
          }
        }
      }
    }

    console.log(`   스탯 검증 완료`);
  }

  // 번역 검증
  async validateTranslations(skillData) {
    console.log('🌐 번역 검증 중...');

    for (const [key, skill] of Object.entries(skillData)) {
      // 한국어 이름 검증
      if (skill.name) {
        // 데이터베이스와 대조
        const dbSkill = this.findSkillInDatabase(skill.id);
        if (dbSkill && dbSkill.koreanName !== skill.name) {
          this.addWarning(`스킬 ${key}의 한국어명 불일치: ${skill.name} (DB: ${dbSkill.koreanName})`);
        }
      }

      // 영어 이름 검증
      if (skill.englishName && skill.englishName.includes('_')) {
        this.addWarning(`스킬 ${key}의 영어명에 언더스코어 포함: ${skill.englishName}`);
      }
    }

    console.log(`   번역 검증 완료`);
  }

  // 아이콘 검증
  async validateIcons(skillData) {
    console.log('🎨 아이콘 검증 중...');

    const invalidIcons = [];

    for (const [key, skill] of Object.entries(skillData)) {
      if (!skill.icon) {
        invalidIcons.push(key);
      } else if (skill.icon === 'inv_misc_questionmark') {
        invalidIcons.push(key);
      }
    }

    if (invalidIcons.length > 0) {
      this.addWarning(`유효하지 않은 아이콘: ${invalidIcons.join(', ')}`);
    }

    console.log(`   아이콘 검증 완료`);
  }

  // 헬퍼 함수들
  getRequiredSkills(className, spec) {
    // 클래스별 필수 스킬
    const requiredSkills = {
      'hunter': {
        'beast-mastery': ['killCommand', 'barbedShot', 'bestialWrath', 'cobraShot', 'multiShot']
      }
      // 다른 클래스/전문화 추가...
    };

    return requiredSkills[className]?.[spec] || [];
  }

  isKorean(text) {
    // 한국어 문자가 포함되어 있는지 체크
    return /[가-힣]/.test(text);
  }

  isValidBuildCode(code) {
    // Wowhead 빌드 코드 형식 검증
    // 보통 C로 시작하고 특정 길이와 패턴을 가짐
    return /^C[A-Z0-9]{50,}$/.test(code);
  }

  findSkillInDatabase(skillId) {
    // twwS3SkillDatabase에서 스킬 찾기
    for (const classSkills of Object.values(twwS3SkillDatabase)) {
      if (classSkills[skillId]) {
        return classSkills[skillId];
      }
    }
    return null;
  }

  addError(message) {
    this.errorCount++;
    this.validationResults.push({
      type: 'error',
      message
    });
    console.error(`   ❌ 오류: ${message}`);
  }

  addWarning(message) {
    this.warningCount++;
    this.validationResults.push({
      type: 'warning',
      message
    });
    console.warn(`   ⚠️ 경고: ${message}`);
  }

  // 검증 리포트 생성
  generateReport(validationResult) {
    const report = `
=================================
가이드 검증 리포트
=================================

검증 결과: ${validationResult.passed ? '✅ 통과' : '❌ 실패'}
오류 수: ${validationResult.errors}
경고 수: ${validationResult.warnings}

상세 내역:
---------------------------------
`;

    const errors = validationResult.details.filter(d => d.type === 'error');
    const warnings = validationResult.details.filter(d => d.type === 'warning');

    let detailedReport = report;

    if (errors.length > 0) {
      detailedReport += '\n오류 목록:\n';
      errors.forEach((error, index) => {
        detailedReport += `  ${index + 1}. ${error.message}\n`;
      });
    }

    if (warnings.length > 0) {
      detailedReport += '\n경고 목록:\n';
      warnings.forEach((warning, index) => {
        detailedReport += `  ${index + 1}. ${warning.message}\n`;
      });
    }

    detailedReport += '\n=================================\n';

    return detailedReport;
  }
}

// 싱글톤 인스턴스
const guideValidator = new GuideValidator();

export default guideValidator;