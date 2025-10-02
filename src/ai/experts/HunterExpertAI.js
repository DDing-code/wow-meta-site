// 사냥꾼 전문가 AI 시스템
import ClassExpertAI from '../ClassExpertAI';

class HunterExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('hunter', spec);

    // 사냥꾼 특화 설정
    this.focus = 100;
    this.petManagement = {
      petType: null,
      petHealth: 100,
      petDPS: 0
    };
    this.currentSpec = this.initializeSpec(spec);
  }

  initializeSpec(spec) {
    const specs = {
      beastmastery: {
        role: 'dps',
        priority: ['barbedShot', 'killCommand', 'cobraShot', 'bestialWrath'],
        keyStats: ['crit', 'haste', 'mastery'],
        petDependency: 'high',
        focusGeneration: 'moderate'
      },
      marksmanship: {
        role: 'dps',
        priority: ['aimedShot', 'rapidFire', 'steadyShot', 'trueShot'],
        keyStats: ['crit', 'mastery', 'haste'],
        petDependency: 'low',
        focusGeneration: 'steady'
      },
      survival: {
        role: 'dps',
        priority: ['mongooseBite', 'killCommand', 'wildFireBomb', 'raptorStrike'],
        keyStats: ['haste', 'crit', 'versatility'],
        petDependency: 'medium',
        focusGeneration: 'burst'
      }
    };

    return specs[spec] || specs.beastmastery;
  }

  // 사냥꾼 특화 로테이션 분석
  analyzeRotation(combatData) {
    const rotation = super.analyzeRotation(combatData);

    // 집중 관리
    rotation.focusManagement = this.analyzeFocusUsage(combatData);
    rotation.petPerformance = this.analyzePetPerformance(combatData);

    return rotation;
  }

  analyzeFocusUsage(combatData) {
    // 집중 사용 패턴 분석
    return {
      wastedFocus: 0,
      starvationTime: 0,
      efficiency: 0.91
    };
  }

  analyzePetPerformance(combatData) {
    // 펫 성능 분석
    return {
      petDPSContribution: 0.25,
      petUptime: 0.98,
      petSurvivability: 0.95
    };
  }

  // 사냥꾼 특화 조언 생성
  generateSpecificAdvice(analysisResult) {
    const advice = super.generateAdvice(analysisResult);

    if (this.spec === 'beastmastery') {
      advice.push('가시 사격 스택 유지 최적화');
      advice.push('야수의 격노 타이밍 개선');
    } else if (this.spec === 'marksmanship') {
      advice.push('정조준 사격 더블 탭 활용');
      advice.push('속사 채널링 최적화');
    } else if (this.spec === 'survival') {
      advice.push('몽구스 일격 윈도우 극대화');
      advice.push('야생불 폭탄 쿨다운 관리');
    }

    return advice;
  }

  // 페이즈별 전략
  getPhaseSpecificAdvice(phase) {
    const baseAdvice = super.getPhaseSpecificAdvice(phase);

    if (phase === 'burst') {
      if (this.spec === 'marksmanship') {
        return [...baseAdvice, '정확한 사격 + 속사 콤보'];
      }
    }

    return baseAdvice;
  }
}

export default HunterExpertAI;