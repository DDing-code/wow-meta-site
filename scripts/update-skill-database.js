/**
 * 스킬 데이터베이스 업데이트 스크립트
 * - 한국어 DB에서 실제 스킬 설명 가져오기
 * - Wowhead 스킬 ID 기반 아이콘 URL 설정
 */

const fs = require('fs');
const path = require('path');

// Lua 파서 함수
function parseLuaToJS(luaContent) {
  // MultiLanguageSpellData['ko'][숫자] = {name = "...", additional_info = "..."} 패턴 파싱
  const skillData = {};

  // 정규식으로 스킬 데이터 추출
  const regex = /MultiLanguageSpellData\['ko'\]\[(\d+)\]\s*=\s*\{([^}]+)\}/g;
  let match;

  while ((match = regex.exec(luaContent)) !== null) {
    const id = parseInt(match[1]);
    const dataStr = match[2];

    // name과 additional_info 추출
    const nameMatch = dataStr.match(/name\s*=\s*"([^"]+)"/);
    const infoMatch = dataStr.match(/additional_info\s*=\s*"([^"]+)"|additional_info\s*=\s*nil/);

    if (nameMatch) {
      skillData[id] = {
        name: nameMatch[1],
        additional_info: infoMatch && !infoMatch[0].includes('nil') ? infoMatch[1] : null
      };
    }
  }

  return skillData;
}

// 모든 스킬 Lua 파일 읽기 및 통합
function loadAllKoreanSkills() {
  const spellsDir = 'C:\\Users\\D2JK\\바탕화면\\cd\\냉죽\\Database\\Spells';
  const allSkills = {};

  const files = [
    'spellsOne.lua',
    'spellsTwo.lua',
    'spellsThree.lua',
    'spellsFour.lua',
    'spellsFive.lua',
    'spellsSix.lua',
    'spellsSeven.lua',
    'spellsEight.lua'
  ];

  files.forEach(file => {
    const filePath = path.join(spellsDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const skills = parseLuaToJS(content);
      Object.assign(allSkills, skills);
      console.log(`✅ ${file} 로드 완료:`, Object.keys(skills).length, '개 스킬');
    }
  });

  return allSkills;
}

// 클래스별 스킬 파일 업데이트
function updateClassSkillFile(className, koreanSkillDB) {
  const skillFilePath = path.join(__dirname, '..', 'src', 'data', 'skills', `wowdb${className.charAt(0).toUpperCase() + className.slice(1)}SkillsComplete.js`);

  if (!fs.existsSync(skillFilePath)) {
    console.log(`⚠️ ${className} 스킬 파일이 없습니다:`, skillFilePath);
    return;
  }

  let content = fs.readFileSync(skillFilePath, 'utf8');
  let updatedCount = 0;

  // 스킬 ID와 데이터 추출 패턴
  const skillPattern = /(\d+):\s*\{([^}]+)\}/g;

  content = content.replace(skillPattern, (match, skillId, skillData) => {
    const id = parseInt(skillId);
    const koreanSkill = koreanSkillDB[id];

    if (koreanSkill) {
      updatedCount++;

      // 기존 데이터 파싱
      let updatedData = skillData;

      // 한국어 이름 업데이트
      if (koreanSkill.name && !skillData.includes('kr:')) {
        updatedData = updatedData.replace(/name:\s*'[^']+'/g, (nameMatch) => {
          return nameMatch + `,\n      kr: '${koreanSkill.name}'`;
        });
      }

      // 설명 추가
      if (koreanSkill.additional_info && !skillData.includes('description:')) {
        // 줄바꿈과 특수문자 처리
        const cleanedInfo = koreanSkill.additional_info
          .replace(/\n/g, ' ')
          .replace(/\[q\]/g, '')
          .replace(/'/g, "\\'");

        updatedData = updatedData.replace(/\}$/, `,
      description: '${cleanedInfo}'
    }`);
      }

      // Wowhead 아이콘 URL 추가 (스킬 ID 기반)
      if (!skillData.includes('wowheadIcon:')) {
        updatedData = updatedData.replace(/\}$/, `,
      wowheadIcon: 'spell_${id}'
    }`);
      }

      return `${skillId}: {${updatedData}}`;
    }

    return match;
  });

  fs.writeFileSync(skillFilePath, content, 'utf8');
  console.log(`✅ ${className} 스킬 파일 업데이트 완료:`, updatedCount, '개 스킬 업데이트됨');
}

