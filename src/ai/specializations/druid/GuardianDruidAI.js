// 드루이드 수호 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class GuardianDruidAI extends SpecializationAI {
  constructor() {
    super('druid', 'guardian');

    // 수호 드루이드 특성
    this.specializationTraits = {
      role: 'tank',
      resource: 'rage',
      primaryStat: 'agility',
      armorType: 'leather'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 수호 드루이드 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'mangle', // 짓이기기
        'thrash', // 난타
        'swipe', // 할퀴기
        'moonfire', // 달빛섬광
        'growl' // 으르렁거리기
      ],
      spender: [
        'maul', // 후려치기
        'ironfur', // 강철가죽
        'frenzied_regeneration', // 광란 재생
        'rage_of_the_sleeper' // 잠자는 자의 분노
      ],
      cooldowns: [
        { name: 'berserk', cooldown: 180 }, // 광폭화
        { name: 'incarnation', cooldown: 180 }, // 화신: 아크몬드의 수호자
        { name: 'barkskin', cooldown: 60 }, // 나무껍질
        { name: 'survival_instincts', cooldown: 240 }, // 생존 본능
        { name: 'convoke_the_spirits', cooldown: 120 } // 정령 소환
      ],
      buffs: [
        'bear_form', // 곰 변신
        'ironfur', // 강철가죽
        'barkskin', // 나무껍질
        'survival_instincts', // 생존 본능
        'gore', // 찌르기
        'galactic_guardian' // 은하계 수호자
      ],
      debuffs: [
        'thrash', // 난타
        'moonfire', // 달빛섬광
        'mangle' // 짓이기기
      ],
      procs: [
        'gore', // 찌르기
        'galactic_guardian', // 은하계 수호자
        'tooth_and_claw' // 이빨과 발톱
      ]
    };

    // 수호 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '달빛섬광', '정령 소환', '야생 충전', '자연의 신속성',
        '나무껍질', '생존 본능', '곰 변신', '자연의 치유'
      ],
      specTree: [
        '짓이기기', '난타', '강철가죽', '광폭화',
        '찌르기', '은하계 수호자', '후려치기', '이빨과 발톱',
        '화신: 아크몬드의 수호자', '잠자는 자의 분노', '루나 빔', '원시 분노'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'agility',
      2: 'versatility', // 데미지 감소
      3: 'mastery', // 공격력과 생명력
      4: 'haste', // 분노 생성
      5: 'critical'
    };

    // 탱킹 우선순위
    this.rotationPriority = [
      { skill: 'ironfur', condition: 'rage >= 40 && buff.ironfur.stacks < 2' },
      { skill: 'thrash', condition: '!debuff.thrash.up || debuff.thrash.remains <= 3' },
      { skill: 'mangle', condition: 'cooldown.ready' },
      { skill: 'moonfire', condition: '!debuff.moonfire.up' },
      { skill: 'maul', condition: 'rage >= 60 && buff.ironfur.up' },
      { skill: 'swipe', condition: 'targets >= 1' },
      { skill: 'growl', condition: 'threat < 110' }
    ];

    // 수호 특화 가중치
    this.learningWeights = {
      dps: 0.20, // 어그로 관리
      rotation: 0.25, // 강철가죽 관리
      resource: 0.25, // 분노 관리
      survival: 0.30 // 생존력이 최우선
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 3400000, // 3.4M DPS (탱커)
      targetCPM: 45, // 중간 APM
      ironfur_uptime: 80, // 강철가죽 유지율
      targetResourceEfficiency: 85
    };

    this.initialize();
  }

  // 수호 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 강철가죽 유지율
      ironfurUptime: combatLog.buffUptimes?.ironfur || 0,

      // 짓이기기 사용률
      mangleUsage: this.calculateMangleUsage(combatLog),

      // 난타 유지율
      thrashUptime: combatLog.debuffUptimes?.thrash || 0,

      // 찌르기 발동률
      goreProcs: combatLog.procs?.gore || 0,

      // 분노 관리 효율
      rageManagement: this.calculateRageManagement(combatLog),

      // 방어 쿨다운 사용률
      defensiveCooldownUsage: this.calculateDefensiveCooldownUsage(combatLog),

      // 은하계 수호자 발동률
      galacticGuardianProcs: combatLog.procs?.galactic_guardian || 0,

      // 후려치기 효율
      maulEfficiency: this.calculateMaulEfficiency(combatLog),

      // 어그로 관리
      threatManagement: this.calculateThreatManagement(combatLog),

      // 생존력 지표
      survivalMetrics: this.calculateSurvivalMetrics(combatLog)
    };
  }

  // 짓이기기 사용률 계산
  calculateMangleUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const mangles = combatLog.skills.filter(s => s.name === 'mangle');
    const maxPossible = Math.floor(combatLog.duration / 6) + 1; // 6초 쿨다운

    return (mangles.length / maxPossible) * 100;
  }

  // 분노 관리 효율 계산
  calculateRageManagement(combatLog) {
    if (!combatLog.rage) return 100;

    const cappedTime = combatLog.rage.cappedTime || 0;
    const totalTime = combatLog.duration || 1;

    // 분노 캡핑 시간이 10% 이하가 이상적
    return Math.max(0, 100 - (cappedTime / totalTime * 100 * 10));
  }

  // 방어 쿨다운 사용률 계산
  calculateDefensiveCooldownUsage(combatLog) {
    if (!this.coreMechanics.cooldowns.length) return 100;

    let totalEfficiency = 0;
    const defensiveCDs = ['barkskin', 'survival_instincts', 'frenzied_regeneration'];

    defensiveCDs.forEach(cd => {
      const uses = combatLog.cooldownUses?.[cd] || 0;
      const cdInfo = this.coreMechanics.cooldowns.find(c => c.name === cd);
      if (cdInfo) {
        const maxUses = Math.floor(combatLog.duration / cdInfo.cooldown) + 1;
        totalEfficiency += (uses / maxUses) * 100;
      }
    });

    return totalEfficiency / defensiveCDs.length;
  }

  // 후려치기 효율 계산
  calculateMaulEfficiency(combatLog) {
    if (!combatLog.skills) return 100;

    const mauls = combatLog.skills.filter(s => s.name === 'maul');
    let totalEfficiency = 0;

    mauls.forEach(maul => {
      const rage = maul.rage || 0;
      const ironfurUp = maul.ironfur_stacks >= 1;

      // 강철가죽이 있을 때 사용하는 것이 이상적
      if (ironfurUp && rage >= 60) {
        totalEfficiency += 100;
      } else if (rage >= 60) {
        totalEfficiency += 60;
      } else {
        totalEfficiency += 20;
      }
    });

    return mauls.length > 0 ? totalEfficiency / mauls.length : 100;
  }

  // 어그로 관리 계산
  calculateThreatManagement(combatLog) {
    if (!combatLog.threat) return 100;

    const threatLoss = combatLog.threat.losses || 0;
    const totalFights = combatLog.threat.total || 1;

    return Math.max(0, 100 - (threatLoss / totalFights * 100));
  }

  // 생존력 지표 계산
  calculateSurvivalMetrics(combatLog) {
    if (!combatLog.damage) return 100;

    const damageTaken = combatLog.damage.taken || 0;
    const damageReduced = combatLog.damage.reduced || 0;
    const totalDamage = damageTaken + damageReduced;

    return totalDamage > 0 ? (damageReduced / totalDamage) * 100 : 0;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.1; // 수호는 낮은 복잡도 (단순한 탱킹)
  }

  // 탱킹 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 강철가죽 체크
    const ironfurStacks = currentState.buffs?.ironfur?.stacks || 0;
    const rage = currentState.rage || 0;

    if (ironfurStacks < 2 && rage >= 40) {
      advice.push('강철가죽 스택 증가 필요!');
    }

    // 짓이기기 쿨다운
    if (currentState.cooldowns?.mangle?.ready) {
      advice.push('짓이기기 사용');
    }

    // 난타 유지
    if (!currentState.debuffs?.thrash || currentState.debuffs.thrash.remaining <= 3) {
      advice.push('난타 갱신 필요');
    }

    // 찌르기 프록
    if (currentState.buffs?.gore) {
      advice.push('찌르기: 무료 짓이기기');
    }

    // 은하계 수호자
    if (currentState.buffs?.galactic_guardian) {
      advice.push('은하계 수호자: 강화된 달빛섬광');
    }

    // 위험한 체력
    if (currentState.health_percent < 40) {
      advice.push('위험! 방어 쿨다운 사용');
    }

    // 분노 관리
    if (rage >= 80) {
      advice.push('분노 과다: 후려치기 또는 강철가죽');
    }

    // 어그로 관리
    if (currentState.threat_percent < 110) {
      advice.push('어그로 부족: 으르렁거리기');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 탱킹 패턴 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    const rage = currentState.rage || 0;

    if (rage >= 100) {
      advice.push('분노 과다: 즉시 소모 필요');
    } else if (rage >= 60) {
      advice.push('분노 충분: 후려치기 고려');
    } else if (rage < 40) {
      advice.push('분노 부족: 공격으로 분노 생성');
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
    if (phase === 'pull') {
      strategy.immediate = [
        '곰 변신 확인',
        '으르렁거리기로 어그로',
        '난타 적용',
        '강철가죽 2스택'
      ];
    } else if (phase === 'high_damage') {
      strategy.priorities = [
        '생존 본능 사용',
        '나무껍질 활성화',
        '강철가죽 유지',
        '광란 재생 준비'
      ];
    } else if (phase === 'add_phase') {
      strategy.priorities = [
        '난타로 광역 어그로',
        '할퀴기 연타',
        '달빛섬광 다중 적용',
        '강철가죽 유지'
      ];
    } else {
      strategy.priorities = [
        '강철가죽 80% 유지',
        '짓이기기 쿨마다',
        '난타 지속 유지',
        '분노 효율 관리'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('고데미지 페이즈: 생존 본능 + 나무껍질 준비');
      strategy.upcoming.push('이동 페이즈: 달빛섬광으로 원거리 어그로');
    }

    return strategy;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        dps: currentState.dps,
        ironfur_stacks: currentState.buffs?.ironfur?.stacks || 0,
        rage: currentState.rage
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 강철가죽 관리
    if (currentState.buffs?.ironfur?.stacks < 2) {
      analysis.improvements.push({
        area: 'mitigation',
        message: '강철가죽 스택 부족: 2스택 유지 필요',
        impact: 'high'
      });
    }

    // 어그로 관리
    if (prediction.rotationScore < 85) {
      analysis.improvements.push({
        area: 'threat',
        message: '짓이기기와 난타 사용률 증가 필요',
        impact: 'high'
      });
    }

    // 분노 관리
    if (prediction.resourceScore < 80) {
      analysis.improvements.push({
        area: 'rage',
        message: '분노 관리 개선: 캡핑 방지와 효율적 사용',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      'rage >= 40': gameState.rage >= 40,
      'rage >= 60': gameState.rage >= 60,
      'buff.ironfur.stacks < 2': (gameState.buffs?.ironfur?.stacks || 0) < 2,
      'buff.ironfur.up': gameState.buffs?.ironfur,
      '!debuff.thrash.up': !gameState.debuffs?.thrash,
      'debuff.thrash.remains <= 3': gameState.debuffs?.thrash?.remaining <= 3,
      'cooldown.ready': true,
      '!debuff.moonfire.up': !gameState.debuffs?.moonfire,
      'targets >= 1': gameState.enemy_count >= 1,
      'threat < 110': gameState.threat_percent < 110
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 초기화
  async initialize() {
    console.log('🐻 수호 드루이드 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 수호 드루이드 신규 모델 생성');
    }

    console.log('✅ 수호 드루이드 AI 준비 완료');
  }
}

export default GuardianDruidAI;