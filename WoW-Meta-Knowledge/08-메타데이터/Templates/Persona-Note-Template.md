---
type: persona
class: {{CLASS}}
spec: {{SPEC}}
level: {{LEVEL}}
experience: {{EXPERIENCE}}
confidence: {{CONFIDENCE}}
status: {{STATUS}}
tags:
  - persona
  - {{CLASS}}
  - {{SPEC}}
created: {{DATE}}
updated: {{DATE}}
---

# {{SPEC}} {{CLASS}} AI 페르소나

## 🤖 페르소나 정보

| 속성 | 값 |
|------|-----|
| **전문화** | {{SPEC}} {{CLASS}} |
| **레벨** | {{LEVEL}} / 10 |
| **경험치** | {{EXPERIENCE}} / {{NEXT_LEVEL_XP}} |
| **신뢰도** | {{CONFIDENCE}}% |
| **상태** | {{STATUS}} |
| **전문 분야** | {{EXPERTISE}} |

## 📚 지식 베이스

### 스킬 지식 ({{SKILL_COUNT}}개)
```dataview
TABLE koreanName AS "한글명", englishName AS "영문명", tier AS "등급"
FROM "01-스킬-DB/{{CLASS}}"
WHERE spec = "{{SPEC}}" OR spec = "공용"
SORT tier DESC, koreanName ASC
```

### 가이드 지식
- [[{{SPEC}}-{{CLASS}}-Guide]] - 메인 가이드
- 외부 소스: {{EXTERNAL_SOURCE_COUNT}}개 통합

### 로그 분석 이력 ({{LOG_COUNT}}개)
```dataview
TABLE reportType AS "타입", difficulty AS "난이도", percentile AS "백분위"
FROM "03-로그-분석"
WHERE class = "{{CLASS}}" AND spec = "{{SPEC}}"
SORT date DESC
LIMIT 10
```

## 🎓 학습 이력

### 레벨업 기록

#### Level {{CURRENT_LEVEL}} (현재)
- **달성일**: {{LEVEL_DATE}}
- **주요 학습**: {{MAJOR_LEARNING}}
- **신뢰도 상승**: {{CONFIDENCE_GAIN}}%

#### Level {{PREVIOUS_LEVEL}}
- **달성일**: {{PREV_LEVEL_DATE}}
- **주요 학습**: {{PREV_MAJOR_LEARNING}}

### 최근 학습 활동

| 날짜 | 활동 | XP 획득 | 세부사항 |
|------|------|---------|---------|
| {{ACTIVITY_DATE_1}} | {{ACTIVITY_TYPE_1}} | +{{XP_1}} | {{DETAIL_1}} |
| {{ACTIVITY_DATE_2}} | {{ACTIVITY_TYPE_2}} | +{{XP_2}} | {{DETAIL_2}} |
| {{ACTIVITY_DATE_3}} | {{ACTIVITY_TYPE_3}} | +{{XP_3}} | {{DETAIL_3}} |

## 💡 전문 분야

### 강점
1. **{{STRENGTH_1}}**
   - 신뢰도: {{STRENGTH_1_CONFIDENCE}}%
   - 근거: {{STRENGTH_1_EVIDENCE}}

2. **{{STRENGTH_2}}**
   - 신뢰도: {{STRENGTH_2_CONFIDENCE}}%
   - 근거: {{STRENGTH_2_EVIDENCE}}

### 학습 중
1. **{{LEARNING_1}}**
   - 진행도: {{LEARNING_1_PROGRESS}}%
   - 예상 완료: {{LEARNING_1_ETA}}

2. **{{LEARNING_2}}**
   - 진행도: {{LEARNING_2_PROGRESS}}%
   - 예상 완료: {{LEARNING_2_ETA}}

## 🎯 성능 지표

### 질문 응답 성공률
- **전체**: {{OVERALL_SUCCESS}}%
- **로테이션**: {{ROTATION_SUCCESS}}%
- **특성 빌드**: {{BUILD_SUCCESS}}%
- **스탯 우선순위**: {{STAT_SUCCESS}}%

### 로그 분석 정확도
- **DPS 예측**: {{DPS_PREDICTION_ACCURACY}}%
- **실수 감지**: {{MISTAKE_DETECTION_ACCURACY}}%
- **개선 제안**: {{RECOMMENDATION_ACCURACY}}%

## 🔄 데이터 소스 통합

### 내부 데이터
- 스킬 DB: [[01-스킬-DB/{{CLASS}}]]
- 가이드: [[{{SPEC}}-{{CLASS}}-Guide]]
- 로그 분석: [[03-로그-분석]]

### 외부 데이터
- Wowhead (한/영): {{WOWHEAD_SYNC_DATE}}
- Maxroll: {{MAXROLL_SYNC_DATE}}
- Icy Veins: {{ICY_VEINS_SYNC_DATE}}
- Archon: {{ARCHON_SYNC_DATE}}
- Method: {{METHOD_SYNC_DATE}}

## 📊 학습 로드맵

### 단기 목표 (다음 레벨)
- [ ] {{SHORT_TERM_GOAL_1}}
- [ ] {{SHORT_TERM_GOAL_2}}
- [ ] {{SHORT_TERM_GOAL_3}}

### 중기 목표 (레벨 {{TARGET_LEVEL}})
- [ ] {{MID_TERM_GOAL_1}}
- [ ] {{MID_TERM_GOAL_2}}

### 장기 목표 (레벨 10)
- [ ] {{LONG_TERM_GOAL_1}}
- [ ] {{LONG_TERM_GOAL_2}}

## 🔗 관련 리소스

### 관련 페르소나
- 같은 클래스: [[{{OTHER_SPEC_1}}-{{CLASS}}-Persona]], [[{{OTHER_SPEC_2}}-{{CLASS}}-Persona]]
- 같은 역할: {{SAME_ROLE_PERSONAS}}

### 페르소나 관리
- [[_PERSONA-INDEX]] - 전체 페르소나 랭킹
- [[BaseSpecializationPersona]] - 페르소나 아키텍처

## 📝 관리 노트

### 유지보수 이력
- {{MAINTENANCE_1}}
- {{MAINTENANCE_2}}

### 알려진 이슈
- {{ISSUE_1}}
- {{ISSUE_2}}

---

**생성일**: {{DATE}}
**마지막 업데이트**: {{UPDATED}}
**다음 레벨까지**: {{XP_TO_NEXT_LEVEL}} XP
**페르소나 버전**: {{VERSION}}
