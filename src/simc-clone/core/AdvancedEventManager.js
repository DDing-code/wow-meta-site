/**
 * SimulationCraft 고도화된 이벤트 매니저
 * Phase 1.1 - 1,000줄 목표
 *
 * 핵심 기능:
 * - 우선순위 큐 최적화
 * - 동시 이벤트 처리
 * - 이벤트 체인 및 의존성
 * - 고급 디버깅 기능
 */

// ==================== 이벤트 타입 정의 ====================
const EVENT_TYPE = {
  // 플레이어 이벤트
  PLAYER_READY: 'player_ready',
  PLAYER_REGEN: 'player_regen',
  PLAYER_CAST_START: 'player_cast_start',
  PLAYER_CAST_FINISH: 'player_cast_finish',
  PLAYER_GCD_FINISH: 'player_gcd_finish',

  // 액션 이벤트
  ACTION_EXECUTE: 'action_execute',
  ACTION_TICK: 'action_tick',
  ACTION_TRAVEL: 'action_travel',
  ACTION_IMPACT: 'action_impact',

  // 버프/디버프 이벤트
  BUFF_APPLY: 'buff_apply',
  BUFF_EXPIRE: 'buff_expire',
  BUFF_TICK: 'buff_tick',
  BUFF_REFRESH: 'buff_refresh',
  BUFF_STACK_CHANGE: 'buff_stack_change',

  // 쿨다운 이벤트
  COOLDOWN_READY: 'cooldown_ready',
  COOLDOWN_CHARGE_GAINED: 'cooldown_charge_gained',

  // 리소스 이벤트
  RESOURCE_OVERFLOW: 'resource_overflow',
  RESOURCE_DEPLETED: 'resource_depleted',
  RESOURCE_REGEN: 'resource_regen',

  // 전투 이벤트
  COMBAT_BEGIN: 'combat_begin',
  COMBAT_END: 'combat_end',
  PHASE_CHANGE: 'phase_change',

  // 레이드 이벤트
  RAID_ADD_SPAWN: 'raid_add_spawn',
  RAID_MOVEMENT: 'raid_movement',
  RAID_DAMAGE: 'raid_damage',
  RAID_MECHANIC: 'raid_mechanic',

  // 시스템 이벤트
  SAMPLE_DATA: 'sample_data',
  DEBUG_CHECKPOINT: 'debug_checkpoint'
};

// ==================== 이벤트 우선순위 ====================
const EVENT_PRIORITY = {
  CRITICAL: 0,      // 즉시 처리 (죽음 등)
  HIGH: 1,          // 높음 (데미지, 힐)
  NORMAL: 2,        // 보통 (버프, 액션)
  LOW: 3,           // 낮음 (리소스 재생)
  BACKGROUND: 4     // 백그라운드 (통계 수집)
};

// ==================== 고급 이벤트 클래스 ====================
class AdvancedEvent {
  constructor(data = {}) {
    // 기본 속성
    this.id = AdvancedEvent.nextId++;
    this.time = data.time || 0;
    this.type = data.type || EVENT_TYPE.ACTION_EXECUTE;
    this.priority = data.priority || EVENT_PRIORITY.NORMAL;

    // 실행 정보
    this.actor = data.actor || null;
    this.target = data.target || null;
    this.action = data.action || null;
    this.callback = data.callback || null;

    // 상태
    this.canceled = false;
    this.executed = false;
    this.paused = false;

    // 체인 및 의존성
    this.parent = data.parent || null;
    this.children = [];
    this.dependencies = data.dependencies || [];
    this.dependents = [];

    // 재시도 및 오류 처리
    this.retryCount = 0;
    this.maxRetries = data.maxRetries || 0;
    this.onError = data.onError || null;

    // 메타데이터
    this.data = data.data || {};
    this.tags = data.tags || [];
    this.createdAt = Date.now();
    this.scheduledBy = data.scheduledBy || null;

    // 디버깅
    this.debugInfo = data.debugInfo || '';
    this.stackTrace = this.captureStackTrace();
  }

  // 스택 트레이스 캡처 (디버깅용)
  captureStackTrace() {
    if (!AdvancedEventManager.debugMode) return null;

    const stack = new Error().stack;
    return stack ? stack.split('\n').slice(2, 5) : null;
  }

