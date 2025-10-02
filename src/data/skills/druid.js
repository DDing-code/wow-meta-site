// 드루이드 (Druid) 스킬 데이터베이스
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)
// 최신 한국어 번역 적용

import { koreanTranslations } from '../koreanTranslations-11.2';

const druidTranslations = koreanTranslations.druidAbilities;

export const druidSkills = {
  className: koreanTranslations.classes.druid,
  classNameEn: 'Druid',
  // 공통 스킬 (모든 전문화 공유)
  common: {
    // 기본 공격 스킬
    [druidTranslations.autoAttack]: {
      id: 6603,
      name: 'Auto Attack',
      type: 'melee',
      description: '기본 근접 공격입니다.'
    },
    [druidTranslations.moonfire]: {
      id: 8921,
      name: 'Moonfire',
      type: 'dot',
      description: '달빛 에너지로 지속 피해를 입힙니다.'
    },
    [druidTranslations.sunfire]: {
      id: 93402,
      name: 'Sunfire',
      type: 'dot',
      description: '태양 에너지로 지속 피해를 입힙니다.'
    },
    [druidTranslations.wrath]: {
      id: 5176,
      name: 'Wrath',
      type: 'cast',
      description: '자연의 분노로 적을 공격합니다.'
    },
    [druidTranslations.starfire]: {
      id: 2912,
      name: 'Starfire',
      type: 'cast',
      description: '별빛 에너지로 강력한 공격을 가합니다.'
    },
    [druidTranslations.regrowth]: {
      id: 8936,
      name: 'Regrowth',
      type: 'heal',
      description: '즉시 칙유와 지속 칙유를 제공합니다.'
    },
    [druidTranslations.rejuvenation]: {
      id: 774,
      name: 'Rejuvenation',
      type: 'hot',
      description: '시간에 걸쳐 체력을 지속적으로 회복시킵니다.'
    },

    // 변신
    "곰 변신": { id: "bear_form", name: "곰 변신", type: "form" },
    "표범 변신": { id: "cat_form", name: "표범 변신", type: "form" },
    "달빛야수 변신": { id: "moonkin_form", name: "달빛야수 변신", type: "form" },
    "나무 변신": { id: "tree_of_life", name: "나무 변신", type: "form" },
    "여행 변신": { id: "travel_form", name: "여행 변신", type: "form" },
    "바다사자 변신": { id: "aquatic_form", name: "바다사자 변신", type: "form" },
    "비행 변신": { id: "flight_form", name: "비행 변신", type: "form" },

    // 유틸리티
    "나무껍질": { id: "barkskin", name: "나무껍질", type: "defensive" },
    "얽어매기": { id: "entangling_roots", name: "얽어매기", type: "root" },
    "최대 절전": { id: "hibernate", name: "최대 절전", type: "cc" },
    "환생": { id: "rebirth", name: "환생", type: "battle_res" },
    "부활": { id: "revive", name: "부활", type: "resurrect" },
    "대규모 얽어매기": { id: "mass_entanglement", name: "대규모 얽어매기", type: "root" },
    "자연의 치유력": { id: "remove_corruption", name: "자연의 치유력", type: "dispel" },
    "숲의 원혼": { id: "shadowmeld", name: "숲의 원혼", type: "stealth" },

    // 기타
    "야생의 징표": { id: "mark_of_the_wild", name: "야생의 징표", type: "buff" },
    "순간이동: 달숲": { id: "teleport_moonglade", name: "순간이동: 달숲", type: "teleport" },
    "야생의 돌진": { id: "wild_charge", name: "야생의 돌진", type: "movement" },
    "맹렬한 포효": { id: "stampeding_roar", name: "맹렬한 포효", type: "group_movement" },
    "태풍": { id: "typhoon", name: "태풍", type: "knockback" },
    "우르솔의 회오리": { id: "ursols_vortex", name: "우르솔의 회오리", type: "slow" },

    // 격려
    "천상의 정렬": { id: "celestial_alignment", name: "천상의 정렬", type: "cooldown" },
    "영혼 소집": { id: "convoke_the_spirits", name: "영혼 소집", type: "channel" }
  },

  // 조화 전문화
  balance: {
    // 핵심 능력
    "별빛쇄도": { id: "starfall", name: "별빛쇄도", type: "aoe" },
    "별빛분출": { id: "starsurge", name: "별빛분출", type: "spender" },
    "화신: 엘룬의 선택": { id: "incarnation_chosen_of_elune", name: "화신: 엘룬의 선택", type: "major_cooldown" },
    "천상의 정렬": { id: "celestial_alignment_balance", name: "천상의 정렬", type: "major_cooldown" },
    "별의 군주": { id: "fury_of_elune", name: "별의 군주", type: "ability" },
    "달의 불꽃": { id: "lunar_beam", name: "달의 불꽃", type: "aoe" },
    "새로운 달": { id: "new_moon", name: "새로운 달", type: "ability" },
    "반달": { id: "half_moon", name: "반달", type: "ability" },
    "보름달": { id: "full_moon", name: "보름달", type: "ability" },
    "천체의 드리프트": { id: "stellar_drift", name: "천체의 드리프트", type: "ability" },

    // 특성
    "자연의 균형": { id: "natures_balance", name: "자연의 균형", type: "talent" },
    "전사의 엘룬": { id: "warrior_of_elune", name: "전사의 엘룬", type: "talent" },
    "원시의 비전사": { id: "primordial_arcanic_pulsar", name: "원시의 비전사", type: "talent" },
    "별빛 플레어": { id: "stellar_flare", name: "별빛 플레어", type: "talent" },
    "쌍둥이 달": { id: "twin_moons", name: "쌍둥이 달", type: "talent" },
    "달의 정점": { id: "lunar_shrapnel", name: "달의 정점", type: "talent" },
    "고독한 별": { id: "solstice", name: "고독한 별", type: "talent" },
    "달빛 광란": { id: "lunar_frenzy", name: "달빛 광란", type: "talent" },
    "별의 파편": { id: "shooting_stars", name: "별의 파편", type: "talent" },
    "천체의 안내": { id: "astral_communion", name: "천체의 안내", type: "talent" },

    // 패시브
    "일월식": { id: "eclipse", name: "일월식", type: "passive" },
    "별빛흐름": { id: "starlight_wrath", name: "별빛흐름", type: "passive" },
    "천체 능력": { id: "astral_power", name: "천체 능력", type: "resource" },
    "달의 권능": { id: "lunar_empowerment", name: "달의 권능", type: "passive" },
    "태양의 권능": { id: "solar_empowerment", name: "태양의 권능", type: "passive" }
  },

  // 야성 전문화
  feral: {
    // 핵심 능력
    "갈퀴 발톱": { id: "rake", name: "갈퀴 발톱", type: "bleed" },
    "도려내기": { id: "rip", name: "도려내기", type: "bleed" },
    "난타": { id: "shred", name: "난타", type: "builder" },
    "흉포한 이빨": { id: "ferocious_bite", name: "흉포한 이빨", type: "finisher" },
    "도려가르기": { id: "maim", name: "도려가르기", type: "stun" },
    "맹수의 분노": { id: "berserk", name: "맹수의 분노", type: "major_cooldown" },
    "화신: 아샤메인의 왕": { id: "incarnation_king_of_the_jungle", name: "화신: 아샤메인의 왕", type: "major_cooldown" },
    "호랑이의 격노": { id: "tigers_fury", name: "호랑이의 격노", type: "buff" },
    "야생의 돌진": { id: "feral_charge", name: "야생의 돌진", type: "gap_closer" },
    "난폭한 강타": { id: "brutal_slash", name: "난폭한 강타", type: "ability" },
    "원시 분노": { id: "primal_wrath", name: "원시 분노", type: "aoe" },

    // 특성
    "피의 발톱": { id: "blood_talons", name: "피의 발톱", type: "talent" },
    "순간의 명료함": { id: "moment_of_clarity", name: "순간의 명료함", type: "talent" },
    "달의 불꽃": { id: "lunar_inspiration", name: "달의 불꽃", type: "talent" },
    "야생의 일격": { id: "wild_fleshrending", name: "야생의 일격", type: "talent" },
    "포식자": { id: "predator", name: "포식자", type: "talent" },
    "야생의 피": { id: "scent_of_blood", name: "야생의 피", type: "talent" },
    "피의 향기": { id: "bloodtalons", name: "피의 향기", type: "talent" },
    "야생의 충돌": { id: "savage_roar", name: "야생의 충돌", type: "talent" },
    "영혼의 숲": { id: "soul_of_the_forest", name: "영혼의 숲", type: "talent" },
    "피투성이 발톱": { id: "bloody_paws", name: "피투성이 발톱", type: "talent" },

    // 패시브
    "예리한 발톱": { id: "predatory_swiftness", name: "예리한 발톱", type: "passive" },
    "맹수의 본능": { id: "primal_fury", name: "맹수의 본능", type: "passive" },
    "콤보 포인트": { id: "combo_points", name: "콤보 포인트", type: "resource" },
    "감염 상처": { id: "infected_wounds", name: "감염 상처", type: "passive" },
    "출혈의 대가": { id: "mastery_razorclaws", name: "출혈의 대가", type: "passive" }
  },

  // 수호 전문화
  guardian: {
    // 핵심 능력
    "짓이기기": { id: "mangle", name: "짓이기기", type: "ability" },
    "난타": { id: "thrash_bear", name: "난타", type: "aoe" },
    "무쇠 가죽": { id: "ironfur", name: "무쇠 가죽", type: "defensive" },
    "광란": { id: "frenzied_regeneration", name: "광란", type: "self_heal" },
    "포효": { id: "growl", name: "포효", type: "taunt" },
    "쇠약의 포효": { id: "demoralizing_roar", name: "쇠약의 포효", type: "debuff" },
    "생존 본능": { id: "survival_instincts", name: "생존 본능", type: "defensive" },
    "화신: 우르속의 수호자": { id: "incarnation_guardian_of_ursoc", name: "화신: 우르속의 수호자", type: "major_cooldown" },
    "달빛 광선": { id: "lunar_beam", name: "달빛 광선", type: "ability" },
    "머리 박치기": { id: "skull_bash", name: "머리 박치기", type: "interrupt" },
    "갈래바람": { id: "bristling_fur", name: "갈래바람", type: "defensive" },

    // 특성
    "강력한 변형": { id: "brambles", name: "강력한 변형", type: "talent" },
    "피의 광란": { id: "blood_frenzy", name: "피의 광란", type: "talent" },
    "강력한 일격": { id: "pulverize", name: "강력한 일격", type: "talent" },
    "위협의 심장": { id: "heart_of_the_wild", name: "위협의 심장", type: "talent" },
    "은하의 수호자": { id: "galactic_guardian", name: "은하의 수호자", type: "talent" },
    "가시 모피": { id: "rend_and_tear", name: "가시 모피", type: "talent" },
    "달의 광선": { id: "tooth_and_claw", name: "달의 광선", type: "talent" },
    "얼스의 인내": { id: "earthwarden", name: "얼스의 인내", type: "talent" },
    "무쇠껍질": { id: "layered_mane", name: "무쇠껍질", type: "talent" },
    "피부 굳히기": { id: "reinforced_fur", name: "피부 굳히기", type: "talent" },

    // 패시브
    "굵은 가죽": { id: "thick_hide", name: "굵은 가죽", type: "passive" },
    "고통": { id: "gore", name: "고통", type: "passive" },
    "감염된 상처": { id: "infected_wounds_guard", name: "감염된 상처", type: "passive" },
    "번개 반사": { id: "lightning_reflexes", name: "번개 반사", type: "passive" },
    "자연의 수호자": { id: "mastery_natures_guardian", name: "자연의 수호자", type: "passive" }
  },

  // 회복 전문화
  restoration: {
    // 핵심 능력
    "신속한 치유": { id: "swiftmend", name: "신속한 치유", type: "instant_heal" },
    "피어나는 생명": { id: "lifebloom", name: "피어나는 생명", type: "hot" },
    "자연의 치유력": { id: "natures_cure", name: "자연의 치유력", type: "dispel" },
    "평온": { id: "tranquility", name: "평온", type: "raid_cooldown" },
    "무쇠껍질": { id: "ironbark", name: "무쇠껍질", type: "external" },
    "급속 성장": { id: "wild_growth", name: "급속 성장", type: "group_hot" },
    "풍요": { id: "flourish", name: "풍요", type: "ability" },
    "화신: 생명의 나무": { id: "incarnation_tree_of_life", name: "화신: 생명의 나무", type: "major_cooldown" },
    "세나리온 수호물": { id: "cenarion_ward", name: "세나리온 수호물", type: "hot" },
    "숲의 영혼": { id: "soul_of_the_forest_resto", name: "숲의 영혼", type: "passive" },

    // 특성
    "번영": { id: "abundance", name: "번영", type: "talent" },
    "씨앗": { id: "germination", name: "씨앗", type: "talent" },
    "성장": { id: "cultivation", name: "성장", type: "talent" },
    "내면의 평화": { id: "inner_peace", name: "내면의 평화", type: "talent" },
    "봄 꽃": { id: "spring_blossoms", name: "봄 꽃", type: "talent" },
    "광합성": { id: "photosynthesis", name: "광합성", type: "talent" },
    "수액의 활력": { id: "verdant_infusion", name: "수액의 활력", type: "talent" },
    "나무의 균형": { id: "balance_of_all_things", name: "나무의 균형", type: "talent" },
    "지속적인 성장": { id: "rampant_growth", name: "지속적인 성장", type: "talent" },
    "꽃핀 만다라": { id: "blossoming_mandala", name: "꽃핀 만다라", type: "talent" },

    // 패시브
    "선제의 일격": { id: "omen_of_clarity", name: "선제의 일격", type: "passive" },
    "청명의 무아지경": { id: "clearcasting", name: "청명의 무아지경", type: "passive" },
    "자연의 정수": { id: "living_seed", name: "자연의 정수", type: "passive" },
    "조화의 대가": { id: "mastery_harmony", name: "조화의 대가", type: "passive" },
    "자연 치유의 축복": { id: "natures_swiftness", name: "자연 치유의 축복", type: "passive" }
  },

  // PvP 특성
  pvp_talents: {
    // 공통 PvP 특성
    "검투사의 메달": { id: "gladiators_medallion", name: "검투사의 메달", type: "pvp_talent" },
    "끈기": { id: "relentless", name: "끈기", type: "pvp_talent" },
    "적응": { id: "adaptation", name: "적응", type: "pvp_talent" },

    // 드루이드 전용 PvP 특성
    "가시": { id: "thorns", name: "가시", type: "pvp_talent" },
    "야수의 소환": { id: "leader_of_the_pack", name: "야수의 소환", type: "pvp_talent" },
    "치명적인 단서": { id: "malorne_swiftness", name: "치명적인 단서", type: "pvp_talent" },
    "깊은 뿌리": { id: "deep_roots", name: "깊은 뿌리", type: "pvp_talent" },
    "원시 맹공": { id: "ferocious_wound", name: "원시 맹공", type: "pvp_talent" },
    "고결한 영혼": { id: "high_winds", name: "고결한 영혼", type: "pvp_talent" },
    "숲의 치유": { id: "focused_growth", name: "숲의 치유", type: "pvp_talent" },
    "생명의 힘": { id: "lifeforce", name: "생명의 힘", type: "pvp_talent" },
    "덩굴 벽": { id: "entangling_bark", name: "덩굴 벽", type: "pvp_talent" },
    "야생의 공격성": { id: "savage_momentum", name: "야생의 공격성", type: "pvp_talent" },
    "천체의 주문 수호자": { id: "celestial_guardian", name: "천체의 주문 수호자", type: "pvp_talent" },
    "곰의 포옹": { id: "den_mother", name: "곰의 포옹", type: "pvp_talent" },
    "파멸의 서클": { id: "circle_of_life", name: "파멸의 서클", type: "pvp_talent" }
  }
};

module.exports = druidSkills;