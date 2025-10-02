/**
 * Wowhead 아이콘 시스템
 * Wowhead의 실제 아이콘을 사용하여 정확한 스킬 아이콘 표시
 */

// Wowhead에서 실시간으로 가져온 아이콘 매핑
import { wowheadIconMapping } from '../data/wowheadIconMapping';

// Wowhead 아이콘 URL 생성
export function getWowheadIconUrl(iconName, size = 'large') {
  // 크기 매핑
  const sizeMap = {
    tiny: 'tiny',     // 15x15
    small: 'small',   // 18x18
    medium: 'medium', // 36x36
    large: 'large',   // 56x56
    xlarge: 'large'   // 56x56 (최대 크기)
  };

  const iconSize = sizeMap[size] || 'large';

  // Wowhead CDN URL
  if (iconName) {
    // 아이콘 이름 정규화 (공백, 특수문자 제거)
    const cleanIconName = iconName
      .replace(/\.(jpg|png|gif)$/i, '') // 확장자 제거
      .replace(/^\/icons\//, '') // /icons/ 경로 제거
      .toLowerCase();

    return `https://wow.zamimg.com/images/wow/icons/${iconSize}/${cleanIconName}.jpg`;
  }

  // 기본 아이콘 (물음표)
  return `https://wow.zamimg.com/images/wow/icons/${iconSize}/inv_misc_questionmark.jpg`;
}

// 스킬 ID로 Wowhead 스킬 페이지 URL 생성
export function getWowheadSpellUrl(spellId, korean = false) {
  const domain = korean ? 'ko.wowhead.com' : 'www.wowhead.com';
  return `https://${domain}/spell=${spellId}`;
}

// 아이콘 이름 매핑 (일반적인 스킬 아이콘)
export const commonIconMappings = {
  // 전사
  'charge': 'ability_warrior_charge',
  'mortal strike': 'ability_warrior_savageblow',
  'heroic leap': 'ability_heroicleap',
  'battle shout': 'ability_warrior_battleshout',
  'victory rush': 'ability_warrior_victoryrush',
  'shield slam': 'inv_shield_05',
  'shield block': 'ability_defend',
  'revenge': 'ability_warrior_revenge',
  'thunder clap': 'spell_nature_thunderclap',
  'whirlwind': 'ability_whirlwind',
  'bladestorm': 'ability_warrior_bladestorm',
  'colossus smash': 'ability_warrior_colossussmash',
  'rampage': 'ability_warrior_rampage',
  'bloodthirst': 'spell_nature_bloodlust',
  'raging blow': 'ability_warrior_innerrage',

  // 성기사
  'holy light': 'spell_holy_holybolt',
  'flash of light': 'spell_holy_flashheal',
  'divine shield': 'spell_holy_divineshield',
  'blessing of protection': 'spell_holy_sealofprotection',
  'blessing of freedom': 'spell_holy_sealofvalor',
  'hammer of justice': 'spell_holy_sealofmight',
  'consecration': 'spell_holy_innerfire',
  'avenger\'s shield': 'spell_holy_avengersshield',
  'divine storm': 'ability_paladin_divinestorm',
  'templar\'s verdict': 'spell_paladin_templarsverdict',

  // 사냥꾼
  'aimed shot': 'inv_spear_07',
  'steady shot': 'ability_hunter_steadyshot',
  'arcane shot': 'ability_impalingbolt',
  'multi-shot': 'ability_upgrademoonglaive',
  'rapid fire': 'ability_hunter_rapidfire',
  'kill shot': 'ability_hunter_assassinate',
  'hunter\'s mark': 'ability_hunter_markedfordeath',
  'pet summon': 'ability_hunter_beasttaming',
  'mend pet': 'ability_hunter_mendpet',
  'beast lore': 'ability_physical_taunt',

  // 도적
  'stealth': 'ability_stealth',
  'cheap shot': 'ability_cheapshot',
  'sinister strike': 'spell_shadow_ritualofsacrifice',
  'eviscerate': 'ability_rogue_eviscerate',
  'slice and dice': 'ability_rogue_slicedice',
  'kidney shot': 'ability_rogue_kidneyshot',
  'vanish': 'ability_vanish',
  'shadowstep': 'ability_rogue_shadowstep',
  'mutilate': 'ability_rogue_shadowstrikes',
  'envenom': 'inv_throwingknife_04',

  // 사제
  'power word: shield': 'spell_holy_powerwordshield',
  'shadow word: pain': 'spell_shadow_shadowwordpain',
  'holy fire': 'spell_holy_searinglight',
  'heal': 'spell_holy_heal',
  'flash heal': 'spell_holy_flashheal',
  'renew': 'spell_holy_renew',
  'prayer of mending': 'spell_holy_prayerofmendingtga',
  'mind blast': 'spell_shadow_unholyfrenzy',
  'shadow form': 'spell_shadow_shadowform',
  'mind flay': 'spell_shadow_siphonmana',

  // 마법사
  'fireball': 'spell_fire_flamebolt',
  'frostbolt': 'spell_frost_frostbolt02',
  'arcane intellect': 'spell_holy_magicalsentry',
  'arcane missiles': 'spell_nature_starfall',
  'polymorph': 'spell_nature_polymorph',
  'blink': 'spell_arcane_blink',
  'ice block': 'spell_frost_frost',
  'frost nova': 'spell_frost_frostnova',
  'blizzard': 'spell_frost_icestorm',
  'pyroblast': 'spell_fire_fireball02',

  // 흑마법사
  'shadow bolt': 'spell_shadow_shadowbolt',
  'corruption': 'spell_shadow_abominationexplosion',
  'immolate': 'spell_fire_immolation',
  'fear': 'spell_shadow_possession',
  'drain life': 'spell_shadow_lifedrain02',
  'drain soul': 'spell_shadow_haunting',
  'summon imp': 'spell_shadow_summonimp',
  'summon voidwalker': 'spell_shadow_summonvoidwalker',
  'chaos bolt': 'ability_warlock_chaosbolt',
  'incinerate': 'spell_fire_burnout',

  // 주술사
  'lightning bolt': 'spell_nature_lightning',
  'chain lightning': 'spell_nature_chainlightning',
  'earth shock': 'spell_nature_earthshock',
  'flame shock': 'spell_fire_flameshock',
  'frost shock': 'spell_frost_frostshock',
  'healing wave': 'spell_nature_healingwavegreater',
  'chain heal': 'spell_nature_healingway',
  'windfury weapon': 'spell_nature_cyclone',
  'stormstrike': 'ability_shaman_stormstrike',
  'lava burst': 'spell_shaman_lavaburst',

  // 수도사
  'tiger palm': 'ability_monk_tigerpalm',
  'blackout kick': 'ability_monk_roundhousekick',
  'rising sun kick': 'ability_monk_risingsunkick',
  'spinning crane kick': 'ability_monk_cranekick',
  'touch of death': 'ability_monk_touchofdeath',
  'roll': 'ability_monk_roll',
  'fortifying brew': 'ability_monk_fortifyingale',
  'touch of karma': 'ability_monk_touchofkarma',
  'fists of fury': 'monk_ability_fistoffury',

  // 드루이드
  'moonfire': 'spell_nature_starfall',
  'wrath': 'spell_nature_abolishmagic',
  'starfire': 'spell_arcane_starfire',
  'rejuvenation': 'spell_nature_rejuvenation',
  'regrowth': 'spell_nature_resistnature',
  'swiftmend': 'inv_relics_idolofrejuvenation',
  'wild growth': 'spell_nature_resistnature',
  'rake': 'ability_druid_rake',
  'shred': 'spell_shadow_vampiricaura',
  'ferocious bite': 'ability_druid_ferociousbite',

  // 죽음의 기사
  'death strike': 'spell_deathknight_butcher2',
  'blood boil': 'spell_deathknight_bloodboil',
  'death grip': 'spell_deathknight_strangulate',
  'obliterate': 'spell_deathknight_classicon',
  'frost strike': 'spell_deathknight_empowerruneblade2',
  'death and decay': 'spell_shadow_deathanddecay',
  'army of the dead': 'spell_shadow_animatedead',
  'raise dead': 'inv_pet_ghoul',
  'anti-magic shell': 'spell_shadow_antimagicshell',

  // 악마사냥꾼
  'demon\'s bite': 'inv_weapon_glave_01',
  'chaos strike': 'ability_demonhunter_chaosstrike',
  'eye beam': 'ability_demonhunter_eyebeam',
  'blade dance': 'ability_demonhunter_bladedance',
  'metamorphosis': 'ability_demonhunter_metamorphasisdps',
  'fel rush': 'ability_demonhunter_felrush',
  'vengeful retreat': 'ability_demonhunter_vengefulretreat',
  'immolation aura': 'spell_fire_incinerate',

  // 기원사
  'living flame': 'spell_fire_burnout',
  'fire breath': 'ability_evoker_firebreath',
  'azure strike': 'ability_evoker_azurestrike',
  'disintegrate': 'ability_evoker_disintegrate',
  'deep breath': 'ability_evoker_deepbreath',
  'hover': 'ability_evoker_hover',
  'emerald blossom': 'ability_evoker_emeraldblossom',
  'dream breath': 'ability_evoker_dreambreath'
};

// 스킬 이름으로 아이콘 추측
export function guessIconFromName(skillName) {
  const lowerName = skillName.toLowerCase();

  // 직접 매핑 확인
  if (commonIconMappings[lowerName]) {
    return commonIconMappings[lowerName];
  }

  // 부분 매칭 시도
  for (const [key, value] of Object.entries(commonIconMappings)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return value;
    }
  }

  // 기본 아이콘
  return 'inv_misc_questionmark';
}

