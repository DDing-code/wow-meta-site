// TWW Season 3 모든 나머지 클래스 특성 추가
// PvP 특성 제외, 11.2 패치 기준

const fs = require('fs');
const path = require('path');

function addAllRemainingTalents() {
  const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
  let content = fs.readFileSync(dbPath, 'utf8');

  console.log('🔍 TWW Season 3 나머지 클래스 특성 추가...\n');

  // 악마사냥꾼 특성
  const demonHunterTalents = {
    // 클래스 특성
    "188499": { name: "칼춤", icon: "ability_demonhunter_bladedance", type: "talent", class: "DEMONHUNTER", category: "class", koreanName: "칼춤", englishName: "Blade Dance" },
    "198013": { name: "눈빔", icon: "ability_demonhunter_eyebeam", type: "talent", class: "DEMONHUNTER", category: "class", koreanName: "눈빔", englishName: "Eye Beam" },
    "196718": { name: "어둠의 길", icon: "spell_warlock_demonicportal_purple", type: "talent", class: "DEMONHUNTER", category: "class", koreanName: "어둠의 길", englishName: "Darkness" },

    // 파멸 전문화
    "191427": { name: "탈태", icon: "ability_demonhunter_metamorphasisdps", type: "talent", class: "DEMONHUNTER", spec: "havoc", category: "specialization", koreanName: "탈태", englishName: "Metamorphosis" },
    "258920": { name: "임박한 파멸", icon: "spell_shadow_lifedrain", type: "talent", class: "DEMONHUNTER", spec: "havoc", category: "specialization", koreanName: "임박한 파멸", englishName: "Immolation Aura" },

    // 복수 전문화
    "187827": { name: "악마 쐐기", icon: "ability_demonhunter_demonspikes", type: "talent", class: "DEMONHUNTER", spec: "vengeance", category: "specialization", koreanName: "악마 쐐기", englishName: "Demon Spikes" },
    "204596": { name: "인장 파쇄", icon: "ability_bossdemonhunter_sigilofchains", type: "talent", class: "DEMONHUNTER", spec: "vengeance", category: "specialization", koreanName: "인장 파쇄", englishName: "Sigil of Flame" },

    // 영웅 특성
    "442008": { name: "알드라치 파괴자", icon: "inv_glaive_1h_npc_d_02", type: "heroTalent", class: "DEMONHUNTER", heroTree: "aldrachi-reaver", koreanName: "알드라치 파괴자", englishName: "Aldrachi Reaver" },
    "442009": { name: "지옥상흔", icon: "ability_demonhunter_concentratedsigils", type: "heroTalent", class: "DEMONHUNTER", heroTree: "fel-scarred", koreanName: "지옥상흔", englishName: "Fel-scarred" }
  };

  // 드루이드 특성
  const druidTalents = {
    // 클래스 특성
    "5487": { name: "곰 변신", icon: "ability_racial_bearform", type: "talent", class: "DRUID", category: "class", koreanName: "곰 변신", englishName: "Bear Form" },
    "768": { name: "표범 변신", icon: "ability_druid_catform", type: "talent", class: "DRUID", category: "class", koreanName: "표범 변신", englishName: "Cat Form" },
    "24858": { name: "달빛야수 변신", icon: "ability_druid_moonkin", type: "talent", class: "DRUID", category: "class", koreanName: "달빛야수 변신", englishName: "Moonkin Form" },

    // 조화 전문화
    "194153": { name: "별똥별", icon: "spell_arcane_starfire", type: "talent", class: "DRUID", spec: "balance", category: "specialization", koreanName: "별똥별", englishName: "Starfall" },
    "202770": { name: "엘룬의 격노", icon: "spell_nature_natureguardian", type: "talent", class: "DRUID", spec: "balance", category: "specialization", koreanName: "엘룬의 격노", englishName: "Fury of Elune" },

    // 야성 전문화
    "106951": { name: "광폭화", icon: "ability_druid_berserk", type: "talent", class: "DRUID", spec: "feral", category: "specialization", koreanName: "광폭화", englishName: "Berserk" },
    "102543": { name: "화신: 아샤메인의 왕", icon: "spell_druid_incarnation", type: "talent", class: "DRUID", spec: "feral", category: "specialization", koreanName: "화신: 아샤메인의 왕", englishName: "Incarnation: King of the Jungle" },

    // 영웅 특성
    "442010": { name: "숲의 수호자", icon: "ability_druid_manatree", type: "heroTalent", class: "DRUID", heroTree: "keeper-of-the-grove", koreanName: "숲의 수호자", englishName: "Keeper of the Grove" },
    "442011": { name: "엘룬의 선택받은 자", icon: "spell_nature_starfall", type: "heroTalent", class: "DRUID", heroTree: "elunes-chosen", koreanName: "엘룬의 선택받은 자", englishName: "Elune's Chosen" },
    "442012": { name: "야생추적자", icon: "ability_hunter_pet_raptor", type: "heroTalent", class: "DRUID", heroTree: "wildstalker", koreanName: "야생추적자", englishName: "Wildstalker" }
  };

  // 기원사 특성
  const evokerTalents = {
    // 클래스 특성
    "357208": { name: "불의 숨결", icon: "ability_evoker_firebreath", type: "talent", class: "EVOKER", category: "class", koreanName: "불의 숨결", englishName: "Fire Breath" },
    "390386": { name: "활공", icon: "ability_racial_soar", type: "talent", class: "EVOKER", category: "class", koreanName: "활공", englishName: "Glide" },
    "368970": { name: "비늘 가죽", icon: "inv_misc_rubysanctum2", type: "talent", class: "EVOKER", category: "class", koreanName: "비늘 가죽", englishName: "Scales" },

    // 황폐 전문화
    "369536": { name: "용의 분노", icon: "ability_evoker_dragonrage", type: "talent", class: "EVOKER", spec: "devastation", category: "specialization", koreanName: "용의 분노", englishName: "Dragonrage" },
    "368847": { name: "영원의 쇄도", icon: "ability_evoker_eternitysurge", type: "talent", class: "EVOKER", spec: "devastation", category: "specialization", koreanName: "영원의 쇄도", englishName: "Eternity Surge" },

    // 보존 전문화
    "382266": { name: "시간의 정수", icon: "ability_evoker_temporalanomaly", type: "talent", class: "EVOKER", spec: "preservation", category: "specialization", koreanName: "시간의 정수", englishName: "Temporal Anomaly" },
    "370960": { name: "에메랄드 숨결", icon: "ability_evoker_emeraldbreath", type: "talent", class: "EVOKER", spec: "preservation", category: "specialization", koreanName: "에메랄드 숨결", englishName: "Emerald Breath" },

    // 영웅 특성
    "442013": { name: "화염조각가", icon: "ability_evoker_masterylifebinder_red", type: "heroTalent", class: "EVOKER", heroTree: "flameshaper", koreanName: "화염조각가", englishName: "Flameshaper" },
    "442014": { name: "용비늘 사령관", icon: "ability_evoker_aspectsfavor", type: "heroTalent", class: "EVOKER", heroTree: "scalecommander", koreanName: "용비늘 사령관", englishName: "Scalecommander" },
    "442015": { name: "시간수호자", icon: "ability_evoker_temporalwound", type: "heroTalent", class: "EVOKER", heroTree: "chronowarden", koreanName: "시간수호자", englishName: "Chronowarden" }
  };

  // 사냥꾼 특성
  const hunterTalents = {
    // 클래스 특성
    "19574": { name: "야수의 격노", icon: "ability_druid_ferociousbite", type: "talent", class: "HUNTER", category: "class", koreanName: "야수의 격노", englishName: "Bestial Wrath" },
    "186257": { name: "치타의 상", icon: "ability_mount_jungletiger", type: "talent", class: "HUNTER", category: "class", koreanName: "치타의 상", englishName: "Aspect of the Cheetah" },
    "186265": { name: "거북의 상", icon: "ability_hunter_aspectoftheviper", type: "talent", class: "HUNTER", category: "class", koreanName: "거북의 상", englishName: "Aspect of the Turtle" },

    // 야수 전문화
    "193530": { name: "야생의 상", icon: "spell_nature_protectionformnature", type: "talent", class: "HUNTER", spec: "beast-mastery", category: "specialization", koreanName: "야생의 상", englishName: "Aspect of the Wild" },
    "201430": { name: "쇄도", icon: "ability_hunter_stampede", type: "talent", class: "HUNTER", spec: "beast-mastery", category: "specialization", koreanName: "쇄도", englishName: "Stampede" },

    // 사격 전문화
    "260402": { name: "속사", icon: "ability_hunter_lethalshots", type: "talent", class: "HUNTER", spec: "marksmanship", category: "specialization", koreanName: "속사", englishName: "Double Tap" },
    "288613": { name: "정조준", icon: "ability_hunter_mastermarksman", type: "talent", class: "HUNTER", spec: "marksmanship", category: "specialization", koreanName: "정조준", englishName: "Trueshot" },

    // 영웅 특성
    "442016": { name: "무리우두머리", icon: "ability_hunter_lonewolf", type: "heroTalent", class: "HUNTER", heroTree: "pack-leader", koreanName: "무리우두머리", englishName: "Pack Leader" },
    "442017": { name: "어둠 순찰자", icon: "ability_theblackarrow", type: "heroTalent", class: "HUNTER", heroTree: "dark-ranger", koreanName: "어둠 순찰자", englishName: "Dark Ranger" },
    "442018": { name: "파수병", icon: "ability_hunter_sentinelowl", type: "heroTalent", class: "HUNTER", heroTree: "sentinel", koreanName: "파수병", englishName: "Sentinel" }
  };

  // 마법사 특성
  const mageTalents = {
    // 클래스 특성
    "12051": { name: "환기", icon: "spell_nature_purge", type: "talent", class: "MAGE", category: "class", koreanName: "환기", englishName: "Evocation" },
    "235313": { name: "불꽃 작렬", icon: "spell_fire_flamebolt", type: "talent", class: "MAGE", category: "class", koreanName: "불꽃 작렬", englishName: "Blazing Barrier" },
    "11426": { name: "얼음 보호막", icon: "spell_frost_frostarmor02", type: "talent", class: "MAGE", category: "class", koreanName: "얼음 보호막", englishName: "Ice Barrier" },

    // 비전 전문화
    "365350": { name: "비전 쇄도", icon: "ability_mage_arcaneorb", type: "talent", class: "MAGE", spec: "arcane", category: "specialization", koreanName: "비전 쇄도", englishName: "Arcane Surge" },
    "321507": { name: "황천 이동", icon: "spell_arcane_teleportundercity", type: "talent", class: "MAGE", spec: "arcane", category: "specialization", koreanName: "황천 이동", englishName: "Touch of the Magi" },

    // 화염 전문화
    "190319": { name: "불태우기", icon: "spell_fire_fireball", type: "talent", class: "MAGE", spec: "fire", category: "specialization", koreanName: "불태우기", englishName: "Combustion" },
    "55342": { name: "거울 분신", icon: "spell_magic_lesserinvisibilty", type: "talent", class: "MAGE", spec: "fire", category: "specialization", koreanName: "거울 분신", englishName: "Mirror Image" },

    // 영웅 특성
    "442019": { name: "태양분노", icon: "spell_fire_soulburn", type: "heroTalent", class: "MAGE", heroTree: "sunfury", koreanName: "태양분노", englishName: "Sunfury" },
    "442020": { name: "서리화염", icon: "spell_frostfire_orb", type: "heroTalent", class: "MAGE", heroTree: "frostfire", koreanName: "서리화염", englishName: "Frostfire" },
    "442021": { name: "주문투척자", icon: "ability_mage_netherwindpresence", type: "heroTalent", class: "MAGE", heroTree: "spellslinger", koreanName: "주문투척자", englishName: "Spellslinger" }
  };

  // 수도사 특성
  const monkTalents = {
    // 클래스 특성
    "115203": { name: "강화주", icon: "ability_monk_fortifyingale_new", type: "talent", class: "MONK", category: "class", koreanName: "강화주", englishName: "Fortifying Brew" },
    "109132": { name: "구르기", icon: "ability_monk_roll", type: "talent", class: "MONK", category: "class", koreanName: "구르기", englishName: "Roll" },
    "115313": { name: "옥룡의 조각상", icon: "ability_monk_summontigerstatue", type: "talent", class: "MONK", category: "class", koreanName: "옥룡의 조각상", englishName: "Summon Jade Serpent Statue" },

    // 양조 전문화
    "119582": { name: "정화주", icon: "inv_misc_beer_06", type: "talent", class: "MONK", spec: "brewmaster", category: "specialization", koreanName: "정화주", englishName: "Purifying Brew" },
    "387184": { name: "흑우 강화주", icon: "inv_drink_28_blackheartgrog", type: "talent", class: "MONK", spec: "brewmaster", category: "specialization", koreanName: "흑우 강화주", englishName: "Weapons of Order" },

    // 운무 전문화
    "115310": { name: "재활", icon: "ability_monk_chiwave", type: "talent", class: "MONK", spec: "mistweaver", category: "specialization", koreanName: "재활", englishName: "Revival" },
    "197908": { name: "마나차", icon: "ability_monk_manatea", type: "talent", class: "MONK", spec: "mistweaver", category: "specialization", koreanName: "마나차", englishName: "Mana Tea" },

    // 영웅 특성
    "442022": { name: "조화의 대가", icon: "ability_monk_jadeserpentbreath", type: "heroTalent", class: "MONK", heroTree: "master-of-harmony", koreanName: "조화의 대가", englishName: "Master of Harmony" },
    "442023": { name: "음영파", icon: "ability_monk_shadowpan", type: "heroTalent", class: "MONK", heroTree: "shado-pan", koreanName: "음영파", englishName: "Shado-Pan" },
    "442024": { name: "천신의 전도체", icon: "ability_monk_transcendence", type: "heroTalent", class: "MONK", heroTree: "conduit-of-the-celestials", koreanName: "천신의 전도체", englishName: "Conduit of the Celestials" }
  };

  // 사제 특성
  const priestTalents = {
    // 클래스 특성
    "17": { name: "신의 권능: 보호막", icon: "spell_holy_powerwordshield", type: "talent", class: "PRIEST", category: "class", koreanName: "신의 권능: 보호막", englishName: "Power Word: Shield" },
    "33076": { name: "구원의 기도", icon: "spell_holy_prayerofmendingtga", type: "talent", class: "PRIEST", category: "class", koreanName: "구원의 기도", englishName: "Prayer of Mending" },
    "32375": { name: "대규모 무효화", icon: "spell_arcane_massdispel", type: "talent", class: "PRIEST", category: "class", koreanName: "대규모 무효화", englishName: "Mass Dispel" },

    // 수양 전문화
    "47536": { name: "환희", icon: "spell_holy_rapture", type: "talent", class: "PRIEST", spec: "discipline", category: "specialization", koreanName: "환희", englishName: "Rapture" },
    "62618": { name: "신의 권능: 방벽", icon: "spell_holy_powerwordbarrier", type: "talent", class: "PRIEST", spec: "discipline", category: "specialization", koreanName: "신의 권능: 방벽", englishName: "Power Word: Barrier" },

    // 신성 전문화
    "64843": { name: "천상의 찬가", icon: "spell_holy_divinehymn", type: "talent", class: "PRIEST", spec: "holy", category: "specialization", koreanName: "천상의 찬가", englishName: "Divine Hymn" },
    "33206": { name: "고통 억제", icon: "spell_holy_painsupression", type: "talent", class: "PRIEST", spec: "holy", category: "specialization", koreanName: "고통 억제", englishName: "Pain Suppression" },

    // 영웅 특성
    "442025": { name: "공허술사", icon: "spell_priest_voidshift", type: "heroTalent", class: "PRIEST", heroTree: "voidweaver", koreanName: "공허술사", englishName: "Voidweaver" },
    "442026": { name: "예언자", icon: "ability_priest_ascendance", type: "heroTalent", class: "PRIEST", heroTree: "oracle", koreanName: "예언자", englishName: "Oracle" },
    "442027": { name: "집정관", icon: "ability_priest_archangel", type: "heroTalent", class: "PRIEST", heroTree: "archon", koreanName: "집정관", englishName: "Archon" }
  };

  // 도적 특성
  const rogueTalents = {
    // 클래스 특성
    "1856": { name: "소멸", icon: "spell_shadow_nethercloak", type: "talent", class: "ROGUE", category: "class", koreanName: "소멸", englishName: "Vanish" },
    "31224": { name: "그림자 망토", icon: "spell_shadow_nethercloak", type: "talent", class: "ROGUE", category: "class", koreanName: "그림자 망토", englishName: "Cloak of Shadows" },
    "5277": { name: "회피", icon: "spell_shadow_shadowward", type: "talent", class: "ROGUE", category: "class", koreanName: "회피", englishName: "Evasion" },

    // 암살 전문화
    "360194": { name: "죽음표식", icon: "ability_rogue_deathmark", type: "talent", class: "ROGUE", spec: "assassination", category: "specialization", koreanName: "죽음표식", englishName: "Deathmark" },
    "385627": { name: "왕도둑", icon: "ability_rogue_kingpin", type: "talent", class: "ROGUE", spec: "assassination", category: "specialization", koreanName: "왕도둑", englishName: "Kingsbane" },

    // 무법 전문화
    "13750": { name: "아드레날린 촉진", icon: "spell_shadow_shadowworddominate", type: "talent", class: "ROGUE", spec: "outlaw", category: "specialization", koreanName: "아드레날린 촉진", englishName: "Adrenaline Rush" },
    "13877": { name: "칼날 소용돌이", icon: "ability_rogue_bladedance", type: "talent", class: "ROGUE", spec: "outlaw", category: "specialization", koreanName: "칼날 소용돌이", englishName: "Blade Flurry" },

    // 영웅 특성
    "442028": { name: "죽음추적자", icon: "ability_rogue_shadowstrike", type: "heroTalent", class: "ROGUE", heroTree: "deathstalker", koreanName: "죽음추적자", englishName: "Deathstalker" },
    "442029": { name: "운명결속", icon: "ability_rogue_fateblade", type: "heroTalent", class: "ROGUE", heroTree: "fatebound", koreanName: "운명결속", englishName: "Fatebound" },
    "442030": { name: "속임수꾼", icon: "ability_rogue_tricksofthetrade", type: "heroTalent", class: "ROGUE", heroTree: "trickster", koreanName: "속임수꾼", englishName: "Trickster" }
  };

  // 주술사 특성
  const shamanTalents = {
    // 클래스 특성
    "108271": { name: "영혼 이동", icon: "spell_shaman_astralshift", type: "talent", class: "SHAMAN", category: "class", koreanName: "영혼 이동", englishName: "Astral Shift" },
    "51886": { name: "회복의 바람 토템", icon: "spell_nature_giftofthewaterspirit", type: "talent", class: "SHAMAN", category: "class", koreanName: "회복의 바람 토템", englishName: "Windfury Totem" },
    "192077": { name: "바람 질주", icon: "ability_shaman_windwalktotem", type: "talent", class: "SHAMAN", category: "class", koreanName: "바람 질주", englishName: "Wind Rush Totem" },

    // 정기 전문화
    "191634": { name: "폭풍수호자", icon: "spell_nature_eyeofthestorm", type: "talent", class: "SHAMAN", spec: "elemental", category: "specialization", koreanName: "폭풍수호자", englishName: "Stormkeeper" },
    "114050": { name: "승천", icon: "spell_fire_elementaldevastation", type: "talent", class: "SHAMAN", spec: "elemental", category: "specialization", koreanName: "승천", englishName: "Ascendance" },

    // 고양 전문화
    "51533": { name: "야수 정령", icon: "spell_shaman_feralspirit", type: "talent", class: "SHAMAN", spec: "enhancement", category: "specialization", koreanName: "야수 정령", englishName: "Feral Spirit" },
    "375982": { name: "근원 정령", icon: "spell_shaman_improvedearthelemental", type: "talent", class: "SHAMAN", spec: "enhancement", category: "specialization", koreanName: "근원 정령", englishName: "Primordial Wave" },

    // 영웅 특성
    "442031": { name: "토템전문가", icon: "spell_shaman_totemic", type: "heroTalent", class: "SHAMAN", heroTree: "totemic", koreanName: "토템전문가", englishName: "Totemic" },
    "442032": { name: "폭풍인도자", icon: "spell_shaman_stormbringer", type: "heroTalent", class: "SHAMAN", heroTree: "stormbringer", koreanName: "폭풍인도자", englishName: "Stormbringer" },
    "442033": { name: "원시술사", icon: "spell_shaman_spectraltransformation", type: "heroTalent", class: "SHAMAN", heroTree: "farseer", koreanName: "원시술사", englishName: "Farseer" }
  };

  // 흑마법사 특성
  const warlockTalents = {
    // 클래스 특성
    "104773": { name: "끝없는 결의", icon: "spell_warlock_demonicempowerment", type: "talent", class: "WARLOCK", category: "class", koreanName: "끝없는 결의", englishName: "Unending Resolve" },
    "20707": { name: "영혼석", icon: "spell_shadow_soulgem", type: "talent", class: "WARLOCK", category: "class", koreanName: "영혼석", englishName: "Soulstone" },
    "111771": { name: "악마의 관문", icon: "spell_warlock_demonicportal_green", type: "talent", class: "WARLOCK", category: "class", koreanName: "악마의 관문", englishName: "Demonic Gateway" },

    // 고통 전문화
    "205180": { name: "암흑시선", icon: "warlock_pvp_siphonlife", type: "talent", class: "WARLOCK", spec: "affliction", category: "specialization", koreanName: "암흑시선", englishName: "Summon Darkglare" },
    "386997": { name: "영혼 부식", icon: "ability_warlock_soulrot", type: "talent", class: "WARLOCK", spec: "affliction", category: "specialization", koreanName: "영혼 부식", englishName: "Soul Rot" },

    // 악마 전문화
    "265187": { name: "악마 폭군 소환", icon: "spell_warlock_summontyrant", type: "talent", class: "WARLOCK", spec: "demonology", category: "specialization", koreanName: "악마 폭군 소환", englishName: "Summon Demonic Tyrant" },
    "267211": { name: "파멸의 피조물", icon: "spell_warlock_nether_portal", type: "talent", class: "WARLOCK", spec: "demonology", category: "specialization", koreanName: "파멸의 피조물", englishName: "Nether Portal" },

    // 영웅 특성
    "442034": { name: "악마술사", icon: "ability_warlock_demonicempowerment", type: "heroTalent", class: "WARLOCK", heroTree: "diabolist", koreanName: "악마술사", englishName: "Diabolist" },
    "442035": { name: "영혼수확자", icon: "ability_warlock_soulharvest", type: "heroTalent", class: "WARLOCK", heroTree: "soul-harvester", koreanName: "영혼수확자", englishName: "Soul Harvester" },
    "442036": { name: "지옥소환사", icon: "ability_warlock_infernal", type: "heroTalent", class: "WARLOCK", heroTree: "hellcaller", koreanName: "지옥소환사", englishName: "Hellcaller" }
  };

  // 모든 특성 통합
  const allTalents = {
    ...demonHunterTalents,
    ...druidTalents,
    ...evokerTalents,
    ...hunterTalents,
    ...mageTalents,
    ...monkTalents,
    ...priestTalents,
    ...rogueTalents,
    ...shamanTalents,
    ...warlockTalents
  };

  // 데이터베이스에 추가
  let addCount = 0;
  let classCount = {};

  Object.entries(allTalents).forEach(([id, skill]) => {
    if (!content.includes(`"${id}"`)) {
      const skillEntry = `  "${id}": ${JSON.stringify(skill, null, 2).replace(/\n/g, '\n  ')},\n`;
      const insertPos = content.lastIndexOf('};');
      content = content.slice(0, insertPos) + skillEntry + content.slice(insertPos);
      addCount++;

      // 클래스별 카운트
      const className = skill.class || 'UNKNOWN';
      classCount[className] = (classCount[className] || 0) + 1;

      console.log(`  ✅ ${skill.category} 특성 추가: ${skill.koreanName} (${id})`);
    }
  });

  // 파일 저장
  fs.writeFileSync(dbPath, content, 'utf8');

  console.log(`\n📊 특성 추가 완료:`);
  console.log(`  - 총 ${addCount}개 특성 추가`);
  console.log(`\n클래스별 추가된 특성:`);
  Object.entries(classCount).forEach(([className, count]) => {
    console.log(`  - ${className}: ${count}개`);
  });
}

// 실행
addAllRemainingTalents();

console.log('\n✅ 모든 나머지 클래스 특성 추가 완료!');
console.log('📌 TWW Season 3 기준, PvP 특성 제외');