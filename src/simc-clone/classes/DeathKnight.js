// Death Knight class implementation
// Implements Blood (Tank), Frost (DPS), and Unholy (DPS) specializations

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

export class DeathKnight extends Player {
  constructor(sim, name) {
    super(sim, name);
    this.class = 'deathknight';

    // Death Knight specific resources
    this.resources.base[RESOURCE_TYPE.RUNIC_POWER] = 0;
    this.resources.max[RESOURCE_TYPE.RUNIC_POWER] = 100;
    this.resources.current[RESOURCE_TYPE.RUNIC_POWER] = 0;

    // Rune system (6 runes total)
    this.runes = {
      blood: { available: 2, max: 2, recharging: [] },
      frost: { available: 2, max: 2, recharging: [] },
      unholy: { available: 2, max: 2, recharging: [] },
      death: { available: 0, max: 0, recharging: [] } // Death runes can replace any rune type
    };

    this.runeRechargeTime = 10000; // 10 seconds base recharge time
    this.runeHaste = 1.0; // Modified by haste

    // Spec-specific mechanics
    this.boneshield = {
      stacks: 0,
      maxStacks: 10,
      duration: 30000
    };

    this.wounds = new Map(); // Festering Wounds for Unholy
    this.killingMachine = false; // Frost proc
    this.rime = false; // Frost proc
    this.darkSuccor = false; // Free Death Strike proc

    // Disease tracking
    this.diseases = {
      bloodPlague: new Map(),
      frostFever: new Map(),
      virulentPlague: new Map() // Unholy only
    };

    // Army of the Dead minions
    this.armyMinions = [];
    this.gargoyle = null; // Unholy
    this.dancingRuneWeapon = null; // Blood

    // Death and Decay ground effect
    this.deathAndDecay = {
      active: false,
      position: null,
      radius: 8,
      duration: 0,
      targets: new Set()
    };
  }

  // Initialize specialization
  setSpec(spec) {
    super.setSpec(spec);

    switch(spec) {
      case 'blood':
        this.specRole = SPEC_ROLE.TANK;
        this.initBloodAbilities();
        this.runicPowerGenBonus = 1.1; // Blood gets 10% more RP
        break;
      case 'frost':
        this.specRole = SPEC_ROLE.DPS;
        this.initFrostAbilities();
        this.dualWield = true; // Frost can dual wield
        break;
      case 'unholy':
        this.specRole = SPEC_ROLE.DPS;
        this.initUnholyAbilities();
        this.petMastery = 1.15; // 15% pet damage bonus
        break;
    }

    this.initBaseAbilities();
  }

  // Initialize base Death Knight abilities
  initBaseAbilities() {
    // Death Strike - Healing/Damage ability
    this.registerSpell('death_strike', {
      id: 49998,
      name: 'Death Strike',
      castTime: 0,
      cooldown: 0,
      runicPowerCost: 0,
      runeCost: { frost: 1, unholy: 1 },
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 3.3,
          coefficient: 3.3,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Heal for percentage of damage taken in last 5 seconds
        const recentDamage = this.getRecentDamageTaken(5000);
        const healAmount = Math.max(
          recentDamage * 0.25,
          this.maxHealth * 0.07 // Minimum 7% max health
        );

        this.heal(healAmount);

        // Blood spec gets Blood Shield
        if (this.currentSpec === 'blood') {
          this.applyBuff('blood_shield', {
            duration: 5000,
            shield: healAmount * 0.5
          });
        }

        return damage;
      }
    });

    // Death Grip - Pull ability
    this.registerSpell('death_grip', {
      id: 49576,
      name: 'Death Grip',
      castTime: 0,
      cooldown: 25000,
      range: 30,
      execute: (target) => {
        // Pull target to Death Knight
        this.sim.moveTarget(target, this.position);
        target.applyDebuff('death_grip', {
          duration: 3000,
          effect: 'taunt'
        });

        return { success: true };
      }
    });

