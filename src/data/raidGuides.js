// 정확한 레이드 공략 데이터
// 최신 너프 및 전략 반영 (2024년 최신 패치)

export const raidGuides = {
  nerubarPalace: {
    name: "네루브아르 궁전",
    bosses: [
      {
        id: 'ulgrax',
        name: '울그락스 포식자',
        difficulty: {
          mythic: {
            health: '1.2B',
            enrage: '7:00'
          }
        },
        phases: [
          {
            phase: 1,
            mechanics: [
              {
                name: '잔혹한 강타',
                description: '탱커 대상 물리 피해 + 도트. 탱커 교대 필요',
                solution: '2스택에서 도발'
              },
              {
                name: '소화액 분출',
                description: '무작위 대상자 3명에게 녹색 장판 생성',
                solution: '외곽으로 빠져서 장판 버리기, 겹치지 않도록 주의'
              },
              {
                name: '육식성 무리',
                description: '작은 거미들 소환, 플레이어 추격',
                solution: '광역기로 빠르게 처리, CC기 활용'
              }
            ]
          }
        ],
        strategy: '탱커는 보스를 중앙에 고정, 공대는 산개 위치 유지. 소화액 대상자는 빠르게 외곽 이동. 거미 페이즈에 생존기 집중 사용.'
      },
      {
        id: 'bloodbound-horror',
        name: '피에 속박된 공포',
        difficulty: {
          mythic: {
            health: '980M',
            enrage: '6:30'
          }
        },
        phases: [
          {
            phase: 1,
            mechanics: [
              {
                name: '피의 결속',
                description: '2명 연결, 거리 벌어지면 피해',
                solution: '연결된 플레이어끼리 가까이 붙어있기'
              },
              {
                name: '으스스한 울부짖음',
                description: '전체 공대 공포 + 지속 피해',
                solution: '공포 해제 준비, 힐러 쿨기 로테이션'
              }
            ]
          }
        ],
        strategy: '피의 결속 대상자는 미리 지정된 위치로 이동. 공포 타이밍에 맞춰 해제 준비.'
      },
      {
        id: 'sikran',
        name: '시크란 선봉대장',
        difficulty: {
          mythic: {
            health: '1.1B',
            enrage: '7:30'
          }
        },
        phases: [
          {
            phase: 1,
            mechanics: [
              {
                name: '화염 폭발',
                description: '전방 부채꼴 화염 브레스',
                solution: '탱커만 맞도록 보스 방향 조절'
              },
              {
                name: '돌진',
                description: '무작위 대상에게 돌진 후 폭발',
                solution: '대상자는 공대에서 멀리 떨어진 위치로'
              }
            ]
          }
        ]
      },
      {
        id: 'rashanan',
        name: '라샤난',
        difficulty: {
          mythic: {
            health: '1.3B',
            enrage: '8:00'
          }
        },
        phases: [
          {
            phase: 1,
            mechanics: [
              {
                name: '산성 분출',
                description: '바닥 전체 산성 웅덩이, 안전지대 생성',
                solution: '미리 지정된 안전지대로 빠르게 이동'
              },
              {
                name: '독성 파동',
                description: '거리 비례 피해, 중첩될수록 피해 증가',
                solution: '최대한 멀리 떨어져서 맞기, 개인 생존기 사용'
              }
            ]
          }
        ]
      },
      {
        id: 'broodtwister',
        name: '혈족뒤틀이 오비낙스',
        difficulty: {
          mythic: {
            health: '1.4B',
            enrage: '8:30'
          }
        },
        phases: [
          {
            phase: 1,
            mechanics: [
              {
                name: '알 주입',
                description: '무작위 대상자에게 알 디버프, 시간 후 폭발',
                solution: '디버프 대상자는 지정 위치에서 알 까기'
              },
              {
                name: '실크 감싸기',
                description: '대상자를 고치에 가둠',
                solution: '빠르게 고치 파괴, 차단/해제 준비'
              }
            ]
          },
          {
            phase: 2,
            mechanics: [
              {
                name: '거미 변이',
                description: '플레이어를 거미로 변신시킴',
                solution: '변신한 플레이어는 특수 능력 활용하여 공략'
              }
            ]
          }
        ]
      },
      {
        id: 'nexus-princess',
        name: '연합 공주 키베자',
        difficulty: {
          mythic: {
            health: '1.5B',
            enrage: '9:00'
          }
        },
        phases: [
          {
            phase: 1,
            mechanics: [
              {
                name: '암살 시도',
                description: '최고 위협 대상 즉사기',
                solution: '탱커 무적기 또는 도발 교대'
              },
              {
                name: '황혼 학살',
                description: '플랫폼 절반 즉사 장판',
                solution: '안전 지역으로 빠르게 이동'
              }
            ]
          }
        ]
      },
      {
        id: 'court-of-ansurek',
        name: '안수렉 왕정',
        difficulty: {
          mythic: {
            health: '2.1B',
            enrage: '10:00'
          }
        },
        phases: [
          {
            phase: 1,
            mechanics: [
              {
                name: '독성 파열',
                description: '무작위 위치 독 폭발',
                solution: '빠른 이동, 예측 가능한 패턴 학습'
              },
              {
                name: '그림자 결속',
                description: '2인 1조 강제 이동',
                solution: '페어별 지정 위치 사전 약속'
              }
            ]
          }
        ]
      },
      {
        id: 'queen-ansurek',
        name: '여왕 안수렉',
        difficulty: {
          mythic: {
            health: '2.5B',
            enrage: '11:00'
          }
        },
        phases: [
          {
            phase: 1,
            mechanics: [
              {
                name: '치명적 독액',
                description: '탱커 즉사 위협 디버프',
                solution: '3스택 전 탱커 교대, 정확한 타이밍 중요'
              },
              {
                name: '거미줄 덫',
                description: '바닥 거미줄, 이동속도 90% 감소',
                solution: '이속기 활용, 거미줄 최소화 경로 이동'
              }
            ]
          },
          {
            phase: 2,
            mechanics: [
              {
                name: '여왕의 분노',
                description: '광역 피해 + 밀쳐내기',
                solution: '벽 근처 포지셔닝, 낙사 주의'
              }
            ]
          },
          {
            phase: 3,
            mechanics: [
              {
                name: '최후의 저항',
                description: '연속 전체 공격 + 즉사기',
                solution: 'DPS 체크 구간, 모든 쿨기 집중'
              }
            ]
          }
        ]
      }
    ]
  },

  // 연합왕 살다하르 & 디멘시우스 (최신 너프 반영)
  dimensiusNexus: {
    name: "공허석 회관 - 연합왕 & 디멘시우스",
    lastUpdated: "2024년 12월 너프 적용",
    bosses: [
      {
        id: 'nexus-king-saldahar',
        name: '연합왕 살다하르',
        nerfs: {
          phase1: [
            '추방(Banishment): 주기 피해 및 최종 피해 10% 감소',
            '맹세 발동(Invoke the Oath): 피해 15% 감소',
            '복수의 맹세(Vengeful Oath): 시인성 개선'
          ],
          phase2: [
            '마나로 벼려진 거신: 생명력 10% 감소',
            '연합 왕자 제브보스: 생명력 10% 감소',
            '카이보르: 생명력 10% 감소',
            '그림자수호병 수확자: 생명력 10% 감소'
          ]
        },
        phases: [
          {
            phase: 1,
            mechanics: [
              {
                name: '추방 (너프됨)',
                description: '주기적 암흑 피해 + 최종 폭발. 10% 피해 감소 적용',
                solution: '개인 생존기 로테이션, 힐러 쿨기 분배'
              },
              {
                name: '맹세 발동 (너프됨)',
                description: '무작위 대상 큰 피해. 15% 피해 감소 적용',
                solution: '대상자 집중 힐, 피해 감소 쿨기 사용'
              },
              {
                name: '복수의 맹세 (개선됨)',
                description: '새로운 애니메이션으로 시인성 향상',
                solution: '시각 효과 확인 후 빠른 대응'
              }
            ]
          },
          {
            phase: 2,
            mechanics: [
              {
                name: '쫄몹 페이즈 (너프됨)',
                description: '모든 쫄몹 생명력 10% 감소',
                solution: '우선순위: 그림자수호병 > 제브보스 > 카이보르 > 거신'
              }
            ]
          }
        ],
        strategy: '1페이즈는 너프로 인해 생존이 편해졌으나 여전히 쿨기 로테이션 중요. 2페이즈 쫄 처리 순서 엄수.'
      },
      {
        id: 'dimensius',
        name: '디멘시우스 (신화)',
        nerfs: {
          phase1: [
            '우주 방사능: 피해 10% 감소',
            '살아있는 덩어리: 생명력 9.5% 감소, 분열 피해 9.5% 감소'
          ],
          phase2: [
            '무효속박자: 생명력 10% 감소',
            '공허감시자: 생명력 10% 감소',
            '분쇄하는 중력: 피해 25% 감소 (핵심 너프)'
          ],
          phase3: [
            '우주 방사능: 피해 10% 감소',
            '분쇄하는 중력: 피해 25% 감소'
          ]
        },
        phases: [
          {
            phase: 1,
            mechanics: [
              {
                name: '우주 방사능 (너프됨)',
                description: '지속 광역 피해. 10% 감소로 힐 부담 완화',
                solution: '힐러 쿨기 효율적 분배, 개인 생존기 아끼기'
              },
              {
                name: '살아있는 덩어리 (너프됨)',
                description: '분열하는 쫄. 생명력과 피해 9.5% 감소',
                solution: '광역기 집중, CC 활용하여 컨트롤'
              }
            ]
          },
          {
            phase: 2,
            mechanics: [
              {
                name: '분쇄하는 중력 (대폭 너프)',
                description: '즉사급 피해였으나 25% 감소로 생존 가능',
                solution: '여전히 주의 필요하지만 개인 생존기로 버티기 가능'
              },
              {
                name: '쫄몹 처리 (너프됨)',
                description: '무효속박자, 공허감시자 생명력 10% 감소',
                solution: '속박자 우선 처리, 감시자는 탱커가 묶어두기'
              }
            ]
          },
          {
            phase: 3,
            mechanics: [
              {
                name: '최종 페이즈',
                description: '모든 기술 동시 사용, 하지만 너프로 난이도 하락',
                solution: 'DPS 체크 구간, 영웅심/블러드 타이밍'
              }
            ]
          }
        ],
        strategy: '분쇄하는 중력 25% 너프가 게임 체인저. 이제 신화 난이도도 일반 공대가 도전 가능한 수준.'
      }
    ]
  }
};

