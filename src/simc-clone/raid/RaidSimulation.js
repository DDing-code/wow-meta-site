/**
 * Raid Simulation
 * 공격대 시뮬레이션 시스템
 */

import { EventEmitter } from 'events';
import BossMechanics from './BossMechanics.js';
import PositioningSystem from './PositioningSystem.js';

export class RaidSimulation extends EventEmitter {
    constructor() {
        super();

        this.raidCompositions = this.initializeRaidCompositions();
        this.raidBuffs = this.initializeRaidBuffs();
        this.raidCooldowns = this.initializeRaidCooldowns();
        this.healingAssignments = new Map();
        this.interruptRotation = [];
        this.battleRezCount = 0;

        this.bossMechanics = new BossMechanics();
        this.positioningSystem = new PositioningSystem();

        this.setupSimulation();
    }

    /**
     * 공격대 구성 초기화
     */
    initializeRaidCompositions() {
        return {
            // 10인 레이드
            'raid10': {
                tanks: 2,
                healers: 2,
                dps: 6,
                total: 10,
                defaultPositions: {
                    tanks: [
                        { x: 0, y: -10, role: 'main_tank' },
                        { x: 5, y: -8, role: 'off_tank' }
                    ],
                    healers: [
                        { x: -15, y: 0, role: 'raid_healer' },
                        { x: 15, y: 0, role: 'tank_healer' }
                    ],
                    melee: [
                        { x: -5, y: -5 },
                        { x: 5, y: -5 },
                        { x: 0, y: -7 }
                    ],
                    ranged: [
                        { x: -10, y: 10 },
                        { x: 0, y: 12 },
                        { x: 10, y: 10 }
                    ]
                }
            },

            // 25인 레이드
            'raid25': {
                tanks: 2,
                healers: 5,
                dps: 18,
                total: 25,
                defaultPositions: {
                    tanks: [
                        { x: 0, y: -10, role: 'main_tank' },
                        { x: 5, y: -8, role: 'off_tank' }
                    ],
                    healers: [
                        { x: -20, y: 0, role: 'raid_healer' },
                        { x: -10, y: 5, role: 'raid_healer' },
                        { x: 0, y: 8, role: 'raid_healer' },
                        { x: 10, y: 5, role: 'tank_healer' },
                        { x: 20, y: 0, role: 'tank_healer' }
                    ],
                    melee: [
                        { x: -8, y: -5 },
                        { x: -4, y: -6 },
                        { x: 0, y: -7 },
                        { x: 4, y: -6 },
                        { x: 8, y: -5 }
                    ],
                    ranged: [
                        { x: -15, y: 10 },
                        { x: -10, y: 12 },
                        { x: -5, y: 14 },
                        { x: 0, y: 15 },
                        { x: 5, y: 14 },
                        { x: 10, y: 12 },
                        { x: 15, y: 10 }
                    ]
                }
            },

            // 20인 신화
            'mythic20': {
                tanks: 2,
                healers: 4,
                dps: 14,
                total: 20,
                strictPositioning: true,
                defaultPositions: 'dynamic' // 보스별 동적 배치
            }
        };
    }

    /**
     * 공격대 버프 초기화
     */
    initializeRaidBuffs() {
        return {
            // 스탯 버프
            'stats': [
                { name: '비전 지능', provider: ['mage'], stat: 'intellect', value: 0.05 },
                { name: '전투의 함성', provider: ['warrior'], stat: 'attack_power', value: 0.1 },
                { name: '야생의 징표', provider: ['druid'], stat: 'stats', value: 0.03 }
            ],

            // 가속 버프
            'haste': [
                { name: '블러드러스트', provider: ['shaman'], value: 0.3, duration: 40, cooldown: 600 },
                { name: '시간 왜곡', provider: ['mage'], value: 0.3, duration: 40, cooldown: 600 },
                { name: '격노의 포효', provider: ['hunter_pet'], value: 0.3, duration: 40, cooldown: 600 }
            ],

            // 피해 증가
            'damage': [
                { name: '신비한 마법 강화', provider: ['demon_hunter'], value: 0.05, type: 'magic' },
                { name: '혼돈의 낙인', provider: ['demon_hunter'], value: 0.05, type: 'all' },
                { name: '전사의 함성', provider: ['warrior'], value: 0.1, type: 'physical' }
            ],

            // 생존 버프
            'defensive': [
                { name: '결집의 함성', provider: ['warrior'], value: 0.1, type: 'health' },
                { name: '헌신의 오라', provider: ['paladin'], value: 0.03, type: 'damage_reduction' },
                { name: '암흑 보호', provider: ['priest'], value: 0.1, type: 'stamina' }
            ],

            // 유틸리티
            'utility': [
                { name: '구원의 축복', provider: ['paladin'], type: 'threat_reduction' },
                { name: '신의 권능: 인내', provider: ['priest'], type: 'stamina', value: 0.1 },
                { name: '침묵의 인장', provider: ['death_knight'], type: 'interrupt' }
            ]
        };
    }

