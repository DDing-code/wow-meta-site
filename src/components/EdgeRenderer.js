import React, { useMemo } from 'react';
import styled from 'styled-components';

const SVGContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const EdgePath = styled.path`
  fill: none;
  stroke: ${props =>
    props.active ? '#AAD372' :
    props.partial ? 'rgba(170, 211, 114, 0.4)' :
    'rgba(100, 100, 100, 0.3)'
  };
  stroke-width: ${props => props.active ? 3 : 2};
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.3s ease, stroke-width 0.3s ease;
  filter: ${props => props.active ? 'drop-shadow(0 0 4px rgba(170, 211, 114, 0.6))' : 'none'};
`;

const EdgeArrow = styled.polygon`
  fill: ${props => props.active ? '#AAD372' : 'rgba(100, 100, 100, 0.5)'};
  transition: fill 0.3s ease;
`;

export const EdgeRenderer = ({
  edges,
  nodes,
  nodeStates,
  gridCellSize = 60,
  gridGap = 10
}) => {
  const paths = useMemo(() => {
    return edges.map((edge, index) => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];

      if (!fromNode || !toNode) return null;

      const fromState = nodeStates.get(edge.from);
      const toState = nodeStates.get(edge.to);

      // Calculate actual pixel positions
      const cellTotal = gridCellSize + gridGap;
      const nodeCenter = gridCellSize / 2;

      const fromX = fromNode.position.x * cellTotal + nodeCenter;
      const fromY = fromNode.position.y * cellTotal + nodeCenter;
      const toX = toNode.position.x * cellTotal + nodeCenter;
      const toY = toNode.position.y * cellTotal + nodeCenter;

      // Check activation status
      const fromActive = fromState && fromState.currentRank > 0;
      const toActive = toState && toState.currentRank > 0;
      const requiredRank = edge.requiredRank || 1;
      const meetsRequirement = fromState && fromState.currentRank >= requiredRank;

      const isActive = fromActive && toActive && meetsRequirement;
      const isPartial = fromActive && !toActive && meetsRequirement;

      // Calculate control points for curved path
      const dx = toX - fromX;
      const dy = toY - fromY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let path;
      const nodeRadius = 28; // Half of 56px node size

      if (Math.abs(dx) < 5) {
        // Vertical line
        path = `M ${fromX} ${fromY + nodeCenter} L ${toX} ${toY - nodeCenter}`;
      } else if (Math.abs(dy) < 5) {
        // Horizontal line
        path = `M ${fromX + nodeCenter} ${fromY} L ${toX - nodeCenter} ${toY}`;
      } else {
        // Curved path
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;

        // Offset for curve
        const curveOffset = distance * 0.2;
        const angle = Math.atan2(dy, dx);
        const perpAngle = angle + Math.PI / 2;

        const ctrlX = midX + Math.cos(perpAngle) * curveOffset * 0.5;
        const ctrlY = midY + Math.sin(perpAngle) * curveOffset * 0.5;

        // Adjust start and end points to account for node radius
        const startAngle = Math.atan2(toY - fromY, toX - fromX);
        const endAngle = startAngle + Math.PI;

        const startX = fromX + Math.cos(startAngle) * nodeRadius;
        const startY = fromY + Math.sin(startAngle) * nodeRadius;
        const endX = toX + Math.cos(endAngle) * nodeRadius;
        const endY = toY + Math.sin(endAngle) * nodeRadius;

        path = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
      }

      // Calculate arrow position
      const arrowSize = 8;
      const arrowAngle = Math.atan2(toY - fromY, toX - fromX);
      const arrowX = toX - Math.cos(arrowAngle) * (nodeRadius + 5);
      const arrowY = toY - Math.sin(arrowAngle) * (nodeRadius + 5);

      // Arrow points
      const arrow1X = arrowX - Math.cos(arrowAngle - 0.5) * arrowSize;
      const arrow1Y = arrowY - Math.sin(arrowAngle - 0.5) * arrowSize;
      const arrow2X = arrowX - Math.cos(arrowAngle + 0.5) * arrowSize;
      const arrow2Y = arrowY - Math.sin(arrowAngle + 0.5) * arrowSize;

      return (
        <g key={`edge-${edge.from}-${edge.to}-${index}`}>
          <EdgePath
            d={path}
            active={isActive}
            partial={isPartial}
          />
          {edge.type !== 'optional' && (
            <EdgeArrow
              points={`${arrowX},${arrowY} ${arrow1X},${arrow1Y} ${arrow2X},${arrow2Y}`}
              active={isActive || isPartial}
            />
          )}
        </g>
      );
    });
  }, [edges, nodes, nodeStates, gridCellSize, gridGap]);

  return (
    <SVGContainer>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {paths}
    </SVGContainer>
  );
};

// Alternative simpler version without styled-components
export const SimpleEdgeRenderer = ({
  edges,
  nodes,
  nodeStates,
  gridCellSize = 60,
  gridGap = 10
}) => {
  const paths = useMemo(() => {
    return edges.map((edge, index) => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];

      if (!fromNode || !toNode) return null;

      const fromState = nodeStates.get(edge.from);
      const toState = nodeStates.get(edge.to);

      const cellTotal = gridCellSize + gridGap;
      const nodeCenter = gridCellSize / 2;

      const fromX = fromNode.position.x * cellTotal + nodeCenter;
      const fromY = fromNode.position.y * cellTotal + nodeCenter;
      const toX = toNode.position.x * cellTotal + nodeCenter;
      const toY = toNode.position.y * cellTotal + nodeCenter;

      const fromActive = fromState && fromState.currentRank > 0;
      const toActive = toState && toState.currentRank > 0;
      const isActive = fromActive && toActive;

      const path = `M ${fromX} ${fromY} L ${toX} ${toY}`;

      return (
        <path
          key={`edge-${edge.from}-${edge.to}-${index}`}
          d={path}
          fill="none"
          stroke={isActive ? '#AAD372' : 'rgba(100, 100, 100, 0.3)'}
          strokeWidth={isActive ? 3 : 2}
          strokeLinecap="round"
          style={{
            transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
            filter: isActive ? 'drop-shadow(0 0 4px rgba(170, 211, 114, 0.6))' : 'none'
          }}
        />
      );
    });
  }, [edges, nodes, nodeStates, gridCellSize, gridGap]);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      {paths}
    </svg>
  );
};

export default EdgeRenderer;