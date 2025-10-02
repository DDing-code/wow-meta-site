/**
 * APL Executor
 * APL 실행 엔진
 */

import { EventEmitter } from 'events';
import APLConditionEvaluator from './APLConditionEvaluator.js';
import APLPrioritySystem from './APLPrioritySystem.js';
import { RESOURCE_TYPES } from '../constants/ResourceTypes.js';

export class APLExecutor extends EventEmitter {
    constructor(simulationState, compiledAPL) {
        super();
        this.simulationState = simulationState;
        this.compiledAPL = compiledAPL;
        this.conditionEvaluator = new APLConditionEvaluator(simulationState);
        this.prioritySystem = new APLPrioritySystem();

        this.executionState = {
            currentPhase: 'default',
            currentPriority: 0,
            lastAction: null,
            actionHistory: [],
            sequenceIndex: 0,
            loopIterations: {},
            variables: {},
            flags: new Set(),
            interrupts: []
        };

        this.executionMetrics = {
            totalExecutions: 0,
            successfulActions: 0,
            failedActions: 0,
            conditionEvaluations: 0,
            averageExecutionTime: 0,
            actionDistribution: {},
            phaseDistribution: {}
        };

        this.setupExecutionHandlers();
        this.setupInterruptHandlers();
    }

    /**
     * 실행 핸들러 설정
     */
    setupExecutionHandlers() {
        this.actionHandlers = {
            // 기본 액션
            'cast': this.executeCastAction.bind(this),
            'channel': this.executeChannelAction.bind(this),
            'use_item': this.executeUseItemAction.bind(this),
            'use_trinket': this.executeUseTrinketAction.bind(this),
            'pool': this.executePoolAction.bind(this),
            'wait': this.executeWaitAction.bind(this),
            'cancel': this.executeCancelAction.bind(this),
            'interrupt': this.executeInterruptAction.bind(this),

            // 이동 액션
            'move': this.executeMoveAction.bind(this),
            'position': this.executePositionAction.bind(this),

            // 타겟 액션
            'target': this.executeTargetAction.bind(this),
            'focus': this.executeFocusAction.bind(this),
            'assist': this.executeAssistAction.bind(this),

            // 버프/디버프 액션
            'apply_buff': this.executeApplyBuffAction.bind(this),
            'remove_buff': this.executeRemoveBuffAction.bind(this),
            'apply_debuff': this.executeApplyDebuffAction.bind(this),
            'remove_debuff': this.executeRemoveDebuffAction.bind(this),

            // 제어 액션
            'sequence': this.executeSequenceAction.bind(this),
            'call': this.executeCallAction.bind(this),
            'run': this.executeRunAction.bind(this),
            'variable': this.executeVariableAction.bind(this),
            'flag': this.executeFlagAction.bind(this),
            'phase': this.executePhaseAction.bind(this),

            // 특수 액션
            'snapshot': this.executeSnapshotAction.bind(this),
            'restore': this.executeRestoreAction.bind(this),
            'macro': this.executeMacroAction.bind(this),
            'script': this.executeScriptAction.bind(this),

            // 클래스별 특수 액션
            'pet': this.executePetAction.bind(this),
            'stance': this.executeStanceAction.bind(this),
            'form': this.executeFormAction.bind(this),
            'presence': this.executePresenceAction.bind(this),
            'aspect': this.executeAspectAction.bind(this),
            'aura': this.executeAuraAction.bind(this),
            'totem': this.executeTotemAction.bind(this),
            'rune': this.executeRuneAction.bind(this),
            'essence': this.executeEssenceAction.bind(this)
        };
    }

    /**
     * 인터럽트 핸들러 설정
     */
    setupInterruptHandlers() {
        // 중요한 이벤트에 대한 인터럽트 설정
        this.simulationState.on('proc', (proc) => {
            this.handleProc(proc);
        });

        this.simulationState.on('resourceCap', (resource) => {
            this.handleResourceCap(resource);
        });

        this.simulationState.on('targetSwitch', (newTarget) => {
            this.handleTargetSwitch(newTarget);
        });

        this.simulationState.on('phaseTransition', (newPhase) => {
            this.handlePhaseTransition(newPhase);
        });

        this.simulationState.on('emergency', (type) => {
            this.handleEmergency(type);
        });
    }

    /**
     * APL 실행
     */
    async execute() {
        const startTime = performance.now();
        this.executionMetrics.totalExecutions++;

        try {
            // 현재 페이즈 확인
            const currentPhase = this.determinePhase();
            if (currentPhase !== this.executionState.currentPhase) {
                this.transitionPhase(currentPhase);
            }

            // 인터럽트 확인
            const interrupt = await this.checkInterrupts();
            if (interrupt) {
                const result = await this.executeAction(interrupt);
                this.updateMetrics(startTime, result);
                return result;
            }

            // 우선순위에 따라 액션 실행
            const action = await this.selectNextAction();
            if (!action) {
                this.updateMetrics(startTime, null);
                return null;
            }

            const result = await this.executeAction(action);
            this.updateMetrics(startTime, result);
            return result;

        } catch (error) {
            this.emit('error', {
                type: 'EXECUTION_ERROR',
                error: error.message,
                stack: error.stack
            });
            this.executionMetrics.failedActions++;
            this.updateMetrics(startTime, null);
            return null;
        }
    }

