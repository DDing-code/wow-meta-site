/**
 * SimulationCraft Buff/Debuff 시스템 완벽 복제
 * 버프, 디버프, 오라 관리 및 스냅샷팅
 */

import { Event } from './SimCCore.js';

// ==================== 버프 타입 ====================
const BUFF_TYPE = {
  NONE: 0,
  BUFF: 1,
  DEBUFF: 2,
  AURA: 3,
  PROC: 4,
  HIDDEN: 5
};

// ==================== 스택 동작 ====================
const STACK_BEHAVIOR = {
  DEFAULT: 0,        // 기본 (스택 추가)
  REFRESH: 1,        // 지속시간만 갱신
  EXTEND: 2,         // 지속시간 연장
  ASYNCHRONOUS: 3,   // 비동기 (개별 만료)
  REPLACE: 4         // 대체 (기존 제거 후 새로 적용)
};

// ==================== Buff 기본 클래스 ====================
class Buff {
  constructor(name, data = {}) {
    // 기본 정보
    this.name = name;
    this.id = data.id || 0;
    this.type = data.type || BUFF_TYPE.BUFF;

    // 소유자와 소스
    this.player = null;  // 버프를 받는 대상
    this.source = null;  // 버프를 시전한 대상

    // 지속시간 (밀리초)
    this.duration = data.duration || 0;  // 0이면 영구
    this.maxDuration = data.duration || 0;
    this.remains = 0;
    this.expires = 0;

    // 스택 관리
    this.maxStack = data.maxStack || 1;
    this.currentStack = 0;
    this.stackBehavior = data.stackBehavior || STACK_BEHAVIOR.DEFAULT;

    // 틱 관리 (도트/핫)
    this.tickTime = data.tickTime || 0;  // 틱 간격
    this.maxTicks = data.maxTicks || 0;
    this.currentTicks = 0;
    this.ticksRemaining = 0;
    this.tickAction = data.tickAction || null;
    this.tickSnapshot = null;

    // 갱신 관련
    this.refreshable = data.refreshable !== false;
    this.refreshBehavior = data.refreshBehavior || 'pandemic';  // pandemic, none, extend
    this.pandemicWindow = data.pandemicWindow || 0.3;  // 30% 기본

    // 효과
    this.effects = data.effects || [];

    // 수정치
    this.statModifiers = data.statModifiers || {};
    this.damageMultiplier = data.damageMultiplier || 1.0;
    this.healingMultiplier = data.healingMultiplier || 1.0;
    this.damageReduction = data.damageReduction || 0;

    // 상태
    this.active = false;
    this.activated = false;
    this.refreshed = false;
    this.fading = false;
    this.expired = false;

    // 이벤트
    this.expireEvent = null;
    this.tickEvent = null;

    // 트리거
    this.triggerOnGain = data.triggerOnGain || null;
    this.triggerOnLoss = data.triggerOnLoss || null;
    this.triggerOnExpire = data.triggerOnExpire || null;
    this.triggerOnRefresh = data.triggerOnRefresh || null;
    this.triggerOnTick = data.triggerOnTick || null;

    // 조건
    this.conditional = data.conditional || false;
    this.condition = data.condition || null;

    // 통계
    this.stats = {
      uptime: 0,
      uptimePercent: 0,
      applications: 0,
      refreshes: 0,
      expires: 0,
      ticks: 0,
      avgStack: 0,
      maxStackReached: 0
    };

    // 업타임 추적
    this.uptimeArray = [];
    this.lastStart = 0;
    this.lastUpdate = 0;

    // 옵션
    this.quiet = data.quiet || false;  // 로그 출력 안 함
    this.hidden = data.hidden || false;  // UI에 표시 안 함
    this.cancelled = data.cancelled || false;  // 취소 가능

    // 초기화
    this.init();
  }

  // 버프 초기화
  init() {
    // 서브클래스에서 오버라이드
  }

  // 버프 리셋
  reset() {
    this.currentStack = 0;
    this.remains = 0;
    this.expires = 0;
    this.active = false;
    this.activated = false;
    this.refreshed = false;
    this.fading = false;
    this.expired = false;

    this.currentTicks = 0;
    this.ticksRemaining = 0;
    this.tickSnapshot = null;

    if (this.expireEvent) {
      this.expireEvent.canceled = true;
      this.expireEvent = null;
    }

    if (this.tickEvent) {
      this.tickEvent.canceled = true;
      this.tickEvent = null;
    }

    // 통계 리셋
    this.stats.uptime = 0;
    this.stats.applications = 0;
    this.stats.refreshes = 0;
    this.stats.expires = 0;
    this.stats.ticks = 0;
    this.uptimeArray = [];
  }

  // 전투 시작
  combatBegin() {
    this.reset();
  }

