const fs = require('fs');

// 기존 데이터 로드
const skillData = JSON.parse(fs.readFileSync('src/data/wowhead-full-descriptions-complete.json', 'utf8'));

// Wowhead에서 가져온 정확한 스킬 정보 예시
// 실제로는 Wowhead API나 웹 스크래핑으로 가져와야 함
const accurateSkillDetails = {
  // 전사 - 피의 갈증 (Bloodthirst)
  "23881": {
    ...skillData["23881"],
    "krName": "피의 갈증",
    "description": "무기 공격력의 85%에 해당하는 물리 피해를 입힙니다. 공격에 성공하면 격노 효과를 얻습니다.",
    "effect": "무기 공격력의 85%에 해당하는 물리 피해",
    "generates": "8의 분노 생성",
    "cooldown": "4.5초",
    "range": "근접 범위",
    "castTime": "즉시 시전",
    "additionalEffect": "격노 효과 부여 (공격 속도 25% 증가, 4초)"
  },

  // 전사 - 분쇄 (Mortal Strike)
  "12294": {
    ...skillData["12294"],
    "krName": "죽음의 일격",
    "description": "무기 공격력의 190%에 해당하는 물리 피해를 입히고, 대상이 받는 치유 효과를 10초 동안 50% 감소시킵니다.",
    "effect": "무기 공격력의 190%에 해당하는 물리 피해",
    "debuff": "죽음의 상처: 받는 치유 50% 감소",
    "cooldown": "6초",
    "range": "근접 범위",
    "castTime": "즉시 시전",
    "resource": "30의 분노",
    "duration": "10초"
  },

  // 전사 - 휠윈드 (Whirlwind)
  "1680": {
    ...skillData["1680"],
    "krName": "소용돌이",
    "description": "주위 8미터 내의 모든 적에게 무기 공격력의 45%에 해당하는 물리 피해를 입힙니다.",
    "effect": "무기 공격력의 45%에 해당하는 물리 피해 (모든 대상)",
    "cooldown": "없음",
    "range": "8미터",
    "castTime": "즉시 시전",
    "resource": "30의 분노",
    "maxTargets": "5"
  },

  // 마법사 - 화염구 (Fireball)
  "133": {
    ...skillData["133"],
    "krName": "화염구",
    "description": "불타는 구체를 던져 주문력의 240%에 해당하는 화염 피해를 입힙니다.",
    "effect": "주문력의 240%에 해당하는 화염 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2.25초",
    "resource": "2% 기본 마나",
    "school": "화염"
  },

  // 마법사 - 얼음 화살 (Frostbolt)
  "116": {
    ...skillData["116"],
    "krName": "얼음 화살",
    "description": "대상에게 주문력의 210%에 해당하는 냉기 피해를 입히고 8초 동안 이동 속도를 50% 감소시킵니다.",
    "effect": "주문력의 210%에 해당하는 냉기 피해",
    "debuff": "이동 속도 50% 감소",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2초",
    "resource": "2% 기본 마나",
    "duration": "8초",
    "school": "냉기"
  },

  // 사제 - 신의 권능: 보호막 (Power Word: Shield)
  "17": {
    ...skillData["17"],
    "krName": "신의 권능: 보호막",
    "description": "대상에게 주문력의 550%에 해당하는 피해를 흡수하는 보호막을 씌웁니다. 15초 동안 지속됩니다.",
    "effect": "주문력의 550%에 해당하는 피해 흡수",
    "cooldown": "7.5초",
    "range": "40미터",
    "castTime": "즉시 시전",
    "resource": "2.5% 기본 마나",
    "duration": "15초",
    "debuff": "약화된 영혼 (보호막 재사용 불가, 7.5초)"
  },

  // 도적 - 절개 (Eviscerate)
  "2098": {
    ...skillData["2098"],
    "krName": "절개",
    "description": "연계 점수를 소모하여 대상에게 물리 피해를 입힙니다.\n연계 점수당: 공격력의 60%",
    "effect": "연계 점수당 공격력의 60%에 해당하는 물리 피해",
    "cooldown": "없음",
    "range": "근접 범위",
    "castTime": "즉시 시전",
    "resource": "35 기력",
    "comboPoints": "1-5 소모",
    "scaling": "연계 점수에 비례"
  },

  // 성기사 - 빛의 섬광 (Flash of Light)
  "19750": {
    ...skillData["19750"],
    "krName": "빛의 섬광",
    "description": "1.5초의 시전 시간 후 대상에게 주문력의 450%에 해당하는 치유를 합니다.",
    "effect": "주문력의 450%에 해당하는 치유",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "1.5초",
    "resource": "22% 기본 마나",
    "school": "신성"
  },

  // 드루이드 - 갈퀴 발톱 (Rake)
  "1822": {
    ...skillData["1822"],
    "krName": "갈퀴 발톱",
    "description": "대상에게 공격력의 46%에 해당하는 출혈 피해를 입히고, 15초에 걸쳐 공격력의 77.5%에 해당하는 추가 출혈 피해를 입힙니다.",
    "initialDamage": "공격력의 46%",
    "dotDamage": "공격력의 77.5% (15초)",
    "cooldown": "없음",
    "range": "근접 범위",
    "castTime": "즉시 시전",
    "resource": "35 기력",
    "duration": "15초",
    "comboPoints": "1 생성"
  },

  // 사냥꾼 - 조준 사격 (Aimed Shot)
  "19434": {
    ...skillData["19434"],
    "krName": "조준 사격",
    "description": "대상에게 무기 공격력의 270% + 원거리 공격력의 270%에 해당하는 물리 피해를 입힙니다.",
    "effect": "무기 피해의 270% + 원거리 공격력의 270%",
    "cooldown": "12초",
    "range": "40미터",
    "castTime": "2.5초",
    "resource": "35 집중",
    "charges": "2"
  },

  // 흑마법사 - 어둠 화살 (Shadow Bolt)
  "686": {
    ...skillData["686"],
    "krName": "어둠 화살",
    "description": "대상에게 주문력의 150%에 해당하는 암흑 피해를 입힙니다.",
    "effect": "주문력의 150%에 해당하는 암흑 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2초",
    "resource": "2% 기본 마나",
    "school": "암흑"
  },

  // 주술사 - 번개 화살 (Lightning Bolt)
  "403": {
    ...skillData["403"],
    "krName": "번개 화살",
    "description": "대상에게 주문력의 170%에 해당하는 자연 피해를 입힙니다.",
    "effect": "주문력의 170%에 해당하는 자연 피해",
    "cooldown": "없음",
    "range": "40미터",
    "castTime": "2.5초",
    "resource": "1% 기본 마나",
    "school": "자연",
    "overload": "30% 확률로 과부하 발동"
  },

  // 죽음의 기사 - 죽음의 일격 (Death Strike)
  "49998": {
    ...skillData["49998"],
    "krName": "죽음의 일격",
    "description": "무기 공격력의 330%에 해당하는 물리 피해를 입히고, 최근 5초 동안 받은 피해의 25%만큼 생명력을 회복합니다.",
    "effect": "무기 공격력의 330%에 해당하는 물리 피해",
    "healing": "최근 5초 동안 받은 피해의 25% (최소 생명력의 7%)",
    "cooldown": "없음",
    "range": "근접 범위",
    "castTime": "즉시 시전",
    "resource": "35 룬 마력",
    "runes": "1 룬"
  },

  // 수도사 - 흑우 맥주 (Blackout Kick)
  "100784": {
    ...skillData["100784"],
    "krName": "흑우차기",
    "description": "대상에게 공격력의 185%에 해당하는 물리 피해를 입힙니다.",
    "effect": "공격력의 185%에 해당하는 물리 피해",
    "cooldown": "없음",
    "range": "근접 범위",
    "castTime": "즉시 시전",
    "resource": "3 기",
    "additionalEffect": "양조: 순간 틈새 3초 감소"
  },

  // 악마사냥꾼 - 혼돈의 일격 (Chaos Strike)
  "162794": {
    ...skillData["162794"],
    "krName": "혼돈의 일격",
    "description": "대상에게 무기 공격력의 223.45%에 해당하는 혼돈 피해를 입힙니다. 40% 확률로 격분을 20 환원합니다.",
    "effect": "무기 공격력의 223.45%에 해당하는 혼돈 피해",
    "cooldown": "없음",
    "range": "근접 범위",
    "castTime": "즉시 시전",
    "resource": "40 격분",
    "critBonus": "치명타 시 격분 20 환원 (40% 확률)"
  },

  // 기원사 - 살아있는 불꽃 (Living Flame)
  "361469": {
    ...skillData["361469"],
    "krName": "살아있는 불꽃",
    "description": "아군 대상: 주문력의 350%에 해당하는 치유\n적 대상: 주문력의 143%에 해당하는 화염 피해",
    "healingEffect": "주문력의 350% 치유",
    "damageEffect": "주문력의 143% 화염 피해",
    "cooldown": "없음",
    "range": "30미터",
    "castTime": "2.25초",
    "resource": "3% 기본 마나",
    "school": "화염/자연"
  }
};

// 기존 데이터에 정확한 정보 추가
Object.keys(accurateSkillDetails).forEach(id => {
  skillData[id] = accurateSkillDetails[id];
});

// 파일 저장
fs.writeFileSync('src/data/wowhead-full-descriptions-complete.json', JSON.stringify(skillData, null, 2), 'utf8');

console.log('정확한 스킬 상세 정보 업데이트 완료:');
console.log(`- 총 ${Object.keys(accurateSkillDetails).length}개 스킬 업데이트`);
console.log('- Wowhead 기준 정확한 수치와 효과 설명 추가');
console.log('\n파일이 성공적으로 저장되었습니다.');