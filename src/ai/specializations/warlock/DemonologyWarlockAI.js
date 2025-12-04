// 흑마법사 악마 전문 AI
import SpecializationAI from '../../core/SpecializationAI.js';

class DemonologyWarlockAI extends SpecializationAI {
  constructor() {
    super('warlock', 'demonology');

    this.specializationTraits = {
      role: 'dps',
      resource: 'soul_shards',
      primaryStat: 'intellect',
      armorType: 'cloth'
    };

    this.coreMechanics = {
      builder: ['hand_of_guldan', 'dreadbite', 'shadow_bolt', 'call_dreadstalkers'],
      spender: ['summon_demonic_tyrant', 'soul_strike', 'bilescourge_bombers'],
      cooldowns: [
        { name: 'summon_demonic_tyrant', cooldown: 90 },
        { name: 'nether_portal', cooldown: 180 },
        { name: 'call_dreadstalkers', cooldown: 30 }
      ],
      buffs: ['demonic_core', 'demonic_calling', 'inner_demons'],
      debuffs: ['doom', 'corruption'],
      procs: ['demonic_core', 'demonic_calling']
    };

    this.statPriority = {
      1: 'intellect',
      2: 'haste',
      3: 'critical',
      4: 'mastery',
      5: 'versatility'
    };

    this.benchmarks = {
      targetDPS: 6500000,
      targetCPM: 40,
      targetResourceEfficiency: 85
    };

    this.initialize();
  }

  getUniqueFeatures(combatLog) {
    return {
      demonUptime: combatLog.demonUptime || 0,
      tyrantEfficiency: this.calculateTyrantEfficiency(combatLog),
      coreProcs: combatLog.procs?.demonic_core || 0,
      shardEfficiency: this.calculateShardEfficiency(combatLog)
    };
  }

  calculateTyrantEfficiency(combatLog) {
    return combatLog.tyrantDamage ? (combatLog.tyrantDamage / combatLog.totalDamage) * 100 : 0;
  }

  calculateShardEfficiency(combatLog) {
    const generated = combatLog.shards?.generated || 0;
    const wasted = combatLog.shards?.wasted || 0;
    return generated > 0 ? Math.max(0, 100 - (wasted / generated * 100)) : 0;
  }

  getRotationAdvice(currentState) {
    const advice = [];

    if (currentState.soul_shards >= 4) {
      advice.push('영혼 파편 과다: 악마 폭군 소환');
    }

    if (currentState.buffs?.demonic_core) {
      advice.push('악마 핵심: 강화된 악마 볼트');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  async initialize() {
    console.log('👹 악마 흑마법사 AI 초기화 중...');
    await this.loadAPL();
    const loaded = await this.loadModel();
    if (!loaded) {
      this.createSpecializedModel();
    }
    console.log('✅ 악마 흑마법사 AI 준비 완료');
  }
}

export default DemonologyWarlockAI;