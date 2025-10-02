import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// 전역 스타일 - 애니메이션 정의
const GlobalStyle = createGlobalStyle`
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.6;
    }
  }

  @keyframes skillHover {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  .skill-node {
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      filter: brightness(1.2);
    }
  }
`;

// 스킬 데이터베이스 import
let skillDatabase = {};
try {
  // 여러 경로 시도
  try {
    skillDatabase = require('../database-builder/tww-s3-final-ultimate-database.json');
  } catch (e1) {
    try {
      skillDatabase = require('../database-builder/all-classes-skills-data.json');
    } catch (e2) {
      console.warn('스킬 데이터베이스 로드 실패');
    }
  }
} catch (e) {
  console.warn('스킬 데이터베이스 로드 실패');
}

// Hunter 스킬 매핑 (정확한 데이터)
const HUNTER_SKILLS = {
  KILL_COMMAND: {
    id: '259489',
    koreanName: '살상 명령',
    englishName: 'Kill Command',
    icon: 'ability_hunter_killcommand',
    cooldown: '7.5초',
    resourceCost: '집중 30'
  },
  BARBED_SHOT: {
    id: '217200',
    koreanName: '날카로운 사격',
    englishName: 'Barbed Shot',
    icon: 'ability_hunter_barbedshot',
    cooldown: '12초 충전',
    resourceCost: '집중 생성'
  },
  COBRA_SHOT: {
    id: '193455',
    koreanName: '코브라 사격',
    englishName: 'Cobra Shot',
    icon: 'ability_hunter_cobrashot',
    cooldown: '없음',
    resourceCost: '집중 35'
  },
  BESTIAL_WRATH: {
    id: '19574',
    koreanName: '야수의 격노',
    englishName: 'Bestial Wrath',
    icon: 'ability_druid_ferociousbite',
    cooldown: '1.5분',
    resourceCost: '없음'
  },
  BLOODSHED: {
    id: '321530',
    koreanName: '피흘리기',
    englishName: 'Bloodshed',
    icon: 'ability_druid_primaltenacity',
    cooldown: '1분',
    resourceCost: '없음'
  },
  CALL_OF_THE_WILD: {
    id: '359844',
    koreanName: '야생의 부름',
    englishName: 'Call of the Wild',
    icon: 'ability_hunter_callofthewild',
    cooldown: '3분',
    resourceCost: '없음'
  },
  KILL_SHOT: {
    id: '320976',
    koreanName: '마무리 사격',
    englishName: 'Kill Shot',
    icon: 'ability_hunter_assassinate2',
    cooldown: '20초',
    resourceCost: '집중 10',
    description: '적의 생명력이 20% 미만일 때 사용 가능. 즉시 발사'
  },
  HUNTERS_MARK: {
    id: '257284',
    koreanName: '사냥꾼의 징표',
    englishName: "Hunter's Mark",
    icon: 'ability_hunter_markedfordeath',
    cooldown: '없음',
    resourceCost: '없음'
  },
  DIRE_BEAST: {
    id: '120679',
    koreanName: '광포한 야수',
    englishName: 'Dire Beast',
    icon: 'ability_hunter_longevity',
    cooldown: '20초',
    resourceCost: '없음'
  },
  ASPECT_OF_THE_WILD: {
    id: '193530',
    koreanName: '야생의 상',
    englishName: 'Aspect of the Wild',
    icon: 'spell_nature_protectionformnature',
    cooldown: '2분',
    resourceCost: '없음'
  }
};

// 스타일 컴포넌트
const FlowchartContainer = styled.div`
  background:
    radial-gradient(ellipse at top left, rgba(244, 196, 48, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(201, 169, 53, 0.05) 0%, transparent 50%),
    linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-image: linear-gradient(135deg, #f4c430 0%, #c9a935 50%, #f4c430 100%) 1;
  border-radius: 20px;
  padding: 40px;
  margin: 30px 0;
  position: relative;
  box-shadow:
    0 0 80px rgba(244, 196, 48, 0.15),
    0 15px 60px rgba(0, 0, 0, 0.9),
    inset 0 1px 0 rgba(244, 196, 48, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.5);

  &:before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(135deg, #f4c430, transparent, #c9a935, transparent, #f4c430);
    border-radius: 20px;
    opacity: 0.4;
    z-index: -1;
    animation: glow 4s ease-in-out infinite;
  }

  @keyframes glow {
    0%, 100% { opacity: 0.3; transform: rotate(0deg); }
    50% { opacity: 0.6; transform: rotate(1deg); }
  }
`;

