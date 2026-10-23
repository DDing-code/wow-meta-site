// 홈 화면 확인용 캡처: node artifacts/home-youtube-20261023/shots.cjs <주소>
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const origin = process.argv[2] || 'http://localhost:3561';
  const out = __dirname;
  const browser = await chromium.launch();
  for (const [name, width, height] of [['1440', 1440, 900], ['1024', 1024, 800], ['390', 390, 844], ['320', 320, 700]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(out, `home-${name}.png`), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(name, 'overflowX', overflow, 'height', await page.evaluate(() => document.body.scrollHeight));
    if (name === '1440') {
      await page.click('button[aria-pressed]:has-text("근딜")');
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(out, 'home-1440-melee.png'), fullPage: true });
      await page.click('button[aria-pressed]:has-text("전체")');
      await page.hover('[data-shelf="tanks"] li a[target]');
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(out, 'home-1440-hover.png') });
      await page.goto(`${origin}/guide/evoker/preservation`, { waitUntil: 'networkidle' });
      console.log('guide log link', await page.locator('a[href^="/logs"]').count(), 'nav log', await page.locator('nav >> text=로그 분석').count());
      await page.goto(`${origin}/logs`, { waitUntil: 'networkidle' });
      console.log('/logs heading', await page.locator('h1').first().textContent());
    }
    await page.close();
  }
  await browser.close();
})();
