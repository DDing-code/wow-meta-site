// 직업 전문화별 AI 에이전트 기본 클래스
import * as tf from '@tensorflow/tfjs';
import APLParser from '../apl/APLParser.js';
import aplData from '../apl/APLData.js';

class SpecializationAI {
  constructor(className, specName) {
    this.className = className;
    this.specName = specName;
    this.fullName = `${className}_${specName}`;

    // 전문화별 개별 신경망
    this.model = null;
    this.isTraining = false;

    // APL 시스템
    this.aplParser = new APLParser();
    this.aplData = null;
    this.useAPL = true; // APL 사용 여부

    // 전문화 특성
    this.specializationTraits = {
      role: null, // 'dps', 'healer', 'tank'
      resource: null, // 'mana', 'rage', 'energy', 'runic_power', etc.
      primaryStat: null, // 'strength', 'agility', 'intellect'
      armorType: null, // 'plate', 'mail', 'leather', 'cloth'
    };

    // 전문화별 핵심 메커니즘
    this.coreMechanics = {
      builder: [], // 자원 생성 스킬
      spender: [], // 자원 소모 스킬
      cooldowns: [], // 주요 쿨다운
      buffs: [], // 유지해야 할 버프
      debuffs: [], // 유지해야 할 디버프
      procs: [] // 확률적 발동 효과
    };

    // 특성 트리
    this.talentTree = {
      classTree: {},
      specTree: {}
    };

    // 스탯 우선순위
    this.statPriority = {};

    // 로테이션 우선순위
    this.rotationPriority = [];

    // 전문화별 학습 가중치
    this.learningWeights = {
      dps: 0.4,
      rotation: 0.25,
      resource: 0.2,
      survival: 0.15
    };

    // 성능 벤치마크
    this.benchmarks = {
      targetDPS: 0,
      targetHPS: 0,
      targetCPM: 0, // Casts Per Minute
      targetResourceEfficiency: 85
    };

    // 학습 히스토리
    this.learningHistory = [];
    this.performanceMetrics = [];
  }

  // 전문화별 신경망 생성
  createSpecializedModel() {
    // 입력 차원은 전문화마다 다름
    const inputDim = this.getInputDimension();

    this.model = tf.sequential({
      layers: [
        // 입력층 - 전문화별 특징
        tf.layers.dense({
          inputShape: [inputDim],
          units: 128,
          activation: 'relu',
          kernelInitializer: 'glorotNormal',
          name: `${this.fullName}_input`
        }),

        // Dropout
        tf.layers.dropout({ rate: 0.2 }),

        // 은닉층 1 - 패턴 인식
        tf.layers.dense({
          units: 256,
          activation: 'relu',
          kernelInitializer: 'glorotNormal',
          name: `${this.fullName}_pattern`
        }),

        // Batch Normalization
        tf.layers.batchNormalization(),

        // 은닉층 2 - 전문화 특화
        tf.layers.dense({
          units: 128,
          activation: 'relu',
          kernelInitializer: 'glorotNormal',
          name: `${this.fullName}_specialization`
        }),

        // Dropout
        tf.layers.dropout({ rate: 0.3 }),

        // 은닉층 3 - 의사결정
        tf.layers.dense({
          units: 64,
          activation: 'relu',
          kernelInitializer: 'glorotNormal',
          name: `${this.fullName}_decision`
        }),

        // 출력층 - 예측
        tf.layers.dense({
          units: this.getOutputDimension(),
          activation: 'sigmoid',
          name: `${this.fullName}_output`
        })
      ]
    });

    // 모델 컴파일
    this.model.compile({
      optimizer: tf.train.adam(this.getLearningRate()),
      loss: 'meanSquaredError',
      metrics: ['mse', 'mae']
    });

    console.log(`✅ ${this.className} ${this.specName} 전문화 AI 모델 생성 완료`);
  }

