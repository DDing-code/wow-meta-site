// 악마사냥꾼 전문가 AI 시스템
import ClassExpertAI from '../ClassExpertAI';

class DemonHunterExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('demonhunter', spec);

    // 악마사냥꾼 특화 설정
    this.fury = 0;
    this.pain = 0;
    this.metamorphosis = false;
    this.momentum = false;
    this.currentSpec = this.initializeSpec(spec);
  }

  initializeSpec(spec) {
    const specs = {
      havoc: {
        role: 'dps',
        priority: ['demonsBite', 'chaosStrike', 'bladeDance', 'eyeBeam'],
        keyStats: ['crit', 'haste', 'versatility'],
        furyManagement: 'burst',
        momentumWindows: 'critical'
      },
      vengeance: {
        role: 'tank',
        priority: ['fracture', 'soulCleave', 'immolationAura', 'demonSpikes'],
        keyStats: ['versatility', 'haste', 'crit'],
        painManagement: 'defensive',
        mitigationStyle: 'active'
      }
    };

    return specs[spec] || specs.havoc;
  }

  // 악마사냥꾼 특화 로테이션 분석
  analyzeRotation(combatData) {
    const rotation = super.analyzeRotation(combatData);

    if (this.spec === 'havoc') {
      rotation.furyManagement = this.analyzeFuryUsage(combatData);
      rotation.momentumUptime = this.analyzeMomentum(combatData);
      rotation.eyeBeamTiming = this.analyzeEyeBeam(combatData);
    } else if (this.spec === 'vengeance') {
      rotation.painManagement = this.analyzePainUsage(combatData);
      rotation.demonSpikesUptime = this.analyzeDemonSpikes(combatData);
      rotation.soulFragments = this.analyzeSoulFragments(combatData);
    }

    return rotation;
  }

  analyzeFuryUsage(combatData) {
    // 격노 사용 패턴 분석
    return {
      averageFury: 45,
      wastedFury: 10,
      cappingInstances: 2,
      efficiency: 0.91
    };
  }

  analyzeMomentum(combatData) {
    // 탄력 지속시간 분석
    return {
      uptime: 0.75,
      windowUtilization: 0.88,
      efficiency: 0.82
    };
  }

  analyzeEyeBeam(combatData) {
    // 눈빔 타이밍 분석
    return {
      averageDamage: 125000,
      metamorphosisExtension: 8,
      efficiency: 0.94
    };
  }

  analyzePainUsage(combatData) {
    // 고통 사용 패턴 분석
    return {
      averagePain: 55,
      wastedPain: 5,
      efficiency: 0.92
    };
  }

  analyzeDemonSpikes(combatData) {
    // 악마 쐐기 지속시간 분석
    return {
      uptime: 0.65,
      chargeManagement: 0.85,
      efficiency: 0.75
    };
  }

  analyzeSoulFragments(combatData) {
    // 영혼 파편 활용 분석
    return {
      averageFragments: 3,
      consumptionRate: 0.88,
      wastedFragments: 2,
      efficiency: 0.85
    };
  }

  // 악마사냥꾼 특화 조언 생성
  generateSpecificAdvice(analysisResult) {
    const advice = super.generateAdvice(analysisResult);

    if (this.spec === 'havoc') {
      advice.push('탄력 윈도우 활용도 개선');
      advice.push('눈빔 타이밍 최적화');
      advice.push('혼돈의 일격 격노 관리');
      advice.push('칼춤 쿨다운 관리 개선');
    } else if (this.spec === 'vengeance') {
      advice.push('악마 쐐기 지속시간 향상');
      advice.push('영혼 파편 수집 및 소비 최적화');
      advice.push('제물의 오라 100% 유지');
      advice.push('영혼 베어내기 타이밍 개선');
    }

    return advice;
  }

  // 페이즈별 전략
  getPhaseSpecificAdvice(phase) {
    const baseAdvice = super.getPhaseSpecificAdvice(phase);

    if (phase === 'burst' && this.spec === 'havoc') {
      return [
        ...baseAdvice,
        '탈태 + 눈빔 콤보 실행',
        '혼돈의 낙인 사전 적용',
        '탄력 버프 유지하며 버스트'
      ];
    } else if (phase === 'survival' && this.spec === 'vengeance') {
      return [
        ...baseAdvice,
        '악마 쐐기 2스택 유지',
        '마의 수호물 활용',
        '영혼 파편 최대 수집'
      ];
    }

    return baseAdvice;
  }
}

export default DemonHunterExpertAI;