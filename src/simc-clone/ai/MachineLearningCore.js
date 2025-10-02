/**
 * Machine Learning Core
 * AI 기반 시뮬레이션 최적화 시스템
 */

import { EventEmitter } from 'events';
import * as tf from '@tensorflow/tfjs';

export class MachineLearningCore extends EventEmitter {
    constructor() {
        super();

        this.models = new Map();
        this.trainingData = new Map();
        this.modelConfigs = this.initializeModelConfigs();
        this.hyperparameters = this.initializeHyperparameters();

        this.setupTensorFlow();
    }

    /**
     * TensorFlow 설정
     */
    async setupTensorFlow() {
        // GPU 가속 활성화
        await tf.setBackend('webgl');

        // 메모리 관리 설정
        tf.engine().startScope();

        this.emit('tensorflowReady', {
            backend: tf.getBackend(),
            memoryInfo: tf.memory()
        });
    }

    /**
     * 모델 설정 초기화
     */
    initializeModelConfigs() {
        return {
            // 로테이션 최적화 모델
            rotationOptimizer: {
                inputShape: [50], // 상태 벡터 크기
                layers: [
                    { type: 'dense', units: 128, activation: 'relu' },
                    { type: 'dropout', rate: 0.2 },
                    { type: 'dense', units: 64, activation: 'relu' },
                    { type: 'dropout', rate: 0.2 },
                    { type: 'dense', units: 32, activation: 'relu' },
                    { type: 'dense', units: 20, activation: 'softmax' } // 능력 선택
                ],
                optimizer: 'adam',
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            },

            // DPS 예측 모델
            dpsPredictor: {
                inputShape: [100], // 장비, 스탯, 버프 등
                layers: [
                    { type: 'dense', units: 256, activation: 'relu' },
                    { type: 'batchNormalization' },
                    { type: 'dense', units: 128, activation: 'relu' },
                    { type: 'dropout', rate: 0.3 },
                    { type: 'dense', units: 64, activation: 'relu' },
                    { type: 'dense', units: 1, activation: 'linear' } // DPS 값
                ],
                optimizer: 'adam',
                loss: 'meanSquaredError',
                metrics: ['meanAbsoluteError']
            },

            // 생존 예측 모델
            survivalPredictor: {
                inputShape: [80], // 보스 메커니즘, 플레이어 상태
                layers: [
                    { type: 'lstm', units: 64, returnSequences: true },
                    { type: 'lstm', units: 32 },
                    { type: 'dense', units: 16, activation: 'relu' },
                    { type: 'dense', units: 1, activation: 'sigmoid' } // 생존 확률
                ],
                optimizer: 'adam',
                loss: 'binaryCrossentropy',
                metrics: ['accuracy', 'precision', 'recall']
            },

            // 포지션 최적화 모델
            positionOptimizer: {
                inputShape: [120], // 맵 상태, 메커니즘, 플레이어 위치
                layers: [
                    { type: 'conv1d', filters: 32, kernelSize: 3, activation: 'relu' },
                    { type: 'maxPooling1d', poolSize: 2 },
                    { type: 'conv1d', filters: 64, kernelSize: 3, activation: 'relu' },
                    { type: 'flatten' },
                    { type: 'dense', units: 128, activation: 'relu' },
                    { type: 'dense', units: 2, activation: 'tanh' } // x, y 좌표
                ],
                optimizer: 'adam',
                loss: 'meanSquaredError',
                metrics: ['meanAbsoluteError']
            },

            // 리소스 관리 모델
            resourceManager: {
                inputShape: [40], // 리소스 상태, 쿨다운
                layers: [
                    { type: 'dense', units: 64, activation: 'relu' },
                    { type: 'dense', units: 32, activation: 'relu' },
                    { type: 'dense', units: 3, activation: 'softmax' } // 생성/소비/대기
                ],
                optimizer: 'adam',
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            },

            // 팀 시너지 모델
            teamSynergy: {
                inputShape: [200], // 팀 구성, 클래스, 스펙
                layers: [
                    { type: 'dense', units: 256, activation: 'relu' },
                    { type: 'attention', heads: 8 },
                    { type: 'dense', units: 128, activation: 'relu' },
                    { type: 'dense', units: 64, activation: 'relu' },
                    { type: 'dense', units: 25, activation: 'linear' } // 각 플레이어 기여도
                ],
                optimizer: 'adam',
                loss: 'meanSquaredError',
                metrics: ['meanAbsoluteError']
            }
        };
    }

