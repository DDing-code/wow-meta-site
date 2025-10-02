/**
 * Warlock class implementation
 * 11.2 The War Within
 *
 * 흑마법사 구현
 * 세 가지 전문화를 포함:
 * - Affliction: DoT 기반 DPS
 * - Demonology: 악마 소환 DPS
 * - Destruction: 폭발 DPS
 */

import { Player } from '../core/Player.js';
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
  AURA_TYPE
} from '../core/Constants.js';
import { SimulationError } from '../core/Errors.js';

/**
 * 소울 샤드 시스템
 * 흑마법사의 핵심 리소스
 */
class SoulShardSystem {
  constructor(warlock) {
    this.warlock = warlock;
    this.current = 3; // 시작 소울 샤드
    this.max = 5;
    this.fragments = 0; // 소울 샤드 조각 (10개 = 1 소울 샤드)
    this.maxFragments = 10;
  }

  /**
   * 소울 샤드 생성
   */
  generate(amount) {
    if (amount < 1) {
      // 조각으로 생성
      this.fragments += amount * this.maxFragments;
      while (this.fragments >= this.maxFragments) {
        this.fragments -= this.maxFragments;
        this.current = Math.min(this.current + 1, this.max);
      }
    } else {
      // 완전한 소울 샤드 생성
      this.current = Math.min(this.current + Math.floor(amount), this.max);
    }
  }

  /**
   * 소울 샤드 소비
   */
  spend(amount) {
    if (this.current >= amount) {
      this.current -= amount;
      return true;
    }
    return false;
  }

  /**
   * 소울 샤드 확인
   */
  has(amount) {
    return this.current >= amount;
  }

  update(deltaTime) {
    // 특정 효과에 의한 자동 생성 처리
    if (this.warlock.buffs.has('soul_conduit')) {
      const chance = 0.15;
      if (Math.random() < chance * deltaTime) {
        this.generate(1);
      }
    }
  }
}

/**
 * 악마 소환수 기본 클래스
 */
class Demon {
  constructor(warlock, type) {
    this.owner = warlock;
    this.sim = warlock.sim;
    this.type = type;
    this.active = false;
    this.duration = 0;
    this.maxDuration = 0;
    this.position = { x: 0, y: 0, z: 0 };
    this.target = null;

    // 악마별 스탯
    this.stats = {
      health: 0,
      maxHealth: 0,
      attackPower: 0,
      attackSpeed: 2.0,
      abilities: []
    };

    this.lastAttack = 0;
    this.setup();
  }

  setup() {
    // 각 악마 타입별 설정
    switch(this.type) {
      case 'imp':
        this.stats.health = this.stats.maxHealth = 10000;
        this.stats.attackPower = 500;
        this.stats.attackSpeed = 1.5;
        this.maxDuration = Infinity; // 영구 소환
        break;

      case 'voidwalker':
        this.stats.health = this.stats.maxHealth = 30000;
        this.stats.attackPower = 300;
        this.stats.attackSpeed = 2.0;
        this.maxDuration = Infinity;
        break;

      case 'felhunter':
        this.stats.health = this.stats.maxHealth = 20000;
        this.stats.attackPower = 600;
        this.stats.attackSpeed = 2.0;
        this.maxDuration = Infinity;
        break;

      case 'succubus':
        this.stats.health = this.stats.maxHealth = 15000;
        this.stats.attackPower = 700;
        this.stats.attackSpeed = 1.5;
        this.maxDuration = Infinity;
        break;

      case 'felguard':
        this.stats.health = this.stats.maxHealth = 25000;
        this.stats.attackPower = 800;
        this.stats.attackSpeed = 2.0;
        this.maxDuration = Infinity;
        break;

      case 'infernal':
        this.stats.health = this.stats.maxHealth = 50000;
        this.stats.attackPower = 1200;
        this.stats.attackSpeed = 2.0;
        this.maxDuration = 30;
        break;

      case 'doomguard':
        this.stats.health = this.stats.maxHealth = 40000;
        this.stats.attackPower = 1000;
        this.stats.attackSpeed = 1.5;
        this.maxDuration = 25;
        break;

      case 'wild_imp':
        this.stats.health = this.stats.maxHealth = 5000;
        this.stats.attackPower = 300;
        this.stats.attackSpeed = 1.0;
        this.maxDuration = 20;
        break;

      case 'dreadstalker':
        this.stats.health = this.stats.maxHealth = 15000;
        this.stats.attackPower = 600;
        this.stats.attackSpeed = 1.5;
        this.maxDuration = 12;
        break;

      case 'tyrant':
        this.stats.health = this.stats.maxHealth = 100000;
        this.stats.attackPower = 2000;
        this.stats.attackSpeed = 3.0;
        this.maxDuration = 15;
        break;
    }
  }

  spawn(position = null) {
    this.active = true;
    this.duration = this.maxDuration;
    this.position = position || { ...this.owner.position };
    this.target = this.owner.target;
    this.sim.registerDemon(this);

    // 소환 이벤트
    this.sim.events.emit('demon_summoned', {
      warlock: this.owner,
      demon: this,
      type: this.type
    });
  }

