import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

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

const ResourceSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ResourceButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? props.color : props.theme.colors.secondary};
  color: ${props => props.active ? '#1a1b1e' : props.theme.colors.text};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${props => props.active ? 600 : 400};
  transition: all 0.3s;

  &:hover {
    background: ${props => props.color}88;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  border-left: 3px solid ${props => props.color};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.color || props.theme.colors.text};
  margin-bottom: 0.3rem;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 2rem;
`;

const WasteIndicator = styled.div`
  background: ${props => props.theme.colors.error}22;
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WasteIcon = styled.div`
  font-size: 2rem;
`;

const WasteInfo = styled.div`
  flex: 1;
`;

const WasteTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.3rem;
`;

const WasteDescription = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
`;

const AnalysisSection = styled.div`
  margin-top: 2rem;
`;

const AnalysisTitle = styled.h4`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InsightList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const InsightItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 0.8rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 8px;
  border-left: 3px solid ${props =>
    props.type === 'good' ? props.theme.colors.success :
    props.type === 'bad' ? props.theme.colors.error :
    props.theme.colors.warning
  };
`;

const InsightIcon = styled.div`
  font-size: 1.2rem;
  margin-top: 0.2rem;
`;

const InsightContent = styled.div`
  flex: 1;
`;

const InsightText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.4;
`;

const ResourceTimeline = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: ${props => props.theme.colors.primary};
  border-radius: 8px;
  overflow-x: auto;
`;

const TimelineSegment = styled.div`
  min-width: 40px;
  height: 40px;
  background: ${props => {
    const value = props.value;
    if (value > 90) return props.theme.colors.error;
    if (value > 75) return props.theme.colors.warning;
    if (value < 20) return props.theme.colors.info;
    return props.theme.colors.success;
  }};
  opacity: ${props => 0.3 + (props.value / 100) * 0.7};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: white;
  font-weight: 600;
`;

const CustomTooltipContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.accent};
  border-radius: 6px;
  padding: 0.8rem;
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.3rem;
  font-size: 0.85rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TooltipLabel = styled.span`
  color: ${props => props.theme.colors.subtext};
`;

const TooltipValue = styled.span`
  font-weight: 600;
  color: ${props => props.color || props.theme.colors.text};
`;

