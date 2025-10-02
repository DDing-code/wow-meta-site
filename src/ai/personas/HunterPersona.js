// 사냥꾼 AI 페르소나
import BaseClassPersona from './BaseClassPersona.js';

class HunterPersona extends BaseClassPersona {
  constructor() {
    const specs = [
      { name: 'beast-mastery', korean: '야수', role: 'DPS' },
      { name: 'marksmanship', korean: '사격', role: 'DPS' },
      { name: 'survival', korean: '생존', role: 'DPS' }
    ];

    super('hunter', '사냥꾼', specs);

    // 사냥꾼 특화 속성
    this.petKnowledge = new Map();       // 펫 관련 지식
    this.bestPets = {                    // 최고의 펫들
      raid: ['영혼 야수', '클렉시'],
      mythicPlus: ['혈족인도자', '모르타니스'],
      pvp: ['운디네', '펜룬']
    };

    this.loadHunterKnowledge();
  }

  // 사냥꾼 성격 초기화
  initializePersonality() {
    this.personality = {
      type: 'COMPANION',  // 동료형 - 펫과 함께하는 사냥꾼의 특성 반영
      greeting: '안녕하세요! 🏹 사냥꾼 마스터입니다. 펫과 함께 모험을 떠나볼까요?',
      farewell: '좋은 사냥 되세요! 펫도 잘 돌봐주세요! 🐻',
      encouragement: [
        '펫과의 호흡이 중요해요!',
        '거리 유지를 잊지 마세요!',
        '야수의 회전베기를 항상 유지하세요!',
        '광분 스택 관리가 핵심이에요!',
        '킬타는 사냥꾼의 로망이죠!'
      ],
      style: 'friendly',
      emoji: '🏹'
    };
  }

