/**
 * Hunter Specializations
 * 11.2 The War Within
 *
 * 사냥꾼 전문화 상세 구현
 * - Beast Mastery (야수)
 * - Marksmanship (사격)
 * - Survival (생존)
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
 * Pet 클래스 - 사냥꾼 펫 시스템
 */
class HunterPet {
  constructor(hunter, type = 'wolf') {
    this.owner = hunter;
    this.type = type;
    this.name = this.generatePetName();

    // 펫 스탯
    this.health = 50000;
    this.maxHealth = 50000;
    this.focus = 100;
    this.maxFocus = 100;
    this.focusRegenRate = 10; // 초당 집중 재생

    // 펫 능력치
    this.stats = {
      attackPower: 8000,
      attackSpeed: 2.0,
      critical: 10,
      haste: 0,
      versatility: 0
    };

    // 펫 상태
    this.active = false;
    this.position = { x: 0, y: 0, z: 0 };
    this.target = null;
    this.lastAttack = 0;
    this.abilities = new Map();

    // 펫 특수 능력
    this.specialization = this.getSpecialization();
    this.initializeAbilities();
  }

  generatePetName() {
    const names = {
      wolf: '늑대',
      cat: '표범',
      bear: '곰',
      raptor: '랩터',
      spider: '거미'
    };
    return names[this.type] || '펫';
  }

  getSpecialization() {
    const specs = {
      wolf: 'ferocity', // 사나움 - DPS
      bear: 'tenacity',  // 끈기 - 탱킹
      spider: 'cunning'  // 교활 - 유틸
    };
    return specs[this.type] || 'ferocity';
  }

  initializeAbilities() {
    // 기본 공격
    this.abilities.set('bite', {
      name: '물기',
      cost: 25,
      cooldown: 3,
      execute: (target) => {
        const damage = this.calculateDamage(10000);
        this.owner.dealDamage(target, damage, 'pet_bite');
      }
    });

    // 전문화별 특수 능력
    switch(this.specialization) {
      case 'ferocity':
        this.abilities.set('primal_instincts', {
          name: '원시 본능',
          cost: 0,
          cooldown: 120,
          execute: () => {
            this.applyBuff(new Buff({
              name: '원시 본능',
              duration: 5,
              type: BUFF_TYPE.PHYSICAL,
              effect: () => {
                this.stats.attackSpeed *= 1.5;
              },
              onExpire: () => {
                this.stats.attackSpeed /= 1.5;
              }
            }));
          }
        });
        break;

      case 'tenacity':
        this.abilities.set('last_stand', {
          name: '최후의 저항',
          cost: 0,
          cooldown: 180,
          execute: () => {
            this.maxHealth *= 1.3;
            this.health = this.maxHealth;
          }
        });
        break;

      case 'cunning':
        this.abilities.set('masters_call', {
          name: '주인의 부름',
          cost: 0,
          cooldown: 45,
          execute: () => {
            // 이동 불가 효과 제거
            this.owner.removeDebuffByType(DEBUFF_TYPE.ROOT);
            this.owner.removeDebuffByType(DEBUFF_TYPE.SLOW);
          }
        });
        break;
    }
  }

  calculateDamage(base) {
    let damage = base;
    damage *= (1 + this.stats.attackPower / 10000);
    damage *= (1 + this.stats.critical / 100 * 0.5);
    damage *= (1 + this.owner.stats[STAT_TYPE.MASTERY] / 100 * this.owner.masteryEffect);
    return damage;
  }

  summon(position) {
    this.active = true;
    this.position = { ...position };
    this.health = this.maxHealth;
    this.focus = this.maxFocus;
  }

  dismiss() {
    this.active = false;
    this.target = null;
  }

  attack(target) {
    if (!this.active || !target) return;

    const currentTime = Date.now();
    if (currentTime - this.lastAttack < this.stats.attackSpeed * 1000) return;

    const damage = this.calculateDamage(5000);
    this.owner.dealDamage(target, damage, 'pet_auto_attack');
    this.lastAttack = currentTime;

    // 집중 생성
    this.focus = Math.min(this.focus + 10, this.maxFocus);
  }

  update(deltaTime) {
    if (!this.active) return;

    // 집중 재생
    this.focus = Math.min(this.focus + this.focusRegenRate * deltaTime, this.maxFocus);

    // 자동 공격
    if (this.target && this.target.isAlive()) {
      this.attack(this.target);
    } else if (this.owner.target) {
      this.target = this.owner.target;
    }
  }
}

/**
 * Beast Mastery Hunter Specialization
 * 야수 사냥꾼 - 펫 중심 전투
 */
class BeastMasteryHunter extends Specialization {
  constructor(hunter) {
    super(hunter, 'beast_mastery');

    this.role = 'dps';
    this.masteryName = '야수의 주인';
    this.masteryEffect = 0.18; // 펫 데미지 18% 증가

    // Beast Mastery 고유 메커니즘
    this.pets = [];
    this.maxPets = 1;
    this.activePet = null;

    this.barbedShot = {
      charges: 2,
      maxCharges: 2,
      frenzyStacks: new Map() // 펫별 광란 스택
    };

    this.bestialWrath = {
      active: false,
      duration: 0,
      damageBonus: 0.25
    };

    this.aspectOfTheWild = {
      active: false,
      duration: 0,
      critBonus: 20
    };

    this.direBeasts = []; // 야수 부르기로 소환된 임시 펫들

    this.initializeAbilities();
    this.initializeTalents();
    this.initializeRotation();

    // 기본 펫 소환
    this.summonPet('wolf');
  }

