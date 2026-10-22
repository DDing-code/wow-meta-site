// 가이드 본문 속 스킬 이름표(아이콘+이름+조사)가 상자 규칙에 걸려 블록으로 바뀌거나 글자 크기가 바뀐 곳을 센다.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const origin = process.env.TEST_ORIGIN || 'https://wowmeta.vercel.app';
const widths = (process.env.WIDTHS || '1440,390').split(',').map(Number);
const out = process.env.OUT || path.join(__dirname, 'scan-result.json');

(async () => {
  const browser = await chromium.launch();
  const page0 = await browser.newPage();
  await page0.goto(`${origin}/guide`, { waitUntil: 'networkidle' });
  const ids = (await page0.$$eval('a', as => as.map(a => a.getAttribute('href'))))
    .filter(h => /^\/guide\/[a-z]+\/[a-z-]+$/.test(h || '')).map(h => h.slice(7));
  await page0.close();
  const uniq = [...new Set(ids)];
  const results = [];
  for (const id of uniq) for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    await page.goto(`${origin}/guide/${id}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
    const info = await page.evaluate(() => {
      const bad = [];
      const describe = el => {
        const block = el.closest('p,li,div');
        return (block?.textContent || '').replace(/\s+/g, ' ').slice(0, 70);
      };
      const blockified = el => /flex|grid/.test(getComputedStyle(el.parentElement).display);
      const check = (el, kind, ctxEl) => {
        const cs = getComputedStyle(el);
        const pfs = parseFloat(getComputedStyle(el.parentElement).fontSize);
        const reason = [];
        if (!/inline/.test(cs.display) && !blockified(el)) reason.push('display:' + cs.display);
        if (Math.abs(parseFloat(cs.fontSize) - pfs) > 0.5) reason.push(`font ${cs.fontSize}/${pfs}px`);
        if (reason.length) bad.push({ kind, text: el.textContent.slice(0, 20), reason: reason.join(','), ctx: describe(ctxEl || el) });
      };
      document.querySelectorAll('a[data-wowhead]').forEach(a => {
        if (!a.querySelector('img')) return;
        const host = a.parentElement;
        if (host && host.tagName === 'SPAN' && host.childElementCount === 1 && host.textContent.length - a.textContent.length <= 1) check(host, 'glue', a);
        a.querySelectorAll('em > span').forEach(t => check(t, 'tail', a));
      });
      document.querySelectorAll('p span, li span, small span, strong span').forEach(el => {
        if (el.childElementCount || !/·$/.test(el.textContent) || el.closest('a')) return;
        check(el, 'dot');
      });
      // 끝 글자+조사 조각이 이름표와 다른 줄로 떨어진 곳
      const split = [];
      document.querySelectorAll('a[data-wowhead] em').forEach(em => {
        const rects = [...em.getClientRects()].filter(r => r.width > 1);
        const tail = em.querySelector('span');
        if (rects.length > 1 && tail) {
          const tr = tail.getBoundingClientRect();
          const first = rects[0];
          if (tr.top > first.bottom - 2 && em.textContent.length - tail.textContent.length <= 1) split.push(em.textContent);
        }
      });
      return { bad, split, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    results.push({ id, width, ...info });
    console.log(id, width, 'bad', info.bad.length, 'split', info.split.length, info.overflow ? 'OVERFLOW' : '');
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(out, JSON.stringify(results, null, 2));
  const total = results.reduce((n, r) => n + r.bad.length, 0);
  console.log('TOTAL bad', total);
})();
