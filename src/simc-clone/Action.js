/**
 * SimulationCraft Action 시스템 완벽 복제
 * 모든 스킬 실행과 메커니즘 구현
 */

import { Event } from './SimCCore.js';
import { RESOURCE_TYPE } from './Actor.js';

// ==================== 액션 상태 (SimC와 동일) ====================
const ACTION_STATE = {
  IDLE: 0,
  READY: 1,
  CASTING: 2,
  CHANNELING: 3,
  TRAVELING: 4,
  EXECUTE: 5
};

// ==================== 스쿨 타입 ====================
const SCHOOL_TYPE = {
  NONE: 0,
  PHYSICAL: 1,
  HOLY: 2,
  FIRE: 4,
  NATURE: 8,
  FROST: 16,
  SHADOW: 32,
  ARCANE: 64
};

// ==================== 액션 결과 ====================
const RESULT_TYPE = {
  NONE: 0,
  MISS: 1,
  DODGE: 2,
  PARRY: 3,
  GLANCE: 4,
  BLOCK: 5,
  CRIT_BLOCK: 6,
  HIT: 7,
  CRIT: 8,
  MULTISTRIKE: 9,
  MULTISTRIKE_CRIT: 10
};

// ==================== Action 기본 클래스 ====================
class Action {
  constructor(name, player, spellData = {}) {
    // 기본 정보
    this.name = name;
    this.player = player;
    this.sim = player.sim;
    this.id = spellData.id || 0;

    // 액션 상태
    this.state = ACTION_STATE.IDLE;

    // 주문 데이터 (SimC의 spell_data_t)
    this.data = {
      id: spellData.id || 0,
      name: spellData.name || name,
      school: spellData.school || SCHOOL_TYPE.PHYSICAL,
      resourceCost: spellData.resourceCost || 0,
      resourceType: spellData.resourceType || RESOURCE_TYPE.NONE,
      castTime: spellData.castTime || 0, // 밀리초
      cooldown: spellData.cooldown || 0, // 밀리초
      charges: spellData.charges || 0,
      maxCharges: spellData.charges || 0,
      chargeRecharge: spellData.chargeRecharge || 0,
      gcd: spellData.gcd !== undefined ? spellData.gcd : 1500,
      range: spellData.range || 5,
      radius: spellData.radius || 0,
      maxTargets: spellData.maxTargets || 1,

      // 데미지/힐 계수
      attackPowerCoef: spellData.attackPowerCoef || 0,
      spellPowerCoef: spellData.spellPowerCoef || 0,
      weaponPercent: spellData.weaponPercent || 0,

      // 효과
      effects: spellData.effects || []
    };

    // 타겟
    this.target = null;
    this.targetCache = null;
    this.aoeTargets = [];

    // 쿨다운 관리
    this.cooldown = {
      duration: this.data.cooldown,
      remains: 0,
      ready: 0,
      charges: this.data.maxCharges,
      rechargeStart: 0,
      rechargeRate: this.data.chargeRecharge
    };

    // 실행 정보
    this.executeTime = 0;
    this.travelTime = 0;
    this.timeToExecute = 0;

    // 리소스 비용
    this.baseCost = this.data.resourceCost;
    this.currentCost = this.data.resourceCost;

    // 캐스팅 정보
    this.castTime = this.data.castTime;
    this.baseCastTime = this.data.castTime;
    this.channeled = false;
    this.channelTime = 0;

    // 데미지/힐 정보
    this.baseDamage = 0;
    this.baseHeal = 0;
    this.weaponMultiplier = 1.0;

    // 적중/치명타 확률
    this.baseHitChance = 1.0;
    this.baseCritChance = 0;
    this.baseCritMultiplier = 2.0;

    // 버프/디버프 적용 여부
    this.snapshotStats = false;
    this.updateFlags = 0;

    // 조건문 (APL if 조건)
    this.ifExpr = null;
    this.ifValue = true;

    // 통계
    this.stats = {
      count: 0,
      totalDamage: 0,
      totalHeal: 0,
      totalCasts: 0,
      totalExecuteTime: 0,
      totalTickTime: 0,
      hits: 0,
      crits: 0,
      misses: 0
    };

    // 이벤트 핸들러
    this.executeEvent = null;
    this.tickEvent = null;
    this.travelEvent = null;

    // 백그라운드 (자동 공격 등)
    this.background = false;
    this.repeating = false;

    // 트리거 (다른 액션 트리거)
    this.triggerAction = null;
    this.triggerChance = 1.0;

    // 쿨다운 그룹
    this.cooldownGroup = null;

    // 초기화
    this.init();
  }

