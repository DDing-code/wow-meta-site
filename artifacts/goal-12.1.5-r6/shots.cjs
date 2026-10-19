// 6라운드 전수 화면 검사: 40개 가이드를 320·390·1440px로 열어 한 장(가이드×폭)씩 모음 캡처를 만들고,
// 페이지 전체에서 넘침·깨진 아이콘·겹침·빈칸·'보스' 문구를 센다.
// 모음 캡처 = 첫 화면, 목차, 0부 스킬 묶음, 첫 흐름도, 첫 타임라인, '네임드' 문구가 있는 곳(없으면 첫 보조 상자).
// 사용: node artifacts/goal-12.1.5-r6/shots.cjs <origin> [가이드 ID...]   결과: shots/<가이드 ID>-<폭>.png, ui-check.json
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const { loadRegistry } = require('../book-rebuild/lib.cjs');

const [base = 'http://127.0.0.1:4410', ...only] = process.argv.slice(2);
// SHOTS_DIR=final 처럼 주면 그 폴더에 캡처와 ui-check.json을 둔다.
const out = process.env.SHOTS_DIR ? path.resolve(__dirname, process.env.SHOTS_DIR) : path.join(__dirname, 'shots');
const checkFile = process.env.SHOTS_DIR ? path.join(out, process.env.SHOTS_CHECK || 'ui-check.json') : path.join(__dirname, 'ui-check.json');
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const registry = loadRegistry();
const ids = only.length ? only : registry.map(item => item.id);

async function sheet(browser, slices, width) {
  const cols = width === 1440 ? 2 : 6;
  const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
  const cells = slices.map(s => `<figure><figcaption>${s.name}</figcaption><img src="data:image/png;base64,${s.buf.toString('base64')}"></figure>`).join('');
  await page.setContent(`<style>body{margin:0;background:#111;color:#ff0;font:bold 16px sans-serif}
    main{display:grid;grid-template-columns:repeat(${cols},${width}px);gap:12px;padding:12px;width:max-content}
    figure{margin:0}figcaption{padding:2px 0}img{display:block;outline:2px solid #f0f}</style><main>${cells}</main>`);
  const buf = await page.locator('main').screenshot();
  await page.close();
  return buf;
}

