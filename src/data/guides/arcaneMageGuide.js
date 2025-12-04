// ============================================================
// Arcane Mage Guide Data - 비전 마법사 가이드 데이터
// ============================================================
// 목적: ID 기반 가이드 데이터 (Central DB 참조)
// 업데이트: 2025-11-11
// ============================================================

/**
 * ArcaneMage Guide Data
 *
 * 데이터 구조:
 * - 모든 스킬은 ID만 저장 (Central DB에서 조회)
 * - 설명과 조건만 하드코딩
 * - 색상, 클래스, 전문화 메타데이터 포함
 */
export const arcaneMageGuideData = {
  // 메타데이터
  className: 'mage',
  specName: '비전',
  specNameEnglish: 'Arcane',
  color: '#A330C9',  // 비전 마법사 테마 색상 (보라색)

  // 전문화 소개
  description: `비전 마법사는 강력한 폭발적 딜을 자랑하는 전문화입니다.
비전 충전물을 쌓아 막강한 피해를 입히고, 마나 관리를 통해 지속적인 딜 사이클을 유지합니다.
버스트 윈도우 동안 극대화된 피해로 보스전에서 두각을 나타내며,
최적화된 마나 관리와 쿨다운 타이밍이 핵심입니다.`,

  // 핵심 스킬 (ID 배열)
  coreSkills: [
    '5143',   // Arcane Missiles (신비한 화살)
    '30451',  // Arcane Blast (비전 작렬)
    '44425',  // Arcane Barrage (비전 탄막)
    '12051',  // Evocation (환기) - 마나 회복
    '365350', // Arcane Surge (비전 쇄도) - 주요 버스트 쿨다운
    '321507'  // Touch of the Magi (마법사의 손길) - 피해 증폭
  ],

  // 로테이션 데이터
  rotation: {
    // 오프닝 (전투 시작 시 스킬 순서)
    opener: [
      '12051',  // Evocation (3초 전 - 마나 완충)
      '365350', // Arcane Surge (버스트 시작)
      '321507', // Touch of the Magi (피해 증폭 디버프)
      '30451',  // Arcane Blast (충전물 쌓기 시작)
      '30451',  // Arcane Blast
      '30451',  // Arcane Blast
      '30451',  // Arcane Blast (4충전)
      '5143',   // Arcane Missiles (버프 소모)
      '44425'   // Arcane Barrage (피니셔)
    ],

    // 우선순위 (Priority List)
    priority: [
      {
        skillId: '321507',
        condition: '쿨다운 완료',
        reason: 'Touch of the Magi는 항상 최우선 사용. 12초간 받은 피해의 25%를 추가로 입힙니다.'
      },
      {
        skillId: '365350',
        condition: 'Touch of the Magi와 함께 사용',
        reason: 'Arcane Surge는 버스트 윈도우의 핵심. Touch of the Magi와 타이밍을 맞춰 사용하세요.'
      },
      {
        skillId: '5143',
        condition: 'Clearcasting 버프 활성화 시',
        reason: 'Clearcasting (40% 확률 발동) 시 Arcane Missiles를 즉시 사용. 마나 소모 없이 강력한 피해를 입힙니다.'
      },
      {
        skillId: '30451',
        condition: '비전 충전물 0-3개',
        reason: 'Arcane Blast로 비전 충전물을 4개까지 쌓습니다. 충전물마다 피해가 증가합니다.'
      },
      {
        skillId: '44425',
        condition: '비전 충전물 4개',
        reason: 'Arcane Barrage로 충전물을 소모하고 사이클을 리셋. 마나 효율이 좋습니다.'
      },
      {
        skillId: '12051',
        condition: '마나 30% 이하',
        reason: 'Evocation으로 마나를 빠르게 회복. 채널링 동안 무방비 상태이므로 안전한 타이밍에 사용하세요.'
      }
    ],

    // 쐐기돌 로테이션 (다수 대상)
    aoe: {
      description: '3+ 대상 시 Arcane Explosion을 추가하여 광역 피해를 극대화합니다.',
      priority: [
        {
          skillId: '44425',
          condition: '5+ 대상',
          reason: 'Arcane Barrage의 광역 피해가 효율적입니다.'
        }
      ]
    }
  },

  // 특성 빌드
  talents: {
    raid: {
      description: '단일 대상 최적화 빌드. 버스트 윈도우 극대화에 중점을 둡니다.',
      url: 'https://www.wowhead.com/talent-calc/mage/arcane/raid-build'  // 실제 링크로 교체 필요
    },
    mythicPlus: {
      description: '광역 피해와 생존력을 강화한 쐐기돌 빌드입니다.',
      url: 'https://www.wowhead.com/talent-calc/mage/arcane/mythic-plus-build'  // 실제 링크로 교체 필요
    }
  },

  // 스탯 우선순위
  stats: {
    priority: '지능 > 치명타 > 가속 > 특화 > 유연성',
    notes: `지능이 최우선이며, 치명타는 버스트 윈도우 피해를 극대화합니다.
가속은 시전 속도를 높여 더 많은 스킬을 사용할 수 있게 합니다.
특화는 비전 피해를 증폭시키지만 치명타/가속보다 우선순위가 낮습니다.`
  },

  // 영웅 특성 (TWW 시즌3)
  heroTalents: {
    sunfury: {
      name: '성난태양',
      description: 'Spellfire Spheres를 생성하여 추가 피해를 입히는 빌드. 레이드에 최적화되어 있습니다.',
      recommended: 'raid'
    },
    spellslinger: {
      name: '주문술사',
      description: '기동성과 순간 폭발 딜을 강화하는 빌드. 쐐기돌에 유용합니다.',
      recommended: 'mythic-plus'
    }
  },

  // 중요 메커니즘
  mechanics: [
    {
      name: '비전 충전물',
      description: 'Arcane Blast 시전 시 쌓이며, 최대 4개까지 가능합니다. 충전물마다 Arcane Blast의 피해가 증가하지만 마나 소모도 증가합니다.'
    },
    {
      name: 'Clearcasting',
      description: 'Arcane Blast 시전 시 40% 확률로 발동. Arcane Missiles를 마나 소모 없이 사용할 수 있습니다.'
    },
    {
      name: '마나 관리',
      description: '비전 마법사의 핵심 메커니즘. Evocation으로 마나를 회복하고, Arcane Barrage로 효율을 유지합니다.'
    }
  ]
};

export default arcaneMageGuideData;
