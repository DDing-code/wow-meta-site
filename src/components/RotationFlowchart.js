import React, { useState } from 'react';
import styled from 'styled-components';

// 플로우차트 컨테이너
const FlowchartContainer = styled.div`
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  border: 2px solid rgba(244, 196, 48, 0.3);
  border-radius: 15px;
  padding: 30px;
  margin: 30px 0;
  overflow-x: auto;
  position: relative;

  &::-webkit-scrollbar {
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #f4c430, #c9a426);
    border-radius: 5px;
  }
`;

const FlowchartTitle = styled.h3`
  font-family: 'Cinzel', serif;
  color: #f4c430;
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-align: center;
`;

const SVGContainer = styled.div`
  display: flex;
  justify-content: center;
  min-width: 900px;
  padding: 20px;
`;

// 노드 타입별 스타일
const nodeStyles = {
  start: { fill: '#4fc3f7', stroke: '#2196f3', rx: 20 },
  decision: { fill: '#ffa726', stroke: '#ff9800' },
  action: { fill: '#66bb6a', stroke: '#4caf50', rx: 8 },
  cooldown: { fill: '#ab47bc', stroke: '#9c27b0', rx: 8 },
  burst: { fill: '#ef5350', stroke: '#f44336', rx: 12 },
  filler: { fill: '#78909c', stroke: '#607d8b', rx: 8 }
};

// 범례 컴포넌트
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
  font-size: 0.9rem;
  color: #ccc;
`;

const LegendBox = styled.div`
  width: 20px;
  height: 20px;
  background: ${props => props.color};
  border-radius: ${props => props.rounded ? '50%' : '4px'};
  border: 2px solid ${props => props.stroke};
`;

// 인터랙티브 툴팁
const Tooltip = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #f4c430;
  border-radius: 8px;
  padding: 10px;
  color: white;
  font-size: 0.9rem;
  pointer-events: none;
  z-index: 1000;
  max-width: 250px;

  ${props => props.visible ? `
    opacity: 1;
    transform: translate(${props.x}px, ${props.y}px);
  ` : `
    opacity: 0;
  `}

  transition: opacity 0.2s;
`;

