/**
 * WARRIOR 분노 가이드 설정 파일
 *
 * 데이터와 UI를 완전히 분리하여 모듈 재사용성 극대화
 * 다른 전문화 가이드 제작 시 이 파일을 복사하여 내용만 수정
 */

import { furyWarriorSkills } from '../data/furyWarriorSkillData.js';

// ============================================
// 1. 기본 정보
// ============================================
export const classConfig = {
  className: 'WARRIOR',
  spec: 'fury',
  guideName: '분노 전사 가이드',
  primaryColor: '#C69B6D',
  secondaryColor: '#1a1a2e'
};

// ============================================
// 2. 메타 정보
// ============================================
export const metaInfo = {
  lastUpdate: '2025.10.03',
  author: 'WoWMeta',
  reviewer: '자의식-아즈샤라'
};

// ============================================
// 3. 네비게이션 구조 (GuideLayout용)
// ============================================
export const navigationConfig = [
  {
    id: 'overview',
    name: '개요',
    subsections: [
      { id: 'overview-intro', name: '전문화 소개' },
      { id: 'overview-resource', name: '리소스 시스템' }
    ]
  },
  {
    id: 'rotation',
    name: '딜사이클',
    subsections: [
      { id: 'rotation-tier', name: '티어 세트' },
      { id: 'rotation-single', name: '단일 대상' },
      { id: 'rotation-aoe', name: '광역 대상' }
    ]
  },
  {
    id: 'builds',
    name: '특성',
    subsections: [
      { id: 'builds-talents', name: '특성 빌드' }
    ]
  },
  {
    id: 'stats',
    name: '스탯',
    subsections: [
      { id: 'stats-priority', name: '우선순위' },
      { id: 'stats-simc', name: 'SimC 스트링' }
    ]
  }
];

// ============================================
// 4. 스킬 매핑 (텍스트 → 스킬 데이터)
// ============================================
export const skillMapping = {
  '광란': furyWarriorSkills.rampage,
  '피의 갈증': furyWarriorSkills.bloodthirst,
  '분노의 강타': furyWarriorSkills.ragingBlow,
  '마무리 일격': furyWarriorSkills.execute,
  '소용돌이': furyWarriorSkills.whirlwind,
  '천둥의 포효': furyWarriorSkills.thunderousRoar,
  '우레 작렬': furyWarriorSkills.thunderBlast,
  '무모한 희생': furyWarriorSkills.recklessness,
  '투신': furyWarriorSkills.avatar,
  '돌진': furyWarriorSkills.charge,
  '분노의 베기': furyWarriorSkills.furiousSlash,
  '영웅의 도약': furyWarriorSkills.heroicLeap,
  '들이치기': furyWarriorSkills.pummel,
  '투사의 혼': furyWarriorSkills.diebytheSword,
  '급살': furyWarriorSkills.suddenDeath,
  '학살자의 일격': furyWarriorSkills.slayersStrike,
  '폭풍 수확': furyWarriorSkills.reapTheStorm,
  '폭풍을 거두는 자': furyWarriorSkills.reapTheStorm,
  '잔혹한 마무리': furyWarriorSkills.brutalFinish,
  '폭풍망치': furyWarriorSkills.stormBolt,
  '격노': furyWarriorSkills.enrage
};

