// 초보자 안내 설명 카드(그림 + 한두 줄)를 영역별로 1440·390·320px에서 찍고, 카드 안 글이 세 줄 넘게 꺾이는지와 가로 넘침을 센다.
// 사용: node artifacts/beginner-concise-20261020/cards.cjs [origin=http://127.0.0.1:4410]  (SHOTS_DIR로 저장 폴더 지정)
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));

const base = process.argv[2] || 'http://127.0.0.1:4410';
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, userAgent: UA, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(`${base}/beginner`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#beginner-results');
    const result = { width, errors, shots: {} };
    for (const id of ['basics', 'combat', 'content', 'equipment', 'consumables', 'ready']) {
      const dl = page.locator(`#${id} dl`).first();
      await dl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const box = await dl.evaluate(el => { const r = el.getBoundingClientRect(); return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height }; });
      const file = path.join(out, `${width}-cards-${id}.png`);
      await page.screenshot({ path: file, clip: { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: Math.min(width, box.width + 16), height: Math.min(box.height + 16, 2600) }, fullPage: true });
      result.shots[id] = file;
    }
    // 카드 안 설명(dd > p)과 팁이 몇 줄로 꺾이는지: 줄 높이로 나눈다. 세 줄 넘는 곳을 적는다.
    result.wrapped = await page.evaluate(() => {
      const rows = [];
      for (const card of document.querySelectorAll('dl > div[data-art]')) {
        for (const el of card.querySelectorAll('dd > p, dd > p + p')) {
          const lh = parseFloat(getComputedStyle(el).lineHeight);
          const lines = Math.round(el.getBoundingClientRect().height / lh);
          if (lines > 3) rows.push({ id: card.id, text: el.textContent.slice(0, 24), lines });
        }
        if (!card.querySelector('img, svg')) rows.push({ id: card.id, missingArt: true });
      }
      return rows;
    });
    result.overflow = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, vw: window.innerWidth }));
    result.pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    result.cards = await page.locator('dl > div[data-art]').count();
    result.textChars = await page.evaluate(() => [...document.querySelectorAll('#beginner-results section')].reduce((n, s) => n + s.innerText.replace(/\s+/g, '').length, 0));
    results.push(result);
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'cards-check.json'), JSON.stringify(results, null, 2));
  const problems = results.filter(r => r.errors.length || r.wrapped.length || r.overflow.scrollWidth > r.overflow.vw);
  console.log(JSON.stringify({ shots: out, problems: problems.length, results: results.map(r => ({ width: r.width, errors: r.errors, wrapped: r.wrapped, overflow: r.overflow, cards: r.cards, pageHeight: r.pageHeight, textChars: r.textChars })) }, null, 2));
  process.exitCode = problems.length ? 1 : 0;
})();
