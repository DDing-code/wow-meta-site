/**
 * 모듈 간 양방향 통신을 위한 중앙 이벤트 버스
 * 모든 컴포넌트가 유기적으로 연결되도록 지원
 */

import { EventEmitter } from 'events';

class ModuleEventBus extends EventEmitter {
  constructor() {
    super();
    this.modules = new Map();
    this.messageHistory = [];
    this.maxHistorySize = 100;
    this.setupCoreEvents();
  }

  /**
   * 모듈 등록
   */
  registerModule(moduleName, moduleInstance) {
    if (this.modules.has(moduleName)) {
      console.warn(`Module ${moduleName} is already registered`);
      return false;
    }

    this.modules.set(moduleName, {
      instance: moduleInstance,
      registeredAt: new Date().toISOString(),
      messageCount: 0
    });

    // 등록 이벤트 발생
    this.emit('moduleRegistered', { moduleName, timestamp: new Date().toISOString() });

    console.log(`✅ Module registered: ${moduleName}`);
    return true;
  }

  /**
   * 모듈 등록 해제
   */
  unregisterModule(moduleName) {
    if (!this.modules.has(moduleName)) {
      console.warn(`Module ${moduleName} is not registered`);
      return false;
    }

    this.modules.delete(moduleName);
    this.emit('moduleUnregistered', { moduleName, timestamp: new Date().toISOString() });

    console.log(`❌ Module unregistered: ${moduleName}`);
    return true;
  }

  /**
   * 모듈 간 메시지 전송
   */
  sendMessage(from, to, messageType, payload) {
    const message = {
      id: this.generateMessageId(),
      from,
      to,
      type: messageType,
      payload,
      timestamp: new Date().toISOString()
    };

    // 메시지 히스토리 저장
    this.addToHistory(message);

    // 대상이 'all'이면 브로드캐스트
    if (to === 'all') {
      this.broadcast(message);
    } else {
      // 특정 모듈에게 전송
      if (!this.modules.has(to)) {
        console.error(`Target module ${to} not found`);
        return false;
      }

      this.emit(`message:${to}`, message);
    }

    // 발신 모듈 카운트 증가
    if (this.modules.has(from)) {
      this.modules.get(from).messageCount++;
    }

    return true;
  }

  /**
   * 모든 모듈에 브로드캐스트
   */
  broadcast(message) {
    this.modules.forEach((moduleInfo, moduleName) => {
      if (moduleName !== message.from) {
        this.emit(`message:${moduleName}`, message);
      }
    });
  }

  /**
   * 요청-응답 패턴 구현
   */
  async request(from, to, requestType, payload, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const requestId = this.generateMessageId();
      const timeoutId = setTimeout(() => {
        this.off(`response:${requestId}`);
        reject(new Error(`Request timeout: ${requestType} to ${to}`));
      }, timeout);

      // 응답 리스너 설정
      this.once(`response:${requestId}`, (response) => {
        clearTimeout(timeoutId);
        resolve(response);
      });

      // 요청 전송
      this.sendMessage(from, to, `request:${requestType}`, {
        requestId,
        ...payload
      });
    });
  }

  /**
   * 요청에 응답
   */
  respond(from, originalMessage, responsePayload) {
    const requestId = originalMessage.payload.requestId;
    if (!requestId) {
      console.error('No requestId found in original message');
      return false;
    }

    this.emit(`response:${requestId}`, {
      from,
      originalRequest: originalMessage,
      response: responsePayload,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  /**
   * 핵심 이벤트 설정
   */
  setupCoreEvents() {
    // 스킬 DB 업데이트 이벤트
    this.on('skillDatabase:updated', (data) => {
      console.log('📚 Skill database updated:', data);
      this.sendMessage('skillDB', 'all', 'dataUpdate', data);
    });

    // AI 학습 완료 이벤트
    this.on('ai:learningComplete', (data) => {
      console.log('🤖 AI learning completed:', data);
      this.sendMessage('aiService', 'all', 'learningResults', data);
    });

    // 가이드 업데이트 요청
    this.on('guide:updateRequest', (data) => {
      console.log('📝 Guide update requested:', data);
      this.sendMessage('guide', 'aiService', 'analyzeAndUpdate', data);
    });

    // 실시간 데이터 수집
    this.on('realtime:dataReceived', (data) => {
      console.log('📊 Realtime data received:', data);
      this.sendMessage('realtimeService', 'all', 'newData', data);
    });

    // SimC 시뮬레이션 완료
    this.on('simc:simulationComplete', (data) => {
      console.log('⚔️ SimC simulation completed:', data);
      this.sendMessage('simcEngine', 'all', 'simulationResults', data);
    });

    // 특성 빌드 변경
    this.on('talent:buildChanged', (data) => {
      console.log('🌟 Talent build changed:', data);
      this.sendMessage('talentTree', 'all', 'buildUpdate', data);
    });

    // 모크 분석 완료
    this.on('mock:analysisComplete', (data) => {
      console.log('📈 Mock analysis completed:', data);
      this.sendMessage('mockAnalysis', 'all', 'analysisResults', data);
    });
  }

  /**
   * 모듈 간 데이터 동기화
   */
  async syncModules(modules) {
    const syncPromises = [];

    for (const moduleName of modules) {
      if (!this.modules.has(moduleName)) {
        console.warn(`Module ${moduleName} not found for sync`);
        continue;
      }

      // 각 모듈에 동기화 요청
      const syncPromise = this.request('system', moduleName, 'sync', {
        timestamp: new Date().toISOString()
      });

      syncPromises.push(syncPromise);
    }

    const results = await Promise.allSettled(syncPromises);

    const syncReport = {
      timestamp: new Date().toISOString(),
      total: modules.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      details: results
    };

    this.emit('sync:complete', syncReport);
    return syncReport;
  }

  /**
   * 메시지 ID 생성
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 메시지 히스토리 추가
   */
  addToHistory(message) {
    this.messageHistory.push(message);

    // 최대 크기 초과 시 오래된 메시지 제거
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory.shift();
    }
  }

  /**
   * 모듈 상태 보고서
   */
  getModuleStatus() {
    const status = {
      timestamp: new Date().toISOString(),
      totalModules: this.modules.size,
      modules: []
    };

    this.modules.forEach((info, name) => {
      status.modules.push({
        name,
        registeredAt: info.registeredAt,
        messageCount: info.messageCount
      });
    });

    return status;
  }

  /**
   * 메시지 히스토리 조회
   */
  getMessageHistory(filter = {}) {
    let history = [...this.messageHistory];

    if (filter.from) {
      history = history.filter(msg => msg.from === filter.from);
    }

    if (filter.to) {
      history = history.filter(msg => msg.to === filter.to);
    }

    if (filter.type) {
      history = history.filter(msg => msg.type === filter.type);
    }

    if (filter.limit) {
      history = history.slice(-filter.limit);
    }

    return history;
  }

  /**
   * 헬스체크
   */
  healthCheck() {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      modules: this.modules.size,
      messageHistorySize: this.messageHistory.length,
      issues: []
    };

    // 모듈 체크
    if (this.modules.size === 0) {
      health.issues.push('No modules registered');
      health.status = 'warning';
    }

    // 메시지 히스토리 체크
    if (this.messageHistory.length >= this.maxHistorySize * 0.9) {
      health.issues.push('Message history near capacity');
      health.status = 'warning';
    }

    return health;
  }
}

// 싱글톤 인스턴스 생성
const moduleEventBus = new ModuleEventBus();

// 자동 모듈 등록
if (typeof window !== 'undefined') {
  window.moduleEventBus = moduleEventBus;
}

export default moduleEventBus;