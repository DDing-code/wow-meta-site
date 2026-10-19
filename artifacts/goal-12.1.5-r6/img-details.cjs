// 접힌 정답(details) 안 그림이 펼치면 받아지는지 확인하고 캡처한다. 사용: node img-details.cjs <origin> <경로> <캡처 파일>
const path = require('path');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const [base, route, shot] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  const target = page.locator('details:has(a[data-wowhead^="spell=393414"])').first();
  console.log('펼치기 전', await target.evaluate(d => ({ open: d.open, imgs: [...d.querySelectorAll('img')].map(i => i.complete && i.naturalWidth > 0) })));
  await target.locator('summary').click();
  await target.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  console.log('펼친 뒤', await target.evaluate(d => ({ open: d.open, imgs: [...d.querySelectorAll('img')].map(i => i.complete && i.naturalWidth > 0) })));
  await target.screenshot({ path: shot });
  await browser.close();
})();
