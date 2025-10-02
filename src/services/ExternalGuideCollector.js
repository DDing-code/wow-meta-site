// 외부 가이드 수집 및 통합 서비스
import moduleEventBus from './ModuleEventBus';

class ExternalGuideCollector {
  constructor() {
    this.guideSources = {
      wowhead: {
        name: 'Wowhead',
        url: 'https://www.wowhead.com',
        priority: 1,
        lastSync: null
      },
      icyveins: {
        name: 'Icy Veins',
        url: 'https://www.icy-veins.com',
        priority: 2,
        lastSync: null
      },
      maxroll: {
        name: 'Maxroll',
        url: 'https://maxroll.gg',
        priority: 3,
        lastSync: null
      },
      archon: {
        name: 'Archon',
        url: 'https://www.archon.gg',
        priority: 4,
        lastSync: null
      }
    };

    this.collectedData = new Map();
    this.syncInterval = null;

    // 모듈 등록
    moduleEventBus.registerModule('externalGuideCollector', {
      name: 'External Guide Collector',
      version: '1.0.0'
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    // 스킬 업데이트 요청 이벤트 리스닝
    moduleEventBus.on('request-guide-update', (data) => {
      this.collectGuideData(data.spec, data.source);
    });

    // 데이터 요청 이벤트
    moduleEventBus.on('get-external-guides', (callback) => {
      callback(this.getCollectedData());
    });
  }

  // 모든 소스에서 가이드 데이터 수집
  async collectAllGuides(spec) {
    const results = {};

    for (const [sourceKey, sourceInfo] of Object.entries(this.guideSources)) {
      try {
        const data = await this.collectGuideData(spec, sourceKey);
        if (data) {
          results[sourceKey] = {
            ...data,
            source: sourceInfo.name,
            priority: sourceInfo.priority,
            timestamp: new Date().toISOString()
          };
        }
      } catch (error) {
        console.error(`Failed to collect from ${sourceInfo.name}:`, error);
      }
    }

    // 수집된 데이터 저장
    this.collectedData.set(spec, results);

    // 이벤트 발행
    moduleEventBus.emit('external-guides-updated', {
      spec,
      data: results,
      timestamp: new Date().toISOString()
    });

    return results;
  }

  // 특정 소스에서 가이드 데이터 수집
  async collectGuideData(spec, source) {
    const cacheKey = `${spec}-${source}`;
    const cached = this.getCachedData(cacheKey);

    // 5분 이내 캐시가 있으면 사용
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    // 실제 데이터 수집 (시뮬레이션)
    const data = await this.fetchGuideData(spec, source);

    // 캐시 저장
    this.saveCacheData(cacheKey, data);

    return data;
  }

  // 가이드 데이터 가져오기 (실제 구현 시 웹 스크래핑 또는 API 사용)
  async fetchGuideData(spec, source) {
    // 여기서는 시뮬레이션 데이터 반환
    const mockData = {
      wowhead: {
        talents: {
          raid: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSkIRSJkkkkkkkkkikIkIpFJJRSSSJA',
          mythicPlus: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSkIRShkkkkkkkkkikIkIpFJJRSSIJA'
        },
        rotation: [
          'Barbed Shot on cooldown',
          'Kill Command on cooldown',
          'Cobra Shot as filler'
        ],
        stats: {
          priority: ['Haste', 'Critical Strike', 'Mastery', 'Versatility'],
          weights: { haste: 1.0, crit: 0.85, mastery: 0.7, versatility: 0.6 }
        },
        lastUpdate: '2025-09-25'
      },
      icyveins: {
        talents: {
          raid: 'Different build code from Icy Veins',
          mythicPlus: 'Another build code'
        },
        rotation: [
          'Maintain Frenzy stacks',
          'Use Bestial Wrath on cooldown',
          'Barbed Shot to maintain Frenzy'
        ],
        stats: {
          priority: ['Haste to 20%', 'Critical Strike', 'Mastery', 'Versatility'],
          breakpoints: { haste: 20 }
        },
        lastUpdate: '2025-09-24'
      },
      maxroll: {
        talents: {
          raid: 'Maxroll specific build',
          mythicPlus: 'Maxroll M+ build'
        },
        rotation: {
          opener: ['Bestial Wrath', 'Barbed Shot', 'Kill Command'],
          priority: ['Barbed Shot', 'Kill Command', 'Cobra Shot']
        },
        gear: {
          bis: ['Item 1', 'Item 2'],
          alternatives: ['Alt Item 1']
        },
        lastUpdate: '2025-09-23'
      }
    };

    return mockData[source] || null;
  }

  // 데이터 통합 및 우선순위 결정
  mergeGuideData(spec) {
    const allData = this.collectedData.get(spec);
    if (!allData) return null;

    const merged = {
      spec,
      timestamp: new Date().toISOString(),
      sources: [],
      consensus: {},
      conflicts: []
    };

    // 우선순위 순으로 정렬
    const sortedSources = Object.entries(allData)
      .sort((a, b) => a[1].priority - b[1].priority);

    // 데이터 병합 로직
    for (const [sourceKey, sourceData] of sortedSources) {
      merged.sources.push({
        name: sourceData.source,
        lastUpdate: sourceData.lastUpdate || sourceData.timestamp
      });

      // 첫 번째 소스를 기준으로 설정
      if (merged.sources.length === 1) {
        merged.consensus = {
          talents: sourceData.talents,
          rotation: sourceData.rotation,
          stats: sourceData.stats
        };
      } else {
        // 충돌 감지 및 기록
        this.detectConflicts(merged, sourceKey, sourceData);
      }
    }

    return merged;
  }

  // 데이터 충돌 감지
  detectConflicts(merged, sourceKey, sourceData) {
    // 탤런트 빌드 충돌 체크
    if (sourceData.talents) {
      const consensusTalents = JSON.stringify(merged.consensus.talents);
      const sourceTalents = JSON.stringify(sourceData.talents);

      if (consensusTalents !== sourceTalents) {
        merged.conflicts.push({
          type: 'talents',
          source: sourceKey,
          difference: 'Different talent builds recommended'
        });
      }
    }

    // 스탯 우선순위 충돌 체크
    if (sourceData.stats?.priority) {
      const consensusPriority = merged.consensus.stats?.priority?.[0];
      const sourcePriority = sourceData.stats.priority[0];

      if (consensusPriority !== sourcePriority) {
        merged.conflicts.push({
          type: 'stats',
          source: sourceKey,
          difference: `Different stat priority: ${sourcePriority} vs ${consensusPriority}`
        });
      }
    }
  }

  // 캐시 관리
  getCachedData(key) {
    const cached = localStorage.getItem(`guide-cache-${key}`);
    return cached ? JSON.parse(cached) : null;
  }

  saveCacheData(key, data) {
    localStorage.setItem(`guide-cache-${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }

  isCacheValid(timestamp, maxAge = 5 * 60 * 1000) { // 5분
    return Date.now() - timestamp < maxAge;
  }

  getCollectedData() {
    return Array.from(this.collectedData.entries()).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  // 자동 동기화 시작 (비활성화 - 수동 업데이트만 사용)
  startAutoSync(interval = 30 * 60 * 1000) { // 기본값 30분 (사용 안 함)
    // 자동 동기화 비활성화
    // 필요시 수동으로 collectAllGuides() 호출
    console.log('자동 동기화 비활성화됨. 수동 업데이트만 사용합니다.');
    return;
  }

  // 모든 전문화 동기화
  async syncAllSpecs() {
    const specs = [
      'hunter-beast-mastery',
      'hunter-marksmanship',
      'hunter-survival',
      // 다른 직업/전문화 추가...
    ];

    for (const spec of specs) {
      await this.collectAllGuides(spec);
      // 병합된 데이터 생성
      const merged = this.mergeGuideData(spec);

      // 이벤트 발행
      moduleEventBus.emit('guide-data-merged', {
        spec,
        data: merged
      });
    }
  }

  // 정리
  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    this.collectedData.clear();
  }
}

export default new ExternalGuideCollector();