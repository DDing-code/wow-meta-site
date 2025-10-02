/**
 * AI 학습 결과를 가이드 및 다른 컴포넌트에 피드백하는 서비스
 * 양방향 데이터 흐름을 구현하여 프로젝트의 유기적 발전 지원
 */

import { EventEmitter } from 'events';

class AIFeedbackService extends EventEmitter {
  constructor() {
    super();
    this.learningHistory = [];
    this.improvementQueue = [];
    this.feedbackMetrics = {
      totalFeedbacks: 0,
      appliedImprovements: 0,
      pendingImprovements: 0
    };
  }

  /**
   * AI 학습 데이터를 분석하여 가이드 개선사항 도출
   */
  async analyzeLearningSources(learningData) {
    const improvements = [];

    // 1. DPS 패턴 분석
    if (learningData.performance) {
      const topPerformers = learningData.performance.filter(p => p.percentile >= 95);

      topPerformers.forEach(performer => {
        improvements.push({
          type: 'rotation',
          target: performer.spec,
          data: {
            skillPriority: performer.rotation,
            burstWindow: performer.burstTiming,
            resourceManagement: performer.resourceUsage
          },
          confidence: performer.sampleSize > 100 ? 'high' : 'medium',
          source: 'warcraftlogs'
        });
      });
    }

    // 2. 특성 빌드 메타 분석
    if (learningData.talentBuilds) {
      const metaBuilds = this.analyzeMetaBuilds(learningData.talentBuilds);

      metaBuilds.forEach(build => {
        improvements.push({
          type: 'talent',
          target: build.spec,
          data: {
            buildString: build.exportString,
            popularity: build.usage,
            performance: build.avgDPS,
            heroTalent: build.heroTalent
          },
          confidence: build.usage > 0.3 ? 'high' : 'low',
          source: 'meta-analysis'
        });
      });
    }

    // 3. 스탯 우선순위 업데이트
    if (learningData.statWeights) {
      improvements.push({
        type: 'stats',
        target: learningData.spec,
        data: {
          primary: learningData.statWeights.primary,
          secondary: learningData.statWeights.secondary,
          breakpoints: learningData.statWeights.breakpoints
        },
        confidence: 'high',
        source: 'simulation'
      });
    }

    this.improvementQueue.push(...improvements);
    this.feedbackMetrics.pendingImprovements += improvements.length;

    return improvements;
  }

  /**
   * 메타 빌드 분석 - 가장 성공적인 빌드 패턴 식별
   */
  analyzeMetaBuilds(talentBuilds) {
    const buildGroups = {};

    // 빌드를 그룹화하고 성능 평균 계산
    talentBuilds.forEach(build => {
      const key = `${build.spec}_${build.heroTalent}`;
      if (!buildGroups[key]) {
        buildGroups[key] = {
          spec: build.spec,
          heroTalent: build.heroTalent,
          builds: [],
          totalDPS: 0,
          count: 0
        };
      }

      buildGroups[key].builds.push(build);
      buildGroups[key].totalDPS += build.dps;
      buildGroups[key].count++;
    });

    // 상위 빌드 선정
    return Object.values(buildGroups)
      .map(group => ({
        spec: group.spec,
        heroTalent: group.heroTalent,
        exportString: this.getMostPopularBuild(group.builds),
        usage: group.count / talentBuilds.length,
        avgDPS: group.totalDPS / group.count
      }))
      .sort((a, b) => b.avgDPS - a.avgDPS)
      .slice(0, 3);
  }

