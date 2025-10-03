// 비전 법사 스킬 데이터 (TWW 시즌 3 - 11.2 패치)
// 데이터 소스: Maxroll, Archon, ko.wowhead.com

export const arcaneMageSkills = {
  // === 핵심 스킬 ===
  arcaneBlast: {
    id: "30451",
    koreanName: "비전 작렬",
    englishName: "Arcane Blast",
    icon: "spell_arcane_blast",
    description: "대상에게 비전 피해를 입히고 비전 충전을 1만큼 증가시킵니다. 비전 충전 중첩당 피해량과 마나 소모량이 증가합니다.",
    cooldown: "없음",
    castTime: "2.25초",
    range: "40 야드",
    resourceCost: "마나 (중첩당 증가)",
    resourceGain: "비전 충전 +1",
    type: "기본",
    spec: "비전",
    level: 10
  },

  arcaneMissiles: {
    id: "5143",
    koreanName: "비전 미사일",
    englishName: "Arcane Missiles",
    icon: "spell_nature_starfall",
    description: "명석함 발동 시 5발의 비전 미사일을 발사합니다. 각 미사일은 비전 피해를 입힙니다.",
    cooldown: "없음",
    castTime: "즉시 시전 (명석함 발동 시)",
    range: "40 야드",
    resourceCost: "없음 (명석함 소모)",
    resourceGain: "없음",
    type: "기본",
    spec: "비전",
    level: 10
  },

  arcaneBarrage: {
    id: "44425",
    koreanName: "비전 탄막",
    englishName: "Arcane Barrage",
    icon: "ability_mage_arcanebarrage",
    description: "비전 충전을 모두 소모하여 강력한 비전 피해를 입힙니다. 충전 개수에 따라 피해량이 증가합니다.",
    cooldown: "없음",
    castTime: "즉시 시전",
    range: "40 야드",
    resourceCost: "마나",
    resourceGain: "비전 충전 초기화",
    type: "기본",
    spec: "비전",
    level: 10
  },

  arcaneSurge: {
    id: "365350",
    koreanName: "비전 쇄도",
    englishName: "Arcane Surge",
    icon: "spell_arcane_arcaneresilience",
    description: "주문력을 35% 증가시키고 마나 재생을 425% 증가시킵니다. 15초 동안 지속됩니다.",
    cooldown: "1.5분",
    castTime: "즉시 시전",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "마나 재생 대폭 증가",
    type: "쿨다운",
    spec: "비전",
    level: 10
  },

  touchOfTheMagi: {
    id: "321507",
    koreanName: "마법사의 손길",
    englishName: "Touch of the Magi",
    icon: "spell_mage_touchofthemagi",
    description: "대상을 표시하여 12초 동안 입힌 피해의 20%를 축적합니다. 지속시간 종료 시 축적된 피해를 가합니다.",
    cooldown: "1.5분",
    castTime: "즉시 시전 (GCD 없음)",
    range: "40 야드",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "쿨다운",
    spec: "비전",
    level: 10
  },

  evocation: {
    id: "12051",
    koreanName: "환기",
    englishName: "Evocation",
    icon: "spell_nature_purge",
    description: "6초 동안 정신을 집중하여 최대 마나의 60%를 회복합니다. 시전 중 이동 불가.",
    cooldown: "1.5분",
    castTime: "6초 (채널링)",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "마나 60% 회복",
    type: "유틸리티",
    spec: "비전",
    level: 10
  },

  arcaneOrb: {
    id: "153626",
    koreanName: "비전 보주",
    englishName: "Arcane Orb",
    icon: "spell_mage_arcaneorb",
    description: "비전 보주를 발사하여 경로상의 모든 적에게 피해를 입히고 비전 충전을 1 증가시킵니다.",
    cooldown: "20초",
    castTime: "즉시 시전",
    range: "40 야드",
    resourceCost: "마나",
    resourceGain: "비전 충전 +1",
    type: "특성",
    spec: "비전",
    level: 10
  },

  // === 버프 및 프록 ===
  clearcasting: {
    id: "263725",
    koreanName: "명석함",
    englishName: "Clearcasting",
    icon: "spell_shadow_manaburn",
    description: "비전 작렬 시전 시 발동 확률. 다음 비전 미사일 또는 비전 폭발을 마나 소모 없이 시전할 수 있습니다. 최대 3중첩.",
    cooldown: "없음",
    castTime: "패시브",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "버프",
    spec: "비전",
    duration: "15초"
  },

  arcaneCharges: {
    id: "36032",
    koreanName: "비전 충전",
    englishName: "Arcane Charges",
    icon: "spell_arcane_arcane01",
    description: "비전 작렬 시전 시 1씩 증가합니다. 비전 탄막 시전 시 모두 소모됩니다. 최대 4중첩. 중첩당 비전 작렬 피해 60% 증가.",
    cooldown: "없음",
    castTime: "패시브",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "버프",
    spec: "비전",
    duration: "10초 (전투 이탈 시 소멸)"
  },

  // === 성난태양 (Sunfury) 영웅 특성 ===
  spellfireSpheres: {
    id: "448604",
    koreanName: "주문불꽃 구체",
    englishName: "Spellfire Spheres",
    icon: "ability_mage_firestarter",
    description: "비전 미사일, 비전 폭발 시전 시 생성됩니다. 최대 5개까지 생성 가능. 주문불꽃 구체는 주기적으로 피해를 입힙니다.",
    cooldown: "없음",
    castTime: "패시브",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "버프",
    spec: "비전",
    heroTalent: "성난태양",
    duration: "30초"
  },

  gloriousIncandescence: {
    id: "451073",
    koreanName: "찬란한 백열",
    englishName: "Glorious Incandescence",
    icon: "spell_fire_twilightflamebreath",
    description: "주문불꽃 구체 4개 생성 시 발동. 다음 비전 탄막의 피해가 300% 증가하고 마나를 소모하지 않습니다.",
    cooldown: "없음",
    castTime: "패시브",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "버프",
    spec: "비전",
    heroTalent: "성난태양",
    duration: "30초"
  },

  manaGem: {
    id: "759",
    koreanName: "마나 보석",
    englishName: "Conjure Mana Gem",
    icon: "inv_misc_gem_sapphire_02",
    description: "마나 보석을 생성합니다. 사용 시 즉시 최대 마나의 25%를 회복합니다. 2회 충전.",
    cooldown: "없음 (생성 10분)",
    castTime: "3초",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "마나 25% 회복 (사용 시)",
    type: "유틸리티",
    spec: "비전",
    charges: "2회"
  },

  presenceOfMind: {
    id: "205025",
    koreanName: "정신 집중",
    englishName: "Presence of Mind",
    icon: "spell_nature_enchantarmor",
    description: "다음 2개의 비전 작렬을 즉시 시전합니다.",
    cooldown: "1분",
    castTime: "즉시 시전",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "쿨다운",
    spec: "비전",
    level: 10
  },

  // === 유틸리티 ===
  shimmer: {
    id: "212653",
    koreanName: "섬광",
    englishName: "Shimmer",
    icon: "spell_arcane_blink",
    description: "20야드 순간이동합니다. 시전 중인 주문을 중단하지 않습니다. 2회 충전.",
    cooldown: "25초 (충전당)",
    castTime: "즉시 시전",
    range: "20 야드",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "유틸리티",
    spec: "공용",
    charges: "2회"
  },

  counterspell: {
    id: "2139",
    koreanName: "마법 차단",
    englishName: "Counterspell",
    icon: "spell_frost_iceshock",
    description: "대상의 주문 시전을 차단하고 6초 동안 해당 계열 주문을 시전하지 못하게 합니다.",
    cooldown: "24초",
    castTime: "즉시 시전",
    range: "40 야드",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "유틸리티",
    spec: "공용",
    level: 10
  },

  alterTime: {
    id: "342245",
    koreanName: "시간 왜곡",
    englishName: "Alter Time",
    icon: "spell_mage_altertime",
    description: "사용 시 현재 위치, 생명력, 마나를 기록합니다. 10초 내 재사용 시 기록된 상태로 되돌립니다.",
    cooldown: "1분",
    castTime: "즉시 시전",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "유틸리티",
    spec: "공용",
    level: 10
  },

  // === 특성 스킬 ===
  supernova: {
    id: "157980",
    koreanName: "초신성",
    englishName: "Supernova",
    icon: "spell_mage_supernova",
    description: "강력한 폭발을 일으켜 주변 적에게 피해를 입히고 공중으로 띄웁니다.",
    cooldown: "25초",
    castTime: "즉시 시전",
    range: "40 야드",
    resourceCost: "마나",
    resourceGain: "없음",
    type: "특성",
    spec: "비전",
    level: 10
  },

  radiantSpark: {
    id: "376103",
    koreanName: "찬란한 불꽃",
    englishName: "Radiant Spark",
    icon: "spell_animabastion_buff",
    description: "대상에게 화염 피해를 입히고 취약성 표시를 남깁니다. 4번의 피해 주문을 받을 때마다 피해가 증폭됩니다.",
    cooldown: "30초",
    castTime: "1.5초",
    range: "40 야드",
    resourceCost: "마나",
    resourceGain: "없음",
    type: "특성",
    spec: "공용",
    level: 10
  },

  arcaneExplosion: {
    id: "1449",
    koreanName: "비전 폭발",
    englishName: "Arcane Explosion",
    icon: "spell_nature_wispsplode",
    description: "주변 모든 적에게 비전 피해를 입힙니다. 명석함 발동 시 마나 소모 없이 시전 가능.",
    cooldown: "없음",
    castTime: "즉시 시전",
    range: "10 야드 (자신 주변)",
    resourceCost: "마나 (명석함 발동 시 무료)",
    resourceGain: "없음",
    type: "기본",
    spec: "비전",
    level: 10
  },

  netherTempest: {
    id: "114923",
    koreanName: "황천 폭풍",
    englishName: "Nether Tempest",
    icon: "spell_mage_nethertempest",
    description: "대상과 주변 적에게 12초 동안 지속 피해를 입힙니다.",
    cooldown: "없음",
    castTime: "즉시 시전",
    range: "40 야드",
    resourceCost: "마나",
    resourceGain: "없음",
    type: "특성",
    spec: "비전",
    level: 10,
    duration: "12초"
  },

  // === 주문술사 (Spellslinger) 영웅 특성 (대안) ===
  spellfireSpheresSlinger: {
    id: "449400",
    koreanName: "주문불꽃 구체 (주문술사)",
    englishName: "Spellfire Spheres (Spellslinger)",
    icon: "spell_fire_selfdestruct",
    description: "주문술사 버전의 주문불꽃 구체. 비전 탄막 시전 시 추가 피해를 입힙니다.",
    cooldown: "없음",
    castTime: "패시브",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "버프",
    spec: "비전",
    heroTalent: "주문술사",
    duration: "40초"
  },

  // === 추가 유틸리티 ===
  iceBlock: {
    id: "45438",
    koreanName: "얼음 방패",
    englishName: "Ice Block",
    icon: "spell_frost_frost",
    description: "얼음 안에 자신을 가두어 10초 동안 면역 상태가 됩니다. 이동 및 행동 불가.",
    cooldown: "4분",
    castTime: "즉시 시전",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "유틸리티",
    spec: "공용",
    duration: "10초"
  },

  invisibility: {
    id: "66",
    koreanName: "투명화",
    englishName: "Invisibility",
    icon: "ability_mage_invisibility",
    description: "3초 후 투명 상태가 됩니다. 20초 동안 지속되며 공격 시 해제됩니다.",
    cooldown: "5분",
    castTime: "즉시 시전",
    range: "없음",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "유틸리티",
    spec: "공용",
    duration: "20초"
  },

  mirrorImage: {
    id: "55342",
    koreanName: "얼음 형상",
    englishName: "Mirror Image",
    icon: "spell_magic_lesserinvisibilty",
    description: "3개의 분신을 소환하여 40초 동안 대상을 공격합니다. 소환 시 위협 수준 감소.",
    cooldown: "2분",
    castTime: "즉시 시전",
    range: "40 야드",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "쿨다운",
    spec: "공용",
    duration: "40초"
  },

  slowFall: {
    id: "130",
    koreanName: "저속 낙하",
    englishName: "Slow Fall",
    icon: "spell_magic_featherfall",
    description: "낙하 속도를 느리게 하여 추락 피해를 받지 않습니다. 30초 동안 지속됩니다.",
    cooldown: "없음",
    castTime: "즉시 시전",
    range: "40 야드",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "유틸리티",
    spec: "공용",
    duration: "30초"
  }
};

export default arcaneMageSkills;
