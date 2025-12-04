/**
 * SemanticMatcher.js
 * 의미론적 유사도 판단 시스템
 *
 * 기능:
 * - 한글 ↔ 영어 번역 매핑
 * - Levenshtein 거리 기반 유사도 계산
 * - 한글 조사 제거 (형태소 분석)
 * - 부분 일치 허용 (오타 처리)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 스킬 데이터베이스 로드 (번역 매핑용)
 */
let skillDatabase = null;

const loadSkillDatabase = () => {
  if (skillDatabase) return skillDatabase;

  try {
    const dbPath = path.join(__dirname, '..', '..', 'database-builder', 'tww-s3-refined-database.json');
    const dbContent = fs.readFileSync(dbPath, 'utf-8');
    skillDatabase = JSON.parse(dbContent);
    return skillDatabase;
  } catch (error) {
    console.warn('⚠️  스킬 데이터베이스 로드 실패:', error.message);
    return {};
  }
};

/**
 * 번역 매핑 생성
 */
const buildTranslationMap = () => {
  const db = loadSkillDatabase();
  const translationMap = {};

  // 모든 클래스의 모든 스킬 순회
  Object.values(db).forEach(classData => {
    if (typeof classData === 'object') {
      Object.values(classData).forEach(skill => {
        if (skill && skill.koreanName && skill.englishName) {
          // 양방향 매핑
          translationMap[skill.englishName.toLowerCase()] = skill.koreanName;
          translationMap[skill.koreanName] = skill.englishName;
        }
      });
    }
  });

  // 추가 수동 매핑 (클래스명, 리소스명 등)
  const manualMappings = {
    // 클래스
    'death knight': '죽음의 기사',
    'deathknight': '죽음의 기사',
    'mage': '마법사',
    'warrior': '전사',
    'paladin': '성기사',
    'hunter': '사냥꾼',
    'rogue': '도적',
    'priest': '사제',
    'shaman': '주술사',
    'warlock': '흑마법사',
    'monk': '수도사',
    'druid': '드루이드',
    'demon hunter': '악마사냥꾼',
    'demonhunter': '악마사냥꾼',
    'evoker': '기원사',

    // 영웅 특성 (죽음의 기사)
    'deathbringer': '죽음인도자',
    'rider of the apocalypse': '종말의 기수',
    'san\'layn': '산레인',

    // 영웅 특성 (마법사)
    'sunfury': '성난태양',
    'spellslinger': '주문술사',
    'frostfire': '서리불꽃',

    // 영웅 특성 (전사)
    'slayer': '학살자',
    'mountain thane': '산왕',
    'mountainthane': '산왕',
    'colossus': '거신',

    // 리소스
    'runic power': '룬 마력',
    'rune': '룬',
    'mana': '마나',
    'focus': '집중',
    'energy': '기력',
    'rage': '분노',
    'holy power': '신성한 힘',

    // 피해 타입
    'frost': '냉기',
    'fire': '화염',
    'arcane': '비전',
    'shadow': '암흑',
    'nature': '자연',
    'holy': '신성',
    'physical': '물리',

    // 스탯
    'haste': '가속',
    'mastery': '특화',
    'critical strike': '치명타',
    'crit': '치명타',
    'versatility': '유연성'
  };

  Object.entries(manualMappings).forEach(([en, ko]) => {
    translationMap[en.toLowerCase()] = ko;
    translationMap[ko] = en;
  });

  return translationMap;
};

// 번역 맵 초기화
let TRANSLATION_MAP = null;
const getTranslationMap = () => {
  if (!TRANSLATION_MAP) {
    TRANSLATION_MAP = buildTranslationMap();
  }
  return TRANSLATION_MAP;
};

/**
 * Levenshtein 거리 계산
 * @param {string} str1
 * @param {string} str2
 * @returns {number} 유사도 (0.0 ~ 1.0)
 */
const calculateLevenshteinSimilarity = (str1, str2) => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;

  const len1 = s1.length;
  const len2 = s2.length;

  if (len1 === 0 || len2 === 0) return 0.0;

  // DP 배열
  const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // 삭제
        matrix[i][j - 1] + 1,      // 삽입
        matrix[i - 1][j - 1] + cost // 교체
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return 1.0 - (distance / maxLen);
};

/**
 * 한글 조사 제거
 * @param {string} text
 * @returns {string} 조사가 제거된 텍스트
 */
