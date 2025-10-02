// 전사 전문가 AI
import ClassExpertAI from '../ClassExpertAI';

class WarriorExpertAI extends ClassExpertAI {
  constructor(spec) {
    super('warrior', spec);

    // 전사 특화 설정
    this.specializationData = {
      arms: {
        priority: ['mortalStrike', 'overpower', 'colossusSmash', 'execute', 'slam'],
        resource: '분노',
        keyStats: ['치명타', '가속', '특화'],
        burstWindow: 'colossusSmash',
        tier11_2Bonus: {
          '2set': '치명타의 일격 피해 10% 증가',
          '4set': '거인의 일격 중 모든 능력 15% 증가'
        }
      },
      fury: {
        priority: ['rampage', 'ragingBlow', 'bloodthirst', 'execute', 'whirlwind'],
        resource: '분노',
        keyStats: ['가속', '치명타', '특화'],
        burstWindow: 'recklessness',
        tier11_2Bonus: {
          '2set': '광란 지속시간 2초 증가',
          '4set': '격노 중 치명타 확률 10% 증가'
        }
      },
      protection: {
        priority: ['shieldSlam', 'thunderClap', 'revenge', 'shieldBlock', 'ignorePain'],
        resource: '분노',
        keyStats: ['가속', '치명타', '유연성'],
        defensiveWindow: 'shieldWall',
        tier11_2Bonus: {
          '2set': '방패 막기 지속시간 1초 증가',
          '4set': '방패 밀쳐내기 피해 및 위협 수준 20% 증가'
        }
      }
    };

    this.currentSpec = this.specializationData[spec];
    this.rageManagement = {
      current: 0,
      max: 100,
      optimalRange: { min: 30, max: 80 }
    };
  }

  // 전사 특화 리소스 추천
  getResourceRecommendations() {
    const recommendations = [];
    const spec = this.currentSpec;

    if (this.spec === 'arms') {
      recommendations.push(
        '분노 30+ 유지로 제압 즉시 사용 가능',
        '거인의 일격 전 분노 최대한 확보',
        '마무리 일격은 35% 이하에서만 사용'
      );
    } else if (this.spec === 'fury') {
      recommendations.push(
        '광란 우선순위 최상',
        '격노 유지율 60% 이상 목표',
        '분노 넘침 방지를 위한 분노의 강타 사용'
      );
    } else if (this.spec === 'protection') {
      recommendations.push(
        '고통 감내 유지 우선',
        '방패 막기 물리 공격 전 사용',
        '복수 프록시 즉시 사용'
      );
    }

    return recommendations;
  }

  // 페이즈별 조언
  getPhaseSpecificAdvice(phase) {
    const advice = [];

    if (phase === 'opener') {
      advice.push(...this.getOpenerRotation());
    } else if (phase === 'execute') {
      advice.push(...this.getExecutePhaseRotation());
    } else if (phase === 'aoe') {
      advice.push(...this.getAoERotation());
    } else {
      advice.push(...this.getSustainedRotation());
    }

    return advice;
  }

  // 오프닝 로테이션
  getOpenerRotation() {
    if (this.spec === 'arms') {
      return [
        '돌진 → 치명타의 일격',
        '제압 → 거인의 일격 + 아바타',
        '치명타의 일격 → 칼날폭풍',
        '죽음의 일격 → 제압'
      ];
    } else if (this.spec === 'fury') {
      return [
        '돌진 → 무모한 희생',
        '광란 → 피의 갈증',
        '분노의 강타 → 오딘의 격노',
        '격노 프록 확인 → 광란'
      ];
    } else {
      return [
        '돌진 → 방패 밀쳐내기',
        '천둥벼락 → 방패 막기',
        '복수 → 고통 감내',
        '방패 밀쳐내기 쿨마다'
      ];
    }
  }

  // 마무리 페이즈 로테이션
  getExecutePhaseRotation() {
    if (this.spec === 'arms') {
      return [
        '마무리 일격 최우선',
        '치명타의 일격 디버프 유지',
        '제압 2스택 방지',
        '거인의 일격 쿨마다'
      ];
    } else if (this.spec === 'fury') {
      return [
        '마무리 일격 연타',
        '광란으로 격노 유지',
        '피의 갈증 쿨마다',
        '학살 특성시 20% 이하 극대화'
      ];
    } else {
      return [
        '평소 로테이션 유지',
        '위협 수준 관리 중요',
        '생존기 아끼기 (다음 페이즈 대비)'
      ];
    }
  }

  // 광역 로테이션
  getAoERotation() {
    const targetCount = 3; // 예시

    if (this.spec === 'arms') {
      return [
        `${targetCount}+ 타겟: 휩쓸기 일격 유지`,
        '회전베기 → 천둥벼락',
        '칼날폭풍 쿨마다',
        '치명타의 일격으로 깊은 상처 확산'
      ];
    } else if (this.spec === 'fury') {
      return [
        '소용돌이로 광역 버프',
        '회전베기 메인 스킬',
        '오딘의 격노 버스트',
        '피의 갈증으로 치유'
      ];
    } else {
      return [
        '천둥벼락 디버프 유지',
        '복수 프록 활용',
        '도전의 외침으로 광역 어그로',
        '무한의 고통 피해 흡수'
      ];
    }
  }

