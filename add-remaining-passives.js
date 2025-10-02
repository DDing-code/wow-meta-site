// TWW Season 3 나머지 클래스 패시브 특성 추가 스크립트
const fs = require('fs');
const path = require('path');

// 도적 패시브 특성
const roguePassives = {
  // 클래스 트리 패시브
  "2823": { name: "Deadly Poison", kr: "맹독", type: "passive" },
  "5171": { name: "Slice and Dice", kr: "난도질", type: "passive" },
  "14161": { name: "Ruthlessness", kr: "무자비", type: "passive" },
  "14190": { name: "Improved Sprint", kr: "전력 질주 연마", type: "passive" },
  "31209": { name: "Master Poisoner", kr: "독의 대가", type: "passive" },
  "79140": { name: "Vendetta", kr: "원한", type: "passive" },
  "193640": { name: "Elaborate Planning", kr: "정교한 계획", type: "passive" },
  "381623": { name: "Thistle Tea", kr: "가시엉겅퀴 차", type: "passive" },

  // 암살 전문화 패시브
  "196819": { name: "Envenom", kr: "독살", spec: "assassination", type: "passive" },
  "200806": { name: "Exsanguinate", kr: "방혈", spec: "assassination", type: "passive" },
  "245388": { name: "Toxic Blade", kr: "맹독 칼날", spec: "assassination", type: "passive" },
  "385627": { name: "Kingsbane", kr: "왕의 파멸", spec: "assassination", type: "passive" },

  // 무법 전문화 패시브
  "196937": { name: "Ghostly Strike", kr: "유령의 일격", spec: "outlaw", type: "passive" },
  "271877": { name: "Blade Rush", kr: "칼날 질풍", spec: "outlaw", type: "passive" },
  "315341": { name: "Between the Eyes", kr: "미간 사격", spec: "outlaw", type: "passive" },
  "381989": { name: "Keep it Rolling", kr: "계속 굴려라", spec: "outlaw", type: "passive" },

  // 잠행 전문화 패시브
  "196951": { name: "Master of Shadows", kr: "그림자 숙련", spec: "subtlety", type: "passive" },
  "277925": { name: "Shuriken Tornado", kr: "수리검 회오리", spec: "subtlety", type: "passive" },
  "280719": { name: "Secret Technique", kr: "비밀 기술", spec: "subtlety", type: "passive" },
  "385125": { name: "Shadowcraft", kr: "그림자 세공", spec: "subtlety", type: "passive" }
};

// 사제 패시브 특성
const priestPassives = {
  // 클래스 트리 패시브
  "586": { name: "Fade", kr: "소실", type: "passive" },
  "15237": { name: "Holy Nova", kr: "신성한 폭발", type: "passive" },
  "20711": { name: "Spirit of Redemption", kr: "구원의 영혼", type: "passive" },
  "64843": { name: "Divine Hymn", kr: "천상의 찬가", type: "passive" },
  "109142": { name: "Light's Inspiration", kr: "빛의 영감", type: "passive" },
  "193157": { name: "Benediction", kr: "축복", type: "passive" },
  "391154": { name: "Holy Ward", kr: "신성한 수호", type: "passive" },

  // 수양 전문화 패시브
  "47540": { name: "Penance", kr: "고해", spec: "discipline", type: "passive" },
  "109175": { name: "Divine Insight", kr: "천상의 통찰", spec: "discipline", type: "passive" },
  "194509": { name: "Power Word: Radiance", kr: "신의 권능: 광휘", spec: "discipline", type: "passive" },
  "314867": { name: "Shadow Covenant", kr: "암흑 서약", spec: "discipline", type: "passive" },

  // 신성 전문화 패시브
  "64901": { name: "Symbol of Hope", kr: "희망의 상징", spec: "holy", type: "passive" },
  "200183": { name: "Apotheosis", kr: "신격화", spec: "holy", type: "passive" },
  "265202": { name: "Holy Word: Salvation", kr: "신성한 명령: 구원", spec: "holy", type: "passive" },
  "372835": { name: "Lightweaver", kr: "빛 엮기", spec: "holy", type: "passive" },

  // 암흑 전문화 패시브
  "205065": { name: "Void Eruption", kr: "공허 분출", spec: "shadow", type: "passive" },
  "228260": { name: "Void Eruption", kr: "공허 분출", spec: "shadow", type: "passive" },
  "391109": { name: "Dark Ascension", kr: "어둠의 승천", spec: "shadow", type: "passive" },
  "391403": { name: "Mind Spike", kr: "정신 쐐기", spec: "shadow", type: "passive" }
};

