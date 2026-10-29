// 파멸 가이드 영상 칸(기본편·심화편 단추)을 1440·390·320px로 찍고, 단추를 눌러 영상 번호가 바뀌는지와 가로 넘침을 센다.
// 사용: node shots.cjs [origin=http://127.0.0.1:4418]   (SHOTS_DIR=live 로 운영 주소 결과를 따로 저장)
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:4418';
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
const BASIC = 'sN2NnShDDKQ', ADVANCED = 'bFrBTJqCUuU';
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}/guide/demonhunter/havoc`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#guide-video iframe');
    await page.waitForTimeout(2000);
    const src = () => page.evaluate(() => document.querySelector('#guide-video iframe').getAttribute('src'));
    const shot = async name => {
      const loc = page.locator('#guide-video');
      await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
      const file = path.join(out, `${width}-${name}.png`);
      await loc.screenshot({ path: file });
      return file;
    };
    const r = { width, errors, files: [] };
    r.basicSrc = await src();
    r.files.push(await shot('basic'));
    await page.locator('#guide-video button[data-video-kind="advanced"]').click();
    await page.waitForTimeout(800);
    r.advancedSrc = await src();
    r.caption = await page.evaluate(() => document.querySelector('#guide-video strong:last-of-type')?.textContent);
    r.captionAll = await page.evaluate(() => [...document.querySelectorAll('#guide-video strong')].map(e => e.textContent));
    r.files.push(await shot('advanced'));
    r.wide = await page.evaluate(() => { const vw = innerWidth; return [...document.querySelectorAll('#guide-video *')].filter(el => { const b = el.getBoundingClientRect(); return b.width > 0 && (b.right > vw + 1 || b.left < -1) && getComputedStyle(el).position !== 'fixed'; }).length; });
    r.scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    r.ok = r.basicSrc.includes(BASIC) && r.advancedSrc.includes(ADVANCED) && !errors.length && r.scrollWidth <= width;
    results.push(r);
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'shots.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (!results.every(r => r.ok)) process.exit(1);
})();
