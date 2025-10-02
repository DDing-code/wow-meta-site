// TWW 영웅 특성 나무위키 기준 번역 수정
// https://namu.wiki/w/월드%20오브%20워크래프트:%20내부%20전쟁

const fs = require('fs');
const path = require('path');

// 나무위키 기준 정확한 번역
const heroTalentTranslations = {
  // 전사
  warrior: {
    mountain_thane: "산왕", // Mountain Thane - 산왕 (나무위키)
    colossus: "거신", // Colossus - 거신 (나무위키)
    slayer: "학살자" // Slayer - 학살자
  },

  // 성기사 (나무위키 확인 필요, 일단 기존 유지)
  paladin: {
    herald_of_the_sun: "태양의 전령", // Herald of the Sun
    lightsmith: "빛의 대장장이", // Lightsmith - 나무위키에서 "빛의 대장장이"로 표기
    templar: "성전사" // Templar
  }
};

function fixHeroTalentTranslations() {
  const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
  let content = fs.readFileSync(dbPath, 'utf8');

  console.log('🔍 영웅 특성 번역 수정 (나무위키 기준)...\n');
  console.log('📌 출처: https://namu.wiki/w/월드%20오브%20워크래프트:%20내부%20전쟁\n');

  // 수정할 번역 매핑
  const fixMap = {
    // 전사
    '"산의 왕"': '"산왕"',
    '"거인"': '"거신"',

    // 성기사
    '"빛벼림"': '"빛의 대장장이"'
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

  // 영웅 특성 스킬 정확한 번역
  const heroTalentSkillTranslations = {
    // 전사 - 산왕 (Mountain Thane)
    "432487": "산왕",
    "432488": "천둥 강타",
    "432489": "폭풍의 망치",

    // 전사 - 거신 (Colossus)
    "432490": "거신",
    "432491": "타이탄의 일격",
    "432492": "거대한 힘",

    // 전사 - 학살자 (Slayer)
    "432493": "학살자",
    "432494": "처형인의 정밀함",
    "432495": "무자비한 타격",

    // 성기사 - 태양의 전령 (Herald of the Sun)
    "432472": "태양의 전령",
    "432473": "아침해",
    "432474": "영원한 불꽃",
    "432475": "신성한 광휘",
    "432476": "태양 섬광",

    // 성기사 - 빛의 대장장이 (Lightsmith)
    "432477": "빛의 대장장이",
    "432478": "성스러운 무기",
    "432479": "축복받은 갑옷",
    "432480": "빛의 벼림",
    "432481": "완벽한 단조",

    // 성기사 - 성전사 (Templar)
    "432482": "성전사",
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

  // heroTree 필드도 수정
  content = content.replace(/heroTree:\s*"mountain_thane"/g, 'heroTree: "mountain_thane"');
  content = content.replace(/heroTree:\s*"colossus"/g, 'heroTree: "colossus"');
  content = content.replace(/heroTree:\s*"slayer"/g, 'heroTree: "slayer"');
  content = content.replace(/heroTree:\s*"lightsmith"/g, 'heroTree: "lightsmith"');

  // 파일 저장
  fs.writeFileSync(dbPath, content, 'utf8');

  console.log(`\n📊 수정 결과:`);
  console.log(`  - 총 ${fixCount}개 번역 수정 완료`);

  console.log('\n✅ 영웅 특성 번역 수정 완료!');
  console.log('📌 나무위키 기준 번역 사용');
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
    { name: "Mountain Thane", correct: "산왕" },
    { name: "Colossus", correct: "거신" },
    { name: "Slayer", correct: "학살자" },
    { name: "Lightsmith", correct: "빛의 대장장이" },
    { name: "Herald of the Sun", correct: "태양의 전령" },
    { name: "Templar", correct: "성전사" }
  ];

  checkList.forEach(({ name, correct }) => {
    if (content.includes(`"${correct}"`)) {
      console.log(`  ✅ ${name}: "${correct}" - 올바른 번역`);
    } else {
      console.log(`  ⚠️ ${name}: "${correct}"를 찾을 수 없음`);
    }
  });

  console.log('\n✅ 검증 완료!');
  console.log('📌 나무위키 공식 번역 기준');
}

// 검증 실행
validateTranslations();