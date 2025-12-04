/**
 * WoW 전문화 가이드 Config 스키마 (표준 데이터 구조)
 *
 * 이 스키마를 따르는 config 파일을 만들면
 * GuideTemplate.js가 자동으로 가이드를 렌더링합니다.
 */

/**
 * 직업 기본 설정
 */
export const classConfigSchema = {
  className: String,  // 'WARRIOR', 'MAGE', 'HUNTER' 등
  spec: String,       // 'fury', 'arcane', 'beast-mastery' 등
  heroTalents: [String, String],  // ['학살자', '산왕']

  // Optional: 영웅 특성 키 매핑 (템플릿은 hero1/hero2 사용)
  heroMapping: {
    hero1: String,    // 'slayer'
    hero2: String     // 'mountainThane'
  }
};

/**
 * 영웅 특성별 콘텐츠 구조
 */
export const heroContentSchema = {
  hero1: {
    name: String,     // '학살자'
    icon: String,     // '⚔️'

    tierSet: {
      twoSet: String,   // '2세트 효과 설명'
      fourSet: String   // '4세트 효과 설명'
    },

    singleTarget: {
      opener: [
        /* Skill 객체 배열 (skillData에서 가져옴) */
      ],

      priority: [
        {
          skill: Object,      // skillData.rampage
          desc: String,       // '격노 버프 유지 (최우선)'
          conditions: [String],  // ['격노 버프 없음', 'OR 격노 1 GCD 내 만료']
          why: String         // '격노 유지율 90%+ 목표 - 가속 25% 증가'
        }
      ]
    },

    aoe: {
      opener: [ /* Skill 객체 배열 */ ],
      priority: [ /* 위와 동일 구조 */ ]
    },

    mechanics: [
      {
        title: String,     // 'Pandemic 메커니즘'
        icon: String,      // '🔄'
        desc: String,      // '지속 효과(DoT)를 조기 갱신 시 남은 시간이 추가되는 시스템'
        details: [String], // ['천둥의 포효 출혈: 8초 지속 → ...', '예시: 3초 남았을 때 ...']
        why: String        // 'DoT 지속시간을 최대한 활용하여 DPS 극대화'
      }
    ]
  },

  hero2: {
    /* hero1과 동일 구조 */
  }
};

/**
 * 특성 빌드 구조
 */
export const buildsSchema = {
  hero1: {
    'raid-single': {
      name: String,         // '레이드 단일 대상'
      description: String,  // '학살자를 활용한 단일 대상 빌드입니다...'
      code: String,         // 'CwQAqjLKv2qfbjSJolSCJS...' (Wowhead 빌드 코드)
      icon: String          // '⚔️'
    },
    'raid-aoe': {
      /* 위와 동일 구조 */
    },
    'mythic-plus': {
      /* 위와 동일 구조 */
    }
  },

  hero2: {
    /* hero1과 동일 구조 */
  }
};

/**
 * 스탯 우선순위 구조
 */
export const statsSchema = {
  hero1: {
    single: [String],  // ['crit', 'haste', 'mastery', 'versatility']
    aoe: [String]      // ['haste', 'crit', 'mastery', 'versatility']
  },

  hero2: {
    /* hero1과 동일 구조 */
  }
};

/**
 * 완전한 Config 구조 (모든 가이드가 이 구조를 따름)
 */
export const fullConfigSchema = {
  // 1. 직업 설정
  classConfig: classConfigSchema,

  // 2. 스킬 데이터 (각 전문화의 skillData 파일에서 import)
  skillData: Object,  // { rampage: {...}, bloodthirst: {...}, ... }

  // 3. 영웅 특성 콘텐츠
  heroContent: heroContentSchema,

  // 4. 특성 빌드
  builds: buildsSchema,

  // 5. 스탯 우선순위
  stats: statsSchema
};

/**
 * TypeScript 타입 정의 (참고용)
 */
export const typeDefinitions = `
// Skill 객체 타입
interface Skill {
  id: string | number;
  koreanName: string;
  englishName: string;
  icon: string;
  description: string;
  cooldown: string;
  castTime: string;
  range: string;
  resourceCost: string;
  resourceGain: string;
  type: string;
  spec: string;
  // ... 기타 필드
}

// Priority 타입
interface Priority {
  skill: Skill;
  desc: string;
  conditions: string[];
  why: string;
}

// Mechanic 타입
interface Mechanic {
  title: string;
  icon: string;
  desc: string;
  details: string[];
  why: string;
}

// HeroContent 타입
interface HeroContent {
  name: string;
  icon: string;
  tierSet: {
    twoSet: string;
    fourSet: string;
  };
  singleTarget: {
    opener: Skill[];
    priority: Priority[];
  };
  aoe: {
    opener: Skill[];
    priority: Priority[];
  };
  mechanics: Mechanic[];
}

// Build 타입
interface Build {
  name: string;
  description: string;
  code: string;
  icon: string;
}

// 전체 Config 타입
interface GuideConfig {
  classConfig: {
    className: 'WARRIOR' | 'MAGE' | 'HUNTER' | 'ROGUE' | 'PRIEST' |
                'SHAMAN' | 'WARLOCK' | 'MONK' | 'DRUID' | 'DEMONHUNTER' |
                'DEATHKNIGHT' | 'PALADIN' | 'EVOKER';
    spec: string;
    heroTalents: [string, string];
    heroMapping?: {
      hero1: string;
      hero2: string;
    };
  };
  skillData: Record<string, Skill>;
  heroContent: {
    hero1: HeroContent;
    hero2: HeroContent;
  };
  builds: {
    hero1: {
      'raid-single': Build;
      'raid-aoe': Build;
      'mythic-plus': Build;
    };
    hero2: {
      'raid-single': Build;
      'raid-aoe': Build;
      'mythic-plus': Build;
    };
  };
  stats: {
    hero1: {
      single: string[];
      aoe: string[];
    };
    hero2: {
      single: string[];
      aoe: string[];
    };
  };
}
`;

