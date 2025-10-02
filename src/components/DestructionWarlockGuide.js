import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { twwS3SkillDatabase } from '../data/twwS3FinalCleanedDatabase';
// 파괴 흑마법사 스킬 데이터
import { destructionWarlockSkills as skillData } from '../data/destructionWarlockSkillData';
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
    if (props.heroType === 'hero1') {
      return 'linear-gradient(135deg, rgba(148, 130, 201, 0.05), rgba(139, 0, 255, 0.05))';
    } else if (props.heroType === 'hero2') {
      return 'linear-gradient(135deg, rgba(50, 205, 50, 0.05), rgba(34, 139, 34, 0.05))';
    }
    return props.theme.colors.surface;
  }};
  border: 2px solid ${props => {
    if (props.heroType === 'hero1') {
      return 'rgba(148, 130, 201, 0.3)';
    } else if (props.heroType === 'hero2') {
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
      if (props.heroType === 'hero1') {
        return 'linear-gradient(90deg, #9482C9, #8B00FF)';
      } else if (props.heroType === 'hero2') {
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

// 영웅특성별 콘텐츠 생성 함수 (SkillIcon 컴포넌트 사용을 위해 함수로 변경)
const getHeroContent = (SkillIcon) => ({
  hellcaller: {
    name: '지옥소환사',
    icon: '🔥',
    tierSet: {
      '2set': '혼돈의 화살 사용 시 5초 동안 다음 소각의 시전 시간이 40% 감소하고 피해가 25% 증가합니다.',
      '4set': '치명타 피해량이 10% 증가합니다. 혼돈의 화살 시전 시 8초 동안 다음 2회의 소각 또는 점화가 추가 화염 피해를 입힙니다.'
    },
    singleTarget: {
      opener: [
        skillData.wither,
        skillData.summonInfernal,
        skillData.conflagrate,
        skillData.chaosBolt,
        skillData.soulFire,
        skillData.channelDemonfire,
        skillData.shadowburn,
        skillData.chaosBolt,
        skillData.conflagrate,
        skillData.incinerate
      ],
      priority: [
        { skill: skillData.wither, desc: '쇠퇴를 항상 유지합니다 (8중첩 목표, 12초 DoT). 제물을 대체하는 강화된 DoT로, 중첩될수록 피해가 증가합니다' },
        { skill: skillData.chaosBolt, desc: '영혼의 조각이 5개 (캡)일 때 사용하여 캡 방지' },
        { skill: skillData.shadowburn, desc: '영혼의 조각이 5개 (캡)이거나 2중첩일 때 사용하여 캡 방지 및 파멸 디버프 유지' },
        { skill: skillData.conflagrate, desc: '울부짖는 불길 유지를 위해 사용하거나 2충전 상태일 때 사용' },
        { skill: skillData.channelDemonfire, desc: '쿨다운마다 사용하여 추가 피해 (쇠퇴 대상 우선 공격)' },
        { skill: skillData.soulFire, desc: '마무리 일격 구간 (대상 체력 20% 이하)에서 섬멸 버프로 사용' },
        { skill: skillData.shadowburn, desc: '파멸 디버프 유지를 위해 사용 (40-60% 가동률 목표)' },
        { skill: skillData.chaosBolt, desc: '파멸 디버프 유지를 위해 사용 (영혼의 조각 충분할 때)' },
        { skill: skillData.soulFire, desc: '영혼의 조각 캡하지 않으면서 역류 버프가 있을 때 사용 (시전 시간 2.4초로 단축)' },
        { skill: skillData.conflagrate, desc: '영혼의 조각 생성을 위해 사용' },
        { skill: skillData.incinerate, desc: '필러 스킬로 영혼의 조각 생성' }
      ]
    },
    aoe: {
      opener: [
        skillData.wither,
        skillData.cataclysm,
        skillData.havoc,
        skillData.summonInfernal,
        skillData.conflagrate,
        skillData.chaosBolt,
        skillData.channelDemonfire,
        skillData.rainOfFire,
        skillData.chaosBolt
      ],
      priority: [
        { skill: skillData.wither, desc: '9초 이상 생존할 대상에 쇠퇴를 유지합니다 (주요 대상은 8중첩 목표)' },
        { skill: skillData.havoc, desc: '보조 대상에 대혼란을 적용합니다 (단일 대상 주문 피해의 60%가 복제)' },
        { skill: skillData.chaosBolt, desc: '영혼의 조각이 5개 (캡) 근처일 때 혼돈의 화살 사용. 대혼란 활성화 시 5개 이상 대상에서도 불의 비보다 우선' },
        { skill: skillData.rainOfFire, desc: '영혼의 조각이 5개 (캡) 근처이고 대혼란 비활성 시 5개 이상 밀집된 대상에 사용' },
        { skill: skillData.cataclysm, desc: '쿨다운마다 사용하여 모든 적에게 쇠퇴를 즉시 적용 (30초 쿨다운)' },
        { skill: skillData.channelDemonfire, desc: '쿨다운마다 사용하여 여러 대상에 분산 피해' },
        { skill: skillData.conflagrate, desc: '울부짖는 불길 유지를 위해 사용' },
        { skill: skillData.soulFire, desc: '역류 버프가 있을 때 사용하여 리소스 생성' },
        { skill: skillData.shadowburn, desc: '처치 가능한 대상에 사용' },
        { skill: skillData.conflagrate, desc: '영혼의 조각 생성을 위해 사용' },
        { skill: skillData.incinerate, desc: '필러 스킬로 영혼의 조각 생성' }
      ]
    }
  },
  diabolist: {
    name: '악마학자',
    icon: '😈',
    tierSet: {
      '2set': '혼돈의 화살, 불의 비, 그림자 화상 시전 시 악마의 눈동자를 소환합니다. 악마의 눈동자는 3.5초 후 폭발하여 암흑불길 피해를 입힙니다.',
      '4set': '악마의 눈동자가 폭발할 때마다 12초 동안 지능이 증가합니다. 최대 5중첩까지 쌓입니다.'
    },
    singleTarget: {
      opener: [
        skillData.immolate,
        skillData.summonInfernal,
        skillData.conflagrate,
        skillData.chaosBolt,
        skillData.soulFire,
        skillData.shadowburn,
        skillData.chaosBolt,
        skillData.channelDemonfire,
        skillData.dimensionalRift,
        skillData.conflagrate
      ],
      priority: [
        { skill: skillData.immolate, desc: '제물을 항상 유지합니다 (18초 DoT)' },
        { skill: skillData.ritualOfRuin, desc: '파멸의 의식 버프가 활성화되면 최우선으로 사용합니다. 악마의 예술 중첩을 소모하여 강화된 혼돈의 화살을 시전합니다' },
        { skill: skillData.chaosBolt, desc: '악마의 예술 버프가 활성화되었을 때 사용합니다. 악마의 눈동자를 소환하고 임프 어미/군주 확률을 증가시킵니다' },
        { skill: skillData.shadowburn, desc: '영혼의 조각이 5개 (캡)이거나 2중첩일 때 사용하여 캡 방지 및 파멸 디버프 유지' },
        { skill: skillData.chaosBolt, desc: '영혼의 조각이 5개일 때 사용하여 캡 방지' },
        { skill: skillData.infernalBolt, desc: '영혼의 조각이 3개 미만일 때 사용 가능하면 시전하여 리소스 생성 (지옥불정령 강화 시)' },
        { skill: skillData.conflagrate, desc: '울부짖는 불길 유지를 위해 사용하거나 2충전 상태일 때 사용' },
        { skill: skillData.soulFire, desc: '마무리 일격 구간 (대상 체력 20% 이하)에서 섬멸 버프로 사용' },
        { skill: skillData.shadowburn, desc: '파멸 디버프 유지를 위해 사용 (40-60% 가동률 목표)' },
        { skill: skillData.chaosBolt, desc: '파멸 디버프 유지를 위해 사용 (영혼의 조각 충분할 때)' },
        { skill: skillData.soulFire, desc: '영혼의 조각 캡하지 않으면서 역류 버프가 있을 때 사용 (시전 시간 2.4초로 단축)' },
        { skill: skillData.channelDemonfire, desc: '쿨다운마다 사용하여 추가 피해 (제물 대상 우선 공격)' },
        { skill: skillData.dimensionalRift, desc: '쿨다운마다 사용하여 무작위 악마 소환' },
        { skill: skillData.conflagrate, desc: '영혼의 조각 생성을 위해 사용' },
        { skill: skillData.incinerate, desc: '필러 스킬로 영혼의 조각 생성' }
      ]
    },
    aoe: {
      opener: [
        skillData.immolate,
        skillData.cataclysm,
        skillData.havoc,
        skillData.summonInfernal,
        skillData.conflagrate,
        skillData.chaosBolt,
        skillData.channelDemonfire,
        skillData.dimensionalRift,
        skillData.rainOfFire
      ],
      priority: [
        { skill: skillData.immolate, desc: '9초 이상 생존할 대상에 제물을 유지합니다' },
        { skill: skillData.havoc, desc: '보조 대상에 대혼란을 적용합니다 (단일 대상 주문 피해의 60%가 복제)' },
        { skill: skillData.ritualOfRuin, desc: '파멸의 의식 버프가 활성화되면 최우선으로 사용' },
        { skill: skillData.chaosBolt, desc: '영혼의 조각이 5개 (캡) 근처이거나 악마의 예술 버프 활성 시 사용. 대혼란 활성화 시 5개 이상 대상에서도 불의 비보다 우선' },
        { skill: skillData.rainOfFire, desc: '영혼의 조각이 5개 (캡) 근처이고 대혼란 비활성 시 5개 이상 밀집된 대상에 사용' },
        { skill: skillData.cataclysm, desc: '쿨다운마다 사용하여 모든 적에게 제물을 즉시 적용 (30초 쿨다운)' },
        { skill: skillData.channelDemonfire, desc: '쿨다운마다 사용하여 여러 대상에 분산 피해' },
        { skill: skillData.dimensionalRift, desc: '쿨다운마다 사용하여 추가 악마 소환' },
        { skill: skillData.conflagrate, desc: '울부짖는 불길 유지를 위해 사용' },
        { skill: skillData.soulFire, desc: '역류 버프가 있을 때 사용하여 리소스 생성' },
        { skill: skillData.shadowburn, desc: '처치 가능한 대상에 사용' },
        { skill: skillData.conflagrate, desc: '영혼의 조각 생성을 위해 사용' },
        { skill: skillData.incinerate, desc: '필러 스킬로 영혼의 조각 생성' }
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

const GuideTemplate = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeSubSection, setActiveSubSection] = useState('');
  // 영웅 특성 선택 상태 (기본값: 지옥소환사)
  const [selectedTier, setSelectedTier] = useState('hellcaller');
  const [showToast, setShowToast] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState('raid-single');
  // 스탯 우선순위용 영웅 특성 선택 상태
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
          <h3 className={styles.subsectionTitle}>전문화 개요</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            파괴 흑마법사는 <strong style={{ color: '#ff6b35' }}>강력한 직접 피해와 보장된 치명타</strong>를 활용하여
            <span style={{ color: '#FFD700', fontWeight: 'bold' }}> 대규모 공격</span>에 특화된 전문화입니다.
            TWW 시즌3에서는 <span style={{ color: '#ff4500', fontWeight: 'bold' }}>🔥 지옥소환사</span> (광역/분산 광역 강화)와
            <span style={{ color: '#8b00ff', fontWeight: 'bold' }}>😈 악마학자</span> (단일 대상 최적화) 영웅 특성이 사용됩니다.
          </p>

          <div style={{
            background: 'rgba(255, 107, 53, 0.1)',
            borderLeft: '4px solid #ff6b35',
            padding: '15px 20px',
            marginBottom: '20px',
            borderRadius: '4px'
          }}>
            <h4 style={{ color: '#ff6b35', marginTop: 0, marginBottom: '10px' }}>강점</h4>
            <ul style={{ marginBottom: 0, lineHeight: '1.8' }}>
              <li><strong>강력한 광역 딜:</strong> 대혼란을 활용한 우수한 2-4타겟 광역 능력</li>
              <li><strong>좋은 기동성:</strong> 이동 중 시전 가능 스킬 다수 보유</li>
              <li><strong>유틸리티:</strong> 소환의식, 생명석, 저주 등 파티 지원 능력</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(148, 130, 201, 0.1)',
            borderLeft: '4px solid #9482C9',
            padding: '15px 20px',
            marginBottom: '20px',
            borderRadius: '4px'
          }}>
            <h4 style={{ color: '#9482C9', marginTop: 0, marginBottom: '10px' }}>약점</h4>
            <ul style={{ marginBottom: 0, lineHeight: '1.8' }}>
              <li><strong>평범한 단일 대상:</strong> 순수 단일 대상 상황에서 경쟁력 부족</li>
              <li><strong>약한 지속 딜:</strong> 지옥불정령 쿨다운 중 피해량 감소</li>
            </ul>
          </div>

          <h3 className={styles.subsectionTitle} style={{ marginTop: '30px' }}>핵심 딜링 메커니즘</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            파괴 흑마법사는 <strong style={{ color: '#9482C9' }}>영혼의 조각 (Soul Shards)</strong>을 생성하고 소비하는 리소스 기반 전문화입니다.
            {' '}<SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.chaosBolt} textOnly={true} />는
            <strong style={{ color: '#ff6b35' }}> 항상 치명타 피해를 입히므로</strong>, 치명타 확률보다
            <strong style={{ color: '#FFD700' }}> 치명타 피해량이 핵심 스탯</strong>입니다.
          </p>

          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            기본 패턴은 {' '}
            <SkillIcon skill={skillData.conflagrate} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.conflagrate} textOnly={true} /> (파편 5개)와 {' '}
            <SkillIcon skill={skillData.incinerate} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.incinerate} textOnly={true} /> (파편 2-3개)로 영혼의 조각을 생성한 후,
            {' '}<SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> (영혼의 조각 2개 소모)로 소비하는 것입니다.
          </p>

          <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            <strong style={{ color: '#ffa500' }}>핵심 버스트 타이밍:</strong> {' '}
            <SkillIcon skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} />
            <SkillIcon skill={skillData.summonInfernal} textOnly={true} /> 사용 전 영혼의 조각을 최대로 확보한 후,
            30초 폭딜 구간에서 연속적인 혼돈의 화살로 폭발적인 딜을 냅니다.
          </p>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>핵심 스킬</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {[
              { skill: skillData.chaosBolt, label: '영혼의 조각 2개' },
              { skill: skillData.conflagrate, label: '파편 5개 생성' },
              { skill: skillData.summonInfernal, label: skillData.summonInfernal.cooldown },
              { skill: skillData.incinerate, label: '파편 2개 생성' },
              { skill: skillData.soulFire, label: '영혼의 조각 1개 생성' },
              { skill: skillData.rainOfFire, label: '광역 피해' }
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
            <li>주 자원: <span style={{ color: '#9482C9', fontWeight: 'bold' }}>영혼의 조각 (Soul Shards)</span> - 최대 5개까지 보유 가능하며, 10개의 파편으로 세분화됩니다</li>
            <li>리소스 생성:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li><SkillIcon skill={skillData.conflagrate} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.conflagrate} textOnly={true} /> - 파편 5개 생성 (충전 횟수 2회)</li>
                <li><SkillIcon skill={skillData.incinerate} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.incinerate} textOnly={true} /> - 파편 2개 생성 (치명타 시 3개)</li>
                <li><SkillIcon skill={skillData.soulFire} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.soulFire} textOnly={true} /> - 영혼의 조각 1개 생성 (20초 쿨다운)</li>
                <li><SkillIcon skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.summonInfernal} textOnly={true} /> - 파편 3개 추가 생성</li>
              </ul>
            </li>
            <li>리소스 소비:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
                <li><SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.chaosBolt} textOnly={true} /> - 영혼의 조각 2개 소모 (항상 치명타)</li>
                <li><SkillIcon skill={skillData.rainOfFire} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.rainOfFire} textOnly={true} /> - 영혼의 조각 3개 소모 (광역)</li>
                <li><SkillIcon skill={skillData.shadowburn} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.shadowburn} textOnly={true} /> - 영혼의 조각 1개 소모 (이동 중 시전)</li>
              </ul>
            </li>
            <li><strong style={{ color: '#ffa500' }}>핵심 전략:</strong> <SkillIcon skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.summonInfernal} textOnly={true} /> 사용 전 영혼의 조각을 최대한 확보한 후, 폭딜 구간에서 연속적인 <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 시전</li>
            <li><strong style={{ color: '#ff6b6b' }}>주의:</strong> 영혼의 조각이 최대치에 도달하면 추가 생성이 낭비되므로, 5개를 넘기지 않도록 적절히 소비</li>
          </ul>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginTop: '25px', marginBottom: '15px' }}>핵심 시너지 메커니즘</h4>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.05), rgba(148, 130, 201, 0.05))',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: '#ff6b35', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SkillIcon skill={skillData.roaringBlaze} size="small" />
                <SkillIcon skill={skillData.roaringBlaze} textOnly={true} />
              </h5>
              <p style={{ lineHeight: '1.8', marginBottom: '10px' }}>
                <SkillIcon skill={skillData.conflagrate} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.conflagrate} textOnly={true} />가 대상에게
                <strong style={{ color: '#ffa500' }}> 3초 동안 울부짖는 불길</strong>을 적용합니다.
                울부짖는 불길에 걸린 대상은 {' '}
                <SkillIcon skill={skillData.immolate} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.immolate} textOnly={true} /> 또는 {' '}
                <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.wither} textOnly={true} />의 피해가
                <strong style={{ color: '#FFD700' }}> 25% 증가</strong>합니다.
              </p>
              <div style={{
                background: 'rgba(255, 107, 53, 0.1)',
                padding: '10px 15px',
                borderRadius: '8px',
                borderLeft: '3px solid #ff6b35'
              }}>
                <strong style={{ color: '#ffa500' }}>전략:</strong> 점화의 충전을 1회 남겨두어 울부짖는 불길 버프를 항상 유지합니다
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: '#9482C9', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SkillIcon skill={skillData.eradication} size="small" />
                <SkillIcon skill={skillData.eradication} textOnly={true} />
              </h5>
              <p style={{ lineHeight: '1.8', marginBottom: '10px' }}>
                <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 또는 {' '}
                <SkillIcon skill={skillData.shadowburn} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.shadowburn} textOnly={true} />가 대상에게
                <strong style={{ color: '#9482C9' }}> 6초 동안 파멸</strong> 디버프를 적용합니다.
                파멸에 걸린 대상에게 시전하는 주문의 <strong style={{ color: '#32CD32' }}>시전 속도가 10% 증가</strong>합니다.
              </p>
              <div style={{
                background: 'rgba(148, 130, 201, 0.1)',
                padding: '10px 15px',
                borderRadius: '8px',
                borderLeft: '3px solid #9482C9'
              }}>
                <strong style={{ color: '#ffa500' }}>전략:</strong> 파멸 디버프를 활용하여 빠른 소각 연타로 리소스 생성 효율 증가
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: '#FFD700', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SkillIcon skill={skillData.ritualOfRuin} size="small" />
                <SkillIcon skill={skillData.ritualOfRuin} textOnly={true} />
              </h5>
              <p style={{ lineHeight: '1.8', marginBottom: '10px' }}>
                영혼의 조각을 <strong style={{ color: '#9482C9' }}>15개 소비할 때마다</strong> 다음 {' '}
                <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 또는 {' '}
                <SkillIcon skill={skillData.rainOfFire} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.rainOfFire} textOnly={true} />가
                <strong style={{ color: '#FFD700' }}> 영혼의 조각을 소비하지 않고</strong> 피해가
                <strong style={{ color: '#ff6b35' }}> 50% 증가</strong>합니다.
              </p>
              <div style={{
                background: 'rgba(255, 215, 0, 0.1)',
                padding: '10px 15px',
                borderRadius: '8px',
                borderLeft: '3px solid #FFD700'
              }}>
                <strong style={{ color: '#ffa500' }}>전략:</strong> 프록 발동 시 혼돈의 화살 사용을 우선시하여 최대 효율 확보
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: '#8b00ff', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SkillIcon skill={skillData.demonicArt} size="small" />
                <SkillIcon skill={skillData.demonicArt} textOnly={true} /> (악마학자 전용)
              </h5>
              <p style={{ lineHeight: '1.8', marginBottom: '10px' }}>
                영혼의 조각을 소비하면 악마의 예술이 발동되어
                <strong style={{ color: '#8b00ff' }}> 다음 혼돈의 화살의 피해가 증가</strong>합니다.
                또한 <strong style={{ color: '#ffa500' }}>임프 어미 및 군주 소환 확률</strong>이 증가하고,
                티어 세트 효과인 <strong style={{ color: '#FFD700' }}>악마의 눈동자</strong>를 소환합니다.
              </p>
              <div style={{
                background: 'rgba(139, 0, 255, 0.1)',
                padding: '10px 15px',
                borderRadius: '8px',
                borderLeft: '3px solid #8b00ff'
              }}>
                <strong style={{ color: '#ffa500' }}>전략:</strong> 악마의 예술이 활성화되었을 때 혼돈의 화살을 즉시 사용
              </div>
            </div>

            <div>
              <h5 style={{ color: '#ff4500', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SkillIcon skill={skillData.decimation} size="small" />
                <SkillIcon skill={skillData.decimation} textOnly={true} />
              </h5>
              <p style={{ lineHeight: '1.8', marginBottom: '10px' }}>
                대상의 생명력이 <strong style={{ color: '#ff4500' }}>50% 이하</strong>일 때 {' '}
                <SkillIcon skill={skillData.soulFire} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.soulFire} textOnly={true} />가
                <strong style={{ color: '#FFD700' }}> 즉시 시전</strong>되며 피해가 증가합니다.
              </p>
              <div style={{
                background: 'rgba(255, 69, 0, 0.1)',
                padding: '10px 15px',
                borderRadius: '8px',
                borderLeft: '3px solid #ff4500'
              }}>
                <strong style={{ color: '#ffa500' }}>전략:</strong> 마무리 일격 구간에서 <SkillIcon skill={skillData.soulFire} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.soulFire} textOnly={true} />을 적극 활용하여 리소스 생성 극대화
              </div>
            </div>
          </div>

          <h4 style={{ color: '#ffa500', fontSize: '1.2rem', marginBottom: '15px' }}>기본 전투 원칙</h4>
          <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
            <li><strong style={{ color: '#ff6b35' }}>보장된 치명타:</strong> 혼돈의 화살은 항상 치명타 피해를 입히므로, 치명타 확률보다 <strong>치명타 피해량</strong>이 핵심 스탯입니다</li>
            <li><strong style={{ color: '#9482C9' }}>DoT 유지:</strong> 지옥소환사는 쇠퇴를 8중첩 유지, 악마학자는 제물을 항상 유지</li>
            <li><strong style={{ color: '#ffa500' }}>리소스 관리:</strong> 점화의 2회 충전을 활용하여 영혼의 조각 캡을 방지</li>
            <li><strong style={{ color: '#FFD700' }}>쿨다운 동기화:</strong> <SkillIcon skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.summonInfernal} textOnly={true} /> 사용 전 영혼의 조각 최대 확보</li>
            <li><strong style={{ color: '#32CD32' }}>폭딜 구간:</strong> <SkillIcon skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.summonInfernal} textOnly={true} /> 소환 후 30초 동안 최대한 많은 <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 시전</li>
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
              className={`${styles.tierTab} ${selectedTier === 'diabolist' ? styles.active : ''}`}
              onClick={() => setSelectedTier('diabolist')}
            >
              <span className={styles.tierIcon}>😈</span> 악마학자
            </button>
          </div>

          {/* 티어 세트 효과 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-tier']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'hellcaller' ? '#ff4500' : '#8b00ff'
            }}>티어 세트 효과</h3>
            <div className={styles.tierBonuses} style={{
              background: selectedTier === 'hellcaller'
                ? 'linear-gradient(135deg, rgba(255, 69, 0, 0.1), rgba(255, 107, 53, 0.05))'
                : 'linear-gradient(135deg, rgba(139, 0, 255, 0.1), rgba(148, 130, 201, 0.05))',
              padding: '1.5rem',
              borderRadius: '8px',
              border: selectedTier === 'hellcaller'
                ? '1px solid rgba(255, 69, 0, 0.3)'
                : '1px solid rgba(139, 0, 255, 0.3)'
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
              ? '1px solid rgba(255, 69, 0, 0.3)'
              : '1px solid rgba(139, 0, 255, 0.3)'
          }}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'hellcaller' ? '#ff4500' : '#8b00ff'
            }}>영웅 특성 딜링 메커니즘</h3>

            {selectedTier === 'hellcaller' ? (
              <>
                {/* 지옥소환사 */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.1), rgba(255, 107, 53, 0.05))',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 69, 0, 0.3)'
                }}>
                  <h5 style={{
                    color: '#ff4500',
                    marginTop: 0,
                    marginBottom: '15px',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🔥</span>
                    지옥소환사 (Hellcaller)
                  </h5>

                  <div style={{ marginBottom: '15px' }}>
                    <h6 style={{ color: '#ffa500', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <SkillIcon skill={skillData.wither} size="small" />
                      핵심 메커니즘: <SkillIcon skill={skillData.wither} textOnly={true} /> (쇠퇴)
                    </h6>
                    <p style={{ lineHeight: '1.8', marginBottom: '10px' }}>
                      {' '}<SkillIcon skill={skillData.immolate} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.immolate} textOnly={true} />를 {' '}
                      <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.wither} textOnly={true} />로 대체합니다.
                      쇠퇴는 <strong style={{ color: '#FFD700' }}>즉시 시전</strong>되며, 대상에게 중첩되는 암흑 피해를 입힙니다.
                      <strong style={{ color: '#ff4500' }}> 최대 8중첩</strong>까지 쌓을 수 있으며, 중첩될수록 피해가 증가합니다.
                    </p>
                    <div style={{
                      background: 'rgba(255, 69, 0, 0.1)',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      borderLeft: '3px solid #ff4500',
                      marginBottom: '10px'
                    }}>
                      <strong style={{ color: '#ffa500' }}>핵심 특성:</strong>
                      <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
                        <li>
                          <SkillIcon skill={skillData.cataclysm} size="small" className={styles.inlineIcon} />
                          <SkillIcon skill={skillData.cataclysm} textOnly={true} /> - 여러 대상에게 즉시 쇠퇴를 적용
                        </li>
                        <li>
                          <SkillIcon skill={skillData.blackenedSoul} size="small" className={styles.inlineIcon} />
                          <SkillIcon skill={skillData.blackenedSoul} textOnly={true} /> - 쇠퇴 피해 증가
                        </li>
                        <li>
                          <SkillIcon skill={skillData.malevolence} size="small" className={styles.inlineIcon} />
                          <SkillIcon skill={skillData.malevolence} textOnly={true} /> - 1분 쿨다운으로 쇠퇴 중첩 강화
                        </li>
                        <li>
                          <SkillIcon skill={skillData.xalansCruelty} size="small" className={styles.inlineIcon} />
                          <SkillIcon skill={skillData.xalansCruelty} textOnly={true} /> - 화염 및 암흑 피해 증폭
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    borderLeft: '3px solid #FFD700'
                  }}>
                    <strong style={{ color: '#FFD700' }}>플레이스타일:</strong>
                    <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                      <li><strong>분산 광역 특화:</strong> 2-3 대상 전투에서 우수한 성능</li>
                      <li><strong>대규모 AoE:</strong> 대재앙으로 여러 대상에 즉시 쇠퇴 적용</li>
                      <li><strong>DoT 중첩 관리:</strong> 쇠퇴를 8중첩까지 유지하는 것이 핵심</li>
                      <li><strong>권장 콘텐츠:</strong> 쐐기돌, 분산 광역 레이드 보스</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 악마학자 */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(139, 0, 255, 0.1), rgba(148, 130, 201, 0.05))',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  border: '1px solid rgba(139, 0, 255, 0.3)'
                }}>
                  <h5 style={{
                    color: '#8b00ff',
                    marginTop: 0,
                    marginBottom: '15px',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>😈</span>
                    악마학자 (Diabolist)
                  </h5>

                  <div style={{ marginBottom: '15px' }}>
                    <h6 style={{ color: '#9482C9', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      핵심 메커니즘: {' '}
                      <SkillIcon skill={skillData.diabolicRitual} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.diabolicRitual} textOnly={true} />
                    </h6>
                    <p style={{ lineHeight: '1.8', marginBottom: '10px' }}>
                      영혼의 조각을 소비할 때마다 <strong style={{ color: '#9482C9' }}>3단계 악마의 의식 사이클</strong>이 발동됩니다.
                      각 의식은 만료 시 {' '}
                      <SkillIcon skill={skillData.demonicArt} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.demonicArt} textOnly={true} />로 변환되어 다음 {' '}
                      <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.chaosBolt} textOnly={true} />의 피해를 <strong style={{ color: '#FFD700' }}>증폭</strong>시킵니다.
                    </p>
                    <div style={{
                      background: 'rgba(139, 0, 255, 0.1)',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      borderLeft: '3px solid #8b00ff',
                      marginBottom: '10px'
                    }}>
                      <strong style={{ color: '#9482C9' }}>핵심 특성:</strong>
                      <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
                        <li>
                          <SkillIcon skill={skillData.touchOfRancora} size="small" className={styles.inlineIcon} />
                          <SkillIcon skill={skillData.touchOfRancora} textOnly={true} /> - 피해 증가 및 시전 시간 감소
                        </li>
                        <li>
                          <SkillIcon skill={skillData.abyssalDominion} size="small" className={styles.inlineIcon} />
                          <SkillIcon skill={skillData.abyssalDominion} textOnly={true} /> - 지옥불정령 강화
                        </li>
                        <li>
                          <SkillIcon skill={skillData.demonicArt} size="small" className={styles.inlineIcon} />
                          <SkillIcon skill={skillData.demonicArt} textOnly={true} /> - 혼돈의 화살 피해 증폭 (패시브)
                        </li>
                        <li>
                          <SkillIcon skill={skillData.motherOfChaos} size="small" className={styles.inlineIcon} />
                          <SkillIcon skill={skillData.motherOfChaos} textOnly={true} /> & {' '}
                          <SkillIcon skill={skillData.overlord} size="small" className={styles.inlineIcon} />
                          <SkillIcon skill={skillData.overlord} textOnly={true} /> - 패시브 악마 소환
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    borderLeft: '3px solid #FFD700'
                  }}>
                    <strong style={{ color: '#FFD700' }}>플레이스타일:</strong>
                    <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                      <li><strong>단일 대상 최적화:</strong> 순수 단일 대상 전투에서 최고 성능</li>
                      <li><strong>패시브 AoE:</strong> 소환된 악마들이 자동으로 광역 피해 제공</li>
                      <li><strong>영혼의 조각 소비:</strong> 악마의 의식을 계속 발동시켜 악마의 예술 유지</li>
                      <li><strong>권장 콘텐츠:</strong> 단일 대상 레이드 보스, 우두머리 전투</li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            <div style={{
              background: 'rgba(255, 165, 0, 0.1)',
              padding: '15px 20px',
              borderRadius: '8px',
              borderLeft: '4px solid #ffa500',
              marginTop: '20px'
            }}>
              <strong style={{ color: '#ffa500', fontSize: '1rem' }}>💡 선택 가이드</strong>
              <ul style={{ marginTop: '10px', marginBottom: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                <li><strong style={{ color: '#ff4500' }}>지옥소환사:</strong> 쐐기돌, 2-3 대상 전투, 분산 광역 상황</li>
                <li><strong style={{ color: '#8b00ff' }}>악마학자:</strong> 단일 대상 레이드 보스, 순수 우두머리 전투</li>
                <li>현재 메타에서는 <strong>상황에 따라 양쪽 모두 사용</strong>되며, 전투 유형에 맞춰 선택하는 것이 중요합니다</li>
              </ul>
            </div>
          </div>

          {/* 단일 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-single']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'hellcaller' ? '#ff4500' : '#8b00ff',
              marginTop: '1.5rem'
            }}>단일 대상</h3>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>오프닝 시퀀스</h4>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '10px', lineHeight: '1.8' }}>
                {selectedTier === 'hellcaller' ? (
                  <>
                    <p style={{ margin: '5px 0' }}>⏱️ <strong>Pre-pull (-5초):</strong> 영혼의 조각 3-4개 확보 (소각으로 생성). 쇠퇴를 미리 적용하여 풀 타이밍에 최대 중첩 유지</p>
                    <p style={{ margin: '5px 0' }}>🎯 <strong>Pull (0초):</strong> 쇠퇴 적용 → 지옥불정령 소환 → 장신구/물약 활성화 → 폭딜 사이클 시작</p>
                    <p style={{ margin: '5px 0' }}>💥 <strong>폭딜 구간 (0-30초):</strong> 역류 버프를 활용한 연속 혼돈의 화살 및 영혼의 불꽃 시전</p>
                  </>
                ) : (
                  <>
                    <p style={{ margin: '5px 0' }}>⏱️ <strong>Pre-pull (-5초):</strong> 영혼의 조각 3-4개 확보 (소각으로 생성). 악마의 의식 사이클 대기</p>
                    <p style={{ margin: '5px 0' }}>🎯 <strong>Pull (0초):</strong> 제물 적용 → 지옥불정령 소환 → 장신구/물약 활성화 → 폭딜 사이클 시작</p>
                    <p style={{ margin: '5px 0' }}>💥 <strong>폭딜 구간 (0-30초):</strong> 악마의 예술 버프를 활용한 연속 혼돈의 화살 시전으로 악마의 눈동자 소환</p>
                  </>
                )}
              </div>
              <div className={styles.skillSequence}>
                {currentContent.singleTarget.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <span className={styles.arrow}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              {selectedTier === 'hellcaller' && (
                <div style={{ fontSize: '0.85rem', color: '#ff4500', marginTop: '12px', lineHeight: '1.7', background: 'rgba(255, 69, 0, 0.1)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #ff4500' }}>
                  <p style={{ margin: '3px 0', fontWeight: 'bold' }}>💡 핵심 팁:</p>
                  <p style={{ margin: '3px 0' }}>• 쇠퇴는 8중첩까지 쌓을 수 있으며, 중첩이 높을수록 피해가 증가합니다</p>
                  <p style={{ margin: '3px 0' }}>• 역류 버프 (4초 지속)를 낭비하지 말고 즉시 영혼의 불꽃 또는 혼돈의 화살로 소비하세요</p>
                  <p style={{ margin: '3px 0' }}>• 지옥불정령 30초 지속시간 동안 최대한 많은 혼돈의 화살을 시전하는 것이 핵심입니다</p>
                </div>
              )}
              {selectedTier === 'diabolist' && (
                <div style={{ fontSize: '0.85rem', color: '#8b00ff', marginTop: '12px', lineHeight: '1.7', background: 'rgba(139, 0, 255, 0.1)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #8b00ff' }}>
                  <p style={{ margin: '3px 0', fontWeight: 'bold' }}>💡 핵심 팁:</p>
                  <p style={{ margin: '3px 0' }}>• 악마의 예술 버프가 활성화되면 즉시 혼돈의 화살을 사용하여 악마의 눈동자를 소환하세요</p>
                  <p style={{ margin: '3px 0' }}>• 파멸의 의식 버프는 최우선으로 사용하여 강화된 혼돈의 화살을 시전합니다</p>
                  <p style={{ margin: '3px 0' }}>• 지옥불정령 30초 지속시간 동안 티어 세트 효과를 최대한 활용하여 악마의 눈동자를 다수 소환하세요</p>
                </div>
              )}
            </div>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>스킬 우선순위</h4>
            <ol className={styles.priorityListWow}>
              {currentContent.singleTarget.priority.map((item, index) => (
                <li key={index}>
                  <span className={styles.priorityNumber}>{index + 1}.</span>
                  <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    <SkillIcon skill={item.skill} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={item.skill} textOnly={true} />
                  </span>
                  {' '}- {item.desc}
                </li>
              ))}
            </ol>
          </div>

          {/* 광역 대상 */}
          <div className={styles.subsection} ref={subSectionRefs['rotation-aoe']}>
            <h3 className={styles.subsectionTitle} style={{
              color: selectedTier === 'hellcaller' ? '#ff4500' : '#8b00ff',
              marginTop: '1.5rem'
            }}>광역 대상 (3+ 타겟)</h3>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>오프닝 시퀀스</h4>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '10px', lineHeight: '1.8' }}>
                {selectedTier === 'hellcaller' ? (
                  <>
                    <p style={{ margin: '5px 0' }}>⏱️ <strong>Pre-pull (-5초):</strong> 영혼의 조각 3-4개 확보. 쇠퇴를 주요 대상에 미리 적용</p>
                    <p style={{ margin: '5px 0' }}>🎯 <strong>Pull (0초):</strong> 쇠퇴 적용 → 대재앙 (모든 대상에 쇠퇴 확산) → 대혼란 (보조 대상) → 지옥불정령 소환</p>
                    <p style={{ margin: '5px 0' }}>💥 <strong>폭딜 구간 (0-30초):</strong> 대혼란 활성 시 혼돈의 화살 우선, 비활성 시 불의 비로 광역 피해</p>
                  </>
                ) : (
                  <>
                    <p style={{ margin: '5px 0' }}>⏱️ <strong>Pre-pull (-5초):</strong> 영혼의 조각 3-4개 확보. 악마의 의식 사이클 대기</p>
                    <p style={{ margin: '5px 0' }}>🎯 <strong>Pull (0초):</strong> 제물 적용 → 대재앙 (모든 대상에 제물 확산) → 대혼란 (보조 대상) → 지옥불정령 소환</p>
                    <p style={{ margin: '5px 0' }}>💥 <strong>폭딜 구간 (0-30초):</strong> 대혼란 활성 시 혼돈의 화살로 악마의 눈동자 소환, 차원의 균열로 추가 악마 소환</p>
                  </>
                )}
              </div>
              <div className={styles.skillSequence}>
                {currentContent.aoe.opener.map((skill, index, arr) => (
                  <React.Fragment key={index}>
                    <SkillIcon skill={skill} size="medium" />
                    {index < arr.length - 1 && <span className={styles.arrow}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              {selectedTier === 'hellcaller' && (
                <div style={{ fontSize: '0.85rem', color: '#ff4500', marginTop: '12px', lineHeight: '1.7', background: 'rgba(255, 69, 0, 0.1)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #ff4500' }}>
                  <p style={{ margin: '3px 0', fontWeight: 'bold' }}>💡 핵심 팁:</p>
                  <p style={{ margin: '3px 0' }}>• 대재앙으로 모든 대상에 쇠퇴를 즉시 적용하여 악마의 불길 피해를 극대화하세요</p>
                  <p style={{ margin: '3px 0' }}>• 대혼란 활성 시 5개 이상 대상에서도 혼돈의 화살이 불의 비보다 우선합니다</p>
                  <p style={{ margin: '3px 0' }}>• 9초 이상 생존할 대상에만 쇠퇴를 유지하여 리소스 낭비를 방지하세요</p>
                </div>
              )}
              {selectedTier === 'diabolist' && (
                <div style={{ fontSize: '0.85rem', color: '#8b00ff', marginTop: '12px', lineHeight: '1.7', background: 'rgba(139, 0, 255, 0.1)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #8b00ff' }}>
                  <p style={{ margin: '3px 0', fontWeight: 'bold' }}>💡 핵심 팁:</p>
                  <p style={{ margin: '3px 0' }}>• 대재앙으로 모든 대상에 제물을 즉시 적용하여 악마의 눈동자 소환 기회를 극대화하세요</p>
                  <p style={{ margin: '3px 0' }}>• 파멸의 의식 버프는 최우선으로 사용하여 광역 상황에서도 강력한 단일 대상 피해를 제공합니다</p>
                  <p style={{ margin: '3px 0' }}>• 차원의 균열로 추가 악마를 소환하여 전체 딜량을 증가시키세요</p>
                </div>
              )}
            </div>

            <h4 style={{ color: '#ffa500', fontSize: '1.1rem', margin: '20px 0 15px' }}>스킬 우선순위</h4>
            <ol className={styles.priorityListWow}>
              {currentContent.aoe.priority.map((item, index) => (
                <li key={index}>
                  <span className={styles.priorityNumber}>{index + 1}.</span>
                  <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    <SkillIcon skill={item.skill} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={item.skill} textOnly={true} />
                  </span>
                  {' '}- {item.desc}
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
                  <h4 style={{ color: '#ff4500', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.wither} textOnly={true} /> 중첩 관리 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>최대 8중첩:</strong> 중첩될수록 피해가 기하급수적으로 증가
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>초기 적용:</strong> 전투 시작 시 최소 4중첩 이상 빠르게 쌓기
                    </li>
                    <li>
                      <strong>유지 우선순위:</strong> 쇠퇴 지속시간이 6초 이하일 때 갱신
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>핵심:</strong> 8중첩 유지가 모든 스킬보다 우선
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🎯 <SkillIcon skill={skillData.cataclysm} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.cataclysm} textOnly={true} /> 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>재사용 대기시간:</strong> 30초
                    </li>
                    <li>
                      <strong>효과:</strong> 모든 적에게 즉시 <SkillIcon skill={skillData.wither} textOnly={true} /> 적용
                    </li>
                    <li>
                      <strong style={{ color: '#ff4500' }}>광역 전투:</strong> 쿨다운마다 즉시 사용하여 모든 대상에 DoT 확산
                    </li>
                    <li>
                      <strong>단일 대상:</strong> 이동 중이거나 즉시 쇠퇴 적용이 필요할 때 사용
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#28a745', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🔥 <SkillIcon skill={skillData.malevolence} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.malevolence} textOnly={true} /> 타이밍 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>재사용 대기시간:</strong> 1분
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>효과:</strong> 다음 <SkillIcon skill={skillData.wither} textOnly={true} />의 중첩 수를 크게 증가
                    </li>
                    <li>
                      <strong>최적 타이밍:</strong> <SkillIcon skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.summonInfernal} textOnly={true} />과 함께 사용
                    </li>
                    <li>
                      <strong>장신구 조합:</strong> <SkillIcon skill={skillData.malevolence} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.malevolence} textOnly={true} />와 쿨기 장신구를 맞춰 버스트 극대화
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚠️ 영혼의 조각 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>5개 상태:</strong> 즉시 <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 사용 (리소스 낭비 방지)
                    </li>
                    <li>
                      <strong>4-5개 구간:</strong> 혼돈의 화살 최적 구간
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>이상적 유지:</strong> 2~3개 구간에서 관리
                    </li>
                    <li>
                      <strong>이동 중:</strong> <SkillIcon skill={skillData.shadowburn} textOnly={true} /> 그림자 화상으로 조각 소비
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    💨 <SkillIcon skill={skillData.channelDemonfire} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.channelDemonfire} textOnly={true} /> 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>재사용 대기시간마다 즉시 사용</li>
                    <li><SkillIcon skill={skillData.wither} textOnly={true} /> 쇠퇴가 걸린 대상을 우선 공격</li>
                    <li><strong style={{ color: '#ffa500' }}>광역 효과:</strong> 주변 적들에게 분산 피해</li>
                    <li><strong>중첩 활용:</strong> 8중첩 쇠퇴 상태에서 사용 시 최대 피해</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ 폭딜 구간 극대화 (고급)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>타이밍 순서:</strong> <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.wither} textOnly={true} /> 8중첩 → <SkillIcon skill={skillData.malevolence} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.malevolence} textOnly={true} /> → <SkillIcon skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.summonInfernal} textOnly={true} />
                    </li>
                    <li>
                      <strong>티어 세트 활용:</strong> <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 시전 시 <SkillIcon skill={skillData.incinerate} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.incinerate} textOnly={true} /> 피해 증가 버프 활용
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>즉시 후속:</strong> <SkillIcon skill={skillData.conflagrate} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.conflagrate} textOnly={true} /> → <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 연계
                    </li>
                    <li>
                      <strong>버스트 중:</strong> <SkillIcon skill={skillData.channelDemonfire} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.channelDemonfire} textOnly={true} /> 쿨다운마다 사용
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#8b00ff', fontSize: '1.1rem', marginBottom: '15px' }}>
                    <SkillIcon skill={skillData.demonicArt} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.demonicArt} textOnly={true} /> 악마의 예술 최적화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#9482C9' }}>발동 조건:</strong> <SkillIcon skill={skillData.diabolicRitual} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.diabolicRitual} textOnly={true} /> 사이클 완료 시 자동 획득
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>효과:</strong> 다음 <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 혼돈의 화살 피해 크게 증가
                    </li>
                    <li>
                      <strong>우선순위:</strong> 악마의 예술 버프가 활성화되면 즉시 혼돈의 화살 사용
                    </li>
                    <li>
                      <strong style={{ color: '#FFD700' }}>핵심:</strong> 버프를 낭비하지 않도록 영혼의 조각 4-5개 유지
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🎯 <SkillIcon skill={skillData.diabolicRitual} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.diabolicRitual} textOnly={true} /> 사이클 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ffa500' }}>3단계 사이클:</strong> 영혼의 조각 소비 시 단계별 의식 발동
                    </li>
                    <li>
                      <strong>1단계:</strong> <SkillIcon skill={skillData.ritualOfRuin} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.ritualOfRuin} textOnly={true} /> - 짧은 지속시간 버프
                    </li>
                    <li>
                      <strong>2단계:</strong> <SkillIcon skill={skillData.abyssalDominion} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.abyssalDominion} textOnly={true} /> - 지옥불정령 강화
                    </li>
                    <li>
                      <strong style={{ color: '#9482C9' }}>3단계 완료:</strong> 악마의 예술 획득
                    </li>
                    <li>
                      <strong>최적화:</strong> 지속적으로 영혼의 조각을 소비하여 사이클 유지
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#28a745', fontSize: '1.1rem', marginBottom: '15px' }}>
                    🔥 <SkillIcon skill={skillData.dimensionalRift} textOnly={true} /> 차원 균열 활용
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>재사용 대기시간:</strong> 1.5분
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>효과:</strong> 무작위 강력한 악마 소환 (6가지 중 1개)
                    </li>
                    <li>
                      <strong>최적 타이밍:</strong> <SkillIcon skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.summonInfernal} textOnly={true} />과 함께 사용
                    </li>
                    <li>
                      <strong>버스트 조합:</strong> 차원 균열 + 지옥불정령 + 쿨기 장신구
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚠️ 티어 세트: 악마의 눈동자 관리
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong style={{ color: '#ff6b6b' }}>2세트:</strong> <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 시전 시 악마의 눈동자 소환 (3.5초 후 폭발)
                    </li>
                    <li>
                      <strong>4세트:</strong> 폭발 시 지능 증가 (최대 5중첩)
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>최적화:</strong> 혼돈의 화살을 연속으로 사용하여 중첩 빠르게 쌓기
                    </li>
                    <li>
                      <strong>중첩 유지:</strong> 버스트 전 미리 4-5중첩 유지
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#9b59b6', fontSize: '1.1rem', marginBottom: '15px' }}>
                    😈 임프 어미 & 군주 소환 극대화
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <SkillIcon skill={skillData.motherOfChaos} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.motherOfChaos} textOnly={true} /> - 패시브로 임프 어미 소환 (15% 확률)
                    </li>
                    <li>
                      <SkillIcon skill={skillData.overlord} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.overlord} textOnly={true} /> - 패시브로 임프 군주 소환 (10% 확률)
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>확률 증가:</strong> <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 사용 시 소환 확률 상승
                    </li>
                    <li>
                      <strong>버스트 효과:</strong> 소환된 악마들이 자동으로 강력한 광역 피해 제공
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#17a2b8', fontSize: '1.1rem', marginBottom: '15px' }}>
                    ⚡ 폭딜 구간 극대화 (고급)
                  </h4>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>타이밍 순서:</strong> 티어 세트 중첩 4-5개 → <SkillIcon skill={skillData.summonInfernal} textOnly={true} /> → <SkillIcon skill={skillData.dimensionalRift} textOnly={true} />
                    </li>
                    <li>
                      <strong style={{ color: '#ffa500' }}>즉시 후속:</strong> 악마의 예술 버프로 <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 연타
                    </li>
                    <li>
                      <strong>리소스 관리:</strong> 버스트 전 영혼의 조각 5개 유지
                    </li>
                    <li>
                      <strong>장신구 조합:</strong> 지옥불정령과 쿨기 장신구/물약 맞춰 사용
                    </li>
                  </ul>
                </div>
              </>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>
                <SkillIcon skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.summonInfernal} textOnly={true} /> 지옥불정령 버스트 최적화
              </h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>
                  <strong style={{ color: '#ffa500' }}>재사용 대기시간:</strong> 3분 (쿨기 감소 특성 선택 시 더 짧음)
                </li>
                <li>
                  <strong>효과:</strong> 30초 동안 강력한 <SkillIcon skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.summonInfernal} textOnly={true} /> 소환 + 영혼의 조각 파편 3개 생성
                </li>
                <li>
                  <strong>장신구 조합:</strong> <SkillIcon skill={skillData.summonInfernal} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.summonInfernal} textOnly={true} />과 함께 쿨기 장신구/물약 맞춰 사용
                </li>
                <li>
                  <strong style={{ color: '#FFD700' }}>폭딜 구간 동안:</strong> 영혼의 조각을 빠르게 생성하여 <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} /><SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 연타
                </li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#ffa500', fontSize: '1.1rem', marginBottom: '15px' }}>영혼의 조각 관리 (공통)</h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>
                  <strong>이상적 유지:</strong> 2~3개 (최대 5개)
                </li>
                <li>
                  <SkillIcon skill={skillData.conflagrate} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.conflagrate} textOnly={true} /> - 파편 5개 생성 (즉시 시전, 2충전)
                </li>
                <li>
                  <SkillIcon skill={skillData.soulFire} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.soulFire} textOnly={true} /> - 조각 1개 생성 (4초 시전, 20초 쿨)
                </li>
                <li>
                  <SkillIcon skill={skillData.incinerate} size="small" className={styles.inlineIcon} />
                  <SkillIcon skill={skillData.incinerate} textOnly={true} /> - 파편 2-3개 생성 (2초 시전, 필러)
                </li>
                <li>
                  <strong style={{ color: '#ff6b6b' }}>주의:</strong> 5개 상태에서 추가 생성 시 손실 - 즉시 <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 사용
                </li>
              </ul>
            </div>
          </div>

          {/* 고급 메커니즘 섹션 - 맥스롤 기반 */}
          <div className={styles.subsection} style={{
            background: 'rgba(139, 0, 255, 0.1)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '1.5rem',
            border: '2px solid rgba(139, 0, 255, 0.3)'
          }}>
            <h3 className={styles.subsectionTitle} style={{ color: '#a78bfa', marginBottom: '20px' }}>
              🎓 고급 메커니즘 & 최적화
            </h3>

            {/* 대혼란 구간 최적화 */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{
                color: '#c084fc',
                fontSize: '1.2rem',
                marginBottom: '15px',
                borderBottom: '2px solid rgba(192, 132, 252, 0.3)',
                paddingBottom: '8px'
              }}>
                <SkillIcon skill={skillData.havoc} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.havoc} textOnly={true} /> 대혼란 구간 극대화
              </h4>

              {/* 준비 단계 */}
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                borderLeft: '4px solid #22c55e',
                padding: '15px',
                marginBottom: '15px'
              }}>
                <h5 style={{ color: '#22c55e', fontSize: '1.05rem', marginBottom: '10px' }}>
                  ⏱️ 진입 전 준비 (5초 전부터)
                </h5>
                <ul style={{ lineHeight: '1.8', marginLeft: '20px', paddingLeft: '0' }}>
                  <li>
                    <strong>영혼의 조각 4-5개 보유</strong> - 즉시 연타할 수 있도록
                  </li>
                  <li>
                    <SkillIcon skill={skillData.conflagrate} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.conflagrate} textOnly={true} /> <strong>거의 2충전 상태</strong> - 지속시간 중 재충전 가능하게
                  </li>
                  <li>
                    <strong>모든 대상에 DoT 적용</strong> - {selectedTier === 'hellcaller' ? (
                      <>
                        <SkillIcon skill={skillData.wither} size="small" className={styles.inlineIcon} />
                        <SkillIcon skill={skillData.wither} textOnly={true} />
                      </>
                    ) : (
                      <>
                        <SkillIcon skill={skillData.immolate} size="small" className={styles.inlineIcon} />
                        <SkillIcon skill={skillData.immolate} textOnly={true} />
                      </>
                    )} 미리 갱신
                  </li>
                  {selectedTier === 'diabolist' && (
                    <li>
                      <SkillIcon skill={skillData.ritualOfRuin} size="small" className={styles.inlineIcon} />
                      <SkillIcon skill={skillData.ritualOfRuin} textOnly={true} /> <strong>버프 준비</strong> - 악마의 의식 1단계 발동 상태
                    </li>
                  )}
                </ul>
              </div>

              {/* 실행 단계 */}
              <div style={{
                background: 'rgba(234, 179, 8, 0.1)',
                borderLeft: '4px solid #eab308',
                padding: '15px',
                marginBottom: '15px'
              }}>
                <h5 style={{ color: '#eab308', fontSize: '1.05rem', marginBottom: '10px' }}>
                  ⚡ 지속시간 동안 (12초)
                </h5>
                <ol style={{ lineHeight: '1.8', marginLeft: '20px', paddingLeft: '0' }}>
                  <li>
                    <SkillIcon skill={skillData.havoc} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.havoc} textOnly={true} /> 보조 대상에 시전
                  </li>
                  <li>
                    <SkillIcon skill={skillData.conflagrate} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.conflagrate} textOnly={true} /> 즉시 시전 (영혼의 조각 충전)
                  </li>
                  <li>
                    <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 연타 (주 대상 60% 피해가 보조 대상에 복제)
                  </li>
                  <li>
                    <SkillIcon skill={skillData.conflagrate} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.conflagrate} textOnly={true} /> 재충전되면 다시 사용
                  </li>
                  <li>
                    <SkillIcon skill={skillData.shadowburn} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.shadowburn} textOnly={true} /> 마무리 (남은 영혼의 조각 소진)
                  </li>
                </ol>
              </div>

              {/* 타임라인 다이어그램 */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '20px',
                borderRadius: '8px',
                marginTop: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.9rem'
                }}>
                  <div style={{
                    background: '#22c55e',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold'
                  }}>
                    -5초
                  </div>
                  <div style={{ color: '#94a3b8' }}>준비 시작</div>
                  <div style={{ flex: 1, height: '2px', background: 'linear-gradient(to right, #22c55e, #eab308)' }}></div>
                  <div style={{
                    background: '#eab308',
                    color: 'black',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold'
                  }}>
                    0초
                  </div>
                  <div style={{ color: '#94a3b8' }}>대혼란 시전</div>
                  <div style={{ flex: 1, height: '2px', background: 'linear-gradient(to right, #eab308, #ef4444)' }}></div>
                  <div style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold'
                  }}>
                    12초
                  </div>
                  <div style={{ color: '#94a3b8' }}>지속시간 종료</div>
                </div>
              </div>
            </div>

            {/* 스킬 선택 의사결정 테이블 */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{
                color: '#c084fc',
                fontSize: '1.2rem',
                marginBottom: '15px',
                borderBottom: '2px solid rgba(192, 132, 252, 0.3)',
                paddingBottom: '8px'
              }}>
                🎯 스킬 선택 의사결정 테이블
              </h4>

              <p style={{ color: '#94a3b8', marginBottom: '15px', lineHeight: '1.6' }}>
                여러 적이 있을 때 {' '}
                <SkillIcon skill={skillData.rainOfFire} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.rainOfFire} textOnly={true} />, {' '}
                <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.chaosBolt} textOnly={true} />, {' '}
                <SkillIcon skill={skillData.shadowburn} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.shadowburn} textOnly={true} /> 중 최적의 스킬을 선택하는 기준:
              </p>

              {/* 의사결정 테이블 */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem',
                  background: 'rgba(0, 0, 0, 0.3)'
                }}>
                  <thead>
                    <tr style={{ background: 'rgba(139, 0, 255, 0.2)' }}>
                      <th style={{ padding: '12px', border: '1px solid rgba(139, 0, 255, 0.3)', color: '#c084fc' }}>적 수</th>
                      <th style={{ padding: '12px', border: '1px solid rgba(139, 0, 255, 0.3)', color: '#c084fc' }}>대혼란</th>
                      <th style={{ padding: '12px', border: '1px solid rgba(139, 0, 255, 0.3)', color: '#c084fc' }}>이동 필요</th>
                      <th style={{ padding: '12px', border: '1px solid rgba(139, 0, 255, 0.3)', color: '#c084fc' }}>우선 처치</th>
                      <th style={{ padding: '12px', border: '1px solid rgba(139, 0, 255, 0.3)', color: '#c084fc' }}>영혼 조각</th>
                      <th style={{ padding: '12px', border: '1px solid rgba(139, 0, 255, 0.3)', color: '#fbbf24', fontWeight: 'bold' }}>최적 선택</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center' }}>2</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#22c55e' }}>✓</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#ef4444' }}>✗</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#ef4444' }}>✗</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center' }}>4-5</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', background: 'rgba(234, 179, 8, 0.2)', fontWeight: 'bold' }}>
                        <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
                        <SkillIcon skill={skillData.chaosBolt} textOnly={true} />
                      </td>
                    </tr>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center' }}>3</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#ef4444' }}>✗</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#ef4444' }}>✗</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#22c55e' }}>✓</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center' }}>4-5</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', background: 'rgba(234, 179, 8, 0.2)', fontWeight: 'bold' }}>
                        <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
                        <SkillIcon skill={skillData.chaosBolt} textOnly={true} />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center' }}>3-4</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#ef4444' }}>✗</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#22c55e' }}>✓</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#ef4444' }}>✗</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center' }}>3+</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', background: 'rgba(234, 179, 8, 0.2)', fontWeight: 'bold' }}>
                        <SkillIcon skill={skillData.shadowburn} size="small" className={styles.inlineIcon} />
                        <SkillIcon skill={skillData.shadowburn} textOnly={true} />
                      </td>
                    </tr>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center' }}>5+</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#ef4444' }}>✗</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#ef4444' }}>✗</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#ef4444' }}>✗</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center' }}>3+</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', background: 'rgba(234, 179, 8, 0.2)', fontWeight: 'bold' }}>
                        <SkillIcon skill={skillData.rainOfFire} size="small" className={styles.inlineIcon} />
                        <SkillIcon skill={skillData.rainOfFire} textOnly={true} />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center' }}>5+</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#22c55e' }}>✓</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#ef4444' }}>✗</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center', color: '#ef4444' }}>✗</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', textAlign: 'center' }}>4-5</td>
                      <td style={{ padding: '10px', border: '1px solid rgba(139, 0, 255, 0.2)', background: 'rgba(234, 179, 8, 0.2)', fontWeight: 'bold' }}>
                        <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
                        <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> (대혼란 중)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{
                marginTop: '15px',
                padding: '12px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '6px',
                borderLeft: '4px solid #3b82f6'
              }}>
                <strong style={{ color: '#60a5fa' }}>💡 핵심 원칙:</strong>
                <ul style={{ marginTop: '8px', lineHeight: '1.7', color: '#94a3b8', marginLeft: '20px', paddingLeft: '0' }}>
                  <li>
                    <SkillIcon skill={skillData.havoc} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.havoc} textOnly={true} /> 활성화 시 5개 이상 적에서도 {' '}
                    <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.chaosBolt} textOnly={true} />가 {' '}
                    <SkillIcon skill={skillData.rainOfFire} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.rainOfFire} textOnly={true} />보다 우선
                  </li>
                  <li>우선 처치 대상이 있으면 단일 대상 피해 우선</li>
                  <li>이동이 필요하면 즉시 시전 가능한 {' '}
                    <SkillIcon skill={skillData.shadowburn} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.shadowburn} textOnly={true} /> 활용
                  </li>
                </ul>
              </div>
            </div>

            {/* 점화 간격 조절 & 역류 관리 */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{
                color: '#c084fc',
                fontSize: '1.2rem',
                marginBottom: '15px',
                borderBottom: '2px solid rgba(192, 132, 252, 0.3)',
                paddingBottom: '8px'
              }}>
                <SkillIcon skill={skillData.conflagrate} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.conflagrate} textOnly={true} /> 점화 간격 조절 & 역류 관리
              </h4>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '15px',
                borderLeft: '4px solid #ef4444'
              }}>
                <h5 style={{ color: '#ef4444', fontSize: '1.05rem', marginBottom: '10px' }}>
                  ❌ 잘못된 사용법
                </h5>
                <ul style={{ lineHeight: '1.8', color: '#94a3b8', marginLeft: '20px', paddingLeft: '0' }}>
                  <li>2충전을 한 번에 연속으로 사용 ❌</li>
                  <li>
                    <SkillIcon skill={skillData.roaringBlaze} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.roaringBlaze} textOnly={true} /> 없이 {' '}
                    <SkillIcon skill={skillData.soulFire} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.soulFire} textOnly={true} /> 시전 ❌
                  </li>
                  <li>역류 충전을 낭비 ❌</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '15px',
                borderRadius: '6px',
                borderLeft: '4px solid #22c55e'
              }}>
                <h5 style={{ color: '#22c55e', fontSize: '1.05rem', marginBottom: '10px' }}>
                  ✅ 올바른 사용법
                </h5>
                <ol style={{ lineHeight: '1.8', color: '#e0e0e0', marginLeft: '20px', paddingLeft: '0' }}>
                  <li>
                    <SkillIcon skill={skillData.conflagrate} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.conflagrate} textOnly={true} /> 시전 → 역류 2중첩 획득
                  </li>
                  <li>
                    <strong style={{ color: '#22c55e' }}>1순위:</strong> 역류로 {' '}
                    <SkillIcon skill={skillData.soulFire} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.soulFire} textOnly={true} /> 시전 시간 단축 (4초 → 2.4초)
                  </li>
                  <li>
                    <strong style={{ color: '#22c55e' }}>2순위:</strong> 남은 역류로 {' '}
                    <SkillIcon skill={skillData.chaosBolt} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.chaosBolt} textOnly={true} /> 시전 시간 단축 (3초 → 1.8초)
                  </li>
                  <li>
                    <SkillIcon skill={skillData.roaringBlaze} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.roaringBlaze} textOnly={true} /> 버프 지속시간(8초) 고려하여 다음 {' '}
                    <SkillIcon skill={skillData.conflagrate} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.conflagrate} textOnly={true} /> 타이밍 조절
                  </li>
                  <li>충전 1회는 항상 남겨두어 버프 공백 방지</li>
                </ol>
              </div>

              {/* 타이밍 차트 */}
              <div style={{
                marginTop: '15px',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '15px',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px' }}>
                  <strong style={{ color: '#a78bfa' }}>⏱️ 이상적 타이밍 (8초 주기)</strong>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  fontSize: '0.8rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    background: '#f59e0b',
                    color: 'black',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    0s: 점화
                  </div>
                  <div style={{ color: '#94a3b8' }}>→</div>
                  <div style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '4px'
                  }}>
                    영혼의 불꽃
                  </div>
                  <div style={{ color: '#94a3b8' }}>→</div>
                  <div style={{
                    background: '#8b5cf6',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '4px'
                  }}>
                    혼돈의 화살
                  </div>
                  <div style={{ color: '#94a3b8' }}>→</div>
                  <div style={{
                    background: '#64748b',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '4px'
                  }}>
                    소각 필러
                  </div>
                  <div style={{ color: '#94a3b8' }}>→</div>
                  <div style={{
                    background: '#f59e0b',
                    color: 'black',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    8s: 점화 (반복)
                  </div>
                </div>
              </div>
            </div>

            {/* 파멸 디버프 & Spell Queue Window */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{
                color: '#c084fc',
                fontSize: '1.2rem',
                marginBottom: '15px',
                borderBottom: '2px solid rgba(192, 132, 252, 0.3)',
                paddingBottom: '8px'
              }}>
                <SkillIcon skill={skillData.eradication} size="small" className={styles.inlineIcon} />
                <SkillIcon skill={skillData.eradication} textOnly={true} /> 파멸 최적화 & 스펠 큐 시스템
              </h4>

              <p style={{ color: '#94a3b8', marginBottom: '15px', lineHeight: '1.6' }}>
                <strong style={{ color: '#a78bfa' }}>스펠 큐 시스템 (Spell Queue Window):</strong> 시전 완료 <strong style={{ color: '#fbbf24' }}>400ms 전</strong>부터 다음 주문을 입력할 수 있는 메커니즘. 이를 활용하면 파멸 디버프가 적용되기 전에 시전을 시작한 주문도 파멸의 혜택을 받을 수 있습니다.
              </p>

              {/* 메커니즘 다이어그램 */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}>
                  {/* 잘못된 방법 */}
                  <div>
                    <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '8px' }}>
                      ❌ 비효율적 (파멸 혜택 없음)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                      <div style={{ background: '#8b5cf6', color: 'white', padding: '6px 10px', borderRadius: '4px' }}>
                        혼돈의 화살 (2.6s 시전)
                      </div>
                      <div style={{ color: '#94a3b8' }}>→</div>
                      <div style={{ background: '#3b82f6', color: 'white', padding: '6px 10px', borderRadius: '4px' }}>
                        파멸 적용
                      </div>
                      <div style={{ color: '#94a3b8' }}>→</div>
                      <div style={{ background: '#64748b', color: 'white', padding: '6px 10px', borderRadius: '4px', opacity: 0.5 }}>
                        소각 (파멸 X)
                      </div>
                    </div>
                  </div>

                  {/* 올바른 방법 */}
                  <div>
                    <div style={{ color: '#22c55e', fontWeight: 'bold', marginBottom: '8px' }}>
                      ✅ 효율적 (Spell Queue Window 활용)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                      <div style={{ background: '#f59e0b', color: 'black', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
                        그림자 화상 (즉시)
                      </div>
                      <div style={{ color: '#94a3b8' }}>→</div>
                      <div style={{ background: '#3b82f6', color: 'white', padding: '6px 10px', borderRadius: '4px' }}>
                        파멸 적용 (즉시)
                      </div>
                      <div style={{ color: '#94a3b8' }}>→</div>
                      <div style={{ background: '#8b5cf6', color: 'white', padding: '6px 10px', borderRadius: '4px' }}>
                        혼돈의 화살 (2.6s 시전)
                      </div>
                      <div style={{ color: '#94a3b8' }}>→</div>
                      <div style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>
                        소각 (파멸 O, Queue 활용)
                      </div>
                    </div>
                    <div style={{
                      marginTop: '8px',
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      fontStyle: 'italic'
                    }}>
                      💡 혼돈의 화살 시전 중 마지막 400ms에 소각을 미리 입력하면 파멸 혜택을 받습니다
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '15px',
                borderRadius: '6px',
                borderLeft: '4px solid #3b82f6'
              }}>
                <h5 style={{ color: '#60a5fa', fontSize: '1rem', marginBottom: '10px' }}>
                  🎯 파멸 가동률 목표
                </h5>
                <ul style={{ lineHeight: '1.8', color: '#e0e0e0', marginLeft: '20px', paddingLeft: '0' }}>
                  <li>
                    <strong style={{ color: '#22c55e' }}>최소 목표:</strong> 40% 가동률
                  </li>
                  <li>
                    <strong style={{ color: '#fbbf24' }}>이상적 목표:</strong> 50-60% 가동률
                  </li>
                  <li>
                    <SkillIcon skill={skillData.shadowburn} size="small" className={styles.inlineIcon} />
                    <SkillIcon skill={skillData.shadowburn} textOnly={true} />를 주기적으로 사용하여 지속적 유지
                  </li>
                  <li>긴 시전 주문 앞에서 즉시 파멸 적용 후 Spell Queue 활용</li>
                </ul>
              </div>
            </div>

            {/* Pandemic 메커니즘 */}
            <div>
              <h4 style={{
                color: '#c084fc',
                fontSize: '1.2rem',
                marginBottom: '15px',
                borderBottom: '2px solid rgba(192, 132, 252, 0.3)',
                paddingBottom: '8px'
              }}>
                🔄 Pandemic 메커니즘 (DoT 갱신 최적화)
              </h4>

              <p style={{ color: '#94a3b8', marginBottom: '15px', lineHeight: '1.6' }}>
                <strong style={{ color: '#a78bfa' }}>Pandemic:</strong> DoT를 갱신할 때 <strong style={{ color: '#fbbf24' }}>남은 지속시간의 30%</strong>가 새로운 DoT에 추가되는 메커니즘. 이를 활용하면 DoT 가동률을 최대화하고 시전 횟수를 줄일 수 있습니다.
              </p>

              {/* 예시 계산 */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '12px' }}>
                  📊 계산 예시
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '10px',
                  fontSize: '0.9rem',
                  color: '#e0e0e0'
                }}>
                  <div style={{ color: '#60a5fa' }}>기본 지속시간:</div>
                  <div>{selectedTier === 'hellcaller' ? '12초 (쇠퇴)' : '18초 (제물)'}</div>

                  <div style={{ color: '#60a5fa' }}>Pandemic 구간:</div>
                  <div>{selectedTier === 'hellcaller' ? '3.6초 이하 (12초 × 30%)' : '5.4초 이하 (18초 × 30%)'}</div>

                  <div style={{ color: '#60a5fa' }}>남은 시간 4초일 때 갱신:</div>
                  <div>
                    4초의 30% = 1.2초 추가 → <strong style={{ color: '#22c55e' }}>
                      새로운 DoT 지속시간: {selectedTier === 'hellcaller' ? '13.2초 (12 + 1.2)' : '19.2초 (18 + 1.2)'}
                    </strong>
                  </div>

                  <div style={{ color: '#60a5fa' }}>너무 일찍 갱신 (8초 남았을 때):</div>
                  <div style={{ color: '#ef4444' }}>
                    2.4초만 추가 → <strong>시전 낭비 (8초를 버리고 2.4초만 얻음)</strong>
                  </div>
                </div>
              </div>

              {/* 최적 갱신 타이밍 */}
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '15px',
                borderRadius: '6px',
                borderLeft: '4px solid #22c55e'
              }}>
                <h5 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '10px' }}>
                  ✅ 최적 갱신 타이밍
                </h5>
                <ul style={{ lineHeight: '1.8', color: '#e0e0e0', marginLeft: '20px', paddingLeft: '0' }}>
                  <li>
                    <strong style={{ color: '#22c55e' }}>
                      {selectedTier === 'hellcaller' ? '쇠퇴: 3.6초 이하' : '제물: 5.4초 이하'}
                    </strong>에서 갱신 시작 (Pandemic 구간)
                  </li>
                  <li>
                    <strong style={{ color: '#fbbf24' }}>이동 예상:</strong> Pandemic 구간 전이라도 이동이 예상되면 미리 갱신
                  </li>
                  <li>
                    <strong style={{ color: '#60a5fa' }}>
                      {selectedTier === 'hellcaller' ? (
                        <>
                          <SkillIcon skill={skillData.cataclysm} size="small" className={styles.inlineIcon} />
                          <SkillIcon skill={skillData.cataclysm} textOnly={true} /> 활용:
                        </>
                      ) : (
                        <>
                          <SkillIcon skill={skillData.cataclysm} size="small" className={styles.inlineIcon} />
                          <SkillIcon skill={skillData.cataclysm} textOnly={true} /> 활용:
                        </>
                      )}
                    </strong> 광역 전투에서 모든 대상에 즉시 DoT 적용 (Pandemic 무시)
                  </li>
                  <li>
                    <strong>긴급 상황:</strong> 즉시 처치해야 할 대상은 Pandemic 구간 무시하고 DoT 적용
                  </li>
                </ul>
              </div>

              {/* 시각적 타이밍 가이드 */}
              <div style={{
                marginTop: '15px',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '15px',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px' }}>
                  <strong style={{ color: '#a78bfa' }}>⏱️ DoT 지속시간 타임라인</strong>
                </div>
                <div style={{ position: 'relative', height: '60px' }}>
                  {/* 배경 바 */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '20px',
                    height: '20px',
                    background: 'linear-gradient(to right, #22c55e 0%, #22c55e 70%, #fbbf24 70%, #fbbf24 100%)',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}></div>

                  {/* 라벨들 */}
                  <div style={{ position: 'absolute', left: '0%', top: '0', fontSize: '0.75rem', color: '#22c55e', fontWeight: 'bold' }}>
                    {selectedTier === 'hellcaller' ? '12초' : '18초'}
                  </div>
                  <div style={{ position: 'absolute', left: '70%', top: '0', fontSize: '0.75rem', color: '#fbbf24', fontWeight: 'bold' }}>
                    Pandemic
                  </div>
                  <div style={{ position: 'absolute', right: '0%', top: '0', fontSize: '0.75rem', color: '#ef4444', fontWeight: 'bold' }}>
                    0초
                  </div>

                  <div style={{ position: 'absolute', left: '70%', bottom: '0', fontSize: '0.7rem', color: '#94a3b8' }}>
                    {selectedTier === 'hellcaller' ? '3.6초' : '5.4초'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroCard>
    </Section>
  );

  // 특성 빌드 데이터 (TWW 시즌3 11.2 패치 기준)
  const talentBuilds = {
    hellcaller: {
      'raid-aoe': {
        name: '레이드 광역',
        description: '지옥소환사 영웅 특성을 활용한 광역 빌드입니다. 쇠퇴를 8중첩까지 관리하고 대재앙으로 다수 대상에 즉시 적용합니다. 악마불 집중과 불의 비로 강력한 광역 딜을 제공하며, 대혼란 지속시간 동안 혼돈의 화살 우선 사용이 핵심입니다.',
        code: 'blizzard/CsQAAAAAAAAAAAAAAAAAAAAAAAmZmZmZEzmBmtZmZYWmtZMzwsYGzyiZGAAAAYYmtlZmlZAjZMsQGYbYhGLYAAAAAAAMjxMAA',
        icon: '🔥',
        source: 'Wowhead 공식 가이드'
      },
      'mythic-plus': {
        name: '쐐기돌',
        description: '지옥소환사를 활용한 쐐기돌 전용 빌드입니다. 쇠퇴 DoT 관리와 악마불 집중 활용이 핵심이며, 5개 이상 밀집된 대상에서만 불의 비를 사용합니다. 대혼란을 보조 대상에 적용하여 혼돈의 화살 피해를 분산시키는 것이 주요 전략입니다.',
        code: 'blizzard/CsQAAAAAAAAAAAAAAAAAAAAAAAmZmZmZEzmBmtZmZYWmtZMzwsYGzyiZGAAAAYYmtlZmlZAjZMsQGYbYhGLYAAAAAAAMjxMAA',
        icon: '🔥',
        source: 'Wowhead 공식 가이드'
      }
    },
    diabolist: {
      'raid-single': {
        name: '레이드 단일 대상',
        description: '악마학자 영웅 특성을 활용한 단일 대상 최적화 빌드입니다. 악마의 예술 패시브로 혼돈의 화살 피해를 증폭시키고, 영혼의 조각 소비로 임프 어미/군주 소환 확률을 증가시킵니다. 티어 세트 효과인 악마의 눈동자를 활용하여 추가 폭발 피해를 제공합니다.',
        code: 'blizzard/CsQAAAAAAAAAAAAAAAAAAAAAAAmZmZmZEzmBmtZmZYWmNDzMzsYGjFzMAAAAwYmZZZmZZGwYGDLkB2GWoxCGAAAAAAAzYMDAA',
        icon: '😈',
        source: 'Wowhead 공식 가이드'
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
                'linear-gradient(135deg, #ff6b35 0%, #8b2500 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'hellcaller' ? '#ff6b35' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'hellcaller' ? '#ff6b35' : '#94a3b8',
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
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>쐐기 추천</span>
          </button>

          <button
            onClick={() => {
              setSelectedTier('diabolist');
              setSelectedBuild('raid-single');
            }}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: selectedTier === 'diabolist' ?
                'linear-gradient(135deg, #8b00ff 0%, #4b0082 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedTier === 'diabolist' ? '#8b00ff' : '#2a2d35'}`,
              borderRadius: '8px',
              color: selectedTier === 'diabolist' ? '#8b00ff' : '#94a3b8',
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
            <span style={{ fontSize: '1.5rem' }}>😈</span>
            <span>악마학자</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>레이드 추천</span>
          </button>
        </div>

        {/* 빌드 선택 버튼들 */}
        <div style={{ padding: '20px' }}>
          {/* ⚠️ TODO: selectedTier 조건을 실제 영웅특성명으로 변경 */}
          <h4 style={{
            color: selectedTier === 'heroTalent1' ? '#9482C9' : '#32CD32',
            marginBottom: '20px',
            fontSize: '1.3rem'
          }}>
            {selectedTier === 'heroTalent1' ? '지옥소환사' : '악마학자'} 특성 빌드
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
      const breakpointData = {
        hellcaller: {
          single: {
            haste: {
              softcap: '없음 (SimC 권장)',
              breakpoints: [],
              note: '치명타와 동등한 최우선 스탯. 시전 속도 증가와 쿨다운 감소로 영혼의 조각 생성 속도 향상. 파멸 디버프 활용 시 추가 효율 증가'
            },
            crit: {
              softcap: '없음',
              breakpoints: [],
              note: '가속과 동등한 최우선 스탯. 혼돈의 화살이 항상 치명타 피해를 입히므로 치명타 확률보다 치명타 피해량이 핵심. 소각 치명타 시 영혼의 조각 파편 3개 생성 (비치명타 2개)'
            },
            mastery: {
              softcap: '없음',
              breakpoints: [],
              note: '3순위 스탯. 암흑불길 피해 증가 (쇠퇴, 제물, 악마불 집중 피해 강화). 지옥소환사는 쇠퇴 중첩 관리로 높은 가치'
            },
            versatility: {
              softcap: '없음',
              breakpoints: [],
              note: '최하위 우선순위. 피해와 피해 감소 균형 증가. 생존이 중요한 상황에서 가치 상승'
            }
          },
          aoe: {
            haste: {
              softcap: '없음 (SimC 권장)',
              breakpoints: [],
              note: '최우선 스탯. 빠른 리소스 생성과 쇠퇴 중첩 관리 효율 증가. 대재앙 쿨다운 감소로 광역 딜 향상'
            },
            crit: {
              softcap: '없음',
              breakpoints: [],
              note: '최우선 스탯. 치명타 피해량 증가가 핵심. 혼돈의 화살 대혼란 복제 피해 증폭. 소각 치명타로 리소스 생성 가속화'
            },
            mastery: {
              softcap: '없음',
              breakpoints: [],
              note: '3순위 스탯. 암흑불길 피해 증가로 쇠퇴 DoT와 악마불 집중 광역 피해 강화'
            },
            versatility: {
              softcap: '없음',
              breakpoints: [],
              note: '최하위 우선순위. 쐐기돌에서 생존력이 필요할 때 가치 상승'
            }
          }
        },
        diabolist: {
          single: {
            haste: {
              softcap: '없음 (SimC 권장)',
              breakpoints: [],
              note: '최우선 스탯. 영혼의 조각 생성 속도 증가로 악마의 예술 프록 빈도 향상. 차원 균열 쿨다운 감소'
            },
            crit: {
              softcap: '없음',
              breakpoints: [],
              note: '최우선 스탯. 악마의 예술로 강화된 혼돈의 화살 피해 극대화. 치명타 피해량이 치명타 확률보다 우선'
            },
            mastery: {
              softcap: '없음',
              breakpoints: [],
              note: '3순위 스탯. 암흑불길 피해 증가로 제물 DoT와 혼돈의 화살 피해 강화'
            },
            versatility: {
              softcap: '없음',
              breakpoints: [],
              note: '최하위 우선순위. 전반적인 피해와 생존력 증가'
            }
          },
          aoe: {
            haste: {
              softcap: '없음 (SimC 권장)',
              breakpoints: [],
              note: '최우선 스탯. 리소스 생성 속도와 차원 균열 쿨다운 감소. 빠른 영혼의 조각 생성으로 불의 비 사용 빈도 증가'
            },
            crit: {
              softcap: '없음',
              breakpoints: [],
              note: '최우선 스탯. 치명타 피해량 증가. 불의 비와 혼돈의 화살 광역 피해 강화'
            },
            mastery: {
              softcap: '없음',
              breakpoints: [],
              note: '3순위 스탯. 암흑불길 피해 증가로 광역에서도 안정적인 딜 제공'
            },
            versatility: {
              softcap: '없음',
              breakpoints: [],
              note: '최하위 우선순위. 쐐기돌 고단에서 생존력 필요 시 선택'
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

    // 파괴 흑마법사 스탯 우선순위 (TWW 시즌3 11.2 패치 기준, Wowhead 공식 가이드)
    // 가속 = 치명타 > 특화 > 유연성
    const statPriorities = {
      hellcaller: {
        single: ['haste', 'crit', 'mastery', 'versatility'],
        aoe: ['haste', 'crit', 'mastery', 'versatility']
      },
      diabolist: {
        single: ['haste', 'crit', 'mastery', 'versatility'],
        aoe: ['haste', 'crit', 'mastery', 'versatility']
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
                  'linear-gradient(135deg, #ff6b35 0%, #8b2500 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'hellcaller' ? '#ff6b35' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'hellcaller' ? '#ff6b35' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🔥 지옥소환사
            </button>
            <button
              onClick={() => setSelectedStatHero('diabolist')}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: selectedStatHero === 'diabolist' ?
                  'linear-gradient(135deg, #8b00ff 0%, #4b0082 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedStatHero === 'diabolist' ? '#8b00ff' : '#2a2d35'}`,
                borderRadius: '8px',
                color: selectedStatHero === 'diabolist' ? '#8b00ff' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              😈 악마학자
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
              color: selectedStatHero === 'hero1' ? '#9482C9' : '#32CD32',
              fontSize: '1.3rem',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{selectedStatHero === 'hero1' ? '🔮' : '💀'}</span>
              <span>{selectedStatHero === 'hero1' ? '지옥소환사' : '악마학자'}</span>
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
                  ((selectedStatHero === 'hero1' && selectedStatMode === 'single' && index === 2) ||
                   (selectedStatHero === 'hero2' && index === 4));

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
                  <h5 style={{ color: '#ff4500', marginBottom: '10px' }}>
                    지옥소환사 (Hellcaller)
                  </h5>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li><strong>단일:</strong> 가속 = 치명타 > 특화 > 유연 (SimC 권장)</li>
                    <li><strong>광역:</strong> 가속 = 치명타 > 특화 > 유연 (쇠퇴 DoT 관리 중요)</li>
                    <li><strong>핵심:</strong> 파멸 디버프와 쇠퇴 중첩 관리로 가속/치명타 효율 극대화</li>
                  </ul>
                </div>

                <div>
                  <h5 style={{ color: '#8b00ff', marginBottom: '10px' }}>
                    악마학자 (Diabolist)
                  </h5>
                  <ul style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li><strong>단일/광역:</strong> 가속 = 치명타 > 특화 > 유연</li>
                    <li><strong>핵심:</strong> 영혼의 조각 생성 속도와 악마의 예술 프록 빈도 향상</li>
                    <li><strong>티어 세트:</strong> 치명타 피해량으로 악마의 눈동자 피해 극대화</li>
                  </ul>
                </div>

                <div style={{
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    ⚠️ 혼돈의 화살이 항상 치명타하므로 <strong style={{ color: '#ff6b35' }}>치명타 피해량</strong>이 치명타 확률보다 우선. 특별한 하드 브레이크포인트 없음 (SimC로 최적값 확인 권장)
                  </p>
                </div>
              </div>
            </div>

            {/* 중요 참고사항 */}
            <div style={{
              background: 'rgba(255, 107, 53, 0.05)',
              border: '1px solid rgba(255, 107, 53, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h4 style={{ color: '#ff6b35', marginBottom: '15px', fontSize: '1.1rem' }}>
                ⚠️ 중요 참고사항
              </h4>
              <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '0.95rem' }}>
                <li><strong style={{ color: '#ff6b35' }}>특별한 하드 브레이크포인트 없음:</strong> 가속과 치명타를 균형있게 확보하는 것이 핵심</li>
                <li><strong style={{ color: '#ffa500' }}>치명타 피해량 우선:</strong> 혼돈의 화살이 항상 치명타하므로 치명타 피해량 &gt; 치명타 확률</li>
                <li><strong style={{ color: '#9482C9' }}>리소스 관리:</strong> 영혼의 조각 5개 캡 방지가 스탯보다 우선순위 높음</li>
                {selectedStatHero === 'hero1' && (
                  <li><strong style={{ color: '#ff4500' }}>지옥소환사:</strong> 파멸 디버프 40-60% 가동률 유지 시 가속/치명타 효율 극대화</li>
                )}
                {selectedStatHero === 'hero2' && (
                  <li><strong style={{ color: '#8b00ff' }}>악마학자:</strong> 악마의 예술 프록 빈도와 티어 세트 효과를 위한 치명타 피해량 중요</li>
                )}
                <li><strong>SimC 권장:</strong> 정확한 스탯 가중치는 개인 캐릭터 시뮬레이션(Raidbots) 필수</li>
                <li><strong>콘텐츠별 차이:</strong> 레이드 vs 쐐기돌에서 스탯 우선순위 동일 (가속=치명타 &gt; 특화 &gt; 유연)</li>
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
haste=1.00      # 가속 (소프트캡 25-30%)
mastery=0.95    # 특화 (스킬 피해 증가)
crit=0.85       # 치명
versatility=0.70

# Stat Weights (악마학자 - 광역/쐐기)
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
                파괴 흑마법사 가이드
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

export default GuideTemplate;