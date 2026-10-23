// 사이트맵의 모든 주소(63개)를 열어 화면 글(접힌 곳 포함 textContent)에 '사용자 확인·결정·요청·지정…' 같은 내부 작업 표시가 없는지 보고,
// 바뀐 곳을 1440px로 캡처한다.   사용: node check.cjs [origin] [출력 폴더]
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const SITE = path.resolve(__dirname, '../..');
const OUT = path.join(__dirname, process.argv[3] || 'shots');
const MARK = /사용자 ?(확인|결정|요청|지정|정정|지시|확정|지적|원칙)|사용자가 (정한|보낸|확인)/g;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.xml': 'application/xml' };
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
const SHOTS = [
  ['/raid/nymrissa', '갈리는 택틱', 'raid-nymrissa-choices'],
  ['/raid/nymrissa', '얼음 구슬 9개 처리', 'raid-nymrissa-orbs'],
  ['/raid/venomous-1-6', '나마 → 게보 → 이쿠.', 'raid-explorers-choice'],
  ['/raid', '이 글이 고른 방식', 'raid-basis-notes'],
];
(async () => {
  let base = process.argv[2];
  const server = base ? null : await serveBuild(4422);
  if (!base) base = 'http://localhost:4422';
  fs.mkdirSync(OUT, { recursive: true });
  const urls = fs.readFileSync(path.join(SITE, 'public/sitemap.xml'), 'utf8').match(/https:\/\/wowmeta\.vercel\.app[^<]*/g).map(u => u.replace('https://wowmeta.vercel.app', ''));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  const hits = [];
  for (const u of urls) {
    await page.goto(base + (u || '/'), { waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.textContent);
    const m = text.match(MARK);
    if (m) hits.push({ url: u || '/', marks: [...new Set(m)] });
  }
  const shots = [];
  for (const [u, text, name] of SHOTS) {
    await page.goto(base + u, { waitUntil: 'networkidle' });
    const el = page.getByText(text, { exact: false }).first();
    await el.evaluate(n => n.scrollIntoView({ block: 'center' })); await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, name + '.png') });
    shots.push(name);
  }
  // 포식 가이드 근거 목록(접힌 곳일 수 있음)에서 바뀐 문장 확인
  await page.goto(base + '/guide/demonhunter/devourer', { waitUntil: 'networkidle' });
  const dev = await page.evaluate(() => document.body.textContent.includes('풀링 순서 확정(2026-10-22): 포식 오프닝 시작을'));
  await page.goto(base + '/guide/monk/brewmaster', { waitUntil: 'networkidle' });
  const brew = await page.evaluate(() => document.body.textContent.includes('최신 메타 후속(2026-10-20): 특성 견본을'));
  await browser.close(); if (server) server.close();
  const result = { pages: urls.length, hits, errors: errors.slice(0, 5), devourerEvidence: dev, brewmasterEvidence: brew, shots };
  console.log(JSON.stringify(result, null, 1));
  process.exit(!hits.length && !errors.length && dev && brew ? 0 : 1);
})();
