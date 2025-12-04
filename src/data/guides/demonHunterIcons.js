// 악마사냥꾼 가이드 아이콘 매핑
// Wowhead Tooltip API 직접 검증 완료 (2025-12-01)
// API: https://nether.wowhead.com/tooltip/spell/{spellId}?dataEnv=1&locale=0

export const demonHunterIconMapping = {
  // ===== 기본 스킬 (Wowhead API 검증됨) =====
  "악마의 이빨": {
    id: 162243,
    icon: "inv_weapon_glave_01",  // Wowhead 검증
    nameEn: "Demon's Bite",
    description: "분노를 생성하는 기본 공격입니다."
  },
  "혼돈의 일격": {
    id: 162794,
    icon: "ability_demonhunter_chaosstrike",  // Wowhead 검증
    nameEn: "Chaos Strike",
    description: "분노를 소모하여 대상에게 혼돈 피해를 입힙니다."
  },
  "파멸": {
    id: 201427,
    icon: "inv_glaive_1h_npc_d_02",  // Wowhead 검증 - 혼돈의 일격과 다른 아이콘!
    nameEn: "Annihilation",
    description: "탈태 중 혼돈의 일격이 강화된 형태입니다."
  },
  "안광": {
    id: 198013,
    icon: "ability_demonhunter_eyebeam",  // Wowhead 검증
    nameEn: "Eye Beam",
    description: "눈에서 혼돈 에너지 광선을 발사하여 전방의 모든 적에게 피해를 입힙니다."
  },
  "칼춤": {
    id: 188499,
    icon: "ability_demonhunter_bladedance",  // Wowhead 검증
    nameEn: "Blade Dance",
    description: "전투검을 휘둘러 주위 모든 적에게 피해를 입힙니다."
  },
  "죽음의 휩쓸기": {
    id: 210152,
    icon: "inv_glaive_1h_artifactaldrochi_d_02dual",  // Wowhead 검증 - 칼춤과 다른 아이콘!
    nameEn: "Death Sweep",
    description: "탈태 중 칼춤이 강화된 형태입니다."
  },
  "탈태": {
    id: 191427,
    icon: "ability_demonhunter_metamorphasisdps",  // Wowhead 검증
    nameEn: "Metamorphosis",
    description: "악마 형상으로 변신하여 공격력과 방어력이 증가합니다."
  },
  "지옥 돌진": {
    id: 195072,
    icon: "ability_demonhunter_felrush",  // Wowhead 검증
    nameEn: "Fel Rush",
    description: "전방으로 빠르게 돌진하여 경로상의 적에게 피해를 입힙니다."
  },
  "복수의 퇴각": {
    id: 198793,
    icon: "ability_demonhunter_vengefulretreat2",  // Wowhead 검증
    nameEn: "Vengeful Retreat",
    description: "뒤로 뛰어올라 경로상의 적에게 피해를 입힙니다."
  },
  "복수의 퇴각 + 탈태": {
    id: 198793,
    icon: "ability_demonhunter_vengefulretreat2",
    nameEn: "Vengeful Retreat + Metamorphosis",
    description: "복수의 퇴각과 탈태를 동시에 사용합니다."
  },
  "복수의 퇴각 + 안광": {
    id: 198793,
    icon: "ability_demonhunter_eyebeam",
    nameEn: "Vengeful Retreat + Eye Beam",
    description: "복수의 퇴각과 안광을 동시에 사용합니다."
  },
  "제물의 오라": {
    id: 258920,
    icon: "ability_demonhunter_immolation",  // Wowhead 검증
    nameEn: "Immolation Aura",
    description: "지옥불 오라를 활성화하여 주위 적에게 지속 피해를 입힙니다."
  },
  "제물의 오라 or 악마의 이빨": {
    id: 258920,
    icon: "ability_demonhunter_immolation",
    nameEn: "Immolation Aura or Demon's Bite",
    description: "상황에 따라 제물의 오라 또는 악마의 이빨을 사용합니다."
  },
  "글레이브 투척": {
    id: 185123,
    icon: "ability_demonhunter_throwglaive",  // Wowhead 검증
    nameEn: "Throw Glaive",
    description: "전투검을 던져 원거리 피해를 입힙니다."
  },
  "글레이브 투척 or 악마의 이빨": {
    id: 185123,
    icon: "ability_demonhunter_throwglaive",
    nameEn: "Throw Glaive or Demon's Bite",
    description: "상황에 따라 글레이브 투척 또는 악마의 이빨을 사용합니다."
  },
  "정수 파쇄": {
    id: 258860,
    icon: "spell_shadow_ritualofsacrifice",  // Wowhead 검증
    nameEn: "Essence Break",
    description: "대상에게 디버프를 걸어 받는 혼돈 피해를 증가시킵니다."
  },
  "지옥칼": {
    id: 232893,
    icon: "ability_demonhunter_felblade",  // Wowhead 검증
    nameEn: "Fel Blade",
    description: "대상에게 돌진하여 피해를 입히고 분노를 생성합니다."
  },
  "사냥": {
    id: 323639,
    icon: "ability_ardenweald_demonhunter",  // Wowhead 검증
    nameEn: "The Hunt",
    description: "대상에게 돌진하여 강력한 피해를 입힙니다."
  },

  // ===== 시길 계열 (Wowhead API 검증됨) =====
  "불꽃의 인장": {
    id: 204596,
    icon: "ability_demonhunter_sigilofinquisition",  // Wowhead 검증 - sigilofflame 존재안함!
    nameEn: "Sigil of Flame",
    description: "지면에 인장을 새겨 범위 내 적에게 화염 피해를 입힙니다."
  },
  "원한의 인장": {
    id: 207684,
    icon: "ability_demonhunter_sigilofmisery",  // Wowhead 검증
    nameEn: "Sigil of Misery",
    description: "지면에 인장을 새겨 범위 내 적을 공포에 빠뜨립니다."
  },
  "악의의 인장": {
    id: 388113,
    icon: "spell_shadow_shadesofdarkness",  // Wowhead 검증
    nameEn: "Sigil of Spite",
    description: "지면에 인장을 새겨 범위 내 적에게 피해를 입힙니다."
  },
  "파멸의 인장": {
    id: 452490,
    icon: "ability_bossfelorcs_necromancer_red",  // Wowhead 검증 (Fel-Scarred)
    nameEn: "Sigil of Doom",
    description: "지면에 인장을 새겨 강력한 범위 피해를 입힙니다."
  },

  // ===== 알드라치 파괴자 영웅 특성 (Wowhead API 검증됨) =====
  "파괴자의 글레이브": {
    id: 442294,
    icon: "inv_ability_aldrachireaverdemonhunter_reaversglaive",  // Wowhead 검증
    nameEn: "Reaver's Glaive",
    description: "강화된 글레이브 투척으로 전투의 전율 버프와 파괴자의 징표를 적용합니다."
  },
  "전투의 전율": {
    id: 442688,
    icon: "spell_mage_overpowered",  // Wowhead 검증 - 마법사 아이콘 재사용
    nameEn: "Thrill of the Fight",
    description: "파괴자의 글레이브 사용 시 15% 피해 증가 버프를 획득합니다."
  },
  "파괴자의 징표": {
    id: 442624,
    icon: "ability_hunter_harass",  // Wowhead 검증 - 사냥꾼 아이콘 재사용
    nameEn: "Reaver's Mark",
    description: "대상에 스택 디버프를 적용하여 부상당한 사냥감으로 깔때기 딜을 합니다."
  },
  "알드라치의 격노": {
    id: 444806,
    icon: "ability_glaivetoss",  // Wowhead 검증
    nameEn: "Fury of the Aldrachi",
    description: "칼춤과 죽음의 휩쓸기가 강화되어 추가 베기를 합니다."
  },

  // ===== 지옥상흔 영웅 특성 (Wowhead API 검증됨) =====
  "악마쇄도": {
    id: 452402,
    icon: "inv_ability_felscarreddemonhunter_demonsurge",  // Wowhead 검증
    nameEn: "Demonsurge",
    description: "특정 스킬 사용 시 스택을 획득하여 탈태를 강화합니다."
  },

  // ===== 기타 특성 =====
  "증오의 순환": {
    id: 258887,
    icon: "ability_demonhunter_eyebeam",
    nameEn: "Cycle of Hatred",
    description: "안광 쿨다운을 감소시킵니다."
  },
  "내부의 화염": {
    id: 427775,
    icon: "ability_demonhunter_immolation",
    nameEn: "A Fire Inside",
    description: "제물의 오라가 30% 확률로 즉시 재충전됩니다."
  },
  "불의낙인": {
    id: 204021,
    icon: "ability_demonhunter_fierybrand",
    nameEn: "Fiery Brand",
    description: "대상에 불의낙인을 찍어 받는 피해를 증가시킵니다."
  }
};