    // Anti-Magic Shell - Magic defense
    this.registerSpell('anti_magic_shell', {
      id: 48707,
      name: 'Anti-Magic Shell',
      castTime: 0,
      cooldown: 60000,
      runicPowerGeneration: 0,
      execute: () => {
        this.applyBuff('anti_magic_shell', {
          duration: 5000,
          magicReduction: 0.75, // 75% magic damage reduction
          maxAbsorb: this.maxHealth * 0.3,
          currentAbsorb: 0,
          onAbsorb: (amount) => {
            // Generate Runic Power based on damage absorbed
            this.generateRunicPower(amount / this.maxHealth * 20);
          }
        });

        return { success: true };
      }
    });

    // Death and Decay - Ground AoE
    this.registerSpell('death_and_decay', {
      id: 43265,
      name: 'Death and Decay',
      castTime: 0,
      cooldown: 30000,
      runeCost: { blood: 1, frost: 1, unholy: 1 },
      execute: (target) => {
        this.deathAndDecay = {
          active: true,
          position: target.position || this.position,
          radius: 8,
          duration: 10000,
          tickInterval: 1000,
          lastTick: this.sim.currentTime,
          targets: new Set()
        };

        // Register periodic damage
        this.sim.registerCallback(this.sim.currentTime + 1000, () => {
          this.deathAndDecayTick();
        });

        return { success: true };
      }
    });

    // Raise Dead - Summon ghoul
    this.registerSpell('raise_dead', {
      id: 46585,
      name: 'Raise Dead',
      castTime: 0,
      cooldown: this.currentSpec === 'unholy' ? 0 : 120000, // No CD for Unholy
      execute: () => {
        const ghoul = new DeathKnightGhoul(this);
        this.pets.push(ghoul);

        if (this.currentSpec === 'unholy') {
          ghoul.permanent = true;
          ghoul.health = this.maxHealth * 0.5;
          ghoul.attackPower = this.attackPower * 0.6;
        } else {
          // Temporary ghoul for other specs
          ghoul.duration = 60000;
          ghoul.health = this.maxHealth * 0.3;
          ghoul.attackPower = this.attackPower * 0.4;
        }

        return { success: true };
      }
    });