  // 사냥꾼 전문 지식 로드 (11.2 TWW Season 3 최신)
  loadHunterKnowledge() {
    // 야수 특성 지식 - Pack Leader (무리의 지도자)
    this.knowledge.set('beast-mastery-pack-leader', {
      patch: '11.2 TWW Season 3',
      heroTalent: '무리의 지도자 (Pack Leader)',
      opener: [
        'Bloodshed 시전',
        '야수의 격노 (Bestial Wrath) 사용',
        '살상 명령 (Kill Command) 시전',
        '날카로운 사격 (Barbed Shot) 사용',
        '활성 장신구 및 종족 특성 사용'
      ],
      rotation: [
        '광분 (Frenzy) 3스택 유지 또는 빠르게 3스택 도달 (최우선)',
        'Bloodshed 사용 가능 시 즉시 사용',
        '야수의 격노 쿨마다 사용',
        '날카로운 사격이 2차지 또는 거의 2차지일 때 살상 명령보다 우선',
        '살상 명령이 쿨다운일 때 날카로운 사격 사용',
        '날카로운 사격과 살상 명령 모두 쿨다운일 때 코브라 사격',
        '킬샷 (Kill Shot) 실행 구간에서 사용'
      ],
      talents: {
        raid: {
          recommended: '무리의 지도자가 모든 PvE 상황에서 어둠 순찰자보다 우수',
          build: 'Pack Leader 레이드 빌드',
          keyTalents: ['Bloodshed', 'Savagery', 'Thrill of the Hunt']
        },
        mythicPlus: {
          recommended: '무리의 지도자 - 쐐기 최적화',
          build: 'Pack Leader M+ 빌드',
          keyTalents: ['Beast Cleave', 'Kill Cleave', 'Wildspeaker']
        }
      },
      stats: {
        singleTarget: [
          '무기 데미지 (최우선)',
          '가속',
          '특화 = 치명타',
          '유연성'
        ],
        aoe: [
          '무기 데미지 (최우선)',
          '가속',
          '치명타',
          '특화',
          '유연성'
        ],
        breakpoints: '가속 소프트캡 없음, SimC로 개인 최적화 필요'
      },
      tips: [
        '광분 3스택 유지가 최우선 (Savagery로 14초 지속)',
        '야수의 격노 전에 살상 명령 1-2차지 확보',
        'Huntmaster\'s Call 버프와 야수의 격노 정렬',
        'Call of the Wild를 두 번째 주요 쿨다운으로 활용',
        '2+ 타겟에서 멀티샷으로 야수 회전베기 유지',
        '야수 회전베기 2초 이내 재갱신 필요시 멀티샷',
        'Kill Shot 우선순위 업데이트로 +0.5% DPS 증가'
      ],
      commonMistakes: [
        '광분 스택을 떨어뜨리는 것',
        '날카로운 사격 2차지를 모두 소비하는 것',
        '야수의 격노를 버스트 타이밍이 아닌 때 사용',
        '쿨다운 감소 효과 낭비',
        '다수 타겟에서 날카로운 사격 멀티 도트 실패'
      ],
      consumables: {
        phial: 'Flask of Alchemical Chaos',
        food: 'Feast of the Divine Day',
        oil: 'Algari Mana Oil',
        potion: 'Tempered Potion'
      },
      trinkets: {
        top: [
          'Unyielding Netherprism',
          'Improvised Seaforium Pacemaker',
          'Araz\'s Ritual Forge'
        ]
      },
      weakAuras: [
        '집중 바 트래커',
        'Thrill of the Hunt 업타임 트래커',
        '야수 회전베기 지속시간 트래커'
      ]
    });

    // 야수 특성 지식 - Dark Ranger (어둠 순찰자)
    this.knowledge.set('beast-mastery-dark-ranger', {
      patch: '11.2 TWW Season 3',
      heroTalent: '어둠 순찰자 (Dark Ranger)',
      note: '레이드에서만 사용, Pack Leader보다 성능 낮음',
      rotation: [
        '검은 화살 (Black Arrow) 최우선 사용',
        'Call of the Wild 중 Withering Fire 최대화',
        'Deathblow 프로섽 빠르게 소비',
        '광분 유지는 Pack Leader보다 덜 중요',
        '단일/광역 모두 검은 화살 우선'
      ],
      stats: {
        singleTarget: [
          '무기 데미지',
          '가속',
          '치명타',
          '유연성',
          '특화'
        ]
      },
      tips: [
        '레이드 환경에서만 제한적 사용',
        'Pack Leader가 모든 PvE 콘텐츠에서 우월',
        '특정 레이드 보스에서만 고려'
      ]
    });

    // 사격 특성 지식 (11.2 최신 업데이트 필요)
    this.knowledge.set('marksmanship', {
      rotation: [
        '이중 탭으로 교묘한 사격 디버프 적용',
        '조준 사격 (정조준 상태에서)',
        '신비한 사격으로 교묘한 사격 스택 생성',
        '속사로 집중 회복',
        '폭발 사격 (광역)',
        '트루샷 (버스트 윈도우)'
      ],
      talents: {
        raid: {
          sentinel: '파수꾼 - 단일딜 특화',
          darkRanger: '어둠 순찰자 - 실행 단계 강화'
        },
        mythicPlus: {
          sentinel: '파수꾼 - 폭발 사격 강화',
          darkRanger: '어둠 순찰자 - 광역 처리'
        }
      },
      stats: [
        '치명타 (30% 이상)',
        '특화',
        '가속',
        '유연성'
      ],
      tips: [
        '정조준 윈도우를 최대한 활용하세요',
        '트루샷은 정조준과 함께 사용하여 버스트를 극대화하세요',
        '이중 탭으로 교묘한 사격 디버프를 유지하세요',
        '이동이 필요한 상황에서는 신비한 사격을 사용하세요',
        '집중 관리를 위해 속사를 적절히 활용하세요'
      ],
      commonMistakes: [
        '정조준 윈도우를 놓치는 것',
        '트루샷 타이밍 실수',
        '교묘한 사격 디버프 관리 실패',
        '과도한 이동으로 캐스팅 손실',
        '집중 고갈로 인한 DPS 손실'
      ]
    });

    // 생존 특성 지식 (11.2 최신 업데이트 필요)
    this.knowledge.set('survival', {
      rotation: [
        '맹금 공격으로 맹금 스택 생성',
        '살상 명령 (집중 소비)',
        '야생불 폭탄 설치',
        '도살 (맹금 소비)',
        '플랭킹 스트라이크',
        '측면 공격으로 킬샷 초기화'
      ],
      talents: {
        raid: {
          packLeader: '무리의 지도자 - 펫 시너지',
          sentinel: '파수꾼 - 폭탄 특화'
        },
        mythicPlus: {
          packLeader: '무리의 지도자 - 광역 처리',
          sentinel: '파수꾼 - 폭탄 광역'
        }
      },
      stats: [
        '가속',
        '치명타',
        '유연성',
        '특화'
      ],
      tips: [
        '근접 거리를 유지하되 기계 공격 범위 밖에서 싸우세요',
        '야생불 폭탄을 쿨마다 사용하세요',
        '맹금 스택을 3-5개 유지하여 도살 효율을 높이세요',
        '측면 공격으로 킬샷을 자주 사용하세요',
        '집중 관리에 주의하세요'
      ],
      commonMistakes: [
        '근접 거리 유지 실패',
        '맹금 스택 관리 실패',
        '야생불 폭탄 쿨다운 낭비',
        '측면 공격 미사용',
        '집중 부족으로 인한 로테이션 끊김'
      ]
    });

    // 펫 관련 지식
    this.loadPetKnowledge();

    // 쐐기 특화 지식 추가
    this.loadMythicPlusKnowledge();
  }

