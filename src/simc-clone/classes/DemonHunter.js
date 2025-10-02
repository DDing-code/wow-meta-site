/**
 * Phase 3.6: Demon Hunter Class Implementation
 * 악마사냥꾼 클래스 - Havoc, Vengeance
 * Lines: ~1,200
 */

import { Player } from '../Player.js';
import { Action } from '../Action.js';
import { Buff } from '../Buff.js';
import { RESOURCE_TYPE } from '../Actor.js';
import { DAMAGE_TYPE } from '../core/DamageCalculator.js';

// ==================== 악마사냥꾼 상수 ====================
export const DEMON_HUNTER_CONSTANTS = {
  // 격노 관리
  FURY: {
    MAX: 120,
    DEMON_BITE_GENERATION: 20,
    CHAOS_STRIKE_COST: 40,
    BLADE_DANCE_COST: 35,
    EYE_BEAM_COST: 30
  },

  // 고통 (Vengeance)
  PAIN: {
    MAX: 100,
    SHEAR_GENERATION: 10,
    DEMON_SPIKES_COST: 0, // 충전식
    SOUL_CLEAVE_COST: 30
  },

  // 스펙별 특수 메커니즘
  HAVOC: {
    METAMORPHOSIS_DURATION: 30000,
    METAMORPHOSIS_HASTE: 0.25,
    BLADE_DANCE_RADIUS: 8,
    MOMENTUM_DURATION: 6000,
    DEMONIC_DURATION: 6000
  },

  VENGEANCE: {
    METAMORPHOSIS_DURATION: 15000,
    DEMON_SPIKES_DURATION: 6000,
    DEMON_SPIKES_CHARGES: 2,
    SOUL_FRAGMENT_HEALING: 0.08,
    FIERY_BRAND_DURATION: 10000
  }
};

// ==================== 악마사냥꾼 기본 클래스 ====================
export class DemonHunter extends Player {
  constructor(sim, name) {
    super(sim, name);

    this.class = 'demonhunter';

    // 악마사냥꾼 특성
    this.canBlock = false;
    this.canParry = true;
    this.canDodge = true;
    this.isDualWielding = true;

    // 악마 형상
    this.metamorphosis = false;
    this.metamorphosisEndTime = 0;

    // 영혼 파편
    this.soulFragments = 0;
    this.maxSoulFragments = 5;

    // 시야
    this.spectralSight = false;

    this.setupCommonAbilities();
  }

  // ==================== 영혼 파편 시스템 ====================
  generateSoulFragment(count = 1) {
    const before = this.soulFragments;
    this.soulFragments = Math.min(this.soulFragments + count, this.maxSoulFragments);
    const generated = this.soulFragments - before;

    if (generated > 0) {
      // 자동 소비 (가까이 있으면)
      this.sim.scheduleEvent({
        time: this.sim.currentTime + 1000,
        actor: this,
        callback: () => this.consumeSoulFragment()
      });
    }

    return generated;
  }

  consumeSoulFragment(count = 1) {
    if (this.soulFragments < count) return 0;

    this.soulFragments -= count;

    // 치유
    const healPercent = DEMON_HUNTER_CONSTANTS.VENGEANCE.SOUL_FRAGMENT_HEALING;
    const healAmount = this.resources.max.health * healPercent * count;
    this.heal(healAmount);

    // Vengeance: 고통 생성
    if (this.spec === 'vengeance') {
      this.grantResource(RESOURCE_TYPE.PAIN, 8 * count, 'soul_fragment');
    }

    return count;
  }

  consumeAllSoulFragments() {
    const consumed = this.soulFragments;
    this.consumeSoulFragment(consumed);
    return consumed;
  }

