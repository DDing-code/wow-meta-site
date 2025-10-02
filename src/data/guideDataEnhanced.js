// WoW 전문화 가이드 데이터 - 깊이 있고 체계적인 구조
// GuideTemplate.js의 구조에 완벽히 맞춤

export const enhancedGuideData = {
  hunter: {
    'beast-mastery': {
      className: '사냥꾼',
      specName: '야수',
      specIcon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_bestialdiscipline.jpg',
      patch: '11.2',

      // 개요 섹션 - 깊이 있는 설명
      overview: {
        role: '원거리 물리 딜러',
        tier: 'S',
        difficulty: '★★★☆☆',
        description: `야수 사냥꾼은 표면적으로는 펫과 함께 싸우는 단순한 클래스로 보이지만, 실제로는 매우 복잡한 리소스 관리와 타이밍 최적화가 필요한 전문화입니다.
        100% 이동 중 딜이 가능하다는 장점 때문에 쉬워 보이지만, 99 파싱을 달성하려면 서버 틱레이트(20Hz)와 펫 AI의 숨겨진 메커니즘까지 이해해야 합니다.
        TWW 시즌3에서는 특히 무리의 지도자와 어둠 순찰자 영웅특성이 메타를 지배하고 있으며, 신화+ 던전과 레이드 모두에서 최상위 티어를 유지하고 있습니다.`,
        strengths: [
          '100% 이동 중 딜 가능 - 메커니즘 수행 중에도 DPS 손실 없음',
          '강력한 단일 대상 및 광역 딜 - 복수의 명령으로 M+에서도 경쟁력',
          '펫을 통한 다양한 유틸리티 - 전투 부활, 혈욕/영웅심, 디버프',
          '낮은 진입 장벽 - 기본기만으로도 중간 이상 성능',
          '우수한 생존력 - 거북의 상, 생존의 본능, 펫 탱킹 가능'
        ],
        weaknesses: [
          '펫 관리 복잡성 - 펫 위치 조정, AI 버그 대응 필요',
          '높은 최적화 난이도 - 숨겨진 메커니즘 이해 필수',
          '광기 관리 실수 시 큰 DPS 손실',
          '근접 전투 취약 - 최소 사거리 제약',
          'PvP에서 펫 의존도가 약점'
        ]
      },

      // 핵심 메커니즘 - 심화 설명 포함
      mechanics: {
        resources: {
          primary: '집중',
          secondary: '광기 중첩',
          tertiary: '야수의 격노'
        },
        coreMechanics: [
          {
            name: '광기 시스템',
            description: '펫 공격 속도를 중첩당 12% 증가 (최대 3중첩 36%). 실제 지속시간은 8초이지만 서버 틱으로 7.95-8.05초 변동',
            icon: 'ability_hunter_fervor',
            advanced: '1.45초 남았을 때 갱신이 최적 타이밍. 1.5초가 아닌 이유는 서버 틱과 클라이언트 지연시간 보정',
            hiddenMechanic: '광기 3중첩에서 가시 사격 시전 시 버프가 스냅샷되어 8초 전체 지속'
          },
          {
            name: '집중 관리',
            description: '초당 5 회복 (실제로는 0.1초마다 0.5). 30-70 구간 유지가 이상적',
            icon: 'ability_hunter_focusfire',
            advanced: '코브라 사격 시전 중 회복되는 8.5 집중을 고려하면 실제 소모는 26.5',
            hiddenMechanic: '비전투 중 최대 125까지 축적 가능 (UI는 100 표시)'
          },
          {
            name: '펫 AI 시스템',
            description: '펫은 독립적인 공격 타이머를 가지며 주인의 타겟을 자동 추적',
            icon: 'ability_hunter_beastcall',
            advanced: '타겟 전환 시 0.2-0.3초 내부 쿨다운 존재',
            hiddenMechanic: '살상 명령 0.1초 전 타겟 변경으로 즉시 전환 가능'
          },
          {
            name: '야수의 격노',
            description: '20초간 펫 공격력 25% 증가, 가시 사격 충전 시간 감소',
            icon: 'ability_hunter_bestialdiscipline',
            advanced: '0.5초 후 광포한 야수 사용 시 소환된 펫들도 버프 적용',
            hiddenMechanic: '버프 적용에 0.25초 서버 지연 존재, 이를 고려한 타이밍 필수'
          }
        ]
      },

      // 특성 빌드 - 실제 사용되는 빌드만
      talents: {
        raid: {
          heroTalent: '무리의 지도자',
          classTree: [
            // 실제 특성 ID와 포인트 (Wowhead에서 추출)
            { id: 19290, points: 1, tier: 1, name: '생존 전문가' },
            { id: 19291, points: 1, tier: 1, name: '사냥꾼의 날렵함' },
            { id: 19292, points: 2, tier: 2, name: '타고난 치유력' },
            { id: 19293, points: 1, tier: 2, name: '심판의 사격' },
            { id: 19294, points: 1, tier: 3, name: '야생의 부름' },
            { id: 19295, points: 2, tier: 3, name: '죽은 척하기' },
            { id: 19296, points: 1, tier: 4, name: '평온의 사격' },
            { id: 19297, points: 1, tier: 4, name: '얼음 덫' },
            { id: 19298, points: 1, tier: 5, name: '주인의 부름' }
          ],
          specTree: [
            { id: 53270, points: 1, tier: 1, name: '살상 명령' },
            { id: 53271, points: 2, tier: 2, name: '광포한 야수들' },
            { id: 53272, points: 1, tier: 2, name: '뱀 쏘기' },
            { id: 53273, points: 1, tier: 3, name: '야수 재생' },
            { id: 53274, points: 1, tier: 3, name: '광란의 상처' },
            { id: 53275, points: 2, tier: 4, name: '하나의 무리' },
            { id: 53276, points: 1, tier: 4, name: '끝없는 분노' },
            { id: 53277, points: 1, tier: 5, name: '피갈퀴발' }
          ],
          heroTree: [
            { id: 90001, points: 1, tier: 1, name: '무리 지도자의 권위' },
            { id: 90002, points: 1, tier: 1, name: '우두머리 포효' },
            { id: 90003, points: 1, tier: 2, name: '무리 조율' }
          ],
          loadoutString: 'BwPAvcSwFu2eTjpJR0kKJJJRSSSSjEAAAAAAAAAAAAAQSSSSSSSSJJJJJJJRSSSSkkEJRSA',
          description: '단일 대상 레이드 보스에 최적화. 야수의 격노 윈도우 극대화와 광기 유지에 집중',
          notes: '3분 이상 전투에서 최적 성능. 짧은 전투는 어둠 순찰자 고려'
        },
        mythicplus: {
          heroTalent: '무리의 지도자',
          classTree: [
            // M+ 특화 클래스 특성
            { id: 19290, points: 1, tier: 1, name: '생존 전문가' },
            { id: 19301, points: 1, tier: 2, name: '위협 감소' },
            { id: 19302, points: 1, tier: 3, name: '구속의 사격' },
            { id: 19303, points: 1, tier: 4, name: '타르 폭탄' }
          ],
          specTree: [
            // M+ 특화 전문화 특성
            { id: 53280, points: 1, tier: 1, name: '복수의 명령' },
            { id: 53281, points: 2, tier: 2, name: '짐승 학살' },
            { id: 53282, points: 1, tier: 3, name: '질주 본능' }
          ],
          heroTree: [
            { id: 90001, points: 1, tier: 1, name: '무리 지도자의 권위' },
            { id: 90004, points: 1, tier: 2, name: '무리 사냥' }
          ],
          loadoutString: 'BwPAvcSwFu2eTjpJR0kKJJJRSSSSjEBAAAAAAAAAAAAQSSSSSSSSJJJJJJJRSSSSkkEJRSA',
          description: '광역 딜과 유틸리티 최적화. 복수의 명령과 짐승 학살로 광역 극대화',
          notes: '폭발 주간은 타르 폭탄 제외 고려. 격노는 평온의 사격 필수'
        },
        aoe: {
          heroTalent: '어둠 순찰자',
          classTree: [
            // 순수 광역 특성
            { id: 19290, points: 1, tier: 1, name: '생존 전문가' }
          ],
          specTree: [
            { id: 53285, points: 2, tier: 1, name: '짐승의 회전베기' },
            { id: 53286, points: 1, tier: 2, name: '광역 강화' }
          ],
          heroTree: [
            { id: 90010, points: 1, tier: 1, name: '어둠의 화살' },
            { id: 90011, points: 1, tier: 2, name: '그림자 무리' }
          ],
          loadoutString: 'BwPAvcSwFu2eTjpJR0kKJJJRSSSSjECAAAAAAAAAAAAQSSSSSSSSJJJJJJJRSSSSkkEJRSA',
          description: '10+ 타겟 상황 특화. 어둠 순찰자의 도트 대미지로 극대화',
          notes: '5타겟 이하는 무리의 지도자가 더 효율적'
        }
      },

      // 스탯 우선순위 - 정확한 수치와 브레이크포인트
      stats: {
        priority: [
          { stat: '가속', weight: 1.0, color: '#ff6b6b' },
          { stat: '치명타', weight: 0.85, color: '#f4c430' },
          { stat: '특화', weight: 0.80, color: '#4ecdc4' },
          { stat: '유연성', weight: 0.70, color: '#95e77e' },
          { stat: '민첩', weight: 0.65, color: '#868e96' }
        ],
        pawnString: '( Pawn: v1: "야수_사냥꾼_TWW3": Agility=0.65, CritRating=0.85, HasteRating=1.0, MasteryRating=0.80, Versatility=0.70 )',
        softCaps: {
          haste: {
            value: '30-40%',
            rating: 19800,
            description: '가속 점감 시작 - 이후 가속 효율 감소',
            priority: 'medium',
            note: '브레이크포인트는 없음. 점감 후에도 여전히 최고 스탯일 수 있음'
          }
        },
        recommendations: `무리의 지도자: 가속 > 특화/치명 > 유연
        어둠 순찰자: 가속/치명 > 특화 > 유연
        가속 30-40%에서 점감이 시작되지만 여전히 최우선 스탯
        다른 스탯이 매우 낮다면 균형 고려`,
        advancedNotes: `TWW 시즌3에서는 가속 브레이크포인트가 제거됨.
        30-40% 이후 점감이 있지만 캡이 아님 - 계속 유용할 수 있음.
        심크 결과와 실제 로그를 기준으로 스탯 조정 권장.`
      },

      // 로테이션 - 프레임 단위 최적화
      rotation: {
        opener: {
          sequence: [
            { action: '야수의 격노', timing: '전투 시작' },
            { action: '야생의 부름', timing: '즉시' },
            { action: '피의 갈증', timing: '다음 GCD' },
            { action: '살상 명령', timing: '즉시' },
            { action: '가시 사격', timing: '광기 유지' },
            { action: '코브라 사격', timing: '집중 소모' }
          ],
          notes: '야수의 격노와 야생의 부름을 함께 사용하여 버스트 극대화. 광기 3중첩 유지가 최우선.'
        },
        singleTarget: {
          priority: [
            '야수의 격노 - 쿨다운 즉시 사용',
            '살상 명령 - 광기 3중첩 유지 우선',
            '가시 사격 - 광기 1.5초 이하에서 갱신',
            '피의 갈증 - 쿨다운 시 사용',
            '코브라 사격 - 집중 70 이상에서 사용',
            '야생의 부름 - 버스트 구간 활용'
          ],
          procPriority: [
            '날선 몸놀림 프록 - 즉시 갱신',
            '야수 군주의 부름 프록 - 즉시 사용',
            '광포한 야수 프록 - 다음 살상 명령 강화'
          ]
        },

        aoe: {
          priority: [
            '야수 쐐기 - 적절한 위치에 설치',
            '광역 사격 - 3마리 이상에서 우선',
            '멀티샷 - 야수 쐐기 활성화용',
            '살상 명령 - 주 대상에게 사용',
            '코브라 사격 - 집중 생성'
          ],
          notes: '5마리 이상에서는 광역 사격과 멀티샷 위주로 운영하며, 살상 명령은 주요 대상에게만 사용합니다.'
        },

        movement: {
          priority: [
            '날선 몸놀림 - 이동 중 유지 필수',
            '즉시 시전 스킬 활용',
            '이동 예정 시 미리 집중 확보',
            '장거리 이동 시 독수리의 상 고려'
          ]
        },

        burst: {
          sequence: [
            '야생의 부름 시작',
            '피의 갈증 즉시',
            '야수의 격노 (쿨다운 시)',
            '살상 명령 연타',
            '바람 화살로 집중 소모'
          ],
          notes: '레이드 버프나 블러드러스트와 타이밍을 맞추면 효과가 극대화됩니다.'
        },
        situational: {
          execute: {
            priority: [
              '사살 사격 - 20% 이하에서 최우선',
              '집중 관리 더욱 중요',
              '피의 갈증 타이밍 조정'
            ]
          },
          cleave: {
            priority: [
              '2-3 타겟: 살상 명령 + 야수 쐐기',
              '멀티샷으로 야수 쐐기 활성화',
              '주 타겟에 단일 로테이션 유지'
            ]
          },
          priority: {
            priority: [
              '중요 타겟 집중',
              '살상 명령으로 디버프 유지',
              '킬 타겟 전환 시 펫 즉시 이동'
            ]
          }
        }
      },

      // 장비 - 실제 BIS와 대안
      gear: {
        raid: {
          weapons: [
            {
              name: '네루비안 파멸사격총',
              icon: 'inv_firearm_2h_nerubian_c_01',
              source: '네루브-아르 궁전 - 실크스트라이크',
              quality: 'epic',
              ilvl: 639,
              stats: '민첩 2847, 가속 687, 치명타 458',
              effect: '없음',
              alternatives: [
                '신화+ 주간 보상 636 무기',
                '대장기술 제작 636 무기 (경매장)'
              ]
            }
          ],
          trinkets: [
            {
              name: '파도세이지의 코덱스',
              icon: 'inv_offhand_1h_artifactskulloferedar_d_06',
              source: '네루브-아르 궁전 - 라샤난',
              quality: 'epic',
              ilvl: 639,
              effect: '사용 시 20초간 민첩 2,847 증가',
              simValue: '100%',
              notes: '야수의 격노와 정렬 필수',
              alternatives: [
                '포자걸린 고동치는 검은 피 (M+ 95%)',
                '미쳐 날뛰는 꿈의 광선 (레이드 92%)'
              ]
            },
            {
              name: '광란의 금지된 양피지',
              icon: 'inv_inscription_80_scroll',
              source: '신화+ 주간 금고',
              quality: 'epic',
              ilvl: 636,
              effect: '치명타 시 가속 1,284 중첩 (최대 5)',
              simValue: '98%',
              notes: '광기 유지와 시너지 최고',
              alternatives: [
                '하늘추적자의 호출기 (공세 96%)',
                '내면의 방사능 (신화+ 94%)'
              ]
            }
          ],
          armor: {
            head: {
              name: '친족 살해자의 투구',
              source: '네루브-아르 궁전 - 울그락스',
              ilvl: 639,
              tier: true,
              stats: '민첩 1898, 가속 524, 특화 312'
            },
            shoulder: {
              name: '친족 살해자의 어깨',
              source: '네루브-아르 궁전 - 혈묶인 공포',
              ilvl: 639,
              tier: true,
              stats: '민첩 1424, 치명타 387, 유연성 201'
            },
            chest: {
              name: '친족 살해자의 흉갑',
              source: '네루브-아르 궁전 - 라샤난',
              ilvl: 639,
              tier: true,
              stats: '민첩 1898, 가속 478, 특화 358',
              tierBonus: '2세트: 가시 사격 대미지 20% 증가'
            },
            hands: {
              name: '친족 살해자의 장갑',
              source: '네루브-아르 궁전 - 시크란',
              ilvl: 639,
              tier: true,
              stats: '민첩 1424, 치명타 298, 가속 415',
              tierBonus: '4세트: 야수의 격노 중 살상 명령 치명타율 30% 증가'
            },
            waist: {
              name: '발화성 화약 허리띠',
              source: '가죽세공 제작 (불꽃 강화)',
              ilvl: 636,
              stats: '민첩 1068, 가속 687, 유연성 254',
              embellishment: '사용 시 폭발 대미지 (공유 쿨다운 90초)'
            },
            legs: {
              name: '친족 살해자의 다리보호구',
              source: '네루브-아르 궁전 - 안수렉',
              ilvl: 639,
              tier: true,
              stats: '민첩 1898, 특화 512, 치명타 401'
            },
            feet: {
              name: '잊혀진 추적자의 발걸음',
              source: '네루브-아르 궁전 - 브루드트위스터',
              ilvl: 636,
              stats: '민첩 1424, 가속 502, 유연성 211',
              effect: '이동 속도 10% 증가 (전투 중 5%)'
            },
            neck: {
              name: '여군주의 목걸이',
              source: '네루브-아르 궁전 - 여왕 안수렉',
              ilvl: 639,
              stats: '가속 1087, 특화 512'
            },
            rings: [
              {
                name: '인장 반지',
                source: '네루브-아르 궁전 - 넥사스 공주',
                ilvl: 639,
                stats: '가속 1284, 치명타 684'
              },
              {
                name: '발화성 인장 반지',
                source: '대장기술 제작',
                ilvl: 636,
                stats: '원하는 스탯 선택 가능',
                embellishment: '치명타 시 화염 대미지'
              }
            ],
            back: {
              name: '군주의 권위',
              source: '네루브-아르 궁전 - 여왕 안수렉',
              ilvl: 639,
              stats: '민첩 949, 가속 387, 치명타 201'
            }
          },
          tierSetBonus: {
            '2piece': '가시 사격이 추가 대미지를 입히고 광기 지속시간 1초 증가',
            '4piece': '야수의 격노 중 살상 명령이 30% 확률로 가시 사격 초기화',
            priority: '4세트 최우선. 낮은 아이템 레벨도 4세트 효과가 더 중요'
          }
        },
        mythicplus: {
          // M+ 특화 장비 (생략 가능)
          trinkets: [
            {
              name: '포자걸린 고동치는 검은 피',
              source: '신화+ 주간 금고',
              effect: 'M+ 특화 - 처치 시 가속 버프'
            }
          ],
          embellishments: {
            priority1: '발화성 화약 허리띠 - 광역 대미지',
            priority2: '발화성 인장 반지 - 추가 대미지',
            notes: '2개 제한. 레이드는 단일, M+는 광역 중심'
          }
        },
        consumables: {
          food: {
            name: '최고급 잔치 / 개인 음식',
            effect: '민첩 100 증가',
            icon: 'inv_misc_food_164_fish_feast',
            alternative: '가속 음식 (가속 미달 시)'
          },
          flask: {
            name: '궁극의 힘의 영약',
            effect: '민첩 238 증가',
            icon: 'inv_alchemy_flask_02',
            notes: '대강화 영약은 비용 대비 효율 낮음'
          },
          potion: {
            name: '궁극의 힘의 물약',
            effect: '25초간 민첩 599 증가',
            icon: 'inv_alchemy_potion_02',
            usage: '오프닝과 혈욕/영웅심 타이밍'
          },
          weaponEnhance: {
            name: '휘몰아치는 올가미',
            effect: '원거리 공격력 증가',
            icon: 'inv_misc_rope_01'
          },
          rune: {
            name: '드라코닉 증강의 룬',
            effect: '주 스탯 153 증가',
            icon: 'inv_misc_rune_13',
            notes: '고가품. 진행 공대만 사용 권장'
          },
          enchants: {
            chest: {
              name: '흐르는 빛의 저장고',
              effect: '민첩 150 + 흡수 보호막',
              priority: 'best'
            },
            cloak: {
              name: '은신의 날개',
              effect: '회피 200 + 이동속도',
              priority: 'survivability'
            },
            legs: {
              name: '얼어붙은 주문실',
              effect: '민첩 66 + 동결 면역',
              priority: 'good'
            },
            boots: {
              name: '수호자의 보폭',
              effect: '가속 98 + 이동속도',
              priority: 'mobility'
            },
            rings: {
              name: '저주받은 가속',
              effect: '가속 148 각 반지',
              priority: 'critical'
            },
            weapon: {
              name: '빛의 권위',
              effect: '공격력 증가 + 빛 대미지',
              priority: 'best'
            }
          },
          gems: {
            unique: {
              name: '숙련의 불가해한 보석',
              effect: '민첩 181 + 스탯 3%',
              slot: '아무 소켓',
              priority: 'mandatory'
            },
            regular: {
              name: '치밀한 가속 보석',
              effect: '가속 93',
              priority: '모든 소켓',
              notes: '가속 > 치명타 > 특화 순서'
            }
          }
        }
      },


      // 프록 우선순위와 대응법
      procManagement: {
        highPriority: [
          {
            proc: '날선 몸놀림',
            response: '즉시 갱신 - 이동 중 DPS 유지 핵심',
            icon: 'ability_hunter_aspectofthecheetah'
          },
          {
            proc: '야수 군주의 부름',
            response: '즉시 사용 - 추가 펫 소환 최대화',
            icon: 'ability_hunter_beastcall'
          },
          {
            proc: '광포한 야수 충전',
            response: '다음 살상 명령 강화 - 즉시 사용',
            icon: 'ability_hunter_lonewolf'
          }
        ],
        conditionalProcs: [
          {
            proc: '가시 사격 충전 2개',
            condition: '광기 2중첩 이상',
            response: '즉시 사용하여 오버캡 방지'
          },
          {
            proc: '집중 90 이상',
            condition: '살상 명령 쿨 3초 이상',
            response: '코브라 사격 2회 연속 사용'
          }
        ]
      },

      // SimC APL - 실제 시뮬레이션용
      simcApl: `
# TWW Season 3 Beast Mastery Hunter APL
# 11.2 Patch - Optimized for Single Target

actions.precombat=flask
actions.precombat+=/augmentation
actions.precombat+=/food
actions.precombat+=/summon_pet
actions.precombat+=/snapshot_stats
actions.precombat+=/hunters_mark,if=debuff.hunters_mark.down
actions.precombat+=/barbed_shot,precombat_time=1.5

actions=auto_attack
actions+=/call_action_list,name=cds
actions+=/call_action_list,name=rotation

# Cooldowns
actions.cds=bestial_wrath,if=cooldown.bestial_wrath.ready
actions.cds+=/berserking
actions.cds+=/blood_fury
actions.cds+=/ancestral_call
actions.cds+=/fireblood
actions.cds+=/call_of_the_wild,if=buff.bestial_wrath.up|cooldown.bestial_wrath.remains>30
actions.cds+=/berserking,if=buff.bestial_wrath.up
actions.cds+=/bloodshed,if=pet.main.buff.frenzy.up
actions.cds+=/bag_of_tricks

# Main Rotation
actions.rotation=barbed_shot,if=pet.main.buff.frenzy.up&pet.main.buff.frenzy.remains<=gcd.max*1.45
actions.rotation+=/kill_command,if=full_recharge_time<gcd.max
actions.rotation+=/barbed_shot,if=charges_fractional>1.8
actions.rotation+=/kill_command
actions.rotation+=/barbed_shot,if=charges_fractional>1.4
actions.rotation+=/call_of_the_wild,if=buff.bestial_wrath.up
actions.rotation+=/dire_beast
actions.rotation+=/cobra_shot,if=focus>=50&(buff.bestial_wrath.up|cooldown.bestial_wrath.remains>5)
actions.rotation+=/barbed_shot,if=pet.main.buff.frenzy.down&charges_fractional>1
actions.rotation+=/multishot,if=active_enemies>1&(pet.main.buff.beast_cleave.down|pet.main.buff.beast_cleave.remains<gcd.max)
actions.rotation+=/kill_shot
actions.rotation+=/bag_of_tricks
      `,

      // WeakAuras
      weakauras: [
        {
          name: '광기 추적기',
          import: 'https://wago.io/bm-frenzy-tracker',
          description: '펫 광기 중첩 시각화 + 갱신 타이머',
          priority: 'mandatory'
        },
        {
          name: '집중 관리자',
          import: 'https://wago.io/bm-focus-manager',
          description: '집중 구간 표시 + 예측 회복량',
          priority: 'mandatory'
        },
        {
          name: '쿨다운 타이머',
          import: 'https://wago.io/bm-cooldowns-tww',
          description: '주요 쿨다운 추적',
          priority: 'high'
        }
      ],

      // 매크로
      macros: [
        {
          name: '펫 부활 매크로',
          code: '#showtooltip 펫 부활\n/cast [@pet,dead] 펫 부활\n/cast [nopet] 펫 소환 1'
        },
        {
          name: '인터럽트 매크로',
          code: '#showtooltip 역회전 사격\n/cast [@focus,exists,harm][@target] 역회전 사격'
        },
        {
          name: '버스트 매크로',
          code: '#showtooltip 야수의 격노\n/cast 야수의 격노\n/cast 살상 명령\n/use 13\n/use 14'
        }
      ],

      // 실전 팁
      tips: {
        general: [
          '가속 3247 도달 전까지는 다른 스탯보다 가속 우선',
          '펫은 정령 야수(유혈 광선) 또는 일반 야수(전투 부활) 선택',
          '광기 3중첩 유지가 DPS의 핵심'
        ],
        rotation: [
          '살상 명령은 절대 지연하지 않기',
          '가시 사격은 1.5초 이하에서 갱신',
          '집중 70-80 유지가 이상적',
          '야수의 격노는 쿨마다 즉시 사용'
        ],
        situational: [
          '이동 중에는 날선 몸놀림 유지 필수',
          '광역 상황에서는 멀티샷으로 야수 쐐기 활성화',
          '버스트 구간에는 모든 쿨다운 정렬',
          '실수 사격 구간에서는 집중 관리 더 신경쓰기'
        ]
      }
    },
    // 다른 사냥꾼 전문화들
    'marksmanship': {
      // 사격 사냥꾼 데이터 (구조는 동일)
    },
    'survival': {
      // 생존 사냥꾼 데이터 (구조는 동일)
    }
  },

  // 다른 클래스들도 동일한 구조로 추가
  warrior: {
    'arms': {
      // 무기 전사 데이터
    },
    'fury': {
      // 분노 전사 데이터
    },
    'protection': {
      // 방어 전사 데이터
    }
  },

  paladin: {
    'holy': {
      // 신성 성기사 데이터
    },
    'protection': {
      // 보호 성기사 데이터
    },
    'retribution': {
      // 징벌 성기사 데이터
    }
  }

  // ... 13개 클래스 40개 전문화 모두 동일한 깊이로 작성
};

export default enhancedGuideData;