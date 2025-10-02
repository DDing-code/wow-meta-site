// 사냥꾼 (Hunter) 스킬 데이터베이스
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)
// 최신 한국어 번역 적용

import { koreanTranslations } from '../koreanTranslations-11.2';

const hunterTranslations = koreanTranslations.hunterAbilities;

export const hunterSkills = {
  className: koreanTranslations.classes.hunter,
  classNameEn: 'Hunter',
  // 공통 스킬 (모든 전문화 공유)
  common: {
    // 기본 공격 스킬
    [hunterTranslations.autoShot]: {
      id: 75,
      name: 'Auto Shot',
      type: 'ranged',
      description: '자동으로 화살을 발사합니다.'
    },
    [hunterTranslations.arcaneShot]: {
      id: 185358,
      name: 'Arcane Shot',
      type: 'ability',
      cooldown: 0,
      description: '마법 화살을 발사하여 피해를 입힙니다.'
    },
    [hunterTranslations.multiShot]: {
      id: 257620,
      name: 'Multi-Shot',
      type: 'ability',
      description: '여러 대상에게 동시에 화살을 발사합니다.'
    },
    [hunterTranslations.killShot]: {
      id: 53351,
      name: 'Kill Shot',
      type: 'ability',
      cooldown: 10,
      description: '체력이 낮은 대상에게 강력한 일격을 가합니다.'
    },
    [hunterTranslations.huntersMark]: {
      id: 257284,
      name: "Hunter's Mark",
      type: 'debuff',
      description: '대상을 표시하여 추가 피해를 입힙니다.'
    },
    [hunterTranslations.killCommand]: {
      id: 34026,
      name: 'Kill Command',
      type: 'ability',
      cooldown: 10,
      description: '애완동물이 대상을 공격하도록 명령합니다.'
    },

    // 펫 관련
    [hunterTranslations.callPet]: {
      id: 883,
      name: 'Call Pet',
      type: 'summon',
      description: '길들인 야수를 소환합니다.'
    },
    [hunterTranslations.revivePet]: {
      id: 982,
      name: 'Revive Pet',
      type: 'ability',
      description: '죽은 애완동물을 되살립니다.'
    },
    [hunterTranslations.mendPet]: {
      id: 136,
      name: 'Mend Pet',
      type: 'heal',
      description: '애완동물의 체력을 치유합니다.'
    },
    [hunterTranslations.dismissPet]: {
      id: 2641,
      name: 'Dismiss Pet',
      type: 'ability',
      description: '애완동물을 해제합니다.'
    },
    [hunterTranslations.feedPet]: {
      id: 6991,
      name: 'Feed Pet',
      type: 'ability',
      description: '애완동물에게 먹이를 줍니다.'
    },
    [hunterTranslations.tameBeast]: {
      id: 1515,
      name: 'Tame Beast',
      type: 'channel',
      description: '야수를 길들입니다.'
    },
    [hunterTranslations.beastLore]: {
      id: 1462,
      name: 'Beast Lore',
      type: 'ability',
      description: '야수의 정보를 확인합니다.'
    },

    // 이동기 및 유틸리티
    [hunterTranslations.disengage]: {
      id: 781,
      name: 'Disengage',
      type: 'movement',
      cooldown: 20,
      description: '뒤로 빠르게 물러납니다.'
    },
    [hunterTranslations.aspectOfTheCheetah]: {
      id: 186257,
      name: 'Aspect of the Cheetah',
      type: 'buff',
      cooldown: 90,
      description: '이동 속도를 크게 증가시킵니다.'
    },
    [hunterTranslations.camouflage]: {
      id: 199483,
      name: 'Camouflage',
      type: 'stealth',
      cooldown: 60,
      description: '은신 상태가 됩니다.'
    },
    [hunterTranslations.feignDeath]: {
      id: 5384,
      name: 'Feign Death',
      type: 'ability',
      cooldown: 30,
      description: '죽은 척하여 전투에서 벗어납니다.'
    },
    [hunterTranslations.eagleEye]: {
      id: 6197,
      name: 'Eagle Eye',
      type: 'ability',
      description: '원거리 시야를 확장합니다.'
    },
    [hunterTranslations.flare]: {
      id: 1543,
      name: 'Flare',
      type: 'ability',
      description: '은신한 적을 드러냅니다.'
    },
    [hunterTranslations.track]: {
      id: 1494,
      name: 'Track',
      type: 'ability',
      description: '특정 유형의 적을 추적합니다.'
    },

    // 생존기
    [hunterTranslations.aspectOfTheTurtle]: {
      id: 186265,
      name: 'Aspect of the Turtle',
      type: 'defensive',
      cooldown: 180,
      description: '모든 피해를 면역합니다.'
    },
    [hunterTranslations.tranquilizingShot]: {
      id: 19801,
      name: 'Tranquilizing Shot',
      type: 'dispel',
      cooldown: 8,
      description: '적의 마법 효과를 해제합니다.'
    },
    [hunterTranslations.misdirection]: {
      id: 34477,
      name: 'Misdirection',
      type: 'utility',
      cooldown: 30,
      description: '위협을 다른 대상으로 전환합니다.'
    },

    // 덫
    [hunterTranslations.freezingTrap]: {
      id: 187650,
      name: 'Freezing Trap',
      type: 'trap',
      cooldown: 30,
      description: '대상을 얼려서 무력화시킵니다.'
    },
    [hunterTranslations.tarTrap]: {
      id: 187698,
      name: 'Tar Trap',
      type: 'trap',
      cooldown: 30,
      description: '적의 이동 속도를 감소시킵니다.'
    },
    [hunterTranslations.explosiveTrap]: {
      id: 191433,
      name: 'Explosive Trap',
      type: 'trap',
      cooldown: 30,
      description: '폭발하여 광역 피해를 입힙니다.'
    },
    [hunterTranslations.steelTrap]: {
      id: 162488,
      name: 'Steel Trap',
      type: 'trap',
      cooldown: 30,
      description: '적을 속박하고 지속 피해를 입힙니다.'
    },
    [hunterTranslations.bindingTrap]: {
      id: 109248,
      name: 'Binding Shot',
      type: 'trap',
      cooldown: 45,
      description: '적을 특정 지역에 속박합니다.'
    },
    [hunterTranslations.frostTrap]: {
      id: 13809,
      name: 'Frost Trap',
      type: 'trap',
      cooldown: 30,
      description: '적을 느리게 만드는 서리 덫입니다.'
    },

    // 기타 유틸리티
    [hunterTranslations.removeCorruption]: {
      id: 2782,
      name: 'Remove Curse',
      type: 'dispel',
      cooldown: 8,
      description: '독과 저주를 제거합니다.'
    },
    [hunterTranslations.exhilaration]: {
      id: 109304,
      name: 'Exhilaration',
      type: 'heal',
      cooldown: 120,
      description: '체력과 집중을 회복합니다.'
    },
    [hunterTranslations.counterShot]: {
      id: 147362,
      name: 'Counter Shot',
      type: 'interrupt',
      cooldown: 24,
      description: '적의 주문 시전을 차단합니다.'
    },
    [hunterTranslations.burstingShot]: {
      id: 186387,
      name: 'Bursting Shot',
      type: 'knockback',
      cooldown: 20,
      description: '적을 밀어내는 사격을 합니다.'
    },
    [hunterTranslations.intimidation]: {
      id: 19577,
      name: 'Intimidation',
      type: 'stun',
      cooldown: 60,
      description: '애완동물이 대상을 기절시킵니다.'
    }
  },

  // 야수 전문화
  beast_mastery: {
    // 핵심 능력
    "야수의 격노": { id: "bestial_wrath", name: "야수의 격노", type: "cooldown" },
    "야생의 상": { id: "aspect_of_the_wild", name: "야생의 상", type: "major_cooldown" },
    "공포의 화살": { id: "dire_beast", name: "공포의 화살", type: "summon" },
    "코브라 사격": { id: "cobra_shot", name: "코브라 사격", type: "ability" },
    "날카로운 사격": { id: "barbed_shot", name: "날카로운 사격", type: "ability" },
    "야생의 부름": { id: "call_of_the_wild", name: "야생의 부름", type: "major_cooldown" },

    // 특성
    "피의 욕망": { id: "bloodshed", name: "피의 욕망", type: "talent" },
    "야성": { id: "primal_instincts", name: "야성", type: "talent" },
    "무리 우두머리": { id: "pack_leader", name: "무리 우두머리", type: "talent" },
    "킬러 본능": { id: "killer_instinct", name: "킬러 본능", type: "talent" },
    "동물 동료": { id: "animal_companion", name: "동물 동료", type: "talent" },
    "하나의 무리": { id: "one_with_the_pack", name: "하나의 무리", type: "talent" },
    "키메라 사격": { id: "chimaera_shot", name: "키메라 사격", type: "talent" },
    "포효": { id: "barrage", name: "포효", type: "talent" },
    "쇄도": { id: "stampede", name: "쇄도", type: "talent" },
    "마구잡이 사격": { id: "scent_of_blood", name: "마구잡이 사격", type: "talent" },
    "뱀 쐐기": { id: "serpent_sting", name: "뱀 쐐기", type: "talent" },
    "전투의 함성": { id: "war_orders", name: "전투의 함성", type: "talent" },

    // 패시브
    "야수 조련 전문가": { id: "beast_mastery_passive", name: "야수 조련 전문가", type: "passive" },
    "이국적인 야수": { id: "exotic_beasts", name: "이국적인 야수", type: "passive" },
    "야수 쇄도": { id: "beast_cleave", name: "야수 쇄도", type: "passive" },
    "무리의 지도자": { id: "pack_alpha", name: "무리의 지도자", type: "passive" },
    "야생의 마음": { id: "wild_heart", name: "야생의 마음", type: "passive" },
    "친족의 유대": { id: "kindred_spirits", name: "친족의 유대", type: "passive" }
  },

  // 사격 전문화
  marksmanship: {
    // 핵심 능력
    "조준 사격": { id: "aimed_shot", name: "조준 사격", type: "ability" },
    "속사": { id: "rapid_fire", name: "속사", type: "channel" },
    "정밀 사격": { id: "steady_shot", name: "정밀 사격", type: "ability" },
    "속사": { id: "trueshot", name: "속사", type: "major_cooldown" },
    "이중 사격": { id: "double_tap", name: "이중 사격", type: "ability" },
    "폭발 사격": { id: "explosive_shot", name: "폭발 사격", type: "ability" },
    "바람 화살": { id: "wind_arrows", name: "바람 화살", type: "ability" },

    // 특성
    "신중한 조준": { id: "careful_aim", name: "신중한 조준", type: "talent" },
    "마스터 명사수": { id: "master_marksman", name: "마스터 명사수", type: "talent" },
    "뱀 독침": { id: "serpentstalkers_trickery", name: "뱀 독침", type: "talent" },
    "폭넓은 사격": { id: "volley", name: "폭넓은 사격", type: "talent" },
    "치명적인 사격": { id: "lethal_shots", name: "치명적인 사격", type: "talent" },
    "이중 조준": { id: "double_tap_talent", name: "이중 조준", type: "talent" },
    "연발 사격": { id: "calling_the_shots", name: "연발 사격", type: "talent" },
    "죽음의 표적": { id: "dead_eye", name: "죽음의 표적", type: "talent" },
    "바람을 타고": { id: "windrunners_guidance", name: "바람을 타고", type: "talent" },
    "집중 조준": { id: "focused_aim", name: "집중 조준", type: "talent" },
    "확산 탄환": { id: "scatter_shot", name: "확산 탄환", type: "talent" },

    // 패시브
    "정밀함": { id: "precise_shots", name: "정밀함", type: "passive" },
    "속임수 사격": { id: "trick_shots", name: "속임수 사격", type: "passive" },
    "치명적인 사수": { id: "lethal_range", name: "치명적인 사수", type: "passive" },
    "사수의 집중": { id: "marksmans_focus", name: "사수의 집중", type: "passive" },
    "바람길잡이": { id: "streamline", name: "바람길잡이", type: "passive" }
  },

  // 생존 전문화
  survival: {
    // 핵심 능력
    "맹금": { id: "raptor_strike", name: "맹금", type: "melee" },
    "살수": { id: "kill_command_sv", name: "살수", type: "ability" },
    "야생불 폭탄": { id: "wildfire_bomb", name: "야생불 폭탄", type: "ability" },
    "작살": { id: "harpoon", name: "작살", type: "ability" },
    "몽구스 물기": { id: "mongoose_bite", name: "몽구스 물기", type: "melee" },
    "측면 공격": { id: "flanking_strike", name: "측면 공격", type: "ability" },
    "도살": { id: "butchery", name: "도살", type: "ability" },
    "맹독": { id: "serpent_sting_sv", name: "맹독", type: "dot" },

    // 특성
    "원시 본능": { id: "primal_instincts_sv", name: "원시 본능", type: "talent" },
    "게릴라 전술": { id: "guerrilla_tactics", name: "게릴라 전술", type: "talent" },
    "야생의 주입": { id: "wildfire_infusion", name: "야생의 주입", type: "talent" },
    "상처 도려내기": { id: "carve", name: "상처 도려내기", type: "talent" },
    "독수리의 눈 깨우기": { id: "birds_of_prey", name: "독수리의 눈 깨우기", type: "talent" },
    "알파 포식자": { id: "alpha_predator", name: "알파 포식자", type: "talent" },
    "독사 쐐기": { id: "viper_venom", name: "독사 쐐기", type: "talent" },
    "몽구스의 분노": { id: "mongoose_fury", name: "몽구스의 분노", type: "talent" },
    "강철 덫": { id: "steel_trap_sv", name: "강철 덫", type: "talent" },
    "끈적이는 폭탄": { id: "sticky_bomb", name: "끈적이는 폭탄", type: "talent" },
    "피의 추적자": { id: "bloodseeker", name: "피의 추적자", type: "talent" },

    // 쿨다운
    "대규모 도살": { id: "coordinated_assault", name: "대규모 도살", type: "major_cooldown" },
    "야생의 혼": { id: "aspect_of_the_eagle", name: "야생의 혼", type: "cooldown" },

    // 패시브
    "사냥꾼의 도구": { id: "hunters_arsenal", name: "사냥꾼의 도구", type: "passive" },
    "생존 전문가": { id: "survivalist", name: "생존 전문가", type: "passive" },
    "전술가": { id: "terms_of_engagement", name: "전술가", type: "passive" },
    "자연과의 조화": { id: "wilderness_survival", name: "자연과의 조화", type: "passive" }
  },

  // PvP 특성
  pvp_talents: {
    // 공통 PvP 특성
    "검투사의 메달": { id: "gladiators_medallion", name: "검투사의 메달", type: "pvp_talent" },
    "끈기": { id: "relentless", name: "끈기", type: "pvp_talent" },
    "적응": { id: "adaptation", name: "적응", type: "pvp_talent" },

    // 사냥꾼 전용 PvP 특성
    "로어의 축복": { id: "roars_of_sacrifice", name: "로어의 축복", type: "pvp_talent" },
    "야생의 보호": { id: "survival_tactics", name: "야생의 보호", type: "pvp_talent" },
    "그물 사격": { id: "hunting_net", name: "그물 사격", type: "pvp_talent" },
    "독사 찌르기": { id: "viper_sting", name: "독사 찌르기", type: "pvp_talent" },
    "거미 쐐기": { id: "spider_sting", name: "거미 쐐기", type: "pvp_talent" },
    "전갈 쐐기": { id: "scorpid_sting", name: "전갈 쐐기", type: "pvp_talent" },
    "야생의 왕국": { id: "wild_kingdom", name: "야생의 왕국", type: "pvp_talent" },
    "사냥의 대가": { id: "hunting_pack", name: "사냥의 대가", type: "pvp_talent" },
    "다이아몬드 얼음": { id: "diamond_ice", name: "다이아몬드 얼음", type: "pvp_talent" },
    "집중의 렌즈": { id: "rangers_finesse", name: "집중의 렌즈", type: "pvp_talent" },
    "명사수의 집중": { id: "sniper_shot", name: "명사수의 집중", type: "pvp_talent" },
    "감속의 길": { id: "binding_shackles", name: "감속의 길", type: "pvp_talent" },
    "추적 전문가": { id: "tracker_net", name: "추적 전문가", type: "pvp_talent" },
    "집중 조준": { id: "hi_explosive_trap", name: "집중 조준", type: "pvp_talent" }
  }
};

module.exports = hunterSkills;