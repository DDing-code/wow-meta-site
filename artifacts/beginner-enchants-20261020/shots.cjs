// 빌드본(build/)을 4437에서 띄워 초보자 페이지 마법부여 목록을 320·390·1440px로 찍고 가로 넘침·깨진 아이콘·화면 오류를 센다.
// 사용: node artifacts/beginner-enchants-20261020/shots.cjs
const path = require('path');
const fs = require('fs');
const http = require('http');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const root = path.resolve(__dirname, '..', '..', 'build');
const out = path.join(__dirname, 'shots');
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4437, '127.0.0.1', resolve));
  const browser = await chromium.launch();
  const results = [];
  for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, userAgent: UA });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto('http://127.0.0.1:4437/beginner', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-item-group="enchants-weapon"]');
    const r = { width, errors, shots: [] };
    for (const id of ['enchants-weapon', 'enchants-ring', 'enchants-helm', 'enchants-legs', 'enchants-scope']) {
      const el = page.locator(`[data-item-group="${id}"]`);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const file = path.join(out, `${width}-${id}.png`);
      await el.screenshot({ path: file });
      r.shots.push(file);
    }
    await page.fill('#beginner-search', '마부');
    await page.waitForTimeout(300);
    r.searchStatus = await page.locator('[role="status"]').textContent();
    await page.evaluate(() => window.scrollTo(0, 0));
    const top = path.join(out, `${width}-search-mabu-top.png`);
    await page.screenshot({ path: top });
    r.shots.push(top);
    await page.fill('#beginner-search', '');
    await page.waitForTimeout(300);
    await page.evaluate(() => Promise.all([...document.querySelectorAll('[data-item-group^="enchants-"] img')].map(img => { img.loading = 'eager'; return img.complete ? 0 : new Promise(done => { img.onload = img.onerror = done; }); })));
    Object.assign(r, await page.evaluate(() => {
      const vw = window.innerWidth;
      const groups = [...document.querySelectorAll('[data-item-group^="enchants-"]')];
      const imgs = groups.flatMap(g => [...g.querySelectorAll('img')]);
      const links = groups.flatMap(g => [...g.querySelectorAll('[data-item-id]')]);
      return {
        enchantItems: links.length,
        brokenIcons: imgs.filter(img => !img.naturalWidth).map(img => img.src),
        wide: groups.flatMap(g => [...g.querySelectorAll('*')]).filter(el => { const b = el.getBoundingClientRect(); return b.width && (b.right > vw + 1 || b.left < -1); }).map(el => el.textContent.trim().slice(0, 30)),
        textOverflow: links.filter(a => a.scrollWidth > a.clientWidth + 1).map(a => a.textContent.trim().slice(0, 30)),
        scrollWidth: document.documentElement.scrollWidth,
      };
    }));
    results.push(r);
    await page.close();
  }
  await browser.close();
  server.close();
  fs.writeFileSync(path.join(__dirname, 'ui-check.json'), JSON.stringify(results, null, 2) + '\n');
  for (const r of results) console.log(r.width, 'items', r.enchantItems, 'broken', r.brokenIcons.length, 'wide', r.wide.length, 'textOverflow', r.textOverflow.length, 'scrollWidth', r.scrollWidth, 'errors', r.errors.length, '|', r.searchStatus);
})().catch(error => { console.error(error); server.close(); process.exit(1); });
