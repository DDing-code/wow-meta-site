# 가이드 제작 지침 검증 시스템 사용 가이드

> **⚠️ 중요**: 이 문서는 **가이드 템플릿 준수 검증**을 다룹니다.
> **번역 검증**에 대해서는 [`../TRANSLATION_RULES.md`](../TRANSLATION_RULES.md)를 참조하세요.

## 📊 검증 시스템 분류

| 시스템 | 목적 | 문서 | 스크립트 |
|--------|------|------|---------|
| **가이드 템플릿 검증** | GuideTemplate.js 준수, 더미 텍스트 제거 | 이 문서 | `validate-guide-creation.js` |
| **번역 검증** | 내부 DB 우선, Wowhead 검증, 신뢰도 계층 | `TRANSLATION_RULES.md` | `validate-translations.js` |

---

## 📌 개요

**문제**: 기존에는 "필수", "절대 금지" 키워드만 있어서 AI가 가이드 제작 지침을 따르지 않는 경우가 많았습니다.

**해결**: **3단계 자동 검증 시스템**을 통해 지침 준수를 강제합니다.

---

## 🎯 검증 시스템 목적

1. **GuideTemplate.js 사용 강제**: 다른 가이드 복사 방지
2. **복수 데이터 소스 교차 검증**: 단일 소스 의존 방지
3. **템플릿 키워드 잔류 검출**: "DUMMY_TEXT", "영웅특성1" 등
4. **영어 직역 방지**: "가시 사격" → "날카로운 사격"
5. **다른 클래스 키워드 검출**: 마법사 가이드에 "전사" 키워드
6. **필수 섹션 존재 확인**: 개요, 딜사이클, 특성, 스탯

---

## 🚦 3단계 검증 프로세스

### 1단계: 사전 검증 (Pre-Generation) - 가이드 생성 시작 전

**목적**: 가이드 제작 시작 전 기본 요구사항 확인

**실행**:
```bash
node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase pre
```

**검증 항목**:
- ✅ GuideTemplate.js를 사용했는지 확인
- ✅ 복수 데이터 소스(Wowhead + Maxroll) 명시 확인
- ✅ 클래스/전문화 메타데이터 존재 확인

**통과 기준**: 모든 항목 ✅, 하나라도 ❌면 다음 단계 진행 금지

**예시 출력**:
```
============================================================
  가이드 제작 지침 검증 (pre 단계)
============================================================

📋 사전 검증 시작...

❌ 2개의 문제 발견:

🔴 CRITICAL (즉시 수정 필수):

1. ❌ GuideTemplate.js를 사용하지 않았습니다. 다른 가이드를 복사한 것으로 보입니다.
   해결책: cp src/components/GuideTemplate.js src/components/YourGuide.js

2. ❌ 필수 데이터 소스 누락: Maxroll
   해결책: 가이드 주석에 참고한 URL을 명시하세요.

============================================================
```

---

### 2단계: 실시간 검증 (During-Generation) - 작성 중

**목적**: 각 섹션 완료 후 즉시 문제 검출

**실행**:
```bash
node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase during
```

**검증 항목**:
- ✅ 템플릿 키워드 잔류 검출 ("DUMMY_TEXT", "영웅특성1", "TODO:")
- ✅ 다른 클래스 키워드 검출 (마법사 가이드에 "전사" 키워드)
- ✅ 스킬 아이콘 누락 검출
- ✅ 영어 직역 검출 ("가시 사격" → "날카로운 사격")

**통과 기준**: CRITICAL 0개, HIGH 3개 이하

**예시 출력**:
```
============================================================
  가이드 제작 지침 검증 (during 단계)
============================================================

🔍 실시간 검증 시작...

❌ 3개의 문제 발견:

🔴 CRITICAL (즉시 수정 필수):

1. ❌ 템플릿 키워드가 1개 남아있습니다: 리소스
   해결책: GuideTemplate.js의 더미 텍스트를 모두 실제 데이터로 교체하세요.

🟠 HIGH (수정 권장):

1. ⚠️ 다른 클래스 키워드 발견: 전사
   해결책: mage 가이드인데 다른 클래스 내용이 섞여있는지 확인하세요.

🟡 MEDIUM (검토 필요):

1. ⚠️ 영어 용어가 8개 발견되었습니다. 한글로 번역이 필요합니다.
   해결책: 모든 스킬/특성명은 한글로 작성하세요.

============================================================
```

---

### 3단계: 사후 검증 (Post-Generation) - 작성 완료 후

**목적**: 최종 배포 전 완성도 확인

**실행**:
```bash
node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase post
```

**검증 항목**:
- ✅ 교차 검증 증거 확인 (주석에 Wowhead/Maxroll URL)
- ✅ 컴파일 성공 확인 (npm run build 권장 메시지)
- ✅ 필수 섹션 존재 확인 (개요, 딜사이클, 특성, 스탯)

