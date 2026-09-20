// TEST_ORIGIN=https://... node scripts/verify-guide-index.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3002';
  const output = path.join(__dirname, '../artifacts/guide-index');
  fs.mkdirSync(output, { recursive: true });
  const errors = [];
  try {
    for (const width of [1440, 1024, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${origin}/guide`, { waitUntil: 'networkidle' });
      const sections = page.locator('main section');
      assert.equal(await sections.count(), 13);
      assert.equal(await sections.locator('a').count(), 40);
      const icons = await sections.locator('[data-spec-icon]').evaluateAll(elements => elements.map(element => {
        const style = getComputedStyle(element);
        return {
          id: element.dataset.specIcon,
          hidden: element.getAttribute('aria-hidden'),
          position: style.maskPosition,
          mode: style.maskMode,
          opacity: Number(style.opacity),
          size: element.getBoundingClientRect().width,
        };
      }));
      assert.equal(icons.length, 40);
      assert.equal(new Set(icons.map(icon => icon.id)).size, 40);
      assert.equal(new Set(icons.map(icon => icon.position)).size, 40);
      assert(icons.every(icon => icon.mode === 'luminance' && icon.hidden === 'true' && icon.size === 32 && icon.opacity === 0.58));
      if (width === 1440) {
        const masks = await page.evaluate(async positions => {
          const image = new Image();
          image.src = '/assets/spec-icons-white-v1.png';
          await image.decode();
          const canvas = document.createElement('canvas');
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0);
          return positions.map(position => {
            const [x, y] = position.split(' ').map(value => parseFloat(value));
            const pixels = context.getImageData(Math.round(x / 100 * (canvas.width - 176)), Math.round(y / 100 * (canvas.height - 176)), 176, 176).data;
            let ink = 0, clipped = false;
            for (let i = 0; i < 176 * 176; i++) {
              if (pixels[i * 4] < 128) continue;
              ink++;
              if (i % 176 === 0 || i % 176 === 175 || i < 176 || i >= 175 * 176) clipped = true;
            }
            return { ink, clipped };
          });
        }, icons.map(icon => icon.position));
        assert(masks.every(mask => mask.ink > 800 && !mask.clipped), 'Every atlas view must contain a complete, nonblank icon');
      }
      const layout = await sections.evaluateAll(elements => elements.map(section => {
        const links = [...section.querySelectorAll('a')];
        return {
          name: section.getAttribute('aria-label'),
          rows: new Set(links.map(link => Math.round(link.getBoundingClientRect().top))).size,
          count: links.length,
          clipped: links.some(link => link.scrollWidth > link.clientWidth + 1),
          heights: links.map(link => link.getBoundingClientRect().height),
          textFits: links.every(link => [...link.querySelectorAll('h3, span')].every(text => {
            const box = text.getBoundingClientRect(), parent = link.getBoundingClientRect();
            return box.left >= parent.left && box.right <= parent.right && box.bottom <= parent.bottom;
          })),
        };
      }));
      for (const group of layout) {
        assert.equal(group.rows, width > 700 ? 1 : Math.ceil(group.count / 2), `${width}: ${group.name} rows`);
        assert(!group.clipped && group.textFits, `${width}: ${group.name} text overflow`);
        assert(group.heights.every(height => height <= 100), `${width}: ${group.name} excessive item height`);
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      assert((await page.locator('a[href="/guide/monk/windwalker"]').innerText()).includes('12.1'));
      await page.screenshot({ path: path.join(output, `${width}.png`), fullPage: true });
      for (const [label, count] of [['탱커', 6], ['근접', 13], ['원거리', 14], ['힐러', 7], ['전체', 40]]) {
        const button = page.getByRole('group', { name: '포지션별 가이드 필터' }).getByRole('button', { name: label, exact: true });
        await button.click();
        assert.equal(await button.getAttribute('aria-pressed'), 'true');
        assert.equal(await sections.locator('a').count(), count);
      }
      const link = page.locator('a[href="/guide/monk/windwalker"]');
      await link.focus();
      await page.keyboard.press('Enter');
      await page.waitForURL('**/guide/monk/windwalker');
      await page.getByRole('heading', { name: '풍운 수도사 가이드', exact: true }).waitFor();
      await page.waitForFunction(() => window.scrollY === 0);
      console.log(`${width}px: class rows, 40 icons/links, filters, text bounds and keyboard navigation passed`);
      await page.close();
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
