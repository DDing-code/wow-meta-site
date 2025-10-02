/**
 * Phase 3.3: Rogue Class Implementation
 * 도적 클래스 - Assassination, Outlaw, Subtlety
 * Lines: ~1,200
 */

import { Player } from '../Player.js';
import { Action } from '../Action.js';
import { Buff } from '../Buff.js';
import { RESOURCE_TYPE } from '../Actor.js';
import { DAMAGE_TYPE } from '../core/DamageCalculator.js';

// ==================== 도적 상수 ====================
export const ROGUE_CONSTANTS = {
  // 기력 & 연계 점수
  ENERGY_REGEN: {
    BASE: 10, // 초당
    HASTE_SCALING: true,
    COMBAT_POTENCY_PROC: 0.6
  },

  COMBO_POINTS: {
    MAX: 5,
    MAX_WITH_DEEPER: 6,
    ANIMOSITY_MAX: 7
  },

  // 스펙별 특수 메커니즘
  ASSASSINATION: {
    POISON_PROC_CHANCE: 0.3,
    VENOMOUS_WOUNDS_ENERGY: 7,
    RUPTURE_DURATION: 24000,
    GARROTE_DURATION: 18000,
    ENVENOM_BUFF_DURATION: 1000 // 연계당
  },

  OUTLAW: {
    ROLL_THE_BONES_BUFFS: 6,
    BLADE_FLURRY_TARGETS: 4,
    BETWEEN_THE_EYES_STUN: 6000,
    RESTLESS_BLADES_CDR: 1000 // 연계당
  },

  SUBTLETY: {
    SHADOW_DANCE_DURATION: 6000,
    SYMBOLS_DURATION: 10000,
    SHURIKEN_STORM_COMBO: 1,
    SHADOWSTRIKE_TELEPORT: true,
    FIND_WEAKNESS_DURATION: 18000
  }
};

// ==================== 도적 기본 클래스 ====================
export class Rogue extends Player {
  constructor(sim, name) {
    super(sim, name);

    this.class = 'rogue';
    this.resources.base[RESOURCE_TYPE.ENERGY] = 100;
    this.resources.max[RESOURCE_TYPE.ENERGY] = 100;
    this.resources.current[RESOURCE_TYPE.ENERGY] = 100;
    this.resources.base[RESOURCE_TYPE.COMBO_POINTS] = 0;
    this.resources.max[RESOURCE_TYPE.COMBO_POINTS] = ROGUE_CONSTANTS.COMBO_POINTS.MAX;
    this.resources.current[RESOURCE_TYPE.COMBO_POINTS] = 0;

    // 도적 특성
    this.canBlock = false;
    this.canParry = true;
    this.canDodge = true;
    this.isDualWielding = true;

    // 스텔스
    this.isStealthed = false;
    this.stealthBreakTime = 0;

    // 독
    this.lethalPoison = null;
    this.nonLethalPoison = null;

    this.setupCommonAbilities();
  }

  // ==================== 기력 관리 ====================
  regenerateEnergy() {
    let regenRate = ROGUE_CONSTANTS.ENERGY_REGEN.BASE;

    // 가속 영향
    if (ROGUE_CONSTANTS.ENERGY_REGEN.HASTE_SCALING) {
      const haste = this.getHaste();
      regenRate *= 1 + haste / 100;
    }

    // 버프 영향
    if (this.buffs.has('adrenalineRush')) {
      regenRate *= 2;
    }

    const regenAmount = regenRate / 10; // 0.1초당 틱
    this.grantResource(RESOURCE_TYPE.ENERGY, regenAmount, 'energy_regen');
  }

  spendEnergy(amount) {
    if (this.resources.current[RESOURCE_TYPE.ENERGY] < amount) {
      return false;
    }

    this.resources.current[RESOURCE_TYPE.ENERGY] -= amount;

    // Relentless Strikes (특성)
    if (this.talents.relentlessStrikes && Math.random() < 0.2) {
      this.grantResource(RESOURCE_TYPE.ENERGY, 25, 'relentless_strikes');
    }

    return true;
  }

