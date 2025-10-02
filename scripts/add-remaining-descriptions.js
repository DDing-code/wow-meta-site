/**
 * 나머지 클래스 스킬 설명 추가
 */

const fs = require('fs');
const path = require('path');

// 추가할 드루이드 스킬들
const druidSkills = {
  "5176": {
    "id": "5176",
    "krName": "천벌",
    "description": "40 미터 사정거리\n1.5초 시전 시간\n드루이드 필요\n\n대상에게 [주문력의 220%]의 비전 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "1.5초",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "8921": {
    "id": "8921",
    "krName": "달빛섬광",
    "description": "40 미터 사정거리\n즉시\n드루이드 필요\n\n대상에게 즉시 [주문력의 60%]의 비전 피해를 입히고 20초에 걸쳐 추가 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "774": {
    "id": "774",
    "krName": "회복",
    "description": "40 미터 사정거리\n즉시\n드루이드 필요\n\n12초에 걸쳐 [주문력의 200%]의 생명력을 회복시킵니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "5487": {
    "id": "5487",
    "krName": "곰 변신",
    "description": "즉시\n드루이드 필요\n\n곰 형태로 변신하여 방어력과 생명력이 증가하고 분노를 생성합니다.\n\n받는 피해가 감소합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "",
    "resource": ""
  },
  "768": {
    "id": "768",
    "krName": "표범 변신",
    "description": "즉시\n드루이드 필요\n\n표범 형태로 변신하여 이동 속도가 30% 증가하고 기력과 연계 점수를 사용합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "",
    "resource": ""
  },
  "22812": {
    "id": "22812",
    "krName": "나무껍질",
    "description": "즉시\n1분 재사용 대기시간\n드루이드 필요\n\n12초 동안 받는 모든 피해가 20% 감소합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "1분",
    "resource": ""
  },
  "18562": {
    "id": "18562",
    "krName": "신속한 치유",
    "description": "40 미터 사정거리\n즉시\n15초 재사용 대기시간\n드루이드 필요\n회복 전문화 필요\n\n대상의 생명력을 즉시 [주문력의 500%] 회복시킵니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "15초",
    "resource": "마나 대량 소모"
  },
  "740": {
    "id": "740",
    "krName": "평온",
    "description": "8초 정신집중\n3분 재사용 대기시간\n드루이드 필요\n회복 전문화 필요\n\n8초에 걸쳐 주위 아군을 강력하게 치유합니다.",
    "range": "",
    "castTime": "8초 정신집중",
    "cooldown": "3분",
    "resource": "마나 대량 소모"
  }
};

// 추가할 죽음의 기사 스킬들
const deathKnightSkills = {
  "49998": {
    "id": "49998",
    "krName": "죽음의 일격",
    "description": "근접 사정거리\n즉시\n35의 룬 마력\n죽음의 기사 필요\n\n대상에게 [전투력의 280%]의 물리 피해를 입히고 자신을 치유합니다.",
    "range": "근접",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "35의 룬 마력"
  },
  "47541": {
    "id": "47541",
    "krName": "죽음의 고리",
    "description": "30 미터 사정거리\n1.5초 시전 시간\n1의 룬\n죽음의 기사 필요\n\n대상에게 [주문력의 200%]의 암흑 피해를 입히고 생명력을 흡수합니다.",
    "range": "30 미터",
    "castTime": "1.5초",
    "cooldown": "",
    "resource": "1의 룬"
  },
  "55233": {
    "id": "55233",
    "krName": "흡혈",
    "description": "즉시\n죽음의 기사 필요\n혈기 전문화 필요\n\n최대 생명력이 30% 증가하고 받는 치유가 30% 증가합니다.\n\n영구 지속됩니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "",
    "resource": ""
  },
  "48792": {
    "id": "48792",
    "krName": "얼음 같은 인내력",
    "description": "즉시\n2분 재사용 대기시간\n죽음의 기사 필요\n\n8초 동안 받는 모든 피해가 30% 감소합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "2분",
    "resource": ""
  },
  "48707": {
    "id": "48707",
    "krName": "대마법 보호막",
    "description": "즉시\n1분 재사용 대기시간\n죽음의 기사 필요\n\n5초 동안 모든 마법 피해를 흡수하고 해로운 마법 효과에 면역이 됩니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "1분",
    "resource": ""
  },
  "49576": {
    "id": "49576",
    "krName": "죽음의 손아귀",
    "description": "30 미터 사정거리\n즉시\n25초 재사용 대기시간\n죽음의 기사 필요\n\n어둠의 힘으로 대상을 자신에게 끌어당깁니다.",
    "range": "30 미터",
    "castTime": "즉시",
    "cooldown": "25초",
    "resource": ""
  }
};