  // ==================== 공통 스킬 ====================
  setupCommonAbilities() {
    // Metamorphosis
    this.abilities.metamorphosis = new Action({
      name: 'Metamorphosis',
      cooldown: this.spec === 'havoc' ? 240000 : 180000,
      execute: () => {
        this.enterMetamorphosis();
      }
    });

    // Spectral Sight
    this.abilities.spectralSight = new Action({
      name: 'Spectral Sight',
      cooldown: 30000,
      execute: () => {
        this.spectralSight = true;

        this.applyBuff('spectralSight', {
          duration: 10000,
          seeInvisible: true,
          moveSpeedReduction: 0.5
        });

        this.sim.scheduleEvent({
          time: this.sim.currentTime + 10000,
          actor: this,
          callback: () => { this.spectralSight = false; }
        });
      }
    });

    // Glide
    this.abilities.glide = new Action({
      name: 'Glide',
      instantCast: true,
      execute: () => {
        this.applyBuff('glide', {
          duration: 999999,
          fallDamageImmune: true,
          moveSpeed: 1.5
        });
      }
    });

    // Consume Magic
    this.abilities.consumeMagic = new Action({
      name: 'Consume Magic',
      cooldown: 10000,
      range: 20,
      execute: () => {
        const dispelled = this.target.dispelBuff('magic');

        if (dispelled) {
          // 격노/고통 생성
          const resource = this.spec === 'havoc' ? RESOURCE_TYPE.FURY : RESOURCE_TYPE.PAIN;
          this.grantResource(resource, 20, 'consume_magic');
        }
      }
    });

    // Imprison
    this.abilities.imprison = new Action({
      name: 'Imprison',
      castTime: 3000,
      cooldown: 45000,
      execute: () => {
        this.target.applyDebuff('imprison', {
          duration: 60000,
          incapacitated: true,
          breakOnDamage: true
        });
      }
    });

    // Torment
    this.abilities.torment = new Action({
      name: 'Torment',
      cooldown: 8000,
      execute: () => {
        // 도발
        this.target.setTarget(this);
        this.generateThreat(10000);
      }
    });

    // Darkness
    this.abilities.darkness = new Action({
      name: 'Darkness',
      cooldown: 196000,
      execute: () => {
        this.createDarknessArea();
      }
    });

    // Disrupt
    this.abilities.disrupt = new Action({
      name: 'Disrupt',
      cooldown: 15000,
      range: 10,
      execute: () => {
        if (this.target.currentCast) {
          this.target.interruptCast();
          this.target.applyDebuff('disrupted', {
            duration: 3000,
            silenced: true
          });
        }
      }
    });
  }

  enterMetamorphosis() {
    this.metamorphosis = true;

    const duration = this.spec === 'havoc' ?
      DEMON_HUNTER_CONSTANTS.HAVOC.METAMORPHOSIS_DURATION :
      DEMON_HUNTER_CONSTANTS.VENGEANCE.METAMORPHOSIS_DURATION;

    this.metamorphosisEndTime = this.sim.currentTime + duration;

    if (this.spec === 'havoc') {
      // Havoc: 이동, 가속, 생기 흡수
      this.applyBuff('metamorphosis', {
        duration: duration,
        hastePercent: DEMON_HUNTER_CONSTANTS.HAVOC.METAMORPHOSIS_HASTE,
        leech: 0.25,
        moveSpeed: 1.3
      });

      // 즉시 데미지
      const damage = this.stats.get('attackPower') * 2.0;
      const targets = this.getNearbyTargets(10);
      for (const target of targets) {
        this.dealDamage(target, damage, DAMAGE_TYPE.CHAOS, 'metamorphosis_impact');
      }
    } else {
      // Vengeance: 체력, 방어력
      const healthBonus = this.resources.max.health * 0.5;
      this.resources.max.health += healthBonus;
      this.resources.current.health += healthBonus;

      this.applyBuff('metamorphosis', {
        duration: duration,
        armorBonus: 2.0,
        damageReduction: 0.2,
        healthBonus: healthBonus
      });
    }

    this.sim.scheduleEvent({
      time: this.metamorphosisEndTime,
      actor: this,
      callback: () => {
        this.metamorphosis = false;
        this.removeBuff('metamorphosis');

        if (this.spec === 'vengeance') {
          const healthBonus = this.buffs.get('metamorphosis')?.healthBonus || 0;
          this.resources.max.health -= healthBonus;
          this.resources.current.health = Math.min(
            this.resources.current.health,
            this.resources.max.health
          );
        }
      }
    });
  }

