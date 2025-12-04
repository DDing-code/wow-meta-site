/**
 * GuideLayout 모듈
 *
 * 모든 전문화 가이드에서 재사용 가능한 레이아웃 컴포넌트
 * - Sidebar + Main Content 구조
 * - 네비게이션 상태 관리
 * - 스크롤 추적
 * - 테마 색상 지원
 *
 * @example
 * import GuideLayout from '../modules/layout/GuideLayout.js';
 *
 * <GuideLayout
 *   guideName="분노 전사 가이드"
 *   spec="fury"
 *   primaryColor="#C69B6D"
 *   secondaryColor="#1a1a2e"
 *   navigationConfig={furyWarriorConfig.navigationConfig}
 *   metaInfo={furyWarriorConfig.metaInfo}
 * >
 *   <OverviewSection />
 *   <RotationSection />
 * </GuideLayout>
 */

import React, { useState, useEffect, useRef, createContext } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// ============================================
// Context for section refs (하위 섹션에서 ref 등록)
// ============================================
export const LayoutContext = createContext();

// ============================================
// Global Styles & Animations
// ============================================
const GlobalStyle = createGlobalStyle`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

// ============================================
// Styled Components
// ============================================

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.$background || '#0a0a0f'};
  color: ${props => props.$textColor || '#e0e0e0'};
  position: relative;
`;

const Sidebar = styled.nav`
  width: 280px;
  background: ${props => props.$surface || '#15151f'};
  border-right: 1px solid ${props => props.$border || '#2a2a3e'};
  padding: 2rem 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.$background || '#0a0a0f'};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.$primary || '#C79C6E'};
    border-radius: 4px;
  }
`;

const Logo = styled.div`
  text-align: center;
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.$border || '#2a2a3e'};

  h1 {
    font-size: 1.5rem;
    color: ${props => props.$primary || '#C79C6E'};
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  p {
    color: ${props => props.$subtext || '#a0a0a0'};
    font-size: 0.9rem;
  }
`;

const NavSection = styled.div`
  margin: 1.5rem 0;
`;

const NavTitle = styled.h3`
  color: ${props => props.$primary || '#C79C6E'};
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$hover || 'rgba(199, 156, 110, 0.1)'};
  }

  &.active {
    background: ${props => props.$hover || 'rgba(199, 156, 110, 0.1)'};
    border-left: 3px solid ${props => props.$primary || '#C79C6E'};
  }
`;

const NavItem = styled.div`
  color: ${props => props.$textColor || '#a0a0a0'};
  font-size: 0.85rem;
  padding: 0.5rem 1.5rem 0.5rem 2.5rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    color: ${props => props.$primary || '#C79C6E'};
    background: ${props => props.$hover || 'rgba(199, 156, 110, 0.05)'};
  }

  &.active {
    color: ${props => props.$primary || '#C79C6E'};
    background: ${props => props.$hover || 'rgba(199, 156, 110, 0.1)'};
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: ${props => props.$primary || '#C79C6E'};
    }
  }
`;

