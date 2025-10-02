# WoW 스킬 데이터베이스 재구축 계획

## 현재 문제점
1. **데이터 일관성 부족**: 칼날폭풍 같은 스킬의 잘못된 매핑
2. **전문화별 차이 미반영**: 희생의 축복 등이 전문화별 효과 차이를 반영하지 못함
3. **데이터 소스 혼재**: Lua 파일, massive-update 파일, wowhead 데이터가 체계 없이 병합
4. **검증 시스템 부재**: 잘못된 데이터를 걸러낼 수 없음

## 새로운 DB 구축 프로세스

### 1단계: 데이터 구조 설계
```javascript
{
  "skillId": {
    "base": {
      "id": "스킬ID",
      "name": "영문명",
      "koreanName": "한글명",
      "icon": "아이콘명",
      "class": "클래스",
      "level": "습득레벨",
      "type": "ability|talent|pvp",
      "school": "물리|신성|화염|냉기|자연|암흑|비전"
    },
    "mechanics": {
      "cooldown": "재사용대기시간",
      "gcd": true/false,
      "castTime": "시전시간",
      "range": "사거리",
      "areaOfEffect": "효과범위",
      "duration": "지속시간",
      "charges": "충전횟수",
      "rechargeTime": "재충전시간"
    },
    "resource": {
      "cost": {
        "type": "마나|분노|기력|룬마력|집중|영혼조각|신성한힘|연계점수|기|격노|고통|정수",
        "amount": "수량",
        "percentage": true/false
      },
      "generate": {
        "type": "자원타입",
        "amount": "생성량"
      }
    },
    "specializations": {
      "specName1": {
        "available": true/false,
        "rank": "순위",
        "modifier": "전문화별 추가효과",
        "description": "전문화별 설명"
      },
      "specName2": {
        ...
      }
    },
    "effects": {
      "damage": {
        "type": "직접|지속|주기적",
        "formula": "피해공식",
        "coefficient": "계수"
      },
      "healing": {
        "type": "직접|지속|주기적",
        "formula": "치유공식",
        "coefficient": "계수"
      },
      "buffs": [],
      "debuffs": []
    },
    "talents": {
      "modifies": ["영향받는 스킬ID들"],
      "tier": "특성단계",
      "row": "특성줄",
      "column": "특성칸"
    },
    "pvp": {
      "modifier": "PvP 보정값",
      "honorTalent": true/false
    },
    "description": {
      "base": "기본설명",
      "detailed": "상세설명",
      "tooltip": "툴팁설명"
    },
    "metadata": {
      "patch": "패치버전",
      "lastUpdated": "최종수정일",
      "verified": true/false,
      "source": "데이터출처"
    }
  }
}
```

### 2단계: 데이터 소스 우선순위

#### 우선순위 1: Wowhead API/Web (최신 정보)
- 실시간 패치 반영
- 정확한 수치와 공식
- 전문화별 차이 포함
- 아이콘 정보

#### 우선순위 2: 게임 내 데이터 (Lua 파일)
- 한글 번역
- 기본 메타데이터
- 자원 소모/생성 정보

#### 우선순위 3: 커뮤니티 데이터
- 누락된 정보 보충
- 사용자 피드백 반영

### 3단계: 데이터 수집 자동화

#### A. Wowhead 크롤러
```javascript
// wowhead-crawler.js
class WowheadCrawler {
  async fetchSpellData(spellId, locale = 'ko') {
    // 1. 기본 정보 수집
    const baseUrl = `https://${locale}.wowhead.com/spell=${spellId}`;

    // 2. JSON-LD 데이터 추출
    // 3. 툴팁 데이터 파싱
    // 4. 전문화별 차이 확인
    // 5. 관련 특성 연결
  }

  async fetchClassSpells(className) {
    // 클래스별 모든 스킬 목록
    // 전문화별 분류
    // 특성 트리 정보
  }
}
```

#### B. Lua 파서 개선
```javascript
// lua-parser-advanced.js
class LuaParser {
  parseWithContext(content) {
    // 1. 스킬 ID별 그룹핑
    // 2. 전문화 태그 파싱
    // 3. 조건부 효과 파싱
    // 4. 변수 치환 처리
  }

