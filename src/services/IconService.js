// WoW 아이콘 서비스 - 개선된 버전
import iconMappings from '../data/iconMappings.json';

class IconService {
  constructor() {
    // 아이콘 경로 설정
    this.iconBasePath = '/icons/';
    this.wowheadBase = 'https://wow.zamimg.com/images/wow/icons/';
    this.externalIconPath = 'C:/Users/D2JK/바탕화면/cd/냉죽/ICONS/';

    // JSON 매핑 데이터 사용
    this.skillMappings = iconMappings;

    // 스킬 ID와 아이콘 파일 매핑 (예시)
    this.iconMappings = {
      // 전사 스킬 아이콘 매핑
      warrior: {
        // 공통
        mortal_strike: 'ability_warrior_savageblow.tga',
        bloodthirst: 'spell_nature_bloodlust.tga',
        whirlwind: 'ability_whirlwind.tga',
        execute: 'inv_sword_48.tga',
        heroic_throw: 'inv_axe_66.tga',
        charge: 'ability_warrior_charge.tga',
        hamstring: 'ability_shockwave.tga',
        pummel: 'inv_gauntlets_04.tga',
        berserker_rage: 'spell_nature_ancestralguardian.tga',
        battle_shout: 'ability_warrior_battleshout.tga',
        heroic_leap: 'ability_heroicleap.tga',

        // 무기 전문화
        colossus_smash: 'ability_warrior_colossussmash.tga',
        bladestorm: 'ability_warrior_bladestorm.tga',

        // 분노 전문화
        raging_blow: 'ability_warrior_rampage.tga',
        rampage: 'ability_warrior_rampage.tga',

        // 방어 전문화
        shield_slam: 'inv_shield_05.tga',
        shield_block: 'ability_defend.tga'
      },

      // 성기사 스킬 아이콘 매핑
      paladin: {
        // 공통
        holy_light: 'spell_holy_holybolt.tga',
        divine_shield: 'spell_holy_divineshield.tga',
        lay_on_hands: 'spell_holy_layonhands.tga',
        blessing_of_freedom: 'spell_holy_sealofvalor.tga',
        hammer_of_justice: 'spell_holy_sealofmight.tga',

        // 징벌 전문화
        templar_verdict: 'ability_paladin_templarsverdict.tga',
        wake_of_ashes: 'inv_sword_2h_artifactashbringerfire_d_03.tga',

        // 신성 전문화
        holy_shock: 'spell_holy_searinglight.tga',
        beacon_of_light: 'ability_paladin_beaconoflight.tga',

        // 보호 전문화
        avengers_shield: 'spell_holy_avengersshield.tga',
        consecration: 'spell_holy_innerfire.tga'
      },

      // 사냥꾼 스킬 아이콘 매핑
      hunter: {
        // 공통
        auto_shot: 'ability_whirlwind.tga',
        arcane_shot: 'ability_impalingbolt.tga',
        multi_shot: 'ability_upgrademoonglaive.tga',
        kill_shot: 'ability_hunter_assassinate2.tga',
        hunters_mark: 'ability_hunter_markedfordeath.tga',

        // 야수 전문화
        bestial_wrath: 'ability_druid_ferociousbite.tga',
        cobra_shot: 'ability_hunter_cobrashot.tga',

        // 사격 전문화
        aimed_shot: 'inv_spear_07.tga',
        rapid_fire: 'ability_hunter_rapidfire.tga',

        // 생존 전문화
        raptor_strike: 'ability_hunter_raptorstrike.tga',
        wildfire_bomb: 'spell_fire_selfdestruct.tga'
      },

      // 도적 스킬 아이콘 매핑
      rogue: {
        // 공통
        stealth: 'ability_stealth.tga',
        vanish: 'ability_vanish.tga',
        cheap_shot: 'ability_cheapshot.tga',
        kidney_shot: 'ability_rogue_kidneyshot.tga',
        kick: 'ability_kick.tga',

        // 암살 전문화
        mutilate: 'ability_rogue_shadowstrikes.tga',
        vendetta: 'ability_rogue_deadliness.tga',

        // 무법 전문화
        pistol_shot: 'ability_rogue_pistolshot.tga',
        roll_the_bones: 'ability_rogue_rollthebones.tga',

        // 잠행 전문화
        shadowstrike: 'ability_rogue_shadowstrike.tga',
        shadow_dance: 'ability_rogue_shadowdance.tga'
      },

      // 사제 스킬 아이콘 매핑
      priest: {
        // 공통
        power_word_shield: 'spell_holy_powerwordshield.tga',
        shadow_word_pain: 'spell_shadow_shadowwordpain.tga',
        flash_heal: 'spell_holy_flashheal.tga',

        // 수양 전문화
        penance: 'spell_holy_penance.tga',

        // 신성 전문화
        holy_word_sanctify: 'spell_holy_divineprovidence.tga',

        // 암흑 전문화
        mind_blast: 'spell_shadow_unholyfrenzy.tga',
        vampiric_touch: 'spell_holy_stoicism.tga'
      },

      // 죽음의 기사 스킬 아이콘 매핑
      deathknight: {
        // 공통
        death_strike: 'spell_deathknight_butcher2.tga',
        death_grip: 'spell_deathknight_strangulate.tga',
        anti_magic_shell: 'spell_shadow_antimagicshell.tga',

        // 혈기 전문화
        blood_boil: 'spell_deathknight_bloodboil.tga',

        // 냉기 전문화
        obliterate: 'spell_deathknight_classicon.tga',
        frost_strike: 'spell_deathknight_empowerruneblade2.tga',

        // 부정 전문화
        festering_strike: 'spell_deathknight_festering_strike.tga',
        death_coil: 'spell_shadow_deathcoil.tga'
      },

      // 주술사 스킬 아이콘 매핑
      shaman: {
        // 공통
        lightning_bolt: 'spell_nature_lightning.tga',
        chain_lightning: 'spell_nature_chainlightning.tga',

        // 정기 전문화
        lava_burst: 'spell_shaman_lavaburst.tga',

        // 고양 전문화
        stormstrike: 'spell_shaman_stormstrike.tga',

        // 복원 전문화
        riptide: 'spell_nature_riptide.tga',
        healing_rain: 'spell_nature_giftofthewaterspirit.tga'
      },

      // 마법사 스킬 아이콘 매핑
      mage: {
        // 공통
        polymorph: 'spell_nature_polymorph.tga',
        counterspell: 'spell_frost_iceshock.tga',
        blink: 'spell_arcane_blink.tga',

        // 비전 전문화
        arcane_blast: 'spell_arcane_blast.tga',
        arcane_missiles: 'spell_nature_starfall.tga',

        // 화염 전문화
        fireball: 'spell_fire_flamebolt.tga',
        pyroblast: 'spell_fire_fireball02.tga',

        // 냉기 전문화
        frostbolt: 'spell_frost_frostbolt02.tga',
        ice_lance: 'spell_frost_frostblast.tga'
      },

      // 흑마법사 스킬 아이콘 매핑
      warlock: {
        // 공통
        shadow_bolt: 'spell_shadow_shadowbolt.tga',
        fear: 'spell_shadow_possession.tga',

        // 고통 전문화
        unstable_affliction: 'spell_shadow_unstableaffliction_3.tga',

        // 악마학 전문화
        hand_of_guldan: 'ability_warlock_handofguldan.tga',

        // 파괴 전문화
        chaos_bolt: 'ability_warlock_chaosbolt.tga',
        immolate: 'spell_fire_immolation.tga'
      },

      // 수도사 스킬 아이콘 매핑
      monk: {
        // 공통
        tiger_palm: 'ability_monk_tigerpalm.tga',
        blackout_kick: 'ability_monk_blackoutkick.tga',
        roll: 'ability_monk_roll.tga',

        // 양조 전문화
        keg_smash: 'inv_misc_beer_06.tga',

        // 운무 전문화
        enveloping_mist: 'spell_monk_envelopingmist.tga',

        // 풍운 전문화
        fists_of_fury: 'ability_monk_fistsoffury.tga',
        rising_sun_kick: 'ability_monk_risingsunkick.tga'
      },

      // 드루이드 스킬 아이콘 매핑
      druid: {
        // 공통
        moonfire: 'spell_nature_starfall.tga',
        bear_form: 'ability_racial_bearform.tga',
        cat_form: 'ability_druid_catform.tga',

        // 조화 전문화
        starfall: 'spell_arcane_starfire.tga',
        starsurge: 'spell_arcane_arcane03.tga',

        // 야성 전문화
        rake: 'ability_druid_disembowel.tga',
        rip: 'ability_ghoulfrenzy.tga',

        // 수호 전문화
        mangle: 'ability_druid_mangle2.tga',

        // 회복 전문화
        rejuvenation: 'spell_nature_rejuvenation.tga',
        wild_growth: 'ability_druid_flourish.tga'
      },

      // 악마사냥꾼 스킬 아이콘 매핑
      demonhunter: {
        // 공통
        fel_rush: 'ability_demonhunter_felrush.tga',
        metamorphosis: 'ability_demonhunter_metamorphasistank.tga',

        // 파멸 전문화
        chaos_strike: 'ability_demonhunter_chaosstrike.tga',
        eye_beam: 'ability_demonhunter_eyebeam.tga',

        // 복수 전문화
        soul_cleave: 'ability_demonhunter_soulcleave.tga',
        infernal_strike: 'ability_demonhunter_infernalstrike1.tga'
      },

      // 기원사 스킬 아이콘 매핑
      evoker: {
        // 공통
        living_flame: 'spell_fire_burnout.tga',
        deep_breath: 'inv_ability_deepbreath.tga',

        // 황폐 전문화
        dragonrage: 'inv_dragonriding_abilities_dragonrage01.tga',
        pyre: 'spell_fire_fireball.tga',

        // 보존 전문화
        echo: 'spell_nature_invisibilitytotem.tga',
        dream_breath: 'inv_ability_dreambreath.tga',

        // 증강 전문화
        eruption: 'spell_nature_earthquake.tga',
        upheaval: 'ability_earthen_pillar.tga'
      }
    };
  }

