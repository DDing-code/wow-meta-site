# WoW 가이드 템플릿 사용 설명서 (AI 전용)

## 📌 문서 목적
이 매뉴얼은 **AI (Claude Code)**가 GuideTemplate.js를 사용하여 새로운 WoW 전문화 가이드를 작성할 때 **실수 없이 정확하게** 작업할 수 있도록 작성되었습니다.

## 🎯 전제 조건

### 필수 파일
- `src/components/GuideTemplate.js` (3,520줄 - 비전 마법사 기반, 2025-01-04 업데이트)
- `src/data/{spec}SkillData.js` (새로 작성할 전문화의 스킬 데이터)

### 템플릿 변경 히스토리

| 버전 | 기반 가이드 | 줄 수 | 주요 변경사항 | 날짜 |
|------|-----------|-------|-------------|------|
| **v2.0** | ArcaneMageGuide.js | 3,520줄 | • 한국어 조사 괄호 표기 시스템<br>• 토스트 알림 분리 (showToast/showCopyToast)<br>• SimC 탭 제거, Raidbots 통합<br>• 스탯 우선순위 단일 탭 구조 | 2025-01-04 |
| **v1.0** | FuryWarriorGuide.js | 4,023줄 | • 초기 템플릿 구조<br>• 영웅 특성 이중 탭 시스템<br>• 티어 세트/오프닝/우선순위 구조<br>• SimC 설정 탭 포함 | 2024-12-28 |

**주요 개선 사항 (v1.0 → v2.0)**:
- **-503줄 최적화**: 복잡한 브레이크포인트 계산, SimC 최적화 로직 제거
- **한국어 개선**: 조사 괄호 표기로 문법적 정확성 향상 (이(가), 을(를), 은(는), 과(와), 으로(로))
- **UX 개선**: 토스트 알림 충돌 해결, 복사/업데이트 독립 표시
- **구조 간소화**: SimC 탭 → Raidbots 링크 (사용자 친화적)

### 데이터 소스 우선순위

#### 우선순위 규칙
```
1순위: Maxroll (Playwright 전체 스크린샷)
  ↓ 플로우차트, 알고리즘 차트 추출
  ↓ 우선순위 리스트 시각화
  ↓ 타임라인/오프닝 시퀀스

2순위: Wowhead 한글 (WebFetch)
  ↓ 한글 번역 검증
  ↓ 스킬 설명

3순위: 내부 DB
  ↓ 스킬 데이터 보완
  ↓ tww-s3-refined-database.json

4순위: Icy-veins (참고용)
  ↓ 추가 정보 확인
```

#### 데이터 소스별 URL
- **Maxroll**: `https://maxroll.gg/wow/class-guides/{spec}-{content-type}-guide`
  - 예: `elemental-shaman-raid-guide`, `elemental-shaman-mythic-plus-guide`
- **Wowhead 한글**: `https://ko.wowhead.com/guide/classes/{class}/{spec}`
- **Wowhead 영문**: `https://wowhead.com/guide/classes/{class}/{spec}`
- **Icy-veins**: `https://icy-veins.com/wow/{spec}-guide`

#### Maxroll 우선 사용 이유
1. **풍부한 시각 자료**: 플로우차트, 알고리즘 차트, 타임라인 제공
2. **WebFetch 한계**: Maxroll은 동적 콘텐츠가 많아 fetch로 정보 추출 어려움
3. **해결책**: Playwright 전체 페이지 스크린샷 → 시각적 분석 → 데이터 구조화

### 절대 금지 사항
❌ 영어 직역 (예: "Barbed Shot" → "가시 사격" ❌, 정답: "날카로운 사격")
❌ 임의 번역 추측
❌ 스킬 설명 임의 작성
❌ 색상 코드 일부만 변경
❌ 키 이름 불일치 (slayer vs farseer 등)
❌ **괄호 안의 영어 표기** (예: "직관 (Intuition)" ❌, 정답: "직관")
❌ **`<Term>` 컴포넌트 직접 사용** (예: `<Term english="..." korean="..." />` ❌)

### 스킬/버프 자동 렌더링 시스템

**핵심 원칙**: 모든 실제 게임 요소(스킬, 특성, 버프, 메커니즘, 리소스)는 **반드시** skillData에 추가 후 자동 렌더링

**작동 방식**:
1. `{spec}SkillData.js`에 실제 게임 요소 데이터 추가
2. `skillNameMap`에 `'한글명': skillData.key` 매핑
3. `renderTextWithSkillIcons('텍스트')` 사용 → 자동으로 아이콘+툴팁 표시

**올바른 사용법**:

✅ **실제 게임 스킬/버프** (아이콘+툴팁 필요):
```javascript
// Step 1: arcaneMageSkillData.js에 추가
"spellfirespheres": {
  "id": 448604,
  "koreanName": "주문불꽃 구체",
  "englishName": "Spellfire Spheres",
  "icon": "spell_fire_flamebolt",
  "description": "성난태양 영웅 특성의 핵심 리소스입니다...",
  "type": "리소스",
  // ... 기타 필드
}

// Step 2: ArcaneMageGuide.js의 skillNameMap에 추가
'주문불꽃 구체': skillData.spellfirespheres

// Step 3: 텍스트에서 사용
renderTextWithSkillIcons('주문불꽃 구체 생성/소비')
// → 자동으로 아이콘+툴팁 표시됨
```

✅ **설명용 개념** (일반 텍스트):
```javascript
// GCD, DPS, 소진, 보존 등은 그냥 텍스트로
'전역 쿨다운 최적화'
'초당 피해량 극대화'
'소진 페이즈'
```

**절대 금지**:
```javascript
// ❌ <Term> 컴포넌트 직접 사용
<Term english="Spellfire Spheres" korean="주문불꽃 구체" />

// ❌ englishTermMap 사용
const englishTermMap = { '주문불꽃 구체': 'Spellfire Spheres' }

// ❌ EnglishTerm 컴포넌트 사용
<EnglishTerm korean="주문불꽃 구체" english="Spellfire Spheres" />
```

### 📝 실제 게임 요소 vs 설명용 개념 구분

**실제 게임 요소** (아이콘+툴팁 필요):
- **스킬**: 비전 작렬, 신비한 화살, 비전 탄막
- **특성**: 번뜩임, 황천의 정밀함, 비전의 영혼
- **버프/디버프**: 직관, 비전 조화, 비전의 박자
- **리소스**: 비전 충전물, 마나, 주문불꽃 구체
- **메커니즘**: 게임 내 실제로 존재하는 효과 (툴팁 있음)

**설명용 개념** (일반 텍스트):
- **게임 시스템**: GCD(전역 쿨다운), DPS(초당 피해량), 클리핑
- **플레이 스타일**: 소진, 보존, Split(분할 타격)
- **일반 용어**: 흔한 실수, 고급 팁, 위크오라, 오프닝, 우선순위

**판단 기준**:
1. ❓ **Wowhead에 독립 페이지가 있는가?** → ✅ 실제 게임 요소
2. ❓ **게임 내 툴팁이 존재하는가?** → ✅ 실제 게임 요소
3. ❓ **일반적인 게임 용어/개념인가?** → ✅ 설명용 개념

**예시**:
- "주문불꽃 구체" → Wowhead 페이지 있음 → **skillData 추가 필수**
- "소진 페이즈" → 플레이 스타일 개념 → **일반 텍스트**
- "전역 쿨다운(GCD)" → 게임 시스템 용어 → **일반 텍스트**

---

### 📝 한국어 조사 표기 규칙

**목적**: 스킬 이름 뒤 조사를 쓸 때 문법 오류를 방지하기 위해 두 가지 형태를 모두 표기

**표기 원칙**:
가이드 본문에서 스킬 이름 뒤에 조사를 사용할 때는 **받침 유무를 판단하기 어려운 경우** 두 가지 조사를 모두 괄호로 표기합니다.

**표기 형태**:
- **주격 조사**: `이(가)` - "~이", "~가"
- **목적격 조사**: `을(를)` - "~을", "~를"
- **보조사**: `은(는)` - "~은", "~는"

**표기 예시**:
```javascript
// 올바른 표기
'비전 작렬이(가) 메아리쳐 70% 피해 복제'
'번뜩임이(가) 없을 때 광역 피해 지속'
'비전 충전물을(를) 쌓고 소모하는 메커니즘'
'신비한 화살을(를) 끝까지 시전'
'비전 탄막은(는) 핵심 딜사이클'
'비전 작렬과(와) 비전 탄막의 피해 증가'
'신비한 화살로(으로) 중첩 유지'
'비전 탄막으로(로) 폭발적 피해'

// 잘못된 표기 (단일 조사)
'비전 작렬이 메아리쳐...'  // ❌
'번뜩임이 없을 때...'      // ❌
'비전 충전물을 쌓고...'    // ❌
'비전 작렬과 비전 탄막'    // ❌
'신비한 화살로 중첩 유지'  // ❌
```

**가이드 작성 가이드**:
1. 스킬 이름 뒤에 조사가 필요한 경우 "이(가)", "을(를)", "은(는)" 형태 사용
2. 받침 판별이 명확한 경우에도 일관성을 위해 두 형태 모두 표기 권장
3. `renderTextWithSkillIcons()` 함수 내부 텍스트에도 동일하게 적용

**적용 위치**:
- `why` 필드의 설명 문구
- 본문 `<p>` 태그 내 설명
- 프로 팁, 주의사항 등 모든 스킬 관련 설명
- `renderTextWithSkillIcons()` 함수 인자 문자열

---

## 📸 Maxroll 시각 자료 추출 (v2.0 신규)

### 배경
Maxroll은 **플로우차트, 알고리즘 차트, 타임라인** 등 풍부한 시각 자료를 제공하지만, 동적 콘텐츠가 많아 WebFetch로는 정보 추출이 어렵습니다.

**해결책**: Playwright로 전체 페이지 스크린샷 → 시각적 분석 → 데이터 구조화

### Phase 1: Playwright 스크린샷 수집

#### 1-1. 스크립트 생성
```javascript
// database-builder/capture-maxroll-{spec}.js
const { chromium } = require('playwright');

async function captureMaxrollGuide(spec) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 레이드 가이드 전체 페이지
  await page.goto(`https://maxroll.gg/wow/class-guides/${spec}-raid-guide`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({
    path: `maxroll-${spec}-raid-full.png`,
    fullPage: true
  });

  // M+ 가이드 전체 페이지
  await page.goto(`https://maxroll.gg/wow/class-guides/${spec}-mythic-plus-guide`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({
    path: `maxroll-${spec}-mythic-full.png`,
    fullPage: true
  });

  // 특정 섹션 스크린샷 (선택적)
  const sections = [
    { selector: '.rotation-priority', name: 'priority' },
    { selector: '.flowchart', name: 'flowchart' },
    { selector: '.talent-tree', name: 'talents' }
  ];

  for (const { selector, name } of sections) {
    const element = await page.$(selector);
    if (element) {
      await element.screenshot({
        path: `maxroll-${spec}-${name}.png`
      });
    }
  }

  await browser.close();
}

