// 성기사 징벌 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class RetributionPaladinAI extends SpecializationAI {
  constructor() {
    super('paladin', 'retribution');

    // 징벌 성기사 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'holy_power',
      primaryStat: 'strength',
      armorType: 'plate'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 징벌 성기사 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'blade_of_justice', // 정의의 칼날
        'wake_of_ashes', // 재의 흔적
        'hammer_of_wrath', // 천벌의 망치
        'judgment', // 심판
        'consecration' // 신성화
      ],
      spender: [
        'final_verdict', // 최종 선고
        'templar_verdict', // 기사단의 선고
        'divine_storm', // 신성한 폭풍 (광역)
        'justicars_vengeance', // 심판관의 복수
        'execution_sentence' // 사형 선고
      ],
      cooldowns: [
        { name: 'avenging_wrath', cooldown: 120 }, // 응보의 격노
        { name: 'crusade', cooldown: 120 }, // 성전
        { name: 'wake_of_ashes', cooldown: 30 }, // 재의 흔적
        { name: 'execution_sentence', cooldown: 30 }, // 사형 선고
        { name: 'final_reckoning', cooldown: 120 } // 최후의 심판
      ],
      buffs: [
        'crusade', // 성전 (스택)
        'avenging_wrath', // 응보의 격노
        'art_of_war', // 전투의 기술 (무료 정의의 칼날)
        'divine_purpose', // 신성한 목적 (무료 스펜더)
        'empyrean_power', // 천상의 힘
        'righteous_verdict' // 정의로운 선고
      ],
      debuffs: [
        'judgment', // 심판
        'execution_sentence', // 사형 선고
        'final_reckoning', // 최후의 심판
        'consecration' // 신성화
      ],
      procs: [
        'art_of_war', // 전투의 기술
        'divine_purpose', // 신성한 목적
        'empyrean_power' // 천상의 힘
      ]
    };

    // 징벌 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '응보', '희생의 오라', '정화된 독소', '빛의 섬광',
        '축복받은 망치', '신성한 목적', '정의의 격노', '신의 은총'
      ],
      specTree: [
        '정의의 칼날', '재의 흔적', '최종 선고', '성전',
        '사형 선고', '최후의 심판', '천상의 힘', '정의로운 선고',
        '심판관의 복수', '빛의 수호자', '빛나는 정의', '정의로운 격노'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'strength',
      2: 'haste', // 17% 목표
      3: 'critical', // 30% 목표
      4: 'mastery',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'wake_of_ashes', condition: 'holy_power <= 0' },
      { skill: 'execution_sentence', condition: 'cooldown.ready && target.time_to_die > 8' },
      { skill: 'final_reckoning', condition: 'cooldown.ready && holy_power >= 3' },
      { skill: 'avenging_wrath', condition: 'holy_power >= 3 || buff.crusade.stack >= 10' },
      { skill: 'final_verdict', condition: 'holy_power >= 3' },
      { skill: 'divine_storm', condition: 'holy_power >= 3 && spell_targets >= 2' },
      { skill: 'blade_of_justice', condition: 'holy_power <= 3' },
      { skill: 'judgment', condition: 'holy_power <= 4' },
      { skill: 'hammer_of_wrath', condition: 'target.health_pct <= 20 || buff.avenging_wrath.up' },
      { skill: 'consecration', condition: '!buff.consecration.up' }
    ];

    // 징벌 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS
      rotation: 0.25, // 성전 스택 관리가 핵심
      resource: 0.20, // 신성한 힘 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 6800000, // 6.8M DPS
      targetCPM: 40, // 높은 APM
      crusade_max_stacks: 10, // 성전 최대 스택 유지
      targetResourceEfficiency: 95
    };

    this.initialize();
  }

  // 징벌 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 성전 평균 스택
      avgCrusadeStacks: combatLog.avgCrusadeStacks || 0,

      // 재의 흔적 효율성
      wakeOfAshesEfficiency: this.calculateWakeEfficiency(combatLog),

      // 응보의 격노 타이밍
      avengingWrathTiming: combatLog.avengingWrathTiming || 0,

      // 전투의 기술 발동률
      artOfWarProcs: combatLog.procs?.art_of_war || 0,

      // 신성한 목적 발동률
      divinePurposeProcs: combatLog.procs?.divine_purpose || 0,

      // 최종 선고 사용률
      finalVerdictUsage: combatLog.skills?.filter(s => s.name === 'final_verdict').length || 0,

      // 신성한 힘 낭비율
      holyPowerWaste: combatLog.resourceWaste?.holy_power || 0,

      // 신성화 유지율
      consecrationUptime: combatLog.buffUptimes?.consecration || 0,

      // 천벌의 망치 사용 효율
      hammerOfWrathEfficiency: this.calculateHammerEfficiency(combatLog)
    };
  }

  // 재의 흔적 효율 계산
  calculateWakeEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const wakes = combatLog.skills.filter(s => s.name === 'wake_of_ashes');
    let totalEfficiency = 0;

    wakes.forEach(wake => {
      // 재의 흔적은 5 신성한 힘 생성
      const powerAtCast = wake.holy_power || 0;
      // 0-1 신성한 힘일 때가 이상적
      totalEfficiency += Math.max(0, 100 - (powerAtCast * 20));
    });

    return wakes.length > 0
      ? totalEfficiency / wakes.length
      : 0;
  }

  // 천벌의 망치 효율 계산
  calculateHammerEfficiency(combatLog) {
    if (!combatLog.skills) return 100;

    const hammers = combatLog.skills.filter(s => s.name === 'hammer_of_wrath');
    const totalCasts = hammers.length;

    // 처형 페이즈 또는 응보의 격노 중 사용
    const validCasts = hammers.filter(h =>
      h.target_health_pct <= 20 || h.buff_avenging_wrath
    ).length;

    return totalCasts > 0
      ? (validCasts / totalCasts) * 100
      : 100;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.3; // 징벌은 중간 복잡도
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 신성한 힘 체크
    if (currentState.holy_power >= 5) {
      advice.push('신성한 힘 소모 필요!');
    }

    // 재의 흔적 준비
    if (currentState.holy_power <= 0 && currentState.cooldowns?.wake_of_ashes?.ready) {
      advice.push('재의 흔적 사용!');
    }

    // 성전 스택 관리
    if (currentState.buffs?.crusade && currentState.buffs.crusade.stacks < 10) {
      advice.push(`성전 ${currentState.buffs.crusade.stacks} 스택 - 빠르게 스택 증가`);
    }

    // 전투의 기술
    if (currentState.buffs?.art_of_war) {
      advice.push('전투의 기술: 무료 정의의 칼날');
    }

    // 신성한 목적
    if (currentState.buffs?.divine_purpose) {
      advice.push('신성한 목적: 무료 스펜더 사용');
    }

    // 광역
    if (currentState.enemy_count >= 2) {
      advice.push('신성한 폭풍 우선');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.holy_power < 3) {
      advice.push('신성한 힘 생성: 정의의 칼날/심판 사용');
    } else if (currentState.holy_power >= 5) {
      advice.push('신성한 힘 초과: 즉시 스펜더 사용');
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
        '사형 선고 (디버프)',
        '재의 흔적',
        '응보의 격노/성전',
        '최종 선고 x2',
        '정의의 칼날'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '천벌의 망치 우선',
        '신성한 힘 3+ 유지',
        '최종 선고 스팸',
        '처형 효율 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '성전 10스택 유지',
        '모든 쿨다운 정렬',
        '신성한 힘 낭비 방지',
        '최대 DPS 윈도우'
      ];
    } else {
      strategy.priorities = [
        '신성한 힘 3-4 유지',
        '재의 흔적 쿨마다',
        '신성화 유지',
        '프록 즉시 사용'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 원거리 스킬 준비');
      strategy.upcoming.push('쫄 페이즈: 신성한 폭풍 + 재의 흔적');
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
    const simplifiedAPL = aplData.getSimplifiedAPL('paladin', 'retribution');
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
    return 'blade_of_justice';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 징벌 특화 조건 평가
    const conditions = {
      'holy_power <= 0': gameState.holy_power <= 0,
      'holy_power <= 3': gameState.holy_power <= 3,
      'holy_power <= 4': gameState.holy_power <= 4,
      'holy_power >= 3': gameState.holy_power >= 3,
      'cooldown.ready': true, // 간소화
      'target.time_to_die > 8': gameState.target_time_to_die > 8,
      'buff.crusade.stack >= 10': gameState.buffs?.crusade?.stacks >= 10,
      'spell_targets >= 2': gameState.enemy_count >= 2,
      'target.health_pct <= 20': gameState.target_hp_percent <= 20,
      'buff.avenging_wrath.up': gameState.buffs?.avenging_wrath,
      '!buff.consecration.up': !gameState.buffs?.consecration,
      'buff.art_of_war.up': gameState.buffs?.art_of_war,
      'buff.divine_purpose.up': gameState.buffs?.divine_purpose
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 징벌 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        crusade_stacks: currentState.buffs?.crusade?.stacks || 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 성전 스택 관리
    if (currentState.buffs?.crusade && currentState.buffs.crusade.stacks < 10) {
      analysis.improvements.push({
        area: 'crusade',
        message: `성전 스택 증가 필요: ${currentState.buffs.crusade.stacks} → 10`,
        impact: 'high'
      });
    }

    // 신성한 힘 관리
    if (prediction.resourceScore < 90) {
      analysis.improvements.push({
        area: 'holy_power',
        message: '신성한 힘 관리 최적화 필요',
        impact: 'medium'
      });
    }

    // 쿨다운 정렬
    if (prediction.rotationScore < 85) {
      analysis.improvements.push({
        area: 'cooldowns',
        message: '재의 흔적과 응보의 격노 정렬 필요',
        impact: 'high'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (징벌 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 성전 스택 관리가 좋은 로그에 가중치
      if (log.avgCrusadeStacks >= 8) {
        log.weight = 1.5; // 좋은 예시
      } else if (log.avgCrusadeStacks < 5) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('⚔️ 징벌 성기사 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 징벌 성기사 신규 모델 생성');
    }

    console.log('✅ 징벌 성기사 AI 준비 완료');
  }
}

export default RetributionPaladinAI;