  // 쐐기 특화 지식
  loadMythicPlusKnowledge() {
    this.mythicPlusKnowledge = {
      rotation: {
        aoe: [
          '멀티샷으로 야수 회전베기 유지 (필수)',
          'Bloodshed 사용',
          '살상 명령 쿨마다',
          '날카로운 사격 멀티 도트',
          '코브라 사격으로 마무리'
        ],
        keyTalents: [
          'Beast Cleave - 야수 회전베기',
          'Kill Cleave - 광역 강화',
          'Wildspeaker - Dire Beast 데미지 증가'
        ]
      },
      utility: {
        interrupts: '카운터 샷 (Counter Shot)',
        cc: '속박의 사격 (Binding Shot)',
        defensives: '거북의 상 (Aspect of the Turtle)',
        mobility: '철수 (Disengage)',
        priority: [
          'Venom Volley 차단',
          'Horrifying Shrill 차단',
          'Xal\'atath\'s Bargain 처치'
        ]
      },
      affixStrategies: {
        'Xal\'atath\'s Bargain': 'Voidbound 몹 우선 처치',
        'Challenger\'s Peril': '죽음 회피 중요',
        'Fortified': '일반 몹 처치 시간 증가',
        'Tyrannical': '보스 전투 준비 철저'
      },
      tips: [
        '시작 전 Tempered Potion 사용',
        '10-12 타겟 풀에서 멀티샷 빌드',
        'Call of the Wild 높은 데미지 윈도우에 정렬',
        '야수의 격노 업타임 극대화'
      ]
    };
  }

  // 펫 지식 로드
  loadPetKnowledge() {
    this.petKnowledge.set('general', {
      abilities: {
        '광기': '펫 공격 속도 30% 증가',
        '원시 본능': '펫 생명력 증가 및 도발',
        '주인의 부름': '펫 즉시 소환 및 치유'
      },
      management: [
        '펫이 항상 타겟 근처에 있도록 위치 조정',
        '광기는 버스트 타이밍에 사용',
        '펫이 죽으면 즉시 부활',
        '멀티 타겟 상황에서 펫 타겟 전환'
      ]
    });

    this.petKnowledge.set('types', {
      tenacity: '탱킹 펫 - 솔로 플레이나 월드 컨텐츠',
      ferocity: 'DPS 펫 - 레이드와 던전 (광기 제공)',
      cunning: '유틸 펫 - PvP나 특수 상황'
    });
  }

  // 사냥꾼 특화 질문 처리
  async handleQuestion(data) {
    const { question } = data;
    const lowerQuestion = question.toLowerCase();

    // 펫 관련 질문 체크
    if (lowerQuestion.includes('펫') || lowerQuestion.includes('pet')) {
      return await this.handlePetQuestion(data);
    }

    // 영웅 특성 관련 질문
    if (lowerQuestion.includes('무리') || lowerQuestion.includes('어둠') ||
        lowerQuestion.includes('파수꾼')) {
      return await this.handleHeroTalentQuestion(data);
    }

    // 킬타 관련 질문
    if (lowerQuestion.includes('킬타') || lowerQuestion.includes('킬샷')) {
      return await this.handleKillShotQuestion(data);
    }

    // 기본 처리
    return await super.handleQuestion(data);
  }

  // 펫 관련 질문 처리
  async handlePetQuestion(data) {
    const { question, context } = data;
    const lowerQuestion = question.toLowerCase();

    let response = {
      type: 'pet',
      spec: '공통'
    };

    if (lowerQuestion.includes('추천') || lowerQuestion.includes('best')) {
      const situation = context?.situation || 'raid';
      const recommendedPets = this.bestPets[situation] || this.bestPets.raid;

      response.advice = `🐾 ${situation} 추천 펫:\n` +
        recommendedPets.map((pet, i) => `${i + 1}. ${pet}`).join('\n') +
        '\n\n펫은 Ferocity(광기) 타입을 사용하세요!';
    } else if (lowerQuestion.includes('관리') || lowerQuestion.includes('manage')) {
      const management = this.petKnowledge.get('general').management;
      response.advice = '🐾 펫 관리 팁:\n' +
        management.map(tip => `• ${tip}`).join('\n');
    } else {
      response.advice = '🐾 펫 기본 정보:\n' +
        '• Ferocity: DPS 증가 (광기 제공)\n' +
        '• Tenacity: 생존력 증가 (솔로 플레이)\n' +
        '• Cunning: 유틸리티 (PvP)';
    }

    response.confidence = 0.9;

    // 경험치 증가
    this.gainExperience(2);

    return this.formatResponse(response);
  }

