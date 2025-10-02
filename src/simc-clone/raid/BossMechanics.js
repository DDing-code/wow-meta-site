/**
 * Boss Mechanics System
 * 레이드 보스 메커니즘 시스템
 */

import { EventEmitter } from 'events';

export class BossMechanics extends EventEmitter {
    constructor() {
        super();

        this.bosses = this.initializeBosses();
        this.activeMechanics = [];
        this.mechanicTimers = new Map();
        this.phaseTransitions = new Map();
        this.positionRequirements = new Map();

        this.setupMechanicHandlers();
    }

    /**
     * 보스 데이터 초기화
     */
    initializeBosses() {
        return {
            // Dragonflight 레이드 보스들
            'raszageth': {
                name: '라자게스',
                health: 100000000,
                phases: [
                    { id: 1, healthPercent: 100, name: 'Platform Phase' },
                    { id: 2, healthPercent: 65, name: 'Intermission' },
                    { id: 3, healthPercent: 0, name: 'Final Phase' }
                ],
                mechanics: {
                    // Phase 1
                    'volatile_current': {
                        type: 'aoe',
                        damage: 50000,
                        interval: 20,
                        phase: 1,
                        description: '휘발성 전류 - 무작위 플레이어에게 AoE 피해'
                    },
                    'lightning_breath': {
                        type: 'frontal_cone',
                        damage: 100000,
                        interval: 25,
                        phase: 1,
                        description: '번개 숨결 - 전방 원뿔 공격'
                    },
                    'electric_scales': {
                        type: 'buff',
                        stacks: 1,
                        interval: 30,
                        phase: 1,
                        description: '전기 비늘 - 보스 피해 감소 버프'
                    },
                    // Phase 2
                    'tempest_wing': {
                        type: 'knockback',
                        force: 30,
                        interval: 15,
                        phase: 2,
                        description: '폭풍 날개 - 전체 넉백'
                    },
                    'hurricane': {
                        type: 'persistent_aoe',
                        damage: 30000,
                        duration: 20,
                        interval: 40,
                        phase: 2,
                        description: '허리케인 - 지속 피해 장판'
                    }
                }
            },

            'terros': {
                name: '테로스',
                health: 85000000,
                phases: [
                    { id: 1, healthPercent: 100, name: 'Rock Phase' },
                    { id: 2, healthPercent: 30, name: 'Enrage Phase' }
                ],
                mechanics: {
                    'rock_blast': {
                        type: 'targeted',
                        damage: 80000,
                        interval: 18,
                        phase: 1,
                        description: '바위 폭발 - 대상 지점 폭발'
                    },
                    'resonating_annihilation': {
                        type: 'beam',
                        damage: 150000,
                        interval: 35,
                        phase: 1,
                        description: '공명하는 전멸 - 레이저 빔'
                    },
                    'earthen_pillar': {
                        type: 'summon',
                        health: 50000,
                        interval: 25,
                        phase: 1,
                        description: '대지의 기둥 소환'
                    },
                    'shattering_impact': {
                        type: 'raid_damage',
                        damage: 40000,
                        interval: 20,
                        phase: 2,
                        description: '산산조각 충격 - 공격대 전체 피해'
                    }
                }
            },

            'council_of_dreams': {
                name: '꿈의 의회',
                health: 120000000, // 총 체력
                bosses: ['urctos', 'aerwynn', 'pip'],
                sharedHealth: true,
                phases: [
                    { id: 1, healthPercent: 100, name: 'Council Active' }
                ],
                mechanics: {
                    'barreling_charge': {
                        type: 'charge',
                        damage: 60000,
                        interval: 22,
                        boss: 'urctos',
                        description: '우르크토스 - 돌진 공격'
                    },
                    'agonizing_claws': {
                        type: 'tank_debuff',
                        damage: 20000,
                        stacks: 99,
                        interval: 5,
                        boss: 'urctos',
                        description: '우르크토스 - 탱커 디버프'
                    },
                    'noxious_blossom': {
                        type: 'ground_effect',
                        damage: 35000,
                        radius: 8,
                        interval: 15,
                        boss: 'aerwynn',
                        description: '에르윈 - 독성 꽃 소환'
                    },
                    'constricting_thicket': {
                        type: 'root',
                        duration: 4,
                        interval: 20,
                        boss: 'aerwynn',
                        description: '에르윈 - 속박 덩굴'
                    },
                    'polymorph_bomb': {
                        type: 'debuff',
                        duration: 6,
                        interval: 30,
                        boss: 'pip',
                        description: '핍 - 변이 폭탄'
                    }
                }
            },

            'fyrakk': {
                name: '피라크',
                health: 150000000,
                phases: [
                    { id: 1, healthPercent: 100, name: 'Corruption Phase' },
                    { id: 2, healthPercent: 70, name: 'Shadowflame Phase' },
                    { id: 3, healthPercent: 40, name: 'Apocalypse Phase' }
                ],
                mechanics: {
                    // Phase 1
                    'dream_rend': {
                        type: 'tank_swap',
                        damage: 100000,
                        debuffStacks: 2,
                        interval: 20,
                        phase: 1,
                        description: '꿈 찢기 - 탱커 교대 메커니즘'
                    },
                    'blazing_seed': {
                        type: 'spreading',
                        damage: 40000,
                        radius: 5,
                        interval: 25,
                        phase: 1,
                        description: '타오르는 씨앗 - 산개 메커니즘'
                    },
                    // Phase 2
                    'shadowflame_devastation': {
                        type: 'breath',
                        damage: 200000,
                        angle: 90,
                        interval: 30,
                        phase: 2,
                        description: '암흑불길 파멸 - 브레스 공격'
                    },
                    'darkflame_shades': {
                        type: 'add_spawn',
                        count: 3,
                        health: 100000,
                        interval: 45,
                        phase: 2,
                        description: '암흑불길 그림자 - 쫄 소환'
                    },
                    // Phase 3
                    'apocalypse_roar': {
                        type: 'raid_wipe',
                        damage: 500000,
                        castTime: 10,
                        interval: 60,
                        phase: 3,
                        description: '대재앙의 포효 - 전멸기'
                    },
                    'seeds_of_amirdrassil': {
                        type: 'healing_absorb',
                        amount: 100000,
                        targets: 5,
                        interval: 35,
                        phase: 3,
                        description: '아미르드라실의 씨앗 - 치유 흡수'
                    }
                }
            },

            // Classic 레이드 보스 예시
            'ragnaros': {
                name: '라그나로스',
                health: 50000000,
                phases: [
                    { id: 1, healthPercent: 100, name: 'Emerged' },
                    { id: 2, healthPercent: 0, name: 'Submerge' }
                ],
                mechanics: {
                    'wrath_of_ragnaros': {
                        type: 'knockback',
                        damage: 30000,
                        interval: 25,
                        phase: 1,
                        description: '라그나로스의 분노 - 넉백'
                    },
                    'lava_burst': {
                        type: 'random_target',
                        damage: 50000,
                        targets: 3,
                        interval: 20,
                        phase: 1,
                        description: '용암 폭발 - 무작위 대상'
                    },
                    'sons_of_flame': {
                        type: 'add_spawn',
                        count: 8,
                        health: 20000,
                        interval: 180,
                        phase: 2,
                        description: '화염의 아들 소환'
                    }
                }
            },

            'kelthuzad': {
                name: '켈투자드',
                health: 60000000,
                phases: [
                    { id: 1, healthPercent: 100, name: 'Minion Phase' },
                    { id: 2, healthPercent: 100, name: 'Main Phase' }
                ],
                mechanics: {
                    'frost_blast': {
                        type: 'freeze',
                        damage: 40000,
                        duration: 4,
                        targets: 2,
                        interval: 30,
                        phase: 2,
                        description: '서리 작열 - 얼음 감옥'
                    },
                    'mana_detonation': {
                        type: 'mana_burn',
                        damage: 2000, // per 1000 mana
                        interval: 20,
                        phase: 2,
                        description: '마나 폭발 - 마나 소진'
                    },
                    'shadow_fissure': {
                        type: 'void_zone',
                        damage: 100000,
                        delay: 3,
                        interval: 15,
                        phase: 2,
                        description: '암흑 균열 - 장판 회피'
                    },
                    'guardians_of_icecrown': {
                        type: 'add_spawn',
                        count: 2,
                        health: 150000,
                        timer: 300, // 5분
                        phase: 2,
                        description: '얼음왕관의 수호자 소환'
                    }
                }
            }
        };
    }

