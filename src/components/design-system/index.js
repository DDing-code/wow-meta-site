/**
 * WoW-Meta Design System
 * 
 * 모든 디자인 시스템 컴포넌트와 토큰을 export
 */

// Tokens
export * from './tokens';
export { 
  classColors, 
  colors, 
  typography, 
  spacing, 
  breakpoints,
  shadows,
  animations,
  iconSizes,
  getIconUrl,
  WOWHEAD_ICON_URL,
} from './tokens';

// Components
export { SkillCard, SkillCardGrid } from './SkillCard';
export { PriorityTable, QuickPriority } from './PriorityTable';
export { Timeline, BurstWindow } from './Timeline';
export { ComparisonCard, ComparisonTable } from './ComparisonCard';
export { ConceptBlock, TipBox, DosDonts } from './ConceptBlock';
export { TabGroup, QuickRef, Accordion } from './TabGroup';

// Default export
const DesignSystem = {
  // Tokens
  classColors: require('./tokens').classColors,
  colors: require('./tokens').colors,
  typography: require('./tokens').typography,
  spacing: require('./tokens').spacing,
  
  // Components
  SkillCard: require('./SkillCard').SkillCard,
  SkillCardGrid: require('./SkillCard').SkillCardGrid,
  PriorityTable: require('./PriorityTable').PriorityTable,
  QuickPriority: require('./PriorityTable').QuickPriority,
  Timeline: require('./Timeline').Timeline,
  BurstWindow: require('./Timeline').BurstWindow,
  ComparisonCard: require('./ComparisonCard').ComparisonCard,
  ComparisonTable: require('./ComparisonCard').ComparisonTable,
  ConceptBlock: require('./ConceptBlock').ConceptBlock,
  TipBox: require('./ConceptBlock').TipBox,
  DosDonts: require('./ConceptBlock').DosDonts,
  TabGroup: require('./TabGroup').TabGroup,
  QuickRef: require('./TabGroup').QuickRef,
  Accordion: require('./TabGroup').Accordion,
};

export default DesignSystem;