// 클래스별 정확한 로테이션 가이드
export const classRotations = {
  warrior: {
    arms: {
      name: '무기 전사',
      opener: [
        '돌진',
        '치명타의 일격',
        '제압',
        '거인의 일격 + 아바타',
        '치명타의 일격',
        '칼날폭풍',
        '죽음의 일격'
      ],
      priority: [
        '1. 거인의 일격 디버프 유지',
        '2. 치명타의 일격 쿨마다',
        '3. 제압 2스택 방지',
        '4. 마무리 일격 (35% 이하)',
        '5. 격돌 (분노 소모)'
      ],
      cooldowns: {
        '아바타': '버스트 구간 시작시',
        '칼날폭풍': '2타겟 이상 또는 버스트',
        '거인의 일격': '쿨마다 사용'
      }
    },
    fury: {
      name: '분노 전사',
      opener: [
        '돌진',
        '광란',
        '피의 갈증',
        '분노의 강타',
        '오딘의 격노',
        '격노',
        '광란'
      ],
      priority: [
        '1. 격노 최대한 유지 (60%+)',
        '2. 광란 쿨마다',
        '3. 피의 갈증 쿨마다',
        '4. 분노의 강타 (격노 중)',
        '5. 마무리 일격 (20% 이하)'
      ]
    },
    protection: {
      name: '방어 전사',
      priority: [
        '1. 방패 막기 유지 (물리 피해시)',
        '2. 방패 밀쳐내기 쿨마다',
        '3. 천둥벼락 디버프 유지',
        '4. 복수 (분노 소모)',
        '5. 고통 감내 (큰 피해 예상시)'
      ],
      defensives: {
        '방패의 벽': '큰 물리 피해',
        '최후의 저항': '죽음 방지',
        '주문 반사': '마법 피해'
      }
    }
  },

  paladin: {
    retribution: {
      name: '징벌 성기사',
      opener: [
        '잿빛 경종',
        '정의의 칼날',
        '심판',
        '격노의 날개 + 최후의 심판',
        '천상의 폭풍 / 기사단의 선고',
        '정의의 칼날',
        '천상의 폭풍 / 기사단의 선고'
      ],
      priority: [
        '1. 신성한 힘 5개일 때 소모기 사용',
        '2. 잿빛 경종 쿨마다',
        '3. 정의의 칼날 우선순위',
        '4. 심판 디버프 유지',
        '5. 성전사의 일격 (2타겟+)'
      ],
      burst: '격노의 날개 + 최후의 심판 동시 사용'
    },
    holy: {
      name: '신성 성기사',
      priority: [
        '1. 신성 충격 쿨마다',
        '2. 여명의 빛 (광역 힐)',
        '3. 빛의 섬광 (응급 힐)',
        '4. 성스러운 빛 (효율적 힐)',
        '5. 빛의 봉화 탱커 유지'
      ]
    },
    protection: {
      name: '보호 성기사',
      priority: [
        '1. 정의의 방패 (3타겟 맞추기)',
        '2. 심판 디버프 유지',
        '3. 정의의 망치 / 축복받은 망치',
        '4. 신성화 항시 유지',
        '5. 정의의 방패 (신성한 힘 소모)'
      ]
    }
  },

  deathknight: {
    unholy: {
      name: '부정 죽음의 기사',
      opener: [
        '죽은 자의 군대 (전투 2초 전)',
        '고름 일격 x2',
        '부정한 존재',
        '어둠 변신',
        '아포칼립스',
        '부정한 습격',
        '죽음의 고리'
      ],
      priority: [
        '1. 상처 4-6개 유지',
        '2. 죽음과 부패 유지',
        '3. 어둠 변신 쿨마다',
        '4. 아포칼립스 (4+ 상처)',
        '5. 죽음의 고리 (룬 파워 소모)'
      ]
    },
    frost: {
      name: '냉기 죽음의 기사',
      priority: [
        '1. 냉기 폭발 (서리 열병 유지)',
        '2. 절멸 (살상 기계 프록시)',
        '3. 룬 활성화시 절멸',
        '4. 서리 충격 (룬 파워 소모)',
        '5. 필멸의 한기 버스트'
      ]
    },
    blood: {
      name: '혈기 죽음의 기사',
      priority: [
        '1. 뼈 보호막 5+ 유지',
        '2. 죽음의 일격 (치유 필요시)',
        '3. 골수 분쇄 (뼈 보호막)',
        '4. 피의 소용돌이',
        '5. 심장 강타 (룬 파워 생성)'
      ]
    }
  }
};