    /**
     * 메커니즘 핸들러 설정
     */
    setupMechanicHandlers() {
        this.mechanicHandlers = {
            'aoe': this.handleAoEMechanic.bind(this),
            'frontal_cone': this.handleFrontalConeMechanic.bind(this),
            'targeted': this.handleTargetedMechanic.bind(this),
            'beam': this.handleBeamMechanic.bind(this),
            'raid_damage': this.handleRaidDamageMechanic.bind(this),
            'tank_swap': this.handleTankSwapMechanic.bind(this),
            'spreading': this.handleSpreadingMechanic.bind(this),
            'stacking': this.handleStackingMechanic.bind(this),
            'soak': this.handleSoakMechanic.bind(this),
            'add_spawn': this.handleAddSpawnMechanic.bind(this),
            'knockback': this.handleKnockbackMechanic.bind(this),
            'charge': this.handleChargeMechanic.bind(this),
            'ground_effect': this.handleGroundEffectMechanic.bind(this),
            'buff': this.handleBuffMechanic.bind(this),
            'debuff': this.handleDebuffMechanic.bind(this),
            'tank_debuff': this.handleTankDebuffMechanic.bind(this),
            'root': this.handleRootMechanic.bind(this),
            'freeze': this.handleFreezeMechanic.bind(this),
            'breath': this.handleBreathMechanic.bind(this),
            'persistent_aoe': this.handlePersistentAoEMechanic.bind(this),
            'summon': this.handleSummonMechanic.bind(this),
            'void_zone': this.handleVoidZoneMechanic.bind(this),
            'mana_burn': this.handleManaBurnMechanic.bind(this),
            'healing_absorb': this.handleHealingAbsorbMechanic.bind(this),
            'raid_wipe': this.handleRaidWipeMechanic.bind(this),
            'random_target': this.handleRandomTargetMechanic.bind(this)
        };
    }

