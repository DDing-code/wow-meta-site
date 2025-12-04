// ============================================================
// GuideTemplate Component - 다크 아카데믹 스타일 가이드 템플릿
// ============================================================
// styled-components 기반 완전 재구축
// 논문 스타일 레이아웃 + WoW 브랜딩
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { academicTheme } from '../../styles/academicTheme';

// Phase 2-3 완료: 모든 컴포넌트
import HeroBanner from './HeroBanner.js';
import TableOfContents from './TableOfContents.js';
import QuickSummary from './QuickSummary.js';
import OverviewSection from './OverviewSection.js';
import MechanicsSection from './MechanicsSection.js';
import RotationSection from './RotationSection.js';
import TipsSection from './TipsSection.js';
import AdvancedSection from './AdvancedSection.js';
import ResourcesSection from './ResourcesSection.js';
import FAQSection from './FAQSection.js';

// ============================================================
// Styled Components
// ============================================================

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background.main};
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.typography.fontFamily.base};
  font-size: ${props => props.theme.typography.baseFontSize};
  line-height: ${props => props.theme.typography.baseLineHeight};
  position: relative;

  /* 다크 배경 그라데이션 효과 */
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(192, 132, 252, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, rgba(74, 222, 128, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

// Icy Veins 스타일: Left Sidebar + Main Content 레이아웃
const LayoutWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.section} 2rem;
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  position: relative;
  z-index: 1;

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    flex-direction: column;
    padding: ${props => props.theme.spacing.subsection} 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.paragraph} 1rem;
  }
`;

const SidebarContainer = styled.aside`
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.surface};
    border-radius: ${props => props.theme.borderRadius.full};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border.muted};
    border-radius: ${props => props.theme.borderRadius.full};
  }

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    position: static;
    width: 100%;
    max-height: none;
    overflow-y: visible;
  }
`;

const MainContent = styled.main`
  flex: 1;
  min-width: 0;
  max-width: 800px;

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    max-width: 100%;
  }
`;

const SectionWrapper = styled.section`
  margin-bottom: ${props => props.theme.spacing.section};
  scroll-margin-top: 100px;

  &:not(:last-child) {
    padding-bottom: ${props => props.theme.spacing.paragraph};
    border-bottom: 1px solid ${props => props.theme.colors.border.default};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-bottom: ${props => props.theme.spacing.subsection};
  }
