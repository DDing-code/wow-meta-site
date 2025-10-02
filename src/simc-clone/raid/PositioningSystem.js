/**
 * Positioning System
 * 위치 기반 메커니즘 시스템
 */

import { EventEmitter } from 'events';

export class PositioningSystem extends EventEmitter {
    constructor() {
        super();

        this.formations = this.initializeFormations();
        this.movementPatterns = this.initializeMovementPatterns();
        this.safeZones = new Map();
        this.dangerZones = new Map();
        this.positionAssignments = new Map();

        this.roomDimensions = {
            width: 100,
            height: 100,
            center: { x: 0, y: 0, z: 0 }
        };

        this.setupCollisionDetection();
    }

    /**
     * 대형 초기화
     */
    initializeFormations() {
        return {
            // 기본 산개 대형
            'spread': {
                name: '산개',
                description: '모든 플레이어가 최소 거리 유지',
                minDistance: 8,
                pattern: 'circular',
                positions: this.generateCircularPositions(25, 30)
            },

            // 쫄 대형
            'stack': {
                name: '뭉치기',
                description: '지정 위치에 모든 플레이어 집결',
                maxDistance: 5,
                pattern: 'tight',
                positions: [{ x: 0, y: 0 }]
            },

            // 근/원 분리
            'melee_ranged_split': {
                name: '근원 분리',
                description: '근딜과 원딜 분리 배치',
                meleePositions: this.generateArcPositions(10, 5, 180, 270),
                rangedPositions: this.generateArcPositions(15, 20, 45, 135)
            },

            // 시계 방향 배치
            'clock': {
                name: '시계 배치',
                description: '12시 방향부터 시계방향 배치',
                positions: this.generateClockPositions(25)
            },

            // 2그룹 분리
            'two_groups': {
                name: '2그룹',
                description: '공격대를 2그룹으로 분리',
                group1: this.generateBoxPositions(-20, -10, 10, 10),
                group2: this.generateBoxPositions(10, -10, 10, 10)
            },

            // 4그룹 분리
            'four_corners': {
                name: '4구역',
                description: '맵 4구역에 분산 배치',
                positions: {
                    NE: { x: 20, y: 20 },
                    NW: { x: -20, y: 20 },
                    SE: { x: 20, y: -20 },
                    SW: { x: -20, y: -20 }
                }
            },

            // 삼각 대형
            'triangle': {
                name: '삼각 대형',
                description: '탱커-힐러-딜러 삼각 배치',
                tank: { x: 0, y: -15 },
                healer: { x: 0, y: 15 },
                dps: this.generateArcPositions(8, 10, 60, 120)
            },

            // 라인 대형
            'line': {
                name: '일렬 대형',
                description: '일직선 배치',
                positions: this.generateLinePositions(25, 'horizontal')
            },

            // 체커보드 패턴
            'checkerboard': {
                name: '체스판',
                description: '체스판 형태로 배치',
                positions: this.generateCheckerboardPositions(5, 5, 8)
            }
        };
    }

    /**
     * 이동 패턴 초기화
     */
    initializeMovementPatterns() {
        return {
            // 시계 방향 회전
            'clockwise_rotation': {
                name: '시계 회전',
                type: 'continuous',
                speed: 10, // degrees per second
                radius: 'maintain',
                direction: 1
            },

            // 안팎 이동
            'in_out': {
                name: '안팎 이동',
                type: 'alternating',
                innerRadius: 5,
                outerRadius: 25,
                transitionTime: 3
            },

            // 좌우 교대
            'left_right': {
                name: '좌우 교대',
                type: 'alternating',
                leftPosition: { x: -20, y: 0 },
                rightPosition: { x: 20, y: 0 },
                transitionTime: 2
            },

            // 나선형 이동
            'spiral': {
                name: '나선 이동',
                type: 'expanding',
                startRadius: 5,
                endRadius: 30,
                rotations: 3,
                duration: 10
            },

            // 지그재그
            'zigzag': {
                name: '지그재그',
                type: 'pattern',
                amplitude: 10,
                wavelength: 15,
                speed: 5
            },

            // 원형 순환
            'circular_movement': {
                name: '원형 이동',
                type: 'orbital',
                radius: 20,
                period: 20 // seconds for full rotation
            },

            // 피난 이동
            'evacuation': {
                name: '대피',
                type: 'reactive',
                safeDistance: 30,
                speed: 150 // % of normal
            },

            // 집결
            'converge': {
                name: '집결',
                type: 'gathering',
                targetPosition: { x: 0, y: 0 },
                arrivalTime: 3
            }
        };
    }

