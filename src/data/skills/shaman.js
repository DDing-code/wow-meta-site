// 주술사 (Shaman) 스킬 데이터베이스
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)
// 최신 한국어 번역 적용

import { koreanTranslations } from '../koreanTranslations-11.2';

const shamanTranslations = koreanTranslations.shamanAbilities;

export const shamanSkills = {
  className: koreanTranslations.classes.shaman,
  classNameEn: 'Shaman',
  // 공통 스킬 (모든 전문화 공유)
  common: {
    // 기본 공격 스킬
    [shamanTranslations.autoAttack]: {
      id: 6603,
      name: 'Auto Attack',
      type: 'melee',
      description: '기본 근접 공격입니다.'
    },
    [shamanTranslations.lightningBolt]: {
      id: 188196,
      name: 'Lightning Bolt',
      type: 'cast',
      description: '번개로 적을 공격합니다.'
    },
    [shamanTranslations.chainLightning]: {
      id: 188443,
      name: 'Chain Lightning',
      type: 'cast',
      description: '여러 적에게 번개를 연쇄시킵니다.'
    },
    [shamanTranslations.flameShock]: {
      id: 188389,
      name: 'Flame Shock',
      type: 'dot',
      description: '화염 지속 피해를 입힙니다.'
    },
    [shamanTranslations.frostShock]: {
      id: 196840,
      name: 'Frost Shock',
      type: 'instant',
      description: '대상을 느리고 피해를 입힙니다.'
    },
    [shamanTranslations.earthShock]: {
      id: 8042,
      name: 'Earth Shock',
      type: 'instant',
      description: '대지의 힘으로 적을 공격합니다.'
    },
    [shamanTranslations.purge]: {
      id: 370,
      name: 'Purge',
      type: 'dispel',
      description: '마법 효과를 제거합니다.'
    },
    [shamanTranslations.windShear]: {
      id: 57994,
      name: 'Wind Shear',
      type: 'interrupt',
      cooldown: 12,
      description: '적의 주문 시전을 차단합니다.'
    },

    // 토템
    "대지의 정령 토템": { id: "earth_elemental", name: "대지의 정령 토템", type: "summon" },
    "불의 정령 토템": { id: "fire_elemental", name: "불의 정령 토템", type: "summon" },
    "치유의 토템": { id: "healing_stream_totem", name: "치유의 토템", type: "totem" },
    "진동 토템": { id: "tremor_totem", name: "진동 토템", type: "totem" },
    "속박 토템": { id: "earthbind_totem", name: "속박 토템", type: "totem" },
    "축전 토템": { id: "capacitor_totem", name: "축전 토템", type: "totem" },
    "대지 잡기 토템": { id: "earthgrab_totem", name: "대지 잡기 토템", type: "totem" },
    "바람걸음 토템": { id: "wind_rush_totem", name: "바람걸음 토템", type: "totem" },
    "액체 용암 토템": { id: "liquid_magma_totem", name: "액체 용암 토템", type: "totem" },

    // 치유
    "치유의 물결": { id: "healing_wave", name: "치유의 물결", type: "heal" },
    "치유의 파도": { id: "healing_surge", name: "치유의 파도", type: "heal" },
    "연쇄 치유": { id: "chain_heal", name: "연쇄 치유", type: "heal" },

    // 유틸리티
    "늑대 정령": { id: "ghost_wolf", name: "늑대 정령", type: "form" },
    "아스트랄 소환": { id: "astral_recall", name: "아스트랄 소환", type: "teleport" },
    "수중 호흡": { id: "water_breathing", name: "수중 호흡", type: "buff" },
    "수면 보행": { id: "water_walking", name: "수면 보행", type: "buff" },
    "선조의 영혼": { id: "ancestral_spirit", name: "선조의 영혼", type: "resurrect" },
    "되살리기": { id: "reincarnation", name: "되살리기", type: "self_resurrect" },
    "투명": { id: "hex", name: "투명", type: "cc" },
    "정화의 영혼": { id: "cleanse_spirit", name: "정화의 영혼", type: "dispel" },

    // 방어
    "아스트랄 전환": { id: "astral_shift", name: "아스트랄 전환", type: "defensive" },
    "영혼 나누기": { id: "spirit_link_totem", name: "영혼 나누기", type: "defensive" },
    "선조의 인도": { id: "ancestral_guidance", name: "선조의 인도", type: "defensive" }
  },

  // 정기 전문화
  elemental: {
    // 핵심 능력
    "용암 폭발": { id: "lava_burst", name: "용암 폭발", type: "cast" },
    "대지 충격": { id: "earth_shock_ele", name: "대지 충격", type: "spender" },
    "지진": { id: "earthquake", name: "지진", type: "aoe" },
    "번개 폭풍": { id: "thunderstorm", name: "번개 폭풍", type: "knockback" },
    "정령 걸음": { id: "spiritwalkers_grace", name: "정령 걸음", type: "utility" },
    "폭풍의 정령": { id: "storm_elemental", name: "폭풍의 정령", type: "summon" },
    "상승": { id: "ascendance_elemental", name: "상승", type: "major_cooldown" },
    "원소 폭발": { id: "elemental_blast", name: "원소 폭발", type: "ability" },
    "얼음격노": { id: "icefury", name: "얼음격노", type: "ability" },

    // 특성
    "원소의 균형": { id: "elemental_equilibrium", name: "원소의 균형", type: "talent" },
    "메아리": { id: "echo_of_the_elements", name: "메아리", type: "talent" },
    "정령의 메아리": { id: "elemental_spirits", name: "정령의 메아리", type: "talent" },
    "마스터 원소사": { id: "master_of_the_elements", name: "마스터 원소사", type: "talent" },
    "폭풍수호자": { id: "storm_keeper", name: "폭풍수호자", type: "talent" },
    "무한의 폭풍": { id: "unlimited_power", name: "무한의 폭풍", type: "talent" },
    "원시 정령술사": { id: "primal_elementalist", name: "원시 정령술사", type: "talent" },
    "산맥 쇄도": { id: "surge_of_power", name: "산맥 쇄도", type: "talent" },
    "대지분노": { id: "earthen_rage", name: "대지분노", type: "talent" },
    "하늘격노": { id: "skybreakers_fiery_demise", name: "하늘격노", type: "talent" },
    "폭풍수호자": { id: "stormkeeper", name: "폭풍수호자", type: "talent" },

    // 패시브
    "용암 쇄도": { id: "lava_surge", name: "용암 쇄도", type: "passive" },
    "정기 집중": { id: "elemental_focus", name: "정기 집중", type: "passive" },
    "정기 과부하": { id: "elemental_overload", name: "정기 과부하", type: "passive" },
    "화염 충격 확산": { id: "flame_shock_spread", name: "화염 충격 확산", type: "passive" },
    "원시의 격노": { id: "elemental_fury", name: "원시의 격노", type: "passive" }
  },

  // 고양 전문화
  enhancement: {
    // 핵심 능력
    "폭풍의 일격": { id: "stormstrike", name: "폭풍의 일격", type: "ability" },
    "용암 채찍": { id: "lava_lash", name: "용암 채찍", type: "ability" },
    "질풍": { id: "windfury_weapon", name: "질풍", type: "imbue" },
    "화염혀": { id: "flametongue_weapon", name: "화염혀", type: "imbue" },
    "번개 화살": { id: "lightning_bolt_enh", name: "번개 화살", type: "instant" },
    "야수 정령": { id: "feral_spirit", name: "야수 정령", type: "summon" },
    "상승": { id: "ascendance_enhancement", name: "상승", type: "major_cooldown" },
    "파쇄": { id: "crash_lightning", name: "파쇄", type: "aoe" },
    "바위주먹": { id: "rockbiter", name: "바위주먹", type: "builder" },
    "태양 강타": { id: "sundering", name: "태양 강타", type: "ability" },

    // 특성
    "뜨거운 손": { id: "hot_hand", name: "뜨거운 손", type: "talent" },
    "원소 폭발": { id: "elemental_blast_enh", name: "원소 폭발", type: "talent" },
    "정령 산책": { id: "spirit_walk", name: "정령 산책", type: "talent" },
    "원소 무기": { id: "elemental_weapons", name: "원소 무기", type: "talent" },
    "강제 진입": { id: "forceful_intrusion", name: "강제 진입", type: "talent" },
    "원소 영혼": { id: "elemental_spirits_enh", name: "원소 영혼", type: "talent" },
    "지옥의 돌진": { id: "earthen_spike", name: "지옥의 돌진", type: "talent" },
    "알파 늑대": { id: "alpha_wolf", name: "알파 늑대", type: "talent" },
    "파멸의 망치": { id: "doom_winds", name: "파멸의 망치", type: "talent" },
    "얼음 일격": { id: "ice_strike", name: "얼음 일격", type: "talent" },
    "불의 노바": { id: "fire_nova", name: "불의 노바", type: "talent" },

    // 패시브
    "소용돌이 무기": { id: "maelstrom_weapon", name: "소용돌이 무기", type: "passive" },
    "폭풍 일격자": { id: "stormbringer", name: "폭풍 일격자", type: "passive" },
    "원소 융합": { id: "elemental_fusion", name: "원소 융합", type: "passive" },
    "치명타 공격": { id: "critical_strikes", name: "치명타 공격", type: "passive" },
    "질풍의 격노": { id: "windfury", name: "질풍의 격노", type: "passive" }
  },

  // 복원 전문화
  restoration: {
    // 핵심 능력
    "성난 해일": { id: "riptide", name: "성난 해일", type: "hot" },
    "치유의 비": { id: "healing_rain", name: "치유의 비", type: "aoe_heal" },
    "치유의 물결 토템": { id: "healing_tide_totem", name: "치유의 물결 토템", type: "raid_cooldown" },
    "정령 연결 토템": { id: "spirit_link_totem", name: "정령 연결 토템", type: "raid_cooldown" },
    "대지의 벽 토템": { id: "earthen_wall_totem", name: "대지의 벽 토템", type: "defensive" },
    "정화의 물": { id: "purify_spirit", name: "정화의 물", type: "dispel" },
    "상승": { id: "ascendance_restoration", name: "상승", type: "major_cooldown" },
    "생명 활성화": { id: "spiritwalkers_tidal_totem", name: "생명 활성화", type: "totem" },
    "폭우 토템": { id: "cloudburst_totem", name: "폭우 토템", type: "totem" },
    "샘물": { id: "wellspring", name: "샘물", type: "aoe_heal" },

    // 특성
    "파도 타기": { id: "tide_bringer", name: "파도 타기", type: "talent" },
    "고통": { id: "torrent", name: "고통", type: "talent" },
    "분출의 파도": { id: "unleash_life", name: "분출의 파도", type: "talent" },
    "대지의 정령": { id: "earthen_harmony", name: "대지의 정령", type: "talent" },
    "원소의 궤도": { id: "elemental_orbit", name: "원소의 궤도", type: "talent" },
    "선조의 생기": { id: "ancestral_vigor", name: "선조의 생기", type: "talent" },
    "살아있는 물결": { id: "living_stream", name: "살아있는 물결", type: "talent" },
    "자연의 수호자": { id: "natures_guardian", name: "자연의 수호자", type: "talent" },
    "우아한 영혼": { id: "graceful_spirit", name: "우아한 영혼", type: "talent" },
    "물의 보호막": { id: "aqua_shield", name: "물의 보호막", type: "talent" },
    "깊은 치유": { id: "deep_healing", name: "깊은 치유", type: "talent" },

    // 패시브
    "조수": { id: "tidal_waves", name: "조수", type: "passive" },
    "정복": { id: "mastery_deep_healing", name: "정복", type: "passive" },
    "소생": { id: "resurgence", name: "소생", type: "passive" },
    "원시 물결 흐름": { id: "primordial_wave", name: "원시 물결 흐름", type: "passive" },
    "물의 축복": { id: "blessing_of_the_tides", name: "물의 축복", type: "passive" }
  },

  // PvP 특성
  pvp_talents: {
    // 공통 PvP 특성
    "검투사의 메달": { id: "gladiators_medallion", name: "검투사의 메달", type: "pvp_talent" },
    "끈기": { id: "relentless", name: "끈기", type: "pvp_talent" },
    "적응": { id: "adaptation", name: "적응", type: "pvp_talent" },

    // 주술사 전용 PvP 특성
    "토템의 대가": { id: "totem_master", name: "토템의 대가", type: "pvp_talent" },
    "정전기 토템": { id: "static_field_totem", name: "정전기 토템", type: "pvp_talent" },
    "근원 토템": { id: "grounding_totem", name: "근원 토템", type: "pvp_talent" },
    "번개 절도": { id: "lightning_lasso", name: "번개 절도", type: "pvp_talent" },
    "토템 투영": { id: "totem_projection", name: "토템 투영", type: "pvp_talent" },
    "물결 타기": { id: "ride_the_waves", name: "물결 타기", type: "pvp_talent" },
    "정령 산책자": { id: "spirit_walker", name: "정령 산책자", type: "pvp_talent" },
    "폭우": { id: "downpour", name: "폭우", type: "pvp_talent" },
    "전투 조정": { id: "shamanism", name: "전투 조정", type: "pvp_talent" },
    "번개 징표": { id: "lightning_mark", name: "번개 징표", type: "pvp_talent" },
    "원소 조화": { id: "elemental_attunement", name: "원소 조화", type: "pvp_talent" },
    "재조정": { id: "counterstrike_totem", name: "재조정", type: "pvp_talent" },
    "늑대의 발톱": { id: "wolf_bones", name: "늑대의 발톱", type: "pvp_talent" }
  }
};

module.exports = shamanSkills;