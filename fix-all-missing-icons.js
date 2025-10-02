const fs = require('fs');
const path = require('path');

// 데이터베이스 파일 읽기
const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
const content = fs.readFileSync(dbPath, 'utf8');

// 데이터베이스 추출
const dbMatch = content.match(/const koreanSpellDatabase = ({\s[\s\S]*?});/);
if (!dbMatch) {
  console.error('❌ 데이터베이스를 찾을 수 없습니다.');
  process.exit(1);
}

const func = new Function('return ' + dbMatch[1]);
const db = func();

// 포괄적인 아이콘 매핑 (WoW 공식 아이콘 이름)
const comprehensiveIconMapping = {
  // 전사 특성 및 스킬 - 완전판
  '6343': 'spell_nature_thunderclap',  // 천둥벼락
  '6544': 'ability_heroicleap',  // 영웅의 도약
  '6572': 'ability_warrior_revenge',  // 복수
  '53600': 'ability_paladin_shieldofvengeance',  // 정의의 방패
  '103827': 'inv_misc_horn_04',  // 연속 돌진
  '106839': 'ability_warrior_decisivestrike',  // 두개골 강타
  '262161': 'inv_artifact_warswords',  // 전쟁파괴자
  '267344': 'ability_paladin_artofwar',  // 전쟁의 기술
  '280772': 'ability_warrior_improveddisciplines',  // 급살
  '382946': 'spell_warrior_wildstrike',  // 야생의 강타
  '384318': 'ability_warrior_dragonroar',  // 천둥의 포효
  '385391': 'ability_warrior_spellreflection',  // 주문 반사
  '385840': 'spell_shaman_crashlightning',  // 천둥군주
  '385952': 'ability_warrior_bloodbath',  // 피의 욕조
  '392966': 'ability_warrior_bladestorm',  // 칼날폭풍 강화
  '401150': 'ability_warrior_championsbolt',  // 용사의 창
  '455848': 'ability_warrior_charge',  // 분노의 돌진

  // 전사 추가 스킬들
  '386071': 'spell_nature_thunderblast',  // Thunder Blast
  '440987': 'ability_warrior_colossussmash',  // Colossal Might
  '280001': 'ability_warrior_devastate',  // Demolish
  '444770': 'ability_warrior_slayer',  // Slayer's Dominance
  '390138': 'ability_warrior_bladestorm',  // Overwhelming Blades
  '260708': 'ability_rogue_slicedice',  // Sweeping Strikes
  '202612': 'ability_paladin_vengeance',  // Vengeance
  '152278': 'warrior_talent_icon_angermanagement',  // Anger Management
  '390677': 'inv_shield_32',  // Heavy Repercussions
  '206315': 'inv_sword_48',  // Massacre
  '337302': 'ability_rogue_hungerforblood',  // Taste for Blood
  '262111': 'ability_backstab',  // Mastery: Deep Wounds
  '215571': 'warrior_talent_icon_furyintheblood',  // Frothing Berserker
  '280392': 'ability_warrior_weaponmastery',  // Meat Cleaver
  '5302': 'ability_warrior_revenge',  // Revenge!
  '275334': 'ability_deathknight_sanguinfortitude',  // Punish

  // 성기사 누락 아이콘
  '465': 'spell_holy_devotionaura',  // 헌신의 오라
  '498': 'spell_holy_divineprotection',  // 신성한 보호
  '527': 'spell_holy_dispelmagic',  // 정화
  '6940': 'spell_holy_sealofsacrifice',  // 희생의 축복
  '19750': 'spell_holy_flashheal',  // 섬광
  '20217': 'spell_holy_greaterblessingofsalvation',  // 왕의 축복
  '20473': 'spell_holy_searinglight',  // 신성 충격
  '24275': 'spell_holy_blessingofstrength',  // 정의의 망치
  '31821': 'spell_holy_auramastery',  // 오라 숙련
  '62124': 'spell_holy_unyieldingfaith',  // 복수의 격노
  '183997': 'inv_hammer_04',  // 신의 망치
  '184575': 'ability_paladin_bladeofjustice',  // 정의의 검
  '184689': 'ability_paladin_beaconoflight',  // 빛의 봉화
  '204019': 'spell_holy_blessingofstrength',  // 축복된 망치
  '231663': 'spell_paladin_divinecircle',  // 신성한 원

  // 사냥꾼 누락 아이콘
  '2641': 'spell_nature_spiritwolf',  // 사냥꾼의 징표
  '2643': 'ability_upgrademoonglaive',  // 다중 사격
  '13813': 'ability_hunter_explosiveshot',  // 폭발 덫
  '19386': 'spell_fire_selfdestruct',  // 비룡 쏘기
  '53351': 'ability_hunter_pet_killshot',  // 마무리 사격
  '109248': 'spell_shaman_bindelemental',  // 속박의 사격
  '186387': 'ability_hunter_laceration',  // 날개 절단
  '203415': 'ability_hunter_rapidfire',  // 연발 사격
  '260402': 'ability_hunter_crossfire',  // 이중 사격
  '272651': 'ability_hunter_survivalist',  // 생존 전문가

  // 도적 누락 아이콘
  '196819': 'ability_rogue_eviscerate',  // 절개
  '212283': 'spell_shadow_rune',  // 그림자 상징
  '315496': 'ability_rogue_slicedice',  // 뼈 가시
  '315508': 'ability_rogue_rollthebones',  // 뼈 주사위
  '381623': 'inv_drink_milk_05',  // 깊은 상처
  '381632': 'ability_rogue_garrote',  // 질식
  '381634': 'ability_rogue_deadlybrew',  // 치명적인 독
  '382513': 'ability_vanish',  // 개선된 소멸
  '383155': 'ability_rogue_slicedice',  // 개선된 뼈 가시
  '385627': 'ability_rogue_shadowdance',  // 그림자 춤

  // 사제 누락 아이콘
  '527': 'spell_holy_dispelmagic',  // 정화
  '2050': 'spell_holy_heal',  // 치유
  '2060': 'spell_holy_greaterheal',  // 상급 치유
  '2061': 'spell_holy_flashheal',  // 순간 치유
  '34861': 'spell_holy_circleofdeath',  // 신성한 일격
  '47540': 'spell_holy_penance',  // 참회
  '64129': 'spell_holy_symbolofhope',  // 희망의 상징
  '110744': 'spell_holy_divinestar',  // 신성한 별
  '121536': 'spell_holy_angelicfeather',  // 천사의 깃털
  '204197': 'ability_mage_firestarter',  // 정화의 불꽃

  // 죽음기사 누락 아이콘
  '43265': 'spell_shadow_deathanddecay',  // 죽음과 부패
  '47476': 'spell_deathknight_strangulate',  // 질식시키기
  '47528': 'spell_shadow_soulleech_3',  // 정신 얼리기
  '47541': 'spell_shadow_deathcoil',  // 죽음의 고리
  '49020': 'spell_deathknight_obliterate',  // 말살
  '49143': 'spell_frost_arcticwinds',  // 서리 일격
  '49184': 'spell_frost_arcticwinds',  // 울부짖는 칼바람
  '49530': 'spell_shadow_painspike',  // 어둠의 일격
  '49998': 'spell_deathknight_deathstrike',  // 죽음의 일격
  '55090': 'spell_deathknight_scourgestrike',  // 스컬지 일격
  '194679': 'spell_deathknight_runeblade',  // 룬 무기
  '195182': 'ability_deathknight_marrowrend',  // 골수 분쇄

  // 주술사 누락 아이콘
  '1064': 'spell_nature_healingwavegreater',  // 치유의 물결
  '2484': 'spell_nature_earthelemental_totem',  // 대지 정령
  '16166': 'spell_nature_elementalabsorption',  // 정령의 숙련
  '51505': 'spell_shaman_lavaburst',  // 용암 폭발
  '51514': 'spell_shaman_hex',  // 주술
  '51533': 'spell_shaman_feralspirit',  // 야수 정령
  '61295': 'spell_nature_chainlightning',  // 치유의 비
  '77472': 'spell_nature_healingway',  // 치유의 길
  '108280': 'ability_shaman_healingtide',  // 치유의 해일 토템
  '192058': 'spell_nature_lightningshield',  // 번개 축전기
  '192249': 'inv_stormelemental',  // 폭풍 정령
  '204331': 'spell_nature_wrathofair_totem',  // 폭풍의 토템

  // 수도사 누락 아이콘
  '116680': 'ability_monk_thunderfocustea',  // 집중의 천둥 차
  '116705': 'ability_monk_spearhand',  // 손바닥 찌르기
  '116841': 'ability_monk_tigerslust',  // 호랑이의 욕망
  '116847': 'ability_monk_rushingwind',  // 질풍의 걸음
  '117952': 'ability_monk_cracklingjadelightning',  // 비취 번개
  '121253': 'achievement_brewery_2',  // 카이치
  '124502': 'ability_druid_giftoftheearthmother',  // 선물
  '124682': 'spell_monk_envelopingmist',  // 포용의 안개
  '152175': 'ability_monk_hurricanestrike',  // 폭풍 일격
  '387184': 'ability_monk_standingkick',  // 발차기

  // 드루이드 누락 아이콘
  '197625': 'spell_druid_bearthrash',  // 난타
  '202028': 'spell_druid_bloodythrash',  // 잔인한 난타
  '203964': 'ability_druid_galacticguardian',  // 은하수 수호자
  '204012': 'ability_druid_malfurionstenacity',  // 말퓨리온의 끈기
  '319454': 'spell_nature_healingtouch',  // 마음의 평화
  '391528': 'ability_druid_convoke_spirits',  // 영혼 소집
  '391889': 'ability_druid_adaptiveswarm',  // 적응의 무리

  // 마법사 누락 아이콘
  '30449': 'spell_arcane_arcane02',  // 주문 훔치기
  '30451': 'spell_arcane_blast',  // 비전 작렬
  '30455': 'spell_frost_frostblast',  // 얼음창
  '44425': 'ability_mage_arcanebarrage',  // 비전 탄막
  '153626': 'spell_mage_arcaneorb',  // 비전 구슬
  '190319': 'spell_fire_firebolt02',  // 연소
  '153561': 'spell_mage_meteor',  // 운석
  '157997': 'spell_frost_frostbolt',  // 얼음 회오리
  '205025': 'spell_nature_enchantarmor',  // 힘의 룬

  // 흑마법사 누락 아이콘
  '702': 'spell_shadow_curseofmannoroth',  // 약화의 저주
  '710': 'spell_shadow_cripple',  // 추방
  '1454': 'spell_shadow_burningspirit',  // 생명력 전환
  '5782': 'spell_shadow_possession',  // 공포
  '6229': 'spell_shadow_twilight',  // 암흑 보호막
  '6789': 'spell_shadow_gathershadows',  // 죽음의 고리
  '20707': 'spell_warlock_soulburn',  // 영혼석
  '111400': 'spell_fire_burnout',  // 불타는 돌진
  '108416': 'spell_shadow_deathpact',  // 암흑 서약
  '205180': 'spell_shadow_shadowbolt',  // 암흑 저류

  // 악마사냥꾼 누락 아이콘
  '162243': 'inv_weapon_glave_01',  // 악마의 이빨
  '162794': 'ability_demonhunter_chaosstrike',  // 혼돈 강타
  '185123': 'ability_demonhunter_throwglaive',  // 투척 글레이브
  '185245': 'ability_demonhunter_torment',  // 고통
  '188499': 'ability_demonhunter_bladedance',  // 칼날 춤
  '188501': 'ability_demonhunter_spectralsight',  // 영혼 시야
  '189110': 'ability_demonhunter_infernalstrike1',  // 지옥불 일격
  '195072': 'ability_demonhunter_felrush',  // 지옥 질주
  '196555': 'ability_demonhunter_netherwalk',  // 황천걷기
  '198013': 'ability_demonhunter_eyebeam',  // 눈빔
  '203720': 'ability_demonhunter_demonspikes',  // 악마의 쐐기
  '204021': 'ability_demonhunter_fierybrand',  // 맹렬한 낙인
  '204596': 'ability_demonhunter_sigilofinquisition',  // 심문 인장
  '206491': 'ability_demonhunter_nemiesis',  // 숙적
  '258920': 'ability_demonhunter_immolation',  // 제물
  '258925': 'inv_felbarrage',  // 지옥불 탄막
  '320413': 'inv_glaive_1h_battledungeon_c_02',  // 소용돌이 칼날
  '342817': 'inv_glaive_1h_artifactazgalor_d_06dual',  // 격변의 별
  '347462': 'artifactability_vengeancedemonhunter_painbringer',  // 고통을 주는 자
  '370965': 'inv_ability_demonhunter_thehunt',  // 사냥
  '389687': 'inv_glaive_1h_artifactaldrochi_d_03dual',  // 혼돈의 새김
  '389713': 'ability_hunter_displacement',  // 빠른 후퇴
  '389715': 'ability_demonhunter_sigilofchains',  // 사슬 인장
  '390155': 'inv_glaive_1h_artifactaldrochi_d_03dual',  // 탄력의 인장
  '390163': 'inv_ability_demonhunter_elysiandecree',  // 엘리시움 칙령

  // 기원사 누락 아이콘
  '351338': 'ability_evoker_quell',  // 진정시키기
  '355913': 'ability_evoker_emeraldblossom',  // 에메랄드 꽃
  '355936': 'ability_evoker_dreambreath',  // 꿈의 숨결
  '356995': 'ability_evoker_disintegrate',  // 분해
  '357170': 'ability_evoker_timedilation',  // 시간 팽창
  '357208': 'ability_evoker_firebreath',  // 화염 숨결
  '357210': 'ability_evoker_deepbreath',  // 깊은 숨결
  '357211': 'ability_evoker_pyre',  // 화장용 장작더미
  '357214': 'ability_racial_wingbuffet',  // 날개 강타
  '358267': 'ability_evoker_hover',  // 공중 부양
  '358385': 'ability_earthen_pillar',  // 산사태
  '358733': 'ability_evoker_glide',  // 활강
  '359073': 'ability_evoker_eternitysurge',  // 영원의 쇄도
  '360806': 'ability_xavius_dreamsimulacrum',  // 수면 보행
  '360827': 'ability_evoker_blisteringscales',  // 물집 비늘
  '360995': 'ability_evoker_rescue',  // 구조
  '361021': 'ability_hunter_aspectoftheviper',  // 파란
  '361195': 'ability_evoker_essenceofbronze',  // 청동의 정수
  '361227': 'ability_evoker_return',  // 귀환
  '361469': 'ability_evoker_livingflame',  // 살아있는 불꽃
  '361500': 'ability_evoker_livingflame',  // 루비 생명의 불꽃
  '362969': 'ability_evoker_azurestrike',  // 하늘빛 일격
  '363510': 'ability_evoker_masterylifebinder',  // 생명 결속자
  '363534': 'ability_evoker_rewind',  // 되감기
  '364342': 'ability_evoker_blessingofthebronze',  // 청동의 축복
  '364343': 'ability_evoker_echo',  // 메아리
  '365350': 'spell_arcane_blast',  // 비전 폭발
  '365585': 'ability_evoker_fontofmagic_green',  // 마나 샘
  '366155': 'ability_evoker_reversion',  // 역전
  '367226': 'ability_evoker_spiritbloom2',  // 정기의 꽃
  '368432': 'ability_evoker_unravel',  // 해체
  '368847': 'ability_evoker_firestorm',  // 화염 폭풍
  '368970': 'ability_racial_tailswipe',  // 비늘 티핑
  '369459': 'ability_evoker_blue_01',  // 천의 축복
  '369536': 'ability_racial_soar',  // 비행
  '370452': 'ability_evoker_chargedblast',  // 충전된 작렬
  '370455': 'spell_arcane_arcanepotency',  // 비전 지능
  '370537': 'ability_evoker_stasis',  // 정지
  '370553': 'ability_evoker_tipthescales',  // 균형 깨뜨리기
  '370665': 'ability_evoker_flywithme',  // 구조
  '370960': 'ability_evoker_green_01',  // 청동빛 에메랄드
  '373861': 'ability_evoker_temporalanomaly',  // 시간 변이
  '374348': 'ability_evoker_masterylifebinder_red',  // 갱신의 불길
  '375087': 'ability_evoker_dragonrage',  // 용의 분노
  '403631': 'ability_evoker_breathofeons',  // 시대의 숨결
  '409311': 'ability_evoker_prescience',  // 선견지명
  '413984': 'ability_evoker_masterytimewalker'  // 시간여행자
};

