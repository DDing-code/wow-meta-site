// 드루이드 야성 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class FeralDruidAI extends SpecializationAI {
  constructor() {
    super('druid', 'feral');

    // 야성 드루이드 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'energy',
      primaryStat: 'agility',
      armorType: 'leather'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 야성 드루이드 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'shred', // 갈기갈기
        'rake', // 갈퀴발톱
        'moonfire', // 달빛섬광
        'swipe', // 할퀴기 (광역)
        'thrash' // 난타 (광역)
      ],
      spender: [
        'rip', // 찢어발기기
        'ferocious_bite', // 사나운 이빨
        'maim', // 불구만들기
        'primal_wrath' // 원시 분노 (광역)
      ],
      cooldowns: [
        { name: 'tigers_fury', cooldown: 30 }, // 호랑이의 분노
        { name: 'berserk', cooldown: 180 }, // 광폭화
        { name: 'incarnation', cooldown: 180 }, // 화신: 야수의 왕
        { name: 'convoke_the_spirits', cooldown: 120 }, // 정령 소환
        { name: 'feral_frenzy', cooldown: 45 } // 야성 광란
      ],
      buffs: [
        'cat_form', // 표범 변신
        'tigers_fury', // 호랑이의 분노
        'berserk', // 광폭화
        'bloodtalons', // 피톱니
        'clearcasting', // 명료화
        'sudden_ambush' // 급습
      ],
      debuffs: [
        'rake', // 갈퀴발톱
        'rip', // 찢어발기기
        'moonfire', // 달빛섬광
        'thrash', // 난타
        'adaptive_swarm' // 적응형 떼
      ],
      procs: [
        'bloodtalons', // 피톱니
        'clearcasting', // 명료화
        'sudden_ambush', // 급습
        'omen_of_clarity' // 명료한 징조
      ]
    };

    // 야성 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '달빛섬광', '정령 소환', '야생 충전', '자연의 신속성',
        '야생의 돌진', '호랑이 대시', '표범 변신', '자연의 치유'
      ],
      specTree: [
        '갈퀴발톱', '찢어발기기', '호랑이의 분노', '광폭화',
        '피톱니', '명료한 징조', '야성 광란', '원시 분노',
        '화신: 야수의 왕', '적응형 떼', '사브라 이빨', '순간 매복'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'agility',
      2: 'critical', // 40% 목표
      3: 'mastery', // 가조르 스택
      4: 'versatility',
      5: 'haste'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'rake', condition: '!debuff.rake.up || debuff.rake.remains <= 3' },
      { skill: 'rip', condition: 'combo_points >= 5 && (!debuff.rip.up || debuff.rip.remains <= 5)' },
      { skill: 'tigers_fury', condition: 'energy <= 35' },
      { skill: 'ferocious_bite', condition: 'combo_points >= 5 && debuff.rip.up && energy >= 50' },
      { skill: 'moonfire', condition: '!debuff.moonfire.up' },
      { skill: 'shred', condition: 'combo_points < 5' },
      { skill: 'thrash', condition: 'targets >= 3 && !debuff.thrash.up' },
      { skill: 'swipe', condition: 'targets >= 4' }
    ];

    // 야성 특화 가중치
    this.learningWeights = {
      dps: 0.50, // DPS가 최우선
      rotation: 0.30, // 도트 관리와 콤보 포인트
      resource: 0.15, // 에너지 관리
      survival: 0.05 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 6900000, // 6.9M DPS
      targetCPM: 55, // 매우 높은 APM
      dot_uptime: 95, // 도트 유지율
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  // 야성 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 갈퀴발톱 유지율
      rakeUptime: combatLog.debuffUptimes?.rake || 0,

      // 찢어발기기 유지율
      ripUptime: combatLog.debuffUptimes?.rip || 0,

      // 콤보 포인트 효율
      comboPointEfficiency: this.calculateComboPointEfficiency(combatLog),

      // 스냅샷 효율 (도트 강화)
      snapshotEfficiency: this.calculateSnapshotEfficiency(combatLog),

      // 에너지 관리
      energyManagement: this.calculateEnergyManagement(combatLog),

      // 호랑이의 분노 효율
      tigersFuryEfficiency: this.calculateTigersFuryEfficiency(combatLog),

      // 피톱니 발동률
      bloodtalonsProcs: combatLog.procs?.bloodtalons || 0,

      // 명료화 발동률
      clearcastingProcs: combatLog.procs?.clearcasting || 0,

      // 사나운 이빨 효율
      ferociousBiteEfficiency: this.calculateFerociousBiteEfficiency(combatLog),

      // 광폭화/화신 효율
      berserkEfficiency: this.calculateBerserkEfficiency(combatLog)
    };
  }

  // 콤보 포인트 효율 계산
  calculateComboPointEfficiency(combatLog) {
    if (!combatLog.comboPoints) return 0;

    const totalGenerated = combatLog.comboPoints.generated || 0;
    const totalWasted = combatLog.comboPoints.wasted || 0;

    return totalGenerated > 0 ? Math.max(0, 100 - (totalWasted / totalGenerated * 100)) : 0;
  }

  // 스냅샷 효율 계산
  calculateSnapshotEfficiency(combatLog) {
    if (!combatLog.snapshots) return 0;

    const goodSnapshots = combatLog.snapshots.enhanced || 0;
    const totalSnapshots = combatLog.snapshots.total || 0;

    return totalSnapshots > 0 ? (goodSnapshots / totalSnapshots) * 100 : 0;
  }

  // 에너지 관리 계산
  calculateEnergyManagement(combatLog) {
    if (!combatLog.energy) return 100;

    const cappedTime = combatLog.energy.cappedTime || 0;
    const totalTime = combatLog.duration || 1;

    // 에너지 캡핑 시간이 5% 이하가 이상적
    return Math.max(0, 100 - (cappedTime / totalTime * 100 * 20));
  }

  // 호랑이의 분노 효율 계산
  calculateTigersFuryEfficiency(combatLog) {
    if (!combatLog.buffs?.tigers_fury) return 0;

    const furyUses = combatLog.buffs.tigers_fury.uses || 0;
    const maxPossible = Math.floor(combatLog.duration / 30) + 1;

    return (furyUses / maxPossible) * 100;
  }

  // 사나운 이빨 효율 계산
  calculateFerociousBiteEfficiency(combatLog) {
    if (!combatLog.skills) return 100;

    const bites = combatLog.skills.filter(s => s.name === 'ferocious_bite');
    let totalEfficiency = 0;

    bites.forEach(bite => {
      const comboPoints = bite.combo_points || 0;
      const energy = bite.energy || 0;

      // 5콤보에 과도한 에너지로 사용하는 것이 이상적
      if (comboPoints >= 5 && energy >= 50) {
        totalEfficiency += 100;
      } else if (comboPoints >= 5) {
        totalEfficiency += 70;
      } else {
        totalEfficiency += 20;
      }
    });

    return bites.length > 0 ? totalEfficiency / bites.length : 100;
  }

  // 광폭화/화신 효율 계산
  calculateBerserkEfficiency(combatLog) {
    if (!combatLog.buffs?.berserk && !combatLog.buffs?.incarnation) return 0;

    const berserkDamage = combatLog.buffs?.berserk?.damage || 0;
    const incarnationDamage = combatLog.buffs?.incarnation?.damage || 0;
    const totalDamage = combatLog.damage || 0;

    if (totalDamage === 0) return 0;

    const cooldownDamage = berserkDamage + incarnationDamage;
    return Math.min(100, (cooldownDamage / totalDamage) * 100 * 3);
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.7; // 야성은 매우 높은 복잡도 (도트 관리 + 스냅샷)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 갈퀴발톱 체크
    if (!currentState.debuffs?.rake || currentState.debuffs.rake.remaining <= 3) {
      advice.push('갈퀴발톱 갱신 필요!');
    }

    // 찢어발기기 체크
    const comboPoints = currentState.combo_points || 0;
    if (comboPoints >= 5) {
      if (!currentState.debuffs?.rip || currentState.debuffs.rip.remaining <= 5) {
        advice.push('찢어발기기 적용/갱신!');
      } else {
        advice.push('사나운 이빨 (마무리)');
      }
    }

    // 에너지 관리
    if (currentState.energy <= 35 && currentState.cooldowns?.tigers_fury?.ready) {
      advice.push('호랑이의 분노 사용!');
    }

    // 피톱니 관리
    if (currentState.buffs?.bloodtalons && currentState.buffs.bloodtalons.stacks >= 2) {
      advice.push('피톱니 2스택: 강화된 도트');
    }

    // 명료화 프록
    if (currentState.buffs?.clearcasting) {
      advice.push('명료화: 무료 갈기갈기');
    }

    // 콤보 포인트 생성
    if (comboPoints < 5) {
      advice.push('갈기갈기로 콤보 생성');
    }

    // 다중 적
    if (currentState.enemy_count >= 3) {
      advice.push('난타/할퀴기 광역 공격');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    const energy = currentState.energy || 0;
    const comboPoints = currentState.combo_points || 0;

    if (energy >= 90) {
      advice.push('에너지 과다: 적극적 스킬 사용');
    } else if (energy <= 20) {
      advice.push('에너지 부족: 회복 대기');
    }

    if (comboPoints >= 5) {
      advice.push('콤보 5: 마무리 기술 사용');
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
        '표범 변신 확인',
        '갈퀴발톱 적용',
        '달빛섬광 적용',
        '콤보 5스택 → 찢어발기기'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '사나운 이빨 우선',
        '모든 쿨다운 정렬',
        '광폭화/화신 활용',
        '도트 유지'
      ];
    } else if (phase === 'add_phase') {
      strategy.priorities = [
        '원시 분노 (광역 찢어발기기)',
        '난타/할퀴기',
        '달빛섬광 다중 적용',
        '적응형 떼 확산'
      ];
    } else {
      strategy.priorities = [
        '도트 95% 유지',
        '콤보 5스택 관리',
        '에너지 캡핑 방지',
        '피톱니 최적화'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 달빛섬광으로 원거리 공격');
      strategy.upcoming.push('쫄 페이즈: 원시 분노로 광역 처리');
    }

    return strategy;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        dps: currentState.dps,
        combo_points: currentState.combo_points,
        dot_uptime: (currentState.rake_uptime + currentState.rip_uptime) / 2
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 도트 관리
    if (currentState.rake_uptime < 90 || currentState.rip_uptime < 90) {
      analysis.improvements.push({
        area: 'dots',
        message: '도트 유지율 개선: 갈퀴발톱과 찢어발기기 지속 관리',
        impact: 'high'
      });
    }

    // 콤보 포인트 관리
    if (prediction.resourceScore < 85) {
      analysis.improvements.push({
        area: 'combo_points',
        message: '콤보 포인트 낭비 감소: 5스택에서 마무리기 사용',
        impact: 'high'
      });
    }

    // 에너지 관리
    if (prediction.rotationScore < 80) {
      analysis.improvements.push({
        area: 'energy',
        message: '에너지 관리 개선: 호랑이의 분노 활용 증가',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      '!debuff.rake.up': !gameState.debuffs?.rake,
      'debuff.rake.remains <= 3': gameState.debuffs?.rake?.remaining <= 3,
      'combo_points >= 5': gameState.combo_points >= 5,
      'combo_points < 5': gameState.combo_points < 5,
      '!debuff.rip.up': !gameState.debuffs?.rip,
      'debuff.rip.remains <= 5': gameState.debuffs?.rip?.remaining <= 5,
      'debuff.rip.up': gameState.debuffs?.rip,
      'energy <= 35': gameState.energy <= 35,
      'energy >= 50': gameState.energy >= 50,
      '!debuff.moonfire.up': !gameState.debuffs?.moonfire,
      'targets >= 3': gameState.enemy_count >= 3,
      'targets >= 4': gameState.enemy_count >= 4,
      '!debuff.thrash.up': !gameState.debuffs?.thrash
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 초기화
  async initialize() {
    console.log('🐱 야성 드루이드 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 야성 드루이드 신규 모델 생성');
    }

    console.log('✅ 야성 드루이드 AI 준비 완료');
  }
}

export default FeralDruidAI;