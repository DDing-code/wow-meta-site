// Druid class implementation
// Implements Balance (DPS), Feral (DPS), Guardian (Tank), and Restoration (Healer) specializations

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

export class Druid extends Player {
  constructor(sim, name) {
    super(sim, name);
    this.class = 'druid';

    // Druid specific resources
    this.primaryResource = RESOURCE_TYPE.MANA;
    this.resources.base[RESOURCE_TYPE.MANA] = 10000;
    this.resources.max[RESOURCE_TYPE.MANA] = 10000;
    this.resources.current[RESOURCE_TYPE.MANA] = 10000;

    // Form-specific resources
    this.resources.base[RESOURCE_TYPE.ENERGY] = 100;
    this.resources.max[RESOURCE_TYPE.ENERGY] = 100;
    this.resources.base[RESOURCE_TYPE.RAGE] = 0;
    this.resources.max[RESOURCE_TYPE.RAGE] = 100;
    this.resources.base[RESOURCE_TYPE.COMBO_POINTS] = 0;
    this.resources.max[RESOURCE_TYPE.COMBO_POINTS] = 5;

    // Astral Power for Balance
    this.resources.base[RESOURCE_TYPE.ASTRAL_POWER] = 0;
    this.resources.max[RESOURCE_TYPE.ASTRAL_POWER] = 100;

    // Form management
    this.currentForm = 'humanoid';
    this.formBonuses = {
      cat: { agility: 1.15, energyRegen: 10 },
      bear: { armor: 2.2, stamina: 1.25, damageReduction: 0.2 },
      moonkin: { armor: 1.25, spellPower: 1.1 },
      tree: { healingPower: 1.15, manaRegen: 1.5 }
    };

    // Eclipse system for Balance
    this.eclipse = {
      solar: false,
      lunar: false,
      solarPower: 0,
      lunarPower: 0,
      maxPower: 100
    };

    // Combo points for Feral
    this.comboPoints = 0;
    this.maxComboPoints = 5;

    // Bleeds tracking for Feral
    this.bleeds = new Map();

    // HoTs tracking for Restoration
    this.hots = new Map();

    // Efflorescence ground effect
    this.efflorescence = {
      active: false,
      position: null,
      radius: 10,
      duration: 0,
      healTargets: new Set()
    };

    // Lifebloom tracking
    this.lifebloom = new Map();

    // Wild Mushrooms for Balance
    this.wildMushrooms = [];
    this.maxMushrooms = 3;

    // Force of Nature treants
    this.treants = [];
  }

  // Initialize specialization
  setSpec(spec) {
    super.setSpec(spec);

    switch(spec) {
      case 'balance':
        this.specRole = SPEC_ROLE.DPS;
        this.initBalanceAbilities();
        this.enterMoonkinForm();
        break;
      case 'feral':
        this.specRole = SPEC_ROLE.DPS;
        this.initFeralAbilities();
        this.enterCatForm();
        break;
      case 'guardian':
        this.specRole = SPEC_ROLE.TANK;
        this.initGuardianAbilities();
        this.enterBearForm();
        break;
      case 'restoration':
        this.specRole = SPEC_ROLE.HEALER;
        this.initRestorationAbilities();
        break;
    }

    this.initBaseAbilities();
  }

  // Form management
  enterCatForm() {
    this.currentForm = 'cat';
    this.primaryResource = RESOURCE_TYPE.ENERGY;
    this.applyFormBonuses('cat');

    // Reset energy
    this.resources.current[RESOURCE_TYPE.ENERGY] = this.resources.max[RESOURCE_TYPE.ENERGY];

    this.applyBuff('cat_form', {
      duration: -1, // Permanent until form change
      moveSpeed: 1.3 // 30% movement speed
    });
  }

  enterBearForm() {
    this.currentForm = 'bear';
    this.primaryResource = RESOURCE_TYPE.RAGE;
    this.applyFormBonuses('bear');

    // Generate initial rage
    this.resources.current[RESOURCE_TYPE.RAGE] = 25;

    this.applyBuff('bear_form', {
      duration: -1,
      threatModifier: 2.0, // 200% threat
      damageReduction: this.formBonuses.bear.damageReduction
    });
  }

  enterMoonkinForm() {
    this.currentForm = 'moonkin';
    this.primaryResource = RESOURCE_TYPE.ASTRAL_POWER;
    this.applyFormBonuses('moonkin');

    this.applyBuff('moonkin_form', {
      duration: -1,
      arcaneAndNatureDamage: 1.1 // 10% increased damage
    });
  }

  exitForm() {
    this.removeBuff(`${this.currentForm}_form`);
    this.currentForm = 'humanoid';
    this.primaryResource = RESOURCE_TYPE.MANA;
    this.removeFormBonuses();
  }

  applyFormBonuses(form) {
    const bonuses = this.formBonuses[form];
    if (bonuses) {
      Object.entries(bonuses).forEach(([stat, multiplier]) => {
        this.stats[stat] = (this.stats[stat] || 1) * multiplier;
      });
    }
  }

