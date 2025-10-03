// 분노 전사 스킬 데이터
// TWW 시즌3 기준

export const furyWarriorSkills = {
  // ===== 핵심 로테이션 스킬 =====
  bloodthirst: {
    id: "23881",
    koreanName: "피의 갈증",
    englishName: "Bloodthirst",
    icon: "spell_nature_bloodlust",
    description: "피의 갈증으로 광기 어린 공격을 가하여 (전투력의 321.366%)의 물리 피해를 입히고 생명력을 3%만큼 회복합니다.[(80 / 10)]8의 분노를 생성합니다.",
    cooldown: "4.5 초",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "분노 8",
    type: "기본",
    spec: "분노"
  },
  ragingBlow: {
    id: "85288",
    koreanName: "분노의 강타",
    englishName: "Raging Blow",
    icon: "warrior_wild_strike",
    description: "양손에 든 무기로 강력한 일격을 가해 총 [(전투력의 215.623%) + (전투력의 215.623%)]의 물리 피해를 입힙니다. [분노의 강타 연마: 분노의 강타 시전 시 25% 확률로 즉시 재사용 대기시간이 초기화됩니다][(120 / 10)]12의 분노를 생성합니다.",
    cooldown: "없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "분노 12",
    type: "기본",
    spec: "분노"
  },
  rampage: {
    id: "184367",
    koreanName: "광란",
    englishName: "Rampage",
    icon: "ability_warrior_rampage",
    description: "격노하여 4회의 무자비한 공격을 가해 총 [(전투력의 205.116%) + (전투력의 119.652%) + (전투력의 273.491%) + (전투력의 153.838%)]의 물리 피해를 입힙니다.",
    cooldown: "없음",
    castTime: "즉시",
    resourceCost: "분노 80",
    resourceGain: "없음",
    type: "기본",
    spec: "분노"
  },
  execute: {
    id: "5308",
    koreanName: "마무리 일격",
    englishName: "Execute",
    icon: "inv_sword_48",
    description: "상처 입은 적에게 마무리 일격을 시도하여 [(전투력의 321.057%) + (전투력의 321.057%)]의 물리 피해를 입힙니다. 생명력이 20% 미만인 적에게만 사용할 수 있습니다. 분노를 20 생성합니다.",
    cooldown: "6 초",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "분노 20",
    type: "기본",
    spec: "분노"
  },
  whirlwind: {
    id: "190411",
    koreanName: "소용돌이",
    englishName: "Whirlwind",
    icon: "ability_whirlwind",
    description: "강철의 소용돌이를 내뿜어 주위 모든 적을 강타하고 [(전투력의 41.9991%) + (전투력의 41.9991%) + (2 * ((전투력의 41.9991%) + (전투력의 41.9991%)))]의 물리 피해를 입힙니다. 대상이 5명을 초과하면 감소된 피해를 입힙니다. [개선된 소용돌이: 다음 2번의 단일 대상 공격이 최대 4명의 대상에게 추가로 적중하여 65%만큼의 피해를 입힙니다] [3의 분노를 생성하며, 적중한 대상 하나당 1의 분노를 추가로 생성합니다.]",
    cooldown: "없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "분노 3+",
    type: "기본",
    spec: "분노"
  },

  // ===== 주요 쿨다운 =====
  recklessness: {
    id: "1719",
    koreanName: "무모한 희생",
    englishName: "Recklessness",
    icon: "warrior_talent_icon_innerrage",
    description: "광폭화 상태가 되어 12초 동안 모든 분노 생성량이 100%만큼, 능력의 치명타율이 20%만큼 증가합니다.",
    cooldown: "1.5 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "분노"
  },
  avatar: {
    id: "107574",
    koreanName: "투신",
    englishName: "Avatar",
    icon: "warrior_talent_icon_avatar",
    description: "20초 동안 거구로 변신하여 공격력이 20%만큼 증가합니다. 모든 이동 불가 및 감속 효과가 제거됩니다.[(100 / 10)]10의 분노를 생성합니다.",
    cooldown: "1.5 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "분노 10",
    type: "기본",
    spec: "분노"
  },
  thunderousRoar: {
    id: "384318",
    koreanName: "천둥의 포효",
    englishName: "Thunderous Roar",
    icon: "ability_warrior_dragonroar",
    description: "폭발적인 포효를 내질러 12미터 내의 적에게 (전투력의 250.56%)의 물리 피해를 입히고 출혈을 일으켜 8초에 걸쳐 (전투력의 250.56%)의 물리 피해를 입힙니다. 5명을 초과하는 대상에게는 감소된 피해를 입힙니다.",
    cooldown: "1.5 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "분노"
  },
  bladestorm: {
    id: "227847",
    koreanName: "칼날폭풍",
    englishName: "Bladestorm",
    icon: "ability_warrior_bladestorm",
    description: "4초 동안 회오리바람이 되어 주위의 모든 적에게 물리 피해를 입힙니다.",
    cooldown: "1.5 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성",
    spec: "분노"
  },

  // ===== 영웅 특성 스킬 (산왕) =====
  thunderBlast: {
    id: "435222",
    koreanName: "우레 작렬",
    englishName: "Thunder Blast",
    icon: "warrior_talent_icon_bloodandthunder",
    description: "8미터 반경 내의 모든 적을 강타하여 (전투력의 54.3356%)의 폭풍충격 피해를 입힙니다. 또한 10초 동안 이동 속도를 20%만큼 감소시킵니다. 5명을 넘는 대상에게는 감소된 피해를 입힙니다. 2의 분노를 생성합니다.",
    cooldown: "6 초",
    castTime: "즉시",
    resourceCost: "분노 30",
    resourceGain: "분노 2",
    type: "영웅특성",
    spec: "분노",
    heroTalent: "산왕"
  },

  // ===== 이동기 및 유틸리티 =====
  charge: {
    id: "100",
    koreanName: "돌진",
    englishName: "Charge",
    icon: "ability_warrior_charge",
    description: "대상에게 돌진하여 (전투력의 21%)의 물리 피해를 입히고, 1초 동안 제자리에 묶습니다. 20의 분노를 생성합니다.",
    cooldown: "1.5 초",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "분노 20",
    type: "기본",
    spec: "분노"
  },
  heroicLeap: {
    id: "52174",
    koreanName: "영웅의 도약",
    englishName: "Heroic Leap",
    icon: "ability_heroicleap",
    description: "공중 도약 후 지면에 강력한 충격을 일으켜 대상 지역의 8미터 내에 있는 모든 적에게 (전투력의 23.5%)의 물리 피해를 입힙니다.",
    cooldown: "없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "분노"
  },
  furiousSlash: {
    id: "100130",
    koreanName: "분노의 베기",
    englishName: "Furious Slash",
    icon: "ability_warrior_weaponmastery",
    description: "보조 무기로 저돌적인 일격을 가해 (전투력의 64.9%)의 물리 피해를 입히며 15초 동안 가속이 2%만큼 증가합니다. 최대 3번까지 중첩됩니다. 4의 분노를 생성합니다.",
    cooldown: "없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "분노 4",
    type: "기본",
    spec: "분노"
  },
  stormBolt: {
    id: "427114",
    koreanName: "폭풍망치",
    englishName: "Storm Bolt",
    icon: "warrior_talent_icon_stormbolt",
    description: "적에게 무기를 던져 (전투력의 28.5%)의 물리 피해를 입히고 4초 동안 기절시킵니다.",
    cooldown: "30 초",
    castTime: "즉시",
    range: "20 야드",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성",
    spec: "분노"
  },

  // ===== 방어기 =====
  diebytheSword: {
    id: "118038",
    koreanName: "투사의 혼",
    englishName: "Die by the Sword",
    icon: "ability_warrior_challange",
    description: "8초 동안 무기 막기 확률이 100%만큼 증가하고 받는 피해가 30%만큼 감소합니다.",
    cooldown: "2 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "분노"
  },
  berserkerRage: {
    id: "18499",
    koreanName: "광전사의 격노",
    englishName: "Berserker Rage",
    icon: "spell_nature_ancestralguardian",
    description: "광폭화하여 6초 동안 공포, 혼절시키기, 일부 행동 불가 상태를 제거하고 면역이 됩니다.",
    cooldown: "1 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "분노"
  },
  rallyingCry: {
    id: "97462",
    koreanName: "재집결의 함성",
    englishName: "Rallying Cry",
    icon: "ability_warrior_rallyingcry",
    description: "재집결의 함성을 내질러 10초 동안 자신과 반경 40미터 내의 모든 파티원 또는 공격대원의 최대 생명력을 일시적으로 10%만큼 증가시킵니다.",
    cooldown: "3 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "분노"
  },

  // ===== 유틸리티 =====
  pummel: {
    id: "6552",
    koreanName: "들이치기",
    englishName: "Pummel",
    icon: "inv_gauntlets_04",
    description: "적을 가격하여 주문 시전을 방해하고, 3초 동안 같은 계열의 주문을 시전하지 못하게 합니다.",
    cooldown: "15 초",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "분노"
  },
  battleShout: {
    id: "6673",
    koreanName: "전투의 외침",
    englishName: "Battle Shout",
    icon: "ability_warrior_battleshout",
    description: "1시간 동안 100미터 내의 모든 파티원과 공격대원의 전투력을 5%만큼 증가시킵니다.",
    cooldown: "없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "분노"
  },
  piercingHowl: {
    id: "12323",
    koreanName: "날카로운 고함",
    englishName: "Piercing Howl",
    icon: "spell_shadow_deathscream",
    description: "고함을 내질러 8초 동안 반경 12미터 안에 있는 모든 적의 이동 속도를 70%만큼 감소시킵니다.",
    cooldown: "30 초",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "분노"
  },
  intimidatingShout: {
    id: "5246",
    koreanName: "위협의 외침",
    englishName: "Intimidating Shout",
    icon: "ability_golemthunderclap",
    description: "대상 적을 공포에 질려 제자리에서 떨게 하고 8미터 내에 있는 최대 5명의 적을 도망가도록 만듭니다. 외침의 대상은 8초 동안 방향 감각을 상실합니다.",
    cooldown: "1.5 분",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "기본",
    spec: "분노"
  },

  // ===== 특성 =====
  suddenDeath: {
    id: "29725",
    koreanName: "급살",
    englishName: "Sudden Death",
    icon: "ability_warrior_improveddisciplines",
    description: "자동 공격이 대상의 생명력에 관계없이 마무리 일격을 사용할 수 있게 합니다. 최대 2회까지 중첩됩니다.",
    cooldown: "없음",
    castTime: "패시브",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "특성",
    spec: "분노"
  },
  enrage: {
    id: "184362",
    koreanName: "격노",
    englishName: "Enrage",
    icon: "spell_shadow_unholyfrenzy",
    description: "분노 생성량이 100% 증가합니다. 가속이 25% 증가, 피해가 15%만큼 증가합니다. 4초 동안 지속됩니다. 광란 사용 시 격노가 자동으로 발동됩니다.",
    cooldown: "없음",
    castTime: "패시브",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "버프",
    spec: "분노",
    duration: "4초"
  },

  // ===== 영웅 특성 - 학살자 =====
  slayersStrike: {
    id: "445579",
    koreanName: "학살자의 일격",
    englishName: "Slayer's Strike",
    icon: "inv_ability_slayerwarrior_slayersdominance",
    description: "주 대상에게 공격 시 높은 확률로 대상의 방어를 압도하고 학살자의 일격을 발동시켜 (전투력의 333.5%)의 물리 피해를 입히고 사형의 징표를 부여합니다. 사형의 징표는 대상이 다음 마무리 일격으로 받는 피해를 15%만큼 증가시킵니다. 최대 3번까지 중첩됩니다.",
    cooldown: "없음",
    castTime: "즉시",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "영웅특성",
    spec: "분노",
    heroTalent: "학살자"
  },
  reapTheStorm: {
    id: "444775",
    koreanName: "폭풍을 거두는 자",
    englishName: "Reap the Storm",
    icon: "ability_arakkoa_spinning_blade",
    description: "피의 갈증 사용 시 20%의 확률로 강철의 질풍을 방출하여 주위의 모든 적을 공격해 (전투력의 371.11%)의 물리 피해를 입히고 압도당함 효과를 부여합니다. 8명을 초과하는 대상에게는 감소된 피해를 입힙니다.",
    cooldown: "없음",
    castTime: "패시브",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "영웅특성",
    spec: "분노",
    heroTalent: "학살자"
  },
  brutalFinish: {
    id: "446085",
    koreanName: "잔혹한 마무리",
    englishName: "Brutal Finish",
    icon: "ability_revendreth_warrior",
    description: "칼날폭풍이 끝난 후에 사용하는 다음 광란의 공격력이 50%만큼 증가합니다.",
    cooldown: "없음",
    castTime: "패시브",
    resourceCost: "없음",
    resourceGain: "없음",
    type: "영웅특성",
    spec: "분노",
    heroTalent: "학살자"
  }
};
