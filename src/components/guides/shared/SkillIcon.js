import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const sizeMap = {
  small: '24px',
  medium: '32px',
  large: '48px'
};

const SkillTooltip = styled.div`
  position: fixed;
  background-color: rgba(26, 26, 46, 0.98);
  background-image: linear-gradient(135deg, rgba(170, 211, 114, 0.1) 0%, transparent 50%);
  border: 2px solid #AAD372;
  border-radius: 10px;
  padding: 16px;
  z-index: 10000;
  width: 350px;
  pointer-events: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9), 0 0 20px rgba(170, 211, 114, 0.2);
  animation: fadeIn 0.2s ease-in-out;
`;

const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(170, 211, 114, 0.3);
`;

const TooltipIcon = styled.img`
  width: 48px;
  height: 48px;
  border: 2px solid #AAD372;
  border-radius: 6px;
`;

const TooltipTitle = styled.div`
  flex: 1;
`;

const TooltipName = styled.h3`
  margin: 0;
  color: #AAD372;
  font-size: 1.1rem;
  font-weight: 600;
`;

const TooltipEnglish = styled.div`
  color: #999;
  font-size: 0.85rem;
  font-style: italic;
`;

const TooltipBody = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const TooltipStats = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  font-size: 0.85rem;
`;

const StatLabel = styled.span`
  color: #AAD372;
  font-weight: bold;
`;

const StatValue = styled.span`
  color: #e0e0e0;
`;

const SkillIcon = ({
  skill,
  size = 'medium',
  showTooltip = true,
  className = '',
  textOnly = false
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const iconRef = useRef(null);

  if (!skill) return null;

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

    let top = rect.top - tooltipHeight - 10;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    if (top < 10) {
      top = rect.bottom + 10;
    }

    if (left < 10) {
      left = 10;
    } else if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }

    return ReactDOM.createPortal(
      <SkillTooltip style={{ top: `${top}px`, left: `${left}px` }}>
        <TooltipHeader>
          <TooltipIcon
            src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
            alt={skill.name}
            onError={(e) => {
              e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
            }}
          />
          <TooltipTitle>
            <TooltipName>{skill.name}</TooltipName>
            {skill.englishName && <TooltipEnglish>{skill.englishName}</TooltipEnglish>}
          </TooltipTitle>
        </TooltipHeader>

        <TooltipBody>{skill.description}</TooltipBody>

        <TooltipStats>
          {skill.castTime && (
            <>
              <StatLabel>시전 시간:</StatLabel>
              <StatValue>{skill.castTime}</StatValue>
            </>
          )}
          {skill.cooldown && (
            <>
              <StatLabel>재사용 대기시간:</StatLabel>
              <StatValue style={{ color: '#ffa500' }}>{skill.cooldown}</StatValue>
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
              <StatLabel style={{ color: '#ef5350' }}>소모:</StatLabel>
              <StatValue>{skill.resourceCost}</StatValue>
            </>
          )}
          {skill.resourceGain && skill.resourceGain !== '없음' && (
            <>
              <StatLabel style={{ color: '#4fc3f7' }}>획득:</StatLabel>
              <StatValue>{skill.resourceGain}</StatValue>
            </>
          )}
        </TooltipStats>
      </SkillTooltip>,
      getTooltipPortal()
    );
  };

  const getSkillColor = () => {
    if (skill.type === 'passive' || skill.type === '지속 효과') return '#9e9e9e';
    if (skill.type === 'cooldown' || skill.cooldown) return '#ffa500';
    return '#AAD372';
  };

  if (textOnly) {
    return (
      <>
        <span
          ref={iconRef}
          className={`skill-text ${className}`}
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
          {skill.name}
        </span>
        {showTooltip && <Tooltip />}
      </>
    );
  }

  return (
    <>
      <div
        ref={iconRef}
        className={`skill-icon ${className}`}
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
          src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
          alt={skill.name}
          style={{
            width: '100%',
            height: '100%',
            border: `2px solid ${getSkillColor()}`,
            borderRadius: '4px',
            opacity: skill.type === 'passive' || skill.type === '지속 효과' ? 0.85 : 1,
            boxShadow: skill.type === 'passive' || skill.type === '지속 효과' ? 'none' : '0 0 8px rgba(170, 211, 114, 0.4)',
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

export default SkillIcon;