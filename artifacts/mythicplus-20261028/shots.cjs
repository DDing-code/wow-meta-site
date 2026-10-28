// 쐐기 가이드 눈 확인용 화면 찍기. TEST_ORIGIN(빌드본 서버 또는 운영 주소)에 붙는다.
// 사용: TEST_ORIGIN=http://127.0.0.1:4428 node artifacts/mythicplus-20261028/shots.cjs [출력 폴더 이름=shots]
// 검사: 콘솔 오류·페이지 오류 0, 가로 넘침 0, 던전마다 탭 8개·풀링 카드 수·네임드 수·그림 응답(404 없음).
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const ORIGIN = process.env.TEST_ORIGIN || 'http://127.0.0.1:4428';
const OUT = path.join(__dirname, process.argv[2] || 'shots');
const guide = require('../../src/data/mythicPlusGuide.json');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const report = [];
  let failed = 0;
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const context = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await context.newPage();
    const errors = [];
    const missing = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(ORIGIN)) missing.push(`${response.status()} ${response.url()}`); });
    const targets = ['', '/altar-of-fangs', '/kings-rest', '/ruby-life-pools'];
    for (const id of targets) {
      await page.goto(`${ORIGIN}/mythicplus${id}`, { waitUntil: 'networkidle' });
      const dungeonId = id.replace('/', '') || guide.dungeons[0].id;
      const dungeon = guide.dungeons.find(item => item.id === dungeonId);
      const facts = await page.evaluate(() => ({
        tabs: document.querySelectorAll('nav[aria-label="쐐기 던전 선택"] a').length,
        pulls: document.querySelectorAll('[data-pull]').length,
        bosses: document.querySelectorAll('section[data-boss]').length,
        diagrams: document.querySelectorAll('[data-steps] figure[data-figure]').length,
        terms: document.querySelectorAll('a[data-term-id]').length,
        video: !!document.querySelector('[data-video]'),
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        height: document.body.scrollHeight,
        title: document.title,
      }));
      // 접힌 몹 설명 하나를 펼쳐 찍는다(첫 풀링).
      await page.evaluate(() => { const d = document.querySelector('details[data-new-mobs]'); if (d) d.open = true; });
      const name = `${w}-${dungeonId}`;
      await page.screenshot({ path: path.join(OUT, `${name}-top.png`) });
      await page.screenshot({ path: path.join(OUT, `${name}-full.png`), fullPage: true });
      const ok = facts.tabs === 8 && facts.pulls === dungeon.pulls.length && facts.bosses === dungeon.bosses.length
        && facts.diagrams === dungeon.bosses.reduce((sum, boss) => sum + boss.steps.filter(step => step.figure).length, 0) && !facts.overflow;
      if (!ok) failed++;
      report.push({ name, ok, ...facts, expectedPulls: dungeon.pulls.length, expectedBosses: dungeon.bosses.length });
    }
    // 홈 줄과 상단 메뉴
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    const home = await page.evaluate(() => ({
      shelf: document.querySelectorAll('[data-shelf="mythicplus"] li').length,
      nav: !!Array.from(document.querySelectorAll('nav a')).find(a => a.textContent.includes('쐐기 가이드')),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    }));
    if (!home.nav || home.shelf < 1 || home.overflow) failed++;
    report.push({ name: `${w}-home`, ...home });
    await page.screenshot({ path: path.join(OUT, `${w}-home-full.png`), fullPage: true });
    if (errors.length) { failed++; report.push({ name: `${w}-errors`, errors }); }
    if (missing.length) { failed++; report.push({ name: `${w}-missing`, missing: missing.slice(0, 20) }); }
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 1));
  console.log(failed ? `문제 ${failed}건` : '문제 0건');
  process.exit(failed ? 1 : 0);
})();
