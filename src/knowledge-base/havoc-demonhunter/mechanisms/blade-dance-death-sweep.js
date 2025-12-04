// Blade Dance / Death Sweep (칼춤 / 죽음의 칼춤)
// Havoc Demon Hunter 핵심 광역 피해 스킬
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'blade-dance-death-sweep',
  version: '1.0.0',
  name: {
    ko: '칼춤 / 죽음의 칼춤',
    en: 'Blade Dance / Death Sweep'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `<strong>칼춤 (Blade Dance)</strong>은 파멸 악마사냥꾼의 주요 광역 피해 스킬로,
      <strong>격노 25 소모</strong>하여 주변 적들에게 피해를 입힙니다.
      <strong>탈태 변신 (Metamorphosis)</strong> 중에는 <strong>죽음의 칼춤 (Death Sweep)</strong>으로 변환되어
      피해와 범위가 증가합니다. <strong>⚠️ AoE 주의:</strong> 광역 상황에서는 <strong>파괴자의 글레이브 → 혼돈 일격 → 칼춤 순서를 반드시 준수</strong>해야 합니다.`,

    details: [
      '<strong>격노 소모</strong>: 25',
      '<strong>탈태 변신 중</strong>: 죽음의 칼춤 (Death Sweep)으로 변환 (피해 및 범위 증가)',
      '<strong>재사용 대기시간</strong>: 10초 (2충전)',
      '<strong>우선순위</strong>: 2+ 타겟 시 혼돈 일격보다 우선',
      '<strong>⚠️ AoE 강제 순서</strong>: 파괴자의 글레이브 → 혼돈 일격 → 칼춤/죽음의 칼춤 (칼춤 먼저 사용 시 DPS 손실)',
      '<strong>충전 관리</strong>: 2충전 모두 사용하지 말고 1충전 보유 (쿨다운 돌리기)',
      '<strong>시너지</strong>: First Blood 특성 선택 시 첫 타격 피해 증가'
    ],

    relatedSkills: ['bladedance', 'deathsweep', 'metamorphosis'],

    importance: 'high'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: null,  // 직접 버프 없음

    stackInfo: null,

    triggers: {
      skills: [188499, 210152],  // Blade Dance, Death Sweep
      events: ['SPELL_CAST', 'SPELL_DAMAGE']
    },

    metrics: {
      uptimeTarget: null,  // 스킬이므로 uptime 개념 없음
      avgStacks: null,
      wasteThreshold: null,

      // 칼춤/죽음의 칼춤 사용 효율 지표
      avgCasts: 20,  // 평균 사용 횟수 (전투 시간에 따라 변동)
      avgDamage: 120000,  // 평균 피해량 (장비 및 타겟 수에 따라 변동)
      targetCount: 3,  // 평균 타겟 수 (이상적: 3+)
      chargeWaste: 0.10,  // 충전 낭비율 (이상적: <10%, 2충전 모두 쌓인 채로 10초 이상 대기)

      // AoE 순서 준수율
      aoeSequenceCompliance: 0.85  // AoE 순서 준수율 (이상적: >85%, 파괴자의 글레이브 → 혼돈 일격 → 칼춤)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'aoe',
    difficulty: 'medium',

    keyPoints: [
      '칼춤: 격노 25 소모, 주요 광역 피해 스킬',
      '죽음의 칼춤: 탈태 변신 중 칼춤 대체, 피해 및 범위 증가',
      '재사용 대기시간: 10초 (2충전)',
      '2+ 타겟 시 혼돈 일격보다 우선',
      'AoE 순서: 파괴자의 글레이브 → 혼돈 일격 → 칼춤 필수',
      '충전 관리: 1충전 보유하여 쿨다운 돌리기'
    ],

    commonMistakes: [
      {
        mistake: 'AoE 상황에서 칼춤 먼저 사용 (파괴자의 글레이브 전에)',
        impact: 'high',
        solution: '반드시 파괴자의 글레이브 → 혼돈 일격 → 칼춤 순서 준수',
        frequency: 0.25
      },
      {
        mistake: '2충전 모두 쌓인 채로 10초 이상 대기 (충전 낭비)',
        impact: 'medium',
        solution: '1충전은 보유하되, 2충전 달성 시 즉시 사용',
        frequency: 0.30
      },
      {
        mistake: '단일 대상에 칼춤 사용 (격노 낭비)',
        impact: 'medium',
        solution: '단일 대상에는 혼돈 일격 사용 (격노 효율 더 높음)',
        frequency: 0.20
      },
      {
        mistake: '탈태 변신 중 칼춤 미사용 (죽음의 칼춤 미활용)',
        impact: 'medium',
        solution: '탈태 변신 중에는 자동으로 죽음의 칼춤으로 변환되므로 평소처럼 사용',
        frequency: 0.15
      }
    ],

    synergies: ['reavers-glaive', 'metamorphosis-buffs', 'chaos-strike-annihilation']
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'cooldown',  // 충전 기반 쿨다운
    damageMultiplier: 1.00,  // 기본 (타겟 수에 따라 변동)
    maxStacks: 2,  // 2충전
    stackDuration: null,
    cooldown: 10,  // 10초당 1충전
    dependencies: ['fury-system'],

    // 격노 소모
    furyConsumption: 25,

    // 타겟 수에 따른 피해 배율
    damageScaling: {
      singleTarget: 1.00,
      twoTargets: 1.80,  // 2타겟 시 총 피해량 (단일 대상 대비)
      threeTargets: 2.40,
      fourPlus: 3.00
    },

    // 탈태 변신 중 변환
    metamorphosisTransform: {
      enabled: true,
      damageIncrease: 0.15,  // 피해 15% 증가
      rangeIncrease: 0.20,   // 범위 20% 증가
      skillId: 210152  // Death Sweep
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
    migrationNotes: 'Migrated from mechanisms.js - Core AoE skill with charge-based cooldown and AoE sequence requirement'
  }
};
