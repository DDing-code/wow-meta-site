// 영웅 탭 눈 확인용 화면 찍기. TEST_ORIGIN(빌드본 서버)에 붙는다.
const { chromium } = require('playwright');
const ORIGIN = process.env.TEST_ORIGIN || 'http://localhost:5057';
(async () => {
  const browser = await chromium.launch();
  const out = [];
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    for (const id of ['', '/ulatek', '/explorers']) {
      await page.goto(`${ORIGIN}/raid/heroic${id}`, { waitUntil: 'networkidle' });
      const name = `${w}-${id.replace('/', '') || 'kithix'}`;
      await page.screenshot({ path: `${__dirname}/shots/${name}-full.png`, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      out.push({ name, overflow, height: await page.evaluate(() => document.body.scrollHeight) });
    }
    await page.goto(`${ORIGIN}/raid`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${__dirname}/shots/${w}-mythic-top.png` });
    await page.close();
  }
  console.log(JSON.stringify(out));
  await browser.close();
})();
