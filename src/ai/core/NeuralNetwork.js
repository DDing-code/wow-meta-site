// WoW 메타 분석을 위한 신경망 모델
import * as tf from '@tensorflow/tfjs';

class WoWNeuralNetwork {
  constructor() {
    this.model = null;
    this.isTraining = false;
    this.trainHistory = [];

    // 입력 특징 차원
    this.inputFeatures = {
      // 전투 통계
      dps: { min: 0, max: 10000000 },
      hps: { min: 0, max: 5000000 },
      critRate: { min: 0, max: 100 },
      hasteRate: { min: 0, max: 100 },
      masteryRate: { min: 0, max: 100 },
      versatilityRate: { min: 0, max: 100 },

      // 스킬 사용 패턴 (정규화된 빈도)
      skill1Frequency: { min: 0, max: 100 },
      skill2Frequency: { min: 0, max: 100 },
      skill3Frequency: { min: 0, max: 100 },
      cooldownEfficiency: { min: 0, max: 100 },

      // 자원 관리
      resourceEfficiency: { min: 0, max: 100 },
      overcapRate: { min: 0, max: 100 },

      // 생존 지표
      deathCount: { min: 0, max: 10 },
      damageReduction: { min: 0, max: 100 }
    };

    // 출력: 성능 예측 및 개선 영역
    this.outputDimensions = 5; // [예측DPS, 로테이션점수, 자원관리점수, 생존점수, 종합등급]
  }

