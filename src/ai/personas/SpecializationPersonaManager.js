/**
 * SpecializationPersonaManager - 전문화별 페르소나 관리 시스템
 * 각 클래스의 전문화별로 세분화된 AI 페르소나를 관리
 */

import moduleEventBus from '../../services/ModuleEventBus.js';

class SpecializationPersonaManager {
  constructor() {
    this.personas = new Map();           // 전문화별 페르소나 (key: "class-spec")
    this.classSummary = new Map();       // 클래스별 요약 정보
    this.activePersona = null;           // 현재 활성 페르소나

    this.globalStats = {
      totalQuestions: 0,
      totalAdvice: 0,
      totalLogs: 0,
      totalGuides: 0,
      averageConfidence: 0,
      sessionStart: Date.now()
    };

    this.registerModule();
    this.setupEventListeners();
  }

  /**
   * 모듈 등록
   */
  registerModule() {
    moduleEventBus.registerModule('spec-persona-manager', {
      name: '전문화 AI 페르소나 관리자',
      version: '2.0.0',
      type: 'manager'
    });
  }

  /**
   * 이벤트 리스너 설정
   */
  setupEventListeners() {
    // 페르소나 레벨업 이벤트
    moduleEventBus.on('persona-levelup', (data) => {
      this.handlePersonaLevelUp(data);
    });

    // 질문 처리
    moduleEventBus.on('spec-ai-question', (data) => {
      this.routeQuestion(data);
    });

    // 로그 분석 요청
    moduleEventBus.on('analyze-log', (data) => {
      this.routeLogAnalysis(data);
    });

    // 가이드 생성 요청
    moduleEventBus.on('generate-guide', (data) => {
      this.routeGuideGeneration(data);
    });

    // 페르소나 상태 요청
    moduleEventBus.on('get-spec-persona-status', (callback) => {
      callback(this.getAllPersonaStatus());
    });
  }

  /**
   * 전문화 페르소나 등록
   */
  registerSpecializationPersona(persona) {
    const key = `${persona.classEng.toLowerCase()}-${persona.specEng.toLowerCase()}`;
    const displayName = `${persona.spec} ${persona.class}`;

    if (this.personas.has(key)) {
      console.warn(`${displayName} 페르소나는 이미 등록되어 있습니다.`);
      return false;
    }

    // 페르소나 등록
    this.personas.set(key, persona);

    // 클래스 요약 정보 업데이트
    if (!this.classSummary.has(persona.class)) {
      this.classSummary.set(persona.class, {
        className: persona.class,
        classEng: persona.classEng,
        classColor: persona.classColor,
        specs: []
      });
    }

    this.classSummary.get(persona.class).specs.push({
      spec: persona.spec,
      specEng: persona.specEng,
      key: key,
      role: persona.role
    });

    console.log(`✅ ${displayName} 페르소나 등록 완료`);

    // 첫 번째 페르소나를 기본 활성화
    if (!this.activePersona) {
      this.setActivePersona(key);
    }

    // 등록 이벤트 발행
    moduleEventBus.emit('spec-persona-registered', {
      class: persona.class,
      spec: persona.spec,
      key: key,
      heroTalents: persona.heroTalents
    });

    return true;
  }

  /**
   * 활성 페르소나 설정
   */
  setActivePersona(key) {
    const persona = this.personas.get(key);

    if (!persona) {
      console.error(`${key} 페르소나를 찾을 수 없습니다.`);
      return false;
    }

    this.activePersona = persona;

    console.log(`🎯 활성 페르소나: ${persona.spec} ${persona.class}`);

    // 이벤트 발행
    moduleEventBus.emit('active-spec-persona-changed', {
      class: persona.class,
      spec: persona.spec,
      key: key
    });

    return true;
  }

  /**
   * 질문 라우팅
   */
  async routeQuestion(data) {
    const { question, classSpec, heroTalent, context, callback } = data;

    // 특정 전문화 지정
    if (classSpec) {
      const persona = this.personas.get(classSpec);
      if (persona) {
        this.globalStats.totalQuestions++;
        const result = await persona.handleQuestion({
          type: context?.type || 'general',
          content: question,
          context: { ...context, heroTalent }
        });

        if (callback) callback(result);
        return result;
      }
    }

    // 질문 내용으로 적절한 페르소나 찾기
    const expertPersona = this.findBestPersonaForQuestion(question);

    if (expertPersona) {
      this.globalStats.totalQuestions++;
      const result = await expertPersona.handleQuestion({
        type: context?.type || 'general',
        content: question,
        context: { ...context, heroTalent }
      });

      if (callback) callback(result);
      return result;
    }

    // 활성 페르소나 사용
    if (this.activePersona) {
      this.globalStats.totalQuestions++;
      const result = await this.activePersona.handleQuestion({
        type: context?.type || 'general',
        content: question,
        context: { ...context, heroTalent }
      });

      if (callback) callback(result);
      return result;
    }

    // 페르소나가 없는 경우
    const errorResponse = {
      success: false,
      message: '현재 응답 가능한 전문화 페르소나가 없습니다.'
    };

    if (callback) callback(errorResponse);
    return errorResponse;
  }