    /**
     * 보스 전투 시작
     */
    startEncounter(bossId, raidState) {
        const boss = this.bosses[bossId];
        if (!boss) {
            throw new Error(`Unknown boss: ${bossId}`);
        }

        this.currentBoss = boss;
        this.currentPhase = boss.phases[0];
        this.raidState = raidState;
        this.encounterStartTime = Date.now();
        this.mechanicSchedule = this.generateMechanicSchedule(boss);

        this.emit('encounterStart', {
            boss: boss.name,
            phase: this.currentPhase.name,
            mechanics: Object.keys(boss.mechanics)
        });

        this.startMechanicTimers();
        return boss;
    }

    /**
     * 메커니즘 스케줄 생성
     */
    generateMechanicSchedule(boss) {
        const schedule = [];

        for (const [mechanicId, mechanic] of Object.entries(boss.mechanics)) {
            if (mechanic.interval) {
                // 주기적 메커니즘
                let nextTime = mechanic.interval;
                while (nextTime <= 600) { // 최대 10분
                    schedule.push({
                        time: nextTime * 1000,
                        mechanicId,
                        mechanic
                    });
                    nextTime += mechanic.interval;
                }
            } else if (mechanic.timer) {
                // 특정 시간 메커니즘
                schedule.push({
                    time: mechanic.timer * 1000,
                    mechanicId,
                    mechanic
                });
            }
        }

        // 시간순 정렬
        schedule.sort((a, b) => a.time - b.time);
        return schedule;
    }

    /**
     * 메커니즘 타이머 시작
     */
    startMechanicTimers() {
        for (const scheduled of this.mechanicSchedule) {
            const timer = setTimeout(() => {
                if (this.shouldExecuteMechanic(scheduled.mechanic)) {
                    this.executeMechanic(scheduled.mechanicId, scheduled.mechanic);
                }
            }, scheduled.time);

            this.mechanicTimers.set(scheduled.mechanicId, timer);
        }
    }

    /**
     * 메커니즘 실행 조건 확인
     */
    shouldExecuteMechanic(mechanic) {
        // 페이즈 확인
        if (mechanic.phase && mechanic.phase !== this.currentPhase.id) {
            return false;
        }

        // 특정 보스 확인 (의회 전투 등)
        if (mechanic.boss && !this.isBossActive(mechanic.boss)) {
            return false;
        }

        return true;
    }

    /**
     * 메커니즘 실행
     */
    executeMechanic(mechanicId, mechanic) {
        const handler = this.mechanicHandlers[mechanic.type];
        if (!handler) {
            console.warn(`Unknown mechanic type: ${mechanic.type}`);
            return;
        }

        this.emit('mechanicStart', {
            id: mechanicId,
            type: mechanic.type,
            description: mechanic.description
        });

        const result = handler(mechanic, this.raidState);

        this.emit('mechanicComplete', {
            id: mechanicId,
            result
        });

        // 메커니즘 기록
        this.activeMechanics.push({
            id: mechanicId,
            mechanic,
            timestamp: Date.now(),
            result
        });
    }

