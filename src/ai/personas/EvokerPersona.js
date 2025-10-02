// 기원사 AI 페르소나 - 11.2 TWW S3 실제 가이드 데이터 기반
import BaseClassPersona from './BaseClassPersona.js';
import moduleEventBus from '../../services/ModuleEventBus.js';
// import APLData from '../apl/APLData.js';  // TODO: APLData 모듈 생성 필요

class EvokerPersona extends BaseClassPersona {
  constructor() {
    super('evoker', '기원사', ['devastation', 'preservation', 'augmentation']);

    // 기원사 특성
    this.characteristics = {
      role: ['dps', 'healer', 'support'],
      specializations: ['devastation', 'preservation', 'augmentation'],
      resourceType: 'essence',
      armorType: 'mail',
      mainStat: 'intellect',
      weaponType: ['staff', 'dagger', 'off-hand'],
      rangeLimit: 25, // 25야드 제한
      uniqueMechanics: ['empower', 'essence', 'dragonrage']
    };

    // 전문화별 지식 베이스 초기화
    this.initializeKnowledge();

    // SimC APL 데이터 로드 (APLData 모듈이 준비되면 활성화)
    // this.loadSimCAPLData();

    // 모듈 등록
    this.registerModule();
  }

  initializeKnowledge() {
    // 황폐 - 불꽃형성자 (Flameshaper)
    this.knowledge.set('devastation-flameshaper', {
      patch: '11.2 TWW Season 3',
      heroTalent: '불꽃형성자 (Flameshaper)',
      role: 'ranged DPS',

      // 오프닝 시퀀스 (Wowhead + Maxroll 기준)
      opener: [
        '살아있는 불꽃 시전',
        '하늘빛 일격 4-5개 확보',
        '영원의 쇄도',
        '불의 숨결 (최대 강화)',
        '파열',
        '업화 (체력 낮을 때)',
        '기염 (심판의 날 스택 활용)'
      ],

      // 단일 대상 우선순위
      rotation: [
        '용의 분노 - 폭발 동기화',
        '불꽃 놓아주기 - 쿨마다 사용',
        '업화 - 가속/치명타 버프 유지',
        '영원의 쇄도 - 강화 4단계',
        '깊은 숨결 - 폭발 창 내에서',
        '불의 숨결 - 최대 강화 (심판의 날 스택)',
        '파열 - 정수 3개 소비',
        '살아있는 불꽃 - 정수 생성',
        '기염 - 정수 5 이하일 때',
        '하늘빛 일격 - 이동 중 사용'
      ],

      // 광역 우선순위
      aoeRotation: [
        '용의 분노 - 폭발 준비',
        '불꽃 놓아주기 - 광역 점사',
        '영원의 쇄도 - 다중 타겟 강화',
        '기염 - 광역 정수 생성 및 피해',
        '불의 숨결 - 최대 강화 (광역)',
        '파열 - 메인 타겟',
        '살아있는 불꽃 - DoT 유지',
        '하늘빛 일격 - 이동 중 사용'
      ],

      // 스탯 우선순위
      stats: {
        singleTarget: ['지능', '가속 (30% 목표)', '치명타', '특화', '유연성'],
        aoe: ['지능', '가속 (30% 목표)', '치명타 = 특화', '유연성']
      },

      // 특성 빌드 (Wowhead 11.2)
      builds: {
        raid: 'CIbBAAAAAAAAAAAAAAAAAAAAAAAAAIJSSSSCJlEBRSaJJJRUSSSEJCRSAAAAAAAAAgSLJpEA',
        mythicPlus: 'CIbBAAAAAAAAAAAAAAAAAAAAAAAAAAJSSSSCJlEBRSaJJJRUSSSEJCRSSAAAAAAAgRLJpEA'
      },

      // 티어세트 효과
      tierSet: {
        '2set': '정수 폭발이 파열을 2초간 부여합니다.',
        '4set': '파열의 지속시간이 2초 증가하고, 파열이 활성화된 대상에게 사술 주문 공격 시 10%의 추가 피해를 입힙니다.'
      }
    });

    // 황폐 - 비늘사령관 (Scalecommander)
    this.knowledge.set('devastation-scalecommander', {
      patch: '11.2 TWW Season 3',
      heroTalent: '비늘사령관 (Scalecommander)',
      role: 'ranged DPS',

      opener: [
        '살아있는 불꽃 시전',
        '기염 (정수 생성)',
        '용의 분노',
        '불꽃 놓아주기',
        '불의 숨결 (최대 강화)',
        '파열 (정수 3개 소비)',
        '영원의 쇄도 (강화)'
      ],

      rotation: [
        '용의 분노 - 폭발 창 생성',
        '불꽃 놓아주기 - 쿨마다',
        '깊은 숨결 - 폭발 창 내',
        '영원의 쇄도 - 강화 4단계',
        '불의 숨결 - 최대 강화',
        '파열 - 정수 소비',
        '기염 - 정수 관리',
        '살아있는 불꽃 - 정수 생성',
        '하늘빛 일격 - 이동 시'
      ],

      aoeRotation: [
        '용의 분노 - 폭발 준비',
        '깊은 숨결 - 광역 시작',
        '기염 - 광역 피해',
        '불의 숨결 - 최대 강화',
        '영원의 쇄도 - 다중 타겟',
        '살아있는 불꽃 - DoT 분산'
      ],

      stats: {
        singleTarget: ['지능', '가속 (28-30%)', '치명타', '특화', '유연성'],
        aoe: ['지능', '가속', '치명타', '특화', '유연성']
      },

      builds: {
        raid: 'CIbBAAAAAAAAAAAAAAAAAAAAAAAAAAJSSSSCJlEBRSaJJJRUSSISSJCRSAAAAAAAAAgSLJpEA',
        mythicPlus: 'CIbBAAAAAAAAAAAAAAAAAAAAAAAAAAJSSSSCJlEBRSaJJJRUSSISSJCRSSAAAAAAAgRLJpEA'
      }
    });

    // 보존 - 불꽃형성자 (Flameshaper)
    this.knowledge.set('preservation-flameshaper', {
      patch: '11.2 TWW Season 3',
      heroTalent: '불꽃형성자 (Flameshaper)',
      role: 'healer',

      rotation: [
        '메아리 - 치유 증폭 유지',
        '꿈의 비행 - 광역 치유 필요 시',
        '되돌리기 - 탱커 또는 위급 대상',
        '영혼 만개 - HoT 유지 (탱커/디버프 대상)',
        '생기 폭발 - 순간 광역 치유',
        '시간 팽창 - 쿨기 단축',
        '꿈의 숨결 - 광역 HoT',
        '살아있는 불꽃 - 대미지/치유 병행',
        '에메렔드 꽃 - 정수 소비'
      ],

      stats: {
        healing: ['지능', '치명타 (30% 목표)', '가속', '유연성', '특화'],
        damage: ['지능', '가속', '치명타', '특화', '유연성']
      },

      builds: {
        raid: 'CobBAAAAAAAAAAAAAAAAAAAAAAAAAAkEJSSSLJSSSkQSiEJlkgkkkEJJJBAAAAAAQSSCikA',
        mythicPlus: 'CobBAAAAAAAAAAAAAAAAAAAAAAAAAAkEJSSSLJSSSkQSiEJlkgkkkEJJJBAAAAAARSSCikA'
      },

      tierSet: {
        '2set': '영혼 만개이 추가로 정수의 폭발 효과를 적용합니다.',
        '4set': '정수의 폭발이 소모한 메아리 중첩당 다음 영혼 만개 또는 되돌리기의 치유량이 15% 증가합니다.'
      }
    });

    // 보존 - 시간 감시자 (Chronowarden)
    this.knowledge.set('preservation-chronowarden', {
      patch: '11.2 TWW Season 3',
      heroTalent: '시간 감시자 (Chronowarden)',
      role: 'healer',

      rotation: [
        '메아리 - 치유 증폭 기본',
        '정지장 - 위급 상황 대응',
        '시간 나선 - 강력한 순간 치유',
        '되돌리기 - 탱커 집중 치유',
        '영혼 만개 - HoT 유지',
        '꿈의 비행 - 광역 치유',
        '시간 팽창 - 쿨기 단축',
        '생기 폭발 - 광역 순간 치유',
        '꿈의 숨결 - 광역 HoT'
      ],

      stats: {
        healing: ['지능', '치명타 (33% 목표)', '가속', '유연성', '특화'],
        damage: ['지능', '가속', '치명타', '특화', '유연성']
      },

      builds: {
        raid: 'CobBAAAAAAAAAAAAAAAAAAAAAAAAAAkEJSSSLJSSSkQSiEJlkkkkkEJJJBAAAAAAQSSCikA',
        mythicPlus: 'CobBAAAAAAAAAAAAAAAAAAAAAAAAAAkEJSSSLJSSSkQSiEJlkkkkkEJJJBAAAAAARSSCikA'
      }
    });

    // 증강 - 시간 감시자 (Chronowarden)
    this.knowledge.set('augmentation-chronowarden', {
      patch: '11.2 TWW Season 3',
      heroTalent: '시간 감시자 (Chronowarden)',
      role: 'support DPS',

      rotation: [
        '칠흑의 힘 - 아군 버프 유지',
        '영겁의 숨결 - 쿨마다 사용',
        '예지 - 폭발 준비',
        '불의 숨결 - 강화 사용',
        '대격변 - 주요 폭발',
        '살아있는 불꽃 - 정수 생성',
        '비상 - 위치 조정',
        '하늘빛 일격 - 이동 중',
        '에메렔드 꽃 - 정수 소비'
      ],

      stats: {
        singleTarget: ['지능', '가속 (25% 목표)', '치명타', '특화', '유연성'],
        aoe: ['지능', '가속', '치명타 = 특화', '유연성']
      },

      builds: {
        raid: 'CwbBAAAAAAAAAAAAAAAAAAAAAAAAAAJlkkkkkQSokEJJpEJJJJRkEBAAAAAAAApEikA',
        mythicPlus: 'CwbBAAAAAAAAAAAAAAAAAAAAAAAAAAJlkkkkkQSokEJJpEJJJJRkEBAAAAAAAApEikRA'
      },

      tierSet: {
        '2set': '예지이 다음 대변동과 운명의 숨결의 공격력을 25% 증가시킵니다.',
        '4set': '대격변과 운명의 숨결이 선제의 일격의 재사용 대기시간을 1초 감소시킵니다.'
      }
    });

    // 증강 - 비늘사령관 (Scalecommander)
    this.knowledge.set('augmentation-scalecommander', {
      patch: '11.2 TWW Season 3',
      heroTalent: '비늘사령관 (Scalecommander)',
      role: 'support DPS',

      rotation: [
        '폭격 - 비늘사령관 핵심',
        '칠흑의 힘 - 아군 버프',
        '영겁의 숨결 - 쿨마다',
        '예지 - 폭발 준비',
        '대격변 - 주요 버스트',
        '불의 숨결 - 강화',
        '살아있는 불꽃 - 정수',
        '비상 - 위치 최적화'
      ],

      stats: {
        singleTarget: ['지능', '가속 (23-25%)', '치명타', '특화', '유연성'],
        aoe: ['지능', '가속', '치명타', '특화', '유연성']
      },

      builds: {
        raid: 'CwbBAAAAAAAAAAAAAAAAAAAAAAAAAAJlkkkkkQSokEJJpEJJJJhIJBAAAAAAAApEikA',
        mythicPlus: 'CwbBAAAAAAAAAAAAAAAAAAAAAAAAAAJlkkkkkQSokEJJpEJJJJhIJBAAAAAAAApEikRA'
      }
    });

    // 공통 지식
    this.knowledge.set('common', {
      positioning: '25야드 거리 제한으로 중거리 위치 선정 중요',
      empowerMechanics: '불의 숨결/영원의 쇄도는 최대 강화 사용이 기본',
      essenceManagement: '정수 5개 초과 방지, 효율적 소비 중요',
      dragonrage: '용의 분노는 주요 폭발 창, 모든 쿨기 집중',
      mobility: '비상, 호버로 기동성 확보, 캐스팅 중에도 이동 가능',
      defensives: '흑요석 비늘, 쇄신, 시간 팽창으로 생존력 확보',

      consumables: {
        phial: 'Flask of Alchemical Chaos',
        food: 'Feast of the Divine Day',
        potion: 'Tempered Potion',
        augmentRune: 'Crystallized Augment Rune',
        weapon: 'Howling Rune'
      }
    });
  }

