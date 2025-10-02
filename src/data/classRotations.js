// WoW 11.2 패치 직업별 상세 로테이션 데이터

export const classRotations = {
  deathknight: {
    혈기: {
      name: '혈기',
      role: '탱커',
      priority: '생존 > 위협 생성 > DPS',
      keyAbilities: [
        { name: '골수 분쇄', usage: '쿨마다 사용, 뼈 보호막 3중첩 유지', icon: 'ability_deathknight_marrowrend' },
        { name: '죽음의 일격', usage: '룬 마력 45+ 또는 치유 필요시', icon: 'ability_deathknight_deathstrike' },
        { name: '피의 끓음', usage: '광역 어그로 및 룬 회복', icon: 'ability_deathknight_bloodboil' },
        { name: '심장 강타', usage: '룬 소비 및 룬 마력 생성', icon: 'ability_deathknight_heartstrike' }
      ],
      opener: [
        '전투 시작 전 뼈 보호막 생성',
        '죽음의 손아귀로 풀링',
        '피의 끓음으로 도트 적용',
        '골수 분쇄로 뼈 보호막 유지',
        '룬 무기 춤 (큰 피해 예상시)'
      ],
      cooldowns: [
        { name: '룬 무기 춤', usage: '큰 피해 예상시 또는 DPS 버스트', icon: 'ability_deathknight_dancingruneblade' },
        { name: '흡혈', usage: '위급시 생존기', icon: 'ability_deathknight_vampiricblood' },
        { name: '대마법 지대', usage: '마법 피해 감소', icon: 'ability_deathknight_antimagiczone' },
        { name: '고어핀드의 손아귀', usage: '몹 그룹핑', icon: 'ability_deathknight_gorefiendgrasp' }
      ],
      tips: [
        '뼈 보호막은 항상 5중첩 이상 유지',
        '룬 마력은 95 이상 쌓이지 않도록 관리',
        '죽음과 부패는 광역딜 상황에서만 사용',
        'M+에서는 묘비 특성으로 생존력 향상'
      ]
    },
    냉기: {
      name: '냉기',
      role: '근접 딜러',
      priority: 'DPS 극대화 > 자원 관리 > 생존',
      keyAbilities: [
        { name: '절멸', usage: '100% 유지 필수', icon: 'ability_deathknight_obliterate' },
        { name: '냉기 돌풍', usage: '룬 마력 소비 주력기', icon: 'ability_deathknight_frostscythe' },
        { name: '서리 일격', usage: '살상 기계 발동시', icon: 'ability_deathknight_froststrike' },
        { name: '울부짖는 한파', usage: 'AoE 상황', icon: 'ability_deathknight_howlingblast' }
      ],
      opener: [
        '울부짖는 한파로 서리 열병 적용',
        '룬 무기 강화 시전',
        '얼음 기둥 시전',
        '절멸 연타',
        '룬 마력 70+ 시 서리 일격'
      ],
      cooldowns: [
        { name: '얼음 기둥', usage: '쿨마다, 룬 3개 이상일 때', icon: 'ability_deathknight_pillaroffrost' },
        { name: '룬 무기 강화', usage: '얼음 기둥과 함께', icon: 'ability_deathknight_empowerruneblade' },
        { name: '냉혹한 겨울', usage: 'AoE 버스트', icon: 'ability_deathknight_remorselesswinter' },
        { name: '절대 영도', usage: '2분 쿨다운 버스트', icon: 'ability_deathknight_frostpresence' }
      ],
      tips: [
        '양손 무기 빌드가 현재 메타',
        '살상 기계 발동을 놓치지 말 것',
        '얼음 기둥 중에는 절멸 우선순위',
        '깊은 상처 디버프 100% 유지'
      ]
    },
    부정: {
      name: '부정',
      role: '근접 딜러',
      priority: '도트 유지 > 버스트 타이밍 > 자원 관리',
      keyAbilities: [
        { name: '고름 일격', usage: '상처 생성 및 유지', icon: 'ability_deathknight_festering_strike' },
        { name: '죽음의 고리', usage: '상처 터뜨리기', icon: 'ability_deathknight_deathcoil' },
        { name: '스컬지 일격', usage: '상처 소비 주력기', icon: 'ability_deathknight_scourgestrike' },
        { name: '대재앙', usage: 'AoE 도트', icon: 'ability_deathknight_outbreak' }
      ],
      opener: [
        '대재앙으로 질병 적용',
        '구울 소환 및 암흑 변신',
        '고름 일격으로 상처 4-6개',
        '불홀한 광란 시전',
        '죽음의 고리/스컬지 일격 반복'
      ],
      cooldowns: [
        { name: '암흑 변신', usage: '구울 강화, 쿨마다', icon: 'ability_deathknight_darktransformation' },
        { name: '불홀한 광란', usage: '버스트 윈도우', icon: 'ability_deathknight_unholypresence' },
        { name: '군대 소환', usage: '풀링 전 또는 버스트', icon: 'ability_deathknight_armyofthedead' },
        { name: '가고일 소환', usage: '단일 타겟 버스트', icon: 'ability_deathknight_summongargoyle' }
      ],
      tips: [
        '상처는 4-6개 유지가 이상적',
        '암흑 변신은 쿨마다 사용',
        '룬 마력 캡 방지 주의',
        '역병 도트 100% 유지 필수'
      ]
    }
  },

  demonhunter: {
    복수: {
      name: '복수',
      role: '탱커',
      priority: '생존 > 영혼 조각 관리 > DPS',
      keyAbilities: [
        { name: '영혼 베어내기', usage: '영혼 조각 생성', icon: 'ability_demonhunter_shear' },
        { name: '영혼 쪼개기', usage: '영혼 조각 소비, 치유', icon: 'ability_demonhunter_soulcleave' },
        { name: '파멸', usage: '자원 생성 및 도약', icon: 'ability_demonhunter_immolation' },
        { name: '악마 쐐기', usage: '방어 증가 디버프', icon: 'ability_demonhunter_demonspikes' }
      ],
      opener: [
        '지옥 불길로 진입',
        '파멸 시전',
        '악마 쐐기 활성화',
        '영혼 베어내기 연타',
        '영혼 조각 5개시 영혼 쪼개기'
      ],
      cooldowns: [
        { name: '악마 형상', usage: '생존기 및 DPS 증가', icon: 'ability_demonhunter_metamorphosis' },
        { name: '마력의 수호물', usage: '마법 피해 흡수', icon: 'ability_demonhunter_empowerwards' },
        { name: '인장 각인', usage: '침묵 및 이동', icon: 'ability_demonhunter_sigilofsilence' },
        { name: '최후의 수단', usage: '자동 생존기', icon: 'ability_demonhunter_lastresort' }
      ],
      tips: [
        '영혼 조각은 5개 이상 쌓이지 않도록 관리',
        '악마 쐐기는 충전 1개 항상 보유',
        '인장 각인으로 카이팅 활용',
        '균열 생성으로 추가 영혼 조각'
      ]
    },
    파멸: {
      name: '파멸',
      role: '근접 딜러',
      priority: 'DPS 버스트 > 자원 관리 > 이동성',
      keyAbilities: [
        { name: '악마의 이빨', usage: '주력 분노 생성', icon: 'ability_demonhunter_demonsbite' },
        { name: '혼돈의 일격', usage: '주력 분노 소비', icon: 'ability_demonhunter_chaossstrike' },
        { name: '칼날 춤', usage: 'AoE 피해', icon: 'ability_demonhunter_bladedance' },
        { name: '눈 광선', usage: '채널링 AoE', icon: 'ability_demonhunter_eyebeam' }
      ],
      opener: [
        '악마 형상 시전',
        '눈 광선으로 변신',
        '죽음의 휩쓸기/전멸',
        '칼날 춤',
        '혼돈의 일격 연타'
      ],
      cooldowns: [
        { name: '악마 형상', usage: '메인 버스트 쿨', icon: 'ability_demonhunter_metamorphosis' },
        { name: '복수의 퇴각', usage: '이동 및 분노 생성', icon: 'ability_demonhunter_vengefulretreat' },
        { name: '질풍', usage: '가속 버프', icon: 'ability_demonhunter_netherwalk' },
        { name: '혼돈의 낙인', usage: '대상 피해 증가', icon: 'ability_demonhunter_chaosbrand' }
      ],
      tips: [
        '악마 형상은 눈 광선으로 연장 가능',
        '분노 40 이하로 떨어지지 않도록 관리',
        '이동기를 DPS 로스 없이 활용',
        '악마의 이빨 묵직한 강타 특성 중요'
      ]
    }
  },

  druid: {
    조화: {
      name: '조화',
      role: '원거리 딜러',
      priority: '이클립스 관리 > 도트 유지 > 천공 포인트',
      keyAbilities: [
        { name: '천벌', usage: '태양 에너지 생성', icon: 'spell_nature_wrathv2' },
        { name: '별빛섬광', usage: '달 에너지 생성', icon: 'spell_nature_starfall' },
        { name: '월화/태양섬광', usage: '도트 유지', icon: 'spell_nature_starfall' },
        { name: '별똥별', usage: '천공 포인트 소비', icon: 'spell_nature_starfall' }
      ],
      opener: [
        '월화/태양섬광 도트 적용',
        '천벌 2회로 태양 이클립스',
        '별빛섬광으로 달 이클립스',
        '화신 시전',
        '별똥별/별빛쇄도 사용'
      ],
      cooldowns: [
        { name: '화신', usage: '메인 DPS 쿨다운', icon: 'spell_druid_incarnation' },
        { name: '천체의 정렬', usage: '화신 대체 특성', icon: 'spell_nature_natureguardian' },
        { name: '자연의 군대', usage: '3분 버스트', icon: 'ability_druid_forceofnature' },
        { name: '격노', usage: '즉시 천공 포인트', icon: 'ability_druid_berserk' }
      ],
      tips: [
        '이클립스는 항상 번갈아가며 발동',
        '도트는 팬데믹 구간(30%) 내 갱신',
        '천공 포인트는 캡되지 않도록 관리',
        '달의 여신 선택시 회전 변경'
      ]
    },
    야성: {
      name: '야성',
      role: '근접 딜러',
      priority: '도트/디버프 유지 > 콤보 포인트 > 마무리 일격',
      keyAbilities: [
        { name: '갈퀴 발톱', usage: '출혈 도트 유지', icon: 'ability_druid_rake' },
        { name: '도려내기', usage: '콤보 포인트 생성', icon: 'ability_druid_disembowel' },
        { name: '흉포한 이빨', usage: '마무리 일격', icon: 'ability_druid_ferociousbite' },
        { name: '찢어발기기', usage: '출혈 도트 유지', icon: 'ability_ghoulfrenzy' }
      ],
      opener: [
        '잠행으로 접근',
        '갈퀴 발톱 (은신 버전)',
        '도려내기로 콤보 생성',
        '찢어발기기 5콤보',
        '호랑이의 분노 + 광폭화'
      ],
      cooldowns: [
        { name: '광폭화', usage: '메인 DPS 증가', icon: 'ability_druid_berserk' },
        { name: '호랑이의 분노', usage: '에너지 회복 및 피해 증가', icon: 'ability_mount_jungletiger' },
        { name: '화신', usage: '강화된 능력', icon: 'spell_druid_incarnation' },
        { name: '흉포한 광란', usage: '연속 마무리', icon: 'ability_druid_primaltenacity' }
      ],
      tips: [
        '출혈은 팬데믹 구간 활용',
        '에너지 캡 방지 중요',
        '혈욕 물기는 5콤보 사용',
        '야생의 정수 특성시 도려내기 우선순위 상승'
      ]
    },
    수호: {
      name: '수호',
      role: '탱커',
      priority: '생존 > 분노 관리 > 위협 생성',
      keyAbilities: [
        { name: '난타', usage: '방어 및 분노 생성', icon: 'ability_druid_mangle2' },
        { name: '손톱 발톱', usage: '분노 생성', icon: 'ability_druid_thrash' },
        { name: '무쇠가죽', usage: '분노 소비 생존기', icon: 'ability_druid_ironfur' },
        { name: '광포한 재생', usage: '자가 치유', icon: 'ability_bullrush' }
      ],
      opener: [
        '달빛섬광으로 풀링',
        '돌진 후 손톱 발톱',
        '난타로 디버프',
        '무쇠가죽 2중첩',
        '광포한 재생 체력 관리'
      ],
      cooldowns: [
        { name: '생존 본능', usage: '큰 피해 대비', icon: 'ability_druid_tigersroar' },
        { name: '나무 껍질', usage: '피해 감소', icon: 'spell_nature_stoneclawtotem' },
        { name: '화신', usage: '추가 체력 및 방어', icon: 'spell_druid_incarnation' },
        { name: '격노', usage: '순간 분노 회복', icon: 'ability_druid_berserk' }
      ],
      tips: [
        '무쇠가죽 최소 1중첩 상시 유지',
        '분노 100 이상 쌓지 않기',
        '달빛섬광 적절히 활용',
        '우르속의 인내 특성 추천'
      ]
    },
    회복: {
      name: '회복',
      role: '힐러',
      priority: '탱커 생존 > 도트 힐 유지 > 공대 생존',
      keyAbilities: [
        { name: '회복', usage: '탱커 도트 힐', icon: 'spell_nature_rejuvenation' },
        { name: '피어나는 생명', usage: '탱커 주력 힐', icon: 'inv_misc_lifebloom' },
        { name: '급속 성장', usage: '광역 순간 힐', icon: 'spell_nature_resistnature' },
        { name: '평온', usage: '공대 생존기', icon: 'spell_nature_tranquility' }
      ],
      opener: [
        '탱커 피어나는 생명 유지',
        '탱커 회복 유지',
        '예상 피해 대상 회복 사전 적용',
        '재생으로 추가 도트',
        '급속 성장 준비'
      ],
      cooldowns: [
        { name: '화신', usage: '강력한 힐 버스트', icon: 'spell_druid_incarnation' },
        { name: '꽃피우기', usage: '광역 버스트 힐', icon: 'ability_druid_flourish' },
        { name: '평온', usage: '공대 생존기', icon: 'spell_nature_tranquility' },
        { name: '세나리온 수호물', usage: '도트 즉시 적용', icon: 'ability_druid_naturalperfection' }
      ],
      tips: [
        '피어나는 생명 3중첩 항상 유지',
        '숙련도로 추가 도트 힐 발동',
        '급속 성장은 도트 많을 때 효율적',
        '신속한 치유는 응급시만'
      ]
    }
  },

  // 기원사, 사냥꾼, 마법사 등 나머지 직업들도 동일한 형식으로 추가
  evoker: {
    황폐: {
      name: '황폐',
      role: '원거리 딜러',
      priority: '정수 관리 > 충전 스킬 > 버스트',
      keyAbilities: [
        { name: '분해의 불길', usage: '주력 정수 소비', icon: 'ability_evoker_disintegrate' },
        { name: '푸른 일격', usage: '정수 생성', icon: 'ability_evoker_azurestrike' },
        { name: '영원의 쇄도', usage: '충전형 버스트', icon: 'ability_evoker_eternalsurge' },
        { name: '화염 숨결', usage: 'AoE 및 도트', icon: 'ability_evoker_firebreath' }
      ],
      opener: [
        '화염 숨결으로 도트 적용',
        '용의 분노 시전',
        '영원의 쇄도 풀충전',
        '분해의 불길 채널링',
        '푸른 일격으로 정수 회복'
      ],
      cooldowns: [
        { name: '용의 분노', usage: '메인 버스트', icon: 'ability_evoker_dragonrage' },
        { name: '심호흡', usage: '강화 숨결 공격', icon: 'ability_evoker_deepbreath' },
        { name: '선제의 일격', usage: '즉시 시전 및 버프', icon: 'ability_evoker_tipthescales' },
        { name: '비늘 사령관', usage: '정수 회복', icon: 'ability_evoker_scalecommander' }
      ],
      tips: [
        '정수는 5개 이상 유지',
        '충전 스킬은 최대 충전 활용',
        '용의 분노 중 최대한 많은 스킬 사용',
        '이동 중에도 즉시 시전 스킬 활용'
      ]
    }
  },

  hunter: {
    야수: {
      name: '야수',
      role: '원거리 딜러',
      priority: '야수 시너지 > 집중 관리 > 버스트',
      keyAbilities: [
        { name: '살상 명령', usage: '주력 집중 소비', icon: 'ability_hunter_killcommand' },
        { name: '코브라 사격', usage: '집중 생성', icon: 'ability_hunter_cobrashot' },
        { name: '야수의 격노', usage: '야수 강화', icon: 'ability_druid_ferociousbite' },
        { name: '쇄도', usage: '광역 피해', icon: 'ability_hunter_onewithnature' }
      ],
      opener: [
        '야수의 격노 시전',
        '살상 명령',
        '날카로운 사격',
        '코브라 사격으로 집중 회복',
        '야생의 부름 시전'
      ],
      cooldowns: [
        { name: '야생의 부름', usage: '추가 야수 소환', icon: 'ability_hunter_callofthewild' },
        { name: '야수의 격노', usage: '야수 피해 증가', icon: 'ability_druid_ferociousbite' },
        { name: '피의 욕망', usage: '가속 증가', icon: 'ability_hunter_bloodlust' },
        { name: '광포한 야수들', usage: '다수 야수 소환', icon: 'ability_hunter_lonewolf' }
      ],
      tips: [
        '야수 격노는 쿨마다 사용',
        '집중 50 이상 유지',
        '날카로운 사격 3중첩 유지',
        '야수 위치 관리 중요'
      ]
    },
    사격: {
      name: '사격',
      role: '원거리 딜러',
      priority: '조준 사격 > 속사 > 집중 관리',
      keyAbilities: [
        { name: '조준 사격', usage: '주력 캐스팅', icon: 'ability_hunter_aimedshot' },
        { name: '속사', usage: '즉시 시전 버스트', icon: 'ability_hunter_rapidfire' },
        { name: '신비한 사격', usage: '이동 중 사용', icon: 'ability_hunter_arcaneshot' },
        { name: '고정 사격', usage: '집중 생성', icon: 'ability_hunter_steadyshot' }
      ],
      opener: [
        '이중 탭으로 시작',
        '속전속결 시전',
        '조준 사격',
        '속사',
        '고정 사격으로 집중 회복'
      ],
      cooldowns: [
        { name: '속전속결', usage: '가속 버스트', icon: 'ability_hunter_trueshot' },
        { name: '이중 탭', usage: '조준 사격 2연발', icon: 'ability_hunter_doubletap' },
        { name: '폭발 사격', usage: 'AoE 피해', icon: 'ability_hunter_explosiveshot' },
        { name: '바람 화살', usage: '단일 대상 버스트', icon: 'ability_hunter_windarrows' }
      ],
      tips: [
        '정확한 사격 중첩 활용',
        '속전속결 중 최대한 많은 조준 사격',
        '이동 최소화로 캐스팅 극대화',
        '트릭 샷으로 광역전 대비'
      ]
    },
    생존: {
      name: '생존',
      role: '근접 딜러',
      priority: '도트 유지 > 몽구스 > 집중 관리',
      keyAbilities: [
        { name: '몽구스 일격', usage: '주력 근접 공격', icon: 'ability_hunter_mongoosebite' },
        { name: '맹금', usage: '도트 및 집중 생성', icon: 'ability_hunter_raptorstrike' },
        { name: '살상 명령', usage: '집중 소비', icon: 'ability_hunter_killcommand' },
        { name: '야생불 폭탄', usage: 'AoE 폭발', icon: 'ability_hunter_wildbomb' }
      ],
      opener: [
        '작살로 접근',
        '맹금으로 도트',
        '결투 전문가 시전',
        '몽구스 일격 연타',
        '야생불 폭탄 투척'
      ],
      cooldowns: [
        { name: '결투 전문가', usage: '근접 강화', icon: 'ability_hunter_coordassault' },
        { name: '날개 절단', usage: '광역 피해', icon: 'ability_hunter_wingclip' },
        { name: '측면 공격', usage: '추가 피해', icon: 'ability_hunter_flanking' },
        { name: '생존 전술', usage: '생존기', icon: 'ability_hunter_survivaltactics' }
      ],
      tips: [
        '몽구스의 격노 5중첩 목표',
        '야생불 폭탄 충전 관리',
        '도트 100% 유지',
        '근접 포지션 유지 중요'
      ]
    }
  },

  mage: {
    비전: {
      name: '비전',
      role: '원거리 딜러',
      priority: '비전 충전물 관리 > 마나 관리 > 버스트',
      keyAbilities: [
        { name: '비전 작렬', usage: '충전물 생성', icon: 'spell_arcane_blast' },
        { name: '비전 탄막', usage: '충전물 소비', icon: 'spell_arcane_barrage' },
        { name: '비전 화살', usage: '이동 중 사용', icon: 'spell_arcane_missile' },
        { name: '비전 쇄도', usage: '버스트 채널링', icon: 'spell_arcane_surge' }
      ],
      opener: [
        '비전 지능 버프',
        '비전 강화 시전',
        '환기 발동',
        '비전 쇄도 채널링',
        '비전 작렬 4충전'
      ],
      cooldowns: [
        { name: '비전 강화', usage: '메인 버스트', icon: 'spell_nature_lightning' },
        { name: '환기', usage: '마나 회복', icon: 'spell_arcane_evocation' },
        { name: '비전 구슬', usage: '추가 피해', icon: 'spell_arcane_orb' },
        { name: '시간의 구슬', usage: '충전물 즉시 생성', icon: 'spell_arcane_altertime' }
      ],
      tips: [
        '4충전 유지 후 탄막 사용',
        '마나 30% 이하시 환기',
        '비전 화살은 투명화 중 사용',
        '비전 조화 특성 필수'
      ]
    },
    화염: {
      name: '화염',
      role: '원거리 딜러',
      priority: '발화 관리 > 연소 타이밍 > 즉시 시전',
      keyAbilities: [
        { name: '화염구', usage: '주력 캐스팅', icon: 'spell_fire_flamebolt' },
        { name: '불기둥', usage: '즉시 시전 버스트', icon: 'spell_fire_pillarofflame' },
        { name: '불태우기', usage: '도트 적용', icon: 'spell_fire_immolation' },
        { name: '화염 작렬', usage: '발화 소비', icon: 'spell_fire_fireball02' }
      ],
      opener: [
        '화염구 사전 캐스팅',
        '연소 시전',
        '화염 작렬 연타',
        '불사조 소환',
        '불기둥 즉시 시전'
      ],
      cooldowns: [
        { name: '연소', usage: '100% 치명타', icon: 'spell_fire_sealoffire' },
        { name: '불사조', usage: '추가 피해원', icon: 'ability_mage_phoenix' },
        { name: '타오르는 가속', usage: '가속 증가', icon: 'spell_fire_burningspeed' },
        { name: '유성', usage: '광역 피해', icon: 'spell_mage_meteor' }
      ],
      tips: [
        '발화 중첩 낭비 금지',
        '연소는 발화 보유시 사용',
        '이동 중 불태우기 갱신',
        '태양왕의 축복 특성 추천'
      ]
    },
    냉기: {
      name: '냉기',
      role: '원거리 딜러',
      priority: '얼음 파편 관리 > 동결 활용 > 버스트',
      keyAbilities: [
        { name: '서리 화살', usage: '파편 생성', icon: 'spell_frost_frostbolt02' },
        { name: '얼음 창', usage: '파편 소비', icon: 'spell_frost_icelance' },
        { name: '냉기 돌풍', usage: 'AoE 동결', icon: 'spell_frost_arcticwinds' },
        { name: '얼음불꽃 화살', usage: '파편 2개 생성', icon: 'spell_frost_frostbolt' }
      ],
      opener: [
        '서리 화살 사전 캐스팅',
        '얼음 핏줄 시전',
        '얼음불꽃 화살',
        '얼음 창 2연발',
        '혜성 폭풍 시전'
      ],
      cooldowns: [
        { name: '얼음 핏줄', usage: '메인 버스트', icon: 'spell_frost_coldhearted' },
        { name: '혜성 폭풍', usage: '광역 피해', icon: 'spell_frost_icestorm' },
        { name: '시간 돌리기', usage: '위치 리셋', icon: 'spell_arcane_altertime' },
        { name: '서리 구슬', usage: '즉시 파편 생성', icon: 'spell_frost_orb' }
      ],
      tips: [
        '얼음 파편 최대 5개까지',
        '두뇌 빙결 발동 활용',
        '겨울의 손길로 파편 생성',
        '얼음 핏줄 중 파편 소비 극대화'
      ]
    }
  },

  monk: {
    양조: {
      name: '양조',
      role: '탱커',
      priority: '시간차 유지 > 취기 관리 > 위협 생성',
      keyAbilities: [
        { name: '술통 휘두르기', usage: '시간차 생성', icon: 'ability_monk_kegsmash' },
        { name: '범의 장풍', usage: '에너지 소비', icon: 'ability_monk_tigerpalm' },
        { name: '해악 축출', usage: '취기 정화', icon: 'ability_monk_purifyingbrew' },
        { name: '맥주 폭발', usage: 'AoE 피해', icon: 'ability_monk_breathoffire' }
      ],
      opener: [
        '술통 던지기로 풀링',
        '술통 휘두르기',
        '맥주 폭발',
        '범의 장풍 연타',
        '해악 축출로 취기 관리'
      ],
      cooldowns: [
        { name: '강화주', usage: '피해 감소', icon: 'ability_monk_fortifyingbrew' },
        { name: '천신', usage: '체력 증가 및 취기 정화', icon: 'ability_monk_invokecelestial' },
        { name: '선풍각', usage: '광역 스턴', icon: 'ability_monk_legswipe' },
        { name: '담금질', usage: '방어도 증가', icon: 'ability_monk_zenmeditation' }
      ],
      tips: [
        '시간차 100% 유지 필수',
        '취기는 중간 이하로 관리',
        '해악 축출 충전 1개 보유',
        '천신은 위급시 사용'
      ]
    },
    풍운: {
      name: '풍운',
      role: '근접 딜러',
      priority: '콤보 연계 > 기 관리 > 버스트',
      keyAbilities: [
        { name: '범의 장풍', usage: '콤보 시작', icon: 'ability_monk_tigerpalm' },
        { name: '후려차기', usage: '콤보 연결', icon: 'ability_monk_blackoutkick' },
        { name: '떠오르는 태양차기', usage: '디버프 유지', icon: 'ability_monk_risingsunkick' },
        { name: '주학 연타', usage: '기 소비', icon: 'ability_monk_fistsoffury' }
      ],
      opener: [
        '범의 장풍으로 시작',
        '폭풍과 대지와 불 시전',
        '떠오르는 태양차기',
        '주학 연타',
        '소용돌이 용의 타격'
      ],
      cooldowns: [
        { name: '폭풍과 대지와 불', usage: '메인 버스트', icon: 'ability_monk_stormearth' },
        { name: '주학의 원령', usage: '분신 소환', icon: 'ability_monk_invoker' },
        { name: '칠흑 황소의 분노', usage: '추가 피해', icon: 'ability_monk_oxcharge' },
        { name: '기의 고리', usage: '광역 스턴', icon: 'ability_monk_forcesphere' }
      ],
      tips: [
        '콤보 연계 끊기지 않도록',
        '기 50 이상 유지',
        '후려차기는 감소 효과 활용',
        '비취 돌풍 특성 추천'
      ]
    },
    운무: {
      name: '운무',
      role: '힐러',
      priority: '탱커 안개 유지 > 정기 폭발 활용 > 공대힐',
      keyAbilities: [
        { name: '안개 둘러싸기', usage: '탱커 도트힐', icon: 'ability_monk_envelopingmist' },
        { name: '소생의 안개', usage: '채널링 힐', icon: 'ability_monk_soothingmist' },
        { name: '정수의 샘', usage: '광역 도트힐', icon: 'ability_monk_essencefont' },
        { name: '기의 고치', usage: '보호막', icon: 'ability_monk_lifescocoon' }
      ],
      opener: [
        '탱커 안개 둘러싸기',
        '소생의 안개 채널링',
        '재활로 이동힐',
        '정수의 샘 사전 시전',
        '비취 바람으로 마무리'
      ],
      cooldowns: [
        { name: '평안', usage: '공대 생존기', icon: 'ability_monk_revival' },
        { name: '치유의 비취 용', usage: '광역 스마트힐', icon: 'ability_monk_chiexplosion' },
        { name: '기의 고치', usage: '개인 생존기', icon: 'ability_monk_lifescocoon' },
        { name: '마나차', usage: '마나 회복', icon: 'ability_monk_manapotion' }
      ],
      tips: [
        '재활 스택 상시 유지',
        '소생의 안개로 즉시시전',
        '기 관리로 번개 차 활용',
        '비취 유대 특성 필수'
      ]
    }
  },

  paladin: {
    신성: {
      name: '신성',
      role: '힐러',
      priority: '신성 충격 쿨다운 > 빛의 섬광 > 신의 권능',
      keyAbilities: [
        { name: '신성 충격', usage: '즉시 힐 및 피해', icon: 'spell_holy_searinglight' },
        { name: '빛의 섬광', usage: '빠른 캐스팅 힐', icon: 'spell_holy_flashheal' },
        { name: '성스러운 빛', usage: '강력한 힐', icon: 'spell_holy_holybolt' },
        { name: '빛의 봉화', usage: '탱커 연결', icon: 'ability_paladin_beaconoflight' }
      ],
      opener: [
        '빛의 봉화 탱커 적용',
        '신의 권능 준비',
        '신성 충격 쿨마다',
        '빛의 섬광 스팸',
        '영광의 서약 활용'
      ],
      cooldowns: [
        { name: '신의 권능', usage: '광역 힐', icon: 'spell_holy_avenginewrath' },
        { name: '희생의 오라', usage: '공대 피해 감소', icon: 'spell_holy_auramastery' },
        { name: '천상의 은혜', usage: '순간 이동 및 힐', icon: 'spell_holy_divineprovidence' },
        { name: '여명', usage: '강력한 버스트 힐', icon: 'spell_paladin_dawnlight' }
      ],
      tips: [
        '신성 충격은 쿨마다 사용',
        '빛 주입 버프 활용',
        '마나 관리 주의',
        '빛의 봉개 2개 특성 추천'
      ]
    },
    보호: {
      name: '보호',
      role: '탱커',
      priority: '정당한 방어 유지 > 신의 권능 관리 > 위협 생성',
      keyAbilities: [
        { name: '정의의 방패', usage: '원거리 위협', icon: 'spell_holy_avengersshield' },
        { name: '정의의 망치', usage: '신의 권능 생성', icon: 'ability_paladin_hammeroftherighteous' },
        { name: '신의 방패', usage: '신의 권능 소비', icon: 'ability_paladin_shieldofvengeance' },
        { name: '축성', usage: '지역 장판', icon: 'spell_holy_consecration' }
      ],
      opener: [
        '정의의 방패로 풀링',
        '축성 설치',
        '정의의 망치 연타',
        '신의 방패로 방어',
        '정당한 방어 유지'
      ],
      cooldowns: [
        { name: '불굴의 수호자', usage: '큰 피해 감소', icon: 'spell_holy_ardentdefender' },
        { name: '수호자의 빛', usage: '체력 회복', icon: 'spell_holy_guardianspirit' },
        { name: '신의 보호', usage: '마법 피해 감소', icon: 'spell_holy_divineprotection' },
        { name: '응징의 격노', usage: 'DPS 증가', icon: 'spell_holy_avenginewrath' }
      ],
      tips: [
        '정당한 방어 100% 유지',
        '신의 권능 5개 이상 낭비 금지',
        '축성 100% 유지',
        '빛의 수호자 특성 추천'
      ]
    },
    징벌: {
      name: '징벌',
      role: '근접 딜러',
      priority: '신의 권능 관리 > 심판 유지 > 버스트',
      keyAbilities: [
        { name: '기사단의 선고', usage: '주력 신권 소비', icon: 'spell_paladin_templarsverdict' },
        { name: '칼날 폭풍', usage: '신권 생성', icon: 'ability_paladin_bladestorm' },
        { name: '심판', usage: '디버프 유지', icon: 'spell_holy_righteousfury' },
        { name: '재의 경험', usage: '즉시 버스트', icon: 'ability_paladin_wakeofashes' }
      ],
      opener: [
        '칼날 폭풍으로 시작',
        '재의 경험 시전',
        '응징의 격노 + 성전',
        '기사단의 선고 연타',
        '심판 유지'
      ],
      cooldowns: [
        { name: '응징의 격노', usage: '피해 및 치명타 증가', icon: 'spell_holy_avenginewrath' },
        { name: '성전', usage: '가속 증가', icon: 'spell_holy_crusade' },
        { name: '최후의 순간', usage: '추가 버스트', icon: 'spell_paladin_finalreckoning' },
        { name: '천상의 폭풍', usage: 'AoE 피해', icon: 'ability_paladin_divinestorm' }
      ],
      tips: [
        '신의 권능 5개시 즉시 소비',
        '심판 디버프 100% 유지',
        '성전 중첩 최대한 쌓기',
        '정의의 칼날 특성 필수'
      ]
    }
  },

  priest: {
    수양: {
      name: '수양',
      role: '힐러',
      priority: '속죄 유지 > 보호막 관리 > DPS 힐링',
      keyAbilities: [
        { name: '신의 권능: 보호막', usage: '속죄 적용', icon: 'spell_holy_powerwordshield' },
        { name: '고통', usage: '도트 및 속죄 힐', icon: 'spell_shadow_shadowwordpain' },
        { name: '분열', usage: '속죄 트리거', icon: 'spell_holy_penance' },
        { name: '광휘', usage: '광역 속죄', icon: 'spell_holy_powerwordradiance' }
      ],
      opener: [
        '탱커 보호막 유지',
        '광휘로 광역 속죄',
        '고통 도트 적용',
        '분열로 힐 전환',
        '어둠의 마귀 준비'
      ],
      cooldowns: [
        { name: '어둠의 마귀', usage: '버스트 힐', icon: 'spell_shadow_shadowfiend' },
        { name: '통제의 복음', usage: '피해 감소', icon: 'spell_holy_evangelism' },
        { name: '방벽', usage: '공대 피해 감소', icon: 'spell_holy_powerwordbarrier' },
        { name: '환희', usage: '광역 속죄 힐', icon: 'spell_holy_rapture' }
      ],
      tips: [
        '속죄 대상 10명 이상 유지',
        '분열은 쿨마다 사용',
        '어둠의 마귀는 버스트 타이밍',
        '복음 특성으로 속죄 연장'
      ]
    },
    신성: {
      name: '신성',
      role: '힐러',
      priority: '치유의 기원 > 회복의 기원 > 신성한 언약',
      keyAbilities: [
        { name: '치유의 기원', usage: '순간 광역힐', icon: 'spell_holy_prayerofhealing' },
        { name: '회복의 기원', usage: '도트 힐', icon: 'spell_holy_prayerofmendingtga' },
        { name: '신성한 별', usage: '이동 광역힐', icon: 'spell_priest_holystar' },
        { name: '빛의 권능: 평온', usage: '마나 효율 힐', icon: 'spell_holy_heal' }
      ],
      opener: [
        '회복의 기원 유지',
        '치유의 기원 준비',
        '성스러운 언약 활성',
        '빛의 권능으로 탱힐',
        '수호 영혼 대기'
      ],
      cooldowns: [
        { name: '수호 영혼', usage: '개인 생존기', icon: 'spell_holy_guardianspirit' },
        { name: '신성한 찬가', usage: '채널링 공대힐', icon: 'spell_holy_divinehymn' },
        { name: '구원의 정신', usage: '힐 증가', icon: 'spell_holy_spiritoftheredeemer' },
        { name: '빛우물', usage: '지속 광역힐', icon: 'spell_priest_lightwell' }
      ],
      tips: [
        '회복의 기원 항상 활성',
        '치유의 기원 5스택 활용',
        '성스러운 언약 최대한 활용',
        '천상의 별 특성 추천'
      ]
    },
    암흑: {
      name: '암흑',
      role: '원거리 딜러',
      priority: '도트 유지 > 정신 분열 관리 > 공허 폭발',
      keyAbilities: [
        { name: '흡혈의 손길', usage: '주력 도트', icon: 'spell_shadow_vampirictouch' },
        { name: '어둠의 권능: 고통', usage: '즉시 도트', icon: 'spell_shadow_shadowwordpain' },
        { name: '정신 분열', usage: '채널링 피해', icon: 'spell_shadow_mindflay' },
        { name: '공허 폭발', usage: '정신력 소비', icon: 'spell_shadow_voidbolt' }
      ],
      opener: [
        '흡혈의 손길 적용',
        '어둠의 권능: 고통',
        '정신 분열 채널링',
        '공허 형상 진입',
        '공허 폭발 연타'
      ],
      cooldowns: [
        { name: '공허 형상', usage: '메인 변신', icon: 'spell_shadow_voidform' },
        { name: '어둠의 마귀', usage: '추가 피해', icon: 'spell_shadow_shadowfiend' },
        { name: '정신의 힘', usage: '버스트 증가', icon: 'spell_shadow_psychichorrors' },
        { name: '공허 격류', usage: '광역 피해', icon: 'spell_shadow_voidtorrent' }
      ],
      tips: [
        '도트 100% 유지 필수',
        '공허 형상 최대한 연장',
        '정신력 관리 중요',
        '미친 어둠의 사제 특성 추천'
      ]
    }
  },

  rogue: {
    암살: {
      name: '암살',
      role: '근접 딜러',
      priority: '독 유지 > 에너지 관리 > 마무리 일격',
      keyAbilities: [
        { name: '절개', usage: '콤보 생성 및 독', icon: 'ability_rogue_mutilate' },
        { name: '독살', usage: '마무리 도트', icon: 'ability_rogue_envenom' },
        { name: '파열', usage: '출혈 도트', icon: 'ability_rogue_rupture' },
        { name: '목조르기', usage: '침묵 및 독', icon: 'ability_rogue_garrote' }
      ],
      opener: [
        '은신으로 접근',
        '목조르기 시작',
        '절개로 콤보 생성',
        '파열 5콤보',
        '절개 + 독살 반복'
      ],
      cooldowns: [
        { name: '핏빛 칼날', usage: '독 적용 버스트', icon: 'ability_rogue_crimsontempest' },
        { name: '숙련의 징표', usage: '치명타 100%', icon: 'inv_throwingknife_07' },
        { name: '소멸', usage: '이동 및 생존', icon: 'spell_shadow_vanish' },
        { name: '죽음표식', usage: '단일 버스트', icon: 'ability_rogue_deathmark' }
      ],
      tips: [
        '치명적인 독 + 마비 독',
        '파열 100% 유지',
        '독살로 독 갱신',
        '비밀 기술 특성 필수'
      ]
    },
    무법: {
      name: '무법',
      role: '근접 딜러',
      priority: '구르기 버프 > 콤보 관리 > 버스트',
      keyAbilities: [
        { name: '권총 사격', usage: '콤보 생성 및 버프', icon: 'ability_rogue_pistolshot' },
        { name: '사형 선고', usage: '마무리 일격', icon: 'ability_rogue_dispatch' },
        { name: '작렬', usage: '구르기 버프', icon: 'ability_rogue_rollthebones' },
        { name: '매복', usage: '콤보 생성', icon: 'ability_rogue_ambush' }
      ],
      opener: [
        '작렬로 버프 획득',
        '은신 매복',
        '권총 사격',
        '난도질로 콤보',
        '사형 선고'
      ],
      cooldowns: [
        { name: '아드레날린 촉진', usage: '에너지 회복', icon: 'ability_rogue_adrenalinrush' },
        { name: '칼날 질주', usage: '공격속도 증가', icon: 'ability_rogue_bladeflurry' },
        { name: '그림자 춤', usage: '은신 기술', icon: 'ability_rogue_shadowdance' },
        { name: '유령의 일격', usage: '버스트 윈도우', icon: 'ability_rogue_ghostlystrike' }
      ],
      tips: [
        '작렬 2개 이상 버프 유지',
        '칼날 질주는 광역전',
        '권총 사격 기회 활용',
        '숨겨진 보물 특성 추천'
      ]
    },
    잠행: {
      name: '잠행',
      role: '근접 딜러',
      priority: '그림자 춤 관리 > 어둠칼 > 버스트',
      keyAbilities: [
        { name: '그림자 일격', usage: '주력 콤보 생성', icon: 'spell_shadow_shadowstrike' },
        { name: '절개', usage: '마무리 일격', icon: 'ability_rogue_eviscerate' },
        { name: '어둠칼', usage: '콤보 및 에너지', icon: 'ability_rogue_shadowblades' },
        { name: '그림자 폭풍', usage: 'AoE 마무리', icon: 'ability_rogue_shadowstorm' }
      ],
      opener: [
        '은신 상태 유지',
        '그림자 춤 시전',
        '그림자 일격 연타',
        '절개 5콤보',
        '어둠칼 활성화'
      ],
      cooldowns: [
        { name: '그림자 춤', usage: '은신 기술 활성', icon: 'ability_rogue_shadowdance' },
        { name: '어둠칼', usage: '콤보 증가', icon: 'ability_rogue_shadowblades' },
        { name: '어둠의 비밀 기술', usage: '모든 기술 강화', icon: 'ability_rogue_secretofthetrade' },
        { name: '그림자 형상', usage: '궁극기', icon: 'ability_rogue_shadowform' }
      ],
      tips: [
        '그림자 춤 충전 관리',
        '어둠칼은 춤과 함께',
        '어둠의 기술로 콤보 유지',
        '심층 그림자 특성 필수'
      ]
    }
  },

  shaman: {
    정기: {
      name: '정기',
      role: '원거리 딜러',
      priority: '화염 충격 유지 > 용암 폭발 > 원소 폭발',
      keyAbilities: [
        { name: '화염 충격', usage: '도트 유지', icon: 'spell_fire_flameshock' },
        { name: '용암 폭발', usage: '즉시 시전', icon: 'spell_shaman_lavaburst' },
        { name: '번개 화살', usage: '필러 캐스팅', icon: 'spell_nature_lightning' },
        { name: '대지 충격', usage: '마나 회복', icon: 'spell_nature_earthshock' }
      ],
      opener: [
        '화염 충격 적용',
        '정기 폭발 시전',
        '용암 폭발',
        '번개 화살 캐스팅',
        '대지 원소 소환'
      ],
      cooldowns: [
        { name: '정기 폭발', usage: '메인 버스트', icon: 'spell_fire_elementaldevastation' },
        { name: '폭풍의 원소', usage: '추가 피해원', icon: 'spell_lightning_lightningbolt01' },
        { name: '대지 원소', usage: '지속 피해', icon: 'spell_nature_earthelemental' },
        { name: '원시 정령', usage: '강화 원소', icon: 'spell_shaman_primalelementalist' }
      ],
      tips: [
        '화염 충격 100% 유지',
        '용암 폭발 충전 낭비 금지',
        '융합 발동 활용',
        '산산조각 특성 추천'
      ]
    },
    고양: {
      name: '고양',
      role: '근접 딜러',
      priority: '무기 버프 > 소용돌이 관리 > 버스트',
      keyAbilities: [
        { name: '폭풍의 일격', usage: '주력 공격', icon: 'ability_shaman_stormstrike' },
        { name: '용암 채찍', usage: '무기 버프 적용', icon: 'spell_shaman_lavash' },
        { name: '번개 화살', usage: '소용돌이 소비', icon: 'spell_nature_lightning' },
        { name: '화염 충격', usage: '도트 유지', icon: 'spell_fire_flameshock' }
      ],
      opener: [
        '화염혀/냉기 무기 버프',
        '야수 정령 소환',
        '폭풍의 일격',
        '용암 채찍',
        '번개 화살 5스택'
      ],
      cooldowns: [
        { name: '야수 정령', usage: '추가 피해', icon: 'spell_shaman_feralspirit' },
        { name: '승천', usage: '버스트 변신', icon: 'spell_shaman_ascendance' },
        { name: '질풍', usage: '가속 증가', icon: 'spell_shaman_windwalk' },
        { name: '파멸의 원소', usage: '강력한 원소', icon: 'ability_shaman_doomwinds' }
      ],
      tips: [
        '무기 버프 항상 유지',
        '소용돌이 5스택 소비',
        '뜨거운 손 발동 활용',
        '원소 폭발 특성 필수'
      ]
    },
    복원: {
      name: '복원',
      role: '힐러',
      priority: '성난 해일 유지 > 치유의 비 > 연쇄 치유',
      keyAbilities: [
        { name: '성난 해일', usage: '탱커 버프', icon: 'spell_nature_riptide' },
        { name: '치유의 비', usage: '광역 도트힐', icon: 'spell_nature_healingrain' },
        { name: '연쇄 치유', usage: '스마트 힐', icon: 'spell_nature_healingwavegreater' },
        { name: '치유의 파도', usage: '빠른 힐', icon: 'spell_nature_healingwave' }
      ],
      opener: [
        '대지 보호막 토템',
        '탱커 성난 해일',
        '치유의 비 설치',
        '연쇄 치유 준비',
        '치유의 토템 설치'
      ],
      cooldowns: [
        { name: '치유의 토템', usage: '광역 힐', icon: 'ability_shaman_healingtide' },
        { name: '정신 고리 토템', usage: '피해 분산', icon: 'spell_shaman_spiritlink' },
        { name: '승천', usage: '즉시 시전', icon: 'spell_shaman_ascendance' },
        { name: '폭우', usage: '힐 증폭', icon: 'spell_shaman_cloudbursttotem' }
      ],
      tips: [
        '성난 해일 2명 유지',
        '치유의 비 위치 선정',
        '마나 관리 중요',
        '대지살이 특성 추천'
      ]
    }
  },

  warlock: {
    고통: {
      name: '고통',
      role: '원거리 딜러',
      priority: '도트 유지 > 영혼 조각 > 흡수',
      keyAbilities: [
        { name: '고통', usage: '주력 도트', icon: 'spell_shadow_curseofsargeras' },
        { name: '부패', usage: '즉시 도트', icon: 'spell_shadow_abominationcurse' },
        { name: '불안정한 고통', usage: '영혼조각 도트', icon: 'spell_shadow_unstableaffliction' },
        { name: '흡수', usage: '채널링 피해', icon: 'spell_shadow_drain' }
      ],
      opener: [
        '고통 적용',
        '부패 적용',
        '불안정한 고통',
        '유령 출몰 시전',
        '흡수 채널링'
      ],
      cooldowns: [
        { name: '암흑시선', usage: '도트 증폭', icon: 'spell_warlock_darksoul' },
        { name: '유령 출몰', usage: '도트 폭발', icon: 'spell_shadow_haunting' },
        { name: '사악한 욕망', usage: '피해 증가', icon: 'spell_shadow_vileaffiction' },
        { name: '영혼 부활', usage: '도트 리셋', icon: 'spell_shadow_soulburn' }
      ],
      tips: [
        '모든 도트 100% 유지',
        '영혼조각 4개 이상 유지',
        '악의 씨앗 광역전 활용',
        '파멸의 폭포 특성 필수'
      ]
    },
    악마: {
      name: '악마',
      role: '원거리 딜러',
      priority: '악마 관리 > 영혼조각 > 핸드 오브 굴단',
      keyAbilities: [
        { name: '파괴의 부름', usage: '영혼조각 생성', icon: 'spell_shadow_demonictactics' },
        { name: '핸드 오브 굴단', usage: '악마 소환', icon: 'spell_shadow_handofguldan' },
        { name: '악마 화살', usage: '주력 캐스팅', icon: 'spell_shadow_demonbolt' },
        { name: '빌프레드 소환', usage: '강력한 악마', icon: 'spell_shadow_summonfelguard' }
      ],
      opener: [
        '악마 소환',
        '파괴의 부름',
        '핸드 오브 굴단 3조각',
        '악마 사령관 시전',
        '악마 화살 연타'
      ],
      cooldowns: [
        { name: '악마 사령관', usage: '악마 강화', icon: 'spell_warlock_demoniccommander' },
        { name: '녹색 불길의 군주', usage: '추가 악마', icon: 'spell_warlock_calldeadlord' },
        { name: '파멸의 수호병', usage: '강력한 소환수', icon: 'spell_shadow_summoninfernal' },
        { name: '악마 폭군', usage: '변신 버스트', icon: 'spell_warlock_demonictryant' }
      ],
      tips: [
        '임프 군단 유지',
        '영혼조각 3개 핸드 오브 굴단',
        '악마 화살 핵심 조각 활용',
        '악마 소비 특성 추천'
      ]
    },
    파괴: {
      name: '파괴',
      role: '원거리 딜러',
      priority: '제물 유지 > 영혼조각 > 혼돈의 화살',
      keyAbilities: [
        { name: '제물', usage: '도트 유지', icon: 'spell_fire_immolation' },
        { name: '소각', usage: '영혼조각 생성', icon: 'spell_fire_incinerate' },
        { name: '혼돈의 화살', usage: '주력 버스트', icon: 'spell_fire_fireball02' },
        { name: '화염구', usage: '영혼조각 소비', icon: 'spell_shadow_conflagration' }
      ],
      opener: [
        '제물 적용',
        '소각으로 조각 생성',
        '파멸의 문 소환',
        '혼돈의 화살 2연발',
        '화염구 사용'
      ],
      cooldowns: [
        { name: '파멸의 문', usage: '강력한 소환수', icon: 'spell_warlock_summonabyssal' },
        { name: '암흑 영혼', usage: '치명타 증가', icon: 'spell_warlock_darksoul' },
        { name: '대혼란', usage: '즉시 시전', icon: 'spell_fire_felfirenova' },
        { name: '영혼 분쇄', usage: '추가 조각', icon: 'spell_warlock_soulburn' }
      ],
      tips: [
        '제물 100% 유지 필수',
        '영혼조각 최대 5개',
        '역류 발동 활용',
        '지옥불정 특성 추천'
      ]
    }
  },

  warrior: {
    방어: {
      name: '방어',
      role: '탱커',
      priority: '방패 막기 유지 > 격노 관리 > 위협 생성',
      keyAbilities: [
        { name: '방패 밀쳐내기', usage: '위협 및 격노', icon: 'ability_warrior_shieldslam' },
        { name: '천둥벼락', usage: '광역 위협', icon: 'ability_warrior_thunderclap' },
        { name: '방패 막기', usage: '능동 방어', icon: 'ability_defend' },
        { name: '복수', usage: '격노 소비', icon: 'ability_warrior_revenge' }
      ],
      opener: [
        '돌진으로 진입',
        '방패 밀쳐내기',
        '천둥벼락',
        '방패 막기 활성',
        '복수 사용'
      ],
      cooldowns: [
        { name: '최후의 저항', usage: '생존기', icon: 'spell_nature_reincarnation' },
        { name: '방패의 벽', usage: '피해 감소', icon: 'ability_warrior_shieldwall' },
        { name: '사기의 외침', usage: '광역 버프', icon: 'ability_warrior_rallyingcry' },
        { name: '주문 반사', usage: '마법 반사', icon: 'ability_warrior_spellreflection' }
      ],
      tips: [
        '방패 막기 최대한 유지',
        '격노 60 이상시 무시',
        '천둥벼락 디버프 유지',
        '격돌 특성 추천'
      ]
    },
    무기: {
      name: '무기',
      role: '근접 딜러',
      priority: '거인의 강타 디버프 > 치명타 활용 > 버스트',
      keyAbilities: [
        { name: '죽음의 일격', usage: '주력 공격', icon: 'ability_warrior_decisivestrike' },
        { name: '대재앙', usage: '디버프 유지', icon: 'ability_warrior_colossalsmash' },
        { name: '압도', usage: '격노 생성', icon: 'ability_warrior_overpower' },
        { name: '칼날폭풍', usage: 'AoE 피해', icon: 'ability_warrior_bladestorm' }
      ],
      opener: [
        '돌진으로 접근',
        '대재앙 적용',
        '죽음의 일격',
        '압도',
        '거인 학살자 연타'
      ],
      cooldowns: [
        { name: '전투의 함성', usage: '치명타 보장', icon: 'ability_warrior_warcry' },
        { name: '칼날폭풍', usage: '광역 버스트', icon: 'ability_warrior_bladestorm' },
        { name: '투신', usage: '피해 증가', icon: 'ability_warrior_avatar' },
        { name: '거인 학살자', usage: '강력한 일격', icon: 'ability_warrior_titansgrip' }
      ],
      tips: [
        '대재앙 디버프 유지',
        '죽음의 일격 2충전 관리',
        '압도 기회 놓치지 않기',
        '전장의 군주 특성 필수'
      ]
    },
    분노: {
      name: '분노',
      role: '근접 딜러',
      priority: '격노 디버프 > 격노 관리 > 광폭화',
      keyAbilities: [
        { name: '피의 갈증', usage: '격노 생성', icon: 'spell_nature_bloodlust' },
        { name: '분쇄', usage: '격노 소비', icon: 'ability_warrior_rampage' },
        { name: '격노의 일격', usage: '주력 공격', icon: 'spell_nature_shamanrage' },
        { name: '회전베기', usage: 'AoE 피해', icon: 'ability_whirlwind' }
      ],
      opener: [
        '돌진으로 접근',
        '피의 갈증',
        '격노의 일격',
        '분쇄로 격노 발동',
        '무모한 희생 시전'
      ],
      cooldowns: [
        { name: '무모한 희생', usage: '메인 버스트', icon: 'ability_warrior_recklessness' },
        { name: '오딘의 격노', usage: '추가 공격', icon: 'ability_warrior_odinsfury' },
        { name: '투신', usage: '피해 증가', icon: 'ability_warrior_avatar' },
        { name: '파괴의 춤', usage: '연속 공격', icon: 'ability_warrior_bladestorm' }
      ],
      tips: [
        '격노 버프 100% 유지',
        '격노 85 이상시 분쇄',
        '피의 갈증 치명타 활용',
        '분노 발산 특성 추천'
      ]
    }
  }
};

// 스킬 우선순위 및 상황별 로테이션
export const getRotationPriority = (className, specName, situation = 'single') => {
  const spec = classRotations[className]?.[specName];
  if (!spec) return null;

  const priorities = {
    single: spec.keyAbilities.slice(0, 3),
    aoe: spec.keyAbilities.slice(2, 4),
    burst: spec.cooldowns.slice(0, 2)
  };

  return priorities[situation] || priorities.single;
};

// 레이드/M+ 별 추천 빌드
export const getRecommendedBuild = (className, specName, content = 'raid') => {
  const builds = {
    raid: {
      talentPriority: 'Single Target DPS',
      statPriority: 'Critical > Haste > Mastery',
      gems: 'Critical Strike',
      enchants: 'DPS focused'
    },
    mythicplus: {
      talentPriority: 'AoE and Utility',
      statPriority: 'Haste > Critical > Versatility',
      gems: 'Haste',
      enchants: 'Survivability focused'
    }
  };

  return builds[content] || builds.raid;
};