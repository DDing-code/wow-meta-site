// Paladin class implementation
// Implements Holy (Healer), Protection (Tank), and Retribution (DPS) specializations

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

export class Paladin extends Player {
  constructor(sim, name) {
    super(sim, name);
    this.class = 'paladin';

    // Paladin specific resources
    this.primaryResource = RESOURCE_TYPE.MANA;
    this.resources.base[RESOURCE_TYPE.MANA] = 10000;
    this.resources.max[RESOURCE_TYPE.MANA] = 10000;
    this.resources.current[RESOURCE_TYPE.MANA] = 10000;

    // Holy Power resource
    this.resources.base[RESOURCE_TYPE.HOLY_POWER] = 0;
    this.resources.max[RESOURCE_TYPE.HOLY_POWER] = 5;
    this.resources.current[RESOURCE_TYPE.HOLY_POWER] = 0;

    // Consecration ground effect
    this.consecration = {
      active: false,
      position: null,
      radius: 8,
      duration: 0,
      targets: new Set()
    };

    // Aura management
    this.activeAura = null;
    this.auraEffects = {
      devotion: { armorBonus: 0.1 }, // 10% armor
      retribution: { damageBonus: 0.05 }, // 5% damage
      crusader: { mountSpeed: 0.2 } // 20% mount speed
    };

    // Blessing tracking
    this.blessings = new Map();

    // Shield of Vengeance absorb tracking
    this.shieldOfVengeance = {
      active: false,
      absorbed: 0,
      maxAbsorb: 0
    };

    // Art of War proc for instant Flash of Light
    this.artOfWar = false;

    // Infusion of Light procs for Holy
    this.infusionOfLight = 0;

    // Grand Crusader procs for Protection
    this.grandCrusader = false;

    // Glimmer of Light targets for Holy
    this.glimmerTargets = new Set();

    // Righteous Protector CDR tracking
    this.righteousProtectorActive = false;

    // Empyrean Power proc tracking
    this.empyreanPower = false;

    // Divine Purpose tracking
    this.divinePurpose = false;
  }

  // Initialize specialization
  setSpec(spec) {
    super.setSpec(spec);

    switch(spec) {
      case 'holy':
        this.specRole = SPEC_ROLE.HEALER;
        this.initHolyAbilities();
        break;
      case 'protection':
        this.specRole = SPEC_ROLE.TANK;
        this.initProtectionAbilities();
        break;
      case 'retribution':
        this.specRole = SPEC_ROLE.DPS;
        this.initRetributionAbilities();
        break;
    }

    this.initBaseAbilities();
  }

