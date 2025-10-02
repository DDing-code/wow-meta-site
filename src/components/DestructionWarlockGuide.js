import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase';
import { destructionWarlockSkills as skillData } from '../data/destructionWarlockSkillData';
import styles from './DevastationEvokerGuide.module.css';
import moduleEventBus from '../services/ModuleEventBus';
import aiFeedbackService from '../services/AIFeedbackService';
import externalGuideCollector from '../services/ExternalGuideCollector';
import realtimeGuideUpdater from '../services/RealtimeGuideUpdater';
import learningAIPatternAnalyzer from '../services/LearningAIPatternAnalyzer';
import { classIcons, WowIcon, getWowIcon, gameIcons } from '../utils/wowIcons';
import wowheadDescriptions from '../data/wowhead-descriptions.json';

// 파괴 흑마법사 테마
const unifiedTheme = {
  colors: {
    primary: '#9482C9',      // 흑마법사 클래스 색상
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#FF6B35',       // 파괴(화염) 강조색
    border: '#2a2a3e',
    hover: 'rgba(148, 130, 201, 0.1)',
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
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;

  &::before {
    content: '🔄';
    font-size: 1.5rem;
  }
`;

// Guide 페이지 레이아웃 스타일 컴포넌트들
const PageWrapper = styled.div`
  min-height: 100vh;
  color: ${props => props.theme.colors.text};
  display: flex;
`;

const Sidebar = styled.nav`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 260px;
  max-height: 80vh;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  border-radius: 0 8px 8px 0;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg} 0;
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
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavSection = styled.div`
  padding: 0 ${props => props.theme.spacing.lg};
`;

const NavItem = styled.a`
  display: block;
  padding: ${props => props.theme.spacing.md};
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

const SubNavItem = styled.a`
  display: block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-left: ${props => props.theme.spacing.xxl};
  margin: 0.1rem 0;
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.subtext};
  text-decoration: none;
  border-left: 2px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  background: ${props => props.active ? 'rgba(255, 107, 53, 0.05)' : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${props => props.active ? '500' : '400'};

  &:hover {
    background: rgba(255, 107, 53, 0.05);
    color: ${props => props.theme.colors.accent};
  }
`;

const MainContent = styled.main`
  margin-left: 260px;
  width: calc(100% - 260px);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: ${props => props.theme.spacing.md} 0;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: ${props => props.theme.spacing.sm} 0;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 3000px;
  padding: 0 0.5rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Section = styled.section`
  width: 100%;
  margin-bottom: 1rem;
  scroll-margin-top: 120px;
`;

const SectionHeader = styled.div`
  background: linear-gradient(to right, ${props => props.theme.colors.hover}, transparent);
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.subtext};
  margin: 0.5rem 0 0 0;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const HeroCard = styled(Card)`
  border-top: 3px solid ${props => props.theme.colors.accent};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.active ? '#fff' : props.theme.colors.text};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const InfoBox = styled.div`
  background: rgba(255, 107, 53, 0.1);
  border-left: 3px solid ${props => props.theme.colors.accent};
  padding: ${props => props.theme.spacing.md};
  border-radius: 4px;
  margin: ${props => props.theme.spacing.md} 0;

  p {
    margin: 0;
    line-height: 1.6;
    color: ${props => props.theme.colors.text};
  }
`;

const SkillList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.secondary};
  border-radius: 6px;
  border-left: 3px solid ${props => props.highlight ? props.theme.colors.accent : 'transparent'};
`;

const BuildCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(148, 130, 201, 0.2);
  }
`;

const CopyButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: ${props => props.theme.spacing.md};

  &:hover {
    background: ${props => props.theme.colors.accent};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 영웅특성별 콘텐츠 생성 함수
const getHeroContent = (SkillIcon) => ({
  hellcaller: {
    name: '지옥소환사',
    icon: '🔥',
    tierSet: {
      '2set': <><SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.wither} textOnly={true} />가 <SkillIcon skill={skillData.immolate} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.immolate} textOnly={true} />를 대체합니다. <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.wither} textOnly={true} />는 8중첩까지 쌓이는 강력한 지속 피해 효과입니다.</>,
      '4set': <><SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 및 <SkillIcon skill={skillData.rainOfFire} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.rainOfFire} textOnly={true} /> 사용 시 <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.wither} textOnly={true} /> 스택을 즉시 증가시킵니다.</>
    },
    singleTarget: {
      opener: [
        skillData.soulFire,
        skillData.immolate,
        skillData.conflagrate,
        skillData.chaosBolt,
        skillData.conflagrate,
        skillData.incinerate
      ],
      priority: [
        { skill: skillData.conflagrate, desc: '충전 횟수 2회를 유지하며 재사용 대기시간마다 사용' },
        { skill: skillData.chaosBolt, desc: '영혼의 조각 2개 소모, 항상 극대화 피해' },
        { skill: skillData.soulFire, desc: '20초 재사용, 우선순위 높음' },
        { skill: skillData.immolate, desc: '18초 지속, 항상 유지' },
        { skill: skillData.channelDemonfire, desc: '제물이 걸린 대상 우선 공격' },
        { skill: skillData.incinerate, desc: '기본 필러, 영혼의 조각 파편 2개 생성' }
      ]
    },
    aoe: {
      opener: [
        skillData.soulFire,
        skillData.cataclysm,
        skillData.rainOfFire,
        skillData.channelDemonfire,
        skillData.conflagrate
      ],
      priority: [
        { skill: skillData.cataclysm, desc: '광역 제물 적용, 30초 재사용' },
        { skill: skillData.rainOfFire, desc: '3개 이상 대상에 사용, 영혼의 조각 3개 소모' },
        { skill: skillData.channelDemonfire, desc: '제물 걸린 모든 대상에 피해' },
        { skill: skillData.havoc, desc: '2대상 상황에서 단일 주문 복사' },
        { skill: skillData.conflagrate, desc: '충전 횟수 유지' },
        { skill: skillData.incinerate, desc: '필러로 사용' }
      ]
    }
  },
  diabolist: {
    name: '악마학자',
    icon: '😈',
    tierSet: {
      '2set': <><SkillIcon skill={skillData.motherOfChaos} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.motherOfChaos} textOnly={true} /> 효과로 임프 어미를 소환합니다. <SkillIcon skill={skillData.soulShard} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.soulShard} textOnly={true} /> 소비 시 일정 확률로 발동합니다.</>,
      '4set': <><SkillIcon skill={skillData.overlord} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.overlord} textOnly={true} /> 효과로 악마 소환 시 임프 군주로 업그레이드됩니다. 강력한 화염 볼트를 발사합니다.</>
    },
    singleTarget: {
      opener: [
        skillData.soulFire,
        skillData.immolate,
        skillData.conflagrate,
        skillData.summonInfernal,
        skillData.chaosBolt,
        skillData.conflagrate
      ],
      priority: [
        { skill: skillData.summonInfernal, desc: '120초 주요 쿨다운, 영혼의 조각 파편 3개 생성' },
        { skill: skillData.conflagrate, desc: '충전 횟수 2회 유지' },
        { skill: skillData.dimensionalRift, desc: '무작위 악마 소환, 3회 충전' },
        { skill: skillData.chaosBolt, desc: '영혼의 조각 2개로 사용' },
        { skill: skillData.soulFire, desc: '20초 재사용' },
        { skill: skillData.immolate, desc: '지속 유지' },
        { skill: skillData.incinerate, desc: '기본 필러' }
      ]
    },
    aoe: {
      opener: [
        skillData.soulFire,
        skillData.cataclysm,
        skillData.summonInfernal,
        skillData.rainOfFire,
        skillData.channelDemonfire
      ],
      priority: [
        { skill: skillData.summonInfernal, desc: '광역 상황에서 우선 사용' },
        { skill: skillData.cataclysm, desc: '모든 대상에 제물 적용' },
        { skill: skillData.rainOfFire, desc: '3개 이상 대상' },
        { skill: skillData.channelDemonfire, desc: '모든 제물 대상 공격' },
        { skill: skillData.dimensionalRift, desc: '추가 악마 소환' },
        { skill: skillData.conflagrate, desc: '충전 횟수 유지' }
      ]
    }
  }
});

