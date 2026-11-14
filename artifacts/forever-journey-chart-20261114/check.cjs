const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../../../node_modules/playwright');
const atlas = require('../../src/data/foreverVisuals.json');

(async () => {
  const browser = await chromium.launch();
  const out = path.join(__dirname, 'shots');
  fs.mkdirSync(out, { recursive: true });
  const errors = [];
  try {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 950 }, reducedMotion: 'no-preference' });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${process.env.TEST_ORIGIN || 'http://127.0.0.1:4518'}/forever/leveling/human#starting-map`);
      await page.locator('.fv-journey-camera').waitFor();
      await page.evaluate(() => document.querySelector('.fv-journey').scrollIntoView({ block: 'start' }));
      const motion = await page.evaluate(() => new Promise(resolve => {
        const frames = [];
        document.querySelector('[data-stage="3"]').click();
        const start = performance.now();
        function sample(now) {
          const dot = document.querySelector('.fv-journey-traveler');
          const matrix = new DOMMatrix(getComputedStyle(dot).transform);
          const dx = parseFloat(dot.style.getPropertyValue('--travel-x')), dy = parseFloat(dot.style.getPropertyValue('--travel-y'));
          frames.push({ x: matrix.e, y: matrix.f, dx, dy });
          if (now - start < 1800) requestAnimationFrame(sample);
          else resolve(frames);
        }
        requestAnimationFrame(sample);
      }));
      assert.ok(new Set(motion.map(frame => `${frame.x},${frame.y}`)).size > 10, '이동 중간 위치');
      for (const frame of motion) assert.ok(Math.abs(frame.x * frame.dy - frame.y * frame.dx) / Math.hypot(frame.dx, frame.dy) < 0.01, '표식이 연결선 위에서 이동');
      assert.ok(Math.hypot(motion[0].x, motion[0].y) > 0);
      assert.equal(Math.hypot(motion.at(-1).x, motion.at(-1).y), 0, '도착 위치');
      await page.evaluate(() => document.getAnimations().filter(a => a.effect.target.matches('.fv-journey-traveler,.fv-journey-reveal')).forEach(a => { a.pause(); a.currentTime = 1000; }));
      await page.screenshot({ path: path.join(out, `human-motion-${width}.png`) });
      await page.getByRole('button', { name: '30~60 · 추천 후보 · 추정', exact: true }).click();
      await page.getByRole('button', { name: '가시덤불 골짜기', exact: true }).click();
      await page.locator('[data-stage="1"]').click();
      assert.equal(await page.locator('.fv-journey-traveler').count(), 0, '같은 지역이면 이동 없음');
      assert.ok(!(await page.locator('.fv-journey-camera').getAttribute('style')).includes('NaN'));
      await page.locator('[data-stage="5"]').click();
      await page.waitForTimeout(1800);
      await page.screenshot({ path: path.join(out, `later-${width}.png`) });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => !document.querySelector('.fv-journey-traveler'));
      assert.equal(await page.locator('.fv-journey-camera').evaluate(el => getComputedStyle(el).transitionProperty), 'none');
      assert.equal(await page.locator('.fv-journey-reveal').evaluate(el => getComputedStyle(el).animationName), 'none');
      for (const race of Object.keys(atlas.journeys)) {
        await page.goto(`${process.env.TEST_ORIGIN || 'http://127.0.0.1:4518'}/forever/leveling/${race}#starting-map`);
        await page.locator('.fv-journey-steps').waitFor();
        assert.equal(await page.locator('.fv-journey-steps button').count(), atlas.journeys[race].stages.length);
        const overflow = await page.evaluate(() => [document.documentElement, document.querySelector('.fv-journey-steps')].map(el => el.scrollWidth - el.clientWidth));
        assert.deepEqual(overflow, [0, 0], `${race} ${width}px 옆스크롤 없음`);
        if (race === 'skyborne-horde') {
          await page.evaluate(() => document.querySelector('.fv-journey').scrollIntoView({ block: 'start' }));
          await page.screenshot({ path: path.join(out, `skyborne-${width}.png`) });
        }
      }
      console.log(`${width}px: 종족 10개 넘침 없음 · 경로 이동 ${motion.length}프레임 · 후보 변경·동작 줄이기 통과`);
      await page.close();
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