    /**
     * AoE 메커니즘 처리
     */
    handleAoEMechanic(mechanic, raidState) {
        const targets = this.selectRandomTargets(raidState.players, mechanic.targets || 1);
        const damage = this.calculateDamage(mechanic.damage);

        for (const target of targets) {
            // AoE 중심점
            const position = target.position;
            const radius = mechanic.radius || 8;

            // 범위 내 플레이어 찾기
            const affectedPlayers = raidState.players.filter(player => {
                const distance = this.calculateDistance(player.position, position);
                return distance <= radius;
            });

            // 피해 적용
            for (const player of affectedPlayers) {
                const finalDamage = this.applyMitigation(damage, player);
                player.health -= finalDamage;

                this.emit('damage', {
                    source: 'boss',
                    target: player,
                    amount: finalDamage,
                    type: 'aoe',
                    mechanic: mechanic.description
                });
            }
        }

        return { targets: targets.length, damage };
    }

    /**
     * 전방 원뿔 메커니즘 처리
     */
    handleFrontalConeMechanic(mechanic, raidState) {
        const boss = this.currentBoss;
        const angle = mechanic.angle || 90;
        const range = mechanic.range || 30;
        const damage = this.calculateDamage(mechanic.damage);

        // 보스 전방 원뿔 범위 내 플레이어 찾기
        const affectedPlayers = raidState.players.filter(player => {
            return this.isInCone(
                boss.position,
                boss.facing,
                player.position,
                angle,
                range
            );
        });

        // 피해 적용
        for (const player of affectedPlayers) {
            const finalDamage = this.applyMitigation(damage, player);
            player.health -= finalDamage;

            this.emit('damage', {
                source: 'boss',
                target: player,
                amount: finalDamage,
                type: 'frontal_cone',
                mechanic: mechanic.description
            });
        }

        return { targets: affectedPlayers.length, damage };
    }

    /**
     * 대상 지정 메커니즘 처리
     */
    handleTargetedMechanic(mechanic, raidState) {
        const targets = this.selectRandomTargets(raidState.players, mechanic.targets || 1);
        const damage = this.calculateDamage(mechanic.damage);

        for (const target of targets) {
            // 시전 시간
            if (mechanic.castTime) {
                this.emit('cast', {
                    spell: mechanic.description,
                    target,
                    duration: mechanic.castTime
                });
            }

            // 피해 적용
            setTimeout(() => {
                const finalDamage = this.applyMitigation(damage, target);
                target.health -= finalDamage;

                this.emit('damage', {
                    source: 'boss',
                    target,
                    amount: finalDamage,
                    type: 'targeted',
                    mechanic: mechanic.description
                });
            }, (mechanic.castTime || 0) * 1000);
        }

        return { targets: targets.map(t => t.name) };
    }

    /**
     * 빔 메커니즘 처리
     */
    handleBeamMechanic(mechanic, raidState) {
        const source = this.currentBoss.position;
        const target = this.selectRandomTarget(raidState.players);
        const damage = this.calculateDamage(mechanic.damage);

        if (!target) return { targets: 0 };

        // 빔 경로 계산
        const beamPath = this.calculateBeamPath(source, target.position);

        // 빔 경로 상의 플레이어 찾기
        const affectedPlayers = raidState.players.filter(player => {
            return this.isOnBeamPath(player.position, beamPath, mechanic.width || 5);
        });

        // 피해 적용
        for (const player of affectedPlayers) {
            const finalDamage = this.applyMitigation(damage, player);
            player.health -= finalDamage;

            this.emit('damage', {
                source: 'boss',
                target: player,
                amount: finalDamage,
                type: 'beam',
                mechanic: mechanic.description
            });
        }

        return {
            targets: affectedPlayers.length,
            damage,
            path: beamPath
        };
    }

    /**
     * 공격대 전체 피해 메커니즘 처리
     */
    handleRaidDamageMechanic(mechanic, raidState) {
        const damage = this.calculateDamage(mechanic.damage);
        let totalDamage = 0;

        for (const player of raidState.players) {
            const finalDamage = this.applyMitigation(damage, player);
            player.health -= finalDamage;
            totalDamage += finalDamage;

            this.emit('damage', {
                source: 'boss',
                target: player,
                amount: finalDamage,
                type: 'raid_damage',
                mechanic: mechanic.description
            });
        }

        return {
            targets: raidState.players.length,
            totalDamage,
            averageDamage: totalDamage / raidState.players.length
        };
    }

