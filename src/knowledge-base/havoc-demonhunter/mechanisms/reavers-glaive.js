// Reaver's Glaive (파괴자의 글레이브)
// Aldrachi Reaver 영웅 특성 핵심 메커니즘
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'reavers-glaive',
  version: '1.0.0',
  name: {
    ko: '파괴자의 글레이브',
    en: "Reaver's Glaive"
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `탈태 변신 중 혼돈 일격 또는 안광 적중 시 <strong>6초간 피해 12% 증가</strong> 버프 획득.
      최대 3중첩 (36% 피해 증가)까지 가능하며, 각 중첩은 <strong>독립적인 12초 지속시간</strong>을 가집니다.
      알드라치 파괴자 빌드의 핵심 메커니즘으로, 탈태 변신 버스트 윈도우에서 DPS를 극대화합니다.
      <strong>Thrill of the Fight</strong> 버프와 상호작용하며, <strong>영혼 파편 RNG</strong>에 따라 추가 충전을 얻을 수 있습니다.
      <strong>⚠️ AoE 주의:</strong> 광역 상황에서는 <strong>파괴자의 글레이브 → 혼돈 일격 → 칼춤 순서를 반드시 준수</strong>해야 합니다.`,

    details: [
      '<strong>중첩 생성</strong>: 탈태 변신 중 혼돈 일격/소멸 또는 안광 적중 시',
      '<strong>지속시간</strong>: 각 중첩당 12초 독립 지속',
      '<strong>최대 중첩</strong>: 3중첩 (36% 피해 증가)',
      '<strong>버프 유지</strong>: 탈태 종료 후에도 12초간 유지 가능',
      '<strong>Thrill of the Fight 상호작용</strong>: Thrill of the Fight 버프가 3초 이상 남았거나 Glaive Flurry/Rending Strike 사용 전에는 파괴자의 글레이브 사용 보류',
      '<strong>영혼 파편 RNG</strong>: 영혼 파편 생성 RNG에 따라 오프너 중 파괴자의 글레이브를 2회 사용할 수 있음 (추가 충전 가능)',
      '<strong>⚠️ AoE 강제 순서</strong>: 광역 상황에서는 파괴자의 글레이브 → 혼돈 일격 → 칼춤/죽음의 칼춤 순서 필수 (칼춤 먼저 사용 시 DPS 손실)',
      '<strong>최적화</strong>: 탈태 시작 시 안광 즉시 사용하여 빠른 3중첩 달성'
    ],

    relatedSkills: ['eyebeam', 'chaosstrike', 'metamorphosis', 'annihilation'],

    importance: 'critical'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: 442294,  // Reaver's Glaive 버프 ID (Wowhead 기준)

    stackInfo: {
      max: 3,              // 최대 3중첩
      duration: 12000,     // 12초 (밀리초)
      damagePerStack: 0.12,  // 중첩당 12% 피해 증가
      independentStacks: true  // 각 중첩 독립 지속시간
    },

    triggers: {
      skills: [162243, 201427],  // Eye Beam, Annihilation (Chaos Strike)
      events: ['SPELL_DAMAGE']
    },

    metrics: {
      uptimeTarget: 0.90,  // 목표 uptime 90% (탈태 버스트 윈도우 중)
      avgStacks: 2.5,      // 평균 중첩 수 (이상적: 2.5-3.0)
      wasteThreshold: 0.05  // 5% 이상 낭비 시 경고
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'burst-window',
    difficulty: 'medium',

    keyPoints: [
      '탈태 변신 중 안광 또는 소멸 적중 시 12초간 피해 12% 증가 중첩 획득',
      '최대 3중첩 (36% 피해 증가) 독립 지속시간',
      'Thrill of the Fight (3초 이상) 또는 Glaive Flurry/Rending Strike 전에는 사용 보류',
      'AoE 상황: 파괴자의 글레이브 → 혼돈 일격 → 칼춤 순서 필수',
      '탈태 시작 시 안광 즉시 사용하여 빠른 3중첩 달성이 핵심'
    ],

    commonMistakes: [
      {
        mistake: '탈태 종료 후 중첩 갱신 누락',
        impact: 'high',
        solution: '탈태 종료 12초 전부터 중첩 갱신을 중단하여 탈태 종료 후에도 12초간 버프 유지',
        frequency: 0.35
      },
      {
        mistake: 'AoE 상황에서 칼춤 먼저 사용 (순서 오류)',
        impact: 'high',
        solution: '반드시 파괴자의 글레이브 → 혼돈 일격 → 칼춤 순서 준수',
        frequency: 0.25
      },
      {
        mistake: 'Thrill of the Fight 3초 남았을 때 파괴자의 글레이브 사용',
        impact: 'medium',
        solution: 'Thrill of the Fight 버프가 3초 이상 남았으면 파괴자의 글레이브 사용 보류',
        frequency: 0.20
      }
    ],

    synergies: ['metamorphosis', 'initiative-window']  // 관련 메커니즘 ID
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'stacking-buff',
    damageMultiplier: 1.12,  // 중첩당 12% 증가
    maxStacks: 3,
    stackDuration: 12,       // 초 단위
    dependencies: ['metamorphosis']  // 탈태 변신 필수
  },

  // ============================================
  // 메타데이터
  // ============================================
  metadata: {
    patch: '11.2',
    lastUpdated: '2025-01-10',
    source: 'wowhead',
    verified: true,
    migrationNotes: 'Migrated from mechanisms.js + Phase 2.2 Wowhead enhancements (Thrill of the Fight, RNG, AoE순서)'
  }
};
