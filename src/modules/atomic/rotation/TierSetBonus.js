/**
 * TierSetBonus 모듈
 *
 * 티어 세트 2세트/4세트 효과 표시
 *
 * @example
 * import TierSetBonus from '../modules/atomic/rotation/TierSetBonus.js';
 *
 * <TierSetBonus
 *   twoSet="2세트 효과 설명"
 *   fourSet="4세트 효과 설명"
 *   primaryColor="#C69B6D"
 * />
 */

import React from 'react';
import styled from 'styled-components';

const TierSetContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const SetBonus = styled.div`
  background: linear-gradient(135deg, ${props => hexToRgba(props.$primary, 0.1)}, transparent);
  border: 2px solid ${props => props.$borderColor || '#2a2a3e'};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.$primary};
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  &::before {
    content: '${props => props.$setType}';
    position: absolute;
    top: -12px;
    left: 1rem;
    background: ${props => props.$primary};
    color: white;
    padding: 0.25rem 1rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const SetIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SetDescription = styled.p`
  color: #d0d0d0;
  font-size: 0.95rem;
  line-height: 1.8;
  text-align: justify;
`;

function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const TierSetBonus = ({ twoSet, fourSet, primaryColor = '#C69B6D' }) => {
  return (
    <TierSetContainer>
      {twoSet && (
        <SetBonus $setType="2세트" $primary={primaryColor} $borderColor="#2a2a3e">
          <SetIcon>🎯</SetIcon>
          <SetDescription>{twoSet}</SetDescription>
        </SetBonus>
      )}

      {fourSet && (
        <SetBonus $setType="4세트" $primary={primaryColor} $borderColor="#2a2a3e">
          <SetIcon>⚡</SetIcon>
          <SetDescription>{fourSet}</SetDescription>
        </SetBonus>
      )}
    </TierSetContainer>
  );
};

export default TierSetBonus;
