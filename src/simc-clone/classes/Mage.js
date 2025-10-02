/**
 * Phase 3.2: Mage Class Implementation
 * 마법사 클래스 - Arcane, Fire, Frost
 * Lines: ~1,200
 */

import { Player } from '../Player.js';
import { Action } from '../Action.js';
import { Buff } from '../Buff.js';
import { RESOURCE_TYPE } from '../Actor.js';
import { DAMAGE_TYPE } from '../core/DamageCalculator.js';

// ==================== 마법사 상수 ====================
export const MAGE_CONSTANTS = {
  // 마나 관리
  MANA_REGEN: {
    BASE_PERCENT: 0.02, // 초당 2%
    EVOCATION_PERCENT: 0.15, // 초당 15%
    ARCANE_INTELLECT_BONUS: 0.05
  },

  // 스펙별 특수 메커니즘
  ARCANE: {
    ARCANE_CHARGE_MAX: 4,
    ARCANE_CHARGE_DAMAGE: 0.6, // 충전당 60%
    ARCANE_CHARGE_MANA_COST: 1.0, // 충전당 100%
    ARCANE_POWER_DURATION: 10000,
    CLEARCASTING_PROC: 0.08
  },

  FIRE: {
    HEATING_UP_DURATION: 10000,
    HOT_STREAK_DURATION: 15000,
    IGNITE_SPREAD_RANGE: 8,
    IGNITE_TICK_INTERVAL: 2000,
    COMBUSTION_DURATION: 10000,
    CRITICAL_MASS_BONUS: 0.15
  },

  FROST: {
    FINGERS_OF_FROST_CHARGES: 2,
    BRAIN_FREEZE_PROC: 0.15,
    ICICLE_MAX: 5,
    ICICLE_DAMAGE_PERCENT: 0.18,
    WINTER_CHILL_STACKS: 2,
    FROZEN_ORB_DURATION: 10000
  }
};

// ==================== 마법사 기본 클래스 ====================
export class Mage extends Player {
  constructor(sim, name) {
    super(sim, name);

    this.class = 'mage';
    this.primaryResource = RESOURCE_TYPE.MANA;

    // 마법사 특성
    this.canBlock = false;
    this.canParry = false;
    this.canDodge = false;

    // 마법사 버프
    this.buffs.arcaneIntellect = null;
    this.buffs.iceBarrier = null;

    // 특수 메커니즘
    this.spellPowerBonus = 1.0;
    this.castTimeReduction = 0;
    this.manaCostReduction = 0;

    this.setupCommonAbilities();
  }

  // ==================== 마나 관리 ====================
  regenerateMana() {
    const baseRegen = this.resources.max[RESOURCE_TYPE.MANA] * MAGE_CONSTANTS.MANA_REGEN.BASE_PERCENT;
    let regenAmount = baseRegen;

    // Arcane Intellect 보너스
    if (this.buffs.arcaneIntellect) {
      regenAmount *= 1 + MAGE_CONSTANTS.MANA_REGEN.ARCANE_INTELLECT_BONUS;
    }

    // 전투 중 마나 회복 (정신력 기반)
    const spirit = this.stats.get('spirit') || 0;
    regenAmount += spirit * 0.001;

    this.grantResource(RESOURCE_TYPE.MANA, regenAmount, 'mana_regen');
  }

  spendMana(amount) {
    const actualCost = amount * (1 - this.manaCostReduction);

    if (this.resources.current[RESOURCE_TYPE.MANA] < actualCost) {
      return false;
    }

    this.resources.current[RESOURCE_TYPE.MANA] -= actualCost;
    return true;
  }

  // ==================== 시전 시스템 ====================
  startCast(spell) {
    if (spell.instantCast || this.hasInstantCast(spell)) {
      this.executeCast(spell);
      return;
    }

    const castTime = this.calculateCastTime(spell);

    this.currentCast = {
      spell: spell,
      startTime: this.sim.currentTime,
      endTime: this.sim.currentTime + castTime,
      interruptible: true
    };

    this.sim.scheduleEvent({
      time: this.currentCast.endTime,
      actor: this,
      callback: () => {
        if (this.currentCast && this.currentCast.spell === spell) {
          this.executeCast(spell);
          this.currentCast = null;
        }
      }
    });
  }

