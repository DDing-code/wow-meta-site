# SimulationCraft 완벽 복제 프로젝트 로드맵
## 목표: 50,000줄 규모의 완전한 SimC JavaScript 구현

---

## 📊 프로젝트 개요

### 최종 목표
- **코드 규모**: 50,000줄 이상
- **정확도**: SimC 대비 95%+
- **패치 버전**: TWW3 (시즌 3) 최신
- **지원 클래스**: 13개 클래스, 40+ 전문화
- **개발 기간**: 8개 Phase, 약 3-4개월

### 현재 진행 상태
```
전체 진행도: [■■□□□□□□□□] 10% (5,000/50,000줄)

✅ 완료: 기본 프레임워크 (3,500줄)
🔄 진행중: 프로젝트 설계
⏳ 대기: 본격 구현
```

---

## 🗺️ Phase별 상세 로드맵

### **Phase 0: 프로젝트 구조 설계** [현재]
**목표**: 전체 아키텍처 설계 및 기반 준비
**예상 코드**: 500줄

```
simc-clone/
├── core/                 # 핵심 엔진
│   ├── SimulationCore.js
│   ├── EventManager.js
│   ├── RNG.js
│   └── ProfileParser.js
├── entities/            # 엔티티 시스템
│   ├── Actor.js
│   ├── Player.js
│   ├── Pet.js
│   └── Target.js
├── combat/              # 전투 시스템
│   ├── Action.js
│   ├── Spell.js
│   ├── Buff.js
│   ├── Debuff.js
│   └── Aura.js
├── mechanics/           # 게임 메커니즘
│   ├── DamageCalculation.js
│   ├── HealingCalculation.js
│   ├── ResourceGeneration.js
│   ├── Procs.js
│   └── Cooldowns.js
├── classes/            # 클래스별 구현
│   ├── warrior/
│   ├── paladin/
│   ├── hunter/
│   └── ... (13개 클래스)
├── apl/                # APL 시스템
│   ├── APLParser.js
│   ├── APLEvaluator.js
│   └── Expressions.js
├── raid/               # 레이드 메커니즘
│   ├── RaidEvents.js
│   ├── Movement.js
│   └── BossMechanics.js
├── data/               # 게임 데이터
│   ├── spells/
│   ├── items/
│   ├── talents/
│   └── coefficients/
└── analysis/           # 분석 시스템
    ├── Statistics.js
    ├── Reports.js
    └── Scaling.js
```

---

### **Phase 1: 코어 시스템 완성** (5,000줄)
**기간**: 1주
**목표**: SimC와 100% 동일한 핵심 엔진

#### 1.1 이벤트 시스템 강화 (1,000줄)
```javascript
// core/EventManager.js
class AdvancedEventManager {
  - 우선순위 큐 최적화
  - 동시 이벤트 처리
  - 이벤트 취소/수정
  - 이벤트 체인
  - 디버그 모드
}
```

#### 1.2 RNG 시스템 확장 (500줄)
```javascript
// core/RNG.js
class AdvancedRNG {
  - Mersenne Twister (완전 구현)
  - RPPM (Real PPM) 계산
  - 가우시안 분포
  - 시드 관리
}
```

#### 1.3 프로필 파서 (1,500줄)
```javascript
// core/ProfileParser.js
class ProfileParser {
  - SimC 프로필 파싱
  - 장비 파싱
  - 특성 파싱
  - 변수 처리
  - 매크로 확장
}
```

#### 1.4 전투 컨트롤러 (2,000줄)
```javascript
// core/CombatController.js
class CombatController {
  - 전투 시작/종료
  - 페이즈 관리
  - 타겟 스위칭
  - 포지션 관리
  - 인터럽트 처리
}
```

---

### **Phase 2: 데미지/힐 계산 완벽 구현** (3,000줄)
**기간**: 1주
**목표**: WoW의 정확한 수학 공식 구현

#### 2.1 데미지 계산 (1,500줄)
```javascript
// mechanics/DamageCalculation.js
class DamageCalculator {
  // 기본 데미지
  - 무기 데미지 정규화
  - AP/SP 계수
  - 스케일링 공식

  // 보정 계산
  - 방어도 경감 (정확한 공식)
  - 레벨 차이 보정
  - 글랜싱 블로우
  - 부분 저항

  // 치명타
  - 치명타 확률 계산
  - 치명타 배수
  - 메타젬 효과

  // 특수 효과
  - 다중타격
  - 관통
  - 흡수
}
```

#### 2.2 스탯 시스템 (1,000줄)
```javascript
// mechanics/StatSystem.js
class StatSystem {
  - 주 스탯 → 공격력/주문력 변환
  - 레이팅 → 퍼센트 변환 (레벨별)
  - 감소 수익 (DR) 공식
  - 캡 시스템
  - 버프/디버프 스택
}
```