// 2. 영웅 특성별 콘텐츠
export const heroContent = {
  hero1: {
    name: '학살자',
    icon: '⚔️',
    tierSet: {
      twoSet: '2세트: 마무리 일격 피해가 20% 증가하고, 급살의 마무리 일격이 대상의 압도 중첩당 10% 확률로 학살자의 일격을 100% 효과로 발동합니다.',
      fourSet: '4세트: 분노의 강타 피해가 20% 증가하고, 분노의 강타가 대상의 압도 중첩당 2% 확률로 폭풍 수확을 100% 효과로 발동합니다.'
    },
    singleTarget: {
      opener: [
        furyWarriorSkills.charge,
        furyWarriorSkills.bloodthirst,
        furyWarriorSkills.recklessness,
        furyWarriorSkills.avatar,
        furyWarriorSkills.thunderousRoar,
        furyWarriorSkills.bladestorm,
        furyWarriorSkills.stormBolt,
        furyWarriorSkills.ragingBlow,
        furyWarriorSkills.rampage
      ],
      priority: [
        {
          skill: furyWarriorSkills.rampage,
          desc: '격노 버프 유지 (최우선)',
          conditions: [
            '격노 버프 없음',
            'OR 격노 버프 1 GCD(1.5초) 내 만료',
            '분노 80 이상 보유'
          ],
          priority: 0,
          why: '격노 유지율 90%+ 목표 - 가속 25% + 피해 15% 증가 + 분노 생성 100% 증가'
        },
        {
          skill: furyWarriorSkills.execute,
          desc: '사형선고 2중첩 + 급살 마무리 일격',
          conditions: [
            '격노 버프 활성 중 (필수 조건)',
            '사형선고 2중첩 (마무리 일격 피해 30% 증가)',
            'OR 급살 2중첩',
            'OR 급살 버프 곧 만료 (15초 지속)',
            '핵심: 마무리 일격은 분노를 소모하지 않음'
          ],
          priority: 0,
          why: '사형선고 2중첩 또는 급살 2중첩/만료 직전 시 광란보다 우선'
        },
        {
          skill: furyWarriorSkills.rampage,
          desc: '학살의 일격 중첩 소모로 광란 데미지 극대화',
          conditions: [
            '학살의 일격 3중첩 달성 목표 (최대 5중첩, 현실적으론 3중첩)',
            '격노 버프 활성 중',
            '분노 80 이상'
          ],
          priority: 1,
          why: '격노 유지 시간 동안 분노의 강타로 중첩 쌓아 광란 데미지 극대화'
        },
        {
          skill: furyWarriorSkills.ragingBlow,
          desc: '잔혹한 마무리 버프 활용',
          conditions: [
            '잔혹한 마무리 버프 활성',
            '재사용 대기시간 초기화됨'
          ],
          priority: 2,
          why: '버프 활성 시 분노의 강타 피해 20% 증가'
        },
        {
          skill: furyWarriorSkills.ragingBlow,
          desc: '충전 관리',
          conditions: [
            '2 충전 보유',
            '다음 충전까지 3초 이하'
          ],
          priority: 3,
          why: '충전 낭비 방지 - 최대 효율 유지'
        },
        {
          skill: furyWarriorSkills.rampage,
          desc: '분노 낭비 방지',
          conditions: [
            '분노 120 이상',
            '격노 버프 활성 중'
          ],
          priority: 4,
          why: '분노 최대치 120 - 초과분 낭비 방지'
        },
        {
          skill: furyWarriorSkills.execute,
          desc: '마무리 일격 구간 (20% 이하)',
          conditions: [
            '대상 생명력 20% 이하',
            '분노 소모 없음'
          ],
          priority: 5,
          why: '마무리 일격 구간에서 마무리 일격이 광란보다 우선'
        },
        {
          skill: furyWarriorSkills.ragingBlow,
          desc: '기본 분노 소모',
          conditions: [
            '재사용 대기시간 없음',
            '분노 12 소모'
          ],
          priority: 6,
          why: '안정적인 분노 소모 + 격노 트리거 가능'
        }
      ]
    },
    aoe: {
      opener: [
        furyWarriorSkills.charge,
        furyWarriorSkills.avatar,
        furyWarriorSkills.thunderousRoar,
        furyWarriorSkills.recklessness,
        furyWarriorSkills.bladestorm,
        furyWarriorSkills.whirlwind,
        furyWarriorSkills.rampage
      ],
      priority: [
        {
          skill: furyWarriorSkills.rampage,
          desc: '격노 버프 유지',
          conditions: [
            '격노 버프 없음 OR 곧 만료',
            '분노 80 이상'
          ],
          priority: 0,
          why: '격노 버프는 AoE에서도 필수'
        },
        {
          skill: furyWarriorSkills.whirlwind,
          desc: '회오리바람 버프 유지',
          conditions: [
            '다음 2회 단일 대상 공격이 주변 5명에게 피해',
            '버프 지속시간 20초'
          ],
          priority: 1,
          why: '회오리바람 버프로 분노의 강타/광란이 AoE로 전환'
        },
        {
          skill: furyWarriorSkills.ragingBlow,
          desc: '회오리바람 버프 활용',
          conditions: [
            '회오리바람 버프 활성 중',
            '분노의 강타로 AoE 피해'
          ],
          priority: 2,
          why: '단일 대상 스킬이 AoE로 전환되어 효율적'
        },
        {
          skill: furyWarriorSkills.bloodthirst,
          desc: '격노 트리거',
          conditions: [
            '격노 확률 20%',
            '회복 효과 보너스'
          ],
          priority: 3,
          why: '격노 트리거 + 생존력 확보'
        }
      ]
    },
    mechanics: [
      {
        title: '격노 유지율',
        icon: '🔥',
        desc: '격노 버프는 분노 전사의 핵심 메커니즘으로, 가속 25%, 피해 15%, 분노 생성 100% 증가 효과를 제공합니다.',
        details: [
          '목표 유지율: 90% 이상',
          '광란 시전 시 자동 발동 (8초 지속)',
          '피의 갈증 시전 시 20% 확률로 발동',
          '격노 버프가 1 GCD(1.5초) 내 만료 시 광란 우선 사용',
          '분노 80 이상 확보 후 광란 사용 권장'
        ],
        why: '격노 버프 없이는 DPS가 30% 이상 감소하므로 최우선 관리 대상'
      },
      {
        title: '학살자의 일격',
        icon: '⚔️',
        desc: '광란 사용 시 자동 발동되는 영웅 특성 스킬로, 중첩당 광란 피해를 증가시킵니다.',
        details: [
          '최대 5중첩까지 가능 (현실적으론 3중첩)',
          '광란 1회당 1중첩 획득',
          '각 중첩당 광란 피해 20% 증가',
          '3중첩 달성 시 광란 피해 60% 증가',
          '격노 버프 유지 시간 동안 중첩 관리'
        ],
        why: '학살자 빌드의 핵심 메커니즘으로 광란 데미지를 극대화'
      },
      {
        title: '급살 시스템',
        icon: '💀',
        desc: '급살 특성 사용 시 마무리 일격이 강화되는 시스템입니다.',
        details: [
          '마무리 일격 시전 시 급살 버프 획득 (15초 지속)',
          '급살 버프 중 마무리 일격은 분노를 소모하지 않음',
          '급살 2중첩 또는 만료 직전 시 마무리 일격 우선',
          '사형선고 2중첩 시 마무리 일격 피해 30% 증가',
          '격노 버프 활성 중에만 사용 권장'
        ],
        why: '분노 소모 없이 강력한 피해를 입힐 수 있는 핵심 메커니즘'
      }
    ]
  },
  hero2: {
    name: '산왕',
    icon: '⛰️',
    tierSet: {
      twoSet: '2세트: 마무리 일격 피해가 20% 증가하고, 급살의 마무리 일격이 대상의 압도 중첩당 10% 확률로 학살자의 일격을 100% 효과로 발동합니다.',
      fourSet: '4세트: 분노의 강타 피해가 20% 증가하고, 분노의 강타가 대상의 압도 중첩당 2% 확률로 폭풍 수확을 100% 효과로 발동합니다.'
    },
    singleTarget: {
      opener: [
        furyWarriorSkills.charge,
        furyWarriorSkills.bloodthirst,
        furyWarriorSkills.recklessness,
        furyWarriorSkills.avatar,
        furyWarriorSkills.thunderousRoar,
        furyWarriorSkills.rampage,
        furyWarriorSkills.ragingBlow
      ],
      priority: [
        {
          skill: furyWarriorSkills.rampage,
          desc: '격노 버프 유지 (최우선)',
          conditions: [
            '격노 버프 없음',
            'OR 격노 버프 1 GCD 내 만료',
            '분노 80 이상'
          ],
          priority: 0,
          why: '격노 유지율 90%+ 목표'
        },
        {
          skill: furyWarriorSkills.thunderClap,
          desc: '천둥벼락 디버프 유지',
          conditions: [
            '천둥벼락 디버프 없음 OR 곧 만료',
            '대상에게 10% 추가 피해'
          ],
          priority: 1,
          why: '산왕 특성 - 천둥벼락 피해 증가 효과'
        },
        {
          skill: furyWarriorSkills.ragingBlow,
          desc: '기본 분노 소모',
          conditions: [
            '재사용 대기시간 없음',
            '천둥벼락 디버프 활성 중'
          ],
          priority: 2,
          why: '안정적인 분노 소모 + 격노 트리거'
        }
      ]
    },
    aoe: {
      opener: [
        furyWarriorSkills.charge,
        furyWarriorSkills.avatar,
        furyWarriorSkills.thunderousRoar,
        furyWarriorSkills.recklessness,
        furyWarriorSkills.whirlwind,
        furyWarriorSkills.rampage
      ],
      priority: [
        {
          skill: furyWarriorSkills.rampage,
          desc: '격노 버프 유지',
          conditions: [
            '격노 버프 없음 OR 곧 만료',
            '분노 80 이상'
          ],
          priority: 0,
          why: '격노 버프는 AoE에서도 필수'
        },
        {
          skill: furyWarriorSkills.whirlwind,
          desc: '회오리바람 버프 유지',
          conditions: [
            '다음 2회 단일 대상 공격이 주변 5명에게 피해'
          ],
          priority: 1,
          why: '회오리바람 버프로 AoE 전환'
        },
        {
          skill: furyWarriorSkills.thunderClap,
          desc: '산왕 AoE 강화',
          conditions: [
            '천둥벼락으로 모든 적에게 디버프',
            '광역 감속 효과'
          ],
          priority: 2,
          why: '산왕 특성 - AoE 상황에서 강력한 유틸리티'
        }
      ]
    },
    mechanics: [
      {
        title: '천둥벼락 시스템',
        icon: '⚡',
        desc: '산왕의 핵심 메커니즘으로 천둥벼락이 강화되어 추가 피해와 유틸리티를 제공합니다.',
        details: [
          '천둥벼락 디버프: 대상이 받는 피해 10% 증가',
          '디버프 지속시간: 12초',
          '단일 대상에서 천둥벼락 유지 필수',
          'AoE 상황에서 광역 감속 효과',
          '무한의 폭풍 특성과 시너지'
        ],
        why: '산왕 빌드의 차별화 포인트로 DPS 증가와 생존력 확보'
      },
      {
        title: '격노 유지율',
        icon: '🔥',
        desc: '학살자와 동일하게 격노 버프 유지가 최우선입니다.',
        details: [
          '목표 유지율: 90% 이상',
          '광란 시전 시 자동 발동 (8초 지속)',
          '피의 갈증 시전 시 20% 확률로 발동'
        ],
        why: '격노 버프 없이는 DPS가 30% 이상 감소'
      }
    ]
  }
};

