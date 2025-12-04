/**
 * GuideHooks.js
 * WoW 전문화 가이드 공통 React Hooks
 *
 * 목적: 모든 가이드에서 반복되는 hooks를 재사용
 *
 * 포함된 hooks:
 * - useGuideNavigation: 스크롤 추적 및 네비게이션
 * - useToast: 토스트 알림 관리
 * - useSelection: 영웅 특성/빌드/스탯 선택 관리
 * - useCopyToClipboard: 클립보드 복사 기능
 */

import { useState, useEffect, useRef } from 'react';

/**
 * useGuideNavigation
 * 스크롤 위치를 추적하고 활성 섹션/서브섹션을 관리합니다.
 *
 * @param {Object} config - 설정 객체
 * @param {Array<string>} config.mainSections - 메인 섹션 ID 배열 (예: ['overview', 'rotation', 'builds', 'stats'])
 * @param {Array<string>} config.subSections - 서브섹션 ID 배열 (예: ['overview-intro', 'overview-resource', ...])
 * @param {string} config.defaultSection - 기본 활성 섹션 (기본값: 첫 번째 섹션)
 * @param {number} config.scrollOffset - 스크롤 오프셋 (기본값: 150)
 *
 * @returns {Object} {
 *   activeSection,
 *   activeSubSection,
 *   sectionRefs,
 *   subSectionRefs,
 *   scrollToSection,
 *   scrollToSubSection
 * }
 */
export const useGuideNavigation = ({
  mainSections = ['overview', 'rotation', 'builds', 'stats'],
  subSections = [],
  defaultSection = null,
  scrollOffset = 150
} = {}) => {
  const [activeSection, setActiveSection] = useState(defaultSection || mainSections[0]);
  const [activeSubSection, setActiveSubSection] = useState('');

  // Refs 생성
  const sectionRefs = useRef({});
  const subSectionRefs = useRef({});

  // Refs 초기화
  useEffect(() => {
    mainSections.forEach(id => {
      if (!sectionRefs.current[id]) {
        sectionRefs.current[id] = { current: null };
      }
    });

    subSections.forEach(id => {
      if (!subSectionRefs.current[id]) {
        subSectionRefs.current[id] = { current: null };
      }
    });
  }, [mainSections, subSections]);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + scrollOffset;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // 페이지 끝에 도달했는지 확인
      const isAtBottom = scrollPosition + windowHeight >= fullHeight - 100;

      if (isAtBottom) {
        // 페이지 끝에 도달하면 마지막 섹션 활성화
        const lastSection = mainSections[mainSections.length - 1];
        setActiveSection(lastSection);

        const lastSectionSubSections = subSections.filter(key =>
          key.startsWith(lastSection + '-')
        );
        if (lastSectionSubSections.length > 0) {
          setActiveSubSection(lastSectionSubSections[lastSectionSubSections.length - 1]);
        }
      } else {
        // 메인 섹션 확인
        let currentSection = defaultSection || mainSections[0];
        mainSections.forEach(key => {
          const element = sectionRefs.current[key]?.current;
          if (element) {
            const { offsetTop } = element;
            if (scrollPosition >= offsetTop - 10) {
              currentSection = key;
            }
          }
        });
        setActiveSection(currentSection);

        // 서브섹션 확인
        let currentSubSection = '';
        subSections.forEach(key => {
          const element = subSectionRefs.current[key]?.current;
          if (element) {
            const { offsetTop } = element;
            if (scrollPosition >= offsetTop - 10) {
              currentSubSection = key;
            }
          }
        });
        setActiveSubSection(currentSubSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 실행

    return () => window.removeEventListener('scroll', handleScroll);
  }, [mainSections, subSections, defaultSection, scrollOffset]);

  const scrollToSection = (sectionId) => {
    sectionRefs.current[sectionId]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSubSection = (subSectionId) => {
    subSectionRefs.current[subSectionId]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    activeSection,
    activeSubSection,
    sectionRefs: sectionRefs.current,
    subSectionRefs: subSectionRefs.current,
    scrollToSection,
    scrollToSubSection
  };
};

/**
 * useToast
 * 토스트 알림을 관리합니다 (복사 알림, 업데이트 알림 등).
 *
 * @param {number} duration - 토스트 표시 시간 (밀리초, 기본값: 3000)
 *
 * @returns {Object} {
 *   showToast,
 *   showUpdateToast,
 *   triggerToast,
 *   triggerUpdateToast
 * }
 */
export const useToast = (duration = 3000) => {
  const [showToast, setShowToast] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), duration);
  };

  const triggerUpdateToast = () => {
    setShowUpdateToast(true);
    setTimeout(() => setShowUpdateToast(false), duration);
  };

  return {
    showToast,
    showUpdateToast,
    triggerToast,
    triggerUpdateToast
  };
};

