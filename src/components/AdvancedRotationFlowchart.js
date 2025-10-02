import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// 전역 스타일
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

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes dashMove {
    to {
      stroke-dashoffset: -10;
    }
  }

  .skill-node {
    cursor: pointer;
    pointer-events: all;
  }

  .skill-node-scale {
    transition: transform 0.3s ease, filter 0.3s ease;
    transform: scale(1);
    transform-origin: center center;
  }

  .skill-node:hover .skill-node-scale {
    transform: scale(1.15);
    filter: brightness(1.3) drop-shadow(0 0 15px rgba(244, 196, 48, 0.8));
  }

  .skill-node circle:last-child {
    pointer-events: all;
  }

  .skill-node image,
  .skill-node circle:not(:last-child) {
    pointer-events: none;
  }

  .flow-line {
    animation: dashMove 0.5s linear infinite;
  }
`;

// 스킬 데이터베이스
const HUNTER_SKILLS = {
  // 핵심 스킬
  KILL_COMMAND: {
    id: '259489',
    koreanName: '살상 명령',
    englishName: 'Kill Command',
    icon: 'ability_hunter_killcommand',
    cooldown: '7.5초',
    resourceCost: '집중 30',
    description: '펫이 대상을 공격하여 큰 피해를 입힙니다.'
  },
  BARBED_SHOT: {
    id: '217200',
    koreanName: '날카로운 사격',
    englishName: 'Barbed Shot',
    icon: 'ability_hunter_barbedshot',
    cooldown: '12초 충전 (2충전)',
    resourceCost: '집중 생성',
    resourceGain: '집중 20',
    description: '대상을 출혈시키고 펫 공격속도를 증가시킵니다. 광분 효과를 부여합니다.'
  },
  COBRA_SHOT: {
    id: '193455',
    koreanName: '코브라 사격',
    englishName: 'Cobra Shot',
    icon: 'ability_hunter_cobrashot',
    cooldown: '없음',
    resourceCost: '집중 35',
    description: '기본 집중 소비 스킬. 살상 명령의 재사용 대기시간을 1초 감소시킵니다.'
  },
  BESTIAL_WRATH: {
    id: '19574',
    koreanName: '야수의 격노',
    englishName: 'Bestial Wrath',
    icon: 'ability_druid_ferociousbite',
    cooldown: '1.5분',
    resourceCost: '없음',
    description: '15초간 펫의 피해량을 25% 증가시킵니다.'
  },
  BLOODSHED: {
    id: '321530',
    koreanName: '피흘리기',
    englishName: 'Bloodshed',
    icon: 'ability_druid_primaltenacity',
    cooldown: '1분',
    resourceCost: '없음',
    description: '펫이 대상을 공격하여 18초간 지속 피해를 입힙니다.'
  },
  CALL_OF_THE_WILD: {
    id: '359844',
    koreanName: '야생의 부름',
    englishName: 'Call of the Wild',
    icon: 'ability_hunter_callofthewild',
    cooldown: '3분',
    resourceCost: '없음',
    description: '20초간 추가 펫들을 소환하여 함께 싸웁니다.'
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
    resourceCost: '없음',
    description: '대상을 표시하여 받는 피해를 5% 증가시킵니다.'
  },
  DIRE_BEAST: {
    id: '120679',
    koreanName: '광포한 야수',
    englishName: 'Dire Beast',
    icon: 'ability_hunter_longevity',
    cooldown: '20초',
    resourceCost: '없음',
    description: '추가 야수를 소환하여 8초간 공격합니다.'
  },
  ASPECT_OF_THE_WILD: {
    id: '193530',
    koreanName: '야생의 상',
    englishName: 'Aspect of the Wild',
    icon: 'spell_nature_protectionformnature',
    cooldown: '2분',
    resourceCost: '없음',
    description: '20초간 치명타율을 증가시키고 추가 집중을 생성합니다.'
  },
  MULTI_SHOT: {
    id: '2643',
    koreanName: '일제 사격',
    englishName: 'Multi-Shot',
    icon: 'ability_upgrademoonglaive',
    cooldown: '없음',
    resourceCost: '집중 40',
    description: '모든 적에게 피해를 입히고 펫이 야수의 쪼개기를 사용하게 합니다.'
  }
};

// 메인 컨테이너
const FlowchartSystemContainer = styled.div`
  background: linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #f4c430 0%, #c9a935 50%, #f4c430 100%) 1;
  border-radius: 20px;
  padding: 30px;
  margin: 20px 0;
  position: relative;
  box-shadow:
    0 0 80px rgba(244, 196, 48, 0.15),
    0 15px 60px rgba(0, 0, 0, 0.9),
    inset 0 1px 0 rgba(244, 196, 48, 0.3);