    /**
     * 다음 액션 선택
     */
    async selectNextAction() {
        // 현재 페이즈의 액션 리스트 가져오기
        const phaseActions = this.compiledAPL.phases[this.executionState.currentPhase] ||
                           this.compiledAPL.phases.default;

        if (!phaseActions || phaseActions.length === 0) {
            return null;
        }

        // 우선순위 시스템을 통해 액션 정렬
        const prioritizedActions = await this.prioritySystem.prioritize(
            phaseActions,
            this.simulationState,
            this.executionState
        );

        // 조건을 만족하는 첫 번째 액션 찾기
        for (const action of prioritizedActions) {
            if (await this.evaluateActionCondition(action)) {
                return action;
            }
        }

        return null;
    }

    /**
     * 액션 조건 평가
     */
    async evaluateActionCondition(action) {
        if (!action.condition) return true;

        this.executionMetrics.conditionEvaluations++;
        const result = await this.conditionEvaluator.evaluateCondition(action.condition);

        this.emit('conditionEvaluated', {
            action: action.name,
            condition: action.condition,
            result
        });

        return result;
    }

    /**
     * 액션 실행
     */
    async executeAction(action) {
        const handler = this.actionHandlers[action.type];
        if (!handler) {
            throw new Error(`Unknown action type: ${action.type}`);
        }

        this.emit('actionStart', action);

        try {
            const result = await handler(action);

            if (result.success) {
                this.executionMetrics.successfulActions++;
                this.updateActionHistory(action, result);
            } else {
                this.executionMetrics.failedActions++;
            }

            this.emit('actionComplete', {
                action,
                result
            });

            return result;

        } catch (error) {
            this.emit('actionError', {
                action,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * 시전 액션 실행
     */
    async executeCastAction(action) {
        const { spell, target, options } = action;

        // 대상 확인
        const targetUnit = this.resolveTarget(target);
        if (!targetUnit && spell.requiresTarget) {
            return { success: false, reason: 'No valid target' };
        }

        // 리소스 확인
        if (!this.checkResourceRequirement(spell)) {
            return { success: false, reason: 'Insufficient resources' };
        }

        // 쿨다운 확인
        if (!this.checkCooldown(spell)) {
            return { success: false, reason: 'On cooldown' };
        }

        // 거리 확인
        if (targetUnit && !this.checkRange(targetUnit, spell.range)) {
            return { success: false, reason: 'Out of range' };
        }

        // 시전 시작
        const castTime = this.calculateCastTime(spell);

        if (castTime > 0) {
            // 시전 시간이 있는 경우
            this.simulationState.casting = {
                spell,
                target: targetUnit,
                startTime: this.simulationState.currentTime,
                endTime: this.simulationState.currentTime + castTime,
                interruptible: spell.interruptible !== false
            };

            // 시전 완료 이벤트 예약
            this.scheduleCastComplete(spell, targetUnit, castTime);
        } else {
            // 즉시 시전
            this.applyCastEffects(spell, targetUnit);
        }

        // 리소스 소비
        this.consumeResources(spell);

        // 쿨다운 적용
        this.applyCooldown(spell);

        // GCD 적용
        this.applyGCD(spell);

        return {
            success: true,
            spell: spell.name,
            target: targetUnit?.id,
            castTime
        };
    }

    /**
     * 채널링 액션 실행
     */
    async executeChannelAction(action) {
        const { spell, target, duration } = action;

        // 대상 확인
        const targetUnit = this.resolveTarget(target);
        if (!targetUnit && spell.requiresTarget) {
            return { success: false, reason: 'No valid target' };
        }

        // 리소스 확인
        if (!this.checkResourceRequirement(spell)) {
            return { success: false, reason: 'Insufficient resources' };
        }

        // 쿨다운 확인
        if (!this.checkCooldown(spell)) {
            return { success: false, reason: 'On cooldown' };
        }

        // 채널링 시작
        const channelDuration = duration || spell.channelTime || 3;

        this.simulationState.channeling = {
            spell,
            target: targetUnit,
            startTime: this.simulationState.currentTime,
            endTime: this.simulationState.currentTime + channelDuration,
            ticks: spell.ticks || Math.floor(channelDuration / 1),
            currentTick: 0,
            interruptible: spell.interruptible !== false
        };

        // 채널링 틱 예약
        this.scheduleChannelTicks(spell, targetUnit, channelDuration);

        // 리소스 소비
        this.consumeResources(spell);

        // 쿨다운 적용
        this.applyCooldown(spell);

        return {
            success: true,
            spell: spell.name,
            target: targetUnit?.id,
            duration: channelDuration
        };
    }

    /**
     * 아이템 사용 액션 실행
     */
    async executeUseItemAction(action) {
        const { item, slot } = action;

        const itemData = this.simulationState.equipment[slot || item];
        if (!itemData) {
            return { success: false, reason: 'Item not found' };
        }

        if (!itemData.onUse) {
            return { success: false, reason: 'Item has no use effect' };
        }

        // 쿨다운 확인
        if (!this.checkItemCooldown(itemData)) {
            return { success: false, reason: 'Item on cooldown' };
        }

        // 아이템 효과 적용
        this.applyItemEffect(itemData);

        // 쿨다운 적용
        this.applyItemCooldown(itemData);

        return {
            success: true,
            item: itemData.name,
            effect: itemData.onUse
        };
    }

    /**
     * 장신구 사용 액션 실행
     */
    async executeUseTrinketAction(action) {
        const { slot } = action;
        const trinketSlot = slot === 2 ? 'trinket2' : 'trinket1';

        return this.executeUseItemAction({
            ...action,
            slot: trinketSlot
        });
    }

    /**
     * 리소스 풀링 액션 실행
     */
    async executePoolAction(action) {
        const { resource, amount, duration } = action;

        const resourceType = resource || this.simulationState.primaryResource;
        const targetAmount = amount || this.simulationState.resources[resourceType].max;
        const maxDuration = duration || 5;

        const currentResource = this.simulationState.resources[resourceType];
        if (!currentResource) {
            return { success: false, reason: 'Invalid resource type' };
        }

        if (currentResource.current >= targetAmount) {
            return { success: true, reason: 'Resource already at target' };
        }

        // 풀링 상태 설정
        this.executionState.pooling = {
            resource: resourceType,
            target: targetAmount,
            startTime: this.simulationState.currentTime,
            maxDuration
        };

        return {
            success: true,
            resource: resourceType,
            target: targetAmount,
            current: currentResource.current
        };
    }

    /**
     * 대기 액션 실행
     */
    async executeWaitAction(action) {
        const { duration, until } = action;

        if (until) {
            // 조건이 만족될 때까지 대기
            this.executionState.waiting = {
                condition: until,
                startTime: this.simulationState.currentTime,
                maxDuration: duration || 10
            };
        } else if (duration) {
            // 특정 시간 동안 대기
            this.executionState.waitUntil = this.simulationState.currentTime + duration;
        }

        return {
            success: true,
            duration: duration || 'until condition',
            condition: until
        };
    }

    /**
     * 취소 액션 실행
     */
    async executeCancelAction(action) {
        const { type, spell } = action;

        switch (type) {
            case 'cast':
                if (this.simulationState.casting) {
                    this.simulationState.casting = null;
                    this.emit('castCancelled', spell);
                    return { success: true, cancelled: 'cast' };
                }
                break;

            case 'channel':
                if (this.simulationState.channeling) {
                    this.simulationState.channeling = null;
                    this.emit('channelCancelled', spell);
                    return { success: true, cancelled: 'channel' };
                }
                break;

            case 'aura':
            case 'buff':
                const buff = this.simulationState.buffs.find(b => b.name === spell);
                if (buff) {
                    this.simulationState.buffs = this.simulationState.buffs.filter(b => b.name !== spell);
                    this.emit('buffCancelled', spell);
                    return { success: true, cancelled: spell };
                }
                break;
        }

        return { success: false, reason: 'Nothing to cancel' };
    }

    /**
     * 차단 액션 실행
     */
    async executeInterruptAction(action) {
        const { target } = action;

        const targetUnit = this.resolveTarget(target);
        if (!targetUnit) {
            return { success: false, reason: 'No valid target' };
        }

        if (!targetUnit.casting && !targetUnit.channeling) {
            return { success: false, reason: 'Target not casting' };
        }

        // 차단 능력 확인
        const interruptAbility = this.getInterruptAbility();
        if (!interruptAbility || !this.checkCooldown(interruptAbility)) {
            return { success: false, reason: 'No interrupt available' };
        }

        // 차단 실행
        if (targetUnit.casting) {
            targetUnit.casting = null;
            this.emit('interrupted', { target: targetUnit, type: 'cast' });
        } else {
            targetUnit.channeling = null;
            this.emit('interrupted', { target: targetUnit, type: 'channel' });
        }

        // 쿨다운 적용
        this.applyCooldown(interruptAbility);

        return {
            success: true,
            target: targetUnit.id,
            ability: interruptAbility.name
        };
    }

    /**
     * 이동 액션 실행
     */
    async executeMoveAction(action) {
        const { destination, speed } = action;

        const moveSpeed = speed || this.simulationState.player.moveSpeed || 100;
        const distance = this.calculateDistance(
            this.simulationState.player.position,
            destination
        );

        const moveDuration = distance / moveSpeed;

        this.simulationState.moving = {
            from: this.simulationState.player.position,
            to: destination,
            startTime: this.simulationState.currentTime,
            endTime: this.simulationState.currentTime + moveDuration,
            speed: moveSpeed
        };

        return {
            success: true,
            destination,
            duration: moveDuration
        };
    }

    /**
     * 위치 액션 실행
     */
    async executePositionAction(action) {
        const { position, relative } = action;

        if (relative) {
            // 상대 위치 이동
            this.simulationState.player.position = {
                x: this.simulationState.player.position.x + (position.x || 0),
                y: this.simulationState.player.position.y + (position.y || 0),
                z: this.simulationState.player.position.z + (position.z || 0)
            };
        } else {
            // 절대 위치 이동
            this.simulationState.player.position = position;
        }

        return {
            success: true,
            position: this.simulationState.player.position
        };
    }

    /**
     * 대상 지정 액션 실행
     */
    async executeTargetAction(action) {
        const { selector, condition } = action;

        let newTarget = null;

        switch (selector) {
            case 'nearest':
                newTarget = this.findNearestEnemy();
                break;
            case 'lowest_health':
                newTarget = this.findLowestHealthEnemy();
                break;
            case 'highest_threat':
                newTarget = this.findHighestThreatEnemy();
                break;
            case 'most_dots':
                newTarget = this.findMostDotsEnemy();
                break;
            case 'cycle':
                newTarget = await this.cycleTargets(condition);
                break;
            default:
                newTarget = this.findTargetByName(selector);
        }

        if (newTarget) {
            this.simulationState.currentTarget = newTarget;
            this.emit('targetChanged', newTarget);
            return { success: true, target: newTarget.id };
        }

        return { success: false, reason: 'No valid target found' };
    }

    /**
     * 주시 대상 액션 실행
     */
    async executeFocusAction(action) {
        const { target, swap } = action;

        if (swap) {
            // 현재 대상과 주시 대상 교체
            const temp = this.simulationState.currentTarget;
            this.simulationState.currentTarget = this.simulationState.focusTarget;
            this.simulationState.focusTarget = temp;
        } else {
            // 새로운 주시 대상 설정
            const focusTarget = this.resolveTarget(target);
            if (focusTarget) {
                this.simulationState.focusTarget = focusTarget;
            } else {
                return { success: false, reason: 'Invalid focus target' };
            }
        }

        return {
            success: true,
            focus: this.simulationState.focusTarget?.id,
            current: this.simulationState.currentTarget?.id
        };
    }

    /**
     * 지원 대상 액션 실행
     */
    async executeAssistAction(action) {
        const { target } = action;

        const assistTarget = this.resolveTarget(target);
        if (!assistTarget) {
            return { success: false, reason: 'Invalid assist target' };
        }

        if (assistTarget.target) {
            this.simulationState.currentTarget = assistTarget.target;
            return { success: true, target: assistTarget.target.id };
        }

        return { success: false, reason: 'Assist target has no target' };
    }

    /**
     * 버프 적용 액션 실행
     */
    async executeApplyBuffAction(action) {
        const { buff, target, duration, stacks } = action;

        const targetUnit = this.resolveTarget(target) || this.simulationState.player;

        const buffData = {
            name: buff,
            duration: duration || 10,
            stacks: stacks || 1,
            appliedAt: this.simulationState.currentTime,
            source: this.simulationState.player
        };

        targetUnit.buffs = targetUnit.buffs || [];

        const existingBuff = targetUnit.buffs.find(b => b.name === buff);
        if (existingBuff) {
            // 버프 갱신
            existingBuff.duration = Math.max(existingBuff.duration, buffData.duration);
            existingBuff.stacks = Math.min(existingBuff.stacks + buffData.stacks, buff.maxStacks || 99);
        } else {
            // 새 버프 추가
            targetUnit.buffs.push(buffData);
        }

        this.emit('buffApplied', { target: targetUnit, buff: buffData });

        return {
            success: true,
            buff: buff,
            target: targetUnit.id
        };
    }

    /**
     * 버프 제거 액션 실행
     */
    async executeRemoveBuffAction(action) {
        const { buff, target } = action;

        const targetUnit = this.resolveTarget(target) || this.simulationState.player;

        if (!targetUnit.buffs) {
            return { success: false, reason: 'No buffs to remove' };
        }

        const initialLength = targetUnit.buffs.length;
        targetUnit.buffs = targetUnit.buffs.filter(b => b.name !== buff);

        if (targetUnit.buffs.length < initialLength) {
            this.emit('buffRemoved', { target: targetUnit, buff });
            return { success: true, buff, target: targetUnit.id };
        }

        return { success: false, reason: 'Buff not found' };
    }

    /**
     * 디버프 적용 액션 실행
     */
    async executeApplyDebuffAction(action) {
        const { debuff, target, duration, stacks } = action;

        const targetUnit = this.resolveTarget(target);
        if (!targetUnit) {
            return { success: false, reason: 'No valid target' };
        }

        const debuffData = {
            name: debuff,
            duration: duration || 10,
            stacks: stacks || 1,
            appliedAt: this.simulationState.currentTime,
            source: this.simulationState.player
        };

        targetUnit.debuffs = targetUnit.debuffs || [];

        const existingDebuff = targetUnit.debuffs.find(d => d.name === debuff);
        if (existingDebuff) {
            // 디버프 갱신
            existingDebuff.duration = Math.max(existingDebuff.duration, debuffData.duration);
            existingDebuff.stacks = Math.min(existingDebuff.stacks + debuffData.stacks, debuff.maxStacks || 99);
        } else {
            // 새 디버프 추가
            targetUnit.debuffs.push(debuffData);
        }

        this.emit('debuffApplied', { target: targetUnit, debuff: debuffData });

        return {
            success: true,
            debuff: debuff,
            target: targetUnit.id
        };
    }

    /**
     * 디버프 제거 액션 실행
     */
    async executeRemoveDebuffAction(action) {
        const { debuff, target } = action;

        const targetUnit = this.resolveTarget(target);
        if (!targetUnit) {
            return { success: false, reason: 'No valid target' };
        }

        if (!targetUnit.debuffs) {
            return { success: false, reason: 'No debuffs to remove' };
        }

        const initialLength = targetUnit.debuffs.length;
        targetUnit.debuffs = targetUnit.debuffs.filter(d => d.name !== debuff);

        if (targetUnit.debuffs.length < initialLength) {
            this.emit('debuffRemoved', { target: targetUnit, debuff });
            return { success: true, debuff, target: targetUnit.id };
        }

        return { success: false, reason: 'Debuff not found' };
    }

    /**
     * 시퀀스 액션 실행
     */
    async executeSequenceAction(action) {
        const { name, strict } = action;

        const sequence = this.compiledAPL.sequences[name];
        if (!sequence) {
            return { success: false, reason: 'Sequence not found' };
        }

        const index = this.executionState.sequenceIndex;
        if (index >= sequence.length) {
            this.executionState.sequenceIndex = 0;
            return { success: false, reason: 'Sequence complete' };
        }

        const nextAction = sequence[index];

        if (strict) {
            // 엄격 모드: 조건을 만족하지 않으면 시퀀스 중단
            if (!await this.evaluateActionCondition(nextAction)) {
                this.executionState.sequenceIndex = 0;
                return { success: false, reason: 'Sequence condition failed' };
            }
        }

        const result = await this.executeAction(nextAction);

        if (result.success) {
            this.executionState.sequenceIndex++;
        } else if (strict) {
            this.executionState.sequenceIndex = 0;
        }

        return result;
    }

    /**
     * 서브루틴 호출 액션 실행
     */
    async executeCallAction(action) {
        const { subroutine, params } = action;

        const sub = this.compiledAPL.subroutines[subroutine];
        if (!sub) {
            return { success: false, reason: 'Subroutine not found' };
        }

        // 매개변수 설정
        const previousParams = this.executionState.subroutineParams;
        this.executionState.subroutineParams = params;

        // 서브루틴 실행
        const results = [];
        for (const subAction of sub) {
            const result = await this.executeAction(subAction);
            results.push(result);

            if (!result.success && sub.strict) {
                break;
            }
        }

        // 매개변수 복원
        this.executionState.subroutineParams = previousParams;

        return {
            success: results.every(r => r.success),
            subroutine,
            results
        };
    }

    /**
     * APL 실행 액션 실행
     */
    async executeRunAction(action) {
        const { apl, inherit } = action;

        const subAPL = this.compiledAPL.includes[apl];
        if (!subAPL) {
            return { success: false, reason: 'APL not found' };
        }

        // 상태 저장
        const previousState = inherit ? null : { ...this.executionState };

        // 서브 APL 실행
        const subExecutor = new APLExecutor(this.simulationState, subAPL);
        const result = await subExecutor.execute();

        // 상태 복원
        if (previousState) {
            this.executionState = previousState;
        }

        return result;
    }

    /**
     * 변수 설정 액션 실행
     */
    async executeVariableAction(action) {
        const { name, value, operation } = action;

        const currentValue = this.executionState.variables[name] || 0;
        let newValue;

        switch (operation) {
            case 'set':
                newValue = value;
                break;
            case 'add':
                newValue = currentValue + value;
                break;
            case 'subtract':
                newValue = currentValue - value;
                break;
            case 'multiply':
                newValue = currentValue * value;
                break;
            case 'divide':
                newValue = currentValue / value;
                break;
            case 'min':
                newValue = Math.min(currentValue, value);
                break;
            case 'max':
                newValue = Math.max(currentValue, value);
                break;
            default:
                newValue = value;
        }

        this.executionState.variables[name] = newValue;
        this.simulationState.variables = this.simulationState.variables || {};
        this.simulationState.variables[name] = newValue;

        return {
            success: true,
            variable: name,
            value: newValue,
            previous: currentValue
        };
    }

    /**
     * 플래그 설정 액션 실행
     */
    async executeFlagAction(action) {
        const { name, value } = action;

        if (value === false) {
            this.executionState.flags.delete(name);
        } else {
            this.executionState.flags.add(name);
        }

        return {
            success: true,
            flag: name,
            value: value !== false
        };
    }

    /**
     * 페이즈 변경 액션 실행
     */
    async executePhaseAction(action) {
        const { name } = action;

        this.transitionPhase(name);

        return {
            success: true,
            phase: name,
            previous: this.executionState.currentPhase
        };
    }

    /**
     * 스냅샷 액션 실행
     */
    async executeSnapshotAction(action) {
        const { name, stats } = action;

        const snapshot = {
            time: this.simulationState.currentTime,
            stats: stats ? { ...this.simulationState.stats } : null,
            resources: { ...this.simulationState.resources },
            buffs: [...this.simulationState.buffs],
            debuffs: this.simulationState.currentTarget ?
                    [...this.simulationState.currentTarget.debuffs] : []
        };

        this.executionState.snapshots = this.executionState.snapshots || {};
        this.executionState.snapshots[name] = snapshot;

        return {
            success: true,
            snapshot: name
        };
    }

    /**
     * 복원 액션 실행
     */
    async executeRestoreAction(action) {
        const { name } = action;

        const snapshot = this.executionState.snapshots?.[name];
        if (!snapshot) {
            return { success: false, reason: 'Snapshot not found' };
        }

        // 스냅샷 상태 복원
        if (snapshot.stats) {
            this.simulationState.stats = { ...snapshot.stats };
        }
        this.simulationState.resources = { ...snapshot.resources };
        this.simulationState.buffs = [...snapshot.buffs];

        if (this.simulationState.currentTarget) {
            this.simulationState.currentTarget.debuffs = [...snapshot.debuffs];
        }

        return {
            success: true,
            snapshot: name,
            time: snapshot.time
        };
    }

    /**
     * 매크로 액션 실행
     */
    async executeMacroAction(action) {
        const { name, commands } = action;

        const macro = commands || this.compiledAPL.macros[name];
        if (!macro) {
            return { success: false, reason: 'Macro not found' };
        }

        const results = [];
        for (const command of macro) {
            // 매크로 명령 파싱 및 실행
            const parsedAction = this.parseMacroCommand(command);
            if (parsedAction) {
                const result = await this.executeAction(parsedAction);
                results.push(result);
            }
        }

        return {
            success: results.every(r => r.success),
            macro: name,
            results
        };
    }

    /**
     * 스크립트 액션 실행
     */
    async executeScriptAction(action) {
        const { code, sandbox } = action;

        try {
            // 샌드박스 환경에서 스크립트 실행
            const context = sandbox ? this.createSandbox() : {
                state: this.simulationState,
                execution: this.executionState,
                emit: this.emit.bind(this)
            };

            const func = new Function('context', code);
            const result = func(context);

            return {
                success: true,
                result
            };

        } catch (error) {
            return {
                success: false,
                reason: 'Script error',
                error: error.message
            };
        }
    }

    /**
     * 펫 액션 실행
     */
    async executePetAction(action) {
        const { command, ability, target } = action;

        const pet = this.simulationState.pet;
        if (!pet) {
            return { success: false, reason: 'No active pet' };
        }

        switch (command) {
            case 'attack':
                pet.target = this.resolveTarget(target) || this.simulationState.currentTarget;
                pet.attacking = true;
                break;

            case 'follow':
                pet.following = true;
                pet.attacking = false;
                break;

            case 'stay':
                pet.following = false;
                pet.position = { ...pet.position };
                break;

            case 'ability':
                if (!pet.abilities[ability]) {
                    return { success: false, reason: 'Pet ability not found' };
                }
                // 펫 능력 실행
                this.executePetAbility(pet, ability, target);
                break;
        }

        return {
            success: true,
            pet: pet.name,
            command
        };
    }

    /**
     * 태세 액션 실행
     */
    async executeStanceAction(action) {
        const { stance } = action;

        const availableStances = this.getAvailableStances();
        if (!availableStances.includes(stance)) {
            return { success: false, reason: 'Stance not available' };
        }

        const previousStance = this.simulationState.stance;
        this.simulationState.stance = stance;

        // 태세 효과 적용
        this.applyStanceEffects(stance, previousStance);

        this.emit('stanceChanged', { from: previousStance, to: stance });

        return {
            success: true,
            stance,
            previous: previousStance
        };
    }

    /**
     * 형상 액션 실행
     */
    async executeFormAction(action) {
        const { form } = action;

        const availableForms = this.getAvailableForms();
        if (!availableForms.includes(form)) {
            return { success: false, reason: 'Form not available' };
        }

        const previousForm = this.simulationState.form;
        this.simulationState.form = form;

        // 형상 효과 적용
        this.applyFormEffects(form, previousForm);

        this.emit('formChanged', { from: previousForm, to: form });

        return {
            success: true,
            form,
            previous: previousForm
        };
    }

    /**
     * 존재 액션 실행
     */
    async executePresenceAction(action) {
        const { presence } = action;

        const availablePresences = this.getAvailablePresences();
        if (!availablePresences.includes(presence)) {
            return { success: false, reason: 'Presence not available' };
        }

        const previousPresence = this.simulationState.presence;
        this.simulationState.presence = presence;

        // 존재 효과 적용
        this.applyPresenceEffects(presence, previousPresence);

        this.emit('presenceChanged', { from: previousPresence, to: presence });

        return {
            success: true,
            presence,
            previous: previousPresence
        };
    }

    /**
     * 상 액션 실행
     */
    async executeAspectAction(action) {
        const { aspect } = action;

        const availableAspects = this.getAvailableAspects();
        if (!availableAspects.includes(aspect)) {
            return { success: false, reason: 'Aspect not available' };
        }

        const previousAspect = this.simulationState.aspect;
        this.simulationState.aspect = aspect;

        // 상 효과 적용
        this.applyAspectEffects(aspect, previousAspect);

        this.emit('aspectChanged', { from: previousAspect, to: aspect });

        return {
            success: true,
            aspect,
            previous: previousAspect
        };
    }

    /**
     * 오라 액션 실행
     */
    async executeAuraAction(action) {
        const { aura } = action;

        const availableAuras = this.getAvailableAuras();
        if (!availableAuras.includes(aura)) {
            return { success: false, reason: 'Aura not available' };
        }

        const previousAura = this.simulationState.activeAura;
        this.simulationState.activeAura = aura;

        // 오라 효과 적용
        this.applyAuraEffects(aura, previousAura);

        this.emit('auraChanged', { from: previousAura, to: aura });

        return {
            success: true,
            aura,
            previous: previousAura
        };
    }

    /**
     * 토템 액션 실행
     */
    async executeTotemAction(action) {
        const { totem, position } = action;

        const totemData = this.getTotemData(totem);
        if (!totemData) {
            return { success: false, reason: 'Unknown totem' };
        }

        // 쿨다운 확인
        if (!this.checkCooldown(totemData)) {
            return { success: false, reason: 'Totem on cooldown' };
        }

        // 토템 소환
        const summonedTotem = {
            name: totem,
            position: position || this.simulationState.player.position,
            health: totemData.health,
            duration: totemData.duration,
            summonedAt: this.simulationState.currentTime,
            effects: totemData.effects
        };

        this.simulationState.totems = this.simulationState.totems || [];

        // 같은 종류의 토템 교체
        this.simulationState.totems = this.simulationState.totems.filter(
            t => t.type !== totemData.type
        );

        this.simulationState.totems.push(summonedTotem);

        // 쿨다운 적용
        this.applyCooldown(totemData);

        this.emit('totemSummoned', summonedTotem);

        return {
            success: true,
            totem,
            position: summonedTotem.position
        };
    }

    /**
     * 룬 액션 실행
     */
    async executeRuneAction(action) {
        const { type, count } = action;

        const runes = this.simulationState.runes;
        if (!runes) {
            return { success: false, reason: 'Class does not use runes' };
        }

        const availableRunes = runes.filter(r => r.type === type && r.available);
        if (availableRunes.length < count) {
            return { success: false, reason: 'Insufficient runes' };
        }

        // 룬 소비
        for (let i = 0; i < count; i++) {
            availableRunes[i].available = false;
            availableRunes[i].rechargeAt = this.simulationState.currentTime + 10; // 기본 10초 재충전
        }

        return {
            success: true,
            type,
            consumed: count,
            remaining: runes.filter(r => r.type === type && r.available).length
        };
    }

    /**
     * 정수 액션 실행
     */
    async executeEssenceAction(action) {
        const { major, minor } = action;

        if (major) {
            const majorEssence = this.getEssenceData(major);
            if (!majorEssence) {
                return { success: false, reason: 'Major essence not found' };
            }

            // 쿨다운 확인
            if (!this.checkCooldown(majorEssence)) {
                return { success: false, reason: 'Major essence on cooldown' };
            }

            // 정수 능력 실행
            this.applyEssenceEffect(majorEssence);
            this.applyCooldown(majorEssence);
        }

        if (minor) {
            // 부 정수 효과는 보통 패시브
            this.simulationState.activeMinorEssences = minor;
        }

        return {
            success: true,
            major,
            minor
        };
    }

    // === 유틸리티 메서드 ===

    /**
     * 페이즈 결정
     */
    determinePhase() {
        // 체력 기반 페이즈
        if (this.simulationState.currentTarget) {
            const targetHealthPercent = (this.simulationState.currentTarget.health /
                                       this.simulationState.currentTarget.maxHealth) * 100;

            for (const [phase, condition] of Object.entries(this.compiledAPL.phaseConditions || {})) {
                if (this.conditionEvaluator.evaluateCondition(condition)) {
                    return phase;
                }
            }
        }

        // 시간 기반 페이즈
        const combatTime = this.simulationState.combatTime || 0;
        if (combatTime < 10) return 'opener';
        if (combatTime > 300) return 'execute';

        return 'default';
    }

    /**
     * 페이즈 전환
     */
    transitionPhase(newPhase) {
        const oldPhase = this.executionState.currentPhase;
        this.executionState.currentPhase = newPhase;

        this.emit('phaseTransition', {
            from: oldPhase,
            to: newPhase,
            time: this.simulationState.currentTime
        });

        // 페이즈별 초기화
        this.executionState.sequenceIndex = 0;
        this.executionState.loopIterations[newPhase] = 0;
    }

    /**
     * 인터럽트 확인
     */
    async checkInterrupts() {
        for (const interrupt of this.executionState.interrupts) {
            if (await this.evaluateActionCondition(interrupt)) {
                // 인터럽트 제거
                this.executionState.interrupts = this.executionState.interrupts.filter(
                    i => i !== interrupt
                );
                return interrupt;
            }
        }
        return null;
    }

    /**
     * 프록 처리
     */
    handleProc(proc) {
        // 프록 관련 인터럽트 추가
        if (proc.priority === 'high') {
            const procAction = this.compiledAPL.procs?.[proc.name];
            if (procAction) {
                this.executionState.interrupts.push(procAction);
            }
        }
    }

    /**
     * 리소스 캡 처리
     */
    handleResourceCap(resource) {
        // 리소스 캡 방지 액션 추가
        const preventCapAction = this.compiledAPL.resourceCap?.[resource];
        if (preventCapAction) {
            this.executionState.interrupts.push(preventCapAction);
        }
    }

    /**
     * 대상 전환 처리
     */
    handleTargetSwitch(newTarget) {
        // 대상별 디버프 확인 등
        this.emit('evaluateTargetDebuffs', newTarget);
    }

    /**
     * 페이즈 전환 처리
     */
    handlePhaseTransition(newPhase) {
        this.transitionPhase(newPhase);
    }

    /**
     * 긴급 상황 처리
     */
    handleEmergency(type) {
        const emergencyAction = this.compiledAPL.emergency?.[type];
        if (emergencyAction) {
            this.executionState.interrupts.unshift(emergencyAction); // 최우선 순위
        }
    }

    /**
     * 액션 히스토리 업데이트
     */
    updateActionHistory(action, result) {
        this.executionState.actionHistory.push({
            action: action.name,
            type: action.type,
            time: this.simulationState.currentTime,
            success: result.success,
            result
        });

        // 히스토리 크기 제한
        if (this.executionState.actionHistory.length > 100) {
            this.executionState.actionHistory.shift();
        }

        this.executionState.lastAction = action;
    }

    /**
     * 메트릭 업데이트
     */
    updateMetrics(startTime, result) {
        const duration = performance.now() - startTime;

        this.executionMetrics.averageExecutionTime =
            (this.executionMetrics.averageExecutionTime * (this.executionMetrics.totalExecutions - 1) + duration) /
            this.executionMetrics.totalExecutions;

        if (result) {
            const actionType = result.action?.type || 'unknown';
            this.executionMetrics.actionDistribution[actionType] =
                (this.executionMetrics.actionDistribution[actionType] || 0) + 1;

            const phase = this.executionState.currentPhase;
            this.executionMetrics.phaseDistribution[phase] =
                (this.executionMetrics.phaseDistribution[phase] || 0) + 1;
        }
    }

    /**
     * 대상 해결
     */
    resolveTarget(target) {
        if (!target) return this.simulationState.currentTarget;

        switch (target) {
            case 'self':
            case 'player':
                return this.simulationState.player;
            case 'target':
            case 'current':
                return this.simulationState.currentTarget;
            case 'focus':
                return this.simulationState.focusTarget;
            case 'pet':
                return this.simulationState.pet;
            case 'mouseover':
                return this.simulationState.mouseoverTarget;
            default:
                return this.findTargetByName(target);
        }
    }

    // === 헬퍼 메서드 (구현 필요) ===

    checkResourceRequirement(spell) {
        // 리소스 요구사항 확인
        return true; // 구현 필요
    }

    checkCooldown(ability) {
        // 쿨다운 확인
        return true; // 구현 필요
    }

    checkRange(target, range) {
        // 거리 확인
        return true; // 구현 필요
    }

    calculateCastTime(spell) {
        // 시전 시간 계산
        return spell.castTime || 0;
    }

    consumeResources(spell) {
        // 리소스 소비
    }

    applyCooldown(ability) {
        // 쿨다운 적용
    }

    applyGCD(spell) {
        // 전역 쿨다운 적용
    }

    applyCastEffects(spell, target) {
        // 시전 효과 적용
    }

    // ... 기타 헬퍼 메서드들
}

export default APLExecutor;