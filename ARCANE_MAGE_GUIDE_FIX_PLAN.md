# ArcaneMageGuide.js 전사 콘텐츠 수정 계획

## 📌 개요

ArcaneMageGuide.js에는 GuideTemplate.js (분노 전사 기반)에서 아직 변환되지 않은 전사 콘텐츠가 **약 150개 이상**의 위치에 남아있습니다.

**주요 문제**:
- 전사 스킬 참조 (execute, rampage, bloodthirst, ragingBlow 등)
- 전사 리소스 용어 ("분노", "격노", "광란")
- 전사 영웅 특성 ("학살자", "산왕")
- 전사 메커니즘 ("마무리 일격 표식", "학살의 일격")

---

## 🎯 수정 우선순위

| 우선순위 | 섹션 | 라인 범위 | 예상 수정량 | 이유 |
|---------|------|----------|------------|------|
| **1 (긴급)** | 스킬 데이터 매핑 | 1094-1114 | 20줄 | 스킬 참조 오류로 페이지 크래시 가능 |
| **2 (높음)** | 핵심 메커니즘 | 489-515 | 30줄 | 게임플레이 정확성 핵심 |
| **3 (높음)** | 영웅 특성 딜링 메커니즘 | 1516-1640 | 125줄 | 가이드 신뢰도 핵심 |
| **4 (중간)** | 오프닝 시퀀스 | 1682-1789 | 100줄 | 초보자용 중요 섹션 |
| **5 (중간)** | 심화 분석 | 1953-2071 | 120줄 | 고급 플레이어용 |
| **6 (낮음)** | 스탯 가중치 | 2625-2638 | 15줄 | 시각화 섹션 |
| **7 (낮음)** | Haste 브레이크포인트 | 2654-2665 | 12줄 | 시각화 섹션 |
| **8 (낮음)** | breakpointData | 3231-3327 | 100줄 | 데이터 객체 |
| **9 (낮음)** | SimC 설정 | 3607-3617 | 10줄 | 주석 |

**총 예상 수정량**: 약 532줄

---

## 📋 섹션별 상세 수정 계획

### 1. 스킬 데이터 매핑 (Line 1094-1114) ⚡ 긴급

**현재 상태**:
```javascript
const renderTextWithSkillIcons = (text) => {
  const skillMap = {
    '광란': skillData.rampage,                    // ❌ 전사 스킬
    '피의 갈증': skillData.bloodthirst,           // ❌ 전사 스킬
    '분노의 강타': skillData.ragingBlow,          // ❌ 전사 스킬
    '마무리 일격': skillData.execute,             // ❌ 전사 스킬
    '소용돌이': skillData.whirlwind,              // ❌ 전사 스킬
    '우레 작렬': skillData.thunderBlast,          // ❌ 전사 스킬
    '무모한 희생': skillData.recklessness,        // ❌ 전사 스킬
    '분노의 베기': skillData.furiousSlash,        // ❌ 전사 스킬
    '학살자의 일격': skillData.sunfurysStrike,    // ❌ 전사 스킬 (성난태양 특성)
    '격노': skillData.enrage                      // ❌ 전사 버프
  };
};
```

**수정 후**:
```javascript
const renderTextWithSkillIcons = (text) => {
  const skillMap = {
    '비전 작렬': skillData.arcaneBlast,          // ✅ 비전 마법사 주력 스킬
    '비전 탄막': skillData.arcaneBarrage,        // ✅ 비전 충전물 소모 스킬
    '신비한 화살': skillData.arcaneMissiles,     // ✅ 번뜩임 시 사용
    '비전 보주': skillData.arcaneOrb,            // ✅ 선택 특성 (비전 충전물 생성)
    '환기': skillData.evocation,                 // ✅ 마나 회복 + 지능 버프
    '냉정': skillData.presenceOfMind,            // ✅ 즉시 시전 비전 작렬
    '비전의 여파': skillData.touchOfTheMagi,     // ✅ 핵심 버스트 메커니즘
    '시간 왜곡': skillData.timeWarp,             // ✅ 영웅의 피
    '일렁임': skillData.shimmer,                 // ✅ 이동기
    '얼음장': skillData.iceCold                  // ✅ 생존기 (네더 정밀도 특성)
  };
};
```

**검증**:
```bash
grep "skillData\.\(rampage\|bloodthirst\|execute\)" src/components/ArcaneMageGuide.js
# 출력 없음 = 성공
```

---

### 2. 핵심 메커니즘 (Line 489-515) 🔥 높음

