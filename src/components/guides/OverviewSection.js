// ============================================================
// OverviewSection Component - 다크 아카데믹 스타일 개요 섹션
// ============================================================
// styled-components 기반 재구축
// 리소스 시스템, 핵심 스킬, 플레이스타일, 장단점 표시
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// ============================================================
// Styled Components
// ============================================================

const SectionTitle = styled.h2`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.subsection} 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }
`;

const SubsectionTitle = styled.h3`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.paragraph} 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.background.surface};
  border-left: 4px solid ${props => props.borderColor || props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.cardPadding};
  box-shadow: ${props => props.theme.shadows.card};
  margin-bottom: ${props => props.theme.spacing.paragraph};
  transition: ${props => props.theme.transitions.default};

  &:hover {
    box-shadow: ${props => props.theme.shadows.cardHover};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const ResourceCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 1rem;
  }
`;

const ResourceIcon = styled.div`
  display: flex;
  align-items: center;
  justify-center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.iconBg};
  border: 1px solid ${props => props.iconBorder};
  flex-shrink: 0;
  font-size: 1.75rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
  }
`;

const ResourceContent = styled.div`
  flex: 1;
`;

const ResourceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const ResourceTitle = styled.h3`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const ResourceType = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.color};
`;

const ResourceDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
  margin: 0;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: ${props => props.theme.spacing.paragraph};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SkillCard = styled.div`
  background: ${props => props.theme.colors.background.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.card};
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: ${props => props.theme.transitions.default};

  &:hover {
    box-shadow: ${props => props.theme.shadows.cardHover};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const SkillIcon = styled.div`
  display: flex;
  align-items: center;
  justify-center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.iconBg};
  border: 1px solid ${props => props.iconBorder};
  flex-shrink: 0;
  font-size: 1.25rem;
`;

const SkillContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SkillName = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const SkillDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
  margin: 0;
`;

const PlaystyleCard = styled(Card)`
  background: ${props => props.theme.colors.background.elevated};
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const PlaystyleIcon = styled.span`
  font-size: 1.5rem;
  line-height: 1;
  flex-shrink: 0;
`;

const PlaystyleContent = styled.div`
  flex: 1;
`;

const PlaystyleTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 0.75rem 0;
`;

const PlaystyleText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
  margin: 0;
`;

const StrengthsWeaknessesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ListCard = styled(Card)``;

const ListTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.color};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
`;

const ListBullet = styled.span`
  color: ${props => props.color};
  flex-shrink: 0;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

// ============================================================
// Main Component
// ============================================================

/**
 * OverviewSection - 다크 아카데믹 스타일 개요 섹션
 *
 * @param {Object} overview - 개요 데이터 (resourceSystem, coreSkills, playstyle, strengths, weaknesses)
 * @param {string} color - WoW 클래스 색상
 * @param {number} sectionNumber - 섹션 번호 (Icy Veins 스타일)
 */
const OverviewSection = ({ overview, color, sectionNumber }) => {
  const { resourceSystem, coreSkills, playstyle, strengths, weaknesses } = overview;

  return (
    <>
      <SectionTitle>
        <span>📖</span>
        {sectionNumber && `${sectionNumber}. `}개요
      </SectionTitle>

      {/* Resource System */}
      {resourceSystem && (
        <ResourceCard borderColor={color}>
          <ResourceIcon
            iconBg={`${color}20`}
            iconBorder={`${color}40`}
          >
            💧
          </ResourceIcon>
          <ResourceContent>
            <ResourceHeader>
              <ResourceTitle>리소스 시스템</ResourceTitle>
              <ResourceType color={color}>{resourceSystem.type}</ResourceType>
            </ResourceHeader>
            <ResourceDescription>{resourceSystem.description}</ResourceDescription>
          </ResourceContent>
        </ResourceCard>
      )}

      {/* Core Skills */}
      {coreSkills && coreSkills.length > 0 && (
        <>
          <SubsectionTitle>
            <span>⚔️</span>
            핵심 스킬
          </SubsectionTitle>
          <SkillsGrid>
            {coreSkills.map((skill, index) => (
              <SkillCard key={index}>
                <SkillIcon
                  iconBg={`${color}20`}
                  iconBorder={color}
                >
                  🎯
                </SkillIcon>
                <SkillContent>
                  <SkillName>{skill.name || skill.id}</SkillName>
                  <SkillDescription>
                    {skill.description || '스킬 설명이 없습니다.'}
                  </SkillDescription>
                </SkillContent>
              </SkillCard>
            ))}
          </SkillsGrid>
        </>
      )}

      {/* Playstyle */}
      {playstyle && (
        <PlaystyleCard>
          <PlaystyleIcon>🎮</PlaystyleIcon>
          <PlaystyleContent>
            <PlaystyleTitle>플레이스타일</PlaystyleTitle>
            <PlaystyleText>{playstyle}</PlaystyleText>
          </PlaystyleContent>
        </PlaystyleCard>
      )}

      {/* Strengths & Weaknesses */}
      {((strengths && strengths.length > 0) || (weaknesses && weaknesses.length > 0)) && (
        <StrengthsWeaknessesGrid>
          {/* Strengths */}
          {strengths && strengths.length > 0 && (
            <ListCard borderColor="#4ade80">
              <ListTitle color="#4ade80">
                <span>✅</span>
                장점
              </ListTitle>
              <List>
                {strengths.map((strength, index) => (
                  <ListItem key={index}>
                    <ListBullet color="#4ade80">▸</ListBullet>
                    <span>{strength}</span>
                  </ListItem>
                ))}
              </List>
            </ListCard>
          )}

          {/* Weaknesses */}
          {weaknesses && weaknesses.length > 0 && (
            <ListCard borderColor="#f87171">
              <ListTitle color="#f87171">
                <span>⚠️</span>
                단점
              </ListTitle>
              <List>
                {weaknesses.map((weakness, index) => (
                  <ListItem key={index}>
                    <ListBullet color="#f87171">▸</ListBullet>
                    <span>{weakness}</span>
                  </ListItem>
                ))}
              </List>
            </ListCard>
          )}
        </StrengthsWeaknessesGrid>
      )}
    </>
  );
};

OverviewSection.propTypes = {
  overview: PropTypes.shape({
    resourceSystem: PropTypes.shape({
      type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    }),
    coreSkills: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string
      })
    ),
    playstyle: PropTypes.string,
    strengths: PropTypes.arrayOf(PropTypes.string),
    weaknesses: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  color: PropTypes.string.isRequired
};

export default OverviewSection;