    /**
     * 탱커 교대 메커니즘 처리
     */
    handleTankSwapMechanic(mechanic, raidState) {
        const currentTank = this.getCurrentTank(raidState);
        if (!currentTank) return { success: false };

        // 디버프 적용
        if (!currentTank.debuffs) currentTank.debuffs = [];

        const existingDebuff = currentTank.debuffs.find(d => d.name === mechanic.description);
        if (existingDebuff) {
            existingDebuff.stacks++;
        } else {
            currentTank.debuffs.push({
                name: mechanic.description,
                stacks: 1,
                duration: mechanic.duration || 60
            });
        }

        // 스택이 임계값에 도달하면 경고
        if (existingDebuff && existingDebuff.stacks >= (mechanic.debuffStacks || 2)) {
            this.emit('tankSwapRequired', {
                currentTank,
                stacks: existingDebuff.stacks,
                mechanic: mechanic.description
            });
        }

        // 피해 적용
        const damage = this.calculateDamage(mechanic.damage);
        const finalDamage = this.applyMitigation(damage, currentTank);
        currentTank.health -= finalDamage;

        return {
            tank: currentTank.name,
            stacks: existingDebuff ? existingDebuff.stacks : 1,
            damage: finalDamage
        };
    }

    /**
     * 산개 메커니즘 처리
     */
    handleSpreadingMechanic(mechanic, raidState) {
        const targets = this.selectRandomTargets(
            raidState.players,
            mechanic.targets || Math.ceil(raidState.players.length / 3)
        );

        const damage = this.calculateDamage(mechanic.damage);
        const radius = mechanic.radius || 8;
        const results = [];

        for (const target of targets) {
            // 대상 주변 플레이어 찾기
            const nearbyPlayers = raidState.players.filter(player => {
                if (player === target) return false;
                const distance = this.calculateDistance(player.position, target.position);
                return distance <= radius;
            });

            // 산개 실패 시 추가 피해
            let totalDamage = damage;
            if (nearbyPlayers.length > 0) {
                totalDamage = damage * (1 + nearbyPlayers.length * 0.5);

                // 주변 플레이어에게도 피해
                for (const nearby of nearbyPlayers) {
                    const finalDamage = this.applyMitigation(damage, nearby);
                    nearby.health -= finalDamage;

                    this.emit('damage', {
                        source: 'spread_failure',
                        target: nearby,
                        amount: finalDamage,
                        type: 'spreading',
                        mechanic: mechanic.description
                    });
                }
            }

            // 대상 피해
            const finalDamage = this.applyMitigation(totalDamage, target);
            target.health -= finalDamage;

            results.push({
                target: target.name,
                nearbyCount: nearbyPlayers.length,
                damage: finalDamage
            });
        }

        return { results };
    }

    /**
     * 쭉개 메커니즘 처리
     */
    handleStackingMechanic(mechanic, raidState) {
        const target = this.selectRandomTarget(raidState.players);
        if (!target) return { success: false };

        const radius = mechanic.radius || 8;

        // 대상 주변 플레이어 찾기
        const stackedPlayers = raidState.players.filter(player => {
            const distance = this.calculateDistance(player.position, target.position);
            return distance <= radius;
        });

        // 피해 분산
        const damage = this.calculateDamage(mechanic.damage);
        const splitDamage = Math.max(damage / stackedPlayers.length, damage * 0.2);

        for (const player of stackedPlayers) {
            const finalDamage = this.applyMitigation(splitDamage, player);
            player.health -= finalDamage;

            this.emit('damage', {
                source: 'boss',
                target: player,
                amount: finalDamage,
                type: 'stacking',
                mechanic: mechanic.description
            });
        }

        return {
            target: target.name,
            stackCount: stackedPlayers.length,
            damagePerPlayer: splitDamage
        };
    }

    /**
     * 흡수 메커니즘 처리
     */
    handleSoakMechanic(mechanic, raidState) {
        const soakPositions = this.generateSoakPositions(mechanic.count || 3);
        const damage = this.calculateDamage(mechanic.damage);
        const results = [];

        for (const position of soakPositions) {
            // 위치에서 가장 가까운 플레이어 찾기
            const soaker = this.findClosestPlayer(position, raidState.players);

            if (soaker && this.calculateDistance(soaker.position, position) <= (mechanic.radius || 5)) {
                // 흡수 성공
                const finalDamage = this.applyMitigation(damage * 0.5, soaker);
                soaker.health -= finalDamage;

                results.push({
                    position,
                    soaked: true,
                    soaker: soaker.name,
                    damage: finalDamage
                });
            } else {
                // 흡수 실패 - 공격대 전체 피해
                for (const player of raidState.players) {
                    const finalDamage = this.applyMitigation(damage, player);
                    player.health -= finalDamage;
                }

                results.push({
                    position,
                    soaked: false,
                    raidDamage: damage
                });
            }
        }

        return { results };
    }

