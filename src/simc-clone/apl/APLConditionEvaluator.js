/**
 * APL Condition Evaluator
 * 조건 평가 시스템
 */

import { EventEmitter } from 'events';
import { RESOURCE_TYPES } from '../constants/ResourceTypes.js';
import { BUFF_TYPES, DEBUFF_TYPES } from '../constants/BuffDebuffTypes.js';

export class APLConditionEvaluator extends EventEmitter {
    constructor(simulationState) {
        super();
        this.simulationState = simulationState;
        this.conditionCache = new Map();
        this.evaluationMetrics = {
            evaluationsPerSecond: 0,
            cacheHits: 0,
            cacheMisses: 0,
            totalEvaluations: 0,
            averageEvaluationTime: 0
        };

        this.setupConditionHandlers();
        this.setupCacheInvalidation();
    }

    /**
     * 조건 핸들러 설정
     */
    setupConditionHandlers() {
        this.conditionHandlers = {
            // 리소스 조건
            'resource': this.evaluateResourceCondition.bind(this),
            'mana': this.evaluateManaCondition.bind(this),
            'energy': this.evaluateEnergyCondition.bind(this),
            'rage': this.evaluateRageCondition.bind(this),
            'runic_power': this.evaluateRunicPowerCondition.bind(this),
            'focus': this.evaluateFocusCondition.bind(this),
            'combo_points': this.evaluateComboPointsCondition.bind(this),
            'chi': this.evaluateChiCondition.bind(this),
            'holy_power': this.evaluateHolyPowerCondition.bind(this),
            'soul_shards': this.evaluateSoulShardsCondition.bind(this),
            'astral_power': this.evaluateAstralPowerCondition.bind(this),
            'maelstrom': this.evaluateMaelstromCondition.bind(this),
            'insanity': this.evaluateInsanityCondition.bind(this),
            'arcane_charges': this.evaluateArcaneChargesCondition.bind(this),
            'fury': this.evaluateFuryCondition.bind(this),
            'pain': this.evaluatePainCondition.bind(this),
            'essence': this.evaluateEssenceCondition.bind(this),

            // 버프/디버프 조건
            'buff': this.evaluateBuffCondition.bind(this),
            'debuff': this.evaluateDebuffCondition.bind(this),
            'aura': this.evaluateAuraCondition.bind(this),
            'dot': this.evaluateDotCondition.bind(this),
            'hot': this.evaluateHotCondition.bind(this),

            // 쿨다운 조건
            'cooldown': this.evaluateCooldownCondition.bind(this),
            'charges': this.evaluateChargesCondition.bind(this),
            'gcd': this.evaluateGcdCondition.bind(this),

            // 타겟 조건
            'target': this.evaluateTargetCondition.bind(this),
            'enemies': this.evaluateEnemiesCondition.bind(this),
            'allies': this.evaluateAlliesCondition.bind(this),
            'health': this.evaluateHealthCondition.bind(this),
            'distance': this.evaluateDistanceCondition.bind(this),

            // 시간 조건
            'time': this.evaluateTimeCondition.bind(this),
            'time_to_die': this.evaluateTimeToDieCondition.bind(this),
            'combat_time': this.evaluateCombatTimeCondition.bind(this),
            'cast_time': this.evaluateCastTimeCondition.bind(this),

            // 특수 조건
            'talent': this.evaluateTalentCondition.bind(this),
            'covenant': this.evaluateCovenantCondition.bind(this),
            'soulbind': this.evaluateSoulbindCondition.bind(this),
            'conduit': this.evaluateConduitCondition.bind(this),
            'legendary': this.evaluateLegendaryCondition.bind(this),
            'set_bonus': this.evaluateSetBonusCondition.bind(this),

            // 클래스별 특수 조건
            'eclipse': this.evaluateEclipseCondition.bind(this),
            'stagger': this.evaluateStaggerCondition.bind(this),
            'combo_strikes': this.evaluateComboStrikesCondition.bind(this),
            'maelstrom_weapon': this.evaluateMaelstromWeaponCondition.bind(this),
            'bone_shield': this.evaluateBoneShieldCondition.bind(this),
            'festering_wound': this.evaluateFesteringWoundCondition.bind(this),
            'soul_fragments': this.evaluateSoulFragmentsCondition.bind(this),
            'metamorphosis': this.evaluateMetamorphosisCondition.bind(this),

            // 논리 연산자
            'and': this.evaluateAndCondition.bind(this),
            'or': this.evaluateOrCondition.bind(this),
            'not': this.evaluateNotCondition.bind(this),
            'if': this.evaluateIfCondition.bind(this),

            // 수학 연산자
            'greater': this.evaluateGreaterCondition.bind(this),
            'less': this.evaluateLessCondition.bind(this),
            'equal': this.evaluateEqualCondition.bind(this),
            'greater_equal': this.evaluateGreaterEqualCondition.bind(this),
            'less_equal': this.evaluateLessEqualCondition.bind(this),
            'not_equal': this.evaluateNotEqualCondition.bind(this),

            // 집합 연산자
            'in': this.evaluateInCondition.bind(this),
            'contains': this.evaluateContainsCondition.bind(this),
            'any': this.evaluateAnyCondition.bind(this),
            'all': this.evaluateAllCondition.bind(this),
            'none': this.evaluateNoneCondition.bind(this)
        };
    }

    /**
     * 캐시 무효화 설정
     */
    setupCacheInvalidation() {
        // 상태 변경 시 캐시 무효화
        this.simulationState.on('resourceChanged', () => {
            this.invalidateCache(['resource', 'mana', 'energy', 'rage']);
        });

        this.simulationState.on('buffChanged', () => {
            this.invalidateCache(['buff', 'aura']);
        });

        this.simulationState.on('debuffChanged', () => {
            this.invalidateCache(['debuff', 'dot']);
        });

        this.simulationState.on('cooldownChanged', () => {
            this.invalidateCache(['cooldown', 'charges']);
        });

        this.simulationState.on('targetChanged', () => {
            this.invalidateCache(['target', 'enemies', 'health']);
        });

        // 매 틱마다 시간 관련 캐시 무효화
        setInterval(() => {
            this.invalidateCache(['time', 'time_to_die', 'combat_time']);
        }, 100);
    }

