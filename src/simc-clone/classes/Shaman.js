// Shaman class implementation
// Implements Elemental (DPS), Enhancement (DPS), and Restoration (Healer) specializations

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

export class Shaman extends Player {
  constructor(sim, name) {
    super(sim, name);
    this.class = 'shaman';

    // Shaman specific resources
    this.primaryResource = RESOURCE_TYPE.MANA;
    this.resources.base[RESOURCE_TYPE.MANA] = 10000;
    this.resources.max[RESOURCE_TYPE.MANA] = 10000;
    this.resources.current[RESOURCE_TYPE.MANA] = 10000;

    // Maelstrom resource for Elemental/Enhancement
    this.resources.base[RESOURCE_TYPE.MAELSTROM] = 0;
    this.resources.max[RESOURCE_TYPE.MAELSTROM] = 100;
    this.resources.current[RESOURCE_TYPE.MAELSTROM] = 0;

    // Totem management
    this.totems = {
      fire: null,
      earth: null,
      water: null,
      air: null
    };

    // Enhancement specific
    this.maelstromWeapon = 0; // Stacks for instant cast
    this.maxMaelstromWeapon = 10;
    this.stormbringer = false; // Stormstrike proc
    this.hotHand = false; // Lava Lash buff
    this.crashLightning = false; // AoE buff
    this.doomWinds = false; // Windfury buff

    // Elemental specific
    this.elementalBlast = {
      crit: false,
      haste: false,
      mastery: false
    };
    this.flameShock = new Map(); // Track DoTs on targets
    this.lavaBeam = false; // Ascendance state
    this.masterOfTheElements = false; // Buff after Lava Burst
    this.surgeOfPower = 0; // Stacks

    // Restoration specific
    this.tidalWaves = 0;
    this.unleashLife = false;
    this.cloudburstTotem = null;
    this.riptide = new Map();
    this.earthShield = null;
    this.spiritLink = {
      active: false,
      position: null,
      radius: 10,
      duration: 0
    };

    // Primordial Wave tracking
    this.primordialWave = {
      active: false,
      targets: new Set()
    };

    // Spirit Wolf form
    this.ghostWolf = false;

    // Windfury tracking
    this.windfuryTotem = null;
  }

  // Initialize specialization
  setSpec(spec) {
    super.setSpec(spec);

    switch(spec) {
      case 'elemental':
        this.specRole = SPEC_ROLE.DPS;
        this.primaryResource = RESOURCE_TYPE.MAELSTROM;
        this.initElementalAbilities();
        break;
      case 'enhancement':
        this.specRole = SPEC_ROLE.DPS;
        this.primaryResource = RESOURCE_TYPE.MAELSTROM;
        this.initEnhancementAbilities();
        break;
      case 'restoration':
        this.specRole = SPEC_ROLE.HEALER;
        this.primaryResource = RESOURCE_TYPE.MANA;
        this.initRestorationAbilities();
        break;
    }

    this.initBaseAbilities();
  }

  // Initialize base Shaman abilities
  initBaseAbilities() {
    // Bloodlust/Heroism - Raid haste buff
    this.registerSpell('bloodlust', {
      id: 2825,
      name: 'Bloodlust',
      castTime: 0,
      cooldown: 300000, // 5 minutes
      execute: () => {
        // Apply to all allies
        const allies = this.sim.getAlliesInRange(this.position, 100);
        allies.forEach(ally => {
          ally.applyBuff('bloodlust', {
            duration: 40000,
            hasteBonus: 0.3, // 30% haste
            exhaustion: true // Apply exhaustion debuff after
          });
        });

        return { success: true };
      }
    });

    // Ghost Wolf - Movement form
    this.registerSpell('ghost_wolf', {
      id: 2645,
      name: 'Ghost Wolf',
      castTime: 0,
      cooldown: 0,
      execute: () => {
        this.ghostWolf = !this.ghostWolf;

        if (this.ghostWolf) {
          this.applyBuff('ghost_wolf', {
            duration: -1, // Until cancelled
            moveSpeed: 1.3, // 30% movement speed
            damageReduction: 0.1 // 10% damage reduction with talent
          });
        } else {
          this.removeBuff('ghost_wolf');
        }

        return { success: true };
      }
    });

    // Purge - Offensive dispel
    this.registerSpell('purge', {
      id: 370,
      name: 'Purge',
      castTime: 0,
      cooldown: 0,
      manaCost: 1000,
      execute: (target) => {
        // Remove one magic buff
        target.dispelBuff('magic');

        // With talent, can remove 2 buffs
        if (this.talents.improvedPurge) {
          target.dispelBuff('magic');
        }

        return { success: true };
      }
    });

    // Cleanse Spirit - Dispel
    this.registerSpell('cleanse_spirit', {
      id: 51886,
      name: 'Cleanse Spirit',
      castTime: 0,
      cooldown: 8000,
      manaCost: 650,
      execute: (target) => {
        // Remove curse
        target.dispelDebuff('curse');

        // Restoration can also remove magic
        if (this.currentSpec === 'restoration') {
          target.dispelDebuff('magic');
        }

        return { success: true };
      }
    });

    // Wind Shear - Interrupt
    this.registerSpell('wind_shear', {
      id: 57994,
      name: 'Wind Shear',
      castTime: 0,
      cooldown: 12000,
      range: 30,
      execute: (target) => {
        // Interrupt current cast
        target.interruptCast();

        // Apply 3 second lockout
        target.applyDebuff('wind_shear_lockout', {
          duration: 3000,
          schoolLockout: true
        });

        return { success: true };
      }
    });

    // Hex - CC
    this.registerSpell('hex', {
      id: 51514,
      name: 'Hex',
      castTime: 1700,
      cooldown: 30000,
      range: 30,
      execute: (target) => {
        target.applyDebuff('hex', {
          duration: 60000,
          polymorphed: true,
          breakOnDamage: true
        });

        return { success: true };
      }
    });

    // Astral Shift - Defensive
    this.registerSpell('astral_shift', {
      id: 108271,
      name: 'Astral Shift',
      castTime: 0,
      cooldown: 90000,
      execute: () => {
        this.applyBuff('astral_shift', {
          duration: 8000,
          damageReduction: 0.4 // 40% damage reduction
        });

        return { success: true };
      }
    });

    // Spirit Walk - Freedom
    this.registerSpell('spirit_walk', {
      id: 58875,
      name: 'Spirit Walk',
      castTime: 0,
      cooldown: 60000,
      execute: () => {
        this.applyBuff('spirit_walk', {
          duration: 8000,
          immuneToMovementImpair: true,
          moveSpeedBonus: 0.6 // 60% movement speed
        });

        return { success: true };
      }
    });

    // Healing Stream Totem
    this.registerSpell('healing_stream_totem', {
      id: 5394,
      name: 'Healing Stream Totem',
      castTime: 0,
      cooldown: 30000,
      execute: () => {
        const totem = new HealingStreamTotem(this);
        this.totems.water = totem;
        totem.spawn();

        return { success: true };
      }
    });
  }

