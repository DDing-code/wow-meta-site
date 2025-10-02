/**
 * Phase 1.3: Combat Controller
 * 전투 관리, 페이즈 전환, 타겟 처리, 전투 흐름 제어
 * SimC 스타일 전투 컨트롤러 완전 구현
 * Lines: ~2,000
 */

import { EVENT_TYPE, EVENT_PRIORITY } from './AdvancedEventManager.js';

// ==================== 전투 상태 ====================
export const COMBAT_STATE = {
  NONE: 'none',
  PRECOMBAT: 'precombat',
  COMBAT: 'combat',
  FINISHING: 'finishing',
  FINISHED: 'finished'
};

// ==================== 전투 페이즈 ====================
export const COMBAT_PHASE = {
  NORMAL: 'normal',
  BURN: 'burn',
  CONSERVE: 'conserve',
  EXECUTE: 'execute',
  MOVEMENT: 'movement',
  INTERMISSION: 'intermission',
  HERO: 'hero', // Hero/Bloodlust phase
  VULNERABILITY: 'vulnerability' // Boss vulnerability window
};

// ==================== 타겟 타입 ====================
export const TARGET_TYPE = {
  BOSS: 'boss',
  ADD: 'add',
  PRIORITY_ADD: 'priority_add',
  DUMMY: 'dummy',
  PLAYER: 'player',
  ENVIRONMENT: 'environment'
};

// ==================== 포지션 ====================
export const POSITION = {
  MELEE: 'melee',
  RANGED: 'ranged',
  SPREAD: 'spread',
  STACK: 'stack',
  BEHIND: 'behind',
  FRONT: 'front',
  SIDE: 'side'
};

// ==================== 전투 이벤트 타입 ====================
export const COMBAT_EVENT = {
  // 전투 시작/종료
  COMBAT_START: 'combat_start',
  COMBAT_END: 'combat_end',
  COMBAT_RESET: 'combat_reset',

  // 페이즈 전환
  PHASE_START: 'phase_start',
  PHASE_END: 'phase_end',
  PHASE_TRANSITION: 'phase_transition',

  // 타겟
  TARGET_ADD: 'target_add',
  TARGET_REMOVE: 'target_remove',
  TARGET_SWITCH: 'target_switch',
  TARGET_DEATH: 'target_death',

  // 보스 메커니즘
  BOSS_CAST: 'boss_cast',
  BOSS_MECHANIC: 'boss_mechanic',
  BOSS_ENRAGE: 'boss_enrage',

  // 플레이어
  PLAYER_DEATH: 'player_death',
  PLAYER_RESURRECT: 'player_resurrect',
  PLAYER_MOVE: 'player_move',

  // 레이드 이벤트
  RAID_DAMAGE: 'raid_damage',
  RAID_BUFF: 'raid_buff',
  RAID_DEBUFF: 'raid_debuff',

  // 환경
  ENVIRONMENT_DAMAGE: 'environment_damage',
  ENVIRONMENT_EFFECT: 'environment_effect'
};

// ==================== 전투 컨트롤러 ====================
export class CombatController {
  constructor(simulation) {
    this.sim = simulation;
    this.state = COMBAT_STATE.NONE;
    this.phase = COMBAT_PHASE.NORMAL;
    this.previousPhase = null;

    // 전투 시간
    this.combatStartTime = 0;
    this.combatEndTime = 0;
    this.phaseStartTime = 0;
    this.lastActionTime = 0;

    // 타겟 관리
    this.targets = new Map(); // id -> target
    this.primaryTarget = null;
    this.targetPriority = new Map(); // target -> priority
    this.targetHistory = [];

    // 페이즈 관리
    this.phaseHistory = [];
    this.phaseTimers = new Map();
    this.phaseConditions = new Map();

    // 포지션 관리
    this.playerPositions = new Map(); // player -> position
    this.positionRequirements = new Map(); // phase -> position requirements

    // 전투 통계
    this.statistics = {
      totalDamage: 0,
      totalHealing: 0,
      deathCount: 0,
      interruptCount: 0,
      mechanicHandled: 0,
      mechanicFailed: 0,
      targetSwitches: 0,
      movementTime: 0,
      downtimeTotal: 0
    };

    // 이벤트 핸들러
    this.eventHandlers = new Map();
    this.mechanicHandlers = new Map();

    // 전투 설정
    this.config = {
      maxCombatTime: 600000, // 10분
      enrageTimer: 540000, // 9분
      executePhaseThreshold: 0.35, // 35% HP
      heroPhaseTime: 180000, // 3분에 Hero/Bloodlust
      targetSwitchDelay: 500, // 타겟 전환 딜레이
      movementPenalty: 0.5, // 이동 중 DPS 감소
      positionCheckInterval: 1000, // 위치 확인 주기
      raidSize: 20,
      allowResurrect: true,
      strictPositioning: false
    };

    // 보스 메커니즘 타임라인
    this.mechanicTimeline = [];
    this.upcomingMechanics = [];

    // 레이드 버프/디버프
    this.raidBuffs = new Set();
    this.raidDebuffs = new Set();

    // 전투 로그
    this.combatLog = [];
    this.debugMode = false;

    this.initialize();
  }

