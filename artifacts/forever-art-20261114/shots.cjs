// 포에버 세 쪽의 도트 그림 화면 확인. 폭마다 가로 넘침·깨진 그림·콘솔 오류를 검사하고 캡처한다.
// 사용: node artifacts/forever-art-20261114/shots.cjs [origin=http://127.0.0.1:4518] [쪽 이름…]   (SHOTS_DIR=live 로 운영 결과를 따로 저장)
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));

const base = process.argv[2] || 'http://127.0.0.1:4518';
const only = process.argv.slice(3);
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
const PAGES = [['home', '/forever'], ['start', '/forever/start'], ['rules', '/forever/rules']].filter(([id]) => !only.length || only.includes(id));
const WIDTHS = [1440, 1041, 861, 860, 821, 820, 768, 721, 720, 641, 640, 560, 390, 320];
const SHOT_WIDTHS = [1440, 768, 390];

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const result = [];
  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, userAgent: UA, deviceScaleFactor: width <= 390 ? 2 : 1 });
    const page = await context.newPage();
    page.on('console', message => { if (message.type() === 'error') errors.push(`${width} ${message.text()}`); });
    page.on('pageerror', error => errors.push(`${width} ${error.message}`));
    for (const [id, route] of PAGES) {
      await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
      await page.waitForSelector(`[data-forever-section="${id}"] h1`);
      // 보일 때 받는 그림까지 모두 받게 끝까지 내렸다가 올라온다.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
        await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
      });
      const info = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        images: [...document.querySelectorAll('[data-forever-section] img')].map(image => {
          const box = image.getBoundingClientRect();
          return { src: image.currentSrc.split('/').pop(), ok: image.complete && image.naturalWidth > 0, w: Math.round(box.width), h: Math.round(box.height), alt: image.alt };
        }),
      }));
      assert.strictEqual(info.overflow, 0, `${width}px ${route}: 가로 넘침 ${info.overflow}px`);
      const broken = info.images.filter(image => !image.ok);
      assert.deepStrictEqual(broken, [], `${width}px ${route}: 깨진 그림 ${broken.map(image => image.src).join(', ')}`);
      for (const image of info.images) assert.ok(image.w >= 80 && image.h >= 54, `${width}px ${route}: 그림이 너무 작음 ${image.src} ${image.w}x${image.h}`);
      result.push({ width, route, images: info.images.length, sizes: [...new Set(info.images.map(image => `${image.w}x${image.h}`))] });
      if (SHOT_WIDTHS.includes(width)) await page.screenshot({ path: path.join(out, `${id}-${width}.png`), fullPage: true });
    }
    await context.close();
  }
  await browser.close();
  assert.deepStrictEqual(errors, [], `콘솔 오류: ${errors.join(' | ')}`);
  fs.writeFileSync(path.join(out, 'check.json'), JSON.stringify({ base, checkedAt: new Date().toISOString(), result }, null, 2));
  console.log(`✅ ${PAGES.length}쪽 × ${WIDTHS.length}폭 통과 (그림 ${[...new Set(result.map(r => `${r.route} ${r.images}장`))].join(', ')})`);
})().catch(error => { console.error(error.message); process.exit(1); });
