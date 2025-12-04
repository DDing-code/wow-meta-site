// Metamorphosis Buffs (탈태 변신 버프 강화)
// Havoc Demon Hunter 탈태 변신 중 버프 효과
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'metamorphosis-buffs',
  version: '1.0.0',
  name: {
    ko: '탈태 변신 버프 강화',
    en: 'Metamorphosis Buffs'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `<strong>탈태 변신 (Metamorphosis)</strong> 활성화 중 다양한 버프 효과를 받습니다.
      <strong>급속 (Haste) 25% 증가</strong>, <strong>최대 생명력 50% 증가</strong>,
      <strong>혼돈 일격 → 소멸 (Annihilation)</strong> 변환, <strong>칼춤 → 죽음의 칼춤</strong> 변환으로
      버스트 DPS와 생존력을 동시에 확보합니다. 탈태 변신은 파멸 악사의 핵심 버스트 윈도우입니다.`,

    details: [
      '<strong>급속 25% 증가</strong>: 공격 속도, 시전 속도, GCD 감소',
      '<strong>최대 생명력 50% 증가</strong>: 생존력 대폭 상승',
      '<strong>혼돈 일격 → 소멸</strong>: 피해 20% 증가, 낮은 격노 비용',
      '<strong>칼춤 → 죽음의 칼춤</strong>: 광역 피해 증가',
      '<strong>이동 속도 증가</strong>: 기동성 향상',
      '<strong>시너지</strong>: 파괴자의 글레이브 중첩, Initiative 버프와 완벽 동기화',
      '<strong>쿨다운</strong>: 4분 (240초)',
      '<strong>지속시간</strong>: 기본 30초 (Meta Fueled 특성: 안광당 +8초)',
      '<strong>최적화</strong>: 탈태 진입 시 격노 120 + Initiative 버프 + 주요 쿨다운 동기화'
    ],

    relatedSkills: ['metamorphosis', 'annihilation', 'deathsweep', 'eyebeam', 'vengefulretreat'],

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
      wasteThreshold: 0.05,  // 5% 이상 낭비 시 경고 (탈태 중 죽거나 타이밍 미스)

      // 탈태 변신 품질 지표
      avgDuration: 38,  // 평균 지속시간 (Meta Fueled: 안광 1회 사용 시 38초)
      furyAtCast: 110,  // 탈태 시전 시 격노 (이상적: 100-120)
      initiativeSync: 0.90,  // Initiative 버프 동기화율 (이상적: >90%)
      cooldownWaste: 0.05  // 쿨다운 낭비율 (이상적: <5%)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'burst-window',
    difficulty: 'hard',

    keyPoints: [
      '탈태 변신: 급속 25% 증가, 최대 생명력 50% 증가',
      '혼돈 일격 → 소멸 (Annihilation) 변환 (피해 20% 증가)',
      '칼춤 → 죽음의 칼춤 변환 (광역 피해 증가)',
      '기본 지속시간 30초, Meta Fueled 특성 시 안광당 +8초',
      '탈태 진입 전 격노 110-120 충전 필수',
      'Initiative 버프와 동기화 (복수의 후퇴 직전 사용)',
      '주요 쿨다운 동기화 (The Hunt, Essence Break 등)',
      '파괴자의 글레이브 중첩을 탈태 내에서 최대화'
    ],

    commonMistakes: [
      {
        mistake: '탈태 진입 시 격노 부족 (<80)',
        impact: 'critical',
        solution: '탈태 쿨다운 10초 전부터 격노 충전 시작, 진입 시 최소 100 이상 확보',
        frequency: 0.35
      },
      {
        mistake: 'Initiative 버프 없이 탈태 진입 (복수의 후퇴 미사용)',
        impact: 'high',
        solution: '탈태 시전 직전 (1-2초 전) 복수의 후퇴 사용하여 Initiative 버프 획득',
        frequency: 0.30
      },
      {
        mistake: '탈태 중 파괴자의 글레이브 중첩 갱신 누락',
        impact: 'high',
        solution: '탈태 시작 시 안광 즉시 사용하여 3중첩 달성, 지속적으로 소멸 사용하여 유지',
        frequency: 0.25
      },
      {
        mistake: 'Meta Fueled 특성 선택 시 탈태 중 안광 미사용',
        impact: 'high',
        solution: '탈태 직후 안광 사용 → 30초 후 재사용하여 총 46초 버스트 윈도우 확보',
        frequency: 0.20
      },
      {
        mistake: '탈태 쿨다운 준비 완료 후 사용 지연 (10초 이상)',
        impact: 'medium',
        solution: '탈태 쿨다운 완료 시 즉시 사용 (격노 충전 완료 상태)',
        frequency: 0.15
      }
    ],

    synergies: ['reavers-glaive', 'meta-fueled', 'initiative-window', 'fury-system']
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
    dependencies: null,

    // 탈태 변신 효과
    effects: {
      haste: 0.25,  // 급속 25% 증가
      healthIncrease: 0.50,  // 최대 생명력 50% 증가
      movementSpeed: 0.30,  // 이동 속도 30% 증가

      // 스킬 변환
      chaosStrikeToAnnihilation: true,  // 혼돈 일격 → 소멸 (피해 20% 증가)
      bladeDanceToDeathSweep: true,     // 칼춤 → 죽음의 칼춤

      // Meta Fueled 특성 (선택 시)
      durationExtensionPerEyeBeam: 8  // 안광당 +8초
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
    migrationNotes: 'Migrated from mechanisms.js - Metamorphosis buff effects and burst window optimization'
  }
};
