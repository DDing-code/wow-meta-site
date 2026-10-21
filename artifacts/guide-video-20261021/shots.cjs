// 악마 흑마 가이드 글 상단 영상 확인: 1440·390·320 폭에서 영상 칸 캡처, 넘침·비율·iframe 주소·목차 링크를 센다.
// 사용: node shots.cjs <origin>   결과: shots/*.png, shots/check.json
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const OUT = path.join(__dirname, 'shots');
(async () => {
  const base = process.argv[2];
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}/guide/warlock/demonology`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#guide-video iframe');
    await page.waitForTimeout(1500);
    const info = await page.evaluate(() => {
      const sec = document.querySelector('#guide-video');
      const frame = sec.querySelector('iframe').getBoundingClientRect();
      const article = sec.parentElement;
      return {
        firstInArticle: article.firstElementChild === sec,
        src: sec.querySelector('iframe').src,
        frame: { w: Math.round(frame.width), h: Math.round(frame.height) },
        ratio: +(frame.width / frame.height).toFixed(3),
        docOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        navLink: !!document.querySelector('a[href="#guide-video"]'),
        captionLink: sec.querySelector('a[href^="https://www.youtube.com/watch"]')?.href,
      };
    });
    await page.screenshot({ path: path.join(OUT, `${width}-top.png`) });
    await page.locator('#guide-video').screenshot({ path: path.join(OUT, `${width}-video.png`) });
    results.push({ width, errors, ...info });
    await page.close();
  }
  // 다른 가이드에는 영상 칸이 없어야 한다.
  const other = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await other.goto(`${base}/guide/warlock/affliction`, { waitUntil: 'networkidle' });
  results.push({ other: 'warlock-affliction', hasVideo: await other.locator('#guide-video').count() });
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'check.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
})();