  // 액션 초기화
  init() {
    // 서브클래스에서 오버라이드
  }

  // 액션 리셋
  reset() {
    this.state = ACTION_STATE.IDLE;
    this.cooldown.remains = 0;
    this.cooldown.ready = 0;
    this.cooldown.charges = this.data.maxCharges;
    this.targetCache = null;
    this.executeEvent = null;
    this.tickEvent = null;
    this.travelEvent = null;
  }

  // 준비 확인 (SimC의 ready())
  ready() {
    // 플레이어 확인
    if (this.player.sleeping || this.player.stunned) return false;

    // 타겟 확인
    if (!this.selectTarget()) return false;

    // 리소스 확인
    if (!this.hasResource()) return false;

    // 쿨다운 확인
    if (!this.cooldownReady()) return false;

    // 사거리 확인
    if (!this.inRange()) return false;

    // 조건문 확인 (APL if)
    if (!this.checkIf()) return false;

    return true;
  }

  // 타겟 선택
  selectTarget() {
    // 기본 타겟 사용
    if (!this.target) {
      this.target = this.player.target;
    }

    // AOE인 경우 타겟 수집
    if (this.data.radius > 0 || this.data.maxTargets > 1) {
      this.aoeTargets = this.collectAOETargets();
    }

    return this.target && !this.target.sleeping;
  }

  // AOE 타겟 수집
  collectAOETargets() {
    const targets = [];
    const targetList = this.sim.targetList;

    for (const target of targetList) {
      if (target.sleeping) continue;
      if (targets.length >= this.data.maxTargets) break;

      // 거리 체크 (간단한 구현)
      targets.push(target);
    }

    return targets;
  }

  // 리소스 확인
  hasResource() {
    if (this.data.resourceType === RESOURCE_TYPE.NONE) return true;

    const current = this.player.resources.current[this.data.resourceType];
    return current >= this.currentCost;
  }

  // 쿨다운 준비 확인
  cooldownReady() {
    // 충전식 스킬
    if (this.data.maxCharges > 0) {
      return this.cooldown.charges > 0;
    }

    // 일반 쿨다운
    return this.cooldown.remains <= 0;
  }

  // 사거리 확인
  inRange() {
    // 간단한 사거리 체크
    return true; // SimC는 일반적으로 사거리를 무시
  }

  // 조건문 확인 (APL if)
  checkIf() {
    if (!this.ifExpr) return true;

    // 조건 평가 (SimCAPLParser와 연동 예정)
    return this.ifValue;
  }

  // 액션 큐에 추가 (SimC의 queue_execute)
  queue() {
    this.state = ACTION_STATE.READY;

    // 즉시 시전인 경우
    if (this.castTime === 0) {
      this.execute();
    } else {
      // 캐스팅 시작
      this.startCast();
    }
  }

  // 캐스팅 시작
  startCast() {
    this.state = ACTION_STATE.CASTING;
    this.player.casting = true;

    // 캐스팅 시간 계산
    const haste = this.player.cache.spellHaste || 1;
    const actualCastTime = Math.floor(this.castTime / haste);

    // 캐스팅 완료 이벤트 스케줄
    this.executeEvent = new Event(
      this.sim.currentTime + actualCastTime,
      this.player,
      `cast_finish_${this.name}`,
      () => this.finishCast()
    );

    this.sim.eventMgr.schedule(this.executeEvent);

    // 통계
    this.stats.totalCasts++;
  }

  // 캐스팅 완료
  finishCast() {
    this.player.casting = false;
    this.execute();
  }

