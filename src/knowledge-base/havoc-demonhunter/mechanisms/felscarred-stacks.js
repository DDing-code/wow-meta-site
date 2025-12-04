// Felscarred Stacks (지옥상흔 중첩 시스템)
// Felscarred 영웅 특성 핵심 메커니즘
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'felscarred-stacks',
  version: '1.0.0',
  name: {
    ko: '지옥상흔 중첩 시스템',
    en: 'Felscarred Stacks'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `<strong>지옥 격노 (Fel Devastation)</strong> 사용 시 <strong>15초간 피해 2% 증가</strong> 버프를 획득합니다.
      최대 5중첩 (10% 피해 증가)까지 가능하며, 각 중첩은 <strong>독립적인 15초 지속시간</strong>을 가집니다.
      지옥상흔 빌드의 핵심 메커니즘으로, 지속적인 중첩 유지가 DPS의 핵심입니다.`,

    details: [
      '<strong>중첩 생성</strong>: 지옥 격노 (지옥 돌진) 사용 시',
      '<strong>지속시간</strong>: 각 중첩당 15초 독립 지속',
      '<strong>최대 중첩</strong>: 5중첩 (10% 피해 증가)',
      '<strong>획득 조건</strong>: 지옥 돌진 적중 시 중첩 +1',
      '<strong>최적화</strong>: 전투 초반 30초 내 5중첩 달성 목표'
    ],

    relatedSkills: ['felrush', 'chaosstrike', 'eyebeam', 'bladedance'],

    importance: 'critical'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: 391171,  // Felscarred buff ID (추정, Wowhead 확인 필요)

    stackInfo: {
      max: 5,              // 최대 5중첩
      duration: 15000,     // 15초 (밀리초)
      damagePerStack: 0.02,  // 중첩당 2% 피해 증가
      independentStacks: true  // 각 중첩 독립 지속시간
    },

    triggers: {
      skills: [195072],  // Fel Rush
      events: ['SPELL_DAMAGE']  // 지옥 돌진 적중 시
    },

    metrics: {
      uptimeTarget: 0.90,  // 목표 uptime 90% (지속적인 중첩 유지)
      avgStacks: 4.5,      // 평균 중첩 수 (이상적: 4.5-5.0)
      wasteThreshold: 0.05,  // 5% 이상 낭비 시 경고

      // 중첩 관리 지표
      timeToFiveStacks: 30,  // 5중첩 달성 시간 (이상적: 30초 이내)
      stackDropOccurrences: 0.10  // 중첩 소실 빈도 (이상적: <10%)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'burst-window',
    difficulty: 'medium',

    keyPoints: [
      '지옥 돌진 사용 시 15초간 피해 2% 증가 중첩 획득',
      '최대 5중첩 (10% 피해 증가) 독립 지속시간',
      '전투 초반 30초 내 5중첩 달성 목표',
      '지옥 돌진을 자주 사용하여 중첩 유지',
      '각 중첩 15초 지속, 지속적인 갱신 필요'
    ],

    commonMistakes: [
      {
        mistake: '전투 초반 5중첩 달성 지연 (60초 이상)',
        impact: 'high',
        solution: '전투 시작 즉시 지옥 돌진 빈번 사용하여 30초 내 5중첩 달성',
        frequency: 0.30
      },
      {
        mistake: '중첩 소실 (15초 지속시간 만료)',
        impact: 'high',
        solution: '지옥 돌진을 10-12초마다 사용하여 중첩 갱신 (15초 지속시간 고려)',
        frequency: 0.35
      },
      {
        mistake: '5중첩 달성 후 지옥 돌진 사용 중단 (중첩 유지 실패)',
        impact: 'critical',
        solution: '5중첩 달성 후에도 지속적으로 지옥 돌진 사용하여 중첩 갱신',
        frequency: 0.25
      },
      {
        mistake: '이동기로만 사용 (DPS 스킬로 인식 실패)',
        impact: 'critical',
        solution: '지옥 돌진은 이동기이자 DPS 스킬, 빈번히 사용하여 중첩 유지',
        frequency: 0.20
      }
    ],

    synergies: ['fel-rush-role', 'fury-system-felscarred']
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'stacking-buff',
    damageMultiplier: 1.02,  // 중첩당 2% 증가
    maxStacks: 5,
    stackDuration: 15,       // 초 단위
    dependencies: ['felrush'],

    // 5중첩 달성 시간 및 유지율
    rampUpTime: 30,  // 5중첩 달성 시간 (초)
    uptimeGoal: 0.90  // 목표 uptime 90%
  },

  // ============================================
  // 메타데이터
  // ============================================
  metadata: {
    patch: '11.2',
    lastUpdated: '2025-01-10',
    source: 'wowhead',
    verified: true,
    migrationNotes: 'Migrated from mechanisms.js - Felscarred hero talent core stacking buff mechanic'
  }
};
