// 파멸 악마사냥꾼 스탯 우선순위 데이터
// TWW 시즌 3 (11.2 패치) 기준

export const havocStats = {
  aldrachireaver: {
    priority: '민첩성 > 치명타 = 특화 > 가속 = 유연성 > 숙련',

    // 스탯 가중치 (SimC 기준, 민첩성 1.0 대비)
    statWeights: {
      agility: { weight: 1.00, description: '기준 능력치' },
      criticalStrike: { weight: 0.85, description: '치명타 1% = 민첩성 0.85배 효율' },
      mastery: { weight: 0.82, description: '특화 1% = 민첩성 0.82배 효율' },
      haste: { weight: 0.75, description: '가속 1% = 민첩성 0.75배 효율' },
      versatility: { weight: 0.70, description: '유연성 1% = 민첩성 0.70배 효율' }
    },

    // Break Point 분석
    breakPoints: {
      haste: [
        { threshold: 0, gcd: 1.5, description: '기본 GCD 1.5초' },
        { threshold: 15, gcd: 1.3, description: '15% 가속: GCD 1.3초 (추천 최소값)' },
        { threshold: 30, gcd: 1.1, description: '30% 가속: GCD 1.1초 (이상적)' },
        { threshold: 50, gcd: 1.0, description: '50% 가속: GCD 1.0초 (최소값, 넘기지 않음)' }
      ],
      criticalStrike: [
        { threshold: 30, benefit: '낮음', description: '30% 미만: Chaos Theory 발동률 불안정' },
        { threshold: 40, benefit: '중간', description: '40% 치명: 안정적 Chaos Theory (추천)' },
        { threshold: 50, benefit: '높음', description: '50% 이상: 높은 버스트 DPS' }
      ],
      mastery: [
        { threshold: 25, benefit: '기본', description: '25% 특화: 기본 혼돈 피해 증폭' },
        { threshold: 35, benefit: '중간', description: '35% 특화: 파괴자 글레이브 효율 증가' },
        { threshold: 45, benefit: '높음', description: '45% 이상: 최대 혼돈 피해 (치명과 균형)' }
      ]
    },

    // 수학적 모델: DPS 기여도 계산
    dpsContribution: {
      formula: 'DPS = 민첩성 × [1 + (치명 × 0.85) + (특화 × 0.82) + (가속 × 0.75)]',
      example: {
        agility: 15000,
        crit: 0.40,
        mastery: 0.35,
        haste: 0.20,
        result: '15000 × [1 + 0.34 + 0.287 + 0.15] = 15000 × 1.777 = 26,655 DPS 기준'
      },
      note: '실제 DPS는 특성, 장비, 플레이 실력에 따라 변동'
    },

    // 장비 레벨별 최적화
    gearOptimization: {
      mythicRaid: {
        ilvl: '636-639',
        statTarget: { crit: 42, mastery: 38, haste: 18 },
        description: '레이드 환경: 치명/특화 균형 (버스트 DPS 극대화)'
      },
      mythicPlus: {
        ilvl: '636-639',
        statTarget: { crit: 38, mastery: 35, haste: 25 },
        description: '쐐기돌: 가속 증가 (빠른 격노 생성 및 쿨다운 회전)'
      }
    },

    stats: [
      {
        name: '민첩성',
        description: '주 능력치 - 모든 공격력 증가',
        weight: 1.00,
        formula: 'DPS = 민첩성 × 공격력 계수 (1.0 기준)',
        priority: 1
      },
      {
        name: '치명타',
        description: '치명타 확률 증가 - 버스트 딜 강화',
        weight: 0.85,
        formula: '치명타 1% = 민첩성 0.85배 효율 (Chaos Theory 특성 시)',
        priority: 2,
        breakPoint: '40% 권장 (안정적 발동률)'
      },
      {
        name: '특화 (혼돈)',
        description: '혼돈 피해 증가 - 파괴자 빌드 핵심',
        weight: 0.82,
        formula: '특화 1% = 혼돈 스킬 피해 +1% (소멸, 혼돈 일격, 안광 등)',
        priority: 2,
        breakPoint: '35% 권장 (파괴자 글레이브 효율)'
      },
      {
        name: '가속',
        description: '공격 속도 및 쿨다운 감소',
        weight: 0.75,
        formula: '가속 1% = GCD 감소 + 쿨다운 0.75배 빨라짐',
        priority: 3,
        breakPoint: '15% 최소, 30% 이상 권장'
      },
      {
        name: '유연성',
        description: '모든 피해 및 치유 증가',
        weight: 0.70,
        formula: '유연성 1% = 모든 피해 +0.5%, 받는 피해 -0.5%',
        priority: 4
      },
      {
        name: '숙련',
        description: '공격력 및 방어력 증가 (최저 우선순위)',
        weight: 0.65,
        priority: 5
      }
    ],

    note: '치명타와 특화를 균형있게 맞추는 것이 중요합니다 (40/35 비율 추천). 파괴자 빌드는 특화의 혼돈 피해 증가가 매우 효과적입니다.',

    simcSettings: {
      description: 'SimulationCraft를 사용하여 개인 장비에 최적화된 스탯 우선순위를 확인하세요.',
      command: 'simc armory=region=kr,server=azshara,name=캐릭터명 calculate_scale_factors=1',
      weightFormula: 'pawn: v1:"Havoc DH":Agility=1.00,CritRating=0.85,MasteryRating=0.82,HasteRating=0.75,Versatility=0.70'
    }
  },

  felscarred: {
    priority: '민첩성 > 치명타 > 가속 > 특화 = 유연성 > 숙련',

    // 스탯 가중치 (SimC 기준, 민첩성 1.0 대비)
    statWeights: {
      agility: { weight: 1.00, description: '기준 능력치' },
      criticalStrike: { weight: 0.88, description: '치명타 1% = 민첩성 0.88배 효율 (지옥상흔 특화)' },
      haste: { weight: 0.82, description: '가속 1% = 민첩성 0.82배 효율 (중첩 생성 속도)' },
      mastery: { weight: 0.72, description: '특화 1% = 민첩성 0.72배 효율' },
      versatility: { weight: 0.70, description: '유연성 1% = 민첩성 0.70배 효율' }
    },

    // Break Point 분석
    breakPoints: {
      haste: [
        { threshold: 0, felRushCD: 10.0, description: '기본 지옥 돌진 쿨다운 10초' },
        { threshold: 20, felRushCD: 8.3, description: '20% 가속: 지옥 돌진 8.3초 (추천 최소값)' },
        { threshold: 30, felRushCD: 7.7, description: '30% 가속: 지옥 돌진 7.7초 (이상적)' },
        { threshold: 40, felRushCD: 7.1, description: '40% 가속: 지옥 돌진 7.1초 (중첩 유지 안정화)' }
      ],
      criticalStrike: [
        { threshold: 35, benefit: '낮음', description: '35% 미만: 지옥상흔 버프 효율 낮음' },
        { threshold: 45, benefit: '중간', description: '45% 치명: 안정적 버프 효율 (추천)' },
        { threshold: 55, benefit: '높음', description: '55% 이상: 최대 버스트 DPS' }
      ],
      felScarredStacks: [
        { stacks: 15, uptime: '50%', description: '15중첩 평균: 중첩 유지 불안정' },
        { stacks: 20, uptime: '75%', description: '20중첩 평균: 안정적 중첩 유지 (가속 20% 필요)' },
        { stacks: 25, uptime: '90%', description: '25중첩 유지: 최대 효율 (가속 30% + 지옥 돌진 관리)' }
      ]
    },

    // 수학적 모델: DPS 기여도 계산
    dpsContribution: {
      formula: 'DPS = 민첩성 × [1 + (치명 × 0.88) + (가속 × 0.82) + (특화 × 0.72)] × (1 + 지옥상흔 버프)',
      example: {
        agility: 15000,
        crit: 0.45,
        haste: 0.30,
        mastery: 0.20,
        felScarredBuff: 0.15,
        result: '15000 × [1 + 0.396 + 0.246 + 0.144] × 1.15 = 15000 × 1.786 × 1.15 = 30,804 DPS'
      },
      note: '지옥상흔 버프 25중첩 시 주 능력치 증가 효과 포함'
    },

    // 장비 레벨별 최적화
    gearOptimization: {
      mythicRaid: {
        ilvl: '636-639',
        statTarget: { crit: 45, haste: 28, mastery: 22 },
        description: '레이드 환경: 치명/가속 집중 (버프 유지 + 버스트 DPS)'
      },
      mythicPlus: {
        ilvl: '636-639',
        statTarget: { crit: 42, haste: 32, mastery: 20 },
        description: '쐐기돌: 가속 우선 (빠른 지옥 돌진 쿨다운 + 중첩 유지)'
      }
    },

    stats: [
      {
        name: '민첩성',
        description: '주 능력치',
        weight: 1.00,
        formula: 'DPS = 민첩성 × 공격력 계수 (1.0 기준)',
        priority: 1
      },
      {
        name: '치명타',
        description: '치명타 확률 증가 - 지옥상흔 버프 효율 증가',
        weight: 0.88,
        formula: '치명타 1% = 민첩성 0.88배 효율 (지옥상흔 주 능력치 증가 시너지)',
        priority: 2,
        breakPoint: '45% 권장 (버프 효율 극대화)'
      },
      {
        name: '가속',
        description: '공격 속도 증가 - 지옥상흔 중첩 빠른 획득',
        weight: 0.82,
        formula: '가속 1% = 지옥 돌진 쿨다운 1% 감소 + 중첩 생성 속도 증가',
        priority: 3,
        breakPoint: '20% 최소, 30% 이상 권장 (25중첩 유지)'
      },
      {
        name: '특화 (혼돈)',
        description: '혼돈 피해 증가',
        weight: 0.72,
        formula: '특화 1% = 혼돈 스킬 피해 +1%',
        priority: 4
      },
      {
        name: '유연성',
        description: '모든 피해 증가',
        weight: 0.70,
        formula: '유연성 1% = 모든 피해 +0.5%',
        priority: 4
      },
      {
        name: '숙련',
        description: '공격력 증가 (최저 우선순위)',
        weight: 0.65,
        priority: 5
      }
    ],

    note: '지옥상흔 빌드는 치명타와 가속을 우선시하여 버프 중첩을 빠르게 쌓는 것이 중요합니다 (45/30 비율 추천). 가속 30% 이상 시 25중첩 유지가 훨씬 안정적입니다.',

    simcSettings: {
      description: 'SimulationCraft를 사용하여 개인 장비에 최적화된 스탯 우선순위를 확인하세요.',
      command: 'simc armory=region=kr,server=azshara,name=캐릭터명 calculate_scale_factors=1',
      weightFormula: 'pawn: v1:"Havoc DH (Fel-Scarred)":Agility=1.00,CritRating=0.88,HasteRating=0.82,MasteryRating=0.72,Versatility=0.70'
    }
  }
};
