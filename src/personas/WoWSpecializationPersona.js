// WoW 전문화 전문가 페르소나 시스템

/**
 * 전문화별 페르소나 베이스 클래스
 * 각 페르소나는 자신의 전문화에 대해 자연스러운 설명으로 가이드를 작성
 */
class SpecializationPersona {
  constructor(className, specName) {
    this.className = className;
    this.specName = specName;
    this.expertise = {
      gameKnowledge: 0.95,  // 게임 지식 수준 (0-1)
      writingStyle: 'conversational',  // 글쓰기 스타일
      perspective: 'experienced_player'  // 관점
    };
  }

  /**
   * 자연스러운 글로 전문화 설명을 작성
   * @returns {string} 대화체 가이드 텍스트
   */
  writeNaturalGuide() {
    return `
      안녕하세요, ${this.className} ${this.specName} 전문화를 플레이하는 분들께 제 경험을 공유하고자 합니다.

      저는 이 전문화로 수많은 레이드를 클리어하고 신화+ 던전을 돌면서 터득한 노하우를
      여러분과 나누고 싶어요. 처음에는 저도 많이 헤맸지만, 지금은 자신있게 말할 수 있습니다.

      [구체적인 내용은 각 전문화 페르소나에서 구현]
    `;
  }

  /**
   * 개인적인 경험과 팁 공유
   */
  sharePersonalExperience() {
    // 각 페르소나가 오버라이드
  }

  /**
   * 실수와 교훈 공유
   */
  shareMistakesAndLessons() {
    // 각 페르소나가 오버라이드
  }
}

/**
 * 야수 사냥꾼 페르소나
 */
class BeastMasteryHunterPersona extends SpecializationPersona {
  constructor() {
    super('사냥꾼', '야수');
    this.personality = {
      tone: 'friendly',
      enthusiasm: 'high',
      teaching_style: 'example_based'
    };
  }