// SkillIcon 컴포넌트
const SkillIconComponent = ({ skill, size = 'medium', showTooltip = true, className = '', textOnly = false }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const iconRef = useRef(null);

  const getEnhancedSkillData = () => {
    if (!skill) return null;

    const wowheadInfo = wowheadDescriptions[skill.id] ||
                        wowheadDescriptions[skill.koreanName] ||
                        wowheadDescriptions[skill.englishName];

    return {
      ...skill,
      ...(wowheadInfo || {})
    };
  };

  const enhancedSkill = getEnhancedSkillData();

  if (!enhancedSkill) return null;

  if (textOnly) {
    return (
      <span
        style={{
          color: '#FF6B35',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        {enhancedSkill.koreanName}
        {showTooltip && isTooltipVisible && (
          <TooltipPortal skill={enhancedSkill} />
        )}
      </span>
    );
  }

  const sizeMap = {
    small: '32px',
    medium: '48px',
    large: '64px'
  };

  return (
    <span
      ref={iconRef}
      className={`skill-icon ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        cursor: showTooltip ? 'pointer' : 'default'
      }}
      onMouseEnter={() => showTooltip && setIsTooltipVisible(true)}
      onMouseLeave={() => showTooltip && setIsTooltipVisible(false)}
    >
      <img
        src={`https://wow.zamimg.com/images/wow/icons/large/${enhancedSkill.icon}.jpg`}
        alt={enhancedSkill.koreanName}
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderRadius: '6px',
          border: '2px solid #9482C9'
        }}
      />
      {showTooltip && isTooltipVisible && (
        <TooltipPortal skill={enhancedSkill} />
      )}
    </span>
  );
};

// 툴팁 포털 컴포넌트
const TooltipPortal = ({ skill }) => {
  const tooltipContent = (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
      border: '2px solid #9482C9',
      borderRadius: '8px',
      padding: '1.5rem',
      maxWidth: '400px',
      zIndex: 10000,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
      pointerEvents: 'none'
    }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img
          src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
          alt={skill.koreanName}
          style={{ width: '48px', height: '48px', borderRadius: '6px' }}
        />
        <div>
          <h4 style={{ margin: 0, color: '#FF6B35', fontSize: '1.2rem' }}>{skill.koreanName}</h4>
          <p style={{ margin: '0.25rem 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>{skill.englishName}</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #444', paddingTop: '1rem', marginTop: '1rem' }}>
        {skill.castTime && (
          <p style={{ margin: '0.5rem 0', color: '#e0e0e0' }}>
            <strong style={{ color: '#FF6B35' }}>시전 시간:</strong> {skill.castTime}
          </p>
        )}
        {skill.cooldown && skill.cooldown !== '해당 없음' && (
          <p style={{ margin: '0.5rem 0', color: '#e0e0e0' }}>
            <strong style={{ color: '#FF6B35' }}>재사용 대기시간:</strong> {skill.cooldown}
          </p>
        )}
        {skill.resourceCost && skill.resourceCost !== '해당 없음' && (
          <p style={{ margin: '0.5rem 0', color: '#e0e0e0' }}>
            <strong style={{ color: '#FF6B35' }}>소모:</strong> {skill.resourceCost}
          </p>
        )}
        {skill.resourceGain && skill.resourceGain !== '없음' && (
          <p style={{ margin: '0.5rem 0', color: '#e0e0e0' }}>
            <strong style={{ color: '#FF6B35' }}>획득:</strong> {skill.resourceGain}
          </p>
        )}
        {skill.range && (
          <p style={{ margin: '0.5rem 0', color: '#e0e0e0' }}>
            <strong style={{ color: '#FF6B35' }}>사거리:</strong> {skill.range}
          </p>
        )}
      </div>

      <p style={{ marginTop: '1rem', color: '#e0e0e0', lineHeight: '1.6', borderTop: '1px solid #444', paddingTop: '1rem' }}>
        {skill.description}
      </p>
    </div>
  );

  return ReactDOM.createPortal(tooltipContent, document.body);
};

