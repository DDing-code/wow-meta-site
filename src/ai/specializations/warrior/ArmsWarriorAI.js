// 전사 무기 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class ArmsWarriorAI extends SpecializationAI {
  constructor() {
    super('warrior', 'arms');

    // 무기 전사 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'rage',
      secondaryResource: null,
      primaryStat: 'strength',
      armorType: 'plate'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 무기 전사 핵심 메커니즘
    this.coreMechanics = {
      builders: [
        'mortal_strike', // 필사의 일격
        'overpower', // 제압
        'slam', // 격돌
        'whirlwind', // 소용돌이
        'cleave', // 쪼개기 (광역)
        'execute' // 마무리 일격 (처형)
      ],
      spenders: [
        'mortal_strike', // 필사의 일격 (30 분노)
        'execute', // 마무리 일격 (20 분노)
        'cleave', // 쪼개기 (20 분노)
        'ignore_pain', // 고통 감내 (방어)
        'slam' // 격돌 (20 분노)
      ],
      cooldowns: [
        { name: 'avatar', cooldown: 90 }, // 투신
        { name: 'colossus_smash', cooldown: 45 }, // 거인의 강타
        { name: 'warbreaker', cooldown: 45 }, // 전쟁파괴자 (거인의 강타 대체)
        { name: 'bladestorm', cooldown: 90 }, // 칼날폭풍
        { name: 'ravager', cooldown: 90 }, // 파괴자
        { name: 'spear_of_bastion', cooldown: 90 } // 보루의 창
      ],
      buffs: [
        'overpower', // 제압
        'sudden_death', // 급작스러운 죽음 (무료 마무리 일격)
        'deep_wounds', // 치명상
        'test_of_might', // 힘의 시험
        'deadly_calm', // 죽음의 고요
        'executioners_precision', // 집행자의 정밀함
        'avatar' // 투신
      ],
      debuffs: [
        'colossus_smash', // 거인의 강타
        'deep_wounds', // 치명상
        'rend', // 분쇄
        'mortal_wounds' // 죽음의 상처
      ],
      procs: [
        'sudden_death', // 급작스러운 죽음
        'executioners_precision', // 집행자의 정밀함
        'overpower' // 제압 초기화
      ]
    };

    // 무기 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '돌진', '영웅의 도약', '전투의 함성', '분쇄의 일격',
        '광폭화', '집결의 외침', '방패 막기', '주문 반사'
      ],
      specTree: [
        '투신', '거인의 강타', '전쟁파괴자', '칼날폭풍',
        '치명상', '분쇄', '급작스러운 죽음', '힘의 시험',
        '죽음의 고요', '처형자', '학살자', '보루의 창'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'strength',
      2: 'critical', // 30% 목표
      3: 'haste', // 20% 목표
      4: 'mastery',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'colossus_smash', condition: 'cooldown.ready' },
      { skill: 'warbreaker', condition: 'cooldown.ready' },
      { skill: 'avatar', condition: 'cooldown.ready && debuff.colossus_smash.up' },
      { skill: 'execute', condition: 'target.health_percent < 35 || buff.sudden_death.up' },
      { skill: 'mortal_strike', condition: 'rage >= 30' },
      { skill: 'bladestorm', condition: 'cooldown.ready && debuff.colossus_smash.up' },
      { skill: 'overpower', condition: 'charges >= 1' },
      { skill: 'rend', condition: '!debuff.rend.up || debuff.rend.remains < 4' },
      { skill: 'cleave', condition: 'rage >= 20 && spell_targets >= 2' },
      { skill: 'whirlwind', condition: 'spell_targets >= 2' },
      { skill: 'slam', condition: 'rage >= 20' }
    ];

    // 무기 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS
      rotation: 0.25, // 거인의 강타 정렬
      resource: 0.20, // 분노 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7100000, // 7.1M DPS
      targetCPM: 48, // 중상 APM
      colossus_smash_uptime: 45, // 거인의 강타 유지율 45%+
      targetResourceEfficiency: 93
    };

    this.initialize();
  }

  // 무기 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 거인의 강타 유지율
      colossusSmashUptime: combatLog.debuffUptimes?.colossus_smash || 0,

      // 치명상 유지율
      deepWoundsUptime: combatLog.debuffUptimes?.deep_wounds || 0,

      // 급작스러운 죽음 발동률
      suddenDeathProcs: combatLog.procs?.sudden_death || 0,

      // 마무리 일격 효율성
      executeEfficiency: this.calculateExecuteEfficiency(combatLog),

      // 필사의 일격 사용률
      mortalStrikeUsage: this.calculateMortalStrikeUsage(combatLog),

      // 제압 사용률
      overpowerUsage: this.calculateOverpowerUsage(combatLog),

      // 분노 낭비율
      rageWaste: combatLog.resourceWaste?.rage || 0,

      // 힘의 시험 효율
      testOfMightEfficiency: this.calculateTestOfMightEfficiency(combatLog),

      // 칼날폭풍 타이밍
      bladestormTiming: this.calculateBladestormTiming(combatLog),

      // 평균 분노
      averageRage: combatLog.averageResources?.rage || 0
    };
  }

  // 마무리 일격 효율 계산
  calculateExecuteEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const executes = combatLog.skills.filter(s => s.name === 'execute');
    let executePhaseExecutes = 0;
    let suddenDeathExecutes = 0;

    executes.forEach(exec => {
      if (exec.target_health_percent < 35) {
        executePhaseExecutes++;
      }
      if (exec.buff_sudden_death) {
        suddenDeathExecutes++;
      }
    });

    const total = executePhaseExecutes + suddenDeathExecutes;
    return executes.length > 0
      ? (total / executes.length) * 100
      : 0;
  }

  // 필사의 일격 사용률 계산
  calculateMortalStrikeUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const mortalStrikes = combatLog.skills.filter(s => s.name === 'mortal_strike').length;
    const combatDuration = combatLog.duration || 1;

    // 필사의 일격은 6초 쿨다운
    const expectedCasts = Math.floor(combatDuration / 6) + 1;

    return Math.min(100, (mortalStrikes / expectedCasts) * 100);
  }

  // 제압 사용률 계산
  calculateOverpowerUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const overpowers = combatLog.skills.filter(s => s.name === 'overpower').length;
    const combatDuration = combatLog.duration || 1;

    // 제압은 12초 재사용, 2충전
    const expectedCasts = (combatDuration / 12) * 2;

    return Math.min(100, (overpowers / expectedCasts) * 100);
  }

  // 힘의 시험 효율 계산
  calculateTestOfMightEfficiency(combatLog) {
    if (!combatLog.buffProcs) return 100;

    const testOfMightProcs = combatLog.buffProcs.test_of_might || 0;
    const testOfMightUsed = combatLog.buffConsumed?.test_of_might || 0;

    return testOfMightProcs > 0
      ? (testOfMightUsed / testOfMightProcs) * 100
      : 100;
  }

  // 칼날폭풍 타이밍 계산
  calculateBladestormTiming(combatLog) {
    if (!combatLog.skills) return 100;

    const bladestorms = combatLog.skills.filter(s => s.name === 'bladestorm');
    let goodTiming = 0;

    bladestorms.forEach(bs => {
      // 거인의 강타 디버프 중 사용
      if (bs.during_colossus_smash) {
        goodTiming++;
      }
    });

    return bladestorms.length > 0
      ? (goodTiming / bladestorms.length) * 100
      : 100;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.2; // 무기는 중간 복잡도
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 거인의 강타 체크
    if (currentState.cooldowns?.colossus_smash?.ready) {
      advice.push('거인의 강타 사용!');
    }

    // 처형 단계
    if (currentState.enemy_health_percent < 35) {
      advice.push('처형 단계: 마무리 일격 우선!');
    }

    // 급작스러운 죽음
    if (currentState.buffs?.sudden_death) {
      advice.push('급작스러운 죽음: 무료 마무리 일격!');
    }

    // 필사의 일격
    if (currentState.rage >= 30 && !currentState.mortal_strike_on_cooldown) {
      advice.push('필사의 일격 사용!');
    }

    // 제압
    if (currentState.overpower_charges >= 2) {
      advice.push('제압 충전 소비!');
    }

    // 투신
    if (currentState.cooldowns?.avatar?.ready && currentState.debuffs?.colossus_smash) {
      advice.push('투신 사용!');
    }

    // 광역
    if (currentState.enemy_count >= 2) {
      advice.push('쪼개기 + 소용돌이!');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.rage >= 90) {
      advice.push('분노 초과: 격돌 사용');
    } else if (currentState.rage < 20) {
      advice.push('분노 부족: 자동공격 대기');
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
        '돌진',
        '분쇄',
        '거인의 강타',
        '투신',
        '필사의 일격',
        '칼날폭풍',
        '제압'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '마무리 일격 스팸',
        '급작스러운 죽음 활용',
        '치명상 유지',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '모든 쿨다운 정렬',
        '거인의 강타 + 투신',
        '칼날폭풍 정렬',
        '분노 덤핑'
      ];
    } else {
      strategy.priorities = [
        '거인의 강타 쿨마다',
        '필사의 일격 우선',
        '제압 충전 관리',
        '치명상 유지'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 영웅의 도약');
      strategy.upcoming.push('쫄 페이즈: 칼날폭풍 준비');
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
    const simplifiedAPL = aplData.getSimplifiedAPL('warrior', 'arms');
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
    return 'slam';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 무기 특화 조건 평가
    const conditions = {
      'cooldown.ready': true, // 간소화
      'cooldown.ready && debuff.colossus_smash.up':
        gameState.debuffs?.colossus_smash,
      'target.health_percent < 35 || buff.sudden_death.up':
        gameState.enemy_health_percent < 35 || gameState.buffs?.sudden_death,
      'rage >= 30':
        gameState.rage >= 30,
      'charges >= 1':
        gameState.overpower_charges >= 1,
      '!debuff.rend.up || debuff.rend.remains < 4':
        !gameState.debuffs?.rend || (gameState.debuffs?.rend?.remains < 4),
      'rage >= 20 && spell_targets >= 2':
        gameState.rage >= 20 && gameState.enemy_count >= 2,
      'spell_targets >= 2':
        gameState.enemy_count >= 2,
      'rage >= 20':
        gameState.rage >= 20
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 무기 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        colossus_smash_uptime: currentState.debuffs?.colossus_smash ? 100 : 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 거인의 강타 관리
    if (currentState.cooldowns?.colossus_smash?.ready) {
      analysis.improvements.push({
        area: 'colossus_smash',
        message: '거인의 강타 사용',
        impact: 'high'
      });
    }

    // 처형 단계
    if (currentState.enemy_health_percent < 35 && !currentState.executing) {
      analysis.improvements.push({
        area: 'execute',
        message: '처형 단계 전환',
        impact: 'high'
      });
    }

    // 분노 관리
    if (currentState.rage >= 90) {
      analysis.improvements.push({
        area: 'rage',
        message: '분노 낭비 방지',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (무기 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 거인의 강타 유지율이 좋은 로그에 가중치
      if (log.colossusSmashUptime >= 40) {
        log.weight = 1.5; // 좋은 예시
      } else if (log.colossusSmashUptime < 25) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('⚔️ 무기 전사 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 무기 전사 신규 모델 생성');
    }

    console.log('✅ 무기 전사 AI 준비 완료');
  }
}

export default ArmsWarriorAI;