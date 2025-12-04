# WoW 가이드 생성 마스터 프롬프트 v2.0

## 사용법

```
가이드 생성 요청 시 이 프롬프트를 참조하여:
1. {변수}를 실제 값으로 치환
2. 각 섹션별 Magic MCP 검색 실행
3. KB 데이터 로드 후 가이드 생성
4. TERMINOLOGY_GUIDE.md 용어 규칙 준수
```

---

## 📌 필수 사전 참조

> ⚠️ **가이드 생성 전 반드시 확인!**

| 문서 | 경로 | 내용 |
|------|------|------|
| 용어 지침 | `99-META/TERMINOLOGY_GUIDE.md` | 한국 커뮤니티 용어 |
| 생성 지침 | `99-META/Guide-Generation-Instructions.md` | 워크플로우/스키마 |
| 스킬 스키마 | `99-META/Skill-DB-Schema.md` | DB 구조 |
| 디자인 가이드 | `99-META/Design-Guidelines.md` | 시각 스타일 |

---

## 🔧 변수 정의

```yaml
# 필수 변수 (요청 시 파악)
CLASS: 직업명 (예: DemonHunter, Mage, Warrior)
CLASS_KR: 직업명 한글 (예: 악마사냥꾼, 마법사, 전사)
SPEC: 전문화 영문 (예: Havoc, Arcane, Arms)
SPEC_KR: 전문화 한글 (예: 파멸, 비전, 무기)
ROLE: 역할 (Melee DPS, Ranged DPS, Healer, Tank)
PATCH: 현재 패치 (11.2.5)

# 직업 색상 (WoW 공식)
CLASS_COLOR: {
  DemonHunter: '#A330C9',
  Warrior: '#C69B6D', 
  Paladin: '#F48CBA',
  Hunter: '#AAD372',
  Rogue: '#FFF468',
  Priest: '#FFFFFF',
  Shaman: '#0070DD',
  Mage: '#3FC7EB',
  Warlock: '#8788EE',
  Monk: '#00FF98',
  Druid: '#FF7C0A',
  DeathKnight: '#C41E3A',
  Evoker: '#33937F'
}

# 영웅 특성 (TWW)
HERO_SPEC_1: 첫 번째 영웅 특성
HERO_SPEC_2: 두 번째 영웅 특성
```

---

## 📝 용어 규칙 (TERMINOLOGY_GUIDE.md 준수)

### ✅ 반드시 변경해야 할 용어

| ❌ 사용 금지 | ✅ 올바른 표현 |
|-------------|---------------|
| 퍼널 딜, Funnel damage | **깔때기 딜** |
| 버스트, Burst damage | **극딜** |
| 광역, AoE damage | **광딜** |
| 윈도우, Window | **타이밍** |

### ✅ 유지할 용어

업타임, 캡 방지, 필러 스킬, 분노 축적, 더블딥, 동기화, 스펜더, 빌더, 프리풀, 쿨마다

### ⭐ 스킬명 규칙: Wowhead 한국어 공식 번역명 사용

```
✅ 올바른 예시:
- "정수 파쇄" (ko.wowhead.com/spell=258860)
- "죽음의 휩쓸기" (띄어쓰기 O)
- "칼춤" (띄어쓰기 X)
- "지옥칼" (띄어쓰기 X)

❌ 잘못된 예시:
- "정파", "복퇴", "죽휩" (줄임말 금지)
- "정수파쇄" (Wowhead는 "정수 파쇄")
- "칼날 춤" (Wowhead는 "칼춤")
```

### 숫자/단위 표기

| 항목 | 표기법 | 예시 |
|------|--------|------|
| 시간 | 초 단위 | "4초", "3초 내" |
| 퍼센트 | % 기호 | "80%", "15%" |
| 분노 | 숫자+분노 | "80분노", "40분노 미만" |
| 스택 | 숫자+스택 | "4스택", "1스택 이상" |
| 충전 | 숫자+충전 | "2충전", "0충전까지" |

---

## 📋 가이드 구조 (공통)

### 섹션 1: 직업 개요
```yaml
목적: "{SPEC_KR} {CLASS_KR}이 어떤 전문화인지 한눈에 파악"

내용:
  - 전문화 아이덴티티
  - 강점 / 약점
  - 추천 콘텐츠 (레이드 / M+ / PvP)
  - 난이도 평가

Magic_MCP_검색:
  - "hero banner section"
  - "feature card grid"
  - "pros cons list"
```

---

