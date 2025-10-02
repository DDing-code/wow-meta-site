// 흑마법사 (Warlock) 스킬 데이터베이스
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)
// 최신 한국어 번역 적용

import { koreanTranslations } from '../koreanTranslations-11.2';

const warlockTranslations = koreanTranslations.warlockAbilities;

export const warlockSkills = {
  className: koreanTranslations.classes.warlock,
  classNameEn: 'Warlock',
  // 공통 스킬 (모든 전문화 공유)
  common: {
    // 기본 공격 스킬
    [warlockTranslations.autoAttack]: {
      id: 6603,
      name: 'Auto Attack',
      type: 'melee',
      description: '기본 근접 공격입니다.'
    },
    [warlockTranslations.shadowBolt]: {
      id: 686,
      name: 'Shadow Bolt',
      type: 'cast',
      description: '어둠의 화살로 대상을 공격합니다.'
    },
    [warlockTranslations.corruption]: {
      id: 172,
      name: 'Corruption',
      type: 'dot',
      description: '대상을 부패시켜 지속 피해를 입힙니다.'
    },
    [warlockTranslations.agony]: {
      id: 980,
      name: 'Agony',
      type: 'dot',
      description: '대상에게 고통을 가하여 지속 피해를 입힙니다.'
    },
    [warlockTranslations.drainLife]: {
      id: 234153,
      name: 'Drain Life',
      type: 'channel',
      description: '대상의 생명력을 흡수하여 체력을 회복합니다.'
    },
    [warlockTranslations.lifeTap]: {
      id: 1454,
      name: 'Life Tap',
      type: 'ability',
      description: '체력을 마나로 전환합니다.'
    },
    [warlockTranslations.drainSoul]: {
      id: 198590,
      name: 'Drain Soul',
      type: 'channel',
      description: '대상의 영혼을 흡수합니다.'
    },

    // 소환수
    "임프 소환": { id: "summon_imp", name: "임프 소환", type: "summon" },
    "보이드워커 소환": { id: "summon_voidwalker", name: "보이드워커 소환", type: "summon" },
    "서큐버스 소환": { id: "summon_succubus", name: "서큐버스 소환", type: "summon" },
    "펠헌터 소환": { id: "summon_felhunter", name: "펠헌터 소환", type: "summon" },
    "펠가드 소환": { id: "summon_felguard", name: "펠가드 소환", type: "summon" },
    "악마 통솔": { id: "demonic_gateway", name: "악마 통솔", type: "utility" },
    "악마 지배": { id: "subjugate_demon", name: "악마 지배", type: "control" },

    // 영혼석 관련
    "영혼석 생성": { id: "create_soulstone", name: "영혼석 생성", type: "utility" },
    "영혼석 부활": { id: "soulstone_resurrection", name: "영혼석 부활", type: "resurrect" },
    "생명석 생성": { id: "create_healthstone", name: "생명석 생성", type: "utility" },
    "영혼의 우물": { id: "ritual_of_summoning", name: "영혼의 우물", type: "summon" },

    // 방어 기술
    "불굴의 결의": { id: "unending_resolve", name: "불굴의 결의", type: "defensive" },
    "어둠의 계약": { id: "dark_pact", name: "어둠의 계약", type: "defensive" },
    "악마의 피부": { id: "demon_skin", name: "악마의 피부", type: "passive" },
    "영혼 링크": { id: "soul_link", name: "영혼 링크", type: "defensive" },

    // 유틸리티
    "공포": { id: "fear", name: "공포", type: "cc" },
    "추방": { id: "banish", name: "추방", type: "cc" },
    "마법 저항막": { id: "spell_lock", name: "마법 저항막", type: "interrupt" },
    "전투 함성": { id: "command_demon", name: "전투 함성", type: "pet_ability" },
    "악마의 원": { id: "demonic_circle", name: "악마의 원", type: "teleport" },
    "악마의 원: 순간이동": { id: "demonic_circle_teleport", name: "악마의 원: 순간이동", type: "teleport" },
    "소울번": { id: "soulburn", name: "소울번", type: "empower" },

    // 저주
    "무력화의 저주": { id: "curse_of_weakness", name: "무력화의 저주", type: "curse" },
    "피로의 저주": { id: "curse_of_exhaustion", name: "피로의 저주", type: "curse" },
    "언어의 저주": { id: "curse_of_tongues", name: "언어의 저주", type: "curse" },
    "취약의 저주": { id: "curse_of_fragility", name: "취약의 저주", type: "curse" },

    // 기타
    "죽음의 마법진": { id: "ritual_of_doom", name: "죽음의 마법진", type: "summon" },
    "악마의 눈": { id: "eye_of_kilrogg", name: "악마의 눈", type: "scout" },
    "사탕 속임수": { id: "enslave_demon", name: "사탕 속임수", type: "control" }
  },

  // 고통 전문화
  affliction: {
    // 핵심 능력
    "불안정한 고통": { id: "unstable_affliction", name: "불안정한 고통", type: "dot" },
    "씨앗": { id: "seed_of_corruption", name: "씨앗", type: "aoe" },
    "사이폰 생명": { id: "siphon_life", name: "사이폰 생명", type: "dot" },
    "악의 강화": { id: "malefic_rapture", name: "악의 강화", type: "spender" },
    "암흑불길": { id: "shadowburn", name: "암흑불길", type: "execute" },
    "암흑의 영혼: 불행": { id: "dark_soul_misery", name: "암흑의 영혼: 불행", type: "major_cooldown" },
    "유령 출몰": { id: "haunt", name: "유령 출몰", type: "debuff" },
    "망자의 서약": { id: "deathbolt", name: "망자의 서약", type: "ability" },
    "공포의 울부짖음": { id: "howl_of_terror", name: "공포의 울부짖음", type: "fear" },
    "악몽": { id: "vile_taint", name: "악몽", type: "aoe" },

    // 특성
    "밤의 몰락": { id: "nightfall", name: "밤의 몰락", type: "talent" },
    "영원한 고통": { id: "writhe_in_agony", name: "영원한 고통", type: "talent" },
    "절대 부패": { id: "absolute_corruption", name: "절대 부패", type: "talent" },
    "끝없는 고통": { id: "creeping_death", name: "끝없는 고통", type: "talent" },
    "불타는 긴급함": { id: "burning_rush", name: "불타는 긴급함", type: "talent" },
    "어둠의 부름": { id: "dark_caller", name: "어둠의 부름", type: "talent" },
    "유령의 독특성": { id: "phantom_singularity", name: "유령의 독특성", type: "talent" },
    "암흑연구": { id: "shadow_embrace", name: "암흑연구", type: "talent" },
    "소울샤드 채취": { id: "soul_conduit", name: "소울샤드 채취", type: "talent" },
    "공포 수확자": { id: "grimoire_of_sacrifice", name: "공포 수확자", type: "talent" },
    "어둠의 손길": { id: "dark_pact_aff", name: "어둠의 손길", type: "talent" },

    // 패시브
    "영혼 조각": { id: "soul_shards", name: "영혼 조각", type: "resource" },
    "기생충": { id: "pandemic", name: "기생충", type: "passive" },
    "불안정한 고통 확산": { id: "unstable_affliction_spread", name: "불안정한 고통 확산", type: "passive" },
    "고통의 대가": { id: "mastery_potent_afflictions", name: "고통의 대가", type: "passive" },
    "그림자 포용": { id: "shadow_embrace_passive", name: "그림자 포용", type: "passive" }
  },

  // 악마학 전문화
  demonology: {
    // 핵심 능력
    "악마 화살": { id: "demonbolt", name: "악마 화살", type: "cast" },
    "손의 소환": { id: "hand_of_guldan", name: "손의 소환", type: "ability" },
    "악마 부르기": { id: "call_dreadstalkers", name: "악마 부르기", type: "summon" },
    "임프 폭발": { id: "implosion", name: "임프 폭발", type: "aoe" },
    "악령 폭격": { id: "bilescourge_bombers", name: "악령 폭격", type: "summon" },
    "악마 강화": { id: "demonic_strength", name: "악마 강화", type: "buff" },
    "티란 소환": { id: "summon_demonic_tyrant", name: "티란 소환", type: "major_cooldown" },
    "악의 기원": { id: "nether_portal", name: "악의 기원", type: "summon" },
    "파멸의 문": { id: "doom", name: "파멸의 문", type: "dot" },
    "영혼 강타": { id: "soul_strike", name: "영혼 강타", type: "ability" },

    // 특성
    "악마 소환": { id: "demonic_calling", name: "악마 소환", type: "talent" },
    "내부 악마": { id: "inner_demons", name: "내부 악마", type: "talent" },
    "필연": { id: "from_the_shadows", name: "필연", type: "talent" },
    "악마 보강": { id: "soul_conduit_demo", name: "악마 보강", type: "talent" },
    "악마 소환사": { id: "demonic_consumption", name: "악마 소환사", type: "talent" },
    "막을 수 없는 힘": { id: "power_siphon", name: "막을 수 없는 힘", type: "talent" },
    "악마 지식": { id: "demonic_knowledge", name: "악마 지식", type: "talent" },
    "희생의 소환사": { id: "sacrificed_souls", name: "희생의 소환사", type: "talent" },
    "악마 침략": { id: "summon_vilefiend", name: "악마 침략", type: "talent" },
    "그림와르": { id: "grimoire_felguard", name: "그림와르", type: "talent" },
    "망자 소환": { id: "dreadlash", name: "망자 소환", type: "talent" },

    // 패시브
    "악마 핵심": { id: "demonic_core", name: "악마 핵심", type: "passive" },
    "악마 변환": { id: "soul_shards_demo", name: "악마 변환", type: "resource" },
    "악마학의 대가": { id: "mastery_master_demonologist", name: "악마학의 대가", type: "passive" },
    "악마 지휘": { id: "demonic_empowerment", name: "악마 지휘", type: "passive" },
    "악마 시너지": { id: "demonic_synergy", name: "악마 시너지", type: "passive" }
  },

  // 파괴 전문화
  destruction: {
    // 핵심 능력
    "제물": { id: "immolate", name: "제물", type: "dot" },
    "소각": { id: "incinerate", name: "소각", type: "cast" },
    "점화": { id: "conflagrate", name: "점화", type: "instant" },
    "혼돈의 화살": { id: "chaos_bolt", name: "혼돈의 화살", type: "cast" },
    "비의 불": { id: "rain_of_fire", name: "비의 불", type: "aoe" },
    "대재앙": { id: "havoc", name: "대재앙", type: "debuff" },
    "지옥불정령 소환": { id: "summon_infernal", name: "지옥불정령 소환", type: "major_cooldown" },
    "암흑의 영혼: 불안정": { id: "dark_soul_instability", name: "암흑의 영혼: 불안정", type: "cooldown" },
    "영혼의 불꽃": { id: "soul_fire", name: "영혼의 불꽃", type: "cast" },
    "채널 악마화": { id: "channel_demonfire", name: "채널 악마화", type: "channel" },
    "암흑불길": { id: "shadowburn_dest", name: "암흑불길", type: "execute" },

    // 특성
    "화염 발작": { id: "flashover", name: "화염 발작", type: "talent" },
    "후폭풍": { id: "backdraft", name: "후폭풍", type: "talent" },
    "역화": { id: "reverse_entropy", name: "역화", type: "talent" },
    "내부 연소": { id: "internal_combustion", name: "내부 연소", type: "talent" },
    "화염 균열": { id: "fire_and_brimstone", name: "화염 균열", type: "talent" },
    "대격변": { id: "cataclysm", name: "대격변", type: "talent" },
    "굴복": { id: "mortal_coil", name: "굴복", type: "talent" },
    "파괴 굽기": { id: "roaring_blaze", name: "파괴 굽기", type: "talent" },
    "그림와르: 불지옥": { id: "grimoire_of_supremacy", name: "그림와르: 불지옥", type: "talent" },
    "파멸": { id: "ruination", name: "파멸", type: "talent" },
    "영혼 분쇄": { id: "soul_conduit_dest", name: "영혼 분쇄", type: "talent" },

    // 패시브
    "화염 파편": { id: "soul_shards_dest", name: "화염 파편", type: "resource" },
    "혼돈의 분쇄": { id: "chaotic_energies", name: "혼돈의 분쇄", type: "passive" },
    "파괴의 대가": { id: "mastery_chaotic_energies", name: "파괴의 대가", type: "passive" },
    "잠식": { id: "eradication", name: "잠식", type: "passive" },
    "연소": { id: "burning_embers", name: "연소", type: "passive" }
  },

  // PvP 특성
  pvp_talents: {
    // 공통 PvP 특성
    "검투사의 메달": { id: "gladiators_medallion", name: "검투사의 메달", type: "pvp_talent" },
    "끈기": { id: "relentless", name: "끈기", type: "pvp_talent" },
    "적응": { id: "adaptation", name: "적응", type: "pvp_talent" },

    // 흑마법사 전용 PvP 특성
    "악마의 포탈": { id: "gateway_mastery", name: "악마의 포탈", type: "pvp_talent" },
    "저주의 파편": { id: "curse_of_fragility_pvp", name: "저주의 파편", type: "pvp_talent" },
    "오만함": { id: "nether_ward", name: "오만함", type: "pvp_talent" },
    "망각": { id: "oblivion", name: "망각", type: "pvp_talent" },
    "발의 불길": { id: "bane_of_havoc", name: "발의 불길", type: "pvp_talent" },
    "끝없는 고통": { id: "endless_affliction", name: "끝없는 고통", type: "pvp_talent" },
    "지옥불 보호": { id: "infernal_armor", name: "지옥불 보호", type: "pvp_talent" },
    "분리": { id: "soulshatter", name: "분리", type: "pvp_talent" },
    "악마 갑옷": { id: "demon_armor", name: "악마 갑옷", type: "pvp_talent" },
    "어둠의 동료": { id: "fel_fissure", name: "어둠의 동료", type: "pvp_talent" },
    "펠로드": { id: "fel_lord", name: "펠로드", type: "pvp_talent" },
    "암흑 계약": { id: "amplify_curse", name: "암흑 계약", type: "pvp_talent" },
    "저주 강화": { id: "jinx", name: "저주 강화", type: "pvp_talent" }
  }
};

module.exports = warlockSkills;