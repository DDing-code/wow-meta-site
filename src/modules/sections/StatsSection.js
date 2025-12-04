/**
 * StatsSection 모듈
 *
 * 스탯 우선순위 섹션
 * - 영웅 특성별 스탯 우선순위
 * - 단일/광역 토글
 * - StatPriorityList 컴포넌트 사용
 *
 * @example
 * import StatsSection from '../modules/sections/StatsSection.js';
 *
 * <StatsSection
 *   statsData={furyWarriorConfig.statsData}
 *   heroContent={furyWarriorConfig.heroContent}
 *   primaryColor="#C69B6D"
 * />
 */

import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { LayoutContext, Card } from '../layout/GuideLayout.js';
import StatPriorityList from '../atomic/stats/StatPriorityList.js';

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

  &:hover {
    background: ${props => props.$active
      ? props.$primary
      : hexToRgba(props.$primary, 0.2)};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
// StatsSection Component
// ============================================

const StatsSection = ({
  statsData,
  heroContent,
  primaryColor = '#C69B6D'
}) => {
  const sectionRef = useRef(null);
  const priorityRef = useRef(null);

  const { registerSectionRef, registerSubSectionRef, theme } = useContext(LayoutContext);

  const [activeHero, setActiveHero] = useState('hero1');
  const [targetType, setTargetType] = useState('single'); // 'single' or 'aoe'

  useEffect(() => {
    if (registerSectionRef) {
      registerSectionRef('stats', sectionRef.current);
    }
    if (registerSubSectionRef) {
      registerSubSectionRef('stats-priority', priorityRef.current);
    }
  }, [registerSectionRef, registerSubSectionRef]);

  if (!statsData) {
    return <p style={{ color: '#a0a0a0' }}>스탯 데이터가 없습니다.</p>;
  }

  const currentStats = statsData[activeHero];
  const currentStatData = currentStats?.[targetType];

  return (
    <Section ref={sectionRef}>
      <Card $primary={primaryColor} $surface={theme?.surface} $border={theme?.border}>
        <h2>스탯 우선순위</h2>

        {/* 영웅 특성 탭 */}
        {heroContent && (
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
                  {hero.name}
                </Tab>
              );
            })}
          </TabContainer>
        )}

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

        <div ref={priorityRef}>
          {currentStatData && (
            <StatPriorityList
              statData={currentStatData}
              primaryColor={primaryColor}
            />
          )}
        </div>
      </Card>
    </Section>
  );
};

export default StatsSection;
