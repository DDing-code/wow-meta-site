/**
 * skill-db.js
 * 스킬 DB JSON 생성
 * 
 * 출력:
 * - skills.json: 전체 스킬 배열
 * - skillNameMap.json: 이름 → ID 매핑
 * - skillIconMap.json: ID → 아이콘 매핑
 */

const fs = require('fs');
const path = require('path');

/**
 * 스킬 DB JSON 생성
 * @param {Array} skills - 파싱된 스킬 배열
 * @param {string} outputDir - 출력 디렉토리
 */
function generateSkillDB(skills, outputDir) {
  // skills.json 생성
  const skillsPath = path.join(outputDir, 'skills.json');
  fs.writeFileSync(skillsPath, JSON.stringify(skills, null, 2), 'utf-8');
  console.log(`   📄 생성: skills.json (${skills.length}개 스킬)`);
  
  return skillsPath;
}

/**
 * 스킬 이름 매핑 생성
 * @param {Array} skills - 파싱된 스킬 배열
 * @param {string} outputDir - 출력 디렉토리
 */
function generateSkillNameMap(skills, outputDir) {
  const nameMap = {};
  
  for (const skill of skills) {
    // 한글 이름
    if (skill.name_kr) {
      nameMap[skill.name_kr] = skill.id;
      // 공백 제거 버전도 추가
      const noSpace = skill.name_kr.replace(/\s/g, '');
      if (noSpace !== skill.name_kr) {
        nameMap[noSpace] = skill.id;
      }
    }
    
    // 영문 이름
    if (skill.name_en) {
      nameMap[skill.name_en] = skill.id;
      // 소문자 버전도 추가
      nameMap[skill.name_en.toLowerCase()] = skill.id;
    }
  }
  
  const mapPath = path.join(outputDir, 'skillNameMap.json');
  fs.writeFileSync(mapPath, JSON.stringify(nameMap, null, 2), 'utf-8');
  console.log(`   📄 생성: skillNameMap.json (${Object.keys(nameMap).length}개 매핑)`);
  
  return mapPath;
}

/**
 * 스킬 아이콘 매핑 생성
 * @param {Array} skills - 파싱된 스킬 배열
 * @param {string} outputDir - 출력 디렉토리
 */
function generateSkillIconMap(skills, outputDir) {
  const iconMap = {};
  
  for (const skill of skills) {
    iconMap[skill.id] = {
      icon: skill.icon,
      name_kr: skill.name_kr,
      name_en: skill.name_en,
    };
  }
  
  const mapPath = path.join(outputDir, 'skillIconMap.json');
  fs.writeFileSync(mapPath, JSON.stringify(iconMap, null, 2), 'utf-8');
  console.log(`   📄 생성: skillIconMap.json`);
  
  return mapPath;
}

/**
 * 직업별 스킬 분류
 * @param {Array} skills - 파싱된 스킬 배열
 * @param {string} outputDir - 출력 디렉토리
 */
function generateSkillsByClass(skills, outputDir) {
  const byClass = {};
  
  for (const skill of skills) {
    const className = skill.class || 'Unknown';
    if (!byClass[className]) {
      byClass[className] = [];
    }
    byClass[className].push(skill);
  }
  
  // 직업별 폴더 생성
  const classDir = path.join(outputDir, 'skills-by-class');
  if (!fs.existsSync(classDir)) {
    fs.mkdirSync(classDir, { recursive: true });
  }
  
  for (const [className, classSkills] of Object.entries(byClass)) {
    const classPath = path.join(classDir, `${className.toLowerCase()}.json`);
    fs.writeFileSync(classPath, JSON.stringify(classSkills, null, 2), 'utf-8');
  }
  
  console.log(`   📄 생성: skills-by-class/ (${Object.keys(byClass).length}개 직업)`);
}

module.exports = {
  generateSkillDB,
  generateSkillNameMap,
  generateSkillIconMap,
  generateSkillsByClass,
};
