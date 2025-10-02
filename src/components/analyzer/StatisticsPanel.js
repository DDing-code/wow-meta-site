import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Container = styled(motion.div)`
  background: rgba(37, 42, 61, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  font-family: ${props => props.theme.fonts.heading};
  font-weight: 700;
  background: ${props => props.theme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const OverallScore = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.gradients.dark};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  box-shadow: ${props => props.theme.shadows.inner};
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.gradients.glass};
    opacity: 0.3;
  }
`;

const ScoreCircle = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    ${props => props.score > 90 ? props.theme.colors.success :
              props.score > 75 ? props.theme.colors.warning :
              props.score > 50 ? '#fab387' : props.theme.colors.error} 0deg,
    ${props => props.score > 90 ? props.theme.colors.success :
              props.score > 75 ? props.theme.colors.warning :
              props.score > 50 ? '#fab387' : props.theme.colors.error} ${props => props.score * 3.6}deg,
    rgba(255, 255, 255, 0.1) ${props => props.score * 3.6}deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: ${props => props.theme.shadows.glow};
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.inner};
  }
`;

const ScoreText = styled.div`
  position: relative;
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.score > 90 ? '#a6e3a1' :
                   props.score > 75 ? '#f9e2af' :
                   props.score > 50 ? '#fab387' : '#f38ba8'};
`;

const ScoreInfo = styled.div`
  flex: 1;
`;

const ScoreTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const ScoreSubtitle = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: 1rem;
`;

const ScoreBreakdown = styled.div`
  display: flex;
  gap: 2rem;
`;

const BreakdownItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const BreakdownLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: 0.2rem;
`;

const BreakdownValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.color || props.theme.colors.text};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: 10px;
  padding: 1rem;
`;

const StatCardTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartContainer = styled.div`
  height: 250px;
`;

const MetricsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: ${props => props.theme.colors.primary};
  border-radius: 6px;
`;

const MetricLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

const MetricValue = styled.div`
  font-weight: 600;
  color: ${props => props.color || props.theme.colors.accent};
`;

const PercentileBar = styled.div`
  width: 100%;
  height: 30px;
  background: ${props => props.theme.colors.primary};
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  margin: 1rem 0;
`;

const PercentileFill = styled.div`
  height: 100%;
  width: ${props => props.value}%;
  background: linear-gradient(90deg,
    #f38ba8 0%,
    #fab387 25%,
    #f9e2af 50%,
    #a6e3a1 75%,
    #89dceb 100%
  );
  background-size: ${props => 100 / (props.value / 100)}% 100%;
  transition: width 1s ease;
`;

const PercentileMarker = styled.div`
  position: absolute;
  top: 50%;
  left: ${props => props.value}%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.accent};
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: ${props => props.theme.colors.accent};
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

