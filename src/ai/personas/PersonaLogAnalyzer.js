// AI 페르소나 기반 로그 분석 시스템
import personaManager from './PersonaManager.js';
import moduleEventBus from '../../services/ModuleEventBus.js';

class PersonaLogAnalyzer {
  constructor() {
    this.analysisTypes = {
      performance: this.analyzePerformance,
      rotation: this.analyzeRotation,
      cooldowns: this.analyzeCooldowns,
      positioning: this.analyzePositioning,
      deaths: this.analyzeDeaths,
      improvement: this.analyzeImprovements
    };

    this.registerModule();
  }

  // 모듈 등록
  registerModule() {
    moduleEventBus.registerModule('persona-log-analyzer', {
      name: 'AI 페르소나 로그 분석기',
      version: '1.0.0',
      type: 'analyzer'
    });

    // 이벤트 리스너
    moduleEventBus.on('analyze-log', (data) => {
      this.analyzeLog(data);
    });
  }

  // 로그 분석
  async analyzeLog({ logData, className, spec, analysisType = 'performance' }) {
    console.log(`🔍 ${className} ${spec} 로그 분석 시작...`);

    try {
      // 해당 클래스 페르소나 찾기
      const persona = personaManager.personas.get(className);

      if (!persona) {
        throw new Error(`${className} 페르소나를 찾을 수 없습니다.`);
      }

      // 페르소나의 전문 지식 활용
      const knowledge = persona.knowledge.get(spec);
      if (!knowledge) {
        throw new Error(`${spec} 전문 지식이 없습니다.`);
      }

      // 분석 타입별 처리
      const analyzer = this.analysisTypes[analysisType];
      if (!analyzer) {
        throw new Error(`지원하지 않는 분석 타입: ${analysisType}`);
      }

      // 분석 수행
      const analysis = await analyzer.call(this, logData, knowledge, spec);

      // AI 페르소나의 조언 생성
      const advice = await this.generatePersonalizedAdvice(
        persona,
        spec,
        analysis
      );

      // 점수 계산
      const score = this.calculatePerformanceScore(analysis);

      // 결과 조합
      const result = {
        summary: {
          score,
          grade: this.getGrade(score),
          mainIssues: analysis.issues || [],
          strengths: analysis.strengths || []
        },
        detailed: analysis,
        advice,
        metadata: {
          analyzedBy: persona.koreanName,
          personaLevel: persona.level,
          confidence: persona.confidence,
          timestamp: Date.now()
        }
      };

      console.log(`✅ 로그 분석 완료 (점수: ${score}/100)`);

      // 페르소나 경험치 증가
      persona.gainExperience(15);

      return {
        success: true,
        analysis: result
      };

    } catch (error) {
      console.error('로그 분석 실패:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 성능 분석
  async analyzePerformance(logData, knowledge, spec) {
    const analysis = {
      dps: {
        actual: logData.dps || 0,
        expected: knowledge.benchmarks?.dps || 100000,
        percentile: this.calculatePercentile(logData.dps, spec)
      },
      uptime: {
        buffs: this.analyzeBuffUptime(logData, knowledge),
        dots: this.analyzeDotUptime(logData, knowledge),
        activity: logData.activityTime || 95
      },
      resources: {
        wasted: this.analyzeResourceWaste(logData, knowledge),
        capping: this.analyzeResourceCapping(logData, knowledge)
      },
      issues: [],
      strengths: []
    };

    // 문제점 분석
    if (analysis.uptime.activity < 90) {
      analysis.issues.push('활동 시간이 낮음 (90% 미만)');
    }

    if (analysis.dps.percentile < 50) {
      analysis.issues.push('DPS가 평균 이하');
    }

    // 강점 분석
    if (analysis.uptime.buffs > 95) {
      analysis.strengths.push('버프 유지율 우수');
    }

    if (analysis.resources.wasted < 5) {
      analysis.strengths.push('자원 관리 효율적');
    }

    return analysis;
  }

  // 딜사이클 분석
  async analyzeRotation(logData, knowledge, spec) {
    const rotation = knowledge.rotation || {};
    const analysis = {
      opener: {
        correct: this.checkOpener(logData, rotation.opener),
        mistakes: []
      },
      priority: {
        adherence: 0,
        deviations: []
      },
      casts: {
        total: logData.totalCasts || 0,
        cpm: logData.castsPerMinute || 0,
        wrong: []
      },
      combos: {
        successful: 0,
        broken: []
      }
    };

    // 오프닝 체크
    if (!analysis.opener.correct) {
      analysis.opener.mistakes.push('오프닝 순서 틀림');
    }

    // CPM 체크
    const expectedCPM = knowledge.benchmarks?.cpm || 40;
    if (analysis.casts.cpm < expectedCPM * 0.9) {
      analysis.priority.deviations.push(`CPM이 낮음 (${analysis.casts.cpm} / ${expectedCPM})`);
    }

    return analysis;
  }

  // 쿨다운 분석
  async analyzeCooldowns(logData, knowledge, spec) {
    const analysis = {
      usage: {
        major: [],
        minor: []
      },
      timing: {
        optimal: 0,
        suboptimal: []
      },
      overlaps: [],
      wasted: []
    };

    // 주요 쿨다운 사용 분석
    const majorCooldowns = knowledge.cooldowns?.major || [];
    for (const cd of majorCooldowns) {
      const usage = this.checkCooldownUsage(logData, cd);
      analysis.usage.major.push({
        name: cd,
        uses: usage.count,
        efficiency: usage.efficiency
      });

      if (usage.efficiency < 80) {
        analysis.wasted.push(`${cd} 효율 낮음 (${usage.efficiency}%)`);
      }
    }

    return analysis;
  }

  // 포지셔닝 분석
  async analyzePositioning(logData, knowledge, spec) {
    const analysis = {
      movement: {
        unnecessary: 0,
        optimal: true
      },
      mechanics: {
        handled: [],
        failed: []
      },
      range: {
        melee: logData.meleeUptime || 0,
        ranged: logData.rangedTime || 0
      }
    };

    // 불필요한 이동 체크
    if (logData.movementTime > 30) {
      analysis.movement.unnecessary = logData.movementTime - 30;
      analysis.movement.optimal = false;
    }

    return analysis;
  }

  // 죽음 분석
  async analyzeDeaths(logData, knowledge, spec) {
    const analysis = {
      count: logData.deaths || 0,
      causes: [],
      preventable: [],
      unavoidable: []
    };

    // 죽음 원인 분석
    if (logData.deathEvents) {
      for (const death of logData.deathEvents) {
        const cause = this.analyzeDeathCause(death);
        analysis.causes.push(cause);

        if (cause.preventable) {
          analysis.preventable.push(cause);
        } else {
          analysis.unavoidable.push(cause);
        }
      }
    }

    return analysis;
  }

  // 개선점 분석
  async analyzeImprovements(logData, knowledge, spec) {
    const analysis = {
      priority: [],  // 우선 개선 사항
      quick: [],     // 빠른 개선 가능
      longterm: []   // 장기적 개선
    };

    // 모든 분석 수행
    const performance = await this.analyzePerformance(logData, knowledge, spec);
    const rotation = await this.analyzeRotation(logData, knowledge, spec);
    const cooldowns = await this.analyzeCooldowns(logData, knowledge, spec);

    // 우선순위 결정
    if (performance.dps.percentile < 30) {
      analysis.priority.push({
        area: 'DPS',
        issue: 'DPS가 매우 낮음',
        solution: '기본 딜사이클 숙달 필요'
      });
    }

    if (rotation.casts.cpm < 30) {
      analysis.quick.push({
        area: 'APM',
        issue: 'APM이 낮음',
        solution: '행동 속도 증가 필요'
      });
    }

    if (cooldowns.wasted.length > 0) {
      analysis.longterm.push({
        area: '쿨다운',
        issue: '쿨다운 활용 미흡',
        solution: '쿨다운 타이밍 연습'
      });
    }

    return analysis;
  }

  // 개인화된 조언 생성
  async generatePersonalizedAdvice(persona, spec, analysis) {
    const advice = {
      immediate: [],  // 즉시 개선 가능
      practice: [],   // 연습 필요
      advanced: []    // 고급 팁
    };

    // 페르소나의 전문 지식 기반 조언
    const knowledge = persona.knowledge.get(spec);

    // 즉시 개선 사항
    if (analysis.issues) {
      for (const issue of analysis.issues) {
        advice.immediate.push({
          issue,
          solution: this.getSolution(issue, knowledge)
        });
      }
    }

    // 연습 필요 사항
    if (analysis.detailed?.rotation?.priority?.deviations) {
      advice.practice.push({
        area: '딜사이클',
        focus: '우선순위 숙달',
        tips: knowledge.advancedTips || []
      });
    }

    // 고급 팁 (페르소나 레벨에 따라)
    if (persona.level >= 10) {
      advice.advanced = knowledge.advancedTips || [];
    }

    return advice;
  }

  // 성능 점수 계산
  calculatePerformanceScore(analysis) {
    let score = 100;

    // DPS 점수 (40점)
    if (analysis.dps) {
      const dpsRatio = analysis.dps.actual / analysis.dps.expected;
      score -= Math.max(0, 40 - (dpsRatio * 40));
    }

    // 업타임 점수 (30점)
    if (analysis.uptime) {
      const uptimeScore = (analysis.uptime.activity || 100) / 100 * 30;
      score -= (30 - uptimeScore);
    }

    // 쿨다운 점수 (20점)
    if (analysis.issues) {
      score -= analysis.issues.length * 5;
    }

    // 죽음 페널티 (10점)
    if (analysis.deaths) {
      score -= analysis.deaths.count * 10;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // 등급 결정
  getGrade(score) {
    if (score >= 95) return 'S';
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  // 보조 함수들
  calculatePercentile(dps, spec) {
    // 실제 데이터베이스와 비교하여 백분위 계산
    // 임시로 DPS 기준 계산
    const baseDPS = 100000;
    return Math.min(99, Math.max(1, Math.round((dps / baseDPS) * 50)));
  }

  analyzeBuffUptime(logData, knowledge) {
    // 버프 유지율 분석
    return logData.buffUptime || 90;
  }

  analyzeDotUptime(logData, knowledge) {
    // DoT 유지율 분석
    return logData.dotUptime || 95;
  }

  analyzeResourceWaste(logData, knowledge) {
    // 자원 낭비 분석
    return logData.resourceWaste || 5;
  }

  analyzeResourceCapping(logData, knowledge) {
    // 자원 캡핑 분석
    return logData.resourceCapping || 2;
  }

  checkOpener(logData, expectedOpener) {
    // 오프닝 체크
    if (!logData.opener || !expectedOpener) return false;
    return JSON.stringify(logData.opener) === JSON.stringify(expectedOpener);
  }

  checkCooldownUsage(logData, cooldownName) {
    // 쿨다운 사용 체크
    const uses = logData.cooldowns?.[cooldownName] || {};
    return {
      count: uses.count || 0,
      efficiency: uses.efficiency || 50
    };
  }

  analyzeDeathCause(deathEvent) {
    // 죽음 원인 분석
    return {
      time: deathEvent.time,
      cause: deathEvent.ability || '알 수 없음',
      damage: deathEvent.damage || 0,
      preventable: deathEvent.preventable !== false
    };
  }

  getSolution(issue, knowledge) {
    // 문제에 대한 해결책 제시
    const solutions = {
      '활동 시간이 낮음': '이동 최소화, ABC (Always Be Casting) 원칙 준수',
      'DPS가 평균 이하': '딜사이클 점검, 스탯 최적화 필요',
      '버프 유지율 낮음': '버프 타이밍 모니터링, WeakAura 설정 권장',
      '자원 낭비 심함': '자원 관리 개선, 오버캡 방지'
    };

    return solutions[issue] || '개선 필요';
  }
}

// 싱글톤 인스턴스
const personaLogAnalyzer = new PersonaLogAnalyzer();

export default personaLogAnalyzer;