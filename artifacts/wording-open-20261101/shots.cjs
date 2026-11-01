// 문장 다듬기 화면 확인: 무기 전사 가이드를 1440·390px 로 열어 거인의 강타 장 제목과 흐름도를 찍고,
// 페이지 글에 옛 표현('구간을 엽니다' 등)이 남았는지 센다.
// 사용: node artifacts/wording-open-20261101/shots.cjs https://wowmeta.vercel.app
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:4181';
const out = path.join(__dirname, 'live');
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
const OLD = /구간을 ?(열|엽)|구간 열기|피해 구간|강타를 (엽니다|열어)|여는 10초/g;
const TITLE = '거인의 강타를 건 10초가 극딜 타이밍입니다';
(async () => {
  const browser = await chromium.launch();
  const results = {};
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, userAgent: UA, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(`${base}/guide/warrior/arms`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-book-box="diagram"]');
    await page.waitForTimeout(800);
    const text = await page.evaluate(() => document.body.innerText);
    const heading = page.getByText(TITLE, { exact: true }).first();
    const found = await heading.count();
    if (found) {
      await heading.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, -80));
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(out, `${width}-colossus-smash.png`) });
    }
    results[width] = {
      errors,
      titleFound: found > 0,
      oldPhrases: (text.match(OLD) || []),
      overflow: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1),
    };
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 1));
})();