  // 지속 딜 로테이션
  getSustainedRotation() {
    if (this.spec === 'arms') {
      return [
        '거인의 일격 디버프 100% 유지',
        '치명타의 일격 쿨마다',
        '제압 2스택 방지',
        '분노 관리로 버스트 준비'
      ];
    } else if (this.spec === 'fury') {
      return [
        '격노 60%+ 유지 필수',
        '광란 최우선순위',
        '피의 갈증 쿨마다',
        '회전베기 필러'
      ];
    } else {
      return [
        '방패 막기 유지',
        '고통 감내 활성화',
        '복수 프록 즉시 사용',
        '분노 생성 최대화'
      ];
    }
  }

  // 낮은 체력 조언 (전사 특화)
  getLowHealthAdvice() {
    const advice = super.getLowHealthAdvice();

    if (this.spec === 'arms') {
      advice.push('최후의 저항 사용', '투신으로 피해 감소');
    } else if (this.spec === 'fury') {
      advice.push('피의 갈증으로 치유', '격노한 재생력 활성화');
    } else {
      advice.push('방패의 벽 사용', '최후의 저항 준비', '쿨감 떡칠 활용');
    }

    return advice;
  }

  // 낮은 분노 조언
  getLowResourceAdvice() {
    return [
      '돌진으로 분노 생성',
      '자동 공격 유지 중요',
      this.spec === 'fury' ? '피의 갈증 우선' : '방패 밀쳐내기 우선',
      '분노 생성 특성 확인'
    ];
  }

  // 전사 PvP 전략
  generatePvPStrategy(enemyClass) {
    const strategies = {
      mage: ['주문 반사 타이밍', '돌진 저장', '폭풍의 화살로 점멸 대응'],
      rogue: ['광전사의 격노로 기절 해제', '무기 해제 조심', '피의 갈증 치유'],
      priest: ['주문 반사로 공포 반사', '격노로 정신 지배 해제', '압박 유지'],
      hunter: ['간격 좁히기 중요', '애완동물 CC', '방어 태세 활용'],
      default: ['쿨기 관리', '포지셔닝', 'LoS 활용']
    };

    return strategies[enemyClass] || strategies.default;
  }

  // 신화+ 전략
  generateMythicPlusStrategy(affix, dungeonName) {
    const strategy = {
      general: [],
      tankSpecific: [],
      dpsSpecific: []
    };

    // 접두사별 전략
    if (affix === '케이레쉬의 잔영') {
      strategy.general.push('에테리얼 암살자 즉시 스턴');
    } else if (affix === '괴저') {
      strategy.general.push('괴저 대상 빠른 처리');
    }

    // 탱커 전용
    if (this.spec === 'protection') {
      strategy.tankSpecific = [
        '풀링 경로 최적화',
        '쿨기 로테이션 관리',
        '카이팅 구간 파악'
      ];
    } else {
      strategy.dpsSpecific = [
        '차단 우선순위 숙지',
        '광역딜 타이밍',
        '단일딜 집중 구간'
      ];
    }

    return strategy;
  }

  // 11.2 패치 적응
  async adaptToPatch11_2() {
    // 11.2 패치 전사 변경사항
    const changes = {
      arms: {
        buffs: ['치명타의 일격 피해 5% 증가', '칼날폭풍 쿨다운 60초'],
        nerfs: [],
        newRotation: true
      },
      fury: {
        buffs: [],
        nerfs: ['피의 갈증 치유량 감소', '광란 분노 소모 증가'],
        newRotation: false
      },
      protection: {
        buffs: ['방패 막기 지속시간 증가'],
        nerfs: [],
        newRotation: false
      }
    };

    const specChanges = changes[this.spec];

    // 버프 적용
    if (specChanges.buffs.length > 0) {
      console.log(`${this.spec} 전사 버프 적용:`, specChanges.buffs);
      this.adjustPriorityForBuffs(specChanges.buffs);
    }

    // 너프 대응
    if (specChanges.nerfs.length > 0) {
      console.log(`${this.spec} 전사 너프 대응:`, specChanges.nerfs);
      this.compensateForNerfs(specChanges.nerfs);
    }

    // 새 로테이션 학습
    if (specChanges.newRotation) {
      await this.learnNewRotation();
    }

    return {
      adapted: true,
      message: `${this.spec} 전사 11.2 패치 적응 완료`
    };
  }

  // 버프에 따른 우선순위 조정
  adjustPriorityForBuffs(buffs) {
    buffs.forEach(buff => {
      if (buff.includes('치명타의 일격')) {
        // 치명타의 일격 우선순위 상향
        const priority = this.currentSpec.priority;
        const msIndex = priority.indexOf('mortalStrike');
        if (msIndex > 0) {
          priority.splice(msIndex, 1);
          priority.unshift('mortalStrike');
        }
      }
    });
  }

  // 너프 보완 전략
  compensateForNerfs(nerfs) {
    nerfs.forEach(nerf => {
      if (nerf.includes('피의 갈증')) {
        // 생존기 사용 빈도 증가
        this.knowledgeBase.encounterStrategies.set('healing', [
          '피의 갈증 치유 감소로 포션 사용 증가',
          '격노한 재생력 특성 고려',
          '힐러와 거리 유지'
        ]);
      }
    });
  }

  // 새 로테이션 학습
  async learnNewRotation() {
    // WCL이나 시뮬레이션 데이터에서 새 로테이션 학습
    console.log('새로운 로테이션 패턴 학습 중...');

    // 임시 새 로테이션 (실제로는 데이터 분석 필요)
    if (this.spec === 'arms') {
      this.currentSpec.priority = [
        'colossusSmash',
        'mortalStrike',
        'overpower',
        'bladestorm',
        'execute',
        'slam'
      ];
    }
  }
}

export default WarriorExpertAI;