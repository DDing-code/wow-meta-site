import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase';
import { WowIcon, classIcons, getWowIcon, gameIcons } from '../utils/wowIcons';
import WowTalentTreeRealistic from './WowTalentTreeRealistic';
import styles from './BeastMasteryGuide.module.css';

// 통합 테마
const integratedTheme = {
  colors: {
    primary: '#AAD372',      // 사냥꾼 클래스 색상
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#ffa500',       // 강조색
    border: 'rgba(255, 255, 255, 0.1)',
    hover: 'rgba(170, 211, 114, 0.1)',
    success: '#4caf50',
    danger: '#f44336',
    warning: '#ff9800',
    skillBg: 'rgba(255, 255, 255, 0.05)',
  }
};

// 스타일 컴포넌트
const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  display: flex;
`;

const Sidebar = styled.nav`
  position: fixed;
  left: 0;
  top: 60px;
  width: 260px;
  height: calc(100vh - 60px);
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  overflow-y: auto;
  padding: 1.5rem 0;
  z-index: 100;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.secondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }
`;

const NavSection = styled.div`
  padding: 0 1.5rem;
`;

const NavItem = styled.a`
  display: block;
  padding: 0.9rem 1rem;
  margin: 0.2rem 0;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  border-left: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  background: ${props => props.active ? props.theme.colors.hover : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: ${props => props.active ? '600' : '400'};

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.primary};
  }
`;

const MainContent = styled.main`
  margin-left: 260px;
  width: calc(100% - 260px);
  max-width: 1400px;
  padding: 2rem 3rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
  scroll-margin-top: 80px;
`;

const SectionHeader = styled.div`
  background: linear-gradient(135deg, rgba(170, 211, 114, 0.1), transparent);
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SubsectionTitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.accent};
  margin-bottom: 1rem;
  font-weight: 600;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

// 스킬 관련 스타일
const SkillSequence = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 53, 0.2);
  margin-bottom: 20px;
  overflow-x: auto;
`;

const Arrow = styled.span`
  color: ${props => props.theme.colors.accent};
  font-size: 1.2rem;
  font-weight: bold;
`;

const PriorityList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: ${props => props.theme.colors.skillBg};
    border-radius: 6px;
    margin-bottom: 10px;
    transition: all 0.2s ease;

    &:hover {
      background: ${props => props.theme.colors.hover};
      transform: translateX(5px);
    }
  }
`;

const PriorityNumber = styled.span`
  width: 28px;
  height: 28px;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
`;

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
  margin-bottom: 2rem;
`;

const SkillCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.skillBg};
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.hover};
    transform: translateY(-2px);
  }
`;

const SkillIconWrapper = styled.div`
  width: 44px;
  height: 44px;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(170, 211, 114, 0.1);
`;

const TierTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
`;

const TierTab = styled.button`
  flex: 1;
  padding: 12px 20px;
  background: ${props => props.active ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.active ? '#ff6b35' : 'transparent'};
  color: ${props => props.active ? '#ffa500' : '#94a3b8'};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 107, 53, 0.1);
    border-color: rgba(255, 107, 53, 0.3);
  }
`;

const TierBonuses = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
`;

const BonusItem = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const BonusLabel = styled.span`
  color: #ff6b35;
  font-weight: 700;
  min-width: 60px;
`;

const StatPriority = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.skillBg};
  border-radius: 6px;
  margin-bottom: 0.8rem;
`;

const Tooltip = styled.div`
  position: absolute;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  padding: 15px;
  max-width: 380px;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