  createDarknessArea() {
    const duration = 8000;
    const radius = 8;

    // 지역 효과
    const affectedTargets = this.getAllyTargetsInArea(radius);

    for (const target of affectedTargets) {
      target.applyBuff('darkness', {
        duration: duration,
        dodgeChance: 0.2 // 20% 회피
      });
    }
  }
}

// ==================== Havoc 악마사냥꾼 ====================
export class HavocDemonHunter extends DemonHunter {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'havoc';

    this.resources.base[RESOURCE_TYPE.FURY] = 0;
    this.resources.max[RESOURCE_TYPE.FURY] = DEMON_HUNTER_CONSTANTS.FURY.MAX;
    this.resources.current[RESOURCE_TYPE.FURY] = 0;

    // Havoc 특수 메커니즘
    this.momentum = false;
    this.prepared = false;
    this.demonicActive = false;
    this.firstBlood = true;

    this.setupHavocAbilities();
  }

  setupHavocAbilities() {
    // Demon's Bite
    this.abilities.demonsBite = new Action({
      name: "Demon's Bite",
      instantCast: true,
      execute: () => {
        const damage = this.calculateDemonsBiteDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'demons_bite');

        // 격노 생성
        let fury = DEMON_HUNTER_CONSTANTS.FURY.DEMON_BITE_GENERATION;
        if (Math.random() < 0.25) {
          fury += 20; // 25% 확률로 추가 격노
        }
        this.grantResource(RESOURCE_TYPE.FURY, fury, 'demons_bite');

        // Soul Fragment 생성
        if (this.talents.demonBlades && Math.random() < 0.6) {
          this.generateSoulFragment(1);
        }
      }
    });

    // Chaos Strike
    this.abilities.chaosStrike = new Action({
      name: 'Chaos Strike',
      instantCast: true,
      furyCost: DEMON_HUNTER_CONSTANTS.FURY.CHAOS_STRIKE_COST,
      execute: () => {
        let damage = this.calculateChaosStrikeDamage();

        // First Blood
        if (this.firstBlood && this.talents.firstBlood) {
          damage *= 2.0;
          this.firstBlood = false;
        }

        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.CHAOS, 'chaos_strike');

        // 치명타 시 격노 환급
        if (result.crit && this.talents.chaosTheory) {
          this.grantResource(RESOURCE_TYPE.FURY, 20, 'chaos_theory');
        }

        // 보조 무기 공격 (Annihilation in Meta)
        const offhandDamage = damage * 0.6;
        this.dealDamage(this.target, offhandDamage, DAMAGE_TYPE.CHAOS,
          this.metamorphosis ? 'annihilation_off' : 'chaos_strike_off');
      }
    });

    // Blade Dance
    this.abilities.bladeDance = new Action({
      name: 'Blade Dance',
      instantCast: true,
      furyCost: DEMON_HUNTER_CONSTANTS.FURY.BLADE_DANCE_COST,
      cooldown: 9000,
      execute: () => {
        const targets = this.getNearbyTargets(DEMON_HUNTER_CONSTANTS.HAVOC.BLADE_DANCE_RADIUS);
        const damage = this.calculateBladeDanceDamage();

        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL,
            this.metamorphosis ? 'death_sweep' : 'blade_dance');
        }

        // 회피 버프
        this.applyBuff('bladeDance', {
          duration: 1000,
          dodgeBonus: 1.0 // 100% 회피
        });

        // First Blood 리셋
        if (this.talents.firstBlood) {
          this.firstBlood = true;
        }
      }
    });

    // Eye Beam
    this.abilities.eyeBeam = new Action({
      name: 'Eye Beam',
      channeled: true,
      duration: 2000,
      furyCost: DEMON_HUNTER_CONSTANTS.FURY.EYE_BEAM_COST,
      cooldown: 45000,
      execute: () => {
        this.channelEyeBeam();
      }
    });

    // Fel Rush
    this.abilities.felRush = new Action({
      name: 'Fel Rush',
      charges: 2,
      chargeCooldown: 10000,
      instantCast: true,
      execute: () => {
        // 돌진
        this.dash(15);

        // 데미지
        const damage = this.calculateFelRushDamage();
        const targets = this.getTargetsInPath(15, 6);

        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.CHAOS, 'fel_rush');
        }

        // Momentum
        if (this.talents.momentum) {
          this.applyMomentum();
        }

        // Unbound Chaos
        if (this.talents.unboundChaos) {
          this.applyBuff('unboundChaos', {
            duration: 20000,
            nextFelRushBonus: 2.5
          });
        }
      }
    });

    // Vengeful Retreat
    this.abilities.vengefulRetreat = new Action({
      name: 'Vengeful Retreat',
      cooldown: 25000,
      instantCast: true,
      execute: () => {
        // 후방 도약
        this.leap(-15);

        // Momentum
        if (this.talents.momentum) {
          this.applyMomentum();
        }

        // Prepared
        if (this.talents.prepared) {
          this.prepared = true;
          this.applyBuff('prepared', {
            duration: 10000,
            furyGeneration: 0.1
          });
        }
      }
    });

    // Immolation Aura
    this.abilities.immolationAura = new Action({
      name: 'Immolation Aura',
      cooldown: 30000,
      execute: () => {
        this.applyBuff('immolationAura', {
          duration: 6000,
          tickInterval: 1000,
          onTick: () => {
            const damage = this.stats.get('attackPower') * 0.15;
            const targets = this.getNearbyTargets(8);

            for (const target of targets) {
              this.dealDamage(target, damage, DAMAGE_TYPE.FIRE, 'immolation_aura');
            }

            // 격노 생성
            this.grantResource(RESOURCE_TYPE.FURY, 5, 'immolation_aura');
          }
        });
      }
    });

    // Throw Glaive
    this.abilities.throwGlaive = new Action({
      name: 'Throw Glaive',
      cooldown: 9000,
      range: 30,
      execute: () => {
        const damage = this.calculateThrowGlaiveDamage();

        // 투척
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'throw_glaive');

        // 반동 (최대 2타겟)
        const nearbyTargets = this.target.getNearbyTargets(10);
        for (const target of nearbyTargets.slice(0, 2)) {
          this.dealDamage(target, damage * 0.5, DAMAGE_TYPE.PHYSICAL, 'throw_glaive_ricochet');
        }

        // 감속
        this.target.applyDebuff('throwGlaive', {
          duration: 3000,
          movementSpeedReduction: 0.3
        });
      }
    });

    // Fel Barrage
    this.abilities.felBarrage = new Action({
      name: 'Fel Barrage',
      channeled: true,
      duration: 3000,
      cooldown: 60000,
      execute: () => {
        this.channelFelBarrage();
      }
    });

    // The Hunt
    this.abilities.theHunt = new Action({
      name: 'The Hunt',
      cooldown: 90000,
      range: 50,
      execute: () => {
        // 대상 돌진
        this.chargeToTarget(this.target);

        // 데미지
        const damage = this.calculateTheHuntDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.NATURE, 'the_hunt');

        // DoT
        this.target.applyDebuff('theHunt', {
          duration: 6000,
          tickInterval: 2000,
          tickDamage: damage * 0.15
        });

        // 격노 생성
        this.grantResource(RESOURCE_TYPE.FURY, 50, 'the_hunt');
      }
    });

    // Essence Break
    this.abilities.essenceBreak = new Action({
      name: 'Essence Break',
      cooldown: 45000,
      execute: () => {
        const damage = this.calculateEssenceBreakDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.CHAOS, 'essence_break');

        this.target.applyDebuff('essenceBreak', {
          duration: 8000,
          chaosDamageIncrease: 0.8
        });

        // Chaos Strike/Blade Dance 강화
        this.applyBuff('essenceBreak', {
          duration: 8000,
          chaosStrikeBonus: 0.5
        });
      }
    });

    // Glaive Tempest
    this.abilities.glaiveTempest = new Action({
      name: 'Glaive Tempest',
      cooldown: 120000,
      furyCost: 30,
      execute: () => {
        // 즉시 데미지
        const damage = this.calculateGlaiveTempestDamage();
        const targets = this.getNearbyTargets(8);

        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL, 'glaive_tempest');
        }

        // 지속 회전
        this.applyBuff('glaiveTempest', {
          duration: 3000,
          tickInterval: 500,
          onTick: () => {
            const tickDamage = damage * 0.1;
            const nearbyTargets = this.getNearbyTargets(8);

            for (const target of nearbyTargets) {
              this.dealDamage(target, tickDamage, DAMAGE_TYPE.PHYSICAL, 'glaive_tempest_tick');
            }
          }
        });
      }
    });
  }

  calculateDemonsBiteDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.36;
  }

  calculateChaosStrikeDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 0.99;

    if (this.metamorphosis) {
      damage *= 1.5; // Annihilation
    }

    return damage;
  }

  calculateBladeDanceDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 0.275;

    if (this.metamorphosis) {
      damage *= 1.5; // Death Sweep
    }

    return damage;
  }

  calculateFelRushDamage() {
    const ap = this.stats.get('attackPower');
    let damage = ap * 0.123;

    if (this.buffs.has('unboundChaos')) {
      damage *= 2.5;
      this.removeBuff('unboundChaos');
    }

    return damage;
  }

  calculateThrowGlaiveDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.3;
  }

  calculateTheHuntDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 5.0;
  }

  calculateEssenceBreakDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 3.2;
  }

  calculateGlaiveTempestDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 1.48;
  }

  channelEyeBeam() {
    const ticks = 10;
    const tickInterval = 200;

    for (let i = 0; i < ticks; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * tickInterval,
        actor: this,
        callback: () => {
          const damage = this.stats.get('attackPower') * 0.23;
          const targets = this.getTargetsInBeam(20, 10);

          for (const target of targets) {
            this.dealDamage(target, damage, DAMAGE_TYPE.CHAOS, `eye_beam_${i+1}`);
          }
        }
      });
    }

    // Demonic (특성)
    if (this.talents.demonic) {
      this.enterDemonic();
    }

    // Blind Fury (특성)
    if (this.talents.blindFury) {
      this.grantResource(RESOURCE_TYPE.FURY, 50, 'blind_fury');
    }
  }

  channelFelBarrage() {
    const ticks = 8;
    const tickInterval = 375;

    for (let i = 0; i < ticks; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * tickInterval,
        actor: this,
        callback: () => {
          const damage = this.stats.get('attackPower') * 0.33;
          const targets = this.getNearbyTargets(8);

          for (const target of targets) {
            this.dealDamage(target, damage, DAMAGE_TYPE.CHAOS, `fel_barrage_${i+1}`);
          }
        }
      });
    }
  }

  applyMomentum() {
    this.momentum = true;

    this.applyBuff('momentum', {
      duration: DEMON_HUNTER_CONSTANTS.HAVOC.MOMENTUM_DURATION,
      damageMultiplier: 1.1,
      moveSpeed: 1.15
    });

    this.sim.scheduleEvent({
      time: this.sim.currentTime + DEMON_HUNTER_CONSTANTS.HAVOC.MOMENTUM_DURATION,
      actor: this,
      callback: () => { this.momentum = false; }
    });
  }

  enterDemonic() {
    this.demonicActive = true;

    // 변신
    this.enterMetamorphosis();

    // 짧은 지속시간 덮어쓰기
    this.buffs.get('metamorphosis').duration = DEMON_HUNTER_CONSTANTS.HAVOC.DEMONIC_DURATION;
    this.metamorphosisEndTime = this.sim.currentTime + DEMON_HUNTER_CONSTANTS.HAVOC.DEMONIC_DURATION;

    this.sim.scheduleEvent({
      time: this.sim.currentTime + DEMON_HUNTER_CONSTANTS.HAVOC.DEMONIC_DURATION,
      actor: this,
      callback: () => {
        this.demonicActive = false;
        this.metamorphosis = false;
      }
    });
  }

  dash(distance) {
    // 돌진 이동
    this.position = {
      x: this.position.x + distance,
      y: this.position.y
    };
  }

  leap(distance) {
    // 도약 이동
    this.position = {
      x: this.position.x + distance,
      y: this.position.y
    };
  }

  chargeToTarget(target) {
    // 대상에게 돌진
    this.position = { ...target.position };
  }

  getTargetsInBeam(length, width) {
    // 선형 범위의 대상들
    return this.sim.targets.filter(t => {
      // 간단한 선형 판정
      return t.isAlive() && this.getDistanceTo(t) <= length;
    });
  }

  getTargetsInPath(length, width) {
    // 경로상의 대상들
    return this.sim.targets.filter(t => {
      return t.isAlive() && this.getDistanceTo(t) <= length;
    });
  }
}

