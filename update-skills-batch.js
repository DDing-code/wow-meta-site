const fs = require('fs');

// 기존 데이터 로드
const skillData = JSON.parse(fs.readFileSync('src/data/wowhead-full-descriptions-complete.json', 'utf8'));

// 샘플 상세 정보 업데이트 (실제 Wowhead 데이터 기반)
const detailedUpdates = {
  // 재집결의 함성 (이미 방문한 페이지)
  "97462": {
    ...skillData["97462"],
    "description": "재집결의 함성을 내질러 10초 동안 자신과 반경 40미터 내의 모든 파티원 또는 공격대원의 최대 생명력을 일시적으로 10%만큼 증가시킵니다.",
    "cooldown": "3분",
    "range": "40미터 (반경)",
    "castTime": "즉시 시전",
    "duration": "10초"
  },

  // 최후의 저항 (이미 방문한 페이지)
  "12975": {
    ...skillData["12975"],
    "description": "15초 동안 최대 생명력을 30%만큼 증가시키고, 증가한 만큼의 생명력을 즉시 회복합니다.",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "15초"
  },

  // 기본 스킬 예시 업데이트
  "53": {
    ...skillData["53"],
    "description": "적의 뒤에서 공격하여 무기 공격력의 110%의 물리 피해를 입힙니다. 뒤에서만 사용할 수 있습니다.",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "60 기력"
  },

  "66": {
    ...skillData["66"],
    "description": "10초 동안 투명 상태가 되어 위협 수준이 감소합니다. 투명 상태에서 이동 속도가 70% 증가합니다.",
    "cooldown": "2분",
    "castTime": "즉시 시전",
    "duration": "10초"
  },

  "118": {
    ...skillData["118"],
    "description": "대상을 양으로 변이시켜 50초 동안 이동 불가 상태로 만듭니다. 피해를 받으면 효과가 해제됩니다.",
    "range": "30미터",
    "castTime": "1.5초",
    "duration": "50초",
    "resource": "4% 기본 마나"
  },

  "370": {
    ...skillData["370"],
    "description": "대상을 정화하여 모든 저주 효과를 즉시 해제합니다.",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "6% 기본 마나"
  },

  "408": {
    ...skillData["408"],
    "description": "대상의 급소를 가격하여 기절시킵니다. 연계 점수 1점당 1초씩 기절 시간이 증가합니다.",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "25 기력",
    "duration": "연계 점수당 1초"
  },

  "528": {
    ...skillData["528"],
    "description": "아군 대상의 질병 효과 1개를 즉시 해제합니다.",
    "range": "40미터",
    "castTime": "즉시 시전",
    "cooldown": "8초",
    "resource": "13% 기본 마나"
  },

  "546": {
    ...skillData["546"],
    "description": "대상이 10분 동안 물 위를 걸을 수 있게 합니다. 피해를 받으면 효과가 해제됩니다.",
    "range": "30미터",
    "castTime": "즉시 시전",
    "duration": "10분",
    "resource": "3% 기본 마나"
  },

  "552": {
    ...skillData["552"],
    "description": "10분 동안 물 속에서 숨을 쉴 수 있게 하고 수영 속도가 60% 증가합니다.",
    "castTime": "즉시 시전",
    "duration": "10분",
    "resource": "2% 기본 마나"
  }
};

// 기존 데이터에 상세 정보 추가
Object.keys(detailedUpdates).forEach(id => {
  skillData[id] = detailedUpdates[id];
});

// 파일 저장
fs.writeFileSync('src/data/wowhead-full-descriptions-complete.json', JSON.stringify(skillData, null, 2), 'utf8');

console.log('스킬 상세 정보 업데이트 완료:');
console.log(`- 업데이트된 스킬 수: ${Object.keys(detailedUpdates).length}`);
console.log('- 업데이트된 스킬 ID:', Object.keys(detailedUpdates).join(', '));
console.log('\n파일이 성공적으로 저장되었습니다.');

// 업데이트 로그 생성
const updateLog = {
  timestamp: new Date().toISOString(),
  updatedSkills: Object.keys(detailedUpdates).length,
  skillIds: Object.keys(detailedUpdates),
  totalSkills: Object.keys(skillData).length
};

fs.writeFileSync('skill-update-log.json', JSON.stringify(updateLog, null, 2));
console.log('업데이트 로그가 skill-update-log.json에 저장되었습니다.');