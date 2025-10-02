// 도적 전문가 AI 시스템
import ClassExpertAI from '../ClassExpertAI';

class RogueExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('rogue', spec);

    // 도적 특화 설정
    this.energy = 100;
    this.comboPoints = 0;
    this.stealthManagement = {
      stealthUptime: 0,
      shadowDanceCharges: 0
    };
    this.currentSpec = this.initializeSpec(spec);
  }

  initializeSpec(spec) {
    const specs = {
      assassination: {
        role: 'dps',
        priority: ['mutilate', 'envenom', 'garrote', 'rupture'],
        keyStats: ['haste', 'crit', 'mastery'],
        poisonType: 'deadly',
        energyManagement: 'steady'
      },
      outlaw: {
        role: 'dps',
        priority: ['sinisterStrike', 'dispatch', 'betweenTheEyes', 'rollTheBones'],
        keyStats: ['haste', 'versatility', 'crit'],
        rollManagement: 'buffs',
        energyManagement: 'burst'
      },
      subtlety: {
        role: 'dps',
        priority: ['shadowstrike', 'eviscerate', 'shadowDance', 'symbolsOfDeath'],
        keyStats: ['crit', 'versatility', 'haste'],
        shadowManagement: 'critical',
        energyManagement: 'windows'
      }
    };

    return specs[spec] || specs.assassination;
  }

  // 도적 특화 로테이션 분석
  analyzeRotation(combatData) {
    const rotation = super.analyzeRotation(combatData);

    // 기력 및 연계 점수 관리
    rotation.energyManagement = this.analyzeEnergyUsage(combatData);
    rotation.comboPointEfficiency = this.analyzeComboPoints(combatData);

    if (this.spec === 'outlaw') {
      rotation.rollTheBonesBuff = this.analyzeRollBuffs(combatData);
    }

    return rotation;
  }

  analyzeEnergyUsage(combatData) {
    // 기력 사용 패턴 분석
    return {
      wastedEnergy: 0,
      cappingTime: 0,
      efficiency: 0.93
    };
  }

  analyzeComboPoints(combatData) {
    // 연계 점수 효율성 분석
    return {
      wastedComboPoints: 0,
      averageCPPerFinisher: 4.8,
      efficiency: 0.96
    };
  }

  analyzeRollBuffs(combatData) {
    // 무법자 주사위 버프 분석
    return {
      averageBuffCount: 2.5,
      rerollEfficiency: 0.85,
      uptimePerBuff: 0.75
    };
  }

  // 도적 특화 조언 생성
  generateSpecificAdvice(analysisResult) {
    const advice = super.generateAdvice(analysisResult);

    if (this.spec === 'assassination') {
      advice.push('독 도포 시간 최적화');
      advice.push('파열 지속시간 관리 개선');
    } else if (this.spec === 'outlaw') {
      advice.push('주사위 굴리기 버프 관리 최적화');
      advice.push('권총 사격 프록 즉시 활용');
    } else if (this.spec === 'subtlety') {
      advice.push('어둠의 춤 윈도우 극대화');
      advice.push('죽음의 상징 타이밍 조율');
    }

    return advice;
  }

  // 페이즈별 전략
  getPhaseSpecificAdvice(phase) {
    const baseAdvice = super.getPhaseSpecificAdvice(phase);

    if (phase === 'burst' && this.spec === 'subtlety') {
      return [...baseAdvice, '어둠의 춤 + 죽음의 상징 동기화'];
    }

    return baseAdvice;
  }
}

export default RogueExpertAI;