// 성기사 보호 전문 AI
import SpecializationAI from '../../core/SpecializationAI';
import APLParser from '../../apl/APLParser';
import aplData from '../../apl/APLData';

class ProtectionPaladinAI extends SpecializationAI {
  constructor() {
    super('paladin', 'protection');

    // 보호 성기사 특성
    this.specializationTraits = {
      role: 'tank',
      resource: 'mana',
      primaryStat: 'strength',
      armorType: 'plate'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 보호 성기사 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'judgement', // 심판
        'blessed_hammer', // 축복받은 망치
        'hammer_of_the_righteous', // 정의의 망치
        'avengers_shield', // 복수자의 방패
        'consecration' // 신성화
      ],
      spender: [
        'shield_of_the_righteous', // 정의로운 자의 방패
        'word_of_glory', // 영광의 언어
        'light_of_the_protector' // 수호자의 빛
      ],
      cooldowns: [
        { name: 'avenging_wrath', cooldown: 120 }, // 응보의 격노
        { name: 'guardian_of_ancient_kings', cooldown: 300 }, // 고대 왕들의 수호자
        { name: 'ardent_defender', cooldown: 120 }, // 열렬한 수호자
        { name: 'divine_shield', cooldown: 300 }, // 천상의 보호막
        { name: 'lay_on_hands', cooldown: 600 } // 치유의 손길
      ],
      buffs: [
        'shield_of_the_righteous', // 정의로운 자의 방패
        'avenging_wrath', // 응보의 격노
        'guardian_of_ancient_kings', // 고대 왕들의 수호자
        'ardent_defender', // 열렬한 수호자
        'consecration', // 신성화
        'grand_crusader' // 위대한 성전사
      ],
      debuffs: [
        'judgement', // 심판
        'consecration', // 신성화
        'blessed_hammer' // 축복받은 망치
      ],
      procs: [
        'grand_crusader', // 위대한 성전사
        'divine_purpose' // 신성한 목적
      ]
    };

