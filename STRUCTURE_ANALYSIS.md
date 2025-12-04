# FuryWarriorGuide.js 구조 분석 (4,065줄)

## 📊 섹션별 분류

### 🎨 Section 1: Setup & Styles (Line 1-280)
**용도**: 기본 설정 및 스타일 정의
**템플릿 처리**: 대부분 유지, 일부 props화

| 라인 범위 | 내용 | 템플릿 처리 |
|----------|------|------------|
| 1-15 | Imports | ✅ 유지 |
| 17-39 | unifiedTheme (색상 데이터) | ❌ **데이터 → props로** |
| 42-254 | Styled Components | ✅ 유지 (일부 색상 props화) |
| 255-277 | GlobalStyle | ✅ 유지 |

---

### 📦 Section 2: 데이터 함수 (Line 281-817)
**용도**: 영웅 특성별 콘텐츠 정의
**템플릿 처리**: **전체 config 파일로 추출**

| 라인 범위 | 내용 | 템플릿 처리 |
|----------|------|------------|
| 281-817 | getHeroContent(SkillIcon) | ❌ **전체 config로 추출** |
| └ 282-560 | slayer (학살자) 데이터 | ❌ config.heroContent.hero1 |
| └ 561-817 | mountainThane (산왕) 데이터 | ❌ config.heroContent.hero2 |

**구조**:
```javascript
{
  slayer: {
    name: '학살자',
    icon: '⚔️',
    tierSet: { 2set, 4set },
    singleTarget: { opener: [], priority: [] },
    aoe: { opener: [], priority: [] },
    mechanics: []
  },
  mountainThane: { ... }
}
```

---

### 🎯 Section 3: SkillIcon 컴포넌트 (Line 819-1109)
**용도**: 재사용 가능한 스킬 아이콘 UI 컴포넌트
**템플릿 처리**: ✅ **완전히 유지** (범용 컴포넌트)

| 라인 범위 | 내용 | 템플릿 처리 |
|----------|------|------------|
| 819-1109 | SkillIconComponent | ✅ 유지 (props 기반) |

---

### 🏗️ Section 4: 메인 컴포넌트 (Line 1110-4065)
**용도**: 가이드 페이지 렌더링 로직
**템플릿 처리**: UI 로직 유지, 데이터만 추출

| 라인 범위 | 내용 | 템플릿 처리 |
|----------|------|------------|
| 1110 | 컴포넌트 시작 | ✅ props 추가 |
| 1111-1484 | State, Refs, Effects | ✅ 유지 |
| 1485-2877 | renderRotation() | ✅ 유지 (props 사용) |
| 2879-2920 | talentBuilds | ❌ **config로 추출** |
| 2928-3148 | renderBuilds() | ✅ 유지 (props 사용) |
| 3150-3402 | renderStats() | ✅ 유지 (props 사용) |
| 3417-3469 | statPriorities | ❌ **config로 추출** |
| 3470-4065 | 나머지 렌더링 로직 | ✅ 유지 |
| 4066 | export | ✅ 유지 |

---

## 🔍 데이터 추출 대상 (config 파일로)

### 1. classConfig (새로 생성)
```javascript
{
  className: 'WARRIOR',
  spec: 'fury',
  heroTalents: ['학살자', '산왕'],
  heroKeys: ['slayer', 'mountainThane']  // 키 매핑
}
```

### 2. themeColors (Line 17-39에서 추출)
```javascript
{
  primary: '#C69B6D',
  primaryRgb: '199, 156, 110',
  // ... 나머지 색상
}
```
→ **템플릿에서는 getClassColors(className)로 자동 생성**

### 3. heroContent (Line 281-817에서 추출)
```javascript
{
  slayer: { name, icon, tierSet, singleTarget, aoe, mechanics },
  mountainThane: { ... }
}
```

### 4. builds (Line 2879-2920에서 추출)
```javascript
{
  slayer: {
    'raid-single': { name, description, code, icon },
    'raid-aoe': { ... },
    'mythic-plus': { ... }
  },
  mountainThane: { ... }
}
```

### 5. stats (Line 3417-3469에서 추출)
```javascript
{
  slayer: {
    single: ['crit', 'haste', 'mastery', 'versatility'],
    aoe: [...]
  },
  mountainThane: { ... }
}
```

---

## 📋 템플릿화 전략

### ✅ 유지할 것 (템플릿)
- Styled Components (색상만 props화)
- SkillIcon 컴포넌트 (완전 재사용)
- 렌더링 함수 (renderRotation, renderBuilds, renderStats)
- State 관리 로직
- 이벤트 핸들러

### ❌ 추출할 것 (config)
- unifiedTheme.colors
- getHeroContent 전체
- talentBuilds 객체
- statPriorities 객체
- 스킬 데이터 import

### 🔄 변환할 것
```javascript
// BEFORE
const unifiedTheme = { colors: { primary: '#C69B6D' } };
const heroContent = getHeroContent(SkillIcon);

// AFTER (템플릿)
function GuideTemplate({ classConfig, heroContent, builds, stats }) {
  const colors = getClassColors(classConfig.className);
  const theme = { colors, ... };
  // ...
}
```

---

## 📊 최종 파일 구조 예상

### GuideTemplate.js (~1,500줄)
- Styled Components
- SkillIcon 컴포넌트
- 렌더링 로직
- Props 기반 동적 처리

### configs/furyWarriorConfig.js (~500줄)
- classConfig
- heroContent (from getHeroContent)
- builds (from talentBuilds)
- stats (from statPriorities)
- skillData import

### utils/classColorMapper.js (~50줄)
- CLASS_COLORS 상수
- getClassColors 함수

### FuryWarriorGuide.js (최종 ~10줄)
```javascript
import GuideTemplate from './GuideTemplate';
import config from '../configs/furyWarriorConfig';

export default () => <GuideTemplate {...config} />;
```

---

## ✅ Task 1 완료 체크리스트

- [x] 전체 4,065줄 구조 분석
- [x] 섹션별 분류 (4개 섹션)
- [x] 데이터 레이어 식별 (5개 객체)
- [x] UI 레이어 식별 (렌더링 함수)
- [x] 추출 대상 명확화
- [x] 템플릿화 전략 수립
- [x] 문서화 완료

**다음 단계**: Task 2 - 데이터 레이어와 UI 레이어 경계 상세 파악
