/**
 * Phase 3.4: Priest Class Implementation
 * 사제 클래스 - Discipline, Holy, Shadow
 * Lines: ~1,200
 */

import { Player } from '../Player.js';
import { Action } from '../Action.js';
import { Buff } from '../Buff.js';
import { RESOURCE_TYPE } from '../Actor.js';
import { DAMAGE_TYPE } from '../core/DamageCalculator.js';

// ==================== 사제 상수 ====================
export const PRIEST_CONSTANTS = {
  // 정신력 & 광기
  INSANITY: {
    MAX: 100,
    DRAIN_RATE: 6, // 초당
    VOIDFORM_DRAIN_INCREASE: 0.68, // 스택당
    VOID_ERUPTION_REQUIREMENT: 50,
    VOID_BOLT_GENERATION: 20
  },

  // 스펙별 특수 메커니즘
  DISCIPLINE: {
    ATONEMENT_DURATION: 15000,
    ATONEMENT_HEALING: 0.5, // 데미지의 50%
    RAPTURE_DURATION: 10000,
    POWER_WORD_RADIANCE_TARGETS: 5
  },

  HOLY: {
    HOLY_WORDS_CDR: 6000, // 치유당 6초
    SERENITY_HEALING_BONUS: 2.0,
    SANCTIFY_RADIUS: 10,
    SPIRIT_OF_REDEMPTION_DURATION: 15000
  },

  SHADOW: {
    SHADOW_WEAVING_MAX: 8,
    VAMPIRIC_TOUCH_DURATION: 21000,
    SHADOW_WORD_PAIN_DURATION: 16000,
    DEVOURING_PLAGUE_DURATION: 6000,
    SHADOWFIEND_DURATION: 15000
  }
};

// ==================== 사제 기본 클래스 ====================
export class Priest extends Player {
  constructor(sim, name) {
    super(sim, name);

    this.class = 'priest';
    this.primaryResource = RESOURCE_TYPE.MANA;

    // 사제 특성
    this.canBlock = false;
    this.canParry = false;
    this.canDodge = false;

    // 사제 버프
    this.buffs.powerWordFortitude = null;

    // 특수 메커니즘
    this.spiritOfRedemption = false;
    this.healingMultiplier = 1.0;
    this.shadowMultiplier = 1.0;

    this.setupCommonAbilities();
  }

  // ==================== 공통 스킬 ====================
  setupCommonAbilities() {
    // Power Word: Fortitude
    this.abilities.powerWordFortitude = new Action({
      name: 'Power Word: Fortitude',
      manaCost: 0.04,
      execute: () => {
        this.applyRaidBuff('powerWordFortitude', {
          duration: 3600000,
          staminaPercent: 0.1
        });
      }
    });

    // Power Word: Shield
    this.abilities.powerWordShield = new Action({
      name: 'Power Word: Shield',
      manaCost: 0.025,
      cooldown: 7500, // Weakened Soul
      execute: (target) => {
        const absorb = this.calculatePowerWordShieldAbsorb();

        target.applyBuff('powerWordShield', {
          duration: 15000,
          absorb: absorb,
          weakenedSoul: true
        });

        // Discipline: Atonement 적용
        if (this.spec === 'discipline') {
          this.applyAtonement(target);
        }
      }
    });

    // Shadow Word: Pain
    this.abilities.shadowWordPain = new Action({
      name: 'Shadow Word: Pain',
      instantCast: true,
      manaCost: 0.008,
      execute: () => {
        this.target.applyDebuff('shadowWordPain', {
          duration: PRIEST_CONSTANTS.SHADOW.SHADOW_WORD_PAIN_DURATION,
          tickInterval: 3000,
          tickDamage: this.stats.get('spellPower') * 0.163,
          pandemic: true,
          school: DAMAGE_TYPE.SHADOW
        });

        // Shadow: 광기 생성
        if (this.spec === 'shadow') {
          this.generateInsanity(4);
        }
      }
    });

    // Dispel Magic
    this.abilities.dispelMagic = new Action({
      name: 'Dispel Magic',
      manaCost: 0.02,
      execute: (target) => {
        if (target.isEnemy) {
          // 적: 버프 제거
          target.dispelBuff('magic', 2);
        } else {
          // 아군: 디버프 제거
          target.dispelDebuff('magic');
        }
      }
    });

    // Fade
    this.abilities.fade = new Action({
      name: 'Fade',
      cooldown: 30000,
      execute: () => {
        this.applyBuff('fade', {
          duration: 10000,
          threatReduction: 0.9,
          damageReduction: 0.1
        });

        this.reduceThreat(0.9);
      }
    });

    // Psychic Scream
    this.abilities.psychicScream = new Action({
      name: 'Psychic Scream',
      cooldown: 30000,
      execute: () => {
        const nearbyTargets = this.getNearbyTargets(8);

        for (const target of nearbyTargets.slice(0, 5)) {
          target.applyDebuff('psychicScream', {
            duration: 8000,
            feared: true
          });
        }
      }
    });

    // Mind Control
    this.abilities.mindControl = new Action({
      name: 'Mind Control',
      castTime: 3000,
      manaCost: 0.02,
      execute: () => {
        this.target.applyDebuff('mindControl', {
          duration: 30000,
          controlled: true,
          controller: this
        });
      }
    });

    // Leap of Faith
    this.abilities.leapOfFaith = new Action({
      name: 'Leap of Faith',
      cooldown: 90000,
      range: 40,
      execute: (target) => {
        // 대상을 내 위치로 당김
        target.position = { ...this.position };
        target.removeBuff('root');
        target.removeBuff('snare');
      }
    });
  }