    /**
     * 공격대 생존기 초기화
     */
    initializeRaidCooldowns() {
        return {
            // 피해 감소
            'damage_reduction': [
                {
                    name: '성스러운 빛의 오라',
                    class: 'paladin',
                    reduction: 0.2,
                    duration: 10,
                    cooldown: 180,
                    range: 40
                },
                {
                    name: '장벽',
                    class: 'priest',
                    reduction: 0.25,
                    duration: 10,
                    cooldown: 180,
                    type: 'barrier'
                },
                {
                    name: '정신의 함성',
                    class: 'priest',
                    reduction: 0.1,
                    duration: 8,
                    cooldown: 60
                },
                {
                    name: '어둠의 외침',
                    class: 'warrior',
                    reduction: 0.2,
                    duration: 8,
                    cooldown: 120
                },
                {
                    name: '반마법 지대',
                    class: 'death_knight',
                    reduction: 0.2,
                    duration: 10,
                    cooldown: 120,
                    type: 'magic_only'
                }
            ],

            // 치유 증가
            'healing_increase': [
                {
                    name: '평온',
                    class: 'druid',
                    healing: 100000,
                    duration: 8,
                    cooldown: 180,
                    channeled: true
                },
                {
                    name: '신성한 찬가',
                    class: 'priest',
                    healing: 120000,
                    duration: 8,
                    cooldown: 180,
                    channeled: true
                },
                {
                    name: '치유의 해일 토템',
                    class: 'shaman',
                    healing: 80000,
                    duration: 10,
                    cooldown: 180
                },
                {
                    name: '희생의 오라',
                    class: 'paladin',
                    healing: 60000,
                    duration: 6,
                    cooldown: 120
                }
            ],

            // 면역/무적
            'immunity': [
                {
                    name: '얼음 방패',
                    class: 'mage',
                    duration: 10,
                    cooldown: 300,
                    personal: true
                },
                {
                    name: '신의 가호',
                    class: 'paladin',
                    duration: 8,
                    cooldown: 300,
                    personal: true
                },
                {
                    name: '소멸',
                    class: 'hunter',
                    duration: 5,
                    cooldown: 180,
                    personal: true
                },
                {
                    name: '그림자 망토',
                    class: 'rogue',
                    duration: 5,
                    cooldown: 120,
                    personal: true,
                    type: 'magic_only'
                }
            ],

            // 이동기
            'movement': [
                {
                    name: '질주의 포효',
                    class: 'druid',
                    speedBonus: 0.6,
                    duration: 10,
                    cooldown: 120,
                    raid_wide: true
                },
                {
                    name: '바람 질주 토템',
                    class: 'shaman',
                    speedBonus: 0.6,
                    duration: 5,
                    cooldown: 120,
                    range: 40
                }
            ],

            // 전투 부활
            'battle_resurrection': [
                {
                    name: '환생',
                    class: 'druid',
                    castTime: 2,
                    cooldown: 600,
                    combatOnly: true
                },
                {
                    name: '부활',
                    class: 'death_knight',
                    castTime: 0,
                    cooldown: 600,
                    combatOnly: true
                },
                {
                    name: '영혼석',
                    class: 'warlock',
                    castTime: 0,
                    cooldown: 600,
                    preApplied: true
                }
            ]
        };
    }

    /**
     * 시뮬레이션 설정
     */
    setupSimulation() {
        this.simulationState = {
            time: 0,
            phase: 'preparation',
            combatTime: 0,
            players: [],
            boss: null,
            adds: [],
            groundEffects: [],
            raidDPS: 0,
            raidHPS: 0,
            deaths: 0,
            wipeTimer: null
        };

        this.metrics = {
            totalDamageDealt: 0,
            totalHealingDone: 0,
            totalDamageTaken: 0,
            mechanicHandling: {
                successful: 0,
                failed: 0
            },
            cooldownUsage: new Map(),
            deathLog: [],
            resources: {
                manaEfficiency: 0,
                overhealingPercent: 0
            }
        };
    }