  // \uc410\uae30 \uad00\ub828 \uc9c8\ubb38 \ucc98\ub9ac
  async handleMythicPlusQuestion(data) {
    const { question, spec } = data;
    const lowerQuestion = question.toLowerCase();

    let advice = `\ud83c\udf86 **\uc57c\uc218 \uc0ac\ub0e5\uafbc \uc410\uae30 \uac00\uc774\ub4dc (11.2 TWW S3)**\n\n`;

    if (this.mythicPlusKnowledge) {
      const m = this.mythicPlusKnowledge;

      if (lowerQuestion.includes('\ub85c\ud14c') || lowerQuestion.includes('\ub51c\uc0ac\uc774\ud074')) {
        advice += `**\uad11\uc5ed \ub51c\uc0ac\uc774\ud074:**\n`;
        m.rotation.aoe.forEach((step, i) => {
          advice += `${i + 1}. ${step}\n`;
        });
        advice += `\n`;
      }

      if (lowerQuestion.includes('\ud2b9\uc131') || lowerQuestion.includes('talent')) {
        advice += `**\ud575\uc2ec \ud2b9\uc131:**\n`;
        m.rotation.keyTalents.forEach(talent => {
          advice += `\u2022 ${talent}\n`;
        });
        advice += `\n`;
      }

      if (lowerQuestion.includes('\uc5b4\ud53d\uc2a4') || lowerQuestion.includes('affix')) {
        advice += `**\uc5b4\ud53d\uc2a4 \ub300\uc751:**\n`;
        Object.entries(m.affixStrategies).forEach(([affix, strategy]) => {
          advice += `\u2022 ${affix}: ${strategy}\n`;
        });
        advice += `\n`;
      }

      if (lowerQuestion.includes('\uc720\ud2f8') || lowerQuestion.includes('\ucc28\ub2e8')) {
        advice += `**\uc8fc\uc694 \uc720\ud2f8\uae30:**\n`;
        advice += `\u2022 \ucc28\ub2e8: ${m.utility.interrupts}\n`;
        advice += `\u2022 \uad70\uc911\uc81c\uc5b4: ${m.utility.cc}\n`;
        advice += `\u2022 \uc0dd\uc874\uae30: ${m.utility.defensives}\n`;
        advice += `\u2022 \uc774\ub3d9\uae30: ${m.utility.mobility}\n\n`;
        advice += `**\ucc28\ub2e8 \uc6b0\uc120\uc21c\uc704:**\n`;
        m.utility.priority.forEach(spell => {
          advice += `\u2022 ${spell}\n`;
        });
        advice += `\n`;
      }

      advice += `**\uac04\ub2e8 \ud301:**\n`;
      m.tips.slice(0, 3).forEach(tip => {
        advice += `\u2022 ${tip}\n`;
      });
    }

    const response = {
      type: 'mythic-plus',
      spec: spec || '\uc57c\uc218',
      advice,
      confidence: 0.9
    };

    this.gainExperience(3);
    return this.formatResponse(response);
  }

