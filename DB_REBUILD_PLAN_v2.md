# WoW 스킬 데이터베이스 재구축 계획 v2
## TWW 시즌 3 기준 (11.2 패치)

## 핵심 원칙
1. **TWW 시즌 3 (11.2) 최신 데이터만 사용**
2. **설명 텍스트는 원본 그대로 보존**
3. **스킬 구조와 메커니즘 정확히 파악**
4. **전문화별 차이 완벽 반영**

## 데이터 소스 (우선순위)

### 1순위: Wowhead TWW 시즌 3 데이터
- 11.2 패치 반영된 최신 정보
- 정확한 수치와 공식
- 전문화별 차이 포함
- 아이콘 및 메타데이터

### 2순위: 게임 내 Lua 파일 (한글 번역용)
- 한글 번역 텍스트만 추출
- 설명은 수정하지 않고 그대로 사용
- 메타데이터 참조용

## 스킬 구조 이해를 위한 데이터 모델

```javascript
{
  "skillId": {
    // === 기본 정보 (변경 없음) ===
    "base": {
      "id": "스킬ID",
      "name": "영문명",
      "koreanName": "한글명",
      "icon": "아이콘명",
      "class": "클래스",
      "patch": "11.2"  // TWW 시즌 3
    },

    // === 스킬 분류 (정확한 구조 파악) ===
    "classification": {
      "category": "baseline|talent|pvp|heroTalent",  // 스킬 종류
      "specialization": ["holy", "protection", "retribution"],  // 사용 가능한 전문화
      "heroTree": "herald_of_the_sun|lightsmith|templar",  // 영웅 특성 트리 (TWW)
      "type": "active|passive|proc",  // 활성/패시브/발동형
      "school": "physical|holy|fire|frost|nature|shadow|arcane"  // 주문 계열
    },

    // === 메커니즘 (정확한 작동 방식) ===
    "mechanics": {
      "cooldown": {
        "base": "120초",
        "charges": 1,
        "rechargeTime": null,
        "affectedByHaste": false
      },
      "cast": {
        "castTime": "즉시|2.5초",
        "channeled": false,
        "interruptible": true,
        "gcd": {
          "onGcd": true,
          "duration": "1.5초"
        }
      },
      "targeting": {
        "type": "self|target|ground|cone|aoe",
        "range": "40야드",
        "radius": "8야드",
        "maxTargets": 5
      },
      "duration": {
        "base": "12초",
        "extendable": true,
        "maxDuration": "20초"
      }
    },

    // === 자원 시스템 (정확한 소모/생성) ===
    "resources": {
      "cost": {
        "mana": { "amount": "10", "percentage": true },
        "holyPower": { "amount": "3", "percentage": false },
        "rage": null,
        "energy": null
      },
      "generate": {
        "holyPower": { "amount": "1", "conditions": "크리티컬 시" },
        "rage": null
      },
      "requirement": {
        "holyPower": { "minimum": "3", "description": "3개 이상 필요" }
      }
    },

    // === 전문화별 차이 (핵심) ===
    "specializationDetails": {
      "holy": {
        "available": true,
        "rank": 1,  // 스킬북 순서
        "modifications": {
          "cooldown": "90초",  // 신성은 재사용 대기시간 감소
          "additionalEffect": "추가로 빛의 자락 효과 부여",
          "coefficient": 1.2  // 계수 차이
        },
        "talents": {
          "affecting": ["talentId1", "talentId2"],  // 영향 주는 특성
          "requiredFor": ["talentId3"]  // 선행 조건
        }
      },
      "protection": {
        "available": true,
        "rank": 1,
        "modifications": {
          "cooldown": "120초",
          "additionalEffect": "피해 감소 20% 추가",
          "generates": {
            "holyPower": 1  // 보호는 신성한 힘 생성
          }
        }
      },
      "retribution": {
        "available": false  // 징벌은 사용 불가
      }
    },

    // === 특성 상호작용 ===
    "talentInteractions": {
      "modifiedBy": [
        {
          "talentId": "12345",
          "talentName": "축복받은 망치",
          "effect": "재사용 대기시간 30초 감소"
        }
      ],
      "modifies": [
        {
          "skillId": "67890",
          "skillName": "심판",
          "effect": "심판 사용 시 2회 충전"
        }
      ],
      "replaces": null,  // 대체하는 스킬
      "replacedBy": null  // 대체되는 조건
    },

    // === 영웅 특성 (TWW 신규) ===
    "heroTalents": {
      "herald_of_the_sun": {
        "available": ["holy", "retribution"],
        "modifications": {
          "auraDuration": "+4초",
          "auraRange": "+5야드"
        }
      },
      "lightsmith": {
        "available": ["holy", "protection"],
        "modifications": {
          "holyWeaponChance": "20%",
          "holyWeaponDamage": "+15%"
        }
      }
    },

    // === 조건부 효과 ===
    "conditionalEffects": [
      {
        "condition": "대상 체력 20% 이하",
        "effect": "처형 효과 - 피해 200% 증가"
      },
      {
        "condition": "응징의 격노 활성화 중",
        "effect": "재사용 대기시간 무시"
      }
    ],

    // === 설명 (원본 그대로) ===
    "description": {
      "korean": "원본 한글 설명 그대로",  // 수정 금지
      "english": "원본 영문 설명 그대로"  // 수정 금지
    },

    // === 메타데이터 ===
    "metadata": {
      "patch": "11.2.0",
      "season": "TWW Season 3",
      "lastUpdated": "2024-01-20",
      "verified": true,
      "dataSource": "wowhead|lua"
    }
  }
}
```

