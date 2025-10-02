// WoW 직업별 AI 페르소나 베이스 클래스
import moduleEventBus from '../../services/ModuleEventBus.js';

class BaseClassPersona {
  constructor(className, koreanName, specs) {
    this.className = className;          // 영문 클래스명
    this.koreanName = koreanName;        // 한국어 클래스명
    this.specs = specs;                  // 전문화 목록
    this.level = 1;                      // 페르소나 레벨
    this.experience = 0;                 // 경험치
    this.confidence = 0.5;               // 신뢰도 (0~1)
    this.knowledge = new Map();          // 지식 데이터베이스
    this.personality = null;             // 성격 타입
    this.conversationHistory = [];       // 대화 기록
    this.discoveredSkills = new Set();   // 발견한 스킬 추적

    // 초기화
    this.initializePersonality();
    this.registerModule();
    this.loadKnowledge();
  }

  // 모듈 등록
  registerModule() {
    moduleEventBus.registerModule(`persona-${this.className}`, {
      name: `${this.koreanName} AI 페르소나`,
      version: '1.0.0',
      class: this.className,
      level: this.level
    });

    this.setupEventListeners();
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 질문 응답 요청
    moduleEventBus.on(`question-${this.className}`, (data) => {
      this.handleQuestion(data);
    });

    // 조언 요청
    moduleEventBus.on(`advice-${this.className}`, (data) => {
      this.provideAdvice(data);
    });

    // 분석 요청
    moduleEventBus.on(`analyze-${this.className}`, (data) => {
      this.analyzePerformance(data);
    });
  }

  // 성격 초기화 (자식 클래스에서 오버라이드)
  initializePersonality() {
    // 기본 성격 설정
    this.personality = {
      type: 'NEUTRAL',
      greeting: `안녕하세요! ${this.koreanName} 전문가입니다.`,
      farewell: '좋은 게임 되세요!',
      encouragement: ['잘하고 있어요!', '계속 연습하면 더 좋아질 거예요!'],
      style: 'professional'
    };
  }

  // 지식 로드 (자식 클래스에서 구현)
  loadKnowledge() {
    // 기본 지식 구조
    this.specs.forEach(spec => {
      this.knowledge.set(spec.name, {
        rotation: [],
        talents: {},
        stats: [],
        tips: [],
        commonMistakes: []
      });
    });
  }

  // 질문 처리
  async handleQuestion(data) {
    const { question, spec, context, callback } = data;

    // 대화 기록 저장
    this.conversationHistory.push({
      type: 'question',
      question,
      spec,
      timestamp: Date.now()
    });

    try {
      // 전문화 확인
      const specData = this.specs.find(s => s.name === spec || s.korean === spec);
      if (!specData && spec) {
        const response = {
          success: false,
          message: `${spec} 전문화를 찾을 수 없습니다. 가능한 전문화: ${this.specs.map(s => s.korean).join(', ')}`
        };
        if (callback) callback(response);
        return response;
      }

      // 질문 분석
      const intent = this.analyzeQuestionIntent(question);

      // 적절한 응답 생성
      let response;
      switch (intent.type) {
        case 'rotation':
          response = await this.getRotationAdvice(specData || this.specs[0], intent.details);
          break;
        case 'talent':
          response = await this.getTalentAdvice(specData || this.specs[0], intent.details);
          break;
        case 'stats':
          response = await this.getStatAdvice(specData || this.specs[0], intent.details);
          break;
        case 'general':
          response = await this.getGeneralAdvice(specData || this.specs[0], intent.details);
          break;
        default:
          response = await this.getDefaultResponse(question, specData);
      }

      // 경험치 증가
      this.gainExperience(1);

      // 응답 포맷팅
      const formattedResponse = this.formatResponse(response);

      // 대화 기록 업데이트
      this.conversationHistory[this.conversationHistory.length - 1].response = formattedResponse;

      if (callback) callback(formattedResponse);
      return formattedResponse;

    } catch (error) {
      console.error(`${this.koreanName} 페르소나 오류:`, error);
      const errorResponse = {
        success: false,
        message: '죄송합니다. 응답 생성 중 오류가 발생했습니다.'
      };
      if (callback) callback(errorResponse);
      return errorResponse;
    }
  }

