// 성기사 (Paladin) 스킬 데이터베이스
// WoW 11.2 패치 - 크아레쉬의 유령 (Undermined)
// 최신 한국어 번역 적용

import { koreanTranslations } from '../koreanTranslations-11.2';

const paladinTranslations = koreanTranslations.paladinAbilities || {};

export const paladinSkills = {
  className: koreanTranslations.classes.paladin,
  classNameEn: 'Paladin',

  // 공통 스킬 (모든 전문화 사용 가능)
  common: {
    // 기본 공격/유틸리티
    심판: {
      id: 20271,
      name: 'Judgment',
      type: 'damage',
      cooldown: 12,
      charges: 2,
      range: 30,
      description: '적을 심판하여 신성 피해를 입힙니다.'
    },
    '천벌의 망치': {
      id: 24275,
      name: 'Hammer of Wrath',
      type: 'damage',
      cooldown: 7.5,
      range: 30,
      holy_power: 1,
      description: '생명력이 20% 이하인 적에게 사용 가능한 망치 투척입니다.'
    },
    신성화: {
      id: 26573,
      name: 'Consecration',
      type: 'damage',
      cooldown: 4.5,
      description: '지면을 신성화하여 12초간 지속 피해를 입힙니다.'
    },

    // 방어/생존 스킬
    '천상의 보호막': {
      id: 642,
      name: 'Divine Shield',
      type: 'defensive',
      cooldown: 300,
      description: '8초간 모든 피해와 해로운 효과에 면역이 됩니다.'
    },
    '신의 가호': {
      id: 498,
      name: 'Divine Protection',
      type: 'defensive',
      cooldown: 60,
      description: '10초간 받는 피해를 20% 감소시킵니다.'
    },
    '신의 축복': {
      id: 633,
      name: 'Lay on Hands',
      type: 'heal',
      cooldown: 600,
      description: '대상의 생명력을 최대치로 회복시킵니다.'
    },

    // 축복/버프
    '자유의 축복': {
      id: 1044,
      name: 'Blessing of Freedom',
      type: 'utility',
      cooldown: 25,
      description: '8초간 이동 방해 효과를 제거하고 면역이 됩니다.'
    },
    '보호의 축복': {
      id: 1022,
      name: 'Blessing of Protection',
      type: 'defensive',
      cooldown: 300,
      description: '10초간 물리 피해에 면역이 됩니다.'
    },
    '희생의 축복': {
      id: 6940,
      name: 'Blessing of Sacrifice',
      type: 'defensive',
      cooldown: 120,
      description: '12초간 대상이 받는 피해의 30%를 대신 받습니다.'
    },
    '주문 수호의 축복': {
      id: 204018,
      name: 'Blessing of Spellwarding',
      type: 'defensive',
      cooldown: 180,
      talent: true,
      description: '10초간 마법 피해에 면역이 됩니다.'
    },

    // 치유 스킬
    '빛의 섬광': {
      id: 19750,
      name: 'Flash of Light',
      type: 'heal',
      cast: 1.5,
      description: '빠르게 시전하는 치유 주문입니다.'
    },
    '신성한 빛': {
      id: 82326,
      name: 'Holy Light',
      type: 'heal',
      cast: 2.5,
      description: '강력한 치유 주문입니다.'
    },
    '영광의 서약': {
      id: 85673,
      name: 'Word of Glory',
      type: 'heal',
      holy_power: 3,
      description: '신성한 힘을 소모하여 즉시 치유합니다.'
    },

    // 유틸리티
    '심판의 망치': {
      id: 853,
      name: 'Hammer of Justice',
      type: 'stun',
      cooldown: 60,
      range: 10,
      description: '6초간 대상을 기절시킵니다.'
    },
    비난: {
      id: 96231,
      name: 'Rebuke',
      type: 'interrupt',
      cooldown: 15,
      range: 5,
      description: '적의 시전을 차단합니다.'
    },
    '징벌의 손길': {
      id: 62124,
      name: 'Hand of Reckoning',
      type: 'taunt',
      cooldown: 8,
      range: 30,
      description: '적이 3초간 자신을 공격하도록 강제합니다.'
    },
    정화: {
      id: 4987,
      name: 'Cleanse',
      type: 'dispel',
      cooldown: 8,
      description: '독과 질병을 제거합니다.'
    },
    '신성한 군마': {
      id: 190784,
      name: 'Divine Steed',
      type: 'mobility',
      cooldown: 45,
      charges: 2,
      description: '3초간 이동 속도가 100% 증가합니다.'
    },

    // 오라
    '헌신의 오라': {
      id: 465,
      name: 'Devotion Aura',
      type: 'aura',
      description: '주변 아군이 받는 피해를 3% 감소시킵니다.'
    },
    '응보의 오라': {
      id: 183435,
      name: 'Retribution Aura',
      type: 'aura',
      description: '근접 공격한 적에게 신성 피해를 반사합니다.'
    },
    '성전사의 오라': {
      id: 32223,
      name: 'Crusader Aura',
      type: 'aura',
      description: '탈것 속도를 20% 증가시킵니다.'
    },
    '집중의 오라': {
      id: 317920,
      name: 'Concentration Aura',
      type: 'aura',
      talent: true,
      description: '침묵과 차단 지속 시간을 30% 감소시킵니다.'
    }
  },

  // 징벌 전문화
  retribution: {
    // 주요 공격 스킬
    '정의의 칼날': {
      id: 184575,
      name: 'Blade of Justice',
      type: 'damage',
      cooldown: 12,
      holy_power: 2,
      description: '신성 피해를 입히고 신성한 힘을 2개 생성합니다.'
    },
    '기사단의 선고': {
      id: 85256,
      name: "Templar's Verdict",
      type: 'damage',
      holy_power: 3,
      description: '신성한 힘을 소모하여 강력한 신성 피해를 입힙니다.'
    },
    '최후의 선고': {
      id: 198038,
      name: 'Final Verdict',
      type: 'damage',
      holy_power: 3,
      talent: true,
      description: '기사단의 선고를 대체합니다. 추가 신성 피해를 입힙니다.'
    },
    '신성한 폭풍': {
      id: 53385,
      name: 'Divine Storm',
      type: 'damage',
      holy_power: 3,
      description: '주변 모든 적에게 신성 피해를 입힙니다.'
    },
    '잿불 일깨우기': {
      id: 255937,
      name: 'Wake of Ashes',
      type: 'damage',
      cooldown: 45,
      holy_power: 5,
      description: '전방의 적에게 신성 피해를 입히고 신성한 힘을 5개 생성합니다.'
    },
    '응징의 격노': {
      id: 31884,
      name: 'Avenging Wrath',
      type: 'burst',
      cooldown: 120,
      description: '20초간 공격력과 치유량이 20% 증가합니다.'
    },
    성전: {
      id: 231895,
      name: 'Crusade',
      type: 'burst',
      cooldown: 120,
      talent: true,
      description: '응징의 격노를 대체합니다. 점진적으로 공격력이 증가합니다.'
    },
    심문: {
      id: 343527,
      name: 'Execution Sentence',
      type: 'damage',
      cooldown: 60,
      talent: true,
      description: '8초 후 폭발하는 천벌의 낙인을 찍습니다.'
    }
  },

  // 보호 전문화
  protection: {
    // 방어 스킬
    '정의의 방패': {
      id: 53600,
      name: 'Shield of the Righteous',
      type: 'defense',
      holy_power: 3,
      description: '4.5초간 방어도를 크게 증가시킵니다.'
    },
    '응징의 방패': {
      id: 31935,
      name: 'Avenger\'s Shield',
      type: 'damage',
      cooldown: 15,
      range: 30,
      description: '방패를 던져 3명의 적에게 피해를 입히고 침묵시킵니다.'
    },
    '축복받은 망치': {
      id: 204019,
      name: 'Blessed Hammer',
      type: 'damage',
      cooldown: 6,
      charges: 3,
      talent: true,
      description: '회전하는 망치를 소환하여 주변 적에게 피해를 입힙니다.'
    },
    '빛의 수호자': {
      id: 86659,
      name: 'Guardian of Ancient Kings',
      type: 'defensive',
      cooldown: 300,
      description: '8초간 받는 피해를 50% 감소시킵니다.'
    },
    '불굴의 정신': {
      id: 31850,
      name: 'Ardent Defender',
      type: 'defensive',
      cooldown: 120,
      description: '8초간 받는 피해를 20% 감소시키고 치명적인 피해로부터 보호합니다.'
    },
    '순간의 영광': {
      id: 327193,
      name: 'Moment of Glory',
      type: 'defensive',
      cooldown: 90,
      talent: true,
      description: '즉시 응징의 방패를 재설정하고 추가 효과를 부여합니다.'
    }
  },

  // 신성 전문화
  holy: {
    // 치유 스킬
    '성스러운 충격': {
      id: 20473,
      name: 'Holy Shock',
      type: 'heal_damage',
      cooldown: 9,
      range: 40,
      description: '아군을 치유하거나 적에게 피해를 입힙니다.'
    },
    '빛의 봉화': {
      id: 53651,
      name: 'Beacon of Light',
      type: 'buff',
      description: '대상에게 봉화를 설치하여 다른 대상 치유 시 일부를 전달합니다.'
    },
    '신앙의 봉화': {
      id: 156910,
      name: 'Beacon of Faith',
      type: 'buff',
      talent: true,
      description: '두 명에게 빛의 봉화를 설치합니다.'
    },
    '빛의 파도': {
      id: 85222,
      name: 'Light of Dawn',
      type: 'heal',
      cooldown: 90,
      description: '전방 원뿔 범위의 아군을 치유합니다.'
    },
    '성스러운 분노': {
      id: 216331,
      name: 'Avenging Crusader',
      type: 'burst',
      cooldown: 120,
      talent: true,
      description: '20초간 공격이 주변 아군을 치유합니다.'
    },
    '빛의 망치': {
      id: 114158,
      name: 'Light\'s Hammer',
      type: 'heal',
      cooldown: 60,
      talent: true,
      description: '지면에 망치를 소환하여 범위 치유와 피해를 입힙니다.'
    },
    '신의 은총': {
      id: 105809,
      name: 'Holy Avenger',
      type: 'burst',
      cooldown: 90,
      talent: true,
      description: '20초간 가속과 치유량이 30% 증가합니다.'
    }
  }
};

export default paladinSkills;