  despawn() {
    this.active = false;
    this.sim.unregisterDemon(this);

    // 소멸 이벤트
    this.sim.events.emit('demon_despawned', {
      warlock: this.owner,
      demon: this,
      type: this.type
    });
  }

  update(deltaTime) {
    if (!this.active) return;

    // 지속시간 감소
    if (this.duration !== Infinity) {
      this.duration -= deltaTime;
      if (this.duration <= 0) {
        this.despawn();
        return;
      }
    }

    // 공격
    const currentTime = this.sim.currentTime;
    if (currentTime - this.lastAttack >= this.stats.attackSpeed) {
      this.attack();
      this.lastAttack = currentTime;
    }
  }

  attack() {
    if (!this.target || !this.target.isAlive()) {
      this.target = this.sim.getRandomEnemy();
    }

    if (this.target) {
      const damage = this.calculateDamage();
      this.sim.dealDamage({
        source: this,
        target: this.target,
        amount: damage,
        type: DAMAGE_TYPE.SHADOW,
        ability: `${this.type}_attack`
      });
    }
  }

  calculateDamage() {
    let damage = this.stats.attackPower;

    // 주인의 스탯 계승
    damage *= (1 + this.owner.stats[STAT_TYPE.MASTERY] / 100);
    damage *= (1 + this.owner.stats[STAT_TYPE.VERSATILITY] / 100);

    // 타이란트 버프
    if (this.owner.buffs.has('tyrant_empowerment')) {
      damage *= 1.5;
    }

    return damage;
  }

  takeDamage(amount) {
    this.stats.health -= amount;
    if (this.stats.health <= 0) {
      this.despawn();
    }
  }
}

/**
 * 임프 군단 관리 시스템
 */
class ImpArmyManager {
  constructor(warlock) {
    this.warlock = warlock;
    this.imps = [];
    this.maxImps = 20; // 최대 야생 임프 수
  }

  summonWildImps(count) {
    for (let i = 0; i < count; i++) {
      if (this.imps.length >= this.maxImps) {
        // 가장 오래된 임프 제거
        const oldest = this.imps.shift();
        oldest.despawn();
      }

      const imp = new Demon(this.warlock, 'wild_imp');
      imp.spawn();
      this.imps.push(imp);
    }
  }

  update(deltaTime) {
    // 만료된 임프 제거
    this.imps = this.imps.filter(imp => imp.active);
  }

  getActiveCount() {
    return this.imps.length;
  }

  empowerAll() {
    // 모든 임프 강화 (타이란트 효과)
    this.imps.forEach(imp => {
      imp.duration += 15; // 15초 연장
      imp.stats.attackPower *= 2; // 공격력 2배
    });
  }
}

/**
 * Warlock 클래스
 */
class Warlock extends Player {
  constructor(sim, config = {}) {
    super(sim, config);

    this.class = 'warlock';
    this.baseHealth = 280000;

    // 리소스 설정
    this.primaryResource = RESOURCE_TYPE.MANA;
    this.resources = {
      current: {
        [RESOURCE_TYPE.MANA]: 50000,
        [RESOURCE_TYPE.HEALTH]: this.baseHealth
      },
      max: {
        [RESOURCE_TYPE.MANA]: 50000,
        [RESOURCE_TYPE.HEALTH]: this.baseHealth
      }
    };

    // 소울 샤드 시스템
    this.soulShards = new SoulShardSystem(this);

    // 악마 관리
    this.activeDemon = null; // 주 소환수
    this.demons = new Map(); // 활성 악마들
    this.impArmy = null; // 임프 군단 (악마학 전용)

    // DoT 추적
    this.dots = new Map();

    // 고통 전문화 전용
    this.unstableAffliction = {
      stacks: 0,
      maxStacks: 5,
      targets: new Map()
    };

    // 파괴 전문화 전용
    this.havocTarget = null; // 혼돈 대상
    this.backdraft = {
      stacks: 0,
      maxStacks: 2
    };

    // 전문화 설정
    this.currentSpec = config.spec || 'affliction';
    this.initializeSpec();
    this.initializeAbilities();

    // 마나 재생
    this.manaRegenRate = 2000; // 초당 마나 재생
  }

  initializeSpec() {
    // 전문화별 초기화
    switch(this.currentSpec) {
      case 'affliction':
        this.role = 'dps';
        this.masteryName = '잠식하는 고통';
        this.masteryEffect = 0.25; // DoT 데미지 25% 증가
        break;

      case 'demonology':
        this.role = 'dps';
        this.masteryName = '주인과 지휘관';
        this.masteryEffect = 0.20; // 악마 데미지 20% 증가
        this.impArmy = new ImpArmyManager(this);
        break;

      case 'destruction':
        this.role = 'dps';
        this.masteryName = '혼돈의 불길';
        this.masteryEffect = 0.30; // 무작위 추가 데미지 30%
        break;
    }

    // 기본 악마 소환
    this.summonDefaultDemon();
  }

