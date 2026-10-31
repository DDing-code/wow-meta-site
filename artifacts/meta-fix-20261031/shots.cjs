// 고친 11개 가이드를 1440·390px로 열어 '참고한 자료·주의할 점'에 새 문장이 보이는지, 오류·가로 넘침을 센다.
// 사용: node shots.cjs [origin=http://127.0.0.1:4419]   (SHOTS_DIR=live 로 운영 주소 결과를 따로 저장)
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:4419';
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
fs.mkdirSync(out, { recursive: true });
const PAGES = {
  'druid/feral': '야성의 모든 공격력이 5%만큼 증가',
  'druid/restoration': '신속한 치유 연마가 신속한 치유의 치유량을 40%만큼',
  'hunter/marksmanship': '도탄 공격력을 85%만큼 증가',
  'mage/fire': '화염의 모든 공격력이 5%만큼 증가',
  'rogue/subtlety': '모든 능력의 공격력이 8%만큼 감소',
  'warlock/affliction': '불안정한 고통의 공격력이 20%만큼 증가',
  'warlock/destruction': '불의 비의 공격력이 20%만큼 증가',
  'monk/windwalker': '단일 견본은 2026-10-24에 신화 스조라크',
  'druid/balance': '기본 탭과 단일 견본은 2026-10-24에',
  'demonhunter/devourer': '10월 28일 이후 기록 39행만 보면',
  'hunter/survival': '아웃랜드 맹독 재검토',
};
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const [route, needle] of Object.entries(PAGES)) for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}/guide/${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const li = page.locator('li', { hasText: needle }).first();
    const found = await li.count();
    let file = null, icons = 0;
    if (found) {
      await li.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
      icons = await li.locator('img').count();
      file = path.join(out, `${route.replace('/', '-')}-${width}.png`);
      await li.screenshot({ path: file });
    }
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const r = { route, width, found: !!found, icons, errors, scrollWidth, ok: !!found && !errors.length && scrollWidth <= width, file };
    results.push(r);
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(results, null, 2));
  const bad = results.filter(r => !r.ok);
  results.forEach(r => console.log(`${r.ok ? '통과' : '실패'} ${r.route} ${r.width} 찾음=${r.found} 아이콘=${r.icons} 폭=${r.scrollWidth} 오류=${r.errors.length}`));
  console.log(bad.length ? `문제 ${bad.length}건` : '문제 0건');
  process.exit(bad.length ? 1 : 0);
})();
