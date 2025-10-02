// 학습 AI 패턴 분석 시스템
import moduleEventBus from './ModuleEventBus';
import aiFeedbackService from './AIFeedbackService';

class LearningAIPatternAnalyzer {
  constructor() {
    this.patterns = new Map();
    this.learningHistory = [];
    this.modelWeights = new Map();
    this.performanceMetrics = new Map();
    this.trainingData = [];
    this.isLearning = false;

    // 모듈 등록
    moduleEventBus.registerModule('learningAIPatternAnalyzer', {
      name: 'Learning AI Pattern Analyzer',
      version: '1.0.0'
    });

    this.setupEventListeners();
    this.initializeLearningModels();
  }

  setupEventListeners() {
    // 로그 데이터 수신
    moduleEventBus.on('log-data-received', (data) => {
      this.analyzeLogData(data);
    });

    // 플레이어 행동 패턴 수신
    moduleEventBus.on('player-action', (action) => {
      this.recordPlayerAction(action);
    });

    // 성능 메트릭 수신
    moduleEventBus.on('performance-metrics', (metrics) => {
      this.updatePerformanceMetrics(metrics);
    });

    // 가이드 사용 패턴 수신
    moduleEventBus.on('guide-interaction', (interaction) => {
      this.analyzeGuideUsage(interaction);
    });

    // 학습 요청
    moduleEventBus.on('start-learning', () => {
      this.startLearning();
    });
  }

  // 학습 모델 초기화
  initializeLearningModels() {
    this.models = {
      rotation: {
        name: '딜사이클 최적화 모델',
        accuracy: 0,
        patterns: [],
        weights: {}
      },
      talentChoice: {
        name: '특성 선택 모델',
        accuracy: 0,
        patterns: [],
        weights: {}
      },
      statPriority: {
        name: '스탯 우선순위 모델',
        accuracy: 0,
        patterns: [],
        weights: {}
      },
      situational: {
        name: '상황별 대응 모델',
        accuracy: 0,
        patterns: [],
        weights: {}
      }
    };
  }

  // 로그 데이터 분석
  async analyzeLogData(logData) {
    const { reportId, fights, spec, player } = logData;

    // 전투 데이터 추출
    const combatPatterns = this.extractCombatPatterns(fights);

    // 스킬 사용 패턴 분석
    const skillPatterns = this.analyzeSkillUsage(combatPatterns);

    // 성능 지표 계산
    const performance = this.calculatePerformance(combatPatterns);

    // 패턴 저장
    this.storePattern({
      type: 'combat-log',
      spec,
      player,
      patterns: skillPatterns,
      performance,
      timestamp: new Date().toISOString()
    });

    // 학습 데이터에 추가
    this.addTrainingData({
      input: combatPatterns,
      output: performance,
      context: { spec, player }
    });

    // 모델 업데이트
    if (this.isLearning) {
      await this.updateModels('rotation', skillPatterns, performance);
    }

    return { skillPatterns, performance };
  }

  // 전투 패턴 추출
  extractCombatPatterns(fights) {
    const patterns = [];

    for (const fight of fights) {
      const pattern = {
        duration: fight.duration,
        dps: fight.dps,
        skills: [],
        resources: [],
        buffs: [],
        cooldowns: []
      };

      // 스킬 시퀀스 추출
      if (fight.events) {
        pattern.skills = this.extractSkillSequence(fight.events);
      }

      // 리소스 사용 패턴
      if (fight.resources) {
        pattern.resources = this.extractResourcePattern(fight.resources);
      }

      // 버프 관리 패턴
      if (fight.buffs) {
        pattern.buffs = this.extractBuffPattern(fight.buffs);
      }

      patterns.push(pattern);
    }

    return patterns;
  }

  // 스킬 시퀀스 추출
  extractSkillSequence(events) {
    const sequence = [];
    let lastTime = 0;

    for (const event of events) {
      if (event.type === 'cast' || event.type === 'damage') {
        sequence.push({
          skill: event.ability,
          timestamp: event.timestamp,
          timeSinceLast: event.timestamp - lastTime,
          damage: event.amount || 0
        });
        lastTime = event.timestamp;
      }
    }

    return sequence;
  }

