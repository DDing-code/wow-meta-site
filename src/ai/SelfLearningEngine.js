/**
 * 자가 학습 SimC 엔진
 * WarcraftLogs 데이터를 분석하여 스스로 최적 로테이션을 학습하는 AI 시스템
 */

import WarcraftLogsConnector from './WarcraftLogsConnector.js';
import SimCAPLParser from './SimCAPLParser.js';
import PatternLearningModule from './PatternLearningModule.js';

class SelfLearningEngine {
  constructor(clientId, clientSecret) {
    // 핵심 모듈 초기화
    this.warcraftLogs = new WarcraftLogsConnector(clientId, clientSecret);
    this.aplParser = new SimCAPLParser();
    this.patternLearner = new PatternLearningModule();

    // 데이터 저장소
    this.patterns = new Map(); // 학습된 패턴 저장
    this.aplRules = new Map(); // 동적 생성된 APL 규칙
    this.performanceMetrics = new Map(); // 성능 지표
    this.learningHistory = []; // 학습 이력
    this.currentBestDPS = 0;
  }

  /**
   * 1단계: 상위 로그 수집 및 분석
   */
  async collectTopPerformerLogs(spec, encounter) {
    console.log(`📊 ${spec} 최상위 로그 수집 시작...`);

    try {
      // WarcraftLogs API를 통한 실제 데이터 수집
      const topLogs = await this.warcraftLogs.fetchTopPlayerLogs(spec, encounter, {
        percentile: 99,
        limit: 100
      });

      // 상세 로그 데이터 수집
      const detailedLogs = [];
      for (const log of topLogs.slice(0, 10)) { // 상위 10개만 상세 분석
        const details = await this.warcraftLogs.fetchReportDetails(log.reportCode, log.name);
        if (details) {
          detailedLogs.push({
            ...log,
            events: details.events,
            playerInfo: details.playerInfo
          });
        }
      }

      console.log(`✅ ${detailedLogs.length}개 상세 로그 수집 완료`);
      return detailedLogs;
    } catch (error) {
      console.error('❌ 로그 수집 실패:', error);
      return [];
    }
  }

  /**
   * 2단계: 패턴 인식 및 학습
   */
  analyzeRotationPatterns(logs) {
    console.log(`🧠 ${logs.length}개 로그에서 패턴 학습 중...`);

    // 패턴 학습 모듈 사용
    const learnedPatterns = this.patternLearner.learnFromLogs(logs);

    // 학습된 패턴 저장
    this.patterns = new Map([
      ...this.patterns,
      ...Object.entries(learnedPatterns)
    ]);

    console.log(`✅ 패턴 학습 완료:`);
    console.log(`  - 오프너: ${learnedPatterns.openers?.length || 0}개`);
    console.log(`  - 버스트: ${learnedPatterns.burstWindows?.length || 0}개`);
    console.log(`  - 우선순위: ${learnedPatterns.prioritySystem?.size || 0}개 직업`);

    return learnedPatterns;
  }

