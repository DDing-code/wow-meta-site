// 악마사냥꾼 복수 전문 AI
import SpecializationAI from '../../core/SpecializationAI';

class VengeanceDemonHunterAI extends SpecializationAI {
  constructor() {
    super('demonhunter', 'vengeance');

    this.specializationTraits = {
      role: 'tank',
      resource: 'fury',
      primaryStat: 'agility',
      armorType: 'leather'
    };

    this.coreMechanics = {
      builder: ['shear', 'fracture', 'fel_devastation', 'spirit_bomb'],
      spender: ['soul_cleave', 'soul_barrier', 'metamorphosis'],
      cooldowns: [
        { name: 'metamorphosis', cooldown: 180 },
        { name: 'fiery_brand', cooldown: 60 },
        { name: 'fel_devastation', cooldown: 60 },
        { name: 'sigil_of_flame', cooldown: 30 }
      ],
      buffs: ['metamorphosis', 'soul_fragments', 'demon_spikes', 'fiery_brand'],
      debuffs: ['fiery_brand', 'sigil_of_flame', 'frailty'],
      procs: ['soul_fragments', 'shattered_souls']
    };

    this.statPriority = {
      1: 'agility',
      2: 'versatility',
      3: 'mastery',
      4: 'haste',
      5: 'critical'
    };

    this.benchmarks = {
      targetDPS: 3500000,
      targetCPM: 55,
      soul_fragment_efficiency: 85,
      targetResourceEfficiency: 85
    };

    this.initialize();
  }

  getUniqueFeatures(combatLog) {
    return {
      soulFragmentEfficiency: this.calculateSoulFragmentEfficiency(combatLog),
      metamorphosisUptime: combatLog.buffUptimes?.metamorphosis || 0,
      demonSpikesUptime: combatLog.buffUptimes?.demon_spikes || 0,
      furyManagement: this.calculateFuryManagement(combatLog),
      selfHealingFromFragments: this.calculateFragmentHealing(combatLog)
    };
  }

  calculateSoulFragmentEfficiency(combatLog) {
    const generated = combatLog.soul_fragments?.generated || 0;
    const consumed = combatLog.soul_fragments?.consumed || 0;
    return generated > 0 ? (consumed / generated) * 100 : 0;
  }

  calculateFuryManagement(combatLog) {
    const cappedTime = combatLog.fury?.cappedTime || 0;
    const totalTime = combatLog.duration || 1;
    return Math.max(0, 100 - (cappedTime / totalTime * 100 * 10));
  }

  calculateFragmentHealing(combatLog) {
    const fragmentHealing = combatLog.healing?.soul_fragments || 0;
    const totalHealing = combatLog.healing?.total || 0;
    return totalHealing > 0 ? (fragmentHealing / totalHealing) * 100 : 0;
  }

  getRotationAdvice(currentState) {
    const advice = [];

    const soulFragments = currentState.soul_fragments || 0;
    if (soulFragments >= 4) {
      advice.push('영혼 조각 4개: 영혼 절단');
    }

    if (currentState.fury >= 60 && currentState.health_percent < 70) {
      advice.push('영혼 절단으로 치유');
    }

    if (!currentState.buffs?.demon_spikes) {
      advice.push('악마 가시 활성화');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 탱킹 유지';
  }

  async initialize() {
    console.log('😈 복수 악마사냥꾼 AI 초기화 중...');
    await this.loadAPL();
    const loaded = await this.loadModel();
    if (!loaded) {
      this.createSpecializedModel();
    }
    console.log('✅ 복수 악마사냥꾼 AI 준비 완료');
  }
}

export default VengeanceDemonHunterAI;