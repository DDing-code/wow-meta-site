// 눈 확인용 부분 캡처: 던전 머리·전체 루트·첫 네임드·풀링 카드(몹 설명 펼침)·네임드 풀링·홈 줄을 요소 단위로 찍는다.
// 사용: TEST_ORIGIN=http://127.0.0.1:4428 node artifacts/mythicplus-20261028/element-shots.cjs [출력 폴더 이름=shots]
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('playwright');
const ORIGIN = process.env.TEST_ORIGIN || 'http://127.0.0.1:4428';
const OUT = path.join(__dirname, process.argv[2] || 'shots', 'parts');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(`${ORIGIN}/mythicplus/altar-of-fangs`, { waitUntil: 'networkidle' });
    await page.evaluate(() => { const d = document.querySelector('details[data-new-mobs]'); if (d) d.open = true; });
    await page.waitForTimeout(400);
    const shot = async (selector, name) => {
      const el = page.locator(selector).first();
      if (await el.count()) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
        await el.screenshot({ path: path.join(OUT, `${w}-${name}.png`) });
      }
    };
    await page.screenshot({ path: path.join(OUT, `${w}-00-top.png`) });
    await shot('[data-dungeon] > section[aria-labelledby="dungeon-title"]', '01-head');
    await shot('[data-section="route"]', '02-route');
    await shot('section[data-boss]', '03-boss');
    await shot('[data-pull="1"]', '04-pull1');
    await shot('[data-boss-pull="true"]', '05-bosspull');
    await shot('[data-section="sources"]', '06-sources');
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    await shot('[data-shelf="mythicplus"]', '07-home-shelf');
    await page.screenshot({ path: path.join(OUT, `${w}-08-home-top.png`) });
    await page.close();
  }
  await browser.close();
  console.log(fs.readdirSync(OUT).join('\n'));
})();
