// AI 페르소나 기반 공략 생성 시스템
import personaManager from './PersonaManager.js';
import moduleEventBus from '../../services/ModuleEventBus.js';

class PersonaGuideGenerator {
  constructor() {
    this.guideTemplates = {
      딜사이클: this.generateRotationGuide,
      특성: this.generateTalentGuide,
      스탯: this.generateStatGuide,
      장비: this.generateGearGuide,
      쐐기: this.generateMythicPlusGuide,
      레이드: this.generateRaidGuide,
      PvP: this.generatePvPGuide
    };

    this.registerModule();
  }

  // 모듈 등록
  registerModule() {
    moduleEventBus.registerModule('persona-guide-generator', {
      name: 'AI 페르소나 공략 생성기',
      version: '1.0.0',
      type: 'generator'
    });

    // 이벤트 리스너
    moduleEventBus.on('generate-guide', (data) => {
      this.generateGuide(data);
    });
  }

  // 공략 생성
  async generateGuide({ className, spec, guideType, context = {} }) {
    console.log(`📚 ${className} ${spec} ${guideType} 공략 생성 시작...`);

    try {
      // 해당 클래스 페르소나 찾기
      const persona = personaManager.personas.get(className);

      if (!persona) {
        throw new Error(`${className} 페르소나를 찾을 수 없습니다.`);
      }

      // 가이드 타입별 생성
      const generator = this.guideTemplates[guideType];
      if (!generator) {
        throw new Error(`지원하지 않는 가이드 타입: ${guideType}`);
      }

      // 페르소나의 지식을 활용하여 가이드 생성
      const guide = await generator.call(this, persona, spec, context);

      // 메타데이터 추가
      const completeGuide = {
        ...guide,
        metadata: {
          generatedBy: persona.koreanName,
          personaLevel: persona.level,
          confidence: persona.confidence,
          timestamp: Date.now(),
          version: '11.2 TWW S3'
        }
      };

      console.log(`✅ ${guideType} 공략 생성 완료`);

      return {
        success: true,
        guide: completeGuide
      };

    } catch (error) {
      console.error('공략 생성 실패:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 딜사이클 가이드 생성
  async generateRotationGuide(persona, spec, context) {
    const knowledge = persona.knowledge.get(spec);
    if (!knowledge) {
      throw new Error(`${spec} 지식이 없습니다.`);
    }

    const guide = {
      title: `${spec} 딜사이클 가이드`,
      sections: {
        opener: {
          title: '오프닝',
          steps: knowledge.rotation?.opener || [],
          tips: '첫 풀 전 준비사항 및 버프 타이밍'
        },
        priority: {
          title: '우선순위',
          steps: knowledge.rotation?.priority || [],
          explanation: '일반적인 전투 중 우선순위'
        },
        cooldowns: {
          title: '쿨다운 관리',
          major: knowledge.rotation?.cooldowns || [],
          usage: '주요 쿨다운 사용 타이밍'
        },
        aoe: {
          title: '광역 딜사이클',
          steps: knowledge.rotation?.aoe || [],
          breakpoints: '타겟 수별 변화 지점'
        }
      },
      tips: knowledge.advancedTips || [],
      commonMistakes: [
        '버프 타이밍 놓치기',
        '자원 관리 실패',
        '쿨다운 낭비'
      ]
    };

    return guide;
  }

  // 특성 가이드 생성
  async generateTalentGuide(persona, spec, context) {
    const knowledge = persona.knowledge.get(spec);
    if (!knowledge) {
      throw new Error(`${spec} 지식이 없습니다.`);
    }

    const situation = context.situation || 'raid';
    const builds = knowledge.builds?.[situation] || {};

    const guide = {
      title: `${spec} 특성 가이드`,
      builds: {
        raid: {
          title: '레이드 빌드',
          talentString: builds.raid || '',
          keyTalents: this.extractKeyTalents(builds.raid),
          reasoning: '단일 타겟 및 지속 딜에 최적화'
        },
        mythicPlus: {
          title: '쐐기 빌드',
          talentString: builds.mythicPlus || '',
          keyTalents: this.extractKeyTalents(builds.mythicPlus),
          reasoning: '광역 및 버스트 딜에 최적화'
        },
        pvp: {
          title: 'PvP 빌드',
          talentString: builds.pvp || '',
          keyTalents: this.extractKeyTalents(builds.pvp),
          reasoning: '생존력과 순간 폭딜에 중점'
        }
      },
      heroTalents: knowledge.heroTalents || {},
      situationalChoices: [
        '이동이 많은 전투에서의 선택',
        '버스트가 중요한 상황',
        '지속딜이 중요한 상황'
      ]
    };

    return guide;
  }

  // 스탯 가이드 생성
  async generateStatGuide(persona, spec, context) {
    const knowledge = persona.knowledge.get(spec);
    if (!knowledge) {
      throw new Error(`${spec} 지식이 없습니다.`);
    }

    const guide = {
      title: `${spec} 스탯 가이드`,
      priority: knowledge.stats || [],
      weights: {
        primary: '주 스탯 (민첩성/지능/힘)',
        secondary: knowledge.statWeights || {}
      },
      breakpoints: {
        critical: '치명타 30-35% 목표',
        haste: '가속 20-25% 권장',
        mastery: '특화는 상황에 따라',
        versatility: '유연성은 PvP에서 중요'
      },
      enchants: {
        weapon: '무기 마법부여 추천',
        chest: '가슴 마법부여 추천',
        ring: '반지 마법부여 추천'
      },
      gems: {
        primary: '주 보석 선택',
        secondary: '보조 보석 선택'
      }
    };

    return guide;
  }

  // 장비 가이드 생성
  async generateGearGuide(persona, spec, context) {
    const knowledge = persona.knowledge.get(spec);
    if (!knowledge) {
      throw new Error(`${spec} 지식이 없습니다.`);
    }

    const guide = {
      title: `${spec} 장비 가이드`,
      bis: {
        title: 'Best in Slot 리스트',
        items: knowledge.bisGear || [],
        source: '획득처 및 우선순위'
      },
      trinkets: {
        title: '장신구 우선순위',
        raid: knowledge.trinkets?.raid || [],
        mythicPlus: knowledge.trinkets?.mythicPlus || []
      },
      tierSet: {
        title: '티어 세트',
        pieces: '2세트 / 4세트 효과',
        priority: '획득 우선순위'
      },
      crafted: {
        title: '제작 아이템',
        recommendations: '추천 제작 아이템 및 스탯'
      }
    };

    return guide;
  }

  // 쐐기 가이드 생성
  async generateMythicPlusGuide(persona, spec, context) {
    const guide = {
      title: `${spec} 쐐기 가이드`,
      overview: '쐐기 던전에서의 역할과 전략',
      routes: {
        title: '추천 루트',
        dungeons: this.getMythicPlusRoutes(spec)
      },
      affixes: {
        title: '어픽스별 대응',
        strategies: this.getAffixStrategies(spec)
      },
      utility: {
        title: '유틸기 활용',
        interrupts: '차단 우선순위',
        cc: '군중제어 활용법',
        defensives: '생존기 타이밍'
      },
      tips: [
        '풀링 최적화',
        '쿨다운 관리',
        '팀 시너지 활용'
      ]
    };

    return guide;
  }

  // 레이드 가이드 생성
  async generateRaidGuide(persona, spec, context) {
    const guide = {
      title: `${spec} 레이드 가이드`,
      bosses: {
        title: '보스별 공략',
        strategies: this.getRaidBossStrategies(spec)
      },
      positioning: {
        title: '포지셔닝',
        general: '일반적인 위치 선정',
        specific: '특정 보스 위치'
      },
      cooldownUsage: {
        title: '쿨다운 타이밍',
        offensive: '공격 쿨다운',
        defensive: '생존 쿨다운'
      },
      assignments: {
        title: '역할 분담',
        priority: '우선순위 타겟',
        mechanics: '기믹 담당'
      }
    };

    return guide;
  }

  // PvP 가이드 생성
  async generatePvPGuide(persona, spec, context) {
    const guide = {
      title: `${spec} PvP 가이드`,
      compositions: {
        title: '추천 조합',
        arena2v2: '2대2 아레나',
        arena3v3: '3대3 아레나',
        rbg: '평점제 전장'
      },
      strategies: {
        title: '전략',
        offensive: '공격 전략',
        defensive: '방어 전략',
        positioning: '포지셔닝'
      },
      macros: {
        title: '필수 매크로',
        target: '타겟 매크로',
        arena: '아레나 매크로',
        utility: '유틸 매크로'
      },
      matchups: {
        title: '상대별 대응법',
        counters: '카운터 직업',
        favorable: '유리한 매치업'
      }
    };

    return guide;
  }

  // 핵심 특성 추출
  extractKeyTalents(talentString) {
    // 특성 문자열에서 핵심 특성 추출 로직
    // 실제 구현은 특성 데이터베이스와 연동 필요
    return [
      '핵심 특성 1',
      '핵심 특성 2',
      '핵심 특성 3'
    ];
  }

  // 쐐기 루트 정보
  getMythicPlusRoutes(spec) {
    // 전문화별 추천 루트
    return {
      '아라칼': '효율적인 풀링 경로',
      '도시': '스킵 가능 구간',
      '석양': '타이머 단축 팁'
    };
  }

  // 어픽스 대응법
  getAffixStrategies(spec) {
    return {
      '강화': '우선 처치 대상',
      '괴사': '해제 타이밍',
      '화산': '안전 지대 활용'
    };
  }

  // 레이드 보스 전략
  getRaidBossStrategies(spec) {
    return {
      '울그락스': '포지션 및 쿨다운 타이밍',
      '혈속': '광역 딜 극대화',
      '식충왕': '이동 패턴 최적화'
    };
  }

  // HTML 포맷으로 가이드 생성
  async generateHTMLGuide(className, spec, guideType) {
    const result = await this.generateGuide({ className, spec, guideType });

    if (!result.success) {
      return `<div class="error">가이드 생성 실패: ${result.error}</div>`;
    }

    const guide = result.guide;
    let html = `
      <div class="ai-generated-guide">
        <div class="guide-header">
          <h2>${guide.title}</h2>
          <div class="guide-metadata">
            <span class="generator">생성자: ${guide.metadata.generatedBy}</span>
            <span class="confidence">신뢰도: ${Math.round(guide.metadata.confidence * 100)}%</span>
            <span class="version">버전: ${guide.metadata.version}</span>
          </div>
        </div>
        <div class="guide-content">
    `;

    // 섹션별 HTML 생성
    for (const [key, section] of Object.entries(guide.sections || {})) {
      html += `
        <div class="guide-section">
          <h3>${section.title}</h3>
          <div class="section-content">
      `;

      if (Array.isArray(section.steps)) {
        html += '<ol class="guide-steps">';
        for (const step of section.steps) {
          html += `<li>${step}</li>`;
        }
        html += '</ol>';
      }

      if (section.tips) {
        html += `<p class="section-tips">${section.tips}</p>`;
      }

      html += `
          </div>
        </div>
      `;
    }

    // 팁 섹션
    if (guide.tips && guide.tips.length > 0) {
      html += `
        <div class="guide-tips">
          <h3>고급 팁</h3>
          <ul>
      `;
      for (const tip of guide.tips) {
        html += `<li>${tip}</li>`;
      }
      html += `
          </ul>
        </div>
      `;
    }

    html += `
        </div>
      </div>
    `;

    return html;
  }
}

// 싱글톤 인스턴스
const personaGuideGenerator = new PersonaGuideGenerator();

export default personaGuideGenerator;