const RotationFlowchart = ({ rotationData }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 기본 Beast Mastery Hunter 로테이션 데이터
  const defaultRotation = {
    nodes: [
      { id: 'start', type: 'start', label: '전투 시작', x: 450, y: 50, description: '전투 진입 시 시작점' },

      // 오프닝 체크
      { id: 'check_opener', type: 'decision', label: '오프닝?', x: 450, y: 120, description: '전투 시작 3초 이내인지 확인' },

      // 오프닝 시퀀스
      { id: 'bloodshed', type: 'burst', label: '피흘리기', x: 250, y: 200, description: '대상에게 도트 데미지 (20초)' },
      { id: 'bestial_wrath', type: 'burst', label: '야수의 격노', x: 250, y: 280, description: '펫 데미지 25% 증가' },
      { id: 'call_wild', type: 'burst', label: '야생의 부름', x: 250, y: 360, description: '추가 펫 소환 (20초)' },

      // 메인 로테이션
      { id: 'main_loop', type: 'decision', label: '우선순위 체크', x: 450, y: 440, description: '메인 로테이션 우선순위' },

      // 1순위: 가시 사격
      { id: 'check_barbed', type: 'decision', label: '가시 사격\n충전 2개?', x: 450, y: 520, description: '가시 사격 충전 확인' },
      { id: 'barbed_shot', type: 'action', label: '가시 사격', x: 650, y: 520, description: '집중 생성, 광분 중첩' },

      // 2순위: 살해 명령
      { id: 'check_kill_command', type: 'decision', label: '살해 명령\n사용 가능?', x: 450, y: 600, description: '살해 명령 쿨다운 체크' },
      { id: 'kill_command', type: 'action', label: '살해 명령', x: 650, y: 600, description: '주요 데미지 기술' },

      // 3순위: 광분 유지
      { id: 'check_frenzy', type: 'decision', label: '광분 3중첩\n2초 이하?', x: 450, y: 680, description: '광분 중첩 시간 체크' },
      { id: 'barbed_refresh', type: 'cooldown', label: '가시 사격\n(새로고침)', x: 250, y: 680, description: '광분 유지용' },

      // 4순위: 집중 소비
      { id: 'check_focus', type: 'decision', label: '집중 > 50?', x: 450, y: 760, description: '집중 자원 체크' },
      { id: 'cobra_shot', type: 'filler', label: '코브라 사격', x: 650, y: 760, description: '집중 소비, 살해 명령 쿨 감소' },

      // 킬샷 체크
      { id: 'check_killshot', type: 'decision', label: '대상 체력\n< 20%?', x: 450, y: 840, description: '킬샷 사용 가능 체크' },
      { id: 'kill_shot', type: 'burst', label: '킬샷', x: 650, y: 840, description: '처형 기술' }
    ],
    edges: [
      // 시작
      { from: 'start', to: 'check_opener', type: 'normal' },

      // 오프닝 분기
      { from: 'check_opener', to: 'bloodshed', type: 'yes', label: 'Y' },
      { from: 'check_opener', to: 'main_loop', type: 'no', label: 'N' },

      // 오프닝 시퀀스
      { from: 'bloodshed', to: 'bestial_wrath', type: 'normal' },
      { from: 'bestial_wrath', to: 'call_wild', type: 'normal' },
      { from: 'call_wild', to: 'main_loop', type: 'normal' },

      // 메인 로테이션
      { from: 'main_loop', to: 'check_barbed', type: 'normal' },

      // 가시 사격
      { from: 'check_barbed', to: 'barbed_shot', type: 'yes', label: 'Y' },
      { from: 'check_barbed', to: 'check_kill_command', type: 'no', label: 'N' },
      { from: 'barbed_shot', to: 'main_loop', type: 'loop' },

      // 살해 명령
      { from: 'check_kill_command', to: 'kill_command', type: 'yes', label: 'Y' },
      { from: 'check_kill_command', to: 'check_frenzy', type: 'no', label: 'N' },
      { from: 'kill_command', to: 'main_loop', type: 'loop' },

      // 광분 체크
      { from: 'check_frenzy', to: 'barbed_refresh', type: 'yes', label: 'Y' },
      { from: 'check_frenzy', to: 'check_focus', type: 'no', label: 'N' },
      { from: 'barbed_refresh', to: 'main_loop', type: 'loop' },

      // 집중 체크
      { from: 'check_focus', to: 'cobra_shot', type: 'yes', label: 'Y' },
      { from: 'check_focus', to: 'check_killshot', type: 'no', label: 'N' },
      { from: 'cobra_shot', to: 'main_loop', type: 'loop' },

      // 킬샷
      { from: 'check_killshot', to: 'kill_shot', type: 'yes', label: 'Y' },
      { from: 'check_killshot', to: 'main_loop', type: 'no', label: 'N' },
      { from: 'kill_shot', to: 'main_loop', type: 'loop' }
    ]
  };

  const data = rotationData || defaultRotation;

  const handleNodeHover = (node, event) => {
    if (node) {
      const rect = event.currentTarget.getBoundingClientRect();
      const containerRect = event.currentTarget.closest('svg').getBoundingClientRect();
      setTooltipPos({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 10
      });
      setHoveredNode(node);
    } else {
      setHoveredNode(null);
    }
  };

  const renderNode = (node) => {
    const style = nodeStyles[node.type] || nodeStyles.action;
    const isDecision = node.type === 'decision';

    return (
      <g key={node.id}>
        {isDecision ? (
          // 다이아몬드 모양 (결정 노드)
          <polygon
            points={`${node.x},${node.y - 30} ${node.x + 60},${node.y} ${node.x},${node.y + 30} ${node.x - 60},${node.y}`}
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth="2"
            opacity="0.9"
            onMouseEnter={(e) => handleNodeHover(node, e)}
            onMouseLeave={() => handleNodeHover(null)}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          // 사각형 모양 (액션 노드)
          <rect
            x={node.x - 60}
            y={node.y - 25}
            width="120"
            height="50"
            rx={style.rx || 8}
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth="2"
            opacity="0.9"
            onMouseEnter={(e) => handleNodeHover(node, e)}
            onMouseLeave={() => handleNodeHover(null)}
            style={{ cursor: 'pointer' }}
          />
        )}

        {/* 텍스트 */}
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="12"
          fontWeight="600"
          style={{ pointerEvents: 'none' }}
        >
          {node.label.split('\n').map((line, i) => (
            <tspan key={i} x={node.x} dy={i === 0 ? 0 : 14}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  const renderEdge = (edge) => {
    const fromNode = data.nodes.find(n => n.id === edge.from);
    const toNode = data.nodes.find(n => n.id === edge.to);

    if (!fromNode || !toNode) return null;

    // 엣지 타입별 스타일
    const strokeColor = edge.type === 'yes' ? '#66bb6a' :
                       edge.type === 'no' ? '#ef5350' :
                       edge.type === 'loop' ? '#ab47bc' :
                       '#f4c430';

    const strokeDasharray = edge.type === 'loop' ? '5,5' : 'none';

    // 곡선 경로 계산
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const dr = Math.sqrt(dx * dx + dy * dy);

    // 루프백 엣지는 곡선으로
    const sweep = edge.type === 'loop' ? 1 : 0;

    return (
      <g key={`${edge.from}-${edge.to}`}>
        <path
          d={edge.type === 'loop' ?
            `M ${fromNode.x} ${fromNode.y + 25} A ${dr/2} ${dr/2} 0 0 ${sweep} ${toNode.x - 60} ${toNode.y}` :
            `M ${fromNode.x} ${fromNode.y + 25} L ${toNode.x} ${toNode.y - 30}`
          }
          stroke={strokeColor}
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          fill="none"
          markerEnd="url(#arrowhead)"
          opacity="0.8"
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
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              padding: '2px 4px',
              borderRadius: '4px'
            }}
          >
            {edge.label}
          </text>
        )}
      </g>
    );
  };

  return (
    <FlowchartContainer>
      <FlowchartTitle>🎯 로테이션 알고리즘 플로우차트</FlowchartTitle>

      <SVGContainer>
        <svg width="900" height="950" style={{ minWidth: '900px' }}>
          {/* 화살표 마커 정의 */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#f4c430"
              />
            </marker>

            {/* 그라디언트 정의 */}
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f4c430" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#c9a426" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* 배경 그리드 */}
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(244,196,48,0.05)" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* 엣지 렌더링 */}
          {data.edges.map(edge => renderEdge(edge))}

          {/* 노드 렌더링 */}
          {data.nodes.map(node => renderNode(node))}
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
          <span>결정</span>
        </LegendItem>
        <LegendItem>
          <LegendBox color={nodeStyles.action.fill} stroke={nodeStyles.action.stroke} />
          <span>주요 기술</span>
        </LegendItem>
        <LegendItem>
          <LegendBox color={nodeStyles.burst.fill} stroke={nodeStyles.burst.stroke} />
          <span>버스트</span>
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

      {/* 툴팁 */}
      <Tooltip visible={hoveredNode} x={tooltipPos.x} y={tooltipPos.y}>
        {hoveredNode && (
          <>
            <div style={{ fontWeight: 'bold', color: '#f4c430', marginBottom: '5px' }}>
              {hoveredNode.label}
            </div>
            <div>{hoveredNode.description}</div>
          </>
        )}
      </Tooltip>
    </FlowchartContainer>
  );
};

export default RotationFlowchart;