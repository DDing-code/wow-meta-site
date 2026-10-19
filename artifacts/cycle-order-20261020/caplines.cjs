// 타임라인 캡션의 실제 줄 수(글줄 상자 수)를 센다. 3줄 이상인 캡션만 모은다. 사용: node caplines.cjs <origin> [ID...]
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const {loadRegistry} = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
(async () => {
  const [base, ...ids] = process.argv.slice(2);
  const reg = loadRegistry();
  const list = ids.length ? ids : fs.readdirSync(path.join(__dirname, 'patches/orig')).map(f => f.replace('.json', ''));
  const browser = await chromium.launch();
  const out = [];
  for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({viewport: {width, height: 900}});
    for (const id of list) {
      await page.goto(base + reg.find(s => s.id === id).path, {waitUntil: 'networkidle'});
      await page.waitForSelector('[data-book-part]');
      const r = await page.evaluate(() => [...document.querySelectorAll('[data-book-box="timeline"] [data-timeline-node] > p, [data-book-box="timeline"] [data-timeline-above] small')].map(el => {
        const range = document.createRange(); range.selectNodeContents(el);
        const tops = new Set([...range.getClientRects()].map(r => Math.round(r.top)));
        return {t: el.textContent.trim(), lines: tops.size};
      }));
      for (const c of r) if (c.lines >= 3) out.push({id, width, ...c});
      out.push({id, width, total: r.length, max: Math.max(0, ...r.map(c => c.lines))});
    }
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'shots', 'caplines.json'), JSON.stringify(out, null, 1));
  const tall = out.filter(x => x.t);
  console.log(`3줄 이상 캡션 ${tall.length}`);
  for (const w of [320, 390, 1440]) console.log(w, tall.filter(x => x.width === w).length);
  tall.filter(x => x.width !== 320).slice(0, 40).forEach(x => console.log(x.id, x.width, x.lines, x.t));
})();