  // Elemental specialization abilities
  initElementalAbilities() {
    // Lightning Bolt - Main filler
    this.registerSpell('lightning_bolt', {
      id: 188196,
      name: 'Lightning Bolt',
      castTime: 2000,
      maelstromGeneration: 8,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.spellPower * 0.92,
          coefficient: 0.92,
          damageType: DAMAGE_TYPE.NATURE,
          target: target,
          canCrit: true
        });

        // Generate Maelstrom
        this.generateMaelstrom(8);

        // Overload chance
        if (Math.random() < this.masteryChance) {
          this.castOverload('lightning_bolt', target);
        }

        return damage;
      }
    });

    // Lava Burst - High priority nuke
    this.registerSpell('lava_burst', {
      id: 51505,
      name: 'Lava Burst',
      castTime: 2000,
      cooldown: 8000,
      charges: 2,
      maelstromGeneration: 10,
      execute: (target) => {
        // Always crits if Flame Shock is on target
        const hasFlameShock = this.flameShock.has(target.id);

        const damage = this.calculateDamage({
          baseDamage: this.spellPower * 2.15,
          coefficient: 2.15,
          damageType: DAMAGE_TYPE.FIRE,
          target: target,
          canCrit: true,
          critChance: hasFlameShock ? 1.0 : this.critChance
        });

        // Generate Maelstrom
        this.generateMaelstrom(10);

        // Master of the Elements buff
        this.masterOfTheElements = true;

        // Primordial Wave reset
        if (this.primordialWave.active && this.primordialWave.targets.has(target.id)) {
          this.resetCooldown('lava_burst');
        }

        return damage;
      }
    });

    // Chain Lightning - AoE builder
    this.registerSpell('chain_lightning', {
      id: 188443,
      name: 'Chain Lightning',
      castTime: 2000,
      maelstromGeneration: 4, // Per target
      execute: (target) => {
        const targets = [target];
        let totalDamage = 0;

        // Chain to up to 5 targets
        for (let i = 0; i < 5 && i < targets.length; i++) {
          const currentTarget = targets[i];

          const damage = this.calculateDamage({
            baseDamage: this.spellPower * 0.7 * Math.pow(0.7, i), // 30% reduction per jump
            coefficient: 0.7 * Math.pow(0.7, i),
            damageType: DAMAGE_TYPE.NATURE,
            target: currentTarget,
            canCrit: true
          });

          totalDamage += damage;

          // Generate Maelstrom per target
          this.generateMaelstrom(4);

          // Find next target
          if (i < 4) {
            const nextTarget = this.sim.getNearestEnemy(currentTarget.position, targets);
            if (nextTarget && this.getDistance(currentTarget, nextTarget) <= 10) {
              targets.push(nextTarget);
            }
          }

          // Overload chance per target
          if (Math.random() < this.masteryChance) {
            this.castOverload('chain_lightning', currentTarget);
          }
        }

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Earth Shock - Main spender
    this.registerSpell('earth_shock', {
      id: 8042,
      name: 'Earth Shock',
      castTime: 0,
      maelstromCost: 60,
      execute: (target) => {
        const maelstrom = this.resources.current[RESOURCE_TYPE.MAELSTROM];

        const damage = this.calculateDamage({
          baseDamage: this.spellPower * (2.1 + maelstrom * 0.01), // Scales with Maelstrom spent
          coefficient: 2.1 + maelstrom * 0.01,
          damageType: DAMAGE_TYPE.NATURE,
          target: target,
          canCrit: true
        });

        // Master of the Elements consumption
        if (this.masterOfTheElements) {
          this.masterOfTheElements = false;
          return damage * 1.2; // 20% more damage
        }

        return damage;
      }
    });

    // Flame Shock - DoT
    this.registerSpell('flame_shock', {
      id: 188389,
      name: 'Flame Shock',
      castTime: 0,
      cooldown: 6000,
      execute: (target) => {
        // Initial damage
        const damage = this.calculateDamage({
          baseDamage: this.spellPower * 0.48,
          coefficient: 0.48,
          damageType: DAMAGE_TYPE.FIRE,
          target: target,
          canCrit: true
        });

        // Apply DoT
        this.flameShock.set(target.id, {
          duration: 24000,
          tickInterval: 2000,
          remainingDuration: 24000,
          lastTick: this.sim.currentTime
        });

        target.applyDebuff('flame_shock', {
          duration: 24000,
          tickInterval: 2000,
          source: this,
          onTick: () => {
            return this.calculateDamage({
              baseDamage: this.spellPower * 0.21,
              coefficient: 0.21,
              damageType: DAMAGE_TYPE.FIRE,
              target: target,
              canCrit: false,
              isDot: true
            });
          }
        });

        return damage;
      }
    });

    // Elemental Blast - Buff and damage
    this.registerSpell('elemental_blast', {
      id: 117014,
      name: 'Elemental Blast',
      castTime: 2000,
      cooldown: 12000,
      maelstromGeneration: 30,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.spellPower * 3.5,
          coefficient: 3.5,
          damageType: DAMAGE_TYPE.ELEMENTAL,
          target: target,
          canCrit: true
        });

        // Generate Maelstrom
        this.generateMaelstrom(30);

        // Apply random stat buff
        const stats = ['crit', 'haste', 'mastery'];
        const randomStat = stats[Math.floor(Math.random() * stats.length)];

        this.applyBuff(`elemental_blast_${randomStat}`, {
          duration: 10000,
          statBonus: { [randomStat]: 0.05 } // 5% to random stat
        });

        this.elementalBlast[randomStat] = true;

        return damage;
      }
    });

    // Stormkeeper - Empower next 2 casts
    this.registerSpell('stormkeeper', {
      id: 191634,
      name: 'Stormkeeper',
      castTime: 1500,
      cooldown: 60000,
      execute: () => {
        this.applyBuff('stormkeeper', {
          duration: 15000,
          stacks: 2,
          maxStacks: 2,
          onSpellCast: (spell) => {
            if (spell === 'lightning_bolt' || spell === 'chain_lightning') {
              return {
                instantCast: true,
                damageBonus: 1.5, // 50% more damage
                guaranteedOverload: true
              };
            }
          }
        });

        return { success: true };
      }
    });

    // Fire Elemental - Major DPS cooldown
    this.registerSpell('fire_elemental', {
      id: 198067,
      name: 'Fire Elemental',
      castTime: 0,
      cooldown: 150000,
      execute: () => {
        const elemental = new FireElemental(this);
        this.totems.fire = elemental;
        elemental.spawn();

        return { success: true };
      }
    });

    // Storm Elemental - Alternative to Fire
    this.registerSpell('storm_elemental', {
      id: 192249,
      name: 'Storm Elemental',
      castTime: 0,
      cooldown: 150000,
      execute: () => {
        const elemental = new StormElemental(this);
        this.totems.air = elemental;
        elemental.spawn();

        // Empower shaman with Call Lightning
        this.applyBuff('call_lightning', {
          duration: 30000,
          natureBonus: 0.2 // 20% nature damage
        });

        return { success: true };
      }
    });

    // Ascendance - Transform
    this.registerSpell('ascendance_elemental', {
      id: 114050,
      name: 'Ascendance',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        this.applyBuff('ascendance', {
          duration: 15000,
          onApply: () => {
            this.lavaBeam = true;
          },
          onExpire: () => {
            this.lavaBeam = false;
          },
          spellReplacement: {
            'chain_lightning': 'lava_beam'
          }
        });

        return { success: true };
      }
    });
  }

  // Enhancement specialization abilities
  initEnhancementAbilities() {
    // Stormstrike - Main ability
    this.registerSpell('stormstrike', {
      id: 17364,
      name: 'Stormstrike',
      castTime: 0,
      cooldown: 7500,
      maelstromCost: 30,
      execute: (target) => {
        // Main hand strike
        const mhDamage = this.calculateDamage({
          baseDamage: this.mainHandDamage * 2.8,
          coefficient: 2.8,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Off hand strike
        const ohDamage = this.calculateDamage({
          baseDamage: this.offHandDamage * 2.8,
          coefficient: 2.8,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Apply debuff
        target.applyDebuff('stormstrike', {
          duration: 15000,
          natureDamageIncrease: 0.25 // 25% increased nature damage
        });

        // Stormbringer proc resets cooldown
        if (this.stormbringer) {
          this.resetCooldown('stormstrike');
          this.stormbringer = false;
        }

        return mhDamage + ohDamage;
      }
    });

    // Lava Lash - Off-hand attack
    this.registerSpell('lava_lash', {
      id: 60103,
      name: 'Lava Lash',
      castTime: 0,
      cooldown: 0,
      maelstromCost: 40,
      execute: (target) => {
        let coefficient = 2.6;

        // Hot Hand buff increases damage
        if (this.hotHand) {
          coefficient *= 1.5;
          this.hotHand = false;
        }

        const damage = this.calculateDamage({
          baseDamage: this.offHandDamage * coefficient,
          coefficient: coefficient,
          damageType: DAMAGE_TYPE.FIRE,
          target: target,
          canCrit: true
        });

        // Chance for Hot Hand
        if (Math.random() < 0.05) {
          this.hotHand = true;
        }

        // Spreads Flame Shock
        if (this.talents.hotHand && this.flameShock.has(target.id)) {
          const nearbyTargets = this.sim.getTargetsInRange(target.position, 8);
          nearbyTargets.forEach(t => {
            if (t !== target && !this.flameShock.has(t.id)) {
              this.castSpell('flame_shock', t);
            }
          });
        }

        return damage;
      }
    });

    // Crash Lightning - AoE builder
    this.registerSpell('crash_lightning', {
      id: 187874,
      name: 'Crash Lightning',
      castTime: 0,
      cooldown: 0,
      maelstromCost: 20,
      execute: () => {
        const targets = this.sim.getTargetsInRange(this.position, 8);
        let totalDamage = 0;

        targets.forEach(target => {
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * 1.35,
            coefficient: 1.35,
            damageType: DAMAGE_TYPE.NATURE,
            target: target,
            canCrit: true
          });

          totalDamage += damage;
        });

        // Apply buff if 2+ targets hit
        if (targets.length >= 2) {
          this.crashLightning = true;
          this.applyBuff('crash_lightning', {
            duration: 10000,
            cleaveBonus: 0.2 // 20% cleave on Stormstrike/Lava Lash
          });
        }

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Windstrike - Replaces Stormstrike during Ascendance
    this.registerSpell('windstrike', {
      id: 115356,
      name: 'Windstrike',
      castTime: 0,
      cooldown: 3000, // Lower CD than Stormstrike
      maelstromCost: 20,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 4.5,
          coefficient: 4.5,
          damageType: DAMAGE_TYPE.PHYSICAL,
          target: target,
          canCrit: true
        });

        // Apply debuff
        target.applyDebuff('windstrike', {
          duration: 15000,
          natureDamageIncrease: 0.35 // 35% increased nature damage
        });

        return damage;
      }
    });

    // Lightning Bolt (Enhancement) - With Maelstrom Weapon
    this.registerSpell('lightning_bolt_enhancement', {
      id: 187837,
      name: 'Lightning Bolt',
      castTime: (this.maelstromWeapon >= 5) ? 0 : 2000,
      maelstromWeaponCost: 5,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.spellPower * 1.5,
          coefficient: 1.5,
          damageType: DAMAGE_TYPE.NATURE,
          target: target,
          canCrit: true
        });

        // Consume Maelstrom Weapon stacks
        if (this.maelstromWeapon >= 5) {
          this.maelstromWeapon -= 5;
        }

        // Generate Maelstrom resource
        this.generateMaelstrom(5);

        return damage;
      }
    });

    // Elemental Blast (Enhancement)
    this.registerSpell('elemental_blast_enhancement', {
      id: 117014,
      name: 'Elemental Blast',
      castTime: (this.maelstromWeapon >= 5) ? 0 : 2000,
      cooldown: 12000,
      maelstromWeaponCost: 5,
      execute: (target) => {
        const damage = this.calculateDamage({
          baseDamage: this.attackPower * 5.25,
          coefficient: 5.25,
          damageType: DAMAGE_TYPE.ELEMENTAL,
          target: target,
          canCrit: true
        });

        // Consume Maelstrom Weapon stacks
        if (this.maelstromWeapon >= 5) {
          this.maelstromWeapon -= 5;
        }

        // Generate 3 stat buffs
        this.applyBuff('elemental_blast_crit', {
          duration: 10000,
          critBonus: 0.05
        });
        this.applyBuff('elemental_blast_haste', {
          duration: 10000,
          hasteBonus: 0.05
        });
        this.applyBuff('elemental_blast_mastery', {
          duration: 10000,
          masteryBonus: 0.05
        });

        return damage;
      }
    });

    // Feral Spirit - Wolves
    this.registerSpell('feral_spirit', {
      id: 51533,
      name: 'Feral Spirit',
      castTime: 0,
      cooldown: 120000,
      execute: () => {
        // Summon 2 wolves
        const wolf1 = new SpiritWolf(this, 'Frost');
        const wolf2 = new SpiritWolf(this, 'Fire');

        wolf1.spawn();
        wolf2.spawn();

        this.pets.push(wolf1, wolf2);

        return { success: true };
      }
    });

    // Doom Winds - Windfury buff
    this.registerSpell('doom_winds', {
      id: 335903,
      name: 'Doom Winds',
      castTime: 0,
      cooldown: 60000,
      execute: () => {
        this.applyBuff('doom_winds', {
          duration: 8000,
          windfuryChance: 1.0, // 100% Windfury chance
          onApply: () => {
            this.doomWinds = true;
          },
          onExpire: () => {
            this.doomWinds = false;
          }
        });

        // Drop Windfury Totem
        const totem = new WindfuryTotem(this);
        this.totems.air = totem;
        totem.spawn();

        return { success: true };
      }
    });

    // Sundering - AoE burst
    this.registerSpell('sundering', {
      id: 197214,
      name: 'Sundering',
      castTime: 0,
      cooldown: 40000,
      maelstromCost: 60,
      execute: () => {
        const targets = this.sim.getTargetsInCone(this.position, this.facing, 11, 45);
        let totalDamage = 0;

        targets.forEach(target => {
          const damage = this.calculateDamage({
            baseDamage: this.attackPower * 5.2,
            coefficient: 5.2,
            damageType: DAMAGE_TYPE.PHYSICAL,
            target: target,
            canCrit: true
          });

          totalDamage += damage;

          // Apply debuff
          target.applyDebuff('sundering', {
            duration: 2000,
            incapacitated: true
          });
        });

        return { damage: totalDamage, targets: targets.length };
      }
    });

    // Ascendance (Enhancement)
    this.registerSpell('ascendance_enhancement', {
      id: 114051,
      name: 'Ascendance',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        this.applyBuff('ascendance', {
          duration: 15000,
          onApply: () => {
            // Replace Stormstrike with Windstrike
            this.spellReplacements.set('stormstrike', 'windstrike');
          },
          onExpire: () => {
            this.spellReplacements.delete('stormstrike');
          },
          damageBonus: 0.15 // 15% damage increase
        });

        return { success: true };
      }
    });
  }

  // Restoration specialization abilities
  initRestorationAbilities() {
    // Healing Wave - Efficient heal
    this.registerSpell('healing_wave', {
      id: 77472,
      name: 'Healing Wave',
      castTime: 2500,
      manaCost: 900,
      execute: (target) => {
        // Tidal Waves reduces cast time
        const castTime = this.tidalWaves > 0 ? 1875 : 2500;

        const healing = this.calculateHealing({
          baseHealing: this.spellPower * 2.48,
          coefficient: 2.48,
          target: target,
          canCrit: true
        });

        // Consume Tidal Waves
        if (this.tidalWaves > 0) {
          this.tidalWaves--;
        }

        // Unleash Life buff
        if (this.unleashLife) {
          this.unleashLife = false;
          return healing * 1.35; // 35% more healing
        }

        return { healing: healing };
      }
    });

    // Healing Surge - Fast heal
    this.registerSpell('healing_surge', {
      id: 8004,
      name: 'Healing Surge',
      castTime: 1500,
      manaCost: 1100,
      execute: (target) => {
        const healing = this.calculateHealing({
          baseHealing: this.spellPower * 1.88,
          coefficient: 1.88,
          target: target,
          canCrit: true,
          critChance: this.tidalWaves > 0 ? this.critChance + 0.4 : this.critChance
        });

        // Consume Tidal Waves
        if (this.tidalWaves > 0) {
          this.tidalWaves--;
        }

        return { healing: healing };
      }
    });

    // Chain Heal - Smart heal
    this.registerSpell('chain_heal', {
      id: 1064,
      name: 'Chain Heal',
      castTime: 2500,
      manaCost: 2500,
      execute: (target) => {
        const targets = [target];
        let totalHealing = 0;

        // Jump to 4 targets
        for (let i = 0; i < 4 && i < targets.length; i++) {
          const currentTarget = targets[i];

          const healing = this.calculateHealing({
            baseHealing: this.spellPower * (1.68 * Math.pow(0.85, i)), // 15% reduction per jump
            coefficient: 1.68 * Math.pow(0.85, i),
            target: currentTarget,
            canCrit: true
          });

          currentTarget.heal(healing);
          totalHealing += healing;

          // High Tide talent allows extra jumps
          const maxJumps = this.talents.highTide ? 5 : 4;

          // Find next injured ally
          if (i < maxJumps - 1) {
            const injured = this.sim.getMostInjuredAllyInRange(currentTarget.position, 20, targets);
            if (injured) {
              targets.push(injured);
            }
          }
        }

        return { healing: totalHealing, targets: targets.length };
      }
    });

    // Riptide - Instant heal + HoT
    this.registerSpell('riptide', {
      id: 61295,
      name: 'Riptide',
      castTime: 0,
      cooldown: 6000,
      manaCost: 800,
      execute: (target) => {
        // Initial heal
        const initialHeal = this.calculateHealing({
          baseHealing: this.spellPower * 0.97,
          coefficient: 0.97,
          target: target,
          canCrit: true
        });

        // Apply HoT
        this.riptide.set(target.id, {
          duration: 18000,
          tickInterval: 3000,
          remainingDuration: 18000
        });

        target.applyBuff('riptide', {
          duration: 18000,
          tickInterval: 3000,
          source: this,
          onTick: () => {
            const healing = this.calculateHealing({
              baseHealing: this.spellPower * 0.192,
              coefficient: 0.192,
              target: target,
              canCrit: false,
              isHot: true
            });
            target.heal(healing);
            return healing;
          }
        });

        // Generate Tidal Waves
        this.tidalWaves = Math.min(this.tidalWaves + 1, 2);

        return { healing: initialHeal };
      }
    });

    // Healing Rain - Ground AoE heal
    this.registerSpell('healing_rain', {
      id: 73920,
      name: 'Healing Rain',
      castTime: 2000,
      cooldown: 10000,
      manaCost: 2150,
      execute: (position) => {
        const healingRain = {
          active: true,
          position: position,
          radius: 10,
          duration: 10000,
          tickInterval: 2000
        };

        this.healingRainTick(healingRain);

        return { success: true };
      }
    });

    // Spirit Link Totem - Health equalization
    this.registerSpell('spirit_link_totem', {
      id: 98008,
      name: 'Spirit Link Totem',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        const totem = new SpiritLinkTotem(this);
        this.totems.air = totem;
        totem.spawn();

        this.spiritLink = {
          active: true,
          position: this.position,
          radius: 10,
          duration: 6000
        };

        return { success: true };
      }
    });

    // Healing Tide Totem - Major raid CD
    this.registerSpell('healing_tide_totem', {
      id: 108280,
      name: 'Healing Tide Totem',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        const totem = new HealingTideTotem(this);
        this.totems.water = totem;
        totem.spawn();

        return { success: true };
      }
    });

    // Earthen Wall Totem - Absorb shield
    this.registerSpell('earthen_wall_totem', {
      id: 198838,
      name: 'Earthen Wall Totem',
      castTime: 0,
      cooldown: 60000,
      execute: () => {
        const totem = new EarthenWallTotem(this);
        this.totems.earth = totem;
        totem.spawn();

        return { success: true };
      }
    });

    // Cloudburst Totem - Store and release healing
    this.registerSpell('cloudburst_totem', {
      id: 157153,
      name: 'Cloudburst Totem',
      castTime: 0,
      cooldown: 30000,
      execute: () => {
        this.cloudburstTotem = {
          active: true,
          storedHealing: 0,
          maxStore: this.spellPower * 15, // Stores up to 15x SP
          duration: 15000
        };

        const totem = new CloudburstTotem(this);
        this.totems.water = totem;
        totem.spawn();

        return { success: true };
      }
    });

    // Unleash Life - Empower next heal
    this.registerSpell('unleash_life', {
      id: 73685,
      name: 'Unleash Life',
      castTime: 0,
      cooldown: 15000,
      execute: () => {
        this.unleashLife = true;

        this.applyBuff('unleash_life', {
          duration: 10000,
          onExpire: () => {
            this.unleashLife = false;
          }
        });

        return { success: true };
      }
    });

    // Earth Shield - Absorb charges
    this.registerSpell('earth_shield', {
      id: 974,
      name: 'Earth Shield',
      castTime: 0,
      manaCost: 1000,
      execute: (target) => {
        // Remove from previous target
        if (this.earthShield) {
          this.earthShield.removeBuff('earth_shield');
        }

        this.earthShield = target;

        target.applyBuff('earth_shield', {
          duration: -1, // Until consumed
          charges: 9,
          source: this,
          onDamageTaken: () => {
            // Heal when taking damage
            const healing = this.calculateHealing({
              baseHealing: this.spellPower * 0.85,
              coefficient: 0.85,
              target: target,
              canCrit: false
            });

            target.heal(healing);
            return { consumeCharge: true };
          }
        });

        return { success: true };
      }
    });

    // Ascendance (Restoration) - Duplicate healing
    this.registerSpell('ascendance_restoration', {
      id: 114052,
      name: 'Ascendance',
      castTime: 0,
      cooldown: 180000,
      execute: () => {
        this.applyBuff('ascendance', {
          duration: 15000,
          onHeal: (target, amount) => {
            // Duplicate healing to nearby allies
            const allies = this.sim.getAlliesInRange(target.position, 20);
            const distribution = amount / allies.length;

            allies.forEach(ally => {
              if (ally !== target) {
                ally.heal(distribution);
              }
            });
          }
        });

        return { success: true };
      }
    });

    // Wellspring - Burst AoE heal
    this.registerSpell('wellspring', {
      id: 197995,
      name: 'Wellspring',
      castTime: 1500,
      cooldown: 20000,
      manaCost: 2000,
      execute: (target) => {
        const targets = this.sim.getAlliesInCone(this.position, target.position, 30, 30, 6);
        let totalHealing = 0;

        targets.forEach(t => {
          const healing = this.calculateHealing({
            baseHealing: this.spellPower * 2.08,
            coefficient: 2.08,
            target: t,
            canCrit: true
          });

          t.heal(healing);
          totalHealing += healing;
        });

        return { healing: totalHealing, targets: targets.length };
      }
    });
  }

  // Primordial Wave - Cross-spec ability
  registerPrimordialWave() {
    this.registerSpell('primordial_wave', {
      id: 375982,
      name: 'Primordial Wave',
      castTime: 0,
      cooldown: 45000,
      execute: (target) => {
        this.primordialWave.active = true;

        switch(this.currentSpec) {
          case 'elemental':
            // Apply Flame Shock to target and spread
            this.castSpell('flame_shock', target);
            this.primordialWave.targets.add(target.id);

            // Spread to nearby enemies
            const enemies = this.sim.getEnemiesInRange(target.position, 15, 3);
            enemies.forEach(enemy => {
              this.castSpell('flame_shock', enemy);
              this.primordialWave.targets.add(enemy.id);
            });

            // Next Lava Burst hits all targets
            break;

          case 'enhancement':
            // Apply Flame Shock and buff
            this.castSpell('flame_shock', target);
            this.applyBuff('primordial_wave', {
              duration: 15000,
              lightningBoltBonus: 0.75 // 75% chance for extra Lightning Bolt
            });
            break;

          case 'restoration':
            // Apply Riptide to multiple allies
            const allies = this.sim.getAlliesInRange(this.position, 30, 3);
            allies.forEach(ally => {
              this.castSpell('riptide', ally);
            });
            break;
        }

        return { success: true };
      }
    });
  }

  // Resource management
  generateMaelstrom(amount) {
    this.resources.current[RESOURCE_TYPE.MAELSTROM] = Math.min(
      this.resources.current[RESOURCE_TYPE.MAELSTROM] + amount,
      this.resources.max[RESOURCE_TYPE.MAELSTROM]
    );

    // Elemental Equilibrium talent
    if (this.talents.elementalEquilibrium && this.resources.current[RESOURCE_TYPE.MAELSTROM] >= 100) {
      this.applyBuff('elemental_equilibrium', {
        duration: 10000,
        damageBonus: 0.15,
        hasteBonus: 0.25
      });
    }
  }

  // Cast elemental overload
  castOverload(spell, target) {
    // Delayed cast for overload
    this.sim.registerCallback(this.sim.currentTime + 400, () => {
      let damage = 0;

      switch(spell) {
        case 'lightning_bolt':
          damage = this.calculateDamage({
            baseDamage: this.spellPower * 0.77, // 85% of normal
            coefficient: 0.77,
            damageType: DAMAGE_TYPE.NATURE,
            target: target,
            canCrit: true
          });
          break;

        case 'chain_lightning':
          damage = this.calculateDamage({
            baseDamage: this.spellPower * 0.595, // 85% of normal
            coefficient: 0.595,
            damageType: DAMAGE_TYPE.NATURE,
            target: target,
            canCrit: true
          });
          break;

        case 'lava_burst':
          damage = this.calculateDamage({
            baseDamage: this.spellPower * 1.8275, // 85% of normal
            coefficient: 1.8275,
            damageType: DAMAGE_TYPE.FIRE,
            target: target,
            canCrit: true
          });
          break;
      }

      // Generate partial Maelstrom
      this.generateMaelstrom(Math.floor(this.getSpellMaelstrom(spell) * 0.5));
    });
  }

  // Get base Maelstrom generation for a spell
  getSpellMaelstrom(spell) {
    const maelstromValues = {
      'lightning_bolt': 8,
      'chain_lightning': 4,
      'lava_burst': 10,
      'elemental_blast': 30
    };

    return maelstromValues[spell] || 0;
  }

  // Healing Rain tick
  healingRainTick(healingRain) {
    if (!healingRain.active) return;

    const allies = this.sim.getAlliesInRange(healingRain.position, healingRain.radius, 6);

    allies.forEach(ally => {
      const healing = this.calculateHealing({
        baseHealing: this.spellPower * 0.24,
        coefficient: 0.24,
        target: ally,
        canCrit: false
      });
      ally.heal(healing);
    });

    healingRain.duration -= healingRain.tickInterval;

    if (healingRain.duration > 0) {
      this.sim.registerCallback(
        this.sim.currentTime + healingRain.tickInterval,
        () => this.healingRainTick(healingRain)
      );
    } else {
      healingRain.active = false;
    }
  }

  // Update method
  update(deltaTime) {
    super.update(deltaTime);

    // Mana regeneration for Restoration
    if (this.currentSpec === 'restoration') {
      const manaRegen = this.resources.max[RESOURCE_TYPE.MANA] * 0.02; // 2% per second
      this.resources.current[RESOURCE_TYPE.MANA] = Math.min(
        this.resources.current[RESOURCE_TYPE.MANA] + manaRegen * (deltaTime / 1000),
        this.resources.max[RESOURCE_TYPE.MANA]
      );
    }

    // Maelstrom Weapon generation for Enhancement
    if (this.currentSpec === 'enhancement') {
      // Auto attack procs
      if (Math.random() < 0.05 * (deltaTime / 1000)) {
        this.maelstromWeapon = Math.min(this.maelstromWeapon + 1, this.maxMaelstromWeapon);
      }

      // Stormbringer proc chance
      if (Math.random() < 0.03 * (deltaTime / 1000)) {
        this.stormbringer = true;
      }
    }

    // Mastery chance for Elemental
    if (this.currentSpec === 'elemental') {
      this.masteryChance = 0.16 + this.getMasteryBonus(); // Base 16% + mastery
    }
  }

  // Get distance between two positions
  getDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// Totem base class
