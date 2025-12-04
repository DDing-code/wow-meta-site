# GuideTemplate 사용 가이드

WoW 전문화 가이드를 **데이터 오염 없이** 빠르게 생성하는 방법입니다.

---

## 🚀 빠른 시작 (3단계)

### 1단계: Config 파일 복사
```bash
# furyWarriorConfig.js를 새 전문화로 복사
cp src/configs/furyWarriorConfig.js src/configs/arcaneMageConfig.js
```

### 2단계: Config 파일 수정
```javascript
// src/configs/arcaneMageConfig.js

// 1. 직업 정보 변경
export const classConfig = {
  className: 'MAGE',  // ← 'WARRIOR' → 'MAGE'
  spec: 'arcane',     // ← 'fury' → 'arcane'
  heroTalents: ['성난태양', '주문술사'],  // ← 실제 영웅 특성
  // ...
};

// 2. 스킬 데이터 import 변경
import { arcaneMageSkills } from '../data/arcaneMageSkillData';

export const classConfig = { ... };
export const heroContent = {
  hero1: {
    name: '성난태양',  // ← '학살자' 제거
    // ... 실제 마법사 데이터
  }
};
// ... builds, stats도 수정
```

### 3단계: 래퍼 생성
```javascript
// src/components/ArcaneMageGuide.js
import React from 'react';
import GuideTemplate from './GuideTemplate';
import arcaneMageConfig from '../configs/arcaneMageConfig';

const ArcaneMageGuide = () => {
  return <GuideTemplate {...arcaneMageConfig} />;
};

export default ArcaneMageGuide;
```

✅ **완료!** 이제 `npm run build` 실행

---

## ⚠️ 자주 하는 실수 Top 16

### 🔴 Critical (치명적 실수)

#### 1. **전사 데이터 오염** (ArcaneMageGuide.js 사례)
**문제**: slayer/mountainThane/bloodthirst 키워드가 남아있음
```javascript
// ❌ 잘못된 예시 (861줄 전사 데이터 남음)
const heroContent = {
  slayer: {  // ← 전사 키워드!
    singleTarget: {
      priority: [
        { skill: skillData.bloodthirst, ... }  // ← 전사 스킬!
      ]
    }
  }
}
```

**해결책**:
```javascript
// ✅ 올바른 예시
const heroContent = {
  hero1: {  // ← 범용 키워드
    name: '성난태양',  // ← 마법사 영웅 특성
    singleTarget: {
      priority: [
        { skill: skillData.arcaneBlast, ... }  // ← 마법사 스킬
      ]
    }
  }
}
```

**검증 명령어**:
```bash
grep -r "slayer\|mountainThane\|bloodthirst\|rampage" src/configs/arcaneMageConfig.js
# → 0개 결과여야 함
```

---

#### 2. **색상 하드코딩** (30곳)
**문제**: `#C69B6D` 전사 색상이 그대로 남아있음
```javascript
// ❌ 잘못된 예시
const theme = {
  primary: '#C69B6D',  // ← 전사 색상 하드코딩
  hover: 'rgba(198, 155, 109, 0.1)'
};
```

**해결책**:
```javascript
// ✅ 올바른 예시 (GuideTemplate이 자동 처리)
import getClassColors from '../utils/classColorMapper';

const classColors = getClassColors(classConfig.className);
// MAGE → #3FC6EA (마법사 색상 자동 생성)
```

**검증 명령어**:
```bash
grep "#C69B6D\|198, 155, 109" src/configs/arcaneMageConfig.js
# → 0개 결과여야 함
```

---

#### 3. **아이콘 임의 선택** ⭐
**문제**: 예쁜 아이콘을 임의로 선택
```javascript
// ❌ 잘못된 예시
icon: 'spell_fire_flamebolt'  // ← 임의 선택
```

**해결책**:
1. ko.wowhead.com/spell=[스킬ID] 접속
2. 페이지 소스에서 실제 아이콘 확인:
```javascript
const iconElement = document.querySelector('[class*="iconsmall"]');
const iconUrl = iconElement?.src;
// https://wow.zamimg.com/images/wow/icons/small/spell_arcane_blast.jpg
// → icon: "spell_arcane_blast"
```

