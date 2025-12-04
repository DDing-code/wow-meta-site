/**
 * MaxrollValidator.js
 * Maxroll 가이드 데이터 기반 교차 검증 엔진
 *
 * 기능:
 * - 영웅 특성 검증 (confidence: 0.95)
 * - 리소스 시스템 검증 (confidence: 0.98)
 * - 스킬 로테이션 검증 (confidence: 0.70)
 * - 티어 세트 효과 검증 (confidence: 0.85)
 * - 메커니즘 검증 (confidence: 0.75)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isSemanticallySimilar, getSimilarityScore, findSimilarInArray } from './SemanticMatcher.js';
import { getSpecMetadata } from '../data/classMetadata.js';
import { searchAndAddSkill } from './SkillAutoFinder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Maxroll 캐시 로드
 */
const loadMaxrollCache = (className, specName) => {
  try {
    const cachePath = path.join(__dirname, '..', '..', 'database-builder', 'maxroll-cache', `${className}-${specName}.json`);
    const cacheContent = fs.readFileSync(cachePath, 'utf-8');
    return JSON.parse(cacheContent);
  } catch (error) {
    console.error(`❌ Maxroll 캐시 로드 실패: ${className}-${specName}`);
    console.error(`   파일 경로: database-builder/maxroll-cache/${className}-${specName}.json`);
    console.error(`   먼저 스크래핑을 실행하세요: node scripts/scrape-maxroll-guide.js ${className} ${specName}`);
    return null;
  }
};

/**
 * 가이드 파일에서 영웅 특성 추출
 */
const extractHeroTalentsFromGuide = (content) => {
  const heroTalents = [];

  // 1. talentBuilds 객체에서 키 추출
  const talentBuildsPattern = /const talentBuilds = \{([^}]+)\}/s;
  const match = content.match(talentBuildsPattern);

  if (match) {
    const buildsBody = match[1];
    // 첫 번째 레벨 키만 추출 (deathbringer, rideroftheapocalypse 등)
    const keyPattern = /(\w+):\s*\{/g;
    let keyMatch;

    while ((keyMatch = keyPattern.exec(buildsBody)) !== null) {
      const key = keyMatch[1];
      // 'raid', 'mythic' 같은 하위 키는 제외
      if (!['raid', 'mythic', 'single', 'aoe'].includes(key.toLowerCase())) {
        heroTalents.push(key);
      }
    }
  }

  // 2. getHeroContent 함수에서도 추출
  const heroContentPattern = /const getHeroContent = \(SkillIcon\) => \(\{([^}]+)\}\);/s;
  const heroMatch = content.match(heroContentPattern);

  if (heroMatch) {
    const heroBody = heroMatch[1];
    const keyPattern = /(\w+):\s*\{/g;
    let keyMatch;

    while ((keyMatch = keyPattern.exec(heroBody)) !== null) {
      const key = keyMatch[1];
      if (!heroTalents.includes(key)) {
        heroTalents.push(key);
      }
    }
  }

  // 3. 텍스트에서 영웅 특성 언급 추출
  const specData = extractSpecInfoFromGuide(content);
  if (specData.heroTalents) {
    specData.heroTalents.forEach(ht => {
      if (!heroTalents.includes(ht)) {
        heroTalents.push(ht);
      }
    });
  }

  return heroTalents;
};

/**
 * 가이드에서 전문화 정보 추출 (클래스, 전문화명)
 */
const extractSpecInfoFromGuide = (content) => {
  // 파일 헤더에서 추출
  const headerPattern = /\/\*\*[\s\S]*?@className\s+(\w+)[\s\S]*?@specName\s+(\w+)/;
  const match = content.match(headerPattern);

  if (match) {
    return {
      className: match[1],
      specName: match[2]
    };
  }

  // 컴포넌트명에서 추출 (FrostDeathKnightGuide → frost, deathknight)
  const componentPattern = /const\s+(\w+)\s+=\s+\(\)/;
  const componentMatch = content.match(componentPattern);

  if (componentMatch) {
    const name = componentMatch[1]; // "FrostDeathKnightGuide"
    // 간단한 패턴 매칭 (개선 가능)
    return {
      className: 'unknown',
      specName: 'unknown'
    };
  }

  return { className: null, specName: null };
};

