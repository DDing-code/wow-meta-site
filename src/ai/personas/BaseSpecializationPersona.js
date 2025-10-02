/**
 * BaseSpecializationPersona - 모든 전문화 페르소나의 기본 클래스
 * 각 전문화별 고유한 특성과 플레이스타일을 정의
 */

import { EventEmitter } from 'events';
import { getGuideLinks } from '../../data/guideLinks';

class BaseSpecializationPersona extends EventEmitter {
  constructor() {
    super();

    // 기본 페르소나 정보
    this.class = '';           // 클래스명 (예: '사냥꾼')
    this.classEng = '';        // 영문 클래스명 (예: 'Hunter')
    this.spec = '';            // 전문화명 (예: '야수')
    this.specEng = '';         // 영문 전문화명 (예: 'Beast Mastery')
    this.classColor = '#FFF';  // 클래스 색상

    // 영웅 특성
    this.heroTalents = [];     // 사용 가능한 영웅 특성 2개

    // 게임플레이 특성
    this.role = '';            // 역할 (DPS/Tank/Healer)
    this.rangeType = '';       // 원거리/근거리
    this.resourceType = '';    // 리소스 타입
    this.resourceName = '';    // 리소스 이름

    // 전문화 고유 특징
    this.uniqueFeatures = [];  // 고유 메커니즘들
    this.strengths = [];       // 장점
    this.weaknesses = [];      // 단점

    // 페르소나 상태
    this.level = 1;
    this.experience = 0;
    this.confidence = 0.5;
    this.lastUpdated = new Date();

    // 지식 베이스
    this.knowledge = new Map();
    this.skillDatabase = new Map();
    this.rotationPatterns = new Map();
    this.statPriorities = new Map();

    // 학습 히스토리
    this.learningHistory = [];
    this.analyzedLogs = [];
  }

  /**
   * 페르소나 초기화
   */
  async initialize() {
    console.log(`🎮 ${this.spec} ${this.class} 페르소나 초기화 중...`);

    await this.loadSkillDatabase();
    await this.loadRotationPatterns();
    await this.loadStatPriorities();
    await this.loadHeroTalents();

    // 가이드 링크 로드
    this.loadGuideLinks();

    this.confidence = 0.7; // 초기화 후 신뢰도 상승

    console.log(`✅ ${this.spec} ${this.class} 페르소나 준비 완료!`);
    return true;
  }

  /**
   * 스킬 데이터베이스 로드
   */
  async loadSkillDatabase() {
    // 각 전문화별로 오버라이드
    throw new Error('loadSkillDatabase must be implemented by subclass');
  }

  /**
   * 로테이션 패턴 로드
   */
  async loadRotationPatterns() {
    // 각 전문화별로 오버라이드
    throw new Error('loadRotationPatterns must be implemented by subclass');
  }

  /**
   * 스탯 우선순위 로드
   */
  async loadStatPriorities() {
    // 각 전문화별로 오버라이드
    throw new Error('loadStatPriorities must be implemented by subclass');
  }

  /**
   * 영웅 특성 로드
   */
  async loadHeroTalents() {
    // 각 전문화별로 오버라이드
    throw new Error('loadHeroTalents must be implemented by subclass');
  }

  /**
   * 가이드 링크 로드
   */
  loadGuideLinks() {
    // 클래스명과 스펙명을 guideLinks 형식에 맞게 변환
    const classKey = this.classEng.toLowerCase().replace(' ', '-');
    const specKey = this.specEng.toLowerCase().replace(' ', '-');

    this.guideLinks = getGuideLinks(classKey, specKey);

    if (this.guideLinks) {
      console.log(`📚 ${this.spec} 가이드 링크 로드 완료`);
      // 지식 베이스에 가이드 링크 저장
      this.saveKnowledge('guide_links', this.guideLinks);
    } else {
      console.log(`❌ ${this.spec} 가이드 링크를 찾을 수 없습니다`);
    }
  }

  /**
   * 질문 처리
   */
  async handleQuestion(question) {
    const { type, content, context } = question;

    console.log(`💬 [${this.spec}] 질문 처리: ${type}`);

    let response = '';

    switch(type) {
      case 'rotation':
        response = await this.getRotationAdvice(context);
        break;
      case 'stats':
        response = await this.getStatPriority(context);
        break;
      case 'talents':
        response = await this.getTalentAdvice(context);
        break;
      case 'gear':
        response = await this.getGearAdvice(context);
        break;
      case 'general':
        response = await this.getGeneralAdvice(content);
        break;
      default:
        response = `${this.spec} ${this.class}에 대한 구체적인 질문을 해주세요.`;
    }

    this.experience += 10;
    this.checkLevelUp();

    return {
      success: true,
      message: response,
      confidence: this.confidence,
      spec: this.spec
    };
  }

