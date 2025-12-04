/**
 * validate-guide-creation.js
 * 가이드 제작 지침 강제 검증 시스템
 *
 * 목적:
 * - GuideTemplate.js 사용 강제
 * - 복수 데이터 소스 교차 검증 확인
 * - 템플릿 키워드 잔류 검출
 * - 영어 직역 방지
 *
 * 사용법:
 * node scripts/validate-guide-creation.js <guide-file-path> --phase <pre|during|post>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// 1. 사전 검증 (Pre-Generation Validation)
// ============================================================================

/**
 * ArcaneMageGuide.js를 사용했는지 확인
 */
const validateTemplateUsage = (filePath) => {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  // ArcaneMageGuide.js 구조 확인
  // (영웅 특성 2개, 로테이션 섹션, 티어 세트 등이 있는지)
  const requiredStructure = [
    'getHeroContent',  // 영웅 특성 함수
    'getRotationContent',  // 로테이션 함수
    'tierSet',  // 티어 세트 객체
    'statPriority',  // 스탯 우선순위
  ];

  const hasRequiredStructure = requiredStructure.every(marker =>
    content.includes(marker)
  );

  if (!hasRequiredStructure) {
    errors.push({
      type: 'TEMPLATE_NOT_USED',
      severity: 'CRITICAL',
      message: '❌ ArcaneMageGuide.js 구조가 아닙니다. ArcaneMageGuide.js를 템플릿으로 사용하세요.',
      fix: 'cp src/components/ArcaneMageGuide.js src/components/YourGuide.js'
    });
  }

  return errors;
};

/**
 * 필수 데이터 소스가 명시되어 있는지 확인
 */
const validateDataSources = (filePath) => {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  // 필수 데이터 소스 URL 패턴
  const requiredSources = [
    { name: 'Wowhead', pattern: /wowhead\.com|ko\.wowhead\.com/ },
    { name: 'Maxroll', pattern: /maxroll\.gg/ }
  ];

  const missingSources = requiredSources.filter(source =>
    !source.pattern.test(content)
  );

  if (missingSources.length > 0) {
    errors.push({
      type: 'MISSING_DATA_SOURCES',
      severity: 'CRITICAL',
      message: `❌ 필수 데이터 소스 누락: ${missingSources.map(s => s.name).join(', ')}`,
      fix: '가이드 주석에 참고한 URL을 명시하세요.'
    });
  }

  // 단일 소스만 사용했는지 확인
  const sourceCount = requiredSources.filter(source =>
    source.pattern.test(content)
  ).length;

  if (sourceCount === 1) {
    errors.push({
      type: 'SINGLE_SOURCE_DEPENDENCY',
      severity: 'HIGH',
      message: '⚠️ 단일 데이터 소스만 사용했습니다. 최소 2개 이상의 소스를 교차 검증해야 합니다.',
      fix: 'Wowhead + Maxroll 또는 Wowhead + Icy Veins를 함께 참조하세요.'
    });
  }

  return errors;
};

/**
 * 클래스/전문화 메타데이터 존재 확인
 */
const validateMetadata = (filePath, className, specName) => {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  // className, specName이 올바르게 사용되었는지 확인
  const classNamePattern = new RegExp(className, 'i');
  const specNamePattern = new RegExp(specName, 'i');

  if (!classNamePattern.test(content)) {
    errors.push({
      type: 'MISSING_CLASS_NAME',
      severity: 'CRITICAL',
      message: `❌ 클래스명 "${className}"이(가) 가이드에 없습니다.`,
      fix: 'import 문과 컴포넌트명에 클래스명을 포함하세요.'
    });
  }

  if (!specNamePattern.test(content)) {
    errors.push({
      type: 'MISSING_SPEC_NAME',
      severity: 'CRITICAL',
      message: `❌ 전문화명 "${specName}"이(가) 가이드에 없습니다.`,
      fix: '전문화 관련 내용이 올바르게 작성되었는지 확인하세요.'
    });
  }

  return errors;
};

// ============================================================================
// 2. 실시간 검증 (During-Generation Validation)
// ============================================================================

/**
 * 템플릿 키워드 잔류 검출
 */
