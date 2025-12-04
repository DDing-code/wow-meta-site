import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import mermaid from 'mermaid';

// 가이드 다이어그램 컴포넌트
// Mermaid를 사용하여 Gantt 차트, 시퀀스 다이어그램 등 시각화
// GuideFlowChart와 동일한 Mermaid 엔진 공유 (번들 사이즈 최적화)

const DiagramContainer = styled.div`
  background: #15151f;
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;

  .mermaid {
    font-family: 'Noto Sans KR', sans-serif;

    /* Gantt 차트 스타일 */
    .grid .tick {
      stroke: #2a2a3e;
    }

    .taskText {
      fill: #fff !important;
      font-weight: 500;
    }

    /* 시퀀스 다이어그램 스타일 */
    .actor {
      stroke: ${props => props.themecolor || '#A330C9'};
      fill: #1a1a2e;
    }

    .actor-line {
      stroke: #a0a0a0;
    }

    .messageLine0,
    .messageLine1 {
      stroke: ${props => props.themecolor || '#A330C9'};
    }

    .labelBox {
      fill: #1a1a2e;
      stroke: ${props => props.themecolor || '#A330C9'};
    }

    .labelText {
      fill: #fff;
    }

    .loopText {
      fill: #fff;
    }
  }
`;

const DiagramTitle = styled.h4`
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

function GuideDiagram({
  data,
  title = '',
  color = '#A330C9',
  type = 'gantt'  // 'gantt', 'sequence', 'stateDiagram', 'classDiagram'
}) {
  const diagramRef = useRef(null);
  const [error, setError] = useState(null);
  const [diagramId] = useState(() => `mermaid-diagram-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!data || !diagramRef.current) return;

    // Mermaid 초기화
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: color,
        primaryTextColor: '#fff',
        primaryBorderColor: color,
        lineColor: '#a0a0a0',
        secondaryColor: '#4fc3f7',
        tertiaryColor: '#66bb6a',
        background: '#15151f',
        mainBkg: '#1a1a2e',
        secondBkg: '#2a2a3e',
        tertiaryBkg: '#15151f',
        textColor: '#fff',
        fontSize: '14px',
        fontFamily: 'Noto Sans KR, sans-serif',
        // Gantt 차트 전용 색상
        gridColor: '#2a2a3e',
        todayLineColor: color,
        taskBorderColor: color,
        taskBkgColor: `${color}40`,
        activeTaskBorderColor: color,
        activeTaskBkgColor: `${color}80`,
        doneTaskBorderColor: '#66bb6a',
        doneTaskBkgColor: '#66bb6a40',
        critBorderColor: '#ff4444',
        critBkgColor: '#ff444440'
      },
      gantt: {
        useMaxWidth: true,
        leftPadding: 75,
        gridLineStartPadding: 35,
        fontSize: 14,
        fontFamily: 'Noto Sans KR, sans-serif',
        numberSectionStyles: 2,
        axisFormat: '%S초',
        topAxis: true
      },
      sequence: {
        useMaxWidth: true,
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35
      },
      securityLevel: 'loose'
    });

    // 다이어그램 렌더링
    try {
      setError(null);
      mermaid.render(diagramId, data).then(({ svg }) => {
        if (diagramRef.current) {
          diagramRef.current.innerHTML = svg;
        }
      }).catch(err => {
        console.error('Mermaid diagram rendering error:', err);
        setError({
          message: `Mermaid ${type} 다이어그램 렌더링 실패`,
          details: err.message,
          syntax: data
        });
      });
    } catch (err) {
      console.error('Mermaid diagram initialization error:', err);
      setError({
        message: 'Mermaid 다이어그램 초기화 실패',
        details: err.message,
        syntax: data
      });
    }
  }, [data, color, type, diagramId]);

  // 데이터 검증
  if (!data) {
    console.warn('GuideDiagram: No data provided');
    return null;
  }

  // 에러 표시
  if (error) {
    return (
      <DiagramContainer themecolor={color}>
        {title && <DiagramTitle>{title}</DiagramTitle>}
        <ErrorMessage>
          <strong>⚠️ {error.message}</strong>
          {error.details && <div>상세: {error.details}</div>}
          {error.syntax && (
            <code>{error.syntax}</code>
          )}
        </ErrorMessage>
      </DiagramContainer>
    );
  }

  return (
    <DiagramContainer themecolor={color}>
      {title && <DiagramTitle>{title}</DiagramTitle>}
      <div ref={diagramRef} />
    </DiagramContainer>
  );
}

// React.memo로 최적화 - props가 변경되지 않으면 리렌더링 방지
export default React.memo(GuideDiagram);