  // 버프 적용 (SimC의 trigger())
  trigger(stacks = 1, duration = null) {
    if (!this.player) return false;

    // 조건 확인
    if (this.conditional && !this.checkCondition()) {
      return false;
    }

    const sim = this.player.sim;
    const newDuration = duration !== null ? duration : this.duration;

    // 이미 활성화된 경우
    if (this.active) {
      // 스택 동작에 따라 처리
      switch (this.stackBehavior) {
        case STACK_BEHAVIOR.REFRESH:
          this.refresh(newDuration);
          break;
        case STACK_BEHAVIOR.EXTEND:
          this.extend(newDuration);
          break;
        case STACK_BEHAVIOR.REPLACE:
          this.expire();
          this.apply(stacks, newDuration);
          break;
        case STACK_BEHAVIOR.ASYNCHRONOUS:
          // 비동기는 별도 구현 필요
          break;
        default:
          this.addStack(stacks, newDuration);
          break;
      }
    } else {
      // 새로 적용
      this.apply(stacks, newDuration);
    }

    return true;
  }

  // 버프 적용
  apply(stacks = 1, duration = null) {
    const sim = this.player.sim;

    // 활성화
    this.active = true;
    this.activated = true;
    this.expired = false;
    this.lastStart = sim.currentTime;

    // 스택 설정
    this.currentStack = Math.min(stacks, this.maxStack);

    // 지속시간 설정
    if (duration !== null || this.duration > 0) {
      const finalDuration = duration !== null ? duration : this.duration;
      this.remains = finalDuration;
      this.expires = sim.currentTime + finalDuration;

      // 만료 이벤트 스케줄
      this.scheduleExpire(finalDuration);
    } else {
      // 영구 버프
      this.remains = -1;
      this.expires = -1;
    }

    // 틱 시작 (도트/핫)
    if (this.tickTime > 0 && this.tickAction) {
      this.startTicking();
    }

    // 효과 적용
    this.applyEffects();

    // 트리거 실행
    if (this.triggerOnGain) {
      this.triggerOnGain();
    }

    // 통계
    this.stats.applications++;

    // 로그
    if (!this.quiet && sim.debug) {
      console.log(`${this.player.name} gains ${this.name} (${this.currentStack} stack${this.currentStack > 1 ? 's' : ''})`);
    }
  }

  // 스택 추가
  addStack(stacks = 1, duration = null) {
    const oldStack = this.currentStack;
    this.currentStack = Math.min(this.currentStack + stacks, this.maxStack);

    // 스택이 증가한 경우
    if (this.currentStack > oldStack) {
      // 최대 스택 도달 체크
      if (this.currentStack === this.maxStack) {
        this.stats.maxStackReached++;
      }

      // 지속시간 갱신
      if (this.refreshable) {
        this.refresh(duration);
      }

      // 효과 업데이트
      this.updateEffects();

      // 로그
      if (!this.quiet && this.player.sim.debug) {
        console.log(`${this.player.name}'s ${this.name} increases to ${this.currentStack} stacks`);
      }
    }
  }

  // 버프 갱신
  refresh(duration = null) {
    const sim = this.player.sim;
    const newDuration = duration !== null ? duration : this.duration;

    if (this.refreshBehavior === 'pandemic' && this.remains > 0) {
      // Pandemic: 남은 시간의 일부를 새 지속시간에 추가
      const pandemicBonus = Math.min(this.remains, newDuration * this.pandemicWindow);
      this.remains = newDuration + pandemicBonus;
    } else {
      // 단순 갱신
      this.remains = newDuration;
    }

    this.expires = sim.currentTime + this.remains;
    this.refreshed = true;

    // 만료 이벤트 재스케줄
    if (this.expireEvent) {
      this.expireEvent.canceled = true;
    }
    this.scheduleExpire(this.remains);

    // 트리거 실행
    if (this.triggerOnRefresh) {
      this.triggerOnRefresh();
    }

    // 통계
    this.stats.refreshes++;

    // 로그
    if (!this.quiet && sim.debug) {
      console.log(`${this.player.name}'s ${this.name} refreshed (${this.remains}ms remaining)`);
    }
  }

  // 지속시간 연장
  extend(duration) {
    const sim = this.player.sim;

    this.remains += duration;
    this.expires = sim.currentTime + this.remains;

    // 만료 이벤트 재스케줄
    if (this.expireEvent) {
      this.expireEvent.canceled = true;
    }
    this.scheduleExpire(this.remains);
  }