const validateTemplateKeywordRemoval = (filePath) => {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  // ArcaneMageGuide.js 기반 템플릿의 키워드 잔류 검출
  // (사용자가 ArcaneMageGuide.js를 복사했는데 "비전", "마법사" 키워드가 남아있으면 에러)
  const templateKeywords = [
    'DUMMY_TEXT',
    '영웅특성1',
    '영웅특성2',
    '리소스',
    'TODO: ',
    'arcaneMageSkills',  // ArcaneMage 예제 데이터
    '비전 마법사',  // ArcaneMage 클래스/전문화
    '성난태양',  // ArcaneMage 영웅특성
    '주문술사',  // ArcaneMage 영웅특성
    'Sunfury',  // 영문 영웅특성명
    'Spellslinger'  // 영문 영웅특성명
  ];

  const foundKeywords = templateKeywords.filter(keyword =>
    content.includes(keyword)
  );

  if (foundKeywords.length > 0) {
    errors.push({
      type: 'TEMPLATE_KEYWORDS_REMAINING',
      severity: 'CRITICAL',
      message: `❌ 템플릿 키워드가 ${foundKeywords.length}개 남아있습니다: ${foundKeywords.join(', ')}`,
      fix: 'GuideTemplate.js의 더미 텍스트를 모두 실제 데이터로 교체하세요.'
    });
  }

  return errors;
};

/**
 * 다른 클래스 키워드 검출 (예: 마법사 가이드에 "전사" 키워드)
 */
const validateWrongClassKeywords = (filePath, className) => {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  // 모든 클래스 키워드 목록
  const allClasses = [
    '전사', '성기사', '사냥꾼', '도적', '사제', '주술사',
    '마법사', '흑마법사', '수도사', '드루이드', '악마사냥꾼',
    '죽음의 기사', '기원사'
  ];

  // 현재 클래스 제외
  const otherClasses = allClasses.filter(c => c !== className);

  // 다른 클래스 키워드 검출
  const foundOtherClasses = otherClasses.filter(otherClass => {
    const regex = new RegExp(otherClass, 'g');
    const matches = content.match(regex);
    return matches && matches.length > 3;  // 3번 이상 언급 시 의심
  });

  if (foundOtherClasses.length > 0) {
    errors.push({
      type: 'WRONG_CLASS_KEYWORDS',
      severity: 'HIGH',
      message: `⚠️ 다른 클래스 키워드 발견: ${foundOtherClasses.join(', ')}`,
      fix: `${className} 가이드인데 다른 클래스 내용이 섞여있는지 확인하세요.`
    });
  }

  return errors;
};

/**
 * 스킬 아이콘 누락 검출
 */
const validateSkillIcons = (filePath) => {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  // 스킬 객체 패턴: { skill: skillData.xxx, ... }
  const skillPattern = /skill:\s*skillData\.(\w+)/g;
  const matches = [...content.matchAll(skillPattern)];

  if (matches.length === 0) {
    errors.push({
      type: 'NO_SKILLS_FOUND',
      severity: 'HIGH',
      message: '⚠️ 스킬 데이터가 없습니다. skillData.xxx 형식으로 스킬을 추가하세요.',
      fix: 'src/data/{className}SkillData.js를 import하고 사용하세요.'
    });
  }

  // 중복 스킬 검출
  const skillKeys = matches.map(m => m[1]);
  const duplicates = skillKeys.filter((key, index) =>
    skillKeys.indexOf(key) !== index
  );

  if (duplicates.length > 0) {
    errors.push({
      type: 'DUPLICATE_SKILLS',
      severity: 'MEDIUM',
      message: `⚠️ 중복된 스킬: ${[...new Set(duplicates)].join(', ')}`,
      fix: '로테이션에서 동일 스킬이 여러 번 언급되는지 확인하세요.'
    });
  }

  return errors;
};

/**
 * 영어 직역 검출 (흔한 오역 패턴)
 */
