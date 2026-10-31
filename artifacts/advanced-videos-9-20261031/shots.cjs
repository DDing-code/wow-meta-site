// 심화편을 붙인 9개 가이드의 영상 칸(기본편·심화편 단추)을 찍고, 단추를 눌러 영상 번호가 바뀌는지와 가로 넘침을 센다.
// 사용: node shots.cjs [origin=http://127.0.0.1:4419]   (SHOTS_DIR=live 로 운영 주소 결과를 따로 저장)
// 1440·390은 9개 모두, 320은 이름이 가장 긴 냉기 죽음의 기사만 찍는다.
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:4419';
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
const uploads = JSON.parse(fs.readFileSync('F:/01_프로젝트/90_개발/ai-hub/workspace/outputs/pixel-guides/youtube-upload-advanced-9-20261031.json', 'utf8'));
const basics = Object.fromEntries(JSON.parse(fs.readFileSync('F:/01_프로젝트/90_개발/ai-hub/workspace/outputs/pixel-guides/youtube-manifest.json', 'utf8')).map(x => [x.id, x]));
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const up of uploads) {
    const id = up.id.replace(/-advanced$/, '');
    const basic = basics[id];
    const route = new URL(basic.description).pathname;
    for (const width of id === 'deathknight-frost' ? [1440, 390, 320] : [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#guide-video iframe');
      await page.waitForTimeout(1500);
      const src = () => page.evaluate(() => document.querySelector('#guide-video iframe').getAttribute('src'));
      const shot = async name => {
        const loc = page.locator('#guide-video');
        await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
        const file = path.join(out, `${id}-${width}-${name}.png`);
        await loc.screenshot({ path: file });
        return file;
      };
      const r = { id, width, errors, files: [] };
      r.basicSrc = await src();
      if (width === 1440 || id === 'deathknight-frost') r.files.push(await shot('basic'));
      await page.locator('#guide-video button[data-video-kind="advanced"]').click();
      await page.waitForTimeout(600);
      r.advancedSrc = await src();
      r.caption = await page.evaluate(() => document.querySelector('#guide-video iframe').getAttribute('title'));
      r.files.push(await shot('advanced'));
      r.scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      r.ok = r.basicSrc.includes(basic.youtubeId) && r.advancedSrc.includes(up.youtubeId) && r.caption === up.title && !errors.length && r.scrollWidth <= width;
      results.push(r);
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'shots.json'), JSON.stringify(results, null, 2));
  console.log(results.map(r => `${r.ok ? '통과' : '실패'} ${r.id} ${r.width} ${r.scrollWidth}${r.errors.length ? ' 오류 ' + r.errors.length : ''}`).join('\n'));
  if (!results.every(r => r.ok)) process.exit(1);
})();
