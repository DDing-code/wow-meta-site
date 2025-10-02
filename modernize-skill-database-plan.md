# WoW 스킬 데이터베이스 현대화 계획

## 현재 상황 분석
- 구버전 스킬 위주 (Classic ~ Shadowlands)
- The War Within (11.0) 스킬 누락
- 일관성 없는 데이터 구조
- 한국어 번역 불일치

## 목표
- The War Within (11.0) 기준 모든 스킬 포함
- 일관된 데이터 구조
- 정확한 한국어 번역 (ko.wowhead.com 기준)
- 전문화별, PvP/PvE별 스킬 분류

## 데이터 구조 표준화

### 필수 필드
```javascript
{
  id: "스킬ID",
  name: "영문명",
  krName: "한국어명",
  className: "클래스명",
  spec: "전문화",
  category: "baseline|talents|pvp|heroTalents",
  level: 레벨,

  // 상세 정보
  description: "상세 설명",
  cooldown: "재사용 대기시간",
  resource: "자원 소비",
  range: "사정거리",
  castTime: "시전 시간",
  duration: "지속시간",

  // 효과
  effect: "주 효과",
  damageEffect: "피해량",
  healingEffect: "치유량",
  buff: "강화 효과",
  debuff: "약화 효과",
  generates: "자원 생성",

  // 추가 메커니즘
  charges: "충전 횟수",
  stacks: "중첩",
  scaling: "스케일링",
  areaOfEffect: "범위",

  // 메타데이터
  expansion: "TWW|DF|SL|BFA",
  patch: "11.0.5",
  icon: "아이콘 경로"
}
```

## 클래스별 최신 핵심 스킬 (The War Within)

### 전사 (Warrior)
- Mountain Thane (영웅 특성)
- Colossus (영웅 특성)
- Slayer (영웅 특성)

### 성기사 (Paladin)
- Herald of the Sun (영웅 특성)
- Lightsmith (영웅 특성)
- Templar (영웅 특성)

### 사냥꾼 (Hunter)
- Dark Ranger (영웅 특성)
- Pack Leader (영웅 특성)
- Sentinel (영웅 특성)

### 도적 (Rogue)
- Trickster (영웅 특성)
- Fatebound (영웅 특성)
- Deathstalker (영웅 특성)

### 사제 (Priest)
- Archon (영웅 특성)
- Oracle (영웅 특성)
- Voidweaver (영웅 특성)

### 죽음의 기사 (Death Knight)
- Deathbringer (영웅 특성)
- San'layn (영웅 특성)
- Rider of the Apocalypse (영웅 특성)

### 주술사 (Shaman)
- Totemic (영웅 특성)
- Farseer (영웅 특성)
- Stormbringer (영웅 특성)

### 마법사 (Mage)
- Sunfury (영웅 특성)
- Frostfire (영웅 특성)
- Spellslinger (영웅 특성)

### 흑마법사 (Warlock)
- Diabolist (영웅 특성)
- Hellcaller (영웅 특성)
- Soul Harvester (영웅 특성)

### 수도사 (Monk)
- Conduit of the Celestials (영웅 특성)
- Master of Harmony (영웅 특성)
- Shado-Pan (영웅 특성)

### 드루이드 (Druid)
- Wildstalker (영웅 특성)
- Druid of the Claw (영웅 특성)
- Keeper of the Grove (영웅 특성)
- Elune's Chosen (영웅 특성)

### 악마사냥꾼 (Demon Hunter)
- Aldrachi Reaver (영웅 특성)
- Fel-Scarred (영웅 특성)

### 기원사 (Evoker)
- Chronowarden (영웅 특성)
- Flameshaper (영웅 특성)
- Scalecommander (영웅 특성)

## 구현 단계

### 1단계: 데이터 수집 스크립트 작성
- Wowhead API 또는 스크래핑으로 최신 스킬 데이터 수집
- 각 클래스별로 영웅 특성 포함 모든 스킬 수집

### 2단계: 데이터 정제 및 번역
- 수집된 데이터 정제
- ko.wowhead.com에서 정확한 한국어 번역 확인

### 3단계: 데이터베이스 통합
- unifiedSkillDatabase.js 업데이트
- wowhead-full-descriptions-complete.json 업데이트

### 4단계: UI 업데이트
- SpellDatabasePage.js에서 영웅 특성 필터 추가
- 확장팩별 필터 추가

### 5단계: 검증
- 모든 클래스 스킬 표시 확인
- 한국어 번역 정확성 확인
- 필터링 기능 테스트