  // 입력 차원 계산
  getInputDimension() {
    // 기본 특징 + 전문화별 특징
    const baseFeatures = 15; // DPS, 스탯, 자원 등
    const specializationFeatures = this.getSpecializationFeatures();
    return baseFeatures + specializationFeatures;
  }

  // 전문화별 특징 수
  getSpecializationFeatures() {
    // 각 전문화마다 고유한 특징 수
    // 예: 도적은 콤보 포인트, 죽음의 기사는 룬 등
    return 10; // 기본값, 하위 클래스에서 오버라이드
  }

  // 출력 차원
  getOutputDimension() {
    // [예측DPS/HPS, 로테이션점수, 자원효율, 생존력, 다음스킬1, 다음스킬2, 다음스킬3]
    return 7;
  }

  // 학습률 (전문화별 조정)
  getLearningRate() {
    // 복잡한 전문화는 낮은 학습률
    const complexityFactor = this.getComplexityFactor();
    return 0.001 * (1 / complexityFactor);
  }

  // 복잡도 계산
  getComplexityFactor() {
    // 스킬 수, 자원 시스템 복잡도 등을 고려
    return 1.0; // 기본값
  }

  // 전문화별 특징 추출
  extractSpecializationFeatures(combatLog) {
    const features = {
      // 기본 특징
      dps: combatLog.dps || 0,
      hps: combatLog.hps || 0,

      // 스탯
      primaryStat: this.getPrimaryStat(combatLog),
      critical: combatLog.stats?.critical || 0,
      haste: combatLog.stats?.haste || 0,
      mastery: combatLog.stats?.mastery || 0,
      versatility: combatLog.stats?.versatility || 0,

      // 자원 관리
      resourceCurrent: combatLog.resource?.current || 0,
      resourceMax: combatLog.resource?.max || 100,
      resourceEfficiency: combatLog.resourceEfficiency || 0,

      // 스킬 사용
      builderUsage: this.getBuilderUsage(combatLog),
      spenderUsage: this.getSpenderUsage(combatLog),
      cooldownUsage: this.getCooldownUsage(combatLog),

      // 버프/디버프 유지율
      buffUptime: this.getBuffUptime(combatLog),
      debuffUptime: this.getDebuffUptime(combatLog),

      // 전문화별 고유 특징
      ...this.getUniqueFeatures(combatLog)
    };

    return features;
  }

  // 주 스탯 추출
  getPrimaryStat(combatLog) {
    switch (this.specializationTraits.primaryStat) {
      case 'strength':
        return combatLog.stats?.strength || 0;
      case 'agility':
        return combatLog.stats?.agility || 0;
      case 'intellect':
        return combatLog.stats?.intellect || 0;
      default:
        return 0;
    }
  }

  // 빌더 스킬 사용률
  getBuilderUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const builderCasts = combatLog.skills.filter(s =>
      this.coreMechanics.builder.includes(s.name)
    ).length;

