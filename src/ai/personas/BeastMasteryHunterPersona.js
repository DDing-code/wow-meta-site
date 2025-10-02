/**
 * BeastMasteryHunterPersona - 야수 사냥꾼 전문화 페르소나
 * 펫 중심의 원거리 DPS 전문가
 */

import BaseSpecializationPersona from './BaseSpecializationPersona.js';

class BeastMasteryHunterPersona extends BaseSpecializationPersona {
  constructor() {
    super();

    // 기본 정보
    this.class = '사냥꾼';
    this.classEng = 'Hunter';
    this.spec = '야수';
    this.specEng = 'Beast Mastery';
    this.classColor = '#AAD372';

    // 영웅 특성
    this.heroTalents = [
      {
        name: '무리의 지도자',
        nameEng: 'Pack Leader',
        icon: '🐺',
        description: '펫과의 시너지를 극대화하는 빌드'
      },
      {
        name: '어둠 순찰자',
        nameEng: 'Dark Ranger',
        icon: '🏹',
        description: '암흑 마법과 궁술을 결합한 빌드'
      }
    ];

    // 게임플레이 특성
    this.role = 'DPS';
    this.rangeType = '원거리';
    this.resourceType = 'builder-spender';
    this.resourceName = '집중';

    // 야수 사냥꾼 고유 특징
    this.uniqueFeatures = [
      '펫 2마리 동시 소환',
      '이동 중 모든 스킬 시전 가능',
      '펫을 통한 간접 딜링',
      '다양한 유틸리티 펫'
    ];

    this.strengths = [
      '높은 이동성',
      '안정적인 원거리 딜링',
      '우수한 광역 처리',
      '단순한 로테이션',
      'Solo 플레이 강함'
    ];

    this.weaknesses = [
      '펫 의존도 높음',
      '버스트 딜링 약함',
      '근접 전투 취약',
      'PvP 대응력 낮음'
    ];

    // 핵심 스킬 정의
    this.coreSkills = {
      killCommand: { id: '34026', name: '살상 명령', priority: 1 },
      barbedShot: { id: '217200', name: '날카로운 사격', priority: 2 },
      cobraShot: { id: '193455', name: '코브라 사격', priority: 5 },
      bestialWrath: { id: '19574', name: '야수의 격노', priority: 3 },
      aspectOfTheWild: { id: '193530', name: '야생의 상', priority: 4 },
      multiShot: { id: '2643', name: '일제 사격', priority: 6 },
      callOfTheWild: { id: '459794', name: '야생의 부름', priority: 1 }
    };
  }

  /**
   * 스킬 데이터베이스 로드
   */
  async loadSkillDatabase() {
    console.log('📚 야수 사냥꾼 스킬 데이터베이스 로드 중...');

    // 기본 스킬
    this.skillDatabase.set('34026', {
      name: '살상 명령',
      englishName: 'Kill Command',
      icon: 'ability_hunter_killcommand',
      description: '펫이 대상을 공격하여 큰 피해를 입힙니다.',
      cooldown: '10초',
      focusCost: 30
    });

    this.skillDatabase.set('217200', {
      name: '날카로운 사격',
      englishName: 'Barbed Shot',
      icon: 'ability_hunter_barbedshot',
      description: '대상에게 날카로운 화살을 발사하고 펫의 공격 속도를 증가시킵니다.',
      cooldown: '12초 (충전 2회)',
      focusGain: 20
    });

    this.skillDatabase.set('193455', {
      name: '코브라 사격',
      englishName: 'Cobra Shot',
      icon: 'ability_hunter_cobrashot',
      description: '대상에게 빠른 사격을 가합니다.',
      castTime: '1.7초',
      focusCost: 35
    });

    console.log(`✅ ${this.skillDatabase.size}개 스킬 로드 완료`);
  }