  /**
   * 로그 분석 라우팅
   */
  async routeLogAnalysis(data) {
    const { logData, classSpec, callback } = data;

    const persona = classSpec
      ? this.personas.get(classSpec)
      : this.findPersonaFromLog(logData);

    if (!persona) {
      const error = { success: false, message: '적절한 분석 페르소나를 찾을 수 없습니다.' };
      if (callback) callback(error);
      return error;
    }

    this.globalStats.totalLogs++;
    const analysis = await persona.analyzeLog(logData);

    if (callback) callback(analysis);
    return analysis;
  }

  /**
   * 가이드 생성 라우팅
   */
  async routeGuideGeneration(data) {
    const { classSpec, heroTalent, format, callback } = data;

    const persona = this.personas.get(classSpec);

    if (!persona) {
      const error = { success: false, message: '해당 전문화 페르소나를 찾을 수 없습니다.' };
      if (callback) callback(error);
      return error;
    }

    this.globalStats.totalGuides++;
    const guide = await persona.generateGuide({ heroTalent, format });

    if (callback) callback(guide);
    return guide;
  }

  /**
   * 질문에 가장 적합한 페르소나 찾기
   */
  findBestPersonaForQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    let bestPersona = null;
    let highestScore = 0;

    for (const persona of this.personas.values()) {
      let score = 0;

      // 클래스 이름 매칭
      if (lowerQuestion.includes(persona.class) ||
          lowerQuestion.includes(persona.classEng.toLowerCase())) {
        score += 10;
      }

      // 전문화 매칭
      if (lowerQuestion.includes(persona.spec) ||
          lowerQuestion.includes(persona.specEng.toLowerCase())) {
        score += 15;
      }

      // 영웅 특성 매칭
      persona.heroTalents.forEach(hero => {
        if (lowerQuestion.includes(hero.name) ||
            lowerQuestion.includes(hero.nameEng.toLowerCase())) {
          score += 8;
        }
      });

      // 고유 특징 매칭
      persona.uniqueFeatures.forEach(feature => {
        if (lowerQuestion.includes(feature.toLowerCase())) {
          score += 5;
        }
      });

      // 신뢰도와 레벨 고려
      score += persona.confidence * 5;
      score += persona.level * 0.5;

      if (score > highestScore) {
        highestScore = score;
        bestPersona = persona;
      }
    }