  /**
   * 3단계: 동적 APL 생성
   */
  generateDynamicAPL(patterns, spec) {
    console.log(`📝 ${spec} 동적 APL 생성 중...`);

    const aplString = [];
    aplString.push(`# 자동 생성된 ${spec} APL`);
    aplString.push(`# 생성 시간: ${new Date().toISOString()}`);
    aplString.push(`# 기반 데이터: ${patterns.prioritySystem?.size || 0}개 패턴\n`);

    // 오프너 생성
    if (patterns.openers && patterns.openers.length > 0) {
      aplString.push('actions.precombat=flask');
      aplString.push('actions.precombat+=augmentation');
      aplString.push('actions.precombat+=food');
      aplString.push('actions.precombat+=snapshot_stats\n');
    }

    // 기본 액션 리스트
    aplString.push('actions=auto_attack');
    aplString.push('actions+=/use_items');

    // 우선순위 시스템을 APL로 변환
    const specKey = `${spec}_${this.getClassFromSpec(spec)}`;
    const priorities = patterns.prioritySystem?.get(specKey);

    if (priorities) {
      priorities.forEach((priority, index) => {
        const conditions = this.buildAPLConditions(priority, patterns);
        if (conditions) {
          aplString.push(`actions+="${priority.ability},if=${conditions}"`);
        } else {
          aplString.push(`actions+="${priority.ability}"`);
        }
      });
    }

    const aplText = aplString.join('\n');

    // APL 파싱 및 컴파일
    const parsedAPL = this.aplParser.parse(aplText);
    const compiledAPL = this.aplParser.compile(parsedAPL);

    // 저장
    this.aplRules.set(spec, {
      text: aplText,
      parsed: parsedAPL,
      compiled: compiledAPL,
      timestamp: Date.now()
    });

    console.log(`✅ APL 생성 완료 - ${aplString.length}줄`);
    return compiledAPL;
  }

  /**
   * 4단계: 시뮬레이션 및 검증
   */
  async simulateAndValidate(apl, character) {
    const simulator = new CombatSimulator(character, apl);
    const results = [];

    // 1000번 시뮬레이션 실행
    for (let i = 0; i < 1000; i++) {
      const result = simulator.run({
        duration: 300,
        targetCount: 1,
        movement: 'low'
      });

      results.push(result);
    }

    const avgDPS = this.calculateAverageDPS(results);
    const consistency = this.calculateConsistency(results);

    return { avgDPS, consistency, results };
  }

  /**
   * 5단계: 자가 개선 루프
   */
  async selfImprove(currentAPL, realWorldLogs) {
    console.log('🔄 자가 개선 프로세스 시작...');

    // 실제 로그와 시뮬레이션 비교
    const discrepancies = this.compareSimToReality(currentAPL, realWorldLogs);

    // 차이점 분석
    const improvements = discrepancies.map(disc => ({
      condition: disc.situation,
      currentAction: disc.simAction,
      betterAction: disc.realAction,
      dpsGain: disc.performanceGap
    }));

    // APL 업데이트
    const updatedAPL = this.updateAPLRules(currentAPL, improvements);

    // 재검증
    const validation = await this.simulateAndValidate(updatedAPL);

    if (validation.avgDPS > this.currentBestDPS) {
      console.log(`✅ DPS 개선: ${this.currentBestDPS} → ${validation.avgDPS}`);
      this.currentBestDPS = validation.avgDPS;
      return updatedAPL;
    }

    return currentAPL;
  }

  /**
   * 6단계: 상황별 적응형 학습
   */
  learnSituationalAdaptations(logs) {
    const situations = {
      singleTarget: [],
      cleave: [],
      aoe: [],
      movement: [],
      execute: []
    };

    logs.forEach(log => {
      const context = this.identifyContext(log);
      const optimalActions = this.extractOptimalActions(log, context);

      situations[context].push(optimalActions);
    });

    return this.buildContextualAPL(situations);
  }

  /**
   * 학습 이력 추가
   */
  addLearningHistory(entry) {
    this.learningHistory.push({
      timestamp: Date.now(),
      ...entry
    });

    // 최대 100개 이력만 유지
    if (this.learningHistory.length > 100) {
      this.learningHistory.shift();
    }
  }

  /**
   * 성능 메트릭 업데이트
   */
  updatePerformanceMetrics(spec, metrics) {
    if (!this.performanceMetrics.has(spec)) {
      this.performanceMetrics.set(spec, []);
    }

    const specMetrics = this.performanceMetrics.get(spec);
    specMetrics.push({
      timestamp: Date.now(),
      ...metrics
    });

    // 최근 50개만 유지
    if (specMetrics.length > 50) {
      specMetrics.shift();
    }
  }

