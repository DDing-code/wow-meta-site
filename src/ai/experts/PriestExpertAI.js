// 사제 전문가 AI 시스템
import ClassExpertAI from '../ClassExpertAI';

class PriestExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('priest', spec);

    // 사제 특화 설정
    this.insanity = 0;
    this.mana = 100;
    this.atonementTargets = new Set();
    this.currentSpec = this.initializeSpec(spec);
  }

  initializeSpec(spec) {
    const specs = {
      discipline: {
        role: 'healer',
        priority: ['schism', 'mindBlast', 'shadowWordPain', 'penance'],
        keyStats: ['haste', 'crit', 'mastery'],
        healingStyle: 'atonement',
        manaManagement: 'critical'
      },
      holy: {
        role: 'healer',
        priority: ['prayerOfMending', 'circleOfHealing', 'heal', 'sanctify'],
        keyStats: ['mastery', 'crit', 'haste'],
        healingStyle: 'reactive',
        manaManagement: 'moderate'
      },
      shadow: {
        role: 'dps',
        priority: ['mindBlast', 'vampiricTouch', 'shadowWordPain', 'voidEruption'],
        keyStats: ['haste', 'crit', 'mastery'],
        insanityGeneration: 'sustained',
        voidFormManagement: 'critical'
      }
    };

    return specs[spec] || specs.shadow;
  }

  // 사제 특화 로테이션 분석
  analyzeRotation(combatData) {
    const rotation = super.analyzeRotation(combatData);

    if (this.spec === 'shadow') {
      rotation.insanityManagement = this.analyzeInsanityUsage(combatData);
      rotation.voidFormUptime = this.calculateVoidFormUptime(combatData);
    } else {
      rotation.manaEfficiency = this.analyzeManaUsage(combatData);
      if (this.spec === 'discipline') {
        rotation.atonementCoverage = this.analyzeAtonementTargets(combatData);
      }
    }

    return rotation;
  }

  analyzeInsanityUsage(combatData) {
    // 광기 사용 패턴 분석
    return {
      averageInsanityGeneration: 15,
      voidFormEntries: 8,
      efficiency: 0.92
    };
  }

  calculateVoidFormUptime(combatData) {
    // 공허의 형상 지속시간 계산
    return 0.45;
  }

  analyzeManaUsage(combatData) {
    // 마나 효율성 분석
    return {
      averageManaLevel: 65,
      oocRegen: 0.25,
      efficiency: 0.88
    };
  }

  analyzeAtonementTargets(combatData) {
    // 속죄 대상 관리 분석
    return {
      averageTargets: 5,
      uptime: 0.85,
      coverage: 0.90
    };
  }

  // 사제 특화 조언 생성
  generateSpecificAdvice(analysisResult) {
    const advice = super.generateAdvice(analysisResult);

    if (this.spec === 'discipline') {
      advice.push('속죄 사전 배치 최적화');
      advice.push('광휘의 권능 타이밍 개선');
    } else if (this.spec === 'holy') {
      advice.push('치유의 기원 바운스 최적화');
      advice.push('성화 위치 선정 개선');
    } else if (this.spec === 'shadow') {
      advice.push('공허 폭발 타이밍 최적화');
      advice.push('광기 생성 및 유지 개선');
    }

    return advice;
  }

  // 페이즈별 전략
  getPhaseSpecificAdvice(phase) {
    const baseAdvice = super.getPhaseSpecificAdvice(phase);

    if (phase === 'burst' && this.spec === 'shadow') {
      return [...baseAdvice, '공허의 격류 + 어둠의 마귀 동기화'];
    }

    return baseAdvice;
  }
}

export default PriestExpertAI;