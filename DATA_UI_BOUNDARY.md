# 데이터 레이어 vs UI 레이어 경계 문서

## 🎯 분류 기준

### ✅ 데이터 레이어 (Config 파일로 추출)
**정의**: 직업/전문화에 따라 달라지는 **내용 (Content)**

### ✅ UI 레이어 (Template 유지)
**정의**: 모든 가이드에서 동일한 **구조 (Structure)**

---

## 📦 데이터 레이어 추출 대상

### 1. 색상 데이터 (Line 17-39)
**현재**: unifiedTheme 객체에 하드코딩
```javascript
const unifiedTheme = {
  colors: {
    primary: '#C69B6D',      // ❌ 하드코딩
    accent: '#C69B6D',       // ❌ 하드코딩
    hover: 'rgba(198, 155, 109, 0.1)',  // ❌ 하드코딩
  }
};
```

**변환 후**: props로 전달
```javascript
function GuideTemplate({ classConfig, ... }) {
  const colors = getClassColors(classConfig.className);  // ✅ 자동 생성
  const theme = { colors, ...unifiedTheme };
  // ...
}
```

**추출 데이터**:
- `className: 'WARRIOR'` → 자동으로 `#C69B6D` 매핑
- RGB 값도 자동 계산

---

### 2. 영웅 특성 콘텐츠 (Line 281-817)
**현재**: getHeroContent 함수
```javascript
const getHeroContent = (SkillIcon) => ({
  slayer: {  // ❌ 전사 전용 데이터
    name: '학살자',
    icon: '⚔️',
    tierSet: { '2set': '...', '4set': '...' },
    singleTarget: { opener: [...], priority: [...] },
    aoe: { opener: [...], priority: [...] },
    mechanics: [...]
  },
  mountainThane: { ... }
});
```

**변환 후**: config 파일에서 전달
```javascript
// furyWarriorConfig.js
export default {
  heroContent: {
    hero1: {  // slayer → hero1로 키 변경
      name: '학살자',
      icon: '⚔️',
      tierSet: { twoSet: '...', fourSet: '...' },
      singleTarget: { opener: [...], priority: [...] },
      aoe: { opener: [...], priority: [...] },
      mechanics: [...]
    },
    hero2: { ... }  // mountainThane → hero2
  }
};
```

**데이터 구조**:
```typescript
interface HeroContent {
  name: string;
  icon: string;
  tierSet: {
    twoSet: string;
    fourSet: string;
  };
  singleTarget: {
    opener: Skill[];
    priority: Priority[];
  };
  aoe: {
    opener: Skill[];
    priority: Priority[];
  };
  mechanics: Mechanic[];
}

interface Priority {
  skill: Skill;
  desc: string;
  conditions: string[];
  why: string;
}

interface Mechanic {
  title: string;
  icon: string;
  desc: string;
  details: string[];
  why: string;
}
```

---

### 3. 특성 빌드 (Line 2879-2920)
**현재**: talentBuilds 객체
```javascript
const talentBuilds = {
  slayer: {  // ❌ 전사 전용
    'raid-single': {
      name: '레이드 단일 대상',
      description: '학살자를 활용한 단일 대상 빌드입니다...',
      code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJ...',
      icon: '⚔️'
    },
    // ...
  },
  mountainThane: { ... }
};
```

**변환 후**: config 파일
```javascript
builds: {
  hero1: {
    'raid-single': { name, description, code, icon },
    'raid-aoe': { ... },
    'mythic-plus': { ... }
  },
  hero2: { ... }
}
```

---

### 4. 스탯 우선순위 (Line 3417-3469)
**현재**: statPriorities 객체
```javascript
const statPriorities = {
  slayer: {  // ❌ 전사 전용
    single: ['crit', 'haste', 'mastery', 'versatility'],
    aoe: ['haste', 'crit', 'mastery', 'versatility']
  },
  mountainThane: { ... }
};
```

**변환 후**: config 파일
```javascript
stats: {
  hero1: {
    single: ['crit', 'haste', 'mastery', 'versatility'],
    aoe: [...]
  },
  hero2: { ... }
}
```

---

### 5. 스킬 데이터 Import (Line 6)
**현재**:
```javascript
import { furyWarriorSkills as skillData } from '../data/furyWarriorSkillData';  // ❌ 전사 전용
```

**변환 후**: config 파일에서 처리
```javascript
// furyWarriorConfig.js
import { furyWarriorSkills } from '../data/furyWarriorSkillData';

export default {
  skillData: furyWarriorSkills,  // ✅ config에서 전달
  // ...
};
```

---

## 🎨 UI 레이어 유지 대상

### 1. Styled Components (Line 42-254)
**유지하되 색상만 props로 변경**

**변경 전**:
```javascript
const HeroCard = styled(Card)`
  background: ${props => {
    if (props.heroType === 'slayer') {
      return 'rgba(198, 155, 109, 0.05)';  // ❌ 하드코딩
    }
    return 'rgba(199, 156, 110, 0.05)';    // ❌ 하드코딩
  }};
`;
```