`;

// 탭 메뉴
const TabMenu = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  border-bottom: 2px solid rgba(244, 196, 48, 0.2);
  padding-bottom: 10px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.active ?
    'linear-gradient(135deg, rgba(244, 196, 48, 0.3), rgba(244, 196, 48, 0.1))' :
    'rgba(0, 0, 0, 0.3)'};
  border: 1px solid ${props => props.active ? '#f4c430' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.active ? '#f4c430' : '#888'};
  border-radius: 8px 8px 0 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: linear-gradient(135deg, rgba(244, 196, 48, 0.2), rgba(244, 196, 48, 0.05));
    color: #f4c430;
  }
`;

// SVG 컨테이너
const SVGContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  overflow: visible;
  background: radial-gradient(ellipse at center, rgba(244, 196, 48, 0.03) 0%, transparent 60%);
`;

// 툴팁
const SkillTooltip = styled.div`
  position: fixed;
  z-index: 10000;
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
  border: 2px solid #f4c430;
  border-radius: 12px;
  width: 380px;
  box-shadow: 0 0 40px rgba(244, 196, 48, 0.3);
  display: ${props => props.visible ? 'block' : 'none'};
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  pointer-events: none;
  animation: tooltipFadeIn 0.3s ease-out;

  @keyframes tooltipFadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
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
`;

const TooltipTitle = styled.div`
  flex: 1;
  h4 {
    color: #f4c430;
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
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

  &:last-child { border-bottom: none; }

  .label { color: #888; font-weight: 500; }
  .value { color: #f4c430; font-weight: 600; }
`;

const TooltipDescription = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #ddd;
  font-size: 0.88rem;
  line-height: 1.5;
`;

// 스킬 노드 렌더링 함수 - 이벤트 핸들러를 받도록 수정
const renderSkillNode = (skill, x, y, size = 35, color = '#f4c430', priority = 'normal', onHover = null, onLeave = null) => {
  const iconSize = size * 1.4;
  const iconOffset = iconSize / 2;

  return (
    <g
      className="skill-node"
      key={skill.englishName}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* 위치 이동은 고정하고, 내부 요소만 확대 */}
      <g transform={`translate(${x}, ${y})`}>
        <g className="skill-node-scale" style={{transformOrigin: '0 0', transformBox: 'fill-box'}}>
          {/* 우선순위별 발광 효과 - 0,0 중심 좌표 사용 */}
          {priority === 'high' && (
            <>
              <circle cx={0} cy={0} r={size + 5} fill="none" stroke={color} strokeWidth="1" opacity="0.3"
                style={{animation: 'pulse 1.5s ease-in-out infinite'}}/>
              <circle cx={0} cy={0} r={size + 8} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2"
                style={{animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '0.2s'}}/>
            </>
          )}

          {/* 메인 노드 - 0,0 중심 */}
          <circle cx={0} cy={0} r={size} fill="url(#nodeGradient)" stroke={color} strokeWidth="3" filter="url(#glow)"/>

          {/* 아이콘 클리핑 마스크 - 0,0 중심 */}
          <clipPath id={`iconClip-${skill.englishName.replace(/\s/g, '-')}-${x}-${y}`}>
            <circle cx={0} cy={0} r={size - 5}/>
          </clipPath>

          {/* 아이콘 이미지 - 0,0 중심 */}
          <image
            href={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
            x={-iconOffset} y={-iconOffset}
            width={iconSize} height={iconSize}
            clipPath={`url(#iconClip-${skill.englishName.replace(/\s/g, '-')}-${x}-${y})`}
            filter="url(#iconShadow)"/>

          {/* 내부 보더 - 0,0 중심 */}
          <circle cx={0} cy={0} r={size - 5} fill="none" stroke={color} strokeWidth="1.5" opacity="0.6"/>

          {/* 투명한 히트박스 - 0,0 중심 */}
          <circle cx={0} cy={0} r={size + 5} fill="transparent" style={{cursor: 'pointer', pointerEvents: 'all'}}/>
        </g>
      </g>
    </g>
  );
};

// 메인 컴포넌트
const AdvancedRotationFlowchart = () => {
  const [activeTab, setActiveTab] = useState('main');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleSkillHover = (skill, event) => {
    if (event && skill) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = Math.min(rect.right + 15, window.innerWidth - 400);
      const y = Math.min(rect.top - 30, window.innerHeight - 300);
      setTooltipPos({ x: Math.max(10, x), y: Math.max(10, y) });
      setHoveredSkill(skill);
    } else {
      setHoveredSkill(null);
    }
  };

  // 메인 로테이션 플로우차트
  const renderMainFlowchart = () => (
    <svg width="1000" height="900" viewBox="0 0 1000 900">
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

        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="iconShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.7"/>
        </filter>

        {/* 화살표 마커 */}
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#f4c430" />
        </marker>
        <marker id="arrowhead-yes" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#4ade80" />
        </marker>
        <marker id="arrowhead-no" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
        </marker>
      </defs>

      {/* 타이틀 */}
      <text x="500" y="40" textAnchor="middle" fill="#f4c430" fontSize="24" fontWeight="700">
        메인 딜사이클 플로우차트
      </text>

      {/* 시작 노드 */}
      <g>
        <circle cx="500" cy="100" r="40" fill="url(#nodeGradient)" stroke="#f4c430" strokeWidth="3" filter="url(#glow)"/>
        <text x="500" y="105" textAnchor="middle" fill="#f4c430" fontSize="18" fontWeight="600">전투 시작</text>
      </g>

      {/* 연결선들 */}
      <path d="M 500 140 L 500 180" stroke="url(#arrowGradient)" strokeWidth="3" markerEnd="url(#arrowhead)"/>

      {/* 광분 체크 (결정 노드) */}
      <g>
        <rect x="420" y="180" width="160" height="70" rx="10" fill="url(#nodeGradient)" stroke="#f4c430" strokeWidth="2"/>
        <text x="500" y="205" textAnchor="middle" fill="#fff" fontSize="14">광분 중첩 체크</text>
        <text x="500" y="230" textAnchor="middle" fill="#f4c430" fontSize="13">3 미만?</text>
      </g>

      {/* 날카로운 사격 (YES 경로) */}
      <path d="M 420 250 L 350 300" stroke="#4ade80" strokeWidth="3" markerEnd="url(#arrowhead-yes)"/>
      <text x="370" y="275" fill="#4ade80" fontSize="14" fontWeight="700">YES</text>

      <g>
        {renderSkillNode(
          HUNTER_SKILLS.BARBED_SHOT, 350, 340, 40, '#f4c430', 'high',
          (e) => handleSkillHover(HUNTER_SKILLS.BARBED_SHOT, e),
          () => setHoveredSkill(null)
        )}
        <text x="350" y="395" textAnchor="middle" fill="#f4c430" fontSize="12">즉시 시전</text>
      </g>

      {/* 살상 명령 체크 (NO 경로) */}
      <path d="M 580 250 L 650 300" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead-no)"/>
      <text x="630" y="275" fill="#ef4444" fontSize="14" fontWeight="700">NO</text>

      <g>
        <rect x="570" y="300" width="160" height="70" rx="10" fill="url(#nodeGradient)" stroke="#ff6b6b" strokeWidth="2"/>
        <text x="650" y="325" textAnchor="middle" fill="#fff" fontSize="14">살상 명령</text>
        <text x="650" y="350" textAnchor="middle" fill="#ff6b6b" fontSize="13">쿨타임 체크</text>
      </g>

      {/* 살상 명령 (준비됨) */}
      <path d="M 650 370 L 650 420" stroke="url(#arrowGradient)" strokeWidth="3" markerEnd="url(#arrowhead)"/>

      <g>
        {renderSkillNode(
          HUNTER_SKILLS.KILL_COMMAND, 650, 470, 40, '#ff6b6b', 'high',
          (e) => handleSkillHover(HUNTER_SKILLS.KILL_COMMAND, e),
          () => setHoveredSkill(null)
        )}
        <text x="650" y="525" textAnchor="middle" fill="#ff6b6b" fontSize="12">최우선</text>
      </g>

      {/* 버스트 체크 */}
      <path d="M 500 340 L 500 400" stroke="url(#arrowGradient)" strokeWidth="3" markerEnd="url(#arrowhead)"/>

      <g>
        <rect x="420" y="400" width="160" height="70" rx="10" fill="url(#nodeGradient)" stroke="#ffa500" strokeWidth="2"/>
        <text x="500" y="425" textAnchor="middle" fill="#fff" fontSize="14">버스트 타이밍</text>
        <text x="500" y="450" textAnchor="middle" fill="#ffa500" fontSize="13">쿨다운 준비?</text>
      </g>

      {/* 버스트 스킬들 (YES 경로) */}
      <path d="M 420 470 L 350 520" stroke="#4ade80" strokeWidth="3" markerEnd="url(#arrowhead-yes)"/>
      <text x="370" y="495" fill="#4ade80" fontSize="14" fontWeight="700">YES</text>

      {/* 야수의 격노 + 야생의 부름 콤보 */}
      <g transform="translate(250, 550)">
        <rect x="-80" y="-30" width="160" height="60" rx="30" fill="url(#nodeGradient)" stroke="#ffa500" strokeWidth="2" opacity="0.3"/>

        {renderSkillNode(
          HUNTER_SKILLS.BESTIAL_WRATH, -30, 0, 35, '#ffa500', 'normal',
          (e) => handleSkillHover(HUNTER_SKILLS.BESTIAL_WRATH, e),
          () => setHoveredSkill(null)
        )}

        <text x="0" y="5" textAnchor="middle" fill="#ffa500" fontSize="20" fontWeight="800">+</text>

        {renderSkillNode(
          HUNTER_SKILLS.CALL_OF_THE_WILD, 30, 0, 35, '#ffa500', 'normal',
          (e) => handleSkillHover(HUNTER_SKILLS.CALL_OF_THE_WILD, e),
          () => setHoveredSkill(null)
        )}

        <text x="0" y="50" textAnchor="middle" fill="#ffa500" fontSize="11">버스트 콤보</text>
      </g>

      {/* HP 체크 (처형) */}
      <path d="M 500 470 L 500 550" stroke="url(#arrowGradient)" strokeWidth="3" markerEnd="url(#arrowhead)"/>

      <g>
        <rect x="420" y="550" width="160" height="70" rx="10" fill="url(#nodeGradient)" stroke="#ff1744" strokeWidth="2"/>
        <text x="500" y="575" textAnchor="middle" fill="#fff" fontSize="14">대상 생명력</text>
        <text x="500" y="600" textAnchor="middle" fill="#ff1744" fontSize="13">&lt; 20%?</text>
      </g>

      {/* 마무리 사격 (처형) */}
      <path d="M 420 620 L 350 670" stroke="#4ade80" strokeWidth="3" markerEnd="url(#arrowhead-yes)"/>
      <text x="370" y="645" fill="#4ade80" fontSize="14" fontWeight="700">YES</text>

      <g>
        {renderSkillNode(
          HUNTER_SKILLS.KILL_SHOT, 350, 720, 40, '#ff1744', 'high',
          (e) => handleSkillHover(HUNTER_SKILLS.KILL_SHOT, e),
          () => setHoveredSkill(null)
        )}
        <path d="M 330 700 L 370 740" stroke="#ff1744" strokeWidth="2" opacity="0.5"/>
        <path d="M 370 700 L 330 740" stroke="#ff1744" strokeWidth="2" opacity="0.5"/>
        <text x="350" y="775" textAnchor="middle" fill="#ff1744" fontSize="12">처형</text>
      </g>

      {/* 코브라 사격 (필러) */}
      <path d="M 580 620 L 650 670" stroke="url(#arrowGradient)" strokeWidth="3" markerEnd="url(#arrowhead)"/>

      <g>
        {renderSkillNode(
          HUNTER_SKILLS.COBRA_SHOT, 650, 720, 40, '#22c55e', 'normal',
          (e) => handleSkillHover(HUNTER_SKILLS.COBRA_SHOT, e),
          () => setHoveredSkill(null)
        )}
        <text x="650" y="775" textAnchor="middle" fill="#22c55e" fontSize="12">필러</text>
      </g>

      {/* 루프백 화살표 */}
      <path d="M 500 780 Q 200 500 500 250" stroke="url(#arrowGradient)" strokeWidth="2"
            fill="none" strokeDasharray="5,5" opacity="0.5" markerEnd="url(#arrowhead)"/>
      <text x="250" y="500" fill="#999" fontSize="11">반복</text>

      {/* 범례 */}
      <g transform="translate(800, 100)">
        <rect x="0" y="0" width="180" height="280" rx="10" fill="rgba(0,0,0,0.7)" stroke="#f4c430" strokeWidth="1.5"/>
        <text x="90" y="30" textAnchor="middle" fill="#f4c430" fontSize="16" fontWeight="700">우선순위</text>
        <line x1="20" y1="40" x2="160" y2="40" stroke="#f4c430" strokeWidth="1" opacity="0.3"/>

        <circle cx="30" cy="65" r="8" fill="#ff1744"/>
        <text x="50" y="70" fill="#fff" fontSize="12">1. 처형 (마무리 사격)</text>

        <circle cx="30" cy="95" r="8" fill="#ff6b6b"/>
        <text x="50" y="100" fill="#fff" fontSize="12">2. 살상 명령</text>

        <circle cx="30" cy="125" r="8" fill="#f4c430"/>
        <text x="50" y="130" fill="#fff" fontSize="12">3. 날카로운 사격</text>

        <circle cx="30" cy="155" r="8" fill="#ffa500"/>
        <text x="50" y="160" fill="#fff" fontSize="12">4. 버스트 쿨다운</text>

        <circle cx="30" cy="185" r="8" fill="#22c55e"/>
        <text x="50" y="190" fill="#fff" fontSize="12">5. 코브라 사격</text>

        <line x1="20" y1="210" x2="160" y2="210" stroke="#f4c430" strokeWidth="1" opacity="0.3"/>
        <text x="90" y="235" textAnchor="middle" fill="#999" fontSize="10">마우스 오버로</text>
        <text x="90" y="250" textAnchor="middle" fill="#999" fontSize="10">상세정보 확인</text>
      </g>
    </svg>
  );

  // 오프닝 시퀀스 플로우차트
  const renderOpeningFlowchart = () => (
    <svg width="1000" height="700" viewBox="0 0 1000 700">
      <defs>
        <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:'#22c55e', stopOpacity:0.8}} />
          <stop offset="50%" style={{stopColor:'#f4c430', stopOpacity:0.8}} />
          <stop offset="100%" style={{stopColor:'#ff6b6b', stopOpacity:0.8}} />
        </linearGradient>
      </defs>

      {/* 타이틀 */}
      <text x="500" y="40" textAnchor="middle" fill="#f4c430" fontSize="24" fontWeight="700">
        오프닝 시퀀스 (첫 20초)
      </text>

      {/* 타임라인 */}
      <line x1="100" y1="100" x2="900" y2="100" stroke="url(#timelineGradient)" strokeWidth="4"/>

      {/* 시간 마커 */}
      {['-3', '0', '1', '2', '3', '5', '10', '15', '20'].map((time, idx) => (
        <g key={time}>
          <line x1={100 + idx * 100} y1="95" x2={100 + idx * 100} y2="105" stroke="#f4c430" strokeWidth="2"/>
          <text x={100 + idx * 100} y="130" textAnchor="middle" fill="#f4c430" fontSize="12">{time}초</text>
        </g>
      ))}

      {/* -3초: 사냥꾼의 징표 */}
      <g>
        {renderSkillNode(
          HUNTER_SKILLS.HUNTERS_MARK, 100, 200, 35, '#64748b', 'normal',
          (e) => handleSkillHover(HUNTER_SKILLS.HUNTERS_MARK, e),
          () => setHoveredSkill(null)
        )}
        <text x="100" y="250" textAnchor="middle" fill="#64748b" fontSize="11">사전 준비</text>
        <text x="100" y="265" textAnchor="middle" fill="#999" fontSize="10">징표 표시</text>
      </g>

      {/* 0초: 피흘리기 + 야수의 격노 */}
      <g transform="translate(200, 200)">
        {renderSkillNode(
          HUNTER_SKILLS.BLOODSHED, 0, -30, 35, '#ff6b6b', 'normal',
          (e) => handleSkillHover(HUNTER_SKILLS.BLOODSHED, e),
          () => setHoveredSkill(null)
        )}

        {renderSkillNode(
          HUNTER_SKILLS.BESTIAL_WRATH, 0, 30, 35, '#ffa500', 'normal',
          (e) => handleSkillHover(HUNTER_SKILLS.BESTIAL_WRATH, e),
          () => setHoveredSkill(null)
        )}

        <text x="0" y="75" textAnchor="middle" fill="#ffa500" fontSize="11">전투 개시</text>
        <text x="0" y="90" textAnchor="middle" fill="#999" fontSize="10">동시 사용</text>
      </g>

      {/* 1초: 야생의 부름 */}
      <g>
        {renderSkillNode(
          HUNTER_SKILLS.CALL_OF_THE_WILD, 300, 200, 40, '#ffa500', 'high',
          (e) => handleSkillHover(HUNTER_SKILLS.CALL_OF_THE_WILD, e),
          () => setHoveredSkill(null)
        )}
        <text x="300" y="250" textAnchor="middle" fill="#ffa500" fontSize="11">극대화</text>
        <text x="300" y="265" textAnchor="middle" fill="#999" fontSize="10">20초 버스트</text>
      </g>

      {/* 2초: 날카로운 사격 */}
      <g>
        {renderSkillNode(
          HUNTER_SKILLS.BARBED_SHOT, 400, 200, 35, '#f4c430', 'normal',
          (e) => handleSkillHover(HUNTER_SKILLS.BARBED_SHOT, e),
          () => setHoveredSkill(null)
        )}
        <text x="400" y="250" textAnchor="middle" fill="#f4c430" fontSize="11">광분 시작</text>
        <text x="400" y="265" textAnchor="middle" fill="#999" fontSize="10">3중첩 목표</text>
      </g>

      {/* 3초: 살상 명령 */}
      <g>
        {renderSkillNode(
          HUNTER_SKILLS.KILL_COMMAND, 500, 200, 35, '#ff6b6b', 'normal',
          (e) => handleSkillHover(HUNTER_SKILLS.KILL_COMMAND, e),
          () => setHoveredSkill(null)
        )}
        <text x="500" y="250" textAnchor="middle" fill="#ff6b6b" fontSize="11">메인 딜</text>
      </g>

      {/* 5-20초: 로테이션 */}
      <g transform="translate(700, 200)">
        <rect x="-100" y="-50" width="200" height="100" rx="15"
              fill="rgba(0,0,0,0.3)" stroke="#f4c430" strokeWidth="2" strokeDasharray="5,5"/>
        <text x="0" y="-20" textAnchor="middle" fill="#f4c430" fontSize="14">기본 로테이션</text>
        <text x="0" y="0" textAnchor="middle" fill="#999" fontSize="11">우선순위 따라</text>
        <text x="0" y="20" textAnchor="middle" fill="#999" fontSize="11">스킬 사용</text>
      </g>

      {/* 버스트 윈도우 표시 */}
      <rect x="200" y="350" width="600" height="80" rx="10"
            fill="rgba(255, 165, 0, 0.1)" stroke="#ffa500" strokeWidth="2"/>
      <text x="500" y="380" textAnchor="middle" fill="#ffa500" fontSize="14" fontWeight="600">
        버스트 윈도우 (야격 + 야생의 부름)
      </text>
      <text x="500" y="405" textAnchor="middle" fill="#fff" fontSize="12">
        모든 쿨다운 집중 사용, 최대 DPS 구간
      </text>

      {/* DPS 그래프 */}
      <g transform="translate(100, 480)">
        <text x="400" y="-10" textAnchor="middle" fill="#f4c430" fontSize="14" fontWeight="600">
          예상 DPS 곡선
        </text>
        <polyline points="0,100 100,60 200,30 300,20 400,25 500,30 600,35 700,40 800,45"
                  stroke="#ff6b6b" strokeWidth="2" fill="none"/>
        <circle cx="200" cy="30" r="5" fill="#ff6b6b"/>
        <text x="200" y="15" textAnchor="middle" fill="#ff6b6b" fontSize="10">피크</text>
      </g>
    </svg>
  );

  // 쿨다운 관리 플로우차트
  const renderCooldownFlowchart = () => (
    <svg width="1000" height="800" viewBox="0 0 1000 800">
      {/* 타이틀 */}
      <text x="500" y="40" textAnchor="middle" fill="#f4c430" fontSize="24" fontWeight="700">
        쿨다운 관리 플로우차트
      </text>

      {/* 메인 쿨다운 타임라인 */}
      <g transform="translate(100, 100)">
        <text x="400" y="-10" textAnchor="middle" fill="#ffa500" fontSize="16" fontWeight="600">
          주요 쿨다운 타이밍
        </text>

        {/* 야생의 부름 (3분) */}
        <g>
          <rect x="0" y="20" width="800" height="60" rx="10" fill="rgba(0,0,0,0.3)" stroke="#ffa500" strokeWidth="2"/>
          <text x="10" y="45" fill="#ffa500" fontSize="12" fontWeight="600">야생의 부름</text>
          <text x="10" y="65" fill="#999" fontSize="10">3분 쿨다운</text>

          {[0, 180, 360, 540, 720].map((time, idx) => (
            <g key={idx}>
              <circle cx={100 + time * 0.9} cy="50" r="15" fill="#ffa500" opacity="0.8"/>
              <text x={100 + time * 0.9} y="55" textAnchor="middle" fill="#fff" fontSize="10">{time}초</text>
            </g>
          ))}
        </g>

        {/* 야생의 상 (2분) */}
        <g transform="translate(0, 100)">
          <rect x="0" y="20" width="800" height="60" rx="10" fill="rgba(0,0,0,0.3)" stroke="#4fc3f7" strokeWidth="2"/>
          <text x="10" y="45" fill="#4fc3f7" fontSize="12" fontWeight="600">야생의 상</text>
          <text x="10" y="65" fill="#999" fontSize="10">2분 쿨다운</text>

          {[0, 120, 240, 360, 480, 600, 720].map((time, idx) => (
            <g key={idx}>
              <circle cx={100 + time * 0.9} cy="50" r="15" fill="#4fc3f7" opacity="0.8"/>
              <text x={100 + time * 0.9} y="55" textAnchor="middle" fill="#fff" fontSize="10">{time}초</text>
            </g>
          ))}
        </g>

        {/* 야수의 격노 (1.5분) */}
        <g transform="translate(0, 200)">
          <rect x="0" y="20" width="800" height="60" rx="10" fill="rgba(0,0,0,0.3)" stroke="#22c55e" strokeWidth="2"/>
          <text x="10" y="45" fill="#22c55e" fontSize="12" fontWeight="600">야수의 격노</text>
          <text x="10" y="65" fill="#999" fontSize="10">1.5분 쿨다운</text>

          {[0, 90, 180, 270, 360, 450, 540, 630, 720].map((time, idx) => (
            <g key={idx}>
              <circle cx={100 + time * 0.9} cy="50" r="15" fill="#22c55e" opacity="0.8"/>
              <text x={100 + time * 0.9} y="55" textAnchor="middle" fill="#fff" fontSize="10">{time}초</text>
            </g>
          ))}
        </g>

        {/* 피흘리기 (1분) */}
        <g transform="translate(0, 300)">
          <rect x="0" y="20" width="800" height="60" rx="10" fill="rgba(0,0,0,0.3)" stroke="#ff6b6b" strokeWidth="2"/>
          <text x="10" y="45" fill="#ff6b6b" fontSize="12" fontWeight="600">피흘리기</text>
          <text x="10" y="65" fill="#999" fontSize="10">1분 쿨다운</text>

          {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720].map((time, idx) => (
            <g key={idx}>
              <circle cx={100 + time * 0.9} cy="50" r="12" fill="#ff6b6b" opacity="0.8"/>
              <text x={100 + time * 0.9} y="55" textAnchor="middle" fill="#fff" fontSize="9">{time}</text>
            </g>
          ))}
        </g>
      </g>

      {/* 시너지 윈도우 */}
      <g transform="translate(100, 520)">
        <text x="400" y="-10" textAnchor="middle" fill="#f4c430" fontSize="16" fontWeight="600">
          쿨다운 시너지 포인트
        </text>

        <rect x="0" y="10" width="800" height="100" rx="10"
              fill="rgba(244, 196, 48, 0.1)" stroke="#f4c430" strokeWidth="2"/>

        {/* 시너지 포인트 마커 */}
        <g>
          <line x1="100" y1="10" x2="100" y2="110" stroke="#f4c430" strokeWidth="3" opacity="0.8"/>
          <text x="100" y="130" textAnchor="middle" fill="#f4c430" fontSize="11">0초</text>
          <text x="100" y="145" textAnchor="middle" fill="#999" fontSize="10">모든 쿨 사용</text>
        </g>

        <g>
          <line x1="280" y1="10" x2="280" y2="110" stroke="#f4c430" strokeWidth="3" opacity="0.6"/>
          <text x="280" y="130" textAnchor="middle" fill="#f4c430" fontSize="11">180초</text>
          <text x="280" y="145" textAnchor="middle" fill="#999" fontSize="10">야격 + 야생의 부름</text>
        </g>

        <g>
          <line x1="460" y1="10" x2="460" y2="110" stroke="#f4c430" strokeWidth="3" opacity="0.6"/>
          <text x="460" y="130" textAnchor="middle" fill="#f4c430" fontSize="11">360초</text>
          <text x="460" y="145" textAnchor="middle" fill="#999" fontSize="10">모든 쿨 재사용</text>
        </g>
      </g>

      {/* 결정 트리 */}
      <g transform="translate(150, 700)">
        <rect x="-50" y="-30" width="200" height="60" rx="10" fill="url(#nodeGradient)" stroke="#f4c430" strokeWidth="2"/>
        <text x="50" y="-5" textAnchor="middle" fill="#f4c430" fontSize="12">쿨다운 사용 결정</text>
        <text x="50" y="15" textAnchor="middle" fill="#fff" fontSize="11">보스 HP &gt; 20%?</text>
      </g>

      <g transform="translate(400, 700)">
        <rect x="-50" y="-30" width="150" height="60" rx="10" fill="rgba(0,255,0,0.2)" stroke="#22c55e" strokeWidth="2"/>
        <text x="25" y="0" textAnchor="middle" fill="#22c55e" fontSize="12">YES: 홀드</text>
      </g>

      <g transform="translate(600, 700)">
        <rect x="-50" y="-30" width="150" height="60" rx="10" fill="rgba(255,0,0,0.2)" stroke="#ff6b6b" strokeWidth="2"/>
        <text x="25" y="0" textAnchor="middle" fill="#ff6b6b" fontSize="12">NO: 즉시 사용</text>
      </g>
    </svg>
  );

  return (
    <>
      <GlobalStyle />
      <FlowchartSystemContainer>
        <TabMenu>
          <TabButton active={activeTab === 'main'} onClick={() => setActiveTab('main')}>
            메인 로테이션
          </TabButton>
          <TabButton active={activeTab === 'opening'} onClick={() => setActiveTab('opening')}>
            오프닝 시퀀스
          </TabButton>
          <TabButton active={activeTab === 'cooldown'} onClick={() => setActiveTab('cooldown')}>
            쿨다운 관리
          </TabButton>
        </TabMenu>

        <SVGContainer>
          {activeTab === 'main' && renderMainFlowchart()}
          {activeTab === 'opening' && renderOpeningFlowchart()}
          {activeTab === 'cooldown' && renderCooldownFlowchart()}
        </SVGContainer>

        {/* 툴팁 */}
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
                <span className="label">소모 자원</span>
                <span className="value">{hoveredSkill.resourceCost || '없음'}</span>
              </TooltipRow>
              {hoveredSkill.resourceGain && (
                <TooltipRow>
                  <span className="label">생성 자원</span>
                  <span className="value">{hoveredSkill.resourceGain}</span>
                </TooltipRow>
              )}
              <TooltipDescription>
                {hoveredSkill.description}
              </TooltipDescription>
            </TooltipBody>
          </SkillTooltip>
        )}
      </FlowchartSystemContainer>
    </>
  );
};

export default AdvancedRotationFlowchart;