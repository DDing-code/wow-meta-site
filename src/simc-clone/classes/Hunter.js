/**
 * Phase 3.5: Hunter Class Implementation
 * 사냥꾼 클래스 - Beast Mastery, Marksmanship, Survival
 * Lines: ~1,200
 */

import { Player } from '../Player.js';
import { Action } from '../Action.js';
import { Buff } from '../Buff.js';
import { RESOURCE_TYPE } from '../Actor.js';
import { DAMAGE_TYPE } from '../core/DamageCalculator.js';

// ==================== 사냥꾼 상수 ====================
export const HUNTER_CONSTANTS = {
  // 집중 관리
  FOCUS: {
    MAX: 100,
    REGEN_BASE: 10, // 초당
    STEADY_SHOT_GENERATION: 15,
    ARCANE_SHOT_COST: 30,
    AIMED_SHOT_COST: 35
  },

  // 펫 시스템
  PET: {
    BASIC_ATTACK_INTERVAL: 2000,
    DAMAGE_MODIFIER: 0.6, // 주인 공격력의 60%
    HEALTH_MODIFIER: 0.7,
    BEAST_CLEAVE_TARGETS: 3
  },

  // 스펙별 특수 메커니즘
  BEAST_MASTERY: {
    BARBED_SHOT_CHARGES: 2,
    BARBED_SHOT_DURATION: 8000,
    BEAST_CLEAVE_DURATION: 4000,
    FRENZY_STACKS: 3,
    BESTIAL_WRATH_DURATION: 15000
  },

  MARKSMANSHIP: {
    PRECISE_SHOTS_CHARGES: 2,
    TRUESHOT_DURATION: 15000,
    DOUBLE_TAP_WINDOW: 3000,
    CAREFUL_AIM_THRESHOLD: 0.7
  },

  SURVIVAL: {
    MONGOOSE_BITE_CHARGES: 5,
    MONGOOSE_WINDOW: 14000,
    WILDFIRE_BOMB_CHARGES: 2,
    COORDINATED_ASSAULT_DURATION: 20000
  }
};

// ==================== 펫 클래스 ====================
export class HunterPet {
  constructor(hunter, name, type = 'wolf') {
    this.owner = hunter;
    this.sim = hunter.sim;
    this.name = name;
    this.type = type;

    // 펫 스탯
    this.health = hunter.resources.max.health * HUNTER_CONSTANTS.PET.HEALTH_MODIFIER;
    this.maxHealth = this.health;
    this.attackPower = hunter.stats.get('attackPower') * HUNTER_CONSTANTS.PET.DAMAGE_MODIFIER;

    // 상태
    this.isAlive = true;
    this.target = null;
    this.buffs = new Map();

    this.setupAbilities();
  }

  setupAbilities() {
    // 기본 공격
    this.bite = {
      execute: () => {
        if (!this.target || !this.isAlive) return;

        const damage = this.attackPower * 0.5;
        this.owner.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'pet_bite');

        // Beast Cleave (BM)
        if (this.buffs.has('beastCleave')) {
          const nearbyTargets = this.owner.getNearbyTargets(8);
          for (const target of nearbyTargets.slice(1, HUNTER_CONSTANTS.PET.BEAST_CLEAVE_TARGETS)) {
            this.owner.dealDamage(target, damage * 0.75, DAMAGE_TYPE.PHYSICAL, 'pet_cleave');
          }
        }
      }
    };

    // 특수 능력 (타입별)
    switch (this.type) {
      case 'wolf':
        this.furious_howl = {
          cooldown: 40000,
          execute: () => {
            this.owner.applyBuff('furiousHowl', {
              duration: 8000,
              critBonus: 0.1
            });
          }
        };
        break;
      case 'cat':
        this.prowl = {
          cooldown: 10000,
          execute: () => {
            this.buffs.set('prowl', {
              duration: 10000,
              damageMultiplier: 1.5
            });
          }
        };
        break;
      case 'bear':
        this.thick_hide = {
          passive: true,
          damageReduction: 0.1
        };
        break;
    }
  }

  startAutoAttack() {
    const attack = () => {
      if (!this.isAlive) return;

      this.bite.execute();

      this.sim.scheduleEvent({
        time: this.sim.currentTime + HUNTER_CONSTANTS.PET.BASIC_ATTACK_INTERVAL,
        actor: this,
        callback: attack
      });
    };

    attack();
  }

  applyBuff(name, buff) {
    this.buffs.set(name, buff);

    if (buff.duration) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + buff.duration,
        actor: this,
        callback: () => this.buffs.delete(name)
      });
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.isAlive = false;
      this.owner.onPetDeath();
    }
  }

  heal(amount) {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  resurrect() {
    this.isAlive = true;
    this.health = this.maxHealth * 0.6;
  }
}

