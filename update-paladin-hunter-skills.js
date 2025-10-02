const fs = require('fs');

// 기존 데이터 로드
const skillData = JSON.parse(fs.readFileSync('src/data/wowhead-full-descriptions-complete.json', 'utf8'));

// 성기사 주요 스킬
const paladinSkillUpdates = {
  "633": {
    ...skillData["633"],
    "krName": skillData["633"]?.krName || "신의 축복",
    "description": "8초 동안 무적 상태가 되어 모든 피해와 해로운 효과에 면역이 됩니다. 자신의 현재 공격과 주문 시전을 방해하지 않습니다.",
    "cooldown": "5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "8초"
  },

  "853": {
    ...skillData["853"],
    "krName": skillData["853"]?.krName || "심판의 망치",
    "description": "대상을 빛의 망치로 가격하여 6초 동안 기절시킵니다.",
    "cooldown": "1분",
    "range": "10미터",
    "castTime": "즉시 시전",
    "duration": "6초",
    "resource": "3% 기본 마나"
  },

  "31884": {
    ...skillData["31884"],
    "krName": skillData["31884"]?.krName || "복수의 격노",
    "description": "20초 동안 가속과 극대화가 20% 증가하고 피해와 치유량이 20% 증가합니다.",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "20초"
  },

  "1044": {
    ...skillData["1044"],
    "krName": skillData["1044"]?.krName || "자유의 축복",
    "description": "대상을 8초 동안 이동 불가 및 이동 속도 감소 효과에서 해방시키고 면역을 부여합니다.",
    "cooldown": "25초",
    "range": "40미터",
    "castTime": "즉시 시전",
    "duration": "8초",
    "resource": "7% 기본 마나"
  },

  "1022": {
    ...skillData["1022"],
    "krName": skillData["1022"]?.krName || "보호의 축복",
    "description": "대상을 10초 동안 물리 공격으로부터 보호하지만, 보호받는 동안 공격하거나 주문을 사용할 수 없습니다.",
    "cooldown": "5분",
    "range": "40미터",
    "castTime": "즉시 시전",
    "duration": "10초",
    "resource": "5% 기본 마나"
  },

  "642": {
    ...skillData["642"],
    "krName": skillData["642"]?.krName || "천상의 보호막",
    "description": "8초 동안 받는 피해를 50% 감소시킵니다.",
    "cooldown": "5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "8초"
  },

  "31850": {
    ...skillData["31850"],
    "krName": skillData["31850"]?.krName || "헌신적인 수호자",
    "description": "8초 동안 받는 마법 피해를 20% 감소시키고 모든 파티원과 공격대원의 피해를 3% 감소시킵니다.",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "8초"
  },

  "86659": {
    ...skillData["86659"],
    "krName": skillData["86659"]?.krName || "고대 왕의 수호자",
    "description": "8초 동안 받는 피해를 50% 감소시킵니다.",
    "cooldown": "5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "8초"
  },

  "20271": {
    ...skillData["20271"],
    "krName": skillData["20271"]?.krName || "심판",
    "description": "대상에게 신성 피해를 입히고 축성을 충전합니다.",
    "cooldown": "없음",
    "range": "30미터",
    "castTime": "즉시 시전",
    "resource": "3% 기본 마나"
  },

  "35395": {
    ...skillData["35395"],
    "krName": skillData["35395"]?.krName || "성전사의 일격",
    "description": "대상에게 무기 공격력의 280%의 물리 피해를 입힙니다.",
    "cooldown": "6초",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "2 신성한 힘"
  }
};