    /**
     * 공격대 생성
     */
    createRaid(composition = 'raid25', players = null) {
        const comp = this.raidCompositions[composition];
        if (!comp) {
            throw new Error(`Unknown raid composition: ${composition}`);
        }

        if (players) {
            // 제공된 플레이어 목록 사용
            this.simulationState.players = players;
        } else {
            // 기본 플레이어 생성
            this.simulationState.players = this.generateDefaultPlayers(comp);
        }

        // 포지션 할당
        this.assignPositions(comp);

        // 버프 적용
        this.applyRaidBuffs();

        // 역할 할당
        this.assignRoles();

        this.emit('raidCreated', {
            composition,
            playerCount: this.simulationState.players.length,
            roles: this.getRoleDistribution()
        });

        return this.simulationState.players;
    }

    /**
     * 기본 플레이어 생성
     */
    generateDefaultPlayers(composition) {
        const players = [];
        let playerIndex = 0;

        // 탱커 생성
        for (let i = 0; i < composition.tanks; i++) {
            players.push(this.createPlayer({
                id: `tank_${i + 1}`,
                name: `Tank${i + 1}`,
                class: i === 0 ? 'warrior' : 'paladin',
                spec: 'protection',
                role: 'tank',
                index: playerIndex++
            }));
        }

        // 힐러 생성
        const healerClasses = ['priest', 'druid', 'shaman', 'paladin', 'monk'];
        for (let i = 0; i < composition.healers; i++) {
            const healerClass = healerClasses[i % healerClasses.length];
            players.push(this.createPlayer({
                id: `healer_${i + 1}`,
                name: `Healer${i + 1}`,
                class: healerClass,
                spec: this.getHealingSpec(healerClass),
                role: 'healer',
                index: playerIndex++
            }));
        }

        // DPS 생성
        const dpsClasses = ['mage', 'warlock', 'hunter', 'rogue', 'warrior', 'death_knight', 'demon_hunter'];
        for (let i = 0; i < composition.dps; i++) {
            const dpsClass = dpsClasses[i % dpsClasses.length];
            const isMelee = ['warrior', 'death_knight', 'demon_hunter', 'rogue'].includes(dpsClass);

            players.push(this.createPlayer({
                id: `dps_${i + 1}`,
                name: `DPS${i + 1}`,
                class: dpsClass,
                spec: this.getDPSSpec(dpsClass),
                role: 'dps',
                subRole: isMelee ? 'melee' : 'ranged',
                index: playerIndex++
            }));
        }

        return players;
    }

    /**
     * 플레이어 생성
     */
    createPlayer(config) {
        return {
            id: config.id,
            name: config.name,
            class: config.class,
            spec: config.spec,
            role: config.role,
            subRole: config.subRole || config.role,

            // 스탯
            health: 500000,
            maxHealth: 500000,
            mana: 100000,
            maxMana: 100000,

            // 위치
            position: { x: 0, y: 0, z: 0 },
            facing: { x: 0, y: 1 },

            // 전투 상태
            threat: 0,
            dps: 0,
            hps: 0,

            // 버프/디버프
            buffs: [],
            debuffs: [],

            // 생존기
            personalCooldowns: [],

            // 상태
            alive: true,
            stunned: false,
            silenced: false,
            rooted: false,

            // 장비/스탯
            itemLevel: 450,
            stats: this.generatePlayerStats(config.class, config.spec),

            // AI 설정
            ai: {
                priority: 'optimal',
                reactionTime: 200 + Math.random() * 300, // 200-500ms
                skillLevel: 0.7 + Math.random() * 0.3 // 70-100%
            }
        };
    }