class Totem {
  constructor(shaman, type) {
    this.owner = shaman;
    this.sim = shaman.sim;
    this.type = type;
    this.name = `${shaman.name}'s ${type}`;
    this.position = shaman.position;
    this.duration = 0;
    this.active = false;
  }

  spawn() {
    this.active = true;
    this.sim.registerTotem(this);

    if (this.duration > 0) {
      this.sim.registerCallback(this.sim.currentTime + this.duration, () => {
        this.despawn();
      });
    }
  }

  despawn() {
    this.active = false;
    this.sim.unregisterTotem(this);
  }
}

// Healing Stream Totem
class HealingStreamTotem extends Totem {
  constructor(shaman) {
    super(shaman, 'Healing Stream Totem');
    this.duration = 15000;
    this.tickInterval = 2000;
  }

  spawn() {
    super.spawn();
    this.tick();
  }

  tick() {
    if (!this.active) return;

    // Heal lowest health ally
    const ally = this.sim.getMostInjuredAllyInRange(this.position, 40);
    if (ally) {
      const healing = this.owner.calculateHealing({
        baseHealing: this.owner.spellPower * 0.47,
        coefficient: 0.47,
        target: ally,
        canCrit: false,
        source: this
      });
      ally.heal(healing);
    }

    this.sim.registerCallback(this.sim.currentTime + this.tickInterval, () => {
      this.tick();
    });
  }
}

