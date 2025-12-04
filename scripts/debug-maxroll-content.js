/**
 * Maxroll 페이지 콘텐츠 추출 디버깅
 *
 * 각 섹션의 실제 내용을 추출하여 파서가 왜 실패했는지 확인합니다.
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function debugMaxrollContent(url) {
  console.log('🔍 Maxroll 콘텐츠 추출 디버깅:', url);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ 페이지 로드 완료');
    await page.waitForTimeout(5000);

    // 섹션별 콘텐츠 추출
    const content = await page.evaluate(() => {
      const result = {
        overview: { found: false, content: '' },
        rotation: { found: false, lists: [], text: '' },
        stats: { found: false, lists: [], text: '' },
        heroTalents: { found: false, text: '' }
      };

      // Helper: h2 태그를 텍스트로 찾기
      const findH2ByText = (keywords) => {
        const h2Elements = Array.from(document.querySelectorAll('h2'));
        return h2Elements.find(h2 => {
          const text = h2.textContent.toLowerCase();
          return keywords.some(keyword => text.includes(keyword.toLowerCase()));
        });
      };

      // 1. Overview 섹션
      const overviewH2 = findH2ByText(['Overview']);
      if (overviewH2) {
        result.overview.found = true;
        let current = overviewH2.nextElementSibling;
        const texts = [];

        for (let i = 0; i < 10 && current && !current.matches('h2'); i++) {
          if (current.textContent && current.textContent.trim()) {
            texts.push({
              tag: current.tagName,
              class: current.className,
              text: current.textContent.trim().substring(0, 200)
            });
          }
          current = current.nextElementSibling;
        }

        result.overview.content = texts;
      }

      // 2. Rotation 섹션
      const rotationH2 = findH2ByText(['Rotation', 'Priority']);
      if (rotationH2) {
        result.rotation.found = true;
        let current = rotationH2.nextElementSibling;
        const texts = [];

        for (let i = 0; i < 30 && current && !current.matches('h2'); i++) {
          if (current.matches('ol, ul')) {
            const items = current.querySelectorAll('li');
            items.forEach((li, idx) => {
              texts.push({
                type: 'list-item',
                index: idx,
                text: li.textContent.trim().substring(0, 150)
              });
            });
          } else if (current.textContent && current.textContent.trim()) {
            texts.push({
              tag: current.tagName,
              class: current.className,
              text: current.textContent.trim().substring(0, 150)
            });
          }
          current = current.nextElementSibling;
        }

        result.rotation.text = texts;
      }

      // 3. Stat Priority 섹션
      const statsH2 = findH2ByText(['Stat Priority', 'Stats']);
      if (statsH2) {
        result.stats.found = true;
        let current = statsH2.nextElementSibling;
        const texts = [];

        for (let i = 0; i < 15 && current && !current.matches('h2'); i++) {
          if (current.matches('ol, ul')) {
            const items = current.querySelectorAll('li');
            items.forEach((li, idx) => {
              texts.push({
                type: 'list-item',
                index: idx,
                text: li.textContent.trim()
              });
            });
          } else if (current.textContent && current.textContent.trim()) {
            texts.push({
              tag: current.tagName,
              class: current.className,
              text: current.textContent.trim().substring(0, 150)
            });
          }
          current = current.nextElementSibling;
        }

        result.stats.text = texts;
      }

      // 4. Hero Talents 섹션
      const heroH2 = findH2ByText(['Hero Talent']);
      if (heroH2) {
        result.heroTalents.found = true;
        let current = heroH2.nextElementSibling;
        const texts = [];

        for (let i = 0; i < 15 && current && !current.matches('h2'); i++) {
          if (current.textContent && current.textContent.trim()) {
            texts.push({
              tag: current.tagName,
              class: current.className,
              text: current.textContent.trim().substring(0, 200)
            });
          }
          current = current.nextElementSibling;
        }

        result.heroTalents.text = texts;
      }

      return result;
    });

    console.log('\n📊 콘텐츠 추출 결과:\n');

    console.log('=== Overview 섹션 ===');
    console.log('발견:', content.overview.found);
    if (content.overview.found) {
      content.overview.content.slice(0, 5).forEach((item, i) => {
        console.log(`${i + 1}. [${item.tag}] ${item.text.substring(0, 100)}`);
      });
    }

    console.log('\n=== Rotation 섹션 ===');
    console.log('발견:', content.rotation.found);
    if (content.rotation.found) {
      content.rotation.text.slice(0, 10).forEach((item, i) => {
        if (item.type === 'list-item') {
          console.log(`${i + 1}. [LIST] ${item.text}`);
        } else {
          console.log(`${i + 1}. [${item.tag}] ${item.text.substring(0, 100)}`);
        }
      });
    }

    console.log('\n=== Stat Priority 섹션 ===');
    console.log('발견:', content.stats.found);
    if (content.stats.found) {
      content.stats.text.slice(0, 10).forEach((item, i) => {
        if (item.type === 'list-item') {
          console.log(`${i + 1}. [LIST] ${item.text}`);
        } else {
          console.log(`${i + 1}. [${item.tag}] ${item.text}`);
        }
      });
    }

    console.log('\n=== Hero Talents 섹션 ===');
    console.log('발견:', content.heroTalents.found);
    if (content.heroTalents.found) {
      content.heroTalents.text.slice(0, 5).forEach((item, i) => {
        console.log(`${i + 1}. [${item.tag}] ${item.text.substring(0, 100)}`);
      });
    }

    // JSON 저장
    const outputPath = 'temp/maxroll-content-debug.json';
    fs.writeFileSync(outputPath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`\n💾 전체 결과 저장: ${outputPath}`);

    await browser.close();

  } catch (error) {
    await browser.close();
    console.error('❌ 분석 실패:', error.message);
    throw error;
  }
}

// 실행
const url = process.argv[2] || 'https://maxroll.gg/wow/class-guides/arcane-mage-mythic-plus-guide';
debugMaxrollContent(url);
