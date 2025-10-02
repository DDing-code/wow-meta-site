// AI 페르소나 중앙 관리 시스템
import moduleEventBus from '../../services/ModuleEventBus.js';

class PersonaManager {
  constructor() {
    this.personas = new Map();           // 등록된 페르소나들
    this.activePersona = null;           // 현재 활성 페르소나
    this.globalStats = {                 // 전체 통계
      totalQuestions: 0,
      totalAdvice: 0,
      totalAnalysis: 0,
      averageConfidence: 0,
      sessionStart: Date.now()
    };

    this.registerModule();
    this.setupEventListeners();
  }

  // 모듈 등록
  registerModule() {
    moduleEventBus.registerModule('persona-manager', {
      name: 'AI 페르소나 관리자',
      version: '1.0.0',
      type: 'manager'
    });
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 페르소나 레벨업 이벤트
    moduleEventBus.on('persona-levelup', (data) => {
      this.handlePersonaLevelUp(data);
    });

    // 글로벌 질문 처리 (클래스 지정 없이)
    moduleEventBus.on('ai-question', (data) => {
      this.routeQuestion(data);
    });

    // 페르소나 상태 요청
    moduleEventBus.on('get-persona-status', (callback) => {
      callback(this.getAllPersonaStatus());
    });

    // 최고 전문가 찾기
    moduleEventBus.on('find-expert', (data) => {
      this.findExpertForQuestion(data);
    });
  }

  // 페르소나 등록
  registerPersona(persona) {
    const className = persona.className;

    if (this.personas.has(className)) {
      console.warn(`${className} 페르소나는 이미 등록되어 있습니다.`);
      return false;
    }

    this.personas.set(className, persona);

    console.log(`✅ ${persona.koreanName} 페르소나 등록 완료`);

    // 첫 번째 페르소나를 기본 활성화
    if (!this.activePersona) {
      this.setActivePersona(className);
    }

    // 등록 이벤트 발행
    moduleEventBus.emit('persona-registered', {
      class: className,
      koreanName: persona.koreanName,
      specs: persona.specs
    });

    return true;
  }

  // 페르소나 해제
  unregisterPersona(className) {
    if (!this.personas.has(className)) {
      return false;
    }

    const persona = this.personas.get(className);
    this.personas.delete(className);

    // 활성 페르소나가 해제되면 다른 것으로 변경
    if (this.activePersona === persona) {
      const nextPersona = this.personas.values().next().value;
      this.activePersona = nextPersona || null;
    }

    console.log(`❌ ${persona.koreanName} 페르소나 해제`);

    return true;
  }

  // 활성 페르소나 설정
  setActivePersona(className) {
    const persona = this.personas.get(className);

    if (!persona) {
      console.error(`${className} 페르소나를 찾을 수 없습니다.`);
      return false;
    }

    this.activePersona = persona;

    console.log(`🎯 활성 페르소나: ${persona.koreanName}`);

    // 이벤트 발행
    moduleEventBus.emit('active-persona-changed', {
      class: className,
      koreanName: persona.koreanName
    });

    return true;
  }

  // 질문 라우팅
  async routeQuestion(data) {
    const { question, preferredClass, spec, context, callback } = data;

    // 선호 클래스가 있으면 해당 페르소나 사용
    if (preferredClass) {
      const persona = this.personas.get(preferredClass);
      if (persona) {
        this.globalStats.totalQuestions++;
        return await persona.handleQuestion({ question, spec, context, callback });
      }
    }

    // 질문 내용으로 적절한 페르소나 찾기
    const expertPersona = this.findBestPersonaForQuestion(question);

    if (expertPersona) {
      this.globalStats.totalQuestions++;
      return await expertPersona.handleQuestion({ question, spec, context, callback });
    }

    // 활성 페르소나 사용
    if (this.activePersona) {
      this.globalStats.totalQuestions++;
      return await this.activePersona.handleQuestion({ question, spec, context, callback });
    }

    // 페르소나가 없는 경우
    const errorResponse = {
      success: false,
      message: '현재 응답 가능한 AI 페르소나가 없습니다.'
    };

    if (callback) callback(errorResponse);
    return errorResponse;
  }

  // 질문에 가장 적합한 페르소나 찾기
  findBestPersonaForQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    let bestPersona = null;
    let highestScore = 0;

