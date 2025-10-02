/**
 * Warrior Specializations
 * 11.2 The War Within
 *
 * 전사 전문화 상세 구현
 * - Arms (무기)
 * - Fury (분노)
 * - Protection (방어)
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
  ABILITY_CATEGORY
} from '../core/Constants.js';

/**
 * Arms Warrior Specialization
 * 무기 전사 - 양손 무기 전문, 전술적 전투
 */
class ArmsWarrior extends Specialization {
  constructor(warrior) {
    super(warrior, 'arms');

    this.role = 'dps';
    this.masteryName = '심층 상처';
    this.masteryEffect = 0.28; // 출혈 데미지 28% 증가

    // Arms 고유 메커니즘
    this.colossusSmash = {
      active: false,
      duration: 0,
      target: null
    };

    this.testOfMight = {
      active: false,
      stacks: 0,
      maxStacks: 10,
      strengthBonus: 0
    };

    this.bladestorm = {
      active: false,
      channeling: false,
      duration: 0
    };

    // 분쇄 효과 추적
    this.rend = new Map(); // 대상별 분쇄 DoT
    this.deepWounds = new Map(); // 대상별 심층 상처

    this.initializeAbilities();
    this.initializeTalents();
    this.initializeRotation();
  }

  initializeAbilities() {
    // 죽음의 일격
    this.abilities.set('mortal_strike', {
      name: '죽음의 일격',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 30 },
      cooldown: 6,
      castTime: 0,
      gcd: 1.5,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 2.24,
        criticalStrike: 2.0
      },
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 15000,
          coefficients: this.abilities.get('mortal_strike').coefficients,
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'mortal_strike');

        // 죽음의 상처 디버프
        this.applyDebuff(target, new Debuff({
          name: '죽음의 상처',
          duration: 10,
          type: DEBUFF_TYPE.PHYSICAL,
          stacks: 1,
          maxStacks: 3,
          effect: (target) => {
            target.healingTakenModifier *= 0.75; // 치유 25% 감소
          },
          onExpire: (target) => {
            target.healingTakenModifier /= 0.75;
          }
        }));

        // 심층 상처 적용
        this.applyDeepWounds(target, damage * 0.5);

        // 돌진 재사용 대기시간 감소
        if (this.talents.has('in_for_the_kill')) {
          this.reduceCooldown('charge', 1);
        }