`;

// 스킬 데이터
const skillData = {
  // 핵심 스킬
  barbedShot: {
    id: '217200',
    name: '날카로운 사격',
    englishName: 'Barbed Shot',
    icon: 'ability_hunter_barbedshot',
    description: '대상을 가시로 찔러 물리 피해를 입히고 8초 동안 출혈 피해를 입힙니다. 펫의 공격 속도를 30% 증가시키는 광분을 8초 부여합니다. 3번까지 중첩됩니다.',
    cooldown: '충전 12초',
    focusGain: '20',
    charges: '2'
  },
  killCommand: {
    id: '34026',
    name: '살상 명령',
    englishName: 'Kill Command',
    icon: 'ability_hunter_killcommand',
    description: '펫에게 대상을 즉시 공격하도록 명령하여 물리 피해를 입힙니다.',
    cooldown: '7.5초',
    focusCost: '30'
  },
  cobraShot: {
    id: '193455',
    name: '코브라 사격',
    englishName: 'Cobra Shot',
    icon: 'ability_hunter_cobrashot',
    description: '대상에게 코브라 사격을 날려 물리 피해를 입히고 살상 명령의 재사용 대기시간을 1초 감소시킵니다.',
    castTime: '1.75초',
    focusCost: '35'
  },
  bestialWrath: {
    id: '19574',
    name: '야수의 격노',
    englishName: 'Bestial Wrath',
    icon: 'ability_druid_ferociousbite',
    description: '펫에게 격노를 불어넣어 15초 동안 피해량을 25% 증가시킵니다.',
    cooldown: '1분 30초'
  },
  callOfTheWild: {
    id: '359844',
    name: '야생의 부름',
    englishName: 'Call of the Wild',
    icon: 'ability_hunter_callofthewild',
    description: '모든 펫과 야수 소환물의 피해량을 20초 동안 20% 증가시킵니다.',
    cooldown: '3분'
  },
  multiShot: {
    id: '2643',
    name: '일제 사격',
    englishName: 'Multi-Shot',
    icon: 'ability_upgrademoonglaive',
    description: '전방의 모든 적에게 물리 피해를 입히고, 펫에게 4초 동안 야수의 회전베기를 부여합니다.',
    focusCost: '40'
  },
  aspectOfTheWild: {
    id: '193530',
    name: '야생의 상',
    englishName: 'Aspect of the Wild',
    icon: 'spell_nature_protectionformnature',
    description: '20초 동안 당신과 펫의 치명타 확률이 20% 증가합니다.',
    cooldown: '2분'
  },
  bloodshed: {
    id: '321530',
    name: '유혈',
    englishName: 'Bloodshed',
    icon: 'ability_druid_primaltenacity',
    description: '야수에게 명령을 내려 대상을 찢어, 12초에 걸쳐 출혈 피해를 입히도록 합니다.',
    cooldown: '1분'
  },
  direBeast: {
    id: '120679',
    name: '광포한 야수',
    englishName: 'Dire Beast',
    icon: 'ability_hunter_longevity',
    description: '야생에서 광포한 야수를 소환하여 15초 동안 대상을 공격합니다.',
    cooldown: '20초',
    focusCost: '25'
  },
  explosiveShot: {
    id: '212431',
    name: '폭발 사격',
    englishName: 'Explosive Shot',
    icon: 'ability_hunter_explosiveshot',
    description: '대상에게 폭발 사격을 날려 화염 피해를 입히고 주변 적들에게도 피해를 입힙니다.',
    cooldown: '30초',
    focusCost: '20'
  },
  killShot: {
    id: '53351',
    name: '마무리 사격',
    englishName: 'Kill Shot',
    icon: 'ability_hunter_assassinate',
    description: '생명력이 20% 이하인 적에게 강력한 일격을 가합니다.',
    cooldown: '20초',
    focusCost: '10'
  },
  frenzy: {
    id: '272790',
    name: '광분',
    englishName: 'Frenzy',
    icon: 'ability_druid_mangle',
    description: '날카로운 사격이 펫의 공격 속도를 30% 증가시킵니다. 3번까지 중첩됩니다.',
    type: 'passive'
  },
  beastCleave: {
    id: '115939',
    name: '야수의 회전베기',
    englishName: 'Beast Cleave',
    icon: 'ability_hunter_sickem',
    description: '일제 사격 후 4초 동안 펫의 기본 공격이 주변의 모든 적에게 피해를 입힙니다.',
    type: 'passive'
  },
  // 무리의 지도자 특성
  howlOfThePack: {
    id: '378739',
    name: '무리 우두머리의 울부짖음',
    englishName: 'Howl of the Pack',
    icon: 'ability_hunter_callofthewild',
    description: '야수의 격노, 야생의 부름 사용 시 추가 펫을 소환하여 15초 동안 전투합니다.',
    type: 'passive'
  },
  aheadOfTheGame: {
    id: '378740',
    name: '앞서 나가기',
    englishName: 'Ahead of the Game',
    icon: 'ability_hunter_aspectofthefox',
    description: '무리 우두머리의 울부짖음이 활성화된 동안 날카로운 사격의 효율이 증가합니다.',
    type: 'passive'
  },
  // 어둠 순찰자 특성
  blackArrow: {
    id: '466932',
    name: '검은 화살',
    englishName: 'Black Arrow',
    icon: 'spell_shadow_painspike',
    description: '대상에게 암흑 화살을 발사하여 암흑 피해를 입히고 어둠 순찰자의 징표를 남깁니다.',
    cooldown: '15초',
    focusCost: '15'
  },
  bleakArrows: {
    id: '467749',
    name: '황폐의 화살',
    englishName: 'Bleak Arrows',
    icon: 'inv_quiver_1h_mawraid_d_01',
    description: '자동 사격이 암흑 피해를 입히며 방어도를 무시합니다.',
    type: 'passive'
  }
};

// 스킬 아이콘 컴포넌트
const SkillIcon = ({ skill, size = 'medium', showTooltip = true, className = '', textOnly = false }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const sizeMap = {
    small: '24px',
    medium: '36px',
    large: '48px'
  };

  const handleMouseEnter = (e) => {
    if (!showTooltip || textOnly) return;
    setShowInfo(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    const tooltipWidth = 380;
    const tooltipHeight = 250;

    let x, y;

    if (rect.right + tooltipWidth + 10 <= window.innerWidth) {
      x = rect.right + scrollX + 10;
    } else if (rect.left - tooltipWidth - 10 >= 0) {
      x = rect.left + scrollX - tooltipWidth - 10;
    } else {
      x = Math.max(10, Math.min(window.innerWidth - tooltipWidth - 10, rect.left + scrollX));
    }

    const elementCenter = rect.top + rect.height / 2 + scrollY;
    y = elementCenter - tooltipHeight / 2;

    if (y < scrollY + 10) {
      y = scrollY + 10;
    } else if (y + tooltipHeight > scrollY + window.innerHeight - 10) {
      y = scrollY + window.innerHeight - tooltipHeight - 10;
    }

    setTooltipPos({ x, y });
  };

  const handleMouseLeave = () => {
    setShowInfo(false);
  };

  if (textOnly) {
    return (
      <span
        className={className}
        style={{
          color: '#AAD372',
          fontWeight: 'bold',
          cursor: showTooltip ? 'pointer' : 'default'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {skill.name}
      </span>
    );
  }

  return (
    <>
      <div
        className={className}
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          display: 'inline-block',
          position: 'relative',
          cursor: showTooltip ? 'pointer' : 'default'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <WowIcon icon={skill.icon} size={parseInt(sizeMap[size])} />
      </div>

      {showInfo && showTooltip && ReactDOM.createPortal(
        <Tooltip
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <SkillIconWrapper>
                <WowIcon icon={skill.icon} size={40} />
              </SkillIconWrapper>
              <div>
                <h4 style={{ color: '#AAD372', margin: 0 }}>{skill.name}</h4>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{skill.englishName}</div>
              </div>
            </div>
            <div style={{ color: '#e2e8f0', lineHeight: '1.6', marginBottom: '10px', fontSize: '0.95rem' }}>
              {skill.description}
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: '#94a3b8' }}>
              {skill.cooldown && <div>재사용: <span style={{ color: '#ffa500' }}>{skill.cooldown}</span></div>}
              {skill.focusCost && <div>집중: <span style={{ color: '#ff6b6b' }}>{skill.focusCost}</span></div>}
              {skill.focusGain && <div>집중 획득: <span style={{ color: '#4ade80' }}>{skill.focusGain}</span></div>}
            </div>
          </div>
        </Tooltip>,
        document.body
      )}
    </>
  );
};

const BeastMasteryIntegratedGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedTier, setSelectedTier] = useState('packLeader');
  const sectionsRef = useRef({});

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const [key, element] of Object.entries(sectionsRef.current)) {
        if (element) {
          const { offsetTop, offsetHeight } = element;
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

  const scrollToSection = (sectionId) => {
    sectionsRef.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
  };

  // 영웅특성별 콘텐츠
  const heroContent = {
    packLeader: {
      name: '무리의 지도자',
      tierSet: {
        '2set': '날카로운 사격이 살상 명령의 재사용 대기시간을 추가로 0.5초 감소시킵니다.',
        '4set': '무리 우두머리의 울부짖음이 활성화된 동안 날카로운 사격 시전 시 지속시간이 1초 연장됩니다.'
      },
      singleTarget: {
        opener: [
          skillData.bestialWrath,
          skillData.barbedShot,
          skillData.aspectOfTheWild,
          skillData.barbedShot,
          skillData.bloodshed,
          skillData.killCommand,
          skillData.callOfTheWild,
          skillData.barbedShot,
          skillData.killCommand,
          skillData.cobraShot
        ],
        priority: [
          { skill: skillData.barbedShot, desc: '광분 3중첩 유지' },
          { skill: skillData.killCommand, desc: '쿨마다 사용' },
          { skill: skillData.bloodshed, desc: '재사용 대기시간마다' },
          { skill: skillData.bestialWrath, desc: '쿨마다 사용' },
          { skill: skillData.cobraShot, desc: '집중 소모용' }
        ]
      },
      aoe: {
        opener: [
          skillData.multiShot,
          skillData.barbedShot,
          skillData.aspectOfTheWild,
          skillData.bestialWrath,
          skillData.bloodshed,
          skillData.multiShot,
          skillData.callOfTheWild,
          skillData.killCommand,
          skillData.barbedShot,
          skillData.multiShot
        ],
        priority: [
          { skill: skillData.multiShot, desc: '야수의 회전베기 유지' },
          { skill: skillData.barbedShot, desc: '광분 유지' },
          { skill: skillData.killCommand, desc: '쿨마다 사용' },
          { skill: skillData.multiShot, desc: '집중 소모' }
        ]
      }
    },
    darkRanger: {
      name: '어둠 순찰자',
      tierSet: {
        '2set': '검은 화살이 어둠 순찰자의 징표를 남기며, 징표가 있는 대상에게 살상 명령과 날카로운 사격의 피해가 15% 증가합니다.',
        '4set': '황폐의 화살에 적중당한 대상이 검은 화살에 감염된 경우 어둠 순찰자를 소환하여 지원 사격을 가합니다.'
      },
      singleTarget: {
        opener: [
          skillData.blackArrow,
          skillData.barbedShot,
          skillData.aspectOfTheWild,
          skillData.bestialWrath,
          skillData.killCommand,
          skillData.barbedShot,
          skillData.callOfTheWild,
          skillData.bloodshed,
          skillData.killCommand,
          skillData.barbedShot
        ],
        priority: [
          { skill: skillData.blackArrow, desc: '재사용 대기시간마다' },
          { skill: skillData.barbedShot, desc: '광분 유지' },
          { skill: skillData.killCommand, desc: '사용' },
          { skill: skillData.cobraShot, desc: '필러' }
        ]
      },
      aoe: {
        opener: [
          skillData.multiShot,
          skillData.barbedShot,
          skillData.aspectOfTheWild,
          skillData.bestialWrath,
          skillData.bloodshed,
          skillData.multiShot,
          skillData.callOfTheWild,
          skillData.killCommand,
          skillData.barbedShot,
          skillData.explosiveShot,
          skillData.multiShot
        ],
        priority: [
          { skill: skillData.multiShot, desc: '야수의 회전베기' },
          { skill: skillData.blackArrow, desc: '모든 대상에게' },
          { skill: skillData.multiShot, desc: '집중 소비' }
        ]
      }
    }
  };

  const currentContent = heroContent[selectedTier];

  return (
    <ThemeProvider theme={integratedTheme}>
      <PageWrapper>
        <Sidebar>
          <NavSection>
            <NavItem
              active={activeSection === 'overview'}
              onClick={() => scrollToSection('overview')}
            >
              개요
            </NavItem>
            <NavItem
              active={activeSection === 'skills'}
              onClick={() => scrollToSection('skills')}
            >
              핵심스킬
            </NavItem>
            <NavItem
              active={activeSection === 'rotation'}
              onClick={() => scrollToSection('rotation')}
            >
              딜사이클
            </NavItem>
            <NavItem
              active={activeSection === 'talents'}
              onClick={() => scrollToSection('talents')}
            >
              특성
            </NavItem>
            <NavItem
              active={activeSection === 'stats'}
              onClick={() => scrollToSection('stats')}
            >
              스탯
            </NavItem>
          </NavSection>
        </Sidebar>

        <MainContent>
          {/* 개요 섹션 */}
          <Section ref={el => sectionsRef.current['overview'] = el} id="overview">
            <SectionHeader>
              <SectionTitle>야수 사냥꾼 개요</SectionTitle>
            </SectionHeader>

            <Card>
              <SubsectionTitle>야수 전문화 개요</SubsectionTitle>
              <p style={{ marginBottom: '20px', lineHeight: '1.6', fontSize: '1.05rem' }}>
                야수 사냥꾼은 펫과 함께 전투하는 원거리 딜러 전문화입니다.
                TWW 시즌3에서는 무리의 지도자와 어둠 순찰자 영웅특성이 모두 강력하며,
                특히 티어 세트 효과와의 시너지가 뛰어납니다.
              </p>

              <SubsectionTitle>딜링 메커니즘</SubsectionTitle>
              <p style={{ marginBottom: '20px', lineHeight: '1.6', fontSize: '1.05rem' }}>
                야수 사냥꾼은 <strong style={{ color: '#AAD372' }}>게임 내 유일하게 이동하면서 100% 피해를 입힐 수 있는 원거리 전문화</strong>입니다.
                대부분의 피해는 펫을 통해 이루어지며, 이는 단순한 자동 공격이 아닌 <strong style={{ color: '#AAD372' }}>처치 명령</strong>과
                <strong style={{ color: '#AAD372' }}>날카로운 사격</strong>을 통한 능동적인 제어로 극대화됩니다.
              </p>
              <p style={{ marginBottom: '20px', lineHeight: '1.6', fontSize: '1.05rem' }}>
                핵심 시너지는 <strong style={{ color: '#ffa500' }}>광기</strong> 중첩 유지를 통한 펫 공격 속도 증가와,
                <strong style={{ color: '#AAD372' }}>야수의 격노</strong> 및 <strong style={{ color: '#AAD372' }}>야생의 부름</strong> 같은
                강력한 쿨기 동안 펫 피해량을 폭발적으로 증가시키는 것입니다.
                특화 <strong style={{ color: '#AAD372' }}>야수의 왕</strong>은 모든 펫 피해를 15% 증가시켜 이러한 메커니즘을 더욱 강화합니다.
              </p>

              <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>핵심 스킬</h4>
              <SkillGrid>
                {[skillData.barbedShot, skillData.killCommand, skillData.cobraShot,
                  skillData.bestialWrath, skillData.callOfTheWild, skillData.multiShot].map((skill) => (
                  <SkillCard key={skill.id}>
                    <SkillIconWrapper>
                      <SkillIcon skill={skill} size="medium" />
                    </SkillIconWrapper>
                    <div>
                      <div style={{ fontWeight: 'bold', color: integratedTheme.colors.primary }}>
                        {skill.name}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                        {skill.cooldown || '즉시'}
                      </div>
                    </div>
                  </SkillCard>
                ))}
              </SkillGrid>

              <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>리소스 시스템</h4>
              <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
                <li>주 자원: 집중 (0-100)</li>
                <li>집중 생성: 날카로운 사격 (+20), 자동 공격</li>
                <li>집중 소비: 살상 명령 (-30), 코브라 사격 (-35)</li>
                <li>펫 집중: 야수의 격노 중 50% 감소</li>
              </ul>
            </Card>
          </Section>

          {/* 핵심 스킬 섹션 */}
          <Section ref={el => sectionsRef.current['skills'] = el} id="skills">
            <SectionHeader>
              <SectionTitle>핵심 스킬</SectionTitle>
            </SectionHeader>

            <Card>
              <SubsectionTitle>주요 공격 스킬</SubsectionTitle>
              <SkillGrid>
                {[skillData.barbedShot, skillData.killCommand, skillData.cobraShot, skillData.multiShot].map((skill) => (
                  <SkillCard key={skill.id}>
                    <SkillIconWrapper>
                      <SkillIcon skill={skill} size="medium" />
                    </SkillIconWrapper>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: integratedTheme.colors.primary, marginBottom: '4px' }}>
                        {skill.name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: integratedTheme.colors.subtext, lineHeight: '1.4' }}>
                        {skill.description}
                      </div>
                    </div>
                  </SkillCard>
                ))}
              </SkillGrid>

              <SubsectionTitle>쿨다운 스킬</SubsectionTitle>
              <SkillGrid>
                {[skillData.bestialWrath, skillData.callOfTheWild, skillData.aspectOfTheWild, skillData.bloodshed].map((skill) => (
                  <SkillCard key={skill.id}>
                    <SkillIconWrapper>
                      <SkillIcon skill={skill} size="medium" />
                    </SkillIconWrapper>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: integratedTheme.colors.primary, marginBottom: '4px' }}>
                        {skill.name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: integratedTheme.colors.subtext, lineHeight: '1.4' }}>
                        {skill.description}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: integratedTheme.colors.accent, marginTop: '4px' }}>
                        재사용: {skill.cooldown}
                      </div>
                    </div>
                  </SkillCard>
                ))}
              </SkillGrid>
            </Card>
          </Section>

          {/* 딜사이클 섹션 */}
          <Section ref={el => sectionsRef.current['rotation'] = el} id="rotation">
            <SectionHeader>
              <SectionTitle>영웅특성별 딜사이클</SectionTitle>
            </SectionHeader>

            {/* 영웅특성 선택 탭 */}
            <TierTabs>
              <TierTab
                active={selectedTier === 'packLeader'}
                onClick={() => setSelectedTier('packLeader')}
              >
                <span>🐺</span> 무리의 지도자
              </TierTab>
              <TierTab
                active={selectedTier === 'darkRanger'}
                onClick={() => setSelectedTier('darkRanger')}
              >
                <span>🏹</span> 어둠 순찰자
              </TierTab>
            </TierTabs>

            {/* 티어 세트 효과 */}
            <Card>
              <SubsectionTitle>티어 세트 효과</SubsectionTitle>
              <TierBonuses>
                <BonusItem>
                  <BonusLabel>2세트:</BonusLabel>
                  <div>{currentContent.tierSet['2set']}</div>
                </BonusItem>
                <BonusItem>
                  <BonusLabel>4세트:</BonusLabel>
                  <div>{currentContent.tierSet['4set']}</div>
                </BonusItem>
              </TierBonuses>
            </Card>

            {/* 단일 대상 */}
            <Card>
              <SubsectionTitle>단일 대상</SubsectionTitle>

              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>오프닝 시퀀스</h4>
              <SkillSequence>
                {currentContent.singleTarget.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <Arrow>→</Arrow>}
                  </React.Fragment>
                ))}
              </SkillSequence>

              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>스킬 우선순위</h4>
              <PriorityList>
                {currentContent.singleTarget.priority.map((item, index) => (
                  <li key={index}>
                    <PriorityNumber>{index + 1}</PriorityNumber>
                    <SkillIcon skill={item.skill} size="small" />
                    <div style={{ flex: 1 }}>
                      <SkillIcon skill={item.skill} textOnly={true} /> - {item.desc}
                    </div>
                  </li>
                ))}
              </PriorityList>
            </Card>

            {/* 광역 대상 */}
            <Card>
              <SubsectionTitle>광역 대상 (3+ 타겟)</SubsectionTitle>

              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>오프닝 시퀀스</h4>
              <SkillSequence>
                {currentContent.aoe.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <Arrow>→</Arrow>}
                  </React.Fragment>
                ))}
              </SkillSequence>

              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>스킬 우선순위</h4>
              <PriorityList>
                {currentContent.aoe.priority.map((item, index) => (
                  <li key={index}>
                    <PriorityNumber>{index + 1}</PriorityNumber>
                    <SkillIcon skill={item.skill} size="small" />
                    <div style={{ flex: 1 }}>
                      <SkillIcon skill={item.skill} textOnly={true} /> - {item.desc}
                    </div>
                  </li>
                ))}
              </PriorityList>
            </Card>

            {/* 심화 분석 */}
            <Card>
              <SubsectionTitle>심화 분석</SubsectionTitle>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>
                  <SkillIcon skill={skillData.bestialWrath} size="small" className="inline-icon" />
                  <SkillIcon skill={skillData.bestialWrath} textOnly={true} /> 최적화
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>버스트 윈도우에서 최대한 많은 <SkillIcon skill={skillData.killCommand} textOnly={true} /> 시전</li>
                  <li>사용 효과 장신구와 물약을 함께 사용하여 딜 극대화</li>
                  <li>펫의 집중 소모량 50% 감소 효과 활용</li>
                </ul>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>
                  <SkillIcon skill={skillData.frenzy} size="small" className="inline-icon" />
                  <SkillIcon skill={skillData.frenzy} textOnly={true} /> 관리
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>3중첩 유지가 최우선 - 떨어지기 1.5초 전에 갱신</li>
                  <li><SkillIcon skill={skillData.barbedShot} textOnly={true} />의 충전을 2개 이상 보유하지 않도록 주의</li>
                  <li>광분 지속시간이 8초이므로 타이밍 계산 필수</li>
                </ul>
              </div>

              {selectedTier === 'packLeader' ? (
                <div>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>무리의 지도자 특화 전략</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li><SkillIcon skill={skillData.howlOfThePack} textOnly={true} /> 활성화 시 <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 우선도 상승</li>
                    <li><SkillIcon skill={skillData.aheadOfTheGame} textOnly={true} /> 버프 중 최대한 많은 <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 시전</li>
                    <li><SkillIcon skill={skillData.direBeast} textOnly={true} />로 추가 DPS 확보</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>어둠 순찰자 특화 전략</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li><SkillIcon skill={skillData.blackArrow} textOnly={true} /> 디버프 100% 유지</li>
                    <li><SkillIcon skill={skillData.bleakArrows} textOnly={true} /> 효과로 자동 사격 암흑 피해 극대화</li>
                    <li>티어 4세트 효과로 <SkillIcon skill={skillData.barbedShot} textOnly={true} /> 쿨다운 감소 활용</li>
                  </ul>
                </div>
              )}
            </Card>
          </Section>

          {/* 특성 섹션 */}
          <Section ref={el => sectionsRef.current['talents'] = el} id="talents">
            <SectionHeader>
              <SectionTitle>특성 빌드</SectionTitle>
            </SectionHeader>

            <Card>
              <SubsectionTitle>특성 트리</SubsectionTitle>
              <WowTalentTreeRealistic />
            </Card>

            <Card>
              <SubsectionTitle>빌드 가이드</SubsectionTitle>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: integratedTheme.colors.accent, marginBottom: '0.5rem' }}>레이드 빌드</h4>
                <p style={{ marginBottom: '1rem' }}>단일 대상 딜링 최적화</p>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>살상 명령 강화 특성 우선</li>
                  <li>야수의 격노 지속시간 증가</li>
                  <li>광분 관련 특성 선택</li>
                  <li>유혈 필수</li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: integratedTheme.colors.accent, marginBottom: '0.5rem' }}>쐐기돌 빌드</h4>
                <p style={{ marginBottom: '1rem' }}>광역 딜링과 생존력 균형</p>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>야수 회전베기 강화</li>
                  <li>일제 사격 피해량 증가</li>
                  <li>결속 사격 (차단기)</li>
                  <li>생존 특성 추가</li>
                </ul>
              </div>
            </Card>
          </Section>

          {/* 스탯 섹션 */}
          <Section ref={el => sectionsRef.current['stats'] = el} id="stats">
            <SectionHeader>
              <SectionTitle>스탯 우선순위</SectionTitle>
            </SectionHeader>

            <Card>
              <SubsectionTitle>레이드 (단일 대상)</SubsectionTitle>
              <StatPriority>
                <PriorityNumber>1</PriorityNumber>
                <div>민첩성 &gt; 치명타 &gt; 가속 &gt; 특화 &gt; 유연성</div>
              </StatPriority>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: integratedTheme.colors.subtext }}>
                SimC 스트링: ( Pawn: v1: "BM_Raid": Agility=1.0, CritRating=1.35, HasteRating=1.25, MasteryRating=1.15, Versatility=1.10 )
              </p>
            </Card>

            <Card>
              <SubsectionTitle>신화+ (광역)</SubsectionTitle>
              <StatPriority>
                <PriorityNumber>1</PriorityNumber>
                <div>민첩성 &gt; 가속 &gt; 치명타 &gt; 특화 &gt; 유연성</div>
              </StatPriority>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: integratedTheme.colors.subtext }}>
                SimC 스트링: ( Pawn: v1: "BM_M+": Agility=1.0, HasteRating=1.40, CritRating=1.20, MasteryRating=1.10, Versatility=1.05 )
              </p>
            </Card>

            <Card>
              <SubsectionTitle>스탯 브레이크포인트</SubsectionTitle>
              <ul style={{ lineHeight: '2' }}>
                <li><strong style={{ color: integratedTheme.colors.accent }}>가속 30%</strong> - 소프트캡, GCD 및 집중 재생 효율 최적화</li>
                <li><strong style={{ color: integratedTheme.colors.accent }}>치명타 35%</strong> - 광분 유지 안정성 확보</li>
                <li><strong style={{ color: integratedTheme.colors.accent }}>특화 15%+</strong> - 펫 피해량 기본 보장</li>
              </ul>
            </Card>

            <Card>
              <SubsectionTitle>가이드 & 팁</SubsectionTitle>
              <ul style={{ lineHeight: '1.8' }}>
                <li>광분 3중첩 유지가 최우선 과제입니다</li>
                <li>날카로운 사격은 충전이 2개 이상 되지 않도록 관리하세요</li>
                <li>야수의 격노와 야생의 상은 버스트 타이밍에 함께 사용하세요</li>
                <li>펫의 위치를 잘 관리하여 대상 변경 시 딜로스를 최소화하세요</li>
                <li>티어 세트 효과를 최대한 활용하기 위해 영웅특성에 따른 스킬 우선도를 숙지하세요</li>
              </ul>
            </Card>
          </Section>
        </MainContent>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default BeastMasteryIntegratedGuide;