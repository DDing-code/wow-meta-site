// 가이드 비주얼 컴포넌트 중앙 export 파일
// 모든 시각화 컴포넌트를 한 곳에서 import 가능

export { default as GuideTable } from './GuideTable';
export { default as GuideChart } from './GuideChart';
export { default as GuideFlowChart } from './GuideFlowChart';
export { default as GuideDiagram } from './GuideDiagram';

// 사용 예시:
// import { GuideTable, GuideChart } from '../visuals';
//
// <GuideTable data={tableData} color={color} title="스탯 우선순위" />
// <GuideChart data={chartData} color={color} type="bar" />
