/**
 * 모든 스킬 설명을 병합하고 추가 설명을 생성하는 스크립트
 */

const fs = require('fs');
const path = require('path');

// 추가할 도적 스킬들
const rogueSkills = {
  "1856": {
    "id": "1856",
    "krName": "소멸",
    "description": "즉시\n2분 재사용 대기시간\n도적 필요\n\n10초 동안 은신 상태가 되어 탐지되지 않습니다.\n\n공격하거나 행동을 취하면 은신이 해제됩니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "2분",
    "resource": ""
  },
  "1766": {
    "id": "1766",
    "krName": "발차기",
    "description": "근접 사정거리\n즉시\n15초 재사용 대기시간\n도적 필요\n\n적의 시전을 방해하고 3초 동안 같은 계열의 주문을 시전할 수 없게 합니다.",
    "range": "근접",
    "castTime": "즉시",
    "cooldown": "15초",
    "resource": ""
  },
  "2098": {
    "id": "2098",
    "krName": "절개",
    "description": "근접 사정거리\n즉시\n40의 기력\n도적 필요\n\n대상에게 [전투력의 240%]의 물리 피해를 입히고 2의 연계 점수를 생성합니다.",
    "range": "근접",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "40의 기력"
  },
  "5277": {
    "id": "5277",
    "krName": "회피",
    "description": "즉시\n2분 재사용 대기시간\n도적 필요\n\n10초 동안 회피율이 100% 증가합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "2분",
    "resource": ""
  },
  "31224": {
    "id": "31224",
    "krName": "그림자 망토",
    "description": "즉시\n2분 재사용 대기시간\n도적 필요\n\n5초 동안 모든 마법 피해를 피하고 해로운 주문 효과를 제거합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "2분",
    "resource": ""
  }
};