  // 이벤트 실행
  execute(manager) {
    if (this.canceled || this.executed) return false;

    // 의존성 체크
    if (!this.checkDependencies()) {
      return this.reschedule(manager);
    }

    try {
      // 콜백 실행
      if (this.callback) {
        this.callback(this);
      }

      this.executed = true;

      // 자식 이벤트 스케줄
      this.scheduleChildren(manager);

      // 의존 이벤트 알림
      this.notifyDependents();

      // 디버그 로깅
      if (AdvancedEventManager.debugMode) {
        this.logExecution(manager);
      }

      return true;

    } catch (error) {
      return this.handleError(error, manager);
    }
  }

  // 의존성 체크
  checkDependencies() {
    for (const dep of this.dependencies) {
      if (dep instanceof AdvancedEvent && !dep.executed) {
        return false;
      } else if (typeof dep === 'function' && !dep()) {
        return false;
      }
    }
    return true;
  }

  // 재스케줄
  reschedule(manager, delay = 10) {
    if (!this.paused) {
      this.time += delay;
      manager.reschedule(this);
    }
    return false;
  }

  // 자식 이벤트 스케줄
  scheduleChildren(manager) {
    for (const child of this.children) {
      if (child instanceof AdvancedEvent) {
        manager.schedule(child);
      } else if (typeof child === 'function') {
        const childEvent = child(this);
        if (childEvent) {
          manager.schedule(childEvent);
        }
      }
    }
  }

  // 의존 이벤트 알림
  notifyDependents() {
    for (const dependent of this.dependents) {
      if (dependent.onDependencyComplete) {
        dependent.onDependencyComplete(this);
      }
    }
  }

  // 에러 처리
  handleError(error, manager) {
    console.error(`Event execution error: ${this.type}`, error);

    if (this.onError) {
      this.onError(error, this);
    }

    // 재시도 로직
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.executed = false;
      return this.reschedule(manager, 100);
    }

    return false;
  }

  // 실행 로깅
  logExecution(manager) {
    const log = {
      id: this.id,
      time: this.time,
      type: this.type,
      actor: this.actor?.name,
      target: this.target?.name,
      action: this.action?.name,
      duration: Date.now() - this.createdAt
    };

    manager.debugLog.push(log);

    if (AdvancedEventManager.verboseDebug) {
      console.log(`[${this.time}ms] ${this.type}:`, log);
    }
  }

  // 이벤트 취소
  cancel() {
    this.canceled = true;

    // 자식 이벤트도 취소
    for (const child of this.children) {
      if (child instanceof AdvancedEvent) {
        child.cancel();
      }
    }
  }

  // 이벤트 일시정지
  pause() {
    this.paused = true;
  }

  // 이벤트 재개
  resume() {
    this.paused = false;
  }

  // 체인 생성
  then(callback, delay = 0) {
    const chainedEvent = new AdvancedEvent({
      time: this.time + delay,
      callback: callback,
      parent: this,
      dependencies: [this]
    });

    this.children.push(chainedEvent);
    return chainedEvent;
  }

  // 병렬 실행
  parallel(...callbacks) {
    const parallelEvents = callbacks.map(cb => {
      return new AdvancedEvent({
        time: this.time,
        callback: cb,
        parent: this
      });
    });

    this.children.push(...parallelEvents);
    return this;
  }

  // 조건부 실행
  if(condition, trueCallback, falseCallback = null) {
    this.then((event) => {
      const result = typeof condition === 'function' ? condition(event) : condition;

      if (result && trueCallback) {
        trueCallback(event);
      } else if (!result && falseCallback) {
        falseCallback(event);
      }
    });

    return this;
  }

  // 반복 실행
  repeat(count, interval, callback) {
    for (let i = 0; i < count; i++) {
      this.then(callback, interval * i);
    }
    return this;
  }

  // 지연 실행
  delay(ms) {
    this.time += ms;
    return this;
  }

  // 태그 추가
  tag(...tags) {
    this.tags.push(...tags);
    return this;
  }

  // 데이터 설정
  setData(key, value) {
    this.data[key] = value;
    return this;
  }

  // 복제
  clone() {
    const cloned = new AdvancedEvent({
      time: this.time,
      type: this.type,
      priority: this.priority,
      actor: this.actor,
      target: this.target,
      action: this.action,
      callback: this.callback,
      data: { ...this.data },
      tags: [...this.tags]
    });

    return cloned;
  }
}

// 이벤트 ID 카운터
AdvancedEvent.nextId = 1;

