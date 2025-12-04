// ============================================================
// Spec Guide Template - 전문화 가이드 범용 템플릿
// ============================================================
// 목적: Props로 데이터만 주입하면 자동으로 가이드 렌더링
// 업데이트: 2025-11-11
// ============================================================

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SkillTooltip from '../SkillTooltip';
import { motionVariants, springConfigs } from '../../styles/designSystem';

// Styled Components
const GuideContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  color: #e0e0e0;
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.color || '#AAD372'};
  margin: 0 0 24px 0;
  border-bottom: 2px solid ${props => props.color || '#AAD372'};
  padding-bottom: 12px;
  text-shadow: 0 0 12px ${props => props.color || '#AAD372'}40;
`;

const Card = styled(motion.div)`
  background: linear-gradient(135deg, #15151f 0%, #1a1a2e 100%);
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
`;

const SubTitle = styled.h3`
  font-size: 1.4rem;
  color: #ffa500;
  margin: 0 0 16px 0;
`;

const Description = styled.p`
  line-height: 1.8;
  color: #e0e0e0;
  margin-bottom: 20px;
  font-size: 1rem;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const SkillCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: ${props => props.color || '#AAD372'}40;
  }
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillName = styled.div`
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
`;

const SkillDesc = styled.div`
  font-size: 0.85rem;
  color: #999;
  line-height: 1.4;
`;

const PriorityList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: priority;
`;

const PriorityItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border-left: 3px solid ${props => props.color || '#AAD372'};
  counter-increment: priority;

  &::before {
    content: counter(priority);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: ${props => props.color || '#AAD372'};
    color: #000;
    font-weight: bold;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

const PriorityContent = styled.div`
  flex: 1;
`;

const ConditionText = styled.div`
  color: #ffa500;
  font-size: 0.9rem;
  margin-top: 8px;
  font-style: italic;
