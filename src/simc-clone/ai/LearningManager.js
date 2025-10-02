/**
 * Learning Manager
 * AI 학습 관리 및 조율 시스템
 */

import { EventEmitter } from 'events';
import { MachineLearningCore } from './MachineLearningCore';
import { NeuralNetwork } from './NeuralNetwork';
import { OptimizationEngine } from './OptimizationEngine';
import { PredictionSystem } from './PredictionSystem';

export class LearningManager extends EventEmitter {
    constructor() {
        super();

        // AI 컴포넌트 초기화
        this.mlCore = new MachineLearningCore();
        this.neuralNetwork = new NeuralNetwork();
        this.optimizer = new OptimizationEngine();
        this.predictor = new PredictionSystem();

        // 학습 데이터 관리
        this.trainingData = new Map();
        this.validationData = new Map();
        this.testData = new Map();

        // 학습 세션 관리
        this.sessions = new Map();
        this.activeSession = null;

        // 학습 설정
        this.config = this.initializeConfig();
        this.schedule = this.initializeSchedule();

        // 메트릭 추적
        this.metrics = this.initializeMetrics();

        this.setupEventHandlers();
    }

    /**
     * 설정 초기화
     */
    initializeConfig() {
        return {
            autoTraining: {
                enabled: true,
                interval: 60 * 60 * 1000, // 1시간마다
                minDataPoints: 1000,
                maxTrainingTime: 5 * 60 * 1000, // 5분
                convergenceThreshold: 0.001
            },

            dataManagement: {
                maxDataAge: 7 * 24 * 60 * 60 * 1000, // 7일
                dataSplitRatio: { train: 0.7, validation: 0.15, test: 0.15 },
                augmentationEnabled: true,
                balancingStrategy: 'smote' // Synthetic Minority Over-sampling
            },

            modelManagement: {
                maxModelsStored: 10,
                versionControl: true,
                autoBackup: true,
                compressionEnabled: true
            },

            performanceOptimization: {
                parallelTraining: true,
                batchOptimization: true,
                memoryLimit: 2 * 1024 * 1024 * 1024, // 2GB
                gpuAcceleration: true
            },

            monitoring: {
                realTimeMetrics: true,
                alertThresholds: {
                    accuracy: 0.7,
                    loss: 0.5,
                    overfitting: 0.1
                },
                loggingLevel: 'info'
            }
        };
    }

    /**
     * 학습 스케줄 초기화
     */
    initializeSchedule() {
        return {
            daily: {
                tasks: [
                    { name: 'dpsOptimization', time: '02:00', priority: 'high' },
                    { name: 'rotationLearning', time: '03:00', priority: 'medium' },
                    { name: 'gearOptimization', time: '04:00', priority: 'low' }
                ]
            },
            weekly: {
                tasks: [
                    { name: 'fullSystemTraining', day: 'sunday', time: '01:00', priority: 'high' },
                    { name: 'modelEvaluation', day: 'wednesday', time: '01:00', priority: 'medium' }
                ]
            },
            triggered: {
                newPatch: ['completeRetraining', 'metaAnalysis'],
                newData: ['incrementalLearning', 'validation'],
                performanceDrop: ['diagnostics', 'retraining']
            }
        };
    }

    /**
     * 메트릭 초기화
     */
    initializeMetrics() {
        return {
            training: {
                sessionsCompleted: 0,
                totalTrainingTime: 0,
                averageAccuracy: 0,
                bestAccuracy: 0,
                worstAccuracy: 1
            },
            models: {
                totalTrained: 0,
                activeModels: 0,
                deprecatedModels: 0,
                averageSize: 0
            },
            predictions: {
                totalPredictions: 0,
                accuratePredicttions: 0,
                averageConfidence: 0,
                responseTime: []
            },
            optimization: {
                improvementsFound: 0,
                averageImprovement: 0,
                optimizationTime: 0
            }
        };
    }

