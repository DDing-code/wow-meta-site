/**
 * APL Priority System
 * APL 우선순위 관리 시스템
 */

import { EventEmitter } from 'events';

export class APLPrioritySystem extends EventEmitter {
    constructor() {
        super();

        this.priorityRules = {
            // 기본 우선순위 규칙
            emergency: 1000,      // 긴급 액션 (생존기 등)
            interrupt: 900,       // 차단
            movement: 800,        // 이동 관련
            resource_cap: 700,    // 리소스 캡 방지
            proc: 600,           // 프록 사용
            cooldown: 500,       // 주요 쿨다운
            maintenance: 400,    // 버프/디버프 유지
            generator: 300,      // 리소스 생성
            spender: 200,        // 리소스 소비
            filler: 100,         // 필러
            idle: 0              // 대기
        };

        this.dynamicFactors = {
            timeToKill: 1.0,
            resourceEfficiency: 1.0,
            synergyBonus: 1.0,
            targetVulnerability: 1.0,
            raidUtility: 1.0,
            personalSurvival: 1.0
        };

        this.classSpecificPriorities = this.initializeClassPriorities();
        this.synergyMatrix = this.initializeSynergyMatrix();
        this.setupMetrics();
    }

    /**
     * 클래스별 우선순위 초기화
     */
    initializeClassPriorities() {
        return {
            // 전사
            warrior: {
                arms: {
                    mortal_strike: { base: 600, category: 'cooldown' },
                    colossus_smash: { base: 700, category: 'cooldown' },
                    bladestorm: { base: 500, category: 'cooldown' },
                    overpower: { base: 550, category: 'proc' },
                    execute: { base: 800, category: 'execute' },
                    slam: { base: 200, category: 'filler' }
                },
                fury: {
                    rampage: { base: 700, category: 'spender' },
                    raging_blow: { base: 500, category: 'generator' },
                    bloodthirst: { base: 600, category: 'cooldown' },
                    execute: { base: 800, category: 'execute' },
                    whirlwind: { base: 100, category: 'filler' }
                },
                protection: {
                    shield_slam: { base: 600, category: 'cooldown' },
                    thunder_clap: { base: 400, category: 'maintenance' },
                    revenge: { base: 550, category: 'proc' },
                    devastate: { base: 200, category: 'filler' }
                }
            },

            // 성기사
            paladin: {
                holy: {
                    holy_shock: { base: 700, category: 'cooldown' },
                    light_of_dawn: { base: 600, category: 'cooldown' },
                    holy_light: { base: 300, category: 'generator' },
                    flash_of_light: { base: 800, category: 'emergency' }
                },
                protection: {
                    shield_of_the_righteous: { base: 700, category: 'spender' },
                    judgment: { base: 500, category: 'cooldown' },
                    hammer_of_the_righteous: { base: 400, category: 'generator' },
                    consecration: { base: 300, category: 'maintenance' }
                },
                retribution: {
                    wake_of_ashes: { base: 700, category: 'cooldown' },
                    blade_of_justice: { base: 500, category: 'generator' },
                    templars_verdict: { base: 600, category: 'spender' },
                    judgment: { base: 400, category: 'maintenance' },
                    hammer_of_wrath: { base: 800, category: 'execute' }
                }
            },

            // 사냥꾼
            hunter: {
                beast_mastery: {
                    barbed_shot: { base: 700, category: 'maintenance' },
                    kill_command: { base: 600, category: 'cooldown' },
                    bestial_wrath: { base: 800, category: 'cooldown' },
                    cobra_shot: { base: 200, category: 'filler' },
                    kill_shot: { base: 900, category: 'execute' }
                },
                marksmanship: {
                    aimed_shot: { base: 700, category: 'spender' },
                    rapid_fire: { base: 600, category: 'cooldown' },
                    arcane_shot: { base: 400, category: 'generator' },
                    steady_shot: { base: 200, category: 'filler' },
                    kill_shot: { base: 900, category: 'execute' }
                },
                survival: {
                    wildfire_bomb: { base: 700, category: 'cooldown' },
                    kill_command: { base: 600, category: 'cooldown' },
                    raptor_strike: { base: 500, category: 'spender' },
                    serpent_sting: { base: 400, category: 'maintenance' },
                    kill_shot: { base: 900, category: 'execute' }
                }
            },

            // 도적
            rogue: {
                assassination: {
                    garrote: { base: 700, category: 'maintenance' },
                    rupture: { base: 650, category: 'maintenance' },
                    mutilate: { base: 400, category: 'generator' },
                    envenom: { base: 600, category: 'spender' },
                    vendetta: { base: 800, category: 'cooldown' }
                },
                outlaw: {
                    roll_the_bones: { base: 700, category: 'maintenance' },
                    between_the_eyes: { base: 600, category: 'spender' },
                    dispatch: { base: 500, category: 'spender' },
                    sinister_strike: { base: 300, category: 'generator' },
                    blade_flurry: { base: 400, category: 'maintenance' }
                },
                subtlety: {
                    shadow_dance: { base: 800, category: 'cooldown' },
                    symbols_of_death: { base: 750, category: 'cooldown' },
                    shadow_blades: { base: 700, category: 'cooldown' },
                    eviscerate: { base: 600, category: 'spender' },
                    backstab: { base: 300, category: 'generator' }
                }
            },

            // 사제
            priest: {
                discipline: {
                    shadow_mend: { base: 800, category: 'emergency' },
                    power_word_shield: { base: 700, category: 'maintenance' },
                    penance: { base: 600, category: 'cooldown' },
                    smite: { base: 200, category: 'filler' },
                    power_word_radiance: { base: 500, category: 'maintenance' }
                },
                holy: {
                    holy_word_serenity: { base: 900, category: 'emergency' },
                    holy_word_sanctify: { base: 800, category: 'cooldown' },
                    circle_of_healing: { base: 700, category: 'cooldown' },
                    prayer_of_mending: { base: 600, category: 'maintenance' },
                    heal: { base: 300, category: 'filler' }
                },
                shadow: {
                    void_eruption: { base: 900, category: 'cooldown' },
                    devouring_plague: { base: 700, category: 'maintenance' },
                    shadow_word_pain: { base: 600, category: 'maintenance' },
                    vampiric_touch: { base: 650, category: 'maintenance' },
                    mind_blast: { base: 500, category: 'cooldown' },
                    mind_flay: { base: 200, category: 'filler' }
                }
            },

            // 죽음의 기사
            death_knight: {
                blood: {
                    death_strike: { base: 800, category: 'spender' },
                    marrowrend: { base: 700, category: 'maintenance' },
                    blood_boil: { base: 500, category: 'generator' },
                    heart_strike: { base: 400, category: 'generator' },
                    death_and_decay: { base: 300, category: 'maintenance' }
                },
                frost: {
                    obliterate: { base: 700, category: 'spender' },
                    frost_strike: { base: 600, category: 'spender' },
                    remorseless_winter: { base: 500, category: 'cooldown' },
                    howling_blast: { base: 400, category: 'generator' },
                    pillar_of_frost: { base: 800, category: 'cooldown' }
                },
                unholy: {
                    festering_strike: { base: 700, category: 'maintenance' },
                    death_coil: { base: 600, category: 'spender' },
                    apocalypse: { base: 800, category: 'cooldown' },
                    outbreak: { base: 500, category: 'maintenance' },
                    army_of_the_dead: { base: 900, category: 'cooldown' }
                }
            },

            // 주술사
            shaman: {
                elemental: {
                    flame_shock: { base: 700, category: 'maintenance' },
                    lava_burst: { base: 800, category: 'proc' },
                    earth_shock: { base: 600, category: 'spender' },
                    lightning_bolt: { base: 300, category: 'generator' },
                    elemental_blast: { base: 700, category: 'cooldown' }
                },
                enhancement: {
                    stormstrike: { base: 700, category: 'spender' },
                    lava_lash: { base: 600, category: 'spender' },
                    crash_lightning: { base: 500, category: 'maintenance' },
                    lightning_bolt: { base: 800, category: 'proc' },
                    windfury_totem: { base: 900, category: 'maintenance' }
                },
                restoration: {
                    riptide: { base: 700, category: 'maintenance' },
                    healing_wave: { base: 400, category: 'generator' },
                    healing_surge: { base: 800, category: 'emergency' },
                    chain_heal: { base: 600, category: 'cooldown' },
                    healing_rain: { base: 500, category: 'maintenance' }
                }
            },

            // 마법사
            mage: {
                arcane: {
                    arcane_orb: { base: 700, category: 'cooldown' },
                    arcane_blast: { base: 600, category: 'generator' },
                    arcane_missiles: { base: 800, category: 'proc' },
                    arcane_barrage: { base: 500, category: 'spender' },
                    arcane_power: { base: 900, category: 'cooldown' }
                },
                fire: {
                    pyroblast: { base: 900, category: 'proc' },
                    fire_blast: { base: 800, category: 'proc' },
                    fireball: { base: 400, category: 'generator' },
                    combustion: { base: 1000, category: 'cooldown' },
                    phoenix_flames: { base: 700, category: 'cooldown' }
                },
                frost: {
                    ice_lance: { base: 800, category: 'proc' },
                    flurry: { base: 850, category: 'proc' },
                    frostbolt: { base: 400, category: 'generator' },
                    frozen_orb: { base: 700, category: 'cooldown' },
                    icy_veins: { base: 900, category: 'cooldown' }
                }
            },

            // 흑마법사
            warlock: {
                affliction: {
                    agony: { base: 750, category: 'maintenance' },
                    corruption: { base: 700, category: 'maintenance' },
                    unstable_affliction: { base: 650, category: 'maintenance' },
                    malefic_rapture: { base: 600, category: 'spender' },
                    haunt: { base: 800, category: 'cooldown' }
                },
                demonology: {
                    call_dreadstalkers: { base: 700, category: 'cooldown' },
                    hand_of_guldan: { base: 650, category: 'spender' },
                    demonbolt: { base: 500, category: 'generator' },
                    summon_demonic_tyrant: { base: 900, category: 'cooldown' },
                    shadow_bolt: { base: 200, category: 'filler' }
                },
                destruction: {
                    immolate: { base: 700, category: 'maintenance' },
                    conflagrate: { base: 600, category: 'cooldown' },
                    chaos_bolt: { base: 800, category: 'spender' },
                    incinerate: { base: 300, category: 'generator' },
                    summon_infernal: { base: 900, category: 'cooldown' }
                }
            },

            // 수도사
            monk: {
                brewmaster: {
                    keg_smash: { base: 700, category: 'cooldown' },
                    breath_of_fire: { base: 600, category: 'maintenance' },
                    blackout_strike: { base: 500, category: 'cooldown' },
                    tiger_palm: { base: 400, category: 'generator' },
                    ironskin_brew: { base: 800, category: 'maintenance' },
                    purifying_brew: { base: 900, category: 'emergency' }
                },
                windwalker: {
                    rising_sun_kick: { base: 700, category: 'cooldown' },
                    fists_of_fury: { base: 800, category: 'cooldown' },
                    whirling_dragon_punch: { base: 750, category: 'cooldown' },
                    tiger_palm: { base: 400, category: 'generator' },
                    blackout_kick: { base: 500, category: 'spender' }
                },
                mistweaver: {
                    essence_font: { base: 700, category: 'cooldown' },
                    renewing_mist: { base: 650, category: 'maintenance' },
                    vivify: { base: 500, category: 'generator' },
                    enveloping_mist: { base: 600, category: 'spender' },
                    revival: { base: 1000, category: 'emergency' }
                }
            },

            // 드루이드
            druid: {
                balance: {
                    sunfire: { base: 700, category: 'maintenance' },
                    moonfire: { base: 650, category: 'maintenance' },
                    starsurge: { base: 800, category: 'spender' },
                    starfire: { base: 400, category: 'generator' },
                    wrath: { base: 350, category: 'generator' },
                    celestial_alignment: { base: 900, category: 'cooldown' }
                },
                feral: {
                    rake: { base: 700, category: 'maintenance' },
                    rip: { base: 750, category: 'maintenance' },
                    ferocious_bite: { base: 600, category: 'spender' },
                    shred: { base: 400, category: 'generator' },
                    tigers_fury: { base: 800, category: 'cooldown' }
                },
                guardian: {
                    ironfur: { base: 800, category: 'maintenance' },
                    mangle: { base: 600, category: 'cooldown' },
                    thrash: { base: 500, category: 'maintenance' },
                    moonfire: { base: 400, category: 'maintenance' },
                    maul: { base: 300, category: 'spender' }
                },
                restoration: {
                    lifebloom: { base: 750, category: 'maintenance' },
                    rejuvenation: { base: 600, category: 'maintenance' },
                    wild_growth: { base: 700, category: 'cooldown' },
                    regrowth: { base: 500, category: 'generator' },
                    swiftmend: { base: 800, category: 'emergency' }
                }
            },

            // 악마사냥꾼
            demon_hunter: {
                havoc: {
                    immolation_aura: { base: 700, category: 'cooldown' },
                    blade_dance: { base: 600, category: 'cooldown' },
                    chaos_strike: { base: 500, category: 'spender' },
                    demons_bite: { base: 300, category: 'generator' },
                    eye_beam: { base: 800, category: 'cooldown' },
                    metamorphosis: { base: 1000, category: 'cooldown' }
                },
                vengeance: {
                    demon_spikes: { base: 800, category: 'maintenance' },
                    immolation_aura: { base: 700, category: 'cooldown' },
                    soul_cleave: { base: 600, category: 'spender' },
                    fracture: { base: 500, category: 'generator' },
                    spirit_bomb: { base: 650, category: 'cooldown' }
                }
            },

            // 기원사
            evoker: {
                devastation: {
                    fire_breath: { base: 800, category: 'cooldown' },
                    eternity_surge: { base: 750, category: 'cooldown' },
                    disintegrate: { base: 600, category: 'spender' },
                    living_flame: { base: 400, category: 'generator' },
                    dragonrage: { base: 1000, category: 'cooldown' }
                },
                preservation: {
                    dream_breath: { base: 800, category: 'cooldown' },
                    spiritbloom: { base: 700, category: 'cooldown' },
                    echo: { base: 600, category: 'maintenance' },
                    reversion: { base: 500, category: 'maintenance' },
                    emerald_blossom: { base: 400, category: 'generator' }
                },
                augmentation: {
                    prescience: { base: 700, category: 'maintenance' },
                    eruption: { base: 600, category: 'spender' },
                    upheaval: { base: 650, category: 'cooldown' },
                    fire_breath: { base: 700, category: 'cooldown' },
                    living_flame: { base: 300, category: 'generator' }
                }
            }
        };
    }

