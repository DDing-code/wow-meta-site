// 사제 수양 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';
import APLParser from '../../apl/APLParser.js';
import aplData from '../../apl/APLData.js';

class DisciplinePriestAI extends SpecializationAI {
  constructor() {
    super('priest', 'discipline');

    // 수양 사제 특성
    this.specializationTraits = {
      role: 'healer',
      resource: 'mana',
      primaryStat: 'intellect',
      armorType: 'cloth'
    };

    // APL 파서
    this.aplParser = new APLParser();
    this.aplData = null;

    // 수양 사제 핵심 메커니즘
    this.coreMechanics = {
      builder: [
        'power_word_shield', // 신의 권능: 보호막
        'shadow_word_pain', // 어둠의 권능: 고통
        'purge_the_wicked', // 사악함 제거
        'mind_blast', // 정신 폭발
        'penance' // 참회
      ],
      spender: [
        'penance', // 참회 (힐링)
        'shadow_mend', // 어둠 치유
        'power_word_radiance', // 신의 권능: 광휘
        'prayer_of_healing' // 치유의 기도
      ],
      cooldowns: [
        { name: 'rapture', cooldown: 90 }, // 황홀경
        { name: 'pain_suppression', cooldown: 180 }, // 고통 억제
        { name: 'power_word_barrier', cooldown: 180 }, // 신의 권능: 방벽
        { name: 'apotheosis', cooldown: 180 }, // 신격화
        { name: 'evangelism', cooldown: 90 } // 전도
      ],
      buffs: [
        'atonement', // 속죄
        'power_word_shield', // 신의 권능: 보호막
        'rapture', // 황홀경
        'borrowed_time', // 빌린 시간
        'power_of_the_dark_side', // 어둠의 힘
        'twist_of_fate' // 운명의 비틀림
      ],
      debuffs: [
        'shadow_word_pain', // 어둠의 권능: 고통
        'purge_the_wicked', // 사악함 제거
        'schism', // 분열
        'mind_blast' // 정신 폭발 (디버프)
      ],
      procs: [
        'power_of_the_dark_side', // 어둠의 힘
        'twist_of_fate', // 운명의 비틀림
        'borrowed_time' // 빌린 시간
      ]
    };

    // 수양 특성 트리 (11.2 메타)
    this.talentTree = {
      classTree: [
        '정화', '분산', '영혼의 통찰력', '정신 지배',
        '천사의 깃털', '질량 분산', '정신적 민첩성', '영적 치유'
      ],
      specTree: [
        '속죄', '참회', '황홀경', '고통 억제',
        '신의 권능: 방벽', '전도', '분열', '어둠의 힘',
        '신격화', '빌린 시간', '운명의 비틀림', '정신 폭발'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',
      2: 'haste', // 20% 목표
      3: 'critical', // 25% 목표
      4: 'mastery', // 방어막 효과
      5: 'versatility'
    };

    // 힐링 우선순위 (속죄 힐링 메커니즘)
    this.rotationPriority = [
      { skill: 'power_word_shield', condition: '!buff.atonement.up && target.health_pct <= 90' },
      { skill: 'shadow_word_pain', condition: '!debuff.swp.up' },
      { skill: 'purge_the_wicked', condition: '!debuff.ptw.up' },
      { skill: 'mind_blast', condition: 'cooldown.ready' },
      { skill: 'penance', condition: 'target.health_pct <= 70' },
      { skill: 'schism', condition: 'cooldown.ready' },
      { skill: 'shadow_mend', condition: 'target.health_pct <= 40' },
      { skill: 'power_word_radiance', condition: 'injured_allies >= 3' }
    ];

    // 수양 특화 가중치
    this.learningWeights = {
      dps: 0.35, // 속죄 힐링을 위한 DPS
      rotation: 0.30, // 속죄 관리
      resource: 0.20, // 마나 관리
      survival: 0.15 // 생존력
    };

    // 벤치마크
    this.benchmarks = {
      targetHPS: 5200000, // 5.2M HPS
      targetDPS: 2100000, // 2.1M DPS (속죄용)
      targetCPM: 50, // 높은 APM
      atonement_uptime: 90, // 속죄 유지율
      targetResourceEfficiency: 85
    };

    this.initialize();
  }

  // 수양 고유 특징
  getUniqueFeatures(combatLog) {
    return {
      // 속죄 유지율
      atonementUptime: combatLog.buffUptimes?.atonement || 0,

      // 속죄 힐링 비율
      atonementHealingRatio: this.calculateAtonementHealing(combatLog),

      // 정신 폭발 사용률
      mindBlastUsage: this.calculateMindBlastUsage(combatLog),

      // 참회 효율
      penanceEfficiency: this.calculatePenanceEfficiency(combatLog),

      // 황홀경 효율
      raptureEfficiency: this.calculateRaptureEfficiency(combatLog),

      // 어둠의 힘 발동률
      powerOfDarkSideProcs: combatLog.procs?.power_of_the_dark_side || 0,

      // 운명의 비틀림 발동률
      twistOfFateProcs: combatLog.procs?.twist_of_fate || 0,

      // 보호막 흡수량
      shieldAbsorption: combatLog.shieldAbsorption || 0,

      // DPS/HPS 비율 (속죄 효율)
      dpsHpsRatio: this.calculateDPSHPSRatio(combatLog),

      // 도트 유지율
      dotUptime: this.calculateDotUptime(combatLog)
    };
  }

  // 속죄 힐링 비율 계산
  calculateAtonementHealing(combatLog) {
    if (!combatLog.healing) return 0;

    const totalHealing = combatLog.healing.total || 0;
    const atonementHealing = combatLog.healing.atonement || 0;

    return totalHealing > 0 ? (atonementHealing / totalHealing) * 100 : 0;
  }

  // 정신 폭발 사용률 계산
  calculateMindBlastUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const mindBlasts = combatLog.skills.filter(s => s.name === 'mind_blast');
    const maxPossible = Math.floor(combatLog.duration / 7.5) + 1; // 7.5초 쿨다운

    return (mindBlasts.length / maxPossible) * 100;
  }