    /**
     * 충돌 감지 설정
     */
    setupCollisionDetection() {
        this.collisionGrid = new Map();
        this.gridSize = 2; // 2 yards per grid cell

        // 그리드 초기화
        for (let x = -50; x <= 50; x += this.gridSize) {
            for (let y = -50; y <= 50; y += this.gridSize) {
                const key = `${Math.floor(x / this.gridSize)},${Math.floor(y / this.gridSize)}`;
                this.collisionGrid.set(key, []);
            }
        }
    }

    /**
     * 동적 위치 생성
     */
    generateDynamicPositions(players, bossPosition = { x: 0, y: 0 }) {
        const positions = [];
        const roleGroups = this.groupPlayersByRole(players);

        // 탱커 위치 (보스 정면)
        if (roleGroups.tanks) {
            const tankAngle = Math.atan2(-bossPosition.y, -bossPosition.x);
            roleGroups.tanks.forEach((tank, i) => {
                const offset = (i - (roleGroups.tanks.length - 1) / 2) * 5;
                positions.push({
                    player: tank,
                    position: {
                        x: bossPosition.x + Math.cos(tankAngle) * 8 + Math.cos(tankAngle + Math.PI / 2) * offset,
                        y: bossPosition.y + Math.sin(tankAngle) * 8 + Math.sin(tankAngle + Math.PI / 2) * offset
                    }
                });
            });
        }

        // 근딜 위치 (보스 뒤/옆)
        if (roleGroups.melee) {
            const meleeRadius = 5;
            const meleeArc = Math.PI; // 180도
            const meleeStart = tankAngle + Math.PI - meleeArc / 2;

            roleGroups.melee.forEach((melee, i) => {
                const angle = meleeStart + (meleeArc / (roleGroups.melee.length - 1 || 1)) * i;
                positions.push({
                    player: melee,
                    position: {
                        x: bossPosition.x + Math.cos(angle) * meleeRadius,
                        y: bossPosition.y + Math.sin(angle) * meleeRadius
                    }
                });
            });
        }

        // 원딜 위치 (뒤쪽 반원)
        if (roleGroups.ranged) {
            const rangedRadius = 20;
            const rangedArc = Math.PI * 1.5; // 270도
            const rangedStart = tankAngle + Math.PI - rangedArc / 2;

            roleGroups.ranged.forEach((ranged, i) => {
                const angle = rangedStart + (rangedArc / (roleGroups.ranged.length - 1 || 1)) * i;
                positions.push({
                    player: ranged,
                    position: {
                        x: bossPosition.x + Math.cos(angle) * rangedRadius,
                        y: bossPosition.y + Math.sin(angle) * rangedRadius
                    }
                });
            });
        }

        // 힐러 위치 (중간 거리, 분산)
        if (roleGroups.healers) {
            const healerRadius = 15;
            roleGroups.healers.forEach((healer, i) => {
                const angle = (Math.PI * 2 / roleGroups.healers.length) * i;
                positions.push({
                    player: healer,
                    position: {
                        x: Math.cos(angle) * healerRadius,
                        y: Math.sin(angle) * healerRadius
                    }
                });
            });
        }

        // 위치 할당
        positions.forEach(({ player, position }) => {
            player.position = position;
            this.positionAssignments.set(player.id, position);
        });

        return positions;
    }

