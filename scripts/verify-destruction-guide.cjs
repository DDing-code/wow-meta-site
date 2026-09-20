// TEST_ORIGIN=https://... node scripts/verify-destruction-guide.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const output = path.join(__dirname, '../artifacts/destruction-12.1');
  fs.mkdirSync(output, { recursive: true });
  const errors = [];
  try {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${process.env.TEST_ORIGIN || 'http://127.0.0.1:3002'}/guide/warlock/destruction`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: '파괴 흑마법사 가이드', exact: true }).waitFor();
      for (const [hero, key] of [['지옥소환사', 'hellcaller'], ['악마학자', 'diabolist']]) {
        await page.getByRole('group', { name: '영웅 특성 선택', exact: true }).getByRole('button', { name: hero, exact: true }).click();
        for (const [mode, label] of [['opener', '오프닝'], ['singleTarget', '단일'], ['aoe', '광역']]) {
          await page.getByRole('group', { name: '전투 상황 선택', exact: true }).getByRole('button', { name: label, exact: true }).click();
          const region = page.locator(`[data-rotation-mode="${mode}"]`);
          await region.evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 80));
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${width}/${key}/${mode}: overflow`);
          const actionLinks = region.locator(mode === 'opener' ? '[data-opener-flow-rail] a' : 'strong > a[data-wowhead]');
          const links = await actionLinks.evaluateAll(items => items.map(item => item.getAttribute('data-wowhead')));
          assert(links.length >= 10 && links.every(link => /^spell=\d+&domain=ko$/.test(link)));
          assert(!links.some(link => /spell=(1280868|387108|454735|1265770|1265772|1265774|1296571|1296572|434589|434587|417282)&/.test(link)));
          assert(!links.some(link => (key === 'hellcaller' ? /spell=(434506|434635)&/ : /spell=(442726|445468)&/).test(link)));
          assert(links.includes('spell=1122&domain=ko'));
          if (mode === 'opener') {
            assert.equal(links.length, 10);
            const sizes = await actionLinks.locator('img').evaluateAll(items => items.map(item => item.getBoundingClientRect().width));
            assert(sizes.every(size => size === 16));
            const details = region.locator('details');
            await details.locator('summary').focus();
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') !== null);
            assert((await details.innerText()).length > 500);
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') === null);
          } else {
            assert((await region.innerText()).includes('조건을 위에서부터 확인'));
            if (mode === 'aoe') assert(links.includes('spell=5740&domain=ko'));
          }
          const broken = await region.locator('img').evaluateAll(items => items.filter(img => img.complete && !img.naturalWidth).map(img => img.src));
          assert.deepEqual(broken, []);
          await page.screenshot({ path: path.join(output, `${width}-${key}-${mode}.png`) });
        }
      }
      assert((await page.locator('#guide-section-1').innerText()).includes('12.1'));
      assert.equal(await page.locator('#uptime').count(), 0);
      assert(await page.locator('a[href$="spell=454735"]').filter({ hasText: '전문화 황폐' }).count() > 0);
      assert(await page.locator('a[href$="spell=434589"]').filter({ hasText: '거대마귀의 혼돈의 화살' }).count() > 0);
      const graph = page.locator('#synergies svg[role="img"]');
      const center = await graph.locator('.graph-center-node').textContent();
      assert(center.includes('혼돈의 화살') && center.includes('12개 시너지 연결'));
      await graph.evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 80));
      await page.screenshot({ path: path.join(output, `${width}-graph.png`) });
      console.log(`${width}px: both heroes, three modes, current spell identities, aliases and layout passed`);
      await page.close();
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
