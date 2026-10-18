// 가이드 페이지 한 장을 일반 Chrome UA로 열어 본문 텍스트 저장
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
(async () => {
  const [url, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await (await b.newContext({ userAgent: UA, locale: 'en-US' })).newPage();
  const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(4000);
  const data = await p.evaluate(() => {
    const el = document.querySelector('#guide-body, .guide-body, .text') || document.body;
    const upd = [...document.querySelectorAll('*')].map(e => e.childElementCount === 0 ? e.textContent : '').filter(t => /Last updated|Updated/i.test(t || '')).slice(0, 5);
    const times = [...document.querySelectorAll('[data-date], time, .guide-header-date, [title]')].map(e => (e.getAttribute('data-date') || e.getAttribute('datetime') || e.getAttribute('title') || '') + ' | ' + e.textContent.trim().slice(0, 60)).filter(t => /20\d\d|ago/.test(t)).slice(0, 10);
    return { title: document.title, upd, times, text: el.innerText };
  });
  require('fs').writeFileSync(out, `URL: ${url}\nSTATUS: ${r.status()}\nTITLE: ${data.title}\nUPDATED: ${JSON.stringify(data.upd)}\nTIMES: ${JSON.stringify(data.times)}\n\n${data.text}`);
  await p.content().then(h => require('fs').writeFileSync(out.replace(/\.txt$/, '.html'), h));
  console.log(r.status(), data.title, data.upd, data.times);
  await b.close();
})();