// Other totem implementations...
class FireElemental extends Totem {
  constructor(shaman) {
    super(shaman, 'Fire Elemental');
    this.duration = 30000;
    this.castInterval = 2000;
  }

  spawn() {
    super.spawn();
    this.cast();
  }

  cast() {
    if (!this.active) return;

    const target = this.owner.target;
    if (target) {
      // Fire Blast
      const damage = this.owner.calculateDamage({
        baseDamage: this.owner.spellPower * 1.2,
        coefficient: 1.2,
        damageType: DAMAGE_TYPE.FIRE,
        target: target,
        canCrit: true,
        source: this
      });
    }

    this.sim.registerCallback(this.sim.currentTime + this.castInterval, () => {
      this.cast();
    });
  }
}

class StormElemental extends Totem {
  constructor(shaman) {
    super(shaman, 'Storm Elemental');
    this.duration = 30000;
    this.castInterval = 3000;
  }

  spawn() {
    super.spawn();
    this.cast();
  }

  cast() {
    if (!this.active) return;

    // Eye of the Storm - AoE damage
    const targets = this.sim.getTargetsInRange(this.position, 20);
    targets.forEach(target => {
      const damage = this.owner.calculateDamage({
        baseDamage: this.owner.spellPower * 0.6,
        coefficient: 0.6,
        damageType: DAMAGE_TYPE.NATURE,
        target: target,
        canCrit: true,
        source: this
      });
    });

    this.sim.registerCallback(this.sim.currentTime + this.castInterval, () => {
      this.cast();
    });
  }
}

