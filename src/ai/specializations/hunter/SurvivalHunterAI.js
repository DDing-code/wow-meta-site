// 사냥꾼 생존 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class SurvivalHunterAI extends SpecializationAI {
  constructor() {
    super('hunter', 'survival');

    // 생존 사냥꾼 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'focus',
      primaryStat: 'agility',
      armorType: 'mail'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 생존 사냥꾼 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'raptor_strike', // 랩터 강타
        'mongoose_bite', // 몽구스 물어뜯기
        'wildfire_bomb', // 산불 폭탄
        'flanking_strike' // 측면 강타
      ],
      spender: [
        'kill_command', // 살육 명령
        'kill_shot', // 마무리 사격
        'explosive_shot', // 폭발 사격
        'fury_of_the_eagle', // 독수리의 분노
        'coordinated_assault' // 협력 공격
      ],
      cooldowns: [
        { name: 'coordinated_assault', cooldown: 120 }, // 협력 공격
        { name: 'spearhead', cooldown: 90 }, // 선봉대
        { name: 'fury_of_the_eagle', cooldown: 45 }, // 독수리의 분노
        { name: 'aspect_of_the_eagle', cooldown: 90 }, // 독수리의 상
        { name: 'steel_trap', cooldown: 45 } // 강철 덫
      ],
      buffs: [
        'coordinated_assault', // 협력 공격
        'tip_of_the_spear', // 창끝
        'mongoose_fury', // 몽구스 격노
        'aspect_of_the_eagle', // 독수리의 상
        'flanking_strike', // 측면 강타
        'spearhead' // 선봉대
      ],
      debuffs: [
        'hunters_mark', // 사냥꾼의 징표
        'serpent_sting', // 독사 쐐기
        'wildfire_bomb', // 산불 폭탄
        'steel_trap', // 강철 덫
        'bloodseeker' // 피추적자
      ],
      procs: [
        'tip_of_the_spear', // 창끝 (집중 감소)
        'mongoose_fury', // 몽구스 격노
        'flanking_strike', // 측면 강타 충전
        'wildfire_bomb' // 산불 폭탄 충전
      ]
    };

    // 생존 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '사냥꾼의 징표', '상급자 집중', '위장', '생존 전술',
        '타르 덫', '얼음 덫', '저항의 상', '치타의 상'
      ],
      specTree: [
        '협력 공격', '선봉대', '독수리의 분노', '독수리의 상',
        '창끝', '몽구스 격노', '측면 강타', '산불 폭탄',
        '강철 덫', '피추적자', '살인적 수법', '전술적 이점'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'agility',
      2: 'haste', // 30% 목표 (짧은 GCD)
      3: 'critical', // 25% 목표
      4: 'mastery',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'hunters_mark', condition: '!debuff.hunters_mark.up' },
      { skill: 'kill_shot', condition: 'target.health_pct <= 20' },
      { skill: 'wildfire_bomb', condition: 'charges >= 1' },
      { skill: 'fury_of_the_eagle', condition: 'buff.tip_of_the_spear.stack >= 3' },
      { skill: 'mongoose_bite', condition: 'buff.mongoose_fury.stack >= 1' },
      { skill: 'flanking_strike', condition: 'charges >= 1' },
      { skill: 'coordinated_assault', condition: 'cooldown.ready' },
      { skill: 'spearhead', condition: 'cooldown.ready' },
      { skill: 'kill_command', condition: 'focus >= 30' },
      { skill: 'raptor_strike', condition: 'focus >= 30' },
      { skill: 'steel_trap', condition: 'cooldown.ready' }
    ];

    // 생존 특화 가중치
    this.learningWeights = {
      dps: 0.35, // DPS
      rotation: 0.35, // 복잡한 근접 로테이션
      resource: 0.20, // 집중 관리
      survival: 0.10 // 근접이라 생존력 중요
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 6800000, // 6.8M DPS
      targetCPM: 45, // 높은 APM (근접)
      tip_of_spear_stacks: 3, // 창끝 3스택 활용
      targetResourceEfficiency: 88
    };

    this.initialize();
  }

  // 생존 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 창끝 평균 스택
      avgTipOfSpearStacks: combatLog.avgTipOfSpearStacks || 0,

      // 몽구스 격노 활용률
      mongooseFuryUsage: this.calculateMongooseFuryUsage(combatLog),

      // 협력 공격 효율성
      coordinatedAssaultEfficiency: this.calculateCoordinatedAssaultEfficiency(combatLog),

      // 산불 폭탄 사용률
      wildfireBombUsage: this.calculateWildfireBombUsage(combatLog),

      // 측면 강타 활용률
      flankingStrikeUsage: this.calculateFlankingStrikeUsage(combatLog),

      // 근접 거리 유지율
      meleeRangeUptime: combatLog.meleeRangeUptime || 0,

      // 집중 낭비율
      focusWaste: combatLog.resourceWaste?.focus || 0,

      // 독수리의 분노 효율
      furyOfEagleEfficiency: this.calculateFuryOfEagleEfficiency(combatLog),

      // 펫 가동시간
      petUptime: combatLog.petUptime || 0
    };
  }

  // 몽구스 격노 활용률 계산
  calculateMongooseFuryUsage(combatLog) {
    if (!combatLog.procs) return 0;

    const mongooseProcs = combatLog.procs.mongoose_fury || 0;
    const mongooseBites = combatLog.skillCounts?.mongoose_bite || 0;

    // 프록당 몽구스 물어뜯기 사용 비율
    return mongooseProcs > 0
      ? Math.min(100, (mongooseBites / mongooseProcs) * 100)
      : 0;
  }

  // 협력 공격 효율성 계산
  calculateCoordinatedAssaultEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const coordAssaults = combatLog.skills.filter(s => s.name === 'coordinated_assault');
    let totalEfficiency = 0;

    coordAssaults.forEach(assault => {
      // 협력 공격 시전시 창끝 스택 확인
      const tipStacks = assault.tip_of_spear_stacks || 0;
      // 3 스택이 이상적
      totalEfficiency += Math.min(100, (tipStacks / 3) * 100);
    });

    return coordAssaults.length > 0
      ? totalEfficiency / coordAssaults.length
      : 0;
  }

  // 산불 폭탄 사용률 계산
  calculateWildfireBombUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const bombs = combatLog.skills.filter(s => s.name === 'wildfire_bomb');
    const combatDuration = combatLog.duration || 1;

    // 산불 폭탄은 18초 쿨다운 (2충전)
    const expectedCasts = Math.floor(combatDuration / 9) + 2; // 2충전 고려

    return Math.min(100, (bombs.length / expectedCasts) * 100);
  }

  // 측면 강타 활용률 계산
  calculateFlankingStrikeUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const flankingStrikes = combatLog.skills.filter(s => s.name === 'flanking_strike');
    const combatDuration = combatLog.duration || 1;

    // 측면 강타는 30초 쿨다운
    const expectedCasts = Math.floor(combatDuration / 30) + 1;

    return Math.min(100, (flankingStrikes.length / expectedCasts) * 100);
  }

  // 독수리의 분노 효율 계산
  calculateFuryOfEagleEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const furyUsages = combatLog.skills.filter(s => s.name === 'fury_of_the_eagle');
    let totalEfficiency = 0;

    furyUsages.forEach(fury => {
      // 독수리의 분노 시전시 창끝 스택 확인
      const tipStacks = fury.tip_of_spear_stacks || 0;
      // 3 스택에서 사용하는 것이 이상적
      totalEfficiency += Math.min(100, (tipStacks / 3) * 100);
    });

    return furyUsages.length > 0
      ? totalEfficiency / furyUsages.length
      : 0;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.6; // 생존은 높은 복잡도 (근접 + 자원 관리)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 사냥꾼의 징표 체크
    if (!currentState.debuffs?.hunters_mark) {
      advice.push('사냥꾼의 징표 적용!');
    }

    // 창끝 스택 체크
    if (currentState.tip_of_spear_stacks >= 3) {
      advice.push('창끝 3스택: 독수리의 분노 사용!');
    }

    // 몽구스 격노 체크
    if (currentState.mongoose_fury_stacks >= 1) {
      advice.push(`몽구스 격노 ${currentState.mongoose_fury_stacks}스택: 몽구스 물어뜯기`);
    }

    // 산불 폭탄 충전
    if (currentState.wildfire_bomb_charges >= 1) {
      advice.push('산불 폭탄 사용 가능');
    }

    // 측면 강타 충전
    if (currentState.flanking_strike_charges >= 1) {
      advice.push('측면 강타 사용 가능');
    }

    // 집중 관리
    if (currentState.focus < 30) {
      advice.push('집중 부족: 기본 공격');
    } else if (currentState.focus >= 90) {
      advice.push('집중 초과: 살육 명령/랩터 강타');
    }

    // 근접 거리 확인
    if (currentState.melee_range === false) {
      advice.push('근접 거리로 이동 필요!');
    }

    // 실행 구간
    if (currentState.target_hp_percent <= 20) {
      advice.push('마무리 사격 우선!');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.focus < 30) {
      advice.push('집중 부족: 기본 공격으로 회복');
    } else if (currentState.focus > 90) {
      advice.push('집중 초과: 살육 명령이나 랩터 강타 사용');
    }

    if (currentState.buffs?.tip_of_the_spear) {
      advice.push(`창끝 ${currentState.tip_of_spear_stacks}스택: 집중 비용 감소`);
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
        '사냥꾼의 징표',
        '협력 공격',
        '산불 폭탄',
        '선봉대',
        '살육 명령',
        '랩터 강타'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '마무리 사격 최우선',
        '모든 쿨다운 사용',
        '창끝 3스택 활용',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '협력 공격 활성화',
        '창끝 3스택 + 독수리의 분노',
        '몽구스 격노 연계',
        '최대 DPS 윈도우'
      ];
    } else {
      strategy.priorities = [
        '창끝 스택 관리',
        '산불 폭탄 충전 활용',
        '집중 30-80 유지',
        '근접 거리 유지'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 독수리의 상 사용');
      strategy.upcoming.push('근접 불가 구간: 원거리 스킬');
    }

    return strategy;
  }

  // APL 조건 평가 (생존 특화)
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      '!debuff.hunters_mark.up': !gameState.debuffs?.hunters_mark,
      'target.health_pct <= 20': gameState.target_hp_percent <= 20,
      'charges >= 1': true, // 간소화
      'buff.tip_of_the_spear.stack >= 3': gameState.tip_of_spear_stacks >= 3,
      'buff.mongoose_fury.stack >= 1': gameState.mongoose_fury_stacks >= 1,
      'cooldown.ready': true,
      'focus >= 30': gameState.focus >= 30,
      'melee_range': gameState.melee_range !== false
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        dps: currentState.dps,
        tip_stacks: currentState.tip_of_spear_stacks || 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 창끝 관리
    if (currentState.tip_of_spear_stacks < 3) {
      analysis.improvements.push({
        area: 'tip_of_spear',
        message: `창끝 스택 증가 필요: ${currentState.tip_of_spear_stacks} → 3`,
        impact: 'high'
      });
    }

    // 근접 거리
    if (currentState.melee_range === false) {
      analysis.improvements.push({
        area: 'positioning',
        message: '근접 거리 유지 필요',
        impact: 'very_high'
      });
    }

    // 집중 관리
    if (prediction.resourceScore < 85) {
      analysis.improvements.push({
        area: 'focus',
        message: '집중 관리 최적화 필요',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (생존 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 창끝 스택 관리가 좋은 로그에 가중치
      if (log.avgTipOfSpearStacks >= 2.5) {
        log.weight = 1.5;
      } else if (log.avgTipOfSpearStacks < 1.5) {
        log.weight = 0.5;
      } else {
        log.weight = 1.0;
      }

      // 근접 거리 유지율 고려
      if (log.meleeRangeUptime >= 90) {
        log.weight *= 1.2;
      } else if (log.meleeRangeUptime < 70) {
        log.weight *= 0.8;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('🗡️ 생존 사냥꾼 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 생존 사냥꾼 신규 모델 생성');
    }

    console.log('✅ 생존 사냥꾼 AI 준비 완료');
  }
}

export default SurvivalHunterAI;