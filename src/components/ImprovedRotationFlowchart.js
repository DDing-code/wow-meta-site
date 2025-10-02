import React, { useState } from 'react';
import styled from 'styled-components';

// 스킬 데이터베이스 import
let skillDatabase = {};
try {
  skillDatabase = require('../database-builder/tww-s3-final-ultimate-database.json');
} catch (e) {
  console.warn('스킬 데이터베이스 로드 실패');
}

// Hunter 스킬 ID 매핑 (정확한 번역을 위한)
const HUNTER_SKILLS = {
  KILL_COMMAND: '34026',      // 살상 명령
  BARBED_SHOT: '217200',       // 가시 사격
  COBRA_SHOT: '193455',        // 코브라 사격
  BESTIAL_WRATH: '19574',      // 야수의 격노
  BLOODSHED: '321530',         // 피흘리기
  CALL_OF_THE_WILD: '359844',  // 야생의 부름
  KILL_SHOT: '53351',          // 마무리 사격
  HUNTERS_MARK: '257284',      // 사냥꾼의 징표
  DIRE_BEAST: '120679',        // 광포한 야수
  ASPECT_OF_THE_WILD: '193530' // 야생의 상
};

// 플로우차트 컨테이너
const FlowchartContainer = styled.div`
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  border: 2px solid rgba(244, 196, 48, 0.3);
  border-radius: 15px;
  padding: 30px;
  margin: 20px 0;
  overflow: visible;
  position: relative;
`;

const FlowchartTitle = styled.h3`
  font-family: system-ui, -apple-system, sans-serif;
  color: #f4c430;
  margin-bottom: 25px;
  font-size: 1.6rem;
  text-align: center;
  font-weight: 600;
`;

const SVGContainer = styled.div`
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #f4c430;
    border-radius: 4px;
  }
`;

// 스킬 툴팁
const SkillTooltip = styled.div`
  position: fixed;
  z-index: 10000;
  background: #1a1a2e;
  border: 2px solid #f4c430;
  border-radius: 8px;
  padding: 0;
  width: 340px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  display: ${props => props.visible ? 'block' : 'none'};
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  pointer-events: none;
`;

const TooltipHeader = styled.div`
  background: linear-gradient(135deg, #2c1810, #1a0e08);
  padding: 12px 15px;
  border-bottom: 1px solid rgba(244, 196, 48, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TooltipIcon = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #f4c430;
`;

const TooltipTitle = styled.div`
  flex: 1;

  h4 {
    color: #f4c430;
    margin: 0;
    font-size: 1.1rem;
  }

  span {
    color: #999;
    font-size: 0.85rem;
  }
`;

const TooltipBody = styled.div`
  padding: 15px;
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 0.9rem;
  color: #ccc;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  span:first-child {
    color: #888;
  }

  span:last-child {
    color: #f4c430;
    font-weight: 500;
  }
`;

const TooltipDescription = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  line-height: 1.5;
  color: #e0e0e0;
`;

// 범례
const Legend = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #ccc;
`;

const LegendBox = styled.div`
  width: 18px;
  height: 18px;
  background: ${props => props.color};
  border-radius: ${props => props.rounded ? '50%' : '4px'};
  border: 2px solid ${props => props.stroke};
`;