`;

const PlaceholderSection = styled.div`
  padding: ${props => props.theme.spacing.cardPadding};
  background: ${props => props.theme.colors.background.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
  color: ${props => props.theme.colors.text.tertiary};
  border-left: 4px solid ${props => props.classColor || props.theme.colors.classColors.demonhunter};

  h3 {
    color: ${props => props.classColor || props.theme.colors.classColors.demonhunter};
    margin-bottom: 1rem;
    font-family: ${props => props.theme.typography.fontFamily.heading};
  }

  p {
    margin: 0;
  }
`;

// ============================================================
// Main Component
// ============================================================

/**
 * GuideTemplate - 다크 아카데믹 스타일 가이드 메인 템플릿
 *
 * @param {Object} classData - 클래스 정보 (className, classNameKo, color)
 * @param {Object} specData - 전문화 정보 (모든 섹션 데이터 포함)
 */
const GuideTemplate = ({ classData, specData }) => {
  const { className, classNameKo, color } = classData;
  const {
    specName,
    specNameKo,
    patch,
    lastUpdate,
    difficulty,
    role,
    resourceType,
    rangeType,
    playstyle,
    overview,
    mechanics,
    rotation,
    talents,
    stats,
    gear,
    tips,
    advanced,
    resources,
    faq
  } = specData;

  // 목차 섹션 정의 (Icy Veins 스타일 번호 매김)
  const allSections = [
    { id: 'overview', title: '개요', icon: '📖', data: overview },
    { id: 'mechanics', title: '핵심 메커니즘', icon: '⚙️', data: mechanics },
    { id: 'rotation', title: '딜사이클', icon: '🔄', data: rotation },
    { id: 'talents', title: '특성 빌드', icon: '🌟', data: talents },
    { id: 'stats', title: '스탯 우선순위', icon: '📊', data: stats },
    { id: 'gear', title: '장비 추천', icon: '⚔️', data: gear },
    { id: 'tips', title: '실전 팁', icon: '💡', data: tips },
    { id: 'advanced', title: '심화 전략', icon: '🎓', data: advanced },
    { id: 'resources', title: '참고 자료', icon: '🔗', data: resources },
    { id: 'faq', title: 'FAQ', icon: '❓', data: faq }
  ];

  // 데이터가 있는 섹션만 필터링하고 번호 할당
  const sections = allSections
    .filter(section => section.data)
    .map((section, index) => ({
      ...section,
      number: index + 1  // 1, 2, 3... 순서로 번호 할당
    }));

  return (
    <ThemeProvider theme={academicTheme}>
      <PageContainer>
        {/* Hero Banner */}
        <HeroBanner
          className={className}
          classNameKo={classNameKo}
          specName={specName}
          specNameKo={specNameKo}
          color={color}
          description={overview?.description}
          patch={patch}
          lastUpdate={lastUpdate}
        />

        {/* Quick Summary */}
        {(difficulty || role || playstyle) && (
          <QuickSummary
            difficulty={difficulty}
            role={role}
            resourceType={resourceType}
            rangeType={rangeType}
            playstyle={playstyle}
            color={color}
          />
        )}

        {/* Icy Veins 스타일: Left Sidebar + Main Content 레이아웃 */}
        <LayoutWrapper>
          {/* Sticky Sidebar Navigation */}
          <SidebarContainer>
            <TableOfContents sections={sections} color={color} />
          </SidebarContainer>

          {/* Main Content Area */}
          <MainContent>
            {/* Overview Section */}
            {overview && (
              <SectionWrapper id="overview">
                <OverviewSection
                  overview={overview}
                  color={color}
                  sectionNumber={sections.find(s => s.id === 'overview')?.number}
                />
              </SectionWrapper>
            )}

            {/* Mechanics Section */}
            {mechanics && (
              <SectionWrapper id="mechanics">
                <MechanicsSection
                  mechanics={mechanics}
                  color={color}
                  sectionNumber={sections.find(s => s.id === 'mechanics')?.number}
                />
              </SectionWrapper>
            )}

            {/* Rotation Section */}
            {rotation && (
              <SectionWrapper id="rotation">
                <RotationSection
                  rotation={rotation}
                  color={color}
                  sectionNumber={sections.find(s => s.id === 'rotation')?.number}
                />
              </SectionWrapper>
            )}

            {/* Tips Section */}
            {tips && (
              <SectionWrapper id="tips">
                <TipsSection
                  tips={tips}
                  color={color}
                  sectionNumber={sections.find(s => s.id === 'tips')?.number}
                />
              </SectionWrapper>
            )}

            {/* Advanced Section */}
            {advanced && (
              <SectionWrapper id="advanced">
                <AdvancedSection
                  advanced={advanced}
                  color={color}
                  sectionNumber={sections.find(s => s.id === 'advanced')?.number}
                />
              </SectionWrapper>
            )}

            {/* Resources Section */}
            {resources && (
              <SectionWrapper id="resources">
                <ResourcesSection
                  resources={resources}
                  color={color}
                  sectionNumber={sections.find(s => s.id === 'resources')?.number}
                />
              </SectionWrapper>
            )}

            {/* FAQ Section */}
            {faq && (
              <SectionWrapper id="faq">
                <FAQSection
                  faq={faq}
                  color={color}
                  sectionNumber={sections.find(s => s.id === 'faq')?.number}
                />
              </SectionWrapper>
            )}
          </MainContent>
        </LayoutWrapper>
      </PageContainer>
    </ThemeProvider>
  );
};

GuideTemplate.propTypes = {
  classData: PropTypes.shape({
    className: PropTypes.string.isRequired,
    classNameKo: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  }).isRequired,
  specData: PropTypes.shape({
    specName: PropTypes.string.isRequired,
    specNameKo: PropTypes.string.isRequired,
    patch: PropTypes.string.isRequired,
    lastUpdate: PropTypes.string.isRequired,
    difficulty: PropTypes.string,
    role: PropTypes.string,
    resourceType: PropTypes.string,
    rangeType: PropTypes.string,
    playstyle: PropTypes.string,
    overview: PropTypes.object,
    mechanics: PropTypes.array,
    rotation: PropTypes.object,
    talents: PropTypes.object,
    stats: PropTypes.object,
    gear: PropTypes.object,
    tips: PropTypes.array,
    advanced: PropTypes.array,
    resources: PropTypes.array,
    faq: PropTypes.array
  }).isRequired
};

export default GuideTemplate;