  // 버프 만료
  expire() {
    if (!this.active) return;

    const sim = this.player.sim;

    // 업타임 기록
    const uptime = sim.currentTime - this.lastStart;
    this.stats.uptime += uptime;
    this.uptimeArray.push({
      start: this.lastStart,
      end: sim.currentTime,
      duration: uptime
    });

    // 상태 변경
    this.active = false;
    this.expired = true;
    this.currentStack = 0;
    this.remains = 0;
    this.expires = 0;

    // 이벤트 취소
    if (this.expireEvent) {
      this.expireEvent.canceled = true;
      this.expireEvent = null;
    }

    if (this.tickEvent) {
      this.tickEvent.canceled = true;
      this.tickEvent = null;
    }

    // 효과 제거
    this.removeEffects();

    // 트리거 실행
    if (this.triggerOnExpire) {
      this.triggerOnExpire();
    }

    if (this.triggerOnLoss) {
      this.triggerOnLoss();
    }

    // 통계
    this.stats.expires++;

    // 로그
    if (!this.quiet && sim.debug) {
      console.log(`${this.player.name} loses ${this.name}`);
    }
  }

  // 스택 감소
  decrement(stacks = 1) {
    this.currentStack = Math.max(0, this.currentStack - stacks);

    if (this.currentStack === 0) {
      this.expire();
    } else {
      this.updateEffects();

      // 로그
      if (!this.quiet && this.player.sim.debug) {
        console.log(`${this.player.name}'s ${this.name} decreases to ${this.currentStack} stacks`);
      }
    }
  }

  // 만료 스케줄
  scheduleExpire(duration) {
    const sim = this.player.sim;

    this.expireEvent = new Event(
      sim.currentTime + duration,
      this.player,
      `expire_${this.name}`,
      () => this.expire()
    );

    sim.eventMgr.schedule(this.expireEvent);
  }

  // 틱 시작
  startTicking() {
    const sim = this.player.sim;

    // 스냅샷 저장
    if (this.tickAction && this.tickAction.snapshotStats) {
      this.tickSnapshot = {
        attackPower: this.player.cache.attackPower,
        spellPower: this.player.cache.spellPower,
        crit: this.player.cache.spellCrit,
        haste: this.player.cache.spellHaste,
        mastery: this.player.cache.mastery,
        versatility: this.player.cache.versatilityDamage
      };
    }

    // 틱 수 계산
    if (this.maxTicks > 0) {
      this.ticksRemaining = this.maxTicks;
    } else if (this.duration > 0 && this.tickTime > 0) {
      this.ticksRemaining = Math.floor(this.duration / this.tickTime);
    }

    // 첫 틱 스케줄
    this.scheduleTick();
  }

  // 틱 스케줄
  scheduleTick() {
    const sim = this.player.sim;
    const haste = this.tickSnapshot ? this.tickSnapshot.haste : this.player.cache.spellHaste;
    const tickInterval = Math.floor(this.tickTime / haste);

    this.tickEvent = new Event(
      sim.currentTime + tickInterval,
      this.player,
      `tick_${this.name}`,
      () => this.tick()
    );

    sim.eventMgr.schedule(this.tickEvent);
  }

  // 틱 실행
  tick() {
    if (!this.active) return;

    const sim = this.player.sim;

    // 틱 액션 실행
    if (this.tickAction) {
      // 스냅샷된 스탯 임시 적용
      if (this.tickSnapshot) {
        const originalCache = { ...this.player.cache };
        Object.assign(this.player.cache, this.tickSnapshot);
        this.tickAction.execute();
        this.player.cache = originalCache;
      } else {
        this.tickAction.execute();
      }
    }

    // 트리거 실행
    if (this.triggerOnTick) {
      this.triggerOnTick();
    }

    // 통계
    this.stats.ticks++;
    this.currentTicks++;

    // 남은 틱 처리
    if (this.ticksRemaining > 0) {
      this.ticksRemaining--;

      if (this.ticksRemaining > 0 && this.active) {
        this.scheduleTick();
      }
    } else if (this.active && this.remains > this.tickTime) {
      // 지속시간이 남아있으면 계속 틱
      this.scheduleTick();
    }
  }

  // 효과 적용
  applyEffects() {
    // 스탯 수정치 적용
    for (const stat in this.statModifiers) {
      const modifier = this.statModifiers[stat];

      if (typeof modifier === 'number') {
        // 고정값 증가
        this.player.stats[stat] += modifier * this.currentStack;
      } else if (typeof modifier === 'object') {
        // 퍼센트 증가 등 복잡한 수정치
        if (modifier.percent) {
          this.player.stats[stat] *= (1 + modifier.percent * this.currentStack);
        }
        if (modifier.flat) {
          this.player.stats[stat] += modifier.flat * this.currentStack;
        }
      }
    }

    // 캐시 업데이트 필요
    this.player.updateCache();

    // 추가 효과
    for (const effect of this.effects) {
      this.applyEffect(effect);
    }
  }

