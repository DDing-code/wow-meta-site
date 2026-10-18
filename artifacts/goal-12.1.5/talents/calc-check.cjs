// 한국어 Wowhead 특성 계산기(https://www.wowhead.com/ko/talent-calc/blizzard/<code>)를 Playwright(일반 Chrome UA)로 열어
// 트리별 포인트 표시, 선택 노드의 선택 가능 여부(data-available), 부모 연결(선택된 노드로 들어오는 연결이 하나라도 선택 노드에서 오는지)을 확인한다.
// 이전 calculator-audit.json 방식과 같은 항목. 사용: node calc-check.cjs <out.json> <code> [<code>...]
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {chromium} = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const [outFile, ...codes] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({headless: true});
  const results = [];
  try {
    const ctx = await browser.newContext({userAgent: UA, locale: 'ko-KR', viewport: {width: 1600, height: 1200}});
    for (const code of codes) {
      const page = await ctx.newPage();
      const url = 'https://www.wowhead.com/ko/talent-calc/blizzard/' + code;
      try {
        await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 90000});
        await page.waitForSelector('.dragonflight-talent-trees-tree-subtitle-line', {timeout: 60000});
        await page.waitForTimeout(3000);
        const r = await page.evaluate(() => {
          const headers = [...document.querySelectorAll('.dragonflight-talent-trees-tree')].map(t => ({
            type: t.getAttribute('data-tree-type'), id: t.getAttribute('data-tree'),
            title: t.querySelector('.dragonflight-talent-trees-tree-title-name')?.innerText.trim(),
            points: t.querySelector('.dragonflight-talent-trees-tree-subtitle-line')?.innerText.replace(/\s+/g, ' ').trim()
          }));
          const grids = [...document.querySelectorAll('.dragonflight-talent-tree')].map(tree => {
            const grid = tree.querySelector('.dragonflight-talent-tree-grid');
            const nodes = new Map();
            for (const a of tree.querySelectorAll('a.dragonflight-talent-tree-talent')) {
              const cell = a.getAttribute('data-cell');
              const pts = tree.querySelector(`.dragonflight-talent-tree-talent-points[data-cell="${cell}"]`);
              const points = Number(pts?.getAttribute('data-points') || 0);
              const full = a.getAttribute('data-full') === '1';
              nodes.set(cell, {cell, name: a.getAttribute('aria-label'), spell: Number((a.getAttribute('href') || '').match(/spell=(\d+)/)?.[1] || 0), points, full, available: a.getAttribute('data-available') === '1', row: Number(a.getAttribute('data-row'))});
            }
            const incoming = new Map();
            for (const c of tree.querySelectorAll('.dragonflight-talent-tree-connection')) {
              const to = c.getAttribute('data-to-cell'), from = c.getAttribute('data-from-cell');
              if (!incoming.has(to)) incoming.set(to, []);
              incoming.get(to).push(from);
            }
            const sel = [...nodes.values()].filter(n => n.points > 0 || n.full);
            const isSel = cell => { const n = nodes.get(cell); return n && (n.points > 0 || n.full); };
            const orphaned = sel.filter(n => incoming.has(n.cell) && !incoming.get(n.cell).some(isSel));
            const unavailable = sel.filter(n => !n.available);
            return {title: tree.querySelector('.dragonflight-talent-tree-space-title')?.innerText.trim() || null, fullySpent: grid?.getAttribute('data-fully-spent'), selectedCount: sel.length, selected: sel.map(n => ({name: n.name, spell: n.spell, points: n.points, full: n.full})), purchased: sel.reduce((s, n) => s + n.points, 0), orphaned, unavailable};
          });
          return {title: document.title, finalUrl: location.href, env: document.querySelector('.header-env-selector-active, [data-env].active')?.innerText || null, headers, grids};
        });
        const pts = r.headers.map(h => Number((h.points || '').match(/(\d+)\s*\/\s*(\d+)/)?.[1]));
        const max = r.headers.map(h => Number((h.points || '').match(/(\d+)\s*\/\s*(\d+)/)?.[2]));
        const hero = r.grids.find(g => g.title)?.title || null;
        const byType = Object.fromEntries(r.headers.map((h, i) => [h.type, {points: pts[i], max: max[i]}]));
        const ok = byType.class?.points === byType.class?.max && byType.spec?.points === byType.spec?.max && byType.hero?.points === byType.hero?.max && r.grids.every(g => !g.orphaned.length && !g.unavailable.length);
        results.push({code, url, finalUrl: r.finalUrl, title: r.title, hero, points: [byType.class?.points, byType.spec?.points, byType.hero?.points], max: [byType.class?.max, byType.spec?.max, byType.hero?.max], headers: r.headers, grids: r.grids.map(g => ({title: g.title, fullySpent: g.fullySpent, selectedCount: g.selectedCount, selected: g.selected, orphaned: g.orphaned, unavailable: g.unavailable})), ok, sha256: crypto.createHash('sha256').update(code).digest('hex'), checkedAt: new Date().toISOString()});
        console.log(`${ok ? 'OK ' : 'BAD'} ${hero} ${JSON.stringify(byType)} orphan ${r.grids.map(g => g.orphaned.map(o => o.name).join('/')).join('|')} unavail ${r.grids.map(g => g.unavailable.map(o => o.name).join('/')).join('|')} ${code.slice(0, 40)}…`);
      } catch (e) {
        results.push({code, url, error: e.message});
        console.log('ERR', code.slice(0, 40), e.message);
      } finally { await page.close(); }
    }
  } finally { await browser.close(); }
  let prev = [];
  if (fs.existsSync(outFile)) prev = JSON.parse(fs.readFileSync(outFile, 'utf8'));
  const merged = [...prev.filter(p => !results.some(r => r.code === p.code)), ...results];
  fs.writeFileSync(outFile, JSON.stringify(merged, null, 2) + '\n');
})().catch(e => { console.error(e); process.exitCode = 1; });