  summonDefaultDemon() {
    // 전문화별 기본 악마
    let demonType;
    switch(this.currentSpec) {
      case 'affliction':
        demonType = 'felhunter';
        break;
      case 'demonology':
        demonType = 'felguard';
        break;
      case 'destruction':
        demonType = 'imp';
        break;
    }

    this.activeDemon = new Demon(this, demonType);
    this.activeDemon.spawn();
  }

  initializeAbilities() {
    this.abilities = new Map();

    // 기본 능력들
    this.initializeBaseAbilities();

    // 전문화별 능력들
    switch(this.currentSpec) {
      case 'affliction':
        this.initializeAfflictionAbilities();
        break;
      case 'demonology':
        this.initializeDemonologyAbilities();
        break;
      case 'destruction':
        this.initializeDestructionAbilities();
        break;
    }
  }

  initializeBaseAbilities() {
    // 암흑 화살
    this.abilities.set('shadow_bolt', {
      name: '암흑 화살',
      cost: { type: RESOURCE_TYPE.MANA, amount: 1500 },
      cooldown: 0,
      castTime: 2.0,
      execute: () => {
        const damage = this.calculateDamage(8000, DAMAGE_TYPE.SHADOW);
        this.dealDamageToTarget(damage, DAMAGE_TYPE.SHADOW, 'shadow_bolt');

        // 소울 샤드 생성 확률
        if (Math.random() < 0.25) {
          this.soulShards.generate(1);
        }
      }
    });

    // 생명력 전환
    this.abilities.set('life_tap', {
      name: '생명력 전환',
      cost: { type: RESOURCE_TYPE.HEALTH, amount: 5000 },
      cooldown: 0,
      castTime: 0,
      execute: () => {
        this.resources.current[RESOURCE_TYPE.HEALTH] -= 5000;
        this.resources.current[RESOURCE_TYPE.MANA] = Math.min(
          this.resources.current[RESOURCE_TYPE.MANA] + 10000,
          this.resources.max[RESOURCE_TYPE.MANA]
        );
      }
    });

    // 공포
    this.abilities.set('fear', {
      name: '공포',
      cost: { type: RESOURCE_TYPE.MANA, amount: 2000 },
      cooldown: 0,
      castTime: 1.5,
      execute: () => {
        if (this.target) {
          this.applyDebuff(this.target, new Debuff({
            name: '공포',
            duration: 8,
            type: DEBUFF_TYPE.FEAR,
            effect: (target) => {
              target.feared = true;
            }
          }));
        }
      }
    });

    // 불의 비
    this.abilities.set('rain_of_fire', {
      name: '불의 비',
      cost: { type: RESOURCE_TYPE.SOULSHARDS, amount: 3 },
      cooldown: 0,
      castTime: 0,
      execute: () => {
        if (!this.soulShards.spend(3)) return false;

        // 지면 효과 생성
        this.sim.createGroundEffect({
          source: this,
          position: this.targetPosition || this.position,
          radius: 8,
          duration: 8,
          tickRate: 1,
          onTick: (targets) => {
            targets.forEach(target => {
              const damage = this.calculateDamage(3000, DAMAGE_TYPE.FIRE);
              this.dealDamageToEnemy(target, damage, DAMAGE_TYPE.FIRE, 'rain_of_fire');
            });
          }
        });

        return true;
      }
    });

    // 영혼 불태우기
    this.abilities.set('soulburn', {
      name: '영혼 불태우기',
      cost: { type: RESOURCE_TYPE.SOULSHARDS, amount: 1 },
      cooldown: 30,
      castTime: 0,
      execute: () => {
        if (!this.soulShards.spend(1)) return false;

        this.applyBuff(new Buff({
          name: '영혼 불태우기',
          duration: 20,
          type: BUFF_TYPE.MAGIC,
          effect: () => {
            // 다음 주문 강화
            this.nextSpellEmpowered = true;
          }
        }));

        return true;
      }
    });

    // 어둠의 계약
    this.abilities.set('dark_pact', {
      name: '어둠의 계약',
      cooldown: 120,
      castTime: 0,
      execute: () => {
        // 최대 생명력의 20%를 흡수 보호막으로
        const shieldAmount = this.resources.max[RESOURCE_TYPE.HEALTH] * 0.2;

        this.applyBuff(new Buff({
          name: '어둠의 계약',
          duration: 20,
          type: BUFF_TYPE.MAGIC,
          shield: shieldAmount,
          effect: () => {
            this.absorbShield = shieldAmount;
          },
          onExpire: () => {
            this.absorbShield = 0;
          }
        }));
      }
    });

    // 악마의 문
    this.abilities.set('demonic_gateway', {
      name: '악마의 문',
      cost: { type: RESOURCE_TYPE.MANA, amount: 3000 },
      cooldown: 10,
      castTime: 2,
      execute: () => {
        // 순간이동 포탈 생성
        this.sim.createPortal({
          source: this,
          start: this.position,
          end: this.targetPosition,
          duration: 90,
          onUse: (unit) => {
            unit.teleport(this.targetPosition);
          }
        });
      }
    });
  }

