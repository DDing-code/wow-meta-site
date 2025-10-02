/**
 * Encounter Manager
 * 레이드 전투 관리 시스템
 */

import { EventEmitter } from 'events';
import BossMechanics from './BossMechanics.js';
import RaidSimulation from './RaidSimulation.js';
import PositioningSystem from './PositioningSystem.js';

export class EncounterManager extends EventEmitter {
    constructor() {
        super();

        this.encounters = this.initializeEncounters();
        this.currentEncounter = null;
        this.encounterLog = [];
        this.replayData = [];

        this.bossMechanics = new BossMechanics();
        this.raidSimulation = new RaidSimulation();
        this.positioningSystem = new PositioningSystem();

        this.setupEncounterHandlers();
    }

    /**
     * 전투 데이터 초기화
     */
    initializeEncounters() {
        return {
            // Dragonflight Season 4 Encounters
            'amirdrassil': {
                name: '아미르드라실의 꿈',
                bosses: [
                    'gnarlroot',
                    'igira',
                    'volcoross',
                    'council_of_dreams',
                    'larodar',
                    'nymue',
                    'smolderon',
                    'tindral',
                    'fyrakk'
                ],
                difficulty: ['normal', 'heroic', 'mythic'],
                raidSize: [10, 25, 20],
                tier: 31
            },

            'aberrus': {
                name: '아베루스, 그림자 도가니',
                bosses: [
                    'kazzara',
                    'amalgamation_chamber',
                    'forgotten_experiments',
                    'assault_of_the_zaqali',
                    'rashok',
                    'zskarn',
                    'magmorax',
                    'echo_of_neltharion',
                    'scalecommander_sarkareth'
                ],
                difficulty: ['normal', 'heroic', 'mythic'],
                raidSize: [10, 25, 20],
                tier: 30
            },

            'vault_of_the_incarnates': {
                name: '화신들의 금고',
                bosses: [
                    'eranog',
                    'terros',
                    'primal_council',
                    'sennarth',
                    'dathea',
                    'kurog_grimtotem',
                    'broodkeeper_diurna',
                    'raszageth'
                ],
                difficulty: ['normal', 'heroic', 'mythic'],
                raidSize: [10, 25, 20],
                tier: 29
            }
        };
    }

    /**
     * 전투 핸들러 설정
     */
    setupEncounterHandlers() {
        // 보스 메커니즘 이벤트
        this.bossMechanics.on('mechanicStart', this.handleMechanicStart.bind(this));
        this.bossMechanics.on('mechanicComplete', this.handleMechanicComplete.bind(this));
        this.bossMechanics.on('phaseTransition', this.handlePhaseTransition.bind(this));

        // 공격대 시뮬레이션 이벤트
        this.raidSimulation.on('playerDeath', this.handlePlayerDeath.bind(this));
        this.raidSimulation.on('cooldownUsed', this.handleCooldownUsed.bind(this));
        this.raidSimulation.on('raidWipe', this.handleRaidWipe.bind(this));

        // 위치 시스템 이벤트
        this.positioningSystem.on('formationChange', this.handleFormationChange.bind(this));
        this.positioningSystem.on('dangerZoneCreated', this.handleDangerZone.bind(this));
    }

    /**
     * 전투 시작
     */
    async startEncounter(raidId, bossId, options = {}) {
        const raid = this.encounters[raidId];
        if (!raid) {
            throw new Error(`Unknown raid: ${raidId}`);
        }

        if (!raid.bosses.includes(bossId)) {
            throw new Error(`Boss ${bossId} not found in raid ${raidId}`);
        }

        // 전투 설정
        this.currentEncounter = {
            raid: raidId,
            boss: bossId,
            difficulty: options.difficulty || 'heroic',
            raidSize: options.raidSize || 25,
            startTime: Date.now(),
            phase: 1,
            status: 'in_progress',
            attempts: 1,
            bestAttempt: null
        };

        // 공격대 생성
        const composition = `raid${this.currentEncounter.raidSize}`;
        const players = await this.raidSimulation.createRaid(composition, options.players);

        // 보스 초기화
        const boss = this.bossMechanics.startEncounter(bossId, {
            players,
            difficulty: this.currentEncounter.difficulty
        });

        // 위치 설정
        this.setupInitialPositions(players, boss);

        // 전투 시작 이벤트
        this.emit('encounterStart', {
            raid: raidId,
            boss: bossId,
            difficulty: this.currentEncounter.difficulty,
            players: players.length
        });

        // 전투 시뮬레이션 실행
        const result = await this.runEncounterSimulation();

        // 전투 종료 처리
        this.endEncounter(result);

        return result;
    }

