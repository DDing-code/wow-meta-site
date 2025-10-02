// 수도사 바람길잡이 전문 AI
import SpecializationAI from '../../core/SpecializationAI';

class WindwalkerMonkAI extends SpecializationAI {
  constructor() {
    super('monk', 'windwalker');

    this.specializationTraits = {
      role: 'dps',
      resource: 'energy',
      primaryStat: 'agility',
      armorType: 'leather'
    };

    this.coreMechanics = {
      builder: ['tiger_palm', 'expel_harm', 'chi_burst', 'energizing_elixir'],
      spender: ['rising_sun_kick', 'blackout_kick', 'fists_of_fury', 'whirling_dragon_punch'],
      cooldowns: [
        { name: 'storm_earth_and_fire', cooldown: 90 },
        { name: 'invoke_xuen', cooldown: 120 },
        { name: 'touch_of_death', cooldown: 180 },
        { name: 'weapons_of_order', cooldown: 120 }
      ],
      buffs: ['combat_wisdom', 'teachings_of_monastery', 'storm_earth_fire', 'dance_of_chiji'],
      debuffs: ['rising_sun_kick', 'touch_of_death'],
      procs: ['combat_wisdom', 'teachings_of_monastery', 'dance_of_chiji']
    };

    this.statPriority = {
      1: 'agility',
      2: 'critical',
      3: 'versatility',
      4: 'mastery',
      5: 'haste'
    };

    this.benchmarks = {
      targetDPS: 6800000,
      targetCPM: 60,
      mastery_efficiency: 85,
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  getUniqueFeatures(combatLog) {
    return {
      combatWisdomStacks: this.calculateCombatWisdomStacks(combatLog),
      masteryEfficiency: this.calculateMasteryEfficiency(combatLog),
      chiManagement: this.calculateChiManagement(combatLog),
      energyManagement: this.calculateEnergyManagement(combatLog),
      cooldownAlignment: this.calculateCooldownAlignment(combatLog)
    };
  }

  calculateCombatWisdomStacks(combatLog) {
    const avgStacks = combatLog.combat_wisdom?.average_stacks || 0;
    return (avgStacks / 10) * 100; // 10스택이 최대
  }

  calculateMasteryEfficiency(combatLog) {
    const combatWisdomDamage = combatLog.mastery?.combat_wisdom || 0;
    const totalDamage = combatLog.damage?.total || 0;
    return totalDamage > 0 ? (combatWisdomDamage / totalDamage) * 100 : 0;
  }

  calculateChiManagement(combatLog) {
    const wastedChi = combatLog.chi?.wasted || 0;
    const totalChi = combatLog.chi?.generated || 0;
    return totalChi > 0 ? Math.max(0, 100 - (wastedChi / totalChi * 100)) : 0;
  }

  calculateEnergyManagement(combatLog) {
    const cappedTime = combatLog.energy?.cappedTime || 0;
    const totalTime = combatLog.duration || 1;
    return Math.max(0, 100 - (cappedTime / totalTime * 100 * 20));
  }

  calculateCooldownAlignment(combatLog) {
    const alignedUses = combatLog.cooldowns?.aligned_uses || 0;
    const totalUses = combatLog.cooldowns?.total_uses || 0;
    return totalUses > 0 ? (alignedUses / totalUses) * 100 : 0;
  }

  getRotationAdvice(currentState) {
    const advice = [];

    const chi = currentState.chi || 0;
    const energy = currentState.energy || 0;

    if (chi >= 5) {
      advice.push('기 과다: 떠오르는 태양 차기');
    }

    if (currentState.buffs?.teachings_of_monastery?.stacks >= 3) {
      advice.push('수도원 가르침: 어둠차기');
    }

    if (energy >= 100) {
      advice.push('에너지 과다: 호랑이 장창');
    }

    if (currentState.buffs?.dance_of_chiji) {
      advice.push('치지의 춤: 회전 용권');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  async initialize() {
    console.log('🌪️ 바람길잡이 수도사 AI 초기화 중...');
    await this.loadAPL();
    const loaded = await this.loadModel();
    if (!loaded) {
      this.createSpecializedModel();
    }
    console.log('✅ 바람길잡이 수도사 AI 준비 완료');
  }
}

export default WindwalkerMonkAI;