const validateTranslations = (filePath) => {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  // 흔한 영어 직역 오류 패턴
  const commonMistranslations = [
    { wrong: '가시 사격', correct: '날카로운 사격', english: 'Barbed Shot' },
    { wrong: '펫 광분', correct: '광기', english: 'Frenzy' },
    { wrong: '마무리 사격', correct: 'Kill Shot', english: 'Kill Shot' },
    { wrong: '재사용대기시간', correct: '재사용 대기시간', english: 'Cooldown' },
    { wrong: '40야드', correct: '40 야드', english: '40 yards' }
  ];

  const foundMistakes = commonMistranslations.filter(mistake =>
    content.includes(mistake.wrong)
  );

  if (foundMistakes.length > 0) {
    foundMistakes.forEach(mistake => {
      errors.push({
        type: 'TRANSLATION_ERROR',
        severity: 'HIGH',
        message: `⚠️ 번역 오류: "${mistake.wrong}" → "${mistake.correct}" (${mistake.english})`,
        fix: 'ko.wowhead.com에서 공식 번역을 확인하세요.'
      });
    });
  }

  // 영어 단어 검출 (한글 가이드인데 영어 남아있음)
  const englishWordsPattern = /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g;
  const englishWords = content.match(englishWordsPattern) || [];

  // 예외: 공식 용어 (Time Warp, Bloodlust 등)
  const allowedEnglishTerms = ['Time Warp', 'Bloodlust', 'Hero Talent'];
  const suspiciousEnglish = englishWords.filter(word =>
    !allowedEnglishTerms.includes(word)
  );

  if (suspiciousEnglish.length > 5) {
    errors.push({
      type: 'EXCESSIVE_ENGLISH',
      severity: 'MEDIUM',
      message: `⚠️ 영어 용어가 ${suspiciousEnglish.length}개 발견되었습니다. 한글로 번역이 필요합니다.`,
      fix: '모든 스킬/특성명은 한글로 작성하세요.'
    });
  }

  return errors;
};

// ============================================================================
// 3. 사후 검증 (Post-Generation Validation)
// ============================================================================

/**
 * 교차 검증 증거 확인
 */
const validateCrossVerificationEvidence = (filePath) => {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  // 검증 증거 마커 확인
  const evidenceMarkers = [
    '// Wowhead 검증:',
    '// Maxroll 검증:',
    '// Icy Veins 확인:',
    '// 교차 검증 완료'
  ];

  const foundEvidence = evidenceMarkers.filter(marker =>
    content.includes(marker)
  );

  if (foundEvidence.length === 0) {
    errors.push({
      type: 'NO_VERIFICATION_EVIDENCE',
      severity: 'HIGH',
      message: '⚠️ 교차 검증 증거가 없습니다. 데이터 출처를 주석으로 명시하세요.',
      fix: '각 섹션에 "// Wowhead 검증: [URL]" 형식으로 출처를 추가하세요.'
    });
  }

  return errors;
};

/**
 * 컴파일 성공 확인
 */
const validateCompilation = (filePath) => {
  const errors = [];

  // 컴파일 검증은 사용자가 수동으로 실행하도록 안내
  // (자동 빌드는 시간이 오래 걸리므로 사후 검증에서만 권장)
  errors.push({
    type: 'COMPILATION_CHECK',
    severity: 'INFO',
    message: 'ℹ️  컴파일 확인: npm run build를 실행하여 에러가 없는지 확인하세요.',
    fix: 'cd wow-meta-site && npm run build'
  });

  return errors;
};

/**
 * 필수 섹션 존재 확인
 */
