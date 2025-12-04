/**
 * guide-data.js
 * 가이드 페이지 JSON 생성
 * 
 * 우선순위 노트 + 스킬 DB를 결합하여
 * React 컴포넌트가 사용할 완전한 가이드 데이터 생성
 */

const fs = require('fs');
const path = require('path');

/**
 * 가이드 데이터 생성
 * @param {Array} priorities - 파싱된 우선순위 배열
 * @param {Array} skills - 파싱된 스킬 배열
 * @param {string} outputDir - 출력 디렉토리
 */
function generateGuideData(priorities, skills, outputDir) {
  // 스킬 이름 → 스킬 객체 매핑
  const skillByName = {};
  for (const skill of skills) {
    if (skill.name_kr) {
      skillByName[skill.name_kr] = skill;
      skillByName[skill.name_kr.replace(/\s/g, '')] = skill;
    }
    if (skill.name_en) {
      skillByName[skill.name_en] = skill;
      skillByName[skill.name_en.toLowerCase()] = skill;
    }
  }
  
  // 전문화별 가이드 그룹핑
  const guidesBySpec = {};
  
  for (const priority of priorities) {
    const specKey = `${priority.class.toLowerCase()}-${priority.spec.toLowerCase()}`;
    
    if (!guidesBySpec[specKey]) {
      guidesBySpec[specKey] = {
        class: priority.class,
        spec: priority.spec,
        heroTrees: {},
        patch: priority.patch,
        source: priority.source,
      };
    }
    
    const heroKey = priority.heroTree || 'default';
    if (!guidesBySpec[specKey].heroTrees[heroKey]) {
      guidesBySpec[specKey].heroTrees[heroKey] = {
        name: heroKey,
        situations: {},
      };
    }
    
    // 우선순위에 스킬 정보 추가
    const enrichedPriorities = priority.priorities.map(p => {
      const skill = skillByName[p.skillName] || skillByName[p.skillName.replace(/\s/g, '')];
      return {
        ...p,
        skillId: skill?.id || null,
        icon: skill?.icon || 'inv_misc_questionmark',
        skillData: skill || null,
      };
    });
    
    // 오프너에 스킬 정보 추가
    const enrichedOpener = priority.opener.map(o => {
      const skill = skillByName[o.skillName] || skillByName[o.skillName.replace(/\s/g, '')];
      return {
        ...o,
        skillId: skill?.id || null,
        icon: skill?.icon || 'inv_misc_questionmark',
      };
    });
    
    guidesBySpec[specKey].heroTrees[heroKey].situations[priority.situation] = {
      priorities: enrichedPriorities,
      opener: enrichedOpener,
      targetCount: priority.targetCount,
    };
  }
  
  // 가이드 JSON 파일 생성
  const guidesDir = path.join(outputDir, 'guides');
  if (!fs.existsSync(guidesDir)) {
    fs.mkdirSync(guidesDir, { recursive: true });
  }
  
  for (const [specKey, guideData] of Object.entries(guidesBySpec)) {
    // 전체 가이드 데이터 생성
    const fullGuide = {
      meta: {
        class: guideData.class,
        spec: guideData.spec,
        patch: guideData.patch,
        source: guideData.source,
        generatedAt: new Date().toISOString(),
      },
      heroTrees: guideData.heroTrees,
    };
    
    const guidePath = path.join(guidesDir, `${specKey}.json`);
    fs.writeFileSync(guidePath, JSON.stringify(fullGuide, null, 2), 'utf-8');
    console.log(`   📄 생성: guides/${specKey}.json`);
  }
  
  // 전체 가이드 인덱스 생성
  const guideIndex = Object.keys(guidesBySpec).map(key => ({
    key,
    class: guidesBySpec[key].class,
    spec: guidesBySpec[key].spec,
    heroTrees: Object.keys(guidesBySpec[key].heroTrees),
  }));
  
  const indexPath = path.join(guidesDir, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(guideIndex, null, 2), 'utf-8');
  console.log(`   📄 생성: guides/index.json`);
  
  return guidesDir;
}

/**
 * 우선순위 JSON 생성 (개별 파일)
 */
function generatePriorityFiles(priorities, outputDir) {
  const prioritiesDir = path.join(outputDir, 'priorities');
  if (!fs.existsSync(prioritiesDir)) {
    fs.mkdirSync(prioritiesDir, { recursive: true });
  }
  
  for (const priority of priorities) {
    const fileName = priority.key + '.json';
    const filePath = path.join(prioritiesDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(priority, null, 2), 'utf-8');
  }
  
  console.log(`   📄 생성: priorities/ (${priorities.length}개 파일)`);
  
  return prioritiesDir;
}

module.exports = {
  generateGuideData,
  generatePriorityFiles,
};