    /**
     * 하이퍼파라미터 초기화
     */
    initializeHyperparameters() {
        return {
            training: {
                batchSize: 32,
                epochs: 100,
                validationSplit: 0.2,
                earlyStopping: {
                    patience: 10,
                    minDelta: 0.001,
                    restoreBestWeights: true
                },
                learningRate: 0.001,
                learningRateDecay: 0.96,
                clipGradients: true,
                clipValue: 1.0
            },

            augmentation: {
                noiseLevel: 0.1,
                rotationRange: 0.2,
                scalingRange: 0.1,
                mixupAlpha: 0.2
            },

            ensemble: {
                models: 5,
                votingType: 'soft', // 'hard' or 'soft'
                weights: 'uniform' // 'uniform' or 'adaptive'
            }
        };
    }

    /**
     * 모델 생성
     */
    createModel(configName) {
        const config = this.modelConfigs[configName];
        if (!config) {
            throw new Error(`Unknown model config: ${configName}`);
        }

        const model = tf.sequential();

        // 레이어 추가
        for (let i = 0; i < config.layers.length; i++) {
            const layer = config.layers[i];
            const isFirstLayer = i === 0;

            switch (layer.type) {
                case 'dense':
                    model.add(tf.layers.dense({
                        units: layer.units,
                        activation: layer.activation,
                        inputShape: isFirstLayer ? config.inputShape : undefined
                    }));
                    break;

                case 'dropout':
                    model.add(tf.layers.dropout({
                        rate: layer.rate
                    }));
                    break;

                case 'batchNormalization':
                    model.add(tf.layers.batchNormalization());
                    break;

                case 'lstm':
                    model.add(tf.layers.lstm({
                        units: layer.units,
                        returnSequences: layer.returnSequences || false,
                        inputShape: isFirstLayer ? config.inputShape : undefined
                    }));
                    break;

                case 'conv1d':
                    model.add(tf.layers.conv1d({
                        filters: layer.filters,
                        kernelSize: layer.kernelSize,
                        activation: layer.activation,
                        inputShape: isFirstLayer ? config.inputShape : undefined
                    }));
                    break;

                case 'maxPooling1d':
                    model.add(tf.layers.maxPooling1d({
                        poolSize: layer.poolSize
                    }));
                    break;

                case 'flatten':
                    model.add(tf.layers.flatten());
                    break;

                case 'attention':
                    // 간단한 어텐션 메커니즘
                    model.add(tf.layers.multiHeadAttention({
                        numHeads: layer.heads,
                        keyDim: 32
                    }));
                    break;
            }
        }

        // 컴파일
        const optimizer = this.createOptimizer(config.optimizer);

        model.compile({
            optimizer,
            loss: config.loss,
            metrics: config.metrics
        });

        this.models.set(configName, model);

        this.emit('modelCreated', {
            name: configName,
            parameters: model.countParams()
        });

        return model;
    }

    /**
     * 옵티마이저 생성
     */
    createOptimizer(type) {
        const lr = this.hyperparameters.training.learningRate;

        switch (type) {
            case 'adam':
                return tf.train.adam(lr, 0.9, 0.999, 1e-7);
            case 'sgd':
                return tf.train.sgd(lr);
            case 'rmsprop':
                return tf.train.rmsprop(lr, 0.95);
            case 'adamax':
                return tf.train.adamax(lr, 0.9, 0.999, 1e-7);
            default:
                return tf.train.adam(lr);
        }
    }

