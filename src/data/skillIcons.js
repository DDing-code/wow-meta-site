// 스킬 아이콘 매핑
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)

export const skillIcons = {
  // 전사 공통 스킬 아이콘
  warrior: {
    // 이동기 - 실제 스킬 ID 사용
    100: 'Ability_Warrior_Charge.tga', // Charge
    6544: 'Ability_Warrior_BullRush.tga', // Heroic Leap

    // 방어/유틸리티
    6552: 'Ability_Warrior_ShieldBash.tga', // Pummel
    6673: 'Ability_Warrior_BattleShout.tga', // Battle Shout
    97462: 'Ability_Warrior_RallyingCry.tga', // Rallying Cry
    18499: 'Ability_Warrior_EndlessRage.tga', // Berserker Rage
    34428: 'Ability_Warrior_VictoryRush.tga', // Victory Rush
    5308: 'Ability_Warrior_SavageBlow.tga', // Execute
    1715: 'Ability_Warrior_UnrelentingAssault.tga', // Hamstring
    1680: 'Ability_Warrior_Bladestorm.tga', // Whirlwind
    57755: 'Ability_Warrior_Throwdown.tga', // Heroic Throw
    5246: 'Ability_Warrior_WarCry.tga', // Intimidating Shout
    23920: 'Ability_Warrior_ShieldReflection.tga', // Spell Reflection
    2458: 'Ability_Warrior_OffensiveStance.tga', // Berserker Stance
    71: 'Ability_Warrior_DefensiveStance.tga', // Defensive Stance

    // 무기 전문화
    12294: 'Ability_Warrior_DecisiveStrike.tga', // Mortal Strike
    167105: 'Ability_Warrior_ColossusSmash.tga', // Colossus Smash
    7384: 'Ability_Warrior_Trauma.tga', // Overpower
    227847: 'Ability_Warrior_Bladestorm.tga', // Bladestorm
    260708: 'Ability_Warrior_WeaponMastery.tga', // Sweeping Strikes
    118038: 'Ability_Warrior_Riposte.tga', // Die by the Sword
    772: 'Ability_Warrior_BloodFrenzy.tga', // Rend
    845: 'Ability_Warrior_Cleave.tga', // Cleave
    262161: 'Ability_Warrior_ColossusSmash.tga', // Warbreaker
    260643: 'Ability_Warrior_Sunder.tga', // Skullsplitter

    // 분노 전문화
    23881: 'Ability_Warrior_Bloodsurge.tga', // Bloodthirst
    85288: 'Ability_Warrior_Rampage.tga', // Raging Blow
    184367: 'Ability_Warrior_Rampage.tga', // Rampage
    184364: 'Ability_Warrior_RenewedVigor.tga', // Enraged Regeneration
    315720: 'Ability_Warrior_InnerRage.tga', // Onslaught
    385059: 'Ability_Warrior_DragonRoar.tga', // Odyn's Fury

    // 기타 스킬들 (기존 키 유지)
    charge: 'Ability_Warrior_Charge.tga',
    heroic_leap: 'Ability_Warrior_BullRush.tga',
    pummel: 'Ability_Warrior_ShieldBash.tga',
    battle_shout: 'Ability_Warrior_BattleShout.tga',
    rallying_cry: 'Ability_Warrior_RallyingCry.tga',
    berserker_rage: 'Ability_Warrior_EndlessRage.tga',
    victory_rush: 'Ability_Warrior_VictoryRush.tga',
    execute: 'Ability_Warrior_SavageBlow.tga',
    hamstring: 'Ability_Warrior_UnrelentingAssault.tga',
    whirlwind: 'Ability_Warrior_Bladestorm.tga',
    heroic_throw: 'Ability_Warrior_Throwdown.tga',
    intimidating_shout: 'Ability_Warrior_WarCry.tga',
    spell_reflection: 'Ability_Warrior_ShieldReflection.tga',
    berserker_stance: 'Ability_Warrior_OffensiveStance.tga',
    defensive_stance: 'Ability_Warrior_DefensiveStance.tga',

    // 무기 전문화
    mortal_strike: 'Ability_Warrior_DecisiveStrike.tga',
    colossus_smash: 'Ability_Warrior_ColossusSmash.tga',
    overpower: 'Ability_Warrior_Trauma.tga',
    bladestorm: 'Ability_Warrior_Bladestorm.tga',
    sweeping_strikes: 'Ability_Warrior_WeaponMastery.tga',
    die_by_the_sword: 'Ability_Warrior_Riposte.tga',
    rend: 'Ability_Warrior_BloodFrenzy.tga',
    cleave: 'Ability_Warrior_Cleave.tga',
    warbreaker: 'Ability_Warrior_ColossusSmash.tga',
    skullsplitter: 'Ability_Warrior_Sunder.tga',

    // 분노 전문화
    bloodthirst: 'Ability_Warrior_Bloodsurge.tga',
    raging_blow: 'Ability_Warrior_Rampage.tga',
    rampage: 'Ability_Warrior_Rampage.tga',
    enraged_regeneration: 'Ability_Warrior_RenewedVigor.tga',
    onslaught: 'Ability_Warrior_InnerRage.tga',
    odyns_fury: 'Ability_Warrior_DragonRoar.tga',

    // 방어 전문화
    23922: 'Ability_Warrior_ShieldCharge.tga', // Shield Slam
    2565: 'Ability_Warrior_ShieldGuard.tga', // Shield Block
    6572: 'Ability_Warrior_Revenge.tga', // Revenge
    6343: 'Ability_Warrior_Shockwave.tga', // Thunder Clap
    46968: 'Ability_Warrior_Shockwave.tga', // Shockwave
    12975: 'Ability_Warrior_StalwartProtector.tga', // Last Stand
    871: 'Ability_Warrior_ShieldWall.tga', // Shield Wall
    401150: 'Ability_Warrior_TitansGrip.tga', // Avatar
    228920: 'Ability_Warrior_Bladestorm.tga', // Ravager

    // PvP 특성
    236077: 'Ability_Warrior_Disarm.tga', // 무장 해제
    198817: 'Ability_Warrior_SharpenBlade.tga', // 칼날 연마
    236320: 'Ability_Warrior_WarBanner.tga', // 전쟁 깃발

    // 기존 키 유지 (호환성)
    shield_slam: 'Ability_Warrior_ShieldCharge.tga',
    shield_block: 'Ability_Warrior_ShieldGuard.tga',
    revenge: 'Ability_Warrior_Revenge.tga',
    thunder_clap: 'Ability_Warrior_Shockwave.tga',
    shockwave: 'Ability_Warrior_Shockwave.tga',
    last_stand: 'Ability_Warrior_StalwartProtector.tga',
    shield_wall: 'Ability_Warrior_ShieldWall.tga',
    avatar: 'Ability_Warrior_TitansGrip.tga',
    ravager: 'Ability_Warrior_Bladestorm.tga',

    // 기본 아이콘 (스킬 아이콘이 없는 경우)
    default: 'inv_misc_questionmark.tga'
  },

  // 성기사 스킬 아이콘
  paladin: {
    // Numeric ID mappings
    20271: 'Spell_Holy_RighteousFury.tga', // Judgment
    24275: 'Ability_ThunderClap.tga', // Hammer of Wrath
    26573: 'Spell_Holy_InnerFire.tga', // Consecration
    642: 'Spell_Holy_DivineIntervention.tga', // Divine Shield
    498: 'Spell_Holy_Restoration.tga', // Divine Protection
    633: 'Spell_Holy_LayOnHands.tga', // Lay on Hands
    1044: 'Spell_Holy_SealOfValor.tga', // Blessing of Freedom
    1022: 'Spell_Holy_SealOfProtection.tga', // Blessing of Protection
    6940: 'Spell_Holy_SealOfSacrifice.tga', // Blessing of Sacrifice
    204018: 'Spell_Holy_SealOfWarding.tga', // Blessing of Spellwarding
    19750: 'Spell_Holy_FlashHeal.tga', // Flash of Light
    82326: 'Spell_Holy_HolyBolt.tga', // Holy Light
    85673: 'Spell_Paladin_WordOfGlory.tga', // Word of Glory
    853: 'Ability_Paladin_HammerOfJustice.tga', // Hammer of Justice
    96231: 'Ability_Paladin_Rebuke.tga', // Rebuke
    62124: 'Spell_Holy_SealOfMight.tga', // Hand of Reckoning
    4987: 'Spell_Holy_NullifyDisease.tga', // Cleanse
    190784: 'Ability_Paladin_DivineSteed.tga', // Divine Steed
    465: 'Spell_Holy_DevotionAura.tga', // Devotion Aura
    183435: 'Spell_Holy_AuraOfLight.tga', // Retribution Aura
    32223: 'Spell_Holy_CrusaderAura.tga', // Crusader Aura
    317920: 'Spell_Holy_MindSoothe.tga', // Concentration Aura

    // Retribution
    184575: 'Ability_Paladin_BladeOfJustice.tga', // Blade of Justice
    85256: 'Spell_Paladin_TemplarsVerdict.tga', // Templar's Verdict
    198038: 'Spell_Paladin_FinalVerdict.tga', // Final Verdict
    53385: 'Spell_Paladin_DivineStorm.tga', // Divine Storm
    255937: 'Inv_Sword_2h_ArtifactAshbringer.tga', // Wake of Ashes
    31884: 'Spell_Holy_AvengingWrath.tga', // Avenging Wrath
    231895: 'Ability_Paladin_Crusade.tga', // Crusade
    343527: 'Spell_Paladin_ExecutionSentence.tga', // Execution Sentence

    // Protection
    53600: 'Ability_Paladin_ShieldOfTheRighteous.tga', // Shield of the Righteous
    31935: 'Spell_Holy_AvengersShield.tga', // Avenger's Shield
    204019: 'Ability_Paladin_BlessedHammer.tga', // Blessed Hammer
    86659: 'Spell_Holy_HolyGuidance.tga', // Guardian of Ancient Kings
    31850: 'Spell_Holy_ArdentDefender.tga', // Ardent Defender
    327193: 'Ability_Paladin_MomentOfGlory.tga', // Moment of Glory

    // Holy
    20473: 'Spell_Holy_SearingLight.tga', // Holy Shock
    53651: 'Ability_Paladin_BeaconOfLight.tga', // Beacon of Light
    156910: 'Ability_Paladin_BeaconOfFaith.tga', // Beacon of Faith
    85222: 'Spell_Paladin_LightOfDawn.tga', // Light of Dawn
    216331: 'Spell_Paladin_AvengingCrusader.tga', // Avenging Crusader
    114158: 'Ability_Paladin_LightsHammer.tga', // Light's Hammer
    105809: 'Ability_Paladin_HolyAvenger.tga', // Holy Avenger

    // Keep existing string mappings for compatibility
    judgment: 'Spell_Holy_RighteousFury.tga',
    hammer_of_wrath: 'Ability_ThunderClap.tga',
    consecration: 'Spell_Holy_InnerFire.tga',
    divine_shield: 'Spell_Holy_DivineIntervention.tga',
    divine_protection: 'Spell_Holy_Restoration.tga',
    lay_on_hands: 'Spell_Holy_LayOnHands.tga',
    blessing_of_freedom: 'Spell_Holy_SealOfValor.tga',
    blessing_of_protection: 'Spell_Holy_SealOfProtection.tga',
    blessing_of_sacrifice: 'Spell_Holy_SealOfSacrifice.tga',

    // 징벌
    blade_of_justice: 'Ability_Paladin_BladeOfJustice.tga',
    wake_of_ashes: 'Inv_Sword_2h_ArtifactAshbringer.tga',
    templars_verdict: 'Spell_Paladin_TemplarsVerdict.tga',
    final_verdict: 'Spell_Paladin_FinalVerdict.tga',
    execution_sentence: 'Spell_Paladin_ExecutionSentence.tga',
    crusade: 'Ability_Paladin_Crusade.tga',
    avenging_wrath: 'Spell_Holy_AvengingWrath.tga',

    // 신성
    holy_shock: 'Spell_Holy_SearingLight.tga',
    holy_light: 'Spell_Holy_HolyBolt.tga',
    flash_of_light: 'Spell_Holy_FlashHeal.tga',
    light_of_dawn: 'Spell_Paladin_LightOfDawn.tga',
    beacon_of_light: 'Ability_Paladin_BeaconOfLight.tga',
    holy_prism: 'Spell_Paladin_HolyPrism.tga',

    // 방어
    avengers_shield: 'Spell_Holy_AvengersShield.tga',
    shield_of_the_righteous: 'Ability_Paladin_ShieldOfTheRighteous.tga',
    blessed_hammer: 'Ability_Paladin_BlessedHammer.tga',
    guardian_of_ancient_kings: 'Spell_Holy_HolyGuidance.tga',
    ardent_defender: 'Spell_Holy_ArdentDefender.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 사냥꾼 스킬 아이콘
  hunter: {
    // Numeric ID mappings
    75: 'Ability_Hunter_AutoShot.tga', // Auto Shot
    185358: 'Ability_Hunter_ArcaneShot.tga', // Arcane Shot
    257620: 'Ability_Hunter_MultiShot.tga', // Multi-Shot
    53351: 'Ability_Hunter_KillShot.tga', // Kill Shot
    257284: 'Ability_Hunter_SniperShot.tga', // Hunter's Mark
    34026: 'Ability_Hunter_KillCommand.tga', // Kill Command
    883: 'Ability_Hunter_BeastCall.tga', // Call Pet
    982: 'Ability_Hunter_BeastSoothe.tga', // Revive Pet
    136: 'Ability_Hunter_MendPet.tga', // Mend Pet
    2641: 'Spell_Nature_SpiritWolf.tga', // Dismiss Pet
    6991: 'Ability_Hunter_BeastTraining.tga', // Feed Pet
    1515: 'Ability_Hunter_BeastTaming.tga', // Tame Beast
    1462: 'Ability_Hunter_BeastLore.tga', // Beast Lore
    781: 'Ability_Rogue_Feint.tga', // Disengage
    186257: 'Ability_Mount_JungleTiger.tga', // Aspect of the Cheetah
    199483: 'Ability_Stealth.tga', // Camouflage
    5384: 'Ability_Rogue_FeignDeath.tga', // Feign Death
    6197: 'Ability_Hunter_EagleEye.tga', // Eagle Eye
    1543: 'Spell_Fire_Flare.tga', // Flare
    1494: 'Ability_Hunter_Track.tga', // Track
    186265: 'Ability_Hunter_AspectOfTheTurtle.tga', // Aspect of the Turtle
    19801: 'Spell_Nature_Slow.tga', // Tranquilizing Shot
    34477: 'Ability_Hunter_Misdirection.tga', // Misdirection
    187650: 'Spell_Frost_ChainsOfIce.tga', // Freezing Trap
    187698: 'Spell_Yorsahj_Bloodboil_Black.tga', // Tar Trap
    191433: 'Spell_Fire_SelfDestruct.tga', // Explosive Trap
    162488: 'Ability_Hunter_SteelTrap.tga', // Steel Trap
    109248: 'Ability_Hunter_BindingShot.tga', // Binding Shot
    13809: 'Spell_Frost_FrostTrap.tga', // Frost Trap
    2782: 'Spell_Nature_NullifyPoison.tga', // Remove Corruption
    109304: 'Ability_Hunter_OneWithNature.tga', // Exhilaration
    147362: 'Ability_Hunter_CounterShot.tga', // Counter Shot
    186387: 'Ability_Hunter_BurstingShot.tga', // Bursting Shot
    19577: 'Ability_Hunter_Intimidation.tga', // Intimidation

    // Keep existing string mappings for compatibility
    hunters_mark: 'Ability_Hunter_SniperShot.tga',
    aspect_of_the_cheetah: 'Ability_Mount_JungleTiger.tga',
    aspect_of_the_turtle: 'Ability_Hunter_AspectOfTheTurtle.tga',
    exhilaration: 'Ability_Hunter_OneWithNature.tga',
    survival_of_the_fittest: 'Spell_Nature_SpiritWolf.tga',
    disengage: 'Ability_Rogue_Feint.tga',

    // 야수
    barbed_shot: 'Ability_Hunter_BarbedShot.tga',
    kill_command: 'Ability_Hunter_KillCommand.tga',
    bestial_wrath: 'Ability_Druid_FerociousBite.tga',
    aspect_of_the_wild: 'Spell_Nature_ProtectionFromNature.tga',
    dire_beast: 'Ability_Hunter_DireBeast.tga',
    cobra_shot: 'Ability_Hunter_CobraShot.tga',

    // 사격
    aimed_shot: 'Inv_Spear_07.tga',
    rapid_fire: 'Ability_Hunter_RunningShot.tga',
    trueshot: 'Ability_TrueShot.tga',
    double_tap: 'Ability_Hunter_DoubleTap.tga',
    explosive_shot: 'Ability_Hunter_ExplosiveShot.tga',
    steady_shot: 'Ability_Hunter_SteadyShot.tga',

    // 생존
    wildfire_bomb: 'Inv_Wildfirebomb.tga',
    mongoose_bite: 'Ability_Hunter_RaptorStrike.tga',
    flanking_strike: 'Ability_Warrior_BloodBath.tga',
    coordinated_assault: 'Inv_Coordinatedassault.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 도적 스킬 아이콘
  rogue: {
    // Numeric ID mappings
    6603: 'Ability_MeleeAttack.tga', // Auto Attack
    193315: 'Ability_Rogue_SinisterStrike.tga', // Sinister Strike
    196819: 'Ability_Rogue_Eviscerate.tga', // Eviscerate
    5938: 'Ability_Rogue_Shiv.tga', // Shiv
    1833: 'Ability_CheapShot.tga', // Cheap Shot
    408: 'Ability_Rogue_KidneyShot.tga', // Kidney Shot
    1784: 'Ability_Stealth.tga', // Stealth
    1856: 'Ability_Vanish.tga', // Vanish
    31224: 'Spell_Shadow_NetherCloak.tga', // Cloak of Shadows
    36554: 'Ability_Rogue_Shadowstep.tga', // Shadowstep
    185438: 'Ability_Rogue_Shadowstrike.tga', // Shadowstrike
    185313: 'Ability_Rogue_ShadowDance.tga', // Shadow Dance
    74001: 'Ability_Rogue_CombatReadiness.tga', // Combat Readiness
    315496: 'Ability_Rogue_SliceAndDice.tga', // Slice and Dice
    8647: 'Ability_Warrior_Riposte.tga', // Expose Armor
    1943: 'Ability_Rogue_Rupture.tga', // Rupture
    5277: 'Spell_Shadow_ShadowWard.tga', // Evasion
    31230: 'Spell_Shadow_DeathPact.tga', // Cheat Death
    185311: 'Ability_Rogue_CrimsonVial.tga', // Crimson Vial

    // Keep existing string mappings for compatibility
    stealth: 'Ability_Stealth.tga',
    vanish: 'Ability_Vanish.tga',
    cheap_shot: 'Ability_CheapShot.tga',
    kidney_shot: 'Ability_Rogue_KidneyShot.tga',
    shadowstep: 'Ability_Rogue_Shadowstep.tga',
    sprint: 'Ability_Rogue_Sprint.tga',
    evasion: 'Spell_Shadow_ShadowWard.tga',
    cloak_of_shadows: 'Spell_Shadow_NetherCloak.tga',

    // 암살
    mutilate: 'Ability_Rogue_ShadowStrikes.tga',
    envenom: 'Ability_Rogue_Disembowel.tga',
    garrote: 'Ability_Rogue_Garrote.tga',
    vendetta: 'Ability_Rogue_Vendetta.tga',
    toxic_blade: 'Inv_Knife_1h_PVPRogueS3_A_01.tga',

    // 무법
    blade_flurry: 'Ability_Warrior_PunishingBlow.tga',
    between_the_eyes: 'Inv_Weapon_Rifle_01.tga',
    blade_rush: 'Ability_Warrior_BladeStorm.tga',
    adrenaline_rush: 'Spell_Shadow_ShadowWordDominate.tga',
    roll_the_bones: 'Ability_Rogue_RollTheBones.tga',

    // 잠행
    shadowstrike: 'Ability_Rogue_Shadowstrike.tga',
    shadow_dance: 'Ability_Rogue_ShadowDance.tga',
    symbols_of_death: 'Spell_Shadow_RagingScream.tga',
    shadow_blades: 'Inv_Knife_1h_GrimBatol_C_03.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 사제 스킬 아이콘
  priest: {
    // Numeric ID mappings
    2061: 'Spell_Holy_FlashHeal.tga', // Flash Heal
    2060: 'Spell_Holy_Heal.tga', // Heal
    139: 'Spell_Holy_Renew.tga', // Renew
    17: 'Spell_Holy_PowerWordShield.tga', // Power Word: Shield
    596: 'Spell_Holy_PrayerOfHealing.tga', // Prayer of Healing
    194509: 'Spell_Holy_PowerWordRadiance.tga', // Power Word: Radiance
    586: 'Spell_Shadow_ShadowWordPain.tga', // Shadow Word: Pain
    21562: 'Spell_Shadow_UnholyFrenzy.tga', // Mind Blast
    2006: 'Spell_Holy_Resurrection.tga', // Resurrection
    212036: 'Spell_Shadow_ShadowMend.tga', // Shadow Mend
    605: 'Spell_Shadow_PsychicScream.tga', // Psychic Scream
    8122: 'Spell_Shadow_PsychicScream.tga', // Psychic Scream
    528: 'Spell_Holy_CureDisease.tga', // Dispel Magic
    32375: 'Spell_Shadow_Shadowfiend.tga', // Mass Dispel
    527: 'Spell_Nature_NullifyDisease.tga', // Dispel Magic

    // Keep existing string mappings for compatibility
    power_word_shield: 'Spell_Holy_PowerWordShield.tga',
    shadow_word_pain: 'Spell_Shadow_ShadowWordPain.tga',
    psychic_scream: 'Spell_Shadow_PsychicScream.tga',
    fade: 'Spell_Magic_LesserInvisibility.tga',
    dispel_magic: 'Spell_Nature_NullifyDisease.tga',

    // 수양
    power_word_radiance: 'Spell_Holy_PowerWordRadiance.tga',
    shadow_mend: 'Spell_Shadow_ShadowMend.tga',
    pain_suppression: 'Spell_Holy_PainSupression.tga',
    power_word_barrier: 'Spell_Holy_PowerWordBarrier.tga',
    evangelism: 'Spell_Holy_DivineProvidence.tga',

    // 신성
    holy_word_serenity: 'Spell_Holy_Persuitofjustice.tga',
    holy_word_sanctify: 'Spell_Holy_DivinePurpose.tga',
    divine_star: 'Spell_Priest_DivineStar.tga',
    guardian_spirit: 'Spell_Holy_GuardianSpirit.tga',

    // 암흑
    mind_blast: 'Spell_Shadow_UnholyFrenzy.tga',
    vampiric_touch: 'Spell_Holy_Stoicism.tga',
    devouring_plague: 'Spell_Shadow_DevouringPlague.tga',
    shadowfiend: 'Spell_Shadow_Shadowfiend.tga',
    void_eruption: 'Spell_Priest_VoidEruption.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 죽음의 기사 스킬 아이콘
  deathknight: {
    // Numeric ID mappings
    6603: 'Ability_MeleeAttack.tga', // Auto Attack
    49998: 'Spell_DeathKnight_ButcherStrike.tga', // Death Strike
    43265: 'Spell_Shadow_DeathAndDecay.tga', // Death and Decay
    49576: 'Spell_DeathKnight_Strangulate.tga', // Death Grip
    47528: 'Spell_DeathKnight_MindFreeze.tga', // Mind Freeze
    56222: 'Spell_Shadow_DeathCoil.tga', // Dark Command

    // Keep existing string mappings for compatibility
    death_grip: 'Spell_DeathKnight_Strangulate.tga',
    death_and_decay: 'Spell_Shadow_DeathAndDecay.tga',
    anti_magic_shell: 'Spell_Shadow_AntiMagicShell.tga',
    icebound_fortitude: 'Spell_DeathKnight_IceboundFortitude.tga',

    // 혈기
    blood_boil: 'Spell_DeathKnight_BloodBoil.tga',
    marrowrend: 'Ability_DeathKnight_Marrowrend.tga',
    death_strike: 'Spell_DeathKnight_ButcherStrike.tga',
    vampiric_blood: 'Spell_Shadow_LifeDrain.tga',
    dancing_rune_weapon: 'Inv_Sword_07.tga',

    // 냉기
    obliterate: 'Spell_DeathKnight_ClassicObliterate.tga',
    frost_strike: 'Spell_DeathKnight_EmpowerRuneBlade2.tga',
    pillar_of_frost: 'Ability_DeathKnight_PillarOfFrost.tga',
    remorseless_winter: 'Ability_DeathKnight_RemorselessWinters.tga',
    breath_of_sindragosa: 'Spell_DeathKnight_BreathOfSindragosa.tga',

    // 부정
    festering_strike: 'Spell_DeathKnight_FesteringStrike.tga',
    death_coil: 'Spell_Shadow_DeathCoil.tga',
    apocalypse: 'ArtifactAbility_UnholyDK_DeathsEmbrace.tga',
    army_of_the_dead: 'Spell_DeathKnight_ArmyOfTheDead.tga',
    unholy_assault: 'Spell_Shadow_Shadowfiend.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 주술사 스킬 아이콘
  shaman: {
    // Numeric ID mappings
    6603: 'Ability_MeleeAttack.tga', // Auto Attack
    188196: 'Spell_Nature_LightningBolt.tga', // Lightning Bolt
    188443: 'Spell_Nature_ChainLightning.tga', // Chain Lightning
    188389: 'Spell_Fire_LavaSpawn.tga', // Flame Shock
    196840: 'Spell_Nature_FrostShock.tga', // Frost Shock
    8042: 'Spell_Nature_EarthShock.tga', // Earth Shock
    370: 'Spell_Nature_Purge.tga', // Purge
    57994: 'Spell_Nature_WindWalk.tga', // Wind Shear

    // Keep existing string mappings for compatibility
    bloodlust: 'Spell_Nature_BloodLust.tga',
    heroism: 'Ability_Shaman_Heroism.tga',
    astral_shift: 'Ability_Shaman_AstralShift.tga',
    earth_elemental: 'Spell_Nature_EarthElemental.tga',
    healing_stream_totem: 'Inv_Spear_04.tga',

    // 정기
    lava_burst: 'Spell_Shaman_LavaBurst.tga',
    chain_lightning: 'Spell_Nature_ChainLightning.tga',
    elemental_blast: 'Spell_Fire_ElementalDevastation.tga',
    stormkeeper: 'Ability_Thunderking_LightningWhip.tga',
    fire_elemental: 'Spell_Fire_Elemental_Totem.tga',

    // 고양
    stormstrike: 'Ability_Shaman_StormStrike.tga',
    lava_lash: 'Ability_Shaman_LavaLash.tga',
    crash_lightning: 'Spell_Nature_CrashLightningBolt.tga',
    windfury_weapon: 'Spell_Nature_Cyclone.tga',
    feral_spirit: 'Spell_Shaman_FeralSpirit.tga',

    // 복원
    chain_heal: 'Spell_Nature_HealingWaveGreater.tga',
    riptide: 'Spell_Nature_Riptide.tga',
    healing_rain: 'Spell_Nature_GiftOfTheWaterSpirit.tga',
    spirit_link_totem: 'Spell_Shaman_SpiritLink.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 마법사 스킬 아이콘
  mage: {
    // Numeric ID mappings
    6603: 'Ability_MeleeAttack.tga', // Auto Attack
    2948: 'Spell_Fire_Scorch.tga', // Scorch
    116: 'Spell_Frost_FrostBolt02.tga', // Frostbolt
    44425: 'Spell_Arcane_Arcane01.tga', // Arcane Barrage
    1459: 'Spell_Arcane_Blast.tga', // Arcane Blast
    118: 'Spell_Nature_Polymorph.tga', // Polymorph
    2139: 'Spell_Frost_IceShock.tga', // Counterspell
    30449: 'Spell_Arcane_Blink.tga', // Spellsteal

    // Keep existing string mappings for compatibility
    blink: 'Spell_Arcane_Blink.tga',
    ice_block: 'Spell_Frost_Frost.tga',
    counterspell: 'Spell_Frost_IceShock.tga',
    time_warp: 'Ability_Mage_TimeWarp.tga',
    mirror_image: 'Spell_Magic_LesserInvisibility.tga',

    // 비전
    arcane_blast: 'Spell_Arcane_Blast.tga',
    arcane_missiles: 'Spell_Nature_StarFall.tga',
    arcane_barrage: 'Ability_Mage_ArcaneBarrage.tga',
    arcane_power: 'Spell_Nature_Lightning.tga',
    evocation: 'Spell_Nature_Purge.tga',

    // 화염
    fireball: 'Spell_Fire_FireBolt02.tga',
    pyroblast: 'Spell_Fire_Fireball02.tga',
    phoenix_flames: 'ArtifactAbility_FireMage_PhoenixBolt.tga',
    combustion: 'Spell_Fire_SealOfFire.tga',
    meteor: 'Spell_Mage_Meteor.tga',

    // 냉기
    frostbolt: 'Spell_Frost_FrostBolt02.tga',
    ice_lance: 'Spell_Frost_FrostBlast.tga',
    frozen_orb: 'Spell_Frost_FrozenOrb.tga',
    icy_veins: 'Spell_Frost_ColdhearteD.tga',
    ray_of_frost: 'Ability_Mage_RayOfFrost.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 흑마법사 스킬 아이콘
  warlock: {
    // Numeric ID mappings
    6603: 'Ability_MeleeAttack.tga', // Auto Attack
    686: 'Spell_Shadow_ShadowBolt.tga', // Shadow Bolt
    172: 'Spell_Shadow_AbominationExplosion.tga', // Corruption
    980: 'Spell_Shadow_CurseOfSargeras.tga', // Agony
    234153: 'Spell_Shadow_DrainLife.tga', // Drain Life
    1454: 'Spell_Shadow_LifeDrain.tga', // Life Tap
    198590: 'Spell_Shadow_ShadowWordDominate.tga', // Drain Soul

    // Keep existing string mappings for compatibility
    fear: 'Spell_Shadow_Possession.tga',
    shadowfury: 'Ability_Warlock_Shadowfury.tga',
    unending_resolve: 'Spell_Shadow_DemonicFortitude.tga',
    soulstone: 'Spell_Shadow_SoulGem.tga',

    // 고통
    agony: 'Spell_Shadow_CurseOfSargeras.tga',
    corruption: 'Spell_Shadow_AbominationExplosion.tga',
    unstable_affliction: 'Spell_Shadow_UnstableAffliction.tga',
    malefic_rapture: 'Ability_Warlock_Everlastingaffliction.tga',
    haunt: 'Ability_Warlock_Haunt.tga',

    // 악마
    call_dreadstalkers: 'Spell_Warlock_CallDreadstalkers.tga',
    hand_of_guldan: 'Ability_Warlock_HandOfGuldan.tga',
    summon_demonic_tyrant: 'Inv_Summondemonictyrant.tga',
    demonbolt: 'Spell_Warlock_DemonBolt.tga',

    // 파괴
    immolate: 'Spell_Fire_Immolation.tga',
    incinerate: 'Spell_Fire_Burnout.tga',
    chaos_bolt: 'Ability_Warlock_ChaosBolt.tga',
    havoc: 'Ability_Warlock_Havoc.tga',
    summon_infernal: 'Spell_Shadow_SummonInfernal.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 수도사 스킬 아이콘
  monk: {
    // Numeric ID mappings
    6603: 'Ability_MeleeAttack.tga', // Auto Attack
    100780: 'Ability_Monk_TigerPalm.tga', // Tiger Palm
    100784: 'Ability_Monk_BlackoutKick.tga', // Blackout Kick
    101546: 'Ability_Monk_SpinningCraneKick.tga', // Spinning Crane Kick
    107428: 'Ability_Monk_RisingSunKick.tga', // Rising Sun Kick
    117952: 'Ability_Monk_CracklingJadeLightning.tga', // Crackling Jade Lightning

    // Keep existing string mappings for compatibility
    roll: 'Ability_Monk_Roll.tga',
    tigers_lust: 'Ability_Monk_TigersLust.tga',
    touch_of_karma: 'Ability_Monk_TouchOfKarma.tga',

    // 양조
    keg_smash: 'Achievement_Brewery_2.tga',
    ironskin_brew: 'Ability_Monk_IronskinBrew.tga',
    purifying_brew: 'Inv_Misc_Beer_06.tga',
    celestial_brew: 'Ability_Monk_IronskinBrew.tga',

    // 풍운
    rising_sun_kick: 'Ability_Monk_RisingSunKick.tga',
    fists_of_fury: 'Monk_Ability_FistsOfFury.tga',
    tiger_palm: 'Ability_Monk_TigerPalm.tga',
    storm_earth_and_fire: 'Spell_Nature_GiftOfTheWild.tga',

    // 운무
    renewing_mist: 'Ability_Monk_RenewingMists.tga',
    enveloping_mist: 'Spell_Monk_EnvelopingMist.tga',
    essence_font: 'Ability_Monk_EssenceFont.tga',
    revival: 'Spell_Monk_Revival.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 드루이드 스킬 아이콘
  druid: {
    // Numeric ID mappings
    6603: 'Ability_MeleeAttack.tga', // Auto Attack
    8921: 'Spell_Nature_MoonFire.tga', // Moonfire
    93402: 'Spell_Nature_Sunfire.tga', // Sunfire
    5176: 'Spell_Nature_Wrath.tga', // Wrath
    2912: 'Spell_Nature_StarFall.tga', // Starfire
    8936: 'Spell_Nature_Rejuvenation.tga', // Regrowth
    774: 'Spell_Nature_Rejuvenation.tga', // Rejuvenation

    // Keep existing string mappings for compatibility
    barkskin: 'Spell_Nature_StoneClawTotem.tga',
    wild_charge: 'Spell_Druid_WildCharge.tga',
    innervate: 'Spell_Nature_Lightning.tga',

    // 조화
    moonfire: 'Spell_Nature_StarFall.tga',
    sunfire: 'Ability_Mage_FireStarter.tga',
    starfall: 'Spell_Arcane_StarFall.tga',
    starsurge: 'Spell_Arcane_Arcane03.tga',
    convoke_the_spirits: 'Ability_ArdenWeald_Druid.tga',

    // 야성
    rake: 'Ability_Druid_Disembowel.tga',
    rip: 'Ability_GhoulFrenzy.tga',
    ferocious_bite: 'Ability_Druid_FerociousBite.tga',
    berserk: 'Ability_Druid_Berserk.tga',

    // 수호
    mangle: 'Ability_Druid_Mangle2.tga',
    thrash: 'Spell_Druid_ThrashBear.tga',
    ironfur: 'Ability_Druid_IronFur.tga',
    frenzied_regeneration: 'Ability_BullRush.tga',

    // 복원
    rejuvenation: 'Spell_Nature_Rejuvenation.tga',
    regrowth: 'Spell_Nature_ResistNature.tga',
    wild_growth: 'Ability_Druid_Flourish.tga',
    tranquility: 'Spell_Nature_Tranquility.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 악마사냥꾼 스킬 아이콘
  demonhunter: {
    // Numeric ID mappings
    6603: 'Ability_MeleeAttack.tga', // Auto Attack
    162243: 'Ability_DemonHunter_DemonsBite.tga', // Demon's Bite
    162794: 'Ability_DemonHunter_ChaosStrike.tga', // Chaos Strike
    195072: 'Ability_DemonHunter_FelRush.tga', // Fel Rush
    203782: 'Ability_DemonHunter_Shear.tga', // Shear
    185123: 'Ability_DemonHunter_ThrowGlaive.tga', // Throw Glaive

    // Keep existing string mappings for compatibility
    metamorphosis: 'Ability_DemonHunter_Metamorphosis.tga',
    fel_rush: 'Ability_DemonHunter_FelRush.tga',
    vengeful_retreat: 'Ability_DemonHunter_VengefulRetreat.tga',
    consume_magic: 'Spell_Demon_ConsumeMagic.tga',

    // 파멸
    chaos_strike: 'Ability_DemonHunter_ChaosStrike.tga',
    blade_dance: 'Ability_DemonHunter_BladeDance.tga',
    eye_beam: 'Ability_DemonHunter_EyeBeam.tga',
    immolation_aura: 'Ability_DemonHunter_ImmolationAura.tga',

    // 복수
    immolation_aura_vengeance: 'Ability_DemonHunter_ImmolationAura.tga',
    demon_spikes: 'Ability_DemonHunter_DemonSpikes.tga',
    sigil_of_flame: 'Ability_DemonHunter_SigilOfFlame.tga',
    fiery_brand: 'Ability_DemonHunter_FieryBrand.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 기원사 스킬 아이콘
  evoker: {
    // Numeric ID mappings
    6603: 'Ability_MeleeAttack.tga', // Auto Attack
    361469: 'Ability_Evoker_LivingFlame.tga', // Living Flame
    362969: 'Ability_Evoker_AzureStrike.tga', // Azure Strike
    356995: 'Ability_Evoker_Disintegrate.tga', // Disintegrate
    357210: 'Ability_Evoker_DeepBreath.tga', // Deep Breath
    357208: 'Ability_Evoker_FireBreath.tga', // Fire Breath
    359073: 'Ability_Evoker_EternitysSurge.tga', // Eternity's Surge

    // Keep existing string mappings for compatibility
    deep_breath: 'Ability_Evoker_DeepBreath.tga',
    hover: 'Ability_Evoker_Hover.tga',
    soar: 'Ability_Racial_Soar.tga',

    // 황폐
    disintegrate: 'Ability_Evoker_Disintegrate.tga',
    fire_breath: 'Ability_Evoker_FireBreath.tga',
    eternity_surge: 'Ability_Evoker_FontOfMagic.tga',
    dragonrage: 'Ability_Evoker_Dragonrage.tga',

    // 보존
    echo: 'Ability_Evoker_Echo.tga',
    rewind: 'Ability_Evoker_Rewind.tga',
    dream_breath: 'Ability_Evoker_DreamBreath.tga',

    // 증강
    eruption: 'Ability_Evoker_Eruption.tga',
    prescience: 'Ability_Evoker_Prescience.tga',

    default: 'inv_misc_questionmark.tga'
  },

  // 기본 아이콘 (스킬 아이콘이 없는 경우)
  default: 'inv_misc_questionmark.tga'
};

// 스킬 ID로 아이콘 가져오기
export const getSkillIcon = (className, skillId) => {
  const classIcons = skillIcons[className] || {};

  // 숫자 ID와 문자열 키 모두 확인
  let icon = classIcons[skillId] || classIcons[String(skillId)];

  // 아이콘이 없으면 문자열 키로 다시 시도
  if (!icon) {
    // 예: 'charge', 'heroic_leap' 같은 문자열 키
    Object.keys(classIcons).forEach(key => {
      if (key.toLowerCase() === String(skillId).toLowerCase()) {
        icon = classIcons[key];
      }
    });
  }

  // 여전히 없으면 기본 아이콘
  return icon || classIcons.default || skillIcons.default;
};

export default skillIcons;