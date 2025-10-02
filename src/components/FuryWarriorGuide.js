import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase';
import { furyWarriorSkills as skillData } from '../data/furyWarriorSkillData';
import styles from './DevastationEvokerGuide.module.css';
import moduleEventBus from '../services/ModuleEventBus';
import aiFeedbackService from '../services/AIFeedbackService';
import externalGuideCollector from '../services/ExternalGuideCollector';
import realtimeGuideUpdater from '../services/RealtimeGuideUpdater';
import learningAIPatternAnalyzer from '../services/LearningAIPatternAnalyzer';
import { classIcons, WowIcon, getWowIcon, gameIcons } from '../utils/wowIcons';
import wowheadDescriptions from '../data/wowhead-descriptions.json';

// 분노 전사 테마 (클래스 색상: #C69B6D - 전사 갈색톤)
const unifiedTheme = {
  colors: {
    primary: '#C69B6D',      // 전사 클래스 색상
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#C69B6D',
    border: '#2a2a3e',
    hover: 'rgba(198, 155, 109, 0.1)',
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

// 업데이트 알림 토스트
const UpdateToast = styled(motion.div)`
  position: fixed;
  top: 100px;
  right: 20px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.accent} 100%);
  color: ${props => props.theme.colors.background};
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 10000;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
`;

const GlowingIcon = styled.span`
  font-size: 1.5rem;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }
`;

// Sidebar - 네비게이션
const Sidebar = styled.nav`
  position: sticky;
  top: 80px;
  width: 220px;
  height: fit-content;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 1.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }

  @media (max-width: 1200px) {
    display: none;
  }
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;
`;

const NavTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.subtext};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
  padding-left: 0.5rem;
`;

const NavItem = styled.a`
  display: block;
  padding: 0.5rem 0.75rem;
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
  font-size: 0.875rem;
  font-weight: ${props => props.isActive ? '600' : '500'};
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  background: ${props => props.isActive ? props.theme.colors.hover : 'transparent'};
  border-left: 3px solid ${props => props.isActive ? props.theme.colors.primary : 'transparent'};

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.primary};
    transform: translateX(2px);
  }
`;

const SubNavItem = styled(NavItem)`
  padding-left: 1.5rem;
  font-size: 0.8rem;
  border-left: none;

  &::before {
    content: "›";
    margin-right: 0.5rem;
    color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.subtext};
  }
`;

// Main Container
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 1;
  min-width: 0;
`;