  calculatePowerWordShieldAbsorb() {
    const sp = this.stats.get('spellPower');
    let absorb = sp * 2.5;

    // Discipline 보너스
    if (this.spec === 'discipline') {
      absorb *= 1.3;
    }

    return absorb;
  }

  onDeath() {
    // Holy: Spirit of Redemption
    if (this.spec === 'holy' && !this.spiritOfRedemption) {
      this.activateSpiritOfRedemption();
      return false; // 죽음 방지
    }

    return super.onDeath();
  }
}

// ==================== Discipline 사제 ====================
export class DisciplinePriest extends Priest {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'discipline';
    this.role = 'healer';

    // Discipline 특수 메커니즘
    this.atonements = new Map(); // target -> expireTime
    this.raptureActive = false;
    this.evangelismStacks = 0;

    this.setupDisciplineAbilities();
  }

  setupDisciplineAbilities() {
    // Penance
    this.abilities.penance = new Action({
      name: 'Penance',
      channeled: true,
      duration: 2000,
      manaCost: 0.016,
      execute: () => {
        const bolts = 3;

        for (let i = 0; i < bolts; i++) {
          this.sim.scheduleEvent({
            time: this.sim.currentTime + i * 666,
            actor: this,
            callback: () => {
              if (this.target.isEnemy) {
                // 데미지
                const damage = this.calculatePenanceDamage();
                this.dealDamage(this.target, damage, DAMAGE_TYPE.HOLY, `penance_${i+1}`);
                this.triggerAtonement(damage);
              } else {
                // 치유
                const healing = this.calculatePenanceHealing();
                this.heal(this.target, healing);
                this.applyAtonement(this.target);
              }
            }
          });
        }
      }
    });

    // Smite
    this.abilities.smite = new Action({
      name: 'Smite',
      castTime: 1500,
      manaCost: 0.005,
      execute: () => {
        const damage = this.calculateSmiteDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.HOLY, 'smite');

        // Atonement 치유
        this.triggerAtonement(damage);
      }
    });

    // Power Word: Radiance
    this.abilities.powerWordRadiance = new Action({
      name: 'Power Word: Radiance',
      castTime: 2250,
      manaCost: 0.065,
      charges: 2,
      execute: () => {
        const targets = this.getAllyTargets(PRIEST_CONSTANTS.DISCIPLINE.POWER_WORD_RADIANCE_TARGETS);

        for (const target of targets) {
          const healing = this.calculateRadianceHealing();
          this.heal(target, healing);
          this.applyAtonement(target, 9000); // 짧은 Atonement
        }
      }
    });

    // Shadow Covenant
    this.abilities.shadowCovenant = new Action({
      name: 'Shadow Covenant',
      instantCast: true,
      manaCost: 0.025,
      execute: () => {
        const targets = this.getAllyTargets(5);
        const healing = this.calculateShadowCovenantHealing();

        for (const target of targets) {
          this.heal(target, healing);
          this.applyAtonement(target);

          // 치유 흡수 디버프
          target.applyDebuff('shadowCovenant', {
            duration: 7000,
            healingReduction: 0.5
          });
        }
      }
    });

    // Schism
    this.abilities.schism = new Action({
      name: 'Schism',
      castTime: 1500,
      manaCost: 0.005,
      cooldown: 24000,
      execute: () => {
        const damage = this.calculateSchismDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.SHADOW, 'schism');

        this.target.applyDebuff('schism', {
          duration: 9000,
          damageIncrease: 0.25
        });

        this.triggerAtonement(damage);
      }
    });

    // Evangelism
    this.abilities.evangelism = new Action({
      name: 'Evangelism',
      cooldown: 90000,
      execute: () => {
        // 모든 Atonement 6초 연장
        for (const [target, expireTime] of this.atonements) {
          this.atonements.set(target, expireTime + 6000);
        }

        this.applyBuff('evangelism', {
          duration: 15000,
          atonementHealing: 0.15
        });
      }
    });

    // Rapture
    this.abilities.rapture = new Action({
      name: 'Rapture',
      cooldown: 90000,
      execute: () => {
        this.raptureActive = true;

        this.applyBuff('rapture', {
          duration: PRIEST_CONSTANTS.DISCIPLINE.RAPTURE_DURATION,
          shieldBonus: 2.0,
          noCost: true
        });

        this.sim.scheduleEvent({
          time: this.sim.currentTime + PRIEST_CONSTANTS.DISCIPLINE.RAPTURE_DURATION,
          actor: this,
          callback: () => { this.raptureActive = false; }
        });
      }
    });

    // Power Word: Barrier
    this.abilities.powerWordBarrier = new Action({
      name: 'Power Word: Barrier',
      cooldown: 180000,
      execute: () => {
        // 10야드 반경 방벽
        this.createBarrier({
          duration: 10000,
          radius: 10,
          damageReduction: 0.25
        });
      }
    });

    // Shadowfiend
    this.abilities.shadowfiend = new Action({
      name: 'Shadowfiend',
      cooldown: 180000,
      execute: () => {
        this.summonShadowfiend();
      }
    });

    // Mind Blast
    this.abilities.mindBlast = new Action({
      name: 'Mind Blast',
      castTime: 1500,
      manaCost: 0.01,
      charges: 2,
      execute: () => {
        const damage = this.calculateMindBlastDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.SHADOW, 'mind_blast');

        this.triggerAtonement(damage);

        // Shadow Weaving
        this.target.applyDebuff('shadowWeaving', {
          duration: 15000,
          shadowDamageIncrease: 0.025,
          maxStacks: PRIEST_CONSTANTS.SHADOW.SHADOW_WEAVING_MAX
        });
      }
    });
  }

  calculatePenanceDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 0.4;
  }

  calculatePenanceHealing() {
    const sp = this.stats.get('spellPower');
    return sp * 1.25;
  }

  calculateSmiteDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 0.47;
  }

  calculateRadianceHealing() {
    const sp = this.stats.get('spellPower');
    return sp * 0.625;
  }

  calculateShadowCovenantHealing() {
    const sp = this.stats.get('spellPower');
    return sp * 1.1;
  }

  calculateSchismDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 1.5;
  }

  calculateMindBlastDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 0.72;
  }

  applyAtonement(target, duration = PRIEST_CONSTANTS.DISCIPLINE.ATONEMENT_DURATION) {
    const expireTime = this.sim.currentTime + duration;
    this.atonements.set(target, expireTime);

    target.applyBuff('atonement', {
      duration: duration,
      source: this
    });

    // 만료 스케줄
    this.sim.scheduleEvent({
      time: expireTime,
      actor: this,
      callback: () => {
        if (this.atonements.get(target) === expireTime) {
          this.atonements.delete(target);
          target.removeBuff('atonement');
        }
      }
    });
  }

  triggerAtonement(damage) {
    const healingPercent = PRIEST_CONSTANTS.DISCIPLINE.ATONEMENT_HEALING;
    const healing = damage * healingPercent;

    for (const [target, expireTime] of this.atonements) {
      if (expireTime > this.sim.currentTime) {
        this.heal(target, healing, 'atonement');
      }
    }
  }

  summonShadowfiend() {
    const duration = PRIEST_CONSTANTS.SHADOW.SHADOWFIEND_DURATION;
    const attackInterval = 1500;

    const shadowfiendAttack = () => {
      const damage = this.stats.get('spellPower') * 0.3;
      this.dealDamage(this.target, damage, DAMAGE_TYPE.SHADOW, 'shadowfiend');

      // 마나 회복
      this.grantResource(RESOURCE_TYPE.MANA, this.resources.max[RESOURCE_TYPE.MANA] * 0.015, 'shadowfiend');

      // Atonement 트리거
      this.triggerAtonement(damage);
    };

    let attacks = Math.floor(duration / attackInterval);
    for (let i = 0; i < attacks; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * attackInterval,
        actor: this,
        callback: shadowfiendAttack
      });
    }
  }

  createBarrier(options) {
    const affectedTargets = this.getAllyTargetsInArea(options.radius);

    for (const target of affectedTargets) {
      target.applyBuff('powerWordBarrier', {
        duration: options.duration,
        damageReduction: options.damageReduction
      });
    }
  }
}