    /**
     * 초기 위치 설정
     */
    setupInitialPositions(players, boss) {
        // 보스별 특수 위치 설정
        const specialPositioning = this.getSpecialPositioning(boss.name);

        if (specialPositioning) {
            this.positioningSystem.transitionFormation('default', specialPositioning);
        } else {
            // 기본 위치 설정
            this.positioningSystem.generateDynamicPositions(players, boss.position);
        }

        this.logEvent({
            type: 'positioning',
            time: 0,
            formation: specialPositioning || 'dynamic',
            players: players.map(p => ({ id: p.id, position: p.position }))
        });
    }

    /**
     * 전투 시뮬레이션 실행
     */
    async runEncounterSimulation() {
        const maxDuration = this.getEncounterDuration();
        const tickInterval = 100; // 100ms
        let combatTime = 0;

        while (combatTime < maxDuration) {
            // 시뮬레이션 틱
            await this.simulationTick(combatTime);

            // 종료 조건 체크
            if (this.checkEncounterEnd()) {
                break;
            }

            combatTime += tickInterval / 1000;
        }

        return this.generateEncounterResult();
    }

    /**
     * 시뮬레이션 틱
     */
    async simulationTick(time) {
        // 보스 메커니즘 처리
        this.processBossMechanics(time);

        // 플레이어 행동 처리
        await this.processPlayerActions(time);

        // 위치 업데이트
        this.updatePositions(time);

        // 상태 체크
        this.checkHealthStates();
        this.checkResources();

        // 로그 기록
        if (time % 1 === 0) { // 매 초마다
            this.logGameState(time);
        }
    }

    /**
     * 보스 메커니즘 처리
     */
    processBossMechanics(time) {
        // 예정된 메커니즘 확인
        const upcomingMechanics = this.getUpcomingMechanics(time);

        for (const mechanic of upcomingMechanics) {
            // 메커니즘 예고
            this.announceMechanic(mechanic, time);

            // 위치 조정 필요 확인
            if (mechanic.requiresPositioning) {
                this.adjustPositioning(mechanic);
            }

            // 쿨다운 할당
            if (mechanic.requiresCooldowns) {
                this.assignCooldowns(mechanic);
            }
        }
    }

    /**
     * 플레이어 행동 처리
     */
    async processPlayerActions(time) {
        const players = this.raidSimulation.simulationState.players;

        for (const player of players) {
            if (!player.alive) continue;

            // AI 결정
            const decision = await this.makePlayerDecision(player, time);

            // 행동 실행
            if (decision) {
                await this.executePlayerAction(player, decision);
            }
        }
    }

    /**
     * 플레이어 결정
     */
    async makePlayerDecision(player, time) {
        const context = this.getPlayerContext(player);

        // 우선순위별 결정
        // 1. 생존
        if (context.health < 30) {
            return this.getSurvivalAction(player);
        }

        // 2. 메커니즘 대응
        if (context.mechanicActive) {
            return this.getMechanicResponse(player, context.mechanic);
        }

        // 3. 역할별 행동
        switch (player.role) {
            case 'tank':
                return this.getTankAction(player, context);
            case 'healer':
                return this.getHealerAction(player, context);
            case 'dps':
                return this.getDPSAction(player, context);
        }

        return null;
    }

    /**
     * 메커니즘 시작 처리
     */
    handleMechanicStart(data) {
        this.logEvent({
            type: 'mechanic_start',
            time: this.getCurrentTime(),
            mechanic: data.id,
            description: data.description
        });

        // 음성 경고 (DBM/BigWigs 스타일)
        this.announceWarning(data.description, 'urgent');

        // 위치 마커 표시
        if (data.positions) {
            this.showPositionMarkers(data.positions);
        }
    }

    /**
     * 메커니즘 완료 처리
     */
    handleMechanicComplete(data) {
        const success = this.evaluateMechanicSuccess(data);

        this.logEvent({
            type: 'mechanic_complete',
            time: this.getCurrentTime(),
            mechanic: data.id,
            success,
            casualties: data.result.casualties || 0
        });

        // 성공/실패 피드백
        if (success) {
            this.announceSuccess(`${data.id} handled successfully`);
        } else {
            this.announceFailure(`${data.id} failed - ${data.result.casualties} casualties`);
        }
    }

