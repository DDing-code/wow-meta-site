/**
 * 패턴 학습 모듈
 * 상위 플레이어 로그를 분석하여 최적 로테이션 패턴을 학습
 */

class PatternLearningModule {
  constructor() {
    this.patterns = new Map();
    this.sequenceDatabase = new Map();
    this.performanceCorrelations = new Map();
  }

  /**
   * 로그 데이터에서 패턴 학습
   */
  learnFromLogs(logs) {
    console.log(`🧠 ${logs.length}개 로그에서 패턴 학습 시작...`);

    const patterns = {
      openers: this.analyzeOpeners(logs),
      burstWindows: this.analyzeBurstWindows(logs),
      resourceManagement: this.analyzeResourcePatterns(logs),
      cooldownUsage: this.analyzeCooldownPatterns(logs),
      prioritySystem: this.extractPriorityPatterns(logs)
    };

    // 패턴 검증 및 통계
    const validatedPatterns = this.validatePatterns(patterns, logs);
    
    // 학습된 패턴 저장
    this.storePatterns(validatedPatterns);

    console.log(`✅ 패턴 학습 완료 - ${Object.keys(validatedPatterns).length}개 카테고리`);
    
    return validatedPatterns;
  }

  /**
   * 오프너 패턴 분석
   */
  analyzeOpeners(logs) {
    const openerPatterns = [];

    logs.forEach(log => {
      if (!log.events || log.events.length === 0) return;

      // 처음 10초간의 스킬 시퀀스
      const opener = log.events
        .filter(e => e.timestamp <= 10000 && e.type === 'cast')
        .map(e => ({
          ability: e.abilityId,
          timestamp: e.timestamp,
          resources: e.resources
        }));

      if (opener.length > 0) {
        openerPatterns.push({
          sequence: opener,
          dps: log.dps,
          playerName: log.name,
          spec: log.spec
        });
      }
    });

    // 성능별로 정렬하고 상위 패턴 추출
    openerPatterns.sort((a, b) => b.dps - a.dps);
    const topPatterns = openerPatterns.slice(0, 10);

    // 공통 패턴 찾기
    return this.findCommonSequences(topPatterns);
  }

  /**
   * 버스트 윈도우 패턴 분석
   */
  analyzeBurstWindows(logs) {
    const burstPatterns = [];

    logs.forEach(log => {
      if (!log.events) return;

      // DPS 스파이크 구간 찾기
      const windows = this.identifyHighDPSWindows(log.events);

      windows.forEach(window => {
        burstPatterns.push({
          abilities: window.abilities,
          duration: window.duration,
          damage: window.totalDamage,
          dpsIncrease: window.dpsIncrease,
          triggerAbility: window.trigger,
          playerName: log.name
        });
      });
    });

    return this.clusterBurstPatterns(burstPatterns);
  }

  /**
   * 리소스 관리 패턴 분석
   */
  analyzeResourcePatterns(logs) {
    const resourcePatterns = new Map();

    logs.forEach(log => {
      if (!log.resourceChanges) return;

      const patterns = {
        averageLevel: 0,
        wastedAmount: 0,
        capTime: 0,
        efficiencyScore: 0
      };

      let totalResource = 0;
      let samples = 0;
      let previousResource = 0;
      let maxResource = 100; // 기본값, 클래스별로 다름

      log.resourceChanges.forEach((change, index) => {
        totalResource += change.current;
        samples++;

        // 리소스 낭비 감지
        if (change.current === maxResource && change.amount > 0) {
          patterns.wastedAmount += change.amount;
        }

        // 캐핑 시간 계산
        if (change.current === maxResource) {
          if (index < log.resourceChanges.length - 1) {
            const nextChange = log.resourceChanges[index + 1];
            patterns.capTime += (nextChange.timestamp - change.timestamp);
          }
        }

        previousResource = change.current;
      });

      patterns.averageLevel = totalResource / samples;
      patterns.efficiencyScore = 100 - (patterns.wastedAmount / totalResource * 100);

      const key = `${log.spec}_${log.class}`;
      if (!resourcePatterns.has(key)) {
        resourcePatterns.set(key, []);
      }
      resourcePatterns.get(key).push(patterns);
    });

    // 평균 계산
    const aggregatedPatterns = new Map();
    resourcePatterns.forEach((patterns, key) => {
      const avg = {
        optimalLevel: patterns.reduce((sum, p) => sum + p.averageLevel, 0) / patterns.length,
        maxWaste: Math.max(...patterns.map(p => p.wastedAmount)),
        efficiency: patterns.reduce((sum, p) => sum + p.efficiencyScore, 0) / patterns.length
      };
      aggregatedPatterns.set(key, avg);
    });

    return aggregatedPatterns;
  }

