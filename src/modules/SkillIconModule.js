import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import wowheadDescriptions from '../data/wowhead-descriptions.json';

/**
 * SkillIcon 모듈
 *
 * 모든 전문화 가이드에서 재사용 가능한 스킬 아이콘 + 툴팁 컴포넌트
 *
 * @example
 * import { SkillIcon, renderTextWithSkillIcons } from '../modules/SkillIconModule.js';
 *
 * // 기본 사용
 * <SkillIcon skill={skillData.arcaneblast} />
 *
 * // 텍스트 내 스킬명 자동 변환
 * {renderTextWithSkillIcons('비전 작렬 사용 시 비전 충전물 생성', skillData, primaryColor)}
 */

// 툴팁 포털 DOM 생성
const getTooltipPortal = () => {
  let portal = document.getElementById('tooltip-portal');
  if (!portal) {
    portal = document.createElement('div');
    portal.id = 'tooltip-portal';
    document.body.appendChild(portal);
  }
  return portal;
};

/**
 * SkillIcon 컴포넌트
 *
 * @param {Object} skill - 스킬 데이터 객체
 * @param {string} size - 'small' | 'medium' | 'large'
 * @param {boolean} showTooltip - 툴팁 표시 여부
 * @param {string} className - 추가 CSS 클래스
 * @param {boolean} textOnly - 텍스트 모드 (아이콘 작게 + 스킬명)
 * @param {string} primaryColor - 테마 주 색상 (기본: #C79C6E)
 */
export const SkillIcon = ({
  skill,
  size = 'medium',
  showTooltip = true,
  className = '',
  textOnly = false,
  primaryColor = '#C79C6E'
}) => {
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
    return primaryColor; // 기본 색상 - 액티브 스킬
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
      backgroundImage: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.1)} 0%, transparent 50%)`,
      border: `2px solid ${primaryColor}`,
      borderRadius: '10px',
      padding: '16px',
      zIndex: 10000,
      width: `${tooltipWidth}px`,
      pointerEvents: 'none',
      boxShadow: `0 8px 32px rgba(0, 0, 0, 0.9), 0 0 20px ${hexToRgba(primaryColor, 0.2)}`,
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
          borderBottom: `1px solid ${hexToRgba(primaryColor, 0.2)}`
        }}>
          <div style={{
            padding: '4px',
            background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.2)}, transparent)`,
            borderRadius: '8px',
            border: `1px solid ${hexToRgba(primaryColor, 0.3)}`
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
              color: primaryColor,
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
                  <span style={{ color: primaryColor, fontWeight: 'bold' }}>시전 시간:</span>
                  <span style={{ color: '#e0e0e0' }}>{enhancedSkill.castTime}</span>
                </>
              )}
              {enhancedSkill.cooldown && (
                <>
                  <span style={{ color: primaryColor, fontWeight: 'bold' }}>재사용 대기시간:</span>
                  <span style={{ color: '#ffa500' }}>{enhancedSkill.cooldown}</span>
                </>
              )}
              {enhancedSkill.range && (
                <>
                  <span style={{ color: primaryColor, fontWeight: 'bold' }}>사거리:</span>
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
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          color: getSkillColor(),
          fontWeight: 'bold',
          cursor: 'pointer',
          textShadow: skill.type === 'passive' ? 'none' : `0 0 4px ${hexToRgba(primaryColor, 0.3)}`,
          transition: 'all 0.2s ease',
          verticalAlign: 'middle'
        }}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        <img
          src={`https://wow.zamimg.com/images/wow/icons/large/${enhancedSkill.icon}.jpg`}
          alt={enhancedSkill.koreanName}
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '3px',
            display: 'inline-block',
            verticalAlign: 'middle'
          }}
          onError={(e) => {
            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
          }}
        />
        <span style={{ lineHeight: '18px', verticalAlign: 'middle' }}>{enhancedSkill.koreanName}</span>
        {showTooltip && <Tooltip />}
      </span>
    );
  }

  return (
    <>
      <div
        ref={iconRef}
        className={className}
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
            boxShadow: enhancedSkill.type === 'passive' || enhancedSkill.type === '지속 효과' ? 'none' : `0 0 8px ${hexToRgba(primaryColor, 0.4)}`,
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

/**
 * 텍스트 내 스킬명을 자동으로 SkillIcon으로 변환
 *
 * @param {string} text - 변환할 텍스트
 * @param {Object} skillData - 스킬 데이터 객체 ({ '스킬명': skillObject })
 * @param {string} primaryColor - 테마 주 색상
 * @returns {Array} React 엘리먼트 배열
 *
 * @example
 * const skillNameMap = {
 *   '비전 작렬': arcaneMageSkills.arcaneblast,
 *   '비전 탄막': arcaneMageSkills.arcanebarrage
 * };
 *
 * {renderTextWithSkillIcons('비전 작렬 사용 시 비전 탄막 준비', skillNameMap, '#69CCF0')}
 */
export const renderTextWithSkillIcons = (text, skillNameMap, primaryColor = '#C79C6E') => {
  if (!text || typeof text !== 'string') return text;
  if (!skillNameMap || Object.keys(skillNameMap).length === 0) return text;

  // 정규식 패턴 생성 (긴 스킬명부터 매칭되도록 정렬)
  const skillNames = Object.keys(skillNameMap).sort((a, b) => b.length - a.length);
  const skillPattern = new RegExp(skillNames.join('|'), 'g');

  const parts = [];
  let lastIndex = 0;
  let match;
  let matchIndex = 0;

  while ((match = skillPattern.exec(text)) !== null) {
    // 스킬명 이전 텍스트
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // SkillIcon 추가
    const skillName = match[0];
    const skillObj = skillNameMap[skillName];
    parts.push(
      <React.Fragment key={`skill-${matchIndex}`}>
        <SkillIcon skill={skillObj} textOnly primaryColor={primaryColor} />
      </React.Fragment>
    );

    lastIndex = match.index + skillName.length;
    matchIndex++;
  }

  // 나머지 텍스트
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

/**
 * Hex 색상을 RGBA로 변환
 * @param {string} hex - #RRGGBB 형식
 * @param {number} alpha - 투명도 (0-1)
 * @returns {string} rgba(r, g, b, alpha)
 */
const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// 기본 export (named export 권장)
export default {
  SkillIcon,
  renderTextWithSkillIcons
};