  // 질문 의도 분석
  analyzeQuestionIntent(question) {
    const lowerQuestion = question.toLowerCase();

    // 로테이션/딜사이클 관련
    if (lowerQuestion.includes('로테이션') || lowerQuestion.includes('딜사이클') ||
        lowerQuestion.includes('스킬 순서') || lowerQuestion.includes('rotation')) {
      return { type: 'rotation', details: question };
    }

    // 특성 관련
    if (lowerQuestion.includes('특성') || lowerQuestion.includes('탤런트') ||
        lowerQuestion.includes('빌드') || lowerQuestion.includes('talent')) {
      return { type: 'talent', details: question };
    }

    // 스탯 관련
    if (lowerQuestion.includes('스탯') || lowerQuestion.includes('가속') ||
        lowerQuestion.includes('치명') || lowerQuestion.includes('특화')) {
      return { type: 'stats', details: question };
    }

    // 일반 조언
    return { type: 'general', details: question };
  }

  // 로테이션 조언 (자식 클래스에서 구체화)
  async getRotationAdvice(spec, details) {
    const knowledge = this.knowledge.get(spec.name);
    return {
      type: 'rotation',
      spec: spec.korean,
      advice: knowledge?.rotation || ['기본 로테이션 정보가 없습니다.'],
      confidence: this.confidence
    };
  }

  // 특성 조언 (자식 클래스에서 구체화)
  async getTalentAdvice(spec, details) {
    const knowledge = this.knowledge.get(spec.name);
    return {
      type: 'talent',
      spec: spec.korean,
      advice: knowledge?.talents || {},
      confidence: this.confidence
    };
  }

  // 스탯 조언 (자식 클래스에서 구체화)
  async getStatAdvice(spec, details) {
    const knowledge = this.knowledge.get(spec.name);
    return {
      type: 'stats',
      spec: spec.korean,
      advice: knowledge?.stats || ['기본 스탯 우선순위 정보가 없습니다.'],
      confidence: this.confidence
    };
  }

  // 일반 조언
  async getGeneralAdvice(spec, details) {
    const knowledge = this.knowledge.get(spec.name);
    return {
      type: 'general',
      spec: spec.korean,
      advice: knowledge?.tips || ['일반적인 팁이 없습니다.'],
      confidence: this.confidence
    };
  }

  // 기본 응답
  async getDefaultResponse(question, spec) {
    return {
      type: 'default',
      spec: spec?.korean || '일반',
      advice: `${question}에 대해 정확한 답변을 찾지 못했습니다. 다른 방식으로 질문해 주세요.`,
      confidence: 0.3
    };
  }

  // 응답 포맷팅
  formatResponse(response) {
    const { type, spec, advice, confidence } = response;

    let formattedMessage = `${this.personality.greeting}\n\n`;

    if (spec) {
      formattedMessage += `**[${spec}]** `;
    }

    switch (type) {
      case 'rotation':
        formattedMessage += '딜사이클 정보:\n';
        if (Array.isArray(advice)) {
          advice.forEach((item, index) => {
            formattedMessage += `${index + 1}. ${item}\n`;
          });
        } else {
          formattedMessage += advice + '\n';
        }
        break;

      case 'talent':
        formattedMessage += '특성 추천:\n';
        if (typeof advice === 'object') {
          Object.entries(advice).forEach(([key, value]) => {
            formattedMessage += `• ${key}: ${value}\n`;
          });
        } else {
          formattedMessage += advice + '\n';
        }
        break;

      case 'stats':
        formattedMessage += '스탯 우선순위:\n';
        if (Array.isArray(advice)) {
          advice.forEach((stat, index) => {
            formattedMessage += `${index + 1}. ${stat}\n`;
          });
        } else {
          formattedMessage += advice + '\n';
        }
        break;

      default:
        if (Array.isArray(advice)) {
          advice.forEach(tip => {
            formattedMessage += `• ${tip}\n`;
          });
        } else {
          formattedMessage += advice + '\n';
        }
    }

    // 신뢰도 표시
    formattedMessage += `\n📊 신뢰도: ${(confidence * 100).toFixed(0)}%`;

    // 레벨 표시
    if (this.level > 1) {
      formattedMessage += ` | 🎮 레벨 ${this.level}`;
    }

    // 격려 메시지 추가 (랜덤)
    if (Math.random() > 0.7 && this.personality.encouragement.length > 0) {
      const encouragement = this.personality.encouragement[
        Math.floor(Math.random() * this.personality.encouragement.length)
      ];
      formattedMessage += `\n\n💪 ${encouragement}`;
    }

    return {
      success: true,
      message: formattedMessage,
      metadata: {
        type,
        spec,
        confidence,
        level: this.level,
        personaClass: this.className
      }
    };
  }

