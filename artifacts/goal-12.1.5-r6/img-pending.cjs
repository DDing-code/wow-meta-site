// 다 받지 못한 그림 찾기. 사용: node img-pending.cjs <origin> <경로>
const path = require('path');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const [base, route] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 1500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  console.log(JSON.stringify(await page.evaluate(() => [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => ({ src: i.getAttribute('src'), loading: i.loading, complete: i.complete, w: i.naturalWidth, vis: i.getBoundingClientRect().height, parent: i.parentElement.outerHTML.slice(0, 200) }))), null, 1));
  await browser.close();
})();
