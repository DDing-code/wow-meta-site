/**
 * 기존 가이드 컴포넌트의 스킬 데이터를 DB에 통합하는 헬퍼
 * BeastMasteryLayoutIntegrated.js 등에서 사용
 */

const { addSkillToDB, getSkillFromDB, getDBStats } = require('./skillDBManager');

/**
 * 가이드 컴포넌트의 skillData를 DB에 통합
 * @param {string} className - 클래스명 (예: 'HUNTER')
 * @param {Object} skillDataObject - 가이드의 skillData 객체
 * @param {string} specName - 전문화명 (예: '야수')
 */
function integrateSkillDataToDB(className, skillDataObject, specName) {
  console.log(`\n=== ${className} ${specName} 스킬 DB 통합 시작 ===`);

  const results = {
    added: [],
    updated: [],
    skipped: []
  };

  // 각 스킬 처리
  for (const [key, skill] of Object.entries(skillDataObject)) {
    // DB 형식으로 변환
    const dbSkill = {
      id: skill.id || key,
      koreanName: skill.name || skill.koreanName,
      englishName: skill.englishName,
      icon: skill.icon,
      description: skill.description,
      type: skill.type || '기본',
      spec: skill.spec || specName,
      heroTalent: skill.heroTalent || null,
      level: skill.level || 1,
      pvp: skill.pvp || false,
      duration: skill.duration || 'n/a',
      school: skill.school || 'Physical',
      mechanic: skill.mechanic || 'n/a',
      dispelType: skill.dispelType || 'n/a',
      gcd: skill.gcd || 'Normal',
      resourceCost: skill.resourceCost || skill.focusCost || '없음',
      resourceGain: skill.resourceGain || skill.focusGain || '없음',
      range: skill.range || '0 야드',
      castTime: skill.castTime || '즉시',
      cooldown: skill.cooldown || '해당 없음',
      charges: skill.charges,
      coefficient: skill.coefficient,
      maxTargets: skill.maxTargets
    };

    // DB에 추가 시도
    const existingSkill = getSkillFromDB(className, dbSkill.id);

    if (!existingSkill) {
      const added = addSkillToDB(className, dbSkill);
      if (added) {
        results.added.push(dbSkill.koreanName);
      }
    } else {
      results.skipped.push(dbSkill.koreanName);
    }
  }

  // 결과 출력
  console.log('\n=== 통합 결과 ===');
  console.log(`✅ 새로 추가: ${results.added.length}개`);
  console.log(`⚠️ 이미 존재: ${results.skipped.length}개`);

  if (results.added.length > 0) {
    console.log('\n새로 추가된 스킬:');
    results.added.forEach(name => console.log(`  - ${name}`));
  }

  // DB 통계
  const stats = getDBStats();
  if (stats) {
    console.log(`\n📊 ${className} 총 스킬 수: ${stats.byClass[className] || 0}개`);
    console.log(`📊 전체 DB 스킬 수: ${stats.totalSkills}개`);
  }

  return results;
}

/**
 * 사용 예시 - BeastMasteryLayoutIntegrated에서 사용
 */
function exampleIntegration() {
  // BeastMasteryLayoutIntegrated.js의 skillData를 가져와서
  const beastMasterySkills = {
    killCommand: {
      id: '34026',
      name: '살상 명령',
      englishName: 'Kill Command',
      icon: 'ability_hunter_killcommand',
      description: '펫에게 대상을 즉시 공격하도록 명령하여 물리 피해를 입힙니다.',
      cooldown: '7.5초',
      resourceCost: '집중 30',
      resourceGain: '없음'
    },
    barbedShot: {
      id: '217200',
      name: '날카로운 사격',
      englishName: 'Barbed Shot',
      icon: 'ability_hunter_barbedshot',
      description: '대상을 가시로 찔러 물리 피해를 입히고 8초 동안 출혈 피해를 입힙니다.',
      cooldown: '재충전 12초',
      resourceCost: '없음',
      resourceGain: '집중 20',
      charges: '2'
    }
    // ... 더 많은 스킬들
  };

  // DB에 통합
  const result = integrateSkillDataToDB('HUNTER', beastMasterySkills, '야수');

  return result;
}

// 명령줄에서 직접 실행 가능
if (require.main === module) {
  console.log('🚀 스킬 DB 통합 유틸리티');
  console.log('사용법: 가이드 컴포넌트에서 integrateSkillDataToDB() 함수 호출\n');

  // 예시 실행
  // exampleIntegration();
}

module.exports = {
  integrateSkillDataToDB
};