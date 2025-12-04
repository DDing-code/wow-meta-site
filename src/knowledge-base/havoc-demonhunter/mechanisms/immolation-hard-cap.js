// Immolation Aura Hard Cap (화염 감옥/섭렵의 불길 하드캡 시스템)
// Havoc Demon Hunter 화염 감옥 하드캡 관리
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'immolation-hard-cap',
  version: '1.0.0',
  name: {
    ko: '화염 감옥/섭렵의 불길 하드캡 시스템',
    en: 'Immolation Aura Hard Cap System'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `<strong>화염 감옥 (Immolation Aura)</strong>은 동시에 최대 <strong>5개의 Spell ID</strong>까지만 활성화 가능하며,
      탈태 변신 중 강화 버전인 <strong>섭렵의 불길 (Consuming Fire)</strong>은 <strong>4개까지</strong> 제한됩니다.
      <strong>A Fire Inside</strong> 특성으로 proc이 자주 발생하는 경우, 하드캡을 초과하지 않도록 주의해야 합니다.
      하드캡 초과 시 추가 사용이 낭비되므로 <strong>연속 5회 이상 사용 금지</strong>가 필수입니다.`,

    details: [
      '<strong>화염 감옥 하드캡</strong>: 최대 5개 Spell ID 동시 활성화',
      '<strong>섭렵의 불길 하드캡</strong>: 최대 4개 Spell ID 동시 활성화 (탈태 변신 중)',
      '<strong>A Fire Inside proc</strong>: 높은 proc 확률로 빠른 충전 → 하드캡 주의',
      '<strong>연속 사용 제한</strong>: 화염 감옥/섭렵의 불길을 연속 5회 이상 사용 금지 (하드캡 초과 방지)',
      '<strong>오프너 최적화</strong>: 오프너 중 화염 감옥 5회 사용 후 중단 (추가 사용 시 낭비)',
      '<strong>탈태 중 주의</strong>: 섭렵의 불길 4회 사용 후 1충전 남기기 (하드캡 방지)',
      '<strong>전략</strong>: A Fire Inside proc 시 현재 활성 화염 감옥 개수 확인 후 사용 여부 결정'
    ],

    relatedSkills: ['immolationaura', 'metamorphosis'],

    importance: 'high'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: 258920,  // Immolation Aura buff

    stackInfo: {
      max: 5,  // 최대 5개 Spell ID (일반 상태)
      maxDuringMeta: 4,  // 최대 4개 Spell ID (탈태 변신 중 섭렵의 불길)
      duration: 10000,  // 10초 (밀리초)
      damagePerStack: null,  // 피해 증가 없음 (광역 DoT)
      independentStacks: false  // 동일 지속시간
    },

    triggers: {
      skills: [258920],  // Immolation Aura (Consuming Fire도 동일 ID)
      events: ['SPELL_CAST']
    },

    metrics: {
      uptimeTarget: 0.33,  // 목표 uptime 33% (10초 지속, 30초 쿨다운)
      avgStacks: null,
      wasteThreshold: 0.10,  // 10% 이상 낭비 시 경고 (하드캡 초과)

      // 하드캡 관리 지표
      hardCapExceeded: 0.05,  // 하드캡 초과 빈도 (이상적: <5%)
      consecutiveUses: 5,  // 연속 사용 횟수 (이상적: ≤5회)
      wastedCasts: 0.05,  // 낭비된 시전 (이상적: <5%)

      // A Fire Inside proc 효율
      aFireInsideProcWaste: 0.10  // A Fire Inside proc 낭비율 (이상적: <10%)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'resource-management',
    difficulty: 'hard',

    keyPoints: [
      '화염 감옥 하드캡: 최대 5개 Spell ID 동시 활성화',
      '섭렵의 불길 하드캡: 최대 4개 Spell ID (탈태 중)',
      'A Fire Inside proc: 높은 proc 확률 → 하드캡 주의',
      '연속 5회 이상 사용 금지',
      '오프너: 화염 감옥 5회 후 중단',
      '탈태 중: 섭렵의 불길 4회 후 1충전 남기기'
    ],

    commonMistakes: [
      {
        mistake: '하드캡 초과 (화염 감옥 6회 이상 연속 사용)',
        impact: 'high',
        solution: '연속 5회 사용 후 중단, 현재 활성 개수 확인 후 추가 사용',
        frequency: 0.35
      },
      {
        mistake: '탈태 중 섭렵의 불길 5회 사용 (하드캡 초과)',
        impact: 'high',
        solution: '탈태 중에는 최대 4회까지만 사용, 1충전 남기기',
        frequency: 0.30
      },
      {
        mistake: 'A Fire Inside proc 시 무조건 사용 (하드캡 무시)',
        impact: 'medium',
        solution: 'proc 발생 시 현재 활성 화염 감옥 개수 확인 후 사용 여부 결정',
        frequency: 0.25
      },
      {
        mistake: '오프너 중 화염 감옥 연속 7-8회 사용',
        impact: 'medium',
        solution: '오프너 중 화염 감옥은 5회까지만 사용',
        frequency: 0.20
      }
    ],

    synergies: ['immolation-aura', 'metamorphosis-buffs']
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'cooldown',
    damageMultiplier: 1.00,
    maxStacks: 5,  // 하드캡 5개
    maxStacksDuringMeta: 4,  // 탈태 중 하드캡 4개
    stackDuration: 10,  // 10초 지속
    cooldown: 30,  // 30초 재사용 (A Fire Inside proc으로 빠른 충전 가능)
    dependencies: ['metamorphosis'],

    // 하드캡 시스템
    hardCapSystem: {
      enabled: true,
      normalCap: 5,  // 일반 상태 하드캡
      metamorphosisCap: 4,  // 탈태 변신 중 하드캡 (Consuming Fire)
      wasteOnExceed: true  // 하드캡 초과 시 시전 낭비
    },

    // A Fire Inside 특성
    aFireInsideTalent: {
      enabled: true,  // 특성 선택 시
      procChance: 0.30,  // 30% proc 확률 (높은 편)
      chargeGeneration: 1  // proc 시 1충전 회복
    }
  },

  // ============================================
  // 메타데이터
  // ============================================
  metadata: {
    patch: '11.2',
    lastUpdated: '2025-01-10',
    source: 'wowhead',
    verified: true,
    migrationNotes: 'Migrated from mechanisms.js - Immolation Aura hard cap system with Consuming Fire (Meta) cap'
  }
};