// 데이터베이스 업데이트
let updateCount = 0;
let alreadyHasIcon = 0;

Object.keys(db).forEach(id => {
  const skill = db[id];

  // 아이콘이 없거나 물음표인 경우
  if (!skill.icon || skill.icon === 'inv_misc_questionmark') {
    if (comprehensiveIconMapping[id]) {
      db[id].icon = comprehensiveIconMapping[id];
      updateCount++;
    }
  } else {
    alreadyHasIcon++;
  }
});

// 파일 내용 생성
const fileContent = `// TWW Season 3 통합 스킬 데이터베이스
// WoWhead 공식 번역 적용 (ko.wowhead.com 기준)
// 총 ${Object.keys(db).length}개 스킬 - 최종 향상 버전
// 패치: 11.2.0
// 생성일: ${new Date().toISOString()}

const koreanSpellDatabase = ${JSON.stringify(db, null, 2)};

export { koreanSpellDatabase };

export function getKoreanSpellData(spellId) {
  return koreanSpellDatabase[spellId] || null;
}`;

// 파일 저장
fs.writeFileSync(dbPath, fileContent, 'utf8');

console.log(`✅ 스킬 데이터베이스 아이콘 대량 업데이트 완료!`);
console.log(`📊 통계:`);
console.log(`- 업데이트된 아이콘: ${updateCount}개`);
console.log(`- 이미 아이콘 있음: ${alreadyHasIcon}개`);
console.log(`- 전체 스킬: ${Object.keys(db).length}개`);

// 업데이트 후 통계
let totalWithIcon = 0;
let totalWithDesc = 0;
let totalWithCooldown = 0;

Object.values(db).forEach(skill => {
  if (skill.icon && skill.icon !== 'inv_misc_questionmark') totalWithIcon++;
  if (skill.description) totalWithDesc++;
  if (skill.cooldown) totalWithCooldown++;
});

console.log(`\n📈 최종 데이터베이스 상태:`);
console.log(`- 아이콘 보유: ${totalWithIcon}/${Object.keys(db).length} (${(totalWithIcon/Object.keys(db).length*100).toFixed(1)}%)`);
console.log(`- 설명 보유: ${totalWithDesc}/${Object.keys(db).length} (${(totalWithDesc/Object.keys(db).length*100).toFixed(1)}%)`);
console.log(`- 재사용 대기시간: ${totalWithCooldown}/${Object.keys(db).length} (${(totalWithCooldown/Object.keys(db).length*100).toFixed(1)}%)`);