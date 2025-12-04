/**
 * GuideContentComponents.js
 * WoW 가이드 콘텐츠 렌더링 컴포넌트 모듈
 * 
 * 목적: JSON 데이터를 받아 가이드 콘텐츠를 렌더링
 * 모든 직업/전문화에서 재사용 가능한 컴포넌트
 * 
 * 생성일: 2025-11-28
 */

import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// 기본 스타일 정의
// ============================================

const getWowheadIcon = (icon, size = 'medium') => {
  const sizeMap = { small: 'small', medium: 'medium', large: 'large' };
  return `https://wow.zamimg.com/images/wow/icons/${sizeMap[size] || 'medium'}/${icon}.jpg`;
};

// ============================================
// 스킬 아이콘 컴포넌트
// ============================================

const SkillIconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  position: relative;
`;

const IconImg = styled.img`
  width: ${props => props.size === 'small' ? '20px' : props.size === 'large' ? '40px' : '28px'};
  height: ${props => props.size === 'small' ? '20px' : props.size === 'large' ? '40px' : '28px'};
  border-radius: 4px;
  border: 2px solid ${props => props.borderColor || props.theme?.colors?.primary || '#A330C9'};
  vertical-align: middle;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 12px ${props => props.borderColor || props.theme?.colors?.primary || '#A330C9'}80;
  }
`;

const SkillNameText = styled.span`
  color: ${props => props.color || props.theme?.colors?.primary || '#A330C9'};
  font-weight: 600;
  border-bottom: 1px dotted ${props => props.color || props.theme?.colors?.primary || '#A330C9'};
  
  &:hover {
    text-shadow: 0 0 8px ${props => props.color || props.theme?.colors?.primary || '#A330C9'}80;
  }
`;

const TooltipContainer = styled.div`
  position: fixed;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(15, 15, 25, 0.98) 100%);
  border: 2px solid ${props => props.borderColor || '#A330C9'};
  border-radius: 12px;
  padding: 16px;
  z-index: 10000;
  width: 320px;
  pointer-events: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9), 0 0 20px ${props => props.borderColor || '#A330C9'}40;
`;

const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${props => props.borderColor || '#A330C9'}40;
`;

const TooltipTitle = styled.h4`
  margin: 0;
  color: ${props => props.color || '#A330C9'};
  font-size: 1.1rem;
`;

const TooltipDesc = styled.p`
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
`;

const TooltipMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 0.85rem;
`;

const MetaItem = styled.span`
  color: ${props => props.color || '#a0a0a0'};
`;

/**
 * SkillIcon - 스킬 아이콘 + 이름 + 호버 툴팁
 */
export const SkillIcon = ({ 
  icon, 
  name, 
  nameEn,
  description, 
  cooldown,
  cost,
  showName = true, 
  size = 'medium',
  color
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  const calculatePosition = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    let top = rect.top - 200;
    let left = rect.left + rect.width / 2 - 160;
    
    if (top < 10) top = rect.bottom + 10;
    if (left < 10) left = 10;
    if (left + 320 > window.innerWidth - 10) {
      left = window.innerWidth - 330;
    }
    setTooltipPos({ top, left });
  };

  const getPortal = () => {
    let portal = document.getElementById('skill-tooltip-portal');
    if (!portal) {
      portal = document.createElement('div');
      portal.id = 'skill-tooltip-portal';
      document.body.appendChild(portal);
    }
    return portal;
  };

  return (
    <>
      <SkillIconWrapper
        ref={ref}
        onMouseEnter={() => { calculatePosition(); setShowTooltip(true); }}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <IconImg 
          src={getWowheadIcon(icon, size)} 
          alt={name}
          size={size}
          borderColor={color}
          onError={(e) => {
            e.target.src = getWowheadIcon('inv_misc_questionmark', size);
          }}
        />
        {showName && <SkillNameText color={color}>{name}</SkillNameText>}
      </SkillIconWrapper>
      
      {showTooltip && description && ReactDOM.createPortal(
        <TooltipContainer style={{ top: tooltipPos.top, left: tooltipPos.left }} borderColor={color}>
          <TooltipHeader borderColor={color}>
            <IconImg 
              src={getWowheadIcon(icon, 'large')} 
              size="large"
              borderColor={color}
            />
            <div>
              <TooltipTitle color={color}>{name}</TooltipTitle>
              {nameEn && <div style={{ color: '#888', fontSize: '0.85rem' }}>{nameEn}</div>}
            </div>
          </TooltipHeader>
          <TooltipDesc>{description}</TooltipDesc>
          {(cooldown || cost) && (
            <TooltipMeta>
              {cooldown && <MetaItem color="#ffa500">⏱️ {cooldown}</MetaItem>}
              {cost && <MetaItem color="#ef5350">💰 {cost}</MetaItem>}
            </TooltipMeta>
          )}
        </TooltipContainer>,
        getPortal()
      )}
    </>
  );
};

// ============================================
// 오프너 타임라인 컴포넌트
// ============================================

const TimelineWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow-x: auto;
`;

const TimelineStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const TimelineIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid ${props => props.highlight ? '#ff6b6b' : props.theme?.colors?.primary || '#A330C9'};
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.highlight && `
    box-shadow: 0 0 12px rgba(255, 107, 107, 0.5);
  `}

  &:hover {
    transform: scale(1.15);
  }
`;

const TimelineTiming = styled.span`
  font-size: 0.7rem;
  color: ${props => props.highlight ? '#ff6b6b' : '#888'};
  font-weight: ${props => props.highlight ? '600' : '400'};
`;

const TimelineArrow = styled.span`
  color: ${props => props.theme?.colors?.accent || '#00FF96'};
  font-size: 1.2rem;
  font-weight: bold;
`;

const TimelineNote = styled.span`
  font-size: 0.75rem;
  color: #a0a0a0;
  max-width: 60px;
  text-align: center;
`;

/**
 * OpenerTimeline - 오프너 시퀀스 타임라인
 */
export const OpenerTimeline = ({ steps, classColor }) => {
  return (
    <TimelineWrapper>
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <TimelineStep>
            {step.timing && (
              <TimelineTiming highlight={step.timing.includes('풀') || step.timing.includes('윈도우')}>
                {step.timing}
              </TimelineTiming>
            )}
            <TimelineIcon
              src={getWowheadIcon(step.icon || 'inv_misc_questionmark')}
              alt={step.skillName}
              title={step.skillName}
              highlight={step.highlight}
              onError={(e) => {
                e.target.src = getWowheadIcon('inv_misc_questionmark');
              }}
            />
            {step.note && <TimelineNote>{step.note}</TimelineNote>}
          </TimelineStep>
          {idx < steps.length - 1 && <TimelineArrow>→</TimelineArrow>}
        </React.Fragment>
      ))}
    </TimelineWrapper>
  );
};

// ============================================
// 우선순위 테이블 컴포넌트
// ============================================

const PriorityTableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const TableHead = styled.thead`
  background: ${props => props.bgColor || 'rgba(163, 48, 201, 0.2)'};
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  color: ${props => props.color || '#A330C9'};
  font-weight: 600;
  border-bottom: 2px solid ${props => props.color || '#A330C9'};
