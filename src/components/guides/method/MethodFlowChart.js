// ============================================================
// Method.gg 스타일 FlowChart - 분기형 결정 트리
// ============================================================
// Maxroll 스타일의 시각적 플로우차트
// - 조건 노드: 다이아몬드 (마나%, 버프 등)
// - 액션 노드: 사각형 (스킬 사용)
// - Method.gg 미니멀 디자인
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// ============================================================
// Styled Components
// ============================================================

const FlowChartContainer = styled.div`
  width: 100%;
  padding: 2rem;
  background: ${props => props.theme.colors.background.surface};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  margin: 1.5rem 0;
  overflow-x: auto;
`;

const FlowChartTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const FlowChartSVG = styled.svg`
  width: 100%;
  min-height: 400px;
  display: block;
`;

// 조건 노드 (다이아몬드)
const ConditionNode = styled.g`
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover polygon {
    fill: ${props => props.theme.colors.background.elevated};
  }

  polygon {
    fill: ${props => props.theme.colors.background.surface};
    stroke: ${props => props.theme.colors.accent.blue};
    stroke-width: 2;
  }

  text {
    fill: ${props => props.theme.colors.text.primary};
    font-size: 13px;
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    text-anchor: middle;
    dominant-baseline: middle;
  }
`;

// 액션 노드 (사각형)
const ActionNode = styled.g`
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover rect {
    fill: ${props => props.theme.colors.background.elevated};
  }

  rect {
    fill: ${props => props.theme.colors.background.surface};
    stroke: ${props => props.theme.colors.border.default};
    stroke-width: 2;
    rx: 4;
  }

  text {
    fill: ${props => props.theme.colors.text.primary};
    font-size: 14px;
    text-anchor: middle;
    dominant-baseline: middle;
  }
`;

// 화살표
const Arrow = styled.line`
  stroke: ${props => props.theme.colors.border.default};
  stroke-width: 2;
  marker-end: url(#arrowhead);
`;

// 화살표 라벨
const ArrowLabel = styled.text`
  fill: ${props => props.theme.colors.text.secondary};
  font-size: 12px;
  text-anchor: middle;
`;

// ============================================================
// Main Component
// ============================================================

/**
 * MethodFlowChart - 분기형 결정 트리 플로우차트
 *
 * @param {string} title - 플로우차트 제목
 * @param {Array} nodes - 노드 배열
 *   [{type: 'condition'|'action', x, y, width, height, text}]
 * @param {Array} connections - 연결 배열
 *   [{from: nodeIndex, to: nodeIndex, label: '예/아니오'}]
 */
const MethodFlowChart = ({ title, nodes = [], connections = [] }) => {
  // SVG 크기 자동 계산
  const maxX = Math.max(...nodes.map(n => n.x + (n.width || 100)));
  const maxY = Math.max(...nodes.map(n => n.y + (n.height || 60)));
  const svgWidth = maxX + 100;
  const svgHeight = maxY + 100;

  // 다이아몬드 포인트 생성
  const getDiamondPoints = (x, y, width, height) => {
    const points = [
      `${x},${y - height/2}`,           // 상단
      `${x + width/2},${y}`,            // 우측
      `${x},${y + height/2}`,           // 하단
      `${x - width/2},${y}`             // 좌측
    ];
    return points.join(' ');
  };

  // 텍스트 줄바꿈
  const splitText = (text, maxLength = 15) => {
    if (text.length <= maxLength) return [text];

    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  return (
    <FlowChartContainer>
      {title && <FlowChartTitle>{title}</FlowChartTitle>}

      <FlowChartSVG
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 화살표 마커 정의 */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="#3F3F46"
            />
          </marker>
        </defs>

        {/* 연결선 먼저 그리기 */}
        {connections.map((conn, idx) => {
          const fromNode = nodes[conn.from];
          const toNode = nodes[conn.to];

          if (!fromNode || !toNode) return null;

          // 시작/끝 좌표 계산
          const x1 = fromNode.x;
          const y1 = fromNode.y + (fromNode.height || 60) / 2;
          const x2 = toNode.x;
          const y2 = toNode.y - (toNode.height || 60) / 2;

          return (
            <g key={`conn-${idx}`}>
              <Arrow
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
              />
              {conn.label && (
                <ArrowLabel
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 10}
                >
                  {conn.label}
                </ArrowLabel>
              )}
            </g>
          );
        })}

        {/* 노드 그리기 */}
        {nodes.map((node, idx) => {
          const textLines = splitText(node.text);
          const lineHeight = 16;
          const textStartY = node.y - ((textLines.length - 1) * lineHeight) / 2;

          if (node.type === 'condition') {
            // 조건 노드 (다이아몬드)
            return (
              <ConditionNode key={`node-${idx}`}>
                <polygon
                  points={getDiamondPoints(
                    node.x,
                    node.y,
                    node.width || 120,
                    node.height || 80
                  )}
                />
                {textLines.map((line, lineIdx) => (
                  <text
                    key={`text-${idx}-${lineIdx}`}
                    x={node.x}
                    y={textStartY + lineIdx * lineHeight}
                  >
                    {line}
                  </text>
                ))}
              </ConditionNode>
            );
          } else {
            // 액션 노드 (사각형)
            return (
              <ActionNode key={`node-${idx}`}>
                <rect
                  x={node.x - (node.width || 100) / 2}
                  y={node.y - (node.height || 60) / 2}
                  width={node.width || 100}
                  height={node.height || 60}
                />
                {textLines.map((line, lineIdx) => (
                  <text
                    key={`text-${idx}-${lineIdx}`}
                    x={node.x}
                    y={textStartY + lineIdx * lineHeight}
                  >
                    {line}
                  </text>
                ))}
              </ActionNode>
            );
          }
        })}
      </FlowChartSVG>
    </FlowChartContainer>
  );
};

MethodFlowChart.propTypes = {
  title: PropTypes.string,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['condition', 'action']).isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number,
      height: PropTypes.number,
      text: PropTypes.string.isRequired
    })
  ).isRequired,
  connections: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.number.isRequired,
      to: PropTypes.number.isRequired,
      label: PropTypes.string
    })
  ).isRequired
};

export default MethodFlowChart;
