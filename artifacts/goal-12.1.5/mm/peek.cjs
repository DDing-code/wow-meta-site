// 사격 12.1.5 근거 확인용: 지정한 주소 몇 개만 하나씩 연다(일괄 수집기 아님).
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const jobs = process.argv.slice(2).map(arg => { const [name, url] = arg.split('='.repeat(1)).length > 2 ? [arg.slice(0, arg.indexOf('=')), arg.slice(arg.indexOf('=') + 1)] : arg.split(/=(.+)/); return { name, url }; });
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ userAgent: UA, locale: 'ko-KR' });
  const page = await ctx.newPage();
  for (const { name, url } of jobs) {
    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(name.startsWith('page-') ? 6000 : 1500);
      const body = name.startsWith('page-') ? await page.evaluate(() => document.body.innerText) : await page.evaluate(() => document.body.innerText);
      fs.writeFileSync(path.join(__dirname, `${name}.txt`), `URL: ${url}\nSTATUS: ${res && res.status()}\nFETCHED: ${new Date().toISOString()}\n\n${body}`);
      console.log(name, res && res.status(), body.length);
    } catch (e) { console.log(name, 'ERR', e.message); }
  }
  await browser.close();
})();
