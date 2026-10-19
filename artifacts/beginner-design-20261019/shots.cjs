// 초보자 안내 페이지를 320·390·1440px로 열어 첫 화면·목차·검색 결과·빈 결과·마무리 구역을 찍고,
// 가로 넘침·겹침·화면 오류를 센다. 사용: node artifacts/beginner-design-20261019/shots.cjs [origin]
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
  for (const width of [320, 390, 1440]) {
    const height = width === 1440 ? 1000 : 860;
    const page = await browser.newPage({ viewport: { width, height }, userAgent: UA });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(`${base}/beginner`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#beginner-results');
    const result = { width, errors, steps: {} };
    const shot = async (name, options = {}) => {
      const file = path.join(out, `beginner-${width}-${name}.png`);
      await page.screenshot({ path: file, ...options });
      return file;
    };
    result.steps.top = await shot('top');
    result.steps.full = await shot('full', { fullPage: true });
    result.overflowInitial = await overflow(page);
    result.dts = await page.locator('dt').count();
    result.contents = await page.locator('nav[aria-label="초보자 안내 목차"] a').allTextContents();
    // 목차로 이동
    await page.click('nav[aria-label="초보자 안내 목차"] a[href="#consumables"]');
    await page.waitForTimeout(700);
    result.steps.consumables = await shot('consumables');
    result.activeAfterJump = await page.locator('nav[aria-label="초보자 안내 목차"] a[aria-current="location"]').allTextContents();
    // 검색
    await page.fill('#beginner-search', '마부');
    await page.waitForTimeout(200);
    result.searchStatus = await page.locator('[role="status"]').textContent();
    result.searchDts = await page.locator('dt').allTextContents();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    result.steps.search = await shot('search', { fullPage: true });
    result.overflowSearch = await overflow(page);
    // 빈 결과
    await page.fill('#beginner-search', '없는말12345');
    await page.waitForTimeout(200);
    result.emptyText = await page.locator('#beginner-results').textContent();
    result.steps.empty = await shot('empty', { fullPage: true });
    await page.click('text=전체 설명 보기');
    await page.waitForTimeout(200);
    result.dtsAfterReset = await page.locator('dt').count();
    // 마무리 구역
    await page.locator('footer').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.click('summary');
    await page.waitForTimeout(300);
    result.steps.footer = await shot('footer');
    // 상단 메뉴에서 초보자 안내 표시 확인
    result.navLabel = await page.locator('nav a[href="/beginner"]').first().textContent().catch(() => null);
    results.push(result);
    await page.close();
  }
  // 홈 진입 패널
  for (const width of [320, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 860 }, userAgent: UA });
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(out, `home-${width}.png`) });
    const link = page.locator('a[href="/beginner"]').last();
    await link.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, `home-${width}-entry.png`), clip: await link.boundingBox().then(b => ({ x: Math.max(0, b.x - 8), y: Math.max(0, b.y - 8), width: Math.min(width, b.width + 16), height: b.height + 16 })) });
    results.push({ width, page: 'home', overflow: await overflow(page) });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'ui-check.json'), JSON.stringify(results, null, 2));
  const problems = results.filter(r => (r.errors && r.errors.length) || (r.overflowInitial && (r.overflowInitial.wide.length || r.overflowInitial.scrollWidth > r.overflowInitial.vw)) || (r.overflowSearch && r.overflowSearch.wide.length) || (r.overflow && r.overflow.wide.length));
  console.log(JSON.stringify({ shots: out, widths: results.map(r => r.width), problems: problems.length, results: results.map(r => ({ width: r.width, page: r.page, errors: r.errors, dts: r.dts, searchDts: r.searchDts, active: r.activeAfterJump, overflow: r.overflowInitial || r.overflow })) }, null, 2));
  process.exitCode = problems.length ? 1 : 0;
})();
