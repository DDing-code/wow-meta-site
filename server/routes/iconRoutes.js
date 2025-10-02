// WoW 아이콘 제공 라우트
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// 아이콘 디렉토리 경로
const ICON_DIR = path.join(__dirname, '../../public/icons');
const FALLBACK_ICON = 'inv_misc_questionmark'; // 기본 아이콘

// 아이콘 매핑 (TGA 파일명 -> 웹 이미지 URL)
// WoW 아이콘은 일반적으로 Wowhead나 다른 CDN에서 제공됨
const ICON_CDN_BASE = 'https://wow.zamimg.com/images/wow/icons/large/';

// 스킬 ID를 아이콘 파일명으로 매핑
const skillIconMap = {
  // 전사 스킬
  'mortal_strike': 'ability_warrior_savageblow',
  'colossus_smash': 'ability_warrior_colossussmash',
  'execute': 'inv_sword_48',
  'overpower': 'ability_meleedamage',
  'whirlwind': 'ability_whirlwind',
  'bladestorm': 'ability_warrior_bladestorm',
  'bloodthirst': 'spell_nature_bloodlust',
  'raging_blow': 'warrior_wild_strike',
  'rampage': 'ability_warrior_rampage',
  'shield_slam': 'inv_shield_05',
  'thunder_clap': 'spell_nature_thunderclap',
  'revenge': 'ability_warrior_revenge',
  'shield_block': 'ability_defend',
  'avatar': 'warrior_talent_icon_avatar',
  'ravager': 'warrior_talent_icon_ravager',

  // 성기사 스킬
  'blade_of_justice': 'ability_paladin_bladeofjustice',
  'judgment': 'spell_holy_righteousfury',
  'templars_verdict': 'spell_paladin_templarsverdict',
  'wake_of_ashes': 'inv_sword_2h_artifactashbringer_d_01',
  'hammer_of_wrath': 'ability_paladin_hammerofwrath',
  'divine_storm': 'ability_paladin_divinestorm',
  'avenging_wrath': 'spell_holy_avenginewrath',
  'crusader_strike': 'spell_holy_crusaderstrike',
  'holy_light': 'spell_holy_holybolt',
  'divine_shield': 'spell_holy_divineshield',
  'lay_on_hands': 'spell_holy_layonhands',

  // 로그 스킬
  'mutilate': 'ability_rogue_shadowstrikes',
  'envenom': 'ability_rogue_disembowel',
  'garrote': 'ability_rogue_garrote',
  'rupture': 'ability_rogue_rupture',
  'dispatch': 'ability_rogue_waylay',
  'between_the_eyes': 'ability_rogue_betweentheeyes',
  'shadowstrike': 'ability_rogue_shadowstrike',
  'eviscerate': 'ability_rogue_eviscerate',
  'shadow_dance': 'ability_rogue_shadowdance',
  'symbols_of_death': 'spell_shadow_rune',

  // 죽음의 기사 스킬
  'heart_strike': 'inv_weapon_shortblade_40',
  'death_strike': 'ability_deathknight_butcher2',
  'marrowrend': 'ability_deathknight_marrowrend',
  'blood_boil': 'spell_deathknight_bloodboil',
  'obliterate': 'spell_deathknight_obliterate',
  'frost_strike': 'spell_deathknight_empowerruneblade2',
  'howling_blast': 'spell_frost_arcticwinds',
  'festering_strike': 'spell_deathknight_festering_strike',
  'death_coil': 'spell_shadow_deathcoil',
  'apocalypse': 'artifactability_unholydeathknight_deathsembrace',

  // 기본 아이콘
  'default': 'inv_misc_questionmark',
  'unknown': 'inv_misc_questionmark'
};

// 클래스별 기본 아이콘
const classIconMap = {
  'warrior': 'classicon_warrior',
  'paladin': 'classicon_paladin',
  'hunter': 'classicon_hunter',
  'rogue': 'classicon_rogue',
  'priest': 'classicon_priest',
  'deathknight': 'classicon_deathknight',
  'shaman': 'classicon_shaman',
  'mage': 'classicon_mage',
  'warlock': 'classicon_warlock',
  'monk': 'classicon_monk',
  'druid': 'classicon_druid',
  'demonhunter': 'classicon_demonhunter',
  'evoker': 'classicon_evoker'
};