**올바른 방법**:
```javascript
// ✅ Wowhead 확인 후
icon: 'spell_arcane_blast'  // ← 실제 게임 아이콘
```

---

#### 4. **임의 번역** ⭐
**문제**: 영어를 직역하거나 추측으로 번역
```javascript
// ❌ 잘못된 예시
koreanName: "가시 사격"  // Barbed Shot 직역
koreanName: "펫 광분"    // 임의로 "펫" 추가
```

**해결책 (우선순위)**:
1. **최우선**: `database-builder/tww-s3-complete-database-enhanced.json` 확인
2. **차선**: ko.wowhead.com/spell=[ID] 공식 번역 확인
3. **절대 금지**: 영어 직역, 추측, 임의 생성

```javascript
// ✅ 올바른 예시
koreanName: "날카로운 사격"  // ko.wowhead.com 확인
koreanName: "광기"          // 내부 DB 확인
```

**검증 명령어**:
```bash
# 임의 번역 의심 단어 확인
grep -i "barbed\|pet \|frenzy" src/configs/arcaneMageConfig.js
# → 영어 단어 있으면 재확인
```

---

### 🟡 Major (주요 실수)

#### 5. **특성 및 스킬에 툴팁 안 적음** ⭐
**문제**: 일반 텍스트로만 스킬명 표시
```javascript
// ❌ 잘못된 예시
<p>비전 작렬을 시전합니다.</p>
```

**해결책**: 모든 스킬/특성에 SkillIcon 필수
```javascript
// ✅ 올바른 예시
<p>
  <SkillIcon skill={skillData.arcaneBlast} textOnly /> 을 시전합니다.
</p>

// textOnly: 아이콘 + 텍스트 형태
// textOnly 없음: 아이콘만
```

**구현 위치**: heroContent의 desc, conditions, why 모든 텍스트

---

#### 6. **임의 데이터 및 오래된 가이드 견본 사용** ⭐
**문제**: Icy-veins, 11.0 패치 가이드 참조
```javascript
// ❌ 잘못된 예시
출처: Icy-veins (2024.08 작성)
출처: Wowhead 11.0 패치
```

**해결책**: **TWW 시즌3 (11.2 패치) Maxroll 공략만 사용**
```javascript
// ✅ 올바른 예시
출처: Maxroll.gg (2025.01 작성, TWW S3)
URL: https://maxroll.gg/wow/class-guides/arcane-mage-guide
```

**검증 체크리스트**:
- [ ] Maxroll.gg 공략인가?
- [ ] TWW 시즌3 (11.2 패치) 기준인가?
- [ ] 작성일이 2025년 1월 이후인가?

---

#### 7. **가이드 완료 후 홈페이지 업데이트 누락** ⭐
**문제**: 가이드 작성 후 `/guide` 페이지에 안 보임

**해결책**:
```javascript
// src/data/guideLinks.js
export const guideLinks = {
  mage: {
    arcane: {
      available: true,  // ← false → true 변경
      path: '/guide/mage/arcane',
      wowhead: {
        ko: 'https://ko.wowhead.com/guide/classes/mage/arcane/overview-pve-dps',
        en: 'https://www.wowhead.com/guide/classes/mage/arcane/overview-pve-dps'
      },
      maxroll: 'https://maxroll.gg/wow/class-guides/arcane-mage-guide'
    }
  }
};
```

**검증**: `http://localhost:3002/guide` 접속 → 비전 마법사 링크 확인

---

#### 8. **통합 DB 동기화 누락** ⭐
**문제**: 가이드 제작용 스킬 데이터가 중앙 DB에 없음

