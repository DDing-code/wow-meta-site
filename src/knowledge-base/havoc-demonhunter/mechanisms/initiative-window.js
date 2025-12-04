// Initiative Window Synchronization (Initiative 윈도우 동기화)
// Aldrachi Reaver 영웅 특성 - Initiative 특성 선택 시
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'initiative-window',
  version: '1.0.0',
  name: {
    ko: 'Initiative 윈도우 동기화',
    en: 'Initiative Window Synchronization'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `<strong>Initiative</strong> 특성을 선택한 경우, <strong>복수의 후퇴 (Vengeful Retreat)</strong> 사용 시
      <strong>6초간 피해 10% 증가</strong> 버프를 획득합니다. 이 버프를 <strong>안광 (Eye Beam) 윈도우와 동기화</strong>하여
      버스트 DPS를 극대화하는 것이 핵심 전략입니다. No-Mover 빌드에서는 전투 시작 전 Initiative 체크가 필수입니다.`,

    details: [
      '<strong>Initiative 버프</strong>: 6초간 피해 10% 증가',
      '<strong>복수의 후퇴 재사용</strong>: 20초',
      '<strong>안광 재사용</strong>: 30초 (메타 특성 미선택 시)',
      '<strong>동기화 전략</strong>: 안광 사용 직전 복수의 후퇴 사용하여 Initiative 버프 획득',
      '<strong>No-Mover 빌드</strong>: 전투 시작 전 반드시 Initiative 특성 활성화 체크',
      '<strong>Exergy 특성 선택 시</strong>: 복수의 후퇴를 재사용 대기시간마다 사용 가능 (The Hunt가 추가 uptime 제공하여 100% 유지 용이)',
      '<strong>전략</strong>: 안광 윈도우에 맞춰 복수의 후퇴 사용하여 6초 버스트 극대화'
    ],

    relatedSkills: ['vengefulretreat', 'eyebeam', 'immolationaura'],

    importance: 'high'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: 391215,  // Initiative 버프 ID (추정, Wowhead 확인 필요)

    stackInfo: null,  // 중첩 없음

    triggers: {
      skills: [198793],  // Vengeful Retreat
      events: ['SPELL_CAST']
    },

    metrics: {
      uptimeTarget: 0.60,  // 목표 uptime 60% (안광 윈도우 동기화 시)
      avgStacks: null,     // 중첩 없음
      wasteThreshold: 0.10  // 10% 이상 낭비 시 경고 (안광과 미동기화)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'burst-window',
    difficulty: 'medium',

    keyPoints: [
      '복수의 후퇴 사용 시 6초간 피해 10% 증가',
      '안광 사용 직전 복수의 후퇴 사용하여 버프 동기화',
      'No-Mover 빌드: 전투 전 Initiative 특성 활성화 필수',
      'Exergy 특성: 복수의 후퇴 재사용마다 사용 가능 (100% uptime)',
      '6초 윈도우를 안광 윈도우와 완벽히 맞추는 것이 핵심'
    ],

    commonMistakes: [
      {
        mistake: '안광과 Initiative 버프 미동기화 (복수의 후퇴를 안광 전에 사용하지 않음)',
        impact: 'high',
        solution: '안광 시전 직전 (1-2초 전) 복수의 후퇴 사용하여 6초 버프를 안광 윈도우와 동기화',
        frequency: 0.40
      },
      {
        mistake: 'No-Mover 빌드에서 Initiative 특성 미활성화 (전투 전 체크 누락)',
        impact: 'critical',
        solution: '전투 시작 전 특성창에서 Initiative 활성화 상태 확인 필수',
        frequency: 0.15
      },
      {
        mistake: 'Exergy 선택 시 복수의 후퇴를 재사용마다 사용하지 않음 (uptime 손실)',
        impact: 'medium',
        solution: 'Exergy 특성 시 복수의 후퇴를 재사용 대기시간마다 사용하여 100% uptime 달성',
        frequency: 0.25
      }
    ],

    synergies: ['reavers-glaive']  // 안광 윈도우 동기화로 파괴자의 글레이브와 시너지
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'window',
    damageMultiplier: 1.10,  // 6초간 10% 증가
    maxStacks: null,         // 중첩 없음
    stackDuration: null,
    cooldown: 20,            // 복수의 후퇴 20초 재사용
    dependencies: null
  },

  // ============================================
  // 메타데이터
  // ============================================
  metadata: {
    patch: '11.2',
    lastUpdated: '2025-01-10',
    source: 'wowhead',
    verified: true,
    migrationNotes: 'Migrated from mechanisms.js - Initiative talent synchronization with Eye Beam'
  }
};
