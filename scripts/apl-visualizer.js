/**
 * APL 시각화 엔진
 *
 * 복잡한 Rotation Priority를 분석하여
 * Mermaid.js 기반 플로우차트를 자동 생성합니다.
 *
 * 사용법:
 *   node apl-visualizer.js <extracted-guide-data-resolved.json>
 */

const fs = require('fs');
const path = require('path');

/**
 * 복잡도 재계산 (상세 분석)
 * @param {Object} rotationData - Rotation 데이터
 * @returns {Object} 복잡도 분석 결과
 */
function analyzeComplexity(rotationData) {
  const complexity = {
    conditionCount: 0,
    branchingDepth: 0,
    cooldownTracking: 0,
    resourceThresholds: 0,
    conditionalChains: 0,  // OR/AND 체인 개수
    priorityLevels: 0,
    needsVisualization: false,
    visualizationType: 'none'  // 'flowchart', 'timeline', 'matrix'
  };

  rotationData.singleTarget.forEach(item => {
    // 조건 개수
    if (item.conditions) {
      complexity.conditionCount += item.conditions.length;

      // OR/AND 분기 깊이 및 체인
      item.conditions.forEach(cond => {
        const condLower = cond.toLowerCase();

        if (condLower.includes('or') || condLower.includes('and')) {
          complexity.branchingDepth++;
        }

        // 복잡한 조건 체인 (3개 이상의 조건이 연결된 경우)
        const chainCount = (cond.match(/OR|AND/g) || []).length;
        if (chainCount >= 2) {
          complexity.conditionalChains++;
        }
      });
    }

    // 쿨다운 추적
    const descLower = item.desc.toLowerCase();
    if (descLower.includes('cooldown') ||
        descLower.includes('재사용') ||
        descLower.includes('available') ||
        descLower.includes('ready')) {
      complexity.cooldownTracking++;
    }

    // 리소스 임계값
    if (/\d+/.test(item.desc)) {
      complexity.resourceThresholds++;
    }
  });

  // 우선순위 레벨 (priority 0, 1, 2 등)
  const priorityLevels = new Set(rotationData.singleTarget.map(i => i.priority));
  complexity.priorityLevels = priorityLevels.size;

  // 시각화 필요 여부 및 타입 결정
  if (complexity.conditionCount >= 12 || complexity.conditionalChains >= 2) {
    complexity.needsVisualization = true;
    complexity.visualizationType = 'flowchart';  // 복잡한 분기 → 플로우차트
  } else if (complexity.cooldownTracking >= 5) {
    complexity.needsVisualization = true;
    complexity.visualizationType = 'timeline';  // 쿨다운 관리 → 타임라인
  } else if (complexity.priorityLevels >= 6) {
    complexity.needsVisualization = true;
    complexity.visualizationType = 'matrix';  // 다층 우선순위 → 매트릭스
  }

  return complexity;
}

/**
 * Mermaid 플로우차트 생성 (의사결정 트리)
 * @param {Object} rotationData - Rotation 데이터
 * @param {string} heroName - 영웅 특성명
 * @returns {string} Mermaid 플로우차트 코드
 */
function generateFlowchart(rotationData, heroName) {
  let mermaidCode = `graph TD\n`;
  mermaidCode += `  Start([시작]) --> Check0\n\n`;

  let nodeId = 0;

  rotationData.singleTarget.forEach((item, index) => {
    const checkNode = `Check${index}`;
    const actionNode = `Action${index}`;
    const nextNode = `Check${index + 1}`;

    // 조건 노드 (다이아몬드)
    if (item.conditions && item.conditions.length > 0) {
      const condition = item.conditions.join(' AND ');
      mermaidCode += `  ${checkNode}{${condition}}\n`;

      // 액션 노드 (사각형, Priority 0은 빨간색)
      const skillName = item.skillData?.koreanName || item.skill;
      const style = item.priority === 0 ? ':::priority0' : '';

      mermaidCode += `  ${actionNode}[${skillName}]${style}\n`;

      // 조건 만족 시 액션
      mermaidCode += `  ${checkNode} -->|예| ${actionNode}\n`;

      // 조건 불만족 시 다음 체크
      if (index < rotationData.singleTarget.length - 1) {
        mermaidCode += `  ${checkNode} -->|아니오| ${nextNode}\n`;
      } else {
        mermaidCode += `  ${checkNode} -->|아니오| End([종료])\n`;
      }

      mermaidCode += `\n`;

    } else {
      // 조건 없는 경우 바로 액션
      const skillName = item.skillData?.koreanName || item.skill;
      const style = item.priority === 0 ? ':::priority0' : '';

      mermaidCode += `  ${checkNode}[${skillName}]${style}\n`;

      if (index < rotationData.singleTarget.length - 1) {
        mermaidCode += `  ${checkNode} --> ${nextNode}\n\n`;
      } else {
        mermaidCode += `  ${checkNode} --> End([종료])\n\n`;
      }
    }
  });

  // Priority 0 스타일 정의
  mermaidCode += `  classDef priority0 fill:#ff6b6b,stroke:#ff0000,stroke-width:3px,color:#fff\n`;

  return mermaidCode;
}

