import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { WowIcon, getWowIcon } from '../../utils/wowIcons';

const Container = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? props.theme.colors.accent : props.theme.colors.secondary};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.theme.colors.overlay};
  }
`;

const AbilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const AbilityCard = styled(motion.div)`
  background: ${props => props.theme.colors.secondary};
  border-radius: 10px;
  padding: 1rem;
  border: 2px solid ${props => props.performance === 'good' ? props.theme.colors.success :
                              props.performance === 'poor' ? props.theme.colors.error :
                              props.theme.colors.overlay};
`;

const AbilityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
`;

const AbilityIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${props => props.theme.colors.overlay};
`;

const AbilityInfo = styled.div`
  flex: 1;
`;

const AbilityName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
`;

const AbilityType = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.subtext};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.overlay};

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
`;

const StatValue = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.good ? props.theme.colors.success :
                   props.bad ? props.theme.colors.error :
                   props.theme.colors.text};
`;

const UsageTimeline = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.overlay};
`;

const TimelineBar = styled.div`
  height: 24px;
  background: ${props => props.theme.colors.primary};
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

const UsageMarker = styled.div`
  position: absolute;
  width: 2px;
  height: 100%;
  background: ${props => props.color || props.theme.colors.accent};
  opacity: 0.8;

  &:hover {
    opacity: 1;
    width: 4px;
  }
`;

const PerformanceChart = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: flex-end;
  gap: 0.3rem;
  height: 60px;
`;

const PerformanceBar = styled.div`
  flex: 1;
  background: ${props => props.value > 80 ? props.theme.colors.success :
                        props.value > 50 ? props.theme.colors.warning :
                        props.theme.colors.error};
  height: ${props => props.value}%;
  border-radius: 2px 2px 0 0;
  opacity: 0.8;
  transition: all 0.3s;

  &:hover {
    opacity: 1;
  }
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
`;

const SummaryValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.theme.colors.accent};
  margin-bottom: 0.3rem;
`;

const SummaryLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid ${props => props.theme.colors.overlay};
`;

const Tab = styled.button`
  padding: 0.8rem 1.5rem;
  background: none;
  border: none;
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.subtext};
  font-weight: ${props => props.active ? 600 : 400};
  cursor: pointer;
  position: relative;
  transition: all 0.3s;

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.theme.colors.accent};
    transform: scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.3s;
  }

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const CastSequence = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: ${props => props.theme.colors.primary};
  border-radius: 8px;
  margin-top: 1rem;
`;

const CastBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
`;

const CastIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.overlay};
  opacity: ${props => props.optimal ? 1 : 0.5};
`;

const CastTime = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.subtext};
`;

const OptimalIndicator = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.optimal ? props.theme.colors.success : props.theme.colors.error};
  margin-top: 0.2rem;
