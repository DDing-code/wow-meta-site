// Wowhead 가이드: 영웅 특성 스위치를 Void-Scarred로 바꾼 뒤 #guide-body 텍스트 저장 (페이지 한 장)
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
(async () => {
  const [url, out, hero] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await (await b.newContext({ userAgent: UA, locale: 'en-US' })).newPage();
  const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForSelector('#guide-body', { timeout: 30000 });
  await p.waitForTimeout(3000);
  const clicked = await p.evaluate((hero) => {
    const labels = [...document.querySelectorAll('#guide-body label, #guide-body [class*=toggle], #guide-body [class*=switch], #guide-body input')];
    let n = 0;
    for (const l of labels) { const t = (l.textContent || l.value || '').trim(); if (t === hero || t.endsWith(hero)) { (l.querySelector('input') || l).click(); n++; } }
    return n;
  }, hero || 'Void-Scarred');
  await p.waitForTimeout(1500);
  const text = await p.evaluate(() => document.querySelector('#guide-body').innerText);
  const mod = await p.evaluate(() => { const m = document.documentElement.outerHTML.match(/"dateModified":"([^"]+)"/); return m ? m[1] : ''; });
  require('fs').writeFileSync(out, `URL: ${url}\nSTATUS: ${r.status()}\ndateModified: ${mod}\nhero switch clicked: ${clicked}\n\n${text}`);
  console.log(r.status(), mod, 'clicked', clicked, text.length);
  await b.close();
})();