    /**
     * 시너지 매트릭스 초기화
     */
    initializeSynergyMatrix() {
        return {
            // 버프 시너지
            bloodlust_effects: {
                cooldowns: 1.5,      // 블러드러스트 중 쿨다운 우선순위 증가
                spenders: 1.3,       // 리소스 소비 능력 우선순위 증가
                proc_windows: 1.4    // 프록 사용 우선순위 증가
            },

            // 대상 디버프 시너지
            vulnerability_effects: {
                high_damage: 1.4,    // 취약 효과 중 고데미지 능력 우선순위
                dot_refresh: 0.8,    // DoT 갱신 우선순위 감소
                burst_window: 1.6    // 폭발 구간 우선순위 증가
            },

            // 리소스 상태 시너지
            resource_states: {
                high_resource: {
                    spenders: 1.3,
                    generators: 0.7,
                    maintenance: 1.1
                },
                low_resource: {
                    spenders: 0.8,
                    generators: 1.4,
                    pooling: 1.2
                },
                capped_resource: {
                    spenders: 1.8,
                    generators: 0.3,
                    anything_else: 0.9
                }
            },

            // 체력 상태 시너지
            health_states: {
                low_health: {
                    emergency: 2.0,
                    defensive: 1.5,
                    offensive: 0.6
                },
                execute_range: {
                    execute_abilities: 1.8,
                    finishers: 1.4,
                    maintenance: 0.8
                }
            },

            // 이동 상태 시너지
            movement_states: {
                moving: {
                    instant_cast: 1.3,
                    channels: 0.5,
                    cast_time: 0.2
                },
                stationary: {
                    channels: 1.2,
                    cast_time: 1.1,
                    positioning: 0.8
                }
            }
        };
    }

