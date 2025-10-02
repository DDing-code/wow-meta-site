const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const NodeCache = require('node-cache');

// 환경변수 로드
dotenv.config();

const app = express();
const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL || 3600) });

// 미들웨어
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB 연결 (옵션)
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ MongoDB 연결 성공');
    } else {
      console.log('⚠️ MongoDB URI가 설정되지 않았습니다. 메모리 모드로 실행합니다.');
    }
  } catch (err) {
    console.error('❌ MongoDB 연결 실패:', err.message);
    console.log('⚠️ MongoDB 없이 메모리 모드로 실행합니다.');
    console.log('💡 MongoDB Atlas 설정: https://www.mongodb.com/cloud/atlas');
  }
};

connectDB();

// 라우트 임포트
const aiRoutes = require('./routes/ai');
const warcraftLogsRoutes = require('./routes/warcraftlogs');
const learningRoutes = require('./routes/learning');
const realtimeRoutes = require('./routes/realtime');
const bossLearningRoutes = require('./routes/boss-learning');
const iconRoutes = require('./routes/iconRoutes');
const blizzardRoutes = require('./routes/blizzard');

// 루트 라우트 - API 정보 표시
app.get('/', (req, res) => {
  res.json({
    message: 'WoW Meta AI Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      ai: '/api/ai/*',
      warcraftlogs: '/api/warcraftlogs/*',
      learning: '/api/learning/*',
      realtime: '/api/realtime/*'
    },
    documentation: {
      learning: {
        'POST /api/learning/save': '학습 데이터 저장',
        'POST /api/learning/save-batch': '배치 저장',
        'GET /api/learning/top10/:class/:spec': '상위 10% 로그 조회',
        'GET /api/learning/statistics/:class/:spec': '클래스 통계',
        'GET /api/learning/recent': '최근 학습 데이터'
      }
    }
  });
});

// 라우트 등록
app.use('/api/ai', aiRoutes);
app.use('/api/warcraftlogs', warcraftLogsRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/realtime', realtimeRoutes);
app.use('/api/boss-learning', bossLearningRoutes);
app.use('/api/icons', iconRoutes);
app.use('/api/blizzard', blizzardRoutes);

// 헬스체크
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    fileDB: 'active',
    timestamp: new Date()
  });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`📊 MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/wow_meta_ai'}`);
});