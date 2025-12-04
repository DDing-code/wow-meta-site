---
type: index
category: personas
totalPersonas: 39
tags:
  - index
  - personas
  - ai
created: 2025-11-11
updated: 2025-11-11
---

# 🤖 AI 페르소나 랭킹 시스템

> **39개 AI 페르소나**: 각 전문화의 전문가, 지속적 학습과 성장

## 📊 전체 통계

| 항목 | 수량 |
|------|------|
| **총 페르소나 수** | 39개 |
| **레벨 10 (최고)** | 0개 |
| **레벨 5+** | 0개 |
| **레벨 1 (초기)** | 0개 |
| **평균 신뢰도** | 0% |

## 🏆 최고 레벨 페르소나 (Top 10)

```dataview
TABLE
  spec AS "전문화",
  level AS "레벨",
  experience AS "경험치",
  confidence AS "신뢰도",
  status AS "상태"
FROM "05-AI-페르소나"
WHERE type = "persona"
SORT level DESC, confidence DESC, experience DESC
LIMIT 10
```

## 📈 레벨별 분류

### 레벨 10 (마스터)

**특징**: 신뢰도 95%+, 모든 지식 완벽 습득, 외부 소스 통합 완료

```dataview
TABLE spec AS "전문화", class AS "클래스", confidence AS "신뢰도", experience AS "경험치"
FROM "05-AI-페르소나"
WHERE type = "persona" AND level = 10
SORT confidence DESC
```

**현재**: 0개

---

### 레벨 7-9 (전문가)

**특징**: 신뢰도 85%+, 대부분 지식 습득, 실전 검증 완료

```dataview
TABLE spec AS "전문화", class AS "클래스", level AS "레벨", confidence AS "신뢰도"
FROM "05-AI-페르소나"
WHERE type = "persona" AND level >= 7 AND level <= 9
SORT level DESC, confidence DESC
```

**현재**: 0개

---

### 레벨 4-6 (숙련)

**특징**: 신뢰도 70%+, 핵심 지식 습득, 로그 분석 경험 있음

```dataview
TABLE spec AS "전문화", class AS "클래스", level AS "레벨", confidence AS "신뢰도"
FROM "05-AI-페르소나"
WHERE type = "persona" AND level >= 4 AND level <= 6
SORT level DESC, confidence DESC
```

**현재**: 0개

---

### 레벨 1-3 (초보)

**특징**: 신뢰도 50%+, 기본 지식 학습 중

```dataview
TABLE spec AS "전문화", class AS "클래스", level AS "레벨", confidence AS "신뢰도"
FROM "05-AI-페르소나"
WHERE type = "persona" AND level >= 1 AND level <= 3
SORT level DESC, confidence DESC
```

**현재**: 0개

---

## 🗂️ 클래스별 페르소나 목록

### 전사 (Warrior)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **무기 (Arms)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **분노 (Fury)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **방어 (Protection)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 성기사 (Paladin)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **신성 (Holy)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **보호 (Protection)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **징벌 (Retribution)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 사냥꾼 (Hunter)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **야수 (Beast Mastery)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **사격 (Marksmanship)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **생존 (Survival)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 도적 (Rogue)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **암살 (Assassination)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **무법 (Outlaw)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **잠행 (Subtlety)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 사제 (Priest)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **수양 (Discipline)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **신성 (Holy)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **암흑 (Shadow)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 주술사 (Shaman)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **정기 (Elemental)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **고양 (Enhancement)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **복원 (Restoration)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 마법사 (Mage)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **비전 (Arcane)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **화염 (Fire)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **냉기 (Frost)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 흑마법사 (Warlock)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **고통 (Affliction)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **악마 (Demonology)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **파괴 (Destruction)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 수도사 (Monk)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **양조 (Brewmaster)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **운무 (Mistweaver)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **풍운 (Windwalker)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 드루이드 (Druid)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **조화 (Balance)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **야성 (Feral)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **수호 (Guardian)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **회복 (Restoration)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 악마사냥꾼 (Demon Hunter)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **파멸 (Havoc)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **복수 (Vengeance)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 죽음의 기사 (Death Knight)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **혈기 (Blood)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **냉기 (Frost)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **부정 (Unholy)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

### 기원사 (Evoker)

| 전문화 | 레벨 | 경험치 | 신뢰도 | 상태 |
|--------|------|--------|--------|------|
| **황폐 (Devastation)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **보존 (Preservation)** | 0 | 0 | 0% | 🔄 초기화 대기 |
| **증강 (Augmentation)** | 0 | 0 | 0% | 🔄 초기화 대기 |

---

## 🎓 학습 활동 통계

### 최근 학습 활동 (7일)

```dataview
TABLE
  spec AS "전문화",
  class AS "클래스",
  "활동" AS activity,
  "XP 획득" AS xpGained
FROM "05-AI-페르소나"
WHERE type = "persona" AND date(updated) >= date(today) - dur(7 days)
SORT updated DESC
LIMIT 20
```

### 경험치 획득 TOP 10 (이번 주)

```dataview
TABLE
  spec AS "전문화",
  class AS "클래스",
  experience AS "경험치",
  level AS "레벨"
FROM "05-AI-페르소나"
WHERE type = "persona"
SORT experience DESC
LIMIT 10
```

## 📊 신뢰도 분포

```dataview
TABLE WITHOUT ID
  "90%+" AS "신뢰도 범위",
  length(filter(rows, (r) => r.confidence >= 90)) AS "페르소나 수"
FROM "05-AI-페르소나"
WHERE type = "persona"
```

## 🔍 검색 및 필터

### 활발한 페르소나 (최근 7일 활동)

```dataview
TABLE spec AS "전문화", level AS "레벨", confidence AS "신뢰도", updated AS "마지막 활동"
FROM "05-AI-페르소나"
WHERE type = "persona" AND date(updated) >= date(today) - dur(7 days)
SORT updated DESC
```

### 학습 중 페르소나

```dataview
TABLE spec AS "전문화", level AS "레벨", experience AS "경험치", status AS "상태"
FROM "05-AI-페르소나"
WHERE type = "persona" AND status = "학습중"
SORT experience DESC
```

### 레벨업 임박 (경험치 90%+)

```dataview
TABLE spec AS "전문화", level AS "레벨", experience AS "경험치", "다음 레벨까지" AS xpToNext
FROM "05-AI-페르소나"
WHERE type = "persona"
SORT level DESC, experience DESC
```

## 🔗 관련 리소스

### 내부 링크
- [[_MASTER-INDEX|메인 대시보드]]
- [[_GUIDE-INDEX|가이드 검색]]
- [[_SKILL-INDEX|스킬 검색]]

### 페르소나 아키텍처
- [[05-AI-페르소나/Base/BaseSpecializationPersona|베이스 페르소나]]
- [[06-시스템-아키텍처/Persona-System|페르소나 시스템 설계]]

---

**생성일**: 2025-11-11
**마지막 업데이트**: 2025-11-11
**총 페르소나**: 0 / 39 (0%)
**평균 레벨**: 0.0
**평균 신뢰도**: 0%
