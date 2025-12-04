// ============================================================
// Skill Hub Context - 중앙 스킬 데이터 허브
// ============================================================
// 목적: 모든 컴포넌트에 스킬 DB를 제공하는 단일 진실의 원천
// 업데이트: 2025-11-18
// 데이터 소스: Obsidian Knowledge Base (WoW-Meta-Knowledge/03-직업별-Knowledge-Base)
// ============================================================

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import kbData from '../data/kb-skills.json';

const SkillHubContext = createContext();

/**
 * Skill Hub Provider - 전역 스킬 데이터 제공자
 *
 * 기능:
 * - 중앙 집중식 스킬 데이터베이스 (KB 기반, 자동 동기화)
 * - 클래스/전문화별 필터링
 * - 실시간 검색
 * - ID 기반 조회
 *
 * 데이터 소스:
 * - Obsidian KB (WoW-Meta-Knowledge/03-직업별-Knowledge-Base)
 * - 빌드 시 자동 생성 (scripts/kb-sync/kb-to-skill-json.js)
 * - 개발 시 자동 감시 (scripts/kb-sync/kb-skill-watcher.js)
 */
export const SkillHubProvider = ({ children }) => {
  // 전체 스킬 데이터베이스 (KB → JSON 변환)
  // kb-skills.json은 { metadata, skills: { [id]: {...} } } 구조
  // Object.values()로 배열 변환하여 기존 API 호환성 유지
  const [skills] = useState(() => Object.values(kbData.skills || {}));

  // 필터 상태
  const [filters, setFilters] = useState({
    class: null,      // 예: 'WARRIOR', 'MAGE'
    spec: null,       // 예: '분노', '비전'
    type: null,       // 예: '기본', '특성'
    search: ''        // 검색어
  });

  /**
   * 클래스/전문화별 스킬 조회
   * @param {string} className - 클래스명 (영어 대문자, 예: 'MAGE')
   * @param {string} specName - 전문화명 (한글, 예: '비전')
   * @returns {Array} 필터링된 스킬 배열
   */
  const getSkills = useCallback((className, specName) => {
    if (!className) return skills;

    return skills.filter(skill => {
      // 클래스 매치
      const classMatch = skill.class === className.toUpperCase();

      // 전문화 매치 (공용 스킬 포함)
      const specMatch = !specName ||
                       skill.spec === specName ||
                       skill.spec === '공용' ||
                       skill.spec === 'Common';

      return classMatch && specMatch;
    });
  }, [skills]);

  /**
   * 스킬 검색 (한글/영문 모두 지원)
   * @param {string} query - 검색어
   * @returns {Array} 검색 결과 배열
   */
  const searchSkills = useCallback((query) => {
    if (!query || query.trim() === '') return [];

    const lowerQuery = query.toLowerCase();

    return skills.filter(skill => {
      const koreanMatch = skill.koreanName &&
                          skill.koreanName.toLowerCase().includes(lowerQuery);
      const englishMatch = skill.englishName &&
                           skill.englishName.toLowerCase().includes(lowerQuery);
      const descMatch = skill.description &&
                        skill.description.toLowerCase().includes(lowerQuery);

      return koreanMatch || englishMatch || descMatch;
    });
  }, [skills]);

  /**
   * ID로 스킬 단일 조회
   * @param {string|number} id - 스킬 ID
   * @returns {Object|null} 스킬 객체 또는 null
   */
  const getSkillById = useCallback((id) => {
    if (!id) return null;
    return skills.find(skill => skill.id === id.toString());
  }, [skills]);

  /**
   * 클래스의 모든 스킬 조회 (전문화 구분 없이)
   * @param {string} className - 클래스명
   * @returns {Array} 해당 클래스의 모든 스킬
   */
  const getAllClassSkills = useCallback((className) => {
    if (!className) return [];
    return skills.filter(skill => skill.class === className.toUpperCase());
  }, [skills]);

  /**
   * 전문화별 스킬 그룹화
   * @param {string} className - 클래스명
   * @returns {Object} 전문화를 키로 가지는 객체 { '분노': [...], '무기': [...] }
   */
  const getSkillsBySpecGroups = useCallback((className) => {
    const classSkills = getAllClassSkills(className);
    const groups = {};

    classSkills.forEach(skill => {
      const specKey = skill.spec || '공용';
      if (!groups[specKey]) {
        groups[specKey] = [];
      }
      groups[specKey].push(skill);
    });

    return groups;
  }, [getAllClassSkills]);

  /**
   * 필터 적용 (복합 필터)
   * @returns {Array} 필터링된 스킬 배열
   */
  const getFilteredSkills = useCallback(() => {
    let filtered = skills;

    // 클래스 필터
    if (filters.class) {
      filtered = filtered.filter(skill => skill.class === filters.class.toUpperCase());
    }

    // 전문화 필터
    if (filters.spec) {
      filtered = filtered.filter(skill =>
        skill.spec === filters.spec || skill.spec === '공용'
      );
    }

    // 타입 필터
    if (filters.type) {
      filtered = filtered.filter(skill => skill.type === filters.type);
    }

    // 검색 필터
    if (filters.search) {
      const lowerSearch = filters.search.toLowerCase();
      filtered = filtered.filter(skill =>
        skill.koreanName.toLowerCase().includes(lowerSearch) ||
        skill.englishName.toLowerCase().includes(lowerSearch) ||
        skill.description.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [skills, filters]);

  /**
   * 스킬 통계 계산
   * @returns {Object} 통계 객체
   */
  const getStatistics = useMemo(() => {
    const stats = {
      total: skills.length,
      byClass: {},
      byType: {},
      bySpec: {}
    };

    skills.forEach(skill => {
      // 클래스별 카운트
      const classKey = skill.class || 'Unknown';
      stats.byClass[classKey] = (stats.byClass[classKey] || 0) + 1;

      // 타입별 카운트
      const typeKey = skill.type || 'Unknown';
      stats.byType[typeKey] = (stats.byType[typeKey] || 0) + 1;

      // 전문화별 카운트
      const specKey = skill.spec || 'Unknown';
      stats.bySpec[specKey] = (stats.bySpec[specKey] || 0) + 1;
    });

    return stats;
  }, [skills]);

  // Context 값
  const value = useMemo(() => ({
    // 상태
    skills,
    filters,

    // 필터 관리
    setFilters,

    // 조회 함수
    getSkills,
    searchSkills,
    getSkillById,
    getAllClassSkills,
    getSkillsBySpecGroups,
    getFilteredSkills,

    // 통계
    statistics: getStatistics
  }), [
    skills,
    filters,
    getSkills,
    searchSkills,
    getSkillById,
    getAllClassSkills,
    getSkillsBySpecGroups,
    getFilteredSkills,
    getStatistics
  ]);

  return (
    <SkillHubContext.Provider value={value}>
      {children}
    </SkillHubContext.Provider>
  );
};

/**
 * Skill Hub Hook - Context 사용을 위한 커스텀 훅
 * @returns {Object} SkillHub context 값
 * @throws {Error} Provider 외부에서 사용 시 에러
 */
export const useSkillHub = () => {
  const context = useContext(SkillHubContext);

  if (!context) {
    throw new Error('useSkillHub must be used within a SkillHubProvider');
  }

  return context;
};

export default SkillHubContext;