/**
 * Config 검증 함수
 */
export function validateConfig(config) {
  const errors = [];

  // 1. 필수 필드 검증
  if (!config.classConfig) errors.push('classConfig 누락');
  if (!config.skillData) errors.push('skillData 누락');
  if (!config.heroContent) errors.push('heroContent 누락');
  if (!config.builds) errors.push('builds 누락');
  if (!config.stats) errors.push('stats 누락');

  // 2. classConfig 검증
  if (config.classConfig) {
    if (!config.classConfig.className) errors.push('className 누락');
    if (!config.classConfig.spec) errors.push('spec 누락');
    if (!Array.isArray(config.classConfig.heroTalents) ||
        config.classConfig.heroTalents.length !== 2) {
      errors.push('heroTalents는 2개 요소 배열이어야 함');
    }
  }

  // 3. heroContent 검증
  if (config.heroContent) {
    if (!config.heroContent.hero1) errors.push('heroContent.hero1 누락');
    if (!config.heroContent.hero2) errors.push('heroContent.hero2 누락');

    ['hero1', 'hero2'].forEach(hero => {
      const content = config.heroContent[hero];
      if (content) {
        if (!content.name) errors.push(`${hero}.name 누락`);
        if (!content.tierSet) errors.push(`${hero}.tierSet 누락`);
        if (!content.singleTarget) errors.push(`${hero}.singleTarget 누락`);
        if (!content.aoe) errors.push(`${hero}.aoe 누락`);
        if (!content.mechanics) errors.push(`${hero}.mechanics 누락`);
      }
    });
  }

  // 4. builds 검증
  if (config.builds) {
    ['hero1', 'hero2'].forEach(hero => {
      const builds = config.builds[hero];
      if (builds) {
        ['raid-single', 'raid-aoe', 'mythic-plus'].forEach(buildType => {
          const build = builds[buildType];
          if (build) {
            if (!build.name) errors.push(`${hero}.${buildType}.name 누락`);
            if (!build.code) errors.push(`${hero}.${buildType}.code 누락`);
          } else {
            errors.push(`${hero}.${buildType} 누락`);
          }
        });
      } else {
        errors.push(`builds.${hero} 누락`);
      }
    });
  }

  // 5. stats 검증
  if (config.stats) {
    ['hero1', 'hero2'].forEach(hero => {
      const stat = config.stats[hero];
      if (stat) {
        if (!Array.isArray(stat.single)) errors.push(`${hero}.stats.single은 배열이어야 함`);
        if (!Array.isArray(stat.aoe)) errors.push(`${hero}.stats.aoe는 배열이어야 함`);
      } else {
        errors.push(`stats.${hero} 누락`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 사용 예시
 */
export const exampleConfig = {
  classConfig: {
    className: 'WARRIOR',
    spec: 'fury',
    heroTalents: ['학살자', '산왕'],
    heroMapping: {
      hero1: 'slayer',
      hero2: 'mountainThane'
    }
  },

  skillData: {
    // furyWarriorSkillData.js에서 import
  },

  heroContent: {
    hero1: {
      name: '학살자',
      icon: '⚔️',
      tierSet: {
        twoSet: '2세트 효과',
        fourSet: '4세트 효과'
      },
      singleTarget: {
        opener: [],
        priority: []
      },
      aoe: {
        opener: [],
        priority: []
      },
      mechanics: []
    },
    hero2: {
      // 동일 구조
    }
  },

  builds: {
    hero1: {
      'raid-single': { name: '', description: '', code: '', icon: '' },
      'raid-aoe': { name: '', description: '', code: '', icon: '' },
      'mythic-plus': { name: '', description: '', code: '', icon: '' }
    },
    hero2: {
      // 동일 구조
    }
  },

  stats: {
    hero1: {
      single: ['crit', 'haste', 'mastery', 'versatility'],
      aoe: ['haste', 'crit', 'mastery', 'versatility']
    },
    hero2: {
      // 동일 구조
    }
  }
};
