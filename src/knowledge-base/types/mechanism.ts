// Knowledge Base - Mechanism Type Definitions
// 각 메커니즘은 4개 도메인으로 분리: guide, analysis, learning, simulation

/**
 * 메커니즘의 한글/영문 이름
 */
export interface MechanismName {
  ko: string;
  en: string;
}

/**
 * 가이드 렌더링용 도메인
 * - 가이드 페이지에서 사용
 * - 사용자에게 보여지는 설명, 세부사항, 관련 스킬
 */
export interface GuideDomain {
  description: string;                  // 메커니즘 설명 (HTML 가능)
  details: string[];                    // 세부 사항 배열
  relatedSkills: string[];              // 관련 스킬 ID 배열
  importance?: 'critical' | 'high' | 'medium' | 'low';  // 중요도
  visualizations?: VisualizationConfig[];  // 시각화 설정 (향후 확장)
}

/**
 * 시각화 설정 (향후 확장용)
 */
export interface VisualizationConfig {
  type: 'timeline' | 'chart' | 'flowchart';
  config: any;  // 시각화별 설정
}

/**
 * 로그 분석용 도메인
 * - WarcraftLogs 분석 시 사용
 * - 버프 ID, 중첩 정보, 트리거 조건
 */
export interface AnalysisDomain {
  buffId?: number;                      // 버프 Spell ID
  debuffId?: number;                    // 디버프 Spell ID
  stackInfo?: {
    max: number;                        // 최대 중첩 수
    duration: number;                   // 지속시간 (ms)
    damagePerStack?: number;            // 중첩당 피해 증가 (배수)
    independentStacks?: boolean;        // 독립 중첩 여부
  };
  triggers?: {
    skills: number[];                   // 트리거 스킬 ID 배열
    events: WCLEventType[];             // WCL 이벤트 타입
  };
  metrics?: {
    uptimeTarget?: number;              // 목표 uptime (0.0-1.0)
    avgStacks?: number;                 // 평균 중첩 수
    wasteThreshold?: number;            // 낭비 임계값
  };
}

/**
 * WarcraftLogs 이벤트 타입
 */
export type WCLEventType =
  | 'SPELL_DAMAGE'
  | 'SPELL_CAST'
  | 'applybuff'
  | 'removebuff'
  | 'applydebuff'
  | 'removedebuff';

/**
 * AI 학습용 도메인
 * - AI 페르소나 학습 시 사용
 * - 핵심 포인트, 일반적 실수, 시너지
 */
export interface LearningDomain {
  category: 'burst-window' | 'resource-management' | 'defensive' | 'movement';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  keyPoints: string[];                  // 핵심 포인트
  commonMistakes: CommonMistake[];      // 일반적 실수
  synergies?: string[];                 // 시너지 메커니즘 ID 배열
}

/**
 * 일반적 실수 정보
 */
export interface CommonMistake {
  mistake: string;                      // 실수 내용
  impact: 'critical' | 'high' | 'medium' | 'low';  // 영향도
  solution: string;                     // 해결 방법
  frequency?: number;                   // 발생 빈도 (0.0-1.0)
}

/**
 * 시뮬레이션용 도메인
 * - SimulationCraft 통합 시 사용
 * - 메커니즘 타입, 배수, 쿨다운 등
 */
export interface SimulationDomain {
  type: 'stacking-buff' | 'proc' | 'cooldown' | 'resource-gen' | 'window' | 'generic';
  damageMultiplier?: number;            // 피해 배수
  maxStacks?: number;                   // 최대 중첩 (stacking-buff)
  stackDuration?: number;               // 중첩 지속시간 (초)
  procRate?: number;                    // 발동 확률 (0.0-1.0)
  cooldown?: number;                    // 재사용 대기시간 (초)
  dependencies?: string[];              // 의존성 버프/디버프 ID
}

/**
 * 메타데이터
 */
export interface MechanismMetadata {
  patch: string;                        // 패치 버전 (예: '11.2')
  lastUpdated: string;                  // 마지막 업데이트 (YYYY-MM-DD)
  source: 'wowhead' | 'simc' | 'wcl' | 'manual';  // 데이터 출처
  verified: boolean;                    // 검증 여부
  migrationNotes?: string;              // 마이그레이션 노트
}

/**
 * 메커니즘 전체 구조
 * - 4개 도메인 + 메타데이터
 */
export interface Mechanism {
  id: string;                           // 메커니즘 ID (kebab-case)
  version?: string;                     // 버전 (Semantic Versioning)
  name: MechanismName;                  // 한글/영문 이름
  guide: GuideDomain;                   // 가이드용 데이터
  analysis: AnalysisDomain;             // 로그 분석용 데이터
  learning: LearningDomain;             // AI 학습용 데이터
  simulation: SimulationDomain;         // 시뮬레이션용 데이터
  metadata?: MechanismMetadata;         // 메타데이터
}
