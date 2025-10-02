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

// Guide 페이지의 통일된 테마 (Fury Warrior 가이드 레이아웃)
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
    if (props.heroType === 'slayer') {
      return 'linear-gradient(135deg, rgba(198, 155, 109, 0.05), rgba(255, 107, 107, 0.05))';
    } else if (props.heroType === 'mountainThane') {
      return 'linear-gradient(135deg, rgba(78, 205, 196, 0.05), rgba(93, 173, 226, 0.05))';
    }
    return props.theme.colors.surface;
  }};
  border: 2px solid ${props => {
    if (props.heroType === 'slayer') {
      return 'rgba(198, 155, 109, 0.3)';
    } else if (props.heroType === 'mountainThane') {
      return 'rgba(78, 205, 196, 0.3)';
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
      if (props.heroType === 'slayer') {
        return 'linear-gradient(90deg, #C69B6D, #FF6B6B)';
      } else if (props.heroType === 'mountainThane') {
        return 'linear-gradient(90deg, #4ECDC4, #5DADE2)';
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

// ⚠️ TODO: 실제 가이드 제작 시 이 함수를 수정하세요
// 영웅특성별 콘텐츠 생성 함수 (SkillIcon 컴포넌트 사용을 위해 함수로 변경)
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
        skillData.charge,
        skillData.recklessness,
        skillData.avatar,
        skillData.championsSpear,
        skillData.rampage,
        skillData.ragingBlow,
        skillData.bloodthirst
      ],
      priority: [
        { skill: skillData.rampage, desc: '격노 버프가 없거나 곧 만료될 때 최우선 사용 (격노 유지율 90%+ 목표)' },
        { skill: skillData.execute, desc: '처형 표식 2중첩 이상 OR 갑작스런 죽음 2중첩 OR 갑작스런 죽음 버프 만료 직전 시 사용' },
        { skill: skillData.rampage, desc: '학살의 일격 5중첩 시 즉시 사용하여 중첩 소모' },
        { skill: skillData.ragingBlow, desc: '잔혹한 마무리 버프 활성 시 최우선 사용' },
        { skill: skillData.ragingBlow, desc: '2 충전 보유 시 즉시 사용 (충전 낭비 방지)' },
        { skill: skillData.rampage, desc: '분노 120 이상 시 사용 (분노 낭비 방지)' },
        { skill: skillData.execute, desc: '대상 생명력 20% 이하 시 사용' },
        { skill: skillData.ragingBlow, desc: '기본 분노 소모 스킬' },
        { skill: skillData.rampage, desc: '분노 80 이상 시 사용' },
        { skill: skillData.bloodthirst, desc: '재사용 대기시간마다 사용 (분노 8 생성 + 생명력 회복)' },
        { skill: skillData.execute, desc: '다른 스킬 사용 불가 시 필러로 사용' }
      ]
    },
    aoe: {
      opener: [
        skillData.charge,
        skillData.recklessness,
        skillData.avatar,
        skillData.thunderousRoar,
        skillData.whirlwind,
        skillData.rampage
      ],
      priority: [
        { skill: skillData.whirlwind, desc: '개선된 소용돌이 버프 유지 (다음 2번 공격 광역화)' },
        { skill: skillData.rampage, desc: '격노 버프 유지 최우선' },
        { skill: skillData.execute, desc: '여러 적이 20% 이하 시 우선 사용 (소용돌이 버프로 광역 처형)' },
        { skill: skillData.thunderousRoar, desc: '재사용 대기시간마다 사용 (광역 출혈 DoT)' },
        { skill: skillData.ragingBlow, desc: '소용돌이 버프 소모하여 광역 피해' },
        { skill: skillData.bloodthirst, desc: '분노 생성 및 소용돌이 버프로 광역 피해' },
        { skill: skillData.whirlwind, desc: '소용돌이 버프 재적용' }
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
        skillData.charge,
        skillData.recklessness,
        skillData.avatar,
        skillData.thunderBlast,
        skillData.championsSpear,
        skillData.rampage,
        skillData.ragingBlow,
        skillData.bloodthirst
      ],
      priority: [
        { skill: skillData.rampage, desc: '격노 버프가 없거나 곧 만료될 때 최우선 사용' },
        { skill: skillData.thunderBlast, desc: '재사용 대기시간마다 즉시 사용 (분노 30 소모, 천둥 피해)' },
        { skill: skillData.execute, desc: '처형 표식 2중첩 이상 OR 갑작스런 죽음 2중첩 OR 버프 만료 직전 시 사용' },
        { skill: skillData.rampage, desc: '학살의 일격 5중첩 시 즉시 사용' },
        { skill: skillData.ragingBlow, desc: '잔혹한 마무리 버프 활성 시 최우선 사용' },
        { skill: skillData.ragingBlow, desc: '2 충전 보유 시 즉시 사용' },
        { skill: skillData.rampage, desc: '분노 120 이상 시 사용 (낭비 방지)' },
        { skill: skillData.execute, desc: '대상 생명력 20% 이하 시 사용' },
        { skill: skillData.ragingBlow, desc: '기본 분노 소모 스킬' },
        { skill: skillData.rampage, desc: '분노 80 이상 시 사용' },
        { skill: skillData.bloodthirst, desc: '재사용 대기시간마다 사용 (분노 생성)' }
      ]
    },
    aoe: {
      opener: [
        skillData.charge,
        skillData.recklessness,
        skillData.avatar,
        skillData.thunderBlast,
        skillData.thunderousRoar,
        skillData.whirlwind,
        skillData.rampage
      ],
      priority: [
        { skill: skillData.whirlwind, desc: '개선된 소용돌이 버프 유지 필수' },
        { skill: skillData.rampage, desc: '격노 버프 유지 최우선' },
        { skill: skillData.thunderBlast, desc: '재사용 대기시간마다 사용 (8미터 광역 번개 피해 + 20% 감속)' },
        { skill: skillData.thunderousRoar, desc: '재사용 대기시간마다 사용 (2세트로 우레 작렬 쿨감)' },
        { skill: skillData.execute, desc: '여러 적이 20% 이하 시 우선 사용' },
        { skill: skillData.ragingBlow, desc: '소용돌이 버프 소모하여 광역 피해' },
        { skill: skillData.bloodthirst, desc: '분노 생성 및 광역 피해' },
        { skill: skillData.whirlwind, desc: '소용돌이 버프 재적용' }
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

const FuryWarriorGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [selectedTier, setSelectedTier] = useState('slayer');
  const [showToast, setShowToast] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState('raid-single');
  const [selectedStatHero, setSelectedStatHero] = useState('slayer');
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

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>핵심 스킬</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {[
              { skill: skillData.bloodthirst, label: '분노 8 생성' },
              { skill: skillData.ragingBlow, label: '분노 12 생성' },
              { skill: skillData.rampage, label: '분노 80 소모' },
              { skill: skillData.execute, label: '20% 이하 시' },
              { skill: skillData.recklessness, label: skillData.recklessness.cooldown },
              { skill: skillData.avatar, label: skillData.avatar.cooldown }
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
            <li>주 자원: <span style={{ color: '#C69B6D', fontWeight: 'bold' }}>분노 (Rage)</span> (최대 100, 전투 이탈 시 감소)</li>
            <li>리소스 생성:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li><SkillIcon skill={skillData.bloodthirst} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.bloodthirst} textOnly={true} /> - 분노 8 생성 (4.5초 재사용 대기시간)</li>
                <li><SkillIcon skill={skillData.ragingBlow} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.ragingBlow} textOnly={true} /> - 분노 12 생성 (재사용 대기시간 없음)</li>
                <li><SkillIcon skill={skillData.charge} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.charge} textOnly={true} /> - 분노 20 생성 (전투 시작 시 사용)</li>
                <li><SkillIcon skill={skillData.whirlwind} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.whirlwind} textOnly={true} /> - 분노 3+ 생성 (광역 딜 및 분노 수급)</li>
              </ul>
            </li>
            <li>리소스 소비:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li><SkillIcon skill={skillData.rampage} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.rampage} textOnly={true} /> - 분노 80 소모 (격노 버프 12초 획득)</li>
                <li><SkillIcon skill={skillData.execute} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.execute} textOnly={true} /> - 분노 20-40 소모 (대상 20% 이하 시 사용 가능)</li>
              </ul>
            </li>
            <li><strong style={{ color: '#ffa500' }}>핵심 전략:</strong> 분노 80 이상 유지 후 <SkillIcon skill={skillData.rampage} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.rampage} textOnly={true} />로 격노 버프를 계속 갱신하는 것이 핵심입니다</li>
            <li><strong style={{ color: '#ff6b6b' }}>주의:</strong> 분노가 100에 도달하면 더 이상 생성되지 않으므로 분노 낭비를 방지하기 위해 적절히 소비해야 합니다</li>
          </ul>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginTop: '25px', marginBottom: '15px' }}>주요 메커니즘</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li><strong style={{ color: '#C69B6D' }}>격노 (Enrage):</strong> <SkillIcon skill={skillData.rampage} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.rampage} textOnly={true} /> 사용 시 12초간 가속 25% 증가, 피해량 20% 증가 버프 획득</li>
            <li><strong style={{ color: '#ff6b6b' }}>마무리 일격 단계:</strong> 대상 생명력 20% 이하 시 <SkillIcon skill={skillData.execute} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.execute} textOnly={true} />가 사용 가능해지며, 모든 분노를 소모하여 막대한 피해를 입힙니다</li>
            <li><strong style={{ color: '#ffa500' }}>버스트 타이밍:</strong> <SkillIcon skill={skillData.recklessness} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.recklessness} textOnly={true} />와 <SkillIcon skill={skillData.avatar} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.avatar} textOnly={true} />를 동시에 사용하여 12-20초간 폭발적인 딜을 냅니다</li>
            <li><strong style={{ color: '#FFD700' }}>쿨다운 관리:</strong> 1.5분 주기로 모든 주요 쿨다운(<SkillIcon skill={skillData.recklessness} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.recklessness} textOnly={true} />, <SkillIcon skill={skillData.avatar} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.avatar} textOnly={true} />)을 함께 사용합니다</li>
            <li><strong style={{ color: '#32CD32' }}>영웅 특성 활용:</strong> 학살자는 출혈 피해 극대화, 산왕은 <SkillIcon skill={skillData.thunderBlast} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.thunderBlast} textOnly={true} />로 광역 딜 강화</li>
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
              className={`${styles.tierTab} ${selectedTier === 'slayer' ? styles.active : ''}`}
              onClick={() => setSelectedTier('slayer')}
            >
              <span className={styles.tierIcon}>⚔️</span> 학살자 (Slayer)
            </button>
            <button
              className={`${styles.tierTab} ${selectedTier === 'mountainThane' ? styles.active : ''}`}
              onClick={() => setSelectedTier('mountainThane')}
            >
              <span className={styles.tierIcon}>⚡</span> 산왕 (Mountain Thane)
            </button>
          </div>

          {/* 티어 세트 효과 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-tier']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'slayer' ? '#C69B6D' : '#4ECDC4'
            }}>티어 세트 효과</h3>
            <div className={styles.tierBonuses} style={{
              background: selectedTier === 'slayer'
                ? 'linear-gradient(135deg, rgba(198, 155, 109, 0.1), rgba(198, 155, 109, 0.05))'
                : 'linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(78, 205, 196, 0.05))',
              padding: '1.5rem',
              borderRadius: '8px',
              border: selectedTier === 'slayer'
                ? '1px solid rgba(198, 155, 109, 0.3)'
                : '1px solid rgba(78, 205, 196, 0.3)'
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
            border: selectedTier === 'slayer'
              ? '1px solid rgba(198, 155, 109, 0.3)'
              : '1px solid rgba(78, 205, 196, 0.3)'
          }}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'slayer' ? '#C69B6D' : '#4ECDC4'
            }}>영웅 특성 딜링 메커니즘</h3>

            {selectedTier === 'slayer' ? (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#FF6B6B' }}>학살자 (Slayer)</strong>는 {' '}
                  출혈 피해와 <SkillIcon skill={skillData.execute} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.execute} textOnly={true} /> 강화를 통한 {' '}
                  <strong style={{ color: '#C69B6D' }}>폭발적인 단일 대상 피해</strong>로 {' '}
                  <strong style={{ color: '#ffa500' }}>레이드 보스전에서 최고의 성능</strong>을 제공합니다.
                  티어 세트와 결합 시 격노 지속시간 연장과 추가 공격력으로
                  단일 대상에서 압도적인 딜을 발휘합니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#FF6B6B', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.execute} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.execute} textOnly={true} /> - 핵심 피해 스킬
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li><strong style={{ color: '#ff6b6b' }}>사용 조건:</strong> 대상 생명력 20% 이하 (학살자 특성으로 35%까지 확장)</li>
                    <li><strong style={{ color: '#ffa500' }}>분노 소모:</strong> 20-40 분노 (많을수록 강력)</li>
                    <li><strong style={{ color: '#C69B6D' }}>티어 2세트:</strong> 무모한 희생 중 격노 지속시간 연장</li>
                    <li><strong style={{ color: '#FFD700' }}>연계:</strong> 분노 최대 → <SkillIcon skill={skillData.execute} textOnly={true} /> 연타로 폭발적 피해</li>
                  </ul>
                  <p style={{ color: '#e0e0e0', fontSize: '0.95rem' }}>
                    학살자는 출혈 피해를 주력으로 하며, {' '}
                    <SkillIcon skill={skillData.recklessness} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.recklessness} textOnly={true} /> 사용 시 격노 상태를 최대한 유지해야 합니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#C69B6D', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.recklessness} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.recklessness} textOnly={true} /> - 버스트 타이밍
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>준비 단계:</strong> 분노 80 이상 확보 후 사용
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>버프 효과:</strong> 분노 생성 100% 증가, 치명타 20% 증가 (12초)
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>피해 증폭:</strong> <SkillIcon skill={skillData.avatar} textOnly={true} />와 함께 사용하여 공격력 20% 추가
                    </li>
                    <li>
                      <strong>장신구/물약 조합:</strong> 버스트 스킬과 함께 사용하여 극대화
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: 티어 4세트로 격노 중 광란 피해가 추가로 8% 증가하므로 격노 유지가 매우 중요합니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>분노 관리:</strong> 항상 80 이상 유지하여 격노 버프 갱신
                    </li>
                    <li>
                      <SkillIcon skill={skillData.rampage} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.rampage} textOnly={true} /> - 격노 버프 유지의 핵심
                    </li>
                    <li>
                      출혈 피해 최대화를 위한 <SkillIcon skill={skillData.bloodthirst} textOnly={true} /> 적극 사용
                    </li>
                    <li>레이드 단일 대상과 보스 처형 구간에서 최고 성능</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#4ECDC4' }}>산왕 (Mountain Thane)</strong>는 {' '}
                  <SkillIcon skill={skillData.thunderBlast} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.thunderBlast} textOnly={true} />를 통한 {' '}
                  <strong style={{ color: '#4ECDC4' }}>강력한 광역 폭풍 피해</strong>로 {' '}
                  <strong style={{ color: '#ffa500' }}>쐐기돌 던전에서 탁월한 성능</strong>을 제공합니다.
                  티어 세트 효과로 <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 피해가 증가하며,
                  천둥 공격 시 분노를 추가로 생성하여 지속적인 광역 딜이 가능합니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#4ECDC4', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.thunderBlast} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> - 핵심 광역 스킬
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>재사용 대기시간:</strong> 6초 (분노 30 소모)
                    </li>
                    <li>
                      <strong style={{ color: '#4ECDC4' }}>티어 2세트:</strong> 천둥 공격 시 분노 추가 생성
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>티어 4세트:</strong> 우레 작렬 피해 증가
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>광역 효과:</strong> 8미터 내 모든 적에게 폭풍충격 피해
                    </li>
                    <li>
                      <strong style={{ color: '#C69B6D' }}>이동 속도 감소:</strong> 10초간 20% 감소
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: 우레 작렬은 재사용 대기시간마다 즉시 사용하여 분노 수급과 광역 딜을 극대화하세요.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#C69B6D', fontSize: '1.1rem', marginBottom: '15px' }}>
                    광역 딜사이클
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <SkillIcon skill={skillData.whirlwind} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.whirlwind} textOnly={true} /> 사용으로 분노 생성 및 광역 피해
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>분노 30 확보:</strong> 티어 세트로 분노 순환 개선
                    </li>
                    <li>
                      <strong style={{ color: '#4ECDC4' }}>다수 대상:</strong> 3개 이상 대상 시 광역 최적화
                    </li>
                    <li>
                      <SkillIcon skill={skillData.thunderBlast} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> - 재사용 대기시간마다 사용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 특징</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>쿨기 우선순위:</strong> <SkillIcon skill={skillData.thunderousRoar} textOnly={true} /> 최우선 사용 (광역 출혈)
                    </li>
                    <li>
                      <strong style={{ color: '#4ECDC4' }}>광역 최적화:</strong> 분노 관리 → <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 연계
                    </li>
                    <li>
                      천둥 피해로 안정적인 지속 광역 딜
                    </li>
                    <li>쐐기돌 던전과 레이드 광역 구간에서 최고 성능</li>
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
              <p style={{ color: selectedTier === 'slayer' ? '#C69B6D' : '#4ECDC4', fontSize: '0.95rem', margin: 0 }}>
                <strong>💡 추천 콘텐츠:</strong> {' '}
                {selectedTier === 'slayer' ?
                  '단일 보스 레이드, 처형 구간이 중요한 전투' :
                  '쐐기돌 던전, 광역 딜이 필요한 레이드 구간'}
              </p>
            </div>
          </div>

          {/* 단일 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-single']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'slayer' ? '#C69B6D' : '#4ECDC4',
              marginTop: '1.5rem'
            }}>단일 대상</h3>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>⏱️ 오프닝 시퀀스 (타임라인)</h4>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 165, 0, 0.2)'
            }}>
              <p style={{ fontSize: '0.95rem', color: '#ffa500', marginBottom: '15px', fontWeight: 'bold' }}>
                {selectedTier === 'slayer' ?
                  '🎯 전투 시작 (0-10초): 쿨기 동기화로 폭발적 딜 시작' :
                  '⚡ 전투 시작 (0-10초): 우레 작렬 중심 버스트 시작'}
              </p>

              {/* 타임라인 스타일 스킬 시퀀스 */}
              <div style={{ position: 'relative', paddingLeft: '40px' }}>
                {/* 타임라인 라인 */}
                <div style={{
                  position: 'absolute',
                  left: '15px',
                  top: '0',
                  bottom: '0',
                  width: '3px',
                  background: 'linear-gradient(to bottom, #ffa500, #C69B6D)',
                  borderRadius: '2px'
                }} />

                {currentContent.singleTarget.opener.map((skill, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: index < currentContent.singleTarget.opener.length - 1 ? '12px' : '0',
                    position: 'relative'
                  }}>
                    {/* 타임라인 도트 */}
                    <div style={{
                      position: 'absolute',
                      left: '-33px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: index === 0 ? '#ffa500' : index === 1 || index === 2 ? '#ff6b6b' : '#C69B6D',
                      border: '2px solid rgba(0, 0, 0, 0.5)',
                      zIndex: 1
                    }} />

                    {/* 스킬 아이콘 및 설명 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <SkillIcon skill={skill} size="medium" />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <SkillIcon skill={skill} textOnly={true} />
                          <span style={{
                            fontSize: '0.8rem',
                            color: '#888',
                            fontWeight: 'normal'
                          }}>
                            {index === 0 && '(시작)'}
                            {index === 1 && selectedTier === 'slayer' && '(12초 버스트)'}
                            {index === 1 && selectedTier === 'mountainThane' && '(12초 버스트)'}
                            {index === 2 && selectedTier === 'slayer' && '(20초 버스트)'}
                            {index === 2 && selectedTier === 'mountainThane' && '(20초 버스트)'}
                            {index === 3 && selectedTier === 'slayer' && '(분노 10 + DoT)'}
                            {index === 3 && selectedTier === 'mountainThane' && '(광역 번개)'}
                            {index === 4 && selectedTier === 'slayer' && '(분노 80 소비)'}
                            {index === 4 && selectedTier === 'mountainThane' && '(분노 10 + DoT)'}
                            {index === 5 && selectedTier === 'slayer' && '(분노 생성)'}
                            {index === 5 && selectedTier === 'mountainThane' && '(분노 80 소비)'}
                            {index === 6 && selectedTier === 'slayer' && '(분노 생성)'}
                            {index === 6 && selectedTier === 'mountainThane' && '(분노 생성)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(255, 165, 0, 0.1)',
                borderRadius: '6px',
                borderLeft: '3px solid #ffa500'
              }}>
                <p style={{ fontSize: '0.85rem', color: '#ffa500', margin: 0 }}>
                  💡 <strong>핵심:</strong> {' '}
                  {selectedTier === 'slayer' ?
                    '무모한 희생 + 투신을 동시에 사용하여 12초 동안 치명타 20% + 공격력 20% 증가' :
                    '우레 작렬은 쿨마다 즉시 사용하며, 천둥의 포효 사용 시 쿨다운 6초 감소'}
                </p>
              </div>
            </div>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>🔄 스킬 우선순위 (플로우차트)</h4>

            {/* 우선순위 플로우차트 스타일 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid rgba(198, 155, 109, 0.2)'
            }}>
              {currentContent.singleTarget.priority.map((item, index) => (
                <div key={index} style={{
                  marginBottom: index < currentContent.singleTarget.priority.length - 1 ? '15px' : '0'
                }}>
                  {/* 우선순위 카드 */}
                  <div style={{
                    background: index === 0 ? 'rgba(255, 107, 107, 0.15)' :
                               index === 1 ? 'rgba(255, 165, 0, 0.15)' :
                               index === 2 ? 'rgba(198, 155, 109, 0.15)' : 'rgba(100, 100, 100, 0.1)',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    border: `1px solid ${index === 0 ? '#ff6b6b' : index === 1 ? '#ffa500' : index === 2 ? '#C69B6D' : '#666'}`,
                    position: 'relative'
                  }}>
                    {/* 우선순위 번호 배지 */}
                    <div style={{
                      position: 'absolute',
                      left: '-10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: index === 0 ? '#ff6b6b' : index === 1 ? '#ffa500' : index === 2 ? '#C69B6D' : '#666',
                      color: '#fff',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      border: '2px solid rgba(0, 0, 0, 0.5)'
                    }}>
                      {index + 1}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginLeft: '20px'
                    }}>
                      <SkillIcon skill={item.skill} size="small" />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.95rem',
                          fontWeight: 'bold',
                          marginBottom: '4px',
                          color: index === 0 ? '#ff6b6b' : index === 1 ? '#ffa500' : index === 2 ? '#C69B6D' : '#ccc'
                        }}>
                          <SkillIcon skill={item.skill} textOnly={true} />
                        </div>
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#ccc',
                          lineHeight: '1.5'
                        }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 조건부 화살표 */}
                  {index < currentContent.singleTarget.priority.length - 1 && (
                    <div style={{
                      textAlign: 'center',
                      padding: '5px 0',
                      color: '#666',
                      fontSize: '1.2rem'
                    }}>
                      ↓
                    </div>
                  )}
                </div>
              ))}

              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(198, 155, 109, 0.1)',
                borderRadius: '6px',
                borderLeft: '3px solid #C69B6D'
              }}>
                <p style={{ fontSize: '0.85rem', color: '#C69B6D', margin: 0 }}>
                  🎯 <strong>목표:</strong> {' '}
                  {selectedTier === 'slayer' ?
                    '격노 버프 유지율 90%+ 유지, 처형 표식 2중첩 시 마무리 일격 최우선' :
                    '우레 작렬 쿨다운 낭비 방지, 분노 50-70 범위 유지'}
                </p>
              </div>
            </div>
          </div>

          {/* 광역 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-aoe']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'slayer' ? '#9482C9' : '#32CD32',
              marginTop: '1.5rem'
            }}>광역 대상 (3+ 타겟)</h3>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>⏱️ 오프닝 시퀀스 (타임라인)</h4>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 165, 0, 0.2)'
            }}>
              <p style={{ fontSize: '0.95rem', color: '#ffa500', marginBottom: '15px', fontWeight: 'bold' }}>
                {selectedTier === 'slayer' ?
                  '💥 광역 시작 (0-10초): 출혈 확산 + 개선된 소용돌이 활용' :
                  '⚡ 광역 시작 (0-10초): 우레 작렬 + 광역 출혈로 지속 딜'}
              </p>

              {/* 타임라인 스타일 스킬 시퀀스 */}
              <div style={{ position: 'relative', paddingLeft: '40px' }}>
                {/* 타임라인 라인 */}
                <div style={{
                  position: 'absolute',
                  left: '15px',
                  top: '0',
                  bottom: '0',
                  width: '3px',
                  background: selectedTier === 'slayer' ?
                    'linear-gradient(to bottom, #ffa500, #9482C9)' :
                    'linear-gradient(to bottom, #ffa500, #32CD32)',
                  borderRadius: '2px'
                }} />

                {currentContent.aoe.opener.map((skill, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: index < currentContent.aoe.opener.length - 1 ? '12px' : '0',
                    position: 'relative'
                  }}>
                    {/* 타임라인 도트 */}
                    <div style={{
                      position: 'absolute',
                      left: '-33px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: index === 0 ? '#ffa500' : index === 1 || index === 2 ? '#ff6b6b' : selectedTier === 'slayer' ? '#9482C9' : '#32CD32',
                      border: '2px solid rgba(0, 0, 0, 0.5)',
                      zIndex: 1
                    }} />

                    {/* 스킬 아이콘 및 설명 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <SkillIcon skill={skill} size="medium" />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <SkillIcon skill={skill} textOnly={true} />
                          <span style={{
                            fontSize: '0.8rem',
                            color: '#888',
                            fontWeight: 'normal'
                          }}>
                            {index === 0 && '(시작)'}
                            {index === 1 && selectedTier === 'slayer' && '(12초 버스트)'}
                            {index === 1 && selectedTier === 'mountainThane' && '(12초 버스트)'}
                            {index === 2 && selectedTier === 'slayer' && '(20초 버스트)'}
                            {index === 2 && selectedTier === 'mountainThane' && '(20초 버스트)'}
                            {index === 3 && selectedTier === 'slayer' && '(광역 출혈 DoT)'}
                            {index === 3 && selectedTier === 'mountainThane' && '(광역 번개)'}
                            {index === 4 && selectedTier === 'slayer' && '(개선된 소용돌이)'}
                            {index === 4 && selectedTier === 'mountainThane' && '(광역 출혈 DoT)'}
                            {index === 5 && selectedTier === 'slayer' && '(분노 80 소비)'}
                            {index === 5 && selectedTier === 'mountainThane' && '(개선된 소용돌이)'}
                            {index === 6 && selectedTier === 'mountainThane' && '(분노 80 소비)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(255, 165, 0, 0.1)',
                borderRadius: '6px',
                borderLeft: '3px solid #ffa500'
              }}>
                <p style={{ fontSize: '0.85rem', color: '#ffa500', margin: 0 }}>
                  💡 <strong>핵심:</strong> {' '}
                  {selectedTier === 'slayer' ?
                    '천둥의 포효로 광역 출혈 적용 후 소용돌이로 광역 딜 확산' :
                    '우레 작렬 + 천둥의 포효 조합으로 티어 세트 시너지 극대화 (쿨 6초 감소)'}
                </p>
              </div>
            </div>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>🔄 스킬 우선순위 (플로우차트)</h4>

            {/* 우선순위 플로우차트 스타일 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: `1px solid ${selectedTier === 'slayer' ? 'rgba(148, 130, 201, 0.2)' : 'rgba(50, 205, 50, 0.2)'}`
            }}>
              {currentContent.aoe.priority.map((item, index) => (
                <div key={index} style={{
                  marginBottom: index < currentContent.aoe.priority.length - 1 ? '15px' : '0'
                }}>
                  {/* 우선순위 카드 */}
                  <div style={{
                    background: index === 0 ? 'rgba(255, 107, 107, 0.15)' :
                               index === 1 ? 'rgba(255, 165, 0, 0.15)' :
                               index === 2 ? selectedTier === 'slayer' ? 'rgba(148, 130, 201, 0.15)' : 'rgba(50, 205, 50, 0.15)' : 'rgba(100, 100, 100, 0.1)',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    border: `1px solid ${index === 0 ? '#ff6b6b' : index === 1 ? '#ffa500' : index === 2 ? (selectedTier === 'slayer' ? '#9482C9' : '#32CD32') : '#666'}`,
                    position: 'relative'
                  }}>
                    {/* 우선순위 번호 배지 */}
                    <div style={{
                      position: 'absolute',
                      left: '-10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: index === 0 ? '#ff6b6b' : index === 1 ? '#ffa500' : index === 2 ? (selectedTier === 'slayer' ? '#9482C9' : '#32CD32') : '#666',
                      color: '#fff',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      border: '2px solid rgba(0, 0, 0, 0.5)'
                    }}>
                      {index + 1}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginLeft: '20px'
                    }}>
                      <SkillIcon skill={item.skill} size="small" />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.95rem',
                          fontWeight: 'bold',
                          marginBottom: '4px',
                          color: index === 0 ? '#ff6b6b' : index === 1 ? '#ffa500' : index === 2 ? (selectedTier === 'slayer' ? '#9482C9' : '#32CD32') : '#ccc'
                        }}>
                          <SkillIcon skill={item.skill} textOnly={true} />
                        </div>
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#ccc',
                          lineHeight: '1.5'
                        }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 조건부 화살표 */}
                  {index < currentContent.aoe.priority.length - 1 && (
                    <div style={{
                      textAlign: 'center',
                      padding: '5px 0',
                      color: '#666',
                      fontSize: '1.2rem'
                    }}>
                      ↓
                    </div>
                  )}
                </div>
              ))}

              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: selectedTier === 'slayer' ? 'rgba(148, 130, 201, 0.1)' : 'rgba(50, 205, 50, 0.1)',
                borderRadius: '6px',
                borderLeft: `3px solid ${selectedTier === 'slayer' ? '#9482C9' : '#32CD32'}`
              }}>
                <p style={{ fontSize: '0.85rem', color: selectedTier === 'slayer' ? '#9482C9' : '#32CD32', margin: 0 }}>
                  🎯 <strong>목표:</strong> {' '}
                  {selectedTier === 'slayer' ?
                    '개선된 소용돌이 버프 유지, Execute 광역화로 여러 적 동시 처형' :
                    '우레 작렬 광역 피해 극대화 (5명 타격 시 티어 4세트 10% 공격력)'}
                </p>
              </div>
            </div>
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

            {selectedTier === 'slayer' ? (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff6b6b', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ 격노 버프 유지율 극대화 (90%+ 목표)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>격노 지속시간:</strong> 12초 (가속 25% + 피해 20% 증가)
                    </li>
                    <li>
                      <strong>트리거 스킬:</strong> <SkillIcon skill={skillData.bloodthirst} textOnly={true} /> (4.5초 쿨) 또는 <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> 치명타
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심 원칙:</strong> 격노 버프가 없으면 즉시 <SkillIcon skill={skillData.rampage} textOnly={true} /> 사용 (분노 80)
                    </li>
                    <li>
                      <strong>효율 관리:</strong> 격노 버프 3초 이하 남았을 때 <SkillIcon skill={skillData.rampage} textOnly={true} /> 재사용 준비
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>티어 2세트:</strong> <SkillIcon skill={skillData.recklessness} textOnly={true} /> 사용 시 격노 3초 연장
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🎯 처형 표식 시스템 (학살자 핵심)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>처형 표식 획득:</strong> <SkillIcon skill={skillData.execute} textOnly={true} /> 사용 시 1중첩 (최대 3중첩)
                    </li>
                    <li>
                      <strong>2중첩 이상 효과:</strong> <SkillIcon skill={skillData.execute} textOnly={true} /> 피해 20% 증가
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>최우선 규칙:</strong> 2중첩 이상 시 다른 스킬보다 <SkillIcon skill={skillData.execute} textOnly={true} /> 우선
                    </li>
                    <li>
                      <strong>Execute 구간 (20% 이하):</strong> <SkillIcon skill={skillData.execute} textOnly={true} />가 <SkillIcon skill={skillData.rampage} textOnly={true} />보다 우선순위 높음
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>갑작스런 죽음 프락:</strong> 20% 이상에서도 <SkillIcon skill={skillData.execute} textOnly={true} /> 사용 가능 (2중첩 시 즉시 사용)
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#28a745', fontSize: '1.1rem', marginBottom: '15px' }}>
                    💥 학살의 일격 중첩 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>중첩 획득:</strong> <SkillIcon skill={skillData.bloodthirst} textOnly={true} /> 또는 <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> 사용 시 1중첩
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>5중첩 효과:</strong> 다음 <SkillIcon skill={skillData.rampage} textOnly={true} /> 피해 20% 증가
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심 타이밍:</strong> 5중첩 도달 시 즉시 <SkillIcon skill={skillData.rampage} textOnly={true} /> 사용하여 중첩 소모
                    </li>
                    <li>
                      <strong>버스트 타이밍:</strong> <SkillIcon skill={skillData.recklessness} textOnly={true} /> + <SkillIcon skill={skillData.avatar} textOnly={true} /> 중 5중첩 <SkillIcon skill={skillData.rampage} textOnly={true} /> 우선
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚔️ 잔혹한 마무리 프락 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>프락 조건:</strong> <SkillIcon skill={skillData.rampage} textOnly={true} /> 사용 시 확률로 발동
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>효과:</strong> 다음 <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> 피해 크게 증가 + 재사용 대기시간 초기화
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>최우선 사용:</strong> 버프 활성 시 즉시 <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> 사용 (버프 낭비 방지)
                    </li>
                    <li>
                      <strong>Execute 구간:</strong> 잔혹한 마무리 > 처형 표식 2중첩 <SkillIcon skill={skillData.execute} textOnly={true} />
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#9b59b6', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🔥 쿨기 동기화 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>표준 버스트:</strong> <SkillIcon skill={skillData.recklessness} textOnly={true} /> + <SkillIcon skill={skillData.avatar} textOnly={true} /> 동시 사용
                    </li>
                    <li>
                      <strong>쿨기 지속시간:</strong> <SkillIcon skill={skillData.recklessness} textOnly={true} /> 12초 / <SkillIcon skill={skillData.avatar} textOnly={true} /> 20초
                    </li>
                    <li>
                      <strong>버스트 중 우선순위:</strong> 학살의 일격 5중첩 <SkillIcon skill={skillData.rampage} textOnly={true} /> > <SkillIcon skill={skillData.execute} textOnly={true} /> (2중첩) > <SkillIcon skill={skillData.ragingBlow} textOnly={true} />
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}><SkillIcon skill={skillData.championsSpear} textOnly={true} /> 타이밍:</strong> <SkillIcon skill={skillData.recklessness} textOnly={true} /> 직후 사용 (분노 10 생성 + 4초 DoT)
                    </li>
                    <li>
                      <strong>티어 4세트:</strong> <SkillIcon skill={skillData.rampage} textOnly={true} /> 사용 시 격노 중 공격력 추가 8% 증가
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff9800', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚠️ 분노 관리 전략
                  </h4>

                  {/* 분노 게이지 시각화 */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    border: '1px solid rgba(255, 152, 0, 0.3)'
                  }}>
                    <p style={{ fontSize: '0.9rem', color: '#ffa500', marginBottom: '12px', fontWeight: 'bold' }}>
                      📊 분노 게이지 관리
                    </p>

                    {/* 게이지 바 */}
                    <div style={{
                      position: 'relative',
                      height: '40px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '2px solid rgba(255, 152, 0, 0.5)',
                      marginBottom: '15px'
                    }}>
                      {/* 위험 구간 (0-40) - 빨간색 */}
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '0',
                        width: '33.3%',
                        background: 'linear-gradient(90deg, rgba(220, 53, 69, 0.3), rgba(220, 53, 69, 0.2))'
                      }} />

                      {/* 이상적 구간 (40-60) - 초록색 */}
                      <div style={{
                        position: 'absolute',
                        left: '33.3%',
                        top: '0',
                        bottom: '0',
                        width: '16.7%',
                        background: 'linear-gradient(90deg, rgba(40, 167, 69, 0.4), rgba(40, 167, 69, 0.3))'
                      }} />

                      {/* 안전 구간 (60-80) - 노란색 */}
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '0',
                        bottom: '0',
                        width: '16.7%',
                        background: 'linear-gradient(90deg, rgba(255, 193, 7, 0.3), rgba(255, 193, 7, 0.2))'
                      }} />

                      {/* 광란 사용 (80-120) - 주황색 */}
                      <div style={{
                        position: 'absolute',
                        left: '66.7%',
                        top: '0',
                        bottom: '0',
                        width: '33.3%',
                        background: 'linear-gradient(90deg, rgba(255, 165, 0, 0.4), rgba(255, 107, 107, 0.4))'
                      }} />

                      {/* 구간 표시선 */}
                      <div style={{
                        position: 'absolute',
                        left: '33.3%',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: '#dc3545'
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: '#28a745'
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: '66.7%',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: '#ffc107'
                      }} />

                      {/* 수치 표시 */}
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0 10px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: '#fff'
                      }}>
                        <span>0</span>
                        <span style={{ color: '#dc3545' }}>40</span>
                        <span style={{ color: '#28a745' }}>60</span>
                        <span style={{ color: '#ffc107' }}>80</span>
                        <span>120</span>
                      </div>
                    </div>

                    {/* 구간별 설명 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(220, 53, 69, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(220, 53, 69, 0.3)'
                      }}>
                        <strong style={{ color: '#dc3545' }}>0-40:</strong> <span style={{ color: '#ccc' }}>위험 (격노 끊김)</span>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(40, 167, 69, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(40, 167, 69, 0.3)'
                      }}>
                        <strong style={{ color: '#28a745' }}>40-60:</strong> <span style={{ color: '#ccc' }}>이상적 범위</span>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(255, 193, 7, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 193, 7, 0.3)'
                      }}>
                        <strong style={{ color: '#ffc107' }}>60-80:</strong> <span style={{ color: '#ccc' }}>광란 준비</span>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(255, 165, 0, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 165, 0, 0.3)'
                      }}>
                        <strong style={{ color: '#ffa500' }}>80-120:</strong> <span style={{ color: '#ccc' }}>즉시 광란 사용</span>
                      </div>
                    </div>
                  </div>

                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>이상적 범위:</strong> 40-60 분노 유지 (유연성 확보)
                    </li>
                    <li>
                      <strong>분노 생성:</strong> <SkillIcon skill={skillData.bloodthirst} textOnly={true} /> 8 / <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> 12 / <SkillIcon skill={skillData.charge} textOnly={true} /> 20
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>120 이상:</strong> 즉시 <SkillIcon skill={skillData.rampage} textOnly={true} /> 사용 (낭비 방지)
                    </li>
                    <li>
                      <strong>Execute 구간:</strong> 분노 20-40으로 <SkillIcon skill={skillData.execute} textOnly={true} /> 사용 (분노 소모량 조절 가능)
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.recklessness} textOnly={true} /> 중:</strong> 분노 생성 100% 증가 - 적극적 소비 필요
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🌪️ 광역 전투 학살자 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>개선된 소용돌이:</strong> <SkillIcon skill={skillData.whirlwind} textOnly={true} /> 사용 후 다음 2번 공격이 최대 4명 추가 타격
                    </li>
                    <li>
                      <strong>활용 순서:</strong> <SkillIcon skill={skillData.whirlwind} textOnly={true} /> → <SkillIcon skill={skillData.bloodthirst} textOnly={true} /> → <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> (각각 광역화)
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>Execute 구간:</strong> 소용돌이 버프로 <SkillIcon skill={skillData.execute} textOnly={true} />를 광역화하여 여러 적 동시 처형
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.thunderousRoar} textOnly={true} />:</strong> 12미터 광역 피해 + 8초 출혈 DoT (1.5분 쿨)
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#4ECDC4', fontSize: '1.2rem', marginBottom: '15px' }}>
                    ⚡ <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 쿨다운 관리 (산왕 핵심)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>재사용 대기시간:</strong> 6초 (분노 30 소모)
                    </li>
                    <li>
                      <strong>효과:</strong> 8미터 반경 번개 피해 + 20% 감속 10초
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>최우선 사용:</strong> 쿨다운 돌 때마다 즉시 사용 (딜 손실 최소화)
                    </li>
                    <li>
                      <strong>티어 2세트:</strong> <SkillIcon skill={skillData.thunderousRoar} textOnly={true} /> 사용 시 <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 쿨다운 6초 감소
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>티어 4세트:</strong> 타격한 적 1명당 공격력 2% 증가 (최대 10%, 5명 타격 시)
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff6b6b', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ 격노 버프 유지율 극대화 (90%+ 목표)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>격노 지속시간:</strong> 12초 (가속 25% + 피해 20% 증가)
                    </li>
                    <li>
                      <strong>트리거 스킬:</strong> <SkillIcon skill={skillData.bloodthirst} textOnly={true} /> (4.5초 쿨) 또는 <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> 치명타
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심 원칙:</strong> 격노 버프가 없으면 즉시 <SkillIcon skill={skillData.rampage} textOnly={true} /> 사용 (분노 80)
                    </li>
                    <li>
                      <strong>산왕 특화:</strong> <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 사용으로 분노 빠르게 소모 → 격노 유지에 유리
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#28a745', fontSize: '1.1rem', marginBottom: '15px' }}>
                    💥 학살의 일격 중첩 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>중첩 획득:</strong> <SkillIcon skill={skillData.bloodthirst} textOnly={true} /> 또는 <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> 사용 시 1중첩
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>5중첩 효과:</strong> 다음 <SkillIcon skill={skillData.rampage} textOnly={true} /> 피해 20% 증가
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심 타이밍:</strong> 5중첩 도달 시 즉시 <SkillIcon skill={skillData.rampage} textOnly={true} /> 사용하여 중첩 소모
                    </li>
                    <li>
                      <strong>산왕 전략:</strong> <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 쿨 동안 중첩 쌓기 → 5중첩 <SkillIcon skill={skillData.rampage} textOnly={true} /> 폭발
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚔️ 잔혹한 마무리 프락 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>프락 조건:</strong> <SkillIcon skill={skillData.rampage} textOnly={true} /> 사용 시 확률로 발동
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>효과:</strong> 다음 <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> 피해 크게 증가 + 재사용 대기시간 초기화
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>최우선 사용:</strong> 버프 활성 시 즉시 <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> 사용 (버프 낭비 방지)
                    </li>
                    <li>
                      <strong>우선순위:</strong> 잔혹한 마무리 > <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> > 다른 스킬
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#9b59b6', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🔥 쿨기 동기화 최적화 (산왕)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>표준 버스트:</strong> <SkillIcon skill={skillData.recklessness} textOnly={true} /> + <SkillIcon skill={skillData.avatar} textOnly={true} /> + <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 동시
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.championsSpear} textOnly={true} /> 타이밍:</strong> <SkillIcon skill={skillData.recklessness} textOnly={true} /> 직후 사용 (분노 10 생성 + 4초 DoT)
                    </li>
                    <li>
                      <strong style={{ color: '#4ECDC4' }}>티어 세트 시너지:</strong> <SkillIcon skill={skillData.thunderousRoar} textOnly={true} /> → <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 쿨 6초 감소 → 즉시 재사용
                    </li>
                    <li>
                      <strong>버스트 중 우선순위:</strong> <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> > 학살의 일격 5중첩 <SkillIcon skill={skillData.rampage} textOnly={true} /> > <SkillIcon skill={skillData.execute} textOnly={true} />
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff9800', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚠️ 분노 관리 전략 (산왕)
                  </h4>

                  {/* 분노 게이지 시각화 - 산왕 */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    border: '1px solid rgba(78, 205, 196, 0.3)'
                  }}>
                    <p style={{ fontSize: '0.9rem', color: '#4ECDC4', marginBottom: '12px', fontWeight: 'bold' }}>
                      📊 분노 게이지 관리 (산왕)
                    </p>

                    {/* 게이지 바 */}
                    <div style={{
                      position: 'relative',
                      height: '40px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '2px solid rgba(78, 205, 196, 0.5)',
                      marginBottom: '15px'
                    }}>
                      {/* 위험 구간 (0-30) - 빨간색 */}
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '0',
                        width: '25%',
                        background: 'linear-gradient(90deg, rgba(220, 53, 69, 0.3), rgba(220, 53, 69, 0.2))'
                      }} />

                      {/* 우레 작렬 준비 (30-50) - 청록색 */}
                      <div style={{
                        position: 'absolute',
                        left: '25%',
                        top: '0',
                        bottom: '0',
                        width: '16.7%',
                        background: 'linear-gradient(90deg, rgba(78, 205, 196, 0.4), rgba(78, 205, 196, 0.3))'
                      }} />

                      {/* 이상적 구간 (50-70) - 초록색 */}
                      <div style={{
                        position: 'absolute',
                        left: '41.7%',
                        top: '0',
                        bottom: '0',
                        width: '16.7%',
                        background: 'linear-gradient(90deg, rgba(40, 167, 69, 0.4), rgba(40, 167, 69, 0.3))'
                      }} />

                      {/* 광란 준비 (70-80) - 노란색 */}
                      <div style={{
                        position: 'absolute',
                        left: '58.3%',
                        top: '0',
                        bottom: '0',
                        width: '8.3%',
                        background: 'linear-gradient(90deg, rgba(255, 193, 7, 0.3), rgba(255, 193, 7, 0.2))'
                      }} />

                      {/* 광란 사용 (80-120) - 주황색 */}
                      <div style={{
                        position: 'absolute',
                        left: '66.7%',
                        top: '0',
                        bottom: '0',
                        width: '33.3%',
                        background: 'linear-gradient(90deg, rgba(255, 165, 0, 0.4), rgba(255, 107, 107, 0.4))'
                      }} />

                      {/* 구간 표시선 */}
                      <div style={{
                        position: 'absolute',
                        left: '25%',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: '#dc3545'
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: '41.7%',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: '#4ECDC4'
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: '58.3%',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: '#28a745'
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: '66.7%',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: '#ffc107'
                      }} />

                      {/* 수치 표시 */}
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0 10px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: '#fff'
                      }}>
                        <span>0</span>
                        <span style={{ color: '#dc3545' }}>30</span>
                        <span style={{ color: '#4ECDC4' }}>50</span>
                        <span style={{ color: '#28a745' }}>70</span>
                        <span style={{ color: '#ffc107' }}>80</span>
                        <span>120</span>
                      </div>
                    </div>

                    {/* 구간별 설명 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(220, 53, 69, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(220, 53, 69, 0.3)'
                      }}>
                        <strong style={{ color: '#dc3545' }}>0-30:</strong> <span style={{ color: '#ccc' }}>위험 (우레 작렬 사용 불가)</span>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(78, 205, 196, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(78, 205, 196, 0.3)'
                      }}>
                        <strong style={{ color: '#4ECDC4' }}>30-50:</strong> <span style={{ color: '#ccc' }}>우레 작렬 준비</span>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(40, 167, 69, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(40, 167, 69, 0.3)'
                      }}>
                        <strong style={{ color: '#28a745' }}>50-70:</strong> <span style={{ color: '#ccc' }}>이상적 범위</span>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        background: 'rgba(255, 165, 0, 0.15)',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 165, 0, 0.3)'
                      }}>
                        <strong style={{ color: '#ffa500' }}>80-120:</strong> <span style={{ color: '#ccc' }}>즉시 광란 사용</span>
                      </div>
                    </div>
                  </div>

                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>이상적 범위:</strong> 50-70 분노 유지 (<SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 30 + <SkillIcon skill={skillData.rampage} textOnly={true} /> 80)
                    </li>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>분노 부족 방지:</strong> <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 쿨 시 분노 30 이상 확보 필수
                    </li>
                    <li>
                      <strong>우선순위:</strong> <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 쿨 유지 > 분노 낭비 방지 (120+)
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.recklessness} textOnly={true} /> 중:</strong> 분노 생성 100% 증가 - <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 2-3회 사용 가능
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🌪️ 광역 전투 산왕 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#4ECDC4' }}><SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 광역:</strong> 8미터 반경 모든 적 타격 (5명 타격 시 티어 4세트 최대 효과)
                    </li>
                    <li>
                      <strong>개선된 소용돌이:</strong> <SkillIcon skill={skillData.whirlwind} textOnly={true} /> 사용 후 다음 2번 공격이 최대 4명 추가 타격
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>광역 순환:</strong> <SkillIcon skill={skillData.whirlwind} textOnly={true} /> → <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> → <SkillIcon skill={skillData.ragingBlow} textOnly={true} /> → <SkillIcon skill={skillData.bloodthirst} textOnly={true} />
                    </li>
                    <li>
                      <strong><SkillIcon skill={skillData.thunderousRoar} textOnly={true} />:</strong> 광역 DoT + <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> 쿨 6초 감소 (즉시 재사용)
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🎯 처형 표식 & Execute 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>처형 표식:</strong> <SkillIcon skill={skillData.execute} textOnly={true} /> 사용 시 1중첩 (최대 3중첩)
                    </li>
                    <li>
                      <strong>2중첩 이상:</strong> <SkillIcon skill={skillData.execute} textOnly={true} /> 피해 20% 증가
                    </li>
                    <li>
                      <strong style={{ color: '#32CD32' }}>갑작스런 죽음 프락:</strong> 2중첩 시 <SkillIcon skill={skillData.execute} textOnly={true} /> 즉시 사용
                    </li>
                    <li>
                      <strong>Execute 구간:</strong> <SkillIcon skill={skillData.thunderBlast} textOnly={true} /> > <SkillIcon skill={skillData.execute} textOnly={true} /> (2중첩) > <SkillIcon skill={skillData.rampage} textOnly={true} />
                    </li>
                  </ul>
                </div>
              </>
            )}

            <div>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>공통 생존 메커니즘</h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>
                  <SkillIcon skill={skillData.diebytheSword} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.diebytheSword} textOnly={true} /> - 8초간 받는 피해 30% 감소 + 100% 무기 막기 (2분 쿨)
                </li>
                <li>
                  <SkillIcon skill={skillData.rallyingCry} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.rallyingCry} textOnly={true} /> - 파티 전체 최대 생명력 10% 증가 10초 (3분 쿨)
                </li>
                <li>
                  <SkillIcon skill={skillData.berserkerRage} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.berserkerRage} textOnly={true} /> - 공포/혼절 해제 및 면역 6초 (1분 쿨)
                </li>
                <li>
                  <strong style={{ color: '#ffa500' }}>생명력 회복:</strong> <SkillIcon skill={skillData.bloodthirst} textOnly={true} /> 사용 시 생명력 3% 회복
                </li>
              </ul>
            </div>
          </div>
        </div>
      </HeroCard>
    </Section>
  );

  // 특성 빌드 데이터 - 분노 전사 TWW 시즌3
  const talentBuilds = {
    slayer: {  // 학살자 (Slayer)
      'raid-single': {
        name: '레이드 단일 대상',
        description: '학살자를 활용한 단일 대상 빌드입니다. 출혈 피해와 Execute 강화로 보스전에 특화되어 있습니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASSSikEJSSiQJJhEJSA',  // Slayer 레이드 단일
        icon: '⚔️'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '학살자를 활용한 광역 빌드입니다. 출혈 효과를 다수 대상에게 적용하여 지속 딜을 제공합니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASkkkEJSSiEJJhEJSA',  // Slayer 레이드 광역
        icon: '⚔️'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '학살자를 활용한 신화+ 빌드입니다. 빠른 처치와 출혈 피해로 쐐기돌에 최적화되어 있습니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASkkSSJSSiEJJhkESA',  // Slayer 쐐기돌
        icon: '⚔️'
      }
    },
    mountainThane: {  // 산왕 (Mountain Thane)
      'raid-single': {
        name: '레이드 단일 대상',
        description: '산왕을 활용한 단일 대상 빌드입니다. 천둥 피해로 안정적인 단일 딜을 제공합니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASSSSSkESSCJJhEJSA',  // Mountain Thane 레이드 단일
        icon: '⚡'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '산왕을 활용한 광역 빌드입니다. Thunder Blast로 강력한 광역 딜을 제공합니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASSSSkkkESSCJJhEJSA',  // Mountain Thane 레이드 광역
        icon: '⚡'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '산왕을 활용한 신화+ 빌드입니다. 천둥 피해와 광역 효과로 쐐기돌에 최적화되어 있습니다.',
        code: 'CwQAqjLKv2qfbjSJolSCJSkkSSJJJJJJAAAAAAAAAAAASSSkkSkESSCJJhkESA',  // Mountain Thane 쐐기돌
        icon: '⚡'
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
          {/* ⚠️ TODO: setSelectedTier 값을 실제 영웅특성명으로 변경 */}
          <button
            onClick={() => {
              setSelectedTier('slayer');
              setSelectedBuild('mythic-plus');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'slayer' ?
                'linear-gradient(135deg, #5a3896 0%, #2a1846 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'slayer' ? '#9482C9' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'slayer' ? '#9482C9' : '#94a3b8',
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
            <span style={{ fontSize: '1.5rem' }}>🔮</span>
            <span>영웅특성1</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>쐐기 추천</span>
          </button>

          <button
            onClick={() => {
              setSelectedTier('mountainThane');
              setSelectedBuild('raid-single');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'mountainThane' ?
                'linear-gradient(135deg, #2a7a46 0%, #1a3a26 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'mountainThane' ? '#32CD32' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'mountainThane' ? '#32CD32' : '#94a3b8',
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
            <span>영웅특성2</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>레이드 추천</span>
          </button>
        </div>

        {/* 빌드 선택 버튼들 */}
        <div style={{ padding: '20px' }}>
          {/* ⚠️ TODO: selectedTier 조건을 실제 영웅특성명으로 변경 */}
          <h4 style={{
            color: selectedTier === 'slayer' ? '#9482C9' : '#32CD32',
            marginBottom: '20px',
            fontSize: '1.3rem'
          }}>
            {selectedTier === 'slayer' ? '영웅특성1' : '영웅특성2'} 특성 빌드
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

      // 영웅 특성과 콘텐츠 타입별 브레이크포인트
      // ⚠️ TODO: 브레이크포인트 데이터 - 키를 실제 영웅특성명으로 변경하세요
      const breakpointData = {
        slayer: {  // 학살자 (Slayer)
          single: {
            haste: {
              softcap: '25-30%',
              breakpoints: [
                { value: 25, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 30, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: 'GCD 감소와 분노 생성 속도 향상, 격노 유지율 증가'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '치명타 시 분노 추가 생성, 격노 유지에 도움'
            },
            mastery: {
              breakpoints: [],
              note: '무모한 희생 중 피해 증가, 학살자 특성과 시너지'
            },
            versatility: {
              breakpoints: [],
              note: '가장 낮은 우선순위, 피해와 생존력 증가'
            }
          },
          aoe: {
            haste: {
              softcap: '25-30%',
              breakpoints: [
                { value: 25, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 30, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '빠른 분노 생성과 스킬 빈도 증가'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '광역 스킬 치명타로 폭딜 증가'
            },
            mastery: {
              breakpoints: [],
              note: '모든 피해 증가로 광역에서도 높은 가치'
            },
            versatility: {
              breakpoints: [],
              note: '가장 낮은 우선순위'
            }
          }
        },
        mountainThane: {  // 산왕 (Mountain Thane)
          single: {
            haste: {
              softcap: '25-30%',
              breakpoints: [
                { value: 25, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 30, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '우레 작렬 빈도 증가와 분노 생성 속도 향상'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '천둥 피해 치명타 확률 증가'
            },
            mastery: {
              breakpoints: [],
              note: '우레 작렬 피해 증가, 천둥 효과 강화'
            },
            versatility: {
              breakpoints: [],
              note: '가장 낮은 우선순위'
            }
          },
          aoe: {
            haste: {
              softcap: '25-30%',
              breakpoints: [
                { value: 25, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 30, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '최우선 스탯, 우레 작렬 빈도와 광역 딜 극대화'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '광역 천둥 피해 치명타로 폭딜'
            },
            mastery: {
              breakpoints: [],
              note: '우레 작렬과 천둥 피해 증가'
            },
            versatility: {
              breakpoints: [],
              note: '가장 낮은 우선순위'
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

    // 스탯 우선순위 - 분노 전사 TWW 시즌3
    const statPriorities = {
      slayer: {  // 학살자 (Slayer)
        single: ['haste', 'crit', 'mastery', 'versatility'],  // 단일: 가속 > 치명타 > 특화 > 유연
        aoe: ['haste', 'crit', 'mastery', 'versatility']  // 광역: 가속 > 치명타 > 특화 > 유연
      },
      mountainThane: {  // 산왕 (Mountain Thane)
        single: ['haste', 'crit', 'mastery', 'versatility'],  // 단일: 가속 > 치명타 > 특화 > 유연
        aoe: ['haste', 'mastery', 'crit', 'versatility']  // 광역: 가속 > 특화 > 치명타 > 유연 (우레 작렬 강화)
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
              onClick={() => setSelectedStatHero('slayer')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'slayer' ?
                  'linear-gradient(135deg, #8B6B47 0%, #5a4a2a 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'slayer' ? '#C69B6D' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'slayer' ? '#C69B6D' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ⚔️ 학살자
            </button>
            <button
              onClick={() => setSelectedStatHero('mountainThane')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'mountainThane' ?
                  'linear-gradient(135deg, #2a7a8a 0%, #1a4a5a 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'mountainThane' ? '#4ECDC4' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'mountainThane' ? '#4ECDC4' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ⚡ 산왕
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
              color: selectedStatHero === 'slayer' ? '#C69B6D' : '#4ECDC4',
              fontSize: '1.3rem',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{selectedStatHero === 'slayer' ? '⚔️' : '⚡'}</span>
              <span>{selectedStatHero === 'slayer' ? '학살자 (Slayer)' : '산왕 (Mountain Thane)'}</span>
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
                  ((selectedStatHero === 'slayer' && selectedStatMode === 'single' && index === 2) ||
                   (selectedStatHero === 'mountainThane' && index === 4));

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
                {selectedStatHero === 'slayer' && selectedStatMode === 'single' && (
                  <li>영웅특성1는 특화와 치명타가 동일한 가치를 가집니다</li>
                )}
                {selectedStatHero === 'mountainThane' && (
                  <li>영웅특성2는 가속과 치명타를 우선시합니다</li>
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
{`# TWW Season 3 Fury Warrior
scale_factors="1"
scale_factor_dps="1"
interpolation="1"
iterate="10000"
fight_style=patchwerk
max_time=300

# Stat Weights (영웅특성1 - 단일 대상)
haste=1.00      # 가속 (소프트캡 25-30%)
mastery=0.95    # 특화 (스킬 피해 증가)
crit=0.85       # 치명
versatility=0.70

# Stat Weights (영웅특성2 - 광역/쐐기)
haste=1.00      # 가속 (조각 생성 속도)
mastery=0.90    # 특화 (스킬 피해)
crit=0.80       # 치명
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
{`warrior="Fury_Warrior"
level=80
race=orc
spec=fury
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
                분노 전사 가이드
              </h1>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}>
                최종 수정일: 2025.10.03 | 작성: WoWMeta | 검수: TWW 시즌3 (11.2 패치)
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

export default FuryWarriorGuide;