  initializeAfflictionAbilities() {
    // 고통
    this.abilities.set('agony', {
      name: '고통',
      cost: { type: RESOURCE_TYPE.MANA, amount: 1000 },
      cooldown: 0,
      castTime: 0,
      execute: () => {
        if (!this.target) return;

        const debuff = new Debuff({
          name: '고통',
          duration: 18,
          type: DEBUFF_TYPE.CURSE,
          tickRate: 2,
          stacks: 1,
          maxStacks: 20,
          onTick: (target) => {
            const stacks = target.getDebuffStacks('고통');
            const damage = this.calculateDamage(2000 * stacks, DAMAGE_TYPE.SHADOW);
            this.dealDamageToEnemy(target, damage, DAMAGE_TYPE.SHADOW, 'agony');

            // 스택 증가
            if (stacks < 20 && Math.random() < 0.3) {
              target.addDebuffStack('고통');
            }

            // 소울 샤드 생성
            if (Math.random() < 0.16) {
              this.soulShards.generate(1);
            }
          }
        });

        this.applyDebuff(this.target, debuff);
        this.dots.set(`agony_${this.target.id}`, debuff);
      }
    });

    // 부패
    this.abilities.set('corruption', {
      name: '부패',
      cost: { type: RESOURCE_TYPE.MANA, amount: 1500 },
      cooldown: 0,
      castTime: 0,
      execute: () => {
        if (!this.target) return;

        // 즉시 데미지
        const instantDamage = this.calculateDamage(5000, DAMAGE_TYPE.SHADOW);
        this.dealDamageToTarget(instantDamage, DAMAGE_TYPE.SHADOW, 'corruption_instant');

        // DoT
        const debuff = new Debuff({
          name: '부패',
          duration: 14,
          type: DEBUFF_TYPE.CURSE,
          tickRate: 2,
          onTick: (target) => {
            const damage = this.calculateDamage(3000, DAMAGE_TYPE.SHADOW);
            this.dealDamageToEnemy(target, damage, DAMAGE_TYPE.SHADOW, 'corruption');
          }
        });

        this.applyDebuff(this.target, debuff);
        this.dots.set(`corruption_${this.target.id}`, debuff);
      }
    });

    // 불안정한 고통
    this.abilities.set('unstable_affliction', {
      name: '불안정한 고통',
      cost: { type: RESOURCE_TYPE.SOULSHARDS, amount: 1 },
      cooldown: 0,
      castTime: 1.5,
      execute: () => {
        if (!this.target) return;
        if (!this.soulShards.spend(1)) return false;

        const targetId = this.target.id;
        if (!this.unstableAffliction.targets.has(targetId)) {
          this.unstableAffliction.targets.set(targetId, 0);
        }

        const currentStacks = this.unstableAffliction.targets.get(targetId);
        if (currentStacks >= this.unstableAffliction.maxStacks) return false;

        const debuff = new Debuff({
          name: `불안정한 고통 ${currentStacks + 1}`,
          duration: 8,
          type: DEBUFF_TYPE.MAGIC,
          tickRate: 2,
          onTick: (target) => {
            const damage = this.calculateDamage(5000, DAMAGE_TYPE.SHADOW);
            this.dealDamageToEnemy(target, damage, DAMAGE_TYPE.SHADOW, 'unstable_affliction');
          },
          onDispel: (target) => {
            // 해제시 데미지
            const damage = this.calculateDamage(30000, DAMAGE_TYPE.SHADOW);
            this.dealDamageToEnemy(target, damage, DAMAGE_TYPE.SHADOW, 'unstable_affliction_dispel');
          },
          onExpire: () => {
            const stacks = this.unstableAffliction.targets.get(targetId);
            this.unstableAffliction.targets.set(targetId, Math.max(0, stacks - 1));
          }
        });

        this.applyDebuff(this.target, debuff);
        this.unstableAffliction.targets.set(targetId, currentStacks + 1);

        return true;
      }
    });

    // 생명력 흡수
    this.abilities.set('drain_life', {
      name: '생명력 흡수',
      cost: { type: RESOURCE_TYPE.MANA, amount: 0 },
      cooldown: 0,
      channelTime: 5,
      tickRate: 1,
      execute: () => {
        if (!this.target) return;

        this.startChannel({
          duration: 5,
          tickRate: 1,
          onTick: () => {
            const damage = this.calculateDamage(4000, DAMAGE_TYPE.SHADOW);
            this.dealDamageToTarget(damage, DAMAGE_TYPE.SHADOW, 'drain_life');

            // 자가 치유
            this.heal(damage * 0.5);

            // 고통 효과 있으면 데미지 증가
            if (this.target.hasDebuff('고통')) {
              this.dealDamageToTarget(damage * 0.5, DAMAGE_TYPE.SHADOW, 'drain_life_bonus');
            }
          }
        });
      }
    });

    // 씨앗 뿌리기
    this.abilities.set('seed_of_corruption', {
      name: '씨앗 뿌리기',
      cost: { type: RESOURCE_TYPE.MANA, amount: 2000 },
      cooldown: 0,
      castTime: 2.5,
      execute: () => {
        if (!this.target) return;

        const debuff = new Debuff({
          name: '부패의 씨앗',
          duration: 12,
          type: DEBUFF_TYPE.CURSE,
          damageThreshold: 30000,
          accumulatedDamage: 0,
          onDamage: function(damage) {
            this.accumulatedDamage += damage;
            if (this.accumulatedDamage >= this.damageThreshold) {
              this.explode();
            }
          },
          explode: () => {
            // 폭발 - 주변 적들에게 데미지
            const enemies = this.sim.getEnemiesInRadius(this.target.position, 10);
            enemies.forEach(enemy => {
              const damage = this.calculateDamage(15000, DAMAGE_TYPE.SHADOW);
              this.dealDamageToEnemy(enemy, damage, DAMAGE_TYPE.SHADOW, 'seed_explosion');

              // 부패 적용
              this.target = enemy;
              this.abilities.get('corruption').execute();
            });

            // 디버프 제거
            this.target.removeDebuff('부패의 씨앗');
          },
          onExpire: function() {
            this.explode();
          }
        });

        this.applyDebuff(this.target, debuff);
      }
    });

    // 악의 무리 (특성)
    this.abilities.set('vile_taint', {
      name: '악의 무리',
      cost: { type: RESOURCE_TYPE.SOULSHARDS, amount: 1 },
      cooldown: 20,
      castTime: 0,
      execute: () => {
        if (!this.soulShards.spend(1)) return false;

        // 지면 효과
        this.sim.createGroundEffect({
          source: this,
          position: this.targetPosition || this.position,
          radius: 10,
          duration: 10,
          tickRate: 2,
          onTick: (targets) => {
            targets.forEach(target => {
              const damage = this.calculateDamage(3000, DAMAGE_TYPE.SHADOW);
              this.dealDamageToEnemy(target, damage, DAMAGE_TYPE.SHADOW, 'vile_taint');

              // 고통 적용
              this.target = target;
              this.abilities.get('agony').execute();
            });
          }
        });

        return true;
      }
    });

    // 어둠의 영혼: 비참
    this.abilities.set('dark_soul_misery', {
      name: '어둠의 영혼: 비참',
      cooldown: 120,
      castTime: 0,
      execute: () => {
        this.applyBuff(new Buff({
          name: '어둠의 영혼: 비참',
          duration: 20,
          type: BUFF_TYPE.MAGIC,
          effect: () => {
            this.stats[STAT_TYPE.HASTE] += 30;
          },
          onExpire: () => {
            this.stats[STAT_TYPE.HASTE] -= 30;
          }
        }));
      }
    });
  }