// ==================== Vengeance 악마사냥꾼 ====================
export class VengeanceDemonHunter extends DemonHunter {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'vengeance';
    this.role = 'tank';

    this.resources.base[RESOURCE_TYPE.PAIN] = 0;
    this.resources.max[RESOURCE_TYPE.PAIN] = DEMON_HUNTER_CONSTANTS.PAIN.MAX;
    this.resources.current[RESOURCE_TYPE.PAIN] = 0;

    // Vengeance 특수 메커니즘
    this.demonSpikesCharges = DEMON_HUNTER_CONSTANTS.VENGEANCE.DEMON_SPIKES_CHARGES;
    this.lastResortUsed = false;
    this.soulBarrier = 0;

    this.setupVengeanceAbilities();
  }

  setupVengeanceAbilities() {
    // Shear
    this.abilities.shear = new Action({
      name: 'Shear',
      instantCast: true,
      execute: () => {
        const damage = this.calculateShearDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.PHYSICAL, 'shear');

        // 고통 생성
        let pain = DEMON_HUNTER_CONSTANTS.PAIN.SHEAR_GENERATION;
        if (this.metamorphosis) {
          pain += 7; // 변신 중 추가
        }
        this.grantResource(RESOURCE_TYPE.PAIN, pain, 'shear');

        // Soul Fragment 생성
        if (Math.random() < 0.1) {
          this.generateSoulFragment(1);
        }
      }
    });

    // Soul Cleave
    this.abilities.soulCleave = new Action({
      name: 'Soul Cleave',
      instantCast: true,
      painCost: DEMON_HUNTER_CONSTANTS.PAIN.SOUL_CLEAVE_COST,
      execute: () => {
        const damage = this.calculateSoulCleaveDamage();
        const targets = this.getNearbyTargets(8);

        // 광역 데미지
        for (const target of targets.slice(0, 5)) {
          this.dealDamage(target, damage, DAMAGE_TYPE.PHYSICAL, 'soul_cleave');
        }

        // Soul Fragment 소비
        const fragments = Math.min(this.soulFragments, 2);
        this.consumeSoulFragment(fragments);

        // 추가 치유
        const healAmount = this.resources.max.health * 0.05 * (1 + fragments);
        this.heal(healAmount);
      }
    });

    // Demon Spikes
    this.abilities.demonSpikes = new Action({
      name: 'Demon Spikes',
      charges: DEMON_HUNTER_CONSTANTS.VENGEANCE.DEMON_SPIKES_CHARGES,
      chargeCooldown: 20000,
      execute: () => {
        this.applyBuff('demonSpikes', {
          duration: DEMON_HUNTER_CONSTANTS.VENGEANCE.DEMON_SPIKES_DURATION,
          armorBonus: 1.5,
          parryBonus: 0.15
        });
      }
    });

    // Immolation Aura (Vengeance)
    this.abilities.immolationAura = new Action({
      name: 'Immolation Aura',
      cooldown: 15000,
      execute: () => {
        this.applyBuff('immolationAura', {
          duration: 6000,
          tickInterval: 1000,
          onTick: () => {
            const damage = this.stats.get('attackPower') * 0.2;
            const targets = this.getNearbyTargets(8);

            for (const target of targets) {
              this.dealDamage(target, damage, DAMAGE_TYPE.FIRE, 'immolation_aura');
            }

            // 고통 생성
            this.grantResource(RESOURCE_TYPE.PAIN, 2, 'immolation_aura');

            // Infernal Armor 특성
            if (this.talents.infernalArmor) {
              this.applyBuff('infernalArmor', {
                duration: 6000,
                armorBonus: 0.1,
                maxStacks: 10
              });
            }
          }
        });

        // 즉시 폭발
        const initialDamage = this.stats.get('attackPower') * 0.5;
        const targets = this.getNearbyTargets(8);

        for (const target of targets) {
          this.dealDamage(target, initialDamage, DAMAGE_TYPE.FIRE, 'immolation_initial');
        }

        // 표식
        for (const target of targets.slice(0, 3)) {
          target.applyDebuff('fieryBrand', {
            duration: DEMON_HUNTER_CONSTANTS.VENGEANCE.FIERY_BRAND_DURATION,
            damageReduction: 0.4
          });
        }
      }
    });

    // Sigil of Flame
    this.abilities.sigilOfFlame = new Action({
      name: 'Sigil of Flame',
      cooldown: 30000,
      execute: () => {
        // 1.5초 후 폭발
        this.sim.scheduleEvent({
          time: this.sim.currentTime + 1500,
          actor: this,
          callback: () => {
            const damage = this.calculateSigilDamage();
            const targets = this.getTargetsInArea(8);

            for (const target of targets) {
              this.dealDamage(target, damage, DAMAGE_TYPE.FIRE, 'sigil_of_flame');

              // DoT
              target.applyDebuff('sigilOfFlame', {
                duration: 6000,
                tickInterval: 1000,
                tickDamage: damage * 0.1
              });
            }
          }
        });
      }
    });

    // Infernal Strike
    this.abilities.infernalStrike = new Action({
      name: 'Infernal Strike',
      charges: 2,
      chargeCooldown: 20000,
      execute: () => {
        // 도약
        this.leap(20);

        // 착지 데미지
        const damage = this.calculateInfernalStrikeDamage();
        const targets = this.getTargetsInArea(6);

        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.FIRE, 'infernal_strike');
        }

        // Sigil 생성
        this.createSigilArea({
          duration: 6000,
          radius: 6,
          tickInterval: 1000,
          damage: damage * 0.05
        });
      }
    });

    // Spirit Bomb
    this.abilities.spiritBomb = new Action({
      name: 'Spirit Bomb',
      painCost: 40,
      usableIf: () => this.soulFragments >= 4,
      execute: () => {
        // 모든 Soul Fragment 소비
        const fragments = this.soulFragments;
        this.consumeAllSoulFragments();

        const damage = this.calculateSpiritBombDamage(fragments);
        const targets = this.getTargetsInArea(8);

        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.FIRE, 'spirit_bomb');

          // Frailty 디버프
          target.applyDebuff('frailty', {
            duration: 20000,
            healingIncrease: 0.15,
            damageIncrease: 0.06
          });
        }
      }
    });

    // Fel Devastation
    this.abilities.felDevastation = new Action({
      name: 'Fel Devastation',
      channeled: true,
      duration: 2000,
      cooldown: 60000,
      painCost: 50,
      execute: () => {
        this.channelFelDevastation();
      }
    });

    // Fiery Brand
    this.abilities.fieryBrand = new Action({
      name: 'Fiery Brand',
      cooldown: 60000,
      execute: () => {
        this.target.applyDebuff('fieryBrand', {
          duration: DEMON_HUNTER_CONSTANTS.VENGEANCE.FIERY_BRAND_DURATION,
          damageReduction: 0.4,
          fireDamageIncrease: 0.4
        });

        // 초기 데미지
        const damage = this.calculateFieryBrandDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.FIRE, 'fiery_brand');
      }
    });

    // Last Resort
    this.abilities.lastResort = new Action({
      name: 'Last Resort',
      passive: true,
      onDeathPrevented: () => {
        if (this.lastResortUsed) return false;

        this.lastResortUsed = true;

        // 사망 방지
        this.resources.current.health = this.resources.max.health * 0.3;

        // Metamorphosis 발동
        this.enterMetamorphosis();

        // 8분 후 재사용 가능
        this.sim.scheduleEvent({
          time: this.sim.currentTime + 480000,
          actor: this,
          callback: () => { this.lastResortUsed = false; }
        });

        return true;
      }
    });

    // Soul Barrier
    this.abilities.soulBarrier = new Action({
      name: 'Soul Barrier',
      cooldown: 30000,
      usableIf: () => this.soulFragments >= 3,
      execute: () => {
        const fragments = Math.min(this.soulFragments, 5);
        this.consumeSoulFragment(fragments);

        // 흡수 보호막
        const absorb = this.stats.get('attackPower') * fragments * 10;
        this.soulBarrier = absorb;

        this.applyBuff('soulBarrier', {
          duration: 12000,
          absorb: absorb
        });
      }
    });
  }

  calculateShearDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.38;
  }

  calculateSoulCleaveDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.48;
  }

  calculateSigilDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.56;
  }

  calculateInfernalStrikeDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.37;
  }

  calculateSpiritBombDamage(fragments) {
    const ap = this.stats.get('attackPower');
    return ap * 0.6 * fragments;
  }

  calculateFieryBrandDamage() {
    const ap = this.stats.get('attackPower');
    return ap * 0.67;
  }

  channelFelDevastation() {
    const ticks = 5;
    const tickInterval = 400;

    for (let i = 0; i < ticks; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * tickInterval,
        actor: this,
        callback: () => {
          const damage = this.stats.get('attackPower') * 0.25;
          const targets = this.getTargetsInCone(20, 60);

          for (const target of targets) {
            this.dealDamage(target, damage, DAMAGE_TYPE.CHAOS, `fel_devastation_${i+1}`);
          }

          // 치유
          const healAmount = this.resources.max.health * 0.05;
          this.heal(healAmount);
        }
      });
    }
  }

  createSigilArea(options) {
    const tickCount = options.duration / options.tickInterval;

    for (let i = 0; i < tickCount; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * options.tickInterval,
        actor: this,
        callback: () => {
          const targets = this.getTargetsInArea(options.radius);

          for (const target of targets) {
            this.dealDamage(target, options.damage, DAMAGE_TYPE.FIRE, 'sigil_tick');
          }
        }
      });
    }
  }

  getTargetsInCone(range, angle) {
    // 원뿔 범위의 대상들
    return this.sim.targets.filter(t => {
      return t.isAlive() && this.getDistanceTo(t) <= range;
    });
  }

  onDamageTaken(damage, source) {
    super.onDamageTaken(damage, source);

    // Soul Barrier 흡수
    if (this.soulBarrier > 0) {
      const absorbed = Math.min(damage, this.soulBarrier);
      this.soulBarrier -= absorbed;
      damage -= absorbed;

      if (this.soulBarrier <= 0) {
        this.removeBuff('soulBarrier');
      }
    }

    // Soul Fragment 생성 (피해당 확률)
    if (Math.random() < 0.2) {
      this.generateSoulFragment(1);
    }

    return damage;
  }

  generateThreat(amount) {
    // 탱커는 위협 수준 증가
    return amount * 3.5;
  }
}

// ==================== Export ====================
export default DemonHunter;