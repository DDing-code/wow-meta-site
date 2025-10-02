// 사제 스킬 데이터베이스
import { koreanTranslations } from '../koreanTranslations-11.2';

const priestTranslations = koreanTranslations.priestAbilities || {};

export const priestSkills = {
  // 공통 스킬 (모든 전문화 공유)
  common: {
    // 기본 공격 스킬
    "자동 공격": { id: "auto_attack", name: "자동 공격", type: "melee" },
    "성스러운 일격": { id: "holy_fire", name: "성스러운 일격", type: "ability" },
    "어둠의 권능: 고통": { id: "shadow_word_pain", name: "어둠의 권능: 고통", type: "dot" },
    "정신 이상": { id: "mind_blast", name: "정신 이상", type: "ability" },
    "정신 분쇄": { id: "mind_flay", name: "정신 분쇄", type: "channel" },
    "징벌": { id: "smite", name: "징벌", type: "ability" },

    // 치유 주문
    [priestTranslations.flashHeal]: {
      id: 2061,
      name: 'Flash Heal',
      type: 'heal',
      description: '빠른 단일 대상 치유 주문입니다.'
    },
    [priestTranslations.heal]: {
      id: 2060,
      name: 'Heal',
      type: 'heal',
      description: '기본적인 치유 주문입니다.'
    },
    [priestTranslations.renew]: {
      id: 139,
      name: 'Renew',
      type: 'hot',
      description: '시간에 걸쳐 체력을 지속적으로 회복시킵니다.'
    },
    [priestTranslations.powerWordShield]: {
      id: 17,
      name: 'Power Word: Shield',
      type: 'shield',
      description: '대상에게 보호막을 생성합니다.'
    },
    [priestTranslations.prayerOfHealing]: {
      id: 596,
      name: 'Prayer of Healing',
      type: 'group_heal',
      description: '그룹 멤버들을 동시에 치유합니다.'
    },
    [priestTranslations.powerWordRadiance]: {
      id: 194509,
      name: 'Power Word: Radiance',
      type: 'group_shield',
      description: '여러 대상에게 보호막과 치유를 제공합니다.'
    },

    // 유틸리티
    [priestTranslations.fade]: {
      id: 586,
      name: 'Fade',
      type: 'threat_reduction',
      cooldown: 30,
      description: '위협 수치를 감소시킵니다.'
    },
    [priestTranslations.powerWordFortitude]: {
      id: 21562,
      name: 'Power Word: Fortitude',
      type: 'buff',
      description: '대상의 체력과 정신력을 증가시킵니다.'
    },
    [priestTranslations.resurrection]: {
      id: 2006,
      name: 'Resurrection',
      type: 'resurrect',
      description: '죽은 대상을 되살립니다.'
    },
    [priestTranslations.massResurrection]: {
      id: 212036,
      name: 'Mass Resurrection',
      type: 'mass_resurrect',
      description: '여러 대상을 동시에 되살립니다.'
    },
    [priestTranslations.mindControl]: {
      id: 605,
      name: 'Mind Control',
      type: 'cc',
      description: '대상을 제어하여 아군으로 만듭니다.'
    },
    [priestTranslations.psychicScream]: {
      id: 8122,
      name: 'Psychic Scream',
      type: 'fear',
      cooldown: 30,
      description: '주변 적들을 공포에 빠뜨립니다.'
    },
    [priestTranslations.dispelMagic]: {
      id: 528,
      name: 'Dispel Magic',
      type: 'dispel',
      description: '마법 효과를 해제합니다.'
    },
    [priestTranslations.massDispel]: {
      id: 32375,
      name: 'Mass Dispel',
      type: 'mass_dispel',
      cooldown: 45,
      description: '광역의 마법 효과를 해제합니다.'
    },
    [priestTranslations.purify]: {
      id: 527,
      name: 'Purify',
      type: 'dispel',
      cooldown: 8,
      description: '질병과 독 효과를 제거합니다.'
    },
    "병자 치료": { id: "purify_disease", name: "병자 치료", type: "dispel" },

    // 이동기 및 방어
    "천사의 깃털": { id: "angelic_feather", name: "천사의 깃털", type: "movement" },
    "환영술": { id: "desperate_prayer", name: "환영술", type: "self_heal" },
    "그림자 치유": { id: "shadow_mend", name: "그림자 치유", type: "heal" },
    "공허 이동": { id: "void_shift", name: "공허 이동", type: "utility" },
    "도약의 믿음": { id: "leap_of_faith", name: "도약의 믿음", type: "utility" },

    // 정신 관련
    "정신의 눈": { id: "mind_vision", name: "정신의 눈", type: "utility" },
    "정신 감화": { id: "mind_soothe", name: "정신 감화", type: "threat_reduction" },
    "영혼의 절규": { id: "shadowfiend", name: "영혼의 절규", type: "summon" }
  },

  // 수양 전문화
  discipline: {
    // 핵심 능력
    "속죄": { id: "atonement", name: "속죄", type: "passive" },
    "고해": { id: "penance", name: "고해", type: "channel" },
    "광휘의 보호막": { id: "luminous_barrier", name: "광휘의 보호막", type: "barrier" },
    "천상의 찬가": { id: "divine_star", name: "천상의 찬가", type: "ability" },
    "후광": { id: "halo", name: "후광", type: "ability" },
    "환희": { id: "rapture", name: "환희", type: "cooldown" },
    "고통 억제": { id: "pain_suppression", name: "고통 억제", type: "external" },
    "신의 권능: 방벽": { id: "power_word_barrier", name: "신의 권능: 방벽", type: "major_cooldown" },

    // 특성
    "의지 굴절": { id: "twist_of_fate", name: "의지 굴절", type: "talent" },
    "분열": { id: "schism", name: "분열", type: "talent" },
    "평온": { id: "power_word_solace", name: "평온", type: "talent" },
    "신의 은총": { id: "grace", name: "신의 은총", type: "talent" },
    "복음 전파": { id: "evangelism", name: "복음 전파", type: "talent" },
    "빛의 권능": { id: "lights_promise", name: "빛의 권능", type: "talent" },
    "그림자 서약": { id: "shadow_covenant", name: "그림자 서약", type: "talent" },
    "정화의 불길": { id: "purge_the_wicked", name: "정화의 불길", type: "talent" },
    "어둠의 대천사": { id: "dark_archangel", name: "어둠의 대천사", type: "talent" },
    "빛나는 빛": { id: "bright_pupil", name: "빛나는 빛", type: "talent" },
    "잔혹한 처벌": { id: "harsh_discipline", name: "잔혹한 처벌", type: "talent" },
    "균형의 그림자": { id: "twilight_equilibrium", name: "균형의 그림자", type: "talent" },

    // 패시브
    "수양의 대가": { id: "mastery_absolution", name: "수양의 대가", type: "passive" },
    "빛과 그림자": { id: "light_and_shadow", name: "빛과 그림자", type: "passive" },
    "순간의 깨달음": { id: "borrowed_time", name: "순간의 깨달음", type: "passive" },
    "신의 섭리": { id: "divine_providence", name: "신의 섭리", type: "passive" }
  },

  // 신성 전문화
  holy: {
    // 핵심 능력
    "치유의 마법진": { id: "holy_word_sanctify", name: "치유의 마법진", type: "instant_heal" },
    "평온": { id: "holy_word_serenity", name: "평온", type: "instant_heal" },
    "구원": { id: "holy_word_salvation", name: "구원", type: "major_cooldown" },
    "성스러운 불꽃": { id: "holy_fire", name: "성스러운 불꽃", type: "ability" },
    "치유의 권능": { id: "prayer_of_mending", name: "치유의 권능", type: "bounce_heal" },
    "수호 영혼": { id: "guardian_spirit", name: "수호 영혼", type: "external" },
    "신성한 찬가": { id: "divine_hymn", name: "신성한 찬가", type: "channel" },
    "빛의 샘": { id: "lightwell", name: "빛의 샘", type: "summon" },
    "희망의 상징": { id: "symbol_of_hope", name: "희망의 상징", type: "raid_cooldown" },

    // 특성
    "천상의 별": { id: "divine_star_holy", name: "천상의 별", type: "talent" },
    "치유의 고리": { id: "circle_of_healing", name: "치유의 고리", type: "talent" },
    "빛의 권능": { id: "apotheosis", name: "빛의 권능", type: "talent" },
    "빛나는 불꽃": { id: "empowered_renew", name: "빛나는 불꽃", type: "talent" },
    "신의 계시": { id: "divine_word", name: "신의 계시", type: "talent" },
    "신성한 보호": { id: "holy_ward", name: "신성한 보호", type: "talent" },
    "성스러운 화염": { id: "burning_vows", name: "성스러운 화염", type: "talent" },
    "빛의 메아리": { id: "resonant_words", name: "빛의 메아리", type: "talent" },
    "치유의 합창": { id: "harmonious_apparatus", name: "치유의 합창", type: "talent" },
    "구원의 기도": { id: "answered_prayers", name: "구원의 기도", type: "talent" },
    "천사의 자비": { id: "angelic_mercy", name: "천사의 자비", type: "talent" },

    // 패시브
    "성스러운 말씀": { id: "holy_words", name: "성스러운 말씀", type: "passive" },
    "평온의 메아리": { id: "echo_of_light", name: "평온의 메아리", type: "passive" },
    "빛의 영혼": { id: "spirit_of_redemption", name: "빛의 영혼", type: "passive" },
    "성스러운 집중": { id: "focused_will", name: "성스러운 집중", type: "passive" },
    "축복받은 치유": { id: "blessed_healing", name: "축복받은 치유", type: "passive" }
  },

  // 암흑 전문화
  shadow: {
    // 핵심 능력
    "흡혈의 손길": { id: "vampiric_touch", name: "흡혈의 손길", type: "dot" },
    "정신의 채찍": { id: "mind_sear", name: "정신의 채찍", type: "aoe" },
    "어둠의 형상": { id: "shadowform", name: "어둠의 형상", type: "form" },
    "공허 폭발": { id: "void_eruption", name: "공허 폭발", type: "transformation" },
    "공허의 형상": { id: "voidform", name: "공허의 형상", type: "form" },
    "공허의 화살": { id: "void_bolt", name: "공허의 화살", type: "ability" },
    "정신 분열": { id: "mind_spike", name: "정신 분열", type: "ability" },
    "파멸의 역병": { id: "devouring_plague", name: "파멸의 역병", type: "dot" },
    "어둠의 권능: 죽음": { id: "shadow_word_death", name: "어둠의 권능: 죽음", type: "execute" },
    "침묵": { id: "silence", name: "침묵", type: "interrupt" },

    // 쿨다운
    "정신의 마귀": { id: "mindbender", name: "정신의 마귀", type: "summon" },
    "공허의 격류": { id: "void_torrent", name: "공허의 격류", type: "channel" },
    "어둠의 승천": { id: "dark_ascension", name: "어둠의 승천", type: "cooldown" },
    "정신의 붕괴": { id: "psychic_horror", name: "정신의 붕괴", type: "stun" },
    "어둠의 권능: 공허": { id: "power_word_void", name: "어둠의 권능: 공허", type: "major_cooldown" },

    // 특성
    "비참": { id: "misery", name: "비참", type: "talent" },
    "공허의 격론": { id: "void_eruption_talent", name: "공허의 격론", type: "talent" },
    "마음의 요새": { id: "fortress_of_the_mind", name: "마음의 요새", type: "talent" },
    "비뚤어진 운명": { id: "unfurling_darkness", name: "비뚤어진 운명", type: "talent" },
    "정신의 폭탄": { id: "psychic_link", name: "정신의 폭탄", type: "talent" },
    "광기의 유산": { id: "legacy_of_the_void", name: "광기의 유산", type: "talent" },
    "공허의 무리": { id: "hungering_void", name: "공허의 무리", type: "talent" },
    "항복": { id: "surrender_to_madness", name: "항복", type: "talent" },
    "고대 광기": { id: "ancient_madness", name: "고대 광기", type: "talent" },
    "뒤틀린 운명": { id: "twist_of_fate_shadow", name: "뒤틀린 운명", type: "talent" },
    "어둠의 통찰": { id: "shadowy_insight", name: "어둠의 통찰", type: "talent" },

    // 패시브
    "광기": { id: "insanity", name: "광기", type: "resource" },
    "그림자 엮기": { id: "shadowweaving", name: "그림자 엮기", type: "passive" },
    "공허의 영향력": { id: "void_empowerment", name: "공허의 영향력", type: "passive" },
    "어둠의 통찰력": { id: "dark_thoughts", name: "어둠의 통찰력", type: "passive" },
    "뒤틀린 그림자": { id: "twisted_shadows", name: "뒤틀린 그림자", type: "passive" }
  },

  // PvP 특성
  pvp_talents: {
    // 공통 PvP 특성
    "검투사의 메달": { id: "gladiators_medallion", name: "검투사의 메달", type: "pvp_talent" },
    "끈기": { id: "relentless", name: "끈기", type: "pvp_talent" },
    "적응": { id: "adaptation", name: "적응", type: "pvp_talent" },

    // 사제 전용 PvP 특성
    "대천사": { id: "archangel", name: "대천사", type: "pvp_talent" },
    "빛의 축복": { id: "blessed_recovery", name: "빛의 축복", type: "pvp_talent" },
    "다크 대천사": { id: "dark_archangel_pvp", name: "다크 대천사", type: "pvp_talent" },
    "내면의 빛": { id: "inner_light", name: "내면의 빛", type: "pvp_talent" },
    "빛의 대가": { id: "ultimate_radiance", name: "빛의 대가", type: "pvp_talent" },
    "트리니티": { id: "trinity", name: "트리니티", type: "pvp_talent" },
    "사고 도둑": { id: "thoughtsteal", name: "사고 도둑", type: "pvp_talent" },
    "공허 변이": { id: "void_shift_pvp", name: "공허 변이", type: "pvp_talent" },
    "정신 충격": { id: "psychic_voice", name: "정신 충격", type: "pvp_talent" },
    "광선 치유": { id: "ray_of_hope", name: "광선 치유", type: "pvp_talent" },
    "더 큰 치유": { id: "greater_heal", name: "더 큰 치유", type: "pvp_talent" },
    "치유의 집중": { id: "focused_will_pvp", name: "치유의 집중", type: "pvp_talent" },
    "신성한 보호": { id: "holy_ward_pvp", name: "신성한 보호", type: "pvp_talent" },
    "정신 게임": { id: "mindgames", name: "정신 게임", type: "pvp_talent" }
  }
};

export default priestSkills;