// TWW Season 3 패시브 특성 추가 스크립트
const fs = require('fs');
const path = require('path');

// 전사 패시브 특성들
const warriorPassives = {
  // 클래스 트리 패시브
  "12328": { name: "Sweeping Strikes", kr: "휩쓸기 일격", type: "passive" },
  "29725": { name: "Sudden Death", kr: "급작스런 죽음", type: "passive" },
  "58351": { name: "Blood and Thunder", kr: "피와 천둥", type: "passive" },
  "103827": { name: "Double Time", kr: "이중 시간", type: "passive" },
  "202751": { name: "Anger Management", kr: "분노 조절", type: "passive" },
  "262150": { name: "Frothing Berserker", kr: "광분하는 광전사", type: "passive" },
  "280392": { name: "Meat Cleaver", kr: "고기 절단기", type: "passive" },
  "383103": { name: "Fueled by Violence", kr: "폭력에 의한 연료", type: "passive" },
  "384100": { name: "Berserker Stance", kr: "광전사 태세", type: "passive" },
  "384318": { name: "Desperate Strength", kr: "필사적인 힘", type: "passive" },
  "385840": { name: "Weapon Mastery", kr: "무기 숙련", type: "passive" },
  "386196": { name: "Berserker's Torment", kr: "광전사의 고통", type: "passive" },

  // 무기 전문화 패시브
  "260708": { name: "Sweeping Strikes", kr: "휩쓸기 일격", spec: "arms", type: "passive" },
  "262111": { name: "Mastery: Deep Wounds", kr: "특화: 깊은 상처", spec: "arms", type: "passive" },
  "316402": { name: "Martial Prowess", kr: "무술 기량", spec: "arms", type: "passive" },
  "383295": { name: "Valor in Victory", kr: "승리의 용맹", spec: "arms", type: "passive" },

  // 분노 전문화 패시브
  "206315": { name: "Massacre", kr: "대학살", spec: "fury", type: "passive" },
  "206333": { name: "Taste for Blood", kr: "피의 맛", spec: "fury", type: "passive" },
  "280721": { name: "Sudden Death", kr: "급작스런 죽음", spec: "fury", type: "passive" },
  "382946": { name: "Furious Bloodthirst", kr: "격노한 피의 갈증", spec: "fury", type: "passive" },
  "383433": { name: "Berserker's Might", kr: "광전사의 힘", spec: "fury", type: "passive" },
  "385840": { name: "Single-Minded Fury", kr: "한손 무기 분노", spec: "fury", type: "passive" },

  // 방어 전문화 패시브
  "202095": { name: "Vengeance", kr: "복수심", spec: "protection", type: "passive" },
  "203177": { name: "Heavy Repercussions", kr: "무거운 반격", spec: "protection", type: "passive" },
  "316428": { name: "Revenge!", kr: "복수!", spec: "protection", type: "passive" },
  "382940": { name: "Punish", kr: "응징", spec: "protection", type: "passive" },
  "385391": { name: "Improved Block", kr: "방패 막기 연마", spec: "protection", type: "passive" },
  "385704": { name: "Violent Outburst", kr: "폭력적 분출", spec: "protection", type: "passive" }
};

// 성기사 패시브 특성들
const paladinPassives = {
  // 클래스 트리 패시브
  "183415": { name: "Auras of the Resolute", kr: "결의의 오라", type: "passive" },
  "183416": { name: "Auras of Swift Vengeance", kr: "신속한 복수의 오라", type: "passive" },
  "183425": { name: "Devotion Aura", kr: "헌신의 오라", type: "passive" },
  "183435": { name: "Retribution Aura", kr: "응보의 오라", type: "passive" },
  "183778": { name: "Judgment of Light", kr: "빛의 심판", type: "passive" },
  "196926": { name: "Crusader's Might", kr: "성전사의 힘", type: "passive" },
  "204019": { name: "Blessed Champion", kr: "축복받은 용사", type: "passive" },
  "223817": { name: "Divine Purpose", kr: "신성한 목적", type: "passive" },
  "267344": { name: "Art of War", kr: "전쟁의 기술", type: "passive" },
  "374348": { name: "Judgment of Justice", kr: "정의의 심판", type: "passive" },

  // 신성 전문화 패시브
  "183997": { name: "Mastery: Lightbringer", kr: "특화: 빛의 인도자", spec: "holy", type: "passive" },
  "196923": { name: "Light of the Martyr", kr: "순교자의 빛", spec: "holy", type: "passive" },
  "200025": { name: "Beacon of Virtue", kr: "미덕의 봉화", spec: "holy", type: "passive" },
  "214202": { name: "Rule of Law", kr: "율법의 지배", spec: "holy", type: "passive" },

  // 보호 전문화 패시브
  "182559": { name: "Templar's Verdict", kr: "기사단의 선고", spec: "protection", type: "passive" },
  "204074": { name: "Righteous Protector", kr: "정의로운 보호자", spec: "protection", type: "passive" },
  "280375": { name: "Redoubt", kr: "보루", spec: "protection", type: "passive" },
  "385425": { name: "Barricade of Faith", kr: "신념의 방벽", spec: "protection", type: "passive" },

  // 징벌 전문화 패시브
  "184575": { name: "Blade of Justice", kr: "정의의 칼날", spec: "retribution", type: "passive" },
  "231895": { name: "Crusade", kr: "성전", spec: "retribution", type: "passive" },
  "267610": { name: "Righteous Verdict", kr: "정의로운 선고", spec: "retribution", type: "passive" },
  "383394": { name: "Expurgation", kr: "말소", spec: "retribution", type: "passive" }
};