  // 액션 실행 (SimC의 execute())
  execute() {
    this.state = ACTION_STATE.EXECUTE;

    // 리소스 소비
    this.consumeResource();

    // 쿨다운 시작
    this.startCooldown();

    // GCD 시작
    if (this.data.gcd > 0) {
      this.player.startGCD(this.data.gcd);
    }

    // 스탯 스냅샷
    if (this.snapshotStats) {
      this.takeSnapshot();
    }

    // 메인 효과 실행
    this.impact();

    // 트리거 액션 실행
    if (this.triggerAction && this.sim.rng.roll(this.triggerChance)) {
      this.triggerAction.queue();
    }

    // 통계 업데이트
    this.stats.count++;
    this.stats.totalExecuteTime += this.timeToExecute;

    // 상태 리셋
    this.state = ACTION_STATE.IDLE;

    // 백그라운드/반복 액션인 경우 다시 스케줄
    if (this.background || this.repeating) {
      this.scheduleExecute();
    }
  }

  // 리소스 소비
  consumeResource() {
    if (this.data.resourceType !== RESOURCE_TYPE.NONE) {
      this.player.resources.current[this.data.resourceType] -= this.currentCost;

      // 리소스 획득 추적
      this.player.trackGain(-this.currentCost, this.data.resourceType, this.name);
    }
  }

  // 쿨다운 시작
  startCooldown() {
    if (this.data.cooldown > 0) {
      // 충전식 스킬
      if (this.data.maxCharges > 0) {
        this.cooldown.charges--;

        if (this.cooldown.charges < this.data.maxCharges && this.cooldown.rechargeStart === 0) {
          this.cooldown.rechargeStart = this.sim.currentTime;
          this.scheduleRecharge();
        }
      } else {
        // 일반 쿨다운
        const haste = this.hastedCooldown() ? this.player.cache.spellHaste : 1;
        this.cooldown.duration = Math.floor(this.data.cooldown / haste);
        this.cooldown.remains = this.cooldown.duration;
        this.cooldown.ready = this.sim.currentTime + this.cooldown.duration;
      }

      // 플레이어 쿨다운 등록
      this.player.startCooldown(this.name, this.cooldown.duration);
    }
  }

  // 가속 영향 받는 쿨다운인지
  hastedCooldown() {
    // 일부 스킬만 가속의 영향을 받음
    return false;
  }

  // 충전 스케줄
  scheduleRecharge() {
    const rechargeTime = Math.floor(this.data.chargeRecharge / this.player.cache.spellHaste);

    const rechargeEvent = new Event(
      this.sim.currentTime + rechargeTime,
      this.player,
      `recharge_${this.name}`,
      () => this.recharge()
    );

    this.sim.eventMgr.schedule(rechargeEvent);
  }

  // 충전 완료
  recharge() {
    this.cooldown.charges++;

    if (this.cooldown.charges < this.data.maxCharges) {
      this.scheduleRecharge();
    } else {
      this.cooldown.rechargeStart = 0;
    }
  }

  // 스냅샷 (버프 상태 저장)
  takeSnapshot() {
    this.snapshotData = {
      attackPower: this.player.cache.attackPower,
      spellPower: this.player.cache.spellPower,
      crit: this.player.cache.spellCrit,
      haste: this.player.cache.spellHaste,
      mastery: this.player.cache.mastery,
      versatility: this.player.cache.versatilityDamage
    };
  }

  // 효과 적용 (SimC의 impact())
  impact() {
    // AOE인 경우
    if (this.aoeTargets.length > 0) {
      for (const target of this.aoeTargets) {
        this.impactTarget(target);
      }
    } else {
      // 단일 타겟
      this.impactTarget(this.target);
    }
  }

  // 타겟에 효과 적용
  impactTarget(target) {
    // 적중 판정
    const result = this.calculateResult(target);

    if (result === RESULT_TYPE.MISS) {
      this.stats.misses++;
      return;
    }

    // 데미지/힐 계산
    let amount = 0;
    if (this.baseDamage > 0) {
      amount = this.calculateDamage();

      // 치명타 판정
      if (result === RESULT_TYPE.CRIT) {
        amount *= this.baseCritMultiplier;
        this.stats.crits++;
      } else {
        this.stats.hits++;
      }

      // 데미지 적용
      const actualDamage = this.player.doDamage(target, amount, this.data.school);

      // 통계
      this.stats.totalDamage += actualDamage;
      this.player.recordDamage(this.name, actualDamage);

    } else if (this.baseHeal > 0) {
      amount = this.calculateHeal();

      // 치명타 판정
      if (result === RESULT_TYPE.CRIT) {
        amount *= this.baseCritMultiplier;
      }

      // 힐 적용
      const actualHeal = this.player.heal(target, amount);

      // 통계
      this.stats.totalHeal += actualHeal;
      this.player.recordHealing(this.name, actualHeal);
    }

    // 추가 효과 적용 (디버프 등)
    this.applyEffects(target);
  }

