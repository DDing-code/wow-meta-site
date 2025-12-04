---
type: moc
category: {{CATEGORY}}
tags:
  - moc
  - {{CATEGORY}}
created: {{DATE}}
updated: {{DATE}}
---

# {{MOC_TITLE}}

> **MOC (Map of Contents)**: {{DESCRIPTION}}

## 📊 통계

- **총 항목 수**: {{TOTAL_COUNT}}
- **마지막 업데이트**: {{LAST_UPDATE}}
- **완성도**: {{COMPLETENESS}}%

## 🗂️ 카테고리별 분류

### {{CATEGORY_1}}

{{CATEGORY_1_DESCRIPTION}}

```dataview
TABLE {{FIELDS}}
FROM "{{FOLDER_PATH}}"
WHERE {{FILTER_CONDITION_1}}
SORT {{SORT_FIELD}} {{SORT_ORDER}}
```

**주요 항목**:
- [[{{ITEM_1_1}}]]
- [[{{ITEM_1_2}}]]
- [[{{ITEM_1_3}}]]

### {{CATEGORY_2}}

{{CATEGORY_2_DESCRIPTION}}

```dataview
TABLE {{FIELDS}}
FROM "{{FOLDER_PATH}}"
WHERE {{FILTER_CONDITION_2}}
SORT {{SORT_FIELD}} {{SORT_ORDER}}
```

**주요 항목**:
- [[{{ITEM_2_1}}]]
- [[{{ITEM_2_2}}]]
- [[{{ITEM_2_3}}]]

### {{CATEGORY_3}}

{{CATEGORY_3_DESCRIPTION}}

```dataview
TABLE {{FIELDS}}
FROM "{{FOLDER_PATH}}"
WHERE {{FILTER_CONDITION_3}}
SORT {{SORT_FIELD}} {{SORT_ORDER}}
```

**주요 항목**:
- [[{{ITEM_3_1}}]]
- [[{{ITEM_3_2}}]]
- [[{{ITEM_3_3}}]]

## 🎯 필터 및 검색

### 등급별 (Tier S → F)

**Tier S** (최고 신뢰도):
```dataview
LIST
FROM "{{FOLDER_PATH}}"
WHERE tier = "S"
SORT {{SORT_FIELD}}
```

**Tier A** (높은 신뢰도):
```dataview
LIST
FROM "{{FOLDER_PATH}}"
WHERE tier = "A"
SORT {{SORT_FIELD}}
```

**Tier B** (보통):
```dataview
LIST
FROM "{{FOLDER_PATH}}"
WHERE tier = "B"
SORT {{SORT_FIELD}}
```

### 최근 업데이트 (7일 이내)

```dataview
TABLE updated AS "업데이트", type AS "타입", status AS "상태"
FROM "{{FOLDER_PATH}}"
WHERE date(updated) >= date(today) - dur(7 days)
SORT updated DESC
```

### 검증 필요 항목

```dataview
TABLE status AS "상태", tier AS "등급", updated AS "마지막 업데이트"
FROM "{{FOLDER_PATH}}"
WHERE status = "검증필요" OR confidence < 70
SORT updated ASC
```

## 📈 진행 상황

### 전체 진행도

```dataview
TABLE status AS "상태", count(rows) AS "개수"
FROM "{{FOLDER_PATH}}"
GROUP BY status
SORT count(rows) DESC
```

### 클래스별 분포

```dataview
TABLE class AS "클래스", count(rows) AS "개수"
FROM "{{FOLDER_PATH}}"
GROUP BY class
SORT count(rows) DESC
```

## 🔗 관련 MOC

- [[_MASTER-INDEX]] - 전체 시스템 대시보드
- [[{{RELATED_MOC_1}}]]
- [[{{RELATED_MOC_2}}]]
- [[{{RELATED_MOC_3}}]]

## 📝 유지보수 노트

### 최근 변경사항
- {{CHANGE_1}}
- {{CHANGE_2}}
- {{CHANGE_3}}

### 예정된 작업
- [ ] {{TODO_1}}
- [ ] {{TODO_2}}
- [ ] {{TODO_3}}

---

**생성일**: {{DATE}}
**마지막 업데이트**: {{UPDATED}}
**MOC 버전**: {{VERSION}}
