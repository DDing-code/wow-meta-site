#!/usr/bin/env node
/**
 * 스킬/버프/특성 툴팁 커버리지 검증 스크립트
 *
 * 목적:
 * - 가이드 JSON 파일에서 스킬명 언급 감지
 * - multilingual-spell-database.json과 매칭
 * - 툴팁 누락 항목 리포트 생성
 *
 * 사용법:
 *   node scripts/check-tooltip-coverage.js
 *   node scripts/check-tooltip-coverage.js --guide mage
 */

const fs = require('fs');
const path = require('path');

// 설정
const CONFIG = {
  guidesDir: path.join(__dirname, '../src/data/guides'),
  skillDbPath: path.join(__dirname, '../src/data/multilingual-spell-database.json'),
  outputReport: path.join(__dirname, '../tooltip-coverage-report.json'),
};

// 색상 출력 (터미널)
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 스킬 데이터베이스 로드
function loadSkillDatabase() {
  const dbContent = fs.readFileSync(CONFIG.skillDbPath, 'utf8');
  const db = JSON.parse(dbContent);

  const skillNames = new Map(); // 한글명/영문명 → Spell ID

  Object.entries(db.skills).forEach(([spellId, skill]) => {
    // 한글명
    if (skill.koreanName) {
      skillNames.set(skill.koreanName.toLowerCase(), spellId);
    }
    if (skill.name && skill.name !== skill.koreanName) {
      skillNames.set(skill.name.toLowerCase(), spellId);
    }

    // 영문명
    if (skill.englishName) {
      skillNames.set(skill.englishName.toLowerCase(), spellId);
    }
  });

  log(`✅ 스킬 데이터베이스 로드 완료: ${skillNames.size}개 스킬명`, 'green');
  return { db, skillNames };
}

// JSON 객체에서 모든 텍스트 필드 추출 (재귀)
function extractTextFields(obj, path = '') {
  const texts = [];

  if (typeof obj === 'string') {
    return [{ text: obj, path }];
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      texts.push(...extractTextFields(item, `${path}[${idx}]`));
    });
    return texts;
  }

  if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key;
      texts.push(...extractTextFields(value, newPath));
    });
  }

  return texts;
}

// 텍스트에서 스킬명 찾기
function findSkillMentions(text, skillNames) {
  const mentions = [];
  const textLower = text.toLowerCase();

  // 모든 스킬명을 긴 것부터 검색 (부분 매칭 방지)
  const sortedSkills = Array.from(skillNames.keys()).sort((a, b) => b.length - a.length);

  for (const skillName of sortedSkills) {
    if (textLower.includes(skillName)) {
      const spellId = skillNames.get(skillName);
      mentions.push({
        skillName,
        spellId,
        originalText: text,
      });
    }
  }

  return mentions;
}

// 가이드 파일 분석
function analyzeGuide(guidePath, skillNames) {
  const fileName = path.basename(guidePath);
  const guideContent = fs.readFileSync(guidePath, 'utf8');
  const guideData = JSON.parse(guideContent);

  log(`\n📄 분석 중: ${fileName}`, 'cyan');

  // 모든 텍스트 필드 추출
  const textFields = extractTextFields(guideData);
  log(`  └─ 총 ${textFields.length}개 텍스트 필드 발견`, 'blue');

  // 각 텍스트에서 스킬 언급 찾기
  const allMentions = [];
  const mentionsByField = [];

  textFields.forEach(({ text, path }) => {
    const mentions = findSkillMentions(text, skillNames);
    if (mentions.length > 0) {
      allMentions.push(...mentions);
      mentionsByField.push({
        path,
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        mentions: mentions.map(m => ({ skill: m.skillName, id: m.spellId })),
      });
    }
  });

  // 중복 제거 (같은 스킬이 여러 번 언급될 수 있음)
  const uniqueSkills = new Set(allMentions.map(m => m.spellId));

  log(`  └─ 스킬 언급 ${allMentions.length}회 (고유 스킬 ${uniqueSkills.size}개)`, 'green');

  return {
    fileName,
    totalTextFields: textFields.length,
    totalMentions: allMentions.length,
    uniqueSkills: uniqueSkills.size,
    mentionsByField,
    skillList: Array.from(uniqueSkills),
  };
}

