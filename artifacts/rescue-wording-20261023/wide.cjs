// 회복 드루이드 딜사이클 가지 이름표 주변을 넓게 찍는다. 사용: node wide.cjs (build/ 를 4419 포트로 띄움)
const fs = require('node:fs'); const http = require('node:http'); const path = require('node:path');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const root = path.resolve(__dirname, '../../build');
const server = http.createServer((req, res) => { let f = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(root, 'index.html'); res.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : f.endsWith('.html') ? 'text/html' : 'application/octet-stream' }); fs.createReadStream(f).pipe(res); });
server.listen(4419, async () => {
  const browser = await chromium.launch();
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('http://localhost:4419/guide/druid/restoration', { waitUntil: 'networkidle' });
    const h = page.getByText('한 명을 살리려면 먼저').first();
    await h.scrollIntoViewIfNeeded();
    const box = await h.evaluate(el => { let p = el; for (let i = 0; i < 8 && p.parentElement; i++) { p = p.parentElement; if (p.getBoundingClientRect().width > 330) break; } p.setAttribute('data-wide', '1'); return p.getBoundingClientRect().width; });
    await page.locator('[data-wide="1"]').screenshot({ path: path.join(__dirname, 'shots', `druid-restoration-${width}-cycle.png`) });
    await page.close();
  }
  await browser.close(); server.close();
});
