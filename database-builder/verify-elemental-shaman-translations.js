/**
 * verify-elemental-shaman-translations.js
 *
 * 목적: ko.wowhead.com에서 Playwright로 정기 주술사 스킬의 공식 한글 번역 검증
 * 출력: 현재 번역 vs 공식 번역 비교 리스트
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// elementalShamanSkillData.js에서 현재 번역 추출
const { elementalShamanSkills } = require('../src/data/elementalShamanSkillData');

async function verifyTranslations() {
  console.log('🔍 정기 주술사 스킬 공식 번역 검증 시작...\n');

  const browser = await chromium.launch({
    headless: true,
    timeout: 120000
  });
  const page = await browser.newPage();

  const results = [];
  const skillEntries = Object.entries(elementalShamanSkills);
  let mismatchCount = 0;

  for (let i = 0; i < skillEntries.length; i++) {
    const [key, skill] = skillEntries[i];

    console.log(`[${i + 1}/${skillEntries.length}] 검증 중: ${skill.koreanName} (${skill.englishName})`);

    try {
      // Wowhead 페이지 접속
      await page.goto(`https://www.wowhead.com/ko/spell=${skill.id}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      await page.waitForTimeout(2000);

      // 공식 한글명 추출
      const officialName = await page.evaluate(() => {
        const title = document.querySelector('.heading-size-1')?.textContent?.trim();
        return title;
      });

      const needsUpdate = skill.koreanName !== officialName;

      if (needsUpdate) {
        mismatchCount++;
        console.log(`  ⚠️  불일치: "${skill.koreanName}" → "${officialName}"`);
      } else {
        console.log(`  ✅ 일치: "${skill.koreanName}"`);
      }

      results.push({
        key: key,
        id: skill.id,
        englishName: skill.englishName,
        currentName: skill.koreanName,
        officialName: officialName,
        needsUpdate: needsUpdate
      });

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.log(`  ❌ 오류: ${error.message}`);
      results.push({
        key: key,
        id: skill.id,
        englishName: skill.englishName,
        currentName: skill.koreanName,
        officialName: null,
        needsUpdate: false,
        error: error.message
      });
    }
  }

  await browser.close();

  // 결과 저장
  const outputPath = path.join(__dirname, 'translation-verification-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

  // 요약 출력
  console.log('\n\n=== 검증 완료 ===\n');
  console.log(`✅ 일치: ${results.length - mismatchCount}개`);
  console.log(`⚠️  불일치: ${mismatchCount}개`);

  if (mismatchCount > 0) {
    console.log('\n📝 수정 필요 스킬:');
    results
      .filter(r => r.needsUpdate)
      .forEach(r => {
        console.log(`  - ${r.key}: "${r.currentName}" → "${r.officialName}"`);
      });
  }

  console.log(`\n💾 결과 저장: ${outputPath}\n`);

  return results;
}

// 스크립트 실행
if (require.main === module) {
  verifyTranslations()
    .then(() => {
      console.log('✅ 검증 완료!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ 치명적 오류:', error);
      process.exit(1);
    });
}

module.exports = { verifyTranslations };
