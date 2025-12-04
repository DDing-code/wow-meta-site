import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Tabs, Tab } from '@mui/material';
import SkillIcon from '../../SkillIcon';
import { colorSystem, typography, borderRadius, transitions, motionVariants, springConfigs } from '../../../styles/designSystem';

// 가이드 로테이션 모듈
// Props로 영웅 특성별 로테이션 데이터를 받아 자동 렌더링

const SectionTitle = styled.h2`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${props => props.color || colorSystem.primary.main};
  margin: 0 0 20px 0;
  border-bottom: 1px solid ${props => props.color || colorSystem.primary.main};
  padding-bottom: 12px;
`;

// MUI Tabs 커스터마이징 (블로그 스타일)
const StyledTabs = styled(Tabs)`
  margin-bottom: 2rem;

  & .MuiTabs-indicator {
    background-color: ${props => props.customcolor || '#A330C9'};
    height: 3px;
  }

  & .MuiTabs-flexContainer {
    gap: 0.5rem;
  }
`;

const StyledTab = styled(motion(Tab))`
  && {
    color: ${colorSystem.text.secondary};
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.medium};
    text-transform: none;
    padding: 0.75rem 1.5rem;
    border: 1px solid ${props => props.customcolor || colorSystem.primary.main};
    border-radius: ${borderRadius.DEFAULT};
    margin: 0;
    min-height: auto;
    /* Framer Motion handles transitions - CSS transition removed */

    &.Mui-selected {
      color: ${colorSystem.text.primary};
      background: ${props => props.customcolor || colorSystem.primary.main};
      font-weight: ${typography.fontWeight.semibold};
    }

    /* Hover handled by Framer Motion whileHover prop */
  }
`;

const Card = styled(motion.div)`
  background: ${colorSystem.background.surface};
  border: 1px solid ${colorSystem.border.muted};
  border-radius: ${borderRadius.DEFAULT};
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
`;

const HeroCard = styled(Card)`
  background: ${props => {
    if (props.heroKey === 'aldrachireaver') {
      return 'linear-gradient(180deg, rgba(147, 51, 234, 0.05) 0%, rgba(147, 51, 234, 0.1) 100%)';
    } else if (props.heroKey === 'felscarred') {
      return 'linear-gradient(180deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.1) 100%)';
    }
    return colorSystem.background.surface;
  }};
  border: 1px solid ${props => {
    if (props.heroKey === 'aldrachireaver') {
      return colorSystem.primary.glow;
    } else if (props.heroKey === 'felscarred') {
      return colorSystem.secondary.glow;
    }
    return '#2a2a3e';
  }};
`;

const TierSetSection = styled.div`
  background: linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%);
  border: 2px solid #ffa500;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
`;

const TierSetTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffa500;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;

  &:before {
    content: '⚡';
    font-size: 1.8rem;
  }
`;

const TierSetItem = styled.div`
  background: rgba(255, 165, 0, 0.08);
  border-left: 4px solid #ffa500;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TierSetName = styled.h4`
  font-size: 1.2rem;
  color: #ffa500;
  margin: 0 0 10px 0;
  font-weight: bold;
`;

const TierSetDescription = styled.div`
  font-size: 1rem;
  color: #e0e0e0;
  line-height: 1.7;

  strong {
    color: #ffa500;
    font-weight: bold;
  }

  ul {
    margin: 10px 0;
    padding-left: 20px;

    li {
      margin-bottom: 8px;
    }
  }
`;

const SubTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffa500;
  margin: 20px 0 12px 0;
`;

const OpenerSequence = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin: 15px 0;
`;

const SkillStep = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StepNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.color || '#A330C9'};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
`;

const Arrow = styled.div`
  color: ${props => props.color || '#A330C9'};
  font-size: 1.5rem;
  margin: 0 5px;
`;

const PriorityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
`;

const PriorityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: rgba(255,255,255,0.03);
  border-left: 4px solid ${props => {
    if (props.priority === 0) return '#ff4444';
    if (props.priority === 1) return '#ff9800';
    if (props.priority === 2) return '#ffc107';
    return '#4caf50';
  }};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.08);
    transform: translateX(5px);
  }
`;

