// 악마 흑마법사 스킬 데이터 (11.2 패치 기준)
// 객체 형태로 재구성하여 가이드 컴포넌트에서 직접 참조 가능

export const demonologyWarlockSkills = {
  // === 핵심 빌더 스킬 ===
  shadowBolt: {
    id: "686",
    koreanName: "어둠의 화살",
    englishName: "Shadow Bolt",
    icon: "spell_shadow_shadowbolt",
    description: "적에게 어둠의 화살을 발사하여 (주문력의 70.2%)의 암흑 피해를 입힙니다. 영혼의 조각 1개를 생성합니다.",
    cooldown: "해당 없음",
    castTime: "2 초",
    resourceCost: "1.5% (기본 마나 중)",
    resourceGain: "영혼의 조각 1개",
    type: "기본",
    spec: "악마"
  },

  demonbolt: {
    id: "264178",
    koreanName: "악마 화살",
    englishName: "Demonbolt",
    icon: "inv_demonbolt",
    description: "타락한 악마의 불타는 영혼을 적에게 발사하여 (주문력의 396.778%)의 암흑불길 피해를 입힙니다. 영혼의 조각 2개를 생성합니다.",
    cooldown: "해당 없음",
    castTime: "4.5 초",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "영혼의 조각 2개",
    type: "기본",
    spec: "악마"
  },

  soulFire: {
    id: "6353",
    koreanName: "영혼의 불꽃",
    englishName: "Soul Fire",
    icon: "spell_fire_firebolt",
    description: "적의 영혼을 불태워 (주문력의 476.28%)의 화염 피해를 입히고 영혼의 조각 1개를 생성합니다.",
    cooldown: "45 초",
    castTime: "4 초",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "영혼의 조각 1개",
    type: "기본",
    spec: "공용"
  },

  // === 영혼의 조각 소비 스킬 ===
  handOfGuldan: {
    id: "105174",
    koreanName: "굴단의 손",
    englishName: "Hand of Gul'dan",
    icon: "ability_warlock_handofguldan",
    description: "날뛰는 임프로 가득 찬 유성을 떨어뜨립니다. 유성이 지면에 충돌하면 날뛰는 임프가 튀어나와 대상을 공격합니다.",
    cooldown: "해당 없음",
    castTime: "1.5 초",
    resourceCost: "영혼의 조각 1-3개",
    resourceGain: "없음",
    type: "기본",
    spec: "악마"
  },

  callDreadstalkers: {
    id: "104316",
    koreanName: "공포사냥개 부르기",
    englishName: "Call Dreadstalkers",
    icon: "spell_warlock_calldreadstalkers",
    description: "공포사냥개 2마리를 소환하여 12초 동안 전투를 돕게 합니다. 소환된 공포사냥개는 강력한 공격력을 가지고 있습니다.",
    cooldown: "20 초",
    castTime: "2 초",
    resourceCost: "영혼의 조각 2개",
    resourceGain: "없음",
    type: "기본",
    spec: "악마"
  },

  // === 주요 쿨다운 스킬 ===
  summonDemonicTyrant: {
    id: "265187",
    koreanName: "악마 폭군 소환",
    englishName: "Summon Demonic Tyrant",
    icon: "inv_summondemonictyrant",
    description: "악마 폭군을 소환하여 공포사냥개, 썩은마귀, 지옥수호병, 최대 10마리의 날뛰는 임프의 지속시간을 15초만큼 증가시킵니다. 또한 악마 폭군은 대상에게 피해를 입히는 동안 영향을 받는 악마들의 공격력을 25%만큼 증가시킵니다.",
    cooldown: "1 분",
    castTime: "2 초",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "없음",
    type: "기본",
    spec: "악마"
  },

  grimoireFelguard: {
    id: "111898",
    koreanName: "흑마법서: 지옥수호병",
    englishName: "Grimoire: Felguard",
    icon: "spell_shadow_demonicpact",
    description: "지옥수호병을 소환하여 17초 동안 대상을 공격하여 대상이 입는 피해가 125%만큼 증가합니다. 지옥수호병 소환 시 대상의 주문 시전을 방해하고 기절시킵니다.",
    cooldown: "2 분",
    castTime: "즉시",
    resourceCost: "영혼의 조각 1개",
    resourceGain: "없음",
    type: "기본",
    spec: "악마"
  },

  demonicStrength: {
    id: "267171",
    koreanName: "악마의 기운",
    englishName: "Demonic Strength",
    icon: "ability_warlock_demonicempowerment",
    description: "지옥수호병에게 악마의 기운을 불어넣고, 대상에게 달려들어 300%만큼 증가한 피해를 입히는 지옥폭풍을 사용하도록 명령합니다.",
    cooldown: "1 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성",
    spec: "악마"
  },

  // === 광역 스킬 ===
  implosion: {
    id: "196277",
    koreanName: "파열",
    englishName: "Implosion",
    icon: "inv_implosion",
    description: "모든 날뛰는 임프를 악마의 힘으로 대상에게 끌어당긴 후 격렬하게 폭발시켜, 8미터 내의 모든 적에게 (주문력의 54.5531%)의 암흑불길 피해를 입힙니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "없음",
    type: "기본",
    spec: "악마"
  },

  doom: {
    id: "603",
    koreanName: "파멸",
    englishName: "Doom",
    icon: "spell_shadow_auraofdarkness",
    description: "대상에게 임박한 파멸을 내려 즉시 (주문력의 104.406%)의 암흑 피해를 입히고 20초 후에 10미터 내의 적에게 (주문력의 290.928%)의 암흑 피해를 입힙니다.",
    cooldown: "30 초",
    castTime: "즉시",
    resourceCost: "1% (기본 마나 중)",
    resourceGain: "없음",
    type: "주기 피해",
    spec: "악마"
  },

  // === 유틸리티 스킬 ===
  soulStrike: {
    id: "264057",
    koreanName: "영혼의 일격",
    englishName: "Soul Strike",
    icon: "inv_polearm_2h_fellord_04",
    description: "지옥수호병에게 적의 영혼을 강타하여 암흑 피해를 입히도록 명령합니다. 영혼의 조각 1개를 생성합니다.",
    cooldown: "10 초",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "영혼의 조각 1개",
    type: "기본",
    spec: "악마"
  },

  netherPortal: {
    id: "267217",
    koreanName: "황천의 차원문",
    englishName: "Nether Portal",
    icon: "inv_netherportal",
    description: "15초 동안 뒤틀린 황천으로 통하는 차원문을 강제로 엽니다. 영혼의 조각을 소비할 때마다 황천의 악마를 끌어내어 전투를 돕게 합니다.",
    cooldown: "3 분",
    castTime: "1.5 초",
    resourceCost: "영혼의 조각 1개",
    resourceGain: "없음",
    type: "특성",
    spec: "악마"
  },

  soulRot: {
    id: "386997",
    koreanName: "영혼 부식",
    englishName: "Soul Rot",
    icon: "inv_ability_warlock_soulrot",
    description: "현재 대상과 주위에 있는 최대 4명의 추가 대상의 생명을 말라붙게 만들어 8초에 걸쳐 암흑 피해를 입힙니다. 영혼 부식으로 입힌 피해의 50%만큼 생명력을 회복합니다.",
    cooldown: "1 분",
    castTime: "1.5 초",
    resourceCost: "0.5% (기본 마나 중)",
    resourceGain: "없음",
    type: "주기 피해",
    spec: "공용"
  },

  // === 생존 스킬 ===
  darkPact: {
    id: "108416",
    koreanName: "어둠의 서약",
    englishName: "Dark Pact",
    icon: "spell_shadow_deathpact",
    description: "현재 생명력의 20%만큼을 희생시켜, 20초 동안 희생한 생명력의 200%만큼 피해를 흡수하는 보호막을 자신에게 씌웁니다.",
    cooldown: "1 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "생존",
    spec: "공용"
  },

  // === 펫 스킬 ===
  felstorm: {
    id: "89751",
    koreanName: "지옥폭풍",
    englishName: "Felstorm",
    icon: "ability_warrior_bladestorm",
    description: "지옥수호병이 무기를 휘둘러 8미터 내에 있는 모든 적에게 5초 동안 1초마다 물리 피해를 입힙니다.",
    cooldown: "30 초",
    castTime: "즉시",
    resourceCost: "기력 60",
    resourceGain: "없음",
    type: "펫 스킬",
    spec: "공용"
  },

  summonFelguard: {
    id: "30146",
    koreanName: "지옥수호병 소환",
    englishName: "Summon Felguard",
    icon: "spell_shadow_summonfelguard",
    description: "지옥수호병을 소환하여 전투를 돕게 합니다. 악마 전문화의 기본 펫입니다.",
    cooldown: "해당 없음",
    castTime: "6 초",
    resourceCost: "영혼의 조각 1개",
    resourceGain: "없음",
    type: "소환",
    spec: "악마"
  },

  // === 특성 관련 ===
  wickedMaw: {
    id: "267170",
    koreanName: "악의 아귀",
    englishName: "Wicked Maw",
    icon: "ability_creature_poison_01_purple",
    description: "공포이빨이 적중하면 다음 12초 동안 대상에게 주문 및 능력으로 입히는 피해가 20%만큼 증가합니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성 패시브",
    spec: "악마"
  },

  deathbolt: {
    id: "264106",
    koreanName: "죽음의 화살",
    englishName: "Deathbolt",
    icon: "spell_fire_twilightflamebolt",
    description: "대상에게 죽음의 화살을 날려, 대상에게 걸린 주문의 잔여 피해 중 50%에 해당하는 피해를 축적시키고 3초에 걸쳐 입힙니다.",
    cooldown: "30 초",
    castTime: "1 초",
    resourceCost: "영혼의 조각 3개",
    resourceGain: "없음",
    type: "특성",
    spec: "공용"
  }
};

// 배열 형태도 export (하위 호환성)
export const demonologyWarlockSkillsArray = Object.values(demonologyWarlockSkills);