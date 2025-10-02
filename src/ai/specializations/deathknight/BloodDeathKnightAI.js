// 죽음의 기사 혈기 전문 AI
import SpecializationAI from '../../core/SpecializationAI';

class BloodDeathKnightAI extends SpecializationAI {
  constructor() {
    super('deathknight', 'blood');

    this.specializationTraits = {
      role: 'tank',
      resource: 'runic_power',
      primaryStat: 'strength',
      armorType: 'plate'
    };

    this.coreMechanics = {
      builder: ['heart_strike', 'blood_boil', 'marrowrend', 'death_strike'],
      spender: ['death_strike', 'bone_shield', 'vampiric_blood'],
      cooldowns: [
        { name: 'vampiric_blood', cooldown: 60 },
        { name: 'icebound_fortitude', cooldown: 180 },
        { name: 'army_of_the_dead', cooldown: 300 },
        { name: 'dancing_rune_weapon', cooldown: 120 }
      ],
      buffs: ['bone_shield', 'vampiric_blood', 'dancing_rune_weapon', 'crimson_scourge'],
      debuffs: ['blood_plague', 'mark_of_blood'],
      procs: ['crimson_scourge', 'bone_shield']
    };

    this.statPriority = {
      1: 'strength',
      2: 'versatility',
      3: 'mastery',
      4: 'haste',
      5: 'critical'
    };

    this.benchmarks = {
      targetDPS: 3300000,
      targetCPM: 45,
      bone_shield_uptime: 95,
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  getUniqueFeatures(combatLog) {
    return {
      boneShieldUptime: combatLog.buffUptimes?.bone_shield || 0,
      deathStrikeHealing: this.calculateDeathStrikeHealing(combatLog),
      runicPowerEfficiency: this.calculateRunicPowerEfficiency(combatLog),
      runeUsage: this.calculateRuneUsage(combatLog),
      selfHealingRatio: this.calculateSelfHealingRatio(combatLog)
    };
  }

  calculateDeathStrikeHealing(combatLog) {
    const dsHealing = combatLog.healing?.death_strike || 0;
    const totalHealing = combatLog.healing?.total || 0;
    return totalHealing > 0 ? (dsHealing / totalHealing) * 100 : 0;
  }

  calculateRunicPowerEfficiency(combatLog) {
    const generated = combatLog.runic_power?.generated || 0;
    const wasted = combatLog.runic_power?.wasted || 0;
    return generated > 0 ? Math.max(0, 100 - (wasted / generated * 100)) : 0;
  }

  calculateRuneUsage(combatLog) {
    const totalRunes = combatLog.runes?.total || 0;
    const wastedRunes = combatLog.runes?.wasted || 0;
    return totalRunes > 0 ? Math.max(0, 100 - (wastedRunes / totalRunes * 100)) : 0;
  }

  calculateSelfHealingRatio(combatLog) {
    const selfHealing = combatLog.selfHealing || 0;
    const damageTaken = combatLog.damageTaken || 1;
    return (selfHealing / damageTaken) * 100;
  }

  getRotationAdvice(currentState) {
    const advice = [];

    const boneShieldStacks = currentState.buffs?.bone_shield?.stacks || 0;
    if (boneShieldStacks < 5) {
      advice.push('골방패 스택 부족: 골수 찢기');
    }

    if (currentState.runic_power >= 80) {
      advice.push('죽음의 일격으로 자가 치유');
    }

    if (currentState.health_percent < 50) {
      advice.push('흡혈 사용 고려');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 탱킹 유지';
  }

  async initialize() {
    console.log('🩸 혈기 죽음의 기사 AI 초기화 중...');
    await this.loadAPL();
    const loaded = await this.loadModel();
    if (!loaded) {
      this.createSpecializedModel();
    }
    console.log('✅ 혈기 죽음의 기사 AI 준비 완료');
  }
}

export default BloodDeathKnightAI;