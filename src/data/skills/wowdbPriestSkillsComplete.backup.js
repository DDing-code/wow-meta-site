// WoWDB에서 크롤링한 사제 스킬 데이터
// 생성일: 2025-01-21
// WoWDB와 ko.wowhead.com 대조하여 생성

export const wowdbPriestSkillsComplete = {
  // 기본 스킬들 (Baseline)
  baseline: {
    // Smite
    585: {
      name: 'Smite',
      kr: '성스러운 일격',
      level: 1,
      type: 'damage'
    },

    // Heal
    2050: {
      name: 'Heal',
      kr: '빛의 권능: 평온',
      level: 1,
      type: 'healing'
    },

    // Power Word: Fortitude
    21562: {
      name: 'Power Word: Fortitude',
      kr: '신의 권능: 인내',
      level: 6,
      type: 'buff',
      icon: '/icons/ability_priest_clarityofpower.png'
    },

    // Renew
    139: {
      name: 'Renew',
      kr: '소생',
      level: 8,
      type: 'healing'
    },

    // Psychic Scream
    8122: {
      name: 'Psychic Scream',
      kr: '영혼의 절규',
      level: 12,
      type: 'crowd_control',
      icon: '/icons/ability_priest_psychiclink.png'
    },

    // Flash Heal
    2061: {
      name: 'Flash Heal',
      kr: '순간 치유',
      level: 16,
      type: 'healing',
      icon: '/icons/ability_priest_flashoflight.png'
    },

    // Inner Fire
    588: {
      name: 'Inner Fire',
      kr: '주문들',
      level: 18,
      type: 'buff',
      icon: '/icons/ability_priest_innerlightandshadow.png'
    },

    // Greater Heal
    2060: {
      name: 'Greater Heal',
      kr: '치유',
      level: 22,
      type: 'healing'
    },

    // Dispel Magic
    528: {
      name: 'Dispel Magic',
      kr: '마법 무효화',
      level: 18,
      type: 'utility'
    },

    // Prayer of Healing
    596: {
      name: 'Prayer of Healing',
      kr: '치유의 기원',
      level: 30,
      type: 'healing',
      icon: '/icons/ability_priest_bindingprayers.png'
    },

    // Fade
    586: {
      name: 'Fade',
      kr: '소실',
      level: 14,
      type: 'utility'
    },

    // Prayer of Fortitude
    21562: {
      name: 'Prayer of Fortitude',
      kr: '신의 권능: 인내',
      level: 42,
      type: 'buff',
      icon: '/icons/ability_priest_bindingprayers.png'
    },

    // Greater Fade
    213610: {
      name: 'Greater Fade',
      kr: '신성 수호',
      level: 55,
      type: 'utility'
    },

    // Holy Nova
    15237: {
      name: 'Holy Nova',
      kr: '주문들',
      level: 20,
      type: 'damage'
    },

    // Cure Disease
    552: {
      name: 'Cure Disease',
      kr: '주문들',
      level: 22,
      type: 'utility'
    },

    // Resurrection
    2006: {
      name: 'Resurrection',
      kr: '부활',
      level: 10,
      type: 'utility'
    },

    // Levitate
    1706: {
      name: 'Levitate',
      kr: '공중 부양',
      level: 34,
      type: 'utility'
    }
  },

  // 신성 전문화 (Holy)
  holy: {
    // Heal
    2050: {
      name: 'Heal',
      kr: '빛의 권능: 평온',
      level: 10,
      type: 'healing'
    },

    // Echo of Light
    77489: {
      name: 'Echo of Light',
      kr: '빛의 반향',
      level: 10,
      type: 'passive'
    },

    // Apotheosis
    200183: {
      name: 'Apotheosis',
      kr: '절정',
      level: 50,
      type: 'cooldown'
    },

    // Guardian Spirit
    47788: {
      name: 'Guardian Spirit',
      kr: '수호 영혼',
      level: 35,
      type: 'cooldown'
    },

    // Spirit of Redemption
    20711: {
      name: 'Spirit of Redemption',
      kr: '구원의 영혼',
      level: 15,
      type: 'passive',
      icon: '/icons/ability_priest_auspiciousspirits.png'
    },

    // Circle of Healing
    204883: {
      name: 'Circle of Healing',
      kr: '치유의 마법진',
      level: 22,
      type: 'healing'
    },

    // Prayer of Mending
    33076: {
      name: 'Prayer of Mending',
      kr: '회복의 기원',
      level: 30,
      type: 'healing',
      icon: '/icons/ability_priest_bindingprayers.png'
    },

    // Holy Word: Serenity
    2050: {
      name: 'Holy Word: Serenity',
      kr: '빛의 권능: 평온',
      level: 20,
      type: 'healing',
      icon: '/icons/ability_priest_holywordlife.png'
    },

    // Holy Word: Sanctify
    34861: {
      name: 'Holy Word: Sanctify',
      kr: '빛의 권능: 신성화',
      level: 25,
      type: 'healing',
      icon: '/icons/ability_priest_holywordlife.png'
    },

    // Divine Hymn
    64843: {
      name: 'Divine Hymn',
      kr: '천상의 찬가',
      level: 50,
      type: 'cooldown',
      icon: '/icons/spell_priest_divinestar.png'
    },

    // Benediction
    193157: {
      name: 'Benediction',
      kr: '축도',
      level: 40,
      type: 'passive'
    },

    // Spiritual Guidance
    14892: {
      name: 'Spiritual Guidance',
      kr: '주문들',
      level: 15,
      type: 'passive',
      icon: '/icons/ability_priest_auspiciousspirits.png'
    },

    // Healing Focus
    390756: {
      name: 'Healing Focus',
      kr: '주문들',
      level: 25,
      type: 'passive'
    }
  },

  // 수양 전문화 (Discipline)
  discipline: {
    // Power Word: Shield
    17: {
      name: 'Power Word: Shield',
      kr: '권능: 보호막',
      level: 10,
      type: 'shielding',
      icon: '/icons/ability_priest_clarityofpower.png'
    },

    // Atonement
    194384: {
      name: 'Atonement',
      kr: '속죄',
      level: 10,
      type: 'passive',
      icon: '/icons/ability_priest_atonement.png'
    },

    // Penance
    47540: {
      name: 'Penance',
      kr: '회개',
      level: 20,
      type: 'healing'
    },

    // Pain Suppression
    33206: {
      name: 'Pain Suppression',
      kr: '고통 억제',
      level: 35,
      type: 'cooldown'
    },

    // Power Word: Barrier
    62618: {
      name: 'Power Word: Barrier',
      kr: '신의 권능: 방벽',
      level: 50,
      type: 'cooldown',
      icon: '/icons/ability_priest_clarityofpower.png'
    },

    // Rapture
    47536: {
      name: 'Rapture',
      kr: '환희',
      level: 40,
      type: 'cooldown'
    },

    // Shadow Mend
    186263: {
      name: 'Shadow Mend',
      kr: '주문들',
      level: 15,
      type: 'healing',
      icon: '/icons/ability_priest_cascade_shadow.png'
    },

    // Purge the Wicked
    204197: {
      name: 'Purge the Wicked',
      kr: '사악의 정화',
      level: 25,
      type: 'damage'
    },

    // Radiance
    81751: {
      name: 'Radiance',
      kr: '속죄',
      level: 30,
      type: 'healing'
    },

    // Grace
    271534: {
      name: 'Grace',
      kr: '특화: 은총',
      level: 15,
      type: 'passive',
      icon: '/icons/ability_priest_savinggrace.png'
    },

    // Evangelism
    246287: {
      name: 'Evangelism',
      kr: '주문들',
      level: 45,
      type: 'cooldown',
      icon: '/icons/ability_priest_evangelism.png'
    },

    // Twist of Fate
    109142: {
      name: 'Twist of Fate',
      kr: '뒤틀린 운명',
      level: 35,
      type: 'passive'
    },

    // Spirit Shell
    109964: {
      name: 'Spirit Shell',
      kr: '혼의 너울',
      level: 50,
      type: 'cooldown',
      icon: '/icons/ability_priest_auspiciousspirits.png'
    }
  },

  // 암흑 전문화 (Shadow)
  shadow: {
    // Shadow Word: Pain
    589: {
      name: 'Shadow Word: Pain',
      kr: '어둠의 권능: 고통',
      level: 10,
      type: 'damage',
      icon: '/icons/ability_priest_cascade_shadow.png'
    },

    // Mind Blast
    8092: {
      name: 'Mind Blast',
      kr: '정신 분열',
      level: 10,
      type: 'damage'
    },

    // Vampiric Touch
    34914: {
      name: 'Vampiric Touch',
      kr: '흡혈의 손길',
      level: 15,
      type: 'damage'
    },

    // Mind Flay
    15407: {
      name: 'Mind Flay',
      kr: '정신의 채찍',
      level: 10,
      type: 'damage'
    },

    // Shadowform
    232698: {
      name: 'Shadowform',
      kr: '어둠의 형상',
      level: 10,
      type: 'form',
      icon: '/icons/ability_priest_cascade_shadow.png'
    },

    // Void Eruption
    228260: {
      name: 'Void Eruption',
      kr: '공허 방출',
      level: 20,
      type: 'damage',
      icon: '/icons/ability_priest_voidentropy.png'
    },

    // Mind Control
    605: {
      name: 'Mind Control',
      kr: '정신 지배',
      level: 45,
      type: 'crowd_control'
    },

    // Psychic Horror
    64044: {
      name: 'Psychic Horror',
      kr: '정신적 두려움',
      level: 40,
      type: 'crowd_control',
      icon: '/icons/ability_priest_psychiclink.png'
    },

    // Void Tendrils
    108920: {
      name: 'Void Tendrils',
      kr: '공허의 촉수',
      level: 30,
      type: 'crowd_control',
      icon: '/icons/spell_priest_voidtendrils.png'
    },

    // Dispersion
    47585: {
      name: 'Dispersion',
      kr: '분산',
      level: 35,
      type: 'defensive'
    },

    // Shadow Word: Death
    32379: {
      name: 'Shadow Word: Death',
      kr: '어둠의 권능: 죽음',
      level: 25,
      type: 'damage',
      icon: '/icons/ability_priest_cascade_shadow.png'
    },

    // Void Bolt
    205448: {
      name: 'Void Bolt',
      kr: '공허의 화살',
      level: 20,
      type: 'damage'
    },

    // Devouring Plague
    335467: {
      name: 'Devouring Plague',
      kr: '파멸의 역병',
      level: 30,
      type: 'damage',
      icon: '/icons/ability_priest_pathofthedevout.png'
    },

    // Surrender to Madness
    319952: {
      name: 'Surrender to Madness',
      kr: '주문들',
      level: 50,
      type: 'cooldown'
    }
  },

  // 특성 (Talents)
  talents: {
    // Tier 15
    390767: {
      name: 'Enlightenment',
      kr: '축복받은 회복력',
      level: 15,
      type: 'passive'
    },

    200174: {
      name: 'Twist of Fate',
      kr: '환각의 마귀',
      level: 15,
      type: 'passive'
    },

    193155: {
      name: 'Trail of Light',
      kr: '깨달음',
      level: 15,
      type: 'passive'
    },

    // Tier 25
    200128: {
      name: 'Perseverance',
      kr: '빛의 흔적',
      level: 25,
      type: 'passive'
    },

    390785: {
      name: 'Angel of Mercy',
      kr: '원시 거북이 등껍질',
      level: 25,
      type: 'passive',
      icon: '/icons/ability_priest_angelicbulwark.png'
    },

    // Tier 30
    64129: {
      name: 'Body and Soul',
      kr: '육체와 영혼',
      level: 30,
      type: 'passive'
    },

    19236: {
      name: 'Desperate Prayer',
      kr: '구원의 기도',
      level: 30,
      type: 'defensive'
    },

    // Tier 35
    200209: {
      name: 'Censure',
      kr: '수호 천사',
      level: 35,
      type: 'passive'
    },

    390933: {
      name: 'Psychic Voice',
      kr: '독신자의 진언',
      level: 35,
      type: 'passive',
      icon: '/icons/ability_priest_psychiclink.png'
    },

    // Tier 40
    390978: {
      name: 'Improved Flash Heal',
      kr: '뒤틀린 운명',
      level: 40,
      type: 'passive'
    },

    64843: {
      name: 'Divine Hymn',
      kr: '천상의 찬가',
      level: 40,
      type: 'cooldown',
      icon: '/icons/spell_priest_divinestar.png'
    },

    // Tier 45
    390986: {
      name: 'Benediction',
      kr: '원시의 기원',
      level: 45,
      type: 'passive'
    },

    196985: {
      name: 'Apotheosis',
      kr: '나루의 빛',
      level: 45,
      type: 'cooldown'
    },

    // Tier 50
    265202: {
      name: 'Holy Word: Salvation',
      kr: '빛의 권능: 구원',
      level: 50,
      type: 'healing',
      icon: '/icons/ability_priest_holywordlife.png'
    }
  },

  // PvP 스킬
  pvp: {
    // Silence
    15487: {
      name: 'Silence',
      kr: '침묵',
      level: 47,
      type: 'interrupt',
      icon: '/icons/ability_priest_silence.png'
    },

    // Greater Fade
    213610: {
      name: 'Greater Fade',
      kr: '신성 수호',
      level: 49,
      type: 'utility'
    },

    // Void Shift
    108968: {
      name: 'Void Shift',
      kr: '공허의 전환',
      level: 51,
      type: 'utility',
      icon: '/icons/ability_priest_voidshift.png'
    },

    // Cardinal Mending
    328529: {
      name: 'Cardinal Mending',
      kr: '주문들',
      level: 53,
      type: 'healing'
    },

    // Strength of Soul
    197535: {
      name: 'Strength of Soul',
      kr: '굳건한 정신',
      level: 55,
      type: 'passive'
    },

    // Mind Trauma
    199445: {
      name: 'Mind Trauma',
      kr: '정신적 외상',
      level: 57,
      type: 'passive'
    }
  }
};

