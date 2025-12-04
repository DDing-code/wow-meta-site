// 악마사냥꾼 (Demon Hunter) 스킬 데이터베이스
// WoW 11.2.5 패치 - TWW 시즌 3
// 최신 한국어 번역 적용 - 2025-11-28 업데이트

import { koreanTranslations } from '../koreanTranslations-11.2.js';

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

    // 이동기 - 수정: 복수의 질주 → 복수의 퇴각
    "복수의 퇴각": { id: "vengeful_retreat", name: "Vengeful Retreat", type: "movement" },
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
    "칼날 춤": { id: "blade_dance", name: "Blade Dance", type: "ability" },
    "죽음의 소용돌이": { id: "death_sweep", name: "Death Sweep", type: "ability" },
    "안광": { id: "eye_beam", name: "Eye Beam", type: "channel" },
    "파멸의 격노": { id: "chaos_blades", name: "파멸의 격노", type: "cooldown" },
    "지옥 돌진": { id: "fel_barrage", name: "지옥 돌진", type: "channel" },
    "파멸": { id: "annihilation", name: "Annihilation", type: "spender" },
    // 수정: 불꽃의 인장 → 제물의 오라
    "제물의 오라": { id: "immolation_aura", name: "Immolation Aura", type: "ability" },
    // 수정: 본질 절단 → 정수파쇄
    "정수파쇄": { id: "essence_break", name: "Essence Break", type: "debuff" },
    "악마의 웅덩이": { id: "glaive_tempest", name: "Glaive Tempest", type: "ability" },
    "엘리시안 칙령": { id: "elysian_decree", name: "Elysian Decree", type: "ability" },

    // 특성
    "실명의 분노": { id: "blind_fury", name: "Blind Fury", type: "talent" },
    "악마의 욕구": { id: "demonic_appetite", name: "Demonic Appetite", type: "talent" },
    "속박되지 않은 혼돈": { id: "unbound_chaos", name: "Unbound Chaos", type: "talent" },
    "불타는 증오": { id: "burning_hatred", name: "Burning Hatred", type: "talent" },
    "격렬한 굶주림": { id: "insatiable_hunger", name: "Insatiable Hunger", type: "talent" },
    "악마의 존재": { id: "demonic", name: "Demonic", type: "talent" },
    "최초의 피": { id: "first_blood", name: "First Blood", type: "talent" },
    "증오의 순환": { id: "cycle_of_hatred", name: "Cycle of Hatred", type: "talent" },
    "영혼 탈취": { id: "soul_rending_havoc", name: "Soul Rending", type: "talent" },
    "기세": { id: "momentum", name: "Momentum", type: "talent" },
    "지옥 분화": { id: "fel_eruption", name: "Fel Eruption", type: "talent" },
    "이니셔티브": { id: "initiative", name: "Initiative", type: "talent" },
    "고독한 사냥꾼": { id: "isolated_prey", name: "Isolated Prey", type: "talent" },
    "지옥칼날 폭풍": { id: "glaive_tempest_talent", name: "Glaive Tempest", type: "talent" },

    // 패시브
    "혼돈 낙인": { id: "chaos_brand", name: "Chaos Brand", type: "passive" },
    "악마의 현현": { id: "demonic_presence", name: "Demonic Presence", type: "passive" },
    "특화: 혼돈 재앙": { id: "mastery_demonic_presence", name: "Mastery: Demonic Presence", type: "passive" },
    "악마 칼날": { id: "demon_blades", name: "Demon Blades", type: "passive" }
  },

  // 복수 전문화 (탱커)
  vengeance: {
    // 핵심 능력
    "영혼 절단": { id: "soul_cleave", name: "Soul Cleave", type: "spender" },
    "영혼 폭탄": { id: "soul_bomb", name: "Soul Bomb", type: "ability" },
    "제물의 오라": { id: "immolation_aura_veng", name: "Immolation Aura", type: "ability" },
    "지옥불 일격": { id: "infernal_strike", name: "Infernal Strike", type: "movement" },
    "악마 보호막": { id: "demon_spikes_veng", name: "Demon Spikes", type: "defensive" },
    "영혼 장벽": { id: "soul_barrier", name: "Soul Barrier", type: "defensive" },
    "마지막 저항": { id: "last_resort", name: "Last Resort", type: "defensive" },
    "지옥 황폐화": { id: "fel_devastation", name: "Fel Devastation", type: "channel" },
    "영혼 폭격": { id: "spirit_bomb", name: "Spirit Bomb", type: "ability" },
    // 수정: 불꽃의 인장 - 복수는 별도 스킬
    "불꽃의 인장": { id: "sigil_of_flame", name: "Sigil of Flame", type: "ability" },
    "지옥 불길 낙인": { id: "fiery_brand", name: "Fiery Brand", type: "debuff" },

    // 특성
    "영혼 분열": { id: "fracture", name: "Fracture", type: "talent" },
    "고통의 화염": { id: "agonizing_flames", name: "Agonizing Flames", type: "talent" },
    "나약함": { id: "frailty", name: "Frailty", type: "talent" },
    "집중된 인장": { id: "concentrated_sigils", name: "Concentrated Sigils", type: "talent" },
    "신속한 인장": { id: "quickened_sigils", name: "Quickened Sigils", type: "talent" },
    "공허 약탈자": { id: "void_reaver", name: "Void Reaver", type: "talent" },
    "영혼 분쇄": { id: "soul_crush", name: "Soul Crush", type: "talent" },
    "마지막 저항": { id: "last_resort_talent", name: "Last Resort", type: "talent" },
    "악마 먹이기": { id: "feed_the_demon", name: "Feed the Demon", type: "talent" },
    "산 채로 불태우기": { id: "burning_alive", name: "Burning Alive", type: "talent" },
    "대량 추출": { id: "bulk_extraction", name: "Bulk Extraction", type: "talent" },

    // 인장
    "침묵의 인장": { id: "sigil_of_silence", name: "Sigil of Silence", type: "silence" },
    "고통의 인장": { id: "sigil_of_misery", name: "Sigil of Misery", type: "fear" },
    "사슬의 인장": { id: "sigil_of_chains", name: "Sigil of Chains", type: "chain" },

    // 패시브
    "악마의 문신": { id: "demonic_tattoos", name: "Demonic Tattoos", type: "passive" },
    "두꺼운 피부": { id: "thick_skin", name: "Thick Skin", type: "passive" },
    "공허에 물듦": { id: "void_touched", name: "Void Touched", type: "passive" },
    "영혼 보호막": { id: "soul_barrier_passive", name: "Soul Barrier", type: "passive" },
    "특화: 지옥 피": { id: "mastery_fel_blood", name: "Mastery: Fel Blood", type: "passive" }
  },

  // PvP 특성
  pvp_talents: {
    // 공통 PvP 특성
    "검투사의 메달": { id: "gladiators_medallion", name: "Gladiator's Medallion", type: "pvp_talent" },
    "불굴": { id: "relentless", name: "Relentless", type: "pvp_talent" },
    "적응": { id: "adaptation", name: "Adaptation", type: "pvp_talent" },

    // 악마사냥꾼 전용 PvP 특성
    "악마의 짓밟기": { id: "demonic_trample", name: "Demonic Trample", type: "pvp_talent" },
    "악마 방어구": { id: "demon_armor", name: "Demon Armor", type: "pvp_talent" },
    "마법 되돌리기": { id: "reverse_magic", name: "Reverse Magic", type: "pvp_talent" },
    "마나 균열": { id: "mana_rift", name: "Mana Rift", type: "pvp_talent" },
    "마나 연소": { id: "mana_burn", name: "Mana Burn", type: "pvp_talent" },
    "죽음의 표적": { id: "marked_for_death", name: "Marked for Death", type: "pvp_talent" },
    "하늘에서 내리는 비": { id: "rain_from_above", name: "Rain from Above", type: "pvp_talent" },
    "구금": { id: "detainment", name: "Detainment", type: "pvp_talent" },
    "피의 달": { id: "blood_moon", name: "Blood Moon", type: "pvp_talent" },
    "톱날 가시": { id: "jagged_spikes", name: "Jagged Spikes", type: "pvp_talent" },
    "일리다리 지식": { id: "illidan_knowledge", name: "Illidari Knowledge", type: "pvp_talent" },
    "영혼 분할": { id: "soul_split", name: "Soul Split", type: "pvp_talent" },
    "악마 기원": { id: "demonic_origins", name: "Demonic Origins", type: "pvp_talent" }
  }
};

export default demonhunterSkills;
