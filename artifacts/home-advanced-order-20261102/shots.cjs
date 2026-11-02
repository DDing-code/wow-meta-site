// 홈 줄 순서(기본편 → 직업 심화편 → 레이드 → 쐐기)와 상단 메뉴 '직업 가이드'를 1440·1024·390·320에서 찍고 센다.
// 사용: node shots.cjs [origin=http://127.0.0.1:3127]   (SHOTS_DIR=live 로 운영 주소 결과를 따로 저장)
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:3127';
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
fs.mkdirSync(out, { recursive: true });
const ORDER = ['tanks', 'healers', 'melee', 'ranged', 'advanced', 'raid', 'mythicplus'];
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const width of [1440, 1024, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-shelf="advanced"] [data-class-group]');
    await page.waitForTimeout(800);
    const info = await page.evaluate(() => {
      const nav = [...document.querySelectorAll('a[href="/guide"]')].map(a => ({ text: a.textContent.trim(), h: Math.round(a.getBoundingClientRect().height), visible: a.offsetParent !== null }));
      return {
        bundle: [...document.scripts].map(s => s.src).find(src => /main\.[0-9a-f]+\.js/.test(src)),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        shelves: [...document.querySelectorAll('[data-shelf]')].map(n => n.dataset.shelf),
        chips: [...document.querySelectorAll('button[aria-pressed]')].map(b => b.textContent.trim()),
        nav,
      };
    });
    // 원딜 줄 끝 ~ 레이드 줄 머리까지 한 장으로
    const box = await page.evaluate(() => {
      const a = document.querySelector('[data-shelf="ranged"]').getBoundingClientRect();
      const b = document.querySelector('[data-shelf="raid"]').getBoundingClientRect();
      return { y: a.top + window.scrollY, h: b.top + 160 - a.top };
    });
    await page.screenshot({ path: path.join(out, `home-${width}-ranged-advanced-raid.png`), fullPage: true, clip: { x: 0, y: box.y, width, height: box.h } });
    await page.screenshot({ path: path.join(out, `home-${width}-top.png`) });
    if (width <= 780) {
      const menu = page.locator('header button[aria-expanded], nav button[aria-expanded]').first();
      if (await menu.count()) { await menu.click(); await page.waitForTimeout(400); await page.screenshot({ path: path.join(out, `home-${width}-menu.png`) }); }
    }
    results.push({ width, ...info, orderOk: JSON.stringify(info.shelves) === JSON.stringify(ORDER), errors });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'check.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 1));
  const bad = results.filter(r => !r.orderOk || r.overflow > 0 || r.errors.length || !r.nav.some(n => n.text.includes('직업 가이드')));
  process.exit(bad.length ? 1 : 0);
})();
