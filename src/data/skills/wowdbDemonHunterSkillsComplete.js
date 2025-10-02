// TWW Season 3 악마사냥꾼 스킬 데이터
// The War Within 11.0.5 - 시즌 3
// PvP 특성 제외, 현재 활성화된 스킬만 포함
// 패시브 특성 포함

export const wowdbDemonHunterSkillsComplete = {
  "baseline": {
    "162243": {
      "name": "Demon's Bite",
      "kr": "악마의 이빨",
      "level": 1,
      "type": "ability"
    },
    "162794": {
      "name": "Chaos Strike",
      "kr": "혼돈의 일격",
      "level": 1,
      "type": "ability"
    },
    "188501": {
      "name": "Spectral Sight",
      "kr": "영혼 시야",
      "level": 1,
      "type": "ability"
    },
    "195072": {
      "name": "Fel Rush",
      "kr": "지옥 질주",
      "level": 1,
      "type": "ability"
    },
    "198013": {
      "name": "Eye Beam",
      "kr": "안광",
      "level": 1,
      "type": "ability"
    }
  },
  "havoc": {
    "185123": {
      "name": "Throw Glaive",
      "kr": "글레이브 투척",
      "level": 10,
      "type": "ability"
    },
    "191427": {
      "name": "Metamorphosis",
      "kr": "탈태",
      "level": 10,
      "type": "ability"
    },
    "201427": {
      "name": "Annihilation",
      "kr": "파멸",
      "level": 10,
      "type": "ability"
    },
    "258920": {
      "name": "Immolation Aura",
      "kr": "제물의 오라",
      "level": 10,
      "type": "ability"
    }
  },
  "vengeance": {
    "187827": {
      "name": "Metamorphosis",
      "kr": "탈태",
      "level": 10,
      "type": "ability"
    },
    "203782": {
      "name": "Shear",
      "kr": "칼날 베기",
      "level": 10,
      "type": "ability"
    },
    "204596": {
      "name": "Sigil of Flame",
      "kr": "화염의 인장",
      "level": 10,
      "type": "ability"
    },
    "228477": {
      "name": "Soul Cleave",
      "kr": "영혼 베어내기",
      "level": 10,
      "type": "ability"
    }
  },
  "heroTalents": {
    "442290": {
      "name": "Art of the Glaive",
      "kr": "글레이브의 기술",
      "tree": "Aldrachi Reaver",
      "level": 70,
      "type": "heroTalent"
    },
    "452415": {
      "name": "Demonsurge",
      "kr": "악마 쇄도",
      "tree": "Fel-Scarred",
      "level": 70,
      "type": "heroTalent"
    }
  },
  "talents": {
    "178940": {
      "name": "Shattered Souls",
      "kr": "산산조각난 영혼",
      "type": "passive"
    },
    "187827": {
      "name": "Metamorphosis",
      "kr": "탈태",
      "spec": "vengeance",
      "type": "passive"
    },
    "188499": {
      "name": "Blade Dance",
      "kr": "칼날 춤",
      "type": "passive"
    },
    "191427": {
      "name": "Metamorphosis",
      "kr": "탈태",
      "spec": "havoc",
      "type": "passive"
    },
    "195072": {
      "name": "Fel Rush",
      "kr": "지옥 질주",
      "type": "passive"
    },
    "196055": {
      "name": "Demon's Bite",
      "kr": "악마의 이빨",
      "type": "passive"
    },
    "198013": {
      "name": "Eye Beam",
      "kr": "눈빔",
      "spec": "havoc",
      "type": "passive"
    },
    "202137": {
      "name": "Sigil of Silence",
      "kr": "침묵의 인장",
      "spec": "vengeance",
      "type": "passive"
    },
    "202140": {
      "name": "Last Resort",
      "kr": "최후의 수단",
      "spec": "vengeance",
      "type": "passive"
    },
    "203720": {
      "name": "Demon Spikes",
      "kr": "악마 쐐기",
      "type": "passive"
    },
    "204596": {
      "name": "Sigil of Flame",
      "kr": "화염 인장",
      "type": "passive"
    },
    "211881": {
      "name": "Fel Eruption",
      "kr": "지옥 분출",
      "type": "passive"
    },
    "258920": {
      "name": "Immolation Aura",
      "kr": "제물의 오라",
      "spec": "havoc",
      "type": "passive"
    },
    "263642": {
      "name": "Fracture",
      "kr": "분열",
      "spec": "vengeance",
      "type": "passive"
    },
    "342817": {
      "name": "Glaive Tempest",
      "kr": "글레이브 폭풍",
      "spec": "havoc",
      "type": "passive"
    }
  }
};

// 스킬 검색 함수
export function getWowDBDemonHunterSkill(skillId) {
  const categories = Object.keys(wowdbDemonHunterSkillsComplete);

  for (const category of categories) {
    if (wowdbDemonHunterSkillsComplete[category] && wowdbDemonHunterSkillsComplete[category][skillId]) {
      return {
        ...wowdbDemonHunterSkillsComplete[category][skillId],
        category,
        id: skillId
      };
    }
  }

  return null;
}