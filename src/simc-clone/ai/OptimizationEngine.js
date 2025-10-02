/**
 * Optimization Engine
 * AI 기반 최적화 엔진
 */

import { EventEmitter } from 'events';
import * as tf from '@tensorflow/tfjs';

export class OptimizationEngine extends EventEmitter {
    constructor() {
        super();

        this.optimizers = new Map();
        this.algorithms = this.initializeAlgorithms();
        this.constraints = new Map();
        this.objectives = new Map();

        this.optimizationState = {
            currentIteration: 0,
            bestSolution: null,
            bestFitness: -Infinity,
            convergence: false,
            history: []
        };

        this.hyperparameters = this.initializeHyperparameters();
    }

    /**
     * 최적화 알고리즘 초기화
     */
    initializeAlgorithms() {
        return {
            // 유전자 알고리즘
            genetic: {
                populationSize: 100,
                generations: 1000,
                mutationRate: 0.01,
                crossoverRate: 0.7,
                elitismRate: 0.1,
                tournamentSize: 5,
                fitnessFunction: null,
                geneLength: 50
            },

            // 입자 군집 최적화
            pso: {
                particleCount: 50,
                iterations: 500,
                inertiaWeight: 0.729,
                cognitiveWeight: 1.49445,
                socialWeight: 1.49445,
                velocityLimit: 0.2,
                dimensions: 10
            },

            // 시뮬레이티드 어닐링
            simulatedAnnealing: {
                initialTemperature: 1000,
                coolingRate: 0.95,
                minTemperature: 0.001,
                iterations: 10000,
                neighborhoodSize: 0.1
            },

            // 경사 하강법
            gradientDescent: {
                learningRate: 0.01,
                momentum: 0.9,
                iterations: 1000,
                tolerance: 1e-6,
                adaptive: true,
                batchSize: 32
            },

            // 베이지안 최적화
            bayesian: {
                acquisitionFunction: 'ei', // Expected Improvement
                kernelType: 'rbf',
                explorationRate: 0.1,
                iterations: 100,
                initialPoints: 10
            },

            // 강화학습 기반 최적화
            reinforcement: {
                algorithm: 'ppo', // Proximal Policy Optimization
                episodeLength: 200,
                episodes: 1000,
                discountFactor: 0.99,
                learningRate: 0.0003,
                clipRange: 0.2
            },

            // 다목적 최적화 (NSGA-II)
            nsga2: {
                populationSize: 100,
                generations: 500,
                crossoverProbability: 0.9,
                mutationProbability: 0.1,
                tournamentSize: 2,
                objectives: []
            },

            // 개미 군집 최적화
            aco: {
                antCount: 50,
                iterations: 500,
                alpha: 1.0, // 페로몬 중요도
                beta: 2.0,  // 휴리스틱 중요도
                evaporationRate: 0.5,
                pheromoneDeposit: 1.0
            }
        };
    }

    /**
     * 하이퍼파라미터 초기화
     */
    initializeHyperparameters() {
        return {
            convergence: {
                maxIterations: 10000,
                tolerance: 1e-6,
                stagnationLimit: 100,
                improvementThreshold: 0.001
            },

            parallelization: {
                workers: 4,
                batchSize: 10,
                asyncUpdate: true
            },

            adaptation: {
                adaptiveRate: true,
                rateDecay: 0.99,
                rateIncrease: 1.05,
                minRate: 1e-6,
                maxRate: 1.0
            },

            diversity: {
                maintainDiversity: true,
                diversityThreshold: 0.1,
                nichingRadius: 0.1,
                speciesCount: 5
            }
        };
    }

