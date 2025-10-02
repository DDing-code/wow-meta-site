# 🤖 WoW AI 학습 시스템 구현 가이드

## 📋 목차
1. [시스템 개요](#시스템-개요)
2. [설치 및 설정](#설치-및-설정)
3. [실행 방법](#실행-방법)
4. [API 사용법](#api-사용법)
5. [학습 설정](#학습-설정)
6. [모니터링](#모니터링)

---

## 🎯 시스템 개요

### 핵심 기능
- **39개 특성**: 13개 직업 x 3개 특성 전문가 AI
- **실시간 학습**: 10분마다 자동 학습 (기존 1시간 → 10분)
- **대량 데이터 처리**: 한 번에 100개 로그 동시 처리
- **8개 데이터 소스**: WarcraftLogs, Raider.io, SimulationCraft 등
- **심층 분석**: 5단계 레이어 분석
- **병렬 처리**: 멀티스레드 학습

---

## 🚀 설치 및 설정

### 1. 필수 패키지 설치

```bash
cd wow-meta-site
npm install
```

### 2. 환경 변수 설정 (.env 파일)

```env
# WarcraftLogs API
REACT_APP_WARCRAFTLOGS_CLIENT_ID=your_client_id
REACT_APP_WARCRAFTLOGS_CLIENT_SECRET=your_client_secret

# Raider.io API
REACT_APP_RAIDERIO_API_KEY=your_api_key

# Database (선택사항)
REACT_APP_DB_HOST=localhost
REACT_APP_DB_USER=root
REACT_APP_DB_PASSWORD=password
REACT_APP_DB_NAME=wow_ai
```

### 3. 데이터베이스 설정 (선택사항)

```bash
mysql -u root -p < src/database/schema.sql
```

---

## 💻 실행 방법

### 방법 1: React 앱에서 실행

```javascript
// App.js에 추가
import AIDashboard from './components/AIDashboard';

// 라우트 추가
<Route path="/ai-dashboard" element={<AIDashboard />} />
```

앱 실행:
```bash
npm start
# http://localhost:3000/ai-dashboard 접속
```

### 방법 2: 독립 실행 (콘솔)

```javascript
// src/ai/runAI.js 파일 생성
import EnhancedAICoordinator from './EnhancedAICoordinator';

async function runAI() {
  const coordinator = new EnhancedAICoordinator();

  // AI 시작
  const result = await coordinator.start();
  console.log('AI 시작:', result);

  // 10분 후 첫 학습 사이클
  setTimeout(() => {
    console.log('첫 학습 사이클 완료');
  }, 600000);
}

runAI();
```

실행:
```bash
node src/ai/runAI.js
```

### 방법 3: API 서버로 실행

```javascript
// server.js 생성
const express = require('express');
const app = express();
const EnhancedAICoordinator = require('./src/ai/EnhancedAICoordinator');

const coordinator = new EnhancedAICoordinator();

// AI 시작 엔드포인트
app.post('/api/ai/start', async (req, res) => {
  const result = await coordinator.start();
  res.json(result);
});

// AI 중지 엔드포인트
app.post('/api/ai/stop', async (req, res) => {
  const result = await coordinator.stop();
  res.json(result);
});

// 수동 학습 트리거
app.post('/api/ai/learn', async (req, res) => {
  const { targetClass, logCount = 100 } = req.body;
  const result = await coordinator.triggerManualLearning({
    targetClass,
    logCount,
    deepAnalysis: true
  });
  res.json(result);
});

// 전략 요청
app.get('/api/ai/strategy/:class/:spec', async (req, res) => {
  const { class: className, spec } = req.params;
  const { encounter, phase } = req.query;

  const strategy = await coordinator.getStrategy({
    class: className,
    spec,
    encounter,
    phase
  });

  res.json(strategy);
});

// 가이드 생성
app.get('/api/ai/guide/:class/:spec', async (req, res) => {
  const guide = await coordinator.generateGuide({
    class: req.params.class,
    spec: req.params.spec,
    content: 'all',
    format: 'detailed'
  });

  res.json(guide);
});

app.listen(3001, () => {
  console.log('AI API 서버 실행 중: http://localhost:3001');
  coordinator.start(); // 서버 시작시 AI 자동 시작
});
```

실행:
```bash
node server.js
```

---

## 🔧 API 사용법

### 1. AI 시작/중지

```javascript
// AI 시작
const coordinator = new EnhancedAICoordinator();
await coordinator.start();

// AI 중지
await coordinator.stop();
```

### 2. 실시간 전략 요청

```javascript
const strategy = await coordinator.getStrategy({
  class: 'warrior',
  spec: 'arms',
  encounter: 'dimensius',
  phase: 'phase2',
  raidComp: ['shaman_elemental', 'paladin_holy'],
  affixes: ['tyrannical', 'fortified'],
  urgency: 'normal' // normal, urgent, critical
});

console.log(strategy);
// {
//   immediate: ['거인의 일격 사용', '칼날폭풍 준비'],
//   upcoming: ['10초 후 아바타 사용'],
//   positioning: { x: 100, y: 200 },
//   cooldowns: { avatar: 'ready', bladestorm: '15s' },
//   priority: ['mortalStrike', 'overpower', 'slam'],
//   confidence: 0.92
// }
```

### 3. 수동 학습 트리거

```javascript
const learningResult = await coordinator.triggerManualLearning({
  targetClass: 'shaman',     // null이면 모든 클래스
  dataSource: 'warcraftlogs', // 'all'이면 모든 소스
  logCount: 200,              // 학습할 로그 수
  deepAnalysis: true          // 심층 분석 여부
});

console.log(`${learningResult.processedLogs}개 로그 처리 완료`);
console.log(`${learningResult.improvements.length}개 개선 사항 발견`);
```

### 4. 가이드 생성

```javascript
const guide = await coordinator.generateGuide({
  class: 'deathknight',
  spec: 'unholy',
  content: 'all',        // all, rotation, gear, talents
  format: 'detailed',    // detailed, summary, infographic
  language: 'ko'
});

console.log(guide);
// {
//   metadata: { class, spec, patch, updated, confidence },
//   content: {
//     rotation: [...],
//     gear: {...},
//     talents: {...},
//     stats: {...}
//   }
// }
```

---

## ⚙️ 학습 설정

### 학습 강도 조절

```javascript
// EnhancedAICoordinator.js 수정
this.learningConfig = {
  // 학습 빈도 (밀리초)
  autoLearnInterval: 300000,  // 5분마다 (더 빠른 학습)

  // 한 번에 처리할 로그 수
  batchSize: 200,  // 대량 처리 (기본 100)

  // 병렬 처리
  parallelProcessing: true,

  // 심층 학습 설정
  deepLearning: {
    enabled: true,
    layers: 10,      // 분석 깊이 증가 (기본 5)
    iterations: 20,  // 반복 학습 증가 (기본 10)
    crossValidation: true
  },

  // 실시간 학습
  realtimeLearning: {
    enabled: true,
    streamInterval: 2000,  // 2초마다 (기본 5초)
    adaptiveThreshold: 0.6 // 낮은 임계값 (더 많은 학습)
  }
};
```

### 데이터 소스 추가

```javascript
// 새 데이터 소스 추가
this.dataSources.set('custom_source', {
  url: 'https://your-api.com',
  apiKey: 'your_key',
  priority: 4,
  fetchData: async (count) => {
    // 커스텀 데이터 가져오기
    const response = await fetch(`${url}/logs?limit=${count}`);
    return response.json();
  }
});
```

---

## 📊 모니터링

### 대시보드 접속

1. 웹 브라우저에서 `http://localhost:3000/ai-dashboard` 접속
2. '시작' 버튼 클릭
3. 실시간 통계 확인:
   - 처리된 로그 수
   - 학습 시간
   - 평균 정확도
   - 클래스별 DPS 순위
   - 학습 로그

### 콘솔 모니터링

```javascript
// 성능 보고서 생성
const report = coordinator.generatePerformanceReport();
console.log(report);

// 통계 확인
console.log('총 처리 로그:', coordinator.statistics.totalLogsProcessed);
console.log('평균 정확도:', coordinator.statistics.averageAccuracy);
console.log('최강 클래스:', coordinator.statistics.topPerformingClass);
```

### 로그 파일 저장

```javascript
// 학습 로그를 파일로 저장
const fs = require('fs');

coordinator.learningQueue.forEach(task => {
  fs.appendFileSync('ai_learning.log',
    `${new Date().toISOString()} - ${JSON.stringify(task)}\n`
  );
});
```

---

## 🔍 문제 해결

### 메모리 부족

```javascript
// 배치 크기 줄이기
this.learningConfig.batchSize = 50;

// 병렬 처리 비활성화
this.learningConfig.parallelProcessing = false;
```

### API 제한

```javascript
// 학습 빈도 줄이기
this.learningConfig.autoLearnInterval = 1800000; // 30분
```

### 정확도 낮음

```javascript
// 심층 학습 강화
this.learningConfig.deepLearning.layers = 10;
this.learningConfig.deepLearning.iterations = 30;
```

---

## 📈 성능 최적화

### 1. Redis 캐싱 (선택사항)

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

// 전략 캐싱
async function getCachedStrategy(key) {
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);

  const strategy = await coordinator.getStrategy({...});
  await client.setex(key, 300, JSON.stringify(strategy)); // 5분 캐시
  return strategy;
}
```

### 2. Worker Threads 사용

```javascript
const { Worker } = require('worker_threads');

// 병렬 학습 워커
function runLearningWorker(logs) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./learningWorker.js', {
      workerData: { logs }
    });

    worker.on('message', resolve);
    worker.on('error', reject);
  });
}
```

---

## 🎮 실제 사용 예시

### 레이드 중 실시간 조언

```javascript
// 실시간 전투 중 조언 요청
async function getRaidAdvice(playerClass, playerSpec, boss, phase) {
  const strategy = await coordinator.getStrategy({
    class: playerClass,
    spec: playerSpec,
    encounter: boss,
    phase: phase,
    urgency: 'urgent'
  });

  // 즉시 실행할 행동 표시
  console.log('지금:', strategy.immediate);

  // 다음 행동 준비
  console.log('준비:', strategy.upcoming);

  return strategy;
}

