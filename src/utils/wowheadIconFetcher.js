// Wowhead 아이콘 가져오기 유틸리티
// 스킬 ID를 사용하여 Wowhead에서 직접 아이콘 URL을 생성

import { getAllIconMappings } from './iconMappingData';
import iconMapping from '../data/iconMapping.json';  // iconMapping.json 직접 임포트

/**
 * Wowhead 아이콘 URL 생성
 * @param {number} spellId - WoW 스킬 ID
 * @param {string} size - 아이콘 크기 ('small', 'medium', 'large')
 * @returns {string} - Wowhead 아이콘 URL
 */
export const getWowheadIconUrl = (spellId, size = 'large') => {
  // Wowhead는 스킬 ID를 기반으로 직접 아이콘 URL을 제공
  // 예: https://wow.zamimg.com/images/wow/icons/large/spell_holy_righteousfury.jpg

  // 하지만 스킬 ID로 직접 접근하는 것보다
  // Wowhead의 CDN에서 일반적인 아이콘 이름으로 접근하는 것이 더 안정적

  return `https://wow.zamimg.com/images/wow/icons/${size}/inv_misc_questionmark.jpg`;
};

/**
 * 스킬 ID와 이름을 기반으로 최적의 아이콘 URL 생성
 * @param {number} skillId - WoW 스킬 ID
 * @param {string} skillName - 영문 스킬 이름
 * @param {string} className - 클래스 이름
 * @returns {string} - 아이콘 URL
 */
export const getSmartIconUrl = (skillId, skillName, className = '') => {
  // 스킬 이름을 기반으로 아이콘 이름 추측
  const iconName = generateIconName(skillName, className);

  // Wowhead CDN URL 생성
  const baseUrl = 'https://wow.zamimg.com/images/wow/icons/large/';

  // 여러 가능한 아이콘 형식 시도
  const possibleUrls = [
    `${baseUrl}${iconName}.jpg`,
    `${baseUrl}ability_${className.toLowerCase()}_${iconName}.jpg`,
    `${baseUrl}spell_${getSpellSchool(skillName)}_${iconName}.jpg`,
    `${baseUrl}inv_${iconName}.jpg`
  ];

  // 첫 번째 URL 반환 (실제로는 이미지 로드 테스트 후 유효한 것을 반환해야 함)
  return possibleUrls[0];
};

/**
 * 스킬 이름을 아이콘 이름으로 변환
 * @param {string} skillName - 영문 스킬 이름
 * @returns {string} - 아이콘 이름
 */
