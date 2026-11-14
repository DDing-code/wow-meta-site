// 포에버 안내와 리테일/포에버 토글 화면 확인. 폭마다 가로 넘침·콘솔 오류·토글 이동을 검사하고 캡처한다.
// 사용: node artifacts/forever-20261114/shots.cjs [origin=http://127.0.0.1:4517]   (SHOTS_DIR=live 로 운영 결과를 따로 저장)
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));

const base = process.argv[2] || 'http://127.0.0.1:4517';
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
const PAGES = [['home', '/forever'], ['start', '/forever/start'], ['rules', '/forever/rules'], ['leveling', '/forever/leveling'], ['growth', '/forever/growth'], ['classes', '/forever/classes'], ['races', '/forever/races'], ['raids', '/forever/raids']];
const WIDTHS = [1440, 1041, 901, 900, 768, 390, 320];
// 리테일 메뉴(일곱 칸)가 토글과 함께 한 줄에 들어가는지 볼 폭.
const RETAIL_WIDTHS = [1440, 1280, 1161, 1160, 1041, 1040, 960, 901, 900, 781, 390, 320];

(async () => {
  const browser = await chromium.launch();
  const result = { base, pages: [], nav: [], toggle: [] };
  const errors = [];

  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, userAgent: UA });
    const page = await context.newPage();
    page.on('console', message => { if (message.type() === 'error') errors.push(`${width} ${message.text()}`); });
    page.on('pageerror', error => errors.push(`${width} ${error.message}`));
    for (const [id, route] of PAGES) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.waitForSelector(`[data-forever-section="${id}"] h1`);
      const info = await page.evaluate(() => ({
        title: document.title,
        h1: document.querySelector('h1').textContent,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        canonical: document.querySelector('link[rel="canonical"]').href,
        robots: document.querySelector('meta[name="robots"]').content,
        navHeight: document.querySelector('nav').getBoundingClientRect().height,
        activeEdition: document.querySelector('[aria-label="게임 버전"] [aria-current="true"]').textContent,
      }));
      assert.strictEqual(info.overflow, 0, `${width}px ${route}: 가로 넘침 ${info.overflow}px`);
      assert.strictEqual(info.activeEdition, '포에버');
      assert.ok(info.title.includes('포에버'), `${route} 제목`);
      assert.ok(info.canonical.endsWith(route), `${route} 대표 주소`);
      assert.strictEqual(info.robots, 'index, follow');
      assert.ok(info.navHeight <= 60, `${width}px ${route}: 상단 메뉴 높이 ${info.navHeight}`);
      result.pages.push({ width, route, ...info });
      if ([1440, 768, 390, 320].includes(width)) await page.screenshot({ path: path.join(out, `${id}-${width}.png`), fullPage: true });
      if (['leveling', 'growth', 'classes', 'races', 'raids'].includes(id) && [1440, 390, 320].includes(width)) {
        const broken = await page.$$eval('img', images => images.filter(img => img.complete && !img.naturalWidth).map(img => img.src));
        assert.deepStrictEqual(broken, [], `${route}: 그림 누락`);
        for (const section of await page.locator('[data-forever-section] > section[id]').all()) {
          await section.scrollIntoViewIfNeeded();
          const sectionId = await section.getAttribute('id');
          await page.screenshot({ path: path.join(out, `${id}-${width}-${sectionId}.png`) });
        }
      }
    }
    await context.close();
  }

  // 리테일 화면: 토글이 들어가도 메뉴가 넘치거나 두 줄이 되지 않는다.
  for (const width of RETAIL_WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: 700 }, userAgent: UA });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`retail ${width} ${error.message}`));
    await page.goto(base + '/guide', { waitUntil: 'networkidle' });
    await page.waitForSelector('nav [aria-label="게임 버전"]');
    const info = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const inner = nav.firstElementChild;
      const toggle = nav.querySelector('[aria-label="게임 버전"]').getBoundingClientRect();
      const links = document.querySelector('#primary-navigation');
      const linkRects = getComputedStyle(links).display === 'none' ? [] : [...links.querySelectorAll('a')].map(a => a.getBoundingClientRect());
      const menuButton = nav.querySelector('button[aria-label="메뉴"]');
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        navHeight: nav.getBoundingClientRect().height,
        innerOverflow: inner.scrollWidth - inner.clientWidth,
        toggleLeft: toggle.left,
        toggleRight: toggle.right,
        firstLinkLeft: linkRects.length ? linkRects[0].left : null,
        lastLinkRight: linkRects.length ? linkRects[linkRects.length - 1].right : null,
        linkRows: new Set(linkRects.map(rect => Math.round(rect.top))).size,
        menuButton: getComputedStyle(menuButton).display !== 'none',
        active: nav.querySelector('[aria-current="true"]').textContent,
      };
    });
    assert.strictEqual(info.overflow, 0, `리테일 ${width}px: 가로 넘침`);
    assert.strictEqual(info.innerOverflow, 0, `리테일 ${width}px: 상단 메뉴 안쪽 넘침 ${info.innerOverflow}`);
    assert.ok(info.navHeight <= 60, `리테일 ${width}px: 상단 메뉴 높이 ${info.navHeight}`);
    assert.strictEqual(info.active, '리테일');
    if (!info.menuButton) {
      assert.strictEqual(info.linkRows, 1, `리테일 ${width}px: 메뉴가 ${info.linkRows}줄`);
      assert.ok(info.firstLinkLeft >= info.toggleRight + 8, `리테일 ${width}px: 토글과 메뉴가 붙음`);
      assert.ok(info.lastLinkRight <= width, `리테일 ${width}px: 메뉴가 화면 밖`);
    }
    result.nav.push({ width, ...info });
    await page.screenshot({ path: path.join(out, `retail-nav-${width}.png`), clip: { x: 0, y: 0, width, height: 120 } });
    await context.close();
  }

  // 토글 이동: 짝이 있으면 짝 페이지로, 없으면 그 버전의 홈으로.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`toggle ${error.message}`));
  for (const [from, target, to] of [
    ['/', '포에버', '/forever'],
    ['/beginner', '포에버', '/forever/start'],
    ['/guide/hunter/marksmanship', '포에버', '/forever'],
    ['/raid', '포에버', '/forever'],
    ['/forever', '리테일', '/'],
    ['/forever/start', '리테일', '/beginner'],
    ['/forever/rules', '리테일', '/'],
  ]) {
    await page.goto(base + from, { waitUntil: 'networkidle' });
    await page.click(`nav [aria-label="게임 버전"] a:has-text("${target}")`);
    await page.waitForFunction(expected => window.location.pathname === expected, to);
    const active = await page.textContent('nav [aria-label="게임 버전"] [aria-current="true"]');
    assert.strictEqual(active, target);
    result.toggle.push({ from, target, to });
  }

  // 포에버 화면에는 포에버 메뉴만 보이고, 없는 포에버 주소는 포에버 홈으로 간다.
  await page.goto(base + '/forever', { waitUntil: 'networkidle' });
  assert.deepStrictEqual(await page.$$eval('#primary-navigation a', links => links.map(a => a.textContent)), ['포에버 홈', '시작하기', '규칙·진영', '직업 가이드', '레벨링 가이드', '지역·던전', '캠핑·유산', '레이드 준비']);
  await page.goto(base + '/forever/unknown', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.location.pathname === '/forever');

  // 단계 띠를 누르면 그 단계로 내려간다.
  await page.goto(base + '/forever/start', { waitUntil: 'networkidle' });
  await page.click('ol[aria-label="시작 여섯 단계"] a[href="#step-4"]');
  await page.waitForTimeout(900);
  const stepTop = await page.evaluate(() => document.querySelector('#step-4').getBoundingClientRect().top);
  assert.ok(stepTop >= 55 && stepTop < 200, `4단계 위치 ${stepTop}`);

  // 포에버 홈 '사전 설정 비교' 링크는 시작하기 3단계로 간다.
  await page.goto(base + '/forever', { waitUntil: 'networkidle' });
  await page.click('a[href="/forever/start#step-3"]');
  await page.waitForFunction(() => window.location.pathname === '/forever/start' && window.location.hash === '#step-3');
  await page.waitForTimeout(500);
  const step3Top = await page.evaluate(() => document.querySelector('#step-3').getBoundingClientRect().top);
  assert.ok(step3Top >= 55 && step3Top < 200, `3단계 위치 ${step3Top}`);
  result.anchors = { stepTop, step3Top };

  await context.close();
  await browser.close();

  assert.deepStrictEqual(errors, [], `콘솔 오류: ${errors.join(' | ')}`);
  fs.writeFileSync(path.join(out, 'check.json'), JSON.stringify(result, null, 2));
  console.log(`통과: 포에버 ${result.pages.length}화면, 리테일 메뉴 ${result.nav.length}폭, 토글 이동 ${result.toggle.length}건 → ${out}`);
})().catch(error => { console.error(error); process.exit(1); });
