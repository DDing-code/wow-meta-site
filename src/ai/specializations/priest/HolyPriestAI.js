// 사제 신성 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class HolyPriestAI extends SpecializationAI {
  constructor() {
    super('priest', 'holy');

    // 신성 사제 특성
    this.specializationTraits = {
      role: 'healer',
      resource: 'mana',
      primaryStat: 'intellect',
      armorType: 'cloth'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 신성 사제 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'holy_word_serenity', // 신성한 권능: 평온
        'holy_word_sanctify', // 신성한 권능: 신성화
        'holy_word_chastise', // 신성한 권능: 징벌
        'renew', // 소생
        'prayer_of_mending' // 치유의 기원
      ],
      spender: [
        'heal', // 치유
        'greater_heal', // 상급 치유
        'flash_heal', // 즉시 치유
        'prayer_of_healing', // 치유의 기도
        'circle_of_healing' // 치유의 원
      ],
      cooldowns: [
        { name: 'apotheosis', cooldown: 180 }, // 신격화
        { name: 'divine_hymn', cooldown: 300 }, // 신성한 찬송가
        { name: 'guardian_spirit', cooldown: 180 }, // 수호 영혼
        { name: 'holy_word_salvation', cooldown: 720 }, // 신성한 권능: 구원
        { name: 'symbol_of_hope', cooldown: 300 } // 희망의 상징
      ],
      buffs: [
        'renew', // 소생
        'prayer_of_mending', // 치유의 기원
        'guardian_spirit', // 수호 영혼
        'apotheosis', // 신격화
        'surge_of_light', // 빛의 쇄도
        'benediction' // 축복
      ],
      debuffs: [
        'holy_fire', // 신성한 불꽃
        'shadow_word_pain' // 어둠의 권능: 고통
      ],
      procs: [
        'surge_of_light', // 빛의 쇄도
        'benediction', // 축복
        'healing_light', // 치유의 빛
        'divine_insight' // 신성한 통찰력
      ]
    };

    // 신성 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '정화', '분산', '영혼의 통찰력', '정신적 민첩성',
        '천사의 깃털', '질량 분산', '영적 치유', '정신 지배'
      ],
      specTree: [
        '신성한 권능: 평온', '신성한 권능: 신성화', '신격화', '수호 영혼',
        '신성한 찬송가', '빛의 쇄도', '축복', '치유의 원',
        '신성한 권능: 구원', '희망의 상징', '치유의 빛', '신성한 통찰력'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'mastery', // 에코 오브 라이트
      3: 'haste', // 20% 목표
      4: 'critical', // 20% 목표
      5: 'versatility'
    };

    // 힐링 우선순위
    this.rotationPriority = [
      { skill: 'holy_word_serenity', condition: 'cooldown.ready && ally.health_pct <= 50' },
      { skill: 'holy_word_sanctify', condition: 'cooldown.ready && injured_allies >= 3' },
      { skill: 'renew', condition: '!buff.renew.up && ally.health_pct <= 90' },
      { skill: 'prayer_of_mending', condition: '!buff.pom.up' },
      { skill: 'flash_heal', condition: 'ally.health_pct <= 40' },
      { skill: 'greater_heal', condition: 'ally.health_pct <= 70' },
      { skill: 'prayer_of_healing', condition: 'injured_allies >= 3' },
      { skill: 'heal', condition: 'ally.health_pct <= 85' }
    ];

    // 신성 특화 가중치
    this.learningWeights = {
      dps: 0.05, // DPS는 매우 낮은 우선순위
      rotation: 0.40, // 신성한 권능 관리
      resource: 0.30, // 마나 관리
      survival: 0.25 // 팀 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetHPS: 5800000, // 5.8M HPS
      targetCPM: 40, // 중간 APM
      renew_uptime: 95, // 소생 유지율
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  // 신성 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 소생 유지율
      renewUptime: combatLog.buffUptimes?.renew || 0,

      // 신성한 권능 사용률
      holyWordUsage: this.calculateHolyWordUsage(combatLog),

      // 에코 오브 라이트 효율
      echoOfLightEfficiency: this.calculateEchoEfficiency(combatLog),

      // 치유의 기원 점프 효율
      prayerOfMendingEfficiency: this.calculatePOMEfficiency(combatLog),

      // 빛의 쇄도 발동률
      surgeOfLightProcs: combatLog.procs?.surge_of_light || 0,

      // 축복 발동률
      benedictionProcs: combatLog.procs?.benediction || 0,

      // 신격화 효율
      apotheosisEfficiency: this.calculateApotheosisEfficiency(combatLog),

      // 오버힐률
      overhealingRate: combatLog.overhealing || 0,

      // 마나 효율
      manaEfficiency: this.calculateManaEfficiency(combatLog),

      // 응급 반응 속도
      emergencyResponse: this.calculateEmergencyResponse(combatLog)
    };
  }

  // 신성한 권능 사용률 계산
  calculateHolyWordUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const holyWords = ['holy_word_serenity', 'holy_word_sanctify', 'holy_word_chastise'];
    const holyWordCasts = combatLog.skills.filter(s => holyWords.includes(s.name)).length;

    // 쿨다운 감소를 고려한 이상적 사용 횟수 추정
    const estimatedMaxUses = Math.floor(combatLog.duration / 45) * 3; // 평균 쿨다운

    return estimatedMaxUses > 0 ? (holyWordCasts / estimatedMaxUses) * 100 : 0;
  }

  // 에코 오브 라이트 효율 계산
  calculateEchoEfficiency(combatLog) {
    if (!combatLog.healing?.echo_of_light) return 0;

    const totalHealing = combatLog.healing.total || 0;
    const echoHealing = combatLog.healing.echo_of_light || 0;

    // 에코는 총 힐링의 20-30%가 이상적
    const echoPercentage = totalHealing > 0 ? (echoHealing / totalHealing) * 100 : 0;
    return Math.min(100, (echoPercentage / 25) * 100);
  }

  // 치유의 기원 효율 계산
  calculatePOMEfficiency(combatLog) {
    if (!combatLog.spells?.prayer_of_mending) return 0;

    const pomCasts = combatLog.spells.prayer_of_mending.casts || 0;
    const pomJumps = combatLog.spells.prayer_of_mending.jumps || 0;

    // 평균 4-5번 점프가 이상적
    return pomCasts > 0 ? Math.min(100, (pomJumps / (pomCasts * 4.5)) * 100) : 0;
  }

  // 신격화 효율 계산
  calculateApotheosisEfficiency(combatLog) {
    if (!combatLog.buffs?.apotheosis) return 0;

    const apotheosisUses = combatLog.buffs.apotheosis.uses || 0;
    const healingDuringApotheosis = combatLog.buffs.apotheosis.healing || 0;
    const totalHealing = combatLog.healing.total || 0;

    if (apotheosisUses === 0 || totalHealing === 0) return 0;

    // 신격화 동안의 힐링 비율
    const apotheosisHealingRatio = (healingDuringApotheosis / totalHealing) * 100;
    return Math.min(100, apotheosisHealingRatio * 3); // 3분의 1 정도가 이상적
  }

  // 마나 효율 계산
  calculateManaEfficiency(combatLog) {
    if (!combatLog.healing || !combatLog.manaSpent) return 100;

    const healingPerMana = combatLog.healing.total / combatLog.manaSpent;
    const optimalRatio = 45; // 마나당 45의 힐링이 기준

    return Math.min(100, (healingPerMana / optimalRatio) * 100);
  }

  // 응급 반응 속도 계산
  calculateEmergencyResponse(combatLog) {
    if (!combatLog.emergencyHeals) return 100;

    const fastResponses = combatLog.emergencyHeals.filter(h => h.responseTime < 2.0).length;
    return (fastResponses / combatLog.emergencyHeals.length) * 100;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.2; // 신성은 중간 복잡도 (전통적인 힐러)
  }

  // 힐링 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 신성한 권능 쿨다운 체크
    if (currentState.cooldowns?.holy_word_serenity?.ready && currentState.critical_allies >= 1) {
      advice.push('신성한 권능: 평온 즉시 사용!');
    }

    if (currentState.cooldowns?.holy_word_sanctify?.ready && currentState.injured_allies >= 3) {
      advice.push('신성한 권능: 신성화 광역 힐!');
    }

    // 소생 유지
    const renewMissing = currentState.allies?.filter(a => !a.buffs?.renew && a.health_pct <= 90).length || 0;
    if (renewMissing > 0) {
      advice.push(`소생 ${renewMissing}명 누락`);
    }

    // 치유의 기원
    if (!currentState.buffs?.prayer_of_mending) {
      advice.push('치유의 기원 재시전 필요');
    }

    // 빛의 쇄도 프록
    if (currentState.buffs?.surge_of_light) {
      advice.push('빛의 쇄도: 무료 즉시 치유');
    }

    // 축복 프록
    if (currentState.buffs?.benediction) {
      advice.push('축복: 강화된 치유 스킬');
    }

    // 마나 관리
    if (currentState.mana_percent < 25) {
      advice.push('마나 위험: 효율적 힐링만');
    }

    // 응급 상황
    const criticalAllies = currentState.allies?.filter(a => a.health_pct < 25).length || 0;
    if (criticalAllies > 0) {
      advice.push(`응급: ${criticalAllies}명 위험! 즉시 치유`);
    }

    return advice.length > 0 ? advice.join(', ') : '현재 힐링 패턴 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.mana_percent < 20) {
      advice.push('위험: 마나 고갈 임박! 희망의 상징 고려');
    } else if (currentState.mana_percent < 40) {
      advice.push('마나 절약: 효율적 힐링 위주');
    } else if (currentState.mana_percent > 85) {
      advice.push('마나 여유: 예방적 힐링 가능');
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
        '모든 대상에 소생 적용',
        '치유의 기원 시전',
        '신성한 권능 준비',
        '마나 100% 확인'
      ];
    } else if (phase === 'high_damage') {
      strategy.priorities = [
        '신격화 활성화',
        '신성한 권능 적극 사용',
        '수호 영혼 준비',
        '신성한 찬송가 고려'
      ];
    } else if (phase === 'mana_conservation') {
      strategy.priorities = [
        '소생 우선 유지',
        '치유의 기원 활용',
        '빛의 쇄도 극대화',
        '희망의 상징 사용'
      ];
    } else {
      strategy.priorities = [
        '소생 95% 유지',
        '신성한 권능 쿨마다',
        '치유의 기원 유지',
        '팀 체력 85% 유지'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('고데미지 페이즈: 신격화 + 신성한 권능 준비');
      strategy.upcoming.push('분산 페이즈: 소생으로 지속 힐링');
    }

    return strategy;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        hps: currentState.hps,
        mana_percent: currentState.mana_percent,
        renew_uptime: currentState.renew_uptime
      },
      predicted: {
        hps: prediction.predictedHPS || (prediction.predictedDPS * 3.0),
        potential: (prediction.predictedHPS || (prediction.predictedDPS * 3.0)) - currentState.hps
      },
      improvements: []
    };

    // 소생 관리
    if (currentState.renew_uptime < 90) {
      analysis.improvements.push({
        area: 'renew',
        message: '소생 유지율 개선 필요: 모든 대상에 지속 적용',
        impact: 'high'
      });
    }

    // 신성한 권능 사용
    if (prediction.rotationScore < 85) {
      analysis.improvements.push({
        area: 'holy_words',
        message: '신성한 권능 사용률 증가 및 쿨다운 감소 활용',
        impact: 'high'
      });
    }

    // 마나 관리
    if (prediction.resourceScore < 85) {
      analysis.improvements.push({
        area: 'mana',
        message: '마나 효율 개선: 소생과 기원 활용 증가',
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
      'ally.health_pct <= 50': gameState.critical_allies >= 1,
      'ally.health_pct <= 40': gameState.critical_allies >= 1,
      'ally.health_pct <= 70': gameState.damaged_allies >= 1,
      'ally.health_pct <= 85': gameState.damaged_allies >= 1,
      'ally.health_pct <= 90': gameState.damaged_allies >= 1,
      'injured_allies >= 3': gameState.injured_allies >= 3,
      '!buff.renew.up': true, // 간소화
      '!buff.pom.up': !gameState.buffs?.prayer_of_mending
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 초기화
  async initialize() {
    console.log('🌸 신성 사제 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 신성 사제 신규 모델 생성');
    }

    console.log('✅ 신성 사제 AI 준비 완료');
  }
}

export default HolyPriestAI;