// 죽음의 기사 패시브 특성
const deathKnightPassives = {
  // 클래스 트리 패시브
  "43265": { name: "Death and Decay", kr: "죽음과 부패", type: "passive" },
  "48707": { name: "Anti-Magic Shell", kr: "대마법 보호막", type: "passive" },
  "49998": { name: "Death Strike", kr: "죽음의 일격", type: "passive" },
  "51462": { name: "Runeforging", kr: "룬 벼리기", type: "passive" },
  "56222": { name: "Dark Command", kr: "어둠의 명령", type: "passive" },
  "194679": { name: "Rune Tap", kr: "룬 전환", type: "passive" },
  "374585": { name: "Rune Mastery", kr: "룬 숙련", type: "passive" },

  // 혈기 전문화 패시브
  "49028": { name: "Dancing Rune Weapon", kr: "춤추는 룬 무기", spec: "blood", type: "passive" },
  "195182": { name: "Marrowrend", kr: "골수 분쇄", spec: "blood", type: "passive" },
  "206930": { name: "Heart Strike", kr: "심장 강타", spec: "blood", type: "passive" },
  "219786": { name: "Ossuary", kr: "납골당", spec: "blood", type: "passive" },

  // 냉기 전문화 패시브
  "51271": { name: "Pillar of Frost", kr: "얼음 기둥", spec: "frost", type: "passive" },
  "152279": { name: "Breath of Sindragosa", kr: "신드라고사의 숨결", spec: "frost", type: "passive" },
  "194909": { name: "Icy Talons", kr: "얼음 발톱", spec: "frost", type: "passive" },
  "207126": { name: "Icecap", kr: "빙관", spec: "frost", type: "passive" },

  // 부정 전문화 패시브
  "55090": { name: "Scourge Strike", kr: "스컬지 일격", spec: "unholy", type: "passive" },
  "63560": { name: "Dark Transformation", kr: "어둠의 변신", spec: "unholy", type: "passive" },
  "152280": { name: "Defile", kr: "파멸", spec: "unholy", type: "passive" },
  "390178": { name: "Festering Wounds", kr: "고름 상처", spec: "unholy", type: "passive" }
};

// 주술사 패시브 특성
const shamanPassives = {
  // 클래스 트리 패시브
  "974": { name: "Earth Shield", kr: "대지 보호막", type: "passive" },
  "2645": { name: "Ghost Wolf", kr: "늑대 정령", type: "passive" },
  "8042": { name: "Earth Shock", kr: "대지 충격", type: "passive" },
  "51505": { name: "Lava Burst", kr: "용암 폭발", type: "passive" },
  "57994": { name: "Wind Shear", kr: "날카로운 바람", type: "passive" },
  "192077": { name: "Wind Rush Totem", kr: "바람 질주 토템", type: "passive" },
  "192222": { name: "Liquid Magma Totem", kr: "액체 마그마 토템", type: "passive" },

  // 정기 전문화 패시브
  "191634": { name: "Stormkeeper", kr: "폭풍 수호자", spec: "elemental", type: "passive" },
  "192249": { name: "Storm Elemental", kr: "폭풍 정령", spec: "elemental", type: "passive" },
  "260734": { name: "Master of the Elements", kr: "원소의 대가", spec: "elemental", type: "passive" },
  "378275": { name: "Elemental Equilibrium", kr: "원소 평형", spec: "elemental", type: "passive" },

  // 고양 전문화 패시브
  "17364": { name: "Stormstrike", kr: "폭풍의 일격", spec: "enhancement", type: "passive" },
  "60103": { name: "Lava Lash", kr: "용암 채찍", spec: "enhancement", type: "passive" },
  "187874": { name: "Crash Lightning", kr: "번개 강타", spec: "enhancement", type: "passive" },
  "333974": { name: "Fire Nova", kr: "화염 폭발", spec: "enhancement", type: "passive" },

  // 복원 전문화 패시브
  "5394": { name: "Healing Stream Totem", kr: "치유의 토템", spec: "restoration", type: "passive" },
  "61295": { name: "Riptide", kr: "성난 해일", spec: "restoration", type: "passive" },
  "73920": { name: "Healing Rain", kr: "치유의 비", spec: "restoration", type: "passive" },
  "157153": { name: "Cloudburst Totem", kr: "폭우 토템", spec: "restoration", type: "passive" }
};

