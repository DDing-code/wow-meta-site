---
type: index
category: guides
totalGuides: 39
tags:
  - index
  - guides
created: 2025-11-11
updated: 2025-11-11
---

# 📚 전문화별 가이드 통합 검색

> **39개 전문화 가이드**: 각 가이드는 AI 페르소나와 스킬 DB에 유기적으로 연결

## 📊 전체 통계

| 항목 | 수량 |
|------|------|
| **총 가이드 수** | 39개 |
| **완성 가이드** | 0개 |
| **진행 중** | 0개 |
| **계획 단계** | 0개 |
| **마이그레이션 상태** | 🔄 대기 중 (0%) |

## 🎯 가이드 상태 대시보드

### 완성 가이드 (신뢰도 90%+)

```dataview
TABLE spec AS "전문화", confidence AS "신뢰도", patch AS "패치", updated AS "업데이트"
FROM "02-전문화별-가이드"
WHERE type = "guide" AND status = "완성" AND confidence >= 90
SORT confidence DESC
```

### 진행 중 가이드

```dataview
TABLE spec AS "전문화", status AS "상태", confidence AS "신뢰도", updated AS "업데이트"
FROM "02-전문화별-가이드"
WHERE type = "guide" AND status = "진행중"
SORT confidence DESC
```

### 계획 단계 가이드

```dataview
TABLE spec AS "전문화", status AS "상태", created AS "생성일"
FROM "02-전문화별-가이드"
WHERE type = "guide" AND status = "계획"
SORT class ASC, spec ASC
```

## 🗂️ 클래스별 가이드 목록

### 전사 (Warrior)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **무기 (Arms)** | 거신 | 학살자 | 🔄 대기 | 0% |
| **분노 (Fury)** | 산왕 | 학살자 | 🔄 대기 | 0% |
| **방어 (Protection)** | 거신 | 산왕 | 🔄 대기 | 0% |

---

### 성기사 (Paladin)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **신성 (Holy)** | 빛의 대장장이 | 태양의 사자 | 🔄 대기 | 0% |
| **보호 (Protection)** | 빛의 대장장이 | 기사단 | 🔄 대기 | 0% |
| **징벌 (Retribution)** | 기사단 | 태양의 사자 | 🔄 대기 | 0% |

---

### 사냥꾼 (Hunter)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **야수 (Beast Mastery)** | 어둠 순찰자 | 무리의 지도자 | 🔄 대기 | 0% |
| **사격 (Marksmanship)** | 어둠 순찰자 | 파수꾼 | 🔄 대기 | 0% |
| **생존 (Survival)** | 무리의 지도자 | 파수꾼 | 🔄 대기 | 0% |

---

### 도적 (Rogue)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **암살 (Assassination)** | 운명결속 | 죽음추적자 | 🔄 대기 | 0% |
| **무법 (Outlaw)** | 기만자 | 운명결속 | 🔄 대기 | 0% |
| **잠행 (Subtlety)** | 기만자 | 죽음추적자 | 🔄 대기 | 0% |

---

### 사제 (Priest)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **수양 (Discipline)** | 예언자 | 공허술사 | 🔄 대기 | 0% |
| **신성 (Holy)** | 예언자 | 집정관 | 🔄 대기 | 0% |
| **암흑 (Shadow)** | 집정관 | 공허술사 | 🔄 대기 | 0% |

---

### 주술사 (Shaman)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **정기 (Elemental)** | 선견자 | 폭풍인도자 | 🔄 대기 | 0% |
| **고양 (Enhancement)** | 토템술사 | 폭풍인도자 | 🔄 대기 | 0% |
| **복원 (Restoration)** | 선견자 | 토템술사 | 🔄 대기 | 0% |

---

### 마법사 (Mage)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **비전 (Arcane)** | 성난태양 | 주문술사 | 🔄 대기 | 0% |
| **화염 (Fire)** | 성난태양 | 서리불꽃 | 🔄 대기 | 0% |
| **냉기 (Frost)** | 서리불꽃 | 주문술사 | 🔄 대기 | 0% |

---

### 흑마법사 (Warlock)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **고통 (Affliction)** | 영혼 수확자 | 지옥소환사 | 🔄 대기 | 0% |
| **악마 (Demonology)** | 악마학자 | 영혼 수확자 | 🔄 대기 | 0% |
| **파괴 (Destruction)** | 악마학자 | 지옥소환사 | 🔄 대기 | 0% |

---