    /**
     * 메트릭 설정
     */
    setupMetrics() {
        this.metrics = {
            totalPrioritizations: 0,
            averagePrioritizationTime: 0,
            priorityDistribution: {},
            categoryDistribution: {},
            dynamicAdjustments: 0
        };
    }

    /**
     * 액션 우선순위 정렬
     */
    async prioritize(actions, simulationState, executionState) {
        const startTime = performance.now();
        this.metrics.totalPrioritizations++;

        try {
            // 각 액션의 우선순위 계산
            const prioritizedActions = await Promise.all(
                actions.map(async action => {
                    const priority = await this.calculatePriority(
                        action,
                        simulationState,
                        executionState
                    );
                    return { action, priority };
                })
            );

            // 우선순위에 따라 정렬
            prioritizedActions.sort((a, b) => b.priority - a.priority);

            // 메트릭 업데이트
            this.updateMetrics(startTime, prioritizedActions);

            // 정렬된 액션 반환
            return prioritizedActions.map(item => item.action);

        } catch (error) {
            this.emit('error', {
                type: 'PRIORITIZATION_ERROR',
                error: error.message
            });
            return actions; // 실패 시 원본 순서 유지
        }
    }

    /**
     * 액션 우선순위 계산
     */
    async calculatePriority(action, simulationState, executionState) {
        let priority = 0;

        // 1. 기본 우선순위
        priority = this.getBasePriority(action, simulationState);

        // 2. 카테고리 보정
        priority *= this.getCategoryMultiplier(action.category || 'default');

        // 3. 동적 요소 적용
        priority *= await this.applyDynamicFactors(action, simulationState, executionState);

        // 4. 시너지 보정
        priority *= this.applySynergyBonus(action, simulationState);

        // 5. 조건 복잡도 보정
        priority *= this.getConditionComplexityModifier(action);

        // 6. 최근 사용 패널티
        priority *= this.getRecencyPenalty(action, executionState);

        // 7. 위치/거리 보정
        priority *= this.getPositionalModifier(action, simulationState);

        // 8. 타이밍 보정
        priority *= this.getTimingModifier(action, simulationState);

        // 9. 연쇄 보너스
        priority *= this.getChainBonus(action, executionState);

        // 10. 커스텀 우선순위 오버라이드
        if (action.priority !== undefined) {
            priority = action.priority;
        }

        return priority;
    }

