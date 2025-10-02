// TWW Season 3 누락된 아이콘 일괄 수정
// WoWHead 아이콘 네이밍 규칙 적용

const fs = require('fs');
const path = require('path');

// 기본 아이콘 매핑 테이블 (스킬 ID -> 아이콘 이름)
const iconMappings = {
  // Priest 스킬들
  "17": "spell_holy_powerwordshield", // 신의 권능: 보호막
  "139": "spell_holy_renew", // 소생
  "527": "spell_holy_dispelmagic", // 정화
  "585": "spell_holy_holybolt", // 성스러운 일격
  "586": "spell_nature_invisibilty", // 소실
  "2050": "spell_holy_serenity", // 치유
  "2060": "spell_holy_heal", // 상급 치유
  "2061": "spell_holy_flashheal", // 순간 치유
  "8092": "spell_shadow_siphonmana", // 정신 폭발
  "15407": "spell_shadow_shadowwordpain", // 정신 분열

  // Warrior 스킬들
  "355": "spell_nature_reincarnation", // 도발
  "772": "ability_gouge", // 분쇄
  "1464": "ability_warrior_charge", // 격돌
  "2565": "ability_warrior_shieldblock", // 방패 막기
  "6544": "ability_warrior_punishingblow", // 영웅의 도약
  "6572": "ability_warrior_revenge", // 복수
  "12294": "ability_warrior_savageblow", // 죽음의 일격
  "23881": "spell_nature_bloodlust", // 피의 갈증
  "23920": "spell_magic_lesserinvisibilty", // 주문 반사
  "46924": "ability_whirlwind", // 칼날폭풍
  "46968": "ability_rogue_bladestorm", // 칼날폭풍 (고유)

  // Death Knight 스킬들
  "43265": "spell_shadow_deathanddecay", // 죽음과 부패
  "47528": "spell_deathknight_mindfreeze", // 정신 얼리기
  "47536": "spell_deathknight_runestrike", // 룬 분쇄
  "47540": "spell_deathknight_mindfreeze", // 치유의 주문
  "47541": "spell_deathknight_deathstrike", // 죽음의 일격
  "48707": "spell_shadow_antimagicshell", // 대마법 보호막
  "48792": "spell_deathknight_iceboundfortitude", // 얼음같은 인내력
  "49020": "spell_deathknight_empowerruneblade2", // 냉기 돌풍
  "49143": "spell_deathknight_frostpresence", // 서리 일격
  "49184": "spell_deathknight_howlingblast", // 울부짖는 한파
  "49998": "ability_deathknight_deathstrike", // 죽음의 일격
  "50842": "spell_deathknight_bloodboil", // 피의 끓어오름
  "51271": "ability_deathknight_pillaroffrost", // 지옥불 칼날
  "55090": "spell_shadow_chilltouch", // 스컬지의 일격
  "55233": "spell_shadow_vampirictouch", // 흡혈 피
  "56222": "spell_nature_shamanrage", // 어둠의 명령

  // Rogue 스킬들
  "408": "ability_rogue_kidneyshot", // 급소 가격
  "703": "ability_rogue_garrote", // 목조르기
  "1329": "ability_rogue_mutilate", // 절단
  "1752": "ability_rogue_sinisterstrike", // 사악한 일격
  "1856": "spell_shadow_shadowsofdarkness", // 소멸
  "1943": "ability_rogue_rupture", // 파열
  "1966": "ability_rogue_feint", // 교란
  "2823": "ability_rogue_deadlypoison", // 치명적인 독
  "2983": "ability_rogue_sprint", // 전력 질주

  // Paladin 스킬들
  "633": "spell_holy_divineintervention", // 신의 축복
  "642": "spell_holy_divineshield", // 신의 보호막
  "853": "spell_holy_sealofmight", // 심판의 망치
  "1022": "spell_holy_blessingofprotection", // 보호의 축복
  "1044": "spell_holy_blessingoffreedom", // 자유의 축복

  // Mage 스킬들
  "116": "spell_frost_frostbolt02", // 얼음 화살
  "118": "spell_nature_polymorph", // 변이
  "120": "spell_frost_frost", // 얼음 회오리
  "122": "spell_frost_frost", // 서리 회오리
  "133": "spell_fire_flamebolt", // 화염구
  "1449": "spell_frost_frostbolt", // 비전 폭발
  "1459": "spell_holy_magicalsentry", // 비전 지능
  "2139": "spell_frost_iceshock", // 마법 차단
  "2948": "spell_frost_wizardmark", // 감지 마법
  "11366": "spell_fire_selfdestruct", // 불기둥
  "12051": "spell_nature_enchantarmor", // 환기
  "12472": "spell_frost_iceshard", // 얼음 피
  "30451": "spell_arcane_blast", // 비전 폭발
  "31661": "spell_fire_selfdestruct", // 용의 숨결
  "44425": "spell_frost_frostbolt", // 비전 탄막
  "45438": "spell_frost_frost", // 얼음 방패

  // Warlock 스킬들
  "172": "spell_shadow_abominationcurse", // 부패
  "348": "spell_fire_immolation", // 제물
  "686": "spell_shadow_shadowbolt", // 암흑 화살
  "702": "spell_shadow_grimward", // 흡수의 저주
  "740": "spell_shadow_curseofelements", // 원소의 저주
  "980": "spell_shadow_curseofsargeras", // 고뇌
  "1714": "spell_shadow_abominationcurse", // 언어의 저주
  "5740": "spell_shadow_rainoffire", // 화염비
  "5782": "spell_shadow_possession", // 공포
  "17962": "spell_fire_conflagration", // 점화
  "29722": "spell_fire_felfireball", // 소각
  "30108": "spell_shadow_unstableaffliction", // 불안정한 고통

  // Druid 스킬들
  "774": "spell_nature_rejuvenation", // 회복
  "1079": "ability_druid_disembowel", // 도려내기
  "1126": "spell_nature_regeneration", // 야생의 징표
  "2637": "spell_nature_sleep", // 동면
  "5143": "spell_nature_nullifydisease", // 야생의 징표
  "5171": "ability_druid_mangle2", // 전율
  "5176": "spell_nature_wrathv2", // 천벌
  "5217": "ability_racial_bearform", // 호랑이의 분노
  "5221": "ability_druid_mangle", // 갈퀴 발톱
  "5487": "ability_druid_catform", // 곰 변신
  "6807": "ability_druid_maul", // 후려치기
  "8921": "spell_nature_starfall", // 달빛섬광
  "22568": "ability_druid_ferociousbite", // 흉포한 이빨
  "22812": "spell_nature_stoneclawtotem", // 나무 껍질
  "22842": "spell_nature_resistnature", // 광란의 재생
  "33917": "ability_druid_mangle", // 짓이기기

  // Shaman 스킬들
  "974": "spell_nature_magicimmunity", // 대지의 보호막
  "1064": "spell_nature_healingwavegreater", // 치유의 사슬
  "2008": "spell_nature_ancestralguardian", // 선조의 혼
  "5394": "spell_nature_healingtotem", // 치유의 토템
  "8004": "spell_nature_healingwavelesser", // 치유의 해일
  "8042": "spell_nature_earthshock", // 대지 충격
  "51505": "spell_shaman_lavaburst", // 용암 폭발
  "51533": "spell_shaman_feralspirit", // 야수 정령
  "61295": "spell_frost_summonwaterelemental", // 성난 해일

  // Hunter 스킬들
  "1978": "ability_hunter_serpentsting", // 독사 쐐기
  "2643": "ability_hunter_multishot", // 멀티샷
  "19434": "ability_hunter_aimedshot", // 조준 사격
  "19574": "ability_druid_ferociousbite", // 야수의 격노
  "34026": "ability_hunter_killcommand", // 살상 명령
  "53351": "ability_hunter_killshot", // 마무리 사격

  // Demon Hunter 스킬들
  "162243": "spell_demonhunter_metamorphosis", // 악마 변신
  "162794": "ability_demonhunter_chaosstrike", // 혼돈의 일격
  "183752": "spell_demonhunter_consumemagic", // 마법 소모
  "185123": "ability_demonhunter_throwglaive", // 투척 글레이브
  "185245": "ability_demonhunter_torment", // 고통
  "188499": "ability_demonhunter_bladedance", // 칼춤
  "188501": "ability_demonhunter_spectantsight", // 망령의 시야

  // Monk 스킬들
  "100780": "ability_monk_jab", // 호랑이 장풍
  "100784": "ability_monk_blackoutkick", // 흑우 차기
  "101545": "ability_monk_flyingkick", // 비룡차기
  "107428": "ability_monk_risingsunkick", // 해돋이 차기
  "109132": "ability_monk_roll", // 구르기
  "113656": "ability_monk_fusedspirit", // 분노의 주먹
  "115151": "ability_monk_renewingmists", // 소생의 안개
  "115176": "ability_monk_zenpilgrimage", // 명상
  "115203": "ability_monk_fortifyingale_new", // 강화주
  "115310": "ability_monk_revival", // 소생
  "115313": "ability_monk_summonstatue", // 옥룡 석상
  "115450": "ability_monk_detox", // 해독
  "116095": "ability_monk_disable", // 장애
  "116645": "ability_monk_teachingsofmonastery", // 가르침
  "116680": "ability_monk_thunderfocustea", // 번개 집중차
  "116841": "ability_monk_tigerslust", // 호랑이의 욕망
  "116858": "ability_monk_chaosbrand", // 혼돈의 낙인
  "119381": "ability_monk_legswipe", // 다리 후리기
  "119582": "ability_monk_purifyingbrew", // 정화주
  "121253": "ability_monk_kegsmash", // 술통 휘두르기

  // Evoker 스킬들
  "355913": "ability_evoker_disintegrate", // 파괴
  "357208": "ability_evoker_firebreath", // 불의 숨결
  "357210": "ability_evoker_deepbreath", // 깊은 숨결
  "358267": "ability_evoker_hover", // 비상
  "358385": "ability_evoker_landslide", // 산사태
  "359073": "ability_evoker_eternity", // 영원
  "359816": "ability_evoker_dreamflight", // 꿈의 비행
  "360995": "ability_evoker_verdanttembrace", // 푸른 포옹
  "361469": "ability_evoker_livingflame", // 살아있는 불꽃
  "362969": "ability_evoker_azurestrike", // 천청색 일격
  "363534": "ability_evoker_rewind", // 되돌리기
  "364343": "ability_evoker_echo", // 메아리
  "365350": "ability_evoker_arcanevigor", // 비전 활력
  "365585": "ability_evoker_expunge", // 제거
  "366155": "ability_evoker_reversion", // 되감기
  "367364": "ability_evoker_reversion2", // 되감기
  "368432": "ability_evoker_unravel", // 해체

  // 영웅 특성 아이콘들
  "432459": "achievement_raid_ulduar_algalon_01", // 산왕
  "432496": "achievement_boss_titankeeper_loken", // 거신
  "432578": "achievement_raid_ulduar_mimiron_01", // 칼날 지배자
  "432928": "achievement_raid_ulduar_yogg_01", // 태양의 전령
  "432939": "achievement_raid_ulduar_freya_01", // 빛의 대장장이
  "433891": "achievement_raid_ulduar_thorim_01", // 템플러

  // 기타 공통 스킬들
  "61336": "ability_hibernation", // 생존 본능
  "64843": "spell_holy_divinespirit", // 신성한 찬가
  "64901": "spell_holy_symbolofhope", // 희망의 상징

  // 기본 아이콘 (누락된 경우 사용)
  "default": "inv_misc_questionmark"
};

