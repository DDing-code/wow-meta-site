// TEST_ORIGIN=https://... node scripts/verify-affliction-guide.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const output = path.join(__dirname, '../artifacts/affliction-12.1');
  fs.mkdirSync(output, { recursive: true });
  const errors = [];
  try {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${process.env.TEST_ORIGIN || 'http://127.0.0.1:3002'}/guide/warlock/affliction`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: '고통 흑마법사 가이드', exact: true }).waitFor();
      for (const [hero, key] of [['영혼 수확자', 'soul'], ['지옥소환사', 'hell']]) {
        await page.getByRole('group', { name: '영웅 특성 선택', exact: true }).getByRole('button', { name: hero, exact: true }).click();
        for (const [mode, label] of [['opener', '오프닝'], ['singleTarget', '단일'], ['aoe', '광역']]) {
          await page.getByRole('group', { name: '전투 상황 선택', exact: true }).getByRole('button', { name: label, exact: true }).click();
          const region = page.locator(`[data-rotation-mode="${mode}"]`);
          await region.evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 80));
          const metrics = await region.evaluate(element => {
            const rail = element.querySelector('[data-opener-flow-rail]');
            return {
              pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
              railOverflow: rail ? rail.scrollWidth - rail.clientWidth : 0,
              icons: rail ? [...rail.querySelectorAll('a')].map(link => ({
                size: link.querySelector('img').getBoundingClientRect().width,
                id: link.getAttribute('data-wowhead'),
              })) : [],
              text: element.innerText,
            };
          });
          assert(metrics.pageOverflow <= 1 && metrics.railOverflow <= 1, `${width}/${key}/${mode}: overflow`);
          if (mode === 'opener') {
            assert.equal(metrics.icons.length, 10);
            assert(metrics.icons.every(icon => icon.size === 16 && /^spell=\d+&domain=ko$/.test(icon.id)));
            assert(!metrics.icons.some(icon => /spell=(1261149|264571|449793)&/.test(icon.id)));
            assert(metrics.icons.some(icon => icon.id === 'spell=1261153&domain=ko'));
            assert(metrics.icons.some(icon => icon.id === `spell=${key === 'soul' ? '172' : '442726'}&domain=ko`));
            const details = region.locator('details');
            await details.locator('summary').focus();
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') !== null);
            assert((await details.innerText()).length > 500);
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') === null);
          } else {
            assert(metrics.text.includes('조건을 위에서부터 확인'));
            assert(metrics.text.includes(mode === 'aoe' ? '부패의 씨앗' : '불안정한 고통'));
          }
          const broken = await region.locator('img').evaluateAll(images => images.filter(img => img.complete && !img.naturalWidth).map(img => img.src));
          assert.deepEqual(broken, []);
          await page.screenshot({ path: path.join(output, `${width}-${key}-${mode}.png`) });
        }
      }
      assert((await page.locator('#guide-section-1').innerText()).includes('12.1'));
      for (const id of ['316099', '70388', '387016', '63106', '1260271', '1260285']) {
        assert.equal(await page.locator(`a[href$="spell=${id}"]`).count(), 0);
      }
      assert.equal(await page.locator('#uptime').count(), 0);
      const graph = page.locator('#synergies svg[role="img"]');
      const centerText = await graph.locator('.graph-center-node').textContent();
      assert(centerText.includes('불안정한 고통') && centerText.includes('10개 시너지 연결'));
      await graph.evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 80));
      await page.screenshot({ path: path.join(output, `${width}-graph.png`) });
      console.log(`${width}px: both heroes, three modes, keyboard disclosure, current spell links and responsive layout passed`);
      await page.close();
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