  /**
   * 로테이션 조언
   */
  async getRotationAdvice(context) {
    const { heroTalent, situation = 'single' } = context;

    const pattern = this.rotationPatterns.get(`${heroTalent}-${situation}`);

    if (!pattern) {
      return `${heroTalent} ${situation} 상황의 로테이션 정보를 찾을 수 없습니다.`;
    }

    return this.formatRotationAdvice(pattern);
  }

  /**
   * 스탯 우선순위
   */
  async getStatPriority(context) {
    const { heroTalent, mode = 'raid' } = context;

    const priority = this.statPriorities.get(`${heroTalent}-${mode}`);

    if (!priority) {
      return `${heroTalent} ${mode} 스탯 우선순위 정보를 찾을 수 없습니다.`;
    }

    return this.formatStatPriority(priority);
  }

  /**
   * 특성 조언
   */
  async getTalentAdvice(context) {
    const { heroTalent, content = 'raid' } = context;

    // 각 전문화별로 구현
    return `${heroTalent} ${content} 특성 빌드 추천`;
  }

  /**
   * 장비 조언
   */
  async getGearAdvice(context) {
    // 각 전문화별로 구현
    return '장비 추천 정보';
  }

  /**
   * 일반 조언
   */
  async getGeneralAdvice(content) {
    return `${this.spec} ${this.class}는 ${this.role} 역할을 수행하는 ${this.rangeType} 전문화입니다.`;
  }

  /**
   * 로그 분석
   */
  async analyzeLog(logData) {
    console.log(`📊 [${this.spec}] 로그 분석 시작...`);

    const analysis = {
      spec: this.spec,
      timestamp: new Date(),
      performance: {},
      suggestions: []
    };

    // 기본 성능 분석
    analysis.performance = await this.analyzePerformance(logData);

    // 개선 제안
    analysis.suggestions = await this.generateSuggestions(analysis.performance);

    // 분석 기록 저장
    this.analyzedLogs.push(analysis);

    // 경험치 증가
    this.experience += 50;
    this.checkLevelUp();

    return analysis;
  }

  /**
   * 성능 분석
   */
  async analyzePerformance(logData) {
    // 각 전문화별로 구현
    return {
      dps: 0,
      uptime: {},
      resourceUsage: {},
      cooldownUsage: {}
    };
  }

  /**
   * 개선 제안 생성
   */
  async generateSuggestions(performance) {
    const suggestions = [];

    // 기본 제안사항
    if (performance.dps < 50000) {
      suggestions.push('DPS 향상을 위해 로테이션 최적화가 필요합니다.');
    }

    return suggestions;
  }

  /**
   * 로테이션 조언 포맷
   */
  formatRotationAdvice(pattern) {
    let advice = `🎯 ${this.spec} 로테이션:\n\n`;

    if (pattern.opener) {
      advice += '**오프닝 시퀀스:**\n';
      pattern.opener.forEach((skill, index) => {
        advice += `${index + 1}. ${skill}\n`;
      });
    }

    if (pattern.priority) {
      advice += '\n**우선순위:**\n';
      pattern.priority.forEach((item, index) => {
        advice += `${index + 1}. ${item.skill} - ${item.condition}\n`;
      });
    }

    return advice;
  }

  /**
   * 스탯 우선순위 포맷
   */
  formatStatPriority(priority) {
    let advice = `📊 ${this.spec} 스탯 우선순위:\n\n`;

    priority.forEach((stat, index) => {
      advice += `${index + 1}. ${stat}\n`;
    });

    return advice;
  }

  /**
   * 레벨업 체크
   */
  checkLevelUp() {
    const requiredExp = this.level * 100;

    if (this.experience >= requiredExp) {
      this.level++;
      this.experience = 0;
      this.confidence = Math.min(0.99, this.confidence + 0.05);

      console.log(`🎉 [${this.spec}] 레벨업! 현재 레벨: ${this.level}`);

      this.emit('levelUp', {
        spec: this.spec,
        level: this.level,
        confidence: this.confidence
      });
    }
  }

  /**
   * 새로운 스킬 학습
   */
  async learnNewSkill(skillId, skillData) {
    if (this.skillDatabase.has(skillId)) {
      console.log(`[${this.spec}] 이미 알고 있는 스킬: ${skillData.name}`);
      return false;
    }

    this.skillDatabase.set(skillId, {
      ...skillData,
      learnedAt: new Date(),
      usageCount: 0
    });

    this.experience += 20;
    console.log(`✨ [${this.spec}] 새 스킬 학습: ${skillData.name}`);

    return true;
  }