// ==================== Holy 사제 ====================
export class HolyPriest extends Priest {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'holy';
    this.role = 'healer';

    // Holy 특수 메커니즘
    this.holyWordSerenity = false;
    this.holyWordSanctify = false;
    this.holyWordChastise = false;
    this.spiritOfRedemptionActive = false;
    this.prayerOfMendingCharges = 5;

    this.setupHolyAbilities();
  }

  setupHolyAbilities() {
    // Flash Heal
    this.abilities.flashHeal = new Action({
      name: 'Flash Heal',
      castTime: 1500,
      manaCost: 0.018,
      execute: (target) => {
        const healing = this.calculateFlashHealHealing();
        this.heal(target, healing);

        // Serendipity
        this.applyBuff('serendipity', {
          duration: 20000,
          castTimeReduction: 0.25,
          maxStacks: 2
        });

        // Holy Word CDR
        this.reduceHolyWordCooldown('serenity', PRIEST_CONSTANTS.HOLY.HOLY_WORDS_CDR);
      }
    });

    // Heal
    this.abilities.heal = new Action({
      name: 'Heal',
      castTime: 2500,
      manaCost: 0.02,
      execute: (target) => {
        const healing = this.calculateHealHealing();
        this.heal(target, healing);

        this.reduceHolyWordCooldown('serenity', PRIEST_CONSTANTS.HOLY.HOLY_WORDS_CDR);
      }
    });

    // Prayer of Healing
    this.abilities.prayerOfHealing = new Action({
      name: 'Prayer of Healing',
      castTime: 2250,
      manaCost: 0.04,
      execute: () => {
        const targets = this.getGroupMembers();
        const healing = this.calculatePrayerOfHealingHealing();

        for (const target of targets) {
          this.heal(target, healing);
        }

        this.reduceHolyWordCooldown('sanctify', PRIEST_CONSTANTS.HOLY.HOLY_WORDS_CDR * 5);
      }
    });

    // Holy Word: Serenity
    this.abilities.holyWordSerenity = new Action({
      name: 'Holy Word: Serenity',
      cooldown: 60000,
      instantCast: true,
      execute: (target) => {
        const healing = this.calculateSerenityHealing();
        this.heal(target, healing);

        // 6초간 치명타 확률 25% 증가
        target.applyBuff('holyWordSerenity', {
          duration: 6000,
          critBonus: 0.25
        });
      }
    });

    // Holy Word: Sanctify
    this.abilities.holyWordSanctify = new Action({
      name: 'Holy Word: Sanctify',
      cooldown: 60000,
      instantCast: true,
      execute: () => {
        const targets = this.getTargetsInArea(PRIEST_CONSTANTS.HOLY.SANCTIFY_RADIUS);
        const healing = this.calculateSanctifyHealing();

        for (const target of targets) {
          this.heal(target, healing);
        }

        // Renew 적용
        for (const target of targets) {
          this.applyRenew(target);
        }
      }
    });

    // Holy Word: Chastise
    this.abilities.holyWordChastise = new Action({
      name: 'Holy Word: Chastise',
      cooldown: 60000,
      instantCast: true,
      execute: () => {
        const damage = this.calculateChastiseDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.HOLY, 'holy_word_chastise');

        // 4초 스턴
        this.target.applyDebuff('chastise', {
          duration: 4000,
          stunned: true
        });
      }
    });

    // Renew
    this.abilities.renew = new Action({
      name: 'Renew',
      instantCast: true,
      manaCost: 0.01,
      execute: (target) => {
        this.applyRenew(target);
      }
    });

    // Prayer of Mending
    this.abilities.prayerOfMending = new Action({
      name: 'Prayer of Mending',
      cooldown: 10000,
      instantCast: true,
      manaCost: 0.02,
      execute: (target) => {
        target.applyBuff('prayerOfMending', {
          duration: 30000,
          charges: this.prayerOfMendingCharges,
          onDamage: (damage) => {
            const healing = this.calculatePrayerOfMendingHealing();
            this.heal(target, healing);

            // 다음 대상으로 이동
            const nextTarget = this.getLowestHealthAlly();
            if (nextTarget && target.buffs.get('prayerOfMending').charges > 1) {
              target.removeBuff('prayerOfMending');
              nextTarget.applyBuff('prayerOfMending', {
                duration: 30000,
                charges: target.buffs.get('prayerOfMending').charges - 1,
                onDamage: target.buffs.get('prayerOfMending').onDamage
              });
            }
          }
        });
      }
    });

    // Divine Hymn
    this.abilities.divineHymn = new Action({
      name: 'Divine Hymn',
      cooldown: 180000,
      channeled: true,
      duration: 8000,
      execute: () => {
        this.channelDivineHymn();
      }
    });

    // Guardian Spirit
    this.abilities.guardianSpirit = new Action({
      name: 'Guardian Spirit',
      cooldown: 180000,
      execute: (target) => {
        target.applyBuff('guardianSpirit', {
          duration: 10000,
          healingIncrease: 0.6,
          deathPrevention: true,
          onDeathPrevented: () => {
            const healing = target.resources.max.health * 0.5;
            this.heal(target, healing);
          }
        });
      }
    });

    // Holy Fire
    this.abilities.holyFire = new Action({
      name: 'Holy Fire',
      castTime: 2250,
      manaCost: 0.01,
      cooldown: 10000,
      execute: () => {
        const damage = this.calculateHolyFireDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.HOLY, 'holy_fire');

        // DoT
        this.target.applyDebuff('holyFire', {
          duration: 7000,
          tickInterval: 1000,
          tickDamage: damage * 0.05
        });

        this.reduceHolyWordCooldown('chastise', 4000);
      }
    });
  }

  calculateFlashHealHealing() {
    const sp = this.stats.get('spellPower');
    return sp * 1.35;
  }

  calculateHealHealing() {
    const sp = this.stats.get('spellPower');
    return sp * 2.5;
  }

  calculatePrayerOfHealingHealing() {
    const sp = this.stats.get('spellPower');
    return sp * 0.52;
  }

  calculateSerenityHealing() {
    const sp = this.stats.get('spellPower');
    return sp * PRIEST_CONSTANTS.HOLY.SERENITY_HEALING_BONUS * 6.0;
  }

  calculateSanctifyHealing() {
    const sp = this.stats.get('spellPower');
    return sp * 2.0;
  }

  calculateChastiseDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 1.55;
  }

  calculatePrayerOfMendingHealing() {
    const sp = this.stats.get('spellPower');
    return sp * 0.55;
  }

  calculateHolyFireDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 0.58;
  }

  applyRenew(target) {
    target.applyDebuff('renew', {
      duration: 15000,
      tickInterval: 3000,
      tickHealing: this.stats.get('spellPower') * 0.175,
      pandemic: true
    });
  }

  channelDivineHymn() {
    const waves = 4;
    const waveInterval = 2000;

    for (let i = 0; i < waves; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * waveInterval,
        actor: this,
        callback: () => {
          const allies = this.getAllAllies();
          const healing = this.stats.get('spellPower') * 3.0;

          for (const ally of allies) {
            this.heal(ally, healing);
          }
        }
      });
    }
  }

  reduceHolyWordCooldown(holyWord, amount) {
    const ability = this.abilities[`holyWord${holyWord.charAt(0).toUpperCase() + holyWord.slice(1)}`];
    if (ability && ability.cooldown) {
      ability.cooldown.reduce(amount);
    }
  }

  activateSpiritOfRedemption() {
    this.spiritOfRedemptionActive = true;
    this.resources.current.health = 1;

    this.applyBuff('spiritOfRedemption', {
      duration: PRIEST_CONSTANTS.HOLY.SPIRIT_OF_REDEMPTION_DURATION,
      healingBonus: 1.0,
      immuneToAll: true
    });

    // 15초 후 진짜 죽음
    this.sim.scheduleEvent({
      time: this.sim.currentTime + PRIEST_CONSTANTS.HOLY.SPIRIT_OF_REDEMPTION_DURATION,
      actor: this,
      callback: () => {
        this.spiritOfRedemptionActive = false;
        super.onDeath();
      }
    });
  }
}