### 섹션 2: 핵심 자원 시스템
```yaml
목적: "주요 자원 메커니즘 이해"

내용:
  - 주 자원 설명 (마나/격노/기력/룬 등)
  - 보조 자원 설명 (있는 경우)
  - 자원 생성 스킬 (빌더)
  - 자원 소비 스킬 (스펜더)
  - 자원 관리 팁 (캡 방지)

Magic_MCP_검색:
  - "resource bar meter"
  - "progress indicator"
  - "skill card icon"
```

---

### 섹션 3: 핵심 스킬 가이드
```yaml
목적: "주요 스킬 10~15개 상세 설명"

내용:
  각 스킬별:
    - 아이콘 + 이름 (Wowhead 공식 번역명)
    - 쿨다운 / 시전 시간 / 자원 비용
    - 효과 설명
    - 사용 타이밍
    - 시너지 스킬
    - 주의사항

Magic_MCP_검색:
  - "skill ability card"
  - "gaming card hover glow"
  - "tooltip popup"
  - "dark card grid"

스킬_분류:
  - ⭐ 최우선 스킬 (빌드 핵심)
  - 🔥 주요 공격기
  - 💨 이동기/유틸
  - 🛡️ 생존기
  - ⚡ 쿨다운 스킬
```

---

### 섹션 4: 영웅 특성 비교
```yaml
목적: "{HERO_SPEC_1} vs {HERO_SPEC_2} 선택 가이드"

내용:
  각 영웅 특성별:
    - 핵심 메커니즘
    - 플레이 스타일
    - 추천 콘텐츠
    - 장단점
  
  비교:
    - 레이드 ST 추천
    - 레이드 광딜/클리브 추천
    - M+ 추천
    - PvP 추천

Magic_MCP_검색:
  - "comparison card side by side"
  - "toggle switch selector"
  - "tab panel switcher"
  - "versus comparison"
```

---

### 섹션 5: 기본 로테이션
```yaml
목적: "ST / 광딜 기본 우선순위 학습"

내용:
  오프닝:
    - 프리풀 준비
    - 시작 순서 (1~5스킬)
  
  단일_대상(ST):
    - 우선순위 리스트 (1~8순위)
    - 조건부 로직 설명
  
  광역(광딜):
    - 2~3타겟 전환점
    - 4+ 타겟 우선순위
  
  쿨다운_관리:
    - 주요 쿨다운 사용 타이밍
    - 극딜 타이밍 정렬

Magic_MCP_검색:
  - "priority list numbered"
  - "timeline horizontal steps"
  - "sequence flow"
  - "step indicator"

시각자료_방향:
  오프너: LR (가로)
  우선순위: TD (세로)
```

---

### 섹션 6: 극딜 타이밍 (해당 시)
```yaml
목적: "핵심 극딜 구간 최적화"

조건: 해당 전문화에 명확한 극딜 타이밍이 있는 경우

내용:
  - 극딜 트리거 스킬
  - 타이밍 지속 시간
  - 타이밍 내 우선순위
  - GCD 계산
  - 실수 방지 팁

Magic_MCP_검색:
  - "countdown timer"
  - "burst window diagram"
  - "warning callout alert"
  - "highlight box"

예시_전문화:
  - 파멸 악마사냥꾼: 정수 파쇄 타이밍 (4초)
  - 비전 마법사: 쇄도 (버프 스택)
  - 암살 도적: 소멸 타이밍
```

---

### 섹션 7: 고급 테크닉
```yaml
목적: "상급자 최적화 팁"

내용:
  이동기_활용:
    - 이동기로 딜링 (해당 시)
    - 포지셔닝 최적화
  
  멀티도팅:
    - 도트 관리 (해당 시)
    - 타겟 스왑 타이밍
  
  쿨다운_계획:
    - 보스 페이즈별 쿨 관리
    - 파티 시너지 맞추기
  
  생존_최적화:
    - 생존기 사용 타이밍
    - 힐러 부담 줄이기

Magic_MCP_검색:
  - "accordion collapsible"
  - "pro tip callout"
  - "advanced section"
```

---

### 섹션 8: 스탯 & 장비
```yaml
목적: "스탯 우선순위 및 장비 가이드"

내용:
  스탯_우선순위:
    - {HERO_SPEC_1} 기준
    - {HERO_SPEC_2} 기준 (다른 경우)
  
  스탯_설명:
    - 각 스탯이 전문화에 미치는 영향
    - 브레이크포인트 (있는 경우)
  
  장비:
    - 필수 템 (레이드/M+)
    - 장신구 추천
    - 세트 효과 활용

Magic_MCP_검색:
  - "stat bar chart horizontal"
  - "equipment item card"
  - "tier list ranking"
```

---

