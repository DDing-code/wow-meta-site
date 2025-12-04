const getHeroContent = (SkillIcon) => ({
  sunfury: {
    name: '성난태양',
    icon: '🔥',
    tierSet: {
      '2set': '주문불꽃 구체가 35% 더 많은 피해를 입히고, 마나 폭포가 부여하는 가속이 10% 증가합니다.',
      '4set': '불사조가 비전영혼의 지속시간을 3초 증가시킵니다.'
    },
    singleTarget: {
      opener: [
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneSurge,
        skillData.touchOfTheMagi,
        skillData.arcaneBarrage
      ],
      priority: [
        { skill: skillData.arcaneMissiles, desc: '🔴 명석함 발동 시 최우선 - 주문불꽃 구체 생성' },
        { skill: skillData.arcaneBarrage, desc: '🟠 직관력 발동 시 사용 - 강력한 피해' },
        { skill: skillData.arcaneOrb, desc: '🟡 3충전 미만일 때 사용 - 광역 피해 + 비전 충전' },
        { skill: skillData.arcaneBlast, desc: '🟢 기본 스킬 - 비전 충전 증가' },
        { skill: skillData.arcaneBarrage, desc: '⚪ 마나 부족 시 - 충전 초기화 + 마나 회복' }
      ]
    },
    aoe: {
      opener: [
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneOrb,
        skillData.arcaneSurge,
        skillData.touchOfTheMagi,
        skillData.arcaneBarrage
      ],
      priority: [
        { skill: skillData.arcaneMissiles, desc: '🔴 명석함 3중첩 시 최우선' },
        { skill: skillData.arcaneOrb, desc: '🟠 3충전 미만 - 광역 피해' },
        { skill: skillData.arcaneBarrage, desc: '🟡 4충전 시 사용' },
        { skill: skillData.arcaneExplosion, desc: '⚪ 0-1충전 시 - 필러 스킬' }
      ]
    },
    mechanics: [
      {
        title: '성난태양 핵심 메커니즘',
        icon: '🔥',
        desc: '주문불꽃 구체 생성 → 찬란한 백열 발동 → 강화된 비전 탄막',
        details: [
          '1단계: 비전 미사일/폭발로 주문불꽃 구체 생성',
          '2단계: 4개 생성 시 찬란한 백열 발동',
          '3단계: 비전 탄막 피해 300% 증가 + 마나 무소모',
          '핵심: 티어 세트로 주문불꽃 구체 피해 35% 증가'
        ],
        why: '성난태양 최적 딜사이클 - 주문불꽃 구체 관리'
      }
    ]
  },
  spellslinger: {
    name: '주문술사',
    icon: '⚡',
    tierSet: {
      '2set': '주문불꽃 구체가 35% 더 많은 피해를 입히고, 마나 폭포가 부여하는 가속이 10% 증가합니다.',
      '4set': '불사조가 비전영혼의 지속시간을 3초 증가시킵니다.'
    },
    singleTarget: {
      opener: [
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneSurge,
        skillData.touchOfTheMagi,
        skillData.arcaneBarrage
      ],
      priority: [
        { skill: skillData.arcaneMissiles, desc: '🔴 명석함 발동 시 최우선' },
        { skill: skillData.arcaneBarrage, desc: '🟠 직관력 발동 시 사용' },
        { skill: skillData.arcaneOrb, desc: '🟡 3충전 미만일 때 사용' },
        { skill: skillData.arcaneBlast, desc: '🟢 기본 스킬' },
        { skill: skillData.arcaneBarrage, desc: '⚪ 마나 부족 시' }
      ]
    },
    aoe: {
      opener: [
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneOrb,
        skillData.arcaneSurge,
        skillData.touchOfTheMagi,
        skillData.arcaneBarrage
      ],
      priority: [
        { skill: skillData.arcaneMissiles, desc: '🔴 명석함 3중첩 시' },
        { skill: skillData.arcaneOrb, desc: '🟠 3충전 미만' },
        { skill: skillData.arcaneBarrage, desc: '🟡 4충전 시' },
        { skill: skillData.arcaneExplosion, desc: '⚪ 0-1충전 시' }
      ]
    },
    mechanics: [
      {
        title: '주문술사 핵심 메커니즘',
        icon: '⚡',
        desc: '명석함 관리 → 비전 충전 최적화 → 마나 효율',
        details: [
          '1단계: 명석함 프록 발동 대기',
          '2단계: 비전 충전 4개 유지',
          '3단계: 직관력 발동 시 비전 탄막',
          '핵심: 마나 관리와 명석함 프록 활용'
        ],
        why: '주문술사 최적 딜사이클 - 마나 효율 중심'
      }
    ]
  }
});
