// 외부 가이드 데이터 수집 시스템
import moduleEventBus from '../../services/ModuleEventBus.js';
import APLData from '../apl/APLData.js';

class GuideDataCollector {
  constructor() {
    // 데이터 소스 URL
    this.dataSources = {
      wowhead: {
        base: 'https://www.wowhead.com/guide/classes/',
        korean: 'https://ko.wowhead.com/guide/classes/'
      },
      maxroll: {
        base: 'https://maxroll.gg/wow/class-guides/'
      },
      icyveins: {
        base: 'https://www.icy-veins.com/wow/'
      },
      simc: {
        base: 'https://github.com/simulationcraft/simc/tree/dragonflight/profiles/Tier33/'
      }
    };

    // 캐시 시스템
    this.cache = new Map();
    this.cacheTimeout = 3600000; // 1시간

    this.registerModule();
  }

  // 모듈 등록
  registerModule() {
    moduleEventBus.registerModule('guide-data-collector', {
      name: '가이드 데이터 수집기',
      version: '1.0.0',
      type: 'collector'
    });
  }

  // 통합 데이터 수집
  async collectAllData(className, spec) {
    console.log(`📚 ${className} ${spec} 전체 데이터 수집 시작...`);

    try {
      const cacheKey = `${className}-${spec}`;

      // 캐시 확인
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log('✅ 캐시된 데이터 사용');
          return cached.data;
        }
      }

      // 병렬로 모든 데이터 수집
      const [
        aplData,
        buildData,
        statData,
        rotationData,
        tierSetData,
        consumableData
      ] = await Promise.all([
        this.collectAPLData(className, spec),
        this.collectBuildData(className, spec),
        this.collectStatData(className, spec),
        this.collectRotationData(className, spec),
        this.collectTierSetData(className, spec),
        this.collectConsumableData(className, spec)
      ]);

      const collectedData = {
        apl: aplData,
        builds: buildData,
        stats: statData,
        rotation: rotationData,
        tierSet: tierSetData,
        consumables: consumableData,
        timestamp: Date.now()
      };

      // 캐시 저장
      this.cache.set(cacheKey, {
        data: collectedData,
        timestamp: Date.now()
      });

