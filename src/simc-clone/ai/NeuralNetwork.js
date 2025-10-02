/**
 * Neural Network Implementation
 * 심층 신경망 아키텍처 구현
 */

import { EventEmitter } from 'events';
import * as tf from '@tensorflow/tfjs';

export class NeuralNetwork extends EventEmitter {
    constructor() {
        super();

        this.networks = new Map();
        this.architectures = this.initializeArchitectures();
        this.optimizers = new Map();
        this.activations = this.initializeActivations();

        this.trainingState = {
            isTraining: false,
            currentEpoch: 0,
            totalEpochs: 0,
            currentLoss: null,
            bestLoss: Infinity
        };

        this.setupDeepLearning();
    }

    /**
     * 딥러닝 환경 설정
     */
    async setupDeepLearning() {
        // WebGL 백엔드 최적화
        await tf.setBackend('webgl');
        tf.env().set('WEBGL_FORCE_F16_TEXTURES', true);
        tf.env().set('WEBGL_PACK', true);

        // 메모리 관리
        tf.engine().startScope();

        this.emit('deepLearningReady', {
            backend: tf.getBackend(),
            features: tf.env().features
        });
    }

    /**
     * 신경망 아키텍처 정의
     */
    initializeArchitectures() {
        return {
            // DPS 최적화 네트워크
            dpsOptimizer: {
                type: 'sequential',
                layers: [
                    { type: 'dense', units: 512, activation: 'relu', kernelInitializer: 'heNormal' },
                    { type: 'batchNorm' },
                    { type: 'dropout', rate: 0.3 },
                    { type: 'dense', units: 256, activation: 'relu' },
                    { type: 'batchNorm' },
                    { type: 'dropout', rate: 0.2 },
                    { type: 'dense', units: 128, activation: 'relu' },
                    { type: 'residual', units: 128 },
                    { type: 'dense', units: 64, activation: 'relu' },
                    { type: 'dense', units: 32, activation: 'relu' },
                    { type: 'dense', units: 1, activation: 'linear' }
                ],
                optimizer: {
                    type: 'adam',
                    learningRate: 0.001,
                    beta1: 0.9,
                    beta2: 0.999,
                    epsilon: 1e-8
                },
                loss: 'huberLoss',
                metrics: ['mse', 'mae']
            },

            // 로테이션 최적화 네트워크 (LSTM)
            rotationOptimizer: {
                type: 'sequential',
                layers: [
                    { type: 'lstm', units: 128, returnSequences: true, activation: 'tanh' },
                    { type: 'attention', heads: 8, keyDim: 64 },
                    { type: 'lstm', units: 64, returnSequences: false },
                    { type: 'dense', units: 128, activation: 'relu' },
                    { type: 'dropout', rate: 0.2 },
                    { type: 'dense', units: 64, activation: 'relu' },
                    { type: 'dense', units: 40, activation: 'softmax' } // 40개 능력 선택
                ],
                optimizer: {
                    type: 'adamax',
                    learningRate: 0.002
                },
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy', 'topKCategoricalAccuracy']
            },

            // 생존 예측 네트워크 (CNN-LSTM)
            survivalPredictor: {
                type: 'sequential',
                layers: [
                    { type: 'conv1d', filters: 64, kernelSize: 5, activation: 'relu' },
                    { type: 'maxPooling1d', poolSize: 2 },
                    { type: 'conv1d', filters: 128, kernelSize: 3, activation: 'relu' },
                    { type: 'globalMaxPooling1d' },
                    { type: 'reshape', targetShape: [-1, 128] },
                    { type: 'lstm', units: 64, activation: 'tanh' },
                    { type: 'dense', units: 32, activation: 'relu' },
                    { type: 'dense', units: 1, activation: 'sigmoid' }
                ],
                optimizer: {
                    type: 'rmsprop',
                    learningRate: 0.001,
                    decay: 0.9
                },
                loss: 'binaryCrossentropy',
                metrics: ['accuracy', 'precision', 'recall', 'auc']
            },

            // 멀티헤드 어텐션 네트워크
            transformer: {
                type: 'custom',
                config: {
                    inputDim: 512,
                    modelDim: 256,
                    numHeads: 8,
                    numLayers: 6,
                    ffDim: 1024,
                    dropoutRate: 0.1,
                    maxPositionEncoding: 1000
                },
                optimizer: {
                    type: 'adam',
                    learningRate: 0.0001,
                    warmupSteps: 4000
                },
                loss: 'customLoss',
                metrics: ['perplexity', 'bleu']
            },

            // GAN (Generative Adversarial Network)
            gan: {
                type: 'gan',
                generator: {
                    layers: [
                        { type: 'dense', units: 256, activation: 'relu' },
                        { type: 'batchNorm', momentum: 0.8 },
                        { type: 'dense', units: 512, activation: 'relu' },
                        { type: 'batchNorm', momentum: 0.8 },
                        { type: 'dense', units: 1024, activation: 'relu' },
                        { type: 'batchNorm', momentum: 0.8 },
                        { type: 'dense', units: 784, activation: 'tanh' }
                    ]
                },
                discriminator: {
                    layers: [
                        { type: 'dense', units: 512, activation: 'leakyRelu', alpha: 0.2 },
                        { type: 'dropout', rate: 0.25 },
                        { type: 'dense', units: 256, activation: 'leakyRelu', alpha: 0.2 },
                        { type: 'dropout', rate: 0.25 },
                        { type: 'dense', units: 1, activation: 'sigmoid' }
                    ]
                },
                optimizer: {
                    generator: { type: 'adam', learningRate: 0.0002, beta1: 0.5 },
                    discriminator: { type: 'adam', learningRate: 0.0002, beta1: 0.5 }
                }
            },

            // 오토인코더
            autoencoder: {
                type: 'autoencoder',
                encoder: {
                    layers: [
                        { type: 'dense', units: 256, activation: 'relu' },
                        { type: 'dense', units: 128, activation: 'relu' },
                        { type: 'dense', units: 64, activation: 'relu' },
                        { type: 'dense', units: 32, activation: 'relu' } // Latent space
                    ]
                },
                decoder: {
                    layers: [
                        { type: 'dense', units: 64, activation: 'relu' },
                        { type: 'dense', units: 128, activation: 'relu' },
                        { type: 'dense', units: 256, activation: 'relu' },
                        { type: 'dense', units: 512, activation: 'sigmoid' }
                    ]
                },
                optimizer: {
                    type: 'adam',
                    learningRate: 0.001
                },
                loss: 'mse'
            }
        };
    }

