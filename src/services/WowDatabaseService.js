// WoW Database API 통합 서비스
// WoW Inven, Wowhead 한국어 API 연동

import axios from 'axios';
import { koreanTranslations } from '../data/koreanTranslations';

class WowDatabaseService {
  constructor() {
    // API 엔드포인트 설정
    this.wowheadKrBase = 'https://www.wowhead.com/ko';
    this.wowInvenBase = 'https://wow.inven.co.kr/dataninfo/db';

    // 캐시 설정
    this.cache = new Map();
    this.cacheExpiry = 3600000; // 1시간
  }

  // 캐시 관리
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Wowhead 한국어 데이터 가져오기
  async fetchWowheadKrData(type, id) {
    const cacheKey = `wowhead_${type}_${id}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Wowhead는 CORS 정책으로 인해 직접 호출이 제한될 수 있음
      // 프록시 서버를 통하거나 백엔드 API를 통해 호출해야 함
      const url = `${this.wowheadKrBase}/${type}=${id}`;

      // 실제 구현시 프록시 서버 사용
      const response = await this.fetchWithProxy(url);

      const data = this.parseWowheadResponse(response);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Wowhead 데이터 가져오기 실패:', error);
      return null;
    }
  }

  // 프록시를 통한 fetch (CORS 우회)
  async fetchWithProxy(url) {
    // 실제 구현시 프록시 서버 주소 사용
    // 예: const proxyUrl = 'https://your-proxy-server.com/fetch';
    // return await axios.post(proxyUrl, { url });

    // 현재는 더미 데이터 반환
    return { data: {} };
  }

  // Wowhead 응답 파싱
  parseWowheadResponse(response) {
    // HTML 파싱 로직
    // 실제 구현시 cheerio 등의 라이브러리 사용
    return {
      name: '',
      description: '',
      icon: '',
      type: ''
    };
  }

  // 스킬 정보 검색
  async searchSkills(query, classFilter = null) {
    const cacheKey = `skills_${query}_${classFilter}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const results = [];

    // 로컬 데이터베이스에서 먼저 검색
    const searchTerm = query.toLowerCase();

    if (classFilter) {
      // 특정 클래스 스킬만 검색
      const classAbilities = this.getClassAbilities(classFilter);
      Object.entries(classAbilities).forEach(([key, name]) => {
        if (name.toLowerCase().includes(searchTerm) ||
            key.toLowerCase().includes(searchTerm)) {
          results.push({
            id: key,
            name: name,
            nameEn: key,
            class: koreanTranslations.classes[classFilter],
            source: 'local'
          });
        }
      });
    } else {
      // 모든 클래스 스킬 검색
      ['warrior', 'paladin', 'deathknight', 'hunter', 'rogue'].forEach(cls => {
        const classAbilities = this.getClassAbilities(cls);
        Object.entries(classAbilities).forEach(([key, name]) => {
          if (name.toLowerCase().includes(searchTerm) ||
              key.toLowerCase().includes(searchTerm)) {
            results.push({
              id: key,
              name: name,
              nameEn: key,
              class: koreanTranslations.classes[cls],
              source: 'local'
            });
          }
        });
      });
    }

    this.setCache(cacheKey, results);
    return results;
  }

  // 클래스별 능력 가져오기
  getClassAbilities(className) {
    const abilityMap = {
      warrior: koreanTranslations.warriorAbilities,
      paladin: koreanTranslations.paladinAbilities,
      deathknight: koreanTranslations.deathknightAbilities,
      hunter: koreanTranslations.hunterAbilities,
      rogue: koreanTranslations.rogueAbilities
    };

    return abilityMap[className] || {};
  }

