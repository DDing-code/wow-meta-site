// TWW Season 3 스킬 데이터 검증 시스템
const fs = require('fs');
const path = require('path');

class SkillStructureValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.validatedCount = 0;
    this.patch = "11.2.0";
    this.season = "TWW Season 3";
  }

  // 전체 검증 프로세스
  validateDatabase(database) {
    console.log('🔍 스킬 데이터베이스 검증 시작...\n');

    for (const [skillId, skillData] of Object.entries(database)) {
      const validation = this.validateSkill(skillId, skillData);

      if (validation.errors.length === 0) {
        this.validatedCount++;
      } else {
        this.errors.push({
          skillId,
          skillName: skillData?.base?.koreanName || skillData?.koreanName || 'Unknown',
          errors: validation.errors
        });
      }

      if (validation.warnings.length > 0) {
        this.warnings.push({
          skillId,
          skillName: skillData?.base?.koreanName || skillData?.koreanName || 'Unknown',
          warnings: validation.warnings
        });
      }
    }

    return this.generateReport();
  }

  // 개별 스킬 검증
  validateSkill(skillId, skill) {
    const errors = [];
    const warnings = [];

    // 1. 기본 구조 검증
    const structureCheck = this.validateStructure(skill);
    errors.push(...structureCheck.errors);
    warnings.push(...structureCheck.warnings);

    // 2. 전문화 일관성 검증
    const specializationCheck = this.validateSpecializationConsistency(skill);
    errors.push(...specializationCheck.errors);
    warnings.push(...specializationCheck.warnings);

    // 3. 자원 논리 검증
    const resourceCheck = this.validateResourceLogic(skill);
    errors.push(...resourceCheck.errors);
    warnings.push(...resourceCheck.warnings);

    // 4. TWW 시즌 3 검증
    const patchCheck = this.validatePatchData(skill);
    errors.push(...patchCheck.errors);
    warnings.push(...patchCheck.warnings);

    // 5. 메커니즘 검증
    const mechanicsCheck = this.validateMechanics(skill);
    errors.push(...mechanicsCheck.errors);
    warnings.push(...mechanicsCheck.warnings);

    // 6. 특성 상호작용 검증
    const talentCheck = this.validateTalentInteractions(skill);
    errors.push(...talentCheck.errors);
    warnings.push(...talentCheck.warnings);

    return { errors, warnings };
  }

  // 1. 기본 구조 검증
  validateStructure(skill) {
    const errors = [];
    const warnings = [];

    // 필수 필드 체크
    if (!skill.base?.id && !skill.id) {
      errors.push('스킬 ID 누락');
    }

    if (!skill.base?.name && !skill.name) {
      errors.push('영문명 누락');
    }

    if (!skill.base?.koreanName && !skill.koreanName) {
      warnings.push('한글명 누락');
    }

    if (!skill.base?.icon && !skill.iconName) {
      warnings.push('아이콘 정보 누락');
    }

    // 설명 검증
    if (!skill.description && !skill.base?.description) {
      warnings.push('설명 누락');
    } else {
      const desc = skill.description || skill.base?.description;
      if (typeof desc === 'string') {
        // 불완전한 텍스트 패턴 체크
        if (desc.includes('()') || desc.includes('[]')) {
          warnings.push('빈 괄호가 설명에 포함됨');
        }
        if (/\s+(을|를|이|가|와|과|에게|로|으로)\s+/.test(desc)) {
          warnings.push('불완전한 조사가 설명에 포함됨');
        }
        if (/\|\d+/.test(desc)) {
          warnings.push('변수 치환 패턴이 설명에 남아있음');
        }
      }
    }

    return { errors, warnings };
  }

  // 2. 전문화 일관성 검증
  validateSpecializationConsistency(skill) {
    const errors = [];
    const warnings = [];

    // 전문화 데이터가 있는 경우
    if (skill.classification?.specialization) {
      const specs = skill.classification.specialization;

      // specializationDetails와 일치 확인
      if (skill.specializationDetails) {
        for (const spec of specs) {
          if (spec !== 'all' && !skill.specializationDetails[spec]) {
            errors.push(`${spec} 전문화 상세 데이터 누락`);
          }
        }

        // 반대로 체크 - specializationDetails에만 있는 경우
        for (const spec of Object.keys(skill.specializationDetails)) {
          if (!specs.includes(spec) && specs[0] !== 'all') {
            warnings.push(`${spec} 전문화가 classification에 없음`);
          }
        }
      }
    }

    // 특정 전문화별 차이가 있어야 하는 스킬들
    const specsRequiringDifferences = {
      '6940': ['holy', 'protection', 'retribution'],  // 희생의 축복
      '46968': ['arms', 'fury']  // 칼날폭풍
    };

    const skillId = skill.base?.id || skill.id;
    if (specsRequiringDifferences[skillId]) {
      if (!skill.specializationDetails) {
        errors.push('전문화별 차이가 정의되어야 하는데 누락됨');
      } else {
        for (const spec of specsRequiringDifferences[skillId]) {
          if (!skill.specializationDetails[spec]) {
            errors.push(`${spec} 전문화 데이터가 필요하지만 누락됨`);
          }
        }
      }
    }

    return { errors, warnings };
  }

  // 3. 자원 논리 검증
  validateResourceLogic(skill) {
    const errors = [];
    const warnings = [];

    const resources = skill.resources || skill.resource;
    if (!resources) return { errors, warnings };

    // 같은 자원을 소모하면서 생성할 수 없음
    if (resources.cost && resources.generate) {
      const costType = resources.cost.type || (resources.cost.holyPower && 'holyPower');
      const generateType = resources.generate.type || (resources.generate.holyPower && 'holyPower');

      if (costType && generateType && costType === generateType) {
        // 예외: 일부 스킬은 자원을 소모하면서 조건부로 생성 가능
        if (!resources.generate.conditions) {
          errors.push(`같은 자원(${costType})을 소모하면서 생성 - 논리 충돌`);
        }
      }
    }

    // 자원 타입 유효성 검증
    const validResourceTypes = [
      '마나', '분노', '기력', '룬마력', '집중', '영혼조각',
      '신성한힘', '연계점수', '기', '격노', '고통', '정수',
      'mana', 'rage', 'energy', 'runicPower', 'focus',
      'soulShards', 'holyPower', 'comboPoints', 'chi',
      'fury', 'pain', 'essence'
    ];

    if (resources.cost?.type && !validResourceTypes.includes(resources.cost.type)) {
      warnings.push(`알 수 없는 자원 타입: ${resources.cost.type}`);
    }

    if (resources.generate?.type && !validResourceTypes.includes(resources.generate.type)) {
      warnings.push(`알 수 없는 생성 자원 타입: ${resources.generate.type}`);
    }

    return { errors, warnings };
  }

  // 4. TWW 시즌 3 패치 검증
  validatePatchData(skill) {
    const errors = [];
    const warnings = [];

    const metadata = skill.metadata || skill.meta;
    if (!metadata) {
      warnings.push('메타데이터 누락');
      return { errors, warnings };
    }

    // 패치 버전 확인
    if (!metadata.patch) {
      warnings.push('패치 버전 정보 누락');
    } else if (!metadata.patch.startsWith('11.2')) {
      errors.push(`TWW Season 3 (11.2) 데이터가 아님: ${metadata.patch}`);
    }

    // 시즌 정보 확인
    if (metadata.season && !metadata.season.includes('TWW')) {
      warnings.push(`TWW 시즌 데이터가 아닐 수 있음: ${metadata.season}`);
    }

    return { errors, warnings };
  }

  // 5. 메커니즘 검증
  validateMechanics(skill) {
    const errors = [];
    const warnings = [];

    const mechanics = skill.mechanics;
    if (!mechanics) return { errors, warnings };

    // 재사용 대기시간 형식 검증
    if (mechanics.cooldown?.base) {
      const cd = mechanics.cooldown.base;
      if (cd !== '없음' && !/^\d+(\.\d+)?(초|분)$/.test(cd)) {
        warnings.push(`잘못된 재사용 대기시간 형식: ${cd}`);
      }
    }

    // 시전 시간 형식 검증
    if (mechanics.cast?.castTime) {
      const cast = mechanics.cast.castTime;
      if (cast !== '즉시' && !/^\d+(\.\d+)?초$/.test(cast)) {
        warnings.push(`잘못된 시전 시간 형식: ${cast}`);
      }
    }

    // 사정거리 형식 검증
    if (mechanics.targeting?.range) {
      const range = mechanics.targeting.range;
      const validRanges = ['근접', '자신', '무한'];
      if (!validRanges.includes(range) && !/^\d+\s*야드$/.test(range)) {
        warnings.push(`잘못된 사정거리 형식: ${range}`);
      }
    }

    // 지속시간 형식 검증
    if (mechanics.duration?.base) {
      const duration = mechanics.duration.base;
      if (duration !== '없음' && !/^\d+(\.\d+)?(초|분)$/.test(duration)) {
        warnings.push(`잘못된 지속시간 형식: ${duration}`);
      }
    }

    // 채널링과 즉시 시전 충돌 체크
    if (mechanics.cast?.channeled === true && mechanics.cast?.castTime === '즉시') {
      errors.push('채널링 스킬인데 즉시 시전으로 표시됨');
    }

    return { errors, warnings };
  }

  // 6. 특성 상호작용 검증
  validateTalentInteractions(skill) {
    const errors = [];
    const warnings = [];

    const interactions = skill.talentInteractions;
    if (!interactions) return { errors, warnings };

    // modifiedBy와 modifies의 상호 참조 확인
    if (interactions.modifies && Array.isArray(interactions.modifies)) {
      for (const mod of interactions.modifies) {
        if (!mod.skillId || !mod.effect) {
          warnings.push('불완전한 특성 상호작용 정보');
        }
      }
    }

    // replaces와 replacedBy 충돌 체크
    if (interactions.replaces && interactions.replacedBy) {
      warnings.push('스킬이 동시에 대체하고 대체됨');
    }

    return { errors, warnings };
  }

  // 검증 보고서 생성
  generateReport() {
    const totalSkills = this.validatedCount + this.errors.length;
    const successRate = ((this.validatedCount / totalSkills) * 100).toFixed(2);

    const report = {
      summary: {
        totalSkills,
        validatedCount: this.validatedCount,
        errorCount: this.errors.length,
        warningCount: this.warnings.length,
        successRate: `${successRate}%`,
        patch: this.patch,
        season: this.season,
        validationDate: new Date().toISOString()
      },
      errors: this.errors,
      warnings: this.warnings
    };

    return report;
  }

  // 보고서 출력
  printReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 스킬 데이터 검증 보고서');
    console.log('='.repeat(60));

    console.log('\n📈 요약:');
    console.log(`  - 전체 스킬: ${report.summary.totalSkills}개`);
    console.log(`  - 검증 통과: ${report.summary.validatedCount}개`);
    console.log(`  - 오류 발생: ${report.summary.errorCount}개`);
    console.log(`  - 경고 발생: ${report.summary.warningCount}개`);
    console.log(`  - 성공률: ${report.summary.successRate}`);

    if (report.errors.length > 0) {
      console.log('\n❌ 오류 목록:');
      report.errors.slice(0, 10).forEach(error => {
        console.log(`\n  [${error.skillId}] ${error.skillName}:`);
        error.errors.forEach(e => console.log(`    - ${e}`));
      });
      if (report.errors.length > 10) {
        console.log(`\n  ... 외 ${report.errors.length - 10}개 오류`);
      }
    }

    if (report.warnings.length > 0) {
      console.log('\n⚠️ 경고 목록:');
      report.warnings.slice(0, 10).forEach(warning => {
        console.log(`\n  [${warning.skillId}] ${warning.skillName}:`);
        warning.warnings.forEach(w => console.log(`    - ${w}`));
      });
      if (report.warnings.length > 10) {
        console.log(`\n  ... 외 ${report.warnings.length - 10}개 경고`);
      }
    }

    console.log('\n' + '='.repeat(60));
  }

  // 보고서 저장
  saveReport(report, outputPath = null) {
    const filePath = outputPath || path.join(__dirname, 'src/data/validation-report.json');
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`\n📄 검증 보고서 저장: ${filePath}`);
  }
}