    /**
     * 활성화 함수 초기화
     */
    initializeActivations() {
        return {
            relu: tf.relu,
            sigmoid: tf.sigmoid,
            tanh: tf.tanh,
            softmax: tf.softmax,
            leakyRelu: (x, alpha = 0.1) => tf.leakyRelu(x, alpha),
            elu: tf.elu,
            selu: tf.selu,
            swish: (x) => tf.mul(x, tf.sigmoid(x)),
            gelu: (x) => tf.mul(0.5, tf.mul(x, tf.add(1, tf.tanh(
                tf.mul(Math.sqrt(2 / Math.PI), tf.add(x, tf.mul(0.044715, tf.pow(x, 3))))
            ))))
        };
    }

    /**
     * Sequential 모델 생성
     */
    createSequentialModel(architecture) {
        const model = tf.sequential();

        architecture.layers.forEach((layerConfig, index) => {
            const layer = this.createLayer(layerConfig, index === 0 ? architecture.inputShape : null);
            if (layer) {
                model.add(layer);
            }
        });

        // 옵티마이저 설정
        const optimizer = this.createOptimizer(architecture.optimizer);

        // 컴파일
        model.compile({
            optimizer,
            loss: architecture.loss,
            metrics: architecture.metrics
        });

        return model;
    }

