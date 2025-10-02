// 스킬 데이터 문제 수정 스크립트
const fs = require('fs');
const path = require('path');

console.log('🔧 스킬 데이터 문제 수정 시작...\n');

// 1. 현재 데이터베이스 로드
const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');
const dbMatch = dbContent.match(/export const koreanSpellDatabase = ({[\s\S]*?});/);

if (!dbMatch) {
  console.error('❌ 데이터베이스 파싱 실패');
  process.exit(1);
}

let database = eval('(' + dbMatch[1] + ')');
console.log(`✅ 현재 데이터베이스 로드: ${Object.keys(database).length}개 스킬\n`);

// 2. 설명 텍스트 정리 함수
function cleanDescription(description) {
  if (!description) return '';

  let cleaned = description;

  // 불완전한 변수 치환 제거 (예: "을 꿰뚫어")
  cleaned = cleaned.replace(/\s+(을|를|이|가|와|과|에게|로|으로)\s+/g, ' ');

  // 빈 괄호 제거
  cleaned = cleaned.replace(/\s*\(\s*\)/g, '');
  cleaned = cleaned.replace(/\s*\[\s*\]/g, '');

  // 불완전한 변수 표현 제거 (예: "|1을;를;")
  cleaned = cleaned.replace(/\|[\d;]+/g, '');

  // 중복 공백 제거
  cleaned = cleaned.replace(/\s+/g, ' ');

  // 앞뒤 공백 제거
  cleaned = cleaned.trim();

  return cleaned;
}

// 3. 수정이 필요한 스킬들
const fixes = {
  // 심판의 칼날 - 설명 수정
  '184575': {
    description: '빛의 칼날로 대상을 꿰뚫어 (전투력의 275.538%)의 신성 피해를 입히고 신성한 힘 1개를 생성합니다.'
  },

  // 정의로운 수호자 - 설명 수정
  '204074': {
    description: '신성한 힘 하나당 응징의 격노와 고대 왕의 수호자의 남은 재사용 대기시간이 1.5초만큼 감소합니다.'
  },

  // 432578 - Holy Bulwark로 수정
  '432578': {
    name: 'Holy Bulwark',
    koreanName: '신성한 방벽',
    description: '신성한 방벽을 생성하여 피해를 감소시킵니다.'
  }
};

// 4. 전체 데이터베이스 설명 정리
let cleanedCount = 0;
let fixedCount = 0;

// 특정 수정사항 적용
for (const [skillId, fixData] of Object.entries(fixes)) {
  if (database[skillId]) {
    const oldData = { ...database[skillId] };
    database[skillId] = { ...database[skillId], ...fixData };
    console.log(`📝 스킬 ${skillId} 수정:`);
    console.log(`  이전: ${JSON.stringify(oldData).substring(0, 100)}...`);
    console.log(`  이후: ${JSON.stringify(database[skillId]).substring(0, 100)}...\n`);
    fixedCount++;
  }
}

// 모든 스킬의 설명 정리
for (const [skillId, skillData] of Object.entries(database)) {
  if (skillData.description) {
    const originalDesc = skillData.description;
    const cleanedDesc = cleanDescription(originalDesc);

    if (originalDesc !== cleanedDesc) {
      database[skillId].description = cleanedDesc;
      cleanedCount++;

      // 주요 변경사항만 출력
      if (originalDesc.includes('()') || originalDesc.includes('을 ') || originalDesc.includes('를 ')) {
        console.log(`🧹 스킬 ${skillId} (${skillData.koreanName}) 설명 정리`);
      }
    }
  }
}

// 5. 중복 ID로 잘못 매핑된 스킬 찾기
const idToSkillNames = {};
for (const [skillId, skillData] of Object.entries(database)) {
  if (!idToSkillNames[skillId]) {
    idToSkillNames[skillId] = [];
  }
  idToSkillNames[skillId].push(skillData.koreanName || skillData.name);
}

console.log('\n🔍 ID 충돌 확인:');
let hasCollisions = false;
for (const [skillId, names] of Object.entries(idToSkillNames)) {
  if (names.length > 1 || (names[0] && names[0].includes('/'))) {
    console.log(`  ⚠️ ID ${skillId}: ${names.join(', ')}`);
    hasCollisions = true;
  }
}
if (!hasCollisions) {
  console.log('  ✅ ID 충돌 없음');
}

// 6. 저장
const jsContent = `// 통합된 한국어 스킬 데이터베이스 (문제 수정됨)
// 총 ${Object.keys(database).length}개 스킬
// 생성일: ${new Date().toISOString()}

export const koreanSpellDatabase = ${JSON.stringify(database, null, 2)};

export function getKoreanSpellData(spellId) {
  return koreanSpellDatabase[spellId] || null;
}

// 데이터 구조
// {
//   "스킬ID": {
//     name: "영문명",
//     koreanName: "한글명",
//     cooldown: "1.5분",
//     resource: {
//       type: "마나",
//       amount: "10%",
//       display: "10%"
//     },
//     resourceGenerate: {
//       type: "분노",
//       amount: "20",
//       display: "20"
//     },
//     range: "40 야드",
//     castTime: "즉시",
//     duration: "10초",
//     description: "스킬 설명",
//     iconName: "아이콘명"
//   }
// }
`;

fs.writeFileSync(dbPath, jsContent, 'utf8');

console.log('\n📊 수정 결과:');
console.log(`  - 전체 스킬: ${Object.keys(database).length}개`);
console.log(`  - 특정 수정: ${fixedCount}개`);
console.log(`  - 설명 정리: ${cleanedCount}개`);
console.log(`\n✅ 수정된 데이터베이스 저장 완료: ${dbPath}`);