  // 스킬 사용 패턴 분석
  analyzeSkillUsage(combatPatterns) {
    const skillFrequency = new Map();
    const skillSequences = [];
    const skillEfficiency = new Map();

    for (const pattern of combatPatterns) {
      // 빈도 분석
      for (const skill of pattern.skills) {
        const count = skillFrequency.get(skill.skill) || 0;
        skillFrequency.set(skill.skill, count + 1);

        // 효율성 분석
        if (skill.damage > 0) {
          const efficiency = skillEfficiency.get(skill.skill) || [];
          efficiency.push(skill.damage / (skill.timeSinceLast || 1));
          skillEfficiency.set(skill.skill, efficiency);
        }
      }

      // 시퀀스 패턴 추출
      const sequence = pattern.skills.slice(0, 10).map(s => s.skill);
      skillSequences.push(sequence);
    }

    // 효율성 평균 계산
    const avgEfficiency = new Map();
    for (const [skill, efficiencies] of skillEfficiency) {
      const avg = efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length;
      avgEfficiency.set(skill, avg);
    }

    return {
      frequency: Object.fromEntries(skillFrequency),
      sequences: this.findCommonSequences(skillSequences),
      efficiency: Object.fromEntries(avgEfficiency)
    };
  }

  // 공통 시퀀스 찾기
  findCommonSequences(sequences) {
    const sequenceCount = new Map();

    for (const seq of sequences) {
      // 2-5 길이의 서브시퀀스 추출
      for (let length = 2; length <= Math.min(5, seq.length); length++) {
        for (let i = 0; i <= seq.length - length; i++) {
          const subseq = seq.slice(i, i + length).join('-');
          sequenceCount.set(subseq, (sequenceCount.get(subseq) || 0) + 1);
        }
      }
    }

    // 빈도 순으로 정렬
    return Array.from(sequenceCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([seq, count]) => ({
        sequence: seq.split('-'),
        count,
        frequency: count / sequences.length
      }));
  }

  // 성능 계산
  calculatePerformance(patterns) {
    const metrics = {
      avgDps: 0,
      uptime: 0,
      efficiency: 0,
      consistency: 0
    };

    if (patterns.length === 0) return metrics;

    // 평균 DPS
    const totalDps = patterns.reduce((sum, p) => sum + (p.dps || 0), 0);
    metrics.avgDps = totalDps / patterns.length;

    // 업타임 (스킬 사용 시간 비율)
    const totalUptime = patterns.reduce((sum, p) => {
      const activeTime = p.skills.length * 1.5; // 평균 GCD
      return sum + (activeTime / p.duration);
    }, 0);
    metrics.uptime = (totalUptime / patterns.length) * 100;

    // 효율성 (리소스 대비 데미지)
    metrics.efficiency = this.calculateEfficiency(patterns);

    // 일관성 (DPS 표준편차)
    const dpsValues = patterns.map(p => p.dps || 0);
    metrics.consistency = 100 - this.calculateStandardDeviation(dpsValues);

    return metrics;
  }

  // 효율성 계산
  calculateEfficiency(patterns) {
    let totalEfficiency = 0;

    for (const pattern of patterns) {
      const resourceUsed = pattern.resources.reduce((sum, r) => sum + r.amount, 0);
      const damageDealt = pattern.skills.reduce((sum, s) => sum + (s.damage || 0), 0);

      if (resourceUsed > 0) {
        totalEfficiency += damageDealt / resourceUsed;
      }
    }

    return totalEfficiency / patterns.length;
  }

