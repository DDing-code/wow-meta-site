// TEST_ORIGIN=https://... node scripts/verify-protection-paladin-guide.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { loadGuideManuscript } = require('./lib/guideManuscripts.cjs');

// 탱커 영웅 탭은 딜사이클(오프닝·레이드 단일·쐐기 광역)과 탱사이클(레이드·쐐기) 두 묶음이다(2026-10-20).
const MODES = [['opener', 'damage'], ['singleTarget', 'damage'], ['aoe', 'damage'], ['tankRaid', 'tank'], ['tankMythic', 'tank']];
const GROUP_LABELS = { damage: '딜사이클', tank: '탱사이클' };
const DEFAULT_TABS = { opener: '오프닝', singleTarget: '레이드 단일', aoe: '쐐기 광역', tankRaid: '레이드', tankMythic: '쐐기' };
const manuscript = loadGuideManuscript('paladin-protection');

(async () => {
  const browser = await chromium.launch();
  const output = path.join(__dirname, '../artifacts/protection-paladin-12.1');
  fs.mkdirSync(output, { recursive: true });
  const errors = [];
  try {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${process.env.TEST_ORIGIN || 'http://127.0.0.1:3002'}/guide/paladin/protection`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: '보호 성기사 가이드', exact: true }).waitFor();
      for (const [hero, key] of [['기사단', 'templar'], ['빛의 대장장이', 'lightsmith']]) {
        const branch = manuscript.heroBranches.find(item => item.label === hero);
        await page.getByRole('group', { name: '영웅 특성 선택', exact: true }).getByRole('button', { name: hero, exact: true }).click();
        for (const [mode, group] of MODES) {
          const label = branch[mode]?.tabLabel || DEFAULT_TABS[mode];
          const expected = (branch[mode].steps || []).length;
          await page.getByRole('group', { name: `${GROUP_LABELS[group]} 전투 상황 선택`, exact: true }).getByRole('button', { name: label, exact: true }).click();
          const region = page.locator(`[data-rotation-mode="${mode}"]`);
          await region.evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 80));
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${width}/${key}/${mode}: overflow`);
          const actionLinks = region.locator(mode === 'opener' || group === 'tank' ? '[data-opener-flow-rail] a' : 'strong > a[data-wowhead]');
          const links = await actionLinks.evaluateAll(items => items.map(item => item.getAttribute('data-wowhead')));
          if (group === 'tank') {
            assert.equal(links.length, expected);
            assert(expected >= 4 && links.every(link => /^spell=\d+&domain=ko$/.test(link)));
            assert((await region.innerText()).includes('특성 견본'), `${width}/${key}/${mode}: talent sample link`);
            const brokenTank = await region.locator('img').evaluateAll(items => items.filter(img => img.complete && !img.naturalWidth).map(img => img.src));
            assert.deepEqual(brokenTank, []);
            await page.screenshot({ path: path.join(output, `${width}-${key}-${mode}.png`) });
            continue;
          }
          assert(links.length >= 10 && links.every(link => /^spell=\d+&domain=ko$/.test(link)));
          assert(!links.some(link => /spell=(20271|24275|385438|53595|431398|1268810|1300662)&/.test(link)));
          assert(!links.some(link => (key === 'templar' ? /spell=(432459|432472)&/ : /spell=427453&/).test(link)));
          assert(links.includes('spell=389539&domain=ko') && links.includes('spell=53600&domain=ko'));
          if (mode === 'opener') {
            assert.equal(links.length, expected);
            const rail = region.locator('[data-opener-flow-rail]');
            assert(await rail.evaluate(element => element.scrollWidth <= element.clientWidth + 1));
            assert((await actionLinks.locator('img').evaluateAll(items => items.map(item => item.getBoundingClientRect().width))).every(size => size === 16));
            const details = region.locator('details');
            await details.locator('summary').focus();
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') !== null);
            assert((await details.innerText()).length > 500);
            await page.keyboard.press('Enter');
            assert(await details.getAttribute('open') === null);
          } else {
            const text = await region.innerText();
            assert(text.includes('조건을 위에서부터 확인'));
            if (key === 'templar') assert(text.includes('격동하는 천상'));
            if (key === 'lightsmith') assert(text.includes('공유 충전'));
          }
          const broken = await region.locator('img').evaluateAll(items => items.filter(img => img.complete && !img.naturalWidth).map(img => img.src));
          assert.deepEqual(broken, []);
          await page.screenshot({ path: path.join(output, `${width}-${key}-${mode}.png`) });
        }
      }
      assert((await page.locator('#guide-section-1').innerText()).includes('내 스킬 한눈에 보기'));
      assert((await page.locator('body').innerText()).includes('12.1.5'));
      assert.equal(await page.locator('#uptime, a[href$="spell=171648"], a[href$="spell=20271"], a[href$="spell=498"]').count(), 0);
      const defense = page.getByText('방패·회복·면역을 나눠 쓰기', { exact: true }).locator('..');
      assert((await defense.innerText()).includes('12초') && (await defense.innerText()).includes('마지막 저항'));
      await defense.evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 80));
      await page.screenshot({ path: path.join(output, `${width}-defense.png`) });
      const graph = page.locator('#synergies svg[role="group"]');
      const center = await graph.locator('.graph-center-node').textContent();
      assert(center.includes('정의의 방패') && center.includes('11개 시너지 연결'));
      await graph.evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 80));
      await page.screenshot({ path: path.join(output, `${width}-graph.png`) });
      console.log(`${width}px: both heroes, damage and tank cycle modes, defenses, current cast identities and layout passed`);
      await page.close();
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