  // ==================== 연계 점수 ====================
  generateComboPoints(amount, source = 'unknown') {
    const maxCP = this.getMaxComboPoints();
    const before = this.resources.current[RESOURCE_TYPE.COMBO_POINTS];

    this.resources.current[RESOURCE_TYPE.COMBO_POINTS] = Math.min(
      before + amount,
      maxCP
    );

    const gained = this.resources.current[RESOURCE_TYPE.COMBO_POINTS] - before;

    // Seal Fate (특성)
    if (this.talents.sealFate && source.includes('crit')) {
      this.generateComboPoints(1, 'seal_fate');
    }

    return gained;
  }

  spendComboPoints() {
    const points = this.resources.current[RESOURCE_TYPE.COMBO_POINTS];
    this.resources.current[RESOURCE_TYPE.COMBO_POINTS] = 0;
    return points;
  }

  getMaxComboPoints() {
    let max = ROGUE_CONSTANTS.COMBO_POINTS.MAX;

    if (this.talents.deeperStratagem) {
      max = ROGUE_CONSTANTS.COMBO_POINTS.MAX_WITH_DEEPER;
    }

    if (this.talents.animosity) {
      max = ROGUE_CONSTANTS.COMBO_POINTS.ANIMOSITY_MAX;
    }

    return max;
  }

  // ==================== 스텔스 시스템 ====================
  enterStealth(duration = 10000) {
    this.isStealthed = true;
    this.stealthBreakTime = this.sim.currentTime + duration;

    this.applyBuff('stealth', {
      duration: duration,
      damageMultiplier: 1.1,
      critBonus: 0.1
    });

    // 위협 수준 초기화
    this.clearThreat();
  }

  breakStealth() {
    this.isStealthed = false;
    this.removeBuff('stealth');

    // Master of Subtlety (특성)
    if (this.talents.masterOfSubtlety) {
      this.applyBuff('masterOfSubtlety', {
        duration: 6000,
        damageMultiplier: 1.1
      });
    }
  }

  // ==================== 독 시스템 ====================
  applyPoison(type, poison) {
    if (type === 'lethal') {
      this.lethalPoison = poison;
    } else {
      this.nonLethalPoison = poison;
    }
  }

  procPoison(hand) {
    if (Math.random() > ROGUE_CONSTANTS.ASSASSINATION.POISON_PROC_CHANCE) {
      return;
    }

    const poison = hand === 'mainhand' ? this.lethalPoison : this.nonLethalPoison;
    if (!poison) return;

    switch (poison) {
      case 'deadly':
        this.applyDeadlyPoison(this.target);
        break;
      case 'wound':
        this.applyWoundPoison(this.target);
        break;
      case 'crippling':
        this.applyCripplingPoison(this.target);
        break;
      case 'numbing':
        this.applyNumbingPoison(this.target);
        break;
    }
  }

  applyDeadlyPoison(target) {
    target.applyDebuff('deadlyPoison', {
      duration: 12000,
      tickInterval: 3000,
      tickDamage: this.stats.get('attackPower') * 0.18,
      maxStacks: 5,
      pandemic: true
    });

    // Assassination: Venomous Wounds
    if (this.spec === 'assassination' && this.talents.venomousWounds) {
      this.grantResource(RESOURCE_TYPE.ENERGY, ROGUE_CONSTANTS.ASSASSINATION.VENOMOUS_WOUNDS_ENERGY, 'venomous_wounds');
    }
  }

  applyWoundPoison(target) {
    target.applyDebuff('woundPoison', {
      duration: 12000,
      healingReduction: 0.3,
      maxStacks: 2
    });
  }

  applyCripplingPoison(target) {
    target.applyDebuff('cripplingPoison', {
      duration: 12000,
      movementSpeedReduction: 0.5
    });
  }

  applyNumbingPoison(target) {
    target.applyDebuff('numbingPoison', {
      duration: 12000,
      attackSpeedReduction: 0.15,
      castTimeIncrease: 0.15
    });
  }

