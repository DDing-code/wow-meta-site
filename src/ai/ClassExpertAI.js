// WoW 직업별 전문가 AI 시스템
// 각 직업별 고수 AI가 최신 데이터를 학습하고 공략 업데이트

import { koreanTranslations } from '../data/koreanTranslations';
import LogParserService from '../services/LogParserService';
import WowDatabaseService from '../services/WowDatabaseService';

// 기본 클래스 전문가 AI
class ClassExpertAI {
  constructor(className, spec) {
    this.className = className;
    this.spec = spec;
    this.koreanName = koreanTranslations.classes[className];
    this.specKorean = koreanTranslations.specializations[spec];

    // 학습 데이터 저장소
    this.knowledgeBase = {
      rotation: [],
      gearOptimization: [],
      encounterStrategies: new Map(),
      performanceMetrics: [],
      lastUpdated: new Date()
    };

    // 성능 통계
    this.statistics = {
      averageDPS: 0,
      parsePercentile: 0,
      successRate: 0,
      improvementRate: 0
    };

    // AI 설정
    this.config = {
      learningRate: 0.01,
      confidenceThreshold: 0.85,
      updateFrequency: 3600000, // 1시간
      dataRetentionDays: 30
    };
  }

  // 로그 데이터에서 학습
  async learnFromLogs(logData) {
    try {
      const analysis = await LogParserService.analyzeCombat(
        logData.logCode,
        logData.playerId,
        logData.fightId,
        this.className,
        this.spec
      );

      // 성공적인 전투에서 패턴 학습
      if (analysis.score > 80) {
        this.extractSuccessfulPatterns(analysis);
      }

      // 실패 분석에서 개선점 도출
      if (analysis.suggestions.length > 0) {
        this.processImprovementSuggestions(analysis.suggestions);
      }

      // 지식 베이스 업데이트
      this.updateKnowledgeBase(analysis);

      return {
        learned: true,
        improvements: analysis.suggestions,
        newStrategies: this.generateNewStrategies(analysis)
      };
    } catch (error) {
      console.error(`학습 실패 (${this.koreanName}):`, error);
      return { learned: false, error: error.message };
    }
  }

  // 성공 패턴 추출
  extractSuccessfulPatterns(analysis) {
    const patterns = {
      timestamp: Date.now(),
      dps: analysis.performance.dps,
      rotation: this.analyzeRotationPattern(analysis.performance.timeline),
      cooldownUsage: this.analyzeCooldownEfficiency(analysis.performance.abilities),
      positioning: this.extractPositionalData(analysis)
    };

    // 기존 패턴과 비교하여 개선된 경우만 저장
    if (this.isImprovedPattern(patterns)) {
      this.knowledgeBase.rotation.push(patterns);
      this.optimizeRotation(patterns);
    }
  }

  // 로테이션 패턴 분석
  analyzeRotationPattern(timeline) {
    const pattern = [];
    let lastAbility = null;
    let combo = [];

    timeline.forEach(event => {
      if (event.type === 'cast' || event.type === 'damage') {
        if (lastAbility && event.ability !== lastAbility) {
          if (combo.length > 1) {
            pattern.push({
              sequence: [...combo],
              frequency: 1,
              effectiveness: this.calculateEffectiveness(combo)
            });
          }
          combo = [event.ability];
        } else {
          combo.push(event.ability);
        }
        lastAbility = event.ability;
      }
    });

    return this.consolidatePatterns(pattern);
  }