class SpiritWolf {
  constructor(shaman, type) {
    this.owner = shaman;
    this.sim = shaman.sim;
    this.type = type;
    this.name = `${shaman.name}'s ${type} Wolf`;
    this.duration = 15000;
    this.attackSpeed = 1500;
    this.active = false;
  }

  spawn() {
    this.active = true;
    this.sim.registerPet(this);
    this.attack();

    this.sim.registerCallback(this.sim.currentTime + this.duration, () => {
      this.despawn();
    });
  }

  despawn() {
    this.active = false;
    this.sim.unregisterPet(this);
  }

  attack() {
    if (!this.active) return;

    const target = this.owner.target;
    if (target) {
      const damage = this.owner.calculateDamage({
        baseDamage: this.owner.attackPower * 0.6,
        coefficient: 0.6,
        damageType: DAMAGE_TYPE.PHYSICAL,
        target: target,
        canCrit: true,
        source: this
      });

      // Special abilities based on type
      if (this.type === 'Frost') {
        // Slow target
        target.applyDebuff('frost_wolf_slow', {
          duration: 3000,
          moveSpeedReduction: 0.5
        });
      } else if (this.type === 'Fire') {
        // DoT
        target.applyDebuff('fire_wolf_burn', {
          duration: 6000,
          tickInterval: 2000,
          damagePerTick: this.owner.attackPower * 0.1
        });
      }
    }

    this.sim.registerCallback(this.sim.currentTime + this.attackSpeed, () => {
      this.attack();
    });
  }
}

