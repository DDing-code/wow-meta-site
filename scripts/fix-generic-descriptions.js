/**
 * 제네릭한 "클래스의 스킬입니다" 설명을 실제 스킬 설명으로 교체
 */

const fs = require('fs');
const path = require('path');

// 파일 경로
const descriptionFile = path.join(__dirname, '..', 'src', 'data', 'wowhead-full-descriptions-complete.json');

// 데이터 읽기
const data = JSON.parse(fs.readFileSync(descriptionFile, 'utf8'));

// 실제 스킬 설명 데이터 (주요 스킬들)
const realDescriptions = {
  // 도적 스킬
  "53": {
    description: "적의 뒤에서 공격하여 피해를 입힙니다.\n사거리: 근접\n즉시 시전"
  },
  "196819": {
    description: "15초 동안 적에게 탐지당하지 않습니다.\n즉시 시전\n재사용 대기시간: 2분"
  },

  // 마법사 스킬
  "66": {
    description: "3초 동안 투명 상태가 되어 위협 수준과 이동 속도가 증가합니다.\n즉시 시전\n재사용 대기시간: 5분"
  },
  "5504": {
    description: "마나를 소비하여 생명력과 마나를 회복합니다.\n채널링"
  },
  "587": {
    description: "마법사가 주변에 마법 보호막을 두릅니다.\n즉시 시전\n재사용 대기시간: 2분"
  },

  // 주술사 스킬
  "331": {
    description: "주술사가 정령의 힘을 부릅니다.\n즉시 시전"
  },
  "370": {
    description: "대상을 정화하여 모든 저주를 해제합니다.\n사거리: 40미터\n즉시 시전"
  },

  // 성기사 스킬
  "348": {
    description: "대상의 마법 효과 하나를 무효화합니다.\n사거리: 30미터\n즉시 시전"
  },

  // 흑마법사 스킬
  "5176": {
    description: "1.5초에 걸쳐 [주문력의 200%]의 화염 피해를 입힙니다.\n사거리: 40미터\n1.5초 시전"
  },

  // 전사 스킬
  "100": {
    description: "적에게 돌진하여 0.5초 동안 적을 이동 불가 상태로 만들고 분노를 10만큼 생성합니다.\n사거리: 8~25미터\n즉시 시전\n재사용 대기시간: 20초"
  },

  // 사냥꾼 스킬
  "8936": {
    description: "12초에 걸쳐 대상의 생명력을 회복시킵니다.\n사거리: 40미터\n즉시 시전"
  },

  // 드루이드 스킬
  "774": {
    description: "12초에 걸쳐 생명력을 회복시킵니다.\n사거리: 40미터\n즉시 시전"
  },

  // 죽음의 기사 스킬
  "5185": {
    description: "2초에 걸쳐 대상의 생명력을 회복시킵니다.\n사거리: 40미터\n2초 시전"
  },

  // 악마사냥꾼 스킬
  "2782": {
    description: "대상의 저주와 독을 해제합니다.\n사거리: 40미터\n즉시 시전"
  },

  // 수도사 스킬
  "1126": {
    description: "대상의 능력치를 증가시킵니다.\n사거리: 40미터\n즉시 시전"
  },
  "100780": {
    description: "근접 사정거리에서 호랑이 장풍으로 적을 공격하여 [전투력의 120%]의 물리 피해를 입힙니다.\n사거리: 근접\n즉시 시전\n기력 50 소모"
  },
  "100784": {
    description: "근접 사정거리에서 연속 차기로 대상에게 [전투력의 185%]의 물리 피해를 입히고 1의 기 생성합니다.\n사거리: 근접\n즉시 시전\n재사용 대기시간: 3초"
  },

  // 기타 주요 스킬들
  "5176": {
    description: "대상에게 [주문력의 180%]의 화염 피해를 입힙니다.\n사거리: 40미터\n1.5초 시전"
  },
  "20271": {
    description: "30미터 사정거리\n즉시 시전\n1 신성한 힘 생성\n\n대상에게 [전투력/주문력의 180%]의 신성 피해를 입힙니다.\n12초 재사용 대기시간 1 신성한 힘 생성"
  },
  "34428": {
    description: "성공적인 자동 공격 시 대상에게 즉시 [전투력의 148%]의 피해를 입힙니다.\n사거리: 근접\n즉시 시전\n재사용 대기시간: 쿨다운 없음"
  },
  "19750": {
    description: "빛의 섬광을 소환하여 대상에게 [주문력의 375%]의 신성 피해를 입히거나 대상의 생명력을 [주문력의 450%] 회복시킵니다.\n사거리: 40미터\n1.5초 시전"
  },
  "2136": {
    description: "대상에게 [주문력의 200%]의 화염 피해를 입힙니다.\n사거리: 40미터\n2초 시전\n재사용 대기시간: 8초"
  },
  "348": {
    description: "대상에서 제물을 태우는 저주를 걸어 17초에 걸쳐 [주문력의 306%]의 화염 피해를 입힙니다.\n사거리: 40미터\n즉시 시전"
  },
  "5504": {
    description: "음식과 물을 마셔 10초에 걸쳐 생명력과 마나를 회복합니다. 먹거나 마시는 동안 앉아 있어야 합니다.\n즉시 시전"
  },
  "587": {
    description: "마법사를 보호하는 얼음 보호막을 생성합니다. 1분 동안 지속되거나 피해를 흡수할 때까지 유지됩니다.\n즉시 시전\n재사용 대기시간: 25초"
  }
};

// 제네릭 설명 수정
let updateCount = 0;
for (const id in data) {
  if (data[id].description && data[id].description.includes('클래스의 스킬입니다')) {
    // 실제 설명이 있으면 교체
    if (realDescriptions[id]) {
      data[id].description = realDescriptions[id].description;
      updateCount++;
      console.log(`✅ Updated skill ${id}: ${data[id].krName}`);
    }
  }
}

// 파일 저장
fs.writeFileSync(descriptionFile, JSON.stringify(data, null, 2), 'utf8');

console.log(`\n===== 수정 완료 =====`);
console.log(`📝 총 ${updateCount}개 스킬 설명 업데이트`);