  calculateCastTime(spell) {
    let castTime = spell.castTime || 2000;

    // 가속
    const haste = this.getHaste();
    castTime = castTime / (1 + haste / 100);

    // 시전시간 감소
    castTime *= 1 - this.castTimeReduction;

    return Math.max(castTime, 750); // 최소 0.75초
  }

  hasInstantCast(spell) {
    // Presence of Mind
    if (this.buffs.has('presenceOfMind')) {
      this.removeBuff('presenceOfMind');
      return true;
    }

    // 스펙별 즉시시전 체크는 서브클래스에서
    return false;
  }

  interruptCast() {
    if (this.currentCast && this.currentCast.interruptible) {
      this.currentCast = null;
      this.onCastInterrupted();
    }
  }

  onCastInterrupted() {
    // 차단 시 패널티
    this.applyDebuff('interrupted', {
      duration: 4000,
      silenced: true
    });
  }

  // ==================== 공통 스킬 ====================
  setupCommonAbilities() {
    // Arcane Intellect
    this.abilities.arcaneIntellect = new Action({
      name: 'Arcane Intellect',
      manaCost: 0.04, // 4% 마나
      execute: () => {
        this.applyRaidBuff('arcaneIntellect', {
          duration: 3600000,
          intellect: this.level * 5,
          manaRegenPercent: 5
        });
      }
    });

    // Blink
    this.abilities.blink = new Action({
      name: 'Blink',
      cooldown: 15000,
      execute: () => {
        this.teleport(20); // 20야드 순간이동
        this.removeSnares();
      }
    });

    // Evocation
    this.abilities.evocation = new Action({
      name: 'Evocation',
      cooldown: 90000,
      channeled: true,
      duration: 6000,
      execute: () => {
        this.startEvocation();
      }
    });

    // Counterspell
    this.abilities.counterspell = new Action({
      name: 'Counterspell',
      cooldown: 24000,
      range: 40,
      execute: () => {
        if (this.target.currentCast) {
          this.target.interruptCast();
          this.target.applyDebuff('counterspell', {
            duration: 6000,
            silenced: true,
            school: this.target.currentCast.school
          });
        }
      }
    });

    // Time Warp
    this.abilities.timeWarp = new Action({
      name: 'Time Warp',
      cooldown: 300000,
      execute: () => {
        this.applyRaidBuff('timeWarp', {
          duration: 40000,
          hastePercent: 30
        });

        // Temporal Displacement 디버프
        for (const player of this.sim.players) {
          player.applyDebuff('temporalDisplacement', {
            duration: 600000,
            cannotBenefit: ['timeWarp', 'bloodlust', 'heroism']
          });
        }
      }
    });

    // Spellsteal
    this.abilities.spellsteal = new Action({
      name: 'Spellsteal',
      manaCost: 0.21,
      execute: () => {
        const stealableBuff = this.target.getStealableBuff();
        if (stealableBuff) {
          this.target.removeBuff(stealableBuff.name);
          this.applyBuff(stealableBuff.name, stealableBuff);
        }
      }
    });

    // Remove Curse
    this.abilities.removeCurse = new Action({
      name: 'Remove Curse',
      manaCost: 0.02,
      execute: (target) => {
        target.removeCurses();
      }
    });
  }

  startEvocation() {
    const tickInterval = 1000;
    let ticks = 6;

    const evocationTick = () => {
      if (ticks <= 0) return;

      const manaGain = this.resources.max[RESOURCE_TYPE.MANA] * MAGE_CONSTANTS.MANA_REGEN.EVOCATION_PERCENT;
      this.grantResource(RESOURCE_TYPE.MANA, manaGain, 'evocation');

      ticks--;
      if (ticks > 0) {
        this.sim.scheduleEvent({
          time: this.sim.currentTime + tickInterval,
          actor: this,
          callback: evocationTick
        });
      }
    };

    evocationTick();
  }

