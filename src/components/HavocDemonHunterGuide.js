/**
 * HavocDemonHunterGuide.js - 파멸 악마사냥꾼 가이드
 * JSON 데이터 기반 동적 렌더링 + 사이드바 네비게이션
 * 생성일: 2025-11-17
 */

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider } from 'styled-components';
import demonhunterGuideData from '../data/guides/demonhunter.json';
import { SkillHubProvider, useSkillHub } from '../contexts/SkillHubContext';
import { getSkillBySpellId } from '../data/guides/demonHunterIcons';

// 테마 정의
const theme = {
  colors: {
    primary: '#A330C9',
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#00FF96',
    border: '#2a2a3e',
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

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const Sidebar = styled.nav`
  width: 220px;
  position: fixed;
  left: 0;
  top: 80px;
  height: calc(100vh - 80px);
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
  z-index: 100;
`;

const SidebarTitle = styled.h3`
  font-size: 1rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 2px solid ${props => props.theme.colors.primary};
`;

const NavItem = styled.a`
  display: block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  margin-bottom: 4px;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.subtext};
  background: ${props => props.active ? 'rgba(163, 48, 201, 0.2)' : 'transparent'};
  border-left: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  border-radius: 0 4px 4px 0;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: rgba(163, 48, 201, 0.1);
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 220px;
  padding: ${props => props.theme.spacing.xl};
  max-width: 1000px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
  padding-bottom: ${props => props.theme.spacing.xl};
  border-bottom: 2px solid ${props => props.theme.colors.primary};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  text-shadow: 0 0 20px rgba(163, 48, 201, 0.5);
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.subtext};
`;

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xxl};
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  scroll-margin-top: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const SubSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const SubTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.accent};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Text = styled.p`
  line-height: 1.7;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const List = styled.ul`
  list-style: none;
  padding: 0;

  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: ${props => props.theme.spacing.sm};
    line-height: 1.6;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: ${props => props.theme.colors.primary};
      font-weight: bold;
    }
  }
`;

const OrderedList = styled.ol`
  padding-left: 1.5rem;

  li {
    margin-bottom: ${props => props.theme.spacing.sm};
    line-height: 1.6;

    &::marker {
      color: ${props => props.theme.colors.primary};
      font-weight: bold;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const Card = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.md};
`;

const InfoBox = styled.div`
  background: rgba(163, 48, 201, 0.1);
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md};
  border-radius: 0 8px 8px 0;
  margin: ${props => props.theme.spacing.md} 0;
`;

const WarningBox = styled.div`
  background: rgba(255, 152, 0, 0.1);
  border-left: 4px solid ${props => props.theme.colors.warning};
  padding: ${props => props.theme.spacing.md};
  border-radius: 0 8px 8px 0;
  margin: ${props => props.theme.spacing.md} 0;
`;

// 인라인 스킬 관련 스타일
const SkillWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  position: relative;
`;

const SkillIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.primary};
  vertical-align: middle;
`;

const SkillName = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  border-bottom: 1px dotted ${props => props.theme.colors.primary};

  &:hover {
    color: ${props => props.theme.colors.accent};
    text-shadow: 0 0 8px rgba(163, 48, 201, 0.5);
  }
`;

const TooltipContainer = styled.div`
  position: fixed;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(15, 15, 25, 0.98) 100%);
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  z-index: 10000;
  width: 350px;
  pointer-events: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9), 0 0 20px rgba(163, 48, 201, 0.3);
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(163, 48, 201, 0.3);
`;

const TooltipIcon = styled.img`
  width: 48px;
  height: 48px;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 6px;
  box-shadow: 0 0 12px rgba(163, 48, 201, 0.3);
`;

const TooltipTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.primary};
  font-size: 1.1rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(163, 48, 201, 0.4);
`;

const TooltipEnglish = styled.div`
  color: #999;
  font-size: 0.85rem;
  font-style: italic;
`;

const TooltipDesc = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const TooltipStats = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  font-size: 0.85rem;
`;

const StatLabel = styled.span`
  color: ${props => props.color || props.theme.colors.primary};
  font-weight: 600;
`;