  // 가이드 생성
  async generateGuide(spec, heroTalent) {
    const key = `${spec}-${heroTalent.toLowerCase().replace(/\s+/g, '')}`;
    const knowledge = this.knowledge.get(key);

    if (!knowledge) {
      throw new Error(`기원사 ${spec} ${heroTalent} 지식이 없습니다.`);
    }

    // PersonaGuideGeneratorV2 활용
    const guideGenerator = await import('../personas/PersonaGuideGeneratorV2.js');
    const generator = guideGenerator.default;

    const guideData = {
      className: 'evoker',
      spec: spec,
      heroTalent: heroTalent,
      context: {
        patch: knowledge.patch,
        role: knowledge.role,
        ...knowledge
      }
    };

    return await generator.generateGuide(guideData);
  }

  // 전문화별 조언
  getSpecializationAdvice(spec) {
    const advice = {
      devastation: {
        positioning: '25야드 거리 유지하면서 최대한 많은 타겟 타격 위치 선정',
        empowerUsage: '심판의 날 중첩 최대치에서 불의 숨결 사용',
        essenceTips: '정수 5개 초과 방지, 장염룡포로 효율적 소비',
        burstWindow: '용의 분노 + 불꽃 놓아주기 + 분해의 불길 조합',
        aoe: '기염를 광역 상황에서 우선 사용'
      },
      preservation: {
        positioning: '아군 밀집 지역에서 25야드 내 모든 대상 커버',
        echoUsage: '메아리 중첩 유지로 치유량 증폭 극대화',
        emergencyHealing: '되돌리기 + 시간 나선 조합으로 위급 상황 대응',
        raidHealing: '꿈의 비행 + 생기 폭발로 광역 피해 대응',
        manaManagement: '에메렔드 꽃 효율적 사용으로 마나 관리'
      },
      augmentation: {
        positioning: '아군 DPS 25야드 내 위치, 버프 범위 최적화',
        buffPriority: '칠흑의 힘 100% 유지가 최우선',
        burstAlignment: '아군 쿨기와 대변동/운명의 숨결 동기화',
        targetSelection: '최고 DPS 아군에게 버프 집중',
        mobility: '비상으로 빠른 위치 재조정, 버프 유지'
      }
    };

    return advice[spec] || '기본 전략을 따르세요.';
  }

