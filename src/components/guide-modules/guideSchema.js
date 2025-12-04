/**
 * guideSchema.js
 * WoW 가이드 JSON 스키마 정의
 * 
 * 목적: 가이드 JSON의 구조 정의 및 검증
 * 새 가이드 작성 시 이 스키마를 따라 JSON 생성
 * 
 * 생성일: 2025-11-28
 */

// ============================================
// 직업 색상 정의
// ============================================

export const CLASS_COLORS = {
  warrior: '#C79C6E',
  paladin: '#F58CBA',
  hunter: '#AAD372',
  rogue: '#FFF569',
  priest: '#FFFFFF',
  deathknight: '#C41E3A',
  shaman: '#0070DE',
  mage: '#3FC6EA',
  warlock: '#9382C9',
  monk: '#00FF96',
  druid: '#FF7D0A',
  demonhunter: '#A330C9',
  evoker: '#33937F'
};

// ============================================
// 기본 아이콘 매핑 (자주 사용되는 스킬)
// ============================================

export const COMMON_ICONS = {
  // 악마사냥꾼
  '지옥칼': 'ability_demonhunter_felblades',
  '혼돈의일격': 'ability_demonhunter_chaosstrike',
  '안광': 'ability_demonhunter_eyebeam',
  '탈태': 'ability_demonhunter_metamorphasisdps',
  '칼춤': 'ability_demonhunter_bladedance',
  '죽음의휩쓸기': 'ability_demonhunter_deathsweep',
  '정수파쇄': 'ability_demonhunter_essencebreak',
  '제물의오라': 'ability_demonhunter_immolation',
  '파괴자의글레이브': 'ability_demonhunter_dvambrace',
  '복수의퇴각': 'ability_demonhunter_vengefulretreat',
  '사냥': 'ability_ardenweald_demonhunter',
  '불꽃의인장': 'ability_demonhunter_sigilofinquisition',
  // 공통
  '장신구': 'inv_trinket_80_alchemy02a',
};

// ============================================
// JSON 스키마 타입 정의
// ============================================

/**
 * 스킬 정보 스키마
 * @typedef {Object} SkillSchema
 * @property {string} skillId - 스킬 ID (Wowhead)
 * @property {string} skillName - 스킬 한글명
 * @property {string} [skillNameEn] - 스킬 영문명
 * @property {string} icon - 아이콘 이름 (Wowhead CDN)
 * @property {string} [description] - 스킬 설명
 * @property {string} [cooldown] - 쿨다운
 * @property {string} [cost] - 자원 소모
 */

/**
 * 오프너 스텝 스키마
 * @typedef {Object} OpenerStepSchema
 * @property {string} [timing] - 타이밍 (예: "-2초", "풀", "윈도우")
 * @property {string} skillName - 스킬명
 * @property {string} icon - 아이콘명
 * @property {string} [note] - 참고 사항
 * @property {boolean} [highlight] - 하이라이트 여부
 */

/**
 * 우선순위 아이템 스키마
 * @typedef {Object} PriorityItemSchema
 * @property {number} priority - 우선순위 번호
 * @property {string} skillName - 스킬명
 * @property {string} icon - 아이콘명
 * @property {string} [condition] - 사용 조건
 * @property {string} [reason] - 사용 이유
 * @property {string} [description] - 툴팁용 설명
 * @property {string} [cooldown] - 쿨다운
 */

/**
 * 메커니즘 스키마
 * @typedef {Object} MechanicSchema
 * @property {string} name - 메커니즘 이름
 * @property {string} icon - 아이콘명
 * @property {string} description - 설명
 * @property {string[]} tips - 팁 목록
 */

/**
 * 콤보 시퀀스 스키마
 * @typedef {Object} ComboSchema
 * @property {string} title - 콤보 제목
 * @property {string} [description] - 설명
 * @property {Array<{step: number, skillName: string, icon: string, note?: string}>} combo - 콤보 스텝
 * @property {string[]} [requirements] - 사전 요구사항
 */

/**
 * 영웅 특성 스키마
 * @typedef {Object} HeroTalentSchema
 * @property {string} name - 한글명
 * @property {string} nameEn - 영문명
 * @property {string} icon - 아이콘명
 * @property {string} color - 색상 코드
 * @property {boolean} [recommended] - 추천 여부
 * @property {string} description - 설명
 * @property {string[]} strengths - 강점 목록
 * @property {MechanicSchema[]} keyMechanics - 핵심 메커니즘
 */

/**
 * 로테이션 스키마 (영웅특성별)
 * @typedef {Object} RotationSchema
 * @property {OpenerStepSchema[]} opener - 오프너 시퀀스
 * @property {PriorityItemSchema[]} stPriority - 단일 대상 우선순위
 * @property {PriorityItemSchema[]} aoePriority - 광역 우선순위
 * @property {ComboSchema} [essenceBreakWindow] - 정수파쇄 윈도우 등 콤보
 * @property {Object} [specialRules] - 특수 규칙 (예: 글레이브 규칙)
 */

/**
 * 티어 세트 스키마
 * @typedef {Object} TierSetSchema
 * @property {number} season - 시즌 번호
 * @property {string} twoSet - 2세트 효과
 * @property {string} fourSet - 4세트 효과
 */

/**
 * FAQ 아이템 스키마
 * @typedef {Object} FAQItemSchema
 * @property {string} question - 질문
 * @property {string} answer - 답변
 */

