# WoW 가이드 모듈 시스템 v2.0

## 📖 개요

**JSON 데이터만 작성하면 가이드가 자동 생성되는 모듈화된 시스템**

### 핵심 철학
1. **한 번 만들고, 모든 곳에서 재사용** - 컴포넌트는 한 번만 개발
2. **JSON = 가이드** - 새 가이드 = 새 JSON 파일
3. **일관된 UX** - 모든 직업 가이드가 동일한 구조와 디자인

### 구조

```
guide-modules/
├── GuideStyledComponents.js   # 레이아웃/기본 스타일
├── GuideHooks.js              # React Hooks (네비게이션, 토스트 등)
├── GuideContentComponents.js  # 콘텐츠 렌더링 컴포넌트 ⭐ NEW
├── guideSchema.js             # JSON 스키마 정의 ⭐ NEW
├── UniversalGuideRenderer.js  # 자동 렌더러 ⭐ NEW
└── README.md
```

---

## 🚀 빠른 시작: 새 가이드 만들기

### 1단계: JSON 파일 생성

```json
// src/data/guides/warrior.json
{
  "className": "warrior",
  "classNameKo": "전사",
  "color": "#C79C6E",
  "specs": {
    "fury": {
      "specName": "fury",
      "specNameKo": "분노",
      "ready": true,
      "lastUpdate": "2025-11-28",
      "patch": "11.2.5",
      "source": "Archimtiros, Discord Skyhold",
      "difficulty": "Medium",
      "role": "DPS",
      "resourceType": "격노",
      
      "overview": {
        "description": "분노 전사는...",
        "strengths": ["강점1", "강점2"],
        "weaknesses": ["약점1", "약점2"]
      },
      
      "heroTalents": {
        "mountainThane": {
          "name": "산왕",
          "nameEn": "Mountain Thane",
          "icon": "ability_warrior_mountainthane",
          "color": "#4ECDC4",
          "recommended": true,
          "description": "번개 기반 버스트...",
          "strengths": ["버스트 딜", "광역"],
          "keyMechanics": [
            {
              "name": "천둥 폭발",
              "icon": "spell_nature_thunderclap",
              "description": "설명...",
              "tips": ["팁1", "팁2"]
            }
          ]
        },
        "slayer": {
          "name": "학살자",
          "nameEn": "Slayer",
          "icon": "ability_warrior_slayer",
          "color": "#FF6B6B",
          "recommended": false,
          "description": "출혈 기반...",
          "strengths": ["지속 딜", "단일 대상"],
          "keyMechanics": []
        }
      },
      
      "tierSet": {
        "season": 3,
        "mountainThane": {
          "twoSet": "2세트 효과",
          "fourSet": "4세트 효과"
        },
        "slayer": {
          "twoSet": "2세트 효과",
          "fourSet": "4세트 효과"
        }
      },
      
      "rotation": {
        "mountainThane": {
          "opener": [
            { "timing": "-2초", "skillName": "전쟁의함성", "icon": "ability_warrior_battleshout", "note": "버프" },
            { "timing": "풀", "skillName": "돌격", "icon": "ability_warrior_charge" }
          ],
          "stPriority": [
            { "priority": 1, "skillName": "광폭화", "icon": "ability_warrior_rampage", "condition": "격노 80+", "reason": "핵심 스펜더" }
          ],
          "aoePriority": [],
          "cooldowns": []
        },
        "slayer": {
          "opener": [],
          "stPriority": [],
          "aoePriority": [],
          "cooldowns": []
        },
        "cooldowns": [
          { "skillName": "대장부의외침", "icon": "ability_warrior_rally", "cooldown": "2분", "sync": "광전사와 함께" }
        ]
      },
      
      "mechanics": [
        {
          "name": "격노 관리",
          "icon": "spell_nature_bloodlust",
          "description": "격노를 80 이상 유지...",
          "tips": ["팁1", "팁2"]
        }
      ],
      
      "tips": [
        "핵심 팁 1",
        "핵심 팁 2 - 절대 금지 사항"
      ],
      
      "faq": [
        { "question": "질문1?", "answer": "답변1" }
      ]
    }
  }
}
```

### 2단계: 페이지 컴포넌트 생성 (3줄!)

```jsx
// src/pages/FuryWarriorGuide.js
import React from 'react';
import { GuidePageWrapper } from '../components/guide-modules/UniversalGuideRenderer';
import guideData from '../data/guides/warrior.json';

const FuryWarriorGuide = () => <GuidePageWrapper guideData={guideData} specKey="fury" />;

export default FuryWarriorGuide;
```

### 3단계: 라우트 추가

```jsx
// App.js
<Route path="/guide/warrior/fury" element={<FuryWarriorGuide />} />
```

**끝!** JSON만 작성하면 가이드가 자동 생성됩니다.

---