/**
 * useSelection
 * 영웅 특성, 빌드, 스탯 모드 등의 선택 상태를 관리합니다.
 *
 * @param {Object} defaults - 기본값 객체
 * @param {string} defaults.heroTalent - 기본 영웅 특성 (예: 'slayer')
 * @param {string} defaults.build - 기본 빌드 (예: 'raid-single')
 * @param {string} defaults.statHero - 기본 스탯 영웅 특성
 * @param {string} defaults.statMode - 기본 스탯 모드 (예: 'single')
 *
 * @returns {Object} {
 *   selectedTier,
 *   selectedBuild,
 *   selectedStatHero,
 *   selectedStatMode,
 *   setSelectedTier,
 *   setSelectedBuild,
 *   setSelectedStatHero,
 *   setSelectedStatMode
 * }
 */
export const useSelection = ({
  heroTalent = '',
  build = '',
  statHero = '',
  statMode = 'single'
} = {}) => {
  const [selectedTier, setSelectedTier] = useState(heroTalent);
  const [selectedBuild, setSelectedBuild] = useState(build);
  const [selectedStatHero, setSelectedStatHero] = useState(statHero || heroTalent);
  const [selectedStatMode, setSelectedStatMode] = useState(statMode);

  return {
    selectedTier,
    selectedBuild,
    selectedStatHero,
    selectedStatMode,
    setSelectedTier,
    setSelectedBuild,
    setSelectedStatHero,
    setSelectedStatMode
  };
};

/**
 * useCopyToClipboard
 * 클립보드에 텍스트를 복사하고 결과를 반환합니다.
 *
 * @param {Function} onSuccess - 복사 성공 시 콜백 (선택)
 * @param {Function} onError - 복사 실패 시 콜백 (선택)
 *
 * @returns {Object} {
 *   copyToClipboard,
 *   isCopied,
 *   error
 * }
 */
export const useCopyToClipboard = (onSuccess, onError) => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState(null);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setError(null);

      if (onSuccess) onSuccess();

      // 3초 후 isCopied 상태 초기화
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      setError(err);
      setIsCopied(false);

      if (onError) onError(err);
    }
  };

  return {
    copyToClipboard,
    isCopied,
    error
  };
};

/**
 * 사용 예시:
 *
 * import {
 *   useGuideNavigation,
 *   useToast,
 *   useSelection,
 *   useCopyToClipboard
 * } from './guide-modules/GuideHooks.js';
 *
 * function FrostDeathKnightGuide() {
 *   // 네비게이션
 *   const {
 *     activeSection,
 *     activeSubSection,
 *     sectionRefs,
 *     subSectionRefs,
 *     scrollToSection,
 *     scrollToSubSection
 *   } = useGuideNavigation({
 *     mainSections: ['overview', 'rotation', 'builds', 'stats'],
 *     subSections: ['overview-intro', 'overview-resource', 'rotation-tier', ...]
 *   });
 *
 *   // 토스트
 *   const {
 *     showToast,
 *     showUpdateToast,
 *     triggerToast,
 *     triggerUpdateToast
 *   } = useToast();
 *
 *   // 선택
 *   const {
 *     selectedTier,
 *     selectedBuild,
 *     setSelectedTier,
 *     setSelectedBuild
 *   } = useSelection({
 *     heroTalent: 'mountainthane',
 *     build: 'raid-single'
 *   });
 *
 *   // 복사
 *   const { copyToClipboard } = useCopyToClipboard(triggerToast);
 *
 *   return (
 *     <div>
 *       <button onClick={() => copyToClipboard('텍스트')}>
 *         복사
 *       </button>
 *       {showToast && <CopyToast>복사되었습니다!</CopyToast>}
 *     </div>
 *   );
 * }
 */
