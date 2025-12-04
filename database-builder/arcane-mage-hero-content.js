// 비전 마법사 getHeroContent 함수 - 임시 파일
// ArcaneMageGuide.js의 Line 280-823을 이 내용으로 교체

const getHeroContent = (SkillIcon) => ({
  sunfury: {
    name: '성난태양',
    icon: '🔥',
    tierSet: {
      '2set': '2세트: 비전 충전물 소모 시 10% 확률로 비전화염 구슬 1개 생성. 비전화염 구슬이 주문 공격력을 1% 증가시킵니다.',
      '4set': '4세트: 비전화염 구슬 3개 보유 시 다음 비전 탄막 피해가 300% 증가하고 비전 충전물 4개를 생성합니다.'
    },
    singleTarget: {
      opener: [
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneBlast,  // 4 충전물
        skillData.touchOfTheMagi,  // 비전의 여파
        skillData.arcaneSurge,  // 비전 쇄도
        skillData.arcaneBlast,  // 충전물 유지
        skillData.arcaneBarrage,  // 영광스러운 광채 소모
        skillData.presenceOfMind,  // 냉정
        skillData.arcaneBlast,  // 즉시 시전
        skillData.arcaneBlast   // 즉시 시전
      ],
      priority: [
        {
          skill: skillData.touchOfTheMagi,
          desc: '비전의 여파 (최우선 쿨다운)',
          conditions: [
            '재사용 대기시간마다 즉시 (1.5분)',
            '비전 충전물 4개 생성',
            '12초 동안 피해 20% 축적 후 폭발'
          ],
          why: '비전 마법사 핵심 버스트 윈도우 - 모든 쿨기와 함께 사용'
        },
        {
          skill: skillData.arcaneSurge,
          desc: '비전 쇄도 버스트',
          conditions: [
            '재사용 대기시간마다 (1.5분)',
            '비전의 여파와 함께 사용',
            '15초 동안 주문력 35% + 마나 재생 425% 증가'
          ],
          why: '비전의 여파 윈도우에서 최대 딜 - 마나 재생으로 비전 작렬 연타'
        },
        {
          skill: skillData.arcaneBarrage,
          desc: '영광스러운 광채 소모',
          conditions: [
            '영광스러운 광채 버프 활성 시',
            '비전화염 구슬 3개 달성 시 발동',
            '비전 탄막 피해 300% 증가 + 비전 충전물 4개 생성'
          ],
          why: '성난태양 핵심 메커니즘 - 폭발적 피해 + 충전물 즉시 회복'
        },
        {
          skill: skillData.arcaneBlast,
          desc: '비전 충전물 4중첩 유지',
          conditions: [
            '비전 충전물 4중첩 미만',
            '충전물당 피해 60% 증가',
            '최대 4중첩까지 쌓기'
          ],
          why: '비전 마법사 기본 메커니즘 - 충전물 4중첩 = 최대 DPS'
        },
        {
          skill: skillData.arcaneMissiles,
          desc: '번뜩임 발동 시 즉시 사용',
          conditions: [
            '번뜩임 버프 활성 (8% 발동 확률)',
            '마나 소모 없음',
            '2.5초 동안 5발 발사'
          ],
          why: '무료 피해 - 번뜩임 발동 즉시 소모하여 추가 발동 기회 확보'
        },
        {
          skill: skillData.presenceOfMind,
          desc: '냉정 (즉시 시전)',
          conditions: [
            '비전의 여파 + 비전 쇄도 버스트 중',
            'OR 이동 중 딜 유지',
            '다음 2회 비전 작렬 즉시 시전'
          ],
          why: '버스트 윈도우 딜 극대화 + 이동 중 딜 손실 방지'
        },
        {
          skill: skillData.arcaneOrb,
          desc: '비전 보주 (충전물 생성)',
          conditions: [
            '재사용 대기시간마다 (20초)',
            '비전 충전물 +1',
            '경로상 적 모두 타격'
          ],
          why: '충전물 생성 + 추가 피해 - 쿨다운마다 사용'
        },
        {
          skill: skillData.arcaneBarrage,
          desc: '마나 관리 (70% 이하 시)',
          conditions: [
            '마나 70% 이하',
            '비전 충전물 4중첩',
            '비전 탄막으로 충전물 소모 후 마나 회복 대기'
          ],
          why: '비전 작렬은 마나 소모가 크므로 적절한 타이밍에 리셋 필요'
        },
        {
          skill: skillData.evocation,
          desc: '환기 (마나 회복)',
          conditions: [
            '마나 30% 이하',
            '비전 쇄도 재사용 대기 중',
            '3초 채널링으로 마나 대폭 회복'
          ],
          why: '마나 고갈 전 환기로 지속적인 딜 유지 - 비전 쇄도 쿨 피하기'
        },
        {
          skill: skillData.arcaneBlast,
          desc: '필러 스킬',
          conditions: [
            '비전 충전물 4중첩 유지',
            '마나 70% 이상',
            '다른 스킬 재사용 대기 중'
          ],
          why: '비전 작렬로 지속딜 - 4중첩 유지가 핵심'
        }
      ]
    },
    aoe: {
      opener: [
        skillData.arcaneExplosion,
        skillData.arcaneExplosion,
        skillData.touchOfTheMagi,
        skillData.arcaneSurge,
        skillData.arcaneBarrage,  // 영광스러운 광채
        skillData.arcaneExplosion,
        skillData.arcaneExplosion
      ],
      priority: [
        {
          skill: skillData.touchOfTheMagi,
          desc: '비전의 여파',
          conditions: [
            '재사용 대기시간마다 (1.5분)',
            '주 대상 + 주변 적 모두 피해 축적'
          ],
          why: '광역 버스트 윈도우 시작 - 모든 쿨기와 함께 사용'
        },
        {
          skill: skillData.arcaneSurge,
          desc: '비전 쇄도',
          conditions: [
            '재사용 대기시간마다 (1.5분)',
            '비전의 여파와 함께 사용',
            '광역 딜 35% 증가'
          ],
          why: '광역 버스트 극대화 - 마나 재생으로 신비한 폭발 연타'
        },
        {
          skill: skillData.arcaneBarrage,
          desc: '영광스러운 광채 (광역)',
          conditions: [
            '영광스러운 광채 버프 활성',
            '비전화염 구슬 3개 달성',
            '주 대상 + 주변 적 광역 피해'
          ],
          why: '광역 폭발 피해 + 비전 충전물 회복'
        },
        {
          skill: skillData.arcaneExplosion,
          desc: '신비한 폭발 (주력 광역)',
          conditions: [
            '10미터 반경 광역 피해',
            '번뜩임 발동 시 마나 소모 없음',
            '적중 시 비전 충전물 +1'
          ],
          why: '비전 마법사 광역 주력 스킬 - 지속 사용'
        },
        {
          skill: skillData.arcaneMissiles,
          desc: '번뜩임 발동 (광역 중)',
          conditions: [
            '번뜩임 버프 활성',
            '마나 소모 없음'
          ],
          why: '무료 단일 타겟 피해 - 번뜩임 소모'
        },
        {
          skill: skillData.netherTempest,
          desc: '황천의 폭풍우 (지속 피해)',
          conditions: [
            '대상 + 10미터 내 적들',
            '12초 지속 피해',
            '비전 충전물당 피해 60% 증가'
          ],
          why: '광역 지속 피해 - 비전 충전물 4중첩에서 사용'
        }
      ]
    },
    mechanics: [
      {
        title: '비전 충전물 관리',
        icon: '⚡',
        desc: '비전 마법사 핵심 메커니즘 - 4중첩 유지가 최우선',
        details: [
          '비전 작렬 시전 시 충전물 +1 (최대 4중첩)',
          '충전물당 비전 작렬 피해 60% 증가',
          '4중첩 = 240% 피해 증가 (3.4배)',
          '비전 탄막 시전 시 모든 충전물 소모',
          '충전물 유지 시간: 10초 (전투 이탈 시 소멸)'
        ],
        why: '4중첩 유지율 95%+ 목표 - 비전 마법사 DPS의 핵심'
      },
      {
        title: '비전의 여파 윈도우',
        icon: '🎯',
        desc: '12초 버스트 윈도우 - 모든 쿨기와 시너지',
        details: [
          '비전의 여파: 12초 동안 입힌 피해의 20% 축적 후 폭발',
          '최적 사이클: 비전의 여파 → 비전 쇄도 → 비전 작렬 연타',
          '비전 쇄도: 15초 동안 주문력 35% + 마나 재생 425%',
          '냉정: 비전 작렬 2회 즉시 시전으로 윈도우 최대 활용',
          '영광스러운 광채: 윈도우 내 비전 탄막 300% 피해'
        ],
        why: '비전 마법사 버스트의 핵심 - 1.5분마다 폭발적 딜'
      },
      {
        title: '성난태양 핵심: 비전화염 구슬',
        icon: '🔥',
        desc: '비전화염 구슬 3개 → 영광스러운 광채 → 폭발적 비전 탄막',
        details: [
          '티어 2세트: 비전 충전물 소모 시 10% 확률로 비전화염 구슬 생성',
          '티어 4세트: 비전화염 구슬 3개 시 영광스러운 광채 발동',
          '영광스러운 광채: 다음 비전 탄막 피해 300% + 비전 충전물 4개 생성',
          '최적 사이클: 4충전물 유지 → 비전화염 구슬 3개 → 비전 탄막',
          '핵심: 영광스러운 광채로 충전물 즉시 4개 회복 = 딜 손실 없음'
        ],
        why: '성난태양 최대 활용 - 비전 탄막이 주력 딜 스킬로 변환'
      },
      {
        title: '마나 관리 전략',
        icon: '💎',
        desc: '비전 작렬 마나 소모 vs 환기 타이밍',
        details: [
          '비전 작렬: 충전물당 마나 소모 100% 증가 (4충전물 = 5배 마나)',
          '마나 70% 이하: 비전 탄막으로 리셋 후 마나 자연 회복',
          '마나 30% 이하: 환기 사용 (3초 채널링)',
          '비전 쇄도 중: 마나 재생 425% → 환기 불필요',
          '마나석: 즉시 25% 회복 + 12초간 주문력 5% (3회 충전)'
        ],
        why: '마나 고갈 방지 - 지속 딜 유지를 위한 핵심 관리'
      }
    ]
  },
  spellslinger: {
    name: '주문술사',
    icon: '✨',
    tierSet: {
      '2set': '2세트: 비전 작렬 또는 비전 탄막 6회 시전마다 비전화염 구슬 1개 생성. 주문 공격력 1% 증가.',
      '4set': '4세트: 비전화염 구슬 3개 보유 시 비전 탄막 피해 20% 증가 및 비전 충전물 4개 생성.'
    },
    singleTarget: {
      opener: [
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneBlast,
        skillData.arcaneBlast,  // 4 충전물
        skillData.touchOfTheMagi,
        skillData.arcaneSurge,
        skillData.arcaneBarrage,  // 비전화염 구슬 소모
        skillData.presenceOfMind,
        skillData.arcaneBlast,
        skillData.arcaneBlast
      ],
      priority: [
        {
          skill: skillData.touchOfTheMagi,
          desc: '비전의 여파',
          conditions: [
            '재사용 대기시간마다 (1.5분)',
            '버스트 윈도우 시작'
          ],
          why: '주문술사도 비전의 여파 중심 운영'
        },
        {
          skill: skillData.arcaneSurge,
          desc: '비전 쇄도',
          conditions: [
            '비전의 여파와 함께',
            '15초 버스트'
          ],
          why: '주문력 35% + 마나 재생 425%'
        },
        {
          skill: skillData.arcaneBarrage,
          desc: '비전화염 구슬 3개 소모',
          conditions: [
            '비전화염 구슬 3개',
            '비전 탄막 피해 20% 증가',
            '비전 충전물 4개 생성'
          ],
          why: '주문술사 핵심 메커니즘 - 성난태양보다 낮은 피해량이지만 안정적'
        },
        {
          skill: skillData.arcaneBlast,
          desc: '비전 충전물 4중첩',
          conditions: [
            '충전물 4중첩 미만',
            '비전 작렬 6회마다 비전화염 구슬 생성'
          ],
          why: '주력 딜 스킬 + 비전화염 구슬 생성'
        },
        {
          skill: skillData.arcaneMissiles,
          desc: '번뜩임',
          conditions: [
            '번뜩임 발동',
            '마나 소모 없음'
          ],
          why: '무료 피해'
        },
        {
          skill: skillData.presenceOfMind,
          desc: '냉정',
          conditions: [
            '버스트 중',
            '즉시 시전 2회'
          ],
          why: '버스트 극대화'
        },
        {
          skill: skillData.arcaneOrb,
          desc: '비전 보주',
          conditions: [
            '재사용 대기시간마다',
            '충전물 +1'
          ],
          why: '충전물 생성'
        },
        {
          skill: skillData.arcaneBarrage,
          desc: '마나 관리',
          conditions: [
            '마나 70% 이하',
            '충전물 리셋'
          ],
          why: '마나 회복 대기'
        },
        {
          skill: skillData.evocation,
          desc: '환기',
          conditions: [
            '마나 30% 이하',
            '비전 쇄도 쿨다운 중'
          ],
          why: '마나 회복'
        },
        {
          skill: skillData.arcaneBlast,
          desc: '필러',
          conditions: [
            '4중첩 유지',
            '마나 70% 이상'
          ],
          why: '지속 딜'
        }
      ]
    },
    aoe: {
      opener: [
        skillData.arcaneExplosion,
        skillData.arcaneExplosion,
        skillData.touchOfTheMagi,
        skillData.arcaneSurge,
        skillData.arcaneBarrage,
        skillData.arcaneExplosion
      ],
      priority: [
        {
          skill: skillData.touchOfTheMagi,
          desc: '비전의 여파',
          conditions: [
            '재사용 대기시간마다'
          ],
          why: '광역 버스트'
        },
        {
          skill: skillData.arcaneSurge,
          desc: '비전 쇄도',
          conditions: [
            '비전의 여파와 함께'
          ],
          why: '광역 딜 증가'
        },
        {
          skill: skillData.arcaneBarrage,
          desc: '비전화염 구슬 소모',
          conditions: [
            '비전화염 구슬 3개',
            '광역 피해'
          ],
          why: '광역 폭발 피해'
        },
        {
          skill: skillData.arcaneExplosion,
          desc: '신비한 폭발',
          conditions: [
            '10미터 광역',
            '번뜩임 시 무료'
          ],
          why: '주력 광역'
        },
        {
          skill: skillData.arcaneMissiles,
          desc: '번뜩임',
          conditions: [
            '번뜩임 발동'
          ],
          why: '무료 피해'
        },
        {
          skill: skillData.netherTempest,
          desc: '황천의 폭풍우',
          conditions: [
            '12초 지속 피해'
          ],
          why: '광역 DoT'
        }
      ]
    },
    mechanics: [
      {
        title: '비전 충전물 관리',
        icon: '⚡',
        desc: '주문술사도 4중첩 유지가 핵심',
        details: [
          '비전 작렬로 충전물 쌓기',
          '4중첩 유지율 95%+',
          '비전 탄막으로 리셋'
        ],
        why: '기본 메커니즘 동일'
      },
      {
        title: '비전의 여파 윈도우',
        icon: '🎯',
        desc: '12초 버스트 윈도우',
        details: [
          '비전의 여파 → 비전 쇄도',
          '모든 쿨기 동시 사용',
          '냉정으로 즉시 시전'
        ],
        why: '1.5분마다 버스트'
      },
      {
        title: '주문술사 핵심: 안정적 비전화염 구슬',
        icon: '✨',
        desc: '비전 작렬/비전 탄막 6회마다 비전화염 구슬 생성',
        details: [
          '성난태양: 10% 확률 (RNG) vs 주문술사: 6회 카운트 (확정)',
          '비전화염 구슬 3개 → 비전 탄막 피해 20% 증가',
          '성난태양보다 낮은 피해량 (300% vs 20%)',
          '하지만 예측 가능하고 안정적인 플레이'
        ],
        why: '주문술사 = 안정성, 성난태양 = 폭발력'
      },
      {
        title: '마나 관리',
        icon: '💎',
        desc: '비전 작렬 마나 소모 관리',
        details: [
          '마나 70% 이하: 비전 탄막 리셋',
          '마나 30% 이하: 환기',
          '비전 쇄도 중: 환기 불필요'
        ],
        why: '지속 딜 유지'
      }
    ]
  }
});