    return (builderCasts / combatLog.skills.length) * 100;
  }

  // 스펜더 스킬 사용률
  getSpenderUsage(combatLog) {
    if (!combatLog.skills) return 0;

    const spenderCasts = combatLog.skills.filter(s =>
      this.coreMechanics.spender.includes(s.name)
    ).length;

    return (spenderCasts / combatLog.skills.length) * 100;
  }

  // 쿨다운 사용 효율
  getCooldownUsage(combatLog) {
    if (!this.coreMechanics.cooldowns.length) return 100;

    let totalEfficiency = 0;

    this.coreMechanics.cooldowns.forEach(cd => {
      const uses = combatLog.cooldownUses?.[cd.name] || 0;
      const maxUses = Math.floor(combatLog.duration / cd.cooldown) + 1;
      totalEfficiency += (uses / maxUses) * 100;
    });

    return totalEfficiency / this.coreMechanics.cooldowns.length;
  }

  // 버프 유지율
  getBuffUptime(combatLog) {
    if (!this.coreMechanics.buffs.length) return 100;

    let totalUptime = 0;

    this.coreMechanics.buffs.forEach(buff => {
      const uptime = combatLog.buffUptimes?.[buff] || 0;
      totalUptime += uptime;
    });

    return totalUptime / this.coreMechanics.buffs.length;
  }

  // 디버프 유지율
  getDebuffUptime(combatLog) {
    if (!this.coreMechanics.debuffs.length) return 100;

    let totalUptime = 0;

    this.coreMechanics.debuffs.forEach(debuff => {
      const uptime = combatLog.debuffUptimes?.[debuff] || 0;
      totalUptime += uptime;
    });

    return totalUptime / this.coreMechanics.debuffs.length;
  }

  // 전문화별 고유 특징 (하위 클래스에서 구현)
  getUniqueFeatures(combatLog) {
    return {};
  }

  // 학습
  async train(trainingData, epochs = 50) {
    if (!this.model) {
      this.createSpecializedModel();
    }

    console.log(`🎓 ${this.className} ${this.specName} 학습 시작...`);

    this.isTraining = true;

    try {
      // 특징 추출
      const features = [];
      const labels = [];

      trainingData.forEach(log => {
        const feature = this.extractSpecializationFeatures(log);
        features.push(Object.values(feature));

        const label = this.createLabels(log);
        labels.push(label);
      });

      // 텐서 생성
      const xs = tf.tensor2d(features);
      const ys = tf.tensor2d(labels);

      // 학습
      const history = await this.model.fit(xs, ys, {
        epochs: epochs,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log(`[${this.fullName}] Epoch ${epoch}: loss=${logs.loss.toFixed(4)}`);
            }
            this.learningHistory.push(logs);
          }
        }
      });

      // 메모리 정리
      xs.dispose();
      ys.dispose();

      this.isTraining = false;

      const accuracy = this.calculateAccuracy(history);
      console.log(`✅ ${this.className} ${this.specName} 학습 완료: 정확도 ${accuracy.toFixed(2)}%`);

      return {
        accuracy,
        finalLoss: history.history.loss[history.history.loss.length - 1]
      };

    } catch (error) {
      this.isTraining = false;
      console.error(`❌ ${this.fullName} 학습 실패:`, error);
      throw error;
    }
  }

  // 레이블 생성
  createLabels(log) {
    return [
      log.dps / 10000000, // 정규화된 DPS
      log.rotationEfficiency / 100,
      log.resourceEfficiency / 100,
      log.survivalRate / 100,
      // 다음 스킬 예측 (원-핫 인코딩 필요)
      0, 0, 0
    ];
  }

  // 정확도 계산
  calculateAccuracy(history) {
    const finalLoss = history.history.loss[history.history.loss.length - 1];
    return Math.max(0, Math.min(100, (1 - finalLoss) * 100));
  }

  // 예측
  async predict(currentState) {
    if (!this.model) {
      throw new Error(`${this.fullName} 모델이 학습되지 않았습니다`);
    }

    const features = this.extractSpecializationFeatures(currentState);
    const input = tf.tensor2d([Object.values(features)]);

    const prediction = await this.model.predict(input);
    const output = await prediction.array();

    input.dispose();
    prediction.dispose();

    return this.interpretPrediction(output[0]);
  }

  // 예측 해석
  interpretPrediction(output) {
    return {
      predictedDPS: output[0] * 10000000,
      rotationScore: output[1] * 100,
      resourceScore: output[2] * 100,
      survivalScore: output[3] * 100,
      nextSkills: this.decodeNextSkills(output.slice(4))
    };
  }

  // 다음 스킬 디코딩
  decodeNextSkills(skillPredictions) {
    // 실제로는 더 복잡한 디코딩 필요
    return ['스킬1', '스킬2', '스킬3'];
  }

  // 실시간 조언 생성
  async generateRealtimeAdvice(currentState) {
    const prediction = await this.predict(currentState);

    const advice = {
      immediate: [],
      warnings: [],
      optimizations: []
    };

    // APL 기반 로테이션 조언 (우선)
    if (this.useAPL && this.aplData) {
      const aplRotation = await this.getAPLBasedRotation(currentState);
      if (aplRotation) {
        advice.immediate.push(`APL 추천: ${aplRotation}`);
      }
    }

    // 로테이션 조언
    if (prediction.rotationScore < 80) {
      advice.immediate.push(`로테이션 개선 필요: ${this.getRotationAdvice(currentState)}`);
    }

    // 자원 관리 조언
    if (prediction.resourceScore < 75) {
      advice.warnings.push(`자원 관리: ${this.getResourceAdvice(currentState)}`);
    }

    // DPS 최적화
    if (prediction.predictedDPS > currentState.dps * 1.1) {
      advice.optimizations.push(`DPS 향상 가능: +${Math.round(prediction.predictedDPS - currentState.dps)}`);
    }

    // 다음 스킬 추천
    if (!this.useAPL || !this.aplData) {
      advice.immediate.push(`다음 스킬: ${prediction.nextSkills[0]}`);
    }

    return advice;
  }

  // APL 기반 로테이션 가져오기
  async getAPLBasedRotation(gameState) {
    if (!this.aplData) {
      await this.loadAPL();
    }

    if (!this.aplData) {
      return null;
    }

    // 간소화된 APL 사용
    const simplifiedAPL = aplData.getSimplifiedAPL(this.className, this.specName);
    if (simplifiedAPL) {
      const rotationType = gameState.enemy_count > 1 ? 'multi_target' : 'single_target';
      const rotation = simplifiedAPL[rotationType];

      if (rotation) {
        for (const action of rotation) {
          if (this.evaluateSimpleAPLCondition(action.condition, gameState)) {
            return action.skill;
          }
        }
      }
    }

    return null;
  }

  // 간단한 APL 조건 평가
  evaluateSimpleAPLCondition(condition, gameState) {
    if (!condition || condition === 'always') return true;

    // 기본 조건 평가 (하위 클래스에서 오버라이드 가능)
    return false;
  }

  // APL 로드
  async loadAPL() {
    try {
      const aplText = await aplData.fetchAPL(this.className, this.specName);

      if (typeof aplText === 'string') {
        // 파싱 시도
        this.aplData = this.aplParser.parseAPL(aplText);
      } else if (aplText) {
        // 이미 파싱된 데이터
        this.aplData = aplText;
      }

      if (this.aplData) {
        console.log(`📜 ${this.className} ${this.specName} APL 로드 완료`);

        // APL 데이터를 학습 데이터로 변환
        const trainingData = this.aplParser.convertAPLToTrainingData(
          this.aplData,
          this.className,
          this.specName
        );

        // 학습 데이터로 활용
        this.aplTrainingData = trainingData;
      }
    } catch (error) {
      console.error(`APL 로드 실패 (${this.fullName}):`, error);
      this.aplData = null;
    }
  }

  // 로테이션 조언 (하위 클래스에서 구현)
  getRotationAdvice(currentState) {
    return '기본 로테이션 유지';
  }

  // 자원 관리 조언 (하위 클래스에서 구현)
  getResourceAdvice(currentState) {
    return '자원 효율적 사용';
  }

  // 모델 저장
  async saveModel() {
    if (!this.model) return;

    const path = `localstorage://ai-${this.fullName}`;
    await this.model.save(path);
    console.log(`💾 ${this.fullName} 모델 저장 완료`);
  }

  // 모델 로드
  async loadModel() {
    try {
      const path = `localstorage://ai-${this.fullName}`;
      this.model = await tf.loadLayersModel(path);
      console.log(`📂 ${this.fullName} 모델 로드 완료`);
      return true;
    } catch (error) {
      console.log(`⚠️ ${this.fullName} 저장된 모델 없음`);
      return false;
    }
  }
}

export default SpecializationAI;