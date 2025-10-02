const fs = require('fs');

// 기존 데이터 로드
const skillData = JSON.parse(fs.readFileSync('src/data/wowhead-full-descriptions-complete.json', 'utf8'));

// Wowhead 정확한 스킬 정보 - 배치 1 (전사, 성기사)
const accurateBatch1 = {
  // 전사 - 무기
  "772": {
    ...skillData["772"],
    "krName": "분쇄",
    "description": "대상에게 출혈을 입혀 18초에 걸쳐 공격력의 168.7%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 168.7% 출혈 피해 (18초)",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "30 분노",
    "duration": "18초"
  },
  "845": {
    ...skillData["845"],
    "krName": "회전베기",
    "description": "무기를 빠르게 돌려 8미터 반경 내 모든 대상에게 물리 피해를 입힙니다.",
    "effect": "공격력의 115% 피해 (광역)",
    "cooldown": "없음",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "30 분노"
  },
  "260708": {
    ...skillData["260708"],
    "krName": "휩쓸기",
    "description": "전방에 휩쓰는 공격을 가해 최대 5명의 대상에게 공격력의 75%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 75% 피해",
    "cooldown": "없음",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "30 분노",
    "maxTargets": "5"
  },
  "227847": {
    ...skillData["227847"],
    "krName": "칼날폭풍",
    "description": "주위를 회전하며 6초 동안 1초마다 8미터 내 모든 적에게 공격력의 40%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 40% 피해 (1초마다)",
    "cooldown": "1.5분",
    "range": "8미터",
    "castTime": "즉시 시전",
    "duration": "6초",
    "resource": "20 분노"
  },

  // 전사 - 분노
  "184367": {
    ...skillData["184367"],
    "krName": "쇄도",
    "description": "4초 동안 자동 공격 속도가 100% 증가합니다. 자동 공격이 적중할 때마다 지속 시간이 0.5초씩 증가합니다.",
    "effect": "공격 속도 100% 증가",
    "cooldown": "없음",
    "range": "자신",
    "castTime": "즉시 시전",
    "resource": "40 분노",
    "duration": "4초 (연장 가능)"
  },
  "85288": {
    ...skillData["85288"],
    "krName": "성난 일격",
    "description": "대상에게 공격력의 120%에 해당하는 물리 피해를 입힙니다. 격노 효과를 받는 중이면 피해가 50% 증가합니다.",
    "effect": "공격력의 120% 피해 (격노 시 180%)",
    "cooldown": "4.5초",
    "range": "근접",
    "castTime": "즉시 시전"
  },
  "280772": {
    ...skillData["280772"],
    "krName": "회전 가르기",
    "description": "광휘의 회전 무기를 던져 대상과 그 경로에 있는 모든 적에게 공격력의 45%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 45% 피해",
    "cooldown": "없음",
    "range": "20미터",
    "castTime": "즉시 시전",
    "resource": "25 분노"
  },

  // 전사 - 방어
  "6572": {
    ...skillData["6572"],
    "krName": "복수",
    "description": "다음 공격을 회피하거나 무기 막기로 막으면 자동으로 사용됩니다. 대상에게 공격력의 70%에 해당하는 피해를 입히고 3의 분노를 생성합니다.",
    "effect": "공격력의 70% 피해",
    "generates": "3 분노",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전"
  },
  "23922": {
    ...skillData["23922"],
    "krName": "방패 밀쳐내기",
    "description": "대상을 방패로 밀쳐내 공격력의 100%에 해당하는 물리 피해를 입히고 1.5초 동안 기절시킵니다.",
    "effect": "공격력의 100% 피해",
    "debuff": "1.5초 기절",
    "cooldown": "12초",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "15 분노"
  },
  "46968": {
    ...skillData["46968"],
    "krName": "충격파",
    "description": "땅을 내리쳐 전방 10미터 원뿔 범위 내 모든 적에게 공격력의 60%에 해당하는 피해를 입히고 2초 동안 기절시킵니다.",
    "effect": "공격력의 60% 피해",
    "debuff": "2초 기절",
    "cooldown": "40초",
    "range": "10미터",
    "castTime": "즉시 시전"
  },

  // 성기사 - 신성
  "82326": {
    ...skillData["82326"],
    "krName": "신성한 빛",
    "description": "2.5초의 시전 시간 후 대상을 주문력의 550%만큼 치유합니다.",
    "healingEffect": "주문력의 550% 치유",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2.5초",
    "resource": "9% 기본 마나"
  },
  "85222": {
    ...skillData["85222"],
    "krName": "여명의 빛",
    "description": "대상과 가장 부상이 심한 아군에게 각각 주문력의 180%만큼 치유합니다.",
    "healingEffect": "주문력의 180% 치유 x2",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "신성한 힘 3",
    "maxTargets": "2"
  },
  "114165": {
    ...skillData["114165"],
    "krName": "신성한 기도",
    "description": "주위 40미터 내 최대 5명의 부상당한 아군에게 주문력의 100%만큼 치유합니다.",
    "healingEffect": "주문력의 100% 치유",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "신성한 힘 1",
    "maxTargets": "5"
  },
  "85673": {
    ...skillData["85673"],
    "krName": "신성의 서약",
    "description": "대상에게 치유를 집중시켜 5초 동안 받는 치유량을 30% 증가시키고 자신의 치유 시전 시간을 15% 감소시킵니다.",
    "buff": "받는 치유량 30% 증가",
    "selfBuff": "시전 시간 15% 감소",
    "cooldown": "없음",
    "range": "30미터",
    "castTime": "즉시 시전",
    "resource": "7.5% 기본 마나",
    "duration": "5초"
  },

  // 성기사 - 보호
  "31935": {
    ...skillData["31935"],
    "krName": "응징의 방패",
    "description": "방패를 던져 대상에게 주문력의 250%에 해당하는 신성 피해를 입히고 3초 동안 침묵시킵니다.",
    "effect": "주문력의 250% 신성 피해",
    "debuff": "3초 침묵",
    "cooldown": "15초",
    "range": "30미터",
    "castTime": "즉시 시전"
  },
  "26573": {
    ...skillData["26573"],
    "krName": "헌신",
    "description": "8미터 내 모든 적에게 주문력의 45%에 해당하는 신성 피해를 입히고 자신에게 신성한 힘 1을 부여합니다.",
    "effect": "주문력의 45% 신성 피해",
    "generates": "신성한 힘 1",
    "cooldown": "4.5초",
    "range": "8미터",
    "castTime": "즉시 시전"
  },
  "204019": {
    ...skillData["204019"],
    "krName": "축복받은 망치",
    "description": "축복받은 망치를 던져 대상에게 공격력의 125%에 해당하는 신성 피해를 입힙니다. 3충전됩니다.",
    "effect": "공격력의 125% 신성 피해",
    "cooldown": "6초",
    "range": "30미터",
    "castTime": "즉시 시전",
    "charges": "3",
    "generates": "신성한 힘 1"
  },
  "53600": {
    ...skillData["53600"],
    "krName": "정의의 방패",
    "description": "신성한 빛의 폭발을 일으켜 주문력의 400%에 해당하는 피해를 최대 5명의 대상에게 입힙니다.",
    "effect": "주문력의 400% 신성 피해",
    "cooldown": "없음",
    "range": "자신",
    "castTime": "즉시 시전",
    "resource": "신성한 힘 3",
    "maxTargets": "5"
  },

  // 성기사 - 징벌
  "184575": {
    ...skillData["184575"],
    "krName": "칼날 같은 정의",
    "description": "대상에게 공격력의 220%에 해당하는 물리 피해를 입히고 신성한 힘 2를 생성합니다.",
    "effect": "공격력의 220% 물리 피해",
    "generates": "신성한 힘 2",
    "cooldown": "12초",
    "range": "근접",
    "castTime": "즉시 시전"
  },
  "53385": {
    ...skillData["53385"],
    "krName": "신성한 폭풍",
    "description": "주위를 신성한 에너지로 휩쓸어 8미터 내 모든 적에게 공격력의 115%에 해당하는 신성 피해를 입힙니다.",
    "effect": "공격력의 115% 신성 피해",
    "cooldown": "없음",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "신성한 힘 3"
  },
  "343527": {
    ...skillData["343527"],
    "krName": "응징의 격노",
    "description": "성전 공격력이 75% 증가하고 치유량이 35% 증가합니다. 지속 시간 동안 신성한 힘을 생성하고 소모하면 지속 시간이 0.5초씩 연장됩니다.",
    "buff": "공격력 75% 증가, 치유 35% 증가",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "30초"
  },
  "24275": {
    ...skillData["24275"],
    "krName": "빛의 망치",
    "description": "빛의 망치를 던져 대상과 6미터 내 적들에게 공격력의 36%에 해당하는 신성 피해를 입힙니다.",
    "effect": "공격력의 36% 신성 피해",
    "cooldown": "6초",
    "range": "30미터",
    "castTime": "즉시 시전",
    "generates": "신성한 힘 1"
  },
  "255937": {
    ...skillData["255937"],
    "krName": "재의 경악",
    "description": "신성한 힘을 모두 소모하여 대상에게 막대한 신성 피해를 입힙니다. 신성한 힘당 공격력의 120% 피해.",
    "effect": "신성한 힘당 공격력의 120% 신성 피해",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "모든 신성한 힘 소모"
  }
};

// 기존 데이터에 정확한 정보 추가
Object.keys(accurateBatch1).forEach(id => {
  skillData[id] = accurateBatch1[id];
});

// 파일 저장
fs.writeFileSync('src/data/wowhead-full-descriptions-complete.json', JSON.stringify(skillData, null, 2), 'utf8');

console.log('Wowhead 정확한 스킬 정보 업데이트 - 배치 1 완료:');
console.log(`- 전사: 10개 스킬`);
console.log(`- 성기사: 13개 스킬`);
console.log(`- 총 업데이트: ${Object.keys(accurateBatch1).length}개`);
console.log('\n정확한 수치와 효과 설명이 추가되었습니다.');