    /**
     * 레이어 생성
     */
    createLayer(config, inputShape = null) {
        const baseConfig = inputShape ? { inputShape } : {};

        switch (config.type) {
            case 'dense':
                return tf.layers.dense({
                    ...baseConfig,
                    units: config.units,
                    activation: config.activation,
                    kernelInitializer: config.kernelInitializer || 'glorotUniform',
                    biasInitializer: config.biasInitializer || 'zeros',
                    kernelRegularizer: config.regularizer ?
                        tf.regularizers.l2({ l2: config.regularizer }) : undefined
                });

            case 'lstm':
                return tf.layers.lstm({
                    ...baseConfig,
                    units: config.units,
                    returnSequences: config.returnSequences || false,
                    activation: config.activation || 'tanh',
                    recurrentActivation: config.recurrentActivation || 'sigmoid',
                    dropout: config.dropout || 0,
                    recurrentDropout: config.recurrentDropout || 0
                });

            case 'gru':
                return tf.layers.gru({
                    ...baseConfig,
                    units: config.units,
                    returnSequences: config.returnSequences || false,
                    activation: config.activation || 'tanh',
                    recurrentActivation: config.recurrentActivation || 'sigmoid'
                });

            case 'conv1d':
                return tf.layers.conv1d({
                    ...baseConfig,
                    filters: config.filters,
                    kernelSize: config.kernelSize,
                    strides: config.strides || 1,
                    padding: config.padding || 'valid',
                    activation: config.activation
                });

            case 'conv2d':
                return tf.layers.conv2d({
                    ...baseConfig,
                    filters: config.filters,
                    kernelSize: config.kernelSize,
                    strides: config.strides || [1, 1],
                    padding: config.padding || 'valid',
                    activation: config.activation
                });

            case 'maxPooling1d':
                return tf.layers.maxPooling1d({
                    poolSize: config.poolSize,
                    strides: config.strides,
                    padding: config.padding || 'valid'
                });

            case 'maxPooling2d':
                return tf.layers.maxPooling2d({
                    poolSize: config.poolSize || [2, 2],
                    strides: config.strides,
                    padding: config.padding || 'valid'
                });

            case 'globalMaxPooling1d':
                return tf.layers.globalMaxPooling1d();

            case 'globalMaxPooling2d':
                return tf.layers.globalMaxPooling2d();

            case 'dropout':
                return tf.layers.dropout({
                    rate: config.rate
                });

            case 'batchNorm':
                return tf.layers.batchNormalization({
                    axis: config.axis || -1,
                    momentum: config.momentum || 0.99,
                    epsilon: config.epsilon || 1e-3,
                    center: config.center !== false,
                    scale: config.scale !== false
                });

            case 'layerNorm':
                return tf.layers.layerNormalization({
                    axis: config.axis || -1,
                    epsilon: config.epsilon || 1e-6
                });

            case 'flatten':
                return tf.layers.flatten();

            case 'reshape':
                return tf.layers.reshape({
                    targetShape: config.targetShape
                });

            case 'attention':
                return this.createAttentionLayer(config);

            case 'residual':
                return this.createResidualBlock(config);

            default:
                console.warn(`Unknown layer type: ${config.type}`);
                return null;
        }
    }

    /**
     * 어텐션 레이어 생성
     */
    createAttentionLayer(config) {
        // 간단한 멀티헤드 어텐션 구현
        return tf.layers.multiHeadAttention({
            numHeads: config.heads,
            keyDim: config.keyDim || 64,
            valueDim: config.valueDim || 64,
            dropoutRate: config.dropout || 0,
            useBias: config.useBias !== false,
            outputShape: config.outputShape
        });
    }

    /**
     * Residual Block 생성
     */
    createResidualBlock(config) {
        // 커스텀 Residual Block
        class ResidualBlock extends tf.layers.Layer {
            constructor(config) {
                super(config);
                this.units = config.units;
            }

            build(inputShape) {
                this.dense1 = tf.layers.dense({
                    units: this.units,
                    activation: 'relu'
                });

                this.dense2 = tf.layers.dense({
                    units: this.units,
                    activation: null
                });

                this.add = tf.layers.add();
                this.activation = tf.layers.activation({ activation: 'relu' });
            }

            call(inputs, kwargs) {
                return tf.tidy(() => {
                    const x = this.dense1.apply(inputs);
                    const x2 = this.dense2.apply(x);
                    const sum = this.add.apply([inputs, x2]);
                    return this.activation.apply(sum);
                });
            }

            getClassName() {
                return 'ResidualBlock';
            }
        }

        return new ResidualBlock(config);
    }