  // ==================== 공통 스킬 ====================
  setupCommonAbilities() {
    // Stealth
    this.abilities.stealth = new Action({
      name: 'Stealth',
      cooldown: 2000,
      usableIf: () => !this.isInCombat(),
      execute: () => {
        this.enterStealth();
      }
    });

    // Vanish
    this.abilities.vanish = new Action({
      name: 'Vanish',
      cooldown: 120000,
      execute: () => {
        this.enterStealth(3000);
        this.removeThreat();
        this.removeDebuffs();
      }
    });

    // Kick
    this.abilities.kick = new Action({
      name: 'Kick',
      cooldown: 15000,
      energyCost: 15,
      execute: () => {
        if (this.target.currentCast) {
          this.target.interruptCast();
          this.target.applyDebuff('kicked', {
            duration: 3000,
            silenced: true
          });
        }
      }
    });

    // Sprint
    this.abilities.sprint = new Action({
      name: 'Sprint',
      cooldown: 60000,
      execute: () => {
        this.applyBuff('sprint', {
          duration: 8000,
          movementSpeed: 1.7,
          removeSnares: true
        });
      }
    });

    // Evasion
    this.abilities.evasion = new Action({
      name: 'Evasion',
      cooldown: 120000,
      execute: () => {
        this.applyBuff('evasion', {
          duration: 10000,
          dodgeBonus: 1.0, // 100% 회피
          immuneToAoE: true
        });
      }
    });

    // Cloak of Shadows
    this.abilities.cloakOfShadows = new Action({
      name: 'Cloak of Shadows',
      cooldown: 120000,
      execute: () => {
        this.removeDebuffs('magic');
        this.applyBuff('cloakOfShadows', {
          duration: 5000,
          magicImmune: true
        });
      }
    });

    // Crimson Vial
    this.abilities.crimsonVial = new Action({
      name: 'Crimson Vial',
      cooldown: 30000,
      energyCost: 20,
      execute: () => {
        const healAmount = this.resources.max.health * 0.3;
        this.applyBuff('crimsonVial', {
          duration: 6000,
          tickInterval: 1000,
          tickHealing: healAmount / 6
        });
      }
    });
  }

  // ==================== 자동 공격 ====================
  setupAutoAttack() {
    // 양손 무기
    this.scheduleAutoAttack('mainhand');
    this.scheduleAutoAttack('offhand');
  }

  onAutoAttack(hand) {
    // 독 발동
    this.procPoison(hand);

    // Combat Potency (Outlaw)
    if (this.spec === 'outlaw' && hand === 'offhand') {
      if (Math.random() < ROGUE_CONSTANTS.ENERGY_REGEN.COMBAT_POTENCY_PROC) {
        this.grantResource(RESOURCE_TYPE.ENERGY, 15, 'combat_potency');
      }
    }
  }
}

// ==================== Assassination 도적 ====================
export class AssassinationRogue extends Rogue {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'assassination';

    // 독 설정
    this.lethalPoison = 'deadly';
    this.nonLethalPoison = 'crippling';

    // Assassination 특수 메커니즘
    this.elaboratePlanning = 0;
    this.crimsonTempestTargets = new Set();

