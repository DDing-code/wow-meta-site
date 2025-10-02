const fs = require('fs');
const path = require('path');

// 이전 백업 파일을 모듈로 로드
const backupPath = path.join(__dirname, 'src/data/koreanSpellDatabase.backup.before-translation-fix.js');
const backupContent = fs.readFileSync(backupPath, 'utf8');

// koreanSpellDatabase 객체를 안전하게 추출
const dbMatch = backupContent.match(/export const koreanSpellDatabase = ({[\s\S]*?});[\s\S]*?export function/);
if (!dbMatch) {
  console.error('❌ 백업 파일에서 데이터베이스를 찾을 수 없습니다.');
  process.exit(1);
}

// JavaScript 객체를 파싱
let originalDB;
try {
  // Function 생성자를 사용하여 안전하게 실행
  const func = new Function('return ' + dbMatch[1]);
  originalDB = func();
} catch (e) {
  console.error('❌ 데이터베이스 파싱 실패:', e.message);
  process.exit(1);
}

console.log(`📊 원본 데이터베이스: ${Object.keys(originalDB).length}개 스킬`);

// WoWhead 공식 번역 (확장된 목록)
const wowheadTranslations = {
  // 전사
  "1464": "강타",
  "23920": "주문 반사",
  "100": "돌진",
  "355": "도발",
  "6552": "자루 공격",
  "18499": "광전사의 격노",
  "1161": "도전의 외침",
  "97462": "재집결의 함성",
  "12323": "날카로운 고함",
  "5246": "위협의 외침",
  "1160": "사기의 외침",
  "107574": "투신",
  "46924": "칼날폭풍",
  "1719": "무모한 희생",
  "871": "방패의 벽",
  "12975": "최후의 저항",
  "184364": "격노의 강타",

  // 성기사
  "853": "심판의 망치",
  "633": "신의 축복",
  "642": "신의 보호막",
  "1044": "자유의 축복",
  "1022": "보호의 축복",
  "31884": "응징의 격노",
  "86659": "고대 왕의 수호자",
  "31850": "헌신적인 수호자",
  "498": "신성한 보호",

  // 사냥꾼
  "186265": "거북의 상",
  "109304": "활기",
  "187650": "얼음 덫",
  "195645": "날개 클립",
  "147362": "역습사격",
  "19574": "야수의 격노",
  "193530": "야생의 상",
  "186257": "치타의 상",
  "5384": "죽은척",

  // 도적
  "1856": "소멸",
  "2983": "전력 질주",
  "1766": "발차기",
  "408": "급소 가격",
  "31224": "그림자 망토",
  "5277": "회피",
  "1784": "은신",
  "2094": "실명",

  // 사제
  "17": "신의 권능: 보호막",
  "586": "소실",
  "8122": "영혼의 절규",
  "32375": "대규모 무효화",
  "10060": "마력 주입",
  "47585": "분산",
  "15487": "침묵",

  // 마법사
  "1953": "점멸",
  "45438": "얼음 방패",
  "2139": "마법 차단",
  "122": "서리 회오리",
  "12051": "환기",
  "55342": "거울 이미지",
  "66": "투명화",
  "110959": "상급 투명화",

  // 흑마법사
  "104773": "영원한 결의",
  "30283": "어둠의 격노",
  "48018": "악마의 마법진",
  "5484": "공포의 울부짖음",
  "333889": "지옥불정령",

  // 주술사
  "108271": "영혼 이동",
  "2484": "대지 정령 토템",
  "51490": "천둥폭풍",
  "192077": "바람 질주",
  "108281": "선조의 인도",
  "98008": "영혼 고리 토템",

  // 수도사
  "115203": "강화주",
  "116849": "기의 고치",
  "119381": "쌍룡의 발차기",
  "122470": "업보의 손아귀",
  "115078": "마비",
  "122783": "마법 해소",

  // 드루이드
  "5487": "곰 변신",
  "768": "표범 변신",
  "1850": "질주",
  "22812": "나무껍질",
  "102342": "무쇠가죽",
  "106951": "광폭화",
  "5215": "숨기",

  // 죽음기사
  "48707": "대마법 보호막",
  "48792": "얼음같은 인내력",
  "49576": "죽음의 손아귀",
  "47528": "정신 얼리기",
  "48265": "죽음의 진군",
  "51052": "대마법 지대",

  // 악마사냥꾼
  "196718": "어둠의 질주",
  "198589": "흐릿해지기",
  "187827": "탈태",
  "188501": "안광",
  "217832": "감금",
  "183752": "분열",

  // 기원사
  "363916": "흑요석 비늘",
  "374348": "갱신의 불길",
  "357208": "불의 숨결",
  "358385": "산사태",
  "370665": "구조의 불길"
};

