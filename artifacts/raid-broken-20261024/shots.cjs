// 2026-10-24: 탐험가 물고기 강화 짝 3장과 울라텍 마지막 단계(raidplan Broken 지도) 3장을 빌드본(또는 인자 origin)에서 1440·390px로 캡처하고 확인한다.
// 사용: node shots.cjs [origin]   결과: shots/*.png, shots/check.json
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const SITE = path.resolve(__dirname, '../..');
const OUT = path.join(__dirname, process.argv[3] || 'shots');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
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
const CASES = [
  { id: 'venomous-1-6', title: '물고기는 나마 → 게보 → 이쿠', img: '03-venomous-1-6-11', expect: '물고기 ① 나마' },
  { id: 'venomous-1-6', title: '버섯을 아껴 두기', img: '03-venomous-1-6-12', expect: '물고기 ② 게보' },
  { id: 'venomous-1-6', title: '반대 속성 바닥에서 풀기', img: '03-venomous-1-6-13', expect: '물고기 ③ 이쿠' },
  { id: 'ulatek', title: '물어뜯기 조', img: '05-ulatek-12', expect: '첫 조각' },
  { id: 'ulatek', title: '화살표는 공대 반대로', img: '05-ulatek-13', expect: '조각 가장자리' },
  { id: 'ulatek', title: '마지막 단상별 할 일', img: '05-ulatek-14', expect: '부서진 단상' },
];
(async () => {
  let base = process.argv[2];
  const server = base ? null : await serveBuild(4419);
  if (!base) base = 'http://localhost:4419';
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  for (const c of CASES) for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}/raid/${c.id}`, { waitUntil: 'networkidle' });
    const step = page.locator('li[data-kind]', { hasText: c.title }).first();
    await step.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const info = await step.evaluate((el, img) => {
      const im = el.querySelector('img');
      return { text: el.innerText.slice(0, 200), src: im?.currentSrc || '', loaded: !!im && im.complete && im.naturalWidth > 0, hasImg: (im?.currentSrc || '').includes(img) };
    }, c.img);
    info.hasCaption = info.text.includes(c.expect);
    const bodyText = await page.evaluate(() => document.body.innerText);
    info.oldWordCount = (bodyText.match(/겹침/g) || []).length;
    await step.screenshot({ path: path.join(OUT, `${c.img}-${width}.png`) });
    results.push({ id: c.img, width, errors, ...info, ok: info.loaded && info.hasImg && info.hasCaption && !errors.length && info.oldWordCount === 0 });
    await page.close();
  }
  await browser.close();
  if (server) server.close();
  fs.writeFileSync(path.join(OUT, 'check.json'), JSON.stringify(results, null, 2));
  console.log(results.map(r => `${r.ok ? 'OK  ' : 'FAIL'} ${r.id} ${r.width} img=${r.hasImg}/${r.loaded} 설명=${r.hasCaption} 겹침=${r.oldWordCount} ${r.errors.join(';')}`).join('\n'));
  process.exit(results.every(r => r.ok) ? 0 : 1);
})();