// 클래스별 기본 아이콘
export const classDefaultIcons = {
  warrior: 'classicon_warrior',
  paladin: 'classicon_paladin',
  hunter: 'classicon_hunter',
  rogue: 'classicon_rogue',
  priest: 'classicon_priest',
  mage: 'classicon_mage',
  warlock: 'classicon_warlock',
  shaman: 'classicon_shaman',
  monk: 'classicon_monk',
  druid: 'classicon_druid',
  deathknight: 'classicon_deathknight',
  demonhunter: 'classicon_demonhunter',
  evoker: 'classicon_evoker'
};

// 스킬 타입별 기본 아이콘
export const typeDefaultIcons = {
  damage: 'ability_warrior_savageblow',
  heal: 'spell_holy_heal',
  buff: 'spell_holy_powerwordshield',
  debuff: 'spell_shadow_shadowwordpain',
  defensive: 'ability_warrior_defensivestance',
  mobility: 'ability_rogue_sprint',
  cooldown: 'ability_warrior_innerrage',
  passive: 'spell_nature_wispsplode',
  talent: 'ability_marksmanship',
  pvp: 'achievement_pvp_a_01'
};

// 통합 아이콘 가져오기 함수
export function getSkillIconUrl(skill, size = 'large') {
  // 1. 직접 지정된 아이콘이 있으면 사용
  if (skill.icon) {
    const iconName = skill.icon
      .replace(/^\/icons\//, '')
      .replace(/\.(jpg|png|gif)$/i, '');
    return getWowheadIconUrl(iconName, size);
  }

  // 2. 스킬 이름으로 아이콘 추측
  if (skill.name) {
    const guessedIcon = guessIconFromName(skill.name);
    if (guessedIcon !== 'inv_misc_questionmark') {
      return getWowheadIconUrl(guessedIcon, size);
    }
  }

  // 3. 타입별 기본 아이콘
  if (skill.type && typeDefaultIcons[skill.type]) {
    return getWowheadIconUrl(typeDefaultIcons[skill.type], size);
  }

  // 4. 클래스별 기본 아이콘
  if (skill.class && classDefaultIcons[skill.class]) {
    return getWowheadIconUrl(classDefaultIcons[skill.class], size);
  }

  // 5. 최종 기본 아이콘
  return getWowheadIconUrl('inv_misc_questionmark', size);
}

// 스킬 ID로 정확한 Wowhead 아이콘 매핑
const spellIdToIcon = {
  // 전사 기본 스킬
  100: 'ability_warrior_charge', // 돌진
  355: 'spell_nature_reincarnation', // 도발
  1715: 'ability_shockwave', // 무력화
  6552: 'inv_gauntlets_04', // 들이치기
  6673: 'ability_warrior_battleshout', // 전투의 외침
  6544: 'ability_heroicleap', // 영웅의 도약
  1680: 'ability_whirlwind', // 소용돌이
  34428: 'ability_warrior_victoryrush', // 연전연승
  57755: 'inv_throwingaxe_01', // 영웅의 투척
  97462: 'ability_warrior_rallyingcry', // 재집결의 함성
  383155: 'ability_warrior_warbringer', // 휩쓸기 일격 연마

  // 무기 전문화
  12294: 'ability_warrior_savageblow', // 필사의 일격
  167105: 'ability_warrior_colossussmash', // 거인의 강타
  260708: 'ability_rogue_slicedice', // 휩쓸기 일격
  845: 'ability_warrior_cleave', // 회전베기
  118038: 'ability_warrior_diebythesword', // 투사의 혼
  227847: 'ability_warrior_bladestorm', // 칼날폭풍
  7384: 'ability_meleedamage', // 제압
  76838: 'ability_warrior_strengthofarms', // 특화: 거대한 힘
  1464: 'ability_warrior_decisivestrike', // 격돌

  // 분노 전문화
  23881: 'spell_nature_bloodlust', // 피의 갈증
  85288: 'warrior_wild_strike', // 분노의 강타
  184367: 'ability_warrior_rampage', // 광란
  5308: 'inv_sword_48', // 마무리 일격
  1719: 'warrior_talent_icon_innerrage', // 무모한 희생
  184361: 'spell_shadow_unholyfrenzy', // 격노
  184364: 'ability_warrior_focusedrage', // 격노의 재생력

  // 방어 전문화
  23922: 'inv_shield_05', // 방패 밀쳐내기
  2565: 'ability_defend', // 방패 올리기
  871: 'ability_warrior_shieldwall', // 방패의 벽
  401150: 'warrior_talent_icon_avatar', // 화신
  190456: 'ability_warrior_reneweddetermination', // 고통 감내
  6343: 'spell_nature_thunderclap', // 천둥벼락
  6572: 'ability_warrior_revenge', // 복수
  12975: 'spell_holy_ashestoashes', // 최후의 저항
  23920: 'ability_warrior_shieldreflection', // 주문 반사
  1160: 'ability_warrior_warcry', // 사기의 외침

  // 특성
  152278: 'warrior_talent_icon_angermanagement', // 분노 제어
  228920: 'warrior_talent_icon_ravager', // 쇠날발톱
  202751: 'warrior_talent_icon_seethe', // 무모한 광기
  203177: 'inv_shield_32', // 묵직한 반격
  107570: 'warrior_talent_icon_stormbolt', // 폭풍망치
  103827: 'inv_misc_horn_03', // 연속 돌진
  202168: 'ability_warrior_victoryrush', // 예견된 승리
  346002: 'ability_warrior_unrelentingassault', // 전쟁 기계
  280776: 'ability_warrior_suddendeath', // 급살
  118000: 'ability_warrior_dragonroar', // 용의 포효

  // PvP
  236077: 'ability_warrior_disarm', // 무장 해제
  198817: 'inv_sword_112', // 무기 연마
  236320: 'warrior_talent_icon_stormofsteel', // 전투 깃발
  236273: 'achievement_bg_killingblow_berserker', // 결투
};

// 향상된 스킬 아이콘 URL 가져오기 (스킬 ID 우선)
export function getEnhancedSkillIconUrl(skill, size = 'large') {
  // 1. Wowhead에서 가져온 실제 아이콘 매핑 확인
  if (skill.id && wowheadIconMapping[skill.id]) {
    return getWowheadIconUrl(wowheadIconMapping[skill.id], size);
  }

  // 2. 기본 매핑에서 확인
  if (skill.id && spellIdToIcon[skill.id]) {
    return getWowheadIconUrl(spellIdToIcon[skill.id], size);
  }

  // 3. 기존 getSkillIconUrl 로직 사용
  return getSkillIconUrl(skill, size);
}