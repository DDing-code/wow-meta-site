// 도적 암살 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class AssassinationRogueAI extends SpecializationAI {
  constructor() {
    super('rogue', 'assassination');

    // 암살 도적 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'energy',
      secondaryResource: 'combo_points',
      primaryStat: 'agility',
      armorType: 'leather'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 암살 도적 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'mutilate', // 절단
        'ambush', // 매복
        'fan_of_knives', // 칼날 부채 (광역)
        'poisoned_knife', // 독칼날 (원거리)
        'garrote' // 목 조르기
      ],
      spender: [
        'envenom', // 독살
        'rupture', // 파열
        'slice_and_dice', // 난도질
        'crimson_tempest', // 진홍색 폭풍 (광역)
        'deathmark' // 죽음표식
      ],
      cooldowns: [
        { name: 'deathmark', cooldown: 120 }, // 죽음표식
        { name: 'kingsbane', cooldown: 60 }, // 왕의 파멸
        { name: 'shiv', cooldown: 25 }, // 급속 도포
        { name: 'indiscriminate_carnage', cooldown: 90 }, // 무차별 살육
        { name: 'sepsis', cooldown: 90 } // 패혈증
      ],
      buffs: [
        'slice_and_dice', // 난도질
        'envenom', // 독살 버프
        'master_assassin', // 숙련된 암살자
        'improved_garrote', // 강화된 목 조르기
        'indiscriminate_carnage', // 무차별 살육
        'blindside' // 사각지대
      ],
      debuffs: [
        'rupture', // 파열
        'garrote', // 목 조르기
        'deadly_poison', // 치명적인 독
        'amplifying_poison', // 증폭독
        'deathmark', // 죽음표식
        'shiv' // 급속 도포
      ],
      procs: [
        'blindside', // 사각지대 (무료 매복)
        'seal_fate', // 운명의 봉인 (치명타시 추가 콤보)
        'venomous_wounds' // 악독한 상처
      ]
    };

    // 암살 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '기습', '그림자 밟기', '소멸', '은신',
        '연막탄', '속임수 거래', '철갑상어', '위협'
      ],
      specTree: [
        '죽음표식', '왕의 파멸', '패혈증', '무차별 살육',
        '악독한 상처', '운명의 봉인', '맹독 주입', '강화된 목 조르기',
        '사각지대', '숙련된 암살자', '드래곤에 이르는 독', '독 폭탄'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'agility',
      2: 'haste', // 10-15% 목표
      3: 'critical', // 40% 목표
      4: 'mastery',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'slice_and_dice', condition: '!buff.slice_and_dice.up' },
      { skill: 'rupture', condition: 'combo_points >= 4 && !debuff.rupture.up' },
      { skill: 'deathmark', condition: 'cooldown.ready && combo_points >= 5' },
      { skill: 'kingsbane', condition: 'cooldown.ready' },
      { skill: 'shiv', condition: 'debuff.rupture.up && debuff.garrote.up' },
      { skill: 'envenom', condition: 'combo_points >= 4' },
      { skill: 'crimson_tempest', condition: 'combo_points >= 4 && spell_targets >= 2' },
      { skill: 'garrote', condition: 'refreshable' },
      { skill: 'ambush', condition: 'buff.blindside.up' },
      { skill: 'mutilate', condition: 'combo_points <= 4' },
      { skill: 'fan_of_knives', condition: 'spell_targets >= 3' }
    ];

    // 암살 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS
      rotation: 0.25, // 독 관리가 핵심
      resource: 0.20, // 에너지와 콤보 포인트 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7000000, // 7M DPS
      targetCPM: 45, // 높은 APM
      rupture_uptime: 98, // 파열 유지율 98%+
      targetResourceEfficiency: 95
    };

    this.initialize();
  }

  // 암살 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 파열 유지율
      ruptureUptime: combatLog.debuffUptimes?.rupture || 0,

      // 목 조르기 유지율
      garroteUptime: combatLog.debuffUptimes?.garrote || 0,

      // 난도질 유지율
      sliceAndDiceUptime: combatLog.buffUptimes?.slice_and_dice || 0,

      // 죽음표식 효율성
      deathmarkEfficiency: this.calculateDeathmarkEfficiency(combatLog),

      // 사각지대 발동률
      blindsideProcs: combatLog.procs?.blindside || 0,

      // 왕의 파멸 사용률
      kingsbaneUsage: this.calculateKingsbaneUsage(combatLog),

      // 에너지 낭비율
      energyWaste: combatLog.resourceWaste?.energy || 0,

      // 콤보 포인트 낭비율
      comboPointWaste: combatLog.resourceWaste?.combo_points || 0,

      // 독 적용률
      poisonUptime: this.calculatePoisonUptime(combatLog)
    };
  }

  // 죽음표식 효율 계산
  calculateDeathmarkEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const deathmarks = combatLog.skills.filter(s => s.name === 'deathmark');
    let totalEfficiency = 0;

    deathmarks.forEach(dm => {
      // 죽음표식 시전시 콤보 포인트 확인
      const cpAtCast = dm.combo_points || 0;
      // 5 콤보가 이상적
      totalEfficiency += (cpAtCast / 5) * 100;
    });

    return deathmarks.length > 0
      ? totalEfficiency / deathmarks.length
      : 0;
  }

  // 왕의 파멸 사용률 계산
  calculateKingsbaneUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const kingsbanes = combatLog.skills.filter(s => s.name === 'kingsbane').length;
    const combatDuration = combatLog.duration || 1;

    // 왕의 파멸은 60초 쿨다운
    const expectedCasts = Math.floor(combatDuration / 60) + 1;

    return Math.min(100, (kingsbanes / expectedCasts) * 100);
  }

  // 독 적용률 계산
  calculatePoisonUptime(combatLog) {
    if (!combatLog.debuffUptimes) return 100;

    const deadlyPoison = combatLog.debuffUptimes.deadly_poison || 0;
    const amplifyingPoison = combatLog.debuffUptimes.amplifying_poison || 0;

    // 두 독 중 하나는 항상 유지되어야 함
    return Math.max(deadlyPoison, amplifyingPoison);
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.4; // 암살은 중상 복잡도
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 난도질 체크
    if (!currentState.buffs?.slice_and_dice) {
      advice.push('난도질 유지 필요!');
    }

    // 파열 체크
    if (!currentState.debuffs?.rupture) {
      advice.push('파열 적용 필요!');
    }

    // 콤보 포인트 체크
    if (currentState.combo_points >= 5) {
      advice.push('콤보 포인트 소모!');
    }

    // 죽음표식 준비
    if (currentState.combo_points >= 5 && currentState.cooldowns?.deathmark?.ready) {
      advice.push('죽음표식 사용!');
    }

    // 사각지대
    if (currentState.buffs?.blindside) {
      advice.push('사각지대: 무료 매복');
    }

    // 에너지 관리
    if (currentState.energy < 30) {
      advice.push('에너지 회복 대기');
    }

    // 광역
    if (currentState.enemy_count >= 3) {
      advice.push('칼날 부채 + 진홍색 폭풍');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.energy < 30) {
      advice.push('에너지 부족: 회복 대기');
    } else if (currentState.energy > 130) {
      advice.push('에너지 초과: 즉시 사용');
    }

    if (currentState.combo_points >= 5) {
      advice.push('콤보 포인트 최대: 스펜더 사용');
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
        '목 조르기 (은신)',
        '파열',
        '난도질',
        '죽음표식',
        '왕의 파멸',
        '절단 스팸'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '파열 유지',
        '독살 스팸',
        '죽음표식 정렬',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '모든 쿨다운 정렬',
        '죽음표식 + 왕의 파멸',
        '급속 도포 사용',
        '최대 독살 윈도우'
      ];
    } else {
      strategy.priorities = [
        '파열 100% 유지',
        '난도질 100% 유지',
        '에너지 95 이하 유지',
        '콤보 포인트 4-5 사용'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 독칼날 사용');
      strategy.upcoming.push('쫄 페이즈: 칼날 부채 + 진홍색 폭풍');
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
    const simplifiedAPL = aplData.getSimplifiedAPL('rogue', 'assassination');
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
    return 'mutilate';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 암살 특화 조건 평가
    const conditions = {
      '!buff.slice_and_dice.up': !gameState.buffs?.slice_and_dice,
      'combo_points >= 4 && !debuff.rupture.up': gameState.combo_points >= 4 && !gameState.debuffs?.rupture,
      'combo_points >= 4': gameState.combo_points >= 4,
      'combo_points >= 5': gameState.combo_points >= 5,
      'combo_points <= 4': gameState.combo_points <= 4,
      'cooldown.ready': true, // 간소화
      'debuff.rupture.up && debuff.garrote.up': gameState.debuffs?.rupture && gameState.debuffs?.garrote,
      'spell_targets >= 2': gameState.enemy_count >= 2,
      'spell_targets >= 3': gameState.enemy_count >= 3,
      'refreshable': true, // 간소화
      'buff.blindside.up': gameState.buffs?.blindside,
      'energy >= 50': gameState.energy >= 50
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 암살 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        rupture_uptime: currentState.debuffs?.rupture ? 100 : 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 파열 관리
    if (!currentState.debuffs?.rupture) {
      analysis.improvements.push({
        area: 'rupture',
        message: '파열 유지 필수',
        impact: 'high'
      });
    }

    // 난도질 관리
    if (!currentState.buffs?.slice_and_dice) {
      analysis.improvements.push({
        area: 'slice_and_dice',
        message: '난도질 유지 필수',
        impact: 'high'
      });
    }

    // 에너지 관리
    if (prediction.resourceScore < 90) {
      analysis.improvements.push({
        area: 'energy',
        message: '에너지 관리 최적화 필요',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (암살 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 파열 유지율이 좋은 로그에 가중치
      if (log.ruptureUptime >= 95) {
        log.weight = 1.5; // 좋은 예시
      } else if (log.ruptureUptime < 80) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('🗡️ 암살 도적 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 암살 도적 신규 모델 생성');
    }

    console.log('✅ 암살 도적 AI 준비 완료');
  }
}

export default AssassinationRogueAI;