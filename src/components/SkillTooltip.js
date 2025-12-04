// ============================================================
// Skill Tooltip - SkillHub 통합 툴팁 컴포넌트
// ============================================================
// 목적: ID만으로 스킬 정보를 자동 조회하여 상세 툴팁 표시
// 업데이트: 2025-11-11
// ============================================================

import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { useSkillHub } from '../contexts/SkillHubContext';
import { eventBus, EVENTS } from '../utils/EventBus';

// Styled Components
const TooltipContainer = styled.div`
  position: fixed;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(15, 15, 25, 0.98) 100%);
  border: 2px solid ${props => props.borderColor || '#AAD372'};
  border-radius: 12px;
  padding: 16px;
  z-index: 10000;
  width: 350px;
  pointer-events: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9), 0 0 20px ${props => props.glowColor || 'rgba(170, 211, 114, 0.2)'};
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${props => props.borderColor || 'rgba(170, 211, 114, 0.3)'};
`;

const IconImage = styled.img`
  width: 48px;
  height: 48px;
  border: 2px solid ${props => props.borderColor || '#AAD372'};
  border-radius: 6px;
  box-shadow: 0 0 12px ${props => props.glowColor || 'rgba(170, 211, 114, 0.3)'};
`;

const TitleSection = styled.div`
  flex: 1;
`;

const SkillName = styled.h3`
  margin: 0;
  color: ${props => props.color || '#AAD372'};
  font-size: 1.1rem;
  font-weight: 600;
  text-shadow: 0 0 8px ${props => props.glowColor || 'rgba(170, 211, 114, 0.4)'};
`;

const EnglishName = styled.div`
  color: #999;
  font-size: 0.85rem;
  font-style: italic;
`;

const Description = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 12px;
  max-height: 120px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(170, 211, 114, 0.3);
    border-radius: 2px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  font-size: 0.85rem;
`;

const StatLabel = styled.span`
  color: ${props => props.color || '#AAD372'};
  font-weight: 600;
`;

const StatValue = styled.span`
  color: ${props => props.color || '#e0e0e0'};
