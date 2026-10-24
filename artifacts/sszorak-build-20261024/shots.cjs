// 단일 딜사이클 스조라크 빌드 기준 화면 촬영·측정(2026-10-24 2차)
//   - 처음 열리는 영웅 탭이 기준 영웅 특성인지, 그 탭의 오프닝·단일 화면, 단일 견본 링크
//   - 바뀐 2부 단일·오프닝 타임라인(반복 횟수 ×n 배지가 칸 밖으로 잘리지 않는지)
//   - 특성 견본 칸(1440만)
// 측정: 문서 가로 넘침, 타임라인·탭 넘침, 깨진 아이콘, 배지 잘림, 페이지 오류
// 사용: node shots.cjs <origin> [가이드 ID...]   결과: shots/*.png, shots/check.json
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const {loadRegistry, kbGuidePath} = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
const dominant = require('./dominant.json');
const OUT = path.join(__dirname, 'shots');
const ORIG = path.join(__dirname, 'patches', 'orig');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

function changedTimelines(id) {
  const now = JSON.parse(fs.readFileSync(kbGuidePath(id).file, 'utf8'));
  const old = JSON.parse(fs.readFileSync(path.join(ORIG, id + '.json'), 'utf8'));
  const tl = [];
  now.blocks.forEach((b, i) => [].concat(b.timeline || []).forEach((t, k) => {
    if (JSON.stringify([].concat(old.blocks[i]?.timeline || [])[k]) !== JSON.stringify(t)) tl.push(t.title);
  }));
  return {tl, now};
}

(async () => {
  const [base, ...only] = process.argv.slice(2);
  fs.mkdirSync(OUT, {recursive: true});
  const reg = loadRegistry();
  const ids = only.length ? only : dominant.map(d => d.id);
  const browser = await chromium.launch();
  const results = [];
  for (const id of ids) {
    const spec = reg.find(s => s.id === id);
    const dom = dominant.find(d => d.id === id);
    const {tl, now} = changedTimelines(id);
    for (const width of [320, 390, 1440]) {
      const page = await browser.newPage({viewport: {width, height: width === 1440 ? 1000 : 860}, userAgent: UA});
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${base}${spec.path}`, {waitUntil: 'networkidle'});
      await page.waitForSelector('[data-book-part]');
      const r = {id, width, errors, timelines: [], modes: []};
      r.docOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      // 처음 열리는 영웅 탭
      r.activeHero = await page.evaluate(() => {
        const g = [...document.querySelectorAll('[role="group"]')].find(x => x.getAttribute('aria-label') === '영웅 특성 선택');
        return g ? [...g.querySelectorAll('button')].find(b => b.getAttribute('aria-pressed') === 'true')?.textContent.trim() : null;
      });
      r.heroOk = !!r.activeHero && r.activeHero.includes(dom.hero);
      for (const box of await page.$$('[data-book-box="timeline"]')) {
        const title = (await box.$eval('strong', e => e.textContent.trim()).catch(() => ''));
        if (!tl.some(t => title.includes(t.slice(0, 12)))) continue;
        const m = await box.evaluate(el => {
          const box = el.getBoundingClientRect();
          const badges = [...el.querySelectorAll('[data-timeline-count]')];
          const clipped = badges.filter(b => { const x = b.getBoundingClientRect(); return x.right > box.right + 1 || x.left < box.left - 1; }).map(b => b.textContent);
          const rails = [...el.querySelectorAll('[role="list"]')].filter(x => x.scrollWidth > x.clientWidth + 1).length;
          return {overflow: el.scrollWidth > el.clientWidth + 1, railOverflow: rails, badges: badges.map(b => b.textContent), clipped,
            broken: [...el.querySelectorAll('img')].filter(i => i.complete && !i.naturalWidth).length};
        });
        const file = `${id}-${width}-tl${r.timelines.length + 1}.png`;
        await box.scrollIntoViewIfNeeded();
        await box.screenshot({path: path.join(OUT, file)}).catch(() => {});
        r.timelines.push({title, file, ...m});
      }
      // 기준 영웅 탭의 오프닝·단일(처음 열린 탭 그대로)
      const wrap = page.locator('[data-guide-rotation-modes]').first();
      if (await wrap.count()) {
        for (const [mode, tab] of [['opener', '오프닝'], ['singleTarget', '단일']]) {
          const branch = now.heroBranches.find(h => h.label === dom.hero);
          await wrap.getByRole('button', {name: branch[mode]?.tabLabel || tab, exact: true}).first().click();
          const region = page.locator(`[data-rotation-mode="${mode}"]`).first();
          await region.waitFor();
          const m = await wrap.evaluate(el => ({overflow: el.scrollWidth > el.clientWidth + 1,
            broken: [...el.querySelectorAll('img')].filter(i => i.complete && !i.naturalWidth).length,
            counts: [...el.querySelectorAll('[data-step-count]')].map(b => b.textContent),
            talentLink: el.querySelector('[data-rotation-talent]')?.textContent.trim() || null}));
          const file = `${id}-${width}-${mode}.png`;
          await wrap.scrollIntoViewIfNeeded();
          await wrap.screenshot({path: path.join(OUT, file)}).catch(() => {});
          r.modes.push({mode, file, ...m});
        }
      }
      if (width === 1440) {
        const talents = page.locator('#guide-talents').first();
        if (await talents.count()) { await talents.scrollIntoViewIfNeeded(); await talents.screenshot({path: path.join(OUT, `${id}-1440-talents.png`)}).catch(() => {}); r.talents = `${id}-1440-talents.png`; }
      }
      r.docOverflowAfter = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      results.push(r);
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'check.json'), JSON.stringify(results, null, 1));
  const bad = results.filter(r => r.errors.length || !r.heroOk || r.docOverflow || r.docOverflowAfter || r.timelines.some(t => t.overflow || t.railOverflow || t.broken || t.clipped.length) || r.modes.some(m => m.overflow || m.broken || (m.mode === 'singleTarget' && !m.talentLink)));
  console.log(`가이드 ${ids.length}, 화면 ${results.length}, 문제 ${bad.length}, 배지 ${results.reduce((n, r) => n + r.timelines.reduce((k, t) => k + t.badges.length, 0) + r.modes.reduce((k, m) => k + m.counts.length, 0), 0)}`);
  bad.forEach(b => console.log('문제', JSON.stringify({id: b.id, width: b.width, errors: b.errors, hero: b.activeHero, doc: b.docOverflow || b.docOverflowAfter, tl: b.timelines.filter(t => t.overflow || t.railOverflow || t.broken || t.clipped.length).map(t => t.title + ' ' + t.clipped.join(',')), modes: b.modes.filter(m => m.overflow || m.broken || !m.talentLink).map(m => m.mode)})));
})().catch(e => { console.error(e); process.exitCode = 1; });
