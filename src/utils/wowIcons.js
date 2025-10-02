import React from 'react';
import { defaultIcons } from './defaultIcons';

// WoW 공식 아이콘 CDN 유틸리티 - 여러 CDN 소스 지원
const WOWHEAD_CDN = 'https://wow.zamimg.com/images/wow/icons/large';
const RENDER_CDN = 'https://render.worldofwarcraft.com/us/icons/56';
const MEDIA_CDN = 'https://render-us.worldofwarcraft.com/icons/56';

// 아이콘 URL 생성 함수 - 안정적인 CDN 사용
export const getWowIcon = (iconName) => {
  // WoWHead CDN이 가장 안정적
  if (iconName.includes('://')) {
    return iconName; // 이미 전체 URL인 경우
  }

  // 로컬 폴백 체크
  const localIcon = `/icons/${iconName}.jpg`;

  // WoWHead CDN 사용
  return `${WOWHEAD_CDN}/${iconName}.jpg`;
};

// 클래스별 아이콘 매핑
export const classIcons = {
  // 클래스 아이콘
  warrior: getWowIcon('classicon_warrior'),
  paladin: getWowIcon('classicon_paladin'),
  hunter: getWowIcon('classicon_hunter'),
  rogue: getWowIcon('classicon_rogue'),
  priest: getWowIcon('classicon_priest'),
  deathknight: getWowIcon('classicon_deathknight'),
  shaman: getWowIcon('classicon_shaman'),
  mage: getWowIcon('classicon_mage'),
  warlock: getWowIcon('classicon_warlock'),
  monk: getWowIcon('classicon_monk'),
  druid: getWowIcon('classicon_druid'),
  demonhunter: getWowIcon('classicon_demonhunter'),
  evoker: getWowIcon('classicon_evoker'),

  // 역할 아이콘
  tank: getWowIcon('spell_deathknight_bloodpresence'),
  healer: getWowIcon('spell_holy_guardianspirit'),
  dps: getWowIcon('ability_dualwield'),
  melee: getWowIcon('ability_warrior_challange'),
  ranged: getWowIcon('ability_hunter_focusedaim'),

  // 특성별 아이콘
  // 전사
  arms: getWowIcon('ability_warrior_savageblow'),
  fury: getWowIcon('ability_warrior_innerrage'),
  protection_warrior: getWowIcon('ability_warrior_defensivestance'),

  // 성기사
  holy_paladin: getWowIcon('spell_holy_holybolt'),
  protection_paladin: getWowIcon('ability_paladin_shieldofthetemplar'),
  retribution: getWowIcon('spell_holy_auraoflight'),

  // 사냥꾼
  beastmastery: getWowIcon('ability_hunter_bestialdiscipline'),
  marksmanship: getWowIcon('ability_hunter_focusedaim'),
  survival: getWowIcon('ability_hunter_camouflage'),

  // 도적
  assassination: getWowIcon('ability_rogue_deadlybrew'),
  outlaw: getWowIcon('ability_rogue_waylay'),
  subtlety: getWowIcon('ability_stealth'),

  // 사제
  discipline: getWowIcon('spell_holy_powerwordshield'),
  holy_priest: getWowIcon('spell_holy_guardianspirit'),
  shadow: getWowIcon('spell_shadow_shadowwordpain'),

  // 죽음의 기사
  blood: getWowIcon('spell_deathknight_bloodpresence'),
  frost_dk: getWowIcon('spell_deathknight_frostpresence'),
  unholy: getWowIcon('spell_deathknight_unholypresence'),

  // 주술사
  elemental: getWowIcon('spell_nature_lightning'),
  enhancement: getWowIcon('spell_shaman_improvedstormstrike'),
  restoration_shaman: getWowIcon('spell_nature_magicimmunity'),

  // 마법사
  arcane: getWowIcon('spell_holy_magicalsentry'),
  fire: getWowIcon('spell_fire_firebolt02'),
  frost_mage: getWowIcon('spell_frost_frostbolt02'),

  // 흑마법사
  affliction: getWowIcon('spell_shadow_deathcoil'),
  demonology: getWowIcon('spell_shadow_metamorphosis'),
  destruction: getWowIcon('spell_shadow_rainoffire'),

  // 수도사
  brewmaster: getWowIcon('monk_stance_drunkenox'),
  mistweaver: getWowIcon('monk_stance_wiseserpent'),
  windwalker: getWowIcon('monk_stance_whitetiger'),

  // 드루이드
  balance: getWowIcon('spell_nature_starfall'),
  feral: getWowIcon('ability_druid_catform'),
  guardian: getWowIcon('ability_racial_bearform'),
  restoration_druid: getWowIcon('spell_nature_healingtouch'),

  // 악마사냥꾼
  havoc: getWowIcon('ability_demonhunter_specdps'),
  vengeance: getWowIcon('ability_demonhunter_spectank'),

  // 기원사
  devastation: getWowIcon('spell_evoker_devastation'),
  preservation: getWowIcon('spell_evoker_preservation'),
  augmentation: getWowIcon('spell_evoker_augmentation')
};

// 스탯 아이콘
export const statIcons = {
  strength: getWowIcon('spell_nature_strength'),
  agility: getWowIcon('spell_holy_blessingofagility'),
  intellect: getWowIcon('spell_holy_magicalsentry'),
  stamina: getWowIcon('spell_holy_wordfortitude'),
  critical: getWowIcon('spell_holy_blessingofstrength'),
  haste: getWowIcon('spell_nature_bloodlust'),
  mastery: getWowIcon('spell_holy_championsbond'),
  versatility: getWowIcon('spell_holy_mindvision')
};