    /**
     * Transformer 모델 생성
     */
    createTransformerModel(config) {
        // Transformer 아키텍처 구현
        class TransformerModel extends tf.LayersModel {
            constructor(config) {
                super({ name: 'transformer' });

                this.config = config;
                this.buildModel();
            }

            buildModel() {
                // 포지션 인코딩
                this.positionEncoding = this.createPositionEncoding();

                // 인코더 레이어
                this.encoderLayers = [];
                for (let i = 0; i < this.config.numLayers; i++) {
                    this.encoderLayers.push(this.createEncoderLayer());
                }

                // 출력 레이어
                this.outputLayer = tf.layers.dense({
                    units: this.config.outputDim,
                    activation: 'softmax'
                });
            }

            createPositionEncoding() {
                const positions = tf.range(0, this.config.maxPositionEncoding, 1);
                const dimensions = tf.range(0, this.config.modelDim, 1);

                const angleRates = tf.div(1, tf.pow(10000,
                    tf.div(tf.mul(2, tf.floor(tf.div(dimensions, 2))),
                    tf.scalar(this.config.modelDim))));

                const angleRads = tf.mul(positions.expandDims(1), angleRates.expandDims(0));

                const sines = tf.sin(angleRads.slice([0, 0], [-1, -1], [1, 2]));
                const cosines = tf.cos(angleRads.slice([0, 1], [-1, -1], [1, 2]));

                const posEncoding = tf.concat([sines, cosines], -1);

                return posEncoding;
            }

            createEncoderLayer() {
                return {
                    multiHeadAttention: tf.layers.multiHeadAttention({
                        numHeads: this.config.numHeads,
                        keyDim: this.config.modelDim / this.config.numHeads
                    }),
                    feedForward: [
                        tf.layers.dense({
                            units: this.config.ffDim,
                            activation: 'relu'
                        }),
                        tf.layers.dense({
                            units: this.config.modelDim
                        })
                    ],
                    layerNorm1: tf.layers.layerNormalization(),
                    layerNorm2: tf.layers.layerNormalization(),
                    dropout: tf.layers.dropout({ rate: this.config.dropoutRate })
                };
            }

            call(inputs, training = false) {
                return tf.tidy(() => {
                    // 포지션 인코딩 추가
                    let x = tf.add(inputs, this.positionEncoding.slice([0, 0],
                        [inputs.shape[1], inputs.shape[2]]));

                    // 인코더 레이어 통과
                    for (const layer of this.encoderLayers) {
                        // Self-attention
                        const attnOutput = layer.multiHeadAttention.apply(
                            [x, x], { training });
                        x = layer.layerNorm1.apply(tf.add(x,
                            layer.dropout.apply(attnOutput, { training })));

                        // Feed forward
                        let ffOutput = x;
                        for (const ffLayer of layer.feedForward) {
                            ffOutput = ffLayer.apply(ffOutput);
                        }
                        x = layer.layerNorm2.apply(tf.add(x,
                            layer.dropout.apply(ffOutput, { training })));
                    }

                    // 출력
                    return this.outputLayer.apply(x);
                });
            }
        }

        return new TransformerModel(config);
    }

    /**
     * GAN 모델 생성
     */
    createGANModel(architecture) {
        // Generator 생성
        const generator = tf.sequential({ name: 'generator' });
        architecture.generator.layers.forEach((layerConfig, index) => {
            const layer = this.createLayer(layerConfig,
                index === 0 ? architecture.generator.inputShape : null);
            if (layer) generator.add(layer);
        });

        // Discriminator 생성
        const discriminator = tf.sequential({ name: 'discriminator' });
        architecture.discriminator.layers.forEach((layerConfig, index) => {
            const layer = this.createLayer(layerConfig,
                index === 0 ? architecture.discriminator.inputShape : null);
            if (layer) discriminator.add(layer);
        });

        // 옵티마이저 설정
        generator.compile({
            optimizer: this.createOptimizer(architecture.optimizer.generator),
            loss: 'binaryCrossentropy'
        });

        discriminator.compile({
            optimizer: this.createOptimizer(architecture.optimizer.discriminator),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });

        return { generator, discriminator };
    }