// 추가할 악마사냥꾼 스킬들
const demonHunterSkills = {
  "162794": {
    "id": "162794",
    "krName": "혼돈의 일격",
    "description": "근접 사정거리\n즉시\n40의 격노\n악마사냥꾼 필요\n\n혼돈의 힘으로 [전투력의 300%]의 혼돈 피해를 입힙니다.",
    "range": "근접",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "40의 격노"
  },
  "198013": {
    "id": "198013",
    "krName": "눈부신 빛",
    "description": "20 미터 사정거리\n즉시\n악마사냥꾼 필요\n\n대상에게 돌진하여 [전투력의 150%]의 혼돈 피해를 입힙니다.",
    "range": "20 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "격노 생성"
  },
  "191427": {
    "id": "191427",
    "krName": "탈태",
    "description": "즉시\n5분 재사용 대기시간\n악마사냥꾼 필요\n파멸 전문화 필요\n\n30초 동안 악마 형태로 변신합니다.\n\n가속이 25% 증가하고 도약 능력이 향상됩니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "5분",
    "resource": ""
  },
  "198589": {
    "id": "198589",
    "krName": "흐릿해지기",
    "description": "즉시\n1분 재사용 대기시간\n악마사냥꾼 필요\n\n10초 동안 받는 피해가 20% 감소하고 회피율이 50% 증가합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "1분",
    "resource": ""
  },
  "183752": {
    "id": "183752",
    "krName": "분열",
    "description": "즉시\n15초 재사용 대기시간\n악마사냥꾼 필요\n\n적의 다음 주문 시전을 방해하고 3초 동안 침묵시킵니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "15초",
    "resource": ""
  }
};

// 추가할 기원사 스킬들
const evokerSkills = {
  "361469": {
    "id": "361469",
    "krName": "살아있는 불꽃",
    "description": "25 미터 사정거리\n즉시\n기원사 필요\n\n대상에게 불꽃을 보내 [주문력의 180%]의 화염 피해를 입히거나 치유합니다.",
    "range": "25 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "마나 또는 정수 소모"
  },
  "357210": {
    "id": "357210",
    "krName": "심호흡",
    "description": "정신집중\n2분 재사용 대기시간\n기원사 필요\n\n하늘로 날아올라 지정한 경로를 따라 숨결을 내뿜어 모든 적에게 피해를 입힙니다.",
    "range": "",
    "castTime": "정신집중",
    "cooldown": "2분",
    "resource": ""
  },
  "355913": {
    "id": "355913",
    "krName": "되돌리기",
    "description": "40 미터 사정거리\n즉시\n기원사 필요\n보존 전문화 필요\n\n시간을 되돌려 대상의 생명력을 5초 전 상태로 되돌립니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "3분",
    "resource": "마나 대량 소모"
  },
  "355916": {
    "id": "355916",
    "krName": "에메랄드 꽃",
    "description": "30 미터 사정거리\n2초 시전 시간\n3의 정수\n기원사 필요\n보존 전문화 필요\n\n지역을 치유의 기운으로 가득 채워 10초 동안 주위 아군을 치유합니다.",
    "range": "30 미터",
    "castTime": "2초",
    "cooldown": "",
    "resource": "3의 정수"
  },
  "357208": {
    "id": "357208",
    "krName": "화염 숨결",
    "description": "즉시\n기원사 필요\n\n전방의 모든 적에게 [주문력의 400%]의 화염 피해를 입힙니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "30초",
    "resource": "정수 소모"
  }
};

// 기존 파일 로드
const basePath = path.join(__dirname, '..', 'src', 'data');
const completeDescriptions = JSON.parse(fs.readFileSync(path.join(basePath, 'wowhead-full-descriptions-complete.json'), 'utf8'));

// 모든 설명 병합
const finalDescriptions = {
  ...completeDescriptions,
  ...druidSkills,
  ...deathKnightSkills,
  ...demonHunterSkills,
  ...evokerSkills
};

// 정렬
const sortedFinal = {};
Object.keys(finalDescriptions).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
  sortedFinal[key] = finalDescriptions[key];
});

// 파일 저장
fs.writeFileSync(
  path.join(basePath, 'wowhead-full-descriptions-complete.json'),
  JSON.stringify(sortedFinal, null, 2),
  'utf8'
);

console.log(`✅ 총 ${Object.keys(sortedFinal).length}개의 스킬 설명이 저장되었습니다.`);
console.log(`📁 저장 위치: src/data/wowhead-full-descriptions-complete.json`);

// 클래스별 스킬 수 출력
const classCount = {
  전사: 20,
  성기사: 12,
  사냥꾼: 18,
  도적: 5,
  사제: 5,
  마법사: 5,
  흑마법사: 5,
  주술사: 5,
  수도사: 5,
  드루이드: 8,
  죽음의기사: 6,
  악마사냥꾼: 5,
  기원사: 5
};

console.log('\n클래스별 스킬 설명 추가 현황:');
Object.entries(classCount).forEach(([cls, count]) => {
  console.log(`- ${cls}: ${count}개`);
});