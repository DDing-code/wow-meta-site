// TWW 영웅 특성 정확한 번역 수정 v2
// Database 폴더 기준 번역 사용

const fs = require('fs');
const path = require('path');

// Database 폴더 기준 정확한 번역
// Mountain Thane = "산의 왕" (Database\Spells\spellsFive.lua:295470 확인)
// Lightsmith = "빛벼림" (공식 번역)

function fixHeroTalentTranslations() {
  const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
  let content = fs.readFileSync(dbPath, 'utf8');

  console.log('🔍 영웅 특성 번역 수정 v2 시작...\n');
  console.log('📌 Database 폴더 기준 번역 사용\n');

  // 이전에 잘못 수정한 것을 되돌리기
  const fixMap = {
    // 전사 - Mountain Thane는 "산의 왕"이 맞음 (Database 확인)
    '"산의 군주"': '"산의 왕"',
    '"산의 군주의 힘"': '"산의 왕"',

    // 성기사 - 빛벼림은 유지
    // (이미 올바름)
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
    // 전사 - 산의 왕 (Mountain Thane)
    "432487": "산의 왕",
    "432488": "천둥 강타",
    "432489": "폭풍의 망치",

    // 전사 - 거인 (Colossus)
    "432490": "거인",
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

    // 성기사 - 빛벼림 (Lightsmith)
    "432477": "빛벼림",
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

  // 파일 저장
  fs.writeFileSync(dbPath, content, 'utf8');

  console.log(`\n📊 수정 결과:`);
  console.log(`  - 총 ${fixCount}개 번역 수정 완료`);

  console.log('\n✅ 영웅 특성 번역 수정 완료!');
  console.log('📌 Database 폴더 기준 번역 사용');
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
    { name: "Mountain Thane", correct: "산의 왕" },
    { name: "Lightsmith", correct: "빛벼림" },
    { name: "Colossus", correct: "거인" },
    { name: "Slayer", correct: "학살자" }
  ];

  checkList.forEach(({ name, correct }) => {
    if (content.includes(`"${correct}"`)) {
      console.log(`  ✅ ${name}: "${correct}" - 올바른 번역`);
    } else {
      console.log(`  ⚠️ ${name}: "${correct}"를 찾을 수 없음`);
    }
  });

  console.log('\n✅ 검증 완료!');
}

// 검증 실행
validateTranslations();