  /**
   * 스킬 아이콘 경로 가져오기 - Wowhead CDN 사용
   */
  getSkillIcon(className, skillId, size = 'large') {
    // JSON 매핑에서 먼저 찾기
    if (className && this.skillMappings[className]) {
      const iconName = this.skillMappings[className][skillId];
      if (iconName) {
        return this.getWowheadUrl(iconName, size);
      }
    }

    // 기존 매핑에서 찾기
    const classIcons = this.iconMappings[className];
    if (classIcons && classIcons[skillId]) {
      const iconFile = classIcons[skillId].replace('.tga', '');
      return this.getWowheadUrl(iconFile, size);
    }

    return this.getDefaultIcon();
  }

  /**
   * Wowhead URL 생성
   */
  getWowheadUrl(iconName, size = 'large') {
    return `${this.wowheadBase}${size}/${iconName}.jpg`;
  }

  /**
   * 기본 아이콘 경로
   */
  getDefaultIcon() {
    return this.getWowheadUrl('inv_misc_questionmark', 'large');
  }

  /**
   * 클래스 아이콘 가져오기
   */
  getClassIcon(className) {
    const classIcons = {
      warrior: 'crest_warrior.tga',
      paladin: 'ability_Paladin_Veneration.tga',
      hunter: 'crest_hunter.tga',
      rogue: 'ability_rogue_combatreadiness.tga',
      priest: 'spell_holy_powerinfusion.tga',
      deathknight: 'ability_deathknight_boneshield.tga',
      shaman: 'spell_nature_lightning.tga',
      mage: 'ability_mage_GreaterInvisibility.tga',
      warlock: 'ability_warlock_ancientgrimoire.tga',
      monk: 'ability_monk_dragonkick.tga',
      druid: 'ability_druid_flourish.tga',
      demonhunter: 'ability_demonhunter_metamorphasistank.tga',
      evoker: 'inv_dragonriding_abilities_dragonrage01.tga'
    };

    return `${this.iconBasePath}${classIcons[className] || 'inv_misc_questionmark.tga'}`;
  }