// 메인 컴포넌트
function DestructionWarlockGuide() {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedHero, setSelectedHero] = useState('hellcaller');
  const [selectedTier, setSelectedTier] = useState('hellcaller');
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [copiedBuild, setCopiedBuild] = useState(null);

  const heroContent = getHeroContent(SkillIconComponent);

  useEffect(() => {
    moduleEventBus.registerModule('destruction-warlock-guide', {
      name: '파괴 흑마법사 가이드',
      version: '11.2.0',
      specialization: 'destruction'
    });

    const handleGuideUpdate = (data) => {
      if (data.specialization === 'destruction') {
        setShowUpdateToast(true);
        setTimeout(() => setShowUpdateToast(false), 5000);
      }
    };

    moduleEventBus.on('guide-updated', handleGuideUpdate);

    return () => {
      moduleEventBus.off('guide-updated', handleGuideUpdate);
    };
  }, []);

  const handleCopyBuild = (buildCode, buildName) => {
    navigator.clipboard.writeText(buildCode);
    setCopiedBuild(buildName);
    setTimeout(() => setCopiedBuild(null), 2000);
  };

  // 특성 빌드 데이터
  const talentBuilds = {
    hellcaller: {
      'raid-single': {
        name: '레이드 단일 대상',
        description: '지옥소환사를 활용한 단일 대상 빌드입니다. 쇠퇴 스택을 최대화하여 강력한 버스트를 제공합니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgEJSSSkERSiEJJJJJhkQSCJRSAAAAAA',
        icon: '🔥'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '지옥소환사를 활용한 광역 빌드입니다. 쇠퇴와 악마불길 경로로 광역 딜을 극대화합니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgEJSSSkERSSSShkISCJJhEAAAAA',
        icon: '🔥'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '지옥소환사를 활용한 신화+ 빌드입니다. 광역 딜과 생존력에 중점을 둡니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgEJSSSkQSCJJJhkQSSSShEAAAAA',
        icon: '🔥'
      }
    },
    diabolist: {
      'raid-single': {
        name: '레이드 단일 대상',
        description: '악마학자를 활용한 단일 대상 빌드입니다. 악마 소환으로 지속 딜을 강화합니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSQSkEJJJJJhkQSCJRSAAAAAA',
        icon: '😈'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '악마학자를 활용한 광역 빌드입니다. 임프 소환과 불의 비로 광역 딜을 제공합니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSQSkESSSSShkISCJJhEAAAAA',
        icon: '😈'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '악마학자를 활용한 신화+ 빌드입니다. 악마 소환과 광역 딜을 균형있게 사용합니다.',
        code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASSSQSkQSCJJJhkQSSSShEAAAAA',
        icon: '😈'
      }
    }
  };

  // 스탯 우선순위 데이터
  const breakpointData = {
    hellcaller: {
      priority: [
        { stat: '지능', value: '주 능력치', color: '#4fc3f7' },
        { stat: '극대화', value: '35%+', color: '#ff9800' },
        { stat: '가속', value: '25%+', color: '#f44336' },
        { stat: '특화', value: '20%+', color: '#9c27b0' },
        { stat: '치명타', value: '잔여 스탯', color: '#66bb6a' }
      ],
      explanation: '지옥소환사는 쇠퇴 스택 유지와 혼돈의 화살 극대화를 위해 극대화를 우선합니다. 가속은 시전 시간 단축과 전역 재사용 대기시간 감소에 도움이 됩니다.'
    },
    diabolist: {
      priority: [
        { stat: '지능', value: '주 능력치', color: '#4fc3f7' },
        { stat: '가속', value: '30%+', color: '#f44336' },
        { stat: '극대화', value: '30%+', color: '#ff9800' },
        { stat: '특화', value: '잔여 스탯', color: '#9c27b0' },
        { stat: '치명타', value: '잔여 스탯', color: '#66bb6a' }
      ],
      explanation: '악마학자는 악마 소환 빈도를 높이기 위해 가속을 우선합니다. 혼돈의 화살의 극대화 피해도 중요합니다.'
    }
  };

  // 개요 섹션
  const OverviewSection = () => (
    <Section id="overview">
      <SectionHeader>
        <SectionTitle>⚔️ 파괴 흑마법사 개요</SectionTitle>
        <SectionSubtitle>11.2 패치 (TWW 시즌 3)</SectionSubtitle>
      </SectionHeader>

      <Card>
        <h3 style={{ color: '#FF6B35', marginTop: 0 }}>전문화 소개</h3>
        <p style={{ lineHeight: '1.8', color: '#e0e0e0' }}>
          파괴 흑마법사는 강력한 화염과 암흑불길 주문으로 적을 소멸시키는 원거리 딜러입니다.
          <SkillIconComponent skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
          <SkillIconComponent skill={skillData.chaosBolt} textOnly={true} />의 항상 극대화 피해와
          <SkillIconComponent skill={skillData.rainOfFire} size="small" className={styles.inlineIcon} />
          <SkillIconComponent skill={skillData.rainOfFire} textOnly={true} />의 강력한 광역 딜이 특징입니다.
        </p>

        <InfoBox>
          <p>
            <strong style={{ color: '#FF6B35' }}>핵심 메커니즘:</strong>
            <SkillIconComponent skill={skillData.soulShard} size="small" className={styles.inlineIcon} />
            <SkillIconComponent skill={skillData.soulShard} textOnly={true} />를 생성하고 소비하며,
            <SkillIconComponent skill={skillData.immolate} size="small" className={styles.inlineIcon} />
            <SkillIconComponent skill={skillData.immolate} textOnly={true} />을 유지하면서
            <SkillIconComponent skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
            <SkillIconComponent skill={skillData.chaosBolt} textOnly={true} />로 버스트를 가합니다.
          </p>
        </InfoBox>

        <h3 style={{ color: '#FF6B35' }}>리소스 시스템</h3>
        <Grid>
          <div>
            <h4 style={{ color: '#9482C9' }}>
              <SkillIconComponent skill={skillData.soulShard} size="small" className={styles.inlineIcon} />
              영혼의 조각
            </h4>
            <p style={{ lineHeight: '1.6', color: '#e0e0e0' }}>
              최대 5개까지 보유할 수 있으며, 10개의 파편으로 나뉩니다.
              <SkillIconComponent skill={skillData.incinerate} textOnly={true} />로 2개,
              <SkillIconComponent skill={skillData.conflagrate} textOnly={true} />로 5개의 파편을 생성합니다.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#9482C9' }}>리소스 관리</h4>
            <ul style={{ lineHeight: '1.6', color: '#e0e0e0' }}>
              <li><SkillIconComponent skill={skillData.chaosBolt} textOnly={true} />: 2개 소모</li>
              <li><SkillIconComponent skill={skillData.rainOfFire} textOnly={true} />: 3개 소모</li>
              <li><SkillIconComponent skill={skillData.shadowburn} textOnly={true} />: 1개 소모</li>
              <li>최대 5개 유지 - 낭비 방지 중요</li>
            </ul>
          </div>
        </Grid>

        <h3 style={{ color: '#FF6B35' }}>영웅 특성 선택</h3>
        <Grid>
          <BuildCard onClick={() => setSelectedHero('hellcaller')}>
            <h4 style={{ color: '#FF6B35', margin: '0 0 1rem 0' }}>🔥 지옥소환사</h4>
            <p style={{ color: '#e0e0e0', marginBottom: '0.5rem' }}>
              <SkillIconComponent skill={skillData.wither} textOnly={true} />로
              <SkillIconComponent skill={skillData.immolate} textOnly={true} />를 대체합니다.
              8중첩까지 쌓이는 강력한 DoT 효과로 지속 딜을 극대화합니다.
            </p>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
              <strong>추천:</strong> 레이드, 쐐기돌 (범용)
            </p>
          </BuildCard>
          <BuildCard onClick={() => setSelectedHero('diabolist')}>
            <h4 style={{ color: '#FF6B35', margin: '0 0 1rem 0' }}>😈 악마학자</h4>
            <p style={{ color: '#e0e0e0', marginBottom: '0.5rem' }}>
              임프 어미와 임프 군주를 소환합니다.
              영혼의 조각 소비 시 추가 악마를 소환하여 지속적인 피해를 제공합니다.
            </p>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
              <strong>추천:</strong> 레이드 (악마 테마 선호 시)
            </p>
          </BuildCard>
        </Grid>
      </Card>
    </Section>
  );

  // 딜사이클 섹션
  const RotationSection = () => (
    <Section id="rotation">
      <SectionHeader>
        <SectionTitle>🎯 딜사이클</SectionTitle>
        <SectionSubtitle>영웅 특성별 우선순위</SectionSubtitle>
      </SectionHeader>

      <TabContainer>
        <Tab active={selectedTier === 'hellcaller'} onClick={() => setSelectedTier('hellcaller')}>
          🔥 지옥소환사
        </Tab>
        <Tab active={selectedTier === 'diabolist'} onClick={() => setSelectedTier('diabolist')}>
          😈 악마학자
        </Tab>
      </TabContainer>

      <HeroCard>
        <h3 style={{ color: '#FF6B35', marginTop: 0 }}>
          {selectedTier === 'hellcaller' ? '🔥 지옥소환사' : '😈 악마학자'} 티어 세트 효과
        </h3>
        <Grid>
          <div>
            <h4 style={{ color: '#9482C9' }}>2세트 효과</h4>
            <p style={{ lineHeight: '1.6', color: '#e0e0e0' }}>
              {heroContent[selectedTier].tierSet['2set']}
            </p>
          </div>
          <div>
            <h4 style={{ color: '#9482C9' }}>4세트 효과</h4>
            <p style={{ lineHeight: '1.6', color: '#e0e0e0' }}>
              {heroContent[selectedTier].tierSet['4set']}
            </p>
          </div>
        </Grid>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#FF6B35' }}>단일 대상 딜사이클</h3>

          <h4 style={{ color: '#9482C9', marginTop: '1.5rem' }}>오프닝</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {heroContent[selectedTier].singleTarget.opener.map((skill, index) => (
              <SkillIconComponent key={index} skill={skill} size="medium" />
            ))}
          </div>

          <h4 style={{ color: '#9482C9', marginTop: '1.5rem' }}>우선순위</h4>
          <SkillList>
            {heroContent[selectedTier].singleTarget.priority.map((item, index) => (
              <SkillItem key={index}>
                <SkillIconComponent skill={item.skill} size="small" />
                <span style={{ color: '#e0e0e0' }}>
                  <strong style={{ color: '#FF6B35' }}>{index + 1}.</strong> {item.desc}
                </span>
              </SkillItem>
            ))}
          </SkillList>

          {selectedTier === 'hellcaller' && (
            <p style={{ fontSize: '0.85rem', color: '#9482C9', marginTop: '10px' }}>
              💡 팁: 쇠퇴 스택을 8중첩으로 유지하고 혼돈의 화살을 극대화하는 것이 핵심입니다
            </p>
          )}

          <h3 style={{ color: '#FF6B35', marginTop: '2rem' }}>광역 딜사이클</h3>

          <h4 style={{ color: '#9482C9', marginTop: '1.5rem' }}>오프닝</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {heroContent[selectedTier].aoe.opener.map((skill, index) => (
              <SkillIconComponent key={index} skill={skill} size="medium" />
            ))}
          </div>

          <h4 style={{ color: '#9482C9', marginTop: '1.5rem' }}>우선순위</h4>
          <SkillList>
            {heroContent[selectedTier].aoe.priority.map((item, index) => (
              <SkillItem key={index}>
                <SkillIconComponent skill={item.skill} size="small" />
                <span style={{ color: '#e0e0e0' }}>
                  <strong style={{ color: '#FF6B35' }}>{index + 1}.</strong> {item.desc}
                </span>
              </SkillItem>
            ))}
          </SkillList>

          <InfoBox style={{ marginTop: '1.5rem' }}>
            <p>
              <strong style={{ color: '#FF6B35' }}>광역 팁:</strong> 3개 이상의 대상이 있을 때
              <SkillIconComponent skill={skillData.rainOfFire} textOnly={true} />를 우선 사용하고,
              <SkillIconComponent skill={skillData.cataclysm} textOnly={true} />으로 모든 대상에 제물을 적용하세요.
            </p>
          </InfoBox>
        </div>
      </HeroCard>

      {/* 심화 분석 섹션 */}
      <HeroCard style={{ marginTop: '1rem' }}>
        <h3 style={{ color: '#FF6B35', marginTop: 0 }}>
          🔍 심화 분석: {selectedTier === 'hellcaller' ? '지옥소환사' : '악마학자'}
        </h3>

        <div style={{ display: 'grid', gap: '20px' }}>
          {selectedTier === 'hellcaller' ? (
            <>
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ color: '#8B00FF', fontSize: '1.1rem', marginBottom: '15px' }}>
                  <SkillIconComponent skill={skillData.wither} size="small" className={styles.inlineIcon} />
                  <SkillIconComponent skill={skillData.wither} textOnly={true} /> 메커니즘 최적화
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>자동 변환:</strong>{' '}
                    <SkillIconComponent skill={skillData.immolate} size="small" className={styles.inlineIcon} />
                    <SkillIconComponent skill={skillData.immolate} textOnly={true} />이 자동으로{' '}
                    <SkillIconComponent skill={skillData.wither} size="small" className={styles.inlineIcon} />
                    <SkillIconComponent skill={skillData.wither} textOnly={true} />로 변환됩니다
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>스택 관리:</strong> 최대 8중첩까지 쌓이며, 각 중첩마다 피해가 증가합니다
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>유지 시간:</strong> 18초 지속되므로 지속적인 리프레시 필요
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>티어 시너지:</strong>{' '}
                    <SkillIconComponent skill={skillData.chaosBolt} textOnly={true} /> 및{' '}
                    <SkillIconComponent skill={skillData.rainOfFire} textOnly={true} /> 사용 시 스택 자동 증가
                  </li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#ff9800', fontSize: '1.1rem', marginBottom: '15px' }}>
                  <SkillIconComponent skill={skillData.channelDemonfire} size="small" className={styles.inlineIcon} />
                  <SkillIconComponent skill={skillData.channelDemonfire} textOnly={true} /> 활용
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>우선순위:</strong> 제물(또는 쇠퇴)이 걸린 대상을 자동으로 우선 공격합니다
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>재사용:</strong> 25초 재사용 대기시간, 3초 경로 시전
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>다중 대상:</strong> 여러 대상에 쇠퇴가 걸려있으면 모두 공격 가능
                  </li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#4caf50', fontSize: '1.1rem', marginBottom: '15px' }}>
                  <SkillIconComponent skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
                  <SkillIconComponent skill={skillData.chaosBolt} textOnly={true} /> 최적화
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>항상 극대화:</strong> 피해가 항상 극대화 효과를 발휘합니다
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>리소스:</strong> 영혼의 조각 2개를 소모합니다
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>버스트 타이밍:</strong> 주요 쿨다운과 함께 사용하여 극대화
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>시전 시간:</strong> 3초 시전 - 이동 중 불가
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ color: '#8B00FF', fontSize: '1.1rem', marginBottom: '15px' }}>
                  <SkillIconComponent skill={skillData.motherOfChaos} size="small" className={styles.inlineIcon} />
                  <SkillIconComponent skill={skillData.motherOfChaos} textOnly={true} /> 메커니즘
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>발동 조건:</strong> 영혼의 조각 소비 시 일정 확률로 임프 어미 소환
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>임프 생성:</strong> 임프 어미가 작은 임프들을 지속적으로 생성
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>피해 기여:</strong> 생성된 임프들이 자동으로 대상 공격
                  </li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#ff9800', fontSize: '1.1rem', marginBottom: '15px' }}>
                  <SkillIconComponent skill={skillData.overlord} size="small" className={styles.inlineIcon} />
                  <SkillIconComponent skill={skillData.overlord} textOnly={true} /> 활용
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>업그레이드:</strong> 악마 소환 시 일정 확률로 임프 군주로 업그레이드
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>강화 공격:</strong> 임프 군주는 강력한 화염 볼트를 발사
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>지속 시간:</strong> 일반 임프보다 긴 지속 시간
                  </li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#4caf50', fontSize: '1.1rem', marginBottom: '15px' }}>
                  <SkillIconComponent skill={skillData.dimensionalRift} size="small" className={styles.inlineIcon} />
                  <SkillIconComponent skill={skillData.dimensionalRift} textOnly={true} /> 관리
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>충전 시스템:</strong> 최대 3회 충전, 45초 재사용 대기시간
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>무작위 악마:</strong> 다양한 종류의 악마를 소환합니다
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>사용 타이밍:</strong> 주요 쿨다운과 함께 모든 충전 횟수 사용
                  </li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#2196f3', fontSize: '1.1rem', marginBottom: '15px' }}>
                  <SkillIconComponent skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} />
                  <SkillIconComponent skill={skillData.summonInfernal} textOnly={true} /> 버스트
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>주요 쿨다운:</strong> 120초 재사용, 30초 지속
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>즉시 피해:</strong> 소환 시 주변 적에게 피해 및 기절
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>리소스 생성:</strong> 영혼의 조각 파편 3개 생성
                  </li>
                  <li>
                    <strong style={{ color: '#ff6b6b' }}>버프 타이밍:</strong> 장신구 및 물약과 함께 사용
                  </li>
                </ul>
              </div>
            </>
          )}

          <div>
            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>리소스 관리</h4>
            <ul style={{ lineHeight: '1.8' }}>
              <li>이상적 유지: 2~3개 (최대 5개)</li>
              <li>
                <SkillIconComponent skill={skillData.incinerate} textOnly={true} />로 파편 2개 생성 (극대화 시 3개)
              </li>
              <li>
                <SkillIconComponent skill={skillData.conflagrate} textOnly={true} />로 파편 5개 생성
              </li>
              <li>
                <SkillIconComponent skill={skillData.soulFire} textOnly={true} />로 조각 1개 생성 (20초 재사용)
              </li>
              <li>
                <strong style={{ color: '#ff6b6b' }}>주의:</strong> 5개 상태에서 추가 생성 시 손실 - 즉시{' '}
                <SkillIconComponent skill={skillData.chaosBolt} textOnly={true} /> 또는{' '}
                <SkillIconComponent skill={skillData.rainOfFire} textOnly={true} /> 사용
              </li>
            </ul>
          </div>
        </div>
      </HeroCard>
    </Section>
  );

  // 특성 빌드 섹션
  const BuildsSection = () => (
    <Section id="builds">
      <SectionHeader>
        <SectionTitle>🎯 특성 빌드</SectionTitle>
        <SectionSubtitle>Wowhead 통합 빌드</SectionSubtitle>
      </SectionHeader>

      <TabContainer>
        <Tab active={selectedHero === 'hellcaller'} onClick={() => setSelectedHero('hellcaller')}>
          🔥 지옥소환사
        </Tab>
        <Tab active={selectedHero === 'diabolist'} onClick={() => setSelectedHero('diabolist')}>
          😈 악마학자
        </Tab>
      </TabContainer>

      <Grid>
        {Object.entries(talentBuilds[selectedHero]).map(([key, build]) => (
          <BuildCard key={key}>
            <h3 style={{ color: '#FF6B35', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{build.icon}</span>
              {build.name}
            </h3>
            <p style={{ color: '#e0e0e0', lineHeight: '1.6', marginBottom: '1rem' }}>
              {build.description}
            </p>
            <CopyButton onClick={() => handleCopyBuild(build.code, build.name)}>
              {copiedBuild === build.name ? '✅ 복사됨!' : '📋 빌드 코드 복사'}
            </CopyButton>
            <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '0.5rem' }}>
              Wowhead 계산기에서 불러오기
            </p>
          </BuildCard>
        ))}
      </Grid>

      <InfoBox style={{ marginTop: '1.5rem' }}>
        <p>
          <strong style={{ color: '#FF6B35' }}>빌드 사용법:</strong>
          각 빌드 코드를 복사한 후 Wowhead 계산기(wowhead.com/ko/talent-calc)에서 "빌드 불러오기"를 선택하고 붙여넣으세요.
        </p>
      </InfoBox>
    </Section>
  );

  // 스탯 섹션
  const StatsSection = () => (
    <Section id="stats">
      <SectionHeader>
        <SectionTitle>📊 스탯 우선순위</SectionTitle>
        <SectionSubtitle>영웅 특성별 권장 스탯</SectionSubtitle>
      </SectionHeader>

      <TabContainer>
        <Tab active={selectedHero === 'hellcaller'} onClick={() => setSelectedHero('hellcaller')}>
          🔥 지옥소환사
        </Tab>
        <Tab active={selectedHero === 'diabolist'} onClick={() => setSelectedHero('diabolist')}>
          😈 악마학자
        </Tab>
      </TabContainer>

      <Card>
        <h3 style={{ color: '#FF6B35', marginTop: 0 }}>
          {selectedHero === 'hellcaller' ? '🔥 지옥소환사' : '😈 악마학자'} 스탯 우선순위
        </h3>

        <div style={{ marginBottom: '2rem' }}>
          {breakpointData[selectedHero].priority.map((stat, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              marginBottom: '0.5rem',
              background: `linear-gradient(to right, ${stat.color}22, transparent)`,
              borderLeft: `4px solid ${stat.color}`,
              borderRadius: '4px'
            }}>
              <span style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: stat.color,
                minWidth: '30px',
                marginRight: '1rem'
              }}>
                {index + 1}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 'bold',
                  color: '#e0e0e0',
                  marginBottom: '0.25rem'
                }}>
                  {stat.stat}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#aaa'
                }}>
                  목표: {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <InfoBox>
          <p style={{ lineHeight: '1.8' }}>
            <strong style={{ color: '#FF6B35' }}>설명:</strong><br />
            {breakpointData[selectedHero].explanation}
          </p>
        </InfoBox>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#FF6B35' }}>보석 및 마법부여</h3>
          <Grid>
            <div>
              <h4 style={{ color: '#9482C9' }}>보석</h4>
              <ul style={{ lineHeight: '1.8', color: '#e0e0e0' }}>
                <li><strong>빨강:</strong> 지능</li>
                <li><strong>파랑:</strong> 극대화</li>
                <li><strong>노랑:</strong> 가속</li>
                <li><strong>메타:</strong> 지능 + 극대화</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#9482C9' }}>마법부여 우선순위</h4>
              <ul style={{ lineHeight: '1.8', color: '#e0e0e0' }}>
                <li><strong>무기:</strong> 지능</li>
                <li><strong>가슴:</strong> 지능</li>
                <li><strong>다리:</strong> 지능 + 가속</li>
                <li><strong>발:</strong> 가속</li>
                <li><strong>망토:</strong> 지능</li>
                <li><strong>반지:</strong> 극대화 또는 가속</li>
              </ul>
            </div>
          </Grid>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#FF6B35' }}>SimulationCraft 설정</h3>
          <p style={{ lineHeight: '1.8', color: '#e0e0e0' }}>
            정확한 스탯 가중치를 확인하려면 SimulationCraft를 사용하세요:
          </p>
          <div style={{
            background: '#0a0a0f',
            padding: '1rem',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: '#4fc3f7',
            marginTop: '1rem'
          }}>
            <div>spec=destruction</div>
            <div>role=spell</div>
            <div>position=back</div>
            <div>talents={selectedHero === 'hellcaller' ? 'hellcaller_raid_single' : 'diabolist_raid_single'}</div>
          </div>
        </div>
      </Card>
    </Section>
  );

  return (
    <ThemeProvider theme={unifiedTheme}>
      <PageWrapper>
        {showUpdateToast && (
          <UpdateToast
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            가이드가 업데이트되었습니다!
          </UpdateToast>
        )}

        <Sidebar>
          <NavSection>
            <NavItem
              href="#overview"
              active={activeSection === 'overview'}
              onClick={() => setActiveSection('overview')}
            >
              ⚔️ 개요
            </NavItem>
            <NavItem
              href="#rotation"
              active={activeSection === 'rotation'}
              onClick={() => setActiveSection('rotation')}
            >
              🎯 딜사이클
            </NavItem>
            <SubNavItem
              href="#rotation"
              active={selectedTier === 'hellcaller'}
              onClick={() => { setSelectedTier('hellcaller'); setActiveSection('rotation'); }}
            >
              🔥 지옥소환사
            </SubNavItem>
            <SubNavItem
              href="#rotation"
              active={selectedTier === 'diabolist'}
              onClick={() => { setSelectedTier('diabolist'); setActiveSection('rotation'); }}
            >
              😈 악마학자
            </SubNavItem>
            <NavItem
              href="#builds"
              active={activeSection === 'builds'}
              onClick={() => setActiveSection('builds')}
            >
              🎯 특성 빌드
            </NavItem>
            <NavItem
              href="#stats"
              active={activeSection === 'stats'}
              onClick={() => setActiveSection('stats')}
            >
              📊 스탯
            </NavItem>
          </NavSection>
        </Sidebar>

        <MainContent>
          <ContentContainer>
            {OverviewSection()}
            {RotationSection()}
            {BuildsSection()}
            {StatsSection()}
          </ContentContainer>
        </MainContent>
      </PageWrapper>
    </ThemeProvider>
  );
}

export default DestructionWarlockGuide;
