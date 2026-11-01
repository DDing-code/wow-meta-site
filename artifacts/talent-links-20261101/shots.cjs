// 특성 ↔ 스킬 연결 도식 화면 확인: 무기 전사 가이드를 1440·390px 에서 열어 첫 흐름도·단일 타임라인을 찍고, 상자에 마우스를 올린 강조 상태도 찍는다.
// 사용: node artifacts/talent-links-20261101/shots.cjs http://127.0.0.1:4181
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:4181';
const out = path.join(__dirname, 'shots');
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
(async () => {
  const browser = await chromium.launch();
  const results = {};
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, userAgent: UA, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(`${base}/guide/warrior/arms`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-book-box="diagram"]');
    await page.waitForTimeout(800);
    const info = await page.evaluate(() => {
      const diagrams = [...document.querySelectorAll('[data-book-box="diagram"]')];
      const timelines = [...document.querySelectorAll('[data-book-box="timeline"]')];
      const overflowBoxes = [...document.querySelectorAll('[data-book-box], [data-timeline-rail]')].filter(el => el.scrollWidth > el.clientWidth + 1).length;
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        overflowBoxes,
        diagrams: diagrams.length,
        diagramsWithLinks: diagrams.filter(el => el.querySelector('[data-diagram-links]')).length,
        linkPaths: document.querySelectorAll('[data-diagram-link] path').length,
        affectRows: document.querySelectorAll('[aria-label="붙는 스킬"]').length,
        affectIcons: document.querySelectorAll('[aria-label="붙는 스킬"] a[data-wowhead]').length,
        timelines: timelines.length,
        talentCells: document.querySelectorAll('[data-timeline-talents]').length,
        talentIcons: document.querySelectorAll('[data-timeline-talents] a[data-wowhead]').length,
        brokenIcons: [...document.querySelectorAll('[data-book-box] img')].filter(img => img.complete && img.naturalWidth === 0).length,
        // 선 끝점이 모두 흐름도 안에 있는지(음수·바깥 좌표가 없는지)
        pathOutside: [...document.querySelectorAll('[data-diagram-links]')].reduce((n, root) => {
          const rect = root.getBoundingClientRect();
          return n + [...root.querySelectorAll('circle')].filter(c => {
            const cx = Number(c.getAttribute('cx')); const cy = Number(c.getAttribute('cy'));
            return cx < -1 || cy < -1 || cx > rect.width + 1 || cy > rect.height + 1;
          }).length;
        }, 0),
      };
    });
    const first = page.locator('[data-book-box="diagram"]').first();
    await first.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await first.screenshot({ path: path.join(out, `${width}-diagram.png`) });
    // 거품 무는 광전사 상자에 마우스를 올린 상태
    const talentBox = first.locator('[data-diagram-key="392792"]');
    await talentBox.hover();
    await page.waitForTimeout(250);
    const hover = await page.evaluate(() => ({
      active: [...document.querySelectorAll('[data-diagram-active]')].map(el => el.getAttribute('data-diagram-key')),
      related: [...document.querySelectorAll('[data-diagram-related]')].map(el => el.getAttribute('data-diagram-key')),
      activeLinks: document.querySelectorAll('[data-diagram-link-active]').length,
    }));
    await first.screenshot({ path: path.join(out, `${width}-diagram-hover.png`) });
    await page.mouse.move(0, 0);
    // 거인의 강타 흐름도(특성 4개가 한 상자로 모임)
    const strike = page.locator('[data-book-box="diagram"]', { hasText: '거인의 강타 구간을 채우는 길' }).first();
    await strike.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await strike.screenshot({ path: path.join(out, `${width}-diagram-colossus.png`) });
    const timeline = page.locator('[data-book-box="timeline"]').first();
    await timeline.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await timeline.screenshot({ path: path.join(out, `${width}-timeline.png`) });
    const aoe = page.locator('[data-book-box="timeline"]').nth(2);
    await aoe.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await aoe.screenshot({ path: path.join(out, `${width}-timeline-aoe.png`) });
    results[width] = { ...info, hover, errors };
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'check.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();
