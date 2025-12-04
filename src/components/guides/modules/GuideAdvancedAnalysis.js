import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Tab, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import SkillIcon from '../../SkillIcon';
import GuideChart from '../visuals/GuideChart';
import { havocVisuals } from '../../../data/guides/havoc-demonhunter/visuals';
import { colorSystem, typography, borderRadius, transitions } from '../../../styles/designSystem';

// 가이드 심화 분석 모듈
// Props로 영웅 특성별 심화 분석 데이터를 받아 자동 렌더링
// 아코디언 UI로 각 주제별 접기/펼치기 가능
// GuideChart 통합으로 DPS 시뮬레이션 시각화 제공

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.color || '#A330C9'};
  margin: 0 0 20px 0;
  border-bottom: 2px solid ${props => props.color || '#A330C9'};
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

const StyledTab = styled(Tab)`
  && {
    color: rgba(255, 255, 255, 0.6);
    font-size: 1rem;
    font-weight: 500;
    text-transform: none;
    padding: 0.75rem 1.5rem;
    border: 2px solid ${props => props.customcolor || '#A330C9'};
    border-radius: 0.5rem;
    margin: 0;
    min-height: auto;
    transition: all 0.3s ease;

    &.Mui-selected {
      color: #fff;
      background: ${props => props.customcolor || '#A330C9'};
      font-weight: 600;
    }

    &:hover {
      background: ${props => props.customcolor || '#A330C9'}40;
      color: #fff;
    }
  }
`;

// MUI Accordion 커스터마이징 (블로그 스타일)
const StyledAccordion = styled(Accordion)`
  && {
    background: #15151f;
    border: 1px solid #2a2a3e;
    border-radius: 12px;
    margin-bottom: 0.75rem;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: ${props => props.customcolor || '#A330C9'}80;
    }

    &:before {
      display: none;
    }

    &.Mui-expanded {
      margin: 0 0 0.75rem 0;
    }
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  && {
    padding: 1rem 1.25rem;
    min-height: auto;

    &:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    .MuiAccordionSummary-content {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .MuiAccordionSummary-expandIconWrapper {
      color: ${props => props.customcolor || '#A330C9'};
      font-size: 1.5rem;
    }
  }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  && {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }
`;

const TopicNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color || '#A330C9'}40;
  border: 2px solid ${props => props.color || '#A330C9'};
  color: ${props => props.color || '#A330C9'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const TopicTitle = styled.h3`
  font-size: 1.3rem;
  color: #fff;
  margin: 0;
  font-weight: bold;
  flex: 1;
`;

const ContentSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionSubtitle = styled.h4`
  font-size: 1.1rem;
  color: #ffa500;
  margin: 0 0 12px 0;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #e0e0e0;
  line-height: 1.7;
  margin: 0 0 15px 0;

  strong {
    color: ${props => props.highlightColor || '#A330C9'};
    font-weight: bold;
  }
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 15px 0;
`;

const TipBox = styled.div`
  background: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4caf50;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  color: #e0e0e0;
  font-size: 0.95rem;
  line-height: 1.6;

  strong {
    color: #4caf50;
  }
`;

const WarningBox = styled.div`
  background: rgba(255, 152, 0, 0.1);
  border-left: 4px solid #ff9800;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  color: #e0e0e0;
  font-size: 0.95rem;
  line-height: 1.6;

  strong {
    color: #ff9800;
  }
`;

const BulletList = styled.ul`
  margin: 10px 0;
  padding-left: 25px;
  color: #e0e0e0;
  line-height: 1.7;

  li {
    margin-bottom: 8px;
  }

  strong {
    color: ${props => props.highlightColor || '#A330C9'};
  }
`;

export default function GuideAdvancedAnalysis({
  data,
  skillData,
  color = '#A330C9',
  heroTalentNames = {}
}) {
  // React Hooks는 항상 최상위에서 호출
  const heroTalents = data ? Object.keys(data) : [];
  const [selectedHero, setSelectedHero] = useState(heroTalents[0] || '');
  const [expandedPanel, setExpandedPanel] = useState('panel0'); // 첫 번째 항목 기본 열림

  // 조건부 렌더링은 Hooks 호출 이후
  if (!data) return null;
  if (!selectedHero || !data[selectedHero]) return null;

  const currentAnalysis = data[selectedHero];
  const topics = currentAnalysis.topics || [];

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <>
      <SectionTitle color={color}>심화 분석</SectionTitle>

      {/* 영웅 특성 탭 (2개 이상일 때만) - MUI Tabs */}
      {heroTalents.length > 1 && (
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
            />
          ))}
        </StyledTabs>
      )}

      {/* 아코디언 항목들 - MUI Accordion */}
      <div>
        {topics.map((topic, index) => {
          const panelId = `panel${index}`;

          return (
            <StyledAccordion
              key={index}
              expanded={expandedPanel === panelId}
              onChange={handleAccordionChange(panelId)}
              customcolor={color}
            >
              <StyledAccordionSummary
                expandIcon={<span>▼</span>}
                customcolor={color}
              >
                <TopicNumber color={color}>{index + 1}</TopicNumber>
                <TopicTitle>{topic.title}</TopicTitle>
              </StyledAccordionSummary>

              <StyledAccordionDetails>
                    {/* 설명 */}
                    {topic.description && (
                      <ContentSection>
                        <Description
                          highlightColor={color}
                          dangerouslySetInnerHTML={{ __html: topic.description }}
                        />
                      </ContentSection>
                    )}

                    {/* 스킬 리스트 */}
                    {topic.skills && topic.skills.length > 0 && (
                      <ContentSection>
                        <SectionSubtitle>관련 스킬</SectionSubtitle>
                        <SkillList>
                          {topic.skills.map((skillKey, skillIndex) => {
                            const skill = skillData[skillKey];
                            if (!skill) return null;
                            return <SkillIcon
                              key={skillIndex}
                              skillId={skill.id}
                              skillName={skill.englishName}
                              iconName={skill.icon}
                              classType="demonhunter"
                            />;
                          })}
                        </SkillList>
                      </ContentSection>
                    )}

                    {/* 핵심 포인트 */}
                    {topic.keyPoints && topic.keyPoints.length > 0 && (
                      <ContentSection>
                        <SectionSubtitle>핵심 포인트</SectionSubtitle>
                        <BulletList highlightColor={color}>
                          {topic.keyPoints.map((point, pointIndex) => (
                            <li key={pointIndex} dangerouslySetInnerHTML={{ __html: point }} />
                          ))}
                        </BulletList>
                      </ContentSection>
                    )}

                    {/* 팁 박스 */}
                    {topic.tip && (
                      <TipBox>
                        <strong>💡 프로 팁:</strong>{' '}
                        <span dangerouslySetInnerHTML={{ __html: topic.tip }} />
                      </TipBox>
                    )}

                    {/* 경고 박스 */}
                    {topic.warning && (
                      <WarningBox>
                        <strong>⚠️ 주의:</strong>{' '}
                        <span dangerouslySetInnerHTML={{ __html: topic.warning }} />
                      </WarningBox>
                    )}
              </StyledAccordionDetails>
            </StyledAccordion>
          );
        })}
      </div>

      {/* 🆕 DPS 시뮬레이션 차트 */}
      {havocVisuals.dpsSimulation && (
        <>
          <GuideChart
            data={havocVisuals.dpsSimulation.singleTarget}
            color={color}
            type="bar"
            title="영웅 특성별 DPS 비교 (단일 대상)"
            height={300}
            showGrid={true}
          />

          <GuideChart
            data={havocVisuals.dpsSimulation.aoe3Target}
            color={color}
            type="bar"
            title="영웅 특성별 DPS 비교 (3 타겟 AoE)"
            height={300}
            showGrid={true}
          />
        </>
      )}
    </>
  );
}