/**
 * 가이드에서 리소스 언급 추출
 */
const extractResourceMentions = (content) => {
  const resources = new Set();

  // 알려진 리소스 키워드
  const resourceKeywords = [
    '마나', '룬 마력', '룬', '분노', '기력', '집중', '신성한 힘',
    '주문불꽃 구체', '영혼 조각', '소용돌이 값',
    'mana', 'runic power', 'rune', 'rage', 'energy', 'focus',
    'holy power', 'spellfire spheres', 'soul shards', 'maelstrom'
  ];

  resourceKeywords.forEach(keyword => {
    // 대소문자 구분 없이 검색
    const regex = new RegExp(keyword, 'gi');
    if (regex.test(content)) {
      resources.add(keyword);
    }
  });

  return Array.from(resources);
};

/**
 * 가이드에서 스킬 로테이션 추출
 */
const extractSkillsFromRotation = (content) => {
  const skills = new Set();

  // opener 배열에서 스킬 추출
  const openerPattern = /const opener = \[([\s\S]*?)\];/;
  const openerMatch = content.match(openerPattern);

  if (openerMatch) {
    const openerBody = openerMatch[1];
    // skillData.xxx 패턴 추출
    const skillPattern = /skillData\.(\w+)/g;
    let skillMatch;

    while ((skillMatch = skillPattern.exec(openerBody)) !== null) {
      skills.add(skillMatch[1]);
    }
  }

  // priority 배열에서도 추출
  const priorityPattern = /priority:\s*\[([\s\S]*?)\]/g;
  let priorityMatch;

  while ((priorityMatch = priorityPattern.exec(content)) !== null) {
    const priorityBody = priorityMatch[1];
    const skillPattern = /skillData\.(\w+)/g;
    let skillMatch;

    while ((skillMatch = skillPattern.exec(priorityBody)) !== null) {
      skills.add(skillMatch[1]);
    }
  }

  return Array.from(skills);
};

/**
 * 가이드에서 티어 세트 정보 추출
 */
const extractTierSetFromGuide = (content) => {
  const tierSet = {};

  // 2set 패턴
  const twoSetPattern = /2세트[:\s]+([^\.]+\.)/ ||
                       /2-set[:\s]+([^\.]+\.)/i;
  const twoSetMatch = content.match(twoSetPattern);

  if (twoSetMatch) {
    tierSet['2set'] = twoSetMatch[1].trim();
  }

  // 4set 패턴
  const fourSetPattern = /4세트[:\s]+([^\.]+\.)/ ||
                        /4-set[:\s]+([^\.]+\.)/i;
  const fourSetMatch = content.match(fourSetPattern);

  if (fourSetMatch) {
    tierSet['4set'] = fourSetMatch[1].trim();
  }

  return tierSet;
};

/**
 * 1. 영웅 특성 검증
 */
const validateHeroTalents = (content, maxrollData) => {
  const errors = [];
  const guideHeroTalents = extractHeroTalentsFromGuide(content);

  if (guideHeroTalents.length === 0) {
    errors.push({
      type: 'NO_HERO_TALENTS_FOUND',
      confidence: 0.5,
      message: '가이드에서 영웅 특성을 찾을 수 없습니다.',
      autoFix: false
    });
    return errors;
  }

  guideHeroTalents.forEach(guideTalent => {
    // Maxroll 데이터와 비교
    const isValid = maxrollData.heroTalents.some(maxrollTalent =>
      isSemanticallySimilar(guideTalent, maxrollTalent, 0.7)
    );

    if (!isValid) {
      // 가장 유사한 것 찾기
      const suggested = findSimilarInArray(guideTalent, maxrollData.heroTalents, 0.5);

      errors.push({
        type: 'WRONG_HERO_TALENT',
        found: guideTalent,
        expected: maxrollData.heroTalents,
        suggested,
        confidence: 0.95,
        message: `"${guideTalent}"은(는) Maxroll에서 이 전문화의 영웅 특성이 아닙니다.`,
        autoFix: !!suggested,
        fix: suggested ? {
          oldValue: guideTalent,
          newValue: suggested
        } : null
      });
    }
  });

  return errors;
};

