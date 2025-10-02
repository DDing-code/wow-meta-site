# WoW Meta Site 서버 관리 가이드

## 🚀 빠른 시작

### 배치 파일 사용법

프로젝트 루트 디렉토리에 있는 `.bat` 파일을 더블클릭하여 실행하세요.

## 📋 배치 파일 목록

### 1. **start-all.bat** (추천)
- 백엔드 서버와 프론트엔드를 모두 시작합니다
- 각각 별도의 창에서 실행됩니다
- 자동으로 브라우저를 엽니다

### 2. **stop-all.bat**
- 실행 중인 모든 서비스를 종료합니다
- 백엔드와 프론트엔드 모두 종료

### 3. **start-server.bat**
- 백엔드 서버만 시작 (포트 5003)
- API 서버 개발/테스트용

### 4. **stop-server.bat**
- 백엔드 서버만 종료

### 5. **start-frontend.bat**
- React 프론트엔드만 시작 (포트 3000)
- UI 개발/테스트용

### 6. **stop-frontend.bat**
- 프론트엔드만 종료

### 7. **check-status.bat**
- 현재 실행 상태 확인
- 각 서비스의 PID 표시

## 🔧 사용 시나리오

### 전체 개발 환경 시작
1. `start-all.bat` 더블클릭
2. 두 개의 cmd 창이 열립니다
3. 5초 후 브라우저가 자동으로 열립니다

### 서버만 재시작
1. `stop-server.bat` 실행
2. `start-server.bat` 실행

### 상태 확인
1. `check-status.bat` 실행
2. 실행 중인 서비스와 PID 확인

### 전체 종료
1. `stop-all.bat` 실행
2. 또는 각 cmd 창에서 Ctrl+C

## 📝 주의사항

- 포트 충돌 시 기존 프로세스를 먼저 종료하세요
- 관리자 권한이 필요할 수 있습니다
- 서버 로그는 각 cmd 창에서 확인할 수 있습니다

## 🌐 접속 주소

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:5003
- **헬스체크**: http://localhost:5003/health

## 🔍 문제 해결

### 포트가 이미 사용 중일 때
```bash
# 상태 확인
check-status.bat

# 강제 종료
stop-all.bat
```

### 서버가 시작되지 않을 때
1. `npm install` 실행 확인
2. `server/.env` 파일 확인
3. Node.js 버전 확인 (v14 이상)

## 📚 API 엔드포인트

- `/api/learning/*` - AI 학습 데이터
- `/api/realtime/*` - 실시간 랭킹
- `/api/icons/*` - 아이콘 서비스
- `/api/warcraftlogs/*` - WarcraftLogs 연동