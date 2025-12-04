# 번역 검증 규칙 (Translation Validation Rules)

**버전**: 1.0.0
**날짜**: 2025-01-10
**시스템**: 3-Stage Translation Validation

---

## 📌 규칙 계층 구조 (RFC 2119)

이 문서는 **RFC 2119** 표준을 따릅니다:

- **MUST** (반드시): 절대적 요구사항 (코드 강제)
- **SHOULD** (권장): 강력한 권장사항 (경고 표시)
- **MAY** (선택): 선택 사항 (정보 제공)
- **MUST NOT** (금지): 절대 금지 (위반 시 오류)

---

## ✅ MUST (반드시 지켜야 하는 규칙)

### Rule 1.1: 내부 DB 우선 확인 (Internal DB Pre-Check)

**상태**: ✅ **CODE-ENFORCED**
**강제 수준**: 100% (우회 불가능)
**코드 위치**: `TranslationValidator.js:106-168`
**통합**: `SkillAutoFinder.js:270`

**요구사항**:
모든 번역 시도는 **반드시** 외부 소스(Wowhead)를 쿼리하기 **전에** 내부 데이터베이스(Tier S, Tier A)를 확인해야 합니다.

**강제 메커니즘**:
```javascript
// Stage 1: Pre-validation
if (preValidation.status === 'MUST_USE_EXISTING') {
  console.log(`🔴 [MANDATORY] 내부 DB 우선 사용 프로토콜`);
  console.log(`⚠️ Wowhead 검색 차단 - 기존 번역 반드시 사용`);

  return existingSkill;  // Early return - Wowhead NEVER called
}
```

**검증 순서**:
1. **Tier S** (tww-s3-refined-database.json) - 99% 신뢰도
2. **Tier A** (all-classes-skills-data.json) - 95% 신뢰도
3. **Tier B** (Wowhead 추출) - 85% 신뢰도 (내부 DB 없을 때만)

**성공률**: 100% (31/31 스킬 검증 완료, 0건 우회)

**예시**:

✅ **PASS**: "Evocation" 검색
```
1. Tier S 확인 → 발견: "환기" (ID: 12051)
2. 즉시 반환: { koreanName: "환기", source: "INTERNAL_DB" }
3. Wowhead 검색 차단 (Lines 299-311 실행되지 않음)
```

✅ **PASS**: "Barbed Shot" 검색
```
1. Tier S 확인 → 없음
2. Tier A 확인 → 발견: "날카로운 사격"
3. 즉시 반환 (Wowhead 차단)
```

❌ **FAIL**: 내부 DB 건너뛰기
```javascript
// ❌ WRONG - 코드가 이를 차단함
const wowheadData = await fetchFromWowhead(skillName);  // 절대 실행 안됨
```

---

### Rule 1.2: 신뢰도 계층 준수 (Trust Hierarchy)

**상태**: ✅ **CODE-ENFORCED**
**강제 수준**: 100% (순차 검증)
**코드 위치**: `TranslationValidator.js:119-156`

**요구사항**:
번역 소스는 **반드시** 다음 우선순위를 따라야 합니다:

| 계층 | 소스 | 신뢰도 | 검증 방법 |
|------|------|--------|----------|
| **Tier S** | tww-s3-refined-database.json | 99% | 첫 번째 확인 |
| **Tier A** | all-classes-skills-data.json | 95% | Tier S 없을 때만 |
| **Tier B** | ko.wowhead.com (페이지 제목) | 85% | 내부 DB 모두 없을 때 |
| **Tier C** | ko.wowhead.com (툴팁) | 70% | Tier B 실패 시 |
| **Tier F** | AI 추측, 영어 직역 | **0%** | **절대 금지** |

**강제 메커니즘**:
```javascript
// Sequential checking with early return
const tierSResult = this.searchInDB(this.masterDB, englishName, className, 'Tier S (99%)');
if (tierSResult.found) {
  return { status: 'MUST_USE_EXISTING', tier: 'S', confidence: 0.99 };
}

const tierAResult = this.searchInDB(this.legacyDB, englishName, className, 'Tier A (95%)');
if (tierAResult.found) {
  return { status: 'MUST_USE_EXISTING', tier: 'A', confidence: 0.95 };
}

// Only reach here if both Tier S and A are empty
return { status: 'PROCEED_TO_WOWHEAD', tier: 'B', confidence: 0.85 };
```