**통과 기준**: 모든 항목 ✅, 컴파일 성공 필수

**예시 출력**:
```
============================================================
  가이드 제작 지침 검증 (post 단계)
============================================================

✅ 사후 검증 시작...

✅ 모든 검증 통과!

ℹ️  추가 확인사항:

1. ℹ️  컴파일 확인: npm run build를 실행하여 에러가 없는지 확인하세요.
   cd wow-meta-site && npm run build

============================================================
```

---

## 🔍 검증 항목 상세 설명

### 1. GuideTemplate.js 사용 확인

**목적**: 다른 가이드 직접 복사 방지

**검증 방법**:
- 파일 내용에 `⚠️ TODO`, `GuideTemplate`, `DUMMY_TEXT` 마커 존재 확인
- 없으면 → 다른 가이드를 복사했다고 판단 → CRITICAL 에러

**실제 사례**:
```javascript
// ❌ 잘못된 방법 (ArcaneMageGuide.js)
cp src/components/FuryWarriorGuide.js src/components/ArcaneMageGuide.js
// 결과: 150+ 전사 키워드 잔류, 2시간 수정 작업

// ✅ 올바른 방법
cp src/components/GuideTemplate.js src/components/ArcaneMageGuide.js
// 결과: 10분 내 완성
```

---

### 2. 복수 데이터 소스 확인

**목적**: 단일 소스 의존으로 인한 오류 방지

**검증 방법**:
- 파일 내용에서 `wowhead.com`, `maxroll.gg`, `icy-veins.com` URL 패턴 검색
- 최소 2개 이상 발견되어야 통과

**실제 사례** (Spellslinger):
```javascript
// ❌ 단일 소스 의존 (Maxroll만 사용)
// Maxroll에 Spellslinger 정보 없음 → 임의 작성 → "비전 조화 20중첩" 가짜 메커니즘 생성

// ✅ 복수 소스 교차 검증 (Wowhead + Maxroll)
// Wowhead에서 "Intuition 40% 확률" 확인 → 정확한 메커니즘 작성
```

---

### 3. 템플릿 키워드 잔류 검출

**목적**: 더미 텍스트 제거 확인

**검증 방법**:
- `DUMMY_TEXT`, `영웅특성1`, `영웅특성2`, `리소스`, `TODO:` 등 키워드 검색
- 발견 시 → CRITICAL 에러

**예시**:
```javascript
// ❌ 템플릿 키워드 잔류
tierSet: {
  '2set': '리소스를 15% 더 빠르게 생성합니다.'  // "리소스" 키워드 잔류
}

// ✅ 올바른 수정
tierSet: {
  '2set': '룬 마력을 15% 더 빠르게 생성합니다.'  // 실제 리소스명으로 교체
}
```

---

### 4. 다른 클래스 키워드 검출

**목적**: 복사-붙여넣기 실수 방지

**검증 방법**:
- 모든 클래스 키워드 목록: `['전사', '성기사', '사냥꾼', ...]`
- 현재 클래스 제외한 다른 클래스 키워드가 3번 이상 언급되면 → HIGH 에러