  // 결과 계산 (적중/치명타 등)
  calculateResult(target) {
    // 적중 판정
    if (!this.sim.rng.roll(this.baseHitChance)) {
      return RESULT_TYPE.MISS;
    }

    // 회피/무기막기/막기 체크 (간단한 구현)
    if (this.data.school === SCHOOL_TYPE.PHYSICAL) {
      if (this.sim.rng.roll(target.stats.dodge)) return RESULT_TYPE.DODGE;
      if (this.sim.rng.roll(target.stats.parry)) return RESULT_TYPE.PARRY;
      if (this.sim.rng.roll(target.stats.block)) return RESULT_TYPE.BLOCK;
    }

    // 치명타 판정
    const critChance = this.baseCritChance + this.player.cache.spellCrit;
    if (this.sim.rng.roll(critChance)) {
      return RESULT_TYPE.CRIT;
    }

    return RESULT_TYPE.HIT;
  }

  // 데미지 계산
  calculateDamage() {
    let damage = this.baseDamage;

    // 무기 데미지
    if (this.data.weaponPercent > 0) {
      const weaponDamage = this.calculateWeaponDamage();
      damage += weaponDamage * this.data.weaponPercent;
    }

    // 공격력/주문력 계수
    if (this.data.attackPowerCoef > 0) {
      const ap = this.snapshotData ? this.snapshotData.attackPower : this.player.cache.attackPower;
      damage += ap * this.data.attackPowerCoef;
    }

    if (this.data.spellPowerCoef > 0) {
      const sp = this.snapshotData ? this.snapshotData.spellPower : this.player.cache.spellPower;
      damage += sp * this.data.spellPowerCoef;
    }

    // 다재다능 보정
    const vers = this.snapshotData ? this.snapshotData.versatility : this.player.cache.versatilityDamage;
    damage *= vers;

    // 특화 보정 (클래스별로 다름)
    damage *= this.masteryMultiplier();

    return Math.floor(damage);
  }

  // 무기 데미지 계산
  calculateWeaponDamage() {
    // 간단한 무기 데미지 계산
    const weapon = this.player.gear.mainHand;
    if (!weapon) return 0;

    const minDamage = weapon.minDamage || 1000;
    const maxDamage = weapon.maxDamage || 1500;
    const speed = weapon.speed || 2600; // 밀리초

    const baseDamage = this.sim.rng.range(minDamage, maxDamage);
    const normalized = baseDamage * (speed / 1000) / 2.6;

    return normalized * this.weaponMultiplier;
  }

  // 힐 계산
  calculateHeal() {
    let heal = this.baseHeal;

    // 주문력 계수
    if (this.data.spellPowerCoef > 0) {
      const sp = this.snapshotData ? this.snapshotData.spellPower : this.player.cache.spellPower;
      heal += sp * this.data.spellPowerCoef;
    }

    // 다재다능 보정
    const vers = this.snapshotData ? this.snapshotData.versatility : this.player.cache.versatilityHeal;
    heal *= vers;

    return Math.floor(heal);
  }

  // 특화 배수 (클래스별로 오버라이드)
  masteryMultiplier() {
    return 1.0;
  }

  // 효과 적용 (디버프 등)
  applyEffects(target) {
    // 각 효과 적용
    for (const effect of this.data.effects) {
      this.applyEffect(target, effect);
    }
  }

  // 개별 효과 적용
  applyEffect(target, effect) {
    // 효과 타입별 처리
    switch (effect.type) {
      case 'damage':
        this.player.doDamage(target, effect.amount, effect.school || this.data.school);
        break;
      case 'heal':
        this.player.heal(target, effect.amount);
        break;
      case 'apply_buff':
        // 버프 적용 (Buff 클래스와 연동 예정)
        break;
      case 'apply_debuff':
        // 디버프 적용
        break;
      case 'resource_gain':
        this.player.resources.current[effect.resource] += effect.amount;
        this.player.trackGain(effect.amount, effect.resource, this.name);
        break;
    }
  }

