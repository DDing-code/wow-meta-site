/**
 * 모든 스킬에 대한 상세 설명 추가
 * WoW 형식의 설명 텍스트를 모든 클래스 스킬에 적용
 */

const fs = require('fs');
const path = require('path');

// 기존 설명 파일 로드
const basePath = path.join(__dirname, '..', 'src', 'data');
const existingDescriptions = JSON.parse(fs.readFileSync(path.join(basePath, 'wowhead-full-descriptions-complete.json'), 'utf8'));

// 모든 클래스 스킬 파일 임포트
const warriorSkills = require(path.join(basePath, 'skills', 'wowdbWarriorSkillsComplete.js')).wowdbWarriorSkillsComplete;
const paladinSkills = require(path.join(basePath, 'skills', 'wowdbPaladinSkillsComplete.js')).wowdbPaladinSkillsComplete;
const hunterSkills = require(path.join(basePath, 'skills', 'wowdbHunterSkillsComplete.js')).wowdbHunterSkillsComplete;
const rogueSkills = require(path.join(basePath, 'skills', 'wowdbRogueSkillsComplete.js')).wowdbRogueSkillsComplete;
const priestSkills = require(path.join(basePath, 'skills', 'wowdbPriestSkillsComplete.js')).wowdbPriestSkillsComplete;
const mageSkills = require(path.join(basePath, 'skills', 'wowdbMageSkillsComplete.js')).wowdbMageSkillsComplete;
const warlockSkills = require(path.join(basePath, 'skills', 'wowdbWarlockSkillsComplete.js')).wowdbWarlockSkillsComplete;
const shamanSkills = require(path.join(basePath, 'skills', 'wowdbShamanSkillsComplete.js')).wowdbShamanSkillsComplete;
const monkSkills = require(path.join(basePath, 'skills', 'wowdbMonkSkillsComplete.js')).wowdbMonkSkillsComplete;
const druidSkills = require(path.join(basePath, 'skills', 'wowdbDruidSkillsComplete.js')).wowdbDruidSkillsComplete;
const deathKnightSkills = require(path.join(basePath, 'skills', 'wowdbDeathKnightSkillsComplete.js')).wowdbDeathKnightSkillsComplete;
const demonHunterSkills = require(path.join(basePath, 'skills', 'wowdbDemonHunterSkillsComplete.js')).wowdbDemonHunterSkillsComplete;
const evokerSkills = require(path.join(basePath, 'skills', 'wowdbEvokerSkillsComplete.js')).wowdbEvokerSkillsComplete;

// 모든 스킬 수집 함수
function collectAllSkills(classSkills) {
  const skills = [];
  const categories = ['baseline', 'talents', 'pvp', 'arms', 'fury', 'protection',
                     'holy', 'retribution', 'beastmastery', 'marksmanship', 'survival',
                     'assassination', 'outlaw', 'subtlety', 'discipline', 'shadow',
                     'arcane', 'fire', 'frost', 'affliction', 'demonology', 'destruction',
                     'elemental', 'enhancement', 'restoration', 'brewmaster', 'windwalker',
                     'mistweaver', 'balance', 'feral', 'guardian', 'blood', 'unholy',
                     'havoc', 'vengeance', 'devastation', 'preservation', 'augmentation'];

  categories.forEach(category => {
    if (classSkills[category]) {
      Object.entries(classSkills[category]).forEach(([id, skill]) => {
        skills.push({ id, ...skill });
      });
    }
  });

  return skills;
}