    this.setupAssassinationAbilities();
  }

  setupAssassinationAbilities() {
    // Mutilate
    this.abilities.mutilate = new Action({
      name: 'Mutilate',
      energyCost: 50,
      execute: () => {
        // 양손 공격
        const mainDamage = this.calculateMutilateDamage('mainhand');
        const offDamage = this.calculateMutilateDamage('offhand');

        const mainResult = this.dealDamage(this.target, mainDamage, DAMAGE_TYPE.PHYSICAL, 'mutilate_main');
        const offResult = this.dealDamage(this.target, offDamage, DAMAGE_TYPE.PHYSICAL, 'mutilate_off');

        // 연계 점수 생성
        let cp = 2;
        if (mainResult.crit || offResult.crit) {
          cp++;
        }
        this.generateComboPoints(cp, 'mutilate');

        // 독 발동 기회 증가
        this.procPoison('mainhand');
        this.procPoison('offhand');
      }
    });

    // Envenom
    this.abilities.envenom = new Action({
      name: 'Envenom',
      energyCost: 35,
      usableIf: () => this.resources.current[RESOURCE_TYPE.COMBO_POINTS] > 0,
      execute: () => {
        const cp = this.spendComboPoints();
        const damage = this.calculateEnvenomDamage(cp);

        this.dealDamage(this.target, damage, DAMAGE_TYPE.NATURE, 'envenom');

        // Envenom 버프
        const duration = ROGUE_CONSTANTS.ASSASSINATION.ENVENOM_BUFF_DURATION * cp;
        this.applyBuff('envenom', {
          duration: duration,
          poisonProcChance: 0.3,
          critBonus: 0.05 * cp
        });

        // Cut to the Chase (특성)
        if (this.talents.cutToTheChase) {
          this.refreshSliceAndDice();
        }
      }
    });

    // Rupture
    this.abilities.rupture = new Action({
      name: 'Rupture',
      energyCost: 25,
      usableIf: () => this.resources.current[RESOURCE_TYPE.COMBO_POINTS] > 0,
      execute: () => {
        const cp = this.spendComboPoints();
        const duration = 4000 + (cp * 4000); // 4초 + 연계당 4초

        this.target.applyDebuff('rupture', {
          duration: duration,
          tickInterval: 2000,
          tickDamage: this.stats.get('attackPower') * 0.25 * cp,
          pandemic: true,
          bleed: true
        });

        // Venomous Wounds
        if (this.talents.venomousWounds) {
          this.applyVenomousWounds(this.target);
        }
      }
    });

    // Garrote
    this.abilities.garrote = new Action({
      name: 'Garrote',
      energyCost: 45,
      usableIf: () => this.isStealthed || this.buffs.has('shadowDance'),
      execute: () => {
        const damage = this.calculateGarroteDamage();

        // 즉시 데미지
        this.dealDamage(this.target, damage * 0.2, DAMAGE_TYPE.PHYSICAL, 'garrote_initial');

        // DoT
        this.target.applyDebuff('garrote', {
          duration: ROGUE_CONSTANTS.ASSASSINATION.GARROTE_DURATION,
          tickInterval: 2000,
          tickDamage: damage * 0.1,
          pandemic: true,
          bleed: true,
          silenced: true // 첫 3초
        });

        this.generateComboPoints(1, 'garrote');
        this.breakStealth();
      }
    });

    // Vendetta
    this.abilities.vendetta = new Action({
      name: 'Vendetta',
      cooldown: 120000,
      execute: () => {
        this.target.applyDebuff('vendetta', {
          duration: 20000,
          damageIncrease: 0.3
        });

        this.applyBuff('vendetta', {
          duration: 20000,
          energyRegenBonus: 5
        });
      }
    });

    // Toxic Blade
    this.abilities.toxicBlade = new Action({
      name: 'Toxic Blade',
      cooldown: 25000,
      energyCost: 20,
      execute: () => {
        const damage = this.calculateToxicBladeDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.NATURE, 'toxic_blade');

        this.target.applyDebuff('toxicBlade', {
          duration: 9000,
          natureDamageIncrease: 0.3,
          poisonDamageMultiplier: 1.35
        });

        this.generateComboPoints(1, 'toxic_blade');
      }
    });

    // Crimson Tempest
    this.abilities.crimsonTempest = new Action({
      name: 'Crimson Tempest',
      energyCost: 35,
      usableIf: () => this.resources.current[RESOURCE_TYPE.COMBO_POINTS] > 0,
      execute: () => {
        const cp = this.spendComboPoints();
        const targets = this.getNearbyTargets(8);
        const damage = this.calculateCrimsonTempestDamage(cp);

        for (const target of targets) {
          // 즉시 데미지
          this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL, 'crimson_tempest');

          // DoT
          target.applyDebuff('crimsonTempest', {
            duration: 2000 + (cp * 2000),
            tickInterval: 2000,
            tickDamage: damage * 0.15,
            pandemic: true,
            bleed: true
          });

          this.crimsonTempestTargets.add(target);
        }
      }
    });

    // Exsanguinate
    this.abilities.exsanguinate = new Action({
      name: 'Exsanguinate',
      cooldown: 45000,
      energyCost: 25,
      execute: () => {
        // 모든 출혈 DoT 가속
        const bleeds = ['rupture', 'garrote', 'crimsonTempest'];

        for (const bleed of bleeds) {
          if (this.target.debuffs.has(bleed)) {
            const debuff = this.target.debuffs.get(bleed);
            debuff.tickInterval *= 0.5; // 2배 빠르게
            debuff.duration *= 0.5;
          }
        }
      }
    });
  }

  calculateMutilateDamage(hand) {
    const weapon = hand === 'offhand' ? this.gear.offHand : this.gear.mainHand;
    const weaponDamage = (weapon.minDamage + weapon.maxDamage) / 2;
    const ap = this.stats.get('attackPower');

    let damage = weaponDamage + (ap * 0.35);

    if (hand === 'offhand') {
      damage *= 0.5;
    }

    return damage;
  }

  calculateEnvenomDamage(cp) {
    const ap = this.stats.get('attackPower');
    return ap * 0.18 * cp;
  }

  calculateGarroteDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 0.7;

    // Subterfuge 보너스
    if (this.talents.subterfuge) {
      damage *= 1.25;
    }

    return damage;
  }

  calculateToxicBladeDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.5;
  }

  calculateCrimsonTempestDamage(cp) {
    const ap = this.stats.get('attackPower');
    return ap * 0.08 * cp;
  }

  applyVenomousWounds(target) {
    // 출혈 틱마다 에너지 회복
    this.sim.registerTickCallback(target, 'rupture', () => {
      this.grantResource(RESOURCE_TYPE.ENERGY, ROGUE_CONSTANTS.ASSASSINATION.VENOMOUS_WOUNDS_ENERGY, 'venomous_wounds');
    });
  }

  refreshSliceAndDice() {
    if (this.buffs.has('sliceAndDice')) {
      const buff = this.buffs.get('sliceAndDice');
      buff.duration = Math.min(buff.duration + 6000, 48000); // 최대 48초
    }
  }
}