`;

function AbilityTracker({ combatData }) {
  const [view, setView] = useState('grid');
  const [activeTab, setActiveTab] = useState('cooldowns');

  // 샘플 데이터
  const abilities = combatData?.abilities || [
    {
      id: 1,
      name: '무모한 희생',
      icon: 'ability_warrior_recklessness',
      type: '주요 재사용 대기시간',
      cooldown: 90,
      duration: 10,
      casts: 3,
      possibleCasts: 4,
      avgDamageIncrease: '22%',
      uptimePercentage: 11,
      performance: 'medium',
      usageTimes: [5, 98, 195],
      efficiency: 75,
      castSequence: [
        { time: '0:05', optimal: true },
        { time: '1:38', optimal: true },
        { time: '3:15', optimal: false }
      ]
    },
    {
      id: 2,
      name: '피의 갈증',
      icon: 'spell_nature_bloodlust',
      type: '주력 능력',
      cooldown: 4.5,
      casts: 145,
      possibleCasts: 150,
      avgDamage: '125,430',
      critRate: '32%',
      performance: 'good',
      usageTimes: Array.from({length: 145}, (_, i) => i * 2.5),
      efficiency: 97
    },
    {
      id: 3,
      name: '아바타',
      icon: 'ability_warrior_avatar',
      type: '주요 재사용 대기시간',
      cooldown: 90,
      duration: 20,
      casts: 2,
      possibleCasts: 3,
      avgDamageIncrease: '18%',
      uptimePercentage: 13,
      performance: 'poor',
      usageTimes: [15, 150],
      efficiency: 67
    },
    {
      id: 4,
      name: '회오리바람',
      icon: 'ability_warrior_savageblow',
      type: '주력 능력',
      cooldown: 0,
      casts: 89,
      possibleCasts: 100,
      avgDamage: '189,320',
      critRate: '28%',
      performance: 'good',
      efficiency: 89
    },
    {
      id: 5,
      name: '칼날폭풍',
      icon: 'ability_warrior_bladestorm',
      type: '광역 능력',
      cooldown: 90,
      duration: 6,
      casts: 3,
      possibleCasts: 3,
      avgDamage: '452,100',
      targetsHit: '4.2',
      performance: 'good',
      usageTimes: [30, 120, 210],
      efficiency: 100
    },
    {
      id: 6,
      name: '소용돌이',
      icon: 'ability_whirlwind',
      type: '광역 능력',
      cooldown: 0,
      casts: 42,
      possibleCasts: 45,
      avgDamage: '78,900',
      targetsHit: '3.8',
      performance: 'medium',
      efficiency: 93
    }
  ];

  // 요약 통계
  const summary = {
    totalCasts: abilities.reduce((sum, ability) => sum + ability.casts, 0),
    efficiency: Math.round(abilities.reduce((sum, ability) => sum + ability.efficiency, 0) / abilities.length),
    cooldownsUsed: abilities.filter(a => a.type.includes('쿨다운')).reduce((sum, a) => sum + a.casts, 0),
    optimalUsage: Math.round(abilities.filter(a => a.performance === 'good').length / abilities.length * 100)
  };

  // 카테고리별 필터링
  const filteredAbilities = activeTab === 'all' ? abilities :
    activeTab === 'cooldowns' ? abilities.filter(a => a.type.includes('쿨다운')) :
    activeTab === 'rotation' ? abilities.filter(a => a.type === '주력 기술') :
    activeTab === 'aoe' ? abilities.filter(a => a.type === '광역 기술') :
    abilities;

  return (
    <Container>
      <Header>
        <Title>
          🎯 스킬 추적 & 분석
        </Title>
        <ViewToggle>
          <ViewButton active={view === 'grid'} onClick={() => setView('grid')}>
            그리드
          </ViewButton>
          <ViewButton active={view === 'timeline'} onClick={() => setView('timeline')}>
            타임라인
          </ViewButton>
          <ViewButton active={view === 'sequence'} onClick={() => setView('sequence')}>
            시퀀스
          </ViewButton>
        </ViewToggle>
      </Header>

      {/* 요약 */}
      <SummarySection>
        <SummaryCard>
          <SummaryValue>{summary.totalCasts}</SummaryValue>
          <SummaryLabel>총 시전 횟수</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue>{summary.efficiency}%</SummaryValue>
          <SummaryLabel>평균 효율성</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue>{summary.cooldownsUsed}</SummaryValue>
          <SummaryLabel>쿨다운 사용</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue>{summary.optimalUsage}%</SummaryValue>
          <SummaryLabel>최적 사용률</SummaryLabel>
        </SummaryCard>
      </SummarySection>

      {/* 탭 */}
      <TabContainer>
        <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          전체
        </Tab>
        <Tab active={activeTab === 'cooldowns'} onClick={() => setActiveTab('cooldowns')}>
          주요 쿨다운
        </Tab>
        <Tab active={activeTab === 'rotation'} onClick={() => setActiveTab('rotation')}>
          주력 기술
        </Tab>
        <Tab active={activeTab === 'aoe'} onClick={() => setActiveTab('aoe')}>
          광역 기술
        </Tab>
      </TabContainer>

      {/* 그리드 뷰 */}
      {view === 'grid' && (
        <AbilityGrid>
          {filteredAbilities.map((ability, index) => (
            <AbilityCard
              key={ability.id}
              performance={ability.performance}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AbilityHeader>
                <AbilityIcon>
                  <WowIcon icon={getWowIcon(ability.icon)} size={48} />
                </AbilityIcon>
                <AbilityInfo>
                  <AbilityName>{ability.name}</AbilityName>
                  <AbilityType>{ability.type}</AbilityType>
                </AbilityInfo>
              </AbilityHeader>

              <StatRow>
                <StatLabel>사용 횟수</StatLabel>
                <StatValue
                  bad={ability.casts < ability.possibleCasts * 0.7}
                  good={ability.casts >= ability.possibleCasts * 0.9}
                >
                  {ability.casts} / {ability.possibleCasts}
                </StatValue>
              </StatRow>

              {ability.cooldown > 0 && (
                <StatRow>
                  <StatLabel>재사용 대기</StatLabel>
                  <StatValue>{ability.cooldown}초</StatValue>
                </StatRow>
              )}

              {ability.avgDamage && (
                <StatRow>
                  <StatLabel>평균 피해</StatLabel>
                  <StatValue>{ability.avgDamage}</StatValue>
                </StatRow>
              )}

              {ability.avgDamageIncrease && (
                <StatRow>
                  <StatLabel>피해 증가</StatLabel>
                  <StatValue good>{ability.avgDamageIncrease}</StatValue>
                </StatRow>
              )}

              {ability.critRate && (
                <StatRow>
                  <StatLabel>치명타율</StatLabel>
                  <StatValue>{ability.critRate}</StatValue>
                </StatRow>
              )}

              {ability.targetsHit && (
                <StatRow>
                  <StatLabel>평균 타겟</StatLabel>
                  <StatValue>{ability.targetsHit}</StatValue>
                </StatRow>
              )}

              <StatRow>
                <StatLabel>효율성</StatLabel>
                <StatValue
                  bad={ability.efficiency < 70}
                  good={ability.efficiency > 90}
                >
                  {ability.efficiency}%
                </StatValue>
              </StatRow>

              {ability.usageTimes && ability.usageTimes.length <= 10 && (
                <UsageTimeline>
                  <TimelineBar>
                    {ability.usageTimes.map((time, idx) => (
                      <UsageMarker
                        key={idx}
                        style={{ left: `${(time / 300) * 100}%` }}
                        color={ability.performance === 'good' ? '#a6e3a1' :
                               ability.performance === 'poor' ? '#f38ba8' :
                               '#f9e2af'}
                      />
                    ))}
                  </TimelineBar>
                </UsageTimeline>
              )}
            </AbilityCard>
          ))}
        </AbilityGrid>
      )}

      {/* 시퀀스 뷰 */}
      {view === 'sequence' && (
        <div>
          {filteredAbilities.filter(a => a.castSequence).map(ability => (
            <div key={ability.id} style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <WowIcon icon={getWowIcon(ability.icon)} size={24} />
                <span style={{ fontWeight: 600 }}>{ability.name}</span>
              </div>
              <CastSequence>
                {ability.castSequence.map((cast, idx) => (
                  <CastBlock key={idx}>
                    <CastIcon optimal={cast.optimal}>
                      <WowIcon icon={getWowIcon(ability.icon)} size={36} />
                    </CastIcon>
                    <CastTime>{cast.time}</CastTime>
                    <OptimalIndicator optimal={cast.optimal} />
                  </CastBlock>
                ))}
              </CastSequence>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default AbilityTracker;