  validateData(parsed) {
    // 필수 필드 검증
    // 데이터 타입 검증
    // 범위 검증
  }
}
```

### 4단계: 데이터 병합 및 검증

#### 병합 규칙
1. **ID 충돌 해결**: 동일 ID에 다른 스킬이 매핑된 경우
   - Wowhead 데이터 우선
   - 클래스/전문화 컨텍스트 확인
   - 수동 검증 대상 플래그

2. **전문화별 차이 처리**
   - 기본 스킬 정보는 base에 저장
   - 전문화별 변경사항은 specializations에 저장
   - 특성으로 인한 변경은 talents에 저장

3. **버전 관리**
   - 패치별 변경사항 추적
   - 이전 버전 데이터 보관
   - 변경 이력 기록

### 5단계: 검증 시스템

#### 자동 검증
```javascript
class DataValidator {
  validate(skill) {
    const errors = [];

    // 1. 필수 필드 검증
    if (!skill.base.id) errors.push('ID 누락');
    if (!skill.base.name) errors.push('이름 누락');

    // 2. 데이터 타입 검증
    if (skill.mechanics.cooldown && !this.isValidTime(skill.mechanics.cooldown)) {
      errors.push('잘못된 재사용 대기시간 형식');
    }

    // 3. 논리적 일관성
    if (skill.resource.cost && skill.resource.generate) {
      // 동일 자원을 소모하면서 생성할 수 없음
      if (skill.resource.cost.type === skill.resource.generate.type) {
        errors.push('자원 소모/생성 충돌');
      }
    }

    // 4. 전문화 검증
    if (skill.specializations) {
      // 클래스에 존재하는 전문화인지 확인
    }

    return errors;
  }
}
```

#### 수동 검증
- 주요 스킬 샘플링 검사
- 커뮤니티 피드백 수렴
- 게임 내 실제 데이터와 대조

### 6단계: 구현 계획

#### Phase 1: 인프라 구축 (1주)
- [ ] 데이터 구조 정의
- [ ] Wowhead 크롤러 개발
- [ ] Lua 파서 개선
- [ ] 검증 시스템 구축

#### Phase 2: 데이터 수집 (2주)
- [ ] 13개 클래스 기본 스킬 수집
- [ ] 40개 전문화별 스킬 수집
- [ ] 특성 트리 데이터 수집
- [ ] PvP 특성 수집

#### Phase 3: 데이터 처리 (1주)
- [ ] 데이터 병합
- [ ] 전문화별 차이 처리
- [ ] 검증 및 수정
- [ ] 최적화

#### Phase 4: 통합 및 테스트 (1주)
- [ ] UI 통합
- [ ] 성능 테스트
- [ ] 사용자 테스트
- [ ] 버그 수정

### 7단계: 유지보수 계획

#### 자동 업데이트
- 패치 노트 모니터링
- 정기적 Wowhead 크롤링
- 변경사항 자동 감지

#### 수동 업데이트
- 주요 패치 시 전체 검증
- 커뮤니티 피드백 반영
- 오류 보고 처리

## 예시: 희생의 축복 처리

```javascript
{
  "6940": {
    "base": {
      "id": "6940",
      "name": "Blessing of Sacrifice",
      "koreanName": "희생의 축복",
      "icon": "spell_holy_sealofsacrifice",
      "class": "Paladin",
      "level": 32,
      "type": "ability"
    },
    "mechanics": {
      "cooldown": "120초",
      "gcd": true,
      "castTime": "즉시",
      "range": "40 야드",
      "duration": "12초"
    },
    "specializations": {
      "holy": {
        "available": true,
        "modifier": "받는 피해 30% 전이",
        "description": "축복받은 대상이 받는 모든 피해의 30%를 대신 받습니다."
      },
      "protection": {
        "available": true,
        "modifier": "받는 피해 30% 전이, 추가로 피해 감소 효과",
        "description": "축복받은 대상이 받는 모든 피해의 30%를 대신 받습니다. 보호 전문화는 추가 피해 감소를 받습니다.",
        "talents": {
          "sacrifice_of_the_just": "전이된 피해가 20% 감소"
        }
      },
      "retribution": {
        "available": true,
        "modifier": "받는 피해 30% 전이",
        "description": "축복받은 대상이 받는 모든 피해의 30%를 대신 받습니다."
      }
    }
  }
}
```

## 구현 우선순위

1. **긴급**: 핵심 전투 스킬 (DPS 로테이션)
2. **높음**: 생존기, 유틸리티 스킬
3. **중간**: 특성 스킬, 패시브
4. **낮음**: PvP 특성, 레거시 스킬

## 성공 지표

- 데이터 정확도 95% 이상
- 전문화별 차이 100% 반영
- 자동 검증 통과율 90% 이상
- 사용자 오류 보고 < 1%
- 패치 반영 시간 < 48시간