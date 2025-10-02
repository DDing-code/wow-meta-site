// 전사 (Warrior) 스킬 데이터베이스
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)
// 최신 한국어 번역 적용

import { koreanTranslations } from '../koreanTranslations-11.2';

const warriorTranslations = koreanTranslations.warriorAbilities;

export const warriorSkills = {
  className: koreanTranslations.classes.warrior,
  classNameEn: 'Warrior',

  // 공통 스킬 (모든 전문화 사용 가능)
  common: {
    // 이동기
    [warriorTranslations.charge]: {
      id: 100,
      name: 'Charge',
      type: 'instant',
      cooldown: 20,
      range: 25,
      description: '적에게 빠르게 돌진하여 근접 전투를 시작합니다. 특성에 따라 대상을 기절시킬 수 있습니다.'
    },
    [warriorTranslations.heroicLeap]: {
      id: 6544,
      name: 'Heroic Leap',
      type: 'instant',
      cooldown: 45,
      range: 40,
      description: '대상 지역으로 도약하여 착지 시 5미터 내 적에게 피해를 입히고 짧은 기절을 유발합니다.'
    },

    // 방어/유틸리티
    [warriorTranslations.pummel]: {
      id: 6552,
      name: 'Pummel',
      type: 'instant',
      cooldown: 15,
      range: 5,
      description: '적의 시전 중인 주문을 차단하고 같은 계열 주문을 4초간 사용 불가능하게 합니다.'
    },
    [warriorTranslations.battleShout]: {
      id: 6673,
      name: 'Battle Shout',
      type: 'instant',
      description: '아군의 공격력을 5% 증가시킵니다. 공격대 전체에 적용됩니다.'
    },
    [warriorTranslations.rallyingCry]: {
      id: 97462,
      name: 'Rallying Cry',
      type: 'defensive',
      cooldown: 180,
      description: '10초간 모든 공격대원과 파티원의 최대 생명력을 15% 증가시킵니다.'
    },
    [warriorTranslations.berserkerRage]: {
      id: 18499,
      name: 'Berserker Rage',
      type: 'instant',
      cooldown: 60,
      description: '공포, 무력화, 이동 불가 효과에 면역이 됩니다.'
    },
    [warriorTranslations.victoryRush]: {
      id: 34428,
      name: 'Victory Rush',
      type: 'instant',
      description: '적을 처치한 후 사용 가능하며, 피해를 입히고 생명력을 회복합니다.'
    },
    [warriorTranslations.execute]: {
      id: 5308,
      name: 'Execute',
      type: 'instant',
      rage: 20,
      description: '생명력이 낮은 적에게 막대한 피해를 입힙니다.'
    },
    [warriorTranslations.hamstring]: {
      id: 1715,
      name: 'Hamstring',
      type: 'instant',
      rage: 10,
      description: '적의 이동 속도를 50% 감소시킵니다.'
    },
    [warriorTranslations.whirlwind]: {
      id: 1680,
      name: 'Whirlwind',
      type: 'instant',
      rage: 30,
      description: '주변 모든 적에게 물리 피해를 입힙니다.'
    },
    [warriorTranslations.heroicThrow]: {
      id: 57755,
      name: 'Heroic Throw',
      type: 'instant',
      cooldown: 6,
      range: 30,
      description: '무기를 던져 물리 피해를 입히고 위협 수준을 생성합니다.'
    },
    [warriorTranslations.intimidatingShout]: {
      id: 5246,
      name: 'Intimidating Shout',
      type: 'instant',
      cooldown: 90,
      description: '주변 적들을 8초간 공포에 질리게 합니다.'
    },
    [warriorTranslations.spellReflection]: {
      id: 23920,
      name: 'Spell Reflection',
      type: 'instant',
      cooldown: 25,
      description: '5초 동안 주문을 반사합니다.'
    },
    [warriorTranslations.berserkerStance]: {
      id: 2458,
      name: 'Berserker Stance',
      type: 'instant',
      description: '광폭한 태세로 전환합니다.'
    },
    [warriorTranslations.defensiveStance]: {
      id: 71,
      name: 'Defensive Stance',
      type: 'instant',
      description: '받는 피해를 20% 감소시키지만 입히는 피해도 10% 감소합니다.'
    },

    // 추가 공통 스킬
    '강타': {
      id: 1464,
      name: 'Slam',
      type: 'instant',
      rage: 20,
      description: '적에게 물리 피해를 입힙니다.'
    },
    '사기의 외침': {
      id: 1160,
      name: 'Demoralizing Shout',
      type: 'instant',
      cooldown: 45,
      description: '주변 적들의 공격력을 감소시킵니다.'
    },
    '광폭한 격노': {
      id: 18499,
      name: 'Berserker Rage',
      type: 'instant',
      cooldown: 60,
      description: '공포, 무력화, 이동 불가 효과에서 벗어납니다.'
    },
    '투신': {
      id: 107574,
      name: 'Avatar',
      type: 'instant',
      cooldown: 90,
      description: '20초간 변신하여 공격력이 증가하고 이동 방해 효과를 제거합니다.'
    },
    '도발': {
      id: 355,
      name: 'Taunt',
      type: 'instant',
      cooldown: 8,
      range: 30,
      description: '적이 3초간 자신을 공격하도록 강제합니다.'
    }
  },

  // 무기 전문화
  arms: {
    [warriorTranslations.mortalStrike]: {
      id: 12294,
      name: 'Mortal Strike',
      type: 'instant',
      cooldown: 6,
      rage: 30,
      description: '무기 공격력의 200% 피해를 입히고 대상이 받는 치유 효과를 10초간 50% 감소시킵니다.'
    },
    [warriorTranslations.colossusSmash]: {
      id: 167105,
      name: 'Colossus Smash',
      type: 'instant',
      cooldown: 45,
      description: '대상의 방어도를 무시하고 입히는 피해를 10초간 30% 증가시킵니다.'
    },
    [warriorTranslations.overpower]: {
      id: 7384,
      name: 'Overpower',
      type: 'instant',
      cooldown: 12,
      charges: 2,
      rage: 0,
      description: '즉시 무기 공격력의 140% 물리 피해를 입히고 다음 필사의 일격을 강화합니다.'
    },
    [warriorTranslations.bladestorm]: {
      id: 227847,
      name: 'Bladestorm',
      type: 'instant',
      cooldown: 90,
      channeled: 6,
      description: '6초간 회전하며 8미터 내 모든 적에게 지속적인 물리 피해를 입힙니다.'
    },
    [warriorTranslations.sweepingStrikes]: {
      id: 260708,
      name: 'Sweeping Strikes',
      type: 'instant',
      cooldown: 30,
      description: '12초간 단일 대상 공격이 근처 적 1명에게도 적중합니다.'
    },
    [warriorTranslations.dieByTheSword]: {
      id: 118038,
      name: 'Die by the Sword',
      type: 'instant',
      cooldown: 120,
      description: '8초간 받는 피해를 30% 감소시키고 무기막기 확률을 100% 증가시킵니다.'
    },
    [warriorTranslations.rend]: {
      id: 772,
      name: 'Rend',
      type: 'instant',
      rage: 30,
      talent: true,
      description: '15초간 출혈 피해를 입힙니다.'
    },
    [warriorTranslations.cleave]: {
      id: 845,
      name: 'Cleave',
      type: 'instant',
      rage: 20,
      description: '전방의 모든 적에게 물리 피해를 입힙니다.'
    },
    [warriorTranslations.warbreaker]: {
      id: 262161,
      name: 'Warbreaker',
      type: 'instant',
      cooldown: 45,
      talent: true,
      description: '범위 피해를 입히고 거인의 강타 효과를 적용합니다.'
    },
    [warriorTranslations.skullsplitter]: {
      id: 260643,
      name: 'Skullsplitter',
      type: 'instant',
      cooldown: 21,
      talent: true,
      description: '즉시 피해를 입히고 분노를 15 생성합니다.'
    },

    // 추가 무기 전문화 스킬
    '파괴자': {
      id: 152277,
      name: 'Ravager',
      type: 'instant',
      cooldown: 45,
      talent: true,
      description: '무기를 던져 12초간 지역 피해를 입힙니다.'
    },
    '요새의 창': {
      id: 376079,
      name: 'Spear of Bastion',
      type: 'instant',
      cooldown: 90,
      talent: true,
      description: '창을 던져 적을 꿰뚫고 지속 피해를 입힙니다.'
    },
    '고대의 여진': {
      id: 307865,
      name: 'Ancient Aftershock',
      type: 'instant',
      cooldown: 90,
      talent: true,
      description: '대지를 강타하여 전방에 충격파를 발생시킵니다.'
    }
  },

  // 분노 전문화
  fury: {
    [warriorTranslations.bloodthirst]: {
      id: 23881,
      name: 'Bloodthirst',
      type: 'instant',
      cooldown: 4.5,
      description: '무기 공격력의 100% 피해를 입히고 적중 시 격노 효과를 발동시킬 확률이 있습니다.'
    },
    [warriorTranslations.ragingBlow]: {
      id: 85288,
      name: 'Raging Blow',
      type: 'instant',
      charges: 2,
      cooldown: 8,
      description: '격노 상태에서만 사용 가능하며 양손 무기로 2회 연속 공격합니다.'
    },
    [warriorTranslations.rampage]: {
      id: 184367,
      name: 'Rampage',
      type: 'instant',
      rage: 80,
      description: '분노를 소모하여 4회 연속 공격하며 격노 상태를 활성화합니다.'
    },
    [warriorTranslations.enragedRegeneration]: {
      id: 184364,
      name: 'Enraged Regeneration',
      type: 'instant',
      cooldown: 120,
      description: '즉시 최대 생명력의 30%를 회복하고 8초간 받는 피해를 30% 감소시킵니다.'
    },
    [warriorTranslations.onslaught]: {
      id: 315720,
      name: 'Onslaught',
      type: 'instant',
      rage: 80,
      talent: true,
      description: '격노 중 사용 가능하며 연속 공격을 가합니다.'
    },
    [warriorTranslations.odynsFury]: {
      id: 385059,
      name: "Odyn's Fury",
      type: 'instant',
      cooldown: 45,
      talent: true,
      description: '전방의 모든 적에게 막대한 피해를 입히고 6초간 출혈 피해를 입힙니다.'
    }
  },

  // 방어 전문화
  protection: {
    [warriorTranslations.shieldSlam]: {
      id: 23922,
      name: 'Shield Slam',
      type: 'instant',
      cooldown: 9,
      rage: -15,
      description: '방패로 적을 강타하여 무기 공격력의 120% 피해를 입히고 15의 분노를 생성합니다.'
    },
    [warriorTranslations.shieldBlock]: {
      id: 2565,
      name: 'Shield Block',
      type: 'instant',
      charges: 2,
      cooldown: 16,
      rage: 30,
      description: '6초간 방패 막기 확률을 100% 증가시키고 막기 값을 상승시킵니다.'
    },
    [warriorTranslations.revenge]: {
      id: 6572,
      name: 'Revenge',
      type: 'instant',
      rage: -3,
      proc: true,
      description: '회피하거나 무기 막기 후 사용 가능합니다.'
    },
    [warriorTranslations.thunderClap]: {
      id: 6343,
      name: 'Thunder Clap',
      type: 'instant',
      cooldown: 6,
      rage: 5,
      description: '8미터 내 모든 적에게 피해를 입히고 10초간 이동 속도를 20% 감소시킵니다.'
    },
    [warriorTranslations.shockwave]: {
      id: 46968,
      name: 'Shockwave',
      type: 'instant',
      cooldown: 40,
      talent: true,
      description: '전방의 모든 적에게 피해를 입히고 2초간 기절시킵니다.'
    },
    [warriorTranslations.lastStand]: {
      id: 12975,
      name: 'Last Stand',
      type: 'instant',
      cooldown: 180,
      description: '최대 생명력을 15초간 30% 증가시키고 즉시 그만큼 치유합니다.'
    },
    [warriorTranslations.shieldWall]: {
      id: 871,
      name: 'Shield Wall',
      type: 'instant',
      cooldown: 240,
      description: '8초간 받는 모든 피해를 40% 감소시킵니다.'
    },
    [warriorTranslations.avatar]: {
      id: 401150,
      name: 'Avatar',
      type: 'instant',
      cooldown: 90,
      talent: true,
      description: '20초간 변신하여 피해를 20% 증가시키고 이동 방해 효과를 제거합니다.'
    },
    [warriorTranslations.ravager]: {
      id: 228920,
      name: 'Ravager',
      type: 'instant',
      cooldown: 90,
      talent: true,
      description: '무기를 던져 12초간 지역 피해를 입힙니다.'
    }
  },

  // PvP 특성
  pvp_talents: {
    무장해제: {
      id: 236077,
      name: '무장 해제',
      type: 'disarm',
      cooldown: 45,
      pvp: true,
      description: '대상을 3초간 무장 해제합니다.'
    },
    칼날연마: {
      id: 198817,
      name: '칼날 연마',
      type: 'buff',
      cooldown: 25,
      pvp: true,
      description: '다음 필사의 일격이 치유 효과를 4초간 50% 감소시킵니다.'
    },
    전쟁깃발: {
      id: 236320,
      name: '전쟁 깃발',
      type: 'utility',
      cooldown: 90,
      pvp: true,
      description: '깃발을 설치하여 주변 아군의 이동 속도를 30% 증가시킵니다.'
    }
  }
};

export default warriorSkills;