// wowheadIcons.js 파일 업데이트
function updateWowheadIconsSystem() {
  const iconsPath = path.join(__dirname, '..', 'src', 'utils', 'wowheadIcons.js');

  // 새로운 함수 추가: 스킬 ID로 Wowhead 아이콘 URL 가져오기
  const additionalCode = `

// 스킬 ID로 Wowhead 아이콘 URL 직접 가져오기
export function getWowheadIconBySpellId(spellId, size = 'large') {
  if (!spellId) return getWowheadIconUrl('inv_misc_questionmark', size);

  // Wowhead는 스킬 ID를 직접 사용하지 않고,
  // 스킬별 고유 아이콘 이름을 사용합니다.
  // 실제로는 Wowhead API를 통해 아이콘 이름을 가져와야 하지만,
  // 여기서는 기본 URL 구조를 사용합니다.
  return \`https://wow.zamimg.com/images/wow/icons/\${sizeMap[size] || 'large'}/inv_misc_questionmark.jpg\`;
}

// 향상된 스킬 아이콘 URL 가져오기 (스킬 ID 우선)
export function getEnhancedSkillIconUrl(skill, size = 'large') {
  // 1. 스킬 ID가 있으면 Wowhead에서 직접 가져오기 시도
  if (skill.id) {
    // 스킬 ID 기반 아이콘 매핑 (주요 스킬들)
    const spellIdToIcon = {
      100: 'ability_warrior_charge', // 돌진
      6673: 'ability_warrior_battleshout', // 전투의 외침
      6544: 'ability_heroicleap', // 영웅의 도약
      97462: 'ability_warrior_rallyingcry', // 재집결의 함성
      355: 'spell_nature_reincarnation', // 도발
      // 더 많은 매핑 추가 필요...
    };

    if (spellIdToIcon[skill.id]) {
      return getWowheadIconUrl(spellIdToIcon[skill.id], size);
    }
  }

  // 2. 기존 getSkillIconUrl 로직 사용
  return getSkillIconUrl(skill, size);
}
`;

  let content = fs.readFileSync(iconsPath, 'utf8');

  // 이미 추가되지 않았다면 추가
  if (!content.includes('getWowheadIconBySpellId')) {
    content = content.replace(/export default/, additionalCode + '\n\nexport default');
    fs.writeFileSync(iconsPath, content, 'utf8');
    console.log('✅ wowheadIcons.js 업데이트 완료');
  }
}

// 메인 실행 함수
async function main() {
  console.log('🔄 스킬 데이터베이스 업데이트 시작...\n');

  // 1. 한국어 스킬 DB 로드
  console.log('📚 한국어 스킬 데이터베이스 로드 중...');
  const koreanSkillDB = loadAllKoreanSkills();
  console.log(`✨ 총 ${Object.keys(koreanSkillDB).length}개의 한국어 스킬 데이터 로드 완료\n`);

  // 2. 각 클래스 스킬 파일 업데이트
  const classes = [
    'warrior', 'paladin', 'hunter', 'rogue', 'priest',
    'mage', 'warlock', 'shaman', 'monk', 'druid',
    'deathKnight', 'demonHunter', 'evoker'
  ];

  console.log('📝 클래스별 스킬 파일 업데이트 중...');
  classes.forEach(className => {
    updateClassSkillFile(className, koreanSkillDB);
  });

  // 3. Wowhead 아이콘 시스템 업데이트
  console.log('\n🎨 Wowhead 아이콘 시스템 업데이트 중...');
  updateWowheadIconsSystem();

  console.log('\n✅ 모든 업데이트 완료!');
  console.log('📌 다음 단계:');
  console.log('1. EnhancedSpellDatabasePage.js에서 getEnhancedSkillIconUrl 사용하도록 수정');
  console.log('2. npm run build로 재빌드');
  console.log('3. 서버 재시작');
}

// 실행
main().catch(console.error);