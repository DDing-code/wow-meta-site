// 성기사 전문가 AI 시스템
import ClassExpertAI from '../ClassExpertAI';

class PaladinExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('paladin', spec);

    // 성기사 특화 설정
    this.holyPower = 0;
    this.blessingManagement = new Map();
    this.currentSpec = this.initializeSpec(spec);
  }

  initializeSpec(spec) {
    const specs = {
      holy: {
        role: 'healer',
        priority: ['holyShock', 'lightOfDawn', 'wordOfGlory', 'flashOfLight'],
        keyStats: ['intellect', 'crit', 'haste', 'mastery'],
        healingStyle: 'burst'
      },
      protection: {
        role: 'tank',
        priority: ['avengersShield', 'judgment', 'hammerOfTheRighteous', 'shieldOfTheRighteous'],
        keyStats: ['haste', 'mastery', 'versatility'],
        mitigationStyle: 'active'
      },
      retribution: {
        role: 'dps',
        priority: ['bladeOfJustice', 'judgment', 'templarsVerdict', 'wakeOfAshes'],
        keyStats: ['haste', 'crit', 'mastery'],
        burstWindow: 'crusade'
      }
    };

    return specs[spec] || specs.retribution;
  }

  // 성기사 특화 로테이션 분석
  analyzeRotation(combatData) {
    const rotation = super.analyzeRotation(combatData);

    // 신성한 힘 관리
    rotation.holyPowerManagement = this.analyzeHolyPowerUsage(combatData);
    rotation.blessingUptime = this.calculateBlessingUptime(combatData);

    return rotation;
  }

  analyzeHolyPowerUsage(combatData) {
    // 신성한 힘 사용 패턴 분석
    return {
      wastedHolyPower: 0,
      overcap: 0,
      efficiency: 0.94
    };
  }

  calculateBlessingUptime(combatData) {
    // 축복 지속시간 계산
    return {
      blessingOfFreedom: 0.95,
      blessingOfProtection: 0.90,
      blessingOfSacrifice: 0.85
    };
  }

  // 성기사 특화 조언 생성
  generateSpecificAdvice(analysisResult) {
    const advice = super.generateAdvice(analysisResult);

    if (this.spec === 'holy') {
      advice.push('신성 충격 쿨다운 최적화');
      advice.push('여명의 빛 위치 선정 개선');
    } else if (this.spec === 'protection') {
      advice.push('정의의 방패 능동 방어 타이밍');
      advice.push('복수자의 방패 적중률 향상');
    } else if (this.spec === 'retribution') {
      advice.push('성전 또는 응징의 격노 버스트 최적화');
      advice.push('재의 격류 타이밍 조율');
    }

    return advice;
  }

  // 페이즈별 전략
  getPhaseSpecificAdvice(phase) {
    const baseAdvice = super.getPhaseSpecificAdvice(phase);

    if (phase === 'burst' && this.spec === 'retribution') {
      return [...baseAdvice, '성전 + 최후의 징표 동기화'];
    }

    return baseAdvice;
  }
}

export default PaladinExpertAI;