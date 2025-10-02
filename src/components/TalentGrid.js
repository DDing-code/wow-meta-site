import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTalentState } from '../hooks/useTalentState';
import EdgeRenderer from './EdgeRenderer';

// Individual Tree Grid Component
const GridContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 60px);
  grid-template-rows: repeat(${props => props.rows}, 60px);
  gap: 10px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  border: 1px solid rgba(170, 211, 114, 0.2);
  border-radius: 10px;
  min-height: ${props => props.rows * 70 + 40}px;
`;

const NodeSlot = styled.div`
  grid-column: ${props => props.x + 1};
  grid-row: ${props => props.y + 1};
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
  transition: all 0.3s ease;

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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

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

const TreeHeader = styled.div`
  text-align: center;
  margin-bottom: 15px;
`;

const TreeTitle = styled.h3`
  color: #AAD372;
  font-size: 1.3rem;
  margin: 0;
`;

const PointsDisplay = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const TreeWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

// Full System Layout
const SystemContainer = styled.div`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

const TreeLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 30px;
  align-items: start;
`;

const HeroTalentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  min-width: 300px;
`;

const HeroTalentTitle = styled.h3`
  color: #FFD700;
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const HeroTalentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(4, 50px);
  gap: 8px;
`;

const BuildControls = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
  flex-wrap: wrap;
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

function getNodeShape(shape) {
  switch (shape) {
    case 'hex':
      return `clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);`;
    case 'octagon':
      return `clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);`;
    case 'star':
      return `clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);`;
    case 'diamond':
      return `clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);`;
    case 'square':
      return `border-radius: 4px;`;
    default:
      return `border-radius: 50%;`;
  }
}

export const TalentGrid = ({
  tree,
  treeType,
  onChange,
  onNodeHover
}) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const talentState = useTalentState(tree);

  const handleNodeClick = useCallback((nodeId) => {
    talentState.toggleRank(nodeId);
    if (onChange) {
      onChange(talentState.state);
    }
  }, [talentState, onChange]);

  const nodesMap = useMemo(() => {
    const map = {};
    tree.nodes.forEach(node => {
      map[node.id] = node;
    });
    return map;
  }, [tree.nodes]);

  return (
    <TreeWrapper>
      <TreeHeader>
        <TreeTitle>
          {treeType === 'class' ? 'Class Talents' : 'Specialization Talents'}
        </TreeTitle>
        <PointsDisplay>
          Points: {talentState.state.totalPoints} / {tree.config.maxPoints}
        </PointsDisplay>
      </TreeHeader>

      <GridContainer
        rows={tree.config.gridSize.rows}
        cols={tree.config.gridSize.cols}
      >
        <EdgeRenderer
          edges={tree.edges}
          nodes={nodesMap}
          nodeStates={talentState.state.nodes}
        />

        {tree.nodes.map(node => {
          const nodeState = talentState.state.nodes.get(node.id);
          const isSelected = nodeState ? nodeState.currentRank > 0 : false;
          const canAllocate = talentState.canAllocate(node.id);
          const isHovered = hoveredNode === node.id;

          return (
            <NodeSlot key={node.id} x={node.position.x} y={node.position.y}>
              <TalentNodeElement
                shape={node.shape}
                selected={isSelected}
                available={canAllocate || isSelected}
                locked={!canAllocate && !isSelected}
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => {
                  setHoveredNode(node.id);
                  if (onNodeHover) onNodeHover(node);
                }}
                onMouseLeave={() => {
                  setHoveredNode(null);
                  if (onNodeHover) onNodeHover(null);
                }}
                whileHover={{ scale: canAllocate || isSelected ? 1.1 : 1 }}
                whileTap={{ scale: canAllocate || isSelected ? 0.95 : 1 }}
              >
                <NodeIcon
                  src={`https://wow.zamimg.com/images/wow/icons/large/${node.icon}.jpg`}
                  alt={node.name}
                  locked={!canAllocate && !isSelected}
                  onError={(e) => {
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
            </NodeSlot>
          );
        })}
      </GridContainer>
    </TreeWrapper>
  );
};

export const FullTalentSystem = ({
  talentData,
  onBuildChange
}) => {
  const [buildString, setBuildString] = useState('');
  const [selectedHeroTree, setSelectedHeroTree] = useState('pack_leader');

  const classTreeState = useTalentState(talentData.classTalentTree);
  const specTreeState = useTalentState(talentData.specTalentTree);

  const handleExportBuild = useCallback(() => {
    const build = {
      class: classTreeState.serialize(),
      spec: specTreeState.serialize(),
      hero: selectedHeroTree
    };
    setBuildString(btoa(JSON.stringify(build)));
  }, [classTreeState, specTreeState, selectedHeroTree]);

  const handleImportBuild = useCallback(() => {
    try {
      const decoded = JSON.parse(atob(buildString));
      if (decoded.class) classTreeState.deserialize(decoded.class);
      if (decoded.spec) specTreeState.deserialize(decoded.spec);
      if (decoded.hero) setSelectedHeroTree(decoded.hero);
    } catch (error) {
      console.error('Failed to import build:', error);
    }
  }, [buildString, classTreeState, specTreeState]);

  const handleResetAll = useCallback(() => {
    classTreeState.reset();
    specTreeState.reset();
    setBuildString('');
  }, [classTreeState, specTreeState]);

  return (
    <SystemContainer>
      <TreeLayout>
        <TalentGrid
          tree={talentData.classTalentTree}
          treeType="class"
          onChange={(state) => onBuildChange?.({ class: state })}
        />

        <HeroTalentSection>
          <HeroTalentTitle>Hero Talents</HeroTalentTitle>
          <HeroTalentGrid>
            {/* Placeholder for hero talents */}
            <div style={{ gridColumn: '1/4', textAlign: 'center', color: '#888' }}>
              Hero talents coming soon
            </div>
          </HeroTalentGrid>
        </HeroTalentSection>

        <TalentGrid
          tree={talentData.specTalentTree}
          treeType="spec"
          onChange={(state) => onBuildChange?.({ spec: state })}
        />
      </TreeLayout>

      <BuildControls>
        <Button onClick={handleResetAll}>Reset All</Button>
        <Button onClick={handleExportBuild}>Export Build</Button>
        <BuildStringInput
          value={buildString}
          onChange={(e) => setBuildString(e.target.value)}
          placeholder="Build string..."
        />
        <Button onClick={handleImportBuild}>Import Build</Button>
      </BuildControls>
    </SystemContainer>
  );
};

export default TalentGrid;