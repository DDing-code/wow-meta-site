/**
 * UniversalGuideRenderer.js
 * JSON 데이터만 받아 전체 가이드를 자동 렌더링하는 컴포넌트
 * 
 * 사용법:
 * import { UniversalGuideRenderer } from './guide-modules/UniversalGuideRenderer';
 * import guideData from '../data/guides/demonhunter.json';
 * 
 * <UniversalGuideRenderer data={guideData} specKey="havoc" />
 * 
 * 생성일: 2025-11-28
 */

import React, { useState, useRef, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// 가이드 모듈 import
import {
  PageWrapper,
  Sidebar,
  MainContent,
  ContentContainer,
  NavSection,
  NavItem,
  SubNavItem,
  GlobalStyle
} from './GuideStyledComponents';

import {
  useGuideNavigation,
  useSelection
} from './GuideHooks';

import {
  SkillIcon,
  OpenerTimeline,
  PriorityTable,
  MechanicsSection,
  HeroTalentTabs,
  ComboSequence,
  TipsSection,
  FAQAccordion,
  CooldownTable,
  StrengthWeaknessGrid,
  TierSetCard,
  InfoBox,
  WarningBox,
  DangerBox,
  Section,
  SectionTitle,
  SubSection,
  SubTitle
} from './GuideContentComponents';

import { getClassColor } from './guideSchema';

// ============================================
// 추가 스타일 정의
// ============================================

const GuideHeader = styled.header`
  text-align: center;
  padding: 2rem 0 3rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.borderColor || '#A330C9'};
`;

const GuideTitle = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.color || '#A330C9'};
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 20px ${props => props.color || '#A330C9'}50;
`;

const GuideSubtitle = styled.p`
  color: #a0a0a0;
  font-size: 1rem;
  margin: 0;
`;

const GuideMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const MetaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${props => props.bgColor || 'rgba(163, 48, 201, 0.2)'};
  border: 1px solid ${props => props.borderColor || 'rgba(163, 48, 201, 0.5)'};
  border-radius: 20px;
  font-size: 0.85rem;
  color: ${props => props.color || '#A330C9'};
`;

const DescriptionBox = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  line-height: 1.7;
  color: #e0e0e0;
  font-size: 0.95rem;
`;

const SidebarHeader = styled.div`
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${props => props.borderColor || 'rgba(163, 48, 201, 0.3)'};
`;

const SidebarTitle = styled.h3`
  color: ${props => props.color || '#A330C9'};
  font-size: 1rem;
  margin: 0;
`;

const RulesBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.borderColor || 'rgba(163, 48, 201, 0.3)'};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const RulesTitle = styled.h5`
  color: ${props => props.color || '#A330C9'};
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
`;

const RulesList = styled.ul`
  margin: 0;
  padding-left: 1.2rem;
  
  li {
    color: #a0a0a0;
    font-size: 0.85rem;
    line-height: 1.5;
    margin-bottom: 4px;
    
    &::marker {
      color: ${props => props.markerColor || '#A330C9'};
    }
  }
