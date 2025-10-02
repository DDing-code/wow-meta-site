const fs = require('fs');
const path = require('path');

// 데이터 파일 경로
const dataPath = path.join(__dirname, '..', 'src', 'data', 'wowhead-full-descriptions-complete.json');
const iconMappingPath = path.join(__dirname, '..', 'src', 'data', 'iconMapping.json');

// 현재 데이터 읽기
const currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const iconMapping = JSON.parse(fs.readFileSync(iconMappingPath, 'utf8'));

// Wowhead에서 확인한 정확한 데이터
const correctData = {
  // 성스러운 빛
  "82326": {
    "krName": "성스러운 빛",
    "description": "강력하지만 자원 소모가 많은 주문으로, 아군 대상의 생명력을 (주문력의 1126.32%)만큼 회복시킵니다.",
    "icon": "spell_holy_surgeoflight",
    "range": "40 야드",
    "castTime": "2초",
    "resource": "7% 기본 마나"
  },
  // 사악한 일격
  "1752": {
    "krName": "사악한 일격",
    "description": "흉포하게 적을 공격하여 (전투력의 21.762%)의 물리 피해를 입힙니다. 연계 점수 1점을 얻습니다.",
    "icon": "spell_shadow_ritualofsacrifice",
    "range": "근접",
    "castTime": "즉시",
    "resource": "기력 45"
  },
  // 추가로 자주 보이는 스킬들도 수정
  "17": {
    "krName": "신의 권능: 보호막",
    "description": "대상을 보호막으로 감싸 피해를 흡수합니다. 15초 동안 지속됩니다.",
    "icon": "spell_holy_powerwordshield",
    "range": "40미터",
    "castTime": "즉시",
    "resource": "마나 2.5%"
  },
  "100": {
    "krName": "돌진",
    "description": "적에게 돌진하여 0.5초 동안 적을 이동 불가 상태로 만들고 분노를 10만큼 생성합니다.",
    "icon": "ability_warrior_charge",
    "range": "8~25미터",
    "castTime": "즉시",
    "resource": "20 분노 생성"
  },
  "774": {
    "krName": "회복",
    "description": "대상을 12초에 걸쳐 치유합니다.",
    "icon": "spell_nature_rejuvenation",
    "range": "40미터",
    "castTime": "즉시",
    "resource": "마나 1.5%"
  },
  "1784": {
    "krName": "은신",
    "description": "은신 상태가 되어 10초 동안 또는 행동을 취할 때까지 적에게 발각되지 않습니다.",
    "icon": "ability_stealth",
    "range": "자신",
    "castTime": "즉시",
    "cooldown": "10초"
  },
  "883": {
    "krName": "야수 소환",
    "description": "야수를 소환하여 함께 싸웁니다.",
    "icon": "ability_hunter_beastsoothe",
    "range": "자신",
    "castTime": "즉시"
  },
  "2641": {
    "krName": "야수 소환 해제",
    "description": "소환한 야수를 돌려보냅니다.",
    "icon": "spell_nature_spiritwolf",
    "range": "자신",
    "castTime": "즉시"
  }
};

// 데이터 업데이트
let updateCount = 0;
let iconUpdateCount = 0;

for (const [skillId, skillData] of Object.entries(correctData)) {
  // 기존 데이터 유지하면서 업데이트
  if (currentData[skillId]) {
    currentData[skillId] = {
      ...currentData[skillId],
      ...skillData
    };
  } else {
    currentData[skillId] = skillData;
  }
  updateCount++;

  // 아이콘 매핑 업데이트
  if (skillData.icon) {
    iconMapping[skillId] = skillData.icon;
    iconUpdateCount++;
  }
}

// 파일 저장
fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2), 'utf8');
fs.writeFileSync(iconMappingPath, JSON.stringify(iconMapping, null, 2), 'utf8');

console.log('===== Wowhead 데이터 업데이트 완료 =====');
console.log(`✅ 업데이트된 스킬: ${updateCount}개`);
console.log(`🎨 업데이트된 아이콘: ${iconUpdateCount}개`);
console.log('');
console.log('업데이트된 스킬 목록:');
for (const [id, data] of Object.entries(correctData)) {
  console.log(`- ${data.krName} (${id}): ${data.icon}`);
}