const ImprovedRotationFlowchart = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 노드 타입별 스타일 (더 선명한 색상)
  const nodeStyles = {
    start: { fill: '#4fc3f7', stroke: '#03a9f4', rx: 25 },
    decision: { fill: '#ffa726', stroke: '#ff9800' },
    action: { fill: '#66bb6a', stroke: '#4caf50', rx: 10 },
    cooldown: { fill: '#ab47bc', stroke: '#9c27b0', rx: 10 },
    burst: { fill: '#ef5350', stroke: '#f44336', rx: 12 },
    filler: { fill: '#78909c', stroke: '#607d8b', rx: 8 }
  };

  // 개선된 Beast Mastery Hunter 로테이션 데이터
  const rotationData = {
    nodes: [
      { id: 'start', type: 'start', label: '전투 시작', x: 500, y: 50, skillId: null },

      // Pre-pull
      { id: 'prepull', type: 'decision', label: '전투 전\n준비?', x: 500, y: 120, skillId: null },
      { id: 'hunters_mark', type: 'action', label: '사냥꾼의 징표', x: 300, y: 120, skillId: HUNTER_SKILLS.HUNTERS_MARK },

      // 버스트 체크
      { id: 'check_burst', type: 'decision', label: '버스트\n타이밍?', x: 500, y: 200, skillId: null },
      { id: 'bloodshed', type: 'burst', label: '피흘리기', x: 300, y: 280, skillId: HUNTER_SKILLS.BLOODSHED },
      { id: 'bestial_wrath', type: 'burst', label: '야수의 격노', x: 300, y: 360, skillId: HUNTER_SKILLS.BESTIAL_WRATH },
      { id: 'call_wild', type: 'burst', label: '야생의 부름', x: 300, y: 440, skillId: HUNTER_SKILLS.CALL_OF_THE_WILD },

      // 메인 우선순위
      { id: 'priority_loop', type: 'decision', label: '우선순위\n체크', x: 500, y: 520, skillId: null },

      // 1. 광분 유지
      { id: 'check_frenzy', type: 'decision', label: '광분 < 2초?', x: 500, y: 600, skillId: null },
      { id: 'barbed_frenzy', type: 'cooldown', label: '가시 사격', x: 700, y: 600, skillId: HUNTER_SKILLS.BARBED_SHOT },

      // 2. 살상 명령
      { id: 'check_kill_cmd', type: 'decision', label: '살상 명령\n준비?', x: 500, y: 680, skillId: null },
      { id: 'kill_command', type: 'action', label: '살상 명령', x: 700, y: 680, skillId: HUNTER_SKILLS.KILL_COMMAND },

      // 3. 가시 사격 충전
      { id: 'check_barbed_charges', type: 'decision', label: '가시 사격\n2충전?', x: 500, y: 760, skillId: null },
      { id: 'barbed_charge', type: 'action', label: '가시 사격', x: 700, y: 760, skillId: HUNTER_SKILLS.BARBED_SHOT },

      // 4. 집중 관리
      { id: 'check_focus', type: 'decision', label: '집중 > 50?', x: 500, y: 840, skillId: null },
      { id: 'cobra_shot', type: 'filler', label: '코브라 사격', x: 700, y: 840, skillId: HUNTER_SKILLS.COBRA_SHOT },

      // 5. 처형 (킬샷)
      { id: 'check_execute', type: 'decision', label: '체력 < 20%?', x: 500, y: 920, skillId: null },
      { id: 'kill_shot', type: 'burst', label: '마무리 사격', x: 700, y: 920, skillId: HUNTER_SKILLS.KILL_SHOT }
    ],
    edges: [
      // 시작
      { from: 'start', to: 'prepull', type: 'normal' },

      // Pre-pull
      { from: 'prepull', to: 'hunters_mark', type: 'yes', label: 'Y' },
      { from: 'prepull', to: 'check_burst', type: 'no', label: 'N' },
      { from: 'hunters_mark', to: 'check_burst', type: 'normal' },

      // 버스트
      { from: 'check_burst', to: 'bloodshed', type: 'yes', label: 'Y' },
      { from: 'check_burst', to: 'priority_loop', type: 'no', label: 'N' },
      { from: 'bloodshed', to: 'bestial_wrath', type: 'normal' },
      { from: 'bestial_wrath', to: 'call_wild', type: 'normal' },
      { from: 'call_wild', to: 'priority_loop', type: 'normal' },

      // 우선순위 루프
      { from: 'priority_loop', to: 'check_frenzy', type: 'normal' },

      // 광분 체크
      { from: 'check_frenzy', to: 'barbed_frenzy', type: 'yes', label: 'Y' },
      { from: 'check_frenzy', to: 'check_kill_cmd', type: 'no', label: 'N' },
      { from: 'barbed_frenzy', to: 'priority_loop', type: 'loop' },

      // 살상 명령
      { from: 'check_kill_cmd', to: 'kill_command', type: 'yes', label: 'Y' },
      { from: 'check_kill_cmd', to: 'check_barbed_charges', type: 'no', label: 'N' },
      { from: 'kill_command', to: 'priority_loop', type: 'loop' },

      // 가시 사격 충전
      { from: 'check_barbed_charges', to: 'barbed_charge', type: 'yes', label: 'Y' },
      { from: 'check_barbed_charges', to: 'check_focus', type: 'no', label: 'N' },
      { from: 'barbed_charge', to: 'priority_loop', type: 'loop' },

      // 집중 체크
      { from: 'check_focus', to: 'cobra_shot', type: 'yes', label: 'Y' },
      { from: 'check_focus', to: 'check_execute', type: 'no', label: 'N' },
      { from: 'cobra_shot', to: 'priority_loop', type: 'loop' },

      // 처형
      { from: 'check_execute', to: 'kill_shot', type: 'yes', label: 'Y' },
      { from: 'check_execute', to: 'priority_loop', type: 'no', label: 'Loop' },
      { from: 'kill_shot', to: 'priority_loop', type: 'loop' }
    ]
  };

  const handleNodeHover = (node, event) => {
    if (node && node.skillId) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPos({
        x: Math.min(rect.right + 10, window.innerWidth - 360),
        y: Math.max(rect.top - 50, 10)
      });
      setHoveredSkill(node.skillId);
    } else {
      setHoveredSkill(null);
    }
  };

  const getSkillInfo = (skillId) => {
    return skillDatabase.HUNTER?.[skillId] || null;
  };

  const renderNode = (node) => {
    const style = nodeStyles[node.type] || nodeStyles.action;
    const isDecision = node.type === 'decision';
    const hasSkill = node.skillId !== null;

    return (
      <g key={node.id}>
        {isDecision ? (
          // 다이아몬드 (결정 노드)
          <polygon
            points={`${node.x},${node.y - 35} ${node.x + 70},${node.y} ${node.x},${node.y + 35} ${node.x - 70},${node.y}`}
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth="3"
            opacity="0.95"
            onMouseEnter={(e) => handleNodeHover(node, e)}
            onMouseLeave={() => handleNodeHover(null)}
            style={{ cursor: hasSkill ? 'pointer' : 'default' }}
          />
        ) : (
          // 사각형 (액션 노드)
          <rect
            x={node.x - 65}
            y={node.y - 28}
            width="130"
            height="56"
            rx={style.rx || 10}
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth="3"
            opacity="0.95"
            onMouseEnter={(e) => handleNodeHover(node, e)}
            onMouseLeave={() => handleNodeHover(null)}
            style={{ cursor: hasSkill ? 'pointer' : 'default' }}
          />
        )}

        {/* 텍스트 */}
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="13"
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          {node.label.split('\n').map((line, i) => (
            <tspan key={i} x={node.x} dy={i === 0 ? 0 : 16}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  const renderEdge = (edge) => {
    const fromNode = rotationData.nodes.find(n => n.id === edge.from);
    const toNode = rotationData.nodes.find(n => n.id === edge.to);

    if (!fromNode || !toNode) return null;

    // 엣지 색상
    const strokeColor = edge.type === 'yes' ? '#4caf50' :
                       edge.type === 'no' ? '#f44336' :
                       edge.type === 'loop' ? '#9c27b0' :
                       '#ffd700';

    const strokeDasharray = edge.type === 'loop' ? '8,4' : 'none';
    const strokeWidth = edge.type === 'loop' ? 2 : 3;

    // 경로 계산
    let path;
    if (edge.type === 'loop') {
      // 루프는 오른쪽으로 곡선
      const midX = Math.max(fromNode.x, toNode.x) + 150;
      const midY = (fromNode.y + toNode.y) / 2;
      path = `M ${fromNode.x + 65} ${fromNode.y} Q ${midX} ${midY} ${toNode.x + 70} ${toNode.y}`;
    } else {
      // 일반 경로
      path = `M ${fromNode.x} ${fromNode.y + 35} L ${toNode.x} ${toNode.y - 35}`;
    }

    return (
      <g key={`${edge.from}-${edge.to}`}>
        <path
          d={path}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          fill="none"
          markerEnd="url(#arrowhead)"
          opacity="0.9"
        />

        {/* 라벨 */}
        {edge.label && (
          <text
            x={(fromNode.x + toNode.x) / 2}
            y={(fromNode.y + toNode.y) / 2}
            textAnchor="middle"
            fill={strokeColor}
            fontSize="14"
            fontWeight="bold"
            stroke="#0a0a0f"
            strokeWidth="3"
            paintOrder="stroke"
          >
            {edge.label}
          </text>
        )}
      </g>
    );
  };

  const skill = hoveredSkill ? getSkillInfo(hoveredSkill) : null;

  return (
    <FlowchartContainer>
      <FlowchartTitle>딜사이클 알고리즘 플로우차트</FlowchartTitle>

      <SVGContainer>
        <svg width="1000" height="1000" viewBox="0 0 1000 1000">
          {/* 정의 */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
              fill="#ffd700"
            >
              <polygon points="0 0, 10 3.5, 0 7" />
            </marker>

            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* 배경 그리드 */}
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(244,196,48,0.03)" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* 엣지 렌더링 (노드 아래) */}
          {rotationData.edges.map(edge => renderEdge(edge))}

          {/* 노드 렌더링 */}
          {rotationData.nodes.map(node => renderNode(node))}
        </svg>
      </SVGContainer>

      {/* 범례 */}
      <Legend>
        <LegendItem>
          <LegendBox color={nodeStyles.start.fill} stroke={nodeStyles.start.stroke} rounded />
          <span>시작</span>
        </LegendItem>
        <LegendItem>
          <LegendBox color={nodeStyles.decision.fill} stroke={nodeStyles.decision.stroke} />
          <span>조건 체크</span>
        </LegendItem>
        <LegendItem>
          <LegendBox color={nodeStyles.action.fill} stroke={nodeStyles.action.stroke} />
          <span>주요 스킬</span>
        </LegendItem>
        <LegendItem>
          <LegendBox color={nodeStyles.burst.fill} stroke={nodeStyles.burst.stroke} />
          <span>버스트/처형</span>
        </LegendItem>
        <LegendItem>
          <LegendBox color={nodeStyles.cooldown.fill} stroke={nodeStyles.cooldown.stroke} />
          <span>쿨다운</span>
        </LegendItem>
        <LegendItem>
          <LegendBox color={nodeStyles.filler.fill} stroke={nodeStyles.filler.stroke} />
          <span>필러</span>
        </LegendItem>
      </Legend>

      {/* 스킬 툴팁 */}
      {skill && (
        <SkillTooltip visible={!!skill} x={tooltipPos.x} y={tooltipPos.y}>
          <TooltipHeader>
            <TooltipIcon
              src={`https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`}
              alt={skill.koreanName}
            />
            <TooltipTitle>
              <h4>{skill.koreanName}</h4>
              <span>{skill.englishName}</span>
            </TooltipTitle>
          </TooltipHeader>
          <TooltipBody>
            <TooltipRow>
              <span>시전 시간:</span>
              <span>{skill.castTime || '즉시'}</span>
            </TooltipRow>
            <TooltipRow>
              <span>재사용 대기시간:</span>
              <span>{skill.cooldown || '없음'}</span>
            </TooltipRow>
            <TooltipRow>
              <span>사거리:</span>
              <span>{skill.range || '근접'}</span>
            </TooltipRow>
            <TooltipRow>
              <span>소모 자원:</span>
              <span>{skill.resourceCost || '없음'}</span>
            </TooltipRow>
            {skill.resourceGain && skill.resourceGain !== '없음' && (
              <TooltipRow>
                <span>생성 자원:</span>
                <span>{skill.resourceGain}</span>
              </TooltipRow>
            )}
            <TooltipDescription>
              {skill.description || '상세 설명이 없습니다.'}
            </TooltipDescription>
          </TooltipBody>
        </SkillTooltip>
      )}
    </FlowchartContainer>
  );
};

export default ImprovedRotationFlowchart;