// 사냥꾼 패시브 특성들
const hunterPassives = {
  // 클래스 트리 패시브
  "53184": { name: "Camouflage", kr: "위장", type: "passive" },
  "199483": { name: "Hunter's Mark", kr: "사냥꾼의 징표", type: "passive" },
  "199921": { name: "Trailblazer", kr: "길잡이", type: "passive" },
  "264656": { name: "Pathfinding", kr: "길찾기", type: "passive" },
  "378747": { name: "Born to Be Wild", kr: "야생의 본능", type: "passive" },
  "385985": { name: "Serrated Shots", kr: "톱니 사격", type: "passive" },

  // 야수 전문화 패시브
  "185789": { name: "Wild Call", kr: "야생의 부름", spec: "beastmastery", type: "passive" },
  "191384": { name: "Aspect of the Beast", kr: "야수의 상", spec: "beastmastery", type: "passive" },
  "257620": { name: "Multi-Shot", kr: "일제 사격", spec: "beastmastery", type: "passive" },
  "378007": { name: "Cobra Senses", kr: "코브라 감각", spec: "beastmastery", type: "passive" },

  // 사격 전문화 패시브
  "187131": { name: "Vulnerable", kr: "약점 노출", spec: "marksmanship", type: "passive" },
  "193468": { name: "Mastery: Sniper Training", kr: "특화: 저격수 훈련", spec: "marksmanship", type: "passive" },
  "231390": { name: "Trueshot", kr: "정조준", spec: "marksmanship", type: "passive" },
  "378905": { name: "Deadly Aim", kr: "치명적인 조준", spec: "marksmanship", type: "passive" },

  // 생존 전문화 패시브
  "186270": { name: "Raptor Strike", kr: "랩터 일격", spec: "survival", type: "passive" },
  "191334": { name: "Mastery: Spirit Bond", kr: "특화: 영혼 결속", spec: "survival", type: "passive" },
  "259495": { name: "Wildfire Infusion", kr: "야생불 주입", spec: "survival", type: "passive" },
  "385720": { name: "Bloodseeker", kr: "피추적자", spec: "survival", type: "passive" }
};