    /**
     * DPS 최적화
     */
    async optimizeDPS(player, config = {}) {
        const optimizer = config.algorithm || 'genetic';
        const algorithm = this.algorithms[optimizer];

        // 목적 함수 정의
        const objectiveFunction = (solution) => {
            return this.evaluateDPS(player, solution);
        };

        // 제약 조건 설정
        const constraints = [
            { type: 'resource', limit: player.resources },
            { type: 'cooldown', limit: player.cooldowns },
            { type: 'positioning', limit: player.position }
        ];

        // 최적화 실행
        const result = await this.runOptimization(
            optimizer,
            objectiveFunction,
            constraints,
            algorithm
        );

        this.emit('dpsOptimized', {
            player: player.name,
            originalDPS: player.currentDPS,
            optimizedDPS: result.fitness,
            improvement: ((result.fitness - player.currentDPS) / player.currentDPS * 100).toFixed(2) + '%',
            solution: result.solution
        });

        return result;
    }

    /**
     * 로테이션 최적화
     */
    async optimizeRotation(specialization, encounter, config = {}) {
        const populationSize = config.populationSize || 100;
        const generations = config.generations || 500;

        // 초기 인구 생성
        let population = this.generateInitialPopulation(populationSize, specialization);

        for (let gen = 0; gen < generations; gen++) {
            // 적합도 평가
            const fitness = await this.evaluatePopulation(population, specialization, encounter);

            // 선택
            const parents = this.selection(population, fitness, populationSize / 2);

            // 교차
            const offspring = this.crossover(parents, populationSize - parents.length);

            // 변이
            this.mutate(offspring, this.algorithms.genetic.mutationRate);

            // 엘리트 보존
            const elite = this.getElite(population, fitness, Math.floor(populationSize * 0.1));

            // 새로운 세대
            population = [...elite, ...offspring];

            // 최적 해 업데이트
            const bestIdx = fitness.indexOf(Math.max(...fitness));
            if (fitness[bestIdx] > this.optimizationState.bestFitness) {
                this.optimizationState.bestFitness = fitness[bestIdx];
                this.optimizationState.bestSolution = population[bestIdx];
            }

            // 수렴 확인
            if (this.checkConvergence(fitness)) {
                this.optimizationState.convergence = true;
                break;
            }

            this.emit('generationComplete', {
                generation: gen + 1,
                bestFitness: this.optimizationState.bestFitness,
                averageFitness: fitness.reduce((a, b) => a + b, 0) / fitness.length
            });
        }

        return {
            rotation: this.decodeRotation(this.optimizationState.bestSolution),
            dps: this.optimizationState.bestFitness,
            convergence: this.optimizationState.convergence
        };
    }

    /**
     * 장비 최적화
     */
    async optimizeGear(player, availableGear, config = {}) {
        const algorithm = config.algorithm || 'pso';
        const iterations = config.iterations || 500;

        // 입자 군집 초기화
        const swarm = this.initializePSO(
            this.algorithms.pso.particleCount,
            availableGear.length
        );

        let globalBest = null;
        let globalBestFitness = -Infinity;

        for (let iter = 0; iter < iterations; iter++) {
            // 각 입자 평가
            for (const particle of swarm) {
                const fitness = await this.evaluateGearSet(player, particle.position, availableGear);

                // 개인 최적 업데이트
                if (fitness > particle.bestFitness) {
                    particle.bestFitness = fitness;
                    particle.bestPosition = [...particle.position];
                }

                // 전역 최적 업데이트
                if (fitness > globalBestFitness) {
                    globalBestFitness = fitness;
                    globalBest = [...particle.position];
                }
            }

            // 속도 및 위치 업데이트
            this.updatePSO(swarm, globalBest);

            // 관성 가중치 감소
            this.algorithms.pso.inertiaWeight *= 0.99;

            this.emit('psoIteration', {
                iteration: iter + 1,
                globalBestFitness,
                averageFitness: swarm.reduce((acc, p) => acc + p.bestFitness, 0) / swarm.length
            });
        }

        // 최적 장비 세트 디코딩
        const optimalGear = this.decodeGearSet(globalBest, availableGear);

        return {
            gear: optimalGear,
            stats: this.calculateGearStats(optimalGear),
            dpsIncrease: globalBestFitness,
            simulationCount: iterations * swarm.length
        };
    }