// Additional totem implementations
class WindfuryTotem extends Totem {
  constructor(shaman) {
    super(shaman, 'Windfury Totem');
    this.duration = 120000;
    this.radius = 30;
  }

  spawn() {
    super.spawn();

    // Apply Windfury buff to allies in range
    const allies = this.sim.getAlliesInRange(this.position, this.radius);
    allies.forEach(ally => {
      ally.applyBuff('windfury_totem', {
        duration: -1, // Lasts while in range
        source: this,
        procChance: 0.2, // 20% chance for extra attacks
        onAutoAttack: () => {
          if (Math.random() < 0.2) {
            // Trigger 2 extra attacks
            return { extraAttacks: 2, attackPowerBonus: this.owner.attackPower * 0.1 };
          }
        }
      });
    });
  }
}

class SpiritLinkTotem extends Totem {
  constructor(shaman) {
    super(shaman, 'Spirit Link Totem');
    this.duration = 6000;
    this.tickInterval = 1000;
    this.radius = 10;
  }

  spawn() {
    super.spawn();
    this.tick();
  }

  tick() {
    if (!this.active) return;

    // Redistribute health among allies
    const allies = this.sim.getAlliesInRange(this.position, this.radius);
    if (allies.length > 0) {
      const totalHealth = allies.reduce((sum, ally) => sum + ally.currentHealth, 0);
      const averageHealth = totalHealth / allies.length;

      allies.forEach(ally => {
        const difference = averageHealth - ally.currentHealth;
        if (difference > 0) {
          ally.heal(difference * 0.25); // Redistribute 25% per tick
        } else {
          ally.currentHealth -= Math.abs(difference) * 0.25;
        }
      });
    }

    this.sim.registerCallback(this.sim.currentTime + this.tickInterval, () => {
      this.tick();
    });
  }
}

