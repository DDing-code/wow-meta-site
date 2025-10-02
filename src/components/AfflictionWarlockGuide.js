import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase';
// 고통 흑마법사 스킬 데이터 import (11.2 패치 기준)
import { afflictionWarlockSkills as skillData } from '../data/afflictionWarlockSkillData';
import styles from './DevastationEvokerGuide.module.css';
import moduleEventBus from '../services/ModuleEventBus';
import aiFeedbackService from '../services/AIFeedbackService';
import externalGuideCollector from '../services/ExternalGuideCollector';
import realtimeGuideUpdater from '../services/RealtimeGuideUpdater';
import learningAIPatternAnalyzer from '../services/LearningAIPatternAnalyzer';
import { classIcons, WowIcon, getWowIcon, gameIcons } from '../utils/wowIcons';
import wowheadDescriptions from '../data/wowhead-descriptions.json';

// Guide 페이지의 통일된 테마 (Demonology Warlock 가이드 레이아웃)
const unifiedTheme = {
  colors: {
    primary: '#9482C9',      // 흑마법사 클래스 색상
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#9482C9',
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
  box-shadow: 0 4px 20px rgba(63, 198, 176, 0.4);
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

  /* 모바일에서 숨기기 */
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
  background: ${props => props.active ? 'rgba(170, 211, 114, 0.05)' : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${props => props.active ? '500' : '400'};

  &:hover {
    background: rgba(170, 211, 114, 0.05);
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

  /* 모바일에서 전체 화면 사용 */
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

  /* 모바일에서 패딩 조정 */
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

  /* 모바일에서 폰트 사이즈 조정 */
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  margin-bottom: 0.5rem;
  width: 100%;
  max-width: 100%;

  /* 모바일에서 패딩 조정 */
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
    border-radius: 4px;
  }
`;

const HeroCard = styled(Card)`
  background: ${props => {
    if (props.heroType === 'hellcaller') {
      return 'linear-gradient(135deg, rgba(148, 130, 201, 0.05), rgba(139, 0, 255, 0.05))';
    } else if (props.heroType === 'soulHarvester') {
      return 'linear-gradient(135deg, rgba(50, 205, 50, 0.05), rgba(34, 139, 34, 0.05))';
    }
    return props.theme.colors.surface;
  }};
  border: 2px solid ${props => {
    if (props.heroType === 'hellcaller') {
      return 'rgba(148, 130, 201, 0.3)';
    } else if (props.heroType === 'soulHarvester') {
      return 'rgba(50, 205, 50, 0.3)';
    }
    return props.theme.colors.border;
  }};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      if (props.heroType === 'hellcaller') {
        return 'linear-gradient(90deg, #9482C9, #8B00FF)';
      } else if (props.heroType === 'soulHarvester') {
        return 'linear-gradient(90deg, #32CD32, #228B22)';
      }
      return 'transparent';
    }};
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

// skillData는 devastationEvokerSkillData.js 파일에서 import 됨

// 고통 흑마법사 영웅특성별 콘텐츠 (11.2 패치 기준)
// 영웅특성별 콘텐츠 생성 함수 (SkillIcon 컴포넌트 사용을 위해 함수로 변경)
const getHeroContent = (SkillIcon) => ({
  soulHarvester: {
    name: '영혼 수확자',
    icon: '💀',
    tierSet: {
      '2set': <><SkillIcon skill={skillData.shadowEmbrace} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.shadowEmbrace} textOnly={true} /> 능력이 강화됩니다. 지속 피해 효과가 걸린 적이 죽을 때 추가 영혼의 조각을 생성합니다.</>,
      '4set': <><SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.maleficRapture} textOnly={true} /> 피해가 45% 증가합니다. <SkillIcon skill={skillData.nightfall} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.nightfall} textOnly={true} /> 발동 시 추가 효과를 제공합니다.</>
    },
    singleTarget: {
      opener: [
        skillData.haunt,
        skillData.agony,
        skillData.corruption,
        skillData.unstableAffliction,
        skillData.drainSoul,
        skillData.phantomSingularity,
        skillData.soulRot,
        skillData.summonDarkglare,
        skillData.maleficRapture
      ],
      priority: [
        { skill: skillData.agony, desc: '고통을 항상 유지합니다 (지속시간 보존 갱신: 남은 시간 30% 이하에서 갱신)' },
        { skill: skillData.corruption, desc: '부패를 항상 유지합니다 (절대 부패 특성 시 무한 지속)' },
        { skill: skillData.unstableAffliction, desc: '불안정한 고통을 최대 5중첩 유지합니다' },
        { skill: skillData.haunt, desc: '유령 출몰을 재사용 대기시간마다 사용합니다 (15초)' },
        { skill: skillData.soulRot, desc: '영혼 부식을 재사용 대기시간마다 사용합니다 (1분, 영혼 수확자는 3 영혼의 조각 생성)' },
        { skill: skillData.phantomSingularity, desc: '유령 특이점을 재사용 대기시간마다 사용합니다 (45초)' },
        { skill: skillData.summonDarkglare, desc: '암흑시선 소환을 DoT가 최대일 때 사용합니다 (2분, 지속 피해지속시간 8초 연장)' },
        { skill: skillData.maleficRapture, desc: '환희 구간 (60초마다)에 영혼의 조각 5개를 모아 연속 사용합니다' },
        { skill: skillData.drainSoul, desc: '영혼 흡수를 필러로 사용합니다 (20% 이하에서 피해 2배)' }
      ]
    },
    aoe: {
      opener: [
        skillData.haunt,
        skillData.seedOfCorruption,
        skillData.agony,
        skillData.vileTaint,
        skillData.soulRot,
        skillData.summonDarkglare,
        skillData.maleficRapture
      ],
      priority: [
        { skill: skillData.agony, desc: '고통을 최대 8개 대상까지 유지합니다' },
        { skill: skillData.seedOfCorruption, desc: '부패의 씨앗으로 DoT를 빠르게 확산시킵니다' },
        { skill: skillData.vileTaint, desc: '사악한 타락을 재사용 대기시간마다 사용합니다 (30초, 최대 8 대상)' },
        { skill: skillData.soulRot, desc: '영혼 부식을 재사용 대기시간마다 사용합니다 (최대 5 대상)' },
        { skill: skillData.summonDarkglare, desc: '암흑시선 소환을 DoT가 최대일 때 사용합니다' },
        { skill: skillData.maleficRapture, desc: '사악한 환희로 모든 DoT를 폭발시킵니다 (DoT 하나당 피해 증가)' },
        { skill: skillData.drainSoul, desc: '영혼 흡수를 필러로 사용합니다' }
      ]
    }
  },
  hellcaller: {
    name: '지옥소환사',
    icon: '🔥',
    tierSet: {
      '2set': <>시들기 피해가 증가하고, 대상에게 중첩되는 스택 효과를 제공합니다. (부패를 대체하는 강화 효과)</>,
      '4set': <>시들기 스택이 최대일 때 추가 효과가 발동하며, <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.maleficRapture} textOnly={true} /> 사용 시 영혼의 조각 생성 효율이 증가합니다.</>
    },
    singleTarget: {
      opener: [
        skillData.haunt,
        skillData.agony,
        skillData.corruption,
        skillData.unstableAffliction,
        skillData.drainSoul,
        skillData.phantomSingularity,
        skillData.soulRot,
        skillData.summonDarkglare,
        skillData.maleficRapture
      ],
      priority: [
        { skill: skillData.agony, desc: '고통을 항상 유지합니다 (지속시간 보존 갱신: 남은 시간 30% 이하에서 갱신)' },
        { skill: skillData.corruption, desc: '시들기 (Corruption)를 항상 유지합니다 (지옥소환사는 자동으로 Corruption → 시들기 변환)' },
        { skill: skillData.unstableAffliction, desc: '불안정한 고통을 최대 5중첩 유지합니다' },
        { skill: skillData.haunt, desc: '유령 출몰을 재사용 대기시간마다 사용합니다 (15초, 대상 피해 12% 증가)' },
        { skill: skillData.soulRot, desc: '영혼 부식을 재사용 대기시간마다 사용합니다 (1분)' },
        { skill: skillData.phantomSingularity, desc: '유령 특이점을 재사용 대기시간마다 사용합니다 (45초)' },
        { skill: skillData.summonDarkglare, desc: '암흑시선 소환을 DoT가 최대일 때 사용합니다 (2분, 지속 피해지속시간 8초 연장)' },
        { skill: skillData.maleficRapture, desc: '환희 구간 (60초마다)에 영혼의 조각 5개를 모아 연속 사용합니다. 지옥소환사는 특정 버스트 윈도우에 저장해서 사용합니다.' },
        { skill: skillData.drainSoul, desc: '영혼 흡수를 필러로 사용합니다 (20% 이하에서 피해 2배)' }
      ]
    },
    aoe: {
      opener: [
        skillData.haunt,
        skillData.seedOfCorruption,
        skillData.agony,
        skillData.vileTaint,
        skillData.soulRot,
        skillData.summonDarkglare,
        skillData.maleficRapture
      ],
      priority: [
        { skill: skillData.agony, desc: '고통을 최대 8개 대상까지 유지합니다' },
        { skill: skillData.seedOfCorruption, desc: '부패의 씨앗으로 시들기를 빠르게 확산시킵니다 (지옥소환사는 시들기 자동 적용)' },
        { skill: skillData.vileTaint, desc: '사악한 타락을 재사용 대기시간마다 사용합니다 (30초, 최대 8 대상)' },
        { skill: skillData.soulRot, desc: '영혼 부식을 재사용 대기시간마다 사용합니다 (최대 5 대상)' },
        { skill: skillData.summonDarkglare, desc: '암흑시선 소환을 DoT가 최대일 때 사용합니다' },
        { skill: skillData.maleficRapture, desc: '사악한 환희로 모든 DoT를 폭발시킵니다 (DoT 하나당 피해 증가)' },
        { skill: skillData.drainSoul, desc: '영혼 흡수를 필러로 사용합니다' }
      ]
    }
  }
});