**현재 상태**:
```javascript
{
  title: '격노 버프 관리',
  desc: '피의 갈증 또는 분노의 강타 치명타로 격노 발동',
  icon: '⚡',
  details: [
    '12초 지속 격노 버프 90%+ 유지율 달성',
    '격노 효과: 가속 25% + 피해 20% 증가',
    '분노 80+ 유지로 광란 즉시 사용 가능 상태 유지'
  ],
  why: '가속 25% + 피해 20% 증가 - 분노 전사 핵심 버프'
}
```

**수정 후**:
```javascript
{
  title: '비전 충전물 관리',
  desc: '비전 작렬 시전 시 비전 충전물 1개 생성 (최대 4중첩)',
  icon: '🔮',
  details: [
    '비전 충전물 4중첩 유지: 피해 +240%, 마나 소모 +400%',
    '4중첩 시 비전 탄막 사용하여 충전물 소모 + 폭발 딜',
    '환기 사용 시 마나 회복 + 번뜩임 부여 + 지능 버프'
  ],
  why: '비전 충전물 4중첩 → 비전 탄막 연계가 비전 마법사 핵심 딜사이클'
},
{
  title: '번뜩임 버프 활용',
  desc: '환기 또는 비전 충전물 소모 시 번뜩임 부여 (15초)',
  icon: '✨',
  details: [
    '번뜩임 효과: 신비한 화살 즉시 시전 + 피해 증가',
    '신비한 화살 5발을 빠르게 발사하여 높은 순간 딜',
    '환기 사용 시 번뜩임 자동 부여'
  ],
  why: '번뜩임 시간 동안 신비한 화살로 폭발적 딜 가능'
},
{
  title: '마나 관리 전략',
  desc: '30% 이하 시 환기 사용, 70% 이상 유지 목표',
  icon: '💧',
  details: [
    '비전 작렬 4중첩 시 마나 소모량 5배 증가',
    '환기 (90초 쿨): 3초간 마나 회복 속도 1500% + 번뜩임',
    '마나 30% 이하 시 환기 사용 권장'
  ],
  why: '마나 부족 시 딜 급격히 하락 → 환기 타이밍이 핵심'
}
```

**검증**:
```bash
grep "격노\|광란\|분노의 강타" src/components/ArcaneMageGuide.js | grep -n "mechanics:"
# 출력 없음 = 성공
```

---

### 3. 영웅 특성 딜링 메커니즘 (Line 1516-1640) 🔥 높음

**현재 상태**:
```javascript
<strong style={{ color: '#FF6B6B' }}>학살자 (Slayer)</strong>는 {' '}
출혈 피해와 <SkillIcon skill={skillData.execute} textOnly={true} /> 강화를 통한 {' '}
버스트 중심의 플레이를 제공합니다.
<SkillIcon skill={skillData.execute} textOnly={true} /> 사용 시 대상에게
<strong>마무리 일격 표식</strong>을 부여하고, 2중첩 이상일 때 피해가 20% 증가합니다.
```

**수정 후**:
```javascript
<strong style={{ color: '#FF8C42' }}>성난태양 (Sunfury)</strong>은 {' '}
비전과 화염 마법의 융합을 통한 {' '}
폭발적 버스트 플레이를 제공합니다.
<SkillIcon skill={skillData.arcaneBlast} textOnly={true} /> 사용 시 {' '}
<strong>뜨거운 연쇄</strong> 중첩을 획득하고 (최대 10중첩), 중첩당 다음 {' '}
<SkillIcon skill={skillData.fireball} textOnly={true} />의 피해가 10% 증가합니다.

<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong style={{ color: '#3FC6EA' }}>핵심 메커니즘</strong>은 비전 충전물 관리입니다.
  <SkillIcon skill={skillData.arcaneBlast} textOnly={true} /> 4중첩 시 {' '}
  <SkillIcon skill={skillData.arcaneBarrage} textOnly={true} />를 사용하여 {' '}
  막대한 비전 피해를 입히고, 뜨거운 연쇄 중첩을 소모하여 {' '}
  <SkillIcon skill={skillData.fireball} textOnly={true} />로 추가 화염 피해를 입힙니다.
</p>

<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong style={{ color: '#ffa500' }}>마나 관리</strong>가 성난태양의 핵심입니다.
  <SkillIcon skill={skillData.evocation} textOnly={true} /> 사용 시 {' '}
  마나 회복 속도가 1500%만큼 증가하고, 번뜩임 버프가 부여되며, {' '}
  3초 동안 지능이 최대 12%까지 증가합니다.
  환기는 90초 쿨다운이므로 마나가 30% 이하일 때 사용하는 것이 최적입니다.
</p>

{/* ... 5-7개 메커니즘 더 */}

<p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
  <strong style={{ color: '#64B5F6' }}>주문술사 (Spellslinger)</strong>는 {' '}
  순수 비전 마법에 특화되어 있으며, {' '}
  <SkillIcon skill={skillData.arcaneOrb} textOnly={true} />와 {' '}
  <SkillIcon skill={skillData.presenceOfMind} textOnly={true} />를 통한 {' '}
  즉시 시전 비전 작렬로 높은 안정성을 제공합니다.
</p>

{/* ... 주문술사 메커니즘 5-7문단 */}
```

