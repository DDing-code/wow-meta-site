import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GuideTable from '../visuals/GuideTable';
import { havocVisuals } from '../../../data/guides/havoc-demonhunter/visuals';

// 가이드 스탯 우선순위 모듈
// Props로 영웅 특성별 스탯 데이터를 받아 자동 렌더링
// GuideTable 컴포넌트 통합으로 상세 스탯 우선순위 표 제공

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.color || '#A330C9'};
  margin: 0 0 20px 0;
  border-bottom: 2px solid ${props => props.color || '#A330C9'};
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
  background: ${props => props.active ? props.activeColor || '#A330C9' : 'transparent'};
  border: 2px solid ${props => props.borderColor || '#A330C9'};
  border-radius: 8px;
  color: ${props => props.active ? '#fff' : '#a0a0a0'};
  font-size: 1rem;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.hoverColor || '#A330C9'}40;
    color: #fff;
  }
`;

const Card = styled.div`
  background: #15151f;
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const HeroCard = styled(Card)`
  background: ${props => {
    if (props.heroKey === 'aldrachireaver') {
      return 'linear-gradient(135deg, rgba(163, 48, 201, 0.05) 0%, rgba(163, 48, 201, 0.1) 100%)';
    } else if (props.heroKey === 'felscarred') {
      return 'linear-gradient(135deg, rgba(255, 68, 68, 0.05) 0%, rgba(255, 68, 68, 0.1) 100%)';
    }
    return '#15151f';
  }};
  border: 2px solid ${props => {
    if (props.heroKey === 'aldrachireaver') {
      return 'rgba(163, 48, 201, 0.3)';
    } else if (props.heroKey === 'felscarred') {
      return 'rgba(255, 68, 68, 0.3)';
    }
    return '#2a2a3e';
  }};
`;

const PriorityText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #e0e0e0;
  margin: 20px 0;

  strong {
    color: ${props => props.highlightColor || '#A330C9'};
    font-weight: bold;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 20px 0;
`;

const StatCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid ${props => props.borderColor || '#A330C9'}40;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: ${props => props.borderColor || '#A330C9'};
    transform: translateY(-3px);
  }
`;

const StatName = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${props => props.color || '#A330C9'};
  margin-bottom: 8px;
`;

const StatRank = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => {
    if (props.rank === 1) return '#ffd700';
    if (props.rank === 2) return '#c0c0c0';
    if (props.rank === 3) return '#cd7f32';
    return '#4caf50';
  }};
`;

const StatDescription = styled.div`
  font-size: 0.85rem;
  color: #a0a0a0;
  margin-top: 5px;
`;

const InfoBox = styled.div`
  background: rgba(255, 165, 0, 0.1);
  border-left: 4px solid #ffa500;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  color: #e0e0e0;
  font-size: 0.95rem;
  line-height: 1.6;

  strong {
    color: #ffa500;
  }
`;

export default function GuideStats({
  data,
  color = '#A330C9',
  heroTalentNames = {}
}) {
  // React Hooks는 항상 최상위에서 호출
  const heroTalents = data ? Object.keys(data) : [];
  const [selectedHero, setSelectedHero] = useState(heroTalents[0] || '');

  // 조건부 렌더링은 Hooks 호출 이후
  if (!data) return null;
  if (!selectedHero || !data[selectedHero]) return null;

  const currentStats = data[selectedHero];

  // 구조화된 스탯 배열인 경우
  const hasStructuredStats = currentStats.stats && Array.isArray(currentStats.stats);

  return (
    <>
      <SectionTitle color={color}>스탯 우선순위</SectionTitle>

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

      <HeroCard heroKey={selectedHero}>
        {/* 우선순위 텍스트 */}
        {currentStats.priority && (
          <PriorityText highlightColor={color}>
            {currentStats.priority}
          </PriorityText>
        )}

        {/* 구조화된 스탯 그리드 */}
        {hasStructuredStats && (
          <StatsGrid>
            {currentStats.stats.map((stat, index) => (
              <StatCard key={index} borderColor={color}>
                <StatName color={color}>{stat.name}</StatName>
                <StatRank rank={index + 1}>{index + 1}순위</StatRank>
                {stat.description && (
                  <StatDescription>{stat.description}</StatDescription>
                )}
              </StatCard>
            ))}
          </StatsGrid>
        )}

        {/* 🆕 상세 스탯 우선순위 표 */}
        {havocVisuals.statPriorityTable && havocVisuals.statPriorityTable[selectedHero] && (
          <GuideTable
            data={havocVisuals.statPriorityTable[selectedHero]}
            color={color}
            title="상세 스탯 우선순위"
          />
        )}

        {/* 추가 정보 */}
        {currentStats.note && (
          <InfoBox>
            <strong>참고:</strong> {currentStats.note}
          </InfoBox>
        )}

        {/* SimC 설정 */}
        {currentStats.simcSettings && (
          <>
            <h4 style={{ color: '#ffa500', marginTop: '30px', marginBottom: '15px' }}>
              SimulationCraft 설정
            </h4>
            <InfoBox>
              <div>{currentStats.simcSettings.description}</div>
              {currentStats.simcSettings.command && (
                <div style={{ marginTop: '10px' }}>
                  <strong>명령어:</strong><br />
                  <code style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '10px',
                    display: 'block',
                    borderRadius: '4px',
                    marginTop: '5px'
                  }}>
                    {currentStats.simcSettings.command}
                  </code>
                </div>
              )}
              {currentStats.simcSettings.weightFormula && (
                <div style={{ marginTop: '10px' }}>
                  <strong>가중치 공식:</strong><br />
                  <code style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '10px',
                    display: 'block',
                    borderRadius: '4px',
                    marginTop: '5px',
                    fontSize: '0.85rem'
                  }}>
                    {currentStats.simcSettings.weightFormula}
                  </code>
                </div>
              )}
            </InfoBox>
          </>
        )}
      </HeroCard>
    </>
  );
}
