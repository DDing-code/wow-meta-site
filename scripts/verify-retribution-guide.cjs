// TEST_ORIGIN=https://... node scripts/verify-retribution-guide.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const output = path.join(__dirname, '../artifacts/retribution-paladin-12.1');
  fs.mkdirSync(output, { recursive: true });
  const errors = [];
  try {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${process.env.TEST_ORIGIN || 'http://127.0.0.1:3002'}/guide/paladin/retribution`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: '징벌 성기사 가이드', exact: true }).waitFor();
      for (const [hero, key] of [['태양의 사자', 'herald'], ['기사단', 'templar']]) {
        await page.getByRole('group', { name: '영웅 특성 선택', exact: true }).getByRole('button', { name: hero, exact: true }).click();
        for (const [mode, label] of [['opener', '오프닝'], ['singleTarget', '단일'], ['aoe', '광역']]) {
          await page.getByRole('group', { name: '전투 상황 선택', exact: true }).getByRole('button', { name: label, exact: true }).click();
          const region = page.locator(`[data-rotation-mode="${mode}"]`);
          await region.evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 80));
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${width}/${key}/${mode}: overflow`);
          const actionLinks = region.locator(mode === 'opener' ? '[data-opener-flow-rail] a' : 'strong > a[data-wowhead]');
          const links = await actionLinks.evaluateAll(items => items.map(item => item.getAttribute('data-wowhead')));
          assert(links.every(link => /^spell=\d+&domain=ko$/.test(link)));
          assert(!links.some(link => /spell=(184662|35395|267344|383327|1241413|275779|429826|1296661|1306923)&/.test(link)));
          if (key === 'herald') assert(!links.includes('spell=427453&domain=ko'));
          assert(links.includes('spell=383328&domain=ko'));
          if (mode === 'opener') {
            assert.equal(links.length, 7);
            const sizes = await actionLinks.locator('img').evaluateAll(items => items.map(item => item.getBoundingClientRect().width));
            assert(sizes.every(size => size === 16));
            if (key === 'templar') {
              assert.equal(links[3], 'spell=255937&domain=ko');
              assert.equal(links[4], 'spell=427453&domain=ko');
            }
            const details = region.locator('details');
            await details.locator('summary').focus();
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') !== null);
            assert((await details.innerText()).length > 300);
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') === null);
          } else {
            assert.equal(links.length, key === 'herald' && mode === 'singleTarget' ? 13 : 14);
            assert((await region.innerText()).includes('조건을 위에서부터 확인'));
            assert(links.includes('spell=53385&domain=ko'));
          }
          const broken = await region.locator('img').evaluateAll(items => items.filter(img => img.complete && !img.naturalWidth).map(img => img.src));
          assert.deepEqual(broken, []);
          await page.screenshot({ path: path.join(output, `${width}-${key}-${mode}.png`) });
        }
      }
      assert((await page.locator('#guide-section-1').innerText()).includes('12.1'));
      assert.equal(await page.locator('#uptime').count(), 0);
      const graph = page.locator('#synergies svg[role="img"]');
      const center = await graph.locator('.graph-center-node').textContent();
      assert(center.includes('최후의 선고') && center.includes('10개 시너지 연결'));
      await graph.evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 80));
      await page.screenshot({ path: path.join(output, `${width}-graph.png`) });
      console.log(`${width}px: both heroes, three modes, current cast identities and layout passed`);
      await page.close();
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
