// 한국어 Wowhead 특성 계산기 DOM 구조 확인용(1회성)
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const code = process.argv[2];
(async () => {
  const browser = await chromium.launch({headless: true});
  const ctx = await browser.newContext({userAgent: UA, locale: 'ko-KR', viewport: {width: 1600, height: 1200}});
  const page = await ctx.newPage();
  await page.goto('https://www.wowhead.com/ko/talent-calc/blizzard/' + code, {waitUntil: 'domcontentloaded', timeout: 90000});
  await page.waitForTimeout(8000);
  fs.writeFileSync(path.join(__dirname, 'pages', 'probe-calc.html'), await page.content());
  await page.screenshot({path: path.join(__dirname, 'pages', 'probe-calc.png')});
  console.log(page.url(), await page.title());
  await browser.close();
})();