  removeFormBonuses() {
    // Reset stats to base values
    this.calculateStats();
  }

  // Initialize base Druid abilities
  initBaseAbilities() {
    // Barkskin - Damage reduction
    this.registerSpell('barkskin', {
      id: 22812,
      name: 'Barkskin',
      castTime: 0,
      cooldown: 60000,
      usableWhileStunned: true,
      execute: () => {
        this.applyBuff('barkskin', {
          duration: 12000,
          damageReduction: 0.2 // 20% damage reduction
        });

        return { success: true };
      }
    });

    // Innervate - Mana restoration
    this.registerSpell('innervate', {
      id: 29166,
      name: 'Innervate',
      castTime: 0,
      cooldown: 180000,
      execute: (target) => {
        target.applyBuff('innervate', {
          duration: 10000,
          manaRegen: 10, // 10% mana per second
          onTick: () => {
            const manaRestored = target.resources.max[RESOURCE_TYPE.MANA] * 0.1;
            target.resources.current[RESOURCE_TYPE.MANA] = Math.min(
              target.resources.current[RESOURCE_TYPE.MANA] + manaRestored,
              target.resources.max[RESOURCE_TYPE.MANA]
            );
          }
        });

        return { success: true };
      }
    });

    // Regrowth - Direct heal + HoT
    this.registerSpell('regrowth', {
      id: 8936,
      name: 'Regrowth',
      castTime: 1500,
      manaCost: 1700,
      execute: (target) => {
        // Direct heal
        const directHeal = this.calculateHealing({
          baseHealing: this.spellPower * 1.95,
          coefficient: 1.95,
          target: target,
          canCrit: true
        });

        // Apply HoT
        this.applyHoT(target, 'regrowth', {
          duration: 12000,
          tickInterval: 2000,
          healPerTick: this.spellPower * 0.37,
          canRefresh: true
        });

        return { healing: directHeal };
      }
    });

    // Rebirth - Battle resurrection
    this.registerSpell('rebirth', {
      id: 20484,
      name: 'Rebirth',
      castTime: 2000,
      cooldown: 600000, // 10 minute CD
      combatOnly: true,
      execute: (target) => {
        if (!target.isDead) {
          return { error: 'Target is not dead' };
        }

        target.resurrect({
          healthPercent: 0.6, // 60% health
          manaPercent: 0.2   // 20% mana
        });

        return { success: true };
      }
    });

    // Remove Corruption - Dispel
    this.registerSpell('remove_corruption', {
      id: 2782,
      name: 'Remove Corruption',
      castTime: 0,
      cooldown: 8000,
      manaCost: 400,
      execute: (target) => {
        // Remove one curse and one poison
        target.dispelDebuff('curse');
        target.dispelDebuff('poison');

        return { success: true };
      }
    });
  }

