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
    koreanName: "불의 정령",
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
    koreanName: "폭풍의 정령",
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
    koreanName: "마그마 토템",
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
    koreanName: "고대의 인도",
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
    koreanName: "얼음격노",
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
    koreanName: "냉기 충격",
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
    koreanName: "용암 쇄도",
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
    koreanName: "마력의 쇄도",
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
    koreanName: "세계의 분리의 메아리",
    englishName: "Echoes of Great Sundering",
    icon: "spell_nature_earthquake",
    description: "지진이 대지 충격의 재사용 대기시간을 1초 감소시키고, 대지 충격이 2초 동안 추가로 (주문력의 25%)의 물리 피해를 입힙니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성 패시브",
    spec: "정기"
  },

  // === 승천 (주요 쿨다운) ===
  ascendance: {
    id: "114050",
    koreanName: "승천",
    englishName: "Ascendance",
    icon: "spell_fire_elementaldevastation",
    description: "15초 동안 화염의 승천자로 변신합니다. 용암 폭발 시전 시간이 없어지고, 화염 충격이 최대 6개의 대상에게 확산됩니다.",
    cooldown: "3 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성",
    spec: "정기"
  },

  // === 패시브/버프 ===
  masterOfTheElements: {
    id: "16166",
    koreanName: "원소의 대가",
    englishName: "Master of the Elements",
    icon: "spell_nature_elementalabsorption",
    description: "용암 폭발을 시전하면 15초 동안 다음 번개 화살, 연쇄 번개, 또는 정기 작렬의 피해가 20% 증가합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성 패시브",
    spec: "정기"
  },

  maelstrom: {
    id: "343725",
    koreanName: "소용돌이",
    englishName: "Maelstrom",
    icon: "spell_nature_unrelentingstorm",
    description: "정기 주술사의 핵심 자원입니다. 번개 화살과 용암 폭발로 생성하고, 대지 충격과 지진으로 소모합니다. 최대 100까지 축적할 수 있습니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "메커니즘",
    spec: "정기"
  },

  // === 영웅 특성: 선견자 (Farseer) ===
  callOfTheAncestors: {
    id: "443450",
    koreanName: "선조의 부름",
    englishName: "Call of the Ancestors",
    icon: "ability_racial_ancestralcall",
    description: "용암 폭발이 조상을 소환하여 7초 동안 용암 폭발을 시전합니다. 번개 화살이 조상을 소환하여 7초 동안 연쇄 번개를 시전합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "영웅특성",
    spec: "정기",
    heroTalent: "farseer"
  },

  ancestralSwiftness: {
    id: "443454",
    koreanName: "선조의 신속함",
    englishName: "Ancestral Swiftness",
    icon: "inv_ability_farseershaman_ancestralswiftness",
    description: "즉시 시전됩니다. 다음 주문의 시전 시간을 제거하고 5초 동안 시전 속도가 10% 증가합니다. 강화된 선조를 소환합니다.",
    cooldown: "1 분 30 초",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "영웅특성",
    spec: "정기",
    heroTalent: "farseer"
  },

  // === 영웅 특성: 폭풍인도자 (Stormbringer) ===
  tempest: {
    id: "454009",
    koreanName: "폭풍",
    englishName: "Tempest",
    icon: "ability_thunderking_overcharge",
    description: "300 소용돌이를 소모하거나 각성의 폭풍 3중첩에 도달하면 번개 화살이 폭풍으로 전환되어 막대한 자연 피해를 입힙니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "소용돌이 300 또는 각성의 폭풍 3중첩",
    resourceGain: "없음",
    type: "영웅특성",
    spec: "정기",
    heroTalent: "stormbringer"
  },

  arcDischarge: {
    id: "455096",
    koreanName: "전격 방전",
    englishName: "Arc Discharge",
    icon: "ability_thunderking_lightningwhip",
    description: "폭풍 시전 후 다음 번개 화살 또는 연쇄 번개가 즉시 시전됩니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "영웅특성",
    spec: "정기",
    heroTalent: "stormbringer"
  },

  awakeningStorms: {
    id: "455129",
    koreanName: "깨어나는 폭풍",
    englishName: "Awakening Storms",
    icon: "spell_nature_callstorm",
    description: "정기 스킬로 소용돌이를 생성할 때마다 각성의 폭풍 중첩을 얻습니다. 3중첩에 도달하면 다음 번개 화살이 폭풍으로 전환됩니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "영웅특성",
    spec: "정기",
    heroTalent: "stormbringer"
  },

  // === 유틸리티 (공용 주술사 스킬) ===
  spiritwalkerGrace: {
    id: "79206",
    koreanName: "영혼나그네의 은총",
    englishName: "Spiritwalker's Grace",
    icon: "spell_shaman_spiritwalkersgrace",
    description: "15초 동안 이동 중에도 주문을 시전할 수 있습니다.",
    cooldown: "2 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "유틸리티",
    spec: "공용"
  },

  capacitorTotem: {
    id: "192058",
    koreanName: "축전 토템",
    englishName: "Capacitor Totem",
    icon: "spell_totem_wardofdraining",
    description: "2초 후 폭발하는 토템을 설치하여 8야드 내의 모든 적을 3초 동안 기절시킵니다.",
    cooldown: "1 분",
    castTime: "즉시",
    resourceCost: "0.026% (기본 마나 중)",
    resourceGain: "없음",
    type: "유틸리티",
    spec: "공용"
  },

  windRushTotem: {
    id: "192077",
    koreanName: "바람 질주 토템",
    englishName: "Wind Rush Totem",
    icon: "ability_shaman_windwalktotem",
    description: "15초 동안 15야드 내의 모든 파티원과 공격대원의 이동 속도를 60% 증가시키는 토템을 설치합니다.",
    cooldown: "2 분",
    castTime: "즉시",
    resourceCost: "0.01% (기본 마나 중)",
    resourceGain: "없음",
    type: "유틸리티",
    spec: "공용"
  },

  ghostWolf: {
    id: "2645",
    koreanName: "늑대 정령",
    englishName: "Ghost Wolf",
    icon: "spell_nature_spiritwolf",
    description: "늑대 정령으로 변신합니다. 이동 속도가 30%만큼 증가하고, 이동 속도가 100% 미만으로 떨어지지 않습니다.",
    cooldown: "없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "능력",
    spec: "공용"
  },

  astralShift: {
    id: "108271",
    koreanName: "영혼 이동",
    englishName: "Astral Shift",
    icon: "ability_shaman_astralshift",
    description: "영혼 일부를 안전한 정령계로 옮겨 12초 동안 받는 피해를 40%만큼 감소시킵니다.",
    cooldown: "2 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "생존",
    spec: "공용"
  },

  earthElemental: {
    id: "198103",
    koreanName: "대지의 정령",
    englishName: "Earth Elemental",
    icon: "spell_nature_earthelemental_totem",
    description: "1분 동안 상급 대지의 정령을 소환하여 시전자와 아군을 보호합니다. 정령이 활성화된 동안 최대 생명력이 15%만큼 증가합니다.",
    cooldown: "5 분",
    castTime: "즉시",
    range: "40 야드",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "생존",
    spec: "공용"
  },

  heroism: {
    id: "32182",
    koreanName: "영웅심",
    englishName: "Heroism",
    icon: "ability_shaman_heroism",
    description: "모든 파티원과 공격대원의 가속을 40초 동안 30%만큼 증가시킵니다. 효과를 받은 대상은 기력이 소진되어 10분 동안 영웅심이나 시간 왜곡 효과를 받지 못합니다.",
    cooldown: "5 분",
    castTime: "즉시",
    resourceCost: "0.4% (기본 마나 중)",
    resourceGain: "없음",
    type: "공격대 쿨기",
    spec: "공용",
    level: 48,
    faction: "얼라이언스"
  },

  bloodlust: {
    id: "2825",
    koreanName: "피의 욕망",
    englishName: "Bloodlust",
    icon: "spell_nature_bloodlust",
    description: "40초 동안 모든 파티원과 공격대원의 가속을 30%만큼 증가시킵니다. 효과를 받은 대상은 만족함 상태가 되어 10분 동안 피의 욕망 또는 시간 왜곡 효과를 받지 못합니다.",
    cooldown: "5 분",
    castTime: "즉시",
    resourceCost: "0.4% (기본 마나 중)",
    resourceGain: "없음",
    type: "공격대 쿨기",
    spec: "공용",
    level: 48,
    faction: "호드"
  },

  tremorTotem: {
    id: "8143",
    koreanName: "진동의 토템",
    englishName: "Tremor Totem",
    icon: "spell_nature_tremortotem",
    description: "시전자의 위치에 토템을 소환합니다. 이 토템은 10초 동안 땅을 울려 주위 30미터 반경 내의 파티원과 공격대원에게 걸린 공포, 현혹, 수면 효과를 제거합니다.",
    cooldown: "1 분",
    castTime: "즉시",
    duration: "10초",
    resourceCost: "0.46% (기본 마나 중)",
    resourceGain: "없음",
    type: "유틸리티",
    spec: "공용"
  },

  fusionOfElements: {
    id: "462841",
    koreanName: "정기의 융합",
    englishName: "Fusion of Elements",
    icon: "inv_10_enchanting2_elementalswirl_color1",
    description: "얼음격노 시전 후 다음으로 자연 및 화염 공격 주문을 시전할 때, 추가로 대상에게 60%의 효율로 정기 작렬을 시전합니다.",
    cooldown: "없음",
    castTime: "즉시",
    duration: "20초",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "버프",
    spec: "정기"
  }
};