    /**
     * 페이즈 전환 처리
     */
    handlePhaseTransition(data) {
        this.currentEncounter.phase = data.to.id;

        this.logEvent({
            type: 'phase_transition',
            time: this.getCurrentTime(),
            from: data.from,
            to: data.to
        });

        // 페이즈별 위치 조정
        const newFormation = this.getPhaseFormation(data.to.id);
        if (newFormation) {
            this.positioningSystem.transitionFormation(
                this.currentFormation,
                newFormation,
                3 // 3초 전환
            );
        }

        // 페이즈 시작 알림
        this.announcePhase(data.to.name);
    }

    /**
     * 플레이어 사망 처리
     */
    handlePlayerDeath(data) {
        this.logEvent({
            type: 'player_death',
            time: this.getCurrentTime(),
            player: data.player.name,
            cause: data.cause,
            overkill: data.overkill
        });

        // 전투 부활 체크
        if (this.canBattleRes()) {
            this.scheduleBattleRes(data.player);
        }

        // 역할 재할당
        if (data.player.role === 'tank') {
            this.reassignTankRole();
        } else if (data.player.role === 'healer') {
            this.reassignHealingAssignments();
        }
    }

    /**
     * 쿨다운 사용 처리
     */
    handleCooldownUsed(data) {
        this.logEvent({
            type: 'cooldown_used',
            time: this.getCurrentTime(),
            player: data.player.name,
            cooldown: data.cooldown,
            target: data.target
        });

        // 쿨다운 추적
        this.trackCooldownUsage(data);

        // 다음 쿨다운 계획
        this.planNextCooldown(data.cooldown);
    }

    /**
     * 전멸 처리
     */
    handleRaidWipe(data) {
        this.currentEncounter.status = 'wipe';

        this.logEvent({
            type: 'raid_wipe',
            time: this.getCurrentTime(),
            cause: data.cause,
            phase: this.currentEncounter.phase
        });

        // 전멸 원인 분석
        const wipeAnalysis = this.analyzeWipe();

        this.emit('encounterWipe', {
            encounter: this.currentEncounter,
            analysis: wipeAnalysis
        });
    }

    /**
     * 대형 변경 처리
     */
    handleFormationChange(data) {
        this.currentFormation = data.to;

        this.logEvent({
            type: 'formation_change',
            time: this.getCurrentTime(),
            from: data.from,
            to: data.to,
            reason: data.reason
        });
    }

    /**
     * 위험 지대 처리
     */
    handleDangerZone(data) {
        // 위험 지대에서 벗어나기
        const playersInDanger = this.getPlayersInZone(data.zone);

        for (const player of playersInDanger) {
            const safePosition = this.positioningSystem.findOptimalPosition(player, {
                avoidZones: [data.zone],
                urgency: 'high'
            });

            this.movePlayer(player, safePosition);
        }

        this.logEvent({
            type: 'danger_zone',
            time: this.getCurrentTime(),
            zone: data.zone,
            affected: playersInDanger.length
        });
    }

    /**
     * 전투 종료
     */
    endEncounter(result) {
        const duration = Date.now() - this.currentEncounter.startTime;

        this.currentEncounter.status = result.victory ? 'victory' : 'defeat';
        this.currentEncounter.duration = duration;

        // 최고 기록 갱신
        if (!this.currentEncounter.bestAttempt ||
            (result.victory && duration < this.currentEncounter.bestAttempt.duration)) {
            this.currentEncounter.bestAttempt = {
                duration,
                date: Date.now(),
                composition: this.raidSimulation.getRoleDistribution()
            };
        }

        // 상세 보고서 생성
        const report = this.generateDetailedReport();

        this.emit('encounterEnd', {
            encounter: this.currentEncounter,
            result,
            report
        });

        // 로그 저장
        this.saveEncounterLog();

        return report;
    }