// 3. 특성 빌드
export const builds = {
  hero1: {
    'raid-single': {
      name: '레이드 단일 대상 (학살자)',
      description: '학살자를 활용한 단일 대상 빌드입니다. 학살자의 일격 중첩 관리와 급살 시스템을 통해 높은 단일 대상 DPS를 달성합니다.',
      code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJJtkSSkEJJJplSSJJRQSIJJJJJJpEAAAAAAAA',
      icon: '⚔️'
    },
    'raid-aoe': {
      name: '레이드 광역 (학살자)',
      description: '학살자의 AoE 능력을 극대화한 빌드입니다. 회오리바람 버프와 격노를 유지하며 광역 피해를 극대화합니다.',
      code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJJtkSSkEJJJplSSJJRQSIJJJJJJpEAAAAAAAA',
      icon: '🌪️'
    },
    'mythic-plus': {
      name: '쐐기돌 (학살자)',
      description: '쐐기돌에 최적화된 학살자 빌드입니다. 단일 대상과 AoE를 균형있게 처리할 수 있습니다.',
      code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJJtkSSkEJJJplSSJJRQSIJJJJJJpEAAAAAAAA',
      icon: '🔑'
    }
  },
  hero2: {
    'raid-single': {
      name: '레이드 단일 대상 (산왕)',
      description: '산왕을 활용한 단일 대상 빌드입니다. 천둥벼락 디버프 유지와 격노 관리를 통해 안정적인 DPS를 달성합니다.',
      code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJJtkSSkEJJJplSSJJRQSIJJJJJJpEAAAAAAAA',
      icon: '⛰️'
    },
    'raid-aoe': {
      name: '레이드 광역 (산왕)',
      description: '산왕의 천둥벼락을 활용한 AoE 빌드입니다. 광역 감속과 피해 증가 효과로 그룹 유틸리티를 제공합니다.',
      code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJJtkSSkEJJJplSSJJRQSIJJJJJJpEAAAAAAAA',
      icon: '⚡'
    },
    'mythic-plus': {
      name: '쐐기돌 (산왕)',
      description: '쐐기돌에 최적화된 산왕 빌드입니다. 천둥벼락의 유틸리티와 안정적인 DPS를 제공합니다.',
      code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJJtkSSkEJJJplSSJJRQSIJJJJJJpEAAAAAAAA',
      icon: '🏔️'
    }
  }
};

