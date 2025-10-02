// 파괴 흑마법사 전문 AI - 11.2 패치 기준
class WarlockDestructionExpert {
  constructor() {
    this.className = 'warlock';
    this.spec = 'destruction';

    // 11.2 패치 스킬 데이터
    this.skills = {
      // 주요 스킬
      chaosArrow: {
        name: '혼돈의 화살',
        castTime: 2.5,
        shardCost: 2,
        damage: 4500,
        school: 'chaos'
      },
      immolate: {
        name: '제물',
        castTime: 1.5,
        duration: 18,
        tickDamage: 350,
        tickInterval: 3
      },
      incinerate: {
        name: '소각',
        castTime: 2.0,
        damage: 850,
        shardGeneration: 0.5
      },
      conflagrate: {
        name: '점화',
        charges: 2,
        cooldown: 12,
        damage: 1200,
        shardGeneration: 0.5
      },

      // 쿨다운 스킬
      havoc: {
        name: '대혼란',
        cooldown: 45,
        duration: 10,
        effect: '혼돈의 화살 복사'
      },
      darkSoul: {
        name: '어둠의 영혼: 불안정',
        cooldown: 120,
        duration: 20,
        effect: '치명타 30% 증가'
      },
      infernal: {
        name: '불지옥불정령',
        cooldown: 180,
        duration: 30,
        damage: 2000
      }
    };

    // 특성 트리 (11.2 메타 빌드)
    this.talentBuild = {
      classTree: [
        '악마의 은총',
        '어둠의 격노',
        '정신력의 유대',
        '그림자 껴안기',
        '영혼 흡수',
        '어둠의 서약'
      ],
      specTree: [
        '대혼란',
        '역류',
        '점화',
        '파괴의 비',
        '황폐',
        '어둠의 영혼: 불안정',
        '불타는 욕망',
        '혼돈의 파편',
        '광기의 의식'
      ]
    };

    // 스탯 우선순위
    this.statPriority = {
      1: 'intellect',    // 지능
      2: 'haste',        // 가속 (28-30% 목표)
      3: 'mastery',      // 특화
      4: 'critical',     // 치명타
      5: 'versatility'   // 유연성
    };
  }

  // 로테이션 분석
  analyzeRotation(combatLog) {
    const analysis = {
      opener: this.analyzeOpener(combatLog.slice(0, 10)),
      sustain: this.analyzeSustainRotation(combatLog),
      cooldownUsage: this.analyzeCooldowns(combatLog),
      resourceManagement: this.analyzeShardUsage(combatLog)
    };

    return analysis;
  }

  // 오프너 분석
  analyzeOpener(firstCasts) {
    const idealOpener = [
      '제물 (사전 시전)',
      '불지옥불정령',
      '어둠의 영혼',
      '점화',
      '혼돈의 화살',
      '점화',
      '혼돈의 화살'
    ];

    let score = 0;
    firstCasts.forEach((cast, index) => {
      if (cast.skill === idealOpener[index]) {
        score += 10;
      }
    });

    return {
      score: score,
      maxScore: idealOpener.length * 10,
      recommendation: score < 70 ? '오프너 순서 개선 필요' : '올바른 오프너'
    };
  }

  // 파편 관리 분석
  analyzeShardUsage(combatLog) {
    let wastedShards = 0;
    let overcapMoments = 0;
    let efficientCasts = 0;

    combatLog.forEach(entry => {
      if (entry.shards > 4.5) {
        overcapMoments++;
      }
      if (entry.skill === 'chaosArrow' && entry.buffs.includes('havoc')) {
        efficientCasts++;
      }
    });

    return {
      efficiency: (efficientCasts / combatLog.length) * 100,
      overcapRate: (overcapMoments / combatLog.length) * 100,
      recommendation: overcapMoments > 5 ? '파편 낭비 줄이기' : '효율적인 자원 관리'
    };
  }

  // 쿨다운 사용 분석
  analyzeCooldowns(combatLog) {
    const cooldownWindows = [];
    let darkSoulUses = 0;
    let infernalUses = 0;

    combatLog.forEach(entry => {
      if (entry.skill === 'darkSoul') darkSoulUses++;
      if (entry.skill === 'infernal') infernalUses++;
    });

    const fightDuration = combatLog[combatLog.length - 1].timestamp;
    const expectedDarkSoul = Math.floor(fightDuration / 120) + 1;
    const expectedInfernal = Math.floor(fightDuration / 180) + 1;

    return {
      darkSoulEfficiency: (darkSoulUses / expectedDarkSoul) * 100,
      infernalEfficiency: (infernalUses / expectedInfernal) * 100,
      recommendation: darkSoulUses < expectedDarkSoul ? '쿨다운 더 자주 사용' : '적절한 쿨다운 사용'
    };
  }

  // 실시간 조언 생성
  getRealtimeAdvice(currentState) {
    const advice = [];

    // 파편 관리
    if (currentState.shards >= 4.5) {
      advice.push({
        priority: 'high',
        message: '파편 초과! 혼돈의 화살 즉시 사용'
      });
    }

    // 디버프 관리
    if (!currentState.debuffs.immolate || currentState.debuffs.immolate < 3) {
      advice.push({
        priority: 'high',
        message: '제물 새로고침 필요'
      });
    }

    // 쿨다운 관리
    if (currentState.bossHp < 35 && currentState.cooldowns.darkSoul.ready) {
      advice.push({
        priority: 'medium',
        message: '처형 페이즈 - 어둠의 영혼 사용'
      });
    }

    // 대혼란 최적화
    if (currentState.cooldowns.havoc.ready && currentState.shards >= 4) {
      advice.push({
        priority: 'high',
        message: '대혼란 + 혼돈의 화살 콤보 준비'
      });
    }

    return advice;
  }

  // DPS 시뮬레이션
  simulateDPS(stats, fightLength = 300) {
    const sim = {
      totalDamage: 0,
      castCount: {},
      timeline: []
    };

    let currentTime = 0;
    let shards = 3;
    let gcd = 1.5 / (1 + stats.haste / 100);

    while (currentTime < fightLength) {
      // 우선순위 기반 스킬 선택
      let nextCast = this.selectNextCast(shards, currentTime);

      // 데미지 계산
      let damage = this.calculateDamage(nextCast, stats);
      sim.totalDamage += damage;

      // 타임라인 기록
      sim.timeline.push({
        time: currentTime,
        skill: nextCast.name,
        damage: damage,
        shards: shards
      });

      // 자원 업데이트
      if (nextCast.shardCost) shards -= nextCast.shardCost;
      if (nextCast.shardGeneration) shards = Math.min(5, shards + nextCast.shardGeneration);

      currentTime += gcd;
    }

    sim.dps = sim.totalDamage / fightLength;
    return sim;
  }

  // 스킬 선택 로직
  selectNextCast(shards, currentTime) {
    if (shards >= 2) {
      return this.skills.chaosArrow;
    } else if (shards < 4) {
      return this.skills.incinerate;
    }
    return this.skills.conflagrate;
  }

  // 데미지 계산
  calculateDamage(skill, stats) {
    let damage = skill.damage || 0;
    damage *= (1 + stats.intellect / 1000);
    damage *= (1 + stats.versatility / 100);

    // 치명타 계산
    if (Math.random() < stats.critical / 100) {
      damage *= 2;
    }

    // 특화 적용 (혼돈 데미지 증가)
    if (skill.school === 'chaos') {
      damage *= (1 + stats.mastery / 100 * 0.18);
    }

    return Math.floor(damage);
  }
}

export default WarlockDestructionExpert;