    // Icebound Fortitude - Defensive CD
    this.registerSpell('icebound_fortitude', {
      id: 48792,
      name: 'Icebound Fortitude',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        this.applyBuff('icebound_fortitude', {
          duration: 8000,
          damageReduction: 0.3, // 30% damage reduction
          immuneToStun: true
        });

        return { success: true };
      }
    });
  }

  // Blood specialization abilities
  initBloodAbilities() {
    // Marrowrend - Generates Bone Shield
    this.registerSpell('marrowrend', {
      id: 195182,
      name: 'Marrowrend',
      castTime: 0,
      cooldown: 0,
      runeCost: { blood: 2 },
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 2.6,
          coefficient: 2.6,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Generate 3 Bone Shield charges
        this.addBoneShield(3);

        return damage;
      }
    });

    // Heart Strike - Main Blood spender
    this.registerSpell('heart_strike', {
      id: 206930,
      name: 'Heart Strike',
      castTime: 0,
      cooldown: 0,
      runeCost: { blood: 1 },
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 1.56,
          coefficient: 1.56 * (1 + this.boneshield.stacks * 0.03), // 3% per Bone Shield
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true,
          cleave: true,
          cleaveTargets: 2
        });

        // Generate 5 Runic Power
        this.generateRunicPower(5);

        return damage;
      }
    });

    // Blood Boil - AoE threat
    this.registerSpell('blood_boil', {
      id: 50842,
      name: 'Blood Boil',
      castTime: 0,
      cooldown: 7500,
      charges: 2,
      execute: () => {
        const targets = this.sim.getTargetsInRange(this.position, 10);
        let totalDamage = 0;

        targets.forEach(target => {
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * 0.48,
            coefficient: 0.48,
            damageType: DAMAGE_TYPE.SHADOW,
            target: target,
            canCrit: true
          });

          totalDamage += damage;
          this.applyDisease(target, 'blood_plague', 24000);
        });

        // Generate 2 Runic Power per target hit
        this.generateRunicPower(targets.length * 2);

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Vampiric Blood - Defensive
    this.registerSpell('vampiric_blood', {
      id: 55233,
      name: 'Vampiric Blood',
      castTime: 0,
      cooldown: 90000,
      execute: () => {
        this.applyBuff('vampiric_blood', {
          duration: 10000,
          healthIncrease: 0.3, // 30% max health increase
          healingIncrease: 0.3  // 30% increased healing received
        });

        // Increase current health by same percentage
        this.currentHealth *= 1.3;
        this.maxHealth *= 1.3;

        return { success: true };
      }
    });

    // Dancing Rune Weapon
    this.registerSpell('dancing_rune_weapon', {
      id: 49028,
      name: 'Dancing Rune Weapon',
      castTime: 0,
      cooldown: 120000,
      execute: () => {
        this.dancingRuneWeapon = {
          active: true,
          duration: 8000,
          parryBonus: 0.4 // 40% parry chance
        };

        this.applyBuff('dancing_rune_weapon', {
          duration: 8000,
          onAbilityUse: (ability) => {
            // Mirror Heart Strike and Death Strike
            if (ability === 'heart_strike' || ability === 'death_strike') {
              return { bonusDamage: 0.5 }; // 50% additional damage
            }
          }
        });

        return { success: true };
      }
    });
  }

  // Frost specialization abilities
  initFrostAbilities() {
    // Obliterate - Main Frost spender
    this.registerSpell('obliterate', {
      id: 49020,
      name: 'Obliterate',
      castTime: 0,
      cooldown: 0,
      runeCost: { frost: 1, unholy: 1 },
      execute: (target) => {
        let critChance = this.critChance;

        // Killing Machine makes it auto-crit
        if (this.killingMachine) {
          critChance = 1.0;
          this.killingMachine = false;
        }

        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 3.8,
          coefficient: 3.8,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          critChance: critChance
        });

        // Generate 15 Runic Power
        this.generateRunicPower(15);

        // Chance to proc Rime (free Howling Blast)
        if (Math.random() < 0.45) {
          this.rime = true;
        }

        return damage;
      }
    });

    // Frost Strike - Runic Power spender
    this.registerSpell('frost_strike', {
      id: 49143,
      name: 'Frost Strike',
      castTime: 0,
      cooldown: 0,
      runicPowerCost: 25,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 2.15,
          coefficient: 2.15,
          damageType: DAMAGE_TYPE.FROST,
          target: target,
          canCrit: true
        });

        // Main hand and off hand strikes if dual wielding
        let totalDamage = damage;
        if (this.dualWield) {
          const offhandDamage = this.calculateDamage({
            baseDamage: this.attackPower * 1.075,
            coefficient: 1.075,
            damageType: DAMAGE_TYPE.FROST,
            target: target,
            canCrit: true
          });
          totalDamage += offhandDamage;
        }

        return totalDamage;
      }
    });

    // Howling Blast - AoE Frost
    this.registerSpell('howling_blast', {
      id: 49184,
      name: 'Howling Blast',
      castTime: 0,
      cooldown: 0,
      runeCost: this.rime ? {} : { frost: 1 }, // Free with Rime proc
      execute: (target) => {
        if (this.rime) {
          this.rime = false;
        }

        const targets = this.sim.getTargetsInRange(target.position, 10);
        let totalDamage = 0;

        targets.forEach((t, index) => {
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * 0.48,
            coefficient: 0.48,
            damageType: DAMAGE_TYPE.FROST,
            target: t,
            canCrit: true
          });

          totalDamage += damage;
          this.applyDisease(t, 'frost_fever', 24000);
        });

        // Generate 10 Runic Power if rune was spent
        if (!this.rime) {
          this.generateRunicPower(10);
        }

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Pillar of Frost - DPS cooldown
    this.registerSpell('pillar_of_frost', {
      id: 51271,
      name: 'Pillar of Frost',
      castTime: 0,
      cooldown: 60000,
      execute: () => {
        this.applyBuff('pillar_of_frost', {
          duration: 12000,
          strengthBonus: 0.25, // 25% strength increase
          onExpire: () => {
            // Could trigger additional effects
          }
        });

        return { success: true };
      }
    });

    // Remorseless Winter - AoE slow
    this.registerSpell('remorseless_winter', {
      id: 196770,
      name: 'Remorseless Winter',
      castTime: 0,
      cooldown: 20000,
      runeCost: { frost: 1 },
      execute: () => {
        this.applyBuff('remorseless_winter', {
          duration: 8000,
          tickInterval: 1000,
          onTick: () => {
            const targets = this.sim.getTargetsInRange(this.position, 8);
            let totalDamage = 0;

            targets.forEach(target => {
              const damage = this.calculateDamage({
                baseDamage: this.attackPower * 0.25,
                coefficient: 0.25,
                damageType: DAMAGE_TYPE.FROST,
                target: target,
                canCrit: true
              });

              totalDamage += damage;

              // Apply slow
              target.applyDebuff('remorseless_winter_slow', {
                duration: 3000,
                slowAmount: 0.5 // 50% slow
              });
            });

            return totalDamage;
          }
        });

        return { success: true };
      }
    });

    // Breath of Sindragosa
    this.registerSpell('breath_of_sindragosa', {
      id: 152279,
      name: 'Breath of Sindragosa',
      castTime: 0,
      cooldown: 120000,
      execute: () => {
        this.applyBuff('breath_of_sindragosa', {
          duration: 30000, // Max duration, limited by Runic Power
          tickInterval: 1000,
          onTick: () => {
            // Costs 15 Runic Power per second
            if (this.resources.current[RESOURCE_TYPE.RUNIC_POWER] < 15) {
              this.removeBuff('breath_of_sindragosa');
              return 0;
            }

            this.resources.current[RESOURCE_TYPE.RUNIC_POWER] -= 15;

            // Deal cone damage
            const targets = this.sim.getTargetsInCone(this.position, this.facing, 12, 90);
            let totalDamage = 0;

            targets.forEach(target => {
              const damage = this.calculateDamage({
                baseDamage: this.attackPower * 1.5,
                coefficient: 1.5,
                damageType: DAMAGE_TYPE.FROST,
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
  }

  // Unholy specialization abilities
  initUnholyAbilities() {
    // Festering Strike - Apply wounds
    this.registerSpell('festering_strike', {
      id: 85948,
      name: 'Festering Strike',
      castTime: 0,
      cooldown: 0,
      runeCost: { frost: 1, unholy: 1 },
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 2.44,
          coefficient: 2.44,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Apply 2-4 Festering Wounds
        const wounds = 2 + Math.floor(Math.random() * 3);
        this.applyFesteringWounds(target, wounds);

        // Generate 20 Runic Power
        this.generateRunicPower(20);

        return damage;
      }
    });

    // Scourge Strike - Pop wounds
    this.registerSpell('scourge_strike', {
      id: 55090,
      name: 'Scourge Strike',
      castTime: 0,
      cooldown: 0,
      runeCost: { unholy: 1 },
      execute: (target) => {
        // Physical portion
        const physDamage = this.calculateDamage({
          baseDamage: this.attackPower * 0.7,
          coefficient: 0.7,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Shadow portion
        const shadowDamage = this.calculateDamage({
          baseDamage: this.attackPower * 1.5,
          coefficient: 1.5,
          damageType: DAMAGE_TYPE.SHADOW,
          target: target,
          canCrit: true
        });

        // Burst 1 Festering Wound
        const woundDamage = this.burstFesteringWound(target);

        // Generate 15 Runic Power
        this.generateRunicPower(15);

        return physDamage + shadowDamage + woundDamage;
      }
    });

    // Death Coil - Runic Power spender
    this.registerSpell('death_coil', {
      id: 47541,
      name: 'Death Coil',
      castTime: 0,
      cooldown: 0,
      runicPowerCost: 40,
      execute: (target) => {
        // Can heal undead allies or damage enemies
        if (target.undead && target.friendly) {
          const healAmount = this.spellPower * 3.5;
          target.heal(healAmount);
          return { healing: healAmount };
        }

        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 0.47,
          coefficient: 0.47,
          damageType: DAMAGE_TYPE.SHADOW,
          target: target,
          canCrit: true
        });

        return damage;
      }
    });

    // Epidemic - AoE disease spread
    this.registerSpell('epidemic', {
      id: 207317,
      name: 'Epidemic',
      castTime: 0,
      cooldown: 0,
      runicPowerCost: 30,
      execute: (target) => {
        const targets = this.sim.getTargetsInRange(target.position, 10);
        let totalDamage = 0;

        targets.forEach(t => {
          // Only affects diseased targets
          if (this.targetHasDisease(t)) {
            const damage = this.calculateDamage({
              baseDamage: this.attackPower * 0.215,
              coefficient: 0.215,
              damageType: DAMAGE_TYPE.SHADOW,
              target: t,
              canCrit: true
            });

            totalDamage += damage;
          }
        });

        return { damage: totalDamage };
      }
    });

    // Army of the Dead
    this.registerSpell('army_of_the_dead', {
      id: 42650,
      name: 'Army of the Dead',
      castTime: 4000,
      cooldown: 480000, // 8 minute cooldown
      channeled: true,
      execute: () => {
        // Summon 8 ghouls
        for (let i = 0; i < 8; i++) {
          const ghoul = new DeathKnightGhoul(this);
          ghoul.duration = 40000;
          ghoul.health = this.maxHealth * 0.15;
          ghoul.attackPower = this.attackPower * 0.3;
          this.armyMinions.push(ghoul);

          // Stagger spawn slightly
          this.sim.registerCallback(this.sim.currentTime + i * 500, () => {
            ghoul.spawn();
          });
        }

        return { success: true };
      }
    });

    // Dark Transformation - Empower ghoul
    this.registerSpell('dark_transformation', {
      id: 63560,
      name: 'Dark Transformation',
      castTime: 0,
      cooldown: 60000,
      execute: () => {
        const ghoul = this.getPermanentGhoul();
        if (!ghoul) return { error: 'No ghoul active' };

        ghoul.transform({
          duration: 30000,
          damageIncrease: 1.0, // 100% damage increase
          healthIncrease: 0.5,
          cleaveAttacks: true
        });

        return { success: true };
      }
    });

    // Summon Gargoyle
    this.registerSpell('summon_gargoyle', {
      id: 49206,
      name: 'Summon Gargoyle',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        this.gargoyle = new DeathKnightGargoyle(this);
        this.gargoyle.duration = 30000;
        this.gargoyle.spawn();

        return { success: true };
      }
    });

    // Outbreak - Apply diseases
    this.registerSpell('outbreak', {
      id: 77575,
      name: 'Outbreak',
      castTime: 0,
      cooldown: 0,
      runeCost: { unholy: 1 },
      range: 30,
      execute: (target) => {
        // Apply Virulent Plague
        this.applyDisease(target, 'virulent_plague', 21000);

        // Small initial damage
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 0.25,
          coefficient: 0.25,
          damageType: DAMAGE_TYPE.SHADOW,
          target: target,
          canCrit: false
        });

        // Generate 10 Runic Power
        this.generateRunicPower(10);

        return damage;
      }
    });
  }

  // Rune management
  spendRune(type, count = 1) {
    let spent = 0;

    // Try to spend specific rune type first
    if (this.runes[type].available >= count) {
      this.runes[type].available -= count;
      spent = count;
    } else if (this.runes[type].available > 0) {
      spent = this.runes[type].available;
      this.runes[type].available = 0;
    }

    // Use Death runes for remaining
    const remaining = count - spent;
    if (remaining > 0 && this.runes.death.available >= remaining) {
      this.runes.death.available -= remaining;
      spent += remaining;
    }

    // Start recharge for spent runes
    for (let i = 0; i < spent; i++) {
      this.startRuneRecharge(type);
    }

    return spent === count;
  }

  startRuneRecharge(type) {
    const rechargeTime = this.runeRechargeTime / this.runeHaste;

    const runeRecharge = {
      type: type,
      finishTime: this.sim.currentTime + rechargeTime
    };

    this.runes[type].recharging.push(runeRecharge);

    this.sim.registerCallback(runeRecharge.finishTime, () => {
      this.finishRuneRecharge(type);
    });
  }

  finishRuneRecharge(type) {
    const recharge = this.runes[type].recharging.shift();
    if (recharge) {
      this.runes[type].available = Math.min(
        this.runes[type].available + 1,
        this.runes[type].max
      );

      // Check for Death rune conversion (certain talents)
      if (this.talents.deathRuneConversion && Math.random() < 0.3) {
        this.runes.death.available++;
        this.runes[type].available--;
      }
    }
  }

  // Check if ability can be cast with current runes
  canCastWithRunes(runeCost) {
    if (!runeCost) return true;

    for (const [type, count] of Object.entries(runeCost)) {
      const available = this.runes[type].available + this.runes.death.available;
      if (available < count) {
        return false;
      }
    }

    return true;
  }

  // Runic Power generation
  generateRunicPower(amount) {
    const bonus = this.currentSpec === 'blood' ? 1.1 : 1.0;
    const generated = amount * bonus;

    this.resources.current[RESOURCE_TYPE.RUNIC_POWER] = Math.min(
      this.resources.current[RESOURCE_TYPE.RUNIC_POWER] + generated,
      this.resources.max[RESOURCE_TYPE.RUNIC_POWER]
    );

    // Trigger any Runic Power generation effects
    this.onResourceGain(RESOURCE_TYPE.RUNIC_POWER, generated);
  }

  // Disease management
  applyDisease(target, diseaseType, duration) {
    const diseaseData = {
      source: this,
      duration: duration,
      remainingDuration: duration,
      tickInterval: 3000,
      lastTick: this.sim.currentTime,
      stacks: 1
    };

    this.diseases[diseaseType].set(target.id, diseaseData);

    // Register disease tick
    this.sim.registerCallback(this.sim.currentTime + 3000, () => {
      this.diseaseTick(target, diseaseType);
    });
  }

  diseaseTick(target, diseaseType) {
    const disease = this.diseases[diseaseType].get(target.id);
    if (!disease || disease.remainingDuration <= 0) {
      this.diseases[diseaseType].delete(target.id);
      return;
    }

    let damage = 0;

    switch(diseaseType) {
      case 'blood_plague':
        damage = this.attackPower * 0.115;
        break;
      case 'frost_fever':
        damage = this.attackPower * 0.055;
        target.applyDebuff('frost_fever_slow', {
          duration: 3000,
          attackSpeedReduction: 0.2
        });
        break;
      case 'virulent_plague':
        damage = this.attackPower * 0.135;
        // 30% chance to erupt a Festering Wound
        if (Math.random() < 0.3) {
          this.burstFesteringWound(target);
        }
        break;
    }

    const finalDamage = this.calculateDamage({
      baseDamage: damage,
      coefficient: 1.0,
      damageType: DAMAGE_TYPE.SHADOW,
      target: target,
      canCrit: false,
      isDot: true
    });

    disease.remainingDuration -= disease.tickInterval;
    disease.lastTick = this.sim.currentTime;

    // Schedule next tick
    if (disease.remainingDuration > 0) {
      this.sim.registerCallback(
        this.sim.currentTime + disease.tickInterval,
        () => this.diseaseTick(target, diseaseType)
      );
    }
  }

  targetHasDisease(target) {
    return this.diseases.blood_plague.has(target.id) ||
           this.diseases.frost_fever.has(target.id) ||
           this.diseases.virulent_plague.has(target.id);
  }

  // Festering Wounds (Unholy)
  applyFesteringWounds(target, count) {
    if (!this.wounds.has(target.id)) {
      this.wounds.set(target.id, {
        count: 0,
        maxCount: 6
      });
    }

    const woundData = this.wounds.get(target.id);
    woundData.count = Math.min(woundData.count + count, woundData.maxCount);
  }

  burstFesteringWound(target) {
    const woundData = this.wounds.get(target.id);
    if (!woundData || woundData.count === 0) {
      return 0;
    }

    woundData.count--;

    const damage = this.calculateDamage({
      baseDamage: this.attackPower * 0.333,
      coefficient: 0.333,
      damageType: DAMAGE_TYPE.SHADOW,
      target: target,
      canCrit: false
    });

    if (woundData.count === 0) {
      this.wounds.delete(target.id);
    }

    return damage;
  }

  // Bone Shield (Blood)
  addBoneShield(stacks) {
    this.boneshield.stacks = Math.min(
      this.boneshield.stacks + stacks,
      this.boneshield.maxStacks
    );

    this.applyBuff('bone_shield', {
      duration: this.boneshield.duration,
      stacks: this.boneshield.stacks,
      damageReduction: 0.16, // 16% DR from Bone Shield
      onDamageTaken: (damage) => {
        // Chance to consume a charge
        if (Math.random() < 0.25) {
          this.boneshield.stacks--;
          if (this.boneshield.stacks === 0) {
            this.removeBuff('bone_shield');
          }
        }
      }
    });
  }

  // Death and Decay tick
  deathAndDecayTick() {
    if (!this.deathAndDecay.active) return;

    const currentTime = this.sim.currentTime;
    if (currentTime - this.deathAndDecay.startTime >= this.deathAndDecay.duration) {
      this.deathAndDecay.active = false;
      return;
    }

    const targets = this.sim.getTargetsInRange(
      this.deathAndDecay.position,
      this.deathAndDecay.radius
    );

    let totalDamage = 0;
    targets.forEach(target => {
      const damage = this.calculateDamage({
        baseDamage: this.attackPower * 0.32,
        coefficient: 0.32,
        damageType: DAMAGE_TYPE.SHADOW,
        target: target,
        canCrit: true
      });

      totalDamage += damage;
      this.deathAndDecay.targets.add(target.id);
    });

    // Schedule next tick
    this.sim.registerCallback(currentTime + 1000, () => {
      this.deathAndDecayTick();
    });
  }

  // Get recent damage taken (for Death Strike healing)
  getRecentDamageTaken(timeWindow) {
    const cutoff = this.sim.currentTime - timeWindow;
    let totalDamage = 0;

    this.damageHistory.forEach(entry => {
      if (entry.timestamp > cutoff) {
        totalDamage += entry.amount;
      }
    });

    return totalDamage;
  }

  getPermanentGhoul() {
    return this.pets.find(pet => pet.permanent && pet.type === 'ghoul');
  }

  // Update method
  update(deltaTime) {
    super.update(deltaTime);

    // Update rune haste based on current haste
    this.runeHaste = 1 + this.getStatBonus('haste');

    // Update Death and Decay
    if (this.deathAndDecay.active) {
      this.deathAndDecay.duration -= deltaTime;
      if (this.deathAndDecay.duration <= 0) {
        this.deathAndDecay.active = false;
      }
    }

    // Proc checks
    if (this.currentSpec === 'frost') {
      // Killing Machine proc from auto attacks
      if (Math.random() < 0.06 * (deltaTime / 1000)) {
        this.killingMachine = true;
      }
    }
  }

  // Get spell data override to handle rune costs
  getSpellData(spellName) {
    const spell = super.getSpellData(spellName);

    if (spell && spell.runeCost) {
      // Check if we have enough runes
      if (!this.canCastWithRunes(spell.runeCost)) {
        spell.canCast = false;
        spell.errorMessage = 'Not enough runes';
      }
    }

    return spell;
  }
}

// Death Knight Ghoul pet
class DeathKnightGhoul {
  constructor(owner) {
    this.owner = owner;
    this.sim = owner.sim;
    this.type = 'ghoul';
    this.name = `${owner.name}'s Ghoul`;

    this.health = 1;
    this.maxHealth = 1;
    this.attackPower = 1;
    this.attackSpeed = 2000; // 2 second attack speed

    this.permanent = false;
    this.duration = 60000;
    this.transformed = false;

    this.lastAttack = 0;
    this.target = null;
    this.position = owner.position;
  }

  spawn() {
    this.active = true;
    this.sim.registerPet(this);

    // Start attacking
    this.sim.registerCallback(this.sim.currentTime + 100, () => {
      this.startCombat();
    });

    if (this.duration > 0) {
      this.sim.registerCallback(this.sim.currentTime + this.duration, () => {
        this.despawn();
      });
    }
  }

  despawn() {
    this.active = false;
    this.sim.unregisterPet(this);
  }

  startCombat() {
    if (!this.active) return;

    this.target = this.owner.target;
    if (this.target) {
      this.attack();
    }
  }

  attack() {
    if (!this.active || !this.target) return;

    const damage = this.attackPower * (this.transformed ? 2.0 : 1.0);

    const finalDamage = this.owner.calculateDamage({
      baseDamage: damage,
      coefficient: 1.0,
      damageType: DAMAGE_TYPE.PHYSICAL,
      target: this.target,
      canCrit: true,
      source: this
    });

    // Cleave if transformed
    if (this.transformed && this.cleaveAttacks) {
      const nearbyTargets = this.sim.getTargetsInRange(this.target.position, 5);
      nearbyTargets.forEach(target => {
        if (target !== this.target) {
          this.owner.calculateDamage({
            baseDamage: damage * 0.5,
            coefficient: 0.5,
            damageType: DAMAGE_TYPE.PHYSICAL,
            target: target,
            canCrit: true,
            source: this
          });
        }
      });
    }

    // Schedule next attack
    this.lastAttack = this.sim.currentTime;
    this.sim.registerCallback(
      this.sim.currentTime + this.attackSpeed,
      () => this.attack()
    );
  }

  transform(options) {
    this.transformed = true;
    this.transformDuration = options.duration;
    this.damageIncrease = options.damageIncrease || 1.0;
    this.healthIncrease = options.healthIncrease || 0;
    this.cleaveAttacks = options.cleaveAttacks || false;

    this.maxHealth *= (1 + this.healthIncrease);
    this.health = this.maxHealth;

    this.sim.registerCallback(this.sim.currentTime + options.duration, () => {
      this.transformed = false;
      this.maxHealth /= (1 + this.healthIncrease);
      this.health = Math.min(this.health, this.maxHealth);
    });
  }
}

// Death Knight Gargoyle pet
class DeathKnightGargoyle {
  constructor(owner) {
    this.owner = owner;
    this.sim = owner.sim;
    this.type = 'gargoyle';
    this.name = `${owner.name}'s Gargoyle`;

    this.attackPower = owner.attackPower * 1.0;
    this.castSpeed = 2000; // 2 second cast time
    this.duration = 30000;

    this.active = false;
    this.position = owner.position;
  }

  spawn() {
    this.active = true;
    this.sim.registerPet(this);

    // Start casting Gargoyle Strike
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
      // Try again in a bit
      this.sim.registerCallback(this.sim.currentTime + 1000, () => {
        this.cast();
      });
      return;
    }

    // Gargoyle Strike
    const damage = this.owner.calculateDamage({
      baseDamage: this.attackPower * 1.73,
      coefficient: 1.73,
      damageType: DAMAGE_TYPE.SHADOW,
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