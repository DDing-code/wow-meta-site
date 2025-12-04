// Chaos Strike / Annihilation (혼돈 일격 / 소멸)
// Havoc Demon Hunter 핵심 격노 소모 스킬
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'chaos-strike-annihilation',
  version: '1.0.0',
  name: {
    ko: '혼돈 일격 / 소멸',
    en: 'Chaos Strike / Annihilation'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `<strong>혼돈 일격 (Chaos Strike)</strong>은 파멸 악마사냥꾼의 주요 격노 소모 스킬로,
      <strong>격노 40 소모</strong>하여 높은 단일 대상 피해를 입힙니다.
      <strong>탈태 변신 (Metamorphosis)</strong> 중에는 <strong>소멸 (Annihilation)</strong>로 변환되어
      피해가 20% 증가합니다. 혼돈 일격/소멸은 <strong>파괴자의 글레이브 중첩 생성</strong>과
      <strong>영혼 파편 생성</strong>의 핵심 메커니즘입니다.`,

    details: [
      '<strong>격노 소모</strong>: 40',
      '<strong>탈태 변신 중</strong>: 소멸 (Annihilation)로 변환 (피해 20% 증가)',
      '<strong>파괴자의 글레이브</strong>: 탈태 중 소멸 적중 시 12% 피해 증가 중첩 생성 (최대 3중첩)',
      '<strong>영혼 파편 생성</strong>: 혼돈 일격/소멸 사용 시 영혼 파편 생성',
      '<strong>우선순위</strong>: 탈태 중 소멸 > 혼돈 일격 (파괴자의 글레이브 중첩 생성)',
      '<strong>격노 관리</strong>: 격노 40 이상 유지하여 즉시 사용 가능 상태 유지',
      '<strong>시너지</strong>: Inner Demon 특성 선택 시 치명타 확률 증가'
    ],

    relatedSkills: ['chaosstrike', 'annihilation', 'metamorphosis'],

    importance: 'critical'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: null,  // 직접 버프 없음

    stackInfo: null,

    triggers: {
      skills: [162794, 201427],  // Chaos Strike, Annihilation
      events: ['SPELL_CAST', 'SPELL_DAMAGE']
    },

    metrics: {
      uptimeTarget: null,  // 스킬이므로 uptime 개념 없음
      avgStacks: null,
      wasteThreshold: null,

      // 혼돈 일격/소멸 사용 효율 지표
      avgCasts: 30,  // 평균 사용 횟수 (전투 시간에 따라 변동)
      avgDamage: 150000,  // 평균 피해량 (장비에 따라 변동)
      critRate: 0.40,  // 치명타율 (이상적: >40%)
      furyEfficiency: 0.95,  // 격노 효율 (이상적: >95%, 격노 낭비 최소화)

      // 탈태 중 소멸 사용 비율
      annihilationRatio: 0.80  // 소멸 사용 비율 (이상적: >80%, 탈태 중 주로 사용)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'single-target',
    difficulty: 'medium',

    keyPoints: [
      '혼돈 일격: 격노 40 소모, 주요 단일 대상 피해 스킬',
      '소멸: 탈태 변신 중 혼돈 일격 대체, 피해 20% 증가',
      '파괴자의 글레이브 중첩 생성: 탈태 중 소멸 적중 시',
      '영혼 파편 생성: 혼돈 일격/소멸 사용 시',
      '격노 40 이상 유지 필수',
      'Inner Demon 특성: 치명타 확률 증가'
    ],

    commonMistakes: [
      {
        mistake: '격노 부족 상태에서 혼돈 일격 사용 시도 (40 미만)',
        impact: 'medium',
        solution: '격노 40 이상 확보 후 사용, 부족 시 악마의 이빨로 격노 충전',
        frequency: 0.25
      },
      {
        mistake: '탈태 변신 중 소멸 미사용 (혼돈 일격 계속 사용)',
        impact: 'critical',
        solution: '탈태 변신 중에는 자동으로 소멸로 변환되므로 평소처럼 사용',
        frequency: 0.15
      },
      {
        mistake: '파괴자의 글레이브 중첩 생성 누락 (탈태 중 소멸 미사용)',
        impact: 'high',
        solution: '탈태 시작 시 안광 즉시 사용 → 소멸 연속 사용하여 3중첩 달성',
        frequency: 0.20
      },
      {
        mistake: '격노 120 도달 후 혼돈 일격 미사용 (격노 낭비)',
        impact: 'high',
        solution: '격노 90 이상일 때는 혼돈 일격 우선 사용',
        frequency: 0.30
      }
    ],

    synergies: ['reavers-glaive', 'metamorphosis-buffs', 'fury-system']
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'resource-gen',  // 격노 소모 + 영혼 파편 생성
    damageMultiplier: 1.00,  // 기본 (탈태 중 소멸: 1.20)
    maxStacks: null,
    stackDuration: null,
    cooldown: null,  // GCD만 존재
    dependencies: ['fury-system'],

    // 격노 소모 및 영혼 파편 생성
    furyConsumption: 40,
    soulFragmentGeneration: {
      chance: 0.60,  // 60% 확률로 영혼 파편 생성
      amount: 1
    },

    // 탈태 변신 중 변환
    metamorphosisTransform: {
      enabled: true,
      damageIncrease: 0.20,  // 피해 20% 증가
      skillId: 201427  // Annihilation
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
    migrationNotes: 'Migrated from mechanisms.js - Core Fury spender and Reaver\'s Glaive stack generator'
  }
};
