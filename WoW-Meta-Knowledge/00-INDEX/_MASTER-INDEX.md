---
type: index
category: master
tags:
  - index
  - dashboard
created: 2025-11-11
updated: 2025-11-11
---

# 🎯 WoW Meta Knowledge - 마스터 대시보드

> **Claude의 두뇌**: 모든 WoW 지식이 유기적으로 연결된 중앙 허브

## 📊 시스템 현황

### 전체 통계

| 모듈 | 항목 수 | 완성도 | 상태 |
|------|---------|--------|------|
| [[_SKILL-INDEX\|스킬 DB]] | 1,186개 | 0% | 🔄 마이그레이션 대기 |
| [[_GUIDE-INDEX\|가이드]] | 39개 | 0% | 📋 스켈레톤 생성 예정 |
| [[_PERSONA-INDEX\|AI 페르소나]] | 39개 | 0% | 🤖 초기화 예정 |
| **로그 분석** | 0개 | N/A | ⏳ 준비 중 |
| **외부 소스** | 0개 | N/A | ⏳ 준비 중 |

### 최근 활동 (7일)

```dataview
TABLE type AS "타입", file.mtime AS "수정일"
FROM ""
WHERE file.mtime >= date(today) - dur(7 days)
SORT file.mtime DESC
LIMIT 10
```

## 🗂️ 5대 핵심 모듈

### 1. 스킬 DB (Single Source of Truth)

**상태**: 🔄 마이그레이션 대기 중
**진행**: 0 / 1,186 (0%)

```dataview
TABLE class AS "클래스", count(rows) AS "스킬 수"
FROM "01-스킬-DB"
WHERE type = "skill"
GROUP BY class
SORT count(rows) DESC
```

**빠른 링크**:
- [[_SKILL-INDEX|전체 스킬 검색]]
- [[01-스킬-DB/Warriors|전사 스킬]]
- [[01-스킬-DB/Mages|마법사 스킬]]
- [[01-스킬-DB/DeathKnights|죽음의 기사 스킬]]

---

### 2. 전문화별 가이드

**상태**: 📋 스켈레톤 생성 예정
**진행**: 0 / 39 (0%)

```dataview
TABLE spec AS "전문화", status AS "상태", confidence AS "신뢰도"
FROM "02-전문화별-가이드"
WHERE type = "guide"
SORT confidence DESC
LIMIT 10
```

**최우선 가이드**:
- [[ArcaneMage-Guide|비전 마법사]] (신뢰도: 0%)
- 나머지 38개: 미생성

**빠른 링크**:
- [[_GUIDE-INDEX|전체 가이드 상태]]

---

### 3. 로그 분석

**상태**: ⏳ 준비 중
**진행**: 0 / 0 (N/A)

```dataview
TABLE reportType AS "타입", class AS "클래스", spec AS "전문화", percentile AS "백분위"
FROM "03-로그-분석"
WHERE type = "analysis"
SORT date DESC
LIMIT 10
```

**분석 카테고리**:
- WarcraftLogs 분석: 0개
- 통계 리포트: 0개
- 피드백 통합: 0개

---

### 4. 외부 가이드 통합

**상태**: ⏳ 준비 중
**진행**: 0 / 0 (N/A)

```dataview
TABLE source AS "소스", count(rows) AS "통합 수"
FROM "04-가이드-수정"
GROUP BY source
SORT count(rows) DESC
```

**외부 소스**:
- Wowhead (한/영): 0개
- Maxroll: 0개
- Icy Veins: 0개
- Archon: 0개
- Method: 0개

---

### 5. AI 페르소나 (39개)

**상태**: 🤖 초기화 예정
**진행**: 0 / 39 (0%)

```dataview
TABLE spec AS "전문화", level AS "레벨", confidence AS "신뢰도", experience AS "경험치"
FROM "05-AI-페르소나"
WHERE type = "persona"
SORT level DESC, confidence DESC
LIMIT 10
```

**레벨 10 페르소나**: 0개
**레벨 5+ 페르소나**: 0개
**학습 중 페르소나**: 0개

**빠른 링크**:
- [[_PERSONA-INDEX|페르소나 랭킹]]

---

## 🔄 유기적 데이터 흐름

```
┌─────────────┐
│  스킬 DB    │ ◄────────────────┐
│ (1,186개)   │                   │
└──────┬──────┘                   │
       │                          │
       ├──► 가이드 페이지         │
       │    (39개)                │
       │                          │
       ├──► 로그 분석 ◄──────────┤
       │    (실시간)              │
       │                          │
       └──► AI 페르소나 ◄────────┘
            (학습/피드백)
```

## 🎯 다음 단계 (Phase 3-8)

### Phase 3: 스킬 DB 마이그레이션 (진행 중)
- [ ] `js-to-md-migration.js` 스크립트 작성
- [ ] 1,186개 스킬 → Markdown 변환
- [ ] 13개 클래스 폴더 구조 확인
- [ ] 아이콘 매핑 검증

### Phase 4: 가이드 마이그레이션
- [ ] ArcaneMage 가이드 변환
- [ ] 38개 스켈레톤 가이드 생성
- [ ] 가이드 링크 통합

### Phase 5: AI 페르소나 초기화
- [ ] ArcaneMage 페르소나 통합 (Level 3)
- [ ] 38개 초기 페르소나 생성 (Level 1)

### Phase 6: 양방향 동기화
- [ ] `md-to-js-sync.js` 스크립트 작성
- [ ] chokidar 파일 감시자 설정
- [ ] 충돌 해결 로직 구현

### Phase 7: MOC 및 Dataview 구축
- [ ] 8개 MOC 노트 생성
- [ ] 재사용 가능 쿼리 작성
- [ ] 대시보드 완성

### Phase 8: 시스템 다이어그램
- [ ] Excalidraw 플러그인 설치
- [ ] 유기적 시스템 다이어그램 재현
- [ ] 데이터 흐름 시각화

## 📝 최근 변경사항

### 2025-11-11
- ✅ Vault 폴더 구조 생성 완료 (8개 핵심 폴더)
- ✅ 5개 마스터 템플릿 작성 완료
- ✅ 5개 INDEX 노트 생성 완료
- 🔄 Phase 2 완료, Phase 3 시작

## 🔗 빠른 네비게이션

### 핵심 INDEX
- [[_SKILL-INDEX|🎯 스킬 검색]]
- [[_GUIDE-INDEX|📚 가이드 상태]]
- [[_PERSONA-INDEX|🤖 AI 페르소나]]
- [[_CHANGELOG|📝 변경 이력]]

### 시스템 문서
- [[06-시스템-아키텍처/Data-Flow-Diagram|시스템 아키텍처]]
- [[07-동기화/Sync-Status|동기화 상태]]
- [[08-메타데이터/Templates|템플릿 목록]]

---

**생성일**: 2025-11-11
**마지막 업데이트**: 2025-11-11
**Vault 버전**: 1.0.0
**총 노트 수**: 10개 (예정: 1,317개)
