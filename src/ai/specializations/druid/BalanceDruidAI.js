// 드루이드 조화 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class BalanceDruidAI extends SpecializationAI {
  constructor() {
    super('druid', 'balance');

    // 조화 드루이드 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'mana',
      secondaryResource: 'astral_power',
      primaryStat: 'intellect',
      armorType: 'leather'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 조화 드루이드 핵심 메커니즘
    this.coreMechanics = {
      dots: [
        'moonfire', // 달빛섬광
        'sunfire', // 태양섬광
        'stellar_flare' // 항성 섬광
      ],
      builders: [
        'wrath', // 천벌
        'starfire', // 별빛섬광
        'starsurge', // 별빛쇄도
        'starfall', // 별똥별 (광역)
        'wild_mushroom', // 야생 버섯
        'fury_of_elune' // 엘룬의 격노
      ],
      spenders: [
        'starsurge', // 별빛쇄도 (30 천공의 힘)
        'starfall', // 별똥별 (50 천공의 힘, 광역)
        'fury_of_elune', // 엘룬의 격노
        'full_moon' // 보름달 (균형의 궤도)
      ],
      cooldowns: [
        { name: 'celestial_alignment', cooldown: 180 }, // 천공의 정렬
        { name: 'incarnation_chosen_of_elune', cooldown: 180 }, // 화신: 엘룬의 선택
        { name: 'convoke_the_spirits', cooldown: 120 }, // 영혼 소집
        { name: 'force_of_nature', cooldown: 60 }, // 자연의 군대
        { name: 'warrior_of_elune', cooldown: 45 }, // 엘룬의 전사
        { name: 'fury_of_elune', cooldown: 60 } // 엘룬의 격노
      ],
      buffs: [
        'eclipse_solar', // 일식 (태양)
        'eclipse_lunar', // 월식 (달)
        'celestial_alignment', // 천공의 정렬
        'incarnation', // 화신
        'starfall', // 별똥별
        'warrior_of_elune', // 엘룬의 전사
        'owlkin_frenzy', // 달빛야수 광란
        'solstice' // 하지/동지
      ],
      debuffs: [
        'moonfire', // 달빛섬광
        'sunfire', // 태양섬광
        'stellar_flare', // 항성 섬광
        'adaptive_swarm' // 적응의 무리
      ],
      procs: [
        'eclipse_solar', // 일식
        'eclipse_lunar', // 월식
        'owlkin_frenzy', // 달빛야수 광란
        'shooting_stars', // 유성
        'solstice' // 하지/동지
      ]
    };

    // 조화 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '달빛섬광', '태양섬광', '일몰', '자연의 균형',
        '우르솔의 회오리', '태풍', '휘감는 덩굴', '천공의 인도'
      ],
      specTree: [
        '천공의 정렬', '화신: 엘룬의 선택', '영혼 소집', '자연의 군대',
        '항성 섬광', '엘룬의 격노', '엘룬의 전사', '천체의 축복',
        '유성', '하지/동지', '균형의 궤도', '별빛 군주'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'haste', // 20% 목표
      3: 'mastery', // 일식/월식 증폭
      4: 'critical',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'moonfire', condition: '!debuff.moonfire.up || debuff.moonfire.remains < 6' },
      { skill: 'sunfire', condition: '!debuff.sunfire.up || debuff.sunfire.remains < 5' },
      { skill: 'stellar_flare', condition: '!debuff.stellar_flare.up || debuff.stellar_flare.remains < 7' },
      { skill: 'celestial_alignment', condition: 'cooldown.ready && astral_power >= 40' },
      { skill: 'incarnation', condition: 'cooldown.ready && astral_power >= 40' },
      { skill: 'convoke_the_spirits', condition: 'cooldown.ready' },
      { skill: 'fury_of_elune', condition: 'cooldown.ready && astral_power < 40' },
      { skill: 'starfall', condition: 'astral_power >= 50 && spell_targets >= 2' },
      { skill: 'starsurge', condition: 'astral_power >= 30 && !buff.starfall.up' },
      { skill: 'new_moon', condition: 'charges >= 1' }, // 균형의 궤도
      { skill: 'half_moon', condition: 'charges >= 1' },
      { skill: 'full_moon', condition: 'charges >= 1' },
      { skill: 'wrath', condition: 'buff.eclipse_solar.up || cast_time < 1.5' },
      { skill: 'starfire', condition: 'buff.eclipse_lunar.up || spell_targets >= 2' },
      { skill: 'wrath', condition: 'always' } // 기본 필러
    ];

    // 조화 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS
      rotation: 0.25, // 일식/월식 관리가 핵심
      resource: 0.20, // 천공의 힘 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7400000, // 7.4M DPS
      targetCPM: 42, // 중간 정도의 APM
      dot_uptime: 98, // DOT 유지율 98%+
      targetResourceEfficiency: 92
    };

    this.initialize();
  }

  // 조화 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 달빛섬광 유지율
      moonfireUptime: combatLog.debuffUptimes?.moonfire || 0,

      // 태양섬광 유지율
      sunfireUptime: combatLog.debuffUptimes?.sunfire || 0,

      // 일식/월식 활용률
      eclipseUsage: this.calculateEclipseUsage(combatLog),

      // 천공의 정렬 효율성
      celestialAlignmentEfficiency: this.calculateCelestialAlignmentEfficiency(combatLog),

      // 별빛쇄도 사용률
      starsurgeUsage: this.calculateStarsurgeUsage(combatLog),

      // 천공의 힘 낭비율
      astralPowerWaste: combatLog.resourceWaste?.astral_power || 0,

      // 유성 발동률
      shootingStarsProcs: combatLog.procs?.shooting_stars || 0,

      // 균형의 궤도 활용률
      orbitalBalanceUsage: this.calculateOrbitalBalanceUsage(combatLog),

      // 영혼 소집 효율성
      convokeEfficiency: this.calculateConvokeEfficiency(combatLog),

      // DOT 스냅샷 효율
      dotSnapshotEfficiency: this.calculateDotSnapshotEfficiency(combatLog)
    };
  }

  // 일식/월식 활용률 계산
  calculateEclipseUsage(combatLog) {
    if (!combatLog.eclipseTracking) return 0;

    let totalUptime = 0;
    const combatDuration = combatLog.duration || 1;

    const solarUptime = combatLog.buffUptimes?.eclipse_solar || 0;
    const lunarUptime = combatLog.buffUptimes?.eclipse_lunar || 0;

    totalUptime = solarUptime + lunarUptime;

    // 이상적으로는 전투시간의 80% 이상 일식/월식 상태
    return Math.min(100, (totalUptime / combatDuration) * 100);
  }

  // 천공의 정렬 효율 계산
  calculateCelestialAlignmentEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const celestialAlignments = combatLog.skills.filter(s =>
      s.name === 'celestial_alignment' || s.name === 'incarnation'
    );
    let totalEfficiency = 0;

    celestialAlignments.forEach(ca => {
      // 천공의 정렬 중 사용한 천공의 힘
      const powerSpent = ca.astral_power_spent || 0;
      // 이상적으로는 200+ 천공의 힘 소비
      totalEfficiency += Math.min(100, (powerSpent / 200) * 100);
    });

    return celestialAlignments.length > 0
      ? totalEfficiency / celestialAlignments.length
      : 0;
  }

  // 별빛쇄도 사용률 계산
  calculateStarsurgeUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const starsurges = combatLog.skills.filter(s => s.name === 'starsurge');
    let eclipseStarsurges = 0;

    starsurges.forEach(ss => {
      // 일식/월식 중 사용한 경우
      if (ss.during_eclipse) {
        eclipseStarsurges++;
      }
    });

    return starsurges.length > 0
      ? (eclipseStarsurges / starsurges.length) * 100
      : 0;
  }

  // 균형의 궤도 활용률 계산
  calculateOrbitalBalanceUsage(combatLog) {
    if (!combatLog.skills) return 100;

    const moonSpells = combatLog.skills.filter(s =>
      ['new_moon', 'half_moon', 'full_moon'].includes(s.name)
    );

    const combatDuration = combatLog.duration || 1;
    // 20초마다 3충전
    const expectedCasts = (combatDuration / 20) * 3;

    return expectedCasts > 0
      ? Math.min(100, (moonSpells.length / expectedCasts) * 100)
      : 100;
  }

  // 영혼 소집 효율 계산
  calculateConvokeEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const convokes = combatLog.skills.filter(s => s.name === 'convoke_the_spirits');
    let totalEfficiency = 0;

    convokes.forEach(conv => {
      // 영혼 소집 중 시전된 주문 수
      const spellsCast = conv.spells_cast || 0;
      // 16개가 최대
      totalEfficiency += Math.min(100, (spellsCast / 16) * 100);
    });

    return convokes.length > 0
      ? totalEfficiency / convokes.length
      : 0;
  }

  // DOT 스냅샷 효율 계산
  calculateDotSnapshotEfficiency(combatLog) {
    if (!combatLog.dotSnapshots) return 100;

    let goodSnapshots = 0;
    let totalSnapshots = 0;

    combatLog.dotSnapshots.forEach(snapshot => {
      totalSnapshots++;
      // 일식/월식 또는 천공의 정렬 중 스냅샷
      if (snapshot.buffs?.includes('eclipse_solar') ||
          snapshot.buffs?.includes('eclipse_lunar') ||
          snapshot.buffs?.includes('celestial_alignment')) {
        goodSnapshots++;
      }
    });

    return totalSnapshots > 0
      ? (goodSnapshots / totalSnapshots) * 100
      : 100;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.4; // 조화는 중상 복잡도 (일식/월식 관리)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // DOT 체크
    if (!currentState.debuffs?.moonfire) {
      advice.push('달빛섬광 적용!');
    } else if (currentState.debuffs?.moonfire?.remains < 6) {
      advice.push('달빛섬광 갱신!');
    }

    if (!currentState.debuffs?.sunfire) {
      advice.push('태양섬광 적용!');
    } else if (currentState.debuffs?.sunfire?.remains < 5) {
      advice.push('태양섬광 갱신!');
    }

    // 일식/월식 체크
    if (currentState.buffs?.eclipse_solar) {
      advice.push('일식: 천벌 우선!');
    } else if (currentState.buffs?.eclipse_lunar) {
      advice.push('월식: 별빛섬광 우선!');
    }

    // 천공의 힘 체크
    if (currentState.astral_power >= 90) {
      advice.push('천공의 힘 초과: 별빛쇄도!');
    }

    // 천공의 정렬
    if (currentState.cooldowns?.celestial_alignment?.ready && currentState.astral_power >= 40) {
      advice.push('천공의 정렬 사용!');
    }

    // 균형의 궤도
    if (currentState.moon_charges >= 1) {
      advice.push('달 주문 사용 가능!');
    }

    // 광역
    if (currentState.enemy_count >= 2) {
      advice.push('별똥별 유지!');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.astral_power >= 90) {
      advice.push('천공의 힘 초과: 즉시 소비');
    } else if (currentState.astral_power < 10) {
      advice.push('천공의 힘 부족: 빌더 사용');
    }

    if (currentState.mana_percent < 30) {
      advice.push('마나 관리 주의');
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
        '달빛섬광',
        '태양섬광',
        '항성 섬광',
        '엘룬의 전사',
        '천공의 정렬/화신',
        '영혼 소집',
        '별빛쇄도 스팸'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        'DOT 유지',
        '별빛쇄도 스팸',
        '일식/월식 활용',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '모든 쿨다운 정렬',
        '천공의 정렬 + 영혼 소집',
        '균형의 궤도 정렬',
        '천공의 힘 덤핑'
      ];
    } else {
      strategy.priorities = [
        '달빛섬광/태양섬광 100% 유지',
        '일식/월식 순환',
        '천공의 힘 30-90 유지',
        '유성 즉시 사용'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: DOT 갱신 우선');
      strategy.upcoming.push('쫄 페이즈: 별똥별 + 태양섬광');
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
    const simplifiedAPL = aplData.getSimplifiedAPL('druid', 'balance');
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
    return 'wrath';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 조화 특화 조건 평가
    const conditions = {
      '!debuff.moonfire.up || debuff.moonfire.remains < 6':
        !gameState.debuffs?.moonfire || (gameState.debuffs?.moonfire?.remains < 6),
      '!debuff.sunfire.up || debuff.sunfire.remains < 5':
        !gameState.debuffs?.sunfire || (gameState.debuffs?.sunfire?.remains < 5),
      '!debuff.stellar_flare.up || debuff.stellar_flare.remains < 7':
        !gameState.debuffs?.stellar_flare || (gameState.debuffs?.stellar_flare?.remains < 7),
      'cooldown.ready && astral_power >= 40':
        gameState.astral_power >= 40,
      'cooldown.ready': true, // 간소화
      'cooldown.ready && astral_power < 40':
        gameState.astral_power < 40,
      'astral_power >= 50 && spell_targets >= 2':
        gameState.astral_power >= 50 && gameState.enemy_count >= 2,
      'astral_power >= 30 && !buff.starfall.up':
        gameState.astral_power >= 30 && !gameState.buffs?.starfall,
      'charges >= 1':
        gameState.moon_charges >= 1,
      'buff.eclipse_solar.up || cast_time < 1.5':
        gameState.buffs?.eclipse_solar || true, // 간소화
      'buff.eclipse_lunar.up || spell_targets >= 2':
        gameState.buffs?.eclipse_lunar || gameState.enemy_count >= 2
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 조화 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        eclipse_uptime: this.calculateEclipseUsage(currentState)
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // DOT 관리
    if (!currentState.debuffs?.moonfire || !currentState.debuffs?.sunfire) {
      analysis.improvements.push({
        area: 'dots',
        message: 'DOT 유지 필수',
        impact: 'high'
      });
    }

    // 일식/월식 관리
    if (!currentState.buffs?.eclipse_solar && !currentState.buffs?.eclipse_lunar) {
      analysis.improvements.push({
        area: 'eclipse',
        message: '일식/월식 순환 필요',
        impact: 'high'
      });
    }

    // 천공의 힘 관리
    if (currentState.astral_power >= 90) {
      analysis.improvements.push({
        area: 'astral_power',
        message: '천공의 힘 낭비 방지',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (조화 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // DOT 유지율과 일식/월식 활용률이 좋은 로그에 가중치
      const dotUptime = (log.moonfireUptime + log.sunfireUptime) / 2;
      const eclipseUsage = log.eclipseUsage || 0;

      if (dotUptime >= 95 && eclipseUsage >= 70) {
        log.weight = 1.5; // 좋은 예시
      } else if (dotUptime < 80 || eclipseUsage < 50) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('🌙 조화 드루이드 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 조화 드루이드 신규 모델 생성');
    }

    console.log('✅ 조화 드루이드 AI 준비 완료');
  }
}

export default BalanceDruidAI;