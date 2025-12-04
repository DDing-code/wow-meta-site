// ============================================================
// AdvancedSection Component - 다크 아카데믹 스타일 심화 전략 섹션
// ============================================================
// styled-components 기반 재구축
// 심화 전략 카드 리스트
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

const TopicsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.paragraph};
`;

const TopicCard = styled.div`
  background: ${props => props.theme.colors.background.surface};
  border-left: 4px solid ${props => props.borderColor};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.cardPadding};
  box-shadow: ${props => props.theme.shadows.card};
  transition: ${props => props.theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.cardHover};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const TopicTitle = styled.h3`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TopicDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
  margin: 0 0 1.5rem 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PointsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PointItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
`;

const PointBullet = styled.span`
  color: ${props => props.color};
  flex-shrink: 0;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

// ============================================================
// Main Component
// ============================================================

/**
 * AdvancedSection - 다크 아카데믹 스타일 심화 전략 섹션
 *
 * @param {Array} advanced - 심화 전략 배열 (title, description, points)
 * @param {string} color - WoW 클래스 색상
 * @param {number} sectionNumber - 섹션 번호 (Icy Veins 스타일)
 */
const AdvancedSection = ({ advanced, color, sectionNumber }) => {
  if (!advanced || advanced.length === 0) {
    return null;
  }

  return (
    <>
      <SectionTitle>
        <span>🎓</span>
        {sectionNumber && `${sectionNumber}. `}심화 전략
      </SectionTitle>

      <TopicsList>
        {advanced.map((topic, index) => (
          <TopicCard key={index} borderColor={color}>
            <TopicTitle>
              <span>🎓</span>
              <span>{topic.title}</span>
            </TopicTitle>

            <TopicDescription>{topic.description}</TopicDescription>

            {topic.points && topic.points.length > 0 && (
              <PointsList>
                {topic.points.map((point, pointIndex) => (
                  <PointItem key={pointIndex}>
                    <PointBullet color={color}>▸</PointBullet>
                    <span>{point}</span>
                  </PointItem>
                ))}
              </PointsList>
            )}
          </TopicCard>
        ))}
      </TopicsList>
    </>
  );
};

AdvancedSection.propTypes = {
  advanced: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      points: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  color: PropTypes.string.isRequired
};

export default AdvancedSection;