// 마법사 패시브 특성
const magePassives = {
  // 클래스 트리 패시브
  "1459": { name: "Arcane Intellect", kr: "신비한 지능", type: "passive" },
  "1953": { name: "Blink", kr: "점멸", type: "passive" },
  "2139": { name: "Counterspell", kr: "마법 차단", type: "passive" },
  "12051": { name: "Evocation", kr: "환기", type: "passive" },
  "55342": { name: "Mirror Image", kr: "환영 복제", type: "passive" },
  "235219": { name: "Cold Snap", kr: "냉각", type: "passive" },
  "382440": { name: "Shifting Power", kr: "변환의 힘", type: "passive" },

  // 비전 전문화 패시브
  "80208": { name: "Arcane Orb", kr: "비전 구슬", spec: "arcane", type: "passive" },
  "153626": { name: "Arcane Orb", kr: "비전 구슬", spec: "arcane", type: "passive" },
  "321507": { name: "Touch of the Magi", kr: "마법사의 손길", spec: "arcane", type: "passive" },
  "365350": { name: "Arcane Surge", kr: "비전 쇄도", spec: "arcane", type: "passive" },

  // 화염 전문화 패시브
  "31661": { name: "Dragon's Breath", kr: "용의 숨결", spec: "fire", type: "passive" },
  "153561": { name: "Meteor", kr: "운석", spec: "fire", type: "passive" },
  "190319": { name: "Combustion", kr: "발화", spec: "fire", type: "passive" },
  "257541": { name: "Phoenix Flames", kr: "불사조 화염", spec: "fire", type: "passive" },

  // 냉기 전문화 패시브
  "12472": { name: "Icy Veins", kr: "얼음 핏줄", spec: "frost", type: "passive" },
  "84714": { name: "Frozen Orb", kr: "얼어붙은 구슬", spec: "frost", type: "passive" },
  "199786": { name: "Glacial Spike", kr: "빙하 가시", spec: "frost", type: "passive" },
  "205021": { name: "Ray of Frost", kr: "냉기 광선", spec: "frost", type: "passive" }
};

// 흑마법사 패시브 특성
const warlockPassives = {
  // 클래스 트리 패시브
  "1714": { name: "Curse of Tongues", kr: "언어의 저주", type: "passive" },
  "5740": { name: "Rain of Fire", kr: "불의 비", type: "passive" },
  "20707": { name: "Soulstone", kr: "영혼석", type: "passive" },
  "104773": { name: "Unending Resolve", kr: "영원한 결의", type: "passive" },
  "108370": { name: "Soul Leech", kr: "영혼 착취", type: "passive" },
  "111400": { name: "Burning Rush", kr: "불타는 질주", type: "passive" },
  "264106": { name: "Deathbolt", kr: "죽음의 화살", type: "passive" },

  // 고통 전문화 패시브
  "48181": { name: "Haunt", kr: "출몰", spec: "affliction", type: "passive" },
  "63106": { name: "Siphon Life", kr: "생명력 착취", spec: "affliction", type: "passive" },
  "205145": { name: "Demonic Circle", kr: "악마의 마법진", spec: "affliction", type: "passive" },
  "386951": { name: "Soul Swap", kr: "영혼 바꾸기", spec: "affliction", type: "passive" },

  // 악마 전문화 패시브
  "264057": { name: "Soul Strike", kr: "영혼 일격", spec: "demonology", type: "passive" },
  "264119": { name: "Summon Vilefiend", kr: "사악한 마귀 소환", spec: "demonology", type: "passive" },
  "265187": { name: "Summon Demonic Tyrant", kr: "악마 폭군 소환", spec: "demonology", type: "passive" },
  "267217": { name: "Nether Portal", kr: "황천의 차원문", spec: "demonology", type: "passive" },

  // 파괴 전문화 패시브
  "1122": { name: "Summon Infernal", kr: "지옥불정령 소환", spec: "destruction", type: "passive" },
  "17962": { name: "Conflagrate", kr: "점화", spec: "destruction", type: "passive" },
  "116858": { name: "Chaos Bolt", kr: "혼돈의 화살", spec: "destruction", type: "passive" },
  "196408": { name: "Shadowburn", kr: "어둠의 불길", spec: "destruction", type: "passive" }
};

