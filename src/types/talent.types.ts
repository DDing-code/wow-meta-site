/**
 * WoW Talent Tree Type Definitions
 * Clean implementation without external dependencies
 */

// Node shape types for different talent styles
export type TalentNodeShape = 'circle' | 'hex' | 'square' | 'octagon' | 'star' | 'diamond';

// Talent types
export type TalentType = 'active' | 'passive' | 'choice' | 'keystone' | 'capstone';

// Tree types
export type TreeType = 'class' | 'spec' | 'hero';

// Position in grid
export interface GridPosition {
  x: number; // 0-based column
  y: number; // 0-based row
}

// Individual talent node
export interface TalentNode {
  id: string;
  spellId?: number;
  name: string;
  description: string;
  icon: string; // Icon filename or path
  maxRank: number;
  currentRank: number;
  position: GridPosition;
  shape: TalentNodeShape;
  type: TalentType;
  prerequisites: string[]; // Array of talent IDs required
  requiredPoints?: number; // Points needed to unlock this talent
  choiceOf?: string[]; // For choice nodes - other talents in the same choice group
  locked: boolean;
  available: boolean;
}

// Connection between nodes
export interface TalentEdge {
  from: string; // Node ID
  to: string; // Node ID
  type: 'normal' | 'choice' | 'optional';
  requiredRank?: number; // Minimum rank of 'from' node to activate edge
}

// Tree configuration
export interface TreeConfig {
  gridSize: {
    rows: number;
    cols: number;
  };
  maxPoints: number;
  requiredLevel?: number;
  backgroundImage?: string;
}

// Complete talent tree
export interface TalentTree {
  nodes: TalentNode[];
  edges: TalentEdge[];
  config: TreeConfig;
}

// Hero talent tree
export interface HeroTalentTree extends TalentTree {
  name: string;
}

// Complete talent data structure
export interface TalentData {
  metadata: {
    class: string;
    spec: string;
    version: string;
    lastUpdated: string;
  };
  classTalentTree: TalentTree;
  specTalentTree: TalentTree;
  heroTalentTrees?: Record<string, HeroTalentTree>;
}

// Build configuration
export interface TalentBuild {
  name: string;
  description: string;
  selectedTalents: {
    class: string[]; // Array of talent IDs
    spec: string[]; // Array of talent IDs
    hero?: string[]; // Array of talent IDs
  };
  importString?: string;
}