/**
 * 완전한 스킬 ID -> Wowhead 아이콘 매핑
 * 실제 Wowhead 아이콘 이름과 매칭
 */

export const completeSpellIdToIcon = {
  // ==================== 전사 ====================
  // 기본 스킬 (Wowhead에서 확인된 실제 아이콘)
  100: 'ability_warrior_charge', // 돌진
  355: 'spell_nature_reincarnation', // 도발
  1715: 'ability_shockwave', // 무력화
  6552: 'inv_gauntlets_04', // 들이치기
  6673: 'ability_warrior_battleshout', // 전투의 외침
  6544: 'ability_heroicleap', // 영웅의 도약
  1680: 'ability_whirlwind', // 소용돌이
  34428: 'ability_warrior_devastate', // 연전연승 (수정됨)
  57755: 'inv_axe_66', // 영웅의 투척 (수정됨)
  97462: 'ability_warrior_rallyingcry', // 재집결의 함성
  383155: 'ability_warrior_warbringer', // 휩쓸기 일격 연마

  // 무기 전문화
  12294: 'ability_warrior_savageblow', // 필사의 일격
  167105: 'ability_warrior_colossussmash', // 거인의 강타
  260708: 'ability_rogue_slicedice', // 휩쓸기 일격
  845: 'ability_warrior_cleave', // 회전베기
  118038: 'ability_warrior_diebythesword', // 투사의 혼
  227847: 'ability_warrior_bladestorm', // 칼날폭풍
  7384: 'ability_meleedamage', // 제압
  76838: 'ability_warrior_strengthofarms', // 특화: 거대한 힘
  1464: 'ability_warrior_decisivestrike', // 격돌

  // 분노 전문화
  23881: 'spell_nature_bloodlust', // 피의 갈증
  85288: 'warrior_wild_strike', // 분노의 강타
  184367: 'ability_warrior_rampage', // 광란
  5308: 'inv_sword_48', // 마무리 일격
  1719: 'warrior_talent_icon_innerrage', // 무모한 희생
  184361: 'spell_shadow_unholyfrenzy', // 격노
  184364: 'ability_warrior_focusedrage', // 격노의 재생력

  // 방어 전문화
  23922: 'inv_shield_05', // 방패 밀쳐내기
  2565: 'ability_defend', // 방패 올리기
  871: 'ability_warrior_shieldwall', // 방패의 벽
  401150: 'warrior_talent_icon_avatar', // 화신
  190456: 'ability_warrior_renewedvigor', // 고통 감내 (수정됨)
  6343: 'spell_nature_thunderclap', // 천둥벼락
  6572: 'ability_warrior_revenge', // 복수
  12975: 'spell_holy_ashestoashes', // 최후의 저항
  23920: 'ability_warrior_shieldreflection', // 주문 반사
  1160: 'ability_warrior_warcry', // 사기의 외침

  // 특성
  152278: 'warrior_talent_icon_angermanagement', // 분노 제어
  228920: 'warrior_talent_icon_ravager', // 쇠날발톱
  202751: 'warrior_talent_icon_seethe', // 무모한 광기
  203177: 'inv_shield_32', // 묵직한 반격
  107570: 'warrior_talent_icon_stormbolt', // 폭풍망치
  103827: 'inv_misc_horn_03', // 연속 돌진
  202168: 'ability_warrior_victoryrush', // 예견된 승리
  346002: 'ability_warrior_unrelentingassault', // 전쟁 기계
  280776: 'ability_warrior_suddendeath', // 급살
  118000: 'ability_warrior_dragonroar', // 용의 포효

  // PvP
  236077: 'ability_warrior_disarm', // 무장 해제
  198817: 'inv_sword_112', // 무기 연마
  236320: 'warrior_talent_icon_stormofsteel', // 전투 깃발
  236273: 'achievement_bg_killingblow_berserker', // 결투

  // ==================== 성기사 ==================== (Wowhead 확인)
  853: 'spell_holy_sealofmight', // 심판의 망치
  633: 'spell_holy_layonhands', // 신의 보호막 (수정됨)
  642: 'spell_holy_divineshield', // 천상의 보호막
  1022: 'spell_holy_sealofprotection', // 보호의 손길
  1044: 'spell_holy_sealofvalor', // 자유의 손길
  31884: 'spell_holy_avenginewrath', // 응징의 격노
  86659: 'spell_holy_guardianspirit', // 고대 왕의 수호자
  184662: 'ability_paladin_veneration', // 숭고한 희생
  19750: 'spell_holy_flashheal', // 빛의 섬광
  20473: 'spell_holy_holybolt', // 신성한 빛
  26573: 'spell_holy_innerfire', // 신성화
  85222: 'spell_holy_avengersshield', // 복수자의 방패
  31935: 'spell_holy_avengersshield', // 복수자의 방패
  53385: 'ability_paladin_divinestorm', // 천상의 폭풍
  85256: 'spell_paladin_templarsverdict', // 기사단의 선고
  20271: 'ability_paladin_judgementred', // 심판
  35395: 'ability_paladin_shieldofthetemplar', // 성전사의 일격
  184575: 'spell_paladin_bladeofjustice', // 정의의 검
  213644: 'ability_paladin_cleansebytoc', // 정화

  // ==================== 사냥꾼 ====================
  56641: 'ability_hunter_steadyshot', // 고정 사격
  19434: 'inv_spear_07', // 조준 사격
  185358: 'ability_impalingbolt', // 신비한 사격
  257044: 'ability_hunter_rapidfire', // 속사
  53351: 'ability_hunter_assassinate', // 사살 사격
  257620: 'ability_upgrademoonglaive', // 일제 사격
  186265: 'ability_hunter_aspectoftheturtle', // 거북의 상
  109304: 'ability_hunter_exoticmunitions', // 활기
  264735: 'ability_hunter_survivalist', // 생존 전술
  186257: 'ability_hunter_aspectofthecheetah', // 치타의 상
  781: 'ability_rogue_sprint', // 철수
  187650: 'ability_hunter_glacialtrap', // 빙결의 덫
  187698: 'spell_frost_chainsofice', // 타르 덫
  162488: 'spell_fire_selfdestruct', // 강철 덫
  109248: 'ability_hunter_bindingshot', // 구속 사격
  120360: 'ability_hunter_barrage', // 탄막
  194386: 'ability_hunter_volley', // 일격
  260402: 'ability_hunter_doubleshot', // 이중 사격
  259387: 'ability_hunter_mongoose_bite', // 몽구스 일격
  259491: 'ability_hunter_serpentsting', // 독사 쐐기

  // ==================== 도적 ====================
  1784: 'ability_stealth', // 은신
  1833: 'ability_cheapshot', // 비열한 습격
  53: 'spell_shadow_ritualofsacrifice', // 사악한 일격
  2098: 'ability_rogue_eviscerate', // 절개
  315496: 'ability_rogue_slicedice', // 뼈주사위
  408: 'ability_rogue_kidneyshot', // 급소 가격
  1856: 'ability_vanish', // 소멸
  36554: 'ability_rogue_shadowstep', // 그림자 걸음
  1329: 'ability_rogue_shadowstrikes', // 절단
  32645: 'inv_throwingknife_04', // 독칼
  1766: 'ability_kick', // 발차기
  5277: 'ability_rogue_evasion', // 회피
  31224: 'ability_rogue_shadowstep', // 그림자 망토
  2983: 'ability_rogue_sprint', // 전력 질주
  185311: 'inv_knife_1h_grimbatolraid_d_03', // 진홍색 약병
  13750: 'spell_shadow_shadowworddominate', // 아드레날린 촉진
  51690: 'rogue_killingspree', // 난도질
  13877: 'ability_rogue_bladeflurry', // 칼날 부채
  121411: 'ability_rogue_crimsonvial', // 진홍색 약병

  // ==================== 사제 ====================
  17: 'spell_holy_powerwordshield', // 신의 권능: 보호막
  589: 'spell_shadow_shadowwordpain', // 암흑의 권능: 고통
  2061: 'spell_holy_flashheal', // 빛의 치유
  2060: 'spell_holy_heal', // 치유
  139: 'spell_holy_renew', // 소생
  33206: 'spell_holy_painsupression', // 고통 억제
  47788: 'spell_holy_guardianspirit', // 수호 영혼
  62618: 'spell_holy_powerwordbarrier', // 신의 권능: 방벽
  15487: 'spell_shadow_psychichorrors', // 침묵
  8092: 'spell_shadow_unholyfrenzy', // 정신 폭발
  585: 'spell_holy_holysmite', // 강타
  14914: 'spell_holy_searinglight', // 신성한 불꽃
  204197: 'spell_shadow_purifyinglight', // 정화
  47536: 'spell_holy_rapture', // 환희
  10060: 'spell_holy_powerinfusion', // 마력 주입
  194509: 'spell_holy_powerword', // 신의 권능: 광휘
  204065: 'spell_shadow_shadowmend', // 어둠의 치유
  21562: 'spell_holy_wordfortitude', // 신의 권능: 인내
  586: 'spell_magic_lesserinvisibilty', // 소실

  // ==================== 마법사 ====================
  133: 'spell_fire_flamebolt', // 화염구
  116: 'spell_frost_frostbolt02', // 냉기 화살
  1449: 'spell_holy_magicalsentry', // 신비한 지능
  5143: 'spell_nature_starfall', // 신비한 화살
  118: 'spell_nature_polymorph', // 변이
  1953: 'spell_arcane_blink', // 점멸
  45438: 'spell_frost_frost', // 얼음 방패
  122: 'spell_frost_frostnova', // 냉기 돌풍
  190356: 'spell_frost_icestorm', // 눈보라
  11366: 'spell_fire_fireball02', // 화염 폭풍
  30451: 'spell_arcane_blast', // 비전 작렬
  44425: 'spell_arcane_barrage', // 비전 탄막
  1463: 'spell_frost_manaburn', // 마나 보호막
  235313: 'spell_magearmor', // 타오르는 갑옷
  11426: 'spell_frost_frostarmor02', // 얼음 보호막
  2139: 'spell_frost_iceshock', // 마법 차단
  475: 'spell_frost_wizardmark', // 투명 감지
  130: 'ability_mage_slowfall', // 저속 낙하
  66: 'spell_nature_invisibilty', // 투명화

  // ==================== 흑마법사 ====================
  686: 'spell_shadow_shadowbolt', // 암흑 화살
  172: 'spell_shadow_abominationexplosion', // 부패
  348: 'spell_fire_immolation', // 제물
  5782: 'spell_shadow_possession', // 공포
  234153: 'spell_shadow_lifedrain02', // 흡수
  198590: 'spell_shadow_haunting', // 흡수
  688: 'spell_shadow_summonimp', // 임프 소환
  697: 'spell_shadow_summonvoidwalker', // 보이드워커 소환
  116858: 'ability_warlock_chaosbolt', // 혼돈의 화살
  29722: 'spell_fire_burnout', // 소각
  691: 'spell_shadow_summonfelhunter', // 지옥사냥개 소환
  712: 'spell_shadow_summonfelguard', // 펠가드 소환
  30146: 'spell_shadow_summonsuccubus', // 서큐버스 소환
  104773: 'spell_warlock_demonsoul', // 영구 결의
  108416: 'spell_shadow_deathcoil', // 암흑 서약

  // ==================== 주술사 ====================
  188196: 'spell_nature_lightning', // 번개 화살
  421: 'spell_nature_chainlightning', // 연쇄 번개
  8042: 'spell_nature_earthshock', // 대지 충격
  188389: 'spell_fire_flameshock', // 화염 충격
  196840: 'spell_frost_frostshock', // 냉기 충격
  8004: 'spell_nature_healingwavegreater', // 치유의 물결
  1064: 'spell_nature_healingway', // 연쇄 치유
  33757: 'spell_nature_cyclone', // 질풍의 무기
  17364: 'ability_shaman_stormstrike', // 폭풍의 일격
  51505: 'spell_shaman_lavaburst', // 용암 폭발
  198067: 'spell_fire_elemental_totem', // 화염 정령
  198103: 'spell_earth_elemental_totem', // 대지 정령
  108271: 'ability_shaman_astralshift', // 영체 이동
  58875: 'spell_nature_spiritlink', // 정신 산책
  2008: 'spell_nature_ancestralguardian', // 고대의 시야
  8143: 'spell_nature_tremor', // 진동 토템
  192058: 'spell_nature_brilliance', // 축전

  // ==================== 수도사 ====================
  100780: 'ability_monk_tigerpalm', // 범의 장
  100784: 'ability_monk_roundhousekick', // 흑우 차기
  107428: 'ability_monk_risingsunkick', // 해오름차기
  101546: 'ability_monk_cranekick', // 학다리차기
  322109: 'ability_monk_touchofdeath', // 절명의 손길
  109132: 'ability_monk_roll', // 구르기
  115176: 'ability_monk_fortifyingale', // 명상
  122470: 'ability_monk_touchofkarma', // 업보의 손아귀
  113656: 'monk_ability_fistoffury', // 분노의 주먹
  116847: 'monk_ability_rushingjade', // 비취 돌풍
  115181: 'ability_monk_breathoffire', // 불의 숨결
  115078: 'ability_monk_paralysis', // 마비
  116849: 'ability_monk_lifecocoon', // 고치
  119381: 'ability_monk_legswipe', // 팽이차기

  // ==================== 드루이드 ====================
  8921: 'spell_nature_starfall', // 달빛섬광
  190984: 'spell_nature_abolishmagic', // 천벌
  194153: 'spell_arcane_starfire', // 별빛섬광
  774: 'spell_nature_rejuvenation', // 회복
  8936: 'spell_nature_resistnature', // 재성장
  18562: 'inv_relics_idolofrejuvenation', // 신속한 치유
  48438: 'spell_nature_resistnature', // 급속 성장
  1822: 'ability_druid_rake', // 갈퀴 발톱
  5221: 'spell_shadow_vampiricaura', // 칼날 발톱
  22568: 'ability_druid_ferociousbite', // 흉포한 이빨
  768: 'ability_racial_bearform', // 곰 변신
  783: 'ability_druid_travelform', // 여행 변신
  1126: 'spell_nature_regeneration', // 야생의 징표
  5487: 'ability_racial_bearform', // 곰 변신
  22812: 'ability_druid_treeoflife', // 나무껍질
  102342: 'druid_ironbark', // 무쇠껍질

  // ==================== 죽음의 기사 ====================
  49998: 'spell_deathknight_butcher2', // 죽음의 일격
  50842: 'spell_deathknight_bloodboil', // 피의 소용돌이
  49576: 'spell_deathknight_strangulate', // 죽음의 손아귀
  51052: 'spell_deathknight_classicon', // 절멸
  49143: 'spell_deathknight_empowerruneblade2', // 냉기의 일격
  43265: 'spell_shadow_deathanddecay', // 죽음과 부패
  42650: 'spell_shadow_animatedead', // 망자의 군대
  46585: 'inv_pet_ghoul', // 시체 되살리기
  48707: 'spell_shadow_antimagicshell', // 대마법 보호막
  47528: 'spell_shadow_antimagicshell', // 정신 얼리기
  55233: 'spell_deathknight_vampiricblood', // 흡혈
  49016: 'spell_deathknight_unholypresence', // 부정의 격노
  48792: 'spell_deathknight_icebornfortitude', // 얼음결계 인내력
  195182: 'spell_deathknight_marrowblood', // 뼈의 보호막

  // ==================== 악마사냥꾼 ====================
  162794: 'inv_weapon_glave_01', // 혼돈의 일격
  201427: 'ability_demonhunter_chaosstrike', // 파멸
  198013: 'ability_demonhunter_eyebeam', // 눈 광선
  188499: 'ability_demonhunter_bladedance', // 칼춤
  191427: 'ability_demonhunter_metamorphasisdps', // 탈태
  195072: 'ability_demonhunter_felrush', // 지옥 돌진
  198793: 'ability_demonhunter_vengefulretreat', // 복수의 후퇴
  258920: 'spell_fire_incinerate', // 제물의 오라
  185123: 'ability_demonhunter_throwglaive', // 투척
  344859: 'ability_demonhunter_soulsiphon', // 영혼 베기
  206491: 'ability_demonhunter_nethertear', // 황천 걸음
  202137: 'ability_demonhunter_silence', // 침묵의 인장
  202138: 'ability_demonhunter_imprison', // 감금의 인장

  // ==================== 기원사 ====================
  361469: 'ability_evoker_livingflame', // 살아있는 불꽃
  357208: 'ability_evoker_firebreath', // 화염 숨결
  362969: 'ability_evoker_azurestrike', // 하늘빛 일격
  356995: 'ability_evoker_disintegrate', // 분해
  357210: 'ability_evoker_deepbreath', // 깊은 숨결
  358267: 'ability_evoker_hover', // 비상
  355913: 'ability_evoker_emeraldblossom', // 에메랄드 꽃
  355936: 'ability_evoker_dreambreath', // 꿈결의 숨결
  360995: 'ability_evoker_verdantembrace', // 푸른 품
  364343: 'ability_evoker_echo', // 메아리
  370452: 'ability_evoker_soar', // 활공
  351338: 'ability_evoker_obsidianbulwark', // 흑요석 보루
  374227: 'ability_evoker_zephyr', // 미풍
};

// 기본 아이콘 반환 함수
export function getIconForSpell(spellId) {
  return completeSpellIdToIcon[spellId] || 'inv_misc_questionmark';
}