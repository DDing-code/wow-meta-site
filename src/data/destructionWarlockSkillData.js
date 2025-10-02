// 파괴 흑마법사 스킬 데이터 (11.2 패치 기준)
// 객체 형태로 재구성하여 가이드 컴포넌트에서 직접 참조 가능

export const destructionWarlockSkills = {
  // === 기본 리소스 생성 스킬 ===
  incinerate: {
    id: "29722",
    koreanName: "소각",
    englishName: "Incinerate",
    icon: "spell_fire_burnout",
    description: "대상에게 화염 피해를 입힙니다. 영혼의 조각 파편 2개를 생성합니다. 극대화 시 추가로 1개를 생성합니다.",
    cooldown: "해당 없음",
    castTime: "2 초",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "영혼의 조각 파편 2개 (극대화 시 3개)",
    type: "기본",
    spec: "파괴",
    range: "40 야드",
    school: "화염"
  },

  conflagrate: {
    id: "17962",
    koreanName: "점화",
    englishName: "Conflagrate",
    icon: "spell_fire_fireball",
    description: "대상에 점화를 일으켜 화염 피해를 입힙니다. 영혼의 조각 파편 5개를 생성합니다. 최대 충전 횟수 2회.",
    cooldown: "13 초 (충전 횟수 2회)",
    castTime: "즉시",
    resourceCost: "해당 없음",
    resourceGain: "영혼의 조각 파편 5개",
    type: "기본",
    spec: "파괴",
    range: "40 야드",
    school: "화염"
  },

  soulFire: {
    id: "6353",
    koreanName: "영혼의 불꽃",
    englishName: "Soul Fire",
    icon: "spell_fire_fireball02",
    description: "대상에게 암흑불길 피해를 입히고, 영혼의 조각 1개를 생성합니다.",
    cooldown: "20 초",
    castTime: "1.5 초",
    resourceCost: "해당 없음",
    resourceGain: "영혼의 조각 1개",
    type: "기본",
    spec: "파괴",
    range: "40 야드",
    school: "암흑불길"
  },

  // === 주력 딜링 스킬 ===
  chaosBolt: {
    id: "116858",
    koreanName: "혼돈의 화살",
    englishName: "Chaos Bolt",
    icon: "ability_warlock_chaosbolt",
    description: "엄청난 혼돈의 에너지를 방출하여 대상에게 암흑불길 피해를 입힙니다. 이 피해는 항상 극대화 효과를 발휘합니다.",
    cooldown: "해당 없음",
    castTime: "3 초",
    resourceCost: "영혼의 조각 2개",
    resourceGain: "없음",
    type: "기본",
    spec: "파괴",
    range: "40 야드",
    school: "암흑불길"
  },

  immolate: {
    id: "348",
    koreanName: "제물",
    englishName: "Immolate",
    icon: "spell_fire_immolation",
    description: "대상을 불태워 즉시 화염 피해를 입히고, 18초에 걸쳐 추가 화염 피해를 입힙니다.",
    cooldown: "해당 없음",
    castTime: "1.5 초",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "없음",
    type: "기본",
    spec: "파괴",
    range: "40 야드",
    duration: "18초",
    school: "화염"
  },

  shadowburn: {
    id: "17877",
    koreanName: "그림자 화상",
    englishName: "Shadowburn",
    icon: "spell_shadow_scourgebuild",
    description: "대상에게 암흑불길 피해를 입힙니다. 즉시 시전되며 이동 중에도 시전할 수 있습니다.",
    cooldown: "12 초",
    castTime: "즉시",
    resourceCost: "영혼의 조각 1개",
    resourceGain: "없음",
    type: "기본",
    spec: "파괴",
    range: "40 야드",
    school: "암흑불길"
  },

  // === 광역 스킬 ===
  rainOfFire: {
    id: "5740",
    koreanName: "불의 비",
    englishName: "Rain of Fire",
    icon: "spell_shadow_rainoffire",
    description: "지정한 지역에 8초 동안 화염 피해를 입히는 비를 내리게 합니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "영혼의 조각 3개",
    resourceGain: "없음",
    type: "기본",
    spec: "파괴",
    range: "40 야드",
    radius: "8 야드",
    duration: "8초",
    school: "화염"
  },

  cataclysm: {
    id: "152108",
    koreanName: "대재앙",
    englishName: "Cataclysm",
    icon: "achievement_zone_cataclysm",
    description: "대상 지역에 암흑불길 피해를 입히고, 모든 적에게 제물 효과를 적용합니다.",
    cooldown: "30 초",
    castTime: "즉시",
    resourceCost: "해당 없음",
    resourceGain: "없음",
    type: "특성",
    spec: "파괴",
    range: "40 야드",
    radius: "8 야드",
    school: "암흑불길"
  },

  channelDemonfire: {
    id: "196447",
    koreanName: "악마불 집중",
    englishName: "Channel Demonfire",
    icon: "spell_fire_ragnaros_lavaboltgreen",
    description: "3초에 걸쳐 40미터 내 자신의 제물(지옥소환사 사용 시 쇠퇴)에 걸린 무작위 대상에게 15발의 지옥불 화살을 발사합니다. 화살은 각각 대상에게 화염 피해를 입히고, 주위의 적에게도 화염 피해를 입힙니다.",
    cooldown: "25 초",
    castTime: "집중 (3 초)",
    resourceCost: "1.5% (기본 마나 중)",
    resourceGain: "없음",
    type: "특성",
    spec: "파괴",
    range: "40 야드",
    school: "화염"
  },

  // === 주요 쿨다운 ===
  summonInfernal: {
    id: "1122",
    koreanName: "소환: 지옥불정령",
    englishName: "Summon Infernal",
    icon: "spell_shadow_summoninfernal",
    description: "지옥불정령을 소환하여 30초 동안 전투를 지원하게 합니다. 소환 시 주변 적에게 피해를 입히며 기절시킵니다. 영혼의 조각 파편 3개를 생성합니다.",
    cooldown: "120 초",
    castTime: "즉시",
    resourceCost: "해당 없음",
    resourceGain: "영혼의 조각 파편 3개",
    type: "기본",
    spec: "파괴",
    range: "30 야드",
    duration: "30초",
    school: "암흑불길"
  },

  darkSoulInstability: {
    id: "113858",
    koreanName: "암흑의 영혼: 불안정",
    englishName: "Dark Soul: Instability",
    icon: "spell_shadow_sealofkings",
    description: "20초 동안 극대화 확률이 30%만큼 증가합니다.",
    cooldown: "120 초",
    castTime: "즉시",
    resourceCost: "해당 없음",
    resourceGain: "없음",
    type: "특성",
    spec: "파괴",
    duration: "20초"
  },

  // === 유틸리티 스킬 ===
  havoc: {
    id: "80240",
    koreanName: "대혼란",
    englishName: "Havoc",
    icon: "ability_warlock_baneofhavoc",
    description: "대상에게 12초 동안 대혼란을 시전합니다. 다른 대상에게 사용한 단일 대상 주문이 대혼란에 걸린 대상에게도 60%의 피해를 입힙니다.",
    cooldown: "30 초",
    castTime: "즉시",
    resourceCost: "해당 없음",
    resourceGain: "없음",
    type: "기본",
    spec: "파괴",
    range: "40 야드",
    duration: "12초"
  },

  dimensionalRift: {
    id: "196586",
    koreanName: "차원 균열",
    englishName: "Dimensional Rift",
    icon: "spell_warlock_demonsoul",
    description: "차원 균열을 열어 무작위 악마를 소환합니다. 최대 충전 횟수 3회.",
    cooldown: "45 초 (충전 횟수 3회)",
    castTime: "즉시",
    resourceCost: "해당 없음",
    resourceGain: "없음",
    type: "특성",
    spec: "파괴",
    range: "40 야드"
  },

  // === 영혼의 조각 (리소스) ===
  soulShard: {
    id: "resource",
    koreanName: "영혼의 조각",
    englishName: "Soul Shard",
    icon: "inv_misc_gem_amethyst_02",
    description: "파괴 흑마법사의 주요 자원입니다. 최대 5개까지 보유할 수 있으며, 10개의 파편으로 나뉩니다. 강력한 주문을 시전하는 데 사용됩니다.",
    type: "리소스"
  },

  // === 지옥소환사 영웅 특성 스킬 ===
  wither: {
    id: "445465",
    koreanName: "쇠퇴",
    englishName: "Wither",
    icon: "spell_shadow_unstableaffliction_3",
    description: "제물을 대체하는 강화된 DoT 효과입니다. 대상에게 중첩되는 피해를 입히며, 최대 8중첩까지 쌓입니다. 지옥소환사 영웅 특성 선택 시 제물이 자동으로 쇠퇴로 변환됩니다.",
    cooldown: "해당 없음",
    castTime: "1.5 초",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "없음",
    type: "영웅 특성",
    spec: "파괴",
    range: "40 야드",
    duration: "18초",
    school: "암흑",
    maxStacks: 8
  },

  blackenedSoul: {
    id: "440043",
    koreanName: "그을린 영혼",
    englishName: "Blackened Soul",
    icon: "spell_shadow_shadesofdarkness",
    description: "쇠퇴의 피해가 증가합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "영웅 특성 (패시브)",
    spec: "파괴"
  },

  malevolence: {
    id: "442726",
    koreanName: "악의",
    englishName: "Malevolence",
    icon: "spell_shadow_antishadow",
    description: "다음 쇠퇴의 중첩 수를 크게 증가시킵니다.",
    cooldown: "60 초",
    castTime: "즉시",
    resourceCost: "해당 없음",
    resourceGain: "없음",
    type: "영웅 특성",
    spec: "파괴"
  },

  xalansCruelty: {
    id: "440040",
    koreanName: "자란의 잔혹함",
    englishName: "Xalan's Cruelty",
    icon: "spell_fire_twilightcano",
    description: "화염 및 암흑 피해가 증폭됩니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "영웅 특성 (패시브)",
    spec: "파괴"
  },

  // === 악마학자 영웅 특성 관련 ===
  motherOfChaos: {
    id: "432794",
    koreanName: "혼돈의 어머니",
    englishName: "Mother of Chaos",
    icon: "spell_warlock_demonicempowerment",
    description: "영혼의 조각을 소비할 때마다 일정 확률로 임프 어미를 소환합니다. 임프 어미는 작은 임프들을 생성하여 적을 공격합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "영웅 특성 (패시브)",
    spec: "파괴"
  },

  overlord: {
    id: "432810",
    koreanName: "군주",
    englishName: "Overlord",
    icon: "spell_warlock_summonimpoutland",
    description: "악마 소환 시 일정 확률로 임프 군주를 대신 소환합니다. 임프 군주는 강력한 화염 볼트를 발사합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "영웅 특성 (패시브)",
    spec: "파괴"
  },

  demonicArt: {
    id: "432794",
    koreanName: "악마의 예술",
    englishName: "Demonic Art",
    icon: "spell_warlock_demonsoul",
    description: "악마학자 영웅 특성의 핵심 패시브입니다. 영혼의 조각을 소비하면 악마의 예술 효과가 발동되어 다음 혼돈의 화살의 피해가 증가합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "영웅 특성 (패시브)",
    spec: "파괴"
  },

  diabolicRitual: {
    id: "428514",
    koreanName: "악마의 의식",
    englishName: "Diabolic Ritual",
    icon: "spell_shadow_demonicempathy",
    description: "악마학자의 핵심 메커니즘입니다. 특정 주문을 시전하면 악마의 의식 진행도가 쌓이며, 완료 시 강력한 악마 효과를 발동합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "영웅 특성 (패시브)",
    spec: "파괴"
  },

  touchOfRancora: {
    id: "429893",
    koreanName: "원한의 손길",
    englishName: "Touch of Rancora",
    icon: "spell_shadow_ritualofsacrifice",
    description: "주문 피해가 증가하고 시전 시간이 감소합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "영웅 특성 (패시브)",
    spec: "파괴"
  },

  abyssalDominion: {
    id: "429798",
    koreanName: "심연의 지배",
    englishName: "Abyssal Dominion",
    icon: "spell_fire_felflamering",
    description: "지옥불정령이 강화되어 더 강력한 피해를 입힙니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "영웅 특성 (패시브)",
    spec: "파괴"
  },

  // === 주요 패시브 특성 ===
  roaringBlaze: {
    id: "205184",
    koreanName: "울부짖는 불길",
    englishName: "Roaring Blaze",
    icon: "inv_infernalbrimstone",
    description: "점화가 3초 동안 대상에게 울부짖는 불길 효과를 적용합니다. 울부짖는 불길에 걸린 대상에게 제물 또는 쇠퇴의 피해가 25%만큼 증가합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "특성 (패시브)",
    spec: "파괴",
    duration: "3초"
  },

  eradication: {
    id: "196412",
    koreanName: "파멸",
    englishName: "Eradication",
    icon: "spell_shadow_shadowfury",
    description: "혼돈의 화살 또는 그림자 화상이 6초 동안 대상에게 파멸 효과를 적용합니다. 파멸에 걸린 대상에게 시전하는 주문의 시전 속도가 10%만큼 증가합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "특성 (패시브)",
    spec: "파괴",
    duration: "6초"
  },

  ritualOfRuin: {
    id: "387156",
    koreanName: "파멸의 의식",
    englishName: "Ritual of Ruin",
    icon: "spell_shadow_twilight",
    description: "영혼의 조각을 15개 소비할 때마다 다음 혼돈의 화살 또는 불의 비가 영혼의 조각을 소비하지 않고 피해가 50%만큼 증가합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "특성 (패시브)",
    spec: "파괴"
  },

  infernalBolt: {
    id: "434506",
    koreanName: "지옥불 화살",
    englishName: "Infernal Bolt",
    icon: "spell_fel_firebolt",
    description: "심연의 지옥불로 타오르는 화살을 날려 적 대상에게 화염 피해를 입히고 영혼의 조각 3개를 생성합니다. 혼돈의 어머니가 소각을 강화하여 지옥불 화살로 전환시킵니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "해당 없음",
    resourceGain: "영혼의 조각 3개",
    type: "특성 (지옥불정령 강화)",
    spec: "파괴",
    range: "40 야드",
    school: "화염",
    condition: "영혼의 조각이 3개 미만일 때 사용 가능"
  },

  demonfireInfusion: {
    id: "456946",
    koreanName: "악마불 주입",
    englishName: "Demonfire Infusion",
    icon: "spell_fire_ragnaros_lavaboltwhirl",
    description: "악마불 집중의 효과가 강화됩니다. 발사되는 화살의 수가 증가하고 피해가 증가합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "특성 (패시브)",
    spec: "파괴"
  },

  decimation: {
    id: "457555",
    koreanName: "섬멸",
    englishName: "Decimation",
    icon: "spell_fire_felflamebolt",
    description: "대상의 생명력이 50% 이하일 때 영혼의 불꽃이 즉시 시전되며 피해가 증가합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    type: "특성 (패시브)",
    spec: "파괴"
  },

  // === 공통 유틸리티 ===
  summonFelguard: {
    id: "30146",
    koreanName: "소환: 지옥수호병",
    englishName: "Summon Felguard",
    icon: "spell_shadow_summonfelguard",
    description: "지옥수호병을 소환하여 전투를 지원하게 합니다.",
    cooldown: "해당 없음",
    castTime: "6 초",
    resourceCost: "1% (기본 마나 중)",
    type: "기본",
    spec: "공용",
    school: "암흑"
  },

  demonicGateway: {
    id: "111771",
    koreanName: "악마의 관문",
    englishName: "Demonic Gateway",
    icon: "spell_warlock_demonicportal_green",
    description: "두 개의 차원문을 생성합니다. 플레이어는 차원문을 클릭하여 반대편 차원문으로 순간이동할 수 있습니다.",
    cooldown: "10 초",
    castTime: "2 초",
    resourceCost: "2% (기본 마나 중)",
    type: "공용",
    spec: "공용",
    range: "70 야드",
    duration: "15분"
  },

  burningRush: {
    id: "111400",
    koreanName: "불타는 질주",
    englishName: "Burning Rush",
    icon: "spell_fire_burningembers",
    description: "이동 속도가 50%만큼 증가하지만, 초당 최대 생명력의 일정 비율만큼 생명력이 감소합니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "해당 없음",
    type: "공용",
    spec: "공용"
  },

  soulstone: {
    id: "20707",
    koreanName: "영혼석",
    englishName: "Soulstone",
    icon: "spell_shadow_soulgem",
    description: "대상에게 영혼석을 부여합니다. 대상이 사망하면 부활할 수 있습니다.",
    cooldown: "10 분",
    castTime: "3 초",
    resourceCost: "3% (기본 마나 중)",
    type: "공용",
    spec: "공용",
    range: "40 야드",
    duration: "15분"
  },

  healthstone: {
    id: "6201",
    koreanName: "생명석",
    englishName: "Create Healthstone",
    icon: "inv_stone_04",
    description: "생명석을 생성합니다. 생명석 사용 시 생명력을 회복합니다.",
    cooldown: "해당 없음",
    castTime: "3 초",
    resourceCost: "2% (기본 마나 중)",
    type: "공용",
    spec: "공용"
  },

  unendingResolve: {
    id: "104773",
    koreanName: "끝없는 결의",
    englishName: "Unending Resolve",
    icon: "spell_shadow_demonictactics",
    description: "8초 동안 받는 피해가 40%만큼 감소합니다.",
    cooldown: "180 초",
    castTime: "즉시",
    resourceCost: "해당 없음",
    type: "공용",
    spec: "공용",
    duration: "8초"
  },

  darkPact: {
    id: "108416",
    koreanName: "어둠의 약정",
    englishName: "Dark Pact",
    icon: "warlock_sacrificial_pact",
    description: "생명력의 20%를 희생하여 그 피해의 400%에 해당하는 피해를 흡수하는 보호막을 20초 동안 생성합니다.",
    cooldown: "60 초",
    castTime: "즉시",
    resourceCost: "해당 없음",
    type: "특성",
    spec: "공용",
    duration: "20초"
  }
};
