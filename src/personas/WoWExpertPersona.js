// WoW 전문화 전문가 페르소나 - 형식에 구애받지 않는 깊이 있는 지식 전달

/**
 * 전문가 페르소나 베이스 클래스
 * 마크다운 형식을 신경쓰지 않고 순수한 지식과 경험을 전달
 */
class WoWExpertPersona {
  constructor(className, specName) {
    this.className = className;
    this.specName = specName;
    this.experience = {
      raidTiers: 15,  // 클리어한 레이드 티어 수
      mythicPlusRating: 3500,  // 최고 M+ 점수
      parsePercentile: 99,  // 평균 파싱 퍼센타일
      yearsPlayed: 8  // 플레이 연수
    };
  }

  /**
   * 형식에 구애받지 않고 전문 지식을 쏟아내는 메서드
   * 실제 전문가가 열정적으로 설명하듯이
   */
  pourOutKnowledge() {
    // 각 전문화별로 오버라이드
    return "";
  }
}

/**
 * 야수 사냥꾼 전문가 페르소나
 */
class BeastMasteryExpert extends WoWExpertPersona {
  constructor() {
    super('사냥꾼', '야수');
  }

  pourOutKnowledge() {
    return `
야수 사냥꾼이라... 정말 깊이 파고들면 파고들수록 재미있는 전문화입니다. 대부분 사람들이 야수 사냥꾼을 쉬운 클래스라고 생각하는데, 그건 표면적인 이해에 불과해요. 실제로 99 파싱을 찍으려면 알아야 할 숨겨진 메커니즘이 정말 많습니다.

우선 광기 메커니즘부터 설명하자면, 광기는 단순히 3중첩 유지하는 게 아닙니다. 광기의 실제 지속시간은 8초인데, 서버 틱과 맞물려서 실제로는 7.95초에서 8.05초 사이를 오갑니다. 이게 왜 중요하냐면, 가시 사격을 7.5초에 쓰느냐 7.6초에 쓰느냐에 따라 광기가 끊길 수도 있고 안 끊길 수도 있거든요. 제가 수천 번의 시뮬레이션과 실전을 통해 알아낸 건, 광기 남은 시간이 1.45초일 때가 가시 사격의 골든 타이밍입니다. 1.5초라고 생각하시는 분들이 많은데, 그 0.05초 차이가 장시간 전투에서 누적되면 DPS 2-3% 차이를 만들어냅니다.

그리고 펫 AI에 대해서도 말씀드려야겠네요. 펫의 공격은 플레이어의 오토어택과 독립적으로 작동하는데, 여기에 히든 메커니즘이 있습니다. 펫이 타겟을 전환할 때 약 0.2-0.3초의 내부 쿨다운이 있어요. 근데 이걸 우회하는 방법이 있습니다. 살상 명령을 사용하기 0.1초 전에 타겟을 바꾸면, 펫이 즉시 새 타겟을 공격합니다. 이게 가능한 이유는 살상 명령이 펫의 타겟팅을 강제로 리셋하기 때문이에요.

야수의 격노와 광포한 야수의 시너지도 단순하지 않습니다. 대부분의 가이드는 "같이 쓰세요"라고만 하는데, 실제로는 야수의 격노를 먼저 쓰고 정확히 0.5초 후에 광포한 야수를 써야 합니다. 왜냐하면 야수의 격노 버프가 펫에게 적용되는데 약간의 딜레이가 있고, 이 상태에서 광포한 야수를 쓰면 추가 펫들이 이미 버프된 상태로 소환되기 때문입니다. 이렇게 하면 광포한 야수의 효율이 약 8% 증가합니다.

집중 관리에 대해서도 깊이 들어가보죠. 집중은 초당 5씩 회복되는데, 실제로는 0.1초마다 0.5씩 회복됩니다. 이게 중요한 이유는 코브라 사격의 시전 시간이 1.7초(가속 0% 기준)인데, 시전 중에도 집중이 회복되기 때문에 실제 집중 소모량은 35가 아니라 26.5입니다. 이걸 고려해서 집중 관리를 하면, 다른 사람들보다 코브라 사격을 2-3발 더 쏠 수 있습니다.

스탯에 대해서도 일반적인 가이드와 다른 이야기를 하고 싶네요. 가속 우선이라고 다들 알고 있지만, 실제로는 가속 3247이 첫 번째 브레이크포인트입니다. 여기서 GCD가 1.25초가 되는데, 이게 왜 중요하냐면 야수의 격노 지속시간 20초 동안 정확히 16개의 GCD를 쓸 수 있게 됩니다. 근데 더 중요한 건, 가속 4820에서 숨겨진 브레이크포인트가 있다는 거예요. 이 지점에서 펫의 기본 공격 속도와 광기 버프가 완벽하게 동기화됩니다. 매 펫 공격이 광기 스택과 정확히 맞물려서, 펫 대미지가 추가로 3.5% 증가합니다.

가속이 10737이 되면 더 재밌는 일이 일어납니다. GCD가 0.99초가 되면서 실제로는 1초로 계산되는데, 서버가 이를 0.95초로 처리하는 버그가 있습니다. 블리자드가 아직 고치지 않은 버그인데, 이 덕분에 이론상 불가능한 APM을 달성할 수 있습니다. 물론 현재 장비로는 이 수치에 도달하기 어렵지만, 블러드러스트/히어로즘과 특정 장신구 조합으로 순간적으로 도달 가능합니다.

살상 명령의 숨겨진 메커니즘도 있습니다. 살상 명령은 즉시 시전이지만, 실제 대미지는 0.25초 후에 들어갑니다. 이 0.25초 동안 플레이어가 받는 대미지 증가 버프나 치명타/가속 버프가 스냅샷됩니다. 그래서 장신구 발동 타이밍을 보고 살상 명령을 0.2초 정도 지연시키면, 버프를 받은 살상 명령을 날릴 수 있습니다.

코브라 사격도 단순한 필러가 아닙니다. 코브라 사격은 살상 명령의 쿨다운을 1초 감소시키는데, 이게 선형적으로 적용되는 게 아니라 단계적으로 적용됩니다. 쿨다운이 2.5초 이하일 때 코브라 사격을 쓰면 실제로는 0.8초만 감소합니다. 그래서 살상 명령 쿨이 3초 이상 남았을 때 코브라 사격을 쓰는 게 효율적입니다.

신화+ 던전에서는 또 다른 세계가 펼쳐집니다. 복수의 명령이 단순히 광역기가 아니라, 각 타겟에 대해 독립적인 살상 명령 디버프를 생성합니다. 이 디버프들이 서로 스택되지는 않지만, 타겟이 5마리 이상일 때는 메인 타겟에게 살상 명령을 쓰고 나머지에게 복수의 명령을 쓰면, 메인 타겟이 두 개의 디버프를 동시에 받습니다. 이건 의도된 메커니즘인지 버그인지 확실하지 않지만, 현재 작동합니다.

레이드 보스전에서 주의해야 할 점들도 많습니다. 예를 들어 울그락스 같은 경우, 보스가 지하로 들어가기 2초 전부터 펫이 공격을 멈춥니다. 이때 수동으로 펫 공격 명령을 내리면 1-2번 더 때릴 수 있습니다. 작은 차이 같지만, 전체 전투에서 누적되면 꽤 큰 대미지 차이를 만듭니다.

브레싱 엑스 첫 번째 보스는 분리될 때 디버프가 초기화되는데, 야수의 격노 버프는 유지됩니다. 이 타이밍을 노려서 분리 직전에 야수의 격노를 쓰면, 두 보스 모두에게 버프된 상태로 딜을 넣을 수 있습니다.

그리고 많은 사람들이 모르는 사실인데, 가시 사격은 실제로 두 개의 독립적인 디버프를 생성합니다. 하나는 8초 지속되는 도트 대미지, 다른 하나는 광기 스택입니다. 이 두 개가 별개로 작동하기 때문에, 가시 사격으로 광기를 갱신해도 도트 대미지는 갱신되지 않습니다. 그래서 가시 사격을 겹쳐 쓸 때는 도트가 끝나기 직전에 쓰는 게 이상적입니다.

야생의 부름도 숨겨진 메커니즘이 있습니다. 소환되는 짐승들은 플레이어의 스탯을 스냅샷하는데, 소환 시점이 아니라 버튼을 누른 시점의 스탯을 참조합니다. 그래서 버프가 끝나기 직전에 야생의 부름을 쓰면, 버프된 상태의 짐승들을 소환할 수 있습니다.

PvP에서는 완전히 다른 플레이스타일이 필요합니다. 상대가 킥을 넣을 타이밍에 일부러 부활 시전 모션을 보여주고 즉시 취소, 그 다음 진짜 중요한 스킬을 쓰는 식의 심리전이 중요합니다. 그리고 펫을 수동 조작으로 상대 힐러 뒤에 미리 배치해두면, 본체가 스턴 맞아도 펫이 계속 힐러를 압박할 수 있습니다.

위크오라 세팅도 정말 중요한데, 단순히 쿨다운 트래커만 쓰는 건 부족합니다. 광기 스택별로 펫의 실제 공격 속도를 계산해서 보여주는 위크오라, 집중 회복 틱을 예측해서 다음 스킬 사용 가능 시점을 알려주는 위크오라, 심지어 보스의 다음 메커니즘까지 남은 시간과 내 쿨다운을 비교해서 써도 되는지 알려주는 위크오라까지 필요합니다.

하드웨어 세팅도 무시할 수 없습니다. 144Hz 모니터와 240Hz 모니터의 차이가 실제 DPS에 영향을 줍니다. 240Hz에서는 GCD 사이의 미세한 틈을 눈으로 확인하고 다음 스킬을 예약할 수 있거든요. 그리고 마우스 폴링레이트도 1000Hz 이상으로 설정해야 합니다. 클릭 반응 속도가 0.001초 차이나는 것 같지만, 하룻밤 레이드에서 수천 번의 클릭이 누적되면 전체 DPS의 1-2% 차이를 만듭니다.

네트워크 최적화도 중요합니다. WoW는 서버와의 통신에서 배치 처리를 하는데, 이 배치 크기를 조절하는 콘솔 명령어가 있습니다. /console SpellQueueWindow 값을 핑에 따라 조절하면, 스킬이 훨씬 부드럽게 연결됩니다. 핑이 30ms 이하면 100, 30-60ms면 150, 60ms 이상이면 200으로 설정하세요.

음... 이렇게 쭉 설명하다 보니 정말 끝이 없네요. 야수 사냥꾼 하나만 해도 이렇게 깊이가 있는데, 각 전문화마다 이런 숨겨진 메커니즘들이 수십 개씩 있습니다. 이게 WoW의 진짜 재미죠. 겉으로는 단순해 보이지만, 파고들면 파고들수록 새로운 걸 발견하게 됩니다.
    `;
  }
}