// ==================== 고도화된 이벤트 매니저 ====================
class AdvancedEventManager {
  constructor(sim) {
    this.sim = sim;

    // 이벤트 큐 (우선순위별)
    this.queues = {
      [EVENT_PRIORITY.CRITICAL]: [],
      [EVENT_PRIORITY.HIGH]: [],
      [EVENT_PRIORITY.NORMAL]: [],
      [EVENT_PRIORITY.LOW]: [],
      [EVENT_PRIORITY.BACKGROUND]: []
    };

    // 동시 이벤트 처리
    this.simultaneousEvents = new Map(); // time -> [events]

    // 이벤트 인덱스
    this.eventById = new Map();
    this.eventsByType = new Map();
    this.eventsByActor = new Map();
    this.eventsByTag = new Map();

    // 스케줄된 이벤트
    this.scheduledEvents = [];
    this.canceledEvents = [];

    // 시간 관리
    this.currentTime = 0;
    this.lastEventTime = 0;
    this.maxTime = sim?.maxTime || 300000;

    // 통계
    this.stats = {
      totalScheduled: 0,
      totalExecuted: 0,
      totalCanceled: 0,
      totalRetried: 0,
      totalErrors: 0,
      executionTime: 0,
      eventCounts: {}
    };

    // 디버깅
    this.debugLog = [];
    this.checkpoints = [];
    this.breakpoints = new Set();

    // 이벤트 리스너
    this.listeners = new Map();

    // 성능 최적화
    this.batchSize = 100;
    this.cacheSize = 1000;
    this.eventCache = [];

    // 이벤트 풀 (재사용)
    this.eventPool = [];
    this.maxPoolSize = 500;
  }

  // 이벤트 스케줄 (최적화된 바이너리 서치)
  schedule(event) {
    if (!(event instanceof AdvancedEvent)) {
      event = new AdvancedEvent(event);
    }

    // 통계
    this.stats.totalScheduled++;
    this.stats.eventCounts[event.type] = (this.stats.eventCounts[event.type] || 0) + 1;

    // 인덱싱
    this.indexEvent(event);

    // 동시 이벤트 처리
    if (this.hasSimultaneousEvents(event.time)) {
      this.addSimultaneousEvent(event);
    } else {
      // 우선순위 큐에 추가
      const queue = this.queues[event.priority];
      const insertIndex = this.findInsertIndex(queue, event.time);
      queue.splice(insertIndex, 0, event);
    }

    // 이벤트 리스너 호출
    this.emit('schedule', event);

    return event;
  }

  // 바이너리 서치로 삽입 위치 찾기
  findInsertIndex(queue, time) {
    let left = 0;
    let right = queue.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      if (queue[mid].time > time) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return left;
  }

  // 동시 이벤트 확인
  hasSimultaneousEvents(time) {
    return this.simultaneousEvents.has(time);
  }

  // 동시 이벤트 추가
  addSimultaneousEvent(event) {
    if (!this.simultaneousEvents.has(event.time)) {
      this.simultaneousEvents.set(event.time, []);
    }

    this.simultaneousEvents.get(event.time).push(event);
  }

  // 이벤트 인덱싱
  indexEvent(event) {
    // ID 인덱스
    this.eventById.set(event.id, event);

    // 타입별 인덱스
    if (!this.eventsByType.has(event.type)) {
      this.eventsByType.set(event.type, new Set());
    }
    this.eventsByType.get(event.type).add(event);

    // 액터별 인덱스
    if (event.actor) {
      if (!this.eventsByActor.has(event.actor)) {
        this.eventsByActor.set(event.actor, new Set());
      }
      this.eventsByActor.get(event.actor).add(event);
    }

    // 태그별 인덱스
    for (const tag of event.tags) {
      if (!this.eventsByTag.has(tag)) {
        this.eventsByTag.set(tag, new Set());
      }
      this.eventsByTag.get(tag).add(event);
    }
  }

  // 이벤트 실행 루프
  execute() {
    const startTime = Date.now();
    let eventsProcessed = 0;

    while (!this.isEmpty() && this.currentTime < this.maxTime) {
      // 디버그 브레이크포인트
      if (this.breakpoints.has(this.currentTime)) {
        this.debugBreak();
      }

      // 다음 이벤트 가져오기
      const event = this.getNextEvent();
      if (!event) break;

      // 시간 진행
      this.currentTime = event.time;
      this.sim.currentTime = event.time;

      // 동시 이벤트 처리
      const simultaneousEvents = this.getSimultaneousEvents(event.time);

      if (simultaneousEvents.length > 0) {
        this.executeSimultaneous([event, ...simultaneousEvents]);
      } else {
        this.executeEvent(event);
      }

      eventsProcessed++;

      // 배치 처리 (성능 최적화)
      if (eventsProcessed % this.batchSize === 0) {
        this.processBatch();
      }
    }

    this.stats.executionTime += Date.now() - startTime;
    this.emit('complete', this.stats);
  }