const PriorityNumber = styled.div`
  flex-shrink: 0;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${props => {
    if (props.priority === 0) return '#ff4444';
    if (props.priority === 1) return '#ff9800';
    if (props.priority === 2) return '#ffc107';
    return '#4caf50';
  }};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const PriorityContent = styled.div`
  flex: 1;
`;

const PriorityTitle = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
`;

const PriorityCondition = styled.div`
  font-size: 0.9rem;
  color: #ffa500;
  margin-bottom: 5px;
`;

const PriorityDescription = styled.div`
  font-size: 0.95rem;
  color: #a0a0a0;
  line-height: 1.5;
`;

export default function GuideRotation({
  data,
  skillData,
  color = '#A330C9',
  heroTalentNames = {}
}) {
  // React Hooks는 항상 최상위에서 호출
  const heroTalents = data ? Object.keys(data).filter(key => key !== 'tierSet') : [];
  const [selectedHero, setSelectedHero] = useState(heroTalents[0] || '');

  // 조건부 렌더링은 Hooks 호출 이후
  if (!data) return null;

  const currentRotation = selectedHero && data[selectedHero] ? data[selectedHero] : null;
  const tierSetData = data.tierSet || null;

  // 단일 대상 및 AoE 데이터 추출
  const singleTarget = currentRotation?.singleTarget || null;
  const aoe = currentRotation?.aoe || null;

  return (
    <>
      <SectionTitle color={color}>딜사이클</SectionTitle>

      {/* 티어 세트 효과 섹션 */}
      {tierSetData && (
        <TierSetSection>
          <TierSetTitle>시즌 3 티어 세트 효과</TierSetTitle>

          {tierSetData['2set'] && (
            <TierSetItem>
              <TierSetName>2세트: {tierSetData['2set'].name}</TierSetName>
              <TierSetDescription
                dangerouslySetInnerHTML={{ __html: tierSetData['2set'].description }}
              />
            </TierSetItem>
          )}

          {tierSetData['4set'] && (
            <TierSetItem>
              <TierSetName>4세트: {tierSetData['4set'].name}</TierSetName>
              <TierSetDescription
                dangerouslySetInnerHTML={{ __html: tierSetData['4set'].description }}
              />
            </TierSetItem>
          )}
        </TierSetSection>
      )}

      {/* 영웅 특성 탭 - MUI Tabs */}
      {currentRotation && (
      <>
      <StyledTabs
        value={heroTalents.indexOf(selectedHero)}
        onChange={(event, newValue) => setSelectedHero(heroTalents[newValue])}
        customcolor={color}
        variant="scrollable"
        scrollButtons="auto"
      >
        {heroTalents.map(heroKey => (
          <StyledTab
            key={heroKey}
            label={heroTalentNames[heroKey] || heroKey}
            customcolor={color}
            whileHover={motionVariants.tab.hover}
            whileTap={motionVariants.tab.tap}
            transition={springConfigs.snappy}
          />
        ))}
      </StyledTabs>

      {/* 단일 대상 */}
      {singleTarget && (
        <HeroCard
          heroKey={selectedHero}
          initial="rest"
          whileHover="hover"
          variants={motionVariants.heroCard}
          transition={springConfigs.responsive}
        >
          <SubTitle>단일 대상</SubTitle>

          {/* 오프닝 */}
          {singleTarget.opener && singleTarget.opener.length > 0 && (
            <>
              <h4 style={{ color: '#fff', marginBottom: '15px' }}>오프닝 시퀀스</h4>
              <OpenerSequence>
                {singleTarget.opener.map((skillKey, index) => {
                  const skill = skillData[skillKey];
                  if (!skill) return null;

                  return (
                    <React.Fragment key={index}>
                      <SkillStep
                        whileHover={{ scale: 1.1 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <StepNumber color={color}>{index + 1}</StepNumber>
                        <SkillIcon
                          skillId={skill.id}
                          skillName={skill.englishName}
                          iconName={skill.icon}
                          classType="demonhunter"
                        />
                      </SkillStep>
                      {index < singleTarget.opener.length - 1 && (
                        <Arrow color={color}>→</Arrow>
                      )}
                    </React.Fragment>
                  );
                })}
              </OpenerSequence>
            </>
          )}

          {/* 우선순위 */}
          {singleTarget.priority && singleTarget.priority.length > 0 && (
            <>
              <h4 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>우선순위</h4>
              <PriorityList>
                {singleTarget.priority.map((item, index) => {
                  const skill = skillData[item.skill];
                  if (!skill) return null;

                  return (
                    <PriorityItem key={index} priority={item.priority || index}>
                      <PriorityNumber priority={item.priority || index}>
                        {item.priority !== undefined ? item.priority : index}
                      </PriorityNumber>
                      <SkillIcon
                        skillId={skill.id}
                        skillName={skill.englishName}
                        iconName={skill.icon}
                        classType="demonhunter"
                      />
                      <PriorityContent>
                        <PriorityTitle>{skill.koreanName}</PriorityTitle>
                        {item.condition && (
                          <PriorityCondition>조건: {item.condition}</PriorityCondition>
                        )}
                        {item.why && (
                          <PriorityDescription>{item.why}</PriorityDescription>
                        )}
                      </PriorityContent>
                    </PriorityItem>
                  );
                })}
              </PriorityList>
            </>
          )}
        </HeroCard>
      )}

      {/* 광역 */}
      {aoe && (
        <HeroCard
          heroKey={selectedHero}
          initial="rest"
          whileHover="hover"
          variants={motionVariants.heroCard}
          transition={springConfigs.responsive}
        >
          <SubTitle>광역 (2+ 대상)</SubTitle>

          {/* AoE 오프닝 */}
          {aoe.opener && aoe.opener.length > 0 && (
            <>
              <h4 style={{ color: '#fff', marginBottom: '15px' }}>오프닝 시퀀스</h4>
              <OpenerSequence>
                {aoe.opener.map((skillKey, index) => {
                  const skill = skillData[skillKey];
                  if (!skill) return null;

                  return (
                    <React.Fragment key={index}>
                      <SkillStep
                        whileHover={{ scale: 1.1 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <StepNumber color={color}>{index + 1}</StepNumber>
                        <SkillIcon
                          skillId={skill.id}
                          skillName={skill.englishName}
                          iconName={skill.icon}
                          classType="demonhunter"
                        />
                      </SkillStep>
                      {index < aoe.opener.length - 1 && (
                        <Arrow color={color}>→</Arrow>
                      )}
                    </React.Fragment>
                  );
                })}
              </OpenerSequence>
            </>
          )}

          {/* AoE 우선순위 */}
          {aoe.priority && aoe.priority.length > 0 && (
            <>
              <h4 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>우선순위</h4>
              <PriorityList>
                {aoe.priority.map((item, index) => {
                  const skill = skillData[item.skill];
                  if (!skill) return null;

                  return (
                    <PriorityItem key={index} priority={item.priority || index}>
                      <PriorityNumber priority={item.priority || index}>
                        {item.priority !== undefined ? item.priority : index}
                      </PriorityNumber>
                      <SkillIcon
                        skillId={skill.id}
                        skillName={skill.englishName}
                        iconName={skill.icon}
                        classType="demonhunter"
                      />
                      <PriorityContent>
                        <PriorityTitle>{skill.koreanName}</PriorityTitle>
                        {item.condition && (
                          <PriorityCondition>조건: {item.condition}</PriorityCondition>
                        )}
                        {item.why && (
                          <PriorityDescription>{item.why}</PriorityDescription>
                        )}
                      </PriorityContent>
                    </PriorityItem>
                  );
                })}
              </PriorityList>
            </>
          )}
        </HeroCard>
      )}
      </>
      )}
    </>
  );
}