  // 조언 제공
  async provideAdvice(data) {
    const { situation, spec, performance, callback } = data;

    // 상황 분석
    const analysis = this.analyzeSituation(situation, spec);

    // 개선 방안 도출
    const improvements = this.identifyImprovements(performance);

    // 조언 생성
    const advice = {
      situation: analysis,
      improvements,
      tips: this.getContextualTips(situation, spec),
      confidence: this.confidence
    };

    // 경험치 증가
    this.gainExperience(2);

    const formattedAdvice = this.formatAdvice(advice);

    if (callback) callback(formattedAdvice);
    return formattedAdvice;
  }

  // 상황 분석
  analyzeSituation(situation, spec) {
    return {
      type: situation.type || 'general',
      difficulty: situation.difficulty || 'normal',
      priority: situation.priority || 'medium'
    };
  }

  // 개선 사항 식별
  identifyImprovements(performance) {
    const improvements = [];

    if (performance) {
      // DPS 체크
      if (performance.dps && performance.expectedDps) {
        const dpsRatio = performance.dps / performance.expectedDps;
        if (dpsRatio < 0.9) {
          improvements.push({
            area: 'DPS',
            current: performance.dps,
            expected: performance.expectedDps,
            priority: 'high',
            suggestion: 'DPS 향상이 필요합니다. 로테이션을 점검해보세요.'
          });
        }
      }

      // 업타임 체크
      if (performance.uptime && performance.uptime < 90) {
        improvements.push({
          area: '업타임',
          current: performance.uptime,
          expected: 95,
          priority: 'medium',
          suggestion: '스킬 사용 빈도를 늘려보세요.'
        });
      }
    }

    return improvements;
  }

  // 상황별 팁
  getContextualTips(situation, spec) {
    const tips = [];

    // 기본 팁 (자식 클래스에서 확장)
    tips.push('항상 기본기를 중요시하세요.');
    tips.push('꾸준한 연습이 실력 향상의 지름길입니다.');

    return tips;
  }

  // 조언 포맷팅
  formatAdvice(advice) {
    let message = `${this.personality.greeting}\n\n`;

    if (advice.improvements.length > 0) {
      message += '**📈 개선 사항:**\n';
      advice.improvements.forEach(imp => {
        const icon = imp.priority === 'high' ? '🔴' : '🟡';
        message += `${icon} ${imp.area}: ${imp.current} → ${imp.expected}\n`;
        message += `   ${imp.suggestion}\n`;
      });
    }

    if (advice.tips.length > 0) {
      message += '\n**💡 팁:**\n';
      advice.tips.forEach(tip => {
        message += `• ${tip}\n`;
      });
    }

    return {
      success: true,
      message,
      metadata: {
        confidence: advice.confidence,
        improvementCount: advice.improvements.length
      }
    };
  }

  // 성능 분석
  async analyzePerformance(data) {
    const { logs, spec, callback } = data;

    // 로그 분석
    const analysis = {
      dps: this.calculateDPS(logs),
      uptime: this.calculateUptime(logs),
      rotationAccuracy: this.analyzeRotation(logs, spec),
      resourceEfficiency: this.analyzeResourceUsage(logs)
    };

    // 점수 계산
    const score = this.calculatePerformanceScore(analysis);

    // 피드백 생성
    const feedback = this.generatePerformanceFeedback(analysis, score);

    // 경험치 증가
    this.gainExperience(3);

    const result = {
      success: true,
      analysis,
      score,
      feedback,
      metadata: {
        personaClass: this.className,
        confidence: this.confidence
      }
    };

    if (callback) callback(result);
    return result;
  }