  /**
   * 쿨다운 사용 패턴 분석
   */
  analyzeCooldownPatterns(logs) {
    const cooldownPatterns = new Map();

    logs.forEach(log => {
      if (!log.events) return;

      const cooldownUsage = new Map();

      // 주요 쿨다운 스킬 추적
      log.events.forEach(event => {
        if (event.type === 'cast' && this.isMajorCooldown(event.abilityId)) {
          if (!cooldownUsage.has(event.abilityId)) {
            cooldownUsage.set(event.abilityId, []);
          }
          cooldownUsage.set(event.abilityId, [
            ...cooldownUsage.get(event.abilityId),
            {
              timestamp: event.timestamp,
              targetHealth: event.targetHealth,
              buffsActive: event.buffsActive || [],
              otherCooldowns: this.getActiveCooldowns(log.events, event.timestamp)
            }
          ]);
        }
      });

      // 쿨다운 정렬 패턴 분석
      const alignmentScore = this.calculateCooldownAlignment(cooldownUsage);
      
      const key = `${log.spec}_${log.class}`;
      if (!cooldownPatterns.has(key)) {
        cooldownPatterns.set(key, []);
      }
      cooldownPatterns.get(key).push({
        usage: cooldownUsage,
        alignmentScore,
        dps: log.dps
      });
    });

    return this.aggregateCooldownPatterns(cooldownPatterns);
  }

  /**
   * 우선순위 패턴 추출
   */
  extractPriorityPatterns(logs) {
    const priorityMap = new Map();

    logs.forEach(log => {
      if (!log.events) return;

      // 스킬 사용 빈도 및 타이밍 분석
      const skillUsage = new Map();
      const contextualUsage = new Map();

      log.events.forEach((event, index) => {
        if (event.type !== 'cast') return;

        const ability = event.abilityId;
        const context = this.getEventContext(log.events, index);

        // 빈도 기록
        skillUsage.set(ability, (skillUsage.get(ability) || 0) + 1);

        // 컨텍스트별 사용 기록
        const contextKey = this.serializeContext(context);
        if (!contextualUsage.has(contextKey)) {
          contextualUsage.set(contextKey, new Map());
        }
        const contextSkills = contextualUsage.get(contextKey);
        contextSkills.set(ability, (contextSkills.get(ability) || 0) + 1);
      });

      // DPS 기여도와 함께 저장
      const key = `${log.spec}_${log.class}`;
      if (!priorityMap.has(key)) {
        priorityMap.set(key, []);
      }
      priorityMap.get(key).push({
        usage: skillUsage,
        contextual: contextualUsage,
        dps: log.dps,
        playerName: log.name
      });
    });

    return this.buildPrioritySystem(priorityMap);
  }

