// 죽음의 기사 냉기 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class FrostDeathKnightAI extends SpecializationAI {
  constructor() {
    super('deathknight', 'frost');

    // 냉기 죽음의 기사 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'runic_power',
      secondaryResource: 'runes',
      primaryStat: 'strength',
      armorType: 'plate'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 냉기 죽음의 기사 핵심 메커니즘
    this.coreMechanics = {
      builders: [
        'obliterate', // 절멸
        'frost_strike', // 냉기 일격
        'howling_blast', // 울부짖는 돌풍
        'glacial_advance', // 빙하 진격
        'frostscythe' // 서리낫
      ],
      spenders: [
        'frost_strike', // 냉기 일격 (25 룬 마력)
        'glacial_advance', // 빙하 진격 (30 룬 마력)
        'death_and_decay' // 죽음과 부패 (1룬)
      ],
      cooldowns: [
        { name: 'pillar_of_frost', cooldown: 60 }, // 서리 기둥
        { name: 'breath_of_sindragosa', cooldown: 120 }, // 신드라고사의 숨결
        { name: 'frostwyrms_fury', cooldown: 180 }, // 서리고룡의 격노
        { name: 'empower_rune_weapon', cooldown: 120 }, // 룬 무기 강화
        { name: 'abominations_limb', cooldown: 120 }, // 누더기골렘의 사지
        { name: 'chill_streak', cooldown: 45 } // 냉기 연쇄
      ],
      buffs: [
        'pillar_of_frost', // 서리 기둥
        'rime', // 서리 (무료 울부짖는 돌풍)
        'killing_machine', // 살상 기계
        'icy_talons', // 얼음 발톱
        'cold_heart', // 차가운 심장
        'unleashed_frenzy', // 해방된 광란
        'breath_of_sindragosa' // 신드라고사의 숨결
      ],
      debuffs: [
        'frost_fever', // 서리 열병
        'razorice', // 면도날 얼음
        'chains_of_ice' // 얼음 사슬
      ],
      procs: [
        'rime', // 서리
        'killing_machine', // 살상 기계
        'runic_empowerment', // 룬 강화
        'cold_heart' // 차가운 심장
      ]
    };

    // 냉기 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '얼음 같은 손길', '얼음 사슬', '대마법 지대', '죽음의 진군',
        '죽음의 손아귀', '어둠의 명령', '루닉 감쇄', '죽음과 부패'
      ],
      specTree: [
        '서리 기둥', '신드라고사의 숨결', '서리고룡의 격노', '룬 무기 강화',
        '절멸', '서리', '살상 기계', '얼음 발톱',
        '차가운 심장', '빙하 진격', '냉기 연쇄', '누더기골렘의 사지'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'strength',
      2: 'critical', // 33% 목표
      3: 'haste', // 20% 목표
      4: 'mastery',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'breath_of_sindragosa', condition: 'cooldown.ready && runic_power >= 70' },
      { skill: 'pillar_of_frost', condition: 'cooldown.ready' },
      { skill: 'frostwyrms_fury', condition: 'cooldown.ready && buff.pillar_of_frost.up' },
      { skill: 'obliterate', condition: 'buff.killing_machine.up' },
      { skill: 'howling_blast', condition: 'buff.rime.up' },
      { skill: 'frost_strike', condition: 'runic_power >= 80' },
      { skill: 'glacial_advance', condition: 'runic_power >= 30 && spell_targets >= 2' },
      { skill: 'remorseless_winter', condition: 'cooldown.ready' },
      { skill: 'obliterate', condition: 'runes >= 2' },
      { skill: 'howling_blast', condition: '!debuff.frost_fever.up' },
      { skill: 'frost_strike', condition: 'runic_power >= 25' },
      { skill: 'frostscythe', condition: 'spell_targets >= 3 && runes >= 1' }
    ];

    // 냉기 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS
      rotation: 0.25, // 신드라고사의 숨결 관리
      resource: 0.20, // 룬/룬 마력 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 7200000, // 7.2M DPS
      targetCPM: 50, // 높은 APM
      breath_uptime: 30, // 신드라고사의 숨결 유지 시간
      targetResourceEfficiency: 94
    };

    this.initialize();
  }

  // 냉기 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 서리 기둥 유지율
      pillarOfFrostUptime: combatLog.buffUptimes?.pillar_of_frost || 0,

      // 신드라고사의 숨결 평균 지속시간
      breathDuration: this.calculateBreathDuration(combatLog),

      // 서리 발동률
      rimeProcs: combatLog.procs?.rime || 0,

      // 살상 기계 발동률
      killingMachineProcs: combatLog.procs?.killing_machine || 0,

      // 절멸 사용률
      obliterateUsage: this.calculateObliterateUsage(combatLog),

      // 룬 마력 낭비율
      runicPowerWaste: combatLog.resourceWaste?.runic_power || 0,

      // 룬 낭비율
      runeWaste: combatLog.resourceWaste?.runes || 0,

      // 얼음 발톱 유지율
      icyTalonsUptime: combatLog.buffUptimes?.icy_talons || 0,

      // 차가운 심장 스택 활용
      coldHeartUsage: this.calculateColdHeartUsage(combatLog),

      // 평균 룬 마력
      averageRunicPower: combatLog.averageResources?.runic_power || 0
    };
  }

  // 신드라고사의 숨결 지속시간 계산
  calculateBreathDuration(combatLog) {
    if (!combatLog.breathWindows) return 0;

    let totalDuration = 0;
    let windowCount = 0;

    combatLog.breathWindows.forEach(window => {
      totalDuration += window.duration || 0;
      windowCount++;
    });

    return windowCount > 0 ? totalDuration / windowCount : 0;
  }

  // 절멸 사용률 계산
  calculateObliterateUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const obliterates = combatLog.skills.filter(s => s.name === 'obliterate');
    let kmObliterates = 0;

    obliterates.forEach(obl => {
      if (obl.buff_killing_machine) {
        kmObliterates++;
      }
    });

    // 살상 기계 버프 중 절멸 사용 비율
    return obliterates.length > 0
      ? (kmObliterates / obliterates.length) * 100
      : 0;
  }

  // 차가운 심장 활용 계산
  calculateColdHeartUsage(combatLog) {
    if (!combatLog.skills) return 100;

    const chainsOfIce = combatLog.skills.filter(s => s.name === 'chains_of_ice');
    let goodUsage = 0;

    chainsOfIce.forEach(chain => {
      // 15스택 이상에서 사용
      if (chain.cold_heart_stacks >= 15) {
        goodUsage++;
      }
    });

    return chainsOfIce.length > 0
      ? (goodUsage / chainsOfIce.length) * 100
      : 100;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.4; // 냉기는 중상 복잡도 (신드라고사의 숨결 관리)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 신드라고사의 숨결
    if (currentState.cooldowns?.breath_of_sindragosa?.ready && currentState.runic_power >= 70) {
      advice.push('신드라고사의 숨결 준비!');
    }

    // 서리 기둥
    if (currentState.cooldowns?.pillar_of_frost?.ready) {
      advice.push('서리 기둥 사용!');
    }

    // 살상 기계
    if (currentState.buffs?.killing_machine) {
      advice.push('살상 기계: 절멸 크리티컬!');
    }

    // 서리
    if (currentState.buffs?.rime) {
      advice.push('서리: 무료 울부짖는 돌풍!');
    }

    // 룬 마력 관리
    if (currentState.runic_power >= 90) {
      advice.push('룬 마력 초과: 냉기 일격!');
    }

    // 룬 관리
    if (currentState.runes >= 4) {
      advice.push('룬 초과: 절멸 사용!');
    }

    // 광역
    if (currentState.enemy_count >= 3) {
      advice.push('서리낫 + 빙하 진격!');
    }

    // 숨결 유지
    if (currentState.buffs?.breath_of_sindragosa) {
      advice.push('숨결 유지: 룬 관리 주의!');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.runic_power >= 90) {
      advice.push('룬 마력 초과: 냉기 일격 즉시');
    } else if (currentState.runic_power < 25) {
      advice.push('룬 마력 부족: 절멸 사용');
    }

    if (currentState.runes >= 5) {
      advice.push('룬 초과: 즉시 소비');
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
        '울부짖는 돌풍',
        '서리 기둥',
        '룬 무기 강화',
        '절멸 스팸',
        '신드라고사의 숨결',
        '서리고룡의 격노'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '서리 유지',
        '냉기 일격 스팸',
        '절멸 크리티컬',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '모든 쿨다운 정렬',
        '서리 기둥 + 숨결',
        '룬 무기 강화',
        '최대 DPS 윈도우'
      ];
    } else {
      strategy.priorities = [
        '살상 기계 절멸',
        '서리 울부짖는 돌풍',
        '룬 마력 80 이하 유지',
        '룬 2개 이하 유지'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 죽음의 진군');
      strategy.upcoming.push('쫄 페이즈: 서리낫 + 무자비한 겨울');
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
    const simplifiedAPL = aplData.getSimplifiedAPL('deathknight', 'frost');
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
    return 'obliterate';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 냉기 특화 조건 평가
    const conditions = {
      'cooldown.ready && runic_power >= 70':
        gameState.runic_power >= 70,
      'cooldown.ready': true,
      'cooldown.ready && buff.pillar_of_frost.up':
        gameState.buffs?.pillar_of_frost,
      'buff.killing_machine.up':
        gameState.buffs?.killing_machine,
      'buff.rime.up':
        gameState.buffs?.rime,
      'runic_power >= 80':
        gameState.runic_power >= 80,
      'runic_power >= 30 && spell_targets >= 2':
        gameState.runic_power >= 30 && gameState.enemy_count >= 2,
      'runes >= 2':
        gameState.runes >= 2,
      '!debuff.frost_fever.up':
        !gameState.debuffs?.frost_fever,
      'runic_power >= 25':
        gameState.runic_power >= 25,
      'spell_targets >= 3 && runes >= 1':
        gameState.enemy_count >= 3 && gameState.runes >= 1
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 냉기 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        pillar_uptime: currentState.buffs?.pillar_of_frost ? 100 : 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 서리 기둥 관리
    if (currentState.cooldowns?.pillar_of_frost?.ready) {
      analysis.improvements.push({
        area: 'pillar_of_frost',
        message: '서리 기둥 사용',
        impact: 'high'
      });
    }

    // 살상 기계 활용
    if (currentState.buffs?.killing_machine && !currentState.obliterate_next) {
      analysis.improvements.push({
        area: 'killing_machine',
        message: '살상 기계 절멸 필요',
        impact: 'high'
      });
    }

    // 룬 마력 관리
    if (currentState.runic_power >= 90) {
      analysis.improvements.push({
        area: 'runic_power',
        message: '룬 마력 낭비 방지',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (냉기 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 신드라고사의 숨결 지속시간이 좋은 로그에 가중치
      if (log.breathDuration >= 15) {
        log.weight = 1.5; // 좋은 예시
      } else if (log.breathDuration < 5) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('❄️ 냉기 죽음의 기사 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 냉기 죽음의 기사 신규 모델 생성');
    }

    console.log('✅ 냉기 죽음의 기사 AI 준비 완료');
  }
}

export default FrostDeathKnightAI;