// 스킬명 매핑 (renderTextWithSkillIcons용)
export const skillNameMap = {
  '번개 화살': 'lightningBolt',
  '용암 폭발': 'lavaBurst',
  '연쇄 번개': 'chainLightning',
  '대지 충격': 'earthShock',
  '지진': 'earthquake',
  '원소 폭발': 'elementalBlast',
  '화염 충격': 'flameShock',
  '불의 정령': 'fireElemental',
  '폭풍의 정령': 'stormElemental',
  '폭풍수호자': 'stormkeeper',
  '마그마 토템': 'liquidMagmaTotem',
  '태고의 파도': 'primordialWave',
  '고대의 인도': 'ancestralGuidance',
  '얼음격노': 'icefury',
  '냉기 충격': 'frostShock',
  '천둥폭풍': 'thunderstorm',
  '용암 쇄도': 'lavaSurge',
  '마력의 쇄도': 'surgeOfPower',
  '세계의 분리의 메아리': 'echoesOfGreatSundering',
  '승천': 'ascendance',
  '원소의 대가': 'masterOfTheElements',
  '소용돌이': 'maelstrom',
  '선조의 부름': 'callOfTheAncestors',
  '선조의 신속함': 'ancestralSwiftness',
  '폭풍': 'tempest',
  '전격 방전': 'arcDischarge',
  '깨어나는 폭풍': 'awakeningStorms',
  '영혼나그네의 은총': 'spiritwalkerGrace',
  '축전 토템': 'capacitorTotem',
  '바람 질주 토템': 'windRushTotem',
  '늑대 정령': 'ghostWolf',
  '영혼 이동': 'astralShift',
  '대지의 정령': 'earthElemental',
  '영웅심': 'heroism',
  '피의 욕망': 'bloodlust',
  '진동의 토템': 'tremorTotem',
  '정기의 융합': 'fusionOfElements'
};

// 배열 형태도 export (하위 호환성)
export const elementalShamanSkillsArray = Object.values(elementalShamanSkills);