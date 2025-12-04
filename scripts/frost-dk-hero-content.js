/**
 * 냉기 죽음의 기사 getHeroContent 데이터
 * 죽음인도자 (Deathbringer) & 종말의 기수 (Rider of the Apocalypse)
 */

module.exports = `
// 영웅특성별 콘텐츠 생성 함수 (SkillIcon 컴포넌트 사용을 위해 함수로 변경)
const getHeroContent = (SkillIcon) => ({
  deathbringer: {
    name: '죽음인도자',
    icon: '⚔️',
    tierSet: {
      '2set': '냉기 강타 또는 절멸 사용 시 10% 확률로 룬 강화 - 다음 룬 마력 소모 스킬의 피해가 25% 증가하고 룬 마력 소모량이 10만큼 감소합니다.',
      '4set': '룬 강화 효과 발동 시 냉기의 순환 중첩을 1개 얻습니다. 냉기의 순환이 10중첩에 도달하면 모든 중첩이 소모되어 12초 동안 룬 마력 생성량이 20% 증가합니다.'
    },
    singleTarget: {
      opener: [
        skillData.pillarofFrost,        // 냉기의 기둥 (주요 쿨다운)
        skillData.empowerRuneWeapon,    // 룬 무기 강화
        skillData.obliterate,            // 절멸 (룬 소모)
        skillData.obliterate,            // 절멸
        skillData.froststr,              // 냉기 강타 (룬 마력 소모)
        skillData.froststr,              // 냉기 강타
        skillData.howlingblast,          // 울부짖는 한파
        skillData.obliterate             // 절멸
      ],
      priority: [
        {
          skill: skillData.remorselessWinter,
          desc: '매정한 겨울 (쿨다운)',
          conditions: [
            '쿨다운 완료',
            '룬 마력 40+ 확보'
          ],
          priority: 0,
          why: '주요 광역 쿨다운 - 룬 마력이(가) 충분할 때 사용'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서리 열병)',
          conditions: [
            '서리 열병 없음',
            '서리 열병 만료 임박'
          ],
          priority: 1,
          why: '서리 열병 유지 필수 - 냉기 강타 피해 증폭'
        },
        {
          skill: skillData.pillarofFrost,
          desc: '냉기의 기둥 (버스트)',
          conditions: [
            '쿨다운 완료',
            '룬 2개 이상'
          ],
          priority: 2,
          why: '주요 쿨다운 - 룬 마력과 함께 버스트 윈도우 시작'
        },
        {
          skill: skillData.empowerRuneWeapon,
          desc: '룬 무기 강화 (룬 생성)',
          conditions: [
            '쿨다운 완료',
            '룬 3개 미만'
          ],
          priority: 3,
          why: '룬 마력 25 생성 + 모든 룬 즉시 재충전'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서릿발 발동)',
          conditions: [
            '서릿발 버프 있음'
          ],
          priority: 4,
          why: '서릿발 발동 시 룬 소모 없이 사용 가능'
        },
        {
          skill: skillData.obliterate,
          desc: '절멸 (살육 기계 유지)',
          conditions: [
            '살육 기계 중첩 5 미만',
            '룬 2개 이상'
          ],
          priority: 5,
          why: '살육 기계 중첩 유지 - 냉기 강타 피해 증가'
        },
        {
          skill: skillData.froststr,
          desc: '냉기 강타 (룬 마력 소모)',
          conditions: [
            '룬 마력 25 이상',
            '살육 기계 5중첩'
          ],
          priority: 6,
          why: '룬 마력 주요 소모처 - 살육 기계 최대 중첩 시 강력'
        },
        {
          skill: skillData.obliterate,
          desc: '절멸 (룬 소모)',
          conditions: [
            '룬 4개 이상'
          ],
          priority: 7,
          why: '룬 낭비 방지 - 재충전 시간 활용'
        },
        {
          skill: skillData.froststr,
          desc: '냉기 강타 (필러)',
          conditions: [
            '룬 마력 40 이상'
          ],
          priority: 8,
          why: '룬 마력 넘침 방지'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (필러)',
          conditions: [
            '다른 스킬 대기 중'
          ],
          priority: 9,
          why: '룬 마력 생성 + 서리 열병 유지'
        }
      ]
    },
    aoe: {
      opener: [
        skillData.remorselessWinter,    // 매정한 겨울
        skillData.pillarofFrost,        // 냉기의 기둥
        skillData.empowerRuneWeapon,    // 룬 무기 강화
        skillData.howlingblast,          // 울부짖는 한파
        skillData.frostscythe,           // 냉기 낫 (광역)
        skillData.frostscythe,           // 냉기 낫
        skillData.obliterate,            // 절멸
        skillData.froststr               // 냉기 강타
      ],
      priority: [
        {
          skill: skillData.remorselessWinter,
          desc: '매정한 겨울 (광역 최우선)',
          conditions: [
            '3+ 적',
            '쿨다운 완료'
          ],
          priority: 0,
          why: '광역 주요 쿨다운 - 지속 피해 + 슬로우'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서리 열병)',
          conditions: [
            '3+ 적',
            '서리 열병 없음'
          ],
          priority: 1,
          why: '광역 서리 열병 전파 필수'
        },
        {
          skill: skillData.frostscythe,
          desc: '냉기 낫 (광역 주력)',
          conditions: [
            '3+ 적',
            '살육 기계 5중첩'
          ],
          priority: 2,
          why: '광역 룬 소모 주력 스킬'
        },
        {
          skill: skillData.glacialadvance,
          desc: '빙하 진군 (룬 마력 광역)',
          conditions: [
            '3+ 적',
            '룬 마력 30 이상'
          ],
          priority: 3,
          why: '광역 룬 마력 소모 + 칼날얼음 중첩'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서릿발)',
          conditions: [
            '서릿발 발동',
            '3+ 적'
          ],
          priority: 4,
          why: '서릿발 발동 시 룬 무료 사용'
        },
        {
          skill: skillData.obliterate,
          desc: '절멸 (살육 기계)',
          conditions: [
            '3+ 적',
            '살육 기계 5 미만'
          ],
          priority: 5,
          why: '광역에서도 살육 기계 유지'
        }
      ]
    },
    mechanics: [
      {
        title: '살육 기계',
        icon: '⚙️',
        desc: '절멸 사용 시 중첩 생성 - 냉기 강타 피해 증가',
        details: [
          '절멸 1회 사용 시 살육 기계 1중첩 생성',
          '최대 5중첩 - 중첩당 냉기 강타 피해 10% 증가',
          '5중첩 달성 후 냉기 강타로 소모'
        ],
        why: '죽음인도자 핵심 - 절멸 → 냉기 강타 사이클'
      },
      {
        title: '서릿발 (Rime)',
        icon: '❄️',
        desc: '절멸 사용 시 45% 확률로 발동 - 무료 울부짖는 한파',
        details: [
          '발동: 절멸 사용 시 45% 확률',
          '효과: 다음 울부짖는 한파 룬 소모 없음',
          '지속시간: 15초 - 발동 시 즉시 사용 권장'
        ]
      },
      {
        title: '냉기의 순환 (T32 4세트)',
        icon: '🔄',
        desc: '룬 강화 발동 시 중첩 획득 - 10중첩 시 룬 마력 생성 20% 증가',
        details: [
          '룬 강화(T32 2세트): 10% 확률 발동',
          '냉기의 순환: 룬 강화 발동 시 1중첩 획득',
          '10중첩 도달: 12초 동안 룬 마력 생성 20% 증가'
        ]
      }
    ]
  },
  rideroftheapocalypse: {
    name: '종말의 기수',
    icon: '🏇',
    tierSet: {
      '2set': '냉기 강타 또는 절멸 사용 시 10% 확률로 룬 강화 - 다음 룬 마력 소모 스킬의 피해가 25% 증가하고 룬 마력 소모량이 10만큼 감소합니다.',
      '4set': '룬 강화 효과 발동 시 냉기의 순환 중첩을 1개 얻습니다. 냉기의 순환이 10중첩에 도달하면 모든 중첩이 소모되어 12초 동안 룬 마력 생성량이 20% 증가합니다.'
    },
    singleTarget: {
      opener: [
        skillData.pillarofFrost,        // 냉기의 기둥
        skillData.apocalypse,            // 종말 (종말의 기수 전용)
        skillData.obliterate,            // 절멸
        skillData.obliterate,            // 절멸
        skillData.froststr,              // 냉기 강타
        skillData.froststr,              // 냉기 강타
        skillData.soulReaper,            // 영혼 수확자
        skillData.obliterate             // 절멸
      ],
      priority: [
        {
          skill: skillData.apocalypse,
          desc: '종말 (종말의 기수 쿨다운)',
          conditions: [
            '쿨다운 완료',
            '서리 열병 활성'
          ],
          priority: 0,
          why: '종말의 기수 핵심 - 네 기수 소환 + 막대한 피해'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서리 열병)',
          conditions: [
            '서리 열병 없음'
          ],
          priority: 1,
          why: '서리 열병 유지 - 종말 사용 전제조건'
        },
        {
          skill: skillData.pillarofFrost,
          desc: '냉기의 기둥 (버스트)',
          conditions: [
            '쿨다운 완료'
          ],
          priority: 2,
          why: '주요 쿨다운'
        },
        {
          skill: skillData.soulReaper,
          desc: '영혼 수확자 (처형기)',
          conditions: [
            '대상 생명력 35% 미만',
            '쿨다운 완료'
          ],
          priority: 3,
          why: '저체력 대상 처형 - 5초 후 폭발 피해'
        },
        {
          skill: skillData.obliterate,
          desc: '절멸 (살육 기계)',
          conditions: [
            '살육 기계 5 미만'
          ],
          priority: 4,
          why: '살육 기계 중첩 쌓기'
        },
        {
          skill: skillData.froststr,
          desc: '냉기 강타 (주력)',
          conditions: [
            '살육 기계 5중첩',
            '룬 마력 25 이상'
          ],
          priority: 5,
          why: '룬 마력 소모 주력'
        },
        {
          skill: skillData.howlingblast,
          desc: '울부짖는 한파 (서릿발)',
          conditions: [
            '서릿발 발동'
          ],
          priority: 6,
          why: '서릿발 발동 시 무료 사용'
        },
        {
          skill: skillData.obliterate,
          desc: '절멸 (룬 소모)',
          conditions: [
            '룬 4개 이상'
          ],
          priority: 7,
          why: '룬 낭비 방지'
        },
        {
          skill: skillData.froststr,
          desc: '냉기 강타 (필러)',
          conditions: [
            '룬 마력 40 이상'
          ],
          priority: 8,
          why: '룬 마력 소모'
        }
      ]
    },
    aoe: {
      opener: [
        skillData.remorselessWinter,    // 매정한 겨울
        skillData.apocalypse,            // 종말
        skillData.pillarofFrost,        // 냉기의 기둥
        skillData.frostscythe,           // 냉기 낫
        skillData.frostscythe,           // 냉기 낫
        skillData.glacialadvance,        // 빙하 진군
        skillData.froststr               // 냉기 강타
      ],
      priority: [
        {
          skill: skillData.apocalypse,
          desc: '종말 (광역)',
          conditions: [
            '3+ 적',
            '쿨다운 완료'
          ],
          priority: 0,
          why: '종말의 기수 핵심 - 네 기수 광역 피해'
        },
        {
          skill: skillData.remorselessWinter,
          desc: '매정한 겨울 (광역)',
          conditions: [
            '3+ 적'
          ],
          priority: 1,
          why: '광역 주요 쿨다운'
        },
        {
          skill: skillData.frostscythe,
          desc: '냉기 낫 (광역 주력)',
          conditions: [
            '3+ 적',
            '살육 기계 5중첩'
          ],
          priority: 2,
          why: '광역 룬 소모'
        },
        {
          skill: skillData.glacialadvance,
          desc: '빙하 진군 (광역)',
          conditions: [
            '3+ 적',
            '룬 마력 30 이상'
          ],
          priority: 3,
          why: '광역 룬 마력 소모'
        }
      ]
    },
    mechanics: [
      {
        title: '종말 (Apocalypse)',
        icon: '💀',
        desc: '네 기수 소환 - 대상에게 폭발적 피해 + 네 기수의 지속 피해',
        details: [
          '재사용 대기시간: 90초 (주요 쿨다운)',
          '효과: 대상의 서리 열병 1초당 1중첩 터뜨려 즉시 피해',
          '네 기수 소환: 20초간 전투 지원 + 추가 피해'
        ],
        why: '종말의 기수 핵심 - 서리 열병 활성 상태에서 사용 필수'
      },
      {
        title: '네 기수',
        icon: '🐴',
        desc: '종말 사용 시 소환 - 전쟁/기근/죽음/역병 기수가 20초간 전투 지원',
        details: [
          '전쟁의 기수: 물리 피해',
          '기근의 기수: 생명력 흡수',
          '죽음의 기수: 암흑 피해',
          '역병의 기수: 서리 열병 확산'
        ]
      },
      {
        title: '영혼 수확자',
        icon: '💀',
        desc: '저체력(35% 미만) 대상 처형 - 5초 후 폭발 피해',
        details: [
          '사용 조건: 대상 생명력 35% 미만',
          '즉시 피해 + 5초 후 폭발 피해 (대상 최대 생명력의 %)',
          '재사용 대기시간: 6초'
        ]
      }
    ]
  }
});
`;
