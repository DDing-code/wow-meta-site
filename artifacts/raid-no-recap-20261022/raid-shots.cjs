// 레이드 가이드 5편을 1440·390px로 열어 그림 로드·넘침·한 글자 꺾임과 '한 장 복습'·맨 위 개요 그림이 빠졌는지 확인하고 캡처를 남긴다.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:4410';
const out = path.join(__dirname, 'raid-shots');
const episodes = ['kithix', 'nymrissa', 'venomous-1-6', 'coiled-altar', 'ulatek'];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const report = [];
  for (const id of episodes) for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${origin}/raid/${id}`, { waitUntil: 'networkidle' });
    const info = await page.evaluate(async () => {
      const imgs = [...document.querySelectorAll('figure img, img[src^="/images/raid/sprites/"]')];
      await Promise.all(imgs.map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); }));
      const broken = imgs.filter(img => !img.naturalWidth).map(img => img.src);
      const pieces = [...document.querySelectorAll('[data-term-piece]')].filter(el => el.getClientRects().length > 1 && [...el.getClientRects()].some((r, i, a) => i && r.top > a[0].bottom - 2)).map(el => el.textContent);
      return { figures: document.querySelectorAll('figure[data-plan]').length, sprites: document.querySelectorAll('img[src^="/images/raid/sprites/"]').length, broken, pieces, overflow: document.documentElement.scrollWidth > innerWidth + 1, recap: document.body.textContent.includes('복습') && /한 장 복습|출발 전/.test(document.body.textContent), topFigure: !!document.querySelector('section[aria-labelledby="episode-title"] figure') };
    });
    report.push({ id, width, ...info, errors });
    console.log(id, width, JSON.stringify({ ...info, errors }));
    await page.screenshot({ path: path.join(out, `${id}-${width}-top.png`) });
    const tips = page.locator('section[data-boss]').last().locator('[id$="-tips"]');
    await tips.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -420));
    await page.screenshot({ path: path.join(out, `${id}-${width}-before-tips.png`) });
    const step = page.locator('li[data-figure]').first();
    await step.scrollIntoViewIfNeeded();
    await step.screenshot({ path: path.join(out, `${id}-${width}-step.png`) });
    await page.locator('section[data-boss]').first().screenshot({ path: path.join(out, `${id}-${width}-boss.png`) });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
  const bad = report.filter(r => r.broken.length || r.overflow || r.errors.length || r.pieces.length || r.recap || r.topFigure);
  if (bad.length) { console.error('FAIL', bad.map(r => `${r.id}@${r.width}`)); process.exitCode = 1; } else console.log('raid shots OK');
})();
