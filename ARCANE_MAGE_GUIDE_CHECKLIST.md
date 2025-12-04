# 비전 마법사 가이드 기반 새 가이드 제작 체크리스트

## 📌 핵심 원칙

**ArcaneMageGuide.js = 검증된 완성 가이드 = 새로운 표준 템플릿**

- ✅ 컴파일 에러 0개
- ✅ 모든 섹션 완성
- ✅ 영웅 특성 2개 (Sunfury, Spellslinger)
- ✅ 로테이션 검증 완료
- ✅ 티어 세트, 스탯, 빌드 모두 포함

---

## 🚀 빠른 시작 (8단계)

### Step 1: ArcaneMageGuide.js 복사
```bash
cp src/components/ArcaneMageGuide.js src/components/ElementalShamanGuide.js
```

### Step 2: 클래스/전문화명 교체
```bash
# 파일 내 모든 "mage", "arcane" 키워드 교체
# - import 문
# - 컴포넌트명
# - 페이지 제목
```

**교체 대상**:
```javascript
// Line 6: import
import { arcaneMageSkills as skillData } from '../data/arcaneMageSkillData';
→ import { elementalShamanSkills as skillData } from '../data/elementalShamanSkillData';

// Line 11: 컴포넌트명
const ArcaneMageGuide = () => {
→ const ElementalShamanGuide = () => {

// Line 17: 제목
<h1>비전 마법사 가이드</h1>
→ <h1>정기 주술사 가이드</h1>
```

### Step 3: 스킬 데이터 파일 생성
```bash
cp src/data/arcaneMageSkillData.js src/data/elementalShamanSkillData.js
```

**수정**:
- DB에서 해당 클래스/전문화 스킬만 필터링
- 스킬 키 확인 (camelCase)

### Step 4: 영웅 특성 2개 교체

**ArcaneMage 구조 참고**:
```javascript
// Line 281-359: getHeroContent 함수
sunfury: {
  name: '성난태양',
  key: 'sunfury',
  overview: '...',
  // ...
},
spellslinger: {
  name: '주문술사',
  key: 'spellslinger',
  overview: '...',
  // ...
}
```

**교체 작업**:
1. 영웅 특성명 확인 (Wowhead)
2. `sunfury` → `hero1Key`, `spellslinger` → `hero2Key`
3. `name`, `overview`, `rotation`, `tierSet` 모두 교체

### Step 5: 티어 세트 효과 교체

**위치**: Line 364-381 (tierSet 객체)

**Wowhead 확인 필수**:
```javascript
tierSet: {
  '2set': 'Wowhead에서 복사한 정확한 효과',
  '4set': 'Wowhead에서 복사한 정확한 효과'
}
```

### Step 6: 스탯 우선순위 교체

**위치**: Line 382-401 (statPriority 객체)

**Maxroll 확인 필수**:
```javascript
statPriority: {
  sunfury: ['지능', '가속', '특화', '치명타', '유연성'],
  spellslinger: ['지능', '가속', '치명타', '특화', '유연성']
}
```

### Step 7: 로테이션 우선순위 교체

**위치**: Line 531-802 (getRotationContent 함수)

**Wowhead 로테이션 가이드 필수 확인**:
- Opener (오프닝 딜사이클)
- Single Target Priority (단일 대상 우선순위)
- AoE Priority (광역 우선순위)

**주의**:
- 모든 스킬은 `skillData.xxx` 형식
- Priority 번호 0부터 시작 (0 = 최우선)
- `conditions`, `why` 필드 필수

### Step 8: 검증 실행
```bash
node scripts/validate-guide-creation.js src/components/ElementalShamanGuide.js shaman elemental --phase post
```

**통과 기준**: CRITICAL 0개, HIGH 0개

---

## ❌ 절대 금지 사항

1. **처음부터 새로 작성**: ArcaneMageGuide.js를 항상 복사
2. **GuideTemplate.js 사용**: 오래된 템플릿 (분노 전사 기반)
3. **다른 가이드 복사**: FrostDeathKnightGuide.js 등 다른 가이드 금지
4. **단일 데이터 소스**: Wowhead + Maxroll 최소 2개 사용
5. **영어 직역**: ko.wowhead.com에서 공식 번역 확인
6. **임의 내용 작성**: 정보 없으면 TODO 주석 + 사용자 문의

---

## 🔍 검증 체크리스트

### Phase 1: 사전 검증 (복사 직후)
```bash
node scripts/validate-guide-creation.js src/components/YourGuide.js className specName --phase pre
```

**확인 항목**:
- [ ] ArcaneMageGuide.js를 복사했는가?
- [ ] import 문에 데이터 소스 URL 주석이 있는가?
- [ ] 클래스/전문화명이 올바른가?

### Phase 2: 실시간 검증 (작성 중)
```bash
node scripts/validate-guide-creation.js src/components/YourGuide.js className specName --phase during
```

**확인 항목**:
- [ ] "비전", "마법사", "Sunfury", "Spellslinger" 키워드 잔류 없음
- [ ] 모든 스킬에 `skillData.xxx` 형식 사용
- [ ] 영어 용어 없음 (공식 번역 사용)

### Phase 3: 사후 검증 (완성 후)
```bash
node scripts/validate-guide-creation.js src/components/YourGuide.js className specName --phase post
```

**확인 항목**:
- [ ] 교차 검증 주석 있음 (`// Wowhead 검증: [URL]`)
- [ ] 필수 섹션 모두 존재 (개요, 딜사이클, 특성, 스탯)
- [ ] `npm run build` 성공

---

## 📚 데이터 소스 우선순위

### 1순위: Wowhead (필수)
```
https://www.wowhead.com/guide/classes/{class}/{spec}/rotation-cooldowns-pve-dps
https://ko.wowhead.com/guide/classes/{class}/{spec}/...
```

