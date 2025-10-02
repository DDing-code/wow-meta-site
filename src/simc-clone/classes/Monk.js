// Monk class implementation
// Implements Brewmaster (Tank), Windwalker (DPS), and Mistweaver (Healer) specializations

import { Player } from '../player.js';
import {
  RESOURCE_TYPE,
  SPEC_ROLE,
  DAMAGE_TYPE,
  SPELL_RESULT,
  BUFF_TYPE,
  DEBUFF_TYPE,
  PROC_TRIGGER,
  TARGET_TYPE,
  SPELL_SCHOOL,
  SCALING_STAT
} from '../constants.js';

export class Monk extends Player {
  constructor(sim, name) {
    super(sim, name);
    this.class = 'monk';

    // Monk specific resources
    this.primaryResource = RESOURCE_TYPE.ENERGY;
    this.resources.base[RESOURCE_TYPE.ENERGY] = 100;
    this.resources.max[RESOURCE_TYPE.ENERGY] = 100;
    this.resources.current[RESOURCE_TYPE.ENERGY] = 100;

    // Chi resource
    this.resources.base[RESOURCE_TYPE.CHI] = 0;
    this.resources.max[RESOURCE_TYPE.CHI] = 5;
    this.resources.current[RESOURCE_TYPE.CHI] = 0;

    // Mana for Mistweaver
    this.resources.base[RESOURCE_TYPE.MANA] = 10000;
    this.resources.max[RESOURCE_TYPE.MANA] = 10000;

    // Stagger for Brewmaster
    this.stagger = {
      pool: 0,
      tickRate: 500, // Damage every 0.5 seconds
      lastTick: 0,
      levels: {
        light: 0.3,    // < 30% of health
        moderate: 0.6,  // 30-60% of health
        heavy: 1.0     // > 60% of health
      }
    };

    // Brew charges for Brewmaster
    this.brews = {
      ironskinBrew: { charges: 3, maxCharges: 3, rechargeTime: 15000 },
      purifyingBrew: { charges: 3, maxCharges: 3, rechargeTime: 15000 }
    };

    // Combo strikes for Windwalker
    this.lastAbilityUsed = null;
    this.comboStrikes = true;

    // Teachings of the Monastery stacks
    this.teachingsOfTheMonastery = 0;

    // Renewing Mist tracking for Mistweaver
    this.renewingMists = new Map();

    // Essence Font channeling
    this.essenceFont = {
      channeling: false,
      targets: new Set()
    };

    // Storm, Earth, and Fire spirits for Windwalker
    this.sefSpirits = [];
    this.sefActive = false;

    // Touch of Death window tracking
    this.touchOfDeathWindow = false;

    // Celestial tracking
    this.celestials = [];
  }

  // Initialize specialization
  setSpec(spec) {
    super.setSpec(spec);

    switch(spec) {
      case 'brewmaster':
        this.specRole = SPEC_ROLE.TANK;
        this.initBrewmasterAbilities();
        break;
      case 'windwalker':
        this.specRole = SPEC_ROLE.DPS;
        this.initWindwalkerAbilities();
        break;
      case 'mistweaver':
        this.specRole = SPEC_ROLE.HEALER;
        this.primaryResource = RESOURCE_TYPE.MANA;
        this.initMistweaverAbilities();
        break;
    }

    this.initBaseAbilities();
  }

  // Initialize base Monk abilities
  initBaseAbilities() {
    // Tiger Palm - Basic Chi generator
    this.registerSpell('tiger_palm', {
      id: 100780,
      name: 'Tiger Palm',
      castTime: 0,
      energyCost: 50,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 0.27,
          coefficient: 0.27,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Generate Chi
        this.generateChi(2);

        // Apply debuff for Brewmaster
        if (this.currentSpec === 'brewmaster') {
          target.applyDebuff('tiger_palm', {
            duration: 10000,
            damageTakenIncrease: 0.1 // 10% increased damage taken
          });
        }

        // Teachings of the Monastery for Mistweaver
        if (this.currentSpec === 'mistweaver') {
          this.teachingsOfTheMonastery++;
          if (this.teachingsOfTheMonastery >= 3) {
            this.applyBuff('teachings_of_the_monastery', {
              duration: 20000,
              nextBlackoutKickFree: true
            });
          }
        }

        this.updateComboStrikes('tiger_palm');
        return damage;
      }
    });