**변경 후**:
```javascript
const HeroCard = styled(Card)`
  background: ${props => {
    if (props.heroType === 'hero1') {
      return `rgba(${props.theme.colors.primaryRgb}, 0.05)`;  // ✅ props 사용
    }
    return `rgba(${props.theme.colors.secondaryRgb}, 0.05)`; // ✅ props 사용
  }};
`;
```

**변경 대상 (30곳)**:
- Line 219: `rgba(198, 155, 109, 0.05)` → `rgba(${theme.colors.primaryRgb}, 0.05)`
- Line 227: `rgba(198, 155, 109, 0.3)` → `rgba(${theme.colors.primaryRgb}, 0.3)`
- Line 245: `#C69B6D` → `${theme.colors.primary}`
- Line 247: `#C79C6E` → `${theme.colors.secondary}`
- ... 기타 26곳

---

### 2. SkillIcon 컴포넌트 (Line 819-1109)
**완전히 유지** - 이미 props 기반

---

### 3. 렌더링 함수들
**유지하되 데이터 소스를 props로 변경**

#### renderRotation (Line 1485-2877)
**변경 전**:
```javascript
const renderRotation = () => {
  const currentContent = heroContent[selectedTier];  // ❌ 로컬 변수
  // ...
}
```

**변경 후**:
```javascript
// GuideTemplate.js
function GuideTemplate({ heroContent, ... }) {
  const renderRotation = () => {
    const currentContent = heroContent[selectedHero];  // ✅ props 사용
    // ...
  }
}
```

#### renderBuilds (Line 2928-3148)
**변경 전**:
```javascript
const renderBuilds = () => {
  const builds = talentBuilds[selectedBuildHero];  // ❌ 로컬 변수
  // ...
}
```

**변경 후**:
```javascript
function GuideTemplate({ builds, ... }) {
  const renderBuilds = () => {
    const heroBuilds = builds[selectedBuildHero];  // ✅ props 사용
    // ...
  }
}
```

#### renderStats (Line 3150-3402)
**변경 전**:
```javascript
const renderStats = () => {
  const priorities = statPriorities[selectedStatHero];  // ❌ 로컬 변수
  // ...
}
```

**변경 후**:
```javascript
function GuideTemplate({ stats, ... }) {
  const renderStats = () => {
    const priorities = stats[selectedStatHero];  // ✅ props 사용
    // ...
  }
}
```

---

### 4. State 관리 (Line 1111-1484)
**완전히 유지** - 모든 가이드에서 동일한 로직
```javascript
const [selectedTier, setSelectedTier] = useState('hero1');  // ✅ 범용화
const [selectedBuildHero, setSelectedBuildHero] = useState('hero1');
const [selectedStatHero, setSelectedStatHero] = useState('hero1');
// ...
```

**변경 사항**:
- `'slayer'` → `'hero1'`
- `'mountainThane'` → `'hero2'`

---

## 🔄 Props 인터페이스 설계

### GuideTemplate Props
```typescript
interface GuideTemplateProps {
  // 직업 설정
  classConfig: {
    className: 'WARRIOR' | 'MAGE' | ... ;
    spec: string;
    heroTalents: [string, string];  // 영웅 특성 이름
  };

  // 스킬 데이터
  skillData: {
    [key: string]: Skill;
  };

  // 영웅 특성 콘텐츠
  heroContent: {
    hero1: HeroContent;
    hero2: HeroContent;
  };

  // 특성 빌드
  builds: {
    hero1: {
      'raid-single': Build;
      'raid-aoe': Build;
      'mythic-plus': Build;
    };
    hero2: { ... };
  };

  // 스탯 우선순위
  stats: {
    hero1: {
      single: StatName[];
      aoe: StatName[];
    };
    hero2: { ... };
  };
}
```

---

## 📊 변환 매트릭스

| 원본 | 데이터/UI | 변환 방법 |
|------|----------|----------|
| `unifiedTheme.colors` | 데이터 | `getClassColors(className)` 자동 생성 |
| `getHeroContent()` | 데이터 | `config.heroContent` props 전달 |
| `talentBuilds` | 데이터 | `config.builds` props 전달 |
| `statPriorities` | 데이터 | `config.stats` props 전달 |
| `skillData` import | 데이터 | `config.skillData` props 전달 |
| Styled Components | UI | 색상만 props화, 구조 유지 |
| SkillIcon | UI | 완전 유지 |
| renderRotation | UI | props 사용하도록 수정 |
| renderBuilds | UI | props 사용하도록 수정 |
| renderStats | UI | props 사용하도록 수정 |
| State 관리 | UI | `slayer/mountainThane` → `hero1/hero2` |

---

## ✅ Task 2 완료 체크리스트

- [x] 데이터 레이어 식별 (5개 객체)
- [x] UI 레이어 식별 (Styled Components + 렌더링 함수)
- [x] 색상 하드코딩 30곳 위치 파악
- [x] Props 인터페이스 설계
- [x] 변환 전략 수립
- [x] 영웅 특성 키 변경 계획 (slayer/mountainThane → hero1/hero2)
- [x] 문서화 완료

**다음 단계**: Task 3 - 전사 전용 데이터 추출