// Header
const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(198, 155, 109, 0.1) 0%, rgba(198, 155, 109, 0.05) 100%);
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.accent} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(198, 155, 109, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: 1rem;
`;

const PatchBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 0.5rem;
`;

const DifficultyBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  background: ${props => props.difficulty === '초급' ? '#4caf50' :
                        props.difficulty === '중급' ? '#ff9800' : '#f44336'};
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 0.5rem;
`;

const UpdateInfo = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
  margin-top: 1rem;
  font-style: italic;
`;

// Section Components
const Section = styled.section`
  margin-bottom: 3rem;
  scroll-margin-top: 80px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: "";
    width: 4px;
    height: 2rem;
    background: linear-gradient(180deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.accent} 100%);
    border-radius: 2px;
  }
`;

// Card Component
const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 8px 32px rgba(198, 155, 109, 0.1);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

// Toast Component for Copy Notification
const Toast = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.accent} 100%);
  color: ${props => props.theme.colors.background};
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  z-index: 10000;
  animation: slideInRight 0.3s ease-out;

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// Global styles for animations
const GlobalStyle = createGlobalStyle`
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// 영웅특성별 콘텐츠 생성 함수
const getHeroContent = (SkillIcon) => ({
  slayer: {
    name: '학살자',
    icon: '⚔️',
    tierSet: {
      '2set': '2세트: 무모한 희생 사용 시 격노 상태를 3초 연장합니다.',
      '4set': '4세트: 격노 상태에서 광란 사용 시 공격력이 추가로 8% 증가합니다.'
    },
    singleTarget: {
      opener: [
        skillData.recklessness,
        skillData.avatar,
        skillData.championsSpear,
        skillData.rampage,
        skillData.ragingBlow,
        skillData.bloodthirst,
        skillData.execute
      ],
      priority: [
        { skill: skillData.execute, desc: '적 생명력 20% 이하 시 최우선으로 사용' },
        { skill: skillData.rampage, desc: '분노 80 이상일 때 사용하여 격노 유지' },
        { skill: skillData.recklessness, desc: '재사용 대기시간마다 사용' },
        { skill: skillData.avatar, desc: '재사용 대기시간마다 사용' },
        { skill: skillData.championsSpear, desc: '쿨다운마다 사용하여 추가 분노 획득' },
        { skill: skillData.ragingBlow, desc: '분노가 충분할 때 사용' },
        { skill: skillData.bloodthirst, desc: '쿨다운마다 사용하여 분노 생성 및 생명력 회복' }
      ]
    },
    aoe: {
      opener: [
        skillData.recklessness,
        skillData.avatar,
        skillData.thunderousRoar,
        skillData.whirlwind,
        skillData.rampage
      ],
      priority: [
        { skill: skillData.execute, desc: '여러 적이 20% 이하 시 우선 사용' },
        { skill: skillData.rampage, desc: '분노 80 이상일 때 사용' },
        { skill: skillData.thunderousRoar, desc: '광역 딜 및 출혈 DoT 적용' },
        { skill: skillData.whirlwind, desc: '다음 2번 공격 광역화' },
        { skill: skillData.bloodthirst, desc: '분노 생성 및 생명력 회복' },
        { skill: skillData.ragingBlow, desc: '소용돌이 버프 소모' }
      ]
    }
  },
  mountainThane: {
    name: '산왕',
    icon: '⚡',
    tierSet: {
      '2set': '2세트: 천둥의 포효 사용 시 우레 작렬의 재사용 대기시간이 6초 감소합니다.',
      '4set': '4세트: 우레 작렬이 적중한 대상 하나당 공격력이 2% 증가하며, 최대 10%까지 중첩됩니다.'
    },
    singleTarget: {
      opener: [
        skillData.recklessness,
        skillData.avatar,
        skillData.thunderBlast,
        skillData.championsSpear,
        skillData.rampage,
        skillData.ragingBlow,
        skillData.bloodthirst
      ],
      priority: [
        { skill: skillData.execute, desc: '적 생명력 20% 이하 시 최우선' },
        { skill: skillData.rampage, desc: '분노 80 이상일 때 사용' },
        { skill: skillData.thunderBlast, desc: '우레 작렬을 쿨다운마다 사용하여 번개 피해' },
        { skill: skillData.recklessness, desc: '재사용 대기시간마다 사용' },
        { skill: skillData.avatar, desc: '재사용 대기시간마다 사용' },
        { skill: skillData.championsSpear, desc: '추가 분노 획득 및 속박' },
        { skill: skillData.ragingBlow, desc: '분노 생성용' },
        { skill: skillData.bloodthirst, desc: '쿨다운마다 사용' }
      ]
    },
    aoe: {
      opener: [
        skillData.recklessness,
        skillData.avatar,
        skillData.thunderBlast,
        skillData.thunderousRoar,
        skillData.whirlwind,
        skillData.rampage
      ],
      priority: [
        { skill: skillData.execute, desc: '여러 적이 20% 이하 시 우선' },
        { skill: skillData.thunderBlast, desc: '광역 번개 피해 및 감속' },
        { skill: skillData.rampage, desc: '분노 80 이상일 때 사용' },
        { skill: skillData.thunderousRoar, desc: '광역 딜 및 출혈 DoT' },
        { skill: skillData.whirlwind, desc: '다음 2번 공격 광역화' },
        { skill: skillData.bloodthirst, desc: '분노 생성 및 생명력 회복' },
        { skill: skillData.ragingBlow, desc: '소용돌이 버프 소모' }
      ]
    }
  }
});

// 특성 빌드 데이터
const talentBuilds = {
  slayer: {
    raid: {
      name: '학살자 레이드 (단일)',
      code: 'BYQAAAAAAAAAAAAAAAAAAAAAAAAQSCJpEJJJBAAAAAAgkkkQiEJJJhkSSSaA',
      description: '단일 대상 최적화 빌드. 학살자 특성으로 폭발적인 버스트 딜링.'
    },
    mythicPlus: {
      name: '학살자 쐐기돌 (광역)',
      code: 'BYQAAAAAAAAAAAAAAAAAAAAAAAAQSCJpEJJJBAAAAAAgkkkQiEJJRhkSSSaA',
      description: '광역 딜 최적화. 학살자 특성으로 다수 적 처리에 효과적.'
    }
  },
  mountainThane: {
    raid: {
      name: '산왕 레이드 (단일)',
      code: 'BYQAAAAAAAAAAAAAAAAAAAAAAAAQSCJpEJJJBAAAAAAgkkkQiEJJJhkSSSkA',
      description: '단일 대상 최적화. 산왕 특성으로 번개 피해 강화.'
    },
    mythicPlus: {
      name: '산왕 쐐기돌 (광역)',
      code: 'BYQAAAAAAAAAAAAAAAAAAAAAAAAQSCJpEJJJBAAAAAAgkkkQiEJJRhkSSSkA',
      description: '광역 딜 최적화. 산왕 특성으로 우레 작렬 활용.'
    }
  }
};

// 스탯 브레이크포인트 데이터
const breakpointData = {
  slayer: {
    stats: [
      {
        stat: '가속',
        priority: 1,
        note: '최우선 스탯. 공격 속도 증가 및 분노 생성 가속화로 딜 사이클 개선.'
      },
      {
        stat: '치명타',
        priority: 2,
        note: '두 번째 우선순위. 무모한 희생과 시너지로 폭발적인 버스트 딜링.'
      },
      {
        stat: '유연',
        priority: 3,
        note: '세 번째 우선순위. 안정적인 딜 증가.'
      },
      {
        stat: '특화',
        priority: 4,
        note: '마지막 우선순위. 광폭화 상태 딜 증가.'
      }
    ],
    summary: [
      '학살자 특성은 가속을 최우선으로 하여 빠른 공격 속도 확보',
      '치명타를 통해 무모한 희생 구간에서 폭발적인 딜 증가',
      'SimC 시뮬레이션 결과: 가속 > 치명타 > 유연 > 특화'
    ]
  },
  mountainThane: {
    stats: [
      {
        stat: '가속',
        priority: 1,
        note: '최우선 스탯. 우레 작렬 재사용 대기시간 감소 및 분노 생성.'
      },
      {
        stat: '특화',
        priority: 2,
        note: '두 번째 우선순위. 광폭화 피해 증가로 번개 피해 강화.'
      },
      {
        stat: '치명타',
        priority: 3,
        note: '세 번째 우선순위. 안정적인 치명타 확률.'
      },
      {
        stat: '유연',
        priority: 4,
        note: '마지막 우선순위. 기본 딜 증가.'
      }
    ],
    summary: [
      '산왕 특성은 가속과 특화를 균형있게 확보',
      '우레 작렬을 자주 사용하기 위한 가속 확보',
      'SimC 시뮬레이션 결과: 가속 > 특화 > 치명타 > 유연'
    ]
  }
};

function FuryWarriorGuide() {
  const [showToast, setShowToast] = useState(false);
  const [selectedTier, setSelectedTier] = useState('slayer');
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  // Refs
  const sectionRefs = {
    overview: useRef(null),
    rotation: useRef(null),
    builds: useRef(null),
    stats: useRef(null)
  };

  const subSectionRefs = {
    'overview-intro': useRef(null),
    'overview-resource': useRef(null),
    'rotation-opener': useRef(null),
    'rotation-priority': useRef(null),
    'builds-raid': useRef(null),
    'builds-dungeon': useRef(null),
    'stats-priority': useRef(null),
    'stats-simc': useRef(null)
  };

  // 업데이트 알림 처리
  useEffect(() => {
    const handleGuideUpdate = (event) => {
      console.log('🔔 가이드 업데이트 알림 수신:', event.detail);
      setPendingUpdate(event.detail);
      setShowUpdateToast(true);

      // 10초 후 자동으로 토스트 제거
      setTimeout(() => {
        setShowUpdateToast(false);
      }, 10000);
    };

    moduleEventBus.on('guide:update:available', handleGuideUpdate);

    return () => {
      moduleEventBus.off('guide:update:available', handleGuideUpdate);
    };
  }, []);

  const handleAcceptUpdate = () => {
    if (pendingUpdate) {
      console.log('✅ 사용자가 업데이트 수락:', pendingUpdate);
      // 실제 업데이트 적용 로직
      // 예: 새로운 가이드 데이터로 상태 업데이트
      setShowUpdateToast(false);
      setPendingUpdate(null);

      // 성공 토스트 표시
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // 스크롤 감지 및 active section 업데이트
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      // 메인 섹션 확인
      let currentSection = '';
      Object.keys(sectionRefs).forEach(key => {
        const element = sectionRefs[key]?.current;
        if (element) {
          const { offsetTop } = element;
          if (scrollPosition >= offsetTop) {
            currentSection = key;
          }
        }
      });
      setActiveSection(currentSection);

      // 서브섹션 확인
      let currentSubSection = '';
      Object.keys(subSectionRefs).forEach(key => {
        const element = subSectionRefs[key]?.current;
        if (element) {
          const { offsetTop } = element;
          if (scrollPosition >= offsetTop - 10) {
            currentSubSection = key;
          }
        }
      });
      setActiveSubSection(currentSubSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 실행

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSubSection = (subSectionId) => {
    subSectionRefs[subSectionId]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const heroContent = getHeroContent(SkillIcon);
  const currentContent = heroContent[selectedTier];

  const renderOverview = () => (
    <Section ref={sectionRefs.overview} id="overview">
      <SectionHeader>
        <SectionTitle>개요</SectionTitle>
      </SectionHeader>
      <Card>
        <div className={styles.subsection} ref={subSectionRefs['overview-intro']}>
          <h3 className={styles.subsectionTitle}>분노 전사 개요</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            분노 전사는 <strong style={{ color: '#C69B6D' }}>양손 무기를 휘둘러 폭발적인 피해를 입히는</strong> 근접 DPS 전문화입니다.
            TWW 시즌3에서는 <span style={{ color: '#FF6B6B', fontWeight: 'bold' }}>학살자</span>와
            <span style={{ color: '#4ECDC4', fontWeight: 'bold' }}>산왕</span> 영웅특성이 모두 강력하며,
            단일 대상에서는 학살자가, 광역 딜에서는 산왕이 우수한 성능을 보입니다.
          </p>

          <h3 className={styles.subsectionTitle} style={{ marginTop: '30px' }}>딜링 메커니즘</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            분노 전사는 <strong style={{ color: '#C69B6D' }}>분노 자원을 생성하고 소모하는</strong> 메커니즘을 가지고 있습니다.
            <SkillIcon skill={skillData.bloodthirst} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.bloodthirst} textOnly={true} />와 {' '}
            <SkillIcon skill={skillData.ragingBlow} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.ragingBlow} textOnly={true} />로 분노를 생성하고,
            <SkillIcon skill={skillData.rampage} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.rampage} textOnly={true} />로 격노 버프를 유지하며 폭발적인 딜을 냅니다.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            <SkillIcon skill={skillData.recklessness} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.recklessness} textOnly={true} />와 {' '}
            <SkillIcon skill={skillData.avatar} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.avatar} textOnly={true} />를 조합하여 강력한 버스트 딜 구간을 만들며,
            적 생명력 20% 이하 구간에서는
            <SkillIcon skill={skillData.execute} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.execute} textOnly={true} />로 마무리합니다.
          </p>
        </div>

        <div className={styles.subsection} ref={subSectionRefs['overview-resource']} style={{ marginTop: '40px' }}>
          <h3 className={styles.subsectionTitle}>리소스 시스템</h3>
          <div className={styles.resourceSystem}>
            <div className={styles.resourceItem}>
              <div className={styles.resourceHeader}>
                <span className={styles.resourceIcon} style={{ fontSize: '2rem' }}>⚡</span>
                <div>
                  <h4 style={{ color: '#C69B6D', marginBottom: '0.5rem' }}>분노 (Rage)</h4>
                  <p style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>최대 100 / 생성-소모 구조</p>
                </div>
              </div>
              <div className={styles.resourceDetails}>
                <div className={styles.resourceSection}>
                  <h5 style={{ color: '#4caf50', marginBottom: '10px' }}>분노 생성</h5>
                  <ul style={{ fontSize: '0.95rem', lineHeight: '1.8' }}>
                    <li>
                      <SkillIcon skill={skillData.bloodthirst} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.bloodthirst} textOnly={true} /> - 8 분노 생성
                    </li>
                    <li>
                      <SkillIcon skill={skillData.ragingBlow} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> - 12 분노 생성
                    </li>
                    <li>
                      <SkillIcon skill={skillData.charge} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.charge} textOnly={true} /> - 20 분노 생성
                    </li>
                  </ul>
                </div>
                <div className={styles.resourceSection} style={{ marginTop: '20px' }}>
                  <h5 style={{ color: '#f44336', marginBottom: '10px' }}>분노 소모</h5>
                  <ul style={{ fontSize: '0.95rem', lineHeight: '1.8' }}>
                    <li>
                      <SkillIcon skill={skillData.rampage} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.rampage} textOnly={true} /> - 80 분노 소모 (격노 버프 획득)
                    </li>
                    <li>
                      <SkillIcon skill={skillData.execute} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.execute} textOnly={true} /> - 20-40 분노 소모 (20% 이하 적)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );

  const renderRotation = () => (
    <Section ref={sectionRefs.rotation} id="rotation">
      <SectionHeader>
        <SectionTitle>딜사이클</SectionTitle>
      </SectionHeader>

      {/* 영웅 특성 선택 탭 */}
      <div className={styles.tierSelector}>
        <button
          className={`${styles.tierButton} ${selectedTier === 'slayer' ? styles.active : ''}`}
          onClick={() => setSelectedTier('slayer')}
          style={{
            background: selectedTier === 'slayer' ? 'linear-gradient(135deg, #C69B6D 0%, #A67C52 100%)' : 'transparent',
            border: selectedTier === 'slayer' ? 'none' : '2px solid #2a2a3e'
          }}
        >
          <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>⚔️</span>
          학살자
        </button>
        <button
          className={`${styles.tierButton} ${selectedTier === 'mountainThane' ? styles.active : ''}`}
          onClick={() => setSelectedTier('mountainThane')}
          style={{
            background: selectedTier === 'mountainThane' ? 'linear-gradient(135deg, #4ECDC4 0%, #3BA39A 100%)' : 'transparent',
            border: selectedTier === 'mountainThane' ? 'none' : '2px solid #2a2a3e'
          }}
        >
          <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>⚡</span>
          산왕
        </button>
      </div>

      {/* 티어 세트 효과 */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(198, 155, 109, 0.05) 0%, rgba(198, 155, 109, 0.02) 100%)' }}>
        <h3 className={styles.subsectionTitle} style={{ marginBottom: '15px' }}>
          <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>{currentContent.icon}</span>
          {currentContent.name} 티어 세트 효과
        </h3>
        <div className={styles.tierSetEffects}>
          <div className={styles.tierEffect}>
            <span className={styles.tierBadge} style={{ background: '#4caf50' }}>2세트</span>
            <span>{currentContent.tierSet['2set']}</span>
          </div>
          <div className={styles.tierEffect}>
            <span className={styles.tierBadge} style={{ background: '#2196f3' }}>4세트</span>
            <span>{currentContent.tierSet['4set']}</span>
          </div>
        </div>
      </Card>

      {/* 단일 대상 로테이션 */}
      <Card ref={subSectionRefs['rotation-opener']}>
        <h3 className={styles.subsectionTitle}>단일 대상 오프닝</h3>
        <div className={styles.skillSequence}>
          {currentContent.singleTarget.opener.map((skill, index) => (
            <React.Fragment key={index}>
              <SkillIcon skill={skill} showTooltip={true} />
              {index < currentContent.singleTarget.opener.length - 1 && (
                <span className={styles.arrow}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <Card ref={subSectionRefs['rotation-priority']}>
        <h3 className={styles.subsectionTitle}>단일 대상 우선순위</h3>
        <div className={styles.priorityList}>
          {currentContent.singleTarget.priority.map((item, index) => (
            <div key={index} className={styles.priorityItem}>
              <div className={styles.priorityNumber}>{index + 1}</div>
              <SkillIcon skill={item.skill} showTooltip={true} />
              <div className={styles.priorityDesc}>
                <strong><SkillIcon skill={item.skill} textOnly={true} /></strong>: {item.desc}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 광역 로테이션 */}
      <Card>
        <h3 className={styles.subsectionTitle}>광역 (3+ 대상) 오프닝</h3>
        <div className={styles.skillSequence}>
          {currentContent.aoe.opener.map((skill, index) => (
            <React.Fragment key={index}>
              <SkillIcon skill={skill} showTooltip={true} />
              {index < currentContent.aoe.opener.length - 1 && (
                <span className={styles.arrow}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className={styles.subsectionTitle}>광역 우선순위</h3>
        <div className={styles.priorityList}>
          {currentContent.aoe.priority.map((item, index) => (
            <div key={index} className={styles.priorityItem}>
              <div className={styles.priorityNumber}>{index + 1}</div>
              <SkillIcon skill={item.skill} showTooltip={true} />
              <div className={styles.priorityDesc}>
                <strong><SkillIcon skill={item.skill} textOnly={true} /></strong>: {item.desc}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );

  const renderBuilds = () => (
    <Section ref={sectionRefs.builds} id="builds">
      <SectionHeader>
        <SectionTitle>특성 빌드</SectionTitle>
      </SectionHeader>

      {/* 학살자 빌드 */}
      <Card ref={subSectionRefs['builds-raid']} style={{ background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(255, 107, 107, 0.02) 100%)' }}>
        <div className={styles.buildHeader}>
          <h3 className={styles.subsectionTitle}>
            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>⚔️</span>
            학살자 특성 빌드
          </h3>
        </div>

        <div className={styles.buildVariant}>
          <div className={styles.buildInfo}>
            <h4 style={{ color: '#C69B6D', marginBottom: '10px' }}>{talentBuilds.slayer.raid.name}</h4>
            <p style={{ color: '#a0a0a0', fontSize: '0.95rem', marginBottom: '15px' }}>
              {talentBuilds.slayer.raid.description}
            </p>
            <div className={styles.talentCode}>
              <code>{talentBuilds.slayer.raid.code}</code>
              <button
                className={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(talentBuilds.slayer.raid.code);
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }}
              >
                복사
              </button>
            </div>
          </div>
        </div>

        <div className={styles.buildVariant} style={{ marginTop: '20px' }}>
          <div className={styles.buildInfo}>
            <h4 style={{ color: '#C69B6D', marginBottom: '10px' }}>{talentBuilds.slayer.mythicPlus.name}</h4>
            <p style={{ color: '#a0a0a0', fontSize: '0.95rem', marginBottom: '15px' }}>
              {talentBuilds.slayer.mythicPlus.description}
            </p>
            <div className={styles.talentCode}>
              <code>{talentBuilds.slayer.mythicPlus.code}</code>
              <button
                className={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(talentBuilds.slayer.mythicPlus.code);
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }}
              >
                복사
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 산왕 빌드 */}
      <Card ref={subSectionRefs['builds-dungeon']} style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.05) 0%, rgba(78, 205, 196, 0.02) 100%)' }}>
        <div className={styles.buildHeader}>
          <h3 className={styles.subsectionTitle}>
            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>⚡</span>
            산왕 특성 빌드
          </h3>
        </div>

        <div className={styles.buildVariant}>
          <div className={styles.buildInfo}>
            <h4 style={{ color: '#4ECDC4', marginBottom: '10px' }}>{talentBuilds.mountainThane.raid.name}</h4>
            <p style={{ color: '#a0a0a0', fontSize: '0.95rem', marginBottom: '15px' }}>
              {talentBuilds.mountainThane.raid.description}
            </p>
            <div className={styles.talentCode}>
              <code>{talentBuilds.mountainThane.raid.code}</code>
              <button
                className={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(talentBuilds.mountainThane.raid.code);
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }}
              >
                복사
              </button>
            </div>
          </div>
        </div>

        <div className={styles.buildVariant} style={{ marginTop: '20px' }}>
          <div className={styles.buildInfo}>
            <h4 style={{ color: '#4ECDC4', marginBottom: '10px' }}>{talentBuilds.mountainThane.mythicPlus.name}</h4>
            <p style={{ color: '#a0a0a0', fontSize: '0.95rem', marginBottom: '15px' }}>
              {talentBuilds.mountainThane.mythicPlus.description}
            </p>
            <div className={styles.talentCode}>
              <code>{talentBuilds.mountainThane.mythicPlus.code}</code>
              <button
                className={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(talentBuilds.mountainThane.mythicPlus.code);
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }}
              >
                복사
              </button>
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );

  const renderStats = () => (
    <Section ref={sectionRefs.stats} id="stats">
      <SectionHeader>
        <SectionTitle>스탯 우선순위</SectionTitle>
      </SectionHeader>

      {/* 학살자 스탯 */}
      <Card ref={subSectionRefs['stats-priority']} style={{ background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(255, 107, 107, 0.02) 100%)' }}>
        <h3 className={styles.subsectionTitle}>
          <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>⚔️</span>
          학살자 스탯 우선순위
        </h3>
        <div className={styles.statPriority}>
          {breakpointData.slayer.stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.statRank}>{stat.priority}</div>
              <div className={styles.statInfo}>
                <h4 style={{ color: '#C69B6D', marginBottom: '8px' }}>{stat.stat}</h4>
                <p style={{ fontSize: '0.9rem', color: '#a0a0a0', lineHeight: '1.6' }}>
                  {stat.note}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.statSummary} style={{ marginTop: '30px', padding: '20px', background: 'rgba(198, 155, 109, 0.1)', borderRadius: '8px' }}>
          <h4 style={{ color: '#C69B6D', marginBottom: '15px' }}>요약</h4>
          <ul style={{ fontSize: '0.95rem', lineHeight: '2', color: '#e0e0e0' }}>
            {breakpointData.slayer.summary.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </Card>

      {/* 산왕 스탯 */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.05) 0%, rgba(78, 205, 196, 0.02) 100%)' }}>
        <h3 className={styles.subsectionTitle}>
          <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>⚡</span>
          산왕 스탯 우선순위
        </h3>
        <div className={styles.statPriority}>
          {breakpointData.mountainThane.stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.statRank}>{stat.priority}</div>
              <div className={styles.statInfo}>
                <h4 style={{ color: '#4ECDC4', marginBottom: '8px' }}>{stat.stat}</h4>
                <p style={{ fontSize: '0.9rem', color: '#a0a0a0', lineHeight: '1.6' }}>
                  {stat.note}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.statSummary} style={{ marginTop: '30px', padding: '20px', background: 'rgba(78, 205, 196, 0.1)', borderRadius: '8px' }}>
          <h4 style={{ color: '#4ECDC4', marginBottom: '15px' }}>요약</h4>
          <ul style={{ fontSize: '0.95rem', lineHeight: '2', color: '#e0e0e0' }}>
            {breakpointData.mountainThane.summary.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </Card>

      {/* SimC 설정 */}
      <Card ref={subSectionRefs['stats-simc']}>
        <h3 className={styles.subsectionTitle}>SimulationCraft 설정</h3>
        <div className={styles.simcSettings}>
          <p style={{ fontSize: '0.95rem', color: '#a0a0a0', lineHeight: '1.8', marginBottom: '20px' }}>
            정확한 스탯 가중치는 캐릭터의 현재 장비와 특성에 따라 달라집니다.
            <a href="https://www.raidbots.com/simbot" target="_blank" rel="noopener noreferrer" style={{ color: '#C69B6D', textDecoration: 'underline', marginLeft: '5px' }}>
              Raidbots
            </a>에서 시뮬레이션을 통해 정확한 우선순위를 확인하세요.
          </p>
          <div className={styles.simcCode}>
            <h4 style={{ color: '#C69B6D', marginBottom: '15px' }}>SimC 기본 설정</h4>
            <pre style={{ background: '#0a0a0f', padding: '20px', borderRadius: '8px', fontSize: '0.9rem', overflow: 'x: auto' }}>
{`# 학살자 특성 시뮬레이션
warrior="FuryWarrior_Slayer"
level=80
race=orc
spec=fury
role=attack

