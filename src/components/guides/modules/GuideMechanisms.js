import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SkillIcon from '../../SkillIcon';
import GuideDiagram from '../visuals/GuideDiagram';
import { havocVisuals } from '../../../data/guides/havoc-demonhunter/visuals';
import { colorSystem, typography, borderRadius, transitions, shadows, motionVariants, springConfigs } from '../../../styles/designSystem';

// 가이드 메커니즘 모듈
// Props로 영웅 특성별 게임 메커니즘 데이터를 받아 자동 렌더링
// 중요도별 색상으로 메커니즘 카드 표시
// GuideDiagram 통합으로 버스트 윈도우 타임라인 시각화 제공

const SectionTitle = styled.h2`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${props => props.color || colorSystem.primary.main};
  margin: 0 0 20px 0;
  border-bottom: 1px solid ${props => props.color || colorSystem.primary.main};
  padding-bottom: 12px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const TabButton = styled(motion.button)`
  padding: 12px 24px;
  background: ${props => props.active ? props.activeColor || colorSystem.primary.main : 'transparent'};
  border: 1px solid ${props => props.borderColor || colorSystem.primary.main};
  border-radius: ${borderRadius.DEFAULT};
  color: ${props => props.active ? colorSystem.text.primary : colorSystem.text.secondary};
  font-size: ${typography.fontSize.base};
  font-weight: ${props => props.active ? typography.fontWeight.bold : typography.fontWeight.normal};
  cursor: pointer;
  transition: ${transitions.all.fast};

  &:hover {
    background: ${props => props.hoverColor || colorSystem.primary.main}40;
    color: ${colorSystem.text.primary};
  }
`;

const MechanismGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const MechanismCard = styled(motion.div)`
  background: ${colorSystem.background.surface};
  border: 1px solid ${props => {
    if (props.importance === 'critical') return colorSystem.semantic.error;
    if (props.importance === 'high') return '#ff9800';
    if (props.importance === 'medium') return colorSystem.semantic.warning;
    return colorSystem.semantic.success;
  }};
  border-radius: ${borderRadius.DEFAULT};
  padding: 20px;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      if (props.importance === 'critical') return colorSystem.semantic.error;
      if (props.importance === 'high') return '#ff9800';
      if (props.importance === 'medium') return colorSystem.semantic.warning;
      return colorSystem.semantic.success;
    }};
  }

  /* Hover handled by Framer Motion variants */
`;

const ImportanceBadge = styled.div`
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 12px;
  background: ${props => {
    if (props.importance === 'critical') return 'rgba(255, 68, 68, 0.2)';
    if (props.importance === 'high') return 'rgba(255, 152, 0, 0.2)';
    if (props.importance === 'medium') return 'rgba(255, 193, 7, 0.2)';
    return 'rgba(76, 175, 80, 0.2)';
  }};
  color: ${props => {
    if (props.importance === 'critical') return '#ff4444';
    if (props.importance === 'high') return '#ff9800';
    if (props.importance === 'medium') return '#ffc107';
    return '#4caf50';
  }};
  border: 1px solid ${props => {
    if (props.importance === 'critical') return '#ff4444';
    if (props.importance === 'high') return '#ff9800';
    if (props.importance === 'medium') return '#ffc107';
    return '#4caf50';
  }};
`;

const MechanismTitle = styled.h3`
  font-size: 1.4rem;
  color: #fff;
  margin: 0 0 15px 0;
  font-weight: bold;