  // 다음 이벤트 가져오기 (우선순위 고려)
  getNextEvent() {
    let nextEvent = null;
    let nextTime = Infinity;
    let nextPriority = null;

    // 모든 우선순위 큐 확인
    for (const priority of Object.values(EVENT_PRIORITY)) {
      const queue = this.queues[priority];

      if (queue.length > 0 && queue[0].time < nextTime) {
        nextTime = queue[0].time;
        nextPriority = priority;
      }
    }

    if (nextPriority !== null) {
      nextEvent = this.queues[nextPriority].shift();
    }

    return nextEvent;
  }

  // 동시 이벤트 가져오기
  getSimultaneousEvents(time) {
    const events = this.simultaneousEvents.get(time) || [];
    this.simultaneousEvents.delete(time);
    return events;
  }

  // 단일 이벤트 실행
  executeEvent(event) {
    if (event.canceled) {
      this.stats.totalCanceled++;
      return;
    }

    const success = event.execute(this);

    if (success) {
      this.stats.totalExecuted++;
      this.lastEventTime = event.time;
      this.emit('execute', event);
    } else {
      this.stats.totalErrors++;
      this.emit('error', event);
    }

    // 이벤트 풀로 반환
    this.returnToPool(event);
  }

  // 동시 이벤트 실행
  executeSimultaneous(events) {
    // 우선순위로 정렬
    events.sort((a, b) => a.priority - b.priority);

    // 순차 실행
    for (const event of events) {
      this.executeEvent(event);
    }
  }

  // 배치 처리
  processBatch() {
    // 가비지 컬렉션 힌트
    if (this.canceledEvents.length > 100) {
      this.canceledEvents = [];
    }

    // 캐시 정리
    if (this.eventCache.length > this.cacheSize) {
      this.eventCache = this.eventCache.slice(-this.cacheSize / 2);
    }
  }

  // 이벤트 재스케줄
  reschedule(event) {
    this.schedule(event);
  }

  // 이벤트 취소
  cancel(eventOrId) {
    let event;

    if (typeof eventOrId === 'number') {
      event = this.eventById.get(eventOrId);
    } else {
      event = eventOrId;
    }

    if (event) {
      event.cancel();
      this.canceledEvents.push(event);
      this.emit('cancel', event);
    }
  }

  // 타입별 이벤트 취소
  cancelByType(type) {
    const events = this.eventsByType.get(type);

    if (events) {
      for (const event of events) {
        this.cancel(event);
      }
    }
  }

  // 액터별 이벤트 취소
  cancelByActor(actor) {
    const events = this.eventsByActor.get(actor);

    if (events) {
      for (const event of events) {
        this.cancel(event);
      }
    }
  }

  // 태그별 이벤트 취소
  cancelByTag(tag) {
    const events = this.eventsByTag.get(tag);

    if (events) {
      for (const event of events) {
        this.cancel(event);
      }
    }
  }

  // 모든 이벤트 취소
  cancelAll() {
    for (const queue of Object.values(this.queues)) {
      for (const event of queue) {
        event.cancel();
      }
      queue.length = 0;
    }

    this.simultaneousEvents.clear();
  }

  // 이벤트 검색
  find(predicate) {
    for (const queue of Object.values(this.queues)) {
      const event = queue.find(predicate);
      if (event) return event;
    }

    return null;
  }

  // 모든 이벤트 검색
  findAll(predicate) {
    const results = [];

    for (const queue of Object.values(this.queues)) {
      results.push(...queue.filter(predicate));
    }

    return results;
  }