const StatValue = styled.span`
  color: ${props => props.color || '#e0e0e0'};
`;

// InlineSkill 컴포넌트 - 아이콘 + 이름 + 호버 툴팁
const InlineSkill = ({ skillId }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const skillRef = useRef(null);
  const { getSkillById } = useSkillHub();

  // kb-skills.json에서 먼저 찾고, 없으면 demonHunterIcons.js에서 폴백
  let skill = getSkillById(skillId);
  if (!skill) {
    skill = getSkillBySpellId(skillId);
    if (skill) {
      console.log(`[InlineSkill] 폴백 사용: ${skillId} -> ${skill.koreanName}`);
    }
  }

  if (!skill) {
    console.warn(`[InlineSkill] 스킬 못 찾음: ${skillId}`);
    return <span style={{ color: '#ff6b6b' }}>[스킬 ID {skillId} 없음]</span>;
  }

  const calculatePosition = () => {
    if (!skillRef.current) return;
    const rect = skillRef.current.getBoundingClientRect();
    const tooltipWidth = 350;
    const tooltipHeight = 280;

    let top = rect.top - tooltipHeight - 10;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    if (top < 10) top = rect.bottom + 10;
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }

    setTooltipPos({ top, left });
  };

  const handleMouseEnter = () => {
    calculatePosition();
    setShowTooltip(true);
  };

  const getTooltipPortal = () => {
    let portal = document.getElementById('skill-tooltip-portal');
    if (!portal) {
      portal = document.createElement('div');
      portal.id = 'skill-tooltip-portal';
      document.body.appendChild(portal);
    }
    return portal;
  };

  return (
    <>
      <SkillWrapper
        ref={skillRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SkillIcon
          src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
          alt={skill.koreanName}
          onError={(e) => {
            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
          }}
        />
        <SkillName>{skill.koreanName}</SkillName>
      </SkillWrapper>
      {showTooltip && ReactDOM.createPortal(
        <TooltipContainer style={{ top: tooltipPos.top, left: tooltipPos.left }}>
          <TooltipHeader>
            <TooltipIcon
              src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
              alt={skill.koreanName}
              onError={(e) => {
                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
              }}
            />
            <div>
              <TooltipTitle>{skill.koreanName}</TooltipTitle>
              {skill.englishName && <TooltipEnglish>{skill.englishName}</TooltipEnglish>}
            </div>
          </TooltipHeader>
          <TooltipDesc>{skill.description || '설명 없음'}</TooltipDesc>
          <TooltipStats>
            {skill.castTime && (
              <>
                <StatLabel>시전 시간:</StatLabel>
                <StatValue>{skill.castTime}</StatValue>
              </>
            )}
            {skill.cooldown && skill.cooldown !== '해당 없음' && (
              <>
                <StatLabel color="#ffa500">재사용 대기시간:</StatLabel>
                <StatValue color="#ffa500">{skill.cooldown}</StatValue>
              </>
            )}
            {skill.range && (
              <>
                <StatLabel>사거리:</StatLabel>
                <StatValue>{skill.range}</StatValue>
              </>
            )}
            {skill.resourceCost && skill.resourceCost !== '없음' && (
              <>
                <StatLabel color="#ef5350">소모:</StatLabel>
                <StatValue>{skill.resourceCost}</StatValue>
              </>
            )}
          </TooltipStats>
        </TooltipContainer>,
        getTooltipPortal()
      )}
    </>
  );
};

// 타임라인 스타일
const TimelineContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: ${props => props.theme.spacing.md};
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow-x: auto;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimelineArrow = styled.span`
  color: ${props => props.theme.colors.accent};
  font-size: 1.2rem;
  font-weight: bold;
`;

const TimelineSkillIcon = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 2px solid ${props => props.theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 12px rgba(163, 48, 201, 0.5);
  }
`;

// 우선순위 카드 스타일
const PriorityCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => `rgba(163, 48, 201, ${0.3 - props.priority * 0.015})`};
  border-left: 4px solid ${props => props.theme.colors.primary};
  border-radius: 0 8px 8px 0;
  margin-bottom: 8px;
`;

