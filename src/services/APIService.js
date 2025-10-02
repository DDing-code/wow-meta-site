// API ?�비??- 백엔?��? ?�신
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003';

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // 공통 ?�청 ?�퍼
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API ?�청 ?�패 (${endpoint}):`, error);
      throw error;
    }
  }

  // ===== ?�습 ?�이??API =====

  // 데이터 저장
  async saveLearningData(data) {
    return this.request('/api/learning/save', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // 배치 로그 저장
  async saveBatchLearningData(logs) {
    return this.request('/api/learning/save-batch', {
      method: 'POST',
      body: JSON.stringify({ logs })
    });
  }

  // 상위 10% 로그 조회
  async getTop10Logs(className, spec, limit = 100) {
    return this.request(`/api/learning/top10/${className}/${spec}?limit=${limit}`);
  }

  // 클래스 통계 조회
  async getClassStatistics(className, spec) {
    return this.request(`/api/learning/statistics/${className}/${spec}`);
  }

  // 최근 학습 데이터
  async getRecentLearning(hours = 24) {
    return this.request(`/api/learning/recent?hours=${hours}`);
  }

  // ===== WarcraftLogs API =====

  // ?�제 ??�� ?�이??(?�위 10%)
  async getRankings(encounter, className, spec) {
    return this.request(`/api/warcraftlogs/rankings/${encounter}?class=${className}&spec=${spec}`);
  }

  // ?�정 리포??분석
  async getReport(code, fightId) {
    return this.request(`/api/warcraftlogs/report/${code}?fightId=${fightId}`);
  }

  // 최근 로그 조회
  async getRecentLogs() {
    return this.request('/api/warcraftlogs/recent-logs');
  }

  // ===== AI 분석 API =====

  // AI ?�문가 ?�태
  async getExpertStatus(className, spec) {
    return this.request(`/api/ai/expert/${className}/${spec}`);
  }

  // AI 분석 ?�청
  async analyzeLog(logData, className, spec) {
    return this.request('/api/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ logData, className, spec })
    });
  }

  // ?�시�??�략
  async getStrategy(className, spec, encounter, phase) {
    return this.request('/api/ai/strategy', {
      method: 'POST',
      body: JSON.stringify({ className, spec, encounter, phase })
    });
  }

  // ===== ?�스체크 =====
  async checkHealth() {
    return this.request('/health');
  }
}

// ?��????�스?�스
const apiService = new APIService();
export default apiService;
