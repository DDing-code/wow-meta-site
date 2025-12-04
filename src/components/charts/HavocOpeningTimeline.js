/**
 * HavocOpeningTimeline.js
 *
 * 파멸 악마사냥꾼 오프닝 타임라인 (11.2.5)
 * - 영웅 특성별 오프닝 시퀀스 시각화
 * - Aldrachi Reaver (알드라치 파괴자) / Fel-Scarred (지옥상흔) 지원
 * - 디스코드 스타일 컴팩트 레이아웃
 * - 스크롤 없이 flex-wrap으로 2줄 자동 줄바꿈
 * - 아이콘만 표시 + 호버 툴팁
 */

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  thehunt,
  essencebreak,
  sigilofflame,
  reaversglaive,
  immolationaura,
  eyebeam,
  annihilation,
  deathsweep,
  vengefulretreat,
  bladedance
} from '../../data/havocDemonHunterSkillData';

// ============================================================
// Keyframe Animations
// ============================================================

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 6px rgba(163, 48, 201, 0.3);
  }
  50% {
    box-shadow: 0 0 14px rgba(163, 48, 201, 0.6);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// ============================================================
// Styled Components - Compact Discord Style
// ============================================================

const TimelineContainer = styled.div`
  background: linear-gradient(135deg, #15151f 0%, #1a1a2e 100%);
  border: 1px solid #A330C9;
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  animation: ${fadeIn} 0.4s ease-out;
`;

const TimelineTitle = styled.h4`
  text-align: center;
  color: #A330C9;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.5px;
`;

const HeroTalentBadge = styled.span`
  display: inline-block;
  background: ${props => props.type === 'aldrachi' ? '#00FF96' : '#FF6B6B'};
  color: #0d0d14;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 6px;
  vertical-align: middle;
`;

const PhaseLabel = styled.div`
  color: ${props => props.type === 'precast' ? '#FF6B6B' : '#00FF96'};
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
`;

const TimelineWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 0.5rem 0;
`;

const SkillIcon = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid ${props => props.isPrecast ? '#FF6B6B' : '#A330C9'};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.2);
    border-color: #00FF96;
    animation: ${pulseGlow} 1s infinite;
    z-index: 100;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Arrow = styled.span`
  color: #A330C9;
  font-size: 0.9rem;
  opacity: 0.7;
  flex-shrink: 0;
`;

const PullSeparator = styled.div`
  background: #FF6B6B;
  color: #0d0d14;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: bold;
  margin: 0 4px;
  flex-shrink: 0;
`;

const TooltipContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(21, 21, 31, 0.98);
  border: 1px solid #A330C9;
  border-radius: 6px;
  padding: 8px 10px;
  min-width: 200px;
  max-width: 260px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
  pointer-events: none;
  margin-bottom: 6px;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #A330C9;
  }
`;

const TooltipTitle = styled.div`
  font-weight: bold;
  color: #A330C9;
  font-size: 0.85rem;
  margin-bottom: 4px;
`;

const TooltipDesc = styled.div`
  color: #e0e0e0;
  font-size: 0.7rem;
  line-height: 1.3;
`;

// ============================================================
// Skill Tooltip Component
// ============================================================

const SkillTooltipBox = ({ skill }) => {
  if (!skill) return null;

  return (
    <TooltipContainer>
      <TooltipTitle>{skill.koreanName}</TooltipTitle>
      <TooltipDesc>
        {skill.cooldown && skill.cooldown !== '해당 없음' && (
          <div>쿨타임: {skill.cooldown}</div>
        )}
        {skill.resourceCost && skill.resourceCost !== '없음' && (
          <div>소모: {skill.resourceCost}</div>
        )}
      </TooltipDesc>
    </TooltipContainer>
  );
};

// ============================================================
// Main Component
// ============================================================

const HavocOpeningTimeline = ({ heroTalent = 'aldrachi' }) => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // 지옥상흔 (Fel-Scarred) 오프닝 - 디스코드 기준
  const felScarredOpening = {
    precast: [
      { skill: immolationaura, key: 'fs-pre-1' },
      { skill: sigilofflame, key: 'fs-pre-2' },
      { skill: vengefulretreat, key: 'fs-pre-3' }
    ],
    main: [
      { skill: thehunt, key: 'fs-1' },
      { skill: eyebeam, key: 'fs-2' },
      { skill: bladedance, key: 'fs-3' },
      { skill: sigilofflame, key: 'fs-4' },
      { skill: annihilation, key: 'fs-5' },
      { skill: annihilation, key: 'fs-6' },
      { skill: bladedance, key: 'fs-7' },
      { skill: annihilation, key: 'fs-8' },
      { skill: bladedance, key: 'fs-9' },
      { skill: annihilation, key: 'fs-10' },
      { skill: sigilofflame, key: 'fs-11' }
    ]
  };

  // 알드라치 파괴자 (Aldrachi Reaver) 오프닝 - 디스코드 기준
  const aldrachiOpening = {
    precast: [
      { skill: immolationaura, key: 'ar-pre-1' },
      { skill: sigilofflame, key: 'ar-pre-2' },
      { skill: vengefulretreat, key: 'ar-pre-3' },
      { skill: essencebreak, key: 'ar-pre-4' }
    ],
    main: [
      { skill: thehunt, key: 'ar-1' },
      { skill: eyebeam, key: 'ar-2' },
      { skill: annihilation, key: 'ar-3' },
      { skill: deathsweep, key: 'ar-4' },
      { skill: bladedance, key: 'ar-5' },
      { skill: vengefulretreat, key: 'ar-6' },
      { skill: reaversglaive, key: 'ar-7' },
      { skill: deathsweep, key: 'ar-8' },
      { skill: annihilation, key: 'ar-9' },
      { skill: annihilation, key: 'ar-10' },
      { skill: eyebeam, key: 'ar-11' }
    ]
  };

  const opening = heroTalent === 'aldrachi' ? aldrachiOpening : felScarredOpening;
  const title = heroTalent === 'aldrachi' ? '알드라치 파괴자' : '지옥상흔';

  return (
    <TimelineContainer>
      <TimelineTitle>
        오프닝 시퀀스
        <HeroTalentBadge type={heroTalent}>{title}</HeroTalentBadge>
      </TimelineTitle>

      {/* Precast Phase */}
      <PhaseLabel type="precast">프리캐스트</PhaseLabel>
      <TimelineWrapper>
        {opening.precast.map((item, index) => (
          <React.Fragment key={item.key}>
            <SkillIcon
              isPrecast={true}
              onMouseEnter={() => setHoveredSkill(item.key)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <img
                src={`https://wow.zamimg.com/images/wow/icons/large/${item.skill.icon}.jpg`}
                alt={item.skill.koreanName}
                onError={(e) => {
                  e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                }}
              />
              {hoveredSkill === item.key && (
                <SkillTooltipBox skill={item.skill} />
              )}
            </SkillIcon>
            {index < opening.precast.length - 1 && <Arrow>→</Arrow>}
          </React.Fragment>
        ))}

        <PullSeparator>PULL</PullSeparator>

        {/* Main Rotation - continues on same/next line */}
        {opening.main.map((item, index) => (
          <React.Fragment key={item.key}>
            <SkillIcon
              isPrecast={false}
              onMouseEnter={() => setHoveredSkill(item.key)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <img
                src={`https://wow.zamimg.com/images/wow/icons/large/${item.skill.icon}.jpg`}
                alt={item.skill.koreanName}
                onError={(e) => {
                  e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                }}
              />
              {hoveredSkill === item.key && (
                <SkillTooltipBox skill={item.skill} />
              )}
            </SkillIcon>
            {index < opening.main.length - 1 && <Arrow>→</Arrow>}
          </React.Fragment>
        ))}
      </TimelineWrapper>
    </TimelineContainer>
  );
};

export default HavocOpeningTimeline;