  initializeAbilities() {
    // 미늘 사격
    this.abilities.set('barbed_shot', {
      name: '미늘 사격',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 0 },
      charges: 2,
      maxCharges: 2,
      cooldown: 12,
      castTime: 0,
      gcd: 1.5,
      range: 40,
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 8000,
          coefficients: { attackPower: 0.6 },
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'barbed_shot');

        // 출혈 효과
        this.applyDebuff(target, new Debuff({
          name: '미늘',
          duration: 8,
          type: DEBUFF_TYPE.BLEED,
          tickRate: 2,
          onTick: (target) => {
            const bleedDamage = damage * 0.15;
            this.dealDamage(target, bleedDamage, 'barbed_bleed');
          }
        }));

        // 펫 광란 효과
        if (this.activePet) {
          this.applyPetFrenzy(this.activePet);
        }

        // 야생의 부름 쿨다운 감소
        this.reduceCooldown('call_of_the_wild', 4);

        // 집중 생성
        this.generateFocus(20);

        return true;
      }
    });

    // 살상 명령
    this.abilities.set('kill_command', {
      name: '살상 명령',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 30 },
      cooldown: 7.5,
      castTime: 0,
      gcd: 1.5,
      range: 50,
      execute: (target) => {
        if (!this.activePet || !this.activePet.active) return false;

        const damage = this.calculateDamage({
          base: 15000,
          coefficients: { attackPower: 1.5 },
          type: DAMAGE_TYPE.PHYSICAL
        });

        // 펫이 공격
        this.dealDamage(target, damage, 'kill_command');

        // 펫 집중 생성
        if (this.activePet) {
          this.activePet.focus = Math.min(this.activePet.focus + 15, this.activePet.maxFocus);
        }

        // 킬 클레이브 특성
        if (this.talents.has('kill_cleave')) {
          const nearbyEnemies = this.getEnemiesInRadius(8, target);
          nearbyEnemies.forEach(enemy => {
            if (enemy !== target) {
              this.dealDamage(enemy, damage * 0.75, 'kill_cleave');
            }
          });
        }

        return true;
      }
    });

    // 야수의 격노
    this.abilities.set('bestial_wrath', {
      name: '야수의 격노',
      cooldown: 90,
      castTime: 0,
      gcd: 0,
      duration: 15,
      execute: () => {
        this.bestialWrath.active = true;
        this.bestialWrath.duration = 15;

        this.applyBuff(new Buff({
          name: '야수의 격노',
          duration: 15,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            this.damageModifier = 1.25;

            // 펫도 격노
            if (this.activePet) {
              this.activePet.stats.attackPower *= 1.25;
            }
          },
          onExpire: () => {
            this.damageModifier = 1.0;
            this.bestialWrath.active = false;

            if (this.activePet) {
              this.activePet.stats.attackPower /= 1.25;
            }
          }
        }));

        // 미늘 사격 충전 1개 즉시 회복
        this.abilities.get('barbed_shot').currentCharges = Math.min(
          this.abilities.get('barbed_shot').currentCharges + 1,
          this.abilities.get('barbed_shot').maxCharges
        );

        return true;
      }
    });

    // 코브라 사격
    this.abilities.set('cobra_shot', {
      name: '코브라 사격',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 35 },
      cooldown: 0,
      castTime: 1.75,
      gcd: 1.5,
      range: 40,
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 6000,
          coefficients: { attackPower: 0.5 },
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'cobra_shot');

        // 살상 명령 쿨다운 1초 감소
        this.reduceCooldown('kill_command', 1);

        // 맹독 코브라 특성
        if (this.talents.has('venomous_bite')) {
          this.applyDebuff(target, new Debuff({
            name: '맹독 물기',
            duration: 4,
            type: DEBUFF_TYPE.POISON,
            tickRate: 1,
            onTick: (target) => {
              const poisonDamage = damage * 0.1;
              this.dealDamage(target, poisonDamage, 'venomous_bite');
            }
          }));
        }

        return true;
      }
    });

    // 야생의 상
    this.abilities.set('aspect_of_the_wild', {
      name: '야생의 상',
      cooldown: 120,
      castTime: 0,
      gcd: 0,
      duration: 20,
      execute: () => {
        this.aspectOfTheWild.active = true;
        this.aspectOfTheWild.duration = 20;

        this.applyBuff(new Buff({
          name: '야생의 상',
          duration: 20,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            this.stats[STAT_TYPE.CRITICAL] += 20;

            // 펫 치명타율도 증가
            if (this.activePet) {
              this.activePet.stats.critical += 20;
            }

            // 모든 야수에게 적용
            this.direBeasts.forEach(beast => {
              beast.stats.critical += 20;
            });
          },
          onExpire: () => {
            this.stats[STAT_TYPE.CRITICAL] -= 20;
            this.aspectOfTheWild.active = false;

            if (this.activePet) {
              this.activePet.stats.critical -= 20;
            }

            this.direBeasts.forEach(beast => {
              beast.stats.critical -= 20;
            });
          }
        }));

        // 원시 본능 특성
        if (this.talents.has('primal_instincts')) {
          // 미늘 사격 즉시 재충전
          this.abilities.get('barbed_shot').currentCharges = this.abilities.get('barbed_shot').maxCharges;
        }

        return true;
      }
    });

    // 야수 부르기
    this.abilities.set('dire_beast', {
      name: '야수 부르기',
      cooldown: 20,
      castTime: 0,
      gcd: 1.5,
      execute: () => {
        // 임시 야수 소환
        const direBeasts = ['늑대', '곰', '랩터'];
        const beastType = direBeasts[Math.floor(Math.random() * direBeasts.length)];

        const direBeast = new HunterPet(this, beastType);
        direBeast.summon(this.position);
        direBeast.health = 20000;
        direBeast.maxHealth = 20000;

        this.direBeasts.push(direBeast);

        // 15초 후 자동 소멸
        setTimeout(() => {
          direBeast.dismiss();
          const index = this.direBeasts.indexOf(direBeast);
          if (index > -1) {
            this.direBeasts.splice(index, 1);
          }
        }, 15000);

        // 야수 군단 특성
        if (this.talents.has('beast_cleave')) {
          // 야수의 광역 공격 활성화
          direBeast.cleaveEnabled = true;
        }

        return true;
      }
    });

    // 역병 사격
    this.abilities.set('multi_shot', {
      name: '일제 사격',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 40 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      range: 40,
      radius: 8,
      execute: (target) => {
        const enemies = this.getEnemiesInRadius(8, target);

        enemies.forEach(enemy => {
          const damage = this.calculateDamage({
            base: 4000,
            coefficients: { attackPower: 0.3 },
            type: DAMAGE_TYPE.PHYSICAL
          });

          this.dealDamage(enemy, damage, 'multi_shot');
        });

        // 펫 광역 공격 활성화 (4초)
        if (this.activePet) {
          this.applyBuff(new Buff({
            name: '야수 회전베기',
            duration: 4,
            type: BUFF_TYPE.PHYSICAL,
            effect: () => {
              this.activePet.cleaveEnabled = true;
            },
            onExpire: () => {
              this.activePet.cleaveEnabled = false;
            }
          }));
        }

        return true;
      }
    });

    // 야수의 부름
    this.abilities.set('call_of_the_wild', {
      name: '야생의 부름',
      cooldown: 180,
      castTime: 0,
      gcd: 0,
      execute: () => {
        // 모든 펫 종류를 각각 1마리씩 소환
        const petTypes = ['곰', '고양이', '랩터', '거미', '늑대'];

        petTypes.forEach((type, index) => {
          setTimeout(() => {
            const pet = new HunterPet(this, type);
            pet.summon(this.position);
            pet.health = 30000;
            pet.maxHealth = 30000;

            this.direBeasts.push(pet);

            // 20초 후 소멸
            setTimeout(() => {
              pet.dismiss();
              const idx = this.direBeasts.indexOf(pet);
              if (idx > -1) {
                this.direBeasts.splice(idx, 1);
              }
            }, 20000);
          }, index * 100); // 순차적으로 소환
        });

        // 야수의 격노 즉시 활성화
        this.abilities.get('bestial_wrath').execute();

        return true;
      }
    });

    // 쇄도
    this.abilities.set('stampede', {
      name: '쇄도',
      cooldown: 180,
      castTime: 0,
      gcd: 1.5,
      execute: () => {
        // 5마리의 다양한 펫 소환
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const types = ['wolf', 'cat', 'bear', 'raptor', 'spider'];
            const pet = new HunterPet(this, types[i]);
            pet.summon(this.position);
            pet.health = 25000;
            pet.maxHealth = 25000;

            // 10초간 유지
            setTimeout(() => {
              pet.dismiss();
            }, 10000);

            // 즉시 대상 공격
            if (this.target) {
              pet.target = this.target;
              pet.attack(this.target);
            }
          }, i * 200);
        }

        return true;
      }
    });
  }

  initializeTalents() {
    this.talentTree = new TalentTree();

    // 야수 특성
    this.talentTree.addTalent(new Talent({
      name: '야수 군단',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '야수 부르기 펫이 광역 공격',
      effect: () => {
        this.talents.set('beast_cleave', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '살상 회전베기',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '살상 명령이 주변 적 공격',
      effect: () => {
        this.talents.set('kill_cleave', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '원시 본능',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '야생의 상이 미늘 사격 재충전',
      effect: () => {
        this.talents.set('primal_instincts', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '맹독 코브라',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '코브라 사격이 독 효과 적용',
      effect: () => {
        this.talents.set('venomous_bite', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '하나의 무리',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '야생의 부름 지속시간 동안 치명타 20%',
      effect: () => {
        this.talents.set('one_with_pack', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '무리의 우두머리',
      tier: 4,
      maxRank: 1,
      type: 'passive',
      description: '살상 명령 데미지 10% 증가, 쿨다운 1초 감소',
      effect: () => {
        this.abilities.get('kill_command').cooldown = 6.5;
        this.abilities.get('kill_command').damageBonus = 1.1;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '코브라 저격수',
      tier: 5,
      maxRank: 2,
      type: 'passive',
      description: '코브라 사격 집중 소모 5 감소',
      effect: (rank) => {
        this.abilities.get('cobra_shot').cost.amount -= 5 * rank;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '피의 광란',
      tier: 6,
      maxRank: 1,
      type: 'ability',
      description: '펫 즉시 부활 및 광폭화',
      cooldown: 180,
      learn: () => {
        this.abilities.set('bloodlust', {
          name: '피의 욕망',
          cooldown: 180,
          castTime: 0,
          gcd: 0,
          execute: () => {
            // 펫 즉시 부활
            if (this.activePet && !this.activePet.active) {
              this.activePet.summon(this.position);
            }

            // 광폭화 버프
            this.applyBuff(new Buff({
              name: '피의 욕망',
              duration: 10,
              type: BUFF_TYPE.PHYSICAL,
              effect: () => {
                if (this.activePet) {
                  this.activePet.stats.attackSpeed *= 2;
                  this.activePet.stats.attackPower *= 1.5;
                }
              },
              onExpire: () => {
                if (this.activePet) {
                  this.activePet.stats.attackSpeed /= 2;
                  this.activePet.stats.attackPower /= 1.5;
                }
              }
            }));

            return true;
          }
        });
      }
    }));
  }

  initializeRotation() {
    // Beast Mastery 우선순위 로테이션
    this.rotationPriority = [
      {
        ability: 'call_of_the_wild',
        condition: () => {
          return this.inBurstPhase;
        }
      },
      {
        ability: 'bestial_wrath',
        condition: () => {
          return !this.bestialWrath.active;
        }
      },
      {
        ability: 'aspect_of_the_wild',
        condition: () => {
          return !this.aspectOfTheWild.active;
        }
      },
      {
        ability: 'barbed_shot',
        condition: (target) => {
          // 광란 스택 유지를 위해 우선 사용
          const frenzyStacks = this.barbedShot.frenzyStacks.get(this.activePet?.id);
          return this.abilities.get('barbed_shot').currentCharges > 0 &&
                 (!frenzyStacks || frenzyStacks < 3 || frenzyStacks.duration < 2);
        }
      },
      {
        ability: 'kill_command',
        condition: () => {
          return this.activePet && this.activePet.active;
        }
      },
      {
        ability: 'dire_beast',
        condition: () => {
          return true;
        }
      },
      {
        ability: 'multi_shot',
        condition: () => {
          const enemies = this.getEnemiesInRadius(8);
          return enemies.length >= 3;
        }
      },
      {
        ability: 'cobra_shot',
        condition: () => {
          return this.resources[RESOURCE_TYPE.FOCUS] >= 35;
        }
      }
    ];
  }

  // 펫 소환
  summonPet(type) {
    if (this.activePet) {
      this.activePet.dismiss();
    }

    this.activePet = new HunterPet(this, type);
    this.activePet.summon(this.position);
    this.pets = [this.activePet];
  }

  // 펫 광란 적용
  applyPetFrenzy(pet) {
    if (!pet) return;

    const frenzyBuff = new Buff({
      name: '광란',
      duration: 8,
      stacks: 1,
      maxStacks: 3,
      type: BUFF_TYPE.PHYSICAL,
      effect: () => {
        pet.stats.attackSpeed *= 1.1;
      },
      onStack: (stacks) => {
        pet.stats.attackSpeed = pet.baseAttackSpeed * (1 + 0.1 * stacks);
      },
      onExpire: () => {
        pet.stats.attackSpeed = pet.baseAttackSpeed;
      }
    });

    this.applyBuff(frenzyBuff, pet);

    // 광란 스택 추적
    const currentStacks = this.barbedShot.frenzyStacks.get(pet.id) || 0;
    this.barbedShot.frenzyStacks.set(pet.id, Math.min(currentStacks + 1, 3));
  }

  update(deltaTime) {
    super.update(deltaTime);

    // 펫 업데이트
    if (this.activePet) {
      this.activePet.update(deltaTime);
    }

    // 야수 부르기 펫들 업데이트
    this.direBeasts.forEach(beast => {
      beast.update(deltaTime);
    });

    // 야수의 격노 지속시간 업데이트
    if (this.bestialWrath.active) {
      this.bestialWrath.duration -= deltaTime;
      if (this.bestialWrath.duration <= 0) {
        this.bestialWrath.active = false;
      }
    }

    // 야생의 상 지속시간 업데이트
    if (this.aspectOfTheWild.active) {
      this.aspectOfTheWild.duration -= deltaTime;
      if (this.aspectOfTheWild.duration <= 0) {
        this.aspectOfTheWild.active = false;
      }
    }
  }
}

/**
 * Marksmanship Hunter Specialization
 * 사격 사냥꾼 - 원거리 정밀 사격
 */
class MarksmanshipHunter extends Specialization {
  constructor(hunter) {
    super(hunter, 'marksmanship');

    this.role = 'dps';
    this.masteryName = '저격수의 훈련';
    this.masteryEffect = 0.05; // 사거리 5야드 증가, 중요 능력 효과 증가

    // Marksmanship 고유 메커니즘
    this.preciseShotsStacks = 0;
    this.preciseShotsMax = 2;

    this.trueshot = {
      active: false,
      duration: 0,
      hasteBonus: 40
    };

    this.doubleTap = {
      active: false,
      nextShotEmpowered: false
    };

    this.windArrows = {
      active: false,
      remainingShots: 0
    };

    // 조준 사격 관련
    this.steadyFocus = {
      active: false,
      stacks: 0,
      maxStacks: 2
    };

    this.trickShots = {
      active: false,
      duration: 0
    };

    // 사거리 보너스
    this.rangeBonus = 5;

    this.initializeAbilities();
    this.initializeTalents();
    this.initializeRotation();
  }

  initializeAbilities() {
    // 조준 사격
    this.abilities.set('aimed_shot', {
      name: '조준 사격',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 35 },
      charges: 2,
      maxCharges: 2,
      cooldown: 12,
      castTime: 2.5,
      range: 40 + this.rangeBonus,
      execute: (target) => {
        let castTime = 2.5;

        // 정밀 사격으로 즉시 시전
        if (this.preciseShotsStacks > 0) {
          castTime = 0;
          this.preciseShotsStacks--;
        }

        const damage = this.calculateDamage({
          base: 25000,
          coefficients: { attackPower: 2.5 },
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'aimed_shot');

        // 중요 사격 표식 적용
        this.applyDebuff(target, new Debuff({
          name: '저격수 표식',
          duration: 6,
          type: DEBUFF_TYPE.PHYSICAL,
          effect: (target) => {
            target.vulnerableToRanged = 1.1;
          },
          onExpire: (target) => {
            target.vulnerableToRanged = 1.0;
          }
        }));

        // 신속한 사격 발동
        if (Math.random() < 0.3) {
          this.generatePreciseShots();
        }

        // 이중 타격 특성
        if (this.doubleTap.nextShotEmpowered) {
          const bonusDamage = damage * 0.5;
          this.dealDamage(target, bonusDamage, 'double_tap');
          this.doubleTap.nextShotEmpowered = false;
        }

        return true;
      }
    });

    // 신비한 사격
    this.abilities.set('arcane_shot', {
      name: '신비한 사격',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 20 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      range: 40 + this.rangeBonus,
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 8000,
          coefficients: { attackPower: 0.8, spellPower: 0.4 },
          type: DAMAGE_TYPE.ARCANE
        });

        // 정밀 사격 버프 소모
        let finalDamage = damage;
        if (this.preciseShotsStacks > 0) {
          finalDamage *= 1.75;
          this.preciseShotsStacks--;
        }

        this.dealDamage(target, finalDamage, 'arcane_shot');

        // 비전 파동 특성
        if (this.talents.has('chimaera_shot')) {
          // 2개 대상 추가 타격
          const nearbyEnemies = this.getEnemiesInRadius(8, target)
            .filter(e => e !== target)
            .slice(0, 2);

          nearbyEnemies.forEach(enemy => {
            this.dealDamage(enemy, finalDamage * 0.5, 'chimaera_bounce');
          });
        }

        // 신속한 사격 발동
        this.generatePreciseShots();

        return true;
      }
    });

    // 속사
    this.abilities.set('rapid_fire', {
      name: '속사',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 15 },
      cooldown: 20,
      channelTime: 2,
      tickRate: 0.3,
      range: 40 + this.rangeBonus,
      execute: (target) => {
        // 10발 연속 발사
        const shotsCount = 10;
        const damagePerShot = this.calculateDamage({
          base: 3000,
          coefficients: { attackPower: 0.3 },
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.startChannel({
          duration: 2,
          tickRate: 0.2,
          ticks: shotsCount,
          onTick: () => {
            this.dealDamage(target, damagePerShot, 'rapid_fire');

            // 일제 사격 효과 발동
            if (this.trickShots.active) {
              const nearbyEnemies = this.getEnemiesInRadius(8, target);
              nearbyEnemies.forEach(enemy => {
                if (enemy !== target) {
                  this.dealDamage(enemy, damagePerShot * 0.5, 'rapid_fire_trick');
                }
              });
            }
          },
          onComplete: () => {
            // 채널링 완료시 정밀 사격 2스택
            this.preciseShotsStacks = this.preciseShotsMax;
          }
        });

        return true;
      }
    });

    // 명사수의 집중
    this.abilities.set('trueshot', {
      name: '명사수의 집중',
      cooldown: 180,
      castTime: 0,
      gcd: 0,
      duration: 15,
      execute: () => {
        this.trueshot.active = true;
        this.trueshot.duration = 15;

        this.applyBuff(new Buff({
          name: '명사수의 집중',
          duration: 15,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            this.stats[STAT_TYPE.HASTE] += 40;

            // 조준 사격 무료
            this.abilities.get('aimed_shot').cost.amount = 0;

            // 속사 쿨다운 60% 감소
            this.abilities.get('rapid_fire').cooldownReduction = 0.6;
          },
          onExpire: () => {
            this.stats[STAT_TYPE.HASTE] -= 40;
            this.trueshot.active = false;

            this.abilities.get('aimed_shot').cost.amount = 35;
            this.abilities.get('rapid_fire').cooldownReduction = 0;
          }
        }));

        // 바람 화살 특성
        if (this.talents.has('wind_arrows')) {
          this.windArrows.active = true;
          this.windArrows.remainingShots = 20;
        }

        return true;
      }
    });

    // 일제 사격
    this.abilities.set('multishot', {
      name: '일제 사격',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 30 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      range: 40 + this.rangeBonus,
      radius: 8,
      execute: (target) => {
        const enemies = this.getEnemiesInRadius(8, target);

        enemies.forEach(enemy => {
          const damage = this.calculateDamage({
            base: 5000,
            coefficients: { attackPower: 0.4 },
            type: DAMAGE_TYPE.PHYSICAL
          });

          this.dealDamage(enemy, damage, 'multishot');
        });

        // 일제 사격 버프 활성화 (6초간 능력이 광역화)
        this.trickShots.active = true;
        this.trickShots.duration = 6;

        this.applyBuff(new Buff({
          name: '일제 사격',
          duration: 6,
          type: BUFF_TYPE.PHYSICAL,
          onExpire: () => {
            this.trickShots.active = false;
          }
        }));

        return true;
      }
    });

    // 폭발 사격
    this.abilities.set('explosive_shot', {
      name: '폭발 사격',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 20 },
      cooldown: 30,
      castTime: 0,
      gcd: 1.5,
      range: 40 + this.rangeBonus,
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 15000,
          coefficients: { attackPower: 1.2 },
          type: DAMAGE_TYPE.FIRE
        });

        this.dealDamage(target, damage, 'explosive_shot');

        // 폭발 효과
        setTimeout(() => {
          const explosionDamage = damage * 0.6;
          const nearbyEnemies = this.getEnemiesInRadius(8, target);

          nearbyEnemies.forEach(enemy => {
            this.dealDamage(enemy, explosionDamage, 'explosive_shot_blast');

            // 방향 감각 상실
            this.applyDebuff(enemy, new Debuff({
              name: '방향 감각 상실',
              duration: 3,
              type: DEBUFF_TYPE.DISORIENT,
              effect: (target) => {
                target.confused = true;
              },
              onExpire: (target) => {
                target.confused = false;
              }
            }));
          });
        }, 1000);

        return true;
      }
    });

    // 고정 사격
    this.abilities.set('steady_shot', {
      name: '고정 사격',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: -10 }, // 집중 생성
      cooldown: 0,
      castTime: 1.75,
      gcd: 1.5,
      range: 40 + this.rangeBonus,
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 4000,
          coefficients: { attackPower: 0.35 },
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'steady_shot');

        // 집중 생성
        this.generateFocus(10);

        // 고정 집중 스택
        this.steadyFocus.stacks++;
        if (this.steadyFocus.stacks >= 2) {
          this.steadyFocus.stacks = 0;
          this.applyBuff(new Buff({
            name: '고정 집중',
            duration: 15,
            type: BUFF_TYPE.PHYSICAL,
            effect: () => {
              this.stats[STAT_TYPE.HASTE] += 7;
            },
            onExpire: () => {
              this.stats[STAT_TYPE.HASTE] -= 7;
            }
          }));
        }

        return true;
      }
    });

    // 이중 타격
    this.abilities.set('double_tap', {
      name: '이중 타격',
      cooldown: 60,
      castTime: 0,
      gcd: 0,
      execute: () => {
        this.doubleTap.active = true;
        this.doubleTap.nextShotEmpowered = true;

        this.applyBuff(new Buff({
          name: '이중 타격',
          duration: 15,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            // 다음 조준 사격 또는 속사가 2번 타격
          },
          onExpire: () => {
            this.doubleTap.active = false;
            this.doubleTap.nextShotEmpowered = false;
          }
        }));

        return true;
      }
    });

    // 킬샷
    this.abilities.set('kill_shot', {
      name: '킬샷',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 10 },
      cooldown: 20,
      castTime: 0,
      gcd: 1.5,
      range: 40 + this.rangeBonus,
      execute: (target) => {
        // 체력 20% 이하 대상에게만 사용 가능
        if (target.healthPercent > 20 && !this.buffs.has('flayers_mark')) {
          return false;
        }

        const damage = this.calculateDamage({
          base: 35000,
          coefficients: { attackPower: 3.5 },
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'kill_shot');

        // 죽음의 표식 특성
        if (this.talents.has('dead_eye')) {
          // 치명타시 재사용 가능
          if (this.rollCritical()) {
            this.abilities.get('kill_shot').resetCooldown();
          }
        }

        return true;
      }
    });
  }

  initializeTalents() {
    this.talentTree = new TalentTree();

    // 사격 특성
    this.talentTree.addTalent(new Talent({
      name: '키메라 사격',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '신비한 사격이 추가 대상 공격',
      effect: () => {
        this.talents.set('chimaera_shot', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '치명적인 사격',
      tier: 1,
      maxRank: 3,
      type: 'passive',
      description: '치명타율 3% 증가',
      effect: (rank) => {
        this.stats[STAT_TYPE.CRITICAL] += 3 * rank;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '바람 화살',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '명사수의 집중 중 자동 공격이 바람 화살',
      effect: () => {
        this.talents.set('wind_arrows', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '매의 눈',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '사거리 5야드 추가 증가',
      effect: () => {
        this.rangeBonus += 5;
        Object.values(this.abilities).forEach(ability => {
          if (ability.range) {
            ability.range += 5;
          }
        });
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '죽음의 표식',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '킬샷 치명타시 재사용 가능',
      effect: () => {
        this.talents.set('dead_eye', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '정확한 사격',
      tier: 3,
      maxRank: 2,
      type: 'passive',
      description: '조준 사격 시전시간 0.25초 감소',
      effect: (rank) => {
        this.abilities.get('aimed_shot').castTime -= 0.25 * rank;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '폭발 전문가',
      tier: 4,
      maxRank: 1,
      type: 'passive',
      description: '폭발 사격 데미지 30% 증가',
      effect: () => {
        this.abilities.get('explosive_shot').damageBonus = 1.3;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '신속한 재장전',
      tier: 5,
      maxRank: 1,
      type: 'passive',
      description: '속사 쿨다운 5초 감소',
      effect: () => {
        this.abilities.get('rapid_fire').cooldown = 15;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '바람을 가르는 탄환',
      tier: 6,
      maxRank: 1,
      type: 'ability',
      description: '관통하는 강력한 사격',
      cooldown: 90,
      learn: () => {
        this.abilities.set('wind_bullet', {
          name: '바람 탄환',
          cooldown: 90,
          castTime: 3,
          gcd: 1.5,
          execute: (target) => {
            // 직선상 모든 적 관통
            const damage = this.calculateDamage({
              base: 50000,
              coefficients: { attackPower: 5.0 },
              type: DAMAGE_TYPE.PHYSICAL
            });

            // 경로상 모든 적 타격
            const enemiesInLine = this.getEnemiesInLine(target, 40);
            enemiesInLine.forEach((enemy, index) => {
              // 각 적마다 10% 감소
              const finalDamage = damage * Math.pow(0.9, index);
              this.dealDamage(enemy, finalDamage, 'wind_bullet');
            });

            return true;
          }
        });
      }
    }));
  }

  initializeRotation() {
    // Marksmanship 우선순위 로테이션
    this.rotationPriority = [
      {
        ability: 'trueshot',
        condition: () => {
          return this.inBurstPhase && !this.trueshot.active;
        }
      },
      {
        ability: 'double_tap',
        condition: () => {
          return !this.doubleTap.active;
        }
      },
      {
        ability: 'explosive_shot',
        condition: () => {
          return true;
        }
      },
      {
        ability: 'kill_shot',
        condition: (target) => {
          return target.healthPercent <= 20;
        }
      },
      {
        ability: 'aimed_shot',
        condition: () => {
          return this.abilities.get('aimed_shot').currentCharges > 0 ||
                 this.preciseShotsStacks > 0;
        }
      },
      {
        ability: 'rapid_fire',
        condition: () => {
          return true;
        }
      },
      {
        ability: 'multishot',
        condition: () => {
          const enemies = this.getEnemiesInRadius(8);
          return enemies.length >= 3;
        }
      },
      {
        ability: 'arcane_shot',
        condition: () => {
          return this.resources[RESOURCE_TYPE.FOCUS] >= 70 ||
                 this.preciseShotsStacks > 0;
        }
      },
      {
        ability: 'steady_shot',
        condition: () => {
          return this.resources[RESOURCE_TYPE.FOCUS] < 30;
        }
      }
    ];
  }

  // 정밀 사격 생성
  generatePreciseShots() {
    if (Math.random() < 0.15) {
      this.preciseShotsStacks = Math.min(this.preciseShotsStacks + 2, this.preciseShotsMax);

      this.applyBuff(new Buff({
        name: '정밀 사격',
        duration: 15,
        stacks: this.preciseShotsStacks,
        maxStacks: this.preciseShotsMax,
        type: BUFF_TYPE.PHYSICAL
      }));
    }
  }

  update(deltaTime) {
    super.update(deltaTime);

    // 명사수의 집중 지속시간 업데이트
    if (this.trueshot.active) {
      this.trueshot.duration -= deltaTime;
      if (this.trueshot.duration <= 0) {
        this.trueshot.active = false;
      }
    }

    // 일제 사격 지속시간 업데이트
    if (this.trickShots.active) {
      this.trickShots.duration -= deltaTime;
      if (this.trickShots.duration <= 0) {
        this.trickShots.active = false;
      }
    }

    // 바람 화살 처리
    if (this.windArrows.active && this.windArrows.remainingShots > 0) {
      // 자동 공격이 바람 화살로 변환
      if (this.autoAttackReady) {
        this.windArrows.remainingShots--;
        if (this.windArrows.remainingShots <= 0) {
          this.windArrows.active = false;
        }
      }
    }
  }
}

/**
 * Survival Hunter Specialization
 * 생존 사냥꾼 - 근접 전투와 함정
 */
class SurvivalHunter extends Specialization {
  constructor(hunter) {
    super(hunter, 'survival');

    this.role = 'dps';
    this.masteryName = '야생의 정수';
    this.masteryEffect = 0.16; // 집중 소비 능력 데미지 16% 증가

    // Survival 고유 메커니즘
    this.mongooseBite = {
      stacks: 0,
      maxStacks: 5,
      window: 0,
      maxWindow: 14
    };

    this.coordinatedAssault = {
      active: false,
      duration: 0
    };

    this.aspectOfTheEagle = {
      active: false,
      duration: 0
    };

    // 폭탄 시스템
    this.wildfire = {
      active: false,
      bombs: []
    };

    this.traps = new Map();

    // 근접 전투 활성화
    this.meleeEnabled = true;
    this.meleeWeapon = {
      damage: 10000,
      speed: 2.0
    };

    this.initializeAbilities();
    this.initializeTalents();
    this.initializeRotation();
  }

  initializeAbilities() {
    // 랩터의 일격
    this.abilities.set('raptor_strike', {
      name: '랩터의 일격',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 30 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      melee: true,
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 12000,
          coefficients: { attackPower: 1.3 },
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'raptor_strike');

        // 몽구스 물기 윈도우 열기
        this.mongooseBite.window = this.mongooseBite.maxWindow;
        this.mongooseBite.stacks = 0;

        // 날개 가르기 특성
        if (this.talents.has('tip_of_spear')) {
          this.applyDebuff(target, new Debuff({
            name: '창끝',
            duration: 10,
            stacks: 1,
            maxStacks: 3,
            type: DEBUFF_TYPE.PHYSICAL,
            effect: (target) => {
              target.damageTakenModifier = 1.03;
            },
            onStack: (stacks) => {
              target.damageTakenModifier = 1 + (0.03 * stacks);
            },
            onExpire: (target) => {
              target.damageTakenModifier = 1.0;
            }
          }));
        }

        return true;
      }
    });

    // 몽구스 물기
    this.abilities.set('mongoose_bite', {
      name: '몽구스 물기',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 30 },
      cooldown: 0,
      castTime: 0,
      gcd: 1.5,
      melee: true,
      execute: (target) => {
        // 몽구스 물기 윈도우 내에서만 사용 가능
        if (this.mongooseBite.window <= 0) {
          return false;
        }

        const baseDamage = 10000 + (this.mongooseBite.stacks * 5000);
        const damage = this.calculateDamage({
          base: baseDamage,
          coefficients: { attackPower: 1.0 + (this.mongooseBite.stacks * 0.2) },
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'mongoose_bite');

        // 스택 증가
        this.mongooseBite.stacks = Math.min(this.mongooseBite.stacks + 1, this.mongooseBite.maxStacks);

        // 윈도우 연장
        this.mongooseBite.window = this.mongooseBite.maxWindow;

        // 몽구스의 격노 특성
        if (this.talents.has('mongoose_fury')) {
          if (this.mongooseBite.stacks >= 5) {
            this.applyBuff(new Buff({
              name: '몽구스의 격노',
              duration: 6,
              type: BUFF_TYPE.PHYSICAL,
              effect: () => {
                this.stats[STAT_TYPE.HASTE] += 15;
              },
              onExpire: () => {
                this.stats[STAT_TYPE.HASTE] -= 15;
              }
            }));
          }
        }

        return true;
      }
    });

    // 살상 명령
    this.abilities.set('kill_command_surv', {
      name: '살상 명령',
      cost: { type: RESOURCE_TYPE.FOCUS, amount: 30 },
      cooldown: 10,
      castTime: 0,
      gcd: 1.5,
      execute: (target) => {
        const damage = this.calculateDamage({
          base: 14000,
          coefficients: { attackPower: 1.4 },
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'kill_command');

        // 살상 명령 재설정 확률
        if (Math.random() < 0.25) {
          this.abilities.get('kill_command_surv').resetCooldown();
        }

        // 플랭킹 스트라이크 특성
        if (this.talents.has('flanking_strike')) {
          // 측면 공격 추가
          setTimeout(() => {
            const flankDamage = damage * 0.5;
            this.dealDamage(target, flankDamage, 'flanking_strike');

            // 집중 생성
            this.generateFocus(30);
          }, 500);
        }

        return true;
      }
    });

    // 와일드파이어 폭탄
    this.abilities.set('wildfire_bomb', {
      name: '와일드파이어 폭탄',
      charges: 2,
      maxCharges: 2,
      cooldown: 18,
      castTime: 0,
      gcd: 1.5,
      range: 40,
      execute: (target) => {
        const bombType = this.selectBombType();

        const damage = this.calculateDamage({
          base: 12000,
          coefficients: { attackPower: 1.0 },
          type: DAMAGE_TYPE.FIRE
        });

        // 즉시 폭발
        const enemies = this.getEnemiesInRadius(5, target);
        enemies.forEach(enemy => {
          this.dealDamage(enemy, damage, `wildfire_bomb_${bombType}`);

          // 폭탄 종류별 효과
          switch(bombType) {
            case 'shrapnel':
              // 파편 폭탄 - 출혈
              this.applyDebuff(enemy, new Debuff({
                name: '파편',
                duration: 6,
                type: DEBUFF_TYPE.BLEED,
                tickRate: 1,
                onTick: (target) => {
                  this.dealDamage(target, damage * 0.1, 'shrapnel_bleed');
                }
              }));
              break;

            case 'pheromone':
              // 페로몬 폭탄 - 살상 명령 강화
              this.applyDebuff(enemy, new Debuff({
                name: '페로몬',
                duration: 6,
                type: DEBUFF_TYPE.PHYSICAL,
                effect: (target) => {
                  target.vulnerableToKillCommand = 1.2;
                },
                onExpire: (target) => {
                  target.vulnerableToKillCommand = 1.0;
                }
              }));
              break;

            case 'volatile':
              // 휘발성 폭탄 - 추가 폭발
              setTimeout(() => {
                const volatileDamage = damage * 0.7;
                this.dealDamage(enemy, volatileDamage, 'volatile_explosion');
              }, 1000);
              break;
          }
        });

        // 와일드파이어 지면 효과
        this.createGroundEffect({
          position: target.position,
          radius: 5,
          duration: 6,
          tickRate: 1,
          onTick: (enemies) => {
            enemies.forEach(enemy => {
              const dotDamage = damage * 0.15;
              this.dealDamage(enemy, dotDamage, 'wildfire_burn');
            });
          }
        });

        return true;
      }
    });

    // 조화로운 공격
    this.abilities.set('coordinated_assault', {
      name: '조화로운 공격',
      cooldown: 120,
      castTime: 0,
      gcd: 0,
      duration: 20,
      execute: () => {
        this.coordinatedAssault.active = true;
        this.coordinatedAssault.duration = 20;

        this.applyBuff(new Buff({
          name: '조화로운 공격',
          duration: 20,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            // 모든 능력 데미지 20% 증가
            this.damageModifier = 1.2;

            // 집중 재생 50% 증가
            this.focusRegenRate *= 1.5;
          },
          onExpire: () => {
            this.damageModifier = 1.0;
            this.focusRegenRate /= 1.5;
            this.coordinatedAssault.active = false;
          }
        }));

        return true;
      }
    });

    // 작살
    this.abilities.set('harpoon', {
      name: '작살',
      cooldown: 30,
      castTime: 0,
      gcd: 0,
      range: 30,
      execute: (target) => {
        // 대상에게 돌진
        this.chargeToTarget(target);

        const damage = this.calculateDamage({
          base: 8000,
          coefficients: { attackPower: 0.5 },
          type: DAMAGE_TYPE.PHYSICAL
        });

        this.dealDamage(target, damage, 'harpoon');

        // 루트 효과
        this.applyDebuff(target, new Debuff({
          name: '작살',
          duration: 3,
          type: DEBUFF_TYPE.ROOT,
          effect: (target) => {
            target.rooted = true;
          },
          onExpire: (target) => {
            target.rooted = false;
          }
        }));

        // 작살의 조건 특성
        if (this.talents.has('terms_of_engagement')) {
          this.generateFocus(20);
        }

        return true;
      }
    });

    // 함정 시리즈
    this.abilities.set('freezing_trap', {
      name: '빙결의 덫',
      cooldown: 30,
      castTime: 0,
      gcd: 1.5,
      range: 35,
      execute: (position) => {
        this.placeTrap({
          type: 'freezing',
          position: position,
          radius: 3,
          duration: 60,
          armed: 2, // 2초 후 활성화
          onTrigger: (enemy) => {
            // 빙결 효과
            this.applyDebuff(enemy, new Debuff({
              name: '빙결',
              duration: 8,
              type: DEBUFF_TYPE.INCAPACITATE,
              effect: (target) => {
                target.frozen = true;
              },
              onExpire: (target) => {
                target.frozen = false;
              },
              onDamage: function() {
                // 데미지 받으면 해제
                this.expire();
              }
            }));
          }
        });

        return true;
      }
    });

    this.abilities.set('tar_trap', {
      name: '타르 덫',
      cooldown: 30,
      castTime: 0,
      gcd: 1.5,
      range: 35,
      execute: (position) => {
        this.placeTrap({
          type: 'tar',
          position: position,
          radius: 8,
          duration: 30,
          armed: 1,
          persistent: true, // 지속 효과
          onTick: (enemies) => {
            enemies.forEach(enemy => {
              // 감속 효과
              this.applyDebuff(enemy, new Debuff({
                name: '타르',
                duration: 1.5,
                type: DEBUFF_TYPE.SLOW,
                effect: (target) => {
                  target.stats[STAT_TYPE.MOVEMENT_SPEED] *= 0.5;
                },
                onExpire: (target) => {
                  target.stats[STAT_TYPE.MOVEMENT_SPEED] /= 0.5;
                }
              }));
            });
          }
        });

        return true;
      }
    });

    this.abilities.set('steel_trap', {
      name: '강철 덫',
      cooldown: 30,
      castTime: 0,
      gcd: 1.5,
      range: 35,
      execute: (position) => {
        this.placeTrap({
          type: 'steel',
          position: position,
          radius: 2,
          duration: 60,
          armed: 1,
          onTrigger: (enemy) => {
            const damage = this.calculateDamage({
              base: 20000,
              coefficients: { attackPower: 2.0 },
              type: DAMAGE_TYPE.PHYSICAL
            });

            this.dealDamage(enemy, damage, 'steel_trap');

            // 출혈 효과
            this.applyDebuff(enemy, new Debuff({
              name: '강철 덫',
              duration: 20,
              type: DEBUFF_TYPE.BLEED,
              tickRate: 2,
              onTick: (target) => {
                const bleedDamage = damage * 0.1;
                this.dealDamage(target, bleedDamage, 'steel_trap_bleed');
              },
              effect: (target) => {
                target.rooted = true; // 6초간 이동 불가
              },
              onExpire: (target) => {
                target.rooted = false;
              }
            }));
          }
        });

        return true;
      }
    });

    // 붕대 감기
    this.abilities.set('mend_pet', {
      name: '붕대 감기',
      cooldown: 20,
      castTime: 0,
      gcd: 1.5,
      execute: () => {
        const healing = this.maxHealth * 0.3;
        this.heal(healing);

        // 추가 효과: 디버프 제거
        this.removeDebuffByType(DEBUFF_TYPE.POISON);
        this.removeDebuffByType(DEBUFF_TYPE.DISEASE);

        return true;
      }
    });

    // 독수리의 상
    this.abilities.set('aspect_of_eagle', {
      name: '독수리의 상',
      cooldown: 90,
      castTime: 0,
      gcd: 0,
      duration: 10,
      execute: () => {
        this.aspectOfTheEagle.active = true;
        this.aspectOfTheEagle.duration = 10;

        this.applyBuff(new Buff({
          name: '독수리의 상',
          duration: 10,
          type: BUFF_TYPE.PHYSICAL,
          effect: () => {
            // 근접 능력을 원거리에서 사용 가능
            this.abilities.get('raptor_strike').melee = false;
            this.abilities.get('raptor_strike').range = 40;
            this.abilities.get('mongoose_bite').melee = false;
            this.abilities.get('mongoose_bite').range = 40;

            // 치명타율 증가
            this.stats[STAT_TYPE.CRITICAL] += 30;
          },
          onExpire: () => {
            // 원래대로 복구
            this.abilities.get('raptor_strike').melee = true;
            delete this.abilities.get('raptor_strike').range;
            this.abilities.get('mongoose_bite').melee = true;
            delete this.abilities.get('mongoose_bite').range;

            this.stats[STAT_TYPE.CRITICAL] -= 30;
            this.aspectOfTheEagle.active = false;
          }
        }));

        return true;
      }
    });
  }

  initializeTalents() {
    this.talentTree = new TalentTree();

    // 생존 특성
    this.talentTree.addTalent(new Talent({
      name: '창끝',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '랩터의 일격이 받는 피해 증가 디버프',
      effect: () => {
        this.talents.set('tip_of_spear', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '몽구스의 격노',
      tier: 1,
      maxRank: 1,
      type: 'passive',
      description: '몽구스 물기 5스택시 가속 버프',
      effect: () => {
        this.talents.set('mongoose_fury', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '플랭킹 스트라이크',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '살상 명령이 측면 공격 추가',
      effect: () => {
        this.talents.set('flanking_strike', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '작살의 조건',
      tier: 2,
      maxRank: 1,
      type: 'passive',
      description: '작살이 집중 20 생성',
      effect: () => {
        this.talents.set('terms_of_engagement', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '게릴라 전술',
      tier: 3,
      maxRank: 1,
      type: 'passive',
      description: '와일드파이어 폭탄 쿨다운 2초 감소',
      effect: () => {
        this.abilities.get('wildfire_bomb').cooldown = 16;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '폭격',
      tier: 4,
      maxRank: 1,
      type: 'passive',
      description: '와일드파이어 폭탄 충전 횟수 1 증가',
      effect: () => {
        this.abilities.get('wildfire_bomb').maxCharges = 3;
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '야생의 주입',
      tier: 5,
      maxRank: 1,
      type: 'passive',
      description: '폭탄이 무작위 특수 효과',
      effect: () => {
        this.talents.set('wildfire_infusion', true);
      }
    }));

    this.talentTree.addTalent(new Talent({
      name: '맹금류',
      tier: 6,
      maxRank: 1,
      type: 'passive',
      description: '조화로운 공격 지속시간 5초 증가',
      effect: () => {
        this.abilities.get('coordinated_assault').duration = 25;
      }
    }));
  }

  initializeRotation() {
    // Survival 우선순위 로테이션
    this.rotationPriority = [
      {
        ability: 'coordinated_assault',
        condition: () => {
          return !this.coordinatedAssault.active;
        }
      },
      {
        ability: 'wildfire_bomb',
        condition: () => {
          return this.abilities.get('wildfire_bomb').currentCharges > 0;
        }
      },
      {
        ability: 'kill_command_surv',
        condition: () => {
          return true;
        }
      },
      {
        ability: 'mongoose_bite',
        condition: () => {
          return this.mongooseBite.window > 0 && this.mongooseBite.stacks < 5;
        }
      },
      {
        ability: 'raptor_strike',
        condition: () => {
          return this.mongooseBite.window <= 0 || this.resources[RESOURCE_TYPE.FOCUS] >= 70;
        }
      },
      {
        ability: 'steel_trap',
        condition: (target) => {
          // 강력한 대상에게 사용
          return target.isBoss;
        }
      },
      {
        ability: 'harpoon',
        condition: (target) => {
          const distance = this.getDistanceTo(target);
          return distance > 8;
        }
      }
    ];
  }

  // 폭탄 종류 선택
  selectBombType() {
    if (!this.talents.has('wildfire_infusion')) {
      return 'normal';
    }

    const types = ['shrapnel', 'pheromone', 'volatile'];
    return types[Math.floor(Math.random() * types.length)];
  }

  // 함정 설치
  placeTrap(trapData) {
    const trap = {
      ...trapData,
      id: Date.now(),
      active: false
    };

    this.traps.set(trap.id, trap);

    // 활성화 대기
    setTimeout(() => {
      trap.active = true;

      if (trap.persistent) {
        // 지속 함정
        const interval = setInterval(() => {
          if (trap.duration <= 0) {
            clearInterval(interval);
            this.traps.delete(trap.id);
            return;
          }

          const enemies = this.getEnemiesInRadius(trap.radius, trap.position);
          if (trap.onTick) {
            trap.onTick(enemies);
          }

          trap.duration -= 1;
        }, 1000);
      } else {
        // 일회성 함정
        const checkInterval = setInterval(() => {
          if (trap.duration <= 0) {
            clearInterval(checkInterval);
            this.traps.delete(trap.id);
            return;
          }

          const enemies = this.getEnemiesInRadius(trap.radius, trap.position);
          if (enemies.length > 0 && trap.onTrigger) {
            trap.onTrigger(enemies[0]);
            clearInterval(checkInterval);
            this.traps.delete(trap.id);
          }

          trap.duration -= 0.1;
        }, 100);
      }
    }, (trapData.armed || 0) * 1000);
  }

  update(deltaTime) {
    super.update(deltaTime);

    // 몽구스 물기 윈도우 업데이트
    if (this.mongooseBite.window > 0) {
      this.mongooseBite.window -= deltaTime;
      if (this.mongooseBite.window <= 0) {
        this.mongooseBite.stacks = 0;
      }
    }

    // 조화로운 공격 지속시간 업데이트
    if (this.coordinatedAssault.active) {
      this.coordinatedAssault.duration -= deltaTime;
      if (this.coordinatedAssault.duration <= 0) {
        this.coordinatedAssault.active = false;
      }
    }

    // 독수리의 상 지속시간 업데이트
    if (this.aspectOfTheEagle.active) {
      this.aspectOfTheEagle.duration -= deltaTime;
      if (this.aspectOfTheEagle.duration <= 0) {
        this.aspectOfTheEagle.active = false;
      }
    }
  }
}

// 전문화 팩토리
export class HunterSpecializationFactory {
  static create(hunter, spec) {
    switch(spec) {
      case 'beast_mastery':
        return new BeastMasteryHunter(hunter);
      case 'marksmanship':
        return new MarksmanshipHunter(hunter);
      case 'survival':
        return new SurvivalHunter(hunter);
      default:
        throw new Error(`Unknown hunter specialization: ${spec}`);
    }
  }
}

export { BeastMasteryHunter, MarksmanshipHunter, SurvivalHunter, HunterPet };