  /**
   * 로테이션 패턴 로드
   */
  async loadRotationPatterns() {
    console.log('🔄 야수 사냥꾼 로테이션 패턴 로드 중...');

    // 무리의 지도자 - 단일
    this.rotationPatterns.set('packLeader-single', {
      opener: [
        '야생의 부름',
        '살상 명령',
        '날카로운 사격',
        '야수의 격노',
        '날카로운 사격',
        '살상 명령',
        '코브라 사격'
      ],
      priority: [
        { skill: '야생의 부름', condition: '쿨다운 시 즉시' },
        { skill: '날카로운 사격', condition: '광분 3중첩 유지' },
        { skill: '살상 명령', condition: '쿨다운 시 즉시' },
        { skill: '야수의 격노', condition: '쿨다운 시 즉시' },
        { skill: '코브라 사격', condition: '집중 소비' }
      ]
    });

    // 무리의 지도자 - 광역
    this.rotationPatterns.set('packLeader-aoe', {
      opener: [
        '야생의 부름',
        '일제 사격',
        '날카로운 사격',
        '야수의 격노',
        '일제 사격'
      ],
      priority: [
        { skill: '야생의 부름', condition: '쿨다운 시 즉시' },
        { skill: '일제 사격', condition: '3마리 이상' },
        { skill: '날카로운 사격', condition: '광분 유지' },
        { skill: '살상 명령', condition: '주 대상' },
        { skill: '일제 사격', condition: '집중 소비' }
      ]
    });

    // 어둠 순찰자 - 단일
    this.rotationPatterns.set('darkRanger-single', {
      opener: [
        '검은 화살',
        '살상 명령',
        '날카로운 사격',
        '야수의 격노',
        '날카로운 사격',
        '살상 명령'
      ],
      priority: [
        { skill: '검은 화살', condition: '쿨다운 시 즉시' },
        { skill: '날카로운 사격', condition: '광분 3중첩 유지' },
        { skill: '살상 명령', condition: '쿨다운 시 즉시' },
        { skill: '야수의 격노', condition: '쿨다운 시 즉시' },
        { skill: '코브라 사격', condition: '집중 소비' }
      ]
    });

    console.log('✅ 로테이션 패턴 로드 완료');
  }

  /**
   * 스탯 우선순위 로드
   */
  async loadStatPriorities() {
    console.log('📊 야수 사냥꾼 스탯 우선순위 로드 중...');

    // 무리의 지도자
    this.statPriorities.set('packLeader-raid', [
      '민첩성',
      '가속 (20% 목표)',
      '치명타',
      '특화',
      '유연성'
    ]);

    this.statPriorities.set('packLeader-mythicplus', [
      '민첩성',
      '가속 (20% 목표)',
      '치명타',
      '특화',
      '유연성'
    ]);

    // 어둠 순찰자
    this.statPriorities.set('darkRanger-raid', [
      '민첩성',
      '가속 (15% 이상)',
      '치명타',
      '유연성',
      '특화'
    ]);

    this.statPriorities.set('darkRanger-mythicplus', [
      '민첩성',
      '가속 (20% 목표)',
      '치명타',
      '유연성',
      '특화'
    ]);

    console.log('✅ 스탯 우선순위 로드 완료');
  }

  /**
   * 영웅 특성 로드
   */
  async loadHeroTalents() {
    console.log('🦸 야수 사냥꾼 영웅 특성 로드 완료');
    // heroTalents는 이미 constructor에서 정의됨
  }

  /**
   * 로그 분석 (야수 특화)
   */
  async analyzePerformance(logData) {
    const performance = await super.analyzePerformance(logData);

    // 야수 사냥꾼 특화 분석
    performance.petUptime = this.analyzePetUptime(logData);
    performance.frenzyUptime = this.analyzeFrenzyUptime(logData);
    performance.barbedShotUsage = this.analyzeBarbedShotUsage(logData);
    performance.focusWaste = this.analyzeFocusWaste(logData);

    return performance;
  }

  /**
   * 펫 업타임 분석
   */
  analyzePetUptime(logData) {
    // 실제 구현 시 로그 데이터 파싱
    return {
      mainPet: 98.5,
      secondPet: 95.2,
      overall: 96.85
    };
  }

  /**
   * 광분 업타임 분석
   */
  analyzeFrenzyUptime(logData) {
    return {
      average: 85.3,
      max: 3,
      dropCount: 2
    };
  }