function generateIconName(skillName, className = '') {
  if (!skillName) return 'inv_misc_questionmark';

  // 특수문자 제거 및 언더스코어로 변환
  let iconName = skillName
    .toLowerCase()
    .replace(/[':,]/g, '') // 특수문자 제거
    .replace(/\s+/g, '_')  // 공백을 언더스코어로
    .replace(/_+/g, '_')   // 중복 언더스코어 제거
    .replace(/^_|_$/g, ''); // 앞뒤 언더스코어 제거

  return iconName;
}

/**
 * 스킬 이름으로 주문 학파 추측
 * @param {string} skillName - 영문 스킬 이름
 * @returns {string} - 주문 학파
 */
function getSpellSchool(skillName) {
  const lowerName = skillName.toLowerCase();

  if (lowerName.includes('holy') || lowerName.includes('light')) return 'holy';
  if (lowerName.includes('shadow') || lowerName.includes('void')) return 'shadow';
  if (lowerName.includes('fire') || lowerName.includes('flame')) return 'fire';
  if (lowerName.includes('frost') || lowerName.includes('ice')) return 'frost';
  if (lowerName.includes('arcane')) return 'arcane';
  if (lowerName.includes('nature') || lowerName.includes('earth')) return 'nature';

  return 'physical'; // 기본값
}

/**
 * Wowhead 툴팁 스크립트 로드
 */
export const loadWowheadTooltips = () => {
  if (!document.getElementById('wowhead-script')) {
    const script = document.createElement('script');
    script.id = 'wowhead-script';
    script.src = 'https://wow.zamimg.com/widgets/power.js';
    script.async = true;

    // 스크립트 로드 후 툴팁 초기화
    script.onload = () => {
      if (window.$WowheadPower && window.$WowheadPower.refreshLinks) {
        window.$WowheadPower.refreshLinks();
      }
    };

    document.head.appendChild(script);
  }
};

// 스킬 ID별 실제 아이콘 매핑 - 모든 직업 통합
// iconMapping.json과 하드코딩된 매핑 병합
export const verifiedIconMappings = {
  // 성기사 (Paladin)
  20271: 'spell_holy_righteousfury', // Judgment (심판)
  24275: 'spell_paladin_hammerofwrath', // Hammer of Wrath (천벌의 망치)
  26573: 'spell_holy_innerfire', // Consecration (신성화)
  642: 'spell_holy_divineintervention', // Divine Shield (천상의 보호막)
  498: 'spell_holy_divineprotection', // Divine Protection (신의 가호)
  633: 'spell_holy_layonhands', // Lay on Hands (신의 축복)
  1044: 'spell_holy_sealofvalor', // Blessing of Freedom (자유의 축복)
  1022: 'spell_holy_sealofprotection', // Blessing of Protection (보호의 축복)
  6940: 'spell_holy_sealofsacrifice', // Blessing of Sacrifice (희생의 축복)
  853: 'spell_holy_sealofmight', // Hammer of Justice (심판의 망치)
  96231: 'spell_holy_rebuke', // Rebuke (비난)
  184575: 'ability_paladin_bladeofjustice', // Blade of Justice (정의의 칼날)
  85256: 'spell_paladin_templarsverdict', // Templar's Verdict (기사단의 선고)
  53385: 'ability_paladin_divinestorm', // Divine Storm (신성한 폭풍)
  255937: 'spell_paladin_wakeofashes', // Wake of Ashes (잿불 일깨우기)
  31884: 'spell_holy_avengingwrath', // Avenging Wrath (응징의 격노)
  31935: 'spell_holy_avengersshield', // Avenger's Shield (응징의 방패)
  53600: 'ability_paladin_shieldoftherighteousnew', // Shield of the Righteous (정의의 방패)
  86659: 'spell_holy_guardianspirit', // Guardian of Ancient Kings (빛의 수호자)
  20473: 'spell_holy_searinglight', // Holy Shock (성스러운 충격)
  85222: 'spell_paladin_lightofdawn', // Light of Dawn (빛의 파도)

  // 전사 (Warrior)
  100: 'ability_warrior_charge', // Charge (돌진)
  6544: 'ability_heroicleap', // Heroic Leap (영웅의 도약)
  6552: 'inv_gauntlets_04', // Pummel (자루 공격)
  23920: 'ability_warrior_shieldreflection', // Spell Reflection (주문 반사)
  1680: 'ability_whirlwind', // Whirlwind (소용돌이)
  12294: 'ability_warrior_savageblow', // Mortal Strike (필사의 일격)
  23881: 'spell_nature_bloodlust', // Bloodthirst (피의 갈증)
  167105: 'ability_warrior_colossussmash', // Colossus Smash (거인의 강타)
  7384: 'ability_meleedamage', // Overpower (제압)
  227847: 'ability_warrior_bladestorm', // Bladestorm (칼날 폭풍)
  260708: 'ability_rogue_slicedice', // Sweeping Strikes (휩쓸기 일격)
  118038: 'ability_warrior_challange', // Die by the Sword (칼로 산다)
  184367: 'ability_warrior_rampage', // Rampage (광란)
  85288: 'warrior_wild_strike', // Raging Blow (분노의 강타)
  23922: 'inv_shield_05', // Shield Slam (방패 밀쳐내기)
  2565: 'ability_defend', // Shield Block (방패 막기)
  6572: 'ability_warrior_revenge', // Revenge (복수)
  6343: 'spell_nature_thunderclap', // Thunder Clap (천둥벼락)
  871: 'ability_warrior_shieldwall', // Shield Wall (방패의 벽)
  12975: 'spell_holy_ashestoashes', // Last Stand (최후의 저항)
  97462: 'ability_warrior_rallyingcry', // Rallying Cry (재집결의 외침)
  5308: 'inv_sword_48', // Execute (마무리 일격)
  845: 'ability_warrior_cleave', // Cleave (쪼개기)
  107574: 'spell_warrior_avatar', // Avatar (투신)
  401150: 'spell_warrior_avatar', // Avatar Protection (투신 방어)
  1719: 'warrior_talent_icon_innerrage', // Recklessness (무모한 용맹)
  6673: 'ability_warrior_battleshout', // Battle Shout (전투의 외침)
  1715: 'ability_shieldbreak', // Hamstring (무력화)
  355: 'spell_nature_reincarnation', // Taunt (도발)
  34428: 'spell_impending_victory', // Victory Rush (연전연승)
  71: 'ability_warrior_defensivestance', // Defensive Stance (방어 태세)
  2458: 'ability_racial_avatar', // Berserker Stance (광폭 태세)
  1464: 'ability_warrior_decisivestrike', // Slam (강타)
  5246: 'ability_golemthunderclap', // Intimidating Shout (위협의 외침)
  18499: 'spell_nature_ancestralguardian', // Berserker Rage (광폭한 격노)
  184361: 'spell_shadow_unholyfrenzy', // Enrage (격노)
  184364: 'ability_warrior_focusedrage', // Enraged Regeneration (격노의 재생력)
  1160: 'ability_warrior_warcry', // Demoralizing Shout (사기의 외침)
  190456: 'ability_warrior_renewedvigor', // Ignore Pain (고통 감내)

  // iconMapping.json의 모든 매핑 통합
  ...getAllIconMappings(),
  ...iconMapping  // iconMapping.json 병합
};

/**
 * 스킬 ID로 검증된 아이콘 URL 가져오기
 * @param {number} skillId - WoW 스킬 ID
 * @returns {string} - 아이콘 URL
 */
export const getVerifiedIconUrl = (skillId) => {
  // 먼저 iconMapping.json 확인
  const iconName = iconMapping[skillId] || verifiedIconMappings[skillId];
  if (iconName) {
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
  }

  // 매핑이 없으면 기본 아이콘
  return `https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg`;
};

export default {
  getWowheadIconUrl,
  getSmartIconUrl,
  loadWowheadTooltips,
  getVerifiedIconUrl
};