/**
 * Paladin Specializations
 * 11.2 The War Within
 *
 * 성기사 전문화 상세 구현
 * - Holy (신성)
 * - Protection (보호)
 * - Retribution (징벌)
 */

import { Specialization } from '../core/Specialization.js';
import { Talent, TalentTree } from '../core/TalentTree.js';
import { Buff } from '../core/Buff.js';
import { Debuff } from '../core/Debuff.js';
import {
  RESOURCE_TYPE,
  DAMAGE_TYPE,
  BUFF_TYPE,
  DEBUFF_TYPE,
  STAT_TYPE,
  TARGET_TYPE,
  ABILITY_CATEGORY,
  HEAL_TYPE
} from '../core/Constants.js';

/**
 * Holy Paladin Specialization
 * 신성 성기사 - 근접 치유 전문
 */
class HolyPaladin extends Specialization {
  constructor(paladin) {
    super(paladin, 'holy');

    this.role = 'healer';
    this.masteryName = '빛의 봉화';
    this.masteryEffect = 0.35; // 거리가 가까울수록 치유량 35% 증가

    // Holy 고유 메커니즘
    this.beacon = {
      targets: new Map(), // 빛의 봉화 대상들
      transferRate: 0.5 // 치유 전달률
    };

    this.infusion = {
      active: false,
      nextSpellBonus: 0
    };

    this.glimmer = {
      targets: new Set(),
      maxTargets: 8
    };

    this.holyShock = {
      critBonus: 30 // 신성 충격 추가 치명타율
    };

    // 신성한 힘 스택
    this.holyPower = {
      current: 0,
      max: 5
    };

    // 치유 범위에 따른 효율 계산
    this.maxHealRange = 40;
    this.optimalRange = 10; // 최적 거리

    this.initializeAbilities();
    this.initializeTalents();
    this.initializeRotation();
  }