**변환 체크리스트**:
- [ ] "학살자 (Slayer)" → "성난태양 (Sunfury)"
- [ ] "산왕 (Mountain Thane)" → "주문술사 (Spellslinger)"
- [ ] execute, rampage 등 전사 스킬 → arcaneBlast, arcaneBarrage 등
- [ ] "격노 버프" → "번뜩임 버프"
- [ ] "분노 80 이상" → "마나 70% 이상"
- [ ] "광란 사용" → "비전 탄막 사용"

---

### 4. 오프닝 시퀀스 (Line 1682-1789) 📝 중간

**현재 상태**:
```javascript
⚠️ <strong>격노 미발동 시:</strong> {renderTextWithSkillIcons('피의 갈증 → 분노의 강타 + 광란 먼저 사용 후 버스트 진행')}
```

**수정 후**:
```javascript
⚠️ <strong>마나 부족 시 (30% 이하):</strong> {renderTextWithSkillIcons('환기 사용 → 번뜩임으로 신비한 화살 → 비전 작렬로 충전물 재생성')}
```

**오프닝 시퀀스 전체 재작성 필요**:
```javascript
// 성난태양 - 단일 대상
renderTextWithSkillIcons('전투 전 준비 → 비전 작렬 4중첩 → 비전 보주 → 비전의 여파 → 냉정 → 비전 작렬 × 2 → 비전 탄막')

// 성난태양 - 광역 (3+ 적)
renderTextWithSkillIcons('전투 전 준비 → 비전 작렬 4중첩 → 비전 폭발 → 비전의 여파 → 비전 보주 → 비전 폭발')

// 주문술사 - 단일 대상
renderTextWithSkillIcons('전투 전 준비 → 비전 보주 → 비전 작렬 4중첩 → 냉정 → 비전 작렬 × 2 → 비전 탄막 → 비전의 여파')
```

---

### 5. 심화 분석 (Line 1953-2071) 📊 중간

**현재 상태**:
```javascript
⚡ 격노 버프 유지율 극대화 (90%+ 목표)

<ul style={{ listStyle: 'none', padding: '0 0 0 15px' }}>
  <li style={{ marginBottom: '12px' }}>
    <strong style={{ color: '#ffa500' }}>격노 지속시간:</strong> 12초 (가속 25% + 피해 20% 증가)
  </li>
  <li style={{ marginBottom: '12px' }}>
    <strong>트리거 스킬:</strong> <SkillIcon skill={skillData.bloodthirst} textOnly={true} /> (4.5초 쿨) 또는 <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> 치명타
  </li>
</ul>
```

**수정 후**:
```javascript
⚡ 비전 충전물 최적화 (4중첩 유지 + 탄막 타이밍)

<ul style={{ listStyle: 'none', padding: '0 0 0 15px' }}>
  <li style={{ marginBottom: '12px' }}>
    <strong style={{ color: '#3FC6EA' }}>비전 충전물 효과:</strong> 충전물당 피해 +60%, 마나 소모 +100%, 시전 시간 -8%
  </li>
  <li style={{ marginBottom: '12px' }}>
    <strong>생성 스킬:</strong> <SkillIcon skill={skillData.arcaneBlast} textOnly={true} /> (시전마다 1중첩, 최대 4중첩)
  </li>
  <li style={{ marginBottom: '12px' }}>
    <strong style={{ color: '#ff6b6b' }}>핵심 원칙:</strong> 4중첩 → <SkillIcon skill={skillData.arcaneBarrage} textOnly={true} /> 사용하여 모든 충전물 소모 + 폭발 딜
  </li>
  <li style={{ marginBottom: '12px' }}>
    <strong>효율 관리:</strong> 비전 충전물 4중첩에서 마나가 충분하면 1-2회 더 <SkillIcon skill={skillData.arcaneBlast} textOnly={true} /> 후 탄막
  </li>
  <li style={{ marginBottom: '12px' }}>
    <strong style={{ color: '#FFD700' }}>티어 2세트:</strong> <SkillIcon skill={skillData.arcaneBarrage} textOnly={true} /> 사용 시 비전의 여파 발동 확률 증가
  </li>
</ul>
```