  // 패턴 통합 및 최적화
  consolidatePatterns(patterns) {
    const consolidated = new Map();

    patterns.forEach(pattern => {
      const key = pattern.sequence.join('-');
      if (consolidated.has(key)) {
        const existing = consolidated.get(key);
        existing.frequency += pattern.frequency;
        existing.effectiveness = (existing.effectiveness + pattern.effectiveness) / 2;
      } else {
        consolidated.set(key, pattern);
      }
    });

    return Array.from(consolidated.values())
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 10); // 상위 10개 패턴만 유지
  }

  // 개선 제안 처리
  processImprovementSuggestions(suggestions) {
    suggestions.forEach(suggestion => {
      const improvement = {
        category: suggestion.category,
        severity: suggestion.severity,
        description: suggestion.text,
        impact: suggestion.impact,
        implemented: false,
        timestamp: Date.now()
      };

      // 카테고리별로 개선사항 분류
      if (!this.knowledgeBase.encounterStrategies.has(suggestion.category)) {
        this.knowledgeBase.encounterStrategies.set(suggestion.category, []);
      }

      this.knowledgeBase.encounterStrategies.get(suggestion.category).push(improvement);
    });
  }

  // 새로운 전략 생성
  generateNewStrategies(analysis) {
    const strategies = [];

    // DPS 최적화 전략
    if (analysis.performance.dps < this.statistics.averageDPS * 0.9) {
      strategies.push(this.generateDPSOptimizationStrategy(analysis));
    }

    // 생존 전략
    if (analysis.deaths > 0) {
      strategies.push(this.generateSurvivalStrategy(analysis));
    }

    // 리소스 관리 전략
    strategies.push(this.generateResourceManagementStrategy(analysis));

    return strategies.filter(s => s !== null);
  }

  // DPS 최적화 전략 생성
  generateDPSOptimizationStrategy(analysis) {
    const topPatterns = this.knowledgeBase.rotation
      .sort((a, b) => b.dps - a.dps)
      .slice(0, 3);

    if (topPatterns.length === 0) return null;

    return {
      type: 'dps_optimization',
      priority: 'high',
      recommendations: [
        `현재 DPS: ${analysis.performance.dps.toFixed(0)}`,
        `목표 DPS: ${(this.statistics.averageDPS * 1.1).toFixed(0)}`,
        `추천 로테이션: ${this.formatRotationRecommendation(topPatterns[0])}`,
        `주요 개선점: ${this.identifyKeyImprovements(analysis)}`
      ]
    };
  }

  // 생존 전략 생성
  generateSurvivalStrategy(analysis) {
    return {
      type: 'survival',
      priority: 'critical',
      recommendations: [
        '개인 생존기 로테이션 개선 필요',
        '위험 구간 예측 및 사전 대응',
        '포지셔닝 최적화로 피해 최소화'
      ]
    };
  }

  // 리소스 관리 전략
  generateResourceManagementStrategy(analysis) {
    return {
      type: 'resource_management',
      priority: 'medium',
      recommendations: this.getResourceRecommendations()
    };
  }

  // 지식 베이스 업데이트
  updateKnowledgeBase(analysis) {
    // 성능 메트릭 업데이트
    this.knowledgeBase.performanceMetrics.push({
      timestamp: Date.now(),
      dps: analysis.performance.dps,
      score: analysis.score,
      suggestions: analysis.suggestions.length
    });

    // 오래된 데이터 정리
    this.cleanOldData();

    // 통계 재계산
    this.recalculateStatistics();

    this.knowledgeBase.lastUpdated = new Date();
  }

  // 오래된 데이터 정리
  cleanOldData() {
    const cutoffTime = Date.now() - (this.config.dataRetentionDays * 24 * 60 * 60 * 1000);

    this.knowledgeBase.performanceMetrics = this.knowledgeBase.performanceMetrics
      .filter(metric => metric.timestamp > cutoffTime);

    this.knowledgeBase.rotation = this.knowledgeBase.rotation
      .filter(pattern => pattern.timestamp > cutoffTime);
  }

  // 통계 재계산
  recalculateStatistics() {
    if (this.knowledgeBase.performanceMetrics.length === 0) return;

    const metrics = this.knowledgeBase.performanceMetrics;

    this.statistics.averageDPS = metrics.reduce((sum, m) => sum + m.dps, 0) / metrics.length;
    this.statistics.parsePercentile = metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length;

    // 개선율 계산 (최근 10개와 이전 10개 비교)
    if (metrics.length >= 20) {
      const recent = metrics.slice(-10);
      const previous = metrics.slice(-20, -10);

      const recentAvg = recent.reduce((sum, m) => sum + m.dps, 0) / recent.length;
      const previousAvg = previous.reduce((sum, m) => sum + m.dps, 0) / previous.length;

      this.statistics.improvementRate = ((recentAvg - previousAvg) / previousAvg) * 100;
    }
  }

  // 실시간 조언 생성 (가이드 품질의 상세 분석 포함)
  generateRealTimeAdvice(currentSituation) {
    const advice = {
      immediate: [],
      rotation: [],
      positioning: [],
      cooldowns: [],
      tips: [],
      detailedAnalysis: null
    };

    // 상황별 조언
    if (currentSituation.phase) {
      advice.immediate.push(...this.getPhaseSpecificAdvice(currentSituation.phase));
      advice.rotation = this.getDetailedRotation(currentSituation.phase);
      advice.cooldowns = this.getCooldownUsage(currentSituation.phase);
    }

    if (currentSituation.health < 30) {
      advice.immediate.push(...this.getLowHealthAdvice());
    }

    if (currentSituation.resource < 20) {
      advice.immediate.push(...this.getLowResourceAdvice());
    }

    // 상세한 로테이션 분석 추가
    advice.detailedAnalysis = this.generateDetailedRotationAnalysis(currentSituation);

    return advice;
  }

  // 상세한 로테이션 분석 생성 (가이드 품질)
  generateDetailedRotationAnalysis(situation) {
    const analysis = {
      phase: situation.phase || 'sustained',
      rotation: [],
      priority: [],
      timing: [],
      tips: [],
      efficiency: 0
    };

    // 클래스별 상세 로테이션 데이터 가져오기
    const classSpec = `${this.className}_${this.spec}`;
    const detailedRotation = this.getClassSpecificRotation(classSpec, situation.phase);

    if (detailedRotation) {
      analysis.rotation = detailedRotation.sequence || detailedRotation.priority || [];
      analysis.priority = detailedRotation.notes || '';
      analysis.tips = detailedRotation.tips || [];
    }

    // 효율성 계산
    analysis.efficiency = this.calculateEfficiency(situation);

    // 타이밍 분석
    if (situation.encounter) {
      analysis.timing = this.getEncounterSpecificTiming(situation.encounter, situation.phase);
    }

    // 개선 포인트 추가
    if (situation.playerMetrics) {
      const improvements = this.identifyImprovements(situation.playerMetrics);
      analysis.improvements = improvements;
    }

    return analysis;
  }

  // 클래스별 상세 로테이션 가져오기
  getClassSpecificRotation(classSpec, phase) {
    // realCombatData에서 상세 로테이션 가져오기
    const { realCombatData } = require('../data/realCombatData');
    const detailedRotations = realCombatData.detailedRotations || {};
    const rotation = detailedRotations[classSpec];

    if (!rotation) {
      // 폴백: 기본 로테이션 반환
      return this.getDefaultRotation(phase);
    }

    // 페이즈별 로테이션 반환
    switch(phase) {
      case 'opener':
        return rotation.opener;
      case 'burst':
        return rotation.burst;
      case 'execute':
        return rotation.execute;
      default:
        return rotation.sustained;
    }
  }

  // 기본 로테이션 (폴백)
  getDefaultRotation(phase) {
    return {
      sequence: [
        { ability: 'Primary Ability', timing: '0s', reason: 'Main damage' },
        { ability: 'Secondary Ability', timing: '1s', reason: 'Filler' }
      ],
      priority: 'Use abilities on cooldown',
      notes: 'Basic rotation pattern',
      tips: ['Practice on training dummy', 'Use WeakAuras for tracking']
    };
  }

  // 상세 로테이션 가져오기
  getDetailedRotation(phase) {
    const classSpec = `${this.className}_${this.spec}`;
    const rotation = this.getClassSpecificRotation(classSpec, phase);

    if (rotation && rotation.sequence) {
      return rotation.sequence.map(step =>
        `${step.timing}: ${step.ability} - ${step.reason}`
      );
    } else if (rotation && rotation.priority) {
      return rotation.priority.map(step =>
        `${step.ability} (${step.condition}) - ${step.reason}`
      );
    }

    return ['Use primary abilities on cooldown', 'Manage resources efficiently'];
  }

  // 쿨다운 사용법
  getCooldownUsage(phase) {
    const usage = [];

    switch(phase) {
      case 'opener':
        usage.push('Use all major cooldowns at pull');
        usage.push('Align burst windows with raid buffs');
        break;
      case 'burst':
        usage.push('Stack all available cooldowns');
        usage.push('Use potions and trinkets');
        break;
      case 'execute':
        usage.push('Save short cooldowns for execute phase');
        usage.push('Use execute-specific abilities');
        break;
      default:
        usage.push('Use cooldowns on cooldown unless burst phase is near');
        usage.push('Hold 2-3 minute cooldowns for burst windows');
    }

    return usage;
  }

  // 효율성 계산
  calculateEfficiency(situation) {
    if (!situation.playerMetrics) return 0.5;

    const currentDPS = situation.playerMetrics.dps || 0;
    const targetDPS = this.statistics.averageDPS || 6000000;

    return Math.min(1.0, currentDPS / targetDPS);
  }

  // 개선점 식별
  identifyImprovements(playerMetrics) {
    const improvements = [];

    if (playerMetrics.dps < this.statistics.averageDPS * 0.9) {
      improvements.push({
        type: 'dps',
        severity: 'high',
        suggestion: 'Review rotation priority and cooldown usage'
      });
    }

    if (playerMetrics.deaths > 0) {
      improvements.push({
        type: 'survival',
        severity: 'critical',
        suggestion: 'Improve defensive cooldown usage and positioning'
      });
    }

    if (playerMetrics.activity < 90) {
      improvements.push({
        type: 'activity',
        severity: 'medium',
        suggestion: 'Reduce downtime and improve uptime on target'
      });
    }

    return improvements;
  }

  // 인카운터별 타이밍
  getEncounterSpecificTiming(encounter, phase) {
    // 예시: Manaforge Omega 보스별 타이밍
    const timings = [];

    if (encounter === 'plexus_sentinel') {
      timings.push('Save burst for vulnerability windows at 2:00, 4:00, 6:00');
      timings.push('Use defensives for Plasma Barrage at 1:30, 3:30, 5:30');
    }

    return timings;
  }

  // 패치 노트 학습
  async learnFromPatchNotes(patchData) {
    // 클래스 변경사항 분석
    const changes = patchData.classChanges[this.className];
    if (!changes) return;

    // 변경사항을 기반으로 전략 조정
    this.adjustStrategiesForPatch(changes);

    // 새로운 최적 빌드 계산
    this.calculateOptimalBuild(changes);

    return {
      adapted: true,
      newStrategies: this.knowledgeBase.encounterStrategies,
      message: `${this.koreanName} ${this.specKorean} 패치 ${patchData.version} 적응 완료`
    };
  }

  // 다른 AI와 지식 공유
  shareKnowledge(targetAI) {
    // 성공적인 패턴 공유
    const sharedPatterns = this.knowledgeBase.rotation
      .filter(pattern => pattern.effectiveness > 0.8);

    return {
      className: this.className,
      spec: this.spec,
      patterns: sharedPatterns,
      statistics: this.statistics
    };
  }

  // 학습 데이터 저장
  async saveKnowledgeBase() {
    try {
      const data = {
        className: this.className,
        spec: this.spec,
        knowledgeBase: this.knowledgeBase,
        statistics: this.statistics,
        savedAt: new Date().toISOString()
      };

      localStorage.setItem(
        `ai_knowledge_${this.className}_${this.spec}`,
        JSON.stringify(data)
      );

      return { saved: true };
    } catch (error) {
      console.error('지식 베이스 저장 실패:', error);
      return { saved: false, error: error.message };
    }
  }

  // 학습 데이터 로드
  async loadKnowledgeBase() {
    try {
      const saved = localStorage.getItem(`ai_knowledge_${this.className}_${this.spec}`);
      if (!saved) return { loaded: false, message: '저장된 데이터 없음' };

      const data = JSON.parse(saved);
      this.knowledgeBase = data.knowledgeBase;
      this.statistics = data.statistics;

      // Map 객체 복원
      this.knowledgeBase.encounterStrategies = new Map(
        Object.entries(data.knowledgeBase.encounterStrategies || {})
      );

      return { loaded: true, lastSaved: data.savedAt };
    } catch (error) {
      console.error('지식 베이스 로드 실패:', error);
      return { loaded: false, error: error.message };
    }
  }

  // 추상 메서드들 (각 클래스별 AI가 구현)
  getResourceRecommendations() {
    throw new Error('각 직업별 AI가 구현해야 합니다');
  }

  getPhaseSpecificAdvice(phase) {
    throw new Error('각 직업별 AI가 구현해야 합니다');
  }

  getLowHealthAdvice() {
    return ['생존기 사용', '포션 사용 고려', '안전 위치로 이동'];
  }

  getLowResourceAdvice() {
    throw new Error('각 직업별 AI가 구현해야 합니다');
  }

  calculateEffectiveness(combo) {
    return combo.length * 0.1; // 기본 구현
  }

  isImprovedPattern(pattern) {
    return pattern.dps > this.statistics.averageDPS;
  }

  formatRotationRecommendation(pattern) {
    return pattern.rotation.map(r => r.sequence.join(' → ')).join(', ');
  }

  identifyKeyImprovements(analysis) {
    return analysis.suggestions.slice(0, 3).map(s => s.text).join(', ');
  }

  adjustStrategiesForPatch(changes) {
    // 패치 변경사항에 따른 전략 조정
    console.log(`${this.koreanName} 전략 조정 중...`, changes);
  }

  calculateOptimalBuild(changes) {
    // 최적 빌드 재계산
    console.log(`${this.koreanName} 최적 빌드 계산 중...`, changes);
  }

  // ============ 누락된 메서드 추가 ============

  // 고성능 패턴 학습
  async learnFromHighPerformance(data) {
    try {
      // 고성능 데이터에서 패턴 추출
      const patterns = {
        dps: data.playerMetrics?.dps || 0,
        rotation: [],
        timestamp: data.timestamp
      };

      // 기존 최고 성능보다 높으면 저장
      if (patterns.dps > this.statistics.averageDPS * 1.2) {
        this.knowledgeBase.performanceMetrics.push(patterns);
        this.statistics.averageDPS = (this.statistics.averageDPS + patterns.dps) / 2;

        console.log(`🎯 ${this.koreanName} ${this.specKorean}: 고성능 패턴 학습 완료 (DPS: ${patterns.dps})`);
      }

      return true;
    } catch (error) {
      console.error(`${this.koreanName} 고성능 학습 오류:`, error);
      return false;
    }
  }

  // 배치 패턴 분석
  async analyzeBatchPatterns(logs) {
    try {
      const patterns = [];

      for (const log of logs) {
        // 각 로그에서 패턴 추출
        const pattern = this.extractPattern(log);
        if (pattern) {
          patterns.push(pattern);
        }
      }

      // 패턴 통계 업데이트
      if (patterns.length > 0) {
        const avgDps = patterns.reduce((sum, p) => sum + (p.dps || 0), 0) / patterns.length;
        this.statistics.averageDPS = (this.statistics.averageDPS * 0.7) + (avgDps * 0.3);
      }

      return patterns;
    } catch (error) {
      console.error(`${this.koreanName} 배치 패턴 분석 오류:`, error);
      return [];
    }
  }

  // 패턴 추출
  extractPattern(log) {
    try {
      return {
        id: log.id,
        dps: log.dps || 0,
        rotation: [],
        effectiveness: (log.dps || 0) / 150000, // 15만 DPS 기준
        timestamp: log.timestamp
      };
    } catch (error) {
      console.error('패턴 추출 오류:', error);
      return null;
    }
  }

  // 페이즈별 조언
  getPhaseSpecificAdvice(phase) {
    const adviceMap = {
      'phase1': ['1페이즈 포지셔닝 유지', '자원 관리에 집중'],
      'phase2': ['2페이즈 버스트 준비', '이동기 아껴두기'],
      'phase3': ['3페이즈 생존기 사용', '최대 화력 집중'],
      'burst': ['버스트 윈도우 극대화', '모든 쿨다운 동기화'],
      'execute': ['마무리 페이즈 전환', '처형 기술 우선순위'],
      'intermission': ['페이즈 전환 대비', '자원 회복 시간']
    };

    return adviceMap[phase] || ['페이즈에 맞는 전략 실행'];
  }

  // 낮은 체력 조언
  getLowHealthAdvice() {
    return [
      '생존기 즉시 사용',
      '방어 태세 전환',
      '힐러에게 가까이 이동'
    ];
  }

  // 낮은 자원 조언
  getLowResourceAdvice() {
    const resourceAdvice = {
      'warrior': ['분노 생성 기술 우선'],
      'shaman': ['마나 회복 토템 사용'],
      'deathknight': ['룬 재생성 대기'],
      'paladin': ['신성한 힘 생성 집중'],
      'hunter': ['집중 회복 대기'],
      'rogue': ['기력 회복 대기'],
      'priest': ['마나 회복 주문 사용'],
      'mage': ['환기 또는 마나 보석 사용'],
      'warlock': ['생명력 전환 고려'],
      'monk': ['기력/기 균형 조절'],
      'druid': ['자원 형태별 관리'],
      'demonhunter': ['격노/고통 생성 집중'],
      'evoker': ['정수 회복 대기']
    };

    return resourceAdvice[this.className] || ['자원 회복 대기'];
  }
}

export default ClassExpertAI;