  // Initialize base Paladin abilities
  initBaseAbilities() {
    // Blessing of Freedom - Remove movement impairing effects
    this.registerSpell('blessing_of_freedom', {
      id: 1044,
      name: 'Blessing of Freedom',
      castTime: 0,
      cooldown: 25000,
      execute: (target) => {
        target.applyBuff('blessing_of_freedom', {
          duration: 8000,
          immuneToSlow: true,
          immuneToRoot: true,
          onApply: () => {
            target.removeDebuffs(['slow', 'root', 'snare']);
          }
        });

        return { success: true };
      }
    });

    // Blessing of Protection - Physical immunity
    this.registerSpell('blessing_of_protection', {
      id: 1022,
      name: 'Blessing of Protection',
      castTime: 0,
      cooldown: 300000,
      execute: (target) => {
        target.applyBuff('blessing_of_protection', {
          duration: 10000,
          physicalImmune: true,
          pacified: true, // Cannot attack
          onApply: () => {
            target.clearThreat();
          }
        });

        return { success: true };
      }
    });

    // Blessing of Sacrifice - Transfer damage
    this.registerSpell('blessing_of_sacrifice', {
      id: 6940,
      name: 'Blessing of Sacrifice',
      castTime: 0,
      cooldown: 120000,
      execute: (target) => {
        target.applyBuff('blessing_of_sacrifice', {
          duration: 12000,
          damageReduction: 0.3, // 30% damage reduction
          onDamageTaken: (damage) => {
            // Transfer damage to paladin
            const transferred = damage * 0.3;
            this.takeDamage({
              amount: Math.min(transferred, this.maxHealth * 0.4), // Cap at 40% max health
              type: DAMAGE_TYPE.PHYSICAL,
              source: null,
              isTransferred: true
            });

            return damage * 0.7; // Target takes 70% damage
          }
        });

        return { success: true };
      }
    });

    // Divine Shield - Immunity
    this.registerSpell('divine_shield', {
      id: 642,
      name: 'Divine Shield',
      castTime: 0,
      cooldown: 300000,
      execute: () => {
        this.applyBuff('divine_shield', {
          duration: 8000,
          immune: true,
          onApply: () => {
            this.clearThreat();
            this.removeAllDebuffs();
          }
        });

        return { success: true };
      }
    });

    // Lay on Hands - Full heal
    this.registerSpell('lay_on_hands', {
      id: 633,
      name: 'Lay on Hands',
      castTime: 0,
      cooldown: 600000, // 10 minutes
      execute: (target) => {
        const healAmount = this.maxHealth;
        target.heal(healAmount);

        // Also restore mana with Glyph
        if (this.glyphs && this.glyphs.layOnHands) {
          target.resources.current[RESOURCE_TYPE.MANA] = Math.min(
            target.resources.current[RESOURCE_TYPE.MANA] + this.resources.max[RESOURCE_TYPE.MANA],
            target.resources.max[RESOURCE_TYPE.MANA]
          );
        }

        return { healing: healAmount };
      }
    });

    // Flash of Light - Basic heal
    this.registerSpell('flash_of_light', {
      id: 19750,
      name: 'Flash of Light',
      castTime: this.artOfWar ? 0 : 1500,
      manaCost: 1100,
      execute: (target) => {
        const healing = this.calculateHealing({
          baseHealing: this.spellPower * 1.3,
          coefficient: 1.3,
          target: target,
          canCrit: true
        });

        // Consume Art of War
        if (this.artOfWar) {
          this.artOfWar = false;
        }

        // Holy: Apply Glimmer of Light
        if (this.currentSpec === 'holy' && this.talents.glimmerOfLight) {
          this.applyGlimmer(target);
        }

        // Retribution: Self-heal bonus
        if (this.currentSpec === 'retribution' && target === this) {
          return healing * 1.4; // 40% more self-healing
        }

        return { healing: healing };
      }
    });

    // Hammer of Justice - Stun
    this.registerSpell('hammer_of_justice', {
      id: 853,
      name: 'Hammer of Justice',
      castTime: 0,
      cooldown: 60000,
      range: 10,
      execute: (target) => {
        target.applyDebuff('hammer_of_justice', {
          duration: 6000,
          stunned: true
        });

        return { success: true };
      }
    });

    // Cleanse - Dispel
    this.registerSpell('cleanse', {
      id: 4987,
      name: 'Cleanse',
      castTime: 0,
      cooldown: 8000,
      manaCost: 650,
      execute: (target) => {
        // Remove poison, disease
        target.dispelDebuff('poison');
        target.dispelDebuff('disease');

        // Holy can also remove magic
        if (this.currentSpec === 'holy') {
          target.dispelDebuff('magic');
        }

        return { success: true };
      }
    });

    // Consecration - Ground AoE
    this.registerSpell('consecration', {
      id: 26573,
      name: 'Consecration',
      castTime: 0,
      cooldown: this.currentSpec === 'protection' ? 4500 : 9000,
      execute: () => {
        this.consecration = {
          active: true,
          position: this.position,
          radius: 8,
          duration: this.currentSpec === 'protection' ? 12000 : 9000,
          tickInterval: 1000,
          lastTick: this.sim.currentTime
        };

        this.consecrationTick();

        return { success: true };
      }
    });

    // Avenging Wrath - Major cooldown
    this.registerSpell('avenging_wrath', {
      id: 31884,
      name: 'Avenging Wrath',
      castTime: 0,
      cooldown: 120000,
      execute: () => {
        const duration = this.currentSpec === 'holy' ? 30000 : 20000;

        this.applyBuff('avenging_wrath', {
          duration: duration,
          damageBonus: 0.2, // 20% damage
          healingBonus: this.currentSpec === 'holy' ? 0.3 : 0.2, // 30% healing for Holy
          critBonus: this.currentSpec === 'holy' ? 0.3 : 0 // 30% crit for Holy
        });

        return { success: true };
      }
    });
  }

