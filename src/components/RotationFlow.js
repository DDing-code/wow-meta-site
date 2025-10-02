import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { WowIcon, getWowIcon } from '../utils/wowIcons';

const Container = styled.div`
  margin: 2rem 0;
`;

const Title = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RotationContainer = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow-x: auto;
`;

const RotationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  min-width: fit-content;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PhaseLabel = styled.div`
  min-width: 120px;
  font-weight: 600;
  color: ${props => props.theme.colors.accent};
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary};
  border-radius: 8px;
  text-align: center;
  border: 2px solid ${props => props.theme.colors.accent};
`;

const SkillFlow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const SkillBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

const SkillIconWrapper = styled.div`
  position: relative;
  width: 52px;
  height: 52px;
  border: 2px solid ${props => props.priority === 'high' ? '#f38ba8' : props.priority === 'medium' ? '#f9e2af' : '#a6e3a1'};
  border-radius: 8px;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }
`;

const SkillName = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.subtext};
  margin-top: 0.3rem;
  text-align: center;
  max-width: 70px;
  line-height: 1.2;
`;

const Arrow = styled.div`
  color: ${props => props.theme.colors.subtext};
  font-size: 1.5rem;
  margin: 0 0.3rem;
`;

const RepeatIndicator = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f38ba8;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
`;

const Condition = styled.div`
  background: ${props => props.theme.colors.overlay};
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.warning};
  margin: 0 0.5rem;
`;

const Legend = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.overlay};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${props => props.color};
  border-radius: 3px;
`;

const BurstWindow = styled.div`
  background: linear-gradient(135deg, rgba(243, 139, 168, 0.2), rgba(203, 166, 247, 0.2));
  border: 2px dashed ${props => props.theme.colors.accent};
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  &:before {
    content: '버스트';
    position: absolute;
    top: -10px;
    left: 10px;
    background: ${props => props.theme.colors.secondary};
    padding: 0 0.5rem;
    font-size: 0.75rem;
    color: ${props => props.theme.colors.accent};
    font-weight: 600;
  }
`;

const LoopIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.overlay};
  border-radius: 8px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TooltipContent = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.accent};
  border-radius: 8px;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  z-index: 100;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: none;

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${props => props.theme.colors.surface};
  }
`;

const TooltipTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.3rem;
`;

const TooltipDescription = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
  line-height: 1.4;