    /**
     * 상세 보고서 생성
     */
    generateDetailedReport() {
        const logs = this.encounterLog;
        const duration = this.currentEncounter.duration / 1000; // seconds

        return {
            // 기본 정보
            encounter: {
                raid: this.currentEncounter.raid,
                boss: this.currentEncounter.boss,
                difficulty: this.currentEncounter.difficulty,
                duration: `${Math.floor(duration / 60)}:${(duration % 60).toFixed(0).padStart(2, '0')}`,
                result: this.currentEncounter.status,
                phase: this.currentEncounter.phase
            },

            // 통계
            statistics: {
                totalDamage: this.calculateTotalDamage(),
                totalHealing: this.calculateTotalHealing(),
                deaths: this.countDeaths(),
                battleReses: this.battleRezCount,
                mechanicsHandled: this.countSuccessfulMechanics(),
                mechanicsFailed: this.countFailedMechanics()
            },

            // 페이즈별 분석
            phases: this.analyzePhases(),

            // 플레이어 성능
            performance: {
                dps: this.getTopDPS(),
                hps: this.getTopHPS(),
                interrupts: this.getInterruptCount(),
                dispels: this.getDispelCount(),
                deaths: this.getDeathLog()
            },

            // 메커니즘 분석
            mechanics: this.analyzeMechanics(),

            // 쿨다운 사용
            cooldowns: this.analyzeCooldownUsage(),

            // 개선 제안
            suggestions: this.generateSuggestions(),

            // 리플레이 데이터
            replayData: this.replayData
        };
    }

    /**
     * 페이즈별 분석
     */
    analyzePhases() {
        const phases = [];
        let currentPhase = 1;
        let phaseStart = 0;

        for (const event of this.encounterLog) {
            if (event.type === 'phase_transition') {
                phases.push({
                    phase: currentPhase,
                    duration: event.time - phaseStart,
                    dps: this.calculatePhaseDPS(phaseStart, event.time),
                    deaths: this.countPhaseDeaths(phaseStart, event.time)
                });

                currentPhase = event.to.id;
                phaseStart = event.time;
            }
        }

        // 마지막 페이즈
        const endTime = this.getCurrentTime();
        phases.push({
            phase: currentPhase,
            duration: endTime - phaseStart,
            dps: this.calculatePhaseDPS(phaseStart, endTime),
            deaths: this.countPhaseDeaths(phaseStart, endTime)
        });

        return phases;
    }

    /**
     * 메커니즘 분석
     */
    analyzeMechanics() {
        const mechanics = new Map();

        for (const event of this.encounterLog) {
            if (event.type === 'mechanic_complete') {
                if (!mechanics.has(event.mechanic)) {
                    mechanics.set(event.mechanic, {
                        name: event.mechanic,
                        executions: 0,
                        successes: 0,
                        failures: 0,
                        casualties: 0
                    });
                }

                const mechanic = mechanics.get(event.mechanic);
                mechanic.executions++;

                if (event.success) {
                    mechanic.successes++;
                } else {
                    mechanic.failures++;
                    mechanic.casualties += event.casualties || 0;
                }
            }
        }

        return Array.from(mechanics.values());
    }

    /**
     * 쿨다운 사용 분석
     */
    analyzeCooldownUsage() {
        const cooldowns = new Map();

        for (const event of this.encounterLog) {
            if (event.type === 'cooldown_used') {
                if (!cooldowns.has(event.cooldown)) {
                    cooldowns.set(event.cooldown, {
                        name: event.cooldown,
                        uses: 0,
                        players: new Set(),
                        timings: []
                    });
                }

                const cd = cooldowns.get(event.cooldown);
                cd.uses++;
                cd.players.add(event.player);
                cd.timings.push(event.time);
            }
        }

        // 효율성 분석
        return Array.from(cooldowns.values()).map(cd => ({
            ...cd,
            players: Array.from(cd.players),
            efficiency: this.calculateCooldownEfficiency(cd)
        }));
    }

    /**
     * 개선 제안 생성
     */
    generateSuggestions() {
        const suggestions = [];

        // 메커니즘 실패 분석
        const failedMechanics = this.getFailedMechanics();
        if (failedMechanics.length > 0) {
            suggestions.push({
                category: 'mechanics',
                priority: 'high',
                suggestion: `Improve handling of ${failedMechanics[0]} - failed ${this.getMechanicFailureRate(failedMechanics[0])}% of attempts`
            });
        }

        // 쿨다운 최적화
        const suboptimalCooldowns = this.findSuboptimalCooldownUsage();
        if (suboptimalCooldowns.length > 0) {
            suggestions.push({
                category: 'cooldowns',
                priority: 'medium',
                suggestion: `Better timing needed for ${suboptimalCooldowns.join(', ')}`
            });
        }

        // 위치 개선
        const positioningIssues = this.findPositioningIssues();
        if (positioningIssues > 5) {
            suggestions.push({
                category: 'positioning',
                priority: 'medium',
                suggestion: 'Improve positioning to reduce unnecessary movement and damage taken'
            });
        }

        // 역할별 제안
        const roleIssues = this.analyzeRolePerformance();
        for (const issue of roleIssues) {
            suggestions.push(issue);
        }

        return suggestions;
    }

