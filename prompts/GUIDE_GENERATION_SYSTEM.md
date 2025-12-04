# WoW 가이드 생성 시스템 v1.0

## 개요

이 문서는 WoW 가이드 생성 시 Claude가 따라야 할 규칙과 워크플로우를 정의합니다.

---

## 🎯 핵심 원칙

1. **KB 기반**: 모든 스킬/메커니즘 정보는 Knowledge Base에서 가져옴
2. **지침 준수**: 각 가이드 유형별 프롬프트 지침 필수 참조
3. **Magic MCP 필수**: 디자인/UI는 절대 임의 생성 금지, 반드시 MCP 검색 후 적용

---

## 📐 디자인 워크플로우 (필수)

### ⚠️ 절대 규칙
> **디자인/UI 컴포넌트는 절대 임의로 생성하지 않는다.**
> **반드시 Magic MCP로 검색 후 참고하여 생성한다.**

### 단계별 프로세스

```
1. 가이드 생성 요청 받음
   ↓
2. 필요한 컴포넌트 목록 파악
   - SkillCard (스킬 표시)
   - PriorityTable (우선순위 테이블)
   - Timeline (로테이션 타임라인)
   - ComparisonCard (비교 카드)
   - ConceptBlock (개념 설명)
   등
   ↓
3. Magic MCP로 유사 컴포넌트 검색
   도구: @21st-dev/magic:21st_magic_component_inspiration
   
   예시 검색어:
   - "skill card icon" → 스킬 카드
   - "priority table" → 우선순위 테이블  
   - "timeline horizontal" → 타임라인
   - "comparison card" → 비교 카드
   - "info block callout" → 개념 블록
   ↓
4. 검색 결과 분석
   - 구조 파악
   - 스타일 패턴 추출
   - Tailwind 클래스 참고
   ↓
5. WoW 테마 적용하여 생성
   - 다크 배경 (#0D0D14, #1A1A2E, #1E1E32)
   - 직업 색상 (악마사냥꾼: #A330C9)
   - 글로우 이펙트
   - 호버 애니메이션
```

### Magic MCP 검색 예시

```javascript
// 스킬 카드 검색
@21st-dev/magic:21st_magic_component_inspiration
- message: "Find card components with icon, title, description for gaming"
- searchQuery: "skill card icon"

// 테이블 검색  
@21st-dev/magic:21st_magic_component_inspiration
- message: "Find priority or ranking table components"
- searchQuery: "priority ranking table"

// 타임라인 검색
@21st-dev/magic:21st_magic_component_inspiration
- message: "Find horizontal timeline or step components"
- searchQuery: "timeline steps horizontal"
```

---

## 📁 가이드 유형별 프롬프트

### 위치
`/prompts/guides/` 폴더에 전문화별 프롬프트 저장

### 명명 규칙
`{직업}-{전문화}-{가이드유형}.md`

예시:
- `DemonHunter-Havoc-Complete.md`
- `Mage-Arcane-Quickstart.md`
- `Warrior-Arms-ST.md`

---

## 📊 필수 참조 데이터

### Knowledge Base 경로
```
/src/knowledge-base/{전문화}/
  ├── skills/        # 스킬 데이터
  ├── rotations/     # 로테이션 정보
  └── mechanisms/    # 메커니즘 설명
```

### 디자인 시스템 경로
```
/src/components/design-system/
  ├── tokens.js      # 색상, 타이포그래피
  ├── SkillCard.jsx  # 스킬 카드
  └── ...
```

---

## 🔄 가이드 생성 전체 플로우

```
[요청 접수]
    ↓
[1] 해당 전문화 프롬프트 파일 확인
    /prompts/guides/{직업}-{전문화}-{유형}.md
    ↓
[2] KB에서 스킬/메커니즘 데이터 로드
    /src/knowledge-base/{전문화}/
    ↓
[3] 가이드 구조 결정
    - 섹션 구성
    - 필요 컴포넌트 목록
    ↓
[4] Magic MCP로 UI 컴포넌트 검색 ⭐ 필수
    @21st-dev/magic:21st_magic_component_inspiration
    ↓
[5] 검색 결과 기반 컴포넌트 생성
    - WoW 테마 적용
    - 직업 색상 적용
    ↓
[6] 가이드 페이지 조립
    - 컴포넌트 배치
    - 데이터 바인딩
    ↓
[출력]
```

---

## ⚠️ 금지 사항

1. ❌ Magic MCP 검색 없이 UI 임의 생성
2. ❌ KB 데이터 없이 스킬 정보 추측
3. ❌ 프롬프트 지침 무시
4. ❌ 하드코딩된 스킬 데이터 사용

---

## ✅ 체크리스트

가이드 생성 전 확인:
- [ ] 해당 프롬프트 파일 존재 확인
- [ ] KB 데이터 로드 완료
- [ ] Magic MCP로 필요 컴포넌트 검색 완료
- [ ] 직업 색상 토큰 확인

---

## 버전 히스토리

- v1.0 (2024-12-01): 최초 작성, Magic MCP 필수 규칙 추가
