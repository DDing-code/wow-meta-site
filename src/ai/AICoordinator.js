// AI 코디네이터 - 모든 직업 전문가 AI 관리 및 학습 조율
import WarriorExpertAI from './experts/WarriorExpertAI';
import ShamanExpertAI from './experts/ShamanExpertAI';
import LogParserService from '../services/LogParserService';
import WowDatabaseService from '../services/WowDatabaseService';
import { patch11_2ClassChanges, currentPatch } from '../data/patch11_2_data';

class AICoordinator {
  constructor() {
    this.experts = new Map();
    this.initializeExperts();

    // 학습 설정
    this.learningConfig = {
      autoLearnInterval: 3600000, // 1시간마다 자동 학습
      minLogsForLearning: 10, // 학습에 필요한 최소 로그 수
      confidenceThreshold: 0.85, // 신뢰도 임계값
      patchCheckInterval: 86400000, // 24시간마다 패치 확인
    };

    // 글로벌 지식 베이스
    this.globalKnowledge = {
      encounters: new Map(), // 보스별 전략
      compositions: new Map(), // 조합별 시너지
      metaStrategies: new Map(), // 메타 전략
      patchHistory: [], // 패치 이력
      lastUpdated: new Date()
    };

    // 성능 추적
    this.performanceTracker = {
      totalLearningCycles: 0,
      successfulPredictions: 0,
      failedPredictions: 0,
      averageImprovement: 0
    };

    // 자동 학습 시작
    this.startAutoLearning();
  }

  // 전문가 AI 초기화
  initializeExperts() {
    // 전사
    this.experts.set('warrior_arms', new WarriorExpertAI('arms'));
    this.experts.set('warrior_fury', new WarriorExpertAI('fury'));
    this.experts.set('warrior_protection', new WarriorExpertAI('protection'));

    // 주술사
    this.experts.set('shaman_elemental', new ShamanExpertAI('elemental'));
    this.experts.set('shaman_enhancement', new ShamanExpertAI('enhancement'));
    this.experts.set('shaman_restoration', new ShamanExpertAI('restoration'));

    // 성기사 (추가 가능)
    // this.experts.set('paladin_retribution', new PaladinExpertAI('retribution'));

    // 죽음의 기사 (추가 가능)
    // this.experts.set('deathknight_unholy', new DeathKnightExpertAI('unholy'));

    // 모든 AI 지식 베이스 로드
    this.experts.forEach(expert => {
      expert.loadKnowledgeBase();
    });
  }

  // 자동 학습 시작
  startAutoLearning() {
    // 정기 학습 사이클
    this.learningInterval = setInterval(() => {
      this.runLearningCycle();
    }, this.learningConfig.autoLearnInterval);

    // 패치 체크
    this.patchCheckInterval = setInterval(() => {
      this.checkForPatches();
    }, this.learningConfig.patchCheckInterval);

    console.log('AI 자동 학습 시스템 시작');
  }

  // 학습 사이클 실행
  async runLearningCycle() {
    console.log(`[학습 사이클 #${++this.performanceTracker.totalLearningCycles}] 시작`);

    try {
      // 1. 최신 로그 수집
      const recentLogs = await this.fetchRecentLogs();

      // 2. 각 전문가 AI에 로그 배분
      const learningResults = await this.distributeLogsToExperts(recentLogs);

      // 3. 크로스 클래스 학습 (시너지 발견)
      await this.crossClassLearning(learningResults);

      // 4. 메타 전략 업데이트
      await this.updateMetaStrategies(learningResults);

      // 5. 지식 베이스 저장
      await this.saveAllKnowledge();

      console.log('[학습 사이클] 완료');
      return { success: true, results: learningResults };
    } catch (error) {
      console.error('[학습 사이클] 실패:', error);
      return { success: false, error: error.message };
    }
  }

  // 최신 로그 가져오기
  async fetchRecentLogs() {
    // 실제 구현시 WarcraftLogs API 사용
    // 여기서는 시뮬레이션
    return [
      {
        logCode: 'ABC123',
        encounter: 'dimensius',
        players: [
          { id: 1, class: 'warrior', spec: 'arms', dps: 145000 },
          { id: 2, class: 'shaman', spec: 'elemental', dps: 158000 }
        ]
      }
    ];
  }

