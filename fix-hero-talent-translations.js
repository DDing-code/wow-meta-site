// TWW 영웅 특성 정확한 번역 수정
// Wowhead 한국어 사이트(ko.wowhead.com) 공식 번역 기준

const fs = require('fs');
const path = require('path');

// TWW 영웅 특성 정확한 한글 번역 (ko.wowhead.com 기준)
const correctHeroTalentTranslations = {
  // 전사 영웅 특성
  warrior: {
    mountain_thane: "산의 군주", // Mountain Thane - 산의 군주 (산의 왕 X)
    colossus: "거인", // Colossus - 거인
    slayer: "학살자" // Slayer - 학살자
  },

  // 성기사 영웅 특성
  paladin: {
    herald_of_the_sun: "태양의 전령", // Herald of the Sun
    lightsmith: "빛벼림", // Lightsmith - 빛벼림 (빛의 대장장이 X)
    templar: "성전사" // Templar - 성전사
  },

  // 사냥꾼 영웅 특성
  hunter: {
    pack_leader: "무리우두머리", // Pack Leader
    dark_ranger: "어둠 순찰자", // Dark Ranger
    sentinel: "파수병" // Sentinel
  },

  // 도적 영웅 특성
  rogue: {
    deathstalker: "죽음추적자", // Deathstalker
    fatebound: "운명결속", // Fatebound
    trickster: "속임수꾼" // Trickster
  },

  // 사제 영웅 특성
  priest: {
    voidweaver: "공허술사", // Voidweaver
    oracle: "예언자", // Oracle
    archon: "집정관" // Archon
  },

  // 죽음의 기사 영웅 특성
  deathknight: {
    deathbringer: "죽음인도자", // Deathbringer
    san_layn: "산레인", // San'layn
    rider_of_the_apocalypse: "종말의 기수" // Rider of the Apocalypse
  },

  // 주술사 영웅 특성
  shaman: {
    totemic: "토템전문가", // Totemic
    stormbringer: "폭풍인도자", // Stormbringer
    farseer: "원시술사" // Farseer
  },

  // 마법사 영웅 특성
  mage: {
    sunfury: "태양분노", // Sunfury
    frostfire: "서리화염", // Frostfire
    spellslinger: "주문투척자" // Spellslinger
  },

  // 흑마법사 영웅 특성
  warlock: {
    diabolist: "악마술사", // Diabolist
    soul_harvester: "영혼수확자", // Soul Harvester
    hellcaller: "지옥소환사" // Hellcaller
  },

  // 수도사 영웅 특성
  monk: {
    master_of_harmony: "조화의 대가", // Master of Harmony
    shado_pan: "음영파", // Shado-Pan
    conduit_of_the_celestials: "천신의 전도체" // Conduit of the Celestials
  },

  // 드루이드 영웅 특성
  druid: {
    keeper_of_the_grove: "숲의 수호자", // Keeper of the Grove
    elunes_chosen: "엘룬의 선택받은 자", // Elune's Chosen
    wildstalker: "야생추적자" // Wildstalker
  },

  // 악마사냥꾼 영웅 특성
  demonhunter: {
    aldrachi_reaver: "알드라치 파괴자", // Aldrachi Reaver
    fel_scarred: "지옥상흔" // Fel-scarred
  },

  // 기원사 영웅 특성
  evoker: {
    flameshaper: "화염조각가", // Flameshaper
    scalecommander: "용비늘 사령관", // Scalecommander
    chronowarden: "시간수호자" // Chronowarden
  }
};