**해결책**:
```javascript
// src/data/twwS3FinalCleanedDatabase.js
export const twwS3SkillDatabase = {
  mage: {
    ...existingSkills,
    // arcaneMageConfig에서 사용한 모든 스킬 추가
    44425: {
      id: 44425,
      koreanName: "비전 작렬",
      englishName: "Arcane Blast",
      icon: "spell_arcane_blast",
      description: "적에게 비전 피해를 입힙니다.",
      cooldown: "없음",
      castTime: "2.25초",
      range: "40 야드",
      resourceCost: "마나 2.5%",
      resourceGain: "비전 충전물 1",
      type: "기본",
      spec: "비전",
      level: 1,
      pvp: false
    },
    // ... 나머지 스킬
  }
};
```

**검증**: 스킬 검색 페이지에서 "비전 작렬" 검색 → 결과 나와야 함

---

#### 9. **furyWarriorSkills import 미변경**
**문제**: 다른 직업인데 `furyWarriorSkills` import
```javascript
// ❌ 잘못된 예시
import { furyWarriorSkills as skillData } from '../data/furyWarriorSkillData';
```

**해결책**:
```javascript
// ✅ 올바른 예시
import { arcaneMageSkills } from '../data/arcaneMageSkillData';

export default {
  skillData: arcaneMageSkills,  // ← 변수명도 변경
  // ...
};
```

---

#### 10. **tierSet 키 오류**
**문제**: `'2set'/'4set'` (구버전 키)
```javascript
// ❌ 잘못된 예시 (FuryWarriorGuide.js 구버전)
tierSet: {
  '2set': '...',
  '4set': '...'
}
```

**해결책**: `twoSet/fourSet` (표준 스키마)
```javascript
// ✅ 올바른 예시 (configSchema.js 표준)
tierSet: {
  twoSet: '2세트: 비전 작렬 피해 20% 증가',
  fourSet: '4세트: 비전 쇄도 재사용 대기시간 30% 감소'
}
```

---

### 🟢 Minor (경미한 실수)

#### 11. **className 대소문자**
```javascript
// ❌ 잘못된 예시
className: 'warrior'  // 소문자

// ✅ 올바른 예시
className: 'WARRIOR'  // 대문자 필수
```

#### 12. **priority 필드 누락**
```javascript
// ❌ 누락
{
  skill: skillData.rampage,
  desc: '격노 유지',
  conditions: ['...']
  // priority 없음
}

// ✅ 포함
{
  skill: skillData.rampage,
  desc: '격노 유지',
  conditions: ['...'],
  priority: 0  // ← 필수! (0이 최우선)
}
```

#### 13. **hero 키 혼동**
```javascript
// ❌ 잘못된 예시
selectedTier: 'slayer'  // ← 전사 전용 키

// ✅ 올바른 예시
selectedTier: 'hero1'  // ← 범용 키
```

#### 14. **가이드 제목 미변경**
```javascript
// ❌ 잘못된 예시
<h1>분노 전사 가이드</h1>  // 복사 후 미변경

// ✅ 올바른 예시
<h1>비전 마법사 가이드</h1>
```

#### 15. **빌드 코드 복사 오류**
```javascript
// ❌ 전사 빌드 코드 그대로 사용
code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJJ...'

// ✅ Wowhead에서 새로 추출
// 1. ko.wowhead.com/talent-calc/mage/arcane 접속
// 2. 특성 선택 후 "내보내기" → "문자열 복사"
code: '[실제 비전 마법사 빌드 코드]'
```

#### 16. **스킬 데이터 필드 누락**
```javascript
// ❌ 필수 필드 누락
{
  id: 44425,
  koreanName: "비전 작렬"
  // description, cooldown 등 누락
}

// ✅ 모든 필드 작성 (configSchema.js 참고)
{
  id: 44425,
  koreanName: "비전 작렬",
  englishName: "Arcane Blast",
  icon: "spell_arcane_blast",
  description: "적에게 비전 피해를 입힙니다.",
  cooldown: "없음",
  castTime: "2.25초",
  range: "40 야드",
  resourceCost: "마나 2.5%",
  resourceGain: "비전 충전물 1",
  type: "기본",
  spec: "비전",
  level: 1,
  pvp: false
}
```