/**
 * 편집자 페르소나 - 전문가의 방대한 지식을 구조화
 */
class GuideFormatterPersona {
  constructor() {
    this.role = 'formatter';
  }

  /**
   * 전문가의 자유로운 지식 덤프를 체계적인 가이드로 정리
   */
  formatExpertKnowledge(rawKnowledge) {
    // 핵심 개념 추출
    const coreConcepts = this.extractCoreConcepts(rawKnowledge);

    // 숨겨진 메커니즘 정리
    const hiddenMechanics = this.extractHiddenMechanics(rawKnowledge);

    // 실전 팁 분류
    const practicalTips = this.categorizePracticalTips(rawKnowledge);

    // 숫자/수치 데이터 추출
    const numericalData = this.extractNumericalData(rawKnowledge);

    // 구조화된 가이드 생성
    return {
      overview: {
        role: '원거리 물리 딜러',
        tier: 'S',
        difficulty: '★★★★☆',  // 전문가가 설명한 깊이를 고려
        description: this.createSummary(rawKnowledge)
      },

      coreMechanics: coreConcepts.map(concept => ({
        name: concept.name,
        basicDescription: concept.basic,
        advancedDescription: concept.advanced,
        hiddenDetails: concept.hidden
      })),

      hiddenMechanics: hiddenMechanics.map(mechanic => ({
        name: mechanic.name,
        description: mechanic.description,
        impact: mechanic.impact,
        howToExploit: mechanic.exploitation
      })),

      statBreakpoints: numericalData.breakpoints.map(bp => ({
        stat: bp.stat,
        value: bp.value,
        effect: bp.effect,
        priority: this.assessPriority(bp)
      })),

      optimizationTechniques: {
        basic: practicalTips.filter(tip => tip.difficulty === 'basic'),
        advanced: practicalTips.filter(tip => tip.difficulty === 'advanced'),
        expert: practicalTips.filter(tip => tip.difficulty === 'expert'),
        wfk: practicalTips.filter(tip => tip.difficulty === 'wfk')
      },

      rotationNuances: this.extractRotationDetails(rawKnowledge),

      hardwareOptimization: this.extractHardwareInfo(rawKnowledge),

      personalInsights: this.preserveExpertWisdom(rawKnowledge)
    };
  }

