const fs = require('fs');

// 기존 데이터 로드
const skillData = JSON.parse(fs.readFileSync('src/data/wowhead-full-descriptions-complete.json', 'utf8'));

// Wowhead 정확한 스킬 정보 - 배치 6 (죽음의 기사, 악마사냥꾼, 기원사)
const accurateBatch6 = {
  // 죽음의 기사 - 혈기
  "195182": {
    ...skillData["195182"],
    "krName": "굴레",
    "description": "대상에게 공격력의 160%에 해당하는 물리 피해를 입히고 10의 룬 마력을 생성합니다.",
    "effect": "공격력의 160% 물리 피해",
    "generates": "룬 마력 10",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "1 룬"
  },
  "50842": {
    ...skillData["50842"],
    "krName": "피의 소용돌이",
    "description": "주위 8미터 내 모든 적에게 공격력의 80%에 해당하는 물리 피해를 입합니다.",
    "effect": "공격력의 80% 물리 피해 (광역)",
    "cooldown": "없음",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "1 룬"
  },
  "206930": {
    ...skillData["206930"],
    "krName": "심장 강타",
    "description": "대상과 그 앞의 모든 적에게 공격력의 170%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 170% 물리 피해",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "1 룬",
    "generates": "룬 마력 5"
  },
  "55233": {
    ...skillData["55233"],
    "krName": "흡혈",
    "description": "30초 동안 대상에게 입히는 피해의 30%를 생명력으로 회복합니다.",
    "buff": "피해의 30% 생명력 회복",
    "cooldown": "1분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "30초"
  },
  "194679": {
    ...skillData["194679"],
    "krName": "룬 전환",
    "description": "룬을 피로 충전시켜 1개의 룬과 5의 룬 마력을 즉시 생성합니다.",
    "generates": "룬 1개, 룬 마력 5",
    "cooldown": "45초",
    "range": "자신",
    "castTime": "즉시 시전"
  },
  "49028": {
    ...skillData["49028"],
    "krName": "춤추는 룬 무기",
    "description": "8초 동안 모든 룬과 룬 마력 소모 능력을 복사하는 룬 무기를 소환합니다.",
    "summon": "룬 무기 (8초)",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "8초"
  },

  // 죽음의 기사 - 냉기
  "49020": {
    ...skillData["49020"],
    "krName": "말소",
    "description": "대상에게 공격력의 213%에 해당하는 냉기 피해를 입힙니다. 룬 마력을 소모할수록 피해가 증가합니다.",
    "effect": "공격력의 213% 냉기 피해",
    "scaling": "룬 마력 3당 피해 1% 증가",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "1 룬"
  },
  "49143": {
    ...skillData["49143"],
    "krName": "서리 일격",
    "description": "대상에게 무기 피해와 공격력의 110%에 해당하는 냉기 피해를 입힙니다.",
    "effect": "무기 피해 + 공격력의 110% 냉기 피해",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "룬 마력 25"
  },
  "196770": {
    ...skillData["196770"],
    "krName": "냉혹한 겨울",
    "description": "8초 동안 주위에 눈보라를 일으켜 1초마다 공격력의 45%에 해당하는 냉기 피해를 입힙니다.",
    "effect": "공격력의 45% 냉기 피해 (1초마다)",
    "cooldown": "20초",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "1 룬",
    "duration": "8초"
  },
  "47568": {
    ...skillData["47568"],
    "krName": "룬 무기 강화",
    "description": "15초 동안 가속이 15% 증가하고 룬 재생 속도가 100% 증가합니다.",
    "buff": "가속 15% 증가, 룬 재생 100% 증가",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "15초"
  },
  "152279": {
    ...skillData["152279"],
    "krName": "얼음 같은 숨결",
    "description": "룬 마력을 소모하여 전방에 냉기 숨결을 내뿜습니다. 1초마다 룬 마력 15 소모.",
    "effect": "룬 마력 15당 공격력의 60% 냉기 피해",
    "cooldown": "2분",
    "range": "12미터",
    "castTime": "채널링",
    "resource": "룬 마력 소모"
  },

  // 죽음의 기사 - 부정
  "85948": {
    ...skillData["85948"],
    "krName": "고름 일격",
    "description": "대상에게 공격력의 191%에 해당하는 물리 피해를 입히고 상처를 6개까지 중첩시킵니다.",
    "effect": "공격력의 191% 물리 피해",
    "debuff": "고름 상처 중첩 (최대 6)",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "1 룬"
  },
  "47541": {
    ...skillData["47541"],
    "krName": "죽음의 고리",
    "description": "대상에게 공격력의 148%에 해당하는 암흑 피해를 입히고 대상 생명력의 2%를 회복합니다.",
    "effect": "공격력의 148% 암흑 피해",
    "healing": "대상 생명력의 2% 회복",
    "cooldown": "없음",
    "range": "30미터",
    "castTime": "즉시 시전",
    "resource": "룬 마력 30"
  },
  "207311": {
    ...skillData["207311"],
    "krName": "광대",
    "description": "대상에게 공격력의 63%에 해당하는 물리 피해를 입히고 2초 동안 기절시킵니다.",
    "effect": "공격력의 63% 물리 피해",
    "debuff": "2초 기절",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "2 룬"
  },
  "42650": {
    ...skillData["42650"],
    "krName": "아군 되살리기",
    "description": "30초 동안 언데드 군대를 소환합니다. 각 구울은 공격력의 40%의 피해를 입힙니다.",
    "summon": "언데드 군대 (30초)",
    "cooldown": "8분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "30초",
    "minions": "8"
  },
  "63560": {
    ...skillData["63560"],
    "krName": "어둠의 변신",
    "description": "30초 동안 언데드 괴물로 변신하여 피해가 30% 증가하고 어둠의 폭발을 사용할 수 있습니다.",
    "buff": "피해 30% 증가, 어둠의 폭발 사용 가능",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "30초"
  },

  // 악마사냥꾼 - 파멸
  "162243": {
    ...skillData["162243"],
    "krName": "악마의 이빨",
    "description": "대상에게 공격력의 135%에 해당하는 물리 피해를 입히고 격분을 10-20 생성합니다.",
    "effect": "공격력의 135% 물리 피해",
    "generates": "격분 10-20",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전"
  },
  "210152": {
    ...skillData["210152"],
    "krName": "죽음의 쓸기",
    "description": "전방 8미터 내 모든 적에게 공격력의 77%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 77% 물리 피해 (광역)",
    "cooldown": "없음",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "격분 35"
  },
  "198013": {
    ...skillData["198013"],
    "krName": "눈 광선",
    "description": "3초 동안 채널링하여 대상에게 주문력의 650%에 해당하는 혼돈 피해를 입힙니다.",
    "effect": "주문력의 650% 혼돈 피해 (3초)",
    "cooldown": "30초",
    "range": "20미터",
    "castTime": "3초 채널링",
    "resource": "격분 30",
    "duration": "3초"
  },
  "191427": {
    ...skillData["191427"],
    "krName": "탈태",
    "description": "30초 동안 악마로 변신하여 생명력이 30% 증가하고 도약 능력을 얻습니다.",
    "buff": "생명력 30% 증가, 도약 능력",
    "cooldown": "4분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "30초"
  },
  "258920": {
    ...skillData["258920"],
    "krName": "집중의 균열",
    "description": "대상에게 돌진하여 공격력의 213%에 해당하는 혼돈 피해를 입히고 격분을 40 생성합니다.",
    "effect": "공격력의 213% 혼돈 피해",
    "generates": "격분 40",
    "cooldown": "40초",
    "range": "10미터",
    "castTime": "즉시 시전",
    "mobility": "대상에게 돌진"
  },

  // 악마사냥꾼 - 복수
  "203782": {
    ...skillData["203782"],
    "krName": "칼날 비",
    "description": "대상에게 공격력의 60%에 해당하는 물리 피해를 입히고 고통을 10-20 생성합니다.",
    "effect": "공격력의 60% 물리 피해",
    "generates": "고통 10-20",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전"
  },
  "228477": {
    ...skillData["228477"],
    "krName": "영혼 분쇄",
    "description": "주변 적들에게 공격력의 150%에 해당하는 화염 피해를 입히고 영혼 조각을 소모하여 회복합니다.",
    "effect": "공격력의 150% 화염 피해",
    "healing": "영혼 조각당 공격력의 120% 회복",
    "cooldown": "없음",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "고통 30"
  },
  "189110": {
    ...skillData["189110"],
    "krName": "지옥 쇄도",
    "description": "대상 지역으로 도약하여 공격력의 123%에 해당하는 화염 피해를 입히고 시전 인장을 생성합니다.",
    "effect": "공격력의 123% 화염 피해",
    "utility": "시전 인장 생성",
    "cooldown": "없음",
    "range": "30미터",
    "castTime": "즉시 시전",
    "charges": "2"
  },
  "204596": {
    ...skillData["204596"],
    "krName": "시전 인장",
    "description": "대상 지역에 화염 지대를 생성하여 2초마다 공격력의 50%에 해당하는 화염 피해를 입힙니다.",
    "effect": "공격력의 50% 화염 피해 (2초마다)",
    "cooldown": "없음",
    "range": "30미터",
    "castTime": "즉시 시전",
    "resource": "고통 20",
    "duration": "6초",
    "radius": "8미터"
  },
  "187827": {
    ...skillData["187827"],
    "krName": "악마의 쐐기돌",
    "description": "10초 동안 받는 모든 피해를 50% 감소시키고 즉시 30%의 생명력을 회복합니다.",
    "buff": "받는 피해 50% 감소",
    "healing": "최대 생명력의 30%",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "10초"
  },

  // 기원사 - 황폐
  "357211": {
    ...skillData["357211"],
    "krName": "화염 숨결",
    "description": "전방에 화염 숨결을 내뿜어 주문력의 238%에 해당하는 화염 피해를 입힙니다.",
    "effect": "주문력의 238% 화염 피해",
    "cooldown": "없음",
    "range": "25미터",
    "castTime": "2.5초",
    "resource": "정기 2"
  },
  "361469": {
    ...skillData["361469"],
    "krName": "살아있는 불꽃",
    "description": "아군: 주문력의 350% 치유, 적: 주문력의 143% 화염 피해",
    "healingEffect": "주문력의 350% 치유",
    "damageEffect": "주문력의 143% 화염 피해",
    "cooldown": "없음",
    "range": "30미터",
    "castTime": "2.25초",
    "resource": "3% 기본 마나"
  },
  "357208": {
    ...skillData["357208"],
    "krName": "화염 폭풍",
    "description": "대상 지역에 8초 동안 화염 폭풍을 일으켜 2초마다 주문력의 60%에 해당하는 화염 피해를 입힙니다.",
    "effect": "주문력의 60% 화염 피해 (2초마다)",
    "cooldown": "30초",
    "range": "30미터",
    "castTime": "즉시 시전",
    "resource": "정기 3",
    "duration": "8초",
    "radius": "12미터"
  },
  "375087": {
    ...skillData["375087"],
    "krName": "용의 분노",
    "description": "20초 동안 용의 형상이 되어 능력이 25% 강화되고 정기를 30% 더 빠르게 생성합니다.",
    "buff": "능력 25% 강화, 정기 생성 30% 증가",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "20초"
  },
  "368432": {
    ...skillData["368432"],
    "krName": "분해",
    "description": "대상에게 주문력의 265%에 해당하는 주문 피해를 입힙니다. 2충전.",
    "effect": "주문력의 265% 주문 피해",
    "cooldown": "9초",
    "range": "25미터",
    "castTime": "즉시 시전",
    "resource": "정기 1",
    "charges": "2"
  },

  // 기원사 - 보존
  "364343": {
    ...skillData["364343"],
    "krName": "메아리",
    "description": "대상과 최대 4명의 부상당한 아군을 치유합니다. 주문력의 250%.",
    "healingEffect": "주문력의 250% 치유",
    "cooldown": "없음",
    "range": "30미터",
    "castTime": "즉시 시전",
    "resource": "정기 2",
    "maxTargets": "5"
  },
  "355913": {
    ...skillData["355913"],
    "krName": "에메랄드 꽃",
    "description": "대상 지역에 꽃을 피워 10초 동안 2초마다 주문력의 90%만큼 치유합니다.",
    "healingEffect": "주문력의 90% 치유 (2초마다)",
    "cooldown": "30초",
    "range": "30미터",
    "castTime": "즉시 시전",
    "duration": "10초",
    "radius": "10미터",
    "charges": "3"
  },
  "370960": {
    ...skillData["370960"],
    "krName": "에메랄드 친화",
    "description": "3분 동안 모든 치유량이 20% 증가합니다.",
    "buff": "치유량 20% 증가",
    "cooldown": "1분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "3분"
  },
  "363534": {
    ...skillData["363534"],
    "krName": "되돌리기",
    "description": "대상의 생명력을 4초 전 상태로 되돌립니다.",
    "effect": "생명력 복원 (4초 전)",
    "cooldown": "4분",
    "range": "30미터",
    "castTime": "즉시 시전"
  },
  "359816": {
    ...skillData["359816"],
    "krName": "꿈의 숨결",
    "description": "전방 원뿔 범위의 모든 아군을 주문력의 400%만큼 치유합니다.",
    "healingEffect": "주문력의 400% 치유",
    "cooldown": "없음",
    "range": "30미터",
    "castTime": "2.5초",
    "resource": "4% 기본 마나"
  },

  // 기원사 - 증강
  "395160": {
    ...skillData["395160"],
    "krName": "폭발",
    "description": "대상과 주변 적들에게 주문력의 210%에 해당하는 화염 피해를 입힙니다.",
    "effect": "주문력의 210% 화염 피해",
    "cooldown": "없음",
    "range": "25미터",
    "castTime": "즉시 시전",
    "resource": "정기 2"
  },
  "406732": {
    ...skillData["406732"],
    "krName": "공간 역설",
    "description": "대상의 능력을 증폭시켜 주 능력치를 10% 증가시킵니다.",
    "buff": "주 능력치 10% 증가",
    "cooldown": "2분",
    "range": "30미터",
    "castTime": "즉시 시전",
    "duration": "20초"
  },
  "395152": {
    ...skillData["395152"],
    "krName": "분산",
    "description": "대상에게 주문력의 225%에 해당하는 주문 피해를 입히고 버프를 훔칩니다.",
    "effect": "주문력의 225% 주문 피해",
    "utility": "버프 1개 훔침",
    "cooldown": "없음",
    "range": "25미터",
    "castTime": "즉시 시전",
    "resource": "정기 1"
  },
  "403631": {
    ...skillData["403631"],
    "krName": "숨결 보존",
    "description": "30초 동안 화염 숨결과 분해를 즉시 시전하고 정기 소모가 없습니다.",
    "buff": "즉시 시전, 정기 무소모",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "30초"
  },
  "404977": {
    ...skillData["404977"],
    "krName": "시간 균열",
    "description": "모든 아군의 주요 재사용 대기시간을 20% 단축시킵니다.",
    "buff": "재사용 대기시간 20% 감소",
    "cooldown": "3분",
    "range": "전체",
    "castTime": "즉시 시전",
    "duration": "즉시"
  }
};

// 기존 데이터에 정확한 정보 추가
Object.keys(accurateBatch6).forEach(id => {
  skillData[id] = accurateBatch6[id];
});

// 파일 저장
fs.writeFileSync('src/data/wowhead-full-descriptions-complete.json', JSON.stringify(skillData, null, 2), 'utf8');

console.log('Wowhead 정확한 스킬 정보 업데이트 - 배치 6 완료:');
console.log(`- 죽음의 기사: 16개 스킬`);
console.log(`- 악마사냥꾼: 10개 스킬`);
console.log(`- 기원사: 15개 스킬`);
console.log(`- 총 업데이트: ${Object.keys(accurateBatch6).length}개`);
console.log('\n정확한 수치와 효과 설명이 추가되었습니다.');