---

## ✅ 완료 후 필수 작업 (6단계)

### 1단계: 코드 검증
```bash
# 전사 키워드 제거 확인
grep -r "slayer\|mountainThane\|bloodthirst\|rampage" src/configs/arcaneMageConfig.js
# → 0개 결과

# 색상 하드코딩 확인
grep "#C69B6D\|198, 155, 109" src/configs/arcaneMageConfig.js
# → 0개 결과

# 임의 번역 의심 단어 확인
grep -i "barbed\|frenzy\|pet " src/configs/arcaneMageConfig.js
# → 영어 단어 있으면 재확인

# furyWarrior 참조 확인
grep "furyWarrior" src/configs/arcaneMageConfig.js
# → 0개 결과
```

### 2단계: 데이터 검증
```bash
# 아이콘 파일 존재 확인
node database-builder/verify-icons.js arcaneMageConfig

# 번역 일치 확인 (내부 DB vs config)
node database-builder/verify-translations.js arcaneMageConfig
```

### 3단계: 통합 DB 업데이트 ⭐
```javascript
// src/data/twwS3FinalCleanedDatabase.js
export const twwS3SkillDatabase = {
  mage: {
    ...existingSkills,
    // arcaneMageConfig에서 사용한 모든 스킬 추가
    44425: { /* 비전 작렬 */ },
    365350: { /* 비전 쇄도 */ },
    116011: { /* 룬 오브 파워 */ },
    // ... 나머지 스킬
  }
};
```

**검증**: 스킬 검색 페이지에서 가이드에 사용한 스킬 검색

### 4단계: 가이드 링크 등록 ⭐
```javascript
// src/data/guideLinks.js
export const guideLinks = {
  mage: {
    arcane: {
      available: true,  // ← false → true 변경
      path: '/guide/mage/arcane',
      wowhead: {
        ko: 'https://ko.wowhead.com/guide/classes/mage/arcane/overview-pve-dps',
        en: 'https://www.wowhead.com/guide/classes/mage/arcane/overview-pve-dps'
      },
      maxroll: 'https://maxroll.gg/wow/class-guides/arcane-mage-guide',
      icyVeins: 'https://www.icy-veins.com/wow/arcane-mage-pve-dps-guide'
    }
  }
};
```

### 5단계: 빌드 테스트
```bash
cd wow-meta-site
npm run build
# → "Compiled successfully" 확인
```

### 6단계: 홈페이지 확인
```bash
# 개발 서버 실행
npm start

# 브라우저에서 확인
http://localhost:3002/guide
# → 비전 마법사 링크 확인

http://localhost:3002/guide/mage/arcane
# → 가이드 정상 렌더링 확인
```

---

## 📊 데이터 오염 체크리스트

### Config 파일 크기
- [ ] 400-600줄 (±50줄)
- [ ] 1,000줄 이상이면 전사 데이터 오염 의심

### hero1/hero2 키 사용
- [ ] slayer/mountainThane 없음
- [ ] hero1/hero2로 범용화

### className 대문자
- [ ] 'WARRIOR' → 'MAGE'
- [ ] 'HUNTER' → 'PRIEST'

### 스킬 데이터 일치
- [ ] 마법사면 fireball, arcaneBlast 등
- [ ] 전사 스킬 (bloodthirst, rampage) 없음

### 색상 자동 배정
- [ ] `#C69B6D` (전사 색상) 없음
- [ ] classColorMapper.js 사용

### 툴팁 구현
- [ ] 모든 스킬에 `<SkillIcon textOnly />` 사용
- [ ] 일반 텍스트 스킬명 없음

---

## 📖 예제: 비전 마법사 가이드 생성

### 1. Config 파일 생성
```bash
cp src/configs/furyWarriorConfig.js src/configs/arcaneMageConfig.js
```

