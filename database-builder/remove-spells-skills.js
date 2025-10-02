const fs = require('fs');
const path = require('path');

console.log('🗑️ "주문들" 스킬 제거 작업 시작...');

// 기존 데이터베이스 로드
const dbPath = path.join(__dirname, 'tww-s3-cleaned-database.json');
const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 제거할 스킬 ID 목록 (주문들/Spells)
const spellsToRemove = [
  '375529',
  '377610',
  '378192',
  '383872'
];

// 통계
let removedCount = 0;
const removedSkills = [];

// 각 클래스별 스킬 검사
Object.entries(database).forEach(([className, classSkills]) => {
  Object.keys(classSkills).forEach(skillId => {
    const skill = classSkills[skillId];

    // "주문들" 이름을 가진 스킬 제거
    if (skill.koreanName === '주문들' ||
        skill.englishName === 'Spells' ||
        spellsToRemove.includes(skillId)) {

      console.log(`  ❌ 제거: [${className}] #${skillId} - ${skill.koreanName} (${skill.englishName})`);
      removedSkills.push({
        id: skillId,
        class: className,
        koreanName: skill.koreanName,
        englishName: skill.englishName
      });
      delete classSkills[skillId];
      removedCount++;
    }
  });
});

console.log('\n✅ 제거 완료!');
console.log(`  - 총 제거된 "주문들" 스킬: ${removedCount}개`);
if (removedSkills.length > 0) {
  console.log('\n제거된 스킬 목록:');
  removedSkills.forEach(skill => {
    console.log(`  - #${skill.id} [${skill.class}]: ${skill.koreanName} (${skill.englishName})`);
  });
}

// 정리된 데이터베이스 저장
const outputPath = path.join(__dirname, 'tww-s3-final-cleaned-database.json');
fs.writeFileSync(outputPath, JSON.stringify(database, null, 2), 'utf8');
console.log(`\n💾 저장 완료: ${outputPath}`);

// React 모듈용 배열 생성
const allSkills = [];
let totalSkills = 0;

Object.entries(database).forEach(([className, classSkills]) => {
  Object.values(classSkills).forEach(skill => {
    // 클래스 정보 추가
    skill.class = className;
    allSkills.push(skill);
    totalSkills++;
  });
});

// React 모듈 생성
const moduleContent = `// TWW Season 3 최종 정리된 데이터베이스 ("주문들" 제거됨)
// 생성: ${new Date().toISOString()}
// 총 ${totalSkills}개 스킬

export const twwS3SkillDatabase = ${JSON.stringify(allSkills, null, 2)};

export const classData = {
  '전사': { name: '전사', color: '#C79C6E', specs: ['무기', '분노', '방어'] },
  '성기사': { name: '성기사', color: '#F58CBA', specs: ['신성', '보호', '징벌'] },
  '사냥꾼': { name: '사냥꾼', color: '#ABD473', specs: ['야수', '사격', '생존'] },
  '도적': { name: '도적', color: '#FFF569', specs: ['암살', '무법', '잠행'] },
  '사제': { name: '사제', color: '#FFFFFF', specs: ['수양', '신성', '암흑'] },
  '주술사': { name: '주술사', color: '#0070DE', specs: ['정기', '고양', '복원'] },
  '마법사': { name: '마법사', color: '#69CCF0', specs: ['비전', '화염', '냉기'] },
  '흑마법사': { name: '흑마법사', color: '#9482C9', specs: ['고통', '악마', '파괴'] },
  '수도사': { name: '수도사', color: '#00FF96', specs: ['양조', '운무', '풍운'] },
  '드루이드': { name: '드루이드', color: '#FF7D0A', specs: ['조화', '야성', '수호', '회복'] },
  '악마사냥꾼': { name: '악마사냥꾼', color: '#A330C9', specs: ['파멸', '복수'] },
  '죽음의기사': { name: '죽음의기사', color: '#C41E3A', specs: ['혈기', '냉기', '부정'] },
  '기원사': { name: '기원사', color: '#33937F', specs: ['황폐', '보존', '증강'] }
};

export const databaseStats = {
  totalSkills: ${totalSkills},
  lastUpdated: '${new Date().toISOString()}'
};

export default twwS3SkillDatabase;
`;

const reactModulePath = path.join(__dirname, '..', 'src', 'data', 'twwS3FinalCleanedDatabase.js');
fs.writeFileSync(reactModulePath, moduleContent, 'utf8');
console.log(`📦 React 모듈 저장: ${reactModulePath}`);

console.log('\n✨ 작업 완료!');