  // 신경망 모델 생성
  createModel() {
    // Sequential 모델 생성
    this.model = tf.sequential({
      layers: [
        // 입력층
        tf.layers.dense({
          inputShape: [Object.keys(this.inputFeatures).length],
          units: 128,
          activation: 'relu',
          kernelInitializer: 'glorotNormal'
        }),

        // Dropout으로 과적합 방지
        tf.layers.dropout({ rate: 0.2 }),

        // 은닉층 1
        tf.layers.dense({
          units: 256,
          activation: 'relu',
          kernelInitializer: 'glorotNormal'
        }),

        // Batch Normalization
        tf.layers.batchNormalization(),

        // Dropout
        tf.layers.dropout({ rate: 0.3 }),

        // 은닉층 2
        tf.layers.dense({
          units: 128,
          activation: 'relu',
          kernelInitializer: 'glorotNormal'
        }),

        // 은닉층 3
        tf.layers.dense({
          units: 64,
          activation: 'relu',
          kernelInitializer: 'glorotNormal'
        }),

        // 출력층
        tf.layers.dense({
          units: this.outputDimensions,
          activation: 'sigmoid' // 0-1 범위 출력
        })
      ]
    });

    // 모델 컴파일
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mse', 'mae']
    });

    console.log('✅ 신경망 모델 생성 완료');
    return this.model;
  }

  // 데이터 정규화
  normalizeData(data) {
    const normalized = {};

    for (const [key, value] of Object.entries(data)) {
      if (this.inputFeatures[key]) {
        const { min, max } = this.inputFeatures[key];
        normalized[key] = (value - min) / (max - min);
      }
    }

    return normalized;
  }

  // 데이터 역정규화
  denormalizeOutput(output) {
    return {
      predictedDPS: output[0] * 10000000, // 0-10M DPS
      rotationScore: output[1] * 100,     // 0-100%
      resourceScore: output[2] * 100,     // 0-100%
      survivalScore: output[3] * 100,     // 0-100%
      overallGrade: this.getGrade(output[4])
    };
  }

  // 등급 계산
  getGrade(score) {
    if (score > 0.9) return 'S+';
    if (score > 0.85) return 'S';
    if (score > 0.8) return 'A+';
    if (score > 0.75) return 'A';
    if (score > 0.7) return 'B+';
    if (score > 0.65) return 'B';
    if (score > 0.6) return 'C+';
    if (score > 0.55) return 'C';
    return 'D';
  }

  // 학습 데이터 준비
  async prepareTrainingData(logs) {
    const features = [];
    const labels = [];

    for (const log of logs) {
      // 입력 특징 추출
      const input = this.extractFeatures(log);
      features.push(Object.values(this.normalizeData(input)));

      // 레이블 생성 (실제 성능 지표)
      const output = [
        log.dps / 10000000,
        log.rotationEfficiency / 100,
        log.resourceEfficiency / 100,
        log.survivalRate / 100,
        log.percentile / 100
      ];
      labels.push(output);
    }

    // 텐서로 변환
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels);

    return { xs, ys };
  }

  // 특징 추출
  extractFeatures(log) {
    return {
      dps: log.dps || 0,
      hps: log.hps || 0,
      critRate: log.stats?.critical || 25,
      hasteRate: log.stats?.haste || 20,
      masteryRate: log.stats?.mastery || 30,
      versatilityRate: log.stats?.versatility || 10,

      skill1Frequency: log.skills?.[0]?.frequency || 30,
      skill2Frequency: log.skills?.[1]?.frequency || 25,
      skill3Frequency: log.skills?.[2]?.frequency || 20,
      cooldownEfficiency: log.cooldownUsage || 80,

      resourceEfficiency: log.resourceManagement || 75,
      overcapRate: log.overcapRate || 5,

      deathCount: log.deaths || 0,
      damageReduction: log.mitigated || 50
    };
  }

  // 모델 학습
  async train(logs, epochs = 100) {
    if (!this.model) {
      this.createModel();
    }

    this.isTraining = true;
    console.log('🧠 신경망 학습 시작...');

    try {
      // 학습 데이터 준비
      const { xs, ys } = await this.prepareTrainingData(logs);

      // 데이터 분할 (80% 학습, 20% 검증)
      const splitIdx = Math.floor(logs.length * 0.8);
      const xTrain = xs.slice([0, 0], [splitIdx, -1]);
      const yTrain = ys.slice([0, 0], [splitIdx, -1]);
      const xVal = xs.slice([splitIdx, 0], [-1, -1]);
      const yVal = ys.slice([splitIdx, 0], [-1, -1]);

      // 모델 학습
      const history = await this.model.fit(xTrain, yTrain, {
        epochs: epochs,
        validationData: [xVal, yVal],
        batchSize: 32,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, val_loss = ${logs.val_loss?.toFixed(4) || 'N/A'}`);
            }
            this.trainHistory.push(logs);
          }
        }
      });

      // 메모리 정리
      xs.dispose();
      ys.dispose();
      xTrain.dispose();
      yTrain.dispose();
      xVal.dispose();
      yVal.dispose();

      this.isTraining = false;
      console.log('✅ 학습 완료!');

      return {
        finalLoss: history.history.loss[history.history.loss.length - 1],
        finalValLoss: history.history.val_loss?.[history.history.val_loss.length - 1],
        epochs: epochs,
        accuracy: this.calculateAccuracy(history)
      };

    } catch (error) {
      this.isTraining = false;
      console.error('❌ 학습 실패:', error);
      throw error;
    }
  }

  // 정확도 계산
  calculateAccuracy(history) {
    const finalLoss = history.history.loss[history.history.loss.length - 1];
    // MSE를 정확도로 변환 (낮을수록 좋음)
    return Math.max(0, Math.min(100, (1 - finalLoss) * 100));
  }

  // 예측
  async predict(combatData) {
    if (!this.model) {
      throw new Error('모델이 학습되지 않았습니다');
    }

    // 입력 데이터 정규화
    const input = this.extractFeatures(combatData);
    const normalized = Object.values(this.normalizeData(input));

    // 텐서 생성
    const inputTensor = tf.tensor2d([normalized]);

    // 예측
    const prediction = await this.model.predict(inputTensor);
    const output = await prediction.array();

    // 메모리 정리
    inputTensor.dispose();
    prediction.dispose();

    // 결과 역정규화
    return this.denormalizeOutput(output[0]);
  }

  // 실시간 성능 분석
  async analyzePerformance(currentState) {
    const prediction = await this.predict(currentState);

    const analysis = {
      current: {
        dps: currentState.dps,
        percentile: currentState.percentile
      },
      predicted: {
        dps: prediction.predictedDPS,
        potential: prediction.predictedDPS - currentState.dps
      },
      scores: {
        rotation: prediction.rotationScore,
        resource: prediction.resourceScore,
        survival: prediction.survivalScore,
        overall: prediction.overallGrade
      },
      recommendations: this.generateRecommendations(prediction, currentState)
    };

    return analysis;
  }

  // 개선 제안 생성
  generateRecommendations(prediction, currentState) {
    const recommendations = [];

    // 로테이션 개선
    if (prediction.rotationScore < 80) {
      recommendations.push({
        priority: 'high',
        area: 'rotation',
        message: '스킬 로테이션 최적화 필요',
        improvement: `${(80 - prediction.rotationScore).toFixed(1)}% 개선 가능`
      });
    }

    // 자원 관리
    if (prediction.resourceScore < 75) {
      recommendations.push({
        priority: 'medium',
        area: 'resource',
        message: '자원 관리 효율성 개선 필요',
        improvement: `${(75 - prediction.resourceScore).toFixed(1)}% 개선 가능`
      });
    }

    // 생존력
    if (prediction.survivalScore < 70) {
      recommendations.push({
        priority: 'high',
        area: 'survival',
        message: '생존 기술 사용 개선 필요',
        improvement: '방어 기술 타이밍 조정'
      });
    }

    // DPS 잠재력
    if (prediction.predictedDPS > currentState.dps * 1.1) {
      recommendations.push({
        priority: 'high',
        area: 'dps',
        message: `DPS 향상 가능: ${Math.round(prediction.predictedDPS).toLocaleString()}`,
        improvement: `+${Math.round(prediction.predictedDPS - currentState.dps).toLocaleString()} DPS 가능`
      });
    }

    return recommendations;
  }

  // 모델 저장
  async saveModel(path = 'localstorage://wow-ai-model') {
    if (!this.model) {
      throw new Error('저장할 모델이 없습니다');
    }
    await this.model.save(path);
    console.log('✅ 모델 저장 완료:', path);
  }

  // 모델 로드
  async loadModel(path = 'localstorage://wow-ai-model') {
    try {
      this.model = await tf.loadLayersModel(path);
      console.log('✅ 모델 로드 완료:', path);
      return true;
    } catch (error) {
      console.log('⚠️ 저장된 모델이 없습니다. 새로 학습이 필요합니다.');
      return false;
    }
  }

  // 모델 요약
  summary() {
    if (this.model) {
      this.model.summary();
    } else {
      console.log('모델이 생성되지 않았습니다');
    }
  }
}

export default WoWNeuralNetwork;