  /**
   * 전문화 아이콘 가져오기
   */
  getSpecializationIcon(className, spec) {
    const specIcons = {
      warrior: {
        arms: 'ability_warrior_savageblow.tga',
        fury: 'ability_warrior_innerrage.tga',
        protection: 'ability_warrior_defensivestance.tga'
      },
      paladin: {
        retribution: 'spell_holy_auraoflight.tga',
        holy: 'spell_holy_holybolt.tga',
        protection: 'ability_paladin_shieldofthetemplar.tga'
      },
      hunter: {
        beast_mastery: 'ability_hunter_beasttaming.tga',
        marksmanship: 'ability_hunter_focusedaim.tga',
        survival: 'ability_hunter_survivalist.tga'
      },
      rogue: {
        assassination: 'ability_rogue_eviscerate.tga',
        outlaw: 'ability_rogue_waylay.tga',
        subtlety: 'ability_stealth.tga'
      },
      priest: {
        discipline: 'spell_holy_powerwordshield.tga',
        holy: 'spell_holy_guardianspirit.tga',
        shadow: 'spell_shadow_shadowwordpain.tga'
      },
      deathknight: {
        blood: 'spell_deathknight_bloodpresence.tga',
        frost: 'spell_deathknight_frostpresence.tga',
        unholy: 'spell_deathknight_unholypresence.tga'
      },
      shaman: {
        elemental: 'spell_nature_lightning.tga',
        enhancement: 'ability_shaman_stormstrike.tga',
        restoration: 'spell_nature_riptide.tga'
      },
      mage: {
        arcane: 'spell_holy_magicalsentry.tga',
        fire: 'spell_fire_firebolt02.tga',
        frost: 'spell_frost_frostbolt02.tga'
      },
      warlock: {
        affliction: 'spell_shadow_deathcoil.tga',
        demonology: 'spell_shadow_metamorphosis.tga',
        destruction: 'spell_fire_immolation.tga'
      },
      monk: {
        brewmaster: 'inv_misc_beer_06.tga',
        mistweaver: 'ability_monk_jasmineforcetea.tga',
        windwalker: 'ability_monk_windwalker_spec.tga'
      },
      druid: {
        balance: 'spell_nature_starfall.tga',
        feral: 'ability_druid_catform.tga',
        guardian: 'ability_racial_bearform.tga',
        restoration: 'spell_nature_healingtouch.tga'
      },
      demonhunter: {
        havoc: 'ability_demonhunter_specdps.tga',
        vengeance: 'ability_demonhunter_spectank.tga'
      },
      evoker: {
        devastation: 'inv_10_dragonflightclass_devastationevoker.tga',
        preservation: 'inv_10_dragonflightclass_preservationevoker.tga',
        augmentation: 'inv_10_dragonflightclass_augmentationevoker.tga'
      }
    };

    const classSpecs = specIcons[className];
    if (!classSpecs) {
      return this.getDefaultIcon();
    }

    return `${this.iconBasePath}${classSpecs[spec] || 'inv_misc_questionmark.tga'}`;
  }

  /**
   * 아이콘 파일이 존재하는지 확인
   */
  async checkIconExists(iconPath) {
    try {
      const response = await fetch(iconPath, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 모든 클래스의 스킬 아이콘 매핑 가져오기
   */
  getClassSkillIcons(className) {
    const mapping = this.skillMappings[className?.toLowerCase()];
    if (!mapping) return {};

    const icons = {};
    for (const [skillId, iconName] of Object.entries(mapping)) {
      icons[skillId] = this.getWowheadUrl(iconName);
    }
    return icons;
  }
}

// 싱글톤 인스턴스 생성
const iconService = new IconService();

export default iconService;