  /**
   * APL 조건문 생성
   */
  buildAPLConditions(priority, patterns) {
    const conditions = [];

    // 기본 리소스 조건
    if (priority.weight > 0.5) {
      // 자주 사용되는 스킬은 리소스 조건 추가
      const resourceType = this.getResourceType(priority.ability);
      if (resourceType) {
        conditions.push(`${resourceType}>=3`);
      }
    }

    // 쿨다운 정렬 패턴 적용
    const cooldownPatterns = patterns.cooldownUsage;
    if (cooldownPatterns && cooldownPatterns.has(priority.ability)) {
      const cdPattern = cooldownPatterns.get(priority.ability);
      if (cdPattern.optimalAlignment) {
        conditions.push('raid_event.adds.in>10');
      }
    }

    // 타겟 수 조건
    if (this.isAOEAbility(priority.ability)) {
      conditions.push('active_enemies>=2');
    }

    return conditions.join('&');
  }

  /**
   * 스펙에서 클래스 추출
   */
  getClassFromSpec(spec) {
    const specToClass = {
      'Retribution': 'Paladin',
      'Holy': 'Paladin',
      'Protection': 'Paladin',
      'Fury': 'Warrior',
      'Arms': 'Warrior',
      'Protection Warrior': 'Warrior',
      // ... 모든 스펙 매핑
    };
    return specToClass[spec] || 'Unknown';
  }

  /**
   * 리소스 타입 확인
   */
  getResourceType(abilityId) {
    // 성기사
    if ([85256, 53385].includes(abilityId)) return 'holy_power';
    // 전사
    if ([23881, 1680].includes(abilityId)) return 'rage';
    // 기타 클래스별 리소스 매핑...
    return null;
  }

  /**
   * AOE 스킬 여부 확인
   */
  isAOEAbility(abilityId) {
    const aoeAbilities = [
      53385, // Divine Storm
      1680,  // Whirlwind
      // ... 다른 AOE 스킬들
    ];
    return aoeAbilities.includes(abilityId);
  }

  /**
   * 머신러닝 통합 (향후 확장)
   */
  async trainNeuralNetwork(trainingData) {
    // TensorFlow.js를 사용한 신경망 학습
    // 입력: 게임 상태 (리소스, 버프, 쿨다운 등)
    // 출력: 다음 최적 액션
    console.log('🧠 신경망 학습 시작...');
    // ... 구현 예정
  }

  /**
   * 전체 학습 파이프라인 실행
   */
  async runLearningPipeline(spec, encounter) {
  console.log(`🚀 ${spec} 자가 학습 파이프라인 시작\n`);

  try {
    // 1단계: 로그 수집
    console.log('📊 [1/5] 상위 플레이어 로그 수집 중...');
    const logs = await this.collectTopPerformerLogs(spec, encounter);
    if (logs.length === 0) {
      throw new Error('로그 수집 실패');
    }

    // 2단계: 패턴 학습
    console.log('🧠 [2/5] 패턴 분석 및 학습 중...');
    const patterns = this.analyzeRotationPatterns(logs);

    // 3단계: APL 생성
    console.log('📝 [3/5] 동적 APL 생성 중...');
    const apl = this.generateDynamicAPL(patterns, spec);

    // 4단계: 시뮬레이션 검증
    console.log('🎮 [4/5] 시뮬레이션 검증 중...');
    const testCharacter = this.createTestCharacter(spec);
    const validation = await this.simulateAndValidate(apl, testCharacter);

    // 5단계: 자가 개선
    console.log('🔄 [5/5] 자가 개선 프로세스...');
    const improvedAPL = await this.selfImprove(apl, logs);

    // 결과 저장
    this.addLearningHistory({
      spec,
      encounter,
      logsAnalyzed: logs.length,
      patternsFound: Object.keys(patterns).length,
      avgDPS: validation.avgDPS,
      improvement: ((validation.avgDPS - this.currentBestDPS) / this.currentBestDPS * 100).toFixed(2)
    });

    console.log(`\n✅ 학습 파이프라인 완료!`);
    console.log(`📈 예상 DPS: ${Math.round(validation.avgDPS).toLocaleString()}`);
    console.log(`📊 일관성 점수: ${validation.consistency.toFixed(1)}%`);
    console.log(`🎯 개선율: ${((validation.avgDPS - this.currentBestDPS) / this.currentBestDPS * 100).toFixed(2)}%\n`);

    return {
      apl: improvedAPL,
      patterns,
      validation,
      history: this.learningHistory
    };

  } catch (error) {
    console.error('❌ 학습 파이프라인 오류:', error);
    throw error;
  }
  }