    /**
     * 쫄 소환 메커니즘 처리
     */
    handleAddSpawnMechanic(mechanic, raidState) {
        const adds = [];
        const spawnPositions = this.generateSpawnPositions(mechanic.count || 1);

        for (let i = 0; i < (mechanic.count || 1); i++) {
            const add = {
                id: `add_${Date.now()}_${i}`,
                name: mechanic.name || 'Summoned Add',
                health: mechanic.health || 50000,
                maxHealth: mechanic.health || 50000,
                position: spawnPositions[i],
                threat: new Map(),
                abilities: mechanic.abilities || []
            };

            adds.push(add);
            raidState.enemies.push(add);
        }

        this.emit('addsSpawned', {
            adds,
            mechanic: mechanic.description
        });

        return {
            count: adds.length,
            totalHealth: adds.reduce((sum, add) => sum + add.health, 0)
        };
    }

    /**
     * 넉백 메커니즘 처리
     */
    handleKnockbackMechanic(mechanic, raidState) {
        const source = mechanic.source || this.currentBoss.position;
        const force = mechanic.force || 20;
        const damage = mechanic.damage || 0;

        for (const player of raidState.players) {
            // 넉백 방향과 거리 계산
            const direction = this.calculateDirection(source, player.position);
            const knockbackDistance = force * (1 - player.knockbackResistance || 0);

            // 새 위치 계산
            const newPosition = {
                x: player.position.x + direction.x * knockbackDistance,
                y: player.position.y + direction.y * knockbackDistance,
                z: player.position.z || 0
            };

            // 위치 유효성 검사
            if (this.isValidPosition(newPosition)) {
                player.position = newPosition;
            } else {
                // 벽이나 낭떠러지 - 추가 피해
                const fallDamage = this.calculateDamage(damage * 2);
                player.health -= fallDamage;

                this.emit('environmentalDamage', {
                    target: player,
                    damage: fallDamage,
                    type: 'fall'
                });
            }

            // 기본 피해
            if (damage > 0) {
                const finalDamage = this.applyMitigation(damage, player);
                player.health -= finalDamage;
            }
        }

        return {
            affected: raidState.players.length,
            force: knockbackDistance
        };
    }

    /**
     * 돌진 메커니즘 처리
     */
    handleChargeMechanic(mechanic, raidState) {
        const target = mechanic.fixedTarget || this.selectRandomTarget(
            raidState.players.filter(p => p.role !== 'tank')
        );

        if (!target) return { success: false };

        const damage = this.calculateDamage(mechanic.damage);
        const chargePath = this.calculateChargePath(this.currentBoss.position, target.position);

        // 경로 상의 플레이어 찾기
        const hitPlayers = raidState.players.filter(player => {
            return this.isOnChargePath(player.position, chargePath, mechanic.width || 5);
        });

        // 피해 적용
        for (const player of hitPlayers) {
            let finalDamage = damage;

            // 주 대상은 더 큰 피해
            if (player === target) {
                finalDamage *= 1.5;
            }

            finalDamage = this.applyMitigation(finalDamage, player);
            player.health -= finalDamage;

            // 기절 효과
            if (mechanic.stun) {
                player.stunned = true;
                setTimeout(() => { player.stunned = false; }, mechanic.stun * 1000);
            }

            this.emit('damage', {
                source: 'boss',
                target: player,
                amount: finalDamage,
                type: 'charge',
                mechanic: mechanic.description
            });
        }

        return {
            target: target.name,
            hitCount: hitPlayers.length,
            damage
        };
    }

