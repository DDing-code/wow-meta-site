// 특정 가이드·폭에서 겹침 검사가 가리킨 타임라인을 실제 화면 크기로 찍고 글자 상자 좌표를 출력한다.
// 사용: node zoom.cjs <origin> <가이드 ID> <폭> <찾을 글자>
const path = require('path');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const { loadRegistry } = require('../book-rebuild/lib.cjs');
const [base, id, width, needle] = process.argv.slice(2);
(async () => {
  const spec = loadRegistry().find(s => s.id === id);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +width, height: 900 } });
  await p.goto(base + spec.path, { waitUntil: 'networkidle' }); await p.waitForSelector('[data-book-part]');
  const ol = p.locator('[data-book-box="timeline"] ol').filter({ hasText: needle }).first();
  await ol.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  await ol.screenshot({ path: path.join(__dirname, `zoom-${id}-${width}.png`) });
  console.log(JSON.stringify(await ol.evaluate(o => [...o.querySelectorAll('[data-timeline-node] > p, [data-timeline-above] small')].map(e => { const r = e.getBoundingClientRect(); return [e.textContent.slice(0, 14), Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; }))));
  await b.close();
})();
