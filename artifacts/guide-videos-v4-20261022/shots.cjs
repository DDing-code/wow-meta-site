// 2026-10-22 새 판(native-alpha-v4) 26편 주소로 바꾼 뒤 같은 확인을 다시 돈다. 원본: ../guide-videos-20261022/shots.cjs
// 딜러 26편(와우메타 채널) + 악마 흑마 글 상단 영상 확인.
// 27개 가이드에서 iframe 번호·채널 표시·가로 넘침을 세고, 대표 화면(화염 마법사 1440·390·320, 냉기 죽기 1440)을 캡처한다.
// 영상이 없어야 하는 가이드(탱커·힐러 예시)도 확인한다.
// 사용: node shots.cjs [origin]   origin 이 없으면 build/ 를 4417 포트로 띄워서 본다. 결과: shots/*.png, shots/check.json
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');

const SITE = path.resolve(__dirname, '../..');
const OUT = path.join(__dirname, 'shots');
const MANIFEST = 'F:/01_프로젝트/90_개발/ai-hub/workspace/outputs/pixel-guides/youtube-manifest.json';
const items = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const guides = items.map(x => ({ id: x.id, url: new URL(x.description.trim()).pathname, youtubeId: x.youtubeId, channel: 'wowmeta 와우메타' }));
guides.push({ id: 'warlock-demonology', url: '/guide/warlock/demonology', youtubeId: 'siB3vmyt0W0', channel: '띵진이' });
const NO_VIDEO = ['/guide/warrior/protection', '/guide/priest/holy', '/guide/evoker/preservation'];
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
  const server = base ? null : await serveBuild(4417);
  if (!base) base = 'http://localhost:4417';
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  const shots = { 'mage-fire': [1440, 390, 320], 'deathknight-frost': [1440] };
  for (const g of guides) {
    for (const width of shots[g.id] || [1440]) {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(base + g.url, { waitUntil: 'networkidle' });
      await page.waitForSelector('#guide-video iframe', { timeout: 20000 });
      const info = await page.evaluate(() => {
        const sec = document.querySelector('#guide-video');
        const frame = sec.querySelector('iframe').getBoundingClientRect();
        return {
          firstInArticle: sec.parentElement.firstElementChild === sec,
          src: sec.querySelector('iframe').src,
          ratio: +(frame.width / frame.height).toFixed(2),
          channel: sec.querySelector('small')?.textContent || '',
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          navLink: !!document.querySelector('a[href="#guide-video"]'),
        };
      });
      const row = { id: g.id, width, errors, ...info };
      row.ok = !errors.length && info.firstInArticle && info.src.includes(`/embed/${g.youtubeId}`) && info.channel === g.channel && !info.overflow && info.navLink && Math.abs(info.ratio - 1.78) < 0.03;
      if (shots[g.id]) {
        await page.screenshot({ path: path.join(OUT, `${g.id}-${width}-top.png`) });
        await page.locator('#guide-video').screenshot({ path: path.join(OUT, `${g.id}-${width}-video.png`) });
      }
      results.push(row);
      await page.close();
    }
  }
  for (const url of NO_VIDEO) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(base + url, { waitUntil: 'networkidle' });
    await page.waitForSelector('article, main', { timeout: 20000 });
    const count = await page.locator('#guide-video').count();
    results.push({ url, hasVideo: count, ok: count === 0 });
    await page.close();
  }
  await browser.close();
  if (server) server.close();
  fs.writeFileSync(path.join(OUT, 'check.json'), JSON.stringify(results, null, 2) + '\n');
  const bad = results.filter(r => !r.ok);
  console.log(JSON.stringify({ base, checked: results.length, bad }, null, 2));
  assert.equal(bad.length, 0);
})();