  writeNaturalGuide() {
    return `
    야수 사냥꾼 가이드 - 펫과 함께하는 모험

    안녕하세요! 저는 야수 사냥꾼을 5년째 메인으로 플레이하고 있는 플레이어입니다.
    처음에는 "펫이나 데리고 다니는 쉬운 클래스겠지"라고 생각했는데, 알고보니 정말 깊이가 있더라구요.

    ## 제가 야수 사냥꾼을 사랑하는 이유

    솔직히 말씀드리면, 이동하면서 100% 딜을 넣을 수 있다는 점이 정말 매력적이에요.
    다른 클래스 친구들이 "아 무빙 때문에 딜 못 넣었어"라고 할 때, 저는 그냥 웃으면서
    계속 딜을 넣고 있죠. 특히 신화+에서 이 장점이 정말 빛을 발합니다.

    ## 광기 관리의 핵심

    많은 분들이 광기 3중첩 유지를 어려워하시는데, 제가 깨달은 건 이거예요:
    "완벽하게 3중첩을 유지하려고 하지 마세요. 2-3 사이를 오가는 게 정상입니다."

    처음엔 저도 광기가 2중첩으로 떨어질 때마다 스트레스 받았어요. 근데 로그 분석해보니
    상위 플레이어들도 평균 2.7중첩 정도더라구요. 중요한 건 야수의 격노 타이밍에
    3중첩을 맞추는 거예요.

    ## 집중 관리 꿀팁

    제가 초보 때 가장 많이 실수한 게 집중 관리였어요. 막 코브라 사격 남발하다가
    살상 명령 쿨 돌아왔는데 집중이 없어서 못 쓰는 경우가 많았죠.

    지금은 이렇게 합니다:
    - 집중 30-70 구간을 "안전지대"로 생각해요
    - 80 넘어가면 즉시 코브라 사격으로 소비
    - 30 아래로 떨어지면 잠시 기다리면서 회복

    이렇게 하니까 딜 사이클이 훨씬 부드러워졌어요.

    ## 쿨다운 정렬의 예술

    야수의 격노와 광포한 야수를 언제 쓸지 고민 많으시죠?
    저는 이렇게 생각해요: "2분 쿨은 아끼지 말고 쓰자, 어차피 보스전에 2-3번은 쓴다"

    특히 광포한 야수는 야수의 격노랑 무조건 같이 써요. 따로 쓰면 시너지가 없어서
    효율이 떨어지거든요. 이게 제가 DPS 10만 더 뽑는 비결이에요.

    ## 펫 선택과 관리

    펫은 솔직히 취향인데, 저는 정령 야수(유혈 광선 디버프)를 선호해요.
    특히 신화+에서는 유혈 광선이 탱커한테도 도움되고, 파티 전체 딜에도 기여하거든요.

    펫 위치 조정도 중요해요. 보스가 이동하기 전에 미리 펫을 보내두면
    이동 후에도 계속 딜을 넣을 수 있어요. 이건 연습이 필요한데, 익숙해지면
    정말 큰 차이를 만들어냅니다.

    ## 제가 실수했던 것들

    1. 가시 사격을 아껴두는 실수 - 충전 2개 되면 바로 하나는 써주세요
    2. 쐐기 돌풍 타이밍 - 광기 끊기기 직전이 아니라 1초 전에 써야 안전해요
    3. 살상 명령 우선순위 - 이거 쿨마다 안 쓰면 DPS가 눈에 띄게 떨어져요

    ## 신화+ 꿀팁

    신화+에서는 복수의 명령이 정말 중요해요. 3마리 이상일 때는 살상 명령보다
    복수의 명령 우선순위가 높다는 거 잊지 마세요.

    그리고 폭발 주간에는 펫으로 폭발물 처리하는 게 가능해요.
    매크로 만들어두면 편합니다: /petattack [@mouseover,harm][@target]

    ## 레이드에서의 포지셔닝

    야수 사냥꾼의 가장 큰 장점은 포지셔닝 자유도예요.
    하지만 이게 함정이기도 해요. "어디서든 딜 가능 = 아무데나 있어도 된다"가 아니에요.

    저는 항상 다음 메커니즘을 대비해서 미리 자리를 잡아둡니다.
    예를 들어 곧 광역 데미지가 올 것 같으면 힐러 근처로 슬슬 이동하고,
    탱커가 보스 위치 바꿀 것 같으면 미리 반대편으로 이동해둬요.

    ## 위크오라 필수 설정

    제가 쓰는 위크오라 중에 정말 필수인 것들:
    1. 광기 타이머 (숫자로 남은 시간 표시)
    2. 집중 바 (색깔로 구간 표시)
    3. 가시 사격 충전 수
    4. 야수의 격노 CD 및 지속시간

    이것만 있어도 딜 사이클 관리가 훨씬 쉬워져요.

    ## 마치며

    야수 사냥꾼은 쉽게 시작할 수 있지만, 마스터하기는 어려운 클래스예요.
    하지만 그만큼 보람도 크고, 무엇보다 펫과 함께하는 재미가 있죠.

    제 경험이 도움이 되었으면 좋겠고, 혹시 궁금한 점이 있으면 언제든 물어보세요.
    우리 모두 펫과 함께 즐거운 사냥 되시길 바랍니다!

    행운을 빕니다, 사냥꾼 여러분!
    `;
  }

  sharePersonalExperience() {
    return `
    제가 야수 사냥꾼으로 첫 신화 +20을 깼을 때의 이야기를 들려드릴게요.

    그때 저희 파티는 정말 아슬아슬했어요. 마지막 보스에서 시간이 10초 남았는데,
    탱커가 죽었죠. 그 순간 제 펫(곰)한테 탱킹을 시키면서 터틀(거북이)로 교체하고,
    생존기 돌리면서 버텼어요. 그 10초 동안 최고의 집중력을 발휘했고,
    결국 시간 내에 클리어했죠.

    그때 깨달은 게, 야수 사냥꾼은 단순한 딜러가 아니라는 거예요.
    위기 상황에서 파티를 구할 수 있는 다재다능한 클래스라는 걸 알게 됐죠.
    `;
  }
}