# 산왕 특성 시뮬레이션
warrior="FuryWarrior_MountainThane"
level=80
race=orc
spec=fury
role=attack`}
            </pre>
          </div>
        </div>
      </Card>
    </Section>
  );

  return (
    <ThemeProvider theme={unifiedTheme}>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>분노 전사 가이드</Title>
          <Subtitle>TWW 시즌3 (11.2 패치) - PvE 딜 가이드</Subtitle>
          <div>
            <PatchBadge>패치 11.2</PatchBadge>
            <DifficultyBadge difficulty="중급">중급</DifficultyBadge>
          </div>
          <UpdateInfo>최종 수정일: 2025.10.03</UpdateInfo>
        </Header>

        <ContentWrapper>
          <Sidebar>
            <NavSection>
              <NavTitle>목차</NavTitle>
              <NavItem
                isActive={activeSection === 'overview'}
                onClick={() => scrollToSection('overview')}
              >
                개요
              </NavItem>
              <SubNavItem
                isActive={activeSubSection === 'overview-intro'}
                onClick={() => scrollToSubSection('overview-intro')}
              >
                전문화 소개
              </SubNavItem>
              <SubNavItem
                isActive={activeSubSection === 'overview-resource'}
                onClick={() => scrollToSubSection('overview-resource')}
              >
                리소스 시스템
              </SubNavItem>

              <NavItem
                isActive={activeSection === 'rotation'}
                onClick={() => scrollToSection('rotation')}
              >
                딜사이클
              </NavItem>
              <SubNavItem
                isActive={activeSubSection === 'rotation-opener'}
                onClick={() => scrollToSubSection('rotation-opener')}
              >
                오프닝
              </SubNavItem>
              <SubNavItem
                isActive={activeSubSection === 'rotation-priority'}
                onClick={() => scrollToSubSection('rotation-priority')}
              >
                우선순위
              </SubNavItem>

              <NavItem
                isActive={activeSection === 'builds'}
                onClick={() => scrollToSection('builds')}
              >
                특성 빌드
              </NavItem>
              <SubNavItem
                isActive={activeSubSection === 'builds-raid'}
                onClick={() => scrollToSubSection('builds-raid')}
              >
                레이드 빌드
              </SubNavItem>
              <SubNavItem
                isActive={activeSubSection === 'builds-dungeon'}
                onClick={() => scrollToSubSection('builds-dungeon')}
              >
                쐐기돌 빌드
              </SubNavItem>

              <NavItem
                isActive={activeSection === 'stats'}
                onClick={() => scrollToSection('stats')}
              >
                스탯
              </NavItem>
              <SubNavItem
                isActive={activeSubSection === 'stats-priority'}
                onClick={() => scrollToSubSection('stats-priority')}
              >
                우선순위
              </SubNavItem>
              <SubNavItem
                isActive={activeSubSection === 'stats-simc'}
                onClick={() => scrollToSubSection('stats-simc')}
              >
                SimC 설정
              </SubNavItem>
            </NavSection>
          </Sidebar>

          <MainContent>
            {renderOverview()}
            {renderRotation()}
            {renderBuilds()}
            {renderStats()}
          </MainContent>
        </ContentWrapper>

        {/* 업데이트 알림 토스트 */}
        {showUpdateToast && pendingUpdate && ReactDOM.createPortal(
          <UpdateToast
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            onClick={handleAcceptUpdate}
          >
            <GlowingIcon>✨</GlowingIcon>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>가이드 업데이트 가능</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                {pendingUpdate.message || '새로운 정보가 추가되었습니다'}
              </div>
            </div>
          </UpdateToast>,
          document.body
        )}

        {/* 복사 완료 토스트 */}
        {showToast && ReactDOM.createPortal(
          <Toast>✓ 클립보드에 복사되었습니다</Toast>,
          document.body
        )}
      </Container>
    </ThemeProvider>
  );
}

// SkillIcon 컴포넌트
function SkillIcon({ skill, size = 'medium', showTooltip = true, textOnly = false, className = '' }) {
  const [showTip, setShowTip] = useState(false);
  const tooltipRef = useRef(null);

  const sizeMap = {
    small: '32px',
    medium: '48px',
    large: '64px'
  };

  if (textOnly) {
    return (
      <span
        className={className}
        style={{
          color: '#C69B6D',
          fontWeight: 'bold',
          cursor: showTooltip ? 'help' : 'default'
        }}
        onMouseEnter={() => showTooltip && setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        {skill.koreanName}
        {showTooltip && showTip && (
          <SkillTooltip skill={skill} tooltipRef={tooltipRef} />
        )}
      </span>
    );
  }

  return (
    <div
      className={`${styles.skillIcon} ${className}`}
      onMouseEnter={() => showTooltip && setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      style={{
        position: 'relative',
        display: 'inline-block'
      }}
    >
      <img
        src={getWowIcon(skill.icon)}
        alt={skill.koreanName}
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderRadius: '8px',
          border: '2px solid #C69B6D',
          cursor: showTooltip ? 'help' : 'default'
        }}
      />
      {showTooltip && showTip && (
        <SkillTooltip skill={skill} tooltipRef={tooltipRef} />
      )}
    </div>
  );
}

// 스킬 툴팁 컴포넌트
function SkillTooltip({ skill, tooltipRef }) {
  return ReactDOM.createPortal(
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #15151f 100%)',
        border: '2px solid #C69B6D',
        borderRadius: '12px',
        padding: '1.5rem',
        minWidth: '320px',
        maxWidth: '400px',
        zIndex: 10000,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        pointerEvents: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '12px' }}>
        <img
          src={getWowIcon(skill.icon)}
          alt={skill.koreanName}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            border: '2px solid #C69B6D'
          }}
        />
        <div>
          <h4 style={{ color: '#C69B6D', fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px' }}>
            {skill.koreanName}
          </h4>
          <p style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>{skill.englishName}</p>
        </div>
      </div>

      <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#e0e0e0', marginBottom: '1rem' }}>
        {skill.description}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
        {skill.castTime && (
          <div>
            <span style={{ color: '#a0a0a0' }}>시전:</span>
            <span style={{ color: '#e0e0e0', marginLeft: '8px' }}>{skill.castTime}</span>
          </div>
        )}
        {skill.cooldown && skill.cooldown !== '없음' && skill.cooldown !== '해당 없음' && (
          <div>
            <span style={{ color: '#a0a0a0' }}>쿨타임:</span>
            <span style={{ color: '#e0e0e0', marginLeft: '8px' }}>{skill.cooldown}</span>
          </div>
        )}
        {skill.resourceCost && skill.resourceCost !== '없음' && (
          <div>
            <span style={{ color: '#a0a0a0' }}>소모:</span>
            <span style={{ color: '#f44336', marginLeft: '8px' }}>{skill.resourceCost}</span>
          </div>
        )}
        {skill.resourceGain && skill.resourceGain !== '없음' && (
          <div>
            <span style={{ color: '#a0a0a0' }}>획득:</span>
            <span style={{ color: '#4caf50', marginLeft: '8px' }}>{skill.resourceGain}</span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default FuryWarriorGuide;
