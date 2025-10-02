/**
 * Phase 3.1: Warrior Class Implementation
 * 전사 클래스 - Arms, Fury, Protection
 * Lines: ~1,200
 */

import { Player } from '../Player.js';
import { Action } from '../Action.js';
import { Buff } from '../Buff.js';
import { RESOURCE_TYPE } from '../Actor.js';
import { DAMAGE_TYPE } from '../core/DamageCalculator.js';

// ==================== 전사 상수 ====================
export const WARRIOR_CONSTANTS = {
  // 분노 생성/소비
  RAGE_GENERATION: {
    AUTO_ATTACK_MAIN: 20,
    AUTO_ATTACK_OFF: 10,
    DAMAGE_TAKEN: 1, // 피해량당
    CHARGE: 20,
    BLOODTHIRST: 8,
    RAGING_BLOW: 12
  },

  // 스펙별 특수 메커니즘
  ARMS: {
    COLOSSUS_SMASH_DURATION: 10000,
    COLOSSUS_SMASH_BONUS: 0.3,
    MORTAL_STRIKE_HEALING_REDUCTION: 0.5,
    DEEP_WOUNDS_DURATION: 12000
  },

  FURY: {
    ENRAGE_DURATION: 4000,
    RAMPAGE_THRESHOLD: 85,
    BLOODTHIRST_HEAL_PERCENT: 0.03,
    WHIRLWIND_BUFF_DURATION: 20000
  },

  PROTECTION: {
    SHIELD_BLOCK_DURATION: 6000,
    SHIELD_BLOCK_VALUE: 1.0, // 100% 블록
    IGNORE_PAIN_CAP: 0.3, // 최대 HP의 30%
    AVATAR_DURATION: 20000
  }
};

// ==================== 전사 기본 클래스 ====================
export class Warrior extends Player {
  constructor(sim, name) {
    super(sim, name);

    this.class = 'warrior';
    this.resources.base[RESOURCE_TYPE.RAGE] = 0;
    this.resources.max[RESOURCE_TYPE.RAGE] = 100;
    this.resources.current[RESOURCE_TYPE.RAGE] = 0;

    // 전사 특성
    this.canBlock = false; // 방패 필요
    this.canParry = true;
    this.isDualWielding = false;

    // 전사 버프
    this.buffs.battleShout = null;
    this.buffs.commandingShout = null;

    // 특수 메커니즘
    this.rageGeneration = 1.0; // 분노 생성 배율
    this.executePhase = false;
  }

  // ==================== 분노 관리 ====================
  generateRage(amount, source = 'unknown') {
    const actualAmount = Math.floor(amount * this.rageGeneration);
    this.grantResource(RESOURCE_TYPE.RAGE, actualAmount, source);

    // Enrage 트리거 (Fury)
    if (this.spec === 'fury' && source === 'bloodthirst_crit') {
      this.triggerEnrage();
    }
  }

  spendRage(amount) {
    if (this.resources.current[RESOURCE_TYPE.RAGE] < amount) {
      return false;
    }

    this.resources.current[RESOURCE_TYPE.RAGE] -= amount;

    // Anger Management (특성)
    if (this.talents.angerManagement) {
      const cdrAmount = amount * 10; // 분노 1당 0.01초
      this.reduceCooldowns(cdrAmount);
    }

    return true;
  }

  // ==================== 자동 공격 ====================
  setupAutoAttack() {
    // 주 무기
    this.scheduleAutoAttack('mainhand');

    // 쌍수 (Fury)
    if (this.isDualWielding) {
      this.scheduleAutoAttack('offhand');
    }
  }

  scheduleAutoAttack(hand) {
    const weapon = hand === 'offhand' ? this.gear.offHand : this.gear.mainHand;
    if (!weapon) return;

    const attackSpeed = weapon.speed / (1 + this.getHaste() / 100);

    this.sim.scheduleEvent({
      time: this.sim.currentTime + attackSpeed,
      actor: this,
      callback: () => {
        this.executeAutoAttack(hand);
        this.scheduleAutoAttack(hand); // 다음 공격 예약
      }
    });
  }

