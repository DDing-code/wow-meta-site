# 🚀 백엔드 서버 및 DB 설정 가이드

## 📋 필요한 것들

1. **MongoDB** (로컬 또는 클라우드)
2. **Node.js** (이미 설치됨)
3. **WarcraftLogs API 키** (실제 데이터용)

## 🗄️ MongoDB 설치

### 옵션 1: 로컬 MongoDB 설치 (Windows)

1. MongoDB 다운로드: https://www.mongodb.com/try/download/community
2. 설치 후 MongoDB Compass 실행 (GUI 도구)
3. 기본 연결: `mongodb://localhost:27017`

### 옵션 2: MongoDB Atlas (무료 클라우드) - 추천!

1. https://www.mongodb.com/cloud/atlas 가입
2. 무료 클러스터 생성 (M0 Sandbox)
3. 연결 문자열 복사
4. `server/.env` 파일에 붙여넣기:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wow_meta_ai?retryWrites=true&w=majority
```

## 🔑 WarcraftLogs API 키 발급

1. https://www.warcraftlogs.com 로그인
2. Settings → API Clients 이동
3. "Create Client" 클릭
4. 정보 입력:
   - Name: WoW Meta AI
   - Redirect URL: http://localhost:3000
5. Client ID와 Secret 복사
6. `server/.env` 파일에 추가:
```
WARCRAFTLOGS_CLIENT_ID=실제_클라이언트_ID
WARCRAFTLOGS_CLIENT_SECRET=실제_시크릿_키
```

## 🖥️ 서버 실행

### 1. 백엔드 서버 설치 및 실행

```bash
# 터미널 1 - 백엔드 서버
cd server
npm install
npm start
```

서버가 http://localhost:5000 에서 실행됩니다.

### 2. 프론트엔드 실행 (기존)

```bash
# 터미널 2 - React 앱
cd wow-meta-site
npm start
```

## ✅ 연결 확인

1. 브라우저에서 http://localhost:5000/health 접속
2. MongoDB 연결 상태 확인:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "..."
}
```

## 📊 DB 데이터 확인

### MongoDB Compass 사용:
1. MongoDB Compass 실행
2. 연결: `mongodb://localhost:27017` (또는 Atlas URL)
3. `wow_meta_ai` 데이터베이스 선택
4. `learning_data` 컬렉션 확인

### 저장되는 데이터:
- 모든 학습 로그 (상위 10%)
- 로테이션 분석 결과
- DPS/HPS 성능 데이터
- AI 분석 결과

## 🔧 환경변수 설정 (.env)

`server/.env` 파일:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/wow_meta_ai

# WarcraftLogs API (실제 키 필요!)
WARCRAFTLOGS_CLIENT_ID=your_actual_client_id
WARCRAFTLOGS_CLIENT_SECRET=your_actual_secret

# 서버 설정
PORT=5000
CLIENT_URL=http://localhost:3000
CACHE_TTL=3600
```

`wow-meta-site/.env` 파일:
```env
# 백엔드 서버 URL
REACT_APP_API_URL=http://localhost:5000

# 기존 설정들...
```

## 🚨 트러블슈팅

### MongoDB 연결 실패:
- MongoDB 서비스 실행 확인
- 방화벽 설정 확인
- Atlas 사용 시 IP 화이트리스트 확인

### WarcraftLogs API 오류:
- API 키 유효성 확인
- Rate limit 확인 (시간당 제한)
- 올바른 보스 ID 사용

### CORS 오류:
- 백엔드 서버 실행 확인
- CLIENT_URL 설정 확인

## 📈 실시간 모니터링

AI 학습 데이터가 실시간으로 저장되는 것을 확인:
1. MongoDB Compass에서 `learning_data` 컬렉션 열기
2. AI 시스템 실행 시 데이터가 추가되는지 확인
3. 상위 10% 로그만 저장되는지 확인

## 🎯 다음 단계

1. **실제 WarcraftLogs 연동**: API 키 발급 후 실제 데이터 수집
2. **학습 알고리즘 개선**: 더 정교한 패턴 인식
3. **실시간 대시보드**: 학습 진행상황 시각화
4. **백업 시스템**: 정기적인 DB 백업

---

문제가 있으면 GitHub Issues에 문의해주세요!