// 마법사 전문가 AI 시스템
import ClassExpertAI from '../ClassExpertAI';

class MageExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('mage', spec);

    // 마법사 특화 설정
    this.mana = 100;
    this.arcaneCharges = 0;
    this.hotStreak = false;
    this.brainFreeze = false;
    this.currentSpec = this.initializeSpec(spec);
  }

  initializeSpec(spec) {
    const specs = {
      arcane: {
        role: 'dps',
        priority: ['arcaneBlast', 'arcaneBarrage', 'arcaneMissiles', 'arcaneOrb'],
        keyStats: ['intellect', 'crit', 'mastery', 'haste'],
        chargeManagement: 'critical',
        manaManagement: 'burn/conserve'
      },
      fire: {
        role: 'dps',
        priority: ['fireball', 'pyroblast', 'fireBlast', 'combustion'],
        keyStats: ['crit', 'haste', 'versatility'],
        criticalMassDependency: 'high',
        combustionWindows: 'critical'
      },
      frost: {
        role: 'dps',
        priority: ['frostbolt', 'iceLance', 'flurry', 'frozenOrb'],
        keyStats: ['crit', 'haste', 'versatility'],
        shatterCombos: 'critical',
        procManagement: 'high'
      }
    };

    return specs[spec] || specs.frost;
  }

  // 마법사 특화 로테이션 분석
  analyzeRotation(combatData) {
    const rotation = super.analyzeRotation(combatData);

    if (this.spec === 'arcane') {
      rotation.arcaneChargeManagement = this.analyzeArcaneCharges(combatData);
      rotation.burnPhaseEfficiency = this.analyzeBurnPhase(combatData);
    } else if (this.spec === 'fire') {
      rotation.combustionEfficiency = this.analyzeCombustion(combatData);
      rotation.hotStreakUsage = this.analyzeHotStreak(combatData);
    } else if (this.spec === 'frost') {
      rotation.shatterEfficiency = this.analyzeShatter(combatData);
      rotation.procUsage = this.analyzeProcs(combatData);
    }

    return rotation;
  }

  analyzeArcaneCharges(combatData) {
    // 비전 충전물 관리 분석
    return {
      averageCharges: 3.5,
      clearStackTiming: 0.90,
      efficiency: 0.94
    };
  }

  analyzeBurnPhase(combatData) {
    // 연소 페이즈 효율성 분석
    return {
      burnDuration: 15,
      dpsIncrease: 2.5,
      efficiency: 0.91
    };
  }

  analyzeCombustion(combatData) {
    // 연소 윈도우 분석
    return {
      averagePyrosPerCombust: 8,
      critRate: 0.95,
      efficiency: 0.93
    };
  }

  analyzeHotStreak(combatData) {
    // 뜨거운 연속타격 활용 분석
    return {
      procUsage: 0.98,
      wastedProcs: 2,
      efficiency: 0.96
    };
  }

  analyzeShatter(combatData) {
    // 산산조각 콤보 분석
    return {
      shatterRate: 0.85,
      comboSuccess: 0.90,
      efficiency: 0.88
    };
  }

  analyzeProcs(combatData) {
    // 프록 활용 분석
    return {
      brainFreezeUsage: 0.95,
      fingersOfFrostUsage: 0.93,
      efficiency: 0.94
    };
  }

  // 마법사 특화 조언 생성
  generateSpecificAdvice(analysisResult) {
    const advice = super.generateAdvice(analysisResult);

    if (this.spec === 'arcane') {
      advice.push('비전 충전물 4스택 유지 최적화');
      advice.push('비전 쇄도 연소 페이즈 타이밍');
    } else if (this.spec === 'fire') {
      advice.push('연소 윈도우 극대화');
      advice.push('뜨거운 연속타격 프록 즉시 활용');
    } else if (this.spec === 'frost') {
      advice.push('산산조각 콤보 성공률 향상');
      advice.push('두뇌 빙결 프록 우선순위 처리');
    }

    return advice;
  }

  // 페이즈별 전략
  getPhaseSpecificAdvice(phase) {
    const baseAdvice = super.getPhaseSpecificAdvice(phase);

    if (phase === 'burst') {
      if (this.spec === 'fire') {
        return [...baseAdvice, '연소 + 룬 폭발 동기화'];
      } else if (this.spec === 'arcane') {
        return [...baseAdvice, '비전 쇄도 + 비전 충전물 4스택'];
      }
    }

    return baseAdvice;
  }
}

export default MageExpertAI;