  /**
   * 페르소나 상태 조회
   */
  getStatus() {
    return {
      class: this.class,
      spec: this.spec,
      level: this.level,
      experience: this.experience,
      confidence: this.confidence,
      knowledgeCount: this.knowledge.size,
      skillCount: this.skillDatabase.size,
      analyzedLogs: this.analyzedLogs.length,
      lastUpdated: this.lastUpdated
    };
  }

  /**
   * 지식 저장
   */
  saveKnowledge(key, value) {
    this.knowledge.set(key, {
      data: value,
      timestamp: new Date(),
      confidence: this.confidence
    });

    this.experience += 5;
  }

  /**
   * 지식 조회
   */
  getKnowledge(key) {
    return this.knowledge.get(key);
  }

  /**
   * 가이드 생성
   */
  async generateGuide(options = {}) {
    const { heroTalent, format = 'detailed' } = options;

    console.log(`📝 [${this.spec}] 가이드 생성 중...`);

    const guide = {
      metadata: {
        class: this.class,
        spec: this.spec,
        heroTalent: heroTalent,
        patch: '11.2',
        season: 'TWW Season 3',
        generatedAt: new Date(),
        confidence: this.confidence
      },
      overview: await this.generateOverview(),
      rotation: await this.generateRotation(heroTalent),
      talents: await this.generateTalents(heroTalent),
      stats: await this.generateStats(heroTalent),
      gear: await this.generateGear(heroTalent),
      references: this.guideLinks // 참고 가이드 링크 포함
    };

    this.experience += 100;
    this.checkLevelUp();

    return guide;
  }

  // 가이드 섹션 생성 메서드들 (각 전문화별로 오버라이드)
  async generateOverview() {
    return {
      description: `${this.spec} ${this.class} 개요`,
      strengths: this.strengths,
      weaknesses: this.weaknesses,
      uniqueFeatures: this.uniqueFeatures
    };
  }

  async generateRotation(heroTalent) {
    return this.rotationPatterns.get(heroTalent) || {};
  }

  async generateTalents(heroTalent) {
    return {};
  }

  async generateStats(heroTalent) {
    return this.statPriorities.get(heroTalent) || [];
  }

  async generateGear(heroTalent) {
    return {};
  }

  /**
   * 가이드 참고 자료 제공
   */
  getGuideReferences() {
    if (!this.guideLinks) {
      return '가이드 링크를 찾을 수 없습니다.';
    }

    let references = `📚 ${this.spec} ${this.class} 참고 가이드:\n\n`;

    Object.entries(this.guideLinks.links).forEach(([site, url]) => {
      if (typeof url === 'object') {
        references += `• ${site} (KR): ${url.kr}\n`;
        references += `• ${site} (EN): ${url.en}\n`;
      } else {
        references += `• ${site}: ${url}\n`;
      }
    });

    return references;
  }

  /**
   * 가이드 데이터 흡수 (강화 메커니즘)
   */
  async absorbGuideData(guideData) {
    console.log(`📖 [${this.spec}] 외부 가이드 데이터 흡수 중...`);

    // 스킬 데이터 흡수
    if (guideData.skills) {
      guideData.skills.forEach(skill => {
        if (!this.skillDatabase.has(skill.id)) {
          this.skillDatabase.set(skill.id, {
            ...skill,
            source: 'external_guide',
            confidence: 0.85
          });
        }
      });
      console.log(`  ✓ ${guideData.skills.length}개 스킬 추가`);
    }

    // 로테이션 패턴 흡수
    if (guideData.rotations) {
      Object.entries(guideData.rotations).forEach(([key, pattern]) => {
        this.rotationPatterns.set(key, pattern);
      });
      console.log(`  ✓ ${Object.keys(guideData.rotations).length}개 로테이션 패턴 추가`);
    }

    // 특성 빌드 흡수
    if (guideData.talents) {
      this.saveKnowledge('talent_builds', guideData.talents);
      console.log(`  ✓ 특성 빌드 데이터 저장`);
    }

    // 스탯 우선순위 흡수
    if (guideData.stats) {
      Object.entries(guideData.stats).forEach(([key, priority]) => {
        this.statPriorities.set(key, priority);
      });
      console.log(`  ✓ 스탯 우선순위 업데이트`);
    }

    // 경험치와 신뢰도 상승
    this.experience += 200;
    this.confidence = Math.min(0.95, this.confidence + 0.1);
    this.checkLevelUp();

    console.log(`✅ [${this.spec}] 가이드 데이터 흡수 완료 (신뢰도: ${(this.confidence * 100).toFixed(0)}%)`);

    return true;
  }
}

export default BaseSpecializationPersona;