/**
 * WoW 통합 데이터베이스 구축 시스템 설정
 *
 * 이 파일은 모든 데이터 수집 및 통합 작업의 중앙 설정입니다.
 */

module.exports = {
  // 데이터 소스 우선순위
  dataSources: {
    primary: 'wowhead',      // 주요 데이터 소스
    secondary: 'warcraftlogs', // 보조 데이터 소스
    tertiary: 'raiderio'      // 3차 데이터 소스
  },

  // WoWhead API 설정
  wowhead: {
    baseUrl: 'https://ko.wowhead.com',
    apiUrl: 'https://nether.wowhead.com/tooltip',
    locale: 'ko',
    patch: '11.2.0'
  },

  // 수집할 데이터 카테고리
  dataCategories: {
    skills: {
      enabled: true,
      fields: [
        'id',
        'name',
        'koreanName',
        'icon',
        'description',
        'class',
        'spec',
        'category',
        'type',
        'level',
        'cooldown',
        'castTime',
        'range',
        'resource',
        'charges',
        'school',
        'dispelType',
        'mechanic',
        'auraType'
      ]
    },
    talents: {
      enabled: true,
      fields: [
        'id',
        'name',
        'koreanName',
        'icon',
        'description',
        'class',
        'spec',
        'row',
        'column',
        'maxRank',
        'requiredLevel',
        'requiredTalent',
        'pvpTalent'
      ]
    },
    items: {
      enabled: false, // 나중에 구현
      fields: []
    }
  },

  // 클래스 목록 (정확한 영문명)
  classes: [
    { id: 'WARRIOR', name: '전사', specs: ['Arms', 'Fury', 'Protection'] },
    { id: 'PALADIN', name: '성기사', specs: ['Holy', 'Protection', 'Retribution'] },
    { id: 'HUNTER', name: '사냥꾼', specs: ['Beast Mastery', 'Marksmanship', 'Survival'] },
    { id: 'ROGUE', name: '도적', specs: ['Assassination', 'Outlaw', 'Subtlety'] },
    { id: 'PRIEST', name: '사제', specs: ['Discipline', 'Holy', 'Shadow'] },
    { id: 'DEATHKNIGHT', name: '죽음의 기사', specs: ['Blood', 'Frost', 'Unholy'] },
    { id: 'SHAMAN', name: '주술사', specs: ['Elemental', 'Enhancement', 'Restoration'] },
    { id: 'MAGE', name: '마법사', specs: ['Arcane', 'Fire', 'Frost'] },
    { id: 'WARLOCK', name: '흑마법사', specs: ['Affliction', 'Demonology', 'Destruction'] },
    { id: 'MONK', name: '수도사', specs: ['Brewmaster', 'Mistweaver', 'Windwalker'] },
    { id: 'DRUID', name: '드루이드', specs: ['Balance', 'Feral', 'Guardian', 'Restoration'] },
    { id: 'DEMONHUNTER', name: '악마사냥꾼', specs: ['Havoc', 'Vengeance'] },
    { id: 'EVOKER', name: '기원사', specs: ['Devastation', 'Preservation', 'Augmentation'] }
  ],

  // 스킬 카테고리 분류
  skillCategories: [
    'baseline',      // 기본 스킬
    'talent',        // 일반 특성
    'pvpTalent',     // PvP 특성
    'covenant',      // 성약 (레거시)
    'legendary',     // 전설 효과
    'heroTalent',    // 영웅 특성 (11.0+)
    'classTree',     // 직업 특성 트리
    'specTree',      // 전문화 특성 트리
    'passive',       // 패시브
    'racial',        // 종족 특성
    'profession',    // 전문 기술
    'item',          // 아이템 효과
    'consumable',    // 소모품
    'mount',         // 탈것
    'pet'            // 펫 스킬
  ],

  // 데이터베이스 출력 설정
  output: {
    directory: 'src/data/database',
    format: 'javascript', // 'javascript' or 'json'
    prettify: true,
    compression: false,
    splitByClass: true,  // 클래스별로 파일 분할
    generateIndex: true,  // 인덱스 파일 생성
    generateTypes: true   // TypeScript 타입 정의 생성
  },

  // 캐싱 설정
  cache: {
    enabled: true,
    directory: 'database-builder/cache',
    ttl: 86400 * 7, // 7일
    checksum: true
  },

  // 로깅 설정
  logging: {
    level: 'info', // 'error', 'warn', 'info', 'debug'
    file: 'database-builder/logs/builder.log',
    console: true,
    timestamp: true
  },

  // 동시 실행 제한
  concurrency: {
    maxRequests: 5,      // 동시 요청 수
    requestDelay: 1000,  // 요청 간 딜레이 (ms)
    retryAttempts: 3,    // 재시도 횟수
    retryDelay: 5000     // 재시도 딜레이 (ms)
  },

  // 검증 규칙
  validation: {
    requireIcon: true,
    requireDescription: false, // 설명은 선택사항
    requireKoreanName: true,
    minDescriptionLength: 10,
    allowedIconFormats: ['jpg', 'png', 'gif'],
    validateSpellIds: true
  },

  // 데이터 변환 규칙
  transformation: {
    normalizeNames: true,
    stripHtml: true,
    convertNumbers: true,
    parseFormulas: true,
    expandAbbreviations: true
  }
};