// 수도사 패시브 특성
const monkPassives = {
  // 클래스 트리 패시브
  "115313": { name: "Summon Jade Serpent Statue", kr: "옥룡상 소환", type: "passive" },
  "115450": { name: "Detox", kr: "해독", type: "passive" },
  "116095": { name: "Disable", kr: "해제", type: "passive" },
  "116680": { name: "Thunder Focus Tea", kr: "우레 집중차", type: "passive" },
  "116841": { name: "Tiger's Lust", kr: "범의 욕망", type: "passive" },
  "119381": { name: "Leg Sweep", kr: "다리 후려차기", type: "passive" },
  "322101": { name: "Expel Harm", kr: "해악 축출", type: "passive" },

  // 양조 전문화 패시브
  "115176": { name: "Zen Meditation", kr: "명상", spec: "brewmaster", type: "passive" },
  "121253": { name: "Keg Smash", kr: "술통 휘둘러치기", spec: "brewmaster", type: "passive" },
  "322507": { name: "Celestial Brew", kr: "천신주", spec: "brewmaster", type: "passive" },
  "387184": { name: "Weapons of Order", kr: "질서의 무기", spec: "brewmaster", type: "passive" },

  // 운무 전문화 패시브
  "107428": { name: "Rising Sun Kick", kr: "태양 차오르기", spec: "mistweaver", type: "passive" },
  "115151": { name: "Renewing Mist", kr: "소생의 안개", spec: "mistweaver", type: "passive" },
  "116645": { name: "Teachings of the Monastery", kr: "수도원의 가르침", spec: "mistweaver", type: "passive" },
  "197908": { name: "Mana Tea", kr: "마나차", spec: "mistweaver", type: "passive" },

  // 풍운 전문화 패시브
  "101545": { name: "Flying Serpent Kick", kr: "비룡차기", spec: "windwalker", type: "passive" },
  "113656": { name: "Fists of Fury", kr: "분노의 주먹", spec: "windwalker", type: "passive" },
  "152173": { name: "Serenity", kr: "평온", spec: "windwalker", type: "passive" },
  "392983": { name: "Strike of the Windlord", kr: "바람 군주의 일격", spec: "windwalker", type: "passive" }
};