  initializeDemonologyAbilities() {
    // 악마 화살
    this.abilities.set('demonbolt', {
      name: '악마 화살',
      cost: { type: RESOURCE_TYPE.MANA, amount: 1500 },
      cooldown: 0,
      castTime: 3.0,
      execute: () => {
        let castTime = 3.0;
        // 악마의 핵 버프당 캐스팅 시간 감소
        const cores = this.buffs.get('demonic_core')?.stacks || 0;
        if (cores > 0) {
          castTime = 0; // 즉시 시전
          this.consumeBuff('demonic_core', 1);
        }

        const damage = this.calculateDamage(12000, DAMAGE_TYPE.SHADOW);
        this.dealDamageToTarget(damage, DAMAGE_TYPE.SHADOW, 'demonbolt');

        // 소울 샤드 생성
        this.soulShards.generate(2);
      }
    });

    // 악마 소환
    this.abilities.set('call_dreadstalkers', {
      name: '공포추적자 소환',
      cost: { type: RESOURCE_TYPE.SOULSHARDS, amount: 2 },
      cooldown: 20,
      castTime: 2,
      execute: () => {
        if (!this.soulShards.spend(2)) return false;

        // 2마리 공포추적자 소환
        for (let i = 0; i < 2; i++) {
          const stalker = new Demon(this, 'dreadstalker');
          stalker.spawn();
          this.demons.set(`dreadstalker_${Date.now()}_${i}`, stalker);
        }

        // 악마의 핵 생성 확률
        if (Math.random() < 0.2) {
          this.generateDemonicCore();
        }

        return true;
      }
    });

    // 손으로 소환
    this.abilities.set('hand_of_guldan', {
      name: '굴단의 손',
      cost: { type: RESOURCE_TYPE.SOULSHARDS, amount: 1 },
      cooldown: 0,
      castTime: 1.5,
      execute: () => {
        const shardsToSpend = Math.min(3, this.soulShards.current);
        if (shardsToSpend === 0) return false;

        this.soulShards.spend(shardsToSpend);

        // 소울 샤드당 야생 임프 소환
        const impsPerShard = 2;
        this.impArmy.summonWildImps(shardsToSpend * impsPerShard);

        // 지면 데미지
        const damage = this.calculateDamage(6000 * shardsToSpend, DAMAGE_TYPE.SHADOW);
        const enemies = this.sim.getEnemiesInRadius(this.targetPosition || this.position, 8);
        enemies.forEach(enemy => {
          this.dealDamageToEnemy(enemy, damage, DAMAGE_TYPE.SHADOW, 'hand_of_guldan');
        });

        return true;
      }
    });

    // 악마 폭발
    this.abilities.set('implosion', {
      name: '내파',
      cooldown: 0,
      castTime: 0,
      execute: () => {
        const activeImps = this.impArmy.getActiveCount();
        if (activeImps === 0) return false;

        // 모든 임프를 폭발시켜 데미지
        this.impArmy.imps.forEach(imp => {
          const enemies = this.sim.getEnemiesInRadius(imp.position, 8);
          enemies.forEach(enemy => {
            const damage = this.calculateDamage(5000, DAMAGE_TYPE.SHADOW);
            this.dealDamageToEnemy(enemy, damage, DAMAGE_TYPE.SHADOW, 'implosion');
          });
          imp.despawn();
        });

        this.impArmy.imps = [];
        return true;
      }
    });

    // 악마의 힘
    this.abilities.set('demonic_strength', {
      name: '악마의 힘',
      cooldown: 60,
      castTime: 0,
      execute: () => {
        if (!this.activeDemon || this.activeDemon.type !== 'felguard') {
          return false;
        }

        // 지옥수호병 강화
        this.applyBuff(new Buff({
          name: '악마의 힘',
          duration: 20,
          type: BUFF_TYPE.MAGIC,
          effect: () => {
            this.activeDemon.stats.attackPower *= 4;
            this.activeDemon.stats.attackSpeed *= 0.5;
          },
          onExpire: () => {
            this.activeDemon.stats.attackPower /= 4;
            this.activeDemon.stats.attackSpeed /= 0.5;
          }
        }));

        return true;
      }
    });

    // 파워 사이펀
    this.abilities.set('power_siphon', {
      name: '힘 착취',
      cooldown: 30,
      castTime: 0,
      execute: () => {
        const impsToSacrifice = Math.min(2, this.impArmy.getActiveCount());
        if (impsToSacrifice === 0) return false;

        // 임프 2마리 희생
        for (let i = 0; i < impsToSacrifice; i++) {
          const imp = this.impArmy.imps.shift();
          imp.despawn();
        }

        // 악마의 핵 2개 생성
        this.generateDemonicCore(2);

        return true;
      }
    });

    // 악마 폭군 소환
    this.abilities.set('summon_demonic_tyrant', {
      name: '악마 폭군 소환',
      cooldown: 90,
      castTime: 2,
      execute: () => {
        const tyrant = new Demon(this, 'tyrant');
        tyrant.spawn();
        this.demons.set('tyrant', tyrant);

        // 모든 악마 강화 및 지속시간 연장
        this.demons.forEach(demon => {
          if (demon.active && demon.type !== 'tyrant') {
            demon.duration += 15;
            demon.stats.attackPower *= 1.5;
          }
        });

        // 임프 강화
        this.impArmy.empowerAll();

        return true;
      }
    });

    // 악마 소환: 지옥불정령
    this.abilities.set('summon_infernal', {
      name: '지옥불정령 소환',
      cooldown: 180,
      castTime: 1.5,
      execute: () => {
        const infernal = new Demon(this, 'infernal');
        infernal.spawn();
        this.demons.set('infernal', infernal);

        // 착지 데미지
        const enemies = this.sim.getEnemiesInRadius(infernal.position, 10);
        enemies.forEach(enemy => {
          const damage = this.calculateDamage(30000, DAMAGE_TYPE.FIRE);
          this.dealDamageToEnemy(enemy, damage, DAMAGE_TYPE.FIRE, 'infernal_impact');

          // 기절 효과
          this.applyDebuff(enemy, new Debuff({
            name: '지옥불정령 충격',
            duration: 2,
            type: DEBUFF_TYPE.STUN
          }));
        });

        return true;
      }
    });
  }

