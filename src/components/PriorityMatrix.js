/**
 * PriorityMatrix.js - 스킬 우선순위 시각화 컴포넌트
 *
 * 용도: Priority 0-4 시스템으로 스킬 사용 우선순위 표시
 * 색상: Priority 0 = 빨강 (최우선), 1 = 주황, 2 = 초록, 3 = 청록, 4 = 투명
 */

import React from 'react';
import styled from 'styled-components';

const PriorityMatrix = ({ priorities, SkillIcon, theme }) => {
  const priorityColors = {
    0: {
      bg: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
      border: '#ff6b6b',
      label: '최우선'
    },
    1: {
      bg: 'linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)',
      border: '#ffb84d',
      label: '높음'
    },
    2: {
      bg: 'linear-gradient(135deg, #28a745 0%, #218838 100%)',
      border: '#5cb85c',
      label: '중간'
    },
    3: {
      bg: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
      border: '#5bc0de',
      label: '낮음'
    },
    4: {
      bg: 'transparent',
      border: theme?.colors?.border || '#2a2a3e',
      label: '필러'
    }
  };

  return (
    <Container>
      {priorities.map((item, idx) => {
        const colorScheme = priorityColors[item.priority] || priorityColors[4];

        return (
          <PriorityCard
            key={idx}
            $background={colorScheme.bg}
            $borderColor={colorScheme.border}
            $priority={item.priority}
          >
            {/* 스킬 아이콘 */}
            <IconWrapper>
              <SkillIcon skill={item.skill} size="large" />
            </IconWrapper>

            {/* 정보 영역 */}
            <InfoArea>
              <SkillName>
                {item.skill?.koreanName || item.skill?.name || '스킬'}
              </SkillName>

              {item.conditions && item.conditions.length > 0 && (
                <ConditionList>
                  {item.conditions.map((cond, i) => (
                    <ConditionItem key={i}>{cond}</ConditionItem>
                  ))}
                </ConditionList>
              )}

              {item.desc && (
                <Description>{item.desc}</Description>
              )}

              {item.why && (
                <WhyBox>
                  <WhyLabel>💡 이유:</WhyLabel>
                  <WhyText>{item.why}</WhyText>
                </WhyBox>
              )}
            </InfoArea>

            {/* 우선순위 뱃지 */}
            <PriorityBadge $priority={item.priority}>
              <PriorityNumber>{item.priority}</PriorityNumber>
              <PriorityLabel>{colorScheme.label}</PriorityLabel>
            </PriorityBadge>
          </PriorityCard>
        );
      })}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const PriorityCard = styled.div`
  background: ${props => props.$background};
  border: ${props => props.$priority === 0
    ? `3px solid ${props.$borderColor}`
    : `2px solid ${props.$borderColor}`};
  border-radius: 12px;
  padding: ${props => props.$priority === 0 ? '20px' : '16px'};
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$priority === 0
    ? '0 8px 24px rgba(220, 53, 69, 0.4), 0 0 20px rgba(220, 53, 69, 0.3)'
    : '0 4px 12px rgba(0, 0, 0, 0.3)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$priority === 0
      ? '0 12px 32px rgba(220, 53, 69, 0.5), 0 0 30px rgba(220, 53, 69, 0.4)'
      : '0 6px 16px rgba(0, 0, 0, 0.4)'};
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
`;

const InfoArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkillName = styled.div`
  color: #fff;
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const ConditionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ConditionItem = styled.li`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  padding-left: 16px;
  position: relative;

  &::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const Description = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.4;
`;

const WhyBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 10px 12px;
  margin-top: 4px;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
`;

const WhyLabel = styled.span`
  color: #ffd700;
  font-weight: bold;
  font-size: 0.9rem;
  margin-right: 8px;
`;

const WhyText = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const PriorityBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  min-width: 80px;
`;

const PriorityNumber = styled.div`
  color: #fff;
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
`;

const PriorityLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
`;

export default PriorityMatrix;