    /**
     * 데이터 전처리
     */
    preprocessData(data, type) {
        return tf.tidy(() => {
            let tensor = tf.tensor(data);

            // 정규화
            if (type === 'normalize') {
                const { mean, variance } = tf.moments(tensor, 0);
                tensor = tensor.sub(mean).div(tf.sqrt(variance.add(1e-7)));
            }

            // 표준화
            if (type === 'standardize') {
                const min = tensor.min();
                const max = tensor.max();
                tensor = tensor.sub(min).div(max.sub(min).add(1e-7));
            }

            // 노이즈 추가 (데이터 증강)
            if (this.hyperparameters.augmentation.noiseLevel > 0) {
                const noise = tf.randomNormal(tensor.shape, 0, this.hyperparameters.augmentation.noiseLevel);
                tensor = tensor.add(noise);
            }

            return tensor;
        });
    }

    /**
     * 모델 학습
     */
    async trainModel(modelName, trainingData, validationData = null) {
        const model = this.models.get(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }

        const config = this.modelConfigs[modelName];
        const hp = this.hyperparameters.training;

        // 데이터 준비
        const xs = this.preprocessData(trainingData.inputs, 'normalize');
        const ys = tf.tensor(trainingData.outputs);

        // 검증 데이터
        let valXs = null, valYs = null;
        if (validationData) {
            valXs = this.preprocessData(validationData.inputs, 'normalize');
            valYs = tf.tensor(validationData.outputs);
        }

        // 콜백 설정
        const callbacks = {
            onEpochEnd: (epoch, logs) => {
                this.emit('trainingProgress', {
                    model: modelName,
                    epoch,
                    loss: logs.loss,
                    metrics: logs
                });

                // 학습률 감소
                if (epoch > 0 && epoch % 10 === 0) {
                    const currentLr = model.optimizer.learningRate;
                    model.optimizer.learningRate = currentLr * hp.learningRateDecay;
                }
            },

            onBatchEnd: (batch, logs) => {
                if (batch % 10 === 0) {
                    this.emit('batchComplete', {
                        model: modelName,
                        batch,
                        loss: logs.loss
                    });
                }
            }
        };

        // Early Stopping
        const earlyStoppingCallback = tf.callbacks.earlyStopping({
            monitor: validationData ? 'val_loss' : 'loss',
            patience: hp.earlyStopping.patience,
            minDelta: hp.earlyStopping.minDelta,
            restoreBestWeights: hp.earlyStopping.restoreBestWeights
        });

        // 학습 실행
        const history = await model.fit(xs, ys, {
            batchSize: hp.batchSize,
            epochs: hp.epochs,
            validationData: validationData ? [valXs, valYs] : undefined,
            validationSplit: validationData ? 0 : hp.validationSplit,
            callbacks: [callbacks, earlyStoppingCallback],
            shuffle: true,
            verbose: 0
        });

        // 메모리 정리
        xs.dispose();
        ys.dispose();
        if (valXs) valXs.dispose();
        if (valYs) valYs.dispose();

        // 학습 결과 저장
        this.saveTrainingHistory(modelName, history);

        return history;
    }

    /**
     * 예측 수행
     */
    async predict(modelName, input) {
        const model = this.models.get(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }

        return tf.tidy(() => {
            const inputTensor = this.preprocessData([input], 'normalize');
            const prediction = model.predict(inputTensor);
            return prediction.dataSync();
        });
    }

    /**
     * 배치 예측
     */
    async predictBatch(modelName, inputs) {
        const model = this.models.get(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }

        return tf.tidy(() => {
            const inputTensor = this.preprocessData(inputs, 'normalize');
            const predictions = model.predict(inputTensor);
            return predictions.arraySync();
        });
    }

