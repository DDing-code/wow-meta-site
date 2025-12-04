/**
 * auto-translate-skills.js
 * 가이드 파일의 영문 스킬/특성명을 한글로 자동 번역
 *
 * 우선순위: Wowhead 공식 한글 → KB 파일 → 기존 매핑
 * 사용법: node scripts/auto-translate-skills.js
 */

const fs = require('fs');
const path = require('path');

// 번역 매핑 (Wowhead 공식 한글 기준)
const SKILL_TRANSLATIONS = {
  // 영웅 특성
  'Aldrachi Reaver': '알드라치 칼날',
  'Fel-Scarred': '지옥상흔',
  'Fel Scarred': '지옥상흔',

  // 특성
  'Wounded Quarry': '부상당한 사냥감',
  'Essence Break Window': '정수 파쇄 타이밍',
  'Essence Break': '정수 파쇄',
  'Student of Suffering': '고통의 수습생',
  'Art of the Glaive': '예술의 검',

  // 스킬
  'Chaos Strike': '혼돈의 일격',
  'Eye Beam': '안광',
  'Vengeful Retreat': '복수의 퇴각',
  'Fel Rush': '지옥 돌진',
  'Immolation Aura': '제물의 오라',
  'Metamorphosis': '탈태',
  'Demon Blades': '악마의 칼날',
  'Blade Dance': '칼춤',
  'Death Sweep': '죽음의 휩쓸기',
  'Fel Barrage': '지옥 연발',
  'Throw Glaive': '글레이브 투척',

  // 기타 용어 (번역 안 함)
  // 고유명사/아이템명은 제외
};

// 번역하지 않을 고유명사 (화이트리스트)
const WHITELIST = new Set([
  'Icy Veins',
  'Wowhead',
  'SimC',
  'Raidbots',
  'Fel Hammer',
  'Bloodlust',
  'Mythic',
  'Raid',
  'Heroic',
  'Normal',

  // 아이템명
  'Reshii Wraps',
  'Astral Antenna',
  'Cursed Stone Idol',
  'Screams of Forgotten Sky',
  'Ritual Forge',
  'Crystalline Radiance',
  'Sunset Spellthread',
  'Radiant Critical Strike',
  'Culminating Blasphemite',
  'Algari Diamond',
  'Deadly Emerald',
  'Masterful Emerald',
  'Darkmoon Sigil',
  'Writhing Armor Banding',
  'Interloper\'s Chain Boots',
  'Chain Boots',
  'Precise Fiber',

  // 보석/마법부여
  'Sapphire',
  'Onyx',
  'Emerald'
]);

function translateGuide(guidePath) {
  console.log(`\n🔄 번역 시작: ${guidePath}\n`);

  let content = fs.readFileSync(guidePath, 'utf-8');
  let translationCount = 0;

  // 각 번역 매핑 적용
  for (const [english, korean] of Object.entries(SKILL_TRANSLATIONS)) {
    // 화이트리스트 확인
    if (WHITELIST.has(english)) {
      console.log(`⏭️  건너뜀 (화이트리스트): ${english}`);
      continue;
    }

    // 번역 적용 (대소문자 구분)
    const regex = new RegExp(`\\b${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const before = content;
    content = content.replace(regex, korean);

    if (content !== before) {
      const count = (before.match(regex) || []).length;
      translationCount += count;
      console.log(`✅ ${english} → ${korean} (${count}회)`);
    }
  }

  // 결과 저장
  fs.writeFileSync(guidePath, content, 'utf-8');

  console.log(`\n🎉 번역 완료: 총 ${translationCount}개 항목 번역됨\n`);
  return translationCount;
}

// 메인 실행
if (require.main === module) {
  const guidePath = path.join(__dirname, '../src/data/guides/demonhunter.json');

  // 백업 생성
  const backupPath = guidePath.replace('.json', '.backup.json');
  fs.copyFileSync(guidePath, backupPath);
  console.log(`📦 백업 생성: ${backupPath}`);

  translateGuide(guidePath);
}

module.exports = { translateGuide, SKILL_TRANSLATIONS };
