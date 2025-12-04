// Immolation Aura (불타는 오라)
// Havoc Demon Hunter 핵심 광역 지속 피해 스킬
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'immolation-aura',
  version: '1.0.0',
  name: {
    ko: '불타는 오라',
    en: 'Immolation Aura'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `<strong>불타는 오라 (Immolation Aura)</strong>는 파멸 악마사냥꾼의 핵심 광역 지속 피해 스킬로,
      <strong>10초간 주변 적들에게 화염 피해</strong>를 입히며 <strong>격노를 생성</strong>합니다.
      재사용 대기시간이 짧아 (30초) 자주 사용 가능하며, <strong>Initiative 버프</strong>와 함께 사용하거나
      <strong>안광 (Eye Beam) 윈도우</strong>에 맞춰 사용하여 광역 DPS를 극대화합니다.`,

    details: [
      '<strong>지속시간</strong>: 10초',
      '<strong>재사용 대기시간</strong>: 30초',
      '<strong>격노 생성</strong>: 피해 적중 시 8 격노 생성 (특성 선택 시)',
      '<strong>광역 피해</strong>: 8야드 범위 내 모든 적',
      '<strong>우선순위</strong>: 3+ 타겟 시 재사용 대기시간마다 사용',
      '<strong>Initiative 동기화</strong>: Initiative 버프와 함께 사용하여 10% 피해 증가',
      '<strong>안광 동기화</strong>: 안광 윈도우에 맞춰 사용하여 광역 버스트 극대화'
    ],

    relatedSkills: ['immolationaura', 'eyebeam', 'vengefulretreat'],

    importance: 'high'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: 258920,  // Immolation Aura buff

    stackInfo: null,  // 중첩 없음

    triggers: {
      skills: [258920],  // Immolation Aura
      events: ['SPELL_CAST', 'SPELL_PERIODIC_DAMAGE']
    },

    metrics: {
      uptimeTarget: 0.33,  // 목표 uptime 33% (10초 지속, 30초 쿨다운)
      avgStacks: null,
      wasteThreshold: 0.10,  // 10% 이상 낭비 시 경고 (쿨다운 대기 시간)

      // 불타는 오라 사용 효율 지표
      avgCasts: 15,  // 평균 사용 횟수 (전투 시간에 따라 변동)
      avgDamage: 80000,  // 평균 피해량 (타겟 수에 따라 변동)
      targetCount: 4,  // 평균 타겟 수 (이상적: 4+)
      furyGeneration: 120,  // 평균 격노 생성량 (10초 동안)

      // Initiative 동기화율
      initiativeSync: 0.70  // Initiative 버프와 동기화율 (이상적: >70%)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'aoe',
    difficulty: 'easy',

    keyPoints: [
      '불타는 오라: 10초간 광역 화염 피해',
      '재사용 대기시간: 30초',
      '격노 생성: 피해 적중 시 8 격노 (특성 선택 시)',
      '3+ 타겟 시 재사용 대기시간마다 사용',
      'Initiative 버프와 동기화 (10% 피해 증가)',
      '안광 윈도우에 맞춰 사용'
    ],

    commonMistakes: [
      {
        mistake: '단일 대상에 불타는 오라 사용 (격노 낭비)',
        impact: 'medium',
        solution: '3+ 타겟 이상일 때만 사용',
        frequency: 0.25
      },
      {
        mistake: 'Initiative 버프 없이 불타는 오라 사용',
        impact: 'medium',
        solution: 'Initiative 버프와 동기화하여 10% 피해 증가 효과 활용',
        frequency: 0.30
      },
      {
        mistake: '재사용 대기시간 완료 후 10초 이상 대기 (쿨다운 낭비)',
        impact: 'medium',
        solution: '재사용 대기시간 완료 시 즉시 사용 (3+ 타겟 상황)',
        frequency: 0.20
      }
    ],

    synergies: ['initiative-window', 'eyebeam']
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'cooldown',
    damageMultiplier: 1.00,  // 기본 (Initiative 버프: 1.10)
    maxStacks: null,
    stackDuration: 10,  // 10초 지속
    cooldown: 30,  // 30초 재사용
    dependencies: null,

    // 격노 생성 (특성 선택 시)
    furyGeneration: {
      enabled: true,  // Fallout 특성 선택 시
      furyPerTick: 8,
      tickInterval: 1  // 1초마다
    },

    // 타겟 수에 따른 피해 배율
    damageScaling: {
      singleTarget: 1.00,
      twoTargets: 2.00,
      threeTargets: 3.00,
      fourPlus: 4.00  // 8야드 범위 내 모든 적
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
    migrationNotes: 'Migrated from mechanisms.js - Core AoE DoT with fury generation and Initiative synergy'
  }
};