### 수도사 (Monk)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **양조 (Brewmaster)** | 음영파 | 조화의 종사 | 🔄 대기 | 0% |
| **운무 (Mistweaver)** | 천신의 대변자 | 조화의 종사 | 🔄 대기 | 0% |
| **풍운 (Windwalker)** | 천신의 대변자 | 음영파 | 🔄 대기 | 0% |

---

### 드루이드 (Druid)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **조화 (Balance)** | 숲의 수호자 | 엘룬의 대리자 | 🔄 대기 | 0% |
| **야성 (Feral)** | 야생추적자 | 발톱의 드루이드 | 🔄 대기 | 0% |
| **수호 (Guardian)** | 엘룬의 대리자 | 발톱의 드루이드 | 🔄 대기 | 0% |
| **회복 (Restoration)** | 야생추적자 | 숲의 수호자 | 🔄 대기 | 0% |

---

### 악마사냥꾼 (Demon Hunter)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **파멸 (Havoc)** | 알드라치 파괴자 | 지옥상흔 | 🔄 대기 | 0% |
| **복수 (Vengeance)** | 알드라치 파괴자 | 지옥상흔 | 🔄 대기 | 0% |

---

### 죽음의 기사 (Death Knight)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **혈기 (Blood)** | 산레인 | 죽음인도자 | 🔄 대기 | 0% |
| **냉기 (Frost)** | 종말의 기수 | 죽음인도자 | 🔄 대기 | 0% |
| **부정 (Unholy)** | 산레인 | 종말의 기수 | 🔄 대기 | 0% |

---

### 기원사 (Evoker)

| 전문화 | 영웅 특성 1 | 영웅 특성 2 | 상태 | 신뢰도 |
|--------|------------|------------|------|--------|
| **황폐 (Devastation)** | 불꽃형성자 | 비늘사령관 | 🔄 대기 | 0% |
| **보존 (Preservation)** | 불꽃형성자 | 시간 감시자 | 🔄 대기 | 0% |
| **증강 (Augmentation)** | 시간 감시자 | 비늘사령관 | 🔄 대기 | 0% |

---

## 🔍 검색 및 필터

### 역할별 가이드

**DPS**:
```dataview
TABLE spec AS "전문화", class AS "클래스", confidence AS "신뢰도", status AS "상태"
FROM "02-전문화별-가이드"
WHERE type = "guide" AND (role = "DPS" OR role = "Melee DPS" OR role = "Ranged DPS")
SORT confidence DESC
```

**힐러**:
```dataview
TABLE spec AS "전문화", class AS "클래스", confidence AS "신뢰도", status AS "상태"
FROM "02-전문화별-가이드"
WHERE type = "guide" AND role = "Healer"
SORT confidence DESC
```

**탱커**:
```dataview
TABLE spec AS "전문화", class AS "클래스", confidence AS "신뢰도", status AS "상태"
FROM "02-전문화별-가이드"
WHERE type = "guide" AND role = "Tank"
SORT confidence DESC
```

### 최근 업데이트 (7일)

```dataview
TABLE spec AS "전문화", class AS "클래스", patch AS "패치", updated AS "업데이트"
FROM "02-전문화별-가이드"
WHERE type = "guide" AND date(updated) >= date(today) - dur(7 days)
SORT updated DESC
```

## 📈 통계

### 가이드 상태 분포

```dataview
TABLE WITHOUT ID
  status AS "상태",
  count(rows) AS "개수",
  round((count(rows) / 39) * 100, 1) + "%" AS "비율"
FROM "02-전문화별-가이드"
WHERE type = "guide"
GROUP BY status
SORT count(rows) DESC
```

### 신뢰도 분포

```dataview
TABLE WITHOUT ID
  "90%+" AS "신뢰도 범위",
  length(filter(rows, (r) => r.confidence >= 90)) AS "개수"
FROM "02-전문화별-가이드"
WHERE type = "guide"
```

## 🔗 관련 리소스

### 내부 링크
- [[_MASTER-INDEX|메인 대시보드]]
- [[_SKILL-INDEX|스킬 검색]]
- [[_PERSONA-INDEX|AI 페르소나]]

### 외부 가이드 소스
- [[04-가이드-수정/Wowhead|Wowhead 통합]]
- [[04-가이드-수정/Maxroll|Maxroll 통합]]
- [[04-가이드-수정/Icy-Veins|Icy Veins 통합]]
- [[04-가이드-수정/Archon|Archon 통합]]
- [[04-가이드-수정/Method|Method 통합]]

---

**생성일**: 2025-11-11
**마지막 업데이트**: 2025-11-11
**총 가이드**: 0 / 39 (0%)
**마이그레이션 상태**: 🔄 대기 중
