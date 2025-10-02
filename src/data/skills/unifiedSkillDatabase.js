/**
 * 통합 스킬 데이터베이스 모듈
 * 모든 클래스의 스킬 데이터를 중앙에서 관리
 * 한국어 번역과 아이콘 경로 포함
 */

// Wowhead 설명 데이터 임포트
import wowheadDescriptions from '../wowhead-descriptions.json';
import wowheadFullDescriptions from '../wowhead-full-descriptions-complete.json';
import iconMapping from '../iconMapping.json';

// 각 클래스 스킬 데이터 임포트
import { wowdbWarriorSkillsComplete } from './wowdbWarriorSkillsComplete';
import { wowdbPaladinSkillsComplete } from './wowdbPaladinSkillsComplete';
import { wowdbHunterSkillsComplete } from './wowdbHunterSkillsComplete';
import { wowdbRogueSkillsComplete } from './wowdbRogueSkillsComplete';
import { wowdbPriestSkillsComplete } from './wowdbPriestSkillsComplete';
import { wowdbMageSkillsComplete } from './wowdbMageSkillsComplete';
import { wowdbWarlockSkillsComplete } from './wowdbWarlockSkillsComplete';
import { wowdbShamanSkillsComplete } from './wowdbShamanSkillsComplete';
import { wowdbMonkSkillsComplete } from './wowdbMonkSkillsComplete';
import { wowdbDruidSkillsComplete } from './wowdbDruidSkillsComplete';
import { wowdbDeathKnightSkillsComplete } from './wowdbDeathKnightSkillsComplete';
import { wowdbDemonHunterSkillsComplete } from './wowdbDemonHunterSkillsComplete';
import { wowdbEvokerSkillsComplete } from './wowdbEvokerSkillsComplete';

// 클래스별 색상 정의
export const classColors = {
  warrior: '#C79C6E',
  paladin: '#F58CBA',
  hunter: '#ABD473',
  rogue: '#FFF569',
  priest: '#FFFFFF',
  mage: '#69CCF0',
  warlock: '#9482C9',
  shaman: '#0070DE',
  monk: '#00FF96',
  druid: '#FF7D0A',
  deathknight: '#C41F3B',
  demonhunter: '#A330C9',
  evoker: '#33937F'
};

// 클래스 한글 이름
export const classNamesKorean = {
  warrior: '전사',
  paladin: '성기사',
  hunter: '사냥꾼',
  rogue: '도적',
  priest: '사제',
  mage: '마법사',
  warlock: '흑마법사',
  shaman: '주술사',
  monk: '수도사',
  druid: '드루이드',
  deathknight: '죽음의 기사',
  demonhunter: '악마사냥꾼',
  evoker: '기원사'
};

// 전문화 한글 이름
export const specNamesKorean = {
  // 전사
  arms: '무기',
  fury: '분노',
  protection_warrior: '방어',

  // 성기사
  holy_paladin: '신성',
  protection_paladin: '보호',
  retribution: '징벌',

  // 사냥꾼
  beastmastery: '야수',
  marksmanship: '사격',
  survival: '생존',

  // 도적
  assassination: '암살',
  outlaw: '무법',
  subtlety: '잠행',

  // 사제
  discipline: '수양',
  holy_priest: '신성',
  shadow: '암흑',

  // 마법사
  arcane: '비전',
  fire: '화염',
  frost_mage: '냉기',

  // 흑마법사
  affliction: '고통',
  demonology: '악마',
  destruction: '파괴',

  // 주술사
  elemental: '정기',
  enhancement: '고양',
  restoration_shaman: '복원',

  // 수도사
  brewmaster: '양조',
  windwalker: '풍운',
  mistweaver: '운무',

  // 드루이드
  balance: '조화',
  feral: '야성',
  guardian: '수호',
  restoration_druid: '회복',

  // 죽음의 기사
  blood: '혈기',
  frost_dk: '냉기',
  unholy: '부정',

  // 악마사냥꾼
  havoc: '파멸',
  vengeance: '복수',

  // 기원사
  devastation: '황폐',
  preservation: '보존',
  augmentation: '증강'
};