// 컴포넌트 파일에서 ParseSkillText 사용 여부 확인
function checkComponentImplementation(guideName) {
  const componentPatterns = [
    path.join(__dirname, `../src/components/${guideName}Guide.js`),
    path.join(__dirname, `../src/components/guides/${guideName}Guide.js`),
    path.join(__dirname, `../src/components/${guideName}.js`),
  ];

  for (const componentPath of componentPatterns) {
    if (fs.existsSync(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8');

      const hasParseSkillText = content.includes('ParseSkillText');
      const hasSkillTooltip = content.includes('SkillTooltip');
      const hasInlineSkill = content.includes('InlineSkill');
      const hasSkillHub = content.includes('useSkillHub') || content.includes('SkillHub');

      return {
        exists: true,
        path: componentPath,
        hasParseSkillText,
        hasSkillTooltip,
        hasInlineSkill,
        hasSkillHub,
        coverage: hasParseSkillText ? 100 : (hasSkillTooltip ? 50 : 0),
      };
    }
  }

  return { exists: false, coverage: 0 };
}

// 메인 실행
function main() {
  log('\n🔍 스킬/버프/특성 툴팁 커버리지 검증 시작\n', 'cyan');

  // 1. 스킬 DB 로드
  const { db, skillNames } = loadSkillDatabase();

  // 2. 가이드 파일 목록
  const guideFiles = fs.readdirSync(CONFIG.guidesDir)
    .filter(f => f.endsWith('.json') && !f.includes('backup'))
    .map(f => path.join(CONFIG.guidesDir, f));

  log(`\n📚 가이드 파일 ${guideFiles.length}개 발견`, 'blue');

  // 3. 각 가이드 분석
  const results = [];

  guideFiles.forEach(guidePath => {
    const analysis = analyzeGuide(guidePath, skillNames);

    // 컴포넌트 구현 확인
    const guideName = path.basename(guidePath, '.json');
    const componentImpl = checkComponentImplementation(guideName);

    analysis.component = componentImpl;
    results.push(analysis);

    // 결과 출력
    if (componentImpl.exists) {
      const statusIcon = componentImpl.coverage === 100 ? '✅' :
                        componentImpl.coverage >= 50 ? '⚠️' : '❌';
      log(`  ${statusIcon} 컴포넌트: ${componentImpl.coverage}% 툴팁 구현`,
          componentImpl.coverage === 100 ? 'green' :
          componentImpl.coverage >= 50 ? 'yellow' : 'red');
    } else {
      log(`  ❌ 컴포넌트 파일 없음`, 'red');
    }
  });

  // 4. 전체 요약
  log('\n\n📊 전체 요약', 'cyan');
  log('═'.repeat(60), 'cyan');

  const totalMentions = results.reduce((sum, r) => sum + r.totalMentions, 0);
  const totalUnique = results.reduce((sum, r) => sum + r.uniqueSkills, 0);
  const implemented = results.filter(r => r.component.coverage === 100).length;
  const partial = results.filter(r => r.component.coverage > 0 && r.component.coverage < 100).length;
  const missing = results.filter(r => r.component.coverage === 0).length;

  log(`\n총 스킬 언급: ${totalMentions}회`, 'blue');
  log(`고유 스킬: ${totalUnique}개`, 'blue');
  log(`\n툴팁 구현 현황:`, 'yellow');
  log(`  ✅ 완료: ${implemented}개 가이드 (100%)`, 'green');
  log(`  ⚠️ 부분: ${partial}개 가이드 (50%)`, 'yellow');
  log(`  ❌ 누락: ${missing}개 가이드 (0%)`, 'red');

  const overallCoverage = results.reduce((sum, r) => sum + r.component.coverage, 0) / results.length;
  log(`\n전체 커버리지: ${overallCoverage.toFixed(1)}%`,
      overallCoverage >= 80 ? 'green' : overallCoverage >= 50 ? 'yellow' : 'red');

  // 5. 누락 상세 리포트
  const missingGuides = results.filter(r => r.component.coverage < 100);

  if (missingGuides.length > 0) {
    log('\n\n⚠️ 툴팁 누락 가이드 상세:', 'yellow');
    log('─'.repeat(60), 'yellow');

    missingGuides.forEach(guide => {
      log(`\n📄 ${guide.fileName}`, 'cyan');
      log(`  스킬 언급: ${guide.totalMentions}회 (고유 ${guide.uniqueSkills}개)`, 'blue');
      log(`  컴포넌트: ${guide.component.exists ? '존재' : '없음'}`,
          guide.component.exists ? 'green' : 'red');
      log(`  툴팁 구현: ${guide.component.coverage}%`,
          guide.component.coverage >= 50 ? 'yellow' : 'red');

      if (guide.component.exists) {
        log(`    - ParseSkillText: ${guide.component.hasParseSkillText ? '✅' : '❌'}`,
            guide.component.hasParseSkillText ? 'green' : 'red');
        log(`    - SkillTooltip: ${guide.component.hasSkillTooltip ? '✅' : '❌'}`,
            guide.component.hasSkillTooltip ? 'green' : 'red');
        log(`    - SkillHub: ${guide.component.hasSkillHub ? '✅' : '❌'}`,
            guide.component.hasSkillHub ? 'green' : 'red');
      }

      // 샘플 언급 출력 (최대 5개)
      if (guide.mentionsByField.length > 0) {
        log(`\n  스킬 언급 샘플 (최대 5개):`, 'blue');
        guide.mentionsByField.slice(0, 5).forEach(field => {
          log(`    • ${field.path}:`, 'cyan');
          log(`      "${field.text}"`, 'reset');
          log(`      → ${field.mentions.map(m => `${m.skill} (${m.id})`).join(', ')}`, 'yellow');
        });

        if (guide.mentionsByField.length > 5) {
          log(`    ... 외 ${guide.mentionsByField.length - 5}개`, 'blue');
        }
      }
    });
  }

  // 6. JSON 리포트 저장
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalGuides: results.length,
      totalMentions,
      totalUnique,
      implemented,
      partial,
      missing,
      overallCoverage,
    },
    guides: results,
  };

  fs.writeFileSync(CONFIG.outputReport, JSON.stringify(report, null, 2), 'utf8');
  log(`\n\n💾 상세 리포트 저장: ${CONFIG.outputReport}`, 'green');

  // 7. 권장 사항
  if (missing > 0) {
    log('\n\n💡 권장 사항:', 'cyan');
    log('─'.repeat(60), 'cyan');
    log('1. HavocDemonHunterGuide.js의 ParseSkillText 패턴 참고', 'yellow');
    log('2. 우선순위: 스킬 언급이 많은 가이드부터 수정', 'yellow');
    log('3. 자동화 스크립트 사용: apply-tooltip-to-guides.js', 'yellow');
  }

  log('\n✅ 검증 완료\n', 'green');
}

// 실행
main();