## 예시: 희생의 축복 (정확한 구조 파악)

```javascript
{
  "6940": {
    "base": {
      "id": "6940",
      "name": "Blessing of Sacrifice",
      "koreanName": "희생의 축복",
      "icon": "spell_holy_sealofsacrifice",
      "class": "Paladin",
      "patch": "11.2"
    },

    "classification": {
      "category": "baseline",  // 기본 스킬
      "specialization": ["holy", "protection", "retribution"],
      "type": "active",
      "school": "holy"
    },

    "mechanics": {
      "cooldown": {
        "base": "120초",
        "charges": 1,
        "affectedByHaste": false
      },
      "cast": {
        "castTime": "즉시",
        "gcd": { "onGcd": true, "duration": "1.5초" }
      },
      "targeting": {
        "type": "target",
        "range": "40야드"
      },
      "duration": {
        "base": "12초"
      }
    },

    "specializationDetails": {
      "holy": {
        "available": true,
        "modifications": {
          // 신성: 기본 효과만
          "transferAmount": "30%"
        }
      },
      "protection": {
        "available": true,
        "modifications": {
          "transferAmount": "30%",
          "additionalEffect": "전이 피해 20% 감소 (특성 있을 시)"
        },
        "talents": {
          "affecting": ["sacrifice_of_the_just"]  // 보호 전용 특성
        }
      },
      "retribution": {
        "available": true,
        "modifications": {
          "transferAmount": "30%"
        }
      }
    },

    "description": {
      "korean": "축복받은 대상이 받는 모든 피해의 30%를 대신 받습니다.",  // 원본 그대로
      "english": "Blesses a party or raid member, reducing their damage taken by 30%, but you suffer 100% of damage prevented."
    }
  }
}
```

## 구현 우선순위 (TWW 시즌 3)

### Phase 1: 핵심 로테이션 스킬
- 각 전문화별 주요 DPS/HPS 스킬
- 빌더/스펜더 스킬
- 주요 쿨다운

### Phase 2: 유틸리티 및 생존기
- 생존 쿨다운
- 이동기
- 군중 제어기

### Phase 3: 특성 스킬
- 클래스 특성
- 전문화 특성
- 영웅 특성 (TWW)

### Phase 4: PvP 특성
- PvP 특성
- 명예 특성

## 데이터 수집 방법

### 1. Wowhead 크롤러 (TWW 시즌 3 전용)
```javascript
class WowheadTWWCrawler {
  constructor() {
    this.patch = "11.2.0";
    this.season = "tww-season-3";
  }

  async fetchSpellData(spellId) {
    const url = `https://www.wowhead.com/spell=${spellId}`;

    // 1. 기본 정보 추출
    // 2. 전문화별 차이 확인
    // 3. 특성 상호작용 파싱
    // 4. 영웅 특성 효과 확인
    // 5. 조건부 효과 파싱

    return structuredData;
  }

  async validateTWWData(data) {
    // TWW 시즌 3 데이터인지 확인
    // 패치 버전 검증
    // 영웅 특성 존재 여부 확인
  }
}
```

### 2. 검증 시스템
```javascript
class SkillStructureValidator {
  validateStructure(skill) {
    const checks = [];

    // 1. 전문화 일관성 검증
    if (skill.classification.specialization.length > 0) {
      // 각 전문화별 데이터 존재 확인
      for (const spec of skill.classification.specialization) {
        if (!skill.specializationDetails[spec]) {
          checks.push(`${spec} 전문화 데이터 누락`);
        }
      }
    }

    // 2. 자원 논리 검증
    if (skill.resources.cost && skill.resources.generate) {
      // 같은 자원 소모/생성 충돌 체크
    }

    // 3. TWW 시즌 3 검증
    if (skill.metadata.patch !== "11.2.0") {
      checks.push("TWW 시즌 3 데이터 아님");
    }

    return checks;
  }
}
```

## 성공 지표

1. **전문화별 차이 100% 반영**
2. **스킬 구조 정확도 100%**
3. **TWW 시즌 3 데이터만 사용**
4. **설명 텍스트 원본 보존 100%**
5. **특성 상호작용 완벽 매핑**