      console.log('✅ 전체 데이터 수집 완료');
      return collectedData;

    } catch (error) {
      console.error('데이터 수집 실패:', error);
      return this.getDefaultData(className, spec);
    }
  }

  // APL (Action Priority List) 수집
  async collectAPLData(className, spec) {
    console.log(`🎯 ${className} ${spec} APL 수집 중...`);

    try {
      // APLData 모듈 활용
      const apl = await APLData.fetchAPL(className, spec);

      if (!apl) {
        return this.getDefaultAPL(className, spec);
      }

      // SimC APL 파싱
      const parsedAPL = this.parseSimCAPL(apl);

      return {
        opener: parsedAPL.precombat || [],
        default: parsedAPL.default || [],
        aoe: parsedAPL.aoe || [],
        cooldowns: parsedAPL.cooldowns || [],
        simplified: APLData.getSimplifiedAPL(className, spec)
      };

    } catch (error) {
      console.error('APL 수집 실패:', error);
      return this.getDefaultAPL(className, spec);
    }
  }

  // 빌드 데이터 수집
  async collectBuildData(className, spec) {
    console.log(`🏗️ ${className} ${spec} 빌드 데이터 수집 중...`);

    // 11.2 시즌 3 빌드 코드
    const builds = {
      'hunter': {
        'beast-mastery': {
          'packleader': {
            'raid-single': {
              code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSJJJJlkQSIJJplkkkkAJSKRSSakkkkSA',
              description: '무리의 지도자 레이드 단일 대상 빌드'
            },
            'raid-aoe': {
              code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSJJJJlEQSIJJRlkkkkAJSKRSSakkkkSA',
              description: '무리의 지도자 레이드 광역 빌드'
            },
            'mythic-plus': {
              code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSJJJJlESSIJJRlkkkkAJSKRSSakkkkSA',
              description: '무리의 지도자 쐐기돌 빌드'
            }
          },
          'darkranger': {
            'raid-single': {
              code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSkIRSJkkkkkkkgkgEkIpFJJRSSSJA',
              description: '어둠 순찰자 레이드 단일 대상 빌드'
            },
            'raid-aoe': {
              code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSEIJSJkkkkkkkgkgEkIpFJJRSSSJA',
              description: '어둠 순찰자 레이드 광역 빌드'
            },
            'mythic-plus': {
              code: 'C0PAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSSkkQSEIRSJkkkkkkkgkgEkIpFJJRSSSJA',
              description: '어둠 순찰자 쐐기돌 빌드'
            }
          }
        }
        // 다른 전문화 추가...
      }
      // 다른 클래스 추가...
    };

    return builds[className]?.[spec] || {};
  }

  // 스탯 데이터 수집
  async collectStatData(className, spec) {
    console.log(`📊 ${className} ${spec} 스탯 우선순위 수집 중...`);

    // 11.2 스탯 우선순위
    const statPriorities = {
      'hunter': {
        'beast-mastery': {
          'packleader': {
            single: ['weaponDamage', 'haste', 'mastery', 'crit', 'versatility', 'agility'],
            aoe: ['weaponDamage', 'haste', 'crit', 'mastery', 'versatility', 'agility']
          },
          'darkranger': {
            single: ['weaponDamage', 'haste', 'crit', 'versatility', 'mastery', 'agility'],
            aoe: ['weaponDamage', 'haste', 'crit', 'versatility', 'mastery', 'agility']
          },
          weights: {
            weaponDamage: 1.00,
            haste: 0.85,
            crit: 0.80,
            mastery: 0.78,
            versatility: 0.65,
            agility: 0.60
          }
        }
      }
      // 다른 클래스 추가...
    };

    return statPriorities[className]?.[spec] || this.getDefaultStatPriority();
  }

  // 딜사이클 데이터 수집
  async collectRotationData(className, spec) {
    console.log(`🔄 ${className} ${spec} 딜사이클 수집 중...`);

    const rotationData = {
      'hunter': {
        'beast-mastery': {
          'packleader': {
            single: {
              opener: [
                'barbedShot', 'bestialWrath', 'killCommand', 'barbedShot',
                'callOfTheWild', 'bloodshed', 'killCommand', 'barbedShot',
                'direBeasts', 'stampede', 'killCommand'
              ],
              priority: [
                { skill: 'bloodshed', desc: '재사용 대기시간마다 사용' },
                { skill: 'frenzy', desc: '3중첩 유지 (날카로운 사격으로 갱신)' },
                { skill: 'bestialWrath', desc: '재사용 대기시간마다 사용' },
                { skill: 'killCommand', desc: '최대한 자주 사용' },
                { skill: 'direBeasts', desc: '재사용 대기시간마다' },
                { skill: 'cobraShot', desc: '집중 60 이상일 때 사용' },
                { skill: 'killShot', desc: '실행 구간에서 사용' }
              ]
            },
            aoe: {
              opener: [
                'multiShot', 'bestialWrath', 'barbedShot', 'bloodshed',
                'callOfTheWild', 'stampede', 'killCommand', 'barbedShot'
              ],
              priority: [
                { skill: 'multiShot', desc: '야수의 회전베기 활성화 (처음 1회)' },
                { skill: 'stampede', desc: '위치 선정 후 사용' },
                { skill: 'barbedShot', desc: '광기 유지 및 펫 추가 소환' },
                { skill: 'killCommand', desc: '주 대상에게' },
                { skill: 'cobraShot', desc: '집중 소비' }
              ]
            }
          },
          'darkranger': {
            single: {
              opener: [
                'blackArrow', 'barbedShot', 'bestialWrath', 'killCommand',
                'barbedShot', 'callOfTheWild', 'killCommand'
              ],
              priority: [
                { skill: 'blackArrow', desc: '재사용 대기시간마다 사용' },
                { skill: 'frenzy', desc: '3중첩 유지' },
                { skill: 'bestialWrath', desc: '재사용 대기시간마다' },
                { skill: 'killCommand', desc: '최대한 자주' },
                { skill: 'cobraShot', desc: '집중 관리' }
              ]
            },
            aoe: {
              opener: [
                'multiShot', 'blackArrow', 'bestialWrath', 'barbedShot'
              ],
              priority: [
                { skill: 'multiShot', desc: '야수의 회전베기 유지' },
                { skill: 'blackArrow', desc: '재사용 대기시간마다' },
                { skill: 'barbedShot', desc: '광기 유지' },
                { skill: 'killCommand', desc: '주 대상' }
              ]
            }
          }
        }
      }
      // 다른 클래스 추가...
    };

    return rotationData[className]?.[spec] || {};
  }

  // 티어세트 데이터 수집
  async collectTierSetData(className, spec) {
    console.log(`🎭 ${className} ${spec} 티어세트 효과 수집 중...`);

    const tierSets = {
      'hunter': {
        'beast-mastery': {
          '2set': '야수의 격노, 야생의 부름, 유혈 사용 시 추가로 무리 우두머리의 울부짖음을 소환합니다. 무리 우두머리의 울부짖음의 공격력이 25% 증가합니다.',
          '4set': '무리 우두머리의 울부짖음이 활성화되어 있는 동안, 날카로운 사격의 치명타 확률이 15% 증가합니다. 앞서가는 전략을 받는 동안 날카로운 사격 시전 시 무리 우두머리의 울부짖음의 지속시간이 1초 증가합니다.'
        }
      }
      // 다른 클래스 추가...
    };

    return tierSets[className]?.[spec] || { '2set': '2세트 효과', '4set': '4세트 효과' };
  }

  // 소모품 데이터 수집
  async collectConsumableData(className, spec) {
    console.log(`🧪 ${className} ${spec} 소모품 데이터 수집 중...`);

    // 11.2 TWW S3 소모품
    const consumables = {
      phial: 'Flask of Alchemical Chaos',
      oil: 'Algari Mana Oil',
      potion: 'Tempered Potion',
      food: 'Feast of the Divine Day',
      augmentRune: 'Crystallized Augment Rune',
      weaponBuff: {
        melee: 'Ironclaw Whetstone',
        ranged: 'Ironclaw Whetstone',
        caster: 'Howling Rune'
      }
    };

    return consumables;
  }

  // SimC APL 파싱
  parseSimCAPL(aplString) {
    const parsed = {
      precombat: [],
      default: [],
      aoe: [],
      cooldowns: []
    };

    if (!aplString) return parsed;

    const lines = aplString.split('\n');
    let currentSection = 'default';

    for (const line of lines) {
      // 섹션 감지
      if (line.includes('precombat')) {
        currentSection = 'precombat';
      } else if (line.includes('aoe')) {
        currentSection = 'aoe';
      } else if (line.includes('cooldowns')) {
        currentSection = 'cooldowns';
      }

      // 액션 추출
      const actionMatch = line.match(/actions[^=]*=([^,]+)/);
      if (actionMatch) {
        const action = actionMatch[1].trim();
        parsed[currentSection].push(action);
      }
    }

    return parsed;
  }

  // 기본 APL 데이터
  getDefaultAPL(className, spec) {
    return {
      opener: [],
      default: [],
      aoe: [],
      cooldowns: [],
      simplified: null
    };
  }

  // 기본 스탯 우선순위
  getDefaultStatPriority() {
    return {
      single: ['mainstat', 'haste', 'crit', 'mastery', 'versatility'],
      aoe: ['mainstat', 'haste', 'crit', 'mastery', 'versatility'],
      weights: {
        mainstat: 1.00,
        haste: 0.80,
        crit: 0.75,
        mastery: 0.70,
        versatility: 0.65
      }
    };
  }

  // 기본 데이터 (폴백)
  getDefaultData(className, spec) {
    return {
      apl: this.getDefaultAPL(className, spec),
      builds: {},
      stats: this.getDefaultStatPriority(),
      rotation: {},
      tierSet: { '2set': '2세트 효과', '4set': '4세트 효과' },
      consumables: {},
      timestamp: Date.now()
    };
  }

  // 데이터 검증
  validateData(data) {
    const required = ['apl', 'builds', 'stats', 'rotation', 'tierSet', 'consumables'];

    for (const field of required) {
      if (!data[field]) {
        console.warn(`⚠️ 필수 필드 누락: ${field}`);
        return false;
      }
    }

    return true;
  }

  // 캐시 정리
  clearCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }
}

// 싱글톤 인스턴스
const guideDataCollector = new GuideDataCollector();

export default guideDataCollector;