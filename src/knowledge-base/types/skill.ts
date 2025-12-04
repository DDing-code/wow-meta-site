// Knowledge Base - Skill Type Definitions

/**
 * 스킬의 한글/영문 이름
 */
export interface SkillName {
  ko: string;
  en: string;
}

/**
 * 스킬 기본 정보
 */
export interface SkillInfo {
  id: number;                           // Spell ID
  name: SkillName;                      // 한글/영문 이름
  icon: string;                         // 아이콘 파일명
  description: string;                  // 스킬 설명
  cooldown: string;                     // 재사용 대기시간 (예: "1.5 초", "없음")
  castTime: string;                     // 시전 시간 (예: "즉시", "2초")
  range: string;                        // 사거리 (예: "근접", "40 야드")
  resourceCost: string;                 // 소모 자원 (예: "분노 20", "없음")
  resourceGain: string;                 // 획득 자원 (예: "분노 20", "없음")
  type: string;                         // 스킬 타입 (예: "기본", "쿨다운")
  spec: string;                         // 전문화 (예: "파멸", "공용")
  level: number;                        // 습득 레벨
  pvp: boolean;                         // PvP 전용 여부
}

/**
 * 스킬 확장 정보 (KB용)
 */
export interface Skill extends SkillInfo {
  // 가이드용
  guide?: {
    usage: string;                      // 사용 방법
    tips: string[];                     // 팁
  };

  // 로그 분석용
  analysis?: {
    avgDamage?: number;                 // 평균 피해량
    avgCasts?: number;                  // 평균 시전 횟수
    efficiency?: number;                // 효율성 (0.0-1.0)
  };

  // 시뮬레이션용
  simulation?: {
    priority?: number;                  // 우선순위 (낮을수록 높음)
    damageMultiplier?: number;          // 피해 배수
  };
}
