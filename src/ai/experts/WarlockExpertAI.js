// 흑마법사 전문가 AI 시스템
import ClassExpertAI from '../ClassExpertAI';

class WarlockExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('warlock', spec);

    // 흑마법사 특화 설정
    this.soulShards = 3;
    this.demonicCore = 0;
    this.dotManagement = new Map();
    this.currentSpec = this.initializeSpec(spec);
  }

  initializeSpec(spec) {
    const specs = {
      affliction: {
        role: 'dps',
        priority: ['agony', 'corruption', 'unstableAffliction', 'maleficRapture'],
        keyStats: ['haste', 'mastery', 'crit'],
        dotManagement: 'critical',
        soulShardGeneration: 'steady'
      },
      demonology: {
        role: 'dps',
        priority: ['shadowBolt', 'callDreadstalkers', 'handOfGuldan', 'demonicStrength'],
        keyStats: ['haste', 'crit', 'mastery'],
        impManagement: 'critical',
        tyrantTiming: 'burst'
      },
      destruction: {
        role: 'dps',
        priority: ['incinerate', 'chaossBolt', 'conflagrate', 'immolate'],
        keyStats: ['haste', 'mastery', 'crit'],
        havocWindows: 'critical',
        soulShardManagement: 'burst'
      }
    };

    return specs[spec] || specs.destruction;
  }

  // 흑마법사 특화 로테이션 분석
  analyzeRotation(combatData) {
    const rotation = super.analyzeRotation(combatData);

    // 영혼 조각 관리
    rotation.soulShardManagement = this.analyzeSoulShards(combatData);

    if (this.spec === 'affliction') {
      rotation.dotUptime = this.analyzeDotUptime(combatData);
    } else if (this.spec === 'demonology') {
      rotation.demonManagement = this.analyzeDemonArmy(combatData);
    } else if (this.spec === 'destruction') {
      rotation.havocEfficiency = this.analyzeHavoc(combatData);
    }

    return rotation;
  }

  analyzeSoulShards(combatData) {
    // 영혼 조각 관리 분석
    return {
      averageShards: 2.5,
      wastedShards: 1,
      efficiency: 0.92
    };
  }

  analyzeDotUptime(combatData) {
    // DoT 지속시간 분석
    return {
      agonyUptime: 0.98,
      corruptionUptime: 0.96,
      unstableAfflictionUptime: 0.85,
      overallEfficiency: 0.93
    };
  }

  analyzeDemonArmy(combatData) {
    // 악마 군대 관리 분석
    return {
      averageImps: 8,
      dreadstalkerUptime: 0.75,
      tyrantEmpowerment: 15,
      efficiency: 0.90
    };
  }

  analyzeHavoc(combatData) {
    // 혼돈 효율성 분석
    return {
      havocUptime: 0.60,
      cleaveDamage: 0.35,
      efficiency: 0.88
    };
  }

  // 흑마법사 특화 조언 생성
  generateSpecificAdvice(analysisResult) {
    const advice = super.generateAdvice(analysisResult);

    if (this.spec === 'affliction') {
      advice.push('고통 도트 갱신 타이밍 최적화');
      advice.push('사악한 환희 버스트 윈도우 극대화');
    } else if (this.spec === 'demonology') {
      advice.push('악마 폭군 소환 전 임프 최대화');
      advice.push('공포추적자 지속시간 관리');
    } else if (this.spec === 'destruction') {
      advice.push('혼돈의 화살 크리티컬 타이밍');
      advice.push('대혼란 클리브 활용 최적화');
    }

    return advice;
  }

  // 페이즈별 전략
  getPhaseSpecificAdvice(phase) {
    const baseAdvice = super.getPhaseSpecificAdvice(phase);

    if (phase === 'burst') {
      if (this.spec === 'demonology') {
        return [...baseAdvice, '악마 폭군 + 악마의 힘 동기화'];
      } else if (this.spec === 'destruction') {
        return [...baseAdvice, '지옥불 + 혼돈의 화살 연속 시전'];
      }
    }

    return baseAdvice;
  }
}

export default WarlockExpertAI;