    /**
     * 옵티마이저 생성
     */
    createOptimizer(config) {
        const lr = config.learningRate;

        switch (config.type) {
            case 'adam':
                return tf.train.adam(
                    lr,
                    config.beta1 || 0.9,
                    config.beta2 || 0.999,
                    config.epsilon || 1e-7
                );

            case 'adamax':
                return tf.train.adamax(
                    lr,
                    config.beta1 || 0.9,
                    config.beta2 || 0.999,
                    config.epsilon || 1e-7
                );

            case 'sgd':
                return tf.train.sgd(lr);

            case 'momentum':
                return tf.train.momentum(
                    lr,
                    config.momentum || 0.9,
                    config.useNesterov || false
                );

            case 'rmsprop':
                return tf.train.rmsprop(
                    lr,
                    config.decay || 0.9,
                    config.momentum || 0.0,
                    config.epsilon || 1e-7
                );

            case 'adadelta':
                return tf.train.adadelta(
                    lr,
                    config.rho || 0.95,
                    config.epsilon || 1e-7
                );

            case 'adagrad':
                return tf.train.adagrad(
                    lr,
                    config.initialAccumulatorValue || 0.1
                );

            default:
                return tf.train.adam(lr);
        }
    }

    /**
     * 학습 스케줄러
     */
    createLearningRateScheduler(type, config) {
        switch (type) {
            case 'exponential':
                return (epoch) => config.initialLr * Math.pow(config.decayRate, epoch);

            case 'polynomial':
                return (epoch) => config.initialLr * Math.pow(
                    1 - epoch / config.maxEpochs, config.power || 1);

            case 'cosine':
                return (epoch) => config.minLr + 0.5 * (config.maxLr - config.minLr) *
                    (1 + Math.cos(Math.PI * epoch / config.maxEpochs));

            case 'warmup':
                return (epoch) => {
                    if (epoch < config.warmupEpochs) {
                        return config.initialLr * epoch / config.warmupEpochs;
                    }
                    return config.initialLr;
                };

            case 'cyclical':
                return (epoch) => {
                    const cycle = Math.floor(1 + epoch / (2 * config.stepSize));
                    const x = Math.abs(epoch / config.stepSize - 2 * cycle + 1);
                    return config.baseLr + (config.maxLr - config.baseLr) *
                        Math.max(0, 1 - x);
                };

            default:
                return (epoch) => config.learningRate;
        }
    }

    /**
     * 모델 학습
     */
    async train(modelName, trainData, validData, config = {}) {
        const architecture = this.architectures[modelName];
        if (!architecture) {
            throw new Error(`Unknown architecture: ${modelName}`);
        }

        // 모델 생성 또는 가져오기
        let model = this.networks.get(modelName);
        if (!model) {
            model = this.createSequentialModel(architecture);
            this.networks.set(modelName, model);
        }

        // 학습 설정
        const epochs = config.epochs || 100;
        const batchSize = config.batchSize || 32;
        const callbacks = this.createCallbacks(modelName, config);

        // 학습 상태 업데이트
        this.trainingState.isTraining = true;
        this.trainingState.totalEpochs = epochs;

        try {
            // 학습 실행
            const history = await model.fit(
                trainData.x,
                trainData.y,
                {
                    epochs,
                    batchSize,
                    validationData: validData ? [validData.x, validData.y] : undefined,
                    validationSplit: validData ? 0 : 0.2,
                    callbacks,
                    shuffle: true,
                    verbose: 0
                }
            );

            this.emit('trainingComplete', {
                modelName,
                history: history.history,
                finalLoss: this.trainingState.currentLoss
            });

            return history;

        } finally {
            this.trainingState.isTraining = false;
        }
    }