// SkillIcon을 컴포넌트 외부에서 정의
const SkillIconComponent = ({ skill, size = 'medium', showTooltip = true, className = '', textOnly = false }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const iconRef = useRef(null);

  // wowhead 데이터베이스에서 스킬 정보 가져오기
  const getEnhancedSkillData = () => {
    if (!skill) return null;

    // wowhead 설명 찾기
    const wowheadInfo = wowheadDescriptions[skill.id] ||
                        wowheadDescriptions[skill.koreanName] ||
                        wowheadDescriptions[skill.englishName];

    // 데이터 병합
    return {
      ...skill,
      koreanName: skill.name || skill.koreanName,
      englishName: skill.englishName,
      description: wowheadInfo?.description || skill.description,
      cooldown: wowheadInfo?.cooldown || skill.cooldown,
      castTime: wowheadInfo?.castTime || skill.castTime,
      range: wowheadInfo?.range || skill.range,
      resourceCost: wowheadInfo?.resourceCost || skill.resourceCost,
      resourceGain: wowheadInfo?.resourceGain || skill.resourceGain,
      type: wowheadInfo?.type || skill.type,
      spec: wowheadInfo?.spec || skill.spec
    };
  };

  const enhancedSkill = getEnhancedSkillData();
  if (!enhancedSkill) return null;

  const sizeMap = {
    small: '24px',
    medium: '36px',
    large: '48px'
  };

  // 액티브/패시브에 따른 색상 구분
  const getSkillColor = () => {
    if (enhancedSkill.type === 'passive' || enhancedSkill.type === '지속 효과') {
      return '#94a3b8'; // 밝은 회색 - 패시브 스킬
    } else if (enhancedSkill.type === 'talent' || enhancedSkill.type === '특성') {
      return '#22c55e'; // 녹색 - 특성
    }
    return '#AAD372'; // 기본 색상 - 액티브 스킬
  };

  const getTooltipPortal = () => {
    let portal = document.getElementById('tooltip-portal');
    if (!portal) {
      portal = document.createElement('div');
      portal.id = 'tooltip-portal';
      document.body.appendChild(portal);
    }
    return portal;
  };

  const Tooltip = () => {
    if (!isTooltipVisible || !iconRef.current) return null;

    const rect = iconRef.current.getBoundingClientRect();
    const tooltipWidth = 350;
    const tooltipHeight = 280;

    // 화면 경계 체크
    let top = rect.top - tooltipHeight - 10;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // 상단 경계 체크
    if (top < 10) {
      top = rect.bottom + 10;
    }

    // 좌우 경계 체크
    if (left < 10) {
      left = 10;
    } else if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }

    const tooltipStyle = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      backgroundColor: 'rgba(26, 26, 46, 0.98)',
      backgroundImage: 'linear-gradient(135deg, rgba(170, 211, 114, 0.1) 0%, transparent 50%)',
      border: '2px solid #AAD372',
      borderRadius: '10px',
      padding: '16px',
      zIndex: 10000,
      width: `${tooltipWidth}px`,
      pointerEvents: 'none',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9), 0 0 20px rgba(170, 211, 114, 0.2)',
      animation: 'fadeIn 0.2s ease-in-out'
    };

    return ReactDOM.createPortal(
      <div style={tooltipStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(170, 211, 114, 0.2)'
        }}>
          <div style={{
            padding: '4px',
            background: 'linear-gradient(135deg, rgba(170, 211, 114, 0.2), transparent)',
            borderRadius: '8px',
            border: '1px solid rgba(170, 211, 114, 0.3)'
          }}>
            <img
              src={`https://wow.zamimg.com/images/wow/icons/large/${enhancedSkill.icon}.jpg`}
              alt={enhancedSkill.koreanName}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '6px',
                display: 'block'
              }}
              onError={(e) => {
                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              color: '#AAD372',
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '2px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              {enhancedSkill.koreanName}
            </div>
            {enhancedSkill.englishName && (
              <div style={{ color: '#999', fontSize: '12px', fontStyle: 'italic' }}>
                {enhancedSkill.englishName}
              </div>
            )}
            {enhancedSkill.type && (
              <div style={{
                color: getSkillColor(),
                fontSize: '11px',
                marginTop: '2px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {enhancedSkill.type} {enhancedSkill.spec && enhancedSkill.spec !== '공용' && `• ${enhancedSkill.spec}`}
              </div>
            )}
          </div>
        </div>

        {enhancedSkill.description && (
          <div style={{
            color: '#d8d8d8',
            fontSize: '13px',
            lineHeight: '1.7',
            marginBottom: '12px',
            textAlign: 'justify'
          }}>
            {enhancedSkill.description}
          </div>
        )}

        {(enhancedSkill.cooldown || enhancedSkill.castTime || enhancedSkill.range ||
          enhancedSkill.resourceCost || enhancedSkill.resourceGain) && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            padding: '10px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px' }}>
              {enhancedSkill.castTime && (
                <>
                  <span style={{ color: '#AAD372', fontWeight: 'bold' }}>시전 시간:</span>
                  <span style={{ color: '#e0e0e0' }}>{enhancedSkill.castTime}</span>
                </>
              )}
              {enhancedSkill.cooldown && (
                <>
                  <span style={{ color: '#AAD372', fontWeight: 'bold' }}>재사용 대기시간:</span>
                  <span style={{ color: '#ffa500' }}>{enhancedSkill.cooldown}</span>
                </>
              )}
              {enhancedSkill.range && (
                <>
                  <span style={{ color: '#AAD372', fontWeight: 'bold' }}>사거리:</span>
                  <span style={{ color: '#e0e0e0' }}>{enhancedSkill.range}</span>
                </>
              )}
              {enhancedSkill.resourceCost && enhancedSkill.resourceCost !== '없음' && (
                <>
                  <span style={{ color: '#ef5350', fontWeight: 'bold' }}>소모:</span>
                  <span style={{ color: '#e0e0e0' }}>{enhancedSkill.resourceCost}</span>
                </>
              )}
              {enhancedSkill.resourceGain && enhancedSkill.resourceGain !== '없음' && (
                <>
                  <span style={{ color: '#4fc3f7', fontWeight: 'bold' }}>획득:</span>
                  <span style={{ color: '#e0e0e0' }}>{enhancedSkill.resourceGain}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>,
      getTooltipPortal()
    );
  };

  if (textOnly) {
    return (
      <span
        ref={iconRef}
        className={`${styles.skillText} ${className}`}
        style={{
          color: getSkillColor(),
          fontWeight: 'bold',
          cursor: 'pointer',
          borderBottom: `1px dotted ${getSkillColor()}`,
          textShadow: skill.type === 'passive' ? 'none' : '0 0 4px rgba(170, 211, 114, 0.3)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        {enhancedSkill.koreanName}
        {showTooltip && <Tooltip />}
      </span>
    );
  }

  return (
    <>
      <div
        ref={iconRef}
        className={`${styles.skillIcon} ${className}`}
        style={{
          display: 'inline-block',
          width: sizeMap[size],
          height: sizeMap[size],
          position: 'relative',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        <img
          src={`https://wow.zamimg.com/images/wow/icons/large/${enhancedSkill.icon}.jpg`}
          alt={enhancedSkill.koreanName}
          style={{
            width: '100%',
            height: '100%',
            border: `2px solid ${getSkillColor()}`,
            borderRadius: '4px',
            opacity: enhancedSkill.type === 'passive' || enhancedSkill.type === '지속 효과' ? 0.85 : 1,
            boxShadow: enhancedSkill.type === 'passive' || enhancedSkill.type === '지속 효과' ? 'none' : '0 0 8px rgba(170, 211, 114, 0.4)',
            transition: 'all 0.2s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
          }}
        />
      </div>
      {showTooltip && <Tooltip />}
    </>
  );
};

const AfflictionWarlockGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [selectedTier, setSelectedTier] = useState('hellcaller');
  const [showToast, setShowToast] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState('mythic-plus');
  const [selectedStatHero, setSelectedStatHero] = useState('hellcaller');
  const [selectedStatMode, setSelectedStatMode] = useState('single');

  // 수동 가이드 업데이트 함수 (외부에서 호출 가능)
  const updateGuideData = (newData) => {
    console.log('📝 수동 가이드 업데이트 수신:', newData);

    // 업데이트 알림 표시
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);

    // 데이터 업데이트 처리
    moduleEventBus.emit('guide-data-update', {
      spec: 'hunter-beast-mastery',
      data: newData,
      timestamp: new Date().toISOString()
    });

    // 필요한 상태 업데이트
    if (newData.talents) {
      // 탤런트 관련 업데이트
      console.log('특성 빌드 업데이트');
    }
    if (newData.rotation) {
      // 로테이션 관련 업데이트
      console.log('딜사이클 업데이트');
    }
    if (newData.stats) {
      // 스탯 관련 업데이트
      console.log('스탯 우선순위 업데이트');
    }
  };

  // 전역 객체에 업데이트 함수 노출 (디버깅/개발용)
  React.useEffect(() => {
    window.updateDevastationEvokerGuide = updateGuideData;
    return () => {
      delete window.updateDevastationEvokerGuide;
    };
  }, []);

  // SkillIcon을 내부에서 사용할 수 있도록 설정
  const SkillIcon = SkillIconComponent;

  const sectionRefs = {
    overview: useRef(null),
    rotation: useRef(null),
    builds: useRef(null),
    stats: useRef(null),
  };

  const subSectionRefs = {
    // 개요 서브섹션
    'overview-intro': useRef(null),
    'overview-resource': useRef(null),
    // 딜사이클 서브섹션
    'rotation-tier': useRef(null),
    'rotation-single': useRef(null),
    'rotation-aoe': useRef(null),
    // 특성 서브섹션
    'builds-talents': useRef(null),
    // 스탯 서브섹션
    'stats-priority': useRef(null),
    'stats-simc': useRef(null),
  };

  // 유기적 모듈 초기화 및 연결
  useEffect(() => {
    // 모듈 등록
    moduleEventBus.registerModule('devastationEvokerGuide', {
      name: 'Devastation Evoker Guide',
      version: '2.0.0',
      spec: 'hunter-beast-mastery'
    });

    // 외부 가이드 수집 - 자동 동기화 비활성화
    // 수동으로만 업데이트 (필요시 호출)
    // externalGuideCollector.collectAllGuides('hunter-beast-mastery');

    // 실시간 업데이트 구독
    const handleGuideUpdate = (update) => {
      console.log('📡 Guide updated:', update);

      // 토스트 알림 표시
      if (update.type === 'update' && update.differences.length > 0) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }

      // 중요 업데이트인 경우 데이터 갱신
      if (update.differences.some(d => d.priority === 'high')) {
        // 여기서 필요한 상태 업데이트 수행
        moduleEventBus.emit('refresh-guide-data', {
          spec: 'hunter-beast-mastery'
        });
      }
    };

    realtimeGuideUpdater.subscribe('hunter-beast-mastery', handleGuideUpdate);

    // 학습 AI 시작
    learningAIPatternAnalyzer.startLearning();

    // AI 추천 리스너
    const handleAIRecommendations = (recommendations) => {
      console.log('🤖 AI Recommendations:', recommendations);
      // 추천사항을 UI에 반영
    };

    moduleEventBus.on('ai-recommendations', handleAIRecommendations);

    // 플레이어 액션 트래킹
    const trackPlayerAction = (action) => {
      moduleEventBus.emit('player-action', {
        type: 'guide-interaction',
        skill: action.skill,
        timestamp: Date.now()
      });
    };

    // 가이드 상호작용 트래킹
    const trackGuideUsage = (section) => {
      moduleEventBus.emit('guide-interaction', {
        section,
        action: 'view',
        duration: 0,
        spec: 'hunter-beast-mastery'
      });
    };

    // 클린업
    return () => {
      realtimeGuideUpdater.unsubscribe('hunter-beast-mastery', handleGuideUpdate);
      moduleEventBus.off('ai-recommendations', handleAIRecommendations);
    };
  }, []);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // 페이지 끝에 도달했는지 확인
      const isAtBottom = scrollPosition + windowHeight >= fullHeight - 100;

      if (isAtBottom) {
        // 페이지 끝에 도달하면 마지막 섹션 활성화
        setActiveSection('stats');
        const statsSubSections = Object.keys(subSectionRefs).filter(key => key.startsWith('stats-'));
        if (statsSubSections.length > 0) {
          setActiveSubSection(statsSubSections[statsSubSections.length - 1]);
        }
      } else {
        // 메인 섹션 확인
        let currentSection = 'overview';
        Object.keys(sectionRefs).forEach(key => {
          const element = sectionRefs[key]?.current;
          if (element) {
            const { offsetTop } = element;
            if (scrollPosition >= offsetTop - 10) {
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
      }
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

  // Class 페이지의 모든 렌더링 함수들을 Guide 레이아웃에 맞춰 렌더링
  const renderOverview = () => (
    <Section ref={sectionRefs.overview} id="overview">
      <SectionHeader>
        <SectionTitle>개요</SectionTitle>
      </SectionHeader>
      <Card>
        <div className={styles.subsection} ref={subSectionRefs['overview-intro']}>
          <h3 className={styles.subsectionTitle}>고통 흑마법사 개요</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            고통 흑마법사는 <strong style={{ color: '#9482C9' }}>지속 피해 (DoT) 효과를 통해 적을 서서히 약화시키는</strong> 전문화입니다.
            TWW 시즌3에서는 <span style={{ color: '#8B00FF', fontWeight: 'bold' }}>지옥소환사</span> 영웅특성이
            모든 콘텐츠 (단일, 광역, 레이드, 쐐기)에서 최적의 성능을 보이며,
            <span style={{ color: '#32CD32', fontWeight: 'bold' }}>영혼 수확자</span>는 약간 뒤처지지만 여전히 사용 가능한 선택지입니다.
          </p>

          <h3 className={styles.subsectionTitle} style={{ marginTop: '30px' }}>딜링 메커니즘</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            고통 흑마법사는 <strong style={{ color: '#9482C9' }}>여러 DoT를 유지하고 영혼의 조각을 관리하여 강력한 버스트 딜을 발휘하는</strong> 전문화입니다.
            대부분의 피해는 지속 피해효과들이 담당하며, 핵심 메커니즘은 {' '}
            <SkillIcon skill={skillData.agony} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.agony} textOnly={true} />, {' '}
            <SkillIcon skill={skillData.corruption} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.corruption} textOnly={true} />, {' '}
            <SkillIcon skill={skillData.unstableAffliction} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.unstableAffliction} textOnly={true} />로 DoT를 유지하고, {' '}
            <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.maleficRapture} textOnly={true} />로 모든 DoT를 폭발시켜 버스트 딜을 내는 것입니다.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            핵심 시너지는 <strong style={{ color: '#ffa500' }}>환희 구간 (60초마다)</strong>에 {' '}
            영혼의 조각 5개를 모아두고, {' '}
            <SkillIcon skill={skillData.summonDarkglare} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.summonDarkglare} textOnly={true} />로 지속 피해지속시간을 8초 연장한 후, {' '}
            <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.maleficRapture} textOnly={true} />를 연속으로 사용하는 것입니다.
            <SkillIcon skill={skillData.haunt} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.haunt} textOnly={true} />와
            <SkillIcon skill={skillData.soulRot} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.soulRot} textOnly={true} /> 같은
            쿨다운 스킬이 추가 피해와 리소스를 제공합니다.
          </p>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>핵심 스킬</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {[
              { skill: skillData.agony, label: 'DoT (18초)' },
              { skill: skillData.corruption, label: 'DoT (14초)' },
              { skill: skillData.unstableAffliction, label: 'DoT (8초, 5중첩)' },
              { skill: skillData.maleficRapture, label: '영혼의 조각 1개' },
              { skill: skillData.summonDarkglare, label: skillData.summonDarkglare.cooldown },
              { skill: skillData.haunt, label: skillData.haunt.cooldown },
              { skill: skillData.drainSoul, label: '영혼의 조각 생성' },
              { skill: skillData.seedOfCorruption, label: '광역 확산' }
            ].map(({ skill, label }) => (
              <div key={skill.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <SkillIcon skill={skill} size="medium" />
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    <SkillIcon skill={skill} textOnly={true} />
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, color: label.includes('생성') ? '#32CD32' : label.includes('조각') ? '#9482C9' : '#ffa500' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          <h4 ref={subSectionRefs['overview-resource']} style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>리소스 시스템</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li>주 자원: <span style={{ color: '#9482C9', fontWeight: 'bold' }}>영혼의 조각</span> - 최대 5개까지 보유 가능</li>
            <li>리소스 생성:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li>
                  <SkillIcon skill={skillData.agony} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.agony} textOnly={true} /> - 지속 피해피해 발생 시 확률적으로 1개 생성
                </li>
                <li>
                  <SkillIcon skill={skillData.drainSoul} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.drainSoul} textOnly={true} /> - 대상 처치 시 1개 생성
                </li>
                <li>
                  <SkillIcon skill={skillData.shadowBolt} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.shadowBolt} textOnly={true} /> - 영혼의 조각 파편 생성 (누적 시 1개로 전환)
                </li>
                <li>
                  <SkillIcon skill={skillData.soulRot} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.soulRot} textOnly={true} /> - Soul Harvester 특성 시 즉시 3개 생성
                </li>
              </ul>
            </li>
            <li>리소스 소비:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li>
                  <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.maleficRapture} textOnly={true} /> - 1개 소비, 모든 지속 피해폭발
                </li>
                <li>
                  <SkillIcon skill={skillData.unstableAffliction} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.unstableAffliction} textOnly={true} /> - 1개 소비, 강력한 지속 피해적용
                </li>
                <li>
                  <SkillIcon skill={skillData.seedOfCorruption} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.seedOfCorruption} textOnly={true} /> - 1개 소비, 광역 지속 피해확산
                </li>
                <li>
                  <SkillIcon skill={skillData.vileTaint} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.vileTaint} textOnly={true} /> - 1개 소비, 광역 지속 피해및 디버프
                </li>
              </ul>
            </li>
            <li><strong style={{ color: '#ffa500' }}>핵심 전략:</strong> 60초마다 영혼의 조각 5개를 모아 환희 구간를 만들어 연속 {' '}
              <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} />
              <SkillIcon skill={skillData.maleficRapture} textOnly={true} /> 사용
            </li>
            <li><strong style={{ color: '#ff6b6b' }}>주의:</strong> 영혼의 조각이 5개에 도달하면 추가 생성이 낭비되므로, 적절히 소비하여 오버캡 방지</li>
          </ul>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginTop: '25px', marginBottom: '15px' }}>주요 메커니즘</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li><strong style={{ color: '#9482C9' }}>DoT 관리 (지속시간 보존 갱신):</strong> 지속 피해지속시간이 남은 시간 30% 이하일 때 갱신하면 남은 시간이 보존되며 최대 효율을 냅니다</li>
            <li><strong style={{ color: '#ff6b6b' }}>환희 구간:</strong> 60초마다 영혼의 조각 5개를 모아두고, {' '}
              <SkillIcon skill={skillData.summonDarkglare} size="small" className={styles.inlineIcon} />
              <SkillIcon skill={skillData.summonDarkglare} textOnly={true} /> 후 연속 {' '}
              <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} />
              <SkillIcon skill={skillData.maleficRapture} textOnly={true} /> 사용
            </li>
            <li><strong style={{ color: '#ffa500' }}>DoT 연장:</strong> {' '}
              <SkillIcon skill={skillData.summonDarkglare} size="small" className={styles.inlineIcon} />
              <SkillIcon skill={skillData.summonDarkglare} textOnly={true} />는 모든 지속 피해지속시간을 8초 연장하여 버스트 윈도우 극대화
            </li>
            <li>
              <strong style={{ color: '#32CD32' }}>
                <SkillIcon skill={skillData.nightfall} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.nightfall} textOnly={true} />/
                <SkillIcon skill={skillData.tormentedCrescendo} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.tormentedCrescendo} textOnly={true} />:
              </strong> 특성 발동 시 즉시 활용하여 추가 영혼의 조각 생성 및 피해 증가
            </li>
          </ul>
        </div>
      </Card>
    </Section>
  );


  const renderRotation = () => (
    <Section ref={sectionRefs.rotation} id="rotation">
      <SectionHeader>
        <SectionTitle>딜사이클</SectionTitle>
      </SectionHeader>

      <HeroCard heroType={selectedTier}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>영웅특성별 딜사이클</h2>

          {/* 영웅특성 선택 탭 */}
          <div className={styles.tierTabs} style={{ marginBottom: '30px' }}>
            <button
              className={`${styles.tierTab} ${selectedTier === 'hellcaller' ? styles.active : ''}`}
              onClick={() => setSelectedTier('hellcaller')}
            >
              <span className={styles.tierIcon}>🔥</span> 지옥소환사
            </button>
            <button
              className={`${styles.tierTab} ${selectedTier === 'soulHarvester' ? styles.active : ''}`}
              onClick={() => setSelectedTier('soulHarvester')}
            >
              <span className={styles.tierIcon}>💀</span> 영혼 수확자
            </button>
          </div>

          {/* 티어 세트 효과 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-tier']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'hellcaller' ? '#FF6347' : '#9482C9'
            }}>티어 세트 효과</h3>
            <div className={styles.tierBonuses} style={{
              background: selectedTier === 'hellcaller'
                ? 'linear-gradient(135deg, rgba(255, 99, 71, 0.1), rgba(255, 99, 71, 0.05))'
                : 'linear-gradient(135deg, rgba(148, 130, 201, 0.1), rgba(148, 130, 201, 0.05))',
              padding: '1.5rem',
              borderRadius: '8px',
              border: selectedTier === 'hellcaller'
                ? '1px solid rgba(255, 99, 71, 0.3)'
                : '1px solid rgba(148, 130, 201, 0.3)'
            }}>
              <div className={styles.bonusItem} style={{
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <span className={styles.bonusLabel} style={{
                  color: '#ffa500',
                  fontWeight: 'bold',
                  minWidth: '60px',
                  flexShrink: 0
                }}>2세트:</span>
                <span className={styles.bonusDescription} style={{
                  lineHeight: '1.8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  flexWrap: 'wrap'
                }}>
                  {currentContent.tierSet['2set']}
                </span>
              </div>
              <div className={styles.bonusItem} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <span className={styles.bonusLabel} style={{
                  color: '#ffa500',
                  fontWeight: 'bold',
                  minWidth: '60px',
                  flexShrink: 0
                }}>4세트:</span>
                <span className={styles.bonusDescription} style={{
                  lineHeight: '1.8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  flexWrap: 'wrap'
                }}>
                  {currentContent.tierSet['4set']}
                </span>
              </div>
            </div>
          </div>

          {/* 영웅 특성별 딜링 메커니즘 변화 */}
          <div className={styles.subsection} style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '1.5rem',
            border: selectedTier === 'hellcaller'
              ? '1px solid rgba(148, 130, 201, 0.3)'
              : '1px solid rgba(50, 205, 50, 0.3)'
          }}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'hellcaller' ? '#9482C9' : '#32CD32'
            }}>영웅 특성 딜링 메커니즘</h3>

            {selectedTier === 'hellcaller' ? (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#8B00FF' }}>지옥소환사</strong>는 {' '}
                  <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.wither} textOnly={true} />와 {' '}
                  <strong style={{ color: '#ffa500' }}>악의 버프</strong>를 통해
                  모든 콘텐츠에서 최고의 성능을 발휘합니다.
                  TWW 시즌3의 메타 최적 영웅 특성으로, 티어 세트와 결합 시
                  단일 대상과 광역 모두에서 압도적인 딜을 제공합니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#8B00FF', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.wither} textOnly={true} /> 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li><strong style={{ color: '#ff6b6b' }}>자동 변환</strong>: {' '}
                      <SkillIcon skill={skillData.corruption} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.corruption} textOnly={true} />가 자동으로 {' '}
                      <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.wither} textOnly={true} />로 변환됩니다
                    </li>
                    <li><strong style={{ color: '#ffa500' }}>스택 효과</strong>: {' '}
                      <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.wither} textOnly={true} />는 중첩될 때마다 피해가 증가합니다
                    </li>
                    <li><strong style={{ color: '#9482C9' }}>티어 2세트</strong>: {' '}
                      <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.wither} textOnly={true} /> 피해 증가 및 스택 효과 강화
                    </li>
                    <li><strong style={{ color: '#FFD700' }}>티어 4세트</strong>: {' '}
                      <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.wither} textOnly={true} /> 최대 스택 시 추가 효과 발동 및 영혼의 조각 생성
                    </li>
                  </ul>
                  <p style={{ color: '#e0e0e0', fontSize: '0.95rem' }}>
                    <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.wither} textOnly={true} />는 일반 {' '}
                    <SkillIcon skill={skillData.corruption} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.corruption} textOnly={true} />보다 훨씬 강력하며, {' '}
                    스택을 최대로 유지하는 것이 핵심입니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#9482C9', fontSize: '1.1rem', marginBottom: '15px' }}>
                    악의 버프 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>버프 발동</strong>: 특정 스킬 사용 시 악의 버프 활성화
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>피해 증폭</strong>: 대상이 받는 지속 피해피해 12% 증가
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>버스트 타이밍</strong>: 악의 활성 중 {' '}
                      <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.maleficRapture} textOnly={true} /> 집중 사용
                    </li>
                    <li>
                      <strong>장신구/물약 조합</strong>: 악의 + {' '}
                      <SkillIcon skill={skillData.summonDarkglare} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.summonDarkglare} textOnly={true} /> 동시 사용
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: 환희 구간 (60초)에 악의 버프와 {' '}
                    <SkillIcon skill={skillData.summonDarkglare} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.summonDarkglare} textOnly={true} />를 동시에 활용하여 극대화 딜을 뽑으세요.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>
                        <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                        <SkillIcon skill={skillData.wither} textOnly={true} /> 스택 유지
                      </strong>: 최대 스택 달성을 최우선 목표로 설정
                    </li>
                    <li>
                      <strong style={{ color: '#9482C9' }}>버스트 윈도우</strong>: 악의 + Darkglare 조합으로 극대화
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>영혼의 조각 관리</strong>: 버스트 전 5개 확보 필수
                    </li>
                    <li>모든 콘텐츠 (레이드/쐐기/단일/광역)에서 최고 성능</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#32CD32' }}>영혼 수확자</strong>는 {' '}
                  <strong style={{ color: '#32CD32' }}>죽음의 그림자</strong>와 {' '}
                  <SkillIcon skill={skillData.nightfall} size="small" className={styles.inlineIcon} />
                  <strong style={{ color: '#ffa500' }}>
                    <SkillIcon skill={skillData.nightfall} textOnly={true} /> 프록
                  </strong>을 통해
                  지옥소환사보다 약간 뒤처지지만 여전히 사용 가능한 선택지입니다.
                  <SkillIcon skill={skillData.soulRot} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.soulRot} textOnly={true} /> 사용 시 즉시 3개의 영혼의 조각를 생성하여
                  버스트 윈도우에서 강력한 딜을 제공합니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#32CD32', fontSize: '1.1rem', marginBottom: '15px' }}>
                    죽음의 그림자 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>적 처치 효과</strong>: DoT가 걸린 적이 죽을 때 추가 영혼의 조각 생성
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>티어 2세트</strong>: 죽음의 그림자 능력 강화
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>티어 4세트</strong>: 악마의 영혼 피해 45% 증가 (티어 효과는 오타로 악마의 영혼 대신 지속 피해피해 증가)
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>쐐기돌 최적화</strong>: 잦은 몹 처치로 리소스 지속 확보
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: 쐐기돌 던전에서 죽음의 그림자로 리소스를 지속적으로 확보하여 {' '}
                    <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.maleficRapture} textOnly={true} /> 스팸이 가능합니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#9482C9', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.nightfall} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.nightfall} textOnly={true} /> 프록 시스템
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>무작위 발동</strong>: 지속 피해피해 발생 시 {' '}
                      <SkillIcon skill={skillData.nightfall} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.nightfall} textOnly={true} /> 버프 활성화 가능
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>즉시 시전</strong>: {' '}
                      <SkillIcon skill={skillData.nightfall} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.nightfall} textOnly={true} /> 발동 시 다음 {' '}
                      <SkillIcon skill={skillData.shadowBolt} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.shadowBolt} textOnly={true} /> 즉시 시전
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>추가 피해</strong>: {' '}
                      <SkillIcon skill={skillData.nightfall} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.nightfall} textOnly={true} /> 버프로 강화된 {' '}
                      <SkillIcon skill={skillData.shadowBolt} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.shadowBolt} textOnly={true} />는 피해량 대폭 증가
                    </li>
                    <li>
                      <strong style={{ color: '#9482C9' }}>티어 4세트</strong>: {' '}
                      <SkillIcon skill={skillData.nightfall} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.nightfall} textOnly={true} /> 발동 시 추가 효과 제공
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>
                        <SkillIcon skill={skillData.soulRot} size="small" className={styles.inlineIcon} />
                        <SkillIcon skill={skillData.soulRot} textOnly={true} /> 활용
                      </strong>: 즉시 3 영혼의 조각 생성으로 버스트 준비
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>
                        <SkillIcon skill={skillData.nightfall} size="small" className={styles.inlineIcon} />
                        <SkillIcon skill={skillData.nightfall} textOnly={true} /> 프록 관리
                      </strong>: 발동 즉시 {' '}
                      <SkillIcon skill={skillData.shadowBolt} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.shadowBolt} textOnly={true} /> 사용
                    </li>
                    <li>
                      <strong style={{ color: '#9482C9' }}>쐐기돌 특화</strong>: 죽음의 그림자로 지속적인 리소스 확보
                    </li>
                    <li>지옥소환사보다 약간 낮은 성능, 하지만 여전히 사용 가능</li>
                  </ul>
                </div>
              </>
            )}

            <div style={{
              background: 'rgba(170, 211, 114, 0.1)',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <p style={{ color: selectedTier === 'hellcaller' ? '#9482C9' : '#32CD32', fontSize: '0.95rem', margin: 0 }}>
                <strong>💡 추천 콘텐츠:</strong> {' '}
                {selectedTier === 'hellcaller' ?
                  '단일 보스 레이드, 버스트 타이밍이 중요한 전투' :
                  '쐐기돌 던전, 지속 딜이 필요한 레이드'}
              </p>
            </div>
          </div>

          {/* 단일 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-single']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'hellcaller' ? '#9482C9' : '#32CD32',
              marginTop: '1.5rem'
            }}>단일 대상</h3>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>오프닝 시퀀스</h4>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '10px' }}>
                {selectedTier === 'hellcaller' ?
                  '⏱️ 전투 직전: 악마 소환 후 굴단의 손으로 버스트 준비' :
                  '⏱️ 전투 직전: 핵심 메커니즘로 악마 강화 준비'}
              </p>
              <div className={styles.skillSequence}>
                {currentContent.singleTarget.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <span className={styles.arrow}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              {selectedTier === 'hellcaller' && (
                <p style={{ fontSize: '0.85rem', color: '#9482C9', marginTop: '10px' }}>
                  💡 팁: 악마 폭군은 가능한 많은 악마를 소환한 후 사용
                </p>
              )}
            </div>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>스킬 우선순위</h4>
            <ol className={styles.priorityListWow}>
              {currentContent.singleTarget.priority.map((item, index) => (
                <li key={index}>
                  <span className={styles.priorityNumber}>{index + 1}.</span>
                  <SkillIcon skill={item.skill} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={item.skill} textOnly={true} /> - {item.desc}
                </li>
              ))}
            </ol>
          </div>

          {/* 광역 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-aoe']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'hellcaller' ? '#9482C9' : '#32CD32',
              marginTop: '1.5rem'
            }}>광역 대상 (3+ 타겟)</h3>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>오프닝 시퀀스</h4>
            <div className={styles.openerSequence}>
              <div className={styles.skillSequence}>
                {currentContent.aoe.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <span className={styles.arrow}>→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>스킬 우선순위</h4>
            <ol className={styles.priorityListWow}>
              {currentContent.aoe.priority.map((item, index) => (
                <li key={index}>
                  <span className={styles.priorityNumber}>{index + 1}.</span>
                  <SkillIcon skill={item.skill} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={item.skill} textOnly={true} /> - {item.desc}
                </li>
              ))}
            </ol>
          </div>

          {/* 심화 분석 섹션 추가 */}
          <div className={styles.subsection} style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '1.5rem',
            border: '1px solid rgba(170, 211, 114, 0.2)'
          }}>
            <h3 className={styles.subsectionTitle}>심화 분석</h3>

            {selectedTier === 'hellcaller' ? (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#8B00FF', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.wither} textOnly={true} /> 메커니즘 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>자동 변환:</strong> {' '}
                      <SkillIcon skill={skillData.corruption} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.corruption} textOnly={true} />이 자동으로 {' '}
                      <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.wither} textOnly={true} />로 변환됩니다
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>스택 관리:</strong> 대상에게 중첩 효과 부여 (최대 8중첩)
                    </li>
                    <li>
                      <strong style={{ color: '#9482C9' }}>피해 증가:</strong> 스택당 피해량 증가
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>핵심:</strong> 최대 중첩 유지가 딜 극대화의 핵심
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🎯 악의 버프 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>버프 발동:</strong> {' '}
                      <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.wither} textOnly={true} /> 스택 최대 시 악의 버프 획득
                    </li>
                    <li>
                      <strong>버프 효과:</strong> 모든 지속 피해 효과 피해량 증가
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>활용:</strong> 버프 활성 중 {' '}
                      <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.maleficRapture} textOnly={true} /> 연속 사용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#28a745', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🔥 {' '}
                    <SkillIcon skill={skillData.summonDarkglare} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.summonDarkglare} textOnly={true} /> 타이밍 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>준비 단계:</strong> 모든 DoT 최대 중첩 유지
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>최적 타이밍:</strong> {' '}
                      <SkillIcon skill={skillData.agony} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.agony} textOnly={true} />, {' '}
                      <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.wither} textOnly={true} />, {' '}
                      <SkillIcon skill={skillData.unstableAffliction} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.unstableAffliction} textOnly={true} /> 모두 활성 상태
                    </li>
                    <li>
                      <strong>DoT 연장:</strong> 모든 지속 피해 효과 지속시간 8초 연장
                    </li>
                    <li>
                      <strong>장신구 조합:</strong> 쿨기 장신구/물약과 함께 사용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚠️ 영혼의 조각 효율 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>5개 상태:</strong> {' '}
                      <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.maleficRapture} textOnly={true} /> 즉시 사용 (손실 방지)
                    </li>
                    <li>
                      <strong>환희 구간:</strong> 60초마다 조각 5개 모아서 연속 사용
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>이상적 유지:</strong> 2~3개 구간에서 관리
                    </li>
                    <li>
                      <strong>티어 4세트:</strong> {' '}
                      <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.wither} textOnly={true} /> 최대 중첩 시 조각 생성 효율 증가
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    💨 {' '}
                    <SkillIcon skill={skillData.haunt} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.haunt} textOnly={true} /> 활용 (핵심 스킬)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>재사용 대기시간: 15초</li>
                    <li>대상 피해 증가: 12% (18초)</li>
                    <li>영혼의 조각 1개 생성</li>
                    <li><strong style={{ color: '#ffa500' }}>추천:</strong> 재사용 대기시간마다 즉시 사용</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ 버스트 윈도우 극대화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>타이밍 순서:</strong> 모든 DoT 최대 → {' '}
                      <SkillIcon skill={skillData.summonDarkglare} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.summonDarkglare} textOnly={true} /> → 악의 버프 획득
                    </li>
                    <li>
                      <strong>환희 버스트:</strong> 영혼의 조각 5개 모아서 {' '}
                      <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.maleficRapture} textOnly={true} /> 연속 사용
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>DoT 폭발:</strong> 각 DoT가 걸린 대상마다 피해 증가
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#32CD32', fontSize: '1.2rem', marginBottom: '15px' }}>
                    🔥 {' '}
                    <SkillIcon skill={skillData.soulRot} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.soulRot} textOnly={true} /> 활용 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>최우선 쿨기:</strong> 재사용 대기시간마다 즉시 사용 (1분)
                    </li>
                    <li>
                      <strong>영혼 수확자 특화:</strong> 3개 영혼의 조각 즉시 생성
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>광역 효과:</strong> 최대 5 타겟 동시 피해
                    </li>
                    <li>
                      <strong>생존력:</strong> 입힌 피해의 50% 생명력 회복
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#DC3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.summonDarkglare} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.summonDarkglare} textOnly={true} /> 타이밍 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>준비:</strong> 모든 DoT 최대 중첩 유지
                    </li>
                    <li>
                      <strong>DoT 연장:</strong> 모든 지속 피해 효과 8초 추가
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심:</strong> {' '}
                      <SkillIcon skill={skillData.soulRot} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.soulRot} textOnly={true} />와 조합하여 극대화
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#9b59b6', fontSize: '1.2rem', marginBottom: '15px' }}>
                    ⚡ {' '}
                    <SkillIcon skill={skillData.nightfall} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.nightfall} textOnly={true} /> 프락 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>발동 조건:</strong> DoT 틱마다 발동 확률
                    </li>
                    <li>
                      <strong>즉시 시전:</strong> 프락 발동 시 {' '}
                      <SkillIcon skill={skillData.shadowBolt} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.shadowBolt} textOnly={true} /> 즉시 시전
                    </li>
                    <li>
                      <strong>티어 4세트:</strong> 프락 발동 시 추가 효과 부여
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff9800', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🎯 광역 전투 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>4+ 타겟:</strong> {' '}
                      <SkillIcon skill={skillData.seedOfCorruption} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.seedOfCorruption} textOnly={true} />로 DoT 빠르게 확산
                    </li>
                    <li>
                      <strong>DoT 우선순위:</strong> {' '}
                      <SkillIcon skill={skillData.agony} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.agony} textOnly={true} /> (8개까지) → {' '}
                      <SkillIcon skill={skillData.corruption} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.corruption} textOnly={true} /> 확산
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>광역 쿨기:</strong> {' '}
                      <SkillIcon skill={skillData.vileTaint} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.vileTaint} textOnly={true} /> (30초) → {' '}
                      <SkillIcon skill={skillData.soulRot} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.soulRot} textOnly={true} /> (1분)
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>버스트:</strong> {' '}
                      <SkillIcon skill={skillData.summonDarkglare} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.summonDarkglare} textOnly={true} /> → {' '}
                      <SkillIcon skill={skillData.maleficRapture} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.maleficRapture} textOnly={true} /> 연속 사용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🛡️ 생존력 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <SkillIcon skill={skillData.soulRot} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.soulRot} textOnly={true} /> - 피해의 50% 생명력 회복
                    </li>
                    <li>
                      <SkillIcon skill={skillData.darkPact} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.darkPact} textOnly={true} /> - 생명력 20% 희생하여 400% 보호막 (1분 쿨기)
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>추천:</strong> 큰 피해 예상 시 미리 사용
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </HeroCard>
    </Section>
  );

  // 특성 빌드 데이터
  const talentBuilds = {
    soulHarvester: {
      'raid-single': {
        name: '레이드 단일 대상',
        description: '영혼 수확자를 활용한 단일 대상 빌드입니다. 야밤의 징조과 죽음의 그림자로 강력한 버스트를 제공합니다.',
        code: 'CkQA3nhASxH0mA1W7o19gqSUREREREREhEJJBAAAAAAoEJJJRKJpFJJKhEAAAAA',
        icon: '💀'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '영혼 수확자를 활용한 광역 빌드입니다. 지속적인 지속 피해피해와 영혼의 조각 생성에 중점을 둡니다.',
        code: 'CkQA3nhASxH0mA1W7o19gqSUREREREREhEJJBAAAAAAoEJJJRKRSSShEAAAAA',
        icon: '💀'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '영혼 수확자를 활용한 신화+ 빌드입니다. 야밤의 징조 프록과 Soul Rot의 3 영혼의 조각 생성을 활용합니다.',
        code: 'CkQA3nhASxH0mA1W7o19gqSUREREREREhEJJBAAAAAAoEJRSSiUSSSSkEAAAAA',
        icon: '💀'
      }
    },
    hellcaller: {
      'raid-single': {
        name: '레이드 단일 대상',
        description: '지옥소환사를 활용한 단일 대상 빌드입니다. 시들기 변환과 악의 중첩으로 버스트를 강화합니다.',
        code: 'CkQA3nhASxH0mA1W7o19gqSUREREREREhEJJBAAAAAAIJJJJRSSSShkEAAAAA',
        icon: '🔥'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '지옥소환사를 활용한 광역 빌드입니다. 시들기의 광역 DoT와 악의로 광역 딜을 제공합니다.',
        code: 'CkQA3nhASxH0mA1W7o19gqSUREREREREhEJJBAAAAAAIJJRSSSiUSShEAAAAA',
        icon: '🔥'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '지옥소환사를 활용한 신화+ 빌드입니다. 시들기의 확산과 악의 관리로 지속적인 딜을 제공합니다.',
        code: 'CkQA3nhASxH0mA1W7o19gqSUREREREREhEJJBAAAAAAIRSSShUSSSSkEAAAAA',
        icon: '🔥'
      }
    }
  };

  const handleCopyBuild = (code) => {
    navigator.clipboard.writeText(code);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const renderBuilds = () => (
    <Section ref={sectionRefs.builds} id="builds">
      <SectionHeader>
        <SectionTitle>특성 빌드 추천</SectionTitle>
      </SectionHeader>

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'linear-gradient(135deg, #2a4330 0%, #1a1a2e 100%)',
          border: '2px solid #AAD372',
          borderRadius: '8px',
          padding: '16px 20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 20px rgba(170, 211, 114, 0.3)',
          zIndex: 10000,
          animation: 'slideInRight 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>✅</span>
          <div>
            <div style={{ color: '#AAD372', fontWeight: 'bold', marginBottom: '4px' }}>복사되었습니다</div>
            <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>특성 창에서 가져오기 버튼을 누르고 붙여넣으세요.</div>
          </div>
        </div>
      )}

      {/* 영웅 특성 선택 탭 */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          padding: '20px',
          borderBottom: '2px solid #1e2328'
        }}>
          <button
            onClick={() => {
              setSelectedTier('hellcaller');
              setSelectedBuild('mythic-plus');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'hellcaller' ?
                'linear-gradient(135deg, #8B4513 0%, #4a2511 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'hellcaller' ? '#FF6347' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'hellcaller' ? '#FF6347' : '#94a3b8',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🔥</span>
            <span>지옥소환사</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>메타 최적</span>
          </button>

          <button
            onClick={() => {
              setSelectedTier('soulHarvester');
              setSelectedBuild('raid-single');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'soulHarvester' ?
                'linear-gradient(135deg, #4a148c 0%, #2a0c56 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'soulHarvester' ? '#9482C9' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'soulHarvester' ? '#9482C9' : '#94a3b8',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>💀</span>
            <span>영혼 수확자</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>대안 빌드</span>
          </button>
        </div>

        {/* 빌드 선택 버튼들 */}
        <div style={{ padding: '20px' }}>
          <h4 style={{
            color: selectedTier === 'hellcaller' ? '#FF6347' : '#9482C9',
            marginBottom: '20px',
            fontSize: '1.3rem'
          }}>
            {selectedTier === 'hellcaller' ? '지옥소환사' : '영혼 수확자'} 특성 빌드
          </h4>

          {/* 빌드 목록 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {Object.entries(talentBuilds[selectedTier]).map(([key, build]) => (
              <div
                key={key}
                style={{
                  background: selectedBuild === key ?
                    'linear-gradient(135deg, rgba(170, 211, 114, 0.1) 0%, rgba(170, 211, 114, 0.05) 100%)' :
                    'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${selectedBuild === key ? '#AAD372' : '#2a2d35'}`,
                  borderRadius: '8px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setSelectedBuild(key)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{build.icon}</span>
                    <div>
                      <h5 style={{
                        color: selectedBuild === key ? '#AAD372' : '#e0e0e0',
                        fontSize: '1.1rem',
                        marginBottom: '5px'
                      }}>
                        {build.name}
                      </h5>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                        {build.description}
                      </p>
                    </div>
                  </div>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #AAD372 0%, #7FB347 100%)',
                      border: 'none',
                      color: '#1a1a2e',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      boxShadow: '0 2px 8px rgba(170, 211, 114, 0.3)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyBuild(build.code);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    복사하기
                  </button>
                </div>

                {/* 빌드 코드 */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '4px',
                  padding: '10px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#AAD372',
                  wordBreak: 'break-all',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyBuild(build.code);
                }}
                >
                  {build.code}
                </div>
              </div>
            ))}
          </div>

          {/* 사용 방법 안내 */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(170, 211, 114, 0.05)',
            border: '1px solid rgba(170, 211, 114, 0.2)',
            borderRadius: '8px'
          }}>
            <h5 style={{ color: '#AAD372', marginBottom: '15px', fontSize: '1rem' }}>📋 특성 빌드 사용법</h5>
            <ol style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '0.95rem' }}>
              <li>원하는 빌드의 "복사하기" 버튼을 클릭하거나 빌드 코드를 클릭합니다.</li>
              <li>게임 내에서 특성 창(N)을 엽니다.</li>
              <li>특성 창 하단의 "가져오기" 버튼을 클릭합니다.</li>
              <li>복사한 빌드 코드를 붙여넣기(Ctrl+V) 합니다.</li>
              <li>"적용" 버튼을 클릭하여 빌드를 적용합니다.</li>
            </ol>
          </div>
        </div>
      </Card>


    </Section>
  );

  const renderStats = () => {
    // 소프트캡과 브레이크포인트를 표시하는 함수
    const renderStatInfo = (stat) => {
      if (!stat.softcap && !stat.breakpoints?.length && !stat.note) return null;

      return (
        <div style={{ marginTop: '15px' }}>
          {/* 소프트캡 표시 */}
          {stat.softcap && (
            <div style={{
              marginBottom: '10px',
              padding: '8px 12px',
              background: 'rgba(255, 107, 107, 0.1)',
              borderLeft: '3px solid #ff6b6b',
              borderRadius: '4px'
            }}>
              <span style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>
                ⚠️ 소프트캡: <strong>{stat.softcap}</strong>
              </span>
            </div>
          )}

          {/* 브레이크포인트 표시 - 시각적 개선 */}
          {stat.breakpoints && stat.breakpoints.length > 0 && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                브레이크포인트
              </div>
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {stat.breakpoints.map((bp, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      background: bp.color === '#ff6b6b'
                        ? 'rgba(255, 107, 107, 0.15)'
                        : 'rgba(255, 165, 0, 0.12)',
                      border: `2px solid ${bp.color || stat.color}`,
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${bp.color || stat.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span style={{
                      color: bp.color || stat.color,
                      fontWeight: '800',
                      fontSize: '1rem'
                    }}>
                      {bp.value}%
                    </span>
                    <span style={{
                      color: '#f5f5f5',
                      fontWeight: '600'
                    }}>
                      {bp.label}
                    </span>
                  </div>
                ))}
              </div>
              {stat.softcap && (
                <div style={{
                  marginTop: '10px',
                  padding: '8px',
                  background: 'rgba(255, 107, 53, 0.1)',
                  borderLeft: '3px solid #ff6b35',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  color: '#ffa500'
                }}>
                  ⚠️ 권장 범위: <strong>{stat.softcap}</strong>
                </div>
              )}
            </div>
          )}

          {/* 참고사항 */}
          {stat.note && (
            <div style={{
              marginTop: '10px',
              padding: '8px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderLeft: `2px solid ${stat.color}`,
              borderRadius: '4px',
              fontSize: '0.85rem',
              color: '#cbd5e1'
            }}>
              💡 {stat.note}
            </div>
          )}
        </div>
      );
    };

    // 영웅 특성과 콘텐츠 타입별 스탯 데이터 생성 함수
    const getStatData = (hero, mode) => {
      const baseStats = {
        haste: {
          name: '가속',
          color: '#4ecdc4',
          icon: '⚡',
          description: '시전 속도 증가 & 쿨다운 감소'
        },
        crit: {
          name: '치명타',
          color: '#ff6b6b',
          icon: '⚡',
          description: '치명타 확률 증가'
        },
        mastery: {
          name: '특화',
          color: '#ffe66d',
          icon: '📈',
          description: '스킬이 입히는 피해 증가'
        },
        versatility: {
          name: '유연',
          color: '#95e77e',
          icon: '🔄',
          description: '피해 & 피해 감소'
        }
      };

      // 영웅 특성과 콘텐츠 타입별 브레이크포인트 (고통 흑마법사 11.2 패치)
      const breakpointData = {
        soulHarvester: {
          single: {
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '최우선 스탯. 지속 피해치명타 확률 증가로 지속 피해 극대화. 야밤의 징조 발동률 증가'
            },
            mastery: {
              breakpoints: [],
              note: '2순위 스탯. 모든 지속 피해피해 증가. Soul Harvester의 죽음의 그림자 피해 강화'
            },
            haste: {
              softcap: '25-30%',
              breakpoints: [
                { value: 25, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 30, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '3순위 스탯. 지속 피해tick 빈도 증가와 Drain Soul 시전 속도 향상'
            },
            versatility: {
              breakpoints: [],
              note: '최저 우선순위. 피해와 생존력 소폭 증가'
            }
          },
          aoe: {
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '최우선 스탯. 여러 대상의 지속 피해치명타로 광역 피해 극대화'
            },
            mastery: {
              breakpoints: [],
              note: '2순위 스탯. 광역 지속 피해피해 증가'
            },
            haste: {
              softcap: '25-30%',
              breakpoints: [
                { value: 25, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' }
              ],
              note: '3순위 스탯. Seed of Corruption 시전 속도와 지속 피해tick 빈도 증가'
            },
            versatility: {
              breakpoints: [],
              note: '최저 우선순위'
            }
          }
        },
        hellcaller: {
          single: {
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '최우선 스탯. 시들기 스택과 지속 피해치명타로 지속 피해 극대화'
            },
            mastery: {
              breakpoints: [],
              note: '2순위 스탯. 시들기와 모든 지속 피해 증가. 지옥소환사의 검게 물든 영혼 특성과 시너지'
            },
            haste: {
              softcap: '25-30%',
              breakpoints: [
                { value: 25, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 30, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '3순위 스탯. 시들기 tick 빈도 증가와 Malefic Rapture 시전 속도 향상'
            },
            versatility: {
              breakpoints: [],
              note: '최저 우선순위. 피해와 생존력 소폭 증가'
            }
          },
          aoe: {
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '최우선 스탯. 광역 DoT와 시들기 치명타로 폭발적인 광역 피해'
            },
            mastery: {
              breakpoints: [],
              note: '2순위 스탯. Seed of Corruption과 시들기 피해 증가'
            },
            haste: {
              softcap: '25-30%',
              breakpoints: [
                { value: 25, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' }
              ],
              note: '3순위 스탯. 빠른 시들기 확산과 지속 피해tick 빈도 증가'
            },
            versatility: {
              breakpoints: [],
              note: '최저 우선순위'
            }
          }
        }
      };

      // 선택된 영웅 특성과 모드에 맞는 데이터 병합
      const selectedBreakpoints = breakpointData[hero][mode];
      const statData = {};

      Object.keys(baseStats).forEach(stat => {
        statData[stat] = {
          ...baseStats[stat],
          ...selectedBreakpoints[stat]
        };
      });

      return statData;
    };

    const statPriorities = {
      hellcaller: {
        single: ['crit', 'mastery', 'haste', 'versatility'],
        aoe: ['crit', 'mastery', 'haste', 'versatility']
      },
      soulHarvester: {
        single: ['crit', 'mastery', 'haste', 'versatility'],
        aoe: ['crit', 'mastery', 'haste', 'versatility']
      }
    };

    // 현재 선택된 영웅 특성과 모드에 맞는 스탯 데이터 가져오기
    const statData = getStatData(selectedStatHero, selectedStatMode);

    return (
      <Section ref={sectionRefs.stats} id="stats">
        <SectionHeader>
          <SectionTitle>스탯 우선순위</SectionTitle>
        </SectionHeader>

        {/* 영웅 특성 선택 탭 */}
        <Card style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            gap: '10px',
            padding: '20px',
            borderBottom: '2px solid #1e2328'
          }}>
            <button
              onClick={() => setSelectedStatHero('hellcaller')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'hellcaller' ?
                  'linear-gradient(135deg, #8B4513 0%, #4a2511 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'hellcaller' ? '#FF6347' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'hellcaller' ? '#FF6347' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🔥 지옥소환사
            </button>
            <button
              onClick={() => setSelectedStatHero('soulHarvester')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'soulHarvester' ?
                  'linear-gradient(135deg, #4a148c 0%, #2a0c56 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'soulHarvester' ? '#9482C9' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'soulHarvester' ? '#9482C9' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              💀 영혼 수확자
            </button>
          </div>

          {/* 콘텐츠 타입 선택 */}
          <div style={{
            display: 'flex',
            gap: '10px',
            padding: '20px'
          }}>
            <button
              onClick={() => setSelectedStatMode('single')}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedStatMode === 'single' ?
                  'rgba(170, 211, 114, 0.1)' :
                  'transparent',
                border: `1px solid ${selectedStatMode === 'single' ? '#AAD372' : '#2a2d35'}`,
                borderRadius: '6px',
                color: selectedStatMode === 'single' ? '#AAD372' : '#94a3b8',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              단일 대상 (레이드)
            </button>
            <button
              onClick={() => setSelectedStatMode('aoe')}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedStatMode === 'aoe' ?
                  'rgba(170, 211, 114, 0.1)' :
                  'transparent',
                border: `1px solid ${selectedStatMode === 'aoe' ? '#AAD372' : '#2a2d35'}`,
                borderRadius: '6px',
                color: selectedStatMode === 'aoe' ? '#AAD372' : '#94a3b8',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              광역 (쐐기돌)
            </button>
          </div>
        </Card>

        {/* 스탯 우선순위 표시 */}
        <Card style={{ marginBottom: '20px' }}>
          <div className={styles.subsection} ref={subSectionRefs['stats-priority']}>
            <h3 style={{
              color: selectedStatHero === 'hellcaller' ? '#9482C9' : '#32CD32',
              fontSize: '1.3rem',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{selectedStatHero === 'hellcaller' ? '🔥' : '💀'}</span>
              <span>{selectedStatHero === 'hellcaller' ? '지옥소환사' : '영혼 수확자'}</span>
              <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                - {selectedStatMode === 'single' ? '단일 대상' : '광역'}
              </span>
            </h3>

            {/* 우선순위 카드 */}
            <div style={{
              display: 'grid',
              gap: '15px',
              marginBottom: '30px'
            }}>
              {statPriorities[selectedStatHero][selectedStatMode].map((statKey, index) => {
                const stat = statData[statKey];
                const isEqual = index > 0 &&
                  ((selectedStatHero === 'hellcaller' && selectedStatMode === 'single' && index === 2) ||
                   (selectedStatHero === 'soulHarvester' && index === 4));

                return (
                  <div key={statKey} style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: index === 0 ?
                      'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)' :
                      'rgba(0, 0, 0, 0.3)',
                    border: `1px solid ${index === 0 ? '#AAD372' : '#2a2d35'}`,
                    borderRadius: '8px',
                    padding: '15px 20px',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}>
                    {/* 순위 */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: index === 0 ?
                        'linear-gradient(135deg, #AAD372 0%, #8BC34A 100%)' :
                        'linear-gradient(135deg, #2a2d35 0%, #1e2328 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '20px',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: index === 0 ? '#1a1a2e' : '#94a3b8',
                      boxShadow: index === 0 ? '0 2px 8px rgba(255, 215, 0, 0.3)' : 'none'
                    }}>
                      {isEqual ? '=' : index + 1}
                    </div>

                    {/* 스탯 아이콘과 이름 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flex: 1
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                      <span style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: stat.color
                      }}>
                        {stat.name}
                      </span>
                      {statKey === 'weaponDamage' && (
                        <span style={{
                          background: 'linear-gradient(135deg, #AAD372 0%, #8BC34A 100%)',
                          color: '#1a1a2e',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          marginLeft: '10px'
                        }}>
                          최우선
                        </span>
                      )}
                    </div>

                    {/* 스탯 설명 */}
                    <div style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      fontSize: '0.9rem'
                    }}>
                      {stat.description}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 스탯 브레이크포인트 상세 정보 */}
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '8px',
              border: '1px solid #2a2d35'
            }}>
              <h4 style={{
                color: '#AAD372',
                marginBottom: '20px',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>📊</span>
                <span>스탯 브레이크포인트 & 목표</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {/* 가속 브레이크포인트 */}
                <div>
                  <h5 style={{
                    color: statData.haste.color,
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{statData.haste.icon}</span>
                    <span>{statData.haste.name}</span>
                  </h5>
                  {renderStatInfo(statData.haste)}
                </div>

                {/* 치명타 브레이크포인트 */}
                <div>
                  <h5 style={{
                    color: statData.crit.color,
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{statData.crit.icon}</span>
                    <span>{statData.crit.name}</span>
                  </h5>
                  {renderStatInfo(statData.crit)}
                </div>

                {/* 특화 브레이크포인트 */}
                <div>
                  <h5 style={{
                    color: statData.mastery.color,
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{statData.mastery.icon}</span>
                    <span>{statData.mastery.name}</span>
                  </h5>
                  {renderStatInfo(statData.mastery)}
                </div>

                {/* 유연 브레이크포인트 */}
                <div>
                  <h5 style={{
                    color: statData.versatility.color,
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{statData.versatility.icon}</span>
                    <span>{statData.versatility.name}</span>
                  </h5>
                  {renderStatInfo(statData.versatility)}
                </div>
              </div>

              {/* 브레이크포인트 요약 */}
              <div style={{
                marginTop: '30px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#ff6b35', marginBottom: '15px', fontSize: '1.1rem' }}>
                  📊 브레이크포인트 요약
                </h4>

                <div style={{ marginBottom: '15px' }}>
                  <h5 style={{ color: '#AAD372', marginBottom: '10px' }}>
                    불꽃형성자 (Flameshaper)
                  </h5>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li><strong>단일:</strong> 가속 30-35% > 치명타 = 특화 > 유연</li>
                    <li><strong>광역:</strong> 가속 30-40% > 치명타 > 특화 > 유연</li>
                  </ul>
                </div>

                <div>
                  <h5 style={{ color: '#DC3545', marginBottom: '10px' }}>
                    비늘사령관 (Chronowarden)
                  </h5>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li><strong>단일/광역:</strong> 가속 30-40% > 치명타 > 유연 > 특화</li>
                  </ul>
                </div>

                <div style={{
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    ⚠️ 가속은 30%부터 소프트캡 시작, 40%에서 효율 크게 감소
                  </p>
                </div>
              </div>
            </div>

            {/* 중요 참고사항 */}
            <div style={{
              background: 'rgba(170, 211, 114, 0.05)',
              border: '1px solid rgba(170, 211, 114, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h4 style={{ color: '#AAD372', marginBottom: '15px', fontSize: '1.1rem' }}>
                ⚠️ 중요 참고사항
              </h4>
              <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '0.95rem' }}>
                <li>가속은 30-40%에서 소프트캡에 도달합니다</li>
                <li>치명타는 특별한 소프트캡이 없습니다</li>
                {selectedStatHero === 'hellcaller' && selectedStatMode === 'single' && (
                  <li>
                    지옥소환사는 치명타 > 특화 우선순위를 가집니다 ({' '}
                    <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.wither} textOnly={true} /> 스택 메커니즘)
                  </li>
                )}
                {selectedStatHero === 'soulHarvester' && (
                  <li>영혼 수확자는 치명타 > 특화를 우선시합니다 (야밤의 징조 프록 최적화)</li>
                )}
                <li>정확한 스탯 가중치는 개인 시뮬레이션을 권장합니다</li>
                <li>콘텐츠 타입에 따라 우선순위가 변경됩니다</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* SimC 스트링 섹션 */}
        <Card>
          <div className={styles.subsection} ref={subSectionRefs['stats-simc']}>
            <h3 style={{ color: '#AAD372', marginBottom: '20px', fontSize: '1.2rem' }}>
              📊 SimulationCraft 설정
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* 기본 가중치 */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid #2a2d35',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <h4 style={{ color: '#ffa500', marginBottom: '15px' }}>기본 가중치</h4>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid #1e2328',
                  borderRadius: '4px',
                  padding: '15px',
                  color: '#9482C9',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  overflow: 'auto'
                }}>
{`# TWW Season 3 Demonology Warlock
scale_factors="1"
scale_factor_dps="1"
interpolation="1"
iterate="10000"
fight_style=patchwerk
max_time=300

# Stat Weights (지옥소환사 - 단일 대상)
crit=1.00       # 치명 (시들기 스택 최적화)
mastery=0.95    # 특화 (DoT 피해 증가)
haste=0.85      # 가속
versatility=0.70

# Stat Weights (영혼 수확자 - 광역/쐐기)
crit=1.00       # 치명 (야밤의 징조 프록)
mastery=0.90    # 특화 (DoT 피해)
haste=0.80      # 가속
versatility=0.65`}
                </pre>
              </div>

              {/* 프로필 예시 */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid #2a2d35',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <h4 style={{ color: '#ffa500', marginBottom: '15px' }}>프로필 예시</h4>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid #1e2328',
                  borderRadius: '4px',
                  padding: '15px',
                  color: '#9482C9',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  overflow: 'auto'
                }}>
{`warlock="Demonology_Warlock"
level=80
race=orc
spec=demonology
region=kr
server=azshara
role=attack
professions=engineering=100/enchanting=100

# Gear (639 ilvl 예시)
head=,id=212072,ilevel=639,bonus_id=10341
neck=,id=212448,ilevel=639,gem_id=213743
shoulder=,id=212070,ilevel=639,bonus_id=10341
back=,id=212446,ilevel=639,enchant=chant_of_leeching_fangs_3
chest=,id=212075,ilevel=639,enchant=crystalline_radiance_3`}
                </pre>
              </div>
            </div>

            {/* Raidbots 링크 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(170, 211, 114, 0.1) 0%, transparent 100%)',
              border: '1px solid #AAD372',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#cbd5e1', marginBottom: '15px' }}>
                정확한 스탯 가중치를 알고 싶다면 Raidbots에서 시뮬레이션을 돌려보세요
              </p>
              <a
                href="https://www.raidbots.com/simbot"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #AAD372 0%, #7FB347 100%)',
                  color: '#1a1a2e',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                  boxShadow: '0 2px 8px rgba(170, 211, 114, 0.3)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Raidbots에서 시뮬레이션하기 →
              </a>
            </div>
          </div>
        </Card>
      </Section>
    );
  };

  return (
    <ThemeProvider theme={unifiedTheme}>
      <GlobalStyle />
      {/* 업데이트 알림 토스트 */}
      {showToast && (
        <UpdateToast
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          가이드가 업데이트되었습니다!
        </UpdateToast>
      )}
      <PageWrapper>
        <Sidebar>
          <NavSection>
            {/* 개요 섹션 */}
            <NavItem
              active={activeSection === 'overview'}
              onClick={() => scrollToSection('overview')}
            >
              개요
            </NavItem>
            <SubNavItem
              active={activeSubSection === 'overview-intro'}
              onClick={() => scrollToSubSection('overview-intro')}
              style={{ display: activeSection === 'overview' ? 'block' : 'none' }}
            >
              전문화 소개
            </SubNavItem>
            <SubNavItem
              active={activeSubSection === 'overview-resource'}
              onClick={() => scrollToSubSection('overview-resource')}
              style={{ display: activeSection === 'overview' ? 'block' : 'none' }}
            >
              리소스 시스템
            </SubNavItem>

            {/* 딜사이클 섹션 */}
            <NavItem
              active={activeSection === 'rotation'}
              onClick={() => scrollToSection('rotation')}
            >
              딜사이클
            </NavItem>
            <SubNavItem
              active={activeSubSection === 'rotation-tier'}
              onClick={() => scrollToSubSection('rotation-tier')}
              style={{ display: activeSection === 'rotation' ? 'block' : 'none' }}
            >
              티어 세트
            </SubNavItem>
            <SubNavItem
              active={activeSubSection === 'rotation-single'}
              onClick={() => scrollToSubSection('rotation-single')}
              style={{ display: activeSection === 'rotation' ? 'block' : 'none' }}
            >
              단일 대상
            </SubNavItem>
            <SubNavItem
              active={activeSubSection === 'rotation-aoe'}
              onClick={() => scrollToSubSection('rotation-aoe')}
              style={{ display: activeSection === 'rotation' ? 'block' : 'none' }}
            >
              광역 대상
            </SubNavItem>

            {/* 특성 섹션 */}
            <NavItem
              active={activeSection === 'builds'}
              onClick={() => scrollToSection('builds')}
            >
              특성
            </NavItem>
            <SubNavItem
              active={activeSubSection === 'builds-talents'}
              onClick={() => scrollToSubSection('builds-talents')}
              style={{ display: activeSection === 'builds' ? 'block' : 'none' }}
            >
              특성 빌드
            </SubNavItem>

            {/* 스탯 섹션 */}
            <NavItem
              active={activeSection === 'stats'}
              onClick={() => scrollToSection('stats')}
            >
              스탯
            </NavItem>
            <SubNavItem
              active={activeSubSection === 'stats-priority'}
              onClick={() => scrollToSubSection('stats-priority')}
              style={{ display: activeSection === 'stats' ? 'block' : 'none' }}
            >
              우선순위
            </SubNavItem>
            <SubNavItem
              active={activeSubSection === 'stats-simc'}
              onClick={() => scrollToSubSection('stats-simc')}
              style={{ display: activeSection === 'stats' ? 'block' : 'none' }}
            >
              SimC 스트링
            </SubNavItem>
          </NavSection>
        </Sidebar>

        <MainContent>
          <ContentContainer>
            {/* 가이드 제목 및 메타 정보 */}
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem',
              paddingTop: '2rem'
            }}>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #9482C9 0%, #7a5fb0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                textShadow: '0 0 30px rgba(148, 130, 201, 0.3)'
              }}>
                고통 흑마법사 가이드
              </h1>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}>
                최종 수정일: 2025.10.02 | 작성: WoWMeta | 검수: TWW 시즌3 (11.2 패치)
              </p>
            </div>

            {renderOverview()}
            {renderRotation()}
            {renderBuilds()}
            {renderStats()}
          </ContentContainer>
        </MainContent>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default AfflictionWarlockGuide;