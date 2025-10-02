# TWW Season 3 전체 스킬 데이터 수집 계획

## 현재 상태 분석
- **전체 스킬**: 491개 (대부분 기본 스킬)
- **누락 데이터**: 특성, 영웅 특성, 전문화 스킬, PvP 특성
- **클래스 정보 누락**: 374개 (76%)

## 수집 대상 (TWW Season 3 기준)

### 1. 클래스별 기본 스킬 (Baseline Abilities)
각 클래스당 약 15-25개
- 13개 클래스 × 20개 평균 = 약 260개

### 2. 전문화별 고유 스킬 (Specialization Abilities)
각 전문화당 약 10-15개
- 39개 전문화 × 12개 평균 = 약 468개

### 3. 클래스 특성 트리 (Class Talent Tree)
각 클래스당 약 30-40개 특성
- 13개 클래스 × 35개 평균 = 약 455개

### 4. 전문화 특성 트리 (Specialization Talent Tree)
각 전문화당 약 25-35개 특성
- 39개 전문화 × 30개 평균 = 약 1,170개

### 5. 영웅 특성 (Hero Talents) - TWW 신규
각 영웅 특성 트리당 11개 노드
- 39개 전문화 × 2개 트리 × 11개 = 약 858개

### 6. PvP 특성 (PvP Talents)
각 전문화당 약 15-20개
- 39개 전문화 × 17개 평균 = 약 663개

## 예상 총 스킬 수: 약 3,874개

## 수집 우선순위

### Phase 1: 핵심 스킬 (즉시)
1. 클래스 기본 스킬 완성
2. 전문화 고유 스킬
3. 주요 특성 (메타 빌드)

### Phase 2: 특성 트리 (다음)
1. 클래스 특성 트리 전체
2. 전문화 특성 트리 전체
3. 선택률 높은 특성 우선

### Phase 3: TWW 콘텐츠 (그 다음)
1. 영웅 특성 전체
2. TWW 신규/변경 스킬
3. 시즌 3 밸런스 변경사항

### Phase 4: PvP 콘텐츠 (선택적)
1. PvP 특성
2. PvP 전용 스킬
3. 아레나/전장 특화

## 수집 방법

### 1. Wowhead 크롤링 강화
- 특성 계산기 페이지 크롤링
- 영웅 특성 페이지 크롤링
- 전문화별 가이드 크롤링

### 2. 게임 데이터 직접 추출
- Wowhead의 talent calculator API 활용
- 스킬 ID 매핑 테이블 구축

### 3. 데이터 구조 확장
```javascript
{
  "skillId": {
    // 기본 정보
    "id": "string",
    "name": "string",
    "koreanName": "string",
    "englishName": "string",
    "icon": "string",

    // 분류 정보
    "class": "Warrior|Paladin|...",
    "specialization": ["Arms", "Fury", "Protection"],
    "category": "baseline|talent|heroTalent|pvp",
    "type": "active|passive|proc",
    "school": "physical|holy|fire|...",

    // 특성 정보
    "talentTree": "class|spec",
    "talentRow": 1-10,
    "talentColumn": 1-3,
    "prerequisite": ["skillId"],
    "ranks": 1-3,

    // 영웅 특성 정보 (TWW)
    "heroTree": "herald_of_the_sun|lightsmith|templar|...",
    "heroNode": 1-11,

    // 메커니즘
    "cooldown": "string",
    "resource": {},
    "range": "string",
    "castTime": "string",

    // 설명
    "description": "string",
    "englishDescription": "string",

    // 메타데이터
    "patch": "11.2.0",
    "lastUpdated": "ISO date",
    "source": "wowhead|game|manual"
  }
}
```

## 자동화 스크립트 필요

### 1. `collect-all-talents.js`
- 모든 클래스/전문화의 특성 수집

### 2. `collect-hero-talents.js`
- TWW 영웅 특성 전체 수집

### 3. `collect-pvp-talents.js`
- PvP 특성 수집

### 4. `merge-and-classify.js`
- 수집된 데이터 통합 및 분류

## 예상 소요 시간
- Phase 1: 2-3시간
- Phase 2: 4-5시간
- Phase 3: 3-4시간
- Phase 4: 2-3시간
- 총: 11-15시간

## 다음 단계
1. Playwright 크롤러 강화
2. 특성 계산기 API 연동
3. 자동 분류 시스템 구축
4. 데이터 검증 및 통합