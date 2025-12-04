---
type: index
category: skills
totalSkills: 1186
tags:
  - index
  - skills
created: 2025-11-11
updated: 2025-11-11
---

# 🎯 스킬 DB 통합 검색

> **Single Source of Truth**: 1,186개 스킬의 중앙 데이터베이스

## 📊 전체 통계

| 항목 | 수량 |
|------|------|
| **총 스킬 수** | 1,186개 |
| **클래스 수** | 13개 |
| **전문화 수** | 39개 |
| **마이그레이션 상태** | 🔄 대기 중 (0%) |

## 🗂️ 클래스별 스킬 목록

### 전사 (Warrior)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/Warriors"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 무기 (Arms): 0개
- 분노 (Fury): 0개
- 방어 (Protection): 0개
- 공용 (Shared): 0개

---

### 성기사 (Paladin)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/Paladins"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 신성 (Holy): 0개
- 보호 (Protection): 0개
- 징벌 (Retribution): 0개
- 공용 (Shared): 0개

---

### 사냥꾼 (Hunter)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/Hunters"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 야수 (Beast Mastery): 0개
- 사격 (Marksmanship): 0개
- 생존 (Survival): 0개
- 공용 (Shared): 0개

---

### 도적 (Rogue)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/Rogues"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 암살 (Assassination): 0개
- 무법 (Outlaw): 0개
- 잠행 (Subtlety): 0개
- 공용 (Shared): 0개

---

### 사제 (Priest)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/Priests"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 수양 (Discipline): 0개
- 신성 (Holy): 0개
- 암흑 (Shadow): 0개
- 공용 (Shared): 0개

---

### 주술사 (Shaman)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/Shamans"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 정기 (Elemental): 0개
- 고양 (Enhancement): 0개
- 복원 (Restoration): 0개
- 공용 (Shared): 0개

---

### 마법사 (Mage)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/Mages"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 비전 (Arcane): 0개
- 화염 (Fire): 0개
- 냉기 (Frost): 0개
- 공용 (Shared): 0개

---

### 흑마법사 (Warlock)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/Warlocks"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 고통 (Affliction): 0개
- 악마 (Demonology): 0개
- 파괴 (Destruction): 0개
- 공용 (Shared): 0개

---

### 수도사 (Monk)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/Monks"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 양조 (Brewmaster): 0개
- 운무 (Mistweaver): 0개
- 풍운 (Windwalker): 0개
- 공용 (Shared): 0개

---

### 드루이드 (Druid)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/Druids"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 조화 (Balance): 0개
- 야성 (Feral): 0개
- 수호 (Guardian): 0개
- 회복 (Restoration): 0개
- 공용 (Shared): 0개

---

### 악마사냥꾼 (Demon Hunter)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/DemonHunters"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 파멸 (Havoc): 0개
- 복수 (Vengeance): 0개
- 공용 (Shared): 0개

---

### 죽음의 기사 (Death Knight)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/DeathKnights"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 혈기 (Blood): 0개
- 냉기 (Frost): 0개
- 부정 (Unholy): 0개
- 공용 (Shared): 0개

---

### 기원사 (Evoker)

```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB/Evokers"
WHERE type = "skill"
SORT spec ASC, tier DESC, koreanName ASC
```

**전문화**:
- 황폐 (Devastation): 0개
- 보존 (Preservation): 0개
- 증강 (Augmentation): 0개
- 공용 (Shared): 0개

---

## 🔍 검색 및 필터

### 등급별 스킬 (Tier S → F)

**Tier S** (최고 신뢰도 99%):
```dataview
LIST
FROM "01-스킬-DB"
WHERE type = "skill" AND tier = "S"
SORT class ASC, spec ASC, koreanName ASC
```

**Tier A** (높은 신뢰도 95%):
```dataview
LIST
FROM "01-스킬-DB"
WHERE type = "skill" AND tier = "A"
SORT class ASC, spec ASC, koreanName ASC
```

**Tier B** (보통 85%):
```dataview
LIST
FROM "01-스킬-DB"
WHERE type = "skill" AND tier = "B"
SORT class ASC, spec ASC, koreanName ASC
```

### 최근 업데이트 (7일)

```dataview
TABLE koreanName AS "한글명", class AS "클래스", spec AS "전문화", updated AS "업데이트"
FROM "01-스킬-DB"
WHERE type = "skill" AND date(updated) >= date(today) - dur(7 days)
SORT updated DESC
```

### 검증 필요 스킬

```dataview
TABLE koreanName AS "한글명", class AS "클래스", spec AS "전문화", tier AS "등급"
FROM "01-스킬-DB"
WHERE type = "skill" AND (tier = "C" OR tier = "D" OR tier = "F")
SORT tier ASC, updated ASC
```

## 📈 통계 및 분포

### 클래스별 스킬 수

```dataview
TABLE WITHOUT ID
  class AS "클래스",
  count(rows) AS "스킬 수"
FROM "01-스킬-DB"
WHERE type = "skill"
GROUP BY class
SORT count(rows) DESC
```

### 등급 분포

```dataview
TABLE WITHOUT ID
  tier AS "등급",
  count(rows) AS "개수",
  round((count(rows) / 1186) * 100, 1) + "%" AS "비율"
FROM "01-스킬-DB"
WHERE type = "skill"
GROUP BY tier
SORT tier ASC
```

## 🔗 관련 리소스

### 내부 링크
- [[_MASTER-INDEX|메인 대시보드]]
- [[_GUIDE-INDEX|가이드 검색]]
- [[_PERSONA-INDEX|AI 페르소나]]

### 데이터 소스
- JavaScript DB: `database-builder/tww-s3-complete-database-enhanced.json`
- 동기화 스크립트: `scripts/obsidian-sync/`

---

**생성일**: 2025-11-11
**마지막 업데이트**: 2025-11-11
**총 스킬**: 0 / 1,186 (0%)
**마이그레이션 상태**: 🔄 대기 중