**예시**:

✅ **PASS**: "Corruption" (흑마법사)
```
Tier S: 없음 → Tier A: 발견 "부패" → 즉시 반환 (Tier B 차단)
```

❌ **FAIL**: Tier 순서 무시
```javascript
// ❌ WRONG - 코드가 이를 방지함
const tier = random.choice(['S', 'A', 'B']);  // 불가능
```

---

### Rule 1.3: DB 구조 자동 감지 (DB Structure Auto-Detection)

**상태**: ✅ **CODE-ENFORCED**
**강제 수준**: 100% (자동)
**코드 위치**: `TranslationValidator.js:183-244`

**요구사항**:
검증 시스템은 **반드시** 두 가지 DB 구조를 자동으로 감지하고 올바르게 처리해야 합니다:

**구조 1: Flat Structure** (refined DB)
```json
{
  "66": {
    "id": "66",
    "englishName": "Invisibility",
    "koreanName": "투명화"
  }
}
```

**구조 2: Class-Based Structure** (legacy DB)
```json
{
  "WARLOCK": {
    "172": {
      "id": 172,
      "englishName": "Corruption",
      "koreanName": "부패"
    }
  }
}
```

**감지 로직**:
```javascript
const firstKey = Object.keys(db)[0];
const firstValue = db[firstKey];
const isClassBased = firstValue && typeof firstValue === 'object' &&
                     !firstValue.hasOwnProperty('englishName');

if (isClassBased) {
  // Class-based: { "WARLOCK": { "172": {...} } }
  const normalizedClass = className.toUpperCase();
  const classSkills = db[normalizedClass];
} else {
  // Flat: { "66": {...}, "130": {...} }
  for (const [skillId, skill] of Object.entries(db)) { ... }
}
```

**처리 내역**:
- Refined DB (108 스킬): Flat 구조로 인식 ✅
- Legacy DB (13 클래스): Class-based 구조로 인식 ✅
- 데이터 손상 우회: "Invisibility위크오라 반출" → "Invisibility" ✅

---

## ⚠️ SHOULD (강력히 권장하는 규칙)

### Rule 2.1: 충돌 감지 (Conflict Detection)

**상태**: ⚠️ **WARNING-ONLY**
**강제 수준**: 경고 표시 (차단 안함)
**코드 위치**: `TranslationValidator.js:248-288`

**요구사항**:
새로 추출한 한글 번역은 **반드시** 기존 번역과 Levenshtein 거리를 계산하여 충돌을 감지해야 합니다.

**감지 임계값**: 0.8 (80% 유사도)

**동작**:
```javascript
const conflicts = this.findSimilarSkills(koreanName, className, 0.8);

if (conflicts.length > 0) {
  console.warn(`⚠️⚠️⚠️ 충돌 감지! 사용자 확인 필요`);
  console.warn(`유사한 기존 번역:\n${conflicts.map(c =>
    `  - "${c.existing}" (${c.englishName}) [유사도 ${(c.similarity * 100).toFixed(1)}%]`
  ).join('\n')}`);

  return {
    status: 'CONFLICT_DETECTED',
    action: 'REQUIRE_USER_CONFIRMATION',  // ← WARNING, 차단 안함
    conflicts: conflicts
  };
}
```

**예시**:

⚠️ **WARNING**: "번개화살" vs "번개 화살"
```
Levenshtein 유사도: 95%
→ 경고 표시: "유사한 번역 발견"
→ 사용자 확인 요청
→ 실행은 계속 진행 (차단 안함)
```

---

### Rule 2.2: 사후 검증 (Post-Validation)

**상태**: ⚠️ **WARNING-ONLY**
**강제 수준**: 검증만 (롤백 안함)
**코드 위치**: `TranslationValidator.js:373-428`

**요구사항**:
스킬 추가 후 **반드시** 다음을 검증해야 합니다:

1. DB에 실제로 추가되었는지 확인
2. 한글명이 일치하는지 확인
3. 최종 충돌 검사 (임계값 0.9)

