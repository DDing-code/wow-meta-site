// 마법사 비전 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class ArcaneMageAI extends SpecializationAI {
  constructor() {
    super('mage', 'arcane');

    // 비전 마법사 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'mana',
      primaryStat: 'intellect',
      armorType: 'cloth'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 비전 마법사 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'arcane_blast', // 비전 작렬
        'arcane_missiles', // 비전 미사일
        'clearcasting', // 명료 (프록)
        'arcane_familiar' // 비전 사역마
      ],
      spender: [
        'arcane_barrage', // 비전 탄막
        'arcane_orb', // 비전 구슬
        'arcane_explosion', // 비전 폭발 (광역)
        'supernova', // 초신성
        'meteor' // 유성
      ],
      cooldowns: [
        { name: 'arcane_power', cooldown: 120 }, // 비전 강화
        { name: 'time_warp', cooldown: 300 }, // 시간 왜곡
        { name: 'touch_of_the_magi', cooldown: 45 }, // 마기의 손길
        { name: 'arcane_surge', cooldown: 90 }, // 비전 쇄도
        { name: 'mirror_image', cooldown: 120 } // 거울상
      ],
      buffs: [
        'arcane_charge', // 비전 충전 (4스택)
        'arcane_power', // 비전 강화
        'clearcasting', // 명료
        'presence_of_mind', // 정신의 존재
        'arcane_surge', // 비전 쇄도
        'nether_precision', // 황천의 정밀함
        'time_warp' // 시간 왜곡
      ],
      debuffs: [
        'touch_of_the_magi', // 마기의 손길
        'slow', // 둔화
        'frost_nova', // 얼음 화염구 (유틸)
        'arcane_orb' // 비전 구슬 디버프
      ],
      procs: [
        'clearcasting', // 명료 (무료 비전 미사일)
        'nether_precision', // 황천의 정밀함
        'arcane_charge', // 비전 충전 스택
        'rule_of_threes' // 3의 법칙
      ]
    };

    // 비전 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '시간 왜곡', '거울상', '얼음 방패', '점멸',
        '둔화', '얼음 화염구', '반마법 보호막', '마나 보호막'
      ],
      specTree: [
        '비전 강화', '마기의 손길', '비전 쇄도', '정신의 존재',
        '명료', '황천의 정밀함', '3의 법칙', '비전 구슬',
        '초신성', '유성', '공명', '비전 메아리'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'mastery', // 40% 목표 (비전 충전 효과)
      3: 'haste', // 25% 목표
      4: 'critical', // 20% 목표
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'touch_of_the_magi', condition: 'cooldown.ready && arcane_charges >= 4' },
      { skill: 'arcane_missiles', condition: 'buff.clearcasting.up' },
      { skill: 'arcane_power', condition: 'cooldown.ready && mana_pct >= 60' },
      { skill: 'arcane_surge', condition: 'buff.arcane_power.up' },
      { skill: 'arcane_barrage', condition: 'arcane_charges >= 4 && mana_pct <= 50' },
      { skill: 'arcane_blast', condition: 'arcane_charges < 4' },
      { skill: 'arcane_orb', condition: 'arcane_charges >= 4 && mana_pct >= 60' },
      { skill: 'supernova', condition: 'cooldown.ready' },
      { skill: 'arcane_explosion', condition: 'spell_targets >= 4' },
      { skill: 'arcane_blast', condition: 'default' }
    ];

    // 비전 특화 가중치
    this.learningWeights = {
      dps: 0.40, // DPS
      rotation: 0.30, // 복잡한 마나 관리
      resource: 0.25, // 마나 효율성이 핵심
      survival: 0.05 // 최소 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7500000, // 7.5M DPS (높은 버스트)
      targetCPM: 42, // 높은 APM
      arcane_charge_uptime: 95, // 비전 충전 유지율
      targetResourceEfficiency: 80 // 마나 효율성
    };

    this.initialize();
  }

  // 비전 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 비전 충전 평균 스택
      avgArcaneCharges: combatLog.avgArcaneCharges || 0,

      // 비전 강화 효율성
      arcanePowerEfficiency: this.calculateArcanePowerEfficiency(combatLog),

      // 명료 활용률
      clearcastingUsage: this.calculateClearcastingUsage(combatLog),

      // 마기의 손길 효율성
      touchOfMagiEfficiency: this.calculateTouchOfMagiEfficiency(combatLog),

      // 마나 낭비율
      manaWaste: combatLog.resourceWaste?.mana || 0,

      // 비전 충전 유지율
      arcaneChargeUptime: combatLog.buffUptimes?.arcane_charge || 0,

      // 4스택 유지율
      fourStackUptime: this.calculateFourStackUptime(combatLog),

      // 마나 효율성
      manaEfficiency: this.calculateManaEfficiency(combatLog),

      // 황천의 정밀함 활용률
      netherPrecisionUsage: this.calculateNetherPrecisionUsage(combatLog)
    };
  }

  // 비전 강화 효율 계산
  calculateArcanePowerEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const arcanePowers = combatLog.skills.filter(s => s.name === 'arcane_power');
    let totalEfficiency = 0;

    arcanePowers.forEach(power => {
      // 비전 강화 시전시 마나량 확인
      const manaAtCast = power.mana_percent || 0;
      // 60% 이상이 이상적
      totalEfficiency += Math.min(100, (manaAtCast / 60) * 100);
    });

    return arcanePowers.length > 0
      ? totalEfficiency / arcanePowers.length
      : 0;
  }

  // 명료 활용률 계산
  calculateClearcastingUsage(combatLog) {
    if (!combatLog.procs) return 100;

    const clearcastingProcs = combatLog.procs.clearcasting || 0;
    const missilesUsage = combatLog.procUsage?.clearcasting || 0;

    return clearcastingProcs > 0
      ? (missilesUsage / clearcastingProcs) * 100
      : 100;
  }

  // 마기의 손길 효율성 계산
  calculateTouchOfMagiEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const touchCasts = combatLog.skills.filter(s => s.name === 'touch_of_the_magi');
    let totalEfficiency = 0;

    touchCasts.forEach(touch => {
      // 마기의 손길 시전시 비전 충전 확인
      const chargesAtCast = touch.arcane_charges || 0;
      // 4스택이 이상적
      totalEfficiency += Math.min(100, (chargesAtCast / 4) * 100);
    });

    return touchCasts.length > 0
      ? totalEfficiency / touchCasts.length
      : 0;
  }

  // 4스택 유지율 계산
  calculateFourStackUptime(combatLog) {
    if (!combatLog.buffHistory) return 0;

    const arcaneChargeHistory = combatLog.buffHistory.arcane_charge || [];
    let fourStackTime = 0;
    const totalTime = combatLog.duration || 1;

    arcaneChargeHistory.forEach(period => {
      if (period.stacks === 4) {
        fourStackTime += period.duration;
      }
    });

    return (fourStackTime / totalTime) * 100;
  }

  // 마나 효율성 계산
  calculateManaEfficiency(combatLog) {
    if (!combatLog.manaUsage) return 80;

    const totalManaSpent = combatLog.manaUsage.total || 1;
    const damageDealt = combatLog.damage?.total || 0;

    // 마나당 피해량
    return Math.min(100, (damageDealt / totalManaSpent) / 100);
  }

  // 황천의 정밀함 활용률 계산
  calculateNetherPrecisionUsage(combatLog) {
    if (!combatLog.procs) return 100;

    const netherProcs = combatLog.procs.nether_precision || 0;
    const usage = combatLog.procUsage?.nether_precision || 0;

    return netherProcs > 0
      ? (usage / netherProcs) * 100
      : 100;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.7; // 비전은 높은 복잡도 (마나 관리)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 비전 충전 관리
    if (currentState.arcane_charges < 4) {
      advice.push(`비전 충전 ${currentState.arcane_charges}스택 - 비전 작렬 계속`);
    }

    // 명료 프록
    if (currentState.buffs?.clearcasting) {
      advice.push('명료: 비전 미사일 무료 사용!');
    }

    // 황천의 정밀함 프록
    if (currentState.buffs?.nether_precision) {
      advice.push('황천의 정밀함: 다음 스킬 치확 100%');
    }

    // 마나 관리
    if (currentState.mana_percent <= 30) {
      advice.push('마나 부족: 비전 탄막으로 회복');
    } else if (currentState.mana_percent >= 90 && currentState.arcane_charges >= 4) {
      advice.push('마나 충분: 비전 구슬 사용 가능');
    }

    // 버스트 타이밍
    if (currentState.arcane_charges >= 4 && currentState.mana_percent >= 60) {
      if (currentState.cooldowns?.arcane_power === 0) {
        advice.push('버스트 타이밍: 비전 강화 사용!');
      }
      if (currentState.cooldowns?.touch_of_the_magi === 0) {
        advice.push('마기의 손길 사용 가능');
      }
    }

    // 광역
    if (currentState.enemy_count >= 4) {
      advice.push('광역: 비전 폭발 사용');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.mana_percent <= 30) {
      advice.push('마나 위험: 즉시 비전 탄막으로 회복');
    } else if (currentState.mana_percent <= 50) {
      advice.push('마나 주의: 비전 탄막 고려');
    } else if (currentState.mana_percent >= 90) {
      advice.push('마나 충분: 공격적 스킬 사용');
    }

    if (currentState.buffs?.arcane_power) {
      advice.push('비전 강화 활성: 마나 무시하고 최대 DPS');
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
        '비전 작렬 (4스택)',
        '마기의 손길',
        '비전 강화',
        '비전 쇄도',
        '비전 구슬',
        '비전 작렬 연계'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '비전 강화 + 시간 왜곡',
        '4스택 비전 구슬 연타',
        '명료 즉시 사용',
        '마나 무시 최대 DPS'
      ];
    } else if (phase === 'conserve') {
      strategy.priorities = [
        '마나 회복 최우선',
        '비전 탄막으로 충전 초기화',
        '명료만 미사일 사용',
        '마나 60% 이상시 다음 버스트'
      ];
    } else {
      strategy.priorities = [
        '4스택 유지',
        '명료 프록 즉시 사용',
        '마나 50% 이하시 탄막',
        '쿨다운 정렬'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 인스턴트만');
      strategy.upcoming.push('쫄 페이즈: 비전 폭발');
    }

    return strategy;
  }

  // APL 조건 평가 (비전 특화)
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      'cooldown.ready': true,
      'arcane_charges >= 4': gameState.arcane_charges >= 4,
      'arcane_charges < 4': gameState.arcane_charges < 4,
      'buff.clearcasting.up': gameState.buffs?.clearcasting,
      'mana_pct >= 60': gameState.mana_percent >= 60,
      'mana_pct <= 50': gameState.mana_percent <= 50,
      'buff.arcane_power.up': gameState.buffs?.arcane_power,
      'spell_targets >= 4': gameState.enemy_count >= 4,
      'buff.nether_precision.up': gameState.buffs?.nether_precision,
      'default': true
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        dps: currentState.dps,
        arcane_charges: currentState.arcane_charges || 0,
        mana_percent: currentState.mana_percent || 100
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 비전 충전 관리
    if (currentState.arcane_charges < 4) {
      analysis.improvements.push({
        area: 'charges',
        message: `비전 충전 부족: ${currentState.arcane_charges} → 4 스택`,
        impact: 'high'
      });
    }

    // 마나 관리
    if (prediction.resourceScore < 80) {
      analysis.improvements.push({
        area: 'mana',
        message: '마나 관리 최적화 필요',
        impact: 'high'
      });
    }

    // 프록 활용
    if (currentState.buffs?.clearcasting || currentState.buffs?.nether_precision) {
      analysis.improvements.push({
        area: 'procs',
        message: '프록 즉시 활용 필요',
        impact: 'very_high'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (비전 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 4스택 유지율이 좋은 로그에 가중치
      if (log.fourStackUptime >= 90) {
        log.weight = 1.5;
      } else if (log.fourStackUptime < 70) {
        log.weight = 0.5;
      } else {
        log.weight = 1.0;
      }

      // 마나 효율성 고려
      if (log.manaEfficiency >= 85) {
        log.weight *= 1.3;
      } else if (log.manaEfficiency < 65) {
        log.weight *= 0.7;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('🔮 비전 마법사 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 비전 마법사 신규 모델 생성');
    }

    console.log('✅ 비전 마법사 AI 준비 완료');
  }
}

export default ArcaneMageAI;