// 모든 스킬 데이터 통합
class UnifiedSkillDatabase {
  constructor() {
    this.skills = new Map();
    this.classSkills = new Map();
    this.initializeDatabase();
  }

  initializeDatabase() {
    const allClasses = {
      warrior: wowdbWarriorSkillsComplete,
      paladin: wowdbPaladinSkillsComplete,
      hunter: wowdbHunterSkillsComplete,
      rogue: wowdbRogueSkillsComplete,
      priest: wowdbPriestSkillsComplete,
      mage: wowdbMageSkillsComplete,
      warlock: wowdbWarlockSkillsComplete,
      shaman: wowdbShamanSkillsComplete,
      monk: wowdbMonkSkillsComplete,
      druid: wowdbDruidSkillsComplete,
      deathknight: wowdbDeathKnightSkillsComplete,
      demonhunter: wowdbDemonHunterSkillsComplete,
      evoker: wowdbEvokerSkillsComplete
    };

    // 각 클래스의 스킬 데이터 처리
    Object.entries(allClasses).forEach(([className, classData]) => {
      const classSkillList = [];

      // 모든 카테고리의 스킬 처리
      const categories = ['baseline', 'talents', 'pvp'];

      // 전문화별 카테고리 추가
      Object.keys(classData).forEach(key => {
        if (!categories.includes(key)) {
          categories.push(key);
        }
      });

      categories.forEach(category => {
        if (classData[category]) {
          Object.entries(classData[category]).forEach(([skillId, skillData]) => {
            const skill = {
              id: parseInt(skillId),
              ...skillData,
              class: className,
              category: category,
              classColor: classColors[className],
              className: classNamesKorean[className]
            };

            // wowheadFullDescriptions에서 추가 정보 병합
            if (wowheadFullDescriptions[skillId]) {
              const fullData = wowheadFullDescriptions[skillId];
              skill.krName = fullData.krName || skill.kr || skill.name;
              skill.description = fullData.description || skill.description;
              skill.cooldown = fullData.cooldown || skill.cooldown;
              skill.range = fullData.range || skill.range;
              skill.castTime = fullData.castTime || skill.castTime;
              skill.duration = fullData.duration || skill.duration;
              skill.resource = fullData.resource || skill.resource;

              // 새로운 상세 정보 필드 추가
              skill.effect = fullData.effect || skill.effect;
              skill.healingEffect = fullData.healingEffect || skill.healingEffect;
              skill.damageEffect = fullData.damageEffect || skill.damageEffect;
              skill.buff = fullData.buff || skill.buff;
              skill.debuff = fullData.debuff || skill.debuff;
              skill.generates = fullData.generates || skill.generates;
              skill.scaling = fullData.scaling || skill.scaling;
              skill.charges = fullData.charges || skill.charges;
              skill.comboPoints = fullData.comboPoints || skill.comboPoints;
              skill.school = fullData.school || skill.school;
              skill.maxTargets = fullData.maxTargets || skill.maxTargets;
              skill.radius = fullData.radius || skill.radius;
              skill.additionalEffect = fullData.additionalEffect || skill.additionalEffect;
              skill.selfBuff = fullData.selfBuff || skill.selfBuff;
              skill.areaEffect = fullData.areaEffect || skill.areaEffect;
              skill.utility = fullData.utility || skill.utility;
              skill.mobility = fullData.mobility || skill.mobility;
              skill.proc = fullData.proc || skill.proc;
              skill.requirement = fullData.requirement || skill.requirement;
              skill.critBonus = fullData.critBonus || skill.critBonus;
              skill.conditionalCrit = fullData.conditionalCrit || skill.conditionalCrit;
              skill.overload = fullData.overload || skill.overload;
              skill.runes = fullData.runes || skill.runes;
              skill.minions = fullData.minions || skill.minions;
              skill.summon = fullData.summon || skill.summon;
              skill.shieldEffect = fullData.shieldEffect || skill.shieldEffect;
              skill.dispelEffect = fullData.dispelEffect || skill.dispelEffect;
              skill.trigger = fullData.trigger || skill.trigger;
              skill.initialDamage = fullData.initialDamage || skill.initialDamage;
              skill.dotDamage = fullData.dotDamage || skill.dotDamage;
              skill.weaponBuff = fullData.weaponBuff || skill.weaponBuff;
              skill.healing = fullData.healing || skill.healing;
              skill.chainTargets = fullData.chainTargets || skill.chainTargets;
              skill.chainReduction = fullData.chainReduction || skill.chainReduction;
            }

            // 전문화 이름 추가
            if (category !== 'baseline' && category !== 'talents' && category !== 'pvp') {
              skill.specName = specNamesKorean[category] || category;
            }

            // 글로벌 맵에 추가
            this.skills.set(parseInt(skillId), skill);

            // 클래스별 리스트에 추가
            classSkillList.push(skill);
          });
        }
      });

      this.classSkills.set(className, classSkillList);
    });
  }