    /**
     * 전투 로그 저장
     */
    saveEncounterLog() {
        const logData = {
            encounter: this.currentEncounter,
            events: this.encounterLog,
            replay: this.replayData,
            timestamp: Date.now()
        };

        // 로컬 스토리지나 데이터베이스에 저장
        this.emit('logSaved', logData);

        return logData;
    }

    /**
     * 로그 이벤트 기록
     */
    logEvent(event) {
        event.timestamp = Date.now();
        this.encounterLog.push(event);

        // 리플레이 데이터 수집
        if (event.type === 'positioning' || event.time % 1 === 0) {
            this.replayData.push({
                time: event.time,
                positions: this.getCurrentPositions(),
                health: this.getCurrentHealth(),
                cooldowns: this.getActiveCooldowns()
            });
        }
    }

    /**
     * 게임 상태 로그
     */
    logGameState(time) {
        const state = {
            time,
            boss: {
                health: this.bossMechanics.currentBoss?.health,
                phase: this.currentEncounter.phase
            },
            raid: {
                alive: this.countAlive(),
                avgHealth: this.getAverageHealth(),
                totalDPS: this.getCurrentDPS(),
                totalHPS: this.getCurrentHPS()
            }
        };

        this.logEvent({
            type: 'game_state',
            time,
            state
        });
    }

    // === 유틸리티 메서드 ===

    getCurrentTime() {
        return (Date.now() - this.currentEncounter.startTime) / 1000;
    }

    getEncounterDuration() {
        // 보스별 예상 전투 시간
        const durations = {
            'normal': 300,  // 5분
            'heroic': 420,  // 7분
            'mythic': 600   // 10분
        };
        return durations[this.currentEncounter.difficulty] || 420;
    }

    getSpecialPositioning(bossName) {
        const specialPositions = {
            'council_of_dreams': 'triangle',
            'fyrakk': 'spread',
            'raszageth': 'two_groups',
            'terros': 'clock'
        };
        return specialPositions[bossName];
    }

    checkEncounterEnd() {
        // 보스 처치
        if (this.bossMechanics.currentBoss?.health <= 0) {
            return true;
        }

        // 전멸
        const aliveCount = this.raidSimulation.simulationState.players
            .filter(p => p.alive).length;
        if (aliveCount === 0) {
            return true;
        }

        // 시간 초과
        if (this.getCurrentTime() >= this.getEncounterDuration()) {
            return true;
        }

        return false;
    }

    generateEncounterResult() {
        const boss = this.bossMechanics.currentBoss;
        const players = this.raidSimulation.simulationState.players;
        const aliveCount = players.filter(p => p.alive).length;

        return {
            victory: boss?.health <= 0,
            duration: this.getCurrentTime(),
            survivors: aliveCount,
            totalPlayers: players.length,
            bossHealthRemaining: boss?.health || 0,
            phase: this.currentEncounter.phase
        };
    }

    getUpcomingMechanics(time) {
        // 다음 10초 내 예정된 메커니즘
        return this.bossMechanics.mechanicSchedule.filter(
            m => m.time / 1000 > time && m.time / 1000 <= time + 10
        );
    }

    announceMechanic(mechanic, time) {
        const timeUntil = (mechanic.time / 1000) - time;

        if (timeUntil <= 5) {
            this.emit('mechanicWarning', {
                mechanic: mechanic.mechanicId,
                timeUntil,
                description: mechanic.mechanic.description
            });
        }
    }

    announceWarning(message, priority = 'normal') {
        this.emit('warning', { message, priority });
    }

    announceSuccess(message) {
        this.emit('success', { message });
    }

    announceFailure(message) {
        this.emit('failure', { message });
    }

    announcePhase(phaseName) {
        this.emit('phaseChange', { phase: phaseName });
    }

    canBattleRes() {
        // 전투 부활 제한 체크
        const limit = {
            'normal': 5,
            'heroic': 3,
            'mythic': 1
        };

        return this.battleRezCount < (limit[this.currentEncounter.difficulty] || 3);
    }

    scheduleBattleRes(player) {
        if (this.canBattleRes()) {
            setTimeout(() => {
                player.alive = true;
                player.health = player.maxHealth * 0.3;
                this.battleRezCount++;

                this.logEvent({
                    type: 'battle_res',
                    time: this.getCurrentTime(),
                    player: player.name
                });
            }, 2000);
        }
    }
}

export default EncounterManager;