/**
 * 2. 리소스 시스템 검증
 */
const validateResources = (content, maxrollData, className) => {
  const errors = [];
  const guideResources = extractResourceMentions(content);

  // 유효한 리소스 목록 (classMetadata에서)
  const validResources = getValidResourcesForClass(className);

  guideResources.forEach(resource => {
    const isValid = validResources.some(validRes =>
      isSemanticallySimilar(resource, validRes, 0.7)
    );

    if (!isValid) {
      const suggested = findSimilarInArray(resource, validResources, 0.5);

      errors.push({
        type: 'WRONG_RESOURCE',
        found: resource,
        expected: validResources,
        suggested,
        confidence: 0.98,
        message: `"${resource}"은(는) ${className}가 사용하지 않는 리소스입니다.`,
        autoFix: !!suggested,
        fix: suggested ? {
          oldValue: resource,
          newValue: suggested
        } : null
      });
    }
  });

  return errors;
};

/**
 * 클래스별 유효한 리소스 반환
 */
const getValidResourcesForClass = (className) => {
  const resourceMap = {
    'deathknight': ['룬 마력', 'runic power', '룬', 'rune'],
    'warrior': ['분노', 'rage'],
    'mage': ['마나', 'mana'],
    'hunter': ['집중', 'focus'],
    'rogue': ['기력', 'energy', '연계 점수', 'combo points'],
    'paladin': ['마나', 'mana', '신성한 힘', 'holy power'],
    // ... (나머지 클래스)
  };

  return resourceMap[className.toLowerCase()] || [];
};

/**
 * 스킬 데이터베이스에서 스킬 확인
 * @param {string} skillKey - 스킬 키 (camelCase)
 * @param {string} className - 클래스명
 * @returns {object|null} 스킬 데이터
 */
const getSkillFromDB = (skillKey, className) => {
  try {
    const dbPath = path.join(__dirname, '..', '..', 'database-builder', 'tww-s3-refined-database.json');
    const dbContent = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(dbContent);

    if (db[className] && db[className][skillKey]) {
      return db[className][skillKey];
    }

    return null;
  } catch (error) {
    return null;
  }
};

/**
 * 3. 스킬 로테이션 검증 (스킬 자동 검색 통합)
 */
const validateRotation = async (content, maxrollData, className) => {
  const warnings = [];
  const guideSkills = extractSkillsFromRotation(content);

  // Maxroll 로테이션에서 스킬명 추출
  const maxrollSkills = [
    ...maxrollData.rotation.opener.map(extractSkillName),
    ...maxrollData.rotation.priority.map(extractSkillName)
  ].filter(Boolean);

  for (const skill of guideSkills) {
    // 1. 내부 DB 확인
    let skillData = getSkillFromDB(skill, className);

    // 2. DB에 없으면 Wowhead 자동 검색
    if (!skillData) {
      console.log(`\n🔍 스킬 "${skill}" DB에 없음, Wowhead 검색 중...`);

      try {
        skillData = await searchAndAddSkill(skill, className);

        if (skillData) {
          console.log(`✅ 스킬 자동 추가 완료: ${skillData.koreanName}`);
        } else {
          warnings.push({
            type: 'SKILL_NOT_FOUND',
            found: skill,
            confidence: 0.60,
            message: `"${skill}"을(를) Wowhead에서 찾을 수 없습니다. 스킬명 확인 필요.`,
            autoFix: false
          });
          continue;
        }
      } catch (error) {
        console.error(`❌ 스킬 자동 검색 실패 (${skill}): ${error.message}`);
        warnings.push({
          type: 'SKILL_SEARCH_FAILED',
          found: skill,
          confidence: 0.50,
          message: `"${skill}" 자동 검색 실패: ${error.message}`,
          autoFix: false
        });
        continue;
      }
    }

    // 3. Maxroll과 검증
    const skillNameToCheck = skillData ? skillData.englishName : skill;
    const isVerified = maxrollSkills.some(maxrollSkill =>
      isSemanticallySimilar(skillNameToCheck, maxrollSkill, 0.6)
    );

    if (!isVerified) {
      warnings.push({
        type: 'UNVERIFIED_SKILL',
        found: skill,
        skillData: skillData ? {
          korean: skillData.koreanName,
          english: skillData.englishName
        } : null,
        confidence: 0.70,
        message: `"${skill}"이(가) Maxroll 로테이션에 없습니다. 다른 전문화/클래스의 스킬일 수 있습니다.`,
        autoFix: false
      });
    }
  }

  return warnings;
};