/**
 * 타임라인 시각화 생성 (쿨다운 시퀀스)
 * @param {Object} rotationData - Rotation 데이터
 * @returns {string} Mermaid 간트 차트 코드
 */
function generateTimeline(rotationData) {
  let mermaidCode = `gantt\n`;
  mermaidCode += `  title 쿨다운 타임라인\n`;
  mermaidCode += `  dateFormat  s\n\n`;

  let currentTime = 0;

  rotationData.singleTarget.forEach((item, index) => {
    const skillName = item.skillData?.koreanName || item.skill;

    // 쿨다운 정보 추출 (예: "6초", "1분 30초")
    const cooldownMatch = item.desc.match(/(\d+)\s*(초|분)/);
    let duration = 1;  // 기본 1초

    if (cooldownMatch) {
      const value = parseInt(cooldownMatch[1]);
      const unit = cooldownMatch[2];
      duration = unit === '분' ? value * 60 : value;
    }

    const endTime = currentTime + duration;
    mermaidCode += `  ${skillName} :a${index}, ${currentTime}s, ${endTime}s\n`;

    currentTime = endTime;
  });

  return mermaidCode;
}

/**
 * 우선순위 매트릭스 생성 (테이블 형식)
 * @param {Object} rotationData - Rotation 데이터
 * @returns {Object} 매트릭스 데이터
 */
function generateMatrix(rotationData) {
  const matrix = {
    headers: ['우선순위', '스킬', '조건', '이유'],
    rows: []
  };

  rotationData.singleTarget.forEach(item => {
    const row = {
      priority: item.priority,
      skill: item.skillData?.koreanName || item.skill,
      conditions: item.conditions ? item.conditions.join(', ') : '없음',
      why: item.why || '-'
    };
    matrix.rows.push(row);
  });

  return matrix;
}

/**
 * React 컴포넌트 파일 생성
 * @param {string} mermaidCode - Mermaid 코드
 * @param {string} visualizationType - 시각화 타입
 * @param {string} className - 클래스명
 * @param {string} spec - 전문화명
 * @param {string} heroName - 영웅 특성명
 */
function generateReactComponent(mermaidCode, visualizationType, className, spec, heroName, matrix = null) {
  const componentName = `APL_${className}_${spec}_${heroName.replace(/\s+/g, '')}`;
  const fileName = `${componentName}.js`;
  const outputPath = path.join(__dirname, '../src/components/visualizations', fileName);

  let componentCode = `/**
 * ${className} ${spec} - ${heroName} APL 시각화
 *
 * 자동 생성됨: ${new Date().toISOString()}
 * 시각화 타입: ${visualizationType}
 */

import React from 'react';
import Mermaid from 'react-mermaid2';

const ${componentName} = () => {
  const mermaidChart = \`${mermaidCode}\`;

  return (
    <div style={{
      background: '#15151f',
      padding: '2rem',
      borderRadius: '12px',
      border: '1px solid #2a2a3e',
      marginTop: '2rem'
    }}>
      <h3 style={{ color: '#ffa500', marginTop: 0 }}>
        📊 시각적 우선순위 가이드
      </h3>
      <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        복잡한 조건을 플로우차트로 시각화했습니다.
      </p>
`;

  if (visualizationType === 'flowchart' || visualizationType === 'timeline') {
    componentCode += `
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
        <Mermaid chart={mermaidChart} />
      </div>
`;
  } else if (visualizationType === 'matrix' && matrix) {
    componentCode += `
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#0a0a0f'
        }}>
          <thead>
            <tr>
              ${matrix.headers.map(h => `<th style={{ padding: '12px', borderBottom: '2px solid #ffa500', color: '#ffa500' }}>${h}</th>`).join('\n              ')}
            </tr>
          </thead>
          <tbody>
            ${matrix.rows.map(row => `
            <tr style={{ borderBottom: '1px solid #2a2a3e' }}>
              <td style={{ padding: '12px', color: row.priority === 0 ? '#ff6b6b' : '#e0e0e0', fontWeight: row.priority === 0 ? 'bold' : 'normal' }}>${row.priority}</td>
              <td style={{ padding: '12px', color: '#e0e0e0' }}>${row.skill}</td>
              <td style={{ padding: '12px', color: '#aaa', fontSize: '0.9rem' }}>${row.conditions}</td>
              <td style={{ padding: '12px', color: '#888', fontSize: '0.85rem' }}>${row.why}</td>
            </tr>
            `).join('\n            ')}
          </tbody>
        </table>
      </div>
`;
  }

  componentCode += `
    </div>
  );
};

export default ${componentName};
`;

  // 디렉토리 생성
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, componentCode, 'utf8');
  console.log(`💾 React 컴포넌트 생성: ${outputPath}`);

  return {
    componentName,
    filePath: outputPath
  };
}

