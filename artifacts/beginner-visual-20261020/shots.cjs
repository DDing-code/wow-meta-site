// 초보자 안내의 '한눈에 보기' 그림 7개와 주문제작 묶음, 체크리스트를 1440·390·320px로 찍고 가로 넘침을 센다.
// 사용: node artifacts/beginner-visual-20261020/shots.cjs [origin=http://127.0.0.1:4410]  (SHOTS_DIR로 저장 폴더 지정)
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));

const base = process.argv[2] || 'http://127.0.0.1:4410';
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

async function overflow(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const wide = [...document.querySelectorAll('main *')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > vw + 1 || r.left < -1) && getComputedStyle(el).position !== 'fixed';
    }).map(el => `${el.tagName.toLowerCase()}:${(el.textContent || '').trim().slice(0, 30)}`);
    return { wide, scrollWidth: document.documentElement.scrollWidth, vw };
  });
}

(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, userAgent: UA, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(`${base}/beginner`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#beginner-results');
    const result = { width, errors, shots: {} };
    const shotOf = async (name, locator, pad = 10) => {
      await locator.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const box = await locator.evaluate(el => { const r = el.getBoundingClientRect(); return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height }; });
      const file = path.join(out, `${width}-${name}.png`);
      await page.screenshot({ path: file, clip: { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: Math.min(width - Math.max(0, box.x - pad), box.width + pad * 2), height: box.height + pad * 2 }, fullPage: true });
      result.shots[name] = file;
      return box;
    };
    await page.screenshot({ path: path.join(out, `${width}-top.png`) });
    result.maps = {};
    for (const id of ['basics', 'combat', 'content', 'equipment', 'consumables', 'crafting', 'ready']) {
      const map = page.locator(`[data-map="${id}"]`);
      const box = await shotOf(`map-${id}`, map);
      result.maps[id] = { width: Math.round(box.width), height: Math.round(box.height) };
    }
    await shotOf('crafting-entries', page.locator('#crafting dl').first(), 70);
    await shotOf('hero', page.locator('header').first(), 6);
    // 체크리스트 두 개 누른 뒤
    const buttons = page.locator('#ready button[aria-pressed]');
    await buttons.nth(0).click();
    await buttons.nth(2).click();
    await page.waitForTimeout(150);
    await shotOf('ready-checked', page.locator('#ready'), 6);
    result.readyText = await page.locator('[data-map="ready"]').textContent();
    // 그림 낱말 → 설명 이동
    await page.locator('[data-map="combat"] a[href="#combat-e5"]').first().click();
    await page.waitForTimeout(500);
    result.jumpTop = await page.evaluate(() => Math.round(document.getElementById('combat-e5').getBoundingClientRect().top));
    result.overflow = await overflow(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(out, `${width}-full.png`), fullPage: true });
    result.pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    // 검색 중 그림 숨김
    await page.fill('#beginner-search', '어그로');
    await page.waitForTimeout(200);
    result.mapsWhileSearching = await page.locator('[data-map]').count();
    results.push(result);
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'ui-check.json'), JSON.stringify(results, null, 2));
  const problems = results.filter(r => r.errors.length || r.overflow.wide.length || r.overflow.scrollWidth > r.overflow.vw || r.mapsWhileSearching !== 0);
  console.log(JSON.stringify({ shots: out, problems: problems.length, results: results.map(r => ({ width: r.width, errors: r.errors, overflow: r.overflow, maps: r.maps, jumpTop: r.jumpTop, pageHeight: r.pageHeight, readyText: r.readyText, mapsWhileSearching: r.mapsWhileSearching })) }, null, 2));
  process.exitCode = problems.length ? 1 : 0;
})();
