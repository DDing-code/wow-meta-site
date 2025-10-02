# 🎨 WoW 딜사이클 플로우차트 디자인 가이드

## 📌 핵심 디자인 원칙

### 1. 아이콘 중심 디자인
- **텍스트 최소화**: 스킬 이름 제거, 아이콘으로만 표현
- **즉각적 인식**: WoW 플레이어가 한눈에 알아볼 수 있는 공식 아이콘 사용
- **시각적 계층**: 크기와 색상으로 중요도 구분

### 2. 인터랙티브 요소
- **호버 툴팁**: 마우스 오버시 상세 정보 표시
- **클릭 가능**: 아이콘 클릭시 Wowhead 링크 연결
- **부드러운 전환**: 모든 인터랙션에 애니메이션 적용

## 🎯 구현 상세 사양

### 컨테이너 스타일
```javascript
// 메인 컨테이너
const FlowchartContainer = styled.div`
  // 다층 그라디언트 배경
  background:
    radial-gradient(ellipse at top left, rgba(244, 196, 48, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(201, 169, 53, 0.05) 0%, transparent 50%),
    linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);

  // WoW 스타일 골드 보더
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #f4c430 0%, #c9a935 50%, #f4c430 100%) 1;

  // 그림자와 발광 효과
  box-shadow:
    0 0 80px rgba(244, 196, 48, 0.15),    // 외부 발광
    0 15px 60px rgba(0, 0, 0, 0.9),       // 깊은 그림자
    inset 0 1px 0 rgba(244, 196, 48, 0.3); // 상단 하이라이트
`;
```

### 스킬 노드 구조
```javascript
// 스킬 노드 레이어 구성 (안쪽부터)
1. 아이콘 이미지 (56x56px)
2. 클리핑 마스크 (원형, r=28)
3. 내부 보더 (strokeWidth=1.5, opacity=0.6)
4. 메인 노드 배경 (r=35)
5. 외부 발광 링 (r=38, 애니메이션)

// 특수 노드 추가 요소
- 중요도 마커 (!표시)
- 처형 표시 (X자)
- 콤보 연결 배경
- FILLER 텍스트
```

## 🌟 색상 시스템

### 우선순위별 색상 코드
```css
/* 긴급/처형 스킬 */
--critical: #ff1744;

/* 핵심 딜링 스킬 */
--primary: #ff6b6b;

/* 버스트 쿨다운 */
--burst: #ffa500;

/* 버프 유지 */
--buff: #f4c430;

/* 필러 스킬 */
--filler: #22c55e;

/* 상황별 선택 */
--situational: #64748b;
```

## 📐 SVG 구조

### 기본 레이아웃
```xml
<svg width="900" height="800">
  <defs>
    <!-- 그라디언트 정의 -->
    <linearGradient id="arrowGradient">
    <linearGradient id="nodeGradient">
    <linearGradient id="decisionGradient">

    <!-- 필터 정의 -->
    <filter id="glow">           <!-- 발광 효과 -->
    <filter id="iconShadow">     <!-- 아이콘 그림자 -->
    <filter id="skillGlow">      <!-- 스킬 발광 -->

    <!-- 아이콘 패턴 -->
    <pattern id="icon-{SKILL_ID}">
      <image href="https://wow.zamimg.com/images/wow/icons/large/{icon}.jpg">
    </pattern>
  </defs>

  <!-- 플로우차트 요소들 -->
</svg>
```

### 노드 타입별 구현

#### 1. 기본 스킬 노드
```jsx
<g className="skill-node" onMouseEnter={handleHover}>
  <!-- 외부 발광 링 -->
  <circle r="38" opacity="0.3" style={{animation: 'pulse 2s infinite'}}/>

  <!-- 메인 노드 -->
  <circle r="35" fill="url(#nodeGradient)" stroke={priorityColor}/>

  <!-- 아이콘 클리핑 -->
  <clipPath id="iconClip-{SKILL}">
    <circle r="28"/>
  </clipPath>

  <!-- 아이콘 이미지 -->
  <image width="56" height="56" clipPath="url(#iconClip-{SKILL})"/>

  <!-- 내부 보더 -->
  <circle r="28" fill="none" stroke={priorityColor} opacity="0.6"/>
</g>
```

#### 2. 콤보 노드 (야격 + 야생의 부름)
```jsx
<g transform="translate(300, 410)">
  <!-- 연결 배경 -->
  <rect width="120" height="50" rx="25" opacity="0.3"/>

  <!-- 첫 번째 스킬 -->
  <g className="skill-node">
    <circle cx="-25" cy="0" r="30"/>
    <!-- ... -->
  </g>

  <!-- + 기호 -->
  <text x="0" y="5" fontSize="20" fontWeight="800">+</text>

  <!-- 두 번째 스킬 -->
  <g className="skill-node">
    <circle cx="25" cy="0" r="30"/>
    <!-- ... -->
  </g>
</g>
```

#### 3. 결정 노드
```jsx
<rect width="140" height="60" rx="10"
      fill="url(#decisionGradient)"
      stroke="#f4c430">
  <text>조건 텍스트</text>
  <text>임계값?</text>
</rect>
```

## 💫 애니메이션 시스템