    /**
     * 캐시 무효화
     */
    invalidateCache(types = null) {
        if (!types) {
            this.conditionCache.clear();
            return;
        }

        for (const [key, value] of this.conditionCache) {
            if (types.some(type => key.includes(type))) {
                this.conditionCache.delete(key);
            }
        }
    }

    /**
     * 조건 평가
     */
    async evaluateCondition(condition) {
        const startTime = performance.now();
        this.evaluationMetrics.totalEvaluations++;

        // 캐시 확인
        const cacheKey = this.generateCacheKey(condition);
        if (this.conditionCache.has(cacheKey)) {
            this.evaluationMetrics.cacheHits++;
            const result = this.conditionCache.get(cacheKey);
            this.updateMetrics(startTime);
            return result;
        }

        this.evaluationMetrics.cacheMisses++;

        try {
            // 조건 평가
            const result = await this.evaluateConditionInternal(condition);

            // 캐시 저장
            this.conditionCache.set(cacheKey, result);

            // 캐시 크기 제한
            if (this.conditionCache.size > 1000) {
                const firstKey = this.conditionCache.keys().next().value;
                this.conditionCache.delete(firstKey);
            }

            this.updateMetrics(startTime);
            return result;

        } catch (error) {
            this.emit('error', {
                type: 'EVALUATION_ERROR',
                condition,
                error: error.message
            });
            this.updateMetrics(startTime);
            return false;
        }
    }

    /**
     * 내부 조건 평가
     */
    async evaluateConditionInternal(condition) {
        if (typeof condition === 'boolean') {
            return condition;
        }

        if (typeof condition === 'string') {
            return this.evaluateStringCondition(condition);
        }

        if (typeof condition === 'object' && condition !== null) {
            const { type, operator, left, right, value, params } = condition;

            const handler = this.conditionHandlers[type || operator];
            if (handler) {
                return await handler(condition);
            }

            throw new Error(`Unknown condition type: ${type || operator}`);
        }

        return false;
    }

    /**
     * 문자열 조건 평가
     */
    evaluateStringCondition(condition) {
        // SimC 스타일 조건 파싱
        const parts = condition.split('.');
        const mainType = parts[0];

        const handler = this.conditionHandlers[mainType];
        if (handler) {
            return handler({ type: mainType, params: parts.slice(1) });
        }

        // 변수 참조
        if (this.simulationState.variables && this.simulationState.variables[condition]) {
            return this.simulationState.variables[condition];
        }

        return false;
    }

    /**
     * 리소스 조건 평가
     */
    evaluateResourceCondition({ params }) {
        const [resourceType, operator, value] = params;
        const resource = this.simulationState.resources[resourceType];

        if (!resource) return false;

        return this.compareValues(resource.current, operator, parseFloat(value));
    }

    /**
     * 마나 조건 평가
     */
    evaluateManaCondition({ params }) {
        const [property, operator, value] = params;
        const mana = this.simulationState.resources[RESOURCE_TYPES.MANA];

        if (!mana) return false;

        switch (property) {
            case 'percent':
                return this.compareValues((mana.current / mana.max) * 100, operator, parseFloat(value));
            case 'deficit':
                return this.compareValues(mana.max - mana.current, operator, parseFloat(value));
            case 'time_to_max':
                const timeToMax = (mana.max - mana.current) / mana.regenRate;
                return this.compareValues(timeToMax, operator, parseFloat(value));
            default:
                return this.compareValues(mana.current, operator, parseFloat(value));
        }
    }

    /**
     * 에너지 조건 평가
     */
    evaluateEnergyCondition({ params }) {
        const [property, operator, value] = params;
        const energy = this.simulationState.resources[RESOURCE_TYPES.ENERGY];

        if (!energy) return false;

        switch (property) {
            case 'percent':
                return this.compareValues((energy.current / energy.max) * 100, operator, parseFloat(value));
            case 'deficit':
                return this.compareValues(energy.max - energy.current, operator, parseFloat(value));
            case 'time_to_max':
                const timeToMax = (energy.max - energy.current) / energy.regenRate;
                return this.compareValues(timeToMax, operator, parseFloat(value));
            case 'regen':
                return this.compareValues(energy.regenRate, operator, parseFloat(value));
            default:
                return this.compareValues(energy.current, operator, parseFloat(value));
        }
    }

    /**
     * 분노 조건 평가
     */
    evaluateRageCondition({ params }) {
        const [property, operator, value] = params;
        const rage = this.simulationState.resources[RESOURCE_TYPES.RAGE];

        if (!rage) return false;

        switch (property) {
            case 'percent':
                return this.compareValues((rage.current / rage.max) * 100, operator, parseFloat(value));
            case 'deficit':
                return this.compareValues(rage.max - rage.current, operator, parseFloat(value));
            default:
                return this.compareValues(rage.current, operator, parseFloat(value));
        }
    }

    /**
     * 룬 마력 조건 평가
     */
    evaluateRunicPowerCondition({ params }) {
        const [property, operator, value] = params;
        const runicPower = this.simulationState.resources[RESOURCE_TYPES.RUNIC_POWER];

        if (!runicPower) return false;

        switch (property) {
            case 'percent':
                return this.compareValues((runicPower.current / runicPower.max) * 100, operator, parseFloat(value));
            case 'deficit':
                return this.compareValues(runicPower.max - runicPower.current, operator, parseFloat(value));
            default:
                return this.compareValues(runicPower.current, operator, parseFloat(value));
        }
    }