  // ==================== 초기화 ====================
  initialize() {
    this.registerDefaultHandlers();
    this.setupPhaseConditions();
    this.loadMechanicTimeline();
  }

  registerDefaultHandlers() {
    // 전투 시작/종료
    this.registerEventHandler(COMBAT_EVENT.COMBAT_START, this.handleCombatStart.bind(this));
    this.registerEventHandler(COMBAT_EVENT.COMBAT_END, this.handleCombatEnd.bind(this));

    // 페이즈 전환
    this.registerEventHandler(COMBAT_EVENT.PHASE_START, this.handlePhaseStart.bind(this));
    this.registerEventHandler(COMBAT_EVENT.PHASE_END, this.handlePhaseEnd.bind(this));

    // 타겟
    this.registerEventHandler(COMBAT_EVENT.TARGET_DEATH, this.handleTargetDeath.bind(this));
    this.registerEventHandler(COMBAT_EVENT.TARGET_SWITCH, this.handleTargetSwitch.bind(this));

    // 보스 메커니즘
    this.registerEventHandler(COMBAT_EVENT.BOSS_MECHANIC, this.handleBossMechanic.bind(this));
    this.registerEventHandler(COMBAT_EVENT.BOSS_ENRAGE, this.handleEnrage.bind(this));

    // 플레이어
    this.registerEventHandler(COMBAT_EVENT.PLAYER_DEATH, this.handlePlayerDeath.bind(this));
    this.registerEventHandler(COMBAT_EVENT.PLAYER_MOVE, this.handlePlayerMove.bind(this));
  }

  setupPhaseConditions() {
    // Execute 페이즈 조건
    this.phaseConditions.set(COMBAT_PHASE.EXECUTE, () => {
      return this.primaryTarget &&
             this.primaryTarget.getHealthPercent() <= this.config.executePhaseThreshold;
    });

    // Hero 페이즈 조건
    this.phaseConditions.set(COMBAT_PHASE.HERO, () => {
      return this.getCombatTime() >= this.config.heroPhaseTime &&
             !this.phaseHistory.includes(COMBAT_PHASE.HERO);
    });

    // Movement 페이즈 조건
    this.phaseConditions.set(COMBAT_PHASE.MOVEMENT, () => {
      return this.isMovementRequired();
    });

    // Vulnerability 페이즈 조건
    this.phaseConditions.set(COMBAT_PHASE.VULNERABILITY, () => {
      return this.primaryTarget &&
             this.primaryTarget.hasDebuff('vulnerability');
    });
  }

  loadMechanicTimeline() {
    // 보스 메커니즘 타임라인 (예시)
    this.mechanicTimeline = [
      { time: 30000, name: 'Tank Buster', type: 'tankbuster', damage: 500000 },
      { time: 60000, name: 'Raid Wide', type: 'raidwide', damage: 200000 },
      { time: 90000, name: 'Add Phase', type: 'adds', count: 3 },
      { time: 120000, name: 'Movement', type: 'movement', duration: 5000 },
      { time: 180000, name: 'Hero Phase', type: 'hero', duration: 40000 },
      { time: 240000, name: 'Intermission', type: 'intermission', duration: 30000 },
      { time: 300000, name: 'Burn Phase', type: 'burn' },
      { time: 540000, name: 'Enrage', type: 'enrage' }
    ];
  }

  // ==================== 전투 제어 ====================
  startCombat() {
    if (this.state !== COMBAT_STATE.NONE) {
      this.log('Combat already started');
      return;
    }

    this.state = COMBAT_STATE.PRECOMBAT;
    this.combatStartTime = this.sim.currentTime;

    // Precombat 액션 실행
    this.executePrecombat();

    // 실제 전투 시작
    this.sim.scheduleEvent({
      time: this.sim.currentTime + 1000, // 1초 후
      type: EVENT_TYPE.COMBAT,
      subtype: COMBAT_EVENT.COMBAT_START,
      callback: () => {
        this.state = COMBAT_STATE.COMBAT;
        this.phase = COMBAT_PHASE.NORMAL;
        this.phaseStartTime = this.sim.currentTime;

        this.triggerEvent(COMBAT_EVENT.COMBAT_START);
        this.scheduleMechanics();
        this.startPhaseChecker();

        this.log('===== COMBAT START =====');
      }
    });
  }

