// Lua 스킬 데이터를 JavaScript 객체로 변환 (최적화 버전)
// 클래스 스킬에 실제로 사용되는 ID만 파싱
const fs = require('fs');
const path = require('path');

// 모든 클래스 파일에서 실제 사용 중인 스킬 ID 수집
const classFiles = [
  'wowdbWarriorSkillsComplete.js',
  'wowdbPaladinSkillsComplete.js',
  'wowdbHunterSkillsComplete.js',
  'wowdbRogueSkillsComplete.js',
  'wowdbPriestSkillsComplete.js',
  'wowdbDeathKnightSkillsComplete.js',
  'wowdbShamanSkillsComplete.js',
  'wowdbMageSkillsComplete.js',
  'wowdbWarlockSkillsComplete.js',
  'wowdbMonkSkillsComplete.js',
  'wowdbDruidSkillsComplete.js',
  'wowdbDemonHunterSkillsComplete.js',
  'wowdbEvokerSkillsComplete.js'
];

// 사용 중인 스킬 ID 수집
const usedSkillIds = new Set();

classFiles.forEach(file => {
  const filePath = path.join(__dirname, 'src/data/skills', file);
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const match = fileContent.match(/export const \w+ = ({[\s\S]*?});/);
    if (match) {
      const classData = eval('(' + match[1] + ')');
      if (classData && typeof classData === 'object') {
        Object.entries(classData).forEach(([category, skills]) => {
          if (skills && typeof skills === 'object') {
            Object.keys(skills).forEach(skillId => {
              usedSkillIds.add(skillId);
            });
          }
        });
      }
    }
  } catch (error) {
    console.error(`Error reading ${file}:`, error.message);
  }
});

console.log(`\n✅ ${usedSkillIds.size}개의 사용 중인 스킬 ID 수집 완료\n`);

// 모든 Lua 파일 읽기
const luaFiles = [
  'spells.lua',
  'spellsOne.lua',
  'spellsTwo.lua',
  'spellsThree.lua',
  'spellsFour.lua',
  'spellsFive.lua',
  'spellsSix.lua',
  'spellsSeven.lua',
  'spellsEight.lua'
];

const databasePath = 'C:\\Users\\D2JK\\바탕화면\\cd\\냉죽\\Database\\Spells';
const koreanSpellData = {};

