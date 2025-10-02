const fs = require('fs');
const path = require('path');

// 에러가 있는 파일들
const errorFiles = [
  'wowdbDemonHunterSkillsComplete.js',
  'wowdbEvokerSkillsComplete.js',
  'wowdbMageSkillsComplete.js',
  'wowdbMonkSkillsComplete.js',
  'wowdbPriestSkillsComplete.js',
  'wowdbRogueSkillsComplete.js',
  'wowdbShamanSkillsComplete.js',
  'wowdbWarlockSkillsComplete.js'
];

// 각 파일을 읽고 수정
errorFiles.forEach(file => {
  const filePath = path.join(__dirname, 'src', 'data', 'skills', file);
  const className = file.replace('wowdb', '').replace('SkillsComplete.js', '');

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    console.log(`\n🔧 ${file} 수정 중...`);

    // 함수 끝부분이 제대로 닫혀있지 않은 경우
    const funcName = `get${className}SkillsBySpec`;
    const funcPattern = new RegExp(`export function ${funcName}\\(spec\\)\\s*{[\\s\\S]*`, 'g');
    const match = content.match(funcPattern);

    if (match) {
      // 함수 본문 추출
      const funcStart = content.indexOf(`export function ${funcName}(spec)`);
      const afterFunc = content.substring(funcStart);

      // 제대로 된 함수로 교체
      const properFunc = `export function ${funcName}(spec) {
  const specMap = {
    ${getSpecMap(className)}
  };

  const category = specMap[spec?.toLowerCase()];
  if (!category) return null;

  return {
    baseline: wowdb${className}SkillsComplete.baseline,
    specialization: wowdb${className}SkillsComplete[category],
    talents: wowdb${className}SkillsComplete.talents,
    pvp: wowdb${className}SkillsComplete.pvp
  };
}`;

      // 기존 함수를 제거하고 새 함수로 교체
      const beforeFunc = content.substring(0, funcStart);
      content = beforeFunc + properFunc;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} 수정 완료`);

  } catch (error) {
    console.log(`❌ ${file} 수정 실패:`, error.message);
  }
});

// 전문화 맵 가져오기
function getSpecMap(className) {
  const specMaps = {
    'DemonHunter': `'havoc': 'havoc',
    'vengeance': 'vengeance'`,
    'Evoker': `'devastation': 'devastation',
    'preservation': 'preservation',
    'augmentation': 'augmentation'`,
    'Mage': `'arcane': 'arcane',
    'fire': 'fire',
    'frost': 'frost'`,
    'Monk': `'brewmaster': 'brewmaster',
    'mistweaver': 'mistweaver',
    'windwalker': 'windwalker'`,
    'Priest': `'discipline': 'discipline',
    'holy': 'holy',
    'shadow': 'shadow'`,
    'Rogue': `'assassination': 'assassination',
    'outlaw': 'outlaw',
    'subtlety': 'subtlety'`,
    'Shaman': `'elemental': 'elemental',
    'enhancement': 'enhancement',
    'restoration': 'restoration'`,
    'Warlock': `'affliction': 'affliction',
    'demonology': 'demonology',
    'destruction': 'destruction'`
  };
  return specMaps[className] || '';
}

console.log('\n✅ 모든 파일 수정 완료!');