`;

/**
 * SkillTooltip Component
 *
 * @param {string|number} skillId - 스킬 ID (Central DB 조회용)
 * @param {string} size - 아이콘 크기 ('small', 'medium', 'large')
 * @param {boolean} showTooltip - 툴팁 표시 여부
 * @param {boolean} textOnly - 텍스트만 표시 (아이콘 없음)
 * @param {string} className - 추가 CSS 클래스
 * @param {function} onClick - 클릭 이벤트 핸들러
 */
const SkillTooltip = ({
  skillId,
  size = 'medium',
  showTooltip = true,
  textOnly = false,
  className = '',
  onClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const { getSkillById } = useSkillHub();

  // Central DB에서 스킬 데이터 자동 조회
  const skill = getSkillById(skillId);

  // 스킬 데이터 없으면 null 반환
  if (!skill) {
    console.warn(`[SkillTooltip] 스킬 ID ${skillId} 찾을 수 없음`);
    return null;
  }

  // 툴팁 포털 생성 (document.body에 직접 렌더링)
  const getTooltipPortal = () => {
    let portal = document.getElementById('tooltip-portal');
    if (!portal) {
      portal = document.createElement('div');
      portal.id = 'tooltip-portal';
      document.body.appendChild(portal);
    }
    return portal;
  };

  // 스킬 타입별 색상 결정
  const getSkillColor = () => {
    if (skill.type === '지속 효과' || skill.type === 'passive') return '#9e9e9e';
    if (skill.cooldown && skill.cooldown !== '없음') return '#ffa500';
    return '#AAD372';
  };

  // 화면 경계 체크 및 툴팁 위치 계산
  const calculateTooltipPosition = () => {
    if (!elementRef.current) return { top: 0, left: 0 };

    const rect = elementRef.current.getBoundingClientRect();
    const tooltipWidth = 350;
    const tooltipHeight = 280;

    // 기본 위치: 요소 위쪽 중앙
    let top = rect.top - tooltipHeight - 10;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // 위쪽 공간 부족 시 아래쪽으로 이동
    if (top < 10) {
      top = rect.bottom + 10;
    }

    // 좌측 경계 체크
    if (left < 10) {
      left = 10;
    }
    // 우측 경계 체크
    else if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }

    return { top, left };
  };

  // 툴팁 렌더링 (Portal 사용)
  const renderTooltip = () => {
    if (!isVisible || !elementRef.current) return null;

    const { top, left } = calculateTooltipPosition();
    const color = getSkillColor();

    return ReactDOM.createPortal(
      <TooltipContainer
        style={{ top: `${top}px`, left: `${left}px` }}
        borderColor={color}
        glowColor={color === '#AAD372' ? 'rgba(170, 211, 114, 0.2)' : 'rgba(255, 165, 0, 0.2)'}
      >
        <Header borderColor={`${color}40`}>
          <IconImage
            src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
            alt={skill.koreanName}
            borderColor={color}
            glowColor={color === '#AAD372' ? 'rgba(170, 211, 114, 0.3)' : 'rgba(255, 165, 0, 0.3)'}
            onError={(e) => {
              e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
            }}
          />
          <TitleSection>
            <SkillName color={color} glowColor={`${color}66`}>
              {skill.koreanName}
            </SkillName>
            {skill.englishName && <EnglishName>{skill.englishName}</EnglishName>}
          </TitleSection>
        </Header>

        <Description>{skill.description || '설명 없음'}</Description>

        <StatsGrid>
          {skill.castTime && (
            <>
              <StatLabel>시전 시간:</StatLabel>
              <StatValue>{skill.castTime}</StatValue>
            </>
          )}
          {skill.cooldown && skill.cooldown !== '없음' && (
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
          {skill.resourceGain && skill.resourceGain !== '없음' && (
            <>
              <StatLabel color="#4fc3f7">획득:</StatLabel>
              <StatValue>{skill.resourceGain}</StatValue>
            </>
          )}
        </StatsGrid>
      </TooltipContainer>,
      getTooltipPortal()
    );
  };

  // 마우스 이벤트 핸들러
  const handleMouseEnter = () => {
    setIsVisible(true);
    eventBus.emit(EVENTS.TOOLTIP_SHOWN, { skillId: skill.id, skillName: skill.koreanName });
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    eventBus.emit(EVENTS.TOOLTIP_HIDDEN, { skillId: skill.id });
  };

  const handleClick = () => {
    eventBus.emit(EVENTS.SKILL_SELECTED, {
      skillId: skill.id,
      skillName: skill.koreanName,
      class: skill.class,
      spec: skill.spec
    });

    if (onClick) onClick(skill);
  };

  // 아이콘 크기 매핑
  const sizeMap = {
    small: '24px',
    medium: '32px',
    large: '48px'
  };

  const color = getSkillColor();

  // 텍스트만 표시 모드
  if (textOnly) {
    return (
      <>
        <span
          ref={elementRef}
          className={`skill-text ${className}`}
          style={{
            color: color,
            fontWeight: 'bold',
            cursor: 'pointer',
            borderBottom: `1px dotted ${color}`,
            textShadow: skill.type === '지속 효과' ? 'none' : `0 0 4px ${color}40`,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {skill.koreanName}
        </span>
        {showTooltip && renderTooltip()}
      </>
    );
  }

  // 아이콘 표시 모드
  return (
    <>
      <div
        ref={elementRef}
        className={`skill-icon ${className}`}
        style={{
          display: 'inline-block',
          width: sizeMap[size],
          height: sizeMap[size],
          position: 'relative',
          cursor: 'pointer'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <img
          src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
          alt={skill.koreanName}
          style={{
            width: '100%',
            height: '100%',
            border: size === 'small' ? 'none' : `2px solid ${color}`,
            borderRadius: size === 'small' ? '0' : '6px',
            opacity: skill.type === '지속 효과' ? 0.85 : 1,
            boxShadow: size === 'small' ? 'none' : (skill.type === '지속 효과' ? 'none' : `0 0 8px ${color}66`),
            transition: 'all 0.2s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
          }}
        />
      </div>
      {showTooltip && renderTooltip()}
    </>
  );
};

export default SkillTooltip;
