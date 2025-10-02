/**
 * SimulationCraft Actor 클래스 완벽 복제
 * SimC의 액터 시스템을 JavaScript로 재현
 */

import { Event } from './SimCCore.js';

// ==================== 리소스 타입 (SimC와 동일) ====================
const RESOURCE_TYPE = {
  NONE: 0,
  HEALTH: 1,
  MANA: 2,
  RAGE: 3,
  FOCUS: 4,
  ENERGY: 5,
  COMBO_POINT: 6,
  RUNE: 7,
  RUNIC_POWER: 8,
  HOLY_POWER: 9,
  ASTRAL_POWER: 10,
  MAELSTROM: 11,
  CHI: 12,
  INSANITY: 13,
  FURY: 14,
  PAIN: 15,
  SOUL_SHARD: 16,
  ESSENCE: 17,
  RUNE_BLOOD: 18,
  RUNE_FROST: 19,
  RUNE_UNHOLY: 20
};

// ==================== 스탯 타입 (SimC와 동일) ====================
const STAT_TYPE = {
  NONE: 0,
  STRENGTH: 1,
  AGILITY: 2,
  STAMINA: 3,
  INTELLECT: 4,
  SPIRIT: 5,
  SPELL_POWER: 6,
  ATTACK_POWER: 7,
  CRIT_RATING: 8,
  HASTE_RATING: 9,
  MASTERY_RATING: 10,
  VERSATILITY_RATING: 11,
  LEECH_RATING: 12,
  AVOIDANCE_RATING: 13,
  SPEED_RATING: 14,
  ARMOR: 15,
  RESISTANCE: 16
};

// ==================== 액터 기본 클래스 ====================
class Actor {
  constructor(sim, name = 'Actor') {
    // SimC 참조
    this.sim = sim;
    this.name = name;

    // 고유 ID
    this.id = Actor.nextId++;

    // 레벨과 타입
    this.level = 80;
    this.type = 'player'; // player, enemy, add

    // 위치 (SimC의 position_e)
    this.position = 'back'; // front, back

    // 리소스 (SimC의 player_resources_t)
    this.resources = this.initResources();

    // 스탯 (SimC의 player_stats_t)
    this.stats = this.initStats();

    // 버프 리스트
    this.buffList = [];

    // 디버프 리스트
    this.debuffList = [];

    // 액션 리스트
    this.actionList = [];

    // 쿨다운 관리
    this.cooldowns = new Map();

    // 타겟
    this.target = null;

    // 펫 리스트
    this.petList = [];

    // 현재 캐스팅 중인 액션
    this.executingAction = null;

    // 글로벌 쿨다운
    this.gcd = {
      remains: 0,
      duration: 1500 // 기본 1.5초
    };

    // 전투 메트릭
    this.metrics = {
      totalDamage: 0,
      totalHealing: 0,
      totalThreat: 0,
      damageTaken: 0,
      healingTaken: 0,
      deaths: 0
    };

    // 액터 상태
    this.sleeping = false;
    this.stunned = false;
    this.moving = false;
    this.casting = false;

    // SimC의 ready_type
    this.readyType = 0;

    // 전투 시작 시간
    this.combatBeginTime = 0;
  }

  // 리소스 초기화 (SimC와 동일한 구조)
  initResources() {
    return {
      base: new Array(25).fill(0),
      max: new Array(25).fill(0),
      current: new Array(25).fill(0),
      initial: new Array(25).fill(0),

      // 편의 메서드
      get health() { return this.current[RESOURCE_TYPE.HEALTH]; },
      set health(val) { this.current[RESOURCE_TYPE.HEALTH] = Math.max(0, Math.min(val, this.max[RESOURCE_TYPE.HEALTH])); },

      get mana() { return this.current[RESOURCE_TYPE.MANA]; },
      set mana(val) { this.current[RESOURCE_TYPE.MANA] = Math.max(0, Math.min(val, this.max[RESOURCE_TYPE.MANA])); }
    };
  }

  // 스탯 초기화
  initStats() {
    return {
      // 기본 스탯
      strength: 0,
      agility: 0,
      stamina: 0,
      intellect: 0,

      // 2차 스탯
      critRating: 0,
      hasteRating: 0,
      masteryRating: 0,
      versatilityRating: 0,

      // 계산된 스탯
      critChance: 0.05, // 기본 5%
      hastePercent: 0,
      masteryValue: 0,
      versatilityPercent: 0,

      // 공격력
      attackPower: 0,
      spellPower: 0,

      // 방어
      armor: 0,
      dodge: 0.03, // 기본 3%
      parry: 0.03,
      block: 0.03
    };
  }

