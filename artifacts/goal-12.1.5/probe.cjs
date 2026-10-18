// 320px에서 넘치는 흐름도의 자식 요소 폭을 한 단계씩 잰다(원인 확인용).
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 320, height: 860 } });
  await p.goto('http://127.0.0.1:4179/guide/monk/mistweaver', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const box = [...document.querySelectorAll('[data-book-box="diagram"]')].find(el => el.scrollWidth > el.clientWidth + 1);
    const walk = (el, d) => d > 3 ? [] : [...el.children].flatMap(c => [`${'  '.repeat(d)}${c.tagName} w=${Math.round(c.getBoundingClientRect().width)} sw=${c.scrollWidth} disp=${getComputedStyle(c).display} cols=${getComputedStyle(c).gridTemplateColumns} "${c.textContent.slice(0, 30)}"`, ...walk(c, d + 1)]);
    return [`box w=${box.clientWidth}`, ...walk(box, 0)];
  });
  console.log(r.join('\n')); await b.close();
})();
