/**
 * Maxroll 정기 주술사 가이드 스크린샷 수집
 *
 * 목적: Playwright로 전체 페이지 스크린샷 수집
 * - 레이드 가이드 전체
 * - M+ 가이드 전체
 * - 플로우차트/우선순위 섹션
 */

const { chromium } = require('playwright');
const path = require('path');

async function captureMaxrollElementalShaman() {
  console.log('🚀 Maxroll 정기 주술사 가이드 스크린샷 수집 시작...\n');

  const browser = await chromium.launch({
    headless: true,
    timeout: 120000
  });

  const page = await browser.newPage();

  // 뷰포트 설정 (1920x1080)
  await page.setViewportSize({ width: 1920, height: 1080 });

  try {
    // 1. 레이드 가이드 전체 페이지
    console.log('📸 1/2: 레이드 가이드 스크린샷 수집 중...');
    await page.goto('https://maxroll.gg/wow/class-guides/elemental-shaman-raid-guide', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // 페이지 로딩 완료 대기
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: path.join(__dirname, 'maxroll-elemental-shaman-raid-full.png'),
      fullPage: true
    });
    console.log('   ✅ maxroll-elemental-shaman-raid-full.png 저장 완료');

    // 2. M+ 가이드 전체 페이지
    console.log('📸 2/2: M+ 가이드 스크린샷 수집 중...');
    await page.goto('https://maxroll.gg/wow/class-guides/elemental-shaman-mythic-plus-guide', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // 페이지 로딩 완료 대기
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: path.join(__dirname, 'maxroll-elemental-shaman-mythic-full.png'),
      fullPage: true
    });
    console.log('   ✅ maxroll-elemental-shaman-mythic-full.png 저장 완료');

    // 3. 특정 섹션 스크린샷 시도 (선택적)
    console.log('\n📸 특정 섹션 스크린샷 시도...');
    const sections = [
      { selector: '.rotation-priority', name: 'priority' },
      { selector: '.priority-list', name: 'priority-list' },
      { selector: '.flowchart', name: 'flowchart' },
      { selector: '.talent-tree', name: 'talents' },
      { selector: '[class*="rotation"]', name: 'rotation-section' },
      { selector: '[class*="priority"]', name: 'priority-section' }
    ];

    for (const { selector, name } of sections) {
      try {
        const element = await page.$(selector);
        if (element) {
          await element.screenshot({
            path: path.join(__dirname, `maxroll-elemental-shaman-${name}.png`)
          });
          console.log(`   ✅ maxroll-elemental-shaman-${name}.png 저장 완료`);
        } else {
          console.log(`   ⚠️  ${selector} 요소를 찾을 수 없음`);
        }
      } catch (err) {
        console.log(`   ⚠️  ${selector} 스크린샷 실패: ${err.message}`);
      }
    }

    console.log('\n✅ 모든 스크린샷 수집 완료!');
    console.log('\n📂 저장된 파일:');
    console.log('   - maxroll-elemental-shaman-raid-full.png');
    console.log('   - maxroll-elemental-shaman-mythic-full.png');
    console.log('   - (기타 섹션별 스크린샷)\n');

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// 스크립트 실행
if (require.main === module) {
  captureMaxrollElementalShaman()
    .then(() => {
      console.log('🎉 작업 완료!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 치명적 오류:', error);
      process.exit(1);
    });
}

module.exports = { captureMaxrollElementalShaman };
