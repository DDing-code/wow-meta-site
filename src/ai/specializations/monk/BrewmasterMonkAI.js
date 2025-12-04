// 수도사 양조사 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';

class BrewmasterMonkAI extends SpecializationAI {
  constructor() {
    super('monk', 'brewmaster');

    this.specializationTraits = {
      role: 'tank',
      resource: 'energy',
      primaryStat: 'agility',
      armorType: 'leather'
    };

    this.coreMechanics = {
      builder: ['keg_smash', 'tiger_palm', 'expel_harm', 'breath_of_fire'],
      spender: ['purifying_brew', 'celestial_brew', 'blackout_kick'],
      cooldowns: [
        { name: 'zen_meditation', cooldown: 300 },
        { name: 'fortifying_brew', cooldown: 420 },
        { name: 'weapons_of_order', cooldown: 120 },
        { name: 'invoke_niuzao', cooldown: 180 }
      ],
      buffs: ['shuffle', 'celestial_brew', 'fortifying_brew', 'elusive_brawler'],
      debuffs: ['keg_smash', 'breath_of_fire'],
      procs: ['elusive_brawler', 'gift_of_the_ox']
    };

    this.statPriority = {
      1: 'agility',
      2: 'versatility',
      3: 'mastery',
      4: 'critical',
      5: 'haste'
    };

    this.benchmarks = {
      targetDPS: 3600000,
      targetCPM: 50,
      shuffle_uptime: 95,
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  getUniqueFeatures(combatLog) {
    return {
      shuffleUptime: combatLog.buffUptimes?.shuffle || 0,
      staggerDamage: this.calculateStaggerEfficiency(combatLog),
      purifyingBrewUsage: this.calculatePurifyingBrewUsage(combatLog),
      energyManagement: this.calculateEnergyManagement(combatLog),
      giftOfOxHealing: this.calculateGiftOfOxHealing(combatLog)
    };
  }

  calculateStaggerEfficiency(combatLog) {
    const staggerDamage = combatLog.stagger?.damage || 0;
    const directDamage = combatLog.damage?.direct || 0;
    const totalDamage = staggerDamage + directDamage;
    return totalDamage > 0 ? (staggerDamage / totalDamage) * 100 : 0;
  }

  calculatePurifyingBrewUsage(combatLog) {
    const purifies = combatLog.abilities?.purifying_brew || 0;
    const heavyStaggerTime = combatLog.stagger?.heavy_time || 0;
    return heavyStaggerTime > 0 ? (purifies / heavyStaggerTime * 10) * 100 : 100;
  }

  calculateEnergyManagement(combatLog) {
    const cappedTime = combatLog.energy?.cappedTime || 0;
    const totalTime = combatLog.duration || 1;
    return Math.max(0, 100 - (cappedTime / totalTime * 100 * 20));
  }

  calculateGiftOfOxHealing(combatLog) {
    const giftHealing = combatLog.healing?.gift_of_ox || 0;
    const totalHealing = combatLog.healing?.total || 0;
    return totalHealing > 0 ? (giftHealing / totalHealing) * 100 : 0;
  }

  getRotationAdvice(currentState) {
    const advice = [];

    if (!currentState.buffs?.shuffle || currentState.buffs.shuffle.remaining < 3) {
      advice.push('비틀거리기 갱신 필요');
    }

    if (currentState.stagger?.level === 'heavy') {
      advice.push('중독: 정화주 사용');
    }

    if (currentState.cooldowns?.keg_smash?.ready) {
      advice.push('술통 강타 사용');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 탱킹 유지';
  }

  async initialize() {
    console.log('🍺 양조사 수도사 AI 초기화 중...');
    await this.loadAPL();
    const loaded = await this.loadModel();
    if (!loaded) {
      this.createSpecializedModel();
    }
    console.log('✅ 양조사 수도사 AI 준비 완료');
  }
}

export default BrewmasterMonkAI;