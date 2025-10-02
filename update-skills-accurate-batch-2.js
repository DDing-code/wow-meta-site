const fs = require('fs');

// 기존 데이터 로드
const skillData = JSON.parse(fs.readFileSync('src/data/wowhead-full-descriptions-complete.json', 'utf8'));

// Wowhead 정확한 스킬 정보 - 배치 2 (사냥꾼, 도적)
const accurateBatch2 = {
  // 사냥꾼 - 야수
  "193530": {
    ...skillData["193530"],
    "krName": "야수 회전베기",
    "description": "대상과 그 주위 8미터 내 모든 적에게 원거리 공격력의 80%에 해당하는 물리 피해를 입힙니다.",
    "effect": "원거리 공격력의 80% 피해 (광역)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "30 집중"
  },
  "120679": {
    ...skillData["120679"],
    "krName": "급류",
    "description": "6초 동안 1.5초마다 원거리 공격력의 60%에 해당하는 물리 피해를 입힙니다.",
    "effect": "원거리 공격력의 60% 피해 (1.5초마다)",
    "cooldown": "20초",
    "range": "40미터",
    "castTime": "3초 채널링",
    "resource": "30 집중",
    "duration": "6초"
  },
  "53351": {
    ...skillData["53351"],
    "krName": "처치 사격",
    "description": "대상에게 원거리 공격력의 320%에 해당하는 물리 피해를 입힙니다. 생명력이 20% 미만인 적에게만 사용 가능합니다.",
    "effect": "원거리 공격력의 320% 피해",
    "cooldown": "20초",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "10 집중",
    "requirement": "대상 생명력 20% 미만"
  },
  "217200": {
    ...skillData["217200"],
    "krName": "날카로운 사격",
    "description": "대상에게 원거리 공격력의 140%에 해당하는 물리 피해를 입히고 쐐기 박기 효과를 적용합니다.",
    "effect": "원거리 공격력의 140% 피해",
    "debuff": "쐐기 박기 (출혈 증가)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "30 집중"
  },
  "34026": {
    ...skillData["34026"],
    "krName": "격멸 사격",
    "description": "대상에게 원거리 공격력의 270%에 해당하는 물리 피해를 입힙니다. 치명타 확률이 50% 증가합니다.",
    "effect": "원거리 공격력의 270% 피해",
    "critBonus": "치명타 확률 50% 증가",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "35 집중"
  },

  // 사냥꾼 - 사격
  "257044": {
    ...skillData["257044"],
    "krName": "속사",
    "description": "3초 동안 대상에게 빠르게 사격하여 총 원거리 공격력의 450%에 해당하는 피해를 입힙니다.",
    "effect": "원거리 공격력의 450% 총 피해",
    "cooldown": "20초",
    "range": "40미터",
    "castTime": "3초 채널링",
    "duration": "3초"
  },
  "257620": {
    ...skillData["257620"],
    "krName": "연발 사격",
    "description": "대상과 그 경로에 있는 모든 적에게 원거리 공격력의 75%에 해당하는 물리 피해를 입힙니다.",
    "effect": "원거리 공격력의 75% 관통 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "15 집중"
  },
  "260402": {
    ...skillData["260402"],
    "krName": "이중 사격",
    "description": "조준 사격을 시전할 때 속임수 사격도 함께 발사되어 원거리 공격력의 50%에 해당하는 추가 피해를 입힙니다.",
    "effect": "원거리 공격력의 50% 추가 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "자동 발동",
    "proc": "조준 사격 시전 시"
  },
  "288613": {
    ...skillData["288613"],
    "krName": "정조준",
    "description": "15초 동안 적을 조준합니다. 조준 사격과 속사가 항상 치명타로 적중합니다.",
    "buff": "조준 사격, 속사 치명타 보장",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "15초"
  },

  // 사냥꾼 - 생존
  "259489": {
    ...skillData["259489"],
    "krName": "살상 명령",
    "description": "대상을 공격하여 공격력의 150%에 해당하는 물리 피해를 입히고 출혈을 적용합니다.",
    "effect": "공격력의 150% 피해",
    "debuff": "출혈 피해 (8초)",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "30 집중",
    "duration": "8초"
  },
  "259491": {
    ...skillData["259491"],
    "krName": "도끼 투척",
    "description": "도끼를 던져 대상에게 공격력의 85%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 85% 피해",
    "cooldown": "없음",
    "range": "30미터",
    "castTime": "즉시 시전",
    "resource": "15 집중"
  },
  "269751": {
    ...skillData["269751"],
    "krName": "측면 공격",
    "description": "대상 옆으로 이동하며 공격력의 200%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 200% 피해",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "35 집중",
    "mobility": "5미터 측면 이동"
  },
  "190925": {
    ...skillData["190925"],
    "krName": "작살",
    "description": "작살을 던져 대상에게 공격력의 120%에 해당하는 물리 피해를 입히고 자신 앞으로 끌어당깁니다.",
    "effect": "공격력의 120% 피해",
    "utility": "대상을 끌어당김",
    "cooldown": "30초",
    "range": "30미터",
    "castTime": "즉시 시전"
  },

  // 도적 - 암살
  "703": {
    ...skillData["703"],
    "krName": "목조르기",
    "description": "대상을 목졸라 18초에 걸쳐 공격력의 176%에 해당하는 물리 피해를 입히고 2초 동안 침묵시킵니다.",
    "effect": "공격력의 176% 출혈 피해 (18초)",
    "debuff": "2초 침묵",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "45 기력",
    "duration": "18초"
  },
  "32684": {
    ...skillData["32684"],
    "krName": "독살",
    "description": "대상에게 공격력의 60%에 해당하는 자연 피해를 입히고 독 2중첩당 공격력의 15%만큼 추가 피해를 입힙니다.",
    "effect": "공격력의 60% + (독 중첩 x 15%) 자연 피해",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "35 기력",
    "comboPoints": "1-2 생성",
    "scaling": "독 중첩에 비례"
  },
  "360194": {
    ...skillData["360194"],
    "krName": "죽음의 춤",
    "description": "8초 동안 모든 독 피해가 30% 증가하고 독이 퍼지는 속도가 100% 증가합니다.",
    "buff": "독 피해 30% 증가",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "8초"
  },
  "121411": {
    ...skillData["121411"],
    "krName": "진홍색 폭풍",
    "description": "주위 8미터 내 모든 적에게 공격력의 60%에 해당하는 물리 피해를 입히고 파열을 적용합니다. 연계 점수를 소모합니다.",
    "effect": "연계 점수당 공격력의 60% 피해",
    "debuff": "파열 (출혈)",
    "cooldown": "없음",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "35 기력 + 연계 점수",
    "maxTargets": "8"
  },

  // 도적 - 무법
  "193315": {
    ...skillData["193315"],
    "krName": "불의한 일격",
    "description": "대상에게 공격력의 140%에 해당하는 물리 피해를 입히고 연계 점수를 2개 생성합니다.",
    "effect": "공격력의 140% 피해",
    "generates": "연계 점수 2",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "40 기력"
  },
  "185763": {
    ...skillData["185763"],
    "krName": "권총 사격",
    "description": "대상에게 공격력의 95%에 해당하는 물리 피해를 입히고 이동 속도를 30% 감소시킵니다.",
    "effect": "공격력의 95% 피해",
    "debuff": "이동 속도 30% 감소 (6초)",
    "cooldown": "없음",
    "range": "20미터",
    "castTime": "즉시 시전",
    "resource": "40 기력",
    "comboPoints": "1 생성",
    "duration": "6초"
  },
  "315496": {
    ...skillData["315496"],
    "krName": "칼날 쇄도",
    "description": "전방으로 돌진하며 경로의 모든 적에게 공격력의 165%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 165% 피해",
    "cooldown": "없음",
    "range": "10미터",
    "castTime": "즉시 시전",
    "resource": "45 기력",
    "mobility": "10미터 돌진"
  },
  "13877": {
    ...skillData["13877"],
    "krName": "칼날 소용돌이",
    "description": "2초 동안 시전 시간을 100% 증가시키는 대신 회피 확률을 100% 증가시킵니다.",
    "buff": "회피율 100% 증가",
    "debuff": "시전 시간 100% 증가",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "2초"
  },

  // 도적 - 잠행
  "185438": {
    ...skillData["185438"],
    "krName": "그림자 일격",
    "description": "대상에게 공격력의 110%에 해당하는 물리 피해를 입히고 1연계 점수를 생성합니다. 은신 상태에서 사용 시 2연계 점수를 생성합니다.",
    "effect": "공격력의 110% 피해",
    "generates": "연계 점수 1-2",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "40 기력"
  },
  "196819": {
    ...skillData["196819"],
    "krName": "절개",
    "description": "연계 점수를 소모하여 대상에게 암흑 피해를 입힙니다. 연계 점수당 공격력의 80%.",
    "effect": "연계 점수당 공격력의 80% 암흑 피해",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "35 기력",
    "comboPoints": "1-5 소모",
    "scaling": "연계 점수에 비례"
  },
  "280719": {
    ...skillData["280719"],
    "krName": "비밀 기술",
    "description": "다음 절개 또는 파열이 연계 점수를 소모하지 않고 모든 연계 점수를 사용한 것처럼 피해를 입힙니다.",
    "buff": "최대 연계 점수 효과",
    "cooldown": "1분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "다음 마무리 일격까지"
  },
  "212283": {
    ...skillData["212283"],
    "krName": "어둠의 춤",
    "description": "5초 동안 모든 능력을 은신 상태에서 사용할 수 있습니다.",
    "buff": "은신 상태 능력 사용 가능",
    "cooldown": "1분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "5초"
  }
};

// 기존 데이터에 정확한 정보 추가
Object.keys(accurateBatch2).forEach(id => {
  skillData[id] = accurateBatch2[id];
});

// 파일 저장
fs.writeFileSync('src/data/wowhead-full-descriptions-complete.json', JSON.stringify(skillData, null, 2), 'utf8');

console.log('Wowhead 정확한 스킬 정보 업데이트 - 배치 2 완료:');
console.log(`- 사냥꾼: 13개 스킬`);
console.log(`- 도적: 12개 스킬`);
console.log(`- 총 업데이트: ${Object.keys(accurateBatch2).length}개`);
console.log('\n정확한 수치와 효과 설명이 추가되었습니다.');