**추가 섹션**:
- "마무리 일격 표식 시스템" → "번뜩임 버프 최적화"
- "분노 게이지 관리" → "마나 게이지 관리"

---

### 6. 스탯 가중치 (Line 2625-2638) 📈 낮음

**현재 상태**:
```javascript
<strong style={{ color: '#ffa500' }}>무기 DPS:</strong> <span style={{ color: '#ccc' }}>6.50-7.00</span>
<strong style={{ color: '#28a745' }}>치명타:</strong> <span style={{ color: '#ccc' }}>0.85-0.95</span>
```

**수정 후**:
```javascript
<strong style={{ color: '#3FC6EA' }}>지능:</strong> <span style={{ color: '#ccc' }}>1.00</span> (기준)
<strong style={{ color: '#ffa500' }}>가속:</strong> <span style={{ color: '#ccc' }}>0.95-1.00</span>
<strong style={{ color: '#9c27b0' }}>유연:</strong> <span style={{ color: '#ccc' }}>0.85-0.90</span>
<strong style={{ color: '#FFD700' }}>특화:</strong> <span style={{ color: '#ccc' }}>0.80-0.85</span>
<strong style={{ color: '#28a745' }}>치명타:</strong> <span style={{ color: '#ccc' }}>0.75-0.80</span>
```

**참고**: Wowhead/Icy-veins 확인 결과:
- 지능 > 가속 > 유연 > 특화 > 치명타

---

### 7. Haste 브레이크포인트 (Line 2654-2665) ⏱️ 낮음

**현재 상태**:
```javascript
GCD 감소와 분노 생성 속도 향상, 격노 유지율 증가
```

**수정 후**:
```javascript
GCD 감소와 비전 작렬 시전 속도 향상, 마나 효율 증가. 가속 20.7% 달성 시 비전 작렬 시전 시간 2.0초 → 1.6초로 감소
```

**비전 마법사 가속 브레이크포인트**:
- 10%: 비전 작렬 GCD 1.4초
- 15%: 비전 작렬 시전 1.7초
- **20.7%**: 비전 작렬 시전 1.6초 (권장 목표)
- 30%: 비전 작렬 시전 1.5초 (오버캡 주의)

---

### 8. breakpointData (Line 3231-3327) 📊 낮음

**현재 상태**:
```javascript
sunfury: {  // 학살자 (Slayer) ❌
  single: {
    haste: {
      note: 'GCD 감소와 분노 생성 속도 향상, 격노 유지율 증가' // ❌
    }
  }
}
```

**수정 후**:
```javascript
sunfury: {  // 성난태양 (Sunfury) ✅
  single: {
    haste: {
      target: 20.7,
      note: '비전 작렬 시전 시간 1.6초 달성, 마나 효율 최적화',
      impact: '시전 속도 향상으로 DPS 5-7% 증가'
    },
    mastery: {
      target: 25,
      note: '비전 피해 증폭, 성난태양 융합 효과 증가',
      impact: '특화 30% 이상 시 비전 작렬 피해 약 12% 증가'
    },
    versatility: {
      target: 15,
      note: '모든 피해 및 회복 증가, 받는 피해 감소',
      impact: '유연 15% = 피해 +7.5%, 받는 피해 -7.5%'
    }
  },
  aoe: {
    haste: {
      target: 20.7,
      note: '비전 폭발 시전 속도 향상, 광역 DPS 증가',
      impact: '가속 20%+ 시 비전 폭발 반복 속도 향상으로 광역 딜 8-10% 증가'
    }
  }
},
spellslinger: {  // 주문술사 (Spellslinger) ✅
  single: {
    // ... 동일 구조
  }
}
```

---

### 9. SimC 설정 (Line 3607-3617) ⚙️ 낮음

**현재 상태**:
```javascript
# 가속: 분노 생성 및 격노 유지
# 치명타: 격노 발동 확률
```

**수정 후**:
```javascript
# 가속: 비전 작렬 시전 속도 및 GCD 감소 (20.7% 목표)
# 유연: 모든 피해 증가 및 생존력
# 특화: 비전 피해 증폭
# 치명타: 비전의 여파 발동 확률 증가
```