> **관련 규칙**: 이 검증은 [`TRANSLATION_RULES.md` Rule 4.5](../TRANSLATION_RULES.md#rule-45-잘못된-클래스-스킬-금지-no-wrong-class-skills)와 유사하지만, **다른 범위**를 다룹니다:
> - **이 문서 (가이드 검증)**: 가이드 내 "전사", "마법사" 같은 클래스명 키워드 검출
> - **TRANSLATION_RULES.md (번역 검증)**: 스킬 데이터가 잘못된 클래스에 속하는지 검증 (예: Death Knight 가이드에 Mage 스킬 발견)

**예시**:
```javascript
// ❌ 마법사 가이드에 전사 키워드 발견
// ArcaneMageGuide.js (마법사 가이드)
priority: [
  '학살자 스택 3개일 때...',  // "학살자" = 전사 영웅 특성
  '분노 30 이상일 때...',     // "분노" = 전사 리소스
]

// ✅ 올바른 수정
priority: [
  '성난태양 스택 3개일 때...',  // 마법사 영웅 특성
  '마나 30% 이상일 때...',      // 마법사 리소스
]
```

---

### 5. 영어 직역 검출

**목적**: 공식 번역 사용 강제

> **관련 규칙**: [`TRANSLATION_RULES.md` Rule 4.1 (영어 직역 금지)](../TRANSLATION_RULES.md#rule-41-영어-직역-금지-no-english-transliteration) 참조
> - **차이점**: TRANSLATION_RULES.md는 내부 DB 우선 확인 → Wowhead 검증 프로토콜을 다룸
> - **이 문서**: 가이드 내 잘못된 번역 패턴 검출 (가이드 레벨)

**검증 방법**:
- 흔한 오역 패턴 데이터베이스:
  ```javascript
  [
    { wrong: '가시 사격', correct: '날카로운 사격', english: 'Barbed Shot' },
    { wrong: '펫 광분', correct: '광기', english: 'Frenzy' },
    { wrong: '마무리 사격', correct: 'Kill Shot', english: 'Kill Shot' },
  ]
  ```
- 발견 시 → HIGH 에러 + 올바른 번역 제시

---

### 6. 스킬 아이콘 누락 검출

**목적**: 모든 스킬에 아이콘 필수

**검증 방법**:
- `skill: skillData.xxx` 패턴 검색
- 0개 발견 시 → HIGH 에러

---

### 7. 교차 검증 증거 확인

**목적**: 데이터 출처 명확화

**검증 방법**:
- `// Wowhead 검증:`, `// Maxroll 검증:` 주석 검색
- 없으면 → HIGH 에러

**예시**:
```javascript
// ✅ 올바른 교차 검증 증거
// Wowhead 검증: https://www.wowhead.com/guide/classes/mage/arcane/rotation-cooldowns-pve-dps
// Maxroll 확인: https://maxroll.gg/wow/class-guides/mage-arcane-pve-dps-guide

const opener = [
  skillData.mirrorimage,   // 4초 전
  skillData.evocation,     // 3초 전
  // ... (Wowhead 순서와 일치)
];
```

---

### 8. 필수 섹션 존재 확인

**목적**: 가이드 완성도 보장

**검증 방법**:
- `## 개요`, `## 딜사이클`, `## 특성`, `## 스탯` 섹션 존재 확인
- 누락 시 → HIGH 에러

---

## 🔗 관련 검증 시스템

### 번역 검증 시스템

**문서**: [`../TRANSLATION_RULES.md`](../TRANSLATION_RULES.md)
**스크립트**: `validate-translations.js`
**목적**: 스킬 번역의 정확성 검증

**주요 규칙**:
- **Rule 1.1**: 내부 DB 우선 확인 (MANDATORY)
- **Rule 1.2**: 신뢰도 계층 준수 (Tier S → A → B)
- **Rule 4.1**: 영어 직역 금지 (MUST NOT)
- **Rule 4.5**: 잘못된 클래스 스킬 금지 (MUST NOT)

**사용 시점**:
- 새 스킬을 DB에 추가할 때
- 가이드 내 스킬 번역 검증할 때
- 빌드 타임 자동 검증 (`npm run build`)

**검증 명령어**:
```bash
# 모든 가이드 번역 검증
node scripts/validate-translations.js

# Strict 모드 (경고도 빌드 실패)
node scripts/validate-translations.js --strict

# 상세 출력
node scripts/validate-translations.js --verbose
```

---

## 🚨 강제 규칙

### 규칙 1: 사전 검증(pre) 통과 전에는 가이드 작성 시작 금지

**이유**: 잘못된 템플릿 사용 시 전체 재작성 필요

**검증 명령어**:
```bash
node scripts/validate-guide-creation.js src/components/YourGuide.js className specName --phase pre
```

**통과 기준**: 모든 항목 ✅

---

### 규칙 2: 실시간 검증(during) CRITICAL 에러는 즉시 수정 필수

**이유**: CRITICAL 에러는 가이드 품질에 치명적

**검증 명령어**:
```bash
node scripts/validate-guide-creation.js src/components/YourGuide.js className specName --phase during
```

**통과 기준**: CRITICAL 0개

---

### 규칙 3: 사후 검증(post) 통과 전에는 커밋/PR 금지

**이유**: 불완전한 가이드 배포 방지

**검증 명령어**:
```bash
node scripts/validate-guide-creation.js src/components/YourGuide.js className specName --phase post
```

**통과 기준**: 모든 항목 ✅ + 컴파일 성공

---

## 📝 실전 사용 예시

### 비전 마법사 가이드 제작 (ArcaneMageGuide.js)

#### Step 1: 템플릿 복사
```bash
cp src/components/GuideTemplate.js src/components/ArcaneMageGuide.js
```

#### Step 2: 사전 검증
```bash
node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase pre
```

**출력**:
```
✅ 모든 검증 통과!
```

#### Step 3: 개요 섹션 작성 완료 후 실시간 검증
```bash
node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase during
```

**출력**:
```
❌ 1개의 문제 발견:

🔴 CRITICAL (즉시 수정 필수):

1. ❌ 템플릿 키워드가 1개 남아있습니다: 리소스
   해결책: GuideTemplate.js의 더미 텍스트를 모두 실제 데이터로 교체하세요.
```

#### Step 4: CRITICAL 에러 수정 후 재검증
```bash
# "리소스" → "마나"로 수정

node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase during
```

**출력**:
```
✅ 모든 검증 통과!
```

#### Step 5: 전체 작성 완료 후 사후 검증
```bash
node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase post
```

**출력**:
```
❌ 1개의 문제 발견:

🟠 HIGH (수정 권장):

1. ⚠️ 교차 검증 증거가 없습니다. 데이터 출처를 주석으로 명시하세요.
   해결책: 각 섹션에 "// Wowhead 검증: [URL]" 형식으로 출처를 추가하세요.
```

#### Step 6: 교차 검증 주석 추가 후 최종 검증
```bash
# 각 섹션에 "// Wowhead 검증: [URL]" 추가

node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase post
```

**출력**:
```
✅ 모든 검증 통과!

ℹ️  추가 확인사항:

1. ℹ️  컴파일 확인: npm run build를 실행하여 에러가 없는지 확인하세요.
   cd wow-meta-site && npm run build
```

#### Step 7: 컴파일 확인
```bash
cd wow-meta-site && npm run build
```

**성공 시 → 커밋/PR 가능**

---

## 🛡️ 위반 시 페널티

### 사전 검증 통과 없이 작성 시작

**결과**: 가이드 전체 재작성

**예시**: ArcaneMageGuide.js 실제 사례
- FuryWarriorGuide.js를 직접 복사
- 150+ 전사 키워드 잔류
- 8단계 체계적 수정 작업 (2시간 소요)
- 대량 섹션 교체 (Line 2628-2780 전체 재작성)

### CRITICAL 에러 무시하고 진행

**결과**: 가이드 품질 저하, 사용자 혼란

**예시**: Spellslinger 가짜 메커니즘 사례
- "비전 조화 20중첩 → Intuition 100%" 허구 메커니즘
- 전체 Spellslinger 딜사이클 재작성 필요 (2시간 소요)

### 사후 검증 통과 없이 커밋

**결과**: 배포 후 버그 발견, 긴급 hotfix 필요

---

## 📚 추가 참고 자료

#### 가이드 템플릿 검증
- **scripts/VALIDATION_SYSTEM_GUIDE.md**: 이 문서 (가이드 제작 지침 검증)
- **validate-guide-creation.js**: 검증 스크립트 소스 코드

#### 번역 검증
- **TRANSLATION_RULES.md**: 번역 규칙 및 신뢰도 계층
- **validate-translations.js**: 빌드 타임 번역 검증

#### 통합 문서
- **CLAUDE.md**:
  - Line 72-131: 가이드 제작 검증 시스템 소개
  - Line 1865-1895: 번역 강제 검증 프로토콜 요약
- **WOW_GUIDE_TEMPLATE_MANUAL.md**: 16단계 가이드 제작 매뉴얼

---

## 🔄 버전 관리

**버전**: v1.0
**작성일**: 2025-01-10
**업데이트**: 3단계 검증 시스템 도입

---

## ❓ FAQ

### Q1: 검증 시스템을 건너뛰면 안 되나요?

**A**: 안 됩니다. 검증 시스템은 **필수**입니다.

**이유**:
- 과거 실수 사례: ArcaneMageGuide.js (2시간 낭비), Spellslinger (2시간 낭비)
- 검증 시스템 없이는 100% 실수 재발
- 3단계 검증은 **총 3분 소요**, 재작성은 **2시간 소요**

---

### Q2: 실시간 검증(during)을 매번 실행해야 하나요?

**A**: 권장합니다.

**이유**:
- 섹션별로 검증하면 문제 조기 발견 가능
- 마지막에 한 번에 수정하는 것보다 훨씬 효율적
- CRITICAL 에러 발견 시 즉시 수정 가능

---

### Q3: INFO 메시지도 수정해야 하나요?

**A**: 권장하지만 필수는 아닙니다.

**예시**:
```
ℹ️  컴파일 확인: npm run build를 실행하여 에러가 없는지 확인하세요.
```

- INFO는 추가 확인사항일 뿐, 에러는 아님
- 최종 배포 전에 확인하면 됨

---

### Q4: 검증 시스템이 오탐(False Positive)을 내면?

**A**: 검증 로직 개선 후 재실행

**예시**:
```javascript
// 검증 시스템이 "비전 조화"를 영어로 잘못 인식
// → allowedEnglishTerms 배열에 추가
```

**수정 위치**: `validate-guide-creation.js` Line 253 (allowedEnglishTerms)

---

## 📞 문의

**파일**: `scripts/validate-guide-creation.js`
**문서**: `scripts/VALIDATION_SYSTEM_GUIDE.md`
**통합 지침**: `CLAUDE.md` (Line 72-131), `WOW_GUIDE_TEMPLATE_MANUAL.md` (Line 3348-3410)
