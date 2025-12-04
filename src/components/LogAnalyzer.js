import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { gameIcons, WowIcon } from '../utils/wowIcons.js';
import { FaTimes } from 'react-icons/fa';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Container = styled.div`
  padding: 2rem;
  background: ${props => props.theme.colors.surface};
  border-radius: 15px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text};
`;

const UploadSection = styled.div`
  border: 2px dashed ${props => props.theme.colors.accent};
  border-radius: 10px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const MetricCard = styled(motion.div)`
  background: ${props => props.theme.colors.secondary};
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.color || props.theme.colors.accent};
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.subtext};
`;

const AnalysisSection = styled.div`
  margin-top: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.colors.secondary};
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.subtext};
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${props.theme.colors.accent};
    }
  `}
`;

const IssuesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const IssueCard = styled.div`
  background: ${props => props.severity === 'critical' ? 'rgba(243, 139, 168, 0.1)' :
                         props.severity === 'warning' ? 'rgba(249, 226, 175, 0.1)' :
                         'rgba(166, 227, 161, 0.1)'};
  border-left: 4px solid ${props => props.severity === 'critical' ? '#f38ba8' :
                                     props.severity === 'warning' ? '#f9e2af' :
                                     '#a6e3a1'};
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IssueIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.color};
`;

const IssueContent = styled.div`
  flex: 1;
`;

const IssueTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.3rem;
`;

const IssueDescription = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.subtext};
`;

const ChartContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 10px;
`;

function LogAnalyzer({ classData, specData }) {
  const [logData, setLogData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [analysis, setAnalysis] = useState(null);

  // 모의 로그 데이터 생성
  useEffect(() => {
    const mockLogData = {
      playerName: "냉죽법사",
      class: "마법사",
      spec: "냉기",
      duration: "5:32",
      dps: 185432,
      hps: 0,
      dtps: 12543,
      parsePercentile: 92,
      ilvl: 489,
      encounter: "마나단조 오메가 - 1넴",

      metrics: {
        damage: 61584320,
        healing: 0,
        damageTaken: 4165476,
        deaths: 0,
        interrupts: 3,
        dispels: 1,
        activetime: 95.2
      },

      resources: {
        manaUsage: [
          { time: '0:00', value: 100 },
          { time: '1:00', value: 85 },
          { time: '2:00', value: 70 },
          { time: '3:00', value: 95 },
          { time: '4:00', value: 60 },
          { time: '5:00', value: 45 }
        ]
      },

      abilities: [
        { name: '서리 화살', count: 145, damage: 18543210, percentage: 30.1 },
        { name: '얼음 창', count: 89, damage: 15432100, percentage: 25.1 },
        { name: '빙하 가시', count: 23, damage: 12354320, percentage: 20.1 },
        { name: '얼음불꽃 화살', count: 67, damage: 9876540, percentage: 16.0 },
        { name: '냉기 돌풍', count: 12, damage: 5378350, percentage: 8.7 }
      ],

      timeline: [
        { time: 0, event: '전투 시작', type: 'info' },
        { time: 3, event: '얼음 핏줄 사용', type: 'cooldown' },
        { time: 15, event: '시간 왜곡 사용', type: 'cooldown' },
        { time: 45, event: '빙하 가시 5중첩', type: 'success' },
        { time: 67, event: '얼음 방패 (큰 피해 회피)', type: 'defensive' },
        { time: 120, event: '얼음 핏줄 사용', type: 'cooldown' },
        { time: 180, event: '2페이즈 전환', type: 'phase' },
        { time: 245, event: '얼음 핏줄 사용', type: 'cooldown' },
        { time: 332, event: '전투 종료', type: 'info' }
      ],

      issues: [
        {
          severity: 'critical',
          title: '빙하 가시 사용량 부족',
          description: '5중첩 빙하 가시를 23번만 사용 (예상: 35번 이상)',
          solution: '고드름 5중첩 관리 개선 필요'
        },
        {
          severity: 'warning',
          title: '얼음 핏줄 타이밍',
          description: '두 번째 얼음 핏줄이 15초 늦게 사용됨',
          solution: '쿨다운 즉시 사용 권장'
        },
        {
          severity: 'info',
          title: '이동 최적화 가능',
          description: '얼음불꽃 화살 사용률 67% (권장: 80%)',
          solution: '이동 중 즉시 시전 활용도 개선'
        }
      ],

      comparison: {
        topParse: {
          dps: 205000,
          빙하가시: 42,
          얼음핏줄: 4,
          활동시간: 98.5
        },
        yourParse: {
          dps: 185432,
          빙하가시: 23,
          얼음핏줄: 3,
          활동시간: 95.2
        }
      }
    };

    setLogData(mockLogData);
    analyzeLog(mockLogData);
  }, []);

  const analyzeLog = (data) => {
    // 로그 분석 로직
    const analysisResult = {
      overall: calculateOverallScore(data),
      rotation: analyzeRotation(data),
      cooldowns: analyzeCooldowns(data),
      positioning: analyzePositioning(data),
      improvement: generateImprovements(data)
    };
    setAnalysis(analysisResult);
  };

  const calculateOverallScore = (data) => {
    const dpsScore = (data.dps / 205000) * 100;
    const activityScore = data.metrics.activetime;
    const deathPenalty = data.metrics.deaths * 10;

    return Math.max(0, Math.min(100, (dpsScore * 0.6 + activityScore * 0.4 - deathPenalty)));
  };

  const analyzeRotation = (data) => {
    return {
      score: 82,
      issues: ['빙하 가시 관리', '고드름 낭비'],
      good: ['얼음 창 사용', '서리 화살 필러']
    };
  };

  const analyzeCooldowns = (data) => {
    return {
      score: 75,
      usage: 3,
      expected: 4,
      timing: 'suboptimal'
    };
  };

  const analyzePositioning = (data) => {
    return {
      score: 90,
      movement: 'efficient',
      uptime: 95.2
    };
  };

  const generateImprovements = (data) => {
    return [
      '빙하 가시 5중첩 관리 개선으로 약 8% DPS 상승 가능',
      '얼음 핏줄을 쿨마다 사용하여 약 3% DPS 상승 가능',
      '이동 중 얼음불꽃 화살 활용도 개선으로 약 2% DPS 상승 가능'
    ];
  };

  const getScoreColor = (score) => {
    if (score >= 95) return '#a6e3a1';
    if (score >= 90) return '#4ecdc4';
    if (score >= 80) return '#45b7d1';
    if (score >= 70) return '#f9e2af';
    return '#f38ba8';
  };

  if (!logData) {
    return (
      <Container>
        <UploadSection>
          <WowIcon icon={gameIcons.dungeonPortal} size={48} style={{ marginBottom: '1rem' }} />
          <h3>로그 파일을 업로드하세요</h3>
          <p style={{ color: '#a6adc8', marginTop: '0.5rem' }}>
            Warcraft Logs URL을 입력하거나 로그 파일을 드래그 앤 드롭
          </p>
        </UploadSection>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>로그 분석 - {logData.playerName}</Title>
        <MetricValue color={getScoreColor(logData.parsePercentile)}>
          {logData.parsePercentile}%
        </MetricValue>
      </Header>

      <MetricsGrid>
        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MetricValue color="#f38ba8">
            {(logData.dps / 1000).toFixed(1)}K
          </MetricValue>
          <MetricLabel>DPS</MetricLabel>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <MetricValue color="#4ecdc4">
            {logData.metrics.activetime}%
          </MetricValue>
          <MetricLabel>활동 시간</MetricLabel>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <MetricValue color="#f9e2af">
            {logData.ilvl}
          </MetricValue>
          <MetricLabel>아이템 레벨</MetricLabel>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <MetricValue color="#a6e3a1">
            {logData.duration}
          </MetricValue>
          <MetricLabel>전투 시간</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      <TabContainer>
        <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          개요
        </Tab>
        <Tab active={activeTab === 'rotation'} onClick={() => setActiveTab('rotation')}>
          로테이션
        </Tab>
        <Tab active={activeTab === 'cooldowns'} onClick={() => setActiveTab('cooldowns')}>
          쿨다운
        </Tab>
        <Tab active={activeTab === 'issues'} onClick={() => setActiveTab('issues')}>
          개선점
        </Tab>
        <Tab active={activeTab === 'comparison'} onClick={() => setActiveTab('comparison')}>
          비교
        </Tab>
      </TabContainer>

      <AnalysisSection>
        {activeTab === 'overview' && (
          <>
            <ChartContainer>
              <h3 style={{ marginBottom: '1rem' }}>스킬별 피해량</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={logData.abilities}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} ${entry.percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {logData.abilities.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#f38ba8', '#cba6f7', '#94e2d5', '#89dceb', '#74c7ec'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer>
              <h3 style={{ marginBottom: '1rem' }}>마나 사용량</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={logData.resources.manaUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#cba6f7" fill="#cba6f7" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </>
        )}

        {activeTab === 'issues' && (
          <IssuesList>
            {logData.issues.map((issue, index) => (
              <IssueCard key={index} severity={issue.severity}>
                <IssueIcon color={
                  issue.severity === 'critical' ? '#f38ba8' :
                  issue.severity === 'warning' ? '#f9e2af' :
                  '#a6e3a1'
                }>
                  {issue.severity === 'critical' ? <FaTimes /> :
                   issue.severity === 'warning' ? <WowIcon icon={gameIcons.warning} size={20} /> :
                   <WowIcon icon={gameIcons.success} size={20} />}
                </IssueIcon>
                <IssueContent>
                  <IssueTitle>{issue.title}</IssueTitle>
                  <IssueDescription>{issue.description}</IssueDescription>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#a6e3a1' }}>
                    💡 {issue.solution}
                  </div>
                </IssueContent>
              </IssueCard>
            ))}
          </IssuesList>
        )}

        {activeTab === 'comparison' && (
          <ChartContainer>
            <h3 style={{ marginBottom: '1rem' }}>상위 파스와 비교</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'DPS', top: 205000, yours: 185432 },
                { name: '빙하 가시', top: 42, yours: 23 },
                { name: '얼음 핏줄', top: 4, yours: 3 },
                { name: '활동 시간', top: 98.5, yours: 95.2 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="top" fill="#a6e3a1" name="상위 파스" />
                <Bar dataKey="yours" fill="#f38ba8" name="내 파스" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </AnalysisSection>
    </Container>
  );
}

export default LogAnalyzer;