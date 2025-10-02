// WoWDB에서 크롤링한 도적 스킬 데이터
// 생성일: 2025-01-21
// WoWDB와 ko.wowhead.com 대조하여 생성

export const wowdbRogueSkillsComplete = {
  // 기본 스킬들 (Baseline)
  baseline: {
    // Stealth
    1784: {
      name: 'Stealth',
      kr: '은신',
      level: 1,
      type: 'utility'
    },

    // Sinister Strike
    1752: {
      name: 'Sinister Strike',
      kr: '사악한 일격',
      level: 1,
      type: 'damage',
      icon: '/icons/ability_rogue_sinistercalling.png'
    },

    // Backstab
    53: {
      name: 'Backstab',
      kr: '등 찌르기',
      level: 6,
      type: 'damage'
    },

    // Eviscerate
    196819: {
      name: 'Eviscerate',
      kr: '절개',
      level: 3,
      type: 'finisher',
      icon: '/icons/ability_rogue_eviscerate.png'
    },

    // Sprint
    2983: {
      name: 'Sprint',
      kr: '전력 질주',
      level: 21,
      type: 'mobility',
      icon: '/icons/ability_rogue_sprint.png'
    },

    // Kick
    1766: {
      name: 'Kick',
      kr: '발차기',
      level: 18,
      type: 'interrupt'
    },

    // Evasion
    5277: {
      name: 'Evasion',
      kr: '회피',
      level: 29,
      type: 'defensive'
    },

    // Vanish
    1856: {
      name: 'Vanish',
      kr: '소멸',
      level: 33,
      type: 'utility'
    },

    // Blind
    2094: {
      name: 'Blind',
      kr: '실명',
      level: 43,
      type: 'crowd_control'
    },

    // Cheap Shot
    1833: {
      name: 'Cheap Shot',
      kr: '비열한 습격',
      level: 15,
      type: 'crowd_control'
    },

    // Kidney Shot
    408: {
      name: 'Kidney Shot',
      kr: '급소 가격',
      level: 27,
      type: 'crowd_control',
      icon: '/icons/ability_rogue_kidneyshot.png'
    },

    // Slice and Dice
    315496: {
      name: 'Slice and Dice',
      kr: '난도질',
      level: 22,
      type: 'buff',
      icon: '/icons/ability_rogue_slicedice.png'
    },

    // Expose Armor
    8647: {
      name: 'Expose Armor',
      kr: '신비한 손길',
      level: 37,
      type: 'debuff'
    },

    // Sap
    6770: {
      name: 'Sap',
      kr: '혼절시키기',
      level: 12,
      type: 'crowd_control'
    },

    // Pick Lock
    1804: {
      name: 'Pick Lock',
      kr: '자물쇠 따기',
      level: 16,
      type: 'utility'
    },

    // Distract
    1725: {
      name: 'Distract',
      kr: '혼란',
      level: 8,
      type: 'utility',
      icon: '/icons/ability_rogue_distract.png'
    },

    // Detect Traps
    2836: {
      name: 'Detect Traps',
      kr: '함정 감지',
      level: 34,
      type: 'utility'
    },

    // Disarm Trap
    1842: {
      name: 'Disarm Trap',
      kr: '주문들',
      level: 38,
      type: 'utility'
    }
  },

  // 암살 전문화 (Assassination)
  assassination: {
    // Mutilate
    1329: {
      name: 'Mutilate',
      kr: '절단',
      level: 10,
      type: 'damage'
    },

    // Lethal Poison
    2823: {
      name: 'Lethal Poison',
      kr: '맹독',
      level: 10,
      type: 'poison'
    },

    // Poison Bomb
    255545: {
      name: 'Poison Bomb',
      kr: '독폭탄',
      level: 10,
      type: 'damage',
      icon: '/icons/ability_rogue_deviouspoisons.png'
    },

    // Assassinate
    441776: {
      name: 'Assassinate',
      kr: '최후의 일격',
      level: 10,
      type: 'damage'
    },

    // Envenom
    32645: {
      name: 'Envenom',
      kr: '독살',
      level: 10,
      type: 'finisher'
    },

    // Garrote
    703: {
      name: 'Garrote',
      kr: '목조르기',
      level: 15,
      type: 'damage',
      icon: '/icons/ability_rogue_garrote.png'
    },

    // Rupture
    1943: {
      name: 'Rupture',
      kr: '파열',
      level: 10,
      type: 'damage',
      icon: '/icons/ability_rogue_rupture.png'
    },

    // Vendetta
    79140: {
      name: 'Vendetta',
      kr: '원한',
      level: 50,
      type: 'cooldown',
      icon: '/icons/ability_rogue_vendetta.png'
    },

    // Cold Blood
    382245: {
      name: 'Cold Blood',
      kr: '냉혈',
      level: 25,
      type: 'buff'
    },

    // Improved Garrote
    381632: {
      name: 'Improved Garrote',
      kr: '목조르기 연마',
      level: 20,
      type: 'passive',
      icon: '/icons/ability_rogue_improvedrecuperate.png'
    },

    // Deadly Poison
    394324: {
      name: 'Deadly Poison',
      kr: '맹독',
      level: 15,
      type: 'poison',
      icon: '/icons/ability_rogue_deadliness.png'
    },

    // Wound Poison
    394327: {
      name: 'Wound Poison',
      kr: '상처 감염 독',
      level: 15,
      type: 'poison',
      icon: '/icons/ability_rogue_venomouswounds.png'
    },

    // Crippling Poison
    394328: {
      name: 'Crippling Poison',
      kr: '증폭의 독',
      level: 15,
      type: 'poison'
    }
  },

  // 무법 전문화 (Outlaw)
  outlaw: {
    // Pistol Shot
    185763: {
      name: 'Pistol Shot',
      kr: '권총 사격',
      level: 10,
      type: 'ranged',
      icon: '/icons/ability_rogue_pistolshot.png'
    },

    // Saber Slash
    193315: {
      name: 'Saber Slash',
      kr: '사악한 일격',
      level: 10,
      type: 'damage'
    },

    // Dispatch
    2098: {
      name: 'Dispatch',
      kr: '속결',
      level: 10,
      type: 'finisher'
    },

    // Roll the Bones
    315508: {
      name: 'Roll the Bones',
      kr: '뼈주사위',
      level: 10,
      type: 'buff',
      icon: '/icons/ability_rogue_rollthebones.png'
    },

    // Grappling Hook
    195457: {
      name: 'Grappling Hook',
      kr: '갈고리 던지기',
      level: 15,
      type: 'mobility',
      icon: '/icons/ability_rogue_grapplinghook.png'
    },

    // Between the Eyes
    315341: {
      name: 'Between the Eyes',
      kr: '미간 적중',
      level: 22,
      type: 'finisher',
      icon: '/icons/inv_112_rogue_betweentheeyes.png'
    },

    // Adrenaline Rush
    13750: {
      name: 'Adrenaline Rush',
      kr: '아드레날린 촉진',
      level: 50,
      type: 'cooldown'
    },

    // Blade Flurry
    13877: {
      name: 'Blade Flurry',
      kr: '폭풍의 칼날',
      level: 35,
      type: 'damage',
      icon: '/icons/ability_rogue_bladetwisting.png'
    },

    // Gouge
    1776: {
      name: 'Gouge',
      kr: '후려치기',
      level: 45,
      type: 'crowd_control'
    },

    // Opportunity
    195627: {
      name: 'Opportunity',
      kr: '기회',
      level: 10,
      type: 'passive'
    },

    // Combat Potency
    381877: {
      name: 'Combat Potency',
      kr: '전투 체력',
      level: 20,
      type: 'passive',
      icon: '/icons/ability_rogue_combatexpertise.png'
    },

    // Restless Blades
    79096: {
      name: 'Restless Blades',
      kr: '잠들지 않는 칼날',
      level: 15,
      type: 'passive',
      icon: '/icons/ability_rogue_restlessblades.png'
    }
  },

  // 잠행 전문화 (Subtlety)
  subtlety: {
    // Shadowstrike
    185438: {
      name: 'Shadowstrike',
      kr: '그림자 일격',
      level: 10,
      type: 'damage',
      icon: '/icons/ability_rogue_shadowstrike.png'
    },

    // Backstab
    53: {
      name: 'Backstab',
      kr: '등 찌르기',
      level: 10,
      type: 'damage'
    },

    // Black Powder
    319175: {
      name: 'Black Powder',
      kr: '검은 화약',
      level: 10,
      type: 'finisher',
      icon: '/icons/ability_rogue_blackjack.png'
    },

    // Shadow Clone
    382917: {
      name: 'Shadow Clone',
      kr: 'Transform: Visage -> Dragon (Black) [DNT]',
      level: 10,
      type: 'damage',
      icon: '/icons/ability_rogue_envelopingshadows.png'
    },

    // Shuriken Storm
    197835: {
      name: 'Shuriken Storm',
      kr: '표창 폭풍',
      level: 15,
      type: 'damage',
      icon: '/icons/ability_rogue_shurikenstorm.png'
    },

    // Shadow Dance
    185313: {
      name: 'Shadow Dance',
      kr: '어둠의 춤',
      level: 50,
      type: 'cooldown',
      icon: '/icons/ability_rogue_shadowdance.png'
    },

    // Symbols of Death
    212283: {
      name: 'Symbols of Death',
      kr: '죽음의 상징',
      level: 35,
      type: 'buff'
    },

    // Shadowmeld
    58984: {
      name: 'Shadowmeld',
      kr: '그림자 숨기',
      level: 25,
      type: 'utility',
      icon: '/icons/ability_rogue_envelopingshadows.png'
    },

    // Find Weakness
    196917: {
      name: 'Find Weakness',
      kr: '순교자의 빛',
      level: 15,
      type: 'passive',
      icon: '/icons/ability_rogue_findweakness.png'
    },

    // Master of Shadows
    196976: {
      name: 'Master of Shadows',
      kr: '어둠의 대가',
      level: 20,
      type: 'passive',
      icon: '/icons/ability_rogue_masterofsubtlety.png'
    },

    // Shadow Techniques
    196911: {
      name: 'Shadow Techniques',
      kr: '그림자 기술',
      level: 10,
      type: 'passive',
      icon: '/icons/ability_rogue_envelopingshadows.png'
    },

    // Deeper Stratagem
    193531: {
      name: 'Deeper Stratagem',
      kr: '심오한 책략',
      level: 40,
      type: 'passive'
    }
  },

  // 특성 (Talents)
  talents: {
    // Tier 15
    193539: {
      name: 'Alacrity',
      kr: '기민함',
      level: 15,
      type: 'passive'
    },

    193357: {
      name: 'Elaborate Planning',
      kr: '무자비한 정밀함',
      level: 15,
      type: 'passive'
    },

    381623: {
      name: 'Weaponmaster',
      kr: '엉겅퀴 차',
      level: 15,
      type: 'passive'
    },

    // Tier 25
    108216: {
      name: 'Nightstalker',
      kr: '비열한 수법',
      level: 25,
      type: 'passive',
      icon: '/icons/ability_rogue_nightblade.png'
    },

    114018: {
      name: 'Subterfuge',
      kr: '은폐의 장막',
      level: 25,
      type: 'passive',
      icon: '/icons/rogue_subterfuge.png'
    },

    382513: {
      name: 'Shadow Focus',
      kr: '흔적도 없이',
      level: 25,
      type: 'passive',
      icon: '/icons/ability_rogue_envelopingshadows.png'
    },

    // Tier 30
    31224: {
      name: 'Cloak of Shadows',
      kr: '그림자 망토',
      level: 30,
      type: 'defensive'
    },

    1966: {
      name: 'Feint',
      kr: '교란',
      level: 30,
      type: 'defensive',
      icon: '/icons/ability_rogue_feint.png'
    },

    // Tier 35
    381634: {
      name: 'Shadowstep',
      kr: '흉악한 맹독',
      level: 35,
      type: 'mobility',
      icon: '/icons/ability_rogue_shadowstep.png'
    },

    114014: {
      name: 'Shadow Clone',
      kr: '표창 투척',
      level: 35,
      type: 'damage',
      icon: '/icons/ability_rogue_envelopingshadows.png'
    },

    // Tier 40
    381802: {
      name: 'Thistle Tea',
      kr: '무차별 살육',
      level: 40,
      type: 'utility'
    },

    196718: {
      name: 'Echoing Reprimand',
      kr: '어둠',
      level: 40,
      type: 'damage',
      icon: '/icons/inv_ability_rogue_echoingreprimand.png'
    },

    // Tier 45
    381878: {
      name: 'Resounding Clarity',
      kr: '날렵한 몸놀림',
      level: 45,
      type: 'passive'
    },

    381869: {
      name: 'Vigor',
      kr: '[DNT] Pulling Wiggly Plant Pully Thing',
      level: 45,
      type: 'passive',
      icon: '/icons/ability_rogue_vigor.png'
    },

    // Tier 50
    384631: {
      name: 'Sepsis',
      kr: '채찍질',
      level: 50,
      type: 'damage',
      icon: '/icons/inv_ability_rogue_sepsis.png'
    }
  },

  // PvP 스킬
  pvp: {
    // Smoke Bomb
    212182: {
      name: 'Smoke Bomb',
      kr: '연막탄',
      level: 47,
      type: 'utility',
      icon: '/icons/ability_rogue_smoke.png'
    },

    // Dismantle
    207777: {
      name: 'Dismantle',
      kr: '장비 분해',
      level: 49,
      type: 'utility',
      icon: '/icons/ability_rogue_dismantle.png'
    },

    // Shadowy Duel
    207736: {
      name: 'Shadowy Duel',
      kr: '어둠의 결투',
      level: 51,
      type: 'crowd_control',
      icon: '/icons/ability_rogue_shadowyduel.png'
    },

    // Veil of Midnight
    198952: {
      name: 'Veil of Midnight',
      kr: '한밤의 장막',
      level: 53,
      type: 'defensive'
    },

    // Thick as Thieves
    221622: {
      name: 'Thick as Thieves',
      kr: '도둑의 배짱',
      level: 55,
      type: 'passive'
    }
  }
};