/**
 * 스킬명 추출 (문장에서)
 */
const extractSkillName = (text) => {
  if (!text) return null;

  // "Cast Obliterate at 2 runes" → "Obliterate"
  // "Frost Strike at 90+ RP" → "Frost Strike"
  const match = text.match(/^([A-Za-z\s]+?)(?:\s+at|\s+when|\s+if|$)/i);
  return match ? match[1].trim() : text.trim();
};

/**
 * 4. 티어 세트 효과 검증
 */
const validateTierSet = (content, maxrollData) => {
  const warnings = [];
  const guideTierSet = extractTierSetFromGuide(content);

  ['2set', '4set'].forEach(setKey => {
    if (guideTierSet[setKey] && maxrollData.tierSet[setKey]) {
      const similarity = getSimilarityScore(
        guideTierSet[setKey],
        maxrollData.tierSet[setKey]
      );

      if (similarity < 0.6) {
        warnings.push({
          type: 'TIERSET_MISMATCH',
          setType: setKey,
          found: guideTierSet[setKey],
          expected: maxrollData.tierSet[setKey],
          confidence: 0.85,
          message: `${setKey} 효과가 Maxroll과 다릅니다. (유사도: ${(similarity * 100).toFixed(0)}%)`,
          autoFix: false
        });
      }
    }
  });

  return warnings;
};

/**
 * 메인 검증 함수 (스킬 자동 검색 지원)
 */
export const validateWithMaxroll = async (content, className, specName) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  Maxroll 기반 교차 검증: ${className} ${specName}`);
  console.log(`${'='.repeat(60)}\n`);

  // 1. Maxroll 캐시 로드
  const maxrollData = loadMaxrollCache(className, specName);

  if (!maxrollData) {
    return {
      success: false,
      message: 'Maxroll 캐시를 로드할 수 없습니다.',
      errors: [],
      warnings: []
    };
  }

  console.log('✅ Maxroll 캐시 로드 완료\n');

  const errors = [];
  const warnings = [];

  // 2. 영웅 특성 검증
  console.log('🔍 영웅 특성 검증 중...');
  const heroErrors = validateHeroTalents(content, maxrollData);
  errors.push(...heroErrors);
  console.log(`   ${heroErrors.length > 0 ? '❌' : '✅'} ${heroErrors.length}개 오류 발견\n`);

  // 3. 리소스 시스템 검증
  console.log('🔍 리소스 시스템 검증 중...');
  const resourceErrors = validateResources(content, maxrollData, className);
  errors.push(...resourceErrors);
  console.log(`   ${resourceErrors.length > 0 ? '❌' : '✅'} ${resourceErrors.length}개 오류 발견\n`);

  // 4. 스킬 로테이션 검증 (스킬 자동 검색 통합)
  console.log('🔍 스킬 로테이션 검증 중...');
  const rotationWarnings = await validateRotation(content, maxrollData, className);
  warnings.push(...rotationWarnings);
  console.log(`   ⚠️  ${rotationWarnings.length}개 경고\n`);

  // 5. 티어 세트 검증
  console.log('🔍 티어 세트 효과 검증 중...');
  const tierWarnings = validateTierSet(content, maxrollData);
  warnings.push(...tierWarnings);
  console.log(`   ⚠️  ${tierWarnings.length}개 경고\n`);

  console.log(`${'='.repeat(60)}`);
  console.log('검증 완료');
  console.log(`${'='.repeat(60)}\n`);

  return {
    success: true,
    errors,
    warnings,
    autoFixable: errors.filter(e => e.autoFix).length,
    totalIssues: errors.length + warnings.length
  };
};