(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const id of ids) {
    const spec = registry.find(item => item.id === id);
    for (const width of [320, 390, 1440]) {
      const height = width === 1440 ? 1000 : 860;
      const page = await browser.newPage({ viewport: { width, height }, userAgent: UA });
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      await page.goto(`${base}${spec.path}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-book-part]');
      // 지연 로드 이미지를 모두 받도록 끝까지 한 번 내린다.
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 1500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } window.scrollTo(0, 0); });
      await page.waitForLoadState('networkidle');
      const info = await page.evaluate(() => {
        const vw = window.innerWidth;
        const rect = el => el.getBoundingClientRect();
        const wide = [...document.querySelectorAll('main *, [data-book-box], [data-book-part]')]
          .filter(el => { const r = rect(el); return r.width > 0 && (r.right > vw + 1 || r.left < -1) && getComputedStyle(el).position !== 'fixed'; })
          .filter(el => !el.closest('[aria-hidden="true"], .sr-only'))
          // 가로 스크롤 영역(모바일 장 이동 막대 등) 안에서 잘려 보이는 것은 의도된 배치라 뺀다.
          .filter(el => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(p).overflowX)) return p.getBoundingClientRect().right > vw + 1; } return true; })
          .map(el => `${el.tagName.toLowerCase()}${el.dataset.bookBox ? `[${el.dataset.bookBox}]` : ''} ${el.textContent.trim().slice(0, 30)}`);
        const broken = [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.getAttribute('src'));
        const notLoaded = [...document.images].filter(img => !img.complete).length;
        // 겹침: 타임라인 아이콘끼리, 흐름도 노드끼리, 스킬 묶음 링크끼리 서로 가리는지.
        const overlapIn = selector => {
          const hits = [];
          for (const box of document.querySelectorAll(selector.box)) {
            const items = [...box.querySelectorAll(selector.item)].map(el => ({ el, r: rect(el) })).filter(x => x.r.width && x.r.height);
            for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
              const a = items[i].r, b = items[j].r;
              if (items[i].el.contains(items[j].el) || items[j].el.contains(items[i].el)) continue;
              const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
              const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
              if (w > 2 && h > 2) hits.push(`${items[i].el.textContent.trim().slice(0, 12)} ↔ ${items[j].el.textContent.trim().slice(0, 12)}`);
            }
          }
          return hits;
        };
        const overlaps = [
          ...overlapIn({ box: '[data-book-box="timeline"]', item: '[data-timeline-node]' }),
          // 타임라인 글자끼리(윗행 설명 ↔ 아랫행 위쪽 가지 조건 글)
          ...overlapIn({ box: '[data-book-box="timeline"] ol', item: '[data-timeline-node] > p, [data-timeline-above] small' }),
          // 타임라인 글 안쪽 조각(이름표·조사)이 자기 칸 밖으로 나가 옆 칸 글에 닿는지(글 상자끼리 비교로는 안 잡힘)
          ...[...document.querySelectorAll('[data-timeline-node]')].flatMap(node => {
            const cell = rect(node);
            return [...node.querySelectorAll(':scope > p, [data-timeline-above] small')].flatMap(el => {
              const range = document.createRange(); range.selectNodeContents(el);
              return [...range.getClientRects()].filter(r => r.width && (r.left < cell.left - 2 || r.right > cell.right + 2))
                .map(() => `칸 밖 글: ${el.textContent.trim().slice(0, 16)}`);
            }).slice(0, 1);
          }),
          ...overlapIn({ box: '[data-book-box="diagram"]', item: 'a[data-wowhead]' }),
          ...overlapIn({ box: '[data-skill-group]', item: 'a[data-wowhead]' }),
        ];
        // 빈칸: 글자도 그림도 없는 상자·장·목차 항목, 이름이 빈 스킬 링크.
        const empty = [
          ...[...document.querySelectorAll('[data-book-box], [id^="guide-section-"], [data-skill-group], [data-timeline-node]')]
            .filter(el => el.innerText.trim().length < 2 && !el.querySelector('img'))
            .map(el => el.dataset.bookBox || el.id || 'node'),
          ...[...document.querySelectorAll('nav[aria-label="세부 공략 목차"] a')].filter(a => a.textContent.trim().length < 2).map(a => `toc ${a.getAttribute('href')}`),
          ...[...document.querySelectorAll('main a[data-wowhead]')].filter(a => !a.textContent.trim() && !a.querySelector('img, image, svg')).map(a => `link ${a.dataset.wowhead}`),
        ];
        // 상자 제목(머리줄 첫 칸)이 좁아져 여러 줄로 꺾였는지.
        // 짧은 이름표(상자 제목·목차의 부 번호·첫 화면 '가이드 목록')가 두 줄 이상으로 꺾였는지.
        const squeezed = [...document.querySelectorAll('[data-book-box] > div:first-child > :first-child, nav[aria-label="세부 공략 목차"] section > a > span, a[href="/guide"]')]
          .filter(el => el.tagName !== 'A' || el.textContent.includes('목록'))
          .filter(el => { const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.4; return el.textContent.trim() && rect(el).height > lh * 1.6; })
          .map(el => el.textContent.trim().slice(0, 12));
        // 아이콘·이름 갈라짐: 타임라인 글 안 스킬 이름표의 아이콘과 이름 첫 글자가 다른 줄에 놓였는지(8라운드 추가).
        const splitIcons = [...document.querySelectorAll('[data-timeline-node] a[data-wowhead]')].filter(a => {
          const ic = a.querySelector('img, :scope > span'); if (!ic || a.closest('[data-timeline-icon]')) return false;
          const walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT); let t; while ((t = walker.nextNode()) && !t.textContent.trim()) {}
          if (!t) return false; const i0 = t.textContent.search(/\S/); const rg = document.createRange(); rg.setStart(t, i0); rg.setEnd(t, i0 + 1);
          const cr = rg.getBoundingClientRect(), ir = ic.getBoundingClientRect();
          return cr.height > 0 && Math.abs((cr.top + cr.bottom) / 2 - (ir.top + ir.bottom) / 2) > 8;
        }).map(a => a.textContent.trim().slice(0, 16));
        const text = document.querySelector('main')?.innerText || document.body.innerText;
        const boss = [];
        let i = -1;
        while ((i = text.indexOf('보스', i + 1)) >= 0) boss.push(text.slice(Math.max(0, i - 25), i + 15).replace(/\s+/g, ' '));
        return {
          overflow: document.documentElement.scrollWidth > vw + 1,
          wide: wide.slice(0, 5), wideCount: wide.length,
          broken, notLoaded, overlaps: overlaps.slice(0, 5), overlapCount: overlaps.length, empty, squeezed, splitIcons,
          boss, named: (text.match(/네임드/g) || []).length,
          chapters: document.querySelectorAll('[id^="guide-section-"]').length,
          timelines: document.querySelectorAll('[data-book-box="timeline"]').length,
          diagrams: document.querySelectorAll('[data-book-box="diagram"]').length,
          pageHeight: document.documentElement.scrollHeight,
        };
      });
      // 모음 캡처 조각: 화면 좌표가 아닌 문서 좌표로 잘라 길이를 제한한다.
      const cap = width === 1440 ? 1000 : 1300;
      const slices = [];
      const grab = async (name, locator) => {
        if (!(await locator.count())) return;
        const el = locator.first();
        // 고정 머리말이 조각마다 겹쳐 찍히지 않도록 맨 위에 둔 채 문서 좌표로 자른다(그림은 앞에서 이미 모두 받음).
        const box = await el.evaluate(node => { window.scrollTo(0, 0); const r = node.getBoundingClientRect(); return { y: r.top + window.scrollY, h: r.height }; });
        await page.waitForTimeout(60);
        if (!box.h) return;
        const buf = await page.screenshot({ fullPage: true, clip: { x: 0, y: Math.max(0, box.y - 8), width, height: Math.min(box.h + 16, cap) } });
        slices.push({ name, buf });
      };
      await page.evaluate(() => window.scrollTo(0, 0));
      slices.push({ name: '첫 화면', buf: await page.screenshot() });
      await grab('목차', page.locator('nav[aria-label="세부 공략 목차"]'));
      await grab('0부 스킬', page.locator('[data-book-box="skill-groups"]'));
      await grab('흐름도', page.locator('[data-book-box="diagram"]'));
      await grab('타임라인', page.locator('[data-book-box="timeline"]'));
      const namedEl = page.locator('[id^="guide-section-"] p, [id^="guide-section-"] li').filter({ hasText: '네임드' });
      if (await namedEl.count()) await grab('네임드 문구', namedEl);
      else await grab('보조 상자', page.locator('[data-book-box="aside"]'));
      const file = path.join(out, `${id}-${width}.png`);
      fs.writeFileSync(file, await sheet(browser, slices, width));
      results.push({ id, width, file: path.relative(path.resolve(__dirname, '../..'), file), slices: slices.map(s => s.name), ...info, errors });
      const r = results[results.length - 1];
      const bad = r.overflow || r.wideCount || r.broken.length || r.overlapCount || r.empty.length || r.squeezed.length || r.splitIcons.length || r.boss.length || r.errors.length;
      console.log(`${bad ? '문제' : '정상'} ${id} ${width}px · 장 ${r.chapters} · 넘침 ${r.overflow}/${r.wideCount} · 깨진 그림 ${r.broken.length} · 겹침 ${r.overlapCount} · 빈칸 ${r.empty.length} · 꺾인 제목 ${r.squeezed.length} · 아이콘 갈라짐 ${r.splitIcons.length} · 보스 ${r.boss.length} · 네임드 ${r.named} · 오류 ${r.errors.length}`);
      await page.close();
    }
  }
  await browser.close();
  const prev = fs.existsSync(checkFile) && only.length ? JSON.parse(fs.readFileSync(checkFile, 'utf8')).results : [];
  const merged = [...prev.filter(p => !results.some(r => r.id === p.id && r.width === p.width)), ...results];
  fs.writeFileSync(checkFile, JSON.stringify({ base, checkedAt: new Date().toISOString(), results: merged }, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