  initializeDestructionAbilities() {
    // 소각
    this.abilities.set('incinerate', {
      name: '소각',
      cost: { type: RESOURCE_TYPE.MANA, amount: 1500 },
      cooldown: 0,
      castTime: 2.0,
      execute: () => {
        let castTime = 2.0;
        // 연쇄 작용 버프 소모
        if (this.backdraft.stacks > 0) {
          castTime *= 0.7;
          this.backdraft.stacks--;
        }

        const damage = this.calculateDamage(9000, DAMAGE_TYPE.FIRE);
        this.dealDamageToTarget(damage, DAMAGE_TYPE.FIRE, 'incinerate');

        // 소울 샤드 조각 생성
        this.soulShards.generate(0.5);

        // 혼돈 대상에도 데미지
        if (this.havocTarget && this.havocTarget !== this.target) {
          this.dealDamageToEnemy(this.havocTarget, damage * 0.6, DAMAGE_TYPE.FIRE, 'incinerate_havoc');
        }
      }
    });

    // 제물
    this.abilities.set('immolate', {
      name: '제물',
      cost: { type: RESOURCE_TYPE.MANA, amount: 2000 },
      cooldown: 0,
      castTime: 1.5,
      execute: () => {
        if (!this.target) return;

        // 즉시 데미지
        const instantDamage = this.calculateDamage(6000, DAMAGE_TYPE.FIRE);
        this.dealDamageToTarget(instantDamage, DAMAGE_TYPE.FIRE, 'immolate_instant');

        // DoT
        const debuff = new Debuff({
          name: '제물',
          duration: 18,
          type: DEBUFF_TYPE.MAGIC,
          tickRate: 3,
          onTick: (target) => {
            const damage = this.calculateDamage(3500, DAMAGE_TYPE.FIRE);
            this.dealDamageToEnemy(target, damage, DAMAGE_TYPE.FIRE, 'immolate');

            // 소울 샤드 생성 확률
            if (Math.random() < 0.15) {
              this.soulShards.generate(0.5);
            }
          }
        });

        this.applyDebuff(this.target, debuff);

        // 혼돈 대상에도 적용
        if (this.havocTarget && this.havocTarget !== this.target) {
          this.applyDebuff(this.havocTarget, { ...debuff });
        }
      }
    });

    // 화염구
    this.abilities.set('conflagrate', {
      name: '화염구',
      charges: 2,
      maxCharges: 2,
      cooldown: 12,
      castTime: 0,
      execute: () => {
        if (!this.target || !this.target.hasDebuff('제물')) {
          return false;
        }

        const damage = this.calculateDamage(12000, DAMAGE_TYPE.FIRE);
        this.dealDamageToTarget(damage, DAMAGE_TYPE.FIRE, 'conflagrate');

        // 연쇄 작용 버프
        this.backdraft.stacks = Math.min(this.backdraft.stacks + 2, this.backdraft.maxStacks);

        // 소울 샤드 조각 생성
        this.soulShards.generate(0.5);

        // 혼돈 대상에도 데미지
        if (this.havocTarget && this.havocTarget !== this.target) {
          this.dealDamageToEnemy(this.havocTarget, damage * 0.6, DAMAGE_TYPE.FIRE, 'conflagrate_havoc');
        }

        return true;
      }
    });

    // 혼돈의 화살
    this.abilities.set('chaos_bolt', {
      name: '혼돈의 화살',
      cost: { type: RESOURCE_TYPE.SOULSHARDS, amount: 2 },
      cooldown: 0,
      castTime: 3.0,
      execute: () => {
        if (!this.soulShards.spend(2)) return false;

        let castTime = 3.0;
        // 연쇄 작용 버프 소모
        if (this.backdraft.stacks > 0) {
          castTime *= 0.7;
          this.backdraft.stacks--;
        }

        // 항상 치명타
        const damage = this.calculateDamage(35000, DAMAGE_TYPE.CHROMATIC) * 2;
        this.dealDamageToTarget(damage, DAMAGE_TYPE.CHROMATIC, 'chaos_bolt');

        // 혼돈 대상에도 데미지
        if (this.havocTarget && this.havocTarget !== this.target) {
          this.dealDamageToEnemy(this.havocTarget, damage * 0.6, DAMAGE_TYPE.CHROMATIC, 'chaos_bolt_havoc');
        }

        return true;
      }
    });

    // 암흑 연소
    this.abilities.set('shadowburn', {
      name: '암흑 연소',
      charges: 2,
      maxCharges: 2,
      cost: { type: RESOURCE_TYPE.SOULSHARDS, amount: 1 },
      cooldown: 12,
      castTime: 0,
      execute: () => {
        if (!this.soulShards.spend(1)) return false;

        const damage = this.calculateDamage(20000, DAMAGE_TYPE.SHADOW);
        this.dealDamageToTarget(damage, DAMAGE_TYPE.SHADOW, 'shadowburn');

        // 대상이 죽으면 소울 샤드 2개 반환
        if (this.target && this.target.health <= damage) {
          this.soulShards.generate(2);
        }

        return true;
      }
    });

    // 혼돈
    this.abilities.set('havoc', {
      name: '혼돈',
      cooldown: 45,
      castTime: 0,
      execute: () => {
        // 두 번째 대상 지정
        const enemies = this.sim.getEnemies();
        const secondTarget = enemies.find(e => e !== this.target && e.isAlive());

        if (!secondTarget) return false;

        this.havocTarget = secondTarget;

        this.applyBuff(new Buff({
          name: '혼돈',
          duration: 10,
          type: BUFF_TYPE.MAGIC,
          onExpire: () => {
            this.havocTarget = null;
          }
        }));

        return true;
      }
    });

    // 지옥폭풍
    this.abilities.set('inferno', {
      name: '지옥폭풍',
      cooldown: 180,
      castTime: 0,
      execute: () => {
        // 불의 비를 즉시 시전 가능하게
        this.applyBuff(new Buff({
          name: '지옥폭풍',
          duration: 30,
          type: BUFF_TYPE.MAGIC,
          effect: () => {
            // 불의 비 강화
            const originalRainOfFire = this.abilities.get('rain_of_fire');
            originalRainOfFire.cost.amount = 0; // 소울 샤드 소모 없음
            originalRainOfFire.castTime = 0;
          },
          onExpire: () => {
            const originalRainOfFire = this.abilities.get('rain_of_fire');
            originalRainOfFire.cost.amount = 3;
          }
        }));

        // 지옥불정령 소환
        const infernal = new Demon(this, 'infernal');
        infernal.spawn();
        this.demons.set('infernal_inferno', infernal);

        return true;
      }
    });

    // 파멸의 인장
    this.abilities.set('cataclysm', {
      name: '파멸의 인장',
      cost: { type: RESOURCE_TYPE.SOULSHARDS, amount: 1 },
      cooldown: 30,
      castTime: 2.5,
      execute: () => {
        if (!this.soulShards.spend(1)) return false;

        // 지면 폭발
        const enemies = this.sim.getEnemiesInRadius(this.targetPosition || this.position, 10);
        enemies.forEach(enemy => {
          // 즉시 데미지
          const damage = this.calculateDamage(25000, DAMAGE_TYPE.FIRE);
          this.dealDamageToEnemy(enemy, damage, DAMAGE_TYPE.FIRE, 'cataclysm');

          // 제물 적용
          this.target = enemy;
          this.abilities.get('immolate').execute();
        });

        return true;
      }
    });
  }

