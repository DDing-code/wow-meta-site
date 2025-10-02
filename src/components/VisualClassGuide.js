import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { gameIcons, classIcons, WowIcon } from '../utils/wowIcons';
import { FaArrowRight } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
`;

const GuideHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const ClassTitle = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.color};
  margin-bottom: 0.5rem;
`;

const SpecSelector = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
`;

const SpecButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: ${props => props.active ? props.color : props.theme.colors.surface};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.color};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.color};
    color: white;
  }
`;

const FlowchartContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FlowchartTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.accent};
`;

const FlowChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`;

const FlowNode = styled(motion.div)`
  background: ${props => props.type === 'start' ? 'linear-gradient(135deg, #a6e3a1, #94e2d5)' :
                         props.type === 'decision' ? 'linear-gradient(135deg, #f9e2af, #fab387)' :
                         props.type === 'action' ? 'linear-gradient(135deg, #cba6f7, #f38ba8)' :
                         props.type === 'end' ? 'linear-gradient(135deg, #89dceb, #74c7ec)' :
                         props.theme.colors.secondary};
  padding: 1.5rem;
  border-radius: ${props => props.type === 'decision' ? '50px' : '10px'};
  color: ${props => props.type ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: 600;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  text-align: center;
`;

const FlowConnector = styled.div`
  width: 2px;
  height: 30px;
  background: ${props => props.theme.colors.accent};
  margin: 0 auto;
  position: relative;

  &::after {
    content: '▼';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    color: ${props => props.theme.colors.accent};
  }
`;

const DecisionBranch = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 1rem 0;
`;

const BranchLabel = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const PriorityList = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const PriorityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 10px;
  margin-bottom: 1rem;
  border-left: 4px solid ${props => props.color};
`;

const PriorityNumber = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.color};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
`;

const PriorityContent = styled.div`
  flex: 1;
`;

const PriorityTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.3rem;
`;

const PriorityCondition = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.subtext};
`;

const SimulatorContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ResourceBar = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const ResourceFill = styled.div`
  height: 30px;
  background: linear-gradient(90deg, ${props => props.color} 0%, ${props => props.color}dd 100%);
  border-radius: 5px;
  width: ${props => props.value}%;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const SkillBar = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const SkillButton = styled(motion.button)`
  padding: 1rem;
  background: ${props => props.ready ? props.color : props.theme.colors.secondary};
  color: ${props => props.ready ? 'white' : props.theme.colors.subtext};
  border: none;
  border-radius: 8px;
  cursor: ${props => props.ready ? 'pointer' : 'not-allowed'};
  font-weight: 600;
  position: relative;
  min-width: 120px;
  opacity: ${props => props.ready ? 1 : 0.5};

  ${props => props.cooldown && `
    &::after {
      content: '${props.cooldown}s';
      position: absolute;
      top: 2px;
      right: 2px;
      background: rgba(0, 0, 0, 0.5);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
    }
  `}
`;

const CombatLog = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: 10px;
  padding: 1rem;
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.9rem;
`;

const LogEntry = styled.div`
  padding: 0.3rem 0;
  color: ${props => props.type === 'damage' ? '#f38ba8' :
                     props.type === 'heal' ? '#a6e3a1' :
                     props.type === 'buff' ? '#cba6f7' :
                     props.theme.colors.subtext};
`;

const TipsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const TipCard = styled.div`
  display: flex;
  align-items: start;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const TipIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.color};