// 사냥꾼 주요 스킬
const hunterSkillUpdates = {
  "19801": {
    ...skillData["19801"],
    "krName": skillData["19801"]?.krName || "평정",
    "description": "애완동물을 평정시켜 10초 동안 모든 피해 효과를 제거하고 면역 상태로 만듭니다. 애완동물은 이 기간 동안 공격할 수 없습니다.",
    "cooldown": "5분",
    "range": "애완동물",
    "castTime": "즉시 시전",
    "duration": "10초"
  },

  "5384": {
    ...skillData["5384"],
    "krName": skillData["5384"]?.krName || "죽은 척하기",
    "description": "5분 동안 죽은 척을 하여 전투를 피합니다. 이동하거나 행동하면 효과가 취소됩니다.",
    "cooldown": "30초",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "5분"
  },

  "186265": {
    ...skillData["186265"],
    "krName": skillData["186265"]?.krName || "거북이의 상",
    "description": "8초 동안 받는 피해를 30% 감소시키고 공격이 반사됩니다.",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "8초"
  },

  "193530": {
    ...skillData["193530"],
    "krName": skillData["193530"]?.krName || "야생의 상",
    "description": "10초 동안 극대화가 30% 증가하고 충전 시간이 30% 감소합니다.",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "10초"
  },

  "19574": {
    ...skillData["19574"],
    "krName": skillData["19574"]?.krName || "야수의 격노",
    "description": "당신과 애완동물의 피해가 15초 동안 25% 증가합니다.",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "15초"
  },

  "147362": {
    ...skillData["147362"],
    "krName": skillData["147362"]?.krName || "역습",
    "description": "대상을 2초 동안 기절시킵니다. 회피 후에만 사용 가능합니다.",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "duration": "2초"
  },

  "187650": {
    ...skillData["187650"],
    "krName": skillData["187650"]?.krName || "얼음 덫",
    "description": "대상 지역에 얼음 덫을 설치합니다. 발동 시 10미터 내의 적을 10초 동안 50% 감속시킵니다.",
    "cooldown": "30초",
    "range": "40미터",
    "castTime": "즉시 시전",
    "duration": "1분 (덫) / 10초 (효과)"
  },

  "109248": {
    ...skillData["109248"],
    "krName": skillData["109248"]?.krName || "구속의 사격",
    "description": "대상을 3초 동안 묶어 이동할 수 없게 합니다.",
    "cooldown": "45초",
    "range": "30미터",
    "castTime": "즉시 시전",
    "duration": "3초"
  },

  "288613": {
    ...skillData["288613"],
    "krName": skillData["288613"]?.krName || "정조준",
    "description": "15초 동안 가속이 40% 증가하고 정조준 사격과 신비한 사격이 즉시 시전됩니다.",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "15초"
  },

  "257044": {
    ...skillData["257044"],
    "krName": skillData["257044"]?.krName || "속사",
    "description": "3초 동안 가속이 60% 증가합니다.",
    "cooldown": "20초",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "3초"
  },

  "53351": {
    ...skillData["53351"],
    "krName": skillData["53351"]?.krName || "연속 사격",
    "description": "대상과 그 뒤의 모든 적에게 물리 피해를 입힙니다. 최대 6명까지 명중합니다.",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "3초",
    "resource": "35 집중"
  },

  "193455": {
    ...skillData["193455"],
    "krName": skillData["193455"]?.krName || "코브라 사격",
    "description": "대상에게 물리 피해를 입히고 집중을 14 회복합니다.",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "35 집중 (14 회복)"
  },

  "217200": {
    ...skillData["217200"],
    "krName": skillData["217200"]?.krName || "마무리 사격",
    "description": "생명력이 20% 이하인 대상에게 막대한 피해를 입힙니다. 처치 시 재사용 대기시간이 초기화됩니다.",
    "cooldown": "20초",
    "range": "50미터",
    "castTime": "즉시 시전",
    "resource": "10 집중"
  }
};

// 모든 업데이트 병합
const allUpdates = {...paladinSkillUpdates, ...hunterSkillUpdates};

// 기존 데이터에 상세 정보 추가
Object.keys(allUpdates).forEach(id => {
  skillData[id] = allUpdates[id];
});

// 파일 저장
fs.writeFileSync('src/data/wowhead-full-descriptions-complete.json', JSON.stringify(skillData, null, 2), 'utf8');

console.log('성기사 & 사냥꾼 스킬 상세 정보 업데이트 완료:');
console.log(`- 성기사 스킬: ${Object.keys(paladinSkillUpdates).length}개`);
console.log(`- 사냥꾼 스킬: ${Object.keys(hunterSkillUpdates).length}개`);
console.log(`- 총 업데이트: ${Object.keys(allUpdates).length}개`);
console.log('\n파일이 성공적으로 저장되었습니다.');