    /**
     * 기본 우선순위 가져오기
     */
    getBasePriority(action, simulationState) {
        // 클래스별 우선순위 확인
        const classData = simulationState.class;
        const specData = simulationState.spec;

        if (classData && specData) {
            const classPriorities = this.classSpecificPriorities[classData]?.[specData];
            if (classPriorities && classPriorities[action.name]) {
                return classPriorities[action.name].base;
            }
        }

        // 액션 타입별 기본 우선순위
        if (this.priorityRules[action.type]) {
            return this.priorityRules[action.type];
        }

        // 카테고리별 기본 우선순위
        if (action.category && this.priorityRules[action.category]) {
            return this.priorityRules[action.category];
        }

        return 100; // 기본값
    }

    /**
     * 카테고리 배수 가져오기
     */
    getCategoryMultiplier(category) {
        const multipliers = {
            emergency: 2.0,
            execute: 1.8,
            interrupt: 1.7,
            proc: 1.5,
            cooldown: 1.3,
            maintenance: 1.2,
            spender: 1.1,
            generator: 1.0,
            filler: 0.9,
            idle: 0.5,
            default: 1.0
        };

        return multipliers[category] || 1.0;
    }

    /**
     * 동적 요소 적용
     */
    async applyDynamicFactors(action, simulationState, executionState) {
        let multiplier = 1.0;

        // 생존 시간 요소
        if (simulationState.currentTarget) {
            const ttk = this.estimateTimeToKill(simulationState.currentTarget);
            multiplier *= this.getTimeToKillMultiplier(action, ttk);
        }

        // 리소스 효율성
        multiplier *= this.getResourceEfficiencyMultiplier(action, simulationState);

        // 공격대 유틸리티
        multiplier *= this.getRaidUtilityMultiplier(action, simulationState);

        // 개인 생존
        const healthPercent = (simulationState.player.health / simulationState.player.maxHealth) * 100;
        if (healthPercent < 30) {
            if (action.category === 'emergency' || action.category === 'defensive') {
                multiplier *= 2.0;
            } else {
                multiplier *= 0.7;
            }
        }

        // 대상 취약성
        multiplier *= this.getTargetVulnerabilityMultiplier(action, simulationState);

        return multiplier;
    }

