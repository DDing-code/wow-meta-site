// Lua 스킬 데이터를 JavaScript 객체로 변환
const fs = require('fs');
const path = require('path');

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

// Lua 파일 파싱
luaFiles.forEach(fileName => {
  const filePath = path.join(databasePath, fileName);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // 정규식으로 스킬 정보 추출
    const regex = /MultiLanguageSpellData\['ko'\]\[(\d+)\] = \{name = "(.*?)"(?:, additional_info = (nil|"(.*?)"))?}/g;
    let match;

    while ((match = regex.exec(fileContent)) !== null) {
      const id = match[1];
      const name = match[2];
      let additionalInfo = match[4] || '';

      // \n을 실제 줄바꿈으로 변환
      additionalInfo = additionalInfo.replace(/\\n/g, '\n');

      // additional_info 파싱하여 메타데이터 추출
      const metadata = {};

      // 재사용 대기시간 추출
      const cooldownMatch = additionalInfo.match(/(\d+(?:\.\d+)?)\s*(초|분)\s*재사용 대기시간/);
      if (cooldownMatch) {
        metadata.cooldown = cooldownMatch[0];
      }

      // 사정거리 추출
      const rangeMatch = additionalInfo.match(/(\d+)\s*야드\s*사정거리/);
      if (rangeMatch) {
        metadata.range = rangeMatch[0];
      } else if (additionalInfo.includes('근접 사정거리')) {
        metadata.range = '근접';
      } else if (additionalInfo.includes('사정거리 없음')) {
        metadata.range = '무한';
      }

      // 자원 소모 추출
      const manaMatch = additionalInfo.match(/(\d+%?)\s*\(기본 마나 중\)/);
      const energyMatch = additionalInfo.match(/기력\s*(\d+)/);
      const rageMatch = additionalInfo.match(/분노\s*(\d+)/);
      const runicMatch = additionalInfo.match(/룬 마력\s*(\d+)/);

      if (manaMatch) {
        metadata.resource = `마나 ${manaMatch[1]}`;
      } else if (energyMatch) {
        metadata.resource = `기력 ${energyMatch[1]}`;
      } else if (rageMatch) {
        metadata.resource = `분노 ${rageMatch[1]}`;
      } else if (runicMatch) {
        metadata.resource = `룬 마력 ${runicMatch[1]}`;
      }

      // 시전 시간 추출
      const castMatch = additionalInfo.match(/(\d+(?:\.\d+)?)\s*초\s*주문 시전 시간/);
      if (castMatch) {
        metadata.castTime = castMatch[0];
      } else if (additionalInfo.includes('즉시')) {
        metadata.castTime = '즉시';
      }

      // 설명 추출 (전체 추가 정보)
      if (additionalInfo) {
        metadata.description = additionalInfo;
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
const jsContent = `// Database 폴더에서 파싱한 한국어 스킬 데이터베이스
// 총 ${Object.keys(koreanSpellData).length}개 스킬

export const koreanSpellDatabase = ${JSON.stringify(koreanSpellData, null, 2)};

export function getKoreanSpellData(spellId) {
  return koreanSpellDatabase[spellId] || null;
}
`;

fs.writeFileSync(outputPath, jsContent, 'utf8');
console.log(`✅ ${Object.keys(koreanSpellData).length}개의 한국어 스킬 데이터 저장 완료`);
console.log(`📄 파일 위치: ${outputPath}`);