  executeAutoAttack(hand) {
    const damage = this.calculateAutoAttackDamage(hand);

    // 분노 생성
    const rageGain = hand === 'offhand' ?
      WARRIOR_CONSTANTS.RAGE_GENERATION.AUTO_ATTACK_OFF :
      WARRIOR_CONSTANTS.RAGE_GENERATION.AUTO_ATTACK_MAIN;

    this.generateRage(rageGain, `auto_attack_${hand}`);

    // 데미지 적용
    this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'auto_attack');

    // 특수 효과 트리거
    this.onAutoAttack(hand);
  }

  calculateAutoAttackDamage(hand) {
    const weapon = hand === 'offhand' ? this.gear.offHand : this.gear.mainHand;
    const baseDamage = (weapon.minDamage + weapon.maxDamage) / 2;
    const apBonus = this.stats.get('attackPower') * weapon.speed / 14;

    let damage = baseDamage + apBonus;

    // 보조 무기 패널티
    if (hand === 'offhand') {
      damage *= 0.5;
    }

    return damage;
  }

  onAutoAttack(hand) {
    // Inner Rage (특성)
    if (this.talents.innerRage && Math.random() < 0.1) {
      this.generateRage(5, 'inner_rage');
    }
  }

  // ==================== 전투 이벤트 ====================
  onDamageTaken(damage, source) {
    super.onDamageTaken(damage, source);

    // 피해 → 분노 생성
    const rageFromDamage = Math.floor(damage / 100);
    this.generateRage(rageFromDamage, 'damage_taken');

    // Vengeance (Protection)
    if (this.spec === 'protection') {
      this.applyVengeance(damage);
    }
  }

  onTargetChange(newTarget) {
    super.onTargetChange(newTarget);

    // Charge
    if (this.canUse('charge')) {
      this.cast('charge');
    }
  }

  // ==================== 공통 스킬 ====================
  setupCommonAbilities() {
    // Battle Shout
    this.abilities.battleShout = new Action({
      name: 'Battle Shout',
      cooldown: 0,
      gcd: true,
      execute: () => {
        this.applyRaidBuff('battleShout', {
          duration: 3600000,
          attackPower: this.level * 5
        });
      }
    });

    // Charge
    this.abilities.charge = new Action({
      name: 'Charge',
      cooldown: 20000,
      gcd: false,
      range: 25,
      execute: () => {
        this.generateRage(WARRIOR_CONSTANTS.RAGE_GENERATION.CHARGE, 'charge');
        this.applyBuff('charge', {
          duration: 4000,
          movementSpeed: 1.7
        });
      }
    });

    // Execute
    this.abilities.execute = new Action({
      name: 'Execute',
      rageCost: 20,
      usableIf: () => this.target.getHealthPercent() <= 0.35,
      execute: () => {
        let damage = this.calculateExecuteDamage();

        // Sudden Death 프록
        if (this.buffs.suddenDeath) {
          damage *= 1.5;
          this.removeBuff('suddenDeath');
        }

        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'execute');
      }
    });

    // Berserker Rage
    this.abilities.berserkerRage = new Action({
      name: 'Berserker Rage',
      cooldown: 60000,
      gcd: false,
      execute: () => {
        this.removeFear();
        this.removeSap();
        this.removeIncapacitate();

        this.applyBuff('berserkerRage', {
          duration: 6000,
          immuneToFear: true,
          immuneToSap: true,
          immuneToIncapacitate: true
        });
      }
    });

    // Rallying Cry
    this.abilities.rallyingCry = new Action({
      name: 'Rallying Cry',
      cooldown: 180000,
      gcd: true,
      execute: () => {
        this.applyRaidBuff('rallyingCry', {
          duration: 10000,
          healthMultiplier: 1.15
        });
      }
    });
  }

  calculateExecuteDamage() {
    const ap = this.stats.get('attackPower');
    const baseDamage = ap * 2.5;
    const missingHealthPercent = 1 - this.target.getHealthPercent();
    const executeMod = 1 + missingHealthPercent * 2;

    return baseDamage * executeMod;
  }
}

// ==================== Arms 전사 ====================
export class ArmsWarrior extends Warrior {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'arms';

