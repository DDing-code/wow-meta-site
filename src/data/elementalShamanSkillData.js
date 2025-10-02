// 정기 주술사 스킬 데이터 (11.2 패치 기준)
// 객체 형태로 재구성하여 가이드 컴포넌트에서 직접 참조 가능

export const elementalShamanSkills = {
  // === 핵심 빌더 스킬 ===
  lightningBolt: {
    id: "188196",
    koreanName: "번개 화살",
    englishName: "Lightning Bolt",
    icon: "spell_nature_lightning",
    description: "대상에게 번개를 발사하여 (주문력의 66.6%)의 자연 피해를 입힙니다. 소용돌이를 8 생성합니다.",
    cooldown: "해당 없음",
    castTime: "2 초",
    resourceCost: "0.01% (기본 마나 중)",
    resourceGain: "소용돌이 8",
    type: "기본",
    spec: "정기"
  },

  lavaBurst: {
    id: "51505",
    koreanName: "용암 폭발",
    englishName: "Lava Burst",
    icon: "spell_shaman_lavaburst",
    description: "대상에게 용암을 발사하여 (주문력의 145.8%)의 화염 피해를 입힙니다. 화염 충격에 걸린 대상에게는 치명타가 보장됩니다. 소용돌이를 10 생성합니다.",
    cooldown: "8 초",
    castTime: "2 초",
    resourceCost: "0.025% (기본 마나 중)",
    resourceGain: "소용돌이 10",
    type: "기본",
    spec: "정기"
  },

  chainLightning: {
    id: "188443",
    koreanName: "연쇄 번개",
    englishName: "Chain Lightning",
    icon: "spell_nature_chainlightning",
    description: "적에게 번개를 발사하여 (주문력의 45.9%)의 자연 피해를 입히고 최대 5명의 추가 대상에게 튀어 나갑니다. 소용돌이를 4 생성합니다.",
    cooldown: "해당 없음",
    castTime: "2 초",
    resourceCost: "0.01% (기본 마나 중)",
    resourceGain: "소용돌이 4(대상당)",
    type: "기본",
    spec: "정기"
  },

  // === 소용돌이 소비 스킬 ===
  earthShock: {
    id: "8042",
    koreanName: "대지 충격",
    englishName: "Earth Shock",
    icon: "spell_nature_earthshock",
    description: "대지의 힘으로 적을 충격하여 (주문력의 211.788%)의 자연 피해를 입힙니다. 소용돌이 60을 소비합니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "소용돌이 60",
    resourceGain: "없음",
    type: "기본",
    spec: "정기"
  },

  earthquake: {
    id: "61882",
    koreanName: "지진",
    englishName: "Earthquake",
    icon: "spell_shaman_earthquake",
    description: "대상 위치에 지진을 일으켜 6초 동안 1초마다 (주문력의 21.4857%)의 물리 피해를 입힙니다. 소용돌이 60을 소비합니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "소용돌이 60",
    resourceGain: "없음",
    type: "기본",
    spec: "정기"
  },

  elementalBlast: {
    id: "117014",
    koreanName: "원소 폭발",
    englishName: "Elemental Blast",
    icon: "shaman_talent_elementalblast",
    description: "대상에게 원소의 힘을 발사하여 (주문력의 196.2%)의 원소 피해를 입힙니다. 10초 동안 치명타, 가속, 특화 중 하나가 3%만큼 증가합니다. 소용돌이를 30 생성합니다.",
    cooldown: "12 초",
    castTime: "2 초",
    resourceCost: "0.015% (기본 마나 중)",
    resourceGain: "소용돌이 30",
    type: "특성",
    spec: "정기"
  },

  // === 주기 피해 스킬 ===
  flameShock: {
    id: "188389",
    koreanName: "화염 충격",
    englishName: "Flame Shock",
    icon: "spell_fire_flameshock",
    description: "대상을 화염으로 충격하여 즉시 (주문력의 15.4%)의 화염 피해를 입히고 18초에 걸쳐 (주문력의 64.764%)의 추가 화염 피해를 입힙니다.",
    cooldown: "6 초",
    castTime: "즉시",
    resourceCost: "0.015% (기본 마나 중)",
    resourceGain: "없음",
    type: "주기 피해",
    spec: "정기"
  },

  // === 주요 쿨다운 스킬 ===
  fireElemental: {
    id: "198067",
    koreanName: "불꽃 정령",
    englishName: "Fire Elemental",
    icon: "spell_fire_elemental_totem",
    description: "불꽃 정령을 소환하여 30초 동안 전투를 돕게 합니다. 불꽃 정령은 용암 폭발을 사용할 수 있습니다.",
    cooldown: "2.5 분",
    castTime: "즉시",
    resourceCost: "0.05% (기본 마나 중)",
    resourceGain: "없음",
    type: "기본",
    spec: "정기"
  },

  stormElemental: {
    id: "192249",
    koreanName: "폭풍 정령",
    englishName: "Storm Elemental",
    icon: "inv_stormelemental",
    description: "폭풍 정령을 소환하여 30초 동안 전투를 돕게 합니다. 폭풍 정령의 공격은 바람 질풍을 부여하여 치명타 확률을 증가시킵니다.",
    cooldown: "2.5 분",
    castTime: "즉시",
    resourceCost: "0.05% (기본 마나 중)",
    resourceGain: "없음",
    type: "특성",
    spec: "정기"
  },

  stormkeeper: {
    id: "191634",
    koreanName: "폭풍수호자",
    englishName: "Stormkeeper",
    icon: "ability_thunderking_lightningwhip",
    description: "번개 화살 또는 연쇄 번개를 즉시 시전하고 피해가 150%만큼 증가하는 효과를 2회 부여합니다. 15초 동안 지속됩니다.",
    cooldown: "1 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "정기"
  },

  liquidMagmaTotem: {
    id: "192222",
    koreanName: "액체 마그마 토템",
    englishName: "Liquid Magma Totem",
    icon: "spell_shaman_spewlava",
    description: "토템을 소환하여 15초 동안 6초마다 무작위 적에게 용암 폭발을 발사합니다. 최대 3개 대상을 공격합니다.",
    cooldown: "1 분",
    castTime: "즉시",
    resourceCost: "0.05% (기본 마나 중)",
    resourceGain: "없음",
    type: "특성",
    spec: "정기"
  },

  // === 유틸리티 스킬 ===
  primordialWave: {
    id: "375982",
    koreanName: "태고의 파도",
    englishName: "Primordial Wave",
    icon: "inv_ability_shaman_primordialwave",
    description: "대상에게 화염 충격을 적용하고 다음 용암 폭발이 추가로 튀어 나가게 합니다. 주변 대상에게도 화염 충격을 확산시킵니다.",
    cooldown: "45 초",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성",
    spec: "정기"
  },

  ancestralGuidance: {
    id: "108281",
    koreanName: "선조의 인도",
    englishName: "Ancestral Guidance",
    icon: "ability_shaman_ancestralguidance",
    description: "10초 동안 입힌 피해의 25%만큼 부상당한 아군 3명을 치유합니다.",
    cooldown: "2 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성",
    spec: "공용"
  },

  icefury: {
    id: "210714",
    koreanName: "얼음 격노",
    englishName: "Icefury",
    icon: "spell_frost_frostbolt",
    description: "대상에게 얼음을 발사하여 (주문력의 113.4%)의 냉기 피해를 입힙니다. 4회의 냉기 충격을 부여하여 다음 서리 충격의 피해가 200%만큼 증가합니다.",
    cooldown: "30 초",
    castTime: "2 초",
    resourceCost: "0.03% (기본 마나 중)",
    resourceGain: "소용돌이 25",
    type: "특성",
    spec: "정기"
  },

  frostShock: {
    id: "196840",
    koreanName: "서리 충격",
    englishName: "Frost Shock",
    icon: "spell_frost_frostshock",
    description: "대상에게 냉기를 발사하여 (주문력의 83.16%)의 냉기 피해를 입히고 이동 속도를 50%만큼 6초 동안 감소시킵니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "정기"
  },

  thunderstorm: {
    id: "51490",
    koreanName: "천둥폭풍",
    englishName: "Thunderstorm",
    icon: "spell_shaman_thunderstorm",
    description: "자신 주위의 모든 적을 밀쳐내고 (주문력의 19.8%)의 자연 피해를 입힙니다. 소용돌이를 15 생성합니다.",
    cooldown: "30 초",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "소용돌이 15",
    type: "기본",
    spec: "정기"
  },

  lavaSurge: {
    id: "77756",
    koreanName: "용암 급증",
    englishName: "Lava Surge",
    icon: "spell_shaman_lavasurge",
    description: "화염 충격이 주기 피해를 입힐 때마다 15%의 확률로 용암 폭발의 재사용 대기시간이 초기화되고 다음 용암 폭발을 즉시 시전할 수 있습니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성 패시브",
    spec: "정기"
  },

  surgeOfPower: {
    id: "262303",
    koreanName: "힘의 쇄도",
    englishName: "Surge of Power",
    icon: "spell_nature_shamanrage",
    description: "대지 충격 또는 지진 사용 후 다음 번개 화살, 연쇄 번개, 용암 폭발, 서리 충격의 효과가 증가합니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성 패시브",
    spec: "정기"
  },

  echoesOfGreatSundering: {
    id: "384087",
    koreanName: "위대한 분열의 메아리",
    englishName: "Echoes of Great Sundering",
    icon: "spell_nature_earthquake",
    description: "지진이 대지 충격의 재사용 대기시간을 1초 감소시키고, 대지 충격이 2초 동안 추가로 (주문력의 25%)의 물리 피해를 입힙니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성 패시브",
    spec: "정기"
  }
};

// 배열 형태도 export (하위 호환성)
export const elementalShamanSkillsArray = Object.values(elementalShamanSkills);