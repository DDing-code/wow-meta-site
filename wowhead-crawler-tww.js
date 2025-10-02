// Wowhead TWW Season 3 (11.2 패치) 데이터 크롤러
const fs = require('fs');
const path = require('path');

console.log('🔧 Wowhead TWW Season 3 크롤러 시작...\n');

// Wowhead API 엔드포인트 (비공식)
const WOWHEAD_API_BASE = 'https://www.wowhead.com';
const WOWHEAD_KR_BASE = 'https://ko.wowhead.com';

// TWW Season 3 (11.2) 주요 클래스별 스킬 ID
const CLASS_SPELL_IDS = {
  paladin: {
    baseline: [
      6940,   // Blessing of Sacrifice (희생의 축복)
      184575, // Blade of Justice (심판의 칼날)
      204074, // Righteous Protector (정의로운 수호자)
      432578, // Holy Bulwark (신성한 방벽)
      853,    // Hammer of Justice (심판의 망치)
      642,    // Divine Shield (천상의 보호막)
      31884,  // Avenging Wrath (응징의 격노)
      1044,   // Blessing of Freedom (자유의 축복)
      1022,   // Blessing of Protection (보호의 축복)
      633,    // Lay on Hands (신의 축복)
    ],
    holy: [
      82326,  // Holy Light (성스러운 빛)
      19750,  // Flash of Light (빛의 섬광)
      85222,  // Light of Dawn (여명의 빛)
      214003, // Glimmer of Light (빛의 자락)
      148039, // Barrier of Faith (신념의 방벽)
    ],
    protection: [
      86659,  // Guardian of Ancient Kings (고대 왕의 수호자)
      31935,  // Avenger's Shield (응징의 방패)
      204018, // Blessed Hammer (축복받은 망치)
      327193, // Moment of Glory (영광의 순간)
      378974, // Bastion of Light (빛의 요새)
    ],
    retribution: [
      184662, // Shield of Vengeance (복수의 방패)
      24275,  // Hammer of Wrath (천벌의 망치)
      255937, // Wake of Ashes (재의 여파)
      205191, // Eye for an Eye (눈에는 눈)
      343527, // Execution Sentence (사형 선고)
    ],
    heroTalents: {
      herald_of_the_sun: [
        431380, // Sun's Avatar (태양의 화신)
        431412, // Luminosity (광휘)
        431423, // Morning Star (샛별)
      ],
      lightsmith: [
        432459, // Holy Armaments (신성한 무장)
        432496, // Blessed Assurance (축복받은 확신)
        432472, // Rite of Sanctification (신성화 의식)
      ],
      templar: [
        406646, // Lights Guidance (빛의 인도)
        432928, // Higher Calling (고귀한 소명)
        432939, // Hammerfall (망치 강타)
      ]
    }
  },
  warrior: {
    baseline: [
      1680,   // Whirlwind (소용돌이)
      46968,  // Bladestorm (칼날폭풍)
      23920,  // Spell Reflection (주문 반사)
      871,    // Shield Wall (방패의 벽)
      12975,  // Last Stand (최후의 저항)
      18499,  // Berserker Rage (광전사의 격노)
      6544,   // Heroic Leap (영웅의 도약)
    ],
    arms: [
      167105, // Colossus Smash (거인의 강타)
      227847, // Bladestorm (칼날폭풍 - 무기)
      262161, // Warbreaker (전쟁파괴자)
      152277, // Ravager (파괴자)
    ],
    fury: [
      1719,   // Recklessness (무모함)
      85288,  // Raging Blow (성난 강타)
      184367, // Rampage (광란)
      280772, // Siegebreaker (공성파괴자)
    ],
    protection: [
      23922,  // Shield Slam (방패 밀쳐내기)
      385952, // Shield Charge (방패 돌진)
      401150, // Avatar (화신)
      392966, // Spell Block (주문 방어)
    ]
  },
  deathknight: {
    baseline: [
      47528,  // Mind Freeze (정신 얼리기)
      48707,  // Anti-Magic Shell (대마법 보호막)
      49576,  // Death Grip (죽음의 손아귀)
      61999,  // Raise Ally (아군 되살리기)
      48792,  // Icebound Fortitude (얼음같은 인내력)
    ],
    blood: [
      55233,  // Vampiric Blood (흡혈)
      49028,  // Dancing Rune Weapon (춤추는 룬 무기)
      206931, // Blooddrinker (피술사)
      194679, // Rune Tap (룬 전환)
    ],
    frost: [
      51271,  // Pillar of Frost (서리의 기둥)
      152279, // Breath of Sindragosa (신드라고사의 숨결)
      47568,  // Empower Rune Weapon (룬 무기 강화)
      279302, // Frostwyrm's Fury (서리고룡의 격노)
    ],
    unholy: [
      42650,  // Army of the Dead (죽음의 군대)
      49206,  // Summon Gargoyle (가고일 소환)
      63560,  // Dark Transformation (어둠의 변신)
      275699, // Apocalypse (대재앙)
    ]
  }
};

