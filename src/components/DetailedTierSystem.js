import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { gameIcons, statIcons, WowIcon } from '../utils/wowIcons';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #f38ba8, #cba6f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ContentSelector = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const ContentButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: ${props => props.active ? props.theme.colors.accent : props.theme.colors.surface};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.primary};
  }
`;

const TierGrid = styled.div`
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const TierRow = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 15px;
  padding: 1.5rem;
  border-left: 5px solid ${props => props.tierColor};
`;

const TierHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TierLabel = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TierDescription = styled.div`
  flex: 1;
  color: ${props => props.theme.colors.subtext};
`;

const SpecGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const SpecCard = styled(motion.div)`
  background: ${props => props.theme.colors.secondary};
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.classColor};
  }
`;

const SpecHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SpecName = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const ClassName = styled.div`
  font-size: 0.85rem;
  color: ${props => props.color};
  margin-bottom: 0.5rem;
`;

const MetricsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Metric = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
`;

const TrendIcon = styled.span`
  color: ${props => props.trend === 'up' ? '#a6e3a1' :
                     props.trend === 'down' ? '#f38ba8' :
                     '#f9e2af'};
`;

const DetailModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.colors.primary};
  border-radius: 20px;
  padding: 2rem;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.surface};
  border: none;
  color: ${props => props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
`;

const ChartSection = styled.div`
  margin: 2rem 0;
`;

const ChartTitle = styled.h3`
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.accent};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 10px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.color || props.theme.colors.accent};
`;

function DetailedTierSystem() {
  const [contentType, setContentType] = useState('raid');
  const [selectedSpec, setSelectedSpec] = useState(null);

  const getTierColor = (tier) => {
    switch(tier) {
      case 'S+': return '#ff1744';
      case 'S': return '#ff6b6b';
      case 'A': return '#4ecdc4';
      case 'B': return '#45b7d1';
      case 'C': return '#96ceb4';
      case 'D': return '#95a5a6';
      default: return '#dfe6e9';
    }
  };

  const classColors = {
    '죽음기사': '#C41E3A',
    '악마사냥꾼': '#A330C9',
    '드루이드': '#FF7C0A',
    '기원사': '#33937F',
    '사냥꾼': '#AAD372',
    '마법사': '#3FC7EB',
    '수도사': '#00FF98',
    '성기사': '#F48CBA',
    '사제': '#FFFFFF',
    '도적': '#FFF468',
    '주술사': '#0070DD',
    '흑마법사': '#8788EE',
    '전사': '#C69B6D'
  };

  const tierData = {
    raid: {
      'S+': {
        description: '최상위 메타 - 필수 픽',
        specs: [
          { spec: '부정', class: '죽음기사', winRate: 98.2, pickRate: 45.3, banRate: 0, trend: 'up', dps: 195000 },
          { spec: '황폐', class: '기원사', winRate: 97.8, pickRate: 42.1, banRate: 0, trend: 'up', dps: 192000 }
        ]
      },
      'S': {
        description: '메타 정의 - 매우 강력',
        specs: [
          { spec: '암흑', class: '사제', winRate: 95.4, pickRate: 38.7, banRate: 0, trend: 'stable', dps: 185000 },
          { spec: '잠행', class: '도적', winRate: 94.8, pickRate: 35.2, banRate: 0, trend: 'up', dps: 183000 },
          { spec: '고양', class: '주술사', winRate: 94.2, pickRate: 33.8, banRate: 0, trend: 'up', dps: 181000 },
          { spec: '분노', class: '전사', winRate: 93.9, pickRate: 32.4, banRate: 0, trend: 'stable', dps: 180000 }
        ]
      },
      'A': {
        description: '경쟁력 있음 - 좋은 선택',
        specs: [
          { spec: '파멸', class: '악마사냥꾼', winRate: 88.3, pickRate: 28.5, banRate: 0, trend: 'stable', dps: 172000 },
          { spec: '조화', class: '드루이드', winRate: 87.9, pickRate: 26.3, banRate: 0, trend: 'down', dps: 170000 },
          { spec: '야수', class: '사냥꾼', winRate: 87.2, pickRate: 25.8, banRate: 0, trend: 'stable', dps: 168000 },
          { spec: '비전', class: '마법사', winRate: 86.5, pickRate: 24.2, banRate: 0, trend: 'up', dps: 167000 }
        ]
      },
      'B': {
        description: '실행 가능 - 특정 상황에서 유용',
        specs: [
          { spec: '냉기', class: '죽음기사', winRate: 78.4, pickRate: 15.3, banRate: 0, trend: 'stable', dps: 155000 },
          { spec: '야성', class: '드루이드', winRate: 77.2, pickRate: 14.1, banRate: 0, trend: 'down', dps: 152000 },
          { spec: '화염', class: '마법사', winRate: 76.8, pickRate: 13.5, banRate: 0, trend: 'down', dps: 150000 }
        ]
      },
      'C': {
        description: '약함 - 버프 필요',
        specs: [
          { spec: '생존', class: '사냥꾼', winRate: 65.3, pickRate: 5.2, banRate: 0, trend: 'down', dps: 135000 }
        ]
      }
    },
    mythicplus: {
      'S+': {
        description: '신화+ 필수 - 최고 효율',
        specs: [
          { spec: '복수', class: '악마사냥꾼', winRate: 98.5, pickRate: 52.3, banRate: 12.5, trend: 'up', score: 3250 },
          { spec: '보호', class: '성기사', winRate: 97.9, pickRate: 48.7, banRate: 8.3, trend: 'stable', score: 3200 }
        ]
      },
      'S': {
        description: '탑티어 - 높은 키에서 선호',
        specs: [
          { spec: '보존', class: '기원사', winRate: 96.2, pickRate: 45.3, banRate: 5.2, trend: 'up', hps: 185000 },
          { spec: '복원', class: '주술사', winRate: 95.8, pickRate: 42.1, banRate: 3.8, trend: 'stable', hps: 180000 }
        ]
      }
    },
    pvp: {
      'S+': {
        description: 'PvP 지배 - 3v3 필수',
        specs: [
          { spec: '암살', class: '도적', winRate: 58.3, pickRate: 35.2, banRate: 45.3, trend: 'up', rating: 2400 },
          { spec: '수양', class: '사제', winRate: 57.8, pickRate: 33.8, banRate: 42.1, trend: 'stable', rating: 2350 }
        ]
      }
    }
  };

  const currentTierData = tierData[contentType];

  const specDetailData = {
    performanceHistory: [
      { patch: '11.0', dps: 165000, rank: 8 },
      { patch: '11.0.5', dps: 172000, rank: 6 },
      { patch: '11.1', dps: 178000, rank: 4 },
      { patch: '11.1.5', dps: 185000, rank: 2 },
      { patch: '11.2', dps: 195000, rank: 1 }
    ],
    radarData: [
      { stat: '단일 피해', value: 95 },
      { stat: '광역 피해', value: 88 },
      { stat: '생존력', value: 82 },
      { stat: '기동성', value: 65 },
      { stat: '유틸리티', value: 70 },
      { stat: '버스트', value: 92 }
    ]
  };

  return (
    <Container>
      <Header>
        <Title>상세 티어 리스트 & 메트릭스</Title>
        <p style={{ color: '#a6adc8' }}>
          실시간 데이터 기반 성능 분석 (11.2.0 패치)
        </p>
      </Header>

      <ContentSelector>
        <ContentButton
          active={contentType === 'raid'}
          onClick={() => setContentType('raid')}
        >
          레이드
        </ContentButton>
        <ContentButton
          active={contentType === 'mythicplus'}
          onClick={() => setContentType('mythicplus')}
        >
          신화+
        </ContentButton>
        <ContentButton
          active={contentType === 'pvp'}
          onClick={() => setContentType('pvp')}
        >
          PvP
        </ContentButton>
      </ContentSelector>

      <TierGrid>
        {Object.entries(currentTierData).map(([tier, data], index) => (
          <TierRow
            key={tier}
            tierColor={getTierColor(tier)}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TierHeader>
              <TierLabel color={getTierColor(tier)}>
                {tier}
                {tier === 'S+' && <WowIcon icon={gameIcons.legendary} size={20} style={{ marginLeft: '0.5rem' }} />}
              </TierLabel>
              <TierDescription>{data.description}</TierDescription>
            </TierHeader>

            <SpecGrid>
              {data.specs.map((spec, idx) => (
                <SpecCard
                  key={idx}
                  classColor={classColors[spec.class]}
                  onClick={() => setSelectedSpec(spec)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SpecHeader>
                    <div>
                      <SpecName>{spec.spec}</SpecName>
                      <ClassName color={classColors[spec.class]}>
                        {spec.class}
                      </ClassName>
                    </div>
                    <TrendIcon trend={spec.trend}>
                      {spec.trend === 'up' ? <FaArrowUp /> :
                       spec.trend === 'down' ? <FaArrowDown /> :
                       <FaMinus />}
                    </TrendIcon>
                  </SpecHeader>

                  <MetricsRow>
                    <Metric>
                      <WowIcon icon={gameIcons.achievement} size={16} style={{ marginRight: '0.3rem' }} />
                      {spec.winRate}% 승률
                    </Metric>
                    <Metric>
                      <WowIcon icon={gameIcons.damage} size={16} style={{ marginRight: '0.3rem' }} />
                      {spec.pickRate}% 픽률
                    </Metric>
                  </MetricsRow>

                  {spec.dps && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#f38ba8' }}>
                      DPS: {(spec.dps / 1000).toFixed(0)}K
                    </div>
                  )}
                  {spec.hps && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#a6e3a1' }}>
                      HPS: {(spec.hps / 1000).toFixed(0)}K
                    </div>
                  )}
                  {spec.rating && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#cba6f7' }}>
                      Rating: {spec.rating}+
                    </div>
                  )}
                </SpecCard>
              ))}
            </SpecGrid>
          </TierRow>
        ))}
      </TierGrid>

      {selectedSpec && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSpec(null)}
          />
          <DetailModal
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <ModalHeader>
              <div>
                <h2 style={{ color: classColors[selectedSpec.class] }}>
                  {selectedSpec.spec} {selectedSpec.class}
                </h2>
                <p style={{ color: '#a6adc8', marginTop: '0.5rem' }}>
                  상세 성능 분석
                </p>
              </div>
              <CloseButton onClick={() => setSelectedSpec(null)}>
                닫기
              </CloseButton>
            </ModalHeader>

            <StatsGrid>
              <StatCard>
                <StatLabel>승률</StatLabel>
                <StatValue color="#a6e3a1">{selectedSpec.winRate}%</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>픽률</StatLabel>
                <StatValue color="#f9e2af">{selectedSpec.pickRate}%</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>DPS/HPS</StatLabel>
                <StatValue color="#f38ba8">
                  {selectedSpec.dps ? `${(selectedSpec.dps / 1000).toFixed(0)}K` :
                   selectedSpec.hps ? `${(selectedSpec.hps / 1000).toFixed(0)}K` :
                   'N/A'}
                </StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>메타 트렌드</StatLabel>
                <StatValue color={selectedSpec.trend === 'up' ? '#a6e3a1' :
                                  selectedSpec.trend === 'down' ? '#f38ba8' : '#f9e2af'}>
                  {selectedSpec.trend === 'up' ? '상승 ↑' :
                   selectedSpec.trend === 'down' ? '하락 ↓' :
                   '유지 →'}
                </StatValue>
              </StatCard>
            </StatsGrid>

            <ChartSection>
              <ChartTitle>성능 히스토리</ChartTitle>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={specDetailData.performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="patch" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="dps"
                    stroke="#f38ba8"
                    name="DPS"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rank"
                    stroke="#cba6f7"
                    name="순위"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartSection>

            <ChartSection>
              <ChartTitle>스펙 능력치</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={specDetailData.radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="stat" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="능력치"
                    dataKey="value"
                    stroke={classColors[selectedSpec.class]}
                    fill={classColors[selectedSpec.class]}
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartSection>
          </DetailModal>
        </>
      )}
    </Container>
  );
}

export default DetailedTierSystem;