  // 영웅 특성 질문 처리
  async handleHeroTalentQuestion(data) {
    const { question, spec } = data;
    const lowerQuestion = question.toLowerCase();

    let heroTalent = '';
    let advice = '';

    if (lowerQuestion.includes('무리')) {
      heroTalent = '무리의 지도자';
      advice = `🦁 **무리의 지도자 (Pack Leader)**

**장점:**
• 펫 강화 및 추가 소환
• 안정적인 단일 대상 DPS
• 야수 특성과 뛰어난 시너지

**추천 상황:**
• 레이드 단일 보스
• 긴 전투 지속 시간
• 펫 중심 플레이 스타일

**핵심 스킬:**
• 늑대의 부름: 추가 늑대 소환
• 무리의 힘: 펫 피해량 증가`;
    } else if (lowerQuestion.includes('어둠')) {
      heroTalent = '어둠 순찰자';
      advice = `🌑 **어둠 순찰자 (Dark Ranger)**

**장점:**
• 강력한 광역 처리
• 검은 화살 시너지
• 실행 단계 DPS 증가

**추천 상황:**
• 쐐기 던전
• 다수 적 처리
• 짧은 전투

**핵심 스킬:**
• 검은 화살: DoT 및 암흑의 사냥개 소환
• 그림자 사격: 추가 암흑 피해`;
    } else if (lowerQuestion.includes('파수꾼')) {
      heroTalent = '파수꾼';
      advice = `🛡️ **파수꾼 (Sentinel)**

**장점:**
• 폭발 사격 강화
• 우수한 기동성
• 유틸리티 증가

**추천 상황:**
• 사격/생존 특성
• 높은 이동이 필요한 전투
• PvP

**핵심 스킬:**
• 강화된 폭발 사격
• 추가 유틸리티 스킬`;
    }

    const response = {
      type: 'hero-talent',
      spec: spec || '야수',
      advice,
      confidence: 0.95
    };

    this.gainExperience(3);
    return this.formatResponse(response);
  }

  // 킬샷 관련 질문 처리
  async handleKillShotQuestion(data) {
    const response = {
      type: 'killshot',
      spec: '공통',
      advice: `💀 **킬샷 (Kill Shot) 가이드**

**기본 정보:**
• 사용 조건: 적 생명력 20% 이하
• 재사용 대기시간: 20초
• 집중 소모 없음
• 높은 피해량

**특성별 시너지:**
• **야수**: 살상 명령과 함께 사용
• **사격**: 정조준 윈도우에 사용
• **생존**: 측면 공격으로 초기화 가능

**팁:**
• 실행 단계에서 우선순위 높음
• 어둠 순찰자는 35% 이하에서 사용 가능
• PvP에서 마무리 기술로 중요`,
      confidence: 0.9
    };

    this.gainExperience(2);
    return this.formatResponse(response);
  }

  // 로테이션 조언 오버라이드 (11.2 최신)
  async getRotationAdvice(spec, details) {
    // Pack Leader 기본 사용
    const knowledge = this.knowledge.get(`${spec.name}-pack-leader`) || this.knowledge.get(spec.name);

    if (!knowledge) {
      return await super.getRotationAdvice(spec, details);
    }

    let advice = `🎯 **${spec.korean} 딜사이클 (11.2 TWW S3)**\n\n`;

    // 영웅 특성 정보 추가
    if (knowledge.heroTalent) {
      advice += `**영웅 특성**: ${knowledge.heroTalent}\n\n`;
    }

    // 오프닝이 있으면 표시
    if (knowledge.opener) {
      advice += `**오프닝:**\n${knowledge.opener.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n`;
    }

    advice += `**일반 딜사이클:**\n${knowledge.rotation.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n`;

    advice += `**핵심 팁:**\n${knowledge.tips.slice(0, 3).map(tip => `• ${tip}`).join('\n')}\n\n`;

    // 소모품 정보 있으면 추가
    if (knowledge.consumables) {
      advice += `**\n필수 소모품:**\n`;
      advice += `• 영약: ${knowledge.consumables.phial}\n`;
      advice += `• 오일: ${knowledge.consumables.oil}\n`;
      advice += `• 물약: ${knowledge.consumables.potion}\n\n`;
    }

    advice += `**주의사항:**\n${knowledge.commonMistakes.slice(0, 2).map(mistake => `⚠️ ${mistake}`).join('\n')}`;

    return {
      type: 'rotation',
      spec: spec.korean,
      advice,
      confidence: 0.95  // 11.2 최신 데이터로 신뢰도 상승
    };
  }

