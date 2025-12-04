/**
 * WoW 클래스 메타데이터 - 가이드 자동 생성/검증용
 * TWW 시즌 3 (11.2.5 패치) 기준 - 2025-11-28 업데이트
 *
 * 📌 필수 참조 문서:
 *   - C:/wowmeta/WoW-Meta-Knowledge/99-META/Guide-of-Guides.md (전체 시스템 이해)
 *   - C:/wowmeta/WoW-Meta-Knowledge/99-META/Guide-Generation-Instructions.md (가이드 생성 지침)
 *
 * 용도:
 * - 가이드 템플릿 자동 정제 (잘못된 클래스 키워드 제거)
 * - 영웅 특성 검증
 * - 리소스 타입 검증 (마나/분노/집중/룬 등)
 * - 자동 가이드 생성
 */

export const classMetadata = {
  deathknight: {
    koreanName: '죽음의 기사',
    englishName: 'Death Knight',
    color: '#C41E3A',
    colorRGB: '196, 30, 58',
    resourceType: 'rune',
    specs: {
      frost: {
        koreanName: '냉기',
        englishName: 'Frost',
        role: 'DPS',
        heroTalents: [
          { key: 'rideroftheapocalypse', korean: '종말의 기수', english: 'Rider of the Apocalypse' },
          { key: 'deathbringer', korean: '죽음인도자', english: 'Deathbringer' }
        ],
        coreKeywords: ['살의 기계', '서리 낫', '필멸의 권능', '룬 무기 강화'],
        wrongKeywords: ['마나', '환기', '번뜩임', '비전', '주문화염', '불사조', '산왕', 'mountainthane', 'Arcane', '주문불꽃'],
        resourceName: '룬 마력',
        resourceNameEnglish: 'Runic Power',
        damageType: '냉기',
        damageTypeEnglish: 'Frost',
        replacementMap: {
          '주문불꽃 구체': '룬 마력',
          'Spellfire Spheres': 'Runic Power',
          '마나': '룬 마력',
          'Mana': 'Runic Power',
          '마법사': '죽음의 기사',
          'Mage': 'Death Knight',
          '비전 마법사': '냉기 죽음의 기사',
          'Arcane Mage': 'Frost Death Knight',
          '비전': '냉기',
          'Arcane': 'Frost',
          '화염': '냉기',
          'Fire': 'Frost',
          '산왕': '죽음인도자',
          'Mountain Thane': 'Deathbringer',
          '성난태양': '죽음인도자',
          'Sunfury': 'Deathbringer'
        }
      },
      blood: {
        koreanName: '혈기',
        englishName: 'Blood',
        role: 'Tank',
        heroTalents: [
          { key: 'sanlayn', korean: '산레인', english: "San'layn" },
          { key: 'deathbringer', korean: '죽음인도자', english: 'Deathbringer' }
        ],
        coreKeywords: ['죽음일격', '룬 전환', '흡혈'],
        wrongKeywords: ['마나', '분노', '집중']
      },
      unholy: {
        koreanName: '부정',
        englishName: 'Unholy',
        role: 'DPS',
        heroTalents: [
          { key: 'sanlayn', korean: '산레인', english: "San'layn" },
          { key: 'rideroftheapocalypse', korean: '종말의 기수', english: 'Rider of the Apocalypse' }
        ],
        coreKeywords: ['주검 일으키기', '전염', '흑사병'],
        wrongKeywords: ['마나', '비전', '번뜩임']
      }
    }
  },

  warrior: {
    koreanName: '전사',
    englishName: 'Warrior',
    color: '#C69B6D',
    colorRGB: '198, 155, 109',
    resourceType: 'rage',
    specs: {
      fury: {
        koreanName: '분노',
        englishName: 'Fury',
        role: 'DPS',
        heroTalents: [
          { key: 'slayer', korean: '학살자', english: 'Slayer' },
          { key: 'mountainthane', korean: '산왕', english: 'Mountain Thane' }
        ],
        coreKeywords: ['격노', '광란', '무자비한 돌격'],
        wrongKeywords: ['마나', '비전', '번뜩임', '룬']
      },
      arms: {
        koreanName: '무기',
        englishName: 'Arms',
        role: 'DPS',
        heroTalents: [
          { key: 'colossus', korean: '거신', english: 'Colossus' },
          { key: 'slayer', korean: '학살자', english: 'Slayer' }
        ],
        coreKeywords: ['강타', '칼날폭풍', '처형'],
        wrongKeywords: ['마나', '룬', '집중']
      },
      protection: {
        koreanName: '방어',
        englishName: 'Protection',
        role: 'Tank',
        heroTalents: [
          { key: 'colossus', korean: '거신', english: 'Colossus' },
          { key: 'mountainthane', korean: '산왕', english: 'Mountain Thane' }
        ],
        coreKeywords: ['방패 밀쳐내기', '천둥벼락', '복수'],
        wrongKeywords: ['마나', '비전']
      }
    }
  },

  mage: {
    koreanName: '마법사',
    englishName: 'Mage',
    color: '#3FC6EA',
    colorRGB: '63, 198, 234',
    resourceType: 'mana',
    specs: {
      arcane: {
        koreanName: '비전',
        englishName: 'Arcane',
        role: 'DPS',
        heroTalents: [
          { key: 'sunfury', korean: '성난태양', english: 'Sunfury' },
          { key: 'spellslinger', korean: '주문술사', english: 'Spellslinger' }
        ],
        coreKeywords: ['비전 작렬', '신비한 화살', '번뜩임', '환기', '비전 충전물'],
        wrongKeywords: ['분노', '룬', '집중', '격노']
      },
      fire: {
        koreanName: '화염',
        englishName: 'Fire',
        role: 'DPS',
        heroTalents: [
          { key: 'sunfury', korean: '성난태양', english: 'Sunfury' },
          { key: 'frostfire', korean: '서리불꽃', english: 'Frostfire' }
        ],
        coreKeywords: ['화염 작렬', '불덩이', '발화'],
        wrongKeywords: ['분노', '룬', '살의 기계']
      },
      frost: {
        koreanName: '냉기',
        englishName: 'Frost',
        role: 'DPS',
        heroTalents: [
          { key: 'frostfire', korean: '서리불꽃', english: 'Frostfire' },
          { key: 'spellslinger', korean: '주문술사', english: 'Spellslinger' }
        ],
        coreKeywords: ['냉기 화살', '얼음 창', '얼음 핏줄'],
        wrongKeywords: ['분노', '룬', '격노']
      }
    }
  },

  hunter: {
    koreanName: '사냥꾼',
    englishName: 'Hunter',
    color: '#AAD372',
    colorRGB: '170, 211, 114',
    resourceType: 'focus',
    specs: {
      beastmastery: {
        koreanName: '야수',
        englishName: 'Beast Mastery',
        role: 'DPS',
        heroTalents: [
          { key: 'packleader', korean: '무리의 지도자', english: 'Pack Leader' },
          { key: 'darkranger', korean: '어둠 순찰자', english: 'Dark Ranger' }
        ],
        coreKeywords: ['날카로운 사격', '야수 소집', '광기'],
        wrongKeywords: ['마나', '룬', '비전', '분노']
      },
      marksmanship: {
        koreanName: '사격',
        englishName: 'Marksmanship',
        role: 'DPS',
        heroTalents: [
          { key: 'sentinel', korean: '파수꾼', english: 'Sentinel' },
          { key: 'darkranger', korean: '어둠 순찰자', english: 'Dark Ranger' }
        ],
        coreKeywords: ['조준 사격', '신속한 사격', '고독한 늑대'],
        wrongKeywords: ['마나', '룬', '비전']
      },
      survival: {
        koreanName: '생존',
        englishName: 'Survival',
        role: 'DPS',
        heroTalents: [
          { key: 'sentinel', korean: '파수꾼', english: 'Sentinel' },
          { key: 'packleader', korean: '무리의 지도자', english: 'Pack Leader' }
        ],
        coreKeywords: ['살무사 쐐기', '맹금의 일격', '도살'],
        wrongKeywords: ['마나', '룬', '번뜩임']
      }
    }
  },

  paladin: {
    koreanName: '성기사',
    englishName: 'Paladin',
    color: '#F48CBA',
    colorRGB: '244, 140, 186',
    resourceType: 'mana_holy',
    specs: {
      holy: {
        koreanName: '신성',
        englishName: 'Holy',
        role: 'Healer',
        heroTalents: [
          { key: 'lightsmith', korean: '빛의 대장장이', english: 'Lightsmith' },
          { key: 'heraldofthesun', korean: '태양의 사자', english: 'Herald of the Sun' }
        ],
        coreKeywords: ['신성한 빛', '신성 충격', '빛의 봉화'],
        wrongKeywords: ['분노', '룬', '집중', '비전']
      },
      protection: {
        koreanName: '보호',
        englishName: 'Protection',
        role: 'Tank',
        resourceType: 'mana_holy',
        heroTalents: [
          { key: 'lightsmith', korean: '빛의 대장장이', english: 'Lightsmith' },
          { key: 'templar', korean: '기사단', english: 'Templar' }
        ],
        coreKeywords: ['보호의 축복', '신성한 보호자', '정의의 방패'],
        wrongKeywords: ['분노', '룬', '비전']
      },
      retribution: {
        koreanName: '징벌',
        englishName: 'Retribution',
        role: 'DPS',
        resourceType: 'holy_power',
        heroTalents: [
          { key: 'templar', korean: '기사단', english: 'Templar' },
          { key: 'heraldofthesun', korean: '태양의 사자', english: 'Herald of the Sun' }
        ],
        coreKeywords: ['성전사의 일격', '성스러운 폭풍', '신성한 목적'],
        wrongKeywords: ['마나', '룬', '분노', '비전']
      }
    }
  },

  druid: {
    koreanName: '드루이드',
    englishName: 'Druid',
    color: '#FF7C0A',
    colorRGB: '255, 124, 10',
    resourceType: 'various',
    specs: {
      balance: {
        koreanName: '조화',
        englishName: 'Balance',
        role: 'DPS',
        heroTalents: [
          { key: 'keeperofthegrove', korean: '숲의 수호자', english: 'Keeper of the Grove' },
          { key: 'eluneeschosen', korean: '엘룬의 선택', english: "Elune's Chosen" }
        ],
        coreKeywords: ['별빛섬광', '천벌', '별똥별'],
        wrongKeywords: ['마나', '분노', '격노']
      },
      feral: {
        koreanName: '야성',
        englishName: 'Feral',
        role: 'DPS',
        heroTalents: [
          { key: 'druidoftheclaw', korean: '발톱의 드루이드', english: 'Druid of the Claw' },
          { key: 'wildstalker', korean: '야생추적자', english: 'Wildstalker' }
        ],
        coreKeywords: ['갈퀴 발톱', '흉포한 이빨', '도려내기'],
        wrongKeywords: ['마나', '분노', '룬']
      },
      guardian: {
        koreanName: '수호',
        englishName: 'Guardian',
        role: 'Tank',
        heroTalents: [
          { key: 'druidoftheclaw', korean: '발톱의 드루이드', english: 'Druid of the Claw' },
          { key: 'eluneeschosen', korean: '엘룬의 선택', english: "Elune's Chosen" }
        ],
        coreKeywords: ['짓이기기', '휘둘러치기', '광폭화'],
        wrongKeywords: ['마나', '비전', '집중']
      },
      restoration: {
        koreanName: '회복',
        englishName: 'Restoration',
        role: 'Healer',
        heroTalents: [
          { key: 'keeperofthegrove', korean: '숲의 수호자', english: 'Keeper of the Grove' },
          { key: 'wildstalker', korean: '야생추적자', english: 'Wildstalker' }
        ],
        coreKeywords: ['재생', '회복', '꽃비'],
        wrongKeywords: ['분노', '룬', '집중']
      }
    }
  },

  rogue: {
    koreanName: '도적',
    englishName: 'Rogue',
    color: '#FFF468',
    colorRGB: '255, 244, 104',
    resourceType: 'energy',
    specs: {
      assassination: {
        koreanName: '암살',
        englishName: 'Assassination',
        role: 'DPS',
        heroTalents: [
          { key: 'deathstalker', korean: '죽음추적자', english: 'Deathstalker' },
          { key: 'fatebound', korean: '운명결속', english: 'Fatebound' }
        ],
        coreKeywords: ['절개', '독칼날', '급소 가격'],
        wrongKeywords: ['마나', '룬', '분노']
      },
      outlaw: {
        koreanName: '무법',
        englishName: 'Outlaw',
        role: 'DPS',
        heroTalents: [
          { key: 'fatebound', korean: '운명결속', english: 'Fatebound' },
          { key: 'trickster', korean: '사기꾼', english: 'Trickster' }
        ],
        coreKeywords: ['권총 사격', '진검 승부', '뼈 부수기'],
        wrongKeywords: ['마나', '룬', '비전']
      },
      subtlety: {
        koreanName: '잠행',
        englishName: 'Subtlety',
        role: 'DPS',
        heroTalents: [
          { key: 'deathstalker', korean: '죽음추적자', english: 'Deathstalker' },
          { key: 'trickster', korean: '사기꾼', english: 'Trickster' }
        ],
        coreKeywords: ['그림자 춤', '암흑의 베기', '분쇄'],
        wrongKeywords: ['마나', '분노', '집중']
      }
    }
  },

  priest: {
    koreanName: '사제',
    englishName: 'Priest',
    color: '#FFFFFF',
    colorRGB: '255, 255, 255',
    resourceType: 'mana',
    specs: {
      discipline: {
        koreanName: '수양',
        englishName: 'Discipline',
        role: 'Healer',
        heroTalents: [
          { key: 'oraclepriest', korean: '신탁', english: 'Oracle' },
          { key: 'voidweaver', korean: '공허직조자', english: 'Voidweaver' }
        ],
        coreKeywords: ['속죄', '고통 억제', '빛의 권능: 보호막'],
        wrongKeywords: ['분노', '룬', '집중']
      },
      holy: {
        koreanName: '신성',
        englishName: 'Holy',
        role: 'Healer',
        heroTalents: [
          { key: 'oraclepriest', korean: '신탁', english: 'Oracle' },
          { key: 'archon', korean: '집행자', english: 'Archon' }
        ],
        coreKeywords: ['치유의 기도', '신성한 일격', '천상의 별'],
        wrongKeywords: ['분노', '룬', '격노']
      },
      shadow: {
        koreanName: '암흑',
        englishName: 'Shadow',
        role: 'DPS',
        heroTalents: [
          { key: 'voidweaver', korean: '공허직조자', english: 'Voidweaver' },
          { key: 'archon', korean: '집행자', english: 'Archon' }
        ],
        coreKeywords: ['공허 형상', '어둠의 권능: 죽음', '흡혈의 손길'],
        wrongKeywords: ['분노', '룬', '격노']
      }
    }
  },

  shaman: {
    koreanName: '주술사',
    englishName: 'Shaman',
    color: '#0070DD',
    colorRGB: '0, 112, 221',
    resourceType: 'mana',
    specs: {
      elemental: {
        koreanName: '정기',
        englishName: 'Elemental',
        role: 'DPS',
        heroTalents: [
          { key: 'stormbringer', korean: '폭풍인도자', english: 'Stormbringer' },
          { key: 'farseer', korean: '선견자', english: 'Farseer' }
        ],
        coreKeywords: ['용암 폭발', '번개 화살', '대지 충격'],
        wrongKeywords: ['분노', '룬', '집중']
      },
      enhancement: {
        koreanName: '고양',
        englishName: 'Enhancement',
        role: 'DPS',
        heroTalents: [
          { key: 'stormbringer', korean: '폭풍인도자', english: 'Stormbringer' },
          { key: 'totemic', korean: '토템술사', english: 'Totemic' }
        ],
        coreKeywords: ['폭풍 일격', '용암 채찍', '정령의 무기'],
        wrongKeywords: ['비전', '룬', '격노']
      },
      restoration: {
        koreanName: '복원',
        englishName: 'Restoration',
        role: 'Healer',
        heroTalents: [
          { key: 'farseer', korean: '선견자', english: 'Farseer' },
          { key: 'totemic', korean: '토템술사', english: 'Totemic' }
        ],
        coreKeywords: ['치유의 파도', '치유의 물줄기', '치유의 빗줄기'],
        wrongKeywords: ['분노', '룬', '격노']
      }
    }
  },

  warlock: {
    koreanName: '흑마법사',
    englishName: 'Warlock',
    color: '#8788EE',
    colorRGB: '135, 136, 238',
    resourceType: 'mana',
    specs: {
      affliction: {
        koreanName: '고통',
        englishName: 'Affliction',
        role: 'DPS',
        heroTalents: [
          { key: 'soulharvester', korean: '영혼수확자', english: 'Soul Harvester' },
          { key: 'hellcaller', korean: '지옥소환사', english: 'Hellcaller' }
        ],
        coreKeywords: ['부패', '고통', '불안정한 고통'],
        wrongKeywords: ['분노', '룬', '집중']
      },
      demonology: {
        koreanName: '악마',
        englishName: 'Demonology',
        role: 'DPS',
        heroTalents: [
          { key: 'soulharvester', korean: '영혼수확자', english: 'Soul Harvester' },
          { key: 'diabolist', korean: '악마주의자', english: 'Diabolist' }
        ],
        coreKeywords: ['손 끊기', '악마 소환', '악마 화살'],
        wrongKeywords: ['분노', '룬', '격노']
      },
      destruction: {
        koreanName: '파괴',
        englishName: 'Destruction',
        role: 'DPS',
        heroTalents: [
          { key: 'hellcaller', korean: '지옥소환사', english: 'Hellcaller' },
          { key: 'diabolist', korean: '악마주의자', english: 'Diabolist' }
        ],
        coreKeywords: ['혼돈의 화살', '소각', '대혼란'],
        wrongKeywords: ['분노', '룬', '집중']
      }
    }
  },

  monk: {
    koreanName: '수도사',
    englishName: 'Monk',
    color: '#00FF98',
    colorRGB: '0, 255, 152',
    resourceType: 'energy',
    specs: {
      brewmaster: {
        koreanName: '양조',
        englishName: 'Brewmaster',
        role: 'Tank',
        heroTalents: [
          { key: 'masterofharmony', korean: '조화의 달인', english: 'Master of Harmony' },
          { key: 'shadopan', korean: '음영파', english: 'Shado-Pan' }
        ],
        coreKeywords: ['술통 던지기', '발차기', '취권'],
        wrongKeywords: ['마나', '룬', '분노']
      },
      mistweaver: {
        koreanName: '운무',
        englishName: 'Mistweaver',
        role: 'Healer',
        heroTalents: [
          { key: 'masterofharmony', korean: '조화의 달인', english: 'Master of Harmony' },
          { key: 'conduitofthecelestials', korean: '천인의 도관', english: 'Conduit of the Celestials' }
        ],
        coreKeywords: ['정수의 샘', '소생의 안개', '생명의 고치'],
        wrongKeywords: ['분노', '룬', '격노']
      },
      windwalker: {
        koreanName: '풍운',
        englishName: 'Windwalker',
        role: 'DPS',
        heroTalents: [
          { key: 'shadopan', korean: '음영파', english: 'Shado-Pan' },
          { key: 'conduitofthecelestials', korean: '천인의 도관', english: 'Conduit of the Celestials' }
        ],
        coreKeywords: ['비취 바람', '맹렬한 주먹', '회전 발차기'],
        wrongKeywords: ['마나', '룬', '분노']
      }
    }
  },

  demonhunter: {
    koreanName: '악마사냥꾼',
    englishName: 'Demon Hunter',
    color: '#A330C9',
    colorRGB: '163, 48, 201',
    resourceType: 'fury',
    specs: {
      havoc: {
        koreanName: '파멸',
        englishName: 'Havoc',
        role: 'DPS',
        heroTalents: [
          { key: 'aldrachireaver', korean: '알드라치 약탈자', english: 'Aldrachi Reaver' },
          { key: 'felscarred', korean: '지옥상흔', english: 'Fel-Scarred' }
        ],
        coreKeywords: ['혼돈의 일격', '칼춤', '안광', '부서진 영혼', '악마의 이빨', '정수파쇄'],
        wrongKeywords: ['마나', '룬', '비전', '복수의 질주']
      },
      vengeance: {
        koreanName: '복수',
        englishName: 'Vengeance',
        role: 'Tank',
        heroTalents: [
          { key: 'aldrachireaver', korean: '알드라치 약탈자', english: 'Aldrachi Reaver' },
          { key: 'felscarred', korean: '지옥상흔', english: 'Fel-Scarred' }
        ],
        coreKeywords: ['영혼 절단', '지옥불 낙인', '영혼 분열'],
        wrongKeywords: ['마나', '비전', '집중']
      }
    }
  },

  evoker: {
    koreanName: '기원사',
    englishName: 'Evoker',
    color: '#33937F',
    colorRGB: '51, 147, 127',
    resourceType: 'essence',
    specs: {
      devastation: {
        koreanName: '황폐',
        englishName: 'Devastation',
        role: 'DPS',
        heroTalents: [
          { key: 'scalecommander', korean: '비늘사령관', english: 'Scalecommander' },
          { key: 'flameshaper', korean: '화염조형사', english: 'Flameshaper' }
        ],
        coreKeywords: ['분리', '영원의 쇄도', '화염 숨결'],
        wrongKeywords: ['마나', '룬', '분노']
      },
      preservation: {
        koreanName: '보존',
        englishName: 'Preservation',
        role: 'Healer',
        heroTalents: [
          { key: 'chronowarden', korean: '시간의 수호자', english: 'Chronowarden' },
          { key: 'flameshaper', korean: '화염조형사', english: 'Flameshaper' }
        ],
        coreKeywords: ['꿈의 숨결', '시간의 역전', '반향'],
        wrongKeywords: ['분노', '룬', '격노']
      },
      augmentation: {
        koreanName: '증강',
        englishName: 'Augmentation',
        role: 'Support',
        heroTalents: [
          { key: 'chronowarden', korean: '시간의 수호자', english: 'Chronowarden' },
          { key: 'scalecommander', korean: '비늘사령관', english: 'Scalecommander' }
        ],
        coreKeywords: ['에본 권능', '격려', '선견지명'],
        wrongKeywords: ['분노', '룬', '격노']
      }
    }
  }
};

/**
 * 유틸리티 함수들
 */

export const getClassMetadata = (className) => {
  return classMetadata[className.toLowerCase()];
};

export const getSpecMetadata = (className, specName) => {
  const classData = getClassMetadata(className);
  return classData?.specs[specName.toLowerCase()];
};

export const isValidHeroTalent = (className, specName, heroTalentKey) => {
  const specData = getSpecMetadata(className, specName);
  return specData?.heroTalents.some(ht => ht.key === heroTalentKey);
};

export const isWrongKeyword = (className, specName, keyword) => {
  const specData = getSpecMetadata(className, specName);
  return specData?.wrongKeywords.some(wk => keyword.includes(wk));
};

export const getResourceType = (className) => {
  const classData = getClassMetadata(className);
  return classData?.resourceType;
};

export default classMetadata;
