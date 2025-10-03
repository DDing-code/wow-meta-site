// 황폐 기원사 스킬 데이터베이스
// ko.wowhead.com 검증된 번역 기준
// TWW 11.0.5 패치

export const devastationEvokerSkillData = {
  // 핵심 스킬들
  fireBreath: {
    id: '357208',
    name: '불의 숨결',
    englishName: 'Fire Breath',
    icon: 'ability_evoker_firebreath',
    description: '심호흡 후 대상의 방향으로 화염을 분출하여 4초에 걸쳐 전방의 모든 적을 태워 전투력의 154%의 화염 피해를 입힙니다.',
    cooldown: '30초',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '2초',
    empower: true
  },
  eternitySurge: {
    id: '359073',
    name: '영원의 쇄도',
    englishName: 'Eternity Surge',
    icon: 'ability_evoker_eternitysurge',
    description: '격동하는 에너지로 대상에게 마력을 집중시켜 순수한 용의 마법 피해를 입힙니다.',
    cooldown: '30초',
    resourceCost: '없음',
    resourceGain: '정수 1',
    castTime: '2.5초',
    empower: true
  },
  pyre: {
    id: '357211',
    name: '기염',
    englishName: 'Pyre',
    icon: 'ability_evoker_pyre',
    description: '적에게 뜨거운 불씨를 던져 전투력의 75%의 화염 피해를 입히고 주변 적들에게도 피해를 입힙니다.',
    cooldown: '없음',
    resourceCost: '정수 2',
    resourceGain: '없음',
    castTime: '즉시'
  },
  dragonRage: {
    id: '375087',
    name: '용의 분노',
    englishName: 'Dragonrage',
    icon: 'ability_evoker_dragonrage',
    description: '용의 전성기 형태로 변신하여 18초 동안 피해량이 40% 증가하고 정수 생성율이 100% 증가합니다.',
    cooldown: '2분',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시'
  },
  livingFlame: {
    id: '361500',
    name: '살아있는 불꽃',
    englishName: 'Living Flame',
    icon: 'ability_evoker_livingflame',
    description: '살아있는 화염을 발사합니다. 적에게는 전투력의 79%의 화염 피해를 입히고, 아군에게는 전투력의 94%의 생명력을 회복시킵니다.',
    castTime: '2초',
    resourceCost: '없음',
    resourceGain: '정수 1',
    range: '30야드'
  },
  azureStrike: {
    id: '362969',
    name: '하늘빛 일격',
    englishName: 'Azure Strike',
    icon: 'ability_evoker_azurestrike',
    description: '하늘빛 마력으로 대상과 주변 2명의 적을 공격하여 전투력의 38%의 냉기 피해를 입힙니다.',
    resourceCost: '없음',
    resourceGain: '정수 1',
    castTime: '즉시',
    cooldown: '없음'
  },
  disintegrate: {
    id: '356995',
    name: '파열',
    englishName: 'Disintegrate',
    icon: 'ability_evoker_disintegrate',
    description: '적에게 집중된 에너지 광선을 발사하여 3초 동안 채널링하며 매 0.3초마다 전투력의 22%의 화염 피해를 입힙니다.',
    cooldown: '없음',
    resourceCost: '없음',
    resourceGain: '초당 정수 1',
    castTime: '3초 채널링'
  },
  deepBreath: {
    id: '357210',
    name: '깊은 숨결',
    englishName: 'Deep Breath',
    icon: 'ability_evoker_deepbreath',
    description: '공중으로 비상하여 대상 위치로 날아가며 경로의 모든 적에게 전투력의 120%의 화염 피해를 입힙니다.',
    cooldown: '2분',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시'
  },
  tipTheScales: {
    id: '370553',
    name: '전세역전',
    englishName: 'Tip the Scales',
    icon: 'ability_evoker_tipthescales',
    description: '다음 강화 주문을 즉시 최대 강화 단계로 시전합니다.',
    cooldown: '2분',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시'
  },
  shatteringStar: {
    id: '370452',
    name: '산산이 부서지는 별',
    englishName: 'Shattering Star',
    icon: 'ability_evoker_chargedblast',
    description: '대상을 별의 힘으로 강타하여 주문력의 150%의 마법 피해를 입히고, 대상이 받는 피해를 20초 동안 20% 증가시킵니다.',
    cooldown: '20초',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시'
  },

  // 패시브 및 특성
  essence: {
    id: '359816',
    name: '정수 감지',
    englishName: 'Essence Attunement',
    icon: 'ability_evoker_essenceattunement',
    description: '정수 데미지가 2.5% 증가하고, 최대 정수가 1 증가합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  giantSlayer: {
    id: '375696',
    name: '특화: 거물 사냥꾼',
    englishName: 'Mastery: Giantkiller',
    icon: 'ability_evoker_masterygiantkiller',
    description: '대상의 현재 생명력 비율에 비례하여 피해가 증가합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  essenceBurst: {
    id: '408092',
    name: '정수 폭발',
    englishName: 'Essence Burst',
    icon: 'ability_evoker_essenceburst',
    description: '살아있는 불꽃이나 하늘빛 일격 시전 시 정수 폭발을 획득하여 다음 강화 주문이 강화 1단계에서 시작됩니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  burnout: {
    id: '375801',
    name: '번아웃',
    englishName: 'Burnout',
    icon: 'ability_evoker_burnout',
    description: '화염 주문이 버프를 가진 적에게 10%의 추가 피해를 입힙니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },

  // 클래스 특성
  emeraldBlossom: {
    id: '355913',
    name: '에메랄드 꽃',
    englishName: 'Emerald Blossom',
    icon: 'ability_evoker_emeraldblossom',
    description: '2초 동안 당신 주위에 에메랄드 꽃을 피워, 매 0.5초마다 주위 아군을 주문력의 45%만큼 치유합니다.',
    cooldown: '30초',
    resourceCost: '3% 기본 마나',
    castTime: '즉시',
    type: '특성'
  },

  scarletAdaptation: {
    id: '372469',
    name: '진홍빛 적응',
    englishName: 'Scarlet Adaptation',
    icon: 'inv_bijou_red',
    description: '아군을 치유하면 진홍빛 적응을 얻습니다. 최대 10중첩까지 중첩되며, 각 중첩마다 다음 살아있는 불꽃의 피해가 2% 증가합니다.',
    type: '지속 효과'
  },

  ancientFlame: {
    id: '375777',
    name: '고대 불꽃',
    englishName: 'Ancient Flame',
    icon: 'spell_fire_moltenblood',
    description: '치유 주문 시전 시 고대 불꽃을 얻어 다음 살아있는 불꽃의 시전 시간이 40% 감소합니다.',
    type: '지속 효과'
  },

  leapingFlames: {
    id: '369939',
    name: '도약하는 불꽃',
    englishName: 'Leaping Flames',
    icon: 'spell_fire_flamebolt',
    description: '살아있는 불꽃이 적을 명중시킨 후 근처의 다른 적이나 아군에게 도약합니다. 적에게는 주문력의 60%의 화염 피해를 입히고, 아군에게는 같은 양의 치유를 합니다. 용의 분노 중 아군 치유 시 정수 폭발을 생성할 수 있습니다.',
    type: '지속 효과'
  },

  // 영웅특성 - 불꽃형성자
  engulf: {
    id: '443328',
    name: '업화',
    englishName: 'Engulf',
    icon: 'inv_ability_flameshaperevoker_engulf',
    description: '살아있는 불꽃이 불꽃형성자가 되어 대상을 삼켜 주문력의 240%의 화염 피해를 입히고 모든 화염 피해 지속 효과를 4초 연장합니다. 불의 숨결을 받는 대상에게만 시전할 수 있습니다.',
    cooldown: '30초',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시',
    charges: 2
  },

  // 패시브 특성
  burnout: {
    id: '375801',
    name: '타오르는 불씨',
    englishName: 'Burnout',
    icon: 'spell_fire_burnout',
    description: '살아있는 불꽃이 타오르는 불씨 효과를 발동시켜 잠시 후 적에게 주문력의 60%의 화염 피해를 입힙니다.',
    type: 'passive'
  },
  iridescence: {
    id: '370867',
    name: '찬란한 광채',
    englishName: 'Iridescence',
    icon: 'spell_arcane_prismaticcloak',
    description: '강화 주문을 시전하면 빨간색 또는 파란색 찬란한 광채를 얻습니다. 빨간색은 다음 2개 주문의 피해를 20% 증가시키고, 파란색은 다음 주문의 재사용 대기시간을 2초 감소시킵니다.',
    type: 'passive'
  },

  // 영웅특성 - 비늘사령관
  massDisintegrate: {
    id: '436301',
    name: '대규모 파열',
    englishName: 'Mass Disintegrate',
    icon: 'ability_evoker_disintegrate',
    description: '대상과 최대 2명의 추가 적에게 파열을 동시에 시전합니다. 각 광선은 3초에 걸쳐 주문력의 220%의 화염 피해를 입힙니다. 비늘사령관 특성.',
    cooldown: '2분',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '3초 채널링',
    range: '30야드'
  },
  bombardments: {
    id: '434300',
    name: '폭격',
    englishName: 'Bombardments',
    icon: 'ability_evoker_pyre',
    description: '깊은 숨결의 재사용 대기시간이 1분 감소하고, 깊은 숨결 동안 지나가는 적들에게 8개의 기염을 자동으로 발사합니다. 비늘사령관 특성.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },

  // 영웅특성 - 시간 감시자 (보존/증강용이므로 제거)
  temporalBurst: {
    id: '431443',
    name: '시간 폭발',
    englishName: 'Temporal Burst',
    icon: 'ability_evoker_temporalburst',
    description: '시간 감시자 특성. 보존/증강 전문화용.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },

  // 유틸리티
  emeraldCommunion: {
    id: '370960',
    name: '에메랄드 교감',
    englishName: 'Emerald Communion',
    icon: 'ability_evoker_emerald',
    description: '에메랄드 꿈과 교감하여 생명력을 회복합니다.',
    cooldown: '3분',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시'
  },

  // 추가 핵심 스킬들
  obsidianScales: {
    id: '363916',
    name: '흑요석 비늘',
    englishName: 'Obsidian Scales',
    icon: 'ability_evoker_obsidianscales',
    description: '12초 동안 받는 피해가 30% 감소합니다.',
    cooldown: '2.5분',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시'
  },
  blessingOfTheBronze: {
    id: '364342',
    name: '청동의 축복',
    englishName: 'Blessing of the Bronze',
    icon: 'ability_evoker_blessing_bronze',
    description: '아군 또는 자신에게 청동의 축복을 부여하여 10분 동안 이동 속도를 15% 증가시킵니다.',
    cooldown: '15초',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시'
  },
  hover: {
    id: '358267',
    name: '부양',
    englishName: 'Hover',
    icon: 'ability_evoker_hover',
    description: '6초 동안 부양하여 이동하면서 시전할 수 있게 되고 이동 속도가 30% 증가합니다. 이동 불가, 이동 방해 효과를 해제합니다.',
    cooldown: '35초',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시'
  },
  verdantEmbrace: {
    id: '360995',
    name: '신록의 품',
    englishName: 'Verdant Embrace',
    icon: 'ability_evoker_verdantembrace',
    description: '대상 아군으로 날아가 생명력을 회복시킵니다. 또한 에코를 적용합니다.',
    cooldown: '24초',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시',
    range: '25 야드'
  },
  rescue: {
    id: '370665',
    name: '구조',
    englishName: 'Rescue',
    icon: 'ability_evoker_rescue',
    description: '아군을 자신의 위치로 끌어옵니다.',
    cooldown: '1분',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시',
    range: '30 야드'
  },
  oppressingRoar: {
    id: '406971',
    name: '탄압의 포효',
    englishName: 'Oppressing Roar',
    icon: 'ability_evoker_oppressingroar',
    description: '포효하여 10초 동안 주위 적들에게 걸린 군중 제어 효과의 지속시간을 50% 증가시키고, 적의 격노 효과를 1개 제거합니다.',
    cooldown: '2분',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시',
    duration: '10초',
    type: '유틸리티',
    spec: '공용',
    level: 60,
    pvp: false
  },

  // 특성 추가
  volatility: {
    id: '369089',
    name: '변덕',
    englishName: 'Volatility',
    icon: 'ability_evoker_volatility',
    description: '기염이 적중 시 15%의 확률로 정수를 소모하지 않습니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  ruby: {
    id: '382820',
    name: '루비 정수 폭발',
    englishName: 'Ruby Essence Burst',
    icon: 'ability_evoker_ruby',
    description: '살아있는 불꽃이 극대화 효과를 발동시킬 확률이 20% 증가합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  animosity: {
    id: '375797',
    name: '적개심',
    englishName: 'Animosity',
    icon: 'ability_evoker_animosity',
    description: '용의 분노가 활성화되어 있는 동안 파열의 공격 속도가 100% 증가합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  scintillation: {
    id: '370821',
    name: '섬광',
    englishName: 'Scintillation',
    icon: 'ability_evoker_scintillation',
    description: '파열이 30%의 확률로 정수 폭발을 부여합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },

  // 영웅특성 - 시간 감시자 추가 스킬
  timeDilation: {
    id: '431625',
    name: '시간 팽창',
    englishName: 'Time Dilation',
    icon: 'ability_evoker_timedilation',
    description: '시간 감시자 특성. 주요 기술의 재사용 대기시간이 10% 감소합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  prescience: {
    id: '409311',
    name: '예지',
    englishName: 'Prescience',
    icon: 'ability_evoker_prescience',
    description: '아군에게 예지를 부여하여 18초 동안 극대화율과 유연을 증가시킵니다.',
    cooldown: '없음',
    resourceCost: '없음',
    resourceGain: '없음',
    castTime: '즉시',
    range: '30 야드'
  },

  // 영웅특성 - 불꽃형성자 추가 스킬
  consumingFlame: {
    id: '443329',
    name: '타오르는 불길',
    englishName: 'Consuming Flame',
    icon: 'ability_evoker_consumingflame',
    description: '불꽃형성자 특성. 불의 숨결이 극대화 효과를 발동시킬 때마다 추가 피해를 입힙니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },

  // 비늘사령관 영웅특성 스킬
  massDisintegrate: {
    id: '436308',
    name: '대규모 파열',
    englishName: 'Mass Disintegrate',
    icon: 'ability_evoker_disintegrate',
    description: '비늘사령관 특성. 파열이 주 대상 근처의 모든 적에게도 피해를 입힙니다.',
    cooldown: '없음',
    resourceCost: '정수 3',
    resourceGain: '없음',
    castTime: '3초 채널링',
    type: 'heroTalent'
  },
  chargedBlast: {
    id: '436304',
    name: '충전된 폭발',
    englishName: 'Charged Blast',
    icon: 'ability_evoker_chargedblast',
    description: '비늘사령관 특성. 대규모 파열을 사용할 때마다 충전된 폭발 중첩을 얻어 다음 기염의 피해가 증가합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  bombardments: {
    id: '436301',
    name: '폭격',
    englishName: 'Bombardments',
    icon: 'ability_evoker_pyre',
    description: '비늘사령관 특성. 깊은 숨결의 재사용 대기시간이 1분 감소합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'passive'
  },
  innerFlame: {
    id: '443294',
    name: '내면의 불꽃',
    englishName: 'Inner Flame',
    icon: 'ability_evoker_innerflame',
    description: '불꽃형성자 특성. 업화 시전 후 활성화되어 다음 스킬들의 효과가 향상됩니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'buff'
  },

  // PvP 특성
  obsidianMettle: {
    id: '378444',
    name: '흑요석 기개',
    englishName: 'Obsidian Mettle',
    icon: 'ability_evoker_obsidianmettle',
    description: 'PvP 특성. 흑요석 비늘이 활성화된 동안 군중 제어 효과를 제거합니다.',
    resourceCost: '없음',
    resourceGain: '없음',
    type: 'pvp_passive',
    pvp: true
  },

  // 누락된 스킬 추가
  eternitySurge: {
    id: '359073',
    name: '영원의 쇄도',
    englishName: 'Eternity Surge',
    icon: 'ability_evoker_eternitysurge',
    description: '적을 정수 에너지로 포격하여 주문력의 240%에 해당하는 주문 피해를 입히고 정수를 1 생성합니다.',
    castTime: '강화',
    cooldown: '30초',
    range: '25 야드',
    resourceCost: '없음',
    resourceGain: '정수 1',
    type: '기본',
    spec: '황폐',
    level: 10,
    pvp: false
  },

  shatteringStar: {
    id: '370452',
    name: '산산이 부서지는 별',
    englishName: 'Shattering Star',
    icon: 'ability_evoker_chargedblast',
    description: '적을 별빛으로 포격하여 주문력의 150%에 해당하는 주문 피해를 입히고 정수 폭발을 보장합니다.',
    castTime: '즉시 시전',
    cooldown: '20초',
    range: '25 야드',
    resourceCost: '없음',
    resourceGain: '정수 폭발 1개',
    type: '황폐',
    spec: '황폐',
    level: 35,
    pvp: false
  },

  giantSlayer: {
    id: '360827',
    name: '특화: 거물 사냥꾼',
    englishName: 'Mastery: Giant Slayer',
    icon: 'ability_evoker_masterygiantkiller',
    description: '대상의 생명력이 낮을수록 주문이 입히는 피해가 증가합니다.',
    castTime: '패시브',
    cooldown: '없음',
    range: '패시브',
    resourceCost: '없음',
    resourceGain: '없음',
    type: '특화',
    spec: '황폐',
    level: 10,
    pvp: false
  }
};