    // 보호 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '축복받은 망치', '신의 은총', '천상의 보호막', '정화된 독소',
        '희생의 오라', '보호의 오라', '신성한 목적', '응보'
      ],
      specTree: [
        '정의로운 자의 방패', '복수자의 방패', '응보의 격노', '고대 왕들의 수호자',
        '열렬한 수호자', '위대한 성전사', '축복받은 망치', '수호자의 빛',
        '신성화', '심판의 빛', '방어의 순간', '불굴의 의지'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'strength',
      2: 'haste', // 25% 목표
      3: 'mastery', // 방어막 효과
      4: 'versatility', // 데미지 감소
      5: 'critical'
    };

    // 탱킹 우선순위
    this.rotationPriority = [
      { skill: 'shield_of_the_righteous', condition: 'holy_power >= 3 && !buff.sotr.up' },
      { skill: 'avengers_shield', condition: 'cooldown.ready' },
      { skill: 'judgement', condition: 'cooldown.ready' },
      { skill: 'blessed_hammer', condition: 'charges >= 1' },
      { skill: 'hammer_of_the_righteous', condition: 'enemy_count >= 1' },
      { skill: 'consecration', condition: '!buff.consecration.up' },
      { skill: 'word_of_glory', condition: 'holy_power >= 3 && health_pct <= 60' },
      { skill: 'light_of_the_protector', condition: 'health_pct <= 70' }
    ];

    // 보호 특화 가중치
    this.learningWeights = {
      dps: 0.20, // 어그로 관리
      rotation: 0.25, // 방어막 유지
      resource: 0.25, // 신성한 힘 관리
      survival: 0.30 // 생존력이 최우선
    };

    // 벤치마크
    this.benchmarks = {
      targetDPS: 3200000, // 3.2M DPS (탱커)
      targetCPM: 50, // 높은 APM
      sotr_uptime: 50, // 정의로운 자의 방패 유지율
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  // 보호 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 정의로운 자의 방패 유지율
      sotrUptime: combatLog.buffUptimes?.shield_of_the_righteous || 0,

      // 복수자의 방패 사용률
      avengersShieldUsage: this.calculateAvengersShieldUsage(combatLog),

      // 위대한 성전사 발동률
      grandCrusaderProcs: combatLog.procs?.grand_crusader || 0,

      // 방어 쿨다운 사용률
      defensiveCooldownUsage: this.calculateDefensiveCooldownUsage(combatLog),

      // 신성한 힘 활용률
      holyPowerUsage: this.calculateHolyPowerUsage(combatLog),

      // 어그로 관리 효율
      threatManagement: this.calculateThreatManagement(combatLog),

      // 데미지 감소율
      damageReduction: combatLog.damageReduction || 0,

      // 힐링 효율 (자가 치유)
      selfHealingEfficiency: this.calculateSelfHealingEfficiency(combatLog),

      // 신성화 유지율
      consecrationUptime: combatLog.buffUptimes?.consecration || 0,

      // 방어막 흡수량
      shieldAbsorption: combatLog.shieldAbsorption || 0
    };
  }

  // 복수자의 방패 사용률 계산
  calculateAvengersShieldUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const shields = combatLog.skills.filter(s => s.name === 'avengers_shield');
    const maxPossible = Math.floor(combatLog.duration / 15) + 1; // 15초 쿨다운

    return (shields.length / maxPossible) * 100;
  }

  // 방어 쿨다운 사용률 계산
  calculateDefensiveCooldownUsage(combatLog) {
    if (!this.coreMechanics.cooldowns.length) return 100;

    let totalEfficiency = 0;
    const defensiveCDs = ['guardian_of_ancient_kings', 'ardent_defender', 'divine_shield'];

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

  // 신성한 힘 활용률 계산
  calculateHolyPowerUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const spenders = ['shield_of_the_righteous', 'word_of_glory'];
    const spenderUses = combatLog.skills.filter(s => spenders.includes(s.name)).length;
    const totalHolyPowerGenerated = this.estimateHolyPowerGeneration(combatLog);

    return totalHolyPowerGenerated > 0
      ? Math.min(100, (spenderUses * 3 / totalHolyPowerGenerated) * 100)
      : 0;
  }

  // 신성한 힘 생성 예측
  estimateHolyPowerGeneration(combatLog) {
    if (!combatLog.skills) return 0;

    const judgments = combatLog.skills.filter(s => s.name === 'judgement').length;
    const hammers = combatLog.skills.filter(s => s.name === 'blessed_hammer').length;
    const righteous = combatLog.skills.filter(s => s.name === 'hammer_of_the_righteous').length;

    return judgments + hammers + righteous;
  }

  // 어그로 관리 효율 계산
  calculateThreatManagement(combatLog) {
    if (!combatLog.threat) return 100;

    const threatLoss = combatLog.threat.losses || 0;
    const totalFights = combatLog.threat.total || 1;

    return Math.max(0, 100 - (threatLoss / totalFights * 100));
  }

  // 자가 치유 효율 계산
  calculateSelfHealingEfficiency(combatLog) {
    if (!combatLog.selfHealing) return 0;

    const healingSpells = ['word_of_glory', 'light_of_the_protector', 'lay_on_hands'];
    const totalSelfHealing = combatLog.selfHealing.filter(h =>
      healingSpells.includes(h.spell)
    ).reduce((sum, heal) => sum + heal.amount, 0);

    const maxPossibleHealing = combatLog.maxHealth * 5; // 기준값

    return Math.min(100, (totalSelfHealing / maxPossibleHealing) * 100);
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.2; // 보호는 중간 복잡도 (방어막 관리 + 어그로)
  }

  // 탱킹 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 정의로운 자의 방패 체크
    if (currentState.holy_power >= 3 && !currentState.buffs?.shield_of_the_righteous) {
      advice.push('정의로운 자의 방패 즉시 사용!');
    }

    // 복수자의 방패 쿨다운
    if (currentState.cooldowns?.avengers_shield?.ready) {
      advice.push('복수자의 방패 사용');
    }

    // 위험한 체력
    if (currentState.health_percent < 40) {
      advice.push('위험! 방어 쿨다운 사용 고려');
      if (currentState.holy_power >= 3) {
        advice.push('영광의 언어로 자가 치유');
      }
    }

    // 신성화 유지
    if (!currentState.buffs?.consecration) {
      advice.push('신성화 설치 필요');
    }

    // 위대한 성전사 프록
    if (currentState.buffs?.grand_crusader) {
      advice.push('위대한 성전사: 무료 복수자의 방패');
    }

    // 다중 적
    if (currentState.enemy_count >= 3) {
      advice.push('축복받은 망치로 광역 어그로');
    }

    // 어그로 관리
    if (currentState.threat_percent < 110) {
      advice.push('어그로 부족: 도발 또는 공격적 스킬');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 탱킹 패턴 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.holy_power < 2) {
      advice.push('신성한 힘 생성: 심판/축복받은 망치 사용');
    } else if (currentState.holy_power >= 5) {
      advice.push('신성한 힘 초과: 방어막 또는 힐링');
    }

    if (currentState.mana_percent < 30) {
      advice.push('마나 부족: 심판으로 마나 회복');
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
        '복수자의 방패로 시작',
        '신성화 설치',
        '정의로운 자의 방패 준비',
        '어그로 확보'
      ];
    } else if (phase === 'high_damage') {
      strategy.priorities = [
        '생존이 최우선',
        '방어 쿨다운 순환 사용',
        '정의로운 자의 방패 유지',
        '영광의 언어 적극 사용'
      ];
    } else if (phase === 'add_phase') {
      strategy.priorities = [
        '축복받은 망치 광역 어그로',
        '신성화 유지',
        '복수자의 방패 쿨마다',
        '정의의 망치 연계'
      ];
    } else {
      strategy.priorities = [
        '정의로운 자의 방패 50% 유지',
        '복수자의 방패 쿨마다',
        '신성한 힘 3+ 유지',
        '어그로 안정화'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('고데미지 페이즈: 고대 왕들의 수호자 준비');
      strategy.upcoming.push('이동 페이즈: 복수자의 방패로 원거리 어그로');
    }

    return strategy;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        dps: currentState.dps,
        threat_percent: currentState.threat_percent,
        sotr_uptime: currentState.sotr_uptime
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      improvements: []
    };

    // 방어막 관리
    if (currentState.sotr_uptime < 40) {
      analysis.improvements.push({
        area: 'mitigation',
        message: '정의로운 자의 방패 유지율 개선 필요',
        impact: 'high'
      });
    }

    // 어그로 관리
    if (prediction.rotationScore < 85) {
      analysis.improvements.push({
        area: 'threat',
        message: '복수자의 방패와 심판 사용률 증가 필요',
        impact: 'high'
      });
    }

    // 생존력
    if (prediction.survivalScore < 90) {
      analysis.improvements.push({
        area: 'survival',
        message: '방어 쿨다운 사용 및 자가 치유 개선',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      'holy_power >= 3': gameState.holy_power >= 3,
      '!buff.sotr.up': !gameState.buffs?.shield_of_the_righteous,
      'cooldown.ready': true,
      'charges >= 1': true,
      'enemy_count >= 1': gameState.enemy_count >= 1,
      '!buff.consecration.up': !gameState.buffs?.consecration,
      'health_pct <= 60': gameState.health_percent <= 60,
      'health_pct <= 70': gameState.health_percent <= 70
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 초기화
  async initialize() {
    console.log('🛡️ 보호 성기사 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 보호 성기사 신규 모델 생성');
    }

    console.log('✅ 보호 성기사 AI 준비 완료');
  }
}

export default ProtectionPaladinAI;