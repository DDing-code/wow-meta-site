// 사격 개념서형 샘플 화면 확인: 320·390·1440px에서 가로 넘침, 부·장·상자 표시, 확인 문제 펼침을 검사하고 캡처한다.
// 사용: node artifacts/mm-concept-sample/shots.cjs http://127.0.0.1:4179
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));

const base = process.argv[2] || 'http://127.0.0.1:4179';
const out = __dirname;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, userAgent: UA });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(`${base}/guide/hunter/marksmanship`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-book-part]');
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      parts: [...document.querySelectorAll('[data-book-part]')].map(el => el.querySelector('h3')?.textContent),
      chapters: document.querySelectorAll('[id^="guide-section-"]').length,
      concept: document.querySelectorAll('[data-book-box="concept"]').length,
      example: document.querySelectorAll('[data-book-box="example"]').length,
      fieldTips: document.querySelectorAll('[data-book-box="field-tips"] li').length,
      mistakes: document.querySelectorAll('[data-book-box="mistakes"]').length,
      quiz: document.querySelectorAll('[data-book-box="quiz"] details').length,
      voices: document.querySelectorAll('#guide-voices article').length,
      tipLinksResolve: [...document.querySelectorAll('[data-book-box="field-tips"] a[href^="#guide-voice-"]')].every(a => document.querySelector(a.getAttribute('href'))),
      contents: document.querySelectorAll('nav[aria-label="세부 공략 목차"] li').length,
      heroTabs: document.querySelectorAll('[aria-label="영웅 특성 선택"] button').length,
      wideBoxes: [...document.querySelectorAll('[data-book-box], #guide-voices article, [data-book-part]')]
        .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1).length,
      // 스킬 구조 도식: 개수, 노드 수, 아이콘·툴팁 링크가 붙은 노드 수, 넘침 여부
      diagrams: document.querySelectorAll('[data-book-box="diagram"]').length,
      diagramNodes: document.querySelectorAll('[data-diagram-node]').length,
      diagramSkillLinks: document.querySelectorAll('[data-diagram-node] a[data-wowhead]').length,
      diagramIconsLoaded: [...document.querySelectorAll('[data-diagram-node] a[data-wowhead] img')].filter(img => img.complete && img.naturalWidth > 0).length,
      diagramWide: [...document.querySelectorAll('[data-book-box="diagram"], [data-diagram-node]')]
        .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1 || el.scrollWidth > el.clientWidth + 1).length,
      // 딜사이클 가로줄: 묶음·줄·스킬 링크 수, 넘침, PC에서 줄 하나가 한 줄(줄바꿈 없음)인 비율
      laneSets: document.querySelectorAll('[data-book-box="lanes"]').length,
      lanes: document.querySelectorAll('[data-lane]').length,
      laneSkillLinks: document.querySelectorAll('[data-lane-rail] a[data-wowhead]').length,
      laneWide: [...document.querySelectorAll('[data-book-box="lanes"], [data-lane], [data-lane-rail]')]
        .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1 || el.scrollWidth > el.clientWidth + 1).length,
      laneSingleLine: [...document.querySelectorAll('[data-lane-rail]')].filter(rail => {
        const items = [...rail.querySelectorAll(':scope > li')];
        return items.length && Math.max(...items.map(li => li.getBoundingClientRect().top)) - Math.min(...items.map(li => li.getBoundingClientRect().top)) < 4;
      }).length,
    }));
    // 확인 문제 하나를 펼쳐 답이 보이는지 확인
    const quiz = page.locator('[data-book-box="quiz"] details').first();
    await quiz.scrollIntoViewIfNeeded();
    await quiz.locator('summary').click();
    info.quizOpens = await quiz.evaluate(el => el.open && el.querySelector('p').getBoundingClientRect().height > 0);
    const shots = {};
    shots.contents = path.join(out, `mm-book-${width}-contents.png`);
    await page.locator('nav[aria-label="세부 공략 목차"]').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -60));
    await page.screenshot({ path: shots.contents });
    shots.chapter = path.join(out, `mm-book-${width}-chapter.png`);
    await page.locator('#guide-section-1').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelector('[data-book-part]').scrollIntoView());
    await page.screenshot({ path: shots.chapter });
    // 스킬 구조 도식: 1장(충전 허브)과 2장(정밀 사격, 노드 4개 층)을 캡처하고, 노드 아이콘에 마우스를 올려 툴팁 링크가 반응하는지 본다
    const diagrams = page.locator('[data-book-box="diagram"]');
    for (const [name, index] of [['diagram1', 0], ['diagram2', 1]]) {
      shots[name] = path.join(out, `mm-book-${width}-${name}.png`);
      const figure = diagrams.nth(index);
      await figure.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, -70));
      await figure.screenshot({ path: shots[name] });
    }
    const laneFigure = page.locator('[data-book-box="lanes"]').first();
    shots.lanes = path.join(out, `mm-book-${width}-lanes.png`);
    await laneFigure.scrollIntoViewIfNeeded();
    await laneFigure.screenshot({ path: shots.lanes });
    const firstIcon = diagrams.first().locator('[data-diagram-node] a[data-wowhead] img').first();
    await firstIcon.hover();
    info.diagramIconHoverColor = await firstIcon.evaluate(img => getComputedStyle(img.closest('a')).color);
    shots.quiz = path.join(out, `mm-book-${width}-quiz.png`);
    await quiz.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -200));
    await page.screenshot({ path: shots.quiz });
    shots.voices = path.join(out, `mm-book-${width}-voices.png`);
    await page.evaluate(() => document.querySelector('#guide-voices').scrollIntoView());
    await page.screenshot({ path: shots.voices });
    results.push({ width, ...info, errors, shots });
    await page.close();
  }
  // 다른 가이드는 기존 화면 그대로인지(개념서 요소 없음) 확인
  const other = await browser.newPage({ viewport: { width: 390, height: 860 }, userAgent: UA });
  await other.goto(`${base}/guide/hunter/beast-mastery`, { waitUntil: 'networkidle' });
  const otherInfo = await other.evaluate(() => ({
    bookParts: document.querySelectorAll('[data-book-part]').length,
    digest: !!document.querySelector('[aria-label="세부 공략 목차"]'),
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
  await browser.close();
  const report = { base, checkedAt: new Date().toISOString(), results, beastMastery390: otherInfo };
  fs.writeFileSync(path.join(out, 'ui-check.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