const removeKoreanSuffix = (text) => {
  // 주격 조사: 이, 가
  // 목적격 조사: 을, 를
  // 관형격 조사: 의
  // 부사격 조사: 에, 에서, 로, 으로
  // 보조사: 은, 는, 도, 만
  const suffixes = [
    '이가', '이는', '이도', '이만',
    '가', '이', '을', '를', '의',
    '에서', '으로', '로', '에',
    '은', '는', '도', '만', '와', '과'
  ];

  let result = text.trim();

  for (const suffix of suffixes) {
    if (result.endsWith(suffix)) {
      result = result.slice(0, -suffix.length);
      break;
    }
  }

  return result;
};

/**
 * 의미론적 유사도 판단 (메인 함수)
 * @param {string} term1
 * @param {string} term2
 * @param {number} threshold - 유사도 임계값 (기본: 0.8)
 * @returns {boolean} 유사한지 여부
 */
export const isSemanticallySimilar = (term1, term2, threshold = 0.8) => {
  if (!term1 || !term2) return false;

  const t1 = String(term1).trim();
  const t2 = String(term2).trim();

  // 1. 완전 일치
  if (t1 === t2) return true;
  if (t1.toLowerCase() === t2.toLowerCase()) return true;

  // 2. 번역 매핑 확인
  const translationMap = getTranslationMap();

  const t1Lower = t1.toLowerCase();
  const t2Lower = t2.toLowerCase();

  if (translationMap[t1Lower] === t2 || translationMap[t2Lower] === t1) {
    return true;
  }

  // 번역된 값끼리도 비교
  const t1Translated = translationMap[t1Lower];
  const t2Translated = translationMap[t2Lower];

  if (t1Translated && t2Translated && t1Translated === t2Translated) {
    return true;
  }

  // 3. 조사 제거 후 비교 (한글)
  const t1NoSuffix = removeKoreanSuffix(t1);
  const t2NoSuffix = removeKoreanSuffix(t2);

  if (t1NoSuffix === t2NoSuffix) return true;

  // 번역 매핑도 조사 제거 후 재확인
  if (translationMap[t1NoSuffix.toLowerCase()] === t2NoSuffix ||
      translationMap[t2NoSuffix.toLowerCase()] === t1NoSuffix) {
    return true;
  }

  // 4. Levenshtein 유사도 계산
  const similarity = calculateLevenshteinSimilarity(t1, t2);
  if (similarity >= threshold) return true;

  // 5. 부분 일치 (한쪽이 다른 쪽을 포함)
  if (t1.length > 5 && t2.length > 5) {
    if (t1Lower.includes(t2Lower) || t2Lower.includes(t1Lower)) {
      return similarity >= threshold * 0.9; // 임계값 약간 완화
    }
  }

  return false;
};

/**
 * 유사도 점수 반환 (0.0 ~ 1.0)
 * @param {string} term1
 * @param {string} term2
 * @returns {number} 유사도 점수
 */
export const getSimilarityScore = (term1, term2) => {
  if (!term1 || !term2) return 0.0;

  const t1 = String(term1).trim();
  const t2 = String(term2).trim();

  // 1. 완전 일치
  if (t1 === t2 || t1.toLowerCase() === t2.toLowerCase()) {
    return 1.0;
  }

  // 2. 번역 매핑
  const translationMap = getTranslationMap();
  const t1Lower = t1.toLowerCase();
  const t2Lower = t2.toLowerCase();

  if (translationMap[t1Lower] === t2 || translationMap[t2Lower] === t1) {
    return 0.98; // 번역 일치
  }

  // 3. 조사 제거 후 일치
  const t1NoSuffix = removeKoreanSuffix(t1);
  const t2NoSuffix = removeKoreanSuffix(t2);

  if (t1NoSuffix === t2NoSuffix) {
    return 0.95;
  }

  // 4. Levenshtein 거리
  const similarity = calculateLevenshteinSimilarity(t1, t2);

  // 5. 부분 일치 보너스
  if (t1.length > 5 && t2.length > 5) {
    if (t1Lower.includes(t2Lower) || t2Lower.includes(t1Lower)) {
      return Math.max(similarity, 0.75);
    }
  }

  return similarity;
};

/**
 * 배열에서 유사한 항목 찾기
 * @param {string} term
 * @param {string[]} array
 * @param {number} threshold
 * @returns {string|null} 가장 유사한 항목
 */
export const findSimilarInArray = (term, array, threshold = 0.8) => {
  if (!array || array.length === 0) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const item of array) {
    const score = getSimilarityScore(term, item);
    if (score > bestScore && score >= threshold) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestMatch;
};

/**
 * 번역 조회
 * @param {string} term
 * @returns {string|null} 번역된 용어
 */
export const translate = (term) => {
  if (!term) return null;

  const translationMap = getTranslationMap();
  const termLower = term.toLowerCase().trim();

  return translationMap[termLower] || null;
};
