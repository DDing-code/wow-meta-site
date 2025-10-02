// 흑마법사 고통 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class AfflictionWarlockAI extends SpecializationAI {
  constructor() {
    super('warlock', 'affliction');

    // 고통 흑마법사 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'mana',
      secondaryResource: 'soul_shards',
      primaryStat: 'intellect',
      armorType: 'cloth'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 고통 흑마법사 핵심 메커니즘
    this.coreMechanics = {
      dots: [
        'agony', // 고통
        'corruption', // 부패
        'unstable_affliction', // 불안정한 고통
        'siphon_life', // 생명력 착취
        'vile_taint', // 악의 오염
        'phantom_singularity' // 유령 특이점
      ],
      spenders: [
        'malefic_rapture', // 재앙의 휩쓸림
        'seed_of_corruption', // 부패의 씨앗 (광역)
        'drain_soul' // 영혼 흡수 (처형)
      ],
      cooldowns: [
        { name: 'darkglare', cooldown: 120 }, // 암흑시선
        { name: 'dark_soul_misery', cooldown: 120 }, // 암흑의 영혼: 불행
        { name: 'vile_taint', cooldown: 30 }, // 악의 오염
        { name: 'phantom_singularity', cooldown: 45 }, // 유령 특이점
        { name: 'soul_rot', cooldown: 60 } // 영혼부패
      ],
      buffs: [
        'nightfall', // 밤의 강림 (무료 섀도우 볼트)
        'dark_soul_misery', // 암흑의 영혼
        'inevitable_demise', // 피할 수 없는 죽음
        'tormented_crescendo', // 고뇌의 절정
        'malevolent_visionary' // 악의적인 환영술사
      ],
      debuffs: [
        'agony', // 고통
        'corruption', // 부패
        'unstable_affliction', // 불안정한 고통
        'siphon_life', // 생명력 착취
        'haunt', // 출몰
        'vile_taint', // 악의 오염
        'phantom_singularity', // 유령 특이점
        'soul_rot' // 영혼부패
      ],
      procs: [
        'nightfall', // 밤의 강림
        'tormented_crescendo', // 고뇌의 절정
        'shadow_embrace' // 암흑의 포옹
      ]
    };

    // 고통 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '악마의 포옹', '암흑 격노', '불타는 돌진', '소각',
        '어둠의 서약', '강력한 유혹', '영혼 도관', '고통의 포옹'
      ],
      specTree: [
        '암흑시선', '암흑의 영혼: 불행', '유령 특이점', '악의 오염',
        '출몰', '영혼부패', '재앙의 휩쓸림 강화', '피할 수 없는 죽음',
        '암흑 소집', '크레스락의 정수', '악의적인 환영술사', '고뇌의 절정'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'haste', // 20-25% 목표
      3: 'mastery', // DOT 데미지 증가
      4: 'critical',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'agony', condition: '!debuff.agony.up || debuff.agony.remains < 5.4' },
      { skill: 'darkglare', condition: 'cooldown.ready && soul_shards >= 3' },
      { skill: 'dark_soul_misery', condition: 'cooldown.ready' },
      { skill: 'vile_taint', condition: 'cooldown.ready && soul_shards >= 1' },
      { skill: 'phantom_singularity', condition: 'cooldown.ready' },
      { skill: 'soul_rot', condition: 'cooldown.ready && active_dots >= 3' },
      { skill: 'unstable_affliction', condition: 'soul_shards >= 1 && !debuff.unstable_affliction.up' },
      { skill: 'corruption', condition: '!debuff.corruption.up || debuff.corruption.remains < 4.2' },
      { skill: 'siphon_life', condition: '!debuff.siphon_life.up || debuff.siphon_life.remains < 4.5' },
      { skill: 'haunt', condition: 'cooldown.ready' },
      { skill: 'malefic_rapture', condition: 'soul_shards >= 3 && active_dots >= 4' },
      { skill: 'seed_of_corruption', condition: 'spell_targets >= 3 && soul_shards >= 1' },
      { skill: 'drain_soul', condition: 'target.health_percent < 20' },
      { skill: 'shadow_bolt', condition: 'buff.nightfall.up' },
      { skill: 'shadow_bolt', condition: 'always' } // 필러
    ];

    // 고통 특화 가중치
    this.learningWeights = {
      dps: 0.40, // DPS
      rotation: 0.30, // DOT 관리가 핵심
      resource: 0.20, // 영혼 조각 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7200000, // 7.2M DPS
      targetCPM: 40, // 중간 정도의 APM
      dot_uptime: 98, // DOT 유지율 98%+
      targetResourceEfficiency: 92
    };

    this.initialize();
  }

  // 고통 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 고통 유지율
      agonyUptime: combatLog.debuffUptimes?.agony || 0,

      // 부패 유지율
      corruptionUptime: combatLog.debuffUptimes?.corruption || 0,

      // 불안정한 고통 유지율
      unstableAfflictionUptime: combatLog.debuffUptimes?.unstable_affliction || 0,

      // 평균 활성 DOT 수
      averageActiveDots: this.calculateAverageActiveDots(combatLog),

      // 암흑시선 효율성
      darkglareEfficiency: this.calculateDarkglareEfficiency(combatLog),

      // 재앙의 휩쓸림 효율성
      maleficRaptureEfficiency: this.calculateMaleficRaptureEfficiency(combatLog),

      // 밤의 강림 발동률
      nightfallProcs: combatLog.procs?.nightfall || 0,

      // 영혼 조각 낭비율
      soulShardWaste: combatLog.resourceWaste?.soul_shards || 0,

      // 생명력 착취 유지율
      siphonLifeUptime: combatLog.debuffUptimes?.siphon_life || 0,

      // DOT 스냅샷 효율
      dotSnapshotEfficiency: this.calculateDotSnapshotEfficiency(combatLog)
    };
  }

  // 평균 활성 DOT 계산
  calculateAverageActiveDots(combatLog) {
    if (!combatLog.dotTracking) return 0;

    const dotSnapshots = combatLog.dotTracking;
    let totalDots = 0;
    let snapshotCount = 0;

    dotSnapshots.forEach(snapshot => {
      let activeDots = 0;
      if (snapshot.agony) activeDots++;
      if (snapshot.corruption) activeDots++;
      if (snapshot.unstable_affliction) activeDots++;
      if (snapshot.siphon_life) activeDots++;
      if (snapshot.haunt) activeDots++;

      totalDots += activeDots;
      snapshotCount++;
    });

    return snapshotCount > 0 ? totalDots / snapshotCount : 0;
  }

  // 암흑시선 효율 계산
  calculateDarkglareEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const darkglares = combatLog.skills.filter(s => s.name === 'darkglare');
    let totalEfficiency = 0;

    darkglares.forEach(dg => {
      // 암흑시선 시전시 활성 DOT 수 확인
      const activeDots = dg.active_dots || 0;
      // 5개 이상의 DOT이 이상적
      totalEfficiency += Math.min(100, (activeDots / 5) * 100);
    });

    return darkglares.length > 0
      ? totalEfficiency / darkglares.length
      : 0;
  }

  // 재앙의 휩쓸림 효율 계산
  calculateMaleficRaptureEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const maleficRaptures = combatLog.skills.filter(s => s.name === 'malefic_rapture');
    let totalEfficiency = 0;

    maleficRaptures.forEach(mr => {
      // 재앙의 휩쓸림 시전시 활성 DOT 수
      const activeDots = mr.active_dots || 0;
      // 4개 이상의 DOT이 이상적
      totalEfficiency += Math.min(100, (activeDots / 4) * 100);
    });

    return maleficRaptures.length > 0
      ? totalEfficiency / maleficRaptures.length
      : 0;
  }

  // DOT 스냅샷 효율 계산
  calculateDotSnapshotEfficiency(combatLog) {
    if (!combatLog.dotSnapshots) return 100;

    let goodSnapshots = 0;
    let totalSnapshots = 0;

    combatLog.dotSnapshots.forEach(snapshot => {
      totalSnapshots++;
      // 버프가 활성화된 상태에서 스냅샷된 경우
      if (snapshot.buffs?.includes('dark_soul_misery') ||
          snapshot.buffs?.includes('tormented_crescendo')) {
        goodSnapshots++;
      }
    });

    return totalSnapshots > 0
      ? (goodSnapshots / totalSnapshots) * 100
      : 100;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.6; // 고통은 높은 복잡도 (DOT 관리)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 고통 체크
    if (!currentState.debuffs?.agony) {
      advice.push('고통 적용 필요!');
    } else if (currentState.debuffs?.agony?.remains < 5.4) {
      advice.push('고통 갱신 필요!');
    }

    // 부패 체크
    if (!currentState.debuffs?.corruption) {
      advice.push('부패 적용 필요!');
    }

    // 불안정한 고통 체크
    if (currentState.soul_shards >= 1 && !currentState.debuffs?.unstable_affliction) {
      advice.push('불안정한 고통 적용!');
    }

    // 재앙의 휩쓸림 준비
    if (currentState.soul_shards >= 3 && currentState.active_dots >= 4) {
      advice.push('재앙의 휩쓸림 사용!');
    }

    // 암흑시선 준비
    if (currentState.cooldowns?.darkglare?.ready && currentState.active_dots >= 4) {
      advice.push('암흑시선 사용!');
    }

    // 밤의 강림
    if (currentState.buffs?.nightfall) {
      advice.push('밤의 강림: 무료 섀도우 볼트');
    }

    // 처형 단계
    if (currentState.enemy_health_percent < 20) {
      advice.push('영혼 흡수 스팸!');
    }

    // 광역
    if (currentState.enemy_count >= 3) {
      advice.push('부패의 씨앗 + 악의 오염');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.soul_shards >= 4) {
      advice.push('영혼 조각 초과: 재앙의 휩쓸림 사용');
    } else if (currentState.soul_shards === 0) {
      advice.push('영혼 조각 부족: DOT 유지로 생성');
    }

    if (currentState.mana_percent < 20) {
      advice.push('마나 부족 주의');
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
        '출몰',
        '고통',
        '부패',
        '생명력 착취',
        '불안정한 고통 x3',
        '악의 오염',
        '암흑의 영혼',
        '암흑시선'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        'DOT 유지',
        '영혼 흡수 스팸',
        '재앙의 휩쓸림',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '모든 쿨다운 정렬',
        '암흑시선 + 암흑의 영혼',
        'DOT 스냅샷',
        '최대 재앙의 휩쓸림 윈도우'
      ];
    } else {
      strategy.priorities = [
        '고통 100% 유지',
        '부패 100% 유지',
        '불안정한 고통 유지',
        '영혼 조각 3-4 유지'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: DOT 갱신 우선');
      strategy.upcoming.push('쫄 페이즈: 부패의 씨앗 준비');
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
    const simplifiedAPL = aplData.getSimplifiedAPL('warlock', 'affliction');
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
    return 'shadow_bolt';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 고통 특화 조건 평가
    const conditions = {
      '!debuff.agony.up || debuff.agony.remains < 5.4':
        !gameState.debuffs?.agony || (gameState.debuffs?.agony?.remains < 5.4),
      '!debuff.corruption.up || debuff.corruption.remains < 4.2':
        !gameState.debuffs?.corruption || (gameState.debuffs?.corruption?.remains < 4.2),
      '!debuff.siphon_life.up || debuff.siphon_life.remains < 4.5':
        !gameState.debuffs?.siphon_life || (gameState.debuffs?.siphon_life?.remains < 4.5),
      'soul_shards >= 1 && !debuff.unstable_affliction.up':
        gameState.soul_shards >= 1 && !gameState.debuffs?.unstable_affliction,
      'soul_shards >= 3 && active_dots >= 4':
        gameState.soul_shards >= 3 && gameState.active_dots >= 4,
      'cooldown.ready && soul_shards >= 3':
        gameState.soul_shards >= 3,
      'cooldown.ready && active_dots >= 3':
        gameState.active_dots >= 3,
      'cooldown.ready': true, // 간소화
      'spell_targets >= 3 && soul_shards >= 1':
        gameState.enemy_count >= 3 && gameState.soul_shards >= 1,
      'target.health_percent < 20':
        gameState.enemy_health_percent < 20,
      'buff.nightfall.up':
        gameState.buffs?.nightfall
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 고통 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        dot_uptime: this.calculateAverageActiveDots(currentState)
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // DOT 관리
    if (!currentState.debuffs?.agony) {
      analysis.improvements.push({
        area: 'agony',
        message: '고통 유지 필수',
        impact: 'high'
      });
    }

    if (!currentState.debuffs?.corruption) {
      analysis.improvements.push({
        area: 'corruption',
        message: '부패 유지 필수',
        impact: 'high'
      });
    }

    // 영혼 조각 관리
    if (currentState.soul_shards >= 4) {
      analysis.improvements.push({
        area: 'soul_shards',
        message: '영혼 조각 낭비 방지',
        impact: 'medium'
      });
    }

    // DOT 스냅샷
    if (prediction.snapshotScore < 80) {
      analysis.improvements.push({
        area: 'snapshot',
        message: '버프 중 DOT 갱신 필요',
        impact: 'high'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (고통 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // DOT 유지율이 좋은 로그에 가중치
      const avgDotUptime = (
        (log.agonyUptime || 0) +
        (log.corruptionUptime || 0) +
        (log.unstableAfflictionUptime || 0)
      ) / 3;

      if (avgDotUptime >= 95) {
        log.weight = 1.5; // 좋은 예시
      } else if (avgDotUptime < 80) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('😈 고통 흑마법사 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 고통 흑마법사 신규 모델 생성');
    }

    console.log('✅ 고통 흑마법사 AI 준비 완료');
  }
}

export default AfflictionWarlockAI;