  // SimC의 combat_begin()
  combatBegin() {
    this.combatBeginTime = this.sim.currentTime;
    this.resetMetrics();

    // 초기 리소스 설정
    for (let i = 0; i < this.resources.current.length; i++) {
      this.resources.current[i] = this.resources.initial[i];
    }

    // 버프 초기화
    this.buffList.forEach(buff => buff.combatBegin());

    // 액션 초기화
    this.actionList.forEach(action => action.reset());
  }

  // SimC의 combat_end()
  combatEnd() {
    // 전투 종료 처리
    this.buffList.forEach(buff => buff.expire());
  }

  // SimC의 reset()
  reset() {
    // 메트릭 리셋
    this.resetMetrics();

    // 리소스 리셋
    for (let i = 0; i < this.resources.current.length; i++) {
      this.resources.current[i] = this.resources.initial[i];
    }

    // 버프/디버프 리셋
    this.buffList.forEach(buff => buff.reset());
    this.debuffList.forEach(debuff => debuff.reset());

    // 쿨다운 리셋
    this.cooldowns.clear();

    // 상태 리셋
    this.sleeping = false;
    this.stunned = false;
    this.moving = false;
    this.casting = false;
    this.executingAction = null;

    // GCD 리셋
    this.gcd.remains = 0;
  }

  // 메트릭 리셋
  resetMetrics() {
    this.metrics.totalDamage = 0;
    this.metrics.totalHealing = 0;
    this.metrics.totalThreat = 0;
    this.metrics.damageTaken = 0;
    this.metrics.healingTaken = 0;
    this.metrics.deaths = 0;
  }

  // SimC의 ready()
  ready() {
    // 준비 체크
    if (this.sleeping || this.stunned) return;
    if (this.casting) return;
    if (this.gcd.remains > 0) return;

    // 다음 액션 선택
    const action = this.selectAction();
    if (action && action.ready()) {
      action.queue();
    } else {
      // 다시 스케줄
      this.scheduleReady();
    }
  }

  // 다음 액션 선택 (APL 평가)
  selectAction() {
    // APL을 순회하며 실행 가능한 첫 번째 액션 반환
    for (const action of this.actionList) {
      if (action.ready()) {
        return action;
      }
    }
    return null;
  }

  // ready 이벤트 스케줄
  scheduleReady() {
    // 다음 가능한 시간 계산
    let nextTime = this.sim.currentTime + 100; // 기본 100ms 후

    // GCD 확인
    if (this.gcd.remains > 0) {
      nextTime = Math.min(nextTime, this.sim.currentTime + this.gcd.remains);
    }

    // 쿨다운 확인
    for (const [name, cd] of this.cooldowns) {
      if (cd.remains > 0) {
        nextTime = Math.min(nextTime, this.sim.currentTime + cd.remains);
      }
    }

    // 이벤트 스케줄
    this.sim.eventMgr.schedule(new Event(
      nextTime,
      this,
      'player_ready',
      () => this.ready()
    ));
  }

  // 데미지 처리 (SimC의 do_damage)
  doDamage(target, amount, school = 'physical') {
    // 데미지 계산
    const finalDamage = this.calculateDamage(amount, school);

    // 타겟에 데미지 적용
    target.takeDamage(this, finalDamage, school);

    // 메트릭 업데이트
    this.metrics.totalDamage += finalDamage;

    // 위협 생성
    this.generateThreat(target, finalDamage);

    return finalDamage;
  }

  // 데미지 받기
  takeDamage(source, amount, school = 'physical') {
    // 방어 계산
    const mitigated = this.mitigateDamage(amount, school);

    // 체력 감소
    this.resources.health -= mitigated;

    // 메트릭 업데이트
    this.metrics.damageTaken += mitigated;

    // 죽음 체크
    if (this.resources.health <= 0) {
      this.demise();
    }

    return mitigated;
  }

