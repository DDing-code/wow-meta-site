// WoW 스킬 아이콘 매핑 데이터
// 실제 Wowhead 아이콘 이름 매핑

export const iconMappings = {
  // 사냥꾼 (Hunter)
  hunter: {
    75: 'ability_hunter_focusedaim', // Auto Shot
    185358: 'ability_hunter_invigeration', // Arcane Shot
    257620: 'ability_hunter_multishot', // Multi-Shot
    53351: 'ability_hunter_killshot', // Kill Shot
    257284: 'spell_hunter_exoticmunitions_poisoned', // Hunter's Mark
    34026: 'ability_hunter_killcommand', // Kill Command
    883: 'ability_physical_taunt', // Call Pet
    982: 'ability_revive', // Revive Pet
    136: 'ability_druid_ferociousbite', // Mend Pet
    2641: 'ability_hunter_mendpet', // Dismiss Pet
    6991: 'ability_druid_bash', // Feed Pet
    1515: 'ability_rogue_trip', // Tame Beast
    1462: 'spell_nature_ravenform', // Beast Lore
    781: 'ability_rogue_feint', // Disengage
    186257: 'spell_nature_invisibilty', // Aspect of the Cheetah
    199483: 'ability_hunter_camouflage', // Camouflage
    5384: 'ability_rogue_feigndeath', // Feign Death
    6197: 'spell_arcane_teleportironforge', // Eagle Eye
    1543: 'ability_hunter_snipershot', // Flare
    1494: 'spell_nature_forceofnature', // Track Beasts
    186265: 'ability_hunter_aspectoftheviper', // Aspect of the Turtle
    19801: 'inv_ammo_arrow_02', // Tranquilizing Shot
    34477: 'ability_hunter_misdirection', // Misdirection
    187650: 'spell_frost_stun', // Freezing Trap
    187698: 'ability_hunter_cobrashot', // Tar Trap
    191433: 'spell_fire_selfdestruct', // Explosive Trap
    162488: 'spell_hunter_steelshot', // Steel Trap
    109248: 'ability_hunter_binding_shot', // Binding Shot
    13809: 'spell_nature_drowsy', // Ice Trap
    2782: 'ability_vanish', // Remove Corruption
  },

  // 도적 (Rogue)
  rogue: {
    1752: 'ability_rogue_sinisterstrike', // Sinister Strike
    196819: 'ability_rogue_eviscerate', // Eviscerate
    53: 'ability_backstab', // Backstab
    2098: 'ability_rogue_disembowel', // Dispatch
    1766: 'ability_kick', // Kick
    1776: 'ability_gouge', // Gouge
    703: 'ability_rogue_garrote', // Garrote
    921: 'ability_warrior_punishingblow', // Pick Pocket
    1725: 'ability_rogue_distract', // Distraction
    1784: 'ability_stealth', // Stealth
    115191: 'ability_stealth', // Stealth (subtlety)
    1856: 'ability_vanish', // Vanish
    5277: 'spell_shadow_antishadow', // Evasion
    31224: 'spell_shadow_shadowward', // Cloak of Shadows
    185311: 'ability_rogue_crimsonvial', // Crimson Vial
    2983: 'ability_rogue_sprint', // Sprint
    1833: 'spell_nature_earthbindtotem', // Cheap Shot
    408: 'ability_rogue_kidneyshot', // Kidney Shot
    6770: 'spell_shadow_mindsteal', // Sap
    2094: 'ability_sap', // Blind
  },

  // 사제 (Priest)
  priest: {
    589: 'spell_shadow_shadowwordpain', // Shadow Word: Pain
    585: 'spell_holy_holysmite', // Smite
    17: 'spell_holy_powerwordshield', // Power Word: Shield
    2061: 'spell_holy_flashheal', // Flash Heal
    2060: 'spell_holy_heal', // Heal
    2050: 'spell_holy_serenity', // Holy Word: Serenity
    33076: 'spell_holy_prayerofmendingtga', // Prayer of Mending
    139: 'spell_holy_renew', // Renew
    204197: 'spell_holy_purify', // Purge the Wicked
    47540: 'spell_holy_penance', // Penance
    194509: 'spell_holy_powerwordbarrier', // Power Word: Radiance
    34861: 'spell_holy_holybolt', // Holy Word: Sanctify
    64843: 'spell_holy_divineprovidence', // Divine Hymn
    64901: 'spell_holy_symbolofhope', // Symbol of Hope
    33206: 'spell_holy_painsupression', // Pain Suppression
    62618: 'spell_holy_powerwordbarrier', // Power Word: Barrier
    47536: 'spell_priest_angelicfeather', // Rapture
    586: 'spell_magic_lesserinvisibilty', // Fade
    605: 'spell_shadow_shadowworddominate', // Mind Control
    8122: 'spell_shadow_psychicscream', // Psychic Scream
    15487: 'spell_shadow_psychichorrors', // Silence
  },

  // 죽음의 기사 (Death Knight)
  deathknight: {
    49998: 'spell_deathknight_deathstrike', // Death Strike
    47541: 'spell_shadow_deathcoil', // Death Coil
    43265: 'spell_shadow_deathanddecay', // Death and Decay
    48707: 'spell_deathknight_antimagiczone', // Anti-Magic Shell
    48792: 'spell_deathknight_icebornfortitude', // Icebound Fortitude
    56222: 'spell_deathknight_darkcommand', // Dark Command
    49576: 'spell_shadow_grimward', // Death Grip
    45524: 'spell_deathknight_chainsofice', // Chains of Ice
    47528: 'ability_deathknight_mindfreeze', // Mind Freeze
    61999: 'spell_deathknight_raiseally', // Raise Ally
    46584: 'inv_sword_62', // Raise Dead
    50977: 'spell_shadow_animatedead', // Death Gate
    3714: 'spell_shadow_antimagicshell', // Path of Frost
    48265: 'spell_shadow_unholyvigor', // Death's Advance
  },

  // 주술사 (Shaman)
  shaman: {
    188196: 'spell_nature_lightning', // Lightning Bolt
    188389: 'spell_fire_flamebolt', // Flame Shock
    51505: 'spell_fire_lavaspawn', // Lava Burst
    8004: 'spell_nature_healingwavelesser', // Healing Surge
    77472: 'spell_nature_healingwavegreater', // Greater Healing Wave
    1064: 'spell_nature_riptide', // Riptide
    73899: 'spell_shaman_primalstrike', // Primal Strike
    17364: 'ability_shaman_stormstrike', // Stormstrike
    60103: 'ability_shaman_lavalash', // Lava Lash
    196840: 'spell_nature_focusedmind', // Frost Shock
    370: 'spell_nature_purge', // Purge
    51886: 'spell_nature_removedisease', // Cleanse Spirit
    2008: 'ability_shaman_ancestralspirit', // Ancestral Spirit
    556: 'spell_nature_astralrecal', // Astral Recall
    546: 'spell_nature_waterbreathing', // Water Walking
    131: 'spell_nature_waterbreathing', // Water Breathing
    6196: 'spell_nature_faeriefire', // Far Sight
  },

  // 마법사 (Mage)
  mage: {
    133: 'spell_fire_fireball02', // Fireball
    116: 'spell_frost_frostbolt02', // Frostbolt
    30451: 'spell_arcane_blast', // Arcane Blast
    2139: 'spell_frost_iceshock', // Counterspell
    1449: 'spell_arcane_blast', // Arcane Explosion
    120: 'spell_frost_glacier', // Cone of Cold
    122: 'spell_frost_nova', // Frost Nova
    130: 'spell_nature_slow', // Slow Fall
    1953: 'spell_arcane_blink', // Blink
    45438: 'spell_frost_frost', // Ice Block
    235313: 'spell_magearmor', // Blazing Barrier
    11426: 'spell_frost_frostarmor02', // Ice Barrier
    235450: 'spell_nature_starfall', // Prismatic Barrier
    30449: 'spell_nature_wispsplode', // Spellsteal
    66: 'spell_nature_invisibilty', // Invisibility
    110959: 'spell_magic_lesserinvisibilty', // Greater Invisibility
    759: 'spell_shadow_detectlesserinvisibility', // Conjure Mana Gem
    190336: 'inv_misc_food_73cinnamonroll', // Conjure Refreshment
  },

  // 흑마법사 (Warlock)
  warlock: {
    172: 'spell_shadow_abominationexplosion', // Corruption
    686: 'spell_shadow_shadowbolt', // Shadow Bolt
    348: 'spell_fire_immolation', // Immolate
    234153: 'spell_fire_fireball', // Drain Life
    755: 'spell_shadow_lifedrain02', // Health Funnel
    5782: 'spell_shadow_possession', // Fear
    710: 'spell_shadow_mindrot', // Banish
    30283: 'spell_shadow_shadowfury', // Shadowfury
    333889: 'spell_warlock_demonicempowerment', // Fel Domination
    1122: 'spell_shadow_summoninfernal', // Summon Infernal
    265187: 'warlock_summon_doomguard', // Summon Demonic Tyrant
    20707: 'spell_shadow_soulgem', // Soulstone
    698: 'spell_shadow_twilight', // Ritual of Summoning
    126: 'spell_holy_consumemagic', // Eye of Kilrogg
    48018: 'spell_shadow_demoniccircleteleport', // Demonic Circle
    104773: 'spell_warlock_unendingbreath', // Unending Resolve
    29893: 'spell_shadow_gathershadows', // Create Soulwell
  },

  // 수도사 (Monk)
  monk: {
    100780: 'monk_ability_jab', // Tiger Palm
    100784: 'ability_monk_blackoutkick', // Blackout Kick
    107428: 'ability_monk_risingsunkick', // Rising Sun Kick
    101546: 'ability_monk_spinningcranekick', // Spinning Crane Kick
    116705: 'ability_monk_spearhand', // Spear Hand Strike
    115078: 'ability_monk_paralysis', // Paralysis
    109132: 'ability_monk_roll', // Roll
    115008: 'ability_monk_chitorpedo', // Chi Torpedo
    116670: 'ability_monk_vivify', // Vivify
    115151: 'spell_monk_renewingmists', // Renewing Mist
    116849: 'spell_monk_lifecocoon', // Life Cocoon
    322109: 'ability_monk_touchofdeath', // Touch of Death
    119381: 'ability_monk_legsweep', // Leg Sweep
    115203: 'ability_monk_fortifyingbrew', // Fortifying Brew
    115176: 'spell_monk_zenpilgrimage', // Zen Meditation
    126892: 'spell_priest_specleap', // Zen Pilgrimage
  },

  // 드루이드 (Druid)
  druid: {
    8921: 'spell_nature_starfall', // Moonfire
    93402: 'spell_nature_starfall', // Sunfire
    5176: 'spell_nature_abolishmagic', // Wrath
    190984: 'spell_arcane_starfire', // Solar Wrath
    194153: 'spell_nature_stormreach', // Lunar Strike
    5487: 'ability_racial_bearform', // Bear Form
    768: 'ability_druid_catform', // Cat Form
    783: 'ability_druid_travelform', // Travel Form
    24858: 'ability_druid_moonkin', // Moonkin Form
    5215: 'ability_druid_prowl', // Prowl
    1850: 'ability_druid_dash', // Dash
    2782: 'spell_nature_nullifydisease', // Remove Corruption
    20484: 'spell_nature_reincarnation', // Rebirth
    1126: 'spell_nature_regeneration', // Mark of the Wild
    5221: 'ability_druid_mangle2', // Shred
    22568: 'ability_druid_ferociousbite', // Ferocious Bite
    1079: 'ability_druid_disembowel', // Rip
    1822: 'spell_druid_rake', // Rake
  },

  // 악마사냥꾼 (Demon Hunter)
  demonhunter: {
    162794: 'ability_demonhunter_chaosstrike', // Chaos Strike
    188499: 'ability_demonhunter_bladedance', // Blade Dance
    198013: 'ability_demonhunter_eyebeam', // Eye Beam
    162243: 'ability_demonhunter_demonsbite', // Demon's Bite
    195072: 'ability_demonhunter_felrush', // Fel Rush
    198793: 'ability_demonhunter_vengefulretreat', // Vengeful Retreat
    192611: 'ability_demonhunter_metamorphasisdps', // Metamorphosis
    183752: 'ability_demonhunter_consume', // Consume Magic
    188501: 'ability_demonhunter_spectralsight', // Spectral Sight
    278326: 'ability_demonhunter_consumemagic', // Consume Magic
    204021: 'ability_demonhunter_fierybrand', // Fiery Brand
    207684: 'ability_demonhunter_sigilofinquisition', // Sigil of Misery
    202137: 'ability_demonhunter_sigilofsilence', // Sigil of Silence
    202138: 'ability_demonhunter_sigilofchains', // Sigil of Chains
    204596: 'ability_demonhunter_sigilofflame', // Sigil of Flame
    217832: 'ability_demonhunter_imprison', // Imprison
  },

  // 기원사 (Evoker)
  evoker: {
    361469: 'ability_evoker_livingflame', // Living Flame
    357208: 'ability_evoker_firebreath', // Fire Breath
    362969: 'ability_evoker_azurestrke', // Azure Strike
    357210: 'ability_evoker_deepbreath', // Deep Breath
    358385: 'ability_evoker_landslide', // Landslide
    357214: 'ability_evoker_wingbuffet', // Wing Buffet
    368432: 'ability_evoker_unravel', // Unravel
    360806: 'ability_evoker_sleepwalk', // Sleep Walk
    361227: 'ability_evoker_return', // Return
    358267: 'ability_evoker_hover', // Hover
    368970: 'ability_evoker_tailswipe', // Tail Swipe
    351338: 'ability_evoker_quell', // Quell
    360995: 'ability_evoker_emeraldblossom', // Emerald Blossom
    355936: 'ability_evoker_dreamflight', // Dream Flight
    357170: 'ability_evoker_timedilation', // Time Dilation
  }
};

// ID로 아이콘 가져오기
export function getIconBySkillId(className, skillId) {
  const classIcons = iconMappings[className.toLowerCase()];
  if (!classIcons) return null;
  return classIcons[skillId] || null;
}

// 모든 클래스 아이콘 가져오기
export function getAllIconMappings() {
  const allMappings = {};
  Object.keys(iconMappings).forEach(className => {
    Object.entries(iconMappings[className]).forEach(([skillId, iconName]) => {
      allMappings[skillId] = iconName;
    });
  });
  return allMappings;
}