// 헬퍼 함수들
export function getWowDBRogueSkill(skillId) {
  const allCategories = [
    'baseline',
    'assassination',
    'outlaw',
    'subtlety',
    'talents',
    'pvp'
  ];

  for (const category of allCategories) {
    if (wowdbRogueSkillsComplete[category] && wowdbRogueSkillsComplete[category][skillId]) {
      return {
        ...wowdbRogueSkillsComplete[category][skillId],
        category: category,
        id: skillId
      };
    }
  }
  return null;
}

export function getRogueSkillCount() {
  let total = 0;
  const categories = Object.keys(wowdbRogueSkillsComplete);

  for (const category of categories) {
    total += Object.keys(wowdbRogueSkillsComplete[category]).length;
  }

  return {
    total,
    baseline: Object.keys(wowdbRogueSkillsComplete.baseline).length,
    assassination: Object.keys(wowdbRogueSkillsComplete.assassination).length,
    outlaw: Object.keys(wowdbRogueSkillsComplete.outlaw).length,
    subtlety: Object.keys(wowdbRogueSkillsComplete.subtlety).length,
    talents: Object.keys(wowdbRogueSkillsComplete.talents).length,
    pvp: Object.keys(wowdbRogueSkillsComplete.pvp).length
  };
}

export function getRogueSkillsBySpec(spec) {
  const specMap = {
    'assassination': 'assassination',
    'outlaw': 'outlaw',
    'subtlety': 'subtlety'
  };

  const category = specMap[spec?.toLowerCase()];
  if (!category) return null;

  return {
    baseline: wowdbRogueSkillsComplete.baseline,
    specialization: wowdbRogueSkillsComplete[category],
    talents: wowdbRogueSkillsComplete.talents,
    pvp: wowdbRogueSkillsComplete.pvp
  };
}