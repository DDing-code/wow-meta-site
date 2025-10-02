// TWW Season 3 사제 스킬 데이터
// The War Within 11.0.5 - 시즌 3
// PvP 특성 제외, 현재 활성화된 스킬만 포함
// 패시브 특성 포함

export const wowdbPriestSkillsComplete = {
  "baseline": {
    "17": {
      "name": "Power Word: Shield",
      "kr": "신의 권능: 보호막",
      "level": 1,
      "type": "ability"
    },
    "139": {
      "name": "Renew",
      "kr": "소생",
      "level": 1,
      "type": "ability"
    },
    "527": {
      "name": "Purify",
      "kr": "정화",
      "level": 1,
      "type": "ability"
    },
    "585": {
      "name": "Smite",
      "kr": "성스러운 일격",
      "level": 1,
      "type": "ability"
    },
    "2060": {
      "name": "Heal",
      "kr": "치유",
      "level": 1,
      "type": "ability"
    },
    "2061": {
      "name": "Flash Heal",
      "kr": "순간 치유",
      "level": 1,
      "type": "ability"
    }
  },
  "holy": {
    "2050": {
      "name": "Holy Word: Serenity",
      "kr": "신성한 언령: 평온",
      "level": 10,
      "type": "ability"
    },
    "34861": {
      "name": "Holy Word: Sanctify",
      "kr": "신성한 언령: 성화",
      "level": 10,
      "type": "ability"
    },
    "64843": {
      "name": "Divine Hymn",
      "kr": "천상의 찬가",
      "level": 10,
      "type": "ability"
    }
  },
  "shadow": {
    "8092": {
      "name": "Mind Blast",
      "kr": "정신 분열",
      "level": 10,
      "type": "ability"
    },
    "15407": {
      "name": "Mind Flay",
      "kr": "정신 채찍",
      "level": 10,
      "type": "ability"
    },
    "32379": {
      "name": "Shadow Word: Death",
      "kr": "어둠의 권능: 죽음",
      "level": 10,
      "type": "ability"
    },
    "228260": {
      "name": "Void Eruption",
      "kr": "공허 분출",
      "level": 10,
      "type": "ability"
    }
  },
  "discipline": {
    "47536": {
      "name": "Rapture",
      "kr": "환희",
      "level": 10,
      "type": "ability"
    },
    "47540": {
      "name": "Penance",
      "kr": "고해",
      "level": 10,
      "type": "ability"
    },
    "194509": {
      "name": "Power Word: Radiance",
      "kr": "신의 권능: 광휘",
      "level": 10,
      "type": "ability"
    }
  },
  "heroTalents": {
    "447444": {
      "name": "Entropic Rift",
      "kr": "엔트로피 균열",
      "tree": "Voidweaver",
      "level": 70,
      "type": "heroTalent"
    },
    "449882": {
      "name": "Premonition",
      "kr": "예감",
      "tree": "Oracle",
      "level": 70,
      "type": "heroTalent"
    },
    "453570": {
      "name": "Perfected Form",
      "kr": "완성된 형태",
      "tree": "Archon",
      "level": 70,
      "type": "heroTalent"
    }
  },
  "talents": {
    "586": {
      "name": "Fade",
      "kr": "소실",
      "type": "passive"
    },
    "15237": {
      "name": "Holy Nova",
      "kr": "신성한 폭발",
      "type": "passive"
    },
    "20711": {
      "name": "Spirit of Redemption",
      "kr": "구원의 영혼",
      "type": "passive"
    },
    "47540": {
      "name": "Penance",
      "kr": "고해",
      "spec": "discipline",
      "type": "passive"
    },
    "64843": {
      "name": "Divine Hymn",
      "kr": "천상의 찬가",
      "type": "passive"
    },
    "64901": {
      "name": "Symbol of Hope",
      "kr": "희망의 상징",
      "spec": "holy",
      "type": "passive"
    },
    "109142": {
      "name": "Light's Inspiration",
      "kr": "빛의 영감",
      "type": "passive"
    },
    "109175": {
      "name": "Divine Insight",
      "kr": "천상의 통찰",
      "spec": "discipline",
      "type": "passive"
    },
    "193157": {
      "name": "Benediction",
      "kr": "축복",
      "type": "passive"
    },
    "194509": {
      "name": "Power Word: Radiance",
      "kr": "신의 권능: 광휘",
      "spec": "discipline",
      "type": "passive"
    },
    "200183": {
      "name": "Apotheosis",
      "kr": "신격화",
      "spec": "holy",
      "type": "passive"
    },
    "205065": {
      "name": "Void Eruption",
      "kr": "공허 분출",
      "spec": "shadow",
      "type": "passive"
    },
    "228260": {
      "name": "Void Eruption",
      "kr": "공허 분출",
      "spec": "shadow",
      "type": "passive"
    },
    "265202": {
      "name": "Holy Word: Salvation",
      "kr": "신성한 명령: 구원",
      "spec": "holy",
      "type": "passive"
    },
    "314867": {
      "name": "Shadow Covenant",
      "kr": "암흑 서약",
      "spec": "discipline",
      "type": "passive"
    },
    "372835": {
      "name": "Lightweaver",
      "kr": "빛 엮기",
      "spec": "holy",
      "type": "passive"
    },
    "391109": {
      "name": "Dark Ascension",
      "kr": "어둠의 승천",
      "spec": "shadow",
      "type": "passive"
    },
    "391154": {
      "name": "Holy Ward",
      "kr": "신성한 수호",
      "type": "passive"
    },
    "391403": {
      "name": "Mind Spike",
      "kr": "정신 쐐기",
      "spec": "shadow",
      "type": "passive"
    }
  }
};

// 스킬 검색 함수
export function getWowDBPriestSkill(skillId) {
  const categories = Object.keys(wowdbPriestSkillsComplete);

  for (const category of categories) {
    if (wowdbPriestSkillsComplete[category] && wowdbPriestSkillsComplete[category][skillId]) {
      return {
        ...wowdbPriestSkillsComplete[category][skillId],
        category,
        id: skillId
      };
    }
  }

  return null;
}