    return bestPersona;
  }

  /**
   * 로그에서 페르소나 식별
   */
  findPersonaFromLog(logData) {
    // 로그 데이터에서 클래스/전문화 정보 추출
    const classInfo = logData.playerClass?.toLowerCase();
    const specInfo = logData.playerSpec?.toLowerCase();

    if (classInfo && specInfo) {
      const key = `${classInfo}-${specInfo}`;
      return this.personas.get(key);
    }

    return null;
  }

  /**
   * 페르소나 레벨업 처리
   */
  handlePersonaLevelUp(data) {
    const { spec, level, confidence } = data;

    console.log(`🎊 ${spec} 페르소나가 레벨 ${level}에 도달했습니다!`);

    // 전체 평균 신뢰도 업데이트
    this.updateAverageConfidence();

    // 레벨업 보상
    this.applyLevelUpRewards(spec, level);

    // 이벤트 발행
    moduleEventBus.emit('spec-persona-levelup-complete', {
      spec,
      level,
      confidence,
      milestone: this.getMilestone(level)
    });
  }

  /**
   * 레벨업 보상 적용
   */
  applyLevelUpRewards(spec, level) {
    const milestones = {
      5: { title: '견습생', reward: '기본 조언 신뢰도 향상' },
      10: { title: '숙련자', reward: '고급 로테이션 분석 해금' },
      15: { title: '전문가', reward: '심화 가이드 생성 가능' },
      20: { title: '대가', reward: 'WFK 레벨 최적화 조언' },
      30: { title: '마스터', reward: '완벽한 시뮬레이션 예측' }
    };

    const milestone = milestones[level];
    if (milestone) {
      console.log(`🏆 ${spec}이(가) ${milestone.title} 등급에 도달!`);
      console.log(`   보상: ${milestone.reward}`);
    }
  }

  /**
   * 레벨 마일스톤 확인
   */
  getMilestone(level) {
    if (level >= 30) return 'master';
    if (level >= 20) return 'expert';
    if (level >= 15) return 'professional';
    if (level >= 10) return 'skilled';
    if (level >= 5) return 'apprentice';
    return 'novice';
  }

  /**
   * 평균 신뢰도 업데이트
   */
  updateAverageConfidence() {
    if (this.personas.size === 0) {
      this.globalStats.averageConfidence = 0;
      return;
    }

    let totalConfidence = 0;
    for (const persona of this.personas.values()) {
      totalConfidence += persona.confidence;
    }

    this.globalStats.averageConfidence = totalConfidence / this.personas.size;
  }

  /**
   * 모든 페르소나 상태 조회
   */
  getAllPersonaStatus() {
    const status = {
      byClass: {},
      totalPersonas: this.personas.size,
      activePersona: null,
      globalStats: this.globalStats
    };

    // 클래스별로 그룹화
    for (const classInfo of this.classSummary.values()) {
      status.byClass[classInfo.className] = {
        className: classInfo.className,
        classColor: classInfo.classColor,
        specs: []
      };

      classInfo.specs.forEach(specInfo => {
        const persona = this.personas.get(specInfo.key);
        if (persona) {
          status.byClass[classInfo.className].specs.push({
            spec: specInfo.spec,
            role: specInfo.role,
            level: persona.level,
            confidence: persona.confidence,
            experience: persona.experience,
            analyzedLogs: persona.analyzedLogs.length
          });
        }
      });
    }

    // 활성 페르소나 정보
    if (this.activePersona) {
      status.activePersona = {
        class: this.activePersona.class,
        spec: this.activePersona.spec,
        level: this.activePersona.level,
        confidence: this.activePersona.confidence
      };
    }

    return status;
  }

  /**
   * 클래스별 전문화 목록 조회
   */
  getSpecializationsByClass(className) {
    const classInfo = this.classSummary.get(className);
    if (!classInfo) return [];

    return classInfo.specs.map(spec => ({
      ...spec,
      persona: this.personas.get(spec.key)
    }));
  }

  /**
   * 역할별 페르소나 조회 (DPS/Tank/Healer)
   */
  getPersonasByRole(role) {
    const rolePersonas = [];

    for (const persona of this.personas.values()) {
      if (persona.role === role) {
        rolePersonas.push({
          key: `${persona.classEng.toLowerCase()}-${persona.specEng.toLowerCase()}`,
          class: persona.class,
          spec: persona.spec,
          level: persona.level,
          confidence: persona.confidence
        });
      }
    }

    return rolePersonas;
  }

  /**
   * 통계 리포트 생성
   */
  generateStatisticsReport() {
    const report = {
      summary: {
        totalPersonas: this.personas.size,
        totalClasses: this.classSummary.size,
        ...this.globalStats,
        sessionDuration: Math.floor((Date.now() - this.globalStats.sessionStart) / 1000 / 60) + '분'
      },
      byRole: {
        dps: this.getPersonasByRole('DPS').length,
        tank: this.getPersonasByRole('Tank').length,
        healer: this.getPersonasByRole('Healer').length
      },
      topPerformers: [],
      needsImprovement: []
    };

    // 상위 성과자와 개선 필요 페르소나 식별
    const personaList = [];
    for (const persona of this.personas.values()) {
      personaList.push({
        name: `${persona.spec} ${persona.class}`,
        level: persona.level,
        confidence: persona.confidence,
        logsAnalyzed: persona.analyzedLogs.length
      });
    }

    // 레벨 기준 정렬
    personaList.sort((a, b) => b.level - a.level);
    report.topPerformers = personaList.slice(0, 3);

    // 신뢰도 기준 정렬 (낮은 순)
    personaList.sort((a, b) => a.confidence - b.confidence);
    report.needsImprovement = personaList.slice(0, 3);

    return report;
  }

  /**
   * 페르소나 초기화 (일괄)
   */
  async initializeAllPersonas() {
    console.log('🚀 모든 전문화 페르소나 초기화 시작...');

    const initPromises = [];
    for (const persona of this.personas.values()) {
      initPromises.push(persona.initialize());
    }

    await Promise.all(initPromises);

    console.log('✅ 모든 페르소나 초기화 완료!');
    return true;
  }

  /**
   * 페르소나 저장
   */
  saveAllPersonaStates() {
    const states = {};

    for (const [key, persona] of this.personas.entries()) {
      states[key] = {
        class: persona.class,
        spec: persona.spec,
        level: persona.level,
        experience: persona.experience,
        confidence: persona.confidence,
        knowledgeSize: persona.knowledge.size,
        analyzedLogsCount: persona.analyzedLogs.length
      };
    }

    // localStorage 또는 서버에 저장
    localStorage.setItem('spec-persona-states', JSON.stringify(states));

    console.log('💾 모든 페르소나 상태 저장 완료');
    return states;
  }

  /**
   * 페르소나 복원
   */
  loadAllPersonaStates() {
    const savedStates = localStorage.getItem('spec-persona-states');
    if (!savedStates) return false;

    try {
      const states = JSON.parse(savedStates);

      for (const [key, state] of Object.entries(states)) {
        const persona = this.personas.get(key);
        if (persona) {
          persona.level = state.level;
          persona.experience = state.experience;
          persona.confidence = state.confidence;
          console.log(`✅ ${state.spec} ${state.class} 페르소나 상태 복원`);
        }
      }

      return true;
    } catch (error) {
      console.error('페르소나 상태 복원 실패:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스
const specializationPersonaManager = new SpecializationPersonaManager();

export default specializationPersonaManager;