  // 이벤트 리스너 등록
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }

    this.listeners.get(eventType).push(callback);
  }

  // 이벤트 리스너 제거
  off(eventType, callback) {
    const listeners = this.listeners.get(eventType);

    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // 이벤트 발생
  emit(eventType, data) {
    const listeners = this.listeners.get(eventType);

    if (listeners) {
      for (const callback of listeners) {
        callback(data);
      }
    }
  }

  // 이벤트 풀 관리
  getFromPool() {
    if (this.eventPool.length > 0) {
      return this.eventPool.pop();
    }

    return new AdvancedEvent();
  }

  returnToPool(event) {
    if (this.eventPool.length < this.maxPoolSize) {
      // 이벤트 초기화
      event.canceled = false;
      event.executed = false;
      event.children = [];
      event.dependencies = [];
      event.dependents = [];

      this.eventPool.push(event);
    }
  }

  // 큐가 비었는지 확인
  isEmpty() {
    for (const queue of Object.values(this.queues)) {
      if (queue.length > 0) return false;
    }

    return this.simultaneousEvents.size === 0;
  }

  // 큐 크기
  size() {
    let total = 0;

    for (const queue of Object.values(this.queues)) {
      total += queue.length;
    }

    for (const events of this.simultaneousEvents.values()) {
      total += events.length;
    }

    return total;
  }

  // 리셋
  reset() {
    this.cancelAll();
    this.currentTime = 0;
    this.lastEventTime = 0;
    this.stats = {
      totalScheduled: 0,
      totalExecuted: 0,
      totalCanceled: 0,
      totalRetried: 0,
      totalErrors: 0,
      executionTime: 0,
      eventCounts: {}
    };
    this.debugLog = [];
    this.checkpoints = [];
    this.eventCache = [];
  }

  // 디버그 브레이크
  debugBreak() {
    console.log(`[BREAKPOINT] Time: ${this.currentTime}ms`);
    console.log(`Queue sizes:`, this.getQueueSizes());
    console.log(`Stats:`, this.stats);

    if (AdvancedEventManager.pauseOnBreak) {
      debugger; // 브라우저 디버거 중단점
    }
  }

  // 큐 크기 정보
  getQueueSizes() {
    const sizes = {};

    for (const [priority, queue] of Object.entries(this.queues)) {
      sizes[priority] = queue.length;
    }

    return sizes;
  }

  // 체크포인트 추가
  addCheckpoint(name, data = {}) {
    this.checkpoints.push({
      name,
      time: this.currentTime,
      data,
      stats: { ...this.stats }
    });
  }

  // 체크포인트 가져오기
  getCheckpoint(name) {
    return this.checkpoints.find(cp => cp.name === name);
  }

  // 스냅샷 생성
  createSnapshot() {
    return {
      currentTime: this.currentTime,
      queueSizes: this.getQueueSizes(),
      stats: { ...this.stats },
      eventCount: this.size()
    };
  }

  // 통계 리포트
  getReport() {
    const avgExecutionTime = this.stats.totalExecuted > 0
      ? this.stats.executionTime / this.stats.totalExecuted
      : 0;

    return {
      summary: {
        totalScheduled: this.stats.totalScheduled,
        totalExecuted: this.stats.totalExecuted,
        totalCanceled: this.stats.totalCanceled,
        totalErrors: this.stats.totalErrors,
        successRate: this.stats.totalExecuted / this.stats.totalScheduled,
        avgExecutionTime: avgExecutionTime.toFixed(2)
      },
      byType: this.stats.eventCounts,
      timeline: this.checkpoints
    };
  }
}

// 정적 설정
AdvancedEventManager.debugMode = false;
AdvancedEventManager.verboseDebug = false;
AdvancedEventManager.pauseOnBreak = false;

// ==================== 이벤트 빌더 (편의 클래스) ====================
class EventBuilder {
  constructor(manager) {
    this.manager = manager;
    this.event = new AdvancedEvent();
  }

  at(time) {
    this.event.time = time;
    return this;
  }

  type(type) {
    this.event.type = type;
    return this;
  }

  priority(priority) {
    this.event.priority = priority;
    return this;
  }

  actor(actor) {
    this.event.actor = actor;
    return this;
  }

  target(target) {
    this.event.target = target;
    return this;
  }

  action(action) {
    this.event.action = action;
    return this;
  }

  callback(callback) {
    this.event.callback = callback;
    return this;
  }

  data(data) {
    this.event.data = data;
    return this;
  }

  tags(...tags) {
    this.event.tags = tags;
    return this;
  }

  dependsOn(...dependencies) {
    this.event.dependencies = dependencies;
    return this;
  }

  schedule() {
    return this.manager.schedule(this.event);
  }
}

// ==================== 내보내기 ====================
export {
  AdvancedEventManager,
  AdvancedEvent,
  EventBuilder,
  EVENT_TYPE,
  EVENT_PRIORITY
};