`;

const MechanismDescription = styled.p`
  font-size: 1rem;
  color: #e0e0e0;
  line-height: 1.7;
  margin: 0 0 20px 0;

  strong {
    color: ${props => props.highlightColor || '#A330C9'};
    font-weight: bold;
  }
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
`;

const DetailsSection = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #2a2a3e;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.95rem;
  color: #e0e0e0;
  line-height: 1.6;

  &:before {
    content: '•';
    color: ${props => props.bulletColor || '#A330C9'};
    font-weight: bold;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

const ImportanceLabel = {
  critical: '핵심 필수',
  high: '높음',
  medium: '중간',
  low: '낮음'
};

export default function GuideMechanisms({
  data,
  skillData,
  color = '#A330C9',
  heroTalentNames = {}
}) {
  // React Hooks는 항상 최상위에서 호출
  const heroTalents = data ? Object.keys(data) : [];
  const [selectedHero, setSelectedHero] = useState(heroTalents[0] || '');

  // 조건부 렌더링은 Hooks 호출 이후
  if (!data) return null;
  if (!selectedHero || !data[selectedHero]) return null;

  const currentMechanisms = data[selectedHero];
  const mechanisms = currentMechanisms.mechanisms || [];

  return (
    <>
      <SectionTitle color={color}>게임 메커니즘</SectionTitle>

      {/* 영웅 특성 탭 (2개 이상일 때만) */}
      {heroTalents.length > 1 && (
        <TabContainer>
          {heroTalents.map(heroKey => (
            <TabButton
              key={heroKey}
              active={selectedHero === heroKey}
              activeColor={color}
              borderColor={color}
              hoverColor={color}
              onClick={() => setSelectedHero(heroKey)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {heroTalentNames[heroKey] || heroKey}
            </TabButton>
          ))}
        </TabContainer>
      )}

      {/* 메커니즘 카드 그리드 */}
      <MechanismGrid>
        {mechanisms.map((mechanism, index) => (
          <MechanismCard
            key={index}
            importance={mechanism.importance || 'medium'}
            initial={{ opacity: 0, y: 20, ...motionVariants.card.rest }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={motionVariants.card.hover}
            transition={{ ...springConfigs.responsive, delay: index * 0.1 }}
          >
            {/* 중요도 배지 */}
            <ImportanceBadge importance={mechanism.importance || 'medium'}>
              {ImportanceLabel[mechanism.importance || 'medium']}
            </ImportanceBadge>

            {/* 메커니즘 제목 */}
            <MechanismTitle>{mechanism.title}</MechanismTitle>

            {/* 메커니즘 설명 */}
            <MechanismDescription
              highlightColor={color}
              dangerouslySetInnerHTML={{ __html: mechanism.description }}
            />

            {/* 관련 스킬 */}
            {mechanism.skills && mechanism.skills.length > 0 && (
              <>
                <h4 style={{ color: '#ffa500', fontSize: '1rem', margin: '15px 0 10px 0' }}>
                  관련 스킬
                </h4>
                <SkillList>
                  {mechanism.skills.map((skillKey, skillIndex) => {
                    const skill = skillData[skillKey];
                    if (!skill) return null;
                    return (
                      <SkillIcon
                        key={skillIndex}
                        skillId={skill.id}
                        skillName={skill.englishName}
                        iconName={skill.icon}
                        classType="demonhunter"
                        size="small"
                      />
                    );
                  })}
                </SkillList>
              </>
            )}

            {/* 세부 정보 */}
            {mechanism.details && mechanism.details.length > 0 && (
              <DetailsSection>
                {mechanism.details.map((detail, detailIndex) => (
                  <DetailItem key={detailIndex} bulletColor={color}>
                    {detail}
                  </DetailItem>
                ))}
              </DetailsSection>
            )}
          </MechanismCard>
        ))}
      </MechanismGrid>

      {/* 🆕 버스트 윈도우 타임라인 */}
      {havocVisuals.metamorphosisTimeline && havocVisuals.metamorphosisTimeline[selectedHero] && (
        <GuideDiagram
          data={havocVisuals.metamorphosisTimeline[selectedHero]}
          title={`${heroTalentNames[selectedHero] || selectedHero} 탈태 변신 버스트 윈도우 타임라인`}
          color={color}
          type="gantt"
        />
      )}
    </>
  );
}