const FlowchartTitle = styled.h3`
  font-family: 'Noto Sans KR', system-ui, sans-serif;
  background: linear-gradient(135deg, #f4c430 0%, #ffd700 50%, #c9a935 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 35px;
  font-size: 2rem;
  text-align: center;
  font-weight: 800;
  text-shadow:
    0 4px 20px rgba(244, 196, 48, 0.5),
    0 0 40px rgba(244, 196, 48, 0.3);
  letter-spacing: 2px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #f4c430, transparent);
    opacity: 0.5;
  }
`;

const SVGContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px;
  overflow: visible;
  background:
    radial-gradient(ellipse at center, rgba(244, 196, 48, 0.03) 0%, transparent 60%),
    radial-gradient(circle at 30% 40%, rgba(244, 196, 48, 0.02) 0%, transparent 40%),
    radial-gradient(circle at 70% 60%, rgba(201, 169, 53, 0.02) 0%, transparent 40%);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, transparent 0%, rgba(244, 196, 48, 0.01) 50%, transparent 100%);
    animation: pulse 6s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
  }
`;

// 향상된 툴팁
const SkillTooltip = styled.div`
  position: fixed;
  z-index: 10000;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
  border: 2px solid #f4c430;
  border-radius: 12px;
  width: 360px;
  box-shadow:
    0 0 40px rgba(244, 196, 48, 0.3),
    0 15px 50px rgba(0, 0, 0, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: ${props => props.visible ? 'block' : 'none'};
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  pointer-events: none;
  animation: tooltipFadeIn 0.3s ease-out;

  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TooltipHeader = styled.div`
  background: linear-gradient(135deg, #2c1810 0%, #1a0e08 100%);
  padding: 14px 16px;
  border-bottom: 2px solid rgba(244, 196, 48, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 10px 10px 0 0;
`;

const TooltipIcon = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 6px;
  border: 2px solid #f4c430;
  box-shadow: 0 0 10px rgba(244, 196, 48, 0.4);
`;

const TooltipTitle = styled.div`
  flex: 1;

  h4 {
    color: #f4c430;
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .english {
    color: #999;
    font-size: 0.85rem;
    margin-top: 2px;
  }
`;

const TooltipBody = styled.div`
  padding: 14px 16px;
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: #888;
    font-weight: 500;
  }

  .value {
    color: #f4c430;
    font-weight: 600;
  }
`;

const TooltipDescription = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #ddd;
  font-size: 0.88rem;
  line-height: 1.5;
`;

const EnhancedRotationFlowchart = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleSkillHover = (skill, event) => {
    if (event && skill) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = Math.min(rect.right + 15, window.innerWidth - 390);
      const y = Math.min(rect.top - 30, window.innerHeight - 300);

      setTooltipPos({ x: Math.max(10, x), y: Math.max(10, y) });
      setHoveredSkill(skill);
    } else {
      setHoveredSkill(null);
    }
  };

  const getSkillFromDB = (skillKey) => {
    const skill = HUNTER_SKILLS[skillKey];
    if (skillDatabase && skillDatabase.HUNTER && skillDatabase.HUNTER[skill.id]) {
      const dbSkill = skillDatabase.HUNTER[skill.id];
      return {
        ...skill,
        description: dbSkill.description || '스킬 설명 없음',
        castTime: dbSkill.castTime || '즉시',
        range: dbSkill.range || '40 야드'
      };
    }
    return skill;
  };

  return (
    <>
      <GlobalStyle />
      <FlowchartContainer>
        <FlowchartTitle>🎯 야수 사냥꾼 딜사이클 최적화 플로우차트</FlowchartTitle>
      <SVGContainer>
        <svg width="900" height="800" viewBox="0 0 900 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* 그라디언트 정의 */}
            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor:'#f4c430', stopOpacity:0.8}} />
              <stop offset="100%" style={{stopColor:'#c9a935', stopOpacity:0.8}} />
            </linearGradient>

            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor:'#2a2a3e', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#1a1a2e', stopOpacity:1}} />
            </linearGradient>

            <linearGradient id="decisionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor:'#3a2a5e', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#2a1a4e', stopOpacity:1}} />
            </linearGradient>

            {/* 발광 효과 필터 */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="iconShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.7"/>
              <feGaussianBlur stdDeviation="1"/>
            </filter>

            <filter id="skillGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* 각 스킬 아이콘을 pattern으로 정의 */}
            {Object.entries(HUNTER_SKILLS).map(([key, skill]) => (
              <pattern key={key} id={`icon-${key}`} x="0%" y="0%" height="100%" width="100%">
                <image
                  href={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
                  x="0" y="0"
                  width="60" height="60"
                />
              </pattern>
            ))}
          </defs>

          {/* 화살표 마커 */}
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#f4c430" />
          </marker>

          {/* 연결선들 - 곡선으로 변경 */}
          <path d="M 450 90 Q 450 115 450 140" stroke="url(#arrowGradient)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" opacity="0.8"/>
          <path d="M 450 200 Q 450 230 300 260" stroke="url(#arrowGradient)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" opacity="0.8"/>
          <path d="M 450 200 Q 450 230 600 260" stroke="url(#arrowGradient)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" opacity="0.8"/>
          <path d="M 300 320 Q 300 350 300 380" stroke="url(#arrowGradient)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" opacity="0.8"/>
          <path d="M 600 320 Q 600 360 450 410" stroke="url(#arrowGradient)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" opacity="0.8"/>
          <path d="M 300 440 Q 375 470 450 470" stroke="url(#arrowGradient)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" opacity="0.8"/>
          <path d="M 450 530 Q 450 565 450 600" stroke="url(#arrowGradient)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" opacity="0.8"/>
          <path d="M 450 660 Q 450 695 450 730" stroke="url(#arrowGradient)" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" opacity="0.8"/>
          <path d="M 450 200 Q 450 115 450 90" stroke="url(#arrowGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.6"/>

          {/* 시작 노드 */}
          <g>
            <circle cx="450" cy="60" r="35" fill="url(#nodeGradient)" stroke="#f4c430" strokeWidth="3" filter="url(#glow)"/>
            <text x="450" y="65" textAnchor="middle" fill="#f4c430" fontSize="16" fontWeight="600">시작</text>
          </g>

          {/* 결정 노드 - 광기 중첩 체크 */}
          <g>
            <rect x="380" y="140" width="140" height="60" rx="10" fill="url(#decisionGradient)" stroke="#f4c430" strokeWidth="2" filter="url(#glow)"/>
            <text x="450" y="165" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="500">광기 중첩</text>
            <text x="450" y="185" textAnchor="middle" fill="#f4c430" fontSize="13">3 미만?</text>
          </g>

          {/* 스킬 노드들 - 아이콘으로 표시 */}
          {/* 날카로운 사격 */}
          <g onMouseEnter={(e) => handleSkillHover(getSkillFromDB('BARBED_SHOT'), e)}
             onMouseLeave={() => handleSkillHover(null)}
             style={{cursor: 'pointer'}}
             className="skill-node">
            {/* 외부 발광 링 */}
            <circle cx="300" cy="290" r="38" fill="none" stroke="#f4c430" strokeWidth="1" opacity="0.3"
              style={{animation: 'pulse 2s ease-in-out infinite'}}/>
            {/* 메인 노드 */}
            <circle cx="300" cy="290" r="35" fill="url(#nodeGradient)" stroke="#f4c430" strokeWidth="3" filter="url(#glow)"/>
            {/* 아이콘 마스크 */}
            <clipPath id="iconClip-BARBED_SHOT">
              <circle cx="300" cy="290" r="28"/>
            </clipPath>
            {/* 아이콘 이미지 */}
            <image
              href={`https://wow.zamimg.com/images/wow/icons/large/${HUNTER_SKILLS.BARBED_SHOT.icon}.jpg`}
              x="272" y="262" width="56" height="56"
              clipPath="url(#iconClip-BARBED_SHOT)"
              filter="url(#iconShadow)"/>
            {/* 내부 보더 */}
            <circle cx="300" cy="290" r="28" fill="none" stroke="#f4c430" strokeWidth="1.5" opacity="0.6"/>
            <text x="300" y="340" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="600">YES</text>
          </g>

          {/* 살상 명령 체크 */}
          <g>
            <rect x="530" y="260" width="140" height="60" rx="10" fill="url(#decisionGradient)" stroke="#f4c430" strokeWidth="2" filter="url(#glow)"/>
            <text x="600" y="285" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="500">살상 명령</text>
            <text x="600" y="305" textAnchor="middle" fill="#f4c430" fontSize="13">쿨타임?</text>
            <text x="600" y="340" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="600">NO</text>
          </g>

          {/* 야수의 격노 + 야생의 부름 (콤보 노드) */}
          <g transform="translate(300, 410)">
            {/* 연결 배경 */}
            <rect x="-60" y="-25" width="120" height="50" rx="25" fill="url(#nodeGradient)"
              stroke="#ffa500" strokeWidth="2" opacity="0.3"/>

            {/* 야수의 격노 */}
            <g onMouseEnter={(e) => handleSkillHover(getSkillFromDB('BESTIAL_WRATH'), e)}
               onMouseLeave={() => handleSkillHover(null)}
               style={{cursor: 'pointer'}}
               className="skill-node">
              <circle cx="-25" cy="0" r="30" fill="url(#nodeGradient)" stroke="#ffa500" strokeWidth="3" filter="url(#glow)"/>
              <clipPath id="iconClip-BESTIAL_WRATH">
                <circle cx="-25" cy="0" r="25"/>
              </clipPath>
              <image
                href={`https://wow.zamimg.com/images/wow/icons/large/${HUNTER_SKILLS.BESTIAL_WRATH.icon}.jpg`}
                x="-50" y="-25" width="50" height="50"
                clipPath="url(#iconClip-BESTIAL_WRATH)"
                filter="url(#iconShadow)"/>
              <circle cx="-25" cy="0" r="25" fill="none" stroke="#ffa500" strokeWidth="1.5" opacity="0.6"/>
            </g>

            {/* 야생의 부름 */}
            <g onMouseEnter={(e) => handleSkillHover(getSkillFromDB('CALL_OF_THE_WILD'), e)}
               onMouseLeave={() => handleSkillHover(null)}
               style={{cursor: 'pointer'}}
               className="skill-node">
              <circle cx="25" cy="0" r="30" fill="url(#nodeGradient)" stroke="#ffa500" strokeWidth="3" filter="url(#glow)"/>
              <clipPath id="iconClip-CALL_OF_THE_WILD">
                <circle cx="25" cy="0" r="25"/>
              </clipPath>
              <image
                href={`https://wow.zamimg.com/images/wow/icons/large/${HUNTER_SKILLS.CALL_OF_THE_WILD.icon}.jpg`}
                x="0" y="-25" width="50" height="50"
                clipPath="url(#iconClip-CALL_OF_THE_WILD)"
                filter="url(#iconShadow)"/>
              <circle cx="25" cy="0" r="25" fill="none" stroke="#ffa500" strokeWidth="1.5" opacity="0.6"/>
            </g>

            {/* + 기호 */}
            <text x="0" y="5" textAnchor="middle" fill="#ffa500" fontSize="20" fontWeight="800" opacity="0.8">+</text>
          </g>

          {/* 살상 명령 */}
          <g onMouseEnter={(e) => handleSkillHover(getSkillFromDB('KILL_COMMAND'), e)}
             onMouseLeave={() => handleSkillHover(null)}
             style={{cursor: 'pointer'}}
             className="skill-node">
            {/* 외부 발광 링 */}
            <circle cx="450" cy="470" r="38" fill="none" stroke="#ff6b6b" strokeWidth="1" opacity="0.3"
              style={{animation: 'pulse 2s ease-in-out infinite'}}/>
            {/* 메인 노드 */}
            <circle cx="450" cy="470" r="35" fill="url(#nodeGradient)" stroke="#ff6b6b" strokeWidth="3" filter="url(#glow)"/>
            {/* 아이콘 마스크 */}
            <clipPath id="iconClip-KILL_COMMAND">
              <circle cx="450" cy="470" r="28"/>
            </clipPath>
            {/* 아이콘 이미지 */}
            <image
              href={`https://wow.zamimg.com/images/wow/icons/large/${HUNTER_SKILLS.KILL_COMMAND.icon}.jpg`}
              x="422" y="442" width="56" height="56"
              clipPath="url(#iconClip-KILL_COMMAND)"
              filter="url(#iconShadow)"/>
            {/* 내부 보더 */}
            <circle cx="450" cy="470" r="28" fill="none" stroke="#ff6b6b" strokeWidth="1.5" opacity="0.6"/>
            {/* 중요도 표시 */}
            <circle cx="470" cy="450" r="8" fill="#ff1744" stroke="#fff" strokeWidth="2"/>
            <text x="470" y="454" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800">!</text>
          </g>

          {/* 마무리 사격 체크 */}
          <g>
            <rect x="380" y="570" width="140" height="60" rx="10" fill="url(#decisionGradient)" stroke="#f4c430" strokeWidth="2" filter="url(#glow)"/>
            <text x="450" y="595" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="500">대상 HP</text>
            <text x="450" y="615" textAnchor="middle" fill="#f4c430" fontSize="13">&lt; 20%?</text>
          </g>

          {/* 마무리 사격 */}
          <g onMouseEnter={(e) => handleSkillHover(getSkillFromDB('KILL_SHOT'), e)}
             onMouseLeave={() => handleSkillHover(null)}
             style={{cursor: 'pointer'}}
             className="skill-node">
            {/* 외부 발광 링 (더 강렬) */}
            <circle cx="350" cy="630" r="40" fill="none" stroke="#ff1744" strokeWidth="2" opacity="0.5"
              style={{animation: 'pulse 1.5s ease-in-out infinite'}}/>
            <circle cx="350" cy="630" r="38" fill="none" stroke="#ff1744" strokeWidth="1" opacity="0.3"
              style={{animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '0.2s'}}/>
            {/* 메인 노드 */}
            <circle cx="350" cy="630" r="35" fill="url(#nodeGradient)" stroke="#ff1744" strokeWidth="3" filter="url(#glow)"/>
            {/* 아이콘 마스크 */}
            <clipPath id="iconClip-KILL_SHOT">
              <circle cx="350" cy="630" r="28"/>
            </clipPath>
            {/* 아이콘 이미지 */}
            <image
              href={`https://wow.zamimg.com/images/wow/icons/large/${HUNTER_SKILLS.KILL_SHOT.icon}.jpg`}
              x="322" y="602" width="56" height="56"
              clipPath="url(#iconClip-KILL_SHOT)"
              filter="url(#iconShadow)"/>
            {/* 내부 보더 */}
            <circle cx="350" cy="630" r="28" fill="none" stroke="#ff1744" strokeWidth="1.5" opacity="0.8"/>
            {/* 처형 표시 */}
            <path d="M 330 610 L 370 650" stroke="#ff1744" strokeWidth="2" opacity="0.4"/>
            <path d="M 370 610 L 330 650" stroke="#ff1744" strokeWidth="2" opacity="0.4"/>
            <text x="280" y="640" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="600">YES</text>
          </g>

          {/* 코브라 사격 */}
          <g onMouseEnter={(e) => handleSkillHover(getSkillFromDB('COBRA_SHOT'), e)}
             onMouseLeave={() => handleSkillHover(null)}
             style={{cursor: 'pointer'}}
             className="skill-node">
            {/* 메인 노드 */}
            <circle cx="450" cy="730" r="35" fill="url(#nodeGradient)" stroke="#22c55e" strokeWidth="3" filter="url(#glow)"/>
            {/* 아이콘 마스크 */}
            <clipPath id="iconClip-COBRA_SHOT">
              <circle cx="450" cy="730" r="28"/>
            </clipPath>
            {/* 아이콘 이미지 */}
            <image
              href={`https://wow.zamimg.com/images/wow/icons/large/${HUNTER_SKILLS.COBRA_SHOT.icon}.jpg`}
              x="422" y="702" width="56" height="56"
              clipPath="url(#iconClip-COBRA_SHOT)"
              filter="url(#iconShadow)"/>
            {/* 내부 보더 */}
            <circle cx="450" cy="730" r="28" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
            {/* 필러 표시 */}
            <text x="450" y="775" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600">FILLER</text>
          </g>

          {/* 범례 */}
          <g transform="translate(700, 50)">
            <defs>
              <linearGradient id="legendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor:'#2a2a3e', stopOpacity:0.9}} />
                <stop offset="100%" style={{stopColor:'#1a1a2e', stopOpacity:0.9}} />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="180" height="250" rx="10" fill="url(#legendGradient)" stroke="#f4c430" strokeWidth="1.5"/>
            <text x="90" y="25" textAnchor="middle" fill="#f4c430" fontSize="15" fontWeight="700">우선순위 등급</text>
            <line x1="20" y1="35" x2="160" y2="35" stroke="#f4c430" strokeWidth="1" opacity="0.3"/>

            <circle cx="30" cy="50" r="8" fill="#ff1744"/>
            <text x="50" y="55" fill="#fff" fontSize="12">긴급 (처형)</text>

            <circle cx="30" cy="80" r="8" fill="#ff6b6b"/>
            <text x="50" y="85" fill="#fff" fontSize="12">핵심 딜링</text>

            <circle cx="30" cy="110" r="8" fill="#ffa500"/>
            <text x="50" y="115" fill="#fff" fontSize="12">버스트 쿨다운</text>

            <circle cx="30" cy="140" r="8" fill="#f4c430"/>
            <text x="50" y="145" fill="#fff" fontSize="12">버프 유지</text>

            <circle cx="30" cy="170" r="8" fill="#22c55e"/>
            <text x="50" y="175" fill="#fff" fontSize="12">필러 스킬</text>

            <circle cx="30" cy="200" r="8" fill="#64748b"/>
            <text x="50" y="205" fill="#fff" fontSize="12">상황별 선택</text>

            {/* 애니메이션 안내 */}
            <text x="90" y="235" textAnchor="middle" fill="#999" fontSize="10" fontStyle="italic">마우스 오버로 상세정보</text>
          </g>
        </svg>
      </SVGContainer>

      {/* 스킬 툴팁 */}
      {hoveredSkill && (
        <SkillTooltip visible={true} x={tooltipPos.x} y={tooltipPos.y}>
          <TooltipHeader>
            <TooltipIcon
              src={`https://wow.zamimg.com/images/wow/icons/large/${hoveredSkill.icon}.jpg`}
              alt={hoveredSkill.koreanName}
            />
            <TooltipTitle>
              <h4>{hoveredSkill.koreanName}</h4>
              <div className="english">{hoveredSkill.englishName}</div>
            </TooltipTitle>
          </TooltipHeader>
          <TooltipBody>
            <TooltipRow>
              <span className="label">재사용 대기시간</span>
              <span className="value">{hoveredSkill.cooldown || '없음'}</span>
            </TooltipRow>
            <TooltipRow>
              <span className="label">소모/생성 자원</span>
              <span className="value">{hoveredSkill.resourceCost || '없음'}</span>
            </TooltipRow>
            <TooltipRow>
              <span className="label">시전 시간</span>
              <span className="value">{hoveredSkill.castTime || '즉시'}</span>
            </TooltipRow>
            <TooltipRow>
              <span className="label">사거리</span>
              <span className="value">{hoveredSkill.range || '40 야드'}</span>
            </TooltipRow>
            {hoveredSkill.description && (
              <TooltipDescription>
                {hoveredSkill.description}
              </TooltipDescription>
            )}
          </TooltipBody>
        </SkillTooltip>
      )}
    </FlowchartContainer>
    </>
  );
};

export default EnhancedRotationFlowchart;