`;

const TableRow = styled.tr`
  background: ${props => props.idx % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'};
  transition: background 0.2s;
  
  &:hover {
    background: rgba(163, 48, 201, 0.1);
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  vertical-align: middle;
`;

const PriorityNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: ${props => props.color || '#A330C9'};
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.85rem;
`;

const ConditionBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: rgba(255, 152, 0, 0.2);
  border: 1px solid rgba(255, 152, 0, 0.5);
  border-radius: 4px;
  font-size: 0.8rem;
  color: #ffa500;
`;

/**
 * PriorityTable - 우선순위 테이블
 */
export const PriorityTable = ({ priorities, classColor, showCondition = true, showReason = true }) => {
  return (
    <PriorityTableWrapper>
      <StyledTable>
        <TableHead bgColor={`${classColor}20`}>
          <tr>
            <TableHeaderCell color={classColor} style={{ width: '50px' }}>#</TableHeaderCell>
            <TableHeaderCell color={classColor}>스킬</TableHeaderCell>
            {showCondition && <TableHeaderCell color={classColor}>조건</TableHeaderCell>}
            {showReason && <TableHeaderCell color={classColor}>이유</TableHeaderCell>}
          </tr>
        </TableHead>
        <tbody>
          {priorities.map((item, idx) => (
            <TableRow key={idx} idx={idx}>
              <TableCell>
                <PriorityNumber color={classColor}>{item.priority || idx + 1}</PriorityNumber>
              </TableCell>
              <TableCell>
                <SkillIcon 
                  icon={item.icon || 'inv_misc_questionmark'}
                  name={item.skillName}
                  description={item.description}
                  cooldown={item.cooldown}
                  size="small"
                  color={classColor}
                />
              </TableCell>
              {showCondition && (
                <TableCell>
                  {item.condition && item.condition !== '-' ? (
                    <ConditionBadge>{item.condition}</ConditionBadge>
                  ) : '-'}
                </TableCell>
              )}
              {showReason && (
                <TableCell style={{ color: '#a0a0a0' }}>{item.reason || '-'}</TableCell>
              )}
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </PriorityTableWrapper>
  );
};

// ============================================
// 메커니즘 카드 그리드
// ============================================

const MechanicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const MechanicCard = styled.div`
  background: ${props => props.bgColor || 'rgba(0, 0, 0, 0.3)'};
  border: 1px solid ${props => props.borderColor || 'rgba(163, 48, 201, 0.3)'};
  border-left: 4px solid ${props => props.accentColor || '#A330C9'};
  border-radius: 8px;
  padding: 1rem;
`;

const MechanicHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const MechanicTitle = styled.h4`
  margin: 0;
  color: ${props => props.color || '#A330C9'};
  font-size: 1rem;
`;

const MechanicDesc = styled.p`
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 12px 0;
`;

const TipsList = styled.ul`
  margin: 0;
  padding-left: 1.2rem;
  
  li {
    color: #a0a0a0;
    font-size: 0.85rem;
    line-height: 1.5;
    margin-bottom: 4px;
    
    &::marker {
      color: ${props => props.markerColor || '#A330C9'};
    }
  }
`;

/**
 * MechanicsSection - 핵심 메커니즘 카드 그리드
 */
export const MechanicsSection = ({ mechanics, classColor }) => {
  return (
    <MechanicsGrid>
      {mechanics.map((mech, idx) => (
        <MechanicCard 
          key={idx}
          borderColor={`${classColor}40`}
          accentColor={classColor}
        >
          <MechanicHeader>
            <IconImg 
              src={getWowheadIcon(mech.icon || 'inv_misc_questionmark')}
              size="medium"
              borderColor={classColor}
            />
            <MechanicTitle color={classColor}>{mech.name}</MechanicTitle>
          </MechanicHeader>
          <MechanicDesc>{mech.description}</MechanicDesc>
          {mech.tips && mech.tips.length > 0 && (
            <TipsList markerColor={classColor}>
              {mech.tips.map((tip, tipIdx) => (
                <li key={tipIdx}>{tip}</li>
              ))}
            </TipsList>
          )}
        </MechanicCard>
      ))}
    </MechanicsGrid>
  );
};

// ============================================
// 영웅 특성 탭 컴포넌트
// ============================================

const TabContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => props.active 
    ? `linear-gradient(135deg, ${props.activeColor}30, ${props.activeColor}20)`
    : 'rgba(0, 0, 0, 0.3)'};
  border: 2px solid ${props => props.active ? props.activeColor : 'rgba(255,255,255,0.1)'};
  border-radius: 8px;
  color: ${props => props.active ? props.activeColor : '#a0a0a0'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => `${props.activeColor}20`};
    border-color: ${props => props.activeColor};
    color: ${props => props.activeColor};
  }
`;

const TabContent = styled(motion.div)`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
`;

/**
 * HeroTalentTabs - 영웅 특성 탭 컴포넌트
 */
export const HeroTalentTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  children,
  classColor = '#A330C9'
}) => {
  return (
    <TabContainer>
      <TabButtons>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            activeColor={tab.color || classColor}
            onClick={() => onTabChange(tab.id)}
          >
            <IconImg 
              src={getWowheadIcon(tab.icon)}
              size="small"
              borderColor={tab.color || classColor}
            />
            {tab.name}
            {tab.recommended && <span style={{ fontSize: '0.7rem' }}>⭐</span>}
          </TabButton>
        ))}
      </TabButtons>
      <AnimatePresence mode="wait">
        <TabContent
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </TabContent>
      </AnimatePresence>
    </TabContainer>
  );
};

// ============================================
// 콤보 시퀀스 컴포넌트
// ============================================

const ComboWrapper = styled.div`
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(163, 48, 201, 0.1));
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
`;

const ComboTitle = styled.h4`
  color: #ff6b6b;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ComboSteps = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const ComboStep = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.1);
`;

const ComboStepNumber = styled.span`
  color: #ff6b6b;
  font-weight: bold;
  font-size: 0.85rem;
`;

/**
 * ComboSequence - 콤보 시퀀스 표시
 */
