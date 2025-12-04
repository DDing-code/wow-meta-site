// Knowledge Base API - 도메인별 데이터 접근 레이어
// 가이드 렌더링, 로그 분석, AI 학습, 시뮬레이션 시스템에서 사용

/**
 * Knowledge Base API
 * - 전문화별 KB 데이터를 로드하고 캐싱
 * - 도메인별(guide/analysis/learning/simulation) 데이터 접근 메서드 제공
 * - 동적 import로 코드 스플리팅
 */
class KnowledgeBaseAPI {
  /**
   * @param {string} specName - 전문화명 (예: 'havoc-demonhunter')
   */
  constructor(specName) {
    this.specName = specName;
    this.cache = new Map();  // 메커니즘 캐시
    this.allMechanismsCache = null;  // 전체 메커니즘 캐시
  }

  /**
   * 가이드 렌더링용 데이터 조회
   * @param {string} mechanismId - 메커니즘 ID
   * @returns {Promise<Object>} guide 도메인 데이터
   */
  async getGuideData(mechanismId) {
    const mechanism = await this.loadMechanism(mechanismId);

    return {
      id: mechanism.id,
      name: mechanism.name,
      description: mechanism.guide.description,
      details: mechanism.guide.details,
      relatedSkills: mechanism.guide.relatedSkills,
      importance: mechanism.guide.importance || 'medium',
      visualizations: mechanism.guide.visualizations || []
    };
  }

  /**
   * 로그 분석용 설정 조회
   * @param {string} mechanismId - 메커니즘 ID
   * @returns {Promise<Object>} analysis 도메인 데이터
   */
  async getAnalysisConfig(mechanismId) {
    const mechanism = await this.loadMechanism(mechanismId);

    return {
      id: mechanism.id,
      name: mechanism.name,
      buffId: mechanism.analysis.buffId,
      debuffId: mechanism.analysis.debuffId,
      stackInfo: mechanism.analysis.stackInfo,
      triggers: mechanism.analysis.triggers,
      metrics: mechanism.analysis.metrics
    };
  }

  /**
   * AI 학습용 데이터 조회
   * @param {string} mechanismId - 메커니즘 ID
   * @returns {Promise<Object>} learning 도메인 데이터
   */
  async getLearningData(mechanismId) {
    const mechanism = await this.loadMechanism(mechanismId);

    return {
      id: mechanism.id,
      name: mechanism.name,
      category: mechanism.learning.category,
      difficulty: mechanism.learning.difficulty,
      keyPoints: mechanism.learning.keyPoints,
      commonMistakes: mechanism.learning.commonMistakes,
      synergies: mechanism.learning.synergies || []
    };
  }

  /**
   * 시뮬레이션용 설정 조회
   * @param {string} mechanismId - 메커니즘 ID
   * @returns {Promise<Object>} simulation 도메인 데이터
   */
  async getSimulationConfig(mechanismId) {
    const mechanism = await this.loadMechanism(mechanismId);

    return {
      id: mechanism.id,
      type: mechanism.simulation.type,
      damageMultiplier: mechanism.simulation.damageMultiplier,
      maxStacks: mechanism.simulation.maxStacks,
      stackDuration: mechanism.simulation.stackDuration,
      procRate: mechanism.simulation.procRate,
      cooldown: mechanism.simulation.cooldown,
      dependencies: mechanism.simulation.dependencies
    };
  }

  /**
   * 전체 메커니즘 조회 (필터링 가능)
   * @param {Object} filters - 필터 옵션
   * @param {string} filters.importance - 중요도 필터 ('critical', 'high', 'medium', 'low')
   * @param {string} filters.category - 카테고리 필터
   * @param {string} filters.difficulty - 난이도 필터
   * @returns {Promise<Array>} 메커니즘 배열
   */
  async getAllMechanisms(filters = {}) {
    // 캐시 확인
    if (this.allMechanismsCache) {
      return this.filterMechanisms(this.allMechanismsCache, filters);
    }

    // 전체 메커니즘 로드
    try {
      const indexModule = await import(`../${this.specName}/index.js`);
      const getAllMechanisms = indexModule.default || indexModule.getAllMechanisms;

      if (typeof getAllMechanisms !== 'function') {
        throw new Error(`getAllMechanisms is not a function in ${this.specName}/index.js`);
      }

      const mechanisms = await getAllMechanisms();
      this.allMechanismsCache = mechanisms;

      return this.filterMechanisms(mechanisms, filters);
    } catch (error) {
      console.error(`Failed to load mechanisms for ${this.specName}:`, error);
      return [];
    }
  }

  /**
   * 메커니즘 필터링
   * @param {Array} mechanisms - 메커니즘 배열
   * @param {Object} filters - 필터 옵션
   * @returns {Array} 필터링된 메커니즘 배열
   */
  filterMechanisms(mechanisms, filters) {
    let filtered = mechanisms;

    if (filters.importance) {
      filtered = filtered.filter(m =>
        m.guide.importance === filters.importance
      );
    }

    if (filters.category) {
      filtered = filtered.filter(m =>
        m.learning.category === filters.category
      );
    }

    if (filters.difficulty) {
      filtered = filtered.filter(m =>
        m.learning.difficulty === filters.difficulty
      );
    }

    if (filters.verified !== undefined) {
      filtered = filtered.filter(m =>
        m.metadata?.verified === filters.verified
      );
    }

    return filtered;
  }

  /**
   * 개별 메커니즘 로드 (캐싱)
   * @param {string} id - 메커니즘 ID
   * @returns {Promise<Object>} 메커니즘 객체
   */
  async loadMechanism(id) {
    // 캐시 확인
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    // 동적 import로 메커니즘 로드
    try {
      const mechanismModule = await import(
        /* webpackChunkName: "mechanism-[request]" */
        `../${this.specName}/mechanisms/${id}.js`
      );

      const mechanism = mechanismModule.default;

      if (!mechanism) {
        throw new Error(`Mechanism ${id} has no default export`);
      }

      // 캐시 저장
      this.cache.set(id, mechanism);

      return mechanism;
    } catch (error) {
      console.error(`Failed to load mechanism ${id}:`, error);
      throw new Error(`Mechanism ${id} not found`);
    }
  }

  /**
   * 캐시 초기화
   */
  clearCache() {
    this.cache.clear();
    this.allMechanismsCache = null;
  }

  /**
   * KB 버전 정보 조회
   * @returns {Promise<Object>} KB 버전 정보
   */
  async getKBVersion() {
    try {
      const indexModule = await import(`../${this.specName}/index.js`);

      return {
        version: indexModule.KB_VERSION || '1.0.0',
        specName: indexModule.SPEC_NAME || this.specName,
        patch: indexModule.PATCH || 'unknown'
      };
    } catch (error) {
      console.error(`Failed to load KB version for ${this.specName}:`, error);
      return {
        version: '1.0.0',
        specName: this.specName,
        patch: 'unknown'
      };
    }
  }
}

export default KnowledgeBaseAPI;
