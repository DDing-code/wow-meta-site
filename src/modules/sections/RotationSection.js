/**
 * RotationSection 모듈
 *
 * 딜사이클 섹션 - 영웅 특성 탭 전환 + Atomic 모듈 동적 렌더링
 * - Config의 rotationConfig.components 배열로 모듈 선택
 * - 단일/광역 대상별 우선순위
 * - 티어 세트, 오프닝, 메커니즘
 *
 * @example
 * import RotationSection from '../modules/sections/RotationSection.js';
 *
 * <RotationSection
 *   heroContent={furyWarriorConfig.heroContent}
 *   rotationConfig={furyWarriorConfig.rotationConfig}
 *   primaryColor="#C69B6D"
 * />
 */

import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { LayoutContext, Card } from '../layout/GuideLayout.js';
import TierSetBonus from '../atomic/rotation/TierSetBonus.js';
import OpenerSequence from '../atomic/rotation/OpenerSequence.js';
import PriorityFlowChart from '../atomic/rotation/PriorityFlowChart.js';
import MechanicsCard from '../atomic/rotation/MechanicsCard.js';

// ============================================
// Styled Components
// ============================================

const Section = styled.section`
  margin-bottom: 3rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  background: ${props => props.$active
    ? props.$primary
    : 'transparent'};
  color: ${props => props.$active ? 'white' : props.$primary};
  border: 2px solid ${props => props.$primary};
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.$active
      ? props.$primary
      : hexToRgba(props.$primary, 0.2)};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .icon {
    font-size: 1.5rem;
  }
`;

const TargetTypeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0;
  justify-content: center;
`;

const ToggleButton = styled.button`
  background: ${props => props.$active
    ? props.$primary
    : 'rgba(0, 0, 0, 0.2)'};
  color: ${props => props.$active ? 'white' : '#a0a0a0'};
  border: 1px solid ${props => props.$active ? props.$primary : '#2a2a3e'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active
      ? props.$primary
      : hexToRgba(props.$primary, 0.1)};
    color: ${props => props.$active ? 'white' : props.$primary};
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
// RotationSection Component
// ============================================

const RotationSection = ({
  heroContent,
  rotationConfig = {},
  primaryColor = '#C69B6D'
}) => {
  const sectionRef = useRef(null);
  const tierRef = useRef(null);
  const singleRef = useRef(null);
  const aoeRef = useRef(null);

  const { registerSectionRef, registerSubSectionRef, theme } = useContext(LayoutContext);

  const [activeHero, setActiveHero] = useState('hero1');
  const [targetType, setTargetType] = useState('single'); // 'single' or 'aoe'

  useEffect(() => {
    if (registerSectionRef) {
      registerSectionRef('rotation', sectionRef.current);
    }
    if (registerSubSectionRef) {
      registerSubSectionRef('rotation-tier', tierRef.current);
      registerSubSectionRef('rotation-single', singleRef.current);
      registerSubSectionRef('rotation-aoe', aoeRef.current);
    }
  }, [registerSectionRef, registerSubSectionRef]);

  if (!heroContent) {
    return <p style={{ color: '#a0a0a0' }}>딜사이클 데이터가 없습니다.</p>;
  }

  const currentHero = heroContent[activeHero];
  const { components = [] } = rotationConfig;

  // 컴포넌트 매핑
  const renderComponent = (componentName) => {
    switch (componentName) {
      case 'TierSetBonus':
        return (
          <TierSetBonus
            twoSet={currentHero?.tierSet?.twoSet}
            fourSet={currentHero?.tierSet?.fourSet}
            primaryColor={primaryColor}
          />
        );

      case 'OpenerSequence':
        const openerSkills = targetType === 'single'
          ? currentHero?.singleTarget?.opener
          : currentHero?.aoe?.opener;
        return openerSkills && (
          <OpenerSequence
            skills={openerSkills}
            primaryColor={primaryColor}
          />
        );

      case 'PriorityFlowChart':
        const priorities = targetType === 'single'
          ? currentHero?.singleTarget?.priority
          : currentHero?.aoe?.priority;
        return priorities && (
          <PriorityFlowChart
            priorities={priorities}
            primaryColor={primaryColor}
          />
        );

      case 'MechanicsCard':
        return currentHero?.mechanics && (
          <MechanicsCard
            mechanics={currentHero.mechanics}
            primaryColor={primaryColor}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Section ref={sectionRef}>
      <Card $primary={primaryColor} $surface={theme?.surface} $border={theme?.border}>
        <h2>딜사이클</h2>

        {/* 영웅 특성 탭 */}
        <TabContainer>
          {Object.keys(heroContent).map((heroKey) => {
            const hero = heroContent[heroKey];
            return (
              <Tab
                key={heroKey}
                $active={activeHero === heroKey}
                $primary={primaryColor}
                onClick={() => setActiveHero(heroKey)}
              >
                <span className="icon">{hero.icon}</span>
                {hero.name}
              </Tab>
            );
          })}
        </TabContainer>

        {/* 티어 세트 */}
        <div ref={tierRef}>
          {components.includes('TierSetBonus') && renderComponent('TierSetBonus')}
        </div>

        {/* 단일/광역 토글 */}
        <TargetTypeToggle>
          <ToggleButton
            $active={targetType === 'single'}
            $primary={primaryColor}
            onClick={() => setTargetType('single')}
          >
            단일 대상
          </ToggleButton>
          <ToggleButton
            $active={targetType === 'aoe'}
            $primary={primaryColor}
            onClick={() => setTargetType('aoe')}
          >
            광역 대상
          </ToggleButton>
        </TargetTypeToggle>

        {/* 오프닝 시퀀스 */}
        {targetType === 'single' ? (
          <div ref={singleRef}>
            <h3>오프닝</h3>
            {components.includes('OpenerSequence') && renderComponent('OpenerSequence')}

            <h3>우선순위</h3>
            {components.includes('PriorityFlowChart') && renderComponent('PriorityFlowChart')}
          </div>
        ) : (
          <div ref={aoeRef}>
            <h3>오프닝</h3>
            {components.includes('OpenerSequence') && renderComponent('OpenerSequence')}

            <h3>우선순위</h3>
            {components.includes('PriorityFlowChart') && renderComponent('PriorityFlowChart')}
          </div>
        )}

        {/* 핵심 메커니즘 */}
        <h3>핵심 메커니즘</h3>
        {components.includes('MechanicsCard') && renderComponent('MechanicsCard')}
      </Card>
    </Section>
  );
};

export default RotationSection;