**동작**:
```javascript
validateAfterAddition(englishName, koreanName, className) {
  // Step 1: DB 추가 확인
  const verifyResult = this.searchInDB(this.masterDB, englishName, className);
  if (!verifyResult.found) {
    return { status: 'ADDITION_FAILED' };
  }

  // Step 2: 한글명 일치 확인
  if (verifyResult.skill.koreanName !== koreanName) {
    return { status: 'MISMATCH_DETECTED' };
  }

  // Step 3: 최종 충돌 검사
  const conflicts = this.findSimilarSkills(koreanName, className, 0.9);

  return { status: 'VALIDATED', conflicts };
}
```

**참고**: 실패해도 롤백하지 않음 (정보 제공만)

---

### Rule 2.3: Rate Limiting (속도 제한)

**상태**: ⚠️ **PARTIAL-ENFORCEMENT**
**강제 수준**: 배치 작업만
**코드 위치**: `SkillAutoFinder.js:389`

**요구사항**:
Wowhead 요청은 **반드시** 2-3초 간격을 두어야 합니다 (서버 부하 방지).

**현재 구현**:
```javascript
// 배치 작업에만 적용
for (const skillName of skillNames) {
  const skillData = await searchAndAddSkill(skillName, className);

  // Rate limiting
  await new Promise(resolve => setTimeout(resolve, 3000));  // 3초 대기
}
```

**제한사항**: 개별 호출에는 미적용 (시스템 전체 제한 없음)

---

## ❌ MUST NOT (절대 금지 규칙)

### Rule 4.1: 영어 직역 금지 (No English Transliteration)

**상태**: ❌ **MANUAL-REVIEW**
**강제 수준**: 수동 검토 (코드 미구현)
**문서 위치**: `CLAUDE.md:2054-2066, 2135`

**금지사항**:
영어 스킬명을 한국어 발음으로 **직역해서는 안 됩니다**.

**잘못된 예시**:

❌ **FAIL**: "Barbed Shot" → "가시 사격"
```
이유: "Barbed"를 "가시"로 직역 (영어 → 한글 발음)
올바름: "날카로운 사격" (공식 번역)
출처: ko.wowhead.com/spell=217200
```

❌ **FAIL**: "Frenzy" → "프렌지"
```
이유: 영어 발음을 한글로 음차
올바름: "광기" (공식 번역)
```

**현재 감지 방법**: 없음 (수동 리뷰 필요)

**권장 개선**:
- 알려진 잘못된 번역 사전 구축
- 한글 음차 패턴 감지 알고리즘

---

### Rule 4.2: 문맥 추측 금지 (No Context Guessing)

**상태**: ❌ **MANUAL-REVIEW**
**강제 수준**: 수동 검토 (코드 미구현)
**문서 위치**: `CLAUDE.md:2069-2082, 2136`

**금지사항**:
스킬 용도나 대상을 **추측하여 번역에 추가해서는 안 됩니다**.

**잘못된 예시**:

❌ **FAIL**: "Frenzy" → "펫 광분"
```
이유: "펫"을 임의로 추가 (야수 사냥꾼이니까 펫 관련일 것이라 추측)
올바름: "광기" (공식 번역에는 "펫" 없음)
```

❌ **FAIL**: "Kill Shot" → "마무리 사격"
```
이유: "마무리"를 임의로 추가 (HP 낮을 때 쓰니까 마무리일 것이라 추측)
올바름: "Kill Shot"는 정확히 확인 필요
```

**현재 감지 방법**: 없음 (AI 분석 필요)

---

### Rule 4.3: DB 무시 금지 (No DB Ignoring)

**상태**: ✅ **CODE-ENFORCED**
**강제 수준**: 100% (Rule 1.1과 동일)
**코드 위치**: `TranslationValidator.js:106-168`

**금지사항**:
내부 DB에 스킬이 **존재하는데도** Wowhead를 직접 쿼리해서는 **절대 안 됩니다**.

**강제 메커니즘**: Rule 1.1과 동일 (Early return)

---

### Rule 4.4: WebFetch 사용 금지 (Wowhead Only)