`;

/**
 * SpecGuide Component
 *
 * @param {Object} data - 가이드 데이터
 * @param {string} data.className - 클래스명 (영문 소문자, 예: 'mage')
 * @param {string} data.specName - 전문화명 (한글, 예: '비전')
 * @param {string} data.color - 테마 색상 (예: '#A330C9')
 * @param {string} data.description - 전문화 소개
 * @param {Array<string>} data.coreSkills - 핵심 스킬 ID 배열
 * @param {Object} data.rotation - 로테이션 데이터
 * @param {Array<string>} data.rotation.opener - 오프닝 스킬 ID 배열
 * @param {Array<Object>} data.rotation.priority - 우선순위 배열
 */
const SpecGuide = ({ data }) => {
  if (!data) {
    return (
      <GuideContainer>
        <p>가이드 데이터를 불러올 수 없습니다.</p>
      </GuideContainer>
    );
  }

  const {
    className = 'warrior',
    specName = '전문화',
    color = '#AAD372',
    description = '',
    coreSkills = [],
    rotation = {},
    talents = {},
    stats = {}
  } = data;

  return (
    <GuideContainer>
      {/* 개요 섹션 */}
      <Section>
        <SectionTitle color={color}>개요</SectionTitle>
        <Card
          initial="rest"
          whileHover="hover"
          variants={motionVariants.card}
          transition={springConfigs.responsive}
        >
          <Description>{description}</Description>

          {coreSkills && coreSkills.length > 0 && (
            <>
              <SubTitle>핵심 스킬</SubTitle>
              <SkillsGrid>
                {coreSkills.map((skillId) => (
                  <SkillCard
                    key={skillId}
                    color={color}
                    initial="rest"
                    whileHover="hover"
                    variants={motionVariants.card}
                    transition={springConfigs.snappy}
                  >
                    <SkillTooltip skillId={skillId} size="medium" />
                    <SkillInfo>
                      <SkillTooltip skillId={skillId} textOnly showTooltip={false} />
                    </SkillInfo>
                  </SkillCard>
                ))}
              </SkillsGrid>
            </>
          )}
        </Card>
      </Section>

      {/* 로테이션 섹션 */}
      {rotation && (
        <Section>
          <SectionTitle color={color}>딜사이클</SectionTitle>

          {/* 오프닝 */}
          {rotation.opener && rotation.opener.length > 0 && (
            <Card
              initial="rest"
              whileHover="hover"
              variants={motionVariants.card}
              transition={springConfigs.responsive}
            >
              <SubTitle>오프닝</SubTitle>
              <SkillsGrid>
                {rotation.opener.map((skillId, index) => (
                  <SkillCard
                    key={`opener-${skillId}-${index}`}
                    color={color}
                    initial="rest"
                    whileHover="hover"
                    variants={motionVariants.card}
                    transition={springConfigs.snappy}
                  >
                    <SkillTooltip skillId={skillId} size="medium" />
                    <SkillInfo>
                      <SkillName>
                        <SkillTooltip skillId={skillId} textOnly showTooltip={false} />
                      </SkillName>
                      <SkillDesc>순서 {index + 1}</SkillDesc>
                    </SkillInfo>
                  </SkillCard>
                ))}
              </SkillsGrid>
            </Card>
          )}

          {/* 우선순위 */}
          {rotation.priority && rotation.priority.length > 0 && (
            <Card
              initial="rest"
              whileHover="hover"
              variants={motionVariants.card}
              transition={springConfigs.responsive}
            >
              <SubTitle>우선순위</SubTitle>
              <PriorityList>
                {rotation.priority.map((item, index) => (
                  <PriorityItem key={index} color={color}>
                    <SkillTooltip skillId={item.skillId} size="medium" />
                    <PriorityContent>
                      <SkillTooltip skillId={item.skillId} textOnly showTooltip={false} />
                      {item.condition && (
                        <ConditionText>조건: {item.condition}</ConditionText>
                      )}
                      {item.reason && (
                        <Description style={{ marginTop: '8px', marginBottom: 0 }}>
                          {item.reason}
                        </Description>
                      )}
                    </PriorityContent>
                  </PriorityItem>
                ))}
              </PriorityList>
            </Card>
          )}
        </Section>
      )}

      {/* 특성 빌드 섹션 */}
      {talents && talents.raid && (
        <Section>
          <SectionTitle color={color}>특성 빌드</SectionTitle>
          <Card
            initial="rest"
            whileHover="hover"
            variants={motionVariants.card}
            transition={springConfigs.responsive}
          >
            <SubTitle>레이드 빌드</SubTitle>
            <Description>{talents.raid.description || '레이드용 특성 빌드입니다.'}</Description>
            {talents.raid.url && (
              <a
                href={talents.raid.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: color, textDecoration: 'underline' }}
              >
                Wowhead에서 보기 →
              </a>
            )}
          </Card>

          {talents.mythicPlus && (
            <Card
              initial="rest"
              whileHover="hover"
              variants={motionVariants.card}
              transition={springConfigs.responsive}
            >
              <SubTitle>쐐기돌 빌드</SubTitle>
              <Description>{talents.mythicPlus.description || '쐐기돌용 특성 빌드입니다.'}</Description>
              {talents.mythicPlus.url && (
                <a
                  href={talents.mythicPlus.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: color, textDecoration: 'underline' }}
                >
                  Wowhead에서 보기 →
                </a>
              )}
            </Card>
          )}
        </Section>
      )}

      {/* 스탯 우선순위 섹션 */}
      {stats && stats.priority && (
        <Section>
          <SectionTitle color={color}>스탯 우선순위</SectionTitle>
          <Card
            initial="rest"
            whileHover="hover"
            variants={motionVariants.card}
            transition={springConfigs.responsive}
          >
            <Description style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>
              {stats.priority}
            </Description>
            {stats.notes && <Description>{stats.notes}</Description>}
          </Card>
        </Section>
      )}
    </GuideContainer>
  );
};

export default SpecGuide;