    /**
     * 플레이어 스탯 생성
     */
    generatePlayerStats(className, spec) {
        const baseStats = {
            strength: 1000,
            agility: 1000,
            intellect: 1000,
            stamina: 1500,

            crit: 0.15,
            haste: 0.15,
            mastery: 0.15,
            versatility: 0.05,

            armor: 5000,
            dodge: 0.05,
            parry: 0.05,
            block: 0.05
        };

        // 클래스별 주 스탯 강화
        switch (className) {
            case 'warrior':
            case 'paladin':
            case 'death_knight':
                baseStats.strength *= 1.5;
                if (spec.includes('protection') || spec === 'blood') {
                    baseStats.stamina *= 2;
                    baseStats.armor *= 3;
                }
                break;

            case 'hunter':
            case 'rogue':
            case 'monk':
            case 'demon_hunter':
                baseStats.agility *= 1.5;
                break;

            case 'mage':
            case 'warlock':
            case 'priest':
            case 'shaman':
            case 'druid':
            case 'evoker':
                baseStats.intellect *= 1.5;
                break;
        }

        return baseStats;
    }

    /**
     * 포지션 할당
     */
    assignPositions(composition) {
        if (composition.defaultPositions === 'dynamic') {
            // 동적 포지션 (보스별)
            this.positioningSystem.generateDynamicPositions(this.simulationState.players);
        } else {
            // 정적 포지션
            const positions = composition.defaultPositions;
            let tankIndex = 0, healerIndex = 0, meleeIndex = 0, rangedIndex = 0;

            for (const player of this.simulationState.players) {
                switch (player.role) {
                    case 'tank':
                        if (positions.tanks[tankIndex]) {
                            player.position = { ...positions.tanks[tankIndex] };
                            tankIndex++;
                        }
                        break;

                    case 'healer':
                        if (positions.healers[healerIndex]) {
                            player.position = { ...positions.healers[healerIndex] };
                            healerIndex++;
                        }
                        break;

                    case 'dps':
                        if (player.subRole === 'melee' && positions.melee[meleeIndex]) {
                            player.position = { ...positions.melee[meleeIndex] };
                            meleeIndex++;
                        } else if (player.subRole === 'ranged' && positions.ranged[rangedIndex]) {
                            player.position = { ...positions.ranged[rangedIndex] };
                            rangedIndex++;
                        }
                        break;
                }
            }
        }
    }

    /**
     * 공격대 버프 적용
     */
    applyRaidBuffs() {
        const availableBuffs = this.checkAvailableBuffs();

        for (const player of this.simulationState.players) {
            // 스탯 버프
            for (const buff of availableBuffs.stats) {
                this.applyStatBuff(player, buff);
            }

            // 기타 버프
            player.buffs.push(...availableBuffs.permanent);
        }

        this.emit('buffsApplied', {
            stats: availableBuffs.stats.length,
            permanent: availableBuffs.permanent.length
        });
    }

    /**
     * 사용 가능한 버프 확인
     */
    checkAvailableBuffs() {
        const availableBuffs = {
            stats: [],
            permanent: [],
            cooldowns: []
        };

        const playerClasses = new Set(this.simulationState.players.map(p => p.class));

        // 각 버프 카테고리 확인
        for (const [category, buffs] of Object.entries(this.raidBuffs)) {
            for (const buff of buffs) {
                const hasProvider = buff.provider.some(p =>
                    playerClasses.has(p) || p.includes('pet')
                );

                if (hasProvider) {
                    if (category === 'stats' || category === 'defensive') {
                        availableBuffs.stats.push(buff);
                    } else if (category === 'haste' || category === 'damage') {
                        availableBuffs.cooldowns.push(buff);
                    } else {
                        availableBuffs.permanent.push(buff);
                    }
                }
            }
        }

        return availableBuffs;
    }

    /**
     * 역할 할당
     */
    assignRoles() {
        // 메인 탱커 지정
        const tanks = this.simulationState.players.filter(p => p.role === 'tank');
        if (tanks.length > 0) {
            tanks[0].subRole = 'main_tank';
            if (tanks.length > 1) {
                tanks[1].subRole = 'off_tank';
            }
        }

        // 힐러 역할 할당
        const healers = this.simulationState.players.filter(p => p.role === 'healer');
        this.assignHealerRoles(healers);

        // 인터럽트 로테이션 설정
        this.setupInterruptRotation();

        // 디스펠 담당 설정
        this.setupDispelAssignments();
    }