#### 2.3 프록 시스템 (500줄)
```javascript
// mechanics/ProcSystem.js
class ProcSystem {
  - PPM (Procs Per Minute)
  - RPPM (Real PPM)
  - ICD (Internal Cooldown)
  - 나쁜 운 보호
}
```

---

### **Phase 3: 13개 클래스 기본 구현** (15,000줄)
**기간**: 2-3주
**목표**: 모든 클래스의 핵심 메커니즘

#### 각 클래스별 구현 (평균 1,200줄)

##### 3.1 전사 (1,200줄)
```javascript
// classes/warrior/Warrior.js
class Warrior extends Player {
  // 리소스
  - 분노 시스템

  // 핵심 메커니즘
  - 격노 스택
  - 무시무시한 강타
  - 피의 갈증

  // 전문화 기본
  - 무기/분노/방어
}
```

##### 3.2 성기사 (완료 + 확장 500줄)
```javascript
// classes/paladin/Paladin.js
- TWW3 업데이트
- 새 티어 세트
- 밸런스 변경
```

##### 3.3 사냥꾼 (1,200줄)
```javascript
// classes/hunter/Hunter.js
- 집중 시스템
- 펫 메커니즘
- 야수/사격/생존
```

##### 3.4 도적 (1,200줄)
```javascript
// classes/rogue/Rogue.js
- 기력/연계 점수
- 은신/잠행
- 암살/무법/잠행
```

##### 3.5 사제 (1,200줄)
```javascript
// classes/priest/Priest.js
- 마나/정신력
- 빛/어둠 형상
- 수양/신성/암흑
```

##### 3.6 죽음의 기사 (1,500줄)
```javascript
// classes/deathknight/DeathKnight.js
- 룬/룬 마력
- 질병 시스템
- 혈기/냉기/부정
```

##### 3.7 주술사 (1,200줄)
```javascript
// classes/shaman/Shaman.js
- 소용돌이 시스템
- 토템 메커니즘
- 정기/고양/복원
```

##### 3.8 마법사 (1,200줄)
```javascript
// classes/mage/Mage.js
- 마나/비전 충전물
- 얼음 파편/발화
- 비전/화염/냉기
```

##### 3.9 흑마법사 (1,200줄)
```javascript
// classes/warlock/Warlock.js
- 영혼 조각
- 펫 시스템
- 고통/악마/파괴
```

##### 3.10 수도사 (1,200줄)
```javascript
// classes/monk/Monk.js
- 기력/기
- 연계 타격
- 양조/운무/풍운
```

##### 3.11 드루이드 (1,500줄)
```javascript
// classes/druid/Druid.js
- 형태 변환
- 천공/분노/연계점수
- 조화/야성/수호/회복
```

##### 3.12 악마사냥꾼 (1,200줄)
```javascript
// classes/demonhunter/DemonHunter.js
- 격노/고통
- 변신 시스템
- 파멸/복수
```

##### 3.13 기원사 (1,200줄)
```javascript
// classes/evoker/Evoker.js
- 정수/마력
- 강화 시스템
- 황폐/보존/증강
```

---

### **Phase 4: 40개 전문화 상세 구현** (20,000줄)
**기간**: 3-4주
**목표**: 각 전문화의 모든 스킬과 특성

#### 전문화별 구현 (평균 500줄)

##### 예시: 전사 - 무기 (500줄)
```javascript
// classes/warrior/Arms.js
class ArmsWarrior extends Warrior {
  // 핵심 스킬
  - 죽음의 소용돌이
  - 필사의 일격
  - 거인의 강타
  - 방어 태세

  // 특성 구현
  - 클래스 트리 (30개)
  - 전문화 트리 (30개)
  - 영웅 트리 (10개)

  // APL
  - 기본 로테이션
  - 쿨다운 사용
  - AOE 로테이션
}
```

각 전문화마다:
- 30+ 스킬 구현
- 60+ 특성 구현
- 특화 효과
- 세트 보너스
- PvP 특성

---

### **Phase 5: APL 파서 완전 구현** (2,000줄)
**기간**: 1주
**목표**: SimC APL 100% 호환

#### 5.1 APL 파서 (1,000줄)
```javascript
// apl/APLParser.js
class APLParser {
  // 문법 파싱
  - 액션 파싱
  - 조건문 파싱
  - 변수 처리
  - 함수 호출

  // 조건 평가
  - 버프/디버프 체크
  - 리소스 체크
  - 타겟 조건
  - 시간 조건
}
```

#### 5.2 표현식 평가기 (1,000줄)
```javascript
// apl/ExpressionEvaluator.js
class ExpressionEvaluator {
  - 산술 연산
  - 논리 연산
  - 함수 평가
  - 변수 치환
  - 캐시 최적화
}
```

---

### **Phase 6: 레이드 메커니즘** (3,000줄)
**기간**: 1주
**목표**: 실제 레이드 환경 시뮬레이션