    // Arms 특수 메커니즘
    this.colossusSmashActive = false;
    this.deepWoundsTargets = new Map();
    this.overpowerCharges = 0;
    this.mortalStrikeDebuff = null;

    this.setupArmsAbilities();
  }

  setupArmsAbilities() {
    // Mortal Strike
    this.abilities.mortalStrike = new Action({
      name: 'Mortal Strike',
      rageCost: 30,
      cooldown: 6000,
      execute: () => {
        const damage = this.calculateMortalStrikeDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'mortal_strike');

        // Deep Wounds 적용
        this.applyDeepWounds(this.target);

        // Mortal Wounds 디버프
        this.target.applyDebuff('mortalWounds', {
          duration: 10000,
          healingReduction: WARRIOR_CONSTANTS.ARMS.MORTAL_STRIKE_HEALING_REDUCTION
        });
      }
    });

    // Colossus Smash
    this.abilities.colossusSmash = new Action({
      name: 'Colossus Smash',
      cooldown: 45000,
      gcd: true,
      execute: () => {
        this.target.applyDebuff('colossusSmash', {
          duration: WARRIOR_CONSTANTS.ARMS.COLOSSUS_SMASH_DURATION,
          armorIgnore: 1.0,
          damageIncrease: WARRIOR_CONSTANTS.ARMS.COLOSSUS_SMASH_BONUS
        });

        this.colossusSmashActive = true;
        this.sim.scheduleEvent({
          time: this.sim.currentTime + WARRIOR_CONSTANTS.ARMS.COLOSSUS_SMASH_DURATION,
          actor: this,
          callback: () => { this.colossusSmashActive = false; }
        });
      }
    });

    // Overpower
    this.abilities.overpower = new Action({
      name: 'Overpower',
      charges: 2,
      chargeCooldown: 12000,
      rageCost: 0,
      execute: () => {
        const damage = this.calculateOverpowerDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'overpower');

        // Overpower 버프
        this.applyBuff('overpower', {
          duration: 15000,
          critBonus: 0.3,
          maxStacks: 2
        });
      }
    });

    // Slam
    this.abilities.slam = new Action({
      name: 'Slam',
      rageCost: 20,
      execute: () => {
        const damage = this.calculateSlamDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'slam');
      }
    });

    // Bladestorm
    this.abilities.bladestorm = new Action({
      name: 'Bladestorm',
      cooldown: 90000,
      channeled: true,
      duration: 6000,
      execute: () => {
        this.startBladestorm();
      }
    });

    // Sweeping Strikes
    this.abilities.sweepingStrikes = new Action({
      name: 'Sweeping Strikes',
      cooldown: 30000,
      charges: 2,
      execute: () => {
        this.applyBuff('sweepingStrikes', {
          duration: 12000,
          cleaveTargets: 1
        });
      }
    });
  }

  calculateMortalStrikeDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 1.8;

    if (this.colossusSmashActive) {
      damage *= 1 + WARRIOR_CONSTANTS.ARMS.COLOSSUS_SMASH_BONUS;
    }

    return damage;
  }

  calculateOverpowerDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 1.4;
  }

  calculateSlamDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 1.2;

    if (this.buffs.has('fervorOfBattle')) {
      damage *= 1.25;
    }

    return damage;
  }

  applyDeepWounds(target) {
    const tickDamage = this.stats.get('attackPower') * 0.3;

    target.applyDebuff('deepWounds', {
      duration: WARRIOR_CONSTANTS.ARMS.DEEP_WOUNDS_DURATION,
      tickInterval: 3000,
      tickDamage: tickDamage,
      school: DAMAGE_TYPE.BLEED,
      pandemic: true
    });

    this.deepWoundsTargets.set(target, this.sim.currentTime);
  }

  startBladestorm() {
    const tickInterval = 1000;
    let ticks = 6;

    const bladestormTick = () => {
      if (ticks <= 0) return;

      // 모든 적에게 데미지
      const nearbyTargets = this.getNearbyTargets(8);
      const damage = this.stats.get('attackPower') * 0.6;

      for (const target of nearbyTargets) {
        this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL, 'bladestorm');
      }

      ticks--;
      if (ticks > 0) {
        this.sim.scheduleEvent({
          time: this.sim.currentTime + tickInterval,
          actor: this,
          callback: bladestormTick
        });
      }
    };

    bladestormTick();

    // 블레이드스톰 중 이동속도 증가
    this.applyBuff('bladestorm', {
      duration: 6000,
      immuneToSnare: true,
      movementSpeed: 1.7
    });
  }
}

