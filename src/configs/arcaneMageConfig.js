/**
 * MAGE 비전 가이드 설정 파일
 *
 * 자동 생성됨: 2025-10-04T22:38:20.473Z
 * 출처: Maxroll (https://maxroll.gg/wow/class-guides/arcane-mage-mythic-plus-guide)
 */

import { arcaneMageSkills } from '../data/arcaneMageSkillData.js';

// 1. 직업 기본 설정
export const classConfig = {
  className: 'MAGE',
  spec: 'arcane',
  heroTalents: ['성난태양', '서리불꽃'],
  heroMapping: {
    "hero1": "sunfury",
    "hero2": "frostfire"
  }
};

// 2. 영웅 특성별 콘텐츠
export const heroContent = {
  hero1: {
    name: '성난태양',
    icon: '☀️',
    tierSet: {
      twoSet: '용불의 구체 주문 피해 보너스가 1.0% 증가합니다.',
      fourSet: '불사조가 만료되면 작은 시간 왜곡을 부여하고 10초 동안 주문 피해가 20% 증가합니다.'
    },
    singleTarget: {
      opener: [
        '전투 4초 전: 환기',
        '전투 1초 전: 신비한 화살',
        '비전의 여파 (전역 재사용 대기시간 무시)'
      ],
      priority: [
        { skill: '신비한 화살', condition: '번뜩임 3중첩일 때', priority: 0, why: '최대 효율을 위해 3중첩에서 사용' },
        { skill: '비전 탄막', condition: '통찰력/비전 속도가 곧 만료될 때', priority: 1, why: '버프 유지 우선' },
        { skill: '신비한 화살', condition: '번뜩임이 있고 황천의 정밀함이 없을 때', priority: 2, why: '번뜩임 낭비 방지' },
        { skill: '비전 보주', condition: '비전 충전물 <3일 때', priority: 3, why: '충전물 생성' },
        { skill: '비전 작렬', condition: '마력주입자 효과가 있을 때', priority: 4, why: '강화된 공격력 활용' },
        { skill: '비전 탄막', condition: '통찰력/영광스러운 빛의 현신이 있을 때', priority: 5, why: '버프 활용' },
        { skill: '신비한 폭발', condition: '비전 충전물 0-1일 때', priority: 6, why: '약한 충전물일 때 광역 사용' },
        { skill: '비전 작렬', condition: '기본 공격', priority: 7, why: '충전물 생성 및 기본 피해' },
        { skill: '비전 탄막', condition: '마나 부족 시', priority: 8, why: '충전물 소모 및 마나 관리' }
      ]
    },
    aoe: {
      opener: [
        '전투 4초 전: 환기',
        '전투 1초 전: 신비한 화살',
        '비전의 여파 (전역 재사용 대기시간 무시)'
      ],
      priority: [
        { skill: '신비한 화살', condition: '번뜩임 3중첩일 때', priority: 0, why: '광역에서도 최대 효율 유지' },
        { skill: '비전 탄막', condition: '비전 충전물 4개 + 비전 보주 사용 가능', priority: 1, why: '광역 피해 극대화' },
        { skill: '비전 보주', condition: '비전 충전물 <3일 때', priority: 2, why: '광역 충전물 생성' },
        { skill: '신비한 폭발', condition: '다수 대상 존재 시', priority: 3, why: '주력 광역 스킬' },
        { skill: '비전 작렬', condition: '기본 공격', priority: 4, why: '단일 대상 보조' }
      ]
    },
    mechanics: [
      { name: '비전 충전물 관리', icon: '⚡', desc: '4중첩까지 쌓아서 비전 탄막으로 소모. 피해량이 비전 충전물 개수에 비례하여 증가' },
      { name: '번뜩임 활용', icon: '✨', desc: '3중첩에서 신비한 화살 사용으로 최대 피해. 황천의 정밀함이 없을 때 우선 소모' },
      { name: '마나 관리', icon: '💧', desc: '환기로 마나 회복. 마나 부족 시 비전 탄막으로 충전물 소모하여 마나 절약' },
      { name: '비전의 여파', icon: '🌟', desc: '비전 작렬로 10% 확률 발동. 12초간 피해 15% 누적 후 폭발하는 핵심 딜 메커니즘' }
    ]
  },
  hero2: {
    name: '서리불꽃',
    icon: '❄️🔥',
    tierSet: {
      twoSet: '용불의 구체 주문 피해 보너스가 1.0% 증가합니다.',
      fourSet: '불사조가 만료되면 작은 시간 왜곡을 부여하고 10초 동안 주문 피해가 20% 증가합니다.'
    },
    singleTarget: {
      opener: [
        '⚠️ TODO: 서리불꽃 오프닝 시퀀스 추가'
      ],
      priority: [
        { skill: '⚠️ TODO', condition: '서리불꽃 빌드 우선순위 추가', priority: 0, why: 'Maxroll에서 세부 정보 확인 필요' }
      ]
    },
    aoe: {
      opener: [],
      priority: []
    },
    mechanics: [
      { name: '⚠️ TODO', icon: '🔥', desc: '서리불꽃 핵심 메커니즘 추가 필요' }
    ]
  }
};

// 3. 특성 빌드
export const builds = {
  hero1: {
    'raid-single': {
      name: '레이드 단일 대상',
      description: '성난태양 영웅 특성 기반 레이드 단일 보스 최적화 빌드. 비전의 여파와 번뜩임 관리에 집중',
      code: '⚠️ TODO: Wowhead 빌드 코드',
      icon: '🎯'
    },
    'raid-aoe': {
      name: '레이드 광역',
      description: '성난태양 영웅 특성 기반 레이드 광역 빌드. 공명과 충전된 보주 특성 포함',
      code: '⚠️ TODO: Wowhead 빌드 코드',
      icon: '💥'
    },
    'mythic-plus': {
      name: '쐐기돌',
      description: '성난태양 영웅 특성 기반 신화+ 던전 빌드. 단일/광역 균형 잡힌 특성 구성',
      code: '⚠️ TODO: Wowhead 빌드 코드',
      icon: '🗝️'
    }
  },
  hero2: {
    'raid-single': {
      name: '레이드 단일 대상 (서리불꽃)',
      description: '⚠️ TODO: 서리불꽃 레이드 빌드 설명',
      code: '⚠️ TODO: Wowhead 빌드 코드',
      icon: '🎯'
    },
    'mythic-plus': {
      name: '쐐기돌 (서리불꽃)',
      description: '⚠️ TODO: 서리불꽃 신화+ 빌드 설명',
      code: '⚠️ TODO: Wowhead 빌드 코드',
      icon: '🗝️'
    }
  }
};

// 4. 스탯 우선순위
export const stats = {
  hero1: {
    single: [
      '지능 (주 능력치)',
      '가속 > 특화 > 치명타 > 유연성',
      '⚠️ 주의: 2차 능력치는 수익 체감 적용'
    ],
    aoe: [
      '지능 (주 능력치)',
      '가속 > 특화 > 치명타 > 유연성',
      '⚠️ 주의: 2차 능력치는 수익 체감 적용'
    ]
  },
  hero2: {
    single: [
      '⚠️ TODO: 서리불꽃 스탯 우선순위 추가'
    ],
    aoe: [
      '⚠️ TODO: 서리불꽃 스탯 우선순위 추가'
    ]
  }
};

export default {
  classConfig,
  skillData: arcaneMageSkills,
  heroContent,
  builds,
  stats
};
