// ============================================================
// TipsSection Component - 다크 아카데믹 스타일 실전 팁 섹션
// ============================================================
// styled-components 기반 재구축
// 실전 팁 카드 그리드
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// ============================================================
// Styled Components
// ============================================================

const SectionTitle = styled.h2`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.subsection} 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const TipCard = styled.div`
  background: ${props => props.theme.colors.background.surface};
  border-left: 4px solid ${props => props.borderColor};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.card};
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: ${props => props.theme.transitions.default};

  &:hover {
    box-shadow: ${props => props.theme.shadows.cardHover};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const TipIcon = styled.span`
  font-size: 1.75rem;
  line-height: 1;
  flex-shrink: 0;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const TipText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
  margin: 0;
  flex: 1;
`;

// ============================================================
// Main Component
// ============================================================

/**
 * TipsSection - 다크 아카데믹 스타일 실전 팁 섹션
 *
 * @param {Array} tips - 팁 문자열 배열
 * @param {string} color - WoW 클래스 색상
 * @param {number} sectionNumber - 섹션 번호 (Icy Veins 스타일)
 */
const TipsSection = ({ tips, color, sectionNumber }) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <>
      <SectionTitle>
        <span>💡</span>
        {sectionNumber && `${sectionNumber}. `}실전 팁
      </SectionTitle>

      <TipsGrid>
        {tips.map((tip, index) => (
          <TipCard key={index} borderColor={color}>
            <TipIcon>💡</TipIcon>
            <TipText>{tip}</TipText>
          </TipCard>
        ))}
      </TipsGrid>
    </>
  );
};

TipsSection.propTypes = {
  tips: PropTypes.arrayOf(PropTypes.string),
  color: PropTypes.string.isRequired
};

export default TipsSection;