    /**
     * 집중 조건 평가
     */
    evaluateFocusCondition({ params }) {
        const [property, operator, value] = params;
        const focus = this.simulationState.resources[RESOURCE_TYPES.FOCUS];

        if (!focus) return false;

        switch (property) {
            case 'percent':
                return this.compareValues((focus.current / focus.max) * 100, operator, parseFloat(value));
            case 'deficit':
                return this.compareValues(focus.max - focus.current, operator, parseFloat(value));
            case 'time_to_max':
                const timeToMax = (focus.max - focus.current) / focus.regenRate;
                return this.compareValues(timeToMax, operator, parseFloat(value));
            case 'regen':
                return this.compareValues(focus.regenRate, operator, parseFloat(value));
            default:
                return this.compareValues(focus.current, operator, parseFloat(value));
        }
    }

    /**
     * 연계 점수 조건 평가
     */
    evaluateComboPointsCondition({ params }) {
        const [property, operator, value] = params;
        const comboPoints = this.simulationState.resources[RESOURCE_TYPES.COMBO_POINTS];

        if (!comboPoints) return false;

        switch (property) {
            case 'deficit':
                return this.compareValues(comboPoints.max - comboPoints.current, operator, parseFloat(value));
            case 'max':
                return this.compareValues(comboPoints.current, '>=', comboPoints.max);
            default:
                return this.compareValues(comboPoints.current, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 기 조건 평가
     */
    evaluateChiCondition({ params }) {
        const [property, operator, value] = params;
        const chi = this.simulationState.resources[RESOURCE_TYPES.CHI];

        if (!chi) return false;

        switch (property) {
            case 'deficit':
                return this.compareValues(chi.max - chi.current, operator, parseFloat(value));
            case 'max':
                return this.compareValues(chi.current, '>=', chi.max);
            default:
                return this.compareValues(chi.current, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 신성한 힘 조건 평가
     */
    evaluateHolyPowerCondition({ params }) {
        const [property, operator, value] = params;
        const holyPower = this.simulationState.resources[RESOURCE_TYPES.HOLY_POWER];

        if (!holyPower) return false;

        switch (property) {
            case 'deficit':
                return this.compareValues(holyPower.max - holyPower.current, operator, parseFloat(value));
            case 'max':
                return this.compareValues(holyPower.current, '>=', holyPower.max);
            default:
                return this.compareValues(holyPower.current, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 영혼 조각 조건 평가
     */
    evaluateSoulShardsCondition({ params }) {
        const [property, operator, value] = params;
        const soulShards = this.simulationState.resources[RESOURCE_TYPES.SOUL_SHARDS];

        if (!soulShards) return false;

        switch (property) {
            case 'deficit':
                return this.compareValues(soulShards.max - soulShards.current, operator, parseFloat(value));
            case 'fragments':
                const fragments = (soulShards.current % 1) * 10;
                return this.compareValues(fragments, operator, parseFloat(value));
            default:
                return this.compareValues(soulShards.current, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 천공의 힘 조건 평가
     */
    evaluateAstralPowerCondition({ params }) {
        const [property, operator, value] = params;
        const astralPower = this.simulationState.resources[RESOURCE_TYPES.ASTRAL_POWER];

        if (!astralPower) return false;

        switch (property) {
            case 'percent':
                return this.compareValues((astralPower.current / astralPower.max) * 100, operator, parseFloat(value));
            case 'deficit':
                return this.compareValues(astralPower.max - astralPower.current, operator, parseFloat(value));
            default:
                return this.compareValues(astralPower.current, operator, parseFloat(value));
        }
    }

    /**
     * 소용돌이 조건 평가
     */
    evaluateMaelstromCondition({ params }) {
        const [property, operator, value] = params;
        const maelstrom = this.simulationState.resources[RESOURCE_TYPES.MAELSTROM];

        if (!maelstrom) return false;

        switch (property) {
            case 'percent':
                return this.compareValues((maelstrom.current / maelstrom.max) * 100, operator, parseFloat(value));
            case 'deficit':
                return this.compareValues(maelstrom.max - maelstrom.current, operator, parseFloat(value));
            default:
                return this.compareValues(maelstrom.current, operator, parseFloat(value));
        }
    }

    /**
     * 광기 조건 평가
     */
    evaluateInsanityCondition({ params }) {
        const [property, operator, value] = params;
        const insanity = this.simulationState.resources[RESOURCE_TYPES.INSANITY];

        if (!insanity) return false;

        switch (property) {
            case 'percent':
                return this.compareValues((insanity.current / insanity.max) * 100, operator, parseFloat(value));
            case 'drain':
                return this.compareValues(insanity.drainRate, operator, parseFloat(value));
            default:
                return this.compareValues(insanity.current, operator, parseFloat(value));
        }
    }

    /**
     * 비전 충전물 조건 평가
     */
    evaluateArcaneChargesCondition({ params }) {
        const [property, operator, value] = params;
        const arcaneCharges = this.simulationState.resources[RESOURCE_TYPES.ARCANE_CHARGES];

        if (!arcaneCharges) return false;

        switch (property) {
            case 'max':
                return this.compareValues(arcaneCharges.current, '>=', arcaneCharges.max);
            default:
                return this.compareValues(arcaneCharges.current, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 격노 조건 평가
     */
    evaluateFuryCondition({ params }) {
        const [property, operator, value] = params;
        const fury = this.simulationState.resources[RESOURCE_TYPES.FURY];

        if (!fury) return false;

        switch (property) {
            case 'percent':
                return this.compareValues((fury.current / fury.max) * 100, operator, parseFloat(value));
            case 'deficit':
                return this.compareValues(fury.max - fury.current, operator, parseFloat(value));
            default:
                return this.compareValues(fury.current, operator, parseFloat(value));
        }
    }

    /**
     * 고통 조건 평가
     */
    evaluatePainCondition({ params }) {
        const [property, operator, value] = params;
        const pain = this.simulationState.resources[RESOURCE_TYPES.PAIN];

        if (!pain) return false;

        switch (property) {
            case 'percent':
                return this.compareValues((pain.current / pain.max) * 100, operator, parseFloat(value));
            case 'deficit':
                return this.compareValues(pain.max - pain.current, operator, parseFloat(value));
            default:
                return this.compareValues(pain.current, operator, parseFloat(value));
        }
    }

    /**
     * 정수 조건 평가
     */
    evaluateEssenceCondition({ params }) {
        const [property, operator, value] = params;
        const essence = this.simulationState.resources[RESOURCE_TYPES.ESSENCE];

        if (!essence) return false;

        switch (property) {
            case 'deficit':
                return this.compareValues(essence.max - essence.current, operator, parseFloat(value));
            case 'time_to_max':
                const timeToMax = (essence.max - essence.current) / essence.regenRate;
                return this.compareValues(timeToMax, operator, parseFloat(value));
            default:
                return this.compareValues(essence.current, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 버프 조건 평가
     */
    evaluateBuffCondition({ params }) {
        const [buffName, property, operator, value] = params;
        const buff = this.simulationState.buffs.find(b => b.name === buffName);

        if (!buff) {
            return property === 'down' || property === 'missing';
        }

        switch (property) {
            case 'up':
            case 'active':
                return true;
            case 'down':
            case 'missing':
                return false;
            case 'remains':
                return this.compareValues(buff.duration, operator, parseFloat(value));
            case 'stack':
            case 'stacks':
                return this.compareValues(buff.stacks || 1, operator, parseFloat(value));
            case 'refreshable':
                return buff.duration < 3; // 3초 미만이면 갱신 가능
            default:
                return true;
        }
    }

    /**
     * 디버프 조건 평가
     */
    evaluateDebuffCondition({ params }) {
        const [debuffName, property, operator, value] = params;
        const target = this.simulationState.currentTarget;

        if (!target) return false;

        const debuff = target.debuffs.find(d => d.name === debuffName);

        if (!debuff) {
            return property === 'down' || property === 'missing';
        }

        switch (property) {
            case 'up':
            case 'active':
                return true;
            case 'down':
            case 'missing':
                return false;
            case 'remains':
                return this.compareValues(debuff.duration, operator, parseFloat(value));
            case 'stack':
            case 'stacks':
                return this.compareValues(debuff.stacks || 1, operator, parseFloat(value));
            case 'refreshable':
                return debuff.duration < 3;
            default:
                return true;
        }
    }

    /**
     * 오라 조건 평가
     */
    evaluateAuraCondition({ params }) {
        const [auraName, property] = params;
        const aura = this.simulationState.auras.find(a => a.name === auraName);

        if (!aura) {
            return property === 'down' || property === 'missing';
        }

        switch (property) {
            case 'up':
            case 'active':
                return aura.active;
            case 'down':
            case 'missing':
                return !aura.active;
            default:
                return aura.active;
        }
    }

    /**
     * 지속 피해 조건 평가
     */
    evaluateDotCondition({ params }) {
        const [dotName, property, operator, value] = params;
        const target = this.simulationState.currentTarget;

        if (!target) return false;

        const dot = target.dots.find(d => d.name === dotName);

        if (!dot) {
            return property === 'down' || property === 'missing';
        }

        switch (property) {
            case 'up':
            case 'ticking':
                return true;
            case 'down':
            case 'missing':
                return false;
            case 'remains':
                return this.compareValues(dot.duration, operator, parseFloat(value));
            case 'refreshable':
                const pandemicWindow = dot.baseDuration * 0.3;
                return dot.duration < pandemicWindow;
            case 'tick_damage':
                return this.compareValues(dot.tickDamage, operator, parseFloat(value));
            default:
                return true;
        }
    }

    /**
     * 지속 치유 조건 평가
     */
    evaluateHotCondition({ params }) {
        const [hotName, property, operator, value] = params;
        const target = this.simulationState.currentTarget || this.simulationState.player;

        const hot = target.hots.find(h => h.name === hotName);

        if (!hot) {
            return property === 'down' || property === 'missing';
        }

        switch (property) {
            case 'up':
            case 'ticking':
                return true;
            case 'down':
            case 'missing':
                return false;
            case 'remains':
                return this.compareValues(hot.duration, operator, parseFloat(value));
            case 'refreshable':
                const pandemicWindow = hot.baseDuration * 0.3;
                return hot.duration < pandemicWindow;
            case 'tick_heal':
                return this.compareValues(hot.tickHeal, operator, parseFloat(value));
            default:
                return true;
        }
    }

    /**
     * 쿨다운 조건 평가
     */
    evaluateCooldownCondition({ params }) {
        const [abilityName, property, operator, value] = params;
        const cooldown = this.simulationState.cooldowns[abilityName];

        if (!cooldown) return true; // 쿨다운이 없으면 사용 가능

        switch (property) {
            case 'up':
            case 'ready':
                return cooldown.remaining <= 0;
            case 'down':
                return cooldown.remaining > 0;
            case 'remains':
                return this.compareValues(cooldown.remaining, operator, parseFloat(value));
            case 'duration':
                return this.compareValues(cooldown.duration, operator, parseFloat(value));
            default:
                return cooldown.remaining <= 0;
        }
    }

    /**
     * 충전물 조건 평가
     */
    evaluateChargesCondition({ params }) {
        const [abilityName, property, operator, value] = params;
        const charges = this.simulationState.charges[abilityName];

        if (!charges) return false;

        switch (property) {
            case 'current':
                return this.compareValues(charges.current, operator, parseFloat(value));
            case 'max':
                return charges.current >= charges.max;
            case 'fractional':
                const fractional = charges.current + (1 - (charges.rechargeRemaining / charges.rechargeDuration));
                return this.compareValues(fractional, operator, parseFloat(value));
            case 'recharge_time':
                return this.compareValues(charges.rechargeRemaining, operator, parseFloat(value));
            default:
                return this.compareValues(charges.current, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 전역 쿨다운 조건 평가
     */
    evaluateGcdCondition({ params }) {
        const [property, operator, value] = params;
        const gcd = this.simulationState.gcd;

        switch (property) {
            case 'remains':
                return this.compareValues(gcd.remaining, operator, parseFloat(value));
            case 'max':
                return this.compareValues(gcd.duration, operator, parseFloat(value));
            case 'ready':
                return gcd.remaining <= 0;
            default:
                return gcd.remaining <= 0;
        }
    }

    /**
     * 대상 조건 평가
     */
    evaluateTargetCondition({ params }) {
        const [property, operator, value] = params;
        const target = this.simulationState.currentTarget;

        if (!target) return false;

        switch (property) {
            case 'exists':
                return true;
            case 'health':
            case 'health_percent':
                return this.compareValues((target.health / target.maxHealth) * 100, operator, parseFloat(value));
            case 'health_deficit':
                return this.compareValues(target.maxHealth - target.health, operator, parseFloat(value));
            case 'time_to_die':
                const ttd = target.health / (this.simulationState.raid.dps || 1);
                return this.compareValues(ttd, operator, parseFloat(value));
            case 'distance':
                return this.compareValues(target.distance || 0, operator, parseFloat(value));
            case 'in_range':
                const range = parseFloat(value) || 5;
                return target.distance <= range;
            default:
                return false;
        }
    }

    /**
     * 적 조건 평가
     */
    evaluateEnemiesCondition({ params }) {
        const [property, operator, value] = params;
        const enemies = this.simulationState.enemies;

        switch (property) {
            case 'count':
                return this.compareValues(enemies.length, operator, parseFloat(value));
            case 'in_range':
                const range = parseFloat(operator) || 8;
                const inRange = enemies.filter(e => e.distance <= range).length;
                return this.compareValues(inRange, value || '>=', parseFloat(params[2]) || 1);
            case 'clustered':
                // 적들이 모여있는지 확인
                const clustered = this.checkEnemiesClustered(enemies, parseFloat(value) || 8);
                return clustered;
            default:
                return this.compareValues(enemies.length, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 아군 조건 평가
     */
    evaluateAlliesCondition({ params }) {
        const [property, operator, value] = params;
        const allies = this.simulationState.raid.members || [];

        switch (property) {
            case 'count':
                return this.compareValues(allies.length, operator, parseFloat(value));
            case 'injured':
                const injured = allies.filter(a => a.health < a.maxHealth).length;
                return this.compareValues(injured, operator, parseFloat(value));
            case 'health_percent':
                const avgHealth = allies.reduce((sum, a) => sum + (a.health / a.maxHealth), 0) / allies.length * 100;
                return this.compareValues(avgHealth, operator, parseFloat(value));
            default:
                return this.compareValues(allies.length, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 체력 조건 평가
     */
    evaluateHealthCondition({ params }) {
        const [target, property, operator, value] = params;

        let unit;
        if (target === 'player' || target === 'self') {
            unit = this.simulationState.player;
        } else if (target === 'target') {
            unit = this.simulationState.currentTarget;
        } else {
            // property가 첫 번째 매개변수인 경우 (플레이어 기본값)
            unit = this.simulationState.player;
            return this.evaluateHealthForUnit(unit, [target, property, operator]);
        }

        return this.evaluateHealthForUnit(unit, [property, operator, value]);
    }

    /**
     * 유닛 체력 평가
     */
    evaluateHealthForUnit(unit, params) {
        if (!unit) return false;

        const [property, operator, value] = params;

        switch (property) {
            case 'percent':
                return this.compareValues((unit.health / unit.maxHealth) * 100, operator, parseFloat(value));
            case 'deficit':
                return this.compareValues(unit.maxHealth - unit.health, operator, parseFloat(value));
            case 'actual':
                return this.compareValues(unit.health, operator, parseFloat(value));
            case 'max':
                return this.compareValues(unit.maxHealth, operator, parseFloat(value));
            default:
                // 기본값은 퍼센트
                return this.compareValues((unit.health / unit.maxHealth) * 100, operator || '<', parseFloat(value || property));
        }
    }

    /**
     * 거리 조건 평가
     */
    evaluateDistanceCondition({ params }) {
        const [target, operator, value] = params;

        let unit;
        if (target === 'target') {
            unit = this.simulationState.currentTarget;
        } else {
            // target이 숫자인 경우 (대상까지의 거리)
            unit = this.simulationState.currentTarget;
            return this.compareValues(unit ? unit.distance : 999, operator || '<=', parseFloat(target));
        }

        if (!unit) return false;

        return this.compareValues(unit.distance, operator, parseFloat(value));
    }

    /**
     * 시간 조건 평가
     */
    evaluateTimeCondition({ params }) {
        const [property, operator, value] = params;
        const time = this.simulationState.currentTime;

        switch (property) {
            case 'elapsed':
                return this.compareValues(time, operator, parseFloat(value));
            case 'remaining':
                const remaining = this.simulationState.maxTime - time;
                return this.compareValues(remaining, operator, parseFloat(value));
            default:
                return this.compareValues(time, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 생존 시간 조건 평가
     */
    evaluateTimeToDieCondition({ params }) {
        const [target, operator, value] = params;

        let unit;
        if (target === 'target' || target === 'boss') {
            unit = this.simulationState.currentTarget;
        } else {
            // target이 숫자인 경우
            unit = this.simulationState.currentTarget;
            if (!unit) return false;
            const ttd = unit.health / (this.simulationState.raid.dps || 1);
            return this.compareValues(ttd, operator || '<', parseFloat(target));
        }

        if (!unit) return false;

        const ttd = unit.health / (this.simulationState.raid.dps || 1);
        return this.compareValues(ttd, operator, parseFloat(value));
    }

    /**
     * 전투 시간 조건 평가
     */
    evaluateCombatTimeCondition({ params }) {
        const [operator, value] = params;
        const combatTime = this.simulationState.combatTime || 0;

        return this.compareValues(combatTime, operator, parseFloat(value));
    }

    /**
     * 시전 시간 조건 평가
     */
    evaluateCastTimeCondition({ params }) {
        const [spell, operator, value] = params;
        const castTime = this.getSpellCastTime(spell);

        return this.compareValues(castTime, operator, parseFloat(value));
    }

    /**
     * 특성 조건 평가
     */
    evaluateTalentCondition({ params }) {
        const [row, column, property] = params;

        if (property === 'enabled' || property === 'selected') {
            const talent = this.simulationState.talents[`row${row}`];
            return talent === parseInt(column);
        }

        // 특성 이름으로 확인
        const talentName = params.join('_');
        return this.simulationState.talentsByName && this.simulationState.talentsByName[talentName];
    }

    /**
     * 성약 조건 평가
     */
    evaluateCovenantCondition({ params }) {
        const [covenantName] = params;
        return this.simulationState.covenant === covenantName;
    }

    /**
     * 영혼결속 조건 평가
     */
    evaluateSoulbindCondition({ params }) {
        const [soulbindName, trait] = params;

        if (trait) {
            return this.simulationState.soulbindTraits &&
                   this.simulationState.soulbindTraits[soulbindName] &&
                   this.simulationState.soulbindTraits[soulbindName].includes(trait);
        }

        return this.simulationState.soulbind === soulbindName;
    }

    /**
     * 도관 조건 평가
     */
    evaluateConduitCondition({ params }) {
        const [conduitName, property, operator, value] = params;
        const conduit = this.simulationState.conduits && this.simulationState.conduits[conduitName];

        if (!conduit) return false;

        switch (property) {
            case 'rank':
                return this.compareValues(conduit.rank, operator, parseFloat(value));
            case 'equipped':
                return true;
            default:
                return true;
        }
    }

    /**
     * 전설 조건 평가
     */
    evaluateLegendaryCondition({ params }) {
        const [legendaryName] = params;
        return this.simulationState.legendaries &&
               this.simulationState.legendaries.includes(legendaryName);
    }

    /**
     * 세트 보너스 조건 평가
     */
    evaluateSetBonusCondition({ params }) {
        const [setName, pieces] = params;
        const setBonuses = this.simulationState.setBonuses;

        if (!setBonuses || !setBonuses[setName]) return false;

        if (pieces) {
            return setBonuses[setName] >= parseInt(pieces);
        }

        return setBonuses[setName] > 0;
    }

    /**
     * 월식 조건 평가 (드루이드)
     */
    evaluateEclipseCondition({ params }) {
        const [type, property] = params;
        const eclipse = this.simulationState.eclipseSystem;

        if (!eclipse) return false;

        switch (type) {
            case 'solar':
                return property === 'active' ? eclipse.solarEclipse : !eclipse.solarEclipse;
            case 'lunar':
                return property === 'active' ? eclipse.lunarEclipse : !eclipse.lunarEclipse;
            case 'any':
                return eclipse.solarEclipse || eclipse.lunarEclipse;
            case 'none':
                return !eclipse.solarEclipse && !eclipse.lunarEclipse;
            default:
                return false;
        }
    }

    /**
     * 시간차 조건 평가 (수도사)
     */
    evaluateStaggerCondition({ params }) {
        const [property, operator, value] = params;
        const stagger = this.simulationState.staggerSystem;

        if (!stagger) return false;

        switch (property) {
            case 'amount':
                return this.compareValues(stagger.currentStagger, operator, parseFloat(value));
            case 'percent':
                const percent = (stagger.currentStagger / this.simulationState.player.maxHealth) * 100;
                return this.compareValues(percent, operator, parseFloat(value));
            case 'level':
                const level = this.getStaggerLevel(stagger);
                return level === value;
            default:
                return false;
        }
    }

    /**
     * 연계 공격 조건 평가 (수도사)
     */
    evaluateComboStrikesCondition({ params }) {
        const comboStrikes = this.simulationState.comboStrikesSystem;

        if (!comboStrikes) return false;

        return comboStrikes.active && comboStrikes.lastAbility !== this.simulationState.nextAbility;
    }

    /**
     * 소용돌이 무기 조건 평가 (주술사)
     */
    evaluateMaelstromWeaponCondition({ params }) {
        const [property, operator, value] = params;
        const maelstromWeapon = this.simulationState.maelstromWeaponSystem;

        if (!maelstromWeapon) return false;

        switch (property) {
            case 'stacks':
                return this.compareValues(maelstromWeapon.stacks, operator, parseFloat(value));
            case 'ready':
                return maelstromWeapon.stacks >= 5;
            default:
                return this.compareValues(maelstromWeapon.stacks, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 뼈 보호막 조건 평가 (죽음의 기사)
     */
    evaluateBoneShieldCondition({ params }) {
        const [property, operator, value] = params;
        const boneShield = this.simulationState.buffs.find(b => b.name === 'bone_shield');

        if (!boneShield) {
            return property === 'down' || property === 'missing';
        }

        switch (property) {
            case 'stacks':
                return this.compareValues(boneShield.stacks, operator, parseFloat(value));
            case 'remains':
                return this.compareValues(boneShield.duration, operator, parseFloat(value));
            default:
                return this.compareValues(boneShield.stacks, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 고름상처 조건 평가 (죽음의 기사)
     */
    evaluateFesteringWoundCondition({ params }) {
        const [property, operator, value] = params;
        const target = this.simulationState.currentTarget;

        if (!target) return false;

        const wounds = target.debuffs.find(d => d.name === 'festering_wound');

        if (!wounds) {
            return property === 'down' || property === 'missing';
        }

        switch (property) {
            case 'stacks':
                return this.compareValues(wounds.stacks, operator, parseFloat(value));
            case 'remains':
                return this.compareValues(wounds.duration, operator, parseFloat(value));
            default:
                return this.compareValues(wounds.stacks, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 영혼 파편 조건 평가 (악마사냥꾼)
     */
    evaluateSoulFragmentsCondition({ params }) {
        const [property, operator, value] = params;
        const soulFragments = this.simulationState.soulFragmentSystem;

        if (!soulFragments) return false;

        switch (property) {
            case 'available':
                return this.compareValues(soulFragments.available, operator, parseFloat(value));
            case 'incoming':
                return this.compareValues(soulFragments.incoming, operator, parseFloat(value));
            case 'total':
                return this.compareValues(soulFragments.available + soulFragments.incoming, operator, parseFloat(value));
            default:
                return this.compareValues(soulFragments.available, operator || '>=', parseFloat(value || property));
        }
    }

    /**
     * 악마 변신 조건 평가 (악마사냥꾼)
     */
    evaluateMetamorphosisCondition({ params }) {
        const [property, operator, value] = params;
        const metamorphosis = this.simulationState.buffs.find(b => b.name === 'metamorphosis');

        if (!metamorphosis) {
            return property === 'down' || property === 'inactive';
        }

        switch (property) {
            case 'active':
            case 'up':
                return true;
            case 'remains':
                return this.compareValues(metamorphosis.duration, operator, parseFloat(value));
            case 'extended':
                return metamorphosis.extended || false;
            default:
                return true;
        }
    }

    /**
     * AND 논리 연산자 평가
     */
    async evaluateAndCondition({ left, right }) {
        const leftResult = await this.evaluateCondition(left);
        if (!leftResult) return false; // Short-circuit

        const rightResult = await this.evaluateCondition(right);
        return leftResult && rightResult;
    }

    /**
     * OR 논리 연산자 평가
     */
    async evaluateOrCondition({ left, right }) {
        const leftResult = await this.evaluateCondition(left);
        if (leftResult) return true; // Short-circuit

        const rightResult = await this.evaluateCondition(right);
        return leftResult || rightResult;
    }

    /**
     * NOT 논리 연산자 평가
     */
    async evaluateNotCondition({ operand, value }) {
        const result = await this.evaluateCondition(operand || value);
        return !result;
    }

    /**
     * IF 조건 평가
     */
    async evaluateIfCondition({ condition, then, else: elseValue }) {
        const conditionResult = await this.evaluateCondition(condition);
        if (conditionResult) {
            return await this.evaluateCondition(then);
        } else if (elseValue !== undefined) {
            return await this.evaluateCondition(elseValue);
        }
        return false;
    }

    /**
     * 크다 비교 연산자
     */
    async evaluateGreaterCondition({ left, right }) {
        const leftValue = await this.resolveValue(left);
        const rightValue = await this.resolveValue(right);
        return leftValue > rightValue;
    }

    /**
     * 작다 비교 연산자
     */
    async evaluateLessCondition({ left, right }) {
        const leftValue = await this.resolveValue(left);
        const rightValue = await this.resolveValue(right);
        return leftValue < rightValue;
    }

    /**
     * 같다 비교 연산자
     */
    async evaluateEqualCondition({ left, right }) {
        const leftValue = await this.resolveValue(left);
        const rightValue = await this.resolveValue(right);
        return leftValue === rightValue;
    }

    /**
     * 크거나 같다 비교 연산자
     */
    async evaluateGreaterEqualCondition({ left, right }) {
        const leftValue = await this.resolveValue(left);
        const rightValue = await this.resolveValue(right);
        return leftValue >= rightValue;
    }

    /**
     * 작거나 같다 비교 연산자
     */
    async evaluateLessEqualCondition({ left, right }) {
        const leftValue = await this.resolveValue(left);
        const rightValue = await this.resolveValue(right);
        return leftValue <= rightValue;
    }

    /**
     * 같지 않다 비교 연산자
     */
    async evaluateNotEqualCondition({ left, right }) {
        const leftValue = await this.resolveValue(left);
        const rightValue = await this.resolveValue(right);
        return leftValue !== rightValue;
    }

    /**
     * IN 집합 연산자
     */
    async evaluateInCondition({ value, list }) {
        const resolvedValue = await this.resolveValue(value);
        const resolvedList = await Promise.all(list.map(item => this.resolveValue(item)));
        return resolvedList.includes(resolvedValue);
    }

    /**
     * CONTAINS 집합 연산자
     */
    async evaluateContainsCondition({ list, value }) {
        const resolvedValue = await this.resolveValue(value);
        const resolvedList = await Promise.all(list.map(item => this.resolveValue(item)));
        return resolvedList.includes(resolvedValue);
    }

    /**
     * ANY 집합 연산자
     */
    async evaluateAnyCondition({ list, condition }) {
        for (const item of list) {
            const result = await this.evaluateCondition({ ...condition, target: item });
            if (result) return true;
        }
        return false;
    }

    /**
     * ALL 집합 연산자
     */
    async evaluateAllCondition({ list, condition }) {
        for (const item of list) {
            const result = await this.evaluateCondition({ ...condition, target: item });
            if (!result) return false;
        }
        return true;
    }

    /**
     * NONE 집합 연산자
     */
    async evaluateNoneCondition({ list, condition }) {
        for (const item of list) {
            const result = await this.evaluateCondition({ ...condition, target: item });
            if (result) return false;
        }
        return true;
    }

    /**
     * 값 해결
     */
    async resolveValue(value) {
        if (typeof value === 'number' || typeof value === 'boolean') {
            return value;
        }

        if (typeof value === 'string') {
            // 변수 참조
            if (value.startsWith('$')) {
                const varName = value.substring(1);
                return this.simulationState.variables[varName] || 0;
            }

            // 함수 호출
            if (value.includes('(')) {
                return await this.evaluateFunctionCall(value);
            }

            // 숫자로 변환 시도
            const num = parseFloat(value);
            if (!isNaN(num)) return num;

            return value;
        }

        if (typeof value === 'object' && value !== null) {
            return await this.evaluateCondition(value);
        }

        return 0;
    }

    /**
     * 함수 호출 평가
     */
    async evaluateFunctionCall(functionCall) {
        const match = functionCall.match(/(\w+)\((.*)\)/);
        if (!match) return 0;

        const [, functionName, args] = match;
        const parsedArgs = args.split(',').map(arg => arg.trim());

        switch (functionName) {
            case 'min':
                const minValues = await Promise.all(parsedArgs.map(arg => this.resolveValue(arg)));
                return Math.min(...minValues);
            case 'max':
                const maxValues = await Promise.all(parsedArgs.map(arg => this.resolveValue(arg)));
                return Math.max(...maxValues);
            case 'floor':
                return Math.floor(await this.resolveValue(parsedArgs[0]));
            case 'ceil':
                return Math.ceil(await this.resolveValue(parsedArgs[0]));
            case 'round':
                return Math.round(await this.resolveValue(parsedArgs[0]));
            case 'abs':
                return Math.abs(await this.resolveValue(parsedArgs[0]));
            case 'random':
                const min = await this.resolveValue(parsedArgs[0] || '0');
                const max = await this.resolveValue(parsedArgs[1] || '1');
                return Math.random() * (max - min) + min;
            default:
                return 0;
        }
    }

    /**
     * 값 비교
     */
    compareValues(left, operator, right) {
        switch (operator) {
            case '>':
            case 'gt':
                return left > right;
            case '<':
            case 'lt':
                return left < right;
            case '>=':
            case 'gte':
            case 'ge':
                return left >= right;
            case '<=':
            case 'lte':
            case 'le':
                return left <= right;
            case '==':
            case '=':
            case 'eq':
                return left == right;
            case '!=':
            case 'ne':
            case 'neq':
                return left != right;
            default:
                return false;
        }
    }

    /**
     * 시전 시간 가져오기
     */
    getSpellCastTime(spellName) {
        const spell = this.simulationState.spellbook && this.simulationState.spellbook[spellName];
        if (!spell) return 0;

        // 가속 적용
        const haste = this.simulationState.stats.haste || 0;
        const baseCastTime = spell.castTime || 0;
        return baseCastTime / (1 + haste / 100);
    }

    /**
     * 시간차 레벨 가져오기
     */
    getStaggerLevel(stagger) {
        const percent = stagger.currentStagger / this.simulationState.player.maxHealth;

        if (percent >= stagger.heavyThreshold) return 'heavy';
        if (percent >= stagger.moderateThreshold) return 'moderate';
        if (percent >= stagger.lightThreshold) return 'light';
        return 'none';
    }

    /**
     * 적 군집 확인
     */
    checkEnemiesClustered(enemies, radius) {
        if (enemies.length < 2) return false;

        // 간단한 군집 체크: 반경 내에 있는 적의 비율
        const centerPoint = this.simulationState.player.position || { x: 0, y: 0 };
        const clusteredCount = enemies.filter(enemy => {
            const distance = Math.sqrt(
                Math.pow(enemy.position.x - centerPoint.x, 2) +
                Math.pow(enemy.position.y - centerPoint.y, 2)
            );
            return distance <= radius;
        }).length;

        return clusteredCount >= Math.ceil(enemies.length * 0.7); // 70% 이상이 모여있으면 군집
    }

    /**
     * 캐시 키 생성
     */
    generateCacheKey(condition) {
        if (typeof condition === 'string') return condition;
        if (typeof condition === 'boolean') return condition.toString();
        if (typeof condition === 'number') return condition.toString();

        return JSON.stringify(condition);
    }

    /**
     * 메트릭 업데이트
     */
    updateMetrics(startTime) {
        const duration = performance.now() - startTime;

        this.evaluationMetrics.averageEvaluationTime =
            (this.evaluationMetrics.averageEvaluationTime * (this.evaluationMetrics.totalEvaluations - 1) + duration) /
            this.evaluationMetrics.totalEvaluations;

        // 매 초마다 초당 평가 수 계산
        if (!this.lastMetricUpdate || Date.now() - this.lastMetricUpdate > 1000) {
            this.evaluationMetrics.evaluationsPerSecond = this.evaluationMetrics.totalEvaluations;
            this.lastMetricUpdate = Date.now();
        }
    }

    /**
     * 메트릭 리셋
     */
    resetMetrics() {
        this.evaluationMetrics = {
            evaluationsPerSecond: 0,
            cacheHits: 0,
            cacheMisses: 0,
            totalEvaluations: 0,
            averageEvaluationTime: 0
        };
    }

    /**
     * 메트릭 가져오기
     */
    getMetrics() {
        const cacheHitRate = this.evaluationMetrics.totalEvaluations > 0
            ? (this.evaluationMetrics.cacheHits / this.evaluationMetrics.totalEvaluations) * 100
            : 0;

        return {
            ...this.evaluationMetrics,
            cacheHitRate: cacheHitRate.toFixed(2) + '%',
            cacheSize: this.conditionCache.size
        };
    }
}

export default APLConditionEvaluator;