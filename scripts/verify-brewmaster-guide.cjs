// TEST_ORIGIN=https://... node scripts/verify-brewmaster-guide.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const output = path.join(__dirname, '../artifacts/brewmaster-12.1');
  fs.mkdirSync(output, { recursive: true });
  const errors = [];
  try {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${process.env.TEST_ORIGIN || 'http://127.0.0.1:3002'}/guide/monk/brewmaster`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: '양조 수도사 가이드', exact: true }).waitFor();
      const heroes = page.getByRole('group', { name: '영웅 특성 선택', exact: true });
      for (const [hero, key, expected] of [['음영파', 'shado', 10], ['조화의 형', 'harmony', 12]]) {
        await heroes.getByRole('button', { name: hero, exact: true }).click();
        for (const [mode, label] of [['opener', '오프닝'], ['singleTarget', '단일'], ['aoe', '광역']]) {
          await page.getByRole('group', { name: '전투 상황 선택', exact: true }).getByRole('button', { name: label, exact: true }).click();
          const region = page.locator(`[data-rotation-mode="${mode}"]`);
          await region.evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 80));
          const metrics = await region.evaluate(element => {
            const rail = element.querySelector('[data-opener-flow-rail]');
            const links = rail ? [...rail.querySelectorAll('a')] : [];
            return {
              pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
              railOverflow: rail ? rail.scrollWidth - rail.clientWidth : 0,
              steps: links.length,
              icons: links.map(link => ({ size: link.querySelector('img').getBoundingClientRect().width, id: link.getAttribute('data-wowhead') })),
              text: element.innerText,
            };
          });
          assert(metrics.pageOverflow <= 1 && metrics.railOverflow <= 1, `${width}/${key}/${mode}: overflow`);
          if (mode === 'opener') {
            assert.equal(metrics.steps, expected);
            assert(metrics.icons.every(icon => icon.size === 16 && /^spell=\d+&domain=ko$/.test(icon.id)));
            const details = region.locator('details');
            await details.locator('summary').focus();
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') !== null);
            assert((await details.innerText()).length > 500);
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') === null);
          } else {
            assert(metrics.text.includes('조건을 위에서부터 확인'));
            if (key === 'shado' && mode === 'aoe') assert(metrics.text.includes('장벽의 지혜'));
            if (key === 'harmony') assert(metrics.text.includes('잠재된 기운') && metrics.text.includes('범의 장풍'));
          }
          const broken = await region.locator('img').evaluateAll(images => images.filter(img => img.complete && !img.naturalWidth).map(img => img.src));
          assert.deepEqual(broken, []);
          await page.screenshot({ path: path.join(output, `${width}-${key}-${mode}.png`) });
        }
      }
      assert((await page.locator('#guide-section-1').innerText()).includes('12.1'));
      assert.equal(await page.locator('a[href$="spell=292601"], a[href$="spell=115450"]').count(), 0);
      await page.locator('#synergies').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `${width}-graph.png`) });
      console.log(`${width}px: both heroes, all three modes, tooltip links and responsive layout passed`);
      await page.close();
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