  generateDemonicCore(count = 1) {
    // 악마의 핵 버프 생성
    const currentStacks = this.buffs.get('demonic_core')?.stacks || 0;
    const newStacks = Math.min(currentStacks + count, 4);

    this.applyBuff(new Buff({
      name: '악마의 핵',
      duration: 20,
      stacks: newStacks,
      maxStacks: 4,
      type: BUFF_TYPE.MAGIC,
      effect: () => {
        // 악마 화살 즉시 시전 가능
      }
    }));
  }

  calculateDamage(baseDamage, damageType) {
    let damage = baseDamage;

    // 스탯 적용
    damage *= (1 + this.stats[STAT_TYPE.INTELLECT] / 1000);
    damage *= (1 + this.stats[STAT_TYPE.CRITICAL] / 100);
    damage *= (1 + this.stats[STAT_TYPE.VERSATILITY] / 100);

    // 전문화 특성 적용
    if (this.currentSpec === 'affliction' && (damageType === DAMAGE_TYPE.SHADOW || damageType === DAMAGE_TYPE.NATURE)) {
      // DoT 데미지 증가
      damage *= (1 + this.masteryEffect);
    } else if (this.currentSpec === 'destruction' && Math.random() < this.masteryEffect) {
      // 무작위 추가 데미지
      damage *= 2;
    }

    // 버프 효과
    if (this.buffs.has('어둠의 영혼: 비참')) {
      damage *= 1.2;
    }

    return damage;
  }