    /**
     * 힐러 역할 할당
     */
    assignHealerRoles(healers) {
        if (healers.length === 0) return;

        // 탱커 힐러 (보통 1-2명)
        const tankHealerCount = Math.min(2, Math.ceil(healers.length * 0.4));
        for (let i = 0; i < tankHealerCount; i++) {
            healers[i].healingRole = 'tank_healer';
            this.healingAssignments.set(healers[i].id, ['main_tank', 'off_tank']);
        }

        // 나머지는 공격대 힐러
        for (let i = tankHealerCount; i < healers.length; i++) {
            healers[i].healingRole = 'raid_healer';

            // 그룹 할당
            const groupSize = Math.ceil(this.simulationState.players.length / (healers.length - tankHealerCount));
            const groupStart = (i - tankHealerCount) * groupSize;
            const groupEnd = Math.min(groupStart + groupSize, this.simulationState.players.length);

            const assignedPlayers = this.simulationState.players
                .slice(groupStart, groupEnd)
                .map(p => p.id);

            this.healingAssignments.set(healers[i].id, assignedPlayers);
        }
    }

    /**
     * 인터럽트 로테이션 설정
     */
    setupInterruptRotation() {
        const interrupters = this.simulationState.players.filter(p => {
            // 차단 능력이 있는 클래스
            const interruptClasses = [
                'rogue', 'warrior', 'death_knight', 'demon_hunter',
                'shaman', 'mage', 'hunter', 'monk', 'paladin'
            ];
            return interruptClasses.includes(p.class);
        });

        // 우선순위: 근딜 > 원딜 > 힐러
        interrupters.sort((a, b) => {
            const priority = { melee: 0, ranged: 1, healer: 2, tank: 3 };
            return (priority[a.subRole] || 99) - (priority[b.subRole] || 99);
        });

        this.interruptRotation = interrupters.map((p, index) => ({
            player: p,
            order: index + 1,
            cooldown: this.getInterruptCooldown(p.class),
            lastUsed: 0
        }));
    }

    /**
     * 디스펠 담당 설정
     */
    setupDispelAssignments() {
        const dispellers = {
            magic: [],
            curse: [],
            disease: [],
            poison: []
        };

        for (const player of this.simulationState.players) {
            switch (player.class) {
                case 'priest':
                case 'paladin':
                    dispellers.magic.push(player);
                    dispellers.disease.push(player);
                    break;
                case 'shaman':
                    dispellers.magic.push(player);
                    dispellers.curse.push(player);
                    break;
                case 'mage':
                    dispellers.curse.push(player);
                    break;
                case 'druid':
                    dispellers.magic.push(player);
                    dispellers.curse.push(player);
                    dispellers.poison.push(player);
                    break;
                case 'monk':
                    dispellers.magic.push(player);
                    dispellers.disease.push(player);
                    dispellers.poison.push(player);
                    break;
            }
        }

        this.dispelAssignments = dispellers;
    }

    /**
     * 전투 시뮬레이션 시작
     */
    async startCombat(bossId, duration = 300) {
        this.simulationState.phase = 'combat';
        this.simulationState.combatTime = 0;
        this.simulationState.boss = this.bossMechanics.startEncounter(bossId, this.simulationState);

        this.emit('combatStart', {
            boss: this.simulationState.boss.name,
            duration,
            raidSize: this.simulationState.players.length
        });

        // 시뮬레이션 루프
        const tickInterval = 100; // 100ms 틱
        const maxTicks = (duration * 1000) / tickInterval;

        for (let tick = 0; tick < maxTicks; tick++) {
            await this.simulationTick(tickInterval);

            // 전멸 체크
            if (this.checkWipe()) {
                this.handleWipe();
                break;
            }

            // 보스 처치 체크
            if (this.checkVictory()) {
                this.handleVictory();
                break;
            }

            // 진행도 이벤트
            if (tick % 10 === 0) { // 매 초마다
                this.emit('combatProgress', {
                    time: this.simulationState.combatTime,
                    bossHealth: this.simulationState.boss.health,
                    raidStatus: this.getRaidStatus()
                });
            }
        }

        return this.generateCombatReport();
    }

    /**
     * 시뮬레이션 틱
     */
    async simulationTick(deltaTime) {
        this.simulationState.time += deltaTime;
        this.simulationState.combatTime += deltaTime / 1000;

        // 플레이어 액션
        await this.processPlayerActions(deltaTime);

        // 보스 액션
        this.processBossActions(deltaTime);

        // 치유 처리
        this.processHealing(deltaTime);

        // DoT/HoT 처리
        this.processPeriodicEffects(deltaTime);

        // 위치 업데이트
        this.updatePositions(deltaTime);

        // 버프/디버프 업데이트
        this.updateBuffsDebuffs(deltaTime);

        // 메트릭 업데이트
        this.updateMetrics(deltaTime);

        // 페이즈 체크
        this.bossMechanics.checkPhaseTransition();
    }