// ==================== Shadow 사제 ====================
export class ShadowPriest extends Priest {
  constructor(sim, name) {
    super(sim, name);
    this.spec = 'shadow';

    // Shadow 특수 메커니즘
    this.resources.base[RESOURCE_TYPE.INSANITY] = 0;
    this.resources.max[RESOURCE_TYPE.INSANITY] = PRIEST_CONSTANTS.INSANITY.MAX;
    this.resources.current[RESOURCE_TYPE.INSANITY] = 0;

    this.voidform = false;
    this.voidformStacks = 0;
    this.shadowWeavingStacks = 0;
    this.twistOfFateActive = false;

    this.setupShadowAbilities();
  }

  setupShadowAbilities() {
    // Mind Blast
    this.abilities.mindBlast = new Action({
      name: 'Mind Blast',
      castTime: 1500,
      charges: 2,
      execute: () => {
        const damage = this.calculateMindBlastDamage();
        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.SHADOW, 'mind_blast');

        this.generateInsanity(result.crit ? 12 : 8);

        // Shadow Weaving
        this.applyShadowWeaving();
      }
    });

    // Vampiric Touch
    this.abilities.vampiricTouch = new Action({
      name: 'Vampiric Touch',
      castTime: 1500,
      execute: () => {
        this.target.applyDebuff('vampiricTouch', {
          duration: PRIEST_CONSTANTS.SHADOW.VAMPIRIC_TOUCH_DURATION,
          tickInterval: 3000,
          tickDamage: this.stats.get('spellPower') * 0.25,
          pandemic: true,
          onTick: () => {
            this.generateInsanity(1);
            // Vampiric Embrace 치유
            if (this.buffs.has('vampiricEmbrace')) {
              const healing = this.stats.get('spellPower') * 0.025;
              this.heal(this, healing);
            }
          }
        });

        this.generateInsanity(5);
      }
    });