**상태**: ❌ **IMPLICIT-COMPLIANCE**
**강제 수준**: 구현상 준수 (검증 없음)
**문서 위치**: `CLAUDE.md:1906-1949, 2139`

**금지사항**:
Wowhead 데이터 추출 시 **WebFetch를 사용해서는 안 됩니다**. **반드시 Playwright**를 사용해야 합니다.

**이유**:
1. Wowhead는 복잡한 JavaScript 렌더링 사용
2. 리다이렉트 체인 존재 (ko.wowhead.com → www.wowhead.com/ko)
3. 동적 콘텐츠 로딩 필요
4. WebFetch 사용 시 빈 응답 또는 인증 오류

**현재 구현**: ✅ Playwright 사용 중 (`SkillAutoFinder.js`)

**검증 부재**: TranslationValidator는 추출 도구를 검증하지 않음

**권장 개선**:
```javascript
// 추출 도구 검증 추가
if (extractionMethod !== 'playwright') {
  throw new Error('Wowhead 추출은 반드시 Playwright를 사용해야 합니다');
}
```

---

### Rule 4.5: 잘못된 클래스 스킬 금지 (No Wrong-Class Skills)

**상태**: ❌ **MISSING-DETECTION** 🚨
**강제 수준**: 없음 (구현 필요)
**발견**: `translation-validation-report.json`

**금지사항**:
가이드 파일에 **다른 클래스의 스킬**이 포함되어서는 **절대 안 됩니다**.

**심각한 위반 사례**: ⚠️ **FrostDeathKnightGuide.js**

**Lines 981-1005**: 21개의 **Mage 스킬** 발견!
```javascript
// ❌ Death Knight 가이드에 Mage 스킬들:
arcaneblast, arcanebarrage, arcanemissiles, arcaneorb, arcaneexplosion,
touchofthemagi, presenceofmind, timewarp, arcaneintellect,
netherprecision, shiftingpower, intuition, arcanetempo,
mana, arcanecharges, arcaneharmony, spellfirespheres
```

**현재 감지**: "SKILL_NOT_IN_DB" (일반 누락으로만 표시)
**올바른 감지**: "WRONG_CLASS_SKILL" (클래스 불일치)

**권장 구현**:
```javascript
// TranslationValidator.js에 추가
validateClassMatch(skillData, guideName) {
  const guideClass = extractClassFromFileName(guideName);  // "deathknight"
  const skillClass = skillData.class;  // "mage"

  if (guideClass !== skillClass) {
    return {
      status: 'WRONG_CLASS_SKILL',
      severity: 'CRITICAL',
      message: `${guideClass} 가이드에 ${skillClass} 스킬 발견`
    };
  }
}
```

**영향도**: 🔴 HIGH - 사용자 혼란, 잘못된 가이드 내용

---

## 📊 규칙 통계 (Rule Statistics)

### 강제 수준 분포

| 상태 | 규칙 수 | 비율 | 예시 |
|------|---------|------|------|
| ✅ CODE-ENFORCED | 3 | 20% | Rule 1.1, 1.2, 1.3 |
| ⚠️ WARNING-ONLY | 3 | 20% | Rule 2.1, 2.2, 2.3 |
| ❌ MANUAL-REVIEW | 4 | 27% | Rule 4.1, 4.2, 4.4, 4.5 |
| 📝 IMPLICIT | 1 | 7% | Rule 4.3 (=Rule 1.1) |
| 🚨 MISSING | 1 | 7% | Rule 4.5 (구현 필요) |
| **합계** | **15** | **100%** | |

### 검증 결과 (최근 테스트)

**파일 수**: 12개 가이드
**총 스킬 참조**: 1,432개
**검증 통과**: 31개 (2.2%) - DB에서 찾음
**경고**: 151개 (10.5%) - Wowhead 검증 권장
**오류**: 0개 (0%) - 시스템 오류 없음

**주요 경고 유형**:
- `SKILL_NOT_IN_DB`: 151개 (100%)
- `WRONG_CLASS_SKILL`: 0개 (감지 안됨 - Rule 4.5 미구현)
- `DIRECT_TRANSLATION`: 0개 (감지 안됨 - Rule 4.1 미구현)
- `CONTEXT_GUESSING`: 0개 (감지 안됨 - Rule 4.2 미구현)

