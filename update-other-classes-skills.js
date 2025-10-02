const fs = require('fs');

// 기존 데이터 로드
const skillData = JSON.parse(fs.readFileSync('src/data/wowhead-full-descriptions-complete.json', 'utf8'));

// 도적 주요 스킬
const rogueSkillUpdates = {
  "1766": {
    ...skillData["1766"],
    "krName": skillData["1766"]?.krName || "발차기",
    "description": "대상의 주문 시전을 차단하고 5초 동안 같은 계열의 주문을 시전할 수 없게 합니다.",
    "cooldown": "15초",
    "range": "근접",
    "castTime": "즉시 시전",
    "resource": "15 기력"
  },
  "2983": {
    ...skillData["2983"],
    "krName": skillData["2983"]?.krName || "전력 질주",
    "description": "3초 동안 이동 속도가 70% 증가하고 이동 불가 효과에서 벗어납니다.",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "3초"
  },
  "31224": {
    ...skillData["31224"],
    "krName": skillData["31224"]?.krName || "그림자 망토",
    "description": "5초 동안 모든 마법 공격을 회피합니다.",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "5초"
  },
  "1856": {
    ...skillData["1856"],
    "krName": skillData["1856"]?.krName || "소멸",
    "description": "2초 동안 사라져 모든 위협 수준을 초기화하고 피해에 면역이 됩니다.",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "2초"
  }
};

// 사제 주요 스킬
const priestSkillUpdates = {
  "47788": {
    ...skillData["47788"],
    "krName": skillData["47788"]?.krName || "수호 영혼",
    "description": "대상이 10초 동안 받는 모든 피해를 40% 감소시킵니다. 치명적인 피해를 받으면 대상의 생명력을 50% 회복시키고 효과가 사라집니다.",
    "cooldown": "1분",
    "range": "40미터",
    "castTime": "즉시 시전",
    "duration": "10초"
  },
  "33206": {
    ...skillData["33206"],
    "krName": skillData["33206"]?.krName || "고통 억제",
    "description": "대상이 8초 동안 받는 모든 피해를 40% 감소시킵니다.",
    "cooldown": "3분",
    "range": "40미터",
    "castTime": "즉시 시전",
    "duration": "8초"
  },
  "64843": {
    ...skillData["64843"],
    "krName": skillData["64843"]?.krName || "천상의 찬가",
    "description": "8초 동안 채널링하여 40미터 내의 모든 파티원과 공격대원을 지속적으로 치유합니다.",
    "cooldown": "3분",
    "range": "40미터 (반경)",
    "castTime": "8초 채널링",
    "duration": "8초"
  },
  "586": {
    ...skillData["586"],
    "krName": skillData["586"]?.krName || "소실",
    "description": "10초 동안 소실되어 위협 수준이 감소합니다. 공격하거나 행동하면 효과가 해제됩니다.",
    "cooldown": "30초",
    "castTime": "즉시 시전",
    "duration": "10초"
  }
};

// 마법사 주요 스킬
const mageSkillUpdates = {
  "45438": {
    ...skillData["45438"],
    "krName": skillData["45438"]?.krName || "얼음 방패",
    "description": "10초 동안 얼음에 둘러싸여 모든 물리 공격과 주문 효과에 면역이 되지만 공격하거나 채널링하거나 주문을 시전할 수 없습니다.",
    "cooldown": "4분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "10초"
  },
  "55342": {
    ...skillData["55342"],
    "krName": skillData["55342"]?.krName || "환영 복제",
    "description": "당신과 동일한 모습의 환영 3개를 소환하고 즉시 대상 위치로 순간이동합니다.",
    "cooldown": "1.5분",
    "range": "20미터",
    "castTime": "즉시 시전"
  },
  "12051": {
    ...skillData["12051"],
    "krName": skillData["12051"]?.krName || "환기",
    "description": "모든 재사용 대기시간을 즉시 초기화합니다.",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전"
  },
  "80353": {
    ...skillData["80353"],
    "krName": skillData["80353"]?.krName || "시간 왜곡",
    "description": "40초 동안 100미터 내 모든 파티원과 공격대원의 가속을 30% 증가시킵니다. 탈진을 유발합니다.",
    "cooldown": "5분",
    "range": "100미터 (반경)",
    "castTime": "즉시 시전",
    "duration": "40초"
  }
};

// 흑마법사 주요 스킬
const warlockSkillUpdates = {
  "104773": {
    ...skillData["104773"],
    "krName": skillData["104773"]?.krName || "불굴의 결의",
    "description": "8초 동안 받는 모든 피해를 40% 감소시키고 시전 방해에 면역이 됩니다.",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "8초"
  },
  "30283": {
    ...skillData["30283"],
    "krName": skillData["30283"]?.krName || "어둠의 격노",
    "description": "10초 동안 가속이 30% 증가하고 자원 소모가 절반으로 감소합니다.",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "10초"
  }
};

// 주술사 주요 스킬
const shamanSkillUpdates = {
  "108271": {
    ...skillData["108271"],
    "krName": skillData["108271"]?.krName || "영혼 이동",
    "description": "받는 피해를 40% 감소시키고 이동 불가 효과에 면역이 됩니다.",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "8초"
  },
  "98008": {
    ...skillData["98008"],
    "krName": skillData["98008"]?.krName || "정신 고리 토템",
    "description": "토템 20미터 내의 모든 파티원과 공격대원이 받는 피해를 10% 감소시킵니다.",
    "cooldown": "3분",
    "range": "40미터",
    "castTime": "즉시 시전",
    "duration": "6초"
  },
  "2825": {
    ...skillData["2825"],
    "krName": skillData["2825"]?.krName || "피의 욕망",
    "description": "40초 동안 100미터 내 모든 파티원과 공격대원의 가속을 30% 증가시킵니다. 탈진을 유발합니다.",
    "cooldown": "5분",
    "range": "100미터 (반경)",
    "castTime": "즉시 시전",
    "duration": "40초"
  }
};

