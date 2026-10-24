// 운영 사이트에서 이번 변경(기준 영웅 탭·새 단일 흐름·×n 배지)이 보이는지 확인: node live-text.cjs <origin>
const {chromium} = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const {loadRegistry} = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
const CHECKS = [
  ['druid-balance', '반복 흐름 — 단일 (숲의 수호자 기준)', '숲의 수호자'],
  ['monk-windwalker', '반복 흐름 — 단일 (천신의 대변자 기준)', '천신의 대변자', 0],
  ['warlock-affliction', '지옥소환사 단일 오프닝 전투 흐름', '지옥소환사'],
  ['demonhunter-devourer', '풀링 1초 전', '공허상흔'],
];
(async () => {
  const base = process.argv[2];
  const reg = loadRegistry();
  const browser = await chromium.launch();
  let bad = 0;
  for (const [id, text, hero, minBadges = 1] of CHECKS) {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    await page.goto(base + reg.find(s => s.id === id).path, {waitUntil: 'networkidle'});
    await page.waitForSelector('[data-book-part]');
    const r = await page.evaluate(() => ({
      text: document.body.innerText,
      badges: document.querySelectorAll('[data-timeline-count], [data-step-count]').length,
      hero: [...document.querySelectorAll('[role="group"]')].find(g => g.getAttribute('aria-label') === '영웅 특성 선택')?.querySelector('[aria-pressed="true"]')?.textContent.trim() || '',
    }));
    const ok = r.text.includes(text) && r.badges >= minBadges && r.hero.includes(hero);
    if (!ok) bad++;
    console.log(id, ok ? '보임' : '안 보임', `글 ${r.text.includes(text)} · 배지 ${r.badges} · 첫 탭 ${r.hero}`);
    await page.close();
  }
  await browser.close();
  process.exitCode = bad ? 1 : 0;
})();