  endCombat(reason = 'normal') {
    if (this.state === COMBAT_STATE.FINISHED) {
      return;
    }

    this.state = COMBAT_STATE.FINISHING;
    this.combatEndTime = this.sim.currentTime;

    // 전투 종료 처리
    this.sim.scheduleEvent({
      time: this.sim.currentTime + 100,
      type: EVENT_TYPE.COMBAT,
      subtype: COMBAT_EVENT.COMBAT_END,
      callback: () => {
        this.state = COMBAT_STATE.FINISHED;
        this.triggerEvent(COMBAT_EVENT.COMBAT_END, { reason });

        // 통계 계산
        this.calculateFinalStatistics();

        this.log(`===== COMBAT END (${reason}) =====`);
        this.log(`Duration: ${(this.combatEndTime - this.combatStartTime) / 1000}s`);
        this.log(`Total Damage: ${this.statistics.totalDamage}`);
        this.log(`Deaths: ${this.statistics.deathCount}`);
      }
    });
  }

  resetCombat() {
    this.state = COMBAT_STATE.NONE;
    this.phase = COMBAT_PHASE.NORMAL;
    this.targets.clear();
    this.primaryTarget = null;
    this.phaseHistory = [];
    this.combatLog = [];
    this.statistics = {
      totalDamage: 0,
      totalHealing: 0,
      deathCount: 0,
      interruptCount: 0,
      mechanicHandled: 0,
      mechanicFailed: 0,
      targetSwitches: 0,
      movementTime: 0,
      downtimeTotal: 0
    };

    this.triggerEvent(COMBAT_EVENT.COMBAT_RESET);
  }

  // ==================== Precombat ====================
  executePrecombat() {
    // 플레이어들의 precombat 액션 실행
    for (const player of this.sim.players) {
      if (player.apl && player.apl.precombat) {
        for (const action of player.apl.precombat) {
          this.sim.scheduleEvent({
            time: this.sim.currentTime,
            type: EVENT_TYPE.ACTION,
            actor: player,
            callback: () => {
              player.executeAction(action);
            }
          });
        }
      }

      // 플라스크, 음식, 룬 등
      this.applyConsumables(player);
    }
  }

  applyConsumables(player) {
    // 플라스크
    if (player.consumables?.flask) {
      player.applyBuff({
        name: player.consumables.flask,
        duration: 3600000, // 1시간
        stats: this.getFlaskStats(player.consumables.flask)
      });
    }

    // 음식
    if (player.consumables?.food) {
      player.applyBuff({
        name: player.consumables.food,
        duration: 3600000,
        stats: this.getFoodStats(player.consumables.food)
      });
    }

    // 무기 강화
    if (player.consumables?.augmentRune) {
      player.applyBuff({
        name: 'Augment Rune',
        duration: 3600000,
        stats: { primaryStat: 18 }
      });
    }
  }

  // ==================== 페이즈 관리 ====================
  checkPhaseTransitions() {
    // 모든 페이즈 조건 확인
    for (const [phase, condition] of this.phaseConditions) {
      if (phase !== this.phase && condition()) {
        this.transitionToPhase(phase);
        break;
      }
    }
  }

  transitionToPhase(newPhase) {
    if (this.phase === newPhase) return;

    const oldPhase = this.phase;

    // 페이즈 종료 이벤트
    this.triggerEvent(COMBAT_EVENT.PHASE_END, {
      phase: oldPhase,
      duration: this.sim.currentTime - this.phaseStartTime
    });

    // 페이즈 전환
    this.previousPhase = oldPhase;
    this.phase = newPhase;
    this.phaseStartTime = this.sim.currentTime;
    this.phaseHistory.push(newPhase);

    // 페이즈 시작 이벤트
    this.triggerEvent(COMBAT_EVENT.PHASE_START, {
      phase: newPhase,
      previousPhase: oldPhase
    });

    // 페이즈별 특수 처리
    this.applyPhaseEffects(newPhase);

    this.log(`Phase Transition: ${oldPhase} → ${newPhase}`);
  }