// 추가할 사제 스킬들
const priestSkills = {
  "589": {
    "id": "589",
    "krName": "어둠의 권능: 고통",
    "description": "40 미터 사정거리\n즉시\n사제 필요\n\n18초에 걸쳐 [주문력의 165%]의 암흑 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "139": {
    "id": "139",
    "krName": "소생",
    "description": "40 미터 사정거리\n즉시\n사제 필요\n\n15초에 걸쳐 [주문력의 210%]의 생명력을 회복시킵니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "17": {
    "id": "17",
    "krName": "신의 권능: 보호막",
    "description": "40 미터 사정거리\n즉시\n6초 재사용 대기시간\n사제 필요\n\n대상을 보호막으로 감싸 [주문력의 550%]의 피해를 흡수합니다.\n\n15초 동안 지속됩니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "6초",
    "resource": "마나 소모"
  },
  "2061": {
    "id": "2061",
    "krName": "순간 치유",
    "description": "40 미터 사정거리\n1.5초 시전 시간\n사제 필요\n\n빠른 치유 주문으로 [주문력의 475%]의 생명력을 회복시킵니다.",
    "range": "40 미터",
    "castTime": "1.5초",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "8092": {
    "id": "8092",
    "krName": "정신 분열",
    "description": "40 미터 사정거리\n1.5초 시전 시간\n사제 필요\n\n대상의 정신을 공격하여 [주문력의 260%]의 암흑 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "1.5초",
    "cooldown": "",
    "resource": "마나 소모"
  }
};

// 추가할 마법사 스킬들
const mageSkills = {
  "116": {
    "id": "116",
    "krName": "서리 화살",
    "description": "40 미터 사정거리\n2초 시전 시간\n마법사 필요\n\n대상에게 [주문력의 220%]의 냉기 피해를 입히고 8초 동안 이동 속도를 50% 감소시킵니다.",
    "range": "40 미터",
    "castTime": "2초",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "133": {
    "id": "133",
    "krName": "화염구",
    "description": "40 미터 사정거리\n2.25초 시전 시간\n마법사 필요\n\n화염구를 던져 [주문력의 290%]의 화염 피해를 입히고 9초에 걸쳐 추가 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "2.25초",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "30451": {
    "id": "30451",
    "krName": "비전 작렬",
    "description": "40 미터 사정거리\n2.5초 시전 시간\n마법사 필요\n\n비전 충전물 4개 소모\n\n대상에게 [주문력의 450%]의 비전 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "2.5초",
    "cooldown": "",
    "resource": "마나 대량 소모"
  },
  "12472": {
    "id": "12472",
    "krName": "얼음 핏줄",
    "description": "즉시\n3분 재사용 대기시간\n마법사 필요\n\n12초 동안 가속이 30% 증가하고 주문 밀어내기에 면역이 됩니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "3분",
    "resource": ""
  },
  "190319": {
    "id": "190319",
    "krName": "발화",
    "description": "즉시\n2분 재사용 대기시간\n마법사 필요\n화염 전문화 필요\n\n10초 동안 치명타 확률이 100% 증가하고 작열 효과가 극대화됩니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "2분",
    "resource": ""
  }
};

// 추가할 흑마법사 스킬들
const warlockSkills = {
  "172": {
    "id": "172",
    "krName": "부패",
    "description": "40 미터 사정거리\n즉시\n흑마법사 필요\n\n14초에 걸쳐 [주문력의 180%]의 암흑 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "348": {
    "id": "348",
    "krName": "제물",
    "description": "40 미터 사정거리\n즉시\n흑마법사 필요\n\n대상을 불태워 즉시 [주문력의 60%]의 화염 피해를 입히고 18초에 걸쳐 추가 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "686": {
    "id": "686",
    "krName": "암흑 화살",
    "description": "40 미터 사정거리\n1.5초 시전 시간\n흑마법사 필요\n\n대상에게 [주문력의 200%]의 암흑 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "1.5초",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "29722": {
    "id": "29722",
    "krName": "소각",
    "description": "40 미터 사정거리\n2초 시전 시간\n흑마법사 필요\n파괴 전문화 필요\n\n대상을 소각하여 [주문력의 330%]의 화염 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "2초",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "30283": {
    "id": "30283",
    "krName": "어둠의 격노",
    "description": "40 미터 사정거리\n3초 정신집중\n흑마법사 필요\n\n3초에 걸쳐 [주문력의 540%]의 암흑 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "3초 정신집중",
    "cooldown": "",
    "resource": "마나 지속 소모"
  }
};

// 추가할 주술사 스킬들
const shamanSkills = {
  "51505": {
    "id": "51505",
    "krName": "용암 폭발",
    "description": "40 미터 사정거리\n2초 시전 시간\n주술사 필요\n\n대상에게 [주문력의 250%]의 화염 피해를 입힙니다.\n\n화염 충격 지속 중이면 즉시 시전됩니다.",
    "range": "40 미터",
    "castTime": "2초",
    "cooldown": "",
    "resource": "소용돌이 소모"
  },
  "188196": {
    "id": "188196",
    "krName": "번개 화살",
    "description": "40 미터 사정거리\n2초 시전 시간\n주술사 필요\n\n대상에게 [주문력의 210%]의 자연 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "2초",
    "cooldown": "",
    "resource": "소용돌이 생성"
  },
  "8042": {
    "id": "8042",
    "krName": "대지 충격",
    "description": "40 미터 사정거리\n즉시\n6초 재사용 대기시간\n주술사 필요\n\n대상에게 [주문력의 270%]의 자연 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "6초",
    "resource": "소용돌이 소모"
  },
  "8004": {
    "id": "8004",
    "krName": "치유의 파도",
    "description": "40 미터 사정거리\n1.5초 시전 시간\n주술사 필요\n\n대상의 생명력을 [주문력의 480%] 회복시킵니다.",
    "range": "40 미터",
    "castTime": "1.5초",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "77472": {
    "id": "77472",
    "krName": "치유의 물결",
    "description": "40 미터 사정거리\n2.5초 시전 시간\n주술사 필요\n\n느리지만 강력한 치유로 [주문력의 680%]의 생명력을 회복시킵니다.",
    "range": "40 미터",
    "castTime": "2.5초",
    "cooldown": "",
    "resource": "마나 소모"
  }
};

// 추가할 수도사 스킬들
const monkSkills = {
  "100780": {
    "id": "100780",
    "krName": "호랑이 장풍",
    "description": "근접 사정거리\n즉시\n수도사 필요\n\n대상에게 [전투력의 63%]의 물리 피해를 입힙니다.",
    "range": "근접",
    "castTime": "즉시",
    "cooldown": "",
    "resource": ""
  },
  "100784": {
    "id": "100784",
    "krName": "흑우 발차기",
    "description": "근접 사정거리\n즉시\n수도사 필요\n\n대상에게 [전투력의 185%]의 물리 피해를 입히고 1의 기 생성합니다.",
    "range": "근접",
    "castTime": "즉시",
    "cooldown": "4초",
    "resource": "1의 기 생성"
  },
  "107428": {
    "id": "107428",
    "krName": "일어서는 태양 발차기",
    "description": "근접 사정거리\n즉시\n2의 기\n수도사 필요\n\n회전 발차기로 주위 모든 적에게 [전투력의 290%]의 물리 피해를 입힙니다.",
    "range": "근접",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "2의 기"
  },
  "116670": {
    "id": "116670",
    "krName": "생기 충전",
    "description": "40 미터 사정거리\n2.5초 시전 시간\n수도사 필요\n운무 전문화 필요\n\n대상의 생명력을 [주문력의 420%] 회복시킵니다.",
    "range": "40 미터",
    "castTime": "2.5초",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "115178": {
    "id": "115178",
    "krName": "소생의 안개",
    "description": "정신집중\n수도사 필요\n운무 전문화 필요\n\n주위 아군을 지속적으로 치유합니다. 정신을 집중하는 동안 매초 마나를 소모합니다.",
    "range": "",
    "castTime": "정신집중",
    "cooldown": "",
    "resource": "마나 지속 소모"
  }
};

// 기존 파일들 로드
const basePath = path.join(__dirname, '..', 'src', 'data');
const fullDescriptions = JSON.parse(fs.readFileSync(path.join(basePath, 'wowhead-full-descriptions.json'), 'utf8'));
const extendedDescriptions = JSON.parse(fs.readFileSync(path.join(basePath, 'wowhead-full-descriptions-extended.json'), 'utf8'));

// 모든 설명 병합
const allDescriptions = {
  ...fullDescriptions,
  ...extendedDescriptions,
  ...rogueSkills,
  ...priestSkills,
  ...mageSkills,
  ...warlockSkills,
  ...shamanSkills,
  ...monkSkills
};

// 정렬
const sortedDescriptions = {};
Object.keys(allDescriptions).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
  sortedDescriptions[key] = allDescriptions[key];
});

// 파일 저장
fs.writeFileSync(
  path.join(basePath, 'wowhead-full-descriptions-complete.json'),
  JSON.stringify(sortedDescriptions, null, 2),
  'utf8'
);

console.log(`✅ 총 ${Object.keys(sortedDescriptions).length}개의 스킬 설명이 병합되었습니다.`);
console.log(`📁 저장 위치: src/data/wowhead-full-descriptions-complete.json`);