#### 6.1 레이드 이벤트 (1,000줄)
```javascript
// raid/RaidEvents.js
class RaidEventSystem {
  - 이동 이벤트
  - 대상 변경
  - 페이즈 전환
  - 추가 몹 소환
  - 메커니즘 처리
}
```

#### 6.2 보스 메커니즘 (1,500줄)
```javascript
// raid/BossMechanics.js
class BossMechanics {
  // Nerub-ar Palace 보스들
  - Ulgrax: 독 웅덩이, 돌진
  - Blood Queen: 흡혈, 박쥐
  - Sikran: 거미줄, 독
  - Rasha'nan: 산성 비
  - Broodtwister: 알 부화
  - Nexus-Princess: 차원 이동
  - Court: 다중 타겟
  - Anub'arak: 굴 파기
}
```

#### 6.3 이동 시스템 (500줄)
```javascript
// raid/Movement.js
class MovementSystem {
  - 위치 추적
  - 이동 시간 계산
  - 사거리 체크
  - 근접/원거리 판정
}
```

---

### **Phase 7: 최적화 및 검증** (2,000줄)
**기간**: 1주
**목표**: 성능 최적화 및 정확도 검증

#### 7.1 성능 최적화 (500줄)
```javascript
// optimization/Performance.js
- 이벤트 큐 최적화
- 메모리 관리
- 계산 캐싱
- 병렬 처리
```

#### 7.2 테스트 시스템 (1,000줄)
```javascript
// testing/TestSuite.js
class TestSuite {
  - 단위 테스트
  - 통합 테스트
  - 회귀 테스트
  - 성능 벤치마크
  - SimC 비교 검증
}
```

#### 7.3 리포트 시스템 (500줄)
```javascript
// analysis/Reports.js
class ReportGenerator {
  - DPS/HPS 통계
  - 스킬 분석
  - 버프 업타임
  - 리소스 사용률
  - 스케일 팩터
}
```

---

## 📈 예상 진행 일정

```
Week 1-2:   Phase 0-1 [■■□□□□□□□□□□□□□]  10%
Week 3:     Phase 2   [■■■□□□□□□□□□□□□]  15%
Week 4-6:   Phase 3   [■■■■■■□□□□□□□□□]  40%
Week 7-10:  Phase 4   [■■■■■■■■■□□□□□□]  65%
Week 11:    Phase 5   [■■■■■■■■■■□□□□□]  70%
Week 12:    Phase 6   [■■■■■■■■■■■■□□□]  85%
Week 13:    Phase 7   [■■■■■■■■■■■■■■■] 100%
```

---

## 🎯 핵심 성공 지표 (KPI)

### 정확도 목표
- **DPS 정확도**: SimC 대비 95%+
- **버프 업타임**: SimC 대비 98%+
- **리소스 생성**: SimC 대비 99%+
- **스킬 실행 순서**: 100% 일치

### 성능 목표
- **시뮬레이션 속도**: 1000 iterations < 10초
- **메모리 사용**: < 500MB
- **로드 시간**: < 1초

### 코드 품질
- **테스트 커버리지**: 80%+
- **문서화**: 모든 public API
- **타입 안정성**: TypeScript 변환 준비

---

## 🛠️ 기술 스택

### 필수 기술
- **JavaScript ES6+**: 클래스, async/await
- **Node.js**: 파일 시스템, 성능 측정
- **Worker Threads**: 병렬 시뮬레이션

### 선택적 향상
- **TypeScript**: 타입 안정성
- **WebAssembly**: 성능 최적화
- **React**: UI 대시보드

---

## 📝 다음 단계 (즉시 실행)

### 1. Phase 1 시작: 코어 시스템 강화
```javascript
// 오늘 구현할 것
1. EventManager 고도화
2. ProfileParser 기본 구조
3. CombatController 프레임워크
```

### 2. SimC 소스 코드 심층 분석
```bash
# 핵심 파일 분석
- engine/sim/sim.cpp (메인 루프)
- engine/player/player.cpp (플레이어 시스템)
- engine/action/action.cpp (액션 시스템)
```

### 3. 데이터 수집
```javascript
// TWW3 최신 데이터
- 스킬 계수
- 특성 효과
- 세트 보너스
- 밸런스 패치
```

---

## 💡 성공 전략

### 1. 점진적 개발
- 매일 500-1000줄 구현
- 주단위 마일스톤 체크
- 지속적인 테스트

### 2. SimC 참조
- 핵심 알고리즘 1:1 매칭
- 공식 포럼/Discord 활용
- 커밋 히스토리 분석

### 3. 커뮤니티 협력
- 오픈소스 공개
- 피드백 수렴
- 테스터 모집

---

**"50,000줄의 여정이 시작됩니다. SimC를 완벽히 이해하고 재현하는 그날까지!"**