/**
 * 쿨다운 스키마
 * @typedef {Object} CooldownSchema
 * @property {string} skillName - 스킬명
 * @property {string} icon - 아이콘명
 * @property {string} cooldown - 쿨다운 시간
 * @property {string} [sync] - 동기화 정보
 */

// ============================================
// 전체 가이드 스키마
// ============================================

/**
 * 완전한 가이드 JSON 스키마
 * @typedef {Object} GuideSchema
 * @property {string} className - 직업 영문 ID (예: "demonhunter")
 * @property {string} classNameKo - 직업 한글명 (예: "악마사냥꾼")
 * @property {string} color - 직업 색상 코드
 * @property {Object} spec - 전문화 정보
 * @property {string} spec.specName - 전문화 영문 ID
 * @property {string} spec.specNameKo - 전문화 한글명
 * @property {string} spec.patch - 패치 버전
 * @property {string} spec.source - 데이터 출처
 * @property {string} spec.difficulty - 난이도
 * @property {string} spec.role - 역할 (DPS/Tank/Healer)
 * @property {string} spec.resourceType - 자원 타입
 * @property {Object} spec.overview - 개요
 * @property {string} spec.overview.description - 전문화 설명
 * @property {string[]} spec.overview.strengths - 강점
 * @property {string[]} spec.overview.weaknesses - 약점
 * @property {Object} spec.heroTalents - 영웅 특성 정보
 * @property {TierSetSchema} spec.tierSet - 티어 세트 정보
 * @property {Object} spec.rotation - 로테이션 (영웅특성별)
 * @property {MechanicSchema[]} spec.mechanics - 핵심 메커니즘
 * @property {string[]} spec.tips - 팁 목록
 * @property {FAQItemSchema[]} spec.faq - FAQ
 * @property {CooldownSchema[]} spec.cooldowns - 쿨다운 정보
 */

// ============================================
// 스키마 검증 함수
// ============================================

/**
 * 가이드 JSON 검증
 * @param {Object} guideData - 검증할 가이드 데이터
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateGuide(guideData) {
  const errors = [];
  
  // 필수 필드 검증
  const requiredFields = [
    'className',
    'classNameKo', 
    'color',
  ];
  
  requiredFields.forEach(field => {
    if (!guideData[field]) {
      errors.push(`필수 필드 누락: ${field}`);
    }
  });
  
  // spec 검증
  if (!guideData.specs) {
    errors.push('필수 필드 누락: specs');
  } else {
    Object.keys(guideData.specs).forEach(specKey => {
      const spec = guideData.specs[specKey];
      
      if (!spec.specName) errors.push(`${specKey}: specName 누락`);
      if (!spec.specNameKo) errors.push(`${specKey}: specNameKo 누락`);
      
      if (spec.ready) {
        // 활성화된 가이드는 추가 검증
        if (!spec.overview) errors.push(`${specKey}: overview 누락`);
        if (!spec.rotation) errors.push(`${specKey}: rotation 누락`);
        if (!spec.heroTalents) errors.push(`${specKey}: heroTalents 누락`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 아이콘 자동 매핑
 * 스킬명에서 아이콘을 자동으로 찾음
 */
export function getIconForSkill(skillName) {
  // 공백 제거하고 매핑 확인
  const normalizedName = skillName.replace(/\s/g, '');
  return COMMON_ICONS[normalizedName] || 'inv_misc_questionmark';
}

/**
 * 클래스 색상 가져오기
 */
export function getClassColor(className) {
  return CLASS_COLORS[className.toLowerCase()] || '#A330C9';
}

// ============================================
// 기본 템플릿 생성기
// ============================================

/**
 * 빈 가이드 템플릿 생성
 * @param {string} className - 직업 영문 ID
 * @param {string} classNameKo - 직업 한글명
 * @param {string} specName - 전문화 영문 ID
 * @param {string} specNameKo - 전문화 한글명
 * @returns {Object} 가이드 템플릿
 */
export function createGuideTemplate(className, classNameKo, specName, specNameKo) {
  return {
    className,
    classNameKo,
    color: getClassColor(className),
    specs: {
      [specName]: {
        specName,
        specNameKo,
        ready: false,
        lastUpdate: new Date().toISOString().split('T')[0],
        patch: '11.2.5',
        source: '',
        difficulty: 'Medium',
        role: 'DPS',
        resourceType: '',
        overview: {
          description: '',
          strengths: [],
          weaknesses: []
        },
        heroTalents: {
          // 영웅 특성 1
          hero1: {
            name: '',
            nameEn: '',
            icon: '',
            color: '',
            recommended: false,
            description: '',
            strengths: [],
            keyMechanics: []
          },
          // 영웅 특성 2
          hero2: {
            name: '',
            nameEn: '',
            icon: '',
            color: '',
            recommended: false,
            description: '',
            strengths: [],
            keyMechanics: []
          }
        },
        tierSet: {
          season: 3,
          hero1: { twoSet: '', fourSet: '' },
          hero2: { twoSet: '', fourSet: '' }
        },
        rotation: {
          hero1: {
            opener: [],
            stPriority: [],
            aoePriority: [],
            cooldowns: []
          },
          hero2: {
            opener: [],
            stPriority: [],
            aoePriority: [],
            cooldowns: []
          }
        },
        mechanics: [],
        tips: [],
        faq: [],
        resources: []
      }
    }
  };
}

// ============================================
// 스키마 내보내기
// ============================================

export default {
  CLASS_COLORS,
  COMMON_ICONS,
  validateGuide,
  getIconForSkill,
  getClassColor,
  createGuideTemplate
};