// ==================== Outlaw 도적 ====================
export class OutlawRogue extends Rogue {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'outlaw';

    // Outlaw 특수 메커니즘
    this.rollTheBonesBuffs = new Set();
    this.bladeFlurryActive = false;
    this.loadedDice = false;
    this.betweenTheEyesCrit = false;

    this.setupOutlawAbilities();
  }

  setupOutlawAbilities() {
    // Sinister Strike
    this.abilities.sinisterStrike = new Action({
      name: 'Sinister Strike',
      energyCost: 45,
      execute: () => {
        const damage = this.calculateSinisterStrikeDamage();
        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'sinister_strike');

        let cp = 1;
        if (Math.random() < 0.35) { // 35% 확률로 추가 연계
          cp++;
        }
        this.generateComboPoints(cp, 'sinister_strike');

        // Opportunity 프록
        if (this.talents.opportunity && result.crit) {
          this.abilities.pistolShot.energyCost = 0;
        }
      }
    });

    // Dispatch
    this.abilities.dispatch = new Action({
      name: 'Dispatch',
      energyCost: 35,
      usableIf: () => this.resources.current[RESOURCE_TYPE.COMBO_POINTS] >= 5,
      execute: () => {
        const cp = this.spendComboPoints();
        const damage = this.calculateDispatchDamage(cp);

        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'dispatch');

        // Restless Blades
        if (this.talents.restlessBlades) {
          this.reduceCooldowns(cp * ROGUE_CONSTANTS.OUTLAW.RESTLESS_BLADES_CDR);
        }
      }
    });

    // Pistol Shot
    this.abilities.pistolShot = new Action({
      name: 'Pistol Shot',
      energyCost: 40,
      range: 20,
      execute: () => {
        const damage = this.calculatePistolShotDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'pistol_shot');

        this.generateComboPoints(1, 'pistol_shot');

        // 감속
        this.target.applyDebuff('pistolShot', {
          duration: 6000,
          movementSpeedReduction: 0.3
        });
      }
    });

    // Between the Eyes
    this.abilities.betweenTheEyes = new Action({
      name: 'Between the Eyes',
      energyCost: 25,
      usableIf: () => this.resources.current[RESOURCE_TYPE.COMBO_POINTS] >= 5,
      execute: () => {
        const cp = this.spendComboPoints();
        const damage = this.calculateBetweenTheEyesDamage(cp);
        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'between_the_eyes');

        // 스턴
        const stunDuration = result.crit ? ROGUE_CONSTANTS.OUTLAW.BETWEEN_THE_EYES_STUN : 3000;
        this.target.applyDebuff('betweenTheEyes', {
          duration: stunDuration,
          stunned: true
        });

        // Restless Blades
        if (this.talents.restlessBlades) {
          this.reduceCooldowns(cp * ROGUE_CONSTANTS.OUTLAW.RESTLESS_BLADES_CDR);
        }
      }
    });

    // Roll the Bones
    this.abilities.rollTheBones = new Action({
      name: 'Roll the Bones',
      energyCost: 25,
      usableIf: () => this.resources.current[RESOURCE_TYPE.COMBO_POINTS] >= 5,
      execute: () => {
        const cp = this.spendComboPoints();
        this.rollForBuffs();

        // Restless Blades
        if (this.talents.restlessBlades) {
          this.reduceCooldowns(cp * ROGUE_CONSTANTS.OUTLAW.RESTLESS_BLADES_CDR);
        }
      }
    });

    // Blade Flurry
    this.abilities.bladeFlurry = new Action({
      name: 'Blade Flurry',
      cooldown: 30000,
      charges: 2,
      energyCost: 15,
      execute: () => {
        this.bladeFlurryActive = !this.bladeFlurryActive;

        if (this.bladeFlurryActive) {
          this.applyBuff('bladeFlurry', {
            duration: 999999,
            cleaveTargets: ROGUE_CONSTANTS.OUTLAW.BLADE_FLURRY_TARGETS,
            cleavePercent: 0.45
          });
        } else {
          this.removeBuff('bladeFlurry');
        }
      }
    });

    // Adrenaline Rush
    this.abilities.adrenalineRush = new Action({
      name: 'Adrenaline Rush',
      cooldown: 180000,
      execute: () => {
        this.applyBuff('adrenalineRush', {
          duration: 20000,
          energyRegenMultiplier: 2,
          attackSpeedBonus: 0.2,
          maxEnergyBonus: 50
        });

        this.resources.max[RESOURCE_TYPE.ENERGY] += 50;
        this.grantResource(RESOURCE_TYPE.ENERGY, 50, 'adrenaline_rush');
      }
    });

    // Blade Rush
    this.abilities.bladeRush = new Action({
      name: 'Blade Rush',
      cooldown: 45000,
      energyCost: 30,
      execute: () => {
        const damage = this.calculateBladeRushDamage();

        // 돌진하며 데미지
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'blade_rush');

        // 주변 적들에게도 데미지
        const nearbyTargets = this.getNearbyTargets(5);
        for (const target of nearbyTargets.slice(1, 5)) {
          this.dealDamage(target, damage * 0.5, DAMAGE_TYPE.PHYSICAL, 'blade_rush_cleave');
        }

        this.generateComboPoints(2, 'blade_rush');
      }
    });

    // Ghostly Strike
    this.abilities.ghostlyStrike = new Action({
      name: 'Ghostly Strike',
      cooldown: 35000,
      energyCost: 30,
      execute: () => {
        const damage = this.calculateGhostlyStrikeDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'ghostly_strike');

        this.target.applyDebuff('ghostlyStrike', {
          duration: 10000,
          damageIncrease: 0.1,
          missChance: 0.1
        });

        this.generateComboPoints(1, 'ghostly_strike');
      }
    });
  }

  calculateSinisterStrikeDamage() {
    const ap = this.stats.get('attackPower');
    const mainHand = this.gear.mainHand;
    const weaponDamage = (mainHand.minDamage + mainHand.maxDamage) / 2;

    return weaponDamage + (ap * 0.35);
  }

  calculateDispatchDamage(cp) {
    const ap = this.stats.get('attackPower');
    return ap * 0.2 * cp;
  }

  calculatePistolShotDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.31;
  }

  calculateBetweenTheEyesDamage(cp) {
    const ap = this.stats.get('attackPower');
    return ap * 0.35 * cp;
  }

  calculateBladeRushDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 1.42;
  }

  calculateGhostlyStrikeDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.5;
  }

  rollForBuffs() {
    const possibleBuffs = [
      'broadside',      // 연계 점수 생성 증가
      'buriedTreasure', // 기력 회복 증가
      'grandMelee',     // 공격 속도 & 생기 흡수
      'ruthlessPrecision', // 치명타 증가
      'skullAndCrossbones', // 가속 증가
      'trueBearing'     // 쿨다운 감소
    ];

    // 기존 버프 제거
    for (const buff of this.rollTheBonesBuffs) {
      this.removeBuff(buff);
    }
    this.rollTheBonesBuffs.clear();

    // 새 버프 결정
    let numBuffs = this.loadedDice ? 2 : 1;

    // Count the Cost (특성)
    if (this.talents.countTheCost && Math.random() < 0.2) {
      numBuffs = 5; // 20% 확률로 5개
    }

    const selectedBuffs = [];
    while (selectedBuffs.length < numBuffs) {
      const buff = possibleBuffs[Math.floor(Math.random() * possibleBuffs.length)];
      if (!selectedBuffs.includes(buff)) {
        selectedBuffs.push(buff);
      }
    }

    // 버프 적용
    for (const buff of selectedBuffs) {
      this.applyRollTheBonesBuff(buff);
      this.rollTheBonesBuffs.add(buff);
    }
  }

  applyRollTheBonesBuff(buff) {
    const duration = 30000;

    switch (buff) {
      case 'broadside':
        this.applyBuff('broadside', {
          duration: duration,
          comboPointChance: 0.2
        });
        break;
      case 'buriedTreasure':
        this.applyBuff('buriedTreasure', {
          duration: duration,
          energyRegenBonus: 4
        });
        break;
      case 'grandMelee':
        this.applyBuff('grandMelee', {
          duration: duration,
          attackSpeedBonus: 0.5,
          leech: 0.25
        });
        break;
      case 'ruthlessPrecision':
        this.applyBuff('ruthlessPrecision', {
          duration: duration,
          critBonus: 0.6
        });
        break;
      case 'skullAndCrossbones':
        this.applyBuff('skullAndCrossbones', {
          duration: duration,
          hasteBonus: 0.25
        });
        break;
      case 'trueBearing':
        this.applyBuff('trueBearing', {
          duration: duration,
          cooldownReduction: 0.35
        });
        break;
    }
  }

  reduceCooldowns(amount) {
    for (const ability of Object.values(this.abilities)) {
      if (ability.cooldown) {
        ability.cooldown.reduce(amount);
      }
    }
  }
}