  teleport(distance) {
    // 순간이동 처리
    this.position = {
      x: this.position.x + distance,
      y: this.position.y
    };
  }

  removeSnares() {
    // 감속/이동불가 제거
    const snaresToRemove = ['slow', 'root', 'frost'];
    for (const debuff of this.debuffs.keys()) {
      if (snaresToRemove.some(snare => debuff.includes(snare))) {
        this.removeDebuff(debuff);
      }
    }
  }
}

// ==================== Arcane 마법사 ====================
export class ArcaneMage extends Mage {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'arcane';

    // Arcane 특수 메커니즘
    this.arcaneCharges = 0;
    this.clearcastingActive = false;
    this.arcanePowerActive = false;
    this.manaGem = 3; // 마나 보석 충전

    this.setupArcaneAbilities();
  }

  setupArcaneAbilities() {
    // Arcane Blast
    this.abilities.arcaneBlast = new Action({
      name: 'Arcane Blast',
      castTime: 2250,
      manaCost: 0.03,
      execute: () => {
        const damage = this.calculateArcaneBlastDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.ARCANE, 'arcane_blast');

        // Arcane Charge 추가
        this.addArcaneCharge();

        // Clearcasting 프록
        if (Math.random() < MAGE_CONSTANTS.ARCANE.CLEARCASTING_PROC) {
          this.triggerClearcasting();
        }
      }
    });

    // Arcane Missiles
    this.abilities.arcaneMissiles = new Action({
      name: 'Arcane Missiles',
      channeled: true,
      duration: 2000,
      manaCost: 0.15,
      usableIf: () => this.buffs.has('clearcasting') || this.resources.current[RESOURCE_TYPE.MANA] > 0.15,
      execute: () => {
        this.channelArcaneMissiles();
      }
    });

    // Arcane Barrage
    this.abilities.arcaneBarrage = new Action({
      name: 'Arcane Barrage',
      instantCast: true,
      manaCost: 0.01,
      execute: () => {
        const damage = this.calculateArcaneBarrageDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.ARCANE, 'arcane_barrage');

        // Arcane Charges 소비
        this.arcaneCharges = 0;
      }
    });

    // Arcane Power
    this.abilities.arcanePower = new Action({
      name: 'Arcane Power',
      cooldown: 120000,
      execute: () => {
        this.applyBuff('arcanePower', {
          duration: MAGE_CONSTANTS.ARCANE.ARCANE_POWER_DURATION,
          damageMultiplier: 1.3,
          manaCostMultiplier: 1.1
        });

        this.arcanePowerActive = true;
        this.sim.scheduleEvent({
          time: this.sim.currentTime + MAGE_CONSTANTS.ARCANE.ARCANE_POWER_DURATION,
          actor: this,
          callback: () => { this.arcanePowerActive = false; }
        });
      }
    });

    // Arcane Orb
    this.abilities.arcaneOrb = new Action({
      name: 'Arcane Orb',
      cooldown: 20000,
      manaCost: 0.01,
      execute: () => {
        this.launchArcaneOrb();
      }
    });

    // Presence of Mind
    this.abilities.presenceOfMind = new Action({
      name: 'Presence of Mind',
      cooldown: 45000,
      execute: () => {
        this.applyBuff('presenceOfMind', {
          duration: 999999,
          charges: 2
        });
      }
    });

    // Touch of the Magi
    this.abilities.touchOfTheMagi = new Action({
      name: 'Touch of the Magi',
      cooldown: 45000,
      execute: () => {
        this.target.applyDebuff('touchOfTheMagi', {
          duration: 10000,
          accumulateDamage: true,
          onExpire: (accumulated) => {
            const explosionDamage = accumulated * 0.25;
            this.dealDamage(this.target, explosionDamage, DAMAGE_TYPE.ARCANE, 'touch_explosion');
          }
        });
      }
    });

    // Mana Gem
    this.abilities.manaGem = new Action({
      name: 'Mana Gem',
      charges: 3,
      execute: () => {
        const manaGain = this.resources.max[RESOURCE_TYPE.MANA] * 0.1;
        this.grantResource(RESOURCE_TYPE.MANA, manaGain, 'mana_gem');
        this.manaGem--;
      }
    });
  }

  calculateArcaneBlastDamage() {
    const sp = this.stats.get('spellPower');
    let damage = sp * 1.1;

    // Arcane Charge 보너스
    damage *= 1 + (this.arcaneCharges * MAGE_CONSTANTS.ARCANE.ARCANE_CHARGE_DAMAGE);

    // Arcane Power
    if (this.arcanePowerActive) {
      damage *= 1.3;
    }

    return damage;
  }

  calculateArcaneBarrageDamage() {
    const sp = this.stats.get('spellPower');
    let damage = sp * 0.8;

    // Arcane Charge 보너스 (적음)
    damage *= 1 + (this.arcaneCharges * 0.15);

    return damage;
  }

  channelArcaneMissiles() {
    const waves = 5;
    const waveInterval = 400;

    for (let i = 0; i < waves; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * waveInterval,
        actor: this,
        callback: () => {
          const damage = this.stats.get('spellPower') * 0.35;
          this.dealDamage(this.target, damage, DAMAGE_TYPE.ARCANE, `arcane_missiles_${i+1}`);
        }
      });
    }

    // Clearcasting 소비
    if (this.buffs.has('clearcasting')) {
      this.removeBuff('clearcasting');
    }
  }

  launchArcaneOrb() {
    const damage = this.stats.get('spellPower') * 2.7;

    // 궤도 이동 시뮬레이션
    this.sim.scheduleEvent({
      time: this.sim.currentTime + 1000,
      actor: this,
      callback: () => {
        const targets = this.getTargetsInPath(40, 4);
        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.ARCANE, 'arcane_orb');
        }

        // Arcane Charge 1개 부여
        this.addArcaneCharge();
      }
    });
  }

  addArcaneCharge() {
    this.arcaneCharges = Math.min(this.arcaneCharges + 1, MAGE_CONSTANTS.ARCANE.ARCANE_CHARGE_MAX);

    this.applyBuff('arcaneCharge', {
      duration: 999999,
      stacks: this.arcaneCharges,
      damageMultiplier: 1 + (this.arcaneCharges * MAGE_CONSTANTS.ARCANE.ARCANE_CHARGE_DAMAGE),
      manaCostMultiplier: 1 + (this.arcaneCharges * MAGE_CONSTANTS.ARCANE.ARCANE_CHARGE_MANA_COST)
    });
  }

  triggerClearcasting() {
    this.applyBuff('clearcasting', {
      duration: 15000,
      freeCast: true
    });
    this.clearcastingActive = true;
  }

  spendMana(amount) {
    // Arcane Charges로 인한 마나 비용 증가
    if (this.arcaneCharges > 0) {
      amount *= 1 + (this.arcaneCharges * MAGE_CONSTANTS.ARCANE.ARCANE_CHARGE_MANA_COST);
    }

    // Clearcasting은 마나 소비 없음
    if (this.clearcastingActive) {
      this.clearcastingActive = false;
      return true;
    }

    return super.spendMana(amount);
  }
}