/**
 * 가이드 편집자 페르소나
 * 전문화 페르소나가 작성한 자연스러운 글을 구조화된 공략으로 변환
 */
class GuideEditorPersona {
  constructor() {
    this.role = 'editor';
    this.skills = {
      structuring: 0.95,
      formatting: 0.90,
      dataExtraction: 0.88,
      consistency: 0.92
    };
  }

  /**
   * 자연스러운 글을 구조화된 가이드 데이터로 변환
   * @param {string} naturalText - 페르소나가 작성한 자연스러운 글
   * @returns {object} 구조화된 가이드 데이터
   */
  convertToStructuredGuide(naturalText) {
    // 텍스트에서 핵심 정보 추출
    const sections = this.extractSections(naturalText);
    const mechanics = this.extractMechanics(naturalText);
    const tips = this.extractTips(naturalText);
    const stats = this.extractStats(naturalText);
    const rotation = this.extractRotation(naturalText);

    return {
      overview: {
        description: this.extractDescription(sections),
        role: this.identifyRole(naturalText),
        tier: this.assessTier(naturalText),
        difficulty: this.assessDifficulty(naturalText),
        strengths: this.extractStrengths(naturalText),
        weaknesses: this.extractWeaknesses(naturalText)
      },
      mechanics: {
        resources: this.extractResources(mechanics),
        coreMechanics: this.formatCoreMechanics(mechanics)
      },
      stats: {
        priority: this.formatStatPriority(stats),
        recommendations: this.extractRecommendations(stats)
      },
      rotation: {
        opener: this.formatOpener(rotation),
        priority: this.formatPriorityList(rotation),
        cooldowns: this.formatCooldowns(rotation)
      },
      tips: {
        mythicplus: this.categorizeTips(tips, 'mythicplus'),
        raid: this.categorizeTips(tips, 'raid'),
        general: this.categorizeTips(tips, 'general')
      },
      personalTouch: {
        authorNote: this.preservePersonalNote(naturalText),
        experiences: this.extractPersonalStories(naturalText)
      }
    };
  }

  /**
   * 섹션 추출
   */
  extractSections(text) {
    const sections = {};
    const sectionRegex = /##\s+(.+?)\n([\s\S]*?)(?=\n##|$)/g;
    let match;

    while ((match = sectionRegex.exec(text)) !== null) {
      sections[match[1].trim()] = match[2].trim();
    }

    return sections;
  }

