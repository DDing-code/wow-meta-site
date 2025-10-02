// 전사 보호 전문 AI
import SpecializationAI from '../../core/SpecializationAI';

class ProtectionWarriorAI extends SpecializationAI {
  constructor() {
    super('warrior', 'protection');

    this.specializationTraits = {
      role: 'tank',
      resource: 'rage',
      primaryStat: 'strength',
      armorType: 'plate'
    };

    this.coreMechanics = {
      builder: ['devastate', 'thunder_clap', 'revenge', 'shield_slam'],
      spender: ['shield_block', 'ignore_pain', 'last_stand'],
      cooldowns: [
        { name: 'shield_wall', cooldown: 240 },
        { name: 'last_stand', cooldown: 180 },
        { name: 'avatar', cooldown: 90 },
        { name: 'demoralizing_shout', cooldown: 45 }
      ],
      buffs: ['shield_block', 'ignore_pain', 'avatar', 'revenge'],
      debuffs: ['thunder_clap', 'demoralizing_shout'],
      procs: ['revenge', 'devastator']
    };

    this.statPriority = {
      1: 'strength',
      2: 'haste',
      3: 'mastery',
      4: 'versatility',
      5: 'critical'
    };

    this.benchmarks = {
      targetDPS: 3100000,
      targetCPM: 50,
      shield_block_uptime: 60,
      targetResourceEfficiency: 85
    };

    this.initialize();
  }

  getUniqueFeatures(combatLog) {
    return {
      shieldBlockUptime: combatLog.buffUptimes?.shield_block || 0,
      ignorePainUptime: combatLog.buffUptimes?.ignore_pain || 0,
      revengeProcs: combatLog.procs?.revenge || 0,
      rageManagement: this.calculateRageManagement(combatLog),
      threatManagement: this.calculateThreatManagement(combatLog)
    };
  }

  calculateRageManagement(combatLog) {
    const cappedTime = combatLog.rage?.cappedTime || 0;
    const totalTime = combatLog.duration || 1;
    return Math.max(0, 100 - (cappedTime / totalTime * 100 * 10));
  }

  calculateThreatManagement(combatLog) {
    const threatLoss = combatLog.threat?.losses || 0;
    const totalFights = combatLog.threat?.total || 1;
    return Math.max(0, 100 - (threatLoss / totalFights * 100));
  }

  getRotationAdvice(currentState) {
    const advice = [];

    if (currentState.rage >= 60 && !currentState.buffs?.shield_block) {
      advice.push('방패 막기 사용');
    }

    if (currentState.buffs?.revenge) {
      advice.push('복수: 강화된 공격');
    }

    if (currentState.health_percent < 40) {
      advice.push('위험! 방어 쿨다운 사용');
    }

    return advice.length > 0 ? advice.join(', ') : '현재 탱킹 유지';
  }

  async initialize() {
    console.log('🛡️ 보호 전사 AI 초기화 중...');
    await this.loadAPL();
    const loaded = await this.loadModel();
    if (!loaded) {
      this.createSpecializedModel();
    }
    console.log('✅ 보호 전사 AI 준비 완료');
  }
}

export default ProtectionWarriorAI;