// 드루이드 패시브 특성
const druidPassives = {
  // 클래스 트리 패시브
  "774": { name: "Rejuvenation", kr: "회복", type: "passive" },
  "1126": { name: "Mark of the Wild", kr: "야생의 징표", type: "passive" },
  "5487": { name: "Bear Form", kr: "곰 변신", type: "passive" },
  "8921": { name: "Moonfire", kr: "달빛섬광", type: "passive" },
  "22812": { name: "Barkskin", kr: "나무 껍질", type: "passive" },
  "106839": { name: "Skull Bash", kr: "두개골 강타", type: "passive" },
  "197625": { name: "Moonkin Form", kr: "달빛야수 변신", type: "passive" },

  // 조화 전문화 패시브
  "78674": { name: "Starsurge", kr: "별빛쇄도", spec: "balance", type: "passive" },
  "191034": { name: "Starfall", kr: "별똥별", spec: "balance", type: "passive" },
  "202347": { name: "Stellar Flare", kr: "항성의 섬광", spec: "balance", type: "passive" },
  "274281": { name: "New Moon", kr: "초승달", spec: "balance", type: "passive" },

  // 야성 전문화 패시브
  "5217": { name: "Tiger's Fury", kr: "호랑이의 분노", spec: "feral", type: "passive" },
  "102543": { name: "Incarnation: Avatar of Ashamane", kr: "화신: 아샤메인의 화신", spec: "feral", type: "passive" },
  "106951": { name: "Berserk", kr: "광폭화", spec: "feral", type: "passive" },
  "274837": { name: "Feral Frenzy", kr: "야성의 광란", spec: "feral", type: "passive" },

  // 수호 전문화 패시브
  "33917": { name: "Mangle", kr: "짓이기기", spec: "guardian", type: "passive" },
  "61336": { name: "Survival Instincts", kr: "생존 본능", spec: "guardian", type: "passive" },
  "77758": { name: "Thrash", kr: "난타", spec: "guardian", type: "passive" },
  "192081": { name: "Ironfur", kr: "무쇠가죽", spec: "guardian", type: "passive" },

  // 회복 전문화 패시브
  "18562": { name: "Swiftmend", kr: "신속한 치유", spec: "restoration", type: "passive" },
  "33891": { name: "Incarnation: Tree of Life", kr: "화신: 생명의 나무", spec: "restoration", type: "passive" },
  "48438": { name: "Wild Growth", kr: "급속 성장", spec: "restoration", type: "passive" },
  "102342": { name: "Ironbark", kr: "무쇠껍질", spec: "restoration", type: "passive" }
};

// 악마사냥꾼 패시브 특성
const demonHunterPassives = {
  // 클래스 트리 패시브
  "178940": { name: "Shattered Souls", kr: "산산조각난 영혼", type: "passive" },
  "188499": { name: "Blade Dance", kr: "칼날 춤", type: "passive" },
  "195072": { name: "Fel Rush", kr: "지옥 질주", type: "passive" },
  "196055": { name: "Demon's Bite", kr: "악마의 이빨", type: "passive" },
  "203720": { name: "Demon Spikes", kr: "악마 쐐기", type: "passive" },
  "204596": { name: "Sigil of Flame", kr: "화염 인장", type: "passive" },
  "211881": { name: "Fel Eruption", kr: "지옥 분출", type: "passive" },

  // 파멸 전문화 패시브
  "191427": { name: "Metamorphosis", kr: "탈태", spec: "havoc", type: "passive" },
  "198013": { name: "Eye Beam", kr: "눈빔", spec: "havoc", type: "passive" },
  "258920": { name: "Immolation Aura", kr: "제물의 오라", spec: "havoc", type: "passive" },
  "342817": { name: "Glaive Tempest", kr: "글레이브 폭풍", spec: "havoc", type: "passive" },

  // 복수 전문화 패시브
  "187827": { name: "Metamorphosis", kr: "탈태", spec: "vengeance", type: "passive" },
  "202137": { name: "Sigil of Silence", kr: "침묵의 인장", spec: "vengeance", type: "passive" },
  "202140": { name: "Last Resort", kr: "최후의 수단", spec: "vengeance", type: "passive" },
  "263642": { name: "Fracture", kr: "분열", spec: "vengeance", type: "passive" }
};