// CLI 실행
async function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.error('❌ 사용법: node apl-visualizer.js <extracted-guide-data-resolved.json>');
    process.exit(1);
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ 파일 없음: ${inputPath}`);
    process.exit(1);
  }

  try {
    // 1. 데이터 로드
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const { metadata, data: guideData } = data;

    // 2. 복잡도 분석
    const complexity = analyzeComplexity(guideData.rotation);

    console.log('\n📊 복잡도 분석 (상세):');
    console.log(`  - 조건 개수: ${complexity.conditionCount}`);
    console.log(`  - 분기 깊이: ${complexity.branchingDepth}`);
    console.log(`  - 조건 체인: ${complexity.conditionalChains}`);
    console.log(`  - 쿨다운 추적: ${complexity.cooldownTracking}`);
    console.log(`  - 리소스 임계값: ${complexity.resourceThresholds}`);
    console.log(`  - 우선순위 레벨: ${complexity.priorityLevels}`);
    console.log(`  - 시각화 필요: ${complexity.needsVisualization ? '✅ 예' : '❌ 아니오'}`);
    console.log(`  - 시각화 타입: ${complexity.visualizationType}\n`);

    if (!complexity.needsVisualization) {
      console.log('ℹ️  복잡도가 낮아 시각화가 필요하지 않습니다.');
      process.exit(0);
    }

    // 3. 시각화 생성
    let mermaidCode = '';
    let matrix = null;

    const heroName = guideData.heroTalents[0] || '영웅특성1';

    if (complexity.visualizationType === 'flowchart') {
      console.log('🎨 플로우차트 생성 중...');
      mermaidCode = generateFlowchart(guideData.rotation, heroName);
    } else if (complexity.visualizationType === 'timeline') {
      console.log('🎨 타임라인 생성 중...');
      mermaidCode = generateTimeline(guideData.rotation);
    } else if (complexity.visualizationType === 'matrix') {
      console.log('🎨 우선순위 매트릭스 생성 중...');
      matrix = generateMatrix(guideData.rotation);
    }

    // 4. React 컴포넌트 생성
    const { componentName, filePath } = generateReactComponent(
      mermaidCode,
      complexity.visualizationType,
      metadata.className,
      metadata.spec,
      heroName,
      matrix
    );

    // 5. 메타데이터에 시각화 정보 추가
    data.visualizationComponent = componentName;
    data.visualizationType = complexity.visualizationType;

    const outputPath = inputPath.replace('-resolved.json', '-visualized.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');

    console.log(`\n✅ APL 시각화 완료!`);
    console.log(`📁 컴포넌트: ${filePath}`);
    console.log(`📁 데이터: ${outputPath}`);

  } catch (error) {
    console.error('❌ 실행 실패:', error.message);
    process.exit(1);
  }
}

// 모듈로 사용할 경우
if (require.main === module) {
  main();
} else {
  module.exports = {
    analyzeComplexity,
    generateFlowchart,
    generateTimeline,
    generateMatrix,
    generateReactComponent
  };
}
