// 죽음의 기사 언홀리 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class UnholyDeathKnightAI extends SpecializationAI {
  constructor() {
    super('deathknight', 'unholy');

    // 언홀리 죽음의 기사 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'runic_power',
      primaryStat: 'strength',
      armorType: 'plate'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 언홀리 죽음의 기사 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'festering_strike', // 고름 상처
        'scourge_strike', // 스컬지 강타
        'death_and_decay', // 죽음과 부패
        'death_coil' // 죽음의 고리
      ],
      spender: [
        'death_coil', // 죽음의 고리 (룬 파워 소모)
        'epidemic', // 유행 (광역)
        'army_of_the_damned' // 군대 소모
      ],
      cooldowns: [
        { name: 'army_of_the_dead', cooldown: 480 }, // 죽은 자의 군대
        { name: 'apocalypse', cooldown: 90 }, // 아포칼립스
        { name: 'unholy_assault', cooldown: 90 }, // 부정의 습격
        { name: 'dark_transformation', cooldown: 60 }, // 어둠의 변신
        { name: 'summon_gargoyle', cooldown: 180 } // 가고일 소환
      ],
      buffs: [
        'sudden_doom', // 갑작스런 파멸 (무료 죽음의 고리)
        'dark_transformation', // 어둠의 변신 (펫 강화)
        'unholy_assault', // 부정의 습격
        'festermight' // 고름의 힘
      ],
      debuffs: [
        'festering_wound', // 고름 상처 (핵심 디버프)
        'death_and_decay', // 죽음과 부패
        'virulent_plague' // 악성 역병
      ],
      procs: [
        'sudden_doom', // 갑작스런 파멸
        'runic_corruption' // 룬 타락
      ]
    };

    // 언홀리 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '죽음의 마수', '얼음 같은 손길', '영혼 수확자', '죽음의 진군',
        '마법 보호막', '대마법 보호막', '리치본', '죽음의 협약'
      ],
      specTree: [
        '아포칼립스', '군대의 힘', '휘몰아치는 역병', '갑작스런 파멸',
        '가고일 소환', '어둠의 변신', '부정의 습격', '고름의 힘',
        '감염자', '역병 사도', '영원한 고통', '악의적인 감염'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'strength',
      2: 'haste', // 25% 목표
      3: 'critical',
      4: 'mastery',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'death_and_decay', condition: 'spell_targets >= 2 || cleave_soon' },
      { skill: 'festering_strike', condition: 'debuff.festering_wound.stack < 4' },
      { skill: 'apocalypse', condition: 'debuff.festering_wound.stack >= 4' },
      { skill: 'unholy_assault', condition: 'debuff.festering_wound.stack >= 2' },
      { skill: 'death_coil', condition: 'runic_power >= 80 || buff.sudden_doom.up' },
      { skill: 'scourge_strike', condition: 'debuff.festering_wound.stack >= 1' },
      { skill: 'epidemic', condition: 'spell_targets >= 2 && runic_power >= 30' }
    ];

    // 언홀리 특화 가중치
    this.learningWeights = {
      dps: 0.40, // DPS
      rotation: 0.30, // 고름 상처 관리가 핵심
      resource: 0.20, // 룬 파워 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 6500000, // 6.5M DPS
      targetCPM: 35, // 중간 APM
      festering_uptime: 95, // 고름 상처 유지율 95%+
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  // 언홀리 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 고름 상처 평균 스택
      avgFesteringStacks: combatLog.avgFesteringStacks || 0,

      // 아포칼립스 효율성
      apocalypseEfficiency: this.calculateApocalypseEfficiency(combatLog),

      // 죽은 자의 군대 타이밍
      armyTiming: combatLog.armyTiming || 0,

      // 갑작스런 파멸 발동률
      suddenDoomProcs: combatLog.procs?.sudden_doom || 0,

      // 펫 가동시간
      petUptime: combatLog.petUptime || 0,

      // 어둠의 변신 유지율
      darkTransformUptime: combatLog.buffUptimes?.dark_transformation || 0,

      // 룬 파워 낭비율
      runicPowerWaste: combatLog.resourceWaste?.runic_power || 0,

      // 데스 앤 디케이 사용률
      deathAndDecayUsage: this.calculateDnDUsage(combatLog),

      // 유행 사용 효율
      epidemicEfficiency: this.calculateEpidemicEfficiency(combatLog)
    };
  }

  // 아포칼립스 효율 계산
  calculateApocalypseEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const apocalypses = combatLog.skills.filter(s => s.name === 'apocalypse');
    let totalEfficiency = 0;

    apocalypses.forEach(apo => {
      // 아포칼립스 시전시 고름 상처 스택 확인
      const woundsAtCast = apo.festering_wounds || 0;
      // 4+ 스택이 이상적
      totalEfficiency += Math.min(100, (woundsAtCast / 4) * 100);
    });

    return apocalypses.length > 0
      ? totalEfficiency / apocalypses.length
      : 0;
  }

  // 데스 앤 디케이 사용률 계산
  calculateDnDUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const dndCasts = combatLog.skills.filter(s => s.name === 'death_and_decay').length;
    const combatDuration = combatLog.duration || 1;

    // 데스 앤 디케이는 30초 쿨다운
    const expectedCasts = Math.floor(combatDuration / 30) + 1;

    return Math.min(100, (dndCasts / expectedCasts) * 100);
  }

  // 유행 효율 계산
  calculateEpidemicEfficiency(combatLog) {
    if (!combatLog.skills) return 100;

    const epidemics = combatLog.skills.filter(s => s.name === 'epidemic');
    const totalRP = combatLog.totalRunicPowerGenerated || 0;

    // 광역 상황에서 유행 사용률
    if (combatLog.averageTargets > 2) {
      const epidemicRP = epidemics.length * 30;
      return Math.min(100, (epidemicRP / totalRP) * 100);
    }

    return 100;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.5; // 언홀리는 높은 복잡도
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 고름 상처 체크
    if (currentState.debuffs?.festering_wound < 4) {
      advice.push('고름 상처 4+ 스택 필요');
    }

    // 아포칼립스 준비
    if (currentState.debuffs?.festering_wound >= 4 && currentState.cooldowns?.apocalypse?.ready) {
      advice.push('아포칼립스 사용!');
    }

    // 룬 파워 체크
    if (currentState.runic_power >= 80) {
      advice.push('죽음의 고리로 룬 파워 소모');
    }

    // 갑작스런 파멸
    if (currentState.buffs?.sudden_doom) {
      advice.push('갑작스런 파멸: 무료 죽음의 고리');
    }

    // 광역
    if (currentState.enemy_count >= 2) {
      advice.push('데스 앤 디케이 + 유행 사용');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.runic_power < 30) {
      advice.push('룬 파워 부족: 고름 상처/스컬지 강타 사용');
    } else if (currentState.runic_power > 90) {
      advice.push('룬 파워 초과: 죽음의 고리 사용');
    }

    if (currentState.runes < 2) {
      advice.push('룬 부족: 룬 재생 대기');
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
        '죽은 자의 군대 (풀 전)',
        '고름 상처 4+ 스택',
        '아포칼립스',
        '어둠의 변신',
        '부정의 습격'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '고름 상처 유지',
        '죽음의 고리 스팸',
        '갑작스런 파멸 즉시 사용'
      ];
    } else {
      strategy.priorities = [
        '고름 상처 4-6 스택 유지',
        '룬 파워 80 이하 유지',
        '데스 앤 디케이 쿨마다',
        '어둠의 변신 쿨마다'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 죽음의 진군 준비');
      strategy.upcoming.push('쫄 페이즈: 유행 + 데스 앤 디케이');
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
    const simplifiedAPL = aplData.getSimplifiedAPL('deathknight', 'unholy');
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
    return 'scourge_strike';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 언홀리 특화 조건 평가
    const conditions = {
      'debuff.festering_wound.stack < 4': gameState.festering_wound_stacks < 4,
      'debuff.festering_wound.stack >= 4': gameState.festering_wound_stacks >= 4,
      'debuff.festering_wound.stack >= 1': gameState.festering_wound_stacks >= 1,
      'runic_power >= 80': gameState.runic_power >= 80,
      'runic_power >= 30': gameState.runic_power >= 30,
      'buff.sudden_doom.up': gameState.buffs?.sudden_doom,
      'spell_targets >= 2': gameState.enemy_count >= 2,
      'spell_targets >= 2 || cleave_soon': gameState.enemy_count >= 2 || gameState.cleave_soon,
      'target.time_to_die > 35': gameState.target_time_to_die > 35,
      'pet.active': gameState.pet_active,
      'death_and_decay.ticking': gameState.ground_effects?.death_and_decay
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 언홀리 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        festering_wounds: currentState.festering_wound_stacks || 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 고름 상처 관리
    if (currentState.festering_wound_stacks < 4) {
      analysis.improvements.push({
        area: 'wounds',
        message: `고름 상처 스택 부족: ${currentState.festering_wound_stacks} → 4+`,
        impact: 'high'
      });
    }

    // 룬 파워 관리
    if (prediction.resourceScore < 85) {
      analysis.improvements.push({
        area: 'runic_power',
        message: '룬 파워 관리 최적화 필요',
        impact: 'medium'
      });
    }

    // 쿨다운 정렬
    if (prediction.rotationScore < 85) {
      analysis.improvements.push({
        area: 'cooldowns',
        message: '아포칼립스와 부정의 습격 정렬 필요',
        impact: 'high'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (언홀리 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 고름 상처 관리가 좋은 로그에 가중치
      if (log.avgFesteringStacks > 4 && log.avgFesteringStacks < 6) {
        log.weight = 1.5; // 좋은 예시
      } else if (log.avgFesteringStacks < 3) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('💀 언홀리 죽음의 기사 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 언홀리 죽음의 기사 신규 모델 생성');
    }

    console.log('✅ 언홀리 죽음의 기사 AI 준비 완료');
  }
}

export default UnholyDeathKnightAI;