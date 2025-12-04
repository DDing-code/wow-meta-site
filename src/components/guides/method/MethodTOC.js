// ============================================================
// Method.gg 스타일 TOC (Table of Contents)
// ============================================================
// Method.gg의 심플한 TOC 디자인 복제
// - 번호 없음 (텍스트만)
// - 최소한의 디자인
// - 파란색 Active 표시
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// ============================================================
// Styled Components
// ============================================================

const TOCContainer = styled.nav`
  display: flex;
  flex-direction: column;
`;

const TOCTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem 0;
  padding: 0 0.5rem;
`;

const TOCList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TOCItem = styled.li`
  margin: 0;
`;

const TOCLink = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.5rem;
  border: none;
  background: ${props => props.isActive
    ? props.theme.colors.background.elevated
    : 'transparent'};
  color: ${props => props.isActive
    ? props.theme.colors.accent.blue
    : props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.isActive
    ? props.theme.typography.fontWeight.semibold
    : props.theme.typography.fontWeight.regular};
  border-radius: ${props => props.theme.borderRadius.sm};
  border-left: ${props => props.isActive
    ? `2px solid ${props.theme.colors.accent.blue}`
    : '2px solid transparent'};
  transition: ${props => props.theme.transitions.fast};
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.background.elevated};
    color: ${props => props.theme.colors.accent.blueLight};
  }
`;

// ============================================================
// Main Component
// ============================================================

/**
 * MethodTOC - Method.gg 스타일 목차
 *
 * @param {Array} sections - 섹션 목록
 *   [{id: 'intro', title: 'Introduction'}, ...]
 * @param {string} activeSection - 현재 활성 섹션 ID
 * @param {function} onSectionClick - 섹션 클릭 핸들러
 */
const MethodTOC = ({
  sections = [],
  activeSection = '',
  onSectionClick
}) => {
  const handleClick = (sectionId) => {
    // 섹션으로 스크롤
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 콜백 호출
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };

  return (
    <TOCContainer>
      <TOCTitle>Contents</TOCTitle>
      <TOCList>
        {sections.map((section) => (
          <TOCItem key={section.id}>
            <TOCLink
              isActive={activeSection === section.id}
              onClick={() => handleClick(section.id)}
            >
              {section.title}
            </TOCLink>
          </TOCItem>
        ))}
      </TOCList>
    </TOCContainer>
  );
};

MethodTOC.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  activeSection: PropTypes.string,
  onSectionClick: PropTypes.func
};

export default MethodTOC;