`;

function RotationFlow({ rotation, className, specName }) {
  const [hoveredSkill, setHoveredSkill] = React.useState(null);

  if (!rotation) {
    return null;
  }

  return (
    <Container>
      <Title>🎯 로테이션 플로우 차트</Title>

      <RotationContainer>
        {/* 오프너 단계 */}
        <RotationRow>
          <PhaseLabel>오프너</PhaseLabel>
          <SkillFlow>
            <BurstWindow>
              {rotation.opener?.skills?.map((skill, index) => (
                <React.Fragment key={index}>
                  <SkillBlock
                    onMouseEnter={() => setHoveredSkill(`opener-${index}`)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    whileHover={{ y: -5 }}
                  >
                    <SkillIconWrapper priority={skill.priority || 'high'}>
                      <WowIcon icon={getWowIcon(skill.icon)} size={48} />
                      {skill.repeat && <RepeatIndicator>{skill.repeat}x</RepeatIndicator>}
                    </SkillIconWrapper>
                    <SkillName>{skill.name}</SkillName>

                    {hoveredSkill === `opener-${index}` && (
                      <TooltipContent
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <TooltipTitle>{skill.name}</TooltipTitle>
                        <TooltipDescription>{skill.usage}</TooltipDescription>
                      </TooltipContent>
                    )}
                  </SkillBlock>
                  {index < rotation.opener.skills.length - 1 && <Arrow>→</Arrow>}
                </React.Fragment>
              ))}
            </BurstWindow>
          </SkillFlow>
        </RotationRow>

        {/* 메인 로테이션 */}
        <RotationRow>
          <PhaseLabel>메인 로테</PhaseLabel>
          <SkillFlow>
            {rotation.main?.skills?.map((skill, index) => (
              <React.Fragment key={index}>
                {skill.condition && <Condition>{skill.condition}</Condition>}
                <SkillBlock
                  onMouseEnter={() => setHoveredSkill(`main-${index}`)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  whileHover={{ y: -5 }}
                >
                  <SkillIconWrapper priority={skill.priority || 'medium'}>
                    <WowIcon icon={getWowIcon(skill.icon)} size={48} />
                    {skill.stacks && <RepeatIndicator>{skill.stacks}</RepeatIndicator>}
                  </SkillIconWrapper>
                  <SkillName>{skill.name}</SkillName>

                  {hoveredSkill === `main-${index}` && (
                    <TooltipContent
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <TooltipTitle>{skill.name}</TooltipTitle>
                      <TooltipDescription>{skill.usage}</TooltipDescription>
                    </TooltipContent>
                  )}
                </SkillBlock>
                {index < rotation.main.skills.length - 1 &&
                  (skill.loop ?
                    <LoopIndicator>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                      </svg>
                      반복
                    </LoopIndicator> :
                    <Arrow>→</Arrow>
                  )
                }
              </React.Fragment>
            ))}
          </SkillFlow>
        </RotationRow>

        {/* AoE 로테이션 */}
        {rotation.aoe && (
          <RotationRow>
            <PhaseLabel>광역 (3+)</PhaseLabel>
            <SkillFlow>
              {rotation.aoe?.skills?.map((skill, index) => (
                <React.Fragment key={index}>
                  <SkillBlock
                    onMouseEnter={() => setHoveredSkill(`aoe-${index}`)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    whileHover={{ y: -5 }}
                  >
                    <SkillIconWrapper priority={skill.priority || 'low'}>
                      <WowIcon icon={getWowIcon(skill.icon)} size={48} />
                    </SkillIconWrapper>
                    <SkillName>{skill.name}</SkillName>

                    {hoveredSkill === `aoe-${index}` && (
                      <TooltipContent
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <TooltipTitle>{skill.name}</TooltipTitle>
                        <TooltipDescription>{skill.usage}</TooltipDescription>
                      </TooltipContent>
                    )}
                  </SkillBlock>
                  {index < rotation.aoe.skills.length - 1 && <Arrow>→</Arrow>}
                </React.Fragment>
              ))}
            </SkillFlow>
          </RotationRow>
        )}

        {/* 쿨다운 우선순위 */}
        <RotationRow>
          <PhaseLabel>쿨다운</PhaseLabel>
          <SkillFlow>
            {rotation.cooldowns?.map((cd, index) => (
              <React.Fragment key={index}>
                <SkillBlock
                  onMouseEnter={() => setHoveredSkill(`cd-${index}`)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  whileHover={{ y: -5 }}
                >
                  <SkillIconWrapper priority="high">
                    <WowIcon icon={getWowIcon(cd.icon)} size={48} />
                  </SkillIconWrapper>
                  <SkillName>{cd.name}</SkillName>

                  {hoveredSkill === `cd-${index}` && (
                    <TooltipContent
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <TooltipTitle>{cd.name}</TooltipTitle>
                      <TooltipDescription>{cd.usage}</TooltipDescription>
                    </TooltipContent>
                  )}
                </SkillBlock>
                {index < rotation.cooldowns.length - 1 && <Arrow>{'>'}</Arrow>}
              </React.Fragment>
            ))}
          </SkillFlow>
        </RotationRow>
      </RotationContainer>

      <Legend>
        <LegendItem>
          <LegendColor color="#f38ba8" />
          <span>높은 우선순위</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#f9e2af" />
          <span>중간 우선순위</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#a6e3a1" />
          <span>낮은 우선순위</span>
        </LegendItem>
        <LegendItem>
          <span>🔄 반복</span>
        </LegendItem>
        <LegendItem>
          <span>⚡ 조건부</span>
        </LegendItem>
      </Legend>
    </Container>
  );
}

export default RotationFlow;