  // 참회 효율 계산
  calculatePenanceEfficiency(combatLog) {
    if (!combatLog.skills) return 100;

    const penances = combatLog.skills.filter(s => s.name === 'penance');
    let totalEfficiency = 0;

    penances.forEach(penance => {
      // 참회는 힐링용과 DPS용으로 사용 가능
      if (penance.target_type === 'ally' && penance.target_health_pct <= 80) {
        totalEfficiency += 100; // 좋은 사용
      } else if (penance.target_type === 'enemy') {
        totalEfficiency += 80; // 속죄용 DPS
      } else {
        totalEfficiency += 40; // 비효율적 사용
      }
    });

    return penances.length > 0 ? totalEfficiency / penances.length : 100;
  }

  // 황홀경 효율 계산
  calculateRaptureEfficiency(combatLog) {
    if (!combatLog.buffs?.rapture) return 0;

    const raptureUses = combatLog.buffs.rapture.uses || 0;
    const shieldsApplied = combatLog.buffs.rapture.shields_applied || 0;

    // 황홀경 동안 얼마나 많은 보호막을 적용했는지
    return raptureUses > 0 ? Math.min(100, (shieldsApplied / (raptureUses * 6)) * 100) : 0;
  }

  // DPS/HPS 비율 계산
  calculateDPSHPSRatio(combatLog) {
    const dps = combatLog.dps || 0;
    const hps = combatLog.hps || 0;

    if (hps === 0) return 0;
    return (dps / hps) * 100; // 이상적으로는 40-60%
  }

  // 도트 유지율 계산
  calculateDotUptime(combatLog) {
    const dots = ['shadow_word_pain', 'purge_the_wicked'];
    let totalUptime = 0;

    dots.forEach(dot => {
      const uptime = combatLog.debuffUptimes?.[dot] || 0;
      totalUptime += uptime;
    });

    return totalUptime / dots.length;
  }

  // 복잡도 계산
  getComplexityFactor() {
    return 1.6; // 수양은 매우 높은 복잡도 (속죄 메커니즘)
  }

  // 힐링 조언
  getRotationAdvice(currentState) {
    const advice = [];

    // 속죄 유지 체크
    const atonementCount = currentState.atonement_count || 0;
    if (atonementCount < 3) {
      advice.push('속죄 스택 부족: 보호막/광휘로 속죄 증가');
    }

    // 정신 폭발 쿨다운
    if (currentState.cooldowns?.mind_blast?.ready) {
      advice.push('정신 폭발 즉시 사용!');
    }

    // 도트 유지
    if (!currentState.debuffs?.shadow_word_pain) {
      advice.push('어둠의 권능: 고통 적용');
    }

    // 황홀경 사용
    if (currentState.cooldowns?.rapture?.ready && currentState.damaged_allies >= 4) {
      advice.push('황홀경: 다중 보호막 적용');
    }

    // 어둠의 힘 프록
    if (currentState.buffs?.power_of_the_dark_side) {
      advice.push('어둠의 힘: 강화된 참회/정신 폭발');
    }

    // 마나 관리
    if (currentState.mana_percent < 30) {
      advice.push('마나 절약: 속죄 힐링 위주');
    }

    // 응급 상황
    const criticalAllies = currentState.allies?.filter(a => a.health_pct < 30).length || 0;
    if (criticalAllies > 0) {
      advice.push(`응급: ${criticalAllies}명 위험! 어둠 치유`);
    }

    return advice.length > 0 ? advice.join(', ') : '현재 속죄 패턴 유지';
  }