// 사용 예시
captureMaxrollGuide('elemental-shaman');
```

#### 1-2. 실행
```bash
node database-builder/capture-maxroll-elemental-shaman.js
```

#### 1-3. 출력 파일
- `maxroll-elemental-shaman-raid-full.png` (레이드 전체)
- `maxroll-elemental-shaman-mythic-full.png` (M+ 전체)
- `maxroll-elemental-shaman-priority.png` (우선순위 섹션)
- `maxroll-elemental-shaman-flowchart.png` (플로우차트)

### Phase 2: 시각 자료 분석 및 데이터 구조화

#### 2-1. 플로우차트 추출
**스크린샷에서 확인할 정보**:
- 조건 분기 노드 (다이아몬드)
- 액션 노드 (사각형)
- 우선순위 순서
- 조건문 (쿨다운, 리소스, 버프)

**데이터 구조 예시**:
```javascript
// 스크린샷 분석 후 작성
const farseerRotationFlow = {
  nodes: [
    {
      id: '1',
      type: 'decision',
      label: '폭풍의 정령 쿨다운?',
      skill: 'stormElemental'
    },
    {
      id: '2',
      type: 'action',
      label: '폭풍의 정령 시전',
      skill: 'stormElemental',
      priority: 0  // 최우선
    },
    {
      id: '3',
      type: 'decision',
      label: '소용돌이 > 90?',
      resource: 'maelstrom'
    },
    {
      id: '4',
      type: 'action',
      label: '대지 충격',
      skill: 'earthShock',
      priority: 1
    }
    // ... 스크린샷에서 추출한 모든 노드
  ],
  edges: [
    { from: '1', to: '2', label: 'Yes' },
    { from: '1', to: '3', label: 'No' },
    { from: '3', to: '4', label: 'Yes' },
    // ... 연결 관계
  ]
};
```

#### 2-2. 우선순위 리스트 추출
**스크린샷에서 확인할 정보**:
- Priority 0-4 레벨
- 스킬 아이콘 및 이름
- 조건문
- 설명 (why)

**데이터 구조 예시**:
```javascript
// Maxroll 스크린샷 기반
const farseerPriority = [
  {
    skill: 'stormElemental',
    condition: '쿨다운 완료',
    priority: 0,  // 빨간색 강조
    why: 'Maxroll: 항상 최우선 사용, 가장 강력한 쿨다운'
  },
  {
    skill: 'stormkeeper',
    condition: '쿨다운 완료',
    priority: 0,
    why: 'Maxroll: 번개 화살/연쇄 번개 강화'
  },
  {
    skill: 'ascendance',
    condition: '쿨다운 완료',
    priority: 0,
    why: 'Maxroll: 화염 충격 확산 + 피해 증가'
  },
  {
    skill: 'earthShock',
    condition: '소용돌이 > 90 또는 원소의 대가 활성',
    priority: 1,
    why: 'Maxroll: 소용돌이 낭비 방지 + 버프 활용'
  }
  // ... 스크린샷에서 추출
];
```

#### 2-3. 타임라인 추출
**스크린샷에서 확인할 정보**:
- 시간별 스킬 사용 순서 (0초, 1.5초, 3초...)
- GCD 간격
- 쿨다운 타이밍

**데이터 구조 예시**:
```javascript
const farseerOpening = [
  { time: 0, skill: 'stormElemental', icon: 'storm_elemental' },
  { time: 1.5, skill: 'flameShock', icon: 'flame_shock' },
  { time: 3, skill: 'ascendance', icon: 'ascendance' },
  { time: 4.5, skill: 'lavaBurst', icon: 'lava_burst' },
  { time: 6, skill: 'primordialWave', icon: 'primordial_wave' },
  { time: 7.5, skill: 'lavaBurst', icon: 'lava_burst' },
  { time: 9, skill: 'lightningBolt', icon: 'lightning_bolt' }
  // ... 20초까지 스크린샷 기반
];
```

### Phase 3: 시각 자료 컴포넌트 구현

#### 3-1. 플로우차트 컴포넌트
```javascript
// src/components/RotationFlowchart.js
import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const RotationFlowchart = ({ flowData, theme }) => {
  const nodes = flowData.nodes.map(node => ({
    id: node.id,
    data: { label: node.label },
    position: { x: node.x || 0, y: node.y || 0 },
    style: {
      background: node.type === 'decision' ? theme.colors.warning : theme.colors.primary,
      color: '#fff',
      border: `2px solid ${theme.colors.accent}`,
      borderRadius: node.type === 'decision' ? '50%' : '8px',
      padding: '10px'
    }
  }));

  const edges = flowData.edges.map(edge => ({
    id: `${edge.from}-${edge.to}`,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    style: { stroke: theme.colors.accent }
  }));

  return (
    <div style={{ height: 400 }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
```

#### 3-2. 타임라인 컴포넌트
```javascript
// src/components/OpeningTimeline.js
import React from 'react';
import SkillIcon from './SkillIcon';

const OpeningTimeline = ({ skills, duration = 20, theme }) => {
  return (
    <div style={{
      position: 'relative',
      height: '100px',
      background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
      borderRadius: '8px',
      padding: '20px 0'
    }}>
      {/* 시간 눈금 */}
      {[0, 5, 10, 15, 20].map(sec => (
        <div key={sec} style={{
          position: 'absolute',
          left: `${(sec/duration) * 100}%`,
          top: 0,
          height: '100%',
          borderLeft: '1px dashed rgba(255,255,255,0.2)'
        }}>
          <span style={{ color: theme.colors.subtext }}>{sec}초</span>
        </div>
      ))}

      {/* 스킬 아이콘 */}
      {skills.map(({ time, skill, icon }, idx) => (
        <div key={idx} style={{
          position: 'absolute',
          left: `${(time/duration) * 100}%`,
          top: '30px',
          transform: 'translateX(-50%)'
        }}>
          <SkillIcon skillId={skill} iconName={icon} size="medium" />
          <div style={{
            color: theme.colors.accent,
            fontSize: '0.8rem',
            textAlign: 'center',
            marginTop: '5px'
          }}>
            {time}초
          </div>
        </div>
      ))}
    </div>
  );
};
```

#### 3-3. Priority 매트릭스 컴포넌트
```javascript
// src/components/PriorityMatrix.js
import React from 'react';
import SkillIcon from './SkillIcon';

const PriorityMatrix = ({ priorities, SkillIcon, theme }) => {
  const priorityColors = {
    0: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',  // 최우선 빨강
    1: 'linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)',  // 주황
    2: 'linear-gradient(135deg, #28a745 0%, #218838 100%)',  // 초록
    3: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',  // 청록
    4: 'transparent'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {priorities.map(({ skill, condition, priority, why }, idx) => (
        <div key={idx} style={{
          background: priorityColors[priority] || 'transparent',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
          padding: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <SkillIcon skillId={skill} size="large" />
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>
              {condition}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '5px' }}>
              {why}
            </div>
          </div>
          <div style={{
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 'bold',
            opacity: 0.5
          }}>
            {priority}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### Phase 4: GuideTemplate.js 통합

#### 4-1. Import 추가
```javascript
// GuideTemplate.js 상단
import RotationFlowchart from './RotationFlowchart';
import OpeningTimeline from './OpeningTimeline';
import PriorityMatrix from './PriorityMatrix';
```

#### 4-2. getHeroContent에 통합
```javascript
const getHeroContent = (SkillIcon) => ({
  farseer: {
    name: '선견자',
    icon: '🔮',

    // Maxroll 플로우차트 (스크린샷 기반)
    flowchart: farseerRotationFlow,

    // Maxroll 타임라인 (스크린샷 기반)
    openingTimeline: farseerOpening,

    // Maxroll 우선순위 (스크린샷 기반)
    priority: farseerPriority,

    tierSet: {
      twoSet: "2세트 효과 (Maxroll 참고)",
      fourSet: "4세트 효과 (Maxroll 참고)"
    }
  }
});
```

#### 4-3. 렌더링 섹션 추가
```javascript
{/* 플로우차트 섹션 */}
<Section>
  <SectionTitle>딜사이클 플로우차트</SectionTitle>
  <RotationFlowchart
    flowData={heroContent.flowchart}
    theme={unifiedTheme}
  />
</Section>

{/* 타임라인 섹션 */}
<Section>
  <SectionTitle>오프닝 타임라인</SectionTitle>
  <OpeningTimeline
    skills={heroContent.openingTimeline}
    duration={20}
    theme={unifiedTheme}
  />
</Section>

{/* 우선순위 매트릭스 */}
<Section>
  <SectionTitle>우선순위 (Priority 0-4)</SectionTitle>
  <PriorityMatrix
    priorities={heroContent.priority}
    SkillIcon={SkillIcon}
    theme={unifiedTheme}
  />
</Section>
```

### 체크리스트

**Maxroll 스크린샷 수집**
- [ ] Playwright 스크립트 생성 (`capture-maxroll-{spec}.js`)
- [ ] 레이드 가이드 전체 스크린샷
- [ ] M+ 가이드 전체 스크린샷
- [ ] 플로우차트/우선순위 섹션 스크린샷 (선택)

**데이터 구조화**
- [ ] 플로우차트 노드/엣지 데이터 작성 (`{hero}RotationFlow`)
- [ ] 우선순위 리스트 작성 (`{hero}Priority`)
- [ ] 타임라인 작성 (`{hero}Opening`)

**컴포넌트 구현**
- [ ] RotationFlowchart.js 생성
- [ ] OpeningTimeline.js 생성
- [ ] PriorityMatrix.js 생성

**GuideTemplate.js 통합**
- [ ] Import 추가
- [ ] getHeroContent에 데이터 추가
- [ ] 렌더링 섹션 추가

**검증**
- [ ] 플로우차트 정상 표시
- [ ] 타임라인 정확한 시간 표시
- [ ] Priority 0 빨간색 강조
- [ ] 스킬 아이콘 정상 작동

---

## ⚡ 빠른 시작 (AI 체크리스트)

작업 순서를 **정확히** 따르세요. 단계를 건너뛰면 안 됩니다.

- [ ] **Step 1**: 파일 복사 및 이름 변경
- [ ] **Step 2**: 스킬 데이터 import 수정 (Line 6)
- [ ] **Step 3**: 색상 테마 전체 변경 (Line 17-39, 27)
- [ ] **Step 4**: 컴포넌트명 변경 (Line 1110, 4066)
- [ ] **Step 5**: 영웅 특성 키 이름 변경 (전체 파일)
- [ ] **Step 6**: 영웅 특성 기본 정보 (Line 282-286, 527-529)
- [ ] **Step 6.5**: 가이드 제목 및 메타 정보 색상 (Line 3814-3821)
- [ ] **Step 7**: 영웅 특성 탭 버튼 텍스트 (Line 1428, 1434)
- [ ] **Step 8**: 티어 세트 효과 (Line 287-290, 530-533)
- [ ] **Step 9**: 오프닝 시퀀스 (Line 291-301, 364-372 등)
- [ ] **Step 10**: 우선순위 시스템 (Line 302-362 등)
- [ ] **Step 10.5**: 영웅 특성 딜링 메커니즘 (Line 1513-1661, ~150줄)
- [ ] **Step 11**: 핵심 메커니즘 (Line 534-817)
- [ ] **Step 12**: 개요 텍스트 (Line 1390-1510)
- [ ] **Step 13**: 심화 분석 (Line 2012-2800, ~800줄, 가장 중요)
- [ ] **Step 14**: 스탯 우선순위 (Line 3417-3430)
- [ ] **Step 15**: App.js 라우팅 추가
- [ ] **Step 16**: 빌드 및 검증

---

## 📖 상세 작업 단계

### Step 1: 파일 복사 및 이름 변경

**실행 명령어**:
```bash
cp src/components/GuideTemplate.js src/components/ElementalShamanGuide.js
```

**파일명 규칙**:
- 형식: `{ClassSpec}Guide.js` (PascalCase)
- 예시: `ElementalShamanGuide.js`, `ArcaneMageGuide.js`, `BeastMasteryHunterGuide.js`

**검증**:
```bash
ls -lh src/components/ElementalShamanGuide.js
# 출력: 4065줄 정도의 파일이 있어야 함
```

---

### Step 2: 스킬 데이터 import 수정

**위치**: **Line 6** (정확히 6번째 줄)

**검색 키워드**:
```bash
grep -n "furyWarriorSkills as skillData" src/components/ElementalShamanGuide.js
```

**변경 전**:
```javascript
import { furyWarriorSkills as skillData } from '../data/furyWarriorSkillData';
```

**변경 후** (정기 주술사 예시):
```javascript
import { elementalShamanSkills as skillData } from '../data/elementalShamanSkillData';
```

**중요**:
- `as skillData` 부분은 **절대 변경하지 마세요**
- 중괄호 안의 이름만 변경: `furyWarriorSkills` → `elementalShamanSkills`
- 파일 경로도 변경: `furyWarriorSkillData` → `elementalShamanSkillData`

**검증**:
```bash
grep -n "import.*skillData" src/components/ElementalShamanGuide.js
# 출력: 6:import { elementalShamanSkills as skillData } from '../data/elementalShamanSkillData';
```

#### 2.1 스킬 데이터 파일 생성

`src/data/{spec}SkillData.js` 파일을 생성할 때 **반드시** 다음 필드를 정확히 채워야 합니다.

#### 2.2 ⚠️ 아이콘 필드 검증 (매우 중요)

**문제 사례**:
```javascript
// ❌ 잘못된 예 - 모든 스킬이 물음표(❓)로 표시됨
export const arcaneMageSkills = {
  arcanemissiles: {
    id: 5143,
    koreanName: "신비한 화살",
    icon: "bnet-large",  // ❌ 플레이스홀더 (잘못됨)
  }
};
```

**올바른 예**:
```javascript
// ✅ 올바른 예 - 정확한 아이콘 표시
export const arcaneMageSkills = {
  arcanemissiles: {
    id: 5143,
    koreanName: "신비한 화살",
    icon: "spell_arcane_missiles",  // ✅ 실제 아이콘명
  }
};
```

**아이콘 파일명 찾는 방법**:

1. **Wowhead 페이지 소스에서 추출** (가장 정확):
```javascript
// 브라우저 콘솔 (F12)에서 실행
const iconElement = document.querySelector('[class*="iconsmall"]');
const iconUrl = iconElement?.src;
// 출력: https://wow.zamimg.com/images/wow/icons/small/spell_arcane_missiles.jpg
// → icon: "spell_arcane_missiles"
```

2. **게임 내 애드온 사용**:
```lua
/run local _, _, icon = GetSpellInfo(5143); print(icon)
-- 출력: Interface\Icons\spell_arcane_missiles
-- → icon: "spell_arcane_missiles"
```

3. **내부 DB 확인** (이미 수집된 경우):
```bash
grep -A 5 '"id": 5143' database-builder/tww-s3-complete-database-enhanced.json
```

**검증**:
```bash
# 모든 스킬의 icon 필드 확인
grep '"icon":' src/data/arcaneMageSkillData.js | grep "bnet-large"
# 출력 있음 = 아직 플레이스홀더가 남아있음 (수정 필요)
# 출력 없음 = 모든 아이콘이 실제 파일명으로 변경됨 ✅
```

---

### Step 3: 색상 테마 전체 변경

#### 3.1 Primary & Accent 색상 (Line 18-19, 25)

**검색 키워드**:
```bash
grep -n "primary: '#C69B6D'" src/components/ElementalShamanGuide.js
```

**변경할 위치**:
- Line 18: `primary: '#C69B6D',`
- Line 25: `accent: '#C69B6D',`

**직업별 색상표**:
| 직업 | 한글명 | 색상 코드 | RGB (rgba용) |
|------|--------|-----------|--------------|
| Warrior | 전사 | `#C69B6D` | `198, 156, 109` |
| Paladin | 성기사 | `#F58CBA` | `245, 140, 186` |
| Hunter | 사냥꾼 | `#AAD372` | `170, 211, 114` |
| Rogue | 도적 | `#FFF569` | `255, 245, 105` |
| Priest | 사제 | `#FFFFFF` | `255, 255, 255` |
| Shaman | 주술사 | `#0070DE` | `0, 112, 222` |
| Mage | 마법사 | `#3FC6EA` | `63, 198, 234` |
| Warlock | 흑마법사 | `#9482C9` | `148, 130, 201` |
| Monk | 수도사 | `#00FF96` | `0, 255, 150` |
| Druid | 드루이드 | `#FF7D0A` | `255, 125, 10` |
| DemonHunter | 악마사냥꾼 | `#A330C9` | `163, 48, 201` |
| DeathKnight | 죽음의 기사 | `#C41E3A` | `196, 30, 58` |
| Evoker | 기원사 | `#33937F` | `51, 147, 127` |

**변경 전**:
```javascript
const unifiedTheme = {
  colors: {
    primary: '#C69B6D',      // 전사 클래스 색상
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#C69B6D',
    border: '#2a2a3e',
    hover: 'rgba(198, 156, 109, 0.1)',  // ⚠️ RGB도 변경 필요
```

**변경 후** (정기 주술사 예시):
```javascript
const unifiedTheme = {
  colors: {
    primary: '#0070DE',      // 주술사 클래스 색상
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#0070DE',
    border: '#2a2a3e',
    hover: 'rgba(0, 112, 222, 0.1)',  // ⚠️ RGB 값 변경
```

#### 3.2 Hover 색상 (Line 27)

**검색 키워드**:
```bash
grep -n "hover: 'rgba" src/components/ElementalShamanGuide.js
```

**변경 전**:
```javascript
hover: 'rgba(198, 156, 109, 0.1)',
```

**변경 후** (정기 주술사 예시):
```javascript
hover: 'rgba(0, 112, 222, 0.1)',
```

**검증** (전사 색상이 남아있으면 안 됨):
```bash
grep "#C69B6D\|198, 156, 109" src/components/ElementalShamanGuide.js
# 출력 없음 = 성공
# 출력 있음 = 아직 안 바뀐 곳이 있음
```

---

### Step 4: 컴포넌트명 변경

#### 4.1 함수 선언 (Line 1110)

**검색 키워드**:
```bash
grep -n "const FuryWarriorGuide = () =>" src/components/ElementalShamanGuide.js
```

**변경 전**:
```javascript
const FuryWarriorGuide = () => {
```

**변경 후**:
```javascript
const ElementalShamanGuide = () => {
```

#### 4.2 Export (Line 4066 - 파일 마지막 줄)

**검색 키워드**:
```bash
grep -n "export default" src/components/ElementalShamanGuide.js
```

**변경 전**:
```javascript
export default FuryWarriorGuide;
```

**변경 후**:
```javascript
export default ElementalShamanGuide;
```

**검증**:
```bash
grep "FuryWarriorGuide" src/components/ElementalShamanGuide.js
# 출력 없음 = 성공
```

---

### Step 5: 영웅 특성 키 이름 변경 (전체 파일)

**중요**: 이 단계는 **전체 파일**에서 작업해야 합니다.

#### 5.1 영웅 특성 키 매핑 테이블

**분노 전사 기준**:
- `slayer` (학살자)
- `mountainThane` (산왕)

**새로운 전문화의 영웅 특성 찾기**:
1. `https://ko.wowhead.com/talent-calc/{class}/{spec}` 접속
2. 영웅 특성 탭 확인
3. camelCase로 변환 (예: "선견자" → `farseer`, "폭풍인도자" → `stormbringer`)

**전체 파일에서 변경해야 할 위치**:
```bash
# 모든 위치 찾기
grep -n "slayer\|mountainThane" src/components/ElementalShamanGuide.js
```

**출력 예시** (변경해야 할 모든 라인):
```
282:  slayer: {
527:  mountainThane: {
1113:  const [selectedTier, setSelectedTier] = useState('slayer');
1115:  const [selectedStatHero, setSelectedStatHero] = useState('slayer');
1378:  const heroContent = getHeroContent(SkillIcon);
2022:  {selectedTier === 'slayer' ? (
2301:  ) : selectedTier === 'mountainThane' ? (
3417:  const statPriorities = {
3418:    slayer: {
3422:    mountainThane: {
...
```

**변경 방법** (정기 주술사 예시):
- `slayer` → `farseer` (모든 위치)
- `mountainThane` → `stormbringer` (모든 위치)

**Multi-Edit 사용** (추천):
```bash
# VS Code 또는 에디터의 찾기/바꾸기 기능 사용
# 찾기: \bslayer\b (정규식)
# 바꾸기: farseer
# 전체 바꾸기

# 찾기: \bmountainThane\b
# 바꾸기: stormbringer
# 전체 바꾸기
```

**검증**:
```bash
grep "slayer\|mountainThane" src/components/ElementalShamanGuide.js
# 출력 없음 = 성공
```

---

### Step 6: 영웅 특성 기본 정보 변경

#### 6.1 영웅 특성 1 (Line 282-286)

**검색 키워드**:
```bash
grep -n "slayer: {" src/components/ElementalShamanGuide.js
# 또는 (Step 5 완료 후)
grep -n "farseer: {" src/components/ElementalShamanGuide.js
```

**변경 전**:
```javascript
  slayer: {
    name: '학살자',
    icon: '⚔️',
    tierSet: {
```

**변경 후** (정기 주술사 예시):
```javascript
  farseer: {
    name: '선견자',
    icon: '🔮',
    tierSet: {
```

#### 6.2 영웅 특성 2 (Line 527-529)

**검색 키워드**:
```bash
grep -n "mountainThane: {" src/components/ElementalShamanGuide.js
# 또는 (Step 5 완료 후)
grep -n "stormbringer: {" src/components/ElementalShamanGuide.js
```

**변경 전**:
```javascript
  mountainThane: {
    name: '산왕',
    icon: '⚡',
```

**변경 후** (정기 주술사 예시):
```javascript
  stormbringer: {
    name: '폭풍인도자',
    icon: '⚡',
```

**이모지 선택 가이드**:
- 검색: "wow {spec} emoji" 또는 클래스 테마에 맞는 이모지
- 추천: 🔮🔥❄️⚡🌊💀🌿🐻🦅⚔️🛡️

---

### Step 6.5: 가이드 제목 및 메타 정보 색상 변경

**⚠️ 이 단계를 놓치면**: 가이드 제목이 "분노 전사 가이드"로 남고, 색상도 전사 색상(갈색)으로 표시됨

#### 6.5.1 가이드 제목 텍스트 (Line 3821)

**검색 키워드**:
```bash
grep -n "분노 전사 가이드" src/components/ElementalShamanGuide.js
```

**변경 전**:
```javascript
<h1 style={{
  fontSize: '3rem',
  fontWeight: '900',
  background: 'linear-gradient(135deg, #C69B6D 0%, #a07d56 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '1rem',
  textShadow: '0 0 30px rgba(198, 156, 109, 0.3)'
}}>
  분노 전사 가이드
</h1>
```

**변경 후** (정기 주술사 예시):
```javascript
<h1 style={{
  fontSize: '3rem',
  fontWeight: '900',
  background: 'linear-gradient(135deg, #0070DE 0%, #005bb5 100%)',  // ⚠️ 주술사 색상
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '1rem',
  textShadow: '0 0 30px rgba(0, 112, 222, 0.3)'  // ⚠️ RGB 값 변경
}}>
  정기 주술사 가이드
</h1>
```

#### 6.5.2 Gradient 2차 색상 계산법

**1차 색상**: 직업별 색상표에서 primary 색상 사용 (예: `#0070DE`)
**2차 색상**: 1차 색상보다 약간 어둡게 (RGB 값을 80-85% 수준으로 조정)

**예시 계산**:
```javascript
// 주술사 primary: #0070DE = RGB(0, 112, 222)
// 2차 색상 (85% 어둡게): RGB(0, 95, 189) = #005FBD (근사치: #005bb5)

// 마법사 primary: #3FC6EA = RGB(63, 198, 234)
// 2차 색상 (85% 어둡게): RGB(54, 168, 199) = #36A8C7

// 전사 primary: #C69B6D = RGB(198, 156, 109)
// 2차 색상 (85% 어둡게): RGB(168, 132, 93) = #A8845D (근사치: #a07d56)
```

#### 6.5.3 textShadow RGB 값 변환

`textShadow`에는 **1차 색상의 RGB 값**을 사용합니다.

**변환 방법**:
1. Hex → RGB 변환 (예: `#0070DE` → `RGB(0, 112, 222)`)
2. `rgba(R, G, B, 0.3)` 형식으로 작성

**예시**:
```javascript
// 주술사 #0070DE
textShadow: '0 0 30px rgba(0, 112, 222, 0.3)'

// 마법사 #3FC6EA
textShadow: '0 0 30px rgba(63, 198, 234, 0.3)'

// 흑마법사 #9482C9
textShadow: '0 0 30px rgba(148, 130, 201, 0.3)'
```

**검증**:
```bash
# 전사 관련 텍스트 확인
grep "분노 전사" src/components/ElementalShamanGuide.js
# 출력 없음 = 성공

# 전사 색상 확인
grep "#C69B6D\|#a07d56\|198, 156, 109" src/components/ElementalShamanGuide.js
# 출력 없음 = 성공
```

---

### Step 7: 영웅 특성 탭 버튼 텍스트 변경

**⚠️ 이 단계를 놓치면**: 탭 버튼 텍스트가 "학살자", "산왕"으로 남음 (getHeroContent의 name과 불일치)

**중요**: 이 단계는 **Step 6에서 설정한 `name` 필드와 동일해야 합니다**

#### 7.1 영웅 특성 탭 버튼 위치 (Line 1428, 1434)

**검색 키워드**:
```bash
grep -n "학살자 (Slayer)\|산왕 (Mountain Thane)" src/components/ElementalShamanGuide.js
```

**변경 전**:
```javascript
{/* 영웅 특성 선택 탭 */}
<div className={styles.tierSelectContainer}>
  <button
    className={`${styles.tierSelectButton} ${selectedTier === 'slayer' ? styles.activeTier : ''}`}
    onClick={() => setSelectedTier('slayer')}
  >
    <span className={styles.tierIcon}>⚔️</span> 학살자 (Slayer)  {/* ❌ */}
  </button>
  <button
    className={`${styles.tierSelectButton} ${selectedTier === 'mountainThane' ? styles.activeTier : ''}`}
    onClick={() => setSelectedTier('mountainThane')}
  >
    <span className={styles.tierIcon}>⚡</span> 산왕 (Mountain Thane)  {/* ❌ */}
  </button>
</div>
```

**변경 후** (정기 주술사 예시):
```javascript
{/* 영웅 특성 선택 탭 */}
<div className={styles.tierSelectContainer}>
  <button
    className={`${styles.tierSelectButton} ${selectedTier === 'farseer' ? styles.activeTier : ''}`}
    onClick={() => setSelectedTier('farseer')}
  >
    <span className={styles.tierIcon}>🔮</span> 선견자 (Farseer)  {/* ✅ */}
  </button>
  <button
    className={`${styles.tierSelectButton} ${selectedTier === 'stormbringer' ? styles.activeTier : ''}`}
    onClick={() => setSelectedTier('stormbringer')}
  >
    <span className={styles.tierIcon}>⚡</span> 폭풍인도자 (Stormbringer)  {/* ✅ */}
  </button>
</div>
```

**검증**:
```bash
# Step 6의 name과 일치하는지 확인
grep "name: '선견자'" src/components/ElementalShamanGuide.js
grep "선견자 (Farseer)" src/components/ElementalShamanGuide.js
# 두 출력 모두 있어야 함 = 일치

# 전사 영웅 특성명 확인
grep "학살자\|산왕" src/components/ElementalShamanGuide.js
# 출력 없음 = 성공
```

---

### Step 8: 티어 세트 효과 변경

#### 8.1 영웅 특성 1 티어 세트 (Line 287-290)

**검색 키워드**:
```bash
grep -n "'2set':" src/components/ElementalShamanGuide.js | head -1
```

**변경 전**:
```javascript
    tierSet: {
      '2set': '2세트: 마무리 일격 피해가 20% 증가하고, 급살의 마무리 일격이 대상의 압도 중첩당 10% 확률로 학살자의 일격을 100% 효과로 발동합니다.',
      '4set': '4세트: 분노의 강타 피해가 20% 증가하고, 분노의 강타가 대상의 압도 중첩당 2% 확률로 폭풍 수확을 100% 효과로 발동합니다.'
    },
```

**변경 후** (정기 주술사 예시):
```javascript
    tierSet: {
      '2set': '2세트: 용암 폭발 피해가 15% 증가하고, 용암 폭발 사용 시 20% 확률로 용암 쇄도 중첩을 1회 획득합니다.',
      '4set': '4세트: 번개 화살이 대상에게 전기불꽃을 발생시켜 8초에 걸쳐 자연 피해를 입힙니다. 번개 화살 치명타 시 전기불꽃 피해가 100% 증가합니다.'
    },
```

**데이터 소스**:
1. 게임 내 특성 창 → 티어 세트 툴팁
2. `https://ko.wowhead.com/item-set` 검색
3. Icy-veins 가이드 "Tier Set" 섹션

**⚠️ TWW 시즌 3 중요 사항**:
- **영웅 특성별로 티어셋 효과가 다릅니다** (시즌 2까지는 동일했으나 시즌 3부터 변경)
- Sunfury와 Spellslinger는 완전히 다른 2세트/4세트 효과를 가짐
- **"2세트:", "4세트:" 접두어를 제거하세요** - 구조에 이미 포함되어 있음
- Maxroll은 주로 메타 빌드(Sunfury)만 다룸 → 대안 영웅 특성은 Wowhead에서 확인 필요

**검증**:
```bash
grep "'2set':\|'4set':" src/components/ElementalShamanGuide.js
# 전사 관련 텍스트가 없는지 확인
# "2세트:", "4세트:" 접두어가 없는지 확인
```

---

### Step 8: 오프닝 시퀀스 변경

#### 8.1 영웅 특성 1 - 단일 대상 오프닝 (Line 291-301)

**검색 키워드**:
```bash
grep -n "singleTarget: {" src/components/ElementalShamanGuide.js | head -1
```

**변경 전**:
```javascript
    singleTarget: {
      opener: [
        skillData.charge,
        skillData.bloodthirst,
        skillData.recklessness,
        skillData.avatar,
        skillData.thunderousRoar,
        skillData.bladestorm,
        skillData.stormBolt,
        skillData.ragingBlow,
        skillData.rampage
      ],
```

**변경 후** (정기 주술사 예시):
```javascript
    singleTarget: {
      opener: [
        skillData.flameShock,
        skillData.primordialWave,
        skillData.fireElemental,
        skillData.stormkeeper,
        skillData.lavaBurst,
        skillData.lavaBurst,
        skillData.elementalBlast,
        skillData.earthShock
      ],
```

**중요**:
- 배열 순서 = 실제 게임에서 누르는 순서
- `skillData.스킬변수명` 형식 **반드시** 유지
- 스킬 변수명은 `{spec}SkillData.js`에서 확인

**스킬 변수명 확인 방법**:
```bash
grep "export const" src/data/elementalShamanSkillData.js
```

#### 8.2 영웅 특성 1 - 광역 대상 오프닝 (Line 364-372)

**검색 키워드**:
```bash
grep -n "aoe: {" src/components/ElementalShamanGuide.js | head -1
```

**변경 전**:
```javascript
    aoe: {
      opener: [
        skillData.charge,
        skillData.thunderousRoar,
        skillData.avatar,
        skillData.whirlwind,
        skillData.bladestorm,
        skillData.bloodthirst,
        skillData.rampage
      ],
```

**변경 후** (정기 주술사 예시):
```javascript
    aoe: {
      opener: [
        skillData.flameShock,
        skillData.fireElemental,
        skillData.stormkeeper,
        skillData.chainLightning,
        skillData.chainLightning,
        skillData.chainLightning,
        skillData.earthquake
      ],
```

#### 8.3 영웅 특성 2 오프닝도 동일하게 변경
- 영웅 특성 2의 `singleTarget.opener` 찾기
- 영웅 특성 2의 `aoe.opener` 찾기

**검증**:
```bash
grep "opener: \[" src/components/ElementalShamanGuide.js
# 전사 스킬(charge, bloodthirst 등)이 없는지 확인
```

---

### Step 9: 우선순위 시스템 변경

#### 9.1 Priority 필드 구조

```javascript
priority: [
  {
    skill: skillData.스킬변수명,
    conditions: ['조건1', '조건2', ...],
    priority: 숫자,
    why: '이유 설명'
  },
  // ...
]
```

**필드 설명**:
- `skill`: 스킬 객체 (`skillData.XXX`)
- `conditions`: 배열 (조건 여러 개 가능)
- `priority`: 숫자 (0 = 최우선, 숫자 클수록 낮은 우선순위)
- `why`: 왜 이 우선순위인지 설명

**Priority 0 규칙** (매우 중요):
- 각 우선순위 배열에서 **반드시 1개만** `priority: 0` 지정
- Priority 0 스킬은 빨간색 배경으로 강조됨
- 가장 중요한 스킬에만 부여

#### 9.2 영웅 특성 1 - 단일 대상 우선순위 (Line 302-362)

**검색 키워드**:
```bash
grep -n "priority: \[" src/components/ElementalShamanGuide.js | head -1
```

**변경 전**:
```javascript
      priority: [
        {
          skill: skillData.execute,
          conditions: ['마무리 일격 표식 2중첩', '대상 체력 20% 이하'],
          priority: 0,
          why: '학살자의 핵심 메커니즘. 2중첩 이상일 때 피해가 20% 증가하므로 최우선 사용'
        },
        {
          skill: skillData.rampage,
          conditions: ['분노 80 이상', '격노 버프 없음'],
          priority: 1,
          why: '격노 버프 유지가 최우선. 격노 없으면 즉시 사용해서 버프 갱신'
        },
        // ... 10-15개 우선순위
      ]
```

**변경 후** (정기 주술사 예시):
```javascript
      priority: [
        {
          skill: skillData.primordialWave,
          conditions: ['쿨다운 완료', '화염 충격 디버프 활성'],
          priority: 0,
          why: '태고의 파도는 용암 쇄도 중첩을 부여하고 즉시 용암 폭발을 발동시키므로 최우선 사용'
        },
        {
          skill: skillData.lavaBurst,
          conditions: ['용암 쇄도 버프 활성', '또는 쿨다운 완료'],
          priority: 1,
          why: '100% 치명타가 보장되며 용암 쇄도 중첩을 소모하여 막대한 피해를 입힘'
        },
        {
          skill: skillData.elementalBlast,
          conditions: ['쿨다운 완료', '마스터리 버프 필요'],
          priority: 2,
          why: '강력한 단일 대상 스킬이며 마스터리 버프 제공'
        },
        {
          skill: skillData.earthShock,
          conditions: ['소용돌이 값 60 이상'],
          priority: 3,
          why: '소용돌이 값 낭비 방지. 60 이상일 때 사용하여 피해 최대화'
        },
        {
          skill: skillData.flameShock,
          conditions: ['디버프 지속시간 5.4초 이하'],
          priority: 4,
          why: '용암 폭발 사용을 위해 항상 유지 필요'
        },
        {
          skill: skillData.frostShock,
          conditions: ['아이스퓨리 특성', '이동 필요'],
          priority: 5,
          why: '이동 중 소용돌이 값 생성용 즉시 시전 스킬'
        },
        {
          skill: skillData.lightningBolt,
          conditions: ['필러 스킬'],
          priority: 6,
          why: '다른 모든 스킬이 쿨다운일 때 사용하는 기본 공격'
        }
      ]
```

**우선순위 개수 가이드**:
- 최소: 5개
- 평균: 7-10개
- 복잡한 전문화: 12-15개

#### 9.3 영웅 특성 1 - 광역 대상 우선순위 (Line 373-430)

**검색 키워드**:
```bash
grep -n "aoe: {" src/components/ElementalShamanGuide.js | head -1
# 그 다음 priority 배열 찾기
```

**변경 후** (정기 주술사 예시):
```javascript
    aoe: {
      opener: [ /* ... */ ],
      priority: [
        {
          skill: skillData.stormkeeper,
          conditions: ['쿨다운 완료', '3+ 적'],
          priority: 0,
          why: '폭풍지기는 다음 2회의 연쇄 번개를 즉시 시전으로 변환하고 피해를 크게 증가시킴'
        },
        {
          skill: skillData.chainLightning,
          conditions: ['폭풍지기 버프 활성', '또는 3+ 적'],
          priority: 1,
          why: '광역 상황에서 주력 스킬. 폭풍지기 버프와 함께 사용 시 극대화'
        },
        {
          skill: skillData.earthquake,
          conditions: ['소용돌이 값 60 이상', '5+ 적'],
          priority: 2,
          why: '5+ 적 상황에서 대지 충격보다 효율적. 지속 피해로 막대한 광역 딜'
        },
        {
          skill: skillData.lavaBurst,
          conditions: ['용암 쇄도 버프 활성'],
          priority: 3,
          why: '광역 상황에서도 용암 쇄도 버프를 낭비하지 않기 위해 사용'
        },
        {
          skill: skillData.flameShock,
          conditions: ['타겟 없음', '우선순위 타겟 선택'],
          priority: 4,
          why: '주 타겟에 화염 충격 유지'
        }
      ]
    }
```

#### 9.4 영웅 특성 2 우선순위도 동일하게 작성

**검증**:
```bash
# Priority 0이 정확히 4개인지 확인 (각 영웅 특성 × 단일/광역 = 2×2)
grep -c "priority: 0" src/components/ElementalShamanGuide.js
# 출력: 4
```

---

### Step 10.5: 영웅 특성 딜링 메커니즘 변경 (매우 중요)

**⚠️ 이 단계를 놓치면**: 약 150줄의 영웅 특성별 딜링 메커니즘 설명이 전사 내용으로 남음

**위치**: **Line 1513-1661** (~150줄)

**검색 키워드**:
```bash
grep -n "학살자 (Slayer)는\|산왕 (Mountain Thane)는" src/components/ElementalShamanGuide.js
```

#### 10.5.1 구조 확인

이 섹션은 **개요 (Overview)** 탭 아래의 **딜링 메커니즘** 하위 섹션입니다.

```javascript
<h3 className={styles.subsectionTitle} style={{ marginTop: '30px' }}>딜링 메커니즘</h3>

{/* 영웅 특성별 딜링 메커니즘 설명 (~150줄) */}
<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong style={{ color: '#FF6B6B' }}>학살자 (Slayer)</strong>는  {/* ❌ */}
  출혈 피해와 <SkillIcon skill={skillData.execute} textOnly={true} /> 강화를 통한  {/* ❌ */}
  버스트 중심의 플레이를 제공합니다.
  {/* ... 5-7문단 */}
</p>
```

#### 10.5.2 변경 방법

**핵심 원칙**:
- 각 영웅 특성의 **핵심 메커니즘 3-5개**를 설명
- 각 메커니즘당 **1-2문단**
- **SkillIcon 컴포넌트**로 관련 스킬 표시

**변경 전** (분노 전사 예시 - Line 1513-1661):
```javascript
<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong style={{ color: '#FF6B6B' }}>학살자 (Slayer)</strong>는
  출혈 피해와 <SkillIcon skill={skillData.execute} textOnly={true} /> 강화를 통한
  버스트 중심의 플레이를 제공합니다.
  <SkillIcon skill={skillData.execute} textOnly={true} /> 사용 시 대상에게
  <strong>마무리 일격 표식</strong>을 부여하고, 2중첩 이상일 때 피해가 20% 증가합니다.
</p>

<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong style={{ color: '#C69B6D' }}>격노 버프 유지</strong>가 학살자의 핵심입니다.
  <SkillIcon skill={skillData.bloodthirst} textOnly={true} /> 또는
  <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> 치명타 시 격노 버프가 발동되며,
  12초 동안 가속 25%, 피해 20% 증가 효과를 제공합니다.
</p>

{/* ... 5-7문단 더 */}

<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong style={{ color: '#4ECDC4' }}>산왕 (Mountain Thane)</strong>은
  번개 피해와 <SkillIcon skill={skillData.thunderousRoar} textOnly={true} />를 중심으로
  광역 딜에 특화되어 있습니다.
</p>

{/* ... 5-7문단 더 */}
```

**변경 후** (정기 주술사 예시):
```javascript
<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong style={{ color: '#64c8ff' }}>선견자 (Farseer)</strong>는
  용암 쇄도 중첩 관리와 <SkillIcon skill={skillData.primordialWave} textOnly={true} />를 통한
  단일 대상 폭발 딜에 특화되어 있습니다.
  <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 사용 시
  <strong>용암 쇄도 중첩</strong>을 획득하고 (최대 2중첩), 중첩당 다음 용암 폭발 피해가 10% 증가합니다.
</p>

<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong style={{ color: '#0070DE' }}>화염 충격 유지</strong>가 선견자의 핵심입니다.
  <SkillIcon skill={skillData.flameShock} textOnly={true} /> 디버프가 활성화되어야만
  <SkillIcon skill={skillData.lavaBurst} textOnly={true} />를 사용할 수 있으며,
  디버프 지속시간이 5.4초 이하일 때 재사용합니다 (팬데믹 구간).
</p>

<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong>태고의 파도 최적화</strong>는 30초 쿨다운의 핵심 스킬입니다.
  <SkillIcon skill={skillData.primordialWave} textOnly={true} /> 사용 시
  <SkillIcon skill={skillData.flameShock} textOnly={true} />를 확산시키고,
  즉시 <SkillIcon skill={skillData.lavaBurst} textOnly={true} />를 발동시키며,
  용암 쇄도 2중첩을 부여합니다.
  쿨다운이 돌 때마다 즉시 사용하는 것이 DPS 극대화의 핵심입니다.
</p>

<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong>소용돌이 값 관리</strong>도 중요합니다.
  <SkillIcon skill={skillData.lightningBolt} textOnly={true} />로 소용돌이 값을 생성하고,
  60-80 구간에서 <SkillIcon skill={skillData.earthShock} textOnly={true} />로 소모합니다.
  100을 초과하면 소용돌이 값이 낭비되므로 주의해야 합니다.
</p>

<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong style={{ color: '#ffa500' }}>폭풍인도자 (Stormbringer)</strong>는
  폭풍지기와 <SkillIcon skill={skillData.chainLightning} textOnly={true} />를 중심으로
  광역 딜에 특화되어 있습니다.
  <SkillIcon skill={skillData.stormkeeper} textOnly={true} /> 사용 시
  다음 2회의 연쇄 번개가 즉시 시전으로 변환되고 피해가 150% 증가합니다.
</p>

<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong>폭풍지기 동기화</strong>가 폭풍인도자의 핵심입니다.
  60초 쿨다운의 <SkillIcon skill={skillData.stormkeeper} textOnly={true} />를
  <SkillIcon skill={skillData.stormElemental} textOnly={true} />와 함께 사용하여
  광역 버스트를 극대화합니다.
  3+ 적 상황에서만 사용하는 것이 중요합니다.
</p>

{/* ... 추가 메커니즘 3-5문단 더 */}
```

#### 10.5.3 작성 가이드

**각 영웅 특성당 작성해야 할 내용**:
1. **핵심 메커니즘 소개** (1문단)
   - 영웅 특성의 정체성
   - 주력 스킬 언급

2. **주요 메커니즘 1** (1-2문단)
   - 가장 중요한 메커니즘
   - 관련 스킬, 조건, 효과

3. **주요 메커니즘 2** (1-2문단)
   - 두 번째로 중요한 메커니즘

4. **주요 메커니즘 3** (1-2문단)
   - 세 번째로 중요한 메커니즘

5. **추가 메커니즘** (선택, 2-4문단)

**총 문단 수**: 영웅 특성당 5-8문단 권장

**검증**:
```bash
# 전사 관련 텍스트 확인
grep "학살자\|산왕\|격노\|execute\|bloodthirst" src/components/ElementalShamanGuide.js
# 출력 없음 = 성공

# 새 영웅 특성 확인
grep "선견자\|폭풍인도자" src/components/ElementalShamanGuide.js
# 출력 여러 개 = 성공
```

---

### Step 11: 핵심 메커니즘 변경

#### 11.1 위치 (Line 534-817)

**검색 키워드**:
```bash
grep -n "mechanics: \[" src/components/ElementalShamanGuide.js | head -1
```

**변경 전**:
```javascript
    mechanics: [
      {
        title: '격노 버프 유지',
        description: '피의 갈증 또는 분노의 강타 치명타로 격노 버프 발동. 12초 지속, 가속 25% + 피해 20% 증가',
        icon: '⚡',
        skills: [skillData.bloodthirst, skillData.ragingBlow],
        priority: 'high',
        why: '격노 버프가 없으면 DPS가 급감하므로 90% 이상 유지율 목표'
      },
      // ... 5-8개 메커니즘
    ]
```

**변경 후** (정기 주술사 예시):
```javascript
    mechanics: [
      {
        title: '용암 쇄도 중첩 관리',
        description: '용암 폭발 사용 시 용암 쇄도 중첩 획득 (최대 2중첩). 중첩당 다음 용암 폭발 피해 10% 증가',
        icon: '🔥',
        skills: [skillData.lavaBurst, skillData.primordialWave],
        priority: 'high',
        why: '용암 쇄도 2중첩을 유지하며 용암 폭발을 사용하는 것이 DPS 핵심'
      },
      {
        title: '화염 충격 유지',
        description: '대상에게 화염 충격 디버프 유지 (18초 지속). 용암 폭발 사용 조건',
        icon: '🔥',
        skills: [skillData.flameShock],
        priority: 'high',
        why: '화염 충격이 없으면 용암 폭발 사용 불가. 5.4초 이하일 때 재사용'
      },
      {
        title: '소용돌이 값 관리',
        description: '번개 화살/연쇄 번개로 소용돌이 값 생성. 60-100 사이에서 대지 충격/지진 사용',
        icon: '⚡',
        skills: [skillData.lightningBolt, skillData.chainLightning, skillData.earthShock],
        priority: 'medium',
        why: '소용돌이 값을 넘치지 않게 관리하면서 최대 피해 대지 충격 사용'
      },
      {
        title: '폭풍지기 버스트',
        description: '폭풍지기 사용 시 다음 2회 연쇄 번개가 즉시 시전 + 피해 150% 증가',
        icon: '⚡',
        skills: [skillData.stormkeeper, skillData.chainLightning],
        priority: 'high',
        why: '폭풍지기는 60초 쿨다운의 강력한 버스트 스킬. 3+ 적 상황에서 사용'
      },
      {
        title: '정령 쿨기 동기화',
        description: '불의 정령, 폭풍 정령 등 주요 쿨기를 동시에 사용하여 버스트 극대화',
        icon: '🔮',
        skills: [skillData.fireElemental, skillData.stormElemental],
        priority: 'medium',
        why: '쿨기 동기화 시 영웅의 피, 물약, 트린켓과 함께 사용하여 최대 DPS'
      }
    ]
```

**필드 설명**:
- `title`: 메커니즘 제목
- `description`: 간단한 설명 (1-2문장)
- `icon`: 이모지
- `skills`: 관련 스킬 배열
- `priority`: `'high'`, `'medium'`, `'low'`
- `why`: 왜 중요한지 설명

**메커니즘 개수**: 5-8개 권장

---

### Step 11.5: 리소스 시스템 변환 가이드 (매우 중요)

**⚠️ 이 단계를 놓치면**: 가이드 전체에서 "분노", "격노", "광란" 등 전사 리소스 용어가 남아 심각한 오류 발생

#### 11.5.1 리소스 변환이 필요한 이유

GuideTemplate.js는 **분노 전사** 기반이므로:
- **주 리소스**: 분노 (0-120)
- **핵심 버프**: 격노 (가속 25% + 피해 20% 증가)
- **소모 스킬**: 광란 (분노 80 소모)
- **생성 스킬**: 피의 갈증, 분노의 강타 등

이러한 리소스 관련 텍스트가 **약 150개 이상의 위치**에 퍼져 있습니다.

#### 11.5.2 주요 직업/전문화별 리소스 시스템

| 직업 | 전문화 | 주 리소스 | 부 리소스 | 핵심 버프/메커니즘 |
|------|--------|-----------|-----------|-------------------|
| **전사** (템플릿) | 분노 | 분노 (0-120) | - | 격노 (12초, 가속 25% + 피해 20%) |
| **마법사** | 비전 | 마나 (0-100%) | 비전 충전물 (0-4) | 번뜩임, 비전 충전물당 피해 +60% |
| **마법사** | 화염 | 마나 (0-100%) | 작열 (0-5 중첩) | 작열 중첩당 피해 증가 |
| **마법사** | 냉기 | 마나 (0-100%) | 얼음 창 (0-5개) | 두뇌 동결, 영구 동결 |
| **주술사** | 정기 | 마나 (0-100%) | 소용돌이 값 (0-100) | 용암 쇄도 (2중첩, 피해 +10%/중첩) |
| **주술사** | 고양 | 마나 (0-100%) | 소용돌이 값 (0-100) | 폭풍 강타 (10중첩) |
| **주술사** | 복원 | 마나 (0-100%) | - | 물의 파도 (3중첩) |
| **사냥꾼** | 야수 | 집중 (0-100) | - | 광기 (피해 +35%, 가속 +30%) |
| **사냥꾼** | 사격 | 집중 (0-100) | - | 정조준 (치명타 +100%), 속사 (가속 +40%) |
| **사냥꾼** | 생존 | 집중 (0-100) | - | 살무사의 독침 (3중첩) |
| **흑마법사** | 악마 | 마나 (0-100%) | 영혼의 조각 (0-5) | 악마의 핵 (5개 소모) |
| **흑마법사** | 고통 | 마나 (0-100%) | 영혼의 조각 (0-5) | 고통 증폭 |
| **흑마법사** | 파괴 | 마나 (0-100%) | 영혼의 조각 (0-5) | 황폐 (3개 소모) |
| **성기사** | 징벌 | 마나 (0-100%) | 신성한 힘 (0-5) | 징벌의 칼날 (30초 쿨다운) |
| **성기사** | 보호 | 마나 (0-100%) | - | 정의의 방패 (피해 감소) |
| **사제** | 암흑 | 마나 (0-100%) | 광기 (0-100) | 공허 형상 (15초, 피해 +10%) |
| **도적** | 암살 | 기력 (0-100) | 연계 점수 (0-7) | 독살 (피해 증폭) |
| **도적** | 무법 | 기력 (0-100) | 연계 점수 (0-7) | 칼날 폭풍 (12초, 공격 속도 +50%) |
| **죽음의 기사** | 혈기 | 룬 마력 (0-100) | 룬 (6개) | 피의 방패 (15초, 피해 흡수) |
| **죽음의 기사** | 냉기 | 룬 마력 (0-100) | 룬 (6개) | 극도로 차가운 겨울 (15초) |
| **수도사** | 운무 | 기력 (0-100) | 마나 (0-100%) | 천신의 기운 (25초) |
| **수도사** | 풍운 | 기력 (0-100) | 기 (0-6) | 연계 점수 시스템 |
| **드루이드** | 조화 | 마나 (0-100%) | 성력/월력 (0-100) | 일식/월식 |
| **드루이드** | 야성 | 기력 (0-100) | 연계 점수 (0-5) | 광포 (15초, 피해 +15%) |
| **악마사냥꾼** | 파멸 | 고통 (0-120) | - | 탈태 (6초, 가속 +30%) |
| **기원사** | 황폐 | 정수 (0-5) | - | 폭발 (피해 증폭) |

#### 11.5.3 리소스 변환 체크리스트

**전체 파일에서 변경해야 할 위치** (총 150+ 곳):

1. **핵심 메커니즘 섹션** (Line 534-817)
   - `title: '격노 버프 유지'` → 새 리소스 버프로 변경
   - `description` 내 "분노", "격노" 텍스트
   - `why` 필드 내 리소스 관련 설명

2. **영웅 특성 딜링 메커니즘** (Line 1513-1661, ~150줄)
   - "분노 80 이상 확보" → 새 리소스 조건
   - "격노 버프 유지" → 새 버프/메커니즘
   - "광란 사용" → 새 소모 스킬

3. **심화 분석 섹션** (Line 1939-2800, ~800줄)
   - "격노 버프 유지율 극대화" → 새 메커니즘
   - "분노 관리 전략" → 새 리소스 관리
   - 리소스 게이지 시각화 코드 (Line 2062-2260)
   - 스탯 우선순위 텍스트 내 리소스 언급

4. **오프닝 시퀀스** (Line 291-301, 364-372 등)
   - "분노 80 이상 확보 후 사용" → 새 리소스 조건
   - "격노 미발동 시" → 새 조건

5. **우선순위 시스템** (Line 302-362 등)
   - `conditions` 필드: "분노 80 이상", "격노 버프 없음"
   - `why` 필드: "격노 버프 유지가 최우선"

6. **스킬 데이터 매핑** (Line 1096-1114)
   - 전사 스킬 변수명 → 새 전문화 스킬
   - `'분노의 강타': skillData.ragingBlow` → 제거

#### 11.5.4 구체적인 변환 예시

**예시 1: 비전 마법사 (Arcane Mage) 변환**

| 전사 (템플릿) | 비전 마법사 | 설명 |
|--------------|------------|------|
| "분노 80 이상 확보" | "마나 70% 이상 유지" | 리소스 조건 |
| "격노 버프 유지 (90%+)" | "번뜩임 버프 활용" | 핵심 버프 |
| "광란 사용 (분노 80 소모)" | "비전 탄막 사용 (비전 충전물 소모)" | 소모 스킬 |
| "피의 갈증 또는 분노의 강타 치명타 시 격노 발동" | "비전 작렬 시전 시 비전 충전물 생성" | 생성 메커니즘 |
| "격노 지속시간 12초" | "번뜩임 지속시간 15초" | 버프 지속시간 |
| "분노 0-120" | "마나 0-100%, 비전 충전물 0-4" | 리소스 범위 |

**예시 2: 정기 주술사 (Elemental Shaman) 변환**

| 전사 (템플릿) | 정기 주술사 | 설명 |
|--------------|------------|------|
| "분노 80 이상 확보" | "소용돌이 값 60 이상" | 리소스 조건 |
| "격노 버프 유지 (90%+)" | "용암 쇄도 중첩 관리" | 핵심 메커니즘 |
| "광란 사용 (분노 80 소모)" | "대지 충격 사용 (소용돌이 값 60 소모)" | 소모 스킬 |
| "피의 갈증으로 분노 생성" | "번개 화살로 소용돌이 값 생성" | 생성 스킬 |
| "격노 지속시간 12초" | "용암 쇄도 지속시간 15초" | 버프/중첩 시간 |
| "분노 0-120" | "소용돌이 값 0-100, 마나 0-100%" | 리소스 범위 |

**예시 3: 야수 사냥꾼 (Beast Mastery Hunter) 변환**

| 전사 (템플릿) | 야수 사냥꾼 | 설명 |
|--------------|------------|------|
| "분노 80 이상 확보" | "집중 60 이상 유지" | 리소스 조건 |
| "격노 버프 유지 (90%+)" | "광기 버프 유지 (피해 +35%)" | 핵심 버프 |
| "광란 사용 (분노 80 소모)" | "야수 몰이 사용 (집중 90 소모)" | 소모 스킬 |
| "피의 갈증으로 분노 생성" | "코브라 사격으로 집중 생성" | 생성 스킬 |
| "격노 지속시간 12초" | "광기 지속시간 8초" | 버프 지속시간 |
| "분노 0-120" | "집중 0-100" | 리소스 범위 |

#### 11.5.5 리소스 게이지 시각화 변환

**변경 위치**: Line 2062-2260 (약 200줄)

**전사 분노 게이지 (0-120)**:
```javascript
{/* 분노 게이지 시각화 */}
📊 분노 게이지 관리
[=========|=========|=========]
0       40       80      120
위험    이상적   광란준비  즉시사용
```

**비전 마법사 마나 게이지 (0-100%)**:
```javascript
{/* 마나 게이지 시각화 */}
📊 마나 관리
[=========|=========|=========]
0%      30%      60%     100%
위험    환기필요  안전     최적
```

**정기 주술사 소용돌이 값 게이지 (0-100)**:
```javascript
{/* 소용돌이 값 게이지 시각화 */}
📊 소용돌이 값 관리
[=========|=========|=========]
0       40       60      100
부족    생성중   사용가능  낭비방지
```

#### 11.5.6 검증 방법

**전사 리소스 용어가 남아있는지 확인**:
```bash
# 분노, 격노, 광란 등 전사 리소스 용어 검색
grep -i "분노\|격노\|광란" src/components/ArcaneMageGuide.js

# 출력 없음 = 성공
# 출력 있음 = 아직 변환되지 않은 부분 존재
```

**새 리소스 용어가 올바르게 적용되었는지 확인**:
```bash
# 비전 마법사 예시
grep -i "마나\|비전 충전물\|번뜩임" src/components/ArcaneMageGuide.js | wc -l

# 50+ 개 이상 = 올바르게 변환됨
# 0-10개 = 변환 누락 가능성
```

---

### Step 12: 개요 텍스트 변경

#### 12.1 위치 (Line 1390-1510)

**검색 키워드**:
```bash
grep -n "분노 전사 개요" src/components/ElementalShamanGuide.js
```

**변경 전**:
```javascript
        <div className={styles.subsection} ref={subSectionRefs['overview-intro']}>
          <h3 className={styles.subsectionTitle}>분노 전사 개요</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            분노 전사는 <strong style={{ color: '#C69B6D' }}>양손 무기를 휘둘러 폭발적인 피해를 입히는</strong> 근접 DPS 전문화입니다.
            TWW 시즌3에서는 <span style={{ color: '#FF6B6B', fontWeight: 'bold' }}>학살자</span>와
            <span style={{ color: '#4ECDC4', fontWeight: 'bold' }}>산왕</span> 영웅특성이 모두 강력하며,
            단일 대상에서는 학살자가, 광역 딜에서는 산왕이 우수한 성능을 보입니다.
          </p>
```

**변경 후** (정기 주술사 예시):
```javascript
        <div className={styles.subsection} ref={subSectionRefs['overview-intro']}>
          <h3 className={styles.subsectionTitle}>정기 주술사 개요</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            정기 주술사는 <strong style={{ color: '#0070DE' }}>번개와 용암의 힘을 다루는</strong> 원거리 마법 DPS 전문화입니다.
            TWW 시즌3에서는 <span style={{ color: '#64c8ff', fontWeight: 'bold' }}>선견자</span>와
            <span style={{ color: '#ffa500', fontWeight: 'bold' }}>폭풍인도자</span> 영웅특성이 모두 강력하며,
            단일 대상에서는 선견자가, 광역 딜에서는 폭풍인도자가 우수한 성능을 보입니다.
          </p>
```

**중요**:
- `color` 속성도 새 직업 색상으로 변경
- 클래스 특성을 정확히 설명 (근접/원거리, 물리/마법, 탱커/힐러/DPS)

#### 12.2 딜링 메커니즘 텍스트 (Line 1397-1510)

**검색 키워드**:
```bash
grep -n "딜링 메커니즘" src/components/ElementalShamanGuide.js
```

**변경 전**:
```javascript
          <h3 className={styles.subsectionTitle} style={{ marginTop: '30px' }}>딜링 메커니즘</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            분노 전사는 <strong style={{ color: '#C69B6D' }}>분노 자원을 생성하고 소모하는</strong> 메커니즘을 가지고 있습니다.
            // ... 4-5문단
          </p>
```

**변경 후** (정기 주술사 예시):
```javascript
          <h3 className={styles.subsectionTitle} style={{ marginTop: '30px' }}>딜링 메커니즘</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            정기 주술사는 <strong style={{ color: '#0070DE' }}>소용돌이 값을 생성하고 소모하는</strong> 메커니즘을 가지고 있습니다.
            번개 화살과 연쇄 번개로 소용돌이 값을 생성하고, 60-100 사이에서 대지 충격이나 지진으로 소모합니다.
          </p>

          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            핵심 메커니즘은 <strong>용암 쇄도 중첩 관리</strong>입니다.
            용암 폭발 사용 시 용암 쇄도 중첩을 획득하고 (최대 2중첩), 중첩당 다음 용암 폭발 피해가 10% 증가합니다.
            2중첩을 유지하며 용암 폭발을 사용하는 것이 DPS의 핵심입니다.
          </p>

          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            영웅특성 <strong style={{ color: '#64c8ff' }}>선견자</strong>는 태고의 파도를 통해
            용암 쇄도 중첩을 빠르게 쌓고 즉시 용암 폭발을 발동시키는 특화된 플레이를 제공합니다.
            반면 <strong style={{ color: '#ffa500' }}>폭풍인도자</strong>는 폭풍지기와 연쇄 번개를 활용한
            광역 딜에 특화되어 있습니다.
          </p>
```

**길이**: 3-5문단 권장

---

### Step 13: 심화 분석 섹션 변경 (가장 중요, ~800줄)

**⚠️ 이 섹션이 가장 중요합니다**: 약 800줄의 상세 분석 콘텐츠 (영웅 특성당 10-20개 섹션)

**⚠️ 놓치면**: 가이드의 핵심 가치가 사라짐. 심화 분석이 전사 내용으로 남으면 사용자에게 잘못된 정보 제공

#### 13.1 위치 (Line 2012-2800, ~800줄)

**검색 키워드**:
```bash
grep -n "심화 분석" src/components/ElementalShamanGuide.js
```

**중요도**:
- **작업량**: 전체 가이드 작업의 약 40-50%
- **소요 시간**: 1-2시간 (가장 오래 걸림)
- **가치**: 가이드의 핵심 차별화 요소

**구조**:
```javascript
{/* 심화 분석 섹션 추가 */}
<div className={styles.subsection} style={{ /* ... */ }}>
  <h3 className={styles.subsectionTitle}>심화 분석</h3>

  {selectedTier === 'farseer' ? (  // ⚠️ 영웅 특성 키 확인
    <>
      {/* 5-10개의 심화 분석 섹션 */}
      <div style={{ marginBottom: '25px' }}>
        <h4 style={{ color: '#ff6b6b', fontSize: '1.1rem', marginBottom: '15px' }}>
          ⚡ 제목
        </h4>
        <ul style={{ lineHeight: '1.8' }}>
          <li>내용...</li>
        </ul>
      </div>
    </>
  ) : (
    // 영웅 특성 2 심화 분석
  )}
</div>
```

#### 13.2 심화 분석 섹션 템플릿

**각 섹션 구조**:
```javascript
<div style={{ marginBottom: '25px' }}>
  <h4 style={{ color: '#색상코드', fontSize: '1.1rem', marginBottom: '15px' }}>
    이모지 섹션 제목
  </h4>
  <ul style={{ lineHeight: '1.8' }}>
    <li>
      <strong style={{ color: '#ffa500' }}>소제목:</strong> 설명
    </li>
    <li>
      <strong>트리거 스킬:</strong> <SkillIcon skill={skillData.XXX} textOnly={true} /> 설명
    </li>
    {/* 5-10개 항목 */}
  </ul>
</div>
```

#### 12.3 예시 (정기 주술사 - 선견자)

```javascript
{selectedTier === 'farseer' ? (
  <>
    <div style={{ marginBottom: '25px' }}>
      <h4 style={{ color: '#ff6b6b', fontSize: '1.1rem', marginBottom: '15px' }}>
        ⚡ 용암 쇄도 중첩 관리 (선견자 핵심)
      </h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li>
          <strong style={{ color: '#ffa500' }}>중첩 획득:</strong> <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 사용 시 1중첩 (최대 2중첩)
        </li>
        <li>
          <strong>피해 증가:</strong> 중첩당 다음 <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 피해 10% 증가
        </li>
        <li>
          <strong style={{ color: '#ff6b6b' }}>핵심 원칙:</strong> 항상 2중첩을 유지한 상태에서 <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 사용
        </li>
        <li>
          <strong>태고의 파도 연계:</strong> <SkillIcon skill={skillData.primordialWave} textOnly={true} /> 사용 시 즉시 2중첩 획득 + <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 발동
        </li>
        <li>
          <strong style={{ color: '#FFD700' }}>티어 2세트:</strong> <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 사용 시 20% 확률로 추가 중첩 획득
        </li>
      </ul>
    </div>

    <div style={{ marginBottom: '25px' }}>
      <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
        🔥 화염 충격 관리
      </h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li>
          <strong style={{ color: '#ffa500' }}>지속시간:</strong> 18초 (용암 폭발 사용 조건)
        </li>
        <li>
          <strong>갱신 타이밍:</strong> 5.4초 이하일 때 재사용 (팬데믹 구간)
        </li>
        <li>
          <strong style={{ color: '#ff6b6b' }}>최우선 규칙:</strong> <SkillIcon skill={skillData.flameShock} textOnly={true} /> 없으면 <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 사용 불가
        </li>
        <li>
          <strong>이동 활용:</strong> 즉시 시전 스킬이므로 이동 중 재사용 가능
        </li>
      </ul>
    </div>

    <div style={{ marginBottom: '25px' }}>
      <h4 style={{ color: '#28a745', fontSize: '1.1rem', marginBottom: '15px' }}>
        💥 소용돌이 값 관리 전략
      </h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li>
          <strong>생성:</strong> <SkillIcon skill={skillData.lightningBolt} textOnly={true} /> (8 생성) 또는 <SkillIcon skill={skillData.chainLightning} textOnly={true} /> (4-6 생성)
        </li>
        <li>
          <strong style={{ color: '#ffa500' }}>최대치:</strong> 소용돌이 값 100 (넘치면 낭비)
        </li>
        <li>
          <strong style={{ color: '#ff6b6b' }}>사용 타이밍:</strong> 60-80 구간에서 <SkillIcon skill={skillData.earthShock} textOnly={true} /> 또는 <SkillIcon skill={skillData.earthquake} textOnly={true} /> 사용
        </li>
        <li>
          <strong>광역 상황:</strong> 5+ 적일 때 <SkillIcon skill={skillData.earthquake} textOnly={true} />가 <SkillIcon skill={skillData.earthShock} textOnly={true} />보다 효율적
        </li>
      </ul>
    </div>

    <div style={{ marginBottom: '25px' }}>
      <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
        ⚔️ 태고의 파도 최적화
      </h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li>
          <strong>쿨다운:</strong> 30초 (선견자 핵심 스킬)
        </li>
        <li>
          <strong style={{ color: '#ffa500' }}>효과:</strong> <SkillIcon skill={skillData.flameShock} textOnly={true} /> 확산 + 즉시 <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 발동 + 용암 쇄도 2중첩
        </li>
        <li>
          <strong style={{ color: '#ff6b6b' }}>최우선 사용:</strong> 쿨다운 돌 때마다 즉시 사용 (DPS 손실 최소화)
        </li>
        <li>
          <strong>버스트 타이밍:</strong> <SkillIcon skill={skillData.fireElemental} textOnly={true} />와 동기화하여 사용
        </li>
      </ul>
    </div>

    <div style={{ marginBottom: '25px' }}>
      <h4 style={{ color: '#9b59b6', fontSize: '1.1rem', marginBottom: '15px' }}>
        🔥 쿨기 동기화 최적화
      </h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li>
          <strong style={{ color: '#ffa500' }}>표준 버스트:</strong> <SkillIcon skill={skillData.fireElemental} textOnly={true} /> + <SkillIcon skill={skillData.primordialWave} textOnly={true} /> + <SkillIcon skill={skillData.stormkeeper} textOnly={true} /> 동시 사용
        </li>
        <li>
          <strong>쿨기 지속시간:</strong> 불의 정령 30초 / 태고의 파도 즉발 / 폭풍지기 15초
        </li>
        <li>
          <strong>버스트 중 우선순위:</strong> <SkillIcon skill={skillData.primordialWave} textOnly={true} /> → <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> × 2 → <SkillIcon skill={skillData.elementalBlast} textOnly={true} />
        </li>
        <li>
          <strong>티어 4세트:</strong> <SkillIcon skill={skillData.lightningBolt} textOnly={true} /> 전기불꽃 DoT 유지
        </li>
      </ul>
    </div>

    {/* 5-10개 섹션 권장 */}
  </>
) : (
  // 영웅 특성 2 (폭풍인도자) 심화 분석
  <>
    <div style={{ marginBottom: '25px' }}>
      <h4 style={{ color: '#ff6b6b', fontSize: '1.1rem', marginBottom: '15px' }}>
        ⚡ 폭풍지기 극대화 (폭풍인도자 핵심)
      </h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li>
          <strong style={{ color: '#ffa500' }}>효과:</strong> 다음 2회 <SkillIcon skill={skillData.chainLightning} textOnly={true} /> 즉시 시전 + 피해 150% 증가
        </li>
        <li>
          <strong>쿨다운:</strong> 60초 (주요 버스트 스킬)
        </li>
        <li>
          <strong style={{ color: '#ff6b6b' }}>사용 타이밍:</strong> 3+ 적 상황에서만 사용
        </li>
        <li>
          <strong>동기화:</strong> <SkillIcon skill={skillData.stormElemental} textOnly={true} />와 함께 사용하여 극대화
        </li>
      </ul>
    </div>

    {/* ... 폭풍인도자 추가 섹션 4-9개 */}
  </>
)}
```

**섹션 개수**:
- 최소: 5개/영웅특성
- 권장: 7-10개/영웅특성
- 원본(분노 전사): 17개 (학살자) + 15개 (산왕)

**색상 가이드**:
- `#ff6b6b`: 빨간색 (최우선, 위험)
- `#dc3545`: 진한 빨간색 (중요)
- `#28a745`: 초록색 (긍정적)
- `#17a2b8`: 청록색 (정보)
- `#9b59b6`: 보라색 (특수)
- `#ff9800`: 주황색 (경고)
- `#ffa500`: 주황색 (강조)
- `#FFD700`: 금색 (최고 등급)

---

### Step 14: 스탯 우선순위 변경

#### 14.1 위치 (Line 3417-3430)

**검색 키워드**:
```bash
grep -n "const statPriorities" src/components/ElementalShamanGuide.js
```

**변경 전**:
```javascript
    const statPriorities = {
      slayer: {
        single: ['weaponDamage', 'haste', 'mastery', 'crit', 'versatility'],
        aoe: ['weaponDamage', 'haste', 'crit', 'mastery', 'versatility']
      },
      mountainThane: {
        single: ['weaponDamage', 'haste', 'crit', 'mastery', 'versatility'],
        aoe: ['weaponDamage', 'haste', 'mastery', 'crit', 'versatility']
      }
    };
```

**변경 후** (정기 주술사 예시):
```javascript
    const statPriorities = {
      farseer: {  // ⚠️ 영웅 특성 키 확인
        single: ['intellect', 'haste', 'crit', 'mastery', 'versatility'],
        aoe: ['intellect', 'haste', 'mastery', 'crit', 'versatility']
      },
      stormbringer: {
        single: ['intellect', 'haste', 'versatility', 'crit', 'mastery'],
        aoe: ['intellect', 'haste', 'crit', 'versatility', 'mastery']
      }
    };
```

**스탯 키 목록**:
- **물리 DPS**: `weaponDamage`, `strength`, `agility`
- **캐스터 DPS**: `intellect`, `spellPower`
- **탱커**: `stamina`, `armor`
- **공통**: `haste`, `crit`, `mastery`, `versatility`

**데이터 소스**:
1. Icy-veins 가이드 "Stats Priority" 섹션
2. Wowhead 가이드 "Best Stats" 섹션
3. Raidbots 시뮬레이션 결과

**⚠️ 주의**: v2.0 템플릿에서는 SimC 탭이 제거되었습니다. 대신 스탯 우선순위 탭 하단에 Raidbots 링크가 통합되었습니다.

---

### 🔔 토스트 알림 시스템 (v2.0 신규)

#### 배경
v1.0 템플릿에서는 빌드 복사 버튼을 누를 때 "복사되었습니다" 토스트와 "가이드가 업데이트되었습니다!" 토스트가 동시에 표시되는 버그가 있었습니다.

#### 해결 방법: 상태 분리

**상태 선언** (Line ~1194):
```javascript
const [showToast, setShowToast] = useState(false);        // 가이드 업데이트 알림
const [showCopyToast, setShowCopyToast] = useState(false); // 빌드 복사 알림
```

**복사 핸들러** (Line ~2631):
```javascript
const handleCopyBuild = (code) => {
  navigator.clipboard.writeText(code);
  setShowCopyToast(true);  // ✅ showCopyToast 사용
  setTimeout(() => setShowCopyToast(false), 3000);
};
```

**토스트 렌더링** (Line ~2644):
```javascript
{/* 빌드 복사 토스트 */}
{showCopyToast && (  // ✅ showCopyToast 사용
  <div style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    padding: '15px 20px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: 10000
  }}>
    <span style={{ fontSize: '1.5rem' }}>✅</span>
    <div>
      <div style={{ color: '#AAD372', fontWeight: 'bold' }}>복사되었습니다</div>
      <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
        특성 창에서 가져오기 버튼을 누르고 붙여넣으세요.
      </div>
    </div>
  </div>
)}

{/* 가이드 업데이트 토스트 */}
{showToast && (  // ✅ showToast 사용
  <div style={{ /* 페이지 상단 토스트 스타일 */ }}>
    가이드가 업데이트되었습니다!
  </div>
)}
```

**핵심 포인트**:
- `showToast`: 가이드 업데이트/변경 시에만 사용
- `showCopyToast`: 빌드 복사 시에만 사용
- 각 토스트는 독립적으로 표시/숨김 처리

---

### 📊 스탯 섹션 구조 (v2.0 변경)

#### v1.0 구조 (FuryWarrior 기반)
```
<Tabs>
  <Tab id="stats-priority">스탯 우선순위</Tab>
  <Tab id="stats-simc">SimC 스트링</Tab>  ← 제거됨
</Tabs>

<TabPanel id="stats-priority">
  <!-- 스탯 우선순위 표 -->
</TabPanel>

<TabPanel id="stats-simc">
  <!-- SimC 설정 가이드 (133줄) -->  ← 제거됨
</TabPanel>
```

#### v2.0 구조 (ArcaneMage 기반)
```
<Tabs>
  <Tab id="stats-priority">스탯 우선순위</Tab>
  <!-- SimC 탭 제거 -->
</Tabs>

<TabPanel id="stats-priority">
  <!-- 스탯 우선순위 표 -->

  {/* Raidbots 링크 (SimC 대체) */}
  <div style={{
    background: 'linear-gradient(135deg, rgba(170, 211, 114, 0.1) 0%, transparent 100%)',
    border: '1px solid #AAD372',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    marginTop: '30px'
  }}>
    <p style={{ color: '#cbd5e1', marginBottom: '15px' }}>
      정확한 스탯 가중치를 알고 싶다면 Raidbots에서 시뮬레이션을 돌려보세요
    </p>
    <a href="https://www.raidbots.com/simbot"
       target="_blank"
       rel="noopener noreferrer"
       style={{
         color: '#AAD372',
         textDecoration: 'none',
         fontSize: '1.1rem',
         fontWeight: 'bold'
       }}>
      Raidbots에서 시뮬레이션하기 →
    </a>
  </div>
</TabPanel>
```

#### 변경 이유
1. **사용성 개선**: SimC 설정이 일반 유저에게 너무 복잡함
2. **대안 제공**: Raidbots 링크로 간단한 시뮬레이션 유도
3. **번들 크기 감소**: -661 B (SimC 탭 제거)

#### 새 가이드 작성 시 주의사항
- ❌ `stats-simc` ref 생성 금지
- ❌ SimC 관련 TabPanel 생성 금지
- ✅ 스탯 우선순위 탭 하단에 Raidbots 링크 포함
- ✅ 클래스 색상에 맞게 `#AAD372` 교체

---

### Step 15: App.js 라우팅 추가

#### 15.1 위치: `src/App.js`

**검색 키워드**:
```bash
grep -n "import.*Guide" src/App.js | head -10
```

**추가할 코드**:

**Import 섹션** (파일 상단):
```javascript
import ElementalShamanGuide from './components/ElementalShamanGuide';
```

**Routes 섹션** (기존 Route들 사이):
```javascript
<Route path="/guide/shaman/elemental" element={<ElementalShamanGuide />} />
```

**경로 규칙**:
- 형식: `/guide/{class}/{spec}`
- 소문자, 하이픈으로 단어 연결
- 예시:
  - `/guide/shaman/elemental`
  - `/guide/shaman/enhancement`
  - `/guide/shaman/restoration`
  - `/guide/mage/arcane`
  - `/guide/mage/fire`
  - `/guide/mage/frost`

**검증**:
```bash
grep "ElementalShamanGuide" src/App.js
# 출력: import와 Route 2개 라인
```

---

### Step 16: 빌드 및 검증

#### 16.1 빌드 테스트

```bash
cd wow-meta-site
npm run build
```

**성공 조건**:
- 컴파일 에러 0개
- 경고 0개 (또는 스킬 관련 경고만)

**실패 시 디버깅**:
```bash
# 에러 메시지에서 라인 번호 확인
# 주요 원인:
# 1. skillData.XXX 변수명 오타
# 2. 영웅 특성 키 불일치 (slayer vs farseer)
# 3. 색상 코드 형식 오류 (# 빠짐)
```

#### 16.2 개발 서버 실행

```bash
npm start
```

브라우저에서 `http://localhost:3002/guide/shaman/elemental` 접속

#### 16.3 시각적 검증 체크리스트

- [ ] **색상**: 주술사 파란색(`#0070DE`)으로 표시
- [ ] **영웅 특성 탭**: 2개 탭 (선견자, 폭풍인도자) 정상 표시
- [ ] **스킬 아이콘**: 모든 스킬 아이콘 정상 표시 (404 에러 없음)
- [ ] **툴팁**: 스킬 아이콘에 마우스 오버 시 툴팁 표시
- [ ] **네비게이션**: 왼쪽 사이드바 스크롤 연동 작동
- [ ] **빌드 복사**: 빌드 코드 복사 버튼 작동
- [ ] **탭 전환**: 영웅 특성, 단일/광역, 스탯 탭 전환 작동
- [ ] **심화 분석**: 모든 섹션 정상 표시
- [ ] **모바일 반응형**: 화면 축소 시 레이아웃 정상

#### 16.4 코드 검증

```bash
# 전사 관련 텍스트 남아있는지 확인
grep -i "전사\|warrior\|slayer\|mountainThane\|분노\|bloodthirst\|rampage" src/components/ElementalShamanGuide.js

# 출력 없음 = 성공
# 출력 있음 = 아직 안 바뀐 부분 있음
```

```bash
# 색상 검증
grep "#C69B6D\|198, 156, 109" src/components/ElementalShamanGuide.js

# 출력 없음 = 성공
```

```bash
# 영웅 특성 키 검증
grep "slayer\|mountainThane" src/components/ElementalShamanGuide.js

# 출력 없음 = 성공
```

---

## 🎨 고급 기법: 시각자료 추가

### 개요

복잡한 메커니즘이나 리소스 관리를 **시각적으로** 표현하면 사용자 이해도가 크게 향상됩니다.
이 섹션에서는 가이드에 추가할 수 있는 시각자료 종류와 구현 방법을 설명합니다.

---

### 시각자료 종류 및 사용 시기

| 시각자료 | 사용 시기 | 예시 | 난이도 |
|---------|----------|------|--------|
| **게이지/프로그레스 바** | 리소스 관리 (분노, 마나, 충전물) | 분노 게이지 (0-120), 비전 충전물 (0-4) | 쉬움 |
| **타임라인** | 버스트 시퀀스, 쿨기 타이밍 | 10초 버스트 윈도우 타임라인 | 보통 |
| **비교 표** | 영웅 특성별 차이, 빌드 비교 | 성난태양 vs 주문술사 DPS 비교 | 쉬움 |
| **플로우차트** | 우선순위 결정 트리 | "비전 충전물 4개? → 예/아니오" | 어려움 |
| **아이콘 그리드** | 스킬 조합, 특성 세트 | 쿨기 스킬 6개 그리드 | 쉬움 |

**추가 기준**:
- ✅ 텍스트만으로 설명하기 어려운 복잡한 메커니즘
- ✅ 수치 범위가 중요한 리소스 관리
- ✅ 시간 순서가 중요한 시퀀스
- ❌ 간단한 설명으로 충분한 내용 (과도한 시각화 지양)

---

### 방법 1: 순수 CSS/HTML (게이지 바)

**장점**: 빠르고 가벼움, 스타일 완전 제어, MCP 없이 즉시 구현
**단점**: 복잡한 차트/그래프는 코드가 길어짐

#### 예시 1: 리소스 게이지 (분노 0-120)

FuryWarriorGuide.js의 분노 게이지 코드 (Line 2135-2260):

```javascript
{/* 분노 게이지 시각화 */}
<div style={{
  background: 'rgba(0, 0, 0, 0.4)',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '15px',
  border: `1px solid rgba(${rgbValues}, 0.3)` // primaryColor RGB
}}>
  <p style={{ fontSize: '0.9rem', color: primaryColor, marginBottom: '12px', fontWeight: 'bold' }}>
    📊 분노 게이지 관리
  </p>

  {/* 게이지 바 */}
  <div style={{
    position: 'relative',
    height: '40px',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '20px',
    overflow: 'hidden',
    border: `2px solid rgba(${rgbValues}, 0.5)`,
    marginBottom: '15px'
  }}>
    {/* 위험 구간 (0-40) - 빨간색 */}
    <div style={{
      position: 'absolute',
      left: '0',
      top: '0',
      bottom: '0',
      width: '33.3%', // 40/120 = 33.3%
      background: 'linear-gradient(90deg, rgba(220, 53, 69, 0.3), rgba(220, 53, 69, 0.2))'
    }} />

    {/* 안전 구간 (40-80) - 초록색/노란색 */}
    <div style={{
      position: 'absolute',
      left: '33.3%',
      top: '0',
      bottom: '0',
      width: '33.4%', // (80-40)/120 = 33.4%
      background: 'linear-gradient(90deg, rgba(40, 167, 69, 0.4), rgba(255, 193, 7, 0.3))'
    }} />

    {/* 광란 사용 (80-120) - 주황색 */}
    <div style={{
      position: 'absolute',
      left: '66.7%',
      top: '0',
      bottom: '0',
      width: '33.3%',
      background: 'linear-gradient(90deg, rgba(255, 165, 0, 0.4), rgba(255, 107, 107, 0.4))'
    }} />

    {/* 구간 표시선 (수직선) */}
    <div style={{ position: 'absolute', left: '33.3%', top: '0', bottom: '0', width: '2px', background: '#dc3545' }} />
    <div style={{ position: 'absolute', left: '66.7%', top: '0', bottom: '0', width: '2px', background: '#ffc107' }} />

    {/* 수치 표시 */}
    <div style={{
      position: 'absolute',
      left: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 10px',
      fontSize: '0.75rem',
      fontWeight: 'bold'
    }}>
      <span style={{ color: '#dc3545' }}>0</span>
      <span style={{ color: '#28a745' }}>40</span>
      <span style={{ color: '#ffc107' }}>80</span>
      <span style={{ color: '#ffa500' }}>120</span>
    </div>
  </div>

  {/* 구간별 설명 */}
  <div style={{ fontSize: '0.85rem', lineHeight: '1.8', color: '#ccc' }}>
    <div style={{ marginBottom: '8px' }}>
      <strong style={{ color: '#dc3545' }}>0-40:</strong> <span style={{ color: '#ccc' }}>위험 (격노 끊김)</span>
    </div>
    <div style={{ marginBottom: '8px' }}>
      <strong style={{ color: '#28a745' }}>40-60:</strong> <span style={{ color: '#ccc' }}>이상적</span>
    </div>
    <div style={{ marginBottom: '8px' }}>
      <strong style={{ color: '#ffc107' }}>60-80:</strong> <span style={{ color: '#ccc' }}>광란 준비</span>
    </div>
    <div>
      <strong style={{ color: '#ffa500' }}>80-120:</strong> <span style={{ color: '#ccc' }}>즉시 광란 사용</span>
    </div>
  </div>
</div>
```

**비전 마법사 버전 예시 (마나 게이지 0-100%)**:
```javascript
{/* 마나 게이지 시각화 */}
<div style={{
  background: 'rgba(0, 0, 0, 0.4)',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid rgba(63, 198, 234, 0.3)' // #3FC6EA
}}>
  <p style={{ color: '#3FC6EA', fontWeight: 'bold' }}>📊 마나 관리</p>

  <div style={{
    position: 'relative',
    height: '40px',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '20px',
    border: '2px solid rgba(63, 198, 234, 0.5)'
  }}>
    {/* 위험 구간 (0-30%) */}
    <div style={{ position: 'absolute', left: '0', width: '30%', top: '0', bottom: '0',
      background: 'linear-gradient(90deg, rgba(220, 53, 69, 0.3), rgba(220, 53, 69, 0.2))' }} />

    {/* 환기 필요 (30-60%) */}
    <div style={{ position: 'absolute', left: '30%', width: '30%', top: '0', bottom: '0',
      background: 'linear-gradient(90deg, rgba(255, 193, 7, 0.3), rgba(255, 193, 7, 0.2))' }} />

    {/* 안전 구간 (60-100%) */}
    <div style={{ position: 'absolute', left: '60%', width: '40%', top: '0', bottom: '0',
      background: 'linear-gradient(90deg, rgba(63, 198, 234, 0.4), rgba(63, 198, 234, 0.3))' }} />
  </div>
</div>
```

#### 예시 2: 비전 충전물 시각화 (0-4)

```javascript
{/* 비전 충전물 (Arcane Charges) 시각화 */}
<div style={{ marginBottom: '20px' }}>
  <p style={{ color: '#3FC6EA', fontWeight: 'bold', marginBottom: '10px' }}>
    🔮 비전 충전물 (Arcane Charges)
  </p>

  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
    {[1, 2, 3, 4].map(charge => (
      <div key={charge} style={{
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3FC6EA 0%, #2a9cc4 100%)',
        border: '3px solid #3FC6EA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#fff',
        boxShadow: '0 0 20px rgba(63, 198, 234, 0.5)'
      }}>
        {charge}
      </div>
    ))}
  </div>

  <p style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '10px', textAlign: 'center' }}>
    충전물당: 피해 +60%, 마나 +100%, 시전 시간 -8%
  </p>
</div>
```

---

### 방법 2: MCP Magic 사용 (복잡한 시각자료)

**장점**: 복잡한 표/차트/플로우차트 빠르게 생성, 인터랙티브 가능
**단점**: MCP 호출 필요, 생성된 코드 통합 필요

#### 사용 시기

- ✅ 복잡한 비교 표 (5개 이상 항목, 3개 이상 열)
- ✅ 플로우차트/결정 트리
- ✅ 인터랙티브 컴포넌트 (토글, 슬라이더)
- ✅ 복잡한 타임라인/간트 차트

#### MCP Magic 호출 방법

**1단계: 요청 작성**

요청 시 **반드시 포함**해야 할 정보:
- 컴포넌트 목적 (비교 표, 플로우차트 등)
- 데이터 내용 (영웅 특성명, 수치 등)
- 색상 (`${primaryColor}` 또는 구체적 Hex)
- 스타일 요구사항 (가독성, 반응형 등)

**예시 1: 영웅 특성 비교 표**

```
"비전 마법사의 영웅 특성 '성난태양'과 '주문술사'를 비교하는 표를 만들어줘.

비교 항목:
- 단일 대상 DPS: 성난태양 (높음), 주문술사 (보통)
- 광역 DPS: 성난태양 (보통), 주문술사 (높음)
- 난이도: 성난태양 (어려움), 주문술사 (쉬움)
- 마나 효율: 성난태양 (낮음), 주문술사 (높음)
- 버스트: 성난태양 (매우 높음), 주문술사 (높음)

색상은 #3FC6EA 사용하고, 가독성 좋게 만들어줘.
React styled-components 형식으로."
```

**예시 2: 우선순위 플로우차트**

```
"비전 마법사 단일 대상 우선순위를 결정하는 플로우차트를 만들어줘.

흐름:
1. 비전 충전물 4개?
   - 예 → 통찰력 있음? → 예 → 비전 탄막
   - 예 → 통찰력 없음? → 예 → 비전 보주
   - 아니오 → 비전 작렬

색상 #3FC6EA 사용, 간결하게."
```

**2단계: 생성된 코드 통합**

MCP Magic이 반환한 컴포넌트를:
1. `src/components/` 폴더에 별도 파일로 저장 (예: `ArcanePriorityChart.js`)
2. 가이드 파일에서 import:
   ```javascript
   import ArcanePriorityChart from './ArcanePriorityChart';
   ```
3. 적절한 위치에 삽입:
   ```javascript
   <ArcanePriorityChart primaryColor="#3FC6EA" />
   ```

**3단계: 스타일 일관성 확인**

생성된 컴포넌트가 가이드 전체 스타일과 일치하는지 확인:
- primaryColor prop 전달
- 폰트 크기/색상 일관성
- 반응형 디자인 (`@media` 쿼리)

---

### 베스트 프랙티스

#### ✅ 좋은 예

1. **primaryColor 변수 사용**
   ```javascript
   border: `2px solid ${primaryColor}`
   background: `linear-gradient(135deg, ${primaryColor}, transparent)`
   ```

2. **구간별 색상 의미 일관성**
   - 빨간색: 위험, 즉시 조치 필요
   - 노란색: 주의, 준비 필요
   - 초록색: 이상적, 안전
   - 주황색: 액션 필요

3. **수치 표시**
   ```javascript
   <div>충전물 4개: 피해 +240%</div>
   ```

4. **툴팁/설명 추가**
   ```javascript
   <p style={{ fontSize: '0.85rem', color: '#ccc' }}>
     ⚠️ 80 이상에서 즉시 광란 사용 (분노 낭비 방지)
   </p>
   ```

5. **반응형 디자인**
   ```javascript
   display: 'flex',
   flexWrap: 'wrap', // 모바일에서 줄바꿈
   gap: '10px'
   ```

#### ❌ 피해야 할 것

1. **하드코딩된 색상**
   ```javascript
   // ❌ 나쁜 예
   border: '2px solid #C69B6D' // 전사 색상 하드코딩

   // ✅ 좋은 예
   border: `2px solid ${primaryColor}` // 변수 사용
   ```

2. **과도한 애니메이션**
   ```javascript
   // ❌ 성능 저하
   animation: 'pulse 1s infinite'
   ```

3. **일관성 없는 스타일**
   ```javascript
   // ❌ 섹션마다 다른 폰트 크기
   fontSize: '1.2rem' // 한 섹션
   fontSize: '14px'   // 다른 섹션
   ```

4. **접근성 무시**
   ```javascript
   // ❌ 색상만으로 구분 (색맹 사용자)
   <div style={{ background: 'red' }}>위험</div>

   // ✅ 텍스트 레이블 추가
   <div style={{ background: 'red' }}>⚠️ 위험</div>
   ```

5. **복잡도 과다**
   - 한 화면에 시각자료 3개 이상 지양
   - 너무 많은 구간 분할 (5개 이상)

---

### 실전 팁

1. **기존 가이드 참고**
   - FuryWarriorGuide.js: 분노 게이지 (Line 2135-2260, 2425-2540)
   - 코드 복사 후 리소스/색상만 변경

2. **점진적 추가**
   - 우선 텍스트 설명 작성
   - 이해가 어려운 부분만 시각자료 추가
   - 사용자 피드백 받고 개선

3. **성능 고려**
   - SVG < Canvas < 복잡한 애니메이션
   - 게이지 바는 순수 CSS/HTML 권장

4. **테스트**
   - 모바일 화면에서 확인 (360px 너비)
   - 색맹 시뮬레이터로 확인
   - 로딩 속도 체크

---

## ❌ AI가 자주 하는 실수 사례

### 실수 1: 색상 코드를 일부만 변경

**문제**:
```javascript
// ❌ 잘못된 예
primary: '#0070DE',  // 주술사 색상으로 변경
accent: '#C69B6D',   // 전사 색상 그대로 (실수)
hover: 'rgba(198, 156, 109, 0.1)',  // RGB 안 바꿈 (실수)
```

**해결**:
```bash
# 전체 검색으로 모든 위치 찾기
grep -n "#C69B6D\|198, 156, 109" src/components/ElementalShamanGuide.js

# 출력된 모든 라인을 새 색상으로 변경
```

**올바른 예**:
```javascript
primary: '#0070DE',
accent: '#0070DE',
hover: 'rgba(0, 112, 222, 0.1)',  // ✅ RGB도 변경
```

---

### 실수 2: 영웅 특성 키 이름 불일치

**문제**:
```javascript
// Line 282
const getHeroContent = () => ({
  farseer: { name: '선견자' }  // ✅ 키: farseer
});

// Line 1113 (실수 - 안 바꿈)
const [selectedTier, setSelectedTier] = useState('slayer');  // ❌ 여전히 slayer

// Line 2022 (실수 - 안 바꿈)
{selectedTier === 'slayer' ? (  // ❌ 키가 다름
```

**해결**:
```bash
# 전체 파일에서 모든 위치 찾기
grep -n "\bslayer\b\|\bmountainThane\b" src/components/ElementalShamanGuide.js

# 모든 출력된 라인을 새 키로 변경
# slayer → farseer
# mountainThane → stormbringer
```

---

### 실수 3: skillData 변수명 오타

**문제**:
```javascript
// ❌ 잘못된 예
skillData.lavaBurst  // 실제: lavaburst (소문자 b)
skillData.ChainLightning  // 실제: chainLightning (소문자 c)
```

**해결**:
```bash
# 스킬 데이터 파일에서 정확한 변수명 확인
grep "export const" src/data/elementalShamanSkillData.js

# 출력:
# export const elementalShamanSkills = {
#   lavaburst: { ... },
#   chainLightning: { ... },
#   ...
# }
```

**올바른 예**:
```javascript
skillData.lavaburst  // ✅ 소문자
skillData.chainLightning  // ✅ camelCase
```

---

### 실수 4: Priority 0을 여러 개 지정

**문제**:
```javascript
// ❌ 잘못된 예
priority: [
  { skill: skillData.primordialWave, priority: 0 },
  { skill: skillData.lavaBurst, priority: 0 },  // ❌ 중복
  { skill: skillData.earthShock, priority: 0 },  // ❌ 중복
]
```

**해결**:
각 우선순위 배열에서 **Priority 0은 정확히 1개만**

**올바른 예**:
```javascript
priority: [
  { skill: skillData.primordialWave, priority: 0 },  // ✅ 최우선 1개
  { skill: skillData.lavaBurst, priority: 1 },
  { skill: skillData.earthShock, priority: 2 },
]
```

**검증**:
```bash
# 각 영웅 특성 × 단일/광역 = 2×2 = 4개여야 함
grep -c "priority: 0" src/components/ElementalShamanGuide.js
# 출력: 4
```

---

### 실수 5: 심화 분석에서 SkillIcon textOnly 누락

**문제**:
```javascript
// ❌ 잘못된 예
<li>
  <strong>스킬:</strong> <SkillIcon skill={skillData.lavaBurst} /> 사용
</li>
```

**결과**: 아이콘이 너무 커서 텍스트 줄이 깨짐

**해결**:
```javascript
// ✅ 올바른 예
<li>
  <strong>스킬:</strong> <SkillIcon skill={skillData.lavaBurst} textOnly={true} /> 사용
</li>
```

---

### 실수 6: 검색 키워드로 찾을 때 첫 번째만 변경

**문제**:
```bash
grep -n "slayer:" src/components/ElementalShamanGuide.js
# 출력:
# 282:  slayer: {
# 1378:  const currentContent = heroContent[selectedTier];
# 3418:    slayer: {

# ❌ Line 282만 변경하고 나머지 놓침
```

**해결**:
```bash
# 모든 위치를 기록하고 하나씩 변경
# 또는 MultiEdit (찾기/바꾸기 전체) 사용
```

---

### 실수 7: 가이드 제목 및 색상 미변경

**문제**:
```javascript
// ❌ 잘못된 예 (Line 3814-3821)
<h1 style={{
  fontSize: '3rem',
  fontWeight: '900',
  background: 'linear-gradient(135deg, #C69B6D 0%, #a67c52 100%)',  // ❌ 전사 색상
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '1rem',
  textShadow: '0 0 30px rgba(198, 156, 109, 0.3)'  // ❌ 전사 RGB
}}>
  분노 전사 가이드  {/* ❌ 전사 제목 */}
</h1>
```

**해결**:
```javascript
// ✅ 올바른 예 (비전 마법사)
<h1 style={{
  fontSize: '3rem',
  fontWeight: '900',
  background: 'linear-gradient(135deg, #3FC6EA 0%, #2a9cc4 100%)',  // ✅ 마법사 색상
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '1rem',
  textShadow: '0 0 30px rgba(63, 198, 234, 0.3)'  // ✅ 마법사 RGB
}}>
  비전 마법사 가이드  {/* ✅ 마법사 제목 */}
</h1>
```

**검증**:
```bash
# 제목 확인
grep -n "가이드</h1>" src/components/ArcaneMageGuide.js

# 색상 코드 확인 (전사 색상 남았는지)
grep -n "#C69B6D\|198, 156, 109" src/components/ArcaneMageGuide.js
# 출력 있음 = 전사 색상 남음 (실수)
# 출력 없음 = 정상 ✅
```

---

### 실수 8: 영웅 특성 탭 버튼 텍스트 미변경

**문제**:
```javascript
// ❌ 잘못된 예 (Line 1428, 1434)
<button onClick={() => setSelectedTier('sunfury')}>
  <span className={styles.tierIcon}>⚔️</span> 학살자 (Slayer)  {/* ❌ 전사 */}
</button>
<button onClick={() => setSelectedTier('spellslinger')}>
  <span className={styles.tierIcon}>🏔️</span> 산왕 (Mountain Thane)  {/* ❌ 전사 */}
</button>
```

**해결**:
```javascript
// ✅ 올바른 예 (비전 마법사)
<button onClick={() => setSelectedTier('sunfury')}>
  <span className={styles.tierIcon}>☀️</span> 성난태양 (Sunfury)  {/* ✅ */}
</button>
<button onClick={() => setSelectedTier('spellslinger')}>
  <span className={styles.tierIcon}>🔮</span> 주문술사 (Spellslinger)  {/* ✅ */}
</button>
```

**검증**:
```bash
# 전사 영웅 특성명 검색
grep -n "학살자\|산왕\|Slayer\|Mountain Thane" src/components/ArcaneMageGuide.js
# 출력 있음 = 탭 버튼 텍스트 안 바뀜 (실수)
# 출력 없음 = 정상 ✅
```

---

### 실수 9: 영웅 특성 딜링 메커니즘 섹션 미변경 (~150줄)

**⚠️ 매우 중요**: 이 실수를 놓치면 약 150줄의 핵심 콘텐츠가 잘못된 전문화 내용으로 남음

**문제**:
```javascript
// ❌ 잘못된 예 (Line 1513-1661, ~150줄)
<div style={{ marginBottom: '2rem' }}>
  <h4 style={{ color: unifiedTheme.colors.primary }}>
    학살자 (Slayer)  {/* ❌ 전사 */}
  </h4>
  <p>
    학살자는 <SkillIcon skill={skillData.execute} textOnly={true} />와  {/* ❌ 전사 스킬 */}
    강력한 처형 메커니즘에 집중합니다...
  </p>
  <p>
    <strong>격노 관리:</strong>  {/* ❌ 전사 메커니즘 */}
    <SkillIcon skill={skillData.enrage} textOnly={true} />를 최대한 유지...
  </p>
  {/* ... 약 150줄 전사 콘텐츠 ... */}
</div>
```

**해결**:
```javascript
// ✅ 올바른 예 (비전 마법사)
<div style={{ marginBottom: '2rem' }}>
  <h4 style={{ color: unifiedTheme.colors.primary }}>
    성난태양 (Sunfury)  {/* ✅ 마법사 */}
  </h4>
  <p>
    성난태양은 <SkillIcon skill={skillData.arcaneBlast} textOnly={true} />와  {/* ✅ 마법사 스킬 */}
    비전 충전물 폭발 메커니즘에 집중합니다...
  </p>
  <p>
    <strong>비전 충전물 관리:</strong>  {/* ✅ 마법사 메커니즘 */}
    <SkillIcon skill={skillData.arcaneCharges} textOnly={true} />를 효율적으로 소모...
  </p>
  {/* ... 약 150줄 마법사 콘텐츠 ... */}
</div>
```

**검증**:
```bash
# 전사 스킬명 검색 (딜링 메커니즘 섹션 범위)
grep -n "격노\|처형\|execute\|enrage\|bloodthirst" src/components/ArcaneMageGuide.js | \
  awk -F: '$1 >= 1513 && $1 <= 1661 {print}'

# 출력 있음 = 전사 콘텐츠 남음 (실수)
# 출력 없음 = 정상 ✅
```

**영향도**:
- **작업량**: 전체 가이드의 약 4-5%
- **라인 수**: ~150줄
- **중요도**: 높음 (영웅 특성별 핵심 메커니즘 설명)

---

### 실수 10: 스킬/특성 텍스트 언급 시 SkillIcon 컴포넌트 누락

**⚠️ 매우 흔한 실수**: 스킬이나 특성을 텍스트로만 언급하고 `<SkillIcon>` 컴포넌트를 빠뜨리는 경우

**문제 사례**:
```javascript
// ❌ 잘못된 예 - 스킬명을 텍스트로만 언급
<p>
  광란은 분노 80을 소모하며, 격노 버프를 유지하는 핵심 스킬입니다.
  마무리 일격 구간에서는 우선순위가 높아집니다.
</p>

<li>
  <strong>버프 관리:</strong> 격노 버프 만료 1 GCD 전 광란 준비 필수
</li>

<li>
  <strong>단일 대상:</strong> 마무리 일격 표식 2중첩 달성 시 폭발 딜
</li>
```

**결과**:
- 사용자가 "광란", "격노", "마무리 일격"이 어떤 스킬인지 즉시 파악 불가
- 아이콘이 없어 시각적 구분 어려움
- 툴팁이 없어 상세 정보 확인 불가

**해결**:
```javascript
// ✅ 올바른 예 - SkillIcon 컴포넌트 사용
<p>
  <SkillIcon skill={skillData.rampage} textOnly={true} />은(는) 분노 80을 소모하며, {' '}
  <SkillIcon skill={skillData.enrage} textOnly={true} /> 버프를 유지하는 핵심 스킬입니다.
  <SkillIcon skill={skillData.execute} textOnly={true} /> 구간에서는 우선순위가 높아집니다.
</p>

<li>
  <strong>버프 관리:</strong> <SkillIcon skill={skillData.enrage} textOnly={true} /> 버프 만료 1 GCD 전 {' '}
  <SkillIcon skill={skillData.rampage} textOnly={true} /> 준비 필수
</li>

<li>
  <strong>단일 대상:</strong> <SkillIcon skill={skillData.execute} textOnly={true} /> 표식 2중첩 달성 시 폭발 딜
</li>
```

**검증 방법 1: 주요 스킬명 검색**
```bash
# 전사 가이드 예시 - 주요 스킬명이 텍스트로만 있는지 확인
grep -n "광란\|격노\|마무리 일격\|피의 갈증" src/components/FuryWarriorGuide.js | grep -v "SkillIcon"

# 마법사 가이드 예시
grep -n "비전 작렬\|비전 충전\|비전 탄막" src/components/ArcaneMageGuide.js | grep -v "SkillIcon"

# 출력 있음 = 아이콘 누락된 라인 (수정 필요)
# 출력 없음 = 모든 스킬명에 SkillIcon 사용됨 ✅
```

**검증 방법 2: skillData 사용 확인**
```bash
# skillData로 정의된 스킬 개수 확인
grep -c "skillData\." src/components/ArcaneMageGuide.js

# 너무 적으면 (<50) 아이콘 누락 의심
```

**적용 원칙**:
1. **모든 스킬명**: `<SkillIcon skill={skillData.XXX} textOnly={true} />` 사용
2. **모든 특성명**: 특성 데이터가 있으면 SkillIcon 사용
3. **영웅 특성명**: 특성 아이콘이 있으면 사용 (없으면 텍스트만 허용)
4. **버프명**: 스킬로 발동되는 버프는 해당 스킬의 SkillIcon 사용

**예외 허용**:
- 섹션 제목 (`<h3>`, `<h4>`)에서는 텍스트만 사용 가능
- renderTextWithSkillIcons() 함수 내부 (자동 처리)
- 주석 (`{/* ... */}`) 내부

**영향도**:
- **발생 빈도**: 매우 높음 (가이드당 수십~수백 곳)
- **작업량**: 전체 가이드의 약 10-15%
- **사용자 경험**: 매우 중요 (아이콘+툴팁이 가이드 핵심 가치)

---

## 🔍 디버깅 가이드

### 문제: 빌드 시 "Module not found" 에러

**에러 메시지**:
```
Module not found: Error: Can't resolve '../data/elementalShamanSkillData'
```

**원인**:
1. 파일명 오타 (`elementalShamanSkillData.js` vs `elementalShamanSkilldata.js`)
2. 파일 경로 오류 (`../data/` vs `./data/`)
3. 파일이 존재하지 않음

**해결**:
```bash
# 파일 존재 확인
ls src/data/elementalShamanSkillData.js

# 없으면 생성
touch src/data/elementalShamanSkillData.js
```

---

### 문제: "skillData.XXX is undefined"

**원인**: 스킬 데이터 파일에 해당 스킬이 없음

**해결**:
```bash
# 스킬 데이터 파일 확인
grep "lavaBurst" src/data/elementalShamanSkillData.js

# 없으면 추가
```

---

### 문제: 스킬 아이콘이 깨짐 (404 에러)

**원인**: `icon` 필드의 파일명이 `ICONS/` 폴더에 없음

**해결**:
```bash
# 아이콘 파일 존재 확인
ls ICONS/spell_nature_lightning.tga

# 없으면 Wowhead에서 정확한 아이콘명 확인
# ko.wowhead.com/spell=스킬ID
```

---

### 문제: 영웅 특성 탭 클릭 시 콘텐츠 안 바뀜

**원인**: 영웅 특성 키 불일치

**해결**:
```bash
# 모든 키가 일치하는지 확인
grep "selectedTier === " src/components/ElementalShamanGuide.js

# 모두 같은 키(farseer, stormbringer)를 사용하는지 확인
```

---

## ✅ 최종 검증 체크리스트

### 코드 검증
- [ ] `npm run build` 성공 (에러 0개)
- [ ] 전사 텍스트 없음: `grep -i "전사\|warrior" {파일명}` 출력 없음
- [ ] 전사 색상 없음: `grep "#C69B6D\|198, 156, 109" {파일명}` 출력 없음
- [ ] 전사 영웅 특성 없음: `grep "slayer\|mountainThane\|학살자\|산왕" {파일명}` 출력 없음
- [ ] Priority 0 개수: `grep -c "priority: 0" {파일명}` = 4
- [ ] **아이콘 필드 검증**: `grep '"icon":' src/data/{전문화}SkillData.js | grep "bnet-large"` 출력 없음
- [ ] **가이드 제목 확인**: `grep -n "가이드</h1>" {파일명}` → 올바른 전문화명 표시
- [ ] **딜링 메커니즘 검증**: `grep "격노\|처형\|execute\|enrage" {파일명} | awk -F: '$1 >= 1513 && $1 <= 1661 {print}'` 출력 없음
- [ ] **스킬/특성 아이콘 누락 검증**: `grep -n "주요스킬명1\|주요스킬명2\|주요스킬명3" {파일명} | grep -v "SkillIcon"` 출력 없음 (전문화별 주요 스킬 5-10개 확인)

### 시각적 검증
- [ ] **가이드 제목 색상**: 페이지 상단 제목이 올바른 직업 색상 gradient로 표시
- [ ] **메타 정보 색상**: 전문화/난이도 표시가 올바른 색상으로 표시
- [ ] **영웅 특성 탭 버튼**: 2개 탭 버튼 텍스트가 올바른 영웅 특성명으로 표시
- [ ] 색상이 새 직업 색상으로 표시
- [ ] 영웅 특성 탭 2개 정상 표시
- [ ] **스킬 아이콘 모두 정상 표시** (❓ 없음, 404 없음, 텍스트 옆에 아이콘 표시)
- [ ] **모든 스킬/특성 언급 시 아이콘 표시**: 페이지 전체에서 스킬명 옆에 아이콘과 툴팁 작동
- [ ] 툴팁 정상 작동 (마우스 오버 시 스킬 상세 정보 표시)
- [ ] 빌드 복사 버튼 작동
- [ ] 네비게이션 스크롤 연동
- [ ] 모든 섹션 내용 정상 표시
- [ ] 모바일 반응형 정상

### 콘텐츠 검증
- [ ] 개요 텍스트가 새 전문화에 맞음
- [ ] **영웅 특성 딜링 메커니즘** (~150줄)이 새 전문화 내용으로 작성됨
- [ ] 티어 세트 효과가 정확함
- [ ] 오프닝 시퀀스가 논리적임
- [ ] 우선순위가 합리적임
- [ ] **심화 분석이 상세함** (영웅 특성당 5+ 섹션, 총 ~800줄)
- [ ] 스탯 우선순위가 정확함

---

## 📊 예상 작업 시간

| 단계 | 세부 작업 | 소요 시간 | 누적 시간 |
|------|----------|-----------|----------|
| **Step 1-6** | 파일 복사, import, 색상, 컴포넌트명, 영웅 특성 기본 | 15분 | 15분 |
| **Step 6.5** | 가이드 제목 및 메타 색상 (Line 3821) | 5분 | 20분 |
| **Step 7** | 영웅 특성 탭 버튼 텍스트 (Line 1428, 1434) | 5분 | 25분 |
| **Step 8** | 티어 세트 효과 | 10분 | 35분 |
| **Step 9** | 오프닝 시퀀스 (4개) | 20분 | 55분 |
| **Step 10** | 우선순위 (4개) | 40분 | 1시간 35분 |
| **Step 10.5** | 영웅 특성 딜링 메커니즘 (~150줄) | 40분 | 2시간 15분 |
| **Step 11** | 핵심 메커니즘 (5-8개) | 30분 | 2시간 45분 |
| **Step 12** | 개요 텍스트 | 20분 | 3시간 5분 |
| **Step 13** | 심화 분석 (10-20개, ~800줄, 가장 중요) | 1-2시간 | 4-5시간 5분 |
| **Step 14** | 스탯 우선순위 | 30분 | 4-5시간 35분 |
| **Step 15** | App.js 라우팅 | 5분 | 4-5시간 40분 |
| **Step 16** | 빌드, 검증, 수정 | 30분 | **5-6시간 10분** |

---

## 🎯 성공 기준

### 필수 조건 (100% 충족)
✅ 빌드 에러 0개
✅ 원본 전사 관련 텍스트 0개
✅ 원본 전사 색상 0개
✅ 모든 스킬 아이콘 정상 표시

### 권장 조건 (80% 이상)
✅ 심화 분석 5개 이상/영웅특성
✅ 우선순위 7개 이상/영웅특성/타겟타입
✅ 핵심 메커니즘 5개 이상/영웅특성
✅ 개요 텍스트 3문단 이상

---

## 📝 매뉴얼 사용 시 주의사항

### AI(Claude Code)에게

**🚨 필수: 3단계 검증 시스템 사용 (2025-01-10 추가)**

이전에는 지침만 있었지만, 이제 **자동 검증 시스템**을 사용하여 지침 준수를 강제합니다.

#### 검증 시스템 사용 방법

**1단계: 사전 검증 (가이드 생성 시작 전)**
```bash
node scripts/validate-guide-creation.js src/components/[가이드명].js [className] [specName] --phase pre

# 예시:
node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase pre
```

**통과 기준**: 모든 항목 ✅, 하나라도 ❌면 다음 단계 진행 금지

**2단계: 실시간 검증 (각 섹션 완료 후)**
```bash
node scripts/validate-guide-creation.js src/components/[가이드명].js [className] [specName] --phase during

# 예시:
node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase during
```

**통과 기준**: CRITICAL 0개, HIGH 3개 이하

**3단계: 사후 검증 (작성 완료 후)**
```bash
node scripts/validate-guide-creation.js src/components/[가이드명].js [className] [specName] --phase post

# 예시:
node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase post
```

**통과 기준**: 모든 항목 ✅, 컴파일 성공 필수

---

#### 기존 지침 (검증 시스템과 함께 사용)

1. **순서를 절대 건너뛰지 마세요**
   - Step 1부터 Step 16까지 순서대로 진행
   - 각 Step의 검증 명령어 실행
   - **중요**: Step 5, 10, 16 완료 후 검증 시스템 실행 (pre/during/post)

2. **검색 키워드를 정확히 사용하세요**
   - 제공된 `grep` 명령어를 그대로 복사
   - 출력된 라인 번호로 정확한 위치 찾기

3. **변경 전/후 코드를 비교하세요**
   - 제시된 예시 코드와 실제 코드 비교
   - 구조는 유지하고 내용만 교체

4. **검증을 빠뜨리지 마세요**
   - 각 Step 완료 후 검증 명령어 실행
   - 출력 결과 확인
   - **추가**: Step 5, 10, 16 완료 후 검증 시스템 실행

5. **실수 사례를 숙지하세요**
   - "AI가 자주 하는 실수 사례" 섹션 정독
   - 같은 실수 반복하지 않기
   - **새로운 실수 패턴**: 검증 시스템이 자동으로 검출

---

## 🔄 버전 관리

**매뉴얼 버전**: v1.0
**작성일**: 2025-10-05
**기준 템플릿**: GuideTemplate.js (분노 전사 4,065줄)
**TWW 시즌**: Season 3 (11.2 패치)

---

## 📞 문제 발생 시

빌드 에러나 이해가 안 되는 부분이 있으면:

1. **디버깅 가이드** 섹션 참조
2. **실수 사례** 섹션에서 유사 사례 찾기
3. **검증 체크리스트** 다시 확인
4. 사용자에게 구체적인 에러 메시지와 라인 번호 보고

---

**이 매뉴얼을 따라하면 4-5시간 안에 완성도 높은 가이드를 작성할 수 있습니다.** 🎉
