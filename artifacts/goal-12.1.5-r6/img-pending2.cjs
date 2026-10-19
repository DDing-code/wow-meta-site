// 다 받지 못한 그림을 화면 안으로 옮긴 뒤 받아지는지, 어디에 있는지 본다. 사용: node img-pending2.cjs <origin> <경로>
const path = require('path');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const [base, route] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 1500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } });
  await page.waitForTimeout(1500);
  const where = await page.evaluate(() => [...document.images].filter(i => !i.complete).map(i => {
    const chain = []; for (let p = i.parentElement; p && chain.length < 8; p = p.parentElement) { const cs = getComputedStyle(p); chain.push(`${p.tagName}${p.dataset.bookBox ? '[' + p.dataset.bookBox + ']' : ''} ox=${cs.overflowX} cv=${cs.contentVisibility} d=${cs.display}`); }
    const r = i.getBoundingClientRect(); return { x: r.left, y: r.top + scrollY, chain, text: i.closest('section,div')?.textContent.slice(0, 80) };
  }));
  console.log(JSON.stringify(where, null, 1));
  const imgs = page.locator('img:not([complete])');
  for (const h of await page.$$('img')) { if (!(await h.evaluate(i => i.complete))) { await h.scrollIntoViewIfNeeded(); await page.waitForTimeout(1500); console.log('스크롤 뒤', await h.evaluate(i => ({ complete: i.complete, w: i.naturalWidth }))); } }
  await browser.close();
})();
