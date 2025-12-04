// ============================================================
// TableOfContents Component - 다크 아카데믹 스타일 목차
// ============================================================
// styled-components 기반 재구축
// 논문 스타일 네비게이션 + 스크롤 스파이
// ============================================================

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// ============================================================
// Styled Components
// ============================================================

const MobileToggle = styled.button`
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: ${props => props.theme.zIndex.sticky};
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.elevated};
  border: 2px solid ${props => props.classColor};
  box-shadow: ${props => props.theme.shadows.cardHover};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};

  &:hover {
    transform: scale(1.05);
  }

  @media (min-width: ${props => props.theme.breakpoints.laptop}) {
    display: none;
  }
`;

const TocContainer = styled.nav`
  position: fixed;
  top: 6rem;
  right: 1rem;
  z-index: ${props => props.theme.zIndex.fixed};
  width: 16rem;
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
  transition: transform ${props => props.theme.transitions.default};
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(calc(100% + 1rem))'};

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.main};
    border-radius: ${props => props.theme.borderRadius.full};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.classColor};
    border-radius: ${props => props.theme.borderRadius.full};
  }

  @media (min-width: ${props => props.theme.breakpoints.laptop}) {
    transform: translateX(0);
  }

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    width: 14rem;
  }
`;

const TocCard = styled.div`
  background: ${props => props.theme.colors.background.surface};
  border-left: 4px solid ${props => props.classColor};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem 1rem;
  box-shadow: ${props => props.theme.shadows.card};
  transition: ${props => props.theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.cardHover};
  }
`;

const TocHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.colors.border.default};
`;

const TocTitle = styled.h3`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  margin: 0;
`;

const SectionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SectionItem = styled.li`
  margin: 0;
`;

const SectionButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: none;
  background: ${props => props.isActive ? props.theme.colors.background.elevated : 'transparent'};
  color: ${props => props.isActive ? props.theme.colors.accent.orange : props.theme.colors.text.secondary};
  border-left: ${props => props.isActive ? `3px solid ${props.theme.colors.accent.orange}` : '3px solid transparent'};
  padding-left: ${props => props.isActive ? '9px' : '0.75rem'};
  font-weight: ${props => props.isActive ? props.theme.typography.fontWeight.semibold : props.theme.typography.fontWeight.regular};
  transition: ${props => props.theme.transitions.default};

  &:hover {
    background: ${props => props.theme.colors.background.elevated};
    color: ${props => props.theme.colors.accent.orange};
    transform: translateX(4px);
  }
`;

const IconSpan = styled.span`
  font-size: ${props => props.theme.typography.fontSize.base};
`;

const TitleSpan = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ProgressSection = styled.div`
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${props => props.theme.colors.border.default};
`;

const ProgressLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.muted};
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: ${props => props.theme.colors.background.elevated};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg,
    ${props => props.theme.colors.accent.orangeDark},
    ${props => props.theme.colors.accent.orange}
  );
  border-radius: ${props => props.theme.borderRadius.full};
  transition: width ${props => props.theme.transitions.default};
  width: ${props => props.progress}%;
  box-shadow: 0 0 8px ${props => props.theme.colors.accent.orangeGlow};
`;

// ============================================================
// Main Component
// ============================================================

/**
 * TableOfContents - 다크 아카데믹 스타일 가이드 목차
 *
 * @param {Array} sections - 섹션 목록 [{ id, title, icon }]
 * @param {string} color - WoW 클래스 색상
 */
const TableOfContents = ({ sections, color }) => {
  const [activeSection, setActiveSection] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 실행

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // 헤더 높이
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      setIsOpen(false); // 모바일에서 클릭 후 닫기
    }
  };

  const currentIndex = sections.findIndex((s) => s.id === activeSection);
  const progress = ((currentIndex + 1) / sections.length) * 100;

  return (
    <>
      {/* Mobile Toggle Button */}
      <MobileToggle
        onClick={() => setIsOpen(!isOpen)}
        classColor={color}
      >
        <span>{isOpen ? '✕' : '☰'}</span>
      </MobileToggle>

      {/* Table of Contents */}
      <TocContainer isOpen={isOpen} classColor={color}>
        <TocCard classColor={color}>
          {/* Header */}
          <TocHeader>
            <span>📑</span>
            <TocTitle>목차</TocTitle>
          </TocHeader>

          {/* Sections */}
          <SectionList>
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <SectionItem key={section.id}>
                  <SectionButton
                    onClick={() => scrollToSection(section.id)}
                    isActive={isActive}
                    classColor={color}
                  >
                    <IconSpan>{section.icon}</IconSpan>
                    <TitleSpan>
                      {section.number && `${section.number}. `}{section.title}
                    </TitleSpan>
                  </SectionButton>
                </SectionItem>
              );
            })}
          </SectionList>

          {/* Progress Indicator */}
          <ProgressSection>
            <ProgressLabel>
              <span>진행률</span>
              <ProgressBar>
                <ProgressFill progress={progress} classColor={color} />
              </ProgressBar>
              <span>
                {currentIndex + 1}/{sections.length}
              </span>
            </ProgressLabel>
          </ProgressSection>
        </TocCard>
      </TocContainer>
    </>
  );
};

TableOfContents.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string
    })
  ).isRequired,
  color: PropTypes.string.isRequired
};

export default TableOfContents;
