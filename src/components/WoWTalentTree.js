import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
// TypeScript types removed for JavaScript compatibility
import { useTalentState } from '../hooks/useTalentState';
import talentDataSchema from '../data/talentTreeSchema.json';

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  background: linear-gradient(135deg, #AAD372 0%, #7FB347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #a0a0a0;
  font-size: 1.1rem;
`;

const TreesContainer = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
`;

const TreeSection = styled.div`
  flex: 1;
  min-width: 400px;
  max-width: 600px;
`;

const TreeTitle = styled.h3`
  color: #AAD372;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.3rem;
`;

const TreeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 60px);
  grid-template-rows: repeat(${props => props.rows}, 60px);
  gap: 10px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(170, 211, 114, 0.2);
  border-radius: 10px;
  position: relative;
  justify-content: center;
`;

const NodeWrapper = styled.div`
  grid-column: ${props => props.x + 1};
  grid-row: ${props => props.y + 1};
  position: relative;
`;

const getNodeShape = (shape) => {
  switch (shape) {
    case 'hex':
      return `
        clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
      `;
    case 'octagon':
      return `
        clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
      `;
    case 'star':
      return `
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
      `;
    case 'diamond':
      return `
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      `;
    case 'square':
      return `
        border-radius: 4px;
      `;
    default: // circle
      return `
        border-radius: 50%;
      `;
  }
};

const TalentNodeElement = styled(motion.div)`
  width: 56px;
  height: 56px;
  background: ${props => {
    if (props.selected) return 'radial-gradient(circle, rgba(170, 211, 114, 0.4), rgba(170, 211, 114, 0.2))';
    if (props.locked) return 'rgba(50, 50, 50, 0.5)';
    return 'rgba(255, 255, 255, 0.05)';
  }};
  border: 2px solid ${props => {
    if (props.selected) return '#AAD372';
    if (props.available) return 'rgba(170, 211, 114, 0.5)';
    if (props.locked) return 'rgba(100, 100, 100, 0.5)';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.locked ? 'not-allowed' : 'pointer'};
  position: relative;
  ${props => getNodeShape(props.shape)}

  &:hover {
    transform: ${props => !props.locked ? 'scale(1.1)' : 'none'};
    z-index: 10;
  }
`;

const NodeIcon = styled.img`
  width: 40px;
  height: 40px;
  filter: ${props => props.locked ? 'grayscale(1)' : 'none'};
  opacity: ${props => props.locked ? 0.5 : 1};
`;

const NodeRank = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.8);
  color: #AAD372;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: bold;
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  bottom: 65px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2a2a3e, #1a1a2e);
  border: 1px solid #AAD372;
  border-radius: 8px;
  padding: 12px;
  width: 280px;
  z-index: 1000;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 8px solid transparent;
    border-top-color: #AAD372;
  }
`;

const TooltipTitle = styled.h4`
  color: #AAD372;
  margin: 0 0 8px 0;
  font-size: 1rem;
`;

const TooltipDescription = styled.p`
  color: #e0e0e0;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
`;

const PointsDisplay = styled.div`
  text-align: center;
  margin: 20px 0;
  color: #e0e0e0;
  font-size: 1.1rem;
`;

const PointsBar = styled.div`
  width: 100%;
  max-width: 400px;
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  margin: 10px auto;
  overflow: hidden;
`;

const PointsFill = styled.div`
  width: ${props => props.percentage}%;
  height: 100%;
  background: linear-gradient(90deg, #AAD372, #7FB347);
  transition: width 0.3s ease;
`;

const BuildControls = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #AAD372, #7FB347);
  border: none;
  color: #1a1a2e;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(170, 211, 114, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BuildStringInput = styled.input`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(170, 211, 114, 0.3);
  color: #e0e0e0;
  padding: 10px 16px;
  border-radius: 6px;
  width: 300px;
  font-family: monospace;

  &:focus {
    outline: none;
    border-color: #AAD372;
  }
`;

// Edge drawing component
const EdgeSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

// Main Component
const WoWTalentTree = () => {
  // TODO: Load actual talent data from external source
  const talentData = talentDataSchema;

  const [hoveredNode, setHoveredNode] = useState(null);
  const [buildString, setBuildString] = useState('');

  // Use talent state hooks for both trees
  const classTreeState = useTalentState(talentData.classTalentTree);
  const specTreeState = useTalentState(talentData.specTalentTree);

  const handleNodeClick = useCallback((nodeId, tree) => {
    if (tree === 'class') {
      classTreeState.toggleRank(nodeId);
    } else {
      specTreeState.toggleRank(nodeId);
    }
  }, [classTreeState, specTreeState]);

  // Build management functions
  const handleExportBuild = useCallback(() => {
    const classBuild = classTreeState.serialize();
    const specBuild = specTreeState.serialize();
    const combinedBuild = btoa(JSON.stringify({
      class: classBuild,
      spec: specBuild
    }));
    setBuildString(combinedBuild);
  }, [classTreeState, specTreeState]);

  const handleImportBuild = useCallback(() => {
    try {
      const decoded = JSON.parse(atob(buildString));
      if (decoded.class) {
        classTreeState.deserialize(decoded.class);
      }
      if (decoded.spec) {
        specTreeState.deserialize(decoded.spec);
      }
    } catch (error) {
      console.error('Failed to import build:', error);
    }
  }, [buildString, classTreeState, specTreeState]);

  const handleResetAll = useCallback(() => {
    classTreeState.reset();
    specTreeState.reset();
    setBuildString('');
  }, [classTreeState, specTreeState]);

  const renderTalentNode = useCallback((node, tree) => {
    const treeState = tree === 'class' ? classTreeState : specTreeState;
    const nodeState = treeState.state.nodes.get(node.id);
    const isSelected = nodeState ? nodeState.currentRank > 0 : false;
    const isHovered = hoveredNode === node.id;
    const canAllocate = treeState.canAllocate(node.id);
    const canDeallocate = treeState.canDeallocate(node.id);

    return (
      <NodeWrapper key={node.id} x={node.position.x} y={node.position.y}>
        <TalentNodeElement
          shape={node.shape}
          selected={isSelected}
          available={canAllocate || isSelected}
          locked={!canAllocate && !isSelected}
          onClick={() => handleNodeClick(node.id, tree)}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          whileHover={{ scale: canAllocate || canDeallocate ? 1.1 : 1 }}
          whileTap={{ scale: canAllocate || canDeallocate ? 0.95 : 1 }}
        >
          <NodeIcon
            src={`https://wow.zamimg.com/images/wow/icons/large/${node.icon}.jpg`}
            alt={node.name}
            locked={!canAllocate && !isSelected}
            onError={(e) => {
              // Fallback to question mark icon if image fails to load
              e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
            }}
          />
          {node.maxRank > 1 && nodeState && (
            <NodeRank>{nodeState.currentRank}/{node.maxRank}</NodeRank>
          )}
        </TalentNodeElement>

        <AnimatePresence>
          {isHovered && (
            <Tooltip
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <TooltipTitle>{node.name}</TooltipTitle>
              <TooltipDescription>{node.description}</TooltipDescription>
            </Tooltip>
          )}
        </AnimatePresence>
      </NodeWrapper>
    );
  }, [hoveredNode, handleNodeClick, classTreeState, specTreeState]);

  const renderTalentTree = useCallback((tree, treeType) => {
    const treeState = treeType === 'class' ? classTreeState : specTreeState;

    return (
      <TreeSection>
        <TreeTitle>
          {treeType === 'class' ? 'Class Talents' : 'Specialization Talents'}
        </TreeTitle>
        <TreeGrid rows={tree.config.gridSize.rows} cols={tree.config.gridSize.cols}>
          {/* TODO: Render edges/connections between nodes */}
          <EdgeSVG>
            {tree.edges.map((edge, idx) => {
              // TODO: Calculate proper edge positions based on node positions
              return null;
            })}
          </EdgeSVG>

          {tree.nodes.map(node => renderTalentNode(node, treeType))}
        </TreeGrid>
        <PointsDisplay>
          Points: {treeState.state.totalPoints} / {tree.config.maxPoints}
        </PointsDisplay>
        <PointsBar>
          <PointsFill percentage={(treeState.state.totalPoints / tree.config.maxPoints) * 100} />
        </PointsBar>
      </TreeSection>
    );
  }, [renderTalentNode, classTreeState, specTreeState]);

  return (
    <Container>
      <Header>
        <Title>Talent Calculator</Title>
        <Subtitle>
          {talentData.metadata.class} - {talentData.metadata.spec}
        </Subtitle>
      </Header>

      <TreesContainer>
        {renderTalentTree(talentData.classTalentTree, 'class')}
        {renderTalentTree(talentData.specTalentTree, 'spec')}
      </TreesContainer>

      <BuildControls>
        <Button onClick={handleResetAll}>Reset All</Button>
        <Button onClick={handleExportBuild}>Export Build</Button>
        <BuildStringInput
          type="text"
          placeholder="Build string..."
          value={buildString}
          onChange={(e) => setBuildString(e.target.value)}
        />
        <Button onClick={handleImportBuild}>Import Build</Button>
      </BuildControls>

      {/* TODO: Add hero talent selection */}
      {/* TODO: Connect to actual game data API */}
    </Container>
  );
};

export default WoWTalentTree;