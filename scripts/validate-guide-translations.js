/**
 * validate-guide-translations.js
 * 가이드 파일에서 번역 누락 및 툴팁 미적용 항목 검사
 *
 * 사용법: node scripts/validate-guide-translations.js
 */

const fs = require('fs');
const path = require('path');

// 영문 스킬/특성명 패턴 (대문자로 시작하는 2단어 이상)
const ENGLISH_SKILL_PATTERN = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;

// 알려진 영문 용어 (화이트리스트)
const KNOWN_ENGLISH_TERMS = new Set([
  'Wowhead',
  'SimC',
  'Bloodlust',
  'Hero',
  'Mythic',
  'Raid',
  'Class',
  'Spec'
]);

function validateGuide(guidePath) {
  console.log(`\n📋 검증 시작: ${guidePath}\n`);

  const guide = JSON.parse(fs.readFileSync(guidePath, 'utf-8'));
  const errors = [];

  // 재귀적으로 모든 문자열 검사
  function scan(obj, path = '') {
    if (typeof obj === 'string') {
      const matches = obj.match(ENGLISH_SKILL_PATTERN);
      if (matches) {
        const filtered = matches.filter(m => !KNOWN_ENGLISH_TERMS.has(m));
        if (filtered.length > 0) {
          errors.push({
            path,
            text: obj.substring(0, 100) + (obj.length > 100 ? '...' : ''),
            issues: filtered
          });
        }
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, idx) => scan(item, `${path}[${idx}]`));
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => scan(obj[key], `${path}.${key}`));
    }
  }

  scan(guide, 'guide');

  // 결과 출력
  if (errors.length === 0) {
    console.log('✅ 번역 누락 항목 없음!\n');
  } else {
    console.log(`❌ 번역 누락 항목 ${errors.length}개 발견:\n`);
    errors.forEach((error, idx) => {
      console.log(`${idx + 1}. 경로: ${error.path}`);
      console.log(`   영문: ${error.issues.join(', ')}`);
      console.log(`   텍스트: "${error.text}"`);
      console.log();
    });
  }

  return errors;
}

// 메인 실행
if (require.main === module) {
  const guidePath = path.join(__dirname, '../src/data/guides/demonhunter.json');
  const errors = validateGuide(guidePath);

  process.exit(errors.length > 0 ? 1 : 0);
}

module.exports = { validateGuide };