// ==================== Fire 마법사 ====================
export class FireMage extends Mage {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'fire';

    // Fire 특수 메커니즘
    this.heatingUp = false;
    this.hotStreak = false;
    this.igniteTargets = new Map();
    this.combustionActive = false;
    this.phoenixFlames = 3;

    this.setupFireAbilities();
  }

  setupFireAbilities() {
    // Fireball
    this.abilities.fireball = new Action({
      name: 'Fireball',
      castTime: 2250,
      manaCost: 0.02,
      execute: () => {
        const damage = this.calculateFireballDamage();
        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.FIRE, 'fireball');

        // Ignite 적용
        if (result.crit) {
          this.applyIgnite(this.target, damage);
          this.checkHotStreak();
        }
      }
    });

    // Pyroblast
    this.abilities.pyroblast = new Action({
      name: 'Pyroblast',
      castTime: 4500,
      manaCost: 0.05,
      execute: () => {
        const damage = this.calculatePyroblastDamage();
        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.FIRE, 'pyroblast');

        // 항상 Ignite
        this.applyIgnite(this.target, damage);

        if (result.crit) {
          this.checkHotStreak();
        }
      }
    });

    // Fire Blast
    this.abilities.fireBlast = new Action({
      name: 'Fire Blast',
      charges: 2,
      chargeCooldown: 12000,
      instantCast: true,
      execute: () => {
        const damage = this.calculateFireBlastDamage();
        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.FIRE, 'fire_blast');

        // Fire Blast는 항상 치명타 (Hot Streak 동안)
        if (this.heatingUp) {
          this.checkHotStreak(true);
        }
      }
    });

    // Combustion
    this.abilities.combustion = new Action({
      name: 'Combustion',
      cooldown: 120000,
      execute: () => {
        this.applyBuff('combustion', {
          duration: MAGE_CONSTANTS.FIRE.COMBUSTION_DURATION,
          critBonus: 1.0, // 100% 치명타
          hastePercent: 50,
          masteryBonus: 0.5
        });

        this.combustionActive = true;

        // Phoenix Flames 충전
        this.phoenixFlames = 3;

        this.sim.scheduleEvent({
          time: this.sim.currentTime + MAGE_CONSTANTS.FIRE.COMBUSTION_DURATION,
          actor: this,
          callback: () => { this.combustionActive = false; }
        });
      }
    });

    // Phoenix Flames
    this.abilities.phoenixFlames = new Action({
      name: 'Phoenix Flames',
      charges: 3,
      chargeCooldown: 25000,
      instantCast: true,
      execute: () => {
        const damage = this.calculatePhoenixFlamesDamage();
        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.FIRE, 'phoenix_flames');

        if (result.crit) {
          this.checkHotStreak();
        }

        // Ignite 스프레드
        this.spreadIgnite();
      }
    });

    // Dragon's Breath
    this.abilities.dragonsBreath = new Action({
      name: "Dragon's Breath",
      cooldown: 20000,
      instantCast: true,
      execute: () => {
        const targets = this.getTargetsInCone(12, 45);
        const damage = this.calculateDragonsBreathDamage();

        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.FIRE, 'dragons_breath');

          // 방향감각 상실
          target.applyDebuff('disoriented', {
            duration: 4000,
            incapacitated: true
          });
        }
      }
    });

    // Living Bomb
    this.abilities.livingBomb = new Action({
      name: 'Living Bomb',
      cooldown: 12000,
      execute: () => {
        this.target.applyDebuff('livingBomb', {
          duration: 12000,
          tickInterval: 3000,
          tickDamage: this.stats.get('spellPower') * 0.2,
          onExpire: () => {
            const explosionDamage = this.stats.get('spellPower') * 0.65;
            const nearbyTargets = this.target.getNearbyTargets(10);

            for (const target of nearbyTargets) {
              this.dealDamage(target, explosionDamage, DAMAGE_TYPE.FIRE, 'living_bomb_explosion');
            }
          }
        });
      }
    });

    // Meteor
    this.abilities.meteor = new Action({
      name: 'Meteor',
      cooldown: 45000,
      execute: () => {
        // 1초 후 낙하
        this.sim.scheduleEvent({
          time: this.sim.currentTime + 1000,
          actor: this,
          callback: () => {
            const damage = this.stats.get('spellPower') * 3.5;
            const targets = this.getTargetsInArea(8);

            for (const target of targets) {
              this.dealDamage(target, damage, DAMAGE_TYPE.FIRE, 'meteor');
              this.applyIgnite(target, damage * 0.5);
            }
          }
        });
      }
    });
  }

  calculateFireballDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 0.9;
  }

  calculatePyroblastDamage() {
    const sp = this.stats.get('spellPower');
    let damage = sp * 2.03;

    // Hot Streak 즉시 시전 시 35% 증가
    if (this.hotStreak) {
      damage *= 1.35;
    }

    return damage;
  }

  calculateFireBlastDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 0.5;
  }

  calculatePhoenixFlamesDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 0.75;
  }

  calculateDragonsBreathDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 0.31;
  }

  checkHotStreak(guaranteed = false) {
    if (this.heatingUp || guaranteed) {
      // Heating Up → Hot Streak
      this.hotStreak = true;
      this.heatingUp = false;

      this.applyBuff('hotStreak', {
        duration: MAGE_CONSTANTS.FIRE.HOT_STREAK_DURATION,
        instantCast: 'pyroblast'
      });
    } else {
      // 첫 치명타 → Heating Up
      this.heatingUp = true;

      this.applyBuff('heatingUp', {
        duration: MAGE_CONSTANTS.FIRE.HEATING_UP_DURATION
      });
    }
  }

  applyIgnite(target, damage) {
    const igniteDamage = damage * 0.3; // 30% over time

    if (this.igniteTargets.has(target)) {
      // 기존 Ignite에 추가
      const existingIgnite = this.igniteTargets.get(target);
      existingIgnite.damage += igniteDamage;
    } else {
      // 새 Ignite
      const ignite = {
        damage: igniteDamage,
        ticks: 9, // 9초간 3초마다
        target: target
      };

      this.igniteTargets.set(target, ignite);
      this.scheduleIgniteTick(target, ignite);
    }
  }

  scheduleIgniteTick(target, ignite) {
    this.sim.scheduleEvent({
      time: this.sim.currentTime + MAGE_CONSTANTS.FIRE.IGNITE_TICK_INTERVAL,
      actor: this,
      callback: () => {
        if (ignite.ticks > 0) {
          const tickDamage = ignite.damage / ignite.ticks;
          this.dealDamage(target, tickDamage, DAMAGE_TYPE.FIRE, 'ignite');

          ignite.ticks--;
          if (ignite.ticks > 0) {
            this.scheduleIgniteTick(target, ignite);
          } else {
            this.igniteTargets.delete(target);
          }
        }
      }
    });
  }

  spreadIgnite() {
    // Ignite 전파
    for (const [target, ignite] of this.igniteTargets) {
      const nearbyTargets = target.getNearbyTargets(MAGE_CONSTANTS.FIRE.IGNITE_SPREAD_RANGE);

      for (const nearbyTarget of nearbyTargets.slice(0, 2)) {
        if (!this.igniteTargets.has(nearbyTarget)) {
          this.applyIgnite(nearbyTarget, ignite.damage * 0.5);
        }
      }
    }
  }

  hasInstantCast(spell) {
    if (this.hotStreak && spell.name === 'Pyroblast') {
      this.hotStreak = false;
      this.removeBuff('hotStreak');
      return true;
    }

    return super.hasInstantCast(spell);
  }
}