// 4. 개요 섹션 데이터
export const overviewData = {
  title: '분노 전사',
  subtitle: '근접 물리 딜러 - 쌍수 무기 특화',
  description: '분노 전사는 격노라는 강력한 버프를 유지하며 쌍수 무기로 적을 압도하는 근접 딜러입니다. 학살자 영웅 특성은 광란 중심의 폭발적인 피해를, 산왕 영웅 특성은 천둥벼락을 통한 안정적인 피해와 유틸리티를 제공합니다.',

  coreSkills: [
    furyWarriorSkills.rampage,
    furyWarriorSkills.bloodthirst,
    furyWarriorSkills.ragingBlow,
    furyWarriorSkills.execute
  ],

  resourceSystem: {
    name: '분노',
    type: 'rage',
    maxValue: 120,
    icon: '🔥',
    description: '전투 중 스킬 사용으로 생성하고 광란으로 소모합니다.',
    generators: [
      { skill: furyWarriorSkills.bloodthirst, amount: '8 분노 생성', note: '격노 발동 20% 확률' },
      { skill: furyWarriorSkills.ragingBlow, amount: '12 분노 생성', note: '2충전 시스템' },
      { skill: furyWarriorSkills.execute, amount: '20 분노 생성', note: '20% 이하 구간' }
    ],
    spenders: [
      { skill: furyWarriorSkills.rampage, amount: '80 분노 소모', note: '격노 버프 발동' }
    ],
    mechanics: [
      '격노 버프: 가속 25%, 피해 15%, 분노 생성 100% 증가',
      '격노 유지율 90% 목표',
      '분노 최대치 120 - 초과분 낭비 방지 필수'
    ]
  },

  playstyle: {
    difficulty: '중급',
    range: '근접',
    mobility: '높음 (영웅의 도약, 돌진)',
    survivability: '중간 (투사의 혼, 격노 회복)',
    strengths: [
      '격노 버프를 통한 강력한 순간 화력',
      '광란과 마무리 일격의 높은 폭발력',
      '우수한 기동성과 전투 지속력'
    ],
    weaknesses: [
      '격노 버프 의존도가 높음',
      '분노 관리 실수 시 DPS 급감',
      '광역 딜은 다른 근딜 대비 약함'
    ]
  }
};