  /**
   * 날카로운 사격 사용 분석
   */
  analyzeBarbedShotUsage(logData) {
    return {
      casts: 45,
      chargesWasted: 1,
      efficiency: 95.5
    };
  }

  /**
   * 집중 낭비 분석
   */
  analyzeFocusWaste(logData) {
    return {
      totalGenerated: 5000,
      totalWasted: 250,
      wastePercent: 5.0
    };
  }

  /**
   * 개선 제안 생성 (야수 특화)
   */
  async generateSuggestions(performance) {
    const suggestions = await super.generateSuggestions(performance);

    // 광분 업타임 체크
    if (performance.frenzyUptime && performance.frenzyUptime.average < 90) {
      suggestions.push({
        category: '핵심 메커니즘',
        issue: `광분 업타임이 ${performance.frenzyUptime.average}%로 낮습니다`,
        solution: '날카로운 사격을 더 자주 사용하여 3중첩을 유지하세요',
        priority: 'high'
      });
    }

    // 펫 업타임 체크
    if (performance.petUptime && performance.petUptime.overall < 95) {
      suggestions.push({
        category: '펫 관리',
        issue: '펫 업타임이 최적화되지 않았습니다',
        solution: '펫 부활과 치유를 적절히 사용하세요',
        priority: 'medium'
      });
    }

    // 집중 낭비 체크
    if (performance.focusWaste && performance.focusWaste.wastePercent > 10) {
      suggestions.push({
        category: '리소스 관리',
        issue: `집중 ${performance.focusWaste.wastePercent}% 낭비`,
        solution: '코브라 사격을 더 자주 사용하여 집중 오버캡을 방지하세요',
        priority: 'medium'
      });
    }

    return suggestions;
  }

  /**
   * 가이드 생성 (야수 특화)
   */
  async generateGuide(options = {}) {
    const guide = await super.generateGuide(options);

    // 야수 사냥꾼 특화 섹션 추가
    guide.petManagement = {
      recommended: ['정신 붕괴 촉수', '돌가죽 가르그', '죽음발굽'],
      exotic: ['영혼 야수', '핵심 사냥개'],
      utility: {
        bloodlust: '핵심 사냥개 / 박쥐',
        battle_rez: '나방 / 두루미',
        defensive: '거북이 / 곰'
      }
    };

    guide.tips = [
      '날카로운 사격 2충전이 쌓이지 않도록 주의',
      '광분 3중첩 유지가 가장 중요',
      '야생의 부름은 최대한 많이 사용',
      '이동이 많은 구간에서도 딜 로스 없음',
      '펫 위치 선정이 중요 (클리브 회피)'
    ];

    return guide;
  }

  /**
   * 야수 사냥꾼 전용 질문 처리
   */
  async handleSpecificQuestion(question) {
    const { type, content } = question;

    if (type === 'pet') {
      return this.getPetAdvice(content);
    }

    if (type === 'frenzy') {
      return this.getFrenzyManagement();
    }

    return null;
  }

  /**
   * 펫 관련 조언
   */
  getPetAdvice(content) {
    return `🐾 야수 사냥꾼 펫 가이드:

**추천 펫:**
- 레이드: 정신 붕괴 촉수 (특화 버프)
- 쐐기돌: 돌가죽 가르그 (피해 감소)
- PvP: 죽음발굽 (치유 감소)

**유틸리티 펫:**
- 블러드: 핵심 사냥개, 박쥐
- 전투 부활: 나방, 두루미
- 이속 증가: 늑대, 하이에나`;
  }

  /**
   * 광분 관리 조언
   */
  getFrenzyManagement() {
    return `🔥 광분 관리 가이드:

1. **목표**: 3중첩 90% 이상 유지
2. **날카로운 사격 사용**:
   - 2충전 쌓이지 않도록 주의
   - 광분 1.5초 남았을 때 갱신
3. **우선순위**:
   - 광분 유지 > 살상 명령 > 코브라 사격
4. **팁**: 야생의 부름 중에는 날카로운 사격 쿨 감소 활용`;
  }
}

export default BeastMasteryHunterPersona;