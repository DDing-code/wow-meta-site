// 2026-10-23 '한 명이 급락하면' → '한 명을 살리려면' 문구 교체 확인.
// 힐러 가이드 5개에서 새 문구가 보이는 곳을 찾아 캡처하고, 예전 문구가 남았는지 센다.
// 사용: node shots.cjs [origin]   origin 이 없으면 build/ 를 4418 포트로 띄워서 본다. 결과: shots/ (운영 주소를 주면 live/)
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');

const SITE = path.resolve(__dirname, '../..');
const OUT = path.join(__dirname, process.argv[2] ? 'live' : 'shots');
const GUIDES = ['/guide/druid/restoration', '/guide/evoker/preservation', '/guide/monk/mistweaver', '/guide/priest/discipline', '/guide/priest/holy'];
const NEW = /한 명을 살리려면|한 명을 살려야 하면/;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webp': 'image/webp' };

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
  for (const url of GUIDES) {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 } });
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(base + url, { waitUntil: 'networkidle' });
      await page.waitForSelector('article, main', { timeout: 20000 });
      // 접힌 '조건·예외' 상자를 모두 열어 숨은 글도 센다.
      await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
      const info = await page.evaluate(src => {
        const re = new RegExp(src);
        const text = document.body.innerText;
        const hits = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = walker.nextNode())) {
          const el = n.parentElement;
          const block = el.closest('p, li, figure, [class*="cycle"], [class*="Cycle"], div');
          if (re.test(block?.innerText || '') && !hits.includes(block)) hits.push(block);
        }
        // 가장 안쪽 상자만 남긴다.
        const inner = hits.filter(h => !hits.some(o => o !== h && h.contains(o)));
        inner.forEach((el, i) => el.setAttribute('data-shot', String(i)));
        return { oldCount: (text.match(/급락하면/g) || []).length, newCount: (text.match(new RegExp(src, 'g')) || []).length, blocks: inner.length };
      }, NEW.source);
      const id = url.split('/').slice(2).join('-');
      for (let i = 0; i < info.blocks; i++) {
        const loc = page.locator(`[data-shot="${i}"]`);
        await loc.scrollIntoViewIfNeeded();
        await loc.screenshot({ path: path.join(OUT, `${id}-${width}-${i}.png`) });
      }
      results.push({ url, width, errors, ...info, ok: !errors.length && info.oldCount === 0 });
      await page.close();
    }
  }
  await browser.close();
  if (server) server.close();
  fs.writeFileSync(path.join(OUT, 'check.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
})();
