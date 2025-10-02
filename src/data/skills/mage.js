// 마법사 (Mage) 스킬 데이터베이스
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)
// 최신 한국어 번역 적용

import { koreanTranslations } from '../koreanTranslations-11.2';

const mageTranslations = koreanTranslations.mageAbilities;

export const mageSkills = {
  className: koreanTranslations.classes.mage,
  classNameEn: 'Mage',
  // 공통 스킬 (모든 전문화 공유)
  common: {
    // 기본 공격 스킬
    [mageTranslations.autoAttack]: {
      id: 6603,
      name: 'Auto Attack',
      type: 'melee',
      description: '기본 근접 공격입니다.'
    },
    [mageTranslations.scorch]: {
      id: 2948,
      name: 'Scorch',
      type: 'cast',
      description: '화염으로 적을 지져 버립니다.'
    },
    [mageTranslations.frostbolt]: {
      id: 116,
      name: 'Frostbolt',
      type: 'cast',
      description: '냉기 화살로 대상을 느리고 피해를 입힙니다.'
    },
    [mageTranslations.arcaneBarrage]: {
      id: 44425,
      name: 'Arcane Barrage',
      type: 'instant',
      description: '비전 에너지로 강력한 공격을 가합니다.'
    },
    [mageTranslations.arcaneIntellect]: {
      id: 1459,
      name: 'Arcane Intellect',
      type: 'buff',
      description: '대상의 지능과 마나를 증가시킵니다.'
    },
    [mageTranslations.polymorph]: {
      id: 118,
      name: 'Polymorph',
      type: 'cc',
      description: '대상을 동물로 변신시켜 무력화합니다.'
    },
    [mageTranslations.counterspell]: {
      id: 2139,
      name: 'Counterspell',
      type: 'interrupt',
      cooldown: 24,
      description: '적의 주문 시전을 차단합니다.'
    },
    [mageTranslations.spellsteal]: {
      id: 30449,
      name: 'Spellsteal',
      type: 'dispel',
      description: '적의 마법 효과를 훔쳐옴니다.'
    },

    // 방어 기술
    "얼음 방패": { id: "ice_block", name: "얼음 방패", type: "immunity" },
    "얼음 보호막": { id: "ice_barrier", name: "얼음 보호막", type: "shield" },
    "프리즘 보호막": { id: "prismatic_barrier", name: "프리즘 보호막", type: "shield" },
    "투명화": { id: "invisibility", name: "투명화", type: "stealth" },
    "상급 투명화": { id: "greater_invisibility", name: "상급 투명화", type: "stealth" },
    "거울 이미지": { id: "mirror_image", name: "거울 이미지", type: "summon" },
    "시간 돌리기": { id: "alter_time", name: "시간 돌리기", type: "defensive" },

    // 이동기 및 유틸리티
    "점멸": { id: "blink", name: "점멸", type: "teleport" },
    "변위": { id: "displacement", name: "변위", type: "teleport" },
    "환영 이동": { id: "shimmer", name: "환영 이동", type: "movement" },
    "감속": { id: "slow", name: "감속", type: "slow" },
    "마법 해제": { id: "remove_curse", name: "마법 해제", type: "dispel" },
    "소환수 소환": { id: "summon_water_elemental", name: "소환수 소환", type: "summon" },

    // 음식/물 생성
    "마법 음식 창조": { id: "conjure_refreshment", name: "마법 음식 창조", type: "utility" },
    "리프레시먼트 탁자": { id: "conjure_refreshment_table", name: "리프레시먼트 탁자", type: "utility" },

    // 포탈 및 순간이동
    "순간이동": { id: "teleport", name: "순간이동", type: "teleport" },
    "차원문": { id: "portal", name: "차원문", type: "portal" },

    // 기타
    "마나 보호막": { id: "mana_shield", name: "마나 보호막", type: "shield" },
    "마법 증폭": { id: "amplify_magic", name: "마법 증폭", type: "buff" },
    "감속 낙하": { id: "slow_fall", name: "감속 낙하", type: "utility" }
  },

  // 비전 전문화
  arcane: {
    // 핵심 능력
    "비전 폭발": { id: "arcane_blast", name: "비전 폭발", type: "cast" },
    "비전 작렬": { id: "arcane_missiles", name: "비전 작렬", type: "channel" },
    "비전 폭발탄": { id: "arcane_explosion", name: "비전 폭발탄", type: "aoe" },
    "비전 전력": { id: "arcane_power", name: "비전 전력", type: "major_cooldown" },
    "비전 구슬": { id: "arcane_orb", name: "비전 구슬", type: "ability" },
    "소환": { id: "evocation", name: "소환", type: "channel" },
    "마력의 룬": { id: "rune_of_power", name: "마력의 룬", type: "buff" },
    "천벌의 격노": { id: "touch_of_the_magi", name: "천벌의 격노", type: "debuff" },
    "마나 룬": { id: "presence_of_mind", name: "마나 룬", type: "instant" },
    "투명": { id: "arcane_familiar", name: "투명", type: "summon" },

    // 특성
    "규칙의 힘": { id: "rule_of_threes", name: "규칙의 힘", type: "talent" },
    "증폭": { id: "amplification", name: "증폭", type: "talent" },
    "신비한 비전": { id: "arcane_echo", name: "신비한 비전", type: "talent" },
    "네더 폭풍": { id: "nether_tempest", name: "네더 폭풍", type: "talent" },
    "마나 흡수": { id: "mana_adept", name: "마나 흡수", type: "talent" },
    "상전이": { id: "chrono_shift", name: "상전이", type: "talent" },
    "파동": { id: "resonance", name: "파동", type: "talent" },
    "과충전": { id: "overpowered", name: "과충전", type: "talent" },
    "시간 변형": { id: "temporal_displacement", name: "시간 변형", type: "talent" },
    "비전 충전": { id: "charged_up", name: "비전 충전", type: "talent" },
    "깨달음": { id: "enlightened", name: "깨달음", type: "talent" },

    // 패시브
    "정화": { id: "clearcasting", name: "정화", type: "passive" },
    "비전 충전물": { id: "arcane_charges", name: "비전 충전물", type: "resource" },
    "마나 흡착": { id: "mana_absorption", name: "마나 흡착", type: "passive" },
    "마나의 대가": { id: "mastery_mana_adept", name: "마나의 대가", type: "passive" },
    "비전 정신": { id: "arcane_mind", name: "비전 정신", type: "passive" }
  },

  // 화염 전문화
  fire: {
    // 핵심 능력
    "화염구": { id: "fireball", name: "화염구", type: "cast" },
    "화염 작렬": { id: "fire_blast", name: "화염 작렬", type: "instant" },
    "불덩이 작렬": { id: "pyroblast", name: "불덩이 작렬", type: "cast" },
    "작열": { id: "combustion", name: "작열", type: "major_cooldown" },
    "용의 숨결": { id: "dragons_breath", name: "용의 숨결", type: "cone" },
    "화염 폭풍": { id: "flamestrike", name: "화염 폭풍", type: "aoe" },
    "불기둥": { id: "flame_patch", name: "불기둥", type: "aoe" },
    "유성": { id: "meteor", name: "유성", type: "ability" },
    "살아있는 폭탄": { id: "living_bomb", name: "살아있는 폭탄", type: "dot" },
    "불사조 화염": { id: "phoenix_flames", name: "불사조 화염", type: "ability" },
    "타오르는 속도": { id: "blazing_speed", name: "타오르는 속도", type: "movement" },

    // 특성
    "점화": { id: "ignite", name: "점화", type: "passive" },
    "작열탄": { id: "searing_touch", name: "작열탄", type: "talent" },
    "화염증폭": { id: "firestarter", name: "화염증폭", type: "talent" },
    "번뜩임": { id: "pyroclasm", name: "번뜩임", type: "talent" },
    "몰타는 불길": { id: "conflagration", name: "몰타는 불길", type: "talent" },
    "열정": { id: "pyromaniac", name: "열정", type: "talent" },
    "점화 폭발": { id: "alexstraszas_fury", name: "점화 폭발", type: "talent" },
    "불꽃놀이": { id: "flame_on", name: "불꽃놀이", type: "talent" },
    "연소": { id: "kindling", name: "연소", type: "talent" },
    "화염의 룬": { id: "rune_of_fire", name: "화염의 룬", type: "talent" },
    "발화": { id: "frenetic_speed", name: "발화", type: "talent" },

    // 패시브
    "발화!": { id: "hot_streak", name: "발화!", type: "passive" },
    "연속 발화": { id: "heating_up", name: "연속 발화", type: "passive" },
    "강화된 불덩이 작렬": { id: "enhanced_pyrotechnics", name: "강화된 불덩이 작렬", type: "passive" },
    "임계 질량": { id: "critical_mass", name: "임계 질량", type: "passive" },
    "소각": { id: "cauterize", name: "소각", type: "passive" }
  },

  // 냉기 전문화
  frost: {
    // 핵심 능력
    "서리 화살": { id: "frostbolt", name: "서리 화살", type: "cast" },
    "얼음창": { id: "ice_lance", name: "얼음창", type: "instant" },
    "얼음 불꽃": { id: "flurry", name: "얼음 불꽃", type: "channel" },
    "혹한의 추위": { id: "frozen_orb", name: "혹한의 추위", type: "ability" },
    "눈보라": { id: "blizzard", name: "눈보라", type: "aoe" },
    "냉기 돌풍": { id: "cone_of_cold", name: "냉기 돌풍", type: "cone" },
    "얼음 핏줄": { id: "icy_veins", name: "얼음 핏줄", type: "major_cooldown" },
    "서리 화살 세례": { id: "glacial_spike", name: "서리 화살 세례", type: "cast" },
    "얼음 회오리": { id: "ice_nova", name: "얼음 회오리", type: "aoe" },
    "서리 폭탄": { id: "frost_bomb", name: "서리 폭탄", type: "debuff" },
    "광선 빙결": { id: "ray_of_frost", name: "광선 빙결", type: "channel" },

    // 특성
    "얼음 파편": { id: "ice_shards", name: "얼음 파편", type: "talent" },
    "수정구": { id: "crystal_socket", name: "수정구", type: "talent" },
    "얼어붙은 손길": { id: "frozen_touch", name: "얼어붙은 손길", type: "talent" },
    "한파": { id: "cold_snap", name: "한파", type: "talent" },
    "얼음 형상": { id: "ice_form", name: "얼음 형상", type: "talent" },
    "삭풍": { id: "arctic_gale", name: "삭풍", type: "talent" },
    "광대한 겨울": { id: "splitting_ice", name: "광대한 겨울", type: "talent" },
    "혜성 폭풍": { id: "comet_storm", name: "혜성 폭풍", type: "talent" },
    "서리 고리": { id: "ring_of_frost", name: "서리 고리", type: "talent" },
    "빙하 파편": { id: "glacial_fragments", name: "빙하 파편", type: "talent" },
    "열 공명": { id: "thermal_void", name: "열 공명", type: "talent" },

    // 패시브
    "두뇌 빙결": { id: "brain_freeze", name: "두뇌 빙결", type: "passive" },
    "손가락 서리": { id: "fingers_of_frost", name: "손가락 서리", type: "passive" },
    "얼음 조각": { id: "icicles", name: "얼음 조각", type: "passive" },
    "산산조각": { id: "shatter", name: "산산조각", type: "passive" },
    "한기": { id: "winters_chill", name: "한기", type: "passive" }
  },

  // PvP 특성
  pvp_talents: {
    // 공통 PvP 특성
    "검투사의 메달": { id: "gladiators_medallion", name: "검투사의 메달", type: "pvp_talent" },
    "끈기": { id: "relentless", name: "끈기", type: "pvp_talent" },
    "적응": { id: "adaptation", name: "적응", type: "pvp_talent" },

    // 마법사 전용 PvP 특성
    "시간의 대가": { id: "temporal_shield", name: "시간의 대가", type: "pvp_talent" },
    "그물 절단": { id: "netherwind_armor", name: "그물 절단", type: "pvp_talent" },
    "대량 폴리": { id: "mass_polymorph", name: "대량 폴리", type: "pvp_talent" },
    "겨울의 숨결": { id: "deep_freeze", name: "겨울의 숨결", type: "pvp_talent" },
    "불길한 마나": { id: "kleptomania", name: "불길한 마나", type: "pvp_talent" },
    "얼음 형태": { id: "ice_form_pvp", name: "얼음 형태", type: "pvp_talent" },
    "수련": { id: "dampened_magic", name: "수련", type: "pvp_talent" },
    "불기둥": { id: "flamecannon", name: "불기둥", type: "pvp_talent" },
    "시간 정지": { id: "time_anomaly", name: "시간 정지", type: "pvp_talent" },
    "고리 마법사": { id: "ring_master", name: "고리 마법사", type: "pvp_talent" },
    "집중된 힘": { id: "concentrated_power", name: "집중된 힘", type: "pvp_talent" },
    "마력 소모": { id: "arcane_empowerment", name: "마력 소모", type: "pvp_talent" },
    "활력 충전": { id: "energized", name: "활력 충전", type: "pvp_talent" }
  }
};

module.exports = mageSkills;