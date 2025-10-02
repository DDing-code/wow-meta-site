// 분노 전사 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class FuryWarriorAI extends SpecializationAI {
  constructor() {
    super('warrior', 'fury');

    // 분노 전사 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'rage',
      primaryStat: 'strength',
      armorType: 'plate'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 분노 전사 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'bloodthirst', // 피의 갈증
        'raging_blow', // 분노의 강타
        'whirlwind' // 소용돌이
      ],
      spender: [
        'rampage', // 격노
        'execute' // 마무리 일격
      ],
      cooldowns: [
        { name: 'recklessness', cooldown: 90 }, // 무모한 희생
        { name: 'avatar', cooldown: 90 }, // 투신
        { name: 'ravager', cooldown: 90 }, // 파괴자
        { name: 'bladestorm', cooldown: 60 } // 칼날폭풍
      ],
      buffs: [
        'enrage', // 격노 (핵심 버프)
        'whirlwind_buff', // 소용돌이 버프
        'recklessness' // 무모한 희생
      ],
      debuffs: [],
      procs: [
        'sudden_death', // 급살
        'bloodthirst_crit' // 피갈 치명타
      ]
    };

    // 분노 전사 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '충격파', '압도', '빠른 회복', '난폭한 강타',
        '분노 조절', '천둥의 포효', '투신', '광란'
      ],
      specTree: [
        '격노', '파괴자', '향상된 소용돌이', '학살',
        '오딘의 격노', '거인의 힘', '강력한 타격', '급살',
        '무모한 희생', '폭풍의 눈', '격노 유지'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'strength',
      2: 'haste', // 30% 목표
      3: 'critical',
      4: 'mastery',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'rampage', condition: 'rage >= 85' },
      { skill: 'execute', condition: 'target_hp < 20% || sudden_death' },
      { skill: 'bloodthirst', condition: 'always' },
      { skill: 'raging_blow', condition: 'charges >= 1' },
      { skill: 'whirlwind', condition: 'multiple_targets || buff_needed' }
    ];

    // 분노 전사 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS가 가장 중요
      rotation: 0.25, // 격노 유지가 핵심
      resource: 0.2, // 분노 관리
      survival: 0.1 // 생존력은 낮음
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 6150000, // 6.15M DPS
      targetCPM: 40, // 높은 APM
      enrageUptime: 90, // 격노 유지율 90%+
      targetResourceEfficiency: 85
    };

    this.initialize();
  }

  // 분노 전사 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 격노 유지율 (가장 중요)
      enrageUptime: combatLog.buffUptimes?.enrage || 0,

      // 격노 스택
      rampageCount: combatLog.skills?.filter(s => s.name === 'rampage').length || 0,

      // 급살 발동
      suddenDeathProcs: combatLog.procs?.sudden_death || 0,

      // 소용돌이 버프 유지
      whirlwindBuffUptime: combatLog.buffUptimes?.whirlwind_buff || 0,

      // 처형 페이즈 효율
      executePhaseEfficiency: this.calculateExecuteEfficiency(combatLog),

      // 분노 낭비율
      rageWaste: combatLog.resourceWaste?.rage || 0,

      // 쌍수 무기 히트
      offhandHits: combatLog.offhandHits || 0,

      // 버스트 윈도우 효율
      burstWindowEfficiency: this.calculateBurstEfficiency(combatLog)
    };
  }

  // 처형 효율 계산
  calculateExecuteEfficiency(combatLog) {
    if (!combatLog.executePhase) return 100;

    const executeCasts = combatLog.skills?.filter(s =>
      s.name === 'execute' && s.timestamp > combatLog.executePhaseStart
    ).length || 0;

    const expectedExecutes = Math.floor(combatLog.executePhaseDuration / 1.5); // GCD
    return (executeCasts / expectedExecutes) * 100;
  }

  // 버스트 효율 계산
  calculateBurstEfficiency(combatLog) {
    const recklessnessPeriods = combatLog.buffs?.filter(b =>
      b.name === 'recklessness'
    ) || [];

    let totalEfficiency = 0;

    recklessnessPeriods.forEach(period => {
      const rampageDuringBurst = combatLog.skills?.filter(s =>
        s.name === 'rampage' &&
        s.timestamp >= period.start &&
        s.timestamp <= period.end
      ).length || 0;

      // 무모한 희생 중 최소 3번의 격노 사용이 이상적
      totalEfficiency += Math.min(100, (rampageDuringBurst / 3) * 100);
    });

    return recklessnessPeriods.length > 0
      ? totalEfficiency / recklessnessPeriods.length
      : 0;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.2; // 분노 전사는 중간 복잡도
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 격노 체크
    if (!currentState.buffs?.enrage) {
      advice.push('격노 발동: 즉시 격노(Rampage) 사용');
    }

    // 분노 체크
    if (currentState.rage >= 85) {
      advice.push('분노 초과: 격노 사용으로 낭비 방지');
    }

    // 처형 페이즈
    if (currentState.targetHp < 20) {
      advice.push('처형 페이즈: 마무리 일격 우선');
    }

    // 쿨다운
    if (currentState.cooldowns?.recklessness?.ready) {
      advice.push('무모한 희생 준비됨: 버스트 시작');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.rage < 30) {
      advice.push('분노 부족: 피의 갈증/분노의 강타 사용');
    } else if (currentState.rage > 90) {
      advice.push('분노 초과 위험: 즉시 격노 사용');
    }

    if (!currentState.buffs?.whirlwind && currentState.targetCount > 1) {
      advice.push('소용돌이 버프 필요 (광역딜)');
    }

    return advice.length > 0 ? advice.join(', ') : '분노 관리 양호';
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
        '돌진 → 소용돌이',
        '무모한 희생 + 투신',
        '격노 → 피의 갈증',
        '오딘의 격노'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '마무리 일격 최우선',
        '급살 발동시 즉시 사용',
        '격노 유지'
      ];
    } else {
      strategy.priorities = [
        '격노 버프 90%+ 유지',
        '분노 85 이상시 격노',
        '피의 갈증 쿨마다',
        '분노의 강타 2스택 방지'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 돌진/영웅의 도약 준비');
      strategy.upcoming.push('쫄 페이즈: 소용돌이 + 칼날폭풍');
    }

    return strategy;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 분노 전사 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        enrageUptime: currentState.buffUptimes?.enrage || 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 격노 유지 개선
    if (currentState.buffUptimes?.enrage < 85) {
      analysis.improvements.push({
        area: 'enrage',
        message: `격노 유지율 개선 필요: 현재 ${currentState.buffUptimes?.enrage}% → 목표 90%+`,
        impact: 'high'
      });
    }

    // 분노 관리 개선
    if (prediction.resourceScore < 80) {
      analysis.improvements.push({
        area: 'rage',
        message: '분노 관리 최적화 필요',
        impact: 'medium'
      });
    }

    // 쿨다운 정렬
    if (prediction.rotationScore < 85) {
      analysis.improvements.push({
        area: 'cooldowns',
        message: '무모한 희생과 투신 정렬 필요',
        impact: 'high'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (분노 전사 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 격노 유지율이 높은 로그에 가중치 부여
      if (log.buffUptimes?.enrage > 90) {
        log.weight = 1.5; // 좋은 예시
      } else if (log.buffUptimes?.enrage < 70) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // APL 기반 로테이션 결정
  async getAPLRotation(gameState) {
    // APL 데이터가 없으면 로드
    if (!this.aplData) {
      await this.loadAPL();
    }

    // 간소화된 APL 사용
    const simplifiedAPL = aplData.getSimplifiedAPL('warrior', 'fury');
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
    return 'bloodthirst';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 간단한 조건 평가
    const conditions = {
      'rage >= 85': gameState.current_rage >= 85,
      'rage >= 85 || buff.recklessness.up': gameState.current_rage >= 85 || gameState.buffs?.recklessness,
      'target.health.pct < 20 || buff.sudden_death.up': gameState.target_hp_percent < 20 || gameState.buffs?.sudden_death,
      'buff.whirlwind.down && spell_targets > 1': !gameState.buffs?.whirlwind && gameState.enemy_count > 1,
      'charges >= 1': gameState.raging_blow_charges >= 1,
      'spell_targets >= 2': gameState.enemy_count >= 2,
      'spell_targets >= 3': gameState.enemy_count >= 3,
      'target.time_to_die > 6': gameState.target_time_to_die > 6,
      'buff.recklessness.up || cooldown.recklessness.remains > 40':
        gameState.buffs?.recklessness || gameState.cooldowns?.recklessness?.remains > 40
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // APL 로드
  async loadAPL() {
    try {
      const aplText = await aplData.fetchAPL('warrior', 'fury');

      if (typeof aplText === 'string') {
        this.aplData = this.aplParser.parseAPL(aplText);
      } else {
        // 이미 파싱된 간소화 버전
        this.aplData = aplText;
      }

      console.log('📜 분노 전사 APL 로드 완료');
    } catch (error) {
      console.error('APL 로드 실패:', error);
      // 간소화된 버전 사용
      this.aplData = aplData.getSimplifiedAPL('warrior', 'fury');
    }
  }

  // 초기화
  async initialize() {
    console.log('🗡️ 분노 전사 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 분노 전사 신규 모델 생성');
    }

    console.log('✅ 분노 전사 AI 준비 완료');
  }
}

export default FuryWarriorAI;