    /**
     * 플레이어 액션 처리
     */
    async processPlayerActions(deltaTime) {
        for (const player of this.simulationState.players) {
            if (!player.alive) continue;

            // AI 결정
            const action = await this.determinePlayerAction(player);

            if (action) {
                await this.executePlayerAction(player, action);
            }

            // DPS 계산
            this.calculatePlayerDPS(player, deltaTime);

            // 위협 수준 업데이트
            this.updateThreat(player, deltaTime);
        }
    }

    /**
     * 플레이어 액션 결정
     */
    async determinePlayerAction(player) {
        // 생존 우선
        if (player.health < player.maxHealth * 0.3) {
            const defensiveCooldown = this.getAvailableDefensiveCooldown(player);
            if (defensiveCooldown) {
                return { type: 'defensive', ability: defensiveCooldown };
            }
        }

        // 역할별 액션
        switch (player.role) {
            case 'tank':
                return this.determineTankAction(player);
            case 'healer':
                return this.determineHealerAction(player);
            case 'dps':
                return this.determineDPSAction(player);
        }

        return null;
    }

    /**
     * 탱커 액션 결정
     */
    determineTankAction(player) {
        // 위협 생성
        if (player.threat < this.getMaxThreat() * 1.1) {
            return { type: 'threat', ability: 'taunt' };
        }

        // 방어 기술
        if (this.predictIncomingDamage(player) > player.maxHealth * 0.5) {
            return { type: 'defensive', ability: 'shield_wall' };
        }

        // 기본 공격
        return { type: 'attack', ability: 'auto_attack' };
    }

    /**
     * 힐러 액션 결정
     */
    determineHealerAction(player) {
        const assignments = this.healingAssignments.get(player.id) || [];

        // 할당된 대상 중 치유 필요
        for (const targetId of assignments) {
            const target = this.simulationState.players.find(p => p.id === targetId);
            if (target && target.alive && target.health < target.maxHealth * 0.7) {
                return {
                    type: 'heal',
                    ability: this.selectHealingSpell(player, target),
                    target
                };
            }
        }

        // 공격대 전체 치유
        if (this.getRaidHealthPercent() < 70) {
            return { type: 'raid_heal', ability: 'prayer_of_healing' };
        }

        // 피해 기여
        return { type: 'damage', ability: 'smite' };
    }

    /**
     * DPS 액션 결정
     */
    determineDPSAction(player) {
        // 버스트 페이즈
        if (this.simulationState.boss.health < this.simulationState.boss.maxHealth * 0.35) {
            const burstCooldown = this.getAvailableBurstCooldown(player);
            if (burstCooldown) {
                return { type: 'burst', ability: burstCooldown };
            }
        }

        // 차단 필요
        if (this.needsInterrupt() && this.canInterrupt(player)) {
            return { type: 'interrupt', ability: 'interrupt' };
        }

        // 기본 로테이션
        return { type: 'rotation', ability: this.getNextRotationAbility(player) };
    }

    /**
     * 보스 액션 처리
     */
    processBossActions(deltaTime) {
        if (!this.simulationState.boss) return;

        // 자동 공격
        this.processBossAutoAttack(deltaTime);

        // 보스 페이즈별 행동
        const phase = this.bossMechanics.currentPhase;
        if (phase) {
            // 페이즈별 특수 행동
            this.processPhaseSpecificActions(phase);
        }
    }

    /**
     * 보스 자동 공격
     */
    processBossAutoAttack(deltaTime) {
        const boss = this.simulationState.boss;
        const mainTank = this.getCurrentMainTank();

        if (mainTank && mainTank.alive) {
            const attackSpeed = 1.5; // 1.5초마다 공격
            const timeSinceLastAttack = this.simulationState.combatTime % attackSpeed;

            if (timeSinceLastAttack < deltaTime / 1000) {
                const damage = 50000 + Math.random() * 20000;
                const mitigatedDamage = this.applyMitigation(damage, mainTank);

                mainTank.health -= mitigatedDamage;

                this.emit('damage', {
                    source: boss,
                    target: mainTank,
                    amount: mitigatedDamage,
                    type: 'melee'
                });

                this.metrics.totalDamageTaken += mitigatedDamage;
            }
        }
    }