    // Devouring Plague
    this.abilities.devouringPlague = new Action({
      name: 'Devouring Plague',
      insanityCost: 50,
      instantCast: true,
      execute: () => {
        const damage = this.calculateDevouringPlagueDamage();

        // 즉시 데미지
        this.dealDamage(this.target, damage * 0.3, DAMAGE_TYPE.SHADOW, 'devouring_plague_initial');

        // DoT
        this.target.applyDebuff('devouringPlague', {
          duration: PRIEST_CONSTANTS.SHADOW.DEVOURING_PLAGUE_DURATION,
          tickInterval: 3000,
          tickDamage: damage * 0.14,
          pandemic: false // 중복 불가
        });
      }
    });

    // Void Eruption / Void Bolt
    this.abilities.voidEruption = new Action({
      name: 'Void Eruption',
      instantCast: true,
      usableIf: () => this.resources.current[RESOURCE_TYPE.INSANITY] >= PRIEST_CONSTANTS.INSANITY.VOID_ERUPTION_REQUIREMENT,
      execute: () => {
        // Voidform 진입
        this.enterVoidform();

        // 모든 DoT 갱신
        this.refreshDoTs();

        // 광역 데미지
        const damage = this.calculateVoidEruptionDamage();
        const targets = this.getNearbyTargets(10);

        for (const target of targets) {
          this.dealDamage(target, damage, DAMAGE_TYPE.SHADOW, 'void_eruption');
        }
      }
    });

