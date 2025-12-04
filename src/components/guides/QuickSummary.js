// ============================================================
// QuickSummary Component - 다크 아카데믹 스타일 빠른 요약
// ============================================================
// styled-components 기반 재구축
// 난이도/역할/플레이스타일 한눈에 표시
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// ============================================================
// Styled Components
// ============================================================

const SummaryContainer = styled.section`
  margin: 2rem auto;
  max-width: ${props => props.theme.layout.maxContentWidth};
  padding: 0 2rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0 1rem;
  }
`;

const SummaryCard = styled.div`
  background: ${props => props.theme.colors.background.surface};
  border-left: 4px solid ${props => props.classColor};
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

const SummaryTitle = styled.h2`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.classColor};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.lg};
    margin-bottom: 1rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const InfoIcon = styled.span`
  font-size: 2.5rem;
  line-height: 1;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.tertiary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.span`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`;

const DifficultyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => {
    if (props.difficulty === '초급') return props.theme.colors.status.success + '20';
    if (props.difficulty === '중급') return props.theme.colors.status.warning + '20';
    if (props.difficulty === '상급') return props.theme.colors.status.error + '20';
    return props.theme.colors.background.elevated;
  }};
  color: ${props => {
    if (props.difficulty === '초급') return props.theme.colors.status.success;
    if (props.difficulty === '중급') return props.theme.colors.status.warning;
    if (props.difficulty === '상급') return props.theme.colors.status.error;
    return props.theme.colors.text.primary;
  }};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.sm};
    padding: 0.2rem 0.5rem;
  }
`;

// ============================================================
// Main Component
// ============================================================

/**
 * QuickSummary - 다크 아카데믹 스타일 빠른 요약 카드
 *
 * @param {string} difficulty - 난이도 (초급/중급/상급)
 * @param {string} role - 역할 (딜러/힐러/탱커)
 * @param {string} resourceType - 자원 유형 (분노/마나/집중 등)
 * @param {string} rangeType - 사거리 유형 (근접/원거리)
 * @param {string} playstyle - 플레이스타일 설명
 * @param {string} color - WoW 클래스 색상
 */
const QuickSummary = ({
  difficulty,
  role,
  resourceType,
  rangeType,
  playstyle,
  color
}) => {
  // 아이콘 매핑
  const roleIcon = {
    '딜러': '⚔️',
    'DPS': '⚔️',
    '힐러': '💚',
    'Healer': '💚',
    '탱커': '🛡️',
    'Tank': '🛡️'
  }[role] || '⚔️';

  const rangeIcon = {
    '근접': '🗡️',
    'Melee': '🗡️',
    '원거리': '🏹',
    'Ranged': '🏹'
  }[rangeType] || '🗡️';

  return (
    <SummaryContainer>
      <SummaryCard classColor={color}>
        <SummaryTitle classColor={color}>
          <span>📋</span>
          빠른 요약
        </SummaryTitle>

        <InfoGrid>
          {/* 난이도 */}
          {difficulty && (
            <InfoItem>
              <InfoIcon>🎯</InfoIcon>
              <InfoContent>
                <InfoLabel>난이도</InfoLabel>
                <DifficultyBadge difficulty={difficulty}>
                  {difficulty}
                </DifficultyBadge>
              </InfoContent>
            </InfoItem>
          )}

          {/* 역할 */}
          {role && (
            <InfoItem>
              <InfoIcon>{roleIcon}</InfoIcon>
              <InfoContent>
                <InfoLabel>역할</InfoLabel>
                <InfoValue>{role}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}

          {/* 사거리 */}
          {rangeType && (
            <InfoItem>
              <InfoIcon>{rangeIcon}</InfoIcon>
              <InfoContent>
                <InfoLabel>사거리</InfoLabel>
                <InfoValue>{rangeType}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}

          {/* 자원 유형 */}
          {resourceType && (
            <InfoItem>
              <InfoIcon>💎</InfoIcon>
              <InfoContent>
                <InfoLabel>자원</InfoLabel>
                <InfoValue>{resourceType}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}
        </InfoGrid>

        {/* 플레이스타일 */}
        {playstyle && (
          <InfoContent style={{ marginTop: '1.5rem' }}>
            <InfoLabel>플레이스타일</InfoLabel>
            <InfoValue style={{
              fontSize: '1rem',
              fontWeight: 400,
              lineHeight: 1.8,
              color: '#CBD5E1'
            }}>
              {playstyle}
            </InfoValue>
          </InfoContent>
        )}
      </SummaryCard>
    </SummaryContainer>
  );
};

QuickSummary.propTypes = {
  difficulty: PropTypes.string,
  role: PropTypes.string,
  resourceType: PropTypes.string,
  rangeType: PropTypes.string,
  playstyle: PropTypes.string,
  color: PropTypes.string.isRequired
};

export default QuickSummary;
