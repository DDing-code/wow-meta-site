// 악마 흑마법사 시험판 화면 확인: 전체 화면(1440·390·320)과 장마다 캡처, 카드 그림 개수·넘침·깨진 아이콘·오류를 센다.
// 사용: node shots.cjs <origin>   결과: shots/*.png, shots/check.json
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const { loadRegistry } = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
const OUT = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const ID = process.argv[3] || 'warlock-demonology';

(async () => {
  const base = process.argv[2];
  fs.mkdirSync(OUT, { recursive: true });
  const spec = loadRegistry().find(s => s.id === ID);
  const browser = await chromium.launch();
  const results = [];
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, userAgent: UA, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}${spec.path}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-book-part]');
    await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
    await page.waitForTimeout(400);
    const r = { id: ID, width, errors, shots: [] };
    await page.screenshot({ path: path.join(OUT, `${ID}-${width}-full.png`), fullPage: true });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(OUT, `${ID}-${width}-top.png`) });
    r.pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    r.docOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    r.figures = await page.evaluate(() => {
      const count = sel => document.querySelectorAll(sel).length;
      return { skillGroups: count('[data-book-box="skill-groups"]'), diagram: count('[data-book-box="diagram"]'), timeline: count('[data-book-box="timeline"]'), cards: count('[data-book-box="cards"]') };
    });
    // 장마다: 그림 유무, 본문 글자 수, 넘침, 깨진 아이콘, 카드 줄이 세 줄 넘게 꺾이는지.
    r.chapters = await page.evaluate(() => {
      const rows = [];
      for (const section of document.querySelectorAll('[id^="guide-section-"]')) {
        const title = section.querySelector('h3')?.textContent?.trim() || '';
        const figures = section.querySelectorAll('[data-book-box="skill-groups"], [data-book-box="diagram"], [data-book-box="timeline"], [data-book-box="cards"]').length;
        const body = [...section.querySelectorAll('[data-book-body="text"] p')].reduce((n, p) => n + p.textContent.replace(/\s+/g, '').length, 0);
        const broken = [...section.querySelectorAll('img')].filter(i => i.complete && !i.naturalWidth).length;
        const overflow = [...section.querySelectorAll('*')].some(e => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX !== 'hidden' && e.getBoundingClientRect().right > window.innerWidth + 1);
        const wrapped = [];
        for (const li of section.querySelectorAll('[data-book-box="cards"] section > ul > li')) {
          const lh = parseFloat(getComputedStyle(li).lineHeight);
          const lines = Math.round(li.getBoundingClientRect().height / lh);
          if (lines > 3) wrapped.push({ text: li.textContent.slice(0, 20), lines });
        }
        rows.push({ id: section.id, title: title.slice(0, 24), figures, body, broken, overflow, wrapped });
      }
      return rows;
    });
    for (const section of r.chapters) {
      if (width === 320) continue;
      const el = page.locator(`#${section.id}`);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      const file = `${ID}-${width}-${section.id.replace('guide-section-', 'ch')}.png`;
      await el.screenshot({ path: path.join(OUT, file) }).catch(() => {});
      r.shots.push(file);
    }
    results.push(r);
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'check.json'), JSON.stringify(results, null, 2));
  const problems = results.filter(r => r.errors.length || r.docOverflow || r.chapters.some(c => !c.figures || c.broken || c.overflow || c.wrapped.length));
  console.log(JSON.stringify(results.map(r => ({ width: r.width, errors: r.errors, pageHeight: r.pageHeight, docOverflow: r.docOverflow, figures: r.figures, noFigure: r.chapters.filter(c => !c.figures).map(c => c.title), broken: r.chapters.filter(c => c.broken).map(c => c.title), overflow: r.chapters.filter(c => c.overflow).map(c => c.title), wrapped: r.chapters.flatMap(c => c.wrapped.map(w => ({ ...w, title: c.title }))), bodyChars: r.chapters.reduce((n, c) => n + c.body, 0) })), null, 2));
  console.log('problems', problems.length);
  process.exitCode = problems.length ? 1 : 0;
})();