  // 데미지 계산
  calculateDamage(base, school) {
    let damage = base;

    // 스탯 보정
    if (school === 'physical') {
      damage *= (1 + this.stats.attackPower / 14000);
    } else {
      damage *= (1 + this.stats.spellPower / 10000);
    }

    // 다재다능 보정
    damage *= (1 + this.stats.versatilityPercent);

    // 버프 보정
    this.buffList.forEach(buff => {
      if (buff.active && buff.damageMultiplier) {
        damage *= buff.damageMultiplier;
      }
    });

    return Math.floor(damage);
  }

  // 데미지 경감
  mitigateDamage(amount, school) {
    let damage = amount;

    // 물리 데미지인 경우 방어도 적용
    if (school === 'physical') {
      const armorReduction = this.stats.armor / (this.stats.armor + 7390);
      damage *= (1 - armorReduction);
    }

    // 다재다능 경감
    damage *= (1 - this.stats.versatilityPercent * 0.5);

    // 버프 경감
    this.buffList.forEach(buff => {
      if (buff.active && buff.damageReduction) {
        damage *= (1 - buff.damageReduction);
      }
    });

    return Math.floor(damage);
  }

  // 치유
  heal(target, amount) {
    const healAmount = Math.floor(amount * (1 + this.stats.versatilityPercent));

    const actualHeal = Math.min(
      healAmount,
      target.resources.max[RESOURCE_TYPE.HEALTH] - target.resources.current[RESOURCE_TYPE.HEALTH]
    );

    target.resources.health += actualHeal;
    this.metrics.totalHealing += actualHeal;
    target.metrics.healingTaken += actualHeal;

    return actualHeal;
  }

  // 위협 생성
  generateThreat(target, amount) {
    // 탱킹 스탠스인 경우 위협 증가
    const threatModifier = this.inTankingStance() ? 4 : 1;
    this.metrics.totalThreat += amount * threatModifier;
  }

  // 탱킹 스탠스 확인
  inTankingStance() {
    // 각 클래스별로 오버라이드
    return false;
  }

  // 죽음 처리
  demise() {
    this.metrics.deaths++;
    this.sleeping = true;

    // 모든 버프 제거
    this.buffList.forEach(buff => buff.expire());

    if (this.sim.debug) {
      console.log(`${this.name} has died!`);
    }
  }

  // 버프 추가
  addBuff(buff) {
    buff.source = this;
    this.buffList.push(buff);
  }

  // 디버프 추가
  addDebuff(debuff) {
    debuff.source = this;
    this.debuffList.push(debuff);
  }

  // 버프 찾기
  getBuff(name) {
    return this.buffList.find(b => b.name === name);
  }

  // 디버프 찾기
  getDebuff(name) {
    return this.debuffList.find(d => d.name === name);
  }

  // 쿨다운 시작
  startCooldown(name, duration) {
    this.cooldowns.set(name, {
      duration: duration,
      remains: duration,
      ready: this.sim.currentTime + duration
    });
  }

  // 쿨다운 체크
  cooldownReady(name) {
    const cd = this.cooldowns.get(name);
    return !cd || cd.remains <= 0;
  }

  // 쿨다운 남은 시간
  cooldownRemains(name) {
    const cd = this.cooldowns.get(name);
    return cd ? cd.remains : 0;
  }

  // GCD 시작
  startGCD(duration = null) {
    this.gcd.duration = duration || this.calculateGCD();
    this.gcd.remains = this.gcd.duration;
  }

  // GCD 계산
  calculateGCD() {
    // 기본 1.5초, 가속으로 감소 (최소 0.75초)
    const base = 1500;
    const hasted = base / (1 + this.stats.hastePercent);
    return Math.max(750, Math.floor(hasted));
  }

  // 업데이트 (매 틱마다)
  update(deltaTime) {
    // GCD 업데이트
    if (this.gcd.remains > 0) {
      this.gcd.remains = Math.max(0, this.gcd.remains - deltaTime);
    }

    // 쿨다운 업데이트
    for (const [name, cd] of this.cooldowns) {
      if (cd.remains > 0) {
        cd.remains = Math.max(0, cd.remains - deltaTime);
      }
    }

    // 버프 업데이트
    this.buffList.forEach(buff => buff.update(deltaTime));
    this.buffList = this.buffList.filter(buff => buff.active);

    // 디버프 업데이트
    this.debuffList.forEach(debuff => debuff.update(deltaTime));
    this.debuffList = this.debuffList.filter(debuff => debuff.active);
  }
}

// 액터 ID 카운터
Actor.nextId = 1;

export { Actor, RESOURCE_TYPE, STAT_TYPE };