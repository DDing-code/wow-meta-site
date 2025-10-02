const mongoose = require('mongoose');

// AI 학습 데이터 스키마
const learningDataSchema = new mongoose.Schema({
  // 기본 정보
  logId: {
    type: String,
    required: true,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  patch: {
    type: String,
    default: '11.2'
  },
  raid: {
    type: String,
    default: 'Manaforge Omega'
  },
  difficulty: {
    type: String,
    enum: ['Normal', 'Heroic', 'Mythic'],
    default: 'Mythic'
  },

  // 클래스/스펙 정보
  class: {
    type: String,
    required: true
  },
  spec: {
    type: String,
    required: true
  },

  // 성능 데이터
  dps: {
    type: Number,
    required: true
  },
  hps: {
    type: Number,
    default: 0
  },
  percentile: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },

  // 로테이션 분석
  rotationAnalysis: {
    opener: [{
      ability: String,
      timing: String,
      reason: String
    }],
    sustained: [{
      ability: String,
      condition: String,
      reason: String
    }],
    burst: [{
      ability: String,
      timing: String,
      reason: String
    }],
    execute: [{
      ability: String,
      condition: String,
      reason: String
    }],
    efficiency: {
      type: Number,
      min: 0,
      max: 1
    },
    tips: [String]
  },

  // 탤런트 빌드
  talentBuild: {
    loadout: String,
    classTree: [Number],
    specTree: [Number]
  },

  // 통계
  statistics: {
    deaths: Number,
    interrupts: Number,
    dispels: Number,
    damageTaken: Number,
    activity: Number
  },

  // 메타데이터
  source: {
    type: String,
    enum: ['warcraftlogs', 'simulation', 'manual'],
    default: 'simulation'
  },
  isTop10: {
    type: Boolean,
    default: false
  },
  isRealData: {
    type: Boolean,
    default: false
  },

  // AI 분석 결과
  aiAnalysis: {
    score: Number,
    improvements: [String],
    strengths: [String],
    weaknesses: [String],
    suggestions: [{
      type: String,
      severity: String,
      suggestion: String
    }]
  }
}, {
  timestamps: true,
  collection: 'learning_data'
});

// 인덱스
learningDataSchema.index({ class: 1, spec: 1, percentile: -1 });
learningDataSchema.index({ timestamp: -1 });
learningDataSchema.index({ patch: 1, raid: 1 });
learningDataSchema.index({ isTop10: 1 });

// 스태틱 메소드 - 상위 10% 로그만 가져오기
learningDataSchema.statics.getTop10Logs = function(className, spec, limit = 100) {
  return this.find({
    class: className,
    spec: spec,
    percentile: { $gte: 90 }
  })
  .sort({ percentile: -1, dps: -1 })
  .limit(limit);
};

// 스태틱 메소드 - 최근 학습 데이터
learningDataSchema.statics.getRecentLearning = function(hours = 24) {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.find({
    timestamp: { $gte: cutoff }
  }).sort({ timestamp: -1 });
};

// 스태틱 메소드 - 클래스별 통계
learningDataSchema.statics.getClassStatistics = async function(className, spec) {
  return this.aggregate([
    {
      $match: {
        class: className,
        spec: spec,
        percentile: { $gte: 90 }
      }
    },
    {
      $group: {
        _id: null,
        avgDPS: { $avg: '$dps' },
        maxDPS: { $max: '$dps' },
        minDPS: { $min: '$dps' },
        count: { $sum: 1 },
        avgPercentile: { $avg: '$percentile' }
      }
    }
  ]);
};

const LearningData = mongoose.model('LearningData', learningDataSchema);

module.exports = LearningData;