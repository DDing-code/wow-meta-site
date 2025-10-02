# 스킬 데이터베이스 업데이트 가이드

## 현재 상태
- 전체 스킬: 830개
- 상세 정보 필요: 615개
- 업데이트 완료: 10개 (테스트)

## 업데이트 형식

### 필수 필드
```json
{
  "id": "스킬ID",
  "krName": "한국어 스킬명",
  "description": "상세한 스킬 설명 (효과, 메커니즘 포함)"
}
```

### 추가 상세 필드 (가능한 경우)
```json
{
  "cooldown": "재사용 대기시간 (예: 2분, 30초)",
  "range": "사정거리 (예: 40미터, 근접, 자신)",
  "castTime": "시전 시간 (예: 즉시 시전, 2초)",
  "duration": "지속시간 (예: 10초, 영구)",
  "resource": "자원 소모량 (예: 20 분노, 4% 기본 마나, 60 기력)"
}
```

## Wowhead 데이터 수집 방법

### 수동 방법
1. https://ko.wowhead.com/spell=[스킬ID] 접속
2. 스킬 설명 및 상세 정보 확인
3. update-skills-batch.js 파일의 detailedUpdates 객체에 추가

### 자동화 스크립트 (Playwright)
```javascript
// 브라우저 자동화로 대량 수집
const playwright = require('playwright');
const browser = await playwright.chromium.launch();
const page = await browser.newPage();

for (const skillId of skillIds) {
  await page.goto(`https://ko.wowhead.com/spell=${skillId}`);
  // 페이지에서 정보 추출
  // ...
}
```

## 업데이트 우선순위

### 1순위: 핵심 클래스 스킬 (전사, 성기사, 사냥꾼)
- 기본 공격 스킬
- 주요 방어 스킬
- 버프/디버프 스킬

### 2순위: 공용 스킬
- 종족 특성
- 전문 기술 관련
- 탈것/애완동물 스킬

### 3순위: 특수 스킬
- 레이드 보스 스킬
- PvP 전용 스킬
- 이벤트 스킬

## 스크립트 실행

### 분석 스크립트
```bash
# 간략한 설명 스킬 찾기
node analyze-skills-detailed.js

# 결과 확인
cat skills-need-detail.json
```

### 업데이트 스크립트
```bash
# 배치 업데이트 실행
node update-skills-batch.js

# 업데이트 로그 확인
cat skill-update-log.json
```

## 파일 위치
- 메인 데이터: `src/data/wowhead-full-descriptions-complete.json`
- 업데이트 필요 목록: `skills-need-detail.json`
- 업데이트 스크립트: `update-skills-batch.js`
- 분석 스크립트: `analyze-skills-detailed.js`

## 진행 상황 추적
- 전체 615개 중 10개 완료 (1.6%)
- 나머지 605개는 점진적으로 업데이트 필요
- 우선순위에 따라 중요 스킬부터 업데이트

## 주의사항
1. 스킬명은 원래 번역 유지 (사용자 피드백 반영)
2. 모든 번역은 ko.wowhead.com 공식 번역 기준
3. 토큰 효율성을 위해 배치 처리 권장
4. 업데이트 후 반드시 로그 저장