/**
 * ResourceGauge 모듈
 *
 * 리소스 시스템(분노, 마나, 기력 등) 시각화
 * - 리소스 생성 스킬 (초록색)
 * - 리소스 소모 스킬 (빨간색)
 * - 핵심 메커니즘
 *
 * @example
 * import ResourceGauge from '../modules/atomic/rotation/ResourceGauge.js';
 *
 * <ResourceGauge
 *   resourceSystem={overviewData.resourceSystem}
 *   primaryColor="#C69B6D"
 * />
 */

import React from 'react';
import styled from 'styled-components';
import { SkillIcon } from '../../SkillIconModule.js';

// ============================================
// Styled Components
// ============================================

const GaugeContainer = styled.div`
  background: linear-gradient(135deg, ${props => hexToRgba(props.$primary, 0.1)}, transparent);
  border: 2px solid ${props => props.$borderColor || '#2a2a3e'};
  border-radius: 12px;
  padding: 2rem;
  margin: 1.5rem 0;
`;

const GaugeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .icon {
    font-size: 3rem;
  }

  .info {
    flex: 1;

    h3 {
      color: ${props => props.$primary};
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: #a0a0a0;
      font-size: 0.9rem;
      line-height: 1.6;
    }
  }

  .max-value {
    background: ${props => props.$primary};
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

const ResourceSection = styled.div`
  margin: 1.5rem 0;

  h4 {
    color: ${props => props.$color};
    font-size: 1.1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
      content: '${props => props.$icon}';
      font-size: 1.5rem;
    }
  }
`;

const SkillList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border-left: 3px solid ${props => props.$color};
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.4);
    transform: translateX(4px);
  }

  .skill-info {
    flex: 1;

    .amount {
      color: ${props => props.$color};
      font-weight: bold;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .note {
      color: #a0a0a0;
      font-size: 0.8rem;
    }
  }
`;

const MechanicsList = styled.ul`
  list-style: none;
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;

  li {
    color: #d0d0d0;
    font-size: 0.9rem;
    line-height: 1.8;
    position: relative;
    padding-left: 1.5rem;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: ${props => props.$primary};
      font-size: 1.2rem;
    }
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
// ResourceGauge Component
// ============================================

const ResourceGauge = ({ resourceSystem, primaryColor = '#C69B6D' }) => {
  if (!resourceSystem) {
    return <p style={{ color: '#a0a0a0' }}>리소스 데이터가 없습니다.</p>;
  }

  const { name, icon, maxValue, description, generators = [], spenders = [], mechanics = [] } = resourceSystem;

  return (
    <GaugeContainer $primary={primaryColor} $borderColor="#2a2a3e">
      <GaugeHeader $primary={primaryColor}>
        <div className="icon">{icon || '⚡'}</div>
        <div className="info">
          <h3>{name || '리소스'}</h3>
          <p>{description}</p>
        </div>
        {maxValue && <div className="max-value">최대 {maxValue}</div>}
      </GaugeHeader>

      {generators.length > 0 && (
        <ResourceSection $color="#22c55e" $icon="↗">
          <h4>생성</h4>
          <SkillList>
            {generators.map((gen, index) => (
              <SkillItem key={index} $color="#22c55e">
                {gen.skill && (
                  <SkillIcon
                    skill={gen.skill}
                    size="small"
                    primaryColor={primaryColor}
                  />
                )}
                <div className="skill-info">
                  <div className="amount">{gen.amount}</div>
                  {gen.note && <div className="note">{gen.note}</div>}
                </div>
              </SkillItem>
            ))}
          </SkillList>
        </ResourceSection>
      )}

      {spenders.length > 0 && (
        <ResourceSection $color="#ef4444" $icon="↘">
          <h4>소모</h4>
          <SkillList>
            {spenders.map((spend, index) => (
              <SkillItem key={index} $color="#ef4444">
                {spend.skill && (
                  <SkillIcon
                    skill={spend.skill}
                    size="small"
                    primaryColor={primaryColor}
                  />
                )}
                <div className="skill-info">
                  <div className="amount">{spend.amount}</div>
                  {spend.note && <div className="note">{spend.note}</div>}
                </div>
              </SkillItem>
            ))}
          </SkillList>
        </ResourceSection>
      )}

      {mechanics.length > 0 && (
        <ResourceSection $color={primaryColor} $icon="💡">
          <h4>핵심 메커니즘</h4>
          <MechanicsList $primary={primaryColor}>
            {mechanics.map((mech, index) => (
              <li key={index}>{mech}</li>
            ))}
          </MechanicsList>
        </ResourceSection>
      )}
    </GaugeContainer>
  );
};

export default ResourceGauge;
