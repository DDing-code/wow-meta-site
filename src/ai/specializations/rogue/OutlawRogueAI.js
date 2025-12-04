// 도적 무법 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class OutlawRogueAI extends SpecializationAI {
  constructor() {
    super('rogue', 'outlaw');

    // 무법 도적 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'energy',
      primaryStat: 'agility',
      armorType: 'leather'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 무법 도적 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'sinister_strike', // 사악한 일격
        'ambush', // 매복
        'ghostly_strike', // 유령 일격
        'blade_flurry' // 칼날 난무 (광역)
      ],
      spender: [
        'pistol_shot', // 권총 사격 (기회 소모)
        'between_the_eyes', // 두 눈 사이
        'dispatch', // 급송
        'roll_the_bones', // 뼈 굴리기
        'blade_rush' // 칼날 돌진
      ],
      cooldowns: [
        { name: 'adrenaline_rush', cooldown: 180 }, // 아드레날린 쇄도
        { name: 'killing_spree', cooldown: 90 }, // 살육 광란
        { name: 'keep_it_rolling', cooldown: 420 }, // 굴려라
        { name: 'ghostly_strike', cooldown: 45 }, // 유령 일격
        { name: 'vanish', cooldown: 90 } // 은신
      ],
      buffs: [
        'opportunity', // 기회 (권총 사격)
        'adrenaline_rush', // 아드레날린 쇄도
        'skull_and_crossbones', // 해골과 교차뼈
        'grand_melee', // 대난투
        'ruthless_precision', // 무자비한 정밀함
        'true_bearing', // 진정한 방향
        'buried_treasure', // 매장된 보물
        'broadside' // 포격
      ],
      debuffs: [
        'between_the_eyes', // 두 눈 사이
        'ghostly_strike', // 유령 일격
        'cheap_shot', // 더러운 기습
        'kidney_shot' // 급소 가격
      ],
      procs: [
        'opportunity', // 기회 (권총 사격 프록)
        'loaded_dice', // 주사위 조작
        'restless_blades', // 불안한 칼날 (쿨다운 감소)
        'combat_potency' // 전투 잠재력
      ]
    };

    // 무법 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '은신', '질주', '그림자 발걸음', '회피',
        '더러운 기습', '급소 가격', '실명 가루', '소매치기'
      ],
      specTree: [
        '아드레날린 쇄도', '살육 광란', '굴려라', '유령 일격',
        '기회', '불안한 칼날', '주사위 조작', '칼날 난무',
        '대난투', '무자비한 정밀함', '진정한 방향', '포격'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'agility',
      2: 'haste', // 40% 목표 (에너지 재생)
      3: 'critical', // 30% 목표
      4: 'mastery',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'roll_the_bones', condition: 'buff_count < 2 || buff.loaded_dice.up' },
      { skill: 'adrenaline_rush', condition: 'cooldown.ready && combo_points >= 5' },
      { skill: 'pistol_shot', condition: 'buff.opportunity.up' },
      { skill: 'between_the_eyes', condition: 'combo_points >= 5' },
      { skill: 'dispatch', condition: 'combo_points >= 5 && target.health_pct <= 35' },
      { skill: 'killing_spree', condition: 'cooldown.ready' },
      { skill: 'ghostly_strike', condition: 'cooldown.ready' },
      { skill: 'blade_flurry', condition: 'spell_targets >= 2 && !buff.blade_flurry.up' },
      { skill: 'sinister_strike', condition: 'combo_points < 5' },
      { skill: 'ambush', condition: 'stealthed' }
    ];

    // 무법 특화 가중치
    this.learningWeights = {
      dps: 0.40, // DPS
      rotation: 0.30, // 뼈 굴리기 RNG 관리
      resource: 0.20, // 에너지/콤보 포인트
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 6900000, // 6.9M DPS
      targetCPM: 50, // 높은 APM
      roll_bones_efficiency: 85, // 뼈 굴리기 효율
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  // 무법 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 뼈 굴리기 버프 개수 평균
      avgRollBonesBuffs: combatLog.avgRollBonesBuffs || 0,

      // 기회 프록 활용률
      opportunityUsage: this.calculateOpportunityUsage(combatLog),

      // 아드레날린 쇄도 효율성
      adrenalineRushEfficiency: this.calculateAdrenalineRushEfficiency(combatLog),

      // 뼈 굴리기 재굴림 효율
      rollBonesRerollEfficiency: this.calculateRollBonesRerollEfficiency(combatLog),

      // 콤보 포인트 낭비율
      comboPointWaste: combatLog.resourceWaste?.combo_points || 0,

      // 에너지 낭비율
      energyWaste: combatLog.resourceWaste?.energy || 0,

      // 칼날 난무 사용률 (광역)
      bladeFlurryUsage: this.calculateBladeFlurryUsage(combatLog),

      // 불안한 칼날 효율
      restlessBladesEfficiency: this.calculateRestlessBladesEfficiency(combatLog),

      // 두 눈 사이 유지율
      betweenEyesUptime: combatLog.debuffUptimes?.between_the_eyes || 0
    };
  }

  // 기회 프록 활용률 계산
  calculateOpportunityUsage(combatLog) {
    if (!combatLog.procs) return 100;

    const opportunityProcs = combatLog.procs.opportunity || 0;
    const pistolShotUsage = combatLog.procUsage?.opportunity || 0;

    return opportunityProcs > 0
      ? (pistolShotUsage / opportunityProcs) * 100
      : 100;
  }

  // 아드레날린 쇄도 효율성 계산
  calculateAdrenalineRushEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const adrenalineRushes = combatLog.skills.filter(s => s.name === 'adrenaline_rush');
    let totalEfficiency = 0;

    adrenalineRushes.forEach(rush => {
      // 아드레날린 쇄도 시전시 뼈 굴리기 버프 수 확인
      const buffCount = rush.roll_bones_buffs || 0;
      // 2개 이상 버프가 이상적
      totalEfficiency += Math.min(100, (buffCount / 2) * 50 + 50);
    });

    return adrenalineRushes.length > 0
      ? totalEfficiency / adrenalineRushes.length
      : 0;
  }

  // 뼈 굴리기 재굴림 효율 계산
  calculateRollBonesRerollEfficiency(combatLog) {
    if (!combatLog.rollBonesHistory) return 0;

    const rerolls = combatLog.rollBonesHistory.filter(roll => roll.isReroll);
    let goodRerolls = 0;

    rerolls.forEach(reroll => {
      // 1버프에서 2+버프로 가거나, 안좋은 버프 조합 개선시 좋은 판단
      if (reroll.buffCountBefore < 2 && reroll.buffCountAfter >= 2) {
        goodRerolls++;
      } else if (reroll.improvedQuality) {
        goodRerolls++;
      }
    });

    return rerolls.length > 0
      ? (goodRerolls / rerolls.length) * 100
      : 100;
  }

  // 칼날 난무 사용률 계산
  calculateBladeFlurryUsage(combatLog) {
    if (!combatLog.skills) return 100;

    const bladeFlurries = combatLog.skills.filter(s => s.name === 'blade_flurry');

    // 광역 상황에서만 계산
    if (combatLog.averageTargets >= 2) {
      const combatDuration = combatLog.duration || 1;
      // 칼날 난무는 30초 지속
      const expectedUptime = Math.min(100, (combatDuration / 30) * 100);
      const actualUptime = combatLog.buffUptimes?.blade_flurry || 0;
      return Math.min(100, (actualUptime / expectedUptime) * 100);
    }

    return 100;
  }

  // 불안한 칼날 효율 계산
  calculateRestlessBladesEfficiency(combatLog) {
    if (!combatLog.cooldownReductions) return 0;

    const totalReduction = combatLog.cooldownReductions.restless_blades || 0;
    const finisherCasts = combatLog.finisherCasts || 0;

    // 마무리 기술당 평균 쿨다운 감소
    return finisherCasts > 0
      ? Math.min(100, (totalReduction / finisherCasts) * 10)
      : 0;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.3; // 무법은 중간 복잡도 (뼈 굴리기 RNG)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 뼈 굴리기 체크
    const buffCount = currentState.roll_bones_buff_count || 0;
    if (buffCount < 2) {
      advice.push(`뼈 굴리기 ${buffCount}버프 - 재굴림 고려`);
    }

    // 기회 프록
    if (currentState.buffs?.opportunity) {
      advice.push('기회 프록: 권총 사격!');
    }

    // 콤보 포인트 관리
    if (currentState.combo_points >= 5) {
      if (currentState.target_hp_percent <= 35) {
        advice.push('5콤보: 급송 (실행 구간)');
      } else {
        advice.push('5콤보: 두 눈 사이');
      }
    }

    // 에너지 관리
    if (currentState.energy >= 90) {
      advice.push('에너지 초과: 사악한 일격');
    } else if (currentState.energy < 40) {
      advice.push('에너지 부족: 잠시 대기');
    }

    // 광역
    if (currentState.enemy_count >= 2 && !currentState.buffs?.blade_flurry) {
      advice.push('칼날 난무 활성화 필요');
    }

    // 쿨다운
    if (currentState.cooldowns?.adrenaline_rush === 0 && buffCount >= 2) {
      advice.push('아드레날린 쇄도 사용 가능');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.energy < 40) {
      advice.push('에너지 부족: 잠시 대기');
    } else if (currentState.energy > 90) {
      advice.push('에너지 초과: 빌더 스킬 사용');
    }

    if (currentState.combo_points >= 5) {
      advice.push('콤보 포인트 최대: 마무리 기술 사용');
    }

    if (currentState.buffs?.adrenaline_rush) {
      advice.push('아드레날린 쇄도: 최대 APM으로 시전');
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
        '은신 → 매복',
        '뼈 굴리기',
        '사악한 일격 (5콤보)',
        '두 눈 사이',
        '아드레날린 쇄도',
        '살육 광란'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '급송 우선 (35% 이하)',
        '모든 쿨다운 사용',
        '뼈 굴리기 유지',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '아드레날린 쇄도 활성화',
        '2+버프 뼈 굴리기 유지',
        '기회 프록 즉시 사용',
        '최대 DPS 윈도우'
      ];
    } else {
      strategy.priorities = [
        '뼈 굴리기 2+버프 유지',
        '기회 프록 즉시 사용',
        '5콤보 마무리 기술',
        '에너지 90+ 방지'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 질주 사용');
      strategy.upcoming.push('쫄 페이즈: 칼날 난무');
    }

    return strategy;
  }

  // APL 조건 평가 (무법 특화)
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      'buff_count < 2': (gameState.roll_bones_buff_count || 0) < 2,
      'buff.loaded_dice.up': gameState.buffs?.loaded_dice,
      'cooldown.ready': true,
      'combo_points >= 5': gameState.combo_points >= 5,
      'combo_points < 5': gameState.combo_points < 5,
      'buff.opportunity.up': gameState.buffs?.opportunity,
      'target.health_pct <= 35': gameState.target_hp_percent <= 35,
      'spell_targets >= 2': gameState.enemy_count >= 2,
      '!buff.blade_flurry.up': !gameState.buffs?.blade_flurry,
      'stealthed': gameState.stealthed
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        dps: currentState.dps,
        buff_count: currentState.roll_bones_buff_count || 0,
        combo_points: currentState.combo_points || 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 뼈 굴리기 관리
    if (currentState.roll_bones_buff_count < 2) {
      analysis.improvements.push({
        area: 'roll_bones',
        message: `뼈 굴리기 버프 부족: ${currentState.roll_bones_buff_count} → 2+`,
        impact: 'high'
      });
    }

    // 기회 프록
    if (currentState.buffs?.opportunity) {
      analysis.improvements.push({
        area: 'opportunity',
        message: '기회 프록 즉시 사용 필요',
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

  // 학습 데이터 전처리 (무법 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 뼈 굴리기 관리가 좋은 로그에 가중치
      if (log.avgRollBonesBuffs >= 2.5) {
        log.weight = 1.5;
      } else if (log.avgRollBonesBuffs < 1.5) {
        log.weight = 0.5;
      } else {
        log.weight = 1.0;
      }

      // 기회 프록 활용률 고려
      if (log.opportunityUsage >= 95) {
        log.weight *= 1.3;
      } else if (log.opportunityUsage < 80) {
        log.weight *= 0.7;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('🏴‍☠️ 무법 도적 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 무법 도적 신규 모델 생성');
    }

    console.log('✅ 무법 도적 AI 준비 완료');
  }
}

export default OutlawRogueAI;