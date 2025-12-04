// ============================================================
// Method.gg 스타일 Sidebar
// ============================================================
// Method.gg의 좌측 Sidebar 디자인 복제
// - 클래스 아이콘 + 이름
// - TOC
// - 최소한의 디자인
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MethodTOC from './MethodTOC';

// ============================================================
// Styled Components
// ============================================================

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ClassSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${props => props.theme.colors.background.surface};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const ClassIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background.elevated};
  border: 2px solid ${props => props.classColor};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 32px;
`;

const ClassName = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
`;

const SpecName = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${props => props.theme.colors.border.default};
`;

// ============================================================
// Main Component
// ============================================================

/**
 * MethodSidebar - Method.gg 스타일 좌측 사이드바
 *
 * @param {string} className - 클래스 영문명
 * @param {string} classNameKo - 클래스 한글명
 * @param {string} specNameKo - 전문화 한글명
 * @param {string} color - WoW 클래스 색상
 * @param {string} icon - 클래스/전문화 아이콘 (emoji)
 * @param {Array} sections - TOC 섹션 목록
 * @param {string} activeSection - 현재 활성 섹션 ID
 * @param {function} onSectionClick - 섹션 클릭 핸들러
 */
const MethodSidebar = ({
  className,
  classNameKo,
  specNameKo,
  color,
  icon,
  sections,
  activeSection,
  onSectionClick
}) => {
  return (
    <SidebarWrapper>
      {/* 클래스/전문화 정보 */}
      <ClassSection>
        <ClassIcon classColor={color}>
          {icon || '⚔️'}
        </ClassIcon>
        <ClassName>{classNameKo}</ClassName>
        <SpecName>{specNameKo}</SpecName>
      </ClassSection>

      <Divider />

      {/* TOC */}
      <MethodTOC
        sections={sections}
        activeSection={activeSection}
        onSectionClick={onSectionClick}
      />
    </SidebarWrapper>
  );
};

MethodSidebar.propTypes = {
  className: PropTypes.string.isRequired,
  classNameKo: PropTypes.string.isRequired,
  specNameKo: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.string,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  activeSection: PropTypes.string,
  onSectionClick: PropTypes.func
};

export default MethodSidebar;
