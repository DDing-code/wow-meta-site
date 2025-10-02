// 사냥꾼 야수 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class BeastMasteryHunterAI extends SpecializationAI {
  constructor() {
    super('hunter', 'beastmastery');

    // 야수 사냥꾼 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'focus',
      primaryStat: 'agility',
      armorType: 'mail'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 야수 사냥꾼 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'barbed_shot', // 가시 사격
        'cobra_shot', // 코브라 사격
        'dire_beast', // 광포한 야수
        'kill_command', // 살육 명령
        'multi_shot' // 연발 사격 (광역)
      ],
      spender: [
        'kill_command', // 살육 명령 (집중 소모)
        'kill_shot', // 마무리 사격
        'explosive_shot', // 폭발 사격
        'serpent_sting', // 독사 쐐기
        'wailing_arrow' // 애도의 화살
      ],
      cooldowns: [
        { name: 'bestial_wrath', cooldown: 90 }, // 야수의 격노
        { name: 'call_of_the_wild', cooldown: 180 }, // 야생의 부름
        { name: 'bloodshed', cooldown: 60 }, // 피흘리기
        { name: 'dire_beast', cooldown: 20 }, // 광포한 야수
        { name: 'aspect_of_the_wild', cooldown: 120 } // 야생의 상
      ],
      buffs: [
        'beast_cleave', // 야수 가르기 (펫 광역)
        'bestial_wrath', // 야수의 격노
        'call_of_the_wild', // 야생의 부름
        'frenzy', // 광란 (펫 버프)
        'aspect_of_the_wild', // 야생의 상
        'barbed_shot' // 가시 사격 버프
      ],
      debuffs: [
        'hunters_mark', // 사냥꾼의 징표
        'barbed_shot', // 가시 사격 디버프
        'serpent_sting', // 독사 쐐기
        'bloodshed' // 피흘리기
      ],
      procs: [
        'wild_call', // 야생의 부름 (무료 가시 사격)
        'brutal_companion', // 잔혹한 동료
        'beast_cleave' // 야수 가르기
      ]
    };

    // 야수 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '사냥꾼의 징표', '상급자 집중', '위장', '생존 전술',
        '타르 덫', '얼음 덫', '저항의 상', '치타의 상'
      ],
      specTree: [
        '야생의 부름', '피흘리기', '광포한 야수', '야수의 격노',
        '야생의 부름', '잔혹한 동료', '사나운 본능', '코브라의 쐐기',
        '킬러 코브라', '야수 군주', '치명적인 명령', '광란'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'agility',
      2: 'critical', // 35% 목표
      3: 'haste', // 20% 목표
      4: 'mastery',
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'hunters_mark', condition: '!debuff.hunters_mark.up' },
      { skill: 'barbed_shot', condition: 'charges >= 2 || buff.wild_call.up' },
      { skill: 'kill_command', condition: 'focus >= 30' },
      { skill: 'call_of_the_wild', condition: 'cooldown.ready' },
      { skill: 'bestial_wrath', condition: 'cooldown.ready' },
      { skill: 'bloodshed', condition: 'cooldown.ready' },
      { skill: 'kill_shot', condition: 'target.health_pct <= 20' },
      { skill: 'multi_shot', condition: 'spell_targets >= 3 && buff.beast_cleave.down' },
      { skill: 'cobra_shot', condition: 'focus >= 35' },
      { skill: 'dire_beast', condition: 'cooldown.ready' }
    ];

    // 야수 특화 가중치
    this.learningWeights = {
      dps: 0.40, // DPS
      rotation: 0.25, // 펫 관리가 핵심
      resource: 0.25, // 집중 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 6500000, // 6.5M DPS
      targetCPM: 35, // 중간 APM
      frenzy_stacks: 3, // 광란 3스택 유지
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  // 야수 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 광란 평균 스택
      avgFrenzyStacks: combatLog.avgFrenzyStacks || 0,

      // 야수의 격노 효율성
      bestialWrathEfficiency: this.calculateBestialWrathEfficiency(combatLog),

      // 가시 사격 유지율
      barbedShotUptime: combatLog.debuffUptimes?.barbed_shot || 0,

      // 야생의 부름 발동률
      wildCallProcs: combatLog.procs?.wild_call || 0,

      // 펫 가동시간
      petUptime: combatLog.petUptime || 0,

      // 야수 가르기 사용률
      beastCleaveUsage: this.calculateBeastCleaveUsage(combatLog),

      // 집중 낭비율
      focusWaste: combatLog.resourceWaste?.focus || 0,

      // 살육 명령 사용 효율
      killCommandEfficiency: this.calculateKillCommandEfficiency(combatLog),

      // 사냥꾼의 징표 유지율
      huntersMarkUptime: combatLog.debuffUptimes?.hunters_mark || 0
    };
  }

  // 야수의 격노 효율 계산
  calculateBestialWrathEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const wraths = combatLog.skills.filter(s => s.name === 'bestial_wrath');
    let totalEfficiency = 0;

    wraths.forEach(wrath => {
      // 야수의 격노 시전시 광란 스택 확인
      const frenzyAtCast = wrath.frenzy_stacks || 0;
      // 3 스택이 이상적
      totalEfficiency += Math.min(100, (frenzyAtCast / 3) * 100);
    });

    return wraths.length > 0
      ? totalEfficiency / wraths.length
      : 0;
  }

  // 야수 가르기 사용률 계산
  calculateBeastCleaveUsage(combatLog) {
    if (!combatLog.skills) return 100;

    const multiShots = combatLog.skills.filter(s => s.name === 'multi_shot');

    // 광역 상황에서만 계산
    if (combatLog.averageTargets >= 3) {
      const combatDuration = combatLog.duration || 1;
      // 야수 가르기는 4초 지속, 연발 사격으로 유지
      const expectedCasts = Math.floor(combatDuration / 4);
      return Math.min(100, (multiShots.length / expectedCasts) * 100);
    }

    return 100;
  }

  // 살육 명령 효율 계산
  calculateKillCommandEfficiency(combatLog) {
    if (!combatLog.skills) return 0;

    const killCommands = combatLog.skills.filter(s => s.name === 'kill_command');
    const combatDuration = combatLog.duration || 1;

    // 살육 명령은 7.5초 쿨다운 (특성 포함)
    const expectedCasts = Math.floor(combatDuration / 7.5) + 1;

    return Math.min(100, (killCommands.length / expectedCasts) * 100);
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.2; // 야수는 낮은-중간 복잡도
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 사냥꾼의 징표 체크
    if (!currentState.debuffs?.hunters_mark) {
      advice.push('사냥꾼의 징표 적용!');
    }

    // 광란 스택 체크
    if (currentState.frenzy_stacks < 3) {
      advice.push(`광란 ${currentState.frenzy_stacks} 스택 - 가시 사격 필요`);
    }

    // 가시 사격 충전 체크
    if (currentState.barbed_shot_charges >= 2) {
      advice.push('가시 사격 즉시 사용!');
    }

    // 야생의 부름 프록
    if (currentState.buffs?.wild_call) {
      advice.push('야생의 부름: 무료 가시 사격');
    }

    // 집중 관리
    if (currentState.focus >= 100) {
      advice.push('집중 초과: 살육 명령/코브라 사격');
    }

    // 광역
    if (currentState.enemy_count >= 3 && !currentState.buffs?.beast_cleave) {
      advice.push('연발 사격으로 야수 가르기 활성화');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.focus < 30) {
      advice.push('집중 부족: 코브라 사격으로 회복');
    } else if (currentState.focus > 100) {
      advice.push('집중 초과: 살육 명령 사용');
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
        '가시 사격 (2회)',
        '야수의 격노',
        '야생의 부름',
        '살육 명령',
        '코브라 사격'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '마무리 사격 우선',
        '광란 3스택 유지',
        '모든 쿨다운 사용',
        'DPS 극대화'
      ];
    } else if (phase === 'burn') {
      strategy.priorities = [
        '야수의 격노 + 야생의 부름',
        '광란 3스택 필수',
        '피흘리기 정렬',
        '최대 DPS 윈도우'
      ];
    } else {
      strategy.priorities = [
        '광란 3스택 유지',
        '가시 사격 충전 관리',
        '집중 50-80 유지',
        '살육 명령 쿨마다'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 치타의 상 사용');
      strategy.upcoming.push('쫄 페이즈: 연발 사격 + 야수 가르기');
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
    const simplifiedAPL = aplData.getSimplifiedAPL('hunter', 'beastmastery');
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
    return 'cobra_shot';
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    // 야수 특화 조건 평가
    const conditions = {
      '!debuff.hunters_mark.up': !gameState.debuffs?.hunters_mark,
      'charges >= 2 || buff.wild_call.up': gameState.barbed_shot_charges >= 2 || gameState.buffs?.wild_call,
      'focus >= 30': gameState.focus >= 30,
      'focus >= 35': gameState.focus >= 35,
      'cooldown.ready': true, // 간소화
      'target.health_pct <= 20': gameState.target_hp_percent <= 20,
      'spell_targets >= 3 && buff.beast_cleave.down': gameState.enemy_count >= 3 && !gameState.buffs?.beast_cleave,
      'spell_targets >= 3': gameState.enemy_count >= 3,
      'buff.frenzy.stack < 3': gameState.frenzy_stacks < 3,
      'pet.active': gameState.pet_active !== false
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    // 야수 특화 분석
    const analysis = {
      current: {
        dps: currentState.dps,
        frenzy_stacks: currentState.frenzy_stacks || 0
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 광란 관리
    if (currentState.frenzy_stacks < 3) {
      analysis.improvements.push({
        area: 'frenzy',
        message: `광란 스택 증가 필요: ${currentState.frenzy_stacks} → 3`,
        impact: 'high'
      });
    }

    // 집중 관리
    if (prediction.resourceScore < 85) {
      analysis.improvements.push({
        area: 'focus',
        message: '집중 관리 최적화 필요',
        impact: 'medium'
      });
    }

    // 쿨다운 정렬
    if (prediction.rotationScore < 85) {
      analysis.improvements.push({
        area: 'cooldowns',
        message: '야수의 격노와 야생의 부름 정렬 필요',
        impact: 'high'
      });
    }

    return analysis;
  }

  // 학습 데이터 전처리 (야수 특화)
  preprocessTrainingData(logs) {
    return logs.map(log => {
      // 광란 유지가 좋은 로그에 가중치
      if (log.avgFrenzyStacks >= 2.8) {
        log.weight = 1.5; // 좋은 예시
      } else if (log.avgFrenzyStacks < 2) {
        log.weight = 0.5; // 나쁜 예시
      } else {
        log.weight = 1.0;
      }

      return log;
    });
  }

  // 초기화
  async initialize() {
    console.log('🏹 야수 사냥꾼 AI 초기화 중...');

    // APL 로드
    await this.loadAPL();

    // 저장된 모델 로드
    const loaded = await this.loadModel();

    if (!loaded) {
      // 새 모델 생성
      this.createSpecializedModel();
      console.log('🆕 야수 사냥꾼 신규 모델 생성');
    }

    console.log('✅ 야수 사냥꾼 AI 준비 완료');
  }
}

export default BeastMasteryHunterAI;