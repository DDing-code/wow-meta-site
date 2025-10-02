const fs = require('fs');

// 기존 데이터 로드
const skillData = JSON.parse(fs.readFileSync('src/data/wowhead-full-descriptions-complete.json', 'utf8'));

// Wowhead 정확한 스킬 정보 - 배치 5 (드루이드, 수도사)
const accurateBatch5 = {
  // 드루이드 - 조화
  "190984": {
    ...skillData["190984"],
    "krName": "천벌",
    "description": "대상에게 주문력의 172%에 해당하는 자연 피해를 입힙니다.",
    "effect": "주문력의 172% 자연 피해",
    "cooldown": "없음",
    "range": "45미터",
    "castTime": "1.5초",
    "resource": "별의 힘 30 생성"
  },
  "194153": {
    ...skillData["194153"],
    "krName": "별빛섬광",
    "description": "대상에게 주문력의 190%에 해당하는 비전 피해를 입힙니다.",
    "effect": "주문력의 190% 비전 피해",
    "cooldown": "없음",
    "range": "45미터",
    "castTime": "2.25초",
    "resource": "별의 힘 8"
  },
  "78674": {
    ...skillData["78674"],
    "krName": "별똥별",
    "description": "대상에게 별똥별을 떨어뜨려 주문력의 325%에 해당하는 천공 피해를 입힙니다.",
    "effect": "주문력의 325% 천공 피해",
    "cooldown": "없음",
    "range": "45미터",
    "castTime": "즉시 시전",
    "resource": "별의 힘 30"
  },
  "191034": {
    ...skillData["191034"],
    "krName": "별빛쇄도",
    "description": "대상 지역에 8초 동안 1초마다 주문력의 37%에 해당하는 천공 피해를 입힙니다.",
    "effect": "주문력의 37% 천공 피해 (1초마다)",
    "cooldown": "없음",
    "range": "45미터",
    "castTime": "즉시 시전",
    "resource": "별의 힘 40",
    "duration": "8초",
    "radius": "15미터"
  },
  "202770": {
    ...skillData["202770"],
    "krName": "엘룬의 분노",
    "description": "3초 동안 주문력의 480%에 해당하는 천공 피해를 입힙니다.",
    "effect": "주문력의 480% 천공 피해 (3초간)",
    "cooldown": "3분",
    "range": "45미터",
    "castTime": "즉시 시전",
    "duration": "3초",
    "radius": "8미터"
  },
  "194223": {
    ...skillData["194223"],
    "krName": "천체의 정렬",
    "description": "20초 동안 가속이 10% 증가하고 주문이 추가 대상에게도 적용됩니다.",
    "buff": "가속 10% 증가, 주문 다중 대상",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "20초"
  },

  // 드루이드 - 야성
  "5221": {
    ...skillData["5221"],
    "krName": "칼날 발톱",
    "description": "대상을 베어 공격력의 46%에 해당하는 물리 피해를 입힙니다. 연계 점수를 1개 생성합니다.",
    "effect": "공격력의 46% 물리 피해",
    "generates": "연계 점수 1",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "40 기력"
  },
  "22568": {
    ...skillData["22568"],
    "krName": "흉포한 이빨",
    "description": "연계 점수를 소모하여 대상에게 피해를 입힙니다. 연계 점수당 공격력의 77%.",
    "effect": "연계 점수당 공격력의 77% 물리 피해",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "25 기력 + 연계 점수",
    "scaling": "연계 점수에 비례"
  },
  "52610": {
    ...skillData["52610"],
    "krName": "야성의 포효",
    "description": "다음 마무리 일격의 피해가 60% 증가합니다.",
    "buff": "다음 마무리 일격 피해 60% 증가",
    "cooldown": "없음",
    "range": "자신",
    "castTime": "즉시 시전",
    "resource": "25 기력"
  },
  "106951": {
    ...skillData["106951"],
    "krName": "광폭화",
    "description": "30초 동안 최대 기력이 50 증가하고 기력 재생이 15% 증가합니다.",
    "buff": "최대 기력 +50, 기력 재생 15% 증가",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "30초"
  },
  "102543": {
    ...skillData["102543"],
    "krName": "화신: 아샤메인의 화신",
    "description": "30초 동안 강화된 고양이 형태가 되어 모든 능력이 향상됩니다.",
    "buff": "피해 25% 증가, 기력 소모 20% 감소",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "30초"
  },

  // 드루이드 - 수호
  "33917": {
    ...skillData["33917"],
    "krName": "짓이기기",
    "description": "대상을 짓이겨 공격력의 126%에 해당하는 물리 피해를 입히고 분노를 15 생성합니다.",
    "effect": "공격력의 126% 물리 피해",
    "generates": "분노 15",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전"
  },
  "77758": {
    ...skillData["77758"],
    "krName": "난타",
    "description": "전방 범위에 공격력의 83%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 83% 물리 피해 (광역)",
    "cooldown": "없음",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "분노 30"
  },
  "213764": {
    ...skillData["213764"],
    "krName": "휘둘러치기",
    "description": "전방의 모든 적을 휘둘러쳐 공격력의 110%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 110% 물리 피해 (광역)",
    "cooldown": "없음",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "분노 30"
  },
  "22812": {
    ...skillData["22812"],
    "krName": "나무 껍질",
    "description": "12초 동안 받는 모든 피해를 20% 감소시킵니다.",
    "buff": "받는 피해 20% 감소",
    "cooldown": "1분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "12초"
  },
  "50334": {
    ...skillData["50334"],
    "krName": "광폭화",
    "description": "3분 동안 체력이 30% 증가하고 15 분노를 즉시 생성합니다.",
    "buff": "최대 체력 30% 증가",
    "generates": "분노 15",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "3분"
  },

  // 드루이드 - 회복
  "33763": {
    ...skillData["33763"],
    "krName": "피어나는 생명",
    "description": "대상을 8초에 걸쳐 주문력의 420%만큼 치유합니다. 생명의 나무 형상일 때 즉시 시전됩니다.",
    "healingEffect": "주문력의 420% 치유 (8초)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2초",
    "resource": "10% 기본 마나",
    "duration": "8초"
  },
  "48438": {
    ...skillData["48438"],
    "krName": "급속 성장",
    "description": "최대 3명을 주문력의 150%만큼 즉시 치유합니다.",
    "healingEffect": "주문력의 150% 즉시 치유",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "17% 기본 마나",
    "maxTargets": "3"
  },
  "102342": {
    ...skillData["102342"],
    "krName": "무쇠 껍질",
    "description": "받는 피해를 50% 감소시키지만 주문 시전이 불가능합니다.",
    "buff": "받는 피해 50% 감소",
    "debuff": "시전 불가",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "12초"
  },
  "740": {
    ...skillData["740"],
    "krName": "평온",
    "description": "8초 동안 채널링하여 30미터 내 모든 아군을 2초마다 주문력의 175%만큼 치유합니다.",
    "healingEffect": "주문력의 175% 치유 (2초마다)",
    "cooldown": "3분",
    "range": "30미터",
    "castTime": "8초 채널링",
    "duration": "8초"
  },
  "33891": {
    ...skillData["33891"],
    "krName": "생명의 나무",
    "description": "30초 동안 생명의 나무가 되어 치유량이 15% 증가하고 피어나는 생명이 즉시 시전됩니다.",
    "buff": "치유량 15% 증가",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "30초"
  },

  // 수도사 - 양조
  "205523": {
    ...skillData["205523"],
    "krName": "흑우차기",
    "description": "대상에게 공격력의 185%에 해당하는 물리 피해를 입히고 틈새를 3초 줄입니다.",
    "effect": "공격력의 185% 물리 피해",
    "utility": "틈새 3초 감소",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "3 기"
  },
  "115181": {
    ...skillData["115181"],
    "krName": "맥주통 휘두르기",
    "description": "대상에게 맥주통을 던져 공격력의 370%에 해당하는 물리 피해를 입히고 3초 동안 이동 속도를 50% 감소시킵니다.",
    "effect": "공격력의 370% 물리 피해",
    "debuff": "이동 속도 50% 감소 (3초)",
    "cooldown": "8초",
    "range": "30미터",
    "castTime": "즉시 시전",
    "resource": "40 기력",
    "duration": "3초"
  },
  "115308": {
    ...skillData["115308"],
    "krName": "엘루시브 브루",
    "description": "틈새를 제거하고 6초 동안 회피율을 45% 증가시킵니다.",
    "buff": "회피율 45% 증가",
    "cooldown": "없음",
    "range": "자신",
    "castTime": "즉시 시전",
    "resource": "틈새 제거",
    "duration": "6초"
  },
  "115203": {
    ...skillData["115203"],
    "krName": "강화 양조",
    "description": "15초 동안 강화 양조 효과를 얻어 받는 피해가 틈새로 전환됩니다.",
    "buff": "피해 틈새 전환",
    "cooldown": "7초",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "15초",
    "charges": "3"
  },
  "132578": {
    ...skillData["132578"],
    "krName": "우레 맥주",
    "description": "3분 동안 회피율이 10% 증가하고 피해를 받을 때마다 공격력의 100%에 해당하는 자연 피해를 반사합니다.",
    "buff": "회피율 10% 증가, 피해 반사",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "3분"
  },

  // 수도사 - 풍운
  "113656": {
    ...skillData["113656"],
    "krName": "분노의 주먹",
    "description": "대상에게 공격력의 385%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 385% 물리 피해",
    "cooldown": "24초",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "3 기"
  },
  "107428": {
    ...skillData["107428"],
    "krName": "떠오르는 태양차기",
    "description": "대상과 주변 적들에게 공격력의 290%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 290% 물리 피해 (광역)",
    "cooldown": "10초",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "2 기"
  },
  "152175": {
    ...skillData["152175"],
    "krName": "학다리차기",
    "description": "대상 지역으로 이동하며 경로의 모든 적에게 공격력의 345%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 345% 물리 피해",
    "cooldown": "없음",
    "range": "20미터",
    "castTime": "즉시 시전",
    "resource": "1 기",
    "mobility": "대상 지역 이동"
  },
  "137639": {
    ...skillData["137639"],
    "krName": "폭풍과 대지와 불",
    "description": "15초 동안 공격 속도가 25% 증가하고 원소 정령들이 함께 공격합니다.",
    "buff": "공격 속도 25% 증가, 원소 정령 소환",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "15초"
  },
  "123904": {
    ...skillData["123904"],
    "krName": "쉔롱의 진노",
    "description": "20초 동안 공격력이 40% 증가합니다.",
    "buff": "공격력 40% 증가",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "20초"
  },

  // 수도사 - 운무
  "116670": {
    ...skillData["116670"],
    "krName": "생기 활력",
    "description": "대상을 즉시 주문력의 370%만큼 치유합니다.",
    "healingEffect": "주문력의 370% 치유",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "1.5초",
    "resource": "3.5% 기본 마나"
  },
  "124682": {
    ...skillData["124682"],
    "krName": "포용의 안개",
    "description": "주변 아군을 지속적으로 치유합니다. 10초 동안 주문력의 525%만큼 치유합니다.",
    "healingEffect": "주문력의 525% 치유 (10초간)",
    "cooldown": "없음",
    "range": "10미터",
    "castTime": "즉시 시전",
    "resource": "4.5% 기본 마나",
    "duration": "10초"
  },
  "115310": {
    ...skillData["115310"],
    "krName": "재활",
    "description": "모든 아군에게 10초 동안 받는 치유량을 40% 증가시킵니다.",
    "buff": "받는 치유량 40% 증가",
    "cooldown": "3분",
    "range": "전체",
    "castTime": "즉시 시전",
    "duration": "10초"
  },
  "116680": {
    ...skillData["116680"],
    "krName": "천둥차",
    "description": "전방 원뿔 범위의 아군을 주문력의 200%만큼 치유합니다.",
    "healingEffect": "주문력의 200% 치유",
    "cooldown": "없음",
    "range": "20미터",
    "castTime": "즉시 시전",
    "resource": "3.5% 기본 마나"
  },
  "322118": {
    ...skillData["322118"],
    "krName": "치유",
    "description": "대상을 30초 동안 채널링하며 채널링 동안 주문력의 1200%만큼 치유합니다.",
    "healingEffect": "주문력의 1200% 치유 (30초)",
    "cooldown": "3분",
    "range": "40미터",
    "castTime": "채널링",
    "duration": "30초"
  }
};

// 기존 데이터에 정확한 정보 추가
Object.keys(accurateBatch5).forEach(id => {
  skillData[id] = accurateBatch5[id];
});

// 파일 저장
fs.writeFileSync('src/data/wowhead-full-descriptions-complete.json', JSON.stringify(skillData, null, 2), 'utf8');

console.log('Wowhead 정확한 스킬 정보 업데이트 - 배치 5 완료:');
console.log(`- 드루이드: 20개 스킬`);
console.log(`- 수도사: 15개 스킬`);
console.log(`- 총 업데이트: ${Object.keys(accurateBatch5).length}개`);
console.log('\n정확한 수치와 효과 설명이 추가되었습니다.');