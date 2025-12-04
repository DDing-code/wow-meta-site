/**
 * remove-korean-particles.js
 *
 * 목적: ElementalShamanGuide.js에서 한국어 조사 괄호 제거
 * 예: "으로(로)" → "으로", "를(를)" → "를", "이(가)" → "가"
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'ElementalShamanGuide.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔄 한국어 조사 괄호 제거 시작...\n');

// 한국어 조사 괄호 패턴과 교체 규칙
const replacements = [
  // 1. "으로(로)" → "으로"
  { pattern: /으로\(로\)/g, replacement: '으로', name: '으로(로) → 으로' },

  // 2. "로(로)" → "로" (받침 없는 경우)
  { pattern: /로\(로\)/g, replacement: '로', name: '로(로) → 로' },

  // 3. "를(를)" → "를" (받침 없는 경우)
  { pattern: /를\(를\)/g, replacement: '를', name: '를(를) → 를' },

  // 4. "을(를)" → "을" (받침 있는 경우)
  { pattern: /을\(를\)/g, replacement: '을', name: '을(를) → 을' },

  // 5. "이(가)" → "가" (받침 없는 경우가 많음)
  { pattern: /이\(가\)/g, replacement: '가', name: '이(가) → 가' },

  // 6. "가(가)" → "가"
  { pattern: /가\(가\)/g, replacement: '가', name: '가(가) → 가' },

  // 7. "의(의)" → "의"
  { pattern: /의\(의\)/g, replacement: '의', name: '의(의) → 의' },

  // 8. "와(와)" → "와"
  { pattern: /와\(와\)/g, replacement: '와', name: '와(와) → 와' },

  // 9. "과(와)" → "와" (받침 없는 경우가 많음)
  { pattern: /과\(와\)/g, replacement: '와', name: '과(와) → 와' }
];

// 각 패턴 교체 실행
let totalReplacements = 0;
replacements.forEach(({ pattern, replacement, name }) => {
  const matches = content.match(pattern);
  const count = matches ? matches.length : 0;

  if (count > 0) {
    content = content.replace(pattern, replacement);
    console.log(`✅ ${name} (${count}개 교체)`);
    totalReplacements += count;
  }
});

// 파일 저장
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n✅ 총 ${totalReplacements}개 한국어 조사 괄호 제거 완료!`);
console.log(`💾 파일 저장: ${filePath}\n`);
