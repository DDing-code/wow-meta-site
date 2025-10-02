// 마법사 화염 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class FireMageAI extends SpecializationAI {
  constructor() {
    super('mage', 'fire');

    // 화염 마법사 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'mana',
      primaryStat: 'intellect',
      armorType: 'cloth'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 화염 마법사 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'fireball', // 화염구
        'fire_blast', // 화염 작렬
        'phoenix_flames', // 불사조의 불길
        'scorch', // 그을리기
        'shifting_power' // 변환의 힘
      ],
      spender: [
        'pyroblast', // 불덩이 작열
        'flamestrike', // 불기둥 (광역)
        'meteor', // 유성
        'combustion', // 연소
        'dragons_breath' // 용의 숨결
      ],
      cooldowns: [
        { name: 'combustion', cooldown: 120 }, // 연소
        { name: 'meteor', cooldown: 45 }, // 유성
        { name: 'shifting_power', cooldown: 45 }, // 변환의 힘
        { name: 'phoenix_flames', cooldown: 25 }, // 불사조의 불길
        { name: 'sun_kings_blessing', cooldown: 0 } // 태양왕의 축복 (패시브)
      ],
      buffs: [
        'combustion', // 연소
        'hot_streak', // 타오르는 열정 (즉시 불덩이 작열)
        'heating_up', // 열기 (타오르는 열정 준비)
        'hyperthermia', // 과열
        'sun_kings_blessing', // 태양왕의 축복
        'feel_the_burn' // 불타는 감각
      ],
      debuffs: [
        'ignite', // 점화 (핵심 도트)
        'living_bomb', // 살아있는 폭탄
        'meteor_burn', // 유성 화상
        'improved_scorch' // 강화된 그을리기
      ],
      procs: [
        'hot_streak', // 타오르는 열정
        'heating_up', // 열기
        'firefall', // 불꽃 낙하
        'hyperthermia' // 과열
      ]
    };

    // 화염 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '신비한 지능', '얼음 보호막', '점멸', '시간 왜곡',
        '투명화', '주문 훔치기', '변이', '얼음 방패'
      ],
      specTree: [
        '연소', '불사조의 불길', '유성', '살아있는 폭탄',
        '타오르는 열정', '킨드링', '태양왕의 축복', '불꽃놀이',
        '과열', '불타는 감각', '화염 정통', '작렬의 연쇄'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'haste', // 30% 목표
      3: 'critical', // 연소 중 100% 보장
      4: 'mastery', // 점화 데미지
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'combustion', condition: 'cooldown.ready && hot_streak.up' },
      { skill: 'pyroblast', condition: 'hot_streak.up' },
      { skill: 'fire_blast', condition: 'heating_up.up && charges >= 1' },
      { skill: 'phoenix_flames', condition: 'heating_up.up && charges >= 1' },
      { skill: 'meteor', condition: 'cooldown.ready && (combustion.up || target.time_to_die < 10)' },
      { skill: 'flamestrike', condition: 'hot_streak.up && spell_targets >= 3' },
      { skill: 'scorch', condition: 'moving || target.health_pct <= 30' },
      { skill: 'fireball', condition: 'casting_time < gcd' },
      { skill: 'shifting_power', condition: 'cooldown.combustion > 30' }
    ];

    // 화염 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS
      rotation: 0.30, // 타오르는 열정 관리가 핵심
      resource: 0.15, // 마나는 거의 무한
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7200000, // 7.2M DPS
      targetCPM: 50, // 높은 APM (즉시시전 많음)
      ignite_uptime: 100, // 점화 100% 유지
      targetResourceEfficiency: 100 // 마나 무한
    };

    this.initialize();
  }

  // 화염 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 점화 평균 데미지
      avgIgniteDamage: combatLog.avgIgniteDamage || 0,

      // 연소 효율성
      combustionEfficiency: this.calculateCombustionEfficiency(combatLog),

      // 타오르는 열정 발동률
      hotStreakProcs: combatLog.procs?.hot_streak || 0,

      // 열기 전환률
      heatingUpConversion: this.calculateHeatingUpConversion(combatLog),

      // 태양왕의 축복 발동
      sunKingsProcs: combatLog.procs?.sun_kings_blessing || 0,

      // 점화 유지율
      igniteUptime: combatLog.debuffUptimes?.ignite || 0,

      // 유성 효율
      meteorEfficiency: this.calculateMeteorEfficiency(combatLog),

      // 불사조의 불길 사용률
      phoenixFlamesUsage: this.calculatePhoenixUsage(combatLog),

      // 연소 중 불덩이 작열 수
      pyroblastsInCombustion: this.calculateCombustionPyros(combatLog)
    };
  }

  // 연소 효율 계산
  calculateCombustionEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const combustions = combatLog.skills.filter(s => s.name === 'combustion');
    let totalEfficiency = 0;

    combustions.forEach(comb => {
      // 연소 중 불덩이 작열 수 확인
      const pyrosInWindow = comb.pyroblasts_during || 0;
      // 10초 동안 최소 8개가 이상적
      totalEfficiency += Math.min(100, (pyrosInWindow / 8) * 100);
    });

    return combustions.length > 0
      ? totalEfficiency / combustions.length
      : 0;
  }

  // 열기 전환률 계산
  calculateHeatingUpConversion(combatLog) {
    if (!combatLog.procs) return 100;

    const heatingUps = combatLog.procs.heating_up || 0;
    const hotStreaks = combatLog.procs.hot_streak || 0;

    // 이상적으로 모든 열기는 타오르는 열정으로 전환되어야 함
    return heatingUps > 0
      ? Math.min(100, (hotStreaks / heatingUps) * 100)
      : 100;
  }

  // 유성 효율 계산
  calculateMeteorEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const meteors = combatLog.skills.filter(s => s.name === 'meteor');

    // 유성은 연소 중이거나 처형 페이즈에 사용해야 함
    const validMeteors = meteors.filter(m =>
      m.during_combustion || m.target_health_pct <= 10
    ).length;

    return meteors.length > 0
      ? (validMeteors / meteors.length) * 100
      : 100;
  }

  // 불사조의 불길 사용률 계산
  calculatePhoenixUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const phoenixes = combatLog.skills.filter(s => s.name === 'phoenix_flames').length;
    const combatDuration = combatLog.duration || 1;

    // 불사조의 불길은 25초 쿨다운, 3충전
    const expectedCasts = Math.floor(combatDuration / 8); // 평균 8초마다 사용

    return Math.min(100, (phoenixes / expectedCasts) * 100);
  }

  // 연소 중 불덩이 작열 계산
  calculateCombustionPyros(combatLog) {
    if (!combatLog.skills) return 0;

    const combustions = combatLog.skills.filter(s => s.name === 'combustion');
    let totalPyros = 0;

    combustions.forEach(comb => {
      totalPyros += comb.pyroblasts_during || 0;
    });

    return combustions.length > 0
      ? totalPyros / combustions.length
      : 0;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.6; // 화염은 높은 복잡도
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 타오르는 열정 체크
    if (currentState.buffs?.hot_streak) {
      advice.push('타오르는 열정: 즉시 불덩이 작열!');
    }

    // 열기 체크
    if (currentState.buffs?.heating_up) {
      advice.push('열기 활성: 화염 작렬/불사조의 불길 사용');
    }

    // 연소 준비
    if (currentState.cooldowns?.combustion?.ready && currentState.buffs?.hot_streak) {
      advice.push('연소 준비 완료!');
    }

    // 연소 중
    if (currentState.buffs?.combustion) {
      advice.push('연소 중: 화염 작렬 + 불사조 스팸!');
    }

    // 태양왕의 축복
    if (currentState.sun_kings_stacks >= 8) {
      advice.push('태양왕의 축복 준비!');
    }

    // 광역
    if (currentState.enemy_count >= 3) {
      advice.push('불기둥 우선');
    }

    // 이동 중
    if (currentState.moving) {
      advice.push('그을리기 사용');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    // 화염 마법사는 마나가 거의 무한
    return '마나 관리 불필요';
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
        '화염구 (열기 프록)',
        '화염 작렬 (타오르는 열정)',
        '불덩이 작열',
        '연소',
        '화염 작렬 + 불사조 연쇄'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '그을리기 스팸',
        '타오르는 열정 즉시 사용',
        '유성 사용',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '연소 + 유성',
        '최대 불덩이 작열',
        '점화 스택 극대화',
        '과열 활용'
      ];
    } else {
      strategy.priorities = [
        '점화 100% 유지',
        '타오르는 열정 낭비 방지',
        '열기 → 타오르는 열정 전환',
        '쿨다운 정렬'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 그을리기 + 즉시시전');
      strategy.upcoming.push('쫄 페이즈: 불기둥 + 살아있는 폭탄');
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
    const simplifiedAPL = aplData.getSimplifiedAPL('mage', 'fire');
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
    return 'fireball';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 화염 특화 조건 평가
    const conditions = {
      'cooldown.ready && hot_streak.up': gameState.cooldowns?.combustion?.ready && gameState.buffs?.hot_streak,
      'hot_streak.up': gameState.buffs?.hot_streak,
      'heating_up.up && charges >= 1': gameState.buffs?.heating_up && gameState.fire_blast_charges >= 1,
      'heating_up.up': gameState.buffs?.heating_up,
      'cooldown.ready': true, // 간소화
      'combustion.up': gameState.buffs?.combustion,
      'target.time_to_die < 10': gameState.target_time_to_die < 10,
      'spell_targets >= 3': gameState.enemy_count >= 3,
      'moving': gameState.moving,
      'target.health_pct <= 30': gameState.target_hp_percent <= 30,
      'casting_time < gcd': true, // 간소화
      'cooldown.combustion > 30': !gameState.cooldowns?.combustion?.ready
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 화염 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        ignite_damage: currentState.avgIgniteDamage || 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 점화 관리
    if (!currentState.debuffs?.ignite) {
      analysis.improvements.push({
        area: 'ignite',
        message: '점화 유지 필수',
        impact: 'high'
      });
    }

    // 타오르는 열정 관리
    if (prediction.rotationScore < 90) {
      analysis.improvements.push({
        area: 'hot_streak',
        message: '타오르는 열정 관리 최적화 필요',
        impact: 'high'
      });
    }

    // 연소 효율
    if (currentState.pyroblastsInCombustion < 8) {
      analysis.improvements.push({
        area: 'combustion',
        message: `연소 중 불덩이 작열 부족: ${currentState.pyroblastsInCombustion} → 8+`,
        impact: 'high'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (화염 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 연소 효율이 좋은 로그에 가중치
      if (log.combustionEfficiency >= 80) {
        log.weight = 1.5; // 좋은 예시
      } else if (log.combustionEfficiency < 50) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('🔥 화염 마법사 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 화염 마법사 신규 모델 생성');
    }

    console.log('✅ 화염 마법사 AI 준비 완료');
  }
}

export default FireMageAI;