`;

// ============================================
// 테마 생성 함수
// ============================================

function createTheme(classColor) {
  // RGB 값 추출
  const hex = classColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return {
    colors: {
      primary: classColor,
      secondary: '#1a1a2e',
      background: '#0a0a0f',
      surface: '#15151f',
      text: '#e0e0e0',
      subtext: '#a0a0a0',
      accent: '#00FF96',
      accentRGB: `${r}, ${g}, ${b}`,
      border: '#2a2a3e',
      hover: `rgba(${r}, ${g}, ${b}, 0.1)`,
      success: '#4caf50',
      danger: '#f44336',
      warning: '#ff9800',
    },
    spacing: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    }
  };
}

// ============================================
// 네비게이션 구조 정의
// ============================================

const NAV_STRUCTURE = [
  { id: 'overview', label: '📖 개요', subItems: [] },
  { id: 'heroTalents', label: '⚔️ 영웅 특성', subItems: [] },
  { id: 'rotation', label: '🔄 딜사이클', subItems: [
    { id: 'rotation-opener', label: '오프너' },
    { id: 'rotation-st', label: '단일 대상' },
    { id: 'rotation-aoe', label: '광역' },
    { id: 'rotation-cooldowns', label: '쿨다운' }
  ]},
  { id: 'mechanics', label: '⚙️ 핵심 메커니즘', subItems: [] },
  { id: 'tips', label: '💡 팁', subItems: [] },
  { id: 'faq', label: '❓ FAQ', subItems: [] }
];

// ============================================
// 메인 렌더러 컴포넌트
// ============================================

/**
 * UniversalGuideRenderer
 * JSON 데이터를 받아 완전한 가이드 페이지를 렌더링
 * 
 * @param {Object} data - 가이드 JSON 데이터
 * @param {string} specKey - 전문화 키 (예: "havoc")
 */
export const UniversalGuideRenderer = ({ data, specKey }) => {
  const spec = data.specs[specKey];
  const classColor = data.color || getClassColor(data.className);
  const theme = createTheme(classColor);
  
  // 영웅 특성 키 추출
  const heroTalentKeys = spec.heroTalents ? Object.keys(spec.heroTalents) : [];
  const defaultHero = heroTalentKeys.find(k => spec.heroTalents[k].recommended) || heroTalentKeys[0];
  
  // Hooks
  const [activeHeroTalent, setActiveHeroTalent] = useState(defaultHero);
  const [activeSection, setActiveSection] = useState('overview');
  const sectionRefs = useRef({});
  
  // 현재 영웅 특성 데이터
  const currentHero = spec.heroTalents?.[activeHeroTalent];
  const currentRotation = spec.rotation?.[activeHeroTalent];
  const currentTierSet = spec.tierSet?.[activeHeroTalent] || spec.tierSet;
  
  // 스크롤 핸들러
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  // 영웅 특성 탭 데이터
  const heroTabs = heroTalentKeys.map(key => ({
    id: key,
    name: spec.heroTalents[key].name,
    icon: spec.heroTalents[key].icon,
    color: spec.heroTalents[key].color || classColor,
    recommended: spec.heroTalents[key].recommended
  }));

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PageWrapper>
        {/* 사이드바 */}
        <Sidebar>
          <SidebarHeader borderColor={`${classColor}40`}>
            <SidebarTitle color={classColor}>
              {data.classNameKo} - {spec.specNameKo}
            </SidebarTitle>
          </SidebarHeader>
          
          <NavSection>
            {NAV_STRUCTURE.map(nav => (
              <React.Fragment key={nav.id}>
                <NavItem
                  active={activeSection === nav.id}
                  onClick={() => scrollToSection(nav.id)}
                >
                  {nav.label}
                </NavItem>
                {nav.subItems.map(sub => (
                  <SubNavItem
                    key={sub.id}
                    active={activeSection === sub.id}
                    onClick={() => scrollToSection(sub.id)}
                  >
                    {sub.label}
                  </SubNavItem>
                ))}
              </React.Fragment>
            ))}
          </NavSection>
        </Sidebar>

        {/* 메인 콘텐츠 */}
        <MainContent>
          <ContentContainer>
            {/* 헤더 */}
            <GuideHeader borderColor={classColor}>
              <GuideTitle color={classColor}>
                {data.classNameKo} {spec.specNameKo} 가이드
              </GuideTitle>
              <GuideSubtitle>
                패치 {spec.patch} | {spec.source || 'WoW Meta'}
              </GuideSubtitle>
              <GuideMeta>
                <MetaBadge bgColor={`${classColor}20`} borderColor={`${classColor}50`} color={classColor}>
                  📅 {spec.lastUpdate}
                </MetaBadge>
                <MetaBadge bgColor="rgba(255, 152, 0, 0.2)" borderColor="rgba(255, 152, 0, 0.5)" color="#ffa500">
                  ⚡ {spec.difficulty}
                </MetaBadge>
                <MetaBadge bgColor="rgba(76, 175, 80, 0.2)" borderColor="rgba(76, 175, 80, 0.5)" color="#4caf50">
                  🎯 {spec.role}
                </MetaBadge>
                {spec.resourceType && (
                  <MetaBadge bgColor="rgba(0, 255, 150, 0.2)" borderColor="rgba(0, 255, 150, 0.5)" color="#00FF96">
                    💰 {spec.resourceType}
                  </MetaBadge>
                )}
              </GuideMeta>
            </GuideHeader>

            {/* 1. 개요 섹션 */}
            <Section id="overview" ref={el => sectionRefs.current.overview = el}>
              <SectionTitle color={classColor}>📖 개요</SectionTitle>
              
              {spec.overview?.description && (
                <DescriptionBox>{spec.overview.description}</DescriptionBox>
              )}
              
              {spec.overview?.strengths && spec.overview?.weaknesses && (
                <SubSection style={{ marginTop: '1.5rem' }}>
                  <StrengthWeaknessGrid 
                    strengths={spec.overview.strengths}
                    weaknesses={spec.overview.weaknesses}
                  />
                </SubSection>
              )}
            </Section>

            {/* 2. 영웅 특성 섹션 */}
            {spec.heroTalents && (
              <Section id="heroTalents" ref={el => sectionRefs.current.heroTalents = el}>
                <SectionTitle color={classColor}>⚔️ 영웅 특성</SectionTitle>
                
                <HeroTalentTabs
                  tabs={heroTabs}
                  activeTab={activeHeroTalent}
                  onTabChange={setActiveHeroTalent}
                  classColor={classColor}
                >
                  {currentHero && (
                    <>
                      <DescriptionBox style={{ marginBottom: '1rem' }}>
                        {currentHero.description}
                      </DescriptionBox>
                      
                      {currentHero.strengths && currentHero.strengths.length > 0 && (
                        <InfoBox color={currentHero.color || classColor}>
                          <strong>강점:</strong> {currentHero.strengths.join(' | ')}
                        </InfoBox>
                      )}
                      
                      {currentHero.keyMechanics && currentHero.keyMechanics.length > 0 && (
                        <SubSection>
                          <SubTitle color={currentHero.color || classColor}>핵심 메커니즘</SubTitle>
                          <MechanicsSection 
                            mechanics={currentHero.keyMechanics}
                            classColor={currentHero.color || classColor}
                          />
                        </SubSection>
                      )}
                    </>
                  )}
                </HeroTalentTabs>

                {/* 티어 세트 */}
                {currentTierSet && (
                  <SubSection style={{ marginTop: '1.5rem' }}>
                    <TierSetCard 
                      season={currentTierSet.season || spec.tierSet?.season || 3}
                      twoSet={currentTierSet.twoSet}
                      fourSet={currentTierSet.fourSet}
                    />
                  </SubSection>
                )}
              </Section>
            )}

            {/* 3. 딜사이클 섹션 */}
            {currentRotation && (
              <Section id="rotation" ref={el => sectionRefs.current.rotation = el}>
                <SectionTitle color={classColor}>🔄 딜사이클 ({currentHero?.name || activeHeroTalent})</SectionTitle>
                
                {/* 오프너 */}
                {currentRotation.opener && currentRotation.opener.length > 0 && (
                  <SubSection id="rotation-opener" ref={el => sectionRefs.current['rotation-opener'] = el}>
                    <SubTitle>🎯 오프너</SubTitle>
                    <OpenerTimeline 
                      steps={currentRotation.opener}
                      classColor={currentHero?.color || classColor}
                    />
                  </SubSection>
                )}

                {/* 단일 대상 우선순위 */}
                {currentRotation.stPriority && currentRotation.stPriority.length > 0 && (
                  <SubSection id="rotation-st" ref={el => sectionRefs.current['rotation-st'] = el}>
                    <SubTitle>🎯 단일 대상 (ST) 우선순위</SubTitle>
                    <PriorityTable 
                      priorities={currentRotation.stPriority}
                      classColor={currentHero?.color || classColor}
                    />
                  </SubSection>
                )}

                {/* 콤보 시퀀스 (정수파쇄 윈도우 등) */}
                {currentRotation.essenceBreakWindow && (
                  <SubSection>
                    <ComboSequence 
                      title={currentRotation.essenceBreakWindow.title}
                      steps={currentRotation.essenceBreakWindow.combo}
                      requirements={currentRotation.essenceBreakWindow.requirements}
                      classColor={currentHero?.color || classColor}
                    />
                  </SubSection>
                )}

                {/* 특수 규칙 (글레이브 규칙 등) */}
                {currentRotation.reaversGlaiveRules && (
                  <RulesBox borderColor={`${currentHero?.color || classColor}40`}>
                    <RulesTitle color={currentHero?.color || classColor}>
                      {currentRotation.reaversGlaiveRules.title}
                    </RulesTitle>
                    {currentRotation.reaversGlaiveRules.stRules && (
                      <>
                        <div style={{ color: '#e0e0e0', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                          <strong>단일 대상:</strong>
                        </div>
                        <RulesList markerColor={currentHero?.color || classColor}>
                          {currentRotation.reaversGlaiveRules.stRules.map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                          ))}
                        </RulesList>
                      </>
                    )}
                    {currentRotation.reaversGlaiveRules.aoeRules && (
                      <>
                        <div style={{ color: '#e0e0e0', fontSize: '0.85rem', margin: '1rem 0 0.5rem' }}>
                          <strong>광역:</strong>
                        </div>
                        <RulesList markerColor={currentHero?.color || classColor}>
                          {currentRotation.reaversGlaiveRules.aoeRules.map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                          ))}
                        </RulesList>
                      </>
                    )}
                  </RulesBox>
                )}

                {/* 제물의오라 규칙 (지옥상흔) */}
                {currentRotation.immolationAuraRules && (
                  <SubSection>
                    <DangerBox>
                      <strong>🚫 {currentRotation.immolationAuraRules.critical}</strong>
                      <p style={{ margin: '0.5rem 0', color: '#e0e0e0', fontSize: '0.9rem' }}>
                        {currentRotation.immolationAuraRules.reason}
                      </p>
                      <RulesList markerColor="#f44336">
                        {currentRotation.immolationAuraRules.usagePriority?.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </RulesList>
                    </DangerBox>
                  </SubSection>
                )}

                {/* 광역 우선순위 */}
                {currentRotation.aoePriority && currentRotation.aoePriority.length > 0 && (
                  <SubSection id="rotation-aoe" ref={el => sectionRefs.current['rotation-aoe'] = el}>
                    <SubTitle>💥 광역 (AOE) 우선순위</SubTitle>
                    <PriorityTable 
                      priorities={currentRotation.aoePriority}
                      classColor={currentHero?.color || classColor}
                    />
                  </SubSection>
                )}

                {/* 쿨다운 관리 */}
                {spec.rotation?.cooldowns && spec.rotation.cooldowns.length > 0 && (
                  <SubSection id="rotation-cooldowns" ref={el => sectionRefs.current['rotation-cooldowns'] = el}>
                    <SubTitle>⏱️ 쿨다운 관리</SubTitle>
                    <CooldownTable 
                      cooldowns={spec.rotation.cooldowns}
                      classColor={classColor}
                    />
                  </SubSection>
                )}
              </Section>
            )}

            {/* 4. 핵심 메커니즘 섹션 */}
            {spec.mechanics && spec.mechanics.length > 0 && (
              <Section id="mechanics" ref={el => sectionRefs.current.mechanics = el}>
                <SectionTitle color={classColor}>⚙️ 핵심 메커니즘</SectionTitle>
                <MechanicsSection 
                  mechanics={spec.mechanics}
                  classColor={classColor}
                />
              </Section>
            )}

            {/* 5. 팁 섹션 */}
            {spec.tips && spec.tips.length > 0 && (
              <Section id="tips" ref={el => sectionRefs.current.tips = el}>
                <SectionTitle color={classColor}>💡 핵심 팁</SectionTitle>
                <TipsSection 
                  tips={spec.tips}
                  classColor={classColor}
                />
              </Section>
            )}

            {/* 6. FAQ 섹션 */}
            {spec.faq && spec.faq.length > 0 && (
              <Section id="faq" ref={el => sectionRefs.current.faq = el}>
                <SectionTitle color={classColor}>❓ 자주 묻는 질문</SectionTitle>
                <FAQAccordion 
                  items={spec.faq}
                  classColor={classColor}
                />
              </Section>
            )}

          </ContentContainer>
        </MainContent>
      </PageWrapper>
    </ThemeProvider>
  );
};

// ============================================
// 래퍼 컴포넌트 (페이지용)
// ============================================

/**
 * 가이드 페이지 래퍼
 * 직업/전문화별 페이지에서 사용
 */
export const GuidePageWrapper = ({ guideData, specKey }) => {
  useEffect(() => {
    const spec = guideData.specs[specKey];
    document.title = `${guideData.classNameKo} ${spec.specNameKo} 가이드 - WoW Meta`;
  }, [guideData, specKey]);

  return <UniversalGuideRenderer data={guideData} specKey={specKey} />;
};

export default UniversalGuideRenderer;
