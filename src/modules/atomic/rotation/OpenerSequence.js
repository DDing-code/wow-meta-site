/**
 * OpenerSequence 모듈
 *
 * 오프닝 시퀀스를 시각적으로 표시
 * - 스킬 순서대로 나열
 * - 화살표로 연결
 * - 애니메이션 효과
 *
 * @example
 * import OpenerSequence from '../modules/atomic/rotation/OpenerSequence.js';
 *
 * <OpenerSequence
 *   skills={heroContent.hero1.singleTarget.opener}
 *   primaryColor="#C69B6D"
 * />
 */

import React from 'react';
import styled from 'styled-components';
import { SkillIcon } from '../../SkillIconModule.js';

// ============================================
// Styled Components
// ============================================

const SequenceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow-x: auto;
  margin: 1rem 0;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.$primary || '#C69B6D'};
    border-radius: 4px;
  }
`;

const SkillStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
  animation: fadeInUp 0.5s ease-in-out;
  animation-delay: ${props => props.$delay}s;
  opacity: 0;
  animation-fill-mode: forwards;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StepNumber = styled.div`
  background: ${props => props.$primary || '#C69B6D'};
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const SkillName = styled.div`
  color: #d0d0d0;
  font-size: 0.75rem;
  text-align: center;
  max-width: 80px;
  word-wrap: break-word;
  line-height: 1.3;
`;

const Arrow = styled.div`
  color: ${props => props.$primary || '#C69B6D'};
  font-size: 1.5rem;
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

// ============================================
// OpenerSequence Component
// ============================================

const OpenerSequence = ({ skills = [], primaryColor = '#C69B6D' }) => {
  if (!skills || skills.length === 0) {
    return <p style={{ color: '#a0a0a0' }}>오프닝 시퀀스 데이터가 없습니다.</p>;
  }

  return (
    <SequenceContainer $primary={primaryColor}>
      {skills.map((skill, index) => (
        <React.Fragment key={index}>
          <SkillStep $delay={index * 0.1}>
            <StepNumber $primary={primaryColor}>{index + 1}</StepNumber>
            <SkillIcon
              skill={skill}
              size="medium"
              primaryColor={primaryColor}
            />
            <SkillName>{skill?.koreanName || skill?.name || '스킬'}</SkillName>
          </SkillStep>

          {index < skills.length - 1 && (
            <Arrow $primary={primaryColor} $delay={index * 0.1}>→</Arrow>
          )}
        </React.Fragment>
      ))}
    </SequenceContainer>
  );
};

export default OpenerSequence;
