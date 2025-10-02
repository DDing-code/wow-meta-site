// 흑마법사 파괴 전문 AI
import SpecializationAI from '../../core/SpecializationAI';

class DestructionWarlockAI extends SpecializationAI {
  constructor() {
    super('warlock', 'destruction');

    this.specializationTraits = {
      role: 'dps',
      resource: 'soul_shards',
      primaryStat: 'intellect',
      armorType: 'cloth'
    };

    this.coreMechanics = {
      builder: ['conflagrate', 'incinerate', 'immolate'],
      spender: ['chaos_bolt', 'rain_of_fire', 'shadowburn'],
      cooldowns: [
        { name: 'summon_infernal', cooldown: 180 },
        { name: 'dark_soul_instability', cooldown: 120 },
        { name: 'conflagrate', cooldown: 13 }
      ],
      buffs: ['backdraft', 'reverse_entropy', 'dark_soul_instability'],
      debuffs: ['immolate', 'havoc'],
      procs: ['backdraft', 'reverse_entropy']
    };

    this.statPriority = {
      1: 'intellect',
      2: 'critical',
      3: 'haste',
      4: 'mastery',
      5: 'versatility'
    };

    this.benchmarks = {
      targetDPS: 6700000,
      targetCPM: 35,
      targetResourceEfficiency: 90
    };

    this.initialize();
  }

  getUniqueFeatures(combatLog) {
    return {
      immolateUptime: combatLog.debuffUptimes?.immolate || 0,
      backdraftUsage: this.calculateBackdraftUsage(combatLog),
      chaosBoltEfficiency: this.calculateChaosBoltEfficiency(combatLog),
      havocUsage: this.calculateHavocUsage(combatLog)
    };
  }

  calculateBackdraftUsage(combatLog) {
    const procs = combatLog.procs?.backdraft?.total || 0;
    const used = combatLog.procs?.backdraft?.used || 0;
    return procs > 0 ? (used / procs) * 100 : 0;
  }

  calculateChaosBoltEfficiency(combatLog) {
    return combatLog.chaosBolts ? combatLog.chaosBolts.filter(cb => cb.enhanced).length / combatLog.chaosBolts.length * 100 : 100;
  }

  calculateHavocUsage(combatLog) {
    return combatLog.havocTargets ? (combatLog.havocTargets / combatLog.maxHavocTargets) * 100 : 0;
  }

  getRotationAdvice(currentState) {
    const advice = [];

    if (!currentState.debuffs?.immolate) {
      advice.push('제물 적용 필요');
    }

    if (currentState.buffs?.backdraft) {
      advice.push('역풍: 강화된 소각');
    }

    if (currentState.soul_shards >= 4) {
      advice.push('혼돈의 화살 사용');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 로테이션 유지';
  }

  async initialize() {
    console.log('🔥 파괴 흑마법사 AI 초기화 중...');
    await this.loadAPL();
    const loaded = await this.loadModel();
    if (!loaded) {
      this.createSpecializedModel();
    }
    console.log('✅ 파괴 흑마법사 AI 준비 완료');
  }
}

export default DestructionWarlockAI;