// 도적 (Rogue) 스킬 데이터베이스
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)
// 최신 한국어 번역 적용

import { koreanTranslations } from '../koreanTranslations-11.2';

const rogueTranslations = koreanTranslations.rogueAbilities;

export const rogueSkills = {
  className: koreanTranslations.classes.rogue,
  classNameEn: 'Rogue',
  // 공통 스킬 (모든 전문화 공유)
  common: {
    // 기본 공격 스킬
    [rogueTranslations.autoAttack]: {
      id: 6603,
      name: 'Auto Attack',
      type: 'melee',
      description: '기본 근접 공격입니다.'
    },
    [rogueTranslations.sinisterStrike]: {
      id: 193315,
      name: 'Sinister Strike',
      type: 'builder',
      description: '콤보 포인트를 생성하는 기본 공격입니다.'
    },
    [rogueTranslations.eviscerate]: {
      id: 196819,
      name: 'Eviscerate',
      type: 'finisher',
      description: '콤보 포인트를 소모하여 강력한 일격을 가합니다.'
    },
    [rogueTranslations.shiv]: {
      id: 5938,
      name: 'Shiv',
      type: 'ability',
      cooldown: 25,
      description: '독을 바른 단검으로 찌릅니다.'
    },
    [rogueTranslations.cheapShot]: {
      id: 1833,
      name: 'Cheap Shot',
      type: 'stun',
      description: '은신 상태에서 대상을 기절시킵니다.'
    },
    [rogueTranslations.kidneyShot]: {
      id: 408,
      name: 'Kidney Shot',
      type: 'stun',
      description: '콤보 포인트를 소모하여 대상을 기절시킵니다.'
    },

    // 은신 관련
    [rogueTranslations.stealth]: {
      id: 1784,
      name: 'Stealth',
      type: 'stealth',
      description: '은신 상태가 되어 적에게 발각되지 않습니다.'
    },
    [rogueTranslations.vanish]: {
      id: 1856,
      name: 'Vanish',
      type: 'defensive',
      cooldown: 90,
      description: '즉시 은신 상태가 됩니다.'
    },
    [rogueTranslations.cloakOfShadows]: {
      id: 31224,
      name: 'Cloak of Shadows',
      type: 'defensive',
      cooldown: 120,
      description: '마법 피해와 효과를 무시합니다.'
    },
    [rogueTranslations.shadowstep]: {
      id: 36554,
      name: 'Shadowstep',
      type: 'movement',
      cooldown: 25,
      description: '대상의 뒤로 순간이동합니다.'
    },
    [rogueTranslations.shadowstrike]: {
      id: 185438,
      name: 'Shadowstrike',
      type: 'ability',
      description: '그림자를 통해 적에게 순간이동하여 공격합니다.'
    },
    [rogueTranslations.shadowDance]: {
      id: 185313,
      name: 'Shadow Dance',
      type: 'cooldown',
      cooldown: 60,
      description: '은신 능력을 향상시킵니다.'
    },

    // 콤보 포인트 생성/소비
    [rogueTranslations.combatReadiness]: {
      id: 74001,
      name: 'Combat Readiness',
      type: 'defensive',
      cooldown: 120,
      description: '받는 피해를 감소시킵니다.'
    },
    [rogueTranslations.sliceAndDice]: {
      id: 315496,
      name: 'Slice and Dice',
      type: 'buff',
      description: '콤보 포인트를 소모하여 공격 속도를 증가시킵니다.'
    },
    [rogueTranslations.exposeArmor]: {
      id: 8647,
      name: 'Expose Armor',
      type: 'debuff',
      description: '대상의 방어력을 감소시킵니다.'
    },
    [rogueTranslations.rupture]: {
      id: 1943,
      name: 'Rupture',
      type: 'dot',
      description: '콤보 포인트를 소모하여 지속 피해를 입힙니다.'
    },

    // 방어 기술
    [rogueTranslations.evasion]: {
      id: 5277,
      name: 'Evasion',
      type: 'defensive',
      cooldown: 90,
      description: '회피율을 크게 증가시킵니다.'
    },
    [rogueTranslations.cheatDeath]: {
      id: 31230,
      name: 'Cheat Death',
      type: 'defensive',
      description: '치명적인 피해로부터 생존할 수 있습니다.'
    },
    [rogueTranslations.crimsonVial]: {
      id: 185311,
      name: 'Crimson Vial',
      type: 'heal',
      cooldown: 30,
      description: '체력을 회복합니다.'
    },
    "페인트": { id: "feint", name: "페인트", type: "defensive" },

    // 이동기 및 유틸리티
    "질주": { id: "sprint", name: "질주", type: "movement" },
    "갈고리 발사": { id: "grappling_hook", name: "갈고리 발사", type: "movement" },
    "발차기": { id: "kick", name: "발차기", type: "interrupt" },
    "실명": { id: "blind", name: "실명", type: "cc" },
    "마취 독": { id: "numbing_poison", name: "마취 독", type: "poison" },
    "치명상 독": { id: "wound_poison", name: "치명상 독", type: "poison" },
    "순간 독": { id: "instant_poison", name: "순간 독", type: "poison" },
    "치명적인 독": { id: "deadly_poison", name: "치명적인 독", type: "poison" },

    // 기타
    "속임수 거래": { id: "tricks_of_the_trade", name: "속임수 거래", type: "utility" },
    "혼란": { id: "distract", name: "혼란", type: "utility" },
    "교묘한 속임수": { id: "shroud_of_concealment", name: "교묘한 속임수", type: "group_stealth" },
    "자물쇠 따기": { id: "pick_lock", name: "자물쇠 따기", type: "utility" },
    "소매치기": { id: "pick_pocket", name: "소매치기", type: "utility" },
    "감지": { id: "detection", name: "감지", type: "utility" },
    "기절시키기": { id: "sap", name: "기절시키기", type: "cc" }
  },

  // 암살 전문화
  assassination: {
    // 핵심 능력
    "변이": { id: "mutilate", name: "변이", type: "builder" },
    "독살": { id: "envenom", name: "독살", type: "finisher" },
    "목조르기": { id: "garrote", name: "목조르기", type: "dot" },
    "맹독": { id: "vendetta", name: "맹독", type: "major_cooldown" },
    "독칼": { id: "poisoned_knife", name: "독칼", type: "ranged" },
    "선혈": { id: "crimson_tempest", name: "선혈", type: "aoe" },
    "부채칼": { id: "fan_of_knives", name: "부채칼", type: "aoe" },

    // 특성
    "정교한 계획": { id: "elaborate_planning", name: "정교한 계획", type: "talent" },
    "맹독 폭탄": { id: "venomous_wounds", name: "맹독 폭탄", type: "talent" },
    "출혈": { id: "hemorrhage", name: "출혈", type: "talent" },
    "마스터 독살자": { id: "master_poisoner", name: "마스터 독살자", type: "talent" },
    "독성 칼날": { id: "toxic_blade", name: "독성 칼날", type: "talent" },
    "절개술": { id: "exsanguinate", name: "절개술", type: "talent" },
    "숨겨진 칼날": { id: "hidden_blades", name: "숨겨진 칼날", type: "talent" },
    "피 웅덩이": { id: "bloody_mess", name: "피 웅덩이", type: "talent" },
    "치명적인 속도": { id: "alacrity", name: "치명적인 속도", type: "talent" },
    "맹독 주입": { id: "venom_rush", name: "맹독 주입", type: "talent" },
    "산성 피": { id: "internal_bleeding", name: "산성 피", type: "talent" },
    "체계적인 실행": { id: "systematic_execution", name: "체계적인 실행", type: "talent" },

    // 패시브
    "개선된 독": { id: "improved_poisons", name: "개선된 독", type: "passive" },
    "맹독 상처": { id: "venomous_wounds_passive", name: "맹독 상처", type: "passive" },
    "치명적인 맹독": { id: "deadly_poison_passive", name: "치명적인 맹독", type: "passive" },
    "암살자의 결의": { id: "assassins_resolve", name: "암살자의 결의", type: "passive" },
    "밀폐된 유리병": { id: "seal_fate", name: "밀폐된 유리병", type: "passive" }
  },

  // 무법 전문화
  outlaw: {
    // 핵심 능력
    "권총 사격": { id: "pistol_shot", name: "권총 사격", type: "ranged" },
    "흉악한 일격": { id: "dispatch", name: "흉악한 일격", type: "finisher" },
    "구르기": { id: "roll_the_bones", name: "구르기", type: "buff" },
    "난도 급상승": { id: "blade_rush", name: "난도 급상승", type: "ability" },
    "폭풍의 칼날": { id: "blade_flurry", name: "폭풍의 칼날", type: "ability" },
    "아드레날린 촉진": { id: "adrenaline_rush", name: "아드레날린 촉진", type: "major_cooldown" },
    "매복": { id: "ambush", name: "매복", type: "ability" },
    "연타": { id: "between_the_eyes", name: "연타", type: "finisher" },

    // 특성
    "유령의 일격": { id: "ghostly_strike", name: "유령의 일격", type: "talent" },
    "빠른 뽑기": { id: "quick_draw", name: "빠른 뽑기", type: "talent" },
    "검술 대가": { id: "weaponmaster", name: "검술 대가", type: "talent" },
    "뼈 주사위": { id: "loaded_dice", name: "뼈 주사위", type: "talent" },
    "살상 본능": { id: "killing_spree", name: "살상 본능", type: "talent" },
    "해적단의 규칙": { id: "take_em_by_surprise", name: "해적단의 규칙", type: "talent" },
    "춤추는 칼": { id: "dancing_steel", name: "춤추는 칼", type: "talent" },
    "표식 사격": { id: "marked_for_death", name: "표식 사격", type: "talent" },
    "깊은 전략": { id: "deeper_stratagem", name: "깊은 전략", type: "talent" },
    "약탈": { id: "plunder_armor", name: "약탈", type: "talent" },
    "난폭함": { id: "restless_blades", name: "난폭함", type: "talent" },
    "일망타진": { id: "blade_rush_talent", name: "일망타진", type: "talent" },

    // 패시브
    "전투 능력": { id: "combat_potency", name: "전투 능력", type: "passive" },
    "무자비한 정밀함": { id: "ruthless_precision", name: "무자비한 정밀함", type: "passive" },
    "재빠른 손재주": { id: "main_gauche", name: "재빠른 손재주", type: "passive" },
    "약삭빠름": { id: "restless_crew", name: "약삭빠름", type: "passive" },
    "해적의 법칙": { id: "pirates_rule", name: "해적의 법칙", type: "passive" }
  },

  // 잠행 전문화
  subtlety: {
    // 핵심 능력
    "그림자 칼날": { id: "shadowstrike", name: "그림자 칼날", type: "builder" },
    "비장": { id: "backstab", name: "비장", type: "builder" },
    "그림자 칼춤": { id: "shadow_dance_sub", name: "그림자 칼춤", type: "cooldown" },
    "어둠의 칼날": { id: "shadow_blades", name: "어둠의 칼날", type: "major_cooldown" },
    "죽음의 상징": { id: "symbols_of_death", name: "죽음의 상징", type: "cooldown" },
    "비밀 기술": { id: "secret_technique", name: "비밀 기술", type: "ability" },
    "검은 가루": { id: "black_powder", name: "검은 가루", type: "aoe" },
    "수리검 폭풍": { id: "shuriken_storm", name: "수리검 폭풍", type: "aoe" },
    "그림자 금고": { id: "shadowvault", name: "그림자 금고", type: "ability" },

    // 특성
    "최후 공략": { id: "finality", name: "최후 공략", type: "talent" },
    "어둠의 주인": { id: "master_of_shadows", name: "어둠의 주인", type: "talent" },
    "심층 전략": { id: "deeper_stratagem_sub", name: "심층 전략", type: "talent" },
    "냉혹한 기술": { id: "cold_blood", name: "냉혹한 기술", type: "talent" },
    "그림자 초점": { id: "shadow_focus", name: "그림자 초점", type: "talent" },
    "수리검 폭풍": { id: "shuriken_tornado", name: "수리검 폭풍", type: "talent" },
    "음흉한 책략": { id: "dark_shadow", name: "음흉한 책략", type: "talent" },
    "밤의 복수": { id: "night_vengeance", name: "밤의 복수", type: "talent" },
    "잠행자의 예언": { id: "subterfuge", name: "잠행자의 예언", type: "talent" },
    "치명적인 그림자": { id: "weaponized_shadows", name: "치명적인 그림자", type: "talent" },
    "어둠 강타": { id: "gloomblade", name: "어둠 강타", type: "talent" },
    "잔상": { id: "lingering_shadow", name: "잔상", type: "talent" },

    // 패시브
    "그림자의 기술": { id: "shadow_techniques", name: "그림자의 기술", type: "passive" },
    "심화": { id: "deepening_shadows", name: "심화", type: "passive" },
    "관대한 운명": { id: "relentless_strikes", name: "관대한 운명", type: "passive" },
    "잠행의 대가": { id: "find_weakness", name: "잠행의 대가", type: "passive" },
    "어둠의 은총": { id: "shadowy_disguise", name: "어둠의 은총", type: "passive" }
  },

  // PvP 특성
  pvp_talents: {
    // 공통 PvP 특성
    "검투사의 메달": { id: "gladiators_medallion", name: "검투사의 메달", type: "pvp_talent" },
    "끈기": { id: "relentless", name: "끈기", type: "pvp_talent" },
    "적응": { id: "adaptation", name: "적응", type: "pvp_talent" },

    // 도적 전용 PvP 특성
    "연막탄": { id: "smoke_bomb", name: "연막탄", type: "pvp_talent" },
    "무장 해제": { id: "dismantle", name: "무장 해제", type: "pvp_talent" },
    "약점 노출": { id: "prey_on_the_weak", name: "약점 노출", type: "pvp_talent" },
    "신경 마비": { id: "neurotoxin", name: "신경 마비", type: "pvp_talent" },
    "혈독": { id: "hemotoxin", name: "혈독", type: "pvp_talent" },
    "시스템 쇼크": { id: "system_shock", name: "시스템 쇼크", type: "pvp_talent" },
    "맹독의 대가": { id: "creeping_venom", name: "맹독의 대가", type: "pvp_talent" },
    "치명적인 양조": { id: "death_from_above", name: "치명적인 양조", type: "pvp_talent" },
    "단검 투척": { id: "shadowy_duel", name: "단검 투척", type: "pvp_talent" },
    "도둑의 표식": { id: "thiefs_bargain", name: "도둑의 표식", type: "pvp_talent" },
    "마비 독": { id: "shiv_debuff", name: "마비 독", type: "pvp_talent" },
    "도둑의 계략": { id: "control_is_king", name: "도둑의 계략", type: "pvp_talent" },
    "냉혹한 기회주의자": { id: "cold_blood_pvp", name: "냉혹한 기회주의자", type: "pvp_talent" },
    "그림자 반전": { id: "reverse_shadow", name: "그림자 반전", type: "pvp_talent" }
  }
};

module.exports = rogueSkills;