// 타임라인에서 위쪽 가지 글 ↔ 그 아래 작은 아이콘, 아이콘 ↔ 설명 글이 포개지는지 40개 × 320·390·1440px 전부 센다(캡처 없이).
const path = require('path'); const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const { loadRegistry } = require('../book-rebuild/lib.cjs');
const base = process.argv[2] || 'http://127.0.0.1:4410';
(async () => {
  const b = await chromium.launch(); const out = [];
  for (const spec of loadRegistry()) for (const width of [320, 390, 1440]) {
    const p = await b.newPage({ viewport: { width, height: 900 } });
    await p.goto(base + spec.path, { waitUntil: 'networkidle' }); await p.waitForSelector('[data-book-part]');
    const hits = await p.evaluate(() => {
      const r = el => el.getBoundingClientRect(); const bad = [];
      for (const node of document.querySelectorAll('[data-timeline-node]')) {
        const above = node.querySelector('[data-timeline-above="true"]');
        const icon = node.querySelector('[data-timeline-icon]');
        const cap = node.querySelector(':scope > p');
        if (above) { const s = r(above.querySelector('small')); const i = r(above.querySelector(':scope > a, :scope > span')); if (s.bottom > i.top + 1) bad.push(`가지 글↔가지 아이콘 ${above.textContent.slice(0, 12)}`); }
        if (cap && icon && r(cap).top < r(icon).bottom - 1) bad.push(`아이콘↔설명 ${cap.textContent.slice(0, 12)}`);
      }
      return bad;
    });
    out.push({ id: spec.id, width, hits }); if (hits.length) console.log(spec.id, width, hits.join(' | '));
    await p.close();
  }
  await b.close(); fs.writeFileSync(path.join(__dirname, 'timeline-gap.json'), JSON.stringify(out, null, 2));
  console.log(`화면 ${out.length}개, 포개짐 ${out.reduce((a, x) => a + x.hits.length, 0)}건`);
})();
