// Metamorphosis (Felscarred) (탈태 변신 - 지옥상흔)
// Felscarred 빌드 탈태 변신 최적화
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'metamorphosis-felscarred',
  version: '1.0.0',
  name: {
    ko: '탈태 변신 (지옥상흔)',
    en: 'Metamorphosis (Felscarred)'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `<strong>탈태 변신 (Metamorphosis)</strong>은 지옥상흔 빌드에서도 주요 버스트 쿨다운입니다.
      알드라치 파괴자와 동일한 강화 효과를 받으나, <strong>지옥상흔 5중첩 + 지옥 돌진 빈번 사용</strong>을
      통해 더욱 폭발적인 버스트를 달성할 수 있습니다. <strong>⚠️ 중요:</strong> 오프너 중 첫 번째 안광 후
      소멸을 사용하지 않고 바로 탈태 변신을 사용하면 <strong>악마 쇄도 (Demonsurge)를 잃게 되므로 반드시 회피</strong>해야 합니다.`,

    details: [
      '<strong>지속시간</strong>: 30초 (메타 특성으로 최대 46초)',
      '<strong>최대 격노</strong>: +20 (100 → 120)',
      '<strong>체력 증가</strong>: 최대 체력 대폭 증가',
      '<strong>소멸 연속 사용</strong>: 지옥 돌진으로 격노 빠르게 재생성',
      '<strong>지옥상흔 유지</strong>: 탈태 중에도 지옥 돌진으로 중첩 유지',
      '<strong>⚠️ 악마 쇄도 손실 방지</strong>: 오프너 중 첫 번째 안광 → 소멸 → 탈태 변신 순서 준수 필수 (소멸 누락 시 악마 쇄도 손실)',
      '<strong>전략</strong>: 5중첩 달성 후 탈태 사용하여 최대 버스트'
    ],

    relatedSkills: ['metamorphosis', 'annihilation', 'deathsweep', 'felrush', 'immolationaura'],

    importance: 'critical'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: 162264,  // Metamorphosis buff

    stackInfo: null,  // 중첩 없음

    triggers: {
      skills: [191427],  // Metamorphosis 시전
      events: ['SPELL_CAST']
    },

    metrics: {
      uptimeTarget: 0.20,  // 목표 uptime 20% (4분 쿨다운, 30초 지속)
      avgStacks: null,
      wasteThreshold: 0.05,  // 5% 이상 낭비 시 경고

      // 탈태 변신 품질 지표 (지옥상흔 특화)
      avgDuration: 38,  // 평균 지속시간 (Meta Fueled: 안광 1회 사용 시 38초)
      furyAtCast: 110,  // 탈태 시전 시 격노 (이상적: 100-120)
      felscarredStacksAtCast: 5,  // 탈태 시전 시 지옥상흔 중첩 (이상적: 5)
      cooldownWaste: 0.05,  // 쿨다운 낭비율 (이상적: <5%)

      // 악마 쇄도 손실 방지
      demonsurgePreserved: 0.95  // 악마 쇄도 보존율 (이상적: >95%, 오프너 순서 준수)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'burst-window',
    difficulty: 'expert',

    keyPoints: [
      '탈태 변신: 지옥상흔 빌드 주요 버스트 쿨다운',
      '지속시간 30초 (Meta Fueled: 최대 46초)',
      '최대 격노 +20 (100 → 120)',
      '지옥상흔 5중첩 + 지옥 돌진으로 폭발적 버스트',
      '⚠️ 오프너 순서: 안광 → 소멸 → 탈태 변신 (악마 쇄도 보존)',
      '5중첩 달성 후 탈태 사용'
    ],

    commonMistakes: [
      {
        mistake: '⚠️ 오프너 중 안광 → 탈태 변신 (소멸 누락) → 악마 쇄도 손실',
        impact: 'critical',
        solution: '반드시 안광 → 소멸 → 탈태 변신 순서 준수 (소멸 1회 사용 필수)',
        frequency: 0.25
      },
      {
        mistake: '지옥상흔 중첩 부족 상태에서 탈태 진입 (<3중첩)',
        impact: 'high',
        solution: '탈태 쿨다운 20초 전부터 지옥 돌진으로 5중첩 달성',
        frequency: 0.30
      },
      {
        mistake: '탈태 중 지옥 돌진 미사용 (지옥상흔 중첩 소실)',
        impact: 'high',
        solution: '탈태 중에도 지옥 돌진을 10-12초마다 사용하여 중첩 유지',
        frequency: 0.25
      },
      {
        mistake: '격노 부족 상태에서 탈태 진입 (<80)',
        impact: 'high',
        solution: '탈태 쿨다운 10초 전부터 격노 충전 시작, 진입 시 최소 100 이상 확보',
        frequency: 0.20
      }
    ],

    synergies: ['felscarred-stacks', 'fel-rush-role', 'fury-system-felscarred']
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'cooldown',
    damageMultiplier: 1.25,  // 급속 25% 증가로 인한 간접 DPS 증가
    maxStacks: null,
    stackDuration: 30,  // 기본 30초 (Meta Fueled: 최대 46초)
    cooldown: 240,  // 4분
    dependencies: ['felscarred-stacks'],

    // 탈태 변신 효과
    effects: {
      haste: 0.25,  // 급속 25% 증가
      healthIncrease: 0.50,  // 최대 생명력 50% 증가
      maxFuryIncrease: 20,  // 최대 격노 +20
      movementSpeed: 0.30,  // 이동 속도 30% 증가

      // 스킬 변환
      chaosStrikeToAnnihilation: true,  // 혼돈 일격 → 소멸 (피해 20% 증가)
      bladeDanceToDeathSweep: true,     // 칼춤 → 죽음의 칼춤

      // 지옥상흔 특화
      felscarredStackRequirement: 5,  // 탈태 진입 전 5중첩 필수
      felRushFuryGeneration: 15  // 탈태 중 지옥 돌진으로 빠른 격노 재생성
    },

    // 악마 쇄도 보존
    demonsurgePreservation: {
      enabled: true,
      openerSequence: ['eyebeam', 'annihilation', 'metamorphosis'],
      critical: true  // 순서 미준수 시 악마 쇄도 손실
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
    migrationNotes: 'Migrated from mechanisms.js - Felscarred Metamorphosis with Demonsurge preservation requirement'
  }
};