  /**
   * 핵심 메커니즘 추출
   */
  extractMechanics(text) {
    const mechanics = [];

    // 광기, 집중, 쿨다운 등 핵심 메커니즘 패턴 찾기
    const mechanicPatterns = [
      /광기.*?(\d+중첩|관리|유지)/gi,
      /집중.*?(\d+[-~]\d+|관리|회복)/gi,
      /쿨다운.*?(정렬|타이밍|사용)/gi
    ];

    mechanicPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        mechanics.push(...matches);
      }
    });

    return mechanics;
  }

  /**
   * 팁 추출 및 분류
   */
  extractTips(text) {
    const tips = [];

    // 번호 리스트, 불릿 포인트 등에서 팁 추출
    const tipPatterns = [
      /\d+\.\s+(.+?)(?=\n\d+\.|\n\n|$)/g,
      /[-•]\s+(.+?)(?=\n[-•]|\n\n|$)/g,
      /꿀팁[:\s]+(.+?)(?=\n|$)/gi
    ];

    tipPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        tips.push(match[1].trim());
      }
    });

    return tips;
  }

  /**
   * 스탯 우선순위 추출
   */
  extractStats(text) {
    const stats = {};

    // "가속 > 치명 > 특화" 같은 패턴 찾기
    const statPattern = /(가속|치명타?|특화|유연성?|민첩|힘|지능).*?[>＞]/gi;
    const matches = text.match(statPattern);

    if (matches) {
      stats.priority = matches[0];
    }

    // 수치 정보 추출
    const numberPattern = /(\d{3,4})\s*(가속|치명|특화)/g;
    let match;
    while ((match = numberPattern.exec(text)) !== null) {
      stats[match[2]] = match[1];
    }

    return stats;
  }

  /**
   * 로테이션 추출
   */
  extractRotation(text) {
    const rotation = {
      opener: [],
      priority: [],
      cooldowns: []
    };

    // 오프닝, 우선순위, 쿨다운 섹션 찾기
    const openerSection = text.match(/오프닝.*?[\s\S]*?(?=\n##|$)/i);
    const prioritySection = text.match(/우선순위.*?[\s\S]*?(?=\n##|$)/i);
    const cooldownSection = text.match(/쿨다운.*?[\s\S]*?(?=\n##|$)/i);

    // 각 섹션에서 스킬 순서 추출
    if (openerSection) {
      const skills = this.extractSkillSequence(openerSection[0]);
      rotation.opener = skills;
    }

    if (prioritySection) {
      const priorities = this.extractPriorityList(prioritySection[0]);
      rotation.priority = priorities;
    }

    if (cooldownSection) {
      const cooldowns = this.extractCooldownInfo(cooldownSection[0]);
      rotation.cooldowns = cooldowns;
    }

    return rotation;
  }

  /**
   * 개인적인 이야기 보존
   */
  extractPersonalStories(text) {
    const stories = [];

    // "제가", "저는", "제 경험" 등으로 시작하는 문단 찾기
    const personalPattern = /(제가|저는|제 경험|저의)[\s\S]{20,200}/g;
    let match;

    while ((match = personalPattern.exec(text)) !== null) {
      stories.push({
        content: match[0],
        type: this.categorizeStory(match[0])
      });
    }

    return stories;
  }

  /**
   * 구조화된 데이터를 깔끔한 마크다운으로 포맷팅
   */
  formatAsMarkdown(structuredData) {
    let markdown = `# ${structuredData.className} ${structuredData.specName} 가이드\n\n`;

    // 개요
    markdown += `## 개요\n`;
    markdown += `- **역할**: ${structuredData.overview.role}\n`;
    markdown += `- **티어**: ${structuredData.overview.tier}\n`;
    markdown += `- **난이도**: ${structuredData.overview.difficulty}\n\n`;

    // 설명
    markdown += `${structuredData.overview.description}\n\n`;

    // 강점과 약점
    markdown += `### 강점\n`;
    structuredData.overview.strengths.forEach(strength => {
      markdown += `- ${strength}\n`;
    });

    markdown += `\n### 약점\n`;
    structuredData.overview.weaknesses.forEach(weakness => {
      markdown += `- ${weakness}\n`;
    });

    // ... 나머지 섹션들도 포맷팅

    return markdown;
  }

  // 헬퍼 메서드들
  extractDescription(sections) {
    // 첫 문단이나 소개 섹션에서 설명 추출
    return sections['개요'] || sections['소개'] || '전문화 설명';
  }

  identifyRole(text) {
    if (text.includes('딜러') || text.includes('DPS')) return '원거리 물리 딜러';
    if (text.includes('탱커') || text.includes('탱킹')) return '탱커';
    if (text.includes('힐러') || text.includes('치유')) return '힐러';
    return '딜러';
  }

  assessTier(text) {
    // 텍스트의 긍정적 표현 분석으로 티어 평가
    const positiveWords = (text.match(/(최고|강력|뛰어난|우수|메타)/g) || []).length;
    const negativeWords = (text.match(/(약한|어려운|부족|아쉬운)/g) || []).length;

    const score = positiveWords - negativeWords;
    if (score > 5) return 'S';
    if (score > 2) return 'A';
    if (score > 0) return 'B';
    return 'C';
  }

  assessDifficulty(text) {
    // 난이도 관련 표현 분석
    if (text.includes('쉽게 시작') || text.includes('초보자')) return '★★☆☆☆';
    if (text.includes('연습이 필요') || text.includes('익숙해지면')) return '★★★☆☆';
    if (text.includes('어려운') || text.includes('마스터하기')) return '★★★★☆';
    return '★★★☆☆';
  }

  extractStrengths(text) {
    const strengths = [];

    // 긍정적 표현 패턴
    const strengthPatterns = [
      /장점[은는이]?\s*(.+?)(?=[.。\n])/g,
      /매력[은는이]?\s*(.+?)(?=[.。\n])/g,
      /좋[은다]\s*점[은는이]?\s*(.+?)(?=[.。\n])/g
    ];

    strengthPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        strengths.push(match[1].trim());
      }
    });

    // 기본 강점 추가
    if (text.includes('100%') && text.includes('이동')) {
      strengths.push('100% 이동 중 딜 가능');
    }

    return strengths.length > 0 ? strengths : ['높은 기동성', '안정적인 딜'];
  }

  extractWeaknesses(text) {
    const weaknesses = [];

    // 부정적 표현 패턴
    const weaknessPatterns = [
      /단점[은는이]?\s*(.+?)(?=[.。\n])/g,
      /약점[은는이]?\s*(.+?)(?=[.。\n])/g,
      /어려[운움]\s*점[은는이]?\s*(.+?)(?=[.。\n])/g,
      /실수.*?(.+?)(?=[.。\n])/g
    ];

    weaknessPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        weaknesses.push(match[1].trim());
      }
    });

    return weaknesses.length > 0 ? weaknesses : ['복잡한 메커니즘', '높은 숙련도 요구'];
  }

  extractResources(mechanics) {
    const resources = {
      primary: '집중',
      secondary: null,
      tertiary: null
    };

    mechanics.forEach(mech => {
      if (mech.includes('집중')) resources.primary = '집중';
      if (mech.includes('광기')) resources.secondary = '광기';
      if (mech.includes('야수의 격노')) resources.tertiary = '야수의 격노';
    });

    return resources;
  }

  formatCoreMechanics(mechanics) {
    // 메커니즘을 구조화된 객체 배열로 변환
    return mechanics.slice(0, 3).map(mech => ({
      name: this.extractMechanicName(mech),
      description: mech,
      icon: this.guessIcon(mech)
    }));
  }

  extractMechanicName(mechText) {
    // 텍스트에서 메커니즘 이름 추출
    const match = mechText.match(/([가-힣]+)\s*(관리|유지|중첩)/);
    return match ? match[1] : '핵심 메커니즘';
  }

  guessIcon(mechText) {
    // 메커니즘 이름으로 아이콘 추측
    if (mechText.includes('광기')) return 'ability_hunter_fervor';
    if (mechText.includes('집중')) return 'ability_hunter_focusfire';
    if (mechText.includes('야수')) return 'ability_hunter_bestialdiscipline';
    return 'inv_misc_questionmark';
  }

  formatStatPriority(stats) {
    // 스탯 우선순위를 구조화된 배열로 변환
    const priorityMap = {
      '가속': { weight: 1.0, color: '#ff6b6b' },
      '치명타': { weight: 0.85, color: '#f4c430' },
      '특화': { weight: 0.75, color: '#4ecdc4' },
      '유연성': { weight: 0.65, color: '#95e77e' },
      '민첩': { weight: 0.50, color: '#868e96' }
    };

    const priority = [];
    Object.keys(priorityMap).forEach(stat => {
      if (stats.priority && stats.priority.includes(stat)) {
        priority.push({
          stat,
          ...priorityMap[stat]
        });
      }
    });

    return priority.length > 0 ? priority : Object.keys(priorityMap).map(stat => ({
      stat,
      ...priorityMap[stat]
    }));
  }

  extractRecommendations(stats) {
    // 스탯 관련 추천사항 추출
    return '가속을 최우선으로 확보하여 집중 생성과 펫 공격 속도를 최대화합니다.';
  }

  formatOpener(rotation) {
    // 오프닝 시퀀스 포맷팅
    return rotation.opener.map((skill, index) => ({
      skill: skill.name || '스킬',
      icon: skill.icon || 'inv_misc_questionmark',
      time: `${index - 2}s`
    }));
  }

  formatPriorityList(rotation) {
    // 우선순위 리스트 포맷팅
    return rotation.priority.map((item, index) => ({
      priority: index + 1,
      action: item.action || '액션',
      condition: item.condition || '조건'
    }));
  }

  formatCooldowns(rotation) {
    // 쿨다운 정보 포맷팅
    return {
      major: rotation.cooldowns.filter(cd => cd.type === 'major'),
      minor: rotation.cooldowns.filter(cd => cd.type === 'minor')
    };
  }

  extractSkillSequence(text) {
    // 텍스트에서 스킬 시퀀스 추출
    const skills = [];
    const skillPattern = /(살상 명령|가시 사격|야수의 격노|코브라 사격|광포한 야수)/g;
    let match;

    while ((match = skillPattern.exec(text)) !== null) {
      skills.push({
        name: match[1],
        icon: this.getSkillIcon(match[1])
      });
    }

    return skills;
  }

  extractPriorityList(text) {
    // 우선순위 리스트 추출
    const priorities = [];
    const lines = text.split('\n');

    lines.forEach(line => {
      const match = line.match(/\d+\.\s*(.+?):\s*(.+)/);
      if (match) {
        priorities.push({
          action: match[1].trim(),
          condition: match[2].trim()
        });
      }
    });

    return priorities;
  }

  extractCooldownInfo(text) {
    // 쿨다운 정보 추출
    const cooldowns = [];
    const cdPattern = /(야수의 격노|광포한 야수|야생의 부름).*?(\d+분?초?)/g;
    let match;

    while ((match = cdPattern.exec(text)) !== null) {
      cooldowns.push({
        name: match[1],
        cd: match[2],
        type: match[2].includes('분') ? 'major' : 'minor'
      });
    }

    return cooldowns;
  }

  categorizeTips(tips, category) {
    // 팁을 카테고리별로 분류
    return tips.filter(tip => {
      if (category === 'mythicplus') {
        return tip.includes('신화+') || tip.includes('던전');
      }
      if (category === 'raid') {
        return tip.includes('레이드') || tip.includes('보스');
      }
      return true; // general
    });
  }

  categorizeStory(story) {
    // 개인 스토리 분류
    if (story.includes('처음') || story.includes('초보')) return 'beginner';
    if (story.includes('실수') || story.includes('실패')) return 'mistake';
    if (story.includes('성공') || story.includes('클리어')) return 'success';
    return 'general';
  }

  preservePersonalNote(text) {
    // 개인적인 노트 보존
    const match = text.match(/마치며[\s\S]*$/);
    return match ? match[0] : '';
  }

  getSkillIcon(skillName) {
    const iconMap = {
      '살상 명령': 'ability_hunter_killcommand',
      '가시 사격': 'ability_hunter_barbedshot',
      '야수의 격노': 'ability_hunter_bestialdiscipline',
      '코브라 사격': 'ability_hunter_cobrashot',
      '광포한 야수': 'ability_hunter_lonewolf'
    };

    return iconMap[skillName] || 'inv_misc_questionmark';
  }
}

// 사용 예시
function createGuide() {
  // 1. 전문화 페르소나가 자연스러운 글 작성
  const hunterPersona = new BeastMasteryHunterPersona();
  const naturalGuide = hunterPersona.writeNaturalGuide();
  const personalStory = hunterPersona.sharePersonalExperience();

  // 2. 편집자 페르소나가 구조화
  const editor = new GuideEditorPersona();
  const structuredGuide = editor.convertToStructuredGuide(naturalGuide + personalStory);

  // 3. 최종 포맷팅
  const finalMarkdown = editor.formatAsMarkdown(structuredGuide);

  return {
    natural: naturalGuide,
    structured: structuredGuide,
    markdown: finalMarkdown
  };
}

export {
  SpecializationPersona,
  BeastMasteryHunterPersona,
  GuideEditorPersona,
  createGuide
};