### 섹션 9: 특성 빌드
```yaml
목적: "콘텐츠별 추천 빌드"

내용:
  레이드_빌드:
    - {HERO_SPEC_1} ST
    - {HERO_SPEC_1} 클리브
    - {HERO_SPEC_2} (해당 시)
  
  M+_빌드:
    - 범용 빌드
    - 고쐐기 빌드
  
  각_빌드별:
    - 특성 코드 (복사용)
    - 핵심 특성 설명
    - 플레이 차이점

Magic_MCP_검색:
  - "build card code"
  - "talent tree visual"
  - "copy button input"
```

---

## 🎨 디자인 시스템

### 색상 적용 규칙
```javascript
// 메인 테마
primary: CLASS_COLOR[CLASS]  // 직업 색상
secondary: darken(primary, 30%)  // 어두운 버전
accent: complementary(primary)  // 보조 색상

// 공통 배경 (다크 테마)
background: {
  primary: '#0D0D14',
  secondary: '#1A1A2E', 
  card: '#1E1E32'
}

// 공통 텍스트
text: {
  primary: '#FFFFFF',
  secondary: '#B8B8D0',
  muted: '#6B7280'
}
```

### 컴포넌트 공통 스타일
```css
/* 카드 */
border: 1px solid {CLASS_COLOR}40;
border-radius: 8px ~ 12px;
background: #1E1E32;

/* 호버 */
hover:border-color: {CLASS_COLOR};
hover:box-shadow: 0 0 15px {CLASS_COLOR}40;
hover:transform: translateY(-2px);

/* 아이콘 */
border: 2px solid {CLASS_COLOR};
box-shadow: 0 0 10px {CLASS_COLOR}40;
```

### Mermaid 시각자료 방향
```
오프너/시퀀스: LR (가로) ← 필수!
우선순위: TD (세로)
```

---

## 📦 데이터 로드 & KB 연동 시스템

### KB 경로 (Single Source of Truth)
```
옵시디언 KB: C:/wowmeta/WoW-Meta-Knowledge/
  ├── 01-ATOMIC/Skills/{Class}/   ← 스킬 원자 노트
  ├── 03-PRIORITY/{Class}/{Spec}/ ← 우선순위 노트
  └── 05-GUIDES/{Class}/          ← 가이드 통합 노트 (★ 주요 소스)

React 사이트:
  ├── scripts/sync-kb.js          ← MD → JSON 변환 스크립트
  ├── src/data/kb/                 ← 변환된 KB JSON 저장소
  │   └── bm-hunter-kb.json       ← 야수 사냥꾼 KB
  └── src/hooks/useKB.js          ← KB 사용 React 훅
```

### KB 동기화 명령어
```bash
# KB 동기화 (Obsidian MD → JSON 변환)
npm run sync-kb

# 개발 서버 (자동 동기화 포함)
npm run dev
```

### useKB 훅 사용법
```javascript
import { useKB } from '../hooks/useKB';

function MyGuideComponent() {
  const { 
    data,           // 전체 KB 데이터
    loading,        // 로딩 상태
    error,          // 에러
    tips,           // 고수 팁 (중요도순 정렬)
    macros,         // 매크로 목록
    weakauras,      // WeakAura 링크
    meta            // 패치/시즌 정보
  } = useKB('beastMasteryHunter');

  if (loading) return <div>KB 로딩 중...</div>;
  
  return (
    <div>
      {tips.map((tip, i) => (
        <div key={i}>⭐ {tip.tip} (중요도: {tip.importance})</div>
      ))}
    </div>
  );
}
```

### KB JSON 구조 (bm-hunter-kb.json 예시)
```json
{
  "meta": {
    "patch": "11.2.5",
    "season": "The War Within 시즌 3",
    "syncedAt": "2025-12-04T00:00:00.000Z",
    "sourceFile": "BeastMastery-Expert-Guide-S3.md"
  },
  "structured": {
    "meta": {
      "heroSpecRecommendation": "Dark Ranger (98% 사용률)",
      "statPriority": {
        "darkRanger": "가속 ≥ 치명타 > 다재다능 > 특화",
        "packLeader": "가속 > 특화/치명타 > 다재다능"
      }
    },
    "darkRanger": {
      "deathblowTimings": ["16초", "12초", "8초", "4초", "0초"],
      "tips": [{ "tip": "...", "importance": 5 }],
      "priorities": [{ "rank": 1, "skill": "Black Arrow", "condition": "...", "reason": "..." }],
      "opener": ["선풀 Barbed Shot", "Bestial Wrath + 종족 스킬", "..."]
    },
    "packLeader": {
      "howlThreshold": 16,
      "doubleStampedeWindow": 12,
      "stampedeDirection": "캐릭터 → 보스/몹 중앙 직선",
      "tips": ["..."],
      "priorities": ["..."]
    },
    "common": {
      "tips": ["..."],
      "weakauras": ["https://wago.io/..."],
      "macros": ["#showtooltip ..."],
      "mistakes": [{ "mistake": "...", "dpsLoss": "5-10%", "fix": "..." }],
      "dungeonSwaps": [{ "dungeon": "Ara-Kara", "swap": "Pack Leader", "reason": "..." }]
    }
  },
  "tierSet": {
    "darkRanger": { "twoSet": ["..."], "fourSet": ["..."] },
    "packLeader": { "twoSet": ["..."], "fourSet": ["..."] }
  },
  "cooldowns": {
    "callOfTheWild": { "base": "3분", "with2Set": "2분" },
    "bestialWrath": { "base": "90초", "dynamic": "~45초" }
  }
}
```