  // 개별 효과 적용
  applyEffect(effect) {
    switch (effect.type) {
      case 'stat':
        this.player.stats[effect.stat] += effect.amount * this.currentStack;
        break;
      case 'resource':
        this.player.resources.max[effect.resource] += effect.amount * this.currentStack;
        break;
      case 'damage_mult':
        // 데미지 배수는 Action에서 체크
        break;
      case 'heal_mult':
        // 힐 배수는 Action에서 체크
        break;
      case 'cooldown_reduction':
        // 쿨다운 감소
        break;
    }
  }

  // 효과 제거
  removeEffects() {
    // 스탯 수정치 제거
    for (const stat in this.statModifiers) {
      const modifier = this.statModifiers[stat];

      if (typeof modifier === 'number') {
        this.player.stats[stat] -= modifier * this.currentStack;
      } else if (typeof modifier === 'object') {
        if (modifier.percent) {
          this.player.stats[stat] /= (1 + modifier.percent * this.currentStack);
        }
        if (modifier.flat) {
          this.player.stats[stat] -= modifier.flat * this.currentStack;
        }
      }
    }

    // 캐시 업데이트 필요
    this.player.updateCache();

    // 추가 효과 제거
    for (const effect of this.effects) {
      this.removeEffect(effect);
    }
  }

  // 개별 효과 제거
  removeEffect(effect) {
    switch (effect.type) {
      case 'stat':
        this.player.stats[effect.stat] -= effect.amount * this.currentStack;
        break;
      case 'resource':
        this.player.resources.max[effect.resource] -= effect.amount * this.currentStack;
        break;
    }
  }

  // 효과 업데이트 (스택 변경 시)
  updateEffects() {
    // 기존 효과 제거 후 재적용
    this.removeEffects();
    this.applyEffects();
  }

  // 조건 확인
  checkCondition() {
    if (!this.condition) return true;

    // 조건 평가 (APL 파서와 연동 예정)
    return true;
  }

  // 업데이트 (매 틱마다)
  update(deltaTime) {
    if (!this.active) return;

    const sim = this.player.sim;

    // 지속시간 감소
    if (this.remains > 0) {
      this.remains = Math.max(0, this.remains - deltaTime);

      // 만료 체크
      if (this.remains === 0 && !this.expireEvent) {
        this.expire();
      }
    }

    this.lastUpdate = sim.currentTime;
  }

  // 업타임 계산
  getUptime() {
    const sim = this.player.sim;
    const combatTime = sim.currentTime - this.player.combatBeginTime;

    if (combatTime === 0) return 0;

    let totalUptime = this.stats.uptime;

    // 현재 활성화 중이면 현재까지의 시간 추가
    if (this.active) {
      totalUptime += sim.currentTime - this.lastStart;
    }

    return totalUptime / combatTime;
  }

  // 평균 스택 계산
  getAverageStack() {
    const uptime = this.getUptime();
    if (uptime === 0) return 0;

    // 스택별 업타임 계산 필요 (복잡한 구현)
    return this.currentStack * uptime;
  }

  // 남은 시간 확인 (SimC 호환)
  get up() {
    return this.active;
  }

  get down() {
    return !this.active;
  }

  get stack() {
    return this.currentStack;
  }

  get react() {
    return this.currentStack;
  }

  // 값 반환 (APL 조건용)
  get value() {
    return this.currentStack;
  }

  get stackValue() {
    // 스택당 값 (효과에 따라 다름)
    return this.currentStack;
  }
}

// ==================== Debuff 클래스 ====================
class Debuff extends Buff {
  constructor(name, data) {
    super(name, data);
    this.type = BUFF_TYPE.DEBUFF;

    // 디버프 특화
    this.target = null;  // 디버프가 걸린 대상
  }

  // 디버프는 타겟에 적용
  apply(stacks = 1, duration = null) {
    if (!this.target) {
      this.target = this.player.target;
    }

    super.apply(stacks, duration);
  }
}

// ==================== Aura 클래스 (지역 효과) ====================
class Aura extends Buff {
  constructor(name, data) {
    super(name, data);
    this.type = BUFF_TYPE.AURA;

    // 오라 특화
    this.radius = data.radius || 10;
    this.affectedTargets = [];
  }

  // 오라는 범위 내 모든 대상에게 적용
  apply(stacks = 1, duration = null) {
    super.apply(stacks, duration);

    // 범위 내 대상 찾기
    this.updateAffectedTargets();
  }

  updateAffectedTargets() {
    // 범위 내 아군/적군 찾기
    this.affectedTargets = [];

    const targetList = this.player.sim.playerList;
    for (const target of targetList) {
      // 거리 체크 (간단한 구현)
      if (target !== this.player) {
        this.affectedTargets.push(target);
        // 대상에게 버프 효과 적용
      }
    }
  }
}

export { Buff, Debuff, Aura, BUFF_TYPE, STACK_BEHAVIOR };