// 공개 빌드 페이지 하나를 Playwright(일반 Chrome UA)로 열어 특성 코드·라벨·갱신일을 읽는다.
// 사용: node fetch-guide.cjs <key> <url>   → pages/<key>.json, pages/<key>.txt
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const [key, url] = process.argv.slice(2);
const out = path.join(__dirname, 'pages');
fs.mkdirSync(out, {recursive: true});
(async () => {
  const browser = await chromium.launch({headless: true});
  try {
    const ctx = await browser.newContext({userAgent: UA, locale: 'ko-KR', viewport: {width: 1440, height: 1000}});
    const page = await ctx.newPage();
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 90000});
    await page.waitForTimeout(6000);
    const data = await page.evaluate(() => {
      const codes = [];
      const re = /talent-calc\/blizzard\/([A-Za-z0-9+/]{40,})/;
      for (const a of document.querySelectorAll('a[href*="talent-calc"], [data-href*="talent-calc"], iframe[src*="talent-calc"]')) {
        const href = a.getAttribute('href') || a.getAttribute('data-href') || a.getAttribute('src') || '';
        const m = href.match(re);
        if (!m) continue;
        // 가장 가까운 탭/제목 텍스트
        let label = '';
        let el = a;
        for (let i = 0; i < 8 && el && !label; i++) {
          const tab = el.closest('[role="tabpanel"], .tabs-container, .guide-talent-calc, section, div');
          el = el.parentElement;
        }
        codes.push({code: m[1], text: (a.innerText || '').trim().slice(0, 80), href});
      }
      const txt = document.body.innerText;
      const html = document.documentElement.outerHTML;
      const fromHtml = [...new Set([...html.matchAll(/talent-calc\/blizzard\/([A-Za-z0-9+/]{40,})/g)].map(m => m[1]))];
      return {title: document.title, codes, fromHtml, text: txt};
    });
    fs.writeFileSync(path.join(out, key + '.txt'), data.text);
    const html = await page.content();
    fs.writeFileSync(path.join(out, key + '.html'), html);
    delete data.text;
    data.url = url; data.fetchedAt = new Date().toISOString();
    fs.writeFileSync(path.join(out, key + '.json'), JSON.stringify(data, null, 2));
    console.log(JSON.stringify({key, title: data.title, links: data.codes.length, htmlCodes: data.fromHtml.length}));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
