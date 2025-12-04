// 성기사 신성 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class HolyPaladinAI extends SpecializationAI {
  constructor() {
    super('paladin', 'holy');

    // 신성 성기사 특성
    this.specializationTraits = {
      role: 'healer',
      resource: 'mana',
      primaryStat: 'intellect',
      armorType: 'plate'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 신성 성기사 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'beacon_of_light', // 빛의 신호탄
        'beacon_of_virtue', // 미덕의 신호탄
        'holy_shock', // 신성 충격
        'judgement' // 심판
      ],
      spender: [
        'holy_light', // 신성한 빛
        'flash_of_light', // 빛의 섬광
        'word_of_glory', // 영광의 언어
        'light_of_dawn' // 새벽의 빛
      ],
      cooldowns: [
        { name: 'avenging_wrath', cooldown: 120 }, // 응보의 격노
        { name: 'aura_mastery', cooldown: 180 }, // 오라 숙련
        { name: 'holy_avenger', cooldown: 180 }, // 신성한 복수자
        { name: 'divine_toll', cooldown: 60 }, // 신성한 종
        { name: 'divine_shield', cooldown: 300 } // 천상의 보호막
      ],
      buffs: [
        'beacon_of_light', // 빛의 신호탄
        'avenging_wrath', // 응보의 격노
        'divine_favor', // 신성한 은총
        'infusion_of_light', // 빛의 주입
        'glimmer_of_light', // 빛의 미광
        'divine_purpose' // 신성한 목적
      ],
      debuffs: [
        'judgement', // 심판
        'consecration' // 신성화
      ],
      procs: [
        'infusion_of_light', // 빛의 주입
        'divine_purpose', // 신성한 목적
        'glimmer_of_light' // 빛의 미광
      ]
    };

    // 신성 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '정화된 독소', '축복받은 망치', '천상의 보호막', '신의 은총',
        '희생의 오라', '보호의 오라', '신성한 목적', '평화의 오라'
      ],
      specTree: [
        '빛의 신호탄', '신성 충격', '응보의 격노', '신성한 복수자',
        '미덕의 신호탄', '빛의 미광', '영광의 언어', '새벽의 빛',
        '신성한 종', '오라 숙련', '빛의 주입', '신성한 은총'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'critical', // 30% 목표
      3: 'haste', // 15% 목표
      4: 'mastery', // 가까운 거리 힐 보너스
      5: 'versatility'
    };

    // 힐링 우선순위
    this.rotationPriority = [
      { skill: 'holy_shock', condition: 'cooldown.ready' },
      { skill: 'word_of_glory', condition: 'holy_power >= 3 && ally.health_pct <= 60' },
      { skill: 'light_of_dawn', condition: 'holy_power >= 3 && injured_allies >= 3' },
      { skill: 'flash_of_light', condition: 'ally.health_pct <= 40' },
      { skill: 'holy_light', condition: 'ally.health_pct <= 80' },
      { skill: 'beacon_of_light', condition: '!beacon.up' },
      { skill: 'judgement', condition: 'mana_pct >= 70' },
      { skill: 'consecration', condition: 'enemy.melee_range' }
    ];

    // 신성 특화 가중치
    this.learningWeights = {
      dps: 0.05, // DPS는 낮은 우선순위
      rotation: 0.35, // 힐링 우선순위
      resource: 0.30, // 마나 관리가 핵심
      survival: 0.30 // 팀 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetHPS: 5500000, // 5.5M HPS
      targetCPM: 45, // 높은 APM 힐러
      beacon_uptime: 98, // 신호탄 유지율
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  // 신성 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 빛의 신호탄 유지율
      beaconUptime: combatLog.buffUptimes?.beacon_of_light || 0,

      // 신성 충격 사용률
      holyShockUsage: this.calculateHolyShockUsage(combatLog),

      // 응보의 격노 효율
      avengingWrathEfficiency: this.calculateAWEfficiency(combatLog),

      // 신성한 힘 활용률
      holyPowerUsage: this.calculateHolyPowerUsage(combatLog),

      // 신성한 목적 발동률
      divinePurposeProcs: combatLog.procs?.divine_purpose || 0,

      // 빛의 주입 발동률
      infusionOfLightProcs: combatLog.procs?.infusion_of_light || 0,

      // 오버힐률
      overhealingRate: combatLog.overhealing || 0,

      // 마나 효율
      manaEfficiency: this.calculateManaEfficiency(combatLog),

      // 응급 힐링 반응 속도
      emergencyResponse: this.calculateEmergencyResponse(combatLog),

      // 미덕의 신호탄 활용
      beaconOfVirtueUsage: combatLog.skills?.filter(s => s.name === 'beacon_of_virtue').length || 0
    };
  }

  // 신성 충격 사용률 계산
  calculateHolyShockUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const holyShocks = combatLog.skills.filter(s => s.name === 'holy_shock');
    const maxPossible = Math.floor(combatLog.duration / 7.5) + 1; // 7.5초 쿨다운

    return (holyShocks.length / maxPossible) * 100;
  }

  // 응보의 격노 효율 계산
  calculateAWEfficiency(combatLog) {
    if (!combatLog.buffs?.avenging_wrath) return 0;

    const awUses = combatLog.buffs.avenging_wrath.uses || 0;
    const awUptime = combatLog.buffUptimes?.avenging_wrath || 0;

    // 응보의 격노 동안의 힐링 증가량
    return awUptime > 0 ? Math.min(100, awUptime * 2) : 0;
  }

  // 신성한 힘 활용률 계산
  calculateHolyPowerUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const spenders = ['word_of_glory', 'light_of_dawn', 'shield_of_vengeance'];
    const spenderUses = combatLog.skills.filter(s => spenders.includes(s.name)).length;
    const totalHolyPowerGenerated = this.estimateHolyPowerGeneration(combatLog);

    return totalHolyPowerGenerated > 0
      ? Math.min(100, (spenderUses * 3 / totalHolyPowerGenerated) * 100)
      : 0;
  }

  // 신성한 힘 생성 예측
  estimateHolyPowerGeneration(combatLog) {
    if (!combatLog.skills) return 0;

    const holyShocks = combatLog.skills.filter(s => s.name === 'holy_shock').length;
    const judgments = combatLog.skills.filter(s => s.name === 'judgment').length;
    const divineTolls = combatLog.skills.filter(s => s.name === 'divine_toll').length;

    return holyShocks + judgments + (divineTolls * 5);
  }

  // 마나 효율 계산
  calculateManaEfficiency(combatLog) {
    if (!combatLog.healing || !combatLog.manaSpent) return 100;

    const healingPerMana = combatLog.healing / combatLog.manaSpent;
    const optimalRatio = 50; // 마나당 50의 힐링이 기준

    return Math.min(100, (healingPerMana / optimalRatio) * 100);
  }

  // 응급 힐링 반응 속도 계산
  calculateEmergencyResponse(combatLog) {
    if (!combatLog.emergencyHeals) return 100;

    const fastResponses = combatLog.emergencyHeals.filter(h => h.responseTime < 1.5).length;
    return (fastResponses / combatLog.emergencyHeals.length) * 100;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.4; // 신성은 높은 복잡도 (마나 관리 + 힐링 우선순위)
  }

  // 힐링 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 신성한 힘 체크
    if (currentState.holy_power >= 3) {
      if (currentState.injured_allies >= 3) {
        advice.push('새벽의 빛으로 광역 힐');
      } else {
        advice.push('영광의 언어로 단일 힐');
      }
    }

    // 신성 충격 쿨다운
    if (currentState.cooldowns?.holy_shock?.ready) {
      advice.push('신성 충격 즉시 사용!');
    }

    // 마나 관리
    if (currentState.mana_percent < 30) {
      advice.push('마나 보존: 효율적인 스킬만 사용');
    }

    // 빛의 신호탄
    if (!currentState.buffs?.beacon_of_light) {
      advice.push('빛의 신호탄 설치 필요');
    }

    // 응급 상황
    const criticalAllies = currentState.allies?.filter(a => a.health_pct < 30).length || 0;
    if (criticalAllies > 0) {
      advice.push(`응급: ${criticalAllies}명 위험! 빛의 섬광`);
    }

    // 빛의 주입 프록
    if (currentState.buffs?.infusion_of_light) {
      advice.push('빛의 주입: 빛의 섬광 즉시시전');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 힐링 패턴 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.mana_percent < 20) {
      advice.push('위험: 마나 고갈 임박! 심판으로 마나 회복');
    } else if (currentState.mana_percent < 40) {
      advice.push('마나 절약: 효율적 힐링 스킬 사용');
    } else if (currentState.mana_percent > 80) {
      advice.push('마나 여유: 적극적 힐링 가능');
    }

    return advice.length > 0 ? advice.join(', ') : '마나 관리 양호';
  }

  // 실시간 전략 생성
  async generateRealtimeStrategy(encounter, phase) {
    const strategy = {
      immediate: [],
      upcoming: [],
      warnings: [],
      priorities: []
    };

    // 페이즈별 전략
    if (phase === 'pull') {
      strategy.immediate = [
        '빛의 신호탄 설치',
        '신성 충격 선시전',
        '응보의 격노 준비',
        '마나 100% 확인'
      ];
    } else if (phase === 'high_damage') {
      strategy.priorities = [
        '생존이 최우선',
        '신성 충격 쿨마다',
        '영광의 언어 적극 사용',
        '응보의 격노 + 오라 숙련'
      ];
    } else if (phase === 'mana_conservation') {
      strategy.priorities = [
        '마나 효율 극대화',
        '심판으로 마나 회복',
        '오버힐 최소화',
        '신성한 빛 위주 사용'
      ];
    } else {
      strategy.priorities = [
        '신성 충격 쿨마다',
        '빛의 신호탄 유지',
        '신성한 힘 적극 활용',
        '팀 체력 80% 유지'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('고데미지 페이즈: 응보의 격노 + 오라 숙련 준비');
      strategy.upcoming.push('분산 페이즈: 빛의 미광으로 다중 힐링');
    }

    return strategy;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        hps: currentState.hps,
        mana_percent: currentState.mana_percent
      },
      predicted: {
        hps: prediction.predictedHPS || (prediction.predictedDPS * 2.5), // 힐러용 변환
        potential: (prediction.predictedHPS || (prediction.predictedDPS * 2.5)) - currentState.hps
      },
      improvements: []
    };

    // 마나 관리
    if (prediction.resourceScore < 85) {
      analysis.improvements.push({
        area: 'mana',
        message: '마나 효율 개선 필요: 심판 활용 증가',
        impact: 'high'
      });
    }

    // 힐링 효율
    if (prediction.rotationScore < 80) {
      analysis.improvements.push({
        area: 'healing',
        message: '신성 충격 사용률 증가 및 신성한 힘 활용 개선',
        impact: 'high'
      });
    }

    // 생존력
    if (prediction.survivalScore < 90) {
      analysis.improvements.push({
        area: 'survival',
        message: '팀 생존력 개선: 예방적 힐링 증가',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      'cooldown.ready': true,
      'holy_power >= 3': gameState.holy_power >= 3,
      'ally.health_pct <= 60': gameState.injured_allies >= 1,
      'ally.health_pct <= 40': gameState.critical_allies >= 1,
      'ally.health_pct <= 80': gameState.damaged_allies >= 1,
      'injured_allies >= 3': gameState.injured_allies >= 3,
      '!beacon.up': !gameState.buffs?.beacon_of_light,
      'mana_pct >= 70': gameState.mana_percent >= 70,
      'enemy.melee_range': gameState.enemy_distance <= 5
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 초기화
  async initialize() {
    console.log('✨ 신성 성기사 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 신성 성기사 신규 모델 생성');
    }

    console.log('✅ 신성 성기사 AI 준비 완료');
  }
}

export default HolyPaladinAI;