**확인 항목**:
- Opener (오프닝 딜사이클)
- Priority (우선순위)
- AoE rotation (광역 로테이션)
- Cooldown usage (쿨다운 사용법)

### 2순위: Maxroll (보조)
```
https://maxroll.gg/wow/class-guides/{class}-{spec}-pve-dps-guide
```

**확인 항목**:
- Stat Priority (스탯 우선순위)
- Tier Set (티어 세트 효과)
- Advanced Mechanics (심화 메커니즘)

### 3순위: Icy Veins (참고)
```
https://www.icy-veins.com/wow/{class}-{spec}-pve-dps-guide
```

**확인 항목**:
- Core Concepts (핵심 개념)
- Basic Rotation (기본 로테이션)

---

## 🛠️ 실전 예시: 정기 주술사 가이드

### Step 1: 복사
```bash
cp src/components/ArcaneMageGuide.js src/components/ElementalShamanGuide.js
cp src/data/arcaneMageSkillData.js src/data/elementalShamanSkillData.js
```

### Step 2: import 교체
```javascript
// Before
import { arcaneMageSkills as skillData } from '../data/arcaneMageSkillData';

// After
import { elementalShamanSkills as skillData } from '../data/elementalShamanSkillData';
```

### Step 3: 컴포넌트명 교체
```javascript
// Before
const ArcaneMageGuide = () => {

// After
const ElementalShamanGuide = () => {
```

### Step 4: 제목 교체
```javascript
// Before
<h1>비전 마법사 가이드</h1>

// After
<h1>정기 주술사 가이드</h1>
```

### Step 5: 영웅 특성 교체
```javascript
// Before (ArcaneMage)
sunfury: {
  name: '성난태양',
  key: 'sunfury',
  // ...
},
spellslinger: {
  name: '주문술사',
  key: 'spellslinger',
  // ...
}

// After (ElementalShaman)
farseer: {
  name: '선견자',
  key: 'farseer',
  overview: 'Wowhead에서 복사한 정확한 설명',
  // ...
},
stormbringer: {
  name: '폭풍인도자',
  key: 'stormbringer',
  overview: 'Wowhead에서 복사한 정확한 설명',
  // ...
}
```

### Step 6: 검증
```bash
node scripts/validate-guide-creation.js src/components/ElementalShamanGuide.js shaman elemental --phase during
```

**예상 출력**:
```
❌ 3개의 문제 발견:

🔴 CRITICAL (즉시 수정 필수):
1. ❌ 템플릿 키워드가 2개 남아있습니다: 비전, 마법사
   해결책: ArcaneMageGuide.js의 모든 "비전", "마법사" 키워드를 "정기", "주술사"로 교체하세요.
```

### Step 7: 수정 후 재검증
```bash
# 모든 "비전" → "정기", "마법사" → "주술사" 교체

node scripts/validate-guide-creation.js src/components/ElementalShamanGuide.js shaman elemental --phase post
```

**성공 출력**:
```
✅ 모든 검증 통과!

ℹ️  추가 확인사항:
1. ℹ️  컴파일 확인: npm run build를 실행하여 에러가 없는지 확인하세요.
```

---

## 🎯 품질 기준

### 최소 요구사항
- [ ] 컴파일 성공 (`npm run build`)
- [ ] 검증 스크립트 통과 (CRITICAL 0개)
- [ ] 영웅 특성 2개 완성
- [ ] 로테이션 완성 (Opener + Priority)
- [ ] 티어 세트 효과 정확
- [ ] 스탯 우선순위 정확

### 권장 사항
- [ ] Wowhead + Maxroll 교차 검증 완료
- [ ] 모든 섹션에 데이터 출처 주석
- [ ] 스킬 아이콘 모두 정상 표시
- [ ] 페이지 로딩 속도 정상
- [ ] 모바일 반응형 정상

---

## 🚨 흔한 실수 방지

### 실수 1: 템플릿 키워드 잔류
```javascript
// ❌ 잘못된 예시 (ElementalShamanGuide.js)
<h1>비전 마법사 가이드</h1>  // "비전 마법사" 잔류

// ✅ 올바른 예시
<h1>정기 주술사 가이드</h1>
```

### 실수 2: 다른 클래스 스킬 사용
```javascript
// ❌ 잘못된 예시 (ElementalShamanGuide.js)
skillData.arcaneblast  // 마법사 스킬

// ✅ 올바른 예시
skillData.lightningbolt  // 주술사 스킬
```

### 실수 3: 영어 직역
```javascript
// ❌ 잘못된 예시
'가시 사격'  // "Barbed Shot" 직역

// ✅ 올바른 예시
'날카로운 사격'  // ko.wowhead.com 공식 번역
```

### 실수 4: 단일 소스 의존
```javascript
// ❌ 잘못된 예시
// Maxroll만 참고 → 정보 부족 시 임의 작성

// ✅ 올바른 예시
// Wowhead 검증: https://www.wowhead.com/guide/...
// Maxroll 확인: https://maxroll.gg/wow/...
```

---

## 📞 문의 및 참고

**참고 문서**:
- `src/components/ArcaneMageGuide.js`: 표준 템플릿
- `scripts/validate-guide-creation.js`: 검증 스크립트
- `VALIDATION_SYSTEM_GUIDE.md`: 검증 시스템 상세 가이드

**문의 사항**:
- 스킬 데이터 없음 → 스킬 자동 검색 시스템 활용 (SkillAutoFinder.js)
- 검증 실패 → validate-guide-creation.js 출력 메시지 확인
- 컴파일 에러 → ArcaneMageGuide.js 구조 재확인