  applyPhaseEffects(phase) {
    switch (phase) {
      case COMBAT_PHASE.HERO:
        // Bloodlust/Heroism 적용
        this.applyRaidBuff('Bloodlust', {
          duration: 40000,
          hastePercent: 30
        });
        break;

      case COMBAT_PHASE.EXECUTE:
        // Execute 페이즈 버프
        for (const player of this.sim.players) {
          if (player.hasExecuteAbilities) {
            player.applyBuff({
              name: 'Execute Phase',
              duration: 999999,
              damageMultiplier: 1.1
            });
          }
        }
        break;

      case COMBAT_PHASE.BURN:
        // 모든 쿨다운 초기화
        for (const player of this.sim.players) {
          player.resetMajorCooldowns();
        }
        break;

      case COMBAT_PHASE.MOVEMENT:
        // 이동 디버프 적용
        this.applyRaidDebuff('Movement Required', {
          duration: 5000,
          damageMultiplier: this.config.movementPenalty
        });
        break;

      case COMBAT_PHASE.INTERMISSION:
        // 보스 무적
        if (this.primaryTarget) {
          this.primaryTarget.applyBuff({
            name: 'Intermission',
            duration: 30000,
            immuneToAll: true
          });
        }
        break;
    }
  }

  startPhaseChecker() {
    const checkInterval = 500; // 0.5초마다 확인

    const checker = () => {
      if (this.state !== COMBAT_STATE.COMBAT) return;

      this.checkPhaseTransitions();

      this.sim.scheduleEvent({
        time: this.sim.currentTime + checkInterval,
        type: EVENT_TYPE.SYSTEM,
        callback: checker
      });
    };

    checker();
  }

  // ==================== 타겟 관리 ====================
  addTarget(target, type = TARGET_TYPE.ADD, priority = 0) {
    this.targets.set(target.id, target);
    this.targetPriority.set(target, priority);
    target.targetType = type;

    // 첫 타겟이면 primary로 설정
    if (!this.primaryTarget) {
      this.setPrimaryTarget(target);
    }

    this.triggerEvent(COMBAT_EVENT.TARGET_ADD, { target, type, priority });

    this.log(`Target Added: ${target.name} (${type}, priority: ${priority})`);
  }

  removeTarget(target) {
    this.targets.delete(target.id);
    this.targetPriority.delete(target);

    if (this.primaryTarget === target) {
      // 새로운 primary 타겟 선택
      this.selectNewPrimaryTarget();
    }

    this.triggerEvent(COMBAT_EVENT.TARGET_REMOVE, { target });

    this.log(`Target Removed: ${target.name}`);
  }

  setPrimaryTarget(target) {
    const oldTarget = this.primaryTarget;
    this.primaryTarget = target;

    if (oldTarget !== target) {
      this.targetHistory.push({
        target: target,
        time: this.sim.currentTime
      });

      this.statistics.targetSwitches++;

      this.triggerEvent(COMBAT_EVENT.TARGET_SWITCH, {
        oldTarget,
        newTarget: target
      });

      // 타겟 전환 딜레이 적용
      this.applyTargetSwitchPenalty();
    }
  }

  selectNewPrimaryTarget() {
    let highestPriority = -1;
    let newTarget = null;

    for (const [target, priority] of this.targetPriority) {
      if (priority > highestPriority && target.isAlive()) {
        highestPriority = priority;
        newTarget = target;
      }
    }

    if (newTarget) {
      this.setPrimaryTarget(newTarget);
    } else {
      this.primaryTarget = null;
    }
  }

  applyTargetSwitchPenalty() {
    // 타겟 전환 시 짧은 딜레이
    for (const player of this.sim.players) {
      player.applyDebuff({
        name: 'Target Switch',
        duration: this.config.targetSwitchDelay,
        cannotAct: true
      });
    }
  }