class HealingTideTotem extends Totem {
  constructor(shaman) {
    super(shaman, 'Healing Tide Totem');
    this.duration = 10000;
    this.tickInterval = 2000;
  }

  spawn() {
    super.spawn();
    this.tick();
  }

  tick() {
    if (!this.active) return;

    // Heal all allies in range
    const allies = this.sim.getAlliesInRange(this.position, 40);
    allies.forEach(ally => {
      const healing = this.owner.calculateHealing({
        baseHealing: this.owner.spellPower * 0.82,
        coefficient: 0.82,
        target: ally,
        canCrit: false,
        source: this
      });
      ally.heal(healing);
    });

    this.sim.registerCallback(this.sim.currentTime + this.tickInterval, () => {
      this.tick();
    });
  }
}

class EarthenWallTotem extends Totem {
  constructor(shaman) {
    super(shaman, 'Earthen Wall Totem');
    this.duration = 18000;
    this.maxAbsorb = shaman.spellPower * 10;
    this.currentAbsorb = 0;
  }

  spawn() {
    super.spawn();

    // Create wall effect in front of shaman
    const allies = this.sim.getAlliesInLine(this.position, this.owner.facing, 10, 5);
    allies.forEach(ally => {
      ally.applyBuff('earthen_wall', {
        duration: this.duration,
        source: this,
        absorb: this.maxAbsorb / allies.length,
        onDamageTaken: (damage) => {
          const absorbed = Math.min(damage, this.maxAbsorb - this.currentAbsorb);
          this.currentAbsorb += absorbed;
          return damage - absorbed;
        }
      });
    });
  }
}

class CloudburstTotem extends Totem {
  constructor(shaman) {
    super(shaman, 'Cloudburst Totem');
    this.duration = 15000;
    this.storedHealing = 0;
    this.maxStore = shaman.spellPower * 15;
  }

  spawn() {
    super.spawn();

    // Track healing done
    this.owner.onHealingDone = (amount) => {
      if (this.active) {
        this.storedHealing = Math.min(this.storedHealing + amount * 0.25, this.maxStore);
      }
    };
  }

  despawn() {
    // Release stored healing
    if (this.storedHealing > 0) {
      const allies = this.sim.getAlliesInRange(this.position, 40);
      const healPerTarget = this.storedHealing / Math.max(1, allies.length);

      allies.forEach(ally => {
        ally.heal(healPerTarget);
      });
    }

    super.despawn();
  }
}