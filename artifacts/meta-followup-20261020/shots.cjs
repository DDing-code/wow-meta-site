// 바뀐 딜사이클 화면 촬영·측정: patches/orig/<ID>.json(처음 정본)과 지금 KB 정본을 비교해
// 바뀐 개념서 타임라인과 바뀐 영웅 탭(오프닝·단일·광역·탱사이클)만 320·390·1440px로 찍는다.
// 측정: 문서 가로 넘침, 타임라인·탭 영역 넘침, 깨진 아이콘, 세 줄 이상으로 꺾인 캡션, 페이지 오류.
// 사용: node shots.cjs <origin> [가이드 ID...]   결과: shots/*.png, shots/check.json
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const {loadRegistry, kbGuidePath} = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
const OUT = path.join(__dirname, 'shots');
const ORIG_DIR = 'C:/wowmeta/site/artifacts/cycle-order-20261020/patches/orig';
const ORIG = ORIG_DIR;
const MODES = ['opener', 'singleTarget', 'aoe', 'tankRaid', 'tankMythic'];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

function changes(id) {
  const now = JSON.parse(fs.readFileSync(kbGuidePath(id).file, 'utf8'));
  const origFile = path.join(ORIG, id + '.json');
  const old = fs.existsSync(origFile) ? JSON.parse(fs.readFileSync(origFile, 'utf8')) : now;
  const tl = [];
  now.blocks.forEach((b, i) => [].concat(b.timeline || []).forEach((t, k) => {
    const o = [].concat(old.blocks[i]?.timeline || [])[k];
    if (JSON.stringify(o) !== JSON.stringify(t)) tl.push(t.title);
  }));
  const hero = [];
  now.heroBranches.forEach((h, i) => MODES.forEach(m => {
    if (h[m] && JSON.stringify(h[m]) !== JSON.stringify(old.heroBranches[i]?.[m])) hero.push([h.label, m]);
  }));
  return {tl, hero, now};
}

(async () => {
  const [base, ...only] = process.argv.slice(2);
  fs.mkdirSync(OUT, {recursive: true});
  const reg = loadRegistry();
  const ids = only.length ? only : fs.readdirSync(ORIG).map(f => f.replace(/\.json$/, ''));
  const browser = await chromium.launch();
  const results = [];
  for (const id of ids) {
    const spec = reg.find(s => s.id === id);
    const {tl, hero, now} = changes(id);
    if (!tl.length && !hero.length) { results.push({id, changed: false}); continue; }
    for (const width of [320, 390, 1440]) {
      const page = await browser.newPage({viewport: {width, height: width === 1440 ? 1000 : 860}, userAgent: UA});
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${base}${spec.path}`, {waitUntil: 'networkidle'});
      await page.waitForSelector('[data-book-part]');
      const r = {id, width, errors, timelines: [], modes: []};
      r.docOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      const boxes = await page.$$('[data-book-box="timeline"]');
      for (const box of boxes) {
        const title = (await box.$eval('strong', e => e.textContent.trim()).catch(() => ''));
        if (!tl.some(t => title.includes(t.slice(0, 12)))) continue;
        const m = await box.evaluate(el => {
          const caps = [...el.querySelectorAll('[data-timeline-node] p, [data-timeline-node] small')];
          const tall = caps.filter(p => { const lh = parseFloat(getComputedStyle(p).lineHeight) || 16; return p.getBoundingClientRect().height > lh * 2.6; }).map(p => p.textContent.trim());
          const rails = [...el.querySelectorAll('[role="list"]')].filter(x => x.scrollWidth > x.clientWidth + 1).length;
          return {overflow: el.scrollWidth > el.clientWidth + 1, railOverflow: rails, tallCaptions: tall,
            broken: [...el.querySelectorAll('img')].filter(i => i.complete && !i.naturalWidth).length, kind: el.querySelector('div')?.textContent?.slice(0, 20)};
        });
        const file = `${id}-${width}-tl${r.timelines.length + 1}.png`;
        await box.scrollIntoViewIfNeeded();
        await box.screenshot({path: path.join(OUT, file)}).catch(() => {});
        r.timelines.push({title, file, ...m});
      }
      for (const [label, mode] of hero) {
        const heroGroup = page.getByRole('group', {name: '영웅 특성 선택', exact: true});
        if (await heroGroup.count()) await heroGroup.getByRole('button', {name: label, exact: true}).first().click().catch(() => {});
        const branch = now.heroBranches.find(h => h.label === label);
        const tab = branch[mode]?.tabLabel || {opener: '오프닝', singleTarget: '단일', aoe: '광역', tankRaid: '레이드', tankMythic: '쐐기'}[mode];
        const wrap = page.locator('[data-guide-rotation-modes]').first();
        await wrap.getByRole('button', {name: tab, exact: true}).first().click();
        const region = page.locator(`[data-rotation-mode="${mode}"]`).first();
        await region.waitFor();
        const m = await wrap.evaluate(el => ({overflow: el.scrollWidth > el.clientWidth + 1,
          broken: [...el.querySelectorAll('img')].filter(i => i.complete && !i.naturalWidth).length,
          tabs: [...el.querySelectorAll('button')].map(b => ({t: b.textContent.trim(), h: Math.round(b.getBoundingClientRect().height)}))}));
        const file = `${id}-${width}-${label}-${mode}.png`.replace(/\s/g, '_');
        await wrap.scrollIntoViewIfNeeded();
        await wrap.screenshot({path: path.join(OUT, file)}).catch(() => {});
        r.modes.push({label, mode, file, ...m});
      }
      r.docOverflowAfter = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      results.push(r);
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'check.json'), JSON.stringify(results, null, 1));
  const bad = results.filter(r => r.errors?.length || r.docOverflow || r.docOverflowAfter || r.timelines?.some(t => t.overflow || t.railOverflow || t.broken) || r.modes?.some(m => m.overflow || m.broken));
  const tall = results.flatMap(r => (r.timelines || []).flatMap(t => t.tallCaptions.map(c => `${r.id}@${r.width}: ${c}`)));
  console.log(`가이드 ${ids.length}, 화면 ${results.filter(r => r.width).length}, 문제 ${bad.length}, 세 줄 넘는 캡션 ${tall.length}`);
  bad.forEach(b => console.log('문제', JSON.stringify({id: b.id, width: b.width, errors: b.errors, doc: b.docOverflow || b.docOverflowAfter, tl: b.timelines?.filter(t => t.overflow || t.railOverflow || t.broken).map(t => t.title), modes: b.modes?.filter(m => m.overflow || m.broken).map(m => m.mode)})));
  tall.slice(0, 40).forEach(t => console.log('캡션', t));
})().catch(e => { console.error(e); process.exitCode = 1; });
