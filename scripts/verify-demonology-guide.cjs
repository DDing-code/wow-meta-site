// TEST_ORIGIN=https://... node scripts/verify-demonology-guide.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const output = path.join(__dirname, '../artifacts/demonology-12.1');
  fs.mkdirSync(output, { recursive: true });
  const errors = [];
  try {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${process.env.TEST_ORIGIN || 'http://127.0.0.1:3002'}/guide/warlock/demonology`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: '악마 흑마법사 가이드', exact: true }).waitFor();
      for (const [hero, key] of [['영혼 수확자', 'soul'], ['악마학자', 'diabo']]) {
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
            assert(!metrics.icons.some(icon => /spell=(264130|264173|267102|1251778|460551|1276163|1276190|1276222|1296574|1306077)&/.test(icon.id)));
            assert(metrics.icons.some(icon => icon.id === 'spell=265187&domain=ko'));
            assert(metrics.icons.some(icon => icon.id === 'spell=105174&domain=ko'));
            if (key === 'soul') assert(!metrics.icons.some(icon => /spell=(434506|434635)&/.test(icon.id)));
            const details = region.locator('details');
            await details.locator('summary').focus();
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') !== null);
            assert((await details.innerText()).length > 500);
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') === null);
          } else {
            assert(metrics.text.includes('조건을 위에서부터 확인'));
            assert(metrics.text.includes(mode === 'aoe' ? '파열' : '굴단의 손'));
            const links = await region.locator('strong > a[data-wowhead]').evaluateAll(items => items.map(item => item.getAttribute('data-wowhead')));
            assert(links.length >= 10);
            assert(!links.includes('spell=264130&domain=ko'));
            if (key === 'soul') assert(!links.some(id => /spell=(434506|434635)&/.test(id)));
          }
          const broken = await region.locator('img').evaluateAll(images => images.filter(img => img.complete && !img.naturalWidth).map(img => img.src));
          assert.deepEqual(broken, []);
          await page.screenshot({ path: path.join(output, `${width}-${key}-${mode}.png`) });
        }
      }
      assert((await page.locator('#guide-section-1').innerText()).includes('12.1'));
      for (const id of ['186185', '1266805']) {
        assert.equal(await page.locator(`a[href$="spell=${id}"]`).count(), 0);
      }
      assert.equal(await page.locator('#uptime').count(), 0);
      const graph = page.locator('#synergies svg[role="img"]');
      const centerText = await graph.locator('.graph-center-node').textContent();
      assert(centerText.includes('굴단의 손') && centerText.includes('12개 시너지 연결'));
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
