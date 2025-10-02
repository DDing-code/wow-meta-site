/**
 * WowHead 수집 데이터를 React 컴포넌트용 데이터로 변환
 */

const fs = require('fs');
const path = require('path');

// 완전한 특성 DB 로드
const completeDB = require('./bm-hunter-complete-talent-db.json');

// React 컴포넌트용 데이터 변환
const convertToReactData = () => {
  const classTalents = [];
  const specTalents = [];
  const heroTalents = {
    packleader: [],
    darkranger: []
  };

  // 특성 데이터 변환
  Object.values(completeDB.talents).forEach(talent => {
    const reactTalent = {
      id: talent.id,
      name: talent.koreanName || talent.englishName,
      englishName: talent.englishName,
      icon: talent.icon === 'inv_misc_questionmark' ? 'ability_hunter_focusedaim' : talent.icon,
      description: talent.description.korean || talent.description.english || '',
      row: talent.position?.row || 1,
      col: talent.position?.col || 1,
      maxRank: 1,
      requiredTalent: null,
      type: 'passive'
    };

    // 트리별로 분류
    if (talent.tree === 'class') {
      classTalents.push(reactTalent);
    } else if (talent.tree === 'spec') {
      specTalents.push(reactTalent);
    } else if (talent.tree === 'hero-packleader') {
      heroTalents.packleader.push(reactTalent);
    } else if (talent.tree === 'hero-darkranger') {
      heroTalents.darkranger.push(reactTalent);
    }
  });

  // 최종 데이터 구조
  const finalData = {
    className: 'hunter',
    specName: 'beast-mastery',
    koreanClassName: '사냥꾼',
    koreanSpecName: '야수',
    lastUpdated: new Date().toISOString(),
    source: 'WowHead',
    totalTalents: completeDB.stats.total,
    classTalents: classTalents.sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    }),
    specTalents: specTalents.sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    }),
    heroTalents: heroTalents
  };

  // JavaScript 파일로 저장
  const jsContent = `/**
 * Beast Mastery Hunter 완전한 특성 데이터
 * 수집원: WowHead (www.wowhead.com, ko.wowhead.com)
 * 수집일: ${new Date().toISOString()}
 * 총 특성: ${finalData.totalTalents}개
 */

const beastMasteryFinalData = ${JSON.stringify(finalData, null, 2)};

export default beastMasteryFinalData;
`;

  // 파일 저장
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'beastMasteryCompleteData.js');
  fs.writeFileSync(outputPath, jsContent, 'utf-8');

  console.log('✅ React 데이터 변환 완료');
  console.log(`📁 저장 위치: ${outputPath}`);
  console.log(`📊 통계:`);
  console.log(`  - 직업 특성: ${classTalents.length}개`);
  console.log(`  - 전문화 특성: ${specTalents.length}개`);
  console.log(`  - 영웅 특성 (무리의 지도자): ${heroTalents.packleader.length}개`);
  console.log(`  - 영웅 특성 (어둠 순찰자): ${heroTalents.darkranger.length}개`);

  return finalData;
};

// 실행
convertToReactData();