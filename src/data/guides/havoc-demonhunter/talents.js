// 파멸 악마사냥꾼 특성 빌드 데이터
// TWW 시즌 3 (11.2 패치) 기준

export const havocTalents = {
  // DPS 비교 데이터 (SimC 기준)
  dpsComparison: {
    singleTarget: {
      aldrachireaver: { dps: 100, description: '기준 (100%)' },
      felscarred: { dps: 98, description: '-2% (단일 대상에서 약간 낮음)' },
      delta: '-2%',
      note: '단일 대상에서는 알드라치 파괴자가 파괴자 글레이브 스택 관리로 약간 우세'
    },
    aoe2targets: {
      aldrachireaver: { dps: 100, description: '기준 (100%)' },
      felscarred: { dps: 102, description: '+2% (지옥 돌진 관통 피해)' },
      delta: '+2%',
      note: '2명 이상부터 지옥상흔의 지옥 돌진 관통 피해가 효과적'
    },
    aoe5targets: {
      aldrachireaver: { dps: 100, description: '기준 (100%)' },
      felscarred: { dps: 108, description: '+8% (광역 우세)' },
      delta: '+8%',
      note: '5명 이상 광역에서 지옥상흔의 높은 기동력과 관통 피해가 크게 우세'
    },
    burstWindow: {
      aldrachireaver: { dps: 100, description: '기준 (100%) - 30초 탈태 윈도우' },
      felscarred: { dps: 95, description: '-5% (파괴자 글레이브 폭발 피해 차이)' },
      delta: '-5%',
      note: '짧은 버스트 윈도우에서는 파괴자 글레이브의 폭발 피해가 우세'
    },
    sustained: {
      aldrachireaver: { dps: 100, description: '기준 (100%)' },
      felscarred: { dps: 101, description: '+1% (지옥상흔 버프 지속 효과)' },
      delta: '+1%',
      note: '긴 전투에서는 지옥상흔 버프 유지로 약간 우세'
    }
  },

  // 시너지 분석
  talentSynergies: {
    aldrachireaver: {
      core: [
        {
          talent: 'Reaver\'s Glaive',
          synergy: 'Metamorphosis + Eye Beam',
          effect: '탈태 중 안광/소멸 사용 시 파괴자 글레이브 중첩 생성',
          dpsGain: '+8-12%',
          priority: 'Core'
        },
        {
          talent: 'Art of the Glaive',
          synergy: 'Throw Glaive + Reaver Stacks',
          effect: '파괴자 글레이브 중첩당 투척 피해 증가 + 격노 소모',
          dpsGain: '+5-8%',
          priority: 'Core'
        },
        {
          talent: 'Chaos Theory',
          synergy: 'Critical Strike + Blade Dance',
          effect: '치명타 시 칼춤 쿨다운 감소 (평균 2-3초)',
          dpsGain: '+10-15%',
          priority: 'Essential'
        },
        {
          talent: 'Essence Break',
          synergy: 'Burst Window + Meta',
          effect: '탈태 변신과 동기화하여 20초간 모든 혼돈 피해 +40%',
          dpsGain: '+15-20%',
          priority: 'Optional (레이드 권장)'
        }
      ],
      avoidConflicts: [
        {
          talent: 'Fel Barrage',
          reason: '격노 소모가 파괴자 글레이브와 충돌 (투척에 격노 필요)',
          impact: '-3-5% DPS 손실',
          alternative: 'Glaive Tempest (광역) 또는 Essence Break (단일)'
        }
      ]
    },
    felscarred: {
      core: [
        {
          talent: 'Fel-Scarred',
          synergy: 'Eye Beam + Fel Rush',
          effect: '안광/지옥 돌진 사용 시 지옥상흔 중첩 생성 (최대 25)',
          dpsGain: '+10-15%',
          priority: 'Core'
        },
        {
          talent: 'Unbound Chaos',
          synergy: 'Fel Rush + Immolation Aura',
          effect: '화염 분출 후 지옥 돌진 피해 +500% (6초)',
          dpsGain: '+12-18%',
          priority: 'Essential'
        },
        {
          talent: 'Chaotic Transformation',
          synergy: 'Metamorphosis + Fel Rush',
          effect: '탈태 변신 시 안광 쿨다운 리셋 + 지옥 돌진 충전 2회 생성',
          dpsGain: '+8-12%',
          priority: 'Essential'
        },
        {
          talent: 'Initiative',
          synergy: 'Vengeful Retreat + Fel Rush',
          effect: '복수의 후퇴 사용 시 지옥 돌진 충전 1회 생성 + 격노 20',
          dpsGain: '+5-8%',
          priority: 'Core'
        }
      ],
      avoidConflicts: [
        {
          talent: 'Cycle of Hatred',
          reason: '가속 효과가 지옥상흔 버프 유지와 중복 (가속 스탯으로 충분)',
          impact: '-2-3% 효율 저하',
          alternative: 'Know Your Enemy (치명 증가) 또는 Looks Can Kill'
        }
      ]
    }
  },

  // 상황별 추천
  situationalRecommendations: {
    raid: {
      aldrachireaver: {
        priority: 'S Tier',
        reason: '단일 대상 + 버스트 윈도우 최적화',
        scenarios: [
          '3분 이하 보스 (파괴자 글레이브 폭발 1-2회)',
          '버스트 페이즈 중요 보스 (Essence Break 연계)',
          '이동 적은 보스 (투척 글레이브 안정적 사용)'
        ]
      },
      felscarred: {
        priority: 'A Tier',
        reason: '지속 딜 + 이동 대응',
        scenarios: [
          '5분 이상 장기전 (지옥상흔 버프 유지 효율)',
          '이동 메커니즘 많은 보스 (지옥 돌진 활용)',
          '2-3 타겟 Add 보스 (관통 피해 효율)'
        ]
      }
    },
    mythicPlus: {
      aldrachireaver: {
        priority: 'A Tier',
        reason: '대형 풀 + 티어 세트 시너지',
        scenarios: [
          '대형 풀 (8+ 마리) - 죽음의 휩쓸기 + 파괴자 폭발',
          '정지형 풀 - 안광 2회 사용 최적화',
          '버스트 타이밍 중요 던전 (네크로틱 웨이크)'
        ]
      },
      felscarred: {
        priority: 'S Tier',
        reason: '기동력 + 풀 간 이동 효율',
        scenarios: [
          '이동 많은 던전 (Dawn of the Infinite, Halls of Infusion)',
          '중소형 풀 연속 (3-5마리) - 지옥 돌진 관통',
          '탱커 빠른 풀링 - 높은 기동력으로 대응'
        ]
      }
    }
  },

  heroTalents: {
    aldrachireaver: {
      name: '알드라치 파괴자',
      rating: { raid: 'S', mythicPlus: 'A' },

      raid: {
        description: '레이드 최적화 빌드 - 파괴자의 글레이브와 안광 중심의 버스트 딜',
        wowheadUrl: 'https://www.wowhead.com/talent-calc/demon-hunter/havoc',

        keyTalents: [
          { name: 'Reaver\'s Glaive', points: 1, priority: 'Essential', reason: '핵심 메커니즘' },
          { name: 'Art of the Glaive', points: 1, priority: 'Essential', reason: '중첩 소모 메커니즘' },
          { name: 'Chaos Theory', points: 1, priority: 'Essential', reason: '칼춤 쿨다운 감소' },
          { name: 'Essence Break', points: 1, priority: 'Recommended', reason: '버스트 윈도우 강화' },
          { name: 'Shattered Destiny', points: 1, priority: 'Optional', reason: '탈태 쿨다운 감소' }
        ],

        statPriority: '민첩성 > 치명타 (40%) = 특화 (35%) > 가속 (18%)',

        dpsProfile: {
          singleTarget: '100% (기준)',
          burstDPS: '높음 (파괴자 폭발)',
          sustainedDPS: '중간',
          aoe: '높음 (대형 풀)'
        }
      },

      mythicPlus: {
        description: '쐐기돌 최적화 빌드 - 광역 딜 강화와 생존력 향상',
        wowheadUrl: 'https://www.wowhead.com/talent-calc/demon-hunter/havoc',

        keyTalents: [
          { name: 'Reaver\'s Glaive', points: 1, priority: 'Essential', reason: '핵심 메커니즘' },
          { name: 'Art of the Glaive', points: 1, priority: 'Essential', reason: '중첩 소모' },
          { name: 'Chaos Theory', points: 1, priority: 'Essential', reason: '쿨다운 감소' },
          { name: 'Glaive Tempest', points: 1, priority: 'Recommended', reason: '광역 딜 (Essence Break 대체)' },
          { name: 'Blur', points: 1, priority: 'Optional', reason: '생존력 (쐐기 필수)' }
        ],

        statPriority: '민첩성 > 치명타 (38%) = 특화 (35%) > 가속 (25%)',

        dpsProfile: {
          singleTarget: '100%',
          burstDPS: '매우 높음',
          sustainedDPS: '중간',
          aoe: '매우 높음 (5+ 타겟)'
        }
      }
    },

    felscarred: {
      name: '지옥상흔',
      rating: { raid: 'A', mythicPlus: 'S' },

      raid: {
        description: '레이드 빌드 - 지옥상흔 버프 최대화',
        wowheadUrl: 'https://www.wowhead.com/talent-calc/demon-hunter/havoc',

        keyTalents: [
          { name: 'Fel-Scarred', points: 1, priority: 'Essential', reason: '핵심 메커니즘' },
          { name: 'Unbound Chaos', points: 1, priority: 'Essential', reason: '지옥 돌진 피해 500% 증가' },
          { name: 'Chaotic Transformation', points: 1, priority: 'Essential', reason: '탈태 시너지' },
          { name: 'Initiative', points: 1, priority: 'Recommended', reason: '지옥 돌진 충전 생성' },
          { name: 'Know Your Enemy', points: 1, priority: 'Optional', reason: '치명 증가' }
        ],

        statPriority: '민첩성 > 치명타 (45%) > 가속 (28%) > 특화 (22%)',

        dpsProfile: {
          singleTarget: '98% (-2%)',
          burstDPS: '중간',
          sustainedDPS: '높음',
          aoe: '중간 (2-4 타겟)'
        }
      },

      mythicPlus: {
        description: '쐐기돌 빌드 - 지옥상흔 + 광역 딜',
        wowheadUrl: 'https://www.wowhead.com/talent-calc/demon-hunter/havoc',

        keyTalents: [
          { name: 'Fel-Scarred', points: 1, priority: 'Essential', reason: '핵심 메커니즘' },
          { name: 'Unbound Chaos', points: 1, priority: 'Essential', reason: '지옥 돌진 강화' },
          { name: 'Chaotic Transformation', points: 1, priority: 'Essential', reason: '탈태 시너지' },
          { name: 'Initiative', points: 1, priority: 'Essential', reason: '충전 생성 (이동)' },
          { name: 'Momentum', points: 1, priority: 'Recommended', reason: '지옥 돌진 후 피해 증가' }
        ],

        statPriority: '민첩성 > 치명타 (42%) > 가속 (32%) > 특화 (20%)',

        dpsProfile: {
          singleTarget: '98%',
          burstDPS: '중간',
          sustainedDPS: '높음',
          aoe: '매우 높음 (3-8 타겟, 관통 피해)'
        }
      }
    }
  },

  // 특성 선택 의사결정 트리
  decisionTree: {
    question1: {
      q: '주로 플레이하는 콘텐츠는?',
      raid: 'question2_raid',
      mythicPlus: 'question2_mythicPlus'
    },
    question2_raid: {
      q: '보스 전투 시간은?',
      short: { answer: 'Aldrachi Reaver', reason: '3분 이하 보스 - 파괴자 폭발 효율' },
      long: { answer: 'Fel-Scarred', reason: '5분 이상 - 지옥상흔 버프 지속 효율' }
    },
    question2_mythicPlus: {
      q: '던전 이동 패턴은?',
      highMobility: { answer: 'Fel-Scarred', reason: '이동 많은 던전 - 지옥 돌진 활용' },
      largePulls: { answer: 'Aldrachi Reaver', reason: '대형 풀 - 파괴자 폭발 광역' }
    }
  }
};
