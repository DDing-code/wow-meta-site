// ============================================================
// MechanicsSection Component - 다크 아카데믹 스타일 메커니즘 섹션
// ============================================================
// styled-components 기반 재구축
// 핵심 메커니즘 목록과 팁 표시
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

const MechanicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const MechanicCard = styled.div`
  background: ${props => props.theme.colors.background.surface};
  border-left: 4px solid ${props => props.borderColor};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.cardPadding};
  box-shadow: ${props => props.theme.shadows.card};
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  transition: ${props => props.theme.transitions.default};

  &:hover {
    box-shadow: ${props => props.theme.shadows.cardHover};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const MechanicIcon = styled.div`
  display: flex;
  align-items: center;
  justify-center;
  width: 3rem;
  height: 3rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.iconBg};
  border: 1px solid ${props => props.iconBorder};
  flex-shrink: 0;
  font-size: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.25rem;
  }
`;

const MechanicContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MechanicName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 0.75rem 0;
`;

const MechanicDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
  margin: 0 0 1rem 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TipsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TipItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
  line-height: ${props => props.theme.typography.baseLineHeight};
`;

const TipIcon = styled.span`
  color: ${props => props.color};
  flex-shrink: 0;
  line-height: 1;
`;

const TipText = styled.span`
  flex: 1;
`;

// ============================================================
// Main Component
// ============================================================

/**
 * MechanicsSection - 다크 아카데믹 스타일 핵심 메커니즘 섹션
 *
 * @param {Array} mechanics - 메커니즘 배열 (name, icon, description, tips)
 * @param {string} color - WoW 클래스 색상
 * @param {number} sectionNumber - 섹션 번호 (Icy Veins 스타일)
 */
const MechanicsSection = ({ mechanics, color, sectionNumber }) => {
  if (!mechanics || mechanics.length === 0) {
    return null;
  }

  return (
    <>
      <SectionTitle>
        <span>⚙️</span>
        {sectionNumber && `${sectionNumber}. `}핵심 메커니즘
      </SectionTitle>

      <MechanicsGrid>
        {mechanics.map((mechanic, index) => (
          <MechanicCard key={index} borderColor={color}>
            <MechanicIcon
              iconBg={`${color}20`}
              iconBorder={color}
            >
              {mechanic.icon || '⚙️'}
            </MechanicIcon>

            <MechanicContent>
              <MechanicName>{mechanic.name}</MechanicName>
              <MechanicDescription>{mechanic.description}</MechanicDescription>

              {mechanic.tips && mechanic.tips.length > 0 && (
                <TipsList>
                  {mechanic.tips.map((tip, tipIndex) => (
                    <TipItem key={tipIndex}>
                      <TipIcon color={color}>💡</TipIcon>
                      <TipText>{tip}</TipText>
                    </TipItem>
                  ))}
                </TipsList>
              )}
            </MechanicContent>
          </MechanicCard>
        ))}
      </MechanicsGrid>
    </>
  );
};

MechanicsSection.propTypes = {
  mechanics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.string,
      description: PropTypes.string.isRequired,
      tips: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  color: PropTypes.string.isRequired
};

export default MechanicsSection;