    this.abilities.voidBolt = new Action({
      name: 'Void Bolt',
      instantCast: true,
      cooldown: 4500,
      usableIf: () => this.voidform,
      execute: () => {
        const damage = this.calculateVoidBoltDamage();
        this.dealDamage(this.target, damage, DAMAGE_TYPE.SHADOW, 'void_bolt');

        this.generateInsanity(PRIEST_CONSTANTS.INSANITY.VOID_BOLT_GENERATION);

        // DoT 연장
        this.extendDoTs(3000);
      }
    });

    // Mind Flay
    this.abilities.mindFlay = new Action({
      name: 'Mind Flay',
      channeled: true,
      duration: 4500,
      execute: () => {
        this.channelMindFlay();
      }
    });

    // Mind Sear
    this.abilities.mindSear = new Action({
      name: 'Mind Sear',
      channeled: true,
      duration: 4500,
      execute: () => {
        this.channelMindSear();
      }
    });

    // Shadow Word: Death
    this.abilities.shadowWordDeath = new Action({
      name: 'Shadow Word: Death',
      instantCast: true,
      cooldown: 9000,
      execute: () => {
        const damage = this.calculateShadowWordDeathDamage();
        const result = this.dealDamage(this.target, damage, DAMAGE_TYPE.SHADOW, 'shadow_word_death');

        // 처형
        if (this.target.getHealthPercent() < 0.2) {
          this.generateInsanity(15);
        } else {
          // 반동 피해
          this.takeDamage(damage * 0.5, DAMAGE_TYPE.SHADOW, this);
        }
      }
    });

