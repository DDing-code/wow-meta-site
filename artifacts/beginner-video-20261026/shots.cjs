// 초보자 안내의 영상 칸과 영역별 영상 단추를 1440·390·320px로 찍고 가로 넘침을 센다. 사용: node shots.cjs [origin=http://127.0.0.1:4418]
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:4418';
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}/beginner`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#beginner-video iframe');
    await page.waitForTimeout(2500);
    const shot = async (name, loc, pad = 8) => {
      await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
      const b = await loc.evaluate(el => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; });
      const file = path.join(out, `${width}-${name}.png`);
      await page.screenshot({ path: file, fullPage: true, clip: { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: Math.min(width - Math.max(0, b.x - pad), b.w + pad * 2), height: b.h + pad * 2 } });
      return file;
    };
    const r = { width, errors, files: [] };
    await page.screenshot({ path: path.join(out, `${width}-top.png`) });
    r.files.push(path.join(out, `${width}-top.png`));
    r.files.push(await shot('video', page.locator('#beginner-video')));
    // 영역 머리(제목·소개·영상 단추)만 찍는다.
    await page.locator('#combat button[data-video-second]').scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
    const head = await page.evaluate(() => { const s = document.querySelector('#combat').getBoundingClientRect(); const b = document.querySelector('#combat button[data-video-second]').getBoundingClientRect(); return { x: s.left + scrollX, y: s.top + scrollY, w: s.width, h: b.bottom - s.top }; });
    const headFile = path.join(out, `${width}-combat-head.png`);
    await page.screenshot({ path: headFile, fullPage: true, clip: { x: Math.max(0, head.x - 8), y: head.y - 8, width: Math.min(width, head.w + 16), height: head.h + 20 } });
    r.files.push(headFile);
    r.wide = await page.evaluate(() => { const vw = innerWidth; return [...document.querySelectorAll('main *')].filter(el => { const b = el.getBoundingClientRect(); return b.width > 0 && (b.right > vw + 1 || b.left < -1) && getComputedStyle(el).position !== 'fixed'; }).length; });
    r.scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    await page.locator('#crafting button[data-video-second]').click();
    await page.waitForTimeout(800);
    r.afterJump = await page.evaluate(() => ({ src: document.querySelector('#beginner-video iframe').getAttribute('src'), top: Math.round(document.querySelector('#beginner-video').getBoundingClientRect().top), current: document.querySelector('#beginner-video [aria-current="true"]')?.textContent }));
    await page.fill('input', '물약'); await page.waitForTimeout(200);
    r.videoWhileSearch = await page.locator('#beginner-video').count();
    results.push(r);
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'shots.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();
