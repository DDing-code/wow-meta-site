// ============================================================
// Event Bus - 모듈 간 유기적 통신 시스템
// ============================================================
// 목적: Pub/Sub 패턴으로 컴포넌트 간 느슨한 결합 구현
// 업데이트: 2025-11-11
// ============================================================

/**
 * EventBus - 이벤트 기반 통신 시스템
 *
 * 유기적 시스템의 핵심:
 * - 한 모듈의 변화가 다른 모듈에 즉시 전파
 * - 컴포넌트 간 직접 의존성 제거
 * - 실시간 데이터 동기화
 */
class EventBus {
  constructor() {
    // 이벤트 저장소: { eventName: [callback1, callback2, ...] }
    this.events = {};

    // 이벤트 히스토리 (디버깅용)
    this.history = [];
    this.maxHistorySize = 100;
  }

  /**
   * 이벤트 구독
   * @param {string} event - 이벤트 이름
   * @param {Function} callback - 콜백 함수
   * @returns {Function} 구독 해제 함수
   */
  on(event, callback) {
    if (typeof callback !== 'function') {
      throw new Error(`EventBus.on: callback must be a function, got ${typeof callback}`);
    }

    // 이벤트 배열 초기화
    if (!this.events[event]) {
      this.events[event] = [];
    }

    // 콜백 추가
    this.events[event].push(callback);

    // 구독 해제 함수 반환 (cleanup)
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * 이벤트 구독 해제
   * @param {string} event - 이벤트 이름
   * @param {Function} callback - 해제할 콜백 함수
   */
  off(event, callback) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(cb => cb !== callback);

    // 구독자가 없으면 이벤트 배열 삭제
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }

  /**
   * 이벤트 발행
   * @param {string} event - 이벤트 이름
   * @param {*} data - 전달할 데이터
   */
  emit(event, data) {
    // 히스토리 기록
    this.addToHistory(event, data);

    // 구독자가 없으면 리턴
    if (!this.events[event]) {
      console.debug(`[EventBus] No subscribers for event: ${event}`);
      return;
    }

    // 모든 구독자에게 데이터 전파
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[EventBus] Error in callback for event "${event}":`, error);
      }
    });

    console.debug(`[EventBus] Emitted "${event}" to ${this.events[event].length} subscribers`);
  }

  /**
   * 일회성 이벤트 구독 (한 번만 실행)
   * @param {string} event - 이벤트 이름
   * @param {Function} callback - 콜백 함수
   * @returns {Function} 구독 해제 함수
   */
  once(event, callback) {
    const onceWrapper = (data) => {
      callback(data);
      this.off(event, onceWrapper);
    };

    return this.on(event, onceWrapper);
  }

  /**
   * 이벤트 히스토리에 추가
   * @param {string} event - 이벤트 이름
   * @param {*} data - 데이터
   */
  addToHistory(event, data) {
    const entry = {
      event,
      data,
      timestamp: new Date().toISOString()
    };

    this.history.unshift(entry);

    // 최대 크기 제한
    if (this.history.length > this.maxHistorySize) {
      this.history.pop();
    }
  }

  /**
   * 이벤트 히스토리 조회
   * @param {number} limit - 조회할 개수 (기본 10)
   * @returns {Array} 최근 이벤트 배열
   */
  getHistory(limit = 10) {
    return this.history.slice(0, limit);
  }

  /**
   * 특정 이벤트의 구독자 수 조회
   * @param {string} event - 이벤트 이름
   * @returns {number} 구독자 수
   */
  getSubscriberCount(event) {
    return this.events[event] ? this.events[event].length : 0;
  }

  /**
   * 모든 이벤트 구독 해제
   */
  clear() {
    this.events = {};
    console.debug('[EventBus] All events cleared');
  }

  /**
   * 현재 등록된 모든 이벤트 목록 조회
   * @returns {Array} 이벤트 이름 배열
   */
  getEventNames() {
    return Object.keys(this.events);
  }
}

// Singleton 인스턴스 생성
export const eventBus = new EventBus();

/**
 * 이벤트 타입 정의 (타입 안전성)
 *
 * 유기적 연계 시나리오:
 * 1. SKILL_SELECTED → 스킬 클릭 시 모든 모듈에 전파
 * 2. SPEC_CHANGED → 전문화 변경 시 필터/뷰 자동 업데이트
 * 3. ROTATION_UPDATED → 로테이션 변경 시 가이드 갱신
 * 4. LOG_ANALYZED → 로그 분석 완료 시 통계 반영
 * 5. GUIDE_UPDATED → 가이드 업데이트 시 관련 컴포넌트 갱신
 * 6. DB_UPDATED → 스킬 DB 업데이트 시 전체 동기화
 */
export const EVENTS = {
  // 스킬 관련
  SKILL_SELECTED: 'skill:selected',       // 스킬 선택 (클릭/호버)
  SKILL_ADDED: 'skill:added',             // 새 스킬 추가
  SKILL_UPDATED: 'skill:updated',         // 스킬 업데이트

  // 전문화 관련
  SPEC_CHANGED: 'spec:changed',           // 전문화 변경
  SPEC_LOADED: 'spec:loaded',             // 전문화 로드 완료

  // 로테이션 관련
  ROTATION_UPDATED: 'rotation:updated',   // 로테이션 업데이트
  ROTATION_ANALYZED: 'rotation:analyzed', // 로테이션 분석 완료

  // 로그 분석 관련
  LOG_ANALYZED: 'log:analyzed',           // 로그 분석 완료
  LOG_UPLOADED: 'log:uploaded',           // 로그 업로드

  // 가이드 관련
  GUIDE_UPDATED: 'guide:updated',         // 가이드 업데이트
  GUIDE_VIEWED: 'guide:viewed',           // 가이드 조회
  GUIDE_SHARED: 'guide:shared',           // 가이드 공유

  // 데이터베이스 관련
  DB_UPDATED: 'db:updated',               // DB 업데이트
  DB_SYNCED: 'db:synced',                 // DB 동기화 완료

  // UI 관련
  TOOLTIP_SHOWN: 'tooltip:shown',         // 툴팁 표시
  TOOLTIP_HIDDEN: 'tooltip:hidden',       // 툴팁 숨김

  // 피드백 관련
  FEEDBACK_SUBMITTED: 'feedback:submitted', // 피드백 제출
  ANALYTICS_TRACKED: 'analytics:tracked'    // 분석 데이터 추적
};

export default eventBus;