// ==================== Fury 전사 ====================
export class FuryWarrior extends Warrior {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'fury';
    this.isDualWielding = true;

    // Fury 특수 메커니즘
    this.enrageStacks = 0;
    this.rampageReady = false;
    this.whirlwindBuff = false;
    this.meatCleaverStacks = 0;

    this.setupFuryAbilities();
  }

  setupFuryAbilities() {
    // Bloodthirst
    this.abilities.bloodthirst = new Action({
      name: 'Bloodthirst',
      cooldown: 4500,
      execute: () => {
        const damage = this.calculateBloodthirstDamage();
        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'bloodthirst');

        // 치명타 시 격노
        if (result.crit) {
          this.triggerEnrage();
          this.generateRage(WARRIOR_CONSTANTS.RAGE_GENERATION.BLOODTHIRST * 2, 'bloodthirst_crit');
        } else {
          this.generateRage(WARRIOR_CONSTANTS.RAGE_GENERATION.BLOODTHIRST, 'bloodthirst');
        }

        // 자가 치유
        const healAmount = this.resources.max.health * WARRIOR_CONSTANTS.FURY.BLOODTHIRST_HEAL_PERCENT;
        this.heal(healAmount);
      }
    });

    // Raging Blow
    this.abilities.ragingBlow = new Action({
      name: 'Raging Blow',
      charges: 2,
      chargeCooldown: 8000,
      usableIf: () => this.buffs.has('enrage'),
      execute: () => {
        const damage = this.calculateRagingBlowDamage();

        // 양손 공격
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'raging_blow_main');
        this.dealDamage(this.target, damage * 0.5, DAMAGE_TYPE.PHYSICAL, 'raging_blow_off');

        this.generateRage(WARRIOR_CONSTANTS.RAGE_GENERATION.RAGING_BLOW, 'raging_blow');
      }
    });

    // Rampage
    this.abilities.rampage = new Action({
      name: 'Rampage',
      rageCost: 85,
      execute: () => {
        this.executeRampage();
      }
    });

    // Whirlwind
    this.abilities.whirlwind = new Action({
      name: 'Whirlwind',
      rageCost: 30,
      execute: () => {
        const nearbyTargets = this.getNearbyTargets(8);
        const damage = this.calculateWhirlwindDamage();

        for (const target of nearbyTargets.slice(0, 5)) { // 최대 5타겟
          this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL, 'whirlwind');
        }

        // Meat Cleaver 버프
        this.applyBuff('meatCleaver', {
          duration: WARRIOR_CONSTANTS.FURY.WHIRLWIND_BUFF_DURATION,
          maxStacks: 4,
          cleaveTargets: 1
        });

        this.whirlwindBuff = true;
      }
    });

    // Execute (Fury 버전)
    this.abilities.execute = new Action({
      name: 'Execute',
      rageCost: 20,
      usableIf: () => this.target.getHealthPercent() <= 0.2 || this.buffs.has('suddenDeath'),
      execute: () => {
        const damage = this.calculateExecuteDamage() * 1.5; // Fury는 더 강한 처형
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'execute');

        // Massacre 특성
        if (this.talents.massacre) {
          this.triggerEnrage();
        }
      }
    });

    // Onslaught
    this.abilities.onslaught = new Action({
      name: 'Onslaught',
      rageCost: 50,
      usableIf: () => this.buffs.has('enrage'),
      execute: () => {
        let hits = 3;
        const damage = this.calculateOnslaughtDamage();

        for (let i = 0; i < hits; i++) {
          this.sim.scheduleEvent({
            time: this.sim.currentTime + i * 500,
            actor: this,
            callback: () => {
              this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'onslaught');
            }
          });
        }
      }
    });

    // Odyn's Fury
    this.abilities.odynsFury = new Action({
      name: "Odyn's Fury",
      cooldown: 45000,
      execute: () => {
        const damage = this.stats.get('attackPower') * 3.5;
        const nearbyTargets = this.getNearbyTargets(12);

        // 즉시 데미지
        for (const target of nearbyTargets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL, 'odyns_fury');
        }

        // DoT 적용
        for (const target of nearbyTargets) {
          target.applyDebuff('odynsFuryDot', {
            duration: 4000,
            tickInterval: 1000,
            tickDamage: damage * 0.2,
            school: DAMAGE_TYPE.BLEED
          });
        }
      }
    });
  }

  calculateBloodthirstDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 1.15;

    if (this.buffs.has('enrage')) {
      damage *= 1.25;
    }

    return damage;
  }

  calculateRagingBlowDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.85;
  }

  calculateWhirlwindDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.45;
  }

  calculateOnslaughtDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.7;
  }

  executeRampage() {
    // 5회 공격
    const hits = 5;
    const damage = this.stats.get('attackPower') * 0.4;

    for (let i = 0; i < hits; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * 200,
        actor: this,
        callback: () => {
          this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, `rampage_hit_${i+1}`);
        }
      });
    }

    // 격노 발동
    this.triggerEnrage();
  }

  triggerEnrage() {
    this.applyBuff('enrage', {
      duration: WARRIOR_CONSTANTS.FURY.ENRAGE_DURATION,
      hastePercent: 25,
      damageMultiplier: 1.15
    });

    // Frenzied Regeneration
    if (this.talents.frenziedRegeneration) {
      const healAmount = this.resources.max.health * 0.02;
      this.heal(healAmount);
    }
  }

  onAutoAttack(hand) {
    super.onAutoAttack(hand);

    // Bloodsurge 프록
    if (Math.random() < 0.2) {
      this.applyBuff('bloodsurge', {
        duration: 12000,
        instantCast: 'bloodthirst'
      });
    }
  }
}

