// Run against a running site: TEST_ORIGIN=https://... node scripts/verify-route-scroll.cjs
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3002';
  const errors = [];
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on('pageerror', error => errors.push(error.message));
      const top = () => page.waitForFunction(() => window.scrollY === 0);
      const atAnchor = id => page.waitForFunction(anchor => {
        const target = document.getElementById(anchor);
        if (!target) return false;
        const y = target.getBoundingClientRect().top;
        return y >= 50 && y < 350;
      }, id);

      await page.goto(`${origin}/guide`, { waitUntil: 'networkidle' });
      const windwalker = page.getByRole('link', { name: /풍운/ }).first();
      await windwalker.scrollIntoViewIfNeeded();
      const listY = await page.evaluate(() => window.scrollY);
      assert(listY > 500, 'Reproduce entry from a scrolled guide list');
      await windwalker.click();
      await page.waitForURL('**/guide/monk/windwalker');
      await top();
      assert((await page.locator('h1').boundingBox()).y > 0, 'Guide title must be visible');

      await page.goBack();
      await page.waitForFunction(y => Math.abs(window.scrollY - y) < 5, listY);
      await page.goForward();
      await top();

      await page.locator('a[href="#skills"]').first().click();
      await atAnchor('skills');
      await page.locator('a[href="#synergies"]').first().click();
      await atAnchor('synergies');
      await page.reload({ waitUntil: 'networkidle' });
      await atAnchor('synergies');

      const guideList = page.getByRole('link', { name: '가이드 목록', exact: true }).first();
      await guideList.click();
      await page.waitForURL('**/guide');
      await top();
      await page.locator('a[href="/guide/priest/holy"]').first().click();
      await page.waitForURL('**/guide/priest/holy');
      await top();

      await page.goto(`${origin}/guide/monk/windwalker#%73kills`, { waitUntil: 'networkidle' });
      await atAnchor('skills');
      await page.goto(`${origin}/guide/monk/windwalker#%ZZ`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: '풍운 수도사 가이드', exact: true }).waitFor();

      await page.goto(`${origin}/logs`, { waitUntil: 'networkidle' });
      const report = page.locator('a[href="/guide/priest/holy/log-analysis"]').first();
      await report.scrollIntoViewIfNeeded();
      assert(await page.evaluate(() => window.scrollY > 500));
      await report.click();
      await page.waitForURL('**/guide/priest/holy/log-analysis');
      await top();
      await page.goto(`${origin}/guide/priest/holy/log-analysis#casts`, { waitUntil: 'networkidle' });
      await atAnchor('casts');
      console.log(`${width}px: guide/report entry, history and fragment navigation passed`);
      await page.close();
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
