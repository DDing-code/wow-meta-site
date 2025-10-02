// 주술사 복원 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class RestorationShamanAI extends SpecializationAI {
  constructor() {
    super('shaman', 'restoration');

    // 복원 주술사 특성
    this.specializationTraits = {
      role: 'healer',
      resource: 'mana',
      primaryStat: 'intellect',
      armorType: 'mail'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 복원 주술사 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'healing_stream_totem', // 치유의 샘 토템
        'cloudburst_totem', // 구름폭발 토템
        'healing_tide_totem', // 치유의 파도 토템
        'riptide', // 성난 파도
        'earthen_wall_totem' // 대지 벽 토템
      ],
      spender: [
        'healing_wave', // 치유의 물결
        'healing_surge', // 치유의 쇄도
        'chain_heal', // 연쇄 치유
        'downpour', // 폭우
        'wellspring' // 샘
      ],
      cooldowns: [
        { name: 'ascendance', cooldown: 180 }, // 승천
        { name: 'spirit_link_totem', cooldown: 180 }, // 정령 연결 토템
        { name: 'ancestral_guidance', cooldown: 120 }, // 조상의 지도
        { name: 'healing_tide_totem', cooldown: 180 }, // 치유의 파도 토템
        { name: 'wind_rush_totem', cooldown: 120 } // 돌풍 토템
      ],
      buffs: [
        'riptide', // 성난 파도
        'tidal_waves', // 파도의 물결
        'ancestral_guidance', // 조상의 지도
        'undulation', // 물결
        'flash_flood', // 급류
        'deeply_rooted_elements' // 깊이 뿌리박힌 원소
      ],
      debuffs: [
        'flame_shock', // 화염 충격
        'frost_shock' // 냉기 충격
      ],
      procs: [
        'tidal_waves', // 파도의 물결
        'undulation', // 물결
        'deeply_rooted_elements', // 깊이 뿌리박힌 원소
        'lashing_flames' // 채찍 화염
      ]
    };

    // 복원 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '치유의 샘 토템', '돌풍 토템', '정령 연결 토템', '조상의 지도',
        '화염 충격', '대지 정령 토템', '독 정화 토템', '떨림 토템'
      ],
      specTree: [
        '성난 파도', '파도의 물결', '승천', '구름폭발 토템',
        '치유의 파도 토템', '물결', '급류', '깊이 뿌리박힌 원소',
        '폭우', '샘', '대지 벽 토템', '원시 파도'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'critical', // 30% 목표 (파도의 물결)
      3: 'haste', // 20% 목표
      4: 'mastery', // 깊은 치유
      5: 'versatility'
    };

    // 힐링 우선순위
    this.rotationPriority = [
      { skill: 'riptide', condition: 'cooldown.ready && !buff.riptide.up' },
      { skill: 'healing_surge', condition: 'ally.health_pct <= 40 && buff.tidal_waves.up' },
      { skill: 'chain_heal', condition: 'injured_allies >= 3' },
      { skill: 'healing_wave', condition: 'ally.health_pct <= 70 && buff.tidal_waves.up' },
      { skill: 'wellspring', condition: 'injured_allies >= 4' },
      { skill: 'downpour', condition: 'injured_allies >= 5' },
      { skill: 'healing_stream_totem', condition: '!totem.healing_stream.up' },
      { skill: 'flame_shock', condition: 'mana_pct >= 80' }
    ];

    // 복원 특화 가중치
    this.learningWeights = {
      dps: 0.10, // DPS는 낮은 우선순위
      rotation: 0.30, // 토템 관리와 파도의 물결
      resource: 0.30, // 마나 관리
      survival: 0.30 // 팀 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetHPS: 5600000, // 5.6M HPS
      targetCPM: 40, // 중간 APM
      riptide_uptime: 85, // 성난 파도 유지율
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  // 복원 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 성난 파도 유지율
      riptideUptime: combatLog.buffUptimes?.riptide || 0,

      // 파도의 물결 활용률
      tidalWavesUsage: this.calculateTidalWavesUsage(combatLog),

      // 연쇄 치유 효율
      chainHealEfficiency: this.calculateChainHealEfficiency(combatLog),

      // 토템 관리 효율
      totemManagement: this.calculateTotemManagement(combatLog),

      // 구름폭발 토템 효율
      cloudburstEfficiency: this.calculateCloudburstEfficiency(combatLog),

      // 깊이 뿌리박힌 원소 발동률
      deeplyRootedProcs: combatLog.procs?.deeply_rooted_elements || 0,

      // 물결 발동률
      undulationProcs: combatLog.procs?.undulation || 0,

      // 마나 효율
      manaEfficiency: this.calculateManaEfficiency(combatLog),

      // 치유의 파도 토템 효율
      healingTideEfficiency: this.calculateHealingTideEfficiency(combatLog),

      // 승천 효율
      ascendanceEfficiency: this.calculateAscendanceEfficiency(combatLog)
    };
  }

  // 파도의 물결 활용률 계산
  calculateTidalWavesUsage(combatLog) {
    if (!combatLog.buffs?.tidal_waves) return 0;

    const tidalWavesProcs = combatLog.buffs.tidal_waves.procs || 0;
    const tidalWavesUsed = combatLog.buffs.tidal_waves.used || 0;

    return tidalWavesProcs > 0 ? (tidalWavesUsed / tidalWavesProcs) * 100 : 0;
  }

  // 연쇄 치유 효율 계산
  calculateChainHealEfficiency(combatLog) {
    if (!combatLog.spells?.chain_heal) return 0;

    const chainHeals = combatLog.spells.chain_heal.casts || 0;
    const totalTargetsHit = combatLog.spells.chain_heal.targets_hit || 0;

    // 평균 3-4명을 치유하는 것이 이상적
    return chainHeals > 0 ? Math.min(100, (totalTargetsHit / (chainHeals * 3.5)) * 100) : 0;
  }

  // 토템 관리 효율 계산
  calculateTotemManagement(combatLog) {
    if (!combatLog.totems) return 0;

    const importantTotems = ['healing_stream_totem', 'cloudburst_totem'];
    let totalUptime = 0;

    importantTotems.forEach(totem => {
      const uptime = combatLog.totems[totem]?.uptime || 0;
      totalUptime += uptime;
    });

    return totalUptime / importantTotems.length;
  }

  // 구름폭발 토템 효율 계산
  calculateCloudburstEfficiency(combatLog) {
    if (!combatLog.totems?.cloudburst_totem) return 0;

    const cloudburstUses = combatLog.totems.cloudburst_totem.uses || 0;
    const cloudburstHealing = combatLog.totems.cloudburst_totem.healing || 0;
    const totalHealing = combatLog.healing.total || 0;

    if (cloudburstUses === 0 || totalHealing === 0) return 0;

    // 구름폭발이 총 힐링에서 차지하는 비율
    return Math.min(100, (cloudburstHealing / totalHealing) * 100 * 10);
  }

  // 마나 효율 계산
  calculateManaEfficiency(combatLog) {
    if (!combatLog.healing || !combatLog.manaSpent) return 100;

    const healingPerMana = combatLog.healing.total / combatLog.manaSpent;
    const optimalRatio = 55; // 마나당 55의 힐링이 기준

    return Math.min(100, (healingPerMana / optimalRatio) * 100);
  }

  // 치유의 파도 토템 효율 계산
  calculateHealingTideEfficiency(combatLog) {
    if (!combatLog.totems?.healing_tide_totem) return 0;

    const tideUses = combatLog.totems.healing_tide_totem.uses || 0;
    const tideHealing = combatLog.totems.healing_tide_totem.healing || 0;
    const totalHealing = combatLog.healing.total || 0;

    if (tideUses === 0 || totalHealing === 0) return 0;

    return Math.min(100, (tideHealing / totalHealing) * 100 * 5);
  }

  // 승천 효율 계산
  calculateAscendanceEfficiency(combatLog) {
    if (!combatLog.buffs?.ascendance) return 0;

    const ascendanceUses = combatLog.buffs.ascendance.uses || 0;
    const healingDuringAscendance = combatLog.buffs.ascendance.healing || 0;
    const totalHealing = combatLog.healing.total || 0;

    if (ascendanceUses === 0 || totalHealing === 0) return 0;

    // 승천 동안의 힐링 비율
    return Math.min(100, (healingDuringAscendance / totalHealing) * 100 * 3);
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.3; // 복원은 중상 복잡도 (토템 관리 + 마나 관리)
  }

  // 힐링 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 성난 파도 쿨다운
    if (currentState.cooldowns?.riptide?.ready) {
      advice.push('성난 파도 즉시 사용!');
    }

    // 파도의 물결 활용
    if (currentState.buffs?.tidal_waves) {
      const criticalAllies = currentState.allies?.filter(a => a.health_pct < 40).length || 0;
      if (criticalAllies > 0) {
        advice.push('파도의 물결: 치유의 쇄도');
      } else {
        advice.push('파도의 물결: 치유의 물결');
      }
    }

    // 토템 관리
    if (!currentState.totems?.healing_stream_totem) {
      advice.push('치유의 샘 토템 설치');
    }

    // 물결 프록
    if (currentState.buffs?.undulation) {
      advice.push('물결: 다음 치유 강화');
    }

    // 깊이 뿌리박힌 원소
    if (currentState.buffs?.deeply_rooted_elements) {
      advice.push('깊이 뿌리박힌 원소: 승천 활성화');
    }

    // 마나 관리
    if (currentState.mana_percent < 25) {
      advice.push('마나 위험: 효율적 힐링만');
    }

    // 광역 힐링
    if (currentState.injured_allies >= 4) {
      advice.push('광역 데미지: 연쇄 치유/구름폭발');
    }

    // 응급 상황
    const criticalAllies = currentState.allies?.filter(a => a.health_pct < 25).length || 0;
    if (criticalAllies > 0) {
      advice.push(`응급: ${criticalAllies}명 위험! 치유의 쇄도`);
    }

    return advice.length > 0 ? advice.join(', ') : '현재 힐링 패턴 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.mana_percent < 20) {
      advice.push('위험: 마나 고갈 임박! 토템 힐링 위주');
    } else if (currentState.mana_percent < 40) {
      advice.push('마나 절약: 치유의 물결 위주 사용');
    } else if (currentState.mana_percent > 85) {
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
        '치유의 샘 토템 설치',
        '성난 파도 적용',
        '구름폭발 토템 준비',
        '마나 100% 확인'
      ];
    } else if (phase === 'high_damage') {
      strategy.priorities = [
        '승천 활성화',
        '치유의 파도 토템',
        '정령 연결 토템',
        '연쇄 치유 적극 사용'
      ];
    } else if (phase === 'mana_conservation') {
      strategy.priorities = [
        '토템 힐링 위주',
        '파도의 물결 극대화',
        '치유의 물결 위주',
        '화염 충격으로 마나 절약'
      ];
    } else {
      strategy.priorities = [
        '성난 파도 유지',
        '파도의 물결 활용',
        '토템 지속 관리',
        '팀 체력 80% 유지'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('고데미지 페이즈: 승천 + 치유의 파도 토템 준비');
      strategy.upcoming.push('분산 페이즈: 성난 파도로 지속 힐링');
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
        riptide_uptime: currentState.riptide_uptime
      },
      predicted: {
        hps: prediction.predictedHPS || (prediction.predictedDPS * 2.8),
        potential: (prediction.predictedHPS || (prediction.predictedDPS * 2.8)) - currentState.hps
      },
      improvements: []
    };

    // 성난 파도 관리
    if (currentState.riptide_uptime < 80) {
      analysis.improvements.push({
        area: 'riptide',
        message: '성난 파도 유지율 개선: 쿨다운마다 사용',
        impact: 'high'
      });
    }

    // 토템 관리
    if (prediction.rotationScore < 80) {
      analysis.improvements.push({
        area: 'totems',
        message: '토템 관리 개선: 치유의 샘과 구름폭발 활용',
        impact: 'high'
      });
    }

    // 마나 효율
    if (prediction.resourceScore < 85) {
      analysis.improvements.push({
        area: 'mana',
        message: '마나 효율 개선: 파도의 물결 활용 증가',
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
      '!buff.riptide.up': !gameState.buffs?.riptide,
      'ally.health_pct <= 40': gameState.critical_allies >= 1,
      'ally.health_pct <= 70': gameState.damaged_allies >= 1,
      'buff.tidal_waves.up': gameState.buffs?.tidal_waves,
      'injured_allies >= 3': gameState.injured_allies >= 3,
      'injured_allies >= 4': gameState.injured_allies >= 4,
      'injured_allies >= 5': gameState.injured_allies >= 5,
      '!totem.healing_stream.up': !gameState.totems?.healing_stream_totem,
      'mana_pct >= 80': gameState.mana_percent >= 80
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 초기화
  async initialize() {
    console.log('🌊 복원 주술사 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 복원 주술사 신규 모델 생성');
    }

    console.log('✅ 복원 주술사 AI 준비 완료');
  }
}

export default RestorationShamanAI;