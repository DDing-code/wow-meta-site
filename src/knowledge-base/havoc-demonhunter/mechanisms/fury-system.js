// Fury System (격노 시스템)
// Havoc Demon Hunter 핵심 자원 시스템
// TWW 시즌 3 (11.2 패치) 기준

export default {
  id: 'fury-system',
  version: '1.0.0',
  name: {
    ko: '격노 시스템',
    en: 'Fury System'
  },

  // ============================================
  // 가이드 렌더링용 도메인
  // ============================================
  guide: {
    description: `<strong>격노 (Fury)</strong>는 파멸 악마사냥꾼의 핵심 자원으로,
      <strong>악마의 이빨 (Demon's Bite)</strong> 사용 또는 <strong>영혼 파편 수집</strong>으로 생성됩니다.
      격노는 <strong>혼돈 일격 (Chaos Strike)</strong>, <strong>안광 (Eye Beam)</strong> 등 주요 딜 스킬에 소모되며,
      최대 120까지 저장 가능합니다. 격노 관리는 파멸 악사의 DPS를 극대화하는 핵심 요소입니다.`,

    details: [
      '<strong>최대 격노</strong>: 120',
      '<strong>격노 생성</strong>: 악마의 이빨 (20-40), 영혼 파편 수집 (30)',
      '<strong>격노 소모</strong>: 혼돈 일격/소멸 (40), 안광 (30), 죽음의 칼춤 (25)',
      '<strong>관리 원칙</strong>: 격노 120 도달 전 소모 스킬 사용 (낭비 방지)',
      '<strong>버스트 전략</strong>: 탈태 변신 전 격노 최대 충전 (120) 후 진입',
      '<strong>영혼 파편 우선순위</strong>: 격노 90 이상일 때는 파편 수집 후순위',
      '<strong>격노 낭비 방지</strong>: 악마의 이빨 사용 전 현재 격노 확인 필수'
    ],

    relatedSkills: ['demonsbite', 'chaosstrike', 'eyebeam', 'deathlysweep', 'annihilation'],

    importance: 'critical'
  },

  // ============================================
  // 로그 분석용 도메인
  // ============================================
  analysis: {
    buffId: null,  // 격노는 자원이므로 버프 ID 없음
    debuffId: null,

    stackInfo: null,

    triggers: {
      // 격노 생성 스킬
      skills: [162243, 344859],  // Demon's Bite (20-40), Soul Fragment collection (30)
      events: ['SPELL_CAST', 'ENERGIZE']
    },

    metrics: {
      uptimeTarget: null,  // 자원이므로 uptime 개념 없음
      avgStacks: null,
      wasteThreshold: 0.05,  // 5% 이상 격노 낭비 시 경고

      // 격노 관리 지표
      avgFury: 60,  // 평균 격노 유지량 (이상적: 50-70)
      wastedFury: 0.05,  // 격노 낭비율 (이상적: <5%)
      furyAtMetamorphosis: 110  // 탈태 변신 진입 시 격노 (이상적: 100-120)
    }
  },

  // ============================================
  // AI 학습용 도메인
  // ============================================
  learning: {
    category: 'resource-management',
    difficulty: 'medium',

    keyPoints: [
      '격노는 최대 120까지 저장 가능, 초과 생성 시 낭비',
      '악마의 이빨: 20-40 격노 생성 (RNG)',
      '영혼 파편 수집: 30 격노 생성',
      '혼돈 일격/소멸: 40 격노 소모',
      '안광: 30 격노 소모',
      '탈태 변신 전 격노 최대 충전 (110-120) 필수',
      '격노 90 이상일 때는 영혼 파편 수집 후순위'
    ],

    commonMistakes: [
      {
        mistake: '격노 120 도달 후 악마의 이빨 계속 사용 (격노 낭비)',
        impact: 'high',
        solution: '격노 90 이상일 때는 혼돈 일격/안광 우선 사용',
        frequency: 0.40
      },
      {
        mistake: '탈태 변신 진입 시 격노 부족 (<80)',
        impact: 'critical',
        solution: '탈태 변신 쿨다운 10초 전부터 격노 충전 시작',
        frequency: 0.30
      },
      {
        mistake: '영혼 파편 수집 시 격노 초과 생성 (120 → 150 시도)',
        impact: 'medium',
        solution: '격노 90 이상일 때는 파편 수집 보류, 소모 스킬 먼저 사용',
        frequency: 0.25
      },
      {
        mistake: '격노 부족 상태에서 안광 사용 시도 (30 미만)',
        impact: 'medium',
        solution: '안광 사용 전 격노 최소 30 확보',
        frequency: 0.20
      }
    ],

    synergies: ['meta-fueled', 'reavers-glaive']
  },

  // ============================================
  // 시뮬레이션용 도메인
  // ============================================
  simulation: {
    type: 'resource-gen',
    damageMultiplier: null,
    maxStacks: 120,  // 최대 격노
    stackDuration: null,  // 격노는 만료되지 않음
    cooldown: null,

    dependencies: null,

    // 격노 생성/소모 데이터
    generation: {
      demonsBite: {
        min: 20,
        max: 40,
        avg: 30
      },
      soulFragment: 30,
      other: {
        immolationAura: 8  // 불타는 오라 피해 시 8 격노 (특성 선택 시)
      }
    },

    consumption: {
      chaosStrike: 40,
      annihilation: 40,
      eyeBeam: 30,
      bladeDance: 25,
      deathSweep: 25
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
    migrationNotes: 'Migrated from mechanisms.js - Core Fury resource system for Havoc'
  }
};