    /**
     * 이벤트 핸들러 설정
     */
    setupEventHandlers() {
        // ML Core 이벤트
        this.mlCore.on('modelCreated', (data) => this.handleModelCreated(data));
        this.mlCore.on('trainingComplete', (data) => this.handleTrainingComplete(data));

        // Neural Network 이벤트
        this.neuralNetwork.on('epochEnd', (data) => this.handleEpochEnd(data));
        this.neuralNetwork.on('checkpointSaved', (data) => this.handleCheckpointSaved(data));

        // Optimization Engine 이벤트
        this.optimizer.on('optimizationComplete', (data) => this.handleOptimizationComplete(data));

        // Prediction System 이벤트
        this.predictor.on('predictionMade', (data) => this.updatePredictionMetrics(data));
    }

    /**
     * 학습 세션 시작
     */
    async startTrainingSession(type, config = {}) {
        const sessionId = this.generateSessionId();

        const session = {
            id: sessionId,
            type,
            config: { ...this.config, ...config },
            startTime: Date.now(),
            status: 'initializing',
            models: [],
            metrics: {},
            errors: []
        };

        this.sessions.set(sessionId, session);
        this.activeSession = sessionId;

        this.emit('sessionStarted', { sessionId, type });

        try {
            // 데이터 준비
            await this.prepareTrainingData(type);

            // 모델 초기화
            const models = await this.initializeModels(type);
            session.models = models;

            // 학습 실행
            session.status = 'training';
            const results = await this.runTraining(models, type);

            // 평가
            session.status = 'evaluating';
            const evaluation = await this.evaluateModels(models);

            // 최적화
            session.status = 'optimizing';
            const optimization = await this.optimizeModels(models);

            // 완료
            session.status = 'completed';
            session.endTime = Date.now();
            session.results = { results, evaluation, optimization };

            this.emit('sessionCompleted', {
                sessionId,
                duration: session.endTime - session.startTime,
                results: session.results
            });

            return session;

        } catch (error) {
            session.status = 'failed';
            session.errors.push(error);

            this.emit('sessionFailed', {
                sessionId,
                error: error.message
            });

            throw error;
        } finally {
            this.activeSession = null;
        }
    }

    /**
     * DPS 최적화 학습
     */
    async trainDPSOptimization(playerData, config = {}) {
        const sessionId = await this.startTrainingSession('dpsOptimization', config);

        // 데이터 준비
        const trainingData = this.prepareDPSData(playerData);

        // 모델 학습
        const model = await this.mlCore.createModel('dpsPredictor');
        const history = await this.mlCore.trainModel('dpsPredictor', trainingData);

        // 최적화 실행
        const optimizationResults = await this.optimizer.optimizeDPS(
            playerData.player,
            { algorithm: 'genetic' }
        );

        // 예측 검증
        const predictions = await this.predictor.predictDPS(
            playerData.player,
            playerData.encounter
        );

        const results = {
            model: 'dpsPredictor',
            accuracy: history.history.acc[history.history.acc.length - 1],
            optimization: optimizationResults,
            predictions
        };

        this.updateSession(sessionId, { results });

        return results;
    }

    /**
     * 로테이션 학습
     */
    async trainRotationOptimization(specData, config = {}) {
        const sessionId = await this.startTrainingSession('rotationOptimization', config);

        // 신경망 생성
        const network = await this.neuralNetwork.createSequentialModel(
            this.neuralNetwork.architectures.rotationOptimizer
        );

        // 학습 데이터 생성
        const trainingData = await this.generateRotationData(specData);

        // 학습 실행
        const history = await this.neuralNetwork.train(
            'rotationOptimizer',
            trainingData.train,
            trainingData.valid,
            {
                epochs: 100,
                batchSize: 32,
                earlyStopping: {
                    patience: 10,
                    minDelta: 0.001
                }
            }
        );

        // 최적 로테이션 탐색
        const optimalRotation = await this.optimizer.optimizeRotation(
            specData.specialization,
            specData.encounter,
            { algorithm: 'pso' }
        );

        const results = {
            model: 'rotationOptimizer',
            trainingHistory: history,
            optimalRotation,
            improvements: this.calculateRotationImprovement(specData, optimalRotation)
        };

        this.updateSession(sessionId, { results });

        return results;
    }

