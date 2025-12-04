// 주술사 고양 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class EnhancementShamanAI extends SpecializationAI {
  constructor() {
    super('shaman', 'enhancement');

    // 고양 주술사 특성
    this.specializationTraits = {
      role: 'dps',
      resource: 'maelstrom',
      primaryStat: 'agility',
      armorType: 'mail'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 고양 주술사 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'windfury_totem', // 바람분노 토템
        'flametongue_weapon', // 화염방어막 무기
        'rockbiter_weapon', // 돌격파 무기
        'crash_lightning', // 폭풍 번개
        'stormstrike', // 폭풍강타
        'lashing_lava' // 용암 채찍
      ],
      spender: [
        'elemental_blast', // 정령 작렬
        'lava_lash', // 용암 채찍
        'ice_strike', // 얼음 강타
        'sundering', // 균열
        'elemental_spirits' // 정령 혼
      ],
      cooldowns: [
        { name: 'feral_spirit', cooldown: 120 }, // 야생 정령
        { name: 'doom_hammer', cooldown: 60 }, // 파멸망치
        { name: 'windfury_totem', cooldown: 120 }, // 바람분노 토템
        { name: 'elemental_blast', cooldown: 12 }, // 정령 작렬
        { name: 'ascendance', cooldown: 180 } // 승천
      ],
      buffs: [
        'windfury_weapon', // 바람분노 무기
        'flametongue_weapon', // 화염방어막 무기
        'maelstrom_weapon', // 소용돌이 무기
        'crash_lightning', // 폭풍 번개
        'hailstorm', // 우박폭풍
        'hot_hand' // 뜨거운 손
      ],
      debuffs: [
        'flame_shock', // 화염 충격
        'lashing_flames', // 채찍 화염
        'sundering' // 균열
      ],
      procs: [
        'windfury', // 바람분노
        'flametongue', // 화염방어막
        'maelstrom_weapon', // 소용돌이 무기
        'hot_hand', // 뜨거운 손
        'elemental_spirits' // 정령 혼
      ]
    };

    // 고양 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '바람분노 토템', '화염 충격', '정령 작렬', '승천',
        '야생 정령', '정령 혼', '조상의 지도', '대지 정령'
      ],
      specTree: [
        '소용돌이 무기', '폭풍강타', '용암 채찍', '폭풍 번개',
        '파멸망치', '균열', '뜨거운 손', '우박폭풍',
        '얼음 강타', '용암 채찍', '돌아오는 동풍', '원소의 조화'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'agility',
      2: 'haste', // 20% 목표
      3: 'mastery', // 정령 무기 효과
      4: 'critical', // 15% 목표
      5: 'versatility'
    };

    // 로테이션 우선순위
    this.rotationPriority = [
      { skill: 'windfury_totem', condition: '!totem.windfury.up' },
      { skill: 'flame_shock', condition: '!debuff.flame_shock.up' },
      { skill: 'elemental_blast', condition: 'maelstrom_weapon >= 5' },
      { skill: 'stormstrike', condition: 'cooldown.ready' },
      { skill: 'lava_lash', condition: 'buff.hot_hand.up || maelstrom_weapon >= 5' },
      { skill: 'ice_strike', condition: 'cooldown.ready' },
      { skill: 'sundering', condition: 'cooldown.ready && targets >= 2' },
      { skill: 'crash_lightning', condition: 'targets >= 3 || !buff.crash_lightning.up' }
    ];

    // 고양 특화 가중치
    this.learningWeights = {
      dps: 0.45, // DPS가 주요 지표
      rotation: 0.30, // 소용돌이 무기 관리
      resource: 0.15, // 마엘스트롬 관리
      survival: 0.10 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 6600000, // 6.6M DPS
      targetCPM: 45, // 높은 APM
      maelstrom_efficiency: 90, // 소용돌이 무기 효율
      targetResourceEfficiency: 85
    };

    this.initialize();
  }

  // 고양 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 소용돌이 무기 스택 효율
      maelstromWeaponEfficiency: this.calculateMaelstromEfficiency(combatLog),

      // 바람분노 발동률
      windfuryProcRate: combatLog.procs?.windfury || 0,

      // 화염방어막 발동률
      flametongueProcRate: combatLog.procs?.flametongue || 0,

      // 폭풍강타 사용률
      stormstrikeUsage: this.calculateStormstrikeUsage(combatLog),

      // 뜨거운 손 발동률
      hotHandProcs: combatLog.procs?.hot_hand || 0,

      // 토템 유지율
      totemUptime: this.calculateTotemUptime(combatLog),

      // 화염 충격 유지율
      flameShockUptime: combatLog.debuffUptimes?.flame_shock || 0,

      // 정령 작렬 효율
      elementalBlastEfficiency: this.calculateElementalBlastEfficiency(combatLog),

      // 폭풍 번개 유지율
      crashLightningUptime: combatLog.buffUptimes?.crash_lightning || 0,

      // 야생 정령 효율
      feralSpiritEfficiency: this.calculateFeralSpiritEfficiency(combatLog)
    };
  }

  // 소용돌이 무기 효율 계산
  calculateMaelstromEfficiency(combatLog) {
    if (!combatLog.maelstromWeapon) return 0;

    const totalStacks = combatLog.maelstromWeapon.totalStacks || 0;
    const wastedStacks = combatLog.maelstromWeapon.wastedStacks || 0;

    return totalStacks > 0 ? Math.max(0, 100 - (wastedStacks / totalStacks * 100)) : 0;
  }

  // 폭풍강타 사용률 계산
  calculateStormstrikeUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const stormstrikes = combatLog.skills.filter(s => s.name === 'stormstrike');
    const maxPossible = Math.floor(combatLog.duration / 9) + 1; // 9초 쿨다운

    return (stormstrikes.length / maxPossible) * 100;
  }

  // 토템 유지율 계산
  calculateTotemUptime(combatLog) {
    if (!combatLog.totems) return 0;

    const importantTotems = ['windfury_totem'];
    let totalUptime = 0;

    importantTotems.forEach(totem => {
      totalUptime += combatLog.totems[totem]?.uptime || 0;
    });

    return totalUptime / importantTotems.length;
  }

  // 정령 작렬 효율 계산
  calculateElementalBlastEfficiency(combatLog) {
    if (!combatLog.skills) return 100;

    const blasts = combatLog.skills.filter(s => s.name === 'elemental_blast');
    let totalEfficiency = 0;

    blasts.forEach(blast => {
      const maelstromStacks = blast.maelstrom_stacks || 0;
      // 5스택에서 사용하는 것이 이상적
      totalEfficiency += Math.min(100, (maelstromStacks / 5) * 100);
    });

    return blasts.length > 0 ? totalEfficiency / blasts.length : 100;
  }

  // 야생 정령 효율 계산
  calculateFeralSpiritEfficiency(combatLog) {
    if (!combatLog.summons?.feral_spirit) return 0;

    const spiritUses = combatLog.summons.feral_spirit.uses || 0;
    const spiritDamage = combatLog.summons.feral_spirit.damage || 0;
    const totalDamage = combatLog.damage || 0;

    if (spiritUses === 0 || totalDamage === 0) return 0;

    // 야생 정령이 총 데미지에서 차지하는 비율
    return Math.min(100, (spiritDamage / totalDamage) * 100 * 5); // 5배로 스케일링
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.4; // 고양은 높은 복잡도 (소용돌이 무기 관리)
  }

  // 로테이션 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 소용돌이 무기 체크
    const maelstromStacks = currentState.maelstrom_weapon_stacks || 0;
    if (maelstromStacks >= 5) {
      advice.push('소용돌이 무기 5스택: 정령 작렬 즉시!');
    }

    // 폭풍강타 쿨다운
    if (currentState.cooldowns?.stormstrike?.ready) {
      advice.push('폭풍강타 사용');
    }

    // 뜨거운 손 프록
    if (currentState.buffs?.hot_hand) {
      advice.push('뜨거운 손: 용암 채찍 강화');
    }

    // 화염 충격 유지
    if (!currentState.debuffs?.flame_shock) {
      advice.push('화염 충격 적용 필요');
    }

    // 바람분노 토템
    if (!currentState.totems?.windfury_totem) {
      advice.push('바람분노 토템 설치');
    }

    // 폭풍 번개 버프
    if (!currentState.buffs?.crash_lightning && currentState.enemy_count >= 1) {
      advice.push('폭풍 번개로 버프 적용');
    }

    // 다중 적
    if (currentState.enemy_count >= 3) {
      advice.push('균열/폭풍 번개 우선');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    const maelstromStacks = currentState.maelstrom_weapon_stacks || 0;

    if (maelstromStacks >= 10) {
      advice.push('위험: 소용돌이 무기 낭비! 즉시 소모');
    } else if (maelstromStacks >= 5) {
      advice.push('소용돌이 무기 사용 고려');
    } else if (maelstromStacks < 3) {
      advice.push('소용돌이 무기 생성: 근접 공격');
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
        '바람분노 토템 설치',
        '화염 충격 적용',
        '야생 정령 소환',
        '폭풍강타 시작'
      ];
    } else if (phase === 'execute') {
      strategy.priorities = [
        '소용돌이 무기 즉시 소모',
        '파멸망치 사용',
        '모든 쿨다운 정렬',
        '용암 채찍 우선'
      ];
    } else if (phase === 'add_phase') {
      strategy.priorities = [
        '균열로 광역 데미지',
        '폭풍 번개 유지',
        '화염 충격 다중 적용',
        '정령 작렬 5스택'
      ];
    } else {
      strategy.priorities = [
        '소용돌이 무기 5스택 관리',
        '폭풍강타 쿨마다',
        '화염 충격 유지',
        '토템 지속 관리'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('이동 페이즈: 번개 볼트 준비');
      strategy.upcoming.push('쫄 페이즈: 균열 + 폭풍 번개');
    }

    return strategy;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        dps: currentState.dps,
        maelstrom_stacks: currentState.maelstrom_weapon_stacks
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 소용돌이 무기 관리
    if (currentState.maelstrom_weapon_stacks >= 8) {
      analysis.improvements.push({
        area: 'maelstrom',
        message: '소용돌이 무기 과적재: 즉시 소모 필요',
        impact: 'high'
      });
    }

    // 로테이션 효율
    if (prediction.rotationScore < 85) {
      analysis.improvements.push({
        area: 'rotation',
        message: '폭풍강타와 정령 작렬 사용률 증가 필요',
        impact: 'high'
      });
    }

    // 프록 활용
    if (prediction.resourceScore < 80) {
      analysis.improvements.push({
        area: 'procs',
        message: '바람분노/화염방어막 발동률 개선',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      '!totem.windfury.up': !gameState.totems?.windfury_totem,
      '!debuff.flame_shock.up': !gameState.debuffs?.flame_shock,
      'maelstrom_weapon >= 5': gameState.maelstrom_weapon_stacks >= 5,
      'cooldown.ready': true,
      'buff.hot_hand.up': gameState.buffs?.hot_hand,
      'targets >= 2': gameState.enemy_count >= 2,
      'targets >= 3': gameState.enemy_count >= 3,
      '!buff.crash_lightning.up': !gameState.buffs?.crash_lightning
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 초기화
  async initialize() {
    console.log('⚡ 고양 주술사 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 고양 주술사 신규 모델 생성');
    }

    console.log('✅ 고양 주술사 AI 준비 완료');
  }
}

export default EnhancementShamanAI;