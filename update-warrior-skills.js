const fs = require('fs');

// 기존 데이터 로드
const skillData = JSON.parse(fs.readFileSync('src/data/wowhead-full-descriptions-complete.json', 'utf8'));

// 전사 주요 스킬 상세 정보 업데이트
const warriorSkillUpdates = {
  // 전사 기본 스킬들
  "1680": {
    ...skillData["1680"],
    "krName": skillData["1680"]?.krName || "소용돌이",
    "description": "무기를 휘둘러 주변 8미터 내의 모든 적에게 무기 공격력의 70%의 물리 피해를 입힙니다. 적 하나당 분노를 3씩, 최대 5명까지 생성합니다.",
    "cooldown": "없음",
    "range": "8미터 (반경)",
    "castTime": "즉시 시전",
    "resource": "30 분노 소모"
  },

  "23920": {
    ...skillData["23920"],
    "krName": skillData["23920"]?.krName || "방패 밀쳐내기",
    "description": "방패로 적을 강타하여 물리 피해를 입히고 3초 동안 시전을 방해합니다. 추가로 분노를 15 생성합니다.",
    "cooldown": "12초",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "15 분노 생성"
  },

  "1715": {
    ...skillData["1715"],
    "krName": skillData["1715"]?.krName || "무력화",
    "description": "적의 이동 속도를 8초 동안 50% 감소시킵니다.",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "10 분노"
  },

  "12294": {
    ...skillData["12294"],
    "krName": skillData["12294"]?.krName || "죽음의 일격",
    "description": "무기 공격력의 195%에 해당하는 물리 피해를 입히고 잃은 생명력의 30%를 회복합니다. 최소 20% 생명력 회복을 보장합니다.",
    "cooldown": "6초",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "20 분노"
  },

  "845": {
    ...skillData["845"],
    "krName": skillData["845"]?.krName || "회전베기",
    "description": "무기 공격력의 60%의 물리 피해를 입히고 6초에 걸쳐 추가 출혈 피해를 입힙니다.",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "30 분노",
    "duration": "6초"
  },

  "5308": {
    ...skillData["5308"],
    "krName": skillData["5308"]?.krName || "처형",
    "description": "생명력이 20% 이하인 적에게 강력한 일격을 가합니다. 무기 공격력의 250%의 물리 피해를 입힙니다.",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "20 분노"
  },

  "871": {
    ...skillData["871"],
    "krName": skillData["871"]?.krName || "방패의 벽",
    "description": "8초 동안 받는 모든 피해를 50% 감소시킵니다.",
    "cooldown": "4분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "8초"
  },

  "18499": {
    ...skillData["18499"],
    "krName": skillData["18499"]?.krName || "광전사의 격노",
    "description": "6초 동안 매 초마다 분노를 10씩 생성하고 피해가 20% 증가하지만 받는 피해도 20% 증가합니다.",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "6초"
  },

  "1719": {
    ...skillData["1719"],
    "krName": skillData["1719"]?.krName || "무모한 희생",
    "description": "10초 동안 극대화 확률이 20% 증가합니다.",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "10초"
  },

  "85288": {
    ...skillData["85288"],
    "krName": skillData["85288"]?.krName || "광란의 공격",
    "description": "다음 2회의 피의 갈증이나 분쇄의 일격이 즉시 발동되고 분노를 소모하지 않습니다.",
    "cooldown": "45초",
    "range": "자신",
    "castTime": "즉시 시전"
  },

  "23881": {
    ...skillData["23881"],
    "krName": skillData["23881"]?.krName || "피의 갈증",
    "description": "대상에게 무기 공격력의 85%의 물리 피해를 입힙니다. 치명타 적중 시 격노가 발동됩니다.",
    "cooldown": "4.5초",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "8 분노"
  },

  "190456": {
    ...skillData["190456"],
    "krName": skillData["190456"]?.krName || "무시",
    "description": "대상의 방어도를 3초 동안 무시하고 받는 피해를 20% 감소시킵니다.",
    "cooldown": "25초",
    "range": "근접",
    "castTime": "즉시 시전",
    "duration": "3초",
    "resource": "40 분노"
  },

  "2565": {
    ...skillData["2565"],
    "krName": skillData["2565"]?.krName || "방패 가격",
    "description": "방패로 적을 가격하여 물리 피해를 입히고 1.5초 동안 기절시킵니다.",
    "cooldown": "6초",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "15 분노"
  },

  "6552": {
    ...skillData["6552"],
    "krName": skillData["6552"]?.krName || "자루 공격",
    "description": "무기 자루로 적을 가격하여 4초 동안 주문 시전을 차단합니다.",
    "cooldown": "15초",
    "range": "근접",
    "castTime": "즉시 시전"
  },

  "1464": {
    ...skillData["1464"],
    "krName": skillData["1464"]?.krName || "분쇄의 일격",
    "description": "적을 분쇄하여 무기 공격력의 150%의 물리 피해를 입히고 10초 동안 적의 받는 치유량을 50% 감소시킵니다.",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "30 분노",
    "duration": "10초"
  },

  "6572": {
    ...skillData["6572"],
    "krName": skillData["6572"]?.krName || "복수",
    "description": "다음 2회 공격에 대해 방어 또는 무기 막기를 시도합니다. 성공 시 분노를 5 생성합니다.",
    "cooldown": "5초",
    "range": "자신",
    "castTime": "즉시 시전",
    "resource": "20 분노"
  },

  "107574": {
    ...skillData["107574"],
    "krName": skillData["107574"]?.krName || "투신",
    "description": "20초 동안 가속이 25% 증가하고 이동 불가 효과에서 벗어납니다.",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "20초"
  },

  "46924": {
    ...skillData["46924"],
    "krName": skillData["46924"]?.krName || "칼날 폭풍",
    "description": "6초 동안 회전하며 주변 8미터 내의 모든 적에게 1초마다 물리 피해를 입힙니다. 이동 속도 감소 효과에 면역이 됩니다.",
    "cooldown": "1.5분",
    "range": "8미터 (반경)",
    "castTime": "즉시 시전",
    "duration": "6초"
  },

  "5246": {
    ...skillData["5246"],
    "krName": skillData["5246"]?.krName || "위협의 외침",
    "description": "10미터 내의 최대 5명의 적을 8초 동안 공포에 떨게 하여 도망치게 합니다.",
    "cooldown": "1.5분",
    "range": "10미터 (반경)",
    "castTime": "즉시 시전",
    "duration": "8초"
  },

  "6343": {
    ...skillData["6343"],
    "krName": skillData["6343"]?.krName || "천둥벼락",
    "description": "주변 8미터 내의 모든 적에게 물리 피해를 입히고 10초 동안 이동 속도를 20% 감소시킵니다.",
    "cooldown": "6초",
    "range": "8미터 (반경)",
    "castTime": "즉시 시전",
    "resource": "5 분노",
    "duration": "10초"
  }
};

// 기존 데이터에 전사 스킬 상세 정보 추가
Object.keys(warriorSkillUpdates).forEach(id => {
  skillData[id] = warriorSkillUpdates[id];
});

// 파일 저장
fs.writeFileSync('src/data/wowhead-full-descriptions-complete.json', JSON.stringify(skillData, null, 2), 'utf8');

console.log('전사 스킬 상세 정보 업데이트 완료:');
console.log(`- 업데이트된 스킬 수: ${Object.keys(warriorSkillUpdates).length}`);
console.log('- 업데이트된 스킬 ID:', Object.keys(warriorSkillUpdates).join(', '));
console.log('\n파일이 성공적으로 저장되었습니다.');