  // Balance specialization abilities
  initBalanceAbilities() {
    // Starfire - Lunar spell
    this.registerSpell('starfire', {
      id: 194153,
      name: 'Starfire',
      castTime: 2500,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.spellPower * 2.3,
          coefficient: 2.3,
          damageType: DAMAGE_TYPE.ARCANE,
          target: target,
          canCrit: true
        });

        // Generate Astral Power
        this.generateAstralPower(8);

        // Solar empowerment
        if (this.eclipse.solar) {
          this.generateAstralPower(2); // Bonus AP
        }

        return damage;
      }
    });

    // Wrath - Solar spell
    this.registerSpell('wrath', {
      id: 190984,
      name: 'Wrath',
      castTime: 1500,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.spellPower * 0.92,
          coefficient: 0.92,
          damageType: DAMAGE_TYPE.NATURE,
          target: target,
          canCrit: true
        });

        // Generate Astral Power
        this.generateAstralPower(6);

        // Lunar empowerment
        if (this.eclipse.lunar) {
          this.generateAstralPower(2); // Bonus AP
        }

        return damage;
      }
    });

    // Starsurge - Astral Power spender
    this.registerSpell('starsurge', {
      id: 78674,
      name: 'Starsurge',
      castTime: 0,
      astralPowerCost: 30,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.spellPower * 2.8,
          coefficient: 2.8,
          damageType: DAMAGE_TYPE.ASTRAL,
          target: target,
          canCrit: true
        });

        // Trigger Eclipse
        if (Math.random() < 0.5) {
          this.enterSolarEclipse();
        } else {
          this.enterLunarEclipse();
        }

        // Empower next 2 casts
        this.applyBuff('starsurge_empowerment', {
          duration: 15000,
          stacks: 2,
          maxStacks: 2,
          onSpellCast: (spell) => {
            if (spell === 'wrath' || spell === 'starfire') {
              return { damageBonus: 1.2 }; // 20% damage increase
            }
          }
        });

        return damage;
      }
    });

    // Starfall - AoE Astral Power spender
    this.registerSpell('starfall', {
      id: 191034,
      name: 'Starfall',
      castTime: 0,
      astralPowerCost: 50,
      execute: () => {
        this.applyBuff('starfall', {
          duration: 8000,
          tickInterval: 500, // Hits every 0.5 seconds
          onTick: () => {
            const targets = this.sim.getTargetsInRange(this.position, 15);
            let totalDamage = 0;

            targets.forEach(target => {
              const damage = this.calculateDamage({
                baseDamage: this.spellPower * 0.33,
                coefficient: 0.33,
                damageType: DAMAGE_TYPE.ASTRAL,
                target: target,
                canCrit: true
              });
              totalDamage += damage;
            });

            return totalDamage;
          }
        });

        return { success: true };
      }
    });

    // Moonfire - DoT
    this.registerSpell('moonfire', {
      id: 8921,
      name: 'Moonfire',
      castTime: 0,
      execute: (target) => {
        // Initial damage
        const initialDamage = this.calculateDamage({
          baseDamage: this.spellPower * 0.25,
          coefficient: 0.25,
          damageType: DAMAGE_TYPE.ARCANE,
          target: target,
          canCrit: true
        });

        // Apply DoT
        target.applyDebuff('moonfire', {
          duration: 22000,
          tickInterval: 2000,
          source: this,
          onTick: () => {
            return this.calculateDamage({
              baseDamage: this.spellPower * 0.15,
              coefficient: 0.15,
              damageType: DAMAGE_TYPE.ARCANE,
              target: target,
              canCrit: false,
              isDot: true
            });
          }
        });

        // Generate Astral Power
        this.generateAstralPower(2);

        return initialDamage;
      }
    });

    // Sunfire - AoE DoT
    this.registerSpell('sunfire', {
      id: 93402,
      name: 'Sunfire',
      castTime: 0,
      execute: (target) => {
        const targets = this.sim.getTargetsInRange(target.position, 8);
        let totalDamage = 0;

        targets.forEach(t => {
          // Initial damage
          const damage = this.calculateDamage({
            baseDamage: this.spellPower * 0.2,
            coefficient: 0.2,
            damageType: DAMAGE_TYPE.NATURE,
            target: t,
            canCrit: true
          });

          totalDamage += damage;

          // Apply DoT
          t.applyDebuff('sunfire', {
            duration: 18000,
            tickInterval: 2000,
            source: this,
            onTick: () => {
              return this.calculateDamage({
                baseDamage: this.spellPower * 0.13,
                coefficient: 0.13,
                damageType: DAMAGE_TYPE.NATURE,
                target: t,
                canCrit: false,
                isDot: true
              });
            }
          });
        });

        // Generate Astral Power
        this.generateAstralPower(2);

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Celestial Alignment - DPS cooldown
    this.registerSpell('celestial_alignment', {
      id: 194223,
      name: 'Celestial Alignment',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        this.applyBuff('celestial_alignment', {
          duration: 20000,
          hasteBonus: 0.15, // 15% haste
          critBonus: 0.15,  // 15% crit
          onApply: () => {
            // Enter both eclipses
            this.enterSolarEclipse();
            this.enterLunarEclipse();
          }
        });

        return { success: true };
      }
    });

    // Force of Nature - Summon treants
    this.registerSpell('force_of_nature', {
      id: 205636,
      name: 'Force of Nature',
      castTime: 0,
      cooldown: 60000,
      execute: () => {
        // Summon 3 treants
        for (let i = 0; i < 3; i++) {
          const treant = new DruidTreant(this);
          this.treants.push(treant);
          treant.spawn();
        }

        return { success: true };
      }
    });
  }

  // Feral specialization abilities
  initFeralAbilities() {
    // Shred - Main CP builder
    this.registerSpell('shred', {
      id: 5221,
      name: 'Shred',
      castTime: 0,
      energyCost: 40,
      requiresForm: 'cat',
      requiresBehind: true,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 3.6,
          coefficient: 3.6,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Generate combo points
        this.generateComboPoints(1);

        // Apply bleed amplification
        if (this.targetHasBleed(target)) {
          return damage * 1.2; // 20% more damage to bleeding targets
        }

        return damage;
      }
    });

    // Rake - Bleed + stun from stealth
    this.registerSpell('rake', {
      id: 1822,
      name: 'Rake',
      castTime: 0,
      energyCost: 35,
      requiresForm: 'cat',
      execute: (target) => {
        // Initial damage
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 0.66,
          coefficient: 0.66,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Stun if from stealth
        if (this.isStealthed()) {
          target.applyDebuff('rake_stun', {
            duration: 4000,
            stunned: true
          });
        }

        // Apply bleed
        this.applyBleed(target, 'rake', {
          duration: 15000,
          tickInterval: 3000,
          damagePerTick: this.attackPower * 0.392,
          canRefresh: true
        });

        // Generate combo point
        this.generateComboPoints(1);

        return damage;
      }
    });

    // Rip - Finisher bleed
    this.registerSpell('rip', {
      id: 1079,
      name: 'Rip',
      castTime: 0,
      energyCost: 20,
      requiresForm: 'cat',
      requiresComboPoints: true,
      execute: (target) => {
        const comboPoints = this.comboPoints;

        // Apply bleed based on combo points
        this.applyBleed(target, 'rip', {
          duration: 4000 + (comboPoints * 4000), // 4 sec + 4 sec per CP
          tickInterval: 2000,
          damagePerTick: this.attackPower * (0.5 + 0.2 * comboPoints),
          canRefresh: true,
          pandemic: true // Can refresh in pandemic window
        });

        this.consumeComboPoints();

        return { success: true };
      }
    });

    // Ferocious Bite - Direct damage finisher
    this.registerSpell('ferocious_bite', {
      id: 22568,
      name: 'Ferocious Bite',
      castTime: 0,
      energyCost: 25,
      maxEnergyCost: 50, // Can consume up to 50 energy for more damage
      requiresForm: 'cat',
      requiresComboPoints: true,
      execute: (target) => {
        const comboPoints = this.comboPoints;
        const currentEnergy = this.resources.current[RESOURCE_TYPE.ENERGY];
        const extraEnergy = Math.min(currentEnergy - 25, 25); // Up to 25 extra

        // Base damage scales with combo points and extra energy
        const baseDamage = this.attackPower * (1.0 + 0.5 * comboPoints);
        const energyBonus = 1 + (extraEnergy / 25) * 0.5; // Up to 50% more

        const damage = this.calculateDamage({
          baseDamage: baseDamage * energyBonus,
          coefficient: 1.0 + 0.5 * comboPoints,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Consume energy
        this.resources.current[RESOURCE_TYPE.ENERGY] -= (25 + extraEnergy);

        // Refresh Rip if target is below 25% health
        if (target.getHealthPercent() < 0.25 && this.targetHasBleed(target, 'rip')) {
          this.refreshBleed(target, 'rip');
        }

        this.consumeComboPoints();

        return damage;
      }
    });

    // Thrash - AoE bleed
    this.registerSpell('thrash_cat', {
      id: 106830,
      name: 'Thrash',
      castTime: 0,
      energyCost: 45,
      requiresForm: 'cat',
      execute: () => {
        const targets = this.sim.getTargetsInRange(this.position, 8);
        let totalDamage = 0;

        targets.forEach(target => {
          // Initial damage
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * 1.42,
            coefficient: 1.42,
            damageType: DAMAGE_TYPE.PHYSICAL,
            target: target,
            canCrit: true
          });

          totalDamage += damage;

          // Apply bleed
          this.applyBleed(target, 'thrash', {
            duration: 15000,
            tickInterval: 3000,
            damagePerTick: this.attackPower * 0.156,
            canStack: true,
            maxStacks: 3
          });
        });

        // Generate combo point
        this.generateComboPoints(1);

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Tiger's Fury - Damage buff
    this.registerSpell('tigers_fury', {
      id: 5217,
      name: "Tiger's Fury",
      castTime: 0,
      cooldown: 30000,
      offGCD: true,
      execute: () => {
        this.applyBuff('tigers_fury', {
          duration: 10000,
          damageBonus: 1.15, // 15% damage increase
          onApply: () => {
            // Restore 60 energy
            this.resources.current[RESOURCE_TYPE.ENERGY] = Math.min(
              this.resources.current[RESOURCE_TYPE.ENERGY] + 60,
              this.resources.max[RESOURCE_TYPE.ENERGY]
            );
          }
        });

        return { success: true };
      }
    });

    // Berserk - Major DPS cooldown
    this.registerSpell('berserk', {
      id: 106951,
      name: 'Berserk',
      castTime: 0,
      cooldown: 180000,
      requiresForm: 'cat',
      execute: () => {
        this.applyBuff('berserk', {
          duration: 15000,
          energyCostReduction: 0.5, // 50% energy cost reduction
          maxComboPointsBonus: 1, // +1 max combo points
          onApply: () => {
            this.maxComboPoints = 6;
          },
          onExpire: () => {
            this.maxComboPoints = 5;
          }
        });

        return { success: true };
      }
    });

    // Prowl - Stealth
    this.registerSpell('prowl', {
      id: 5215,
      name: 'Prowl',
      castTime: 0,
      cooldown: 6000,
      requiresForm: 'cat',
      outOfCombatOnly: true,
      execute: () => {
        this.applyBuff('prowl', {
          duration: 10000,
          stealth: true,
          moveSpeedReduction: 0.3, // 30% slower while stealthed
          onBreak: () => {
            // Stealth breaks on action or damage
          }
        });

        return { success: true };
      }
    });
  }

  // Guardian specialization abilities
  initGuardianAbilities() {
    // Mangle - Main rage builder
    this.registerSpell('mangle', {
      id: 33917,
      name: 'Mangle',
      castTime: 0,
      cooldown: 6000,
      requiresForm: 'bear',
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 3.0,
          coefficient: 3.0,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Generate rage
        this.generateRage(10);

        // Apply debuff
        target.applyDebuff('mangle', {
          duration: 15000,
          bleedDamageIncrease: 0.3 // 30% increased bleed damage
        });

        return damage;
      }
    });

    // Thrash - AoE threat
    this.registerSpell('thrash_bear', {
      id: 77758,
      name: 'Thrash',
      castTime: 0,
      cooldown: 6000,
      rageCost: 0,
      requiresForm: 'bear',
      execute: () => {
        const targets = this.sim.getTargetsInRange(this.position, 8);
        let totalDamage = 0;

        targets.forEach(target => {
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * 1.02,
            coefficient: 1.02,
            damageType: DAMAGE_TYPE.PHYSICAL,
            target: target,
            canCrit: true,
            threatModifier: 4.0 // High threat
          });

          totalDamage += damage;

          // Apply bleed
          this.applyBleed(target, 'thrash_bear', {
            duration: 15000,
            tickInterval: 3000,
            damagePerTick: this.attackPower * 0.12,
            canStack: true,
            maxStacks: 3
          });
        });

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Ironfur - Active mitigation
    this.registerSpell('ironfur', {
      id: 192081,
      name: 'Ironfur',
      castTime: 0,
      rageCost: 40,
      requiresForm: 'bear',
      execute: () => {
        const armorIncrease = this.agility * 2;

        this.applyBuff('ironfur', {
          duration: 7000,
          armorBonus: armorIncrease,
          canStack: true,
          maxStacks: 100,
          onStack: (stacks) => {
            // Each stack provides independent armor
            this.armor += armorIncrease;
          }
        });

        // Trigger Guardian of Elune
        if (this.talents.guardianOfElune) {
          this.applyBuff('guardian_of_elune', {
            duration: 15000,
            nextIronfurBonus: 0.5 // 50% increased effect
          });
        }

        return { success: true };
      }
    });

    // Frenzied Regeneration - Self heal
    this.registerSpell('frenzied_regeneration', {
      id: 22842,
      name: 'Frenzied Regeneration',
      castTime: 0,
      cooldown: 0,
      charges: 2,
      chargeTime: 36000,
      rageCost: 10,
      requiresForm: 'bear',
      execute: () => {
        this.applyBuff('frenzied_regeneration', {
          duration: 3000,
          tickInterval: 1000,
          onTick: () => {
            // Heal for 24% max health over 3 seconds
            const healAmount = this.maxHealth * 0.08;
            this.heal(healAmount);
          }
        });

        return { success: true };
      }
    });

    // Survival Instincts - Defensive cooldown
    this.registerSpell('survival_instincts', {
      id: 61336,
      name: 'Survival Instincts',
      castTime: 0,
      cooldown: 120000,
      charges: 2,
      requiresForm: 'bear',
      execute: () => {
        this.applyBuff('survival_instincts', {
          duration: 6000,
          damageReduction: 0.5 // 50% damage reduction
        });

        return { success: true };
      }
    });

    // Incarnation: Guardian of Ursoc
    this.registerSpell('incarnation_guardian', {
      id: 102558,
      name: 'Incarnation: Guardian of Ursoc',
      castTime: 0,
      cooldown: 180000,
      requiresForm: 'bear',
      execute: () => {
        this.applyBuff('incarnation_guardian', {
          duration: 30000,
          healthBonus: 0.3, // 30% health increase
          armorBonus: this.armor * 0.75, // 75% armor increase
          onApply: () => {
            this.currentHealth *= 1.3;
            this.maxHealth *= 1.3;
          },
          onExpire: () => {
            this.maxHealth /= 1.3;
            this.currentHealth = Math.min(this.currentHealth, this.maxHealth);
          }
        });

        return { success: true };
      }
    });

    // Pulverize - Consume Thrash stacks
    this.registerSpell('pulverize', {
      id: 80313,
      name: 'Pulverize',
      castTime: 0,
      requiresForm: 'bear',
      requiresThrashStacks: 2,
      execute: (target) => {
        const thrashStacks = this.getBleedStacks(target, 'thrash_bear');
        if (thrashStacks < 2) {
          return { error: 'Requires 2 Thrash stacks' };
        }

        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 5.0,
          coefficient: 5.0,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Consume Thrash stacks
        this.consumeBleedStacks(target, 'thrash_bear', 2);

        // Apply damage reduction buff
        this.applyBuff('pulverize', {
          duration: 10000,
          damageReduction: 0.09 // 9% damage reduction
        });

        return damage;
      }
    });
  }

  // Restoration specialization abilities
  initRestorationAbilities() {
    // Rejuvenation - Core HoT
    this.registerSpell('rejuvenation', {
      id: 774,
      name: 'Rejuvenation',
      castTime: 0,
      manaCost: 1000,
      execute: (target) => {
        this.applyHoT(target, 'rejuvenation', {
          duration: 15000,
          tickInterval: 3000,
          healPerTick: this.spellPower * 0.76,
          canRefresh: true,
          pandemic: true
        });

        return { success: true };
      }
    });

    // Wild Growth - AoE HoT
    this.registerSpell('wild_growth', {
      id: 48438,
      name: 'Wild Growth',
      castTime: 1500,
      cooldown: 10000,
      manaCost: 2200,
      execute: (target) => {
        // Heal up to 5 targets
        const targets = this.sim.getInjuredAlliesInRange(target.position, 30, 5);

        targets.forEach(t => {
          this.applyHoT(t, 'wild_growth', {
            duration: 7000,
            tickInterval: 1000,
            healPerTick: this.spellPower * 0.3,
            decaying: true // Heals less over time
          });
        });

        return { targets: targets.length };
      }
    });

    // Lifebloom - Stacking HoT with bloom
    this.registerSpell('lifebloom', {
      id: 33763,
      name: 'Lifebloom',
      castTime: 0,
      manaCost: 800,
      execute: (target) => {
        this.applyLifebloom(target, {
          duration: 15000,
          tickInterval: 1000,
          healPerTick: this.spellPower * 0.2,
          stacks: 1,
          maxStacks: 3,
          onExpire: () => {
            // Bloom heal when it expires
            const bloomHeal = this.calculateHealing({
              baseHealing: this.spellPower * 1.5,
              coefficient: 1.5,
              target: target,
              canCrit: true
            });
            target.heal(bloomHeal);
          }
        });

        return { success: true };
      }
    });

    // Swiftmend - Instant heal consuming HoT
    this.registerSpell('swiftmend', {
      id: 18562,
      name: 'Swiftmend',
      castTime: 0,
      cooldown: 15000,
      manaCost: 1400,
      execute: (target) => {
        // Requires Rejuvenation, Wild Growth, or Regrowth
        if (!this.targetHasHoT(target, ['rejuvenation', 'wild_growth', 'regrowth'])) {
          return { error: 'Target requires a HoT' };
        }

        const healing = this.calculateHealing({
          baseHealing: this.spellPower * 2.15,
          coefficient: 2.15,
          target: target,
          canCrit: true
        });

        // Leaves behind healing ground effect with talent
        if (this.talents.soulOfTheForest) {
          this.createEfflorescence(target.position);
        }

        return { healing: healing };
      }
    });

    // Efflorescence - Ground healing effect
    this.registerSpell('efflorescence', {
      id: 145205,
      name: 'Efflorescence',
      castTime: 0,
      manaCost: 1700,
      execute: (position) => {
        this.createEfflorescence(position);
        return { success: true };
      }
    });

    // Tranquility - Channeled raid heal
    this.registerSpell('tranquility', {
      id: 740,
      name: 'Tranquility',
      castTime: 8000,
      channeled: true,
      cooldown: 180000,
      manaCost: 1840,
      execute: () => {
        this.applyBuff('tranquility', {
          duration: 8000,
          tickInterval: 2000,
          onTick: () => {
            // Heal all allies in range
            const allies = this.sim.getAlliesInRange(this.position, 40);
            let totalHealing = 0;

            allies.forEach(ally => {
              const healing = this.calculateHealing({
                baseHealing: this.spellPower * 3.58,
                coefficient: 3.58,
                target: ally,
                canCrit: true
              });

              ally.heal(healing);
              totalHealing += healing;

              // Apply HoT
              this.applyHoT(ally, 'tranquility_hot', {
                duration: 8000,
                tickInterval: 2000,
                healPerTick: this.spellPower * 0.46
              });
            });

            return { healing: totalHealing };
          }
        });

        return { success: true };
      }
    });

    // Ironbark - External defensive
    this.registerSpell('ironbark', {
      id: 102342,
      name: 'Ironbark',
      castTime: 0,
      cooldown: 90000,
      execute: (target) => {
        target.applyBuff('ironbark', {
          duration: 12000,
          damageReduction: 0.2 // 20% damage reduction
        });

        return { success: true };
      }
    });

    // Tree of Life - Healing form
    this.registerSpell('incarnation_tree', {
      id: 33891,
      name: 'Incarnation: Tree of Life',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        this.applyBuff('tree_of_life', {
          duration: 30000,
          healingBonus: 1.15, // 15% healing increase
          instantRegrowth: true,
          enhancedRejuv: true,
          onApply: () => {
            this.currentForm = 'tree';
          },
          onExpire: () => {
            this.currentForm = 'humanoid';
          }
        });

        return { success: true };
      }
    });
  }

  // Resource generation methods
  generateAstralPower(amount) {
    this.resources.current[RESOURCE_TYPE.ASTRAL_POWER] = Math.min(
      this.resources.current[RESOURCE_TYPE.ASTRAL_POWER] + amount,
      this.resources.max[RESOURCE_TYPE.ASTRAL_POWER]
    );
  }

  generateComboPoints(amount) {
    const current = this.resources.current[RESOURCE_TYPE.COMBO_POINTS];
    const max = this.resources.max[RESOURCE_TYPE.COMBO_POINTS];

    this.resources.current[RESOURCE_TYPE.COMBO_POINTS] = Math.min(current + amount, max);
    this.comboPoints = this.resources.current[RESOURCE_TYPE.COMBO_POINTS];

    // Trigger primal fury chance for extra CP
    if (this.talents.primalFury && Math.random() < 0.2) {
      this.generateComboPoints(1);
    }
  }

  consumeComboPoints() {
    this.comboPoints = 0;
    this.resources.current[RESOURCE_TYPE.COMBO_POINTS] = 0;
  }

  generateRage(amount) {
    this.resources.current[RESOURCE_TYPE.RAGE] = Math.min(
      this.resources.current[RESOURCE_TYPE.RAGE] + amount,
      this.resources.max[RESOURCE_TYPE.RAGE]
    );
  }

  // Eclipse system
  enterSolarEclipse() {
    this.eclipse.solar = true;
    this.applyBuff('solar_eclipse', {
      duration: 15000,
      wrathDamage: 1.2 // 20% Wrath damage
    });
  }

  enterLunarEclipse() {
    this.eclipse.lunar = true;
    this.applyBuff('lunar_eclipse', {
      duration: 15000,
      starfireDamage: 1.2 // 20% Starfire damage
    });
  }

  // Bleed management
  applyBleed(target, bleedType, options) {
    if (!this.bleeds.has(target.id)) {
      this.bleeds.set(target.id, new Map());
    }

    const targetBleeds = this.bleeds.get(target.id);

    const bleedData = {
      ...options,
      remainingDuration: options.duration,
      lastTick: this.sim.currentTime,
      stacks: options.canStack ? (targetBleeds.get(bleedType)?.stacks || 0) + 1 : 1
    };

    targetBleeds.set(bleedType, bleedData);

    // Register tick
    this.sim.registerCallback(this.sim.currentTime + options.tickInterval, () => {
      this.bleedTick(target, bleedType);
    });
  }

  bleedTick(target, bleedType) {
    const targetBleeds = this.bleeds.get(target.id);
    if (!targetBleeds) return;

    const bleed = targetBleeds.get(bleedType);
    if (!bleed || bleed.remainingDuration <= 0) {
      targetBleeds.delete(bleedType);
      return;
    }

    const damage = this.calculateDamage({
      baseDamage: bleed.damagePerTick * (bleed.stacks || 1),
      coefficient: 1.0,
      damageType: DAMAGE_TYPE.PHYSICAL,
      target: target,
      canCrit: false,
      isDot: true
    });

    bleed.remainingDuration -= bleed.tickInterval;

    if (bleed.remainingDuration > 0) {
      this.sim.registerCallback(
        this.sim.currentTime + bleed.tickInterval,
        () => this.bleedTick(target, bleedType)
      );
    }
  }

  targetHasBleed(target, bleedType = null) {
    const targetBleeds = this.bleeds.get(target.id);
    if (!targetBleeds) return false;

    if (bleedType) {
      return targetBleeds.has(bleedType);
    }

    return targetBleeds.size > 0;
  }

  getBleedStacks(target, bleedType) {
    const targetBleeds = this.bleeds.get(target.id);
    if (!targetBleeds) return 0;

    const bleed = targetBleeds.get(bleedType);
    return bleed ? bleed.stacks : 0;
  }

  consumeBleedStacks(target, bleedType, count) {
    const targetBleeds = this.bleeds.get(target.id);
    if (!targetBleeds) return;

    const bleed = targetBleeds.get(bleedType);
    if (bleed) {
      bleed.stacks = Math.max(0, bleed.stacks - count);
      if (bleed.stacks === 0) {
        targetBleeds.delete(bleedType);
      }
    }
  }

  refreshBleed(target, bleedType) {
    const targetBleeds = this.bleeds.get(target.id);
    if (!targetBleeds) return;

    const bleed = targetBleeds.get(bleedType);
    if (bleed) {
      bleed.remainingDuration = bleed.duration;
    }
  }

  // HoT management
  applyHoT(target, hotType, options) {
    if (!this.hots.has(target.id)) {
      this.hots.set(target.id, new Map());
    }

    const targetHots = this.hots.get(target.id);

    const hotData = {
      ...options,
      remainingDuration: options.duration,
      lastTick: this.sim.currentTime
    };

    targetHots.set(hotType, hotData);

    // Register tick
    this.sim.registerCallback(this.sim.currentTime + options.tickInterval, () => {
      this.hotTick(target, hotType);
    });
  }

  hotTick(target, hotType) {
    const targetHots = this.hots.get(target.id);
    if (!targetHots) return;

    const hot = targetHots.get(hotType);
    if (!hot || hot.remainingDuration <= 0) {
      targetHots.delete(hotType);
      return;
    }

    let healAmount = hot.healPerTick;

    // Handle decaying heals (like Wild Growth)
    if (hot.decaying) {
      const percentRemaining = hot.remainingDuration / hot.duration;
      healAmount *= percentRemaining;
    }

    const healing = this.calculateHealing({
      baseHealing: healAmount,
      coefficient: 1.0,
      target: target,
      canCrit: false,
      isHot: true
    });

    target.heal(healing);
    hot.remainingDuration -= hot.tickInterval;

    if (hot.remainingDuration > 0) {
      this.sim.registerCallback(
        this.sim.currentTime + hot.tickInterval,
        () => this.hotTick(target, hotType)
      );
    }
  }

  targetHasHoT(target, hotTypes) {
    const targetHots = this.hots.get(target.id);
    if (!targetHots) return false;

    if (Array.isArray(hotTypes)) {
      return hotTypes.some(ht => targetHots.has(ht));
    }

    return targetHots.has(hotTypes);
  }

  // Lifebloom special handling
  applyLifebloom(target, options) {
    if (!this.lifebloom.has(target.id)) {
      this.lifebloom.set(target.id, {
        stacks: 0,
        ...options
      });
    }

    const lb = this.lifebloom.get(target.id);
    lb.stacks = Math.min(lb.stacks + 1, lb.maxStacks);
    lb.remainingDuration = options.duration;

    // Apply as HoT
    this.applyHoT(target, 'lifebloom', {
      ...options,
      healPerTick: options.healPerTick * lb.stacks
    });
  }

  // Efflorescence ground effect
  createEfflorescence(position) {
    this.efflorescence = {
      active: true,
      position: position,
      radius: 10,
      duration: 30000,
      tickInterval: 2000,
      lastTick: this.sim.currentTime
    };

    this.efflorescenceTick();
  }

  efflorescenceTick() {
    if (!this.efflorescence.active) return;

    const allies = this.sim.getAlliesInRange(this.efflorescence.position, this.efflorescence.radius);

    // Heal up to 3 most injured allies
    const injured = allies
      .filter(a => a.currentHealth < a.maxHealth)
      .sort((a, b) => a.getHealthPercent() - b.getHealthPercent())
      .slice(0, 3);

    injured.forEach(ally => {
      const healing = this.calculateHealing({
        baseHealing: this.spellPower * 0.35,
        coefficient: 0.35,
        target: ally,
        canCrit: false
      });
      ally.heal(healing);
    });

    this.efflorescence.duration -= this.efflorescence.tickInterval;

    if (this.efflorescence.duration > 0) {
      this.sim.registerCallback(
        this.sim.currentTime + this.efflorescence.tickInterval,
        () => this.efflorescenceTick()
      );
    } else {
      this.efflorescence.active = false;
    }
  }

  // Stealth check
  isStealthed() {
    return this.hasBuff('prowl') || this.hasBuff('shadowmeld');
  }

  // Update method
  update(deltaTime) {
    super.update(deltaTime);

    // Energy regeneration for Cat form
    if (this.currentForm === 'cat') {
      const energyRegen = 10 * (1 + this.getStatBonus('haste'));
      this.resources.current[RESOURCE_TYPE.ENERGY] = Math.min(
        this.resources.current[RESOURCE_TYPE.ENERGY] + energyRegen * (deltaTime / 1000),
        this.resources.max[RESOURCE_TYPE.ENERGY]
      );
    }

    // Astral Power decay for Balance
    if (this.currentSpec === 'balance') {
      const apDecay = 2 * (deltaTime / 1000); // 2 AP per second
      this.resources.current[RESOURCE_TYPE.ASTRAL_POWER] = Math.max(
        this.resources.current[RESOURCE_TYPE.ASTRAL_POWER] - apDecay,
        0
      );
    }
  }
}

// Druid Treant pet
class DruidTreant {
  constructor(owner) {
    this.owner = owner;
    this.sim = owner.sim;
    this.type = 'treant';
    this.name = `${owner.name}'s Treant`;

    this.health = owner.maxHealth * 0.4;
    this.maxHealth = this.health;
    this.attackPower = owner.spellPower * 0.6;
    this.castSpeed = 2000;
    this.duration = 10000;

    this.active = false;
  }

  spawn() {
    this.active = true;
    this.sim.registerPet(this);

    // Start casting
    this.cast();

    // Despawn after duration
    this.sim.registerCallback(this.sim.currentTime + this.duration, () => {
      this.despawn();
    });
  }

  despawn() {
    this.active = false;
    this.sim.unregisterPet(this);
  }

  cast() {
    if (!this.active) return;

    const target = this.owner.target;
    if (!target) {
      this.sim.registerCallback(this.sim.currentTime + 1000, () => {
        this.cast();
      });
      return;
    }

    // Treant casts Wrath
    const damage = this.owner.calculateDamage({
      baseDamage: this.attackPower * 0.8,
      coefficient: 0.8,
      damageType: DAMAGE_TYPE.NATURE,
      target: target,
      canCrit: true,
      source: this
    });

    // Schedule next cast
    this.sim.registerCallback(this.sim.currentTime + this.castSpeed, () => {
      this.cast();
    });
  }
}