  // 스킬 ID로 검색
  getSkillById(skillId) {
    return this.skills.get(parseInt(skillId));
  }

  // 클래스별 스킬 검색
  getSkillsByClass(className) {
    return this.classSkills.get(className) || [];
  }

  // 전문화별 스킬 검색
  getSkillsBySpec(className, specName) {
    const classSkills = this.getSkillsByClass(className);
    return classSkills.filter(skill =>
      skill.category === specName || skill.spec === specName
    );
  }

  // 검색 기능
  searchSkills(query, options = {}) {
    const {
      searchName = true,
      searchKorean = true,
      searchDescription = false,
      classFilter = null,
      specFilter = null,
      categoryFilter = null
    } = options;

    const lowerQuery = query.toLowerCase();
    const results = [];

    this.skills.forEach(skill => {
      // 클래스 필터
      if (classFilter && skill.class !== classFilter) return;

      // 전문화 필터
      if (specFilter && skill.category !== specFilter && skill.spec !== specFilter) return;

      // 카테고리 필터
      if (categoryFilter && skill.category !== categoryFilter) return;

      // 검색 조건
      let matches = false;

      if (searchName && skill.name && skill.name.toLowerCase().includes(lowerQuery)) {
        matches = true;
      }

      if (searchKorean && skill.kr && skill.kr.includes(query)) {
        matches = true;
      }

      if (searchDescription && skill.description && skill.description.toLowerCase().includes(lowerQuery)) {
        matches = true;
      }

      if (matches) {
        results.push(skill);
      }
    });

    return results;
  }

  // 카테고리별 스킬 개수
  getSkillCountByCategory(className) {
    const skills = this.getSkillsByClass(className);
    const counts = {};

    skills.forEach(skill => {
      const category = skill.category || 'other';
      counts[category] = (counts[category] || 0) + 1;
    });

    return counts;
  }

  // 전체 스킬 개수
  getTotalSkillCount() {
    return this.skills.size;
  }

  // 아이콘이 있는 스킬 개수
  getSkillsWithIconCount() {
    let count = 0;
    this.skills.forEach(skill => {
      if (skill.icon) count++;
    });
    return count;
  }

  // 한국어 번역이 있는 스킬 개수
  getSkillsWithKoreanCount() {
    let count = 0;
    this.skills.forEach(skill => {
      if (skill.kr) count++;
    });
    return count;
  }

  // 통계 정보
  getStatistics() {
    const stats = {
      totalSkills: this.getTotalSkillCount(),
      skillsWithIcon: this.getSkillsWithIconCount(),
      skillsWithKorean: this.getSkillsWithKoreanCount(),
      byClass: {},
      byCategory: {}
    };

    // 클래스별 통계
    this.classSkills.forEach((skills, className) => {
      stats.byClass[className] = {
        total: skills.length,
        withIcon: skills.filter(s => s.icon).length,
        withKorean: skills.filter(s => s.kr).length
      };
    });

    return stats;
  }