    /**
     * 팀 구성 학습
     */
    async trainTeamComposition(raidData, config = {}) {
        const sessionId = await this.startTrainingSession('teamComposition', config);

        // 다목적 최적화
        const optimizationResults = await this.optimizer.optimizeTeamComposition(
            raidData.availablePlayers,
            raidData.encounterType,
            { algorithm: 'nsga2' }
        );

        // 예측 모델 학습
        const predictions = await this.predictor.predictEncounterSuccess(
            optimizationResults.composition,
            raidData.encounter
        );

        // 시너지 분석
        const synergyAnalysis = await this.analyzeSynergies(optimizationResults.composition);

        const results = {
            optimalComposition: optimizationResults.composition,
            successProbability: predictions.successProbability,
            synergies: synergyAnalysis,
            alternatives: optimizationResults.alternatives
        };

        this.updateSession(sessionId, { results });

        return results;
    }

    /**
     * 전체 시스템 학습
     */
    async trainFullSystem(config = {}) {
        const sessionId = await this.startTrainingSession('fullSystem', config);

        const tasks = [
            this.trainAllDPSModels(),
            this.trainAllRotationModels(),
            this.trainAllPredictionModels(),
            this.trainAllOptimizationModels()
        ];

        const results = await Promise.all(tasks);

        // 모델 통합
        const integratedModel = await this.integrateModels(results);

        // 시스템 평가
        const systemEvaluation = await this.evaluateFullSystem(integratedModel);

        const finalResults = {
            models: results,
            integrated: integratedModel,
            evaluation: systemEvaluation,
            recommendations: this.generateSystemRecommendations(systemEvaluation)
        };

        this.updateSession(sessionId, { results: finalResults });

        return finalResults;
    }

    /**
     * 증분 학습
     */
    async incrementalLearning(newData, modelName, config = {}) {
        // 기존 모델 로드
        const model = await this.loadModel(modelName);

        // 새 데이터 전처리
        const processedData = await this.preprocessData(newData);

        // 증분 학습 실행
        const history = await model.fit(
            processedData.x,
            processedData.y,
            {
                epochs: config.epochs || 10,
                batchSize: config.batchSize || 32,
                verbose: 0
            }
        );

        // 모델 저장
        await this.saveModel(modelName, model);

        // 성능 비교
        const comparison = await this.compareModelPerformance(modelName, model);

        this.emit('incrementalLearningComplete', {
            modelName,
            dataPoints: newData.length,
            improvement: comparison.improvement
        });

        return {
            history,
            comparison
        };
    }

    /**
     * 전이 학습
     */
    async transferLearning(sourceModel, targetDomain, config = {}) {
        // 소스 모델에서 전이
        const transferredModel = await this.mlCore.transferLearning(
            sourceModel,
            targetDomain,
            config.freezeLayers || 3
        );

        // 타겟 도메인 데이터로 미세 조정
        const targetData = await this.getTargetDomainData(targetDomain);

        const history = await transferredModel.fit(
            targetData.x,
            targetData.y,
            {
                epochs: config.epochs || 50,
                batchSize: config.batchSize || 16,
                validationSplit: 0.2
            }
        );

        // 성능 평가
        const evaluation = await this.evaluateTransferLearning(
            transferredModel,
            targetData.test
        );

        return {
            model: transferredModel,
            history,
            evaluation,
            sourcePerformance: evaluation.sourceMetrics,
            targetPerformance: evaluation.targetMetrics
        };
    }