const validateRequiredSections = (filePath) => {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  // 필수 섹션 목록
  const requiredSections = [
    { name: '개요', pattern: /## 개요|Overview/ },
    { name: '딜사이클', pattern: /## 딜사이클|Rotation/ },
    { name: '특성 빌드', pattern: /## 특성|Talents|Builds/ },
    { name: '스탯 우선순위', pattern: /## 스탯|Stats/ },
    { name: '영웅 특성', pattern: /영웅 특성|Hero Talent/ }
  ];

  const missingSections = requiredSections.filter(section =>
    !section.pattern.test(content)
  );

  if (missingSections.length > 0) {
    errors.push({
      type: 'MISSING_REQUIRED_SECTIONS',
      severity: 'HIGH',
      message: `⚠️ 필수 섹션 누락: ${missingSections.map(s => s.name).join(', ')}`,
      fix: 'GuideTemplate.js의 모든 섹션을 유지하세요.'
    });
  }

  return errors;
};

// ============================================================================
// 메인 검증 함수
// ============================================================================

/**
 * 단계별 검증 실행
 */
const validateGuide = (filePath, phase, className, specName) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  가이드 제작 지침 검증 (${phase} 단계)`);
  console.log(`${'='.repeat(60)}\n`);

  let allErrors = [];

  // Phase 1: 사전 검증 (Pre-Generation)
  if (phase === 'pre') {
    console.log('📋 사전 검증 시작...\n');

    allErrors = [
      ...validateTemplateUsage(filePath),
      ...validateDataSources(filePath),
      ...validateMetadata(filePath, className, specName)
    ];
  }

  // Phase 2: 실시간 검증 (During-Generation)
  if (phase === 'during') {
    console.log('🔍 실시간 검증 시작...\n');

    allErrors = [
      ...validateTemplateKeywordRemoval(filePath),
      ...validateWrongClassKeywords(filePath, className),
      ...validateSkillIcons(filePath),
      ...validateTranslations(filePath)
    ];
  }

  // Phase 3: 사후 검증 (Post-Generation)
  if (phase === 'post') {
    console.log('✅ 사후 검증 시작...\n');

    allErrors = [
      ...validateCrossVerificationEvidence(filePath),
      ...validateCompilation(filePath),
      ...validateRequiredSections(filePath)
    ];
  }

  // 결과 출력
  const critical = allErrors.filter(e => e.severity === 'CRITICAL');
  const high = allErrors.filter(e => e.severity === 'HIGH');
  const medium = allErrors.filter(e => e.severity === 'MEDIUM');
  const info = allErrors.filter(e => e.severity === 'INFO');

  if (critical.length === 0 && high.length === 0 && medium.length === 0) {
    console.log('✅ 모든 검증 통과!\n');

    // INFO 메시지 출력 (경고는 아님)
    if (info.length > 0) {
      console.log('ℹ️  추가 확인사항:\n');
      info.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message}`);
        console.log(`   ${error.fix}\n`);
      });
    }

    return true;
  } else {
    console.log(`❌ ${allErrors.length}개의 문제 발견:\n`);

    // Critical 출력
    if (critical.length > 0) {
      console.log('🔴 CRITICAL (즉시 수정 필수):\n');
      critical.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message}`);
        console.log(`   해결책: ${error.fix}\n`);
      });
    }

    // High 출력
    if (high.length > 0) {
      console.log('🟠 HIGH (수정 권장):\n');
      high.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message}`);
        console.log(`   해결책: ${error.fix}\n`);
      });
    }

    // Medium 출력
    if (medium.length > 0) {
      console.log('🟡 MEDIUM (검토 필요):\n');
      medium.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message}`);
        console.log(`   해결책: ${error.fix}\n`);
      });
    }

    console.log(`${'='.repeat(60)}\n`);
    return false;
  }
};

// ============================================================================
// CLI 실행
// ============================================================================

const main = () => {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.log(`
사용법: node scripts/validate-guide-creation.js <guide-file> <className> <specName> --phase <pre|during|post>

예시:
  # 사전 검증 (가이드 생성 시작 전)
  node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase pre

  # 실시간 검증 (작성 중)
  node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase during

  # 사후 검증 (작성 완료 후)
  node scripts/validate-guide-creation.js src/components/ArcaneMageGuide.js mage arcane --phase post
    `);
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  const className = args[1];
  const specName = args[2];
  const phaseIndex = args.indexOf('--phase');
  const phase = phaseIndex !== -1 ? args[phaseIndex + 1] : 'post';

  if (!fs.existsSync(filePath)) {
    console.error(`❌ 파일을 찾을 수 없습니다: ${filePath}`);
    process.exit(1);
  }

  if (!['pre', 'during', 'post'].includes(phase)) {
    console.error(`❌ 올바르지 않은 phase: ${phase} (pre, during, post 중 하나)`);
    process.exit(1);
  }

  const success = validateGuide(filePath, phase, className, specName);
  process.exit(success ? 0 : 1);
};

export { validateGuide };

// 스크립트가 직접 실행되었을 때만 main() 호출
// (import되어 사용될 때는 호출하지 않음)
const isMainModule = () => {
  // Windows 경로 정규화
  const scriptPath = fileURLToPath(import.meta.url).replace(/\\/g, '/');
  const execPath = process.argv[1]?.replace(/\\/g, '/');
  return scriptPath === execPath;
};

if (isMainModule()) {
  main();
}