// 전문화별 데이터 수집 함수
class WowheadTWWCrawler {
  constructor() {
    this.patch = "11.2.0";
    this.season = "TWW Season 3";
    this.collectedData = {};
    this.errors = [];
  }

  // 스킬 데이터 수집 (시뮬레이션)
  async fetchSpellData(spellId, className, specName = null) {
    try {
      // 실제 구현 시 Playwright나 Puppeteer 사용
      // 현재는 구조화된 데이터 형식만 제공

      const spellData = {
        base: {
          id: spellId.toString(),
          name: `Spell_${spellId}`,
          koreanName: this.getKoreanName(spellId),
          icon: this.getIconName(spellId),
          class: className,
          patch: this.patch
        },
        classification: {
          category: this.getCategory(spellId, specName),
          specialization: this.getAvailableSpecs(spellId, className),
          type: this.getSpellType(spellId),
          school: this.getSpellSchool(spellId)
        },
        mechanics: this.getMechanics(spellId),
        resources: this.getResources(spellId),
        specializationDetails: this.getSpecializationDetails(spellId, className),
        talentInteractions: this.getTalentInteractions(spellId),
        heroTalents: this.getHeroTalents(spellId, className),
        conditionalEffects: this.getConditionalEffects(spellId),
        description: this.getDescription(spellId),
        metadata: {
          patch: this.patch,
          season: this.season,
          lastUpdated: new Date().toISOString(),
          verified: false,
          dataSource: 'wowhead-crawler'
        }
      };

      return spellData;
    } catch (error) {
      this.errors.push({
        spellId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return null;
    }
  }

  // 한글명 매핑 (실제 구현 시 Wowhead 한국어 페이지에서 추출)
  getKoreanName(spellId) {
    const nameMap = {
      6940: '희생의 축복',
      184575: '심판의 칼날',
      204074: '정의로운 수호자',
      432578: '신성한 방벽',
      853: '심판의 망치',
      642: '천상의 보호막',
      31884: '응징의 격노',
      1680: '소용돌이',
      46968: '칼날폭풍',
      23920: '주문 반사',
      871: '방패의 벽',
      167105: '거인의 강타',
      1719: '무모함',
      85288: '성난 강타',
      184367: '광란'
    };
    return nameMap[spellId] || `스킬_${spellId}`;
  }

  // 아이콘 이름 추출 (실제 구현 시 Wowhead에서 추출)
  getIconName(spellId) {
    const iconMap = {
      6940: 'spell_holy_sealofsacrifice',
      184575: 'ability_paladin_bladeofjustice',
      204074: 'ability_paladin_righteousprotector',
      432578: 'ability_paladin_holybulwark',
      853: 'spell_holy_sealofmight',
      642: 'spell_holy_divineshield',
      31884: 'spell_holy_avenginewrath',
      1680: 'ability_whirlwind',
      46968: 'ability_warrior_bladestorm',
      23920: 'ability_warrior_shieldreflection',
      871: 'ability_warrior_shieldwall'
    };
    return iconMap[spellId] || 'inv_misc_questionmark';
  }

  // 카테고리 결정
  getCategory(spellId, specName) {
    if (specName && CLASS_SPELL_IDS.paladin[specName]?.includes(spellId)) {
      return 'specialization';
    }
    if (CLASS_SPELL_IDS.paladin.heroTalents?.herald_of_the_sun?.includes(spellId)) {
      return 'heroTalent';
    }
    return 'baseline';
  }

  // 사용 가능한 전문화
  getAvailableSpecs(spellId, className) {
    // 희생의 축복 예시
    if (spellId === 6940) {
      return ['holy', 'protection', 'retribution'];
    }
    // 심판의 칼날 - 징벌 전용
    if (spellId === 184575) {
      return ['retribution'];
    }
    // 기본값
    return ['all'];
  }

  // 스킬 타입
  getSpellType(spellId) {
    const passiveSpells = [204074, 432578]; // 정의로운 수호자, 신성한 방벽
    if (passiveSpells.includes(spellId)) {
      return 'passive';
    }
    return 'active';
  }

  // 주문 계열
  getSpellSchool(spellId) {
    const holySpells = [6940, 184575, 204074, 432578, 853, 642, 31884];
    const physicalSpells = [1680, 46968, 167105, 85288];

    if (holySpells.includes(spellId)) return 'holy';
    if (physicalSpells.includes(spellId)) return 'physical';
    return 'physical';
  }

  // 메커니즘 정보
  getMechanics(spellId) {
    // 희생의 축복 예시
    if (spellId === 6940) {
      return {
        cooldown: {
          base: '120초',
          charges: 1,
          rechargeTime: null,
          affectedByHaste: false
        },
        cast: {
          castTime: '즉시',
          channeled: false,
          interruptible: false,
          gcd: {
            onGcd: true,
            duration: '1.5초'
          }
        },
        targeting: {
          type: 'target',
          range: '40야드',
          radius: null,
          maxTargets: 1
        },
        duration: {
          base: '12초',
          extendable: false,
          maxDuration: '12초'
        }
      };
    }

    // 칼날폭풍 예시
    if (spellId === 46968) {
      return {
        cooldown: {
          base: '90초',
          charges: 1,
          rechargeTime: null,
          affectedByHaste: false
        },
        cast: {
          castTime: '채널링',
          channeled: true,
          interruptible: false,
          gcd: {
            onGcd: true,
            duration: '1.5초'
          }
        },
        targeting: {
          type: 'aoe',
          range: '자신',
          radius: '8야드',
          maxTargets: null
        },
        duration: {
          base: '4초',
          extendable: false,
          maxDuration: '4초'
        }
      };
    }

    // 기본값
    return {
      cooldown: { base: '없음' },
      cast: { castTime: '즉시', gcd: { onGcd: true, duration: '1.5초' } },
      targeting: { type: 'self' },
      duration: { base: '없음' }
    };
  }

  // 자원 시스템
  getResources(spellId) {
    // 성기사 신성한 힘 소모 스킬
    const holyPowerSpenders = [53385, 85256]; // Templar's Verdict, Final Verdict
    if (holyPowerSpenders.includes(spellId)) {
      return {
        cost: {
          holyPower: { amount: '3', percentage: false }
        },
        generate: null,
        requirement: {
          holyPower: { minimum: '3', description: '신성한 힘 3개 이상 필요' }
        }
      };
    }

    // 심판의 칼날 - 신성한 힘 생성
    if (spellId === 184575) {
      return {
        cost: {
          mana: { amount: '7.5', percentage: true }
        },
        generate: {
          holyPower: { amount: '1', conditions: '항상' }
        },
        requirement: null
      };
    }

    return { cost: null, generate: null, requirement: null };
  }

  // 전문화별 차이
  getSpecializationDetails(spellId, className) {
    // 심판의 칼날 - 징벌 전용
    if (spellId === 184575) {
      return {
        retribution: {
          available: true,
          rank: 1,
          modifications: {
            damage: '전투력의 275.538%',
            holyPowerGeneration: '1',
            additionalEffect: '없음'
          }
        }
      };
    }

    // 희생의 축복 - 전문화별 차이
    if (spellId === 6940) {
      return {
        holy: {
          available: true,
          rank: 1,
          modifications: {
            transferAmount: '30%',
            additionalEffect: '없음'
          }
        },
        protection: {
          available: true,
          rank: 1,
          modifications: {
            transferAmount: '30%',
            additionalEffect: '정의로운 희생 특성 있을 시 전이 피해 20% 감소'
          },
          talents: {
            affecting: ['sacrifice_of_the_just']
          }
        },
        retribution: {
          available: true,
          rank: 1,
          modifications: {
            transferAmount: '30%',
            additionalEffect: '없음'
          }
        }
      };
    }

    // 칼날폭풍 - 전사 전문화별 차이
    if (spellId === 46968) {
      return {
        arms: {
          available: true,
          modifications: {
            cooldown: '60초',
            additionalEffect: '이동 중 사용 가능, 이동 속도 감소 면역'
          }
        },
        fury: {
          available: true,
          modifications: {
            cooldown: '90초',
            additionalEffect: '피해량 증가'
          }
        },
        protection: {
          available: false
        }
      };
    }

    return {};
  }

  // 특성 상호작용
  getTalentInteractions(spellId) {
    // 정의로운 수호자
    if (spellId === 204074) {
      return {
        modifiedBy: [],
        modifies: [
          {
            skillId: '31884',
            skillName: '응징의 격노',
            effect: '신성한 힘 소모 시 재사용 대기시간 1.5초 감소'
          },
          {
            skillId: '86659',
            skillName: '고대 왕의 수호자',
            effect: '신성한 힘 소모 시 재사용 대기시간 1.5초 감소'
          }
        ],
        replaces: null,
        replacedBy: null
      };
    }

    return {
      modifiedBy: [],
      modifies: [],
      replaces: null,
      replacedBy: null
    };
  }

  // 영웅 특성 (TWW)
  getHeroTalents(spellId, className) {
    if (className === 'Paladin') {
      return {
        herald_of_the_sun: {
          available: ['holy', 'retribution'],
          modifications: {}
        },
        lightsmith: {
          available: ['holy', 'protection'],
          modifications: {}
        },
        templar: {
          available: ['protection', 'retribution'],
          modifications: {}
        }
      };
    }
    return {};
  }

  // 조건부 효과
  getConditionalEffects(spellId) {
    // 천벌의 망치
    if (spellId === 24275) {
      return [
        {
          condition: '대상 체력 20% 이하',
          effect: '항상 사용 가능'
        },
        {
          condition: '응징의 격노 활성화 중',
          effect: '체력 제한 없이 사용 가능'
        }
      ];
    }
    return [];
  }

  // 설명 (원본 그대로)
  getDescription(spellId) {
    const descriptions = {
      6940: {
        korean: '축복받은 대상이 받는 모든 피해의 30%를 대신 받습니다. 대상이 받는 피해가 최대 생명력을 초과하면 효과가 취소됩니다. 12초 동안 지속됩니다.',
        english: 'Places a blessing on a party or raid member, transferring 30% of damage taken to you. Lasts 12 sec or until the damage taken exceeds your maximum health.'
      },
      184575: {
        korean: '빛의 칼날로 대상을 꿰뚫어 (전투력의 275.538%)의 신성 피해를 입히고 신성한 힘 1개를 생성합니다.',
        english: 'Pierces an enemy with a blade of light, dealing Holy damage and generating 1 Holy Power.'
      },
      46968: {
        korean: '즉시 주위의 모든 적에게 무기 피해를 입히고, 4초 동안 계속해서 주위의 모든 적에게 무기 피해를 입힙니다.',
        english: 'Become an unstoppable storm of destructive force, striking all nearby enemies for Physical damage over 4 sec.'
      }
    };

    return descriptions[spellId] || {
      korean: '설명 없음',
      english: 'No description available'
    };
  }

  // 클래스별 스킬 수집
  async collectClassSpells(className) {
    console.log(`\n📊 ${className} 클래스 스킬 수집 시작...`);

    const classSpells = CLASS_SPELL_IDS[className.toLowerCase()];
    if (!classSpells) {
      console.error(`❌ ${className} 클래스 데이터가 정의되지 않음`);
      return;
    }

    const results = {};

    // 기본 스킬 수집
    if (classSpells.baseline) {
      for (const spellId of classSpells.baseline) {
        const data = await this.fetchSpellData(spellId, className);
        if (data) {
          results[spellId] = data;
          console.log(`  ✅ ${data.base.koreanName} (${spellId})`);
        }
      }
    }

    // 전문화별 스킬 수집
    for (const [specName, spellIds] of Object.entries(classSpells)) {
      if (specName === 'baseline' || specName === 'heroTalents') continue;

      if (Array.isArray(spellIds)) {
        for (const spellId of spellIds) {
          const data = await this.fetchSpellData(spellId, className, specName);
          if (data) {
            results[spellId] = data;
            console.log(`  ✅ [${specName}] ${data.base.koreanName} (${spellId})`);
          }
        }
      }
    }

    // 영웅 특성 수집 (TWW)
    if (classSpells.heroTalents) {
      for (const [treeName, spellIds] of Object.entries(classSpells.heroTalents)) {
        for (const spellId of spellIds) {
          const data = await this.fetchSpellData(spellId, className, 'heroTalent');
          if (data) {
            results[spellId] = data;
            console.log(`  ✅ [${treeName}] ${data.base.koreanName} (${spellId})`);
          }
        }
      }
    }

    this.collectedData[className] = results;
    console.log(`  📝 ${className}: ${Object.keys(results).length}개 스킬 수집 완료`);
  }

  // 데이터 저장
  saveData() {
    const outputPath = path.join(__dirname, 'src/data/tww-season3-skills.json');

    const outputData = {
      metadata: {
        patch: this.patch,
        season: this.season,
        collectionDate: new Date().toISOString(),
        totalSkills: Object.values(this.collectedData).reduce((sum, classData) =>
          sum + Object.keys(classData).length, 0
        ),
        errors: this.errors.length
      },
      skills: this.collectedData,
      errors: this.errors
    };

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`\n✅ TWW Season 3 데이터 저장 완료: ${outputPath}`);
    console.log(`📊 총 ${outputData.metadata.totalSkills}개 스킬 수집`);

    if (this.errors.length > 0) {
      console.log(`⚠️ ${this.errors.length}개 오류 발생`);
    }
  }

  // 실행
  async run() {
    console.log('🚀 TWW Season 3 (11.2 패치) 데이터 수집 시작\n');
    console.log('📌 주의: 실제 운영 시 Playwright로 Wowhead 페이지 크롤링 필요');
    console.log('📌 현재는 구조화된 예시 데이터만 생성\n');

    // 클래스별 수집
    const classes = ['Paladin', 'Warrior', 'DeathKnight'];

    for (const className of classes) {
      await this.collectClassSpells(className);
      // 실제 크롤링 시 딜레이 필요
      // await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 데이터 저장
    this.saveData();

    console.log('\n🎯 다음 단계:');
    console.log('  1. Playwright 설정으로 실제 Wowhead 크롤링 구현');
    console.log('  2. 한국어 페이지에서 정확한 번역 추출');
    console.log('  3. 전문화별 차이 상세 분석');
    console.log('  4. 데이터 검증 시스템 구축');
  }
}

// 실행
const crawler = new WowheadTWWCrawler();
crawler.run();