// ==================== 사냥꾼 기본 클래스 ====================
export class Hunter extends Player {
  constructor(sim, name) {
    super(sim, name);

    this.class = 'hunter';
    this.resources.base[RESOURCE_TYPE.FOCUS] = HUNTER_CONSTANTS.FOCUS.MAX;
    this.resources.max[RESOURCE_TYPE.FOCUS] = HUNTER_CONSTANTS.FOCUS.MAX;
    this.resources.current[RESOURCE_TYPE.FOCUS] = HUNTER_CONSTANTS.FOCUS.MAX;

    // 사냥꾼 특성
    this.canBlock = false;
    this.canParry = true;
    this.canDodge = true;

    // 펫
    this.pet = null;
    this.petType = 'wolf';

    // 사냥꾼 버프
    this.buffs.aspectOfTheWild = null;
    this.buffs.trueshot = null;

    this.setupCommonAbilities();
  }

  // ==================== 집중 관리 ====================
  regenerateFocus() {
    let regenRate = HUNTER_CONSTANTS.FOCUS.REGEN_BASE;

    // 가속 영향
    const haste = this.getHaste();
    regenRate *= 1 + haste / 100;

    const regenAmount = regenRate / 10; // 0.1초당
    this.grantResource(RESOURCE_TYPE.FOCUS, regenAmount, 'focus_regen');
  }

  spendFocus(amount) {
    if (this.resources.current[RESOURCE_TYPE.FOCUS] < amount) {
      return false;
    }

    this.resources.current[RESOURCE_TYPE.FOCUS] -= amount;
    return true;
  }

  // ==================== 펫 관리 ====================
  summonPet() {
    if (!this.pet || !this.pet.isAlive) {
      this.pet = new HunterPet(this, `${this.name}'s Pet`, this.petType);
      this.pet.target = this.target;
      this.pet.startAutoAttack();
    }
  }

  dismissPet() {
    if (this.pet) {
      this.pet.isAlive = false;
      this.pet = null;
    }
  }

  onPetDeath() {
    // 펫 죽음 처리
    this.removeBuff('beastCleave');
    this.removeBuff('frenzy');
  }

  // ==================== 공통 스킬 ====================
  setupCommonAbilities() {
    // Hunter's Mark
    this.abilities.huntersMark = new Action({
      name: "Hunter's Mark",
      instantCast: true,
      execute: () => {
        this.target.applyDebuff('huntersMark', {
          duration: 999999,
          damageIncrease: 0.05
        });
      }
    });

    // Aspect of the Wild
    this.abilities.aspectOfTheWild = new Action({
      name: 'Aspect of the Wild',
      cooldown: 120000,
      execute: () => {
        const duration = this.spec === 'beast_mastery' ? 20000 : 15000;

        this.applyBuff('aspectOfTheWild', {
          duration: duration,
          critBonus: 0.1,
          focusRegenBonus: 5
        });

        if (this.pet) {
          this.pet.applyBuff('aspectOfTheWild', {
            duration: duration,
            damageMultiplier: 1.3
          });
        }
      }
    });

    // Exhilaration
    this.abilities.exhilaration = new Action({
      name: 'Exhilaration',
      cooldown: 120000,
      execute: () => {
        // 자신 치유
        const selfHeal = this.resources.max.health * 0.3;
        this.heal(selfHeal);

        // 펫 치유
        if (this.pet && this.pet.isAlive) {
          this.pet.heal(this.pet.maxHealth);
        }
      }
    });

    // Freezing Trap
    this.abilities.freezingTrap = new Action({
      name: 'Freezing Trap',
      cooldown: 30000,
      execute: () => {
        // 1초 후 발동
        this.sim.scheduleEvent({
          time: this.sim.currentTime + 1000,
          actor: this,
          callback: () => {
            const trapTarget = this.getNearestEnemy(3);
            if (trapTarget) {
              trapTarget.applyDebuff('frozen', {
                duration: 60000,
                frozen: true,
                breakOnDamage: true
              });
            }
          }
        });
      }
    });

    // Tar Trap
    this.abilities.tarTrap = new Action({
      name: 'Tar Trap',
      cooldown: 30000,
      execute: () => {
        // 지속 지역
        this.createAreaEffect({
          duration: 30000,
          radius: 8,
          tickInterval: 1000,
          effect: (target) => {
            target.applyDebuff('tarTrap', {
              duration: 1000,
              movementSpeedReduction: 0.5
            });
          }
        });
      }
    });

    // Misdirection
    this.abilities.misdirection = new Action({
      name: 'Misdirection',
      cooldown: 30000,
      execute: (target) => {
        this.applyBuff('misdirection', {
          duration: 8000,
          threatTarget: target,
          charges: 3
        });
      }
    });

    // Feign Death
    this.abilities.feignDeath = new Action({
      name: 'Feign Death',
      cooldown: 30000,
      execute: () => {
        this.clearThreat();
        this.applyBuff('feignDeath', {
          duration: 360000,
          feigning: true
        });
      }
    });

    // Call Pet
    this.abilities.callPet = new Action({
      name: 'Call Pet',
      castTime: 2000,
      execute: () => {
        this.summonPet();
      }
    });

    // Revive Pet
    this.abilities.revivePet = new Action({
      name: 'Revive Pet',
      castTime: 10000,
      usableIf: () => this.pet && !this.pet.isAlive,
      execute: () => {
        this.pet.resurrect();
        this.pet.startAutoAttack();
      }
    });
  }
}

