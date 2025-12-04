/**
 * OverviewSection 모듈
 *
 * 개요 섹션 - Atomic 모듈 조합
 * - 전문화 소개
 * - 핵심 스킬
 * - 리소스 시스템 (ResourceGauge 사용)
 * - 플레이스타일
 *
 * @example
 * import OverviewSection from '../modules/sections/OverviewSection.js';
 *
 * <OverviewSection
 *   overviewData={furyWarriorConfig.overviewData}
 *   primaryColor="#C69B6D"
 * />
 */

import React, { useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { LayoutContext, Card } from '../layout/GuideLayout.js';
import { SkillIcon } from '../SkillIconModule.js';
import ResourceGauge from '../atomic/rotation/ResourceGauge.js';

// ============================================
// Styled Components
// ============================================

const Section = styled.section`
  margin-bottom: 3rem;
`;

const IntroCard = styled(Card)`
  .subtitle {
    color: ${props => props.$primary};
    font-size: 1.1rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .description {
    color: #d0d0d0;
    font-size: 1rem;
    line-height: 1.8;
    text-align: justify;
  }
`;

const CoreSkills = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const SkillItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid ${props => props.$borderColor || '#2a2a3e'};
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.$primary};
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  .skill-name {
    color: ${props => props.$primary};
    font-weight: 600;
    font-size: 0.9rem;
    text-align: center;
  }
`;

const PlaystyleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const PlaystyleCard = styled.div`
  background: linear-gradient(135deg, ${props => hexToRgba(props.$primary, 0.1)}, transparent);
  border: 2px solid ${props => props.$borderColor || '#2a2a3e'};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.$primary};
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  h4 {
    color: ${props => props.$primary};
    font-size: 1.1rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .badge {
    display: inline-block;
    background: ${props => props.$primary};
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  ul {
    list-style: none;
    margin-top: 1rem;

    li {
      color: #d0d0d0;
      font-size: 0.9rem;
      line-height: 1.8;
      position: relative;
      padding-left: 1.5rem;

      &::before {
        content: '${props => props.$icon || '•'}';
        position: absolute;
        left: 0;
        color: ${props => props.$primary};
        font-weight: bold;
      }
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
// OverviewSection Component
// ============================================

const OverviewSection = ({ overviewData, primaryColor = '#C69B6D' }) => {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const resourceRef = useRef(null);

  const { registerSectionRef, registerSubSectionRef, theme } = useContext(LayoutContext);

  useEffect(() => {
    if (registerSectionRef) {
      registerSectionRef('overview', sectionRef.current);
    }
    if (registerSubSectionRef) {
      registerSubSectionRef('overview-intro', introRef.current);
      registerSubSectionRef('overview-resource', resourceRef.current);
    }
  }, [registerSectionRef, registerSubSectionRef]);

  if (!overviewData) {
    return <p style={{ color: '#a0a0a0' }}>개요 데이터가 없습니다.</p>;
  }

  const { title, subtitle, description, coreSkills = [], resourceSystem, playstyle } = overviewData;

  return (
    <Section ref={sectionRef}>
      {/* 전문화 소개 */}
      <IntroCard ref={introRef} $primary={primaryColor} $surface={theme?.surface} $border={theme?.border}>
        <h2>개요</h2>
        <div className="subtitle">{subtitle}</div>
        <div className="description">{description}</div>

        {coreSkills.length > 0 && (
          <>
            <h3>핵심 스킬</h3>
            <CoreSkills>
              {coreSkills.map((skill, index) => (
                <SkillItem key={index} $primary={primaryColor} $borderColor="#2a2a3e">
                  <SkillIcon skill={skill} size="large" primaryColor={primaryColor} />
                  <div className="skill-name">{skill?.koreanName || skill?.name}</div>
                </SkillItem>
              ))}
            </CoreSkills>
          </>
        )}
      </IntroCard>

      {/* 리소스 시스템 */}
      {resourceSystem && (
        <div ref={resourceRef}>
          <ResourceGauge resourceSystem={resourceSystem} primaryColor={primaryColor} />
        </div>
      )}

      {/* 플레이스타일 */}
      {playstyle && (
        <Card $primary={primaryColor} $surface={theme?.surface} $border={theme?.border}>
          <h3>플레이스타일</h3>
          <PlaystyleGrid>
            <PlaystyleCard $primary={primaryColor} $borderColor="#2a2a3e">
              <h4>기본 정보</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge">난이도: {playstyle.difficulty}</span>
                <span className="badge">사거리: {playstyle.range}</span>
                <span className="badge">기동성: {playstyle.mobility}</span>
                <span className="badge">생존력: {playstyle.survivability}</span>
              </div>
            </PlaystyleCard>

            {playstyle.strengths && playstyle.strengths.length > 0 && (
              <PlaystyleCard $primary={primaryColor} $borderColor="#2a2a3e" $icon="✓">
                <h4>강점</h4>
                <ul>
                  {playstyle.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </PlaystyleCard>
            )}

            {playstyle.weaknesses && playstyle.weaknesses.length > 0 && (
              <PlaystyleCard $primary={primaryColor} $borderColor="#2a2a3e" $icon="✗">
                <h4>약점</h4>
                <ul>
                  {playstyle.weaknesses.map((weak, i) => (
                    <li key={i}>{weak}</li>
                  ))}
                </ul>
              </PlaystyleCard>
            )}
          </PlaystyleGrid>
        </Card>
      )}
    </Section>
  );
};

export default OverviewSection;
