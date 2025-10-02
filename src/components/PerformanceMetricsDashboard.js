import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, ScatterChart, Scatter
} from 'recharts';
import {
  Activity, TrendingUp, TrendingDown, AlertCircle,
  Target, Zap, Shield, Heart, Award, Users,
  Clock, BarChart2, PieChart as PieChartIcon,
  Eye, Settings, RefreshCw, Download
} from 'lucide-react';

const DashboardContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const ControlButton = styled(motion.button)`
  padding: 10px 20px;
  background: ${props => props.active ?
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
    'rgba(255, 255, 255, 0.05)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.active ?
      'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' :
      'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.color || 'linear-gradient(90deg, #667eea, #764ba2)'};
  }
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const MetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 5px;
`;

const MetricValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const MetricChange = styled.span`
  font-size: 14px;
  color: ${props => props.positive ? '#4ade80' : '#f87171'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MetricIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.bgColor || 'rgba(102, 126, 234, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#667eea'};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
`;

const ChartCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChartOptions = styled.div`
  display: flex;
  gap: 10px;
`;

const ChartOption = styled.button`
  padding: 5px 10px;
  background: ${props => props.active ?
    'rgba(102, 126, 234, 0.3)' :
    'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ?
    'rgba(102, 126, 234, 0.5)' :
    'rgba(255, 255, 255, 0.1)'};
  border-radius: 5px;
  color: ${props => props.active ? '#667eea' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
  }
`;

const RankingSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
`;

const RankingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const RankingCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 15px;
`;

const RankingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const RankNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props =>
    props.rank === 1 ? 'linear-gradient(135deg, #ffd700, #ffed4e)' :
    props.rank === 2 ? 'linear-gradient(135deg, #c0c0c0, #e8e8e8)' :
    props.rank === 3 ? 'linear-gradient(135deg, #cd7f32, #e8a767)' :
    'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: ${props => props.rank <= 3 ? '#000' : '#fff'};
  font-size: 14px;
`;

const RankInfo = styled.div`
  flex: 1;
`;

const RankName = styled.div`
  font-weight: 600;
  color: #fff;
  margin-bottom: 3px;
`;

const RankDetails = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const RankValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.color || '#667eea'};
`;

const AlertsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
`;

const AlertItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: ${props =>
    props.severity === 'critical' ? 'rgba(248, 113, 113, 0.1)' :
    props.severity === 'warning' ? 'rgba(251, 191, 36, 0.1)' :
    'rgba(74, 222, 128, 0.1)'};
  border: 1px solid ${props =>
    props.severity === 'critical' ? 'rgba(248, 113, 113, 0.3)' :
    props.severity === 'warning' ? 'rgba(251, 191, 36, 0.3)' :
    'rgba(74, 222, 128, 0.3)'};
  border-radius: 10px;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const AlertIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props =>
    props.severity === 'critical' ? 'rgba(248, 113, 113, 0.2)' :
    props.severity === 'warning' ? 'rgba(251, 191, 36, 0.2)' :
    'rgba(74, 222, 128, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props =>
    props.severity === 'critical' ? '#f87171' :
    props.severity === 'warning' ? '#fbbf24' :
    '#4ade80'};
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  font-weight: 600;
  color: #fff;
  margin-bottom: 5px;
`;

const AlertDescription = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const AlertTime = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;