  /**
   * 높은 DPS 구간 식별
   */
  identifyHighDPSWindows(events, windowSize = 10000) {
    const windows = [];
    let currentWindow = [];
    let windowStart = 0;

    events.forEach(event => {
      if (event.type !== 'damage') return;

      if (event.timestamp - windowStart > windowSize) {
        if (currentWindow.length > 0) {
          const totalDamage = currentWindow.reduce((sum, e) => sum + e.amount, 0);
          const duration = currentWindow[currentWindow.length - 1].timestamp - windowStart;
          const dps = totalDamage / (duration / 1000);

          windows.push({
            start: windowStart,
            end: currentWindow[currentWindow.length - 1].timestamp,
            duration,
            totalDamage,
            dps,
            abilities: [...new Set(currentWindow.map(e => e.abilityId))],
            trigger: currentWindow[0].abilityId
          });
        }
        currentWindow = [event];
        windowStart = event.timestamp;
      } else {
        currentWindow.push(event);
      }
    });

    // 평균 DPS의 150% 이상인 구간만 필터링
    const avgDPS = windows.reduce((sum, w) => sum + w.dps, 0) / windows.length;
    return windows.filter(w => w.dps > avgDPS * 1.5).map(w => ({
      ...w,
      dpsIncrease: ((w.dps - avgDPS) / avgDPS * 100)
    }));
  }

  /**
   * 공통 시퀀스 찾기 (LCS 알고리즘)
   */
  findCommonSequences(patterns) {
    if (patterns.length === 0) return [];

    const sequences = patterns.map(p => p.sequence.map(s => s.ability));
    const commonSeq = sequences[0];

    // 모든 패턴과 비교하여 공통 부분 찾기
    for (let i = 1; i < sequences.length; i++) {
      const lcs = this.longestCommonSubsequence(commonSeq, sequences[i]);
      commonSeq.splice(0, commonSeq.length, ...lcs);
    }

    return commonSeq;
  }

