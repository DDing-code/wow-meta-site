// 죽음의 기사 (Death Knight) 스킬 데이터베이스
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)
// 최신 한국어 번역 적용

import { koreanTranslations } from '../koreanTranslations-11.2';

const deathknightTranslations = koreanTranslations.deathknightAbilities;

export const deathknightSkills = {
  className: koreanTranslations.classes.deathknight,
  classNameEn: 'Death Knight',
  // 공통 스킬 (모든 전문화 공유)
  common: {
    // 기본 공격 스킬
    [deathknightTranslations.autoAttack]: {
      id: 6603,
      name: 'Auto Attack',
      type: 'melee',
      description: '기본 근접 공격입니다.'
    },
    [deathknightTranslations.deathStrike]: {
      id: 49998,
      name: 'Death Strike',
      type: 'ability',
      description: '죽음의 힘으로 공격하고 체력을 회복합니다.'
    },
    [deathknightTranslations.deathAndDecay]: {
      id: 43265,
      name: 'Death and Decay',
      type: 'aoe',
      description: '대지를 오염시켜 지속 피해를 입힙니다.'
    },
    [deathknightTranslations.deathGrip]: {
      id: 49576,
      name: 'Death Grip',
      type: 'pull',
      cooldown: 25,
      description: '적을 강제로 끌어당깁니다.'
    },
    [deathknightTranslations.mindFreeze]: {
      id: 47528,
      name: 'Mind Freeze',
      type: 'interrupt',
      cooldown: 15,
      description: '적의 주문 시전을 차단합니다.'
    },
    [deathknightTranslations.darkCommand]: {
      id: 56222,
      name: 'Dark Command',
      type: 'taunt',
      cooldown: 8,
      description: '적을 도발하여 공격하도록 만듭니다.'
    },

    // 룬 능력
    "룬 전환": { id: "rune_tap", name: "룬 전환", type: "defensive" },
    "룬 무기 강화": { id: "empower_rune_weapon", name: "룬 무기 강화", type: "cooldown" },
    "피의 룬": { id: "blood_rune", name: "피의 룬", type: "resource" },
    "냉기 룬": { id: "frost_rune", name: "냉기 룬", type: "resource" },
    "부정 룬": { id: "unholy_rune", name: "부정 룬", type: "resource" },

    // 방어 기술
    "대마법 보호막": { id: "anti_magic_shell", name: "대마법 보호막", type: "defensive" },
    "대마법 지대": { id: "anti_magic_zone", name: "대마법 지대", type: "defensive" },
    "얼음같은 인내력": { id: "icebound_fortitude", name: "얼음같은 인내력", type: "defensive" },
    "리치의 혼": { id: "lichborne", name: "리치의 혼", type: "defensive" },

    // 유틸리티
    "죽음의 문": { id: "death_gate", name: "죽음의 문", type: "teleport" },
    "어둠의 통로": { id: "path_of_frost", name: "어둠의 통로", type: "utility" },
    "사자의 군대": { id: "army_of_the_dead", name: "사자의 군대", type: "summon" },
    "어둠의 중재": { id: "dark_simulacrum", name: "어둠의 중재", type: "utility" },
    "구울 되살리기": { id: "raise_dead", name: "구울 되살리기", type: "summon" },
    "시체 폭발": { id: "corpse_explosion", name: "시체 폭발", type: "ability" },
    "질병 걸기": { id: "outbreak", name: "질병 걸기", type: "dot" },

    // 이동기
    "죽음의 진군": { id: "deaths_advance", name: "죽음의 진군", type: "movement" },
    "망령 걸음": { id: "wraith_walk", name: "망령 걸음", type: "movement" },

    // 기타
    "황폐": { id: "control_undead", name: "황폐", type: "cc" },
    "어둠의 복수자": { id: "dark_transformation", name: "어둠의 복수자", type: "pet_transform" },
    "사슬 고리": { id: "chains_of_ice", name: "사슬 고리", type: "slow" }
  },

  // 혈기 전문화
  blood: {
    // 핵심 능력
    "고어의 악령": { id: "dancing_rune_weapon", name: "고어의 악령", type: "major_cooldown" },
    "피의 소용돌이": { id: "blood_boil", name: "피의 소용돌이", type: "aoe" },
    "심장 강타": { id: "heart_strike", name: "심장 강타", type: "ability" },
    "흡혈": { id: "vampiric_blood", name: "흡혈", type: "defensive" },
    "룬 타격": { id: "rune_strike", name: "룬 타격", type: "ability" },
    "뼈 폭풍": { id: "bonestorm", name: "뼈 폭풍", type: "ability" },
    "피의 거울": { id: "blood_mirror", name: "피의 거울", type: "ability" },
    "골수 분쇄": { id: "marrowrend", name: "골수 분쇄", type: "ability" },

    // 특성
    "핏빛 열병": { id: "blooddrinker", name: "핏빛 열병", type: "talent" },
    "신속한 부패": { id: "rapid_decomposition", name: "신속한 부패", type: "talent" },
    "타산": { id: "consumption", name: "타산", type: "talent" },
    "빨간 갈증": { id: "red_thirst", name: "빨간 갈증", type: "talent" },
    "표식": { id: "mark_of_blood", name: "표식", type: "talent" },
    "묘비": { id: "tombstone", name: "묘비", type: "talent" },
    "재빠른 회복": { id: "will_of_the_necropolis", name: "재빠른 회복", type: "talent" },
    "적혈구 증가": { id: "hemostasis", name: "적혈구 증가", type: "talent" },
    "영원한 룬 무기": { id: "purgatory", name: "영원한 룬 무기", type: "talent" },
    "피의 진수": { id: "blood_for_blood", name: "피의 진수", type: "talent" },
    "끓어오르는 피": { id: "voracious", name: "끓어오르는 피", type: "talent" },

    // 패시브
    "적혈구 보호막": { id: "blood_shield", name: "적혈구 보호막", type: "passive" },
    "진홍빛 스컬지": { id: "crimson_scourge", name: "진홍빛 스컬지", type: "passive" },
    "뼈 방패": { id: "bone_shield", name: "뼈 방패", type: "passive" },
    "피의 존재": { id: "blood_presence", name: "피의 존재", type: "passive" },
    "베테랑의 스컬지": { id: "veteran_of_the_third_war", name: "베테랑의 스컬지", type: "passive" }
  },

  // 냉기 전문화
  frost: {
    // 핵심 능력
    "망각": { id: "obliterate", name: "망각", type: "ability" },
    "서리 일격": { id: "frost_strike", name: "서리 일격", type: "ability" },
    "울부짖는 한파": { id: "howling_blast", name: "울부짖는 한파", type: "ability" },
    "서리의 기둥": { id: "pillar_of_frost", name: "서리의 기둥", type: "major_cooldown" },
    "냉혹한 겨울": { id: "remorseless_winter", name: "냉혹한 겨울", type: "aoe" },
    "서리 한파": { id: "breath_of_sindragosa", name: "서리 한파", type: "channel" },
    "빙하 진군": { id: "glacial_advance", name: "빙하 진군", type: "ability" },
    "서리 폭풍": { id: "frostscythe", name: "서리 폭풍", type: "ability" },
    "겨울의 뿔피리": { id: "horn_of_winter", name: "겨울의 뿔피리", type: "buff" },

    // 특성
    "룬 무기의 불협화음": { id: "runic_attenuation", name: "룬 무기의 불협화음", type: "talent" },
    "냉기의 발톱": { id: "icy_talons", name: "냉기의 발톱", type: "talent" },
    "살인 기계": { id: "murderous_efficiency", name: "살인 기계", type: "talent" },
    "냉기의 심장": { id: "frozen_heart", name: "냉기의 심장", type: "talent" },
    "절대 영도": { id: "inexorable_assault", name: "절대 영도", type: "talent" },
    "사신의 한파": { id: "gathering_storm", name: "사신의 한파", type: "talent" },
    "얼어붙은 맥박": { id: "frozen_pulse", name: "얼어붙은 맥박", type: "talent" },
    "서리 고룡": { id: "frostwyrms_fury", name: "서리 고룡", type: "talent" },
    "영원한 축복": { id: "obliteration", name: "영원한 축복", type: "talent" },
    "빙하": { id: "avalanche", name: "빙하", type: "talent" },
    "서릿발": { id: "icecap", name: "서릿발", type: "talent" },

    // 패시브
    "산산조각": { id: "killing_machine", name: "산산조각", type: "passive" },
    "백색 서리": { id: "rime", name: "백색 서리", type: "passive" },
    "룬 강화": { id: "runic_empowerment", name: "룬 강화", type: "passive" },
    "이중 무기": { id: "might_of_the_frozen_wastes", name: "이중 무기", type: "passive" },
    "부서지기 쉬운 갑옷": { id: "brittle", name: "부서지기 쉬운 갑옷", type: "passive" }
  },

  // 부정 전문화
  unholy: {
    // 핵심 능력
    "고름 일격": { id: "festering_strike", name: "고름 일격", type: "ability" },
    "죽음의 고리": { id: "death_coil", name: "죽음의 고리", type: "ability" },
    "스컬지 타격": { id: "scourge_strike", name: "스컬지 타격", type: "ability" },
    "역병 일격": { id: "plague_strike", name: "역병 일격", type: "ability" },
    "어둠의 변신": { id: "dark_transformation", name: "어둠의 변신", type: "pet" },
    "사자의 군대": { id: "army_of_the_damned", name: "사자의 군대", type: "major_cooldown" },
    "아포칼립스": { id: "apocalypse", name: "아포칼립스", type: "summon" },
    "역병 발발": { id: "epidemic", name: "역병 발발", type: "aoe" },
    "부정한 습격": { id: "unholy_assault", name: "부정한 습격", type: "cooldown" },
    "괴저 상처": { id: "necrotic_strike", name: "괴저 상처", type: "ability" },

    // 특성
    "감염된 발톱": { id: "infected_claws", name: "감염된 발톱", type: "talent" },
    "모든 것이 사라질 것이다": { id: "all_will_serve", name: "모든 것이 사라질 것이다", type: "talent" },
    "역병 전달자": { id: "epidemic_talent", name: "역병 전달자", type: "talent" },
    "썩은 타격": { id: "bursting_sores", name: "썩은 타격", type: "talent" },
    "병든 발톱": { id: "ebon_fever", name: "병든 발톱", type: "talent" },
    "부정한 광기": { id: "unholy_frenzy", name: "부정한 광기", type: "talent" },
    "죽음과 부활": { id: "death_pact", name: "죽음과 부활", type: "talent" },
    "가고일 소환": { id: "summon_gargoyle", name: "가고일 소환", type: "talent" },
    "군대 강화": { id: "army_of_the_damned_talent", name: "군대 강화", type: "talent" },
    "영혼 수확자": { id: "soul_reaper", name: "영혼 수확자", type: "talent" },
    "언데드 사령관": { id: "commander_of_the_dead", name: "언데드 사령관", type: "talent" },

    // 패시브
    "상처 고름": { id: "festering_wound", name: "상처 고름", type: "passive" },
    "어둠의 질주": { id: "death_rot", name: "어둠의 질주", type: "passive" },
    "부정한 존재": { id: "unholy_presence", name: "부정한 존재", type: "passive" },
    "룬 부패": { id: "runic_corruption", name: "룬 부패", type: "passive" },
    "역병 일격자": { id: "plaguebringer", name: "역병 일격자", type: "passive" }
  },

  // PvP 특성
  pvp_talents: {
    // 공통 PvP 특성
    "검투사의 메달": { id: "gladiators_medallion", name: "검투사의 메달", type: "pvp_talent" },
    "끈기": { id: "relentless", name: "끈기", type: "pvp_talent" },
    "적응": { id: "adaptation", name: "적응", type: "pvp_talent" },

    // 죽음의 기사 전용 PvP 특성
    "죽음의 사슬": { id: "deaths_echo", name: "죽음의 사슬", type: "pvp_talent" },
    "어둠의 시뮬레이션": { id: "dark_simulacrum_pvp", name: "어둠의 시뮬레이션", type: "pvp_talent" },
    "동결": { id: "deathchill", name: "동결", type: "pvp_talent" },
    "시체 방패": { id: "corpse_shield", name: "시체 방패", type: "pvp_talent" },
    "괴사": { id: "necrotic_aura", name: "괴사", type: "pvp_talent" },
    "질식": { id: "strangulate", name: "질식", type: "pvp_talent" },
    "타락한 지대": { id: "unholy_ground", name: "타락한 지대", type: "pvp_talent" },
    "생명력 전환": { id: "life_and_death", name: "생명력 전환", type: "pvp_talent" },
    "부식성 피": { id: "heartstop_aura", name: "부식성 피", type: "pvp_talent" },
    "피의 폭주": { id: "blood_for_blood_pvp", name: "피의 폭주", type: "pvp_talent" },
    "칠흑 발톱": { id: "claw_shadows", name: "칠흑 발톱", type: "pvp_talent" },
    "죽음의 체인": { id: "chains_of_death", name: "죽음의 체인", type: "pvp_talent" },
    "어둠의 권능": { id: "dark_powers", name: "어둠의 권능", type: "pvp_talent" }
  }
};

module.exports = deathknightSkills;