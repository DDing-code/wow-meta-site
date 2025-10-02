// 사제 암흑 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class ShadowPriestAI extends SpecializationAI {
  constructor() {
    super('priest', 'shadow');

    // 암흑 사제 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'mana',
      secondaryResource: 'insanity',
      primaryStat: 'intellect',
      armorType: 'cloth'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 암흑 사제 핵심 메커니즘
    this.coreMechanics = {
      dots: [
        'shadow_word_pain', // 어둠의 권능: 고통
        'vampiric_touch', // 흡혈의 손길
        'devouring_plague' // 파멸의 역병
      ],
      builders: [
        'mind_blast', // 정신 폭발
        'mind_flay', // 정신 분열 (필러)
        'mind_spike', // 정신의 쐐기
        'shadow_word_death', // 어둠의 권능: 죽음
        'mindgames' // 정신 게임
      ],
      spenders: [
        'devouring_plague', // 파멸의 역병 (50 광기)
        'shadow_word_death', // 어둠의 권능: 죽음 (처형)
        'void_torrent' // 공허의 격류
      ],
      cooldowns: [
        { name: 'void_eruption', cooldown: 90 }, // 공허 분출
        { name: 'dark_ascension', cooldown: 60 }, // 어둠의 승천
        { name: 'power_infusion', cooldown: 120 }, // 마력 주입
        { name: 'mindbender', cooldown: 60 }, // 정신 지배자
        { name: 'void_torrent', cooldown: 30 }, // 공허의 격류
        { name: 'shadow_crash', cooldown: 20 } // 그림자 충돌
      ],
      buffs: [
        'voidform', // 공허의 형상
        'dark_ascension', // 어둠의 승천
        'power_infusion', // 마력 주입
        'twist_of_fate', // 운명의 뒤틀림
        'deathspeaker', // 죽음예언자
        'mind_devourer', // 정신 포식자
        'surge_of_insanity' // 광기의 쇄도
      ],
      debuffs: [
        'shadow_word_pain', // 어둠의 권능: 고통
        'vampiric_touch', // 흡혈의 손길
        'devouring_plague', // 파멸의 역병
        'mindgames', // 정신 게임
        'psychic_horror' // 정신적 공포
      ],
      procs: [
        'surge_of_insanity', // 광기의 쇄도 (무료 정신 폭발/정신의 쐐기)
        'mind_devourer', // 정신 포식자
        'deathspeaker', // 죽음예언자
        'shadowy_insight' // 어두운 통찰력
      ]
    };

    // 암흑 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '절망의 기도', '페이드', '정신의 비명', '대규모 무효화',
        '천사의 깃털', '마력 주입', '환영', '영혼의 보호막'
      ],
      specTree: [
        '공허 분출', '어둠의 승천', '정신 지배자', '정신 게임',
        '공허의 격류', '그림자 충돌', '죽음예언자', '정신 포식자',
        '광기의 쇄도', '운명의 뒤틀림', '고대의 광기', '공허의 불꽃'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'haste', // 15-20% 목표
      3: 'critical', // 30% 목표
      4: 'mastery',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'void_eruption', condition: 'insanity >= 50 && !buff.voidform.up' },
      { skill: 'dark_ascension', condition: 'cooldown.ready && insanity < 30' },
      { skill: 'mindbender', condition: 'cooldown.ready' },
      { skill: 'shadow_word_pain', condition: '!debuff.shadow_word_pain.up || debuff.shadow_word_pain.remains < 3' },
      { skill: 'vampiric_touch', condition: '!debuff.vampiric_touch.up || debuff.vampiric_touch.remains < 6' },
      { skill: 'devouring_plague', condition: 'insanity >= 50' },
      { skill: 'mind_blast', condition: 'charges >= 1 || buff.surge_of_insanity.up' },
      { skill: 'shadow_word_death', condition: 'target.health_percent < 20 || buff.deathspeaker.up' },
      { skill: 'void_torrent', condition: 'cooldown.ready && buff.voidform.up' },
      { skill: 'shadow_crash', condition: 'cooldown.ready && spell_targets >= 2' },
      { skill: 'mindgames', condition: 'cooldown.ready' },
      { skill: 'mind_spike', condition: 'buff.surge_of_insanity.up' },
      { skill: 'mind_flay', condition: 'always' } // 필러
    ];

    // 암흑 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS
      rotation: 0.25, // 공허의 형상 관리가 핵심
      resource: 0.20, // 광기 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7500000, // 7.5M DPS
      targetCPM: 50, // 높은 APM
      voidform_uptime: 40, // 공허의 형상 유지율 40%+
      targetResourceEfficiency: 94
    };

    this.initialize();
  }

  // 암흑 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 어둠의 권능: 고통 유지율
      shadowWordPainUptime: combatLog.debuffUptimes?.shadow_word_pain || 0,

      // 흡혈의 손길 유지율
      vampiricTouchUptime: combatLog.debuffUptimes?.vampiric_touch || 0,

      // 공허의 형상 유지율
      voidformUptime: combatLog.buffUptimes?.voidform || 0,

      // 평균 공허의 형상 지속시간
      averageVoidformDuration: this.calculateAverageVoidformDuration(combatLog),

      // 파멸의 역병 효율성
      devouringPlagueEfficiency: this.calculateDevouringPlagueEfficiency(combatLog),

      // 광기의 쇄도 발동률
      surgeOfInsanityProcs: combatLog.procs?.surge_of_insanity || 0,

      // 정신 폭발 사용률
      mindBlastUsage: this.calculateMindBlastUsage(combatLog),

      // 광기 낭비율
      insanityWaste: combatLog.resourceWaste?.insanity || 0,

      // 어둠의 권능: 죽음 처형 효율
      shadowWordDeathExecute: this.calculateShadowWordDeathExecute(combatLog),

      // DOT 유지 점수
      dotUptimeScore: this.calculateDotUptimeScore(combatLog)
    };
  }

  // 평균 공허의 형상 지속시간 계산
  calculateAverageVoidformDuration(combatLog) {
    if (!combatLog.voidformWindows) return 0;

    let totalDuration = 0;
    let windowCount = 0;

    combatLog.voidformWindows.forEach(window => {
      totalDuration += window.duration || 0;
      windowCount++;
    });

    return windowCount > 0 ? totalDuration / windowCount : 0;
  }

  // 파멸의 역병 효율 계산
  calculateDevouringPlagueEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const devouringPlagues = combatLog.skills.filter(s => s.name === 'devouring_plague');
    let totalEfficiency = 0;

    devouringPlagues.forEach(dp => {
      // 파멸의 역병 시전시 광기 양
      const insanityAtCast = dp.insanity || 50;
      // 50 이상이면 100%, 그 이하는 비율적으로
      totalEfficiency += Math.min(100, (insanityAtCast / 50) * 100);
    });

    return devouringPlagues.length > 0
      ? totalEfficiency / devouringPlagues.length
      : 0;
  }

  // 정신 폭발 사용률 계산
  calculateMindBlastUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const mindBlasts = combatLog.skills.filter(s => s.name === 'mind_blast').length;
    const combatDuration = combatLog.duration || 1;

    // 정신 폭발은 약 6-8초 쿨다운 (2충전)
    const expectedCasts = (combatDuration / 6) * 2; // 2충전 고려

    return Math.min(100, (mindBlasts / expectedCasts) * 100);
  }

  // 어둠의 권능: 죽음 처형 효율 계산
  calculateShadowWordDeathExecute(combatLog) {
    if (!combatLog.skills) return 0;

    const shadowWordDeaths = combatLog.skills.filter(s => s.name === 'shadow_word_death');
    let executeCount = 0;

    shadowWordDeaths.forEach(swd => {
      // 대상 체력이 20% 이하일 때 사용한 경우
      if (swd.target_health_percent <= 20) {
        executeCount++;
      }
    });

    return shadowWordDeaths.length > 0
      ? (executeCount / shadowWordDeaths.length) * 100
      : 0;
  }

  // DOT 유지 점수 계산
  calculateDotUptimeScore(combatLog) {
    const swpUptime = combatLog.debuffUptimes?.shadow_word_pain || 0;
    const vtUptime = combatLog.debuffUptimes?.vampiric_touch || 0;

    // 두 주요 DOT의 평균 유지율
    return (swpUptime + vtUptime) / 2;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.5; // 암흑은 중상 복잡도 (공허의 형상 관리)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // DOT 체크
    if (!currentState.debuffs?.shadow_word_pain) {
      advice.push('어둠의 권능: 고통 적용!');
    } else if (currentState.debuffs?.shadow_word_pain?.remains < 3) {
      advice.push('어둠의 권능: 고통 갱신!');
    }

    if (!currentState.debuffs?.vampiric_touch) {
      advice.push('흡혈의 손길 적용!');
    } else if (currentState.debuffs?.vampiric_touch?.remains < 6) {
      advice.push('흡혈의 손길 갱신!');
    }

    // 공허의 형상 체크
    if (currentState.insanity >= 50 && !currentState.buffs?.voidform) {
      advice.push('공허 분출 사용!');
    }

    // 파멸의 역병
    if (currentState.insanity >= 50 && currentState.buffs?.voidform) {
      advice.push('파멸의 역병 사용!');
    }

    // 정신 폭발
    if (currentState.mind_blast_charges >= 1) {
      advice.push('정신 폭발 사용!');
    }

    // 광기의 쇄도
    if (currentState.buffs?.surge_of_insanity) {
      advice.push('광기의 쇄도: 무료 정신 폭발/정신의 쐐기');
    }

    // 처형 단계
    if (currentState.enemy_health_percent < 20) {
      advice.push('어둠의 권능: 죽음 스팸!');
    }

    // 광역
    if (currentState.enemy_count >= 3) {
      advice.push('그림자 충돌 + 정신의 비명');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.insanity >= 90) {
      advice.push('광기 초과: 파멸의 역병 사용');
    } else if (currentState.insanity < 20 && !currentState.buffs?.voidform) {
      advice.push('광기 부족: 빌더 사용');
    }

    if (currentState.buffs?.voidform && currentState.insanity < 30) {
      advice.push('공허의 형상 유지 위험!');
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
        '어둠의 권능: 고통',
        '흡혈의 손길',
        '정신 폭발',
        '정신 지배자',
        '어둠의 승천',
        '공허 분출 (50 광기)',
        '공허의 격류',
        '파멸의 역병'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        'DOT 유지',
        '어둠의 권능: 죽음 스팸',
        '공허의 형상 유지',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '모든 쿨다운 정렬',
        '마력 주입 + 공허 분출',
        '공허의 형상 최대화',
        '파멸의 역병 스팸'
      ];
    } else {
      strategy.priorities = [
        '어둠의 권능: 고통 100% 유지',
        '흡혈의 손길 100% 유지',
        '광기 50+ 유지',
        '정신 폭발 충전 관리'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: DOT 갱신 우선');
      strategy.upcoming.push('쫄 페이즈: 그림자 충돌 준비');
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
    const simplifiedAPL = aplData.getSimplifiedAPL('priest', 'shadow');
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
    return 'mind_flay';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 암흑 특화 조건 평가
    const conditions = {
      'insanity >= 50 && !buff.voidform.up':
        gameState.insanity >= 50 && !gameState.buffs?.voidform,
      'cooldown.ready && insanity < 30':
        gameState.insanity < 30,
      '!debuff.shadow_word_pain.up || debuff.shadow_word_pain.remains < 3':
        !gameState.debuffs?.shadow_word_pain || (gameState.debuffs?.shadow_word_pain?.remains < 3),
      '!debuff.vampiric_touch.up || debuff.vampiric_touch.remains < 6':
        !gameState.debuffs?.vampiric_touch || (gameState.debuffs?.vampiric_touch?.remains < 6),
      'insanity >= 50':
        gameState.insanity >= 50,
      'charges >= 1 || buff.surge_of_insanity.up':
        (gameState.mind_blast_charges >= 1) || gameState.buffs?.surge_of_insanity,
      'target.health_percent < 20 || buff.deathspeaker.up':
        gameState.enemy_health_percent < 20 || gameState.buffs?.deathspeaker,
      'cooldown.ready && buff.voidform.up':
        gameState.buffs?.voidform,
      'cooldown.ready && spell_targets >= 2':
        gameState.enemy_count >= 2,
      'cooldown.ready': true, // 간소화
      'buff.surge_of_insanity.up':
        gameState.buffs?.surge_of_insanity
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 암흑 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        voidform_uptime: currentState.buffs?.voidform ? 100 : 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // DOT 관리
    if (!currentState.debuffs?.shadow_word_pain) {
      analysis.improvements.push({
        area: 'shadow_word_pain',
        message: '어둠의 권능: 고통 유지 필수',
        impact: 'high'
      });
    }

    if (!currentState.debuffs?.vampiric_touch) {
      analysis.improvements.push({
        area: 'vampiric_touch',
        message: '흡혈의 손길 유지 필수',
        impact: 'high'
      });
    }

    // 공허의 형상 관리
    if (currentState.insanity >= 50 && !currentState.buffs?.voidform) {
      analysis.improvements.push({
        area: 'voidform',
        message: '공허 분출 사용',
        impact: 'high'
      });
    }

    // 광기 관리
    if (prediction.resourceScore < 85) {
      analysis.improvements.push({
        area: 'insanity',
        message: '광기 관리 최적화 필요',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (암흑 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 공허의 형상 유지율이 좋은 로그에 가중치
      if (log.voidformUptime >= 40) {
        log.weight = 1.5; // 좋은 예시
      } else if (log.voidformUptime < 20) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('🌑 암흑 사제 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 암흑 사제 신규 모델 생성');
    }

    console.log('✅ 암흑 사제 AI 준비 완료');
  }
}

export default ShadowPriestAI;