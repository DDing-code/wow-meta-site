// Knowledge Base - Common Type Definitions

/**
 * WoW 패치 버전
 */
export type PatchVersion = string;  // 예: '11.2', '11.2.5'

/**
 * 데이터 출처
 */
export type DataSource = 'wowhead' | 'simc' | 'wcl' | 'maxroll' | 'icy-veins' | 'manual';

/**
 * 난이도
 */
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

/**
 * 중요도
 */
export type Importance = 'critical' | 'high' | 'medium' | 'low';

/**
 * 영향도
 */
export type Impact = 'critical' | 'high' | 'medium' | 'low';

/**
 * 메커니즘 카테고리
 */
export type MechanismCategory =
  | 'burst-window'
  | 'resource-management'
  | 'defensive'
  | 'movement'
  | 'aoe'
  | 'single-target'
  | 'general';

/**
 * 메커니즘 타입 (시뮬레이션용)
 */
export type MechanismType =
  | 'stacking-buff'
  | 'proc'
  | 'cooldown'
  | 'resource-gen'
  | 'window'
  | 'generic';

/**
 * 전문화 정보
 */
export interface SpecializationInfo {
  className: string;                    // 클래스명 (영문 소문자)
  specName: string;                     // 전문화명 (영문 소문자)
  koreanClassName: string;              // 한글 클래스명
  koreanSpecName: string;               // 한글 전문화명
}

/**
 * 검증 결과
 */
export interface ValidationResult {
  valid: boolean;                       // 검증 통과 여부
  errors: ValidationError[];            // 오류 목록
  warnings: ValidationWarning[];        // 경고 목록
}

/**
 * 검증 오류
 */
export interface ValidationError {
  type: string;                         // 오류 타입
  field?: string;                       // 오류 발생 필드
  message: string;                      // 오류 메시지
  severity: 'critical' | 'high' | 'medium';  // 심각도
}

/**
 * 검증 경고
 */
export interface ValidationWarning {
  type: string;                         // 경고 타입
  field?: string;                       // 경고 발생 필드
  message: string;                      // 경고 메시지
  recommendation?: string;              // 권장 사항
}

/**
 * KB 버전 정보
 */
export interface KBVersion {
  version: string;                      // KB 버전 (Semantic Versioning)
  specName: string;                     // 전문화명
  patch: PatchVersion;                  // WoW 패치 버전
  lastUpdated: string;                  // 마지막 업데이트 (ISO 8601)
  mechanisms: number;                   // 메커니즘 개수
  skills: number;                       // 스킬 개수
}

/**
 * 필터 옵션
 */
export interface FilterOptions {
  importance?: Importance;              // 중요도 필터
  category?: MechanismCategory;         // 카테고리 필터
  difficulty?: Difficulty;              // 난이도 필터
  verified?: boolean;                   // 검증 여부 필터
}
