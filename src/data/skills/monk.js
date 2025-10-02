// 수도사 (Monk) 스킬 데이터베이스
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)
// 최신 한국어 번역 적용

import { koreanTranslations } from '../koreanTranslations-11.2';

const monkTranslations = koreanTranslations.monkAbilities;

export const monkSkills = {
  className: koreanTranslations.classes.monk,
  classNameEn: 'Monk',
  // 공통 스킬 (모든 전문화 공유)
  common: {
    // 기본 공격 스킬
    [monkTranslations.autoAttack]: {
      id: 6603,
      name: 'Auto Attack',
      type: 'melee',
      description: '기본 근접 공격입니다.'
    },
    [monkTranslations.tigerPalm]: {
      id: 100780,
      name: 'Tiger Palm',
      type: 'ability',
      description: '기를 생성하는 기본 공격입니다.'
    },
    [monkTranslations.blackoutKick]: {
      id: 100784,
      name: 'Blackout Kick',
      type: 'ability',
      description: '기를 소모하여 강력한 발차기를 가합니다.'
    },
    [monkTranslations.spinningCraneKick]: {
      id: 101546,
      name: 'Spinning Crane Kick',
      type: 'aoe',
      description: '주변 적들에게 회전 공격을 가합니다.'
    },
    [monkTranslations.risingSunKick]: {
      id: 107428,
      name: 'Rising Sun Kick',
      type: 'ability',
      description: '상승 발차기로 대상을 공격합니다.'
    },
    [monkTranslations.cracklingJadeLightning]: {
      id: 117952,
      name: 'Crackling Jade Lightning',
      type: 'channel',
      description: '비취 번개로 지속 공격합니다.'
    },

    // 이동기
    "구르기": { id: "roll", name: "구르기", type: "movement" },
    "기의 어지러움": { id: "chi_torpedo", name: "기의 어지러움", type: "movement" },
    "호랑이의 욕망": { id: "tigers_lust", name: "호랑이의 욕망", type: "movement" },
    "비상 격월": { id: "flying_serpent_kick", name: "비상 격월", type: "movement" },
    "초월": { id: "transcendence", name: "초월", type: "teleport" },
    "초월: 전송": { id: "transcendence_transfer", name: "초월: 전송", type: "teleport" },

    // 방어 기술
    "기공탄": { id: "expel_harm", name: "기공탄", type: "self_heal" },
    "생명고리": { id: "touch_of_death", name: "생명고리", type: "execute" },
    "강화주": { id: "fortifying_brew", name: "강화주", type: "defensive" },
    "해악 감퇴": { id: "dampen_harm", name: "해악 감퇴", type: "defensive" },
    "확산의 마법": { id: "diffuse_magic", name: "확산의 마법", type: "defensive" },
    "업보의 손아귀": { id: "touch_of_karma", name: "업보의 손아귀", type: "defensive" },

    // 유틸리티
    "마비": { id: "paralysis", name: "마비", type: "cc" },
    "다리 후려치기": { id: "leg_sweep", name: "다리 후려치기", type: "stun" },
    "분산의 차기": { id: "spear_hand_strike", name: "분산의 차기", type: "interrupt" },
    "해독": { id: "detox", name: "해독", type: "dispel" },
    "소생의 안개": { id: "resuscitate", name: "소생의 안개", type: "resurrect" },
    "신비한 손길": { id: "mystic_touch", name: "신비한 손길", type: "debuff" },
    "평화의 고리": { id: "ring_of_peace", name: "평화의 고리", type: "utility" },
    "기원의 치타": { id: "provoke", name: "기원의 치타", type: "taunt" },

    // 기 관련
    "기 폭발": { id: "chi_burst", name: "기 폭발", type: "ability" },
    "기 파동": { id: "chi_wave", name: "기 파동", type: "ability" }
  },

  // 양조 전문화 (탱커)
  brewmaster: {
    // 핵심 능력
    "술 안개": { id: "keg_smash", name: "술 안개", type: "ability" },
    "맥주통 던지기": { id: "breath_of_fire", name: "맥주통 던지기", type: "cone" },
    "시간차": { id: "stagger", name: "시간차", type: "passive" },
    "정화주": { id: "purifying_brew", name: "정화주", type: "defensive" },
    "천신주": { id: "celestial_brew", name: "천신주", type: "defensive" },
    "흑우주": { id: "blackout_brew", name: "흑우주", type: "buff" },
    "선풍각": { id: "rushing_jade_wind", name: "선풍각", type: "aoe" },
    "취권무": { id: "invoke_niuzao", name: "취권무", type: "summon" },
    "무쇠 가죽": { id: "ironskin_brew", name: "무쇠 가죽", type: "defensive" },
    "대취타": { id: "exploding_keg", name: "대취타", type: "ability" },

    // 특성
    "검은 황소주": { id: "black_ox_brew", name: "검은 황소주", type: "talent" },
    "빛의 양조": { id: "light_brewing", name: "빛의 양조", type: "talent" },
    "특별 배달": { id: "special_delivery", name: "특별 배달", type: "talent" },
    "타는 돌진": { id: "charging_ox_wave", name: "타는 돌진", type: "talent" },
    "황소 돌진": { id: "ox_charge", name: "황소 돌진", type: "talent" },
    "용광로의 숨결": { id: "blackout_combo", name: "용광로의 숨결", type: "talent" },
    "위험 예측": { id: "high_tolerance", name: "위험 예측", type: "talent" },
    "밥과 짜장": { id: "bob_and_weave", name: "밥과 짜장", type: "talent" },
    "천상의 불꽃": { id: "celestial_flames", name: "천상의 불꽃", type: "talent" },
    "정화의 차": { id: "improved_purifying_brew", name: "정화의 차", type: "talent" },

    // 패시브
    "선물의 황소": { id: "gift_of_the_ox", name: "선물의 황소", type: "passive" },
    "음조 세팅": { id: "shuffle", name: "음조 세팅", type: "passive" },
    "엘루시브 브롤러": { id: "elusive_brawler", name: "엘루시브 브롤러", type: "passive" },
    "양조 대가": { id: "brewmasters_balance", name: "양조 대가", type: "passive" },
    "천상의 행운": { id: "celestial_fortune", name: "천상의 행운", type: "passive" }
  },

  // 운무 전문화 (힐러)
  mistweaver: {
    // 핵심 능력
    "포용의 안개": { id: "enveloping_mist", name: "포용의 안개", type: "heal" },
    "생기의 안개": { id: "vivify", name: "생기의 안개", type: "heal" },
    "기의 고치": { id: "life_cocoon", name: "기의 고치", type: "external" },
    "재활": { id: "renewing_mist", name: "재활", type: "hot" },
    "소생의 안개": { id: "revival", name: "소생의 안개", type: "raid_cooldown" },
    "정수의 샘": { id: "essence_font", name: "정수의 샘", type: "aoe_heal" },
    "기원": { id: "soothing_mist", name: "기원", type: "channel" },
    "천둥 집중차": { id: "thunder_focus_tea", name: "천둥 집중차", type: "buff" },
    "위쉬엔": { id: "invoke_yulon", name: "위쉬엔", type: "summon" },
    "집중된 천둥": { id: "focused_thunder", name: "집중된 천둥", type: "ability" },
    "활력차": { id: "mana_tea", name: "활력차", type: "resource" },

    // 특성
    "기 합류": { id: "chi_ji", name: "기 합류", type: "talent" },
    "옥룡상": { id: "jade_serpent_statue", name: "옥룡상", type: "talent" },
    "기원의 연무": { id: "mist_wrap", name: "기원의 연무", type: "talent" },
    "상승하는 안개": { id: "rising_mist", name: "상승하는 안개", type: "talent" },
    "치유의 비약": { id: "healing_elixir", name: "치유의 비약", type: "talent" },
    "정신 집중": { id: "spirit_of_the_crane", name: "정신 집중", type: "talent" },
    "상승": { id: "upwelling", name: "상승", type: "talent" },
    "소생의 소용돌이": { id: "refreshing_jade_wind", name: "소생의 소용돌이", type: "talent" },
    "평온한 기": { id: "invoke_chi_ji", name: "평온한 기", type: "talent" },
    "치유의 안개": { id: "ancient_mistweaver_arts", name: "치유의 안개", type: "talent" },

    // 패시브
    "신비한 손길": { id: "teachings_of_the_monastery", name: "신비한 손길", type: "passive" },
    "여운": { id: "echo_of_yulon", name: "여운", type: "passive" },
    "구름의 대가": { id: "mastery_gust_of_mists", name: "구름의 대가", type: "passive" },
    "영혼 보초": { id: "spirit_of_the_mists", name: "영혼 보초", type: "passive" },
    "유연한 발차기": { id: "ancient_teachings", name: "유연한 발차기", type: "passive" }
  },

  // 풍운 전문화 (근접 딜러)
  windwalker: {
    // 핵심 능력
    "분노의 주먹": { id: "fists_of_fury", name: "분노의 주먹", type: "channel" },
    "폭풍과 대지와 불": { id: "storm_earth_and_fire", name: "폭풍과 대지와 불", type: "major_cooldown" },
    "백호 쉬엔": { id: "invoke_xuen", name: "백호 쉬엔", type: "summon" },
    "후려차기": { id: "whirling_dragon_punch", name: "후려차기", type: "ability" },
    "쉬엔의 무기": { id: "weapons_of_order", name: "쉬엔의 무기", type: "buff" },
    "업보의 손길": { id: "touch_of_karma_ww", name: "업보의 손길", type: "defensive" },
    "진각": { id: "serenity", name: "진각", type: "cooldown" },
    "연속 타격": { id: "strike_of_the_windlord", name: "연속 타격", type: "ability" },
    "기의 파동": { id: "chi_wave_ww", name: "기의 파동", type: "ability" },
    "분쇄의 주먹": { id: "fist_of_the_white_tiger", name: "분쇄의 주먹", type: "ability" },

    // 특성
    "기의 궤도": { id: "chi_orbit", name: "기의 궤도", type: "talent" },
    "인내의 눈": { id: "eye_of_the_tiger", name: "인내의 눈", type: "talent" },
    "승천 펀치": { id: "ascension", name: "승천 펀치", type: "talent" },
    "폭발 기": { id: "energizing_elixir", name: "폭발 기", type: "talent" },
    "내면의 힘": { id: "inner_strength", name: "내면의 힘", type: "talent" },
    "댄스 오브 칠": { id: "dance_of_chiji", name: "댄스 오브 칠", type: "talent" },
    "영적 집중": { id: "spiritual_focus", name: "영적 집중", type: "talent" },
    "히트 콤보": { id: "hit_combo", name: "히트 콤보", type: "talent" },
    "도발의 주먹": { id: "invoke_xuen_talent", name: "도발의 주먹", type: "talent" },
    "파괴의 질주": { id: "rushing_tiger_palm", name: "파괴의 질주", type: "talent" },

    // 패시브
    "콤보 타격": { id: "combo_strikes", name: "콤보 타격", type: "passive" },
    "바람걷기": { id: "windwalking", name: "바람걷기", type: "passive" },
    "콤보 브레이커": { id: "combo_breaker", name: "콤보 브레이커", type: "passive" },
    "사이클론 킥": { id: "cyclone_strikes", name: "사이클론 킥", type: "passive" },
    "연속 공격의 대가": { id: "mastery_combo_strikes", name: "연속 공격의 대가", type: "passive" }
  },

  // PvP 특성
  pvp_talents: {
    // 공통 PvP 특성
    "검투사의 메달": { id: "gladiators_medallion", name: "검투사의 메달", type: "pvp_talent" },
    "끈기": { id: "relentless", name: "끈기", type: "pvp_talent" },
    "적응": { id: "adaptation", name: "적응", type: "pvp_talent" },

    // 수도사 전용 PvP 특성
    "기의 보호막": { id: "dome_of_mist", name: "기의 보호막", type: "pvp_talent" },
    "역마비": { id: "reverse_harm", name: "역마비", type: "pvp_talent" },
    "거세 바람": { id: "grapple_weapon", name: "거세 바람", type: "pvp_talent" },
    "유연한 환영": { id: "alpha_tiger", name: "유연한 환영", type: "pvp_talent" },
    "바람 목걸이": { id: "wind_waker", name: "바람 목걸이", type: "pvp_talent" },
    "권법의 대가": { id: "turbo_fists", name: "권법의 대가", type: "pvp_talent" },
    "비무의 상처": { id: "pressure_points", name: "비무의 상처", type: "pvp_talent" },
    "평온": { id: "zen_moment", name: "평온", type: "pvp_talent" },
    "치명적 집중": { id: "deadly_focus", name: "치명적 집중", type: "pvp_talent" },
    "치타의 속도": { id: "tigereye_brew", name: "치타의 속도", type: "pvp_talent" },
    "양조의 대가": { id: "microbrew", name: "양조의 대가", type: "pvp_talent" },
    "강력한 차": { id: "mighty_ox_kick", name: "강력한 차", type: "pvp_talent" },
    "해독 활력": { id: "detox_healing", name: "해독 활력", type: "pvp_talent" }
  }
};

module.exports = monkSkills;