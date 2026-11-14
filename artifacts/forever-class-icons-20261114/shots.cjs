// 포에버 직업 가이드 목록의 도트 아이콘 화면 확인.
// 사용: node artifacts/forever-class-icons-20261114/shots.cjs [origin=http://127.0.0.1:4521]
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:4521';
const out = path.join(__dirname, 'shots');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  for (const [width, scale] of [[1440, 1], [1440, 1.25], [768, 1], [390, 2], [320, 1]]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: scale });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/forever/classes', { waitUntil: 'networkidle' });
    const panel = page.locator('#class-guides');
    await panel.scrollIntoViewIfNeeded();
    for (const img of await panel.locator('img').all()) await img.scrollIntoViewIfNeeded();
    await page.waitForLoadState('networkidle');
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      images: [...document.querySelectorAll('#class-guides img')].map(img => ({ src: img.getAttribute('src'), ok: img.complete && img.naturalWidth > 0, w: img.getBoundingClientRect().width })),
    }));
    assert.strictEqual(info.overflow, 0, `${width}px 가로 넘침`);
    assert.strictEqual(info.images.length, 36, `${width}px 아이콘 수 ${info.images.length}`);
    assert.deepStrictEqual(info.images.filter(img => !img.ok), [], `${width}px 그림 누락`);
    assert.ok(info.images.every(img => img.src.startsWith('/images/forever/icons/')), '외부 아이콘이 남아 있음');
    assert.ok(info.images.every(img => img.w === 56 || img.w === 48), '도트 배율이 두 배가 아님');
    assert.deepStrictEqual(errors, []);
    await panel.screenshot({ path: path.join(out, `classes-index-${width}@${scale}.png`) });
    await context.close();
  }
  // 직업 페이지의 전문화 칸 세 개도 같은 아이콘인지 본다.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base + '/forever/classes/warrior', { waitUntil: 'networkidle' });
  const emblems = await page.$$eval('.fv-spec-emblem', images => images.map(img => ({ src: img.getAttribute('src'), ok: img.complete && img.naturalWidth > 0, w: img.getBoundingClientRect().width })));
  assert.deepStrictEqual(emblems.map(img => img.src), ['arms', 'fury', 'protection'].map(spec => `/images/forever/icons/spec-warrior-${spec}.png`));
  assert.ok(emblems.every(img => img.ok && img.w === 48), '전문화 칸 아이콘 크기');
  await page.locator('#specializations').screenshot({ path: path.join(out, 'class-warrior-specializations-1440.png') });
  await browser.close();
  console.log('ok');
})().catch(error => { console.error(error); process.exit(1); });
