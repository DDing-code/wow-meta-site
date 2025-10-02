// 수도사 전문가 AI 시스템
import ClassExpertAI from '../ClassExpertAI';

class MonkExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('monk', spec);

    // 수도사 특화 설정
    this.energy = 100;
    this.chi = 0;
    this.staggerLevel = 0;
    this.currentSpec = this.initializeSpec(spec);
  }

  initializeSpec(spec) {
    const specs = {
      brewmaster: {
        role: 'tank',
        priority: ['kegSmash', 'breathOfFire', 'blackoutKick', 'tigerPalm'],
        keyStats: ['versatility', 'mastery', 'crit'],
        staggerManagement: 'critical',
        brewManagement: 'active'
      },
      mistweaver: {
        role: 'healer',
        priority: ['renewingMist', 'envelopingMist', 'vivify', 'essenceFont'],
        keyStats: ['crit', 'versatility', 'haste'],
        manaTeaUsage: 'efficient',
        healingStyle: 'mobile'
      },
      windwalker: {
        role: 'dps',
        priority: ['risingSunKick', 'fistsOfFury', 'blackoutKick', 'tigerPalm'],
        keyStats: ['versatility', 'crit', 'mastery'],
        comboManagement: 'critical',
        energyManagement: 'balanced'
      }
    };

    return specs[spec] || specs.windwalker;
  }

  // 수도사 특화 로테이션 분석
  analyzeRotation(combatData) {
    const rotation = super.analyzeRotation(combatData);

    // 기력 및 기 관리
    rotation.energyManagement = this.analyzeEnergyUsage(combatData);
    rotation.chiEfficiency = this.analyzeChiUsage(combatData);

    if (this.spec === 'brewmaster') {
      rotation.staggerManagement = this.analyzeStagger(combatData);
    } else if (this.spec === 'windwalker') {
      rotation.comboStrikes = this.analyzeComboStrikes(combatData);
    }

    return rotation;
  }

  analyzeEnergyUsage(combatData) {
    // 기력 사용 패턴 분석
    return {
      wastedEnergy: 0,
      energyStarvation: 0.05,
      efficiency: 0.94
    };
  }

  analyzeChiUsage(combatData) {
    // 기 효율성 분석
    return {
      wastedChi: 0,
      averageChiLevel: 2.5,
      efficiency: 0.95
    };
  }

  analyzeStagger(combatData) {
    // 시차 관리 분석 (양조)
    return {
      averageStaggerLevel: 'moderate',
      purifyingBrewUsage: 0.85,
      efficiency: 0.90
    };
  }

  analyzeComboStrikes(combatData) {
    // 연계 타격 분석 (풍운)
    return {
      comboSuccess: 0.96,
      masteryBonus: 1.35,
      efficiency: 0.93
    };
  }

  // 수도사 특화 조언 생성
  generateSpecificAdvice(analysisResult) {
    const advice = super.generateAdvice(analysisResult);

    if (this.spec === 'brewmaster') {
      advice.push('시차 정화주 타이밍 최적화');
      advice.push('천둥차 디버프 유지 개선');
    } else if (this.spec === 'mistweaver') {
      advice.push('소생의 안개 확산 최적화');
      advice.push('정수의 샘 위치 선정 개선');
    } else if (this.spec === 'windwalker') {
      advice.push('연계 타격 100% 유지');
      advice.push('폭풍과 대지와 불 버스트 최적화');
    }

    return advice;
  }

  // 페이즈별 전략
  getPhaseSpecificAdvice(phase) {
    const baseAdvice = super.getPhaseSpecificAdvice(phase);

    if (phase === 'burst' && this.spec === 'windwalker') {
      return [...baseAdvice, '폭풍과 대지와 불 + 분노의 주먹 동기화'];
    }

    return baseAdvice;
  }
}

export default MonkExpertAI;