// 실시간 전문화 별 가이드 업데이트 서비스
import moduleEventBus from './ModuleEventBus';
import externalGuideCollector from './ExternalGuideCollector';

class RealtimeGuideUpdater {
  constructor() {
    this.updateQueue = [];
    this.isProcessing = false;
    this.updateInterval = null;
    this.subscribers = new Map();
    this.guideVersions = new Map();

    // 모듈 등록
    moduleEventBus.registerModule('realtimeGuideUpdater', {
      name: 'Realtime Guide Updater',
      version: '1.0.0'
    });

    this.setupEventListeners();
    this.initializeWebSocket();
  }

  setupEventListeners() {
    // 외부 가이드 업데이트 이벤트 리스닝
    moduleEventBus.on('external-guides-updated', (data) => {
      this.processGuideUpdate(data);
    });

    // 가이드 병합 완료 이벤트
    moduleEventBus.on('guide-data-merged', (data) => {
      this.distributeUpdate(data);
    });

    // 컴포넌트 구독 요청
    moduleEventBus.on('subscribe-guide-updates', ({ spec, callback }) => {
      this.subscribe(spec, callback);
    });

    // 컴포넌트 구독 해제
    moduleEventBus.on('unsubscribe-guide-updates', ({ spec, callback }) => {
      this.unsubscribe(spec, callback);
    });
  }

  // WebSocket 연결 초기화 (실시간 업데이트용)
  initializeWebSocket() {
    // 수동 업데이트만 사용 - 자동 체크 비활성화
    console.log('실시간 자동 업데이트 비활성화됨. 수동 업데이트만 사용합니다.');
  }

  // 실시간 업데이트 시뮬레이션 (비활성화)
  simulateRealtimeUpdates() {
    // 자동 업데이트 비활성화
    // 필요시 수동으로 processGuideUpdate() 호출
    return;
  }

  // 업데이트 체크
  async checkForUpdates() {
    const specs = this.getMonitoredSpecs();

    for (const spec of specs) {
      const hasUpdate = await this.checkSpecUpdate(spec);

      if (hasUpdate) {
        this.queueUpdate({
          spec,
          type: 'realtime-check',
          timestamp: new Date().toISOString()
        });
      }
    }

    this.processUpdateQueue();
  }

  // 특정 전문화 업데이트 체크
  async checkSpecUpdate(spec) {
    const currentVersion = this.guideVersions.get(spec);

    // API 호출 시뮬레이션 (실제로는 WarcraftLogs, Wowhead API 등 사용)
    const latestVersion = await this.fetchLatestVersion(spec);

    if (!currentVersion || currentVersion.version !== latestVersion.version) {
      this.guideVersions.set(spec, latestVersion);
      return true;
    }

    return false;
  }

  // 최신 버전 정보 가져오기
  async fetchLatestVersion(spec) {
    // 시뮬레이션 데이터
    return {
      version: `11.2.0.${Date.now()}`,
      patch: '11.2',
      changes: [
        'Updated talent builds based on latest raid data',
        'Adjusted stat priorities for new tier set',
        'Modified rotation for optimal DPS'
      ],
      timestamp: new Date().toISOString()
    };
  }

  // 가이드 업데이트 처리
  async processGuideUpdate(data) {
    const { spec, data: guideData, timestamp } = data;

    // 버전 비교
    const currentData = this.getCurrentGuideData(spec);
    const differences = this.compareGuideData(currentData, guideData);

    if (differences.length > 0) {
      const update = {
        spec,
        differences,
        newData: guideData,
        timestamp,
        version: this.generateVersion()
      };

      // 업데이트 큐에 추가
      this.queueUpdate(update);

      // 중요 변경사항이면 즉시 처리
      if (this.isCriticalUpdate(differences)) {
        await this.processUpdateQueue();
      }
    }
  }

  // 가이드 데이터 비교
  compareGuideData(current, updated) {
    const differences = [];

    if (!current) {
      differences.push({
        type: 'new',
        description: 'New guide data available'
      });
      return differences;
    }

    // 탤런트 변경 체크
    if (JSON.stringify(current.talents) !== JSON.stringify(updated.talents)) {
      differences.push({
        type: 'talents',
        description: 'Talent build changes detected',
        priority: 'high'
      });
    }

    // 로테이션 변경 체크
    if (JSON.stringify(current.rotation) !== JSON.stringify(updated.rotation)) {
      differences.push({
        type: 'rotation',
        description: 'Rotation priority changes detected',
        priority: 'high'
      });
    }

    // 스탯 우선순위 변경 체크
    if (JSON.stringify(current.stats) !== JSON.stringify(updated.stats)) {
      differences.push({
        type: 'stats',
        description: 'Stat priority changes detected',
        priority: 'medium'
      });
    }

    return differences;
  }

