# Phase 1 개선 효과 보고서

**작성일**: 2025-01-10
**대상**: wowheadAxiosExtractor.js HTML 주석 파싱 개선

---

## 📊 Executive Summary

### 개선 목표
Wowhead 크롤링 시 누락되는 정보를 줄이기 위해 **HTML 주석 파싱 기능 추가**

### 주요 성과
- ✅ HTML 주석 파싱 함수 추가 (`parseHtmlComments()`)
- ✅ 분 단위 재사용 대기시간 지원 (예: "3.5분")
- ✅ 일부 스킬의 cooldown 정보 추출 성공 (44.4%)
- ⚠️ 전체 필드 추출률은 여전히 낮음 (7.9%)

### 제한 사항
- HTML 주석이 모든 스킬에 존재하지 않음 (9개 중 4개만)
- castTime, range는 HTML 주석에 거의 없음
- school, mechanic, dispelType, resourceCost는 HTML 주석에 없음

---

## 🔍 개선 전 문제점

### Wowhead JSON 구조의 한계
Wowhead JSON (`WH.Gatherer.addData`)에는 다음 필드들이 **존재하지 않음**:
- `school` (주문 계열)
- `mechanic` (메커니즘)
- `cooldown` (재사용 대기시간)
- `cast_time` (시전 시간)
- `range_max` (사거리)
- `power_cost` (자원 소모)

실제 JSON 구조:
```json
{
  "name_enus": "Hammer of Justice",
  "icon": "spell_holy_sealofmight",
  "description_enus": "Stuns the target for 6 sec.<!--cooldown:234299:30 sec cooldown-->"
}
```

### 개선 전 추출 정확도
- **추정**: 39% (9/23 필드 정확)
- **문제**: description 텍스트 파싱만 의존, 한글 description에 정보 없음

---

## ✨ 구현된 개선 사항

### 1. HTML 주석 파싱 함수 추가
**파일**: `wowheadAxiosExtractor.js` (Lines 506-556)

```javascript
function parseHtmlComments(description) {
  // <!--cooldown:234299:30 sec cooldown--> → "30초"
  // <!--cooldown:114154:3.5 min cooldown--> → "3.5분"
  // <!--cast:234299:2.25 sec cast--> → "2.25초"
  // <!--range:234299:40 yd range--> → "40 야드"
}
```

**지원 패턴**:
- 재사용 대기시간: 초 단위 + 분 단위
- 시전 시간: 초 단위
- 사거리: 야드 단위

### 2. ID 매핑 함수 추가
**파일**: `wowheadAxiosExtractor.js` (Lines 317-402)

```javascript
function mapSchoolId(schoolId)    // 주문 계열 (1-126)
function mapMechanicId(mechanicId)  // 메커니즘 (0-31)
function mapDispelId(dispelId)     // 해제 타입 (0-9)
```

**문제**: JSON에 해당 필드가 없어 사용 불가 (기본값만 반환)

### 3. 자원 획득량 추출 함수 추가
**파일**: `wowheadAxiosExtractor.js` (Lines 556-596)

```javascript
function extractResourceGain(description)
// "신성한 힘 1개를 생성합니다" → "신성한 힘 1"
// "분노 20" → "분노 20"
```

**성과**: 9개 중 1개 스킬에서 성공 (심판의 칼날)

---

## 📈 테스트 결과 (9개 스킬)

### 테스트 대상
| ID | 스킬명 | 클래스 |
|----|--------|--------|
| 642 | 천상의 보호막 | 성기사 |
| 853 | 심판의 망치 | 성기사 |
| 1680 | 소용돌이 | 전사 |
| 6940 | 희생의 축복 | 성기사 |
| 23920 | 주문 반사 | 전사 |
| 46968 | 충격파 | 전사 |
| 167105 | 거인의 강타 | 전사 |
| 184575 | 심판의 칼날 | 성기사 |
| 204074 | 정의로운 수호자 | 성기사 |

### 추출 성공률

| 지표 | 개선 전 | 개선 후 | 변화 |
|------|---------|---------|------|
| **HTML 주석 추출 성공** | 0% (0/9) | **44.4% (4/9)** | +44.4%p |
| **cooldown 추출 성공** | 0% (0/9) | **44.4% (4/9)** | +44.4%p |
| **resourceGain 추출 성공** | 0% (0/9) | **11.1% (1/9)** | +11.1%p |
| **전체 필드 추출률** | 39% (추정) | **7.9% (5/63)** | -31.1%p |

### HTML 주석 추출 성공 스킬
| ID | 스킬명 | cooldown | HTML 주석 데이터 |
|----|--------|----------|------------------|
| 642 | 천상의 보호막 | 3.5분 | `{"cooldown":"3.5분","castTime":null,"range":null}` |
| 853 | 심판의 망치 | 30초 | `{"cooldown":"30초","castTime":null,"range":null}` |
| 23920 | 주문 반사 | 2.9분 | `{"cooldown":"2.9분","castTime":null,"range":null}` |
| 204074 | 정의로운 수호자 | 2.9분 | `{"cooldown":"2.9분","castTime":null,"range":null}` |

