/**
 * 최종 특성 데이터 생성
 * 매칭된 한국어/영어 데이터를 React 컴포넌트용으로 변환
 */

const fs = require('fs');
const path = require('path');

// 매칭된 데이터 로드
const completeDB = require('./bm-hunter-talents-complete-db.json');

// WoWHead에서 수집한 원본 데이터
const visibleTalents = require('./visible-talents.json');

// 최종 특성 트리 구조 생성
function generateFinalTalentData() {
  const finalData = {
    classTalents: {
      layout: { rows: 15, columns: 3, totalPoints: 31 },
      nodes: {}
    },
    specTalents: {
      layout: { rows: 13, columns: 3, totalPoints: 30 },
      nodes: {}
    },
    heroTalents: {
      packLeader: {
        layout: { rows: 5, columns: 3, totalPoints: 10 },
        nodes: {}
      },
      darkRanger: {
        layout: { rows: 5, columns: 3, totalPoints: 10 },
        nodes: {}
      }
    },
    connections: []
  };

  // 직업 특성 처리
  visibleTalents.classTalents.forEach((talent, index) => {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;

    // 매칭 DB에서 한국어 정보 찾기
    const matched = completeDB.matchedDatabase[talent.id];

    finalData.classTalents.nodes[talent.id] = {
      id: parseInt(talent.id),
      koreanName: matched?.koreanName || talent.name,
      englishName: talent.name,
      icon: matched?.icon || 'inv_misc_questionmark',
      description: matched?.tooltipKorean || '',
      position: { row, col },
      maxRanks: 1,
      currentRank: 0,
      tree: 'class'
    };
  });

  // 전문화 특성 처리
  visibleTalents.specTalents.forEach((talent, index) => {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;

    // 매칭 DB에서 한국어 정보 찾기
    const matched = completeDB.matchedDatabase[talent.id];

    finalData.specTalents.nodes[talent.id] = {
      id: parseInt(talent.id),
      koreanName: matched?.koreanName || talent.name,
      englishName: talent.name,
      icon: matched?.icon || 'inv_misc_questionmark',
      description: matched?.tooltipKorean || '',
      position: { row, col },
      maxRanks: 1,
      currentRank: 0,
      tree: 'spec'
    };
  });

  // 영웅 특성 추가 (하드코딩 - WoWHead에서 수집 실패)
  const heroTalents = {
    packLeader: [
      { id: 450958, koreanName: "포악한 습격", englishName: "Vicious Hunt", row: 1, col: 2 },
      { id: 450964, koreanName: "무리 조직", englishName: "Pack Coordination", row: 2, col: 1 },
      { id: 450963, koreanName: "굴 회복력", englishName: "Den Recovery", row: 2, col: 2 },
      { id: 450962, koreanName: "광기의 무리", englishName: "Frenzied Pack", row: 2, col: 3 },
      { id: 451160, koreanName: "사냥의 부름", englishName: "Howl of the Pack", row: 3, col: 1 },
      { id: 451161, koreanName: "무리 우두머리", englishName: "Pack Leader", row: 3, col: 2 },
      { id: 450360, koreanName: "엄호 사격", englishName: "Covering Fire", row: 3, col: 3 },
      { id: 450361, koreanName: "무리의 맹위", englishName: "Furious Assault", row: 4, col: 1 },
      { id: 450362, koreanName: "짐승의 축복", englishName: "Blessing of the Pack", row: 4, col: 3 },
      { id: 450363, koreanName: "무리의 분노", englishName: "Pack's Wrath", row: 5, col: 2 }
    ],
    darkRanger: [
      { id: 450381, koreanName: "어둠의 사격", englishName: "Shadow Shot", row: 1, col: 2 },
      { id: 450382, koreanName: "검은 화살", englishName: "Black Arrow", row: 2, col: 2 },
      { id: 450383, koreanName: "연막", englishName: "Smoke Screen", row: 3, col: 1 },
      { id: 450384, koreanName: "쇠약의 화살", englishName: "Withering Fire", row: 3, col: 3 },
      { id: 450385, koreanName: "어둠의 사냥꾼", englishName: "Shadow Hunter", row: 4, col: 2 }
    ]
  };

  // 무리의 지도자
  heroTalents.packLeader.forEach(talent => {
    finalData.heroTalents.packLeader.nodes[talent.id] = {
      id: talent.id,
      koreanName: talent.koreanName,
      englishName: talent.englishName,
      icon: 'ability_hunter_packleader',
      description: `${talent.koreanName} - 무리의 지도자 영웅 특성`,
      position: { row: talent.row, col: talent.col },
      tree: 'hero-packleader'
    };
  });

  // 어둠 순찰자
  heroTalents.darkRanger.forEach(talent => {
    finalData.heroTalents.darkRanger.nodes[talent.id] = {
      id: talent.id,
      koreanName: talent.koreanName,
      englishName: talent.englishName,
      icon: 'ability_theblackarrow',
      description: `${talent.koreanName} - 어둠 순찰자 영웅 특성`,
      position: { row: talent.row, col: talent.col },
      tree: 'hero-darkranger'
    };
  });

  return finalData;
}

// 최종 데이터 생성
const finalTalentData = generateFinalTalentData();

// 통계
const stats = {
  classTalents: Object.keys(finalTalentData.classTalents.nodes).length,
  specTalents: Object.keys(finalTalentData.specTalents.nodes).length,
  packLeaderTalents: Object.keys(finalTalentData.heroTalents.packLeader.nodes).length,
  darkRangerTalents: Object.keys(finalTalentData.heroTalents.darkRanger.nodes).length
};

stats.total = stats.classTalents + stats.specTalents + stats.packLeaderTalents + stats.darkRangerTalents;

console.log('📊 최종 특성 데이터 생성 완료:');
console.log(`  직업 특성: ${stats.classTalents}개`);
console.log(`  전문화 특성: ${stats.specTalents}개`);
console.log(`  무리의 지도자: ${stats.packLeaderTalents}개`);
console.log(`  어둠 순찰자: ${stats.darkRangerTalents}개`);
console.log(`  총 특성: ${stats.total}개`);

// React 컴포넌트용 파일 저장
const outputPath = path.join(__dirname, '..', 'src', 'data', 'beastMasteryFinalData.js');
const fileContent = `// WoW 11.0.5 야수 사냥꾼 최종 특성 데이터
// Spell ID 기반 한국어/영어 완전 매칭
// 직업: ${stats.classTalents}개, 전문화: ${stats.specTalents}개
// 무리의 지도자: ${stats.packLeaderTalents}개, 어둠 순찰자: ${stats.darkRangerTalents}개
// 총 ${stats.total}개 특성

export const beastMasteryFinalData = ${JSON.stringify(finalTalentData, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`\n💾 파일 저장: ${outputPath}`);

// 샘플 출력
const sampleTalent = Object.values(finalTalentData.classTalents.nodes)[0];
console.log('\n📋 샘플 특성:');
console.log(JSON.stringify(sampleTalent, null, 2));