    /**
     * 팀 구성 최적화
     */
    async optimizeTeamComposition(availablePlayers, encounterType, config = {}) {
        const objectives = [
            (team) => this.calculateTeamDPS(team),
            (team) => this.calculateTeamSurvivability(team),
            (team) => this.calculateTeamSynergy(team),
            (team) => this.calculateTeamUtility(team)
        ];

        // NSGA-II 다목적 최적화
        const result = await this.runNSGA2(
            availablePlayers,
            objectives,
            this.algorithms.nsga2
        );

        // Pareto front에서 최적해 선택
        const optimalTeam = this.selectFromParetoFront(result.paretoFront, encounterType);

        return {
            composition: optimalTeam,
            metrics: {
                dps: this.calculateTeamDPS(optimalTeam),
                survivability: this.calculateTeamSurvivability(optimalTeam),
                synergy: this.calculateTeamSynergy(optimalTeam),
                utility: this.calculateTeamUtility(optimalTeam)
            },
            alternatives: result.paretoFront.slice(0, 5)
        };
    }

    /**
     * 리소스 관리 최적화
     */
    async optimizeResourceManagement(player, simulationLength, config = {}) {
        // 강화학습 기반 최적화
        const agent = await this.createRLAgent(player, config);

        const episodes = config.episodes || 1000;
        const episodeLength = config.episodeLength || 200;

        for (let episode = 0; episode < episodes; episode++) {
            let state = this.getInitialState(player);
            let totalReward = 0;

            for (let step = 0; step < episodeLength; step++) {
                // 행동 선택
                const action = await agent.selectAction(state);

                // 환경 업데이트
                const { nextState, reward, done } = this.stepEnvironment(
                    player,
                    state,
                    action
                );

                // 에이전트 학습
                await agent.learn(state, action, reward, nextState, done);

                state = nextState;
                totalReward += reward;

                if (done) break;
            }

            this.emit('episodeComplete', {
                episode: episode + 1,
                totalReward,
                averageReward: totalReward / episodeLength
            });
        }

        // 최적 정책 추출
        const optimalPolicy = await agent.getPolicy();

        return {
            policy: optimalPolicy,
            expectedReward: await this.evaluatePolicy(optimalPolicy, player),
            resourceEfficiency: this.calculateResourceEfficiency(optimalPolicy)
        };
    }

    /**
     * 유전자 알고리즘 - 선택
     */
    selection(population, fitness, count) {
        const selected = [];
        const tournamentSize = this.algorithms.genetic.tournamentSize;

        for (let i = 0; i < count; i++) {
            // 토너먼트 선택
            const tournament = [];
            for (let j = 0; j < tournamentSize; j++) {
                const idx = Math.floor(Math.random() * population.length);
                tournament.push({ individual: population[idx], fitness: fitness[idx] });
            }

            // 토너먼트에서 최적 개체 선택
            tournament.sort((a, b) => b.fitness - a.fitness);
            selected.push(tournament[0].individual);
        }

        return selected;
    }

    /**
     * 유전자 알고리즘 - 교차
     */
    crossover(parents, offspringCount) {
        const offspring = [];
        const crossoverRate = this.algorithms.genetic.crossoverRate;

        while (offspring.length < offspringCount) {
            const parent1 = parents[Math.floor(Math.random() * parents.length)];
            const parent2 = parents[Math.floor(Math.random() * parents.length)];

            if (Math.random() < crossoverRate) {
                // 단일점 교차
                const crossoverPoint = Math.floor(Math.random() * parent1.length);
                const child1 = [
                    ...parent1.slice(0, crossoverPoint),
                    ...parent2.slice(crossoverPoint)
                ];
                const child2 = [
                    ...parent2.slice(0, crossoverPoint),
                    ...parent1.slice(crossoverPoint)
                ];

                offspring.push(child1);
                if (offspring.length < offspringCount) {
                    offspring.push(child2);
                }
            } else {
                offspring.push([...parent1]);
                if (offspring.length < offspringCount) {
                    offspring.push([...parent2]);
                }
            }
        }

        return offspring.slice(0, offspringCount);
    }

