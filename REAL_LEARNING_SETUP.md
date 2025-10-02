# 🧠 실제 AI 학습 설정 가이드

## 현재 상태

**⚠️ 지금은 시뮬레이션 데이터로만 작동 중입니다!**
실제 WarcraftLogs 데이터로 학습하려면 아래 설정이 필요합니다.

## 실제 학습 활성화 방법

### 1단계: WarcraftLogs API 키 발급

1. https://www.warcraftlogs.com 접속
2. 로그인 후 상단 메뉴에서 "API Clients" 클릭
3. "Create Client" 버튼 클릭
4. 다음 정보 입력:
   - Name: `WoW AI Learning System`
   - Redirect URL: `http://localhost:3000`
5. Client ID와 Client Secret 복사

### 2단계: 환경 변수 설정

1. `.env.example` 파일을 `.env`로 복사
```bash
cp .env.example .env
```

2. `.env` 파일 편집:
```env
REACT_APP_WARCRAFTLOGS_CLIENT_ID=발급받은_client_id
REACT_APP_WARCRAFTLOGS_CLIENT_SECRET=발급받은_client_secret
```

### 3단계: 앱 재시작

```bash
npm start
```

### 4단계: AI Dashboard에서 확인

1. http://localhost:3000/ai-dashboard 접속
2. "시작" 버튼 클릭
3. 콘솔(F12)에서 학습 로그 확인

## 학습 상태 확인 방법

### 🟢 실제 학습 중 (성공)
콘솔에 다음 메시지가 표시됩니다:
```
📊 WarcraftLogs에서 100개 로그 가져오는 중...
✅ 50개 실제 로그 획득
✅ WarcraftLogs 인증 성공
🔄 강화 학습 사이클 시작
```

### 🔴 시뮬레이션 모드 (API 연결 실패)
콘솔에 다음 메시지가 표시됩니다:
```
❌ WarcraftLogs 인증 실패
⚠️ WarcraftLogs API 연결 실패 - Mock 데이터 사용 중
⚠️ Mock 데이터로 대체
```

## 학습 데이터 소스

### 현재 구현된 소스
- ✅ **WarcraftLogs**: 실제 레이드 로그 (API 키 필요)
- ⚠️ **Raider.io**: 미구현 (Mock 데이터 사용)
- ⚠️ **SimulationCraft**: 미구현 (Mock 데이터 사용)

### 학습 내용
- 각 직업/특성별 DPS 패턴
- 상위 플레이어들의 로테이션
- 보스별 전략 패턴
- 장비/특성 조합

## 학습 설정 조정

### 학습 빈도 변경
`src/ai/EnhancedAICoordinator.js` 파일에서:
```javascript
this.learningConfig = {
  autoLearnInterval: 600000, // 10분 → 원하는 시간(밀리초)
  batchSize: 100, // 한 번에 처리할 로그 수
  parallelProcessing: true
}
```

### 학습 강도 조정
- **빠른 학습**: `autoLearnInterval: 300000` (5분)
- **일반 학습**: `autoLearnInterval: 600000` (10분)
- **느린 학습**: `autoLearnInterval: 1800000` (30분)

## 문제 해결

### API 키가 있는데도 연결 안 될 때
1. API 키가 올바른지 확인
2. WarcraftLogs 계정이 활성화되어 있는지 확인
3. 네트워크 연결 확인
4. CORS 문제일 경우 프록시 설정 필요

### 메모리 사용량이 너무 높을 때
```javascript
// batchSize 줄이기
this.learningConfig.batchSize = 50; // 100 → 50
```

### 학습이 너무 느릴 때
```javascript
// 병렬 처리 확인
this.learningConfig.parallelProcessing = true;
// 심층 학습 비활성화
this.learningConfig.deepLearning.enabled = false;
```

## 학습 데이터 확인

### Chrome DevTools에서 확인
1. F12 → Network 탭
2. "warcraftlogs.com" 필터링
3. API 호출 확인

### localStorage에서 확인
1. F12 → Application → Local Storage
2. `ai_enhanced_global` 키 확인
3. 저장된 학습 데이터 확인

## 실제 학습 효과

### API 연결 성공시
- 실제 상위 플레이어 데이터 학습
- 최신 메타 전략 파악
- 각 보스별 최적 전략 학습
- 실시간 DPS 순위 업데이트

### API 연결 실패시 (현재 상태)
- 랜덤 시뮬레이션 데이터만 사용
- 실제 전략 학습 불가
- 고정된 패턴만 반복

## 추가 개발 필요 사항

### 단기 과제
- [ ] Raider.io API 연동
- [ ] 실제 로테이션 패턴 추출
- [ ] 보스별 전략 데이터베이스

### 장기 과제
- [ ] SimulationCraft 연동
- [ ] 실시간 전투 로그 스트리밍
- [ ] 머신러닝 모델 통합
- [ ] 커뮤니티 데이터 공유

---

**참고**: 현재는 API 키 없이도 작동하지만, 실제 학습 효과를 보려면 WarcraftLogs API 키가 필수입니다!