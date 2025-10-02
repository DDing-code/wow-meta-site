// 드루이드 전문가 AI 시스템
import ClassExpertAI from '../ClassExpertAI';

class DruidExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('druid', spec);

    // 드루이드 특화 설정
    this.energy = 100;
    this.rage = 0;
    this.mana = 100;
    this.comboPoints = 0;
    this.astralPower = 0;
    this.currentForm = null;
    this.currentSpec = this.initializeSpec(spec);
  }

  initializeSpec(spec) {
    const specs = {
      balance: {
        role: 'dps',
        priority: ['starfire', 'wrath', 'starsurge', 'starfall'],
        keyStats: ['haste', 'mastery', 'crit'],
        eclipseManagement: 'critical',
        astralPowerGeneration: 'balanced'
      },
      feral: {
        role: 'dps',
        priority: ['rake', 'shred', 'ferocious_bite', 'rip'],
        keyStats: ['crit', 'mastery', 'haste'],
        bleedManagement: 'critical',
        energyManagement: 'pooling'
      },
      guardian: {
        role: 'tank',
        priority: ['mangle', 'thrash', 'ironfur', 'maul'],
        keyStats: ['versatility', 'haste', 'mastery'],
        rageManagement: 'active',
        mitigationStyle: 'proactive'
      },
      restoration: {
        role: 'healer',
        priority: ['rejuvenation', 'wildGrowth', 'lifebloom', 'swiftmend'],
        keyStats: ['haste', 'mastery', 'crit'],
        hotManagement: 'critical',
        manaEfficiency: 'high'
      }
    };

    return specs[spec] || specs.balance;
  }

  // 드루이드 특화 로테이션 분석
  analyzeRotation(combatData) {
    const rotation = super.analyzeRotation(combatData);

    if (this.spec === 'balance') {
      rotation.eclipseManagement = this.analyzeEclipse(combatData);
      rotation.astralPowerEfficiency = this.analyzeAstralPower(combatData);
    } else if (this.spec === 'feral') {
      rotation.bleedUptime = this.analyzeBleedUptime(combatData);
      rotation.snapshotting = this.analyzeSnapshotting(combatData);
    } else if (this.spec === 'guardian') {
      rotation.ironFurUptime = this.analyzeIronfur(combatData);
    } else if (this.spec === 'restoration') {
      rotation.hotCoverage = this.analyzeHoTs(combatData);
    }

    return rotation;
  }

  analyzeEclipse(combatData) {
    // 일월식 관리 분석
    return {
      solarUptime: 0.48,
      lunarUptime: 0.47,
      transitionEfficiency: 0.92
    };
  }

  analyzeAstralPower(combatData) {
    // 천공의 힘 효율성 분석
    return {
      averagePower: 45,
      wastedPower: 5,
      efficiency: 0.90
    };
  }

  analyzeBleedUptime(combatData) {
    // 출혈 지속시간 분석
    return {
      rakeUptime: 0.98,
      ripUptime: 0.95,
      thrashUptime: 0.90,
      overallEfficiency: 0.94
    };
  }

  analyzeSnapshotting(combatData) {
    // 스냅샷 효율성 분석
    return {
      tigersFurySnapshot: 0.85,
      bloodtalonsSnapshot: 0.75,
      efficiency: 0.80
    };
  }

  analyzeIronfur(combatData) {
    // 무쇠가죽 지속시간 분석
    return {
      uptime: 0.85,
      stackAverage: 1.8,
      efficiency: 0.88
    };
  }

  analyzeHoTs(combatData) {
    // HoT 커버리지 분석
    return {
      rejuvenationTargets: 5,
      lifebloomUptime: 0.95,
      wildGrowthCoverage: 0.80,
      efficiency: 0.91
    };
  }

  // 드루이드 특화 조언 생성
  generateSpecificAdvice(analysisResult) {
    const advice = super.generateAdvice(analysisResult);

    if (this.spec === 'balance') {
      advice.push('일월식 전환 타이밍 최적화');
      advice.push('별빛쇄도 천공의 힘 관리');
    } else if (this.spec === 'feral') {
      advice.push('호랑이의 분노 스냅샷 최적화');
      advice.push('출혈 효과 갱신 타이밍 개선');
    } else if (this.spec === 'guardian') {
      advice.push('무쇠가죽 스택 유지 개선');
      advice.push('난타 디버프 100% 유지');
    } else if (this.spec === 'restoration') {
      advice.push('회복 HoT 사전 배치 최적화');
      advice.push('꽃피우기 타이밍 개선');
    }

    return advice;
  }

  // 페이즈별 전략
  getPhaseSpecificAdvice(phase) {
    const baseAdvice = super.getPhaseSpecificAdvice(phase);

    if (phase === 'burst') {
      if (this.spec === 'balance') {
        return [...baseAdvice, '천체 정렬 + 화신 동기화'];
      } else if (this.spec === 'feral') {
        return [...baseAdvice, '광폭화 + 호랑이의 분노 콤보'];
      }
    }

    return baseAdvice;
  }
}

export default DruidExpertAI;