  // 모듈 등록
  registerModule() {
    moduleEventBus.registerModule('evoker-persona', {
      name: '기원사 AI 페르소나',
      version: '1.1.0',
      status: 'active',
      capabilities: ['guide-generation', 'rotation-optimization', 'stat-priority', 'build-recommendation'],
      specializations: ['devastation', 'preservation', 'augmentation'],
      heroTalents: ['flameshaper', 'chronowarden', 'scalecommander']
    });

    // 이벤트 구독
    moduleEventBus.on('request-evoker-guide', async (data) => {
      const guide = await this.generateGuide(data.spec, data.heroTalent);
      moduleEventBus.emit('evoker-guide-generated', guide);
    });

    moduleEventBus.on('request-evoker-advice', (spec) => {
      const advice = this.getSpecializationAdvice(spec);
      moduleEventBus.emit('evoker-advice-ready', advice);
    });
  }

  // 시뮬레이션 결과 학습 (실제 데이터 기반)
  learnFromRealData(logData) {
    // WarcraftLogs 실제 데이터 분석
    const { spec, heroTalent, performance } = logData;
    const key = `${spec}-${heroTalent.toLowerCase().replace(/\s+/g, '')}`;

    if (this.knowledge.has(key)) {
      const current = this.knowledge.get(key);

      // 실제 플레이어 데이터로 업데이트
      if (performance.ranking > 95) {
        // 상위 5% 플레이어 데이터 학습
        current.rotation = performance.rotation || current.rotation;
        current.stats = performance.statWeights || current.stats;

        console.log(`🎓 기원사 ${spec} ${heroTalent} 고성능 데이터 학습 완료`);
      }
    }
  }

