const fs = require('fs');
const path = require('path');

// 데이터베이스 파일 읽기
const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
const content = fs.readFileSync(dbPath, 'utf8');

// 데이터베이스 추출
const dbMatch = content.match(/const koreanSpellDatabase = ({\s[\s\S]*?});/);
if (!dbMatch) {
  console.error('❌ 데이터베이스를 찾을 수 없습니다.');
  process.exit(1);
}

const func = new Function('return ' + dbMatch[1]);
const db = func();

// wowheadIconMapping 파일 읽기
const mappingPath = path.join(__dirname, 'src/data/wowheadIconMapping.js');
const mappingContent = fs.readFileSync(mappingPath, 'utf8');

// 기존 매핑 추출
const mappingMatch = mappingContent.match(/export const wowheadIconMapping = ({[\s\S]*?});/);
if (!mappingMatch) {
  console.error('❌ wowheadIconMapping을 찾을 수 없습니다.');
  process.exit(1);
}

const mappingFunc = new Function('return ' + mappingMatch[1]);
const existingMapping = mappingFunc();

// 새로운 매핑 생성 (기존 매핑 + 데이터베이스 아이콘)
const newMapping = { ...existingMapping };

let addedCount = 0;
let updatedCount = 0;
let skippedCount = 0;

// 데이터베이스의 모든 스킬 순회
Object.keys(db).forEach(id => {
  const skill = db[id];

  // 아이콘이 있고 물음표가 아닌 경우
  if (skill.icon && skill.icon !== 'inv_misc_questionmark') {
    // 기존 매핑이 없거나 물음표인 경우에만 업데이트
    if (!existingMapping[id]) {
      newMapping[id] = skill.icon;
      addedCount++;
    } else if (existingMapping[id] === 'inv_misc_questionmark') {
      newMapping[id] = skill.icon;
      updatedCount++;
    } else {
      skippedCount++;
    }
  }
});

// ID 순으로 정렬
const sortedMapping = {};
Object.keys(newMapping).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
  sortedMapping[key] = newMapping[key];
});

// 파일 내용 생성
const fileContent = `// Wowhead에서 가져온 실제 아이콘 매핑 (정리됨)
// 생성일: ${new Date().toLocaleDateString('ko-KR')}
// 총 ${Object.keys(sortedMapping).length}개의 매핑

export const wowheadIconMapping = ${JSON.stringify(sortedMapping, null, 2)};

// 디버그용 함수
export function getWowheadIcon(spellId) {
  return wowheadIconMapping[spellId] || null;
}

// 매핑된 아이콘 통계
export const iconMappingStats = {
  total: ${Object.keys(sortedMapping).length},
  withIcons: ${Object.values(sortedMapping).filter(icon => icon && icon !== 'inv_misc_questionmark').length},
  questionMarks: ${Object.values(sortedMapping).filter(icon => icon === 'inv_misc_questionmark').length}
};
`;

// 파일 저장
fs.writeFileSync(mappingPath, fileContent, 'utf8');

console.log(`✅ wowheadIconMapping 업데이트 완료!`);
console.log(`📊 통계:`);
console.log(`- 새로 추가: ${addedCount}개`);
console.log(`- 업데이트: ${updatedCount}개`);
console.log(`- 건너뜀: ${skippedCount}개`);
console.log(`- 전체 매핑: ${Object.keys(sortedMapping).length}개`);

// 주요 추가된 스킬 확인
const importantSkills = ['18499', '100', '355', '1464', '853', '633', '642'];
console.log('\n📌 주요 스킬 아이콘 확인:');
importantSkills.forEach(id => {
  const icon = sortedMapping[id];
  const skillName = db[id] ? db[id].koreanName || db[id].name : 'Unknown';
  console.log(`- ${id}: ${skillName} → ${icon || '❌ 없음'}`);
});