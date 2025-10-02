// AI 페르소나 초기화 및 설정
import personaManager from './PersonaManager.js';
import HunterPersona from './HunterPersona.js';
import EvokerPersona from './EvokerPersona.js';
import moduleEventBus from '../../services/ModuleEventBus.js';

class PersonaInitializer {
  constructor() {
    this.initialized = false;
    this.personas = new Map();
  }

  // 페르소나 시스템 초기화
  async initialize() {
    if (this.initialized) {
      console.log('페르소나 시스템이 이미 초기화되었습니다.');
      return;
    }

    console.log('🤖 AI 페르소나 시스템 초기화 시작...');

    try {
      // 사냥꾼 페르소나 생성 및 등록
      await this.initializeHunterPersona();

      // 기원사 페르소나 생성 및 등록
      await this.initializeEvokerPersona();

      // 저장된 상태 복원
      personaManager.loadPersonaState();

      // 초기화 완료
      this.initialized = true;

      console.log('✅ AI 페르소나 시스템 초기화 완료');

      // 초기화 완료 이벤트
      moduleEventBus.emit('personas-initialized', {
        count: personaManager.personas.size,
        personas: Array.from(personaManager.personas.keys())
      });

      return true;
    } catch (error) {
      console.error('❌ 페르소나 시스템 초기화 실패:', error);
      return false;
    }
  }

  // 사냥꾼 페르소나 초기화
  async initializeHunterPersona() {
    console.log('🏹 사냥꾼 페르소나 생성 중...');

    const hunterPersona = new HunterPersona();

    // 추가 지식 로드 (필요시)
    await this.loadAdditionalHunterKnowledge(hunterPersona);

    // 페르소나 매니저에 등록
    const success = personaManager.registerPersona(hunterPersona);

    if (success) {
      this.personas.set('hunter', hunterPersona);
      console.log('✅ 사냥꾼 페르소나 등록 완료');
    } else {
      console.error('❌ 사냥꾼 페르소나 등록 실패');
    }

    return success;
  }

  // 기원사 페르소나 초기화
  async initializeEvokerPersona() {
    console.log('🐉 기원사 페르소나 생성 중...');

    // EvokerPersona는 싱글톤이므로 import한 인스턴스 사용
    const evokerPersona = EvokerPersona;

    // 추가 지식 로드 (필요시)
    await this.loadAdditionalEvokerKnowledge(evokerPersona);

    // 페르소나 매니저에 등록
    const success = personaManager.registerPersona(evokerPersona);

    if (success) {
      this.personas.set('evoker', evokerPersona);
      console.log('✅ 기원사 페르소나 등록 완료');
    } else {
      console.error('❌ 기원사 페르소나 등록 실패');
    }

    return success;
  }

  // 추가 기원사 지식 로드
  async loadAdditionalEvokerKnowledge(persona) {
    // 11.2 TWW S3 최신 정보
    const additionalData = {
      patches: {
        '11.2': {
          changes: [
            '용의 분노 재사용 대기시간 2분으로 감소',
            '불의 숨결 강화 시간 0.5초 증가',
            '장염룡포 데미지 10% 증가',
            '정수 파열 치유량 15% 증가'
          ],
          hotfixes: [
            '2024-12-10: 불꽃형성자 티어세트 효과 버프',
            '2024-12-17: 증강 칠흑의 세력 범위 30야드로 증가'
          ]
        }
      },
      advancedTips: {
        'devastation': [
          '용의 분노는 항상 불꽃 놓아주기와 함께 사용하세요.',
          '심판의 날 중첩이 5 이상일 때 불의 숨결을 사용하세요.',
          '정수가 5개가 되면 즉시 소비하여 낭비를 방지하세요.',
          '이동이 필요한 구간에서는 호버를 활용하여 캐스팅을 유지하세요.'
        ],
        'preservation': [
          '반향 중첩을 항상 4-5개 유지하세요.',
          '꿈의 비행은 예측 가능한 광역 피해 전에 미리 사용하세요.',
          '시간 팽창은 자신뿐만 아니라 아군에게도 사용 가능합니다.',
          '정령의 꽃은 디버프가 있는 대상을 우선시하세요.'
        ],
        'augmentation': [
          '칠흑의 세력은 최고 DPS 2명에게 항상 유지하세요.',
          '선제의 일격은 대변동 직전에 사용하여 버프를 극대화하세요.',
          '운명의 숨결은 아군의 버스트 타이밍과 맞춰 사용하세요.',
          '위치 선정이 매우 중요 - 항상 아군 25야드 내에 있어야 합니다.'
        ]
      },
      macros: {
        hover: '#showtooltip 호버\n/cast 호버',
        empowerRelease: '/stopcasting',
        targetHeal: '/cast [@mouseover,help,nodead][@target,help,nodead][@player] 청록빛 꽃',
        markEnemy: '/cast [@focus,harm][@target,harm] 화염 인장'
      }
    };

    // 지식 추가
    if (persona.knowledge) {
      persona.advancedTips = additionalData.advancedTips;
      persona.macros = additionalData.macros;
      persona.patchInfo = additionalData.patches;
    }
  }