// 헬퍼 함수들
export function getWowDBPriestSkill(skillId) {
  const allCategories = [
    'baseline',
    'holy',
    'discipline',
    'shadow',
    'talents',
    'pvp'
  ];

  for (const category of allCategories) {
    if (wowdbPriestSkillsComplete[category] && wowdbPriestSkillsComplete[category][skillId]) {
      return {
        ...wowdbPriestSkillsComplete[category][skillId],
        category: category,
        id: skillId
      };
    }
  }
  return null;
}

export function getPriestSkillCount() {
  let total = 0;
  const categories = Object.keys(wowdbPriestSkillsComplete);

  for (const category of categories) {
    total += Object.keys(wowdbPriestSkillsComplete[category]).length;
  }

  return {
    total,
    baseline: Object.keys(wowdbPriestSkillsComplete.baseline).length,
    holy: Object.keys(wowdbPriestSkillsComplete.holy).length,
    discipline: Object.keys(wowdbPriestSkillsComplete.discipline).length,
    shadow: Object.keys(wowdbPriestSkillsComplete.shadow).length,
    talents: Object.keys(wowdbPriestSkillsComplete.talents).length,
    pvp: Object.keys(wowdbPriestSkillsComplete.pvp).length
  };
}

export function getPriestSkillsBySpec(spec) {
  const specMap = {
    'holy': 'holy',
    'discipline': 'discipline',
    'shadow': 'shadow'
  };

  const category = specMap[spec?.toLowerCase()];
  if (!category) return null;

  return {
    baseline: wowdbPriestSkillsComplete.baseline,
    specialization: wowdbPriestSkillsComplete[category],
    talents: wowdbPriestSkillsComplete.talents,
    pvp: wowdbPriestSkillsComplete.pvp
  };
}