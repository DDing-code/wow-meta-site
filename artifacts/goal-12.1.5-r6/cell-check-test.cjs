// '칸 밖 글' 검사가 예전 이름표 스타일(한 덩어리)에서 겹침을 잡는지 시험한다. 사용: node cell-check-test.cjs <origin>
const path = require('path');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2];
const OLD = '[data-timeline-node] a[data-wowhead]{display:inline-flex!important}[data-timeline-node] a[data-wowhead] em{display:inline-block!important}';
const count = () => [...document.querySelectorAll('[data-timeline-node]')].filter(node => {
  const cell = node.getBoundingClientRect();
  return [...node.querySelectorAll(':scope > p, [data-timeline-above] small')].some(el => {
    const range = document.createRange(); range.selectNodeContents(el);
    return [...range.getClientRects()].some(r => r.width && (r.left < cell.left - 2 || r.right > cell.right + 2));
  });
}).length;
(async () => {
  const browser = await chromium.launch();
  for (const [route, width] of [['/guide/demonhunter/devourer', 1440], ['/guide/priest/shadow', 390], ['/guide/mage/frost', 390]]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const now = await page.evaluate(count);
    await page.addStyleTag({ content: OLD });
    const old = await page.evaluate(count);
    const detail = await page.evaluate(() => [...document.querySelectorAll('[data-timeline-node]')].map(n => { const c = n.getBoundingClientRect(); return [...n.querySelectorAll(':scope > p, [data-timeline-above] small')].map(el => { const r = document.createRange(); r.selectNodeContents(el); const rs = [...r.getClientRects()]; return { t: el.textContent.trim().slice(0, 14), cw: Math.round(c.width), over: Math.round(Math.max(0, ...rs.map(x => Math.max(c.left - x.left, x.right - c.right)))) }; }); }).flat().filter(x => /이면|면/.test(x.t)).slice(0, 6)); console.log(route, width, '지금', now, '예전 스타일', old, JSON.stringify(detail));
    await page.close();
  }
  await browser.close();
})();