    /**
     * 대형 전환
     */
    transitionFormation(fromFormation, toFormation, duration = 3) {
        const startTime = Date.now();
        const fromPositions = this.formations[fromFormation];
        const toPositions = this.formations[toFormation];

        const transition = {
            from: fromFormation,
            to: toFormation,
            startTime,
            duration: duration * 1000,
            progress: 0
        };

        this.emit('formationTransitionStart', transition);

        // 전환 애니메이션
        const updateInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            transition.progress = Math.min(elapsed / (duration * 1000), 1);

            if (transition.progress >= 1) {
                clearInterval(updateInterval);
                this.emit('formationTransitionComplete', transition);
            } else {
                this.interpolatePositions(fromPositions, toPositions, transition.progress);
            }
        }, 100);

        return transition;
    }

    /**
     * 안전 지대 설정
     */
    setSafeZone(id, zone) {
        const safeZone = {
            id,
            type: zone.type || 'circle',
            position: zone.position,
            radius: zone.radius || 10,
            duration: zone.duration || Infinity,
            createdAt: Date.now()
        };

        this.safeZones.set(id, safeZone);

        if (zone.duration !== Infinity) {
            setTimeout(() => {
                this.safeZones.delete(id);
                this.emit('safeZoneExpired', id);
            }, zone.duration * 1000);
        }

        this.emit('safeZoneCreated', safeZone);
        return safeZone;
    }

    /**
     * 위험 지대 설정
     */
    setDangerZone(id, zone) {
        const dangerZone = {
            id,
            type: zone.type || 'circle',
            position: zone.position,
            size: zone.size || { radius: 10 },
            damage: zone.damage || 50000,
            duration: zone.duration || 5,
            createdAt: Date.now()
        };

        this.dangerZones.set(id, dangerZone);

        if (zone.duration !== Infinity) {
            setTimeout(() => {
                this.dangerZones.delete(id);
                this.emit('dangerZoneExpired', id);
            }, zone.duration * 1000);
        }

        this.emit('dangerZoneCreated', dangerZone);
        return dangerZone;
    }

    /**
     * 위치 유효성 검사
     */
    isValidPosition(position, player = null) {
        // 맵 경계 확인
        if (!this.isWithinBounds(position)) {
            return false;
        }

        // 위험 지대 확인
        for (const [id, zone] of this.dangerZones) {
            if (this.isInZone(position, zone)) {
                return false;
            }
        }

        // 다른 플레이어와의 충돌 확인
        if (player && this.checkCollision(position, player)) {
            return false;
        }

        return true;
    }

    /**
     * 최적 위치 찾기
     */
    findOptimalPosition(player, requirements = {}) {
        const candidates = [];
        const currentPos = player.position;

        // 탐색 범위
        const searchRadius = requirements.searchRadius || 30;
        const step = requirements.step || 2;

        for (let x = -searchRadius; x <= searchRadius; x += step) {
            for (let y = -searchRadius; y <= searchRadius; y += step) {
                const position = {
                    x: currentPos.x + x,
                    y: currentPos.y + y,
                    z: currentPos.z || 0
                };

                if (this.isValidPosition(position, player)) {
                    const score = this.evaluatePosition(position, player, requirements);
                    candidates.push({ position, score });
                }
            }
        }

        // 점수순 정렬
        candidates.sort((a, b) => b.score - a.score);

        return candidates[0]?.position || currentPos;
    }

    /**
     * 위치 평가
     */
    evaluatePosition(position, player, requirements) {
        let score = 100;

        // 안전 지대 보너스
        for (const [id, zone] of this.safeZones) {
            if (this.isInZone(position, zone)) {
                score += 50;
            }
        }

        // 역할별 보정
        switch (player.role) {
            case 'tank':
                // 탱커는 보스 가까이
                if (requirements.bossPosition) {
                    const distance = this.calculateDistance(position, requirements.bossPosition);
                    score -= distance * 2;
                }
                break;

            case 'healer':
                // 힐러는 중간 거리
                if (requirements.raidCenter) {
                    const distance = this.calculateDistance(position, requirements.raidCenter);
                    const optimalDistance = 15;
                    score -= Math.abs(distance - optimalDistance) * 3;
                }
                break;

            case 'dps':
                if (player.subRole === 'melee') {
                    // 근딜은 보스 뒤
                    if (requirements.bossPosition && requirements.bossFacing) {
                        const angle = this.calculateAngle(requirements.bossPosition, position);
                        const backAngle = requirements.bossFacing + Math.PI;
                        const angleDiff = Math.abs(angle - backAngle);
                        score += (1 - angleDiff / Math.PI) * 30;
                    }
                } else {
                    // 원딜은 최대 거리
                    if (requirements.bossPosition) {
                        const distance = this.calculateDistance(position, requirements.bossPosition);
                        score += Math.min(distance, 30);
                    }
                }
                break;
        }

        // 다른 플레이어와의 거리
        if (requirements.otherPlayers) {
            let minDistance = Infinity;
            for (const other of requirements.otherPlayers) {
                if (other.id !== player.id) {
                    const distance = this.calculateDistance(position, other.position);
                    minDistance = Math.min(minDistance, distance);
                }
            }

            // 적절한 간격 유지
            const optimalSpacing = requirements.spacing || 5;
            score -= Math.abs(minDistance - optimalSpacing) * 2;
        }

        return score;
    }

    /**
     * 이동 경로 계산
     */
    calculatePath(from, to, options = {}) {
        // A* 알고리즘 간소화 버전
        const path = [];
        const obstacles = this.getObstacles();

        // 직선 경로 가능한지 확인
        if (this.hasLineOfSight(from, to, obstacles)) {
            return [from, to];
        }

        // 웨이포인트 생성
        const waypoints = this.generateWaypoints(from, to, obstacles);

        // 최단 경로 찾기
        const shortestPath = this.findShortestPath(from, to, waypoints);

        return shortestPath;
    }

    /**
     * 집단 이동
     */
    moveGroup(players, targetPosition, formation = 'maintain') {
        const movements = [];

        if (formation === 'maintain') {
            // 현재 대형 유지하며 이동
            const centerOfMass = this.calculateCenterOfMass(players);
            const offset = {
                x: targetPosition.x - centerOfMass.x,
                y: targetPosition.y - centerOfMass.y
            };

            for (const player of players) {
                const newPosition = {
                    x: player.position.x + offset.x,
                    y: player.position.y + offset.y,
                    z: player.position.z || 0
                };

                movements.push({
                    player,
                    from: player.position,
                    to: newPosition,
                    path: this.calculatePath(player.position, newPosition)
                });
            }
        } else {
            // 새로운 대형으로 이동
            const targetFormation = this.formations[formation];
            const positions = targetFormation.positions || [];

            players.forEach((player, index) => {
                const targetPos = positions[index % positions.length];
                const newPosition = {
                    x: targetPosition.x + targetPos.x,
                    y: targetPosition.y + targetPos.y,
                    z: targetPosition.z || 0
                };

                movements.push({
                    player,
                    from: player.position,
                    to: newPosition,
                    path: this.calculatePath(player.position, newPosition)
                });
            });
        }

        this.emit('groupMovement', movements);
        return movements;
    }

    /**
     * 넉백 처리
     */
    applyKnockback(player, source, force, direction = null) {
        const knockbackDirection = direction || this.calculateDirection(source, player.position);
        const knockbackDistance = force * (1 - (player.knockbackResistance || 0));

        const newPosition = {
            x: player.position.x + knockbackDirection.x * knockbackDistance,
            y: player.position.y + knockbackDirection.y * knockbackDistance,
            z: player.position.z || 0
        };

        // 벽 충돌 확인
        if (!this.isWithinBounds(newPosition)) {
            // 벽에 부딪힌 위치 계산
            const wallPosition = this.getWallCollisionPoint(player.position, newPosition);
            const wallDamage = force * 1000; // 넉백 힘에 비례한 추가 피해

            this.emit('wallCollision', {
                player,
                position: wallPosition,
                damage: wallDamage
            });

            return wallPosition;
        }

        return newPosition;
    }

    /**
     * 당기기 처리
     */
    applyPull(player, target, force) {
        const pullDirection = this.calculateDirection(player.position, target);
        const pullDistance = Math.min(
            force,
            this.calculateDistance(player.position, target)
        );

        const newPosition = {
            x: player.position.x + pullDirection.x * pullDistance,
            y: player.position.y + pullDirection.y * pullDistance,
            z: player.position.z || 0
        };

        return newPosition;
    }

    /**
     * 회전 이동
     */
    rotateAroundPoint(player, center, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const dx = player.position.x - center.x;
        const dy = player.position.y - center.y;

        const newPosition = {
            x: center.x + dx * cos - dy * sin,
            y: center.y + dx * sin + dy * cos,
            z: player.position.z || 0
        };

        return newPosition;
    }

    /**
     * 바람장 효과
     */
    applyWindEffect(players, windSource, windDirection, windStrength) {
        const affected = [];

        for (const player of players) {
            const distance = this.calculateDistance(player.position, windSource);

            // 거리에 따른 바람 세기 감소
            const effectStrength = windStrength * Math.max(0, 1 - distance / 50);

            if (effectStrength > 0) {
                const windForce = {
                    x: windDirection.x * effectStrength,
                    y: windDirection.y * effectStrength
                };

                const newPosition = {
                    x: player.position.x + windForce.x,
                    y: player.position.y + windForce.y,
                    z: player.position.z || 0
                };

                affected.push({
                    player,
                    oldPosition: player.position,
                    newPosition,
                    force: effectStrength
                });
            }
        }

        return affected;
    }

    /**
     * 연쇄 번개 경로
     */
    calculateChainLightningPath(source, players, maxJumps = 5, maxRange = 10) {
        const path = [];
        const hit = new Set();
        let current = source;

        for (let i = 0; i < maxJumps; i++) {
            let nearest = null;
            let nearestDistance = maxRange;

            for (const player of players) {
                if (hit.has(player.id)) continue;

                const distance = this.calculateDistance(current, player.position);
                if (distance < nearestDistance) {
                    nearest = player;
                    nearestDistance = distance;
                }
            }

            if (!nearest) break;

            path.push({
                from: current,
                to: nearest.position,
                target: nearest,
                jump: i + 1
            });

            hit.add(nearest.id);
            current = nearest.position;
        }

        return path;
    }

    // === 유틸리티 메서드 ===

    /**
     * 원형 위치 생성
     */
    generateCircularPositions(count, radius) {
        const positions = [];
        const angleStep = (Math.PI * 2) / count;

        for (let i = 0; i < count; i++) {
            const angle = angleStep * i;
            positions.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }

        return positions;
    }

    /**
     * 호 위치 생성
     */
    generateArcPositions(count, radius, startAngle, endAngle) {
        const positions = [];
        const angleRange = (endAngle - startAngle) * Math.PI / 180;
        const angleStep = angleRange / (count - 1);
        const startRad = startAngle * Math.PI / 180;

        for (let i = 0; i < count; i++) {
            const angle = startRad + angleStep * i;
            positions.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }

        return positions;
    }

    /**
     * 시계 위치 생성
     */
    generateClockPositions(count) {
        const positions = [];
        const radius = 25;

        for (let i = 0; i < count; i++) {
            const hour = (i / count) * 12;
            const angle = (hour - 3) * Math.PI / 6; // 12시가 위쪽

            positions.push({
                hour: Math.floor(hour) || 12,
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }

        return positions;
    }

    /**
     * 박스 위치 생성
     */
    generateBoxPositions(x, y, width, height) {
        const positions = [];
        const rows = 3;
        const cols = 3;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                positions.push({
                    x: x + (c / (cols - 1)) * width,
                    y: y + (r / (rows - 1)) * height
                });
            }
        }

        return positions;
    }

    /**
     * 라인 위치 생성
     */
    generateLinePositions(count, orientation = 'horizontal') {
        const positions = [];
        const spacing = 3;
        const totalLength = (count - 1) * spacing;

        for (let i = 0; i < count; i++) {
            if (orientation === 'horizontal') {
                positions.push({
                    x: -totalLength / 2 + i * spacing,
                    y: 0
                });
            } else {
                positions.push({
                    x: 0,
                    y: -totalLength / 2 + i * spacing
                });
            }
        }

        return positions;
    }

    /**
     * 체커보드 위치 생성
     */
    generateCheckerboardPositions(rows, cols, spacing) {
        const positions = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if ((r + c) % 2 === 0) {
                    positions.push({
                        x: (c - cols / 2) * spacing,
                        y: (r - rows / 2) * spacing
                    });
                }
            }
        }

        return positions;
    }

    /**
     * 역할별 그룹화
     */
    groupPlayersByRole(players) {
        const groups = {
            tanks: [],
            healers: [],
            melee: [],
            ranged: []
        };

        for (const player of players) {
            if (player.role === 'tank') {
                groups.tanks.push(player);
            } else if (player.role === 'healer') {
                groups.healers.push(player);
            } else if (player.subRole === 'melee') {
                groups.melee.push(player);
            } else if (player.subRole === 'ranged') {
                groups.ranged.push(player);
            }
        }

        return groups;
    }

    /**
     * 거리 계산
     */
    calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = (pos1.z || 0) - (pos2.z || 0);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * 방향 계산
     */
    calculateDirection(from, to) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return {
            x: distance > 0 ? dx / distance : 0,
            y: distance > 0 ? dy / distance : 0
        };
    }

    /**
     * 각도 계산
     */
    calculateAngle(from, to) {
        return Math.atan2(to.y - from.y, to.x - from.x);
    }

    /**
     * 영역 내 확인
     */
    isInZone(position, zone) {
        switch (zone.type) {
            case 'circle':
                const distance = this.calculateDistance(position, zone.position);
                return distance <= (zone.radius || zone.size?.radius || 10);

            case 'rectangle':
                return position.x >= zone.position.x - zone.size.width / 2 &&
                       position.x <= zone.position.x + zone.size.width / 2 &&
                       position.y >= zone.position.y - zone.size.height / 2 &&
                       position.y <= zone.position.y + zone.size.height / 2;

            case 'cone':
                const dist = this.calculateDistance(position, zone.position);
                if (dist > zone.range) return false;

                const angle = this.calculateAngle(zone.position, position);
                const angleDiff = Math.abs(angle - zone.facing);
                return angleDiff <= zone.angle / 2;

            default:
                return false;
        }
    }

    /**
     * 경계 내 확인
     */
    isWithinBounds(position) {
        return position.x >= -this.roomDimensions.width / 2 &&
               position.x <= this.roomDimensions.width / 2 &&
               position.y >= -this.roomDimensions.height / 2 &&
               position.y <= this.roomDimensions.height / 2;
    }

    /**
     * 충돌 확인
     */
    checkCollision(position, player) {
        const gridKey = `${Math.floor(position.x / this.gridSize)},${Math.floor(position.y / this.gridSize)}`;
        const nearbyPlayers = this.collisionGrid.get(gridKey) || [];

        for (const other of nearbyPlayers) {
            if (other.id === player.id) continue;

            const distance = this.calculateDistance(position, other.position);
            if (distance < 1) { // 1 yard minimum spacing
                return true;
            }
        }

        return false;
    }

    /**
     * 무게 중심 계산
     */
    calculateCenterOfMass(players) {
        let sumX = 0, sumY = 0;

        for (const player of players) {
            sumX += player.position.x;
            sumY += player.position.y;
        }

        return {
            x: sumX / players.length,
            y: sumY / players.length
        };
    }

    /**
     * 위치 보간
     */
    interpolatePositions(fromPositions, toPositions, progress) {
        // Ease-in-out 커브
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const interpolated = [];

        for (let i = 0; i < fromPositions.length; i++) {
            const from = fromPositions[i];
            const to = toPositions[i % toPositions.length];

            interpolated.push({
                x: from.x + (to.x - from.x) * easeProgress,
                y: from.y + (to.y - from.y) * easeProgress
            });
        }

        return interpolated;
    }

    /**
     * 벽 충돌 지점 계산
     */
    getWallCollisionPoint(from, to) {
        const bounds = {
            minX: -this.roomDimensions.width / 2,
            maxX: this.roomDimensions.width / 2,
            minY: -this.roomDimensions.height / 2,
            maxY: this.roomDimensions.height / 2
        };

        let collision = { ...to };

        if (to.x < bounds.minX) collision.x = bounds.minX;
        if (to.x > bounds.maxX) collision.x = bounds.maxX;
        if (to.y < bounds.minY) collision.y = bounds.minY;
        if (to.y > bounds.maxY) collision.y = bounds.maxY;

        return collision;
    }

    /**
     * 시야선 확인
     */
    hasLineOfSight(from, to, obstacles) {
        // 간소화된 레이캐스팅
        const steps = 10;
        const dx = (to.x - from.x) / steps;
        const dy = (to.y - from.y) / steps;

        for (let i = 1; i < steps; i++) {
            const point = {
                x: from.x + dx * i,
                y: from.y + dy * i
            };

            for (const obstacle of obstacles) {
                if (this.isInZone(point, obstacle)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 장애물 가져오기
     */
    getObstacles() {
        const obstacles = [];

        // 위험 지대를 장애물로 취급
        for (const [id, zone] of this.dangerZones) {
            obstacles.push(zone);
        }

        return obstacles;
    }

    /**
     * 웨이포인트 생성
     */
    generateWaypoints(from, to, obstacles) {
        const waypoints = [from];

        // 간단한 그리드 기반 웨이포인트
        const gridSize = 5;
        const minX = Math.min(from.x, to.x) - 10;
        const maxX = Math.max(from.x, to.x) + 10;
        const minY = Math.min(from.y, to.y) - 10;
        const maxY = Math.max(from.y, to.y) + 10;

        for (let x = minX; x <= maxX; x += gridSize) {
            for (let y = minY; y <= maxY; y += gridSize) {
                const point = { x, y };
                let valid = true;

                for (const obstacle of obstacles) {
                    if (this.isInZone(point, obstacle)) {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    waypoints.push(point);
                }
            }
        }

        waypoints.push(to);
        return waypoints;
    }

    /**
     * 최단 경로 찾기 (간소화된 A*)
     */
    findShortestPath(from, to, waypoints) {
        const path = [from];
        let current = from;

        while (this.calculateDistance(current, to) > 1) {
            let nearest = to;
            let nearestDistance = this.calculateDistance(current, to);

            for (const waypoint of waypoints) {
                const distance = this.calculateDistance(current, waypoint) +
                                this.calculateDistance(waypoint, to);

                if (distance < nearestDistance) {
                    nearest = waypoint;
                    nearestDistance = distance;
                }
            }

            path.push(nearest);
            current = nearest;

            // 무한 루프 방지
            if (path.length > 100) break;
        }

        if (current !== to) {
            path.push(to);
        }

        return path;
    }
}

export default PositioningSystem;