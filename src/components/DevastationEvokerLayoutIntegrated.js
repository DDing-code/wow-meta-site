import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase';
import { devastationEvokerSkillData as skillData } from '../data/devastationEvokerSkillData';
import styles from './DevastationEvokerGuide.module.css';
import moduleEventBus from '../services/ModuleEventBus';
import aiFeedbackService from '../services/AIFeedbackService';
import externalGuideCollector from '../services/ExternalGuideCollector';
import realtimeGuideUpdater from '../services/RealtimeGuideUpdater';
import learningAIPatternAnalyzer from '../services/LearningAIPatternAnalyzer';
import { classIcons, WowIcon, getWowIcon, gameIcons } from '../utils/wowIcons';
import wowheadDescriptions from '../data/wowhead-descriptions.json';

// Guide 페이지의 통일된 테마 (DevastationEvoker 가이드 레이아웃)
const unifiedTheme = {
  colors: {
    primary: '#3FC6B0',      // 기원사 클래스 색상
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    accent: '#3FC6B0',
    border: '#2a2a3e',
    hover: 'rgba(63, 198, 176, 0.1)',
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
    if (props.heroType === 'flameshaper') {
      return 'linear-gradient(135deg, rgba(255, 107, 53, 0.05), rgba(255, 69, 0, 0.05))';
    } else if (props.heroType === 'scalecommander') {
      return 'linear-gradient(135deg, rgba(220, 53, 69, 0.05), rgba(139, 0, 0, 0.05))';
    }
    return props.theme.colors.surface;
  }};
  border: 2px solid ${props => {
    if (props.heroType === 'flameshaper') {
      return 'rgba(255, 215, 0, 0.3)';
    } else if (props.heroType === 'scalecommander') {
      return 'rgba(220, 53, 69, 0.3)';
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
      if (props.heroType === 'flameshaper') {
        return 'linear-gradient(90deg, #AAD372, #8BC34A)';
      } else if (props.heroType === 'scalecommander') {
        return 'linear-gradient(90deg, #DC3545, #8B0000)';
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

// 영웅특성별 콘텐츠 생성 함수 (SkillIcon 컴포넌트 사용을 위해 함수로 변경)
const getHeroContent = (SkillIcon) => ({
  flameshaper: {
    name: '불꽃형성자',
    icon: '🔥',
    tierSet: {
      '2set': (
        <>
          <SkillIcon skill={skillData.engulf} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.engulf} textOnly={true} />가
          {' '}<strong style={{ color: '#ff6b35' }}>내면의 불꽃</strong>을 활성화하여
          {' '}지속 피해를 <strong>40%</strong> 증가시키고
          {' '}<SkillIcon skill={skillData.essenceBurst} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.essenceBurst} textOnly={true} /> 획득 확률을
          {' '}<strong>50%</strong> 증가시킵니다 (12초, 최대 2중첩).
        </>
      ),
      '4set': (
        <>
          <strong style={{ color: '#ff6b35' }}>내면의 불꽃</strong> 중
          {' '}<SkillIcon skill={skillData.essenceBurst} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.essenceBurst} textOnly={true} /> 소비 시
          {' '}<strong>정수 폭탄</strong>을 발사하여
          {' '}주위 적에게 주문력의 <strong>400%</strong> 피해를 입힙니다
          {' '}(5명 초과 시 감소).
        </>
      )
    },
    singleTarget: {
      opener: [
        skillData.livingFlame,
        skillData.dragonRage,
        skillData.tipTheScales,
        skillData.fireBreath,
        skillData.shatteringStar,
        skillData.engulf,
        skillData.eternitySurge,
        skillData.disintegrate,
        skillData.livingFlame,
        skillData.azureStrike,
        skillData.disintegrate
      ],
      priority: [
        { skill: skillData.hover, desc: '3초 내 이동 필요 시' },
        { skill: skillData.dragonRage, desc: '쿨다운마다, 12초 미만 시 강화 주문으로 연장' },
        { skill: skillData.tipTheScales, desc: '다음 불의 숨결을 즉시 4단계로 (업화와 조합 시)' },
        { skill: skillData.livingFlame, desc: '용의 분노 중 불의 숨결 쿨 + 업화 있을 때 정수 폭발 모으기' },
        { skill: skillData.shatteringStar, desc: '최대 강화 불의 숨결 후, 또는 불의 숨결+업화 >15초' },
        { skill: skillData.fireBreath, desc: '4단계 (업화 준비 시), 1단계 (그 외)' },
        { skill: skillData.engulf, desc: '모든 DoT 활성화 시, 4단계 불의 숨결 후' },
        { skill: skillData.eternitySurge, desc: '1단계 (단일 타겟)' },
        { skill: skillData.livingFlame, desc: '도약하는 불꽃 활성 + 내면의 불꽃 + 정수 폭발 없을 때' },
        { skill: skillData.disintegrate, desc: '정수 폭발 또는 정수 사용 (내면의 불꽃 중 클리핑 가능)' },
        { skill: skillData.livingFlame, desc: '필러' },
        { skill: skillData.azureStrike, desc: '이동 중 호버 불가 시' }
      ]
    },
    aoe: {
      opener: [
        skillData.livingFlame,
        skillData.dragonRage,
        skillData.tipTheScales,
        skillData.fireBreath,
        skillData.engulf,
        skillData.eternitySurge,
        skillData.pyre,
        skillData.azureStrike,
        skillData.pyre,
        skillData.livingFlame
      ],
      priority: [
        { skill: skillData.dragonRage, desc: '쿨다운마다, AoE 상황에서 우선' },
        { skill: skillData.fireBreath, desc: '최대 강화로 광역 DoT 적용' },
        { skill: skillData.engulf, desc: '모든 DoT 활성화 시 (2차지 관리)' },
        { skill: skillData.eternitySurge, desc: '4단계 (최대 타겟 공격)' },
        { skill: skillData.pyre, desc: '3타겟 이상 (내면의 불꽃 중 우선)' },
        { skill: skillData.disintegrate, desc: '2타겟 상황' },
        { skill: skillData.azureStrike, desc: '정수 폭발 프록 (3타겟 동시 공격)' },
        { skill: skillData.livingFlame, desc: '2타겟 + 도약하는 불꽃 특성' }
      ]
    }
  },
  scalecommander: {
    name: '비늘사령관',
    icon: '🐉',
    tierSet: {
      '2set': (
        <>
          <SkillIcon skill={skillData.deepBreath} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.deepBreath} textOnly={true} /> 동안과 그 후
          {' '}<strong>10초</strong> 동안 <strong style={{ color: '#DC3545' }}>2명의 드랙티르 비행대</strong>가
          {' '}대상을 <SkillIcon skill={skillData.disintegrate} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.disintegrate} textOnly={true} />와
          {' '}<SkillIcon skill={skillData.pyre} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.pyre} textOnly={true} />로 공격합니다.
        </>
      ),
      '4set': (
        <>
          <strong style={{ color: '#DC3545' }}>비행대</strong>가 활성화된 동안
          {' '}<SkillIcon skill={skillData.massDisintegrate} size="small" className={styles.inlineIcon} />
          <SkillIcon skill={skillData.massDisintegrate} textOnly={true} />가 추가로
          {' '}<strong>2명</strong>의 대상을 공격하고,
          {' '}비행대가 <strong>5초</strong> 더 지속됩니다.
        </>
      )
    },
    singleTarget: {
      opener: [
        skillData.dragonRage,
        skillData.tipTheScales,
        skillData.deepBreath,
        skillData.shatteringStar,
        skillData.fireBreath,
        skillData.eternitySurge,
        skillData.disintegrate,
        skillData.livingFlame,
        skillData.disintegrate,
        skillData.azureStrike
      ],
      priority: [
        { skill: skillData.hover, desc: '이동 예상 시, 깊은 숨결 전 미끄러짐 특성과 2차지 사용' },
        { skill: skillData.dragonRage, desc: '쿨다운마다, 12초 미만 시 강화 주문으로 연장' },
        { skill: skillData.tipTheScales, desc: '다음 강화 주문을 즉시 최대 단계로 (버스트 타이밍)' },
        { skill: skillData.shatteringStar, desc: '정수 폭발 오버캡 없을 때 쿨다운마다' },
        { skill: skillData.deepBreath, desc: '쿨다운마다, 지휘관 중대의 8개 기염 사용 후' },
        { skill: skillData.fireBreath, desc: '1단계 (빠른 시전)' },
        { skill: skillData.eternitySurge, desc: '1단계, 힘의 급증 중 사용 금지' },
        { skill: skillData.livingFlame, desc: '도약하는 불꽃 + 용의 분노 + 정수 폭발 없을 때' },
        { skill: skillData.disintegrate, desc: '정수 폭발 또는 정수 사용' },
        { skill: skillData.livingFlame, desc: '필러' },
        { skill: skillData.azureStrike, desc: '이동 중 필러' }
      ]
    },
    aoe: {
      opener: [
        skillData.dragonRage,
        skillData.tipTheScales,
        skillData.deepBreath,
        skillData.fireBreath,
        skillData.eternitySurge,
        skillData.pyre,
        skillData.massDisintegrate,
        skillData.pyre,
        skillData.azureStrike,
        skillData.pyre
      ],
      priority: [
        { skill: skillData.deepBreath, desc: '쿨다운마다 (지휘관 중대 8개 기염)' },
        { skill: skillData.dragonRage, desc: '여러 타겟 존재 시' },
        { skill: skillData.massDisintegrate, desc: '충전된 폭발 12-20 중첩 생성' },
        { skill: skillData.pyre, desc: '충전된 폭발 20+ 중첩 시 소비' },
        { skill: skillData.shatteringStar, desc: '우선 타겟 지정' },
        { skill: skillData.fireBreath, desc: '최대 강화 (광역 피해)' },
        { skill: skillData.eternitySurge, desc: '4단계 (4타겟 공격)' },
        { skill: skillData.pyre, desc: '4+ 타겟 시 기본 사용' },
        { skill: skillData.azureStrike, desc: '정수 생성 및 광역 피해' }
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

const DevastationEvokerLayoutIntegrated = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [selectedTier, setSelectedTier] = useState('flameshaper');
  const [showToast, setShowToast] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState('raid-single');
  const [selectedStatHero, setSelectedStatHero] = useState('flameshaper');
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
          <h3 className={styles.subsectionTitle}>황폐 전문화 개요</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            황폐 기원사는 강력한 용의 마법을 사용하는 원거리 딜러 전문화입니다.
            TWW 시즌3에서는 <span style={{ color: '#FFD700', fontWeight: 'bold' }}>비늘사령관</span>와
            <span style={{ color: '#FF6B6B', fontWeight: 'bold' }}>불꽃형성자</span> 영웅특성이 모두 사용되며,
            특히 불꽃형성자가 현재 메타에서 강세를 보이고 있습니다.
          </p>

          <h3 className={styles.subsectionTitle} style={{ marginTop: '30px' }}>딜링 메커니즘</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            황폐 기원사는 <strong style={{ color: '#3FC6B0' }}>강력한 용의 마법과 폭발적인 화염을 사용하는 원거리 전문화</strong>입니다.
            대부분의 피해는 강화 주문과 정수 관리를 통해 이루어지며, 이는
            <SkillIcon skill={skillData.fireBreath} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.fireBreath} textOnly={true} />과 {' '}
            <SkillIcon skill={skillData.eternitySurge} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.eternitySurge} textOnly={true} />의 강화 단계 조절로 극대화됩니다.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            핵심 시너지는
            <SkillIcon skill={skillData.essenceBurst} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.essenceBurst} textOnly={true} /> 프록을 통한 무료 강화 주문과,
            <SkillIcon skill={skillData.dragonRage} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.dragonRage} textOnly={true} /> 및
            <SkillIcon skill={skillData.shatteringStar} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.shatteringStar} textOnly={true} /> 같은
            강력한 쿨기 동안 피해량을 폭발적으로 증가시키는 것입니다.
            <SkillIcon skill={skillData.giantSlayer} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.giantSlayer} textOnly={true} />는 적 체력 비율에 따라 피해를 증가시킵니다.
          </p>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>핵심 스킬</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {Object.values(skillData).slice(0, 6).map((skill) => (
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
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{skill.cooldown || '즉시'}</div>
                </div>
              </div>
            ))}
          </div>

          <h4 ref={subSectionRefs['overview-resource']} style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>리소스 시스템</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li>주 자원: <span style={{ color: '#4fc3f7', fontWeight: 'bold' }}>정수</span> (0-5)</li>
            <li>정수 폭발: <SkillIcon skill={skillData.livingFlame} textOnly={true} />와 <SkillIcon skill={skillData.azureStrike} textOnly={true} />로 프록 (무료 시전)</li>
            <li>정수 소비: <SkillIcon skill={skillData.disintegrate} textOnly={true} /> (-3), <SkillIcon skill={skillData.pyre} textOnly={true} /> (-2)</li>
            <li>강화 주문: <SkillIcon skill={skillData.fireBreath} textOnly={true} />, <SkillIcon skill={skillData.eternitySurge} textOnly={true} /> (정수 소비 없음)</li>
            <li>정수 생성: 시간 경과로 자동 재생 (최대 5개)</li>
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
              className={`${styles.tierTab} ${selectedTier === 'flameshaper' ? styles.active : ''}`}
              onClick={() => setSelectedTier('flameshaper')}
            >
              <span className={styles.tierIcon}>🔥</span> 불꽃형성자
            </button>
            <button
              className={`${styles.tierTab} ${selectedTier === 'scalecommander' ? styles.active : ''}`}
              onClick={() => setSelectedTier('scalecommander')}
            >
              <span className={styles.tierIcon}>⚡</span> 비늘사령관
            </button>
          </div>

          {/* 티어 세트 효과 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-tier']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'flameshaper' ? '#AAD372' : '#DC3545'
            }}>티어 세트 효과</h3>
            <div className={styles.tierBonuses} style={{
              background: selectedTier === 'flameshaper'
                ? 'linear-gradient(135deg, rgba(170, 211, 114, 0.1), rgba(170, 211, 114, 0.05))'
                : 'linear-gradient(135deg, rgba(184, 150, 216, 0.1), rgba(184, 150, 216, 0.05))',
              padding: '1.5rem',
              borderRadius: '8px',
              border: selectedTier === 'flameshaper'
                ? '1px solid rgba(170, 211, 114, 0.3)'
                : '1px solid rgba(184, 150, 216, 0.3)'
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
            border: selectedTier === 'flameshaper'
              ? '1px solid rgba(170, 211, 114, 0.3)'
              : '1px solid rgba(184, 150, 216, 0.3)'
          }}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'flameshaper' ? '#AAD372' : '#DC3545'
            }}>영웅 특성 딜링 메커니즘</h3>

            {selectedTier === 'flameshaper' ? (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#AAD372' }}>불꽃형성자</strong>는 {' '}
                  <strong style={{ color: '#AAD372' }}>강력한 DoT 관리와 업화 콤보</strong>로 지속적인 화염 피해를 제공합니다.
                  티어 세트와 결합 시 내면의 불꽃 효과로
                  <strong style={{ color: '#ffa500' }}>정수 폭탄이 활성화되어 폭발적인 버스트</strong>를 발휘합니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#AAD372', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.engulf} size="small" className={styles.inlineIcon} />
                    업화 - 핵심 버스트 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li><strong style={{ color: '#ff6b6b' }}>불의 숨결</strong> DoT가 있는 대상에게 즉시 피해</li>
                    <li><strong style={{ color: '#ffa500' }}>2 차지 보유</strong>: 유연한 버스트 타이밍 조절</li>
                    <li><strong style={{ color: '#AAD372' }}>내면의 불꽃 활성화</strong>: 정수 폭탄 발동</li>
                  </ul>
                  <p style={{ color: '#e0e0e0', fontSize: '0.95rem' }}>
                    티어 2세트 효과로 DoT 피해가 <strong style={{ color: '#ffa500' }}>15% 증가</strong>하며,
                    4세트 효과로 {' '}
                    <SkillIcon skill={skillData.engulf} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.engulf} textOnly={true} /> 사용 시 {' '}
                    <strong style={{ color: '#ffa500' }}>내면의 불꽃</strong>이 활성화됩니다.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#AAD372', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.fireBreath} size="small" className={styles.inlineIcon} />
                    불의 숨결 - DoT 관리의 핵심
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>강화 4단계</strong>: 업화와 조합 시 최대 피해
                    </li>
                    <li>
                      <strong style={{ color: '#AAD372' }}>지속 피해</strong>: 100% 업타임 유지 필수
                    </li>
                    <li>
                      <strong>최적 위치</strong>: 가장 많은 적을 관통하도록 사전 포지셔닝 필수
                    </li>
                    <li>
                      <strong>시전 타이밍</strong>: 적이 이동하지 않을 때 사용하여 피해 최대화
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: 불의 숨결은 강화 중에도 방향 전환이 가능합니다. 호버를 활용하면 이동하면서도 시전할 수 있어요.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 변화</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <SkillIcon skill={skillData.dragonRage} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.dragonRage} textOnly={true} />와 {' '}
                      <SkillIcon skill={skillData.tipTheScales} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.tipTheScales} textOnly={true} />를 조합하여 버스트 극대화
                    </li>
                    <li>
                      <SkillIcon skill={skillData.hover} size="small" className={styles.inlineIcon} />
                      <strong style={{ color: '#AAD372' }}><SkillIcon skill={skillData.hover} textOnly={true} />로 이동 중 시전</strong> 가능
                    </li>
                    <li>레이드 단일 대상 전투에서 특히 강력 - 지속적인 DoT와 버스트 콤보</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <strong style={{ color: '#DC3545' }}>비늘사령관</strong>는 {' '}
                  <strong style={{ color: '#AAD372' }}>현재 메타에서 압도적인 성능</strong>을 자랑합니다.
                  <SkillIcon skill={skillData.massDisintegrate} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.massDisintegrate} textOnly={true} />로 여러 적에게 동시 피해를 주며, {' '}
                  <SkillIcon skill={skillData.chargedBlast} size="small" className={styles.inlineIcon} />
                  <strong style={{ color: '#DC3545' }}><SkillIcon skill={skillData.chargedBlast} textOnly={true} /></strong> 중첩으로 {' '}
                  <strong style={{ color: '#ffa500' }}>기염의 폭발적인 피해</strong>를 입힙니다.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#DC3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.deepBreath} size="small" className={styles.inlineIcon} />
                    깊은 숨결 - 폭발적인 AoE 버스트
                  </h4>
                  <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>핵심:</strong> 쿨다운마다 즉시 사용
                    </li>
                    <li>
                      <SkillIcon skill={skillData.bombardments} size="small" className={styles.inlineIcon} />
                      <strong><SkillIcon skill={skillData.bombardments} textOnly={true} /></strong> 특성으로 쿨다운 1분 감소
                    </li>
                    <li>
                      경로상의 모든 적에게 강력한 화염 피해
                    </li>
                    <li>
                      <SkillIcon skill={skillData.massDisintegrate} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.massDisintegrate} textOnly={true} />와 조합하여 사용
                    </li>
                    <li>
                      4+ 타겟에서는 <strong style={{ color: '#ff6b6b' }}>기염 기본</strong>
                    </li>
                  </ul>
                  <p style={{ color: '#ffa500', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    💡 프로 팁: 대규모 파열 사용 후 충전된 폭발 중첩으로 기염 폭발을 극대화하세요.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>플레이스타일 변화</h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>대규모 파열을 핵심으로</strong> -
                      모든 AoE 상황에서 우선 사용
                    </li>
                    <li>
                      <SkillIcon skill={skillData.chargedBlast} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.chargedBlast} textOnly={true} /> 중첩 관리가 핵심
                    </li>
                    <li>
                      대상 수에 관계없이 <strong>폭발적인 피해</strong> 가능
                    </li>
                    <li>쐐기돌 던전과 레이드 쾌페이즈에서 최고 성능 발휘</li>
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
              <p style={{ color: '#AAD372', fontSize: '0.95rem', margin: 0 }}>
                <strong>💡 추천 콘텐츠:</strong> {' '}
                {selectedTier === 'flameshaper' ?
                  '쐐기돌 던전, 다수 몹 구간이 많은 레이드' :
                  '단일 보스 레이드, 긴 전투 시간의 보스전'}
              </p>
            </div>
          </div>

          {/* 단일 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-single']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'flameshaper' ? '#AAD372' : '#DC3545',
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
                {selectedTier === 'flameshaper' ?
                  '⏱️ 전투 2초 전: 살아있는 불꽃 사전 시전으로 정수 생성' :
                  '⏱️ 전투 직전: 살아있는 불꽃으로 버프 준비'}
              </p>
              <div className={styles.skillSequence}>
                {currentContent.singleTarget.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <span className={styles.arrow}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              {selectedTier === 'flameshaper' && (
                <p style={{ fontSize: '0.85rem', color: '#AAD372', marginTop: '10px' }}>
                  💡 팁: 불의 숨결은 1-2단계로 DoT 적용 후 업화로 폭발
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
              color: selectedTier === 'flameshaper' ? '#AAD372' : '#DC3545',
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

            {selectedTier === 'flameshaper' ? (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#AAD372', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.engulf} size="small" className={styles.inlineIcon} />
                    업화 및 내면의 불꽃 시너지
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <SkillIcon skill={skillData.fireBreath} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.fireBreath} textOnly={true} /> DoT가 있는 대상에게만 사용 가능
                    </li>
                    <li>
                      <SkillIcon skill={skillData.engulf} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.engulf} textOnly={true} /> 사용 후 내면의 불꽃 버프 획득
                    </li>
                    <li>티어 2세트: DoT 피해 15% 증가</li>
                    <li>
                      티어 4세트: 내면의 불꽃 중 {' '}
                      <SkillIcon skill={skillData.essenceBurst} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.essenceBurst} textOnly={true} /> 사용 시 정수 폭탄 발사
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심:</strong> 업화는 불의 숨결 지속 시간과 관계없이 항상 같은 피해
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🎯 살아있는 불꽃 vs 하늘빛 일격 결정 가이드
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>단일 타겟:</strong>
                      <ul style={{ marginLeft: '20px', marginTop: '10px', fontSize: '0.9em' }}>
                        <li>정수 부족 시 → <SkillIcon skill={skillData.livingFlame} textOnly={true} /></li>
                        <li><SkillIcon skill={skillData.burnout} textOnly={true} />/<SkillIcon skill={skillData.iridescence} textOnly={true} />/<SkillIcon skill={skillData.scarletAdaptation} textOnly={true} /> 있을 때 → <SkillIcon skill={skillData.livingFlame} textOnly={true} /></li>
                        <li>버프 없을 때 → <SkillIcon skill={skillData.azureStrike} textOnly={true} /> (정수 폭발 획득)</li>
                      </ul>
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>AoE 상황:</strong>
                      <ul style={{ marginLeft: '20px', marginTop: '10px', fontSize: '0.9em' }}>
                        <li>2 타겟: <SkillIcon skill={skillData.leapingFlames} textOnly={true} />과 함께 <SkillIcon skill={skillData.livingFlame} textOnly={true} /></li>
                        <li>3+ 타겟: 하늘빛 일격 우선</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#28a745', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🌿 녹색 주문의 공격적 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <SkillIcon skill={skillData.emeraldBlossom} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.emeraldBlossom} textOnly={true} />과 신록의 품으로 <SkillIcon skill={skillData.scarletAdaptation} textOnly={true} /> 즉시 최대 중첩
                    </li>
                    <li>
                      <SkillIcon skill={skillData.ancientFlame} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.ancientFlame} textOnly={true} /> 사용 시 <SkillIcon skill={skillData.livingFlame} textOnly={true} /> 시전속도 증가
                    </li>
                    <li>
                      <strong>사용 시점:</strong> 버프 없는 필러 스킬 대신 사용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🔥 <SkillIcon skill={skillData.leapingFlames} textOnly={true} />의 단일타겟 시너지
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>용의 분노 중:</strong> 아군 힐링 시 정수 폭발 2개 생성
                    </li>
                    <li>
                      <SkillIcon skill={skillData.scarletAdaptation} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.scarletAdaptation} textOnly={true} /> 효율적 중첩
                    </li>
                    <li>
                      단일타겟 살아있는 불꽃 강화 효과
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    💨 깊은 숨결 사용 조건 (불꽃형성자)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>하늘의 공포 특성으로 기절 필요 시</li>
                    <li>2타겟에서 살아있는 불꽃/하늘빛 일격 대체</li>
                    <li>2+ 타겟 상황에서 용의 분노 외</li>
                    <li>최소 이동 거리로 피해만 주는 용도</li>
                    <li>이동 필요하거나 이속 감소/속박 해제 시</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ 파열 체이닝 메커니즘 상세
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>체이닝 타이밍:</strong> 파열 채널링 중 80-90% 시점에서 다음 파열 시전
                    </li>
                    <li>
                      <strong>이점:</strong> 시전 시간 없이 연속 파열로 DPS 증가
                    </li>
                    <li>
                      <strong>정수 관리:</strong> 최소 6 정수 필요 (파열 2회분)
                    </li>
                    <li>
                      <strong>최적 타이밍:</strong> 4틱 후 즉시 다음 시전 (약 2.4초)
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff6b6b', fontSize: '1.2rem', marginBottom: '15px' }}>
                    🔥 대규모 파열 광딜 메커니즘
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>핵심:</strong> {' '}
                      <SkillIcon skill={skillData.massDisintegrate} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.massDisintegrate} textOnly={true} />를 모든 AoE 상황에서 사용
                    </li>
                    <li>
                      대규모 파열 3초 → 충전된 폭발 12-20 중첩 → 기염 폭발
                    </li>
                    <li>
                      타겟 수에 관계없이 <strong style={{ color: '#ffa500' }}>모든 적에게 동시 피해</strong>
                    </li>
                    <li>
                      4+ 타겟에서는 기염을 기본 스킬로 사용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#DC3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.chargedBlast} size="small" className={styles.inlineIcon} />
                    충전된 폭발 중첩 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <SkillIcon skill={skillData.massDisintegrate} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.massDisintegrate} textOnly={true} />로 충전된 폭발 중첩 생성
                    </li>
                    <li>최적 중첩: 12-20 이상에서 기염 사용</li>
                    <li>
                      티어 4세트로 {' '}
                      추가 폭발 효과 강화
                    </li>
                    <li>3+ 타겟 이상에서 기염 우선 사용</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#9b59b6', fontSize: '1.2rem', marginBottom: '15px' }}>
                    ⚡ 파열 체이닝 메커니즘 (고급)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>기본 개념:</strong> 파열 채널링 중 다음 파열을 미리 시전
                    </li>
                    <li>
                      <strong>체이닝 타이밍:</strong> 3번째 틱 이후 (약 2초 지점)
                    </li>
                    <li>
                      <strong style={{ color: '#dc3545' }}>⚠️ 중요:</strong> 대규모 파열 → 일반 파열 체이닝 금지 (25% 버프 손실)
                    </li>
                    <li>
                      <strong>올바른 체이닝:</strong>
                      <ul style={{ marginLeft: '20px', marginTop: '10px', fontSize: '0.9em' }}>
                        <li>대규모 파열 → 대규모 파열 ✅</li>
                        <li>일반 파열 → 일반 파열 ✅</li>
                        <li>대규모 파열 → 일반 파열 ❌</li>
                      </ul>
                    </li>
                    <li>
                      <strong>얼리 체이닝:</strong> 용의 분노 중 정수 과다 시 2번째 틱 이후 가능
                    </li>
                    <li>
                      <strong>클리핑:</strong> 산산이 부서지는 별/불의 숨결/영원의 쇄도를 위해서만 파열 취소
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#ff9800', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🐉 깊은 숨결 최적화 (비늘사령관)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>철칙:</strong> 재사용 대기시간마다 즉시 사용
                    </li>
                    <li>
                      초급술 배웠으면 키바인드 스팸으로 조기 취소 가능
                    </li>
                    <li>
                      폭격 특성으로 재사용 대기시간 1분 감소
                    </li>
                    <li>
                      사령부 편대의 8개 기염 모두 소진 후 사용
                    </li>
                  </ul>
                </div>
              </>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>
                <SkillIcon skill={skillData.dragonRage} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.dragonRage} textOnly={true} /> 최적화
              </h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>버스트 윈도우에서 최대한 많은 <SkillIcon skill={skillData.disintegrate} textOnly={true} /> 시전</li>
                <li>사용 효과 장신구와 물약을 함께 사용하여 딜 극대화</li>
                <li>정수 생성률 100% 증가 효과 활용</li>
                <li>지속시간 18초 동안 강화 주문 최대한 활용</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>정수 관리</h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>3-5 정수 유지가 이상적</li>
                <li><SkillIcon skill={skillData.livingFlame} textOnly={true} />으로 +1 정수 획득</li>
                <li><SkillIcon skill={skillData.azureStrike} textOnly={true} />으로 정수 획득 및 즉시 시전 가능</li>
                <li>정수 최대치 5개를 넘지 않도록 주의</li>
              </ul>
            </div>
          </div>
        </div>
      </HeroCard>
    </Section>
  );

  // 특성 빌드 데이터
  const talentBuilds = {
    scalecommander: {
      'raid-single': {
        name: '레이드 단일 대상',
        description: '단일 보스전에 최적화된 빌드입니다. 깊은 숨결과 대규모 파열로 강력한 버스트를 제공합니다.',
        code: 'BYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAptNLbTzMzMzMzMTzMzMzMzYGYmBkllZmlllZmZmZmFAAAAAAAAAAAAAAAzMzMzMzMzMwsMaWmZmZmZmZA',
        icon: '⚡'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '다수의 적이 있는 상황에서 사용하는 빌드입니다. 기염과 충전된 폭발로 강력한 광역 딜을 제공합니다.',
        code: 'BYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAptNLbTzMzMzMzMTzMzMzMzYGYmBkllZmlllZmZmZmFAAAAAAAAAAAAAAAzMzMzMzMzMwsMaWmZmZmZmZA',
        icon: '⚡'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '신화+ 던전에 최적화된 빌드입니다. 광역 딜과 유틸리티에 중점을 둡니다.',
        code: 'BYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAptNLbTzMzMzMzMTzMzMzMzYGYmBkllZmlllZmZmZmFAAAAAAAAAAAAAAAzMzMzMzMzMwsMaWmZmZmZmZA',
        icon: '⚡'
      }
    },
    flameshaper: {
      'raid-single': {
        name: '레이드 단일 대상',
        description: '불꽃형성자를 활용한 단일 대상 빌드입니다. 지속적인 DoT 피해를 극대화합니다.',
        code: 'BYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAptNLTTzMzMzMzMTzMzMzMzYGIAZZmZmZZZmZmZmZWAAAAAAAAAAAAAALzMzMzMzMzMLzmlZmZmZmZBA',
        icon: '🔥'
      },
      'raid-aoe': {
        name: '레이드 광역',
        description: '불꽃형성자를 활용한 광역 빌드입니다. 업화와 기염으로 지속적인 광역 딜을 제공합니다.',
        code: 'BYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAptNLTTzMzMzMzMTzMzMzMzYGIAZZmZmZZZmZmZmZWAAAAAAAAAAAAAALzMzMzMzMzMLzmlZmZmZmZBA',
        icon: '🔥'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '불꽃형성자를 활용한 신화+ 빌드입니다. 안정적인 광역 딜을 제공합니다.',
        code: 'BYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAptNLTTzMzMzMzMTzMzMzMzYGQAyyyMzMLLzMzMzMzCAAAAAAAAAAAAAALzMzMzMzMzMLDmlZmZmZmZmB',
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
              setSelectedTier('flameshaper');
              setSelectedBuild('mythic-plus');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'flameshaper' ?
                'linear-gradient(135deg, #5a8656 0%, #2a4330 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'flameshaper' ? '#AAD372' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'flameshaper' ? '#AAD372' : '#94a3b8',
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
            <span style={{ fontSize: '1.5rem' }}>🐺</span>
            <span>불꽃형성자</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>쐐기 추천</span>
          </button>

          <button
            onClick={() => {
              setSelectedTier('scalecommander');
              setSelectedBuild('raid-single');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'scalecommander' ?
                'linear-gradient(135deg, #7a5896 0%, #3a2846 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'scalecommander' ? '#DC3545' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'scalecommander' ? '#DC3545' : '#94a3b8',
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
            <span style={{ fontSize: '1.5rem' }}>🏹</span>
            <span>비늘사령관</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>레이드 추천</span>
          </button>
        </div>

        {/* 빌드 선택 버튼들 */}
        <div style={{ padding: '20px' }}>
          <h4 style={{
            color: selectedTier === 'flameshaper' ? '#AAD372' : '#DC3545',
            marginBottom: '20px',
            fontSize: '1.3rem'
          }}>
            {selectedTier === 'flameshaper' ? '불꽃형성자' : '비늘사령관'} 특성 빌드
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
          description: 'GCD 감소 & 쿨다운 감소'
        },
        crit: {
          name: '치명타',
          color: '#ff6b6b',
          icon: '⚡',
          description: '직접 대미지 증가'
        },
        mastery: {
          name: '특화',
          color: '#ffe66d',
          icon: '📈',
          description: '적 체력 비율에 따른 피해 증가'
        },
        versatility: {
          name: '유연',
          color: '#95e77e',
          icon: '🔄',
          description: '대미지 & 생존력'
        }
      };

      // 영웅 특성과 콘텐츠 타입별 브레이크포인트
      const breakpointData = {
        flameshaper: {
          single: {
            haste: {
              softcap: '30-35%',
              breakpoints: [
                { value: 30, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 35, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '불꽃형성자는 DoT 틱과 시전 속도에 의존'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '정수 폭발 크리티컬 빈도 증가, 특화와 비슷한 가치'
            },
            mastery: {
              breakpoints: [],
              note: '적 체력 비율에 따라 피해 증가, 실행 구간에서 강력'
            },
            versatility: {
              breakpoints: [],
              note: '가장 낮은 우선순위, 대미지와 생존력 증가'
            }
          },
          aoe: {
            haste: {
              softcap: '30-40%',
              breakpoints: [
                { value: 30, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 40, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '빠른 정수 생성과 DoT 틱 속도 증가'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '폭발적인 AoE 피해를 위한 필수 스탯'
            },
            mastery: {
              breakpoints: [],
              note: '광역에서는 치명타보다 낮은 가치'
            },
            versatility: {
              breakpoints: [],
              note: '가장 낮은 우선순위'
            }
          }
        },
        scalecommander: {
          single: {
            haste: {
              softcap: '30-40%',
              breakpoints: [
                { value: 30, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 40, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '대규모 파열과 충전 폭발 효율 증가'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '최우선 스탯, 모든 피해와 크리티컬 확률 증가'
            },
            mastery: {
              breakpoints: [],
              note: '적 체력 비율에 따른 피해 증가'
            },
            versatility: {
              breakpoints: [],
              note: '특화보다 높지만 여전히 낮은 우선순위'
            }
          },
          aoe: {
            haste: {
              softcap: '30-40%',
              breakpoints: [
                { value: 30, label: '소프트캡 시작', color: '#ffa500', priority: 'medium' },
                { value: 40, label: '효율 감소', color: '#ff6b6b', priority: 'high' }
              ],
              note: '가장 중요한 스탯'
            },
            crit: {
              softcap: '특정 소프트캡 없음',
              breakpoints: [],
              note: '최우선 스탯, 대규모 파열 강화'
            },
            mastery: {
              breakpoints: [],
              note: '적 체력 비율에 따른 피해 증가'
            },
            versatility: {
              breakpoints: [],
              note: '특화보다 높지만 여전히 낮은 우선순위'
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
      flameshaper: {
        single: ['haste', 'mastery', 'crit', 'versatility'],
        aoe: ['haste', 'crit', 'mastery', 'versatility']
      },
      scalecommander: {
        single: ['haste', 'crit', 'versatility', 'mastery'],
        aoe: ['haste', 'crit', 'versatility', 'mastery']
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
              onClick={() => setSelectedStatHero('flameshaper')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'flameshaper' ?
                  'linear-gradient(135deg, #5a8656 0%, #2a4330 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'flameshaper' ? '#AAD372' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'flameshaper' ? '#AAD372' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🐺 불꽃형성자
            </button>
            <button
              onClick={() => setSelectedStatHero('scalecommander')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'scalecommander' ?
                  'linear-gradient(135deg, #7a5896 0%, #3a2846 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'scalecommander' ? '#DC3545' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'scalecommander' ? '#DC3545' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🏹 비늘사령관
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
              color: selectedStatHero === 'flameshaper' ? '#AAD372' : '#DC3545',
              fontSize: '1.3rem',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{selectedStatHero === 'flameshaper' ? '🐺' : '🏹'}</span>
              <span>{selectedStatHero === 'flameshaper' ? '불꽃형성자' : '비늘사령관'}</span>
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
                  ((selectedStatHero === 'flameshaper' && selectedStatMode === 'single' && index === 2) ||
                   (selectedStatHero === 'scalecommander' && index === 4));

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
                {selectedStatHero === 'flameshaper' && selectedStatMode === 'single' && (
                  <li>불꽃형성자는 특화와 치명타가 동일한 가치를 가집니다</li>
                )}
                {selectedStatHero === 'scalecommander' && (
                  <li>비늘사령관는 가속과 치명타를 우선시합니다</li>
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
                  color: '#AAD372',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  overflow: 'auto'
                }}>
{`# TWW Season 3 Devastation Evoker
scale_factors="1"
scale_factor_dps="1"
interpolation="1"
iterate="10000"

# Stat Weights (예시 - 불꽃형성자)
haste=1.00  # 가속 (편의 기준치까지)
crit=0.95   # 치명
mastery=0.95 # 특화 (거물 사냥꾼)
versatility=0.75

# Stat Weights (예시 - 비늬사령관)
crit=1.00   # 치명
haste=0.90  # 가속
mastery=0.85 # 특화
versatility=0.70`}
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
                  color: '#AAD372',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  overflow: 'auto'
                }}>
{`evoker="Devastation_Evoker"
level=80
race=dracthyr
region=kr
server=azshara
role=attack
professions=engineering=100

# Gear (639 ilvl)
head=,id=212018,ilevel=639
neck=,id=212448,ilevel=639
shoulder=,id=212016,ilevel=639`}
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
                background: 'linear-gradient(135deg, #AAD372 0%, #8bc34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                textShadow: '0 0 30px rgba(170, 211, 114, 0.3)'
              }}>
                황폐 기원사 가이드
              </h1>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}>
                최종 수정일: 2025.09.29 | 작성: WoWMeta | 검수:
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

export default DevastationEvokerLayoutIntegrated;