// ==================== Beast Mastery 사냥꾼 ====================
export class BeastMasteryHunter extends Hunter {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'beast_mastery';

    // BM 특수 메커니즘
    this.barbedShotCharges = HUNTER_CONSTANTS.BEAST_MASTERY.BARBED_SHOT_CHARGES;
    this.frenzyStacks = 0;
    this.bestialWrathActive = false;

    // 두 번째 펫 (Animal Companion)
    this.secondPet = null;

    this.setupBeastMasteryAbilities();
  }

  setupBeastMasteryAbilities() {
    // Barbed Shot
    this.abilities.barbedShot = new Action({
      name: 'Barbed Shot',
      charges: HUNTER_CONSTANTS.BEAST_MASTERY.BARBED_SHOT_CHARGES,
      chargeCooldown: 12000,
      focusCost: 20,
      execute: () => {
        const damage = this.calculateBarbedShotDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'barbed_shot');

        // Barbed Shot DoT
        this.target.applyDebuff('barbedShot', {
          duration: HUNTER_CONSTANTS.BEAST_MASTERY.BARBED_SHOT_DURATION,
          tickInterval: 2000,
          tickDamage: damage * 0.15,
          pandemic: false
        });

        // Pet Frenzy
        if (this.pet) {
          this.applyFrenzyToPet();
        }

        // Focus 생성
        this.grantResource(RESOURCE_TYPE.FOCUS, 5, 'barbed_shot');

        // Bestial Wrath CDR
        if (this.abilities.bestialWrath.cooldown) {
          this.abilities.bestialWrath.cooldown.reduce(12000);
        }
      }
    });

    // Cobra Shot
    this.abilities.cobraShot = new Action({
      name: 'Cobra Shot',
      castTime: 1800,
      focusCost: 35,
      execute: () => {
        const damage = this.calculateCobraShotDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'cobra_shot');

        // Kill Command CDR
        if (this.abilities.killCommand.cooldown) {
          this.abilities.killCommand.cooldown.reduce(1000);
        }
      }
    });

    // Kill Command
    this.abilities.killCommand = new Action({
      name: 'Kill Command',
      cooldown: 7500,
      focusCost: 30,
      execute: () => {
        if (!this.pet || !this.pet.isAlive) return;

        const damage = this.calculateKillCommandDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'kill_command');

        // Pet leap
        this.pet.target = this.target;

        // Beast Cleave
        this.pet.applyBuff('beastCleave', {
          duration: HUNTER_CONSTANTS.BEAST_MASTERY.BEAST_CLEAVE_DURATION
        });
      }
    });

    // Bestial Wrath
    this.abilities.bestialWrath = new Action({
      name: 'Bestial Wrath',
      cooldown: 90000,
      execute: () => {
        this.bestialWrathActive = true;

        this.applyBuff('bestialWrath', {
          duration: HUNTER_CONSTANTS.BEAST_MASTERY.BESTIAL_WRATH_DURATION,
          damageMultiplier: 1.25,
          critBonus: 0.25
        });

        if (this.pet) {
          this.pet.applyBuff('bestialWrath', {
            duration: HUNTER_CONSTANTS.BEAST_MASTERY.BESTIAL_WRATH_DURATION,
            damageMultiplier: 1.35
          });
        }

        this.sim.scheduleEvent({
          time: this.sim.currentTime + HUNTER_CONSTANTS.BEAST_MASTERY.BESTIAL_WRATH_DURATION,
          actor: this,
          callback: () => { this.bestialWrathActive = false; }
        });
      }
    });

    // Multi-Shot
    this.abilities.multiShot = new Action({
      name: 'Multi-Shot',
      focusCost: 40,
      execute: () => {
        const targets = this.getNearbyTargets(8);
        const damage = this.calculateMultiShotDamage();

        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL, 'multi_shot');
        }

        // Beast Cleave for all pets
        if (this.pet) {
          this.pet.applyBuff('beastCleave', {
            duration: HUNTER_CONSTANTS.BEAST_MASTERY.BEAST_CLEAVE_DURATION
          });
        }
      }
    });

    // Dire Beast
    this.abilities.direBeast = new Action({
      name: 'Dire Beast',
      cooldown: 20000,
      execute: () => {
        this.summonDireBeast();
      }
    });

    // Call of the Wild
    this.abilities.callOfTheWild = new Action({
      name: 'Call of the Wild',
      cooldown: 180000,
      execute: () => {
        // 소환수 군단
        for (let i = 0; i < 5; i++) {
          this.sim.scheduleEvent({
            time: this.sim.currentTime + i * 2000,
            actor: this,
            callback: () => this.summonDireBeast()
          });
        }

        // 20% 데미지 증가
        this.applyBuff('callOfTheWild', {
          duration: 20000,
          damageMultiplier: 1.2
        });
      }
    });

    // Bloodshed
    this.abilities.bloodshed = new Action({
      name: 'Bloodshed',
      cooldown: 60000,
      execute: () => {
        if (!this.pet) return;

        // 펫이 즉시 공격
        const damage = this.pet.attackPower * 3;
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'bloodshed');

        // 출혈 DoT
        this.target.applyDebuff('bloodshed', {
          duration: 18000,
          tickInterval: 3000,
          tickDamage: damage * 0.1,
          bleed: true
        });
      }
    });
  }

  calculateBarbedShotDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.375;
  }

  calculateCobraShotDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.335;
  }

  calculateKillCommandDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 1.7;

    // Animal Companion 보너스
    if (this.secondPet) {
      damage *= 1.15;
    }

    return damage;
  }

  calculateMultiShotDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.288;
  }

  applyFrenzyToPet() {
    this.frenzyStacks = Math.min(this.frenzyStacks + 1, HUNTER_CONSTANTS.BEAST_MASTERY.FRENZY_STACKS);

    this.pet.applyBuff('frenzy', {
      duration: 8000,
      attackSpeedBonus: 0.1 * this.frenzyStacks,
      stacks: this.frenzyStacks
    });
  }

  summonDireBeast() {
    const duration = 8000;
    const attackInterval = 2000;

    const direBeastAttack = () => {
      const damage = this.stats.get('attackPower') * 0.15;
      this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'dire_beast');
    };

    let attacks = Math.floor(duration / attackInterval);
    for (let i = 0; i < attacks; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * attackInterval,
        actor: this,
        callback: direBeastAttack
      });
    }
  }
}