    /**
     * 장판 메커니즘 처리
     */
    handleGroundEffectMechanic(mechanic, raidState) {
        const positions = this.generateGroundEffectPositions(mechanic.count || 1);
        const damage = this.calculateDamage(mechanic.damage);
        const duration = mechanic.duration || 10;
        const radius = mechanic.radius || 8;

        for (const position of positions) {
            // 장판 생성
            const groundEffect = {
                id: `ground_${Date.now()}`,
                position,
                radius,
                damage,
                duration,
                createdAt: Date.now()
            };

            raidState.groundEffects = raidState.groundEffects || [];
            raidState.groundEffects.push(groundEffect);

            // 주기적 피해
            const tickInterval = setInterval(() => {
                const affectedPlayers = raidState.players.filter(player => {
                    const distance = this.calculateDistance(player.position, position);
                    return distance <= radius;
                });

                for (const player of affectedPlayers) {
                    const finalDamage = this.applyMitigation(damage, player);
                    player.health -= finalDamage;

                    this.emit('damage', {
                        source: 'ground_effect',
                        target: player,
                        amount: finalDamage,
                        type: 'dot',
                        mechanic: mechanic.description
                    });
                }
            }, 1000);

            // 지속시간 후 제거
            setTimeout(() => {
                clearInterval(tickInterval);
                const index = raidState.groundEffects.findIndex(ge => ge.id === groundEffect.id);
                if (index !== -1) {
                    raidState.groundEffects.splice(index, 1);
                }
            }, duration * 1000);
        }

        return {
            count: positions.length,
            duration,
            damage
        };
    }

    /**
     * 버프 메커니즘 처리
     */
    handleBuffMechanic(mechanic, raidState) {
        const target = mechanic.target || this.currentBoss;

        if (!target.buffs) target.buffs = [];

        const buff = {
            name: mechanic.name || mechanic.description,
            stacks: mechanic.stacks || 1,
            duration: mechanic.duration || 30,
            effect: mechanic.effect || {},
            appliedAt: Date.now()
        };

        // 기존 버프 확인
        const existingBuff = target.buffs.find(b => b.name === buff.name);
        if (existingBuff) {
            existingBuff.stacks = Math.min(
                existingBuff.stacks + buff.stacks,
                mechanic.maxStacks || 99
            );
        } else {
            target.buffs.push(buff);
        }

        // 버프 효과 적용
        if (mechanic.effect) {
            this.applyBuffEffect(target, mechanic.effect);
        }

        this.emit('buffApplied', {
            target,
            buff,
            mechanic: mechanic.description
        });

        return {
            target: target.name || 'boss',
            buff: buff.name,
            stacks: existingBuff ? existingBuff.stacks : buff.stacks
        };
    }

    /**
     * 디버프 메커니즘 처리
     */
    handleDebuffMechanic(mechanic, raidState) {
        const targets = this.selectRandomTargets(raidState.players, mechanic.targets || 1);
        const results = [];

        for (const target of targets) {
            if (!target.debuffs) target.debuffs = [];

            const debuff = {
                name: mechanic.name || mechanic.description,
                stacks: mechanic.stacks || 1,
                duration: mechanic.duration || 10,
                effect: mechanic.effect || {},
                appliedAt: Date.now()
            };

            target.debuffs.push(debuff);

            // 디버프 효과 적용
            if (mechanic.effect) {
                this.applyDebuffEffect(target, mechanic.effect);
            }

            // 지속 피해
            if (mechanic.dotDamage) {
                const tickInterval = setInterval(() => {
                    const damage = this.calculateDamage(mechanic.dotDamage);
                    const finalDamage = this.applyMitigation(damage, target);
                    target.health -= finalDamage;

                    this.emit('damage', {
                        source: 'debuff',
                        target,
                        amount: finalDamage,
                        type: 'dot',
                        mechanic: mechanic.description
                    });
                }, 1000);

                setTimeout(() => clearInterval(tickInterval), debuff.duration * 1000);
            }

            results.push({
                target: target.name,
                debuff: debuff.name
            });
        }

        return { results };
    }

    // === 유틸리티 메서드 ===