    /**
     * 자동 학습
     */
    async autoTrain() {
        if (!this.config.autoTraining.enabled) {
            return;
        }

        const dataAvailable = await this.checkDataAvailability();

        if (dataAvailable < this.config.autoTraining.minDataPoints) {
            this.emit('autoTrainingSkipped', {
                reason: 'Insufficient data',
                available: dataAvailable,
                required: this.config.autoTraining.minDataPoints
            });
            return;
        }

        const tasks = [];

        // 스케줄된 작업 확인
        const scheduledTasks = this.getScheduledTasks();

        for (const task of scheduledTasks) {
            tasks.push(this.executeScheduledTask(task));
        }

        // 트리거된 작업 확인
        const triggeredTasks = this.getTriggeredTasks();

        for (const task of triggeredTasks) {
            tasks.push(this.executeTriggeredTask(task));
        }

        const results = await Promise.all(tasks);

        this.emit('autoTrainingComplete', {
            tasksCompleted: results.length,
            results
        });

        return results;
    }

    /**
     * 모델 평가
     */
    async evaluateModels(models) {
        const evaluations = [];

        for (const model of models) {
            const testData = this.testData.get(model.name);

            if (!testData) {
                continue;
            }

            const metrics = await this.mlCore.evaluateModel(model.name, testData);

            // 교차 검증
            const cvResults = await this.mlCore.crossValidation(
                model.name,
                testData,
                5 // 5-fold
            );

            evaluations.push({
                model: model.name,
                metrics,
                crossValidation: cvResults,
                overfitting: this.detectOverfitting(metrics, cvResults)
            });
        }

        return evaluations;
    }

    /**
     * 모델 최적화
     */
    async optimizeModels(models) {
        const optimizations = [];

        for (const model of models) {
            // 하이퍼파라미터 최적화
            const hyperparams = await this.optimizeHyperparameters(model);

            // 구조 최적화
            const structure = await this.optimizeModelStructure(model);

            // 가지치기
            const pruned = await this.pruneModel(model);

            optimizations.push({
                model: model.name,
                hyperparameters: hyperparams,
                structure,
                pruning: pruned,
                sizeReduction: pruned.reduction,
                speedup: pruned.speedup
            });
        }

        return optimizations;
    }

    /**
     * 하이퍼파라미터 최적화
     */
    async optimizeHyperparameters(model) {
        const searchSpace = {
            learningRate: [0.0001, 0.001, 0.01, 0.1],
            batchSize: [16, 32, 64, 128],
            dropout: [0.1, 0.2, 0.3, 0.4],
            hiddenUnits: [32, 64, 128, 256]
        };

        const results = await this.optimizer.bayesianOptimization(
            async (params) => {
                // 파라미터로 모델 학습하고 검증 성능 반환
                const tempModel = await this.createModelWithParams(model, params);
                const performance = await this.evaluateModel(tempModel);
                return performance.accuracy;
            },
            searchSpace,
            { iterations: 50 }
        );

        return results.optimalPoint;
    }

    /**
     * 모델 구조 최적화
     */
    async optimizeModelStructure(model) {
        // NAS (Neural Architecture Search) 간단한 구현
        const architectures = this.generateArchitectures();
        const performances = [];

        for (const arch of architectures) {
            const tempModel = await this.buildArchitecture(arch);
            const performance = await this.quickEvaluation(tempModel);
            performances.push({ architecture: arch, performance });
        }

        performances.sort((a, b) => b.performance - a.performance);

        return performances[0];
    }

    /**
     * 모델 가지치기
     */
    async pruneModel(model) {
        const originalSize = await this.getModelSize(model);
        const originalSpeed = await this.benchmarkModel(model);

        // 중요도가 낮은 가중치 제거
        const prunedModel = await this.applyPruning(model, 0.1); // 10% 가지치기

        const newSize = await this.getModelSize(prunedModel);
        const newSpeed = await this.benchmarkModel(prunedModel);

        // 미세 조정
        await this.fineTune(prunedModel);

        return {
            model: prunedModel,
            reduction: (originalSize - newSize) / originalSize,
            speedup: newSpeed / originalSpeed
        };
    }