    /**
     * 앙상블 예측
     */
    async ensemblePredict(modelNames, input) {
        const predictions = [];

        for (const modelName of modelNames) {
            const pred = await this.predict(modelName, input);
            predictions.push(pred);
        }

        // 평균 또는 투표
        if (this.hyperparameters.ensemble.votingType === 'soft') {
            // Soft voting (평균)
            const averaged = predictions[0].map((_, i) => {
                const sum = predictions.reduce((acc, pred) => acc + pred[i], 0);
                return sum / predictions.length;
            });
            return averaged;
        } else {
            // Hard voting (다수결)
            const votes = predictions[0].map((_, i) => {
                const values = predictions.map(pred => pred[i]);
                return this.mode(values);
            });
            return votes;
        }
    }

    /**
     * 전이 학습
     */
    async transferLearning(sourceModel, targetConfig, freezeLayers = 3) {
        const source = this.models.get(sourceModel);
        if (!source) {
            throw new Error(`Source model ${sourceModel} not found`);
        }

        // 새 모델 생성
        const targetModel = tf.sequential();

        // 소스 모델의 레이어 복사
        const layers = source.layers;
        for (let i = 0; i < layers.length - 1; i++) {
            const layer = layers[i];

            // 레이어 복사
            targetModel.add(layer);

            // 초기 레이어 동결
            if (i < freezeLayers) {
                layer.trainable = false;
            }
        }

        // 새로운 출력 레이어 추가
        const config = this.modelConfigs[targetConfig];
        const outputLayer = config.layers[config.layers.length - 1];

        targetModel.add(tf.layers.dense({
            units: outputLayer.units,
            activation: outputLayer.activation
        }));

        // 컴파일
        targetModel.compile({
            optimizer: this.createOptimizer(config.optimizer),
            loss: config.loss,
            metrics: config.metrics
        });

        return targetModel;
    }

    /**
     * 모델 평가
     */
    async evaluateModel(modelName, testData) {
        const model = this.models.get(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }

        const xs = this.preprocessData(testData.inputs, 'normalize');
        const ys = tf.tensor(testData.outputs);

        const evaluation = await model.evaluate(xs, ys);
        const metrics = {};

        // 메트릭 추출
        for (let i = 0; i < model.metricsNames.length; i++) {
            metrics[model.metricsNames[i]] = await evaluation[i].data();
        }

        xs.dispose();
        ys.dispose();
        evaluation.forEach(tensor => tensor.dispose());

        return metrics;
    }

    /**
     * 교차 검증
     */
    async crossValidation(modelName, data, folds = 5) {
        const results = [];
        const foldSize = Math.floor(data.inputs.length / folds);

        for (let i = 0; i < folds; i++) {
            // 폴드 분할
            const valStart = i * foldSize;
            const valEnd = valStart + foldSize;

            const valData = {
                inputs: data.inputs.slice(valStart, valEnd),
                outputs: data.outputs.slice(valStart, valEnd)
            };

            const trainData = {
                inputs: [
                    ...data.inputs.slice(0, valStart),
                    ...data.inputs.slice(valEnd)
                ],
                outputs: [
                    ...data.outputs.slice(0, valStart),
                    ...data.outputs.slice(valEnd)
                ]
            };

            // 모델 생성 및 학습
            const model = this.createModel(modelName);
            await this.trainModel(modelName, trainData, valData);

            // 평가
            const metrics = await this.evaluateModel(modelName, valData);
            results.push(metrics);
        }

        // 평균 성능 계산
        const avgMetrics = {};
        const metricNames = Object.keys(results[0]);

        for (const metric of metricNames) {
            const values = results.map(r => r[metric][0]);
            avgMetrics[metric] = {
                mean: values.reduce((a, b) => a + b, 0) / values.length,
                std: Math.sqrt(values.reduce((a, b) => a + Math.pow(b - avgMetrics[metric]?.mean || 0, 2), 0) / values.length)
            };
        }

        return avgMetrics;
    }

