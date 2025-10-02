// 주술사 전문가 AI
import ClassExpertAI from '../ClassExpertAI';

class ShamanExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('shaman', spec);

    // 주술사 특화 설정
    this.specializationData = {
      elemental: {
        priority: ['flameShock', 'lavaB burst', 'lightningBolt', 'earthShock', 'elementalBlast'],
        resource: '소용돌이 값',
        keyStats: ['치명타', '가속', '특화'],
        burstWindow: 'stormElemental',
        tier11_2Bonus: {
          '2set': '번개 화살 피해 15% 증가',
          '4set': '용암 폭발시 정기 과부하 확률 25%'
        }
      },
      enhancement: {
        priority: ['stormstrike', 'lavaLash', 'elementalBlast', 'lightningBolt', 'frostShock'],
        resource: '소용돌이 값',
        keyStats: ['가속', '치명타', '특화'],
        burstWindow: 'feralSpirit',
        tier11_2Bonus: {
          '2set': '폭풍의 일격 피해 12% 증가',
          '4set': '뜨거운 손 프록 확률 20% 증가'
        }
      },
      restoration: {
        priority: ['riptide', 'healingWave', 'healingSurge', 'chainHeal', 'healingRain'],
        resource: '마나',
        keyStats: ['치명타', '가속', '유연성'],
        cooldownWindow: 'spiritLinkTotem',
        tier11_2Bonus: {
          '2set': '성난 해일 치유량 15% 증가',
          '4set': '연쇄 치유 튕김 추가'
        }
      }
    };

    this.currentSpec = this.specializationData[spec];
    this.maelstromWeapon = {
      current: 0,
      max: spec === 'enhancement' ? 10 : 100,
      optimalRange: spec === 'enhancement' ? { min: 5, max: 10 } : { min: 60, max: 90 }
    };

    // 11.2 패치 정기 주술사 최강 시절
    this.patch11_2Meta = {
      elemental: {
        ranking: 'S-Tier (약간 너프 후 A+)',
        keyChanges: [
          'Lightning Bolt 피해 35% 증가',
          'Lava Burst 피해 35% 증가',
          'Elemental Blast 피해 25% 증가',
          'Elemental Reverb 대폭 버프'
        ]
      },
      enhancement: {
        ranking: 'A-Tier',
        keyChanges: [
          'Stormstrike 피해 증가',
          'Elemental Weapons 개선',
          'Doom Winds 강화'
        ]
      }
    };
  }

  // 정기 주술사 특화 메서드
  getElementalRotation() {
    return {
      opener: [
        '원소 폭발 (사전 시전)',
        '화염 충격 (모든 타겟)',
        '원시 정령 소환',
        '용암 폭발 (즉시 시전)',
        '번개 화살 x2',
        '대지 충격 (60+ 소용돌이)'
      ],
      sustained: [
        '화염 충격 100% 유지',
        '용암 폭발 프록 즉시 사용',
        '원소 폭발 쿨마다',
        '소용돌이 60+ 대지 충격',
        '번개 화살 필러'
      ],
      aoe: [
        '화염 충격 확산',
        '지진 (60+ 소용돌이)',
        '연쇄 번개 스팸',
        '용암 폭발 프록 소모'
      ],
      movement: [
        '서리 충격 (즉시 시전)',
        '용암 폭발 프록',
        '대지의 정령 활용',
        '천둥폭풍으로 이동'
      ]
    };
  }

  // 고양 주술사 특화 메서드
  getEnhancementRotation() {
    const hasHotHand = true; // 뜨거운 손 특성 여부

    return {
      opener: [
        '정령의 늑대 소환',
        '원소 무기 활성화',
        '폭풍의 일격',
        hasHotHand ? '뜨거운 손 프록시 용암 채찍' : '용암 채찍',
        '원소 폭발',
        '번개 화살 (5+ 소용돌이)'
      ],
      priority: [
        '1. 원소 폭발 쿨마다',
        '2. 폭풍의 일격 쿨마다',
        '3. 용암 채찍 (뜨거운 손 프록)',
        '4. 번개 화살/원소 폭발 (5+ 소용돌이)',
        '5. 화염 충격 도트 유지',
        '6. 용암 채찍 (소용돌이 소모)',
        '7. 서리 충격 (이동 중)'
      ],
      cooldowns: {
        '야수 정령': '버스트 시작',
        '파멸의 바람': '야수 정령과 함께',
        '태양광선': '광역 버스트'
      }
    };
  }

  // 리소스 추천 (주술사 특화)
  getResourceRecommendations() {
    const recommendations = [];

    if (this.spec === 'elemental') {
      recommendations.push(
        '소용돌이 60-90 유지 최적',
        '100 도달 전 대지 충격 사용',
        '이동 구간 대비 즉시 시전 프록 아끼기',
        '화염 충격 100% 유지 필수'
      );
    } else if (this.spec === 'enhancement') {
      recommendations.push(
        '소용돌이 무기 5스택 즉시 사용',
        '뜨거운 손 프록 놓치지 않기',
        '폭풍의 일격 쿨다운 관리',
        '원소 무기 버프 유지'
      );
    } else {
      recommendations.push(
        '마나 관리 중요 (영혼 걸음)',
        '성난 해일 사전 배치',
        '연쇄 치유 효율적 사용',
        '토템 배치 최적화'
      );
    }

    return recommendations;
  }

  // 페이즈별 조언
  getPhaseSpecificAdvice(phase) {
    const advice = [];

    if (phase === 'burst') {
      advice.push(...this.getBurstRotation());
    } else if (phase === 'aoe') {
      advice.push(...this.getAoEPriority());
    } else if (phase === 'movement') {
      advice.push(...this.getMovementTips());
    } else {
      advice.push(...this.getSustainedDPS());
    }

    return advice;
  }

  // 버스트 로테이션
  getBurstRotation() {
    if (this.spec === 'elemental') {
      return [
        '원시 정령/폭풍 정령 소환',
        '폭풍수호자 (있다면)',
        '원소 폭발 → 용암 폭발 연타',
        '천공의 부름 (PvP)',
        '번개 화살 기관총'
      ];
    } else if (this.spec === 'enhancement') {
      return [
        '야수 정령 소환',
        '파멸의 바람 활성화',
        '원소 정령 (원소 특성)',
        '폭풍의 일격 연타',
        '상급 정령과 동기화'
      ];
    } else {
      return [
        '치유의 해일 토템',
        '정신 고리 토템 (큰 피해)',
        '선조의 인도 활성화',
        '승천 (있다면)',
        '대지 정령 (응급)'
      ];
    }
  }

  // 광역 우선순위
  getAoEPriority() {
    if (this.spec === 'elemental') {
      return [
        '3+ 타겟: 지진 유지',
        '화염 충격 확산 (불꽃 정령)',
        '연쇄 번개 스팸',
        '용암 분출 (Procs)',
        '5+ 타겟: 지진만 유지'
      ];
    } else if (this.spec === 'enhancement') {
      return [
        '화염 폭풍 최우선',
        '충돌 (3+ 타겟)',
        '용암 채찍 확산',
        '연쇄 번개 (소용돌이 5+)',
        '태양광선 쿨마다'
      ];
    } else {
      return [
        '치유의 비 배치',
        '연쇄 치유 활용',
        '대지 생명 무기',
        '치유의 토템 숲',
        '정신 고리 토템 (위급시)'
      ];
    }
  }

  // 이동 중 DPS
  getMovementTips() {
    if (this.spec === 'elemental') {
      return [
        '즉시 시전 프록 활용',
        '서리 충격으로 딜 유지',
        '영혼 걸음 사전 활성화',
        '천둥폭풍으로 빠른 이동'
      ];
    } else if (this.spec === 'enhancement') {
      return [
        '근접 유지 최우선',
        '정령의 걸음 활용',
        '서리 충격 필러',
        '유령 늑대로 이동속도 증가'
      ];
    } else {
      return [
        '영혼 걸음 중 치유',
        '즉시 시전 활용',
        '토템 사전 배치',
        '바람 질주 이동'
      ];
    }
  }

  // 지속 DPS
  getSustainedDPS() {
    if (this.spec === 'elemental') {
      return [
        '화염 충격 100% 유지',
        '용암 폭발 프록 놓치지 않기',
        '소용돌이 60-90 유지',
        '원소 폭발 쿨마다',
        '11.2 버프로 번개 화살 우선순위 상승'
      ];
    } else if (this.spec === 'enhancement') {
      return [
        '원소 무기 버프 유지',
        '폭풍의 일격 최우선',
        '뜨거운 손 프록 활용',
        '소용돌이 무기 5+ 즉시 소모'
      ];
    } else {
      return [
        '성난 해일 유지',
        '마나 효율 관리',
        '토템 로테이션',
        '치유 우선순위 준수'
      ];
    }
  }

  // 11.2 패치 특별 전략
  generate11_2Strategy() {
    if (this.spec === 'elemental') {
      return {
        title: '11.2 정기 주술사 최강 빌드',
        build: {
          talents: '원시의 정령술사 빌드',
          stats: '치명타 > 가속 > 특화 > 유연성',
          trinkets: '공허석 장신구 필수'
        },
        rotation: {
          변경사항: [
            '번개 화살 우선순위 대폭 상승 (35% 버프)',
            '용암 폭발 즉시 시전 프록 최우선',
            '원소 폭발 쿨마다 사용 필수',
            'Elemental Reverb로 용암 폭발 극대화'
          ]
        },
        tips: [
          '디멘시우스전 원소 정령 타이밍 중요',
          '분쇄하는 중력 구간 영혼 걸음 아껴두기',
          '연합왕 2페이즈 지진으로 쫄 처리'
        ]
      };
    } else if (this.spec === 'enhancement') {
      return {
        title: '11.2 고양 주술사 A티어 유지',
        build: {
          talents: '원소의 무기 빌드',
          stats: '가속 > 치명타 > 특화',
          trinkets: '케이레쉬 장신구 세트'
        },
        rotation: {
          핵심: '폭풍의 일격 100% 활용',
          버스트: '야수 정령 + 파멸의 바람 콤보'
        }
      };
    }

    return null;
  }

  // PvP 전략
  generatePvPStrategy(enemyComp) {
    const strategies = {
      melee: [
        '토템 배치로 거리 유지',
        '천둥폭풍 넉백 활용',
        '유령 늑대로 도주',
        '대지속박 토템 CC 체인'
      ],
      caster: [
        '바람 전단으로 차단',
        '정화로 디버프 해제',
        '근거리 압박 (고양)',
        '토템 견제 플레이'
      ],
      default: [
        '토템 관리 최우선',
        '포지셔닝 중요',
        '쿨기 로테이션'
      ]
    };

    return strategies[enemyComp] || strategies.default;
  }

  // 신화+ 던전 전략
  generateMythicPlusStrategy(keyLevel, affix) {
    const strategy = {
      general: [
        '차단 우선순위 숙지',
        '피의 욕망 타이밍',
        '바람 전단 로테이션'
      ],
      elemental: [
        '지진 선배치',
        '폭풍수호자 대형팩',
        '천둥폭풍 넉백 활용'
      ],
      enhancement: [
        '독 정화 토템 활용',
        '태양광선 광역딜',
        '바람질주로 기동성'
      ],
      restoration: [
        '정신 고리 토템 타이밍',
        '독 정화 토템 필수',
        '대지 정령 응급 탱킹'
      ]
    };

    if (keyLevel >= 20) {
      strategy.general.push('모든 쿨기 계획적 사용');
    }

    if (affix === '케이레쉬의 잔영') {
      strategy.general.push('전기 토템으로 암살자 감지');
    }

    return strategy;
  }
}

export default ShamanExpertAI;