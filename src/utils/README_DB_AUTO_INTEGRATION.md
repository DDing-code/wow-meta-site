# 스킬 DB 자동 통합 시스템

## 📌 개요
가이드 작성 시 새로운 스킬을 자동으로 통합 DB에 추가하는 시스템입니다.

## 🚀 주요 기능
- 새 스킬 자동 감지 및 DB 추가
- 중복 방지 및 데이터 정규화
- 자동 백업 생성
- 스킬 데이터 검증 및 완성

## 📁 파일 구조
```
src/utils/
├── skillDBManager.js         # 핵심 DB 관리 유틸리티
├── integrateSkillsToDB.js    # 가이드 컴포넌트 통합 헬퍼
└── README_DB_AUTO_INTEGRATION.md # 이 문서

database-builder/
├── tww-s3-refined-database.json  # 통합 DB (메인)
└── backups/                      # 자동 백업 폴더
```

## 🔧 사용 방법

### 1. 기본 사용법 (새 가이드 컴포넌트)

```javascript
import { addSkillToDB, getSkillFromDB } from '../../utils/skillDBManager';

// 새 스킬 추가
const newSkill = {
  id: '34026',
  koreanName: '살상 명령',
  englishName: 'Kill Command',
  icon: 'ability_hunter_killcommand',
  description: '펫에게 대상을 공격하도록 명령',
  resourceCost: '집중 30',
  resourceGain: '없음',
  cooldown: '7.5초',
  type: '기본',
  spec: '야수'
};

// DB에 추가
addSkillToDB('HUNTER', newSkill);
```

### 2. 기존 가이드 컴포넌트 통합

```javascript
// BeastMasteryLayoutIntegrated.js 등에서
const { integrateSkillDataToDB } = require('../../utils/integrateSkillsToDB');

// 컴포넌트의 skillData를 DB에 통합
const result = integrateSkillDataToDB('HUNTER', skillData, '야수');
```

### 3. 자동 통합 컴포넌트 사용

```javascript
import GuideWithAutoDBIntegration from '../guides/GuideWithAutoDBIntegration';

function MyGuide() {
  return (
    <GuideWithAutoDBIntegration
      className="HUNTER"
      specName="야수"
    />
  );
}
```

## 📊 DB 구조

### 클래스 키 매핑
```javascript
{
  WARRIOR: '전사',
  PALADIN: '성기사',
  HUNTER: '사냥꾼',
  ROGUE: '도적',
  PRIEST: '사제',
  SHAMAN: '주술사',
  MAGE: '마법사',
  WARLOCK: '흑마법사',
  MONK: '수도사',
  DRUID: '드루이드',
  DEMONHUNTER: '악마사냥꾼',
  DEATHKNIGHT: '죽음의기사',
  EVOKER: '기원사'
}
```

### 스킬 데이터 필수 필드
```javascript
{
  id: 'string',          // Wowhead 스킬 ID
  koreanName: 'string',  // 한국어명 (ko.wowhead.com)
  englishName: 'string', // 영문명
  icon: 'string',        // 아이콘 파일명
  type: 'string',        // 기본|특성|지속 효과
  spec: 'string',        // 전문화명
  heroTalent: 'string',  // 영웅특성명 또는 null
  level: number,         // 습득 레벨
  pvp: boolean,          // PvP 전용 여부
  resourceCost: 'string', // 자원 소모량
  resourceGain: 'string', // 자원 획득량
  cooldown: 'string',    // 재사용 대기시간
  castTime: 'string',    // 시전 시간
  description: 'string'  // 스킬 설명
}
```

## 🔄 자동 백업

DB 수정 시 자동으로 백업이 생성됩니다:
- 경로: `database-builder/backups/`
- 파일명: `backup-[timestamp].json`
- 타임스탬프 형식: ISO 8601

## ⚙️ API 참조

### skillDBManager.js

#### `addSkillToDB(className, skill)`
새 스킬을 DB에 추가

#### `getSkillFromDB(className, skillId)`
DB에서 스킬 조회

#### `updateSkillInDB(className, skillId, updates)`
기존 스킬 업데이트

#### `addMultipleSkillsToDB(className, skills)`
여러 스킬 일괄 추가

#### `getAllSkillsByClass(className)`
클래스별 모든 스킬 조회

#### `getDBStats()`
DB 통계 정보 조회

### integrateSkillsToDB.js

#### `integrateSkillDataToDB(className, skillDataObject, specName)`
가이드 컴포넌트의 skillData를 DB에 통합

## ✅ 체크리스트

가이드 작성 시:
- [ ] 새 스킬 발견 시 자동 DB 추가 확인
- [ ] 중복 스킬 건너뛰기 확인
- [ ] 백업 파일 생성 확인
- [ ] resourceCost/resourceGain 필드 사용 (focusCost/focusGain X)
- [ ] 한국어명은 ko.wowhead.com 기준
- [ ] 영웅특성 스킬은 heroTalent 필드 설정

## 🐛 문제 해결

### DB 로드 실패
- 파일 경로 확인: `database-builder/tww-s3-refined-database.json`
- 파일 권한 확인
- JSON 문법 오류 확인

### 스킬 추가 실패
- 스킬 ID 중복 확인
- 필수 필드 누락 확인
- 클래스명이 올바른지 확인 (대문자)

### 백업 생성 실패
- `database-builder/backups/` 폴더 존재 확인
- 디스크 공간 확인
- 쓰기 권한 확인

## 📝 업데이트 로그

### 2025-09-27
- 초기 시스템 구축
- 야수 사냥꾼 스킬 16개 통합
- 자동 백업 시스템 추가
- resourceCost/resourceGain 필드 통합