  // 로그를 전문가들에게 배분
  async distributeLogsToExperts(logs) {
    const results = new Map();

    for (const log of logs) {
      for (const player of log.players) {
        const expertKey = `${player.class}_${player.spec}`;
        const expert = this.experts.get(expertKey);

        if (expert) {
          const learningResult = await expert.learnFromLogs({
            logCode: log.logCode,
            playerId: player.id,
            fightId: 1,
            performance: { dps: player.dps }
          });

          results.set(expertKey, learningResult);
        }
      }
    }

    return results;
  }

  // 크로스 클래스 학습 (시너지 발견)
  async crossClassLearning(learningResults) {
    const synergies = [];

    // 전사 + 주술사 시너지
    const warriorResult = learningResults.get('warrior_arms');
    const shamanResult = learningResults.get('shaman_elemental');

    if (warriorResult && shamanResult) {
      synergies.push({
        classes: ['warrior_arms', 'shaman_elemental'],
        type: 'burst_window',
        description: '전사 거인의 일격 + 주술사 원소 정령 동기화',
        effectiveness: 0.92
      });
    }

    // 시너지 정보를 글로벌 지식 베이스에 저장
    synergies.forEach(synergy => {
      const key = synergy.classes.sort().join('_');
      this.globalKnowledge.compositions.set(key, synergy);
    });

    return synergies;
  }

  // 메타 전략 업데이트
  async updateMetaStrategies(learningResults) {
    // 현재 메타 분석
    const currentMeta = {
      timestamp: Date.now(),
      patch: currentPatch.version,
      topDPS: [],
      topCompositions: [],
      emergingStrategies: []
    };

    // 각 클래스별 성능 분석
    learningResults.forEach((result, classSpec) => {
      const expert = this.experts.get(classSpec);
      if (expert && expert.statistics.averageDPS > 0) {
        currentMeta.topDPS.push({
          classSpec,
          averageDPS: expert.statistics.averageDPS,
          parsePercentile: expert.statistics.parsePercentile
        });
      }
    });

    // DPS 순위 정렬
    currentMeta.topDPS.sort((a, b) => b.averageDPS - a.averageDPS);

    // 새로운 전략 발견
    if (currentMeta.topDPS[0]?.averageDPS > 150000) {
      currentMeta.emergingStrategies.push({
        name: '고DPS 버스트 전략',
        description: '15만 DPS 돌파 전략',
        requirements: currentMeta.topDPS[0].classSpec
      });
    }

    this.globalKnowledge.metaStrategies.set('current', currentMeta);
  }

  // 패치 확인 및 적응
  async checkForPatches() {
    console.log('[패치 체크] 새로운 패치 확인 중...');

    // 실제로는 API나 웹 크롤링으로 패치 정보 확인
    const latestPatch = currentPatch;

    // 패치 이력에 없는 새 패치면 적응
    const lastKnownPatch = this.globalKnowledge.patchHistory[0];
    if (!lastKnownPatch || lastKnownPatch.version !== latestPatch.version) {
      await this.adaptToNewPatch(latestPatch);
    }
  }

  // 새 패치 적응
  async adaptToNewPatch(patchData) {
    console.log(`[패치 적응] ${patchData.version} 패치 적응 시작`);

    const adaptationResults = new Map();

    // 모든 전문가 AI에 패치 정보 전달
    for (const [key, expert] of this.experts) {
      const result = await expert.learnFromPatchNotes({
        version: patchData.version,
        classChanges: patch11_2ClassChanges
      });

      adaptationResults.set(key, result);
    }

    // 패치 이력 업데이트
    this.globalKnowledge.patchHistory.unshift({
      version: patchData.version,
      adaptedAt: new Date(),
      changes: adaptationResults
    });

    console.log(`[패치 적응] 완료`);
    return adaptationResults;
  }

  // 실시간 전략 제안
  async getRealtimeStrategy(className, spec, encounter, phase) {
    const expertKey = `${className}_${spec}`;
    const expert = this.experts.get(expertKey);

    if (!expert) {
      return { error: '해당 직업/특성 전문가를 찾을 수 없습니다' };
    }

    // 전문가 AI의 실시간 조언
    const expertAdvice = expert.generateRealTimeAdvice({
      encounter,
      phase,
      health: 100, // 실제로는 실시간 데이터
      resource: 80
    });

    // 보스별 전략
    const encounterStrategy = this.globalKnowledge.encounters.get(encounter) || {};

    // 조합 시너지
    const synergies = this.findRelevantSynergies(expertKey);

    return {
      class: className,
      spec: spec,
      immediate: expertAdvice,
      encounter: encounterStrategy,
      synergies: synergies,
      confidence: expert.statistics.parsePercentile / 100
    };
  }