    /**
     * 시너지 보너스 적용
     */
    applySynergyBonus(action, simulationState) {
        let bonus = 1.0;

        // 블러드러스트/히로이즘 체크
        if (simulationState.buffs?.find(b => b.name === 'bloodlust' || b.name === 'heroism')) {
            const synergy = this.synergyMatrix.bloodlust_effects;
            if (action.category === 'cooldown') bonus *= synergy.cooldowns;
            if (action.category === 'spender') bonus *= synergy.spenders;
            if (action.category === 'proc') bonus *= synergy.proc_windows;
        }

        // 리소스 상태 시너지
        const resourcePercent = this.getResourcePercent(simulationState);
        if (resourcePercent > 80) {
            const synergy = this.synergyMatrix.resource_states.high_resource;
            if (action.category === 'spender') bonus *= synergy.spenders;
            if (action.category === 'generator') bonus *= synergy.generators;
        } else if (resourcePercent < 20) {
            const synergy = this.synergyMatrix.resource_states.low_resource;
            if (action.category === 'spender') bonus *= synergy.spenders;
            if (action.category === 'generator') bonus *= synergy.generators;
        }

        // 체력 상태 시너지
        const healthPercent = (simulationState.player.health / simulationState.player.maxHealth) * 100;
        if (healthPercent < 30) {
            const synergy = this.synergyMatrix.health_states.low_health;
            if (action.category === 'emergency') bonus *= synergy.emergency;
            if (action.category === 'defensive') bonus *= synergy.defensive;
        }

        // 대상 체력 시너지 (처형 구간)
        if (simulationState.currentTarget) {
            const targetHealthPercent = (simulationState.currentTarget.health /
                                       simulationState.currentTarget.maxHealth) * 100;
            if (targetHealthPercent < 20) {
                const synergy = this.synergyMatrix.health_states.execute_range;
                if (action.category === 'execute') bonus *= synergy.execute_abilities;
                if (action.category === 'spender') bonus *= synergy.finishers;
            }
        }

        // 이동 상태 시너지
        if (simulationState.moving) {
            const synergy = this.synergyMatrix.movement_states.moving;
            if (action.instant) bonus *= synergy.instant_cast;
            if (action.channel) bonus *= synergy.channels;
            if (action.castTime > 0) bonus *= synergy.cast_time;
        }

        return bonus;
    }

