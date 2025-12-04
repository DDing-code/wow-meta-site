// 가이드 React 컴포넌트 빌더 시스템
import { twwS3SkillDatabase } from '../../data/twwS3FinalCleanedDatabase.js';

class GuideComponentBuilder {
  constructor() {
    // 스탯 아이콘 매핑
    this.statIcons = {
      weaponDamage: '⚔️',
      haste: '⚡',
      crit: '💥',
      mastery: '📈',
      versatility: '🔄',
      agility: '🏹',
      strength: '💪',
      intellect: '🧠',
      stamina: '❤️'
    };

    // 스탯 한국어 이름
    this.statNames = {
      weaponDamage: '무기 대미지',
      haste: '가속',
      crit: '치명타',
      mastery: '특화',
      versatility: '유연',
      agility: '민첩',
      strength: '힘',
      intellect: '지능',
      stamina: '체력'
    };
  }

  // 완전한 가이드 컴포넌트 생성
  buildCompleteGuide(data) {
    const { className, spec, skillData, heroTalents, rotationData, buildData, statData, classColor } = data;

    return `
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase.js';
import moduleEventBus from '../services/ModuleEventBus.js';
import aiFeedbackService from '../services/AIFeedbackService.js';
import { classIcons, WowIcon, getWowIcon, gameIcons } from '../utils/wowIcons.js';
import wowheadDescriptions from '../data/wowhead-descriptions.json';

// 전역 스타일
const GlobalStyle = createGlobalStyle\`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #0a0a0f;
    color: #e0e0e0;
    line-height: 1.6;
  }

  /* 스크롤바 스타일 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
\`;

// 테마 설정
const unifiedTheme = {
  colors: {
    primary: '${classColor}',
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '${classColor}',
    border: '#2a2a3e',
    hover: 'rgba(170, 211, 114, 0.1)',
    success: '#4caf50',
    danger: '#f44336',
    warning: '#ff9800'
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  }
};

// Styled Components
const PageWrapper = styled.div\`
  min-height: 100vh;
  color: \${props => props.theme.colors.text};
  display: flex;
\`;

const Sidebar = styled.nav\`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 260px;
  max-height: 80vh;
  background: \${props => props.theme.colors.surface};
  border-right: 1px solid \${props => props.theme.colors.border};
  border-radius: 0 8px 8px 0;
  overflow-y: auto;
  padding: \${props => props.theme.spacing.lg} 0;
  z-index: 100;

  @media (max-width: 768px) {
    display: none;
  }
\`;

const MainContent = styled.main\`
  flex: 1;
  margin-left: 280px;
  padding: 0 \${props => props.theme.spacing.xl};
  max-width: 1400px;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 0 1rem;
  }
\`;

const Section = styled.section\`
  margin-bottom: \${props => props.theme.spacing.xxl};
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
\`;

const Card = styled(motion.div)\`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: \${props => props.theme.spacing.lg};
  margin-bottom: \${props => props.theme.spacing.lg};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
\`;

const Toast = styled(motion.div)\`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: \${props => props.theme.colors.success};
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10000;
\`;

// 스킬 데이터
const skillData = ${JSON.stringify(skillData, null, 2)};

// 영웅 특성 설정
const heroTalentConfigs = ${JSON.stringify(heroTalents, null, 2)};

// 딜사이클 데이터
const rotationData = ${JSON.stringify(rotationData, null, 2)};

// 빌드 데이터
const talentBuilds = ${JSON.stringify(buildData, null, 2)};

// 스탯 우선순위
const statPriorities = ${JSON.stringify(statData, null, 2)};

// 스탯 데이터
const statData = {
  weaponDamage: { name: '무기 대미지', icon: '⚔️' },
  haste: { name: '가속', icon: '⚡' },
  crit: { name: '치명타', icon: '💥' },
  mastery: { name: '특화', icon: '📈' },
  versatility: { name: '유연', icon: '🔄' },
  agility: { name: '민첩', icon: '🏹' },
  strength: { name: '힘', icon: '💪' },
  intellect: { name: '지능', icon: '🧠' }
};

// 툴팁 포털 생성
const getTooltipPortal = () => {
  let portal = document.getElementById('tooltip-portal');
  if (!portal) {
    portal = document.createElement('div');
    portal.id = 'tooltip-portal';
    document.body.appendChild(portal);
  }
  return portal;
};

// SkillIcon 컴포넌트
const SkillIconComponent = ({ skill, size = 'medium', showTooltip = true, className = '', textOnly = false }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const iconRef = useRef(null);

  if (!skill) return null;

  const sizeMap = {
    small: 20,
    medium: 32,
    large: 48
  };

  const iconSize = sizeMap[size] || 32;

  // 툴팁 위치 계산
  const calculateTooltipPosition = () => {
    if (!iconRef.current) return { top: 0, left: 0 };

    const rect = iconRef.current.getBoundingClientRect();
    const tooltipWidth = 350;
    const tooltipHeight = 200;

    let top = rect.bottom + 10;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // 화면 경계 체크
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    if (top + tooltipHeight > window.innerHeight - 10) {
      top = rect.top - tooltipHeight - 10;
    }

    return { top, left };
  };

  // 툴팁 렌더링
  const Tooltip = () => {
    if (!isTooltipVisible || !iconRef.current || !showTooltip) return null;

    const { top, left } = calculateTooltipPosition();

    const tooltipStyle = {
      position: 'fixed',
      top: \`\${top}px\`,
      left: \`\${left}px\`,
      backgroundColor: 'rgba(26, 26, 46, 0.98)',
      backgroundImage: 'linear-gradient(135deg, ${classColor}20 0%, transparent 50%)',
      border: '2px solid ${classColor}',
      borderRadius: '10px',
      padding: '16px',
      zIndex: 10000,
      width: '350px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9), 0 0 20px ${classColor}33'
    };

    return ReactDOM.createPortal(
      <div style={tooltipStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <WowIcon icon={getWowIcon(skill.icon)} size={40} />
          <h3 style={{ marginLeft: '12px', color: '${classColor}' }}>{skill.name}</h3>
        </div>
        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#e0e0e0' }}>
          <p>{skill.description}</p>
          <div style={{ marginTop: '12px', fontSize: '13px', color: '#a0a0a0' }}>
            {skill.cooldown && skill.cooldown !== '없음' && (
              <div>재사용 대기시간: {skill.cooldown}</div>
            )}
            {skill.castTime && (
              <div>시전 시간: {skill.castTime}</div>
            )}
            {skill.range && (
              <div>사거리: {skill.range}</div>
            )}
            {skill.resourceCost && skill.resourceCost !== '없음' && (
              <div>소모: {skill.resourceCost}</div>
            )}
          </div>
        </div>
      </div>,
      getTooltipPortal()
    );
  };

  if (textOnly) {
    return (
      <span
        ref={iconRef}
        className={className}
        style={{
          color: '${classColor}',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        {skill.name}
        <Tooltip />
      </span>
    );
  }

  return (
    <>
      <span
        ref={iconRef}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        <WowIcon icon={getWowIcon(skill.icon)} size={iconSize} />
        <Tooltip />
      </span>
    </>
  );
};

const SkillIcon = React.memo(SkillIconComponent);

// 메인 컴포넌트
const ${this.capitalizeFirst(spec)}${this.capitalizeFirst(className)}Guide = () => {
  const [selectedTier, setSelectedTier] = useState(Object.keys(heroTalentConfigs)[0]);
  const [selectedBuildHero, setSelectedBuildHero] = useState(Object.keys(heroTalentConfigs)[0]);
  const [selectedStatHero, setSelectedStatHero] = useState(Object.keys(heroTalentConfigs)[0]);
  const [selectedStatMode, setSelectedStatMode] = useState('single');
  const [showToast, setShowToast] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // 섹션 참조
  const sectionRefs = {
    overview: useRef(null),
    rotation: useRef(null),
    builds: useRef(null),
    stats: useRef(null)
  };

  // 빌드 복사 함수
  const handleCopyBuild = (buildCode) => {
    navigator.clipboard.writeText(buildCode);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const [key, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(key);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 네비게이션 클릭 핸들러
  const handleNavClick = (section) => {
    sectionRefs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 현재 영웅 특성 데이터
  const currentContent = useMemo(() => {
    return {
      ...heroTalentConfigs[selectedTier],
      rotation: rotationData[selectedTier],
      builds: talentBuilds[selectedTier],
      stats: statPriorities[selectedTier]
    };
  }, [selectedTier]);

  return (
    <ThemeProvider theme={unifiedTheme}>
      <GlobalStyle />
      <PageWrapper>
        {/* 사이드바 네비게이션 */}
        <Sidebar>
          <nav style={{ padding: '0 20px' }}>
            <h3 style={{ marginBottom: '20px', color: '${classColor}' }}>목차</h3>
            {['overview', 'rotation', 'builds', 'stats'].map(section => (
              <div
                key={section}
                onClick={() => handleNavClick(section)}
                style={{
                  padding: '10px',
                  margin: '5px 0',
                  borderRadius: '6px',
                  background: activeSection === section ? '${classColor}20' : 'transparent',
                  borderLeft: activeSection === section ? '3px solid ${classColor}' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {section === 'overview' && '개요'}
                {section === 'rotation' && '딜사이클'}
                {section === 'builds' && '특성'}
                {section === 'stats' && '스탯'}
              </div>
            ))}
          </nav>
        </Sidebar>

        {/* 메인 콘텐츠 */}
        <MainContent>
          {/* 헤더 */}
          <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '40px' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '10px', color: '${classColor}' }}>
              ${this.getKoreanSpecName(spec)} ${this.getKoreanClassName(className)} 가이드
            </h1>
            <p style={{ color: '#a0a0a0' }}>
              최종 수정일: ${new Date().toLocaleDateString('ko-KR')} | 작성: WoWMeta | 검수: AI 페르소나
            </p>
          </div>

          {/* 개요 섹션 */}
          <Section ref={sectionRefs.overview} id="overview">
            <h2 style={{ marginBottom: '20px', color: '${classColor}' }}>개요</h2>
            <Card>
              <h3>전문화 소개</h3>
              <p style={{ marginTop: '10px', lineHeight: '1.8' }}>
                ${this.getSpecDescription(className, spec)}
              </p>
            </Card>
          </Section>

          {/* 딜사이클 섹션 */}
          <Section ref={sectionRefs.rotation} id="rotation">
            <h2 style={{ marginBottom: '20px', color: '${classColor}' }}>딜사이클</h2>

            {/* 영웅 특성 선택 탭 */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              ${Object.entries(heroTalents).map(([key, hero]) => `
                <button
                  onClick={() => setSelectedTier('${key}')}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: selectedTier === '${key}' ?
                      'linear-gradient(135deg, ${classColor}66 0%, ${classColor}33 100%)' :
                      'rgba(255, 255, 255, 0.05)',
                    border: \`2px solid \${selectedTier === '${key}' ? '${classColor}' : '#2a2d35'}\`,
                    borderRadius: '8px',
                    color: selectedTier === '${key}' ? '${classColor}' : '#94a3b8',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ${hero.icon} ${hero.name}
                </button>
              `).join('')}
            </div>

            {/* 티어세트 효과 */}
            <Card>
              <h3>티어 세트 효과</h3>
              <div style={{ marginTop: '15px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>2세트:</strong> {currentContent.tierSet['2set']}
                </div>
                <div>
                  <strong>4세트:</strong> {currentContent.tierSet['4set']}
                </div>
              </div>
            </Card>

            {/* 단일 대상 딜사이클 */}
            {currentContent.rotation?.singleTarget && (
              <Card>
                <h3>단일 대상</h3>
                <div style={{ marginTop: '20px' }}>
                  <h4>오프닝 시퀀스</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                    {currentContent.rotation.singleTarget.opener.map((skillKey, index, arr) => (
                      <React.Fragment key={index}>
                        <SkillIcon skill={skillData[skillKey]} size="medium" />
                        {index < arr.length - 1 && <span style={{ color: '${classColor}', fontSize: '1.5rem' }}>→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <h4>스킬 우선순위</h4>
                  <ol style={{ marginTop: '15px', paddingLeft: '20px' }}>
                    {currentContent.rotation.singleTarget.priority.map((item, index) => (
                      <li key={index} style={{ marginBottom: '10px' }}>
                        <SkillIcon skill={skillData[item.skill]} size="small" />
                        <SkillIcon skill={skillData[item.skill]} textOnly={true} /> - {item.desc}
                      </li>
                    ))}
                  </ol>
                </div>
              </Card>
            )}

            {/* 광역 딜사이클 */}
            {currentContent.rotation?.aoe && (
              <Card>
                <h3>광역 (3+ 타겟)</h3>
                <div style={{ marginTop: '20px' }}>
                  <h4>오프닝 시퀀스</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                    {currentContent.rotation.aoe.opener.map((skillKey, index, arr) => (
                      <React.Fragment key={index}>
                        <SkillIcon skill={skillData[skillKey]} size="medium" />
                        {index < arr.length - 1 && <span style={{ color: '${classColor}', fontSize: '1.5rem' }}>→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <h4>스킬 우선순위</h4>
                  <ol style={{ marginTop: '15px', paddingLeft: '20px' }}>
                    {currentContent.rotation.aoe.priority.map((item, index) => (
                      <li key={index} style={{ marginBottom: '10px' }}>
                        <SkillIcon skill={skillData[item.skill]} size="small" />
                        <SkillIcon skill={skillData[item.skill]} textOnly={true} /> - {item.desc}
                      </li>
                    ))}
                  </ol>
                </div>
              </Card>
            )}
          </Section>

          {/* 특성 빌드 섹션 */}
          <Section ref={sectionRefs.builds} id="builds">
            <h2 style={{ marginBottom: '20px', color: '${classColor}' }}>특성 빌드</h2>

            {/* 영웅 특성 선택 */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              ${Object.entries(heroTalents).map(([key, hero]) => `
                <button
                  onClick={() => setSelectedBuildHero('${key}')}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: selectedBuildHero === '${key}' ?
                      'linear-gradient(135deg, ${classColor}66 0%, ${classColor}33 100%)' :
                      'rgba(255, 255, 255, 0.05)',
                    border: \`2px solid \${selectedBuildHero === '${key}' ? '${classColor}' : '#2a2d35'}\`,
                    borderRadius: '8px',
                    color: selectedBuildHero === '${key}' ? '${classColor}' : '#94a3b8',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ${hero.icon} ${hero.name}
                </button>
              `).join('')}
            </div>

            {/* 빌드 카드들 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {talentBuilds[selectedBuildHero] && Object.entries(talentBuilds[selectedBuildHero]).map(([key, build]) => (
                <Card key={key} whileHover={{ scale: 1.02 }}>
                  <h4 style={{ marginBottom: '10px', color: '${classColor}' }}>
                    {build.icon} {build.name}
                  </h4>
                  <p style={{ marginBottom: '15px', fontSize: '14px', color: '#a0a0a0' }}>
                    {build.description}
                  </p>
                  <div
                    onClick={() => handleCopyBuild(build.code)}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      wordBreak: 'break-all'
                    }}
                  >
                    {build.code}
                  </div>
                  <button
                    onClick={() => handleCopyBuild(build.code)}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, ${classColor}66 0%, ${classColor}33 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    빌드 복사
                  </button>
                </Card>
              ))}
            </div>
          </Section>

          {/* 스탯 섹션 */}
          <Section ref={sectionRefs.stats} id="stats">
            <h2 style={{ marginBottom: '20px', color: '${classColor}' }}>스탯 우선순위</h2>

            {/* 영웅 특성 선택 */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              ${Object.entries(heroTalents).map(([key, hero]) => `
                <button
                  onClick={() => setSelectedStatHero('${key}')}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: selectedStatHero === '${key}' ?
                      'linear-gradient(135deg, ${classColor}66 0%, ${classColor}33 100%)' :
                      'rgba(255, 255, 255, 0.05)',
                    border: \`2px solid \${selectedStatHero === '${key}' ? '${classColor}' : '#2a2d35'}\`,
                    borderRadius: '8px',
                    color: selectedStatHero === '${key}' ? '${classColor}' : '#94a3b8',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ${hero.icon} ${hero.name}
                </button>
              `).join('')}
            </div>

            {/* 단일/광역 선택 */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => setSelectedStatMode('single')}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: selectedStatMode === 'single' ? '${classColor}33' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid ${classColor}',
                  borderRadius: '6px',
                  color: selectedStatMode === 'single' ? '${classColor}' : '#a0a0a0',
                  cursor: 'pointer'
                }}
              >
                단일 대상 (레이드)
              </button>
              <button
                onClick={() => setSelectedStatMode('aoe')}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: selectedStatMode === 'aoe' ? '${classColor}33' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid ${classColor}',
                  borderRadius: '6px',
                  color: selectedStatMode === 'aoe' ? '${classColor}' : '#a0a0a0',
                  cursor: 'pointer'
                }}
              >
                광역 (쐐기돌)
              </button>
            </div>

            {/* 스탯 우선순위 표시 */}
            <Card>
              <h3>{heroTalentConfigs[selectedStatHero].icon} {heroTalentConfigs[selectedStatHero].name} - {selectedStatMode === 'single' ? '단일 대상' : '광역'}</h3>
              <div style={{ marginTop: '20px' }}>
                {statPriorities[selectedStatHero] && statPriorities[selectedStatHero][selectedStatMode]?.map((statKey, index) => (
                  <div
                    key={statKey}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px',
                      margin: '10px 0',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: index === 0 ? '${classColor}' : 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        fontWeight: 'bold',
                        color: index === 0 ? 'white' : '#a0a0a0'
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ fontSize: '24px', marginRight: '15px' }}>
                      {statData[statKey]?.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '${classColor}' }}>
                        {statData[statKey]?.name}
                      </div>
                      {index === 0 && <div style={{ fontSize: '12px', color: '#a0a0a0' }}>최우선</div>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3>⚠️ 중요 참고사항</h3>
              <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
                <li>무기 대미지는 항상 최우선 스탯입니다</li>
                <li>2차 스탯은 일반적으로 주 스탯보다 더 강력합니다</li>
                <li>정확한 스탯 가중치는 개인 시뮬레이션을 권장합니다</li>
                <li>영웅 특성에 따라 우선순위가 약간 다릅니다</li>
              </ul>
            </Card>
          </Section>
        </MainContent>

        {/* 토스트 알림 */}
        {showToast && (
          <Toast
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            빌드가 클립보드에 복사되었습니다!
          </Toast>
        )}
      </PageWrapper>
    </ThemeProvider>
  );
};

export default ${this.capitalizeFirst(spec)}${this.capitalizeFirst(className)}Guide;
`;
  }

  // 헬퍼 함수들
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, '');
  }

  getKoreanClassName(className) {
    const nameMap = {
      warrior: '전사',
      paladin: '성기사',
      hunter: '사냥꾼',
      rogue: '도적',
      priest: '사제',
      shaman: '주술사',
      mage: '마법사',
      warlock: '흑마법사',
      monk: '수도사',
      druid: '드루이드',
      demonhunter: '악마사냥꾼',
      deathknight: '죽음의 기사',
      evoker: '기원사'
    };
    return nameMap[className] || className;
  }

  getKoreanSpecName(spec) {
    const specMap = {
      'beast-mastery': '야수',
      'marksmanship': '사격',
      'survival': '생존',
      'arms': '무기',
      'fury': '분노',
      'protection': '방어',
      'retribution': '징벌',
      'holy': '신성',
      'discipline': '수양',
      'shadow': '암흑',
      'assassination': '암살',
      'outlaw': '무법',
      'subtlety': '잠행',
      'elemental': '정기',
      'enhancement': '고양',
      'restoration': '복원',
      'arcane': '비전',
      'fire': '화염',
      'frost': '냉기',
      'affliction': '고통',
      'demonology': '악마',
      'destruction': '파괴',
      'brewmaster': '양조',
      'windwalker': '풍운',
      'mistweaver': '운무',
      'balance': '조화',
      'feral': '야성',
      'guardian': '수호',
      'havoc': '파멸',
      'vengeance': '복수',
      'blood': '혈기',
      'unholy': '부정',
      'devastation': '황폐',
      'preservation': '보존',
      'augmentation': '증강'
    };
    return specMap[spec] || spec;
  }

  getSpecDescription(className, spec) {
    const descriptions = {
      'hunter': {
        'beast-mastery': '야수 사냥꾼은 펫과 함께 전투하는 원거리 딜러 전문화입니다. TWW 시즌3에서는 무리의 지도자와 어둠 순찰자 영웅특성이 모두 사용되며, 특히 무리의 지도자가 쐐기돌에서 강세를 보이고 있습니다.'
      }
      // 다른 클래스/전문화 설명 추가...
    };

    return descriptions[className]?.[spec] || '전문화 설명이 준비 중입니다.';
  }

  // 섹션별 컴포넌트 생성
  buildRotationSection(rotationData, skillData, heroTalents) {
    // 딜사이클 섹션 생성 로직
    return '';
  }

  buildBuildSection(buildData, heroTalents) {
    // 빌드 섹션 생성 로직
    return '';
  }

  buildStatSection(statData, heroTalents) {
    // 스탯 섹션 생성 로직
    return '';
  }
}

// 싱글톤 인스턴스
const guideComponentBuilder = new GuideComponentBuilder();

export default guideComponentBuilder;