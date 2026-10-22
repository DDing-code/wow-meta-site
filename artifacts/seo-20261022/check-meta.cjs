// 빌드본(또는 ORIGIN 주소)에서 페이지별 제목·설명·대표 주소·robots 태그를 확인한다.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const build = path.resolve(__dirname, '../../build');
const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.xml': 'application/xml', '.txt': 'text/plain', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json' };
async function main() {
  let origin = process.env.ORIGIN;
  let server;
  if (!origin) {
    server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      let file = path.join(build, url);
      if (!file.startsWith(build) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(build, 'index.html');
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    await new Promise(resolve => server.listen(4471, resolve));
    origin = 'http://127.0.0.1:4471';
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const cases = [
    ['/', /와우 .* 전문화 가이드/, 'https://wowmeta.vercel.app/'],
    ['/guide/warlock/demonology', /악마 흑마법사 가이드/, 'https://wowmeta.vercel.app/guide/warlock/demonology'],
    ['/guide/warrior/protection', /방어 전사 가이드/, 'https://wowmeta.vercel.app/guide/warrior/protection'],
    ['/raid/ulatek', /울라텍 신화 공략/, 'https://wowmeta.vercel.app/raid/ulatek'],
    ['/beginner', /초보자 안내/, 'https://wowmeta.vercel.app/beginner'],
    ['/guide/priest/holy/log-analysis', /조나사제/, 'https://wowmeta.vercel.app/guide/priest/holy/log-analysis'],
  ];
  const rows = [];
  for (const [route, title, canonical] of cases) {
    await page.goto(origin + route, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('link[rel="canonical"]'));
    const got = await page.evaluate(() => ({
      title: document.title,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      description: document.querySelector('meta[name="description"]')?.content,
      robots: document.querySelector('meta[name="robots"]')?.content,
      descriptionTags: document.querySelectorAll('meta[name="description"]').length,
    }));
    assert.match(got.title, title, route);
    assert.equal(got.canonical, canonical, route);
    assert.equal(got.robots, 'index, follow', route);
    assert.equal(got.descriptionTags, 1, route);
    rows.push({ route, ...got });
  }
  for (const file of ['/robots.txt', '/sitemap.xml']) {
    const res = await page.request.get(origin + file);
    const text = await res.text();
    assert(!text.includes('<div id="root">'), `${file} returns the app shell`);
    rows.push({ route: file, status: res.status(), type: res.headers()['content-type'], head: text.slice(0, 60) });
  }
  console.log(JSON.stringify(rows, null, 1));
  await browser.close();
  if (server) server.close();
}
main().catch(error => { console.error(error); process.exit(1); });
