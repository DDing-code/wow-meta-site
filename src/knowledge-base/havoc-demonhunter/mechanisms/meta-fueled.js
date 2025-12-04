// Meta Fueled (메타 특성)
// Aldrachi Reaver 영웅 특성 - Meta Fueled 특성
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'meta-fueled',
  version: '1.0.0',
  name: {
    ko: '메타 특성',
    en: 'Meta Fueled'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `<strong>안광 (Eye Beam)</strong> 사용 시 <strong>탈태 변신 지속시간 8초 증가</strong> 효과를 제공합니다.
      이를 통해 30초 기본 지속시간을 최대 46초까지 연장할 수 있어,
      버스트 윈도우를 극대화하고 파괴자의 글레이브 중첩을 더 오래 유지할 수 있습니다.`,

    details: [
      '<strong>기본 지속시간</strong>: 탈태 변신 30초',
      '<strong>안광 사용 시</strong>: +8초 연장 (총 38초)',
      '<strong>안광 2회 사용</strong>: +16초 연장 (총 46초 가능)',
      '<strong>전략</strong>: 탈태 직후 안광 사용 → 30초 후 재사용 → 총 46초 버스트',
      '<strong>격노 효율</strong>: 긴 탈태 지속시간 = 더 많은 소멸 사용 기회'
    ],

    relatedSkills: ['eyebeam', 'metamorphosis'],

    importance: 'high'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: 162264,  // Metamorphosis buff ID

    stackInfo: null,  // 중첩 없음 (지속시간 연장)

    triggers: {
      skills: [198013],  // Eye Beam
      events: ['SPELL_CAST']  // 안광 시전 시 탈태 지속시간 연장
    },

    metrics: {
      uptimeTarget: null,  // 탈태 자체는 쿨다운 기반
      avgStacks: null,
      wasteThreshold: null,
      // 측정 대상: 탈태 평균 지속시간 (목표 40초 이상)
      avgDuration: 40  // 안광 1회 사용 시 38초, 2회 사용 시 46초
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'burst-window',
    difficulty: 'medium',

    keyPoints: [
      '안광 사용 시 탈태 변신 지속시간 8초 연장',
      '기본 30초 → 안광 1회 38초 → 안광 2회 46초',
      '탈태 직후 안광 사용하여 버스트 윈도우 극대화',
      '긴 탈태 지속시간으로 더 많은 소멸 사용 기회 확보',
      '파괴자의 글레이브 중첩을 오래 유지 가능'
    ],

    commonMistakes: [
      {
        mistake: '탈태 변신 종료 직전에 안광 사용 (지속시간 연장 효과 낭비)',
        impact: 'high',
        solution: '탈태 직후 안광 사용하여 최대 지속시간 확보',
        frequency: 0.30
      },
      {
        mistake: '안광 재사용 대기시간 30초를 고려하지 않고 탈태 종료 후 사용',
        impact: 'medium',
        solution: '탈태 30초 시점에 안광 재사용 가능하므로 탈태 내에서 2회 사용 가능',
        frequency: 0.25
      },
      {
        mistake: '탈태 지속시간 연장을 고려하지 않고 파괴자의 글레이브 중첩 갱신 중단',
        impact: 'medium',
        solution: '탈태 지속시간이 연장되므로 파괴자의 글레이브 중첩을 계속 갱신 가능',
        frequency: 0.20
      }
    ],

    synergies: ['reavers-glaive', 'metamorphosis-buffs']  // 관련 메커니즘 ID
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'cooldown',  // 쿨다운 기반 버프 연장
    damageMultiplier: null,  // 직접 피해 증가 없음 (간접적으로 버스트 윈도우 연장)
    maxStacks: null,
    stackDuration: null,
    cooldown: null,  // 탈태 자체의 쿨다운 (4분)
    dependencies: ['metamorphosis', 'eyebeam'],

    // 탈태 지속시간 연장 효과
    durationExtension: {
      base: 30,  // 기본 30초
      perEyeBeam: 8,  // 안광당 +8초
      maxExtension: 16  // 최대 +16초 (안광 2회)
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
    migrationNotes: 'Migrated from mechanisms.js - Meta Fueled talent extending Metamorphosis duration'
  }
};