    /**
     * 특성 중요도 분석
     */
    async analyzeFeatureImportance(modelName, data, featureNames) {
        const model = this.models.get(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }

        const importance = [];
        const baseline = await this.predict(modelName, data.inputs[0]);

        for (let i = 0; i < featureNames.length; i++) {
            // 특성 제거
            const modified = [...data.inputs[0]];
            modified[i] = 0; // 또는 평균값

            const prediction = await this.predict(modelName, modified);
            const diff = Math.abs(baseline[0] - prediction[0]);

            importance.push({
                feature: featureNames[i],
                importance: diff,
                rank: 0
            });
        }

        // 순위 매기기
        importance.sort((a, b) => b.importance - a.importance);
        importance.forEach((item, index) => {
            item.rank = index + 1;
        });

        return importance;
    }

    /**
     * 모델 저장
     */
    async saveModel(modelName, path = null) {
        const model = this.models.get(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }

        const savePath = path || `localstorage://model-${modelName}`;
        await model.save(savePath);

        this.emit('modelSaved', {
            name: modelName,
            path: savePath
        });

        return savePath;
    }

    /**
     * 모델 로드
     */
    async loadModel(modelName, path = null) {
        const loadPath = path || `localstorage://model-${modelName}`;

        try {
            const model = await tf.loadLayersModel(loadPath);
            this.models.set(modelName, model);

            this.emit('modelLoaded', {
                name: modelName,
                path: loadPath
            });

            return model;
        } catch (error) {
            this.emit('modelLoadError', {
                name: modelName,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * 학습 히스토리 저장
     */
    saveTrainingHistory(modelName, history) {
        if (!this.trainingData.has(modelName)) {
            this.trainingData.set(modelName, []);
        }

        this.trainingData.get(modelName).push({
            timestamp: Date.now(),
            history: history.history,
            params: history.params
        });
    }

    /**
     * 메트릭 시각화 데이터
     */
    getVisualizationData(modelName) {
        const history = this.trainingData.get(modelName);
        if (!history || history.length === 0) {
            return null;
        }

        const latestHistory = history[history.length - 1];

        return {
            loss: latestHistory.history.loss,
            valLoss: latestHistory.history.val_loss || [],
            metrics: Object.keys(latestHistory.history)
                .filter(key => key !== 'loss' && key !== 'val_loss')
                .reduce((acc, key) => {
                    acc[key] = latestHistory.history[key];
                    return acc;
                }, {})
        };
    }

    /**
     * 메모리 정리
     */
    cleanupMemory() {
        tf.engine().endScope();
        tf.disposeVariables();

        const memInfo = tf.memory();

        this.emit('memoryCleanup', {
            numTensors: memInfo.numTensors,
            numBytes: memInfo.numBytes
        });

        // 새 스코프 시작
        tf.engine().startScope();
    }

    /**
     * 모드 계산 (최빈값)
     */
    mode(array) {
        const frequency = {};
        let maxFreq = 0;
        let mode = array[0];

        for (const value of array) {
            frequency[value] = (frequency[value] || 0) + 1;
            if (frequency[value] > maxFreq) {
                maxFreq = frequency[value];
                mode = value;
            }
        }

        return mode;
    }

    /**
     * 모델 성능 벤치마크
     */
    async benchmark(modelName, testSize = 1000) {
        const model = this.models.get(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }

        const config = this.modelConfigs[modelName];
        const inputShape = config.inputShape;

        // 테스트 데이터 생성
        const testInput = tf.randomNormal([testSize, ...inputShape]);

        const startTime = performance.now();

        // 예측 수행
        const predictions = model.predict(testInput);

        const endTime = performance.now();
        const inferenceTime = endTime - startTime;

        // 처리량 계산
        const throughput = (testSize / inferenceTime) * 1000; // predictions per second

        testInput.dispose();
        predictions.dispose();

        return {
            modelName,
            testSize,
            inferenceTime: `${inferenceTime.toFixed(2)}ms`,
            throughput: `${throughput.toFixed(0)} predictions/sec`,
            latency: `${(inferenceTime / testSize).toFixed(2)}ms per prediction`
        };
    }
}

export default MachineLearningCore;