    /**
     * 조건 복잡도 보정
     */
    getConditionComplexityModifier(action) {
        if (!action.condition) return 1.0;

        // 복잡한 조건일수록 우선순위 감소
        const complexity = this.calculateConditionComplexity(action.condition);
        return Math.max(0.5, 1.0 - (complexity * 0.1));
    }

    /**
     * 최근 사용 패널티
     */
    getRecencyPenalty(action, executionState) {
        if (!executionState.actionHistory) return 1.0;

        const recentActions = executionState.actionHistory.slice(-5);
        const recentUses = recentActions.filter(a => a.action === action.name).length;

        // 최근에 많이 사용했으면 우선순위 감소
        return Math.max(0.3, 1.0 - (recentUses * 0.15));
    }

    /**
     * 위치/거리 보정
     */
    getPositionalModifier(action, simulationState) {
        if (!action.range || !simulationState.currentTarget) return 1.0;

        const distance = simulationState.currentTarget.distance || 0;

        // 거리가 멀수록 원거리 능력 우선
        if (distance > 10) {
            return action.range > 20 ? 1.2 : 0.8;
        }

        // 근거리일 때 근접 능력 우선
        if (distance <= 5) {
            return action.range <= 5 ? 1.1 : 0.9;
        }

        return 1.0;
    }