  update(deltaTime) {
    super.update(deltaTime);

    // 마나 재생
    this.resources.current[RESOURCE_TYPE.MANA] = Math.min(
      this.resources.current[RESOURCE_TYPE.MANA] + this.manaRegenRate * deltaTime,
      this.resources.max[RESOURCE_TYPE.MANA]
    );

    // 소울 샤드 시스템 업데이트
    this.soulShards.update(deltaTime);

    // 악마 업데이트
    if (this.activeDemon) {
      this.activeDemon.update(deltaTime);
    }

    this.demons.forEach((demon, key) => {
      demon.update(deltaTime);
      if (!demon.active) {
        this.demons.delete(key);
      }
    });

    // 임프 군단 업데이트 (악마학)
    if (this.impArmy) {
      this.impArmy.update(deltaTime);
    }

    // DoT 관리
    this.dots.forEach((dot, key) => {
      if (!dot.active) {
        this.dots.delete(key);
      }
    });
  }

  onCombatStart() {
    super.onCombatStart();

    // 전투 시작시 소울 샤드 3개
    this.soulShards.current = 3;

    // 기본 악마가 없으면 소환
    if (!this.activeDemon || !this.activeDemon.active) {
      this.summonDefaultDemon();
    }
  }

  onCombatEnd() {
    super.onCombatEnd();

    // 모든 악마 제거
    this.demons.forEach(demon => demon.despawn());
    this.demons.clear();

    // DoT 초기화
    this.dots.clear();

    // 불안정한 고통 초기화
    this.unstableAffliction.targets.clear();
  }
}

export { Warlock };