## 📦 콘텐츠 컴포넌트

### GuideContentComponents.js

| 컴포넌트 | 용도 | Props |
|---------|------|-------|
| `SkillIcon` | 스킬 아이콘 + 툴팁 | `icon`, `name`, `description`, `cooldown` |
| `OpenerTimeline` | 오프너 시퀀스 | `steps[]`, `classColor` |
| `PriorityTable` | 우선순위 테이블 | `priorities[]`, `classColor` |
| `MechanicsSection` | 메커니즘 그리드 | `mechanics[]`, `classColor` |
| `HeroTalentTabs` | 영웅특성 탭 | `tabs[]`, `activeTab`, `onTabChange` |
| `ComboSequence` | 콤보 시퀀스 | `title`, `steps[]`, `requirements[]` |
| `TipsSection` | 팁 리스트 | `tips[]`, `classColor` |
| `FAQAccordion` | FAQ 아코디언 | `items[]`, `classColor` |
| `CooldownTable` | 쿨다운 그리드 | `cooldowns[]`, `classColor` |
| `StrengthWeaknessGrid` | 강점/약점 그리드 | `strengths[]`, `weaknesses[]` |
| `TierSetCard` | 티어세트 정보 | `season`, `twoSet`, `fourSet` |
| `InfoBox` / `WarningBox` / `DangerBox` | 알림 박스 | `color`, children |

### 사용 예시

```jsx
import { 
  SkillIcon, 
  PriorityTable, 
  MechanicsSection 
} from './guide-modules/GuideContentComponents';

// 스킬 아이콘
<SkillIcon 
  icon="ability_demonhunter_eyebeam"
  name="안광"
  description="전방에 혼돈의 광선을 발사"
  cooldown="30초"
/>

// 우선순위 테이블
<PriorityTable 
  priorities={[
    { priority: 1, skillName: "안광", icon: "ability_demonhunter_eyebeam", condition: "쿨다운 시" }
  ]}
  classColor="#A330C9"
/>
```

---

## 📐 JSON 스키마

### guideSchema.js 주요 함수

```javascript
import { 
  validateGuide,      // 가이드 JSON 검증
  getIconForSkill,    // 스킬명 → 아이콘 자동 매핑
  getClassColor,      // 직업명 → 색상
  createGuideTemplate // 빈 템플릿 생성
} from './guide-modules/guideSchema';

// 검증
const result = validateGuide(myGuideData);
if (!result.valid) {
  console.error(result.errors);
}

// 아이콘 자동 매핑
const icon = getIconForSkill('안광'); // → "ability_demonhunter_eyebeam"

// 템플릿 생성
const template = createGuideTemplate('warrior', '전사', 'fury', '분노');
```

---

## 🎨 스타일 커스터마이징

### 직업 색상

```javascript
// guideSchema.js
export const CLASS_COLORS = {
  warrior: '#C79C6E',
  demonhunter: '#A330C9',
  // ...
};
```

### 영웅 특성 색상

JSON에서 각 영웅 특성별로 `color` 지정:

```json
"heroTalents": {
  "aldrachiReaver": {
    "color": "#8B0000"
  },
  "felScarred": {
    "color": "#9400D3"
  }
}
```

---

## 📊 효과

| 지표 | 기존 | 모듈화 후 | 개선율 |
|------|------|----------|--------|
| 새 가이드 코드량 | 3,500줄 | **3줄** | 99.9% ↓ |
| JSON 작성 시간 | - | ~30분 | - |
| 컴포넌트 중복 | 12개 파일 | 1개 모듈 | 92% ↓ |
| 스타일 일관성 | 가이드마다 다름 | 100% 동일 | ✅ |

---

## 📁 완성된 파일 목록

```
src/
├── components/
│   └── guide-modules/
│       ├── GuideStyledComponents.js   # 레이아웃
│       ├── GuideHooks.js              # Hooks
│       ├── GuideContentComponents.js  # 콘텐츠 ⭐
│       ├── guideSchema.js             # 스키마 ⭐
│       ├── UniversalGuideRenderer.js  # 렌더러 ⭐
│       └── README.md                  # 이 문서
├── data/
│   └── guides/
│       ├── demonhunter.json           # 악마사냥꾼
│       ├── warrior.json               # 전사
│       └── ...                        # 추가 직업
└── pages/
    ├── HavocDemonHunterGuide.js       # 3줄!
    └── FuryWarriorGuide.js            # 3줄!
```

---

## ✅ 체크리스트: 새 가이드 추가

1. [ ] `src/data/guides/{class}.json` 생성
2. [ ] JSON 스키마에 맞게 데이터 작성
3. [ ] `src/pages/{Spec}Guide.js` 생성 (3줄)
4. [ ] `App.js`에 라우트 추가
5. [ ] `GuidePage.js`에서 `ready: true` 설정