// ==================== Subtlety 도적 ====================
export class SubtletyRogue extends Rogue {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'subtlety';

    // Subtlety 특수 메커니즘
    this.shadowDanceCharges = 2;
    this.symbolsOfDeath = false;
    this.findWeaknessTargets = new Map();
    this.shadowTechniques = 0;

    this.setupSubtletyAbilities();
  }

  setupSubtletyAbilities() {
    // Shadowstrike
    this.abilities.shadowstrike = new Action({
      name: 'Shadowstrike',
      energyCost: 40,
      usableIf: () => this.isStealthed || this.buffs.has('shadowDance'),
      execute: () => {
        // 순간이동
        if (ROGUE_CONSTANTS.SUBTLETY.SHADOWSTRIKE_TELEPORT) {
          this.teleportBehindTarget();
        }

        const damage = this.calculateShadowstrikeDamage();
        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'shadowstrike');

        this.generateComboPoints(2, 'shadowstrike');

        // Find Weakness 적용
        if (!this.findWeaknessTargets.has(this.target)) {
          this.applyFindWeakness(this.target);
        }

        if (this.isStealthed) {
          this.breakStealth();
        }
      }
    });

    // Backstab
    this.abilities.backstab = new Action({
      name: 'Backstab',
      energyCost: 35,
      execute: () => {
        const damage = this.calculateBackstabDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'backstab');

        this.generateComboPoints(1, 'backstab');

        // Shadow Techniques
        this.shadowTechniques++;
        if (this.shadowTechniques >= 3) {
          this.generateComboPoints(1, 'shadow_techniques');
          this.shadowTechniques = 0;
        }
      }
    });

    // Eviscerate
    this.abilities.eviscerate = new Action({
      name: 'Eviscerate',
      energyCost: 35,
      usableIf: () => this.resources.current[RESOURCE_TYPE.COMBO_POINTS] > 0,
      execute: () => {
        const cp = this.spendComboPoints();
        const damage = this.calculateEviscerateDamage(cp);

        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'eviscerate');

        // Shadow Vault (특성)
        if (this.talents.shadowVault && cp >= 5) {
          this.grantResource(RESOURCE_TYPE.ENERGY, 30, 'shadow_vault');
        }
      }
    });

    // Shadow Dance
    this.abilities.shadowDance = new Action({
      name: 'Shadow Dance',
      charges: 2,
      chargeCooldown: 60000,
      execute: () => {
        this.applyBuff('shadowDance', {
          duration: ROGUE_CONSTANTS.SUBTLETY.SHADOW_DANCE_DURATION,
          damageMultiplier: 1.15,
          critBonus: 0.15,
          allowStealthAbilities: true
        });

        // Master of Shadows (특성)
        if (this.talents.masterOfShadows) {
          this.grantResource(RESOURCE_TYPE.ENERGY, 25, 'master_of_shadows');
        }
      }
    });

    // Symbols of Death
    this.abilities.symbolsOfDeath = new Action({
      name: 'Symbols of Death',
      cooldown: 30000,
      execute: () => {
        this.applyBuff('symbolsOfDeath', {
          duration: ROGUE_CONSTANTS.SUBTLETY.SYMBOLS_DURATION,
          damageMultiplier: 1.15,
          critBonus: 0.15
        });

        this.symbolsOfDeath = true;
        this.grantResource(RESOURCE_TYPE.ENERGY, 40, 'symbols_of_death');
      }
    });

    // Shadow Blades
    this.abilities.shadowBlades = new Action({
      name: 'Shadow Blades',
      cooldown: 180000,
      execute: () => {
        this.applyBuff('shadowBlades', {
          duration: 20000,
          shadowDamageBonus: 0.5,
          comboPointGeneration: 1 // 추가 연계 점수
        });
      }
    });

    // Shuriken Storm
    this.abilities.shurikenStorm = new Action({
      name: 'Shuriken Storm',
      energyCost: 35,
      execute: () => {
        const targets = this.getNearbyTargets(10);
        const damage = this.calculateShurikenStormDamage();

        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL, 'shuriken_storm');
        }

        // 타겟당 1 연계 점수
        const cp = Math.min(targets.length, this.getMaxComboPoints());
        this.generateComboPoints(cp, 'shuriken_storm');
      }
    });

    // Secret Technique
    this.abilities.secretTechnique = new Action({
      name: 'Secret Technique',
      cooldown: 60000,
      energyCost: 30,
      usableIf: () => this.resources.current[RESOURCE_TYPE.COMBO_POINTS] >= 5,
      execute: () => {
        const cp = this.spendComboPoints();
        const damage = this.calculateSecretTechniqueDamage(cp);

        // 그림자 분신 소환
        for (let i = 0; i < cp; i++) {
          this.sim.scheduleEvent({
            time: this.sim.currentTime + i * 200,
            actor: this,
            callback: () => {
              const targets = this.getNearbyTargets(10);
              for (const target of targets.slice(0, 5)) {
                this.dealDamage(target, damage / cp, DAMAGE_TYPE.SHADOW, 'secret_technique');
              }
            }
          });
        }
      }
    });

    // Shuriken Tornado
    this.abilities.shurikenTornado = new Action({
      name: 'Shuriken Tornado',
      cooldown: 60000,
      energyCost: 60,
      execute: () => {
        // 10초간 표창 회오리
        const duration = 10000;
        const tickInterval = 1000;

        for (let i = 0; i < duration / tickInterval; i++) {
          this.sim.scheduleEvent({
            time: this.sim.currentTime + i * tickInterval,
            actor: this,
            callback: () => {
              const targets = this.getNearbyTargets(10);
              const damage = this.stats.get('attackPower') * 0.15;

              for (const target of targets) {
                this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL, 'shuriken_tornado');
              }
            }
          });
        }

        this.applyBuff('shurikenTornado', {
          duration: duration,
          comboPointGeneration: 1 // 초당 1 연계
        });
      }
    });
  }

  calculateShadowstrikeDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 1.1;
  }

  calculateBackstabDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 0.5;

    // 뒤에서 공격 시 보너스
    if (this.isBehindTarget()) {
      damage *= 1.3;
    }

    return damage;
  }

  calculateEviscerateDamage(cp) {
    const ap = this.stats.get('attackPower');
    let damage = ap * 0.176 * cp;

    // Shadow Dance/Stealth 보너스
    if (this.buffs.has('shadowDance') || this.isStealthed) {
      damage *= 1.2;
    }

    return damage;
  }

  calculateShurikenStormDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.14;
  }

  calculateSecretTechniqueDamage(cp) {
    const ap = this.stats.get('attackPower');
    return ap * 0.5 * cp;
  }

  teleportBehindTarget() {
    // 대상 뒤로 순간이동
    this.position = {
      behind: this.target.id,
      distance: 0
    };
  }

  isBehindTarget() {
    return this.position && this.position.behind === this.target.id;
  }

  applyFindWeakness(target) {
    target.applyDebuff('findWeakness', {
      duration: ROGUE_CONSTANTS.SUBTLETY.FIND_WEAKNESS_DURATION,
      armorIgnore: 0.5
    });

    this.findWeaknessTargets.set(target, this.sim.currentTime);
  }
}

// ==================== Export ====================
export default Rogue;