  getTargetsByPriority() {
    return Array.from(this.targetPriority.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
  }

  getTargetsInRange(position, range) {
    return Array.from(this.targets.values()).filter(target => {
      return this.calculateDistance(position, target.position) <= range;
    });
  }

  // ==================== 보스 메커니즘 ====================
  scheduleMechanics() {
    for (const mechanic of this.mechanicTimeline) {
      this.sim.scheduleEvent({
        time: this.combatStartTime + mechanic.time,
        type: EVENT_TYPE.MECHANIC,
        priority: EVENT_PRIORITY.HIGH,
        callback: () => this.executeMechanic(mechanic)
      });
    }
  }

  executeMechanic(mechanic) {
    this.log(`Executing Mechanic: ${mechanic.name}`);

    this.triggerEvent(COMBAT_EVENT.BOSS_MECHANIC, { mechanic });

    switch (mechanic.type) {
      case 'tankbuster':
        this.executeTankbuster(mechanic);
        break;
      case 'raidwide':
        this.executeRaidwide(mechanic);
        break;
      case 'adds':
        this.spawnAdds(mechanic);
        break;
      case 'movement':
        this.requireMovement(mechanic);
        break;
      case 'hero':
        this.transitionToPhase(COMBAT_PHASE.HERO);
        break;
      case 'intermission':
        this.transitionToPhase(COMBAT_PHASE.INTERMISSION);
        break;
      case 'burn':
        this.transitionToPhase(COMBAT_PHASE.BURN);
        break;
      case 'enrage':
        this.executeEnrage();
        break;
      default:
        // 커스텀 메커니즘 핸들러 확인
        const handler = this.mechanicHandlers.get(mechanic.type);
        if (handler) {
          handler(mechanic);
        }
    }

    // 메커니즘 성공/실패 체크
    this.checkMechanicSuccess(mechanic);
  }

  executeTankbuster(mechanic) {
    const tank = this.getCurrentTank();
    if (tank) {
      const mitigated = tank.hasMitigation();
      const damage = mitigated ? mechanic.damage * 0.5 : mechanic.damage;

      tank.takeDamage(damage, 'physical', this.primaryTarget);

      if (!mitigated) {
        this.statistics.mechanicFailed++;
        this.log(`Tank Buster failed - no mitigation!`);
      } else {
        this.statistics.mechanicHandled++;
      }
    }
  }

  executeRaidwide(mechanic) {
    const damage = mechanic.damage;

    for (const player of this.sim.players) {
      if (player.isAlive()) {
        const mitigated = this.hasRaidMitigation() ? damage * 0.7 : damage;
        player.takeDamage(mitigated, 'magic', this.primaryTarget);
      }
    }

    this.triggerEvent(COMBAT_EVENT.RAID_DAMAGE, { damage });
  }

  spawnAdds(mechanic) {
    for (let i = 0; i < mechanic.count; i++) {
      const add = this.sim.createActor({
        name: `Add ${i + 1}`,
        health: 500000,
        level: 83
      });

      this.addTarget(add, TARGET_TYPE.ADD, 5); // 중간 우선순위
    }
  }

  requireMovement(mechanic) {
    this.transitionToPhase(COMBAT_PHASE.MOVEMENT);

    // 일정 시간 후 원래 페이즈로 복귀
    this.sim.scheduleEvent({
      time: this.sim.currentTime + mechanic.duration,
      type: EVENT_TYPE.SYSTEM,
      callback: () => {
        if (this.phase === COMBAT_PHASE.MOVEMENT) {
          this.transitionToPhase(this.previousPhase || COMBAT_PHASE.NORMAL);
        }
      }
    });
  }

  executeEnrage() {
    this.triggerEvent(COMBAT_EVENT.BOSS_ENRAGE);

    if (this.primaryTarget) {
      this.primaryTarget.applyBuff({
        name: 'Enrage',
        duration: 999999,
        damageMultiplier: 5.0,
        hastePercent: 100
      });
    }

    // 보통 엔레이지는 와이프를 의미
    this.sim.scheduleEvent({
      time: this.sim.currentTime + 10000, // 10초 후 전멸
      type: EVENT_TYPE.SYSTEM,
      callback: () => {
        this.endCombat('wipe');
      }
    });
  }

  checkMechanicSuccess(mechanic) {
    // 메커니즘별 성공 조건 체크
    let success = true;

    switch (mechanic.type) {
      case 'tankbuster':
        success = this.getCurrentTank()?.isAlive() || false;
        break;
      case 'raidwide':
        success = this.getAlivePlayersCount() >= this.config.raidSize * 0.75;
        break;
      case 'adds':
        // 일정 시간 내 처치 체크는 별도로
        break;
      case 'movement':
        success = this.checkMovementSuccess();
        break;
    }

    if (success) {
      this.statistics.mechanicHandled++;
    } else {
      this.statistics.mechanicFailed++;
    }
  }

  // ==================== 포지션 관리 ====================
  setPlayerPosition(player, position) {
    const oldPosition = this.playerPositions.get(player);
    this.playerPositions.set(player, position);

    if (oldPosition && oldPosition !== position) {
      this.triggerEvent(COMBAT_EVENT.PLAYER_MOVE, {
        player,
        from: oldPosition,
        to: position
      });

      // 이동 시간 추적
      this.statistics.movementTime += this.getMovementTime(oldPosition, position);
    }
  }

  getMovementTime(from, to) {
    // 포지션 간 이동 시간 계산
    const movementTimes = {
      'melee-ranged': 2000,
      'ranged-melee': 2000,
      'spread-stack': 1500,
      'stack-spread': 1500
    };

    const key = `${from}-${to}`;
    return movementTimes[key] || 1000;
  }

  isMovementRequired() {
    // 현재 메커니즘이 이동을 요구하는지
    const currentTime = this.getCombatTime();

    for (const mechanic of this.upcomingMechanics) {
      if (mechanic.type === 'movement' &&
          Math.abs(mechanic.time - currentTime) < 1000) {
        return true;
      }
    }

    return false;
  }

  checkMovementSuccess() {
    // 모든 플레이어가 올바른 위치에 있는지 확인
    const requiredPosition = this.positionRequirements.get(this.phase);
    if (!requiredPosition) return true;

    let success = true;
    for (const player of this.sim.players) {
      if (player.isAlive()) {
        const position = this.playerPositions.get(player);
        if (position !== requiredPosition) {
          success = false;
          player.takeDamage(100000, 'environmental'); // 위치 실패 데미지
        }
      }
    }

    return success;
  }

  calculateDistance(pos1, pos2) {
    // 간단한 거리 계산 (실제로는 3D 좌표 사용)
    if (pos1 === pos2) return 0;
    if ((pos1 === POSITION.MELEE && pos2 === POSITION.RANGED) ||
        (pos1 === POSITION.RANGED && pos2 === POSITION.MELEE)) {
      return 30; // 30 야드
    }
    return 10; // 기본 거리
  }

  // ==================== 레이드 버프/디버프 ====================
  applyRaidBuff(name, effects) {
    this.raidBuffs.add(name);

    for (const player of this.sim.players) {
      if (player.isAlive()) {
        player.applyBuff({
          name: `Raid: ${name}`,
          ...effects
        });
      }
    }

    this.triggerEvent(COMBAT_EVENT.RAID_BUFF, { name, effects });
  }

  applyRaidDebuff(name, effects) {
    this.raidDebuffs.add(name);

    for (const player of this.sim.players) {
      if (player.isAlive()) {
        player.applyDebuff({
          name: `Raid: ${name}`,
          ...effects
        });
      }
    }

    this.triggerEvent(COMBAT_EVENT.RAID_DEBUFF, { name, effects });
  }

  removeRaidBuff(name) {
    this.raidBuffs.delete(name);

    for (const player of this.sim.players) {
      player.removeBuff(`Raid: ${name}`);
    }
  }

  removeRaidDebuff(name) {
    this.raidDebuffs.delete(name);

    for (const player of this.sim.players) {
      player.removeDebuff(`Raid: ${name}`);
    }
  }

  hasRaidMitigation() {
    // 레이드 경감기 확인
    const mitigations = ['Devotion Aura', 'Rallying Cry', 'Darkness', 'Anti-Magic Zone'];

    for (const buff of this.raidBuffs) {
      if (mitigations.includes(buff)) {
        return true;
      }
    }

    return false;
  }

  // ==================== 이벤트 핸들러 ====================
  handleCombatStart(data) {
    // 전투 시작 처리
    for (const player of this.sim.players) {
      player.startCombat();
    }

    // 타겟 설정
    if (this.sim.targets.length > 0) {
      const boss = this.sim.targets[0];
      this.addTarget(boss, TARGET_TYPE.BOSS, 10); // 최고 우선순위
    }
  }

  handleCombatEnd(data) {
    // 전투 종료 처리
    for (const player of this.sim.players) {
      player.endCombat();
    }

    // 최종 통계 수집
    this.collectFinalStatistics();
  }

  handlePhaseStart(data) {
    // 페이즈 시작 알림
    for (const player of this.sim.players) {
      player.onPhaseStart(data.phase);
    }
  }

  handlePhaseEnd(data) {
    // 페이즈 종료 알림
    for (const player of this.sim.players) {
      player.onPhaseEnd(data.phase);
    }
  }

  handleTargetDeath(data) {
    const target = data.target;

    this.removeTarget(target);

    // 보스 처치 시 전투 종료
    if (target.targetType === TARGET_TYPE.BOSS) {
      const remainingBosses = Array.from(this.targets.values())
        .filter(t => t.targetType === TARGET_TYPE.BOSS && t.isAlive());

      if (remainingBosses.length === 0) {
        this.endCombat('victory');
      }
    }

    // 추가 몹 처치 보상
    if (target.targetType === TARGET_TYPE.ADD) {
      this.grantAddKillReward();
    }
  }

  handleTargetSwitch(data) {
    // 타겟 전환 처리
    for (const player of this.sim.players) {
      player.onTargetSwitch(data.newTarget);
    }
  }

  handleBossMechanic(data) {
    // 보스 메커니즘 처리
    const mechanic = data.mechanic;

    // 플레이어들에게 알림
    for (const player of this.sim.players) {
      player.onBossMechanic(mechanic);
    }
  }

  handleEnrage() {
    // 광폭화 처리
    this.log('BOSS ENRAGED!');

    // 모든 플레이어에게 알림
    for (const player of this.sim.players) {
      player.onEnrage();
    }
  }

  handlePlayerDeath(data) {
    const player = data.player;

    this.statistics.deathCount++;

    // 전투 부활 가능 여부 확인
    if (this.config.allowResurrect && this.hasBattleResurrect()) {
      this.scheduleResurrect(player);
    }

    // 너무 많은 사망 시 와이프
    if (this.getAlivePlayersCount() < this.config.raidSize * 0.3) {
      this.endCombat('wipe');
    }
  }

  handlePlayerMove(data) {
    const player = data.player;

    // 이동 패널티 적용
    player.applyDebuff({
      name: 'Moving',
      duration: this.getMovementTime(data.from, data.to),
      damageMultiplier: this.config.movementPenalty
    });
  }

  // ==================== 유틸리티 ====================
  getCombatTime() {
    return this.sim.currentTime - this.combatStartTime;
  }

  getPhaseTime() {
    return this.sim.currentTime - this.phaseStartTime;
  }

  getCurrentTank() {
    // 현재 탱커 찾기
    for (const player of this.sim.players) {
      if (player.role === 'tank' && player.isAlive()) {
        return player;
      }
    }
    return null;
  }

  getAlivePlayersCount() {
    return this.sim.players.filter(p => p.isAlive()).length;
  }

  hasBattleResurrect() {
    // 전투 부활 가능한 플레이어 확인
    for (const player of this.sim.players) {
      if (player.isAlive() && player.hasBattleResurrect()) {
        return true;
      }
    }
    return false;
  }

  scheduleResurrect(player) {
    this.sim.scheduleEvent({
      time: this.sim.currentTime + 3000, // 3초 캐스팅
      type: EVENT_TYPE.COMBAT,
      callback: () => {
        player.resurrect();
        this.triggerEvent(COMBAT_EVENT.PLAYER_RESURRECT, { player });
      }
    });
  }

  grantAddKillReward() {
    // 추가 몹 처치 시 버프나 리소스 제공
    for (const player of this.sim.players) {
      if (player.isAlive()) {
        player.grantResource(5); // 5 리소스 제공
      }
    }
  }

  // ==================== 이벤트 시스템 ====================
  registerEventHandler(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  registerMechanicHandler(mechanicType, handler) {
    this.mechanicHandlers.set(mechanicType, handler);
  }

  triggerEvent(event, data = {}) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      }
    }