export const ComboSequence = ({ title, steps, requirements, classColor }) => {
  return (
    <ComboWrapper>
      <ComboTitle>💥 {title}</ComboTitle>
      <ComboSteps>
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <ComboStep>
              <ComboStepNumber>{step.step || idx + 1}</ComboStepNumber>
              <IconImg
                src={getWowheadIcon(step.icon || 'inv_misc_questionmark')}
                size="small"
                borderColor={classColor}
              />
              <span style={{ color: '#e0e0e0', fontSize: '0.85rem' }}>{step.skillName}</span>
              {step.note && <span style={{ color: '#888', fontSize: '0.75rem' }}>({step.note})</span>}
            </ComboStep>
            {idx < steps.length - 1 && <TimelineArrow>→</TimelineArrow>}
          </React.Fragment>
        ))}
      </ComboSteps>
      {requirements && requirements.length > 0 && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: '#ffa500', fontSize: '0.85rem', marginBottom: '8px' }}>⚠️ 사전 요구사항:</div>
          <TipsList markerColor="#ffa500">
            {requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </TipsList>
        </div>
      )}
    </ComboWrapper>
  );
};

// ============================================
// 팁 섹션 컴포넌트
// ============================================

const TipsGrid = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const TipCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: ${props => props.type === 'warning' 
    ? 'rgba(255, 152, 0, 0.1)' 
    : props.type === 'danger'
    ? 'rgba(244, 67, 54, 0.1)'
    : 'rgba(163, 48, 201, 0.1)'};
  border-left: 3px solid ${props => 
    props.type === 'warning' ? '#ff9800' 
    : props.type === 'danger' ? '#f44336' 
    : props.color || '#A330C9'};
  border-radius: 0 8px 8px 0;
`;

const TipIcon = styled.span`
  font-size: 1.2rem;
`;

const TipText = styled.span`
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

/**
 * TipsSection - 팁 리스트
 */
export const TipsSection = ({ tips, classColor }) => {
  const getIcon = (tip) => {
    if (tip.toLowerCase().includes('금지') || tip.toLowerCase().includes('절대')) return '🚫';
    if (tip.toLowerCase().includes('주의') || tip.toLowerCase().includes('경고')) return '⚠️';
    if (tip.toLowerCase().includes('핵심') || tip.toLowerCase().includes('중요')) return '⭐';
    return '💡';
  };

  const getType = (tip) => {
    if (tip.toLowerCase().includes('금지') || tip.toLowerCase().includes('절대')) return 'danger';
    if (tip.toLowerCase().includes('주의') || tip.toLowerCase().includes('경고')) return 'warning';
    return 'default';
  };

  return (
    <TipsGrid>
      {tips.map((tip, idx) => (
        <TipCard key={idx} type={getType(tip)} color={classColor}>
          <TipIcon>{getIcon(tip)}</TipIcon>
          <TipText>{tip}</TipText>
        </TipCard>
      ))}
    </TipsGrid>
  );
};

// ============================================
// FAQ 아코디언 컴포넌트
// ============================================

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FAQItem = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const FAQQuestion = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: transparent;
  border: none;
  color: ${props => props.color || '#A330C9'};
  font-weight: 600;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(163, 48, 201, 0.1);
  }
`;

const FAQArrow = styled.span`
  transform: rotate(${props => props.open ? '180deg' : '0deg'});
  transition: transform 0.3s;
`;

const FAQAnswer = styled(motion.div)`
  padding: 0 16px 16px;
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.7;
`;

/**
 * FAQAccordion - FAQ 아코디언
 */
export const FAQAccordion = ({ items, classColor }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <FAQList>
      {items.map((item, idx) => (
        <FAQItem key={idx}>
          <FAQQuestion 
            color={classColor}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <span>Q: {item.question}</span>
            <FAQArrow open={openIndex === idx}>▼</FAQArrow>
          </FAQQuestion>
          <AnimatePresence>
            {openIndex === idx && (
              <FAQAnswer
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <strong style={{ color: classColor }}>A:</strong> {item.answer}
              </FAQAnswer>
            )}
          </AnimatePresence>
        </FAQItem>
      ))}
    </FAQList>
  );
};

// ============================================
// 쿨다운 테이블 컴포넌트
// ============================================

const CooldownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const CooldownCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
`;

const CooldownInfo = styled.div`
  flex: 1;
`;

const CooldownName = styled.div`
  color: ${props => props.color || '#A330C9'};
  font-weight: 600;
  font-size: 0.9rem;
`;

const CooldownTime = styled.div`
  color: #ffa500;
  font-size: 0.85rem;
`;

const CooldownSync = styled.div`
  color: #a0a0a0;
  font-size: 0.8rem;
`;

/**
 * CooldownTable - 쿨다운 관리 테이블
 */
export const CooldownTable = ({ cooldowns, classColor }) => {
  return (
    <CooldownGrid>
      {cooldowns.map((cd, idx) => (
        <CooldownCard key={idx}>
          <IconImg
            src={getWowheadIcon(cd.icon || 'inv_misc_questionmark')}
            size="medium"
            borderColor={classColor}
          />
          <CooldownInfo>
            <CooldownName color={classColor}>{cd.skillName}</CooldownName>
            <CooldownTime>⏱️ {cd.cooldown}</CooldownTime>
            {cd.sync && <CooldownSync>{cd.sync}</CooldownSync>}
          </CooldownInfo>
        </CooldownCard>
      ))}
    </CooldownGrid>
  );
};