function StatisticsPanel({ analysisData }) {
  const [activeTab, setActiveTab] = useState('overview');

  // 샘플 데이터
  const statistics = analysisData?.statistics || {
    overallScore: 85,
    percentile: 78,
    dps: 125430,
    hps: 0,
    dtps: 8540,
    apm: 42,

    damageBreakdown: [
      { name: '피의 갈증', value: 35, color: '#f38ba8' },
      { name: '분쇄', value: 25, color: '#fab387' },
      { name: '선풍', value: 15, color: '#f9e2af' },
      { name: '칼날폭풍', value: 12, color: '#a6e3a1' },
      { name: '기타', value: 13, color: '#cba6f7' }
    ],

    performanceRadar: [
      { metric: 'DPS', value: 85, fullMark: 100 },
      { metric: '로테이션', value: 78, fullMark: 100 },
      { metric: '쿨다운', value: 92, fullMark: 100 },
      { metric: '자원관리', value: 70, fullMark: 100 },
      { metric: '역학처리', value: 88, fullMark: 100 },
      { metric: '생존력', value: 95, fullMark: 100 }
    ],

    timelineMetrics: [
      { phase: '1페', dps: 118000, activity: 95 },
      { phase: '2페', dps: 125000, activity: 92 },
      { phase: '3페', dps: 132000, activity: 88 },
      { phase: '마지막', dps: 128000, activity: 90 }
    ],

    detailedMetrics: {
      damage: {
        total: 45234560,
        effective: 42156230,
        overkill: 3078330,
        absorbed: 1234567
      },
      casts: {
        total: 523,
        cpm: 42,
        cancelled: 3,
        clipped: 8
      },
      buffs: {
        uptime: 87,
        wasted: 13,
        refreshed: 24
      },
      movement: {
        downtime: 12,
        unnecessary: 5
      }
    }
  };

  const getScoreGrade = (score) => {
    if (score >= 95) return 'S';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#a6e3a1';
    if (score >= 75) return '#f9e2af';
    if (score >= 50) return '#fab387';
    return '#f38ba8';
  };

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload[0]) {
      return (
        <div style={{
          background: 'rgba(26, 27, 30, 0.95)',
          border: '1px solid #45475a',
          borderRadius: '6px',
          padding: '0.5rem'
        }}>
          <p style={{ color: '#cdd6f4', margin: 0 }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: 0 }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Container>
      <Header>
        <Title>
          📊 성능 통계 & 메트릭
        </Title>
      </Header>

      {/* 전체 점수 */}
      <OverallScore>
        <ScoreCircle score={statistics.overallScore}>
          <ScoreText score={statistics.overallScore}>
            {statistics.overallScore}
          </ScoreText>
        </ScoreCircle>
        <ScoreInfo>
          <ScoreTitle>종합 성능 점수</ScoreTitle>
          <ScoreSubtitle>
            등급: {getScoreGrade(statistics.overallScore)} |
            상위 {100 - statistics.percentile}% (서버 기준)
          </ScoreSubtitle>
          <ScoreBreakdown>
            <BreakdownItem>
              <BreakdownLabel>DPS</BreakdownLabel>
              <BreakdownValue color="#f38ba8">
                {statistics.dps.toLocaleString()}
              </BreakdownValue>
            </BreakdownItem>
            <BreakdownItem>
              <BreakdownLabel>백분위</BreakdownLabel>
              <BreakdownValue color="#f9e2af">
                {statistics.percentile}%
              </BreakdownValue>
            </BreakdownItem>
            <BreakdownItem>
              <BreakdownLabel>APM</BreakdownLabel>
              <BreakdownValue color="#a6e3a1">
                {statistics.apm}
              </BreakdownValue>
            </BreakdownItem>
            <BreakdownItem>
              <BreakdownLabel>DTPS</BreakdownLabel>
              <BreakdownValue color="#89dceb">
                {statistics.dtps.toLocaleString()}
              </BreakdownValue>
            </BreakdownItem>
          </ScoreBreakdown>
        </ScoreInfo>
      </OverallScore>

      {/* 백분위 바 */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
          서버 백분위 순위
        </div>
        <PercentileBar>
          <PercentileFill value={statistics.percentile} />
          <PercentileMarker value={statistics.percentile}>
            {statistics.percentile}
          </PercentileMarker>
        </PercentileBar>
      </div>

      {/* 탭 */}
      <TabContainer>
        <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          개요
        </Tab>
        <Tab active={activeTab === 'damage'} onClick={() => setActiveTab('damage')}>
          피해량
        </Tab>
        <Tab active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')}>
          타임라인
        </Tab>
        <Tab active={activeTab === 'details'} onClick={() => setActiveTab('details')}>
          상세
        </Tab>
      </TabContainer>

      {/* 통계 그리드 */}
      <StatsGrid>
        {activeTab === 'overview' && (
          <>
            {/* 피해량 분포 */}
            <StatCard>
              <StatCardTitle>
                🎯 피해량 분포
              </StatCardTitle>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statistics.damageBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statistics.damageBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </StatCard>

            {/* 성능 레이더 */}
            <StatCard>
              <StatCardTitle>
                📈 성능 분석
              </StatCardTitle>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={statistics.performanceRadar}>
                    <PolarGrid stroke="#45475a" />
                    <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
                    <PolarRadiusAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Radar
                      name="성능"
                      dataKey="value"
                      stroke="#f38ba8"
                      fill="#f38ba8"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </StatCard>
          </>
        )}

        {activeTab === 'timeline' && (
          <>
            {/* 페이즈별 DPS */}
            <StatCard>
              <StatCardTitle>
                ⏱️ 페이즈별 DPS
              </StatCardTitle>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistics.timelineMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#45475a" />
                    <XAxis dataKey="phase" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="dps" fill="#f38ba8" />
                    <Bar dataKey="activity" fill="#a6e3a1" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </StatCard>

            {/* 활동 시간 */}
            <StatCard>
              <StatCardTitle>
                ⚡ 활동 메트릭
              </StatCardTitle>
              <MetricsList>
                <MetricRow>
                  <MetricLabel>
                    <span>🎯</span> 활동 시간
                  </MetricLabel>
                  <MetricValue>88%</MetricValue>
                </MetricRow>
                <MetricRow>
                  <MetricLabel>
                    <span>🏃</span> 이동 시간
                  </MetricLabel>
                  <MetricValue color="#f9e2af">12%</MetricValue>
                </MetricRow>
                <MetricRow>
                  <MetricLabel>
                    <span>⏸️</span> 대기 시간
                  </MetricLabel>
                  <MetricValue color="#f38ba8">5%</MetricValue>
                </MetricRow>
                <MetricRow>
                  <MetricLabel>
                    <span>💀</span> 죽음 시간
                  </MetricLabel>
                  <MetricValue color="#f38ba8">0%</MetricValue>
                </MetricRow>
              </MetricsList>
            </StatCard>
          </>
        )}

        {activeTab === 'details' && (
          <>
            {/* 피해 상세 */}
            <StatCard>
              <StatCardTitle>
                ⚔️ 피해 상세
              </StatCardTitle>
              <MetricsList>
                <MetricRow>
                  <MetricLabel>총 피해량</MetricLabel>
                  <MetricValue>{statistics.detailedMetrics.damage.total.toLocaleString()}</MetricValue>
                </MetricRow>
                <MetricRow>
                  <MetricLabel>유효 피해</MetricLabel>
                  <MetricValue color="#a6e3a1">{statistics.detailedMetrics.damage.effective.toLocaleString()}</MetricValue>
                </MetricRow>
                <MetricRow>
                  <MetricLabel>과다 피해</MetricLabel>
                  <MetricValue color="#f9e2af">{statistics.detailedMetrics.damage.overkill.toLocaleString()}</MetricValue>
                </MetricRow>
                <MetricRow>
                  <MetricLabel>흡수된 피해</MetricLabel>
                  <MetricValue color="#89dceb">{statistics.detailedMetrics.damage.absorbed.toLocaleString()}</MetricValue>
                </MetricRow>
              </MetricsList>
            </StatCard>

            {/* 시전 통계 */}
            <StatCard>
              <StatCardTitle>
                🎯 시전 통계
              </StatCardTitle>
              <MetricsList>
                <MetricRow>
                  <MetricLabel>총 시전</MetricLabel>
                  <MetricValue>{statistics.detailedMetrics.casts.total}</MetricValue>
                </MetricRow>
                <MetricRow>
                  <MetricLabel>분당 시전(CPM)</MetricLabel>
                  <MetricValue color="#a6e3a1">{statistics.detailedMetrics.casts.cpm}</MetricValue>
                </MetricRow>
                <MetricRow>
                  <MetricLabel>취소된 시전</MetricLabel>
                  <MetricValue color="#f38ba8">{statistics.detailedMetrics.casts.cancelled}</MetricValue>
                </MetricRow>
                <MetricRow>
                  <MetricLabel>끊긴 시전</MetricLabel>
                  <MetricValue color="#fab387">{statistics.detailedMetrics.casts.clipped}</MetricValue>
                </MetricRow>
              </MetricsList>
            </StatCard>
          </>
        )}
      </StatsGrid>
    </Container>
  );
}

export default StatisticsPanel;