    /**
     * 콜백 생성
     */
    createCallbacks(modelName, config) {
        const callbacks = [];

        // 진행 상황 콜백
        callbacks.push({
            onEpochEnd: (epoch, logs) => {
                this.trainingState.currentEpoch = epoch + 1;
                this.trainingState.currentLoss = logs.loss;

                if (logs.loss < this.trainingState.bestLoss) {
                    this.trainingState.bestLoss = logs.loss;
                }

                this.emit('epochEnd', {
                    modelName,
                    epoch: epoch + 1,
                    ...logs
                });
            },
            onBatchEnd: (batch, logs) => {
                if (batch % 10 === 0) {
                    this.emit('batchEnd', {
                        modelName,
                        batch,
                        ...logs
                    });
                }
            }
        });

        // Early Stopping
        if (config.earlyStopping) {
            callbacks.push(tf.callbacks.earlyStopping({
                monitor: config.earlyStopping.monitor || 'val_loss',
                patience: config.earlyStopping.patience || 10,
                minDelta: config.earlyStopping.minDelta || 0.001,
                verbose: 1,
                mode: config.earlyStopping.mode || 'auto',
                restoreBestWeights: config.earlyStopping.restoreBestWeights !== false
            }));
        }

        // Model Checkpoint
        if (config.checkpoint) {
            callbacks.push({
                onEpochEnd: async (epoch, logs) => {
                    if (epoch % config.checkpoint.frequency === 0) {
                        await this.saveCheckpoint(modelName, epoch);
                    }
                }
            });
        }

        // Learning Rate Scheduler
        if (config.lrScheduler) {
            const scheduler = this.createLearningRateScheduler(
                config.lrScheduler.type,
                config.lrScheduler
            );

            callbacks.push({
                onEpochBegin: (epoch) => {
                    const lr = scheduler(epoch);
                    const model = this.networks.get(modelName);
                    if (model && model.optimizer) {
                        model.optimizer.learningRate = lr;

                        this.emit('learningRateUpdate', {
                            modelName,
                            epoch,
                            learningRate: lr
                        });
                    }
                }
            });
        }

        // TensorBoard
        if (config.tensorboard) {
            callbacks.push(tf.node.tensorBoard(config.tensorboard.logDir, {
                updateFreq: config.tensorboard.updateFreq || 'epoch'
            }));
        }

        return callbacks;
    }

    /**
     * 예측 수행
     */
    async predict(modelName, input) {
        const model = this.networks.get(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }

        return tf.tidy(() => {
            const prediction = model.predict(input);
            return prediction;
        });
    }

    /**
     * 모델 평가
     */
    async evaluate(modelName, testData) {
        const model = this.networks.get(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }

        const result = await model.evaluate(testData.x, testData.y, {
            batchSize: 32,
            verbose: 0
        });

        const metrics = {};
        for (let i = 0; i < model.metricsNames.length; i++) {
            metrics[model.metricsNames[i]] = await result[i].data();
        }

        return metrics;
    }

    /**
     * 그래디언트 계산
     */
    computeGradients(model, input, target, lossFn) {
        return tf.tidy(() => {
            const f = () => tf.tidy(() => {
                const prediction = model.predict(input);
                return lossFn(target, prediction);
            });

            const { value, grads } = tf.variableGrads(f);
            return { loss: value, gradients: grads };
        });
    }

    /**
     * 체크포인트 저장
     */
    async saveCheckpoint(modelName, epoch) {
        const model = this.networks.get(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }

        const path = `localstorage://checkpoint-${modelName}-epoch-${epoch}`;
        await model.save(path);

        this.emit('checkpointSaved', {
            modelName,
            epoch,
            path
        });

        return path;
    }

    /**
     * 체크포인트 로드
     */
    async loadCheckpoint(modelName, epoch) {
        const path = `localstorage://checkpoint-${modelName}-epoch-${epoch}`;

        try {
            const model = await tf.loadLayersModel(path);
            this.networks.set(modelName, model);

            this.emit('checkpointLoaded', {
                modelName,
                epoch,
                path
            });

            return model;
        } catch (error) {
            this.emit('checkpointLoadError', {
                modelName,
                epoch,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * 메모리 최적화
     */
    optimizeMemory() {
        // 사용하지 않는 텐서 정리
        tf.disposeVariables();

        // 메모리 정보
        const memInfo = tf.memory();

        this.emit('memoryOptimized', {
            numTensors: memInfo.numTensors,
            numDataBuffers: memInfo.numDataBuffers,
            numBytes: memInfo.numBytes,
            unreliable: memInfo.unreliable
        });

        return memInfo;
    }

    /**
     * 모델 메타데이터
     */
    getModelMetadata(modelName) {
        const model = this.networks.get(modelName);
        if (!model) {
            return null;
        }

        return {
            name: modelName,
            layers: model.layers.length,
            parameters: model.countParams(),
            inputShape: model.inputs[0].shape,
            outputShape: model.outputs[0].shape,
            optimizer: model.optimizer ? model.optimizer.getClassName() : null,
            loss: model.loss,
            metrics: model.metricsNames
        };
    }
}

export default NeuralNetwork;