// 실행 함수
async function validateSkillDatabase() {
  const validator = new SkillStructureValidator();

  // TWW Season 3 데이터 로드
  const twwDataPath = path.join(__dirname, 'src/data/tww-season3-skills.json');
  if (fs.existsSync(twwDataPath)) {
    console.log(`📂 TWW Season 3 데이터 로드 중...`);
    const twwData = JSON.parse(fs.readFileSync(twwDataPath, 'utf8'));

    // 모든 클래스의 스킬을 하나의 객체로 통합
    const allSkills = {};
    if (twwData.skills) {
      Object.values(twwData.skills).forEach(classSkills => {
        Object.assign(allSkills, classSkills);
      });
    }

    const report = validator.validateDatabase(allSkills);
    validator.printReport(report);
    validator.saveReport(report);

    // 심각한 오류가 있으면 종료 코드 1 반환
    if (report.summary.errorCount > 0) {
      console.log('\n⚠️ 검증 실패: 오류를 수정하세요.');
      return false;
    } else {
      console.log('\n✅ 검증 성공: 모든 스킬이 구조 요구사항을 충족합니다.');
      return true;
    }
  } else {
    console.error('❌ TWW Season 3 데이터 파일을 찾을 수 없습니다.');
    console.log('💡 먼저 wowhead-crawler-tww.js를 실행하세요.');
    return false;
  }
}

// 모듈 내보내기
module.exports = {
  SkillStructureValidator,
  validateSkillDatabase
};

// 직접 실행 시
if (require.main === module) {
  validateSkillDatabase();
}