  // 메타 변화 대응
  adaptToMeta(metaData) {
    // 11.2 메타 데이터 반영
    const { topBuilds, statPriorities, heroTalentUsage } = metaData;

    // 각 전문화별 메타 반영
    for (const [key, knowledge] of this.knowledge.entries()) {
      if (key !== 'common') {
        const [spec, heroTalent] = key.split('-');

        // 빌드 업데이트
        if (topBuilds[spec]) {
          knowledge.builds = topBuilds[spec];
        }

        // 스탯 우선순위 업데이트
        if (statPriorities[spec]) {
          knowledge.stats = statPriorities[spec];
        }

        console.log(`📊 기원사 ${spec} 메타 업데이트 완료`);
      }
    }
  }

  // SimC APL 데이터 로드
  async loadSimCAPLData() {
    console.log('📜 기원사 SimC APL 데이터 로드 중...');

    // const aplDataManager = new APLData();  // TODO: APLData 모듈 필요

    // TODO: APLData 모듈이 준비되면 구현
    console.log('📦 APL 데이터 로드 기능은 현재 비활성화 상태입니다.');
    return;
  }

  // 기원사 APL 파싱
  parseEvokerAPL(aplString, spec) {
    const parsed = {
      precombat: [],
      default: [],
      aoe: [],
      cooldowns: [],
      empowerSection: [],
      essenceManagement: []
    };

    if (!aplString) return parsed;

    const lines = aplString.split('\n');
    let currentSection = 'default';

    for (const line of lines) {
      // 섹션 감지
      if (line.includes('actions.precombat')) {
        currentSection = 'precombat';
      } else if (line.includes('actions.aoe')) {
        currentSection = 'aoe';
      } else if (line.includes('actions.cooldowns')) {
        currentSection = 'cooldowns';
      } else if (line.includes('actions.empower')) {
        currentSection = 'empowerSection';
      } else if (line.includes('actions.essence')) {
        currentSection = 'essenceManagement';
      }

      // 액션 추출
      const actionMatch = line.match(/actions[^=]*\+?=([^,#]+)/);
      if (actionMatch) {
        const action = actionMatch[1].trim();
        const condition = line.includes('if=') ? line.split('if=')[1]?.trim() : null;

        parsed[currentSection].push({
          action: this.translateAPLAction(action, spec),
          condition: condition,
          rawAction: action
        });
      }
    }

    // 기원사 특화 처리 - 강화 주문 최적화
    if (spec === 'devastation' || spec === 'preservation') {
      this.optimizeEmpowerAPL(parsed);
    }

    return parsed;
  }

  // APL 액션을 한국어로 번역
  translateAPLAction(action, spec) {
    const translations = {
      // 황폐 스킬 (DB 검증 완료)
      'fire_breath': '불의 숨결',
      'eternity_surge': '영원의 쇄도',
      'pyre': '기염',  // DB 확인: 장염룡포 X
      'living_flame': '살아있는 불꽃',
      'azure_strike': '하늘빛 일격',  // DB 확인: 푸른 비늘 X
      'disintegrate': '파열',  // DB 확인: 분해의 불길 X
      'firestorm': '불꽃 놓아주기',
      'dragonrage': '용의 분노',
      'deep_breath': '깊은 숨결',
      'shattering_star': '산산조각 별',
      'engulf': '업화',

      // 보존 스킬 (DB 검증 완료)
      'emerald_blossom': '에메랄드 꽃',  // DB 확인: 청록빛 꽃 X
      'reversion': '되돌리기',
      'spiritbloom': '영혼 만개',
      'dream_flight': '꿈의 비행',
      'verdant_embrace': '신록의 품',
      'echo': '메아리',
      'temporal_anomaly': '시간의 이상',
      'time_dilation': '시간 팽창',
      'rewind': '되감기',
      'stasis': '정지장',

      // 증강 스킬 (DB 검증 완료)
      'ebon_might': '칠흑의 힘',  // DB 확인: 칠흑의 세력 X
      'prescience': '예지',  // ko.wowhead.com 확인 필요
      'breath_of_eons': '영겁의 숨결',  // ko.wowhead.com 확인 필요
      'upheaval': '대격변',  // ko.wowhead.com 확인 필요
      'blistering_scales': '타오르는 비늘',
      'time_skip': '시간 건너뛰기',

      // 공통
      'hover': '호버',
      'obsidian_scales': '흑요석 비늘',
      'renewing_blaze': '소생의 불길',
      'blessing_of_the_bronze': '청동의 축복'
    };

    return translations[action] || action;
  }

  // 강화 주문 APL 최적화
  optimizeEmpowerAPL(parsed) {
    // 강화 주문 우선순위 정리
    const empowerPriority = [
      '불의 숨결 (최대 강화)',
      '영원의 쇄도 (최대 강화)',
      '심판의 날 중첩 고려',
      '이동 예측 시 부분 강화'
    ];

    if (!parsed.empowerSection || parsed.empowerSection.length === 0) {
      parsed.empowerSection = empowerPriority.map(p => ({
        action: p,
        condition: null,
        rawAction: p
      }));
    }
  }

  // APL 기반 로테이션 정제
  refineRotationFromAPL(knowledge, parsedAPL) {
    // 기존 로테이션과 APL 통합
    const aplPriorities = parsedAPL.default.map(item => item.action);

    // 기존 로테이션과 비교하여 업데이트
    if (aplPriorities.length > 0) {
      const combinedRotation = [];
      const existingRotation = knowledge.rotation || [];

      // APL 우선순위를 기준으로 통합
      aplPriorities.forEach(aplAction => {
        const existing = existingRotation.find(r =>
          r.includes(aplAction) || aplAction.includes(r.split(' ')[0])
        );

        if (existing) {
          combinedRotation.push(existing);
        } else {
          combinedRotation.push(`${aplAction} - SimC 권장`);
        }
      });

      // 기존에만 있던 항목 추가
      existingRotation.forEach(item => {
        if (!combinedRotation.some(c => c.includes(item.split(' ')[0]))) {
          combinedRotation.push(item);
        }
      });

      knowledge.rotation = combinedRotation;
      knowledge.aplIntegrated = true;
    }

    // 광역 로테이션도 동일하게 처리
    if (parsedAPL.aoe && parsedAPL.aoe.length > 0) {
      const aplAoePriorities = parsedAPL.aoe.map(item => item.action);
      const existingAoe = knowledge.aoeRotation || [];
      const combinedAoe = [];

      aplAoePriorities.forEach(aplAction => {
        const existing = existingAoe.find(r =>
          r.includes(aplAction) || aplAction.includes(r.split(' ')[0])
        );

        if (existing) {
          combinedAoe.push(existing);
        } else {
          combinedAoe.push(`${aplAction} - SimC 권장`);
        }
      });

      existingAoe.forEach(item => {
        if (!combinedAoe.some(c => c.includes(item.split(' ')[0]))) {
          combinedAoe.push(item);
        }
      });

      knowledge.aoeRotation = combinedAoe;
    }
  }
}

// 싱글톤 인스턴스
const evokerPersona = new EvokerPersona();

export default evokerPersona;