const PriorityNumber = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  min-width: 30px;
`;

const PriorityContent = styled.div`
  flex: 1;
  line-height: 1.5;
`;

const HeroTalentToggle = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

// Main Component (Inner - SkillHub 사용)
const HavocDemonHunterGuideInner = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [heroTalent, setHeroTalent] = useState('aldrachiReaver');
  const sectionRefs = useRef({});

  const guideData = demonhunterGuideData.specs.havoc;

  const sections = [
    { id: 'overview', label: '📋 개요' },
    { id: 'mechanics', label: '⚙️ 메커니즘' },
    { id: 'rotation', label: '🔄 딜사이클' },
    { id: 'advanced', label: '🎓 심화' },
    { id: 'tips', label: '💡 팁' },
    { id: 'faq', label: '❓ FAQ' },
  ];

  // 스크롤 감지하여 현재 섹션 하이라이트
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        {/* 사이드바 네비게이션 */}
        <Sidebar>
          <SidebarTitle>파멸 악마사냥꾼</SidebarTitle>
          {sections.map(section => (
            <NavItem
              key={section.id}
              active={activeSection === section.id}
              onClick={() => scrollToSection(section.id)}
            >
              {section.label}
            </NavItem>
          ))}
        </Sidebar>

        {/* 메인 콘텐츠 */}
        <MainContent>
          <Header>
            <Title>파멸 악마사냥꾼 가이드</Title>
            <Subtitle>
              패치 {guideData.patch} | 최종 업데이트: {guideData.lastUpdate} | 난이도: {guideData.difficulty}
            </Subtitle>
          </Header>

          {/* 개요 섹션 */}
          <Section id="overview" ref={el => sectionRefs.current.overview = el}>
            <SectionTitle>📋 개요</SectionTitle>
            <Text><ParseSkillText text={guideData.overview.description} /></Text>

            <Grid>
              <Card>
                <SubTitle>✅ 강점</SubTitle>
                <List>
                  {guideData.overview.strengths.map((str, idx) => (
                    <li key={idx}><ParseSkillText text={str} /></li>
                  ))}
                </List>
              </Card>
              <Card>
                <SubTitle>❌ 약점</SubTitle>
                <List>
                  {guideData.overview.weaknesses.map((weak, idx) => (
                    <li key={idx}><ParseSkillText text={weak} /></li>
                  ))}
                </List>
              </Card>
            </Grid>

            <SubSection>
              <SubTitle>⚡ 자원 시스템: {guideData.overview.resourceSystem.type}</SubTitle>
              <Text><ParseSkillText text={guideData.overview.resourceSystem.description} /></Text>
            </SubSection>

            <SubSection>
              <SubTitle>🎯 핵심 스킬</SubTitle>
              <Grid>
                {guideData.overview.coreSkills.map((skill, idx) => (
                  <Card key={idx}>
                    <div style={{marginBottom: '0.5rem'}}>
                      <InlineSkill skillId={skill.id} />
                    </div>
                    <Text style={{fontSize: '0.9rem', marginTop: '0.5rem'}}><ParseSkillText text={skill.description} /></Text>
                  </Card>
                ))}
              </Grid>
            </SubSection>
          </Section>

          {/* 메커니즘 섹션 */}
          <Section id="mechanics" ref={el => sectionRefs.current.mechanics = el}>
            <SectionTitle>⚙️ 핵심 메커니즘</SectionTitle>
            {guideData.mechanics.map((mech, idx) => (
              <SubSection key={idx}>
                <SubTitle>{mech.icon} {mech.name}</SubTitle>
                <Text><ParseSkillText text={mech.description} /></Text>
                <List>
                  {mech.tips.map((tip, tipIdx) => (
                    <li key={tipIdx}><ParseSkillText text={tip} /></li>
                  ))}
                </List>
              </SubSection>
            ))}
          </Section>

          {/* 딜사이클 섹션 */}
          <Section id="rotation" ref={el => sectionRefs.current.rotation = el}>
            <SectionTitle>🔄 딜사이클</SectionTitle>

            <HeroTalentToggle>
              <ToggleButton
                active={heroTalent === 'aldrachiReaver'}
                onClick={() => setHeroTalent('aldrachiReaver')}
              >
                🗡️ 알드라치 파괴자
              </ToggleButton>
              <ToggleButton
                active={heroTalent === 'felScarred'}
                onClick={() => setHeroTalent('felScarred')}
              >
                🔥 지옥상흔
              </ToggleButton>
            </HeroTalentToggle>

            {heroTalent === 'aldrachiReaver' ? (
              <>
                <SubSection>
                  <SubTitle>🎯 오프닝 타임라인</SubTitle>
                  <SkillTimeline steps={guideData.rotation.aldrachiReaver.opener} />
                  <InfoBox style={{ marginTop: '1rem' }}>
                    <strong>상세 순서:</strong>
                    <OrderedList style={{ marginTop: '0.5rem' }}>
                      {guideData.rotation.aldrachiReaver.opener.map((step, idx) => (
                        <li key={idx}><ParseSkillText text={step} /></li>
                      ))}
                    </OrderedList>
                  </InfoBox>
                </SubSection>

                <SubSection>
                  <SubTitle>📊 우선순위</SubTitle>
                  <PriorityList items={guideData.rotation.aldrachiReaver.priority} />
                </SubSection>

                <SubSection>
                  <SubTitle>💥 정수 파쇄 타이밍</SubTitle>
                  <SkillTimeline steps={guideData.rotation.aldrachiReaver.essenceBreakWindow.combo} />
                </SubSection>
              </>
            ) : (
              <>
                <SubSection>
                  <SubTitle>🎯 오프닝 타임라인</SubTitle>
                  <SkillTimeline steps={guideData.rotation.felScarred.opener} />
                  <InfoBox style={{ marginTop: '1rem' }}>
                    <strong>상세 순서:</strong>
                    <OrderedList style={{ marginTop: '0.5rem' }}>
                      {guideData.rotation.felScarred.opener.map((step, idx) => (
                        <li key={idx}><ParseSkillText text={step} /></li>
                      ))}
                    </OrderedList>
                  </InfoBox>
                </SubSection>

                <SubSection>
                  <SubTitle>📊 우선순위</SubTitle>
                  <PriorityList items={guideData.rotation.felScarred.priority} />
                </SubSection>

                <SubSection>
                  <SubTitle>🔥 제물의 오라 규칙</SubTitle>
                  <WarningBox>
                    <strong>⚠️ 중요: 최대 5개 동시 활성화 제한!</strong>
                  </WarningBox>
                  <List>
                    {guideData.rotation.felScarred.immoAuraRules.rules.map((rule, idx) => (
                      <li key={idx}><ParseSkillText text={rule} /></li>
                    ))}
                  </List>
                </SubSection>
              </>
            )}
          </Section>

          {/* 심화 전략 섹션 */}
          <Section id="advanced" ref={el => sectionRefs.current.advanced = el}>
            <SectionTitle>🎓 심화 전략</SectionTitle>
            {guideData.advanced.map((adv, idx) => (
              <SubSection key={idx}>
                <SubTitle>{adv.title}</SubTitle>
                <Text><ParseSkillText text={adv.description} /></Text>
                <List>
                  {adv.points.map((point, pointIdx) => (
                    <li key={pointIdx}><ParseSkillText text={point} /></li>
                  ))}
                </List>
              </SubSection>
            ))}
          </Section>

          {/* 팁 섹션 */}
          <Section id="tips" ref={el => sectionRefs.current.tips = el}>
            <SectionTitle>💡 핵심 팁</SectionTitle>
            <List>
              {guideData.tips.map((tip, idx) => (
                <li key={idx}><ParseSkillText text={tip} /></li>
              ))}
            </List>
          </Section>

          {/* FAQ 섹션 */}
          <Section id="faq" ref={el => sectionRefs.current.faq = el}>
            <SectionTitle>❓ 자주 묻는 질문</SectionTitle>
            {guideData.faq.map((item, idx) => (
              <SubSection key={idx}>
                <SubTitle>Q: {item.question}</SubTitle>
                <Text><strong>A:</strong> <ParseSkillText text={item.answer} /></Text>
              </SubSection>
            ))}
          </Section>

        </MainContent>
      </PageWrapper>
    </ThemeProvider>
  );
};

// 스킬 이름 → ID 매핑 테이블
const skillNameToId = {
  // 기본 스킬
  '악마의 이빨': '162243',
  '혼돈의 일격': '162794',
  '파멸': '201427', // Annihilation (탈태 중 혼돈의 일격 대체)
  '탈태': '191427',
  '안광': '198013',
  '칼춤': '188499',
  '죽음의 휩쓸기': '210152', // 탈태 중 칼춤 대체
  '정수 파쇄': '258860',
  '제물의 오라': '258920',
  '지옥 돌진': '195072',
  '글레이브 투척': '185123',
  '복수의 퇴각': '198793',
  '불꽃의 인장': '204596',
  '지옥칼': '232893',
  '악마의 칼날': '203555', // Demon Blades 특성
  '지옥 연발': '211053', // Fel Barrage
  '사냥': '323639', // The Hunt
  '글레이브의 폭풍': '342817', // Glaive Tempest

  // 영웅 특성 및 주요 특성 (일부는 spell ID 미보유)
  '파괴자의 글레이브': '442294',
  '알드라치 파괴자': 'hero_aldrachi', // 영웅 특성 트리
  '지옥상흔': 'hero_felscarred', // 영웅 특성 트리
  '악마쇄도': '452402', // Demonsurge (Fel-Scarred Keystone)
  '부상당한 사냥감': 'talent_wounded_quarry',
  '선제 공격': 'talent_initiative',
  '타성': 'talent_inertia',
  '갈무리한 기운': 'talent_exergy',
  '예술의 검': 'talent_art_glaive',
  '고통의 수습생': 'talent_student_suffering',
};

// 텍스트에서 스킬명을 파싱하여 InlineSkill로 변환
const ParseSkillText = ({ text }) => {
  const parts = [];
  let remaining = text;
  let key = 0;

  // 모든 스킬명을 찾아서 분리
  const skillNames = Object.keys(skillNameToId).sort((a, b) => b.length - a.length); // 긴 이름 먼저

  while (remaining.length > 0) {
    let found = false;

    for (const skillName of skillNames) {
      const idx = remaining.indexOf(skillName);
      if (idx === 0) {
        // 스킬명 발견
        parts.push(
          <InlineSkill key={key++} skillId={skillNameToId[skillName]} />
        );
        remaining = remaining.substring(skillName.length);
        found = true;
        break;
      } else if (idx > 0) {
        // 스킬명 전의 텍스트
        parts.push(<span key={key++}>{remaining.substring(0, idx)}</span>);
        parts.push(
          <InlineSkill key={key++} skillId={skillNameToId[skillName]} />
        );
        remaining = remaining.substring(idx + skillName.length);
        found = true;
        break;
      }
    }

    if (!found) {
      // 더 이상 스킬명이 없음
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
  }

  return <>{parts}</>;
};

// 스킬 타임라인 컴포넌트 (오프닝용)
const SkillTimeline = ({ steps }) => {
  const { getSkillById } = useSkillHub();
  const [showTooltip, setShowTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const iconRefs = useRef({});

  // 폴백 포함 스킬 조회
  const getSkillWithFallback = (skillId) => {
    let skill = getSkillById(skillId);
    if (!skill) {
      skill = getSkillBySpellId(skillId);
    }
    return skill;
  };

  // 텍스트에서 스킬명 추출
  const extractSkillIds = (text) => {
    const skillNames = Object.keys(skillNameToId).sort((a, b) => b.length - a.length);
    const foundIds = [];
    for (const skillName of skillNames) {
      if (text.includes(skillName)) {
        foundIds.push(skillNameToId[skillName]);
      }
    }
    return foundIds;
  };

  const calculatePosition = (ref) => {
    if (!ref) return;
    const rect = ref.getBoundingClientRect();
    let top = rect.top - 290;
    let left = rect.left + rect.width / 2 - 175;
    if (top < 10) top = rect.bottom + 10;
    if (left < 10) left = 10;
    if (left + 350 > window.innerWidth - 10) {
      left = window.innerWidth - 360;
    }
    setTooltipPos({ top, left });
  };

  const getTooltipPortal = () => {
    let portal = document.getElementById('timeline-tooltip-portal');
    if (!portal) {
      portal = document.createElement('div');
      portal.id = 'timeline-tooltip-portal';
      document.body.appendChild(portal);
    }
    return portal;
  };

  return (
    <>
      <TimelineContainer>
        {steps.map((step, idx) => {
          const skillIds = extractSkillIds(step);
          return (
            <React.Fragment key={idx}>
              {skillIds.map((skillId, skillIdx) => {
                const skill = getSkillWithFallback(skillId);
                if (!skill) return null;
                const refKey = `${idx}-${skillIdx}`;
                return (
                  <TimelineItem key={refKey}>
                    <TimelineSkillIcon
                      ref={el => iconRefs.current[refKey] = el}
                      src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
                      alt={skill.koreanName}
                      title={skill.koreanName}
                      onMouseEnter={() => {
                        calculatePosition(iconRefs.current[refKey]);
                        setShowTooltip({ skillId, skill });
                      }}
                      onMouseLeave={() => setShowTooltip(null)}
                      onError={(e) => {
                        e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                      }}
                    />
                    {skillIdx < skillIds.length - 1 && <TimelineArrow>+</TimelineArrow>}
                  </TimelineItem>
                );
              })}
              {idx < steps.length - 1 && skillIds.length > 0 && <TimelineArrow>→</TimelineArrow>}
            </React.Fragment>
          );
        })}
      </TimelineContainer>
      {showTooltip && ReactDOM.createPortal(
        <TooltipContainer style={{ top: tooltipPos.top, left: tooltipPos.left }}>
          <TooltipHeader>
            <TooltipIcon
              src={`https://wow.zamimg.com/images/wow/icons/large/${showTooltip.skill.icon}.jpg`}
              alt={showTooltip.skill.koreanName}
            />
            <div>
              <TooltipTitle>{showTooltip.skill.koreanName}</TooltipTitle>
              {showTooltip.skill.englishName && <TooltipEnglish>{showTooltip.skill.englishName}</TooltipEnglish>}
            </div>
          </TooltipHeader>
          <TooltipDesc>{showTooltip.skill.description || '설명 없음'}</TooltipDesc>
          <TooltipStats>
            {showTooltip.skill.cooldown && showTooltip.skill.cooldown !== '해당 없음' && (
              <>
                <StatLabel color="#ffa500">재사용 대기시간:</StatLabel>
                <StatValue color="#ffa500">{showTooltip.skill.cooldown}</StatValue>
              </>
            )}
            {showTooltip.skill.resourceCost && showTooltip.skill.resourceCost !== '없음' && (
              <>
                <StatLabel color="#ef5350">소모:</StatLabel>
                <StatValue>{showTooltip.skill.resourceCost}</StatValue>
              </>
            )}
          </TooltipStats>
        </TooltipContainer>,
        getTooltipPortal()
      )}
    </>
  );
};

// 우선순위 리스트 컴포넌트
const PriorityList = ({ items }) => {
  return (
    <div>
      {items.map((item, idx) => (
        <PriorityCard key={idx} priority={idx}>
          <PriorityNumber>{idx + 1}</PriorityNumber>
          <PriorityContent>
            <ParseSkillText text={item} />
          </PriorityContent>
        </PriorityCard>
      ))}
    </div>
  );
};

// Wrapper Component - SkillHubProvider 래핑
const HavocDemonHunterGuide = () => {
  return (
    <SkillHubProvider>
      <HavocDemonHunterGuideInner />
    </SkillHubProvider>
  );
};

export default HavocDemonHunterGuide;
