// 수도사 운무 전문 AI
import SpecializationAI from '../../core/SpecializationAI';

class MistweaverMonkAI extends SpecializationAI {
  constructor() {
    super('monk', 'mistweaver');

    this.specializationTraits = {
      role: 'healer',
      resource: 'mana',
      primaryStat: 'intellect',
      armorType: 'leather'
    };

    this.coreMechanics = {
      builder: ['renewing_mist', 'essence_font', 'thunder_focus_tea', 'rising_sun_kick'],
      spender: ['vivify', 'enveloping_mist', 'life_cocoon', 'revival'],
      cooldowns: [
        { name: 'thunder_focus_tea', cooldown: 30 },
        { name: 'invoke_yulon', cooldown: 180 },
        { name: 'revival', cooldown: 180 },
        { name: 'life_cocoon', cooldown: 120 }
      ],
      buffs: ['thunder_focus_tea', 'teachings_of_monastery', 'lifecycles', 'upwelling'],
      debuffs: ['rising_sun_kick'],
      procs: ['teachings_of_monastery', 'lifecycles']
    };

    this.statPriority = {
      1: 'intellect',
      2: 'critical',
      3: 'haste',
      4: 'mastery',
      5: 'versatility'
    };

    this.benchmarks = {
      targetHPS: 5400000,
      targetCPM: 45,
      renewing_mist_uptime: 85,
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  getUniqueFeatures(combatLog) {
    return {
      renewingMistUptime: combatLog.buffUptimes?.renewing_mist || 0,
      essenceFontEfficiency: this.calculateEssenceFontEfficiency(combatLog),
      thunderFocusTeaUsage: this.calculateTFTUsage(combatLog),
      fistWeavingRatio: this.calculateFistWeavingRatio(combatLog),
      masteryEfficiency: this.calculateMasteryEfficiency(combatLog)
    };
  }

  calculateEssenceFontEfficiency(combatLog) {
    const efCasts = combatLog.abilities?.essence_font || 0;
    const totalTargetsHit = combatLog.essence_font?.targets_hit || 0;
    return efCasts > 0 ? Math.min(100, (totalTargetsHit / (efCasts * 6)) * 100) : 0;
  }

  calculateTFTUsage(combatLog) {
    const tftUses = combatLog.abilities?.thunder_focus_tea || 0;
    const maxPossible = Math.floor(combatLog.duration / 30) + 1;
    return (tftUses / maxPossible) * 100;
  }

  calculateFistWeavingRatio(combatLog) {
    const damageSpells = combatLog.damage?.spells || 0;
    const healingSpells = combatLog.healing?.spells || 0;
    const totalSpells = damageSpells + healingSpells;
    return totalSpells > 0 ? (damageSpells / totalSpells) * 100 : 0;
  }

  calculateMasteryEfficiency(combatLog) {
    const gustHealing = combatLog.mastery?.gust_of_mists || 0;
    const totalHealing = combatLog.healing?.total || 0;
    return totalHealing > 0 ? (gustHealing / totalHealing) * 100 : 0;
  }

  getRotationAdvice(currentState) {
    const advice = [];

    const renewingMistCount = currentState.renewing_mist_count || 0;
    if (renewingMistCount < 3) {
      advice.push('회복의 안개 부족');
    }

    if (currentState.buffs?.thunder_focus_tea) {
      advice.push('천둥차: 강화된 스킬 사용');
    }

    if (currentState.injured_allies >= 4 && currentState.mana_percent > 60) {
      advice.push('정수의 샘 사용');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 힐링 유지';
  }

  async initialize() {
    console.log('🌫️ 운무 수도사 AI 초기화 중...');
    await this.loadAPL();
    const loaded = await this.loadModel();
    if (!loaded) {
      this.createSpecializedModel();
    }
    console.log('✅ 운무 수도사 AI 준비 완료');
  }
}

export default MistweaverMonkAI;