    /**
     * 데이터 준비
     */
    async prepareTrainingData(type) {
        // 원시 데이터 수집
        const rawData = await this.collectRawData(type);

        // 전처리
        const processed = await this.preprocessData(rawData);

        // 증강
        const augmented = this.config.dataManagement.augmentationEnabled ?
            await this.augmentData(processed) : processed;

        // 데이터 분할
        const split = this.splitData(augmented);

        this.trainingData.set(type, split.train);
        this.validationData.set(type, split.validation);
        this.testData.set(type, split.test);

        return split;
    }

    /**
     * 데이터 증강
     */
    async augmentData(data) {
        const augmented = [...data];

        // 노이즈 추가
        const noisy = data.map(sample => this.addNoise(sample, 0.1));
        augmented.push(...noisy);

        // 혼합 (Mixup)
        const mixed = this.mixupAugmentation(data, 0.2);
        augmented.push(...mixed);

        // SMOTE (합성 소수 오버샘플링)
        if (this.config.dataManagement.balancingStrategy === 'smote') {
            const synthetic = await this.generateSyntheticSamples(data);
            augmented.push(...synthetic);
        }

        return augmented;
    }

    /**
     * 메트릭 업데이트
     */
    updateMetrics(category, metric, value) {
        if (this.metrics[category] && this.metrics[category][metric] !== undefined) {
            if (typeof this.metrics[category][metric] === 'number') {
                this.metrics[category][metric] = value;
            } else if (Array.isArray(this.metrics[category][metric])) {
                this.metrics[category][metric].push(value);
                // 최근 100개만 유지
                if (this.metrics[category][metric].length > 100) {
                    this.metrics[category][metric].shift();
                }
            }
        }

        this.emit('metricsUpdated', {
            category,
            metric,
            value
        });
    }

    /**
     * 세션 업데이트
     */
    updateSession(sessionId, updates) {
        const session = this.sessions.get(sessionId);
        if (session) {
            Object.assign(session, updates);
            this.sessions.set(sessionId, session);
        }
    }

    /**
     * 모델 저장 및 버전 관리
     */
    async saveModel(modelName, model) {
        const version = this.generateVersion();
        const path = `models/${modelName}_v${version}`;

        await model.save(path);

        // 메타데이터 저장
        const metadata = {
            name: modelName,
            version,
            timestamp: Date.now(),
            metrics: await this.getModelMetrics(model),
            size: await this.getModelSize(model)
        };

        await this.saveMetadata(path, metadata);

        // 버전 관리
        if (this.config.modelManagement.versionControl) {
            await this.addToVersionControl(modelName, version, metadata);
        }

        // 백업
        if (this.config.modelManagement.autoBackup) {
            await this.backupModel(path);
        }

        return { path, version, metadata };
    }

    /**
     * 모델 로드
     */
    async loadModel(modelName, version = 'latest') {
        const path = version === 'latest' ?
            await this.getLatestModelPath(modelName) :
            `models/${modelName}_v${version}`;

        const model = await tf.loadLayersModel(path);

        // 메타데이터 로드
        const metadata = await this.loadMetadata(path);

        return { model, metadata };
    }

    /**
     * 시스템 진단
     */
    async runDiagnostics() {
        const diagnostics = {
            models: await this.diagnoseModels(),
            data: await this.diagnoseData(),
            performance: await this.diagnosePerformance(),
            memory: this.diagnoseMemory(),
            recommendations: []
        };

        // 문제 감지 및 권장 사항 생성
        if (diagnostics.models.accuracy < 0.7) {
            diagnostics.recommendations.push('Retrain models with more data');
        }

        if (diagnostics.memory.usage > 0.8) {
            diagnostics.recommendations.push('Clear cache and old models');
        }

        if (diagnostics.performance.latency > 1000) {
            diagnostics.recommendations.push('Optimize model structure');
        }

        this.emit('diagnosticsComplete', diagnostics);

        return diagnostics;
    }