  // DPS 계산 (간단한 구현)
  calculateDPS(logs) {
    if (!logs || logs.length === 0) return 0;

    const totalDamage = logs.reduce((sum, log) => sum + (log.damage || 0), 0);
    const duration = (logs[logs.length - 1].timestamp - logs[0].timestamp) / 1000;

    return duration > 0 ? Math.round(totalDamage / duration) : 0;
  }

  // 업타임 계산
  calculateUptime(logs) {
    if (!logs || logs.length === 0) return 0;

    const activeLogs = logs.filter(log => log.type === 'cast' || log.type === 'damage');
    return Math.min(100, (activeLogs.length / logs.length) * 100);
  }

  // 로테이션 분석
  analyzeRotation(logs, spec) {
    // 기본 구현 (자식 클래스에서 구체화)
    return 75; // 기본 정확도
  }

  // 리소스 사용 분석
  analyzeResourceUsage(logs) {
    // 기본 구현 (자식 클래스에서 구체화)
    return 80; // 기본 효율성
  }

  // 성능 점수 계산
  calculatePerformanceScore(analysis) {
    const weights = {
      dps: 0.4,
      uptime: 0.2,
      rotationAccuracy: 0.25,
      resourceEfficiency: 0.15
    };

    let score = 0;

    // DPS 점수 (50000 기준)
    score += Math.min(100, (analysis.dps / 50000) * 100) * weights.dps;

    // 업타임 점수
    score += analysis.uptime * weights.uptime;

    // 로테이션 정확도
    score += analysis.rotationAccuracy * weights.rotationAccuracy;

    // 리소스 효율성
    score += analysis.resourceEfficiency * weights.resourceEfficiency;

    return Math.round(score);
  }

  // 성능 피드백 생성
  generatePerformanceFeedback(analysis, score) {
    let feedback = [];

    // 점수별 피드백
    if (score >= 90) {
      feedback.push('🏆 훌륭한 성능입니다!');
    } else if (score >= 75) {
      feedback.push('👍 좋은 성능을 보이고 있습니다.');
    } else if (score >= 60) {
      feedback.push('📈 개선의 여지가 있습니다.');
    } else {
      feedback.push('💪 더 많은 연습이 필요합니다.');
    }

    // 세부 피드백
    if (analysis.uptime < 90) {
      feedback.push('• 스킬 사용 빈도를 늘려보세요.');
    }

    if (analysis.rotationAccuracy < 80) {
      feedback.push('• 로테이션 순서를 다시 확인해보세요.');
    }

    if (analysis.resourceEfficiency < 75) {
      feedback.push('• 리소스 관리에 주의를 기울여보세요.');
    }

    return feedback;
  }

  // 경험치 획득
  gainExperience(amount) {
    this.experience += amount;

    // 레벨 계산 (100 경험치당 1레벨)
    const newLevel = Math.floor(this.experience / 100) + 1;

    if (newLevel > this.level) {
      this.levelUp(newLevel);
    }
  }

  // 레벨업
  levelUp(newLevel) {
    const oldLevel = this.level;
    this.level = newLevel;

    // 신뢰도 증가
    this.confidence = Math.min(0.95, this.confidence + 0.05);

    console.log(`🎉 ${this.koreanName} 페르소나 레벨업! ${oldLevel} → ${newLevel}`);

    // 이벤트 발행
    moduleEventBus.emit('persona-levelup', {
      class: this.className,
      oldLevel,
      newLevel,
      confidence: this.confidence
    });
  }

  // 대화 기록 조회
  getConversationHistory(limit = 10) {
    return this.conversationHistory.slice(-limit);
  }

