// 마법사 냉기 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class FrostMageAI extends SpecializationAI {
  constructor() {
    super('mage', 'frost');

    // 냉기 마법사 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'mana',
      primaryStat: 'intellect',
      armorType: 'cloth'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 냉기 마법사 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'frostbolt', // 냉기 화살
        'flurry', // 눈보라
        'ice_lance', // 얼음 창
        'frozen_orb' // 얼어붙은 구슬
      ],
      spender: [
        'ice_lance', // 얼음 창 (샤터 콤보)
        'glacial_spike', // 빙하 쐐기
        'comet_storm', // 혜성 폭풍
        'ray_of_frost', // 냉기 광선
        'meteor' // 유성
      ],
      cooldowns: [
        { name: 'icy_veins', cooldown: 180 }, // 얼음 핏줄
        { name: 'time_warp', cooldown: 300 }, // 시간 왜곡
        { name: 'frozen_orb', cooldown: 60 }, // 얼어붙은 구슬
        { name: 'comet_storm', cooldown: 30 }, // 혜성 폭풍
        { name: 'mirror_image', cooldown: 120 } // 거울상
      ],
      buffs: [
        'brain_freeze', // 뇌동결 (무료 눈보라)
        'fingers_of_frost', // 서리 손가락 (샤터)
        'icy_veins', // 얼음 핏줄
        'winter_chill', // 혹한의 냉기
        'shatter', // 파쇄 (치확 증가)
        'ice_floes', // 얼음 흐름
        'time_warp' // 시간 왜곡
      ],
      debuffs: [
        'winter_chill', // 혹한의 냉기
        'frozen', // 동결
        'slow', // 둔화
        'frost_nova', // 얼음 화염구
        'glacial_spike' // 빙하 쐐기 디버프
      ],
      procs: [
        'brain_freeze', // 뇌동결 (무료 눈보라)
        'fingers_of_frost', // 서리 손가락 (2충전)
        'icicles', // 고드름 (빙하 쐐기용)
        'frostbolt_damage' // 냉기 화살 피해량 증가
      ]
    };

    // 냉기 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '시간 왜곡', '거울상', '얼음 방패', '점멸',
        '둔화', '얼음 화염구', '반마법 보호막', '마나 보호막'
      ],
      specTree: [
        '얼음 핏줄', '얼어붙은 구슬', '혜성 폭풍', '냉기 광선',
        '뇌동결', '서리 손가락', '파쇄', '빙하 쐐기',
        '혹한의 냉기', '얼음 흐름', '냉기 우위', '얼음 형태'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'critical', // 33.34% 목표 (파쇄 효과)
      3: 'haste', // 30% 목표
      4: 'mastery', // 25% 목표
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'flurry', condition: 'buff.brain_freeze.up && !buff.winter_chill.up' },
      { skill: 'ice_lance', condition: 'buff.fingers_of_frost.up || debuff.winter_chill.up' },
      { skill: 'frozen_orb', condition: 'cooldown.ready' },
      { skill: 'comet_storm', condition: 'cooldown.ready' },
      { skill: 'glacial_spike', condition: 'icicles >= 5' },
      { skill: 'icy_veins', condition: 'cooldown.ready' },
      { skill: 'ray_of_frost', condition: 'buff.icy_veins.up' },
      { skill: 'ice_lance', condition: 'spell_targets >= 3' },
      { skill: 'blizzard', condition: 'spell_targets >= 5' },
      { skill: 'frostbolt', condition: 'default' }
    ];

    // 냉기 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS 최우선
      rotation: 0.30, // 프록 관리 중요
      resource: 0.15, // 마나는 상대적으로 여유
      survival: 0.10 // 유틸성 고려
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7300000, // 7.3M DPS (안정적 높은 DPS)
      targetCPM: 38, // 중간-높은 APM
      shatter_combo_efficiency: 90, // 샤터 콤보 효율
      targetResourceEfficiency: 85
    };

    this.initialize();
  }

  // 냉기 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 뇌동결 활용률
      brainFreezeUsage: this.calculateBrainFreezeUsage(combatLog),

      // 서리 손가락 활용률
      fingersOfFrostUsage: this.calculateFingersOfFrostUsage(combatLog),

      // 샤터 콤보 효율성
      shatterComboEfficiency: this.calculateShatterComboEfficiency(combatLog),

      // 얼음 핏줄 효율성
      icyVeinsEfficiency: this.calculateIcyVeinsEfficiency(combatLog),

      // 고드름 관리
      icicleManagement: this.calculateIcicleManagement(combatLog),

      // 얼어붙은 구슬 효율
      frozenOrbEfficiency: this.calculateFrozenOrbEfficiency(combatLog),

      // 혹한의 냉기 활용률
      winterChillUsage: this.calculateWinterChillUsage(combatLog),

      // 냉기 화살 시전 수
      frostboltCasts: combatLog.skillCounts?.frostbolt || 0,

      // 마나 효율성
      manaEfficiency: this.calculateManaEfficiency(combatLog)
    };
  }

  // 뇌동결 활용률 계산
  calculateBrainFreezeUsage(combatLog) {
    if (!combatLog.procs) return 100;

    const brainFreezeProcs = combatLog.procs.brain_freeze || 0;
    const flurryUsage = combatLog.procUsage?.brain_freeze || 0;

    return brainFreezeProcs > 0
      ? (flurryUsage / brainFreezeProcs) * 100
      : 100;
  }

  // 서리 손가락 활용률 계산
  calculateFingersOfFrostUsage(combatLog) {
    if (!combatLog.procs) return 100;

    const fingersProcs = combatLog.procs.fingers_of_frost || 0;
    const iceLanceUsage = combatLog.procUsage?.fingers_of_frost || 0;

    return fingersProcs > 0
      ? (iceLanceUsage / fingersProcs) * 100
      : 100;
  }

  // 샤터 콤보 효율성 계산
  calculateShatterComboEfficiency(combatLog) {
    if (!combatLog.combos) return 0;

    const totalIceLances = combatLog.skillCounts?.ice_lance || 0;
    const shatteredIceLances = combatLog.combos?.shatter || 0;

    return totalIceLances > 0
      ? (shatteredIceLances / totalIceLances) * 100
      : 0;
  }

  // 얼음 핏줄 효율성 계산
  calculateIcyVeinsEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const icyVeinsCasts = combatLog.skills.filter(s => s.name === 'icy_veins');
    let totalEfficiency = 0;

    icyVeinsCasts.forEach(veins => {
      // 얼음 핏줄 시전시 상황 확인
      const hasProcs = (veins.brain_freeze || 0) + (veins.fingers_of_frost || 0);
      // 프록이 있을때 사용하는게 이상적
      totalEfficiency += Math.min(100, hasProcs > 0 ? 100 : 70);
    });

    return icyVeinsCasts.length > 0
      ? totalEfficiency / icyVeinsCasts.length
      : 0;
  }

  // 고드름 관리 계산
  calculateIcicleManagement(combatLog) {
    if (!combatLog.skills) return 100;

    const glacialSpikes = combatLog.skills.filter(s => s.name === 'glacial_spike');
    let wastedIcicles = 0;

    // 5개 고드름에서 빙하 쐐기를 사용하지 않은 경우
    if (combatLog.icicleWaste) {
      wastedIcicles = combatLog.icicleWaste;
    }

    const totalIcicles = (glacialSpikes.length * 5) + wastedIcicles;

    return totalIcicles > 0
      ? ((totalIcicles - wastedIcicles) / totalIcicles) * 100
      : 100;
  }

  // 얼어붙은 구슬 효율 계산
  calculateFrozenOrbEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const frozenOrbs = combatLog.skills.filter(s => s.name === 'frozen_orb');
    const combatDuration = combatLog.duration || 1;

    // 얼어붙은 구슬은 60초 쿨다운
    const expectedCasts = Math.floor(combatDuration / 60) + 1;

    return Math.min(100, (frozenOrbs.length / expectedCasts) * 100);
  }

  // 혹한의 냉기 활용률 계산
  calculateWinterChillUsage(combatLog) {
    if (!combatLog.debuffHistory) return 100;

    const winterChillApplications = combatLog.debuffApplications?.winter_chill || 0;
    const iceLancesDuringChill = combatLog.comboUsage?.winter_chill || 0;

    return winterChillApplications > 0
      ? (iceLancesDuringChill / winterChillApplications) * 100
      : 100;
  }

  // 마나 효율성 계산
  calculateManaEfficiency(combatLog) {
    if (!combatLog.manaUsage) return 85;

    const totalManaSpent = combatLog.manaUsage.total || 1;
    const damageDealt = combatLog.damage?.total || 0;

    return Math.min(100, (damageDealt / totalManaSpent) / 120);
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.4; // 냉기는 중간-높은 복잡도 (프록 관리)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 뇌동결 프록
    if (currentState.buffs?.brain_freeze) {
      advice.push('뇌동결: 즉시 눈보라 사용!');
    }

    // 서리 손가락 프록
    if (currentState.buffs?.fingers_of_frost) {
      const stacks = currentState.fingers_of_frost_stacks || 1;
      advice.push(`서리 손가락 ${stacks}스택: 얼음 창!`);
    }

    // 혹한의 냉기 디버프
    if (currentState.debuffs?.winter_chill) {
      advice.push('혹한의 냉기: 얼음 창으로 샤터!');
    }

    // 고드름 관리
    if (currentState.icicles >= 5) {
      advice.push('고드름 5개: 빙하 쐐기 사용!');
    }

    // 얼어붙은 구슬 쿨다운
    if (currentState.cooldowns?.frozen_orb === 0) {
      advice.push('얼어붙은 구슬 사용 가능');
    }

    // 마나 확인
    if (currentState.mana_percent <= 20) {
      advice.push('마나 부족: 에보케이션 고려');
    }

    // 광역
    if (currentState.enemy_count >= 3) {
      advice.push('광역: 얼음 창 우선, 5+ 눈보라');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.mana_percent <= 20) {
      advice.push('마나 위험: 에보케이션 필요');
    } else if (currentState.mana_percent <= 40) {
      advice.push('마나 주의: 마나 젬 사용');
    }

    if (currentState.buffs?.icy_veins) {
      advice.push('얼음 핏줄 활성: 최대 시전 속도');
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
        '얼어붙은 구슬',
        '냉기 화살',
        '뇌동결 → 눈보라',
        '서리 손가락 → 얼음 창',
        '빙하 쐐기',
        '얼음 핏줄'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '얼음 핏줄 + 시간 왜곡',
        '모든 프록 즉시 사용',
        '혜성 폭풍 정렬',
        '최대 DPS 윈도우'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '모든 쿨다운 사용',
        '프록 무시하고 시전',
        '마나 무시하고 DPS',
        '마지막 스퍼트'
      ];
    } else {
      strategy.priorities = [
        '프록 즉시 활용',
        '샤터 콤보 완성',
        '고드름 5개 관리',
        '쿨다운 정렬'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 얼음 흐름 활용');
      strategy.upcoming.push('쫄 페이즈: 얼어붙은 구슬 + 눈보라');
    }

    return strategy;
  }

  // APL 조건 평가 (냉기 특화)
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      'buff.brain_freeze.up': gameState.buffs?.brain_freeze,
      '!buff.winter_chill.up': !gameState.buffs?.winter_chill,
      'buff.fingers_of_frost.up': gameState.buffs?.fingers_of_frost,
      'debuff.winter_chill.up': gameState.debuffs?.winter_chill,
      'cooldown.ready': true,
      'icicles >= 5': gameState.icicles >= 5,
      'buff.icy_veins.up': gameState.buffs?.icy_veins,
      'spell_targets >= 3': gameState.enemy_count >= 3,
      'spell_targets >= 5': gameState.enemy_count >= 5,
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
        icicles: currentState.icicles || 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 프록 활용
    if (currentState.buffs?.brain_freeze || currentState.buffs?.fingers_of_frost) {
      analysis.improvements.push({
        area: 'procs',
        message: '프록 즉시 활용 필요',
        impact: 'very_high'
      });
    }

    // 고드름 관리
    if (currentState.icicles >= 5) {
      analysis.improvements.push({
        area: 'icicles',
        message: '고드름 5개: 빙하 쐐기 사용 필요',
        impact: 'high'
      });
    }

    // 샤터 콤보
    if (prediction.rotationScore < 85) {
      analysis.improvements.push({
        area: 'shatter',
        message: '샤터 콤보 효율성 향상 필요',
        impact: 'high'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (냉기 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 샤터 콤보 효율이 좋은 로그에 가중치
      if (log.shatterComboEfficiency >= 90) {
        log.weight = 1.5;
      } else if (log.shatterComboEfficiency < 70) {
        log.weight = 0.5;
      } else {
        log.weight = 1.0;
      }

      // 프록 활용률 고려
      const procUsage = (log.brainFreezeUsage + log.fingersOfFrostUsage) / 2;
      if (procUsage >= 95) {
        log.weight *= 1.3;
      } else if (procUsage < 80) {
        log.weight *= 0.7;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('❄️ 냉기 마법사 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 냉기 마법사 신규 모델 생성');
    }

    console.log('✅ 냉기 마법사 AI 준비 완료');
  }
}

export default FrostMageAI;