// Lua 파일 파싱 (사용 중인 ID만)
luaFiles.forEach(fileName => {
  const filePath = path.join(databasePath, fileName);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // 정규식으로 스킬 정보 추출
    const regex = /MultiLanguageSpellData\['ko'\]\[(\d+)\] = \{name = "(.*?)"(?:, additional_info = (nil|"(.*?)"))?}/g;
    let match;

    while ((match = regex.exec(fileContent)) !== null) {
      const id = match[1];

      // 사용 중인 스킬 ID만 처리
      if (!usedSkillIds.has(id)) continue;

      const name = match[2];
      let additionalInfo = match[4] || '';

      // \n을 실제 줄바꿈으로 변환
      additionalInfo = additionalInfo.replace(/\\n/g, '\n');

      // additional_info 파싱하여 메타데이터 추출
      const metadata = {};

      // 재사용 대기시간 추출 (숫자와 단위만)
      const cooldownMatch = additionalInfo.match(/(\d+(?:\.\d+)?)\s*(초|분)\s*재사용 대기시간/);
      if (cooldownMatch) {
        const value = cooldownMatch[1];
        const unit = cooldownMatch[2];
        metadata.cooldown = `${value}${unit}`;
      }

      // 사정거리 추출 (숫자와 단위만)
      const rangeMatch = additionalInfo.match(/(\d+)\s*야드\s*사정거리/);
      if (rangeMatch) {
        metadata.range = `${rangeMatch[1]} 야드`;
      } else if (additionalInfo.includes('근접 사정거리')) {
        metadata.range = '근접';
      } else if (additionalInfo.includes('사정거리 없음')) {
        metadata.range = '무한';
      }

      // 자원 소모 추출 (구조화된 데이터)
      const manaMatch = additionalInfo.match(/(\d+%?)\s*\(기본 마나 중\)/);
      const energyMatch = additionalInfo.match(/기력\s*(\d+)/);
      const rageMatch = additionalInfo.match(/분노\s*(\d+)/);
      const runicMatch = additionalInfo.match(/룬 마력\s*(\d+)/);
      const comboMatch = additionalInfo.match(/(\d+)\s*연계 점수/);
      const focusMatch = additionalInfo.match(/집중\s*(\d+)/);

      if (manaMatch) {
        metadata.resource = {
          type: '마나',
          amount: manaMatch[1],
          display: `${manaMatch[1]}`
        };
      } else if (energyMatch) {
        metadata.resource = {
          type: '기력',
          amount: energyMatch[1],
          display: energyMatch[1]
        };
      } else if (rageMatch) {
        metadata.resource = {
          type: '분노',
          amount: rageMatch[1],
          display: rageMatch[1]
        };
      } else if (runicMatch) {
        metadata.resource = {
          type: '룬 마력',
          amount: runicMatch[1],
          display: runicMatch[1]
        };
      } else if (comboMatch) {
        metadata.resource = {
          type: '연계 점수',
          amount: comboMatch[1],
          display: comboMatch[1]
        };
      } else if (focusMatch) {
        metadata.resource = {
          type: '집중',
          amount: focusMatch[1],
          display: focusMatch[1]
        };
      }

      // 자원 생성 추출
      const generateRageMatch = additionalInfo.match(/분노\s*(\d+)\s*생성/);
      const generateEnergyMatch = additionalInfo.match(/기력\s*(\d+)\s*생성/);
      const generateComboMatch = additionalInfo.match(/(\d+)\s*연계 점수.*생성/);
      const generateRunicMatch = additionalInfo.match(/룬 마력\s*(\d+)\s*생성/);
      const generateHolyPowerMatch = additionalInfo.match(/신성한 힘\s*(\d+)\s*생성/);

      if (generateRageMatch) {
        metadata.resourceGenerate = {
          type: '분노',
          amount: generateRageMatch[1],
          display: generateRageMatch[1]
        };
      } else if (generateEnergyMatch) {
        metadata.resourceGenerate = {
          type: '기력',
          amount: generateEnergyMatch[1],
          display: generateEnergyMatch[1]
        };
      } else if (generateComboMatch) {
        metadata.resourceGenerate = {
          type: '연계 점수',
          amount: generateComboMatch[1],
          display: generateComboMatch[1]
        };
      } else if (generateRunicMatch) {
        metadata.resourceGenerate = {
          type: '룬 마력',
          amount: generateRunicMatch[1],
          display: generateRunicMatch[1]
        };
      } else if (generateHolyPowerMatch) {
        metadata.resourceGenerate = {
          type: '신성한 힘',
          amount: generateHolyPowerMatch[1],
          display: generateHolyPowerMatch[1]
        };
      }

      // 시전 시간 추출 (숫자와 단위만)
      const castMatch = additionalInfo.match(/(\d+(?:\.\d+)?)\s*초\s*주문 시전 시간/);
      if (castMatch) {
        metadata.castTime = `${castMatch[1]}초`;
      } else if (additionalInfo.includes('즉시 시전') || additionalInfo.includes('즉시')) {
        metadata.castTime = '즉시';
      }

      // 설명 정리 - 메타데이터를 제거한 순수 설명만 추출
      if (additionalInfo) {
        let cleanDescription = additionalInfo;

        // 메타데이터 패턴들 제거
        cleanDescription = cleanDescription.replace(/(\d+(?:\.\d+)?\s*(초|분)\s*재사용 대기시간)/g, '');
        cleanDescription = cleanDescription.replace(/(\d+\s*야드\s*사정거리|근접 사정거리|사정거리 없음)/g, '');
        cleanDescription = cleanDescription.replace(/(\d+%?\s*\(기본 마나 중\)|기력\s*\d+|분노\s*\d+|룬 마력\s*\d+)/g, '');
        cleanDescription = cleanDescription.replace(/(\d+(?:\.\d+)?\s*초\s*주문 시전 시간|즉시\s*시전)/g, '');
        cleanDescription = cleanDescription.replace(/즉시/g, '');

        // [q] 같은 프로그램 텍스트 제거
        cleanDescription = cleanDescription.replace(/\[.*?\]/g, '');

        // 연속된 공백과 줄바꿈 정리
        cleanDescription = cleanDescription.replace(/\n\s*\n/g, '\n');
        cleanDescription = cleanDescription.replace(/\s+/g, ' ');
        cleanDescription = cleanDescription.trim();

        // 빈 설명이 아닌 경우에만 저장
        if (cleanDescription && cleanDescription.length > 0) {
          metadata.description = cleanDescription;
        }
      }

      koreanSpellData[id] = {
        name: name,
        koreanName: name,
        ...metadata
      };
    }
  } catch (error) {
    console.error(`Error parsing ${fileName}:`, error.message);
  }
});

// JSON 파일로 저장
const outputPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
const jsContent = `// Database 폴더에서 파싱한 한국어 스킬 데이터베이스 (최적화 버전)
// 실제 사용 중인 ${Object.keys(koreanSpellData).length}개 스킬만 포함

export const koreanSpellDatabase = ${JSON.stringify(koreanSpellData, null, 2)};

export function getKoreanSpellData(spellId) {
  return koreanSpellDatabase[spellId] || null;
}
`;

fs.writeFileSync(outputPath, jsContent, 'utf8');
console.log(`✅ ${Object.keys(koreanSpellData).length}개의 한국어 스킬 데이터 저장 완료 (최적화됨)`);
console.log(`📄 파일 위치: ${outputPath}`);