    // Blackout Kick
    this.registerSpell('blackout_kick', {
      id: 100784,
      name: 'Blackout Kick',
      castTime: 0,
      chiCost: this.currentSpec === 'windwalker' ? 1 : 3,
      execute: (target) => {
        let coefficient = this.currentSpec === 'windwalker' ? 1.65 : 0.85;

        // Combo Strikes bonus for Windwalker
        if (this.currentSpec === 'windwalker' && this.comboStrikes) {
          coefficient *= 1.1;
        }

        const damage = this.calculateDamage({
          baseDamage: this.attackPower * coefficient,
          coefficient: coefficient,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Brewmaster: Shuffle
        if (this.currentSpec === 'brewmaster') {
          this.applyBuff('shuffle', {
            duration: 3000,
            parryBonus: 0.1 // 10% parry
          });
        }

        // Mistweaver: Free cast from Teachings
        if (this.currentSpec === 'mistweaver' && this.hasBuff('teachings_of_the_monastery')) {
          this.removeBuff('teachings_of_the_monastery');
          this.teachingsOfTheMonastery = 0;
          // Restore chi cost
          this.generateChi(3);
        }

        this.updateComboStrikes('blackout_kick');
        return damage;
      }
    });

    // Roll - Mobility
    this.registerSpell('roll', {
      id: 109132,
      name: 'Roll',
      castTime: 0,
      charges: 2,
      chargeTime: 20000,
      execute: () => {
        // Move forward 15 yards
        this.sim.movePlayer(this, this.facing, 15);

        this.applyBuff('roll', {
          duration: 1000,
          moveSpeed: 2.0 // 100% movement speed increase
        });

        return { success: true };
      }
    });

    // Paralysis - CC
    this.registerSpell('paralysis', {
      id: 115078,
      name: 'Paralysis',
      castTime: 0,
      energyCost: 20,
      cooldown: 45000,
      execute: (target) => {
        target.applyDebuff('paralysis', {
          duration: 4000,
          incapacitated: true,
          breakOnDamage: true
        });

        return { success: true };
      }
    });

    // Touch of Death - Execute
    this.registerSpell('touch_of_death', {
      id: 322109,
      name: 'Touch of Death',
      castTime: 0,
      cooldown: 180000,
      execute: (target) => {
        // Can be used on targets below 15% health
        if (target.getHealthPercent() > 0.15 && !this.touchOfDeathWindow) {
          return { error: 'Target health too high' };
        }

        let damage;
        if (target.getHealthPercent() <= 0.15) {
          // Instant kill for low health enemies
          damage = target.currentHealth;
        } else {
          // During special windows (like Windwalker cooldowns)
          damage = this.calculateDamage({
            baseDamage: this.maxHealth * 0.35,
            coefficient: 0.35,
            damageType: DAMAGE_TYPE.PHYSICAL,
            target: target,
            canCrit: false,
            ignoreArmor: true
          });
        }

        return damage;
      }
    });

    // Detox - Dispel
    this.registerSpell('detox', {
      id: 218164,
      name: 'Detox',
      castTime: 0,
      energyCost: 20,
      cooldown: 8000,
      execute: (target) => {
        // Remove poison and disease
        target.dispelDebuff('poison');
        target.dispelDebuff('disease');

        // Mistweaver can also remove magic
        if (this.currentSpec === 'mistweaver') {
          target.dispelDebuff('magic');
        }

        return { success: true };
      }
    });

    // Fortifying Brew - Defensive
    this.registerSpell('fortifying_brew', {
      id: 115203,
      name: 'Fortifying Brew',
      castTime: 0,
      cooldown: this.currentSpec === 'brewmaster' ? 360000 : 180000,
      execute: () => {
        const healthBonus = this.currentSpec === 'brewmaster' ? 0.2 : 0.15;
        const drBonus = this.currentSpec === 'brewmaster' ? 0.2 : 0.15;

        this.applyBuff('fortifying_brew', {
          duration: 15000,
          healthIncrease: healthBonus,
          damageReduction: drBonus,
          onApply: () => {
            this.currentHealth *= (1 + healthBonus);
            this.maxHealth *= (1 + healthBonus);
          },
          onExpire: () => {
            this.maxHealth /= (1 + healthBonus);
            this.currentHealth = Math.min(this.currentHealth, this.maxHealth);
          }
        });

        return { success: true };
      }
    });
  }

  // Brewmaster specialization abilities
  initBrewmasterAbilities() {
    // Keg Smash - Main AoE ability
    this.registerSpell('keg_smash', {
      id: 121253,
      name: 'Keg Smash',
      castTime: 0,
      energyCost: 40,
      cooldown: 8000,
      execute: () => {
        const targets = this.sim.getTargetsInRange(this.position, 8);
        let totalDamage = 0;

        targets.forEach(target => {
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * 1.47,
            coefficient: 1.47,
            damageType: DAMAGE_TYPE.PHYSICAL,
            target: target,
            canCrit: true,
            threatModifier: 4.0
          });

          totalDamage += damage;

          // Apply debuffs
          target.applyDebuff('keg_smash', {
            duration: 15000,
            moveSpeedReduction: 0.5, // 50% slow
            missChance: 0.15 // 15% miss chance
          });
        });

        // Reduce brew cooldowns
        this.reduceBrew Cooldown(4000);

        // Generate Chi
        this.generateChi(2);

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Breath of Fire - Frontal cone damage
    this.registerSpell('breath_of_fire', {
      id: 115181,
      name: 'Breath of Fire',
      castTime: 0,
      chiCost: 1,
      execute: () => {
        const targets = this.sim.getTargetsInCone(this.position, this.facing, 12, 90);
        let totalDamage = 0;

        targets.forEach(target => {
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * 0.48,
            coefficient: 0.48,
            damageType: DAMAGE_TYPE.FIRE,
            target: target,
            canCrit: true
          });

          totalDamage += damage;

          // Apply DoT if target has Keg Smash debuff
          if (target.hasDebuff('keg_smash')) {
            target.applyDebuff('breath_of_fire_dot', {
              duration: 12000,
              tickInterval: 2000,
              source: this,
              onTick: () => {
                return this.calculateDamage({
                  baseDamage: this.attackPower * 0.123,
                  coefficient: 0.123,
                  damageType: DAMAGE_TYPE.FIRE,
                  target: target,
                  canCrit: false,
                  isDot: true
                });
              }
            });
          }
        });

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Ironskin Brew - Active mitigation
    this.registerSpell('ironskin_brew', {
      id: 115308,
      name: 'Ironskin Brew',
      castTime: 0,
      charges: this.brews.ironskinBrew.charges,
      chargeTime: this.brews.ironskinBrew.rechargeTime,
      sharedCharges: 'brews',
      execute: () => {
        // Increase stagger amount
        this.applyBuff('ironskin_brew', {
          duration: 7000,
          staggerBonus: 0.4, // Stagger 40% more damage
          canStack: true,
          maxDuration: 21000 // Can extend up to 3x duration
        });

        return { success: true };
      }
    });

    // Purifying Brew - Clear stagger
    this.registerSpell('purifying_brew', {
      id: 119582,
      name: 'Purifying Brew',
      castTime: 0,
      charges: this.brews.purifyingBrew.charges,
      chargeTime: this.brews.purifyingBrew.rechargeTime,
      sharedCharges: 'brews',
      execute: () => {
        // Clear 50% of stagger
        const purified = this.stagger.pool * 0.5;
        this.stagger.pool *= 0.5;

        // Heal for purified amount with certain talents
        if (this.talents.celestialBrew) {
          this.heal(purified * 0.3);
        }

        return { purified: purified };
      }
    });

    // Celestial Brew - Absorb shield
    this.registerSpell('celestial_brew', {
      id: 322507,
      name: 'Celestial Brew',
      castTime: 0,
      cooldown: 60000,
      execute: () => {
        // Shield based on attack power
        const shieldAmount = this.attackPower * 8;

        this.applyBuff('celestial_brew', {
          duration: 8000,
          shield: shieldAmount,
          onDamageTaken: (damage) => {
            // Absorb damage
            const absorbed = Math.min(damage, this.getBuffValue('celestial_brew', 'shield'));
            this.modifyBuffValue('celestial_brew', 'shield', -absorbed);

            if (this.getBuffValue('celestial_brew', 'shield') <= 0) {
              this.removeBuff('celestial_brew');
            }

            return damage - absorbed;
          }
        });

        return { shield: shieldAmount };
      }
    });

    // Zen Meditation - Channel damage reduction
    this.registerSpell('zen_meditation', {
      id: 115176,
      name: 'Zen Meditation',
      castTime: 8000,
      channeled: true,
      cooldown: 300000,
      execute: () => {
        this.applyBuff('zen_meditation', {
          duration: 8000,
          damageReduction: 0.6, // 60% damage reduction
          interruptOnMove: true,
          onDamageTaken: (damage, damageType) => {
            // Breaks on melee damage
            if (damageType === DAMAGE_TYPE.PHYSICAL) {
              this.removeBuff('zen_meditation');
            }
          }
        });

        return { success: true };
      }
    });

    // Invoke Niuzao - Summon Black Ox
    this.registerSpell('invoke_niuzao', {
      id: 132578,
      name: 'Invoke Niuzao, the Black Ox',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        const niuzao = new MonkCelestial(this, 'niuzao');
        this.celestials.push(niuzao);
        niuzao.spawn();

        return { success: true };
      }
    });
  }

  // Windwalker specialization abilities
  initWindwalkerAbilities() {
    // Rising Sun Kick - Major damage ability
    this.registerSpell('rising_sun_kick', {
      id: 107428,
      name: 'Rising Sun Kick',
      castTime: 0,
      chiCost: 2,
      cooldown: 10000,
      execute: (target) => {
        let coefficient = 3.332;

        // Combo Strikes bonus
        if (this.comboStrikes) {
          coefficient *= 1.1;
        }

        const damage = this.calculateDamage({
          baseDamage: this.attackPower * coefficient,
          coefficient: coefficient,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Apply debuff
        target.applyDebuff('rising_sun_kick', {
          duration: 15000,
          vulnerableToPhysical: 0.05 // 5% increased physical damage taken
        });

        // Reduce cooldown with certain effects
        if (this.hasBuff('serenity')) {
          this.reduceCooldown('rising_sun_kick', 5000);
        }

        this.updateComboStrikes('rising_sun_kick');
        return damage;
      }
    });

    // Fists of Fury - Channeled AoE
    this.registerSpell('fists_of_fury', {
      id: 113656,
      name: 'Fists of Fury',
      castTime: 4000,
      channeled: true,
      chiCost: 3,
      cooldown: 24000,
      execute: () => {
        let coefficient = 0.745; // Per tick

        // Combo Strikes bonus
        if (this.comboStrikes) {
          coefficient *= 1.1;
        }

        this.applyBuff('fists_of_fury', {
          duration: 4000,
          tickInterval: 166, // 6 ticks per second
          stunImmune: true,
          onTick: () => {
            const targets = this.sim.getTargetsInCone(this.position, this.facing, 8, 45);
            let totalDamage = 0;

            targets.forEach(target => {
              const damage = this.calculateDamage({
                baseDamage: this.attackPower * coefficient,
                coefficient: coefficient,
                damageType: DAMAGE_TYPE.PHYSICAL,
                target: target,
                canCrit: true
              });

              totalDamage += damage;

              // Apply slow
              target.applyDebuff('fists_of_fury_slow', {
                duration: 1000,
                moveSpeedReduction: 0.5
              });
            });

            return totalDamage;
          },
          onComplete: () => {
            // Open Touch of Death window briefly
            this.touchOfDeathWindow = true;
            this.sim.registerCallback(this.sim.currentTime + 3000, () => {
              this.touchOfDeathWindow = false;
            });
          }
        });

        this.updateComboStrikes('fists_of_fury');
        return { success: true };
      }
    });

    // Spinning Crane Kick - AoE Chi spender
    this.registerSpell('spinning_crane_kick', {
      id: 101546,
      name: 'Spinning Crane Kick',
      castTime: 1500,
      channeled: true,
      chiCost: 2,
      execute: () => {
        let coefficient = 0.4; // Per tick
        let stacks = this.getMarkOfTheCraneStacks();

        // Damage increases with unique targets hit
        coefficient *= (1 + stacks * 0.1);

        // Combo Strikes bonus
        if (this.comboStrikes) {
          coefficient *= 1.1;
        }

        this.applyBuff('spinning_crane_kick', {
          duration: 1500,
          tickInterval: 500,
          onTick: () => {
            const targets = this.sim.getTargetsInRange(this.position, 8);
            let totalDamage = 0;

            targets.forEach(target => {
              const damage = this.calculateDamage({
                baseDamage: this.attackPower * coefficient,
                coefficient: coefficient,
                damageType: DAMAGE_TYPE.PHYSICAL,
                target: target,
                canCrit: true
              });

              totalDamage += damage;

              // Mark target for bonus damage
              this.markOfTheCrane(target);
            });

            return totalDamage;
          }
        });

        this.updateComboStrikes('spinning_crane_kick');
        return { success: true };
      }
    });

    // Whirling Dragon Punch - Combo ability
    this.registerSpell('whirling_dragon_punch', {
      id: 152175,
      name: 'Whirling Dragon Punch',
      castTime: 0,
      cooldown: 24000,
      requirements: ['fists_of_fury_on_cooldown', 'rising_sun_kick_on_cooldown'],
      execute: () => {
        const targets = this.sim.getTargetsInRange(this.position, 8);
        let totalDamage = 0;

        targets.forEach(target => {
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * 3.0,
            coefficient: 3.0,
            damageType: DAMAGE_TYPE.PHYSICAL,
            target: target,
            canCrit: true
          });

          totalDamage += damage;
        });

        this.updateComboStrikes('whirling_dragon_punch');
        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Storm, Earth, and Fire - Clone ability
    this.registerSpell('storm_earth_and_fire', {
      id: 137639,
      name: 'Storm, Earth, and Fire',
      castTime: 0,
      charges: 2,
      chargeTime: 90000,
      execute: (target) => {
        if (this.sefActive) {
          // Cancel SEF
          this.sefSpirits.forEach(spirit => spirit.despawn());
          this.sefSpirits = [];
          this.sefActive = false;
          return { success: true };
        }

        // Create spirits
        const earthSpirit = new SEFSpirit(this, 'earth', target);
        const fireSpirit = new SEFSpirit(this, 'fire', this.sim.getSecondaryTarget());

        this.sefSpirits = [earthSpirit, fireSpirit];
        this.sefActive = true;

        earthSpirit.spawn();
        fireSpirit.spawn();

        this.applyBuff('storm_earth_and_fire', {
          duration: -1, // Until cancelled
          damageReduction: 0.35, // Each deals 65% damage
          onAbilityUse: (ability) => {
            // Spirits copy abilities
            this.sefSpirits.forEach(spirit => {
              spirit.copyAbility(ability);
            });
          }
        });

        return { success: true };
      }
    });

    // Serenity - Alternative to SEF
    this.registerSpell('serenity', {
      id: 152173,
      name: 'Serenity',
      castTime: 0,
      cooldown: 90000,
      execute: () => {
        this.applyBuff('serenity', {
          duration: 12000,
          cooldownReduction: 0.5, // 50% cooldown reduction
          chiCostReduction: 1.0, // Free Chi abilities
          damageIncrease: 0.12 // 12% damage increase
        });

        return { success: true };
      }
    });

    // Touch of Karma - Redirect damage
    this.registerSpell('touch_of_karma', {
      id: 122470,
      name: 'Touch of Karma',
      castTime: 0,
      cooldown: 90000,
      execute: () => {
        const maxAbsorb = this.maxHealth * 0.5;

        this.applyBuff('touch_of_karma', {
          duration: 10000,
          absorbed: 0,
          maxAbsorb: maxAbsorb,
          onDamageTaken: (damage, source) => {
            const absorbed = Math.min(damage, maxAbsorb - this.getBuffValue('touch_of_karma', 'absorbed'));
            this.modifyBuffValue('touch_of_karma', 'absorbed', absorbed);

            // Redirect damage to source
            if (source && source.takeDamage) {
              source.takeDamage({
                amount: absorbed,
                type: DAMAGE_TYPE.NATURE,
                source: this
              });
            }

            if (this.getBuffValue('touch_of_karma', 'absorbed') >= maxAbsorb) {
              this.removeBuff('touch_of_karma');
            }

            return damage - absorbed;
          }
        });

        return { success: true };
      }
    });

    // Invoke Xuen - Summon White Tiger
    this.registerSpell('invoke_xuen', {
      id: 123904,
      name: 'Invoke Xuen, the White Tiger',
      castTime: 0,
      cooldown: 120000,
      execute: () => {
        const xuen = new MonkCelestial(this, 'xuen');
        this.celestials.push(xuen);
        xuen.spawn();

        return { success: true };
      }
    });
  }

  // Mistweaver specialization abilities
  initMistweaverAbilities() {
    // Soothing Mist - Channel heal
    this.registerSpell('soothing_mist', {
      id: 115175,
      name: 'Soothing Mist',
      castTime: 8000,
      channeled: true,
      manaCost: 400,
      execute: (target) => {
        this.applyBuff('soothing_mist', {
          duration: 8000,
          tickInterval: 1000,
          target: target,
          onTick: () => {
            const healing = this.calculateHealing({
              baseHealing: this.spellPower * 0.64,
              coefficient: 0.64,
              target: target,
              canCrit: false
            });

            target.heal(healing);

            // Generate Chi with talent
            if (this.talents.spiritOfTheCrane && Math.random() < 0.1) {
              this.generateChi(1);
            }

            return healing;
          }
        });

        return { success: true };
      }
    });

    // Enveloping Mist - Strong HoT
    this.registerSpell('enveloping_mist', {
      id: 124682,
      name: 'Enveloping Mist',
      castTime: 2000,
      manaCost: 2400,
      chiCost: 3,
      execute: (target) => {
        // Instant cast during Soothing Mist
        const castTime = this.hasBuff('soothing_mist') ? 0 : 2000;

        // Initial heal
        const initialHeal = this.calculateHealing({
          baseHealing: this.spellPower * 2.0,
          coefficient: 2.0,
          target: target,
          canCrit: true
        });

        // Apply HoT
        target.applyBuff('enveloping_mist', {
          duration: 6000,
          tickInterval: 1000,
          source: this,
          healingIncrease: 0.3, // 30% increased healing received
          onTick: () => {
            const healing = this.calculateHealing({
              baseHealing: this.spellPower * 0.32,
              coefficient: 0.32,
              target: target,
              canCrit: false
            });
            target.heal(healing);
            return healing;
          }
        });

        return { healing: initialHeal };
      }
    });

    // Renewing Mist - Jumping HoT
    this.registerSpell('renewing_mist', {
      id: 115151,
      name: 'Renewing Mist',
      castTime: 0,
      manaCost: 1750,
      cooldown: 9000,
      execute: (target) => {
        this.applyRenewingMist(target, {
          duration: 20000,
          tickInterval: 2000,
          jumps: 4,
          currentJump: 0
        });

        return { success: true };
      }
    });

    // Vivify - Direct heal
    this.registerSpell('vivify', {
      id: 116670,
      name: 'Vivify',
      castTime: 1500,
      manaCost: 1750,
      execute: (target) => {
        // Instant during Soothing Mist
        const castTime = this.hasBuff('soothing_mist') ? 0 : 1500;

        // Main target heal
        const mainHeal = this.calculateHealing({
          baseHealing: this.spellPower * 1.49,
          coefficient: 1.49,
          target: target,
          canCrit: true
        });

        target.heal(mainHeal);

        // Cleave heal to Renewing Mist targets
        let totalHealing = mainHeal;
        this.renewingMists.forEach((mist, targetId) => {
          const mistTarget = this.sim.getEntityById(targetId);
          if (mistTarget && mistTarget !== target) {
            const cleaveHeal = this.calculateHealing({
              baseHealing: this.spellPower * 0.745,
              coefficient: 0.745,
              target: mistTarget,
              canCrit: true
            });
            mistTarget.heal(cleaveHeal);
            totalHealing += cleaveHeal;
          }
        });

        return { healing: totalHealing };
      }
    });

    // Essence Font - AoE channel heal
    this.registerSpell('essence_font', {
      id: 191837,
      name: 'Essence Font',
      castTime: 3000,
      channeled: true,
      manaCost: 3600,
      cooldown: 12000,
      execute: () => {
        this.essenceFont.channeling = true;
        this.essenceFont.targets.clear();

        this.applyBuff('essence_font_channel', {
          duration: 3000,
          tickInterval: 1000,
          onTick: () => {
            // Heal 6 injured allies
            const allies = this.sim.getInjuredAlliesInRange(this.position, 25, 6);
            let totalHealing = 0;

            allies.forEach(ally => {
              const healing = this.calculateHealing({
                baseHealing: this.spellPower * 0.518,
                coefficient: 0.518,
                target: ally,
                canCrit: true
              });

              ally.heal(healing);
              totalHealing += healing;

              // Apply HoT buff
              this.essenceFont.targets.add(ally.id);
              ally.applyBuff('essence_font_hot', {
                duration: 8000,
                tickInterval: 2000,
                source: this,
                onTick: () => {
                  const hotHealing = this.calculateHealing({
                    baseHealing: this.spellPower * 0.084,
                    coefficient: 0.084,
                    target: ally,
                    canCrit: false
                  });
                  ally.heal(hotHealing);
                  return hotHealing;
                }
              });
            });

            return totalHealing;
          },
          onComplete: () => {
            this.essenceFont.channeling = false;
          }
        });

        return { success: true };
      }
    });

    // Life Cocoon - External defensive
    this.registerSpell('life_cocoon', {
      id: 116849,
      name: 'Life Cocoon',
      castTime: 0,
      manaCost: 1200,
      cooldown: 120000,
      execute: (target) => {
        const shieldAmount = this.spellPower * 12.0;

        target.applyBuff('life_cocoon', {
          duration: 12000,
          shield: shieldAmount,
          healingIncrease: 0.5, // 50% increased healing
          onDamageTaken: (damage) => {
            const absorbed = Math.min(damage, target.getBuffValue('life_cocoon', 'shield'));
            target.modifyBuffValue('life_cocoon', 'shield', -absorbed);

            if (target.getBuffValue('life_cocoon', 'shield') <= 0) {
              target.removeBuff('life_cocoon');
            }

            return damage - absorbed;
          }
        });

        return { shield: shieldAmount };
      }
    });

    // Revival - Instant raid heal
    this.registerSpell('revival', {
      id: 115310,
      name: 'Revival',
      castTime: 0,
      manaCost: 2187,
      cooldown: 180000,
      execute: () => {
        const allies = this.sim.getAlliesInRange(this.position, 40);
        let totalHealing = 0;

        allies.forEach(ally => {
          const healing = this.calculateHealing({
            baseHealing: this.spellPower * 2.75,
            coefficient: 2.75,
            target: ally,
            canCrit: true
          });

          ally.heal(healing);
          totalHealing += healing;

          // Dispel all harmful effects
          ally.dispelAllDebuffs();
        });

        return { healing: totalHealing, targets: allies.length };
      }
    });

    // Invoke Chi-Ji - Summon Red Crane
    this.registerSpell('invoke_chiji', {
      id: 325197,
      name: 'Invoke Chi-Ji, the Red Crane',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        const chiji = new MonkCelestial(this, 'chiji');
        this.celestials.push(chiji);
        chiji.spawn();

        this.applyBuff('invoke_chiji', {
          duration: 25000,
          envelopingMistReduced: true, // Reduced mana cost
          gustsOfMist: true // Extra healing on abilities
        });

        return { success: true };
      }
    });

    // Invoke Yu'lon - Alternative celestial
    this.registerSpell('invoke_yulon', {
      id: 322118,
      name: "Invoke Yu'lon, the Jade Serpent",
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        const yulon = new MonkCelestial(this, 'yulon');
        this.celestials.push(yulon);
        yulon.spawn();

        return { success: true };
      }
    });
  }

  // Chi management
  generateChi(amount) {
    this.resources.current[RESOURCE_TYPE.CHI] = Math.min(
      this.resources.current[RESOURCE_TYPE.CHI] + amount,
      this.resources.max[RESOURCE_TYPE.CHI]
    );
  }

  spendChi(amount) {
    if (this.hasBuff('serenity')) {
      return true; // Chi is free during Serenity
    }

    if (this.resources.current[RESOURCE_TYPE.CHI] >= amount) {
      this.resources.current[RESOURCE_TYPE.CHI] -= amount;
      return true;
    }

    return false;
  }

  // Combo Strikes management
  updateComboStrikes(ability) {
    this.comboStrikes = (ability !== this.lastAbilityUsed);
    this.lastAbilityUsed = ability;
  }

  // Mark of the Crane for Spinning Crane Kick
  markOfTheCrane(target) {
    if (!this.marksOfTheCrane) {
      this.marksOfTheCrane = new Set();
    }

    this.marksOfTheCrane.add(target.id);

    // Clear old marks after 15 seconds
    this.sim.registerCallback(this.sim.currentTime + 15000, () => {
      this.marksOfTheCrane.delete(target.id);
    });
  }

  getMarkOfTheCraneStacks() {
    return this.marksOfTheCrane ? this.marksOfTheCrane.size : 0;
  }

  // Brew cooldown reduction
  reduceBrewCooldown(amount) {
    ['ironskinBrew', 'purifyingBrew'].forEach(brewType => {
      const brew = this.brews[brewType];
      if (brew.charges < brew.maxCharges) {
        // Reduce time until next charge
        // This would need integration with the cooldown system
      }
    });
  }

  // Stagger damage handling
  onDamageTaken(damage, damageType) {
    if (this.currentSpec === 'brewmaster' && damageType === DAMAGE_TYPE.PHYSICAL) {
      let staggerPercent = 0.35; // Base 35% stagger

      if (this.hasBuff('ironskin_brew')) {
        staggerPercent += this.getBuffValue('ironskin_brew', 'staggerBonus');
      }

      const staggered = damage * staggerPercent;
      const immediate = damage - staggered;

      // Add to stagger pool
      this.stagger.pool += staggered;

      // Take immediate damage
      super.onDamageTaken(immediate, damageType);

      // Don't take full damage
      return immediate;
    }

    return super.onDamageTaken(damage, damageType);
  }

  // Stagger tick
  staggerTick() {
    if (this.stagger.pool <= 0) return;

    const tickDamage = this.stagger.pool * (this.stagger.tickRate / 10000); // Portion per tick
    this.takeDamage({
      amount: tickDamage,
      type: DAMAGE_TYPE.PHYSICAL,
      source: this,
      isStagger: true
    });

    this.stagger.pool -= tickDamage;
  }

  // Renewing Mist management
  applyRenewingMist(target, options) {
    this.renewingMists.set(target.id, options);

    target.applyBuff('renewing_mist', {
      duration: options.duration,
      tickInterval: options.tickInterval,
      source: this,
      onTick: () => {
        const healing = this.calculateHealing({
          baseHealing: this.spellPower * 0.225,
          coefficient: 0.225,
          target: target,
          canCrit: false
        });
        target.heal(healing);

        // Jump logic
        if (options.currentJump < options.jumps) {
          const injured = this.sim.getInjuredAlliesInRange(target.position, 20, 1);
          if (injured.length > 0 && !this.renewingMists.has(injured[0].id)) {
            options.currentJump++;
            this.applyRenewingMist(injured[0], {
              ...options,
              duration: options.duration - 2000 // Slightly less duration on jump
            });
          }
        }

        return healing;
      },
      onExpire: () => {
        this.renewingMists.delete(target.id);
      }
    });
  }

  // Update method
  update(deltaTime) {
    super.update(deltaTime);

    // Energy regeneration
    if (this.currentSpec === 'windwalker' || this.currentSpec === 'brewmaster') {
      const energyRegen = 10 * (1 + this.getStatBonus('haste'));
      this.resources.current[RESOURCE_TYPE.ENERGY] = Math.min(
        this.resources.current[RESOURCE_TYPE.ENERGY] + energyRegen * (deltaTime / 1000),
        this.resources.max[RESOURCE_TYPE.ENERGY]
      );
    }

    // Stagger ticks for Brewmaster
    if (this.currentSpec === 'brewmaster' && this.stagger.pool > 0) {
      const currentTime = this.sim.currentTime;
      if (currentTime - this.stagger.lastTick >= this.stagger.tickRate) {
        this.staggerTick();
        this.stagger.lastTick = currentTime;
      }
    }

    // Mana regeneration for Mistweaver
    if (this.currentSpec === 'mistweaver') {
      const manaRegen = this.resources.max[RESOURCE_TYPE.MANA] * 0.02; // 2% per second
      this.resources.current[RESOURCE_TYPE.MANA] = Math.min(
        this.resources.current[RESOURCE_TYPE.MANA] + manaRegen * (deltaTime / 1000),
        this.resources.max[RESOURCE_TYPE.MANA]
      );
    }
  }
}

// SEF Spirit for Windwalker
class SEFSpirit {
  constructor(owner, type, target) {
    this.owner = owner;
    this.sim = owner.sim;
    this.type = type; // earth or fire
    this.name = `${owner.name}'s ${type} Spirit`;
    this.target = target;

    this.health = owner.maxHealth * 0.1;
    this.attackPower = owner.attackPower * 0.65; // 65% of owner's damage

    this.active = false;
  }

  spawn() {
    this.active = true;
    this.sim.registerPet(this);
  }

  despawn() {
    this.active = false;
    this.sim.unregisterPet(this);
  }

  copyAbility(ability) {
    if (!this.active || !this.target) return;

    // Spirit copies certain abilities
    const copiableAbilities = [
      'tiger_palm', 'blackout_kick', 'rising_sun_kick',
      'fists_of_fury', 'spinning_crane_kick'
    ];

    if (copiableAbilities.includes(ability)) {
      // Deal 65% damage
      const damage = this.owner.getAbilityDamage(ability) * 0.65;
      this.target.takeDamage({
        amount: damage,
        type: DAMAGE_TYPE.PHYSICAL,
        source: this
      });
    }
  }
}

// Monk Celestial pets
class MonkCelestial {
  constructor(owner, type) {
    this.owner = owner;
    this.sim = owner.sim;
    this.type = type; // niuzao, xuen, chiji, yulon
    this.name = `${owner.name}'s ${type}`;

    this.duration = 25000;
    this.active = false;

    switch(type) {
      case 'niuzao':
        this.health = owner.maxHealth * 2.0;
        this.attackPower = owner.attackPower * 0.5;
        this.abilities = ['stomp', 'taunt'];
        break;
      case 'xuen':
        this.health = owner.maxHealth * 0.5;
        this.attackPower = owner.attackPower * 1.0;
        this.abilities = ['tiger_lightning', 'crackling_tiger'];
        break;
      case 'chiji':
        this.spellPower = owner.spellPower * 0.8;
        this.abilities = ['enveloping_breath', 'chi_wave'];
        break;
      case 'yulon':
        this.spellPower = owner.spellPower * 1.0;
        this.abilities = ['soothing_breath', 'celestial_breath'];
        break;
    }
  }

  spawn() {
    this.active = true;
    this.sim.registerPet(this);

    // Start ability rotation
    this.performAction();

    // Despawn after duration
    this.sim.registerCallback(this.sim.currentTime + this.duration, () => {
      this.despawn();
    });
  }

  despawn() {
    this.active = false;
    this.sim.unregisterPet(this);
  }

  performAction() {
    if (!this.active) return;

    switch(this.type) {
      case 'niuzao':
        this.niuzaoAction();
        break;
      case 'xuen':
        this.xuenAction();
        break;
      case 'chiji':
        this.chijiAction();
        break;
      case 'yulon':
        this.yulonAction();
        break;
    }

    // Schedule next action
    this.sim.registerCallback(this.sim.currentTime + 2000, () => {
      this.performAction();
    });
  }

  niuzaoAction() {
    const target = this.owner.target;
    if (!target) return;

    // Stomp damage
    const damage = this.owner.calculateDamage({
      baseDamage: this.attackPower * 2.0,
      coefficient: 2.0,
      damageType: DAMAGE_TYPE.PHYSICAL,
      target: target,
      canCrit: true,
      source: this
    });

    // Generate threat
    target.threatTable.addThreat(this, damage * 4);
  }

  xuenAction() {
    const target = this.owner.target;
    if (!target) return;

    // Tiger Lightning
    const damage = this.owner.calculateDamage({
      baseDamage: this.attackPower * 1.5,
      coefficient: 1.5,
      damageType: DAMAGE_TYPE.NATURE,
      target: target,
      canCrit: true,
      source: this
    });

    // Crackling Tiger - copies owner's attacks
    if (Math.random() < 0.25) {
      const bonusDamage = this.owner.lastDamageDealt * 0.3;
      target.takeDamage({
        amount: bonusDamage,
        type: DAMAGE_TYPE.NATURE,
        source: this
      });
    }
  }

  chijiAction() {
    // Enveloping Breath - AoE heal
    const allies = this.sim.getInjuredAlliesInRange(this.owner.position, 30, 5);

    allies.forEach(ally => {
      const healing = this.owner.calculateHealing({
        baseHealing: this.spellPower * 0.8,
        coefficient: 0.8,
        target: ally,
        canCrit: false,
        source: this
      });

      ally.heal(healing);
    });
  }

  yulonAction() {
    // Soothing Breath - cleave heal
    const mainTarget = this.sim.getMostInjuredAlly();
    if (!mainTarget) return;

    const healing = this.owner.calculateHealing({
      baseHealing: this.spellPower * 2.0,
      coefficient: 2.0,
      target: mainTarget,
      canCrit: true,
      source: this
    });

    mainTarget.heal(healing);

    // Celestial Breath - statue effect
    const allies = this.sim.getAlliesInRange(mainTarget.position, 10, 3);
    allies.forEach(ally => {
      if (ally !== mainTarget) {
        const cleaveHeal = healing * 0.5;
        ally.heal(cleaveHeal);
      }
    });
  }
}