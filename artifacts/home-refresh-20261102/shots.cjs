// 홈 화면(심화편 줄·개수 표시 제거·영웅 레이드·던전 영상 링크)을 1440·390·320에서 찍고 가로 넘침과 개수 표시를 센다.
// 사용: node shots.cjs [origin=http://127.0.0.1:3125]   (SHOTS_DIR=live 로 운영 주소 결과를 따로 저장)
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:3125';
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-shelf="advanced"]');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(out, `home-${width}-full.png`), fullPage: true });
    const info = await page.evaluate(() => ({
      bundle: [...document.scripts].map(s => s.src).find(src => /main\.[0-9a-f]+\.js/.test(src)),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      countText: (document.body.innerText.match(/\d+\s*편|모두 보기 \(/g) || []),
      advancedCards: document.querySelectorAll('[data-shelf="advanced"] li').length,
      advancedLinks: document.querySelectorAll('a[data-video-kind="advanced"]').length,
      heroic: !!document.querySelector('[data-shelf="raid"] a[href="/raid/heroic"]'),
      dungeonVideos: document.querySelectorAll('[data-shelf="mythicplus"] a[href^="https://www.youtube.com/watch"]').length,
    }));
    // 심화편 칩을 눌러 그 줄만 다 펼친 화면도 찍는다.
    await page.locator('button[aria-pressed]', { hasText: '심화편' }).click();
    await page.waitForTimeout(600);
    info.advancedOnly = await page.evaluate(() => ({
      shelves: document.querySelectorAll('[data-shelf]').length,
      cards: document.querySelectorAll('[data-shelf="advanced"] li').length,
    }));
    await page.screenshot({ path: path.join(out, `home-${width}-advanced.png`), fullPage: width !== 1440 ? false : true });
    results.push({ width, ...info, errors });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'check.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 1));
  const bad = results.filter(r => r.overflow > 0 || r.countText.length || r.errors.length || !r.heroic || r.advancedOnly.shelves !== 1);
  process.exit(bad.length ? 1 : 0);
})();
