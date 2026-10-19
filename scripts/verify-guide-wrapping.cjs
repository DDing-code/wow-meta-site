// 빌드본/공개 화면의 조사·가운뎃점·제목·이름표 간격 회귀 검사.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:4410';
const out = path.resolve(process.env.WRAPPING_OUTPUT || 'artifacts/goal-12.1.5-r9/local');
const ids = ['evoker/augmentation', 'priest/holy', 'evoker/preservation', 'deathknight/blood', 'deathknight/frost', 'druid/guardian', 'demonhunter/vengeance', 'warrior/fury', 'rogue/assassination', 'shaman/enhancement', 'hunter/survival'];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const id of ids) for (const width of [320, 390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(`${origin}/guide/${id}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-timeline-node]');
      const info = await page.evaluate(() => {
        const charRect = (node, index) => {
          const r = document.createRange(); r.setStart(node, index); r.setEnd(node, index + 1);
          return r.getBoundingClientRect();
        };
        const lines = el => {
          const rows = [];
          const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          let t;
          while ((t = w.nextNode())) for (let i = 0; i < t.length; i++) {
            if (/[\s\u2060]/.test(t.data[i])) continue;
            const r = charRect(t, i); if (!r.height) continue;
            let row = rows.find(x => Math.abs(x.y - r.y) < 4);
            if (!row) rows.push(row = { y: r.y, chars: [] });
            row.chars.push({ text: t.data[i], x: r.x, right: r.right });
          }
          return rows.sort((a, b) => a.y - b.y).map(row => row.chars.sort((a, b) => a.x - b.x));
        };
        const captions = [...document.querySelectorAll('[data-timeline-node] > p, [data-timeline-above] small')];
        const dotStarts = captions.flatMap(el => lines(el).filter(row => row[0]?.text === '·').map(() => el.textContent));
        const wing = captions.find(el => /날개지도자.*로 당겨지면/.test(el.textContent));
        const wingLines = wing && lines(wing).map(row => row.map(c => c.text).join(''));
        const title = [...document.querySelectorAll('[data-book-box="diagram"] > strong')].find(el => el.textContent.includes('평온이 돌려주는'));
        const titleLines = title && lines(title).map(row => row.map(c => c.text).join(''));
        const a = captions.find(el => el.textContent === '지난 5초 피해 회복');
        const b = captions.find(el => el.textContent === '안전할 때 2초 시전');
        const gap = a && b ? Math.min(...lines(b).flat().map(c => c.x)) - Math.max(...lines(a).flat().map(c => c.right)) : null;
        return { overflow: document.documentElement.scrollWidth > innerWidth + 1, dotStarts, wingLines, titleLines, gap };
      });
      results.push({ id, width, ...info, errors });
      if (id === 'evoker/augmentation') {
        assert(info.wingLines?.length, '날개지도자 문구 누락');
        assert(info.wingLines.some(line => line.includes('자로')), `스킬·조사 분리: ${info.wingLines}`);
      }
      if (id === 'priest/holy') {
        assert(info.titleLines?.length, '신성 사제 흐름도 제목 누락');
        assert(info.titleLines.every(line => line.length > 1), `제목 한 글자 줄: ${info.titleLines}`);
      }
      if (id === 'evoker/preservation' && width === 1440) {
        assert(info.gap >= 16, `보존 이름표 간격 ${info.gap}px`);
      }
      assert(!info.overflow, `${id} ${width}px 넘침`);
      assert.deepEqual(info.dotStarts, [], `${id} ${width}px 가운뎃점 줄 시작`);
      assert.deepEqual(errors, []);
      if (ids.indexOf(id) < 3) {
        const target = id === 'priest/holy'
          ? page.locator('[data-book-box="diagram"]').filter({ hasText: '평온이 돌려주는' }).first()
          : page.locator('[data-book-box="timeline"]').filter({ hasText: id === 'evoker/augmentation' ? '날개지도자' : '지난 5초 피해 회복' }).first();
        const broken = await target.locator('img').evaluateAll(async images => {
          await Promise.all(images.map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); }));
          return images.filter(img => !img.naturalWidth).map(img => img.src);
        });
        assert.deepEqual(broken, [], `${id} 캡처 아이콘 로드`);
        const clip = await target.evaluate(el => {
          window.scrollTo(0, 0);
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        });
        await page.screenshot({ path: path.join(out, `${id.replace('/', '-')}-${width}.png`), fullPage: true, clip });
      }
      console.log(`통과 ${id} ${width}px`);
      await page.close();
    }
  } finally {
    fs.writeFileSync(path.join(out, 'wrapping-check.json'), JSON.stringify({ origin, checkedAt: new Date().toISOString(), results }, null, 2));
    await browser.close();
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
