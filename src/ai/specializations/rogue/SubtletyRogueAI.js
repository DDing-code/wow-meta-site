// 도적 잠행 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class SubtletyRogueAI extends SpecializationAI {
  constructor() {
    super('rogue', 'subtlety');

    // 잠행 도적 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'energy',
      primaryStat: 'agility',
      armorType: 'leather'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 잠행 도적 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'backstab', // 배후 일격
        'shadowstrike', // 그림자 강타
        'cheap_shot', // 더러운 기습
        'gloomblade' // 암습
      ],
      spender: [
        'eviscerate', // 절개
        'rupture', // 출혈
        'black_powder', // 검은 화약 (광역)
        'secret_technique', // 비밀 기술
        'cold_blood' // 냉혈
      ],
      cooldowns: [
        { name: 'shadow_dance', cooldown: 60 }, // 그림자 무도 (3충전)
        { name: 'shadow_blades', cooldown: 180 }, // 그림자 칼날
        { name: 'vanish', cooldown: 90 }, // 은신
        { name: 'cold_blood', cooldown: 60 }, // 냉혈
        { name: 'shadowmeld', cooldown: 120 } // 그림자 숨기 (종족)
      ],
      buffs: [
        'stealth', // 은신
        'shadow_dance', // 그림자 무도
        'symbols_of_death', // 죽음의 표식
        'shadow_blades', // 그림자 칼날
        'slice_and_dice', // 베고 자르기
        'shadow_clone', // 그림자 분신
        'master_of_shadows', // 그림자의 달인
        'perforated_veins' // 구멍 뚫린 혈관
      ],
      debuffs: [
        'rupture', // 출혈
        'find_weakness', // 약점 찾기
        'shadowstrike', // 그림자 강타 디버프
        'cheap_shot', // 더러운 기습 (기절)
        'kidney_shot' // 급소 가격 (기절)
      ],
      procs: [
        'shadow_techniques', // 그림자 기술 (에너지 회복)
        'weaponmaster', // 무기 대가
        'shot_in_the_dark', // 어둠 속의 사격
        'deeper_daggers' // 더 깊은 단검
      ]
    };

    // 잠행 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '은신', '질주', '그림자 발걸음', '회피',
        '더러운 기습', '급소 가격', '실명 가루', '소매치기'
      ],
      specTree: [
        '그림자 무도', '그림자 칼날', '죽음의 표식', '냉혈',
        '그림자 기술', '무기 대가', '어둠 속의 사격', '그림자 분신',
        '그림자의 달인', '구멍 뚫린 혈관', '더 깊은 단검', '비밀 기술'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'agility',
      2: 'mastery', // 40% 목표 (은신시 피해 증가)
      3: 'critical', // 30% 목표
      4: 'haste', // 25% 목표
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'symbols_of_death', condition: 'cooldown.ready' },
      { skill: 'slice_and_dice', condition: '!buff.slice_and_dice.up' },
      { skill: 'cold_blood', condition: 'combo_points >= 5 && cooldown.ready' },
      { skill: 'rupture', condition: 'combo_points >= 5 && !debuff.rupture.up' },
      { skill: 'eviscerate', condition: 'combo_points >= 5' },
      { skill: 'shadow_dance', condition: 'cooldown.ready' },
      { skill: 'shadowstrike', condition: 'stealthed || buff.shadow_dance.up' },
      { skill: 'backstab', condition: 'combo_points < 5' },
      { skill: 'black_powder', condition: 'spell_targets >= 3 && combo_points >= 5' },
      { skill: 'vanish', condition: 'cooldown.ready' }
    ];

    // 잠행 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS 최우선
      rotation: 0.35, // 복잡한 은신 관리
      resource: 0.15, // 에너지/콤보 포인트
      survival: 0.05 // 최소 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7400000, // 7.4M DPS (높은 버스트)
      targetCPM: 45, // 높은 APM
      stealth_uptime: 25, // 은신/그림자 무도 유지율
      targetResourceEfficiency: 88
    };

    this.initialize();
  }

  // 잠행 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 은신 상태 유지율
      stealthUptime: this.calculateStealthUptime(combatLog),

      // 그림자 무도 효율성
      shadowDanceEfficiency: this.calculateShadowDanceEfficiency(combatLog),

      // 죽음의 표식 효율성
      symbolsOfDeathEfficiency: this.calculateSymbolsOfDeathEfficiency(combatLog),

      // 그림자 강타 사용 효율
      shadowstrikeUsage: this.calculateShadowstrikeUsage(combatLog),

      // 출혈 유지율
      ruptureUptime: combatLog.debuffUptimes?.rupture || 0,

      // 베고 자르기 유지율
      sliceAndDiceUptime: combatLog.buffUptimes?.slice_and_dice || 0,

      // 약점 찾기 활용률
      findWeaknessUsage: this.calculateFindWeaknessUsage(combatLog),

      // 콤보 포인트 낭비율
      comboPointWaste: combatLog.resourceWaste?.combo_points || 0,

      // 에너지 낭비율
      energyWaste: combatLog.resourceWaste?.energy || 0
    };
  }

  // 은신 상태 유지율 계산
  calculateStealthUptime(combatLog) {
    if (!combatLog.buffUptimes) return 0;

    const stealthTime = (combatLog.buffUptimes.stealth || 0) +
                       (combatLog.buffUptimes.shadow_dance || 0) +
                       (combatLog.buffUptimes.vanish || 0);

    const totalTime = combatLog.duration || 1;
    return (stealthTime / totalTime) * 100;
  }

  // 그림자 무도 효율성 계산
  calculateShadowDanceEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const shadowDances = combatLog.skills.filter(s => s.name === 'shadow_dance');
    let totalEfficiency = 0;

    shadowDances.forEach(dance => {
      // 그림자 무도 시전시 에너지량 확인
      const energyAtCast = dance.energy || 0;
      // 80+ 에너지가 이상적
      totalEfficiency += Math.min(100, (energyAtCast / 80) * 100);
    });

    return shadowDances.length > 0
      ? totalEfficiency / shadowDances.length
      : 0;
  }

  // 죽음의 표식 효율성 계산
  calculateSymbolsOfDeathEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const symbolsCasts = combatLog.skills.filter(s => s.name === 'symbols_of_death');
    let totalEfficiency = 0;

    symbolsCasts.forEach(symbols => {
      // 죽음의 표식 시전시 콤보 포인트 확인
      const comboPoints = symbols.combo_points || 0;
      // 0-1 콤보 포인트에서 사용하는게 이상적
      totalEfficiency += comboPoints <= 1 ? 100 : 60;
    });

    return symbolsCasts.length > 0
      ? totalEfficiency / symbolsCasts.length
      : 0;
  }

  // 그림자 강타 사용 효율 계산
  calculateShadowstrikeUsage(combatLog) {
    if (!combatLog.skills) return 100;

    const totalShadowstrikes = combatLog.skillCounts?.shadowstrike || 0;
    const stealthedShadowstrikes = combatLog.stealthedSkills?.shadowstrike || 0;

    return totalShadowstrikes > 0
      ? (stealthedShadowstrikes / totalShadowstrikes) * 100
      : 100;
  }

  // 약점 찾기 활용률 계산
  calculateFindWeaknessUsage(combatLog) {
    if (!combatLog.debuffApplications) return 100;

    const weaknessApplications = combatLog.debuffApplications.find_weakness || 0;
    const backstabsDuringWeakness = combatLog.comboUsage?.find_weakness || 0;

    return weaknessApplications > 0
      ? (backstabsDuringWeakness / weaknessApplications) * 100
      : 100;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.8; // 잠행은 최고 복잡도 (은신 관리)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 은신 상태 체크
    if (currentState.stealthed || currentState.buffs?.shadow_dance) {
      advice.push('은신 상태: 그림자 강타 우선!');
    }

    // 베고 자르기 체크
    if (!currentState.buffs?.slice_and_dice) {
      advice.push('베고 자르기 버프 없음!');
    }

    // 출혈 체크
    if (!currentState.debuffs?.rupture) {
      advice.push('출혈 디버프 없음');
    }

    // 콤보 포인트 관리
    if (currentState.combo_points >= 5) {
      if (!currentState.debuffs?.rupture) {
        advice.push('5콤보: 출혈 우선');
      } else {
        advice.push('5콤보: 절개 사용');
      }
    }

    // 죽음의 표식
    if (currentState.combo_points <= 1 && currentState.cooldowns?.symbols_of_death === 0) {
      advice.push('죽음의 표식 사용 가능');
    }

    // 그림자 무도 충전
    if (currentState.shadow_dance_charges >= 1) {
      advice.push('그림자 무도 충전 있음');
    }

    // 에너지 관리
    if (currentState.energy >= 90) {
      advice.push('에너지 초과: 배후 일격');
    } else if (currentState.energy < 40 && !currentState.stealthed) {
      advice.push('에너지 부족: 잠시 대기');
    }

    // 광역
    if (currentState.enemy_count >= 3 && currentState.combo_points >= 5) {
      advice.push('광역: 검은 화약 사용');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.energy < 40 && !currentState.stealthed) {
      advice.push('에너지 부족: 잠시 대기');
    } else if (currentState.energy > 90) {
      advice.push('에너지 초과: 빌더 스킬 사용');
    }

    if (currentState.combo_points >= 5) {
      advice.push('콤보 포인트 최대: 마무리 기술 사용');
    }

    if (currentState.buffs?.symbols_of_death) {
      advice.push('죽음의 표식: 최대 DPS로 시전');
    }

    if (currentState.shadow_dance_charges >= 2) {
      advice.push('그림자 무도 충전 많음: 사용 고려');
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
        '은신',
        '죽음의 표식',
        '그림자 강타',
        '베고 자르기',
        '출혈',
        '그림자 무도',
        '그림자 강타 연계'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '모든 쿨다운 사용',
        '그림자 무도 충전 소모',
        '은신 → 그림자 강타',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '죽음의 표식 + 그림자 칼날',
        '그림자 무도 연계',
        '냉혈로 마무리',
        '최대 DPS 윈도우'
      ];
    } else {
      strategy.priorities = [
        '출혈/베고 자르기 유지',
        '그림자 무도 충전 관리',
        '5콤보 마무리 기술',
        '에너지 90+ 방지'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 그림자 발걸음');
      strategy.upcoming.push('쫄 페이즈: 검은 화약');
    }

    return strategy;
  }

  // APL 조건 평가 (잠행 특화)
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      'cooldown.ready': true,
      '!buff.slice_and_dice.up': !gameState.buffs?.slice_and_dice,
      'combo_points >= 5': gameState.combo_points >= 5,
      'combo_points < 5': gameState.combo_points < 5,
      '!debuff.rupture.up': !gameState.debuffs?.rupture,
      'stealthed': gameState.stealthed,
      'buff.shadow_dance.up': gameState.buffs?.shadow_dance,
      'spell_targets >= 3': gameState.enemy_count >= 3,
      'combo_points <= 1': gameState.combo_points <= 1
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        dps: currentState.dps,
        combo_points: currentState.combo_points || 0,
        stealthed: currentState.stealthed || false
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 은신 상태 활용
    if (currentState.stealthed || currentState.buffs?.shadow_dance) {
      analysis.improvements.push({
        area: 'stealth',
        message: '은신 상태: 그림자 강타 즉시 사용',
        impact: 'very_high'
      });
    }

    // 버프/디버프 관리
    if (!currentState.buffs?.slice_and_dice) {
      analysis.improvements.push({
        area: 'buffs',
        message: '베고 자르기 버프 없음',
        impact: 'high'
      });
    }

    if (!currentState.debuffs?.rupture) {
      analysis.improvements.push({
        area: 'debuffs',
        message: '출혈 디버프 없음',
        impact: 'high'
      });
    }

    // 콤보 포인트 관리
    if (currentState.combo_points >= 5) {
      analysis.improvements.push({
        area: 'combo_points',
        message: '콤보 포인트 최대: 마무리 기술 필요',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (잠행 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 은신 유지율이 좋은 로그에 가중치
      if (log.stealthUptime >= 25) {
        log.weight = 1.5;
      } else if (log.stealthUptime < 15) {
        log.weight = 0.5;
      } else {
        log.weight = 1.0;
      }

      // 그림자 강타 효율 고려
      if (log.shadowstrikeUsage >= 90) {
        log.weight *= 1.3;
      } else if (log.shadowstrikeUsage < 70) {
        log.weight *= 0.7;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('🗡️ 잠행 도적 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 잠행 도적 신규 모델 생성');
    }

    console.log('✅ 잠행 도적 AI 준비 완료');
  }
}

export default SubtletyRogueAI;