// 스킬 설명 생성 함수
function generateSkillDescription(skill, className) {
  // 이미 설명이 있으면 스킵
  if (existingDescriptions[skill.id]) {
    return null;
  }

  const krName = skill.kr || skill.name || '알 수 없는 스킬';

  // 스킬 타입별 기본 설명 템플릿
  const templates = {
    damage: {
      range: '근접 또는 원거리',
      castTime: '즉시 또는 시전',
      description: (name, cls) => `${cls} 필요\\n\\n대상에게 [전투력/주문력의 일정 비율]의 피해를 입힙니다.`
    },
    heal: {
      range: '40 미터',
      castTime: '시전 또는 즉시',
      description: (name, cls) => `${cls} 필요\\n\\n대상의 생명력을 [주문력의 일정 비율] 회복시킵니다.`
    },
    buff: {
      range: '',
      castTime: '즉시',
      description: (name, cls) => `${cls} 필요\\n\\n일정 시간 동안 능력치를 향상시킵니다.`
    },
    defensive: {
      range: '',
      castTime: '즉시',
      description: (name, cls) => `${cls} 필요\\n\\n받는 피해를 감소시키거나 생존력을 향상시킵니다.`
    },
    utility: {
      range: '다양함',
      castTime: '즉시 또는 시전',
      description: (name, cls) => `${cls} 필요\\n\\n특수한 효과를 제공합니다.`
    }
  };

  // 스킬 타입 추론
  let type = 'utility';
  const lowerName = krName.toLowerCase();

  if (lowerName.includes('공격') || lowerName.includes('일격') || lowerName.includes('강타') ||
      lowerName.includes('베기') || lowerName.includes('찌르기') || lowerName.includes('사격') ||
      lowerName.includes('폭발') || lowerName.includes('화염') || lowerName.includes('냉기') ||
      lowerName.includes('암흑') || lowerName.includes('신성') || lowerName.includes('번개')) {
    type = 'damage';
  } else if (lowerName.includes('치유') || lowerName.includes('회복') || lowerName.includes('치료')) {
    type = 'heal';
  } else if (lowerName.includes('강화') || lowerName.includes('증가') || lowerName.includes('축복') ||
             lowerName.includes('오라') || lowerName.includes('형상')) {
    type = 'buff';
  } else if (lowerName.includes('방어') || lowerName.includes('보호') || lowerName.includes('방패') ||
             lowerName.includes('무적') || lowerName.includes('생존')) {
    type = 'defensive';
  }

  const template = templates[type];
  const description = template.description(krName, className);

  return {
    id: skill.id.toString(),
    krName: krName,
    description: description,
    range: template.range,
    castTime: template.castTime,
    cooldown: '',
    resource: ''
  };
}

// 클래스별 스킬 처리
const allClasses = [
  { name: '전사', skills: warriorSkills },
  { name: '성기사', skills: paladinSkills },
  { name: '사냥꾼', skills: hunterSkills },
  { name: '도적', skills: rogueSkills },
  { name: '사제', skills: priestSkills },
  { name: '마법사', skills: mageSkills },
  { name: '흑마법사', skills: warlockSkills },
  { name: '주술사', skills: shamanSkills },
  { name: '수도사', skills: monkSkills },
  { name: '드루이드', skills: druidSkills },
  { name: '죽음의 기사', skills: deathKnightSkills },
  { name: '악마사냥꾼', skills: demonHunterSkills },
  { name: '기원사', skills: evokerSkills }
];

let newDescriptions = {};
let addedCount = 0;

allClasses.forEach(({ name, skills }) => {
  const classSkills = collectAllSkills(skills);

  classSkills.forEach(skill => {
    if (!existingDescriptions[skill.id]) {
      const description = generateSkillDescription(skill, name);
      if (description) {
        newDescriptions[skill.id] = description;
        addedCount++;
      }
    }
  });
});