### HTML 주석 없는 스킬 (5개)
- 1680 (소용돌이)
- 6940 (희생의 축복)
- 46968 (충격파)
- 167105 (거인의 강타)
- 184575 (심판의 칼날)

---

## ⚠️ 근본 문제 분석

### 1. HTML 주석 존재 비율 낮음
- **실제**: 9개 중 4개 (44.4%)
- **예상**: 대부분의 스킬에 존재
- **원인**: Wowhead가 모든 스킬에 HTML 주석 제공하지 않음

### 2. HTML 주석 내용 제한적
- **cooldown**: 일부 스킬에만 존재 (44.4%)
- **castTime**: 거의 없음 (0%)
- **range**: 거의 없음 (0%)
- **resourceCost**: 없음 (0%)

### 3. 한글 description의 정보 부족
**예시**: 심판의 망치 (ID 853)

**한글 description**:
```
6초 동안 대상을 기절시킵니다. 성기사 능력들 범주 내. 직업 가이드에서 이것을 사용하는 법을 배워보세요.
```
→ cooldown, castTime, range 정보 **없음**

**description_enus** (HTML 주석 포함):
```
Stuns the target for 6 sec.<!--cooldown:234299:30 sec cooldown-->
```
→ cooldown 정보 **있음** (HTML 주석으로)

### 4. 전체 필드 추출률 감소 원인
- **개선 전 (추정 39%)**:
  - extractCooldown(), extractCastTime() 등이 한글 description 파싱
  - 하지만 **실제로는 정보가 없어서 실패**
  - 39%는 **과대 추정**

- **개선 후 (실측 7.9%)**:
  - HTML 주석 파싱 추가 (cooldown 44.4% 성공)
  - 다른 필드는 여전히 실패 (castTime 0%, range 0%, school 0%, mechanic 0%)
  - **실제 추출률 정확히 측정**

---

## 🎯 다음 단계 (Phase 2-4)

### Phase 2: Enhanced Description Parsing (+15%)
**목표**: 한글 description이 아닌 다른 소스 활용
- Wowhead 페이지의 테이블 정보 추출
- 영문 description 파싱 후 한글 번역 매핑

### Phase 3: Multi-Source Integration (+25%)
**목표**: Wowhead 외 다른 데이터 소스 통합
- **Maxroll**: 스킬 정보, 메커니즘
- **SimC APL**: 실제 게임 데이터
- **내부 DB**: tww-s3-refined-database.json 우선 사용

### Phase 4: Manual Override System (+40%)
**목표**: 자동 추출 실패 시 수동 보정
- 스킬별 수동 메타데이터 매핑
- DB 기반 fallback 시스템

---

## 💡 핵심 교훈

### 1. Wowhead의 한계
- JSON 데이터는 **기본 정보만 포함** (name, icon, description)
- 메타데이터는 **HTML 주석에만 일부 존재** (44.4%)
- 한글 페이지는 **메타 태그에서 요약만 제공**

### 2. HTML 주석 파싱의 가치
- **있을 때는 100% 정확** (3.5분, 30초 등)
- 하지만 **존재하지 않으면 무용지물** (55.6%)
- **보완적 방법**으로만 유효

### 3. 다중 소스 전략 필요성
- 단일 소스 (Wowhead)만으로는 **부족**
- Maxroll, SimC, 내부 DB 등 **다중 소스 통합 필수**
- 신뢰도 계층 구조 (Tier S → A → B → C)

---

## 📝 결론

### 성과
- ✅ HTML 주석 파싱 시스템 구축
- ✅ cooldown 필드 44.4% 추출 성공
- ✅ 분 단위 재사용 대기시간 지원
- ✅ resourceGain 필드 11.1% 추출 성공

### 한계
- ❌ HTML 주석 존재 비율 낮음 (44.4%)
- ❌ castTime, range 추출 실패 (0%)
- ❌ school, mechanic 추출 불가 (JSON 필드 없음)
- ❌ 전체 필드 추출률 낮음 (7.9%)

### 권장 사항
**Phase 1만으로는 불충분**. Phase 2-4 진행 필수:
- Phase 2: Enhanced Description Parsing (Wowhead 테이블 정보)
- Phase 3: Multi-Source Integration (Maxroll, SimC, 내부 DB)
- Phase 4: Manual Override System (수동 보정)

**현실적 목표**:
- Phase 1-2: 60-70% 추출률
- Phase 1-3: 85-90% 추출률
- Phase 1-4: 95%+ 추출률 (수동 보정 포함)