  // 스킬 상세 정보
  async getSkillDetails(skillId, className) {
    const cacheKey = `skill_detail_${skillId}_${className}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const classAbilities = this.getClassAbilities(className);
    const skillName = classAbilities[skillId];

    if (!skillName) {
      return null;
    }

    // 스킬 상세 정보 (더미 데이터)
    const details = {
      id: skillId,
      name: skillName,
      nameEn: skillId,
      class: koreanTranslations.classes[className],
      description: this.getSkillDescription(skillId, className),
      cooldown: this.getSkillCooldown(skillId),
      resource: this.getSkillResource(skillId, className),
      icon: `spell_${skillId}`,
      type: this.getSkillType(skillId),
      range: this.getSkillRange(skillId)
    };

    this.setCache(cacheKey, details);
    return details;
  }

  // 스킬 설명 가져오기 (더미 데이터)
  getSkillDescription(skillId, className) {
    const descriptions = {
      mortalStrike: '대상에게 무기 공격력의 200% 물리 피해를 입히고, 10초 동안 받는 치유량을 50% 감소시킵니다.',
      charge: '적에게 돌진하여 1.5초 동안 기절시킵니다.',
      holyShock: '아군을 치유하거나 적에게 신성 피해를 입힙니다.',
      deathGrip: '대상을 자신에게 끌어당깁니다.',
      obliterate: '룬 2개를 소모하여 강력한 냉기 피해를 입힙니다.'
    };

    return descriptions[skillId] || '스킬 설명이 없습니다.';
  }

  // 스킬 재사용 대기시간
  getSkillCooldown(skillId) {
    const cooldowns = {
      charge: 20,
      holyShock: 9,
      deathGrip: 25,
      bladestorm: 90,
      divineShield: 300,
      armyOfTheDead: 480
    };

    return cooldowns[skillId] || 0;
  }

  // 스킬 자원 소모
  getSkillResource(skillId, className) {
    const resources = {
      warrior: '분노',
      paladin: '신성한 힘',
      deathknight: '룬',
      hunter: '집중',
      rogue: '기력'
    };

    const costs = {
      mortalStrike: '30 분노',
      holyShock: '10% 마나',
      obliterate: '2 룬',
      aimedShot: '35 집중',
      mutilate: '50 기력'
    };

    return costs[skillId] || `자원 소모: ${resources[className] || '없음'}`;
  }

  // 스킬 타입
  getSkillType(skillId) {
    const types = {
      mortalStrike: '즉시 시전',
      holyLight: '2.5초 시전',
      charge: '즉시 시전',
      aimedShot: '2.5초 시전',
      stealth: '즉시 시전'
    };

    return types[skillId] || '즉시 시전';
  }

  // 스킬 사거리
  getSkillRange(skillId) {
    const ranges = {
      charge: '8-25미터',
      mortalStrike: '근접',
      holyShock: '40미터',
      deathGrip: '30미터',
      aimedShot: '40미터'
    };

    return ranges[skillId] || '근접';
  }

  // 클래스 정보 가져오기
  async getClassInfo(className) {
    const cacheKey = `class_info_${className}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const specs = {
      warrior: ['무기', '분노', '방어'],
      paladin: ['신성', '보호', '징벌'],
      hunter: ['야수', '사격', '생존'],
      rogue: ['암살', '무법', '잠행'],
      priest: ['수양', '신성', '암흑'],
      deathknight: ['혈기', '냉기', '부정'],
      shaman: ['정기', '고양', '복원'],
      mage: ['비전', '화염', '냉기'],
      warlock: ['고통', '악마', '파괴'],
      monk: ['양조', '운무', '풍운'],
      druid: ['조화', '야성', '수호', '회복'],
      demonhunter: ['파멸', '복수'],
      evoker: ['황폐', '보존', '증강']
    };

    const info = {
      name: koreanTranslations.classes[className],
      nameEn: className,
      specs: specs[className] || [],
      abilities: this.getClassAbilities(className),
      description: this.getClassDescription(className),
      roles: this.getClassRoles(className)
    };

    this.setCache(cacheKey, info);
    return info;
  }

  // 클래스 설명
  getClassDescription(className) {
    const descriptions = {
      warrior: '전사는 근접 전투의 대가로, 강력한 무기와 갑옷을 착용합니다.',
      paladin: '성기사는 빛의 힘을 사용하는 신성한 전사입니다.',
      hunter: '사냥꾼은 원거리 무기와 야수 동료를 활용하는 추적자입니다.',
      rogue: '도적은 은신과 독을 사용하는 암살자입니다.',
      priest: '사제는 빛과 어둠의 힘을 다루는 치유사입니다.',
      deathknight: '죽음의 기사는 룬과 죽음의 마법을 사용하는 전사입니다.',
      shaman: '주술사는 원소의 힘을 다루는 영적 인도자입니다.',
      mage: '마법사는 비전, 화염, 냉기 마법의 대가입니다.',
      warlock: '흑마법사는 악마와 어둠의 힘을 다룹니다.',
      monk: '수도사는 내면의 기를 활용하는 무술가입니다.',
      druid: '드루이드는 자연의 힘과 변신 능력을 가진 수호자입니다.',
      demonhunter: '악마사냥꾼은 악마의 힘을 이용해 악마와 싸웁니다.',
      evoker: '기원사는 용의 힘을 다루는 신규 클래스입니다.'
    };

    return descriptions[className] || '';
  }

  // 클래스 역할
  getClassRoles(className) {
    const roles = {
      warrior: ['방어 전담', '공격 전담'],
      paladin: ['방어 전담', '치유 전담', '공격 전담'],
      hunter: ['공격 전담'],
      rogue: ['공격 전담'],
      priest: ['치유 전담', '공격 전담'],
      deathknight: ['방어 전담', '공격 전담'],
      shaman: ['치유 전담', '공격 전담'],
      mage: ['공격 전담'],
      warlock: ['공격 전담'],
      monk: ['방어 전담', '치유 전담', '공격 전담'],
      druid: ['방어 전담', '치유 전담', '공격 전담'],
      demonhunter: ['방어 전담', '공격 전담'],
      evoker: ['치유 전담', '공격 전담']
    };

    return roles[className] || [];
  }

  // 일반 용어 검색
  searchGeneralTerms(query) {
    const results = [];
    const searchTerm = query.toLowerCase();

    Object.entries(koreanTranslations.generalTerms).forEach(([key, value]) => {
      if (value.toLowerCase().includes(searchTerm) ||
          key.toLowerCase().includes(searchTerm)) {
        results.push({
          id: key,
          term: value,
          termEn: key.replace(/_/g, ' '),
          category: this.getTermCategory(key)
        });
      }
    });

    return results;
  }

  // 용어 카테고리 분류
  getTermCategory(term) {
    const categories = {
      combat: ['dps', 'hps', 'dtps', 'threat', 'aggro', 'taunt'],
      stats: ['item_level', 'ilvl', 'rating'],
      abilities: ['cooldown', 'global_cooldown', 'cast_time', 'instant_cast'],
      effects: ['buff', 'debuff', 'dot', 'hot', 'cc'],
      content: ['dungeon', 'raid', 'mythic_plus', 'arena', 'battleground'],
      items: ['gear', 'enchant', 'gem', 'socket', 'legendary', 'epic']
    };

    for (const [category, terms] of Object.entries(categories)) {
      if (terms.includes(term)) {
        return category;
      }
    }

    return 'general';
  }
}

export default new WowDatabaseService();