function addPassiveTalents() {
  // 전사 파일 업데이트
  const warriorPath = path.join(__dirname, 'src/data/skills/wowdbWarriorSkillsComplete.js');
  const warriorContent = fs.readFileSync(warriorPath, 'utf8');

  // export const 찾기
  const match = warriorContent.match(/export const wowdbWarriorSkillsComplete = ({[\s\S]*?});/);
  if (match) {
    const data = eval('(' + match[1] + ')');

    // talents 카테고리 추가 (패시브)
    if (!data.talents) {
      data.talents = {};
    }

    // 패시브 특성 추가
    Object.entries(warriorPassives).forEach(([id, skill]) => {
      data.talents[id] = skill;
    });

    // 파일 재작성
    const newContent = `// TWW Season 3 전사 스킬 데이터
// The War Within 11.0.5 - 시즌 3
// PvP 특성 제외, 현재 활성화된 스킬만 포함
// 패시브 특성 포함

export const wowdbWarriorSkillsComplete = ${JSON.stringify(data, null, 2)};

// 스킬 검색 함수
export function getWowDBWarriorSkill(skillId) {
  const categories = Object.keys(wowdbWarriorSkillsComplete);

  for (const category of categories) {
    if (wowdbWarriorSkillsComplete[category] && wowdbWarriorSkillsComplete[category][skillId]) {
      return {
        ...wowdbWarriorSkillsComplete[category][skillId],
        category,
        id: skillId
      };
    }
  }

  return null;
}

// 전체 스킬 개수
export function getWarriorSkillCount() {
  let count = 0;
  const categories = Object.keys(wowdbWarriorSkillsComplete);

  categories.forEach(category => {
    if (wowdbWarriorSkillsComplete[category]) {
      count += Object.keys(wowdbWarriorSkillsComplete[category]).length;
    }
  });

  return count;
}

// 전문화별 스킬 필터링
export function getWarriorSkillsBySpec(spec) {
  const specKey = spec?.toLowerCase().replace(/\\s+/g, '');
  if (!wowdbWarriorSkillsComplete[specKey]) {
    return [];
  }

  return Object.entries(wowdbWarriorSkillsComplete[specKey]).map(([id, skill]) => ({
    ...skill,
    id: parseInt(id),
    category: specKey
  }));
}`;

    fs.writeFileSync(warriorPath, newContent, 'utf8');
    console.log('✅ 전사 패시브 특성 추가 완료');
  }

  // 성기사 파일 업데이트
  const paladinPath = path.join(__dirname, 'src/data/skills/wowdbPaladinSkillsComplete.js');
  const paladinContent = fs.readFileSync(paladinPath, 'utf8');

  const paladinMatch = paladinContent.match(/export const wowdbPaladinSkillsComplete = ({[\s\S]*?});/);
  if (paladinMatch) {
    const data = eval('(' + paladinMatch[1] + ')');

    // talents 카테고리 추가 (패시브)
    if (!data.talents) {
      data.talents = {};
    }

    // 패시브 특성 추가
    Object.entries(paladinPassives).forEach(([id, skill]) => {
      data.talents[id] = skill;
    });

    // 파일 재작성
    const newContent = `// TWW Season 3 성기사 스킬 데이터
// The War Within 11.0.5 - 시즌 3
// PvP 특성 제외, 현재 활성화된 스킬만 포함
// 패시브 특성 포함

export const wowdbPaladinSkillsComplete = ${JSON.stringify(data, null, 2)};

// 스킬 검색 함수
export function getWowDBPaladinSkill(skillId) {
  const categories = Object.keys(wowdbPaladinSkillsComplete);

  for (const category of categories) {
    if (wowdbPaladinSkillsComplete[category] && wowdbPaladinSkillsComplete[category][skillId]) {
      return {
        ...wowdbPaladinSkillsComplete[category][skillId],
        category,
        id: skillId
      };
    }
  }

  return null;
}`;

    fs.writeFileSync(paladinPath, newContent, 'utf8');
    console.log('✅ 성기사 패시브 특성 추가 완료');
  }

  // 사냥꾼 파일 업데이트
  const hunterPath = path.join(__dirname, 'src/data/skills/wowdbHunterSkillsComplete.js');
  const hunterContent = fs.readFileSync(hunterPath, 'utf8');

  const hunterMatch = hunterContent.match(/export const wowdbHunterSkillsComplete = ({[\s\S]*?});/);
  if (hunterMatch) {
    const data = eval('(' + hunterMatch[1] + ')');

    // talents 카테고리 추가 (패시브)
    if (!data.talents) {
      data.talents = {};
    }

    // 패시브 특성 추가
    Object.entries(hunterPassives).forEach(([id, skill]) => {
      data.talents[id] = skill;
    });

    // 파일 재작성
    const newContent = `// TWW Season 3 사냥꾼 스킬 데이터
// The War Within 11.0.5 - 시즌 3
// PvP 특성 제외, 현재 활성화된 스킬만 포함
// 패시브 특성 포함

export const wowdbHunterSkillsComplete = ${JSON.stringify(data, null, 2)};

// 스킬 검색 함수
export function getWowDBHunterSkill(skillId) {
  const categories = Object.keys(wowdbHunterSkillsComplete);

  for (const category of categories) {
    if (wowdbHunterSkillsComplete[category] && wowdbHunterSkillsComplete[category][skillId]) {
      return {
        ...wowdbHunterSkillsComplete[category][skillId],
        category,
        id: skillId
      };
    }
  }

  return null;
}`;

    fs.writeFileSync(hunterPath, newContent, 'utf8');
    console.log('✅ 사냥꾼 패시브 특성 추가 완료');
  }
}

// 실행
addPassiveTalents();