// 사용
getRaidAdvice('warrior', 'arms', 'dimensius', 'phase2');
```

### 신화+ 던전 공략

```javascript
async function getMythicPlusStrategy(dungeon, keyLevel, affixes, playerComp) {
  const strategies = [];

  for (const player of playerComp) {
    const strategy = await coordinator.getStrategy({
      class: player.class,
      spec: player.spec,
      encounter: dungeon,
      affixes: affixes
    });

    strategies.push({
      player: player.name,
      strategy: strategy
    });
  }

  return strategies;
}
```

---

## 📱 모바일 앱 연동 (선택사항)

```javascript
// React Native 앱에서 API 호출
const getStrategyFromAI = async () => {
  const response = await fetch('http://your-server:3001/api/ai/strategy/warrior/arms?encounter=dimensius&phase=2');
  const strategy = await response.json();

  // 앱에 표시
  setCurrentStrategy(strategy);
};
```

---

## 🚨 주의사항

1. **API 키 보안**: 절대 GitHub에 API 키를 커밋하지 마세요
2. **리소스 관리**: 장시간 실행시 메모리 사용량 모니터링 필요
3. **데이터 백업**: 학습 데이터는 주기적으로 백업하세요
4. **버전 관리**: 패치 업데이트시 AI 재학습 필요

---

## 🤝 기여하기

AI 시스템 개선에 기여하고 싶다면:

1. 새로운 직업 전문가 AI 추가
2. 데이터 소스 확장
3. 학습 알고리즘 개선
4. 버그 리포트

GitHub Issues나 Pull Request를 통해 기여해주세요!