// ==================== Frost 마법사 ====================
export class FrostMage extends Mage {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'frost';

    // Frost 특수 메커니즘
    this.fingersOfFrost = 0;
    this.brainFreeze = false;
    this.icicles = [];
    this.winterChill = 0;
    this.frozenOrb = null;

    this.setupFrostAbilities();
  }

  setupFrostAbilities() {
    // Frostbolt
    this.abilities.frostbolt = new Action({
      name: 'Frostbolt',
      castTime: 2000,
      manaCost: 0.02,
      execute: () => {
        const damage = this.calculateFrostboltDamage();
        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.FROST, 'frostbolt');

        // Icicle 생성
        this.createIcicle(damage * MAGE_CONSTANTS.FROST.ICICLE_DAMAGE_PERCENT);

        // Brain Freeze 프록
        if (Math.random() < MAGE_CONSTANTS.FROST.BRAIN_FREEZE_PROC) {
          this.triggerBrainFreeze();
        }

        // 감속
        this.target.applyDebuff('chilled', {
          duration: 8000,
          movementSpeedReduction: 0.5
        });
      }
    });

    // Ice Lance
    this.abilities.iceLance = new Action({
      name: 'Ice Lance',
      instantCast: true,
      manaCost: 0.01,
      execute: () => {
        let damage = this.calculateIceLanceDamage();

        // Shatter 효과 (얼어붙은 대상 3배 데미지)
        if (this.target.debuffs.has('frozen') || this.fingersOfFrost > 0) {
          damage *= 3;

          if (this.fingersOfFrost > 0) {
            this.fingersOfFrost--;
            this.updateFingersOfFrostBuff();
          }
        }

        this.dealDamage(this.target, damage, DAMAGE_TYPE.FROST, 'ice_lance');
      }
    });

    // Flurry
    this.abilities.flurry = new Action({
      name: 'Flurry',
      castTime: 3000,
      manaCost: 0.01,
      execute: () => {
        // 3개의 투사체
        for (let i = 0; i < 3; i++) {
          this.sim.scheduleEvent({
            time: this.sim.currentTime + i * 250,
            actor: this,
            callback: () => {
              const damage = this.calculateFlurryDamage();
              this.dealDamage(this.target, damage, DAMAGE_TYPE.FROST, `flurry_${i+1}`);
            }
          });
        }

        // Winter's Chill 적용
        this.target.applyDebuff('wintersChill', {
          duration: 1000,
          stacks: 2,
          shatterEffect: true
        });
      }
    });

    // Frozen Orb
    this.abilities.frozenOrb = new Action({
      name: 'Frozen Orb',
      cooldown: 60000,
      instantCast: true,
      execute: () => {
        this.launchFrozenOrb();
      }
    });

    // Blizzard
    this.abilities.blizzard = new Action({
      name: 'Blizzard',
      channeled: true,
      duration: 8000,
      manaCost: 0.025,
      execute: () => {
        this.channelBlizzard();
      }
    });

    // Ice Barrier
    this.abilities.iceBarrier = new Action({
      name: 'Ice Barrier',
      cooldown: 25000,
      execute: () => {
        const absorb = this.stats.get('spellPower') * 10;

        this.applyBuff('iceBarrier', {
          duration: 60000,
          absorb: absorb
        });
      }
    });

    // Icy Veins
    this.abilities.icyVeins = new Action({
      name: 'Icy Veins',
      cooldown: 120000,
      execute: () => {
        this.applyBuff('icyVeins', {
          duration: 20000,
          hastePercent: 30,
          cooldownReduction: 0.3
        });
      }
    });

    // Glacial Spike
    this.abilities.glacialSpike = new Action({
      name: 'Glacial Spike',
      castTime: 3000,
      manaCost: 0.01,
      usableIf: () => this.icicles.length >= 5,
      execute: () => {
        const damage = this.calculateGlacialSpikeDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.FROST, 'glacial_spike');

        // 모든 Icicle 발사
        this.launchAllIcicles();

        // 대상 얼리기
        this.target.applyDebuff('frozen', {
          duration: 4000,
          stunned: true
        });
      }
    });

    // Ray of Frost
    this.abilities.rayOfFrost = new Action({
      name: 'Ray of Frost',
      channeled: true,
      duration: 5000,
      manaCost: 0.02,
      execute: () => {
        this.channelRayOfFrost();
      }
    });
  }

  calculateFrostboltDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 0.81;
  }

  calculateIceLanceDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 0.24;
  }

  calculateFlurryDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 0.32;
  }

  calculateGlacialSpikeDamage() {
    const sp = this.stats.get('spellPower');
    let damage = sp * 2.97;

    // Icicle 보너스
    damage += this.icicles.reduce((sum, icicle) => sum + icicle.damage, 0);

    return damage;
  }

  createIcicle(damage) {
    if (this.icicles.length >= MAGE_CONSTANTS.FROST.ICICLE_MAX) {
      // 가장 오래된 Icicle 발사
      const oldIcicle = this.icicles.shift();
      this.launchIcicle(oldIcicle);
    }

    this.icicles.push({
      damage: damage,
      createdAt: this.sim.currentTime
    });
  }

  launchIcicle(icicle) {
    this.dealDamage(this.target, icicle.damage, DAMAGE_TYPE.FROST, 'icicle');
  }

  launchAllIcicles() {
    for (const icicle of this.icicles) {
      this.launchIcicle(icicle);
    }
    this.icicles = [];
  }

  launchFrozenOrb() {
    const orbDuration = MAGE_CONSTANTS.FROST.FROZEN_ORB_DURATION;
    const tickInterval = 500;
    let ticks = orbDuration / tickInterval;

    const orbTick = () => {
      if (ticks <= 0) return;

      const nearbyTargets = this.getTargetsInArea(10);
      const damage = this.stats.get('spellPower') * 0.15;

      for (const target of nearbyTargets) {
        this.dealDamage(target, damage, DAMAGE_TYPE.FROST, 'frozen_orb');

        // Fingers of Frost 부여
        if (Math.random() < 0.1) {
          this.grantFingersOfFrost();
        }
      }

      ticks--;
      if (ticks > 0) {
        this.sim.scheduleEvent({
          time: this.sim.currentTime + tickInterval,
          actor: this,
          callback: orbTick
        });
      }
    };

    orbTick();
  }

  channelBlizzard() {
    const waves = 8;
    const waveInterval = 1000;

    for (let i = 0; i < waves; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * waveInterval,
        actor: this,
        callback: () => {
          const targets = this.getTargetsInArea(8);
          const damage = this.stats.get('spellPower') * 0.2;

          for (const target of targets) {
            this.dealDamage(target, damage, DAMAGE_TYPE.FROST, `blizzard_${i+1}`);

            // 감속
            target.applyDebuff('chilled', {
              duration: 1000,
              movementSpeedReduction: 0.5
            });
          }
        }
      });
    }
  }

  channelRayOfFrost() {
    const ticks = 10;
    const tickInterval = 500;

    let currentTick = 0;

    const rayTick = () => {
      if (currentTick >= ticks) return;

      const damage = this.stats.get('spellPower') * 0.24;
      let multiplier = 1 + currentTick * 0.1; // 틱마다 10% 증가

      this.dealDamage(this.target, damage * multiplier, DAMAGE_TYPE.FROST, `ray_of_frost_${currentTick+1}`);

      // 감속 증가
      this.target.applyDebuff('rayOfFrostSlow', {
        duration: 1000,
        movementSpeedReduction: 0.1 * currentTick,
        maxStacks: 10
      });

      currentTick++;
      if (currentTick < ticks) {
        this.sim.scheduleEvent({
          time: this.sim.currentTime + tickInterval,
          actor: this,
          callback: rayTick
        });
      }
    };

    rayTick();
  }

  grantFingersOfFrost() {
    this.fingersOfFrost = Math.min(
      this.fingersOfFrost + 1,
      MAGE_CONSTANTS.FROST.FINGERS_OF_FROST_CHARGES
    );

    this.updateFingersOfFrostBuff();
  }

  updateFingersOfFrostBuff() {
    if (this.fingersOfFrost > 0) {
      this.applyBuff('fingersOfFrost', {
        duration: 15000,
        charges: this.fingersOfFrost,
        shatterEffect: true
      });
    } else {
      this.removeBuff('fingersOfFrost');
    }
  }

  triggerBrainFreeze() {
    this.brainFreeze = true;

    this.applyBuff('brainFreeze', {
      duration: 15000,
      instantCast: 'flurry'
    });
  }

  hasInstantCast(spell) {
    if (this.brainFreeze && spell.name === 'Flurry') {
      this.brainFreeze = false;
      this.removeBuff('brainFreeze');
      return true;
    }

    return super.hasInstantCast(spell);
  }
}

// ==================== Export ====================
export default Mage;