  // 특성 조언 오버라이드 (11.2 최신)
  async getTalentAdvice(spec, details) {
    const knowledge = this.knowledge.get(`${spec.name}-pack-leader`) || this.knowledge.get(spec.name);

    if (!knowledge || !knowledge.talents) {
      return await super.getTalentAdvice(spec, details);
    }

    const raidTalents = knowledge.talents.raid;
    const m = knowledge.talents.mythicPlus;

    let advice = `🎯 **${spec.korean} 특성 가이드 (11.2 TWW S3)**\n\n`;

    advice += `ℹ️ **중요**: 무리의 지도자(Pack Leader)가 모든 PvE 상황에서 우월\n\n`;

    advice += `**레이드 빌드:**\n`;
    advice += `• 추천: ${raidTalents.recommended}\n`;
    if (raidTalents.keyTalents) {
      advice += `• 핵심 특성: ${raidTalents.keyTalents.join(', ')}\n`;
    }
    advice += `\n`;

    advice += `**쐐기 빌드:**\n`;
    advice += `• 추천: ${m.recommended}\n`;
    if (m.keyTalents) {
      advice += `• 핵심 특성: ${m.keyTalents.join(', ')}\n`;
    }
    advice += `\n`;

    // 장신구 정보 추가
    if (knowledge.trinkets) {
      advice += `**추천 장신구:**\n`;
      knowledge.trinkets.top.forEach((trinket, i) => {
        advice += `${i + 1}. ${trinket}\n`;
      });
      advice += `\n`;
    }

    advice += `📝 SimC로 개인 최적화를 확인하세요!`;

    return {
      type: 'talent',
      spec: spec.korean,
      advice,
      confidence: 0.9
    };
  }

  // 스탯 조언 오버라이드 (11.2 최신)
  async getStatAdvice(spec, details) {
    const knowledge = this.knowledge.get(`${spec.name}-pack-leader`) || this.knowledge.get(spec.name);

    if (!knowledge || !knowledge.stats) {
      return await super.getStatAdvice(spec, details);
    }

    let advice = `📊 **${spec.korean} 스탯 우선순위 (11.2 TWW S3)**\n\n`;

    if (knowledge.heroTalent) {
      advice += `**영웅 특성**: ${knowledge.heroTalent}\n\n`;
    }

    if (knowledge.stats.singleTarget) {
      advice += `**단일 타겟:**\n`;
      knowledge.stats.singleTarget.forEach((stat, i) => {
        advice += `${i + 1}. ${stat}\n`;
      });
      advice += `\n`;
    }

    if (knowledge.stats.aoe) {
      advice += `**광역 (AoE):**\n`;
      knowledge.stats.aoe.forEach((stat, i) => {
        advice += `${i + 1}. ${stat}\n`;
      });
      advice += `\n`;
    }

    if (knowledge.stats.breakpoints) {
      advice += `**참고:**\n• ${knowledge.stats.breakpoints}\n\n`;
    }

    advice += `ℹ️ 무기 데미지가 최우선 스탯\n`;
    advice += `📑 더 높은 아이템 레벨이 일반적으로 우월\n`;
    advice += `📝 SimulationCraft로 개인 최적화 필수!`;

    return {
      type: 'stats',
      spec: spec.korean,
      advice,
      confidence: 0.85
    };
  }

  // 성능 분석 오버라이드 (사냥꾼 특화)
  analyzeRotation(logs, spec) {
    if (!logs || logs.length === 0) return 50;

    let score = 100;
    const specName = spec?.name || 'beast-mastery';

    // 야수 특성 체크
    if (specName === 'beast-mastery') {
      // 광분 업타임 체크
      const frenzyUptime = this.checkFrenzyUptime(logs);
      if (frenzyUptime < 90) {
        score -= (90 - frenzyUptime) * 0.5;
      }

      // 날카로운 사격 관리 체크
      const barbedManagement = this.checkBarbedShotManagement(logs);
      score = score * barbedManagement;
    }

    // 사격 특성 체크
    else if (specName === 'marksmanship') {
      // 정조준 활용도
      const trueshotUsage = this.checkTrueshotUsage(logs);
      score = score * trueshotUsage;
    }

    // 생존 특성 체크
    else if (specName === 'survival') {
      // 맹금 스택 관리
      const raptorManagement = this.checkRaptorStrikeManagement(logs);
      score = score * raptorManagement;
    }

    return Math.max(0, Math.min(100, score));
  }

  // 광분 업타임 체크
  checkFrenzyUptime(logs) {
    // 실제로는 로그에서 광분 버프 업타임을 계산
    // 여기서는 시뮬레이션
    return 85 + Math.random() * 15;
  }

  // 날카로운 사격 관리 체크
  checkBarbedShotManagement(logs) {
    // 2차지 관리 등을 체크
    return 0.8 + Math.random() * 0.2;
  }

  // 트루샷 사용 체크
  checkTrueshotUsage(logs) {
    // 정조준 윈도우와의 시너지 체크
    return 0.75 + Math.random() * 0.25;
  }

  // 맹금 공격 관리 체크
  checkRaptorStrikeManagement(logs) {
    // 맹금 스택 관리 효율성
    return 0.7 + Math.random() * 0.3;
  }
}

export default HunterPersona;