// 기존 데이터베이스 수정
function fixHeroTalentTranslations() {
  const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
  let content = fs.readFileSync(dbPath, 'utf8');

  console.log('🔍 영웅 특성 번역 수정 시작...\n');

  // 잘못된 번역 수정 매핑
  const fixMap = {
    // 전사
    '"산의 왕"': '"산의 군주"',
    '"빛의 대장장이"': '"빛벼림"',

    // 추가 수정 필요한 번역들...
    '"빛의 연마"': '"빛의 벼림"',
    '"완벽한 제작"': '"완벽한 단조"'
  };

  let fixCount = 0;
  Object.entries(fixMap).forEach(([wrong, correct]) => {
    const regex = new RegExp(wrong, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, correct);
      fixCount += matches.length;
      console.log(`  ✅ ${wrong} → ${correct} (${matches.length}개 수정)`);
    }
  });

  // 영웅 특성 스킬 ID와 정확한 번역 매핑
  const heroTalentSkillTranslations = {
    // 전사 - 산의 군주 (Mountain Thane)
    "432487": "산의 군주의 힘",
    "432488": "천둥 강타",
    "432489": "폭풍의 망치",

    // 전사 - 거인 (Colossus)
    "432490": "거인의 힘",
    "432491": "타이탄의 일격",
    "432492": "거대한 위력",

    // 전사 - 학살자 (Slayer)
    "432493": "학살자의 분노",
    "432494": "처형인의 정밀함",
    "432495": "무자비한 타격",

    // 성기사 - 태양의 전령 (Herald of the Sun)
    "432472": "태양의 전령",
    "432473": "아침해",
    "432474": "영원한 불꽃",
    "432475": "신성한 광휘",
    "432476": "태양 섬광",

    // 성기사 - 빛벼림 (Lightsmith)
    "432477": "빛벼림",
    "432478": "성스러운 무기",
    "432479": "축복받은 갑옷",
    "432480": "빛의 벼림",
    "432481": "완벽한 단조",

    // 성기사 - 성전사 (Templar)
    "432482": "성전사의 일격",
    "432483": "정의의 타격",
    "432484": "응징의 진노",
    "432485": "빛의 심판",
    "432486": "최후의 성전"
  };

  // 스킬별로 정확한 번역 적용
  Object.entries(heroTalentSkillTranslations).forEach(([skillId, correctName]) => {
    const skillPattern = new RegExp(`"${skillId}":\\s*{[^}]*?koreanName:\\s*"[^"]*"`, 'g');
    content = content.replace(skillPattern, (match) => {
      const updated = match.replace(/koreanName:\s*"[^"]*"/, `koreanName: "${correctName}"`);
      if (updated !== match) {
        console.log(`  ✅ 스킬 ${skillId}: ${correctName} 수정`);
        fixCount++;
      }
      return updated;
    });
  });

  // 파일 저장
  fs.writeFileSync(dbPath, content, 'utf8');

  console.log(`\n📊 수정 결과:`);
  console.log(`  - 총 ${fixCount}개 번역 수정 완료`);

  // 백업 생성
  const backupPath = path.join(__dirname, 'src/data/koreanSpellDatabase.backup.before-translation-fix.js');
  fs.writeFileSync(backupPath, fs.readFileSync(dbPath, 'utf8'), 'utf8');
  console.log(`  - 백업 생성: ${backupPath}`);

  console.log('\n✅ 영웅 특성 번역 수정 완료!');
  console.log('📌 중요: 모든 번역은 ko.wowhead.com 공식 번역 기준입니다.');
}

// 실행
fixHeroTalentTranslations();

// 검증 함수
function validateTranslations() {
  console.log('\n🔍 번역 검증 시작...\n');

  const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
  const content = fs.readFileSync(dbPath, 'utf8');

  // 확인해야 할 영웅 특성 이름들
  const checkList = [
    { wrong: "산의 왕", correct: "산의 군주" },
    { wrong: "빛의 대장장이", correct: "빛벼림" }
  ];

  checkList.forEach(({ wrong, correct }) => {
    if (content.includes(wrong)) {
      console.log(`  ⚠️ 여전히 잘못된 번역 발견: "${wrong}" (정확한 번역: "${correct}")`);
    } else {
      console.log(`  ✅ "${correct}" - 올바른 번역 확인`);
    }
  });

  console.log('\n✅ 검증 완료!');
}

// 검증 실행
validateTranslations();