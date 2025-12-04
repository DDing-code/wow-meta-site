/**
 * BuildSection 모듈
 *
 * 특성 빌드 섹션
 * - 영웅 특성별 빌드 카드
 * - BuildCard 컴포넌트 사용
 *
 * @example
 * import BuildSection from '../modules/sections/BuildSection.js';
 *
 * <BuildSection
 *   builds={furyWarriorConfig.builds}
 *   spec="fury"
 *   className="WARRIOR"
 *   primaryColor="#C69B6D"
 *   onCopy={() => showToast('복사 완료!')}
 * />
 */

import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { LayoutContext, Card } from '../layout/GuideLayout.js';
import BuildCard from '../atomic/builds/BuildCard.js';

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

const BuildGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
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
// BuildSection Component
// ============================================

const BuildSection = ({
  builds,
  heroContent,
  spec,
  className,
  primaryColor = '#C69B6D',
  onCopy = () => {}
}) => {
  const sectionRef = useRef(null);
  const buildsRef = useRef(null);

  const { registerSectionRef, registerSubSectionRef, theme } = useContext(LayoutContext);

  const [activeHero, setActiveHero] = useState('hero1');

  useEffect(() => {
    if (registerSectionRef) {
      registerSectionRef('builds', sectionRef.current);
    }
    if (registerSubSectionRef) {
      registerSubSectionRef('builds-talents', buildsRef.current);
    }
  }, [registerSectionRef, registerSubSectionRef]);

  if (!builds) {
    return <p style={{ color: '#a0a0a0' }}>빌드 데이터가 없습니다.</p>;
  }

  const currentBuilds = builds[activeHero];

  return (
    <Section ref={sectionRef}>
      <Card $primary={primaryColor} $surface={theme?.surface} $border={theme?.border}>
        <h2>특성 빌드</h2>

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

        <div ref={buildsRef}>
          {currentBuilds && (
            <BuildGrid>
              {Object.entries(currentBuilds).map(([key, build]) => (
                <BuildCard
                  key={key}
                  build={build}
                  spec={spec}
                  className={className}
                  primaryColor={primaryColor}
                  onCopy={onCopy}
                />
              ))}
            </BuildGrid>
          )}
        </div>
      </Card>
    </Section>
  );
};

export default BuildSection;