    /**
     * 거리 계산
     */
    calculateDistance(pos1, pos2) {
        if (!pos1 || !pos2) return 999;

        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = (pos1.z || 0) - (pos2.z || 0);

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * 원뿔 범위 확인
     */
    isInCone(origin, facing, target, angle, range) {
        const distance = this.calculateDistance(origin, target);
        if (distance > range) return false;

        const toTarget = {
            x: target.x - origin.x,
            y: target.y - origin.y
        };

        const dot = (facing.x * toTarget.x + facing.y * toTarget.y) / distance;
        const angleToTarget = Math.acos(dot) * (180 / Math.PI);

        return angleToTarget <= angle / 2;
    }

    /**
     * 빔 경로 계산
     */
    calculateBeamPath(source, target) {
        return {
            start: source,
            end: target,
            direction: {
                x: target.x - source.x,
                y: target.y - source.y,
                z: (target.z || 0) - (source.z || 0)
            }
        };
    }

    /**
     * 빔 경로 상 확인
     */
    isOnBeamPath(position, beamPath, width) {
        // 점과 선분 사이의 거리 계산
        const A = beamPath.start;
        const B = beamPath.end;
        const P = position;

        const AB = {
            x: B.x - A.x,
            y: B.y - A.y
        };

        const AP = {
            x: P.x - A.x,
            y: P.y - A.y
        };

        const AB_squared = AB.x * AB.x + AB.y * AB.y;
        const t = Math.max(0, Math.min(1, (AP.x * AB.x + AP.y * AB.y) / AB_squared));

        const projection = {
            x: A.x + t * AB.x,
            y: A.y + t * AB.y
        };

        const distance = this.calculateDistance(position, projection);
        return distance <= width;
    }

    /**
     * 무작위 대상 선택
     */
    selectRandomTarget(players) {
        const validTargets = players.filter(p => p.health > 0);
        if (validTargets.length === 0) return null;

        return validTargets[Math.floor(Math.random() * validTargets.length)];
    }

    /**
     * 무작위 다중 대상 선택
     */
    selectRandomTargets(players, count) {
        const validTargets = players.filter(p => p.health > 0);
        const selected = [];

        while (selected.length < count && selected.length < validTargets.length) {
            const target = validTargets[Math.floor(Math.random() * validTargets.length)];
            if (!selected.includes(target)) {
                selected.push(target);
            }
        }

        return selected;
    }

    /**
     * 현재 탱커 가져오기
     */
    getCurrentTank(raidState) {
        // 위협 수준이 가장 높은 플레이어
        let currentTank = null;
        let highestThreat = 0;

        for (const player of raidState.players) {
            if (player.role === 'tank' && player.threat > highestThreat) {
                highestThreat = player.threat;
                currentTank = player;
            }
        }

        return currentTank || raidState.players.find(p => p.role === 'tank');
    }

    /**
     * 피해 계산
     */
    calculateDamage(baseDamage) {
        // 난이도별 보정
        const difficultyMultiplier = {
            'normal': 0.8,
            'heroic': 1.0,
            'mythic': 1.3
        };

        const difficulty = this.raidState?.difficulty || 'heroic';
        const multiplier = difficultyMultiplier[difficulty] || 1.0;

        // 랜덤 변동 (±10%)
        const variance = 0.9 + Math.random() * 0.2;

        return Math.floor(baseDamage * multiplier * variance);
    }

    /**
     * 피해 감소 적용
     */
    applyMitigation(damage, player) {
        let finalDamage = damage;

        // 방어도 감소
        if (player.armor) {
            const armorReduction = player.armor / (player.armor + 7500);
            finalDamage *= (1 - armorReduction);
        }

        // 피해 감소 효과
        if (player.damageReduction) {
            finalDamage *= (1 - player.damageReduction);
        }

        // 보호막
        if (player.absorb > 0) {
            const absorbed = Math.min(player.absorb, finalDamage);
            player.absorb -= absorbed;
            finalDamage -= absorbed;
        }

        return Math.floor(finalDamage);
    }

    /**
     * 페이즈 전환 확인
     */
    checkPhaseTransition() {
        if (!this.currentBoss) return;

        const healthPercent = (this.currentBoss.health / this.currentBoss.maxHealth) * 100;

        for (const phase of this.currentBoss.phases) {
            if (healthPercent <= phase.healthPercent && this.currentPhase.id < phase.id) {
                this.transitionToPhase(phase);
                break;
            }
        }
    }

    /**
     * 페이즈 전환
     */
    transitionToPhase(newPhase) {
        const oldPhase = this.currentPhase;
        this.currentPhase = newPhase;

        // 기존 메커니즘 타이머 정리
        for (const timer of this.mechanicTimers.values()) {
            clearTimeout(timer);
        }
        this.mechanicTimers.clear();

        this.emit('phaseTransition', {
            from: oldPhase,
            to: newPhase,
            boss: this.currentBoss.name
        });

        // 새 페이즈 메커니즘 시작
        this.mechanicSchedule = this.generateMechanicSchedule(this.currentBoss);
        this.startMechanicTimers();
    }

    /**
     * 전투 종료
     */
    endEncounter(result) {
        // 모든 타이머 정리
        for (const timer of this.mechanicTimers.values()) {
            clearTimeout(timer);
        }
        this.mechanicTimers.clear();

        const duration = Date.now() - this.encounterStartTime;

        this.emit('encounterEnd', {
            boss: this.currentBoss.name,
            result,
            duration,
            mechanicsExecuted: this.activeMechanics.length
        });

        // 초기화
        this.currentBoss = null;
        this.currentPhase = null;
        this.activeMechanics = [];
    }
}

export default BossMechanics;