// ==================== Marksmanship 사냥꾼 ====================
export class MarksmanshipHunter extends Hunter {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'marksmanship';

    // MM 특수 메커니즘
    this.preciseShotsCharges = 0;
    this.trickShotsActive = false;
    this.inTheRhythm = 0;
    this.carefulAimActive = true;

    // Lone Wolf - 펫 없이 보너스
    this.loneWolf = true;
    if (this.loneWolf) {
      this.dismissPet();
    }

    this.setupMarksmanshipAbilities();
  }

  setupMarksmanshipAbilities() {
    // Aimed Shot
    this.abilities.aimedShot = new Action({
      name: 'Aimed Shot',
      castTime: 2500,
      charges: 2,
      chargeCooldown: 12000,
      focusCost: HUNTER_CONSTANTS.FOCUS.AIMED_SHOT_COST,
      execute: () => {
        let damage = this.calculateAimedShotDamage();

        // Careful Aim
        if (this.carefulAimActive &&
            (this.target.getHealthPercent() > HUNTER_CONSTANTS.MARKSMANSHIP.CAREFUL_AIM_THRESHOLD ||
             this.target.getHealthPercent() < 0.2)) {
          damage *= 1.5;
        }

        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'aimed_shot');

        // Precise Shots
        if (result.crit) {
          this.preciseShotsCharges = HUNTER_CONSTANTS.MARKSMANSHIP.PRECISE_SHOTS_CHARGES;
          this.applyBuff('preciseShots', {
            duration: 15000,
            charges: this.preciseShotsCharges
          });
        }
      }
    });

    // Arcane Shot
    this.abilities.arcaneShot = new Action({
      name: 'Arcane Shot',
      instantCast: true,
      focusCost: HUNTER_CONSTANTS.FOCUS.ARCANE_SHOT_COST,
      execute: () => {
        let damage = this.calculateArcaneShotDamage();

        // Precise Shots 소비
        if (this.preciseShotsCharges > 0) {
          damage *= 1.75;
          this.preciseShotsCharges--;

          if (this.preciseShotsCharges === 0) {
            this.removeBuff('preciseShots');
          }
        }

        this.dealDamage(this.target, damage, DAMAGE_TYPE.ARCANE, 'arcane_shot');

        // Chimaera Shot (특성)
        if (this.talents.chimaeraShot && Math.random() < 0.2) {
          const natureDamage = damage * 0.4;
          const frostDamage = damage * 0.4;

          this.dealDamage(this.target, natureDamage, DAMAGE_TYPE.NATURE, 'chimaera_nature');
          this.dealDamage(this.target, frostDamage, DAMAGE_TYPE.FROST, 'chimaera_frost');
        }
      }
    });

    // Steady Shot
    this.abilities.steadyShot = new Action({
      name: 'Steady Shot',
      castTime: 1750,
      execute: () => {
        const damage = this.calculateSteadyShotDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'steady_shot');

        // Focus 생성
        this.grantResource(RESOURCE_TYPE.FOCUS, HUNTER_CONSTANTS.FOCUS.STEADY_SHOT_GENERATION, 'steady_shot');

        // Steady Focus (특성)
        if (this.talents.steadyFocus) {
          this.applyBuff('steadyFocus', {
            duration: 15000,
            hasteBonus: 0.07
          });
        }
      }
    });

    // Rapid Fire
    this.abilities.rapidFire = new Action({
      name: 'Rapid Fire',
      channeled: true,
      duration: 3000,
      focusCost: 20,
      cooldown: 20000,
      execute: () => {
        this.channelRapidFire();
      }
    });

    // Trueshot
    this.abilities.trueshot = new Action({
      name: 'Trueshot',
      cooldown: 120000,
      execute: () => {
        this.applyBuff('trueshot', {
          duration: HUNTER_CONSTANTS.MARKSMANSHIP.TRUESHOT_DURATION,
          hasteBonus: 0.4,
          critBonus: 0.5,
          focusCostReduction: 0.5
        });
      }
    });

    // Double Tap
    this.abilities.doubleTap = new Action({
      name: 'Double Tap',
      cooldown: 60000,
      execute: () => {
        this.applyBuff('doubleTap', {
          duration: HUNTER_CONSTANTS.MARKSMANSHIP.DOUBLE_TAP_WINDOW,
          nextAimedCrit: true,
          nextRapidFireCrit: true
        });
      }
    });

    // Explosive Shot
    this.abilities.explosiveShot = new Action({
      name: 'Explosive Shot',
      focusCost: 20,
      cooldown: 30000,
      execute: () => {
        const damage = this.calculateExplosiveShotDamage();

        // 초기 폭발
        this.dealDamage(this.target, damage, DAMAGE_TYPE.FIRE, 'explosive_shot');

        // 2초 후 폭발
        this.sim.scheduleEvent({
          time: this.sim.currentTime + 2000,
          actor: this,
          callback: () => {
            const explosionDamage = damage * 0.65;
            const targets = this.target.getNearbyTargets(8);

            for (const target of targets) {
              this.dealDamage(target, explosionDamage, DAMAGE_TYPE.FIRE, 'explosive_shot_aoe');
            }
          }
        });
      }
    });

    // Binding Shot
    this.abilities.bindingShot = new Action({
      name: 'Binding Shot',
      cooldown: 45000,
      execute: () => {
        this.target.applyDebuff('bindingShot', {
          duration: 8000,
          tethered: true,
          tetherRange: 5,
          onBreak: () => {
            // 밧줄 끊으면 3초 스턴
            this.target.applyDebuff('bindingStun', {
              duration: 3000,
              stunned: true
            });
          }
        });
      }
    });
  }

  calculateAimedShotDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 2.3;

    // Lone Wolf 보너스
    if (this.loneWolf) {
      damage *= 1.1;
    }

    return damage;
  }

  calculateArcaneShotDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 0.45;

    if (this.loneWolf) {
      damage *= 1.1;
    }

    return damage;
  }

  calculateSteadyShotDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 0.268;

    if (this.loneWolf) {
      damage *= 1.1;
    }

    return damage;
  }

  calculateExplosiveShotDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 2.89;
  }

  channelRapidFire() {
    const shots = 10;
    const shotInterval = 300;

    for (let i = 0; i < shots; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * shotInterval,
        actor: this,
        callback: () => {
          let damage = this.stats.get('attackPower') * 0.2;

          // Double Tap
          if (this.buffs.has('doubleTap')) {
            damage *= 2;
          }

          // Trick Shots
          if (this.trickShotsActive) {
            const targets = this.getNearbyTargets(8);
            for (const target of targets) {
              this.dealDamage(target, damage * 0.5, DAMAGE_TYPE.PHYSICAL, `rapid_fire_${i+1}_trick`);
            }
          } else {
            this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, `rapid_fire_${i+1}`);
          }
        }
      });
    }

    // In the Rhythm
    this.inTheRhythm++;
    this.applyBuff('inTheRhythm', {
      duration: 6000,
      hasteBonus: 0.01 * this.inTheRhythm,
      stacks: this.inTheRhythm
    });
  }
}