    /**
     * 타이밍 보정
     */
    getTimingModifier(action, simulationState) {
        let modifier = 1.0;

        // GCD 고려
        if (simulationState.gcd && simulationState.gcd.remaining > 0) {
            // GCD 중에는 즉시 시전 능력 우선
            if (action.ignoresGCD) {
                modifier *= 1.3;
            }
        }

        // 시전 중 고려
        if (simulationState.casting) {
            // 시전 중에는 즉시 시전만 가능
            if (!action.instant) {
                return 0;
            }
        }

        // 채널링 중 고려
        if (simulationState.channeling) {
            // 채널링 중에는 중요한 액션만
            if (action.category !== 'emergency' && action.category !== 'interrupt') {
                return 0.2;
            }
        }

        // 쿨다운 곧 준비되는 능력 우선
        if (action.cooldown) {
            const cooldownRemaining = simulationState.cooldowns?.[action.name]?.remaining || 0;
            if (cooldownRemaining < 2 && cooldownRemaining > 0) {
                modifier *= 1.2; // 곧 사용 가능한 쿨다운 우선
            }
        }

        return modifier;
    }

    /**
     * 연쇄 보너스
     */
    getChainBonus(action, executionState) {
        if (!executionState.lastAction) return 1.0;

        // 콤보/연쇄 시스템
        const lastAction = executionState.lastAction;

        // 클래스별 콤보 시스템
        if (action.combo && lastAction.name === action.combo.requires) {
            return 1.5; // 콤보 보너스
        }

        // 시너지 있는 액션 연쇄
        if (action.synergy && action.synergy.includes(lastAction.name)) {
            return 1.3;
        }

        // 같은 액션 반복 패널티 (일부 제외)
        if (lastAction.name === action.name && !action.allowRepeat) {
            return 0.7;
        }

        return 1.0;
    }

    // === 유틸리티 메서드 ===

    /**
     * 생존 시간 추정
     */
    estimateTimeToKill(target) {
        if (!target) return 999;

        const dps = target.incomingDPS || 10000; // 기본 DPS
        return target.health / dps;
    }

    /**
     * 생존 시간 배수
     */
    getTimeToKillMultiplier(action, ttk) {
        if (ttk < 10) {
            // 짧은 전투: 즉발 능력 우선
            if (action.instant) return 1.2;
            if (action.castTime > 2) return 0.8;
        } else if (ttk > 60) {
            // 긴 전투: 유지 능력 우선
            if (action.category === 'maintenance') return 1.3;
            if (action.category === 'cooldown' && action.cooldown > 120) return 0.9;
        }

        return 1.0;
    }

    /**
     * 리소스 효율성 배수
     */
    getResourceEfficiencyMultiplier(action, simulationState) {
        if (!action.resource) return 1.0;

        const resource = simulationState.resources[action.resource.type];
        if (!resource) return 1.0;

        const efficiency = action.resource.generated ?
            action.resource.generated / (action.resource.cost || 1) :
            (action.damage || action.healing || 100) / (action.resource.cost || 1);

        // 효율이 높을수록 우선순위 증가
        return Math.min(1.5, 0.8 + (efficiency / 100));
    }

