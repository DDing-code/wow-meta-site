// 개념서 리빌딩 화면 검사: 지정한 가이드를 320·390·1440px에서 열어 넘침·목차·갈림길·0부 스킬 묶음·타임라인·흐름도를 세고 캡처한다.
// 사용: node artifacts/book-rebuild/shots.cjs http://127.0.0.1:4179 hunter-marksmanship hunter-beastmastery ...
// 결과: artifacts/book-rebuild/ui/<가이드 ID>-<폭>-<장면>.png, artifacts/book-rebuild/ui/ui-check.json
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const { loadRegistry } = require('./lib.cjs');

const [base = 'http://127.0.0.1:4179', ...ids] = process.argv.slice(2);
const out = path.join(__dirname, 'ui');
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
const registry = loadRegistry();

(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const id of ids) {
    const spec = registry.find(item => item.id === id);
    for (const width of [320, 390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, userAgent: UA });
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      await page.goto(`${base}${spec.path}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-book-part]');
      const info = await page.evaluate(() => {
        const wide = selector => [...document.querySelectorAll(selector)]
          .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1 || el.scrollWidth > el.clientWidth + 1).length;
        return {
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          parts: [...document.querySelectorAll('[data-book-part]')].map(el => `${el.querySelector('span')?.textContent} ${el.querySelector('h3')?.textContent}`),
          chapters: document.querySelectorAll('[id^="guide-section-"]').length,
          startLinks: [...document.querySelectorAll('[data-book-start-link]')].map(a => ({ key: a.dataset.bookStartLink, resolves: !!document.querySelector(a.getAttribute('href')) })),
          skillGroups: document.querySelectorAll('[data-skill-group]').length,
          skillGroupLinks: document.querySelectorAll('[data-skill-group] a[data-wowhead]').length,
          asides: document.querySelectorAll('[data-book-box="aside"]').length,
          diagrams: document.querySelectorAll('[data-book-box="diagram"]').length,
          timelines: document.querySelectorAll('[data-book-box="timeline"]').length,
          timelineNodes: document.querySelectorAll('[data-timeline-node]').length,
          timelineIconLinks: document.querySelectorAll('[data-book-box="timeline"] a[data-wowhead]').length,
          brokenIcons: [...document.querySelectorAll('[data-book-box] img')].filter(img => img.complete && img.naturalWidth === 0).length,
          quiz: document.querySelectorAll('[data-book-box="quiz"] details').length,
          appendixLinks: [...document.querySelectorAll('nav[aria-label="세부 공략 목차"] [aria-label="부록"] a')].map(a => a.textContent),
          heroQuickRef: document.querySelector('#guide-hero-branches strong')?.textContent || null,
          wideBoxes: wide('[data-book-box], [data-book-part], [data-book-start] a, [data-skill-group]'),
          wideTimeline: wide('[data-book-box="timeline"], [data-timeline-rail]'),
        };
      });
      const shots = {};
      const shoot = async (name, locator) => {
        shots[name] = path.join(out, `${id}-${width}-${name}.png`);
        await locator.scrollIntoViewIfNeeded();
        if (locator === page) await page.screenshot({ path: shots[name] });
        else await locator.screenshot({ path: shots[name] });
      };
      await page.evaluate(() => document.querySelector('[data-book-start]')?.scrollIntoView({ block: 'center' }));
      shots.top = path.join(out, `${id}-${width}-top.png`);
      await page.screenshot({ path: shots.top });
      await shoot('contents', page.locator('nav[aria-label="세부 공략 목차"]'));
      await shoot('skills', page.locator('[data-book-box="skill-groups"]').first());
      const timelines = page.locator('[data-book-box="timeline"]');
      const count = await timelines.count();
      for (let i = 0; i < Math.min(count, 3); i++) await shoot(`timeline${i + 1}`, timelines.nth(i));
      if (await page.locator('[data-book-box="diagram"]').count()) await shoot('diagram1', page.locator('[data-book-box="diagram"]').first());
      if (await page.locator('[data-book-box="aside"]').count()) await shoot('aside', page.locator('[data-book-box="aside"]').first());
      const quiz = page.locator('[data-book-box="quiz"] details').first();
      if (await quiz.count()) {
        await quiz.scrollIntoViewIfNeeded();
        await quiz.locator('summary').click();
        info.quizOpens = await quiz.evaluate(el => el.open && el.querySelector('p').getBoundingClientRect().height > 0);
      }
      results.push({ id, width, ...info, errors, shots });
      await page.close();
    }
  }
  await browser.close();
  const report = { base, checkedAt: new Date().toISOString(), results };
  fs.writeFileSync(path.join(out, 'ui-check.json'), JSON.stringify(report, null, 2));
  for (const r of results) {
    const bad = r.overflow || r.wideBoxes || r.wideTimeline || r.brokenIcons || r.errors.length || r.startLinks.some(l => !l.resolves);
    console.log(`${bad ? '문제' : '정상'} ${r.id} ${r.width}px · 부 ${r.parts.length} · 장 ${r.chapters} · 스킬 묶음 ${r.skillGroups} · 흐름도 ${r.diagrams} · 타임라인 ${r.timelines} · 넘침 ${r.overflow}/${r.wideBoxes}/${r.wideTimeline} · 깨진 아이콘 ${r.brokenIcons} · 오류 ${r.errors.length}`);
  }
})().catch(error => { console.error(error); process.exit(1); });
