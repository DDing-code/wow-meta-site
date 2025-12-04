# WoW 전문화 가이드 제작 - 단순화 버전 (2025-01-10)

## 📌 핵심 원칙

**ArcaneMageGuide.js = 유일한 표준 템플릿**

- ✅ 컴파일 에러 0개
- ✅ 모든 섹션 완성
- ✅ 검증 완료

---

## 🎯 AI(Claude Code)가 참조할 문서 (3개만!)

### 1. ARCANE_MAGE_GUIDE_CHECKLIST.md (메인 지침)
**용도**: 가이드 제작 8단계 체크리스트

**내용**:
- Step 1: ArcaneMageGuide.js 복사
- Step 2: 클래스/전문화명 교체
- Step 3: 스킬 데이터 파일 생성
- Step 4: 영웅 특성 2개 교체
- Step 5: 티어 세트 효과 교체
- Step 6: 스탯 우선순위 교체
- Step 7: 로테이션 우선순위 교체
- Step 8: 검증 실행

### 2. src/components/ArcaneMageGuide.js (템플릿)
**용도**: 복사할 표준 템플릿 파일

**특징**:
- 영웅 특성 2개 (Sunfury, Spellslinger)
- 완전한 로테이션 (Opener + Priority)
- 티어 세트, 스탯, 빌드 모두 포함

### 3. scripts/validate-guide-creation.js (검증)
**용도**: 자동 검증 스크립트

**사용법**:
```bash
node scripts/validate-guide-creation.js src/components/YourGuide.js className specName --phase post
```

---

## ❌ 절대 금지

1. **GuideTemplate.js 사용** (오래된 분노 전사 기반)
2. **다른 가이드 복사** (FrostDeathKnightGuide.js 등)
3. **처음부터 새로 작성**
4. **WOW_GUIDE_TEMPLATE_MANUAL.md 참조** (너무 복잡함, 3,520줄)

---

## 🚀 빠른 시작 (1분)

```bash
# 1. ArcaneMageGuide.js 복사
cp src/components/ArcaneMageGuide.js src/components/ElementalShamanGuide.js

# 2. 체크리스트 확인
cat ARCANE_MAGE_GUIDE_CHECKLIST.md

# 3. 검증
node scripts/validate-guide-creation.js src/components/ElementalShamanGuide.js shaman elemental --phase post
```

---

## 📚 문서 우선순위

| 순위 | 문서 | 용도 | 참조 빈도 |
|------|------|------|----------|
| 1 | `ARCANE_MAGE_GUIDE_CHECKLIST.md` | 메인 지침 | 항상 |
| 2 | `src/components/ArcaneMageGuide.js` | 템플릿 | 복사 시 |
| 3 | `scripts/validate-guide-creation.js` | 검증 | 완성 후 |
| ❌ | `WOW_GUIDE_TEMPLATE_MANUAL.md` | 참고용 | 사용 안 함 |
| ❌ | `GuideTemplate.js` | 레거시 | 사용 안 함 |
| ❌ | `VALIDATION_SYSTEM_GUIDE.md` | 참고용 | 사용 안 함 |

---

## 🔍 검증 명령어

### Pre (사전 검증)
```bash
node scripts/validate-guide-creation.js src/components/YourGuide.js className specName --phase pre
```

### During (실시간 검증)
```bash
node scripts/validate-guide-creation.js src/components/YourGuide.js className specName --phase during
```

### Post (사후 검증)
```bash
node scripts/validate-guide-creation.js src/components/YourGuide.js className specName --phase post
```

---

## 📝 예시: 정기 주술사 가이드

### Step 1: 복사
```bash
cp src/components/ArcaneMageGuide.js src/components/ElementalShamanGuide.js
```

### Step 2: import 교체
```javascript
// Before
import { arcaneMageSkills as skillData } from '../data/arcaneMageSkillData';

// After
import { elementalShamanSkills as skillData } from '../data/elementalShamanSkillData';
```

### Step 3: 검증
```bash
node scripts/validate-guide-creation.js src/components/ElementalShamanGuide.js shaman elemental --phase during
```

**예상 출력**:
```
❌ 3개의 문제 발견:

🔴 CRITICAL (즉시 수정 필수):
1. ❌ 템플릿 키워드가 2개 남아있습니다: 비전 마법사
   해결책: ArcaneMageGuide.js의 모든 "비전 마법사" 키워드를 "정기 주술사"로 교체하세요.
```

### Step 4: 수정 후 재검증
```bash
node scripts/validate-guide-creation.js src/components/ElementalShamanGuide.js shaman elemental --phase post
```

**성공 출력**:
```
✅ 모든 검증 통과!
```

---

## 🎯 품질 기준

- [ ] ArcaneMageGuide.js 복사했는가?
- [ ] ARCANE_MAGE_GUIDE_CHECKLIST.md 8단계 완료했는가?
- [ ] 검증 스크립트 통과했는가? (CRITICAL 0개)
- [ ] npm run build 성공했는가?

---

## 📞 문의

**참조 문서**:
- `ARCANE_MAGE_GUIDE_CHECKLIST.md`: 8단계 체크리스트
- `src/components/ArcaneMageGuide.js`: 표준 템플릿
- `scripts/validate-guide-creation.js`: 검증 스크립트

**참조 금지 문서** (AI 혼란 방지):
- ❌ `WOW_GUIDE_TEMPLATE_MANUAL.md` (3,520줄, 너무 복잡)
- ❌ `GuideTemplate.js` (분노 전사 기반, 오래됨)
- ❌ `VALIDATION_SYSTEM_GUIDE.md` (참고용)

---

## 🔄 버전 관리

**버전**: v2.0 (단순화 버전)
**작성일**: 2025-01-10
**기준 템플릿**: ArcaneMageGuide.js
**AI 참조 문서**: 3개 (CHECKLIST, ArcaneMageGuide.js, validate-guide-creation.js)
