// 시각적 로테이션 플로우 데이터 (Maxroll 스타일)

export const visualRotations = {
  deathknight: {
    혈기: {
      opener: {
        skills: [
          { name: '죽음의 손아귀', icon: 'spell_deathknight_deathgrip', usage: '보스 풀링', priority: 'high' },
          { name: '피의 끓음', icon: 'ability_deathknight_bloodboil', usage: '도트 적용', priority: 'high' },
          { name: '골수 분쇄', icon: 'ability_deathknight_marrowrend', usage: '뼈 보호막 생성', priority: 'high' },
          { name: '죽음의 일격', icon: 'ability_deathknight_deathstrike', usage: '치유 및 방어', priority: 'medium' },
          { name: '룬 무기 춤', icon: 'ability_deathknight_dancingruneblade', usage: '방어 증가', priority: 'high' }
        ]
      },
      main: {
        skills: [
          { name: '골수 분쇄', icon: 'ability_deathknight_marrowrend', usage: '뼈 보호막 유지', priority: 'high', condition: '3스택 이하' },
          { name: '죽음의 일격', icon: 'ability_deathknight_deathstrike', usage: '룬 마력 소비', priority: 'high', condition: 'RP 45+' },
          { name: '피의 끓음', icon: 'ability_deathknight_bloodboil', usage: '룬 회복', priority: 'medium' },
          { name: '심장 강타', icon: 'ability_deathknight_heartstrike', usage: 'RP 생성', priority: 'medium', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '피의 끓음', icon: 'ability_deathknight_bloodboil', usage: '광역 도트', priority: 'high' },
          { name: '죽음과 부패', icon: 'spell_shadow_deathanddecay', usage: '장판 설치', priority: 'medium' },
          { name: '뼈 폭풍', icon: 'ability_deathknight_bonestorm', usage: '광역 피해', priority: 'high' }
        ]
      },
      cooldowns: [
        { name: '흡혈', icon: 'ability_deathknight_vampiricblood', usage: '생존기' },
        { name: '대마법 지대', icon: 'ability_deathknight_antimagiczone', usage: '마법 피해 감소' },
        { name: '고어핀드의 손아귀', icon: 'ability_deathknight_gorefiendgrasp', usage: '몹 그룹핑' }
      ]
    },
    냉기: {
      opener: {
        skills: [
          { name: '울부짖는 한파', icon: 'ability_deathknight_howlingblast', usage: '서리 열병', priority: 'high' },
          { name: '룬 무기 강화', icon: 'ability_deathknight_empowerruneblade', usage: '자원 생성', priority: 'high' },
          { name: '얼음 기둥', icon: 'ability_deathknight_pillaroffrost', usage: '메인 버스트', priority: 'high' },
          { name: '절멸', icon: 'ability_deathknight_obliterate', usage: '주력 피해', priority: 'high', repeat: 3 },
          { name: '서리 일격', icon: 'ability_deathknight_froststrike', usage: 'RP 소비', priority: 'medium' }
        ]
      },
      main: {
        skills: [
          { name: '절멸', icon: 'ability_deathknight_obliterate', usage: '주력 피해', priority: 'high' },
          { name: '서리 일격', icon: 'ability_deathknight_froststrike', usage: 'RP 소비', priority: 'medium', condition: 'RP 70+' },
          { name: '냉기 돌풍', icon: 'ability_deathknight_frostscythe', usage: 'RP 소비', priority: 'medium', condition: '살상 기계' },
          { name: '울부짖는 한파', icon: 'ability_deathknight_howlingblast', usage: '서리 발동', priority: 'low', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '냉혹한 겨울', icon: 'ability_deathknight_remorselesswinter', usage: '광역 도트', priority: 'high' },
          { name: '빙결', icon: 'ability_deathknight_frostscythe', usage: '광역 피해', priority: 'high' },
          { name: '절멸', icon: 'ability_deathknight_obliterate', usage: '깊은 상처', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '얼음 기둥', icon: 'ability_deathknight_pillaroffrost', usage: '2분 버스트' },
        { name: '룬 무기 강화', icon: 'ability_deathknight_empowerruneblade', usage: '자원 생성' },
        { name: '절대 영도', icon: 'ability_deathknight_frostpresence', usage: '궁극기' }
      ]
    },
    부정: {
      opener: {
        skills: [
          { name: '대재앙', icon: 'ability_deathknight_outbreak', usage: '질병 적용', priority: 'high' },
          { name: '군대 소환', icon: 'ability_deathknight_armyofthedead', usage: '미리 소환', priority: 'medium' },
          { name: '고름 일격', icon: 'ability_deathknight_festering_strike', usage: '상처 생성', priority: 'high', stacks: '4-6' },
          { name: '불홀한 광란', icon: 'ability_deathknight_unholypresence', usage: '버스트 시작', priority: 'high' },
          { name: '암흑 변신', icon: 'ability_deathknight_darktransformation', usage: '구울 강화', priority: 'high' }
        ]
      },
      main: {
        skills: [
          { name: '고름 일격', icon: 'ability_deathknight_festering_strike', usage: '상처 유지', priority: 'high', condition: '상처 < 4' },
          { name: '죽음의 고리', icon: 'ability_deathknight_deathcoil', usage: '상처 터뜨리기', priority: 'medium' },
          { name: '스컬지 일격', icon: 'ability_deathknight_scourgestrike', usage: '상처 소비', priority: 'high', condition: '상처 4+' },
          { name: '역병 일격', icon: 'ability_creature_disease_02', usage: '도트 갱신', priority: 'low', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '죽음과 부패', icon: 'spell_shadow_deathanddecay', usage: '장판 설치', priority: 'high' },
          { name: '유행병', icon: 'ability_deathknight_epidemic', usage: '광역 도트', priority: 'high' },
          { name: '스컬지 일격', icon: 'ability_deathknight_scourgestrike', usage: '절단 적용', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '불홀한 광란', icon: 'ability_deathknight_unholypresence', usage: '메인 버스트' },
        { name: '가고일 소환', icon: 'ability_deathknight_summongargoyle', usage: '단일 버스트' },
        { name: '암흑 변신', icon: 'ability_deathknight_darktransformation', usage: '구울 강화' }
      ]
    }
  },

  demonhunter: {
    복수: {
      opener: {
        skills: [
          { name: '지옥 불길', icon: 'ability_demonhunter_infernalstrike', usage: '진입', priority: 'high' },
          { name: '파멸', icon: 'ability_demonhunter_immolation', usage: '도트 및 분노', priority: 'high' },
          { name: '악마 쐐기', icon: 'ability_demonhunter_demonspikes', usage: '방어 증가', priority: 'high' },
          { name: '영혼 베어내기', icon: 'ability_demonhunter_shear', usage: '조각 생성', priority: 'medium', repeat: 2 },
          { name: '영혼 쪼개기', icon: 'ability_demonhunter_soulcleave', usage: '치유', priority: 'medium' }
        ]
      },
      main: {
        skills: [
          { name: '악마 쐐기', icon: 'ability_demonhunter_demonspikes', usage: '방어 유지', priority: 'high', condition: '충전 2' },
          { name: '영혼 베어내기', icon: 'ability_demonhunter_shear', usage: '조각 생성', priority: 'medium' },
          { name: '영혼 쪼개기', icon: 'ability_demonhunter_soulcleave', usage: '치유 및 피해', priority: 'high', condition: '조각 4+' },
          { name: '균열', icon: 'ability_demonhunter_fracture', usage: '추가 조각', priority: 'low', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '파멸', icon: 'ability_demonhunter_immolation', usage: '광역 도트', priority: 'high' },
          { name: '영혼 폭탄', icon: 'ability_demonhunter_soulbomb', usage: '광역 폭발', priority: 'high' },
          { name: '인장 각인', icon: 'ability_demonhunter_sigilofflame', usage: '장판 피해', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '악마 형상', icon: 'ability_demonhunter_metamorphosis', usage: '생존 및 피해' },
        { name: '마력의 수호물', icon: 'ability_demonhunter_empowerwards', usage: '마법 피해 감소' },
        { name: '최후의 수단', icon: 'ability_demonhunter_lastresort', usage: '자동 생존기' }
      ]
    },
    파멸: {
      opener: {
        skills: [
          { name: '악마 형상', icon: 'ability_demonhunter_metamorphosis', usage: '변신', priority: 'high' },
          { name: '눈 광선', icon: 'ability_demonhunter_eyebeam', usage: '악마 형상 연장', priority: 'high' },
          { name: '죽음의 휩쓸기', icon: 'ability_demonhunter_deathsweep', usage: '변신 피해', priority: 'high' },
          { name: '칼날 춤', icon: 'ability_demonhunter_bladedance', usage: '광역 피해', priority: 'medium' },
          { name: '혼돈의 일격', icon: 'ability_demonhunter_chaossstrike', usage: '주력 피해', priority: 'high', repeat: 2 }
        ]
      },
      main: {
        skills: [
          { name: '악마의 이빨', icon: 'ability_demonhunter_demonsbite', usage: '분노 생성', priority: 'medium' },
          { name: '혼돈의 일격', icon: 'ability_demonhunter_chaossstrike', usage: '분노 소비', priority: 'high', condition: '분노 40+' },
          { name: '칼날 춤', icon: 'ability_demonhunter_bladedance', usage: '쿨마다', priority: 'medium' },
          { name: '투척 검', icon: 'ability_demonhunter_throwglaive', usage: '원거리', priority: 'low', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '눈 광선', icon: 'ability_demonhunter_eyebeam', usage: '채널링 광역', priority: 'high' },
          { name: '칼날 춤', icon: 'ability_demonhunter_bladedance', usage: '광역 피해', priority: 'high' },
          { name: '혼돈의 일격', icon: 'ability_demonhunter_chaossstrike', usage: '단일 집중', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '악마 형상', icon: 'ability_demonhunter_metamorphosis', usage: '4분 버스트' },
        { name: '복수의 퇴각', icon: 'ability_demonhunter_vengefulretreat', usage: '분노 생성' },
        { name: '질풍', icon: 'ability_demonhunter_netherwalk', usage: '가속 버프' }
      ]
    }
  },

  warrior: {
    방어: {
      opener: {
        skills: [
          { name: '돌진', icon: 'ability_warrior_charge', usage: '진입', priority: 'high' },
          { name: '방패 밀쳐내기', icon: 'ability_warrior_shieldslam', usage: '위협 생성', priority: 'high' },
          { name: '천둥벼락', icon: 'ability_warrior_thunderclap', usage: '광역 위협', priority: 'high' },
          { name: '방패 막기', icon: 'ability_defend', usage: '방어 증가', priority: 'high' },
          { name: '복수', icon: 'ability_warrior_revenge', usage: '격노 소비', priority: 'medium' }
        ]
      },
      main: {
        skills: [
          { name: '방패 막기', icon: 'ability_defend', usage: '능동 방어', priority: 'high', condition: '충전 가능' },
          { name: '방패 밀쳐내기', icon: 'ability_warrior_shieldslam', usage: '쿨마다', priority: 'high' },
          { name: '천둥벼락', icon: 'ability_warrior_thunderclap', usage: '디버프 유지', priority: 'medium' },
          { name: '복수', icon: 'ability_warrior_revenge', usage: '격노 소비', priority: 'medium', condition: '격노 60+' },
          { name: '격파', icon: 'ability_warrior_devastate', usage: '필러', priority: 'low', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '천둥벼락', icon: 'ability_warrior_thunderclap', usage: '광역 위협', priority: 'high' },
          { name: '복수', icon: 'ability_warrior_revenge', usage: '광역 피해', priority: 'high' },
          { name: '격돌', icon: 'ability_warrior_shockwave', usage: '광역 스턴', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '방패의 벽', icon: 'ability_warrior_shieldwall', usage: '피해 감소' },
        { name: '최후의 저항', icon: 'spell_nature_reincarnation', usage: '생존기' },
        { name: '사기의 외침', icon: 'ability_warrior_rallyingcry', usage: '공대 생존' }
      ]
    },
    무기: {
      opener: {
        skills: [
          { name: '돌진', icon: 'ability_warrior_charge', usage: '진입', priority: 'high' },
          { name: '대재앙', icon: 'ability_warrior_colossalsmash', usage: '디버프', priority: 'high' },
          { name: '전투의 함성', icon: 'ability_warrior_warcry', usage: '치명타 보장', priority: 'high' },
          { name: '죽음의 일격', icon: 'ability_warrior_decisivestrike', usage: '주력 피해', priority: 'high', repeat: 2 },
          { name: '압도', icon: 'ability_warrior_overpower', usage: '버프 스택', priority: 'medium' }
        ]
      },
      main: {
        skills: [
          { name: '대재앙', icon: 'ability_warrior_colossalsmash', usage: '디버프 유지', priority: 'high', condition: '만료 임박' },
          { name: '죽음의 일격', icon: 'ability_warrior_decisivestrike', usage: '주력 피해', priority: 'high', condition: '2충전' },
          { name: '압도', icon: 'ability_warrior_overpower', usage: '버프 유지', priority: 'medium' },
          { name: '휩쓸기 일격', icon: 'ability_warrior_sweepingstrikes', usage: '광역 전환', priority: 'low' },
          { name: '분쇄', icon: 'ability_warrior_savageblow', usage: '필러', priority: 'low', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '휩쓸기 일격', icon: 'ability_warrior_sweepingstrikes', usage: '광역 활성', priority: 'high' },
          { name: '칼날폭풍', icon: 'ability_warrior_bladestorm', usage: '광역 버스트', priority: 'high' },
          { name: '회전베기', icon: 'ability_whirlwind', usage: '광역 피해', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '투신', icon: 'ability_warrior_avatar', usage: '피해 증가' },
        { name: '칼날폭풍', icon: 'ability_warrior_bladestorm', usage: '광역 버스트' },
        { name: '거인 학살자', icon: 'ability_warrior_titansgrip', usage: '강력한 일격' }
      ]
    },
    분노: {
      opener: {
        skills: [
          { name: '돌진', icon: 'ability_warrior_charge', usage: '진입', priority: 'high' },
          { name: '피의 갈증', icon: 'spell_nature_bloodlust', usage: '격노 생성', priority: 'high' },
          { name: '격노의 일격', icon: 'spell_nature_shamanrage', usage: '주력 피해', priority: 'high' },
          { name: '분쇄', icon: 'ability_warrior_rampage', usage: '격노 발동', priority: 'high' },
          { name: '무모한 희생', icon: 'ability_warrior_recklessness', usage: '버스트', priority: 'high' }
        ]
      },
      main: {
        skills: [
          { name: '피의 갈증', icon: 'spell_nature_bloodlust', usage: '격노 생성', priority: 'high', condition: '치명타 발동' },
          { name: '격노의 일격', icon: 'spell_nature_shamanrage', usage: '격노 유지', priority: 'high' },
          { name: '분쇄', icon: 'ability_warrior_rampage', usage: '격노 소비', priority: 'high', condition: '격노 85+' },
          { name: '회전베기', icon: 'ability_whirlwind', usage: '필러', priority: 'low', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '회전베기', icon: 'ability_whirlwind', usage: '광역 피해', priority: 'high' },
          { name: '분쇄', icon: 'ability_warrior_rampage', usage: '광역 적용', priority: 'high' },
          { name: '파괴의 춤', icon: 'ability_warrior_bladestorm', usage: '광역 버스트', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '무모한 희생', icon: 'ability_warrior_recklessness', usage: '메인 버스트' },
        { name: '오딘의 격노', icon: 'ability_warrior_odinsfury', usage: '추가 공격' },
        { name: '투신', icon: 'ability_warrior_avatar', usage: '피해 증가' }
      ]
    }
  },

  // 다른 직업들도 동일한 구조로 추가
  paladin: {
    신성: {
      opener: {
        skills: [
          { name: '빛의 봉화', icon: 'ability_paladin_beaconoflight', usage: '탱커 연결', priority: 'high' },
          { name: '신성 충격', icon: 'spell_holy_searinglight', usage: '즉시 힐', priority: 'high' },
          { name: '빛의 섬광', icon: 'spell_holy_flashheal', usage: '빠른 힐', priority: 'medium', repeat: 2 },
          { name: '신의 권능', icon: 'spell_holy_avenginewrath', usage: '힐 증가', priority: 'high' }
        ]
      },
      main: {
        skills: [
          { name: '신성 충격', icon: 'spell_holy_searinglight', usage: '쿨마다', priority: 'high' },
          { name: '빛의 섬광', icon: 'spell_holy_flashheal', usage: '주력 힐', priority: 'medium' },
          { name: '성스러운 빛', icon: 'spell_holy_holybolt', usage: '강력 힐', priority: 'medium', condition: '큰 피해' },
          { name: '빛 주입', icon: 'spell_holy_flashheal', usage: '버프 소비', priority: 'low', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '여명의 빛', icon: 'spell_paladin_dawnlight', usage: '광역 힐', priority: 'high' },
          { name: '희생의 오라', icon: 'spell_holy_auramastery', usage: '피해 감소', priority: 'high' },
          { name: '신의 권능', icon: 'spell_holy_avenginewrath', usage: '힐 버스트', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '신의 권능', icon: 'spell_holy_avenginewrath', usage: '메인 버스트' },
        { name: '희생의 오라', icon: 'spell_holy_auramastery', usage: '공대 생존' },
        { name: '천상의 은혜', icon: 'spell_holy_divineprovidence', usage: '개인 이동' }
      ]
    },
    보호: {
      opener: {
        skills: [
          { name: '정의의 방패', icon: 'spell_holy_avengersshield', usage: '원거리 풀링', priority: 'high' },
          { name: '축성', icon: 'spell_holy_consecration', usage: '장판 설치', priority: 'high' },
          { name: '정의의 망치', icon: 'ability_paladin_hammeroftherighteous', usage: '신권 생성', priority: 'medium', repeat: 2 },
          { name: '신의 방패', icon: 'ability_paladin_shieldofvengeance', usage: '방어 증가', priority: 'high' }
        ]
      },
      main: {
        skills: [
          { name: '정의의 망치', icon: 'ability_paladin_hammeroftherighteous', usage: '신권 생성', priority: 'medium' },
          { name: '신의 방패', icon: 'ability_paladin_shieldofvengeance', usage: '신권 소비', priority: 'high', condition: '신권 5' },
          { name: '정의의 방패', icon: 'spell_holy_avengersshield', usage: '쿨마다', priority: 'high' },
          { name: '축성', icon: 'spell_holy_consecration', usage: '유지', priority: 'medium', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '축성', icon: 'spell_holy_consecration', usage: '광역 장판', priority: 'high' },
          { name: '정의의 방패', icon: 'spell_holy_avengersshield', usage: '다중 타격', priority: 'high' },
          { name: '빛의 망치', icon: 'ability_paladin_hammeroflight', usage: '광역 신권', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '불굴의 수호자', icon: 'spell_holy_ardentdefender', usage: '생존기' },
        { name: '수호자의 빛', icon: 'spell_holy_guardianspirit', usage: '체력 회복' },
        { name: '응징의 격노', icon: 'spell_holy_avenginewrath', usage: 'DPS 증가' }
      ]
    },
    징벌: {
      opener: {
        skills: [
          { name: '칼날 폭풍', icon: 'ability_paladin_bladestorm', usage: '신권 생성', priority: 'high' },
          { name: '재의 경험', icon: 'ability_paladin_wakeofashes', usage: '5 신권', priority: 'high' },
          { name: '응징의 격노', icon: 'spell_holy_avenginewrath', usage: '버스트', priority: 'high' },
          { name: '기사단의 선고', icon: 'spell_paladin_templarsverdict', usage: '신권 소비', priority: 'high', repeat: 2 }
        ]
      },
      main: {
        skills: [
          { name: '칼날 폭풍', icon: 'ability_paladin_bladestorm', usage: '신권 생성', priority: 'medium' },
          { name: '기사단의 선고', icon: 'spell_paladin_templarsverdict', usage: '5 신권 소비', priority: 'high', condition: '신권 5' },
          { name: '심판', icon: 'spell_holy_righteousfury', usage: '디버프 유지', priority: 'medium' },
          { name: '정의의 검', icon: 'ability_paladin_swordoflight', usage: '필러', priority: 'low', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '천상의 폭풍', icon: 'ability_paladin_divinestorm', usage: '광역 신권 소비', priority: 'high' },
          { name: '재의 경험', icon: 'ability_paladin_wakeofashes', usage: '광역 신권', priority: 'high' },
          { name: '축성', icon: 'spell_holy_consecration', usage: '광역 도트', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '응징의 격노', icon: 'spell_holy_avenginewrath', usage: '메인 버스트' },
        { name: '성전', icon: 'spell_holy_crusade', usage: '가속 증가' },
        { name: '최후의 순간', icon: 'spell_paladin_finalreckoning', usage: '추가 버스트' }
      ]
    }
  },

  priest: {
    수양: {
      opener: {
        skills: [
          { name: '신의 권능: 보호막', icon: 'spell_holy_powerwordshield', usage: '속죄 적용', priority: 'high' },
          { name: '광휘', icon: 'spell_holy_powerwordradiance', usage: '광역 속죄', priority: 'high' },
          { name: '고통', icon: 'spell_shadow_shadowwordpain', usage: '도트 적용', priority: 'medium' },
          { name: '분열', icon: 'spell_holy_penance', usage: '속죄 힐', priority: 'high' },
          { name: '어둠의 마귀', icon: 'spell_shadow_shadowfiend', usage: '버스트', priority: 'high' }
        ]
      },
      main: {
        skills: [
          { name: '보호막', icon: 'spell_holy_powerwordshield', usage: '속죄 유지', priority: 'high' },
          { name: '고통', icon: 'spell_shadow_shadowwordpain', usage: '도트 유지', priority: 'medium' },
          { name: '분열', icon: 'spell_holy_penance', usage: '쿨마다', priority: 'high' },
          { name: '정화', icon: 'spell_shadow_shadowmend', usage: '속죄 힐', priority: 'medium', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '광휘', icon: 'spell_holy_powerwordradiance', usage: '광역 속죄', priority: 'high' },
          { name: '환희', icon: 'spell_holy_rapture', usage: '버스트 속죄', priority: 'high' },
          { name: '고통', icon: 'spell_shadow_shadowwordpain', usage: '다중 도트', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '어둠의 마귀', icon: 'spell_shadow_shadowfiend', usage: '버스트 힐' },
        { name: '통제의 복음', icon: 'spell_holy_evangelism', usage: '속죄 연장' },
        { name: '방벽', icon: 'spell_holy_powerwordbarrier', usage: '공대 생존' }
      ]
    },
    신성: {
      opener: {
        skills: [
          { name: '회복의 기원', icon: 'spell_holy_prayerofmendingtga', usage: '도트 힐', priority: 'high' },
          { name: '치유의 기원', icon: 'spell_holy_prayerofhealing', usage: '광역 힐', priority: 'high' },
          { name: '성스러운 언약', icon: 'spell_holy_holycovenant', usage: '힐 증가', priority: 'medium' },
          { name: '신성한 별', icon: 'spell_priest_holystar', usage: '이동 힐', priority: 'medium' }
        ]
      },
      main: {
        skills: [
          { name: '회복의 기원', icon: 'spell_holy_prayerofmendingtga', usage: '유지', priority: 'high' },
          { name: '치유의 기원', icon: 'spell_holy_prayerofhealing', usage: '광역 힐', priority: 'high', condition: '피해 예상' },
          { name: '빛의 권능', icon: 'spell_holy_heal', usage: '효율 힐', priority: 'medium' },
          { name: '순간 치유', icon: 'spell_holy_flashheal', usage: '응급 힐', priority: 'low', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '신성한 찬가', icon: 'spell_holy_divinehymn', usage: '채널링 힐', priority: 'high' },
          { name: '치유의 기원', icon: 'spell_holy_prayerofhealing', usage: '광역 힐', priority: 'high' },
          { name: '빛우물', icon: 'spell_priest_lightwell', usage: '지속 힐', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '수호 영혼', icon: 'spell_holy_guardianspirit', usage: '개인 생존' },
        { name: '신성한 찬가', icon: 'spell_holy_divinehymn', usage: '공대 힐' },
        { name: '구원의 정신', icon: 'spell_holy_spiritoftheredeemer', usage: '힐 증가' }
      ]
    },
    암흑: {
      opener: {
        skills: [
          { name: '흡혈의 손길', icon: 'spell_shadow_vampirictouch', usage: '도트 적용', priority: 'high' },
          { name: '고통', icon: 'spell_shadow_shadowwordpain', usage: '즉시 도트', priority: 'high' },
          { name: '공허 폭발', icon: 'spell_shadow_voidbolt', usage: '정신력 생성', priority: 'high' },
          { name: '공허 형상', icon: 'spell_shadow_voidform', usage: '변신', priority: 'high' },
          { name: '정신 분열', icon: 'spell_shadow_mindflay', usage: '채널링', priority: 'medium' }
        ]
      },
      main: {
        skills: [
          { name: '흡혈의 손길', icon: 'spell_shadow_vampirictouch', usage: '도트 유지', priority: 'high' },
          { name: '고통', icon: 'spell_shadow_shadowwordpain', usage: '도트 유지', priority: 'high' },
          { name: '공허 폭발', icon: 'spell_shadow_voidbolt', usage: '쿨마다', priority: 'high', condition: '공허 형상' },
          { name: '정신 분열', icon: 'spell_shadow_mindflay', usage: '필러', priority: 'medium', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '정신의 쐐기', icon: 'spell_shadow_psychichorrors', usage: '광역 도트', priority: 'high' },
          { name: '어둠 붕괴', icon: 'spell_shadow_shadowcrash', usage: '광역 폭발', priority: 'high' },
          { name: '정신 분열', icon: 'spell_shadow_mindflay', usage: '광역 채널링', priority: 'medium' }
        ]
      },
      cooldowns: [
        { name: '공허 형상', icon: 'spell_shadow_voidform', usage: '메인 변신' },
        { name: '어둠의 마귀', icon: 'spell_shadow_shadowfiend', usage: '추가 피해' },
        { name: '공허 격류', icon: 'spell_shadow_voidtorrent', usage: '버스트 채널링' }
      ]
    }
  },

  // 사냥꾼 로테이션
  hunter: {
    야수: {
      opener: {
        skills: [
          { name: '사냥꾼의 징표', icon: 'ability_hunter_markedfordeath', priority: 'high', usage: '대상 표시' },
          { name: '야생의 부름', icon: 'ability_hunter_bestialwrath', priority: 'high', usage: '버스트 시작' },
          { name: '피의 향연', icon: 'spell_deathknight_butcher2', priority: 'high', usage: '블리드 적용' },
          { name: '살무사 쐐기', icon: 'ability_hunter_cobrashot', priority: 'high', usage: '독 적용' },
          { name: '적토마', icon: 'ability_hunter_killcommand', priority: 'high', usage: '주력 딜' },
          { name: '코브라 사격', icon: 'ability_hunter_cobrashot', priority: 'medium', usage: '집중 생성' }
        ]
      },
      main: {
        skills: [
          { name: '적토마', icon: 'ability_hunter_killcommand', priority: 'high', usage: '쿨마다' },
          { name: '야생의 부름', icon: 'ability_hunter_bestialwrath', priority: 'high', usage: '쿨마다', condition: '준비됨' },
          { name: '살무사 쐐기', icon: 'ability_hunter_cobrashot', priority: 'high', usage: '유지' },
          { name: '피의 향연', icon: 'spell_deathknight_butcher2', priority: 'medium', usage: '3중첩' },
          { name: '코브라 사격', icon: 'ability_hunter_cobrashot', priority: 'low', usage: '집중 소모' },
          { name: '포악한 야수', icon: 'ability_druid_ferociousbite', priority: 'medium', usage: '집중 높을 때', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '야생의 부름', icon: 'ability_hunter_bestialwrath', priority: 'high', usage: '버스트' },
          { name: '다중 사격', icon: 'ability_upgrademoonglaive', priority: 'high', usage: '광역' },
          { name: '폭발 사격', icon: 'ability_hunter_explosiveshot', priority: 'medium', usage: '광역' },
          { name: '살무사 쐐기', icon: 'ability_hunter_cobrashot', priority: 'medium', usage: '독 유지' }
        ]
      },
      cooldowns: [
        { name: '야생의 부름', icon: 'ability_hunter_bestialwrath', usage: '2분 쿨다운' },
        { name: '광포한 격노', icon: 'ability_warrior_rampage', usage: '3분 쿨다운' },
        { name: '야생의 본능', icon: 'ability_hunter_aspectoftheviper', usage: '생존기' }
      ]
    },
    사격: {
      opener: {
        skills: [
          { name: '이중 사격', icon: 'ability_hunter_focusedaim', priority: 'high', usage: '버프 적용' },
          { name: '속사', icon: 'ability_hunter_runningshot', priority: 'high', usage: '헤이스트' },
          { name: '정조준', icon: 'ability_hunter_assassinate', priority: 'high', usage: '큰 데미지' },
          { name: '폭발 사격', icon: 'ability_hunter_explosiveshot', priority: 'high', usage: '폭발' },
          { name: '속사', icon: 'inv_spear_07', priority: 'medium', usage: '빠른 시전' },
          { name: '정조준', icon: 'ability_hunter_assassinate', priority: 'high', usage: '큰 데미지' }
        ]
      },
      main: {
        skills: [
          { name: '속사', icon: 'ability_hunter_runningshot', priority: 'high', usage: '쿨마다', condition: '준비됨' },
          { name: '정조준', icon: 'ability_hunter_assassinate', priority: 'high', usage: '정밀 효과' },
          { name: '폭발 사격', icon: 'ability_hunter_explosiveshot', priority: 'high', usage: '쿨마다' },
          { name: '일제 사격', icon: 'ability_hunter_rapidkilling', priority: 'medium', usage: '집중 소모' },
          { name: '고정 사격', icon: 'inv_spear_07', priority: 'low', usage: '필러' }
        ]
      },
      aoe: {
        skills: [
          { name: '속사', icon: 'ability_hunter_runningshot', priority: 'high', usage: '버스트' },
          { name: '다중 사격', icon: 'ability_upgrademoonglaive', priority: 'high', usage: '광역' },
          { name: '폭발 사격', icon: 'ability_hunter_explosiveshot', priority: 'high', usage: '광역 폭발' },
          { name: '일제 사격', icon: 'ability_hunter_rapidkilling', priority: 'medium', usage: '광역' }
        ]
      },
      cooldowns: [
        { name: '속사', icon: 'ability_hunter_runningshot', usage: '3분 쿨다운' },
        { name: '이중 사격', icon: 'ability_hunter_focusedaim', usage: '2분 쿨다운' }
      ]
    },
    생존: {
      opener: {
        skills: [
          { name: '맹금의 상', icon: 'spell_hunter_aspectofthehawk', priority: 'high', usage: '버프' },
          { name: '야생불', icon: 'ability_hunter_invigeration', priority: 'high', usage: '도트' },
          { name: '분살 폭탄', icon: 'spell_fire_selfdestruct', priority: 'high', usage: '폭발물' },
          { name: '머구리 사격', icon: 'ability_hunter_harpoon', priority: 'high', usage: '근접' },
          { name: '맹금의 일격', icon: 'ability_warrior_savageblow', priority: 'high', usage: '출혈' },
          { name: '살수', icon: 'rogue_leeching_poison', priority: 'medium', usage: '도트' }
        ]
      },
      main: {
        skills: [
          { name: '야생불', icon: 'ability_hunter_invigeration', priority: 'high', usage: '도트 유지' },
          { name: '살수', icon: 'rogue_leeching_poison', priority: 'high', usage: '도트 유지' },
          { name: '맹금의 일격', icon: 'ability_warrior_savageblow', priority: 'high', usage: '스택 유지' },
          { name: '머구리 사격', icon: 'ability_hunter_harpoon', priority: 'medium', usage: '집중 소모' },
          { name: '분살 폭탄', icon: 'spell_fire_selfdestruct', priority: 'medium', usage: '쿨마다' }
        ]
      },
      aoe: {
        skills: [
          { name: '야생불 폭탄', icon: 'spell_fire_selfdestruct', priority: 'high', usage: '광역 폭발' },
          { name: '살육', icon: 'ability_gouge', priority: 'high', usage: '광역 출혈' },
          { name: '분살 폭탄', icon: 'spell_fire_selfdestruct', priority: 'high', usage: '광역' },
          { name: '살수', icon: 'rogue_leeching_poison', priority: 'medium', usage: '광역 도트' }
        ]
      },
      cooldowns: [
        { name: '맹금의 상', icon: 'spell_hunter_aspectofthehawk', usage: '2분 쿨다운' },
        { name: '협공', icon: 'ability_devour', usage: '3분 쿨다운' }
      ]
    }
  },

  // 마법사 로테이션
  mage: {
    비전: {
      opener: {
        skills: [
          { name: '비전 지능', icon: 'spell_holy_magicalsentry', priority: 'high', usage: '버프' },
          { name: '비전력', icon: 'spell_nature_lightning', priority: 'high', usage: '버스트' },
          { name: '황천의 폭풍', icon: 'spell_arcane_starfire', priority: 'high', usage: '준비' },
          { name: '비전 작렬', icon: 'spell_arcane_blast', priority: 'high', usage: '4중첩', repeat: 4 },
          { name: '비전 포화', icon: 'spell_arcane_arcane01', priority: 'high', usage: '소모' },
          { name: '환기', icon: 'spell_arcane_mindmastery', priority: 'medium', usage: '마나 회복' }
        ]
      },
      main: {
        skills: [
          { name: '비전 작렬', icon: 'spell_arcane_blast', priority: 'high', usage: '충전 4중첩', stacks: 4 },
          { name: '비전 포화', icon: 'spell_arcane_arcane01', priority: 'high', usage: '명료 소모' },
          { name: '비전 작렬', icon: 'spell_arcane_blast', priority: 'medium', usage: '충전', condition: '마나 > 70%' },
          { name: '비전 탄막', icon: 'spell_arcane_arcane03', priority: 'medium', usage: '명료 생성' },
          { name: '환기', icon: 'spell_arcane_mindmastery', priority: 'low', usage: '마나 회복', condition: '마나 < 30%' }
        ]
      },
      aoe: {
        skills: [
          { name: '비전 보주', icon: 'spell_nature_wispsplode', priority: 'high', usage: '설치' },
          { name: '비전 작렬', icon: 'spell_arcane_blast', priority: 'high', usage: '충전', stacks: 2 },
          { name: '비전 폭발', icon: 'spell_nature_wispsplode', priority: 'high', usage: '광역' },
          { name: '비전 탄막', icon: 'spell_arcane_arcane03', priority: 'medium', usage: '광역' }
        ]
      },
      cooldowns: [
        { name: '비전력', icon: 'spell_nature_lightning', usage: '2분 쿨다운' },
        { name: '황천의 폭풍', icon: 'spell_arcane_starfire', usage: '3분 쿨다운' },
        { name: '시간 돌리기', icon: 'spell_nature_timestop', usage: '4분 쿨다운' }
      ]
    },
    화염: {
      opener: {
        skills: [
          { name: '연소', icon: 'spell_fire_sealoffire', priority: 'high', usage: '버스트' },
          { name: '화염 작렬', icon: 'spell_fire_fireball02', priority: 'high', usage: '발화 스택' },
          { name: '화염구', icon: 'spell_fire_flamebolt', priority: 'high', usage: '시전' },
          { name: '화염 폭풍', icon: 'spell_fire_selfdestruct', priority: 'high', usage: '즉시시전' },
          { name: '불작렬', icon: 'spell_fire_soulburn', priority: 'high', usage: '도트' },
          { name: '태양섬광', icon: 'ability_mage_firestarter', priority: 'high', usage: '즉시시전' }
        ]
      },
      main: {
        skills: [
          { name: '화염구', icon: 'spell_fire_flamebolt', priority: 'medium', usage: '시전' },
          { name: '화염 작렬', icon: 'spell_fire_fireball02', priority: 'high', usage: '발화 소모' },
          { name: '태양섬광', icon: 'ability_mage_firestarter', priority: 'high', usage: '발화 생성' },
          { name: '불작렬', icon: 'spell_fire_soulburn', priority: 'medium', usage: '2스택' },
          { name: '작렬', icon: 'spell_fire_burnout', priority: 'low', usage: '이동 중' }
        ]
      },
      aoe: {
        skills: [
          { name: '화염 폭풍', icon: 'spell_fire_selfdestruct', priority: 'high', usage: '광역' },
          { name: '불기둥', icon: 'spell_fire_pillarofflame', priority: 'high', usage: '설치' },
          { name: '용의 숨결', icon: 'inv_misc_head_dragon_01', priority: 'high', usage: '전방 광역' },
          { name: '태양섬광', icon: 'ability_mage_firestarter', priority: 'medium', usage: '확산' }
        ]
      },
      cooldowns: [
        { name: '연소', icon: 'spell_fire_sealoffire', usage: '2분 쿨다운' },
        { name: '화염 폭풍', icon: 'spell_fire_selfdestruct', usage: '45초 쿨다운' }
      ]
    },
    냉기: {
      opener: {
        skills: [
          { name: '얼음 핏줄', icon: 'spell_frost_coldhearted', priority: 'high', usage: '버스트' },
          { name: '얼음 보주', icon: 'spell_frost_orb', priority: 'high', usage: '설치' },
          { name: '눈보라', icon: 'spell_frost_icestorm', priority: 'high', usage: '광역' },
          { name: '서리 화살', icon: 'spell_frost_frostbolt02', priority: 'medium', usage: '시전' },
          { name: '얼음창', icon: 'spell_frost_frostblast', priority: 'high', usage: '즉시시전' },
          { name: '혜성 폭풍', icon: 'spell_mage_cometstorm', priority: 'high', usage: '폭발' }
        ]
      },
      main: {
        skills: [
          { name: '서리 화살', icon: 'spell_frost_frostbolt02', priority: 'medium', usage: '시전' },
          { name: '얼음창', icon: 'spell_frost_frostblast', priority: 'high', usage: '산산조각 소모' },
          { name: '얼음 화살', icon: 'spell_frost_frostbolt', priority: 'high', usage: '즉시시전' },
          { name: '서리 광선', icon: 'spell_frost_freezingbreath', priority: 'medium', usage: '채널링' },
          { name: '눈보라', icon: 'spell_frost_icestorm', priority: 'low', usage: '쿨마다' }
        ]
      },
      aoe: {
        skills: [
          { name: '얼음 보주', icon: 'spell_frost_orb', priority: 'high', usage: '설치' },
          { name: '눈보라', icon: 'spell_frost_icestorm', priority: 'high', usage: '광역' },
          { name: '얼음회오리', icon: 'ability_warlock_burningembersblue', priority: 'high', usage: '즉시 광역' },
          { name: '혜성 폭풍', icon: 'spell_mage_cometstorm', priority: 'high', usage: '광역 폭발' }
        ]
      },
      cooldowns: [
        { name: '얼음 핏줄', icon: 'spell_frost_coldhearted', usage: '3분 쿨다운' },
        { name: '얼음 보주', icon: 'spell_frost_orb', usage: '1분 쿨다운' },
        { name: '차가운 피', icon: 'spell_frost_wizardmark', usage: '2분 쿨다운' }
      ]
    }
  },

  // 수도사 로테이션
  monk: {
    양조: {
      opener: {
        skills: [
          { name: '후려차기', icon: 'ability_monk_roundhousekick', priority: 'high', usage: '도발' },
          { name: '맥주통 휘두르기', icon: 'ability_monk_kegsmash', priority: 'high', usage: '디버프' },
          { name: '화염 숨결', icon: 'ability_monk_breathoffire', priority: 'high', usage: '도트' },
          { name: '범의 장풍', icon: 'ability_monk_palmstrike', priority: 'medium', usage: '기력 소모' },
          { name: '흑우 맥주', icon: 'achievement_brewery_2', priority: 'medium', usage: '순삭 유지' },
          { name: '해악 축출', icon: 'ability_rogue_imrovedrecuperate', priority: 'low', usage: '정화' }
        ]
      },
      main: {
        skills: [
          { name: '맥주통 휘두르기', icon: 'ability_monk_kegsmash', priority: 'high', usage: '쿨마다' },
          { name: '화염 숨결', icon: 'ability_monk_breathoffire', priority: 'high', usage: '도트 유지' },
          { name: '범의 장풍', icon: 'ability_monk_palmstrike', priority: 'medium', usage: '기력 소모' },
          { name: '흑우 맥주', icon: 'achievement_brewery_2', priority: 'high', usage: '순삭 유지', condition: '스택 < 3' },
          { name: '불의 숨결', icon: 'spell_fire_fireball', priority: 'low', usage: '도트 갱신' }
        ]
      },
      aoe: {
        skills: [
          { name: '맥주통 휘두르기', icon: 'ability_monk_kegsmash', priority: 'high', usage: '광역' },
          { name: '폭발 맥주통', icon: 'inv_misc_beer_06', priority: 'high', usage: '광역 폭발' },
          { name: '화염 숨결', icon: 'ability_monk_breathoffire', priority: 'high', usage: '전방 광역' },
          { name: '회전 학다리차기', icon: 'ability_monk_cranekick_new', priority: 'medium', usage: '광역' }
        ]
      },
      cooldowns: [
        { name: '강화주', icon: 'ability_monk_fortifyingale_new', usage: '7분 쿨다운' },
        { name: '천신주', icon: 'inv_drink_05', usage: '3분 쿨다운' },
        { name: '선풍각', icon: 'ability_monk_rushingjadewind', usage: '6초 쿨다운' }
      ]
    },
    풍운: {
      opener: {
        skills: [
          { name: '폭풍과 대지와 불', icon: 'spell_nature_giftofthewaterspirit', priority: 'high', usage: '클론 소환' },
          { name: '범의 욕망', icon: 'ability_monk_tigerslust', priority: 'high', usage: '버프' },
          { name: '해오름차기', icon: 'ability_monk_risingsunkick', priority: 'high', usage: '디버프' },
          { name: '분노의 주먹', icon: 'monk_ability_fistoffury', priority: 'high', usage: '채널링' },
          { name: '회전 학다리차기', icon: 'ability_monk_cranekick_new', priority: 'medium', usage: '광역' },
          { name: '범의 장풍', icon: 'ability_monk_palmstrike', priority: 'medium', usage: '기력 소모' }
        ]
      },
      main: {
        skills: [
          { name: '해오름차기', icon: 'ability_monk_risingsunkick', priority: 'high', usage: '디버프 유지' },
          { name: '분노의 주먹', icon: 'monk_ability_fistoffury', priority: 'high', usage: '쿨마다' },
          { name: '회전 학다리차기', icon: 'ability_monk_cranekick_new', priority: 'medium', usage: '진기 소모' },
          { name: '흑호각', icon: 'ability_monk_blackoutkick', priority: 'medium', usage: '교직 소모' },
          { name: '범의 장풍', icon: 'ability_monk_palmstrike', priority: 'low', usage: '기력 소모' }
        ]
      },
      aoe: {
        skills: [
          { name: '분노의 주먹', icon: 'monk_ability_fistoffury', priority: 'high', usage: '광역 채널링' },
          { name: '회전 학다리차기', icon: 'ability_monk_cranekick_new', priority: 'high', usage: '광역' },
          { name: '소용돌이차기', icon: 'ability_monk_roundhousekick', priority: 'high', usage: '회전 광역' },
          { name: '표표타', icon: 'inv_pandarenserpentmount_white', priority: 'medium', usage: '광역' }
        ]
      },
      cooldowns: [
        { name: '폭풍과 대지와 불', icon: 'spell_nature_giftofthewaterspirit', usage: '2분 쿨다운' },
        { name: '범의 욕망', icon: 'ability_monk_tigerslust', usage: '1.5분 쿨다운' },
        { name: '백호 원령 소환', icon: 'monk_stance_whitetiger', usage: '3분 쿨다운' }
      ]
    },
    운무: {
      opener: {
        skills: [
          { name: '재활의 안개', icon: 'ability_monk_renewingmists', priority: 'high', usage: '핫 적용' },
          { name: '포용의 안개', icon: 'spell_monk_envelopingmist', priority: 'high', usage: '강력한 핫' },
          { name: '해오름차기', icon: 'ability_monk_risingsunkick', priority: 'medium', usage: '데미지' },
          { name: '정수의 샘', icon: 'ability_monk_essencefont', priority: 'high', usage: '광역 힐' },
          { name: '흑호각', icon: 'ability_monk_blackoutkick', priority: 'medium', usage: '교직 소모' },
          { name: '비취 바람', icon: 'ability_monk_rushingjadewind', priority: 'low', usage: '광역 핫' }
        ]
      },
      main: {
        skills: [
          { name: '재활의 안개', icon: 'ability_monk_renewingmists', priority: 'high', usage: '핫 유지' },
          { name: '포용의 안개', icon: 'spell_monk_envelopingmist', priority: 'high', usage: '탱커 핫' },
          { name: '정수의 샘', icon: 'ability_monk_essencefont', priority: 'medium', usage: '광역 힐' },
          { name: '생기 충전', icon: 'ability_monk_vivify', priority: 'medium', usage: '즉시 힐' },
          { name: '비취 바람', icon: 'ability_monk_rushingjadewind', priority: 'low', usage: '광역 핫', loop: true }
        ]
      },
      aoe: {
        skills: [
          { name: '정수의 샘', icon: 'ability_monk_essencefont', priority: 'high', usage: '광역 힐' },
          { name: '소생의 안개', icon: 'spell_monk_mistweave', priority: 'high', usage: '대량 힐' },
          { name: '비취 바람', icon: 'ability_monk_rushingjadewind', priority: 'high', usage: '광역 핫' },
          { name: '재활의 안개', icon: 'ability_monk_renewingmists', priority: 'medium', usage: '확산' }
        ]
      },
      cooldowns: [
        { name: '되살리기', icon: 'ability_monk_revival', usage: '3분 쿨다운' },
        { name: '고양', icon: 'monk_ability_transcendence', usage: '3분 쿨다운' },
        { name: '번개 차', icon: 'ability_monk_thunderfocustea', usage: '30초 쿨다운' }
      ]
    }
  },

  // 도적 로테이션
  rogue: {
    암살: {
      opener: {
        skills: [
          { name: '구멍 뚫기', icon: 'ability_rogue_shadowstep', priority: 'high', usage: '은신 시작' },
          { name: '가르기', icon: 'ability_rogue_garrote', priority: 'high', usage: '침묵 + 도트' },
          { name: '독칼', icon: 'ability_rogue_poisonblade', priority: 'high', usage: '독 적용' },
          { name: '파열', icon: 'ability_rogue_rupture', priority: 'high', usage: '출혈' },
          { name: '절개', icon: 'ability_rogue_mutilate', priority: 'medium', usage: '연계점' },
          { name: '독살', icon: 'ability_rogue_dualweild', priority: 'high', usage: '마무리' }
        ]
      },
      main: {
        skills: [
          { name: '가르기', icon: 'ability_rogue_garrote', priority: 'high', usage: '유지' },
          { name: '파열', icon: 'ability_rogue_rupture', priority: 'high', usage: '5연계 유지' },
          { name: '절개', icon: 'ability_rogue_mutilate', priority: 'medium', usage: '연계점 생성' },
          { name: '독살', icon: 'ability_rogue_dualweild', priority: 'high', usage: '5연계 소모' },
          { name: '맹독 칼날', icon: 'ability_rogue_venomouswounds', priority: 'medium', usage: '에너지 높을 때' }
        ]
      },
      aoe: {
        skills: [
          { name: '진홍색 폭풍', icon: 'ability_rogue_crimsonvial', priority: 'high', usage: '광역' },
          { name: '칼부림', icon: 'ability_rogue_fanofknives', priority: 'high', usage: '연계점' },
          { name: '파열', icon: 'ability_rogue_rupture', priority: 'medium', usage: '주요 대상' },
          { name: '독 폭탄', icon: 'spell_shadow_lifedrain02', priority: 'high', usage: '광역 독' }
        ]
      },
      cooldowns: [
        { name: '숙련의 극치', icon: 'ability_creature_cursed_02', usage: '2분 쿨다운' },
        { name: '피의 격노', icon: 'ability_rogue_vendetta', usage: '2분 쿨다운' },
        { name: '그림자 걸음', icon: 'ability_rogue_shadowstep', usage: '1분 쿨다운' }
      ]
    },
    무법: {
      opener: {
        skills: [
          { name: '아드레날린 촉진', icon: 'spell_shadow_shadowworddominate', priority: 'high', usage: '버스트' },
          { name: '칼날 폭풍', icon: 'ability_rogue_bladedancing', priority: 'high', usage: '버프' },
          { name: '권총 사격', icon: 'ability_hunter_mastermarksman', priority: 'high', usage: '연계점' },
          { name: '뼈주사위', icon: 'inv_misc_dice_02', priority: 'high', usage: '버프' },
          { name: '난도질', icon: 'inv_sword_97', priority: 'medium', usage: '연계점' },
          { name: '급송', icon: 'ability_rogue_dispatch', priority: 'high', usage: '마무리' }
        ]
      },
      main: {
        skills: [
          { name: '뼈주사위', icon: 'inv_misc_dice_02', priority: 'high', usage: '버프 유지' },
          { name: '매복', icon: 'ability_rogue_ambush', priority: 'high', usage: '기회 소모' },
          { name: '난도질', icon: 'inv_sword_97', priority: 'medium', usage: '연계점' },
          { name: '권총 사격', icon: 'ability_hunter_mastermarksman', priority: 'medium', usage: '원거리' },
          { name: '급송', icon: 'ability_rogue_dispatch', priority: 'high', usage: '5연계' }
        ]
      },
      aoe: {
        skills: [
          { name: '칼날 폭풍', icon: 'ability_rogue_bladedancing', priority: 'high', usage: '광역 버프' },
          { name: '칼날 쇄도', icon: 'ability_warrior_bladestorm', priority: 'high', usage: '광역' },
          { name: '포탄 사격', icon: 'ability_vehicle_siegeenginecharge', priority: 'medium', usage: '광역 폭발' },
          { name: '난도질', icon: 'inv_sword_97', priority: 'low', usage: '필러' }
        ]
      },
      cooldowns: [
        { name: '아드레날린 촉진', icon: 'spell_shadow_shadowworddominate', usage: '3분 쿨다운' },
        { name: '칼날 폭풍', icon: 'ability_rogue_bladedancing', usage: '30초 쿨다운' },
        { name: '구르기', icon: 'ability_rogue_rollthebones', usage: '패시브' }
      ]
    },
    잠행: {
      opener: {
        skills: [
          { name: '어둠의 춤', icon: 'ability_rogue_shadowdance', priority: 'high', usage: '은신 버프' },
          { name: '그림자 일격', icon: 'ability_rogue_shadowstrike', priority: 'high', usage: '배후' },
          { name: '어둠칼날', icon: 'inv_knife_1h_grimbatol_d_03', priority: 'high', usage: '버스트' },
          { name: '비열한 습격', icon: 'spell_shadow_ritualofsacrifice', priority: 'high', usage: '스턴' },
          { name: '회피', icon: 'spell_shadow_shadowwalk', priority: 'medium', usage: '연계점' },
          { name: '절개', icon: 'spell_shadow_lifedrain', priority: 'high', usage: '마무리' }
        ]
      },
      main: {
        skills: [
          { name: '어둠의 춤', icon: 'ability_rogue_shadowdance', priority: 'high', usage: '쿨마다', condition: '준비됨' },
          { name: '그림자 일격', icon: 'ability_rogue_shadowstrike', priority: 'high', usage: '은신 중' },
          { name: '후방 공격', icon: 'ability_rogue_backstab', priority: 'medium', usage: '연계점' },
          { name: '절개', icon: 'spell_shadow_lifedrain', priority: 'high', usage: '5연계' },
          { name: '그림자 기술', icon: 'spell_shadow_possession', priority: 'low', usage: '버프 유지' }
        ]
      },
      aoe: {
        skills: [
          { name: '어둠의 춤', icon: 'ability_rogue_shadowdance', priority: 'high', usage: '버스트' },
          { name: '수리검 폭풍', icon: 'spell_shadow_mindsteal', priority: 'high', usage: '광역' },
          { name: '검은 가루', icon: 'inv_misc_powder_black', priority: 'high', usage: '광역 절개' },
          { name: '그림자 일격', icon: 'ability_rogue_shadowstrike', priority: 'medium', usage: '은신 중' }
        ]
      },
      cooldowns: [
        { name: '어둠의 춤', icon: 'ability_rogue_shadowdance', usage: '1분 쿨다운' },
        { name: '어둠칼날', icon: 'inv_knife_1h_grimbatol_d_03', usage: '3분 쿨다운' },
        { name: '비밀 기술', icon: 'ability_rogue_masterofsubtlety', usage: '2분 쿨다운' }
      ]
    }
  },

  // 주술사 로테이션
  shaman: {
    정기: {
      opener: {
        skills: [
          { name: '화염 충격', icon: 'spell_fire_flameshock', priority: 'high', usage: '도트' },
          { name: '정기의 무기', icon: 'spell_shaman_unleashweapon_wind', priority: 'high', usage: '버프' },
          { name: '야수 정령', icon: 'spell_shaman_feralspirit', priority: 'high', usage: '소환' },
          { name: '용암 채찍', icon: 'spell_shaman_lavash', priority: 'high', usage: '핫 스트릭' },
          { name: '번개 화살', icon: 'spell_nature_lightning', priority: 'medium', usage: '시전' },
          { name: '대지 충격', icon: 'spell_nature_earthshock', priority: 'high', usage: '소모' }
        ]
      },
      main: {
        skills: [
          { name: '화염 충격', icon: 'spell_fire_flameshock', priority: 'high', usage: '도트 유지' },
          { name: '용암 채찍', icon: 'spell_shaman_lavash', priority: 'high', usage: '핫 스트릭' },
          { name: '번개 화살', icon: 'spell_nature_lightning', priority: 'medium', usage: '충전' },
          { name: '대지 충격', icon: 'spell_nature_earthshock', priority: 'high', usage: '소용돌이 60+' },
          { name: '정기 폭발', icon: 'spell_nature_cyclone', priority: 'high', usage: '즉시시전', condition: '소용돌이 높음' }
        ]
      },
      aoe: {
        skills: [
          { name: '화염 충격', icon: 'spell_fire_flameshock', priority: 'high', usage: '다중 도트' },
          { name: '연쇄 번개', icon: 'spell_nature_chainlightning', priority: 'high', usage: '광역' },
          { name: '지진', icon: 'spell_shaman_earthquake', priority: 'high', usage: '설치' },
          { name: '용암 폭발', icon: 'spell_shaman_lavaburst', priority: 'medium', usage: '광역' }
        ]
      },
      cooldowns: [
        { name: '정기의 무기', icon: 'spell_shaman_unleashweapon_wind', usage: '2분 쿨다운' },
        { name: '야수 정령', icon: 'spell_shaman_feralspirit', usage: '2.5분 쿨다운' },
        { name: '폭풍의 정령', icon: 'spell_lightning_lightningbolt01', usage: '2.5분 쿨다운' }
      ]
    },
    고양: {
      opener: {
        skills: [
          { name: '화염 충격', icon: 'spell_fire_flameshock', priority: 'high', usage: '도트' },
          { name:  'doom의 바람', icon: 'ability_ironmaidens_swirlingvortex', priority: 'high', usage: '버프' },
          { name: '번개 화살', icon: 'spell_nature_lightning', priority: 'medium', usage: '원소 폭발' },
          { name: '폭풍수리', icon: 'ability_shaman_stormstrike', priority: 'high', usage: '강화' },
          { name: '용암 채찍', icon: 'spell_shaman_lavash', priority: 'high', usage: '원소' },
          { name: '정기의 손아귀', icon: 'spell_shaman_staticshock', priority: 'high', usage: '소모' }
        ]
      },
      main: {
        skills: [
          { name: '화염 충격', icon: 'spell_fire_flameshock', priority: 'high', usage: '도트 유지' },
          { name: '폭풍수리', icon: 'ability_shaman_stormstrike', priority: 'high', usage: '쿨마다' },
          { name: '용암 채찍', icon: 'spell_shaman_lavash', priority: 'high', usage: '5스택' },
          { name: '번개 화살', icon: 'spell_nature_lightning', priority: 'medium', usage: '소용돌이 생성' },
          { name: '정기의 손아귀', icon: 'spell_shaman_staticshock', priority: 'high', usage: '소용돌이 소모' }
        ]
      },
      aoe: {
        skills: [
          { name: '화염 충격', icon: 'spell_fire_flameshock', priority: 'high', usage: '확산' },
          { name: '화염 폭풍', icon: 'spell_shaman_firenova', priority: 'high', usage: '광역 폭발' },
          { name: '연쇄 번개', icon: 'spell_nature_chainlightning', priority: 'high', usage: '광역' },
          { name: '충돌', icon: 'ability_shaman_crash', priority: 'medium', usage: '광역' }
        ]
      },
      cooldowns: [
        { name: 'doom의 바람', icon: 'ability_ironmaidens_swirlingvortex', usage: '1분 쿨다운' },
        { name: '야수 정령', icon: 'spell_shaman_feralspirit', usage: '2분 쿨다운' },
        { name: '승천', icon: 'spell_shaman_spewlava', usage: '3분 쿨다운' }
      ]
    },
    복원: {
      opener: {
        skills: [
          { name: '성난 파도', icon: 'spell_nature_riptide', priority: 'high', usage: '핫' },
          { name: '치유의 비', icon: 'spell_nature_giftofthewaterspirit', priority: 'high', usage: '설치' },
          { name: '치유의 물결', icon: 'spell_nature_magicimmunity', priority: 'medium', usage: '힐' },
          { name: '연쇄 치유', icon: 'spell_nature_healingwavegreater', priority: 'high', usage: '광역 힐' },
          { name: '치유의 토템', icon: 'spell_nature_healingtotem', priority: 'medium', usage: '설치' },
          { name: '대지의 방벽', icon: 'spell_nature_stoneskintotem', priority: 'low', usage: '방어' }
        ]
      },
      main: {
        skills: [
          { name: '성난 파도', icon: 'spell_nature_riptide', priority: 'high', usage: '핫 유지' },
          { name: '치유의 물결', icon: 'spell_nature_magicimmunity', priority: 'medium', usage: '빠른 힐' },
          { name: '치유의 비', icon: 'spell_nature_giftofthewaterspirit', priority: 'medium', usage: '광역', condition: '피해 증가' },
          { name: '연쇄 치유', icon: 'spell_nature_healingwavegreater', priority: 'high', usage: '광역' },
          { name: '치유의 해일', icon: 'spell_shaman_tidalwaves', priority: 'low', usage: '강력한 힐' }
        ]
      },
      aoe: {
        skills: [
          { name: '치유의 비', icon: 'spell_nature_giftofthewaterspirit', priority: 'high', usage: '설치' },
          { name: '성난 파도', icon: 'spell_nature_riptide', priority: 'high', usage: '다중 핫' },
          { name: '연쇄 치유', icon: 'spell_nature_healingwavegreater', priority: 'high', usage: '광역' },
          { name: '영혼 연결 토템', icon: 'spell_shaman_spiritlink', priority: 'high', usage: '균등화' }
        ]
      },
      cooldowns: [
        { name: '치유의 해일 토템', icon: 'ability_shaman_healingtide', usage: '3분 쿨다운' },
        { name: '영혼 연결 토템', icon: 'spell_shaman_spiritlink', usage: '3분 쿨다운' },
        { name: '승천', icon: 'spell_shaman_spewlava', usage: '3분 쿨다운' }
      ]
    }
  },

  // 흑마법사 로테이션
  warlock: {
    고통: {
      opener: {
        skills: [
          { name: '고뇌', icon: 'spell_shadow_unstableaffliction_3', priority: 'high', usage: '도트' },
          { name: '부패', icon: 'spell_shadow_abominationexplosion', priority: 'high', usage: '도트' },
          { name: '불안정한 고통', icon: 'spell_shadow_unstableaffliction_2', priority: 'high', usage: '도트' },
          { name: '유령 출몰', icon: 'spell_shadow_possession', priority: 'high', usage: '버스트' },
          { name: '어둠의 영혼', icon: 'spell_warlock_demonsoul', priority: 'high', usage: '버스트' },
          { name: '흡수', icon: 'spell_shadow_shadowmend', priority: 'medium', usage: '필러' }
        ]
      },
      main: {
        skills: [
          { name: '고뇌', icon: 'spell_shadow_unstableaffliction_3', priority: 'high', usage: '유지' },
          { name: '부패', icon: 'spell_shadow_abominationexplosion', priority: 'high', usage: '유지' },
          { name: '불안정한 고통', icon: 'spell_shadow_unstableaffliction_2', priority: 'high', usage: '유지' },
          { name: '유령 출몰', icon: 'spell_shadow_possession', priority: 'high', usage: '쿨마다' },
          { name: '흡수', icon: 'spell_shadow_shadowmend', priority: 'low', usage: '필러' },
          { name: '악의 씨앗', icon: 'spell_shadow_seedofdestruction', priority: 'medium', usage: '단일 대상' }
        ]
      },
      aoe: {
        skills: [
          { name: '악의 씨앗', icon: 'spell_shadow_seedofdestruction', priority: 'high', usage: '광역 폭발' },
          { name: '고뇌', icon: 'spell_shadow_unstableaffliction_3', priority: 'medium', usage: '다중 도트' },
          { name: '부패', icon: 'spell_shadow_abominationexplosion', priority: 'medium', usage: '다중 도트' },
          { name: '괴로움', icon: 'spell_shadow_curseofsargeras', priority: 'high', usage: '광역' }
        ]
      },
      cooldowns: [
        { name: '어둠의 영혼', icon: 'spell_warlock_demonsoul', usage: '2분 쿨다운' },
        { name: '암흑시선 소환', icon: 'achievement_boss_bigbadwolf', usage: '3분 쿨다운' },
        { name: '악의 씨앗', icon: 'spell_shadow_seedofdestruction', usage: '상황별' }
      ]
    },
    악마: {
      opener: {
        skills: [
          { name: '악마의 힘 부여', icon: 'spell_shadow_metamorphosis', priority: 'high', usage: '버프' },
          { name: '악마 사냥', icon: 'spell_warlock_calldreadstalkers', priority: 'high', usage: '소환' },
          { name: '손 물어뜯기', icon: 'spell_shadow_summonfelguard', priority: 'high', usage: '공격' },
          { name: '파멸의 부름', icon: 'ability_warlock_eradication', priority: 'high', usage: '데미지' },
          { name: '지옥불화살', icon: 'spell_shadow_demonicpower', priority: 'medium', usage: '영혼 조각' },
          { name: '임프 무리', icon: 'spell_shadow_imp', priority: 'medium', usage: '소환' }
        ]
      },
      main: {
        skills: [
          { name: '악마 사냥', icon: 'spell_warlock_calldreadstalkers', priority: 'high', usage: '쿨마다' },
          { name: '손 물어뜯기', icon: 'spell_shadow_summonfelguard', priority: 'high', usage: '펠가드' },
          { name: '파멸의 부름', icon: 'ability_warlock_eradication', priority: 'medium', usage: '조각 소모' },
          { name: '지옥불화살', icon: 'spell_shadow_demonicpower', priority: 'low', usage: '조각 생성' },
          { name: '임프 무리', icon: 'spell_shadow_imp', priority: 'medium', usage: '조각 소모' }
        ]
      },
      aoe: {
        skills: [
          { name: '파괴', icon: 'ability_warlock_impoweredimp', priority: 'high', usage: '광역' },
          { name: '빌프레드의 소환', icon: 'spell_shadow_summonimp', priority: 'high', usage: '광역 소환' },
          { name: '지옥불화살', icon: 'spell_shadow_demonicpower', priority: 'medium', usage: '조각 생성' },
          { name: '임프 무리', icon: 'spell_shadow_imp', priority: 'high', usage: '광역 소환' }
        ]
      },
      cooldowns: [
        { name: '악마의 힘 부여', icon: 'spell_shadow_metamorphosis', usage: '1.5분 쿨다운' },
        { name: '공허의 군주 소환', icon: 'spell_shadow_summonvoidwalker', usage: '3분 쿨다운' },
        { name: '그림토템', icon: 'spell_warlock_grimoireofservice', usage: '2분 쿨다운' }
      ]
    },
    파괴: {
      opener: {
        skills: [
          { name: '제물', icon: 'spell_fire_immolation', priority: 'high', usage: '도트' },
          { name: '어둠의 영혼', icon: 'spell_warlock_demonsoul', priority: 'high', usage: '버스트' },
          { name: '대혼란', icon: 'spell_fire_fireball02', priority: 'high', usage: '강화' },
          { name: '혼돈의 화살', icon: 'spell_fire_soul_burn', priority: 'high', usage: '대미지' },
          { name: '소각', icon: 'spell_fire_burnout', priority: 'medium', usage: '시전' },
          { name: '화염파괴', icon: 'spell_fire_immolation', priority: 'high', usage: '즉시시전' }
        ]
      },
      main: {
        skills: [
          { name: '제물', icon: 'spell_fire_immolation', priority: 'high', usage: '도트 유지' },
          { name: '혼돈의 화살', icon: 'spell_fire_soul_burn', priority: 'high', usage: '조각 소모' },
          { name: '화염파괴', icon: 'spell_fire_immolation', priority: 'high', usage: '즉시시전' },
          { name: '소각', icon: 'spell_fire_burnout', priority: 'medium', usage: '조각 생성' },
          { name: '대혼란', icon: 'spell_fire_fireball02', priority: 'medium', usage: '강화', condition: '준비됨' }
        ]
      },
      aoe: {
        skills: [
          { name: '대재앙', icon: 'ability_warlock_cataclysm', priority: 'high', usage: '광역 도트' },
          { name: '지옥불정', icon: 'spell_fire_infernalbolt', priority: 'high', usage: '광역' },
          { name: '불의 비', icon: 'spell_shadow_rainoffire', priority: 'high', usage: '설치' },
          { name: '대혼란', icon: 'spell_fire_fireball02', priority: 'medium', usage: '강화' }
        ]
      },
      cooldowns: [
        { name: '어둠의 영혼', icon: 'spell_warlock_demonsoul', usage: '2분 쿨다운' },
        { name: '대혼란', icon: 'spell_fire_fireball02', usage: '45초 쿨다운' },
        { name: '지옥불정 소환', icon: 'spell_shadow_summoninfernal', usage: '3분 쿨다운' }
      ]
    }
  },

  // 기원사 로테이션
  evoker: {
    황폐: {
      opener: {
        skills: [
          { name: '화염숨결', icon: 'ability_evoker_firebreath', priority: 'high', usage: '충전' },
          { name: '산산조각', icon: 'ability_evoker_disintegrate', priority: 'high', usage: '채널링' },
          { name: '정수 파열', icon: 'ability_evoker_essenceburst', priority: 'high', usage: '즉시시전' },
          { name: '영원의 쇄도', icon: 'ability_evoker_eternitysurge', priority: 'high', usage: '충전' },
          { name: '푸른 타격', icon: 'ability_evoker_azurestrike', priority: 'medium', usage: '즉시시전' },
          { name: '생명력 분출', icon: 'ability_evoker_livingflame', priority: 'low', usage: '필러' }
        ]
      },
      main: {
        skills: [
          { name: '화염숨결', icon: 'ability_evoker_firebreath', priority: 'high', usage: '힘차게', condition: '힘차게' },
          { name: '영원의 쇄도', icon: 'ability_evoker_eternitysurge', priority: 'high', usage: '힘차게', condition: '힘차게' },
          { name: '산산조각', icon: 'ability_evoker_disintegrate', priority: 'high', usage: '채널링' },
          { name: '정수 파열', icon: 'ability_evoker_essenceburst', priority: 'high', usage: '즉시시전' },
          { name: '생명력 분출', icon: 'ability_evoker_livingflame', priority: 'low', usage: '필러' }
        ]
      },
      aoe: {
        skills: [
          { name: '화염숨결', icon: 'ability_evoker_firebreath', priority: 'high', usage: '광역' },
          { name: '영원의 쇄도', icon: 'ability_evoker_eternitysurge', priority: 'high', usage: '광역' },
          { name: '비룡의 격노', icon: 'ability_evoker_dragonrage', priority: 'high', usage: '버스트' },
          { name: '푸른 타격', icon: 'ability_evoker_azurestrike', priority: 'medium', usage: '광역' }
        ]
      },
      cooldowns: [
        { name: '비룡의 격노', icon: 'ability_evoker_dragonrage', usage: '2분 쿨다운' },
        { name: '심호흡', icon: 'ability_evoker_deepbreath', usage: '2분 쿨다운' },
        { name: '용의 피', icon: 'ability_evoker_blessing', usage: '1분 쿨다운' }
      ]
    },
    보존: {
      opener: {
        skills: [
          { name: '메아리', icon: 'ability_evoker_echo', priority: 'high', usage: '버프' },
          { name: '회전', icon: 'ability_evoker_reversion', priority: 'high', usage: '핫' },
          { name: '꿈의 숨결', icon: 'ability_evoker_dreambreath', priority: 'high', usage: '광역 힐' },
          { name: '영혼 꽃', icon: 'ability_evoker_spiritbloom', priority: 'medium', usage: '단일 힐' },
          { name: '시간 팽창', icon: 'ability_evoker_timedilation', priority: 'medium', usage: '버프 연장' },
          { name: '에메랄드 꽃', icon: 'ability_evoker_emeraldblossom', priority: 'low', usage: '광역 핫' }
        ]
      },
      main: {
        skills: [
          { name: '메아리', icon: 'ability_evoker_echo', priority: 'high', usage: '탱커 버프' },
          { name: '회전', icon: 'ability_evoker_reversion', priority: 'high', usage: '핫 유지' },
          { name: '꿈의 숨결', icon: 'ability_evoker_dreambreath', priority: 'medium', usage: '힘차게' },
          { name: '영혼 꽃', icon: 'ability_evoker_spiritbloom', priority: 'medium', usage: '힘차게' },
          { name: '생명력 분출', icon: 'ability_evoker_livingflame', priority: 'low', usage: '필러' }
        ]
      },
      aoe: {
        skills: [
          { name: '꿈의 숨결', icon: 'ability_evoker_dreambreath', priority: 'high', usage: '광역 힐' },
          { name: '에메랄드 꽃', icon: 'ability_evoker_emeraldblossom', priority: 'high', usage: '광역 핫' },
          { name: '시간 왜곡', icon: 'ability_evoker_temporalanomaly', priority: 'high', usage: '광역 회복' },
          { name: '영혼 꽃', icon: 'ability_evoker_spiritbloom', priority: 'medium', usage: '연쇄 힐' }
        ]
      },
      cooldowns: [
        { name: '되감기', icon: 'ability_evoker_rewind', usage: '4분 쿨다운' },
        { name: '시간 정지', icon: 'ability_evoker_stasis', usage: '1.5분 쿨다운' },
        { name: '꿈의 비행', icon: 'ability_evoker_dreamflight', usage: '2분 쿨다운' }
      ]
    },
    증강: {
      opener: {
        skills: [
          { name: '리빙 플레임', icon: 'ability_evoker_livingflame', priority: 'high', usage: '정수 폭발' },
          { name: '검은 주문', icon: 'ability_evoker_blackattunement', priority: 'high', usage: '버프' },
          { name: '영원쇄도', icon: 'ability_evoker_eternitysurge', priority: 'high', usage: '힘차게' },
          { name: '화염숨결', icon: 'ability_evoker_firebreath', priority: 'high', usage: '힘차게' },
          { name: '시간의 상처', icon: 'ability_evoker_temporalwound', priority: 'medium', usage: '도트' },
          { name: '격변', icon: 'ability_evoker_upheaval', priority: 'medium', usage: '폭발' }
        ]
      },
      main: {
        skills: [
          { name: '격변', icon: 'ability_evoker_upheaval', priority: 'high', usage: '쿨마다' },
          { name: '화염숨결', icon: 'ability_evoker_firebreath', priority: 'high', usage: '힘차게' },
          { name: '영원쇄도', icon: 'ability_evoker_eternitysurge', priority: 'high', usage: '힘차게' },
          { name: '리빙 플레임', icon: 'ability_evoker_livingflame', priority: 'medium', usage: '정수 생성' },
          { name: '시간의 상처', icon: 'ability_evoker_temporalwound', priority: 'low', usage: '도트 유지' }
        ]
      },
      aoe: {
        skills: [
          { name: '격변', icon: 'ability_evoker_upheaval', priority: 'high', usage: '광역 폭발' },
          { name: '화염숨결', icon: 'ability_evoker_firebreath', priority: 'high', usage: '광역' },
          { name: '영원쇄도', icon: 'ability_evoker_eternitysurge', priority: 'high', usage: '광역' },
          { name: '푸른타격', icon: 'ability_evoker_azurestrike', priority: 'medium', usage: '광역' }
        ]
      },
      cooldowns: [
        { name: '축복', icon: 'ability_evoker_blessing', usage: '2분 쿨다운' },
        { name: '숨결 무기', icon: 'ability_evoker_breathweapon', usage: '30초 쿨다운' },
        { name: '시간 도약', icon: 'ability_evoker_timeskip', usage: '3분 쿨다운' }
      ]
    }
  },

  // 드루이드 로테이션
  druid: {
    조화: {
      opener: {
        skills: [
          { name: '달빛섬광', icon: 'spell_nature_starfall', priority: 'high', usage: '도트' },
          { name: '태양섬광', icon: 'spell_nature_wrathv2', priority: 'high', usage: '도트' },
          { name: '화신', icon: 'spell_druid_incarnation', priority: 'high', usage: '버스트' },
          { name: '천공의 정렬', icon: 'spell_nature_natureguardian', priority: 'high', usage: '버프' },
          { name: '별빛섬광', icon: 'spell_arcane_starfire', priority: 'medium', usage: '시전' },
          { name: '별똥별', icon: 'spell_arcane_arcane03', priority: 'high', usage: '즉시시전' }
        ]
      },
      main: {
        skills: [
          { name: '달빛섬광', icon: 'spell_nature_starfall', priority: 'high', usage: '도트 유지' },
          { name: '태양섬광', icon: 'spell_nature_wrathv2', priority: 'high', usage: '도트 유지' },
          { name: '별똥별', icon: 'spell_arcane_arcane03', priority: 'high', usage: '천공 자원 소모' },
          { name: '별빛섬광', icon: 'spell_arcane_starfire', priority: 'medium', usage: '일식' },
          { name: '천벌', icon: 'spell_nature_abolishmagic', priority: 'medium', usage: '월식' }
        ]
      },
      aoe: {
        skills: [
          { name: '별빛비', icon: 'spell_arcane_starfall', priority: 'high', usage: '광역' },
          { name: '달빛섬광', icon: 'spell_nature_starfall', priority: 'high', usage: '다중 도트' },
          { name: '태양섬광', icon: 'spell_nature_wrathv2', priority: 'medium', usage: '다중 도트' },
          { name: '태양광선', icon: 'spell_nature_wrathv2', priority: 'high', usage: '광역' }
        ]
      },
      cooldowns: [
        { name: '화신', icon: 'spell_druid_incarnation', usage: '3분 쿨다운' },
        { name: '천공의 정렬', icon: 'spell_nature_natureguardian', usage: '3분 쿨다운' },
        { name: '자연의 군대', icon: 'ability_druid_forceofnature', usage: '1분 쿨다운' }
      ]
    },
    야성: {
      opener: {
        skills: [
          { name: '도려내기', icon: 'ability_druid_mangle2', priority: 'high', usage: '도트' },
          { name: '호랑이의 분노', icon: 'ability_mount_jungletiger', priority: 'high', usage: '버스트' },
          { name: '광폭화', icon: 'ability_druid_berserk', priority: 'high', usage: '버스트' },
          { name: '갈퀴 발톱', icon: 'ability_druid_rake', priority: 'high', usage: '도트' },
          { name: '칼날 발톱', icon: 'inv_misc_monsterclaw_03', priority: 'medium', usage: '연계점' },
          { name: '흉포한 이빨', icon: 'ability_druid_ferociousbite', priority: 'high', usage: '마무리' }
        ]
      },
      main: {
        skills: [
          { name: '갈퀴 발톱', icon: 'ability_druid_rake', priority: 'high', usage: '도트 유지' },
          { name: '도려내기', icon: 'ability_druid_mangle2', priority: 'high', usage: '도트 유지' },
          { name: '칼날 발톱', icon: 'inv_misc_monsterclaw_03', priority: 'medium', usage: '연계점' },
          { name: '흉포한 이빨', icon: 'ability_druid_ferociousbite', priority: 'high', usage: '5연계' },
          { name: '달빛섬광', icon: 'spell_nature_starfall', priority: 'low', usage: '혈투 도트' }
        ]
      },
      aoe: {
        skills: [
          { name: '난타', icon: 'spell_druid_thrash', priority: 'high', usage: '광역 도트' },
          { name: '휘둘러치기', icon: 'ability_druid_swipe', priority: 'high', usage: '광역' },
          { name: '원시 분노', icon: 'ability_physical_taunt', priority: 'high', usage: '광역 마무리' },
          { name: '갈퀴 발톱', icon: 'ability_druid_rake', priority: 'medium', usage: '주요 대상' }
        ]
      },
      cooldowns: [
        { name: '호랑이의 분노', icon: 'ability_mount_jungletiger', usage: '30초 쿨다운' },
        { name: '광폭화', icon: 'ability_druid_berserk', usage: '3분 쿨다운' },
        { name: '화신', icon: 'spell_druid_incarnation', usage: '3분 쿨다운' }
      ]
    },
    수호: {
      opener: {
        skills: [
          { name: '달빛섬광', icon: 'spell_nature_starfall', priority: 'high', usage: '도트' },
          { name: '난타', icon: 'spell_druid_thrash', priority: 'high', usage: '도트' },
          { name: '짓이기기', icon: 'ability_druid_maul', priority: 'high', usage: '방어' },
          { name: '무쇠가죽', icon: 'spell_nature_spiritarmor', priority: 'high', usage: '방어 증가' },
          { name: '휘둘러치기', icon: 'ability_druid_swipe', priority: 'medium', usage: '광역' },
          { name: '광란', icon: 'ability_bullrush', priority: 'medium', usage: '분노 생성' }
        ]
      },
      main: {
        skills: [
          { name: '달빛섬광', icon: 'spell_nature_starfall', priority: 'high', usage: '도트 유지' },
          { name: '난타', icon: 'spell_druid_thrash', priority: 'high', usage: '스택 유지' },
          { name: '짓이기기', icon: 'ability_druid_maul', priority: 'high', usage: '분노 소모' },
          { name: '무쇠가죽', icon: 'spell_nature_spiritarmor', priority: 'high', usage: '방어 유지' },
          { name: '휘둘러치기', icon: 'ability_druid_swipe', priority: 'low', usage: '필러' }
        ]
      },
      aoe: {
        skills: [
          { name: '난타', icon: 'spell_druid_thrash', priority: 'high', usage: '광역 도트' },
          { name: '휘둘러치기', icon: 'ability_druid_swipe', priority: 'high', usage: '광역' },
          { name: '달빛섬광', icon: 'spell_nature_starfall', priority: 'medium', usage: '다중 도트' },
          { name: '무쇠가죽', icon: 'spell_nature_spiritarmor', priority: 'high', usage: '방어' }
        ]
      },
      cooldowns: [
        { name: '화신', icon: 'spell_druid_incarnation', usage: '3분 쿨다운' },
        { name: '야생의 돌진', icon: 'spell_druid_stamedingroar', usage: '3분 쿨다운' },
        { name: '생존 본능', icon: 'ability_druid_tigersroar', usage: '3분 쿨다운' }
      ]
    },
    회복: {
      opener: {
        skills: [
          { name: '급속 성장', icon: 'spell_nature_resistnature', priority: 'high', usage: '광역 핫' },
          { name: '회복', icon: 'spell_nature_rejuvenation', priority: 'high', usage: '핫' },
          { name: '피어나기', icon: 'inv_misc_herb_talandrasrose', priority: 'high', usage: '버프' },
          { name: '재생', icon: 'spell_nature_regeneration', priority: 'medium', usage: '강력한 핫' },
          { name: '천벌', icon: 'spell_nature_abolishmagic', priority: 'low', usage: '데미지' },
          { name: '생명나무', icon: 'ability_druid_improvedtreeform', priority: 'high', usage: '변신' }
        ]
      },
      main: {
        skills: [
          { name: '회복', icon: 'spell_nature_rejuvenation', priority: 'high', usage: '핫 유지' },
          { name: '피어나기', icon: 'inv_misc_herb_talandrasrose', priority: 'high', usage: '탱커' },
          { name: '급속 성장', icon: 'spell_nature_resistnature', priority: 'medium', usage: '광역', condition: '피해 증가' },
          { name: '재생', icon: 'spell_nature_regeneration', priority: 'medium', usage: '강력한 힐' },
          { name: '번영', icon: 'spell_druid_flourish', priority: 'low', usage: '핫 연장' }
        ]
      },
      aoe: {
        skills: [
          { name: '급속 성장', icon: 'spell_nature_resistnature', priority: 'high', usage: '광역 핫' },
          { name: '평온', icon: 'spell_nature_tranquility', priority: 'high', usage: '대량 힐' },
          { name: '번영', icon: 'spell_druid_flourish', priority: 'high', usage: '핫 연장' },
          { name: '회복', icon: 'spell_nature_rejuvenation', priority: 'medium', usage: '다중 핫' }
        ]
      },
      cooldowns: [
        { name: '평온', icon: 'spell_nature_tranquility', usage: '3분 쿨다운' },
        { name: '화신: 생명나무', icon: 'ability_druid_improvedtreeform', usage: '3분 쿨다운' },
        { name: '번영', icon: 'spell_druid_flourish', usage: '1.5분 쿨다운' }
      ]
    }
  }
};

// 로테이션 플로우 가져오기
export const getVisualRotation = (className, specName) => {
  return visualRotations[className]?.[specName] || null;
};