// ============================================
// 개요 카드 컴포넌트
// ============================================

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OverviewCard = styled.div`
  padding: 1rem;
  background: ${props => props.type === 'strength' 
    ? 'rgba(76, 175, 80, 0.1)' 
    : 'rgba(244, 67, 54, 0.1)'};
  border-left: 3px solid ${props => props.type === 'strength' ? '#4caf50' : '#f44336'};
  border-radius: 0 8px 8px 0;
`;

const OverviewTitle = styled.h4`
  color: ${props => props.type === 'strength' ? '#4caf50' : '#f44336'};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

/**
 * StrengthWeaknessGrid - 강점/약점 그리드
 */
export const StrengthWeaknessGrid = ({ strengths, weaknesses }) => {
  return (
    <OverviewGrid>
      <OverviewCard type="strength">
        <OverviewTitle type="strength">💪 강점</OverviewTitle>
        <TipsList markerColor="#4caf50">
          {strengths.map((s, idx) => <li key={idx}>{s}</li>)}
        </TipsList>
      </OverviewCard>
      <OverviewCard type="weakness">
        <OverviewTitle type="weakness">⚠️ 약점</OverviewTitle>
        <TipsList markerColor="#f44336">
          {weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
        </TipsList>
      </OverviewCard>
    </OverviewGrid>
  );
};

// ============================================
// 티어 세트 카드
// ============================================

const TierSetWrapper = styled.div`
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
`;

const TierSetTitle = styled.h4`
  color: #ffd700;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TierSetBonus = styled.div`
  margin-bottom: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
`;

const BonusLabel = styled.span`
  color: #ffd700;
  font-weight: 600;
  margin-right: 8px;
`;

/**
 * TierSetCard - 티어 세트 정보 카드
 */
export const TierSetCard = ({ season, twoSet, fourSet }) => {
  return (
    <TierSetWrapper>
      <TierSetTitle>👑 시즌 {season} 티어 세트</TierSetTitle>
      <TierSetBonus>
        <BonusLabel>2세트:</BonusLabel>
        <span style={{ color: '#e0e0e0' }}>{twoSet}</span>
      </TierSetBonus>
      <TierSetBonus>
        <BonusLabel>4세트:</BonusLabel>
        <span style={{ color: '#e0e0e0' }}>{fourSet}</span>
      </TierSetBonus>
    </TierSetWrapper>
  );
};

// ============================================
// InfoBox / WarningBox 컴포넌트
// ============================================

export const InfoBox = styled.div`
  background: ${props => `${props.color || '#A330C9'}15`};
  border-left: 4px solid ${props => props.color || '#A330C9'};
  padding: 1rem;
  border-radius: 0 8px 8px 0;
  margin: 1rem 0;
`;

export const WarningBox = styled.div`
  background: rgba(255, 152, 0, 0.15);
  border-left: 4px solid #ff9800;
  padding: 1rem;
  border-radius: 0 8px 8px 0;
  margin: 1rem 0;
  
  strong {
    color: #ff9800;
  }
`;

export const DangerBox = styled.div`
  background: rgba(244, 67, 54, 0.15);
  border-left: 4px solid #f44336;
  padding: 1rem;
  border-radius: 0 8px 8px 0;
  margin: 1rem 0;
  
  strong {
    color: #f44336;
  }
`;

// ============================================
// 섹션 컴포넌트
// ============================================

export const Section = styled.section`
  margin-bottom: 2rem;
  scroll-margin-top: 20px;
`;

export const SectionTitle = styled.h2`
  color: ${props => props.color || props.theme?.colors?.primary || '#A330C9'};
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${props => props.color || props.theme?.colors?.primary || '#A330C9'};
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SubSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const SubTitle = styled.h3`
  color: ${props => props.color || '#00FF96'};
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
`;

// ============================================
// Export 모든 컴포넌트
// ============================================

export default {
  SkillIcon,
  OpenerTimeline,
  PriorityTable,
  MechanicsSection,
  HeroTalentTabs,
  ComboSequence,
  TipsSection,
  FAQAccordion,
  CooldownTable,
  StrengthWeaknessGrid,
  TierSetCard,
  InfoBox,
  WarningBox,
  DangerBox,
  Section,
  SectionTitle,
  SubSection,
  SubTitle
};
