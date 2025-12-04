// Fury System (Felscarred) (격노 시스템 - 지옥상흔)
// Felscarred 빌드 전용 격노 관리
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'fury-system-felscarred',
  version: '1.0.0',
  name: {
    ko: '격노 시스템 (지옥상흔)',
    en: 'Fury System (Felscarred)'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `파멸 악마사냥꾼의 주 자원으로, 지옥상흔 빌드는 <strong>지옥 돌진의 격노 생성</strong>을
      적극 활용하여 더 빠른 격노 순환을 달성합니다. 알드라치 파괴자보다 <strong>격노 생성 속도가 빠르나</strong>
      중첩 유지를 위해 지옥 돌진을 자주 사용해야 하므로 <strong>더 공격적인 자원 관리</strong>가 필요합니다.`,

    details: [
      '<strong>최대 격노</strong>: 120 (탈태 변신 중 140)',
      '<strong>자연 회복</strong>: 없음',
      '<strong>주요 생성</strong>: 지옥 돌진 (15) + 악마의 이빨 (20-30) + 화염 감옥 (지속)',
      '<strong>주요 소모</strong>: 혼돈 일격 (40), 칼춤 (35), 안광 (30)',
      '<strong>차이점</strong>: 지옥 돌진을 자주 사용하여 알드라치보다 격노 생성 빠름',
      '<strong>목표</strong>: 80+ 격노 유지 + 지옥상흔 5중첩 동시 유지'
    ],

    relatedSkills: ['demonsbite', 'immolationaura', 'felrush', 'chaosstrike', 'bladedance', 'eyebeam'],

    importance: 'critical'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: null,  // 격노는 자원이므로 버프 ID 없음
    debuffId: null,

    stackInfo: null,

    triggers: {
      // 격노 생성 스킬 (지옥상흔 특화)
      skills: [162243, 195072, 258920],  // Demon's Bite, Fel Rush, Immolation Aura
      events: ['SPELL_CAST', 'ENERGIZE']
    },

    metrics: {
      uptimeTarget: null,  // 자원이므로 uptime 개념 없음
      avgStacks: null,
      wasteThreshold: 0.05,  // 5% 이상 격노 낭비 시 경고

      // 격노 관리 지표 (지옥상흔 특화)
      avgFury: 70,  // 평균 격노 유지량 (이상적: 60-80, 알드라치보다 높음)
      wastedFury: 0.05,  // 격노 낭비율 (이상적: <5%)
      furyAtMetamorphosis: 110,  // 탈태 변신 진입 시 격노 (이상적: 100-120)

      // 지옥 돌진 기여도
      felRushFuryGeneration: 0.40  // 전체 격노 생성 중 지옥 돌진 비율 (이상적: 35-45%)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'resource-management',
    difficulty: 'hard',

    keyPoints: [
      '지옥상흔 빌드: 지옥 돌진을 통한 빠른 격노 생성',
      '최대 격노: 120 (탈태 중 140)',
      '주요 생성: 지옥 돌진 (15) + 악마의 이빨 (20-30)',
      '알드라치보다 격노 생성 속도 빠름',
      '목표: 80+ 격노 유지 + 지옥상흔 5중첩 동시 유지',
      '더 공격적인 자원 관리 필요'
    ],

    commonMistakes: [
      {
        mistake: '격노 120 도달 후 지옥 돌진 계속 사용 (격노 낭비)',
        impact: 'high',
        solution: '격노 105 이상일 때는 혼돈 일격 먼저 사용 후 지옥 돌진',
        frequency: 0.35
      },
      {
        mistake: '지옥상흔 중첩 유지를 위해 격노 부족 상태에서도 지옥 돌진 사용',
        impact: 'medium',
        solution: '격노 40 미만일 때는 악마의 이빨로 격노 확보 후 지옥 돌진',
        frequency: 0.30
      },
      {
        mistake: '탈태 변신 진입 시 격노 부족 (<80)',
        impact: 'critical',
        solution: '탈태 변신 쿨다운 10초 전부터 격노 충전 시작, 진입 시 최소 100 이상 확보',
        frequency: 0.25
      },
      {
        mistake: '지옥 돌진의 격노 생성을 과신하여 악마의 이빨 미사용',
        impact: 'medium',
        solution: '지옥 돌진만으로는 격노 생성 부족, 악마의 이빨과 병행 사용',
        frequency: 0.20
      }
    ],

    synergies: ['fel-rush-role', 'felscarred-stacks', 'metamorphosis-felscarred']
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'resource-gen',
    damageMultiplier: null,
    maxStacks: 120,  // 최대 격노 (탈태 중 140)
    stackDuration: null,  // 격노는 만료되지 않음
    cooldown: null,

    dependencies: ['fel-rush-role'],

    // 격노 생성/소모 데이터 (지옥상흔 특화)
    generation: {
      demonsBite: {
        min: 20,
        max: 30,
        avg: 25
      },
      felRush: 15,  // 지옥상흔 빌드 핵심
      immolationAura: 8,  // 피해 적중 시 (Fallout 특성)
      other: {
        soulFragment: 30
      }
    },

    consumption: {
      chaosStrike: 40,
      annihilation: 40,
      eyeBeam: 30,
      bladeDance: 35,  // 지옥상흔은 35 (알드라치 25)
      deathSweep: 35
    },

    // 지옥 돌진 기여도
    felRushContribution: 0.40  // 전체 격노 생성 중 35-45%
  },

  // ============================================
  // 메타데이터
  // ============================================
  metadata: {
    patch: '11.2',
    lastUpdated: '2025-01-10',
    source: 'wowhead',
    verified: true,
    migrationNotes: 'Migrated from mechanisms.js - Felscarred-specific Fury management with Fel Rush focus'
  }
};