// Wowhead CDN URL 생성
function getWowheadIconUrl(iconName, size = 'large') {
  // size: small (18x18), medium (36x36), large (56x56)
  const baseUrl = `https://wow.zamimg.com/images/wow/icons/${size}/`;
  return `${baseUrl}${iconName}.jpg`;
}

// 로컬 아이콘 확인
function checkLocalIcon(iconName) {
  const tgaPath = path.join(ICON_DIR, `${iconName}.tga`);
  const pngPath = path.join(ICON_DIR, 'png', `${iconName}.png`);

  if (fs.existsSync(pngPath)) {
    return { exists: true, path: `/icons/png/${iconName}.png`, type: 'png' };
  }
  if (fs.existsSync(tgaPath)) {
    return { exists: true, path: `/icons/${iconName}.tga`, type: 'tga' };
  }
  return { exists: false };
}

// 스킬 아이콘 가져오기
router.get('/skill/:skillId', (req, res) => {
  const { skillId } = req.params;
  const { size = 'large', format = 'url' } = req.query;

  // 스킬 ID를 아이콘 이름으로 매핑
  const iconName = skillIconMap[skillId] || skillIconMap['default'];

  // 로컬 아이콘 확인
  const localIcon = checkLocalIcon(iconName);

  if (format === 'url') {
    // URL만 반환
    if (localIcon.exists && localIcon.type === 'png') {
      res.json({
        success: true,
        url: localIcon.path,
        source: 'local'
      });
    } else {
      // Wowhead CDN 사용
      res.json({
        success: true,
        url: getWowheadIconUrl(iconName, size),
        source: 'wowhead'
      });
    }
  } else {
    // 실제 이미지 리다이렉트
    if (localIcon.exists && localIcon.type === 'png') {
      res.redirect(localIcon.path);
    } else {
      res.redirect(getWowheadIconUrl(iconName, size));
    }
  }
});

// 클래스 아이콘 가져오기
router.get('/class/:className', (req, res) => {
  const { className } = req.params;
  const { size = 'large', format = 'url' } = req.query;

  const iconName = classIconMap[className.toLowerCase()] || classIconMap['warrior'];

  if (format === 'url') {
    res.json({
      success: true,
      url: getWowheadIconUrl(iconName, size),
      source: 'wowhead'
    });
  } else {
    res.redirect(getWowheadIconUrl(iconName, size));
  }
});

// 직접 아이콘 이름으로 가져오기
router.get('/direct/:iconName', (req, res) => {
  const { iconName } = req.params;
  const { size = 'large', format = 'url' } = req.query;

  // 로컬 확인
  const localIcon = checkLocalIcon(iconName);

  if (format === 'url') {
    if (localIcon.exists && localIcon.type === 'png') {
      res.json({
        success: true,
        url: localIcon.path,
        source: 'local'
      });
    } else {
      res.json({
        success: true,
        url: getWowheadIconUrl(iconName, size),
        source: 'wowhead'
      });
    }
  } else {
    if (localIcon.exists && localIcon.type === 'png') {
      res.redirect(localIcon.path);
    } else {
      res.redirect(getWowheadIconUrl(iconName, size));
    }
  }
});

// 사용 가능한 로컬 아이콘 목록
router.get('/list/local', (req, res) => {
  try {
    const icons = [];

    // TGA 아이콘
    if (fs.existsSync(ICON_DIR)) {
      const tgaFiles = fs.readdirSync(ICON_DIR)
        .filter(file => file.endsWith('.tga'))
        .map(file => ({
          name: path.basename(file, '.tga'),
          type: 'tga',
          path: `/icons/${file}`
        }));
      icons.push(...tgaFiles);
    }

    // PNG 아이콘
    const pngDir = path.join(ICON_DIR, 'png');
    if (fs.existsSync(pngDir)) {
      const pngFiles = fs.readdirSync(pngDir)
        .filter(file => file.endsWith('.png'))
        .map(file => ({
          name: path.basename(file, '.png'),
          type: 'png',
          path: `/icons/png/${file}`
        }));
      icons.push(...pngFiles);
    }

    res.json({
      success: true,
      count: icons.length,
      icons: icons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 스킬 아이콘 매핑 목록
router.get('/list/skills', (req, res) => {
  const mappings = Object.entries(skillIconMap).map(([skillId, iconName]) => ({
    skillId,
    iconName,
    url: getWowheadIconUrl(iconName)
  }));

  res.json({
    success: true,
    count: mappings.length,
    mappings
  });
});

module.exports = router;