### 2. Config 파일 수정
```javascript
// src/configs/arcaneMageConfig.js
import { arcaneMageSkills } from '../data/arcaneMageSkillData';

export const classConfig = {
  className: 'MAGE',
  spec: 'arcane',
  heroTalents: ['성난태양', '주문술사'],
  heroMapping: {
    hero1: 'sunfury',
    hero2: 'spellslinger'
  }
};

export const heroContent = {
  hero1: {
    name: '성난태양',
    icon: '☀️',
    tierSet: {
      twoSet: '2세트: 비전 작렬 피해 20% 증가',
      fourSet: '4세트: 비전 쇄도 재사용 대기시간 30% 감소'
    },
    singleTarget: {
      opener: [
        arcaneMageSkills.arcaneBlast,
        arcaneMageSkills.arcaneSurge,
        arcaneMageSkills.touchOfTheMagi,
        // ...
      ],
      priority: [
        {
          skill: arcaneMageSkills.arcaneBlast,
          desc: '비전 충전물 관리',
          conditions: [
            '비전 충전물 4개 미만',
            '마나 70% 이상'
          ],
          priority: 0,
          why: '비전 충전물을 쌓아 비전 쇄도 피해 극대화'
        },
        // ...
      ]
    },
    aoe: {
      opener: [...],
      priority: [...]
    },
    mechanics: [
      {
        title: '비전 충전물 시스템',
        icon: '🔮',
        desc: '비전 작렬 시전 시 비전 충전물을 획득하며, 4중첩 시 비전 쇄도 피해가 극대화됩니다.',
        details: [
          '최대 4중첩',
          '비전 작렬 시전 시 1중첩 획득',
          '각 중첩당 비전 작렬 피해 15% 증가',
          '비전 쇄도 시전 시 모든 중첩 소모'
        ],
        why: '비전 마법사의 핵심 메커니즘'
      }
    ]
  },
  hero2: { /* 주문술사 */ }
};

export const builds = { /* ... */ };
export const stats = { /* ... */ };

export default {
  classConfig,
  skillData: arcaneMageSkills,
  heroContent,
  builds,
  stats
};
```

### 3. 래퍼 생성
```javascript
// src/components/ArcaneMageGuide.js
import React from 'react';
import GuideTemplate from './GuideTemplate';
import arcaneMageConfig from '../configs/arcaneMageConfig';

const ArcaneMageGuide = () => {
  return <GuideTemplate {...arcaneMageConfig} />;
};

export default ArcaneMageGuide;
```

### 4. 라우팅 추가
```javascript
// src/App.js
import ArcaneMageGuide from './components/ArcaneMageGuide';

<Route path="/guide/mage/arcane" element={<ArcaneMageGuide />} />
```

### 5. 완료 후 작업
```bash
# 1. 통합 DB 업데이트
vi src/data/twwS3FinalCleanedDatabase.js

# 2. 가이드 링크 등록
vi src/data/guideLinks.js

# 3. 빌드 테스트
npm run build

# 4. 개발 서버 확인
npm start
```

---

## 🎯 핵심 원칙

### 1. **절대 직접 복사 금지**
- ❌ FuryWarriorGuide.js 직접 복사
- ✅ furyWarriorConfig.js 복사 후 수정

### 2. **데이터 오염 방지**
- 전사 키워드 완전 제거
- hero1/hero2 범용 키 사용
- grep으로 검증

### 3. **공식 데이터 사용**
- TWW 시즌3 Maxroll 공략
- ko.wowhead.com 번역
- 내부 DB 우선 확인

### 4. **완료 후 필수 작업**
- 통합 DB 동기화
- 가이드 링크 등록
- 홈페이지 확인

---

## 📚 관련 파일

- **Template**: `src/components/GuideTemplate.js`
- **Config 예시**: `src/configs/furyWarriorConfig.js`
- **스키마**: `src/configs/configSchema.js`
- **색상 시스템**: `src/utils/classColorMapper.js`
- **통합 DB**: `src/data/twwS3FinalCleanedDatabase.js`
- **가이드 링크**: `src/data/guideLinks.js`

---

**마지막 업데이트**: 2025-01-05
**작성자**: WoWMeta 개발팀