// 드루이드 주요 스킬
const druidSkillUpdates = {
  "22812": {
    ...skillData["22812"],
    "krName": skillData["22812"]?.krName || "나무 껍질",
    "description": "12초 동안 받는 모든 피해를 20% 감소시킵니다.",
    "cooldown": "1분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "12초"
  },
  "740": {
    ...skillData["740"],
    "krName": skillData["740"]?.krName || "평온",
    "description": "8초 동안 채널링하여 40미터 내의 모든 파티원과 공격대원을 치유합니다.",
    "cooldown": "3분",
    "range": "40미터 (반경)",
    "castTime": "8초 채널링",
    "duration": "8초"
  },
  "29166": {
    ...skillData["29166"],
    "krName": skillData["29166"]?.krName || "정신 자극",
    "description": "대상의 마나를 즉시 60% 회복시킵니다.",
    "cooldown": "3분",
    "range": "40미터",
    "castTime": "즉시 시전"
  },
  "106951": {
    ...skillData["106951"],
    "krName": skillData["106951"]?.krName || "광폭화",
    "description": "15초 동안 피해가 20% 증가하고 에너지 재생이 100% 증가합니다.",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "15초"
  }
};

// 죽음의 기사 주요 스킬
const deathknightSkillUpdates = {
  "48792": {
    ...skillData["48792"],
    "krName": skillData["48792"]?.krName || "얼음결계 방어구",
    "description": "5초 동안 받는 모든 피해를 30% 감소시키고 모든 마법 효과에 면역이 됩니다.",
    "cooldown": "2분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "5초"
  },
  "48707": {
    ...skillData["48707"],
    "krName": skillData["48707"]?.krName || "대마법 보호막",
    "description": "5초 동안 받는 모든 마법 피해를 75% 감소시킵니다.",
    "cooldown": "1분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "5초"
  },
  "55233": {
    ...skillData["55233"],
    "krName": skillData["55233"]?.krName || "흡혈",
    "description": "10초 동안 입힌 피해의 30%만큼 생명력을 회복합니다.",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "10초"
  }
};

// 수도사 주요 스킬
const monkSkillUpdates = {
  "115203": {
    ...skillData["115203"],
    "krName": skillData["115203"]?.krName || "강화주",
    "description": "15초 동안 교묘함 효과가 100% 증가합니다.",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "15초"
  },
  "122470": {
    ...skillData["122470"],
    "krName": skillData["122470"]?.krName || "업보의 손길",
    "description": "10초 동안 받는 모든 피해를 50% 반사합니다.",
    "cooldown": "1.5분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "10초"
  }
};

// 악마사냥꾼 주요 스킬
const demonhunterSkillUpdates = {
  "198589": {
    ...skillData["198589"],
    "krName": skillData["198589"]?.krName || "흐릿해짐",
    "description": "10초 동안 받는 모든 피해를 20% 감소시키고 회피가 50% 증가합니다.",
    "cooldown": "1분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "10초"
  },
  "196718": {
    ...skillData["196718"],
    "krName": skillData["196718"]?.krName || "어둠 속으로",
    "description": "8초 동안 어둠 속으로 들어가 피해에 면역이 됩니다. 이동 속도가 30% 증가합니다.",
    "cooldown": "3분",
    "range": "자신",
    "castTime": "즉시 시전",
    "duration": "8초"
  }
};

// 모든 업데이트 병합
const allUpdates = {
  ...rogueSkillUpdates,
  ...priestSkillUpdates,
  ...mageSkillUpdates,
  ...warlockSkillUpdates,
  ...shamanSkillUpdates,
  ...druidSkillUpdates,
  ...deathknightSkillUpdates,
  ...monkSkillUpdates,
  ...demonhunterSkillUpdates
};

// 기존 데이터에 상세 정보 추가
Object.keys(allUpdates).forEach(id => {
  skillData[id] = allUpdates[id];
});

// 파일 저장
fs.writeFileSync('src/data/wowhead-full-descriptions-complete.json', JSON.stringify(skillData, null, 2), 'utf8');

console.log('기타 클래스 스킬 상세 정보 업데이트 완료:');
console.log(`- 도적: ${Object.keys(rogueSkillUpdates).length}개`);
console.log(`- 사제: ${Object.keys(priestSkillUpdates).length}개`);
console.log(`- 마법사: ${Object.keys(mageSkillUpdates).length}개`);
console.log(`- 흑마법사: ${Object.keys(warlockSkillUpdates).length}개`);
console.log(`- 주술사: ${Object.keys(shamanSkillUpdates).length}개`);
console.log(`- 드루이드: ${Object.keys(druidSkillUpdates).length}개`);
console.log(`- 죽음의 기사: ${Object.keys(deathknightSkillUpdates).length}개`);
console.log(`- 수도사: ${Object.keys(monkSkillUpdates).length}개`);
console.log(`- 악마사냥꾼: ${Object.keys(demonhunterSkillUpdates).length}개`);
console.log(`- 총 업데이트: ${Object.keys(allUpdates).length}개`);
console.log('\n파일이 성공적으로 저장되었습니다.');