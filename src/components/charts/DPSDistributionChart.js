/**
 * DPSDistributionChart.js
 *
 * 악마성 빌드 40초 루프 DPS 분포 시각화
 * - 탈태 구간 vs 비탈태 구간 비중
 * - Recharts 기반 도넛 파이차트
 * - 악마사냥꾼 테마 색상 적용
 */

import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// DPS 분포 데이터 (40초 악마성 루프 기준)
const dpsDistributionData = [
  {
    name: '탈태 구간 (Metamorphosis)',
    value: 65,
    time: '~25초',
    skills: '소멸, 죽음의 휩쓸기, 안광',
    description: '최대 버스트 윈도우'
  },
  {
    name: '비탈태 구간 (Normal)',
    value: 35,
    time: '~15초',
    skills: '혼돈의 일격, 칼춤, 악마의 이빨',
    description: '격노 축적 및 쿨다운 대기'
  },
];

// 악마사냥꾼 테마 색상
const COLORS = ['#A330C9', '#00FF96']; // 보라색 (탈태), 녹색 (비탈태)

// 커스텀 라벨 렌더러 (퍼센트 표시)
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontWeight: 'bold', fontSize: '16px', textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(21, 21, 31, 0.95)',
        padding: '12px 16px',
        border: `1px solid ${payload[0].payload.name.includes('탈태 구간') ? '#A330C9' : '#00FF96'}`,
        borderRadius: '8px',
        color: '#e0e0e0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
      }}>
        <p style={{
          margin: '0 0 8px 0',
          fontWeight: 'bold',
          color: payload[0].payload.name.includes('탈태 구간') ? '#A330C9' : '#00FF96'
        }}>
          {data.name}
        </p>
        <p style={{ margin: '4px 0', fontSize: '14px' }}>
          <strong>DPS 비중:</strong> {data.value}%
        </p>
        <p style={{ margin: '4px 0', fontSize: '14px' }}>
          <strong>시간:</strong> {data.time}
        </p>
        <p style={{ margin: '4px 0', fontSize: '14px' }}>
          <strong>주요 스킬:</strong> {data.skills}
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#a0a0a0', fontStyle: 'italic' }}>
          {data.description}
        </p>
      </div>
    );
  }
  return null;
};

// 커스텀 범례
const CustomLegend = ({ payload }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '16px'
  }}>
    {payload.map((entry, index) => (
      <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '4px',
          background: entry.color
        }} />
        <span style={{ color: '#e0e0e0', fontSize: '14px' }}>
          {entry.value.split(' (')[0]}
        </span>
      </div>
    ))}
  </div>
);

const DPSDistributionChart = ({ height = 350 }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div style={{ width: '100%', height: height }}>
      <h4 style={{
        textAlign: 'center',
        color: '#A330C9',
        marginBottom: '8px',
        fontSize: '1.1rem'
      }}>
        40초 악마성 루프 DPS 분포
      </h4>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={dpsDistributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            activeIndex={activeIndex}
            activeShape={{
              outerRadius: 130,
              stroke: '#fff',
              strokeWidth: 2,
            }}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {dpsDistributionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{
                  filter: activeIndex === index ? 'drop-shadow(0 0 8px rgba(163, 48, 201, 0.6))' : 'none',
                  transition: 'filter 0.3s ease'
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DPSDistributionChart;
