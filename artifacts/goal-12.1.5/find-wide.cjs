// 지정한 가이드·폭에서 화면 밖으로 넘치는 개념서 상자를 찾아 글자 일부를 보여 준다.
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const [base, path, width] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: Number(width), height: 860 } });
  await p.goto(base + path, { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => [...document.querySelectorAll('[data-book-box], [data-book-part], [data-book-start] a, [data-skill-group]')]
    .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1 || el.scrollWidth > el.clientWidth + 1)
    .map(el => {
      const kids = [...el.querySelectorAll('*')].filter(k => k.getBoundingClientRect().right > window.innerWidth + 1 || k.scrollWidth > k.clientWidth + 1).slice(-3)
        .map(k => `${k.tagName}.${k.className} w=${k.scrollWidth}/${k.clientWidth} "${k.textContent.slice(0, 60)}"`);
      return { box: el.dataset.bookBox || el.dataset.skillGroup || 'part', sw: el.scrollWidth, cw: el.clientWidth, text: el.textContent.slice(0, 80), kids };
    }));
  console.log(JSON.stringify(r, null, 1)); await b.close();
})();
