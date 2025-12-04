/**
 * PriorityFlowChart 모듈
 *
 * 복잡한 우선순위(10+ priorities)를 플로우차트 형태로 시각화
 * - Priority 0 (최우선) 빨간색 강조
 * - 조건부 분기 표시
 * - 스킬 아이콘 + 설명 + 이유
 *
 * @example
 * import PriorityFlowChart from '../modules/atomic/rotation/PriorityFlowChart.js';
 *
 * <PriorityFlowChart
 *   priorities={heroContent.hero1.singleTarget.priority}
 *   primaryColor="#C69B6D"
 * />
 */

import React from 'react';
import styled from 'styled-components';
import { SkillIcon } from '../../SkillIconModule.js';

// ============================================
// Styled Components
// ============================================

const FlowChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
`;

const FlowChartNode = styled.div`
  background: ${props => props.$isHighPriority
    ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(220, 38, 38, 0.05))'
    : `linear-gradient(135deg, ${hexToRgba(props.$primary, 0.1)}, transparent)`};
  border: 2px solid ${props => props.$isHighPriority ? '#dc2626' : props.$borderColor || '#2a2a3e'};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease-in-out;

  ${props => props.$isHighPriority && `
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
  `}

  &:hover {
    transform: translateX(8px);
    border-color: ${props => props.$isHighPriority ? '#ef4444' : props.$primary};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  &::before {
    content: '${props => props.$priority}';
    position: absolute;
    top: -12px;
    left: 1rem;
    background: ${props => props.$isHighPriority ? '#dc2626' : props.$primary};
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.$borderColor || 'rgba(255, 255, 255, 0.1)'};
`;

const NodeContent = styled.div`
  flex: 1;

  h4 {
    color: ${props => props.$primary || '#C69B6D'};
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    color: #a0a0a0;
    font-size: 0.9rem;
    line-height: 1.6;
  }
`;

const ConditionsList = styled.ul`
  list-style: none;
  margin: 1rem 0 0 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border-left: 3px solid ${props => props.$primary || '#C69B6D'};

  li {
    color: #d0d0d0;
    font-size: 0.85rem;
    line-height: 1.8;
    position: relative;
    padding-left: 1.5rem;

    &::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: ${props => props.$primary || '#C69B6D'};
      font-weight: bold;
    }
  }
`;

const WhyBox = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: ${props => hexToRgba(props.$primary, 0.15)};
  border-radius: 8px;
  border-left: 3px solid ${props => props.$primary || '#C69B6D'};

  strong {
    color: ${props => props.$primary || '#C69B6D'};
    font-size: 0.8rem;
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

const Arrow = styled.div`
  width: 2px;
  height: 20px;
  background: ${props => props.$primary || '#C69B6D'};
  margin: 0.5rem auto;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid ${props => props.$primary || '#C69B6D'};
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
// PriorityFlowChart Component
// ============================================

const PriorityFlowChart = ({ priorities = [], primaryColor = '#C69B6D' }) => {
  if (!priorities || priorities.length === 0) {
    return <p style={{ color: '#a0a0a0' }}>우선순위 데이터가 없습니다.</p>;
  }

  // Priority 순서대로 정렬 (0이 최우선)
  const sortedPriorities = [...priorities].sort((a, b) => a.priority - b.priority);

  return (
    <FlowChartContainer>
      {sortedPriorities.map((item, index) => {
        const isHighPriority = item.priority === 0;

        return (
          <React.Fragment key={index}>
            <FlowChartNode
              $priority={`우선순위 ${item.priority}`}
              $isHighPriority={isHighPriority}
              $primary={primaryColor}
              $borderColor="#2a2a3e"
            >
              <NodeHeader $borderColor="rgba(255, 255, 255, 0.1)">
                {item.skill && (
                  <SkillIcon
                    skill={item.skill}
                    size="large"
                    primaryColor={primaryColor}
                  />
                )}
                <NodeContent $primary={primaryColor}>
                  <h4>{item.skill?.koreanName || item.skill?.name || '스킬명'}</h4>
                  <p>{item.desc}</p>
                </NodeContent>
              </NodeHeader>

              {item.conditions && item.conditions.length > 0 && (
                <ConditionsList $primary={primaryColor}>
                  {item.conditions.map((condition, i) => (
                    <li key={i}>{condition}</li>
                  ))}
                </ConditionsList>
              )}

              {item.why && (
                <WhyBox $primary={primaryColor}>
                  <strong>Why</strong>
                  <p>{item.why}</p>
                </WhyBox>
              )}
            </FlowChartNode>

            {index < sortedPriorities.length - 1 && (
              <Arrow $primary={primaryColor} />
            )}
          </React.Fragment>
        );
      })}
    </FlowChartContainer>
  );
};

export default PriorityFlowChart;