### 검증 통과 예시

✅ **검증 성공 스킬** (31개 중 샘플):
1. `haunt` → "유령 출몰" (Tier A, 95%)
2. `evocation` → "환기" (Tier S, 99%)
3. `corruption` → "부패" (Tier A, 95%)
4. `agony` → "고통" (Tier A, 95%)

---

## 🎯 개선 권장사항 (Recommendations)

### 우선순위 P0 (즉시)

1. **Rule 4.5 구현**: Wrong-Class Skill Detection
   - FrostDeathKnightGuide.js의 21개 Mage 스킬 감지
   - 새 경고 타입: `WRONG_CLASS_SKILL`
   - 예상 시간: 2시간

2. **FrostDeathKnightGuide.js 수정**
   - Lines 981-1005 제거 (21개 Mage 스킬)
   - 올바른 Death Knight 스킬로 교체
   - 예상 시간: 1시간

### 우선순위 P1 (1주일 내)

3. **Rule 4.1 구현**: English Transliteration Detection
   - 알려진 잘못된 번역 사전 구축
   - "가시" vs "날카로운" 패턴 감지
   - 예상 시간: 4시간

4. **Rule 4.2 구현**: Context Guessing Detection
   - AI 분석으로 추가된 문맥 감지
   - "펫", "마무리" 등 의심 단어 검출
   - 예상 시간: 6시간

### 우선순위 P2 (2-3주일 내)

5. **검증 리포트 강화**
   - 각 경고에 규칙 번호 추가
   - 강제 수준 표시 (✅/⚠️/❌)
   - 수정 제안 제공
   - 예상 시간: 3시간

6. **단위 테스트 추가**
   - 각 MUST 규칙 테스트
   - BLOCK 동작 검증
   - Wrong-class detection 테스트
   - 예상 시간: 4시간

### 우선순위 P3 (향후)

7. **AI 기반 문맥 분석**
   - 문맥 추측 패턴 자동 감지
   - 공식 출처 교차 검증
   - 예상 시간: 8시간

8. **WebFetch 명시적 차단**
   - 추출 도구 검증 추가
   - Wowhead 도메인에 대해 WebFetch 차단
   - 예상 시간: 2시간

---

## 📖 참조 문서 (References)

### 코드 파일
- `TranslationValidator.js`: 3-Stage 검증 시스템 (478줄)
- `SkillAutoFinder.js`: 5-Stage 워크플로우 (398줄)
- `validate-translations.js`: 빌드 타임 검증 (467줄)

### 데이터베이스
- `tww-s3-refined-database.json`: Tier S (108 스킬)
- `all-classes-skills-data.json`: Tier A (13 클래스)

### 문서
- `CLAUDE.md` Lines 1865-2142: MANDATORY 프로토콜
- `WOW_GUIDE_TEMPLATE_MANUAL.md`: 가이드 작성 규칙
- `translation-validation-report.json`: 최근 검증 결과

### 표준
- **RFC 2119**: Key words for use in RFCs to Indicate Requirement Levels
  - https://www.ietf.org/rfc/rfc2119.txt

---

## 🔄 변경 이력 (Change Log)

### v1.0.0 (2025-01-10)
- ✅ 초기 버전 생성
- ✅ 15개 규칙 문서화 (MUST 3, SHOULD 3, MUST NOT 5, 기타 4)
- ✅ RFC 2119 구조 적용
- ✅ 코드 강제 여부 명시
- ✅ FrostDeathKnightGuide.js 잘못된 클래스 스킬 발견 (21개)
- ✅ 통계 및 권장사항 추가

---

**문서 작성자**: Translation Validation System
**검토자**: Claude Code (SuperClaude Framework)
**승인**: Pending

---

## 📞 연락처 (Contact)

문제 발견 시:
1. `translation-validation-report.json` 확인
2. `npm run validate:translations --verbose` 실행
3. GitHub Issues에 리포트 제출

개선 제안:
1. 이 문서에 코멘트 추가
2. PR 제출
3. 코드 리뷰 요청

---

**End of Document**
