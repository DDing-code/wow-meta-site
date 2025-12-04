// Fel Rush Role (지옥 돌진 다중 역할)
// Felscarred 영웅 특성 핵심 DPS 스킬
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'fel-rush-role',
  version: '1.0.0',
  name: {
    ko: '지옥 돌진 다중 역할',
    en: 'Fel Rush Role'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `지옥상흔 빌드에서 <strong>지옥 돌진 (Fel Rush)</strong>은 단순한 이동기가 아닌 핵심 DPS 스킬입니다.
      <strong>격노 15 생성</strong>, <strong>지옥상흔 중첩 획득</strong>, <strong>광역 피해</strong> 3가지 역할을 동시에 수행하여
      알드라치 파괴자 대비 더 공격적이고 기동적인 플레이를 가능하게 합니다.`,

    details: [
      '<strong>격노 생성</strong>: 15 격노 (악마의 이빨과 동일 효율)',
      '<strong>지옥상흔 중첩</strong>: 적중 시 +1 중첩',
      '<strong>광역 피해</strong>: 경로상 모든 적에게 피해',
      '<strong>충전 횟수</strong>: 2회 (10초마다 1회 충전)',
      '<strong>이동 거리</strong>: 20야드 전방 돌진',
      '<strong>전략</strong>: 빈번히 사용하여 격노 생성 + 중첩 유지 동시 달성'
    ],

    relatedSkills: ['felrush'],

    importance: 'critical'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: null,  // 직접 버프 없음 (지옥상흔 중첩 생성)

    stackInfo: null,

    triggers: {
      skills: [195072],  // Fel Rush
      events: ['SPELL_CAST', 'SPELL_DAMAGE']
    },

    metrics: {
      uptimeTarget: null,  // 스킬이므로 uptime 개념 없음
      avgStacks: null,
      wasteThreshold: null,

      // 지옥 돌진 사용 효율 지표
      avgCasts: 25,  // 평균 사용 횟수 (전투 시간에 따라 변동)
      avgDamage: 60000,  // 평균 피해량 (타겟 수에 따라 변동)
      furyGeneration: 375,  // 평균 격노 생성량 (25회 x 15 격노)
      chargeWaste: 0.10,  // 충전 낭비율 (이상적: <10%, 2충전 모두 쌓인 채로 10초 이상 대기)

      // 지옥상흔 중첩 기여도
      felscarredStacksGenerated: 25  // 지옥상흔 중첩 생성 횟수
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'resource-management',
    difficulty: 'medium',

    keyPoints: [
      '지옥 돌진: 격노 15 생성 + 지옥상흔 중첩 +1 + 광역 피해',
      '2충전 (10초마다 1충전 회복)',
      '20야드 전방 돌진, 경로상 모든 적 공격',
      '빈번히 사용하여 격노 생성 + 중첩 유지',
      '알드라치 대비 더 공격적인 플레이'
    ],

    commonMistakes: [
      {
        mistake: '이동기로만 사용 (격노 생성 + 중첩 획득 무시)',
        impact: 'critical',
        solution: '지옥 돌진은 DPS 스킬, 빈번히 사용하여 격노 + 중첩 유지',
        frequency: 0.40
      },
      {
        mistake: '2충전 모두 쌓인 채로 10초 이상 대기 (충전 낭비)',
        impact: 'high',
        solution: '1충전은 보유하되, 2충전 달성 시 즉시 사용',
        frequency: 0.30
      },
      {
        mistake: '격노 120 도달 후 지옥 돌진 사용 (격노 낭비)',
        impact: 'medium',
        solution: '격노 105 이상일 때는 지옥 돌진 보류, 혼돈 일격 먼저 사용',
        frequency: 0.25
      },
      {
        mistake: '지옥상흔 5중첩 달성 후 지옥 돌진 사용 중단',
        impact: 'high',
        solution: '5중첩 달성 후에도 지속 사용하여 중첩 갱신 (15초 지속시간)',
        frequency: 0.20
      }
    ],

    synergies: ['felscarred-stacks', 'fury-system-felscarred']
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'resource-gen',
    damageMultiplier: 1.00,
    maxStacks: 2,  // 2충전
    stackDuration: null,
    cooldown: 10,  // 10초당 1충전
    dependencies: null,

    // 격노 생성
    furyGeneration: 15,

    // 지옥상흔 중첩 생성
    felscarredStackGeneration: {
      enabled: true,
      stacksPerCast: 1
    },

    // 광역 피해
    damageScaling: {
      singleTarget: 1.00,
      multipleTargets: 1.50  // 경로상 모든 적 (최대 5타겟)
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
    migrationNotes: 'Migrated from mechanisms.js - Fel Rush as core DPS skill in Felscarred build'
  }
};