    /**
     * 유전자 알고리즘 - 변이
     */
    mutate(population, mutationRate) {
        for (const individual of population) {
            for (let i = 0; i < individual.length; i++) {
                if (Math.random() < mutationRate) {
                    // 비트 플립 변이
                    individual[i] = individual[i] === 0 ? 1 : 0;
                }
            }
        }
    }

    /**
     * PSO 초기화
     */
    initializePSO(particleCount, dimensions) {
        const swarm = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = {
                position: Array(dimensions).fill(0).map(() => Math.random()),
                velocity: Array(dimensions).fill(0).map(() => (Math.random() - 0.5) * 0.2),
                bestPosition: null,
                bestFitness: -Infinity
            };

            particle.bestPosition = [...particle.position];
            swarm.push(particle);
        }

        return swarm;
    }

    /**
     * PSO 업데이트
     */
    updatePSO(swarm, globalBest) {
        const { inertiaWeight, cognitiveWeight, socialWeight, velocityLimit } = this.algorithms.pso;

        for (const particle of swarm) {
            for (let d = 0; d < particle.position.length; d++) {
                // 속도 업데이트
                const r1 = Math.random();
                const r2 = Math.random();

                particle.velocity[d] =
                    inertiaWeight * particle.velocity[d] +
                    cognitiveWeight * r1 * (particle.bestPosition[d] - particle.position[d]) +
                    socialWeight * r2 * (globalBest[d] - particle.position[d]);

                // 속도 제한
                particle.velocity[d] = Math.max(-velocityLimit, Math.min(velocityLimit, particle.velocity[d]));

                // 위치 업데이트
                particle.position[d] += particle.velocity[d];

                // 경계 처리
                particle.position[d] = Math.max(0, Math.min(1, particle.position[d]));
            }
        }
    }

    /**
     * 시뮬레이티드 어닐링
     */
    async simulatedAnnealing(initialSolution, objectiveFunction, config = {}) {
        const params = { ...this.algorithms.simulatedAnnealing, ...config };

        let currentSolution = initialSolution;
        let currentFitness = await objectiveFunction(currentSolution);
        let bestSolution = currentSolution;
        let bestFitness = currentFitness;
        let temperature = params.initialTemperature;

        for (let iter = 0; iter < params.iterations; iter++) {
            // 이웃 해 생성
            const neighbor = this.generateNeighbor(currentSolution, params.neighborhoodSize);
            const neighborFitness = await objectiveFunction(neighbor);

            // 수락 확률 계산
            const delta = neighborFitness - currentFitness;
            const acceptProbability = delta > 0 ? 1 : Math.exp(delta / temperature);

            // 해 수락
            if (Math.random() < acceptProbability) {
                currentSolution = neighbor;
                currentFitness = neighborFitness;

                if (currentFitness > bestFitness) {
                    bestSolution = currentSolution;
                    bestFitness = currentFitness;
                }
            }

            // 온도 감소
            temperature *= params.coolingRate;

            if (temperature < params.minTemperature) {
                break;
            }

            if (iter % 100 === 0) {
                this.emit('annealingProgress', {
                    iteration: iter,
                    temperature,
                    currentFitness,
                    bestFitness
                });
            }
        }

        return {
            solution: bestSolution,
            fitness: bestFitness,
            finalTemperature: temperature
        };
    }

    /**
     * NSGA-II 실행
     */
    async runNSGA2(candidates, objectives, config) {
        let population = this.initializePopulation(candidates, config.populationSize);
        const paretoHistory = [];

        for (let gen = 0; gen < config.generations; gen++) {
            // 목적 함수 평가
            const objectiveValues = [];
            for (const individual of population) {
                const values = [];
                for (const objective of objectives) {
                    values.push(await objective(individual));
                }
                objectiveValues.push(values);
            }

            // 비지배 정렬
            const fronts = this.nonDominatedSorting(population, objectiveValues);

            // Crowding distance 계산
            this.calculateCrowdingDistance(fronts, objectiveValues);

            // 선택 및 재생산
            const parents = this.nsgaSelection(fronts, config.populationSize);
            const offspring = this.nsgaCrossoverMutation(
                parents,
                config.crossoverProbability,
                config.mutationProbability
            );

            // 새로운 세대
            population = [...parents, ...offspring].slice(0, config.populationSize);

            // Pareto front 저장
            paretoHistory.push(fronts[0]);

            this.emit('nsgaGeneration', {
                generation: gen + 1,
                paretoFrontSize: fronts[0].length,
                frontsCount: fronts.length
            });
        }

        return {
            paretoFront: paretoHistory[paretoHistory.length - 1],
            history: paretoHistory
        };
    }

    /**
     * 베이지안 최적화
     */
    async bayesianOptimization(objectiveFunction, bounds, config = {}) {
        const params = { ...this.algorithms.bayesian, ...config };

        // 초기 샘플링
        const observations = [];
        for (let i = 0; i < params.initialPoints; i++) {
            const point = this.sampleRandomPoint(bounds);
            const value = await objectiveFunction(point);
            observations.push({ point, value });
        }

        // 가우시안 프로세스 모델
        const gp = this.createGaussianProcess(params.kernelType);

        for (let iter = 0; iter < params.iterations; iter++) {
            // GP 모델 학습
            await gp.fit(
                observations.map(o => o.point),
                observations.map(o => o.value)
            );

            // 다음 샘플 포인트 선택 (획득 함수 최대화)
            const nextPoint = await this.maximizeAcquisition(
                gp,
                bounds,
                params.acquisitionFunction,
                params.explorationRate
            );

            // 목적 함수 평가
            const value = await objectiveFunction(nextPoint);
            observations.push({ point: nextPoint, value });

            // 최적값 업데이트
            const best = observations.reduce((max, o) => o.value > max.value ? o : max);

            this.emit('bayesianIteration', {
                iteration: iter + 1,
                bestValue: best.value,
                bestPoint: best.point,
                observationsCount: observations.length
            });
        }

        const best = observations.reduce((max, o) => o.value > max.value ? o : max);

        return {
            optimalPoint: best.point,
            optimalValue: best.value,
            observations
        };
    }

    /**
     * 강화학습 에이전트 생성
     */
    async createRLAgent(player, config) {
        const stateSize = this.getStateSize(player);
        const actionSize = this.getActionSize(player);

        // PPO 에이전트 생성
        const agent = {
            actor: this.createActorNetwork(stateSize, actionSize),
            critic: this.createCriticNetwork(stateSize),
            memory: [],

            selectAction: async (state) => {
                const stateTensor = tf.tensor2d([state]);
                const actionProbs = await this.actor.predict(stateTensor);
                const action = tf.multinomial(actionProbs, 1);
                return action.dataSync()[0];
            },

            learn: async (state, action, reward, nextState, done) => {
                // 메모리에 저장
                this.memory.push({ state, action, reward, nextState, done });

                // 배치 학습
                if (this.memory.length >= config.batchSize) {
                    await this.updatePPO();
                    this.memory = [];
                }
            },

            getPolicy: async () => {
                // 정책 추출
                return this.actor;
            }
        };

        return agent;
    }

    /**
     * 수렴 확인
     */
    checkConvergence(fitness) {
        const hp = this.hyperparameters.convergence;

        // 평균 적합도 계산
        const avgFitness = fitness.reduce((a, b) => a + b, 0) / fitness.length;

        // 히스토리에 추가
        this.optimizationState.history.push(avgFitness);

        // 정체 확인
        if (this.optimizationState.history.length >= hp.stagnationLimit) {
            const recent = this.optimizationState.history.slice(-hp.stagnationLimit);
            const improvement = Math.abs(recent[recent.length - 1] - recent[0]);

            if (improvement < hp.improvementThreshold) {
                return true; // 수렴
            }
        }

        // 반복 한계 확인
        this.optimizationState.currentIteration++;
        if (this.optimizationState.currentIteration >= hp.maxIterations) {
            return true; // 최대 반복 도달
        }

        return false;
    }

    /**
     * 최적화 실행
     */
    async runOptimization(algorithm, objectiveFunction, constraints, params) {
        this.emit('optimizationStart', {
            algorithm,
            constraints: constraints.length
        });

        let result;

        switch (algorithm) {
            case 'genetic':
                result = await this.runGeneticAlgorithm(objectiveFunction, constraints, params);
                break;

            case 'pso':
                result = await this.runPSO(objectiveFunction, constraints, params);
                break;

            case 'simulatedAnnealing':
                result = await this.simulatedAnnealing(
                    this.generateRandomSolution(),
                    objectiveFunction,
                    params
                );
                break;

            case 'bayesian':
                result = await this.bayesianOptimization(
                    objectiveFunction,
                    this.getBounds(constraints),
                    params
                );
                break;

            default:
                throw new Error(`Unknown optimization algorithm: ${algorithm}`);
        }

        this.emit('optimizationComplete', {
            algorithm,
            result: result.fitness || result.optimalValue,
            iterations: this.optimizationState.currentIteration
        });

        return result;
    }

    /**
     * 평가 함수들
     */
    async evaluateDPS(player, solution) {
        // DPS 시뮬레이션 실행
        const simulation = await this.simulateCombat(player, solution);
        return simulation.totalDamage / simulation.duration;
    }

    async evaluateGearSet(player, gearIndices, availableGear) {
        const gear = gearIndices.map(idx => availableGear[Math.floor(idx * availableGear.length)]);
        const stats = this.calculateGearStats(gear);
        const dps = await this.simulateWithGear(player, gear);
        return dps;
    }

    calculateTeamDPS(team) {
        return team.reduce((total, player) => total + player.dps, 0);
    }

    calculateTeamSurvivability(team) {
        const healers = team.filter(p => p.role === 'healer').length;
        const tanks = team.filter(p => p.role === 'tank').length;
        return (healers * 0.4 + tanks * 0.3 + team.length * 0.3) / team.length;
    }

    calculateTeamSynergy(team) {
        let synergy = 0;

        // 버프/디버프 시너지
        const buffs = new Set();
        const debuffs = new Set();

        team.forEach(player => {
            player.buffs?.forEach(buff => buffs.add(buff));
            player.debuffs?.forEach(debuff => debuffs.add(debuff));
        });

        synergy += buffs.size * 0.05 + debuffs.size * 0.05;

        // 클래스 다양성
        const classes = new Set(team.map(p => p.class));
        synergy += classes.size / 13 * 0.2;

        return Math.min(synergy, 1);
    }

    calculateTeamUtility(team) {
        const utilities = ['bloodlust', 'battleRes', 'dispel', 'interrupt', 'mobility'];
        let coverage = 0;

        utilities.forEach(utility => {
            if (team.some(p => p.utilities?.includes(utility))) {
                coverage += 0.2;
            }
        });

        return coverage;
    }

    /**
     * 헬퍼 함수들
     */
    generateInitialPopulation(size, spec) {
        const population = [];
        for (let i = 0; i < size; i++) {
            const individual = [];
            for (let j = 0; j < spec.abilities.length; j++) {
                individual.push(Math.random() > 0.5 ? 1 : 0);
            }
            population.push(individual);
        }
        return population;
    }

    getElite(population, fitness, count) {
        const sorted = population.map((ind, i) => ({ ind, fit: fitness[i] }))
            .sort((a, b) => b.fit - a.fit);
        return sorted.slice(0, count).map(item => item.ind);
    }

    generateNeighbor(solution, neighborhoodSize) {
        const neighbor = [...solution];
        const changeCount = Math.ceil(solution.length * neighborhoodSize);

        for (let i = 0; i < changeCount; i++) {
            const idx = Math.floor(Math.random() * neighbor.length);
            neighbor[idx] = neighbor[idx] === 0 ? 1 : 0;
        }

        return neighbor;
    }

    nonDominatedSorting(population, objectiveValues) {
        // NSGA-II 비지배 정렬 구현
        const fronts = [];
        const dominationCount = Array(population.length).fill(0);
        const dominatedSolutions = Array(population.length).fill(null).map(() => []);

        // 지배 관계 계산
        for (let i = 0; i < population.length; i++) {
            for (let j = i + 1; j < population.length; j++) {
                const dominance = this.checkDominance(objectiveValues[i], objectiveValues[j]);

                if (dominance === 1) {
                    dominatedSolutions[i].push(j);
                    dominationCount[j]++;
                } else if (dominance === -1) {
                    dominatedSolutions[j].push(i);
                    dominationCount[i]++;
                }
            }
        }

        // 프론트 구성
        let currentFront = [];
        for (let i = 0; i < population.length; i++) {
            if (dominationCount[i] === 0) {
                currentFront.push(i);
            }
        }

        while (currentFront.length > 0) {
            fronts.push(currentFront.map(idx => population[idx]));
            const nextFront = [];

            for (const idx of currentFront) {
                for (const dominated of dominatedSolutions[idx]) {
                    dominationCount[dominated]--;
                    if (dominationCount[dominated] === 0) {
                        nextFront.push(dominated);
                    }
                }
            }

            currentFront = nextFront;
        }

        return fronts;
    }

    checkDominance(obj1, obj2) {
        let better = false;
        let worse = false;

        for (let i = 0; i < obj1.length; i++) {
            if (obj1[i] > obj2[i]) better = true;
            if (obj1[i] < obj2[i]) worse = true;
        }

        if (better && !worse) return 1;  // obj1 dominates obj2
        if (worse && !better) return -1; // obj2 dominates obj1
        return 0; // non-dominated
    }

    /**
     * 메트릭 계산
     */
    calculateMetrics() {
        return {
            convergenceRate: this.optimizationState.convergence ? 1 :
                this.optimizationState.currentIteration / this.hyperparameters.convergence.maxIterations,
            improvementRate: this.optimizationState.history.length > 1 ?
                (this.optimizationState.bestFitness - this.optimizationState.history[0]) /
                this.optimizationState.history[0] : 0,
            diversityMeasure: this.calculateDiversity(),
            computationalEfficiency: this.optimizationState.currentIteration > 0 ?
                this.optimizationState.bestFitness / this.optimizationState.currentIteration : 0
        };
    }

    calculateDiversity() {
        // 다양성 측정 (해밍 거리 기반)
        if (!this.optimizationState.bestSolution) return 0;

        let totalDistance = 0;
        let count = 0;

        // 샘플 솔루션들과의 거리 계산
        for (const solution of this.optimizationState.history.slice(-10)) {
            if (Array.isArray(solution)) {
                const distance = this.hammingDistance(this.optimizationState.bestSolution, solution);
                totalDistance += distance;
                count++;
            }
        }

        return count > 0 ? totalDistance / count / this.optimizationState.bestSolution.length : 0;
    }

    hammingDistance(arr1, arr2) {
        let distance = 0;
        for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
            if (arr1[i] !== arr2[i]) distance++;
        }
        return distance;
    }
}

export default OptimizationEngine;