  // 페르소나 상태 조회
  getStatus() {
    return {
      class: this.className,
      koreanName: this.koreanName,
      level: this.level,
      experience: this.experience,
      confidence: this.confidence,
      specs: this.specs,
      personalityType: this.personality.type,
      conversationCount: this.conversationHistory.length,
      discoveredSkillsCount: this.discoveredSkills.size
    };
  }

  // 새 스킬 발견 시 처리
  async encounterNewSkill(skillId, englishName, spec) {
    // 이미 발견한 스킬인지 확인
    if (this.discoveredSkills.has(skillId)) {
      return;
    }

    console.log(`🔍 ${this.koreanName} 페르소나가 새 스킬 발견: ${englishName} (ID: ${skillId})`);

    // 발견한 스킬 목록에 추가
    this.discoveredSkills.add(skillId);

    // SkillDatabaseManager에 이벤트 발행
    moduleEventBus.emit('new-skill-discovered', {
      skillId: skillId,
      englishName: englishName,
      className: this.className,
      spec: spec || '공용',
      source: `${this.className}-persona`
    });

    // DB에서 번역된 데이터 조회 (콜백으로 받기)
    return new Promise((resolve) => {
      moduleEventBus.emit('query-skill-db', {
        skillId: skillId,
        callback: (skillData) => {
          if (skillData) {
            console.log(`✅ 스킬 번역 확인: ${skillData.koreanName}`);
            // 페르소나 지식에 추가
            this.learnSkillTranslation(skillId, skillData);
            resolve(skillData);
          } else {
            console.log(`⏳ 스킬 번역 대기 중...`);
            // 번역 완료 이벤트 대기
            const handler = (data) => {
              if (data.skillId === skillId) {
                this.learnSkillTranslation(skillId, data.skillData);
                moduleEventBus.off('skill-added-to-db', handler);
                resolve(data.skillData);
              }
            };
            moduleEventBus.on('skill-added-to-db', handler);
          }
        }
      });
    });
  }

  // 스킬 번역 학습
  learnSkillTranslation(skillId, skillData) {
    // 페르소나의 지식 데이터베이스에 추가
    if (!this.knowledge.has('skills')) {
      this.knowledge.set('skills', new Map());
    }

    const skillsKnowledge = this.knowledge.get('skills');
    skillsKnowledge.set(skillId, {
      id: skillId,
      koreanName: skillData.koreanName,
      englishName: skillData.englishName,
      icon: skillData.icon,
      description: skillData.description,
      spec: skillData.spec,
      learnedAt: new Date().toISOString()
    });

    console.log(`📚 ${this.koreanName} 페르소나가 스킬 학습: ${skillData.koreanName} (${skillData.englishName})`);

    // 경험치 획득
    this.gainExperience(5);
  }

  // APL이나 가이드에서 스킬을 처리할 때 호출
  async processSkillReference(skillIdentifier) {
    // skillIdentifier는 ID 또는 영문명일 수 있음
    const skillId = this.extractSkillId(skillIdentifier);
    const englishName = this.extractEnglishName(skillIdentifier);

    if (skillId) {
      // DB 조회
      const skillData = await this.querySkillDatabase(skillId);
      if (!skillData && englishName) {
        // DB에 없으면 새 스킬로 처리
        return await this.encounterNewSkill(skillId, englishName, this.currentSpec);
      }
      return skillData;
    }

    return null;
  }

  // 스킬 ID 추출 (하위 클래스에서 구현)
  extractSkillId(identifier) {
    // 숫자만 있으면 ID로 간주
    if (/^\d+$/.test(identifier)) {
      return identifier;
    }
    return null;
  }

  // 영문명 추출 (하위 클래스에서 구현)
  extractEnglishName(identifier) {
    // 영문 텍스트면 그대로 반환
    if (/^[a-zA-Z\s_-]+$/.test(identifier)) {
      return identifier.replace(/_/g, ' ').replace(/-/g, ' ');
    }
    return null;
  }

  // DB에서 스킬 조회
  async querySkillDatabase(skillId) {
    return new Promise((resolve) => {
      moduleEventBus.emit('query-skill-db', {
        skillId: skillId,
        callback: (skillData) => {
          resolve(skillData);
        }
      });
    });
  }
}

export default BaseClassPersona;