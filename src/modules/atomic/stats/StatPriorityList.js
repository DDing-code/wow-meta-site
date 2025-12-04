/**
 * StatPriorityList 모듈
 *
 * 스탯 우선순위 및 브레이크포인트 표시
 * - 스탯 우선순위 (화살표 연결)
 * - 상세 설명
 * - 브레이크포인트 테이블
 *
 * @example
 * import StatPriorityList from '../modules/atomic/stats/StatPriorityList.js';
 *
 * <StatPriorityList
 *   statData={statsData.hero1.single}
 *   primaryColor="#C69B6D"
 * />
 */

import React from 'react';
import styled from 'styled-components';

// ============================================
// Styled Components
// ============================================

const Container = styled.div`
  margin: 1.5rem 0;
`;

const PriorityChain = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, ${props => hexToRgba(props.$primary, 0.1)}, transparent);
  border-radius: 12px;
  flex-wrap: wrap;
`;

const StatBadge = styled.div`
  background: ${props => props.$primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  animation: fadeInScale 0.5s ease-in-out;
  animation-delay: ${props => props.$delay}s;
  opacity: 0;
  animation-fill-mode: forwards;

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Arrow = styled.div`
  color: ${props => props.$primary};
  font-size: 1.5rem;
  font-weight: bold;
  animation: pulse 2s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;

  @keyframes pulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
`;

const Description = styled.p`
  color: #d0d0d0;
  font-size: 0.95rem;
  line-height: 1.8;
  margin: 1rem 0;
  text-align: justify;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border-left: 3px solid ${props => props.$primary};
`;

const BreakpointTable = styled.div`
  margin-top: 1.5rem;
  border: 1px solid ${props => props.$borderColor || '#2a2a3e'};
  border-radius: 12px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: ${props => props.$primary};
  color: white;
  padding: 1rem;
  font-weight: bold;
  font-size: 1.1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 1rem;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.$borderColor || '#2a2a3e'};
  transition: all 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => hexToRgba(props.$primary, 0.1)};
  }

  .stat {
    color: ${props => props.$primary};
    font-weight: bold;
  }

  .value {
    color: #22c55e;
    font-weight: bold;
  }

  .effect {
    color: #d0d0d0;
  }
`;

const Explanation = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => hexToRgba(props.$primary, 0.15)};
  border-radius: 8px;
  border-left: 3px solid ${props => props.$primary};

  strong {
    color: ${props => props.$primary};
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  p {
    color: #e0e0e0;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    line-height: 1.6;
  }
`;

// ============================================
// Helper Functions
// ============================================

function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================
// StatPriorityList Component
// ============================================

const StatPriorityList = ({ statData, primaryColor = '#C69B6D' }) => {
  if (!statData) {
    return <p style={{ color: '#a0a0a0' }}>스탯 데이터가 없습니다.</p>;
  }

  const { priority = [], description, breakpoints = [], explanation } = statData;

  return (
    <Container>
      {priority.length > 0 && (
        <PriorityChain $primary={primaryColor}>
          {priority.map((stat, index) => (
            <React.Fragment key={index}>
              <StatBadge $primary={primaryColor} $delay={index * 0.1}>
                {stat}
              </StatBadge>

              {index < priority.length - 1 && (
                <Arrow $primary={primaryColor} $delay={index * 0.1}>▶</Arrow>
              )}
            </React.Fragment>
          ))}
        </PriorityChain>
      )}

      {description && (
        <Description $primary={primaryColor}>
          {description}
        </Description>
      )}

      {breakpoints.length > 0 && (
        <BreakpointTable $borderColor="#2a2a3e">
          <TableHeader $primary={primaryColor}>
            <div>스탯</div>
            <div>목표치</div>
            <div>효과</div>
          </TableHeader>

          {breakpoints.map((bp, index) => (
            <TableRow key={index} $primary={primaryColor} $borderColor="#2a2a3e">
              <div className="stat">{bp.stat}</div>
              <div className="value">{bp.value}</div>
              <div className="effect">{bp.effect}</div>
            </TableRow>
          ))}
        </BreakpointTable>
      )}

      {explanation && (
        <Explanation $primary={primaryColor}>
          <strong>상세 설명</strong>
          <p>{explanation}</p>
        </Explanation>
      )}
    </Container>
  );
};

export default StatPriorityList;