    /**
     * 헬퍼 함수들
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateVersion() {
        const date = new Date();
        return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
    }

    detectOverfitting(trainMetrics, valMetrics) {
        const trainAccuracy = trainMetrics.accuracy || 0;
        const valAccuracy = valMetrics.mean || 0;
        const difference = trainAccuracy - valAccuracy;

        return {
            detected: difference > this.config.monitoring.alertThresholds.overfitting,
            severity: difference,
            recommendation: difference > 0.2 ? 'severe' : difference > 0.1 ? 'moderate' : 'mild'
        };
    }

    getScheduledTasks() {
        const now = new Date();
        const tasks = [];

        // Daily tasks
        for (const task of this.schedule.daily.tasks) {
            const [hour, minute] = task.time.split(':').map(Number);
            if (now.getHours() === hour && now.getMinutes() < minute + 5) {
                tasks.push(task);
            }
        }

        // Weekly tasks
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = dayNames[now.getDay()];

        for (const task of this.schedule.weekly.tasks) {
            if (task.day === currentDay) {
                const [hour, minute] = task.time.split(':').map(Number);
                if (now.getHours() === hour && now.getMinutes() < minute + 5) {
                    tasks.push(task);
                }
            }
        }

        return tasks;
    }

    getTriggeredTasks() {
        const triggers = [];

        // Check for triggers
        if (this.checkNewPatch()) {
            triggers.push(...this.schedule.triggered.newPatch);
        }

        if (this.checkNewData()) {
            triggers.push(...this.schedule.triggered.newData);
        }

        if (this.checkPerformanceDrop()) {
            triggers.push(...this.schedule.triggered.performanceDrop);
        }

        return triggers.map(name => ({ name, priority: 'high' }));
    }

    splitData(data) {
        const { train, validation, test } = this.config.dataManagement.dataSplitRatio;
        const totalSize = data.length;

        const trainSize = Math.floor(totalSize * train);
        const valSize = Math.floor(totalSize * validation);

        return {
            train: data.slice(0, trainSize),
            validation: data.slice(trainSize, trainSize + valSize),
            test: data.slice(trainSize + valSize)
        };
    }

    calculateRotationImprovement(original, optimized) {
        return {
            dpsIncrease: optimized.dps - original.dps,
            percentImprovement: ((optimized.dps - original.dps) / original.dps * 100).toFixed(2),
            complexityReduction: original.rotation.length - optimized.rotation.length,
            resourceEfficiency: this.calculateResourceEfficiency(optimized.rotation) -
                this.calculateResourceEfficiency(original.rotation)
        };
    }

    calculateResourceEfficiency(rotation) {
        const totalResources = rotation.reduce((sum, action) => sum + (action.resourceCost || 0), 0);
        const totalDamage = rotation.reduce((sum, action) => sum + (action.damage || 0), 0);
        return totalDamage / (totalResources || 1);
    }

    /**
     * 시스템 상태 리포트
     */
    generateStatusReport() {
        return {
            system: {
                uptime: Date.now() - this.startTime,
                activeModels: this.predictors.size,
                activeSessions: this.sessions.size,
                memoryUsage: process.memoryUsage()
            },
            metrics: this.metrics,
            recentSessions: Array.from(this.sessions.values()).slice(-10),
            performance: {
                averageTrainingTime: this.metrics.training.totalTrainingTime / this.metrics.training.sessionsCompleted,
                averagePredictionTime: this.metrics.predictions.responseTime.reduce((a, b) => a + b, 0) /
                    this.metrics.predictions.responseTime.length,
                modelAccuracy: this.metrics.training.averageAccuracy
            },
            recommendations: this.generateRecommendations()
        };
    }

    generateRecommendations() {
        const recommendations = [];

        if (this.metrics.training.averageAccuracy < 0.8) {
            recommendations.push('Consider collecting more training data');
        }

        if (this.metrics.predictions.averageConfidence < 0.7) {
            recommendations.push('Models may need retraining with recent data');
        }

        if (this.sessions.size > 100) {
            recommendations.push('Clean up old sessions to free memory');
        }

        return recommendations;
    }
}

export default LearningManager;