  initializeAbilities() {
    // 신성 충격
    this.abilities.set('holy_shock', {
      name: '신성 충격',
      cost: { type: RESOURCE_TYPE.MANA, amount: 1600 },
      cooldown: 7.5,
      castTime: 0,
      gcd: 1.5,
      range: 40,
      school: DAMAGE_TYPE.HOLY,
      execute: (target) => {
        if (target.faction === this.faction) {
          // 아군 치유
          const healing = this.calculateHealing({
            base: 20000,
            spellPower: 1.8,
            target: target
          });

          const isCrit = this.rollCritical(this.holyShock.critBonus);
          const finalHealing = isCrit ? healing * 2 : healing;

          target.heal(finalHealing, HEAL_TYPE.DIRECT, this);

          // 빛나는 빛 버프
          if (isCrit) {
            this.applyBuff(new Buff({
              name: '빛나는 빛',
              duration: 12,
              type: BUFF_TYPE.HOLY,
              effect: () => {
                // 다음 성스러운 빛 즉시 시전
                this.nextInstantCast = true;
              }
            }));
          }
        } else {
          // 적 공격
          const damage = this.calculateDamage({
            base: 15000,
            coefficients: { spellPower: 1.5 },
            type: DAMAGE_TYPE.HOLY
          });

          this.dealDamage(target, damage, 'holy_shock');
        }

        // 신성한 힘 생성
        this.generateHolyPower(1);

        // 신성한 목적 특성
        if (this.talents.has('holy_purpose') && Math.random() < 0.15) {
          this.generateHolyPower(1);
        }

        // 빛의 섬광 적용
        if (this.talents.has('glimmer_of_light')) {
          this.applyGlimmer(target);
        }

        return true;
      }
    });

    // 빛의 봉화
    this.abilities.set('beacon_of_light', {
      name: '빛의 봉화',
      cost: { type: RESOURCE_TYPE.MANA, amount: 500 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      execute: (target) => {
        if (target.faction !== this.faction) return false;

        // 기존 봉화 제거 (신념의 봉화가 아닌 경우)
        if (!this.talents.has('beacon_of_faith')) {
          this.beacon.targets.clear();
        }

        // 봉화 적용
        const beaconBuff = new Buff({
          name: '빛의 봉화',
          duration: Infinity,
          type: BUFF_TYPE.HOLY,
          onHeal: (healing, healer) => {
            if (healer === this && !healing.fromBeacon) {
              // 봉화 대상에게 치유 전달
              const transferAmount = healing.amount * this.beacon.transferRate;
              target.heal(transferAmount, HEAL_TYPE.BEACON, this);
            }
          }
        });

        this.applyBuff(beaconBuff, target);
        this.beacon.targets.set(target.id, target);

        return true;
      }
    });

    // 성스러운 빛
    this.abilities.set('holy_light', {
      name: '성스러운 빛',
      cost: { type: RESOURCE_TYPE.MANA, amount: 2800 },
      cooldown: 0,
      castTime: 2.5,
      gcd: 1.5,
      school: DAMAGE_TYPE.HOLY,
      execute: (target) => {
        let castTime = 2.5;

        // 빛나는 빛으로 즉시 시전
        if (this.nextInstantCast) {
          castTime = 0;
          this.nextInstantCast = false;
          this.consumeBuff('빛나는 빛');
        }

        // 빛 주입 확인
        let healing = this.calculateHealing({
          base: 35000,
          spellPower: 2.5,
          target: target
        });

        if (this.infusion.active) {
          healing *= (1 + this.infusion.nextSpellBonus);
          this.infusion.active = false;
          this.infusion.nextSpellBonus = 0;
        }

        target.heal(healing, HEAL_TYPE.DIRECT, this);

        // 봉화 대상에게 전달
        this.transferToBeacons(healing, target);

        // 신성한 빛 특성
        if (this.talents.has('holy_light_talent')) {
          // 주변 아군 치유
          const allies = this.getAlliesInRadius(10, target);
          allies.forEach(ally => {
            if (ally !== target) {
              ally.heal(healing * 0.3, HEAL_TYPE.SPLASH, this);
            }
          });
        }

        return true;
      }
    });

    // 섬광
    this.abilities.set('flash_of_light', {
      name: '빛의 섬광',
      cost: { type: RESOURCE_TYPE.MANA, amount: 2200 },
      cooldown: 0,
      castTime: 1.5,
      gcd: 1.5,
      school: DAMAGE_TYPE.HOLY,
      execute: (target) => {
        const healing = this.calculateHealing({
          base: 20000,
          spellPower: 1.5,
          target: target
        });

        target.heal(healing, HEAL_TYPE.DIRECT, this);

        // 봉화 대상에게 전달
        this.transferToBeacons(healing, target);

        // 신성한 은총 특성
        if (this.talents.has('divine_favor')) {
          this.applyBuff(new Buff({
            name: '신성한 은총',
            duration: 10,
            stacks: 1,
            maxStacks: 2,
            type: BUFF_TYPE.HOLY,
            effect: () => {
              this.stats[STAT_TYPE.HASTE] += 3;
            },
            onExpire: () => {
              this.stats[STAT_TYPE.HASTE] -= 3 * this.getBuffStacks('신성한 은총');
            }
          }), target);
        }

        return true;
      }
    });

    // 여명의 빛
    this.abilities.set('light_of_dawn', {
      name: '여명의 빛',
      cost: { type: RESOURCE_TYPE.HOLY_POWER, amount: 3 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      cone: 15, // 15미터 원뿔
      angle: 90,
      maxTargets: 5,
      school: DAMAGE_TYPE.HOLY,
      execute: () => {
        if (!this.spendHolyPower(3)) return false;

        const allies = this.getAlliesInCone(15, 90);
        const targets = allies.slice(0, 5);

        const baseHealing = this.calculateHealing({
          base: 18000,
          spellPower: 1.2
        });

        targets.forEach((ally, index) => {
          // 첫 번째 대상 100%, 이후 감소
          const healing = baseHealing * (1 - index * 0.15);
          ally.heal(healing, HEAL_TYPE.AOE, this);

          // 여명의 빛 HoT
          this.applyBuff(new Buff({
            name: '여명의 빛',
            duration: 6,
            type: BUFF_TYPE.HOT,
            tickRate: 2,
            onTick: () => {
              ally.heal(healing * 0.15, HEAL_TYPE.HOT, this);
            }
          }), ally);
        });

        // 각성 특성
        if (this.talents.has('awakening')) {
          if (Math.random() < 0.15) {
            this.abilities.get('avenging_wrath').cooldown.reduce(60);
          }
        }

        return true;
      }
    });

    // 신의 권능
    this.abilities.set('word_of_glory', {
      name: '영광의 서약',
      cost: { type: RESOURCE_TYPE.HOLY_POWER, amount: 3 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      school: DAMAGE_TYPE.HOLY,
      execute: (target) => {
        const holyPower = Math.min(this.holyPower.current, 5);
        if (!this.spendHolyPower(holyPower)) return false;

        const healing = this.calculateHealing({
          base: 25000 * holyPower,
          spellPower: 2.0 * holyPower,
          target: target
        });

        target.heal(healing, HEAL_TYPE.DIRECT, this);

        // 봉화 대상에게 전달
        this.transferToBeacons(healing, target);

        // 비이기적인 치유사 특성
        if (this.talents.has('unbreakable_spirit')) {
          // 자신이 아닌 대상 치유시 재사용 대기시간 감소
          if (target !== this) {
            this.reduceCooldowns(1);
          }
        }

        return true;
      }
    });

    // 신성한 복수자
    this.abilities.set('avenging_wrath', {
      name: '응징의 격노',
      cooldown: 120,
      castTime: 0,
      gcd: 0,
      duration: 20,
      execute: () => {
        this.applyBuff(new Buff({
          name: '응징의 격노',
          duration: 20,
          type: BUFF_TYPE.HOLY,
          effect: () => {
            this.healingModifier = 1.3;
            this.damageModifier = 1.2;
            this.stats[STAT_TYPE.CRITICAL] += 20;
          },
          onExpire: () => {
            this.healingModifier = 1.0;
            this.damageModifier = 1.0;
            this.stats[STAT_TYPE.CRITICAL] -= 20;
          }
        }));

        // 응징의 성전사 특성
        if (this.talents.has('avenging_crusader')) {
          // 공격 능력이 치유로 변환
          this.avengingCrusaderActive = true;
        }

        return true;
      }
    });

    // 빛 주입
    this.abilities.set('infusion_of_light', {
      name: '빛 주입',
      cooldown: 0,
      castTime: 0,
      gcd: 0,
      execute: () => {
        this.infusion.active = true;
        this.infusion.nextSpellBonus = 0.5; // 다음 치유 50% 증가

        this.applyBuff(new Buff({
          name: '빛 주입',
          duration: 15,
          type: BUFF_TYPE.HOLY,
          onExpire: () => {
            this.infusion.active = false;
            this.infusion.nextSpellBonus = 0;
          }
        }));

        return true;
      }
    });

    // 신의 가호
    this.abilities.set('divine_favor', {
      name: '신의 총애',
      cooldown: 45,
      castTime: 0,
      gcd: 0,
      execute: () => {
        this.applyBuff(new Buff({
          name: '신의 총애',
          duration: 10,
          type: BUFF_TYPE.HOLY,
          effect: () => {
            this.stats[STAT_TYPE.HASTE] += 30;
            this.castTimeReduction = 0.5; // 시전시간 50% 감소
          },
          onExpire: () => {
            this.stats[STAT_TYPE.HASTE] -= 30;
            this.castTimeReduction = 0;
          }
        }));

        return true;
      }
    });

    // 순교자의 빛
    this.abilities.set('light_of_martyr', {
      name: '순교자의 빛',
      cost: { type: RESOURCE_TYPE.MANA, amount: 700 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      school: DAMAGE_TYPE.HOLY,
      execute: (target) => {
        const healing = this.calculateHealing({
          base: 30000,
          spellPower: 2.2,
          target: target
        });

        target.heal(healing, HEAL_TYPE.DIRECT, this);

        // 자신에게 피해
        const selfDamage = healing * 0.5;
        this.takeDamage(selfDamage, DAMAGE_TYPE.HOLY, this);

        // 봉화 대상에게 전달
        this.transferToBeacons(healing, target);

        // 순교자의 의지 특성
        if (this.talents.has('martyrs_might')) {
          this.applyBuff(new Buff({
            name: '순교자의 의지',
            duration: 10,
            stacks: 1,
            maxStacks: 3,
            type: BUFF_TYPE.HOLY,
            effect: () => {
              this.damageReduction = 0.1 * this.getBuffStacks('순교자의 의지');
            },
            onExpire: () => {
              this.damageReduction = 0;
            }
          }));
        }

        return true;
      }
    });

    // 신성한 찬가
    this.abilities.set('divine_hymn', {
      name: '신성한 찬가',
      cooldown: 180,
      channelTime: 8,
      tickRate: 2,
      radius: 40,
      execute: () => {
        this.startChannel({
          duration: 8,
          tickRate: 2,
          onTick: () => {
            const allies = this.getAlliesInRadius(40);
            const healing = this.calculateHealing({
              base: 15000,
              spellPower: 1.0
            });

            allies.forEach(ally => {
              ally.heal(healing, HEAL_TYPE.AOE, this);

              // 신성한 보호막
              this.applyBuff(new Buff({
                name: '신성한 보호',
                duration: 10,
                type: BUFF_TYPE.ABSORB,
                absorb: healing * 0.3
              }), ally);
            });
          }
        });

        return true;
      }
    });
  }

  initializeTalents() {
    this.talentTree = new TalentTree();

    // 신성 특성
    this.talentTree.addTalent(new Talent({
      name: '신념의 봉화',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '빛의 봉화를 2명에게 적용 가능',
      effect: () => {
        this.talents.set('beacon_of_faith', true);
        this.beacon.maxTargets = 2;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '빛의 섬광',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '신성 충격이 빛나는 빛 적용',
      effect: () => {
        this.talents.set('glimmer_of_light', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '성전사의 힘',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '신성 충격 재사용 대기시간 30% 감소',
      effect: () => {
        this.abilities.get('holy_shock').cooldown *= 0.7;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '빛의 망치',
      tier: 2,
      maxRank: 1,
      type: 'ability',
      description: '회전하는 빛의 망치',
      cooldown: 60,
      learn: () => {
        this.abilities.set('light_hammer', {
          name: '빛의 망치',
          cooldown: 60,
          castTime: 0,
          gcd: 1.5,
          execute: (position) => {
            this.createGroundEffect({
              position: position,
              radius: 10,
              duration: 14,
              tickRate: 2,
              onTick: (units) => {
                units.forEach(unit => {
                  if (unit.faction === this.faction) {
                    const healing = this.calculateHealing({
                      base: 5000,
                      spellPower: 0.5
                    });
                    unit.heal(healing, HEAL_TYPE.AOE, this);
                  } else {
                    const damage = this.calculateDamage({
                      base: 4000,
                      coefficients: { spellPower: 0.4 },
                      type: DAMAGE_TYPE.HOLY
                    });
                    this.dealDamage(unit, damage, 'light_hammer');
                  }
                });
              }
            });
            return true;
          }
        });
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '신성한 목적',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '신성 충격 15% 확률로 추가 신성한 힘 생성',
      effect: () => {
        this.talents.set('holy_purpose', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '축성된 땅',
      tier: 3,
      maxRank: 1,
      type: 'ability',
      description: '치유의 성역 생성',
      cooldown: 45,
      learn: () => {
        this.abilities.set('consecrated_ground', {
          name: '축성된 땅',
          cooldown: 45,
          castTime: 0,
          gcd: 1.5,
          execute: () => {
            this.createGroundEffect({
              position: this.position,
              radius: 8,
              duration: 10,
              tickRate: 1,
              onTick: (units) => {
                units.forEach(unit => {
                  if (unit.faction === this.faction) {
                    const healing = this.calculateHealing({
                      base: 3000,
                      spellPower: 0.3
                    });
                    unit.heal(healing, HEAL_TYPE.AOE, this);

                    // 이동속도 증가
                    unit.applyBuff(new Buff({
                      name: '축성된 땅',
                      duration: 1.5,
                      type: BUFF_TYPE.HOLY,
                      effect: () => {
                        unit.stats[STAT_TYPE.MOVEMENT_SPEED] += 10;
                      },
                      onExpire: () => {
                        unit.stats[STAT_TYPE.MOVEMENT_SPEED] -= 10;
                      }
                    }));
                  }
                });
              }
            });
            return true;
          }
        });
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '순교자의 의지',
      tier: 4,
      maxRank: 1,
      type: 'passive',
      description: '순교자의 빛 사용시 피해 감소 버프',
      effect: () => {
        this.talents.set('martyrs_might', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '신의 은총',
      tier: 4,
      maxRank: 1,
      type: 'passive',
      description: '빛의 섬광 치유시 가속 버프',
      effect: () => {
        this.talents.set('divine_favor', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '비이기적인 치유사',
      tier: 5,
      maxRank: 1,
      type: 'passive',
      description: '타인 치유시 재사용 대기시간 감소',
      effect: () => {
        this.talents.set('unbreakable_spirit', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '각성',
      tier: 5,
      maxRank: 1,
      type: 'passive',
      description: '여명의 빛 15% 확률로 응징의 격노 쿨 감소',
      effect: () => {
        this.talents.set('awakening', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '응징의 성전사',
      tier: 6,
      maxRank: 1,
      type: 'passive',
      description: '응징의 격노 중 공격이 치유로 변환',
      effect: () => {
        this.talents.set('avenging_crusader', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '신성한 복수자',
      tier: 6,
      maxRank: 1,
      type: 'ability',
      description: '강력한 즉시 치유',
      cooldown: 300,
      learn: () => {
        this.abilities.set('divine_providence', {
          name: '신의 섭리',
          cooldown: 300,
          castTime: 0,
          gcd: 0,
          execute: () => {
            // 모든 아군 즉시 최대 체력으로
            const allies = this.getAlliesInRadius(100);
            allies.forEach(ally => {
              ally.heal(ally.maxHealth, HEAL_TYPE.DIVINE, this);
            });

            // 10초간 무적
            allies.forEach(ally => {
              this.applyBuff(new Buff({
                name: '신의 가호',
                duration: 10,
                type: BUFF_TYPE.IMMUNITY,
                effect: () => {
                  ally.immune = true;
                },
                onExpire: () => {
                  ally.immune = false;
                }
              }), ally);
            });

            return true;
          }
        });
      }
    }));
  }

  initializeRotation() {
    // Holy 우선순위 로테이션
    this.rotationPriority = [
      {
        ability: 'holy_shock',
        condition: (target) => {
          return target && (target.healthPercent < 80 || !target.friendly);
        }
      },
      {
        ability: 'word_of_glory',
        condition: (target) => {
          return target && target.healthPercent < 50 && this.holyPower.current >= 3;
        }
      },
      {
        ability: 'light_of_dawn',
        condition: () => {
          const injuredAllies = this.getAlliesInCone(15, 90)
            .filter(ally => ally.healthPercent < 80);
          return injuredAllies.length >= 3 && this.holyPower.current >= 3;
        }
      },
      {
        ability: 'holy_light',
        condition: (target) => {
          return target && target.healthPercent < 60;
        }
      },
      {
        ability: 'flash_of_light',
        condition: (target) => {
          return target && target.healthPercent < 40;
        }
      },
      {
        ability: 'light_of_martyr',
        condition: (target) => {
          return target && target.healthPercent < 30 && this.healthPercent > 50;
        }
      },
      {
        ability: 'beacon_of_light',
        condition: (target) => {
          return target && !target.hasBuff('빛의 봉화') && target.role === 'tank';
        }
      }
    ];
  }

  // 치유량 계산
  calculateHealing(params) {
    let healing = params.base || 0;

    // 주문력 계수
    if (params.spellPower) {
      healing += this.stats[STAT_TYPE.INTELLECT] * params.spellPower;
    }

    // 정통 효과 (거리에 따른 치유량)
    if (params.target) {
      const distance = this.getDistanceTo(params.target);
      const rangeFactor = Math.max(0, 1 - (distance / this.maxHealRange));
      const masteryBonus = this.masteryEffect * rangeFactor;
      healing *= (1 + masteryBonus);
    }

    // 치유 증가 효과
    healing *= this.healingModifier;

    // 다재다능 적용
    healing *= (1 + this.stats[STAT_TYPE.VERSATILITY] / 100);

    return Math.floor(healing);
  }

  // 봉화 대상에게 치유 전달
  transferToBeacons(healing, originalTarget) {
    this.beacon.targets.forEach((beaconTarget, targetId) => {
      if (beaconTarget !== originalTarget && beaconTarget.isAlive()) {
        const transferAmount = healing * this.beacon.transferRate;
        beaconTarget.heal(transferAmount, HEAL_TYPE.BEACON, this, { fromBeacon: true });
      }
    });
  }

  // 빛나는 빛 적용
  applyGlimmer(target) {
    if (this.glimmer.targets.size >= this.glimmer.maxTargets) {
      // 가장 오래된 대상 제거
      const oldest = this.glimmer.targets.values().next().value;
      this.glimmer.targets.delete(oldest);
      oldest.removeBuff('빛나는 빛');
    }

    this.applyBuff(new Buff({
      name: '빛나는 빛',
      duration: 30,
      type: BUFF_TYPE.HOT,
      tickRate: 3,
      onTick: () => {
        const healing = this.calculateHealing({
          base: 2000,
          spellPower: 0.15,
          target: target
        });
        target.heal(healing, HEAL_TYPE.HOT, this);
      },
      onExpire: () => {
        this.glimmer.targets.delete(target);
      }
    }), target);

    this.glimmer.targets.add(target);
  }

  // 신성한 힘 생성
  generateHolyPower(amount) {
    this.holyPower.current = Math.min(this.holyPower.current + amount, this.holyPower.max);
  }

  // 신성한 힘 소비
  spendHolyPower(amount) {
    if (this.holyPower.current >= amount) {
      this.holyPower.current -= amount;
      return true;
    }
    return false;
  }

  update(deltaTime) {
    super.update(deltaTime);

    // 봉화 대상 확인
    this.beacon.targets.forEach((target, id) => {
      if (!target.isAlive() || !target.hasBuff('빛의 봉화')) {
        this.beacon.targets.delete(id);
      }
    });

    // 응징의 성전사 모드
    if (this.avengingCrusaderActive && !this.buffs.has('응징의 격노')) {
      this.avengingCrusaderActive = false;
    }
  }
}

/**
 * Protection Paladin Specialization
 * 보호 성기사 - 신성 탱킹
 */
class ProtectionPaladin extends Specialization {
  constructor(paladin) {
    super(paladin, 'protection');

    this.role = 'tank';
    this.masteryName = '신성한 방벽';
    this.masteryEffect = 0.08; // 방패막기 확률 8% 증가

    // Protection 고유 메커니즘
    this.shieldOfRighteous = {
      active: false,
      duration: 0,
      armorBonus: 0
    };

    this.consecration = {
      active: false,
      position: null,
      radius: 8
    };

    this.grandCrusader = {
      procChance: 0.15
    };

    // 빛의 수호자
    this.guardianOfLight = {
      active: false,
      healingBonus: 0.5
    };

    // 방패 정보
    this.shield = {
      blockChance: 10,
      blockValue: 40,
      armor: 6000
    };

    // 위협 수준
    this.threatModifier = 5.0;

    this.initializeAbilities();
    this.initializeTalents();
    this.initializeRotation();
  }

  initializeAbilities() {
    // 정의의 방패
    this.abilities.set('shield_of_righteous', {
      name: '정의의 방패',
      cost: { type: RESOURCE_TYPE.HOLY_POWER, amount: 3 },
      cooldown: 0,
      castTime: 0,
      gcd: 0,
      duration: 4.5,
      execute: () => {
        const holyPower = Math.min(this.holyPower.current, 5);
        if (!this.spendHolyPower(holyPower)) return false;

        const duration = 4.5 * (holyPower / 3);
        const armorBonus = this.stats[STAT_TYPE.STRENGTH] * 3 * (holyPower / 3);

        this.shieldOfRighteous.active = true;
        this.shieldOfRighteous.duration = duration;
        this.shieldOfRighteous.armorBonus = armorBonus;

        this.applyBuff(new Buff({
          name: '정의의 방패',
          duration: duration,
          type: BUFF_TYPE.DEFENSIVE,
          effect: () => {
            this.stats[STAT_TYPE.ARMOR] += armorBonus;
            this.damageReduction = 0.25; // 25% 피해 감소
          },
          onExpire: () => {
            this.stats[STAT_TYPE.ARMOR] -= armorBonus;
            this.damageReduction = 0;
            this.shieldOfRighteous.active = false;
          }
        }));

        // 정의로운 수호자 특성
        if (this.talents.has('righteous_protector')) {
          this.reduceCooldown('avenging_wrath', 3);
          this.reduceCooldown('guardian_of_ancient_kings', 3);
        }

        return true;
      }
    });

    // 축성
    this.abilities.set('consecration', {
      name: '신성화',
      cost: { type: RESOURCE_TYPE.MANA, amount: 900 },
      cooldown: 4.5,
      castTime: 0,
      gcd: 1.5,
      radius: 8,
      duration: 12,
      execute: () => {
        this.consecration.active = true;
        this.consecration.position = { ...this.position };

        this.createGroundEffect({
          position: this.consecration.position,
          radius: this.consecration.radius,
          duration: 12,
          tickRate: 1,
          onTick: (enemies) => {
            enemies.forEach(enemy => {
              const damage = this.calculateDamage({
                base: 2000,
                coefficients: { spellPower: 0.2, attackPower: 0.1 },
                type: DAMAGE_TYPE.HOLY
              });

              this.dealDamage(enemy, damage, 'consecration');
              this.generateThreat(enemy, damage * 4);
            });

            // 축성된 땅 위에서 버프
            if (this.isInConsecration()) {
              this.applyBuff(new Buff({
                name: '축성된 땅',
                duration: 1.1,
                type: BUFF_TYPE.HOLY,
                effect: () => {
                  this.damageReduction = 0.1; // 10% 피해 감소
                  this.stats[STAT_TYPE.HASTE] += 10;
                },
                onExpire: () => {
                  this.damageReduction = 0;
                  this.stats[STAT_TYPE.HASTE] -= 10;
                }
              }));
            }
          },
          onExpire: () => {
            this.consecration.active = false;
            this.consecration.position = null;
          }
        });

        return true;
      }
    });

    // 축복받은 망치
    this.abilities.set('blessed_hammer', {
      name: '축복받은 망치',
      cost: { type: RESOURCE_TYPE.MANA, amount: 600 },
      charges: 3,
      maxCharges: 3,
      cooldown: 6,
      castTime: 0,
      gcd: 1.5,
      execute: () => {
        // 회전하는 망치 생성
        const hammers = 3;
        for (let i = 0; i < hammers; i++) {
          const angle = (i * 120) * Math.PI / 180;

          this.createProjectile({
            type: 'blessed_hammer',
            position: this.position,
            angle: angle,
            speed: 10,
            duration: 3,
            radius: 5,
            onHit: (enemy) => {
              const damage = this.calculateDamage({
                base: 5000,
                coefficients: { attackPower: 0.3 },
                type: DAMAGE_TYPE.HOLY
              });

              this.dealDamage(enemy, damage, 'blessed_hammer');
              this.generateThreat(enemy, damage * 3);

              // 감속 효과
              this.applyDebuff(enemy, new Debuff({
                name: '축복받은 망치',
                duration: 3,
                type: DEBUFF_TYPE.SLOW,
                effect: (target) => {
                  target.stats[STAT_TYPE.MOVEMENT_SPEED] *= 0.7;
                },
                onExpire: (target) => {
                  target.stats[STAT_TYPE.MOVEMENT_SPEED] /= 0.7;
                }
              }));
            }
          });
        }

        // 신성한 힘 생성
        this.generateHolyPower(1);

        return true;
      }
    });

    // 왕의 수호자
    this.abilities.set('guardian_of_ancient_kings', {
      name: '고대 왕의 수호자',
      cooldown: 300,
      castTime: 0,
      gcd: 0,
      duration: 8,
      execute: () => {
        this.applyBuff(new Buff({
          name: '고대 왕의 수호자',
          duration: 8,
          type: BUFF_TYPE.DEFENSIVE,
          effect: () => {
            this.damageReduction = 0.5; // 50% 피해 감소

            // 수호자 소환 (시각 효과)
            this.guardian = {
              active: true,
              onDamageTransfer: (damage) => {
                // 받는 피해의 일부를 수호자가 대신 받음
                return damage * 0.5;
              }
            };
          },
          onExpire: () => {
            this.damageReduction = 0;
            this.guardian.active = false;
          }
        }));

        // 빛의 수호자 특성
        if (this.talents.has('guardian_of_light')) {
          this.guardianOfLight.active = true;
        }

        return true;
      }
    });

    // 응징의 방패
    this.abilities.set('avenger_shield', {
      name: '응징의 방패',
      cooldown: 15,
      castTime: 0,
      gcd: 1.5,
      maxTargets: 3,
      range: 30,
      execute: (target) => {
        const targets = [target];

        // 추가 대상 탐색
        const nearbyEnemies = this.getEnemiesInRadius(10, target)
          .filter(e => e !== target);
        targets.push(...nearbyEnemies.slice(0, 2));

        targets.forEach((enemy, index) => {
          const damage = this.calculateDamage({
            base: 12000 * (1 - index * 0.25), // 각 대상마다 25% 감소
            coefficients: { attackPower: 1.2, spellPower: 0.8 },
            type: DAMAGE_TYPE.HOLY
          });

          this.dealDamage(enemy, damage, 'avenger_shield');
          this.generateThreat(enemy, damage * 5);

          // 침묵 효과
          this.applyDebuff(enemy, new Debuff({
            name: '응징의 방패',
            duration: 3,
            type: DEBUFF_TYPE.SILENCE,
            effect: (target) => {
              target.silenced = true;
            },
            onExpire: (target) => {
              target.silenced = false;
            }
          }));
        });

        // 신성한 힘 생성
        this.generateHolyPower(1);

        // 첫 번째 응징자 특성
        if (this.talents.has('first_avenger')) {
          this.applyBuff(new Buff({
            name: '첫 번째 응징자',
            duration: 8,
            type: BUFF_TYPE.PHYSICAL,
            effect: () => {
              this.stats[STAT_TYPE.CRITICAL] += 5 * targets.length;
            },
            onExpire: () => {
              this.stats[STAT_TYPE.CRITICAL] -= 5 * targets.length;
            }
          }));
        }

        return true;
      }
    });

    // 심판의 망치
    this.abilities.set('hammer_of_judgment', {
      name: '심판의 망치',
      cooldown: 60,
      castTime: 0,
      gcd: 1.5,
      range: 10,
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 20000,
          coefficients: { attackPower: 1.5 },
          type: DAMAGE_TYPE.HOLY
        });

        this.dealDamage(target, damage, 'hammer_of_judgment');

        // 기절 효과
        this.applyDebuff(target, new Debuff({
          name: '심판의 망치',
          duration: 2,
          type: DEBUFF_TYPE.STUN,
          effect: (target) => {
            target.stunned = true;
          },
          onExpire: (target) => {
            target.stunned = false;
          }
        }));

        // 신성한 힘 2개 생성
        this.generateHolyPower(2);

        return true;
      }
    });

    // 빛의 수호
    this.abilities.set('light_of_protector', {
      name: '수호자의 빛',
      cooldown: 20,
      castTime: 0,
      gcd: 1.5,
      execute: () => {
        // 잃은 체력에 비례한 치유
        const missingHealth = this.maxHealth - this.currentHealth;
        const healing = this.calculateHealing({
          base: 10000 + missingHealth * 0.3,
          spellPower: 1.0
        });

        this.heal(healing, HEAL_TYPE.DIRECT, this);

        // 빛의 손길 특성
        if (this.talents.has('hand_of_protector')) {
          // 대상 지정 가능
          const target = this.target || this;
          if (target !== this) {
            target.heal(healing * 0.5, HEAL_TYPE.DIRECT, this);
          }
        }

        return true;
      }
    });

    // 헌신적인 수호자
    this.abilities.set('ardent_defender', {
      name: '열렬한 수호자',
      cooldown: 120,
      castTime: 0,
      gcd: 0,
      execute: () => {
        this.applyBuff(new Buff({
          name: '열렬한 수호자',
          duration: 8,
          type: BUFF_TYPE.DEFENSIVE,
          effect: () => {
            this.damageReduction = 0.2; // 20% 피해 감소
          },
          onLethalDamage: (damage) => {
            // 치명적 피해를 받으면 체력을 30%로 회복
            this.currentHealth = this.maxHealth * 0.3;
            this.removeBuff('열렬한 수호자');
            return 0; // 피해 무효화
          },
          onExpire: () => {
            this.damageReduction = 0;
          }
        }));

        return true;
      }
    });

    // 최후의 저항
    this.abilities.set('final_stand', {
      name: '최후의 저항',
      cooldown: 300,
      castTime: 0,
      gcd: 0,
      execute: () => {
        // 응징의 방패와 정의의 방패 즉시 재사용 가능
        this.abilities.get('avenger_shield').resetCooldown();
        this.abilities.get('shield_of_righteous').resetCooldown();

        // 즉시 신성한 힘 3개 생성
        this.generateHolyPower(3);

        this.applyBuff(new Buff({
          name: '최후의 저항',
          duration: 10,
          type: BUFF_TYPE.DEFENSIVE,
          effect: () => {
            this.maxHealth *= 1.3;
            this.currentHealth *= 1.3;
            this.parryChance += 30;
          },
          onExpire: () => {
            this.maxHealth /= 1.3;
            this.currentHealth = Math.min(this.currentHealth, this.maxHealth);
            this.parryChance -= 30;
          }
        }));

        return true;
      }
    });
  }

  initializeTalents() {
    this.talentTree = new TalentTree();

    // 보호 특성
    this.talentTree.addTalent(new Talent({
      name: '정의로운 수호자',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '정의의 방패가 주요 쿨다운 감소',
      effect: () => {
        this.talents.set('righteous_protector', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '첫 번째 응징자',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '응징의 방패가 치명타율 증가 버프',
      effect: () => {
        this.talents.set('first_avenger', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '위대한 성전사',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '응징의 방패 15% 확률로 재설정',
      effect: () => {
        this.grandCrusader.procChance = 0.25;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '축성된 판결',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '신성화 안에서 능력 사용시 재사용 대기시간 감소',
      effect: () => {
        this.talents.set('consecrated_judgment', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '수호자의 빛',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '고대 왕의 수호자가 치유 효과 제공',
      effect: () => {
        this.talents.set('guardian_of_light', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '보호의 손길',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '수호자의 빛을 타인에게 사용 가능',
      effect: () => {
        this.talents.set('hand_of_protector', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '분쇄자',
      tier: 4,
      maxRank: 3,
      type: 'passive',
      description: '방패막기 값 5% 증가',
      effect: (rank) => {
        this.shield.blockValue += 5 * rank;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '신성한 방패',
      tier: 4,
      maxRank: 1,
      type: 'ability',
      description: '마법 피해 흡수 방패',
      cooldown: 120,
      learn: () => {
        this.abilities.set('divine_shield_prot', {
          name: '신의 방패',
          cooldown: 300,
          castTime: 0,
          gcd: 0,
          execute: () => {
            this.applyBuff(new Buff({
              name: '신의 방패',
              duration: 8,
              type: BUFF_TYPE.IMMUNITY,
              effect: () => {
                this.immune = true;
                this.removeAllDebuffs();
              },
              onExpire: () => {
                this.immune = false;
              }
            }));

            return true;
          }
        });
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '끝없는 인내',
      tier: 5,
      maxRank: 1,
      type: 'passive',
      description: '열렬한 수호자 지속시간 2초 증가',
      effect: () => {
        this.abilities.get('ardent_defender').duration = 10;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '세라핌',
      tier: 6,
      maxRank: 1,
      type: 'ability',
      description: '모든 스탯 대폭 증가',
      cooldown: 120,
      learn: () => {
        this.abilities.set('seraphim', {
          name: '세라핌',
          cost: { type: RESOURCE_TYPE.HOLY_POWER, amount: 5 },
          cooldown: 120,
          castTime: 0,
          gcd: 0,
          execute: () => {
            if (!this.spendHolyPower(5)) return false;

            this.applyBuff(new Buff({
              name: '세라핌',
              duration: 15,
              type: BUFF_TYPE.HOLY,
              effect: () => {
                this.stats[STAT_TYPE.HASTE] += 15;
                this.stats[STAT_TYPE.CRITICAL] += 15;
                this.stats[STAT_TYPE.MASTERY] += 15;
                this.stats[STAT_TYPE.VERSATILITY] += 15;
              },
              onExpire: () => {
                this.stats[STAT_TYPE.HASTE] -= 15;
                this.stats[STAT_TYPE.CRITICAL] -= 15;
                this.stats[STAT_TYPE.MASTERY] -= 15;
                this.stats[STAT_TYPE.VERSATILITY] -= 15;
              }
            }));

            return true;
          }
        });
      }
    }));
  }

  initializeRotation() {
    // Protection 우선순위 로테이션
    this.rotationPriority = [
      {
        ability: 'shield_of_righteous',
        condition: () => {
          return !this.shieldOfRighteous.active && this.holyPower.current >= 3;
        }
      },
      {
        ability: 'consecration',
        condition: () => {
          return !this.consecration.active;
        }
      },
      {
        ability: 'avenger_shield',
        condition: () => {
          return true; // 항상 우선순위
        }
      },
      {
        ability: 'blessed_hammer',
        condition: () => {
          return this.abilities.get('blessed_hammer').currentCharges > 0;
        }
      },
      {
        ability: 'hammer_of_judgment',
        condition: (target) => {
          return target && this.getDistanceTo(target) <= 10;
        }
      },
      {
        ability: 'light_of_protector',
        condition: () => {
          return this.healthPercent < 60;
        }
      },
      {
        ability: 'ardent_defender',
        condition: () => {
          return this.healthPercent < 30;
        }
      },
      {
        ability: 'guardian_of_ancient_kings',
        condition: () => {
          return this.healthPercent < 40 || this.incomingDamageHigh;
        }
      }
    ];
  }

  // 축성된 땅 위에 있는지 확인
  isInConsecration() {
    if (!this.consecration.active || !this.consecration.position) return false;

    const distance = Math.sqrt(
      Math.pow(this.position.x - this.consecration.position.x, 2) +
      Math.pow(this.position.y - this.consecration.position.y, 2)
    );

    return distance <= this.consecration.radius;
  }

  // 위협 수준 생성
  generateThreat(target, amount) {
    const threat = amount * this.threatModifier;
    target.addThreat(this, threat);
  }

  // 피격시 처리
  onDamageTaken(damage, damageType, attacker) {
    // 방패막기 처리
    if (Math.random() < (this.shield.blockChance + this.masteryEffect * 100) / 100) {
      damage *= (1 - this.shield.blockValue / 100);

      // 위대한 성전사 발동
      if (Math.random() < this.grandCrusader.procChance) {
        this.abilities.get('avenger_shield').resetCooldown();
      }
    }

    // 정의의 방패 피해 감소
    if (this.shieldOfRighteous.active) {
      damage *= 0.75;
    }

    // 수호자 피해 전달
    if (this.guardian && this.guardian.active) {
      damage = this.guardian.onDamageTransfer(damage);
    }

    return damage;
  }

  update(deltaTime) {
    super.update(deltaTime);

    // 정의의 방패 지속시간 업데이트
    if (this.shieldOfRighteous.active) {
      this.shieldOfRighteous.duration -= deltaTime;
      if (this.shieldOfRighteous.duration <= 0) {
        this.shieldOfRighteous.active = false;
      }
    }

    // 빛의 수호자 치유
    if (this.guardianOfLight.active && this.buffs.has('고대 왕의 수호자')) {
      if (this.lastGuardianHeal + 1 < this.currentTime) {
        const healing = this.calculateHealing({
          base: 5000,
          spellPower: 0.5
        });
        this.heal(healing, HEAL_TYPE.HOT, this);
        this.lastGuardianHeal = this.currentTime;
      }
    }
  }
}

/**
 * Retribution Paladin Specialization
 * 징벌 성기사 - 근접 DPS
 */
class RetributionPaladin extends Specialization {
  constructor(paladin) {
    super(paladin, 'retribution');

    this.role = 'dps';
    this.masteryName = '신의 심판';
    this.masteryEffect = 0.22; // 신성 데미지 22% 증가

    // Retribution 고유 메커니즘
    this.judgment = {
      debuffs: new Map(),
      empoweredCharges: 2
    };

    this.bladeOfJustice = {
      artOfWar: false,
      procChance: 0.12
    };

    this.crusade = {
      active: false,
      stacks: 0,
      maxStacks: 10
    };

    this.wake = {
      active: false,
      position: null
    };

    // 신성한 힘
    this.holyPower = {
      current: 0,
      max: 5
    };

    this.initializeAbilities();
    this.initializeTalents();
    this.initializeRotation();
  }

  initializeAbilities() {
    // 심판
    this.abilities.set('judgment', {
      name: '심판',
      cooldown: 12,
      charges: 1,
      maxCharges: 1,
      castTime: 0,
      gcd: 1.5,
      range: 30,
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 12000,
          coefficients: { attackPower: 1.2, spellPower: 1.0 },
          type: DAMAGE_TYPE.HOLY
        });

        this.dealDamage(target, damage, 'judgment');

        // 심판 디버프
        const debuff = new Debuff({
          name: '심판',
          duration: 15,
          type: DEBUFF_TYPE.HOLY,
          effect: (target) => {
            target.holyDamageTaken = 1.25; // 신성 피해 25% 증가
          },
          onExpire: (target) => {
            target.holyDamageTaken = 1.0;
          }
        });

        this.applyDebuff(target, debuff);
        this.judgment.debuffs.set(target.id, debuff);

        // 신성한 힘 생성
        this.generateHolyPower(1);

        // 강화된 심판 특성
        if (this.talents.has('empyrean_power')) {
          if (Math.random() < 0.15) {
            this.generateHolyPower(1);
          }
        }

        // 심판의 칼날 특성
        if (this.talents.has('blade_of_wrath')) {
          this.bladeOfJustice.artOfWar = true;
        }

        return true;
      }
    });

    // 정의의 칼날
    this.abilities.set('blade_of_justice', {
      name: '공의의 칼날',
      cooldown: 10.5,
      castTime: 0,
      gcd: 1.5,
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 14000,
          coefficients: { attackPower: 1.4 },
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'blade_of_justice');

        // 신성한 힘 2개 생성
        this.generateHolyPower(2);

        // 전술의 극의 발동
        if (Math.random() < this.bladeOfJustice.procChance || this.bladeOfJustice.artOfWar) {
          this.applyBuff(new Buff({
            name: '전술의 극의',
            duration: 12,
            type: BUFF_TYPE.PHYSICAL,
            effect: () => {
              // 다음 소비 능력 무료
              this.nextHolyPowerFree = true;
            }
          }));

          this.bladeOfJustice.artOfWar = false;
        }

        return true;
      }
    });

    // 기사단의 선고
    this.abilities.set('templar_verdict', {
      name: '기사단의 선고',
      cost: { type: RESOURCE_TYPE.HOLY_POWER, amount: 3 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      execute: (target) => {
        let holyPower = Math.min(this.holyPower.current, 5);

        // 전술의 극의로 무료 시전
        if (this.nextHolyPowerFree) {
          this.nextHolyPowerFree = false;
          this.consumeBuff('전술의 극의');
        } else if (!this.spendHolyPower(holyPower)) {
          return false;
        }

        const damage = this.calculateDamage({
          base: 20000 * (holyPower / 3),
          coefficients: { attackPower: 2.5 * (holyPower / 3) },
          type: DAMAGE_TYPE.HOLY
        });

        this.dealDamage(target, damage, 'templar_verdict');

        // 최종 선고 특성
        if (this.talents.has('final_verdict')) {
          // 다음 공격 20% 증가
          this.applyBuff(new Buff({
            name: '최종 선고',
            duration: 20,
            type: BUFF_TYPE.PHYSICAL,
            effect: () => {
              this.nextAttackBonus = 0.2;
            }
          }));
        }

        // 성전 스택 증가
        if (this.crusade.active) {
          this.addCrusadeStack();
        }

        return true;
      }
    });

    // 신성한 폭풍
    this.abilities.set('divine_storm', {
      name: '신성한 폭풍',
      cost: { type: RESOURCE_TYPE.HOLY_POWER, amount: 3 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      radius: 8,
      execute: () => {
        let holyPower = Math.min(this.holyPower.current, 5);

        // 전술의 극의로 무료 시전
        if (this.nextHolyPowerFree) {
          this.nextHolyPowerFree = false;
          this.consumeBuff('전술의 극의');
        } else if (!this.spendHolyPower(holyPower)) {
          return false;
        }

        const enemies = this.getEnemiesInRadius(8);
        const damage = this.calculateDamage({
          base: 15000 * (holyPower / 3),
          coefficients: { attackPower: 1.8 * (holyPower / 3) },
          type: DAMAGE_TYPE.HOLY
        });

        enemies.forEach(enemy => {
          this.dealDamage(enemy, damage, 'divine_storm');
        });

        // 강화의 힘 특성
        if (this.talents.has('empyrean_power') && enemies.length >= 2) {
          // 주변 아군 버프
          const allies = this.getAlliesInRadius(8);
          allies.forEach(ally => {
            this.applyBuff(new Buff({
              name: '강화의 힘',
              duration: 10,
              type: BUFF_TYPE.PHYSICAL,
              effect: () => {
                ally.damageModifier = 1.03;
              },
              onExpire: () => {
                ally.damageModifier = 1.0;
              }
            }), ally);
          });
        }

        // 성전 스택 증가
        if (this.crusade.active) {
          this.addCrusadeStack();
        }

        return true;
      }
    });

    // 재의 경험
    this.abilities.set('wake_of_ashes', {
      name: '잿빛 경험',
      cooldown: 30,
      castTime: 0,
      gcd: 1.5,
      radius: 12,
      cone: 12,
      angle: 90,
      execute: () => {
        const enemies = this.getEnemiesInCone(12, 90);

        enemies.forEach(enemy => {
          const damage = this.calculateDamage({
            base: 18000,
            coefficients: { attackPower: 1.5 },
            type: DAMAGE_TYPE.RADIANT
          });

          this.dealDamage(enemy, damage, 'wake_of_ashes');

          // 언데드와 악마에게 기절
          if (enemy.type === 'undead' || enemy.type === 'demon') {
            this.applyDebuff(enemy, new Debuff({
              name: '잿빛 경험',
              duration: 2,
              type: DEBUFF_TYPE.STUN
            }));
          }
        });

        // 신성한 힘 5개 생성
        this.generateHolyPower(5);

        // 불타는 여파 특성
        if (this.talents.has('ashes_to_dust')) {
          this.wake.active = true;
          this.wake.position = { ...this.position };

          this.createGroundEffect({
            position: this.wake.position,
            radius: 12,
            duration: 6,
            tickRate: 1,
            onTick: (enemies) => {
              enemies.forEach(enemy => {
                const dotDamage = this.calculateDamage({
                  base: 2000,
                  coefficients: { attackPower: 0.2 },
                  type: DAMAGE_TYPE.FIRE
                });
                this.dealDamage(enemy, dotDamage, 'wake_burn');
              });
            }
          });
        }

        return true;
      }
    });

    // 성전
    this.abilities.set('crusade', {
      name: '성전',
      cooldown: 120,
      castTime: 0,
      gcd: 0,
      execute: () => {
        this.crusade.active = true;
        this.crusade.stacks = 0;

        this.applyBuff(new Buff({
          name: '성전',
          duration: 35,
          type: BUFF_TYPE.HOLY,
          effect: () => {
            // 스택당 3% 데미지와 가속
            const bonus = this.crusade.stacks * 0.03;
            this.damageModifier = 1 + bonus;
            this.stats[STAT_TYPE.HASTE] += this.crusade.stacks * 3;
          },
          onExpire: () => {
            this.damageModifier = 1.0;
            this.stats[STAT_TYPE.HASTE] -= this.crusade.stacks * 3;
            this.crusade.active = false;
            this.crusade.stacks = 0;
          }
        }));

        return true;
      }
    });

    // 응징의 격노
    this.abilities.set('avenging_wrath', {
      name: '응징의 격노',
      cooldown: 120,
      castTime: 0,
      gcd: 0,
      execute: () => {
        this.applyBuff(new Buff({
          name: '응징의 격노',
          duration: 20,
          type: BUFF_TYPE.HOLY,
          effect: () => {
            this.damageModifier = 1.2;
            this.healingModifier = 1.2;
            this.stats[STAT_TYPE.CRITICAL] += 20;
          },
          onExpire: () => {
            this.damageModifier = 1.0;
            this.healingModifier = 1.0;
            this.stats[STAT_TYPE.CRITICAL] -= 20;
          }
        }));

        // 십자군의 힘 특성
        if (this.talents.has('crusader_might')) {
          // 즉시 신성한 힘 3개
          this.generateHolyPower(3);
        }

        return true;
      }
    });

    // 파괴의 망치
    this.abilities.set('hammer_of_wrath', {
      name: '진노의 망치',
      cooldown: 7.5,
      castTime: 0,
      gcd: 1.5,
      range: 30,
      execute: (target) => {
        // 체력 20% 이하 또는 응징의 격노 중에만 사용 가능
        if (target.healthPercent > 20 && !this.buffs.has('응징의 격노')) {
          return false;
        }

        const damage = this.calculateDamage({
          base: 16000,
          coefficients: { attackPower: 1.6, spellPower: 0.8 },
          type: DAMAGE_TYPE.HOLY
        });

        this.dealDamage(target, damage, 'hammer_of_wrath');

        // 신성한 힘 생성
        this.generateHolyPower(1);

        // 무자비한 보복 특성
        if (this.talents.has('vanguards_momentum')) {
          // 다음 신성한 폭풍/기사단의 선고 즉시 시전
          this.nextInstantCast = true;
        }

        return true;
      }
    });

    // 축성의 인장
    this.abilities.set('consecration_ret', {
      name: '신성화',
      cooldown: 20,
      castTime: 0,
      gcd: 1.5,
      execute: () => {
        this.createGroundEffect({
          position: this.position,
          radius: 8,
          duration: 12,
          tickRate: 1,
          onTick: (enemies) => {
            enemies.forEach(enemy => {
              const damage = this.calculateDamage({
                base: 2500,
                coefficients: { attackPower: 0.15, spellPower: 0.15 },
                type: DAMAGE_TYPE.HOLY
              });
              this.dealDamage(enemy, damage, 'consecration');
            });

            // 신성화 위에서 버프
            if (this.isInArea(this.position, 8)) {
              this.applyBuff(new Buff({
                name: '축성된 땅',
                duration: 1.1,
                type: BUFF_TYPE.HOLY,
                effect: () => {
                  this.damageModifier *= 1.05;
                },
                onExpire: () => {
                  this.damageModifier /= 1.05;
                }
              }));
            }
          }
        });

        return true;
      }
    });
  }

  initializeTalents() {
    this.talentTree = new TalentTree();

    // 징벌 특성
    this.talentTree.addTalent(new Talent({
      name: '심판의 칼날',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '심판이 공의의 칼날 재설정',
      effect: () => {
        this.talents.set('blade_of_wrath', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '열정',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '가속 3% 증가',
      effect: () => {
        this.stats[STAT_TYPE.HASTE] += 3;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '강화의 힘',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '신성 충격 추가 신성한 힘 확률',
      effect: () => {
        this.talents.set('empyrean_power', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '최종 선고',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '기사단의 선고가 다음 공격 강화',
      effect: () => {
        this.talents.set('final_verdict', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '불타는 여파',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '잿빛 경험이 지면에 불 효과',
      effect: () => {
        this.talents.set('ashes_to_dust', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '십자군의 힘',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '응징의 격노가 신성한 힘 3개 생성',
      effect: () => {
        this.talents.set('crusader_might', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '전술의 극의',
      tier: 4,
      maxRank: 2,
      type: 'passive',
      description: '공의의 칼날 발동 확률 증가',
      effect: (rank) => {
        this.bladeOfJustice.procChance = 0.12 + (0.06 * rank);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '신의 목적',
      tier: 4,
      maxRank: 1,
      type: 'passive',
      description: '소비 능력 15% 확률로 무료',
      effect: () => {
        const originalTemplar = this.abilities.get('templar_verdict').execute;
        this.abilities.get('templar_verdict').execute = (target) => {
          if (Math.random() < 0.15) {
            this.nextHolyPowerFree = true;
          }
          return originalTemplar.call(this, target);
        };
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '무자비한 보복',
      tier: 5,
      maxRank: 1,
      type: 'passive',
      description: '진노의 망치가 다음 능력 즉시 시전',
      effect: () => {
        this.talents.set('vanguards_momentum', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '응보',
      tier: 5,
      maxRank: 3,
      type: 'passive',
      description: '체력 50% 이하시 데미지 증가',
      effect: (rank) => {
        this.onHealthChange = () => {
          if (this.healthPercent <= 50) {
            this.damageModifier = 1 + (0.1 * rank);
          } else {
            this.damageModifier = 1.0;
          }
        };
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '집행',
      tier: 6,
      maxRank: 1,
      type: 'ability',
      description: '강력한 처형 기술',
      cooldown: 90,
      learn: () => {
        this.abilities.set('execution_sentence', {
          name: '사형 선고',
          cooldown: 120,
          castTime: 0,
          gcd: 1.5,
          execute: (target) => {
            this.applyDebuff(target, new Debuff({
              name: '사형 선고',
              duration: 7,
              type: DEBUFF_TYPE.HOLY,
              stacks: 0,
              onApply: () => {
                // 7초에 걸쳐 데미지 증가
                for (let i = 1; i <= 7; i++) {
                  setTimeout(() => {
                    const damage = this.calculateDamage({
                      base: 5000 * i,
                      coefficients: { attackPower: 0.5 * i },
                      type: DAMAGE_TYPE.HOLY
                    });
                    this.dealDamage(target, damage, 'execution_sentence');
                  }, i * 1000);
                }
              },
              onExpire: (target) => {
                // 마지막 폭발
                const finalDamage = this.calculateDamage({
                  base: 50000,
                  coefficients: { attackPower: 5.0 },
                  type: DAMAGE_TYPE.HOLY
                });
                this.dealDamage(target, finalDamage, 'execution_sentence_final');
              }
            }));

            return true;
          }
        });
      }
    }));
  }

  initializeRotation() {
    // Retribution 우선순위 로테이션
    this.rotationPriority = [
      {
        ability: 'wake_of_ashes',
        condition: () => {
          return this.holyPower.current <= 2;
        }
      },
      {
        ability: 'execution_sentence',
        condition: (target) => {
          return this.talents.has('execution_sentence') &&
                 !target.hasDebuff('사형 선고');
        }
      },
      {
        ability: 'templar_verdict',
        condition: (target) => {
          const enemies = this.getEnemiesInRadius(8);
          return this.holyPower.current >= 4 ||
                 (this.holyPower.current >= 3 && enemies.length === 1);
        }
      },
      {
        ability: 'divine_storm',
        condition: () => {
          const enemies = this.getEnemiesInRadius(8);
          return this.holyPower.current >= 3 && enemies.length >= 2;
        }
      },
      {
        ability: 'judgment',
        condition: (target) => {
          return !target.hasDebuff('심판') ||
                 target.getDebuffDuration('심판') < 5;
        }
      },
      {
        ability: 'blade_of_justice',
        condition: () => {
          return this.holyPower.current <= 3;
        }
      },
      {
        ability: 'hammer_of_wrath',
        condition: (target) => {
          return target.healthPercent <= 20 || this.buffs.has('응징의 격노');
        }
      },
      {
        ability: 'consecration_ret',
        condition: () => {
          return !this.buffs.has('축성된 땅');
        }
      },
      {
        ability: 'crusade',
        condition: () => {
          return this.talents.has('crusade') && !this.crusade.active;
        }
      },
      {
        ability: 'avenging_wrath',
        condition: () => {
          return !this.talents.has('crusade') && !this.buffs.has('응징의 격노');
        }
      }
    ];
  }

  // 성전 스택 추가
  addCrusadeStack() {
    if (this.crusade.stacks < this.crusade.maxStacks) {
      this.crusade.stacks++;

      // 버프 갱신
      this.updateBuff('성전', {
        effect: () => {
          const bonus = this.crusade.stacks * 0.03;
          this.damageModifier = 1 + bonus;
          this.stats[STAT_TYPE.HASTE] = this.baseStats[STAT_TYPE.HASTE] + (this.crusade.stacks * 3);
        }
      });
    }
  }

  // 신성한 힘 생성
  generateHolyPower(amount) {
    this.holyPower.current = Math.min(this.holyPower.current + amount, this.holyPower.max);
  }

  // 신성한 힘 소비
  spendHolyPower(amount) {
    if (this.holyPower.current >= amount) {
      this.holyPower.current -= amount;
      return true;
    }
    return false;
  }

  update(deltaTime) {
    super.update(deltaTime);

    // 심판 디버프 정리
    this.judgment.debuffs.forEach((debuff, targetId) => {
      if (!debuff.active) {
        this.judgment.debuffs.delete(targetId);
      }
    });
  }
}

// 전문화 팩토리
export class PaladinSpecializationFactory {
  static create(paladin, spec) {
    switch(spec) {
      case 'holy':
        return new HolyPaladin(paladin);
      case 'protection':
        return new ProtectionPaladin(paladin);
      case 'retribution':
        return new RetributionPaladin(paladin);
      default:
        throw new Error(`Unknown paladin specialization: ${spec}`);
    }
  }
}

export { HolyPaladin, ProtectionPaladin, RetributionPaladin };