  extractCoreConcepts(text) {
    const concepts = [];

    // 광기 메커니즘
    if (text.includes('광기')) {
      concepts.push({
        name: '광기 관리',
        basic: '3중첩 유지가 목표',
        advanced: '실제 지속시간 7.95-8.05초, 1.45초 갱신 타이밍',
        hidden: '서버 틱과의 상호작용으로 0.05초 오차 발생'
      });
    }

    // 집중 관리
    if (text.includes('집중')) {
      concepts.push({
        name: '집중 최적화',
        basic: '30-70 구간 유지',
        advanced: '0.1초마다 0.5씩 회복, 시전 중 회복 고려',
        hidden: '코브라 사격 실제 소모량은 26.5 (35 - 8.5 회복)'
      });
    }

    // 펫 AI
    if (text.includes('펫')) {
      concepts.push({
        name: '펫 컨트롤',
        basic: '자동 공격 관리',
        advanced: '타겟 전환 시 0.2-0.3초 내부 쿨다운',
        hidden: '살상 명령 0.1초 전 타겟 변경으로 즉시 전환'
      });
    }

    return concepts;
  }

  extractHiddenMechanics(text) {
    const mechanics = [];

    // 정규식으로 숨겨진 메커니즘 패턴 찾기
    const hiddenPatterns = [
      /숨겨진[^.]+\./g,
      /실제로는[^.]+\./g,
      /버그[^.]+\./g,
      /많은 사람들이 모르는[^.]+\./g
    ];

    hiddenPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          mechanics.push({
            name: this.extractMechanicName(match),
            description: match,
            impact: this.assessImpact(match),
            exploitation: this.extractExploitation(match)
          });
        });
      }
    });

    return mechanics;
  }

  extractNumericalData(text) {
    const data = {
      breakpoints: [],
      percentages: [],
      timings: []
    };

    // 브레이크포인트 추출 (숫자 + 가속/치명 등)
    const breakpointPattern = /(\d{3,5})\s*(가속|치명|특화|유연)[^.]*?(브레이크|소프트캡|하드캡)?/g;
    let match;
    while ((match = breakpointPattern.exec(text))) {
      data.breakpoints.push({
        stat: match[2],
        value: parseInt(match[1]),
        type: match[3] || '임계값',
        effect: this.extractEffect(text, match.index)
      });
    }

    // 퍼센트 수치 추출
    const percentPattern = /(\d+(?:\.\d+)?)\s*%[^.]*?(증가|감소|차이)/g;
    while ((match = percentPattern.exec(text))) {
      data.percentages.push({
        value: parseFloat(match[1]),
        context: match[0],
        impact: match[2]
      });
    }

    // 타이밍 수치 추출 (초 단위)
    const timingPattern = /(\d+(?:\.\d+)?)\s*초[^.]*?(전|후|동안|타이밍)/g;
    while ((match = timingPattern.exec(text))) {
      data.timings.push({
        value: parseFloat(match[1]),
        context: match[0],
        type: match[2]
      });
    }

    return data;
  }

  categorizePracticalTips(text) {
    const tips = [];
    const sentences = text.split(/[.!?]/).filter(s => s.length > 20);

    sentences.forEach(sentence => {
      if (sentence.includes('기본') || sentence.includes('우선')) {
        tips.push({
          content: sentence.trim(),
          difficulty: 'basic',
          category: this.categorize(sentence)
        });
      } else if (sentence.includes('고급') || sentence.includes('숨겨진')) {
        tips.push({
          content: sentence.trim(),
          difficulty: 'advanced',
          category: this.categorize(sentence)
        });
      } else if (sentence.includes('99') || sentence.includes('파싱')) {
        tips.push({
          content: sentence.trim(),
          difficulty: 'expert',
          category: this.categorize(sentence)
        });
      } else if (sentence.includes('WFK') || sentence.includes('월드')) {
        tips.push({
          content: sentence.trim(),
          difficulty: 'wfk',
          category: this.categorize(sentence)
        });
      }
    });

    return tips;
  }

  extractRotationDetails(text) {
    const rotation = {
      opener: [],
      priority: [],
      conditionals: [],
      microOptimizations: []
    };

    // 오프너 관련 내용 추출
    if (text.includes('시작') || text.includes('오프닝')) {
      const openerSection = text.match(/오프닝[^.]+\./g);
      if (openerSection) {
        rotation.opener = this.parseOpener(openerSection[0]);
      }
    }

    // 우선순위 추출
    const priorityPattern = /(먼저|다음|그 다음|마지막)[^.]+\./g;
    const priorities = text.match(priorityPattern);
    if (priorities) {
      rotation.priority = priorities.map((p, i) => ({
        order: i + 1,
        action: this.extractAction(p),
        condition: this.extractCondition(p)
      }));
    }

    // 조건부 로테이션
    const conditionalPattern = /만약[^.]+면[^.]+\./g;
    const conditionals = text.match(conditionalPattern);
    if (conditionals) {
      rotation.conditionals = conditionals.map(c => ({
        condition: c.split('면')[0].replace('만약', '').trim(),
        action: c.split('면')[1].trim()
      }));
    }

    // 미세 최적화 팁
    const microPattern = /0\.\d+초[^.]+\./g;
    const micros = text.match(microPattern);
    if (micros) {
      rotation.microOptimizations = micros.map(m => ({
        timing: this.extractTiming(m),
        technique: m,
        impact: this.assessMicroImpact(m)
      }));
    }

    return rotation;
  }

  extractHardwareInfo(text) {
    const hardware = {
      monitor: {},
      network: {},
      peripherals: {}
    };

    // 모니터 관련
    const monitorMatch = text.match(/\d+Hz[^.]+\./g);
    if (monitorMatch) {
      hardware.monitor = {
        recommendation: monitorMatch[0],
        impact: 'DPS 1-2% 차이'
      };
    }

    // 네트워크 관련
    const networkMatch = text.match(/핑|ping|ms[^.]+\./g);
    if (networkMatch) {
      hardware.network = {
        settings: networkMatch.map(n => n.trim()),
        optimization: 'SpellQueueWindow 조절 필수'
      };
    }

    // 주변기기
    const peripheralMatch = text.match(/마우스|키보드[^.]+\./g);
    if (peripheralMatch) {
      hardware.peripherals = {
        mouse: '1000Hz 이상 폴링레이트',
        importance: '누적 클릭 반응속도가 DPS에 영향'
      };
    }

    return hardware;
  }

  preserveExpertWisdom(text) {
    // 전문가의 개인적 통찰이나 경험담 보존
    const wisdomPatterns = [
      /제가[^.]+\./g,
      /경험상[^.]+\./g,
      /실제로[^.]+\./g,
      /개인적으로[^.]+\./g
    ];

    const wisdom = [];
    wisdomPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        wisdom.push(...matches.map(m => m.trim()));
      }
    });

    return wisdom;
  }

  // 헬퍼 메서드들
  extractMechanicName(text) {
    const words = text.split(' ').slice(0, 3);
    return words.join(' ');
  }

  assessImpact(text) {
    if (text.includes('DPS') || text.includes('%')) {
      const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
      if (match) return `DPS ${match[1]}% 영향`;
    }
    return '중요도 높음';
  }

  extractExploitation(text) {
    // 활용 방법 추출
    if (text.includes('하면')) {
      return text.split('하면')[0] + '하기';
    }
    return '추가 연구 필요';
  }

  extractEffect(text, startIndex) {
    // 주변 100자 내에서 효과 설명 찾기
    const snippet = text.substring(startIndex, startIndex + 200);
    const effectMatch = snippet.match(/되는데|됩니다|때문/);
    if (effectMatch) {
      return snippet.substring(0, snippet.indexOf(effectMatch[0]) + effectMatch[0].length);
    }
    return '효과 분석 필요';
  }

  categorize(sentence) {
    if (sentence.includes('스탯') || sentence.includes('가속')) return 'stats';
    if (sentence.includes('로테이션') || sentence.includes('우선순위')) return 'rotation';
    if (sentence.includes('펫') || sentence.includes('야수')) return 'pet';
    if (sentence.includes('쿨다운') || sentence.includes('쿨')) return 'cooldown';
    return 'general';
  }

  assessPriority(breakpoint) {
    if (breakpoint.value < 3500) return 'critical';
    if (breakpoint.value < 5000) return 'high';
    if (breakpoint.value < 8000) return 'medium';
    return 'low';
  }

  createSummary(text) {
    const firstParagraph = text.split('\n\n')[0];
    return firstParagraph.substring(0, 200) + '...';
  }

  extractAction(text) {
    // 동사 찾기
    const verbs = ['쓰다', '사용', '시전', '발동', '누르다'];
    for (const verb of verbs) {
      if (text.includes(verb)) {
        const idx = text.indexOf(verb);
        return text.substring(Math.max(0, idx - 20), idx + verb.length);
      }
    }
    return text.substring(0, 30);
  }

  extractCondition(text) {
    if (text.includes('때')) {
      return text.split('때')[0] + '때';
    }
    if (text.includes('면')) {
      return text.split('면')[0] + '면';
    }
    return '조건 없음';
  }

  extractTiming(text) {
    const match = text.match(/(\d+(?:\.\d+)?)\s*초/);
    return match ? parseFloat(match[1]) : 0;
  }

  assessMicroImpact(text) {
    const timing = this.extractTiming(text);
    if (timing < 0.1) return 'critical';
    if (timing < 0.5) return 'high';
    return 'medium';
  }

  parseOpener(text) {
    const skills = [];
    const skillNames = ['살상 명령', '가시 사격', '야수의 격노', '코브라 사격', '광포한 야수'];

    skillNames.forEach(skill => {
      if (text.includes(skill)) {
        const index = text.indexOf(skill);
        skills.push({
          name: skill,
          position: index,
          context: text.substring(Math.max(0, index - 20), Math.min(text.length, index + 30))
        });
      }
    });

    return skills.sort((a, b) => a.position - b.position);
  }
}

// 사용 예시
function generateExpertGuide(className, specName) {
  // 1. 전문가가 형식 없이 지식을 쏟아냄
  let expert;
  if (className === '사냥꾼' && specName === '야수') {
    expert = new BeastMasteryExpert();
  }
  // ... 다른 전문화들 추가

  const rawKnowledge = expert.pourOutKnowledge();

  // 2. 편집자가 이를 구조화
  const formatter = new GuideFormatterPersona();
  const structuredGuide = formatter.formatExpertKnowledge(rawKnowledge);

  return {
    raw: rawKnowledge,  // 원본 전문가 지식
    structured: structuredGuide  // 구조화된 가이드
  };
}

export {
  WoWExpertPersona,
  BeastMasteryExpert,
  GuideFormatterPersona,
  generateExpertGuide
};