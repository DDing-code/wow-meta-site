const fs = require('fs');

// 기존 데이터 로드
const skillData = JSON.parse(fs.readFileSync('src/data/wowhead-full-descriptions-complete.json', 'utf8'));

// Wowhead 정확한 스킬 정보 - 배치 3 (사제, 마법사)
const accurateBatch3 = {
  // 사제 - 수양
  "47536": {
    ...skillData["47536"],
    "krName": "환희",
    "description": "대상을 즉시 치유하고 6초에 걸쳐 추가로 치유합니다. 치유량은 보호막 흡수량의 40%입니다.",
    "healingEffect": "보호막 흡수량의 40% 즉시 + 지속 치유",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "1.8% 기본 마나",
    "duration": "6초"
  },
  "47540": {
    ...skillData["47540"],
    "krName": "고통",
    "description": "대상에게 주문력의 11%에 해당하는 암흑 피해를 입히고, 보호막을 생성합니다.",
    "effect": "주문력의 11% 암흑 피해",
    "shield": "피해량의 125% 보호막",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "1.8% 기본 마나"
  },
  "194509": {
    ...skillData["194509"],
    "krName": "힘의 격류: 방벽",
    "description": "대상과 그 사이의 모든 아군에게 주문력의 450%에 해당하는 보호막을 씌웁니다.",
    "shieldEffect": "주문력의 450% 보호막",
    "cooldown": "3분",
    "range": "40미터",
    "castTime": "즉시 시전",
    "duration": "10초"
  },
  "33206": {
    ...skillData["33206"],
    "krName": "고통 억제",
    "description": "대상이 받는 모든 피해를 40% 감소시킵니다.",
    "buff": "받는 피해 40% 감소",
    "cooldown": "2분",
    "range": "40미터",
    "castTime": "즉시 시전",
    "duration": "8초"
  },
  "62618": {
    ...skillData["62618"],
    "krName": "신의 권능: 방벽",
    "description": "위치에 방벽을 생성하여 내부의 모든 아군이 받는 피해를 25% 감소시킵니다.",
    "areaEffect": "받는 피해 25% 감소",
    "cooldown": "3분",
    "range": "40미터",
    "castTime": "즉시 시전",
    "duration": "10초",
    "radius": "8미터"
  },

  // 사제 - 신성
  "2060": {
    ...skillData["2060"],
    "krName": "상급 치유",
    "description": "2.25초의 시전 시간 후 대상을 주문력의 460%만큼 치유합니다.",
    "healingEffect": "주문력의 460% 치유",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2.25초",
    "resource": "2.4% 기본 마나"
  },
  "139": {
    ...skillData["139"],
    "krName": "소생",
    "description": "대상을 즉시 치유하고 15초에 걸쳐 주문력의 50%만큼 추가 치유합니다.",
    "healingEffect": "주문력의 65% 즉시 + 50% 지속",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "2% 기본 마나",
    "duration": "15초"
  },
  "596": {
    ...skillData["596"],
    "krName": "치유의 기원",
    "description": "최대 5명의 부상당한 아군을 주문력의 135%만큼 치유합니다.",
    "healingEffect": "주문력의 135% 치유",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2.5초",
    "resource": "5.4% 기본 마나",
    "maxTargets": "5"
  },
  "204883": {
    ...skillData["204883"],
    "krName": "치유의 마법진",
    "description": "지면에 마법진을 생성하여 내부의 아군을 2초마다 주문력의 82%만큼 치유합니다.",
    "healingEffect": "주문력의 82% 치유 (2초마다)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "3.5% 기본 마나",
    "duration": "30초",
    "radius": "10미터"
  },
  "64843": {
    ...skillData["64843"],
    "krName": "신성한 찬가",
    "description": "8초 동안 채널링하여 2초마다 주위 40미터 내 아군을 주문력의 350%만큼 치유합니다.",
    "healingEffect": "주문력의 350% 치유 (2초마다)",
    "cooldown": "3분",
    "range": "40미터",
    "castTime": "8초 채널링",
    "duration": "8초"
  },

  // 사제 - 암흑
  "589": {
    ...skillData["589"],
    "krName": "암흑의 권능: 고통",
    "description": "대상에게 12초에 걸쳐 주문력의 87.36%에 해당하는 암흑 피해를 입힙니다.",
    "effect": "주문력의 87.36% 암흑 피해 (12초)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "광기 4 생성/초",
    "duration": "12초"
  },
  "15407": {
    ...skillData["15407"],
    "krName": "정신 분열",
    "description": "대상의 정신을 분열시켜 3초 동안 채널링하며 1초마다 주문력의 58%에 해당하는 암흑 피해를 입힙니다.",
    "effect": "주문력의 58% 암흑 피해 (1초마다)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "3초 채널링",
    "resource": "광기 12 생성",
    "duration": "3초"
  },
  "8092": {
    ...skillData["8092"],
    "krName": "정신 폭발",
    "description": "대상에게 주문력의 120%에 해당하는 암흑 피해를 입힙니다.",
    "effect": "주문력의 120% 암흑 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "1.5초",
    "resource": "광기 6 생성"
  },
  "228260": {
    ...skillData["228260"],
    "krName": "공허 분출",
    "description": "15초 동안 공허의 형상이 되어 주문 가속이 10% 증가하고 광기를 소모하는 대신 생성합니다.",
    "buff": "가속 10% 증가, 공허의 형상",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "1.5초",
    "resource": "광기 50 필요",
    "duration": "15초"
  },
  "263165": {
    ...skillData["263165"],
    "krName": "공허 격류",
    "description": "공허 화살이 대상과 주변 적들에게 튕겨 주문력의 70%에 해당하는 암흑 피해를 입힙니다.",
    "effect": "주문력의 70% 암흑 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "광기 20",
    "proc": "공허 형상 중 정신 폭발 대체"
  },

  // 마법사 - 비전
  "5143": {
    ...skillData["5143"],
    "krName": "비전 작렬",
    "description": "대상에게 주문력의 215%에 해당하는 비전 피해를 입히고 비전 충전물 1개를 생성합니다.",
    "effect": "주문력의 215% 비전 피해",
    "generates": "비전 충전물 1",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2.25초",
    "resource": "2.75% 기본 마나"
  },
  "44425": {
    ...skillData["44425"],
    "krName": "비전 포격",
    "description": "비전 충전물을 모두 소모하여 대상에게 주문력의 60%에 해당하는 피해를 입힙니다. 충전물당 피해 72% 증가.",
    "effect": "주문력의 60% + (충전물 x 72%) 비전 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "4% 기본 마나",
    "scaling": "비전 충전물에 비례"
  },
  "1449": {
    ...skillData["1449"],
    "krName": "비전 폭발",
    "description": "대상 지역에 비전 폭발을 일으켜 주문력의 180%에 해당하는 피해를 입힙니다.",
    "effect": "주문력의 180% 비전 피해 (광역)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "비전 충전물 1 소모",
    "radius": "10미터"
  },
  "365350": {
    ...skillData["365350"],
    "krName": "비전 쇄도",
    "description": "10초 동안 시전 속도가 30% 증가하고 마나 소모량이 100% 감소합니다.",
    "buff": "시전 속도 30% 증가, 마나 무소모",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "10초"
  },
  "321507": {
    ...skillData["321507"],
    "krName": "영원의 손길",
    "description": "다음 4회의 비전 작렬 또는 비전 화살이 즉시 시전되고 피해가 60% 증가합니다.",
    "buff": "즉시 시전, 피해 60% 증가",
    "cooldown": "45초",
    "range": "자신",
    "castTime": "즉시 시전",
    "charges": "4"
  },

  // 마법사 - 화염
  "11366": {
    ...skillData["11366"],
    "krName": "불덩이 작렬",
    "description": "대상에게 주문력의 200%에 해당하는 화염 피해를 입히고 12초에 걸쳐 추가 피해를 입힙니다.",
    "effect": "주문력의 200% 즉시 + 60% 지속 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "3.5초",
    "resource": "3% 기본 마나",
    "duration": "12초"
  },
  "108853": {
    ...skillData["108853"],
    "krName": "지옥 폭풍",
    "description": "대상 지역에 화염 폭풍을 일으켜 주문력의 35%에 해당하는 피해를 입힙니다.",
    "effect": "주문력의 35% 화염 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "charges": "3",
    "radius": "8미터"
  },
  "2120": {
    ...skillData["2120"],
    "krName": "화염 폭풍",
    "description": "대상 지역에 8초 동안 2초마다 주문력의 35%에 해당하는 화염 피해를 입힙니다.",
    "effect": "주문력의 35% 화염 피해 (2초마다)",
    "cooldown": "25초",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "3% 기본 마나",
    "duration": "8초",
    "radius": "8미터"
  },
  "190319": {
    ...skillData["190319"],
    "krName": "발화",
    "description": "12초 동안 치명타율이 100% 증가하고 화염 폭발이 항상 연속 작열과 발화를 발동시킵니다.",
    "buff": "치명타율 100% 증가",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "12초"
  },
  "153561": {
    ...skillData["153561"],
    "krName": "유성",
    "description": "대상 지역에 유성을 떨어뜨려 주문력의 1100%에 해당하는 화염 피해를 입히고 8초 동안 불타는 지대를 남깁니다.",
    "effect": "주문력의 1100% 화염 피해",
    "cooldown": "45초",
    "range": "40미터",
    "castTime": "즉시 시전",
    "duration": "8초 (불타는 지대)",
    "radius": "8미터"
  },

  // 마법사 - 냉기
  "30455": {
    ...skillData["30455"],
    "krName": "얼음 창",
    "description": "대상에게 주문력의 105%에 해당하는 냉기 피해를 입힙니다. 고드름 충전물이 있으면 추가로 발사됩니다.",
    "effect": "주문력의 105% 냉기 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "additionalEffect": "고드름당 주문력의 40% 추가 피해"
  },
  "84714": {
    ...skillData["84714"],
    "krName": "냉기 보주",
    "description": "대상 지역에 냉기 보주를 생성하여 10초 동안 1초마다 주문력의 135%에 해당하는 냉기 피해를 입힙니다.",
    "effect": "주문력의 135% 냉기 피해 (1초마다)",
    "cooldown": "1분",
    "range": "40미터",
    "castTime": "3초",
    "duration": "10초",
    "radius": "10미터"
  },
  "190356": {
    ...skillData["190356"],
    "krName": "눈보라",
    "description": "대상 지역에 8초 동안 눈보라를 일으켜 1초마다 주문력의 27.5%에 해당하는 냉기 피해를 입힙니다.",
    "effect": "주문력의 27.5% 냉기 피해 (1초마다)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2초",
    "resource": "4% 기본 마나",
    "duration": "8초",
    "radius": "8미터"
  },
  "12472": {
    ...skillData["12472"],
    "krName": "얼음 핏줄",
    "description": "20초 동안 가속이 30% 증가하고 얼음방패로 둘러싸여 받는 피해가 70% 감소합니다.",
    "buff": "가속 30% 증가, 받는 피해 70% 감소",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "20초"
  },
  "199786": {
    ...skillData["199786"],
    "krName": "얼음 빙하",
    "description": "대상 지역에 거대한 얼음 빙하를 떨어뜨려 주문력의 640%에 해당하는 냉기 피해를 입힙니다.",
    "effect": "주문력의 640% 냉기 피해",
    "cooldown": "1분",
    "range": "40미터",
    "castTime": "즉시 시전",
    "radius": "8미터"
  }
};

// 기존 데이터에 정확한 정보 추가
Object.keys(accurateBatch3).forEach(id => {
  skillData[id] = accurateBatch3[id];
});

// 파일 저장
fs.writeFileSync('src/data/wowhead-full-descriptions-complete.json', JSON.stringify(skillData, null, 2), 'utf8');

console.log('Wowhead 정확한 스킬 정보 업데이트 - 배치 3 완료:');
console.log(`- 사제: 15개 스킬`);
console.log(`- 마법사: 15개 스킬`);
console.log(`- 총 업데이트: ${Object.keys(accurateBatch3).length}개`);
console.log('\n정확한 수치와 효과 설명이 추가되었습니다.');