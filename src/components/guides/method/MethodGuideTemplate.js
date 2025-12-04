// ============================================================
// Method.gg 스타일 가이드 템플릿
// ============================================================
// Method.gg의 실제 레이아웃 구조를 완전히 복제
// - 좌측 320px Sticky Sidebar (TOC + Class Icon)
// - 우측 900px Main Content (Hero + Article)
// - 최소주의, 텍스트 중심 디자인
// ============================================================

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import methodTheme from '../../../styles/methodTheme';

// ============================================================
// Styled Components
// ============================================================

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background.main};
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.typography.fontFamily.base};
  font-size: ${props => props.theme.typography.baseFontSize};
  line-height: ${props => props.theme.typography.baseLineHeight};
`;

const LayoutWrapper = styled.div`
  max-width: ${props => props.theme.layout.maxWidth};
  margin: 0 auto;
  display: flex;
  gap: ${props => props.theme.layout.gap};
  padding: 2rem 1rem;

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    flex-direction: column;
    gap: 2rem;
  }
`;

// ============================================================
// 좌측 Sidebar (320px, Sticky)
// ============================================================

const SidebarContainer = styled.aside`
  width: ${props => props.theme.layout.sidebarWidth};
  flex-shrink: 0;
  position: sticky;
  top: 2rem;
  height: fit-content;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.surface};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border.default};
    border-radius: 3px;

    &:hover {
      background: ${props => props.theme.colors.border.emphasis};
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    position: static;
    width: 100%;
    max-height: none;
  }
`;

// ============================================================
// 우측 Main Content (900px)
// ============================================================

const MainContentContainer = styled.main`
  flex: 1;
  max-width: ${props => props.theme.layout.mainContentWidth};
  min-width: 0;

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    max-width: 100%;
  }
`;

// ============================================================
// Main Component
// ============================================================

/**
 * MethodGuideTemplate - Method.gg 스타일 가이드 템플릿
 *
 * @param {React.Node} sidebar - 좌측 Sidebar 콘텐츠 (ClassIcon + TOC)
 * @param {React.Node} hero - Hero Section (Title + Meta + Author)
 * @param {React.Node} children - Article Content (본문)
 * @param {React.Node} footer - Navigation Footer (Continue to...)
 */
const MethodGuideTemplate = ({
  sidebar,
  hero,
  children,
  footer
}) => {
  const [activeSection, setActiveSection] = useState('');

  // 스크롤 추적
  useEffect(() => {
    const handleScroll = () => {
      // Intersection Observer로 현재 보이는 섹션 추적
      const sections = document.querySelectorAll('[data-section-id]');

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          setActiveSection(section.dataset.sectionId);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 실행

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider theme={methodTheme}>
      <PageContainer>
        <LayoutWrapper>
          {/* 좌측 Sidebar */}
          <SidebarContainer>
            {sidebar}
          </SidebarContainer>

          {/* 우측 Main Content */}
          <MainContentContainer>
            {/* Hero Section */}
            {hero}

            {/* Article Content */}
            {children}

            {/* Navigation Footer */}
            {footer}
          </MainContentContainer>
        </LayoutWrapper>
      </PageContainer>
    </ThemeProvider>
  );
};

MethodGuideTemplate.propTypes = {
  sidebar: PropTypes.node.isRequired,
  hero: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node
};

export default MethodGuideTemplate;