    /**
     * 공격대 유틸리티 배수
     */
    getRaidUtilityMultiplier(action, simulationState) {
        if (!action.raidUtility) return 1.0;

        const raidSize = simulationState.raid?.members?.length || 1;
        const utilityValue = action.raidUtility * Math.min(raidSize, action.maxTargets || 5);

        return Math.min(1.5, 1.0 + (utilityValue / 100));
    }

    /**
     * 대상 취약성 배수
     */
    getTargetVulnerabilityMultiplier(action, simulationState) {
        if (!simulationState.currentTarget) return 1.0;

        const target = simulationState.currentTarget;
        let multiplier = 1.0;

        // 대상 디버프 확인
        if (target.debuffs) {
            // 받는 피해 증가 디버프
            if (target.debuffs.find(d => d.name === 'vulnerable' || d.name === 'exposed')) {
                if (action.category === 'cooldown' || action.category === 'spender') {
                    multiplier *= 1.4;
                }
            }

            // 특정 속성 취약
            if (action.school) {
                const vulnerability = target.debuffs.find(d => d.school === action.school);
                if (vulnerability) {
                    multiplier *= 1.2;
                }
            }
        }

        return multiplier;
    }

    /**
     * 리소스 퍼센트 가져오기
     */
    getResourcePercent(simulationState) {
        const primaryResource = simulationState.primaryResource;
        if (!primaryResource) return 50;

        const resource = simulationState.resources[primaryResource];
        if (!resource) return 50;

        return (resource.current / resource.max) * 100;
    }

    /**
     * 조건 복잡도 계산
     */
    calculateConditionComplexity(condition, depth = 0) {
        if (!condition) return 0;
        if (typeof condition === 'boolean') return 0;
        if (typeof condition === 'string') return 1;

        let complexity = 1;

        if (condition.type === 'and' || condition.type === 'or') {
            complexity += this.calculateConditionComplexity(condition.left, depth + 1);
            complexity += this.calculateConditionComplexity(condition.right, depth + 1);
        } else if (condition.type === 'not') {
            complexity += this.calculateConditionComplexity(condition.operand, depth + 1);
        }

        return complexity + depth * 0.5;
    }

    /**
     * 메트릭 업데이트
     */
    updateMetrics(startTime, prioritizedActions) {
        const duration = performance.now() - startTime;

        this.metrics.averagePrioritizationTime =
            (this.metrics.averagePrioritizationTime * (this.metrics.totalPrioritizations - 1) + duration) /
            this.metrics.totalPrioritizations;

        // 우선순위 분포 업데이트
        for (const item of prioritizedActions) {
            const bucket = Math.floor(item.priority / 100) * 100;
            this.metrics.priorityDistribution[bucket] = (this.metrics.priorityDistribution[bucket] || 0) + 1;

            // 카테고리 분포 업데이트
            const category = item.action.category || 'default';
            this.metrics.categoryDistribution[category] = (this.metrics.categoryDistribution[category] || 0) + 1;
        }
    }

    /**
     * 메트릭 가져오기
     */
    getMetrics() {
        return {
            ...this.metrics,
            averageTime: this.metrics.averagePrioritizationTime.toFixed(2) + 'ms'
        };
    }

    /**
     * 우선순위 리셋
     */
    resetPriorities() {
        this.dynamicFactors = {
            timeToKill: 1.0,
            resourceEfficiency: 1.0,
            synergyBonus: 1.0,
            targetVulnerability: 1.0,
            raidUtility: 1.0,
            personalSurvival: 1.0
        };
    }

    /**
     * 커스텀 우선순위 규칙 추가
     */
    addCustomRule(name, priority) {
        this.priorityRules[name] = priority;
    }

    /**
     * 클래스별 우선순위 업데이트
     */
    updateClassPriority(className, spec, ability, priority) {
        if (!this.classSpecificPriorities[className]) {
            this.classSpecificPriorities[className] = {};
        }
        if (!this.classSpecificPriorities[className][spec]) {
            this.classSpecificPriorities[className][spec] = {};
        }
        this.classSpecificPriorities[className][spec][ability] = priority;
    }
}

export default APLPrioritySystem;