// 일반 게임 아이콘
export const gameIcons = {
  // 클래스 아이콘 (gameIcons에서도 접근 가능하도록)
  hunter: getWowIcon('classicon_hunter'),
  evoker: getWowIcon('classicon_evoker'),

  // 레이드
  raid: getWowIcon('achievement_raid_allianceraid'),
  mythicplus: getWowIcon('achievement_challengemode_gold'),
  pvp: getWowIcon('achievement_pvp_a_01'),

  // 아이템 품질
  legendary: getWowIcon('inv_hammer_04'),
  epic: getWowIcon('inv_sword_39'),
  rare: getWowIcon('inv_weapon_shortblade_05'),
  uncommon: getWowIcon('inv_sword_04'),
  common: getWowIcon('inv_sword_02'),

  // 화폐
  gold: getWowIcon('inv_misc_coin_01'),
  honor: getWowIcon('spell_holy_championsgrace'),
  conquest: getWowIcon('achievement_pvp_a_16'),

  // 전투
  damage: getWowIcon('spell_fire_soulburn'),
  healing: getWowIcon('spell_nature_healingtouch'),
  shield: getWowIcon('ability_warrior_shieldwall'),
  threat: getWowIcon('ability_physical_taunt'),

  // 기타
  quest: getWowIcon('inv_misc_questionmark'),
  achievement: getWowIcon('achievement_level_10'),
  reputation: getWowIcon('achievement_reputation_01'),
  profession: getWowIcon('trade_engineering'),
  mount: getWowIcon('ability_mount_ridinghorse'),
  pet: getWowIcon('inv_box_petcarrier_01'),
  toy: getWowIcon('inv_misc_toy_10'),

  // 던전/레이드 아이콘
  nerubarak: getWowIcon('achievement_raid_ulduarraid_titan_01'),
  dungeonPortal: getWowIcon('spell_arcane_portaldalaran'),
  boss: getWowIcon('achievement_boss_ragnaros'),

  // 스킬 타입
  instant: getWowIcon('spell_nature_swiftness'),
  cast: getWowIcon('spell_holy_divinepurpose'),
  channel: getWowIcon('spell_arcane_mindmastery'),
  passive: getWowIcon('spell_nature_sleep'),
  cooldown: getWowIcon('spell_frost_coldhearted'),

  // 버프/디버프
  buff: getWowIcon('spell_holy_powerwordfortitude'),
  debuff: getWowIcon('spell_shadow_abominationexplosion'),
  dot: getWowIcon('spell_shadow_burningspirit'),
  hot: getWowIcon('spell_nature_rejuvenation'),

  // UI 아이콘 - 더 안정적인 아이콘 이름 사용
  settings: getWowIcon('trade_engineering'),
  search: getWowIcon('inv_misc_spyglass_02'),
  filter: getWowIcon('inv_misc_enggizmos_27'),
  sort: getWowIcon('inv_misc_map_01'),
  info: getWowIcon('inv_misc_book_07'),
  warning: getWowIcon('spell_holy_excorcism'),
  error: getWowIcon('spell_holy_excorcism_02'),
  success: getWowIcon('achievement_bg_winwsg'),

  // 대체 아이콘 (더 일반적인 이름)
  sword: getWowIcon('inv_sword_04'),
  shield: getWowIcon('inv_shield_06'),
  staff: getWowIcon('inv_staff_08'),
  bow: getWowIcon('inv_bow_02'),
  dagger: getWowIcon('inv_weapon_shortblade_05'),
  axe: getWowIcon('inv_axe_01'),
  mace: getWowIcon('inv_mace_01'),
  wand: getWowIcon('inv_wand_01')
};

// 커스텀 아이콘 컴포넌트 - 에러 핸들링과 로딩 상태 추가
export const WowIcon = ({ icon, size = 40, className = '', style = {}, alt = 'WoW Icon' }) => {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleError = () => {
    setImgError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // SVG 폴백 아이콘을 선택하는 로직
  const getFallbackIcon = () => {
    // URL에서 아이콘 타입을 추측
    if (icon.includes('sword') || icon.includes('weapon')) return 'sword';
    if (icon.includes('shield') || icon.includes('protection')) return 'shield';
    if (icon.includes('spell') || icon.includes('magic')) return 'magic';
    if (icon.includes('bow') || icon.includes('hunter')) return 'bow';
    if (icon.includes('heal') || icon.includes('holy')) return 'heal';
    if (icon.includes('tank') || icon.includes('defensive')) return 'tank';
    if (icon.includes('damage') || icon.includes('dps')) return 'dps';
    if (icon.includes('quest')) return 'quest';
    if (icon.includes('achievement')) return 'achievement';
    if (icon.includes('instant') || icon.includes('swiftness')) return 'instant';
    if (icon.includes('raid') || icon.includes('boss')) return 'raid';
    if (icon.includes('epic')) return 'epic';
    if (icon.includes('legendary')) return 'legendary';
    return 'sword'; // 기본값
  };

  // 이미지 로드 실패 시 SVG 대체 아이콘
  if (imgError) {
    const fallbackKey = getFallbackIcon();
    const svgIcon = defaultIcons[fallbackKey] || defaultIcons.sword;

    return (
      <div
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(192, 132, 252, 0.1))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#cdd6f4',
          padding: `${size * 0.2}px`,
          ...style
        }}
        dangerouslySetInnerHTML={{ __html: svgIcon }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        ...style
      }}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #2a2a3e, #3a3a5e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        >
          <div style={{
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)'
          }} />
        </div>
      )}
      <img
        src={icon}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          objectFit: 'cover',
          display: isLoading ? 'none' : 'block'
        }}
      />
    </div>
  );
};

export default {
  getWowIcon,
  classIcons,
  statIcons,
  gameIcons,
  WowIcon
};