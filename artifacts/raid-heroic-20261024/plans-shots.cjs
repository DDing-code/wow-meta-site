// 영웅 배치도 눈 확인용 화면 찍기. TEST_ORIGIN(빌드본 서버)에 붙는다.
// 행동 칸(그림+글)과 확대 보기를 PC·휴대폰 폭으로 찍고, 그림이 다 불러졌는지·옆으로 넘치는지 센다.
const { chromium } = require('playwright');
const ORIGIN = process.env.TEST_ORIGIN || 'http://localhost:5058';
const BASE = process.env.SHOT_BASE || 'plans';
(async () => {
  const browser = await chromium.launch();
  const out = [];
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    for (const id of ['ulatek', 'nymrissa', 'explorers', 'kithix', 'nekzali', 'sentinels', 'vashnik', 'sszorak', 'fangs', 'coiled-altar']) {
      await page.goto(`${ORIGIN}/raid/heroic/${id}`, { waitUntil: 'networkidle' });
      // 지연 불러오기 그림을 모두 불러오게 끝까지 내렸다 올린다.
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
      await page.waitForLoadState('networkidle');
      const stat = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('li[data-figure] > figure img'));
        return { figures: imgs.length, broken: imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src), overflow: document.documentElement.scrollWidth > window.innerWidth };
      });
      out.push({ w, id, ...stat });
      if (['ulatek', 'nymrissa', 'explorers'].includes(id)) {
        const step = page.locator('li[data-figure]').first();
        await step.scrollIntoViewIfNeeded();
        await step.screenshot({ path: `${__dirname}/shots/${BASE}-${w}-${id}-step.png` });
        if (id === 'ulatek') {
          const fangs = page.locator('li[data-figure="heroic-ulatek-05"]');
          await fangs.scrollIntoViewIfNeeded();
          await page.screenshot({ path: `${__dirname}/shots/${BASE}-${w}-ulatek-fangs.png` });
          await fangs.locator('figure button').click();
          await page.waitForTimeout(400);
          await page.screenshot({ path: `${__dirname}/shots/${BASE}-${w}-ulatek-zoom.png` });
          await page.keyboard.press('Escape');
        }
      }
    }
    await page.close();
  }
  console.log(JSON.stringify(out));
  await browser.close();
})();