  // Holy specialization abilities
  initHolyAbilities() {
    // Holy Light - Primary heal
    this.registerSpell('holy_light', {
      id: 82326,
      name: 'Holy Light',
      castTime: 2500,
      manaCost: 900,
      execute: (target) => {
        // Infusion of Light reduces cast time
        const castTime = this.infusionOfLight > 0 ? 1875 : 2500;

        const healing = this.calculateHealing({
          baseHealing: this.spellPower * 2.6,
          coefficient: 2.6,
          target: target,
          canCrit: true
        });

        // Apply Glimmer
        if (this.talents.glimmerOfLight) {
          this.applyGlimmer(target);
        }

        // Consume Infusion of Light
        if (this.infusionOfLight > 0) {
          this.infusionOfLight--;
        }

        return { healing: healing };
      }
    });

    // Holy Shock - Instant heal/damage
    this.registerSpell('holy_shock', {
      id: 20473,
      name: 'Holy Shock',
      castTime: 0,
      cooldown: 7500,
      manaCost: 800,
      execute: (target) => {
        if (target.friendly) {
          // Heal friendly target
          const healing = this.calculateHealing({
            baseHealing: this.spellPower * 1.4,
            coefficient: 1.4,
            target: target,
            canCrit: true,
            critChance: this.critChance + 0.3 // +30% crit chance
          });

          // Critical heals grant Infusion of Light
          if (healing.critical) {
            this.infusionOfLight = Math.min(this.infusionOfLight + 1, 2);
          }

          // Apply Glimmer
          if (this.talents.glimmerOfLight) {
            this.applyGlimmer(target);
          }

          return { healing: healing.amount };
        } else {
          // Damage enemy target
          const damage = this.calculateDamage({
            baseDamage: this.spellPower * 1.17,
            coefficient: 1.17,
            damageType: DAMAGE_TYPE.HOLY,
            target: target,
            canCrit: true,
            critChance: this.critChance + 0.3
          });

          // Generate Holy Power
          this.generateHolyPower(1);

          return damage;
        }
      }
    });

    // Light of Dawn - Cone heal
    this.registerSpell('light_of_dawn', {
      id: 85222,
      name: 'Light of Dawn',
      castTime: 0,
      holyPowerCost: 3,
      execute: () => {
        const targets = this.sim.getAlliesInCone(this.position, this.facing, 15, 90, 5);
        let totalHealing = 0;

        targets.forEach(target => {
          const healing = this.calculateHealing({
            baseHealing: this.spellPower * 1.08,
            coefficient: 1.08,
            target: target,
            canCrit: true
          });

          target.heal(healing);
          totalHealing += healing;
        });

        return { healing: totalHealing, targets: targets.length };
      }
    });

    // Word of Glory - Holy Power heal
    this.registerSpell('word_of_glory', {
      id: 85673,
      name: 'Word of Glory',
      castTime: 0,
      holyPowerCost: 3,
      execute: (target) => {
        const holyPower = this.resources.current[RESOURCE_TYPE.HOLY_POWER];

        const healing = this.calculateHealing({
          baseHealing: this.spellPower * (0.9 * holyPower),
          coefficient: 0.9 * holyPower,
          target: target,
          canCrit: true
        });

        // Apply Glimmer
        if (this.talents.glimmerOfLight) {
          this.applyGlimmer(target);
        }

        this.consumeHolyPower();

        return { healing: healing };
      }
    });

    // Beacon of Light - Healing transfer
    this.registerSpell('beacon_of_light', {
      id: 53563,
      name: 'Beacon of Light',
      castTime: 0,
      manaCost: 250,
      execute: (target) => {
        // Remove previous beacon
        if (this.beaconTarget) {
          this.beaconTarget.removeBuff('beacon_of_light');
        }

        this.beaconTarget = target;

        target.applyBuff('beacon_of_light', {
          duration: -1, // Permanent until moved
          source: this,
          onHealingReceived: (amount, source, spell) => {
            // Transfer 50% of healing to beacon target
            if (source === this && spell !== 'beacon_healing') {
              const transfer = amount * 0.5;
              this.beaconTarget.heal(transfer, 'beacon_healing');
            }
          }
        });

        return { success: true };
      }
    });

    // Divine Toll - Covenant ability
    this.registerSpell('divine_toll', {
      id: 304971,
      name: 'Divine Toll',
      castTime: 0,
      cooldown: 60000,
      execute: () => {
        const targets = this.sim.getTargetsInRange(this.position, 30);
        let totalValue = 0;

        // Cast Holy Shock on up to 5 targets
        const affectedTargets = targets.slice(0, 5);
        affectedTargets.forEach(target => {
          const result = this.castSpell('holy_shock', target);
          totalValue += result.healing || result.damage || 0;
        });

        return { value: totalValue, targets: affectedTargets.length };
      }
    });

    // Light's Hammer - Ground healing effect
    this.registerSpell('lights_hammer', {
      id: 114158,
      name: "Light's Hammer",
      castTime: 0,
      cooldown: 60000,
      execute: (position) => {
        this.lightsHammer = {
          active: true,
          position: position,
          radius: 10,
          duration: 14000,
          tickInterval: 2000
        };

        this.lightsHammerTick();

        return { success: true };
      }
    });

    // Aura Mastery - Enhance aura
    this.registerSpell('aura_mastery', {
      id: 31821,
      name: 'Aura Mastery',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        this.applyBuff('aura_mastery', {
          duration: 8000,
          auraEnhanced: true,
          raidDamageReduction: 0.2 // 20% raid damage reduction
        });

        // Apply to all allies in range
        const allies = this.sim.getAlliesInRange(this.position, 40);
        allies.forEach(ally => {
          ally.applyBuff('devotion_aura_mastery', {
            duration: 8000,
            damageReduction: 0.2
          });
        });

        return { success: true };
      }
    });
  }

  // Protection specialization abilities
  initProtectionAbilities() {
    // Avenger's Shield - Ranged interrupt
    this.registerSpell('avengers_shield', {
      id: 31935,
      name: "Avenger's Shield",
      castTime: 0,
      cooldown: 15000,
      holyPowerGeneration: 1,
      execute: (target) => {
        const targets = [target];
        let totalDamage = 0;

        // Bounces to 2 additional targets
        for (let i = 0; i < 3 && i < targets.length; i++) {
          const currentTarget = targets[i];

          const damage = this.calculateDamage({
            baseDamage: this.attackPower * 2.2,
            coefficient: 2.2,
            damageType: DAMAGE_TYPE.HOLY,
            target: currentTarget,
            canCrit: true,
            threatModifier: 3.0
          });

          totalDamage += damage;

          // Interrupt and silence
          currentTarget.applyDebuff('avengers_shield', {
            duration: 3000,
            silenced: true
          });

          // Find next target for bounce
          if (i < 2) {
            const nextTarget = this.sim.getNearestEnemy(currentTarget.position, targets);
            if (nextTarget) {
              targets.push(nextTarget);
            }
          }
        }

        // Generate Holy Power
        this.generateHolyPower(1);

        // Grand Crusader reset chance
        if (this.grandCrusader) {
          this.resetCooldown('avengers_shield');
          this.grandCrusader = false;
        }

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Shield of the Righteous - Active mitigation
    this.registerSpell('shield_of_the_righteous', {
      id: 53600,
      name: 'Shield of the Righteous',
      castTime: 0,
      holyPowerCost: 3,
      execute: (target) => {
        const holyPower = this.resources.current[RESOURCE_TYPE.HOLY_POWER];

        const damage = this.calculateDamage({
          baseDamage: this.attackPower * (1.5 * holyPower),
          coefficient: 1.5 * holyPower,
          damageType: DAMAGE_TYPE.HOLY,
          target: target,
          canCrit: false
        });

        // Apply armor buff
        this.applyBuff('shield_of_the_righteous', {
          duration: 4500,
          armorBonus: this.armor * 0.5 * holyPower, // 50% armor per HP
          canRefresh: true
        });

        this.consumeHolyPower();

        // Righteous Protector CDR
        if (this.talents.righteousProtector) {
          this.reduceCooldown('avenging_wrath', 3000);
          this.reduceCooldown('ardent_defender', 3000);
        }

        return damage;
      }
    });

    // Hammer of the Righteous - AoE builder
    this.registerSpell('hammer_of_the_righteous', {
      id: 53595,
      name: 'Hammer of the Righteous',
      castTime: 0,
      cooldown: 6000,
      charges: 2,
      execute: () => {
        const targets = this.sim.getTargetsInRange(this.position, 8);
        let totalDamage = 0;

        targets.forEach((target, index) => {
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * (index === 0 ? 1.24 : 0.62),
            coefficient: index === 0 ? 1.24 : 0.62,
            damageType: DAMAGE_TYPE.PHYSICAL,
            target: target,
            canCrit: true,
            threatModifier: 2.0
          });

          totalDamage += damage;
        });

        // Generate Holy Power
        this.generateHolyPower(1);

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Judgment - Ranged builder for Protection
    this.registerSpell('judgment_protection', {
      id: 275779,
      name: 'Judgment',
      castTime: 0,
      cooldown: 6000,
      range: 30,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 0.5,
          coefficient: 0.5,
          damageType: DAMAGE_TYPE.HOLY,
          target: target,
          canCrit: true
        });

        // Generate Holy Power
        this.generateHolyPower(1);

        // Apply debuff
        target.applyDebuff('judgment', {
          duration: 15000,
          damageTakenIncrease: 0.05
        });

        // Grand Crusader proc chance
        if (Math.random() < 0.15) {
          this.grandCrusader = true;
        }

        return damage;
      }
    });

    // Guardian of Ancient Kings - Major defensive
    this.registerSpell('guardian_of_ancient_kings', {
      id: 86659,
      name: 'Guardian of Ancient Kings',
      castTime: 0,
      cooldown: 300000,
      execute: () => {
        this.applyBuff('guardian_of_ancient_kings', {
          duration: 8000,
          damageReduction: 0.5 // 50% damage reduction
        });

        // Summon guardian
        const guardian = new AncientKingGuardian(this);
        guardian.spawn();

        return { success: true };
      }
    });

    // Ardent Defender - Cheat death
    this.registerSpell('ardent_defender', {
      id: 31850,
      name: 'Ardent Defender',
      castTime: 0,
      cooldown: 120000,
      execute: () => {
        this.applyBuff('ardent_defender', {
          duration: 8000,
          damageReduction: 0.2, // 20% damage reduction
          onLethalDamage: () => {
            // Prevent death and heal to 20% health
            this.currentHealth = this.maxHealth * 0.2;
            this.removeBuff('ardent_defender');
            return true; // Prevented death
          }
        });

        return { success: true };
      }
    });

    // Blessed Hammer - Spinning hammers
    this.registerSpell('blessed_hammer', {
      id: 204019,
      name: 'Blessed Hammer',
      castTime: 0,
      cooldown: 6000,
      charges: 3,
      execute: () => {
        // Create spinning hammer
        const hammer = {
          position: this.position,
          rotation: 0,
          duration: 4000,
          radius: 5
        };

        this.blessedHammers = this.blessedHammers || [];
        this.blessedHammers.push(hammer);

        // Start hammer rotation
        this.blessedHammerTick(hammer);

        // Generate Holy Power
        this.generateHolyPower(1);

        return { success: true };
      }
    });
  }

  // Retribution specialization abilities
  initRetributionAbilities() {
    // Blade of Justice - Holy Power builder
    this.registerSpell('blade_of_justice', {
      id: 184575,
      name: 'Blade of Justice',
      castTime: 0,
      cooldown: 12000,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 1.75,
          coefficient: 1.75,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Generate Holy Power
        this.generateHolyPower(2);

        // Art of War proc chance
        if (Math.random() < 0.2) {
          this.artOfWar = true;
        }

        return damage;
      }
    });

    // Templar's Verdict - Main spender
    this.registerSpell('templars_verdict', {
      id: 85256,
      name: "Templar's Verdict",
      castTime: 0,
      holyPowerCost: 3,
      execute: (target) => {
        const holyPower = this.resources.current[RESOURCE_TYPE.HOLY_POWER];

        const damage = this.calculateDamage({
          baseDamage: this.attackPower * (2.08 * holyPower),
          coefficient: 2.08 * holyPower,
          damageType: DAMAGE_TYPE.HOLY,
          target: target,
          canCrit: true
        });

        // Consume Holy Power or Divine Purpose
        if (this.divinePurpose) {
          this.divinePurpose = false;
        } else {
          this.consumeHolyPower();
        }

        // Divine Purpose proc chance
        if (Math.random() < 0.15) {
          this.divinePurpose = true;
        }

        // Empyrean Power proc
        if (this.empyreanPower) {
          this.empyreanPower = false;
          // Next Divine Storm is free and empowered
          this.applyBuff('empyrean_power_buff', {
            duration: 15000,
            nextDivineStormFree: true
          });
        }

        return damage;
      }
    });

    // Divine Storm - AoE spender
    this.registerSpell('divine_storm', {
      id: 53385,
      name: 'Divine Storm',
      castTime: 0,
      holyPowerCost: 3,
      execute: () => {
        const targets = this.sim.getTargetsInRange(this.position, 8);
        let totalDamage = 0;

        const empowered = this.hasBuff('empyrean_power_buff');
        const coefficient = empowered ? 1.872 : 1.248;

        targets.forEach(target => {
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * coefficient,
            coefficient: coefficient,
            damageType: DAMAGE_TYPE.HOLY,
            target: target,
            canCrit: true
          });

          totalDamage += damage;
        });

        // Consume Holy Power or Divine Purpose
        if (this.divinePurpose) {
          this.divinePurpose = false;
        } else if (!empowered) {
          this.consumeHolyPower();
        }

        if (empowered) {
          this.removeBuff('empyrean_power_buff');
        }

        // Divine Purpose proc chance
        if (Math.random() < 0.15) {
          this.divinePurpose = true;
        }

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Wake of Ashes - AoE burst
    this.registerSpell('wake_of_ashes', {
      id: 255937,
      name: 'Wake of Ashes',
      castTime: 0,
      cooldown: 45000,
      execute: () => {
        const targets = this.sim.getTargetsInCone(this.position, this.facing, 12, 90);
        let totalDamage = 0;

        targets.forEach(target => {
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * 2.5,
            coefficient: 2.5,
            damageType: DAMAGE_TYPE.RADIANT,
            target: target,
            canCrit: true
          });

          totalDamage += damage;

          // Stun undead/demons
          if (target.type === 'undead' || target.type === 'demon') {
            target.applyDebuff('wake_of_ashes_stun', {
              duration: 5000,
              stunned: true
            });
          }
        });

        // Generate 3 Holy Power
        this.generateHolyPower(3);

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Judgment - Retribution version
    this.registerSpell('judgment', {
      id: 20271,
      name: 'Judgment',
      castTime: 0,
      cooldown: 10000,
      range: 30,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 1.2,
          coefficient: 1.2,
          damageType: DAMAGE_TYPE.HOLY,
          target: target,
          canCrit: true
        });

        // Generate 1 Holy Power
        this.generateHolyPower(1);

        // Apply debuff for increased damage
        target.applyDebuff('judgment', {
          duration: 15000,
          holyDamageIncrease: 0.25 // 25% increased holy damage
        });

        // Empyrean Power proc chance
        if (Math.random() < 0.15) {
          this.empyreanPower = true;
        }

        return damage;
      }
    });

    // Crusader Strike - Basic builder
    this.registerSpell('crusader_strike', {
      id: 35395,
      name: 'Crusader Strike',
      castTime: 0,
      cooldown: 6000,
      charges: 2,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 1.08,
          coefficient: 1.08,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Generate 1 Holy Power
        this.generateHolyPower(1);

        // Art of War proc chance
        if (Math.random() < 0.15) {
          this.artOfWar = true;
        }

        return damage;
      }
    });

    // Shield of Vengeance - Absorb shield
    this.registerSpell('shield_of_vengeance', {
      id: 184662,
      name: 'Shield of Vengeance',
      castTime: 0,
      cooldown: 120000,
      execute: () => {
        const shieldAmount = this.maxHealth * 0.3;

        this.shieldOfVengeance = {
          active: true,
          absorbed: 0,
          maxAbsorb: shieldAmount
        };

        this.applyBuff('shield_of_vengeance', {
          duration: 15000,
          shield: shieldAmount,
          onDamageTaken: (damage) => {
            const absorbed = Math.min(damage, shieldAmount - this.shieldOfVengeance.absorbed);
            this.shieldOfVengeance.absorbed += absorbed;

            if (this.shieldOfVengeance.absorbed >= shieldAmount) {
              this.explodeShieldOfVengeance();
            }

            return damage - absorbed;
          },
          onExpire: () => {
            this.explodeShieldOfVengeance();
          }
        });

        return { shield: shieldAmount };
      }
    });

    // Crusade - Alternative to Avenging Wrath
    this.registerSpell('crusade', {
      id: 231895,
      name: 'Crusade',
      castTime: 0,
      cooldown: 120000,
      execute: () => {
        this.applyBuff('crusade', {
          duration: 35000,
          stacks: 0,
          maxStacks: 10,
          damagePerStack: 0.03, // 3% damage per stack
          hastePerStack: 0.03,  // 3% haste per stack
          onHolyPowerSpent: () => {
            const current = this.getBuffStacks('crusade');
            if (current < 10) {
              this.modifyBuffStacks('crusade', 1);
            }
          }
        });

        return { success: true };
      }
    });

    // Final Reckoning - Ground effect
    this.registerSpell('final_reckoning', {
      id: 343721,
      name: 'Final Reckoning',
      castTime: 0,
      cooldown: 120000,
      execute: (position) => {
        this.finalReckoning = {
          active: true,
          position: position,
          radius: 8,
          duration: 8000,
          damageBonus: 0.5 // 50% damage increase
        };

        // Enemies in area take increased damage
        const enemies = this.sim.getTargetsInRange(position, 8);
        enemies.forEach(enemy => {
          enemy.applyDebuff('final_reckoning', {
            duration: 8000,
            damageIncrease: 0.5
          });
        });

        return { success: true };
      }
    });
  }

  // Holy Power management
  generateHolyPower(amount) {
    const current = this.resources.current[RESOURCE_TYPE.HOLY_POWER];
    const max = this.resources.max[RESOURCE_TYPE.HOLY_POWER];

    this.resources.current[RESOURCE_TYPE.HOLY_POWER] = Math.min(current + amount, max);

    // Trigger Crusade stacking
    if (this.hasBuff('crusade')) {
      this.getBuffData('crusade').onHolyPowerSpent();
    }
  }

  consumeHolyPower() {
    this.resources.current[RESOURCE_TYPE.HOLY_POWER] = 0;
  }

  // Consecration tick
  consecrationTick() {
    if (!this.consecration.active) return;

    const targets = this.sim.getTargetsInRange(this.consecration.position, this.consecration.radius);
    let totalDamage = 0;

    targets.forEach(target => {
      const damage = this.calculateDamage({
        baseDamage: this.attackPower * 0.096,
        coefficient: 0.096,
        damageType: DAMAGE_TYPE.HOLY,
        target: target,
        canCrit: false,
        isDot: true
      });

      totalDamage += damage;
      this.consecration.targets.add(target.id);

      // Protection: Reduces damage taken from targets standing in it
      if (this.currentSpec === 'protection') {
        target.applyDebuff('consecration_debuff', {
          duration: 1500,
          damageReduction: 0.05
        });
      }
    });

    this.consecration.duration -= 1000;

    if (this.consecration.duration > 0) {
      this.sim.registerCallback(this.sim.currentTime + 1000, () => {
        this.consecrationTick();
      });
    } else {
      this.consecration.active = false;
    }
  }

  // Light's Hammer tick (Holy)
  lightsHammerTick() {
    if (!this.lightsHammer || !this.lightsHammer.active) return;

    // Damage enemies
    const enemies = this.sim.getEnemiesInRange(this.lightsHammer.position, this.lightsHammer.radius);
    enemies.forEach(enemy => {
      const damage = this.calculateDamage({
        baseDamage: this.spellPower * 0.418,
        coefficient: 0.418,
        damageType: DAMAGE_TYPE.HOLY,
        target: enemy,
        canCrit: true
      });
    });

    // Heal allies
    const allies = this.sim.getAlliesInRange(this.lightsHammer.position, this.lightsHammer.radius, 6);
    allies.forEach(ally => {
      const healing = this.calculateHealing({
        baseHealing: this.spellPower * 0.506,
        coefficient: 0.506,
        target: ally,
        canCrit: false
      });
      ally.heal(healing);
    });

    this.lightsHammer.duration -= this.lightsHammer.tickInterval;

    if (this.lightsHammer.duration > 0) {
      this.sim.registerCallback(
        this.sim.currentTime + this.lightsHammer.tickInterval,
        () => this.lightsHammerTick()
      );
    } else {
      this.lightsHammer.active = false;
    }
  }

  // Blessed Hammer tick (Protection)
  blessedHammerTick(hammer) {
    if (!hammer || hammer.duration <= 0) return;

    // Rotate hammer around paladin
    hammer.rotation += Math.PI / 4; // 45 degrees per tick
    const x = this.position.x + Math.cos(hammer.rotation) * hammer.radius;
    const y = this.position.y + Math.sin(hammer.rotation) * hammer.radius;
    hammer.position = { x, y };

    // Damage enemies hit by hammer
    const enemies = this.sim.getTargetsInRange(hammer.position, 2);
    enemies.forEach(enemy => {
      // Only hit each enemy once per revolution
      if (!hammer.hitTargets) hammer.hitTargets = new Set();

      if (!hammer.hitTargets.has(enemy.id)) {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 0.18,
          coefficient: 0.18,
          damageType: DAMAGE_TYPE.HOLY,
          target: enemy,
          canCrit: false
        });

        hammer.hitTargets.add(enemy.id);

        // Apply debuff
        enemy.applyDebuff('blessed_hammer', {
          duration: 3000,
          autoAttackReduction: 0.15
        });
      }
    });

    // Clear hit targets after full rotation
    if (hammer.rotation >= Math.PI * 2) {
      hammer.rotation = 0;
      hammer.hitTargets.clear();
    }

    hammer.duration -= 250;

    if (hammer.duration > 0) {
      this.sim.registerCallback(this.sim.currentTime + 250, () => {
        this.blessedHammerTick(hammer);
      });
    }
  }

  // Glimmer of Light application (Holy)
  applyGlimmer(target) {
    if (this.glimmerTargets.size >= 8) {
      // Remove oldest glimmer
      const oldest = this.glimmerTargets.values().next().value;
      this.glimmerTargets.delete(oldest);
      const oldestTarget = this.sim.getEntityById(oldest);
      if (oldestTarget) {
        oldestTarget.removeBuff('glimmer_of_light');
      }
    }

    this.glimmerTargets.add(target.id);

    target.applyBuff('glimmer_of_light', {
      duration: 30000,
      source: this,
      onHealingReceived: (amount, source) => {
        // Trigger glimmer healing on all glimmer targets
        if (source === this) {
          this.glimmerTargets.forEach(targetId => {
            if (targetId !== target.id) {
              const glimmerTarget = this.sim.getEntityById(targetId);
              if (glimmerTarget) {
                const glimmerHeal = amount * 0.25;
                glimmerTarget.heal(glimmerHeal);
              }
            }
          });
        }
      },
      onExpire: () => {
        this.glimmerTargets.delete(target.id);
      }
    });
  }

  // Shield of Vengeance explosion
  explodeShieldOfVengeance() {
    if (!this.shieldOfVengeance.active) return;

    const damage = this.shieldOfVengeance.absorbed;
    const enemies = this.sim.getTargetsInRange(this.position, 8);

    enemies.forEach(enemy => {
      enemy.takeDamage({
        amount: damage / enemies.length,
        type: DAMAGE_TYPE.HOLY,
        source: this
      });
    });

    this.shieldOfVengeance.active = false;
    this.removeBuff('shield_of_vengeance');
  }

  // Update method
  update(deltaTime) {
    super.update(deltaTime);

    // Mana regeneration for Holy
    if (this.currentSpec === 'holy') {
      const manaRegen = this.resources.max[RESOURCE_TYPE.MANA] * 0.02; // 2% per second
      this.resources.current[RESOURCE_TYPE.MANA] = Math.min(
        this.resources.current[RESOURCE_TYPE.MANA] + manaRegen * (deltaTime / 1000),
        this.resources.max[RESOURCE_TYPE.MANA]
      );
    }

    // Check for Divine Purpose expiry
    if (this.divinePurpose && !this.hasBuff('divine_purpose')) {
      this.divinePurpose = false;
    }
  }
}

// Ancient King Guardian pet for Protection
class AncientKingGuardian {
  constructor(owner) {
    this.owner = owner;
    this.sim = owner.sim;
    this.name = `${owner.name}'s Ancient Guardian`;

    this.duration = 8000;
    this.active = false;
  }

  spawn() {
    this.active = true;
    this.sim.registerPet(this);

    // Taunt and tank
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

    const target = this.owner.target;
    if (target) {
      // Taunt target
      target.threatTable.setThreat(this, Infinity);

      // Deal damage
      const damage = this.owner.calculateDamage({
        baseDamage: this.owner.attackPower * 0.5,
        coefficient: 0.5,
        damageType: DAMAGE_TYPE.HOLY,
        target: target,
        canCrit: false,
        source: this
      });
    }

    // Next action
    this.sim.registerCallback(this.sim.currentTime + 1500, () => {
      this.performAction();
    });
  }
}