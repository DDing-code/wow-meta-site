// 공개 가이드 한 페이지를 Playwright(일반 Chrome UA)로 열어 본문 글자를 저장한다. 사용: node page.cjs <url> <저장 파일>
const fs = require('fs');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
(async () => {
  const [url, out] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' });
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(out, `${url}\nHTTP ${res.status()} · ${new Date().toISOString()}\n\n${text}`);
  console.log(res.status(), text.length);
  await browser.close();
})();