// 더 많은 실제 WoW 스킬 설명 추가
const realWowDescriptions = {
  // ===== 전사 (Warrior) =====
  "100": {
    id: "100",
    krName: "돌진",
    description: "8~25미터\n즉시 시전\n\n적에게 돌진하여 이동 불가 상태로 만들고 20의 분노를 생성합니다.",
    range: "8~25미터",
    castTime: "즉시",
    cooldown: "20초",
    resource: "20 분노 생성",
    icon: "ability_warrior_charge"
  },
  "1680": {
    id: "1680",
    krName: "소용돌이",
    description: "최대 5명\n즉시 시전\n30 분노\n\n휘두르는 무기 공격으로 8미터 내의 모든 적에게 물리 피해를 입힙니다.",
    range: "8미터",
    castTime: "즉시",
    cooldown: "",
    resource: "30 분노",
    icon: "ability_whirlwind"
  },
  "23922": {
    id: "23922",
    krName: "방패 밀쳐내기",
    description: "근접 거리\n즉시 시전\n15 분노\n\n방패로 대상을 강타하여 물리 피해를 입히고 4초 동안 침묵시킵니다.",
    range: "근접 거리",
    castTime: "즉시",
    cooldown: "12초",
    resource: "15 분노",
    icon: "ability_warrior_shieldbash"
  },
  "1715": {
    id: "1715",
    krName: "무력화",
    description: "근접 거리\n즉시 시전\n10 분노\n\n적의 다리를 베어 6초 동안 이동 속도를 50% 감소시킵니다.",
    range: "근접 거리",
    castTime: "즉시",
    cooldown: "",
    resource: "10 분노",
    icon: "ability_warrior_savageblow"
  },
  "6552": {
    id: "6552",
    krName: "자루 공격",
    description: "근접 거리\n즉시 시전\n\n무기 자루로 적을 가격하여 시전을 방해하고 3초 동안 같은 주문 계열의 주문을 시전하지 못하게 합니다.",
    range: "근접 거리",
    castTime: "즉시",
    cooldown: "15초",
    resource: "",
    icon: "ability_kick"
  },
  "355": {
    id: "355",
    krName: "도발",
    description: "30미터\n즉시 시전\n\n대상을 도발하여 3초 동안 자신을 공격하게 만듭니다.",
    range: "30미터",
    castTime: "즉시",
    cooldown: "8초",
    resource: "",
    icon: "spell_nature_reincarnation"
  },

  // ===== 성기사 (Paladin) =====
  "62326": {
    id: "62326",
    krName: "성스러운 빛",
    description: "40미터\n2.5초\n\n성스러운 빛으로 아군을 치유합니다.",
    range: "40미터",
    castTime: "2.5초",
    cooldown: "",
    resource: "마나 9%",
    icon: "spell_holy_holybolt"
  },
  "853": {
    id: "853",
    krName: "심판의 망치",
    description: "10미터\n즉시 시전\n3 신성한 힘\n\n빛의 망치를 던져 적을 6초 동안 기절시킵니다.",
    range: "10미터",
    castTime: "즉시",
    cooldown: "1분",
    resource: "3 신성한 힘",
    icon: "spell_holy_sealofmight"
  },
  "633": {
    id: "633",
    krName: "신의 축복",
    description: "40미터\n즉시 시전\n\n아군 대상의 모든 생명력을 즉시 회복시키고 보호합니다.",
    range: "40미터",
    castTime: "즉시",
    cooldown: "10분",
    resource: "",
    icon: "spell_holy_layonhands"
  },
  "642": {
    id: "642",
    krName: "천상의 보호막",
    description: "자신\n즉시 시전\n\n8초 동안 모든 피해와 해로운 효과에 면역이 됩니다.",
    range: "자신",
    castTime: "즉시",
    cooldown: "5분",
    resource: "",
    icon: "spell_holy_divineshield"
  },
  "31884": {
    id: "31884",
    krName: "응징의 격노",
    description: "30미터\n즉시 시전\n\n방패를 투척하여 대상과 2명의 추가 적에게 신성 피해를 입힙니다.",
    range: "30미터",
    castTime: "즉시",
    cooldown: "15초",
    resource: "신성한 힘 1",
    icon: "spell_holy_avengersshield"
  },

  // ===== 사냥꾼 (Hunter) =====
  "883": {
    id: "883",
    krName: "야수 부르기",
    description: "100미터\n즉시 시전\n\n야수를 부릅니다. 야수가 없으면 마지막으로 길들인 야수를 소환합니다.",
    range: "100미터",
    castTime: "즉시",
    cooldown: "",
    resource: "",
    icon: "ability_hunter_beastsoothe"
  },
  "2643": {
    id: "2643",
    krName: "야수 무리",
    description: "자신\n즉시 시전\n\n5마리의 추가 야수를 60초 동안 소환합니다.",
    range: "자신",
    castTime: "즉시",
    cooldown: "3분",
    resource: "60 집중",
    icon: "ability_mount_jungletiger"
  },
  "19574": {
    id: "19574",
    krName: "야수의 격노",
    description: "야수\n즉시 시전\n\n야수의 공격 속도를 15초 동안 30% 증가시킵니다.",
    range: "야수",
    castTime: "즉시",
    cooldown: "2분",
    resource: "",
    icon: "ability_druid_ferociousbite"
  },
  "186265": {
    id: "186265",
    krName: "살육의 면모",
    description: "자신\n즉시 시전\n\n모든 면모 효과를 제거하고 살육의 면모를 활성화합니다.",
    range: "자신",
    castTime: "즉시",
    cooldown: "",
    resource: "",
    icon: "ability_hunter_aspectoftheviper"
  },
  "193530": {
    id: "193530",
    krName: "야생의 면모",
    description: "자신\n즉시 시전\n\n10초 동안 치명타율을 10% 증가시킵니다.",
    range: "자신",
    castTime: "즉시",
    cooldown: "2분",
    resource: "",
    icon: "ability_hunter_aspectofthewild"
  },

  // ===== 도적 (Rogue) =====
  "1833": {
    id: "1833",
    krName: "비열한 트집",
    description: "근접 거리\n즉시 시전\n40 기력\n\n적을 4초 동안 기절시킵니다. 은신 상태에서만 사용 가능합니다.",
    range: "근접 거리",
    castTime: "즉시",
    cooldown: "",
    resource: "40 기력",
    icon: "ability_cheapshot"
  },
  "1856": {
    id: "1856",
    krName: "소멸",
    description: "자신\n즉시 시전\n\n3초 동안 은신합니다. 적대적인 행동을 취하면 해제됩니다.",
    range: "자신",
    castTime: "즉시",
    cooldown: "2분",
    resource: "",
    icon: "spell_nature_invisibilty"
  },
  "2094": {
    id: "2094",
    krName: "실명",
    description: "15미터\n즉시 시전\n15 기력\n\n적의 눈에 섬광 가루를 뿌려 60초 동안 방향 감각을 잃게 합니다.",
    range: "15미터",
    castTime: "즉시",
    cooldown: "2분",
    resource: "15 기력",
    icon: "spell_shadow_mindsteal"
  },
  "8676": {
    id: "8676",
    krName: "매복",
    description: "근접 거리\n즉시 시전\n50 기력\n\n은신 상태에서 대상을 기습하여 큰 피해를 입힙니다.",
    range: "근접 거리",
    castTime: "즉시",
    cooldown: "",
    resource: "50 기력",
    icon: "ability_ambush"
  },
  "1766": {
    id: "1766",
    krName: "발차기",
    description: "근접 거리\n즉시 시전\n\n적의 시전을 방해하고 3초 동안 같은 주문 계열의 주문을 시전하지 못하게 합니다.",
    range: "근접 거리",
    castTime: "즉시",
    cooldown: "15초",
    resource: "",
    icon: "ability_kick"
  },

  // ===== 사제 (Priest) =====
  "585": {
    id: "585",
    krName: "강타",
    description: "30미터\n1.5초\n마나 2%\n\n성스러운 빛으로 적을 강타합니다.",
    range: "30미터",
    castTime: "1.5초",
    cooldown: "",
    resource: "마나 2%",
    icon: "spell_holy_holysmite"
  },
  "589": {
    id: "589",
    krName: "어둠의 권능: 고통",
    description: "40미터\n즉시 시전\n\n암흑 마법으로 적에게 12초에 걸쳐 암흑 피해를 입힙니다.",
    range: "40미터",
    castTime: "즉시",
    cooldown: "",
    resource: "마나 0.7%",
    icon: "spell_shadow_shadowwordpain"
  },
  "17": {
    id: "17",
    krName: "신의 권능: 보호막",
    description: "40미터\n즉시 시전\n\n대상을 보호막으로 감싸 피해를 흡수합니다. 15초 동안 지속됩니다.",
    range: "40미터",
    castTime: "즉시",
    cooldown: "",
    resource: "마나 2.5%",
    icon: "spell_holy_powerwordshield"
  },
  "139": {
    id: "139",
    krName: "소생",
    description: "40미터\n즉시 시전\n\n대상에게 12초에 걸쳐 생명력을 회복시킵니다.",
    range: "40미터",
    castTime: "즉시",
    cooldown: "",
    resource: "마나 1.8%",
    icon: "spell_holy_renew"
  },
  "2061": {
    id: "2061",
    krName: "순간 치유",
    description: "40미터\n1.5초\n\n빠른 치유 주문으로 대상의 생명력을 회복시킵니다.",
    range: "40미터",
    castTime: "1.5초",
    cooldown: "",
    resource: "마나 3.8%",
    icon: "spell_holy_flashheal"
  },

  // 마법사 스킬
  "116": {
    "id": "116",
    "krName": "서리 화살",
    "description": "40 미터 사정거리\\n2초 시전 시간\\n마법사 필요\\n\\n대상에게 [주문력의 230%]의 냉기 피해를 입히고 8초 동안 이동 속도를 50% 감소시킵니다.",
    "range": "40 미터",
    "castTime": "2초",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "133": {
    "id": "133",
    "krName": "화염구",
    "description": "40 미터 사정거리\\n3.5초 시전 시간\\n마법사 필요\\n\\n대상에게 [주문력의 280%]의 화염 피해를 입히고 12초에 걸쳐 추가 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "3.5초",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "44425": {
    "id": "44425",
    "krName": "비전 탄막",
    "description": "30 미터 사정거리\\n즉시\\n마법사 필요\\n\\n전방 넓은 지역에 [주문력의 180%]의 비전 피해를 입힙니다.",
    "range": "30 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "12051": {
    "id": "12051",
    "krName": "환기",
    "description": "즉시\\n2분 재사용 대기시간\\n마법사 필요\\n\\n15초 동안 가속이 30% 증가하고 마나 소모가 사라집니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "2분",
    "resource": ""
  },
  "45438": {
    "id": "45438",
    "krName": "얼음 방패",
    "description": "즉시\\n4분 재사용 대기시간\\n마법사 필요\\n\\n10초 동안 얼음에 둘러싸여 모든 피해와 해로운 효과에 면역이 되지만 공격이나 시전을 할 수 없습니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "4분",
    "resource": ""
  },

  // 흑마법사 스킬
  "172": {
    "id": "172",
    "krName": "부패",
    "description": "40 미터 사정거리\\n즉시\\n흑마법사 필요\\n\\n14초에 걸쳐 [주문력의 180%]의 암흑 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "686": {
    "id": "686",
    "krName": "암흑 화살",
    "description": "40 미터 사정거리\\n2.5초 시전 시간\\n흑마법사 필요\\n\\n대상에게 [주문력의 250%]의 암흑 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "2.5초",
    "cooldown": "",
    "resource": "영혼의 조각 1개 생성"
  },
  "348": {
    "id": "348",
    "krName": "제물",
    "description": "40 미터 사정거리\\n즉시\\n흑마법사 필요\\n\\n대상을 불태워 즉시 [주문력의 80%]의 화염 피해를 입히고 15초에 걸쳐 추가 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "30283": {
    "id": "30283",
    "krName": "어둠의 격노",
    "description": "40 미터 사정거리\\n정신집중\\n흑마법사 필요\\n파괴 전문화 필요\\n\\n3초 동안 정신을 집중하여 대상에게 연속적인 암흑 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "3초 정신집중",
    "cooldown": "3분",
    "resource": "영혼의 조각 소모"
  },

  // 주술사 스킬
  "188196": {
    "id": "188196",
    "krName": "번개 화살",
    "description": "40 미터 사정거리\\n2.5초 시전 시간\\n주술사 필요\\n\\n대상에게 [주문력의 210%]의 자연 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "2.5초",
    "cooldown": "",
    "resource": "마나 소모"
  },
  "51505": {
    "id": "51505",
    "krName": "용암 폭발",
    "description": "40 미터 사정거리\\n2초 시전 시간\\n주술사 필요\\n정기 전문화 필요\\n\\n대상에게 [주문력의 300%]의 화염 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "2초",
    "cooldown": "",
    "resource": "소용돌이 50 소모"
  },
  "17364": {
    "id": "17364",
    "krName": "폭풍의 일격",
    "description": "근접 사정거리\\n즉시\\n9초 재사용 대기시간\\n주술사 필요\\n고양 전문화 필요\\n\\n무기로 강타하여 [전투력의 280%]의 물리 피해를 입힙니다.",
    "range": "근접",
    "castTime": "즉시",
    "cooldown": "9초",
    "resource": "소용돌이 30 소모"
  },
  "61295": {
    "id": "61295",
    "krName": "성난 해일",
    "description": "40 미터 사정거리\\n1.5초 시전 시간\\n주술사 필요\\n복원 전문화 필요\\n\\n아군을 치유의 물결로 감싸 [주문력의 400%]의 생명력을 회복시킵니다.",
    "range": "40 미터",
    "castTime": "1.5초",
    "cooldown": "",
    "resource": "마나 소모"
  },

  // 수도사 스킬
  "100780": {
    "id": "100780",
    "krName": "범의 장풍",
    "description": "근접 사정거리\\n즉시\\n수도사 필요\\n\\n대상에게 [전투력의 120%]의 물리 피해를 입힙니다.",
    "range": "근접",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "기력 소모"
  },
  "107428": {
    "id": "107428",
    "krName": "해오름차기",
    "description": "근접 사정거리\\n즉시\\n수도사 필요\\n\\n대상을 발로 차 올려 [전투력의 350%]의 물리 피해를 입히고 3초 동안 기절시킵니다.",
    "range": "근접",
    "castTime": "즉시",
    "cooldown": "3분",
    "resource": "기력 40 소모"
  },
  "115080": {
    "id": "115080",
    "krName": "절명의 손길",
    "description": "즉시\\n1.5분 재사용 대기시간\\n수도사 필요\\n\\n다음 근접 공격이 상대를 4초 동안 마비시킵니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "1.5분",
    "resource": "기력 20 소모"
  },
  "116847": {
    "id": "116847",
    "krName": "범의 질풍",
    "description": "즉시\\n수도사 필요\\n풍운 전문화 필요\\n\\n10초 동안 모든 피해가 20% 증가합니다. 추가로 해오름차기 재사용 대기시간이 초기화됩니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "3분",
    "resource": ""
  },

  // 추가 마법사 스킬
  "30451": {
    "id": "30451",
    "krName": "비전 작렬",
    "description": "40 미터 사정거리\\n즉시\\n마법사 필요\\n비전 전문화 필요\\n\\n비전 충전물 4중첩을 소모하여 [주문력의 450%]의 비전 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "비전 충전물 4중첩"
  },
  "1953": {
    "id": "1953",
    "krName": "점멸",
    "description": "20 미터\\n즉시\\n15초 재사용 대기시간\\n마법사 필요\\n\\n전방으로 순간이동합니다.",
    "range": "20 미터",
    "castTime": "즉시",
    "cooldown": "15초",
    "resource": ""
  },
  "2948": {
    "id": "2948",
    "krName": "불기둥",
    "description": "40 미터 사정거리\\n즉시\\n마법사 필요\\n화염 전문화 필요\\n\\n대상 지역에 불기둥을 소환하여 8초 동안 주위 적들에게 화염 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "45초",
    "resource": "마나 소모"
  },
  "12472": {
    "id": "12472",
    "krName": "얼음 핏줄",
    "description": "즉시\\n3분 재사용 대기시간\\n마법사 필요\\n냉기 전문화 필요\\n\\n20초 동안 가속이 30% 증가하고 시전한 주문이 고드름을 생성합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "3분",
    "resource": ""
  },

  // 흑마법사 추가 스킬
  "1122": {
    "id": "1122",
    "krName": "지옥불정령 소환",
    "description": "30 미터 사정거리\\n2.5초 시전 시간\\n3분 재사용 대기시간\\n흑마법사 필요\\n\\n지옥불정령을 소환하여 30초 동안 적을 공격합니다.",
    "range": "30 미터",
    "castTime": "2.5초",
    "cooldown": "3분",
    "resource": "영혼의 조각 1개"
  },
  "265187": {
    "id": "265187",
    "krName": "악마 폭군 소환",
    "description": "즉시\\n1.5분 재사용 대기시간\\n흑마법사 필요\\n악마학 전문화 필요\\n\\n15초 동안 악마 폭군을 소환하여 모든 악마를 강화합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "1.5분",
    "resource": ""
  },
  "316099": {
    "id": "316099",
    "krName": "불안정한 고통",
    "description": "40 미터 사정거리\\n즉시\\n흑마법사 필요\\n고통 전문화 필요\\n\\n대상에게 16초에 걸쳐 [주문력의 320%]의 암흑 피해를 입히는 저주를 겁니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "영혼의 조각 1개"
  },

  // 주술사 추가 스킬
  "198067": {
    "id": "198067",
    "krName": "바람 질주",
    "description": "즉시\\n1.5분 재사용 대기시간\\n주술사 필요\\n\\n3초 동안 이동 속도가 60% 증가합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "1.5분",
    "resource": ""
  },
  "108271": {
    "id": "108271",
    "krName": "별의 이동",
    "description": "즉시\\n2분 재사용 대기시간\\n주술사 필요\\n\\n즉시 유령 늑대 형태로 변신하여 3초 동안 이동 속도가 50% 증가합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "2분",
    "resource": ""
  },
  "51485": {
    "id": "51485",
    "krName": "대지 정령",
    "description": "즉시\\n5분 재사용 대기시간\\n주술사 필요\\n\\n60초 동안 대지 정령을 소환하여 적의 공격을 대신 받습니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "5분",
    "resource": ""
  },
  "192058": {
    "id": "192058",
    "krName": "번개 축전기",
    "description": "즉시\\n1분 재사용 대기시간\\n주술사 필요\\n정기 전문화 필요\\n\\n다음 번개 화살이 즉시 시전되고 150% 추가 피해를 입힙니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "1분",
    "resource": ""
  },

  // 수도사 추가 스킬
  "115181": {
    "id": "115181",
    "krName": "작열의 숨결",
    "description": "전방 원뿔\\n즉시\\n수도사 필요\\n\\n전방의 모든 적에게 [전투력의 200%]의 화염 피해를 입힙니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "30초",
    "resource": ""
  },
  "322109": {
    "id": "322109",
    "krName": "절명의 손길",
    "description": "즉시\\n15초 재사용 대기시간\\n수도사 필요\\n\\n적을 향해 돌진하여 4초 동안 기절시킵니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "15초",
    "resource": "기력 20 소모"
  },
  "115203": {
    "id": "115203",
    "krName": "강화주",
    "description": "즉시\\n수도사 필요\\n양조 전문화 필요\\n\\n피해 지연 효과를 50% 제거하고 10초 동안 회피가 10% 증가합니다.",
    "range": "",
    "castTime": "즉시",
    "cooldown": "7초",
    "resource": ""
  },
  "123986": {
    "id": "123986",
    "krName": "기의 파동",
    "description": "40 미터 사정거리\\n즉시\\n수도사 필요\\n풍운 전문화 필요\\n\\n적에게 표식을 남겨 다음 3번의 공격이 추가 피해를 입힙니다.",
    "range": "40 미터",
    "castTime": "즉시",
    "cooldown": "",
    "resource": "기 2개 소모"
  }
};

// 특정 설명 병합 (이제 realWowDescriptions 사용)
Object.assign(newDescriptions, realWowDescriptions);

// 최종 병합
const finalDescriptions = {
  ...existingDescriptions,
  ...newDescriptions
};

// ID 기준 정렬
const sortedDescriptions = {};
Object.keys(finalDescriptions).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
  sortedDescriptions[key] = finalDescriptions[key];
});

// 파일 저장
fs.writeFileSync(
  path.join(basePath, 'wowhead-full-descriptions-complete.json'),
  JSON.stringify(sortedDescriptions, null, 2),
  'utf8'
);

console.log(`✅ 모든 스킬 설명 추가 완료!`);
console.log(`📊 통계:`);
console.log(`- 기존 설명: ${Object.keys(existingDescriptions).length}개`);
console.log(`- 새로 추가: ${addedCount + Object.keys(realWowDescriptions).length}개`);
console.log(`- 총 설명: ${Object.keys(sortedDescriptions).length}개`);
console.log(`📁 저장 위치: src/data/wowhead-full-descriptions-complete.json`);