  // 레벨별 스킬 필터링
  getSkillsByLevel(minLevel = 1, maxLevel = 70) {
    const results = [];
    this.skills.forEach(skill => {
      if (skill.level && skill.level >= minLevel && skill.level <= maxLevel) {
        results.push(skill);
      }
    });
    return results.sort((a, b) => (a.level || 0) - (b.level || 0));
  }

  // 타입별 스킬 필터링
  getSkillsByType(type) {
    const results = [];
    this.skills.forEach(skill => {
      if (skill.type === type) {
        results.push(skill);
      }
    });
    return results;
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const skillDB = new UnifiedSkillDatabase();
export default skillDB;

// 유틸리티 함수들 내보내기
export const getSkillIcon = (skill) => {
  // 우선순위: 1. skill.icon, 2. iconMapping, 3. 기본 아이콘
  if (skill.icon) {
    return skill.icon;
  }

  // iconMapping에서 스킬 ID로 아이콘 찾기
  const skillId = skill.id?.toString();
  const mappedIcon = iconMapping[skillId];
  if (mappedIcon) {
    return mappedIcon;
  }

  // 기본 아이콘
  return 'inv_misc_questionmark';
};

export const getSkillDescription = (skill) => {
  // 우선순위: wowhead 상세 설명 > wowhead 기본 설명 > 한글 설명 > 영문 설명 > 자동 생성
  const skillId = skill.id?.toString();

  // Wowhead 상세 설명 확인
  if (skillId && wowheadFullDescriptions[skillId]) {
    const fullData = wowheadFullDescriptions[skillId];
    if (fullData.description) {
      return fullData.description;
    }
  }

  // Wowhead 기본 설명 확인
  if (skillId && wowheadDescriptions[skillId]) {
    const wowheadData = wowheadDescriptions[skillId];
    if (wowheadData.description && wowheadData.description !== '해당 없음') {
      return wowheadData.description;
    }
  }

  // 기존 설명 확인
  if (skill.description) {
    return skill.description;
  }

  // 타입별 기본 설명 생성
  const typeDescriptions = {
    damage: '적에게 피해를 입히는',
    heal: '아군을 치유하는',
    buff: '아군을 강화하는',
    debuff: '적을 약화시키는',
    defensive: '방어력을 높이는',
    mobility: '이동 속도를 증가시키는',
    cooldown: '강력한 효과를 발휘하는',
    passive: '지속 효과를 제공하는',
    talent: '특성으로 습득하는',
    pvp: 'PvP 전용',
    dot: '지속 피해를 입히는',
    hot: '지속 치유를 제공하는',
    stun: '적을 기절시키는',
    interrupt: '적의 시전을 방해하는',
    taunt: '적의 위협 수준을 조작하는',
    aoe: '광역 효과를 발휘하는',
    channel: '정신을 집중해야 하는',
    instant: '즉시 시전되는',
    cast: '시전 시간이 필요한'
  };

  const type = skill.type || '일반';
  const typeDesc = typeDescriptions[type] || '';

  // 레벨 정보
  const levelInfo = skill.level ? `레벨 ${skill.level}에 습득하는` : '';

  // 전문화 정보
  const specInfo = skill.spec ? `${skill.spec} 전문화` : '';

  // 설명 조합
  let description = `${skill.kr || skill.name}`;

  if (specInfo) description = `${specInfo} ${description}`;
  if (levelInfo) description = `${levelInfo} ${description}`;
  if (typeDesc) description += `. ${typeDesc} 스킬입니다.`;
  else description += ` 스킬입니다.`;

  return description;
};

export const formatSkillLevel = (level) => {
  if (!level) return '모든 레벨';
  return `레벨 ${level}`;
};

export const getSkillCategory = (category) => {
  const categoryNames = {
    baseline: '기본',
    talents: '특성',
    pvp: 'PvP',
    arms: '무기',
    fury: '분노',
    protection: '방어',
    // ... 기타 전문화
  };
  return categoryNames[category] || category;
};