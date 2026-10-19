// 6라운드 공개 확인: 공개 파일 해시가 로컬 build와 같은지, 목록 화면 공사 중 개수, '네임드'로 바뀐 문구 3곳, 해제 가이드 배지.
// 사용: node artifacts/goal-12.1.5-r6/public-check.cjs <origin> [폴더 이름]   결과: <폴더>/*.png, <폴더>/check.json
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));

const [base = 'https://wowmeta.vercel.app', dirName = 'public'] = process.argv.slice(2);
const out = path.join(__dirname, dirName);
fs.mkdirSync(out, { recursive: true });
const root = path.resolve(__dirname, '../..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const sha = buf => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16);
const PHRASES = [
  { id: 'evoker-devastation', path: '/guide/evoker/devastation', text: '단일 네임드는 비늘사령관' },
  { id: 'hunter-marksmanship', path: '/guide/hunter/marksmanship', text: '네임드가 머무를 위치에 사용' },
  { id: 'paladin-protection', path: '/guide/paladin/protection', text: '레이드는 네임드에게 실제로 붙어' },
];

(async () => {
  const result = { base, checkedAt: new Date().toISOString(), files: [], list: [], phrases: [] };
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'build/asset-manifest.json'), 'utf8'));
  const mainJs = manifest.files['main.js'].replace(/^\//, '');
  const files = ['index.html', 'asset-manifest.json', 'assets/spec-icons-white-v1.png', `${mainJs}.LICENSE.txt`, ...Object.values(manifest.files).filter(f => !/\.map$/.test(f)).map(f => f.replace(/^\//, ''))];
  for (const file of [...new Set(files)]) {
    const local = sha(fs.readFileSync(path.join(root, 'build', file)));
    const res = await fetch(`${base}/${file}?v=${Date.now()}`);
    const remote = sha(Buffer.from(await res.arrayBuffer()));
    result.files.push({ file, status: res.status, local, remote, same: local === remote });
  }
  const mapRes = await fetch(`${base}/${manifest.files['main.js'].replace(/^\//, '')}.map`);
  const mapBody = await mapRes.text();
  // 없는 경로는 index.html로 돌아오므로 상태 번호가 아니라 내용으로 소스맵인지 본다.
  result.sourceMap = { status: mapRes.status, isSourceMap: /^\s*\{\s*"version"/.test(mapBody) };
  result.sourceMapStatus = `${mapRes.status}${result.sourceMap.isSourceMap ? ' 소스맵 노출' : ' 소스맵 아님'}`;
  result.bundle = manifest.files['main.js'];

  const browser = await chromium.launch();
  for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, userAgent: UA });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}/guide`, { waitUntil: 'networkidle' });
    const info = await page.evaluate(() => {
      const notice = [...document.querySelectorAll('main *')].find(el => [...el.childNodes].some(n => n.nodeType === 3 && /전환·검수 중/.test(n.textContent)));
      const cards = [...document.querySelectorAll('a[href^="/guide/"]')];
      const partial = cards.filter(a => a.querySelector('svg.lucide-construction'));
      return {
        notice: notice ? notice.textContent.trim() : null,
        cards: cards.length,
        construction: partial.length,
        partialPaths: partial.map(a => a.getAttribute('href')),
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        bundle: [...document.scripts].map(s => s.src).find(s => /main\.[0-9a-f]+\.js/.test(s)) || null,
      };
    });
    await page.screenshot({ path: path.join(out, `list-${width}.png`), fullPage: width !== 1440 ? false : true });
    result.list.push({ width, ...info, errors });
    await page.close();
  }
  for (const item of PHRASES) {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, userAgent: UA });
      await page.goto(`${base}${item.path}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-book-part]');
      const loc = page.locator('main p, main li, main div').filter({ hasText: item.text }).last();
      const found = await loc.count();
      let badge = null;
      if (found) {
        await loc.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await loc.evaluate(el => { el.style.outline = '3px solid #ff0'; });
        await page.screenshot({ path: path.join(out, `${item.id}-${width}-named.png`) });
      }
      badge = await page.evaluate(() => document.body.innerText.match(/12\.1\.5[^\n]{0,24}/)?.[0] || null);
      const text = await page.evaluate(() => document.querySelector('main').innerText);
      result.phrases.push({ id: item.id, width, text: item.text, found: Boolean(found), boss: (text.match(/보스/g) || []).length, named: (text.match(/네임드/g) || []).length, badge });
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'check.json'), JSON.stringify(result, null, 2));
  console.log(`번들 ${result.bundle} · 소스맵 ${result.sourceMapStatus} · 파일 일치 ${result.files.filter(f => f.same).length}/${result.files.length}`);
  result.list.forEach(l => console.log(`목록 ${l.width}px · 카드 ${l.cards} · 공사 중 ${l.construction} · 안내 "${l.notice}" · 넘침 ${l.overflow} · 오류 ${l.errors.length}`));
  result.phrases.forEach(p => console.log(`${p.id} ${p.width}px · 문구 ${p.found ? '보임' : '없음'} · 보스 ${p.boss} · 네임드 ${p.named} · 배지 ${p.badge}`));
})().catch(error => { console.error(error); process.exit(1); });