// ==================== Survival 사냥꾼 ====================
export class SurvivalHunter extends Hunter {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'survival';

    // Survival 특수 메커니즘
    this.mongooseBiteCharges = 0;
    this.mongooseFuryStacks = 0;
    this.wildfireBombCharges = HUNTER_CONSTANTS.SURVIVAL.WILDFIRE_BOMB_CHARGES;
    this.tipOfTheSpearStacks = 0;

    // 근접 무기 사용
    this.isMelee = true;

    this.setupSurvivalAbilities();
  }

  setupSurvivalAbilities() {
    // Raptor Strike / Mongoose Bite
    this.abilities.mongooseBite = new Action({
      name: 'Mongoose Bite',
      focusCost: 30,
      charges: HUNTER_CONSTANTS.SURVIVAL.MONGOOSE_BITE_CHARGES,
      execute: () => {
        let damage = this.calculateMongooseBiteDamage();

        // Mongoose Fury 스택
        damage *= 1 + (this.mongooseFuryStacks * 0.15);

        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'mongoose_bite');

        // Mongoose Fury 갱신/추가
        this.mongooseFuryStacks = Math.min(this.mongooseFuryStacks + 1, 5);
        this.applyBuff('mongooseFury', {
          duration: HUNTER_CONSTANTS.SURVIVAL.MONGOOSE_WINDOW,
          stacks: this.mongooseFuryStacks
        });

        // Tip of the Spear 소비
        if (this.tipOfTheSpearStacks > 0) {
          this.tipOfTheSpearStacks = 0;
          this.removeBuff('tipOfTheSpear');
        }
      }
    });

    // Kill Command (Survival)
    this.abilities.killCommand = new Action({
      name: 'Kill Command',
      cooldown: 6000,
      focusCost: 30,
      execute: () => {
        const damage = this.calculateKillCommandDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'kill_command');

        // Tip of the Spear
        this.tipOfTheSpearStacks = 3;
        this.applyBuff('tipOfTheSpear', {
          duration: 10000,
          damageBonus: 0.25,
          stacks: this.tipOfTheSpearStacks
        });

        // Kill Command 리셋
        if (this.talents.alphaPredator && Math.random() < 0.3) {
          this.abilities.killCommand.cooldown.reset();
        }
      }
    });

    // Wildfire Bomb
    this.abilities.wildfireBomb = new Action({
      name: 'Wildfire Bomb',
      charges: HUNTER_CONSTANTS.SURVIVAL.WILDFIRE_BOMB_CHARGES,
      chargeCooldown: 18000,
      execute: () => {
        const damage = this.calculateWildfireBombDamage();

        // 즉시 폭발
        const targets = this.getTargetsInArea(5);
        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.FIRE, 'wildfire_bomb');
        }

        // Wildfire DoT
        for (const target of targets) {
          target.applyDebuff('wildfire', {
            duration: 6000,
            tickInterval: 1000,
            tickDamage: damage * 0.1
          });
        }

        // Guerrilla Tactics (특성)
        if (this.talents.guerrillaTactics) {
          this.grantResource(RESOURCE_TYPE.FOCUS, 20, 'guerrilla_tactics');
        }
      }
    });

    // Serpent Sting
    this.abilities.serpentSting = new Action({
      name: 'Serpent Sting',
      focusCost: 20,
      execute: () => {
        this.target.applyDebuff('serpentSting', {
          duration: 12000,
          tickInterval: 3000,
          tickDamage: this.stats.get('attackPower') * 0.115,
          pandemic: true,
          poison: true
        });

        // Hydra's Bite (특성)
        if (this.talents.hydrasBite) {
          const nearbyTargets = this.target.getNearbyTargets(8);
          for (const target of nearbyTargets.slice(0, 2)) {
            target.applyDebuff('serpentSting', {
              duration: 12000,
              tickInterval: 3000,
              tickDamage: this.stats.get('attackPower') * 0.115,
              pandemic: true,
              poison: true
            });
          }
        }
      }
    });

    // Harpoon
    this.abilities.harpoon = new Action({
      name: 'Harpoon',
      cooldown: 20000,
      range: 30,
      execute: () => {
        // 대상에게 돌진
        this.position = { ...this.target.position };

        const damage = this.calculateHarpoonDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'harpoon');

        // Terms of Engagement (특성)
        if (this.talents.termsOfEngagement) {
          this.grantResource(RESOURCE_TYPE.FOCUS, 20, 'terms_of_engagement');
        }
      }
    });

    // Carve / Butchery
    this.abilities.carve = new Action({
      name: 'Carve',
      focusCost: 40,
      execute: () => {
        const targets = this.getNearbyTargets(8);
        const damage = this.calculateCarveDamage();

        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL, 'carve');

          // Sharpnel 적용
          target.applyDebuff('shrapnel', {
            duration: 9000,
            bleed: true
          });
        }
      }
    });

    // Coordinated Assault
    this.abilities.coordinatedAssault = new Action({
      name: 'Coordinated Assault',
      cooldown: 120000,
      execute: () => {
        this.applyBuff('coordinatedAssault', {
          duration: HUNTER_CONSTANTS.SURVIVAL.COORDINATED_ASSAULT_DURATION,
          critBonus: 0.2,
          damageMultiplier: 1.2
        });

        if (this.pet) {
          this.pet.applyBuff('coordinatedAssault', {
            duration: HUNTER_CONSTANTS.SURVIVAL.COORDINATED_ASSAULT_DURATION,
            attackSpeedBonus: 0.25,
            damageMultiplier: 1.35
          });
        }
      }
    });

    // Flanking Strike
    this.abilities.flankingStrike = new Action({
      name: 'Flanking Strike',
      cooldown: 40000,
      focusCost: 30,
      execute: () => {
        // 플레이어 공격
        const playerDamage = this.calculateFlankingStrikeDamage();
        this.dealDamage(this.target, playerDamage, DAMAGE_TYPE.PHYSICAL, 'flanking_strike');

        // 펫 공격
        if (this.pet) {
          const petDamage = playerDamage * 0.5;
          this.dealDamage(this.target, petDamage, DAMAGE_TYPE.PHYSICAL, 'flanking_strike_pet');

          // 위협 수준 전환
          this.pet.generateThreat(1000);
        }
      }
    });
  }

  calculateMongooseBiteDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.65;
  }

  calculateKillCommandDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 1.5;
  }

  calculateWildfireBombDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.45;
  }

  calculateHarpoonDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.5;
  }

  calculateCarveDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.35;
  }

  calculateFlankingStrikeDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 2.0;
  }
}

// ==================== Export ====================
export default Hunter;