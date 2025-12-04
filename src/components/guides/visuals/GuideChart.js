import React from 'react';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

// 가이드 차트 컴포넌트
// Recharts를 사용하여 DPS 시뮬레이션, 스탯 분포 시각화
// 지원 타입: bar (막대 차트), line (선 차트)

const ChartContainer = styled.div`
  background: #15151f;
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
`;

const ChartTitle = styled.h4`
  color: #ffa500;
  font-size: 1.2rem;
  margin: 0 0 20px 0;
  font-weight: bold;
`;

const CustomTooltipContainer = styled.div`
  background: #1a1a2e;
  border: 2px solid ${props => props.color || '#A330C9'};
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

  .tooltip-label {
    color: #fff;
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 1rem;
  }

  .tooltip-value {
    color: #e0e0e0;
    font-size: 0.95rem;

    strong {
      color: ${props => props.color || '#A330C9'};
    }
  }
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #e0e0e0;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  background: ${props => props.color};
  border-radius: 4px;
`;

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label, color }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipContainer color={color}>
        <div className="tooltip-label">{label}</div>
        {payload.map((entry, index) => (
          <div key={index} className="tooltip-value">
            <strong>{entry.name}:</strong> {entry.value.toLocaleString()}
          </div>
        ))}
      </CustomTooltipContainer>
    );
  }
  return null;
};

function GuideChart({
  data,
  color = '#A330C9',
  type = 'bar',
  title = '',
  dataKey = 'value',
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = false
}) {
  // 데이터 검증
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('GuideChart: Invalid data', data);
    return null;
  }

  // 차트 공통 설정
  const chartProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 20 }
  };

  const xAxisProps = {
    dataKey: xAxisKey,
    stroke: '#a0a0a0',
    style: {
      fontSize: '0.9rem',
      fontFamily: 'Noto Sans KR, sans-serif'
    }
  };

  const yAxisProps = {
    stroke: '#a0a0a0',
    style: {
      fontSize: '0.9rem',
      fontFamily: 'Noto Sans KR, sans-serif'
    },
    tickFormatter: (value) => value.toLocaleString()
  };

  const gridProps = showGrid ? {
    strokeDasharray: '3 3',
    stroke: '#2a2a3e'
  } : null;

  const tooltipProps = {
    content: <CustomTooltip color={color} />,
    cursor: { fill: 'rgba(163, 48, 201, 0.1)' }
  };

  return (
    <ChartContainer>
      {title && <ChartTitle>{title}</ChartTitle>}

      <ResponsiveContainer width="100%" height={height}>
        {type === 'bar' ? (
          <BarChart {...chartProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} />
            {showLegend && <Legend />}
            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        ) : (
          <LineChart {...chartProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} />
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, r: 6 }}
              activeDot={{ r: 8 }}
              animationDuration={800}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// React.memo로 최적화 - props가 변경되지 않으면 리렌더링 방지
export default React.memo(GuideChart);
