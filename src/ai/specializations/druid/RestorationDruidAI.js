// 드루이드 복원 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class RestorationDruidAI extends SpecializationAI {
  constructor() {
    super('druid', 'restoration');

    // 복원 드루이드 특성
    this.specializationTraits = {
      role: 'healer',
      resource: 'mana',
      primaryStat: 'intellect',
      armorType: 'leather'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 복원 드루이드 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'rejuvenation', // 회복
        'wild_growth', // 야생 성장
        'lifebloom', // 생명꽃
        'cenarion_ward', // 세나리우스의 수호
        'grove_tending' // 숲 돌보기
      ],
      spender: [
        'regrowth', // 재생
        'healing_touch', // 치유의 손길
        'swiftmend', // 신속 치유
        'nature_s_swiftness', // 자연의 신속성
        'tranquility' // 평온
      ],
      cooldowns: [
        { name: 'incarnation', cooldown: 180 }, // 화신: 생명의 나무
        { name: 'tranquility', cooldown: 180 }, // 평온
        { name: 'convoke_the_spirits', cooldown: 120 }, // 정령 소환
        { name: 'nature_s_swiftness', cooldown: 60 }, // 자연의 신속성
        { name: 'flourish', cooldown: 60 } // 번영
      ],
      buffs: [
        'rejuvenation', // 회복
        'lifebloom', // 생명꽃
        'cenarion_ward', // 세나리우스의 수호
        'incarnation', // 화신: 생명의 나무
        'soul_of_the_forest', // 숲의 영혼
        'omen_of_clarity' // 명료한 징조
      ],
      debuffs: [
        'moonfire', // 달빛섬광
        'sunfire', // 태양섬광
        'adaptive_swarm' // 적응형 떼
      ],
      procs: [
        'omen_of_clarity', // 명료한 징조
        'soul_of_the_forest', // 숲의 영혼
        'abundance', // 풍요로움
        'swiftmend_ready' // 신속 치유 준비
      ]
    };

    // 복원 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '회복', '야생 성장', '생명꽃', '정령 소환',
        '자연의 신속성', '나무껍질', '태풍', '달빛섬광'
      ],
      specTree: [
        '신속 치유', '화신: 생명의 나무', '평온', '번영',
        '숲의 영혼', '명료한 징조', '풍요로움', '세나리우스의 수호',
        '적응형 떼', '포토신세시스', '숲 돌보기', '재앙의 씨앗'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'haste', // 25% 목표
      3: 'mastery', // 하모니
      4: 'critical', // 20% 목표
      5: 'versatility'
    };

    // 힐링 우선순위
    this.rotationPriority = [
      { skill: 'lifebloom', condition: '!buff.lifebloom.up' },
      { skill: 'rejuvenation', condition: '!buff.rejuv.up && ally.health_pct <= 90' },
      { skill: 'wild_growth', condition: 'injured_allies >= 4' },
      { skill: 'swiftmend', condition: 'ally.health_pct <= 50' },
      { skill: 'regrowth', condition: 'ally.health_pct <= 60 && (proc.abundance || proc.omen)' },
      { skill: 'healing_touch', condition: 'ally.health_pct <= 70' },
      { skill: 'cenarion_ward', condition: 'tank.health_pct <= 80' },
      { skill: 'moonfire', condition: 'mana_pct >= 80' }
    ];

    // 복원 특화 가중치
    this.learningWeights = {
      dps: 0.10, // DPS는 낮은 우선순위
      rotation: 0.40, // HoT 관리가 핵심
      resource: 0.25, // 마나 관리
      survival: 0.25 // 팀 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetHPS: 5700000, // 5.7M HPS
      targetCPM: 35, // 낮은 APM (HoT 힐러)
      hot_uptime: 90, // HoT 유지율
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  // 복원 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 회복 유지율
      rejuvenationUptime: combatLog.buffUptimes?.rejuvenation || 0,

      // 생명꽃 유지율
      lifebloomUptime: combatLog.buffUptimes?.lifebloom || 0,

      // 야생 성장 효율
      wildGrowthEfficiency: this.calculateWildGrowthEfficiency(combatLog),

      // 신속 치유 효율
      swiftmendEfficiency: this.calculateSwiftmendEfficiency(combatLog),

      // HoT 관리 효율
      hotManagement: this.calculateHotManagement(combatLog),

      // 하모니 마스터리 효율
      harmonyEfficiency: this.calculateHarmonyEfficiency(combatLog),

      // 명료한 징조 발동률
      omenOfClarityProcs: combatLog.procs?.omen_of_clarity || 0,

      // 숲의 영혼 발동률
      soulOfForestProcs: combatLog.procs?.soul_of_the_forest || 0,

      // 풍요로움 효율
      abundanceEfficiency: this.calculateAbundanceEfficiency(combatLog),

      // 마나 효율
      manaEfficiency: this.calculateManaEfficiency(combatLog)
    };
  }

  // 야생 성장 효율 계산
  calculateWildGrowthEfficiency(combatLog) {
    if (!combatLog.spells?.wild_growth) return 0;

    const wildGrowths = combatLog.spells.wild_growth.casts || 0;
    const totalTargetsHealed = combatLog.spells.wild_growth.targets_healed || 0;

    // 평균 5-6명을 치유하는 것이 이상적
    return wildGrowths > 0 ? Math.min(100, (totalTargetsHealed / (wildGrowths * 5.5)) * 100) : 0;
  }

  // 신속 치유 효율 계산
  calculateSwiftmendEfficiency(combatLog) {
    if (!combatLog.spells?.swiftmend) return 100;

    const swiftmends = combatLog.spells.swiftmend.casts || 0;
    const emergencyUses = combatLog.spells.swiftmend.emergency_uses || 0;

    // 응급 상황에서 사용하는 것이 이상적
    return swiftmends > 0 ? (emergencyUses / swiftmends) * 100 : 100;
  }

  // HoT 관리 효율 계산
  calculateHotManagement(combatLog) {
    if (!combatLog.hots) return 0;

    const totalHotHealing = combatLog.hots.totalHealing || 0;
    const totalHealing = combatLog.healing.total || 0;

    // HoT가 총 힐링의 60-80%를 차지하는 것이 이상적
    const hotPercentage = totalHealing > 0 ? (totalHotHealing / totalHealing) * 100 : 0;
    return Math.min(100, (hotPercentage / 70) * 100);
  }

  // 하모니 마스터리 효율 계산
  calculateHarmonyEfficiency(combatLog) {
    if (!combatLog.mastery?.harmony) return 0;

    const harmonyHealing = combatLog.mastery.harmony.healing || 0;
    const totalHealing = combatLog.healing.total || 0;

    // 하모니가 총 힐링의 15-25%를 차지하는 것이 이상적
    const harmonyPercentage = totalHealing > 0 ? (harmonyHealing / totalHealing) * 100 : 0;
    return Math.min(100, (harmonyPercentage / 20) * 100);
  }

  // 풍요로움 효율 계산
  calculateAbundanceEfficiency(combatLog) {
    if (!combatLog.procs?.abundance) return 0;

    const abundanceProcs = combatLog.procs.abundance.total || 0;
    const abundanceUsed = combatLog.procs.abundance.used || 0;

    return abundanceProcs > 0 ? (abundanceUsed / abundanceProcs) * 100 : 0;
  }

  // 마나 효율 계산
  calculateManaEfficiency(combatLog) {
    if (!combatLog.healing || !combatLog.manaSpent) return 100;

    const healingPerMana = combatLog.healing.total / combatLog.manaSpent;
    const optimalRatio = 60; // 마나당 60의 힐링이 기준

    return Math.min(100, (healingPerMana / optimalRatio) * 100);
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.3; // 복원은 중상 복잡도 (HoT 관리)
  }

  // 힐링 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 생명꽃 유지
    if (!currentState.buffs?.lifebloom) {
      advice.push('생명꽃 적용 필요!');
    }

    // 회복 누락 체크
    const rejuvMissing = currentState.allies?.filter(a =>
      !a.buffs?.rejuvenation && a.health_pct <= 90
    ).length || 0;
    if (rejuvMissing > 0) {
      advice.push(`회복 ${rejuvMissing}명 누락`);
    }

    // 야생 성장
    if (currentState.injured_allies >= 4 && currentState.cooldowns?.wild_growth?.ready) {
      advice.push('야생 성장으로 광역 힐링!');
    }

    // 명료한 징조 프록
    if (currentState.buffs?.omen_of_clarity) {
      advice.push('명료한 징조: 무료 회복 또는 생명꽃');
    }

    // 풍요로움 프록
    if (currentState.buffs?.abundance) {
      advice.push('풍요로움: 즉시시전 재생');
    }

    // 숲의 영혼
    if (currentState.buffs?.soul_of_the_forest) {
      advice.push('숲의 영혼: 강화된 야생 성장');
    }

    // 마나 관리
    if (currentState.mana_percent < 25) {
      advice.push('마나 위험: HoT 위주 힐링');
    }

    // 응급 상황
    const criticalAllies = currentState.allies?.filter(a => a.health_pct < 30).length || 0;
    if (criticalAllies > 0) {
      advice.push(`응급: ${criticalAllies}명 위험! 신속 치유`);
    }

    return advice.length > 0 ? advice.join(', ') : '현재 HoT 패턴 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.mana_percent < 20) {
      advice.push('위험: 마나 고갈 임박! HoT만 사용');
    } else if (currentState.mana_percent < 40) {
      advice.push('마나 절약: 명료한 징조 극대화');
    } else if (currentState.mana_percent > 85) {
      advice.push('마나 여유: 적극적 직접 힐링');
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
        '모든 대상에 회복 적용',
        '탱커에 생명꽃',
        '세나리우스의 수호 준비',
        '마나 100% 확인'
      ];
    } else if (phase === 'high_damage') {
      strategy.priorities = [
        '화신: 생명의 나무',
        '평온 사용',
        '번영으로 HoT 연장',
        '야생 성장 적극 사용'
      ];
    } else if (phase === 'mana_conservation') {
      strategy.priorities = [
        'HoT 위주 힐링',
        '명료한 징조 극대화',
        '풍요로움 프록 활용',
        '달빛섬광으로 마나 절약'
      ];
    } else {
      strategy.priorities = [
        '회복 90% 유지',
        '생명꽃 지속 관리',
        'HoT 70% 힐링 비율',
        '팀 체력 85% 유지'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('고데미지 페이즈: 화신 + 평온 준비');
      strategy.upcoming.push('분산 페이즈: 회복으로 지속 힐링');
    }

    return strategy;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        hps: currentState.hps,
        hot_uptime: (currentState.rejuv_uptime + currentState.lifebloom_uptime) / 2,
        mana_percent: currentState.mana_percent
      },
      predicted: {
        hps: prediction.predictedHPS || (prediction.predictedDPS * 2.9),
        potential: (prediction.predictedHPS || (prediction.predictedDPS * 2.9)) - currentState.hps
      },
      improvements: []
    };

    // HoT 관리
    if (currentState.rejuv_uptime < 85 || currentState.lifebloom_uptime < 90) {
      analysis.improvements.push({
        area: 'hots',
        message: 'HoT 유지율 개선: 회복과 생명꽃 지속 관리',
        impact: 'high'
      });
    }

    // 야생 성장 효율
    if (prediction.rotationScore < 80) {
      analysis.improvements.push({
        area: 'wild_growth',
        message: '야생 성장 효율 개선: 4명 이상 부상 시 사용',
        impact: 'high'
      });
    }

    // 마나 효율
    if (prediction.resourceScore < 85) {
      analysis.improvements.push({
        area: 'mana',
        message: '마나 효율 개선: 명료한 징조와 HoT 활용 증가',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      '!buff.lifebloom.up': !gameState.buffs?.lifebloom,
      '!buff.rejuv.up': !gameState.buffs?.rejuvenation,
      'ally.health_pct <= 90': gameState.damaged_allies >= 1,
      'ally.health_pct <= 50': gameState.critical_allies >= 1,
      'ally.health_pct <= 60': gameState.damaged_allies >= 1,
      'ally.health_pct <= 70': gameState.damaged_allies >= 1,
      'ally.health_pct <= 80': gameState.damaged_allies >= 1,
      'injured_allies >= 4': gameState.injured_allies >= 4,
      'tank.health_pct <= 80': gameState.tank_health_pct <= 80,
      'proc.abundance': gameState.buffs?.abundance,
      'proc.omen': gameState.buffs?.omen_of_clarity,
      'mana_pct >= 80': gameState.mana_percent >= 80
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 초기화
  async initialize() {
    console.log('🌿 복원 드루이드 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 복원 드루이드 신규 모델 생성');
    }

    console.log('✅ 복원 드루이드 AI 준비 완료');
  }
}

export default RestorationDruidAI;