    /**
     * 치유 처리
     */
    processHealing(deltaTime) {
        const healers = this.simulationState.players.filter(
            p => p.alive && p.role === 'healer'
        );

        for (const healer of healers) {
            // 마나 재생
            if (healer.mana < healer.maxMana) {
                healer.mana = Math.min(
                    healer.maxMana,
                    healer.mana + (healer.manaRegen || 1000) * deltaTime / 1000
                );
            }

            // HPS 계산
            const healingDone = this.calculateHealerHPS(healer, deltaTime);
            healer.hps = healingDone / (deltaTime / 1000);
            this.metrics.totalHealingDone += healingDone;
        }
    }

    /**
     * 주기적 효과 처리
     */
    processPeriodicEffects(deltaTime) {
        for (const player of this.simulationState.players) {
            if (!player.alive) continue;

            // DoT 처리
            if (player.debuffs) {
                for (const debuff of player.debuffs) {
                    if (debuff.dot) {
                        const damage = debuff.dot * deltaTime / 1000;
                        player.health -= damage;
                        this.metrics.totalDamageTaken += damage;
                    }
                }
            }

            // HoT 처리
            if (player.buffs) {
                for (const buff of player.buffs) {
                    if (buff.hot) {
                        const healing = buff.hot * deltaTime / 1000;
                        player.health = Math.min(player.maxHealth, player.health + healing);
                        this.metrics.totalHealingDone += healing;
                    }
                }
            }
        }
    }

    /**
     * 전멸 체크
     */
    checkWipe() {
        const alivePlayers = this.simulationState.players.filter(p => p.alive);

        // 모든 플레이어 사망
        if (alivePlayers.length === 0) return true;

        // 탱커 전멸
        const aliveTanks = alivePlayers.filter(p => p.role === 'tank');
        if (aliveTanks.length === 0 && this.simulationState.combatTime > 5) {
            // 5초 유예
            if (!this.simulationState.wipeTimer) {
                this.simulationState.wipeTimer = this.simulationState.combatTime + 5;
            }
            return this.simulationState.combatTime >= this.simulationState.wipeTimer;
        }

        // 힐러 전멸
        const aliveHealers = alivePlayers.filter(p => p.role === 'healer');
        if (aliveHealers.length === 0 && this.getRaidHealthPercent() < 50) {
            return true;
        }

        return false;
    }

    /**
     * 승리 체크
     */
    checkVictory() {
        return this.simulationState.boss && this.simulationState.boss.health <= 0;
    }

    /**
     * 전투 보고서 생성
     */
    generateCombatReport() {
        const duration = this.simulationState.combatTime;
        const totalPlayers = this.simulationState.players.length;
        const deaths = this.simulationState.players.filter(p => !p.alive).length;

        return {
            result: this.checkVictory() ? 'victory' : 'defeat',
            duration,

            raid: {
                composition: {
                    total: totalPlayers,
                    alive: totalPlayers - deaths,
                    deaths
                },
                totalDPS: this.metrics.totalDamageDealt / duration,
                totalHPS: this.metrics.totalHealingDone / duration
            },

            boss: {
                name: this.simulationState.boss?.name,
                healthRemaining: this.simulationState.boss?.health || 0,
                percentRemaining: this.simulationState.boss ?
                    (this.simulationState.boss.health / this.simulationState.boss.maxHealth) * 100 : 0
            },

            mechanics: {
                handled: this.metrics.mechanicHandling.successful,
                failed: this.metrics.mechanicHandling.failed,
                successRate: this.metrics.mechanicHandling.successful /
                    (this.metrics.mechanicHandling.successful + this.metrics.mechanicHandling.failed) * 100
            },

            performance: {
                topDPS: this.getTopPerformers('dps', 3),
                topHPS: this.getTopPerformers('hps', 3),
                deaths: this.metrics.deathLog
            },

            resources: {
                manaEfficiency: this.metrics.resources.manaEfficiency,
                overhealingPercent: this.metrics.resources.overhealingPercent,
                cooldownUsage: Array.from(this.metrics.cooldownUsage.entries())
            }
        };
    }

