// Wowhead에서 추출한 비전 마법사 데이터를 refined DB에 추가

const fs = require('fs');

// 추출된 Wowhead 데이터 로드
const wowheadData = require('./arcane-mage-wowhead-data.json');

// Refined DB 로드
const refinedDB = require('./tww-s3-refined-database.json');

// 영문명 추출 함수
function extractEnglishName(details) {
  const detailsStr = JSON.stringify(details);
  const match = detailsStr.match(/영어:\s*([^\\]+)/);
  return match ? match[1].trim() : '';
}

// Wowhead 데이터를 refined DB 형식으로 변환
const convertedSkills = {};
let successCount = 0;
let errorCount = 0;

wowheadData.forEach(skill => {
  try {
    const englishName = extractEnglishName(skill.details);

    if (!englishName) {
      console.log(`⚠️  [${skill.id}] ${skill.koreanName} - 영문명 추출 실패`);
      errorCount++;
      return;
    }

    convertedSkills[skill.id] = {
      id: skill.id,
      englishName: englishName,
      koreanName: skill.koreanName,
      icon: skill.icon,
      type: "기본",  // 기본값 (추후 수동 분류 필요)
      spec: "비전",  // 비전 마법사
      heroTalent: null,
      level: null,
      pvp: false,
      duration: "n/a",
      school: "Arcane",
      mechanic: "n/a",
      dispelType: "n/a",
      gcd: "Normal",
      resourceCost: "마나",
      range: "40 야드",
      castTime: "즉시",
      cooldown: "해당 없음",
      description: skill.description,
      resourceGain: "없음"
    };

    console.log(`✅ [${skill.id}] ${skill.koreanName} (${englishName})`);
    successCount++;

  } catch (error) {
    console.log(`❌ [${skill.id}] 변환 실패: ${error.message}`);
    errorCount++;
  }
});

// 기존 DB에 병합
const mergedDB = {
  ...refinedDB,
  ...convertedSkills
};

// 저장
const outputPath = './tww-s3-refined-database.json';
fs.writeFileSync(outputPath, JSON.stringify(mergedDB, null, 2), 'utf8');

console.log('\n' + '='.repeat(60));
console.log('📊 변환 결과:');
console.log(`성공: ${successCount}개`);
console.log(`실패: ${errorCount}개`);
console.log(`총 DB 스킬 수: ${Object.keys(mergedDB).length}개`);
console.log(`\n✨ 저장 완료: ${outputPath}`);
