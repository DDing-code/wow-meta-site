/**
 * MechanicsCard 모듈
 *
 * 핵심 메커니즘을 카드 형태로 시각화
 * - 아이콘 + 제목 + 설명
 * - 상세 리스트
 * - 이유(Why)
 *
 * @example
 * import MechanicsCard from '../modules/atomic/rotation/MechanicsCard.js';
 *
 * <MechanicsCard
 *   mechanics={heroContent.hero1.mechanics}
 *   primaryColor="#C69B6D"
 * />
 */

import React from 'react';
import styled from 'styled-components';

// ============================================
// Styled Components
// ============================================

const MechanicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const MechanicCard = styled.div`
  background: linear-gradient(135deg, ${props => hexToRgba(props.$primary, 0.1)}, transparent);
  border: 2px solid ${props => props.$borderColor || '#2a2a3e'};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.$primary};
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .icon {
    font-size: 2.5rem;
  }

  .title {
    flex: 1;

    h4 {
      color: ${props => props.$primary};
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
  }
`;

const CardDescription = styled.p`
  color: #d0d0d0;
  font-size: 0.9rem;
  line-height: 1.8;
  margin-bottom: 1rem;
  text-align: justify;
`;

const DetailsList = styled.ul`
  list-style: none;
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border-left: 3px solid ${props => props.$primary};

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
      color: ${props => props.$primary};
      font-weight: bold;
    }
  }
`;

const WhyBox = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: ${props => hexToRgba(props.$primary, 0.15)};
  border-radius: 8px;
  border-left: 3px solid ${props => props.$primary};

  strong {
    color: ${props => props.$primary};
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
// MechanicsCard Component
// ============================================

const MechanicsCard = ({ mechanics = [], primaryColor = '#C69B6D' }) => {
  if (!mechanics || mechanics.length === 0) {
    return <p style={{ color: '#a0a0a0' }}>핵심 메커니즘 데이터가 없습니다.</p>;
  }

  return (
    <MechanicsGrid>
      {mechanics.map((mech, index) => (
        <MechanicCard key={index} $primary={primaryColor} $borderColor="#2a2a3e">
          <CardHeader $primary={primaryColor}>
            <div className="icon">{mech.icon || '⚙️'}</div>
            <div className="title">
              <h4>{mech.title}</h4>
            </div>
          </CardHeader>

          {mech.desc && (
            <CardDescription>{mech.desc}</CardDescription>
          )}

          {mech.details && mech.details.length > 0 && (
            <DetailsList $primary={primaryColor}>
              {mech.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </DetailsList>
          )}

          {mech.why && (
            <WhyBox $primary={primaryColor}>
              <strong>Why</strong>
              <p>{mech.why}</p>
            </WhyBox>
          )}
        </MechanicCard>
      ))}
    </MechanicsGrid>
  );
};

export default MechanicsCard;
