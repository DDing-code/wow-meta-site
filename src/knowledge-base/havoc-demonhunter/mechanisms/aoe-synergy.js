// AoE Synergy (광역 피해 시너지)
// Felscarred 빌드 광역 최적화
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'aoe-synergy',
  version: '1.0.0',
  name: {
    ko: '광역 피해 시너지',
    en: 'AoE Synergy'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `지옥상흔 빌드는 <strong>지옥 돌진의 광역 피해</strong> 덕분에 알드라치 파괴자보다
      광역 상황에서 더 강력합니다. <strong>2+ 대상</strong>부터 광역 우선순위로 전환하며,
      지옥 돌진으로 적 무리를 관통하며 동시에 격노 생성 + 지옥상흔 중첩 + 광역 피해를 달성합니다.`,

    details: [
      '<strong>지옥 돌진</strong>: 경로상 모든 적 피해 + 격노 15 + 중첩 +1',
      '<strong>안광</strong>: 모든 적 관통 최고 광역 딜',
      '<strong>칼춤/죽음의 칼춤</strong>: 최대 5명 동시 타격',
      '<strong>화염 감옥</strong>: 8야드 지속 광역 피해',
      '<strong>3+ 대상</strong>: 안광 → 칼춤 → 지옥 돌진 우선순위',
      '<strong>5+ 대상</strong>: 칼춤만 연속 사용하여 광역 극대화'
    ],

    relatedSkills: ['felrush', 'eyebeam', 'bladedance', 'deathsweep', 'immolationaura'],

    importance: 'high'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: null,  // 직접 버프 없음

    stackInfo: null,

    triggers: {
      skills: [195072, 198013, 188499, 210152, 258920],  // Fel Rush, Eye Beam, Blade Dance, Death Sweep, Immolation Aura
      events: ['SPELL_DAMAGE']
    },

    metrics: {
      uptimeTarget: null,  // 광역 우선순위이므로 uptime 개념 없음
      avgStacks: null,
      wasteThreshold: null,

      // 광역 피해 효율 지표
      avgTargetsHit: 4,  // 평균 타격 대상 수 (이상적: 4+)
      felRushAoeDamage: 0.35,  // 전체 광역 피해 중 지옥 돌진 비율 (이상적: 30-40%)
      eyeBeamAoeDamage: 0.40,  // 전체 광역 피해 중 안광 비율 (이상적: 35-45%)
      bladeDanceAoeDamage: 0.20,  // 전체 광역 피해 중 칼춤 비율 (이상적: 15-25%)

      // 광역 우선순위 전환
      aoeTransitionEfficiency: 0.90  // 2+ 타겟 시 광역 우선순위 전환율 (이상적: >90%)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'aoe',
    difficulty: 'medium',

    keyPoints: [
      '지옥 돌진: 경로상 모든 적 피해 + 격노 15 + 중첩 +1',
      '안광: 모든 적 관통 최고 광역 딜',
      '칼춤/죽음의 칼춤: 최대 5명 동시 타격',
      '2+ 대상: 광역 우선순위 전환',
      '3+ 대상: 안광 → 칼춤 → 지옥 돌진',
      '5+ 대상: 칼춤 연속 사용'
    ],

    commonMistakes: [
      {
        mistake: '2+ 타겟 상황에서 단일 대상 우선순위 유지',
        impact: 'high',
        solution: '2+ 타겟부터 즉시 광역 우선순위로 전환',
        frequency: 0.30
      },
      {
        mistake: '지옥 돌진을 이동기로만 사용 (광역 피해 무시)',
        impact: 'high',
        solution: '지옥 돌진으로 적 무리 관통하여 광역 피해 + 격노 + 중첩 동시 획득',
        frequency: 0.35
      },
      {
        mistake: '5+ 타겟 상황에서 혼돈 일격 사용',
        impact: 'medium',
        solution: '5+ 타겟에서는 칼춤만 연속 사용하여 광역 극대화',
        frequency: 0.20
      },
      {
        mistake: '광역 상황에서 지옥상흔 중첩 유지 실패',
        impact: 'medium',
        solution: '광역 딜 중에도 지옥 돌진을 10-12초마다 사용하여 중첩 유지',
        frequency: 0.25
      }
    ],

    synergies: ['fel-rush-role', 'felscarred-stacks', 'metamorphosis-felscarred']
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'aoe',
    damageMultiplier: 1.00,
    maxStacks: null,
    stackDuration: null,
    cooldown: null,
    dependencies: ['fel-rush-role'],

    // 광역 우선순위
    aoePriority: {
      twoPlus: ['eyebeam', 'bladedance', 'felrush', 'chaosstrike'],
      threePlus: ['eyebeam', 'bladedance', 'felrush'],
      fivePlus: ['bladedance', 'eyebeam', 'felrush']
    },

    // 타겟 수에 따른 피해 배율
    damageScaling: {
      singleTarget: 1.00,
      twoTargets: 1.80,
      threeTargets: 2.60,
      fourTargets: 3.40,
      fivePlus: 4.20  // 지옥 돌진 관통 + 칼춤 5타겟 + 안광 무제한
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
    migrationNotes: 'Migrated from mechanisms.js - Felscarred AoE optimization with Fel Rush as core AoE skill'
  }
};