### 글로벌 애니메이션
```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.6;
  }
}

@keyframes glow {
  0%, 100% {
    opacity: 0.3;
    transform: rotate(0deg);
  }
  50% {
    opacity: 0.6;
    transform: rotate(1deg);
  }
}

.skill-node {
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
}
```

### 우선순위별 애니메이션
- **긴급 스킬**: 빠른 펄스 (1.5초)
- **핵심 스킬**: 일반 펄스 (2초)
- **버스트**: 느린 펄스 (3초)
- **필러**: 애니메이션 없음

## 🔧 툴팁 시스템

### 툴팁 구조
```jsx
<SkillTooltip visible={hoveredSkill} x={pos.x} y={pos.y}>
  <TooltipHeader>
    <TooltipIcon src={iconUrl}/>
    <TooltipTitle>
      <h4>{koreanName}</h4>
      <span>{englishName}</span>
    </TooltipTitle>
  </TooltipHeader>

  <TooltipBody>
    <TooltipRow>
      <span>재사용 대기시간</span>
      <span>{cooldown}</span>
    </TooltipRow>
    <!-- 추가 정보 -->
  </TooltipBody>
</SkillTooltip>
```

### 툴팁 스타일
```css
/* 메인 컨테이너 */
position: fixed;
z-index: 10000;
width: 360px;
background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
border: 2px solid #f4c430;
border-radius: 12px;
box-shadow: 0 0 40px rgba(244, 196, 48, 0.3);

/* 페이드인 애니메이션 */
animation: tooltipFadeIn 0.3s ease-out;
```

## 📊 연결선과 화살표

### 곡선 연결선
```jsx
<!-- Quadratic Bezier 곡선 사용 -->
<path d="M 450 90 Q 450 115 450 140"
      stroke="url(#arrowGradient)"
      strokeWidth="3"
      markerEnd="url(#arrowhead)"/>

<!-- 점선 피드백 루프 -->
<path d="M 450 200 Q 450 115 450 90"
      strokeDasharray="5,5"
      opacity="0.6"/>
```

### 화살표 마커
```jsx
<marker id="arrowhead" refX="9" refY="3">
  <polygon points="0 0, 10 3, 0 6" fill="#f4c430"/>
</marker>
```

## 🎮 인터랙션 패턴

### 마우스 호버
```javascript
const handleSkillHover = (skill, event) => {
  if (event && skill) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(rect.right + 15, window.innerWidth - 390);
    const y = Math.min(rect.top - 30, window.innerHeight - 300);

    setTooltipPos({ x: Math.max(10, x), y: Math.max(10, y) });
    setHoveredSkill(skill);
  }
};
```

### 클릭 액션
```javascript
onClick={() => window.open(`https://ko.wowhead.com/spell=${skillId}`, '_blank')}
```

## 🔍 범례 디자인

### 범례 구조
```jsx
<g transform="translate(700, 50)">
  <rect width="180" height="250" rx="10"
        fill="url(#legendGradient)"
        stroke="#f4c430"/>

  <text>우선순위 등급</text>
  <line stroke="#f4c430" opacity="0.3"/>

  <!-- 우선순위 항목들 -->
  <circle r="8" fill={priorityColor}/>
  <text>{priorityLabel}</text>

  <!-- 안내 텍스트 -->
  <text fontStyle="italic">마우스 오버로 상세정보</text>
</g>
```

## 📱 반응형 고려사항

### 뷰포트 적응
- SVG viewBox 활용으로 자동 스케일링
- 최소 너비: 900px
- 최대 너비: 1200px
- 모바일: 가로 스크롤 허용

### 성능 최적화
- React.memo로 불필요한 리렌더링 방지
- 이미지 lazy loading
- 애니메이션 GPU 가속 (transform 사용)
- 툴팁은 조건부 렌더링

## 🚀 확장 가능성

### 다른 클래스 적용
1. 스킬 데이터 객체만 변경
2. 색상 테마 조정 (클래스별 색상)
3. 노드 위치와 연결선 조정
4. 클래스별 특수 메커니즘 추가

### 추가 가능한 기능
- 애니메이션 재생/정지 버튼
- 스킬 시퀀스 시뮬레이션
- DPS 계산기 연동
- WeakAura 코드 생성
- 모바일 터치 지원

## 📚 참고 자료

### WoW 아이콘 URL 패턴
```
https://wow.zamimg.com/images/wow/icons/large/{iconName}.jpg
```

### 색상 참조
- WoW 골드: #f4c430, #c9a935
- 클래스별 색상 (전사: #C79C6E, 사냥꾼: #ABD473 등)
- 희귀도 색상 (에픽: #a335ee, 레어: #0070dd)

### 폰트
- 한글: 'Noto Sans KR'
- 영문: system-ui, -apple-system
- 코드: monospace

## ✅ 체크리스트

### 필수 구현 사항
- [ ] 모든 스킬 아이콘 표시
- [ ] 호버 툴팁 구현
- [ ] 우선순위별 색상 구분
- [ ] 애니메이션 효과
- [ ] 연결선과 화살표
- [ ] 범례 표시
- [ ] 반응형 레이아웃

### 품질 기준
- [ ] 60fps 애니메이션
- [ ] 3초 이내 초기 로딩
- [ ] 모든 브라우저 호환
- [ ] 접근성 고려 (키보드 네비게이션)