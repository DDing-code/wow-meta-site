import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SkillIcon from '../../SkillIcon';
import { colorSystem, typography, borderRadius, transitions, motionVariants, springConfigs } from '../../../styles/designSystem';

// 가이드 개요 모듈
// Props로 데이터를 받아 자동 렌더링

const Card = styled(motion.div)`
  background: #15151f;
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.color || '#A330C9'};
  margin: 0 0 20px 0;
  border-bottom: 2px solid ${props => props.color || '#A330C9'};
  padding-bottom: 12px;
`;

const SubTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffa500;
  margin: 20px 0 12px 0;
`;

const Description = styled.p`
  line-height: 1.8;
  margin-bottom: 20px;
  color: #e0e0e0;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
  margin: 15px 0;
`;

const ResourceCard = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  border: 1px solid ${props => props.borderColor || '#A330C9'}40;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
`;

const ResourceTitle = styled.h4`
  color: ${props => props.color || '#A330C9'};
  font-size: 1.1rem;
  margin: 0 0 10px 0;
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0;
`;

const SkillItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  color: #d0d0d0;
`;

const CoreSkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
  margin-top: 15px;
`;

const CoreSkillCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  cursor: pointer;

  /* Hover handled by Framer Motion variants */
`;

const SkillLabel = styled.span`
  color: #a0a0a0;
  font-size: 0.9rem;
`;

export default function GuideOverview({
  data,
  skillData,
  color = '#A330C9'
}) {
  if (!data) return null;

  const {
    description,
    resourceSystem,
    coreSkills = []
  } = data;

  return (
    <>
      <SectionTitle color={color}>개요</SectionTitle>

      <Card
        initial="rest"
        whileHover="hover"
        variants={motionVariants.card}
        transition={springConfigs.responsive}
      >
        <Description>{description}</Description>

        {resourceSystem && (
          <>
            <SubTitle>리소스 시스템</SubTitle>
            <ResourceGrid>
              {/* 주 자원 */}
              <ResourceCard
                borderColor={color}
                initial="rest"
                whileHover="hover"
                variants={motionVariants.card}
                transition={springConfigs.responsive}
              >
                <ResourceTitle color={color}>
                  주 자원: {resourceSystem.primary}
                </ResourceTitle>
                <Description style={{ marginBottom: '10px', fontSize: '0.95rem' }}>
                  최대: {resourceSystem.max || '100'}
                  {resourceSystem.regeneration && ` | ${resourceSystem.regeneration}`}
                </Description>
              </ResourceCard>

              {/* 자원 생성 */}
              {resourceSystem.generators && resourceSystem.generators.length > 0 && (
                <ResourceCard
                  borderColor={color}
                  initial="rest"
                  whileHover="hover"
                  variants={motionVariants.card}
                  transition={springConfigs.responsive}
                >
                  <ResourceTitle color={color}>자원 생성</ResourceTitle>
                  <SkillList>
                    {resourceSystem.generators.map((gen, index) => {
                      const skill = skillData[gen.skill];
                      if (!skill) return null;
                      return (
                        <SkillItem key={index}>
                          <SkillIcon
                            skillId={skill.id}
                            skillName={skill.englishName}
                            iconName={skill.icon}
                            classType="demonhunter"
                            size="small"
                          />
                          <span style={{ color: '#4caf50' }}>+{gen.amount}</span>
                        </SkillItem>
                      );
                    })}
                  </SkillList>
                </ResourceCard>
              )}

              {/* 자원 소모 */}
              {resourceSystem.spenders && resourceSystem.spenders.length > 0 && (
                <ResourceCard
                  borderColor={color}
                  initial="rest"
                  whileHover="hover"
                  variants={motionVariants.card}
                  transition={springConfigs.responsive}
                >
                  <ResourceTitle color={color}>자원 소모</ResourceTitle>
                  <SkillList>
                    {resourceSystem.spenders.map((spender, index) => {
                      const skill = skillData[spender.skill];
                      if (!skill) return null;
                      return (
                        <SkillItem key={index}>
                          <SkillIcon
                            skillId={skill.id}
                            skillName={skill.englishName}
                            iconName={skill.icon}
                            classType="demonhunter"
                            size="small"
                          />
                          <span style={{ color: '#f44336' }}>-{spender.amount}</span>
                        </SkillItem>
                      );
                    })}
                  </SkillList>
                </ResourceCard>
              )}
            </ResourceGrid>
          </>
        )}

        {coreSkills && coreSkills.length > 0 && (
          <>
            <SubTitle>핵심 스킬</SubTitle>
            <CoreSkillsGrid>
              {coreSkills.map((skillKey, index) => {
                const skill = skillData[skillKey];
                if (!skill) return null;

                return (
                  <CoreSkillCard
                    key={index}
                    color={color}
                    initial="rest"
                    whileHover="hover"
                    variants={motionVariants.card}
                    transition={springConfigs.responsive}
                  >
                    <SkillIcon
                      skillId={skill.id}
                      skillName={skill.englishName}
                      iconName={skill.icon}
                      classType="demonhunter"
                    />
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>
                        {skill.koreanName}
                      </div>
                      <SkillLabel>{skill.description?.substring(0, 30)}...</SkillLabel>
                    </div>
                  </CoreSkillCard>
                );
              })}
            </CoreSkillsGrid>
          </>
        )}
      </Card>
    </>
  );
}
