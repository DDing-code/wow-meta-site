import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import mermaid from 'mermaid';

// 가이드 플로우차트 컴포넌트
// Mermaid를 사용하여 로테이션 결정 트리 시각화
// 마크다운 기반 텍스트 정의로 플로우차트 생성

const FlowChartContainer = styled.div`
  background: #15151f;
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;

  .mermaid {
    font-family: 'Noto Sans KR', sans-serif;

    /* Mermaid 노드 스타일 커스터마이징 */
    .node rect,
    .node circle,
    .node ellipse,
    .node polygon {
      stroke-width: 2px;
    }

    /* 텍스트 색상 */
    .nodeLabel {
      color: #fff !important;
      font-weight: 500;
    }

    /* 화살표 색상 */
    .edgePath .path {
      stroke: #a0a0a0;
      stroke-width: 2px;
    }

    .edgeLabel {
      background-color: #1a1a2e;
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
    }
  }
`;

const FlowChartTitle = styled.h4`
  color: #ffa500;
  font-size: 1.2rem;
  margin: 0 0 20px 0;
  font-weight: bold;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid #ff4444;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  font-size: 0.95rem;
  text-align: left;

  strong {
    display: block;
    margin-bottom: 8px;
  }

  code {
    display: block;
    background: #1a1a2e;
    padding: 10px;
    border-radius: 4px;
    margin-top: 10px;
    overflow-x: auto;
    white-space: pre;
    font-family: monospace;
    font-size: 0.85rem;
  }
`;

function GuideFlowChart({
  data,
  title = '',
  theme = 'dark'
}) {
  const chartRef = useRef(null);
  const [error, setError] = useState(null);
  const [chartId] = useState(() => `mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    // Mermaid 초기화
    mermaid.initialize({
      startOnLoad: false,
      theme: theme,
      themeVariables: {
        primaryColor: '#A330C9',
        primaryTextColor: '#fff',
        primaryBorderColor: '#A330C9',
        lineColor: '#a0a0a0',
        secondaryColor: '#4fc3f7',
        tertiaryColor: '#66bb6a',
        background: '#15151f',
        mainBkg: '#1a1a2e',
        secondBkg: '#2a2a3e',
        tertiaryBkg: '#15151f',
        textColor: '#fff',
        fontSize: '14px',
        fontFamily: 'Noto Sans KR, sans-serif'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        padding: 15,
        nodeSpacing: 50,
        rankSpacing: 80
      },
      securityLevel: 'loose'
    });

    // 차트 렌더링
    try {
      setError(null);
      mermaid.render(chartId, data).then(({ svg }) => {
        if (chartRef.current) {
          chartRef.current.innerHTML = svg;
        }
      }).catch(err => {
        console.error('Mermaid rendering error:', err);
        setError({
          message: 'Mermaid 다이어그램 렌더링 실패',
          details: err.message,
          syntax: data
        });
      });
    } catch (err) {
      console.error('Mermaid initialization error:', err);
      setError({
        message: 'Mermaid 초기화 실패',
        details: err.message,
        syntax: data
      });
    }
  }, [data, theme, chartId]);

  // 데이터 검증
  if (!data) {
    console.warn('GuideFlowChart: No data provided');
    return null;
  }

  // 에러 표시
  if (error) {
    return (
      <FlowChartContainer>
        {title && <FlowChartTitle>{title}</FlowChartTitle>}
        <ErrorMessage>
          <strong>⚠️ {error.message}</strong>
          {error.details && <div>상세: {error.details}</div>}
          {error.syntax && (
            <code>{error.syntax}</code>
          )}
        </ErrorMessage>
      </FlowChartContainer>
    );
  }

  return (
    <FlowChartContainer>
      {title && <FlowChartTitle>{title}</FlowChartTitle>}
      <div ref={chartRef} />
    </FlowChartContainer>
  );
}

// React.memo로 최적화 - props가 변경되지 않으면 리렌더링 방지
export default React.memo(GuideFlowChart);