const PerformanceMetricsDashboard = ({ classData, spec }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [viewMode, setViewMode] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('dps');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // 성능 메트릭 데이터
  const performanceData = [
    { date: '월', dps: 145000, hps: 98000, mitigation: 85 },
    { date: '화', dps: 148000, hps: 102000, mitigation: 87 },
    { date: '수', dps: 152000, hps: 99000, mitigation: 86 },
    { date: '목', dps: 149000, hps: 105000, mitigation: 88 },
    { date: '금', dps: 155000, hps: 103000, mitigation: 89 },
    { date: '토', dps: 158000, hps: 107000, mitigation: 91 },
    { date: '일', dps: 161000, hps: 110000, mitigation: 92 }
  ];

  // 스킬 사용 분포
  const skillDistribution = [
    { name: '주요 스킬', value: 35, color: '#667eea' },
    { name: '보조 스킬', value: 25, color: '#764ba2' },
    { name: '쿨다운 스킬', value: 20, color: '#a78bfa' },
    { name: '생존기', value: 10, color: '#c084fc' },
    { name: '유틸리티', value: 10, color: '#e879f9' }
  ];

  // 레이드별 성능
  const raidPerformance = [
    { raid: '네루바르 왕궁', mythic: 95, heroic: 98, normal: 100 },
    { raid: '아베루스', mythic: 92, heroic: 96, normal: 99 },
    { raid: '금고', mythic: 88, heroic: 94, normal: 98 }
  ];

  // 랭킹 데이터
  const topPlayers = [
    { rank: 1, name: 'Imfiredup', server: 'Area 52', score: 3850, spec: '화염' },
    { rank: 2, name: 'Jeathe', server: 'Stormrage', score: 3820, spec: '냉기' },
    { rank: 3, name: 'Drjay', server: 'Illidan', score: 3795, spec: '비전' },
    { rank: 4, name: 'Pikaboo', server: 'Tichondrius', score: 3780, spec: '화염' },
    { rank: 5, name: 'Cdew', server: 'Sargeras', score: 3765, spec: '비전' }
  ];

  // 알림 데이터
  const alerts = [
    {
      severity: 'critical',
      title: '로테이션 효율 저하',
      description: '최근 5번의 전투에서 주요 스킬 사용률이 15% 감소했습니다',
      time: '5분 전'
    },
    {
      severity: 'warning',
      title: '쿨다운 관리 개선 필요',
      description: '폭발 쿨다운을 평균 8초 늦게 사용하고 있습니다',
      time: '12분 전'
    },
    {
      severity: 'info',
      title: '새로운 BiS 장비 발견',
      description: '신화+ 20단에서 더 나은 반지를 획득할 수 있습니다',
      time: '1시간 전'
    }
  ];

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // 데이터 새로고침 로직
        console.log('데이터 새로고침');
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <DashboardContainer>
      <Header>
        <Title>
          <Activity size={28} />
          성능 메트릭 대시보드
        </Title>
        <Controls>
          <ControlButton
            active={timeRange === 'day'}
            onClick={() => setTimeRange('day')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            일간
          </ControlButton>
          <ControlButton
            active={timeRange === 'week'}
            onClick={() => setTimeRange('week')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            주간
          </ControlButton>
          <ControlButton
            active={timeRange === 'month'}
            onClick={() => setTimeRange('month')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            월간
          </ControlButton>
          <ControlButton
            active={autoRefresh}
            onClick={() => setAutoRefresh(!autoRefresh)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            자동 새로고침
          </ControlButton>
          <ControlButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            내보내기
          </ControlButton>
        </Controls>
      </Header>

      <MetricsGrid>
        <MetricCard
          color="linear-gradient(90deg, #f87171, #ef4444)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricHeader>
            <div>
              <MetricLabel>평균 DPS</MetricLabel>
              <MetricValue>
                161.2K
                <MetricChange positive>
                  <TrendingUp size={16} />
                  +8.5%
                </MetricChange>
              </MetricValue>
            </div>
            <MetricIcon bgColor="rgba(248, 113, 113, 0.2)" color="#f87171">
              <Zap size={20} />
            </MetricIcon>
          </MetricHeader>
        </MetricCard>

        <MetricCard
          color="linear-gradient(90deg, #4ade80, #22c55e)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricHeader>
            <div>
              <MetricLabel>파싱 점수</MetricLabel>
              <MetricValue>
                95.8
                <MetricChange positive>
                  <TrendingUp size={16} />
                  +2.3
                </MetricChange>
              </MetricValue>
            </div>
            <MetricIcon bgColor="rgba(74, 222, 128, 0.2)" color="#4ade80">
              <Award size={20} />
            </MetricIcon>
          </MetricHeader>
        </MetricCard>

        <MetricCard
          color="linear-gradient(90deg, #60a5fa, #3b82f6)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricHeader>
            <div>
              <MetricLabel>생존율</MetricLabel>
              <MetricValue>
                92%
                <MetricChange negative>
                  <TrendingDown size={16} />
                  -3%
                </MetricChange>
              </MetricValue>
            </div>
            <MetricIcon bgColor="rgba(96, 165, 250, 0.2)" color="#60a5fa">
              <Shield size={20} />
            </MetricIcon>
          </MetricHeader>
        </MetricCard>

        <MetricCard
          color="linear-gradient(90deg, #a78bfa, #8b5cf6)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricHeader>
            <div>
              <MetricLabel>M+ 점수</MetricLabel>
              <MetricValue>
                3,245
                <MetricChange positive>
                  <TrendingUp size={16} />
                  +125
                </MetricChange>
              </MetricValue>
            </div>
            <MetricIcon bgColor="rgba(167, 139, 250, 0.2)" color="#a78bfa">
              <Target size={20} />
            </MetricIcon>
          </MetricHeader>
        </MetricCard>
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChartHeader>
            <ChartTitle>
              <BarChart2 size={20} />
              성능 추이
            </ChartTitle>
            <ChartOptions>
              <ChartOption active={selectedMetric === 'dps'} onClick={() => setSelectedMetric('dps')}>
                DPS
              </ChartOption>
              <ChartOption active={selectedMetric === 'hps'} onClick={() => setSelectedMetric('hps')}>
                HPS
              </ChartOption>
              <ChartOption active={selectedMetric === 'mitigation'} onClick={() => setSelectedMetric('mitigation')}>
                경감
              </ChartOption>
            </ChartOptions>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px'
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#667eea"
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ChartHeader>
            <ChartTitle>
              <PieChartIcon size={20} />
              스킬 사용 분포
            </ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => `${entry.name}: ${entry.value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {skillDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <RankingSection>
        <ChartTitle>
          <Users size={20} />
          상위 플레이어 랭킹
        </ChartTitle>
        <RankingGrid>
          {topPlayers.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <RankingItem>
                <RankNumber rank={player.rank}>{player.rank}</RankNumber>
                <RankInfo>
                  <RankName>{player.name}</RankName>
                  <RankDetails>{player.server} - {player.spec}</RankDetails>
                </RankInfo>
                <RankValue color={player.rank <= 3 ? '#ffd700' : '#667eea'}>
                  {player.score}
                </RankValue>
              </RankingItem>
            </motion.div>
          ))}
        </RankingGrid>
      </RankingSection>

      <AlertsSection>
        <ChartTitle>
          <AlertCircle size={20} />
          실시간 알림
        </ChartTitle>
        <div style={{ marginTop: '20px' }}>
          {alerts.map((alert, index) => (
            <AlertItem
              key={index}
              severity={alert.severity}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
            >
              <AlertIcon severity={alert.severity}>
                <AlertCircle size={20} />
              </AlertIcon>
              <AlertContent>
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
                <AlertTime>{alert.time}</AlertTime>
              </AlertContent>
            </AlertItem>
          ))}
        </div>
      </AlertsSection>
    </DashboardContainer>
  );
};

export default PerformanceMetricsDashboard;