// ===== 유틸리티 함수 =====

// 스킬명으로 아이콘 정보 가져오기
export function getSkillIcon(skillName) {
  const normalized = skillName.replace(/\s+/g, ' ').trim();
  return demonHunterIconMapping[normalized] || null;
}

// 아이콘 이름만 가져오기
export function getIconName(skillName) {
  const skill = getSkillIcon(skillName);
  return skill ? skill.icon : 'inv_misc_questionmark';
}

// 아이콘 URL 생성
export function getIconUrl(skillName, size = 'medium') {
  const iconName = getIconName(skillName);
  return `https://wow.zamimg.com/images/wow/icons/${size}/${iconName}.jpg`;
}

// 모든 스킬명 목록
export const skillNameList = Object.keys(demonHunterIconMapping);

// Spell ID로 스킬 정보 조회
export function getSkillBySpellId(spellId) {
  const id = parseInt(spellId, 10);
  for (const [skillName, skillData] of Object.entries(demonHunterIconMapping)) {
    if (skillData.id === id) {
      return {
        id: String(skillData.id),
        koreanName: skillName,
        englishName: skillData.nameEn,
        icon: skillData.icon,
        description: skillData.description,
        type: 'skill',
        class: '악마사냥꾼'
      };
    }
  }
  return null;
}

// Spell ID → 아이콘 매핑 (빠른 조회용)
export const spellIdToIcon = Object.fromEntries(
  Object.entries(demonHunterIconMapping).map(([name, data]) => [
    String(data.id),
    {
      icon: data.icon,
      koreanName: name,
      englishName: data.nameEn,
      description: data.description
    }
  ])
);

export default demonHunterIconMapping;