// 신화+ 던전 공략
export const mythicPlusGuides = {
  affixes: {
    fortified: {
      name: '강화',
      description: '우두머리가 아닌 적의 생명력 30% 증가, 피해 20% 증가',
      strategy: '쫄몹 구간에 쿨기 아끼지 말기, CC 적극 활용'
    },
    tyrannical: {
      name: '폭군',
      description: '우두머리 생명력 40% 증가, 피해 15% 증가',
      strategy: '보스전에 모든 쿨기 준비, 생존기 로테이션 중요'
    },
    afflicted: {
      name: '고통받는',
      description: '고통받는 영혼 주기적 소환, 치유/해제 필요',
      strategy: '힐러/해제 가능 클래스가 즉시 대응, 위치 파악 중요'
    },
    incorporeal: {
      name: '무형',
      description: '무형의 존재 소환, CC 필요',
      strategy: '하드 CC로 즉시 제어, 스턴/변이/공포 로테이션'
    },
    entangling: {
      name: '휘감는',
      description: '덩굴 속박, 피해 입으면 해제',
      strategy: '빠른 타겟 전환으로 해제, 이동기 아껴두기'
    },
    storming: {
      name: '폭풍',
      description: '회전하는 폭풍 생성',
      strategy: '근접 딜러 포지션 주의, 예측 가능한 패턴 학습'
    }
  },
  routes: {
    tips: [
      '풀링 최적화로 시간 단축',
      '혈욕/영웅심 타이밍 사전 계획',
      '불리한 접두사 주간에는 안전한 루트 선택',
      'MDT (Mythic Dungeon Tools) 애드온으로 루트 계획'
    ]
  }
};

export default { raidGuides, classRotations, mythicPlusGuides };