// 5. 스탯 우선순위 (상세 버전)
export const statsData = {
  hero1: {
    name: '학살자',
    single: {
      priority: ['치명타', '가속', '특화', '유연성'],
      description: '학살자는 치명타를 통한 급살 발동 확률을 극대화하고, 가속으로 격노 유지율을 높입니다.',
      breakpoints: [
        { stat: '치명타', value: '30%', effect: '급살 발동 확률 안정화 (사형선고 시너지)' },
        { stat: '가속', value: '20%', effect: 'GCD 1.2초 달성, 격노 유지율 90%+' },
        { stat: '특화', value: '최소', effect: '분노 추가 피해, 낮은 우선순위' }
      ],
      explanation: '치명타 30% 이상 확보 시 급살 2중첩 발동이 안정화되어 마무리 일격 피해가 극대화됩니다. 가속 20%는 격노 유지를 위한 최소 요구치입니다.'
    },
    aoe: {
      priority: ['가속', '치명타', '특화', '유연성'],
      description: 'AoE에서는 가속이 최우선이며 회오리바람 버프 유지가 핵심입니다.',
      breakpoints: [
        { stat: '가속', value: '25%', effect: '회오리바람 버프 안정적 유지' },
        { stat: '치명타', value: '25%', effect: 'AoE 스킬 치명타 확률 증가' }
      ],
      explanation: '가속으로 회오리바람 버프를 안정적으로 유지하고 분노의 강타 충전을 빠르게 돌립니다.'
    }
  },
  hero2: {
    name: '산왕',
    single: {
      priority: ['가속', '치명타', '특화', '유연성'],
      description: '산왕은 가속을 통한 천둥벼락 디버프 유지와 격노 관리가 핵심입니다.',
      breakpoints: [
        { stat: '가속', value: '22%', effect: '천둥벼락 디버프 100% 유지, 격노 안정화' },
        { stat: '치명타', value: '25%', effect: '격노 발동 확률 증가' },
        { stat: '특화', value: '최소', effect: '분노 추가 피해' }
      ],
      explanation: '가속 22% 이상 확보 시 천둥벼락 디버프를 100% 유지할 수 있어 DPS가 10% 증가합니다.'
    },
    aoe: {
      priority: ['가속', '치명타', '특화', '유연성'],
      description: 'AoE에서도 가속이 최우선이며 천둥벼락 광역 디버프 유지가 중요합니다.',
      breakpoints: [
        { stat: '가속', value: '25%', effect: '천둥벼락 광역 디버프 안정화' },
        { stat: '치명타', value: '20%', effect: 'AoE 피해 증가' }
      ],
      explanation: '천둥벼락으로 모든 적에게 10% 피해 증가 디버프를 유지합니다.'
    }
  }
};

// 6. 딜사이클 Config (Atomic 모듈 선택)
export const rotationConfig = {
  components: [
    'ResourceGauge',      // 분노 게이지 표시
    'TierSetBonus',       // 티어 세트 효과
    'OpenerSequence',     // 오프닝 시퀀스
    'PriorityFlowChart',  // 우선순위 플로우차트 (복잡한 전사에 적합)
    'MechanicsCard'       // 핵심 메커니즘 카드
  ],
  useFlowChart: true,  // 10+ priorities → FlowChart 사용
  usePriorityTable: false  // 5-7 priorities → Table 사용
};

// ============================================
// 7. 전체 Config Export
// ============================================
const furyWarriorConfig = {
  classConfig,
  metaInfo,
  navigationConfig,
  skillMapping,
  skillData: furyWarriorSkills,
  heroContent,
  overviewData,
  builds,
  statsData,
  rotationConfig
};

export default furyWarriorConfig;