  /**
   * 최장 공통 부분 수열 (LCS)
   */
  longestCommonSubsequence(seq1, seq2) {
    const m = seq1.length;
    const n = seq2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (seq1[i - 1] === seq2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // 경로 역추적
    const lcs = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (seq1[i - 1] === seq2[j - 1]) {
        lcs.unshift(seq1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return lcs;
  }

  /**
   * 주요 쿨다운 여부 확인
   */
  isMajorCooldown(abilityId) {
    // 예시: 주요 쿨다운 ID 리스트
    const majorCooldowns = [
      31884,  // Avenging Wrath
      255937, // Wake of Ashes
      231895, // Crusade
      86659,  // Guardian of Ancient Kings
      // ... 각 클래스별 주요 쿨다운
    ];

    return majorCooldowns.includes(abilityId);
  }

  /**
   * 특정 시점의 활성 쿨다운 목록
   */
  getActiveCooldowns(events, timestamp) {
    const cooldowns = [];
    const lookback = 20000; // 20초 뒤까지 확인

    events.forEach(event => {
      if (event.timestamp >= timestamp - lookback &&
          event.timestamp <= timestamp &&
          event.type === 'cast' &&
          this.isMajorCooldown(event.abilityId)) {
        cooldowns.push(event.abilityId);
      }
    });

    return [...new Set(cooldowns)];
  }

  /**
   * 쿨다운 정렬 점수 계산
   */
  calculateCooldownAlignment(cooldownUsage) {
    let alignmentScore = 0;
    const cooldowns = Array.from(cooldownUsage.keys());

    for (let i = 0; i < cooldowns.length; i++) {
      for (let j = i + 1; j < cooldowns.length; j++) {
        const cd1 = cooldownUsage.get(cooldowns[i]);
        const cd2 = cooldownUsage.get(cooldowns[j]);

        cd1.forEach(use1 => {
          cd2.forEach(use2 => {
            // 5초 이내에 함께 사용되면 정렬된 것으로 간주
            if (Math.abs(use1.timestamp - use2.timestamp) <= 5000) {
              alignmentScore++;
            }
          });
        });
      }
    }

    return alignmentScore;
  }

  /**
   * 이벤트 컨텍스트 획듍
   */
  getEventContext(events, index) {
    const event = events[index];
    const context = {
      resources: event.resources || {},
      buffs: [],
      debuffs: [],
      recentAbilities: [],
      targetHealth: event.targetHealth || 100
    };

    // 최근 5개 스킬
    for (let i = Math.max(0, index - 5); i < index; i++) {
      if (events[i].type === 'cast') {
        context.recentAbilities.push(events[i].abilityId);
      }
    }

    // 현재 활성 버프/디버프
    if (event.buffsActive) {
      context.buffs = event.buffsActive;
    }
    if (event.debuffsActive) {
      context.debuffs = event.debuffsActive;
    }

    return context;
  }

  /**
   * 컨텍스트 직렬화
   */
  serializeContext(context) {
    return JSON.stringify({
      resourceLevel: Math.floor((context.resources.primary || 0) / 10) * 10,
      hasBuffs: context.buffs.length > 0,
      targetLow: context.targetHealth < 30
    });
  }

  /**
   * 패턴 검증
   */
  validatePatterns(patterns, logs) {
    const validated = {};

    Object.keys(patterns).forEach(key => {
      const pattern = patterns[key];
      
      // 통계적 유의성 검사
      if (this.isStatisticallySignificant(pattern, logs)) {
        validated[key] = pattern;
      }
    });

    return validated;
  }

  /**
   * 통계적 유의성 검사
   */
  isStatisticallySignificant(pattern, logs) {
    // 최소 샘플 수 확인
    if (logs.length < 10) return false;

    // 패턴이 비어있으면 false
    if (!pattern || (Array.isArray(pattern) && pattern.length === 0)) {
      return false;
    }

    // Map이면 크기 확인
    if (pattern instanceof Map && pattern.size === 0) {
      return false;
    }

    return true;
  }

  /**
   * 학습된 패턴 저장
   */
  storePatterns(patterns) {
    Object.keys(patterns).forEach(key => {
      this.patterns.set(key, patterns[key]);
    });
  }

  /**
   * 버스트 패턴 클러스터링
   */
  clusterBurstPatterns(patterns) {
    // K-means 클러스터링 사용하여 비슷한 패턴 그룹화
    // 간단한 구현: DPS 증가율로 정렬
    patterns.sort((a, b) => b.dpsIncrease - a.dpsIncrease);
    
    return patterns.slice(0, 5); // 상위 5개 패턴
  }

  /**
   * 쿨다운 패턴 집계
   */
  aggregateCooldownPatterns(patterns) {
    const aggregated = new Map();

    patterns.forEach((specPatterns, key) => {
      // DPS 상위 25% 플레이어의 패턴만 사용
      specPatterns.sort((a, b) => b.dps - a.dps);
      const topPatterns = specPatterns.slice(0, Math.ceil(specPatterns.length * 0.25));

      const avgAlignment = topPatterns.reduce((sum, p) => sum + p.alignmentScore, 0) / topPatterns.length;
      
      aggregated.set(key, {
        optimalAlignment: avgAlignment,
        topPatterns: topPatterns.map(p => p.usage)
      });
    });

    return aggregated;
  }

  /**
   * 우선순위 시스템 구축
   */
  buildPrioritySystem(priorityMap) {
    const systems = new Map();

    priorityMap.forEach((specData, key) => {
      // DPS 상위 플레이어 필터링
      specData.sort((a, b) => b.dps - a.dps);
      const topPerformers = specData.slice(0, Math.ceil(specData.length * 0.1));

      // 스킬 사용 빈도 집계
      const aggregatedUsage = new Map();
      topPerformers.forEach(performer => {
        performer.usage.forEach((count, ability) => {
          aggregatedUsage.set(ability, (aggregatedUsage.get(ability) || 0) + count);
        });
      });

      // 우선순위 결정
      const priorities = Array.from(aggregatedUsage.entries())
        .sort((a, b) => b[1] - a[1])
        .map((entry, index) => ({
          ability: entry[0],
          frequency: entry[1],
          priority: index + 1,
          weight: entry[1] / topPerformers.length
        }));

      systems.set(key, priorities);
    });

    return systems;
  }
}

export default PatternLearningModule;