    for (const persona of this.personas.values()) {
      let score = 0;

      // 클래스 이름 매칭
      if (lowerQuestion.includes(persona.className.toLowerCase()) ||
          lowerQuestion.includes(persona.koreanName)) {
        score += 10;
      }

      // 전문화 매칭
      persona.specs.forEach(spec => {
        if (lowerQuestion.includes(spec.name.toLowerCase()) ||
            lowerQuestion.includes(spec.korean)) {
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

  // 특정 주제의 전문가 찾기
  findExpertForQuestion(data) {
    const { topic, callback } = data;

    const experts = [];

    for (const persona of this.personas.values()) {
      const expertise = this.evaluateExpertise(persona, topic);

      if (expertise > 0) {
        experts.push({
          class: persona.className,
          koreanName: persona.koreanName,
          level: persona.level,
          confidence: persona.confidence,
          expertise
        });
      }
    }

    // 전문성 순으로 정렬
    experts.sort((a, b) => b.expertise - a.expertise);

    const result = {
      topic,
      experts: experts.slice(0, 3), // 상위 3명
      bestExpert: experts[0] || null
    };

    if (callback) callback(result);
    return result;
  }

  // 전문성 평가
  evaluateExpertise(persona, topic) {
    let score = 0;

    // 기본 점수 (레벨과 신뢰도)
    score += persona.level * 2;
    score += persona.confidence * 10;

    // 주제 관련성 (실제로는 더 정교한 매칭 필요)
    const lowerTopic = topic.toLowerCase();

    // 클래스별 전문 분야 매칭
    const classExpertise = {
      hunter: ['원거리', '펫', '킬타', '트랩'],
      warrior: ['근접', '탱킹', '방어', '분노'],
      mage: ['마법', '원거리', '순간이동', 'cc'],
      // ... 다른 클래스들
    };

    const expertAreas = classExpertise[persona.className] || [];
    expertAreas.forEach(area => {
      if (lowerTopic.includes(area)) {
        score += 15;
      }
    });

    return score;
  }

  // 페르소나 레벨업 처리
  handlePersonaLevelUp(data) {
    const { class: className, oldLevel, newLevel, confidence } = data;

    console.log(`🎊 ${className} 페르소나가 레벨 ${newLevel}에 도달했습니다!`);

    // 전체 평균 신뢰도 업데이트
    this.updateAverageConfidence();

    // 레벨업 보상 (추가 기능 활성화 등)
    this.applyLevelUpRewards(className, newLevel);
  }

  // 레벨업 보상 적용
  applyLevelUpRewards(className, level) {
    const persona = this.personas.get(className);
    if (!persona) return;

    // 레벨별 보상
    if (level === 5) {
      console.log(`🏆 ${persona.koreanName}이(가) 숙련자 등급에 도달했습니다!`);
    } else if (level === 10) {
      console.log(`🏆 ${persona.koreanName}이(가) 전문가 등급에 도달했습니다!`);
    } else if (level === 20) {
      console.log(`🏆 ${persona.koreanName}이(가) 마스터 등급에 도달했습니다!`);
    }
  }

  // 평균 신뢰도 업데이트
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

  // 모든 페르소나 상태 조회
  getAllPersonaStatus() {
    const status = [];

    for (const persona of this.personas.values()) {
      status.push(persona.getStatus());
    }

    return {
      personas: status,
      activePersona: this.activePersona?.className || null,
      globalStats: this.globalStats,
      sessionDuration: Date.now() - this.globalStats.sessionStart
    };
  }

  // 대화 기록 통합 조회
  getGlobalConversationHistory(limit = 20) {
    const allHistory = [];

    for (const persona of this.personas.values()) {
      const history = persona.getConversationHistory(limit);
      history.forEach(h => {
        allHistory.push({
          ...h,
          personaClass: persona.className,
          personaName: persona.koreanName
        });
      });
    }

    // 시간순 정렬
    allHistory.sort((a, b) => b.timestamp - a.timestamp);

    return allHistory.slice(0, limit);
  }

  // 통계 리포트 생성
  generateStatisticsReport() {
    const report = {
      summary: {
        totalPersonas: this.personas.size,
        totalQuestions: this.globalStats.totalQuestions,
        totalAdvice: this.globalStats.totalAdvice,
        totalAnalysis: this.globalStats.totalAnalysis,
        averageConfidence: this.globalStats.averageConfidence.toFixed(2),
        sessionDuration: Math.floor((Date.now() - this.globalStats.sessionStart) / 1000 / 60) + '분'
      },
      personas: []
    };

    for (const persona of this.personas.values()) {
      const status = persona.getStatus();
      report.personas.push({
        name: status.koreanName,
        level: status.level,
        experience: status.experience,
        confidence: status.confidence.toFixed(2),
        conversationCount: status.conversationCount
      });
    }

    // 가장 활발한 페르소나
    report.mostActive = report.personas.reduce((prev, current) => {
      return prev.conversationCount > current.conversationCount ? prev : current;
    }, report.personas[0]);

    // 가장 높은 레벨 페르소나
    report.highestLevel = report.personas.reduce((prev, current) => {
      return prev.level > current.level ? prev : current;
    }, report.personas[0]);

    return report;
  }

  // 페르소나 리셋
  resetPersona(className) {
    const persona = this.personas.get(className);
    if (!persona) return false;

    // 경험치와 레벨 리셋
    persona.level = 1;
    persona.experience = 0;
    persona.confidence = 0.5;
    persona.conversationHistory = [];

    console.log(`🔄 ${persona.koreanName} 페르소나가 리셋되었습니다.`);

    return true;
  }

  // 모든 페르소나 리셋
  resetAllPersonas() {
    for (const className of this.personas.keys()) {
      this.resetPersona(className);
    }

    this.globalStats = {
      totalQuestions: 0,
      totalAdvice: 0,
      totalAnalysis: 0,
      averageConfidence: 0,
      sessionStart: Date.now()
    };

    console.log('🔄 모든 페르소나가 리셋되었습니다.');
  }

  // 페르소나 저장 (나중에 구현)
  savePersonaState() {
    const state = {};

    for (const [className, persona] of this.personas.entries()) {
      state[className] = {
        level: persona.level,
        experience: persona.experience,
        confidence: persona.confidence,
        conversationHistory: persona.conversationHistory.slice(-100) // 최근 100개만
      };
    }

    // localStorage 또는 서버에 저장
    localStorage.setItem('persona-state', JSON.stringify(state));

    return state;
  }

  // 페르소나 복원 (나중에 구현)
  loadPersonaState() {
    const savedState = localStorage.getItem('persona-state');
    if (!savedState) return false;

    try {
      const state = JSON.parse(savedState);

      for (const [className, data] of Object.entries(state)) {
        const persona = this.personas.get(className);
        if (persona) {
          persona.level = data.level;
          persona.experience = data.experience;
          persona.confidence = data.confidence;
          persona.conversationHistory = data.conversationHistory || [];
        }
      }

      console.log('✅ 페르소나 상태가 복원되었습니다.');
      return true;
    } catch (error) {
      console.error('페르소나 상태 복원 실패:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스
const personaManager = new PersonaManager();

export default personaManager;