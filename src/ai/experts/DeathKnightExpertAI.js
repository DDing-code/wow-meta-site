// 죽음의 기사 전문가 AI 시스템
import ClassExpertAI from '../ClassExpertAI';

class DeathKnightExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('deathknight', spec);

    // 죽음의 기사 특화 설정
    this.runeSystem = {
      blood: 0,
      frost: 0,
      unholy: 0,
      death: 0
    };

    this.currentSpec = this.initializeSpec(spec);
  }

  initializeSpec(spec) {
    const specs = {
      blood: {
        role: 'tank',
        priority: ['deathStrike', 'marrowrend', 'bloodBoil', 'heartStrike'],
        keyStats: ['versatility', 'haste', 'mastery'],
        runicPowerGeneration: 'defensive'
      },
      frost: {
        role: 'dps',
        priority: ['obliterate', 'frostStrike', 'howlingBlast', 'remorselessWinter'],
        keyStats: ['crit', 'haste', 'mastery'],
        runicPowerGeneration: 'burst'
      },
      unholy: {
        role: 'dps',
        priority: ['festering_strike', 'death_coil', 'apocalypse', 'army_of_the_damned'],
        keyStats: ['haste', 'crit', 'mastery'],
        runicPowerGeneration: 'sustained'
      }
    };

    return specs[spec] || specs.frost;
  }

  // 죽음의 기사 특화 로테이션 분석
  analyzeRotation(combatData) {
    const rotation = super.analyzeRotation(combatData);

    // 룬 시스템 최적화
    rotation.runeManagement = this.analyzeRuneUsage(combatData);
    rotation.runicPowerEfficiency = this.calculateRunicPowerEfficiency(combatData);

    return rotation;
  }

  analyzeRuneUsage(combatData) {
    // 룬 사용 패턴 분석
    return {
      wastedRunes: 0,
      overcap: 0,
      efficiency: 0.95
    };
  }

  calculateRunicPowerEfficiency(combatData) {
    // 룬 파워 효율성 계산
    return 0.92;
  }

  // 죽음의 기사 특화 조언 생성
  generateSpecificAdvice(analysisResult) {
    const advice = super.generateAdvice(analysisResult);

    if (this.spec === 'blood') {
      advice.push('죽음의 일격 타이밍 최적화로 생존력 향상');
      advice.push('골수 분쇄 스택 관리로 방어도 유지');
    } else if (this.spec === 'frost') {
      advice.push('냉기의 기둥 버스트 윈도우 최대화');
      advice.push('얼음 결속 프록 즉시 활용');
    } else if (this.spec === 'unholy') {
      advice.push('고름 상처 스택 관리 최적화');
      advice.push('대재앙 타이밍 조율로 DPS 극대화');
    }

    return advice;
  }

  // 페이즈별 전략
  getPhaseSpecificAdvice(phase) {
    const baseAdvice = super.getPhaseSpecificAdvice(phase);

    if (phase === 'burst') {
      if (this.spec === 'unholy') {
        return [...baseAdvice, '군대 소환 + 대재앙 동기화'];
      }
    }

    return baseAdvice;
  }
}

export default DeathKnightExpertAI;