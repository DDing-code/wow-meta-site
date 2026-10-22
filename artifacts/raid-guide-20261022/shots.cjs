// 레이드 가이드(/raid) 화면 확인. 빌드본을 4418 포트로 띄워(또는 인자로 받은 origin에서) 5편을 1440·390·320px로 열고
// 화면 오류·가로 넘침·글자 넘침·상단 메뉴 표시·탭 5개·네임드 수·툴팁 링크 수를 세고 캡처한다.
// 사용: node shots.cjs [origin]   결과: shots/*.png, shots/check.json
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');

const SITE = path.resolve(__dirname, '../..');
const OUT = path.join(__dirname, 'shots');
const guide = JSON.parse(fs.readFileSync(path.join(SITE, 'src/data/raidGuide.json'), 'utf8'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

function serveBuild(port) {
  const root = path.join(SITE, 'build');
  const server = http.createServer((req, res) => {
    let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(resolve => server.listen(port, () => resolve(server)));
}

(async () => {
  let base = process.argv[2];
  const server = base ? null : await serveBuild(4418);
  if (!base) base = 'http://localhost:4418';
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  const fullShots = new Set(['kithix', 'coiled-altar']);
  for (const episode of guide.episodes) {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${base}/raid/${episode.id}`, { waitUntil: 'networkidle' });
      await page.waitForSelector(`#${episode.bosses[0].id}`);
      const info = await page.evaluate(expected => {
        const nowrapOverflow = Array.from(document.querySelectorAll('a, span, b, h1, h2, h3, h4, dt, dd, p, li'))
          .filter(el => getComputedStyle(el).whiteSpace === 'nowrap' && el.scrollWidth > el.clientWidth + 1)
          .map(el => `${el.tagName.toLowerCase()}:${el.textContent.trim().slice(0, 30)}`);
        return {
          navActive: document.querySelector('nav a[aria-current="page"]')?.textContent.trim() || '',
          tabs: document.querySelectorAll('nav[aria-label="레이드 편 선택"] a').length,
          activeTab: document.querySelector('nav[aria-label="레이드 편 선택"] a[aria-current="page"]')?.textContent.trim() || '',
          bosses: document.querySelectorAll('section[data-boss]').length,
          steps: document.querySelectorAll('li[data-kind]').length,
          tips: document.querySelectorAll('[data-tips] > li').length,
          terms: document.querySelectorAll('a[data-term-id]').length,
          spellChips: document.querySelectorAll('[data-spell-id]').length,
          brokenImages: Array.from(document.images).filter(img => img.complete && img.naturalWidth === 0).length,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          nowrapOverflow,
          height: document.documentElement.scrollHeight,
          expectedBosses: expected,
        };
      }, episode.bosses.length);
      const row = { episode: episode.id, width, errors, ...info };
      row.ok = !errors.length && info.navActive.includes('레이드 가이드') && info.tabs === 5 && info.activeTab.includes(episode.label)
        && info.bosses === episode.bosses.length && !info.overflow && !info.nowrapOverflow.length && info.brokenImages === 0
        && info.tips === episode.bosses.reduce((n, b) => n + b.tips.length, 0);
      results.push(row);
      if (width === 1440 || fullShots.has(episode.id)) {
        await page.screenshot({ path: path.join(OUT, `${episode.id}-${width}-top.png`) });
        if (fullShots.has(episode.id) || width === 1440) await page.screenshot({ path: path.join(OUT, `${episode.id}-${width}-full.png`), fullPage: true });
      }
      await page.close();
    }
  }
  // 탭을 눌러 편을 바꾸면 주소가 바뀌고 새 편의 네임드가 보인다. 목차를 누르면 그 네임드로 이동한다.
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}/raid`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#kithix');
    await page.getByRole('link', { name: /울라텍/ }).first().click();
    await page.waitForURL('**/raid/ulatek');
    await page.waitForSelector('#ulatek');
    const scrolledTop = await page.evaluate(() => window.scrollY === 0);
    await page.goto(`${base}/raid/venomous-1-6`, { waitUntil: 'networkidle' });
    await page.locator('nav[aria-label="이 편의 네임드"] a[href="#vashnik"]').click();
    await page.waitForFunction(() => { const y = document.getElementById('vashnik').getBoundingClientRect().top; return y >= 40 && y < 300; });
    await page.screenshot({ path: path.join(OUT, 'venomous-1-6-1440-vashnik.png') });
    // 툴팁 링크에 마우스를 올리면 Wowhead 툴팁 스크립트가 붙인다(네트워크 환경에 따라 다를 수 있어 통과 조건에는 넣지 않는다).
    await page.goto(`${base}/raid/coiled-altar`, { waitUntil: 'networkidle' });
    const term = page.locator('a[data-term-id="1285643"]').first();
    await term.scrollIntoViewIfNeeded();
    await term.hover();
    await page.waitForTimeout(1500);
    const tooltip = await page.evaluate(() => !!document.querySelector('.wowhead-tooltip, [class*="wowhead-tooltip"]'));
    await page.screenshot({ path: path.join(OUT, 'coiled-altar-1440-hover.png') });
    results.push({ check: 'interaction', errors, tabSwitchScrolledTop: scrolledTop, tocJump: true, wowheadTooltipShown: tooltip, ok: !errors.length && scrolledTop });
    await page.close();
  }
  await browser.close();
  if (server) server.close();
  fs.writeFileSync(path.join(OUT, 'check.json'), JSON.stringify({ base, when: new Date().toISOString(), results }, null, 2));
  const failed = results.filter(r => !r.ok);
  console.log(`${results.length - failed.length}/${results.length} 통과`);
  for (const r of results) console.log(r.ok ? '통과' : '실패', r.episode || r.check, r.width || '', r.errors.length ? r.errors : '', r.nowrapOverflow?.length ? r.nowrapOverflow : '', r.overflow ? '가로 넘침' : '', r.wowheadTooltipShown !== undefined ? `툴팁 ${r.wowheadTooltipShown}` : '');
  process.exit(failed.length ? 1 : 0);
})();
