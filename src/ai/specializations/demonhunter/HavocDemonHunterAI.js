// 악마사냥꾼 파멸 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class HavocDemonHunterAI extends SpecializationAI {
  constructor() {
    super('demonhunter', 'havoc');

    // 파멸 악마사냥꾼 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'fury',
      secondaryResource: null,
      primaryStat: 'agility',
      armorType: 'leather'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 파멸 악마사냥꾼 핵심 메커니즘
    this.coreMechanics = {
      builders: [
        'demons_bite', // 악마의 이빨
        'felblade', // 지옥칼날
        'immolation_aura', // 제물의 오라
        'eye_beam' // 안광 (광역)
      ],
      spenders: [
        'chaos_strike', // 혼돈의 일격 (40 격노)
        'annihilation', // 전멸 (변신 중)
        'blade_dance', // 칼춤 (35 격노, 광역)
        'death_sweep', // 죽음의 소용돌이 (변신 중 광역)
        'glaive_tempest', // 글레이브 폭풍
        'chaos_nova' // 혼돈의 회오리
      ],
      cooldowns: [
        { name: 'metamorphosis', cooldown: 240 }, // 탈태
        { name: 'eye_beam', cooldown: 30 }, // 안광
        { name: 'blade_dance', cooldown: 9 }, // 칼춤
        { name: 'immolation_aura', cooldown: 30 }, // 제물의 오라
        { name: 'the_hunt', cooldown: 90 }, // 사냥
        { name: 'essence_break', cooldown: 120 }, // 정수 파괴
        { name: 'vengeful_retreat', cooldown: 25 }, // 복수의 퇴각
        { name: 'fel_rush', cooldown: 10 } // 지옥 질주 (2충전)
      ],
      buffs: [
        'metamorphosis', // 탈태
        'momentum', // 탄력
        'furious_gaze', // 격노한 시선
        'chaos_theory', // 혼돈 이론
        'blind_fury', // 맹목적인 격노
        'inner_demon', // 내면의 악마
        'initiative', // 선제권
        'tactical_retreat' // 전술적 퇴각
      ],
      debuffs: [
        'burning_wound', // 불타는 상처
        'essence_break', // 정수 파괴
        'serrated_glaive' // 톱날 글레이브
      ],
      procs: [
        'chaos_theory', // 혼돈 이론
        'inner_demon', // 내면의 악마
        'furious_gaze', // 격노한 시선
        'blind_fury' // 맹목적인 격노
      ]
    };

    // 파멸 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '이중 도약', '복수의 퇴각', '지옥 질주', '어둠의 은신',
        '혼돈의 회오리', '흐릿한 존재', '악마 사냥', '혼돈의 낙인'
      ],
      specTree: [
        '탈태', '안광', '사냥', '정수 파괴',
        '탄력', '혼돈 이론', '격노한 시선', '내면의 악마',
        '선제권', '악마칼날', '글레이브 폭풍', '타오르는 증오'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'agility',
      2: 'critical', // 40% 목표
      3: 'haste', // 15% 목표
      4: 'mastery',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'essence_break', condition: 'cooldown.ready && fury >= 30' },
      { skill: 'metamorphosis', condition: 'cooldown.ready' },
      { skill: 'the_hunt', condition: 'cooldown.ready' },
      { skill: 'eye_beam', condition: 'cooldown.ready && fury <= 30' },
      { skill: 'blade_dance', condition: 'cooldown.ready && fury >= 35' },
      { skill: 'death_sweep', condition: 'buff.metamorphosis.up && fury >= 35' },
      { skill: 'immolation_aura', condition: 'cooldown.ready' },
      { skill: 'annihilation', condition: 'buff.metamorphosis.up && fury >= 40' },
      { skill: 'chaos_strike', condition: 'fury >= 40' },
      { skill: 'glaive_tempest', condition: 'cooldown.ready && fury >= 30' },
      { skill: 'fel_rush', condition: 'charges >= 1 && buff.momentum.down' },
      { skill: 'vengeful_retreat', condition: 'buff.momentum.down && buff.initiative.down' },
      { skill: 'felblade', condition: 'fury < 80' },
      { skill: 'demons_bite', condition: 'fury < 70' }
    ];

    // 파멸 특화 가중치
    this.learningWeights = {
      dps: 0.50, // DPS
      rotation: 0.20, // 탈태 관리
      resource: 0.20, // 격노 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7600000, // 7.6M DPS
      targetCPM: 55, // 매우 높은 APM
      metamorphosis_uptime: 35, // 탈태 유지율 35%+
      targetResourceEfficiency: 95
    };

    this.initialize();
  }

  // 파멸 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 탈태 유지율
      metamorphosisUptime: combatLog.buffUptimes?.metamorphosis || 0,

      // 탄력 유지율
      momentumUptime: combatLog.buffUptimes?.momentum || 0,

      // 안광 사용률
      eyeBeamUsage: this.calculateEyeBeamUsage(combatLog),

      // 혼돈의 일격 효율성
      chaosStrikeEfficiency: this.calculateChaosStrikeEfficiency(combatLog),

      // 격노 낭비율
      furyWaste: combatLog.resourceWaste?.fury || 0,

      // 정수 파괴 효율성
      essenceBreakEfficiency: this.calculateEssenceBreakEfficiency(combatLog),

      // 이동기 활용률
      mobilityUsage: this.calculateMobilityUsage(combatLog),

      // 혼돈 이론 발동률
      chaosTheoryProcs: combatLog.procs?.chaos_theory || 0,

      // 칼춤/죽음의 소용돌이 사용률
      bladeDanceUsage: this.calculateBladeDanceUsage(combatLog),

      // 평균 격노
      averageFury: combatLog.averageResources?.fury || 0
    };
  }

  // 안광 사용률 계산
  calculateEyeBeamUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const eyeBeams = combatLog.skills.filter(s => s.name === 'eye_beam').length;
    const combatDuration = combatLog.duration || 1;

    // 안광은 30초 쿨다운
    const expectedCasts = Math.floor(combatDuration / 30) + 1;

    return Math.min(100, (eyeBeams / expectedCasts) * 100);
  }

  // 혼돈의 일격 효율성 계산
  calculateChaosStrikeEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const chaosStrikes = combatLog.skills.filter(s =>
      s.name === 'chaos_strike' || s.name === 'annihilation'
    );
    let efficientStrikes = 0;

    chaosStrikes.forEach(cs => {
      // 40-80 격노 범위에서 사용한 경우 효율적
      if (cs.fury_at_cast >= 40 && cs.fury_at_cast <= 80) {
        efficientStrikes++;
      }
    });

    return chaosStrikes.length > 0
      ? (efficientStrikes / chaosStrikes.length) * 100
      : 0;
  }

  // 정수 파괴 효율성 계산
  calculateEssenceBreakEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const essenceBreaks = combatLog.skills.filter(s => s.name === 'essence_break');
    let totalEfficiency = 0;

    essenceBreaks.forEach(eb => {
      // 정수 파괴 후 사용한 혼돈의 일격 수
      const followupStrikes = eb.followup_chaos_strikes || 0;
      // 디버프 동안 5-6개가 이상적
      totalEfficiency += Math.min(100, (followupStrikes / 5) * 100);
    });

    return essenceBreaks.length > 0
      ? totalEfficiency / essenceBreaks.length
      : 0;
  }

  // 이동기 활용률 계산
  calculateMobilityUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const mobilitySkills = combatLog.skills.filter(s =>
      ['fel_rush', 'vengeful_retreat'].includes(s.name)
    );
    let momentumGains = 0;

    mobilitySkills.forEach(skill => {
      // 탄력 버프를 얻은 경우
      if (skill.gained_momentum) {
        momentumGains++;
      }
    });

    return mobilitySkills.length > 0
      ? (momentumGains / mobilitySkills.length) * 100
      : 0;
  }

  // 칼춤/죽음의 소용돌이 사용률 계산
  calculateBladeDanceUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const bladeDances = combatLog.skills.filter(s =>
      s.name === 'blade_dance' || s.name === 'death_sweep'
    ).length;
    const combatDuration = combatLog.duration || 1;

    // 칼춤은 9초 쿨다운
    const expectedCasts = Math.floor(combatDuration / 9) + 1;

    return Math.min(100, (bladeDances / expectedCasts) * 100);
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.5; // 파멸은 높은 복잡도 (빠른 페이스)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 탈태 체크
    if (currentState.cooldowns?.metamorphosis?.ready) {
      advice.push('탈태 사용!');
    }

    // 격노 체크
    if (currentState.fury >= 100) {
      advice.push('격노 초과: 혼돈의 일격!');
    } else if (currentState.fury < 30) {
      advice.push('격노 부족: 악마의 이빨');
    }

    // 안광 준비
    if (currentState.cooldowns?.eye_beam?.ready && currentState.fury <= 30) {
      advice.push('안광 사용!');
    }

    // 탄력 체크
    if (!currentState.buffs?.momentum) {
      advice.push('탄력 버프 필요!');
    }

    // 정수 파괴
    if (currentState.cooldowns?.essence_break?.ready) {
      advice.push('정수 파괴 사용!');
    }

    // 칼춤
    if (currentState.cooldowns?.blade_dance?.ready) {
      advice.push('칼춤 사용!');
    }

    // 광역
    if (currentState.enemy_count >= 3) {
      advice.push('안광 + 칼춤 우선!');
    }

    // 탈태 중
    if (currentState.buffs?.metamorphosis) {
      advice.push('전멸 + 죽음의 소용돌이!');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.fury >= 100) {
      advice.push('격노 초과: 즉시 소비');
    } else if (currentState.fury < 20) {
      advice.push('격노 부족: 빌더 사용');
    }

    if (currentState.fury >= 40 && currentState.fury <= 80) {
      advice.push('격노 최적 범위');
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
        '제물의 오라',
        '탈태',
        '안광',
        '정수 파괴',
        '전멸 스팸',
        '사냥'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '탈태 유지',
        '혼돈의 일격 스팸',
        '칼춤 쿨마다',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '모든 쿨다운 정렬',
        '탈태 + 정수 파괴',
        '사냥 정렬',
        '격노 덤핑'
      ];
    } else {
      strategy.priorities = [
        '탄력 유지',
        '격노 40-80 유지',
        '안광 쿨마다',
        '칼춤 쿨마다'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 탄력 유지');
      strategy.upcoming.push('쫄 페이즈: 안광 + 글레이브 폭풍');
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
    const simplifiedAPL = aplData.getSimplifiedAPL('demonhunter', 'havoc');
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
    return 'demons_bite';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 파멸 특화 조건 평가
    const conditions = {
      'cooldown.ready && fury >= 30':
        gameState.fury >= 30,
      'cooldown.ready': true, // 간소화
      'cooldown.ready && fury <= 30':
        gameState.fury <= 30,
      'cooldown.ready && fury >= 35':
        gameState.fury >= 35,
      'buff.metamorphosis.up && fury >= 35':
        gameState.buffs?.metamorphosis && gameState.fury >= 35,
      'buff.metamorphosis.up && fury >= 40':
        gameState.buffs?.metamorphosis && gameState.fury >= 40,
      'fury >= 40':
        gameState.fury >= 40,
      'charges >= 1 && buff.momentum.down':
        !gameState.buffs?.momentum,
      'buff.momentum.down && buff.initiative.down':
        !gameState.buffs?.momentum && !gameState.buffs?.initiative,
      'fury < 80':
        gameState.fury < 80,
      'fury < 70':
        gameState.fury < 70
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 파멸 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        metamorphosis_uptime: currentState.buffs?.metamorphosis ? 100 : 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 탈태 관리
    if (currentState.cooldowns?.metamorphosis?.ready) {
      analysis.improvements.push({
        area: 'metamorphosis',
        message: '탈태 사용 필요',
        impact: 'high'
      });
    }

    // 격노 관리
    if (currentState.fury >= 100) {
      analysis.improvements.push({
        area: 'fury',
        message: '격노 낭비 방지',
        impact: 'medium'
      });
    }

    // 탄력 관리
    if (!currentState.buffs?.momentum) {
      analysis.improvements.push({
        area: 'momentum',
        message: '탄력 유지 필요',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (파멸 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 탈태 유지율과 탄력 유지율이 좋은 로그에 가중치
      const metaUptime = log.metamorphosisUptime || 0;
      const momentumUptime = log.momentumUptime || 0;

      if (metaUptime >= 35 && momentumUptime >= 50) {
        log.weight = 1.5; // 좋은 예시
      } else if (metaUptime < 20 || momentumUptime < 30) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('😈 파멸 악마사냥꾼 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 파멸 악마사냥꾼 신규 모델 생성');
    }

    console.log('✅ 파멸 악마사냥꾼 AI 준비 완료');
  }
}

export default HavocDemonHunterAI;