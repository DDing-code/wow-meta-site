// 악마사냥꾼 (Demon Hunter) 스킬 데이터베이스
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)
// 최신 한국어 번역 적용

import { koreanTranslations } from '../koreanTranslations-11.2';

const demonhunterTranslations = koreanTranslations.demonhunterAbilities;

export const demonhunterSkills = {
  className: koreanTranslations.classes.demonhunter,
  classNameEn: 'Demon Hunter',
  // 공통 스킬 (모든 전문화 공유)
  common: {
    // 기본 공격 스킬
    [demonhunterTranslations.autoAttack]: {
      id: 6603,
      name: 'Auto Attack',
      type: 'melee',
      description: '기본 근접 공격입니다.'
    },
    [demonhunterTranslations.demonsBite]: {
      id: 162243,
      name: "Demon's Bite",
      type: 'builder',
      description: '분노를 생성하는 기본 공격입니다.'
    },
    [demonhunterTranslations.chaosStrike]: {
      id: 162794,
      name: 'Chaos Strike',
      type: 'spender',
      description: '분노를 소모하여 강력한 공격을 가합니다.'
    },
    [demonhunterTranslations.felRush]: {
      id: 195072,
      name: 'Fel Rush',
      type: 'movement',
      cooldown: 10,
      description: '악마 에너지로 빠르게 돌진합니다.'
    },
    [demonhunterTranslations.demonHunter]: {
      id: 203782,
      name: 'Demon Hunter',
      type: 'passive',
      description: '악마에 대한 특별한 능력을 얻습니다.'
    },
    [demonhunterTranslations.throwGlaive]: {
      id: 185123,
      name: 'Throw Glaive',
      type: 'ranged',
      cooldown: 9,
      description: '칼날을 던져 원거리 공격을 가합니다.'
    },
    [demonhunterTranslations.shear]: {
      id: 203782,
      name: 'Shear',
      type: 'builder',
      description: '고통를 생성하는 공격입니다.'
    },

    // 변신 및 쿨다운
    "탈태": { id: "metamorphosis", name: "탈태", type: "major_cooldown" },
    "광란": { id: "chaos_nova", name: "광란", type: "stun" },
    "감금": { id: "imprison", name: "감금", type: "cc" },
    "마법 삼키기": { id: "consume_magic", name: "마법 삼키기", type: "dispel" },
    "분열": { id: "disrupt", name: "분열", type: "interrupt" },

    // 방어 기술
    "어둠의 휘장": { id: "darkness", name: "어둠의 휘장", type: "defensive" },
    "흐릿해짐": { id: "blur", name: "흐릿해짐", type: "defensive" },
    "악마 보호막": { id: "demon_spikes", name: "악마 보호막", type: "defensive" },
    "악마의 결계": { id: "demonic_wards", name: "악마의 결계", type: "passive" },

    // 이동기
    "복수의 질주": { id: "vengeful_retreat", name: "복수의 질주", type: "movement" },
    "활공": { id: "glide", name: "활공", type: "movement" },
    "이중 도약": { id: "double_jump", name: "이중 도약", type: "movement" },

    // 유틸리티
    "영혼 분쇄": { id: "soul_rending", name: "영혼 분쇄", type: "passive" },
    "영혼 파편": { id: "soul_fragments", name: "영혼 파편", type: "resource" },
    "관찰의 눈": { id: "spectral_sight", name: "관찰의 눈", type: "utility" },
    "도발": { id: "torment", name: "도발", type: "taunt" }
  },

  // 파멸 전문화 (근접 딜러)
  havoc: {
    // 핵심 능력
    "칼날 춤": { id: "blade_dance", name: "칼날 춤", type: "ability" },
    "죽음의 소용돌이": { id: "death_sweep", name: "죽음의 소용돌이", type: "ability" },
    "안광": { id: "eye_beam", name: "안광", type: "channel" },
    "파멸의 격노": { id: "chaos_blades", name: "파멸의 격노", type: "cooldown" },
    "지옥 돌진": { id: "fel_barrage", name: "지옥 돌진", type: "channel" },
    "소멸": { id: "annihilation", name: "소멸", type: "spender" },
    "불꽃의 인장": { id: "immolation_aura", name: "불꽃의 인장", type: "ability" },
    "본질 절단": { id: "essence_break", name: "본질 절단", type: "debuff" },
    "악마의 웅덩이": { id: "glaive_tempest", name: "악마의 웅덩이", type: "ability" },
    "엘리다스의 분노": { id: "elysian_decree", name: "엘리다스의 분노", type: "ability" },

    // 특성
    "실명": { id: "blind_fury", name: "실명", type: "talent" },
    "악마의 욕구": { id: "demonic_appetite", name: "악마의 욕구", type: "talent" },
    "준비된 자세": { id: "unbound_chaos", name: "준비된 자세", type: "talent" },
    "끓는 상표": { id: "burning_hatred", name: "끓는 상표", type: "talent" },
    "격렬한 속도": { id: "insatiable_hunger", name: "격렬한 속도", type: "talent" },
    "악마의 존재": { id: "demonic", name: "악마의 존재", type: "talent" },
    "최초의 피": { id: "first_blood", name: "최초의 피", type: "talent" },
    "진정한 일격": { id: "cycle_of_hatred", name: "진정한 일격", type: "talent" },
    "영혼 탈취": { id: "soul_rending_havoc", name: "영혼 탈취", type: "talent" },
    "이동력": { id: "momentum", name: "이동력", type: "talent" },
    "지옥 폭풍": { id: "fel_eruption", name: "지옥 폭풍", type: "talent" },

    // 패시브
    "혼돈의 상처": { id: "chaos_brand", name: "혼돈의 상처", type: "passive" },
    "악마의 존재": { id: "demonic_presence", name: "악마의 존재", type: "passive" },
    "마의 대가": { id: "mastery_demonic_presence", name: "마의 대가", type: "passive" },
    "파멸": { id: "havoc", name: "파멸", type: "passive" },
    "악마의 기운": { id: "demon_blades", name: "악마의 기운", type: "passive" }
  },

  // 복수 전문화 (탱커)
  vengeance: {
    // 핵심 능력
    "영혼 절단": { id: "soul_cleave", name: "영혼 절단", type: "spender" },
    "영혼 폭탄": { id: "soul_bomb", name: "영혼 폭탄", type: "ability" },
    "제물의 오라": { id: "immolation_aura_veng", name: "제물의 오라", type: "ability" },
    "지옥불 일격": { id: "infernal_strike", name: "지옥불 일격", type: "movement" },
    "악마 보호막": { id: "demon_spikes_veng", name: "악마 보호막", type: "defensive" },
    "영혼 장벽": { id: "soul_barrier", name: "영혼 장벽", type: "defensive" },
    "마지막 저항": { id: "last_resort", name: "마지막 저항", type: "defensive" },
    "악마 추방": { id: "fel_devastation", name: "악마 추방", type: "channel" },
    "악령 폭발": { id: "spirit_bomb", name: "악령 폭발", type: "ability" },
    "인장": { id: "sigil_of_flame", name: "인장", type: "ability" },
    "불멸": { id: "fiery_brand", name: "불멸", type: "debuff" },

    // 특성
    "영혼 분열": { id: "fracture", name: "영혼 분열", type: "talent" },
    "고통의 불꽃": { id: "agonizing_flames", name: "고통의 불꽃", type: "talent" },
    "타락의 흔적": { id: "frailty", name: "타락의 흔적", type: "talent" },
    "집중된 인장": { id: "concentrated_sigils", name: "집중된 인장", type: "talent" },
    "빠른 인장": { id: "quickened_sigils", name: "빠른 인장", type: "talent" },
    "공허 리퍼": { id: "void_reaver", name: "공허 리퍼", type: "talent" },
    "영혼 분쇄": { id: "soul_crush", name: "영혼 분쇄", type: "talent" },
    "마지막 저항": { id: "last_resort_talent", name: "마지막 저항", type: "talent" },
    "기진맥진": { id: "feed_the_demon", name: "기진맥진", type: "talent" },
    "타오르는 상처": { id: "burning_alive", name: "타오르는 상처", type: "talent" },
    "대량 추방": { id: "bulk_extraction", name: "대량 추방", type: "talent" },

    // 인장
    "침묵의 인장": { id: "sigil_of_silence", name: "침묵의 인장", type: "silence" },
    "불행의 인장": { id: "sigil_of_misery", name: "불행의 인장", type: "fear" },
    "사슬의 인장": { id: "sigil_of_chains", name: "사슬의 인장", type: "chain" },

    // 패시브
    "악마 사냥꾼의 고통": { id: "demonic_tattoos", name: "악마 사냥꾼의 고통", type: "passive" },
    "검은 피": { id: "thick_skin", name: "검은 피", type: "passive" },
    "공허의 힘": { id: "void_touched", name: "공허의 힘", type: "passive" },
    "영혼의 방벽": { id: "soul_barrier_passive", name: "영혼의 방벽", type: "passive" },
    "펠 갑옷의 대가": { id: "mastery_fel_blood", name: "펠 갑옷의 대가", type: "passive" }
  },

  // PvP 특성
  pvp_talents: {
    // 공통 PvP 특성
    "검투사의 메달": { id: "gladiators_medallion", name: "검투사의 메달", type: "pvp_talent" },
    "끈기": { id: "relentless", name: "끈기", type: "pvp_talent" },
    "적응": { id: "adaptation", name: "적응", type: "pvp_talent" },

    // 악마사냥꾼 전용 PvP 특성
    "악마의 짓밟기": { id: "demonic_trample", name: "악마의 짓밟기", type: "pvp_talent" },
    "악마 방어구": { id: "demon_armor", name: "악마 방어구", type: "pvp_talent" },
    "뒤집기": { id: "reverse_magic", name: "뒤집기", type: "pvp_talent" },
    "마나 균열": { id: "mana_rift", name: "마나 균열", type: "pvp_talent" },
    "마나 연소": { id: "mana_burn", name: "마나 연소", type: "pvp_talent" },
    "표식된 죽음": { id: "marked_for_death", name: "표식된 죽음", type: "pvp_talent" },
    "비의 칼날": { id: "rain_from_above", name: "비의 칼날", type: "pvp_talent" },
    "지옥의 화염": { id: "detainment", name: "지옥의 화염", type: "pvp_talent" },
    "피의 달": { id: "blood_moon", name: "피의 달", type: "pvp_talent" },
    "가시 방어": { id: "jagged_spikes", name: "가시 방어", type: "pvp_talent" },
    "일루다리 지식": { id: "illidan_knowledge", name: "일루다리 지식", type: "pvp_talent" },
    "영혼 분할": { id: "soul_split", name: "영혼 분할", type: "pvp_talent" },
    "대악마 변신": { id: "demonic_origins", name: "대악마 변신", type: "pvp_talent" }
  }
};

module.exports = demonhunterSkills;