`;

const TipContent = styled.div``;

function VisualClassGuide({ classType = 'deathknight' }) {
  const [activeSpec, setActiveSpec] = useState(0);
  const [resources, setResources] = useState({
    runicPower: 45,
    runes: 4
  });
  const [combatLog, setCombatLog] = useState([]);

  const classData = {
    deathknight: {
      name: '죽음기사',
      color: '#C41E3A',
      specs: [
        {
          name: '혈기',
          role: 'tank',
          flowchart: {
            title: '혈기 죽음기사 탱킹 알고리즘',
            nodes: [
              { type: 'start', text: '전투 시작' },
              { type: 'action', text: '죽음과 부패 설치' },
              { type: 'decision', text: '뼈 보호막 < 7?' },
              { type: 'action', text: '골수 분쇄 사용', condition: 'yes' },
              { type: 'action', text: '피의 끓음 (광역)', condition: 'no' },
              { type: 'decision', text: '큰 피해 받음?' },
              { type: 'action', text: '죽음의 일격', condition: 'yes' },
              { type: 'action', text: '심장 강타', condition: 'no' },
              { type: 'end', text: '루프 반복' }
            ]
          },
          priority: [
            { number: 1, title: '뼈 보호막 유지', condition: '7중첩 이상 항상 유지', color: '#f38ba8' },
            { number: 2, title: '죽음과 부패', condition: '광역 탱킹시 바닥에 설치', color: '#fab387' },
            { number: 3, title: '피의 끓음', condition: '광역 어그로 및 피해', color: '#f9e2af' },
            { number: 4, title: '죽음의 일격', condition: 'HP 70% 이하 또는 룬 마력 90+', color: '#a6e3a1' },
            { number: 5, title: '심장 강타', condition: '룬 마력 생성 필요시', color: '#94e2d5' }
          ],
          tips: [
            {
              iconUrl: gameIcons.warning,
              color: '#f38ba8',
              title: '중요',
              content: '뼈 보호막이 떨어지지 않도록 항상 미리 준비하세요.'
            },
            {
              iconUrl: gameIcons.instant,
              color: '#f9e2af',
              title: '팁',
              content: '죽음의 일격은 최근 5초간 받은 피해의 25%를 치유합니다.'
            },
            {
              iconUrl: gameIcons.success,
              color: '#a6e3a1',
              title: '추천',
              content: '룬 무기 춤은 공격적으로 사용해도 안전합니다.'
            }
          ]
        },
        {
          name: '냉기',
          role: 'dps',
          flowchart: {
            title: '냉기 죽음기사 DPS 알고리즘',
            nodes: [
              { type: 'start', text: '전투 시작' },
              { type: 'action', text: '얼음 기둥 활성화' },
              { type: 'decision', text: '살상 기계 활성?' },
              { type: 'action', text: '절멸 사용', condition: 'yes' },
              { type: 'decision', text: '혹한 활성?', condition: 'no' },
              { type: 'action', text: '울부짖는 한파', condition: 'yes' },
              { type: 'decision', text: '룬 3개 이상?', condition: 'no' },
              { type: 'action', text: '절멸', condition: 'yes' },
              { type: 'action', text: '서리 일격', condition: 'no' },
              { type: 'end', text: '루프 반복' }
            ]
          },
          priority: [
            { number: 1, title: '살상 기계 소비', condition: '절멸 또는 냉기 돌풍으로 즉시', color: '#f38ba8' },
            { number: 2, title: '혹한 소비', condition: '울부짖는 한파로 즉시', color: '#fab387' },
            { number: 3, title: '절멸', condition: '룬 3개 이상일 때', color: '#f9e2af' },
            { number: 4, title: '서리 일격', condition: '룬 마력 70 이상', color: '#a6e3a1' },
            { number: 5, title: '울부짖는 한파', condition: '룬 마력 생성용', color: '#94e2d5' }
          ]
        },
        {
          name: '부정',
          role: 'dps',
          flowchart: {
            title: '부정 죽음기사 DPS 알고리즘',
            nodes: [
              { type: 'start', text: '전투 시작' },
              { type: 'action', text: '역병 적용 (발병)' },
              { type: 'action', text: '죽음과 부패 설치' },
              { type: 'decision', text: '고름 상처 < 4?' },
              { type: 'action', text: '고름 일격', condition: 'yes' },
              { type: 'decision', text: '종말 준비됨?', condition: 'no' },
              { type: 'action', text: '종말 시전', condition: 'yes' },
              { type: 'action', text: '죽음의 고리', condition: 'no' },
              { type: 'end', text: '루프 반복' }
            ]
          },
          priority: [
            { number: 1, title: '역병 유지', condition: '100% 유지 필수', color: '#f38ba8' },
            { number: 2, title: '죽음과 부패', condition: '쿨마다 사용', color: '#fab387' },
            { number: 3, title: '고름 일격', condition: '고름 상처 4-6 유지', color: '#f9e2af' },
            { number: 4, title: '종말', condition: '고름 상처 4+ 에서', color: '#a6e3a1' },
            { number: 5, title: '죽음의 고리', condition: '룬 마력 소비', color: '#94e2d5' }
          ]
        }
      ]
    }
  };

  const currentClass = classData[classType];
  const currentSpec = currentClass.specs[activeSpec];

  const simulateSkillUse = (skillName, cost, resourceType) => {
    const newLog = [...combatLog];
    const damage = Math.floor(Math.random() * 50000) + 30000;

    newLog.unshift({
      text: `[${new Date().toLocaleTimeString()}] ${skillName} - ${damage.toLocaleString()} 피해`,
      type: 'damage'
    });

    if (newLog.length > 10) newLog.pop();
    setCombatLog(newLog);

    // 자원 소비
    if (resourceType === 'runicPower') {
      setResources(prev => ({
        ...prev,
        runicPower: Math.max(0, prev.runicPower - cost)
      }));
    }
  };

  return (
    <Container>
      <GuideHeader>
        <ClassTitle color={currentClass.color}>
          {currentClass.name} 비주얼 가이드
        </ClassTitle>
      </GuideHeader>

      <SpecSelector>
        {currentClass.specs.map((spec, index) => (
          <SpecButton
            key={index}
            active={activeSpec === index}
            color={currentClass.color}
            onClick={() => setActiveSpec(index)}
          >
            {spec.name}
          </SpecButton>
        ))}
      </SpecSelector>

      <FlowchartContainer>
        <FlowchartTitle>{currentSpec.flowchart.title}</FlowchartTitle>
        <FlowChart>
          {currentSpec.flowchart.nodes.map((node, index) => (
            <React.Fragment key={index}>
              <FlowNode
                type={node.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {node.text}
              </FlowNode>
              {index < currentSpec.flowchart.nodes.length - 1 && <FlowConnector />}

              {node.type === 'decision' && index < currentSpec.flowchart.nodes.length - 2 && (
                <DecisionBranch>
                  <div>
                    <BranchLabel>예</BranchLabel>
                    <FlowNode type="action">
                      {currentSpec.flowchart.nodes[index + 1].text}
                    </FlowNode>
                  </div>
                  <div>
                    <BranchLabel>아니오</BranchLabel>
                    <FlowNode type="action">
                      {currentSpec.flowchart.nodes[index + 2]?.text || '다음 단계'}
                    </FlowNode>
                  </div>
                </DecisionBranch>
              )}
            </React.Fragment>
          ))}
        </FlowChart>
      </FlowchartContainer>

      <PriorityList>
        <FlowchartTitle>우선순위 시스템</FlowchartTitle>
        {currentSpec.priority.map((item, index) => (
          <PriorityItem
            key={index}
            color={item.color}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PriorityNumber color={item.color}>
              {item.number}
            </PriorityNumber>
            <PriorityContent>
              <PriorityTitle>{item.title}</PriorityTitle>
              <PriorityCondition>{item.condition}</PriorityCondition>
            </PriorityContent>
          </PriorityItem>
        ))}
      </PriorityList>

      <SimulatorContainer>
        <FlowchartTitle>로테이션 시뮬레이터</FlowchartTitle>

        <ResourceBar>
          <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>룬 마력</div>
          <ResourceFill color="#C41E3A" value={resources.runicPower}>
            {resources.runicPower}/100
          </ResourceFill>
        </ResourceBar>

        <ResourceBar>
          <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>룬</div>
          <ResourceFill color="#4A90E2" value={(resources.runes / 6) * 100}>
            {resources.runes}/6
          </ResourceFill>
        </ResourceBar>

        <SkillBar>
          <SkillButton
            color="#f38ba8"
            ready={resources.runes >= 2}
            onClick={() => simulateSkillUse('골수 분쇄', 2, 'runes')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            골수 분쇄
          </SkillButton>
          <SkillButton
            color="#fab387"
            ready={resources.runicPower >= 45}
            onClick={() => simulateSkillUse('죽음의 일격', 45, 'runicPower')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            죽음의 일격
          </SkillButton>
          <SkillButton
            color="#f9e2af"
            ready={true}
            onClick={() => simulateSkillUse('피의 끓음', 0, 'none')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            피의 끓음
          </SkillButton>
          <SkillButton
            color="#a6e3a1"
            ready={resources.runes >= 1}
            onClick={() => simulateSkillUse('심장 강타', 1, 'runes')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            심장 강타
          </SkillButton>
          <SkillButton
            color="#94e2d5"
            ready={false}
            cooldown={45}
            whileHover={{ scale: 1.05 }}
          >
            룬 무기 춤
          </SkillButton>
        </SkillBar>

        <CombatLog>
          {combatLog.length === 0 && (
            <LogEntry>스킬을 사용하여 로테이션을 연습하세요...</LogEntry>
          )}
          {combatLog.map((entry, index) => (
            <LogEntry key={index} type={entry.type}>
              {entry.text}
            </LogEntry>
          ))}
        </CombatLog>
      </SimulatorContainer>

      <TipsSection>
        <FlowchartTitle>프로 팁</FlowchartTitle>
        {currentSpec.tips?.map((tip, index) => (
          <TipCard key={index}>
            <TipIcon color={tip.color}>
              <WowIcon icon={tip.iconUrl} size={24} />
            </TipIcon>
            <TipContent>
              <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{tip.title}</div>
              <div style={{ fontSize: '0.95rem', color: '#a6adc8' }}>{tip.content}</div>
            </TipContent>
          </TipCard>
        ))}
      </TipsSection>
    </Container>
  );
}

export default VisualClassGuide;