const MetaInfo = styled.div`
  margin-top: auto;
  padding: 1.5rem;
  border-top: 1px solid ${props => props.$border || '#2a2a3e'};
  font-size: 0.75rem;
  color: ${props => props.$subtext || '#a0a0a0'};

  p {
    margin: 0.25rem 0;
  }

  strong {
    color: ${props => props.$primary || '#C79C6E'};
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  animation: fadeIn 0.5s ease-in-out;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

// ============================================
// 재사용 가능한 Card 컴포넌트
// ============================================
export const Card = styled.div`
  background: ${props => props.$surface || '#15151f'};
  border: 1px solid ${props => props.$border || '#2a2a3e'};
  border-radius: 12px;
  padding: ${props => props.$padding || '2rem'};
  margin-bottom: ${props => props.$marginBottom || '2rem'};
  position: relative;
  overflow: hidden;
  animation: slideIn 0.5s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${props => props.$primary || '#C79C6E'},
      transparent
    );
  }

  h2 {
    color: ${props => props.$primary || '#C79C6E'};
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  h3 {
    color: ${props => props.$primary || '#C79C6E'};
    font-size: 1.3rem;
    margin: 1.5rem 0 1rem;
    font-weight: 600;
  }

  p {
    color: ${props => props.$textColor || '#e0e0e0'};
    line-height: 1.8;
    margin-bottom: 1rem;
  }
`;

// ============================================
// GuideLayout Component
// ============================================
const GuideLayout = ({
  guideName,
  spec,
  primaryColor = '#C79C6E',
  secondaryColor = '#1a1a2e',
  navigationConfig = [],
  metaInfo = {},
  children
}) => {
  const [activeSection, setActiveSection] = useState(navigationConfig[0]?.id || '');
  const [activeSubSection, setActiveSubSection] = useState('');

  // Section refs 관리
  const sectionRefs = useRef({});
  const subSectionRefs = useRef({});

  // Register ref function (하위 섹션에서 호출)
  const registerSectionRef = (sectionId, ref) => {
    sectionRefs.current[sectionId] = ref;
  };

  const registerSubSectionRef = (subSectionId, ref) => {
    subSectionRefs.current[subSectionId] = ref;
  };

  // 색상 테마 객체
  const theme = {
    primary: primaryColor,
    secondary: secondaryColor,
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    border: '#2a2a3e',
    hover: `rgba(${hexToRgb(primaryColor)}, 0.1)`
  };

  // Hex to RGB helper
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '199, 156, 110'; // fallback
  }

  // 스크롤 추적
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      // 서브섹션 체크
      let foundSubSection = false;
      Object.entries(subSectionRefs.current).forEach(([id, ref]) => {
        if (ref && ref.offsetTop <= scrollPosition && ref.offsetTop + ref.offsetHeight > scrollPosition) {
          setActiveSubSection(id);
          foundSubSection = true;
        }
      });

      // 메인 섹션 체크
      if (!foundSubSection) {
        Object.entries(sectionRefs.current).forEach(([id, ref]) => {
          if (ref && ref.offsetTop <= scrollPosition && ref.offsetTop + ref.offsetHeight > scrollPosition) {
            setActiveSection(id);
            setActiveSubSection('');
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 체크

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 네비게이션 클릭 핸들러
  const handleNavClick = (sectionId, subsectionId = null) => {
    if (subsectionId) {
      const element = subSectionRefs.current[subsectionId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      const element = sectionRefs.current[sectionId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <LayoutContext.Provider value={{ registerSectionRef, registerSubSectionRef, theme }}>
      <GlobalStyle />
      <PageWrapper $background={theme.background} $textColor={theme.text}>
        <Sidebar
          $surface={theme.surface}
          $border={theme.border}
          $background={theme.background}
          $primary={theme.primary}
        >
          <Logo $primary={theme.primary} $border={theme.border} $subtext={theme.subtext}>
            <h1>{guideName}</h1>
            <p>{spec.toUpperCase()} 가이드</p>
          </Logo>

          {navigationConfig.map((section) => (
            <NavSection key={section.id}>
              <NavTitle
                className={activeSection === section.id && !activeSubSection ? 'active' : ''}
                onClick={() => handleNavClick(section.id)}
                $primary={theme.primary}
                $hover={theme.hover}
              >
                {section.name}
              </NavTitle>

              {section.subsections?.map((sub) => (
                <NavItem
                  key={sub.id}
                  className={activeSubSection === sub.id ? 'active' : ''}
                  onClick={() => handleNavClick(section.id, sub.id)}
                  $primary={theme.primary}
                  $hover={theme.hover}
                  $textColor={theme.subtext}
                >
                  {sub.name}
                </NavItem>
              ))}
            </NavSection>
          ))}

          <MetaInfo $border={theme.border} $subtext={theme.subtext} $primary={theme.primary}>
            <p><strong>최종 업데이트:</strong> {metaInfo.lastUpdate || '2025.10.03'}</p>
            <p><strong>작성자:</strong> {metaInfo.author || 'WoWMeta'}</p>
            <p><strong>검토자:</strong> {metaInfo.reviewer || '-'}</p>
          </MetaInfo>
        </Sidebar>

        <MainContent>
          {children}
        </MainContent>
      </PageWrapper>
    </LayoutContext.Provider>
  );
};

export default GuideLayout;