    // Shadowfiend / Mindbender
    this.abilities.shadowfiend = new Action({
      name: 'Shadowfiend',
      cooldown: 180000,
      execute: () => {
        this.summonShadowfiend();
      }
    });

    // Void Torrent
    this.abilities.voidTorrent = new Action({
      name: 'Void Torrent',
      channeled: true,
      duration: 3000,
      cooldown: 30000,
      usableIf: () => this.voidform,
      execute: () => {
        this.channelVoidTorrent();
      }
    });

    // Dispersion
    this.abilities.dispersion = new Action({
      name: 'Dispersion',
      cooldown: 120000,
      execute: () => {
        this.applyBuff('dispersion', {
          duration: 6000,
          damageReduction: 0.75,
          immuneToSilence: true,
          immuneToInterrupt: true,
          movementSpeed: 0.5
        });

        // 6초간 광기 소모 중지
        this.pauseInsanityDrain = true;
        this.sim.scheduleEvent({
          time: this.sim.currentTime + 6000,
          actor: this,
          callback: () => { this.pauseInsanityDrain = false; }
        });
      }
    });
  }

  calculateMindBlastDamage() {
    const sp = this.stats.get('spellPower');
    let damage = sp * 0.72;

    if (this.voidform) {
      damage *= 1 + (this.voidformStacks * 0.02);
    }

    return damage;
  }

  calculateDevouringPlagueDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 1.8;
  }

  calculateVoidEruptionDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 2.28;
  }

  calculateVoidBoltDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 1.5 * (1 + this.voidformStacks * 0.02);
  }

  calculateShadowWordDeathDamage() {
    const sp = this.stats.get('spellPower');
    return sp * 1.5;
  }

  generateInsanity(amount) {
    this.resources.current[RESOURCE_TYPE.INSANITY] = Math.min(
      this.resources.current[RESOURCE_TYPE.INSANITY] + amount,
      PRIEST_CONSTANTS.INSANITY.MAX
    );
  }

  drainInsanity() {
    if (this.voidform && !this.pauseInsanityDrain) {
      const drainRate = PRIEST_CONSTANTS.INSANITY.DRAIN_RATE +
                       (this.voidformStacks * PRIEST_CONSTANTS.INSANITY.VOID_DRAIN_INCREASE);

      this.resources.current[RESOURCE_TYPE.INSANITY] -= drainRate / 10; // 0.1초당

      if (this.resources.current[RESOURCE_TYPE.INSANITY] <= 0) {
        this.exitVoidform();
      }
    }
  }

  enterVoidform() {
    this.voidform = true;
    this.voidformStacks = 1;

    this.applyBuff('voidform', {
      duration: 999999,
      hastePercent: 0.01, // 스택당 1%
      damageMultiplier: 1.1,
      critBonus: 0.1
    });

    // 광기 소모 시작
    this.startInsanityDrain();
  }

  exitVoidform() {
    this.voidform = false;
    this.voidformStacks = 0;
    this.resources.current[RESOURCE_TYPE.INSANITY] = 0;

    this.removeBuff('voidform');

    // Lingering Insanity
    this.applyBuff('lingeringInsanity', {
      duration: 60000,
      hastePercent: this.voidformStacks * 0.5,
      decayRate: 0.5 // 초당 0.5% 감소
    });
  }

  startInsanityDrain() {
    const drainTick = () => {
      if (!this.voidform) return;

      this.drainInsanity();

      // Voidform 스택 증가
      if (this.sim.currentTime % 1000 === 0) {
        this.voidformStacks++;
        this.updateVoidformBuff();
      }

      this.sim.scheduleEvent({
        time: this.sim.currentTime + 100,
        actor: this,
        callback: drainTick
      });
    };

    drainTick();
  }

  updateVoidformBuff() {
    if (this.buffs.has('voidform')) {
      const buff = this.buffs.get('voidform');
      buff.hastePercent = this.voidformStacks * 0.01;
      buff.damageMultiplier = 1.1 + (this.voidformStacks * 0.02);
    }
  }

  applyShadowWeaving() {
    this.target.applyDebuff('shadowWeaving', {
      duration: 15000,
      shadowDamageIncrease: 0.025,
      maxStacks: PRIEST_CONSTANTS.SHADOW.SHADOW_WEAVING_MAX
    });
  }

  refreshDoTs() {
    const dots = ['vampiricTouch', 'shadowWordPain', 'devouringPlague'];
    for (const dot of dots) {
      if (this.target.debuffs.has(dot)) {
        const debuff = this.target.debuffs.get(dot);
        debuff.duration = debuff.baseDuration;
      }
    }
  }

  extendDoTs(amount) {
    const dots = ['vampiricTouch', 'shadowWordPain'];
    for (const dot of dots) {
      if (this.target.debuffs.has(dot)) {
        const debuff = this.target.debuffs.get(dot);
        debuff.duration += amount;
      }
    }
  }

  channelMindFlay() {
    const ticks = 3;
    const tickInterval = 1500;

    for (let i = 0; i < ticks; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * tickInterval,
        actor: this,
        callback: () => {
          const damage = this.stats.get('spellPower') * 0.2;
          this.dealDamage(this.target, damage, DAMAGE_TYPE.SHADOW, `mind_flay_${i+1}`);
          this.generateInsanity(2);

          // 감속
          this.target.applyDebuff('mindFlay', {
            duration: 1500,
            movementSpeedReduction: 0.5
          });
        }
      });
    }
  }

  channelMindSear() {
    const ticks = 3;
    const tickInterval = 1500;

    for (let i = 0; i < ticks; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * tickInterval,
        actor: this,
        callback: () => {
          const targets = this.getNearbyTargets(10);
          const damage = this.stats.get('spellPower') * 0.125;

          for (const target of targets) {
            this.dealDamage(target, damage, DAMAGE_TYPE.SHADOW, `mind_sear_${i+1}`);
          }
          this.generateInsanity(1 * targets.length);
        }
      });
    }
  }

  channelVoidTorrent() {
    const ticks = 6;
    const tickInterval = 500;

    for (let i = 0; i < ticks; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * tickInterval,
        actor: this,
        callback: () => {
          const damage = this.stats.get('spellPower') * 0.52;
          this.dealDamage(this.target, damage, DAMAGE_TYPE.SHADOW, `void_torrent_${i+1}`);
          this.generateInsanity(3);

          // DoT 연장
          if (i % 2 === 0) {
            this.extendDoTs(1000);
          }
        }
      });
    }

    // 채널링 중 광기 소모 중지
    this.pauseInsanityDrain = true;
    this.sim.scheduleEvent({
      time: this.sim.currentTime + 3000,
      actor: this,
      callback: () => { this.pauseInsanityDrain = false; }
    });
  }

  summonShadowfiend() {
    const duration = PRIEST_CONSTANTS.SHADOW.SHADOWFIEND_DURATION;
    const attackInterval = 1500;

    const shadowfiendAttack = () => {
      const damage = this.stats.get('spellPower') * 0.3;
      this.dealDamage(this.target, damage, DAMAGE_TYPE.SHADOW, 'shadowfiend');

      // 광기 생성
      this.generateInsanity(3);
    };

    let attacks = Math.floor(duration / attackInterval);
    for (let i = 0; i < attacks; i++) {
      this.sim.scheduleEvent({
        time: this.sim.currentTime + i * attackInterval,
        actor: this,
        callback: shadowfiendAttack
      });
    }
  }
}

// ==================== Export ====================
export default Priest;