// 고통 흑마법사 스킬 데이터 (11.2 패치 기준)
// 객체 형태로 재구성하여 가이드 컴포넌트에서 직접 참조 가능

export const afflictionWarlockSkills = {
  // === DoT (Damage over Time) 관리 스킬 ===
  agony: {
    id: "980",
    koreanName: "고통",
    englishName: "Agony",
    icon: "spell_shadow_curseofsargeras",
    description: "대상에게 심화되는 고통을 선사하여 18초에 걸쳐 최대 암흑 피해를 입힙니다. 피해량은 낮게 시작해서 시간이 지날수록 점점 증가합니다. 고통을 갱신하면 현재의 피해량이 그대로 유지됩니다. 고통으로 적에게 피해를 입히면 때때로 영혼의 조각이 1개 생성됩니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "1% (기본 마나 중)",
    resourceGain: "영혼의 조각 (확률적)",
    type: "기본",
    spec: "고통",
    range: "40 야드",
    duration: "18초",
    dispelType: "저주"
  },

  corruption: {
    id: "172",
    koreanName: "부패",
    englishName: "Corruption",
    icon: "spell_shadow_abominationexplosion",
    description: "대상을 부패시켜 즉시 암흑 피해를 입히고 14초에 걸쳐 추가 암흑 피해를 입힙니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "1% (기본 마나 중)",
    resourceGain: "없음",
    type: "기본",
    spec: "고통",
    range: "40 야드",
    duration: "14초",
    dispelType: "마법"
  },

  unstableAffliction: {
    id: "30108",
    koreanName: "불안정한 고통",
    englishName: "Unstable Affliction",
    icon: "spell_shadow_unstableaffliction_3",
    description: "대상을 고통에 빠뜨려 8초에 걸쳐 암흑 피해를 입힙니다. 불안정한 고통은 대상에게 한 번에 최대 5번까지 중첩시킬 수 있습니다. 불안정한 고통에 걸린 대상에게 10%만큼 증가한 피해를 입힙니다. 효과가 해제되면 피해를 해제한 대상에게 입히고, 4초 동안 침묵시킵니다.",
    cooldown: "해당 없음",
    castTime: "1.5 초",
    resourceCost: "영혼의 조각 1개",
    resourceGain: "없음",
    type: "기본",
    spec: "공용",
    range: "40 야드",
    duration: "8초",
    dispelType: "마법",
    maxStacks: 5
  },

  // === 영혼의 조각 소비 스킬 ===
  maleficRapture: {
    id: "324536",
    koreanName: "사악한 환희",
    englishName: "Malefic Rapture",
    icon: "ability_warlock_everlastingaffliction",
    description: "모든 대상에게 주문으로 부여한 주기적인 피해 효과가 폭발을 일으켜 효과 하나당 암흑불길 피해를 입힙니다.",
    cooldown: "해당 없음",
    castTime: "1.5 초",
    resourceCost: "영혼의 조각 1개",
    resourceGain: "없음",
    type: "기본",
    spec: "고통",
    school: "암흑불길"
  },

  seedOfCorruption: {
    id: "27243",
    koreanName: "부패의 씨앗",
    englishName: "Seed of Corruption",
    icon: "spell_shadow_seedofdestruction",
    description: "적의 몸 안에 악마의 씨앗을 심어 12초 후에 폭발시킵니다. 폭발 시 10미터 내의 모든 적에게 암흑 피해를 입히고 부패 효과를 부여합니다. 대상이 다른 폭발에 휘말리거나 흑마법사의 주문으로 일정 피해를 입으면 씨앗이 더 일찍 폭발합니다.",
    cooldown: "해당 없음",
    castTime: "2 초",
    resourceCost: "영혼의 조각 1개",
    resourceGain: "없음",
    type: "기본",
    spec: "공용",
    range: "40 야드",
    duration: "12초",
    radius: "10 야드"
  },

  // === 주요 쿨다운 스킬 ===
  haunt: {
    id: "48181",
    koreanName: "유령 출몰",
    englishName: "Haunt",
    icon: "ability_warlock_haunt",
    description: "유령의 영혼이 대상에 다가가 암흑 피해를 입히고, 18초 동안 대상에 대한 공격력을 12%만큼 증가시킵니다. 대상이 죽으면 유령 출몰의 재사용 대기시간이 초기화됩니다.",
    cooldown: "15 초",
    castTime: "1.5 초",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "없음",
    type: "기본",
    spec: "공용",
    range: "40 야드",
    duration: "18초"
  },

  summonDarkglare: {
    id: "205180",
    koreanName: "암흑시선 소환",
    englishName: "Summon Darkglare",
    icon: "inv_beholderwarlock",
    description: "뒤틀린 황천에서 암흑시선을 소환하여 모든 적에 대한 자신의 지속 피해 효과의 지속시간을 8초만큼 연장합니다. 암흑시선은 20초 동안 전투를 도우며 대상을 폭발시켜 암흑 피해를 입히고, 이 피해는 암흑시선의 현재 대상에게 활성화되어 있는 지속 피해 효과 하나당 45%만큼 증가합니다.",
    cooldown: "2 분",
    castTime: "즉시",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "없음",
    type: "기본",
    spec: "공용",
    duration: "20초"
  },

  soulRot: {
    id: "386997",
    koreanName: "영혼 부식",
    englishName: "Soul Rot",
    icon: "inv_ability_warlock_soulrot",
    description: "현재 대상과 주위에 있는 최대 4명의 추가 대상의 생명을 말라붙게 만들어 8초에 걸쳐 주 대상에게는 암흑 피해를, 부가 대상에게는 암흑 피해를 입힙니다. 영혼 부식으로 입힌 피해의 50%만큼 생명력을 회복합니다.",
    cooldown: "1 분",
    castTime: "1.5 초",
    resourceCost: "0.5% (기본 마나 중)",
    resourceGain: "없음",
    type: "기본",
    spec: "공용",
    range: "40 야드",
    duration: "8초",
    maxTargets: 5
  },

  phantomSingularity: {
    id: "205179",
    koreanName: "유령 특이점",
    englishName: "Phantom Singularity",
    icon: "inv_enchant_voidsphere",
    description: "대상의 위에 유령 특이점을 생성하고 15미터 내의 모든 적의 생명력을 흡수하여 16초에 걸쳐 피해를 입힙니다. 흑마법사는 피해량의 25%에 해당하는 생명력을 회복합니다.",
    cooldown: "45 초",
    castTime: "즉시",
    resourceCost: "1% (기본 마나 중)",
    resourceGain: "없음",
    type: "기본",
    spec: "공용",
    range: "40 야드",
    duration: "16초",
    radius: "15 야드"
  },

  vileTaint: {
    id: "278350",
    koreanName: "사악한 타락",
    englishName: "Vile Taint",
    icon: "sha_spell_shadow_shadesofdarkness_nightborne",
    description: "대상 위치에 맹독을 폭발시켜 10미터 내에 있는 8명의 적에게 10초에 걸쳐 암흑 피해를 입히고 고통과 피로의 저주를 부여합니다.",
    cooldown: "30 초",
    castTime: "1.5 초",
    resourceCost: "영혼의 조각 1개",
    resourceGain: "없음",
    type: "기본",
    spec: "공용",
    range: "40 야드",
    duration: "10초",
    radius: "10 야드",
    maxTargets: 8
  },

  // === 필러 스킬 (리소스 생성) ===
  drainSoul: {
    id: "198590",
    koreanName: "영혼 흡수",
    englishName: "Drain Soul",
    icon: "spell_shadow_haunting",
    description: "적의 영혼을 흡수해 5초에 걸쳐 암흑 피해를 입힙니다. 남은 생명력이 20% 미만인 적에게 공격력이 100%만큼 증가합니다. 이 효과가 지속되는 동안 대상이 죽으면 영혼의 조각 1개를 생성합니다.",
    cooldown: "해당 없음",
    castTime: "집중",
    resourceCost: "0% (기본 마나 중) 및 매 초마다 추가 1%",
    resourceGain: "영혼의 조각 1개 (처치 시)",
    type: "기본",
    spec: "공용",
    range: "40 야드",
    duration: "5초"
  },

  shadowBolt: {
    id: "686",
    koreanName: "어둠의 화살",
    englishName: "Shadow Bolt",
    icon: "spell_shadow_shadowbolt",
    description: "적에게 어둠의 화살을 발사하여 암흑 피해를 입힙니다. 영혼의 조각 파편을 생성합니다.",
    cooldown: "해당 없음",
    castTime: "2 초",
    resourceCost: "1.5% (기본 마나 중)",
    resourceGain: "영혼의 조각 파편",
    type: "기본",
    spec: "공용"
  },

  // === 특성 관련 스킬 ===
  darkSoulMisery: {
    id: "113860",
    koreanName: "악마의 영혼: 불행",
    englishName: "Dark Soul: Misery",
    icon: "spell_warlock_soulburn",
    description: "쓰러진 적의 불행을 자신의 영혼에 주입하여 20초 동안 가속이 30%만큼 증가합니다.",
    cooldown: "2 분",
    castTime: "즉시",
    resourceCost: "1% (기본 마나 중)",
    resourceGain: "없음",
    type: "특성",
    spec: "공용",
    duration: "20초"
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
    spec: "공용",
    duration: "3초"
  },

  absoluteCorruption: {
    id: "196103",
    koreanName: "완전한 부패",
    englishName: "Absolute Corruption",
    icon: "ability_bossmannoroth_empoweredmannorothsgaze",
    description: "부패가 영원히 지속되고 공격력이 15%만큼 증가합니다. 플레이어를 대상으로 할 때는 지속시간이 24초로 감소합니다.",
    cooldown: "해당 없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "패시브 특성",
    spec: "공용"
  },

  // === 유틸리티 스킬 ===
  mortalCoil: {
    id: "6789",
    koreanName: "필멸의 고리",
    englishName: "Mortal Coil",
    icon: "ability_warlock_mortalcoil",
    description: "적이 두려움에 휩싸여 달아나게 만들어 3초 동안 행동 불가 상태로 만들고, 자신은 최대 생명력의 20%를 회복합니다.",
    cooldown: "45 초",
    castTime: "즉시",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "없음",
    type: "생존",
    spec: "공용",
    range: "20 야드",
    duration: "3초"
  },

  shadowfury: {
    id: "30283",
    koreanName: "어둠의 격노",
    englishName: "Shadowfury",
    icon: "ability_warlock_shadowfurytga",
    description: "지정한 위치에 어둠의 격노를 발동하여 주위의 적들을 기절시킵니다.",
    cooldown: "1 분",
    castTime: "1.5 초",
    resourceCost: "1% (기본 마나 중)",
    resourceGain: "없음",
    type: "군중 제어",
    spec: "공용",
    range: "35 야드",
    duration: "3초"
  },

  demonicCircle: {
    id: "48018",
    koreanName: "악마의 마법진",
    englishName: "Demonic Circle",
    icon: "spell_shadow_demoniccirclesummon",
    description: "15분 동안 악마의 마법진을 소환합니다. 악마의 마법진: 순간이동을 시전하면 해당 지역으로 순간이동하고 모든 이동 속도 감소 효과를 제거합니다.",
    cooldown: "10 초",
    castTime: "500 밀리초",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "없음",
    type: "이동",
    spec: "공용",
    duration: "15분",
    radius: "15 미터"
  },

  demonicCircleTeleport: {
    id: "48020",
    koreanName: "악마의 마법진: 순간이동",
    englishName: "Demonic Circle: Teleport",
    icon: "spell_shadow_demoniccircleteleport",
    description: "악마의 마법진으로 순간이동합니다.",
    cooldown: "30 초",
    castTime: "즉시",
    resourceCost: "3% (기본 마나 중)",
    resourceGain: "없음",
    type: "이동",
    spec: "공용",
    range: "40 야드"
  },

  // === 생존 스킬 ===
  healthstone: {
    id: "6262",
    koreanName: "생명석",
    englishName: "Healthstone",
    icon: "warlock_-healthstone",
    description: "즉시 25%의 생명력을 회복합니다.",
    cooldown: "1 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "생존",
    spec: "공용"
  },

  soulstone: {
    id: "20707",
    koreanName: "영혼석",
    englishName: "Soulstone",
    icon: "spell_shadow_soulgem",
    description: "대상 파티원 혹은 공격대원의 영혼이 보존되어 대상이 죽었을 때 부활할 수 있습니다. 대상은 60%의 생명력과 최소 20%의 마나를 지닌 채로 부활합니다.",
    cooldown: "10 분",
    castTime: "3 초",
    resourceCost: "1% (기본 마나 중)",
    resourceGain: "없음",
    type: "유틸리티",
    spec: "공용",
    range: "40 야드",
    duration: "15분"
  },

  // === 광역 스킬 ===
  havoc: {
    id: "80240",
    koreanName: "대혼란",
    englishName: "Havoc",
    icon: "ability_warlock_baneofhavoc",
    description: "15초 동안 대상에게 대혼란의 징표를 찍어, 단일 대상 공격 주문이 대혼란의 징표가 찍힌 대상도 함께 공격해 입힌 피해의 60%만큼 피해를 입힙니다.",
    cooldown: "30 초",
    castTime: "즉시",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "없음",
    type: "광역",
    spec: "공용",
    range: "40 야드",
    duration: "15초"
  },

  soulFire: {
    id: "6353",
    koreanName: "영혼의 불꽃",
    englishName: "Soul Fire",
    icon: "spell_fire_firebolt",
    description: "적의 영혼을 불태워 화염 피해를 입히고 제물을 부여합니다. 영혼의 조각 1개를 생성합니다.",
    cooldown: "45 초",
    castTime: "4 초",
    resourceCost: "2% (기본 마나 중)",
    resourceGain: "영혼의 조각 1개",
    type: "기본",
    spec: "공용",
    range: "40 야드"
  },

  // === 특성 (영혼 수확자) ===
  nightfall: {
    id: "108558",
    koreanName: "야밤의 징조",
    englishName: "Nightfall",
    icon: "spell_shadow_twilight",
    description: "주기적인 피해 효과가 피해를 입힐 때마다 야밤의 징조가 발동할 확률이 있습니다. 야밤의 징조가 발동하면 다음 어둠의 화살이 즉시 시전되며 추가 피해를 입힙니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성",
    spec: "고통",
    procChance: "확률적"
  },

  tormentedCrescendo: {
    id: "387075",
    koreanName: "고통받는 크레센도",
    englishName: "Tormented Crescendo",
    icon: "spell_shadow_painandsuffering",
    description: "고통이 피해를 입힐 때마다 고통받는 크레센도가 발동할 확률이 있습니다. 고통받는 크레센도가 발동하면 다음 사악한 환희가 추가 피해를 입히고 영혼의 조각을 1개 추가로 생성합니다.",
    cooldown: "해당 없음",
    castTime: "패시브",
    resourceCost: "없음",
    resourceGain: "영혼의 조각 1개 (프록 시)",
    type: "특성",
    spec: "고통",
    procChance: "확률적"
  },

  wither: {
    id: "445468",
    koreanName: "시들기",
    englishName: "Wither",
    icon: "ability_warlock_eradication",
    description: "대상에게 18초 동안 암흑 피해를 입히는 주기적인 효과를 겁니다. 시들기는 지옥소환사 영웅 특성이 활성화될 때 부패를 대체하며, 중첩될 때마다 피해가 증가합니다. 최대 8중첩까지 가능합니다.",
    cooldown: "해당 없음",
    castTime: "즉시 시전",
    range: "40 야드",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "영웅 특성 변환",
    spec: "고통",
    heroTalent: "지옥소환사",
    maxStacks: 8,
    duration: "18초"
  }
};

// 배열 형태도 export (하위 호환성)
export const afflictionWarlockSkillsArray = Object.values(afflictionWarlockSkills);