// 기원사 패시브 특성
const evokerPassives = {
  // 클래스 트리 패시브
  "351239": { name: "Essence Burst", kr: "정수 폭발", type: "passive" },
  "355913": { name: "Emerald Blossom", kr: "에메랄드 꽃", type: "passive" },
  "357208": { name: "Fire Breath", kr: "화염 숨결", type: "passive" },
  "357210": { name: "Deep Breath", kr: "깊은 숨", type: "passive" },
  "358267": { name: "Hover", kr: "공중 부양", type: "passive" },
  "360995": { name: "Verdant Embrace", kr: "신록의 포옹", type: "passive" },
  "361469": { name: "Living Flame", kr: "살아있는 불꽃", type: "passive" },

  // 황폐 전문화 패시브
  "356995": { name: "Disintegrate", kr: "분해", spec: "devastation", type: "passive" },
  "359073": { name: "Eternity Surge", kr: "영원의 쇄도", spec: "devastation", type: "passive" },
  "375087": { name: "Dragonrage", kr: "용의 분노", spec: "devastation", type: "passive" },
  "382266": { name: "Fire Breath", kr: "화염 숨결", spec: "devastation", type: "passive" },

  // 보존 전문화 패시브
  "355936": { name: "Dream Breath", kr: "꿈의 숨결", spec: "preservation", type: "passive" },
  "359816": { name: "Dream Flight", kr: "꿈의 비행", spec: "preservation", type: "passive" },
  "363534": { name: "Rewind", kr: "되감기", spec: "preservation", type: "passive" },
  "370537": { name: "Stasis", kr: "정지", spec: "preservation", type: "passive" },

  // 증강 전문화 패시브
  "395152": { name: "Eruption", kr: "분출", spec: "augmentation", type: "passive" },
  "395160": { name: "Ebon Might", kr: "흑요석 위력", spec: "augmentation", type: "passive" },
  "396286": { name: "Upheaval", kr: "격변", spec: "augmentation", type: "passive" },
  "406732": { name: "Spatial Paradox", kr: "공간 역설", spec: "augmentation", type: "passive" }
};

// 파일 업데이트 함수
function addPassivesToClass(className, passives) {
  const fileName = `wowdb${className}SkillsComplete.js`;
  const filePath = path.join(__dirname, 'src/data/skills', fileName);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // export const 찾기
    const match = fileContent.match(/export const [\w]+ = ({[\s\S]*?});/);
    if (match) {
      const data = eval('(' + match[1] + ')');

      // talents 카테고리 추가 (패시브)
      if (!data.talents) {
        data.talents = {};
      }

      // 패시브 특성 추가
      Object.entries(passives).forEach(([id, skill]) => {
        data.talents[id] = skill;
      });

      // 파일 재작성
      const varName = `wowdb${className}SkillsComplete`;
      const newContent = `// TWW Season 3 ${getKoreanClassName(className)} 스킬 데이터
// The War Within 11.0.5 - 시즌 3
// PvP 특성 제외, 현재 활성화된 스킬만 포함
// 패시브 특성 포함

export const ${varName} = ${JSON.stringify(data, null, 2)};

// 스킬 검색 함수
export function getWowDB${className}Skill(skillId) {
  const categories = Object.keys(${varName});

  for (const category of categories) {
    if (${varName}[category] && ${varName}[category][skillId]) {
      return {
        ...${varName}[category][skillId],
        category,
        id: skillId
      };
    }
  }

  return null;
}`;

      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ ${getKoreanClassName(className)} 패시브 특성 추가 완료`);
    }
  } catch (error) {
    console.error(`❌ ${className} 파일 처리 오류:`, error.message);
  }
}

// 클래스명 한글 변환
function getKoreanClassName(className) {
  const translations = {
    'Rogue': '도적',
    'Priest': '사제',
    'DeathKnight': '죽음의 기사',
    'Shaman': '주술사',
    'Mage': '마법사',
    'Warlock': '흑마법사',
    'Monk': '수도사',
    'Druid': '드루이드',
    'DemonHunter': '악마사냥꾼',
    'Evoker': '기원사'
  };
  return translations[className] || className;
}

// 실행
addPassivesToClass('Rogue', roguePassives);
addPassivesToClass('Priest', priestPassives);
addPassivesToClass('DeathKnight', deathKnightPassives);
addPassivesToClass('Shaman', shamanPassives);
addPassivesToClass('Mage', magePassives);
addPassivesToClass('Warlock', warlockPassives);
addPassivesToClass('Monk', monkPassives);
addPassivesToClass('Druid', druidPassives);
addPassivesToClass('DemonHunter', demonHunterPassives);
addPassivesToClass('Evoker', evokerPassives);

console.log('\n✅ 모든 클래스 패시브 특성 추가 완료!');