function fixMissingIcons() {
  const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
  let content = fs.readFileSync(dbPath, 'utf8');

  console.log('🔧 누락된 아이콘 수정 시작...\n');

  let fixedCount = 0;
  const missingIconIds = [
    "17", "116", "120", "122", "133", "139", "172", "348", "355", "408", "527", "585", "586", "686", "702", "703", "740", "774", "974", "980",
    "1064", "1079", "1122", "1126", "1329", "1449", "1459", "1464", "1714", "1752", "1822", "1856", "1943", "1953", "1966", "2008", "2050", "2060", "2061", "2120",
    "2139", "2645", "2823", "2948", "2983", "5143", "5171", "5176", "5217", "5221", "5394", "5487", "5740", "5782", "6343", "6572", "6807", "8004", "8042", "8092",
    "8921", "11366", "12051", "12472", "13750", "14161", "14190", "15407", "17364", "17962", "18562", "19434", "19574", "20707", "20711", "22568", "22812",
    "22842", "23881", "26573", "29725", "30108", "30451", "31209", "31661", "32379", "32645", "33891", "33917", "34026", "34861", "43265", "44425", "45438",
    "47536", "47540", "47541", "48181", "48438", "49020", "49143", "49184", "49998", "50842", "51462", "51490", "51505", "51533", "53385", "53563", "53600",
    "55090", "55342", "56222", "56641", "57994", "58351", "60103", "61295", "61336", "63106", "64843", "64901", "73920", "77472", "77758", "78674", "79140",
    "80208", "84714", "85256", "85948", "98008", "100780", "100784", "101545", "102342", "102543", "103827", "104773", "105174", "106839", "106951", "107428",
    "108370", "109132", "109142", "109304", "111400", "113656", "114074", "115151", "115176", "115181", "115203", "115310", "115313", "115450", "116095",
    "116645", "116680", "116841", "116858", "119381", "119582", "121253", "121471", "124682", "137639", "152175", "152280", "153561", "153626", "157153",
    "162243", "162794", "178940", "183415", "183435", "183997", "185123", "185311", "185358", "185438", "185789", "186265", "186270", "187650", "187827",
    "187874", "188196", "188443", "188499", "188501", "190319", "190984", "191034", "191334", "191384", "191427", "191634", "192077", "192081", "192222",
    "192249", "193157", "193315", "193468", "193530", "193640", "194153", "194223", "194509", "194909", "195072", "195182", "196055", "196408", "196770",
    "196819", "196923", "196926", "196937", "197625", "197908", "198013", "198067", "198590", "199483", "199786", "199921", "200183", "200806", "201427",
    "202095", "202137", "202140", "202347", "203177", "203720", "203782", "204596", "205021", "205065", "205145", "205180", "206315", "206333", "206930",
    "207126", "207317", "211881", "214202", "217200", "219786", "223817", "228260", "228477", "231390", "231895", "235219", "245388", "257044", "257541",
    "257620", "258920", "259489", "259495", "260402", "260708", "260734", "262111", "262150", "263642", "264057", "264106", "264119", "264178", "264656",
    "265187", "265202", "266779", "267217", "267344", "267610", "271877", "274281", "274837", "277925", "280375", "280392", "280719", "280721", "288613",
    "314867", "315341", "315508", "316099", "316402", "316428", "321507", "322101", "322109", "322507", "333974", "342817", "351239", "353759", "355913",
    "355936", "356995", "357208", "357210", "358267", "358385", "359073", "359816", "360995", "361469", "362969", "363534", "364343", "365350", "365585",
    "366155", "367364", "368432", "370537", "370960", "372835", "374348", "374585", "375087", "378007", "378275", "378747", "378905", "381623", "381989",
    "382266", "382440", "382940", "382946", "383103", "383295", "383394", "383433", "384100", "384318", "385125", "385391", "385425", "385627", "385704",
    "385720", "385840", "385985", "386196", "386951", "387184", "390178", "391109", "391154", "391403", "392983", "395152", "395160", "396286", "403631",
    "426936", "427453", "428344", "428889", "431177", "431984", "432467", "433891", "436147", "436152", "439518", "439880", "440029", "440045", "440989",
    "440993", "441403", "441598", "442290", "442325", "443028", "443739", "444008", "444770", "444775", "445701", "447444", "449612", "449882", "449914",
    "450373", "450508", "451233", "452068", "452415", "453570", "454009", "455438", "455848", "457033"
  ];

  missingIconIds.forEach(id => {
    // 스킬 찾기
    const skillRegex = new RegExp(`"${id}":\\s*{([^}]+)}`, 'g');
    const match = content.match(skillRegex);

    if (match) {
      const skillContent = match[0];

      // 이미 아이콘이 있는지 확인
      if (!skillContent.includes('"icon"') && !skillContent.includes('"iconName"')) {
        // 아이콘 매핑 찾기
        const iconName = iconMappings[id] || iconMappings.default;

        // 아이콘 필드 추가
        const updatedSkillContent = skillContent.replace(
          /("koreanName":\s*"[^"]+",?)/,
          `$1\n    icon: "${iconName}",`
        );

        content = content.replace(skillContent, updatedSkillContent);
        fixedCount++;
        console.log(`  ✅ ${id}: 아이콘 추가 -> ${iconName}`);
      }
    }
  });

  // 파일 저장
  fs.writeFileSync(dbPath, content, 'utf8');

  console.log(`\n📊 아이콘 수정 완료:`);
  console.log(`  - 총 ${fixedCount}개 아이콘 추가`);
  console.log(`  - 남은 누락: ${missingIconIds.length - fixedCount}개`);
}

// 실행
fixMissingIcons();

console.log('\n✅ 아이콘 수정 작업 완료!');