// TEST_ORIGIN=https://... node scripts/verify-guide-index.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium, webkit } = require('playwright');

(async () => {
  const browser = await (process.env.TEST_BROWSER === 'webkit' ? webkit : chromium).launch();
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
          position: [element.querySelector('image').getAttribute('x'), element.querySelector('image').getAttribute('y')],
          mode: element.querySelector('mask').style.maskType,
          opacity: Number(style.opacity),
          size: element.getBoundingClientRect().width,
        };
      }));
      assert.equal(icons.length, 40);
      assert.equal(new Set(icons.map(icon => icon.id)).size, 40);
      assert.equal(new Set(icons.map(icon => icon.position.join(','))).size, 40);
      assert(icons.every(icon => icon.mode === 'luminance' && icon.hidden === 'true' && icon.size === 32 && icon.opacity === 0.58));
      if (width === 390) {
        for (const icon of await sections.locator('[data-spec-icon]').all()) {
          const png = await icon.screenshot();
          const coverage = await page.evaluate(async base64 => {
            const image = new Image();
            image.src = `data:image/png;base64,${base64}`;
            await image.decode();
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            const pixels = context.getImageData(0, 0, image.width, image.height).data;
            let bright = 0;
            for (let i = 0; i < pixels.length; i += 4) {
              if (pixels[i] > 80 && pixels[i + 1] > 80 && pixels[i + 2] > 80) bright++;
            }
            return bright / (image.width * image.height);
          }, png.toString('base64'));
          assert(coverage > 0.02 && coverage < 0.65, `${await icon.getAttribute('data-spec-icon')}: blank or solid-square rendering (${coverage})`);
        }
      }
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
            const [x, y] = position.map(value => -Number(value));
            const pixels = context.getImageData(x, y, 176, 176).data;
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
      for (const [route, id] of [
        ['/guide/monk/windwalker', 'monk-windwalker'],
        ['/guide/demonhunter/devourer', 'demonhunter-devourer'],
        ['/guide/deathknight/blood', 'deathknight-blood'],
        ['/guide/rogue/assassination', 'rogue-assassination'],
      ]) {
        await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
        const heading = page.locator('h1');
        const icon = heading.locator('[data-spec-icon]');
        assert.equal(await icon.getAttribute('data-spec-icon'), id);
        assert.equal(await icon.getAttribute('aria-hidden'), 'true');
        const boxes = await heading.evaluate(element => {
          const icon = element.querySelector('[data-spec-icon]').getBoundingClientRect();
          const text = element.lastElementChild.getBoundingClientRect();
          const lead = element.nextElementSibling.getBoundingClientRect();
          return { size: icon.width, separated: icon.right < text.left, fits: text.right <= window.innerWidth && text.bottom <= lead.top };
        });
        assert.equal(boxes.size, width <= 560 ? 36 : 48);
        assert(boxes.separated && boxes.fits, `${width}: ${id} title overlap`);
        await page.screenshot({ path: path.join(output, `${width}-${id}-title.png`) });
      }
      console.log(`${width}px: index, icons, filters, navigation and responsive guide titles passed`);
      await page.close();
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