function ResourceTracker({ combatData }) {
  const [selectedResource, setSelectedResource] = useState('rage');

  // 자원 종류별 색상과 설정
  const resourceConfig = {
    rage: { name: '분노', color: '#f38ba8', max: 100 },
    energy: { name: '에너지', color: '#f9e2af', max: 100 },
    mana: { name: '마나', color: '#89dceb', max: 100 },
    runicPower: { name: '룬 마력', color: '#cba6f7', max: 100 },
    focus: { name: '집중', color: '#a6e3a1', max: 100 },
    comboPoints: { name: '연계 점수', color: '#fab387', max: 5 }
  };

  const config = resourceConfig[selectedResource];

  // 샘플 데이터 생성
  const generateResourceData = () => {
    const data = [];
    for (let i = 0; i <= 300; i += 5) {
      const base = Math.sin(i / 30) * 30 + 50;
      const spike = i % 60 === 0 ? 20 : 0;
      const value = Math.max(0, Math.min(config.max, base + spike + Math.random() * 10 - 5));

      data.push({
        time: i,
        value: Math.round(value),
        generated: Math.random() * 20,
        spent: Math.random() * 15,
        wasted: value > config.max * 0.95 ? Math.random() * 5 : 0
      });
    }
    return data;
  };

  const resourceData = combatData?.resourceData || generateResourceData();

  // 통계 계산
  const stats = {
    average: Math.round(resourceData.reduce((sum, d) => sum + d.value, 0) / resourceData.length),
    max: Math.max(...resourceData.map(d => d.value)),
    min: Math.min(...resourceData.map(d => d.value)),
    totalGenerated: Math.round(resourceData.reduce((sum, d) => sum + d.generated, 0)),
    totalSpent: Math.round(resourceData.reduce((sum, d) => sum + d.spent, 0)),
    totalWasted: Math.round(resourceData.reduce((sum, d) => sum + d.wasted, 0)),
    cappedTime: resourceData.filter(d => d.value >= config.max * 0.95).length * 5,
    starvationTime: resourceData.filter(d => d.value <= config.max * 0.1).length * 5
  };

  // 효율성 계산
  const efficiency = Math.round(((stats.totalSpent / (stats.totalGenerated || 1)) * 100));

  // 인사이트 생성
  const insights = [
    {
      type: stats.totalWasted > 100 ? 'bad' : 'good',
      icon: stats.totalWasted > 100 ? '⚠️' : '✅',
      text: `${config.name} 낭비: ${stats.totalWasted} (${Math.round(stats.totalWasted / stats.totalGenerated * 100)}%)`
    },
    {
      type: stats.cappedTime > 30 ? 'bad' : 'good',
      icon: stats.cappedTime > 30 ? '⚠️' : '✅',
      text: `캡 도달 시간: ${stats.cappedTime}초 (${Math.round(stats.cappedTime / 300 * 100)}%)`
    },
    {
      type: stats.starvationTime > 60 ? 'bad' : 'good',
      icon: stats.starvationTime > 60 ? '⚠️' : '✅',
      text: `자원 고갈 시간: ${stats.starvationTime}초 (${Math.round(stats.starvationTime / 300 * 100)}%)`
    },
    {
      type: efficiency < 80 ? 'bad' : efficiency < 90 ? 'warning' : 'good',
      icon: efficiency < 80 ? '❌' : efficiency < 90 ? '⚠️' : '✅',
      text: `자원 효율성: ${efficiency}% (생성 대비 사용)`
    }
  ];

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <CustomTooltipContent>
          <TooltipRow>
            <TooltipLabel>시간:</TooltipLabel>
            <TooltipValue>{Math.floor(label / 60)}:{(label % 60).toString().padStart(2, '0')}</TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>{config.name}:</TooltipLabel>
            <TooltipValue color={config.color}>{data.value} / {config.max}</TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>생성:</TooltipLabel>
            <TooltipValue color="#a6e3a1">+{data.generated.toFixed(1)}</TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>소비:</TooltipLabel>
            <TooltipValue color="#f38ba8">-{data.spent.toFixed(1)}</TooltipValue>
          </TooltipRow>
          {data.wasted > 0 && (
            <TooltipRow>
              <TooltipLabel>낭비:</TooltipLabel>
              <TooltipValue color="#f38ba8">{data.wasted.toFixed(1)}</TooltipValue>
            </TooltipRow>
          )}
        </CustomTooltipContent>
      );
    }
    return null;
  };

  return (
    <Container>
      <Header>
        <Title>
          ⚡ 자원 추적 & 분석
        </Title>
        <ResourceSelector>
          {Object.entries(resourceConfig).map(([key, resource]) => (
            <ResourceButton
              key={key}
              active={selectedResource === key}
              color={resource.color}
              onClick={() => setSelectedResource(key)}
            >
              {resource.name}
            </ResourceButton>
          ))}
        </ResourceSelector>
      </Header>

      {/* 통계 카드 */}
      <StatsGrid>
        <StatCard color={config.color}>
          <StatValue color={config.color}>{stats.average}</StatValue>
          <StatLabel>평균 {config.name}</StatLabel>
        </StatCard>
        <StatCard color="#a6e3a1">
          <StatValue color="#a6e3a1">{stats.totalGenerated}</StatValue>
          <StatLabel>총 생성량</StatLabel>
        </StatCard>
        <StatCard color="#89dceb">
          <StatValue color="#89dceb">{stats.totalSpent}</StatValue>
          <StatLabel>총 사용량</StatLabel>
        </StatCard>
        <StatCard color="#f38ba8">
          <StatValue color="#f38ba8">{stats.totalWasted}</StatValue>
          <StatLabel>총 낭비량</StatLabel>
        </StatCard>
        <StatCard color="#f9e2af">
          <StatValue color="#f9e2af">{efficiency}%</StatValue>
          <StatLabel>효율성</StatLabel>
        </StatCard>
        <StatCard color="#cba6f7">
          <StatValue color="#cba6f7">{stats.cappedTime}초</StatValue>
          <StatLabel>캡 도달</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* 낭비 경고 */}
      {stats.totalWasted > 100 && (
        <WasteIndicator>
          <WasteIcon>⚠️</WasteIcon>
          <WasteInfo>
            <WasteTitle>높은 자원 낭비 감지</WasteTitle>
            <WasteDescription>
              총 {stats.totalWasted}의 {config.name}가 낭비되었습니다.
              자원이 최대치에 도달하기 전에 소비 스킬을 사용하세요.
            </WasteDescription>
          </WasteInfo>
        </WasteIndicator>
      )}

      {/* 메인 차트 */}
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={resourceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#45475a" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tickFormatter={(value) => `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`}
            />
            <YAxis stroke="#94a3b8" domain={[0, config.max]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={config.max * 0.9} stroke="#f38ba8" strokeDasharray="5 5" />
            <ReferenceLine y={config.max * 0.1} stroke="#89dceb" strokeDasharray="5 5" />
            <Area
              type="monotone"
              dataKey="value"
              stroke={config.color}
              fill={config.color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 자원 타임라인 */}
      <AnalysisTitle>📊 자원 타임라인</AnalysisTitle>
      <ResourceTimeline>
        {resourceData.filter((_, i) => i % 6 === 0).map((data, index) => (
          <TimelineSegment
            key={index}
            value={data.value}
            title={`${Math.floor(data.time / 60)}:${(data.time % 60).toString().padStart(2, '0')} - ${data.value}/${config.max}`}
          >
            {Math.round((data.value / config.max) * 100)}
          </TimelineSegment>
        ))}
      </ResourceTimeline>

      {/* 분석 인사이트 */}
      <AnalysisSection>
        <AnalysisTitle>
          💡 자원 관리 인사이트
        </AnalysisTitle>
        <InsightList>
          {insights.map((insight, index) => (
            <InsightItem key={index} type={insight.type}>
              <InsightIcon>{insight.icon}</InsightIcon>
              <InsightContent>
                <InsightText>{insight.text}</InsightText>
              </InsightContent>
            </InsightItem>
          ))}
        </InsightList>
      </AnalysisSection>
    </Container>
  );
}

export default ResourceTracker;