  // 추가 사냥꾼 지식 로드
  async loadAdditionalHunterKnowledge(persona) {
    // 최신 패치 정보나 추가 데이터 로드
    const additionalData = {
      patches: {
        '11.2': {
          changes: [
            '날카로운 사격 데미지 5% 증가',
            '야수의 격노 지속시간 1초 증가',
            '살상 명령 집중 소모량 5 감소'
          ],
          newBuilds: {
            'beast-mastery': {
              raid: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSkIRSJkkkkkkkkkikIkIpFJJRSSSJA',
              mythicPlus: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSkIRShkkkkkkkkkikIkIpFJJRSSIJA'
            }
          }
        }
      },
      advancedTips: {
        'beast-mastery': [
          '2타겟에서는 멀티샷을 사용하지 마세요. 야수의 회전베기만으로 충분합니다.',
          '3타겟 이상에서만 멀티샷 → 코브라 사격 로테이션으로 전환하세요.',
          '펫의 기본 공격이 자동 타겟 전환되도록 설정하세요.',
          '야수의 격노는 혈욕/영웅심과 겹치지 않게 사용하세요.'
        ],
        'marksmanship': [
          '트루샷 전에 항상 이중 탭을 사용하여 교묘한 사격을 적용하세요.',
          '정조준 윈도우는 2개의 조준 사격을 넣을 수 있습니다.',
          '이동 중에는 신비한 사격으로 교묘한 사격 스택을 유지하세요.',
          '바람 화살은 정조준과 함께 사용하여 버스트를 극대화하세요.'
        ],
        'survival': [
          '코디네이트 어썰트는 쿨마다 사용하되, 버스트 타이밍을 맞추세요.',
          '와일드파이어 폭탄은 충전이 2개가 되지 않도록 관리하세요.',
          '맹금 공격 5스택에서 도살을 사용하는 것이 가장 효율적입니다.',
          '플랭킹 스트라이크는 집중 생성기로도 활용하세요.'
        ]
      },
      macros: {
        petAttack: '/petattack [@target,harm][@targettarget,harm]',
        misdirection: '/cast [@focus,help][@pet,exists] 눈속임',
        petHeal: '/cast [@pet] 애완동물 소생',
        aspectSwitch: '/castsequence 치타의 상, 거북의 상'
      }
    };

    // 지식 추가
    for (const [spec, tips] of Object.entries(additionalData.advancedTips)) {
      const currentKnowledge = persona.knowledge.get(spec);
      if (currentKnowledge) {
        currentKnowledge.advancedTips = tips;
      }
    }

    // 매크로 정보 추가
    persona.macros = additionalData.macros;

    // 패치 정보 추가
    persona.patchInfo = additionalData.patches;
  }

  // 페르소나 테스트
  async testPersona(className) {
    const persona = this.personas.get(className);
    if (!persona) {
      console.error(`${className} 페르소나를 찾을 수 없습니다.`);
      return;
    }

    console.log(`\n🧪 ${persona.koreanName} 페르소나 테스트 시작...`);

    // 테스트 질문들
    const testQuestions = [
      { question: '야수 사냥꾼 로테이션 알려줘', spec: '야수' },
      { question: '어떤 펫을 사용해야 해?', spec: '야수' },
      { question: '무리의 지도자랑 어둠 순찰자 중 뭐가 나아?', spec: '야수' },
      { question: '킬샷은 언제 사용해?', spec: null },
      { question: '사격 사냥꾼 스탯 우선순위는?', spec: '사격' }
    ];

    for (const test of testQuestions) {
      console.log(`\n📝 질문: ${test.question}`);

      const response = await persona.handleQuestion({
        question: test.question,
        spec: test.spec,
        context: { situation: 'raid' }
      });

      if (response.success) {
        console.log(`✅ 응답:\n${response.message.substring(0, 200)}...`);
        console.log(`📊 신뢰도: ${response.metadata.confidence * 100}%`);
      } else {
        console.log(`❌ 응답 실패: ${response.message}`);
      }
    }

    console.log(`\n✨ ${persona.koreanName} 페르소나 테스트 완료`);
    console.log(`📈 현재 레벨: ${persona.level}, 경험치: ${persona.experience}`);
  }

  // 모든 페르소나 상태 조회
  getStatus() {
    return personaManager.getAllPersonaStatus();
  }

  // 통계 리포트
  getStatisticsReport() {
    return personaManager.generateStatisticsReport();
  }
}

// 싱글톤 인스턴스
const personaInitializer = new PersonaInitializer();

export default personaInitializer;