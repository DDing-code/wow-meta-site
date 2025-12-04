// Mobility Balance (기동성과 DPS의 균형)
// Felscarred 빌드 기동성 관리
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'mobility-balance',
  version: '1.0.0',
  name: {
    ko: '기동성과 DPS의 균형',
    en: 'Mobility Balance'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `지옥상흔 빌드는 지옥 돌진을 <strong>이동기가 아닌 DPS 스킬</strong>로 사용해야 하므로,
      알드라치 파괴자보다 <strong>기동성이 제한적</strong>입니다. 하지만 복수의 후퇴와 조합하면
      여전히 높은 기동성을 유지할 수 있습니다.`,

    details: [
      '<strong>지옥 돌진</strong>: DPS 우선 사용 → 이동 목적으로 아끼지 말 것',
      '<strong>복수의 후퇴</strong>: 후방 도약 25야드 → 위험 회피 전용',
      '<strong>활공</strong>: 낙하 중 활성화 → 수직 이동 시 활용',
      '<strong>전략</strong>: 지옥 돌진 2회 충전 중 1회는 항상 확보',
      '<strong>긴급 이동</strong>: 복수의 후퇴 → 즉시 지옥 돌진으로 복귀',
      '<strong>주의</strong>: 지옥 돌진을 이동만을 위해 사용하지 말 것'
    ],

    relatedSkills: ['felrush', 'vengefulretreat', 'glide'],

    importance: 'medium'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: null,  // 직접 버프 없음

    stackInfo: null,

    triggers: {
      skills: [195072, 198793],  // Fel Rush, Vengeful Retreat
      events: ['SPELL_CAST']
    },

    metrics: {
      uptimeTarget: null,  // 기동성이므로 uptime 개념 없음
      avgStacks: null,
      wasteThreshold: null,

      // 기동성 효율 지표
      felRushForMovement: 0.20,  // 이동 목적 지옥 돌진 비율 (이상적: <20%)
      felRushForDPS: 0.80,  // DPS 목적 지옥 돌진 비율 (이상적: >80%)
      vengefulRetreatUsage: 15,  // 복수의 후퇴 사용 횟수 (전투 시간에 따라 변동)

      // 충전 관리
      felRushChargeAvailability: 0.50  // 지옥 돌진 충전 보유율 (이상적: 40-60%, 1충전 항상 확보)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'movement',
    difficulty: 'medium',

    keyPoints: [
      '지옥 돌진: DPS 스킬 우선, 이동기 후순위',
      '복수의 후퇴: 후방 도약 25야드, 위험 회피 전용',
      '활공: 낙하 중 수직 이동',
      '전략: 지옥 돌진 2충전 중 1충전 보유',
      '긴급 이동: 복수의 후퇴 → 지옥 돌진 복귀',
      '알드라치 대비 기동성 제한적'
    ],

    commonMistakes: [
      {
        mistake: '지옥 돌진을 이동만을 위해 사용 (DPS 손실)',
        impact: 'high',
        solution: 'DPS 우선 사용, 이동은 복수의 후퇴 활용',
        frequency: 0.40
      },
      {
        mistake: '2충전 모두 소모 후 긴급 이동 불가',
        impact: 'medium',
        solution: '1충전은 항상 확보하여 긴급 상황 대비',
        frequency: 0.30
      },
      {
        mistake: '복수의 후퇴 미사용 (기동성 손실)',
        impact: 'medium',
        solution: '위험 회피 시 복수의 후퇴 적극 활용',
        frequency: 0.25
      },
      {
        mistake: '활공 미사용 (낙하 피해)',
        impact: 'low',
        solution: '높은 곳에서 낙하 시 활공으로 안전 착지',
        frequency: 0.15
      }
    ],

    synergies: ['fel-rush-role', 'felscarred-stacks']
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'movement',
    damageMultiplier: null,
    maxStacks: null,
    stackDuration: null,
    cooldown: null,
    dependencies: ['fel-rush-role'],

    // 기동성 도구
    mobilityTools: {
      felRush: {
        charges: 2,
        cooldown: 10,  // 10초당 1충전
        distance: 20,  // 20야드 전방
        dpsValue: 'high',  // DPS 가치 높음
        mobilityValue: 'medium'  // 기동성 가치 중간
      },
      vengefulRetreat: {
        charges: 1,
        cooldown: 25,  // 25초 (Initiative 특성: 20초)
        distance: 25,  // 25야드 후방
        dpsValue: 'low',  // DPS 가치 낮음
        mobilityValue: 'high'  // 기동성 가치 높음
      },
      glide: {
        charges: 'unlimited',
        cooldown: 0,
        distance: 'variable',  // 수직 이동
        dpsValue: 'none',
        mobilityValue: 'high'
      }
    },

    // 우선순위
    mobilityPriority: {
      emergency: 'vengefulretreat',  // 긴급 회피
      standard: 'felrush',  // 일반 이동
      vertical: 'glide'  // 수직 이동
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
    migrationNotes: 'Migrated from mechanisms.js - Balancing Fel Rush DPS usage vs mobility in Felscarred build'
  }
};