  // 자원 관리 조언
  getResourceAdvice(currentState) {
    const advice = [];

    if (currentState.mana_percent < 25) {
      advice.push('위험: 마나 고갈 임박! 속죄 힐링만 사용');
    } else if (currentState.mana_percent < 50) {
      advice.push('마나 절약: 비효율적 직접 힐링 자제');
    } else if (currentState.mana_percent > 80) {
      advice.push('마나 여유: 적극적 DPS로 속죄 힐링');
    }

    return advice.length > 0 ? advice.join(', ') : '마나 관리 양호';
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
        '속죄 준비: 보호막 3-4개',
        '도트 적용',
        '정신 폭발 시작',
        '참회 준비'
      ];
    } else if (phase === 'high_damage') {
      strategy.priorities = [
        '황홀경 + 다중 보호막',
        '전도로 속죄 연장',
        '고통 억제/방벽 사용',
        '어둠 치유로 응급 처치'
      ];
    } else if (phase === 'spread') {
      strategy.priorities = [
        '신의 권능: 광휘로 속죄',
        '도트 유지',
        '정신 폭발 쿨마다',
        '원거리 참회'
      ];
    } else {
      strategy.priorities = [
        '속죄 3-5개 유지',
        '도트 100% 유지',
        '정신 폭발 우선',
        '마나 효율 관리'
      ];
    }

    // 보스별 특수 전략
    if (encounter === 'manaforge_omega') {
      strategy.warnings.push('고데미지 구간: 황홀경 + 전도 준비');
      strategy.upcoming.push('분산 페이즈: 광휘로 원거리 속죄');
    }

    return strategy;
  }

  // 성능 예측
  async predictPerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        hps: currentState.hps,
        dps: currentState.dps,
        atonement_count: currentState.atonement_count
      },
      predicted: {
        hps: prediction.predictedHPS || (prediction.predictedDPS * 2.5),
        dps: prediction.predictedDPS * 0.8, // 속죄용 DPS
        potential: (prediction.predictedHPS || (prediction.predictedDPS * 2.5)) - currentState.hps
      },
      improvements: []
    };

    // 속죄 관리
    if (currentState.atonement_count < 4) {
      analysis.improvements.push({
        area: 'atonement',
        message: '속죄 스택 부족: 보호막과 광휘 사용 증가',
        impact: 'high'
      });
    }

    // DPS 효율
    if (prediction.rotationScore < 80) {
      analysis.improvements.push({
        area: 'dps',
        message: '정신 폭발과 도트 유지율 개선 필요',
        impact: 'high'
      });
    }

    // 마나 관리
    if (prediction.resourceScore < 85) {
      analysis.improvements.push({
        area: 'mana',
        message: '마나 효율 개선: 속죄 힐링 비율 증가',
        impact: 'medium'
      });
    }

    return analysis;
  }

  // APL 조건 평가
  evaluateAPLCondition(condition, gameState) {
    if (condition === 'always') return true;

    const conditions = {
      '!buff.atonement.up': !gameState.buffs?.atonement,
      'target.health_pct <= 90': gameState.target_health_pct <= 90,
      'target.health_pct <= 70': gameState.target_health_pct <= 70,
      'target.health_pct <= 40': gameState.target_health_pct <= 40,
      '!debuff.swp.up': !gameState.debuffs?.shadow_word_pain,
      '!debuff.ptw.up': !gameState.debuffs?.purge_the_wicked,
      'cooldown.ready': true,
      'injured_allies >= 3': gameState.injured_allies >= 3
    };

    return conditions[condition] !== undefined ? conditions[condition] : false;
  }

  // 초기화
  async initialize() {
    console.log('🌟 수양 사제 AI 초기화 중...');

    await this.loadAPL();
    const loaded = await this.loadModel();

    if (!loaded) {
      this.createSpecializedModel();
      console.log('🆕 수양 사제 신규 모델 생성');
    }

    console.log('✅ 수양 사제 AI 준비 완료');
  }
}

export default DisciplinePriestAI;