  // 반복 실행 스케줄
  scheduleExecute() {
    const interval = this.calculateInterval();

    this.executeEvent = new Event(
      this.sim.currentTime + interval,
      this.player,
      `execute_${this.name}`,
      () => {
        if (this.ready()) {
          this.execute();
        } else {
          this.scheduleExecute();
        }
      }
    );

    this.sim.eventMgr.schedule(this.executeEvent);
  }

  // 실행 간격 계산
  calculateInterval() {
    // 자동 공격인 경우 무기 속도
    if (this.name === 'auto_attack') {
      const weapon = this.player.gear.mainHand;
      const baseSpeed = weapon ? weapon.speed : 2600;
      return Math.floor(baseSpeed / this.player.cache.attackHaste);
    }

    // 기타 반복 액션
    return 1000; // 1초
  }

  // 틱 (도트 데미지 등)
  tick() {
    // 도트/핫 틱 처리
    this.impactTarget(this.target);

    this.stats.totalTickTime += this.tickInterval;
  }

  // 틱 스케줄
  scheduleTick() {
    const interval = Math.floor(this.tickInterval / this.player.cache.spellHaste);

    this.tickEvent = new Event(
      this.sim.currentTime + interval,
      this.player,
      `tick_${this.name}`,
      () => {
        this.tick();
        if (this.ticksRemaining > 0) {
          this.ticksRemaining--;
          this.scheduleTick();
        }
      }
    );

    this.sim.eventMgr.schedule(this.tickEvent);
  }

  // 액션 취소
  cancel() {
    this.state = ACTION_STATE.IDLE;

    if (this.executeEvent) {
      this.executeEvent.canceled = true;
      this.executeEvent = null;
    }

    if (this.tickEvent) {
      this.tickEvent.canceled = true;
      this.tickEvent = null;
    }

    if (this.travelEvent) {
      this.travelEvent.canceled = true;
      this.travelEvent = null;
    }

    this.player.casting = false;
  }
}

// ==================== 주문 클래스 (마법 스킬) ====================
class Spell extends Action {
  constructor(name, player, spellData) {
    super(name, player, spellData);

    // 주문 특화
    this.harmfulSpell = spellData.harmful !== false;
    this.canCrit = true;
  }

  // 치명타 확률은 주문 치명타 사용
  calculateResult(target) {
    if (!this.sim.rng.roll(this.baseHitChance)) {
      return RESULT_TYPE.MISS;
    }

    const critChance = this.baseCritChance + this.player.cache.spellCrit;
    if (this.canCrit && this.sim.rng.roll(critChance)) {
      return RESULT_TYPE.CRIT;
    }

    return RESULT_TYPE.HIT;
  }
}

// ==================== 근접 공격 클래스 ====================
class MeleeAttack extends Action {
  constructor(name, player, spellData) {
    super(name, player, spellData);

    // 근접 특화
    this.weaponAttack = true;
    this.canParry = true;
    this.canDodge = true;
    this.canBlock = true;
    this.canGlance = true;
  }

  // 근접 공격은 공격 치명타 사용
  calculateResult(target) {
    if (!this.sim.rng.roll(this.baseHitChance)) {
      return RESULT_TYPE.MISS;
    }

    // 회피/무기막기/막기
    if (this.canDodge && this.sim.rng.roll(target.stats.dodge)) {
      return RESULT_TYPE.DODGE;
    }
    if (this.canParry && this.sim.rng.roll(target.stats.parry)) {
      return RESULT_TYPE.PARRY;
    }
    if (this.canBlock && this.sim.rng.roll(target.stats.block)) {
      return RESULT_TYPE.BLOCK;
    }

    const critChance = this.baseCritChance + this.player.cache.attackCrit;
    if (this.sim.rng.roll(critChance)) {
      return RESULT_TYPE.CRIT;
    }

    return RESULT_TYPE.HIT;
  }
}

export { Action, Spell, MeleeAttack, ACTION_STATE, SCHOOL_TYPE, RESULT_TYPE };