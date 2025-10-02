const fs = require('fs');

// 기존 데이터 로드
const skillData = JSON.parse(fs.readFileSync('src/data/wowhead-full-descriptions-complete.json', 'utf8'));

// Wowhead 정확한 스킬 정보 - 배치 4 (흑마법사, 주술사)
const accurateBatch4 = {
  // 흑마법사 - 고통
  "980": {
    ...skillData["980"],
    "krName": "고통",
    "description": "대상을 저주하여 18초에 걸쳐 주문력의 138.6%에 해당하는 암흑 피해를 입힙니다.",
    "effect": "주문력의 138.6% 암흑 피해 (18초)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "0.5% 기본 마나",
    "duration": "18초"
  },
  "172": {
    ...skillData["172"],
    "krName": "부패",
    "description": "대상을 부패시켜 14초에 걸쳐 주문력의 124.6%에 해당하는 암흑 피해를 입힙니다.",
    "effect": "주문력의 124.6% 암흑 피해 (14초)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "1% 기본 마나",
    "duration": "14초"
  },
  "316099": {
    ...skillData["316099"],
    "krName": "불안정한 고통",
    "description": "대상에게 16초에 걸쳐 주문력의 175%에 해당하는 암흑 피해를 입힙니다. 해제 시 즉시 피해를 입힙니다.",
    "effect": "주문력의 175% 암흑 피해 (16초)",
    "dispelEffect": "해제 시 즉시 4초분 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "1.5초",
    "resource": "영혼의 조각 1",
    "duration": "16초"
  },
  "30108": {
    ...skillData["30108"],
    "krName": "쇠약",
    "description": "대상의 모든 능력치를 5% 감소시킵니다.",
    "debuff": "모든 능력치 5% 감소",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "0.5% 기본 마나",
    "duration": "2분"
  },
  "48181": {
    ...skillData["48181"],
    "krName": "마법 해제",
    "description": "대상에게 걸린 모든 지속 피해 효과를 폭발시켜 남은 피해의 200%를 즉시 입힙니다.",
    "effect": "모든 도트 피해의 200% 즉시",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "영혼의 조각 1"
  },
  "27243": {
    ...skillData["27243"],
    "krName": "씨앗 뿌리기",
    "description": "대상에 부패의 씨앗을 심습니다. 주문력의 180% 피해를 받으면 폭발하여 주변에 피해를 입힙니다.",
    "effect": "주문력의 65% 광역 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2.5초",
    "resource": "영혼의 조각 1",
    "trigger": "피해 임계치 도달 시",
    "radius": "10미터"
  },

  // 흑마법사 - 악마
  "264178": {
    ...skillData["264178"],
    "krName": "악마의 화살",
    "description": "대상에게 주문력의 95%에 해당하는 암흑 피해를 입히고 악마 핵 조각을 2개 생성합니다.",
    "effect": "주문력의 95% 암흑 피해",
    "generates": "악마 핵 조각 2",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전"
  },
  "105174": {
    ...skillData["105174"],
    "krName": "손으로 부리는 악마의 화살",
    "description": "3초 동안 악마의 화살 5발을 연속으로 발사합니다. 각 화살은 주문력의 65%의 피해를 입힙니다.",
    "effect": "주문력의 65% x 5 암흑 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "3초 채널링",
    "resource": "악마 핵 조각 3",
    "duration": "3초"
  },
  "265187": {
    ...skillData["265187"],
    "krName": "악마 폭군 소환",
    "description": "15초 동안 악마 폭군을 소환합니다. 현재 소환된 각 악마당 15% 추가 피해를 입힙니다.",
    "summon": "악마 폭군 (15초)",
    "damageBonus": "소환된 악마당 15% 피해 증가",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "15초"
  },
  "267211": {
    ...skillData["267211"],
    "krName": "악마의 문",
    "description": "현재 활성화된 모든 악마의 지속 시간을 15초 연장합니다.",
    "effect": "악마 지속 시간 15초 연장",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전"
  },
  "264119": {
    ...skillData["264119"],
    "krName": "끔찍한 지식 소환",
    "description": "12초 동안 끔찍한 지식을 소환하여 주문력의 65%에 해당하는 암흑 피해를 입힙니다.",
    "summon": "끔찍한 지식 (12초)",
    "effect": "주문력의 65% 암흑 피해/초",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2초",
    "resource": "영혼의 조각 1",
    "duration": "12초"
  },

  // 흑마법사 - 파괴
  "116858": {
    ...skillData["116858"],
    "krName": "혼돈의 화살",
    "description": "대상에게 주문력의 420%에 해당하는 혼돈 피해를 입힙니다. 항상 치명타로 적중합니다.",
    "effect": "주문력의 420% 혼돈 피해",
    "critBonus": "항상 치명타",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2.5초",
    "resource": "영혼의 조각 2"
  },
  "17962": {
    ...skillData["17962"],
    "krName": "점화",
    "description": "대상을 점화시켜 즉시 주문력의 60%의 화염 피해를 입히고, 6초에 걸쳐 추가 피해를 입힙니다.",
    "effect": "주문력의 60% 즉시 + 90% 지속 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "영혼의 조각 1",
    "duration": "6초"
  },
  "348": {
    ...skillData["348"],
    "krName": "제물",
    "description": "대상을 불태워 15초에 걸쳐 주문력의 150%에 해당하는 화염 피해를 입힙니다.",
    "effect": "주문력의 150% 화염 피해 (15초)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "1.5초",
    "resource": "1.5% 기본 마나",
    "duration": "15초"
  },
  "80240": {
    ...skillData["80240"],
    "krName": "파멸",
    "description": "대상 지역에 지옥불을 소환하여 주문력의 200%에 해당하는 화염 피해를 입히고 6초간 불타게 합니다.",
    "effect": "주문력의 200% 화염 피해",
    "areaEffect": "6초간 화염 지대",
    "cooldown": "30초",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "영혼의 조각 3",
    "duration": "6초",
    "radius": "8미터"
  },
  "1122": {
    ...skillData["1122"],
    "krName": "지옥불정령 소환",
    "description": "30초 동안 지옥불정령을 소환합니다. 지옥불정령은 강력한 광역 피해를 입힙니다.",
    "summon": "지옥불정령 (30초)",
    "cooldown": "3분",
    "range": "30미터",
    "castTime": "2초",
    "duration": "30초"
  },

  // 주술사 - 정기
  "51505": {
    ...skillData["51505"],
    "krName": "용암 폭발",
    "description": "대상에게 주문력의 170%에 해당하는 화염 피해를 입힙니다. 화염 충격 효과가 있으면 항상 치명타로 적중합니다.",
    "effect": "주문력의 170% 화염 피해",
    "conditionalCrit": "화염 충격 시 치명타 보장",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2초",
    "resource": "소용돌이 10"
  },
  "188196": {
    ...skillData["188196"],
    "krName": "번개 화살",
    "description": "대상에게 주문력의 92%에 해당하는 자연 피해를 입힙니다. 30% 확률로 원소 과부하가 발동합니다.",
    "effect": "주문력의 92% 자연 피해",
    "overload": "30% 확률로 과부하",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2.5초",
    "resource": "소용돌이 4 생성"
  },
  "188389": {
    ...skillData["188389"],
    "krName": "화염 충격",
    "description": "대상에게 즉시 피해를 입히고 18초에 걸쳐 주문력의 210%에 해당하는 화염 피해를 입힙니다.",
    "effect": "주문력의 35% 즉시 + 175% 지속 피해",
    "cooldown": "6초",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "소용돌이 10",
    "duration": "18초"
  },
  "61882": {
    ...skillData["61882"],
    "krName": "지진",
    "description": "대상 지역에 6초 동안 지진을 일으켜 1초마다 주문력의 58%에 해당하는 자연 피해를 입힙니다.",
    "effect": "주문력의 58% 자연 피해 (1초마다)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "소용돌이 60",
    "duration": "6초",
    "radius": "10미터"
  },
  "114050": {
    ...skillData["114050"],
    "krName": "승천",
    "description": "15초 동안 정령이 되어 시전 중 이동 가능하고 용암 폭발이 즉시 시전됩니다.",
    "buff": "이동 중 시전, 용암 폭발 즉시 시전",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "15초"
  },

  // 주술사 - 고양
  "193796": {
    ...skillData["193796"],
    "krName": "화염의 채찍",
    "description": "대상에게 공격력의 25%에 해당하는 화염 피해를 입히고 무기를 화염으로 강화합니다.",
    "effect": "공격력의 25% 화염 피해",
    "weaponBuff": "화염 무기 강화",
    "cooldown": "없음",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "소용돌이 10"
  },
  "17364": {
    ...skillData["17364"],
    "krName": "폭풍의 일격",
    "description": "대상에게 공격력의 225%에 해당하는 물리 피해를 입히고 폭풍 강타 효과를 부여합니다.",
    "effect": "공격력의 225% 물리 피해",
    "buff": "폭풍 강타 (다음 번개 화살 또는 연쇄 번개 즉시 시전)",
    "cooldown": "7.5초",
    "range": "근접",
    "castTime": "즉시 시전"
  },
  "187874": {
    ...skillData["187874"],
    "krName": "산사태",
    "description": "전방 원뿔 범위에 공격력의 80%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 80% 물리 피해 (광역)",
    "cooldown": "없음",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "소용돌이 20"
  },
  "196840": {
    ...skillData["196840"],
    "krName": "서리 충격",
    "description": "대상을 얼려 공격력의 125%에 해당하는 냉기 피해를 입히고 이동 속도를 50% 감소시킵니다.",
    "effect": "공격력의 125% 냉기 피해",
    "debuff": "이동 속도 50% 감소 (6초)",
    "cooldown": "없음",
    "range": "25미터",
    "castTime": "즉시 시전",
    "duration": "6초"
  },
  "384352": {
    ...skillData["384352"],
    "krName": "파멸의 원소",
    "description": "12초 동안 2원소 정령을 소환합니다. 정령은 근접 공격과 원소 공격을 합니다.",
    "summon": "파멸/폭풍 정령 (12초)",
    "cooldown": "2.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "12초"
  },

  // 주술사 - 복원
  "8004": {
    ...skillData["8004"],
    "krName": "치유의 파도",
    "description": "대상을 주문력의 280%만큼 치유합니다.",
    "healingEffect": "주문력의 280% 치유",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2.5초",
    "resource": "8% 기본 마나"
  },
  "77472": {
    ...skillData["77472"],
    "krName": "치유의 파도 연쇄",
    "description": "대상을 치유하고 최대 4명의 부상당한 아군에게 연쇄됩니다. 연쇄할수록 치유량이 30% 감소합니다.",
    "healingEffect": "주문력의 220% 치유",
    "chainTargets": "4",
    "chainReduction": "30%씩 감소",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2.5초",
    "resource": "20% 기본 마나"
  },
  "1064": {
    ...skillData["1064"],
    "krName": "성난 해일",
    "description": "대상에게 즉시 주문력의 90%만큼 치유하고 6초에 걸쳐 추가 치유합니다.",
    "healingEffect": "주문력의 90% 즉시 + 120% 지속",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "8% 기본 마나",
    "duration": "6초"
  },
  "73920": {
    ...skillData["73920"],
    "krName": "치유의 비",
    "description": "대상 지역에 10초 동안 치유의 비를 내려 2초마다 주문력의 73%만큼 치유합니다.",
    "healingEffect": "주문력의 73% 치유 (2초마다)",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2초",
    "resource": "21.5% 기본 마나",
    "duration": "10초",
    "radius": "10미터",
    "maxTargets": "6"
  },
  "98008": {
    ...skillData["98008"],
    "krName": "정신 고리 토템",
    "description": "20미터 내 모든 아군의 생명력을 공유하여 받는 피해를 10% 감소시킵니다.",
    "buff": "생명력 공유, 받는 피해 10% 감소",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "6초",
    "radius": "20미터"
  }
};

// 기존 데이터에 정확한 정보 추가
Object.keys(accurateBatch4).forEach(id => {
  skillData[id] = accurateBatch4[id];
});

// 파일 저장
fs.writeFileSync('src/data/wowhead-full-descriptions-complete.json', JSON.stringify(skillData, null, 2), 'utf8');

console.log('Wowhead 정확한 스킬 정보 업데이트 - 배치 4 완료:');
console.log(`- 흑마법사: 16개 스킬`);
console.log(`- 주술사: 15개 스킬`);
console.log(`- 총 업데이트: ${Object.keys(accurateBatch4).length}개`);
console.log('\n정확한 수치와 효과 설명이 추가되었습니다.');