    // 이벤트 로깅
    this.logEvent(event, data);
  }

  // ==================== 통계 ====================
  collectFinalStatistics() {
    for (const player of this.sim.players) {
      this.statistics.totalDamage += player.metrics.totalDamage;
      this.statistics.totalHealing += player.metrics.totalHealing;
    }

    // 다운타임 계산
    const combatDuration = this.combatEndTime - this.combatStartTime;
    const activeTime = combatDuration - this.statistics.movementTime;
    this.statistics.downtimeTotal = combatDuration - activeTime;
  }

  calculateFinalStatistics() {
    const duration = (this.combatEndTime - this.combatStartTime) / 1000;

    return {
      duration: duration,
      dps: this.statistics.totalDamage / duration,
      hps: this.statistics.totalHealing / duration,
      deaths: this.statistics.deathCount,
      mechanicsHandled: this.statistics.mechanicHandled,
      mechanicsFailed: this.statistics.mechanicFailed,
      targetSwitches: this.statistics.targetSwitches,
      movementUptime: (this.statistics.movementTime / (duration * 1000)) * 100,
      downtime: (this.statistics.downtimeTotal / (duration * 1000)) * 100
    };
  }

  // ==================== 로깅 ====================
  log(message) {
    if (this.debugMode) {
      const timestamp = ((this.sim.currentTime - this.combatStartTime) / 1000).toFixed(1);
      console.log(`[${timestamp}s] ${message}`);
    }

    this.combatLog.push({
      time: this.sim.currentTime,
      message: message
    });
  }

  logEvent(event, data) {
    this.combatLog.push({
      time: this.sim.currentTime,
      event: event,
      data: data
    });
  }

  exportCombatLog() {
    return this.combatLog;
  }

  // ==================== 고급 기능 ====================

  // 동적 메커니즘 스케줄링
  scheduleDynamicMechanic(mechanic, delay = 0) {
    this.sim.scheduleEvent({
      time: this.sim.currentTime + delay,
      type: EVENT_TYPE.MECHANIC,
      priority: EVENT_PRIORITY.HIGH,
      callback: () => this.executeMechanic(mechanic)
    });
  }

  // 조건부 페이즈 전환
  addPhaseCondition(phase, condition) {
    this.phaseConditions.set(phase, condition);
  }

  // 커스텀 메커니즘 등록
  registerCustomMechanic(name, handler) {
    this.mechanicHandlers.set(name, handler);
  }

  // 인터럽트 처리
  handleInterrupt(caster, target, spell) {
    if (target.isCasting() && spell.canInterrupt) {
      target.interruptCast();
      this.statistics.interruptCount++;

      this.log(`${caster.name} interrupted ${target.name}'s ${target.currentCast}`);

      return true;
    }
    return false;
  }

  // 디스펠 처리
  handleDispel(caster, target, dispelType) {
    const dispelled = target.dispelDebuffs(dispelType);

    if (dispelled.length > 0) {
      this.log(`${caster.name} dispelled ${dispelled.join(', ')} from ${target.name}`);
      return true;
    }
    return false;
  }

  // 위협 수준 관리
  updateThreat(player, target, amount) {
    if (!target.threatTable) {
      target.threatTable = new Map();
    }

    const currentThreat = target.threatTable.get(player) || 0;
    target.threatTable.set(player, currentThreat + amount);

    // 탱킹 대상 변경 체크
    this.checkThreatTarget(target);
  }

  checkThreatTarget(target) {
    if (!target.threatTable) return;

    let highestThreat = 0;
    let newTarget = null;

    for (const [player, threat] of target.threatTable) {
      if (threat > highestThreat) {
        highestThreat = threat;
        newTarget = player;
      }
    }

    if (newTarget && target.currentTarget !== newTarget) {
      // 탱킹 대상 변경
      target.currentTarget = newTarget;
      this.log(`${target.name} switched target to ${newTarget.name}`);
    }
  }

  // 보스 체력 기반 이벤트
  registerHealthTrigger(target, healthPercent, callback) {
    const checkHealth = () => {
      if (target.getHealthPercent() <= healthPercent) {
        callback();
        return true; // 트리거 제거
      }
      return false;
    };

    // 정기적으로 체크
    const healthChecker = () => {
      if (this.state !== COMBAT_STATE.COMBAT) return;

      if (!checkHealth()) {
        this.sim.scheduleEvent({
          time: this.sim.currentTime + 100,
          type: EVENT_TYPE.SYSTEM,
          callback: healthChecker
        });
      }
    };

    healthChecker();
  }

  // 환경 효과
  applyEnvironmentalEffect(effect) {
    switch (effect.type) {
      case 'fire':
        // 불바닥 데미지
        for (const player of this.sim.players) {
          if (this.isInArea(player, effect.area)) {
            player.takeDamage(effect.damage, 'fire');
          }
        }
        break;

      case 'slow':
        // 감속 지역
        for (const player of this.sim.players) {
          if (this.isInArea(player, effect.area)) {
            player.applyDebuff({
              name: 'Environmental Slow',
              duration: 1000,
              hasteMultiplier: 0.5
            });
          }
        }
        break;

      case 'healing':
        // 치유 지역
        for (const player of this.sim.players) {
          if (this.isInArea(player, effect.area)) {
            player.heal(effect.healing);
          }
        }
        break;
    }

    this.triggerEvent(COMBAT_EVENT.ENVIRONMENT_EFFECT, { effect });
  }

  isInArea(player, area) {
    // 플레이어가 특정 영역 안에 있는지 확인
    const position = this.playerPositions.get(player);
    return area.includes(position);
  }

  // 보조 기능들
  getFlaskStats(flask) {
    const flaskStats = {
      'Alchemical Chaos': { primaryStat: 1238 },
      'Tempered Versatility': { versatility: 909 },
      'Tempered Mastery': { mastery: 909 }
    };
    return flaskStats[flask] || {};
  }

  getFoodStats(food) {
    const foodStats = {
      'Feast': { primaryStat: 76 },
      'Beledar\'s Bounty': { versatility: 121 },
      'The Sushi Special': { haste: 121, critical: 121 }
    };
    return foodStats[food] || {};
  }
}

// ==================== Export ====================
export default CombatController;