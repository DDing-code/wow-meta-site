// 사냥꾼 사격 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class MarksmanshipHunterAI extends SpecializationAI {
  constructor() {
    super('hunter', 'marksmanship');

    // 사격 사냥꾼 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'focus',
      primaryStat: 'agility',
      armorType: 'mail'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 사격 사냥꾼 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'steady_shot', // 정조준 사격
        'arcane_shot', // 비전 사격
        'multi_shot', // 연발 사격 (광역)
        'aimed_shot' // 조준 사격 (집중 생성)
      ],
      spender: [
        'aimed_shot', // 조준 사격
        'rapid_fire', // 연사
        'kill_shot', // 마무리 사격
        'explosive_shot', // 폭발 사격
        'wailing_arrow', // 애도의 화살
        'chimaera_shot' // 키메라 사격
      ],
      cooldowns: [
        { name: 'trueshot', cooldown: 180 }, // 명사격
        { name: 'double_tap', cooldown: 60 }, // 이중 사격
        { name: 'volley', cooldown: 45 }, // 화살비
        { name: 'explosive_shot', cooldown: 30 }, // 폭발 사격
        { name: 'wind_arrows', cooldown: 60 } // 바람의 화살
      ],
      buffs: [
        'trueshot', // 명사격
        'precise_shots', // 정밀 사격
        'lock_and_load', // 탄약 장전
        'steady_focus', // 정조준 집중
        'trick_shot', // 속임수 사격
        'wind_arrows' // 바람의 화살
      ],
      debuffs: [
        'hunters_mark', // 사냥꾼의 징표
        'serpent_sting', // 독사 쐐기
        'explosive_shot' // 폭발 사격 디버프
      ],
      procs: [
        'lock_and_load', // 탄약 장전 (무료 조준 사격)
        'precise_shots', // 정밀 사격
        'calling_the_shots', // 사격의 소명
        'trick_shot' // 속임수 사격
      ]
    };

    // 사격 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '사냥꾼의 징표', '상급자 집중', '위장', '생존 전술',
        '타르 덫', '얼음 덫', '저항의 상', '치타의 상'
      ],
      specTree: [
        '명사격', '화살비', '이중 사격', '폭발 사격',
        '탄약 장전', '정조준 집중', '속임수 사격', '사격의 소명',
        '바람의 화살', '치명적인 사격', '정밀 집중', '연사'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'agility',
      2: 'critical', // 40% 목표
      3: 'mastery', // 35% 목표
      4: 'haste', // 15% 목표
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'hunters_mark', condition: '!debuff.hunters_mark.up' },
      { skill: 'explosive_shot', condition: 'cooldown.ready' },
      { skill: 'kill_shot', condition: 'target.health_pct <= 20' },
      { skill: 'volley', condition: 'spell_targets >= 3 && cooldown.ready' },
      { skill: 'aimed_shot', condition: 'buff.lock_and_load.up || buff.precise_shots.up' },
      { skill: 'trueshot', condition: 'cooldown.ready' },
      { skill: 'rapid_fire', condition: 'focus >= 50' },
      { skill: 'chimaera_shot', condition: 'focus >= 40' },
      { skill: 'multi_shot', condition: 'spell_targets >= 3 && !buff.trick_shot.up' },
      { skill: 'arcane_shot', condition: 'focus >= 40' },
      { skill: 'steady_shot', condition: 'focus < 80' }
    ];

    // 사격 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS 최우선
      rotation: 0.30, // 복잡한 로테이션
      resource: 0.20, // 집중 관리
      survival: 0.05 // 최소 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7200000, // 7.2M DPS (높은 버스트)
      targetCPM: 40, // 높은 APM
      aimed_shot_casts: 25, // 조준 사격 최소 횟수 (5분)
      targetResourceEfficiency: 85
    };

    this.initialize();
  }

  // 사격 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 조준 사격 시전 수
      aimedShotCasts: combatLog.skillCounts?.aimed_shot || 0,

      // 명사격 효율성
      trueshotEfficiency: this.calculateTrueshotEfficiency(combatLog),

      // 탄약 장전 활용률
      lockAndLoadUsage: this.calculateLockAndLoadUsage(combatLog),

      // 정밀 사격 활용률
      preciseShotsUsage: this.calculatePreciseShotsUsage(combatLog),

      // 집중 낭비율
      focusWaste: combatLog.resourceWaste?.focus || 0,

      // 연사 효율성
      rapidFireEfficiency: this.calculateRapidFireEfficiency(combatLog),

      // 화살비/속임수 사격 사용률
      volleyUsage: this.calculateVolleyUsage(combatLog),

      // 폭발 사격 사용 효율
      explosiveShotEfficiency: this.calculateExplosiveShotEfficiency(combatLog),

      // 정조준 집중 유지율
      steadyFocusUptime: combatLog.buffUptimes?.steady_focus || 0
    };
  }

  // 명사격 효율 계산
  calculateTrueshotEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const trueshots = combatLog.skills.filter(s => s.name === 'trueshot');
    let totalEfficiency = 0;

    trueshots.forEach(trueshot => {
      // 명사격 시전시 집중량 확인
      const focusAtCast = trueshot.focus || 0;
      // 50+ 집중이 이상적
      totalEfficiency += Math.min(100, (focusAtCast / 50) * 100);
    });

    return trueshots.length > 0
      ? totalEfficiency / trueshots.length
      : 0;
  }

  // 탄약 장전 활용률 계산
  calculateLockAndLoadUsage(combatLog) {
    if (!combatLog.procs) return 100;

    const lockAndLoadProcs = combatLog.procs.lock_and_load || 0;
    const aimedShotDuringProc = combatLog.procUsage?.lock_and_load || 0;

    return lockAndLoadProcs > 0
      ? (aimedShotDuringProc / lockAndLoadProcs) * 100
      : 100;
  }

  // 정밀 사격 활용률 계산
  calculatePreciseShotsUsage(combatLog) {
    if (!combatLog.procs) return 100;

    const preciseShotsProcs = combatLog.procs.precise_shots || 0;
    const aimedShotDuringProc = combatLog.procUsage?.precise_shots || 0;

    return preciseShotsProcs > 0
      ? (aimedShotDuringProc / preciseShotsProcs) * 100
      : 100;
  }

  // 연사 효율성 계산
  calculateRapidFireEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const rapidFires = combatLog.skills.filter(s => s.name === 'rapid_fire');
    const combatDuration = combatLog.duration || 1;

    // 연사는 20초 쿨다운
    const expectedCasts = Math.floor(combatDuration / 20) + 1;

    return Math.min(100, (rapidFires.length / expectedCasts) * 100);
  }

  // 화살비 사용률 계산
  calculateVolleyUsage(combatLog) {
    if (!combatLog.skills) return 100;

    const volleys = combatLog.skills.filter(s => s.name === 'volley');

    // 광역 상황에서만 계산
    if (combatLog.averageTargets >= 3) {
      const combatDuration = combatLog.duration || 1;
      // 화살비는 45초 쿨다운
      const expectedCasts = Math.floor(combatDuration / 45) + 1;
      return Math.min(100, (volleys.length / expectedCasts) * 100);
    }

    return 100;
  }

  // 폭발 사격 효율 계산
  calculateExplosiveShotEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const explosiveShots = combatLog.skills.filter(s => s.name === 'explosive_shot');
    const combatDuration = combatLog.duration || 1;

    // 폭발 사격은 30초 쿨다운
    const expectedCasts = Math.floor(combatDuration / 30) + 1;

    return Math.min(100, (explosiveShots.length / expectedCasts) * 100);
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.5; // 사격은 높은 복잡도
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 사냥꾼의 징표 체크
    if (!currentState.debuffs?.hunters_mark) {
      advice.push('사냥꾼의 징표 적용!');
    }

    // 탄약 장전 프록
    if (currentState.buffs?.lock_and_load) {
      advice.push('탄약 장전: 즉시 조준 사격!');
    }

    // 정밀 사격 프록
    if (currentState.buffs?.precise_shots) {
      advice.push('정밀 사격: 조준 사격 사용');
    }

    // 집중 관리
    if (currentState.focus < 40) {
      advice.push('집중 부족: 정조준 사격');
    } else if (currentState.focus >= 80) {
      advice.push('집중 초과: 연사/조준 사격');
    }

    // 광역
    if (currentState.enemy_count >= 3) {
      if (!currentState.buffs?.trick_shot) {
        advice.push('연발 사격으로 속임수 사격 활성화');
      }
      if (currentState.cooldowns?.volley === 0) {
        advice.push('화살비 사용 가능');
      }
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

    if (currentState.focus < 40) {
      advice.push('집중 부족: 정조준 사격으로 회복');
    } else if (currentState.focus > 90) {
      advice.push('집중 초과: 연사나 조준 사격 사용');
    }

    if (currentState.buffs?.steady_focus) {
      advice.push('정조준 집중 버프 유지됨');
    } else {
      advice.push('정조준 집중 활성화 필요');
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
        '명사격',
        '연사',
        '조준 사격',
        '폭발 사격',
        '키메라 사격'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '마무리 사격 최우선',
        '탄약 장전 활용',
        '모든 쿨다운 사용',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '명사격 활성화',
        '연사 + 조준 사격',
        '폭발 사격 정렬',
        '최대 DPS 윈도우'
      ];
    } else {
      strategy.priorities = [
        '프록 즉시 활용',
        '정조준 집중 유지',
        '집중 40-80 유지',
        '쿨다운 정렬'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 인스턴트 스킬만');
      strategy.upcoming.push('쫄 페이즈: 화살비 + 속임수 사격');
    }

    return strategy;
  }

  // APL 조건 평가 (사격 특화)
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      '!debuff.hunters_mark.up': !gameState.debuffs?.hunters_mark,
      'cooldown.ready': true,
      'target.health_pct <= 20': gameState.target_hp_percent <= 20,
      'spell_targets >= 3': gameState.enemy_count >= 3,
      'buff.lock_and_load.up': gameState.buffs?.lock_and_load,
      'buff.precise_shots.up': gameState.buffs?.precise_shots,
      'focus >= 50': gameState.focus >= 50,
      'focus >= 40': gameState.focus >= 40,
      'focus < 80': gameState.focus < 80,
      '!buff.trick_shot.up': !gameState.buffs?.trick_shot,
      'buff.steady_focus.down': !gameState.buffs?.steady_focus
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        dps: currentState.dps,
        focus: currentState.focus || 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 프록 활용
    if (currentState.buffs?.lock_and_load || currentState.buffs?.precise_shots) {
      analysis.improvements.push({
        area: 'procs',
        message: '프록 즉시 활용 필요',
        impact: 'very_high'
      });
    }

    // 집중 관리
    if (prediction.resourceScore < 80) {
      analysis.improvements.push({
        area: 'focus',
        message: '집중 관리 최적화 필요',
        impact: 'high'
      });
    }

    // 쿨다운 정렬
    if (prediction.rotationScore < 80) {
      analysis.improvements.push({
        area: 'cooldowns',
        message: '명사격과 버스트 스킬 정렬 필요',
        impact: 'high'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (사격 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 프록 활용이 좋은 로그에 가중치
      const procUsage = (log.procUsage?.lock_and_load || 0) + (log.procUsage?.precise_shots || 0);
      if (procUsage >= 90) {
        log.weight = 1.5;
      } else if (procUsage < 70) {
        log.weight = 0.5;
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('🎯 사격 사냥꾼 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 사격 사냥꾼 신규 모델 생성');
    }

    console.log('✅ 사격 사냥꾼 AI 준비 완료');
  }
}

export default MarksmanshipHunterAI;