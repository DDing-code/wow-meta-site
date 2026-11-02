// 홈 직업 심화편 줄(직업별 묶음)을 1440·1024·390·320에서 찍고 묶음 순서·가로 넘침·개수 표시·묶음 안 칸 폭을 센다.
// 사용: node shots.cjs [origin=http://127.0.0.1:3126]   (SHOTS_DIR=live 로 운영 주소 결과를 따로 저장)
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:3126';
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const width of [1440, 1024, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-shelf="advanced"] [data-class-group]');
    await page.waitForTimeout(800);
    await page.locator('[data-shelf="advanced"]').screenshot({ path: path.join(out, `home-${width}-collapsed.png`) });
    const measure = () => page.evaluate(() => {
      const shelf = document.querySelector('[data-shelf="advanced"]');
      const groups = [...shelf.querySelectorAll('[data-class-group]')];
      const widths = [...shelf.querySelectorAll('li')].map(li => Math.round(li.getBoundingClientRect().width));
      const titles = [...shelf.querySelectorAll('li a[href^="/guide/"]:not([aria-label$="읽기"])')]
        .map(a => a.getBoundingClientRect().height);
      return {
        bundle: [...document.scripts].map(s => s.src).find(src => /main\.[0-9a-f]+\.js/.test(src)),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        countText: (document.body.innerText.match(/\d+\s*편|모두 보기 \(/g) || []),
        groups: groups.map(g => `${g.dataset.classGroup}:${g.querySelectorAll('li').length}`),
        cardWidths: [...new Set(widths)],
        wrappedClassNames: groups.filter(g => g.querySelector('h3').getBoundingClientRect().height > 40).length,
        maxTitleHeight: Math.max(...titles),
      };
    });
    const collapsed = await measure();
    await page.locator('[data-shelf="advanced"] button[aria-expanded]').click();
    await page.waitForTimeout(600);
    const expanded = await measure();
    await page.locator('[data-shelf="advanced"]').screenshot({ path: path.join(out, `home-${width}-expanded.png`) });
    if (width === 1440 || width === 390) await page.screenshot({ path: path.join(out, `home-${width}-top.png`) });
    results.push({ width, collapsed, expanded, errors });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'check.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 1));
  const bad = results.filter(r => r.expanded.overflow > 0 || r.expanded.countText.length || r.errors.length
    || r.expanded.cardWidths.length !== 1 || r.expanded.wrappedClassNames);
  process.exit(bad.length ? 1 : 0);
})();