---

## ✅ 검증 체크리스트

### 전사 콘텐츠 완전 제거 확인

```bash
# 1. 전사 리소스 용어
grep -i "분노\|격노\|광란" src/components/ArcaneMageGuide.js
# 출력 없음 = 성공

# 2. 전사 스킬
grep "execute\|rampage\|bloodthirst\|ragingBlow" src/components/ArcaneMageGuide.js
# 출력 없음 = 성공

# 3. 전사 영웅 특성
grep "학살자\|산왕\|Slayer\|Mountain Thane" src/components/ArcaneMageGuide.js
# 출력 없음 = 성공

# 4. 전사 메커니즘
grep "마무리 일격 표식\|학살의 일격" src/components/ArcaneMageGuide.js
# 출력 없음 = 성공
```

### 비전 마법사 콘텐츠 올바른 적용 확인

```bash
# 1. 비전 마법사 리소스
grep -i "마나\|비전 충전물\|번뜩임" src/components/ArcaneMageGuide.js | wc -l
# 50+ 개 이상 = 성공

# 2. 비전 마법사 스킬
grep "arcaneBlast\|arcaneBarrage\|evocation" src/components/ArcaneMageGuide.js | wc -l
# 30+ 개 이상 = 성공

# 3. 비전 마법사 영웅 특성
grep "성난태양\|주문술사\|Sunfury\|Spellslinger" src/components/ArcaneMageGuide.js | wc -l
# 10+ 개 이상 = 성공
```

### 빌드 테스트

```bash
cd wow-meta-site
npm run build

# 빌드 성공 = 모든 스킬 참조 오류 해결됨
# 빌드 실패 = skillData.execute 같은 누락 참조 확인 필요
```

---

## 📅 작업 일정 (예상)

| 단계 | 작업 | 예상 시간 | 우선순위 |
|------|------|----------|---------|
| 1 | 스킬 데이터 매핑 (Line 1094-1114) | 10분 | 긴급 |
| 2 | 핵심 메커니즘 (Line 489-515) | 20분 | 높음 |
| 3 | 영웅 특성 딜링 메커니즘 (Line 1516-1640) | 60분 | 높음 |
| 4 | 오프닝 시퀀스 (Line 1682-1789) | 40분 | 중간 |
| 5 | 심화 분석 (Line 1953-2071) | 50분 | 중간 |
| 6 | 스탯 가중치 (Line 2625-2638) | 10분 | 낮음 |
| 7 | Haste 브레이크포인트 (Line 2654-2665) | 10분 | 낮음 |
| 8 | breakpointData (Line 3231-3327) | 30분 | 낮음 |
| 9 | SimC 설정 (Line 3607-3617) | 5분 | 낮음 |
| 10 | 검증 및 테스트 | 20분 | 필수 |

**총 예상 시간**: 약 4시간

---

## 🚨 주의사항

1. **사용자 제공 링크만 사용**: "뇌피셜"로 작성 금지
2. **Wowhead 검증 필수**: 모든 스킬명, 메커니즘은 ko.wowhead.com에서 확인
3. **스킬 데이터 우선**: arcaneMageSkillData.js에 정의된 스킬만 사용
4. **단계별 빌드 테스트**: 각 섹션 수정 후 `npm run build` 실행
5. **리소스 시스템 일관성**: "분노" → "마나", "격노" → "번뜩임" 등 일관되게 변환

---

## 📚 참고 자료

### 비전 마법사 리소스 시스템
- **주 리소스**: 마나 (0-100%)
- **부 리소스**: 비전 충전물 (0-4)
- **핵심 버프**: 번뜩임 (15초), 비전의 여파 (12초)
- **주요 쿨기**: 환기 (90초), 냉정 (60초)

### 영웅 특성 (TWW 시즌 3)
- **성난태양 (Sunfury)**: 비전+화염 융합, 뜨거운 연쇄 중첩
- **주문술사 (Spellslinger)**: 순수 비전, 비전 보주 + 냉정 활용

### 스탯 우선순위 (Wowhead/Icy-veins 기준)
```
지능 > 가속 (20.7% 목표) > 유연 > 특화 > 치명타
```

---

**작성일**: 2025-01-04 (계획)
**기준 패치**: TWW 시즌 3 (11.2)
**템플릿 기반**: GuideTemplate.js (FuryWarriorGuide.js 4,065줄)