  // 관련 시너지 찾기
  findRelevantSynergies(classSpec) {
    const synergies = [];

    this.globalKnowledge.compositions.forEach((synergy, key) => {
      if (key.includes(classSpec)) {
        synergies.push(synergy);
      }
    });

    return synergies;
  }

  // 가이드 생성
  async generateGuide(className, spec, contentType = 'raid') {
    const expertKey = `${className}_${spec}`;
    const expert = this.experts.get(expertKey);

    if (!expert) {
      return null;
    }

    const guide = {
      class: className,
      spec: spec,
      patch: currentPatch.version,
      lastUpdated: new Date().toISOString(),
      content: {}
    };

    // 컨텐츠 타입별 가이드
    if (contentType === 'raid') {
      guide.content = {
        rotation: expert.currentSpec?.priority || [],
        stats: expert.currentSpec?.keyStats || [],
        tierBonus: expert.currentSpec?.tier11_2Bonus || {},
        bossStrategies: this.generateBossStrategies(expert),
        tips: expert.knowledgeBase.encounterStrategies
      };
    } else if (contentType === 'mythicplus') {
      guide.content = {
        routes: [],
        affixStrategies: {},
        dungeonTips: {}
      };
    } else if (contentType === 'pvp') {
      guide.content = {
        talents: [],
        macros: [],
        counterStrategies: {}
      };
    }

    return guide;
  }

  // 보스별 전략 생성
  generateBossStrategies(expert) {
    const strategies = {};

    // 디멘시우스 전략
    strategies['dimensius'] = {
      phase1: expert.getPhaseSpecificAdvice('phase1'),
      phase2: expert.getPhaseSpecificAdvice('phase2'),
      phase3: expert.getPhaseSpecificAdvice('phase3'),
      keyMechanics: [
        '분쇄하는 중력 대처법',
        '우주 방사능 생존',
        '살아있는 덩어리 처리'
      ]
    };

    // 연합왕 살다하르 전략
    strategies['nexus-king'] = {
      phase1: expert.getPhaseSpecificAdvice('phase1'),
      phase2: expert.getPhaseSpecificAdvice('phase2'),
      keyMechanics: [
        '추방 대처',
        '맹세 발동 생존',
        '쫄몹 우선순위'
      ]
    };

    return strategies;
  }

  // 모든 지식 저장
  async saveAllKnowledge() {
    // 각 전문가 AI 지식 저장
    const savePromises = Array.from(this.experts.values()).map(expert =>
      expert.saveKnowledgeBase()
    );

    // 글로벌 지식 저장
    localStorage.setItem('ai_global_knowledge', JSON.stringify({
      encounters: Array.from(this.globalKnowledge.encounters.entries()),
      compositions: Array.from(this.globalKnowledge.compositions.entries()),
      metaStrategies: Array.from(this.globalKnowledge.metaStrategies.entries()),
      patchHistory: this.globalKnowledge.patchHistory,
      lastUpdated: this.globalKnowledge.lastUpdated
    }));

    await Promise.all(savePromises);
    console.log('[지식 저장] 모든 AI 지식 베이스 저장 완료');
  }

  // 성능 보고서 생성
  generatePerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      learningCycles: this.performanceTracker.totalLearningCycles,
      successRate: this.performanceTracker.successfulPredictions /
                   (this.performanceTracker.successfulPredictions + this.performanceTracker.failedPredictions),
      expertPerformance: {}
    };

    // 각 전문가별 성능
    this.experts.forEach((expert, key) => {
      report.expertPerformance[key] = {
        averageDPS: expert.statistics.averageDPS,
        parsePercentile: expert.statistics.parsePercentile,
        improvementRate: expert.statistics.improvementRate,
        knowledgeSize: expert.knowledgeBase.performanceMetrics.length
      };
    });

    // 상위 3개 클래스
    const topPerformers = Object.entries(report.expertPerformance)
      .sort((a, b) => b[1].averageDPS - a[1].averageDPS)
      .slice(0, 3)
      .map(([key, data]) => ({ class: key, dps: data.averageDPS }));

    report.topPerformers = topPerformers;

    return report;
  }

  // 정리
  cleanup() {
    clearInterval(this.learningInterval);
    clearInterval(this.patchCheckInterval);
    this.saveAllKnowledge();
    console.log('AI 코디네이터 종료');
  }
}

export default AICoordinator;