  // 중요 업데이트 판단
  isCriticalUpdate(differences) {
    return differences.some(diff => diff.priority === 'high');
  }

  // 업데이트 큐에 추가
  queueUpdate(update) {
    this.updateQueue.push(update);

    // 이벤트 발행
    moduleEventBus.emit('guide-update-queued', {
      spec: update.spec,
      queueLength: this.updateQueue.length
    });
  }

  // 업데이트 큐 처리
  async processUpdateQueue() {
    if (this.isProcessing || this.updateQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.updateQueue.length > 0) {
      const update = this.updateQueue.shift();

      try {
        await this.applyUpdate(update);
      } catch (error) {
        console.error('Failed to apply update:', error);
        // 실패한 업데이트 재시도 로직
        this.handleUpdateFailure(update);
      }
    }

    this.isProcessing = false;
  }

  // 업데이트 적용
  async applyUpdate(update) {
    const { spec, differences, newData, version } = update;

    // 데이터 저장
    this.saveGuideData(spec, newData, version);

    // 구독자들에게 알림
    this.notifySubscribers(spec, {
      type: 'update',
      differences,
      newData,
      version,
      timestamp: new Date().toISOString()
    });

    // 이벤트 발행
    moduleEventBus.emit('guide-updated', {
      spec,
      version,
      differences
    });

    // UI 업데이트 트리거
    this.triggerUIUpdate(spec, newData);
  }

  // UI 업데이트 트리거
  triggerUIUpdate(spec, data) {
    // React 컴포넌트에 업데이트 알림
    moduleEventBus.emit('ui-update-required', {
      spec,
      data,
      updateType: 'guide-content'
    });
  }

  // 업데이트 배포
  distributeUpdate(data) {
    const { spec, data: mergedData } = data;

    // 실시간으로 연결된 클라이언트들에게 배포
    this.notifySubscribers(spec, {
      type: 'merged-update',
      data: mergedData,
      timestamp: new Date().toISOString()
    });
  }

  // 구독 관리
  subscribe(spec, callback) {
    if (!this.subscribers.has(spec)) {
      this.subscribers.set(spec, new Set());
    }
    this.subscribers.get(spec).add(callback);

    // 현재 데이터 즉시 전송
    const currentData = this.getCurrentGuideData(spec);
    if (currentData) {
      callback({
        type: 'initial',
        data: currentData,
        timestamp: new Date().toISOString()
      });
    }
  }

  unsubscribe(spec, callback) {
    const specSubscribers = this.subscribers.get(spec);
    if (specSubscribers) {
      specSubscribers.delete(callback);
      if (specSubscribers.size === 0) {
        this.subscribers.delete(spec);
      }
    }
  }

  // 구독자들에게 알림
  notifySubscribers(spec, update) {
    const specSubscribers = this.subscribers.get(spec);
    if (specSubscribers) {
      specSubscribers.forEach(callback => {
        try {
          callback(update);
        } catch (error) {
          console.error('Subscriber notification failed:', error);
        }
      });
    }
  }

  // 모니터링 중인 전문화 목록
  getMonitoredSpecs() {
    return Array.from(this.subscribers.keys());
  }

  // 현재 가이드 데이터 가져오기
  getCurrentGuideData(spec) {
    // localStorage 또는 메모리 캐시에서 가져오기
    const cached = localStorage.getItem(`guide-data-${spec}`);
    return cached ? JSON.parse(cached) : null;
  }

  // 가이드 데이터 저장
  saveGuideData(spec, data, version) {
    const dataToSave = {
      ...data,
      version,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(`guide-data-${spec}`, JSON.stringify(dataToSave));
  }

  // 버전 생성
  generateVersion() {
    return `${new Date().getFullYear()}.${new Date().getMonth() + 1}.${Date.now()}`;
  }

  // 업데이트 실패 처리
  handleUpdateFailure(update) {
    // 재시도 로직
    setTimeout(() => {
      this.queueUpdate({
        ...update,
        retryCount: (update.retryCount || 0) + 1
      });
    }, 5000 * (update.retryCount || 1)); // 지수 백오프
  }

  // 수동 업데이트 트리거
  async forceUpdate(spec) {
    // 외부 소스에서 강제로 데이터 수집
    await externalGuideCollector.collectAllGuides(spec);

    // 업데이트 체크
    await this.checkSpecUpdate(spec);

    // 큐 처리
    await this.processUpdateQueue();
  }

  // 정리
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateQueue = [];
    this.subscribers.clear();
    this.guideVersions.clear();
  }
}

export default new RealtimeGuideUpdater();