  // 표준편차 계산
  calculateStandardDeviation(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  // 플레이어 액션 기록
  recordPlayerAction(action) {
    const { type, skill, target, timestamp } = action;

    this.learningHistory.push({
      type,
      skill,
      target,
      timestamp,
      context: this.getCurrentContext()
    });

    // 패턴 인식
    if (this.learningHistory.length >= 10) {
      const recentActions = this.learningHistory.slice(-10);
      const pattern = this.identifyActionPattern(recentActions);

      if (pattern) {
        this.addPattern('player-action', pattern);
      }
    }
  }

  // 액션 패턴 식별
  identifyActionPattern(actions) {
    // 반복 패턴 찾기
    const skills = actions.map(a => a.skill).filter(Boolean);

    if (skills.length < 3) return null;

    // 패턴 분석
    return {
      type: 'action-sequence',
      skills,
      timing: this.analyzeActionTiming(actions),
      context: this.summarizeContext(actions)
    };
  }

  // 패턴 추가
  addPattern(category, pattern) {
    if (!this.patterns.has(category)) {
      this.patterns.set(category, []);
    }

    this.patterns.get(category).push({
      ...pattern,
      timestamp: new Date().toISOString(),
      weight: 1.0
    });

    // 이벤트 발행
    moduleEventBus.emit('pattern-identified', {
      category,
      pattern
    });
  }

  // 학습 데이터 추가
  addTrainingData(data) {
    this.trainingData.push({
      ...data,
      id: `training-${Date.now()}`,
      timestamp: new Date().toISOString()
    });

    // 데이터 크기 제한 (최근 10000개만 유지)
    if (this.trainingData.length > 10000) {
      this.trainingData = this.trainingData.slice(-10000);
    }
  }

  // 모델 업데이트
  async updateModels(modelType, patterns, performance) {
    const model = this.models[modelType];
    if (!model) return;

    // 패턴 추가
    model.patterns.push({
      input: patterns,
      output: performance,
      timestamp: new Date().toISOString()
    });

    // 가중치 업데이트 (간단한 경사하강법 시뮬레이션)
    this.updateWeights(model, patterns, performance);

    // 정확도 계산
    model.accuracy = this.calculateModelAccuracy(model);

    // 임계값 이상이면 추천 생성
    if (model.accuracy > 0.75) {
      this.generateRecommendations(modelType, model);
    }
  }

  // 가중치 업데이트
  updateWeights(model, patterns, performance) {
    const learningRate = 0.01;

    // 각 패턴에 대한 가중치 조정
    for (const [key, value] of Object.entries(patterns)) {
      const currentWeight = model.weights[key] || 0.5;

      // 성능에 따른 가중치 조정
      const adjustment = performance.avgDps > 50000 ? learningRate : -learningRate;
      model.weights[key] = Math.max(0, Math.min(1, currentWeight + adjustment));
    }
  }

  // 모델 정확도 계산
  calculateModelAccuracy(model) {
    if (model.patterns.length < 10) return 0;

    // 최근 패턴들로 검증
    const recentPatterns = model.patterns.slice(-20);
    let correctPredictions = 0;

    for (const pattern of recentPatterns) {
      const predicted = this.predictPerformance(model, pattern.input);
      const actual = pattern.output.avgDps;

      // 10% 오차 범위 내면 정확한 것으로 판정
      if (Math.abs(predicted - actual) / actual < 0.1) {
        correctPredictions++;
      }
    }

    return correctPredictions / recentPatterns.length;
  }

  // 성능 예측
  predictPerformance(model, input) {
    let prediction = 0;

    for (const [key, value] of Object.entries(input)) {
      const weight = model.weights[key] || 0.5;

      // 가중 평균 계산
      if (typeof value === 'number') {
        prediction += value * weight;
      } else if (typeof value === 'object') {
        // 객체인 경우 재귀적으로 처리
        const subPrediction = this.predictPerformance(
          { weights: model.weights },
          value
        );
        prediction += subPrediction * weight;
      }
    }

    return prediction;
  }

  // 추천 생성
  generateRecommendations(modelType, model) {
    const recommendations = [];

    // 가장 높은 가중치를 가진 패턴 찾기
    const topPatterns = Object.entries(model.weights)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    for (const [pattern, weight] of topPatterns) {
      recommendations.push({
        type: modelType,
        pattern,
        weight,
        confidence: model.accuracy,
        description: this.getPatternDescription(modelType, pattern)
      });
    }

    // 추천 발행
    moduleEventBus.emit('ai-recommendations', {
      modelType,
      recommendations,
      timestamp: new Date().toISOString()
    });

    return recommendations;
  }

  // 패턴 설명 생성
  getPatternDescription(modelType, pattern) {
    const descriptions = {
      rotation: {
        default: `${pattern} 스킬을 우선적으로 사용하세요`
      },
      talentChoice: {
        default: `${pattern} 특성이 최적 성능을 보입니다`
      },
      statPriority: {
        default: `${pattern} 스탯을 우선적으로 맞추세요`
      },
      situational: {
        default: `${pattern} 상황에서 특별한 주의가 필요합니다`
      }
    };

    return descriptions[modelType]?.default || '패턴 분석 결과';
  }

  // 가이드 사용 패턴 분석
  analyzeGuideUsage(interaction) {
    const { section, action, duration, spec } = interaction;

    // 사용 패턴 저장
    this.addPattern('guide-usage', {
      section,
      action,
      duration,
      spec,
      effectiveness: this.calculateEffectiveness(interaction)
    });

    // 인기 섹션 업데이트
    this.updatePopularSections(section, duration);
  }

  // 효과성 계산
  calculateEffectiveness(interaction) {
    // 상호작용 후 성능 변화 측정
    // 실제로는 Before/After 성능 비교
    return Math.random() * 100; // 시뮬레이션
  }

  // 인기 섹션 업데이트
  updatePopularSections(section, duration) {
    const current = this.performanceMetrics.get('popularSections') || new Map();
    const sectionData = current.get(section) || { count: 0, totalDuration: 0 };

    sectionData.count++;
    sectionData.totalDuration += duration;

    current.set(section, sectionData);
    this.performanceMetrics.set('popularSections', current);
  }

  // 학습 시작 (수동 학습만 사용)
  async startLearning() {
    if (this.isLearning) return;

    this.isLearning = true;

    // 이벤트 발행
    moduleEventBus.emit('learning-started', {
      models: Object.keys(this.models),
      trainingDataSize: this.trainingData.length
    });

    // 자동 학습 비활성화 - 수동으로만 학습
    console.log('AI 자동 학습 비활성화됨. 수동 학습만 사용합니다.');

    // 초기 학습 한 번만 수행
    await this.performLearningCycle();
  }

  // 학습 사이클 수행
  async performLearningCycle() {
    for (const [modelType, model] of Object.entries(this.models)) {
      // 최근 데이터로 학습
      const recentData = this.trainingData.slice(-100);

      for (const data of recentData) {
        await this.updateModels(modelType, data.input, data.output);
      }
    }

    // 학습 결과 발행
    moduleEventBus.emit('learning-cycle-completed', {
      models: this.getModelStatus(),
      timestamp: new Date().toISOString()
    });
  }

  // 모델 상태 가져오기
  getModelStatus() {
    const status = {};

    for (const [name, model] of Object.entries(this.models)) {
      status[name] = {
        accuracy: model.accuracy,
        patternCount: model.patterns.length,
        lastUpdate: model.patterns[model.patterns.length - 1]?.timestamp
      };
    }

    return status;
  }

  // 현재 컨텍스트 가져오기
  getCurrentContext() {
    return {
      timestamp: Date.now(),
      activeSpec: 'hunter-beast-mastery', // 실제로는 동적으로
      performance: this.performanceMetrics.get('current') || {}
    };
  }

  // 액션 타이밍 분석
  analyzeActionTiming(actions) {
    const timings = [];

    for (let i = 1; i < actions.length; i++) {
      timings.push(actions[i].timestamp - actions[i - 1].timestamp);
    }

    return {
      avg: timings.reduce((a, b) => a + b, 0) / timings.length,
      min: Math.min(...timings),
      max: Math.max(...timings)
    };
  }

  // 컨텍스트 요약
  summarizeContext(actions) {
    return {
      startTime: actions[0].timestamp,
      endTime: actions[actions.length - 1].timestamp,
      uniqueSkills: [...new Set(actions.map(a => a.skill).filter(Boolean))].length
    };
  }

  // 리소스 패턴 추출
  extractResourcePattern(resources) {
    return resources.map(r => ({
      type: r.type,
      amount: r.amount,
      timestamp: r.timestamp
    }));
  }

  // 버프 패턴 추출
  extractBuffPattern(buffs) {
    return buffs.map(b => ({
      name: b.name,
      uptime: b.uptime,
      applications: b.applications
    }));
  }

  // 성능 메트릭 업데이트
  updatePerformanceMetrics(metrics) {
    for (const [key, value] of Object.entries(metrics)) {
      this.performanceMetrics.set(key, value);
    }

    // 학습 데이터에 추가
    this.addTrainingData({
      input: { type: 'performance-metrics' },
      output: metrics,
      context: this.getCurrentContext()
    });
  }

  // 정리
  destroy() {
    this.isLearning = false;
    if (this.learningInterval) {
      clearInterval(this.learningInterval);
    }
    this.patterns.clear();
    this.learningHistory = [];
    this.trainingData = [];
  }
}

export default new LearningAIPatternAnalyzer();