        return true;
      }
    });

    // 거인의 강타
    this.abilities.set('colossus_smash', {
      name: '거인의 강타',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 0 },
      cooldown: 45,
      castTime: 0,
      gcd: 1.5,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 1.6
      },
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 10000,
          coefficients: this.abilities.get('colossus_smash').coefficients,
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'colossus_smash');

        // 거인의 강타 디버프
        const debuff = new Debuff({
          name: '거인의 강타',
          duration: 10,
          type: DEBUFF_TYPE.PHYSICAL,
          effect: (target) => {
            target.armorIgnore = 0.3; // 30% 방어도 무시
          },
          onExpire: (target) => {
            target.armorIgnore = 0;
          }
        });

        this.applyDebuff(target, debuff);

        this.colossusSmash = {
          active: true,
          duration: 10,
          target: target
        };

        // 힘의 시험 활성화
        if (this.talents.has('test_of_might')) {
          this.activateTestOfMight();
        }

        // 거인의 힘 특성
        if (this.talents.has('colossus_might')) {
          this.generateRage(20);
        }

        return true;
      }
    });

    // 휩쓸기
    this.abilities.set('sweeping_strikes', {
      name: '휩쓸기',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 0 },
      cooldown: 30,
      castTime: 0,
      gcd: 0,
      duration: 15,
      execute: () => {
        this.applyBuff(new Buff({
          name: '휩쓸기',
          duration: 15,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            // 단일 대상 공격이 주변 대상에도 적용
            this.sweepingStrikes = true;
          },
          onExpire: () => {
            this.sweepingStrikes = false;
          }
        }));

        return true;
      }
    });

    // 압도
    this.abilities.set('overpower', {
      name: '압도',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 0 },
      charges: 2,
      maxCharges: 2,
      cooldown: 12,
      castTime: 0,
      gcd: 1.5,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 1.4
      },
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 8000,
          coefficients: this.abilities.get('overpower').coefficients,
          type: DAMAGE_TYPE.PHYSICAL
        });

        // 압도 강화 버프가 있으면 데미지 증가
        if (this.buffs.has('overpower_proc')) {
          damage *= 1.5;
          this.consumeBuff('overpower_proc');
        }

        this.dealDamage(target, damage, 'overpower');

        // 압도 버프 (힘 증가)
        this.applyBuff(new Buff({
          name: '압도',
          duration: 15,
          stacks: 1,
          maxStacks: 2,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            this.stats[STAT_TYPE.STRENGTH] += 100;
          },
          onExpire: () => {
            this.stats[STAT_TYPE.STRENGTH] -= 100;
          },
          onStack: (stacks) => {
            this.stats[STAT_TYPE.STRENGTH] = this.baseStats[STAT_TYPE.STRENGTH] + (100 * stacks);
          }
        }));

        // 드레드노트 특성
        if (this.talents.has('dreadnaught')) {
          this.generateRage(10);
        }

        return true;
      }
    });

    // 칼날폭풍
    this.abilities.set('bladestorm', {
      name: '칼날폭풍',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 0 },
      cooldown: 90,
      channelTime: 6,
      tickRate: 1,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 0.8
      },
      execute: () => {
        this.bladestorm.active = true;
        this.bladestorm.channeling = true;
        this.bladestorm.duration = 6;

        // 칼날폭풍 버프
        this.applyBuff(new Buff({
          name: '칼날폭풍',
          duration: 6,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            // 이동 불가 효과 면역
            this.immuneToSlows = true;
            this.immuneToRoots = true;
          },
          onExpire: () => {
            this.immuneToSlows = false;
            this.immuneToRoots = false;
            this.bladestorm.active = false;
            this.bladestorm.channeling = false;
          }
        }));

        // 채널링 시작
        this.startChannel({
          duration: 6,
          tickRate: 1,
          onTick: () => {
            const enemies = this.getEnemiesInRadius(8);
            enemies.forEach(enemy => {
              const damage = this.calculateDamage({
                base: 6000,
                coefficients: this.abilities.get('bladestorm').coefficients,
                type: DAMAGE_TYPE.PHYSICAL
              });

              this.dealDamage(enemy, damage, 'bladestorm');

              // 폭풍의 눈 특성
              if (this.talents.has('eye_of_the_storm') && enemies.length >= 3) {
                this.generateRage(5);
              }
            });
          },
          onComplete: () => {
            this.bladestorm.active = false;
            this.bladestorm.channeling = false;
          }
        });

        return true;
      }
    });

    // 분쇄
    this.abilities.set('rend', {
      name: '분쇄',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 20 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      school: DAMAGE_TYPE.BLEED,
      coefficients: {
        attackPower: 0.36
      },
      execute: (target) => {
        const tickDamage = this.calculateDamage({
          base: 2000,
          coefficients: this.abilities.get('rend').coefficients,
          type: DAMAGE_TYPE.BLEED
        });

        const debuff = new Debuff({
          name: '분쇄',
          duration: 15,
          type: DEBUFF_TYPE.BLEED,
          tickRate: 3,
          onTick: (target) => {
            this.dealDamage(target, tickDamage, 'rend');

            // 피의 욕조 특성
            if (this.talents.has('bloodbath') && Math.random() < 0.1) {
              const nearbyEnemies = this.getEnemiesInRadius(8, target);
              nearbyEnemies.forEach(enemy => {
                if (!enemy.hasDebuff('분쇄')) {
                  this.abilities.get('rend').execute(enemy);
                }
              });
            }
          }
        });

        this.applyDebuff(target, debuff);
        this.rend.set(target.id, debuff);

        return true;
      }
    });

    // 처형
    this.abilities.set('execute_arms', {
      name: '처형',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 20 },
      maxRage: 40, // 최대 40 분노 소모
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 2.8,
        rageScaling: 0.04 // 추가 분노당 4% 데미지 증가
      },
      requirement: (target) => {
        return target.healthPercent <= 35 || this.buffs.has('sudden_death');
      },
      execute: (target) => {
        // 사용 가능한 모든 분노 소모 (최대 40)
        const availableRage = Math.min(this.resources[RESOURCE_TYPE.RAGE], 40);
        const extraRage = availableRage - 20;

        if (!this.spendResource(RESOURCE_TYPE.RAGE, availableRage)) {
          return false;
        }

        let damage = this.calculateDamage({
          base: 20000,
          coefficients: this.abilities.get('execute_arms').coefficients,
          type: DAMAGE_TYPE.PHYSICAL
        });

        // 추가 분노로 데미지 증가
        damage *= (1 + (extraRage * 0.04));

        // 거인의 강타 중이면 데미지 증가
        if (this.colossusSmash.active && this.colossusSmash.target === target) {
          damage *= 1.5;
        }

        // 돌연한 죽음 버프
        if (this.buffs.has('sudden_death')) {
          damage *= 1.25;
          this.consumeBuff('sudden_death');
        }

        this.dealDamage(target, damage, 'execute');

        // 학살자 특성
        if (this.talents.has('massacre')) {
          // 35% -> 35% 체력 이하에서 사용 가능
          this.generateRage(20);
        }

        // 처형자의 정밀함 특성
        if (this.talents.has('executioners_precision')) {
          this.applyBuff(new Buff({
            name: '처형자의 정밀함',
            duration: 10,
            stacks: 1,
            maxStacks: 2,
            type: BUFF_TYPE.PHYSICAL,
            effect: () => {
              this.stats[STAT_TYPE.CRITICAL] += 10;
            },
            onExpire: () => {
              this.stats[STAT_TYPE.CRITICAL] -= 10;
            }
          }));
        }

        return true;
      }
    });

    // 전투의 군주
    this.abilities.set('warbreaker', {
      name: '전투의 군주',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 0 },
      cooldown: 45,
      castTime: 0,
      gcd: 1.5,
      radius: 8,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 2.0
      },
      execute: (targetPosition) => {
        const enemies = this.getEnemiesInRadius(8, targetPosition);

        enemies.forEach(enemy => {
          const damage = this.calculateDamage({
            base: 12000,
            coefficients: this.abilities.get('warbreaker').coefficients,
            type: DAMAGE_TYPE.PHYSICAL
          });

          this.dealDamage(enemy, damage, 'warbreaker');

          // 거인의 강타 효과 적용
          this.applyDebuff(enemy, new Debuff({
            name: '전투의 군주',
            duration: 10,
            type: DEBUFF_TYPE.PHYSICAL,
            effect: (target) => {
              target.armorIgnore = 0.3;
            },
            onExpire: (target) => {
              target.armorIgnore = 0;
            }
          }));
        });

        // 힘의 시험 활성화
        if (this.talents.has('test_of_might')) {
          this.activateTestOfMight();
        }

        return true;
      }
    });

    // 치명타의 일격
    this.abilities.set('deadly_calm', {
      name: '치명적인 고요',
      cooldown: 60,
      castTime: 0,
      gcd: 0,
      duration: 6,
      execute: () => {
        this.applyBuff(new Buff({
          name: '치명적인 고요',
          duration: 6,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            // 모든 능력이 분노를 소모하지 않음
            this.rageFree = true;
            // 분노 생성량 3배
            this.rageGenModifier = 3;
          },
          onExpire: () => {
            this.rageFree = false;
            this.rageGenModifier = 1;
          }
        }));

        return true;
      }
    });
  }

  initializeTalents() {
    this.talentTree = new TalentTree();

    // 클래스 특성
    this.talentTree.addTalent(new Talent({
      name: '전쟁 기계',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '자동 공격이 10% 확률로 분노 10 생성',
      effect: () => {
        this.onAutoAttack = (damage) => {
          if (Math.random() < 0.1) {
            this.generateRage(10);
          }
        };
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '이중 시간',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '돌진 충전 횟수 1 증가',
      effect: () => {
        this.abilities.get('charge').maxCharges = 2;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '폭풍의 화살',
      tier: 2,
      maxRank: 1,
      type: 'ability',
      description: '원거리 공격, 감속 효과',
      cooldown: 30,
      learn: () => {
        this.abilities.set('storm_bolt', {
          name: '폭풍의 화살',
          cost: { type: RESOURCE_TYPE.RAGE, amount: 20 },
          cooldown: 30,
          range: 20,
          castTime: 0,
          gcd: 1.5,
          execute: (target) => {
            const damage = this.calculateDamage({
              base: 8000,
              coefficients: { attackPower: 1.0 },
              type: DAMAGE_TYPE.PHYSICAL
            });

            this.dealDamage(target, damage, 'storm_bolt');

            this.applyDebuff(target, new Debuff({
              name: '폭풍의 화살',
              duration: 4,
              type: DEBUFF_TYPE.STUN
            }));

            return true;
          }
        });
      }
    }));

    // 무기 전문화 특성
    this.talentTree.addTalent(new Talent({
      name: '힘의 시험',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '거인의 강타 후 10초간 힘 증가',
      effect: () => {
        this.talents.set('test_of_might', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '거인의 힘',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '거인의 강타가 분노 20 생성',
      effect: () => {
        this.talents.set('colossus_might', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '급소 가격',
      tier: 4,
      maxRank: 2,
      type: 'passive',
      description: '죽음의 일격과 처형 치명타율 10% 증가',
      effect: (rank) => {
        this.abilities.get('mortal_strike').critBonus = 10 * rank;
        this.abilities.get('execute_arms').critBonus = 10 * rank;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '학살자',
      tier: 4,
      maxRank: 1,
      type: 'passive',
      description: '처형을 체력 35% 이하에서 사용 가능',
      effect: () => {
        this.talents.set('massacre', true);
        this.abilities.get('execute_arms').requirement = (target) => {
          return target.healthPercent <= 35 || this.buffs.has('sudden_death');
        };
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '드레드노트',
      tier: 5,
      maxRank: 1,
      type: 'passive',
      description: '압도가 분노 10 생성, 충전 시간 2초 감소',
      effect: () => {
        this.talents.set('dreadnaught', true);
        this.abilities.get('overpower').cooldown = 10;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '피의 욕조',
      tier: 5,
      maxRank: 1,
      type: 'passive',
      description: '분쇄 틱마다 10% 확률로 주변 적에게 분쇄 확산',
      effect: () => {
        this.talents.set('bloodbath', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '분신참격',
      tier: 6,
      maxRank: 1,
      type: 'ability',
      description: '대상과 위치를 바꾸며 공격',
      cooldown: 90,
      learn: () => {
        this.abilities.set('ravager', {
          name: '분신참격',
          cooldown: 90,
          castTime: 0,
          gcd: 1.5,
          execute: (target) => {
            // 위치 교환
            const tempPos = { ...this.position };
            this.position = { ...target.position };
            target.position = tempPos;

            // 무기 소환
            this.summonRavager(this.position);

            return true;
          }
        });
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '폭풍의 눈',
      tier: 6,
      maxRank: 1,
      type: 'passive',
      description: '칼날폭풍이 3명 이상 타격시 틱당 분노 5 생성',
      effect: () => {
        this.talents.set('eye_of_the_storm', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '불굴의 의지',
      tier: 7,
      maxRank: 1,
      type: 'ability',
      description: '10초간 데미지 20% 감소',
      cooldown: 180,
      learn: () => {
        this.abilities.set('die_by_the_sword', {
          name: '투사의 혼',
          cooldown: 180,
          castTime: 0,
          gcd: 0,
          execute: () => {
            this.applyBuff(new Buff({
              name: '투사의 혼',
              duration: 8,
              type: BUFF_TYPE.DEFENSIVE,
              effect: () => {
                this.damageReduction = 0.3;
                this.parryChance += 100; // 100% 무기 막기
              },
              onExpire: () => {
                this.damageReduction = 0;
                this.parryChance -= 100;
              }
            }));

            return true;
          }
        });
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '검투사의 결의',
      tier: 7,
      maxRank: 1,
      type: 'passive',
      description: '체력이 35% 이하일 때 받는 피해 20% 감소',
      effect: () => {
        this.onDamageTaken = (damage) => {
          if (this.healthPercent <= 35) {
            return damage * 0.8;
          }
          return damage;
        };
      }
    }));
  }

  initializeRotation() {
    // Arms 우선순위 로테이션
    this.rotationPriority = [
      {
        ability: 'colossus_smash',
        condition: (target) => {
          return !target.hasDebuff('거인의 강타') &&
                 !target.hasDebuff('전투의 군주');
        }
      },
      {
        ability: 'warbreaker',
        condition: (target) => {
          return this.talents.has('warbreaker') &&
                 !target.hasDebuff('거인의 강타') &&
                 !target.hasDebuff('전투의 군주');
        }
      },
      {
        ability: 'mortal_strike',
        condition: (target) => {
          return true; // 항상 우선순위
        }
      },
      {
        ability: 'execute_arms',
        condition: (target) => {
          return target.healthPercent <= 20 ||
                 (this.talents.has('massacre') && target.healthPercent <= 35) ||
                 this.buffs.has('sudden_death');
        }
      },
      {
        ability: 'bladestorm',
        condition: (target) => {
          const enemies = this.getEnemiesInRadius(8);
          return enemies.length >= 2 && !this.bladestorm.channeling;
        }
      },
      {
        ability: 'overpower',
        condition: (target) => {
          return this.abilities.get('overpower').currentCharges > 0;
        }
      },
      {
        ability: 'rend',
        condition: (target) => {
          return !target.hasDebuff('분쇄') ||
                 target.getDebuffDuration('분쇄') < 4;
        }
      },
      {
        ability: 'sweeping_strikes',
        condition: (target) => {
          const enemies = this.getEnemiesInRadius(8);
          return enemies.length >= 2 && !this.buffs.has('휩쓸기');
        }
      },
      {
        ability: 'slam',
        condition: (target) => {
          return this.resources[RESOURCE_TYPE.RAGE] >= 60;
        }
      }
    ];
  }

  // 심층 상처 적용
  applyDeepWounds(target, damage) {
    const tickDamage = damage * this.masteryEffect;

    const debuff = new Debuff({
      name: '심층 상처',
      duration: 12,
      type: DEBUFF_TYPE.BLEED,
      tickRate: 2,
      onTick: (target) => {
        this.dealDamage(target, tickDamage / 6, 'deep_wounds');
      }
    });

    this.applyDebuff(target, debuff);
    this.deepWounds.set(target.id, debuff);
  }

  // 힘의 시험 활성화
  activateTestOfMight() {
    this.testOfMight.active = true;
    this.testOfMight.stacks = 0;

    this.applyBuff(new Buff({
      name: '힘의 시험',
      duration: 10,
      type: BUFF_TYPE.PHYSICAL,
      onDamageDealt: (damage) => {
        // 데미지를 줄 때마다 스택 증가
        if (this.testOfMight.stacks < this.testOfMight.maxStacks) {
          this.testOfMight.stacks++;
          this.testOfMight.strengthBonus = this.testOfMight.stacks * 50;
          this.stats[STAT_TYPE.STRENGTH] += 50;
        }
      },
      onExpire: () => {
        this.stats[STAT_TYPE.STRENGTH] -= this.testOfMight.strengthBonus;
        this.testOfMight.active = false;
        this.testOfMight.stacks = 0;
        this.testOfMight.strengthBonus = 0;
      }
    }));
  }

  // 돌연한 죽음 발동 확인
  checkSuddenDeath() {
    // 자동 공격시 일정 확률로 돌연한 죽음 발동
    if (Math.random() < 0.05) { // 5% 확률
      this.applyBuff(new Buff({
        name: '돌연한 죽음',
        duration: 10,
        type: BUFF_TYPE.PHYSICAL,
        effect: () => {
          // 처형을 체력 제한 없이 사용 가능
        }
      }));
    }
  }

  update(deltaTime) {
    super.update(deltaTime);

    // 거인의 강타 지속시간 업데이트
    if (this.colossusSmash.active) {
      this.colossusSmash.duration -= deltaTime;
      if (this.colossusSmash.duration <= 0) {
        this.colossusSmash.active = false;
        this.colossusSmash.target = null;
      }
    }

    // 칼날폭풍 업데이트
    if (this.bladestorm.active) {
      this.bladestorm.duration -= deltaTime;
      if (this.bladestorm.duration <= 0) {
        this.bladestorm.active = false;
        this.bladestorm.channeling = false;
      }
    }

    // 출혈 효과 정리
    this.rend.forEach((debuff, targetId) => {
      if (!debuff.active) {
        this.rend.delete(targetId);
      }
    });

    this.deepWounds.forEach((debuff, targetId) => {
      if (!debuff.active) {
        this.deepWounds.delete(targetId);
      }
    });
  }
}

/**
 * Fury Warrior Specialization
 * 분노 전사 - 쌍수 무기, 광폭한 전투
 */
class FuryWarrior extends Specialization {
  constructor(warrior) {
    super(warrior, 'fury');

    this.role = 'dps';
    this.masteryName = '억제되지 않는 분노';
    this.masteryEffect = 0.18; // 격노 중 데미지 18% 증가

    // Fury 고유 메커니즘
    this.rampage = {
      active: false,
      duration: 0,
      stacks: 0
    };

    this.enrage = {
      active: false,
      duration: 0,
      hasteBonus: 25
    };

    this.whirlwind = {
      nextAbilitiesCleave: 0,
      maxCleaveTargets: 4
    };

    this.recklessness = {
      active: false,
      duration: 0,
      critBonus: 20
    };

    // 쌍수 무기 시스템
    this.mainHand = {
      damage: 12000,
      speed: 2.6
    };

    this.offHand = {
      damage: 12000,
      speed: 2.6
    };

    this.initializeAbilities();
    this.initializeTalents();
    this.initializeRotation();
  }

  initializeAbilities() {
    // 광란
    this.abilities.set('rampage', {
      name: '광란',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 80 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      hits: 4,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 0.72
      },
      execute: (target) => {
        // 4회 타격
        let totalDamage = 0;
        for (let i = 0; i < 4; i++) {
          const damage = this.calculateDamage({
            base: 4000,
            coefficients: this.abilities.get('rampage').coefficients,
            type: DAMAGE_TYPE.PHYSICAL,
            weapon: i % 2 === 0 ? 'mainhand' : 'offhand'
          });

          this.dealDamage(target, damage, 'rampage');
          totalDamage += damage;
        }

        // 격노 발동
        this.triggerEnrage(4);

        // 광란 버프
        this.applyBuff(new Buff({
          name: '광란',
          duration: 2,
          type: BUFF_TYPE.PHYSICAL,
          stacks: 1,
          maxStacks: 10,
          effect: () => {
            this.stats[STAT_TYPE.HASTE] += 2;
          },
          onExpire: () => {
            this.stats[STAT_TYPE.HASTE] -= 2 * this.getBuffStacks('광란');
          },
          onStack: (stacks) => {
            this.stats[STAT_TYPE.HASTE] = this.baseStats[STAT_TYPE.HASTE] + (2 * stacks);
          }
        }));

        // 소용돌이 버프가 있으면 광역
        if (this.whirlwind.nextAbilitiesCleave > 0) {
          this.cleaveNearbyEnemies(target, totalDamage * 0.45, 'rampage_cleave');
          this.whirlwind.nextAbilitiesCleave--;
        }

        return true;
      }
    });

    // 격돌
    this.abilities.set('bloodthirst', {
      name: '피의 갈증',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 0 },
      cooldown: 4.5,
      castTime: 0,
      gcd: 1.5,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 0.95
      },
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 7000,
          coefficients: this.abilities.get('bloodthirst').coefficients,
          type: DAMAGE_TYPE.PHYSICAL,
          weapon: 'mainhand'
        });

        const isCrit = this.rollCritical(damage);
        this.dealDamage(target, damage, 'bloodthirst');

        // 치명타시 격노 발동
        if (isCrit) {
          this.triggerEnrage(4);
        }

        // 자가 치유
        const healing = damage * 0.1;
        this.heal(healing);

        // 신선한 고기 특성
        if (this.talents.has('fresh_meat')) {
          this.applyBuff(new Buff({
            name: '신선한 고기',
            duration: 15,
            stacks: 1,
            maxStacks: 2,
            type: BUFF_TYPE.PHYSICAL,
            effect: () => {
              this.abilities.get('bloodthirst').critBonus = 15;
            },
            onExpire: () => {
              this.abilities.get('bloodthirst').critBonus = 0;
            }
          }));
        }

        // 소용돌이 버프가 있으면 광역
        if (this.whirlwind.nextAbilitiesCleave > 0) {
          this.cleaveNearbyEnemies(target, damage * 0.45, 'bloodthirst_cleave');
          this.whirlwind.nextAbilitiesCleave--;
        }

        return true;
      }
    });

    // 성난 타격
    this.abilities.set('raging_blow', {
      name: '성난 타격',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 0 },
      charges: 2,
      maxCharges: 2,
      cooldown: 8,
      castTime: 0,
      gcd: 1.5,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 1.2
      },
      requirement: () => {
        return this.enrage.active || this.buffs.has('격노');
      },
      execute: (target) => {
        // 양손 공격
        const mainHandDamage = this.calculateDamage({
          base: 8000,
          coefficients: this.abilities.get('raging_blow').coefficients,
          type: DAMAGE_TYPE.PHYSICAL,
          weapon: 'mainhand'
        });

        const offHandDamage = this.calculateDamage({
          base: 8000,
          coefficients: { attackPower: 0.6 },
          type: DAMAGE_TYPE.PHYSICAL,
          weapon: 'offhand'
        });

        this.dealDamage(target, mainHandDamage, 'raging_blow_main');
        this.dealDamage(target, offHandDamage, 'raging_blow_off');

        // 격노 연장
        if (this.enrage.active) {
          this.enrage.duration += 1;
        }

        // 소용돌이 버프가 있으면 광역
        if (this.whirlwind.nextAbilitiesCleave > 0) {
          this.cleaveNearbyEnemies(target, (mainHandDamage + offHandDamage) * 0.45, 'raging_blow_cleave');
          this.whirlwind.nextAbilitiesCleave--;
        }

        return true;
      }
    });

    // 소용돌이
    this.abilities.set('whirlwind', {
      name: '소용돌이',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 0 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      radius: 8,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 0.45
      },
      execute: () => {
        const enemies = this.getEnemiesInRadius(8);

        // 최대 5명까지 타격
        const targets = enemies.slice(0, 5);
        targets.forEach((enemy, index) => {
          const damage = this.calculateDamage({
            base: 3000,
            coefficients: this.abilities.get('whirlwind').coefficients,
            type: DAMAGE_TYPE.PHYSICAL,
            weapon: 'mainhand'
          });

          // 첫 번째 대상은 100%, 나머지는 40% 데미지
          const finalDamage = index === 0 ? damage : damage * 0.4;
          this.dealDamage(enemy, finalDamage, 'whirlwind');
        });

        // 다음 2개 능력에 광역 효과 부여
        this.whirlwind.nextAbilitiesCleave = 2;

        // 소용돌이 광기 특성
        if (this.talents.has('meat_cleaver')) {
          this.whirlwind.nextAbilitiesCleave = 4;
        }

        return true;
      }
    });

    // 분노의 강타
    this.abilities.set('execute_fury', {
      name: '처형',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 20 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 2.0
      },
      requirement: (target) => {
        return target.healthPercent <= 20 || this.buffs.has('sudden_death');
      },
      execute: (target) => {
        // 양손 처형
        const mainHandDamage = this.calculateDamage({
          base: 15000,
          coefficients: this.abilities.get('execute_fury').coefficients,
          type: DAMAGE_TYPE.PHYSICAL,
          weapon: 'mainhand'
        });

        const offHandDamage = this.calculateDamage({
          base: 15000,
          coefficients: { attackPower: 1.0 },
          type: DAMAGE_TYPE.PHYSICAL,
          weapon: 'offhand'
        });

        this.dealDamage(target, mainHandDamage, 'execute_main');
        this.dealDamage(target, offHandDamage, 'execute_off');

        // 격노 중이면 무료
        if (this.enrage.active) {
          this.generateRage(20); // 분노 반환
        }

        // 소용돌이 버프가 있으면 광역
        if (this.whirlwind.nextAbilitiesCleave > 0) {
          this.cleaveNearbyEnemies(target, (mainHandDamage + offHandDamage) * 0.45, 'execute_cleave');
          this.whirlwind.nextAbilitiesCleave--;
        }

        // 학살 특성
        if (this.talents.has('massacre')) {
          this.triggerEnrage(3);
        }

        return true;
      }
    });

    // 무모한 희생
    this.abilities.set('recklessness', {
      name: '무모한 희생',
      cooldown: 90,
      castTime: 0,
      gcd: 0,
      duration: 10,
      execute: () => {
        this.recklessness.active = true;
        this.recklessness.duration = 10;

        this.applyBuff(new Buff({
          name: '무모한 희생',
          duration: 10,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            this.stats[STAT_TYPE.CRITICAL] += 20;
            this.rageGenModifier = 2; // 분노 생성 2배
          },
          onExpire: () => {
            this.stats[STAT_TYPE.CRITICAL] -= 20;
            this.rageGenModifier = 1;
            this.recklessness.active = false;
          }
        }));

        // 격노 즉시 발동
        this.triggerEnrage(10);

        // 무모한 포기 특성
        if (this.talents.has('reckless_abandon')) {
          this.generateRage(50);
        }

        return true;
      }
    });

    // 오딘의 격노
    this.abilities.set('odyn_fury', {
      name: '오딘의 격노',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 0 },
      cooldown: 45,
      castTime: 0,
      gcd: 1.5,
      radius: 12,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 4.0
      },
      execute: () => {
        const enemies = this.getEnemiesInRadius(12);

        enemies.forEach(enemy => {
          const damage = this.calculateDamage({
            base: 25000,
            coefficients: this.abilities.get('odyn_fury').coefficients,
            type: DAMAGE_TYPE.PHYSICAL
          });

          this.dealDamage(enemy, damage, 'odyn_fury');

          // 출혈 효과
          this.applyDebuff(enemy, new Debuff({
            name: '오딘의 격노',
            duration: 6,
            type: DEBUFF_TYPE.BLEED,
            tickRate: 2,
            onTick: (target) => {
              const tickDamage = damage * 0.15;
              this.dealDamage(target, tickDamage, 'odyn_fury_bleed');
            }
          }));
        });

        return true;
      }
    });

    // 용맹의 함성
    this.abilities.set('dragon_roar', {
      name: '용의 포효',
      cooldown: 90,
      castTime: 0,
      gcd: 1.5,
      radius: 8,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 2.4
      },
      execute: () => {
        const enemies = this.getEnemiesInRadius(8);

        enemies.forEach(enemy => {
          const damage = this.calculateDamage({
            base: 18000,
            coefficients: this.abilities.get('dragon_roar').coefficients,
            type: DAMAGE_TYPE.PHYSICAL
          });

          this.dealDamage(enemy, damage, 'dragon_roar');

          // 감속 효과
          this.applyDebuff(enemy, new Debuff({
            name: '용의 포효',
            duration: 6,
            type: DEBUFF_TYPE.PHYSICAL,
            effect: (target) => {
              target.stats[STAT_TYPE.MOVEMENT_SPEED] *= 0.5;
            },
            onExpire: (target) => {
              target.stats[STAT_TYPE.MOVEMENT_SPEED] /= 0.5;
            }
          }));
        });

        // 격노 발동
        this.triggerEnrage(4);

        return true;
      }
    });
  }

  initializeTalents() {
    this.talentTree = new TalentTree();

    // 분노 특성
    this.talentTree.addTalent(new Talent({
      name: '전쟁의 함성',
      tier: 1,
      maxRank: 1,
      type: 'ability',
      description: '범위 공포 및 분노 생성',
      cooldown: 90,
      learn: () => {
        this.abilities.set('battle_cry', {
          name: '전투의 함성',
          cooldown: 90,
          castTime: 0,
          gcd: 0,
          execute: () => {
            // 범위 공포 제거
            const allies = this.getAlliesInRadius(40);
            allies.forEach(ally => {
              ally.removeDebuffByType(DEBUFF_TYPE.FEAR);

              // 분노 생성
              if (ally.class === 'warrior') {
                ally.generateRage(30);
              }
            });

            return true;
          }
        });
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '끝없는 분노',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '최대 분노 120으로 증가',
      effect: () => {
        this.resources.max[RESOURCE_TYPE.RAGE] = 120;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '신선한 고기',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '피의 갈증 치명타율 15% 증가',
      effect: () => {
        this.talents.set('fresh_meat', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '격분',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '광란이 즉시 최대 스택 부여',
      effect: () => {
        const originalRampage = this.abilities.get('rampage').execute;
        this.abilities.get('rampage').execute = (target) => {
          const result = originalRampage.call(this, target);
          if (result) {
            // 즉시 최대 스택
            for (let i = 1; i < 10; i++) {
              this.addBuffStack('광란');
            }
          }
          return result;
        };
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '고기 분쇄기',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '소용돌이가 다음 4개 능력을 광역화',
      effect: () => {
        this.talents.set('meat_cleaver', true);
        this.whirlwind.maxCleaveTargets = 8;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '학살',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '처형이 격노 3초 발동',
      effect: () => {
        this.talents.set('massacre', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '무모한 포기',
      tier: 4,
      maxRank: 1,
      type: 'passive',
      description: '무모한 희생이 분노 50 생성',
      effect: () => {
        this.talents.set('reckless_abandon', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '피에 젖은 광기',
      tier: 4,
      maxRank: 2,
      type: 'passive',
      description: '피의 갈증 데미지 15% 증가',
      effect: (rank) => {
        this.abilities.get('bloodthirst').damageBonus = 15 * rank;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '내면의 분노',
      tier: 5,
      maxRank: 1,
      type: 'passive',
      description: '격노 지속시간 1초 증가',
      effect: () => {
        this.enrage.baseDuration = 5; // 기본 4초 + 1초
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '피의 갈증',
      tier: 5,
      maxRank: 3,
      type: 'passive',
      description: '치명타시 생명력 3% 회복',
      effect: (rank) => {
        this.onCritical = (damage) => {
          const healing = this.maxHealth * (0.03 * rank);
          this.heal(healing);
        };
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '분노의 화신',
      tier: 6,
      maxRank: 1,
      type: 'ability',
      description: '거대화하여 데미지와 체력 증가',
      cooldown: 90,
      learn: () => {
        this.abilities.set('avatar', {
          name: '투신',
          cooldown: 90,
          castTime: 0,
          gcd: 0,
          execute: () => {
            this.applyBuff(new Buff({
              name: '투신',
              duration: 20,
              type: BUFF_TYPE.PHYSICAL,
              effect: () => {
                this.damageModifier = 1.2;
                this.maxHealth *= 1.2;
                this.currentHealth *= 1.2;
              },
              onExpire: () => {
                this.damageModifier = 1;
                this.maxHealth /= 1.2;
                this.currentHealth = Math.min(this.currentHealth, this.maxHealth);
              }
            }));

            return true;
          }
        });
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '지옥불 일격',
      tier: 7,
      maxRank: 1,
      type: 'ability',
      description: '강력한 불 데미지 일격',
      cooldown: 120,
      learn: () => {
        this.abilities.set('siegebreaker', {
          name: '공성 파괴자',
          cooldown: 30,
          castTime: 0,
          gcd: 1.5,
          execute: (target) => {
            const damage = this.calculateDamage({
              base: 30000,
              coefficients: { attackPower: 3.2 },
              type: DAMAGE_TYPE.PHYSICAL
            });

            this.dealDamage(target, damage, 'siegebreaker');

            // 취약 효과
            this.applyDebuff(target, new Debuff({
              name: '공성 파괴자',
              duration: 10,
              type: DEBUFF_TYPE.PHYSICAL,
              effect: (target) => {
                target.damageTakenModifier = 1.15;
              },
              onExpire: (target) => {
                target.damageTakenModifier = 1.0;
              }
            }));

            // 격노 발동
            this.triggerEnrage(4);

            return true;
          }
        });
      }
    }));
  }

  initializeRotation() {
    // Fury 우선순위 로테이션
    this.rotationPriority = [
      {
        ability: 'rampage',
        condition: () => {
          return this.resources[RESOURCE_TYPE.RAGE] >= 80;
        }
      },
      {
        ability: 'execute_fury',
        condition: (target) => {
          return (target.healthPercent <= 20 || this.buffs.has('sudden_death')) &&
                 (this.enrage.active || this.resources[RESOURCE_TYPE.RAGE] >= 20);
        }
      },
      {
        ability: 'siegebreaker',
        condition: (target) => {
          return this.talents.has('siegebreaker') &&
                 this.abilities.get('siegebreaker').isReady();
        }
      },
      {
        ability: 'raging_blow',
        condition: () => {
          return this.enrage.active &&
                 this.abilities.get('raging_blow').currentCharges > 0;
        }
      },
      {
        ability: 'bloodthirst',
        condition: () => {
          return !this.enrage.active || this.enrage.duration < 1;
        }
      },
      {
        ability: 'whirlwind',
        condition: () => {
          const enemies = this.getEnemiesInRadius(8);
          return enemies.length >= 2 && this.whirlwind.nextAbilitiesCleave === 0;
        }
      },
      {
        ability: 'dragon_roar',
        condition: () => {
          return this.talents.has('dragon_roar') &&
                 this.abilities.get('dragon_roar').isReady();
        }
      },
      {
        ability: 'odyn_fury',
        condition: () => {
          const enemies = this.getEnemiesInRadius(12);
          return enemies.length >= 3;
        }
      }
    ];
  }

  // 격노 발동
  triggerEnrage(duration) {
    const baseDuration = this.talents.has('inner_rage') ? 5 : 4;
    const totalDuration = baseDuration + (duration || 0);

    this.enrage.active = true;
    this.enrage.duration = totalDuration;

    this.applyBuff(new Buff({
      name: '격노',
      duration: totalDuration,
      type: BUFF_TYPE.PHYSICAL,
      effect: () => {
        this.stats[STAT_TYPE.HASTE] += this.enrage.hasteBonus;
        this.damageModifier *= (1 + this.masteryEffect);
      },
      onExpire: () => {
        this.stats[STAT_TYPE.HASTE] -= this.enrage.hasteBonus;
        this.damageModifier /= (1 + this.masteryEffect);
        this.enrage.active = false;
        this.enrage.duration = 0;
      }
    }));
  }

  // 광역 공격
  cleaveNearbyEnemies(primaryTarget, damage, source) {
    const enemies = this.getEnemiesInRadius(8, primaryTarget);
    const cleaveTargets = enemies
      .filter(e => e !== primaryTarget)
      .slice(0, this.whirlwind.maxCleaveTargets);

    cleaveTargets.forEach(enemy => {
      this.dealDamage(enemy, damage, `${source}_cleave`);
    });
  }

  update(deltaTime) {
    super.update(deltaTime);

    // 격노 지속시간 업데이트
    if (this.enrage.active) {
      this.enrage.duration -= deltaTime;
      if (this.enrage.duration <= 0) {
        this.enrage.active = false;
      }
    }

    // 무모한 희생 지속시간 업데이트
    if (this.recklessness.active) {
      this.recklessness.duration -= deltaTime;
      if (this.recklessness.duration <= 0) {
        this.recklessness.active = false;
      }
    }
  }
}

/**
 * Protection Warrior Specialization
 * 방어 전사 - 탱킹 전문
 */
class ProtectionWarrior extends Specialization {
  constructor(warrior) {
    super(warrior, 'protection');

    this.role = 'tank';
    this.masteryName = '치명적인 방어';
    this.masteryEffect = 0.08; // 공격력 8%, 방어도 8% 증가

    // Protection 고유 메커니즘
    this.shieldBlock = {
      active: false,
      duration: 0,
      charges: 2,
      maxCharges: 2,
      blockValue: 100 // 100% 방패막기
    };

    this.ignore = {
      active: false,
      duration: 0,
      maxIgnore: 0.5, // 최대 50% 무시
      currentIgnore: 0
    };

    this.revenge = {
      procActive: false,
      freeCast: false
    };

    this.lastStand = {
      active: false,
      healthBonus: 0
    };

    // 방패 정보
    this.shield = {
      blockChance: 30,
      blockValue: 30,
      armor: 5000
    };

    // 위협 수준 관리
    this.threatModifier = 5.0; // 탱킹 자세 위협 수준 5배

    this.initializeAbilities();
    this.initializeTalents();
    this.initializeRotation();
  }

  initializeAbilities() {
    // 방패 밀쳐내기
    this.abilities.set('shield_slam', {
      name: '방패 밀쳐내기',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 15 },
      cooldown: 9,
      castTime: 0,
      gcd: 1.5,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 1.5,
        armor: 0.3 // 방어도 계수
      },
      execute: (target) => {
        const armorBonus = this.stats[STAT_TYPE.ARMOR] * 0.3;
        const damage = this.calculateDamage({
          base: 12000 + armorBonus,
          coefficients: this.abilities.get('shield_slam').coefficients,
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'shield_slam');

        // 위협 수준 추가
        this.generateThreat(target, damage * 2);

        // 격돌 재설정 확률
        if (Math.random() < 0.3) {
          this.abilities.get('shield_block').resetCooldown();
        }

        // 무시 충전
        if (this.buffs.has('무시')) {
          this.ignore.currentIgnore = Math.min(
            this.ignore.currentIgnore + 0.1,
            this.ignore.maxIgnore
          );
        }

        // 처벌자 특성
        if (this.talents.has('punish')) {
          this.applyDebuff(target, new Debuff({
            name: '처벌',
            duration: 9,
            stacks: 1,
            maxStacks: 3,
            type: DEBUFF_TYPE.PHYSICAL,
            effect: (target) => {
              target.damageTakenModifier = 1.03;
            },
            onExpire: (target) => {
              target.damageTakenModifier = 1.0;
            }
          }));
        }

        return true;
      }
    });

    // 복수
    this.abilities.set('revenge', {
      name: '복수',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 20 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      radius: 5,
      school: DAMAGE_TYPE.PHYSICAL,
      coefficients: {
        attackPower: 0.8
      },
      execute: () => {
        const enemies = this.getEnemiesInRadius(5);
        const baseDamage = this.revenge.procActive ? 15000 : 8000;

        // 무료 시전 체크
        if (this.revenge.freeCast) {
          this.revenge.freeCast = false;
        } else if (!this.spendResource(RESOURCE_TYPE.RAGE, 20)) {
          return false;
        }

        enemies.forEach((enemy, index) => {
          const damage = this.calculateDamage({
            base: baseDamage,
            coefficients: this.abilities.get('revenge').coefficients,
            type: DAMAGE_TYPE.PHYSICAL
          });

          // 첫 번째 대상 100%, 나머지 50%
          const finalDamage = index === 0 ? damage : damage * 0.5;
          this.dealDamage(enemy, finalDamage, 'revenge');
          this.generateThreat(enemy, finalDamage * 3);
        });

        this.revenge.procActive = false;

        // 최선의 방어 특성
        if (this.talents.has('best_defense')) {
          this.generateRage(10);
        }

        return true;
      }
    });

    // 방패 막기
    this.abilities.set('shield_block', {
      name: '방패 막기',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 30 },
      charges: 2,
      maxCharges: 2,
      cooldown: 16,
      castTime: 0,
      gcd: 0,
      duration: 6,
      execute: () => {
        this.shieldBlock.active = true;
        this.shieldBlock.duration = 6;

        this.applyBuff(new Buff({
          name: '방패 막기',
          duration: 6,
          type: BUFF_TYPE.DEFENSIVE,
          effect: () => {
            // 100% 방패막기 확률
            this.shield.blockChance = 100;

            // 방패막기 값 30% 증가
            this.shield.blockValue += 30;
          },
          onExpire: () => {
            this.shield.blockChance = 30;
            this.shield.blockValue -= 30;
            this.shieldBlock.active = false;
          }
        }));

        // 무거운 반향 특성
        if (this.talents.has('heavy_repercussions')) {
          this.applyBuff(new Buff({
            name: '무거운 반향',
            duration: 8,
            type: BUFF_TYPE.PHYSICAL,
            effect: () => {
              this.abilities.get('shield_slam').damageBonus = 30;
            },
            onExpire: () => {
              this.abilities.get('shield_slam').damageBonus = 0;
            }
          }));
        }

        return true;
      }
    });

    // 무시
    this.abilities.set('ignore_pain', {
      name: '무시',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 40 },
      maxRage: 60, // 최대 60 분노 사용 가능
      cooldown: 0,
      castTime: 0,
      gcd: 0,
      execute: () => {
        // 사용 가능한 분노 계산 (최소 40, 최대 60)
        const availableRage = Math.min(
          Math.max(40, this.resources[RESOURCE_TYPE.RAGE]),
          60
        );

        if (!this.spendResource(RESOURCE_TYPE.RAGE, availableRage)) {
          return false;
        }

        // 흡수량 계산
        const absorb = this.calculateAbsorb(availableRage);

        this.applyBuff(new Buff({
          name: '무시',
          duration: Infinity, // 흡수될 때까지 유지
          type: BUFF_TYPE.ABSORB,
          absorb: absorb,
          maxAbsorb: this.maxHealth * 1.3, // 최대 체력의 130%
          onDamage: function(damage) {
            const absorbed = Math.min(damage, this.absorb);
            this.absorb -= absorbed;
            if (this.absorb <= 0) {
              this.expire();
            }
            return damage - absorbed;
          }
        }));

        this.ignore.active = true;

        return true;
      }
    });

    // 최후의 저항
    this.abilities.set('last_stand', {
      name: '최후의 저항',
      cooldown: 180,
      castTime: 0,
      gcd: 0,
      execute: () => {
        const healthBonus = this.maxHealth * 0.3;
        this.lastStand.healthBonus = healthBonus;

        this.applyBuff(new Buff({
          name: '최후의 저항',
          duration: 15,
          type: BUFF_TYPE.DEFENSIVE,
          effect: () => {
            this.maxHealth += healthBonus;
            this.currentHealth += healthBonus;
            this.lastStand.active = true;
          },
          onExpire: () => {
            this.maxHealth -= healthBonus;
            this.currentHealth = Math.min(this.currentHealth, this.maxHealth);
            this.lastStand.active = false;
            this.lastStand.healthBonus = 0;
          }
        }));

        // 강화 특성
        if (this.talents.has('bolster')) {
          // 방패 막기 즉시 시전
          this.abilities.get('shield_block').execute();
        }

        return true;
      }
    });

    // 방패의 벽
    this.abilities.set('shield_wall', {
      name: '방패의 벽',
      cooldown: 240,
      castTime: 0,
      gcd: 0,
      execute: () => {
        this.applyBuff(new Buff({
          name: '방패의 벽',
          duration: 8,
          type: BUFF_TYPE.DEFENSIVE,
          effect: () => {
            this.damageReduction = 0.4; // 40% 피해 감소
          },
          onExpire: () => {
            this.damageReduction = 0;
          }
        }));

        return true;
      }
    });

    // 주문 반사
    this.abilities.set('spell_reflection', {
      name: '주문 반사',
      cost: { type: RESOURCE_TYPE.RAGE, amount: 0 },
      cooldown: 25,
      castTime: 0,
      gcd: 0,
      execute: () => {
        this.applyBuff(new Buff({
          name: '주문 반사',
          duration: 5,
          type: BUFF_TYPE.DEFENSIVE,
          effect: () => {
            this.spellReflection = true;
          },
          onSpellReflect: (spell, caster) => {
            // 주문을 시전자에게 반사
            this.dealDamage(caster, spell.damage, 'spell_reflection');
          },
          onExpire: () => {
            this.spellReflection = false;
          }
        }));

        // 대규모 주문 반사 특성
        if (this.talents.has('mass_spell_reflection')) {
          const allies = this.getAlliesInRadius(10);
          allies.forEach(ally => {
            this.applyBuff(new Buff({
              name: '대규모 주문 반사',
              duration: 3,
              type: BUFF_TYPE.DEFENSIVE,
              effect: () => {
                ally.spellReflection = true;
              },
              onExpire: () => {
                ally.spellReflection = false;
              }
            }), ally);
          });
        }

        return true;
      }
    });

    // 도전의 외침
    this.abilities.set('challenging_shout', {
      name: '도전의 외침',
      cooldown: 90,
      castTime: 0,
      gcd: 0,
      radius: 10,
      execute: () => {
        const enemies = this.getEnemiesInRadius(10);

        enemies.forEach(enemy => {
          // 강제 도발
          enemy.forceTarget(this, 6);
          this.generateThreat(enemy, 10000);
        });

        return true;
      }
    });

    // 투신
    this.abilities.set('avatar_prot', {
      name: '투신',
      cooldown: 90,
      castTime: 0,
      gcd: 0,
      execute: () => {
        this.applyBuff(new Buff({
          name: '투신',
          duration: 20,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            this.damageModifier = 1.2;
            this.maxHealth *= 1.2;
            this.currentHealth *= 1.2;

            // 이동 불가 효과 제거
            this.removeDebuffByType(DEBUFF_TYPE.ROOT);
            this.removeDebuffByType(DEBUFF_TYPE.SLOW);
            this.immuneToRoots = true;
          },
          onExpire: () => {
            this.damageModifier = 1;
            this.maxHealth /= 1.2;
            this.currentHealth = Math.min(this.currentHealth, this.maxHealth);
            this.immuneToRoots = false;
          }
        }));

        return true;
      }
    });
  }

  initializeTalents() {
    this.talentTree = new TalentTree();

    // 방어 특성
    this.talentTree.addTalent(new Talent({
      name: '처벌자',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '방패 밀쳐내기가 처벌 디버프 적용',
      effect: () => {
        this.talents.set('punish', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '파괴자',
      tier: 1,
      maxRank: 1,
      type: 'ability',
      description: '광역 도발 및 감속',
      cooldown: 45,
      learn: () => {
        this.abilities.set('ravager_prot', {
          name: '파괴자',
          cooldown: 45,
          castTime: 0,
          gcd: 1.5,
          execute: (position) => {
            // 회전 무기 소환
            this.summonRavager(position, {
              duration: 12,
              radius: 8,
              tickRate: 1,
              onTick: (enemies) => {
                enemies.forEach(enemy => {
                  const damage = this.calculateDamage({
                    base: 5000,
                    coefficients: { attackPower: 0.6 },
                    type: DAMAGE_TYPE.PHYSICAL
                  });

                  this.dealDamage(enemy, damage, 'ravager');
                  this.generateThreat(enemy, damage * 5);

                  // 감속
                  this.applyDebuff(enemy, new Debuff({
                    name: '파괴자',
                    duration: 2,
                    type: DEBUFF_TYPE.PHYSICAL,
                    effect: (target) => {
                      target.stats[STAT_TYPE.MOVEMENT_SPEED] *= 0.7;
                    },
                    onExpire: (target) => {
                      target.stats[STAT_TYPE.MOVEMENT_SPEED] /= 0.7;
                    }
                  }));
                });
              }
            });

            return true;
          }
        });
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '최선의 방어',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '복수가 분노 10 생성',
      effect: () => {
        this.talents.set('best_defense', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '끓어오르는 분노',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '무시 지속 중 치명타율 20% 증가',
      effect: () => {
        const originalIgnore = this.abilities.get('ignore_pain').execute;
        this.abilities.get('ignore_pain').execute = () => {
          const result = originalIgnore.call(this);
          if (result) {
            this.stats[STAT_TYPE.CRITICAL] += 20;
          }
          return result;
        };
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '무거운 반향',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '방패 막기 중 방패 밀쳐내기 데미지 30% 증가',
      effect: () => {
        this.talents.set('heavy_repercussions', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '강화',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '최후의 저항이 방패 막기 즉시 시전',
      effect: () => {
        this.talents.set('bolster', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '대규모 주문 반사',
      tier: 4,
      maxRank: 1,
      type: 'passive',
      description: '주문 반사가 파티원에게도 적용',
      effect: () => {
        this.talents.set('mass_spell_reflection', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '불굴',
      tier: 4,
      maxRank: 3,
      type: 'passive',
      description: '최대 체력 5% 증가',
      effect: (rank) => {
        this.maxHealth *= (1 + 0.05 * rank);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '복수의 대가',
      tier: 5,
      maxRank: 1,
      type: 'passive',
      description: '피격시 복수 무료 시전 확률',
      effect: () => {
        this.onDamageTaken = (damage) => {
          if (Math.random() < 0.2) {
            this.revenge.procActive = true;
            this.revenge.freeCast = true;

            // 복수 빛나기 효과
            this.applyBuff(new Buff({
              name: '복수!',
              duration: 6,
              type: BUFF_TYPE.PROC
            }));
          }
          return damage;
        };
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '격노한 재생',
      tier: 5,
      maxRank: 1,
      type: 'ability',
      description: '즉시 체력 30% 회복 및 지속 회복',
      cooldown: 120,
      learn: () => {
        this.abilities.set('enraged_regeneration', {
          name: '격노한 재생',
          cooldown: 120,
          castTime: 0,
          gcd: 0,
          execute: () => {
            // 즉시 회복
            this.heal(this.maxHealth * 0.3);

            // 지속 회복
            this.applyBuff(new Buff({
              name: '격노한 재생',
              duration: 8,
              type: BUFF_TYPE.HEAL,
              tickRate: 1,
              onTick: () => {
                this.heal(this.maxHealth * 0.06);
              }
            }));

            return true;
          }
        });
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '분노 관리',
      tier: 6,
      maxRank: 1,
      type: 'passive',
      description: '방어 태세에서도 치명타가 격노 발동',
      effect: () => {
        this.onCritical = (damage) => {
          if (Math.random() < 0.3) {
            this.generateRage(20);

            this.applyBuff(new Buff({
              name: '격노',
              duration: 4,
              type: BUFF_TYPE.PHYSICAL,
              effect: () => {
                this.damageModifier *= 1.1;
              },
              onExpire: () => {
                this.damageModifier /= 1.1;
              }
            }));
          }
        };
      }
    }));
  }

  initializeRotation() {
    // Protection 우선순위 로테이션
    this.rotationPriority = [
      {
        ability: 'shield_block',
        condition: () => {
          return !this.shieldBlock.active &&
                 this.abilities.get('shield_block').currentCharges > 0;
        }
      },
      {
        ability: 'ignore_pain',
        condition: () => {
          return this.resources[RESOURCE_TYPE.RAGE] >= 60 &&
                 !this.buffs.has('무시');
        }
      },
      {
        ability: 'shield_slam',
        condition: () => {
          return true; // 항상 우선순위
        }
      },
      {
        ability: 'revenge',
        condition: () => {
          return this.revenge.procActive ||
                 this.revenge.freeCast ||
                 this.resources[RESOURCE_TYPE.RAGE] >= 30;
        }
      },
      {
        ability: 'thunder_clap',
        condition: () => {
          const enemies = this.getEnemiesInRadius(8);
          return enemies.length >= 1;
        }
      },
      {
        ability: 'devastate',
        condition: () => {
          return this.resources[RESOURCE_TYPE.RAGE] < 60;
        }
      },
      {
        ability: 'ravager_prot',
        condition: () => {
          const enemies = this.getEnemiesInRadius(8);
          return this.talents.has('ravager_prot') && enemies.length >= 3;
        }
      },
      {
        ability: 'last_stand',
        condition: () => {
          return this.healthPercent < 30;
        }
      },
      {
        ability: 'shield_wall',
        condition: () => {
          return this.healthPercent < 20;
        }
      }
    ];
  }

  // 흡수량 계산
  calculateAbsorb(rageSpent) {
    const baseAbsorb = this.attackPower * 3.5;
    const rageBonus = rageSpent * 0.8;
    return baseAbsorb * (1 + rageBonus / 100);
  }

  // 위협 수준 생성
  generateThreat(target, amount) {
    // 탱킹 특화 위협 수준 계산
    const threat = amount * this.threatModifier;
    target.addThreat(this, threat);
  }

  // 피격시 처리
  onDamageTaken(damage, damageType, attacker) {
    // 방패막기 처리
    if (this.shieldBlock.active || Math.random() < this.shield.blockChance / 100) {
      damage *= (1 - this.shield.blockValue / 100);

      // 방패막기 성공시 복수 재설정
      if (Math.random() < 0.3) {
        this.revenge.procActive = true;
      }
    }

    // 무시 흡수
    if (this.buffs.has('무시')) {
      const absorbed = this.buffs.get('무시').onDamage(damage);
      damage -= absorbed;
    }

    return damage;
  }

  update(deltaTime) {
    super.update(deltaTime);

    // 방패 막기 지속시간 업데이트
    if (this.shieldBlock.active) {
      this.shieldBlock.duration -= deltaTime;
      if (this.shieldBlock.duration <= 0) {
        this.shieldBlock.active = false;
      }
    }

    // 무시 업데이트
    if (this.ignore.active && !this.buffs.has('무시')) {
      this.ignore.active = false;
      this.ignore.currentIgnore = 0;
    }
  }
}

// 전문화 팩토리
export class WarriorSpecializationFactory {
  static create(warrior, spec) {
    switch(spec) {
      case 'arms':
        return new ArmsWarrior(warrior);
      case 'fury':
        return new FuryWarrior(warrior);
      case 'protection':
        return new ProtectionWarrior(warrior);
      default:
        throw new Error(`Unknown warrior specialization: ${spec}`);
    }
  }
}

export { ArmsWarrior, FuryWarrior, ProtectionWarrior };