  /**
   * 테스트 캐릭터 생성
   */
  createTestCharacter(spec) {
  // 기본 템플릿 (11.2 패치 기준)
  return {
    spec,
    level: 80,
    itemLevel: 639,
    stats: {
      strength: 15000,
      agility: 15000,
      intellect: 15000,
      stamina: 20000,
      crit: 25,
      haste: 20,
      mastery: 30,
      versatility: 15
    },
    talents: [],
    gear: []
  };
  }
}

// 전투 시뮬레이터
class CombatSimulator {
  constructor(character, apl) {
    this.character = character;
    this.apl = apl;
    this.gameState = this.initializeGameState();
    this.combatLog = [];
  }

  run(config) {
    let time = 0;
    let totalDamage = 0;

    while (time < config.duration * 1000) {
      // 현재 게임 상태에서 최적 액션 선택
      const action = this.selectAction(this.gameState);

      if (action) {
        const result = this.executeAction(action);
        totalDamage += result.damage;

        this.combatLog.push({
          time,
          action: action.name,
          damage: result.damage,
          gameState: { ...this.gameState }
        });
      }

      // 게임 상태 업데이트
      this.updateGameState(time);
      time += 100; // 100ms 틱
    }

    return {
      totalDamage,
      dps: totalDamage / config.duration,
      log: this.combatLog
    };
  }

  selectAction(gameState) {
    // APL 규칙 평가
    for (const rule of this.apl) {
      if (this.evaluateConditions(rule.conditions, gameState)) {
        return rule;
      }
    }
    return null;
  }

  evaluateConditions(conditions, gameState) {
    return conditions.every(condition =>
      this.evaluateSingleCondition(condition, gameState)
    );
  }

  executeAction(action) {
    // 데미지 계산
    const baseDamage = action.damage || 1000;
    const critChance = this.character.stats.crit / 100;
    const isCrit = Math.random() < critChance;

    const damage = baseDamage * (isCrit ? 2 : 1) *
                  (1 + this.character.stats.versatility / 100);

    // 리소스 소비/생성
    if (action.resource) {
      this.gameState.resources[action.resource.type] += action.resource.amount;
    }

    // 쿨다운 적용
    if (action.cooldown) {
      this.gameState.cooldowns[action.name] = action.cooldown * 1000;
    }

    return { damage, isCrit };
  }

  updateGameState(currentTime) {
    // 쿨다운 감소
    Object.keys(this.gameState.cooldowns).forEach(cd => {
      this.gameState.cooldowns[cd] = Math.max(0, this.gameState.cooldowns[cd] - 100);
    });

    // 버프 지속시간 감소
    Object.keys(this.gameState.buffs).forEach(buff => {
      this.gameState.buffs[buff].duration -= 100;
      if (this.gameState.buffs[buff].duration <= 0) {
        delete this.gameState.buffs[buff];
      }
    });
  }

  initializeGameState() {
    return {
      time: 0,
      resources: {
        holyPower: 0,
        mana: 100
      },
      buffs: {},
      debuffs: {},
      cooldowns: {},
      target: {
        health: 100,
        count: 1
      }
    };
  }
}

export default SelfLearningEngine;
export { CombatSimulator };