// ==================== Protection 전사 ====================
export class ProtectionWarrior extends Warrior {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'protection';
    this.role = 'tank';

    this.canBlock = true;
    this.hasShield = true;

    // Protection 특수 메커니즘
    this.ignorePainAbsorb = 0;
    this.shieldBlockCharges = 2;
    this.vengeanceStacks = 0;
    this.lastStandActive = false;

    this.setupProtectionAbilities();
  }

  setupProtectionAbilities() {
    // Shield Slam
    this.abilities.shieldSlam = new Action({
      name: 'Shield Slam',
      rageCost: 15,
      cooldown: 9000,
      execute: () => {
        const damage = this.calculateShieldSlamDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'shield_slam');

        this.generateRage(15, 'shield_slam');

        // Punish 디버프
        this.target.applyDebuff('punish', {
          duration: 9000,
          damageReduction: 0.03,
          maxStacks: 3
        });
      }
    });

    // Thunder Clap
    this.abilities.thunderClap = new Action({
      name: 'Thunder Clap',
      rageCost: 5,
      cooldown: 6000,
      execute: () => {
        const nearbyTargets = this.getNearbyTargets(8);
        const damage = this.calculateThunderClapDamage();

        for (const target of nearbyTargets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL, 'thunder_clap');

          // 감속
          target.applyDebuff('thunderClap', {
            duration: 10000,
            attackSpeedReduction: 0.2
          });
        }
      }
    });

    // Ignore Pain
    this.abilities.ignorePain = new Action({
      name: 'Ignore Pain',
      rageCost: 40,
      execute: () => {
        const apBonus = this.stats.get('attackPower') * 3.5;
        const maxAbsorb = this.resources.max.health * WARRIOR_CONSTANTS.PROTECTION.IGNORE_PAIN_CAP;

        this.ignorePainAbsorb = Math.min(this.ignorePainAbsorb + apBonus, maxAbsorb);

        this.applyBuff('ignorePain', {
          duration: 12000,
          absorb: this.ignorePainAbsorb
        });
      }
    });

    // Shield Block
    this.abilities.shieldBlock = new Action({
      name: 'Shield Block',
      charges: 2,
      chargeCooldown: 18000,
      rageCost: 30,
      execute: () => {
        this.applyBuff('shieldBlock', {
          duration: WARRIOR_CONSTANTS.PROTECTION.SHIELD_BLOCK_DURATION,
          blockChance: WARRIOR_CONSTANTS.PROTECTION.SHIELD_BLOCK_VALUE,
          blockValue: 0.3
        });
      }
    });

    // Revenge
    this.abilities.revenge = new Action({
      name: 'Revenge',
      rageCost: 0,
      cooldown: 3000,
      execute: () => {
        const damage = this.calculateRevengeDamage();
        const nearbyTargets = this.getNearbyTargets(5);

        // 주 타겟
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'revenge');

        // 광역 (50% 데미지)
        for (const target of nearbyTargets.slice(1, 3)) {
          this.dealDamage(target, damage * 0.5, DAMAGE_TYPE.PHYSICAL, 'revenge_cleave');
        }

        this.generateRage(5, 'revenge');
      }
    });

    // Last Stand
    this.abilities.lastStand = new Action({
      name: 'Last Stand',
      cooldown: 180000,
      execute: () => {
        const healthIncrease = this.resources.max.health * 0.3;

        this.resources.max.health += healthIncrease;
        this.resources.current.health += healthIncrease;

        this.applyBuff('lastStand', {
          duration: 15000,
          healthBonus: healthIncrease
        });

        this.lastStandActive = true;

        this.sim.scheduleEvent({
          time: this.sim.currentTime + 15000,
          actor: this,
          callback: () => {
            this.lastStandActive = false;
            this.resources.max.health -= healthIncrease;
            this.resources.current.health = Math.min(
              this.resources.current.health,
              this.resources.max.health
            );
          }
        });
      }
    });

    // Avatar
    this.abilities.avatar = new Action({
      name: 'Avatar',
      cooldown: 90000,
      execute: () => {
        this.applyBuff('avatar', {
          duration: WARRIOR_CONSTANTS.PROTECTION.AVATAR_DURATION,
          damageMultiplier: 1.2,
          damageReduction: 0.2,
          removeRoots: true
        });
      }
    });

    // Shield Wall
    this.abilities.shieldWall = new Action({
      name: 'Shield Wall',
      cooldown: 240000,
      execute: () => {
        this.applyBuff('shieldWall', {
          duration: 8000,
          damageReduction: 0.5
        });
      }
    });
  }

  calculateShieldSlamDamage() {
    const ap = this.stats.get('attackPower');
    const shieldBlockValue = this.gear.shield?.blockValue || 1000;
    return ap * 1.5 + shieldBlockValue;
  }

  calculateThunderClapDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.35;
  }

  calculateRevengeDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 0.8;

    // Vengeance 보너스
    if (this.vengeanceStacks > 0) {
      damage *= 1 + (this.vengeanceStacks * 0.05);
    }

    return damage;
  }

  applyVengeance(damageTaken) {
    const vengeanceGain = Math.floor(damageTaken * 0.02);

    this.applyBuff('vengeance', {
      duration: 20000,
      attackPower: vengeanceGain,
      maxStacks: 99
    });

    this.vengeanceStacks = Math.min(this.vengeanceStacks + 1, 99);
  }

  onDamageTaken(damage, source) {
    super.onDamageTaken(damage, source);

    // Shield Block 리프레시
    if (this.buffs.has('shieldBlock') && Math.random() < 0.3) {
      this.abilities.shieldBlock.charges++;
    }

    // Revenge 리셋
    if (this.canBlock && Math.random() < 0.3) {
      this.abilities.revenge.cooldown.reset();
    }
  }

  mitigateDamage(damage, damageType) {
    // Ignore Pain 흡수
    if (this.ignorePainAbsorb > 0) {
      const absorbed = Math.min(damage, this.ignorePainAbsorb);
      this.ignorePainAbsorb -= absorbed;
      damage -= absorbed;
    }

    // Shield Block
    if (this.buffs.has('shieldBlock') && damageType === DAMAGE_TYPE.PHYSICAL) {
      damage *= 0.7;
    }

    return super.mitigateDamage(damage, damageType);
  }

  generateThreat(amount) {
    // 탱커는 위협 수준 증가
    return amount * 3.5;
  }
}

// ==================== Export ====================
export default Warrior;