    // === 유틸리티 메서드 ===

    getHealingSpec(className) {
        const specs = {
            priest: 'holy',
            druid: 'restoration',
            shaman: 'restoration',
            paladin: 'holy',
            monk: 'mistweaver',
            evoker: 'preservation'
        };
        return specs[className] || 'holy';
    }

    getDPSSpec(className) {
        const specs = {
            mage: 'frost',
            warlock: 'destruction',
            hunter: 'marksmanship',
            rogue: 'assassination',
            warrior: 'fury',
            death_knight: 'unholy',
            demon_hunter: 'havoc',
            shaman: 'elemental',
            priest: 'shadow',
            druid: 'balance',
            monk: 'windwalker',
            evoker: 'devastation'
        };
        return specs[className] || 'dps';
    }

    getInterruptCooldown(className) {
        const cooldowns = {
            rogue: 15,
            warrior: 15,
            death_knight: 15,
            demon_hunter: 15,
            shaman: 12,
            mage: 24,
            hunter: 24,
            monk: 15,
            paladin: 15
        };
        return cooldowns[className] || 24;
    }

    getRoleDistribution() {
        const distribution = {
            tanks: 0,
            healers: 0,
            melee: 0,
            ranged: 0
        };

        for (const player of this.simulationState.players) {
            if (player.role === 'tank') distribution.tanks++;
            else if (player.role === 'healer') distribution.healers++;
            else if (player.subRole === 'melee') distribution.melee++;
            else if (player.subRole === 'ranged') distribution.ranged++;
        }

        return distribution;
    }

    getRaidStatus() {
        const alive = this.simulationState.players.filter(p => p.alive).length;
        const total = this.simulationState.players.length;
        const avgHealth = this.getRaidHealthPercent();

        return {
            alive,
            total,
            deaths: total - alive,
            averageHealth: avgHealth,
            status: avgHealth > 70 ? 'stable' : avgHealth > 40 ? 'critical' : 'emergency'
        };
    }

    getRaidHealthPercent() {
        const alivePlayers = this.simulationState.players.filter(p => p.alive);
        if (alivePlayers.length === 0) return 0;

        const totalHealth = alivePlayers.reduce((sum, p) => sum + p.health, 0);
        const totalMaxHealth = alivePlayers.reduce((sum, p) => sum + p.maxHealth, 0);

        return (totalHealth / totalMaxHealth) * 100;
    }

    getCurrentMainTank() {
        return this.simulationState.players.find(
            p => p.alive && p.subRole === 'main_tank'
        );
    }

    getTopPerformers(metric, count) {
        const players = this.simulationState.players
            .filter(p => p[metric] > 0)
            .sort((a, b) => b[metric] - a[metric])
            .slice(0, count);

        return players.map(p => ({
            name: p.name,
            class: p.class,
            spec: p.spec,
            value: p[metric]
        }));
    }

    applyMitigation(damage, player) {
        // 방어도, 회피, 막기 등 계산
        let mitigated = damage;

        if (player.stats.armor) {
            const reduction = player.stats.armor / (player.stats.armor + 10000);
            mitigated *= (1 - reduction);
        }

        if (player.buffs) {
            const damageReduction = player.buffs
                .filter(b => b.damageReduction)
                .reduce((sum, b) => sum + b.damageReduction, 0);
            mitigated *= (1 - Math.min(damageReduction, 0.8));
        }

        return Math.floor(mitigated);
    }

    handleWipe() {
        this.simulationState.phase = 'wipe';
        this.emit('raidWipe', {
            time: this.simulationState.combatTime,
            cause: this.determineWipeCause()
        });
    }

    handleVictory() {
        this.simulationState.phase = 'victory';
        this.emit('bossDefeated', {
            time: this.simulationState.combatTime,
            boss: this.simulationState.boss.name
        });
    }

    determineWipeCause() {
        if (this.simulationState.players.filter(p => p.role === 'tank' && p.alive).length === 0) {
            return 'tanks_dead';
        }
        if (this.simulationState.players.filter(p => p.role === 'healer' && p.alive).length === 0) {
            return 'healers_dead';
        }
        if (this.metrics.mechanicHandling.failed > this.metrics.mechanicHandling.successful) {
            return 'mechanic_failure';
        }
        return 'attrition';
    }
}

export default RaidSimulation;