  /**
   * 가장 인기있는 빌드 추출
   */
  getMostPopularBuild(builds) {
    const buildCount = {};
    builds.forEach(build => {
      buildCount[build.exportString] = (buildCount[build.exportString] || 0) + 1;
    });

    return Object.entries(buildCount)
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * 개선사항을 가이드에 적용
   */
  async applyToGuide(guideData, improvements) {
    const updatedGuide = { ...guideData };
    let changeLog = [];

    improvements.forEach(improvement => {
      switch (improvement.type) {
        case 'rotation':
          updatedGuide.rotation = {
            ...updatedGuide.rotation,
            priority: improvement.data.skillPriority,
            burstWindow: improvement.data.burstWindow,
            lastUpdated: new Date().toISOString(),
            source: improvement.source
          };
          changeLog.push(`Updated rotation for ${improvement.target}`);
          break;

        case 'talent':
          if (!updatedGuide.talentBuilds) {
            updatedGuide.talentBuilds = {};
          }
          updatedGuide.talentBuilds[improvement.data.heroTalent] = {
            buildString: improvement.data.buildString,
            popularity: improvement.data.popularity,
            performance: improvement.data.performance,
            lastUpdated: new Date().toISOString()
          };
          changeLog.push(`Updated ${improvement.data.heroTalent} build`);
          break;

        case 'stats':
          updatedGuide.stats = {
            ...improvement.data,
            lastUpdated: new Date().toISOString(),
            source: improvement.source
          };
          changeLog.push('Updated stat priorities');
          break;
      }
    });

    this.feedbackMetrics.appliedImprovements += improvements.length;
    this.feedbackMetrics.totalFeedbacks++;

    // 이벤트 발생 - 다른 컴포넌트에 알림
    this.emit('guideUpdated', {
      guide: updatedGuide,
      changes: changeLog,
      timestamp: new Date().toISOString()
    });

    return { updatedGuide, changeLog };
  }

  /**
   * SimC 결과와 실제 데이터 비교
   */
  compareSimCWithReal(simcData, realData) {
    const discrepancies = [];

    // DPS 차이 분석
    const dpsDiff = Math.abs(simcData.dps - realData.avgDPS) / simcData.dps;
    if (dpsDiff > 0.1) { // 10% 이상 차이
      discrepancies.push({
        type: 'dps',
        simulated: simcData.dps,
        real: realData.avgDPS,
        difference: dpsDiff,
        recommendation: dpsDiff > 0 ? 'Adjust SimC profile for real-world conditions' : 'Review SimC settings'
      });
    }

    // 스킬 사용 빈도 비교
    if (simcData.apl && realData.rotation) {
      const skillUsageDiff = this.compareSkillUsage(simcData.apl, realData.rotation);
      if (skillUsageDiff.length > 0) {
        discrepancies.push({
          type: 'rotation',
          differences: skillUsageDiff,
          recommendation: 'Update APL based on real player patterns'
        });
      }
    }

    return discrepancies;
  }

  /**
   * 스킬 사용 패턴 비교
   */
  compareSkillUsage(simcAPL, realRotation) {
    const differences = [];

    // SimC APL을 파싱하여 스킬 우선순위 추출
    const simcPriority = this.parseAPL(simcAPL);

    // 실제 로테이션과 비교
    realRotation.forEach((skill, index) => {
      const simcIndex = simcPriority.indexOf(skill);
      if (simcIndex !== -1 && Math.abs(simcIndex - index) > 2) {
        differences.push({
          skill,
          simcPriority: simcIndex,
          realPriority: index,
          gap: Math.abs(simcIndex - index)
        });
      }
    });

    return differences;
  }

  /**
   * SimC APL 파싱
   */
  parseAPL(apl) {
    // APL 문자열에서 스킬 순서 추출
    const skills = [];
    const lines = apl.split('\n');

    lines.forEach(line => {
      const match = line.match(/actions.*?\+=([^,]+)/);
      if (match) {
        skills.push(match[1]);
      }
    });

    return skills;
  }

  /**
   * 실시간 피드백 루프 시작
   */
  startFeedbackLoop(interval = 300000) { // 5분마다
    this.feedbackInterval = setInterval(async () => {
      try {
        // 서버에서 최신 학습 데이터 가져오기
        const response = await fetch('/api/learning/latest');
        const learningData = await response.json();

        // 개선사항 분석
        const improvements = await this.analyzeLearningSources(learningData);

        // 개선사항이 있으면 적용
        if (improvements.length > 0) {
          this.emit('improvementsAvailable', improvements);
        }

        // 메트릭 업데이트
        this.updateMetrics();
      } catch (error) {
        console.error('Feedback loop error:', error);
      }
    }, interval);
  }

  /**
   * 피드백 루프 중지
   */
  stopFeedbackLoop() {
    if (this.feedbackInterval) {
      clearInterval(this.feedbackInterval);
      this.feedbackInterval = null;
    }
  }

  /**
   * 메트릭 업데이트 및 보고
   */
  updateMetrics() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.feedbackMetrics,
      queueSize: this.improvementQueue.length,
      historySize: this.learningHistory.length
    };

    this.emit('metricsUpdated', report);
    return report;
  }

  /**
   * 모든 모듈과의 연결 초기화
   */
  connectToModules() {
    // 가이드 모듈 연결
    this.on('guideUpdated', (data) => {
      console.log('Guide updated with AI feedback:', data.changes);
    });

    // SimC 엔진 연결
    this.on('simcDiscrepancy', (data) => {
      console.log('SimC vs Real discrepancy detected:', data);
    });

    // 스킬 DB 연결
    this.on('newSkillDiscovered', (skill) => {
      console.log('New skill discovered from logs:', skill);
    });

    return true;
  }
}

// 싱글톤 인스턴스 생성
const aiFeedbackService = new AIFeedbackService();
aiFeedbackService.connectToModules();

export default aiFeedbackService;