// 깨끗한 데이터베이스 생성
const cleanDatabase = {};

Object.keys(originalDB).forEach(skillId => {
  const skill = originalDB[skillId];

  // WoWhead 번역 우선 적용
  const koreanName = wowheadTranslations[skillId] || skill.koreanName || skill.name;

  // 필수 필드만 포함한 깨끗한 객체 생성
  const cleanSkill = {
    name: skill.name || skill.englishName || koreanName,
    koreanName: koreanName,
    class: skill.class || "UNKNOWN",
    icon: skill.icon || skill.iconName || "inv_misc_questionmark"
  };

  // 카테고리와 타입 설정
  cleanSkill.category = skill.category || "baseline";
  cleanSkill.type = skill.type || "active";

  // 선택적 필드 추가 (있는 경우만)
  if (skill.cooldown) cleanSkill.cooldown = skill.cooldown;
  if (skill.resource) cleanSkill.resource = skill.resource;
  if (skill.castTime) cleanSkill.castTime = skill.castTime;
  if (skill.range) cleanSkill.range = skill.range;
  if (skill.description) cleanSkill.description = skill.description;

  cleanDatabase[skillId] = cleanSkill;
});

// 파일 내용 생성
const fileContent = `// TWW Season 3 통합 스킬 데이터베이스
// WoWhead 공식 번역 적용 (ko.wowhead.com 기준)
// 총 ${Object.keys(cleanDatabase).length}개 스킬
// 패치: 11.2.0

const koreanSpellDatabase = ${JSON.stringify(cleanDatabase, null, 2)};

export { koreanSpellDatabase };

export function getKoreanSpellData(spellId) {
  return koreanSpellDatabase[spellId] || null;
}`;

// 파일 저장
const outputPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');

console.log(`✅ 전체 데이터베이스 복원 완료!`);
console.log(`📊 총 ${Object.keys(cleanDatabase).length}개 스킬`);
console.log(`📝 WoWhead 공식 번역 ${Object.keys(wowheadTranslations).length}개 적용`);

// 데이터 품질 검증
let missingClass = 0;
let missingIcon = 0;
let missingType = 0;
let hasWowheadTranslation = 0;

Object.entries(cleanDatabase).forEach(([id, skill]) => {
  if (!skill.class || skill.class === "UNKNOWN") missingClass++;
  if (!skill.icon || skill.icon === "inv_misc_questionmark") missingIcon++;
  if (!skill.type) missingType++;
  if (wowheadTranslations[id]) hasWowheadTranslation++;
});

console.log(`\n📈 데이터 품질:`);
console.log(`✅ WoWhead 공식 번역: ${hasWowheadTranslation}개`);
console.log(`- 클래스 정보: ${Object.keys(cleanDatabase).length - missingClass}개 (${((1 - missingClass/Object.keys(cleanDatabase).length) * 100).toFixed(1)}%)`);
console.log(`- 아이콘 정보: ${Object.keys(cleanDatabase).length - missingIcon}개 (${((1 - missingIcon/Object.keys(cleanDatabase).length) * 100).toFixed(1)}%)`);
console.log(`- 타입 정보: ${Object.keys(cleanDatabase).length - missingType}개 (${((1 - missingType/Object.keys(cleanDatabase).length) * 100).toFixed(1)}%)`);

// 몇 가지 예시 출력
console.log(`\n📋 번역 적용 예시:`);
const examples = ["100", "1953", "1856", "17", "853"];
examples.forEach(id => {
  if (cleanDatabase[id]) {
    console.log(`- ${id}: ${cleanDatabase[id].koreanName} (${cleanDatabase[id].name})`);
  }
});