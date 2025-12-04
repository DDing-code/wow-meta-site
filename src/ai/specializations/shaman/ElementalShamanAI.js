// 주술사 정기 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class ElementalShamanAI extends SpecializationAI {
  constructor() {
    super('shaman', 'elemental');

    // 정기 주술사 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'mana',
      secondaryResource: 'maelstrom',
      primaryStat: 'intellect',
      armorType: 'mail'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 정기 주술사 핵심 메커니즘
    this.coreMechanics = {
      builders: [
        'lightning_bolt', // 번개 화살
        'chain_lightning', // 연쇄 번개 (광역)
        'lava_burst', // 용암 폭발
        'frost_shock', // 냉기 충격
        'icefury', // 얼음격노
        'elemental_blast' // 정기 폭발
      ],
      spenders: [
        'earth_shock', // 대지 충격 (60 소용돌이)
        'earthquake', // 지진 (60 소용돌이, 광역)
        'elemental_blast' // 정기 폭발
      ],
      cooldowns: [
        { name: 'fire_elemental', cooldown: 150 }, // 불의 정령
        { name: 'storm_elemental', cooldown: 150 }, // 폭풍의 정령
        { name: 'stormkeeper', cooldown: 40 }, // 폭풍수호자
        { name: 'primordial_wave', cooldown: 45 }, // 원시의 파도
        { name: 'liquid_magma_totem', cooldown: 60 }, // 액체 마그마 토템
        { name: 'ascendance', cooldown: 180 } // 승천
      ],
      buffs: [
        'lava_surge', // 용암 쇄도 (즉시 용암 폭발)
        'master_of_the_elements', // 정령 지배
        'stormkeeper', // 폭풍수호자
        'icefury', // 얼음격노
        'elemental_equilibrium', // 정령 균형
        'power_of_the_maelstrom', // 소용돌이의 힘
        'surge_of_power' // 힘의 쇄도
      ],
      debuffs: [
        'flame_shock', // 화염 충격
        'lightning_rod', // 피뢰침
        'elemental_blast' // 정기 폭발
      ],
      procs: [
        'lava_surge', // 용암 쇄도
        'elemental_equilibrium', // 정령 균형
        'deeply_rooted_elements', // 깊이 뿌리내린 정령
        'power_of_the_maelstrom' // 소용돌이의 힘
      ]
    };

    // 정기 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '바람 걸음', '정령의 늑대', '치유의 급류', '우레',
        '정령 걸음', '자연의 수호자', '조상의 인도', '대지의 정령'
      ],
      specTree: [
        '불의 정령', '폭풍의 정령', '폭풍수호자', '원시의 파도',
        '용암 쇄도', '정령 지배', '얼음격노', '정기 폭발',
        '피뢰침', '힘의 쇄도', '깊이 뿌리내린 정령', '승천'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'haste', // 15-20% 목표
      3: 'critical', // 33% 목표 (정령 격노)
      4: 'versatility',
      5: 'mastery'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'flame_shock', condition: '!debuff.flame_shock.up || debuff.flame_shock.remains < 6' },
      { skill: 'fire_elemental', condition: 'cooldown.ready' },
      { skill: 'storm_elemental', condition: 'cooldown.ready && !pet.fire_elemental.active' },
      { skill: 'primordial_wave', condition: 'cooldown.ready' },
      { skill: 'stormkeeper', condition: 'cooldown.ready' },
      { skill: 'elemental_blast', condition: 'cooldown.ready && maelstrom < 70' },
      { skill: 'lava_burst', condition: 'buff.lava_surge.up || charges >= 1' },
      { skill: 'earth_shock', condition: 'maelstrom >= 60' },
      { skill: 'earthquake', condition: 'maelstrom >= 60 && spell_targets >= 3' },
      { skill: 'icefury', condition: 'cooldown.ready && maelstrom < 40' },
      { skill: 'frost_shock', condition: 'buff.icefury.up' },
      { skill: 'chain_lightning', condition: 'spell_targets >= 2' },
      { skill: 'lightning_bolt', condition: 'always' } // 필러
    ];

    // 정기 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS
      rotation: 0.25, // 화염 충격 관리가 핵심
      resource: 0.20, // 소용돌이 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7300000, // 7.3M DPS
      targetCPM: 45, // 중간 정도의 APM
      flame_shock_uptime: 98, // 화염 충격 유지율 98%+
      targetResourceEfficiency: 93
    };

    this.initialize();
  }

  // 정기 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 화염 충격 유지율
      flameShockUptime: combatLog.debuffUptimes?.flame_shock || 0,

      // 용암 쇄도 발동률
      lavaSurgeProcs: combatLog.procs?.lava_surge || 0,

      // 정령 지배 활용률
      masterOfElementsUsage: this.calculateMasterOfElementsUsage(combatLog),

      // 폭풍수호자 효율성
      stormkeeperEfficiency: this.calculateStormkeeperEfficiency(combatLog),

      // 소용돌이 낭비율
      maelstromWaste: combatLog.resourceWaste?.maelstrom || 0,

      // 정기 폭발 사용률
      elementalBlastUsage: this.calculateElementalBlastUsage(combatLog),

      // 원시의 파도 효율성
      primordialWaveEfficiency: this.calculatePrimordialWaveEfficiency(combatLog),

      // 정령 소환 타이밍
      elementalTiming: this.calculateElementalTiming(combatLog),

      // 얼음격노 활용률
      icefuryUsage: this.calculateIcefuryUsage(combatLog),

      // 평균 소용돌이
      averageMaelstrom: combatLog.averageResources?.maelstrom || 0
    };
  }

  // 정령 지배 활용률 계산
  calculateMasterOfElementsUsage(combatLog) {
    if (!combatLog.buffProcs) return 0;

    const moteProcs = combatLog.buffProcs.master_of_the_elements || 0;
    const moteUsed = combatLog.buffConsumed?.master_of_the_elements || 0;

    return moteProcs > 0 ? (moteUsed / moteProcs) * 100 : 0;
  }

  // 폭풍수호자 효율 계산
  calculateStormkeeperEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const stormkeepers = combatLog.skills.filter(s => s.name === 'stormkeeper');
    let totalEfficiency = 0;

    stormkeepers.forEach(sk => {
      // 폭풍수호자 후 사용된 즉시 번개/연쇄 번개
      const buffedCasts = sk.buffed_casts || 0;
      // 2개가 최대
      totalEfficiency += Math.min(100, (buffedCasts / 2) * 100);
    });

    return stormkeepers.length > 0
      ? totalEfficiency / stormkeepers.length
      : 0;
  }

  // 정기 폭발 사용률 계산
  calculateElementalBlastUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const elementalBlasts = combatLog.skills.filter(s => s.name === 'elemental_blast').length;
    const combatDuration = combatLog.duration || 1;

    // 정기 폭발은 12초 쿨다운
    const expectedCasts = Math.floor(combatDuration / 12) + 1;

    return Math.min(100, (elementalBlasts / expectedCasts) * 100);
  }

  // 원시의 파도 효율 계산
  calculatePrimordialWaveEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const primordialWaves = combatLog.skills.filter(s => s.name === 'primordial_wave');
    let totalEfficiency = 0;

    primordialWaves.forEach(pw => {
      // 원시의 파도가 화염 충격을 퍼뜨린 대상 수
      const targetsHit = pw.targets_hit || 1;
      // 5개가 이상적
      totalEfficiency += Math.min(100, (targetsHit / 5) * 100);
    });

    return primordialWaves.length > 0
      ? totalEfficiency / primordialWaves.length
      : 0;
  }

  // 정령 소환 타이밍 계산
  calculateElementalTiming(combatLog) {
    if (!combatLog.skills) return 100;

    const elementals = combatLog.skills.filter(s =>
      s.name === 'fire_elemental' || s.name === 'storm_elemental'
    );

    let goodTiming = 0;
    elementals.forEach(elem => {
      // 버프나 버스트 윈도우 중 소환
      if (elem.during_burst || elem.with_buffs) {
        goodTiming++;
      }
    });

    return elementals.length > 0
      ? (goodTiming / elementals.length) * 100
      : 100;
  }

  // 얼음격노 활용률 계산
  calculateIcefuryUsage(combatLog) {
    if (!combatLog.buffProcs) return 100;

    const icefuryProcs = combatLog.buffProcs.icefury || 0;
    const frostShocksUsed = combatLog.icefury_frost_shocks || 0;

    // 얼음격노당 4개의 냉기 충격 가능
    const expectedFrostShocks = icefuryProcs * 4;

    return expectedFrostShocks > 0
      ? Math.min(100, (frostShocksUsed / expectedFrostShocks) * 100)
      : 100;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.3; // 정기는 중간 복잡도
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 화염 충격 체크
    if (!currentState.debuffs?.flame_shock) {
      advice.push('화염 충격 적용 필요!');
    } else if (currentState.debuffs?.flame_shock?.remains < 6) {
      advice.push('화염 충격 갱신 필요!');
    }

    // 용암 쇄도 체크
    if (currentState.buffs?.lava_surge) {
      advice.push('용암 쇄도: 즉시 용암 폭발!');
    }

    // 소용돌이 체크
    if (currentState.maelstrom >= 60) {
      advice.push('대지 충격 사용!');
    } else if (currentState.maelstrom >= 90) {
      advice.push('소용돌이 초과 주의!');
    }

    // 폭풍수호자
    if (currentState.buffs?.stormkeeper) {
      advice.push('폭풍수호자: 즉시 번개!');
    }

    // 정령
    if (currentState.cooldowns?.fire_elemental?.ready) {
      advice.push('불의 정령 소환!');
    }

    // 얼음격노
    if (currentState.buffs?.icefury) {
      advice.push('얼음격노: 냉기 충격 4회');
    }

    // 광역
    if (currentState.enemy_count >= 2) {
      advice.push('연쇄 번개 + 지진');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.maelstrom >= 90) {
      advice.push('소용돌이 초과: 대지 충격 즉시 사용');
    } else if (currentState.maelstrom < 20) {
      advice.push('소용돌이 부족: 빌더 사용');
    }

    if (currentState.mana_percent < 30) {
      advice.push('마나 관리 주의');
    }

    return advice.length > 0 ? advice.join(', ') : '자원 관리 양호';
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
    if (phase === 'opener') {
      strategy.immediate = [
        '화염 충격',
        '불의 정령',
        '원시의 파도',
        '폭풍수호자',
        '정기 폭발',
        '용암 폭발',
        '번개 화살'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '화염 충격 유지',
        '대지 충격 스팸',
        '용암 폭발 우선',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '모든 쿨다운 정렬',
        '불의 정령 + 폭풍수호자',
        '정기 폭발 정렬',
        '소용돌이 덤핑'
      ];
    } else {
      strategy.priorities = [
        '화염 충격 100% 유지',
        '소용돌이 60-90 유지',
        '용암 쇄도 즉시 사용',
        '정령 지배 활용'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 즉시 시전 우선');
      strategy.upcoming.push('쫄 페이즈: 연쇄 번개 + 지진');
    }

    return strategy;
  }

  // APL 기반 로테이션 결정
  async getAPLRotation(gameState) {
    // APL 데이터가 없으면 로드
    if (!this.aplData) {
      await this.loadAPL();
    }

    // 간소화된 APL 사용
    const simplifiedAPL = aplData.getSimplifiedAPL('shaman', 'elemental');
    if (!simplifiedAPL) {
      return this.getRotationAdvice(gameState);
    }

    // 타겟 수에 따라 로테이션 선택
    const rotationType = gameState.enemy_count > 1 ? 'multi_target' : 'single_target';
    const rotation = simplifiedAPL[rotationType];

    // 조건에 맞는 첫 번째 스킬 찾기
    for (const action of rotation) {
      if (this.evaluateAPLCondition(action.condition, gameState)) {
        return action.skill;
      }
    }

    // 기본 스킬
    return 'lightning_bolt';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 정기 특화 조건 평가
    const conditions = {
      '!debuff.flame_shock.up || debuff.flame_shock.remains < 6':
        !gameState.debuffs?.flame_shock || (gameState.debuffs?.flame_shock?.remains < 6),
      'cooldown.ready': true, // 간소화
      'cooldown.ready && !pet.fire_elemental.active':
        !gameState.pets?.fire_elemental,
      'cooldown.ready && maelstrom < 70':
        gameState.maelstrom < 70,
      'buff.lava_surge.up || charges >= 1':
        gameState.buffs?.lava_surge || (gameState.lava_burst_charges >= 1),
      'maelstrom >= 60':
        gameState.maelstrom >= 60,
      'maelstrom >= 60 && spell_targets >= 3':
        gameState.maelstrom >= 60 && gameState.enemy_count >= 3,
      'cooldown.ready && maelstrom < 40':
        gameState.maelstrom < 40,
      'buff.icefury.up':
        gameState.buffs?.icefury,
      'spell_targets >= 2':
        gameState.enemy_count >= 2
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 정기 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        flame_shock_uptime: currentState.debuffs?.flame_shock ? 100 : 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 화염 충격 관리
    if (!currentState.debuffs?.flame_shock) {
      analysis.improvements.push({
        area: 'flame_shock',
        message: '화염 충격 유지 필수',
        impact: 'high'
      });
    }

    // 소용돌이 관리
    if (currentState.maelstrom >= 90) {
      analysis.improvements.push({
        area: 'maelstrom',
        message: '소용돌이 낭비 방지',
        impact: 'medium'
      });
    }

    // 용암 쇄도
    if (currentState.buffs?.lava_surge && !currentState.lava_burst_used) {
      analysis.improvements.push({
        area: 'lava_surge',
        message: '용암 쇄도 즉시 사용',
        impact: 'high'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (정기 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 화염 충격 유지율이 좋은 로그에 가중치
      if (log.flameShockUptime >= 95) {
        log.weight = 1.5; // 좋은 예시
      } else if (log.flameShockUptime < 80) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('⚡ 정기 주술사 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 정기 주술사 신규 모델 생성');
    }

    console.log('✅ 정기 주술사 AI 준비 완료');
  }
}

export default ElementalShamanAI;