### KB 데이터 활용 위치
| 섹션 | KB 데이터 | 용도 |
|------|-----------|------|
| 제7장 고급 최적화 | `macros`, `weakauras` | 매크로/WA 동적 렌더링 |
| 제8장 흔한 실수 | `common.mistakes` | 실수 목록 자동 갱신 |
| 제10장 프로 팁 | `tips`, `darkRangerTips` | 고수 팁 동적 표시 |
| 제4장 영웅 특성 | `heroSpec()` | 영웅 특성별 데이터 |

### 새 가이드 KB 추가 방법
1. Obsidian에서 `05-GUIDES/{Class}/{Spec}-Expert-Guide-S3.md` 작성
2. `scripts/sync-kb.js`에 매핑 추가:
   ```javascript
   const KB_MAPPINGS = {
     'beastMasteryHunter': '05-GUIDES/Hunter/BeastMastery-Expert-Guide-S3.md',
     'havocDemonHunter': '05-GUIDES/DemonHunter/Havoc-Expert-Guide-S3.md', // 새 가이드
   };
   ```
3. `src/hooks/useKB.js`에 import 추가:
   ```javascript
   const KB_MODULES = {
     beastMasteryHunter: () => import('../data/kb/bm-hunter-kb.json'),
     havocDemonHunter: () => import('../data/kb/havoc-dh-kb.json'), // 새 가이드
   };
   ```
4. `npm run sync-kb` 실행

### 아이콘 URL
```javascript
getIconUrl(iconName) => 
  `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`
```

---

## 📌 출처 표기 (필수!)

### 모든 가이드에 포함
```yaml
source: "Voodoo (FRUG), Discord Fel Hammer"
source_url: "https://discord.gg/felhammer"
patch: 11.2.5
last_verified: 2025-12-01
```

### 출처 우선순위
1. 커뮤니티 전문가 (Voodoo, Wordup 등)
2. 공식 가이드 사이트 (Wowhead, Icy Veins)
3. 시뮬레이션 (SimC, Raidbots)
4. 로그 분석 (Warcraft Logs)

---

## ⚠️ 필수 규칙

### Magic MCP 사용 (절대 규칙)
```
❌ 금지: UI/컴포넌트 임의 생성
✅ 필수: 각 섹션마다 Magic MCP 검색 후 참고

도구: @21st-dev/magic:21st_magic_component_inspiration
```

### 용어 체크리스트
```
□ "퍼널" → "깔때기 딜"로 변경
□ "버스트" → "극딜"로 변경
□ "광역" → "광딜"로 변경
□ "윈도우" → "타이밍"으로 변경
□ 스킬명이 Wowhead 공식 번역명인가
□ 스킬 줄임말 사용하지 않았는가
```

---

## ✅ 생성 체크리스트

```
□ 변수 정의 완료 (CLASS, SPEC, HERO_SPEC 등)
□ 섹션 1~9 각각 Magic MCP 검색 완료
□ KB에서 스킬 데이터 로드 완료
□ CLASS_COLOR 테마 적용
□ 모든 스킬명 Wowhead 공식 번역명 사용
□ 용어 규칙 준수 (극딜, 광딜, 타이밍 등)
□ 모든 스킬 아이콘 렌더링 확인
□ 오프너 시각자료 LR(가로) 방향
□ 출처/패치 버전 명시
□ 링크/참조 동작 확인
```

---

## 🔄 버전

- v2.1 (2025-12-04): KB 연동 시스템 추가 (useKB 훅, sync-kb 스크립트, JSON 구조)
- v2.0 (2024-12-01): TERMINOLOGY_GUIDE + Guide-Generation-Instructions 반영
- v1.0 (2024-12-01): 범용 마스터 프롬프트 최초 작성
