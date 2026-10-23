// 레이드 가이드 출처에서 인벤·글쓴이 닉네임을 뺀 것을 빌드본(또는 인자 origin)에서 확인한다.
// 사용: node shots.cjs [origin] [출력 폴더]   기본 origin은 serve.cjs(5079)
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const base = process.argv[2] || 'http://localhost:5079';
const OUT = path.join(__dirname, process.argv[3] || 'shots');
const BANNED = ['인벤', 'inven', '이당이당', '레키엘', '애기트럴', 'Lucide', '동그란기린', '극려'];
const EPISODES = ['kithix', 'nymrissa', 'venomous-1-6', 'coiled-altar', 'ulatek'];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    for (const ep of EPISODES) {
      await page.goto(`${base}/raid/${ep}`, { waitUntil: 'networkidle' });
      // 접힌 글(기준과 한계 등)도 펼쳐서 본다.
      await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
      const html = await page.evaluate(() => document.body.innerText + ' ' + [...document.querySelectorAll('a[href]')].map(a => a.href).join(' '));
      results.push({ width, ep, left: BANNED.filter(w => html.includes(w)) });
    }
    const shot = async (ep, locate, name) => {
      await page.goto(`${base}/raid/${ep}`, { waitUntil: 'networkidle' });
      const el = await locate(page);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await el.screenshot({ path: path.join(OUT, `${name}-${width}.png`) });
    };
    await shot('kithix', p => p.locator('[data-choice="공격 쿨기 시점"]').first(), 'kithix-choice');
    await shot('ulatek', p => p.locator('[data-choice="송곳니 해제"]').first().locator('xpath=..'), 'ulatek-choices');
    await shot('ulatek', p => p.locator('h3,h4,div', { hasText: /^근거$/ }).last().locator('xpath=following-sibling::*[1]'), 'ulatek-sources');
    if (width === 1440) {
      await page.goto(`${base}/raid/kithix`, { waitUntil: 'networkidle' });
      const notes = page.locator('li', { hasText: '신화 킬 공대들의 실전 글' }).first().locator('xpath=..');
      await notes.scrollIntoViewIfNeeded();
      await notes.screenshot({ path: path.join(OUT, `page-notes-${width}.png`) });
      await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
      const basis = page.locator('li', { hasText: '출처에는 상위 공대와 공개 공략 이름만' }).first().locator('xpath=ancestor::*[self::details or self::section][1]');
      await basis.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await basis.screenshot({ path: path.join(OUT, `basis-sources-${width}.png`) });
    }
    results.push({ width, errors });
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify(results));
  const bad = results.filter(r => (r.left && r.left.length) || (r.errors && r.errors.length));
  if (bad.length) { console.error('FAIL', JSON.stringify(bad)); process.exit(1); }
  console.log('ok');
})();
